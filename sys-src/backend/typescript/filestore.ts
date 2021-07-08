import fs from "fs";
import sevenZip from "7zip-min";
import {dateToString} from "./util";
import rimraf from "rimraf";
import createLock from "./lock";

const filesFolder = "./data";
const archiveFolder = "./archive";
const filesTempFolder = "./data_temp";
const lastUpdateFileName = filesFolder + "/last_update.txt";
const cache = new Map<string, any>();

const waitForLock = createLock();

/**
 * Gets the desired data from either cache or a file.
 * If the data is not present in these formats it will be regenerated
 * using the functions provided.
 * @param path A file name to identify the desired data.
 * @param fetchDataCallback Gets called if the data needs to be regenerated.
 * @param transformData Gets called to transform a string (read from file) to the desired object structure.
 * @returns The data in the desired object structure.
 */
export default function getFromCache<T>(
    path: string,
    fetchDataCallback: () => Promise<string>,
    transformData: (text: string) => Promise<T>
): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        let lockFinishedAlreadyCalled = false;
        waitForLock((lockFinished) => {
            getFromCacheInternal<T>(path, fetchDataCallback, transformData, () => {
                if (!lockFinishedAlreadyCalled) {
                    lockFinished();
                }
                lockFinishedAlreadyCalled = true;
            })
                .then((t) => {
                    if (!lockFinishedAlreadyCalled) {
                        lockFinished();
                    }
                    lockFinishedAlreadyCalled = true;
                    resolve(t);
                })
                .catch((e) => {
                    if (!lockFinishedAlreadyCalled) {
                        lockFinished();
                    }
                    lockFinishedAlreadyCalled = true;
                    reject(e);
                });
        });
    });
}

function getFromCacheInternal<T>(
    path: string,
    fetchDataCallback: () => Promise<string>,
    transformData: (text: string) => Promise<T>,
    lockFinished: () => void
): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        ensureFolder(archiveFolder, reject, () => {
            ensureFolder(filesFolder, reject, () => {
                const archiveDate = new Date(Date.parse(dateToString(new Date())));

                fs.readFile(lastUpdateFileName, (err, data) => {
                    if (err) {
                        fs.writeFile(
                            lastUpdateFileName,
                            dateToString(archiveDate),
                            (err) => {
                                if (err) {
                                    reject(err);
                                }
                            }
                        );
                        lockFinished();
                        handleLoading(
                            path,
                            fetchDataCallback,
                            transformData,
                            resolve,
                            reject
                        );
                    } else {
                        const lastArchiveDate = new Date(Date.parse(data.toString()));
                        if (lastArchiveDate < archiveDate && new Date().getHours() >= 5) {
                            // Make sure RKI has enough time to publish new data (4 hours were not enough)

                            cache.clear();
                            // Now force garbage collection because having twice the data will crash the server
                            try {
                                if (global.gc) {
                                    global.gc();
                                    console.log("garbage collection forced");
                                } else {
                                    console.log("please start node with flag --expose-gc");
                                }
                            } catch (e) {
                                console.log("severe error running garbage collection", e);
                            }
                            rimraf(filesTempFolder, (err) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                fs.rename(filesFolder, filesTempFolder, (err) => {
                                    if (err) {
                                        console.log('cannot rename', err);
                                    }
                                    ensureFolder(filesFolder, reject, () => {
                                        sevenZip.pack(
                                            filesTempFolder,
                                            `${archiveFolder}/data_${dateToString(archiveDate)}.7z`,
                                            (err) => {
                                                if (err) {
                                                    reject(err);
                                                }
                                                fs.writeFile(
                                                    lastUpdateFileName,
                                                    dateToString(archiveDate),
                                                    (err) => {
                                                        if (err) {
                                                            reject(err);
                                                        }
                                                    }
                                                );
                                            }
                                        );
                                        lockFinished();
                                        handleLoading(
                                            path,
                                            fetchDataCallback,
                                            transformData,
                                            resolve,
                                            reject
                                        );
                                    });
                                });
                            });
                        } else {
                            lockFinished();
                            handleLoading(
                                path,
                                fetchDataCallback,
                                transformData,
                                resolve,
                                reject
                            );
                        }
                    }
                });
            });
        });
    });
}

function handleLoading<T>(
    path: string,
    fetchDataCallback: () => Promise<string>,
    transformData: (text: string) => Promise<T>,
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason?: any) => void
): void {
    if (cache && cache.has(path)) {
        resolve(cache.get(path));
    } else {
        const filePath = `${filesFolder}/${path}`;
        fs.readFile(filePath, (err, data) => {
            if (err) {
                fetchDataCallback()
                    .then((data) => {
                        fs.writeFile(filePath, data, (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                transformData(data)
                                    .then((transformed) => {
                                        cache.set(path, transformed);
                                        resolve(transformed);
                                    })
                                    .catch(reject);
                            }
                        });
                    })
                    .catch(reject);
            } else {
                transformData(data.toString())
                    .then((transformed) => {
                        cache.set(path, transformed);
                        resolve(transformed);
                    })
                    .catch(reject);
            }
        });
    }
}

function ensureFolder(
    path: string,
    reject: (a: any) => void,
    next: () => void
): void {
    fs.mkdir(
        path,
        {
            recursive: true,
        },
        (err) => {
            if (err) {
                reject(err);
            } else {
                next();
            }
        }
    );
}


/**
 * Use for unit tests only!
 */
export const testables = {
    forceClearCache: function() {
        cache.clear();
    }
}

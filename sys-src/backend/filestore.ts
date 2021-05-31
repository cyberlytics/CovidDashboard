import fs from "fs";

const filesFolder = './data';
const cache = new Map<string, any>();

export default function getFromCache<T>(path: string, fetchDataCallback: () => Promise<string>, transformData: (text: string) => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        if (cache && cache.has(path)) {
            resolve(cache.get(path));
        }
        else {
            const filePath = `${filesFolder}/${path}`;
            fs.mkdir(filesFolder, {
                recursive: true,
            }, (err) => {
                if (err) reject(err);
            });
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    fetchDataCallback()
                        .then(data => {
                            fs.writeFile(filePath, data, (err) => {
                                reject(err);
                            });
                            transformData(data)
                                .then(transformed => {
                                    cache.set(path, transformed);
                                    resolve(transformed);
                                })
                                .catch(reject);
                        })
                        .catch(reject);
                }
                else {
                    transformData(data.toString())
                        .then(transformed => {
                            cache.set(path, transformed);
                            resolve(transformed);
                        })
                        .catch(reject);
                }
            });
        }
    });
}
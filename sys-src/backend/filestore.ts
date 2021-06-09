import fs from "fs";
import sevenZip from "7zip-min";
import { dateToString } from "./util";

const filesFolder = "./data";
const archiveFolder = "./archive";
const filesTempFolder = "./data_temp";
const lastUpdateFileName = filesFolder + '/last_update.txt';
const cache = new Map<string, any>();

export default function getFromCache<T>(
  path: string,
  fetchDataCallback: () => Promise<string>,
  transformData: (text: string) => Promise<T>
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    ensureFolder(archiveFolder, reject);
    ensureFolder(filesFolder, reject);

    const archiveDate = new Date(Date.parse(dateToString(new Date())));

    fs.readFile(lastUpdateFileName, (err, data) => {
      if (err) {
        fs.writeFile(lastUpdateFileName, dateToString(archiveDate), (err) => {
          if (err) {
            reject(err);
          }
        });
        handleLoading();
      }
      else {
        const lastArchiveDate = new Date(Date.parse(data.toString()));
        if (lastArchiveDate < archiveDate && new Date().getHours() > 4) { // Make sure RKI has enough time to publish new data
          cache.clear();
          fs.rm(filesTempFolder, {
            force: true,
            recursive: true,
          }, (err) => {
            if (err) {
              reject(err);
            }
            fs.rename(filesFolder, filesTempFolder, (err) => {
              ensureFolder(filesFolder, reject);
              if (err) {
                reject(err);
              }
              sevenZip.pack(filesTempFolder,
                `${archiveFolder}/data_${dateToString(archiveDate)}.7z`,
                err => {
                  if (err) {
                    reject(err);
                  }
                  fs.writeFile(lastUpdateFileName, dateToString(archiveDate), (err) => {
                    if (err) {
                      reject(err);
                    }
                  });
                });
              handleLoading();
            });
          });
        }
        else {
          handleLoading();
        }
      }
    });

    function handleLoading() {
      if (cache && cache.has(path)) {
        resolve(cache.get(path));
      } else {
        const filePath = `${filesFolder}/${path}`;
        fs.readFile(filePath, (err, data) => {
          if (err) {
            fetchDataCallback()
              .then((data) => {
                fs.writeFile(filePath, data, (err) => {
                  reject(err);
                });
                transformData(data)
                  .then((transformed) => {
                    cache.set(path, transformed);
                    resolve(transformed);
                  })
                  .catch(reject);
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

  });
}

function ensureFolder(path: string, reject: (a: any) => void): void {
  fs.mkdir(
    path,
    {
      recursive: true,
    },
    (err) => {
      if (err) {
        reject(err);
      }
    }
  );
}

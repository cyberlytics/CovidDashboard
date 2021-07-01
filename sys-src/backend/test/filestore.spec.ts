import assert from "assert";
import fs from "fs";
import getFromCache, { testables } from "../typescript/filestore";
import { parse, stringify } from "../typescript/util";

type TestType = {
    text: string;
    length: number;
    map: Map<number, Map<number, string>>;
};

const testFileName = 'test.txt';
const testFilePath = './data/' + testFileName;
const lastUpdateFilePath = './data/last_update.txt';

function generateDefaultData(): TestType {
    return {
        text: 'lorem ipsum dolor sit amet',
        length: 0xBADA55,
        map: new Map<number, Map<number, string>>([
            [-5, new Map<number, string>([
                [0, 'zero'],
                [1, 'one'],
                [2, 'two'],
            ])],

            [7.5, new Map<number, string>([
                [3, 'three'],
                [4, 'four'],
                [5, 'five'],
            ])],

            [15, new Map<number, string>([
                [6, 'six'],
                [8, 'eight'], // :)
                [7, 'seven'],
            ])],
        ])
    };
}

describe("Filestore", () => {
    afterEach((done) => {
        fs.rm(testFilePath, () => {
            fs.rm(lastUpdateFilePath, () => {
                done();
            });
        });
    });
    beforeEach((done) => {
        // Force a cache refresh
        testables.forceClearCache();
        // Remove file if it exists
        fs.rm(testFilePath, () => done());
    });

    it("should generate a file if it does not exist", (done) => {
        getFromCache<TestType>(
            'test.txt',
            () => {
                return new Promise((resolve, reject) => {
                    resolve(
                        stringify(generateDefaultData())
                    );
                });
            },
            (t) => {
                return new Promise((resolve, reject) => {
                    resolve(
                        parse(t)
                    );
                })
            }
        )
            .catch(assert.fail)
            .then(data => {
                assert.deepStrictEqual(
                    data,
                    generateDefaultData()
                );
                done();
            });
    });

    it("should fail if fetchData promise gets rejected", (done) => {
        getFromCache<TestType>(
            'test.txt',
            () => {
                return new Promise((resolve, reject) => {
                    reject('intentional');
                });
            },
            (t) => {
                return new Promise((resolve, reject) => {
                    // this line must not be called
                    assert.fail();
                })
            }
        )
            .catch(e => {
                assert.deepStrictEqual(e, 'intentional');
                done();
            })
            .then(data => {
                // this line must not be called
                assert.fail();
            });
    });

    it("should fail if transformData promise gets rejected", (done) => {
        getFromCache<TestType>(
            'test.txt',
            () => {
                return new Promise((resolve, reject) => {
                    resolve(
                        stringify(generateDefaultData())
                    );
                });
            },
            (t) => {
                return new Promise((resolve, reject) => {
                    reject('intentional');
                })
            }
        )
            .catch(e => {
                assert.deepStrictEqual(e, 'intentional');
                done();
            })
            .then(data => {
                // this line must not be called
                assert.fail();
            });
    });

    it("should regenerate the data if last update was more than a day ago", (done) => {
        getFromCache<TestType>(
            'test.txt',
            () => {
                return new Promise((resolve, reject) => {
                    resolve(
                        stringify(generateDefaultData())
                    );
                });
            },
            (t) => {
                return new Promise((resolve, reject) => {
                    resolve(
                        parse(t)
                    );
                })
            }
        )
            .catch(assert.fail)
            .then(data => {
                assert.deepStrictEqual(
                    data,
                    generateDefaultData()
                );

                // Now change last update to something a few days ago
                fs.writeFile(
                    lastUpdateFilePath,
                    '2020-01-01',
                    (err) => {
                        if (err) assert.fail(err);
                        getFromCache<TestType>(
                            'test.txt',
                            () => {
                                return new Promise((resolve, reject) => {
                                    reject('intentional');
                                });
                            },
                            (t) => {
                                return new Promise((resolve, reject) => {
                                    // this line must not be called
                                    assert.fail();
                                })
                            }
                        )
                            .catch(e => {
                                assert.deepStrictEqual(e, 'intentional');
                                done();
                            })
                            .then(data => {
                                // this line must not be called
                                assert.fail();
                            });
                    });
            });
    });

    it("should load the data from file if cache got cleared and last update was today", (done) => {
        getFromCache<TestType>(
            'test.txt',
            () => {
                return new Promise((resolve, reject) => {
                    resolve(
                        stringify(generateDefaultData())
                    );
                });
            },
            (t) => {
                return new Promise((resolve, reject) => {
                    resolve(
                        parse(t)
                    );
                })
            }
        )
            .catch(assert.fail)
            .then(data => {
                assert.deepStrictEqual(
                    data,
                    generateDefaultData()
                );

                // Now clear cache
                testables.forceClearCache();

                getFromCache<TestType>(
                    'test.txt',
                    () => {
                        return new Promise((resolve, reject) => {
                            // this line must not be called
                            assert.fail();
                        });
                    },
                    (t) => {
                        return new Promise((resolve, reject) => {
                            resolve(
                                parse(t)
                            );
                        })
                    }
                )
                    .catch(assert.fail)
                    .then(data => {
                        assert.deepStrictEqual(
                            data,
                            generateDefaultData()
                        );
                        done();
                    });
            });
    });

    it("should return the data from cache if available and last update was today", (done) => {
        getFromCache<TestType>(
            'test.txt',
            () => {
                return new Promise((resolve, reject) => {
                    resolve(
                        stringify(generateDefaultData())
                    );
                });
            },
            (t) => {
                return new Promise((resolve, reject) => {
                    resolve(
                        parse(t)
                    );
                })
            }
        )
            .catch(assert.fail)
            .then(data => {
                assert.deepStrictEqual(
                    data,
                    generateDefaultData()
                );

                getFromCache<TestType>(
                    'test.txt',
                    () => {
                        return new Promise((resolve, reject) => {
                            // this line must not be called
                            assert.fail();
                        });
                    },
                    (t) => {
                        return new Promise((resolve, reject) => {
                            // this line must not be called
                            assert.fail();
                        })
                    }
                )
                    .catch(assert.fail)
                    .then(data => {
                        assert.deepStrictEqual(
                            data,
                            generateDefaultData()
                        );
                        done();
                    });
            });
    });
});
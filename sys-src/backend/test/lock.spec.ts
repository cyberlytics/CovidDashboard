import assert from "assert";
import createLock from "../typescript/lock";

describe("Lock", () => {
    it("should lock access to one execution task", (done) => {
        const waitForLock = createLock(10);
        const iterations = 200;
        const waitFactor = 50;

        const executed = new Array<number>();
        for (let n = 0; n < iterations; n++) {
            const waitTime = Math.ceil(Math.random() * waitFactor);
            waitForLock((finished) => {
                //console.log(`doing some stuff ${n}, waiting ${waitTime}ms`);
                setTimeout(() => {
                    //console.log(`finished ${n}`);
                    executed.push(n);
                    finished();
                }, waitTime);
            });
        }

        const checkEnd = () => {
            if (executed.length === iterations) {
                done();
            }
            else {
                setTimeout(checkEnd, waitFactor);
            }
        }

        // wait some more time
        setTimeout(checkEnd, iterations * waitFactor + 100);
    })
        .timeout(100_000);  // 100 Seconds because this test may run long

    it("should not lock access to two different execution tasks", (done) => {
        const waitForLock1 = createLock();
        const waitForLock2 = createLock(50);

        const waitTime1 = 1000;
        const waitTime2 = 1100;
        const waitTimeOverall = 1500; // greater than waitTime1/2 but also less than waitTime1 + waitTime2

        const executed = new Array<number>();
        waitForLock1((finished) => {
            setTimeout(() => {
                executed.push(1);
                finished();
            }, waitTime1);
        });

        waitForLock2((finished) => {
            setTimeout(() => {
                executed.push(2);
                finished();
            }, waitTime2);
        });

        setTimeout(() => {
            if(executed.length === 2) {
                done();
            }
            else {
                assert.fail();
            }
        }, waitTimeOverall);
    })
        .timeout(10_000);
});
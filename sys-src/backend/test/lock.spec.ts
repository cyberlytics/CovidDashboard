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

});
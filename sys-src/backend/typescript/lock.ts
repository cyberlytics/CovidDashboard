/**
 * Creates a new lock to prevent multiple access to a resource.
 * @param retryTime The amount of milliseconds to wait until
 * retrying to get access to the resource.
 * @returns A new function that must be called to wait for the resource (if necessary).
 */
export default function createLock(
    retryTime = 100,
): (callback: (finished: () => void) => void) => void {
    let lock: boolean = false;
    const waitForLock = (callback: (finished: () => void) => void) => {
        if (lock) {
            setTimeout(() => waitForLock(callback), retryTime);
        } else {
            lock = true;
            //console.log('lock aquired');
            callback(() => {
                //console.log('lock removed');
                lock = false;
            });
        }
    }
    return waitForLock;
}
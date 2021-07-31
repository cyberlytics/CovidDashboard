/**
 * Serializes an arbitrary JavaScript object to a JSON string.
 * @param value The object to serialize.
 * @returns The JSON representation in form of a string.
 */
export function stringify(value: any): string {
    return JSON.stringify(value, (k, v) => {
        if (v instanceof Map) {
            return {
                dataType: "Map",
                value: Array.from(v.entries()),
            };
        } else {
            return v;
        }
    });
}

/**
 * Parses a JSON string that was generated by `stringify(...)`.
 * @param text The JSON string to parse.
 * @returns A new object or array representing the deserialized content of `text`.
 */
export function parse(text: string): any {
    return JSON.parse(text, (k, v) => {
        if (typeof v === "object" && v !== null) {
            if (v.dataType === "Map") {
                return new Map(v.value);
            }
        }
        return v;
    });
}

/**
 * Converts a Map object to an array to send it as a response.
 * Use this method as a normal Map object will not get
 * sent by Node.js properly.
 * @param map The map to convert to an array.
 * @returns A new array that contains all data from the original map.
 */
export function mapToObject(map: Map<any, any> | undefined): object {
    if (typeof map === "undefined") {
        return {};
    }
    return Array.from(map.entries());
}

/**
 * Remove the time component of a date and make it a UTC date.
 * @param date The date to convert.
 * @returns A new Date object that has no time component (0 o'clock UTC).
 */
export function getMidnightUTC(date: Date): Date {
    return new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
}

/**
 * Adds an arbitrary amount of days to date.
 * @param date The base-line Date to add days to.
 * @param days The amount of days to add to date. Can be negative.
 * @returns A new Date object that has no time component (0 o'clock UTC).
 */
export function addDays(date: Date, days: number): Date {
    return new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + days)
    );
}

/**
 * Parses a date given in the RKI format:
 * `YYYY/MM/DD HH:mm:SS+00`
 * @param date The date string.
 * @returns A Date object.
 */
export function parseRKIDate(date: string): Date {
    const s = date
        .split("/")
        .join("-")
        .split(" ")
        .join("T")
        .split("+00")
        .join("Z");
    return new Date(Date.parse(s));
}

/**
 * Picks the last element per inner map
 * and returns a new map that contains this
 * value per outer map key.
 * @param map The input map of maps.
 * @returns A new map that contains the last element per inner map.
 */
export function lastElementPerMap<T>(
    map: Map<number, Map<number, T>>
): Map<number, T> {
    const m = new Map<number, T>();
    map.forEach((v, key) => {
        let last: T | undefined = undefined;
        v.forEach((e) => (last = e));
        if (typeof last !== "undefined") {
            m.set(key, last);
        }
    });
    return m;
}

/**
 * Picks the penultimate and the last element per inner map
 * and returns a new map that contains an array of these two
 * values per outer map key.
 * @param map The input map of maps.
 * @returns A new map that contains the penultimate and the last element per inner map.
 */
export function last2ElementsPerMap<T>(
    map: Map<number, Map<number, T>>
): Map<number, [T, T]> {
    const m = new Map<number, [T, T]>();
    map.forEach((v, key) => {
        let last: T | undefined = undefined;
        let penultimate: T | undefined = undefined;
        v.forEach((e) => {
            penultimate = last;
            last = e;
        });
        if (typeof penultimate !== "undefined") {
            m.set(key, [penultimate, last!]);
        }
    });
    return m;
}

/**
 * Convert a Date object to a string and omit the time part.
 * @param date A Date object to convert to a string.
 * @returns A string that represents the Date param without time.
 */
export function dateToString(date: Date): string {
    return `${date.getFullYear().toString().padStart(4, "0")}-${(
        date.getMonth() + 1
    )
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

/**
 * Milliseconds per day.
 */
export const MS_PER_DAY = 1000 * 60 * 60 * 24;

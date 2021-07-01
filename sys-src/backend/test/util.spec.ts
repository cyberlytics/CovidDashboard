import assert from "assert";
import { addDays, dateToString, getMidnightUTC, last2ElementsPerMap, lastElementPerMap, mapToObject, MS_PER_DAY, parse, parseRKIDate, stringify } from "../typescript/util";


describe("Util", () => {
    it("should parse a stringified object", () => {
        const original = {
            "integer": 5,
            "float": 6.034,
            "map": new Map<number, string>([[1, "one"], [2, "two"], [3, "three"]]),
            "string": "hello"
        };
        const copy = parse(stringify(original));
        assert.deepStrictEqual(copy, original);
    });

    it("should return a map converted to an array", () => {
        const map = new Map<number, string>();
        map.set(0, "zero");
        map.set(1, "one");
        map.set(2, "two");
        map.set(3, "three");

        assert.deepStrictEqual(
            mapToObject(map),
            [
                [0, 'zero'],
                [1, 'one'],
                [2, 'two'],
                [3, 'three'],
            ]);
    });

    it("should return an empty object if map is undefined", () => {
        assert.deepStrictEqual(
            mapToObject(undefined),
            {});
    });

    it("should return a new Date set to midnight", () => {
        assert.deepStrictEqual(
            getMidnightUTC(new Date(Date.parse("2021-03-17T15:35:14.662Z"))),
            new Date(Date.parse("2021-03-17T00:00:00Z")));

        assert.deepStrictEqual(
            getMidnightUTC(new Date(Date.parse("2021-08-31T05:13:58.792Z"))),
            new Date(Date.parse("2021-08-31T00:00:00Z")));
    });

    const refDate = new Date();
    for (let n = -10; n <= 10; n++) {
        it(`should return a new Date ${n} days in the future`, () => {
            assert.deepStrictEqual(
                addDays(refDate, n).valueOf(),
                getMidnightUTC(refDate).valueOf() + n * MS_PER_DAY
            );
        });
    }

    it("should parse a Date string formatted by RKI", () => {
        assert.deepStrictEqual(
            parseRKIDate("2021/06/28 00:12:34+00"),
            new Date(Date.parse("2021-06-28T00:12:34Z")));

        assert.deepStrictEqual(
            parseRKIDate("2020/04/13 00:00:00+00"),
            new Date(Date.parse("2020-04-13T00:00:00Z")));
    });

    it("should return the last element and the last two elements in a map of maps", () => {
        const original = new Map<number, Map<number, string>>();
        original.set(0, new Map<number, string>([
            [0, 'zero'],
            [1, 'one'],
            [2, 'two'],
            [3, 'three'],
        ]));

        original.set(1, new Map<number, string>([
            [4, 'four'],
            [5, 'five'],
            [6, 'six'],
            [7, 'seven'],
        ]));

        original.set(2, new Map<number, string>([
            [8, 'eight'],
            [9, 'nine'],
            [10, 'ten'],
            [11, 'eleven'],
        ]));

        assert.deepStrictEqual(
            lastElementPerMap(original),
            new Map<number, string>([
                [0, 'three'],
                [1, 'seven'],
                [2, 'eleven'],
            ]));

        assert.deepStrictEqual(
            last2ElementsPerMap(original),
            new Map<number, [string, string]>([
                [0, ['two', 'three']],
                [1, ['six', 'seven']],
                [2, ['ten', 'eleven']],
            ]));
    });

    it("should return an empty map if there are no last or penultimate elements", () => {

        assert.deepStrictEqual(
            lastElementPerMap(new Map<number, Map<number, string>>()),
            new Map<number, string>());

        assert.deepStrictEqual(
            last2ElementsPerMap(new Map<number, Map<number, string>>()),
            new Map<number, [string, string]>());
    });

    it("should return the last element and the last two elements in a map of maps and omit empty entries", () => {
        const original = new Map<number, Map<number, string>>();
        original.set(0, new Map<number, string>([
            [0, 'zero'],
            [1, 'one'],
            [2, 'two'],
            [3, 'three'],
        ]));

        original.set(1, new Map<number, string>([   // only a single entry
            [4, 'four'],
        ]));

        original.set(2, new Map<number, string>()); // empty

        assert.deepStrictEqual(
            lastElementPerMap(original),
            new Map<number, string>([
                [0, 'three'],
                [1, 'four'],
            ]));

        assert.deepStrictEqual(
            last2ElementsPerMap(original),
            new Map<number, [string, string]>([
                [0, ['two', 'three']],
            ]));
    });

    it("should return a string that contains a date without a time", () => {
        assert.strictEqual(
            dateToString(new Date(Date.parse("2021-06-08T14:32:18.12Z"))),
            "2021-06-08");

        assert.strictEqual(
            dateToString(new Date(Date.parse("2020-03-29T07:19:49.87Z"))),
            "2020-03-29");
    });
});
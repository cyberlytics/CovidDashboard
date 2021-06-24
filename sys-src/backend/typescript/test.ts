import fs from "fs";
import { RKIData, vaccinationPerState } from "./rkiFetcher";
import { addDays, lastElementPerMap, parse } from "./util";

export function testIfBothAreEquivalent(): void {
  fs.readFile("./data/perCounty.json", (e1, d1) => {
    fs.readFile("./data_old/perCounty.json", (e2, d2) => {
      console.log("loaded both files");
      const dataCurrent = parse(d1.toString()) as Map<
        number,
        Map<number, RKIData>
      >;
      const dataOld = parse(d2.toString()) as Map<number, Map<number, RKIData>>;
      console.log("parsed both files");

      const keysCurrent = Array.from(dataCurrent.keys()).sort();
      const keysOld = Array.from(dataOld.keys()).sort();

      if (keysCurrent.length != keysOld.length)
        console.log("different key length");
      keysCurrent.forEach((key, i) => {
        if (keysOld[i] === undefined) console.log("undefined old", i);
        if (keysOld[i] !== key) console.log("different key", i);
      });
      console.log("---###---");

      let differingCount = 0;
      keysCurrent.forEach((k) => {
        const historyDataCurrent = dataCurrent.get(k)!;
        const historyDataOld = dataOld.get(k)!;

        // We now have more data (beginning with 2020-01-01 per county)
        //if(historyDataCurrent.size !== historyDataOld.size) console.log('different data size', k, historyDataCurrent.size, historyDataOld.size);
        if (historyDataCurrent.size < historyDataOld.size)
          console.log(
            "less data now",
            k,
            historyDataCurrent.size,
            historyDataOld.size
          );

        historyDataOld.forEach((rkiData, date) => {
          const MS_PER_DAY = 1000 * 60 * 60 * 24;
          // we shifted one full day back
          if (!historyDataCurrent.has(date - MS_PER_DAY))
            console.log("date-key not found", date);
          else {
            const currentRKIData = historyDataCurrent.get(date - MS_PER_DAY)!;
            let identical: boolean = true;
            for (const prop in rkiData) {
              if ((prop as keyof RKIData) === "Date") continue;
              if (Object.prototype.hasOwnProperty.call(rkiData, prop)) {
                const vOld = rkiData[prop as keyof RKIData];
                const vCurrent = currentRKIData[prop as keyof RKIData];
                if (vOld !== vCurrent) {
                  identical = false;
                  break;
                }
              }
            }
            if (!identical) {
              if (
                rkiData.Incidence7 === -1 &&
                new Date(Date.parse(rkiData.Date as any as string)) <
                  new Date(Date.parse("2020-04-01T00:00:00Z"))
              ) {
                // Ignore this false positive here, because previously the 7-days-incidence could not be calculated for the very first days
              } else if (
                rkiData.StateId === 0 &&
                rkiData.CountyId === 0 &&
                rkiData.Population < 83_100_000
              ) {
                // Data for whole Germany; Ignore if population is not the full population of Germany
              } else {
                console.log(
                  "different RKIData entries",
                  date,
                  currentRKIData,
                  rkiData
                );
                differingCount++;
              }
            }
          }
        });
      });
      console.log("#(differing entries):", differingCount);

      console.log("---end---");
    });
  });
}

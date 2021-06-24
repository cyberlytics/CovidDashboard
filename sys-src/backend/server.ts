import express from "express";
import bodyParser from "body-parser";
import {
  dataPerCounty,
  getNames,
  RKIData,
  vaccinationPerState,
} from "./typescript/rkiFetcher";
import {
  last2ElementsPerMap,
  lastElementPerMap,
  mapToObject,
  parse,
  stringify,
} from "./typescript/util";
import { testIfBothAreEquivalent } from "./typescript/test";

const compression = require("compression");
const cors = require("cors");

const app = express();

// Types
type IncidencesDiff = {
  DeltaDeaths: number;
  DeltaIncidence7: number;
  DeltaRecovered: number;
  DeltaTotalCases: number;
};

type VaccinesDiff = {
  DeltaSumVaccinations: number;
  DeltaSumFirstVaccinations: number;
  DeltaSumSecondVaccinations: number;
  DeltaProportionFirstVaccinations: number;
  DeltaProportionSecondVaccinations: number;
  DeltaSumFirstBioNTech: number;
  DeltaSumSecondBioNTech: number;
  DeltaSumFirstAstraZeneca: number;
  DeltaSumSecondAstraZeneca: number;
  DeltaSumFirstModerna: number;
  DeltaSumSecondModerna: number;
  DeltaSumBioNTech: number;
  DeltaSumAstraZeneca: number;
  DeltaSumModerna: number;
  DeltaSumJohnsonAndJohnson: number;
};

// CORS
app.use(cors());

// Bodyparser
app.use(bodyParser.json());

// Compress all responses
app.use(compression());

app.get("/api/incidences/:county(\\d+)", (req, res, next) => {
  dataPerCounty()
    .then((d) => {
      const id = parseInt((req.params as any).county);
      res.send(mapToObject(d.get(id)));
      next();
    })
    .catch((err) => console.log("error:", err));
});

app.get("/api/incidences", (req, res, next) => {
  dataPerCounty()
    .then((d) => {
      getNames().then((n) => {
        const incidences = lastElementPerMap(d);
        const data = new Map<number, RKIData & { County: string }>();
        incidences.forEach((v, countyId) => {
          // parse(stringify(XXX)) => make copy of XXX
          const e = parse(stringify(v)) as RKIData & { County: string };
          e.County = n.Counties.get(v.CountyId)!;
          data.set(countyId, e);
        });
        res.send(mapToObject(data));
        next();
      });
    })
    .catch((err) => console.log("error:", err));
});

app.get("/api/incidences/diff", (req, res, next) => {
  dataPerCounty()
    .then((d) => {
      getNames().then((n) => {
        const incidences = last2ElementsPerMap(d);
        const data = new Map<number, IncidencesDiff>();
        incidences.forEach(([penultimate, last], countyId) => {
          data.set(countyId, {
            DeltaDeaths: last.Deaths - penultimate.Deaths,
            DeltaIncidence7: last.Incidence7 - penultimate.Incidence7,
            DeltaRecovered: last.Recovered - penultimate.Recovered,
            DeltaTotalCases: last.TotalCases - penultimate.TotalCases,
          });
        });
        res.send(mapToObject(data));
        next();
      });
    })
    .catch((err) => console.log("error:", err));
});

app.get("/api/counties", (req, res, next) => {
  getNames()
    .then((n) => {
      res.send(mapToObject(n.Counties));
      next();
    })
    .catch((err) => console.log("error:", err));
});

app.get("/api/vaccines/:state(\\d+)", (req, res, next) => {
  vaccinationPerState()
    .then((v) => {
      const id = parseInt((req.params as any).state);
      res.send(mapToObject(v.get(id)));
      next();
    })
    .catch((err) => console.log("error:", err));
});

app.get("/api/vaccines", (req, res, next) => {
  vaccinationPerState()
    .then((v) => {
      res.send(mapToObject(lastElementPerMap(v)));
      next();
    })
    .catch((err) => console.log("error:", err));
});

app.get("/api/vaccines/diff", (req, res, next) => {
  vaccinationPerState()
    .then((v) => {
      const vaccines = last2ElementsPerMap(v);
      const data = new Map<number, VaccinesDiff>();
      vaccines.forEach(([penultimate, last], stateId) => {
        data.set(stateId, {
          DeltaSumVaccinations:
            last.SumVaccinations - penultimate.SumVaccinations,
          DeltaSumFirstVaccinations:
            last.SumFirstVaccinations - penultimate.SumFirstVaccinations,
          DeltaSumSecondVaccinations:
            last.SumSecondVaccinations - penultimate.SumSecondVaccinations,
          DeltaProportionFirstVaccinations:
            last.ProportionFirstVaccinations -
            penultimate.ProportionFirstVaccinations,
          DeltaProportionSecondVaccinations:
            last.ProportionSecondVaccinations -
            penultimate.ProportionSecondVaccinations,
          DeltaSumFirstBioNTech:
            last.SumFirstBioNTech - penultimate.SumFirstBioNTech,
          DeltaSumSecondBioNTech:
            last.SumSecondBioNTech - penultimate.SumSecondBioNTech,
          DeltaSumFirstAstraZeneca:
            last.SumFirstAstraZeneca - penultimate.SumFirstAstraZeneca,
          DeltaSumSecondAstraZeneca:
            last.SumSecondAstraZeneca - penultimate.SumSecondAstraZeneca,
          DeltaSumFirstModerna:
            last.SumFirstModerna - penultimate.SumFirstModerna,
          DeltaSumSecondModerna:
            last.SumSecondModerna - penultimate.SumSecondModerna,
          DeltaSumBioNTech: last.SumBioNTech - penultimate.SumBioNTech,
          DeltaSumAstraZeneca: last.SumAstraZeneca - penultimate.SumAstraZeneca,
          DeltaSumModerna: last.SumModerna - penultimate.SumModerna,
          DeltaSumJohnsonAndJohnson:
            last.SumJohnsonAndJohnson - penultimate.SumJohnsonAndJohnson,
        });
      });
      res.send(mapToObject(data));
      next();
    })
    .catch((err) => console.log("error:", err));
});

app.get("/api/summary", (req, res, next) => {
  dataPerCounty()
    .then((d) => {
      vaccinationPerState()
        .then((v) => {
          res.send({
            incidence: d.get(0)!.get(Math.max(...d.get(0)!.keys())),
            vaccines: v.get(0)!.get(Math.max(...v.get(0)!.keys())),
          });
          next();
        })
        .catch((err) => console.log("error:", err));
    })
    .catch((err) => console.log("error:", err));
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));

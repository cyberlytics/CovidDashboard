import express from "express";
import bodyParser from "body-parser";
import {
  dataPerCounty,
  getNames,
  RKIData,
  vaccinationPerState,
} from "./backend/rkiFetcher";
import { lastElementPerMap, mapToObject } from "./backend/util";

const cors = require("cors");
const app = express();

app.use(cors());

// Bodyparser Middleware
app.use(bodyParser.json());

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
        incidences.forEach((v) => {
          const e = v as RKIData & { State: string };
          e.State = n.Counties.get(v.CountyId)!;
        });
        res.send(mapToObject(incidences));
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

app.get("/api/summary", (req, res, next) => {
  dataPerCounty().then((d) => {
    vaccinationPerState().then((v) => {
      res.send({
        incidence: d.get(0)!.get(Math.max(...d.get(0)!.keys())),
        vaccines: v.get(0)!.get(Math.max(...v.get(0)!.keys())),
      });
      next();
    });
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));

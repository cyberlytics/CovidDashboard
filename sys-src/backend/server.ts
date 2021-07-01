import express from "express";
import bodyParser from "body-parser";
import {dataPerCounty, dataPerCountyDiff, getNames, RKIData, vaccinationPerState, vaccinationPerStateDiff,} from "./typescript/rkiFetcher";
import {lastElementPerMap, mapToObject, parse, stringify,} from "./typescript/util";

const compression = require("compression");
const cors = require("cors");

const app = express();

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
    dataPerCountyDiff()
        .then(diff => {
            res.send(mapToObject(diff));
            next();
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
    vaccinationPerStateDiff()
        .then(diff => {
            res.send(mapToObject(diff));
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

app.get("/api/summary/diff", (req, res, next) => {
    dataPerCountyDiff()
        .then(iDiff => {
            vaccinationPerStateDiff()
                .then(vDiff => {
                    res.send({
                        incidence: iDiff.get(0)!,
                        vaccines: vDiff.get(0)!,
                    });
                    next();
                })
                .catch((err) => console.log("error:", err));
        })
        .catch((err) => console.log("error:", err));
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));

import express from "express";
import bodyParser from "body-parser";
import { dataPerCounty, getNames, RKIData, RKIVaccinationData, vaccinationPerState } from "./backend/rkiFetcher";
import { lastDays, lastElementPerMap, mapToObject, stringify } from "./backend/util";

const app = express();

// Bodyparser Middleware
app.use(bodyParser.json(), function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");

    // Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Pass to next layer of middleware
    next();
});

app.get('/incidences/:county(\\d+)', (req, res, next) => {
    dataPerCounty().then(d => {
        const id = parseInt((req.params as any).county);
        res.send(mapToObject(d.get(id)));
        next();
    }).catch(err => console.log('error:', err));
});

app.get('/incidences', (req, res, next) => {
    dataPerCounty().then(d => {
        getNames().then(n => {
            const incidences = lastElementPerMap(d);
            incidences.forEach(v => {
                const e = v as RKIData & { State: string; };
                e.State = n.Counties.get(v.CountyId)!;
            });
            res.send(mapToObject(incidences));
            next();
        });
    }).catch(err => console.log('error:', err));
});

app.get('/counties', (req, res, next) => {
    getNames().then(n => {
        res.send(mapToObject(n.Counties));
        next();
    }).catch(err => console.log('error:', err));
});

app.get('/vaccines/:state(\\d+)', (req, res, next) => {
    vaccinationPerState().then(v => {
        const id = parseInt((req.params as any).state);
        res.send(mapToObject(v.get(id)));
        next();
    }).catch(err => console.log('error:', err));
});

app.get('/vaccines', (req, res, next) => {
    vaccinationPerState().then(v => {
        res.send(mapToObject(lastElementPerMap(v)));
        next();
    }).catch(err => console.log('error:', err));;
});

app.get('/summary', (req, res, next) => {
    dataPerCounty().then(d => {
        vaccinationPerState().then(v => {
            res.send({
                incidence: d.get(0)!.get(Math.max(...d.get(0)!.keys())),
                vaccines: v.get(0)!.get(Math.max(...v.get(0)!.keys())),
            });
            next();
        });
    });
});



const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

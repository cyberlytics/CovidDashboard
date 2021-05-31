import express from "express";
import bodyParser from "body-parser";
import { dataPerCounty, getNames } from "./backend/rkiFetcher";
import { mapToObject, stringify } from "./backend/util";

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

app.get('/:landkreis(\\d+)', (req, res, next) => {
    dataPerCounty().then(d => {
        const id = parseInt((req.params as any).landkreis);
        if(id === 0) {
            getNames().then(n => {
                res.send(mapToObject(n.Counties));
                next();
            })
            .catch(err => console.log('error:', err));
        }
        else {
            res.send(mapToObject(d.get(id)));
            next();
        }
    })
        .catch(err => console.log('error:', err));
});



const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

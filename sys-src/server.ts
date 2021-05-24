import express from "express";
import bodyParser from "body-parser";
import { dataPerCounty } from "./backend/rkiFetcher";

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
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
});

app.get('/:landkreis(\\d+)', (req, res, next) => {
    dataPerCounty().then(d => {
        res.send(d[req.params.landkreis]);
        next();
    })
        .catch(err => console.log('error:', err));
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

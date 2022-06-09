const express = require("express");
const http = require("http");
const https = require('https');
const fs = require('fs');

var options = {
    key: fs.readFileSync("./ssl/privkey.pem"),
    cert: fs.readFileSync("./ssl/fullchain.pem")
};

const app = express();
const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);
const httpSocket = require("socket.io")(httpServer, {
    cors: {
      origin: '*',
    },
  });
const httpsSocket = require("socket.io")(httpsServer, {
    cors: {
    origin: '*',
    }
});

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.status(200).send("Haloo");
});

app.post("/to-socket", express.json(), async (req, res) => {
    const { agen_id, datas } = req.body;
    httpSocket.emit("events", agen_id, datas);
    httpsSocket.emit("events", agen_id, datas);

    res.status(200).json({status: true, msg: "Data telah diteruskan"})
});
app.post("/to-socket-bri", express.json(), async (req, res) => {
    const { HeaderID, LevelUser, UserName, StatusTransaksiType } = req.body;
    httpSocket.emit("event-bri", HeaderID, req.body);
    httpsSocket.emit("event-bri", HeaderID, req.body);

    res.status(200).json({status: true, msg: "Data telah diteruskan"})
});

httpSocket.on("connection", (socket) => {
    socket.on('to-socket-bri', (data) => {
        httpSocket.emit("event-bri", data.HeaderID, data);
    });
});

httpsSocket.on("connection", (socket) => {
    socket.on('to-socket-bri', (data) => {
        httpSocket.emit("event-bri", data.HeaderID, data);
    });
});

const PORT_HTTP = 8000;
httpServer.listen(PORT_HTTP, () => {
    console.log(`Example app listening at ${PORT_HTTP}`);
});


const PORT_HTTPS = 4430;
httpsServer.listen(PORT_HTTPS, () => {
    console.log(`Example app listening at port: ${PORT_HTTPS}`);
});

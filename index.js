const express = require("express");
const http = require("http");
const https = require('https');


var options = {
    key: fs.readFileSync(""),
    cert: fs.readFileSync("")
};


const app = express();
const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);
const httpSocket = require("socket.io")(httpServer, {
    cors: {
      origin: '*',
    }
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


const PORT_HTTP = 80;
httpServer.listen(PORT_HTTP, () => {
    console.log(`Example app listening at ${PORT_HTTP}`);
});


const PORT_HTTPS = 80;
httpsServer.listen(PORT_HTTPS, () => {
    console.log(`Example app listening at port: ${PORT_HTTPS}`);
});

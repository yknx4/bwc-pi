const express = require("express");
const basicAuth = require("express-basic-auth");
const storage = require("node-persist");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const Device = require("./models/Device");

async function start() {
  const app = express();

  await storage.init({
    dir: "db",
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: "utf8",
    logging: true, // can also be custom logging function
    continuous: true, // continously persist to disk
    expiredInterval: 2 * 60 * 1000 // [NEW] every 2 minutes the process will clean-up the expired cache
  });

  app.set("db", storage);
  app.options("*", cors());

  app.use(
    basicAuth({
      users: { ale: "figueroa" },
      challenge: true,
      realm: "Imb4T3st4p4"
    })
  );

  app.use(cors());
  app.use(bodyParser.json());
  app.use("/dash", express.static(path.join(__dirname, "pages")));

  app.use("/devices/:id", async function(req, res, next) {
    const { id } = req.params;
    const device = await Device.get(id);
    if (device == null) {
      res.sendStatus(404);
    } else {
      req.device = device;
      next();
    }
  });

  app.get("/networks", async function(req, res) {
    const nets = await storage.getItem("networks");
    res.json(nets);
  });

  app.get("/devices/:id", async function(req, res) {
    res.json(req.device.serialized);
  });

  app.put("/devices/:id", async function(req, res) {
    const toUpdate = Object.keys(req.body);
    toUpdate.forEach(k => req.device.update(k, req.body[k]));
    await req.device.save();
    res.sendStatus(204);
  });

  app.delete("/devices/:id", async function(req, res) {
    storage.removeItem(`Device:${req.device.id}`);
    res.status(204);
  });

  app.get("/devices", async function(req, res) {
    const devices = await Device.getAll();
    res.json({
      meta: {
        total: devices.length
      },
      data: devices.map(d => d.serialized)
    });
  });

  app.post("/devices", async function(req, res) {
    const { name, mac, ssid, enabled } = req.body;
    const newDevice = new Device(null, name, mac, ssid, enabled);
    const id = await newDevice.save();
    res.status(201).json({
      id
    });
  });

  const port = process.env.PORT || 8000;
  app.listen(port, function() {
    console.log(`Rpi Blind-spot webserver running on port ${port}!`);
  });
}
start();

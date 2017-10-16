const WiFiControl = require("wifi-control");
const { promisify } = require("util");
const { spawn } = require("child_process");
const { exec } = require("child_process");
const { platform } = require("os");
const path = require("path");
const playFile = require("./index");
const Device = require("../webserver/models/Device");

const scanForWifi = promisify(WiFiControl.scanForWiFi);

WiFiControl.init({
  debug: false
});

const netIntensity = net => parseFloat(net.signal_level);

async function checkNetwork(net) {
  const devices = await Device.getAll();
  const allowedSsids = devices.map(e => e.serialized.ssid);
  const blindNearby = allowedSsids.some(ssid => net.ssid === ssid);
  if (blindNearby) {
    console.log(`Found blind user => ${net.ssid} ${net.signal_level}`);
    exec(
      playFile(
        path.join(__dirname, "./sounds/water.wav"),
        Math.abs(netIntensity(net))
      )
    );
  }
  return blindNearby;
}

setInterval(() => {
  spawn("iwlist", ["wlan0", "scan"]);
}, 2500);

async function check() {
  const { networks } = await scanForWifi();
  for (let index = 0; index < networks.length; index++) {
    const net = networks[index];
    if (await checkNetwork(net)) {
      break;
    }
  }
  networks.forEach(checkNetwork);
}

module.exports = check;

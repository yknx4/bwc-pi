const WiFiControl = require("wifi-control");
const { promisify } = require("util");
const { spawn } = require("child_process");
const { exec } = require("child_process");
const { platform } = require("os");
const path = require("path");
const playFile = require("./index");
const Device = require("../webserver/models/Device");
const storage = require("node-persist");

const scanForWifi = promisify(WiFiControl.scanForWiFi);

WiFiControl.init({
  debug: false
});

const netIntensity = net => parseFloat(net.signal_level);

async function checkNetwork(net) {
  const devices = await Device.getAll();
  const allowedSsids = devices.filter(e => e.enabled).map(e => e.ssid);
  const blindNearby = allowedSsids.some(ssid => net.ssid === ssid);
  return blindNearby;
}

setInterval(() => {
  if (platform() !== "linux") return;
  spawn("sudo", ["iwlist", "wlan0", "scan"]);
}, 2500);

async function check() {
  const { networks } = await scanForWifi();
  storage.setItem("networks", networks);
  for (let index = 0; index < networks.length; index++) {
    const net = networks[index];
    const validNetwork = await checkNetwork(net);
    if (await checkNetwork(net)) {
      console.log(`Found blind user => ${net.ssid} ${net.signal_level}`);
      exec(
        playFile(
          path.join(__dirname, "./sounds/water.wav"),
          Math.abs(netIntensity(net))
        )
      );
      break;
    }
  }
}

module.exports = check;

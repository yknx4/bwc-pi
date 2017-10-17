const { promisify } = require("util");
const { spawn } = require("child_process");
const { exec } = require("child_process");
const { platform } = require("os");
const path = require("path");
const playFile = require("./index");
const Device = require("../webserver/models/Device");
const storage = require("node-persist");
const getNetworks = require("./wifi");

const netIntensity = net => parseFloat(net.signal_level);

async function checkNetwork(net) {
  const devices = await Device.getAll();
  const allowedSsids = devices.filter(e => e.enabled).map(e => e.ssid);
  const allowedMacs = devices.filter(e => e.enabled).map(e => e.mac);
  const blindNearby =
    allowedSsids.some(ssid => net.ssid === ssid) ||
    allowedMacs.some(mac => net.mac === mac);
  return blindNearby;
}

async function check() {
  const networks = await getNetworks();
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

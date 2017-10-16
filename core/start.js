const WiFiControl = require("wifi-control");
const { promisify } = require("util");
const { spawn } = require("child_process");
const { exec } = require("shelljs");
const { platform } = require("os");
const playFile = require("./index");
const Device = require("../webserver/models/Device");

const scanForWifi = promisify(WiFiControl.scanForWiFi);

WiFiControl.init({
  debug: false
});

const netIntensity = net => parseFloat(net.signal_level);

async function checkNetwork(net) {
  let allowedMacs = await Device.getAll();
  allowedMacs = allowedMacs.map(e => e.mac);
  console.log(net);
  const blindNearby = allowedMacs.some(netMac => net.mac === netMac);
  if (blindNearby) {
    console.log(`${net.ssid} ${net.signal_level} Volume ${volume(net) * 100}%`);
    exec(
      playFile(
        "/System/Library/Sounds/Submarine.aiff",
        Math.abs(netIntensity(net))
      )
    );
  }
  return blindNearby;
}

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

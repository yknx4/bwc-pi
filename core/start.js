const WiFiControl = require("wifi-control");
const { promisify } = require("util");
const { spawn } = require("child_process");
const { exec } = require("shelljs");
const { platform } = require("os");
const playFile = require("./index");

const scanForWifi = promisify(WiFiControl.scanForWiFi);

const allowedMacs = ["8e:f5:a3:ed:8a:0d"];

WiFiControl.init({
  debug: false
});

const netIntensity = net => parseFloat(net.signal_level);

function checkNetwork(net) {
  // console.log(net);
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
    if (checkNetwork(net)) {
      break;
    }
  }
  networks.forEach(checkNetwork);
}

module.exports = async () => {
  while (true) {
    await check();
  }
};

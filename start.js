const WiFiControl = require('wifi-control');
const { promisify } = require('util');
const { spawn } = require('child_process');
const {exec} = require('shelljs');

const scanForWifi = promisify(WiFiControl.scanForWiFi);

const allowedMacs = ['8e:f5:a3:ed:8a:0d'];

WiFiControl.init({
  debug: false
});

function interpolate(x0, y0, x1, y1, x2) {
  return ((x1 - x2) * y0 + (x2 - x0) * y1) / (x1 - x0);
}

const MAX_VOLUME = 1;
const MIN_VOLUME = 0.1;
const UPPER_LIMIT = 80;
const LOWER_LIMIT = 20;
const realVolume = net => interpolate(LOWER_LIMIT, MIN_VOLUME, UPPER_LIMIT, MAX_VOLUME, parseInt(net.signal_level, 10) * -1);
const volume = net => {
  const v = realVolume(net);
  if (v < MIN_VOLUME) return MIN_VOLUME;
  if (v > MAX_VOLUME) return MAX_VOLUME;
  return v;
};

function checkNetwork(net) {
  // console.log(net);
  const blindNearby = allowedMacs.some(netMac => net.mac === netMac);
  if (blindNearby) {
    console.log(`${net.ssid} ${net.signal_level} Volume ${volume(net) * 100}%`);
    exec(`afplay /System/Library/Sounds/Submarine.aiff -v ${volume(net)}`);
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
  while(true) {
    await check();
  }
};

const { promisify } = require("util");
const { spawn } = require("child_process");
const { exec } = require("child_process");
const { platform } = require("os");
const path = require("path");
const playFile = require("./index");
const Device = require("../webserver/models/Device");
const storage = require("node-persist");
const getNetworks = require("./wifi");

const netIntensity = sl => Math.abs(parseFloat(sl));

async function checkNetwork(net) {
  const devices = await Device.getAll();
  const allowedSsids = devices.filter(e => e.enabled).map(e => e.ssid);
  const allowedMacs = devices.filter(e => e.enabled).map(e => e.mac);
  const blinds = devices.filter(net => {
    return (
      allowedSsids.some(ssid => net.ssid === ssid) ||
      allowedMacs.some(mac => net.mac === mac)
    );
  });
  return blinds;
}

async function check() {
  const networks = await getNetworks();
  storage.setItem("networks", networks);

  const devices = await Device.getAll();
  const allowedSsids = devices.filter(e => e.enabled).map(e => e.ssid);
  const allowedMacs = devices.filter(e => e.enabled).map(e => e.mac);

  const blinds = networks.filter(net => {
    return (
      allowedSsids.some(ssid => net.ssid === ssid) ||
      allowedMacs.some(mac => net.mac === mac)
    );
  });

  if (blinds.length < 1) {
    return;
  }
  console.log(`Found blind users => ${JSON.stringify(blinds)}`);
  const signals = blinds.map(e => e.signal_level);
  console.log(signals);
  exec(
    playFile(
      path.join(__dirname, "./sounds/water.wav"),
      netIntensity(Math.min(signals))
    )
  );
}

module.exports = check;

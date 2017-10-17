const child_process = require("child_process");
const { promisify } = require("util");

const exec = promisify(child_process.exec);
const refresh = "sudo iwlist scan";
const getNetworks = "nmcli -t -f SIGNAL,SSID,BSSID dev wifi list";

async function getNetworks() {
  await exec(refresh);
  const { stdout } = await exec(getNetworks);
  console.log(stdout);
}

module.exports = getNetworks;

const child_process = require("child_process");
const { promisify } = require("util");

const exec = promisify(child_process.exec);
const refresh = "sudo iwlist scan";
const getNetworksCmd = "nmcli -t -f SIGNAL,SSID,BSSID dev wifi list";

const nmcliRegex = /(\d*):(.*):(([0-9A-Fa-f]{2}\\:){5}([0-9A-Fa-f]{2}))/;
const unescape = s => s.replace("\\:", ":").replace("\\\\", "\\");

async function getNetworks() {
  await exec(refresh);
  const { stdout } = await exec(getNetworksCmd);
  const nets = stdout
    .split("\n")
    .map(nmcliRegex.exec.bind(nmcliRegex))
    .map(m => ({
      signal_level: m[1],
      ssid: unescape(m[2]),
      mac: unescape(m[3])
    }));
  console.log(nets);
}

module.exports = getNetworks;

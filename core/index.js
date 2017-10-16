const { platform } = require("os");
const volumeForNet = require("./volume");
const { volume, command } = require(`./${platform()}`);
console.log(`Loading specifics for ${platform()} platform.`);

function playFile(file, dbm) {
  console.log(`Playing ${file} with ${dbm} => ${volume(volumeForNet(dbm))}`);
  return command.replace("%VOLUME%", volume(dbm)).replace("%FILE%", file);
}

module.exports = playFile;

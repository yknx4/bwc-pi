const { platform } = require("os");

console.log(`Loading specifics for ${platform()} platform.`);
const { volume, command } = require(`./${platform()}`);

function playFile(file, dbm) {
  console.log(`Playing ${file} with ${dbm} => ${volume(dbm)}`);
  return command.replace("%VOLUME", volume(dbm)).replace("%FILE%", file);
}

module.exports = playFile;

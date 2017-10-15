const { platform } = require("os");

console.log(`Loading specifics for ${platform()} platform.`);
const { volume, command } = require(`./${platform()}`);

function playFile(file, dbm) {
  return command.replace("%VOLUME", volume(dbm)).replace("%FILE%", file);
}

module.exports = playFile;

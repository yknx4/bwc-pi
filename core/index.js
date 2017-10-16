const { platform } = require("os");
const { volume, command } = require(`./${platform()}`);
console.log(`Loading specifics for ${platform()} platform.`);

function playFile(file, dbm) {
  console.log(`Playing ${file} with ${dbm} => ${volume(dbm)}`);
  return command.replace("%VOLUME%", volume(dbm)).replace("%FILE%", file);
}

module.exports = playFile;

require("dotenv").config();
require("./webserver");
const start = require("./core/start");
setInterval(start, 5000);

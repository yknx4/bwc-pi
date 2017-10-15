const express = require("express");
const basicAuth = require("express-basic-auth");

const app = express();

app.use(
  basicAuth({
    users: { ale: "figueroa" }
  })
);

app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});

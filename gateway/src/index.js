const express = require("express");
const { config } = require("./config");
const { gateway, getGatewayList } = require("./functions");

const app = express();
const {  port } = config;

app.get("/", getGatewayList);
app.get("/list", getGatewayList);

app.use(`/*`, gateway);

app.use(function (req, res) {
  res.status(404).json({ message: `Route ${req.url} not found.` });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

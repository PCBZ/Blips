import app from "./app.js";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";

dotenv.config();

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

app.get("/ping", (req, res) => {
  res.send("pong");
});

const PORT = 8443;
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
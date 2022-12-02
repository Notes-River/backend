const express = require('express');
const app = express();
const server = require('http').createServer(app);
const mongoose = require('mongoose');
const projectDetails = require('./projectDetails.json');
const cors = require('cors');
const redis = require('./redis');
const fs = require('fs').promises;
const { config } = require('dotenv');

config({path: __dirname+'/.env'});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public/', express.static("public"));
app.use('/logo/', express.static("logo"));

const port = process.env.PORT || 3003;
const dburl = process.env.DB_URL || projectDetails.dburl;

require('./Connection')(dburl);

app.use((req, res, next) => {
  const startTime = Date.now();
  req.on("end", async () => {
    const endTime = Date.now();
    const vals = {
      method: req.method,
      path: req.path,
      time: endTime - startTime,
    };
    await fs.appendFile('./server.log', JSON.stringify(vals) + '\n');
    console.log(vals);
  });
  next();
})

require('./Config')(app);
redis.connect().then(() => console.log('REDIS CONNECTION: TRUE')).catch((err) => console.log(err));

server.listen(3000, (err) => {
  console.log('server is running on ===> http://localhost:3000');
})

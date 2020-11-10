const express = require('express');
const os = require('os');

const ws = require('ws');

const app = express();
// const expressWs = require('express-ws')(app);

app.use(express.static('dist'));

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));

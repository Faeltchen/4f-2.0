const express = require('express');

const app = express();
const port = process.env.PORT || 80;

var path = require('path');

app.use(express.static(__dirname +'./../dist/')); //serves the index.html

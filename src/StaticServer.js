const express = require('express');

const app = express();
const port = process.env.PORT || 80;

app.use('/uploads', express.static(__dirname +'/../uploads'))
app.listen(port);

//app.use('/uploads', express.static(__dirname +'./../uploads')); //serves the index.html

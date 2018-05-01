const express = require('express');

const app = express();
const port = process.env.PORT || 80;

var path = require('path');

/*
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../dist/index.html'));
});
*/
app.use(express.static(__dirname +'./../dist/')); //serves the index.html
app.listen(port, () => console.log(`Listening on port ${port}`));

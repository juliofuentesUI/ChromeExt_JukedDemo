const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('./database.js');

let app = express();

app.use(morgan('dev'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(bodyParser());

app.all('/*',(req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/:game', async (req, res) => {
  let output = await db.queryDatabase(req.params.game);
  if (!output) {
    res.status(404).send(output);
  } else {
    res.status(200).send(output);
  }
});

let PORT = 3000;

app.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
})

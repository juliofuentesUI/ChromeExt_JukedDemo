//this runs on server , will require puppeteer
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');


let app = express();

app.use(morgan('dev'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(bodyParser());


app.get('/', (req, res) => {
  res.status(200).send('WE ARE LIVE ! REQUEST RECEIVED');
});

let PORT = 1128;

app.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
})

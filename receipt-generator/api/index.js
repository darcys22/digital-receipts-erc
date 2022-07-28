const path = require('path')
const express = require("express");
const app = express();

const { getScreenshot } = require("./chromium");
var receiptModel = require("./models/receiptModel.js");

const port = process.env.PORT || 3000;

app.use(express.urlencoded({extended: false}));
app.use(express.json());

var options = {
  extensions: ['htm', 'html', 'json', 'js'],
}
app.use(express.static(process.cwd() + '/public', options));
if (process.env.NODE_ENV == 'production') {
  app.use(express.static(process.cwd() + '/dist'));
}

// Handler to take screenshots of a HTML receipt
app.post("/api/screenshot", async ( req, res ) => {
  const html = req.body.html;
  if ( html === "" || typeof html === "undefined" ) {
    return res.status(400).send({success: false, error: "html is empty or undefined"});
  }
  getScreenshot(html)
    .then(data => res.status(200).send({success: true, image: "data:image/png;base64," + data}))
    .catch(err => {
      res.status(400).send({success: false, error: err.message})
    });
});

app.get('/api/receipt/view/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  if (!Number.isInteger(id))
    return res.status(400).send({success: false, error: "id is not a number"});
  return await receiptModel.getReceipt(id)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send({success: false, error: err}))
});

app.get('/api/receipt/view', (req, res) => {
  res.status(400).send({ message: 'Generated receipt id is required for response'})
});

app.post("/api/receipt/add", async (req, res) => {
  if (!Number.isInteger(req.body.id))
    return res.status(400).send({success: false, error: "id is not a number"});
  
  return await receiptModel.createReceipt(req.body.id, JSON.stringify(req.body.receipt))
    .then(data => res.status(200).send({success: true, message: data}))
    .catch(err => res.status(400).send({success: false, error: err}))
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

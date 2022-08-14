const { getScreenshot } = require( "./chromium" );
const path = require('path')

const express = require( "express" );
const cors = require( "cors" );
const app = express();

var receiptModel = require("./models/receiptModel.js");

const port = process.env.PORT || 3000;

// use it before all route definitions
app.use( cors( { origin: true } ) );

app.use( express.urlencoded( { extended: false } ) );
app.use( express.json() );

var options = {
  extensions: ['htm', 'html', 'json', 'js'],
}
app.use(express.static(process.cwd() + '/public', options));
if (process.env.NODE_ENV == 'production') {
  app.use(express.static(process.cwd() + '/dist'));
}

// Handler to take screenshots of a URL.
app.post("/api/screenshot", async ( req, res ) => {
  try {
    const html = req.body.html;
    if ( html === "" || typeof html === "undefined" ) {
      throw "No Tricks Please!";
    }
    const file = await getScreenshot( html );
    response = res
      .status( 200 )
      .send( { success: true, image: "data:image/png;base64," + file } );
  } catch ( e ) {
    let message = e.message ?
      e.message :
      "Sorry, there was a server problem";
    response = res
      .status(400)
      .send({success: false, error: message, e: e});
  }
  return response;
});

//Gateway for generated receipt as a test
//This will probably do something more impressive once it gets the JSON from app, for now these
// are just placeholders so that we know the API can get an ID passed into it and is working.
// N.D 12:30 - 05/08/2022

app.get('/api/generated-receipt/:id',(req, res) => {
  try {
    const { id } = req.params;
    if (!Number.isInteger(id))
      throw "id is not a number"
    receiptModel.getReceipt(id, 
      function(data) {
        res.status(200).send(data);
      }
    );
  } catch ( e ) {
    let message = e.message ?
      e.message :
      "Sorry, there was a server problem";
    response = res
      .status(400)
      .send({success: false, error: message, e: e});
  }
});

app.get('/api/generated-receipt', (req, res) => {
  res.status(400).send({ message: 'Generated receipt id is required for response'})
});

app.post("/api/receipt/add", function(req, res) {
  try {
    if (!Number.isInteger(req.body.id))
      throw "id is not a number"

    receiptModel.createReceipt(req.body.id, JSON.stringify(req.body.receipt), 
      function(data) {
        res.status(200).send(data);
      }
    );
  } catch ( e ) {
    let message = e.message ?
      e.message :
      "Sorry, there was a server problem";
    response = res
      .status(400)
      .send({success: false, error: message, e: e});
  }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

const { getScreenshot } = require( "./chromium" );
const path = require('path')

const express = require( "express" );
const cors = require( "cors" );
const app = express();

var receiptModel = require("models/receiptModel.js");

// use it before all route definitions
app.use( cors( { origin: true } ) );

app.use( express.urlencoded( { extended: false } ) );
app.use( express.json() );

var options = {
  extensions: ['htm', 'html', 'json'],
}
app.use(express.static(process.cwd() + '/public', options));

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
      "Sorry, there was a Server  problem";
    response = res
      .status( 400 )
      .send( { success: false, error: message, e: e } );
  }
  return response;
});

//Gateway for generated receipt as a test
//This will probably do something more impressive once it gets the JSON from app, for now these
// are just placeholders so that we know the API can get an ID passed into it and is working.
// N.D 12:30 - 05/08/2022

app.get('/api/generated-receipt/:id',(req, res) => {
  
  const { id } = req.params;

      res.status(200).send(
        {
          this: process.cwd() + '/public',
          param: id,
          numbers: '123321123123123123123'
        }
      );

});

app.get('/api/generated-receipt', (req, res) => {

  res.status(400).send({ message: 'Generated receipt id is required for response'})

});

app.post("/api/receipt/add", function(req, res) {
  //TODO sean check that req.id is a number
  try {
    if (!Number.isInteger(req.id))
      throw "id is not a number"

    receiptModel.createReceipt(req.id, JSON.stringify(req.receipt), 
      function(data) {
        res.status(200).send(data);
      }
    );
  } catch ( e ) {
    let message = e.message ?
      e.message :
      "Sorry, there was a Server  problem";
    response = res
      .status( 400 )
      .send( { success: false, error: message, e: e } );
  }
});

module.exports = app;

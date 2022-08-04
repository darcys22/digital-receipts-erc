const { getScreenshot } = require( "./chromium" );

const express = require( "express" );
const cors = require( "cors" );
const app = express();

// use it before all route definitions
app.use( cors( { origin: true } ) );

app.use( express.urlencoded( { extended: false } ) );
app.use( express.json() );

// set port 12345 for now
const PORT = 12345;
// N.D

// Handler to take screenshots of a URL.
app.post( "/*", async ( req, res ) => {
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
} );

//Gateway for generated receipt as a test
//This will probably do something more impressive once it gets the JSON from app, for now these
// are just placeholders so that we know the API can get an ID passed into it and is working.
// N.D 12:30 - 05/08/2022

app.get('/generated-receipt/:id',(req, res) => {
  
  const { id } = req.params;

      res.status(200).send(
        {
          this: 'a test',
          param: id,
          numbers: '123321123123123123123'
        }
      );

  });

  app.get('/generated-receipt', (req, res) => {
  
    res.status(400).send({ message: 'Generated receipt id is required for response'})
  
    });
// N.D

//set app to listen in on port 12345 temporarily, this will probably get moved to the proper URN once its working
app.listen(
  PORT,
  () => console.log('Listening in on http://localhost:12345')
)
//N.D

module.exports = app;
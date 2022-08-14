const chrome = require( "chrome-aws-lambda" );
const puppeteer = require( "puppeteer-core" );

async function getScreenshot ( html ) {
  //var exePath = "./node_modules/puppeteer/.local-chromium/mac-722234/chrome-win/chrome.exe"; //uncomment this line when working on localhost Windows
  //var exePath = "./node_modules/puppeteer/.local-chromium/mac-901912/chrome-mac/Chromium.app/Contents/MacOS/Chromium"; //uncomment this line when working on localhost Mac
  var exePath = "./node_modules/puppeteer/.local-chromium/linux-982053/chrome-linux/chrome"; //uncomment this line when working on localhost Linux
  if (process.env.NODE_ENV == 'production') {
    exePath = await chrome.executablePath
  }
  const browser = await puppeteer.launch({
    args: chrome.args,
    headless: chrome.headless, // comment this line when working on localhost
    executablePath: exePath, //uncomment this line when working on localhost Linux
     
  });

  const page = await browser.newPage();
  await page.setViewport( {
    width: 480,
    height: 100,
    deviceScaleFactor: 1,
  });
  await page.setContent( html, { waitUntil: "networkidle2" } );
  const element = await page.$( "body" );
  const file = await element.screenshot( { encoding: "base64" } );
  await browser.close();
  return file;
}

module.exports = { getScreenshot };

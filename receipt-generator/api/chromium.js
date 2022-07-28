const chrome = require( "chrome-aws-lambda" );
const puppeteer = require( "puppeteer-core" );

let PUPPETEER_REVISIONS = import("puppeteer/lib/esm/puppeteer/revisions.js");

const getScreenshot = async (html) => {
  //var exePath = "./node_modules/puppeteer/.local-chromium/mac-722234/chrome-win/chrome.exe"; //uncomment this line when working on localhost Windows
  //var exePath = "./node_modules/puppeteer/.local-chromium/mac-901912/chrome-mac/Chromium.app/Contents/MacOS/Chromium"; //uncomment this line when working on localhost Mac
  const revision_obj = JSON.parse(JSON.stringify(await PUPPETEER_REVISIONS));
  var exePath = "./node_modules/puppeteer/.local-chromium/linux-" + revision_obj.PUPPETEER_REVISIONS.chromium + "/chrome-linux/chrome";
  if (process.env.NODE_ENV == 'production') {
    exePath = '/usr/bin/chromium-browser';
  }
  const browser = await puppeteer.launch({
    args: chrome.args,
    headless: true,
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
};

module.exports = { getScreenshot };

import "./import-globals";
import "bootstrap-material-datetimepicker/js/bootstrap-material-datetimepicker.js";
import utils from "./libs/utils";
import modal from "./libs/modal";
import items from "./libs/items";
import download from "./libs/download";
import moment from "moment";

// WEB3 STUFF
import Web3 from 'web3';
import { ethers } from 'ethers'


/**
 * Do things when document is ready
 */
( function ( $ ) {
  // Define app const.
  const app = {
    /**
     * Initialize app
     */
    init: () => {
      /**
       * Setup inputmask.
       */
      utils.setupInputMask();

      /**
       * Setup datepicker.
       */
      utils.setupDatePicker();

      // Define re-usable variables.
      app.imageElem = ".preview-box img";
      app.defaultImage = $( app.imageElem ).attr( "src" );
      app.downloadBtn = $( document.body ).find( "#download" );
      app.imagebase64 = null;
      app.processing = false;
      app.web3ready = false;

      // Load event listeners.
      app.loadEvents();
      app.loadWeb3();

    },

    /**
     * Generate raw html for processing
     * @param {element} form form element.
     * @return {string} receipt html.
     */
    generateRawHtml: ( form ) => {
      const date = form.find( ":input[name='date']" ).val();
      const business = form.find( ":input[name='business']" ).val();
      const address = form.find( ":input[name='address']" ).val();
      const currency = form.find( ":input[name='currency']" ).val();
      const taxType = form.find( ":input[name='tax_type']" ).val();
      const paymentType = form.find( ":input[name='payment_type']" ).val();
      const items = form.find( "input[name='price[]']" );

      let tax = form.find( ":input[name='tax']" ).val();
      let curr = currency !== "" ? currency : "";
      let total = 0.0;

      let html = '<!DOCTYPE html>';
      html += '<html lang="en">';
      html += '<head>';
      html += '<meta charset="UTF-8" />';
      html += '<meta http-equiv="X-UA-Compatible" content="IE=edge" />';
      html += '<meta name="viewport" content="width=device-width, initial-scale=1.0"/>';
      html += '<link href="https://fonts.googleapis.com/css?family=Cutive+Mono&display=swap" rel="stylesheet"/>';
      html += '<style>';
      html += '*{box-sizing:border-box}html,body{margin:0;padding:0;width:100%;font-size:16px}body,#receipt{background:#f5f5f5}#receipt,#receipt *,#receipt p{font-family:"Cutive Mono",monospace}#receipt{padding:50px 60px;text-align:left;font-size:22px;margin:0 auto}#receipt p{margin-top:0;margin-bottom:0;line-height:1.5}#receipt .address{margin-bottom:18px}#receipt .date{padding:10px 0;border:1px dashed #999;border-left:0;border-right:0;margin-bottom:18px}#receipt .payment{margin-bottom:18px}#receipt .table{width:100%;margin-bottom:18px;max-width:100%;font-size:15px;border-collapse:collapse;border-spacing:0}#receipt .table>tbody>tr>td,#receipt .table>tbody>tr>th,#receipt .table>tfoot>tr>td,#receipt .table>tfoot>tr>th,#receipt .table>thead>tr>td,#receipt .table>thead>tr>th{padding:8px 5px;text-align:right}#footer{text-align:center}';
      html += '</style>';
      html += '</head>';
      html += '<body>';
      html += '<div id="receipt">';
      html += '<div class="address">';
      html += '<p>' + 'test' + business + '</p>';
      html += '<p>' + utils.nl2br( address ) + '</p>';
      html += '</div>';
      html += '<p class="date">' + utils.nl2br( date ) + '</p>';
      html += '<p class="payment"><strong>Payment Type:</strong>' + paymentType + '</p>';
      html += '<table class="table">';
      html += '<thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Price</th></tr></thead>';
      html += '<tbody>';

      items.each( ( i, el ) => {
        let parent = $( el ).closest( "tr" );
        let price = $( el ).val();
        price = parseFloat( price ).toFixed( 2 );
        let qty = parent.find( "input[name='qty[]']" ).val();
        let itemName = parent.find( "input[name='item_name[]']" ).val();
        let itemTotal = ( parseFloat( price ) * parseInt( qty ) ).toFixed( 2 );
        total = parseFloat( parseFloat( total ) + parseFloat( itemTotal ) ).toFixed( 2 );
        html += '<tr><td>' + itemName + '</td><td>' + qty + '</td><td>' + curr + '' + price + '</td><td>' + curr + '' + itemTotal + '</td></tr>';
      } );

      html += '</tbody>';
      html += '<tfoot>';
      html += '<tr><th colspan="3">Subtotal:</th><td>' + curr + '' + total + '</td></tr>';

      if ( tax !== "" ) {
        tax = parseFloat( tax ).toFixed( 2 );
        total = parseFloat( parseFloat( total ) + parseFloat( tax ) ).toFixed( 2 );
        html += '<tr><th colspan="3">' + taxType + ':</th><td>' + curr + '' + tax + '</td></tr>';
        
        console.log("DEV: tax does not equal null")
      }

      html += '<tr><th colspan="3">Total:</th><td>' + curr + '' + total + '</td></tr>';
      html += '<tfoot></table>';
      html += '<p id="footer">Thank You!</p>';
      html += '</div>';
      html += '</body>';
      return html;
    },

    claimNFTs: async () => {
      if (typeof window.ethereum !== 'undefined' && app.web3ready) {
        try {
          window.provider = new ethers.providers.Web3Provider(window.ethereum)
          window.signer = window.provider.getSigner();
          window.contract = new ethers.Contract(window.CONFIG.CONTRACT_ADDRESS, window.abi, window.signer)
          const networkId = await window.ethereum.request({
            method: "net_version",
          });
          if (networkId == window.CONFIG.NETWORK.ID) {
            let gasLimit = window.CONFIG.GAS_LIMIT;
            console.log("Gas limit: ", gasLimit);
            utils.showNotification(`Minting your ${window.CONFIG.NFT_NAME}...`);
            const mintTx = await window.contract.mint({gasLimit: String(gasLimit)});
            utils.showNotification(`WOW, the ${window.CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`);
            //await window.provider.waitForTransaction(mintTx.hash);
            //const receipt = await window.provider.getTransactionReceipt(mintTx.hash);
          } else {
            utils.showError(`Change network to ${window.CONFIG.NETWORK.NAME}.`);
          }
        } catch (err) {
          utils.showError("Something NFT went wrong.");
        }
      } else {
        utils.showError("Make sure metamask or some other wallet is connected.");
      }
    },

    loadWeb3: async () => {
      const abiResponse = await fetch(process.env.API_URL + "config/abi.json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      window.abi = await abiResponse.json();
      const configResponse = await fetch(process.env.API_URL + "config/config.json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      window.CONFIG = await configResponse.json();
    },

    ethEnabled: async () => {
      if (window.ethereum) {
        await window.ethereum.request({method: 'eth_requestAccounts'});
        window.web3 = new Web3(window.ethereum);
        app.checkWalletConnected();
        return true;
      }
      return false;
    },

    checkWalletConnected: async () => {
      const el = $( document.body ).find("#connect-wallet");
      const btn = $( document.body ).find("button[type='submit']");
      // Check if User is already connected by retrieving the accounts
      web3.eth.getAccounts()
        .then(function(addr){
          if (addr.length > 0){
            app.web3ready = true;
            btn.attr( "disabled", false );
            el.text("Connected: " + addr);
            const duration = 5000;
            setTimeout(function(){
              app.checkWalletConnected();
            },duration);
          } else {
            btn.attr( "disabled", true );
            app.web3ready = false;
            el.text("Connect Wallet");
          }
        })
        .catch(function(err){
          btn.attr( "disabled", true );
          app.web3ready = false;
          el.text("Connect Wallet");
        });
    },

    /**
     * Load event listers
     */
    loadEvents: () => {
      $( document.body )
        /**
         * Click event to add new item row
         * @param {event} e event object.
         */
        .on( "click", "a.add-new-item-row", ( e ) => {
          e.preventDefault();
          items.add( e.currentTarget );
        } )

        /**
         * Click event to remove item row.
         * @param {event} e event object.
         */
        .on( "click", ".remove-item-row", ( e ) => {
          e.preventDefault();
          items.remove( e.currentTarget );
        } )

        /**
         * Click event for connect to wallet
         * @param {event} e event object.
         */
        .on( "click", "#connect-wallet", ( e ) => {
          e.preventDefault();
          app.ethEnabled();
        } )

        /**
         * Focus event to remove error class from inputs
         * @param {event} e event object.
         */
        .on( "focus", ".form-control", ( e ) => {
          e.preventDefault();
          $( e.currentTarget ).parent().removeClass( "has-error" );
        } )

        /**
         * From submit event
         * @param {event} e event object.
         */
        .on( "submit", "#receipt-form", ( e ) => {
          e.preventDefault();

          // Return if processing is already happening
          if ( app.processing ) {
            return false;
          }

          // Define target & form const.
          const target = e.currentTarget;
          const form = $( target );

          // Hide error notice.
          utils.hideError();
          utils.hideNotification();
          form.removeClass( "was-validated" );

          // check if the input is valid using a 'valid' property
          if ( !e.target.checkValidity() ) {
            form.addClass( "was-validated" );
            return false;
          }

          // Define submit button const.
          const btn = form.find( "button[type='submit']" );

          // Generate receipt image raw html.
          const html = app.generateRawHtml( form );


          const receipt = {
            date:  form.find( ":input[name='date']" ).val(),
            business:  form.find( ":input[name='business']" ).val(),
            address:  form.find( ":input[name='address']" ).val(),
            currency:  form.find( ":input[name='currency']" ).val(),
            taxType:  form.find( ":input[name='tax_type']" ).val(),
            paymentType:  form.find( ":input[name='payment_type']" ).val(),
            //items:  form.find( "input[name='price[]']" ),
            tax:  form.find( ":input[name='tax']" ).val(),
            //curr:  currency !== "" ? currency : "",
            total:  0.0
          }

          // Setup Ajax call for api call.
          $.ajax({
            type: "POST",
            data: { html: html },
            url: process.env.API_URL + "api/screenshot",
            dataType: "json",
            beforeSend: () => {
              /**
               * Show Loader
               * Set default images
               * Disable download button
               * Set null on imagebase64 variable
               * Set processing to true
               * Disable submit button
               * Close modal
               */
              utils.loader( true );
              $( app.imageElem ).attr( "src", app.defaultImage );
              app.downloadBtn.attr( "disabled", true );
              app.imagebase64 = null;
              app.processing = true;
              btn.attr( "disabled", true );
              modal.close();
            },
            success: async ( response ) => {
              // Check if response has success reponse?
              if ( response.success ) {
                // Store response data image base64 to app variable.
                app.imagebase64 = response.image;

                const nft = await app.claimNFTs();
                const nftSupply = await window.contract.totalSupply();
                console.log(receipt);
                // create request object
                const data = {id: nftSupply.toNumber(), receipt}
                const request = new Request(process.env.API_URL + "api/receipt/add", {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                });
                await fetch(request)
                  .then(res => res.json())
                  .then(res => console.log(res));
                // Activate donwload button.
                app.downloadBtn.attr("disabled", false);
                // Set new image data to element
                $(app.imageElem).attr("src", app.imagebase64);
                // Open modal.
                modal.open();
              } else {
                // Show error if response doesn't have success response.
                utils.showError( "Sorry, something went wrong, please try later." );
              }
            },
            error: () => {
              // Show error.
              utils.showError( "Sorry, something went wrong, please try after sometime." );
            },
            complete: () => {
              // Hide Loader.
              utils.loader( false );
              // Set processing to false.
              app.processing = false;
              // Activate submit button.
              btn.attr( "disabled", false );
            }
          });
        })

        /**
         * Click event to download image.
         * @param {event} e event object.
         */
        .on( "click", "#download", ( e ) => {
          e.preventDefault();
          // Download image.
          download.save( app.imagebase64 );
        } )

        /**
         * Click event for view sample receipt
         * @param {event} e event object.
         */
        .on( "click", "#view-sample", ( e ) => {
          e.preventDefault();
          // Set default sample receipt image.
          $( app.imageElem ).attr( "src", app.defaultImage );
          // Disable download button for sample image.
          app.downloadBtn.attr( "disabled", true );
          // Open modal.
          modal.open();
        } )


        /**
         * Click event for modal close button.
         * @param {event} e event object.
         */
        .on( "click", ".rg-modal-close", ( e ) => {
          e.preventDefault();
          // Close modal.
          modal.close();
        } );
    },
  };
  app.init();
} )( jQuery );

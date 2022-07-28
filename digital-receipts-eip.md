---
eip:
title: Digital Receipt Non-Fungible Tokens
author: Sean Darcy <darcys22@gmail.com>
discussions-to: https://ethereum-magicians.org/t/idea-standard-digital-receipts-using-erc-721/9908
status: 
type: Standards Track
category: ERC
created: 
requires: 721
---

## Simple Summary

Using Non-Fungible Tokens as a method of distributing digital receipts for physical purchases. Where the metadata represents a json receipt.

## Abstract

This EIP proposes a standard schema for digital receipts of transactions. Digital Receipt Non-Fungible Tokens are issued by a vendor when a customer makes a purchase from their store and contains transaction details necessary for record keeping. Digital Receipt Non-Fungible Tokens extend [ERC-721](./eip-721.md) which allows for the management and ownership of unique tokens.

## Motivation

Purchases from online retailers include a receipt that is emailed and/or physically provided to the customer. These receipts are critical for many reasons but are provided in an analogue form which is difficult to parse by financial systems. Digital receipts have never gained traction dispite the fact that point of sales systems are already digital and the customers often want this information in their own digital systems. So we are left with a redundant Digital -> Analogue -> Digital process which requires unnecessary data entry.

Digital receipts are relatively simple and can be described in a json format, we can further prove the receipts validity by digitally signing receipt using the vendors private keys. NFTs provide a unique opportunity to also link the digital receipt to a purchase. If the purchase was made using a cryptocurrency then the wallet software will be able to click through the transaction to the receipt. If the purchase was not made using a cryptocurrency then the Digital Receipt NFT will still act as a convenient place to track the digital receipts.

Digital receipt as NFTs can also conceptually include other important information such as item serial numbers and delivery tracking etc. Proof of purchase and proof of ownership of an asset can be done by simply owning the digital receipt NFT.

One of the major roadblocks to fully automating our finance world has been the difficulty in transaction details. Requiring a human being to physically track paper receipts is archaic and NFTs on the blockchain provide a method for this to be so much better.

## Specification

Transaction Flow:
 - A customer purchases an item from an online retailer, checking out leads the customer to an option to mint a NFT.
 - The smart contract provides the user with a Digital Receipt Non-Fungible Token.
 - When fulfilling the order, the retailer will upload the digital receipt specified in in the JSON schema below as the metadata to the previously minted NFT

### Digital Receipt JSON Schema
The JSON schema is composed of 2 parts. The root schema contains high level details of the receipt (for example Date and Vendor) and another schema for the optionally recurring line items contained in the receipt.

#### Root Schema
```json
{
  "id": "receipt.json#",
  "description": "Receipt Schema for Digital Receipt Non-Fungible Tokens",
  "type": "object",
  "required": ["name", "description", "image", "id", "date", "vendor", "items", "signature"],
  "properties": {
    "name": {
      "title": "Name",
      "description": "Identifies the token as a digital receipt",
      "type": "string"
    },
    "description": {
      "title": "Description",
      "description": "Brief description of a digital receipt",
      "type": "string"
    },
    "id": {
      "title": "ID",
      "description": "Unique ID for the receipt generated by the vendor",
      "type": "string"
    },
    "date": {
      "title": "Date",
      "description": "Date Receipt Issued",
      "type": "string",
      "format": "date"
    },
    "vendor": {
      "title": "Vendor",
      "description": "Details of the entity issuing the receipt",
      "type": "object",
      "required": ["name", "address", "website", "contact"],
      "properties": {
        "name": {
          "title": "Name",
          "description": "Name of the vendor. E.g. Acme Corp",
          "type": "string"
        },
        "logo": {
          "title": "Logo",
          "description": "URL of the issuer's logo",
          "type": "string",
          "format": "uri"
        },
        "address": {
          "title": "Address",
          "description": "List of strings comprising the address of the issuer",
          "type": "array",
          "items": { "type": "string" },
          "minItems": 2,
          "maxItems": 6
        },
        "website": {
          "title": "Website",
          "description": "URL of the issuer's website",
          "type": "string",
          "format": "uri"
        },
        "contact": {
          "title": "Contact Details",
          "description": "Details of the person to contact",
          "type": "object",
          "required": ["name", "tel", "email"],
          "properties": {
            "name": {
              "title": "Name",
              "description": "Name of the contact person",
              "type": "string"
            },
            "position": {
              "title": "Position",
              "description": "Position / Role of the contact person",
              "type": "string"
            },
            "tel": {
              "title": "Telephone Number",
              "description": "Telephone number of the contact person",
              "type": "string"
            },
            "email": {
              "title": "Email",
              "description": "Email of the contact person",
              "type": "string",
              "format": "email"
            },
            "address": {
              "title": "Address",
              "description": "List of strings comprising the address of the contact person",
              "type": "array",
              "items": { "type": "string" },
              "minItems": 2,
              "maxItems": 6
            }
          }
        }
      }
    },
    "items": {
      "title": "Items",
      "description": "Items included into the receipt",
      "type": "array",
      "minItems": 1,
      "uniqueItems": true,
      "items": {
        "$ref": "item.json#"
      }
    },
    "comments": {
      "title": "Comments",
      "description": "Any messages/comments the issuer wishes to convey to the customer",
      "type": "string"
    },
    "image": {
      "title": "Image",
      "description": "Viewable/Printable Image of the Digital Receipt",
      "type": "string"
    },
    "signature": {
      "title": "Signature",
      "description": "Digital signature by the vendor of receipts data",
      "type": "string"
    }
  }
}
```

#### Line Items Schema
```json
{
  "type": "object",
  "id": "item.json#",
  "required": ["id", "title", "date", "amount", "tax", "quantity"],
  "properties": {
    "id": {
      "title": "ID",
      "description": "Unique identifier of the goods or service",
      "type": "string"
    },
    "title": {
      "title": "Title",
      "description": "Title of the goods or service",
      "type": "string"
    },
    "description": {
      "title": "Description",
      "description": "Description of the goods or service",
      "type": "string"
    },
    "link": {
      "title": "Link",
      "description": "URL link to the web page for the product or sevice",
      "type": "string",
      "format": "uri"
    },
    "date": {
      "title": "Supply Date",
      "description": "The date the goods or service were provided",
      "type": "string",
      "format": "date"
    },
    "amount": {
      "title": "Unit Price",
      "description": "Unit Price per item (excluding tax)",
      "type": "number"
    },
    "tax": {
      "title": "Tax",
      "description": "Amount of tax charged for unit",
      "type": "number"
    },
    "quantity": {
      "title": "Quantity",
      "description": "Number of units",
      "type": "integer"
    }
  }
}
```

## Rationale

A standard for digital receipts provides a link between purchases of physical items and the specific details of the transaction. This will allow for efficient analysis of transactions by finance systems and wallets leading to futher automation of the financial system.

## Backwards Compatability

This standard is an extension of ERC-721. It is compatible with commonly used optional extensions (IERC721Metadata and IERC721Enumerable) mentioned in the EIP-721 standard.

## Implementation

A Digital Receipts implemention is available at https://github.com/darcys22/digital-receipts-erc and is hosted at receipts.darcyfinancial.com. This implementation provides a generic form to generate a digital receipt, mints the NFT and stores the metadata for the NFT

## Security Considerations

The data stored in the receipt contains personally identifying information. This information should be encrypted to ensure privacy for the customer. TODO sean - draft up a separate ERC for the encryption of NFT metadata.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE.md).
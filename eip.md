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

Using Non-Fungible Tokens as a method of distributing digital receipts for physical purchases. Where the metadata represents an encrypted json receipt.

## Abstract

This EIP proposes a standard schema for digital receipts of transactions occuring on chain. Digital Receipt Non-Fungibles Token are issued by a vendor when a customer makes a purchase from their store and contains transaction details necessary for record keeping. The transaction details are encrypted against the customers public key and kept off chain. Digital Receipt Non-Fungible Tokens extend [ERC-721](./eip-721.md) which allows for representing assets

## Motivation

If a customer purchases a physical item from an online retailer and uses a cryptocurrency to pay, the purchase will separately includes an invoice/receipt from the retailer that is emailed and/or physically given to the customer. These receipts are critical for many reasons but digital receipts have never gained traction. Instead we are left with PDFs and other analogue formats to represent transactions that occurred digitally.

Including an NFT as a receipt will provide a traceable and private link between the funds leaving the customers account and the digital receipt which may include important information such as serial numbers and delivery tracking etc. This means that the customer can automate their record keeping with systems and understand exactly what has been purchased without a human having to provide copies of the receipts. Metamask for example could show this full receipt when you click into an item in your transaction history.

One of the major roadblocks to fully automating our current finance world is that businesses need to keep detailed records of our purchases and retailer systems distribute this detailed information outside of our transactional system (Printing a physical receipt, while separately processing payment through the EFTPOS machine). Requiring a human being to physically make the link between the two, usually by data entry into the financial system. This is archaic and NFTs on the blockchain provide a method for this to be so much better.

## Specification

Transaction Flow:
 - A customer purchases an item from an online retailer, checking out leads the customer to payment through a smart contract.
 - The smart contract verifys the amount transferred matches the order and provides the user with an Digital Receipt Non-Fungible Token.
 - When fulfilling the order, the retailer will upload the digital receipt specified in (1) below, using the encryption method specified in (2) which is encrypted against the customers public key.

The elements of a Non-Fungible Token Digital Receipt as follows:

1) Digital Receipt JSON Schema

This refers to the structure of the JSON digital receipt:

### JSON schema
This refers to the high level receipt
```json
{
  "id": "receipt.json#",
  "description": "Receipt Schema for Digital Receipt Non-Fungible Tokens",
  "type": "object",
  "required": ["id", "date", "vendor", "items"],
  "properties": {
    "id": {
      "title": "ID",
      "description": "Unique Receipt ID",
      "type": "string"
    },
    "date": {
      "title": "Date",
      "description": "Date of Receipt",
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
          "description": "Name of the issuer. E.g. Acme Corp",
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
            "fax": {
              "title": "Fax Number",
              "description": "Fax number of the contact person",
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
    }
  }
}
```

This schema refers to the individual line items on the receipt
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


2) Metadata and Encryption of Digital Receipt

This refers to the structure of the data pointed at by the NFT's url

### UUID

The `uuid` provided in the receipt is a randomly-generated type 4 UUID as specified by [RFC 4122](https://tools.ietf.org/html/rfc4122). It is intended to be used as a 128-bit proxy for referring to a particular receipt, used to uniquely identify receipts.

This element MUST be present.  It MUST be a string following the syntactic structure as laid out in [section 3 of RFC 4122](https://tools.ietf.org/html/rfc4122#section-3).

### Version

The `version` provided is the version of the receipt.

This element MUST be present.  It MUST be the integer `1`.

### Type

The `type` provided is the type of NFT. This informs consumers of the nature of the encrypted data

This element MUST be present.  It MUST be the string `receipt`.

### Crypto

The `crypto` provided is the secure storage of a secret for users that require this information.  For Digital Receipts Non-Fungible Tokens this is the json receipt itself.

This element MUST be present.  It MUST be an object that follows the definition described in section 1 of this specification.


### JSON schema

The receipt follows a similar format to that of the keystore described in [EIP-2335](https://eips.ethereum.org/EIPS/eip-2335).

```json
{
    "$ref": "#/definitions/Receipt",
    "definitions": {
        "Receipt": {
            "type": "object",
            "properties": {
                "crypto": {
                    "type": "object",
                    "properties": {
                        "kdf": {
                            "$ref": "#/definitions/Module"
                        },
                        "checksum": {
                            "$ref": "#/definitions/Module"
                        },
                        "cipher": {
                            "$ref": "#/definitions/Module"
                        }
                    }
                },
                "type": {
                    "type": "string"
                },
                "uuid": {
                    "type": "string",
                    "format": "uuid"
                },
                "version": {
                    "type": "integer"
                }
            },
            "required": [
                "type",
                "uuid",
                "version"
                "crypto"
            ],
            "title": "Receipt"
        },
        "Module": {
            "type": "object",
            "properties": {
                "function": {
                    "type": "string"
                },
                "params": {
                    "type": "object"
                },
                "message": {
                    "type": "string"
                }
            },
            "required": [
                "function",
                "message",
                "params"
            ]
        }
    }
}
```

## Rationale

A standard for digital receipts, provides a link between purchases of physical items, the specific details of the transaction and the transaction on chain. This will allow for efficient analysis of transactions by finance systems and wallets leading to futher automation of the financial system.

## Test Cases

### Test Vector

## Backwards Compatability

This standard is an extension of ERC-721. It is not compatible with commonly used optional extensions (IERC721Metadata and IERC721Enumerable) mentioned in the EIP-721 standard.

## Implementation

##TODO sean build this implementation

## Security Considerations

The data stored in the `crypto` section of the receipt contains personally identifying information. ##TODO Sean more here

## Copyright

Copyright and related rights waived via [CC0](../LICENSE.md).

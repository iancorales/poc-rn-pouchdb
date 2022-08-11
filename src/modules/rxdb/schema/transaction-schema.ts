export const transactionSchema =  {
    "title": "transactions",
    "version": 0,
    "description": "transactions",
    "primaryKey": "id",
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
            "maxLength": 100
        },
        "amount": {
            "type": "string"
        },
        "note": {
            "type": "string",
        },
        "type": {
            "type": "string",
        },
        "isPOS": {
            "type": "boolean",
        },
        "idCustomer": {
            "type": "string",
        },
        "idBusiness": {
            "type": "string",
        },
        "idStore": {
            "type": "string",
        },
    },
    "required": [
        "id",
        "amount"
    ],
  }

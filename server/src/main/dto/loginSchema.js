export default {
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://example.com/root.json",
  "type": "object",
  "title": "The Root Schema",
  "required": [
    "email",
    "password"
  ],
  "properties": {
    "email": {
      "$id": "#/properties/email",
      "type": "string",
      "title": "The Email Schema",
      "default": "",
      "examples": [
        "email@email.com"
      ],
      "pattern": "^(.*)$"
    },
    "password": {
      "$id": "#/properties/password",
      "type": "string",
      "title": "The Password Schema",
      "default": "",
      "examples": [
        "dasdasd31123"
      ],
      "pattern": "^(.*)$"
    }
  }
}
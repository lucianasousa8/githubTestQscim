const rules = [{
  "port": "888",
  "type": "all",
  "block_on_error": true,
  "conditions": [
    {
      "fact": "userName",
      "operator": "notEqual",
      "value": "qriar"
    }
  ],
  "allowed_requests": [
    {
      "path": "users",
      "method": "POST"
    }
  ],
  "position": 0
},{
  "port": "888",
  "type": "all",
  "block_on_error": true,
  "conditions": [
    {
      "fact": "",
      "operator": "equal",
      "value": ""
    }
  ],
  "allowed_requests": [
    {
      "path": "users",
      "method": "POST"
    }
  ],
  "position": 1
},{
  "port": "888",
  "type": "all",
  "block_on_error": true,
  "conditions": [
    {
      "fact": "",
      "operator": "equal",
      "value": ""
    }
  ],
  "allowed_requests": [
    {
      "path": "users",
      "method": "POST"
    }
  ],
  "position": 2
}];
            
module.exports = { rules };
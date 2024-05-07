
    const tracingConfig = {
  "enabled": true,
  "name": "QSCIM Tracing",
  "url": "http://localhost:9411/api/v2/spans",
  "methods": [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
  ],
  "paths": [
    "users",
    "groups"
  ],
  "headers": []
}
    
    module.exports = { tracingConfig }
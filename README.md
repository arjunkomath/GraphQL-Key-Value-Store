# GraphQL-Key-Value-Store
A GraphQL Implementation

##Sample Data (data.json)
```
[
  {"key":"1","value":"Dan"},
  {"key":"2","value":"Lee"},
  {"key":"3","value":"Nick"},
  {"key":"testkey","value":"test"}
]
```

##Querying - GET
```
http://localhost:3000/graphql?query={ keyValueStore ( key: "test") { key, value } }
```
### Response
```
{
  "data": {
    "keyValueStore": {
      "key": "testkey",
      "value": "test"
    }
  }
}
```

##Adding - POST (Mutation)
```
http://localhost:3000/graphql?query=mutation{ add ( key: "testkey", value: "test") { key, value } }
```
### Response
```
{
  "data": {
    "add": {
      "key": "testkey",
      "value": "test"
    }
  }
}
```

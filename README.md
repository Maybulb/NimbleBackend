# Nimble Backend
[Nimble](https://github.com/bright/nimble)'s backend, for dealing with Wolfram|Alpha.

Usage
====

/input is our API input. I'm using input instead of api like most backends
because W|A uses input and we're basically mimicking them here. I don't know,
it just looks clean.

```
https://nimble-backend.herokuapp.com/input?i=query
```

This your answer in JSON. Everything's in the `result` key.

```json
https://nimble-backend.herokuapp.com/input?i=define+smooth
```


```json
{
  "result": {
    "success": true,
    "type":"Word",
    "input":"smooth  (English word) | definitions",
    "result": {
      "word type":"adjective",
      "definition":"having a surface free from roughness or bumps or ridges or irregularities"
    }
  }
}
```

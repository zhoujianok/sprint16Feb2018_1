# Response-size [![NPM version](https://badge.fury.io/js/response-size.png)](http://badge.fury.io/js/response-size) [![Total views](https://sourcegraph.com/api/repos/github.com/darul75/response-size/counters/views.png)](https://sourcegraph.com/github.com/darul75/response-size)

Intuitive http response reminder when response is bigger than your limit ( in bytes ).

It just output a console warning when the limit is reached

## Why ?

Because ecchymose in the nose.

## Install

~~~
npm install response-size
~~~

## Usage

```javascript

// Example with express
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);  
  //....
  app.use(express.json());
  app.use(responseSize({ threshold: 300, enable: true }));
  //....
});

```

## Example console output

```
15:38:51.75 HEAVY RESPONSE: 333 bytes FOR ROUTE /lifeismagic
```

## Options

- **threshold** : limit in bytes, ex: 300
- **enable** : boolean activation 

## License

The MIT License (MIT)

Copyright (c) 2013 Julien Valéry

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

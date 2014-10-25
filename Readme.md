
# update

  Bring the real DOM up to date with the virtual DOM

## Installation

With [packin](//github.com/jkroso/packin): `packin add jkroso/update`

then in your app:

```js
var update = require('update')
```

## API

### `update(from, to, dom)`

Update the `dom` according to the differences between virtual DOM nodes `from` and `to`

```js
var Text = require('iom/text')
var Node = require('iom/node')

var from = new Node('div', {}, [new Node('a'), new Text('b')])
var to = new Node('div', {}, [new Node('a', {className: 'test'})])
var dom = createElement(from)   // => '<div><a></a>b</div>'
var dom = update(from, to, dom) // => '<div><a classname="test"></a></div>'
```

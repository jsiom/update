
# update

  Bring the real DOM up to date with the virtual DOM. Most virtual DOM implementations will generate a diff between two virtual DOM nodes and then use that to update the real DOM. This implementation couples these two operations together for the sake of performance because I don't see myself taking advantage of reified diffs anytime soon.

## Installation

With [packin](//github.com/jkroso/packin): `packin add jsiom/update`

then in your app:

```js
var update = require('update')
```

## API

### `update(from, to, dom)`

Update the `dom` according to the differences between virtual DOM nodes `from` and `to`

```js
var Text = require('create/text')
var Node = require('create/node')

var from = new Node('div', {}, [new Node('a'), new Text('b')])
var to = new Node('div', {}, [new Node('a', {className: 'test'})])
var dom = createElement(from)   // => '<div><a></a>b</div>'
var dom = update(from, to, dom) // => '<div><a classname="test"></a></div>'
```

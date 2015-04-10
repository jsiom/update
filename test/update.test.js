var Node = require('create/node')
var Text = require('create/text')
var update = require('..')
var createElement = update.createElement

describe('createElement', function(){
  it('basic nodes', function(){
    var el = createElement(new Node('div'))
    assert(el instanceof Element)
    assert(el.tagName == 'DIV')
  })

  it('text nodes', function(){
    var el = createElement(new Text('some text'))
    assert(el.nodeValue == 'some text')
  })

  it('svg', function(){
    var el = createElement(new Node('svg', null, [new Node('path', {d:'M50,50L150,50'})]))
    assert(el.outerHTML == '<svg '
                         +   'xmlns="http://www.w3.org/2000/svg" '
                         +   'version="1.1" '
                         +   'height="100%" '
                         +   'width="100%">'
                         +   '<path stroke="black" fill="none" d="M50,50L150,50"></path>'
                         + '</svg>')
  })
})

describe('update', function(){
  it('adding basic properties', function(){
    var a = new Node('div')
    var b = new Node('div', {className:'selected'})
    var dom = update(a, b, createElement(a))
    assert(dom.className == 'selected')
  })

  it('removing basic properties', function(){
    var a = new Node('div', {className:'selected'})
    var b = new Node('div')
    var dom = update(a, b, createElement(a))
    assert(dom.getAttribute('className') == null)
  })

  it('adding children', function(){
    var a = new Node('div')
    var b = new Node('div', {}, [new Node('a')])
    var dom = update(a, b, createElement(a))
    assert(dom.outerHTML == '<div><a></a></div>')
  })

  it('removing children', function(){
    var a = new Node('div', {}, [new Node('a')])
    var b = new Node('div')
    var dom = update(a, b, createElement(a))
    assert(dom.outerHTML == '<div></div>')
  })

  it('swapping children', function(){
    var a = new Node('div', {}, [new Node('a')])
    var b = new Node('div', {}, [new Node('b')])
    var dom = update(a, b, createElement(a))
    assert(dom.outerHTML == '<div><b></b></div>')
  })

  it('removing and mutating children', function(){
    var a = new Node('div', {}, [new Node('a'), new Text('b')])
    var b = new Node('div', {}, [new Node('a', {className: 'test'})])
    var dom = update(a, b, createElement(a))
    assert(dom.outerHTML == '<div><a class="test"></a></div>')
  })

  it('adding and mutating children', function(){
    var a = new Node('div', {}, [new Node('a', {className: 'test'})])
    var b = new Node('div', {}, [new Node('a'), new Text('b')])
    var dom = update(a, b, createElement(a))
    assert(dom.outerHTML == '<div><a class=""></a>b</div>')
  })
})

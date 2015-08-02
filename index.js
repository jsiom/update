/**
 * Update the `dom` according to the differences between
 * virtual DOM nodes `a` and `b`
 *
 * @param {VirtualDOM} a
 * @param {VirtualDOM} b
 * @param {DOMElement} dom
 */

function update(a, b, dom) {
  b = handleThunk(b, a)
  a = handleThunk(a)

  if (a === b) return dom
  if (b == null) return remove(dom)
  if (a.type != b.type) return replace(dom, b)

  if (a.type == 'VirtualNode') {
    if (a.tagName != b.tagName) return replace(dom, b)
    updateProps(a.properties, b.properties, dom)
    updateChildren(a, b, dom)
    return dom
  }

  if (a.type == 'VirtualText') {
    if (a.text != b.text) dom.nodeValue = b.text
    return dom
  }

  return dom
}

function updateProps(a, b, dom) {
  for (var key in a) {
    if (key in b) {
      if (a[key] != b[key]) setAttribute(dom, key, b[key])
    } else if (key == 'className') {
      dom.className = '' /*browser bug workaround*/
    } else {
      dom.removeAttribute(key)
    }
  }

  for (var key in b) {
    key in a || setAttribute(dom, key, b[key])
  }
}

function updateChildren(a, b, dom) {
  var aChildren = a.children
  var bChildren = b.children
  var dChildren = dom.childNodes
  var l = aChildren.length
  // remove redundant nodes
  while (l > bChildren.length) {
    dom.removeChild(dChildren[--l])
  }
  // mutate existing nodes
  for (var i = 0; i < l; i++) {
    update(aChildren[i], bChildren[i], dChildren[i])
  }
  // append extras
  while (l < bChildren.length) {
    dom.appendChild(createElement(bChildren[l++]))
  }
}

/**
 * Create a native DOM node from a virtual node
 *
 * @param {Any} vnode
 * @return {Element}
 */

function createElement(vnode) {
  if (vnode instanceof Element) return vnode // already DOM
  if (vnode.type == 'VirtualText') return document.createTextNode(vnode.text)
  if (vnode.type == 'Thunk') return createElement(vnode.call())

  var node = typeof createElement[vnode.tagName] == 'function'
    ? createElement[vnode.tagName](vnode.tagName)
    : document.createElement(vnode.tagName)

  var props = vnode.properties
  for (var key in props) setAttribute(node, key, props[key])

  vnode.children.forEach(function(child){
    node.appendChild(createElement(child))
  })

  return node
}

createElement.svg = function(){
  var el = createSVG('svg')
  el.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  el.setAttribute('version', '1.1')
  el.setAttribute('height', '100%')
  el.setAttribute('width', '100%')
  return el
}

createElement.path = function(){
  var el = createSVG('path')
  el.setAttribute('stroke', 'black')
  el.setAttribute('fill', 'none')
  return el
}

createElement.polyline =
createElement.ellipse =
createElement.polygon =
createElement.circle =
createElement.text =
createElement.line =
createElement.rect =
createElement.g = createSVG

function createSVG(tag) {
  return document.createElementNS('http://www.w3.org/2000/svg', tag)
}

/**
 * Set an attribute on `el`
 *
 * @param {Node} el
 * @param {String} key
 * @param {Any} value
 */

function setAttribute(el, key, value) {
  if (key == 'style') {
    for (key in value) el.style[key] = value[key]
  } else if (key == 'isfocused') {
    // Since HTML doesn't specify an isfocused attribute we fake it
    if (value) setTimeout(function(){ el.focus() })
  } else if (key == 'value') {
    // often value has already updated itself
    if (el.value != value) el.value = value
  } else if (key == 'className') {
    // Chrome doesn't handle setAttribute('className') well
    el.className = value
  } else {
    el.setAttribute(key, value)
  }
}

function handleThunk(a, b) {
  return a && a.type == 'Thunk' ? a.call(b) : a
}

function remove(el) {
  el.parentNode.removeChild(el)
}

var tmp = document.createElement('div')

function replace(dom, vdom) {
  var parent = dom.parentElement
  // incase the same literal DOM node is in both the
  // old and new tree
  parent.replaceChild(tmp, dom)
  return parent.replaceChild(createElement(vdom), tmp)
}

update.createElement = createElement
module.exports = update

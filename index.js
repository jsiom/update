/**
 * Update the `dom` according to the differences between
 * virtual DOM nodes `a` and `b`
 *
 * @param {VirtualDOM} a
 * @param {VirtualDOM} b
 * @param {DOMElement} dom
 */

function update(a, b, dom) {
  a = handleThunk(a)
  b = handleThunk(b, a)

  if (a === b) return dom
  if (b == null) return remove(dom)
  if (a.type != b.type) return replace(dom, createElement(b))

  if (a.type == 'VirtualNode') {
    if (a.tagName != b.tagName) return replace(dom, createElement(b))
    updateProps(a.properties, b.properties, dom)
    updateChildren(a, b, dom)
    return dom
  }

  if (a.type == 'VirtualText') {
    if (a.text != b.text) dom.nodeValue = b.text
    return dom
  }
}

function updateProps(a, b, dom) {
  for (var key in a) {
    // if (!validAttr[key]) continue
    if (key in b) {
      if (a[key] != b[key]) dom.setAttribute(key, b[key])
    } else {
      dom.removeAttribute(key)
    }
  }

  for (var key in b) {
    // if (!validAttr[key]) continue
    if (key in a) continue
    dom.setAttribute(key, b[key])
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
  if (vnode.type == 'VirtualText') return document.createTextNode(vnode.text)
  if (vnode.type == 'Widget') return vnode.init()
  if (vnode.type == 'Thunk') return createElement(unboxThunk(vnode))

  var node = document.createElement(vnode.tagName)
  var props = vnode.properties
  for (var key in props) {
    node.setAttribute(key, props[key])
  }

  vnode.children.forEach(function(child){
    node.appendChild(createElement(child))
  })

  return node
}

function handleThunk(a, b) {
  return a && a.type == 'Thunk' ? unboxThunk(a, b) : a
}

function unboxThunk(thunk, previous) {
  var node = thunk.vnode
  if (node) return node
  return thunk.vnode = thunk.render(previous)
}

function remove(el) {
  el.parentNode.removeChild(el)
}

function replace(old, NEW) {
  old.parentNode.replaceChild(NEW, old)
  return NEW
}

update.createElement = createElement
module.exports = update

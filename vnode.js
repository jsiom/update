
var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children) {
	this.tagName = tagName
	this.properties = properties || noProperties
	this.children = children || noChildren
}

VirtualNode.prototype.type = 'VirtualNode'

module.exports = VirtualNode

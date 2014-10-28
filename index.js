
var children = require('ast-children')
var concat = Function.call.bind([].concat)

/**
 * rename all references to `it` in or below `nodes`'s
 * scope to `to`
 *
 * @param {AST} node
 * @param {String} it
 * @param {String} to
 */

function rename(node, it, to){
  switch (node.type) {
    case 'VariableDeclaration':
      return node.declarations.forEach(function(dec){
        if (dec.id.name == it) dec.id.name = to
        if (dec.init) rename(dec.init, it, to)
      })
    case 'FunctionDeclaration':
      if (node.id.name == it) node.id.name = to // falls through
    case 'FunctionExpression':
      var isIt = function(id){ return id.name == it }
      return isIt(node.id)
        || node.params.some(isIt)
        || freshVars(node.body).some(isIt)
        || rename(node.body, it, to)
    case 'CatchClause':
      if (node.param.name == it) return
      return rename(node.body, it, to)
    case 'Identifier':
      return node.name == it && (node.name = to)
  }
  children(node).forEach(function(child){
    rename(child, it, to)
  })
  return node
}

/**
 * get all declared variables within `node`'s scope
 *
 * @param {AST} node
 * @return {Array}
 */

function freshVars(node){
  switch (node.type) {
    case 'VariableDeclaration':
      return node.declarations.map(function(n){ return n.id })
    case 'FunctionExpression': return [] // early exit
    case 'FunctionDeclaration':
      return [node.id]
  }
  return children(node)
    .map(freshVars)
    .reduce(concat, [])
}

module.exports = rename


var gen = require('escodegen').generate
var parse = require('esprima').parse
var rename = require('..')

function test(from, to){
  var a = parse(String(from))
  var b = parse(String(to))
  rename(a, 'a', 'b')
  try { a.should.eql(b) }
  catch (e) {
    console.log()
    console.log(gen(a))
    throw e
  }
}

it('declarations', function(){
  test('thing', 'thing')
  test('a', 'b')
  test('var a', 'var b')
  test('function a(){}', 'function b(){}')
})

it('multiple scopes', function(){
  test('function a(){a};a', 'function b(){b};b')
  test('(function a(){a});a', '(function a(){a});b')
})

it('try-catch', function(){
  test('try{a}catch(a){a}', 'try{b}catch(a){a}')
})

it('member expressions', function(){
  test('thing[a]', 'thing[b]')
  test('thing.a', 'thing.a')
})

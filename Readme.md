
# rename-variables

  Safely rename JS variables

## Installation

With your favorite package manager:

- [packin](//github.com/jkroso/packin): `packin add rename-variables`
- [component](//github.com/component/component#installing-packages): `component install jkroso/rename-variables`
- [npm](//npmjs.org/doc/cli/npm-install.html): `npm install rename-variables`

then in your app:

```js
var rename = require('rename-variables')
```

## API

### rename(node, from, to)

Recursively renames all identifiers with the name `from` within `node` to `to`. It will abort once it reaches a scope where `from` is shadowed.

```js
var parse = require('esprima').parse
rename(parse('var a = 1'), 'a', 'b') // => parse('var b = 1')
rename(parse('a;var a'), 'a', 'b') // => parse('b;var b')
rename(parse('function a(a){a}'), 'a', 'b') // => parse('function b(a){a}')
rename(parse('try{a}catch(a){a}'), 'a', 'b') // => parse('try{b}catch(a){a}')
```

# get-param-names

The best library to parse a function into its parameter names.

Created because of dissatisfaction with existing npm libraries:
- [**get-params**](https://www.npmjs.com/package/get-params): No support for object and Array decomposers; completely ignores default parameters
- [**get-parameter-names**](https://github.com/goatslacker/get-parameter-names): Extremely poorly written

Advantages of this library over others:
- Extremely easy user-side syntax
- Support for object and Array decomposers passed as function parameters
- Low package size
- Intuitive return result
- Attractive and readable code
- Runs synchronously and fast
- Uses the latest ECMAScript 6 specifications

Maintained by [theLAZYmd](https://github.com/theLAZYmd/), please report any issues found.

## Example Usages

### Installation:
Use `npm install get-param-names` to download the package to your workspace.
Then write the following at the top of any file that you wish to use the module:
```js
const getParamNames = require('get-param-names');
```
and simply use the constant as a function wherever needed.
Returns an array of parameter names, as specified in the function definition.

### Example 1
##### Simple named function
```js
function f0(self, meme, init) {
	return [self, meme, init];
}
console.log(getParamNames(f0)); // ["self", "meme", "init"]
```

### Example 2
##### Simple named function with default parameters
```js
function f1(str = 'hello', arr = ['what\'s up']) {
	return [str, arr];
}
console.log(getParamNames(f1)); // ["str", "arr"]
```

### Example 3
##### Simple arrow function with string parameters
```js
let f2 = (meme, param) => [meme, param];
console.log(getParamNames(f2)); // ["meme", "param"]
```

### Example 4
##### Function with deconstructed Object parameter
```js
async function f3(ids, {
	fetch = false,
	filter = user => user,
	arr = []
} = {}) {
	return [ids, fetch, filter.toString(), arr];
}
console.log(getParamNames(f3)); // [ 'ids', { fetch: false, filter: 'user => user', arr: [] } ]
```

### Example 5
##### Complex function with deconstructed Object parameter, deconstructed Array parameter, and default Object and Array values
```js
async function f4({
	item1,
	item2 = {
		prop1: true,
		prop2: false,
		prop3: ['array', 'of', 'strings']
	}
} = {}, [item3, item4, [item5, item6]]) {
	return [item1, item2, item3, item4, item5, item6];
}
console.log(getParamNames(f4)); //[{"item2":{"prop1":true,"prop2":false,"prop3":["array","of","strings"]}},["item3","item4",["item5","item6"]]]
```
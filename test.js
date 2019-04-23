/*eslint no-console: "off"*/
/*eslint-disable max-len */

const getParamNames = require('./main.js');




function f0(self, meme, init) {
	return [self, meme, init];
}
console.log(getParamNames(f0)); // ["self", "meme", "init"]




function f1(str = 'hello', arr = ['what\'s up']) {
	return [str, arr];
}
console.log(getParamNames(f1)); // ["str", "arr"]



let f2 = (meme, param) => [meme, param];
console.log(getParamNames(f2)); // ["meme", "param"]



async function f3(ids, {
	fetch = false,
	filter = user => user,
	arr = []
} = {}) {
	return [ids, fetch, filter.toString(), arr];
}
console.log(getParamNames(f3)); // [ 'ids', { fetch: false, filter: 'user => user', arr: [] } ]



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
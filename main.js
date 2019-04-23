/**
 * Defined outside the constructor so that they are interpreted once and stored in memory
 * @property {regex} arrow - Used to parse arrow functions, execs arguments section
 * @property {regex} func - Used to parse functions defined with a keyword, execs arguments
 * @property {regex} comments - Finds comments for removal
 * @property {regex} object - Finds parameters that are decomposed objects
 * @property {regex} array - Finds parameters that are decomposed arrays
 * @type {Object}
 */
const regex = {
	arrow: /^\(?([\w\s,]+)\)?\s*=>/,
	func: /(?:function|static|async)?\s*\w+\s?\(([\w\s=>"',:{}[\]\\]*)\)/,
	comments: /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
	object: /^{([\w\s=>"',:{}[\]\\]*)*}$/,
	array: /^\[[\w\s=>"',:{}[\]\\]*]$/,
	json: /\{.*:\{.*:.*\}\}/g
};

class getParamNames {

	/**
	 * @constructor
	 * @param {Function} f - The function for which parameter names should be returned
	 */
	constructor(f) {
		this.f = f;
	}

	/**
	 * Little function wrapper to call the output result
	 * @returns {*[]}
	 * @public
	 */
	run () {
		return this.params;
	}

	/**
	 * The string version of the function passed to the constructor
	 * @name getParamNames#str
	 * @type {string}
	 * @private
	 */
	get str () {
		if (this._str) return this._str;
		return this._str = this.f.toString().trim();
	}

	/**
	 * @name getParamNames#arg
	 * @type {string}
	 * @private
	 */
	get arg () {
		if (this._arg) return this._arg;
		if (regex.arrow.test(this.str)) return this._arg = this.str.match(regex.arrow)[1];
		else if (regex.func.test(this.str)) return this._arg = this.str.match(regex.func)[1];
		throw new Error('Function parsing failed, review:\n' + this.str);
	}

	/**
	 * Returns the legitimately comma-separated argument, accounting for deconstructors
	 * @name getParamNames#commaSeparated
	 * @type {string[]}
	 * @private
	 */
	get sep () {
		if (this._sep) return this._sep;
		return this._sep = getParamNames.splitCommas(this.arg.replace(regex.comments, ''));
	}

	/**
	 * Returns each parameter formatted perfectly - decompositions are in their object format
	 * Arrays - listed as an array of strings where each string is the decomposed name
	 * Objects - listed as an object with key: decomposed name, and value: true|default value
	 * @name getParaNames#params
	 * @type {*[]}
	 * @private
	 */
	get params () {
		if (this._params) return this._params;
		return this._params = this.sep
			.map(i => {
				if (i.indexOf('=') !== -1) i = getParamNames.splitEquals(i)
					.slice(0, -1)
					.join('=')
					.trim();
				return getParamNames.decompose(i);
			});
	}
	
	/**
	 * Splits a single at any '=' sign, critically ignoring any '=>' signs
	 * @param {string} str
	 * @returns {string[]}
	 * @private
	 */
	static splitEquals (str) {
		return str
			.trim()
			.split('=')
			.reduce((acc, curr) => {
				if (curr.startsWith('>')) acc[acc.length - 1] += '=' + curr;
				else acc.push(curr);
				return acc;
			}, []);
	}

	/**
	 * Splits a string at any ',' sign, keeping objects and arrays intact
	 * @param {string} str
	 * @returns {string[]}
	 * @private
	 */
	static splitCommas (str) {
		let obj = null;
		let arr = str.split(',').map(i => i.trim());
		return arr.reduce((acc, curr) => {
			if (obj) acc[acc.length - 1] += ', ' + curr.trim();
			else acc.push(curr.trim());
			if (curr.includes('[')) obj = ']';
			else if (curr.includes('{')) obj ='}';
			if (curr.endsWith(obj)) obj = null;
			return acc;
		}, []);
	}

	/**
	 * Takes a string input to a function and decomposes it, like a compiler, to get variable names
	 * Is recursive since decomposing Arrays and Objects might have further decomposition properties
	 * @param {string} str
	 * @returns {*[]}
	 * @private
	 */
	static decompose (str) {
		if (regex.object.test(str)) {
			if (str === '{}') return {};
			let obj = {};
			const val = str.slice(1, -1).trim();
			const entries = getParamNames.splitCommas(val);
			for (let entry of entries) {
				let [key, value] = getParamNames.splitEquals(entry);
				if (typeof value === 'undefined') [key, value] = key.split(':');
				if (typeof value !== 'undefined') value = getParamNames.decompose(value.trim());
				obj[key.trim()] = value;
			}
			return obj;
		} else
		if (regex.array.test(str)) {
			if (str === '[]') return [];
			let arr = getParamNames.splitCommas(str.slice(1, -1).trim());
			for (let i = 0; i < arr.length; i++) {
				arr[i] = getParamNames.decompose(arr[i]);
			}
			return arr;
		} else
		if (str.trim() === 'true') return true;
		else if (str.trim() === 'false') return false;
		str = str.replace(/'/g, '');
		return str;
	}

}

module.exports = (f) => {
	const Instance = new getParamNames(f);
	return Instance.run();
};
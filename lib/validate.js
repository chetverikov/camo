var _ = require('lodash');

var isString = function(s) {
	return _.isString(s);
};

var isNumber = function(n) {
    return _.isNumber(n) && _.isFinite(n) && !isString(n);
};

var isBoolean = function(b) {
	return _.isBoolean(b);
};

var isDate = function(d) {
	return isNumber(d) || _.isDate(d);
};

var isBuffer = function(b) {
	return typeof b === 'object' || b instanceof Buffer;
};

var isObject = function(o) {
	return _.isObject(o);
};

var isArray = function(a) {
	return _.isArray(a);
};

var isModel = function(m) {
    return m && m.extendsDocument && m.extendsDocument();
};

var isSupportedType = function(t) {
    return (t === String || t === Number || t === Boolean ||
            t === Buffer || t === Date || t === Array ||
            isArray(t) || t === Object || (t.extendsDocument && t.extendsDocument()));
};

var isType = function(value, type) {
	if (type === String) {
        return isString(value);
    } else if (type === Number) {
        return isNumber(value);
    } else if (type === Boolean) {
        return isBoolean(value);
    } else if (type === Buffer) {
        return isBuffer(value);
    } else if (type === Date) {
        return isDate(value);
    } else if (type === Array || isArray(type)) {
        return isArray(value);
    } else if (type === Object) {
        return isObject(value);
    } else if (type.extendsDocument && type.extendsDocument()) {
        return isModel(value);
    } else {
        throw new Error('Unsupported type: ' + type.name);
    }
};

var isValidType = function(value, type) {
    // NOTE
    // Maybe look at this: 
    // https://github.com/Automattic/mongoose/tree/master/lib/types

    // TODO: For now, null is okay for all types. May
    // want to specify in schema using 'nullable'?
    if (value === null) return true;

    // Arrays take a bit more work
    if (type === Array || isArray(type)) {
        // Validation for types of the form [String], [Number], etc
        if (isArray(type) && type.length > 1) {
        	throw new Error('Unsupported type. Only one type can be specified in arrays, but multiple found:', + type);
        }

        if (isArray(type) && type.length === 1 && isArray(value)) {
        	var arrayType = type[0];
        	for (var i = 0; i < value.length; i++) {
        		var v = value[i];
        		if (!isType(v, arrayType)) {
        			return false;
        		}
        	}
        }

        return true;
    }

    return isType(value, type);
};

var isInChoices = function(choices, choice) {
	if (!choices) {
		return true;
	}
	return choices.indexOf(choice) > -1;
};

exports.isString = isString;
exports.isNumber = isNumber;
exports.isBoolean = isBoolean;
exports.isDate = isDate;
exports.isBuffer = isBuffer;
exports.isObject = isObject;
exports.isArray = isArray;
exports.isModel = isModel;
exports.isSupportedType = isSupportedType;
exports.isType = isType;
exports.isValidType = isValidType;
exports.isInChoices = isInChoices;
"use strict";

function parseKeyValueString(str) {
    try {
        let obj = {};
        str.split(";").forEach((e) => {
            const [key, value] = e.split("=");
            obj[key] = value;
        });
        return obj;
    } catch(e) {return false};
}

function objectToKeyValue(object) {
    let query = "";
    for(let [key, value] of Object.entries(object)) {
        query += `${key}=${value};`;
    }
    return query.slice(0, query.length - 1);
}

function generateToken(length = 64) {
	const set = "0123456789azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN"
    let token = "";
    for(let i = 0; i < length; i++) {
		token += set[Math.round( Math.random() * (set.length - 1) )];
    }
    return token;
}

function validateForm(form, conditions, null_enabled = false) {

    let errors = [];
    for(let [key, value] of Object.entries(form)) {
        if(value === undefined) {
            if(!null_enabled)
                errors.push(`${key} non définie`);
            continue;
        }

        let min, max, type = undefined;
        if(conditions[key] != undefined) {
            max = conditions[key].max;
            min = conditions[key].min;
            type = conditions[key].type;

        } else continue;

        if(min != undefined && value.length < min) {
            errors.push(`${key} doit être supérieur à ${min}`);
        }

        if(max != undefined && value.length > max) {
            errors.push(`${key} doit être inférieur à ${max}`);
        }

        if(type != undefined && typeof value !== type) {
            errors.push(`${key} doit être un ${type}, ${typeof key} reçu`);
        }
    }

    return errors.length ? errors : false;
}

module.exports = {
	parseKeyValueString,
	objectToKeyValue,
	//addZeros,
	generateToken,
    //formatDate,
    validateForm
};
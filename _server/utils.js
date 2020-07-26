"use strict";

function parseKeyValueString(str) {
    let obj = {};
    str.split(";").forEach((e) => {
        const [key, value] = e.split("=");
        obj[key] = value;
    });
    return obj;
}

function objectToKeyValue(object) {
    let query = "";
    for(let [key, value] of Object.entries(object)) {
        query += `${key}=${value};`;
    }
    return query.slice(0, query.length - 1);
}
/*
function addZeros(value, length, filler = "0") {
    try {
        let str = value.toString();
        while(str.length < length) {
            str = `${filler}${str}`;
        }
        return str;
    } catch(e) { return null }
}*/

function generateToken(length = 64) {
	const set = "0123456789azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN"
    let token = "";
    for(let i = 0; i < length; i++) {
		token += set[Math.round( Math.random() * (set.length - 1) )];
    }
    return token;
}
/*
function formatDate(d) {
	const {day, month, year, hours, minutes} = {
		day: addZeros(d.getDate(), 2),
		month: addZeros(d.getMonth() + 1, 2),
		year: d.getFullYear(),
		hours: addZeros(d.getHours(), 2),
		minutes: addZeros(d.getMinutes(), 2),
	}
	
	return `${day}/${month}/${year}, ${hours}h${$minutes}`;
}*/

function validateForm(form, conditions) {

    let errors = [];
    for(let [key, value] of Object.entries(form)) {
        if(!value) {
            errors.push(`${key} non définie`);
            continue;
        }

        let min, max = undefined;
        if(conditions[key] != undefined) {
            max = conditions[key].max;
            min = conditions[key].min;

        } else continue;

        if(min != undefined && value.length <= min) {
            errors.push(`${key} doit être supérieur à ${min}`);
        }

        if(max != undefined && value.length >= max) {
            errors.push(`${key} doit être inférieur à ${max}`);
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
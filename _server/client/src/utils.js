export function sendBody(url, body) {

    const params = {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(body)
    }

    return new Promise((resolve, reject) => {
        fetch(url, params)
            .then(data => {
                if(!data.ok) {
                    reject(data);
                }
                else {
                    resolve(data);
                };
            }).catch(error => reject(error));
    });
}

export function sendForm(url, method, data, callback) {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if(xhr.status !== 200) {
            callback(true, xhr.response);
        } else callback(false, xhr.response);
    };

    xhr.send(data);
}

export function validateForm(form, conditions) {

    let errors = [];
    for(let [key, value] of Object.entries(form)) {
        if(!value) {
            errors.push(`${key} non définie`);
            continue;
        }

        let min, max = undefined;
        if(conditions[key] !== undefined) {
            max = conditions[key].max;
            min = conditions[key].min;

        } else continue;

        if(min !== undefined && value.length < min) {
            errors.push(`${key} doit être supérieur à ${min}`);
        }

        if(max !== undefined && value.length > max) {
            errors.push(`${key} doit être inférieur à ${max}`);
        }
    }

    return errors.length ? errors : false;
}

export function getUrlQuery(object) {
    let key_values = [];
    for(const [key, value] of Object.entries(object)) {
        key_values.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }

    return key_values.join("&");
}

export function addZeros(value, length, filler = "0") {
    try {
        let str = value.toString();
        while(str.length < length) {
            str = `${filler}${str}`;
        }
        return str;
    } catch(e) { return null }
}

export function formatDate(d) {
	const {day, month, year, hours, minutes} = {
		day: addZeros(d.getDate(), 2),
		month: addZeros(d.getMonth() + 1, 2),
		year: d.getFullYear(),
		hours: addZeros(d.getHours(), 2),
		minutes: addZeros(d.getMinutes(), 2),
	}
	
	return `${day}/${month}/${year}, ${hours}h${minutes}`;
}
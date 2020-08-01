//Old
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

//new
export function sendForm({url, method, type}, data = {}, callback = (err)=>{}) {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);

    xhr.onload = function() {
        if(xhr.status !== 200) {
            callback(true, xhr.response);
        } else callback(false, xhr.response);
    };

    if(type === "json") {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send(data);
    }
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
            errors.push({content:`${key} doit être supérieur à ${min}`, col:"red"});
        }

        if(max !== undefined && value.length > max) {
            errors.push({content:`${key} doit être inférieur à ${max}`, col:"red"});
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

export function formatDate(str_d) {

    const d = new Date(str_d);

	const {day, month, year, hours, minutes} = {
		day: addZeros(d.getDate(), 2),
		month: addZeros(d.getMonth() + 1, 2),
		year: d.getFullYear(),
		hours: addZeros(d.getHours(), 2),
		minutes: addZeros(d.getMinutes(), 2),
	}
	
	return `${day}/${month}/${year}, ${hours}h${minutes}`;
}

//export function escapeHtmlTags(string) {
//    if (string)
//        return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
//    else return "";
//}
//
//export function parseMessages(str) {
//    return str.replace(    /\*(.*?)\*/gi, '<span style="font-style: italic">$1</span>')
//              .replace(/\*\*(.*?)\*\*/gi, '<span style="font-weight: bold" >$1</span>');
//}
//
//export function escapeAndParse(str) {
//    str = escapeHtmlTags(str);
//    return parseMessages(str);
//}

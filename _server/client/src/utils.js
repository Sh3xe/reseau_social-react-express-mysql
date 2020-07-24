
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
                    try {
                        data.json().then(e =>{
                            reject(e);
                        });
                    } catch(e) {
                        reject(data);
                    }
                }
                else resolve(data);
            }).catch(error => reject(error));
    });
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
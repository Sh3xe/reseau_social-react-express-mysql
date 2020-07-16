function parseKeyValue(str) {
    let obj = {};
    str.split(";").forEach((e) => {
        const [key, value] = e.split("=");
        obj[key] = value;
    });
    return obj;
}

function addZeros(value, length, filler = "0") {
    try {
        let str = value.toString();
        while(str.length < length) {
            str = `${filler}${str}`;
        }
        return str;
    } catch(e) { return null }
}

function generateToken(length) {
    const chars = "0123456789azertyuiopqsdfghjklmwxcvbn";
    let token = "";
    for(let i = 0; i < length; i++) {
        token += chars[Math.round( Math.random() * (chars.length - 1) )];
    }
    return token;
}
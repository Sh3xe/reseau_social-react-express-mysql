function sendHttpRequest(method, url, body, callback) {
    var xhr = new XMLHttpRequest();

    xhr.open(method, url);

    xhr.send(body);

    xhr.onload = function() {
        if(xhr.status == 200) {
            callback(JSON.parse(xhr.responseText));
        }
    }
}
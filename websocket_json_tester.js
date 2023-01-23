// HTML elements this program interacts with
const url_input = document.querySelector("#url_input");
const body_input = document.querySelector("#body_input");
const output = document.querySelector("#output");
// variable for websocket
let socket = null;

function add_paragraf_to_output(paragraf) {
    output.innerHTML += paragraf;
    output.innerHTML += "\n\n";
    output.scrollTop = output.scrollHeight;
}

// socket event actions
function socket_ononopen(event) {
    add_paragraf_to_output("Successfully connected!");
}

function socket_onmessage(event) {
    data = JSON.parse(event.data);
    message = "socket_onmessage:\n" + JSON.stringify(data, null, 4);
    add_paragraf_to_output(message);
}

function socket_onerror(event) {
    message = "socket_onerror:\n" + event;
    add_paragraf_to_output(message);
    console.log("socket_onerror:\n", event);
}

function socket_onclose(event) {
    message = "socket_onclose:\n" + event;
    add_paragraf_to_output(message);
    console.log("socket_onclose:\n", event);
    socket = null;
}

// when you click CONNECT button
document.querySelector("#connect").onclick = function(event) {
    if (socket != null) { // silently closes the previous socket
        socket.onclose = null;
        socket.close();
    }
    message = "Connecting to " + url_input.value
    add_paragraf_to_output(message);
    try {
        socket = new WebSocket(url_input.value);
        // passing on the socket functions
        socket.onopen = socket_ononopen;
        socket.onmessage = socket_onmessage;
        socket.onerror = socket_onerror;
        socket.onclose = socket_onclose;
    } catch (error) {
        socket = null;
        add_paragraf_to_output(error);
    }
}

// when you click SEND button
document.querySelector("#send").onclick = function(event) {
    if (socket == null) {
        alert("First you need to connect to a WebSocket!");
        return;
    }
    if (socket.readyState == WebSocket.CONNECTING) {
        alert("WebSocket is still connecting!");
        return;
    }
    try {
        body = JSON.parse(body_input.value);
        socket.send(JSON.stringify(body));
    } catch (error) {
        add_paragraf_to_output(error);
    }
}

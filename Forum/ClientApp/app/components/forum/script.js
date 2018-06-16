var test = function () {
    console.log("aufgerufen");
    const channel = new BroadcastChannel('post');
    channel.onmessage = function (msg) {
        console.log("Received!!!!!");
    }
}

let connectInterval;

function connect() {
  const ws = new WebSocket("ws://localhost:4242");
  ws.onopen = () => {
    console.log("Connected to server");
    clearInterval(connectInterval);
  };
  ws.onmessage = (event) => {
    if (event.data === "reload") {
      location.reload();
    }
  };
  ws.onclose = () => {
    connectInterval = setInterval(connect, 1000);
  };
}

connectInterval = setInterval(connect, 1000);
connect();

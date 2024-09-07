export function reloader() {
  const server = Bun.serve({
    port: 4242,
    fetch(req, server) {
      const success = server.upgrade(req);
      console.log(success ? "Websocket connected" : "Websocket failed");
    },
    websocket: {
      message(ws, message) {},
      open(ws) {
        ws.subscribe("reload");
      },
    },
  });
  return {
    reload: () => server.publish("reload", "reload"),
  };
}

export const reloadScript = `
  <script>
    const ws = new WebSocket("ws://localhost:4242");
    ws.onmessage = (event) => {
      if (event.data === "reload") {
        location.reload();
      }
    };
  </script>
`;

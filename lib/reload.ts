export function reloader() {
  const server = Bun.serve({
    port: 4242,
    fetch(req, server) {
      const success = server.upgrade(req);
      console.log(success ? "Browser connected" : "Browser failed to connect");
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

export const reloadScript = `<script src="https://${process.env.OMG_ADDRESS}.weblog.lol/reload.js"></script>`;

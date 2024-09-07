--- Dev ---

<script>
  const ws = new WebSocket("ws://localhost:4242");
  ws.onmessage = (event) => {
    if (event.data === "reload") {
      location.reload();
    }
  };
</script>

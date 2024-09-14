# brock.omg.lol

### Setup

Requires [Bun](https://bun.sh). Install dependencies:

```sh
bun install
```

Define `OMG_KEY` in `.env`.

### Develop

List all commands with `just`:

```sh
just
# Also available via bun
bunx just
```

To develop locally with live-reload:

```sh
just web
```

```sh
just weblog entry-name.md
```

### Deploy

Changes are deployed as preview/unlisted on PR and published on merge.

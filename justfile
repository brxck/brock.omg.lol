export OMG_ADDRESS := "brock"
export PATH := "./node_modules/.bin:" + env_var('PATH')

[private]
default: list

# List all commands
@list:
  just --list

# Develop web with watcher
web:
  open https://home.omg.lol/address/{{OMG_ADDRESS}}/web/preview
  bun --hot script/web.ts watch

# Save web preview
web-preview:
  bun script/web.ts preview

# Publish web
web-publish:
  bun script/web.ts publish

# Develop weblog with watcher
weblog name:
  open https://home.omg.lol/address/{{OMG_ADDRESS}}/weblog
  bun --hot script/weblog.ts watch {{name}}

# Save weblog preview of changed files
weblog-preview base='main' head='HEAD':
  bun script/weblog.ts preview {{base}} {{head}}

# Publish changed weblog files
weblog-publish base='main' head='HEAD':
  bun script/weblog.ts publish {{base}} {{head}}

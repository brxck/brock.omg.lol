export PATH := "./node_modules/.bin:" + env_var('PATH')

default: list

list:
  just --list

# Develop with file watcher
web:
  open https://home.omg.lol/address/brock/web/preview
  bun --hot script/web.ts watch

# Preview without publishing
web-preview:
  bun script/web.ts watch

# Publish to the web
web-publish:
  bun script/web.ts publish

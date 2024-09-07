export PATH := "./node_modules/.bin:" + env_var('PATH')

default: list

list:
  just --list

web:
  open https://home.omg.lol/address/brock/web/preview
  bun --watch web/watch.ts

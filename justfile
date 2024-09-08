export PATH := "./node_modules/.bin:" + env_var('PATH')

[private]
default: list

# List all commands
@list:
  just --list

# Get changed files in {dir}
changed dir:
  git diff --name-only origin/main | grep {{dir}}

# Develop web with watcher
web:
  open https://home.omg.lol/address/brock/web/preview
  bun --hot script/web.ts watch

# Save web preview
web-preview:
  bun script/web.ts preview

# Publish web
web-publish:
  bun script/web.ts publish

# Develop weblog with watcher
weblog name:
  bun --hot script/weblog.ts watch {{name}}

# Save weblog preview of {files} or changed files
weblog-preview *files:
  #!/usr/bin/env bash
  set -uexo pipefail
  FILES="{{files}}"
  FILES=${FILES:-$(just changed weblog)}
  echo $FILES | xargs bun script/weblog.ts preview

# Publish weblog {files}
weblog-publish +files:
  echo "{{files}}" | xargs bun script/weblog.ts publish

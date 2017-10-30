
# dist-js (WIP)

> Create dist version of your JS.

Combines multiple tools for easily creating dist version of your JS.

```
$ dist-js -f dist/app.js
```

This will

- Run `babel` with `babel-preset-env`
- Run `uglify-es` on the results of babel
- Create `.js.map` beside the output

## Install

```
$ npm i -D dist-js
```

### `dist-js [...options]`

 - `--input`, `-i` the input file to compile
 - `--output`, `-o` the output file
 - `--file`, `-f` shorthand for when `-i` and `-o` are the same.
 - `--sourcemap`, `-m` enable sourcemaps (on by default)

When no input or output are provided, it reads from stdio.

Example usages:

```
dist-js -f dist/app.js
dist-js --no-sourcemap -f dist/app.js
dist-js -i web/app.js -o dist/app.js

# From stdio
cat dist/app.js | dist-js > dist/app.js
```


# dist-js

> Create dist version of your JS.

Combines tools for adding comptibility and optimizations to your js compiler's
output.

```
$ dist-js dist/app.js
```

This will

- Manage a sourcemap file that comes beside an input file
- Run `babel` with `babel-preset-env` on the input
- Run `uglify-es` on the results

## Install

```
$ npm i -D dist-js
```

### `dist-js [file] [...options]`

The easiest way to use the tool is transforming a file in place:

```
$ dist-js dist/app.js
```

It will also detect when you want to use stdio:

```
# Using stdout
$ dist-js dist/app.js | wc -c
6780

# Using stdin
$ echo "console.log(1 + 2)" | dist-js dist/app.js
finished dist-js at dist/app.js

# Using both
$ echo "1 + 2" | dist-js > dist/app.js
```

Alternative to this, use the `--input`, `-i` and `--output`, `-o` flags, where
if a flag is absent it uses the stdio equivalent instead.

Also note that you can only accept a sourcemap with an input path, and write a
sourcemap with an output path.  Inline sourcemaps are not supported out of
simplicity.

To disable sourcemaps regardless, supply the `--no-sourcemaps` flag:

```
$ dist-js --no-sourcemaps dist/app.js
```

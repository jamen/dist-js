
# dist-js

> Create dist version of your JS.

Combines tools for adding comptibility and optimizations to your JS compiler's
output.

```sh
$ dist-js dist/app.js
```

This will

- Run `babel` with `babel-preset-env`.
- Run `uglify-es`.
- Use sourcemaps when given input and output paths.

Also see [`dist-css`](https://github.com/jamen/dist-css) for your CSS files.

## Install

```sh
$ npm i -D dist-js
```

### `dist-js [file] [...options]`

The easiest way to use the tool is transforming a file in place:

```sh
$ dist-js dist/app.js
```

It will also detect when you want to use stdio:

```sh
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

To disable sourcemaps regardless, supply the `--no-sourcemap` flag:

```sh
$ dist-js --no-sourcemap dist/app.js
```

#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const babel = require('babel-core')
const uglify = require('uglify-es')

const options = require('minimist')(process.argv.slice(2), {
  boolean: ['sourcemap'],
  alias: {
    output: 'o',
    input: 'i'
  }
})

const hasStdout = !process.stdout.isTTY
const hasStdin = !process.stdin.isTTY
const noStdio = !hasStdout && !hasStdin

if (options._[0]) {
  if (noStdio) options.file = options._[0]
  else if (hasStdout) options.input = options._[0]
  else if (hasStdin) options.output = options._[0]
}

// Shortcut for transforming a single file
if (options.file) options.input = options.output = options.file

// Handle detection of sourcemap
const hasSourcemap = options.sourcemap != null
if (!options.output && hasSourcemap) {
  throw new Error('sourcemap requires an output path')
} else if (!hasSourcemap) {
  options.sourcemap = !!options.output
}

// Create input stream from file or stdin
const input = options.input
  ? fs.createReadStream(path.resolve(options.input))
  : process.stdin

// Read data
const bufs = []
input.on('data', x => bufs.push(x))
input.on('end', () => sourcemapMaybe(Buffer.concat(bufs)))

// Read sourcemap maybe
function sourcemapMaybe (js) {
  if (options.sourcemap) {
    fs.readFile(path.resolve(options.output + '.map'), 'utf8', (err, data) => {
      write(js, data)
    })
  } else {
    write(js, null)
  }
}

function write (js, sourcemapInput) {
  compile(js, sourcemapInput).then(result => {
    if (result.map) sourcemapInput = JSON.stringify(result.map)
    return minify(result.code, sourcemapInput)
  }).then(result => {
    return new Promise((resolve, reject) => {
      const finish = (err) => {
        if (err) reject(err)
        else resolve()
      }

      const output = (done) => {
        if (options.output) {
          fs.writeFile(options.output, result.code, (err) => {
            if (err) done(err)
            else done()
          })
        } else {
          process.stdout.write(result.code)
          done()
        }
      }

      if (options.sourcemap && result.map) {
        output(err => {
          if (err) return reject(err)
          fs.writeFile(options.output + '.map', result.map, finish)
        })
      } else {
        output(finish)
      }
    })
  }).then(() => {
    if (!hasStdout) {
      console.log(`finished dist-js at ${options.output}`)
    }
  }).catch(err => {
    console.error(err)
  })
}

function compile (js, sourcemapInput) {
  return new Promise((resolve, reject) => {
    const babelOpts = {
      presets: [
        ['babel-preset-env', { modules: false }]
      ]
    }

    if (sourcemapInput) {
      babelOpts.inputSourceMap = JSON.parse(sourcemapInput)
    }

    resolve(babel.transform(js, babelOpts))
  })
}

function minify (js, sourcemapInput) {
  return new Promise((resolve, reject) => {
    const uglifyOpts = {}

    if (options.sourcemap && sourcemapInput) {
      uglifyOpts.sourceMap = {
        content: sourcemapInput,
        url: path.relative(options.output) + '.map'
      }
    }

    resolve(uglify.minify(js, uglifyOpts))
  })
}

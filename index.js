#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const babel = require('babel-core')
const uglify = require('uglify-es')

const cli = require('minimist')(process.argv.slice(2), {
  default: {
    sourcemap: true,
  },
  alias: {
    sourcemap: 'm',
    output: 'o',
    input: 'i',
    file: 'f'
  }
})

// Shortcut for transforming a single file
if (cli.file) cli.input = cli.output = cli.file

// Create streams from input/output options
const input = cli.input ? fs.createReadStream(path.resolve(cli.input)) : process.stdin
//const output = cli.output ? fs.createWriteStream(path.resolve(cli.output)) : process.stdout

// Read data
const bufs = []
input.on('data', x => bufs.push(x))
input.on('end', () => maybeSourcemap(Buffer.concat(bufs)))

function maybeSourcemap (js) {
  const sourcemap = cli.sourcemap
  if (sourcemap && cli.output) {
    const sourcemapPath = path.resolve(sourcemap !== true ? sourcemap : cli.output + '.map')
    fs.readFile(sourcemapPath, 'utf8', (err, data) => {
      write(js, data)
    })
  } else {
    write(js, null)
  }
}

function write (js, sourcemapInput) {
  compile(js, sourcemapInput).then(result => {
    if (result.map) {
      sourcemapInput = JSON.stringify(result.map)
    }

    return minify(result.code, sourcemapInput)
  }).then(result => {
    return new Promise((resolve, reject) => {
      let didOther = false

      if (result.map) {
        fs.writeFile(cli.output + '.map', result.map, (err) => {
          if (err) return reject(err)
          if (didOther) return resolve()
          else didOther = true
        })
      }

      fs.writeFile(cli.output, result.code, (err) => {
        if (err) return reject(err)
        if (didOther) return resolve()
        else didOther = true
      })
    })
  })
}

function compile (js, sourcemapInput) {
  return new Promise((resolve, reject) => {
    const babelOpts = {
      presets: [
        [path.join(__dirname, 'node_modules/babel-preset-env'), { modules: false }]
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

    if (sourcemapInput && cli.output) {
      uglifyOpts.sourceMap = {
        content: sourcemapInput,
        url: cli.output + '.map'
      }
    }

    resolve(uglify.minify(js, uglifyOpts))
  })
}

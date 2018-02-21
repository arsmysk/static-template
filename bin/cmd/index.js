#!/usr/bin/env node
const program = require('commander')
const path = require('path')

program
  .option('-w, --watch', 'Build source')
  .option('-b, --build', 'Build source')
  .option('-p, --production', 'set env to production')
  .parse(process.argv)

if (program.production) {
  process.env.NODE_ENV = 'production'
} else {
  process.env.NODE_ENV = 'development'
}

if (program.build) {
  require(path.resolve(__dirname, './build'))
} else if (program.watch) {
  require(path.resolve(__dirname, './watch'))
} else {
  require(path.resolve(__dirname, './build'))
}

#!/usr/bin/env node
const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')

console.log(chalk.green('What do you want to do?\n'))

const init = async () => {
  const commands = [
    'Start develop',
    'Start develop(NODE_ENV=production)',
    'Build for Production',
    'Build for Development',
  ]

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'command',
      message: 'Choose command',
      choices: commands,
    },
  ])

  switch (answers.command) {
    case commands[0]:
      process.env.NODE_ENV = 'development'
      require(path.resolve(__dirname, './cmd/watch'))
      break
    case commands[1]:
      process.env.NODE_ENV = 'production'
      require(path.resolve(__dirname, './cmd/watch'))
      break
    case commands[2]:
      process.env.NODE_ENV = 'production'
      require(path.resolve(__dirname, './cmd/build'))
      break
    case commands[3]:
      process.env.NODE_ENV = 'development'
      require(path.resolve(__dirname, './cmd/build'))
      break
  }
}
init()

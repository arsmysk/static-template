const path = require('path')
const dev = process.env.NODE_ENV === 'development'

module.exports = {
  src: 'src',
  dist: 'wp-content/themes/my-awesome-theme',
  copy_dir: [
    'src/assets/libs/**/*',
    'src/assets/images/**/*',
    'src/style.css',
  ],
  server: { // https://browsersync.io/docs/options
    open: false,
    proxy: 'http://localhost:8888',
  },
  style: {
    ext: '.css', // exported with this extension
    match_patterns: [ // minimatch: https://github.com/isaacs/minimatch#usage
      'src/assets/style/**/*.css',
      '!src/assets/style/components',
      '!src/assets/style/**/_*.css',
    ],
  },
  template: {
    ext: '.php', // exported with this extension
    match_patterns: [ // minimatch: https://github.com/isaacs/minimatch#usage
      'src/**/*.njk',
      '!src/template/',
      '!src/**/_*.njk',
    ],
  }
}

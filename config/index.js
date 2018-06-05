const path = require('path')
const dev = process.env.NODE_ENV === 'development'

module.exports = {
  src: 'src',
  dist: 'dist',
  copy_dir: ['src/assets/libs/**/*', 'src/assets/images/**/*'],
  server: {
    // https://browsersync.io/docs/options
    server: path.join(process.cwd(), 'dist'),
    open: false,
    proxy: false,
  },
  style: {
    ext: '.css', // exported with this extension
    cssModulePathRoot: 'src/assets/style', // the structure root for referring from template like `{{css.foo.bar}}`
    entry: [
      'src/assets/style/common.scss',
      'src/assets/style/top.scss',
      'src/assets/style/sub.scss',
    ],
    match_patterns: [
      // minimatch: https://github.com/isaacs/minimatch#usage
      'src/assets/style/**/*.scss',
      '!src/assets/style/**/_*.scss',
    ],
  },
  template: {
    ext: '.html', // exported with this extension
    match_patterns: [
      // minimatch: https://github.com/isaacs/minimatch#usage
      'src/**/*.njk',
      '!src/**/template/*.njk',
      '!src/**/_*.njk',
    ],
  },
}

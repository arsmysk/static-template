module.exports = (dev) => ({
  src: 'src',
  dist: 'dist',
  copy_dir: ['assets/libs'],
  style: {
    ext: '.css', // exported with this extension
    match_patterns: [ // minimatch: https://github.com/isaacs/minimatch#usage
      'src/assets/style/**/*.css',
      '!src/assets/style/components',
      '!src/assets/style/**/_*.css',
    ],
  },
  template: {
    ext: '.html', // exported with this extension
    match_patterns: [ // minimatch: https://github.com/isaacs/minimatch#usage
      'src/**/*.njk',
      '!src/template/',
      '!src/**/_*.njk',
    ],
  }
})

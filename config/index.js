module.exports = (dev) => {
  src: 'src',
  dist: 'public',
  copy_dir: ['lib', 'static'],
  style: {
    ignore_pattern: '_*.css',
    ext_from: 'css',
    ext_to: 'css',
  },
  template: {
    ignore_pattern: '_*.html',
    ext_from: 'html',
    ext_to: 'php',
  },
  script: {
    from: {
      ext: 'js',
    },
    to: {
      ext: 'js',
    }
  },
}

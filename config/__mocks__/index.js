module.exports = (dev) => ({
  src: 'src',
  dist: 'dist',
  copy_dir: ['lib', 'static'],
  style: {
    ignore_prefix: '_',
    ext_from: '.css',
    ext_to: '.css',
  },
  template: {
    ignore_prefix: '_',
    ext_from: '.html',
    ext_to: '.php',
  },
  script: {
    ext_from: '.js',
    ext_to: '.js',
  },
})

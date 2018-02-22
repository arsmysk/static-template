module.exports = (dev) => ({
  src: 'src',
  dist: 'dist',
  // not work yet
  // copy_dir: ['lib', 'static'],
  style: {
    ignore_prefixes: ['_'],
    ignore_dirs: ['components'],
    ext_from: '.css',
    ext_to: '.css',
  },
  template: {
    ignore_prefixes: ['_'],
    ignore_dirs: [],
    ext_from: '.html',
    ext_to: '.html',
  },
  // not work yet
  // script: {
  //   ext_from: '.js',
  //   ext_to: '.js',
  // },
})

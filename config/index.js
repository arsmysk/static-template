module.exports = (dev) => ({
  src: 'src',
  dist: 'dist',
  copy_dir: ['assets/libs'],
  style: {
    ignore_prefixes: ['_'],
    ignore_dirs: ['components', 'libs'],
    ext_from: '.css',
    ext_to: '.css',
  },
  template: {
    ignore_prefixes: ['_'],
    ignore_dirs: [],
    ext_from: '.html',
    ext_to: '.html',
  }
})

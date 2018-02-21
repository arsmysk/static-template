const {distPath} = require('../util')
jest.mock('../../config')

describe('distPath', () => {
  it('change ext', () => {
    const path = distPath('/src/path/to/file.js', '.php')
    expect(path).toEqual('/dist/path/to/file.php')
  })

  it('path start from `/src`', () => {
    const path = distPath('/src/path/to/file.js')
    expect(path).toEqual('/dist/path/to/file.js')
  })

  it('path NOT start from `/src`', () => {
    const path = distPath('/somewhere/not/start/src/file.js')
    expect(path).toEqual('/somewhere/not/start/dist/file.js')
  })

  it('path NOT start from `/`', () => {
    const path = distPath('not/start/slash/src/file.js')
    expect(path).toEqual('not/start/slash/dist/file.js')
  })

  it('path start from `./`', () => {
    const path = distPath('./start/dotslash/src/file.js')
    expect(path).toEqual('./start/dotslash/dist/file.js')
  })

  it('path NOT include `src`', () => {
    const path = distPath('./not/include/s_c/file.js')
    expect(path).toEqual('./not/include/s_c/file.js')
  })
})

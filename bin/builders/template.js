const path = require('path')
const nunjucks = require('nunjucks')
const beautify = require('js-beautify').html

nunjucks.configure(path.join(process.cwd(), 'src'), {
  autoescape: true,
  lstripBlocks: true,
  trimBlocks: true,
})

beautifyConfig = {
  indent_size: 2,
  end_with_newline: true,
  preserve_newlines: true,
  max_preserve_newlines: 1,
  wrap_line_length: 120,
}

module.exports = ({style: {classNames}, data: {entities}}, {file, content}) => {
  const page = path.parse(file).name
  const builded = beautify(
    nunjucks.renderString(content, {
      ...entities[page],
      css: classNames,
      __common__: entities.__common__,
      env: process.env,
    }),
    beautifyConfig,
  )
  return {file, content: builded}
}

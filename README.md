# Static web page template
Static web page template is simple boiler plate for make static web site.

It has these feature:
* [postcss-modules](https://github.com/css-modules/postcss-modules)([css modules](https://github.com/css-modules/css-modules))
* [Vue.js](https://github.com/vuejs/vue) compiler
* Simple/Uncovered archtecture using [Redux](https://github.com/reactjs/redux)
* Using [Nunjucks](https://mozilla.github.io/nunjucks/) as template engine

# Usage
## 1. clone this repo.
Or download the [latest](https://github.com/sundaycrafts/static-template/archive/master.zip).

```shell
git clone https://github.com/sundaycrafts/static-template.git
```

## 2. install deps.
Ensure installed [Node.js](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/lang/en/docs/install/) in your machine.

```shell
yarn install
```

## 3. lunch it
Intaractive CUI.

```shell
yarn start
```

Or exec each command.
Please reffer `package.json` in project root to find all command.

```shell
# build for production(minify, prefixed)
yarn build:production

# Start development(watch and build sources)
yarn dev
```

## Structure

```
.
├── README.md
├── bin // compilers
├── browserslist // define support browsers
├── config // define configs may change frequently
├── data // it be imported from html template corresponding file name
├── dist // the place exported from src dir
├── package.json // deps.
├── sample.env // rename .development.env, .production.env if you need it
├── src // source files
└── yarn.lock
```

## Credit(s)
Special thanks❤️

Photo by [Pawel Nolbert](https://unsplash.com/photos/62OK9xwVA0c) on [Unsplash](https://unsplash.com/)


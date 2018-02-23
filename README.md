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
Ensure installed [Node.js](https://nodejs.org/en/) in your machine.

```shell
npm install
```

## 3. lunch it
Intaractive CUI.

```shell
npm start
```

Or exec each command.
Please reffer `package.json` in project root to find all command.

```shell
# build for production(minify, prefixed)
npm run build:production

# Start development(watch and build sources)
npm run dev
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

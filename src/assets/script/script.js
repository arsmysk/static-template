import bar from './mods/bar'
bar()
console.log(process.env.ACCESS_TOKEN)
console.log(process.env.NODE_ENV)

const main = () => new Promise(resolve => setTimeout(() => {
  resolve()
}, 1000))

main().then(() => {
  console.log('after main')
})

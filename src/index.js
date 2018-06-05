function requireAll(r) { r.keys().forEach(r) }
requireAll(require.context('../public/', true, /\.styl$/))
requireAll(require.context('../app/styl/', true, /\.styl$/))
requireAll(require.context('../public/', true, /\.js$/))
//requireAll(require.context('../app/app/', true, /\.js$/))

import $ from '../app/app/mustache_wrapper'
import App from '../app/app/app'
import Body from '../app/app/body'

let msg = 'hello webpack 4'
console.log(msg)

const app = new App()
app.router.load_page()

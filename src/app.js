import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import routerViews from './router/views.router.js'
import {Server} from 'socket.io'
const PORT = process.env.PORT || 8080
const app = express()
const httpServer = app.listen(8080, ()=>{ console.log("listening") })
const io = new Server(httpServer)

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/static', express.static(__dirname + '/public'))

app.get('/health', (req, res)=>{
    res.send("ok")
})
app.use('/', routerViews)

const messages = []
io.on('connection', socket =>{
    console.log("New connection")
    socket.on('new', user=> console.log(`${user} se acaba de conectar`))
    socket.on('message', data=>{
        messages.push(data)
        io.emit('logs', messages)
    })
})
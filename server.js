const http = require('http')
const app = require('./app')
const port = process.env.PORT || 3500
app.set('port',port)

const server = http.createServer(app)
server.listen(port, ()=>{
    console.log("server is running on:"+ port);
})
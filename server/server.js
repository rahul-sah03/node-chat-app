const path=require('path');
const express=require('express');
const http=require('http');
const socketIO=require('socket.io');
var app=express();

var server=http.createServer(app);
const port=process.env.PORT||3000;
const publicPath=path.join(__dirname,'../public');
var io=socketIO(server);
io.on('connection',(socket)=>{
    console.log('New user connected');
   socket.emit('newMessage',{
       from:'Rahul',
       text:'See you then',
       createdAt:12343
   });

    socket.on('createMessage',(message)=>{
        console.log('Create message',message);
        io.emit('newMessage',{
            from:message.from,
            text:message.text,
            createdAt:new Date().getTime()
        });
    });
    socket.on('disconnect',()=>{
        console.log('User was disconnected.');
    });
    
});
app.use(express.static(publicPath));

server.listen(port,()=>{
    console.log('Server started in port 3000');
});
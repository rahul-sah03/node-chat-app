const path=require('path');
const express=require('express');
const http=require('http');
const socketIO=require('socket.io');
var app=express();
const {generateMessage,generateLocationMessage}=require('./utils/message');
var server=http.createServer(app);
const port=process.env.PORT||3000;
const publicPath=path.join(__dirname,'../public');
var io=socketIO(server);
io.on('connection',(socket)=>{

    console.log('New user connected');
    socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));
    socket.broadcast.emit('newMessage',generateMessage('Admin','New User Joined'));

    socket.on('createMessage',(message,callback)=>{
        console.log('Create message',message);

        
        io.emit('newMessage',generateMessage(message.from,message.text));
        callback('This is from the server.');
        // socket.broadcast.emit('newMessage',{
        //     from:message.from,
        //     text:message.text,
        //     createdAt:new Date().getTime()
        // });
    });
    socket.on('createLocationMessage',(coords)=>{
        io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
    });
    socket.on('disconnect',()=>{
        console.log('User was disconnected.');
    });
    
});
app.use(express.static(publicPath));

server.listen(port,()=>{
    console.log('Server started in port 3000');
});
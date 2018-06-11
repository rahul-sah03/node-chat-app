const path=require('path');
const express=require('express');
const http=require('http');
const socketIO=require('socket.io');
const {Users}=require('./utils/users');
var app=express();
const {generateMessage,generateLocationMessage}=require('./utils/message');
const {isRealString}=require('./utils/validations');
var server=http.createServer(app);
const port=process.env.PORT||3000;
const publicPath=path.join(__dirname,'../public');
var io=socketIO(server);

var users=new Users();
io.on('connection',(socket)=>{

    console.log('New user connected');
    

    socket.on('createMessage',(message,callback)=>{
        var user=users.getUser(socket.id);
        if(user && isRealString(message.text))
        {
            io.to(user.room).emit('newMessage',generateMessage(user.name,message.text));
        }

        
        
        callback();
        // socket.broadcast.emit('newMessage',{
        //     from:message.from,
        //     text:message.text,
        //     createdAt:new Date().getTime()
        // });
    });
    socket.on('createLocationMessage',(coords)=>{
        var user=users.getUser(socket.id);
        if(user)
        {
            io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longitude));
        }
        
    });
    
    socket.on('join',(params,callback)=>{
        
        if(!isRealString(params.name) || !isRealString(params.room))
        {
            return callback('Invalid Name or Room Name !!');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUsers(socket.id,params.name,params.room);
        io.to(params.room).emit('updateUserList',users.getUserList(params.room));
        socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined`));
        callback();
    });
    
    socket.on('disconnect',()=>{
        var user=users.removeUser(socket.id);
        if(user)
        {
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left.`));
        }
    });
    
});

app.use(express.static(publicPath));

server.listen(port,()=>{
    console.log('Server started in port 3000');
});
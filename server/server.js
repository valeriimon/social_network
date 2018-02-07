import http from 'http';
import os from 'os';
import path from 'path';

import Koa from 'koa';
import routerCb from 'koa-router';
import multer from 'koa-multer';
import passport from 'koa-passport';
import session from 'koa-session';
import koaBody from 'koa-body';

import IO from 'socket.io';
import Sockets from './commons/socket_utils';
import DbConfig from './config/db.config';
import Routes from './routes/test_router';
import UserRoutes from './routes/user';
const PORT = process.env.PORT || 3000;
const cors = require('koa2-cors');

const router = routerCb();

const app = new Koa();

app.keys = ["QEAXIZKOtlQmYQRdycRB3NOeToW3OJcZ"];
require('./commons/auth');
app.use(session({}, app));
app.use(passport.initialize());
app.use(passport.session());
app.use(koaBody({ multipart: true }));
app.use(cors({
  credentials: true,
  allowMethods: ['*'],
  allowHeaders: ['*']
}));
DbConfig.init();
Routes.init(app, router);
UserRoutes.init(app, router);
app.use((ctx, next)=>{
  //ctx.request. = {"Access-Control-Allow-Origin": "*"};
  //next();
})

const server = http.createServer(app.callback())
    .listen(PORT, () => {
      console.log(`up and running @: ${os.hostname()} on port: ${PORT}`);
      console.log(`enviroment: ${process.env.NODE_ENV}`);
    });




const io = IO(server);
new Sockets(io);
router.get('/', (ctx)=>{
  console.log(123);
  ctx.body = 'ae'
})
app.use(router.routes());

const nsp = io.of('/namespace');
const nsp2 = io.of('/namespace2');
nsp.on('connection', (socket)=> {
  socket.on('message', (data)=> {
    console.log(data);
  })
  socket.emit('msg', {message: 'Hello'})
})

nsp2.on('connection', (socket)=>{
  console.log('connected to second namespace');
  
})


io.on("connection", (socket)=>{
  //console.log("Connected",  '2');
  socket.on('disconnect', ()=>{
    console.log('terrible');
  })
})



import http from 'http';
import os from 'os';

import Koa from 'koa';
import routerCb from 'koa-router';
import multer from 'koa-multer';
import passport from 'koa-passport';
import session from 'koa-session';
import koaBody from 'koa-body';
import IO from 'socket.io';
import DbConfig from './config/db.config';
import Routes from './routes/test_router';
import UserRoutes from './routes/user';
const PORT = process.env.PORT || 3000;

const upload = multer({dest: './files/media'});
const router = routerCb();

const app = new Koa();

const io = new IO(http);

app.upload = upload;
app.keys = ["QEAXIZKOtlQmYQRdycRB3NOeToW3OJcZ"];
require('./commons/auth');
app.use(session({}, app));
app.use(passport.initialize());
app.use(passport.session());
app.use(koaBody({ multipart: true }));

DbConfig.init();
Routes.init(app, router);
UserRoutes.init(app, router);


http.createServer(app.callback())
    .listen(PORT, () => {
      console.log(`up and running @: ${os.hostname()} on port: ${PORT}`);
      console.log(`enviroment: ${process.env.NODE_ENV}`);
    });


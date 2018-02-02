"use strick"
const mongoose = require("mongoose");
import User from "../models/User";
import Access from "../commons/access";
import io from '../server';
const passport = require('koa-passport');
var Router = require('koa-router');
var router = new Router();
router.prefix('/api/v1.0/user');
//router.use([Access.can['user']]);
;
module.exports = class UserRoutes{
    static init(app){
       
        router
        /*
        *   get user by id
        */
        .get('/user/:id', async (ctx)=>{
            let user = await User.findById(ctx.params.id);
            if(!user){
                ctx.throw(404)
            }
            ctx.body = user.getClear()
        })
        /*
        *   create user
        */
        .post('/create', async (ctx)=>{
            let user = new User();
            user = await user.create(ctx.request.body);
            ctx.body = user.getClear();
        })
        /*
        *   get user password
        */
        .get('/user-password/:id', async (ctx)=>{
            let user = await User.findById(ctx.params.id);
            if(!user){
                ctx.throw(404)
            }
            let password = user.getPassword();
            ctx.body = {password, session:ctx.cookies.get('koa:sess')}
        })
        /*
        *   login operation
        */
        .post('/login',
        passport.authenticate('local'),
        function(ctx) {
          ctx.body = ctx.state.user;
        })
        /*
        *   logout operation
        */
        .post('/logout', function(ctx) {
            ctx.logout()
            ctx.redirect('/')
        })
        /*
        *   get user friend
        */ 
        .get('/friends/:userid', async (ctx)=>{
            let user = await User.findById(ctx.params.userid);
            let filter = {};
            const [page, perpage] = [ctx.request.query.page, ctx.request.query.perpage];
            try{
                filter = JSON.parse(ctx.request.query._filter)
            }catch(e){}
            let friends = await user.getFriends(page, perpage, filter)
            ctx.body = friends;
        })
        /*
         *  request to make a friendship 
         */
        .get('/request-friendship/:recieverid', async (ctx)=>{
            let [reciever, sender] = [
                mongoose.Types.ObjectId(ctx.params.recieverid), 
                ctx.state.user
            ];
            [reciever] = await User.find({_id:mongoose.Types.ObjectId(reciever._id)}, {friends:1});
            if(!reciever || !sender){
                ctx.throw(401)
            }
            let forSave = [];
            sender.friends.push({friend:reciever, status: "send"});
            reciever.friends.push({friend:sender, status: "recieve"});
            forSave.push(sender, reciever)
            for(let item of forSave){
                await item.save()
            }
            ctx.body = {sender, reciever}
        })

        app.use(router.routes())    
    }
}
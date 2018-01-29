const mongoose = require("mongoose");
import User from "./models";
const passport = require('koa-passport');
var Router = require('koa-router');
var router = new Router();
router.prefix('/api/v1.0/user');


module.exports = class UserRoutes{
    static init(app){
        router
        /* get user friends*/ 
        .get('/friends/:userid', async (ctx)=>{
            let id = mongoose.Types.ObjectId(ctx.params.userid)
            let perpage = ctx.request.query.perpage;
            let page = ctx.request.query.page;
            let friends = await User.aggregate([
                {$match: {_id: id}},
                {$unwind: "$friends", preserveNullAndEmptyArrays: true},
                {$lookup: {from:"users", localField:"friends", foreignField:"_id", as:"friends"}},
                {$group: {_id:"$_id", friends:{$push:"$friends"}}},
                {$project: {_id:1, friends:{$slice:["$friends", page, perpage], totalCount:{$size:"$friends"}}}}
            ])
            ctx.body = friends;
        })

        .get('/user/:id', (ctx)=>{
            let user = await User.findById(ctx.params.id);
            if(!user){
                ctx.throw(404)
            }
            ctx.body = user
        })

        .post('/create', async (ctx)=>{
            let user = new User();
            await user.create();
            ctx.body = user;
        })

        .post('/login',
        passport.authenticate('local'),
        function(ctx) {
          ctx.body = ctx.passport.user;
        })
        
        .post('/logout', AccessClass.role('all'), function(ctx) {
            ctx.logout()
            ctx.redirect('/')
            // ctx.body = '';
        })

        app.use(router.routes())    
    }
}
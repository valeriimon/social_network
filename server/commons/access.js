export default class Access{
    static can(roles){
        return async function(ctx, next){
          let role = ctx.state.user.role
          if(roles && roles.indexOf(role)>-1){
              next()
          } else {
              ctx.throw(403)
          }  
        }
    }
}
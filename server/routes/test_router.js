module.exports = class Routes{
	static init(app, router){
		router

			.get('/test', async(ctx)=>{
				ctx.body = 'working, Also testing nodemon reload';
			})
	}
}
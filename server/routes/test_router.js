// var Router = require('koa-router');
// var router = new Router();
const path = require("path");
module.exports = class Routes{
	static init(app, router){
		router

			.get('/test', async(ctx)=>{
				ctx.body = 'working, Also testing nodemon reload';
			})

			.post('/test-image-upload', async (ctx)=>{
				let image = ctx.request.body.files.image;
				let [,,imageName] = image.path.split('/');
				let imageType = path.extname(image.name);
				let output = imageName + imageType 
				console.log(output);
				ctx.body = 'qwe';
			})
		app.use(router.routes())
	}
}
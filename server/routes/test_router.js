// var Router = require('koa-router');
// var router = new Router();
const path = require("path");
import Utils from '../commons/utils';
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
				let output = imageName + imageType;
				await Utils.copyFile(image.path, path.normalize(`${__dirname}/../../files/tmp/${output}`));
				// let url = `${ctx.state.user._id.toString()}/${output}`; 
				console.log(output, image);
				ctx.body = 'qwe';
			})
		app.use(router.routes())
	}
}
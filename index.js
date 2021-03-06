/*
 * author: ralf
 * ly nodejs mvc project
 */

require('babel-core/register');
require("babel-polyfill");

var args = process.argv.splice(2); //取得命令行参数

var koa = require('koa'),
	path = require('path'),
	session = require('koa-generic-session');

//自定义部分模块
require('./modules/cache')  // lru 缓存模块
var statics = require('./modules/static'),
	_mapper = require('./modules/mapper')(args[0]),
	route = require('./modules/route'),
	socketio = require('./modules/wsocket'),   //websocket
	render = require('./modules/render');

global.React = require('react')
global.ReactDomServer = require('react-dom/server')
global._ = require('lodash')


//配置环境路径
var base = path.resolve(__dirname);
require('./modules/requirePath')(base)


//初始化
var app = koa();

//定义测试环境
app.use(function *(next){
	if (args[0] === 'dev' || args[0] === 'pro'){
		if (args[1] === 'test') {
			console.log('=========== 进入测试环境');
			process.env.env = 'test'
			// this.session.argv = 'test'
		}
	}
	if (args[0] === 'test') {
		console.log('=========== 进入测试环境');
		process.env.env = 'test'
		// this.session.argv = 'test'
	}
	yield next
});

//静态资源 js css
statics(args[0], app)


//session
app.keys = ['keys','gzgzmixcookie'];
app.use(session({
	key: 'agzgz'
}));


// websocket 初始化
var server = socketio.init(app)

//router
// app.use(router(app)); //开启路由
route.call(this,app,_mapper,render(args[0]))

//websocket 挂载on
socketio.run();


//打印出错信息
app.on('error', function(err){
    console.log(err);
});

var port = 8070;
if(args[1]){
	if (/[\d]+/.test(args[1])){
		port = args[1]
	}
}

// app.listen(port);
server.listen(port);


// var exec = require('child_process').execSync;
// var spawn = require('child_process').spawn,
// // ls = spawn('ttt');
// exec('source ./ttt')

// var exec = require('child_process').execSync;
// // var cmd = 'nohup node --harmony ../index.js dev &'
// exec('source ttt');

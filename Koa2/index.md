## koa2+koa-router以及koa脚手架的使用（koa-generator）

?> 介绍从开始搭建Koa2开发环境和koa脚手架的使用搭建两种方式,对于项目开发推荐使用脚手架搭建

### Koa2基础
#### 安装
1.初始化项目

```npm init -y
//-y是初始项目默认所有都是yes，若想另外设置可以直接npm init
```

2.安装koa2

```npm i koa --save```

#### 基础用法

1.在文件目录下新建一个index.js，然后写下如下代码：

``` js
const Koa = require('koa')
const app = new Koa()

app.use( async(ctx) => {
    ctx.body = "hello world"
})
app.listen(3000)
```
!> 如果想使用import、export用法需要安装babel进行转编译（“babel-core（包括了整个babel工作流）”,“babel-preset-env（比babel-preset-latest好）”,）注意其版本号的对应
```
babel-loader 8.x | babel 7.x
npm install  --save-dev babel-loader @babel/core @babel/preset-env 
babel-loader 7.x | babel 6.x
npm install  --save-dev babel-loader@7 babel-core babel-preset-env
```

具体babel的使用可以看看这里

2.运行这个文件：
```
nodemon index.js
```
Nodemon，它会监测项目中的所有文件，一旦发现文件有改动，Nodemon 会自动重启应用

3.打开浏览器，输入 `http://127.0.0.1:3000` ，看到页面内容有hello world则成功。

4.`koa`中会经常使用`async`和`await`的用法(es7)的内容，如果还没了解过的同学建议去了解学习一下先。

``` js
function a(ctx){
	return ctx++;
} 
async function test() {
	let text = await setTimesout(a(1),1000);
	console.log(text)
}
console.log('start')
```

5.koa属性

```js
app.listen(…)
```
```js
app.listen(3000)
//Koa 应用程序被绑定到 3000 端口
```
```js
app.callback()
```
返回适用于 `http.createServer()` 方法的回调函数来处理请求。你也可以使用此回调函数将 koa 应用程序挂载到 Connect/Express 应用程序中。

`app.use(function)`
将给定的中间件方法添加到此应用程序。参阅 Middleware 获取更多信息.

`app.keys=`
设置签名的 `Cookie` 密钥。
这些被传递给 `KeyGrip`，但是你也可以传递你自己的 `KeyGrip` 实例。
例如，以下是可以接受的：
```js
app.keys = ['im a newer secret', 'i like turtle'];
app.keys = new KeyGrip(['im a newer secret', 'i like turtle'], 'sha256');
```
`app.context`

`app.contex`t 是从其创建 `ctx` 的原型。您可以通过编辑 `app.context` 为 `ctx` 添加其他属性。这对于将 `ctx`添加到整个应用程序中使用的属性或方法非常有用，这可能会更加有效（不需要中间件）和/或 更简单（更少的 `require()`），而更多地依赖于`ctx`，这可以被认为是一种反模式。

例如，要从 `ctx` 添加对数据库的引用：
```js
app.context.db = db();

app.use(async ctx => {
  console.log(ctx.db);
});
```

### 获取请求数据
2.1 Get请求的接收
在Koa2中GET请求可以通过 `request`接受收，但接受的方式有两种：

1. `query`：返回的是格式化后的参数对象
2. `querystring`：返回的请求字符串
我们可以由两种方式来获取GET请求，一种是通过 `ctx.request` 来获取GET请求，一种则是直接在`ctx`中得到GET请求：

```js
const Koa = require('koa')
const app = new Koa()

app.use(async(ctx) => {
    const url = ctx.url
    // 使用 ctx.request
    const request = ctx.request
    const req_query = request.query
    const req_querystring = request.querystring
    // 直接使用ctx来获取
    const req_ctx = ctx.query
    const req_ctx1 = ctx.querystring
    ctx.body = {
        url,
        req_query,
        req_querystring,
        req_ctx,
        req_ctx1,
    }
})
app.listen(3000)
```
2.2 post请求的接收
在 Koa2 中，没有给对于 `POST` 请求的处理封装方便的获取参数的方法，需要通过通过解析上下文 `context` 中的元素 node.js 请求对象 req 来获取。因此获取POST请求的步骤可以理解为以下三步：

1. 解析上下文 `ctx` 中的原生 node.js 对象 req。
2. 将POST表单数据解析成 `query string` 字符串。
3. 将字符串转换成 `JSON` 格式。

```js
const Koa = require('koa')
const app = new Koa()

app.use(async(ctx) => {
    if (ctx.url === '/' && ctx.method === 'GET') {
        let html = `
        <h2>This is demo2</h2>
        <form method="POST" action="/">
            <p>username:</p>
            <input name="username">
            <p>age:</p>
            <input name="age">
            <p>website</p>
            <input name="website">
            <button type="submit">submit</button>                   
        </form>
        `
        ctx.body = html
    } else if (ctx.url === '/' && ctx.method === 'POST') {
        let postData = await parsePostDate(ctx)
        ctx.body = postData
    } else {
        ctx.body = '<h2>404</h2>'
    }
})

const parsePostDate = (ctx) => {
    return new Promise((resolve, reject) => {
        try{
            let postData = ""
            ctx.req.on('data', (data) => {
                postData += data
            })
            ctx.req.addListener("end", function() {
                let parseData = parseQueryStr(postData)
                resolve(parseData)
            })
        } catch(error) {
            reject(error)
         }
    })
}

const parseQueryStr = (queryStr) => {
    const queryData = {}
    const queryStrList = queryStr.split('&')
    console.log(queryStrList)
    for (let [index,queryStr] of queryStrList.entries()) {
        let itemList = queryStr.split('=')
        console.log(itemList)
        queryData[itemList[0]] = decodeURIComponent(itemList[1])
    }
    return queryData
}

app.listen(3000)
```
#### koa-bodyparser中间件

显然上面的 POST 请求的接收非常麻烦，至少对我而言，徒手写个这样的轮子在不查资料的情况下是做不到的，而这样的轮子当然也有人来做，`koa-bodyparser`就是一个造好的轮子。我们在koa中把这种轮子就叫做中间件。对于POST请求的处理，`koa-bodyparser`中间件可以把koa2上下文的formData数据解析到`ctx.request.body`中。

```
npm i koa-bodyparser@3 --save
```
```js
const Koa  = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
 
app.use(bodyParser())
 
app.use(async(ctx) => {
    if (ctx.url === '/' && ctx.method === 'GET') {
        let html = `
        <h2>This is demo2</h2>
        <form method="POST" action="/">
            <p>username:</p>
            <input name="username">
            <p>age:</p>
            <input name="age">
            <p>website</p>
            <input name="website">
            <button type="submit">submit</button>                 
        </form>
        `
        ctx.body = html
    } else if (ctx.url === '/' && ctx.method === 'POST') {
        let postData = ctx.request.body
        ctx.body = postData
    } else {
        ctx.body = '<h2>404</h2>'
    }
})

app.listen(3000)
```

### koa-router基础使用

#### 前言

koa是一个管理中间件的平台，而注册一个中间件使用use来执行。
无论是什么请求，都会将所有的中间件执行一遍（如果没有中途结束的话）
所以，这就会让开发者很困扰

```js
app.use(ctx => {
  switch (ctx.url) {
    case '/':
    case '/index':
      ctx.body = 'index'
      break
    case 'list':
      ctx.body = 'list'
      break
    default:
      ctx.body = 'not found'
  }
}
```
如上图所示，这样是一个简单的方法，但是必然不适用于大型项目，数十个接口通过一个switch来控制未免太繁琐了。
更何况请求可能只支持get或者post，以及这种方式并不能很好的支持URL中包含参数的请求/info/:uid。
在express中是不会有这样的问题的，自身已经提供了get、post等之类的与METHOD同名的函数用来注册回调
所以在koa中则需要额外的安装koa-router来实现类似的路由功能

#### 安装及使用
```
npm install koa-router --save
```
!> koa-router 是基于koa，所以安装koa-router之前记得安装koa。

```js
var Koa=require('koa');//引入 koa模块

var Router = require('koa-router')();  //引入是实例化路由
 
//实例化
var app=new Koa();
const router = new Router({
  prefix: '/users'
})
router.get('/hello',async (ctx)=>{
     ctx.body = {
      code: 0,
      msg: 'hello world'
    }
})

app.use(router.routes())   //启动路由
app.use(router.allowedMethods())

app.listen(3000)

```
`router.allowedMethods()` 作用： 这是官方文档的推荐用法,
我们可以看到 `router.allowedMethods()` 用在了路由匹配 `router.routes()`之后,
`allowedMethod`s处理的业务是当所有路由中间件执行完成之后,
若`ctx.status`为空或者404的时候,丰富`response`对象的`header`头

`prefix`是路由的前缀设置，告诉我们可以添加一个`Router`注册时的前缀，也就是说如果按照模块化分，可以不必在每个路径匹
配的前端都添加巨长的前缀

打开浏览器，输入 `http://127.0.0.1:3000/users/hello` 即可看到结果。


#### get请求获取参数

```js
//获取get传值
//http://localhost:3000/newscontent?aid=123
 
router.get('/newscontent',async (ctx)=>{
 
    //从ctx中读取get传值
 
    console.log(ctx.query);  //{ aid: '123' }       获取的是对象   用的最多的方式  **推荐
    console.log(ctx.querystring);  //aid=123&name=zhangsan      获取的是一个字符串
    console.log(ctx.url);   //获取url地址
 
    //ctx里面的request里面获取get传值
 
    console.log(ctx.request.url);
    console.log(ctx.request.query);   //{ aid: '123', name: 'zhangsan' }  对象
    console.log(ctx.request.querystring);   //aid=123&name=zhangsan
 
})
```

#### POST

```js
//注册请求
router.post('/signup', async(ctx) => {
  const {
    username,
    password,
    email,
    code
  } = ctx.request.body

  if (code) {
     if (new Date().getTime() - saveExpire > 0) {//saveExpire 是我自己设定的定时器
       ctx.body = {
         code: -1,
         msg: '验证码已过期，请重新尝试'
       }
       return false
     } else {
       ctx.body = {
         code: -1,
         msg: '请填写正确的验证码'
       }
     }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }
  ctx.body = {
     code: 0,
      msg: '注册成功'
    }
})
```

#### 动态路由

```js
//请求方式 http://域名/product/123
router.get('/product/:aid',async (ctx)=>{
    console.log(ctx.params); //{ aid: '123' } //获取动态路由的数据
    ctx.body='这是商品页面';
})
```
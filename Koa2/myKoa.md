## koa 的简单使用

```js
// 引入 koa
const Koa = require("koa");

// 创建 koa 实例
const app = new Koa();

// 计算请求耗时
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const end = Date.now();
  console.log(`🚀🚀~ 请求${ctx.url}耗时${parseInt(end - start)}ms`); // 🚀🚀~ 请求/耗时1014ms
});

// 请求
app.use(async (ctx, next) => {
  // 模拟一些耗时的操作
  await imitateDelay(1000);
  ctx.body = {
    name: "warbler",
  };
});

// 启动服务 监听3000端口
app.listen(3000, () => {
  console.log("🚀🚀~ 3000:", 3000);
});
```

## 手写一个简易版 koa

?> ⼀个基于 `nodejs` 的⼊⻔级 `http` 服务，类似下⾯代码。

```js
const http = require("http");
const server = http.createServer((req, res) => {
  // 所有处理业务的地方
  res.writeHead(200);
  res.end("hello, node");
});
server.listen(3000, () => {
  console.log("🚀🚀~ sever at 3000");
});
```

`koa` 的⽬标是⽤更简单化、流程化、模块化的⽅式实现回调部分的业务逻辑。

接下来我们从头实现一个 `MyKoa`。

### 第一步 实现 use 和 listen 方法

首先我们要实现 `koa` 的 `use` 和 `listen` 方法，我们这样使用 `MyKoa`。

```js
// 引入 MyKoa
const MyKoa = require("./mykoa");

// 创建 MyKoa 实例
const app = new MyKoa();

// 调用 use 方法
app.use((req, res) => {
  res.writeHead(200);
  res.end("hello, MyKoa!");
});

// 调用 listen 方法
app.listen(3000, () => {
  console.log("🚀🚀~ sever at 3000");
});
```

`MyKoa` 源码如下。

```js
// 引入原生 http 模块
const http = require("http");

// 声明 MyKoa 类
class MyKoa {
  // 实现 listen 方法
  listen(...args) {
    // 调用原生 http.createServer 创建服务
    const server = http.createServer((req, res) => {
      // 调用 callback 实现业务代码
      this.callback(req, res);
    });
    // 调用原生 server.listen 监听端口
    server.listen(...args);
  }
  // 实现 use 方法
  use(callback) {
    // 真正的业务逻辑代码通过 use 方法保存到 this.callback 中。
    this.callback = callback;
  }
}

module.exports = MyKoa;
```

⽬前为⽌，`MyKoa` 只是个⻢甲，要真正实现⽬标还需要引⼊ **上下⽂**`（context`） 和 **中间件机制** `（middleware）`

### 第二步 构建上下文（context）

`koa` 为了能够简化 `API，引⼊上下⽂` `context` 概念，将原始请求对象 `req` 和响应对象 `res` 封装并挂载到 `context` 上，并且在 `context` 上设置 `getter` 和 `setter`，从⽽简化操作。

一个描述 `getter` 和 `setter` 的小栗子，我们可以通过访问 `person.name` ， 实际访问 `person.info.name`。

```js
const person = {
  info: {
    name: "一尾流莺",
  },
  get name() {
    return this.info.name;
  },
  set name(val) {
    this.info.name = val;
  },
};
console.log("🚀🚀~person.name :", person.name); // 🚀🚀~person.name : 一尾流莺
person.name = "warbler";
console.log("🚀🚀~person.name :", person.name); // 🚀🚀~person.name : warbler
```

下面来简单实现一下 `MyKoa` 的上下文。

```js
// request.js
module.exports = {
  get url() {
    return this.req.url;
  },

  get method() {
    return this.req.method.toLowerCase();
  },
};
```

```js
// response.js
module.exports = {
  get body() {
    return this._body;
  },
  set body(val) {
    this._body = val;
  },
};
```

```js
// context.js
module.exports = {
  get url() {
    return this.request.url;
  },
  get body() {
    return this.response.body;
  },
  set body(val) {
    this.response.body = val;
  },
  get method() {
    return this.request.method;
  },
};
```

```js
// myKoa.js
const http = require("http");
const context = require("./context");
const request = require("./request");
const response = require("./response");
class MyKoa {
  listen(...args) {
    const server = http.createServer((req, res) => {
      // 创建上下⽂
      let ctx = this.createContext(req, res);
      this.callback(ctx);
      // 响应
      res.end(ctx.body);
    });
    server.listen(...args);
  }
  use(callback) {
    this.callback = callback;
  }
  // 构建上下⽂, 把res和req都挂载到ctx之上，并且在ctx.req和ctx.request.req同时保存
  createContext(req, res) {
    const ctx = Object.create(context);
    ctx.request = Object.create(request);
    ctx.response = Object.create(response);
    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;
    return ctx;
  }
}

module.exports = MyKoa;
```

然后就我们就可以像 `koa` 一样去使用上下文了，当我们访问 `ctx.url` 的时候，实际上就是在访问`ctx.request.req.url` ，同理，当我们访问 `ctx.body `的时候，就是在访问 `ctx.response.body` 了。

```js
// index.js
const MyKoa = require("./myKoa");

const app = new MyKoa();

app.use((ctx) => {
  ctx.body = "welcome to MyKoa";
});

app.listen(3000, () => {
  console.log("🚀🚀~ sever at 3000 ~~~");
});
```

### 第三步 中间件机制

先来看一下什么是 **函数组合** ，就是将⼀组需要顺序执⾏的函数复合为⼀个函数，外层函数的参数实际是内层函数的返回值。

```js
// 计算 x + y
const add = (x, y) => x + y;
// 计算 z 的 平方
const square = (z) => z * z;
// 计算 m - 1
const cutOne = (m) => m - 1;

// 函数组合 先计算 z = x + y ,再计算 z 的平方
const fn = (x, y) => square(add(x, y));

console.log(fn(1, 2)); //=> 9
```

我们简单的封装一下，结果是一样的。

```js
// 函数组合封装 2 个函数组合
const compose =
  (fn1, fn2) =>
  (...args) =>
    fn2(fn1(...args));

const fn2 = compose(add, square);

console.log(fn2(1, 2)); //=> 9
```

但是只能适用于两个函数的组合，继续封装一下，这样就满足将任意数量的函数组合起来了。

```js
// 函数组合封装  多个函数组合
const composeMore =
  (...[first, ...other]) =>
  (...args) => {
    let ret = first(...args);
    other.forEach((fn) => {
      ret = fn(ret);
    });
    return ret;
  };

const fn3 = composeMore(add, square, cutOne, cutOne, cutOne);

console.log(fn3(1, 2)); //=> 6
```

`Koa` 中间件机制就是函数式组合概念 `Compose` 的概念，洋葱圈模型可以形象表示这种机制，是源码中的精髓和难点。
[union](../static/union.webp)

洋葱圈模型和普通的函数式组合不太一样，普通的是执行完一个函数，再执行下一个函数。洋葱圈模型是执行完一个函数的一半，就执行下一个函数，以此类推直到执行完最后一个函数，返回来再执行前一个函数没有执行完的一半。

```js
// 函数组合
function compose(middleWares) {
  return function () {
    return dispatch(0);
    function dispatch(i) {
      let fn = middleWares[i];
      // 为了支持异步方法,所以需要返回Promise.resolve()
      if (!fn) {
        return Promise.resolve();
      }
      return Promise.resolve(
        fn(function next() {
          return dispatch(i + 1);
        })
      );
    }
  };
}

async function fn1(next) {
  console.log("fn1 begin");
  await next();
  console.log("fn1 end");
}
async function fn2(next) {
  console.log("fn2 begin");
  await delay();
  await next();
  console.log("fn2 end");
}
function fn3(next) {
  console.log("fn3");
}

// 模拟异步方法
function delay() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

const middleWares = [fn1, fn2, fn3];
const finalFn = compose(middleWares);
finalFn();
```

最终执行的结果是

```js
fn1 begin
fn2 begin
// 2000ms 后
fn3
fn2 end
fn1 end
```

接下里应用在 `MyKoa` 中，修改代码如下。

```js
// myKoa.js
class MyKoa {
  constructor() {
    //  存放中间件
    this.middleWares = [];
  }

  listen(...args) {
    // 创建原生服务
    const server = http.createServer(async (req, res) => {
      // 创建上下⽂
      let ctx = this.createContext(req, res);
      // 合成函数，形成洋葱圈
      const fn = this.compose(this.middleWares);
      await fn(ctx);
      // 响应
      res.end(ctx.body);
    });
    server.listen(...args);
  }

  use(middleWare) {
    // 把中间件函数存起来
    this.middleWares.push(middleWare);
  }

  // 构建上下⽂, 把res和req都挂载到ctx之上，并且在ctx.req和ctx.request.req同时保存
  createContext(req, res) {
    const ctx = Object.create(context);
    ctx.request = Object.create(request);
    ctx.response = Object.create(response);
    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;
    return ctx;
  }

  // 合成函数
  compose(middleWares) {
    return function (ctx) {
      return dispatch(0);
      function dispatch(i) {
        if (i === middlewares.length) return Promise.resolve();
        let fn = middleWares[i];
        return Promise.resolve(
          // 在这里传入上下文 ctx
          fn(ctx, function next() {
            return dispatch(i + 1);
          })
        );
      }
    };
  }
}
```

```js
// index.js
const MyKoa = require("./myKoa");

// 创建 MyKoa 实例
const app = new MyKoa();

// 模拟异步操作
const delay = () => new Promise((resolve) => setTimeout(() => resolve(), 2000));

app.use(async (ctx, next) => {
  ctx.body = "1";
  await next();
  ctx.body += "5";
});
app.use(async (ctx, next) => {
  ctx.body += "2";
  await delay();
  await next();
  ctx.body += "4";
});
app.use(async (ctx, next) => {
  ctx.body += "3";
});

app.listen(3000, () => {
  console.log("🚀🚀~ sever at 3000 ~~~");
});
```

### 第四步 常用中间件

`koa` **中间件的规范**

- 是⼀个 `async` 函数
- 接收 `ctx` 和 `next` 两个参数
- 任务结束需要执⾏ `next`

```js
const middleWare = async (ctx, next) => {
  // 来到中间件，洋葱圈左边
  next(); // 进⼊其他中间件
  // 再次来到中间件，洋葱圈右边
};
```

**中间件常⻅任务**：

- 请求拦截
- 路由
- ⽇志
- 静态⽂件服务

**路由中间件**

路由其实就是对策略模式的一个实现，免去了大量的` if...else` 。

```js
// router.js
class Router {
  constructor() {
    // 策略库
    this.stack = [];
  }

  /**
   * 注册策略到策略库中
   * @param {*} path 请求路径
   * @param {*} method 请求方法
   * @param {*} middleWare 中间件
   */
  register(path, method, middleWare) {
    let route = { path, method, middleWare };
    this.stack.push(route);
  }

  // 注册 get 请求
  get(path, middleWare) {
    this.register(path, "get", middleWare);
  }

  // 注册 post 请求
  post(path, middleWare) {
    this.register(path, "post", middleWare);
  }

  // 路由中间件
  routes() {
    let _stack = this.stack;
    // 返回的是一个中间件
    return async function (ctx, next) {
      // 获取到上下文中的 url
      let currentPath = ctx.url;
      // 声明一个策略
      let route;
      // 根据上下文中的 method 查找对应的策略
      for (let i = 0; i < _stack.length; i++) {
        const item = _stack[i];
        if (currentPath === item.path && item.method === ctx.method) {
          route = item.middleWare;
          break;
        }
      }
      // 如果取出的策略是一个函数,执行这个函数
      if (typeof route === "function") {
        route(ctx, next);
        return;
      }
      // 进入下一个中间件
      await next();
    };
  }
}

module.exports = Router;
```

```js
// index.js
const MyKoa = require("./myKoa");
const Router = require("./router");

const app = new MyKoa();
const router = new Router();
router.get("/index", async (ctx) => {
  ctx.body = "index page";
});
router.get("/post", async (ctx) => {
  ctx.body = "post page";
});
router.get("/list", async (ctx) => {
  ctx.body = "list page";
});
router.post("/index", async (ctx) => {
  ctx.body = "post page";
});

// 路由实例输出⽗中间件 router.routes()
app.use(router.routes());

app.listen(3000, () => {
  console.log("🚀🚀~ sever at 3000 ~~~");
});
```

**静态⽂件服务中间件**
处理静态文件的请求。

- 配置绝对资源⽬录地址，默认为 static
- 获取⽂件或者⽬录信息
- 静态⽂件读取
- 返回

```js
const fs = require("fs");
const path = require("path");
module.exports = (dirPath = "./public") => {
  return async (ctx, next) => {
    if (ctx.url.indexOf("/public") === 0) {
      // public开头 读取⽂件
      const url = path.resolve(__dirname, dirPath);
      const fileBaseName = path.basename(url);
      const filepath = url + ctx.url.replace("/public", "");
      console.log(filepath);
      // console.log(ctx.url,url, filepath, fileBaseName)
      try {
        stats = fs.statSync(filepath);
        if (stats.isDirectory()) {
          const dir = fs.readdirSync(filepath);
          // const
          const ret = ['<div style="padding-left:20px">'];
          dir.forEach((filename) => {
            console.log(filename);
            // 简单认为不带⼩数点的格式，就是⽂件夹，实际应该⽤statSync
            if (filename.indexOf(".") > -1) {
              ret.push(
                `<p><a style="color:black" href="${ctx.url}/${filename}">${filename}</a></p>`
              );
            } else {
              // ⽂件
              ret.push(
                `<p><a href="${ctx.url}/${filename}">${filename}</a></p>`
              );
            }
          });
          ret.push("</div>");
          ctx.body = ret.join("");
        } else {
          console.log("⽂件");
          const content = fs.readFileSync(filepath);
          ctx.body = content;
        }
      } catch (e) {
        // 报错了 ⽂件不存在
        ctx.body = "404, not found";
      }
    } else {
      // 否则不是静态资源，直接去下⼀个中间件
      await next();
    }
  };
};
```

**请求拦截中间件**

请求拦截应⽤⾮常⼴泛：登录状态验证、CORS 头设置，⿊名单等。

本次实现一个⿊名单中存在的 ip 将被拒绝访问的功能。

```js
module.exports = async function (ctx, next) {
  const { res, req } = ctx;
  const blackList = ["127.0.0.1"];
  const ip = getClientIP(req);

  if (blackList.includes(ip)) {
    //出现在⿊名单中将被拒绝
    ctx.body = "not allowed";
  } else {
    await next();
  }
};

function getClientIP(req) {
  return (
    req.headers["x-forwarded-for"] || // 判断是否有反向代理 IP
    req.connection.remoteAddress || // 判断 connection 的远程 IP
    req.socket.remoteAddress || // 判断后端的 socket 的 IP
    req.connection.socket.remoteAddress
  );
}
```

**BodyParser 中间件**

```js
const middleWare = async (ctx, next) => {
  console.log("🚀🚀~ body-parser");
  const req = ctx.request.req;
  let reqData = [];
  let size = 0;
  await new Promise((resolve, reject) => {
    req.on("data", (data) => {
      console.log("🚀🚀~ req on", data);
      reqData.push(data);
      size += data.length;
    });
    req.on("end", () => {
      console.log("🚀🚀~ end");
      const data = Buffer.concat(reqData, size);
      console.log("🚀🚀~ data:", size, data.toString());
      ctx.request.body = data.toString();
      resolve();
    });
  });
  await next();
};
```

#### mini Koa

```js
const http = require("http");
module.exports = class SuperMiniKoa {
  constructor() {
    this.middleware = [];
  }
  use(fn) {
    this.middleware.push(fn);
  }
  listen(...args) {
    return http.createServer(this.callback.bind(this)).listen(...args);
  }
  callback(req, res) {
    const fn = this.compose(this.middleware);
    const handleError = (e) => {
      throw new Error(e);
    };
    const handleResponse = () => {
      res.end(res.body);
    };
    const ctx = { req, res, app: this, state: {} };
    return fn(ctx).then(handleResponse).catch(handleError);
  }
  compose(middleware) {
    return function (ctx) {
      let index = -1;
      const dispatch = (i) => {
        index = i;
        let fn = middleware[i];
        if (i === middleware.length) return Promise.resolve();
        try {
          return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
        } catch (err) {
          return Promise.reject(err);
        }
      };
      return dispatch(0);
    };
  }
};
```

## vue-router+vuex实现加载动态路由和菜单

### 前言
?> 动态路由加载和动态菜单渲染的应用在后端权限控制中十分常见，后端只要加载权限路由进行渲染返回到浏览器就可以。在前后端分离中，权限控制动态路由和动态菜单也是一个非常常见的问题。其实我们最最理想的效果是什么呢？
我们访问一个应用，在登录之前有哪些路由是一定要加载的呢？你看我总结如下，你看下是不是这些：
- 登录路由 （登录功能路由）
- 系统路由（系统消息路由，比如欢迎界面，404，error等的路由）
但是在vue中，一旦实例化，就必须初始化路由，但这个时候你还没有登录，没有获取你的权限路由呀，如果加载全部路由，那么在浏览器上输入路由你就可以访问（这个问题可以使用router.beforeEach钩子进行权限鉴定解决），那么在前后端分离的开发项目中，vue是如何实现动态路由加载实现权限控制的呢？这就是我们这篇文章要写的内容。

我们写过后台渲染都知道怎么去实现，那么放到vue中如何去实现呢？我们先罗列几个问题进行思考，如下

?> 1. vue中路由是如何初始化，放入到vue实例中的？
   2. vue中提供了什么实现动态路由加载呢？
   我们先顺着这两个问题进行思考，并且顺着这两个问题，我们进行对应方案解决，这个过程中会会出现很多新的问题，我们也针对新问题出对应方案，并且进行优化。


   ### 路由初始化
路由初始化发生在什么时候呢？我们可以看主入口文件main.js，下面是我贴出的我的一个项目案例：

```js
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control
import './mock' // simulation data

import * as filters from './filters' // global filters

Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// vue实例化就已经把router初始化了
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
```

通过上面的主入口文件，我们就知道，这个路由初始胡就发生在vue实例化时。这个也很好理解如果你没有初始化路由，那么你就默认只能进入到主窗口，那么接下来主窗口中你没有路由你怎么跳转？程序也不知道你有哪些地方可以跳转呀，路由都是需要先注册到实例中，实例才能定位到相应的视图。从中我们知道，路由初始化发生在vue实例化时。

那么这个时候我们接着我们想要的权限控制目标走：程序一开始，只注册登录路由、系统信息路由（欢迎页面，404路由，error路由），我们称这些为静态路由，登录后我们通过接口获取权限拿到了菜单，这个时候需要进行添加动态路由，把这些菜单信息注册为路由，我们称这些为动态路由。那么vue实例化时，vue-router就已经被初始化，那么我们是不是能够通过类似于往router实例里面添加路由项的方式进行注册路由呢？我们可以查阅文档，也可以查看vue-router源码，有一个叫做addRoutes的方法进行动态注册路由信息，路由对象其实就是一个路由数组，我们通过addRoutes就可以进行动态注册路由，这个跟那个数组中extend功能类似的。

所以说道这里我们知道可以**通过addRoutes进行动态路由注册**。好，那么我们就顺着这个思路走下去。

在登录模块中，登录成功后，我们通过api获取后台权限菜单，然后注册路由。代码如下：

```js
// 登录页登录方法
handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid && this.isSuccess) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
           // 在这个时候进行获取后台权限及菜单
            this.$store.dispatch('getMenus', this.loginForm.name).then((res) => {
             // 把这个菜单信息注册为路由信息
              this.$router.addRoutes(menuitems)
            })
            this.loading = false
           // 除了登录路由、和系统消息路由，这个跟路由是一个欢迎路由，是静态路由
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.$message.error('登陆失败，请检查用户名或密码是否正确')
            this.loading = false
          })
        } else {
          if (!this.isSuccess) {
            this.$message.error('请拉滑动条')
          }
          console.log('error submit!!')
          return false
        }
      })
  }

// 登录方法计算属性
computed: { 
   ...mapGetters([ 
    'menuitems', 
   ]) 
  },
```

总结一下：
登录成功以后（持久化token），调用获取权限菜单（保存在store里面），这个时候就完成了登录后动态初始化权限菜单的功能。那么这里面所有的路由就是当前用户可访问的菜单，就实现了我们的目标效果。但是呢，store存储权限菜单会有个问题，一旦刷新里面的值就刷掉了，那么这个时候就重新实例化的时候就会跳到404路由中，菜单信息也没有了，那如何解决这个刷新时的问题呢？

我们先分析一下思路：

```
1.初始化vue实例时，初始化router，包括所有的静态路由。
2.全局钩子检查token是否有效？
        a.如果有效，则通过token获取用户信息保存到store中，根据用户信息获取权限菜单保存到store中，
        动态注册权限菜单的路由信息；
        b.如果token无效，重新定位到静态登录路由进行登录.
3.登录模块中，登录成功后获取用户信息保存到store中，将token保存到store中并持久化到本地，
获取权限菜单保存到store中，动态注册权限菜单的路由信息
4.动态加载完路由后，直接跳到欢迎界面的静态路由
5.一旦页面刷新，那么token就会从store中清除，token失效，那么就会去获得持久化在本地的token
，重新去获取用户信息，权限菜单，重新动态注册路由。
6.token持久化在本地也是有时间限制的，假设token有效期为一周，一旦过了有效期，那么会走2的b情况。
```

那么上面的思路就是动态加载权限菜单路由信息的简述，整个的环路就通了，刷新问题就解决了。

代码如下：

```js
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress Configuration

// 权限判断
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/authredirect']// no redirect whitelist

// 全局钩子
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  // 如果有token
  if (getToken()) { // determine if there has token
    // 登录后进入登录页
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger afterEach hook, so manually handle it
    } else {
      // 当进入非登录页时，需要进行权限校验
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
           const roles = res.data.data.roles // note: roles must be a array! such as: ['editor','develop']
           store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
             router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
             next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: 
           })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          next()
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
        // 可删 ↑
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
```

备注：根据模块独立性，我把登录中获取权限列表去掉，都放置在全局钩子中，把上面的代码直接引入到主入口文件main.js中。

另外这里采用vuex进行状态管理，所以从新捋一下思路：
```
1.vue实例化，初始化静态路由
2.全局钩子进行检查：
    a.token有效
          -如果当前跳转路由是登录路由，直接进入根路由/
            -如果跳转路由非登录路由，则需要进行权限校验，如果用户信息和权限菜单没拉取，
            则进行拉取后将权限菜单动态注册到router中，进行权限判断，如果有用户信息和权限菜单信息，
            则直接进行权限判断。
    b.token无效
          -如果在白名单中，则直接进入
            -进入到登录页

3.全局状态管理采用vuex
```

到这里我们就已经完成了vue-router+vuex动态注册路由控制权限的方式就说完了，这里我留个思考题给大家：现在根据上面的方式我再引入一个产品实体，(用户 - 产品 - 菜单 )， 用户可以有多个产品权限，每个产品有公用的菜单，也有各产品定制化的菜单，那么这个时候我在前端如果做好权限校验呢？要求：当前用户当前产品的权限菜单才可被访问。
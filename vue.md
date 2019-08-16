## VUEJS开发规范

!> 我们的现有项目是基于Vue框架开发，最大的便利在于组件化的开发，将页面内容进行拆分之后，可独立维护，可复用性大大提高。哪个地方出问题，直接去修改的对应的组件即可。团队人员配置多的时候，你写你的header，我写我的footer。相互不影响，不冲突。而组件的合理拆分，也就变成了衡量水平的一个维度之一。

页面只不过是这样组件的容器，组件自由组合形成功能完整的界面，当不需要某个组件，或者想要替换某个组件时，可以随时进行替换和删除，而不影响整个应用的运行。前端组件化的核心思想就是将一个巨大复杂的东西拆分成粒度合理的小东西。

### 组件化开发

*组件化是长期开发过程中一个提炼精华的过程，目的主要是以下几点：*

1. **提高开发效率**
2. **方便重复使用**
3. **简化调试步骤**
4. **提升整个项目的可维护性**
5. **便于协同开发**
6. **使其高内聚，低耦合，达到分治与复用的目的。**

*Vue组件化开发*

- 单文件系统，样式局部作用域
- 基本组成结构：`<template/> <script/> <style scoped/>`
- 组件注册方式：
1. 公共组件全局注册：要注册一个全局组件，可以使用Vue.component(tagName,option)
2. 其余组件局部注册：通过使用组件实例选项component注册，可以使组件仅在另一个实例或者组件的作用域中可用

```vue
<!--  -->
<template>
<div class=''></div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
//import引入的组件需要注入到对象中才能使用
components: {},
data() {
//这里存放数据
return {

};
},
//监听属性 类似于data概念
computed: {},
//监控data中的数据变化
watch: {},
//方法集合
methods: {

},
//生命周期 - 创建完成（可以访问当前this实例）
created() {

},
//生命周期 - 挂载完成（可以访问DOM元素）
mounted() {

},
beforeCreate() {}, //生命周期 - 创建之前
beforeMount() {}, //生命周期 - 挂载之前
beforeUpdate() {}, //生命周期 - 更新之前
updated() {}, //生命周期 - 更新之后
beforeDestroy() {}, //生命周期 - 销毁之前
destroyed() {}, //生命周期 - 销毁完成
activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style>
</style>
```

### 结构化规范

*基于Vue-cli2x(3.0版本大同小异)脚手架的结构基础划分：*

```
├── index.html                      入口页面
├── build                           构建脚本目录
│   ├── build-server.js                 运行本地构建服务器，可以访问构后的页面
│   ├── build.js                        生产环境构建脚本
│   ├── dev-client.js                   开发服务器热重载脚本，主要用来实现开发阶段的页面自动
│   ├── dev-server.js                   运行本地开发服务器
│   ├── utils.js                        构建相关工具方法
│   ├── webpack.base.conf.js            wabpack基础配置
│   ├── webpack.dev.conf.js             wabpack开发环境配置
│   └── webpack.prod.conf.js            wabpack生产环境配置
├── config                          项目配置
│   ├── dev.env.js                      开发环境变量
│   ├── index.js                        项目配置文件
│   ├── prod.env.js                     生产环境变量
│   └── test.env.js                     测试环境变量
├── mock                            mock数据目录
│   └── hello.js
├── package.json                    npm包配置文件，里面定义了项目的npm脚本，依赖包等信息
├── src                             项目源码目录
│   ├── main.js                         入口js文件
│   ├── App.vue                         根组件
│   ├── components                      公共组件目录
│   │   └── Title.vue
│   ├── assets                          资源目录，这里的资源会被wabpack构建
│   │   ├── css                         公共样式文件目录
│   │   ├── js                          公共js文件目录
│   │   └── img                      图片存放目录
│   ├── routes                          前端路由
│   │   └── index.js
│   ├── store                           应用级数据（state）
│   │   └── index.js
│   └── views                           页面目录
│       ├── Hello.vue
│       └── NotFound.vue
├── static                          纯静态资源，不会被wabpack构建。
├── test
│   └── unit                            单元测试
│   │   ├── index.js                    入口脚本
│   │   ├── karma.conf.js               karma配置文件
│   │   └── specs                       单测case目录
│   │   │   └── HelloWorld.spec.js
│── .gitignore.js                  提交代码时候需要配置的忽略提交的代码目录
│── README.md                      展示项目基本用法功能的说明性文件  
```

### 组件命名规范

*这部分可以仔细月度Vue官方文档：*

当注册组件 (或者 prop) 时，可以使用 `kebab-case (短横线分隔命名)、camelCase (驼峰式命名) 或 PascalCase (单词首字母大写命名)`。
**camelCase 是最通用的声明约定，而 kebab-case 是最通用的使用约定。**

命名可遵循以下规则：

1. 有意义的名词、简短、具有可读性,如：searchSidebar.vue
2. 以大写开头，采用帕斯卡命名,如：todoList.vue
3. 公共组件命名以公司名称简拼为命名空间,如：app-xx.vue
4. 文件夹命名主要以功能模块代表命名
5. 同时还需要注意：必须符合自定义元素规范: 使用连字符分隔单词，切勿使用保留字。app- 前缀作为命名空间， 如果非常通用的话可使用一个单词来命名，这样可以方便于其它项目里复用。


### 强制要求 

1. **组件名为多个单词**

组件名应该始终是多个单词的，根组件 App 除外。

```js
// not good
export default {
    name: 'Todo',
    // ...
}

// good
export default {
    name: 'TodoItem',
    // ...
}
```

2. **组件数据**

组件的 data 必须是一个函数。
当在组件中使用 data 属性的时候 (除了 new Vue 外的任何地方)，它的值必须是返回一个对象的函数。

```js
 // not good
 export default {
   data: {
     foo: 'bar'
   }
 }
 
 // good
 export default {
   data () {
     return {
       foo: 'bar'
     }
   }
 }
 // 在一个 Vue 的根实例上直接使用对象是可以的，
 // 因为只存在一个这样的实例
 new Vue({
   data: {
     foo: 'bar'
   }
 })
```

3. **Prop定义**

Prop 定义应该尽量详细。
在你提交的代码中，prop 的定义应该尽量详细，至少需要指定其类型。

```js
 // not good
 props: ['status']
 
 //good
 props: {
   status: String
 }
 // 更好的做法！
 props: {
   status: {
     type: String,
     required: true,
     validator: function (value) {
       return [
         'syncing',
         'synced',
         'version-conflict',
        'error'
       ].indexOf(value) !== -1
     }
   }
 }
```

4. **为v-for设置key**

总是用 key 配合 v-for。
在组件上总是必须用 key 配合 v-for，以便维护内部组件及其子树的状态。甚至在元素上维护可预测的行为，比如动画中的对象固化 (object constancy)，也是一种好的做法

```js
 // not good
 <ul>
   <li v-for="todo in todos">
     {{ todo.text }}
   </li>
 </ul>
 // good
 <ul>
   <li v-for="todo in todos" :key="todo.id">
     {{ todo.text }}
   </li>
 </ul>
```

### 强烈推荐 (增强可读性)

1. 单文件组件文件的大小写

单文件组件的文件名应该要么始终是单词大写开头 (PascalCase)，要么始终是横线连接 (kebab-case)。

```
// not good
components/
|- myComponent.vue
|- mycomponent.vue

// good
components/
|- MyComponent.vue
```

2. **模板中的组件名大小写**

对于绝大多数项目来说，在单文件组件和字符串模板中组件名应该总是 PascalCase 命名.

```js
// 反例
<!-- 在单文件组件和字符串模板中 -->
<mycomponent/>
<!-- 在单文件组件和字符串模板中 -->
<myComponent/>

// 正例
<!-- 在单文件组件和字符串模板中 -->
<MyComponent/>
```
3. **带引号的特性值**

非空 HTML 特性值应该始终带引号。
在 HTML 中不带空格的特性值是可以没有引号的，但这鼓励了大家在特征值里不写空格，导致可读性变差。

*** 建议：html属性使用双引号" "，js中使用单引号' ' ***

```js
// 反例
<AppSidebar :style={width:sidebarWidth+'px'}>
let name = "张三",
    address = '上海';

// 正例
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
let name = '张三',
    address = '上海';
```

### Vue 编码规范

1. **使用ES6风格编码源码**

?> 定义变量使用let ,定义常量使用const;
使用export ，import 模块化

2. **组件 props 原子化**

?> 提供默认值;
使用 type 属性校验类型;
使用 props 之前先检查该 prop 是否存在

3. 避免 this.$parent
4. 谨慎使用 this.$refs
5. 无需将 this 赋值给 component 变量
6. 调试信息console.log(),debugger 使用完及时删除
7. html属性值使用双引号，js中定义变量用单引号，如let name = 'jack'
8. v-for循环时一定要写:key，并且key使用不能使用循环的序号index，要使用属性id
9. 模板内的复杂逻辑，推荐使用计算属性computed
10. watch监听时，慎用deep:true属性，深度监听会对性能产生影响


!> coding 愉快！！！
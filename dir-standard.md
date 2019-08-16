# 结构规范

?> 一个合理项目结构可以让多人开发更高效，越大的项目效果越明显；优秀的项目结构可以让人更好的沟通，让其它模块的人迅速熟悉和了解另一模块，还可以让新加入团队的人快速了解和掌握项目，为项目带来更高的可控性，方便管理。
我们现有的项目是基于vue-cli脚手架搭建的，庆幸的是，脚手架已经贴心的帮我们搭建好了目录结构，开箱即用。但是我们也会根据实际项目做部分调整

!> 注：开发基于`Vue-cli3`脚手架，Vue-cli2的目录结构大同小异，一图胜千言，目录结构如下:


![dir](/static/dir.png)


```
└─vue
    ├─.vscode
    ├─dist              // 打包后的项目
    ├─node_modules      // 依赖包
    ├─public            //模板
    │  └─css
    └─src               // 源码目录，主要编码的位置
        ├─api           // 后台接口封装，统一管理
        ├─assets        // 静态文件目录
        ├─components    // 组件文件
        ├─pages         // 多入口文件目录，vue-cli3新增对多页面的支持
        │  ├─about
        │  │  └─views
              |─App.vue
              |─main.js
              |─router.js
              |about.html
        │  └─index
        │  │   └─views
               |─App.vue
               |─main.js
               |─router.js
               |index.html
        ├─plugins       //第三方发插件，如：element-ui
        └─utils         //工具方法集合
    |─.browserslistrc
    |─.eslintrc.js
    |─.gitignore        // 提交代码时候需要配置的忽略提交的代码目录
    |─babel.config.js
    |─package.json      //项目所有的依赖项都在此文件，相关打包命令也在这
    |─postcss.config.json
    |─README.md         // 展示项目基本用法功能的说明性文件  
    |─vue.config.js     //vue-cli3脚手架配置项
    
```
!> 注意：也许当前目录结构 会随着项目或其他原因，变得不是最佳实践，但请勿擅自修改目录结构，先沟通讨论
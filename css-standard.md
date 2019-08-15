
## CSS规范

在 MDN 中 [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) 的定义：

?> 层叠样式表 (Cascading Style Sheets，缩写为 CSS），是一种样式表语言，用来描述 HTML 或 XML（包括如 SVG、XHTML 之类的 XML 分支语言）文档的呈现。CSS 描述了在屏幕、纸质、音频等其它媒体上的元素应该如何被渲染的问题。

<!-- 笔者眼中的 CSS 定义：

?> 一门给予用户视觉上愉悦的“语言”，一门值得web开发者不断探索的语言。 -->

### 原则

减少代码重复，保持代码的健壮性和可阅读性

```css
/* not-good */

tips {
  color: #f4f0ea;
  border: 1px solid #f4f0ea;
}
tips:before {
  border-left-color: #f4f0ea;
}

/* good */

tips {
  color: #f4f0ea;
  border: 1px solid currentColor;
}
tips:before {
  border-left-color: inherit;
}
```

合理使用简写

```css
/* not-good */

div {
  border-width: 2px 2px 2px 0;
}

/* good */

div {
  border-width: 2px; 
  border-left-width: 0;
}
```

适当的过渡效果

```css
/* bad*/

input:not(:focus) + .popTips{
  display: none;
}

input:focus + .popTips{
  display: block;
}

/* good */

input:not(:focus) + .popTips{
  transform: scale(0);
  transition: transform .25s cubic-bezier(.25, .1, .25, .1);
}

input:focus + .popTips{
  transform: scale(1);
  transition: transform .4s cubic-bezier(.29, .15, .5, 1.46);
}
```
### CSS样式表文件命名参考
1. `全局：global.css`
 全局样式为全站公用，为页面样式基础，页面中必须包含。
2. `结构：layout.css`
页面结构类型复杂，并且公用类型较多时使用。多用在首页级页面和产品类页面中。
3. `私有：style.css`
独立页面所使用的样式文件，页面中必须包含。
4. `模块 module.css`
产品类页面应用，将可复用类模块进行剥离后，可与其它样式配合使用。
5. `主题 themes.css`
实现换肤功能时应用。
6. `补丁 mend.css`
基于以上样式进行的私有化修补。

?> 当然这些都是自己个人根据以往项目经验做出的参考，实际上我们现有的项目文件不会有这么多，各个模块样式会比较独立,看起来就像这样
![color](/static/css.png)
### 属性顺序
属性应该按照特定的顺序出现以保证易读性；
- `id`
- `class`
- `name`
- `data-*`
- `src, for, type, href, value , max-length, max, min, pattern`
- `placeholder, title, alt`
- `aria-*, role`
- `required, readonly, disabled`

```html
<a class="..." id="..." data-modal="toggle" href="#">Example link</a>

<input class="form-control" type="text">

<img src="..." alt="...">
```

### 重置样式表参考
重置样式，清除浏览器默认样式，并配置适合设计的基础样式（强调文本是否大多是粗体、主文字色，主链接色，主字体等，详细可见项目basic.css）。
 ```css
 /* reset */
html,body,h1,h2,h3,h4,h5,h6,div,dl,dt,dd,ul,ol,li,p,blockquote,pre,hr,figure,table,caption,th,td,form,fieldset,legend,input,button,textarea,menu{margin:0;padding:0;}
header,footer,section,article,aside,nav,hgroup,address,figure,figcaption,menu,details{display:block;}
table{border-collapse:collapse;border-spacing:0;}
caption,th{text-align:left;font-weight:normal;}
html,body,fieldset,img,iframe,abbr{border:0;}
i,cite,em,var,address,dfn{font-style:normal;}
[hidefocus],summary{outline:0;}
li{list-style:none;}
h1,h2,h3,h4,h5,h6,small{font-size:100%;}
sup,sub{font-size:83%;}
pre,code,kbd,samp{font-family:inherit;}
q:before,q:after{content:none;}
textarea{overflow:auto;resize:none;}
label,summary{cursor:default;}
a,button{cursor:pointer;}
h1,h2,h3,h4,h5,h6,em,strong,b{font-weight:bold;}
del,ins,u,s,a,a:hover{text-decoration:none;}
body,textarea,input,button,select,keygen,legend{font:12px/1.14 arial,\5b8b\4f53;color:#333;outline:0;}
body{background:#fff;}
a,a:hover{color:#333;}
 ```
### 特殊样式选择器选择约定

因为我们的项目是基于Vue开发，遵循模块化开发，即一个文件一个模块，有时会出现特殊的样式需求，避免样式冲突，在选择器上我们约定：
1. id选择器 `moduleName_idName`
2. class选择器 `moduleName_ClassName`

### 色彩

为了保持文档中示例的一致性，文档中所有示例配色均参考使用网易严选设计规范。

![color](/static/colors_guide.jpeg)

!> 文档中的示例样式兼没有添加浏览器前缀做兼容，在现有的生产环境中已经使用[Autoprefixer](https://www.npmjs.com/package/autoprefixer)做兼容处理，所以无需手动添加各浏览器的私有属性。

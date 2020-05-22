## HTML规范

### 语法
- 缩进使用soft tab（4个空格）；
- 嵌套的节点应该缩进；
- 在属性上，使用双引号，不要使用单引号；
- 属性名全小写，用中划线做分隔符；
- 不要在自动闭合标签结尾处使用斜线（HTML5 规范 指出他们是可选的）；
- 不要忽略可选的关闭标签，例：`</li>` 和 `</body>`。

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Page title</title>
    </head>
    <body>
        <img src="images/company_logo.png" alt="Company">

        <h1 class="hello-world">Hello, world!</h1>
    </body>
</html>
```

### 字符编码和lang属性

必须申明文档的编码charset，且与文件本身编码保持一致，推荐使用UTF-8编码`<meta charset="utf-8"/>`。
根据HTML5规范：应在html标签上加上lang属性。这会给语音工具和翻译工具帮助，告诉它们应当怎么去发音和翻译。(当然目前我们的项目并不需要这个属性，可有可无，建议加上 )


```html
<!DOCTYPE html>
<html lang="en-us">
    <head>
        <meta charset="UTF-8">
    </head>
    ...
</html>
```

### 结构顺序和视觉顺序基本保持一致

- 按照从上至下、从左到右的视觉顺序书写HTML结构。
- 有时候为了便于搜索引擎抓取，我们也会将重要内容在HTML结构顺序上提前。(项目特殊性，这一项不要求，但建议)
- 用div代替table布局，但表现具有明显表格形式的数据，首选table
- 使用语义化的标签`<section></section> , <main></main> 等`

```html
<!DOCTYPE html>
<html lang="en-us">
    <head>
        <meta charset="UTF-8">
    </head>
    <body>
        <header></header>
        <nav></nav>
        <main>
            <section></section>
        </main>
        <footer></footer>
    </body>
</html>
```

### 结构、表现、行为三者分离，避免内联

- 使用link将css文件引入，并置于head中；
- 使用script将js文件引入，并置于body底部。

```html
<!-- 通用 -->
<html>
  <head>
    <link rel="stylesheet" href="xxx.css">
  </head>
  <body>
    <!-- 内容 -->
    <script src="xxx.js" async></script>
  </body>
</html>
```
```html
<!-- 只兼容现代浏览器推荐 -->
<html>
  <head>
    <link rel="stylesheet" href="xxx.css">
<script src="xxx.js" async></script>
  </head>
  <body>
    <!-- 内容 -->
  </body>
</html>
```
此外，个人建议，htm尽可能的少引入样式文件和脚本文件：
1. 不使用超过一到两张样式表
2. 不使用超过一到两个脚本（学会用合并脚本）
3. 不使用行内样式`（<style>.no-good {}</style>）`
4. 不在元素上使用 `style 属性（<hr style="border-top: 5px solid black">）`
5. 不使用行内脚本`（<script>alert('no good')</script>）`
6. 不使用表象元素`（i.e. <b>, <u>, <center>, <font>, <b>）`
7. 不使用表象 `class 名（i.e. red, left, center）`

### html说明注释

采用类似标签闭合的写法，与HTML统一格式；
- 开始注释：（文案两头空格）。
- 结束注释：（文案前加“/”符号，类似标签的闭合）。
- 允许只有开始注释

```html
<html>
  <head>
    <link rel="stylesheet" href="xxx.css">
    <script src="xxx.js" async></script>
  </head>
  <body>
  <!-- 侧栏内容区 -->
  <div class="m-side">
    <div class="side">
        <div class="sidein">
            <!-- 热门标签 -->
            <div class="sideblk">
                <div class="m-hd3"><h3 class="tit">热门标签</h3> </div>
                ...
            </div>
            <!-- 最热TOP5 -->
            <div class="sideblk">
                <div class="m-hd3">
                    <h3 class="tit">最热TOP5</h3> 
                    <a href="#" class="s-fc02 f-fr">更多»</a>
                </div>
                ...
            </div>
        </div>
    </div>
   </div>
   <!-- /侧栏内容区 -->
   </body>
</html>
```

!> html编码，暂时规范这些，书写规范也会根据实际的开发做出调整和修改！
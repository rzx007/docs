## JavaScript代码规范

### 基本原则

- 所有的代码都要符合可维护性原则 —— 简单、便于阅读。

- 部分编码原则是与性能原则相悖的, 如果遇到这种情况, 请优先遵守语法规范，如果确实有不确定的 情况或者性能影响很大，可以共同商讨。

!> 由于JavaScript本身时弱类型语言，为变量赋值时会自动判断类型并进行转换，编码过程中不注意可能会出现意料之外的奇怪行为，所以一个符合规范的代码习惯尤为重要，此文档规范不一定是最佳实践，执行过程中会根据反馈调整。

### 文件命名

1. 文件命名, 必须是有意义的文件名; 建议使用英文或数字组合; 文件名中严禁出现中文; 多个英文单词请用驼峰 命名法，如：`historyManager.js`

2. 请不要在文件名后加数字, 来实现相同功能的多个版本, 如:`file1.file2.file3.js`是禁止的。

3. 所有上线代码及源代码必须纳入到 git 管理, 避免离职或者变动岗位, 造成代码丢失后期不可维护。

4. (建议) 不使用(汉语拼音/拼音英文数字组合/不规范的英文缩写)作为文件名。例如:` jubao.js, MseEvtHdlr.js, mendian-address.js`。(就是感觉很low)


### 变量命名

1. 声明变量必须加上关键字 var(建议，在现有项目中放心用let替代var), 避免使用未声明的变量。
2. 精简短小, 见名知意，禁止使用a,b,c等无意义的变量名。变量名使用英文大小写和数字命名, 使用驼峰命名规则, 例如: `getStyle、addEvent`。
3. 变量的命名, 不得使用 js 保留字。 js 保留字列表:` abstract boolean break byte case catch char class const continue default do double else extends false final finally float for function goto if implements import in instanceof int interface long native new null package private protected public return short static super switch synchronized this throw throws transient true try var void while with`
4. 常量、枚举量使用全大写作为变量名, 多个单词之间用下划线(-)分隔。例如: NAME_LIKE_THIS,私有化变量和方法名应该以下划线_开头。
5. 函数内保存 DOM 引用和定时器的变量, 使用完后必须显式销毁, 从而可以及时的执行内存回收。例如设置该变量为 `null`; 定时器变量销毁, 请执行 `clearInterval` 或者 `clearTimeout`。
6. (建议) this 命名, 尽量以能表达当前实例意义的名称, 通用命名为 self;
```js
Pager.protoype.goto = function() {
    var pager = this, index = page.currentIndex + 1;
    setTimeout(function() { page.doRequest(index); });
};
function foo1(){
    var self = this;
    setTimeout(function() { console.log(self.name); }, 1);
}
function foo2(name){
    var self = this;
    self.name = name;
    foo1.call(self);
}
```

### 代码格式化

代码的缩进原则是最直观体现代码风格的表现，代码格式化可自行百度查阅，这里也不规定具体怎么缩进代码，推荐使用统一的代码格式化插件`ESLint`，保存时自动格式化代码

### 代码注释

?> 注释，给以后需要理解你的代码的人或许就是你自己(也许一两个月后自己都看不明白了--！)留下信息是非常有用的。注释应该和它们所注释的代码一样是书写良好且清晰明了。 避免冗长或者情绪化的注释。

- 所有 js, css 文件头部, 必须有文件注释, 用于简要说明: 文件的主要功能(含模块信息)、作者(含作者邮箱)、版权等信息。 
文件头注释格式如下:
```js
// good
/** 
 * @param author:'阮志雄'，
 * @param fearures：'Supplementary power'
 * @param company:'**'
 * @param date:'2018-06-24 13:14'
*/
import $areaId from "@/assets/config/areaMap";
```
- 当然注释中不要带个人情绪
```js
// bad
/** 
增补电量模块
其实就是手动修改电量，造假专用
*/ 
export default {
    ...
}
```
- 所有公共函数方法,所有类注释，方便他人查阅使用(建议)

```js
/**
 * @func
 * @desc 一个带参数的函数
 * @param {string} a - 参数a
 * @param {number} b=1 - 参数b默认值为1
 * @param {string} c=1 - 参数c有两种支持的取值</br>1—表示x</br>2—表示xx
 * @param {object} d - 参数d为一个对象
 * @param {string} d.e - 参数d的e属性
 * @param {string} d.f - 参数d的f属性
 * @param {object[]} g - 参数g为一个对象数组
 * @param {string} g.h - 参数g数组中一项的h属性
 * @param {string} g.i - 参数g数组中一项的i属性
 * @param {string} [j] - 参数j是一个可选参数
 */
function foo(a, b, c, d, g, j) {
    ...
}

```
### 条件语句/循环

#### 条件语句
1. if 语句, 即使只有单行, 也要用花括号括起来, 例如:

```js
// (错误)
if (condition) statement;
// (正确)
if (condition) {
  statement;
}
```

2. 使用三元运算符, 替代单一的 if else 语句。例如:

```js
if (val != 0) {
     return foo();
} else {
    return bar();
}
// 可以写作:
return val ? foo() : bar();

```

3. if/else/while/for 条件表达式必须有小括号, 且自占一行。

4. (建议) 利用 && 和 || 短路来简化代码:

```javascript
function foo(opt_win) {
    var win;
    if (opt_win) {
        win = opt_win;
    } else {
        win = window;
    }
    // ...
}
// 可以写作:
function foo(opt_win) {
    var win = opt_win || window;
    // ...
}
```

&& 短路:

```javascript
if (node) {
    if (node.kids) {
        if (node.kids[index]) {
            foo(node.kids[index]);
        }
    }
}

// 可以写作:
if (node && node.kids && node.kids[index]) {
    foo(node.kids[index]);
}

// 或者
var kid = node && node.kids && node.kids[index];
if (kid) {
    foo(kid);
}
```
5.(建议) 使用严格的条件判断符。用 === 代替 ==, 用!== 代替 !=。

#### 循环

1. 尽量避免 for-in 循环, 只用于 object/hash 的遍历, 数组的遍历使用 for 循环。

2. for-in 循环体中必须用 hasOwnProperty 方法检查成员是否为自身成员, 避免来自原型链上的污染。
3. 在循环中, 尽量使用单字符变量名称, 例如: i, j, k, m, n;
4. 避免在 if 和 while 语句的条件部分进行赋值。例如:

```javascript
// (错误)
var i = 10;
while (i = i - 2) {
    statement;
}
// 应该写作: (正确)
var i = 10;
while (i > 0) {
    statement;
    i = i - 2;
}
```

#### 其他

1. 禁止使用 void、eval, with, 只在将 ajax 响应的文本解析为 json 时使用 eval()。

2. 不要使用 function 构造器。

3. 不要滥用括号, 在必要的时候使用它。

?> 对于一元操作符(如 delete, typeof 和 void ), 或是在某些关键词(如 return, throw, case, new )之后, 不要使用括号。
4. 代码中调试用的 alert、console.log、console.dir、debugger 等代码, 在提交到 git 之前, 必须完全清理掉。

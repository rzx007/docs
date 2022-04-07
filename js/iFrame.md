<!--
 * @Author: 阮志雄
 * @Date: 2022-04-07 14:34:42
 * @LastEditTime: 2022-04-07 14:41:58
 * @LastEditors: 阮志雄
 * @Description: In User Settings Edit
 * @FilePath: \docs\js\iFrame.md
-->
### js判断是否在iframe和禁止网页在iframe中显示

js判断是否在iframe和禁止网页在iframe中显示

如果也没在frame框架中打开，则在顶层窗口中打开啊

```js
<script type="text/javascript">
    if (self != top) { top.location.href=location.href; } 
</script>
```
js判断在iframe里：
```js
//方式一    
if (self.frameElement && self.frameElement.tagName == "IFRAME") {    
         alert('在iframe中');    
}    
//方式二    
if (window.frames.length != parent.frames.length) {    
         alert('在iframe中');    
}    
//方式三    
if (self != top) {      
         alert('在iframe中');    
}
```

防止网页被别站用iframe引用：

通过js防止：

```js
//方式一    
if (self.frameElement && self.frameElement.tagName == "IFRAME") {    
         location.href="about:blank";   
}    
//方式二    
if (window.frames.length != parent.frames.length) {    
         location.href="about:blank";  
}    
//方式三    
if (self != top) {      
         location.href="about:blank";   
}
```

通过header配置防止：
php配置：
```js
header("X-Frame-Options:deny");  
header("X-Frame-Options:SAMEORIGIN");  
```
Nginx配置：
```js
add_header X-Frame-Options SAMEORIGIN  
```

Apache配置：
```js
Header always append X-Fram-Options SAMEORIGIN  
```
```bash
X-Frame-Options：
DENY：禁止当前页面放在IFrame内
SAMEORIGIN：在同源情况下可以使用IFrame内
ALLOW-FROM http://a.com/：在a.com的域名内可以使用Iframe
```
通过meta设置：

```js
<meta http-equiv="X-Frame-Options" content="deny">  
```

### 使用 postMessage() 方法用于安全地实现跨源通信

`window.postMessage(message,targetOrigin)` 方法是html5新引进的特性，可以使用它来向其它的window对象发送消息，无论这个window对象是属于同源或不同源，目前IE8+、FireFox、Chrome、Opera等浏览器都已经支持`window.postMessage`方法

语法
> otherWindow.postMessage(message, targetOrigin, [transfer]

参数 说明
`otherWindow` 其他窗口的一个引用，比如 `iframe` 的 `contentWindow` 属性、执行` window.open` 返回的窗口对象、或者是命名过或数值索引的 `window.frames`。
`message` 将要发送到其他 `window的数据。`
`targetOrigin` 指定哪些窗口能接收到消息事件，其值可以是 *（表示无限制）或者一个 `URI`。
`transfer` 可选，是一串和 message 同时传递的 `Transferable` 对象。这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。

### postMessage双向发送消息

父页面
```js
<div style="margin-bottom: 20px;">
    <button onclick="handleEvent()">向子页面发送信息</button>
</div>
<iframe src="iframe.html" id="iframe"></iframe>
<script>
    function handleEvent() {
        // iframe的id
        var f = document.getElementById('iframe');
        // 触发子页面的监听事件
        f.contentWindow.postMessage('父页面发的消息', '*');
    }

    // 注册消息事件监听，接受子元素给的数据
    window.addEventListener('message', (e) => {
        console.log(e.data);
    }, false);
</script>
```
iframe窗口
```js
<button onclick="handleEvent()">向父页面发送信息</button>
<p>子页面</p>
<script>
    // 注册消息事件监听，接受父元素给的数据
    window.addEventListener('message', (e) => {
        console.log('iframe=' + e.data);
    }, false);

    function handleEvent() {
        // 向父页面发消息
        window.parent.postMessage('子页面发的消息', '*');
    }

</script>
```
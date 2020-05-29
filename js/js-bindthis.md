## js中绑定this的几种方法

?>JavaScript（以下简称js）是一门动态语言，与传统的c，c++最大的区别就是js是在运行时动态检测值的类型和变化。这一点有很大的好处，比如可以进行隐式类型转换而不报错，书写更加灵活。当然也会造成很多问题。this是js中的一个关键字，它代表当前作用域的上下文环境，而且随着上下文的改变而动态变化。

### 为什么需要绑定this

this代指当前的上下文环境，在不经意间容易改变
```js
var info = "This is global info";
var obj = {
    info: 'This is local info',
    getInfo: getInfo
}
function getInfo() {
    console.log(this.info);
}
obj.getInfo()    //This is local info

getInfo()    //This is global info 当前上下文环境被修改了
```
在上面的例子中，我们在对象内部创建一个属性getInfo，对全局作用域下的getInfo进行引用，而它的作用是打印当前上下文中info的值，当我们使用obj.getInfo进行调用时，它会打印出对象内部的info的值，此时this指向该对象。而当我们使用全局的函数时，它会打印全局环境下的info变量的值，此时this指向全局对象。

这个例子告诉我们：

1. 同一个函数，调用的方式不同，this的指向就会不同，结果就会不同。
2. 对象内部的属性的值为引用类型时，this的指向不会一直绑定在原对象上。
其次，还有不经意间this丢失的情况：

```js
var info = "This is global info";
var obj = {
    info: 'This is local info',
    getInfo: function getInfo() {
        console.log(this.info);

        var getInfo2 = function getInfo2() {
            console.log(this.info);
        }
        getInfo2();
    }
}
obj.getInfo();

//This is local info
//This is global info
```

上面的例子中，对象obj中定义了一个getInfo方法，方法内定义了一个新的函数，也希望拿到最外层的该对象的info属性的值，但是事与愿违，函数内函数的this被错误的指向了window全局对象上面，这就导致了错误。

解决的方法也很简单，在最外层定义一个变量，存储当前词法作用域内的this指向的位置，根据变量作用域的关系，之后的函数内部还能访问这个变量，从而得到上层函数内部this的真正指向。

```js
var info = "This is global info";
var obj = {
    info: 'This is local info',
    getInfo: function getInfo() {
        console.log(this.info);

        var self = this;          //将外层this保存到变量中
        var getInfo2 = function getInfo2() {
            console.log(self.info);    //指向外层变量代表的this
        }
        getInfo2();
    }
}
obj.getInfo();

//This is local info
//This is local info
```
然而这样也会有一些问题，上面的self变量等于重新引用了obj对象，这样的话可能会在有些时候不经意间修改了整个对象，而且当需要取得多个环境下的this指向时，就需要声明多个变量，不利于管理。

有一些方法，可以在不声明类似于self这种变量的条件下，绑定当前环境下的上下文，确保编程内容的安全。

### 如何绑定this

#### 1. call, apply

call和apply是定义在Function.prototype上的两个函数，他们的作用就是修正函数执行的上下文，也就是this的指向问题。

以call为例，上述anotherFun想要输出local thing就要这样修改

```js
...
var anotherFun = obj.getInfo;
anotherFun.call(obj)    //This is local info

```

函数调用的参数：

1. `Function.prototype.call(context [, argument1, argument2 ])`
1. `Function.prototype.apply(context [, [ arguments ] ])`
从这里就可以看到，call和apply的第一参数是必须的，接受一个重新修正的上下文，第二个参数都是可选的，他们两个的区别在于，call从第二个参数开始，接受传入调用函数的值是一个一个单独出现的，而apply是接受一个数组传入。

```js 
function add(num1, num2, num3) {
  return num1 + num2 + num3;
}
add.call(null, 10, 20, 30);    //60
add.apply(null, [10, 20, 30]);    //60
```
当接受的context为undefined或null时，会自动修正为全局对象，上述例子中为window

#### 2. 使用Function.prototype.bind进行绑定

ES5中在Function.prototype新增了bind方法，它接受一个需要绑定的上下文对象，并返回一个调用的函数的副本，同样的，它也可以在后面追加参数，实现函数的柯里化。

`Function.prototype.bind(context[, argument1, argument2])`

```js
//函数柯里化部分
function add(num1 ,num2) {
    return num1 + num2;
}
var anotherFun = window.add.bind(window, 10);
anotherFun(20);    //30
```

同时，他返回一个函数的副本，并将函数永远的绑定在传入的上下文中。
```js
...
var anotherFun = obj.getInfo.bind(obj)
anotherFun();    //This is local info
```

**当使用bind进行绑定之后，即不能再通过call，apply进行修正this指向，所以bind绑定又称为硬绑定。**


#### 3. 使用new关键字进行绑定

在js中，函数有两种调用方式，一种是直接进行调用，一种是通过new关键字进行构造调用

```js
function fun(){console.log("function called")}
//直接调用
fun()    //function called
//构造调用
var obj = new fun()    //function called
```

那普通的调用和使用new关键字的构造调用之间，又有哪些区别呢？

准确的来说，就是new关键字只是在调用函数的基础上，多增加了几个步骤，其中就包括了修正this指针到return回去的对象上。

```js
var a = 5;
function Fun() {
  this.a = 10;
}
var obj = new Fun();
obj.a    //10
```

### 几种绑定方式的优先级比较

以下面这个例子来进行几种绑定状态的优先级权重的比较

```js
var obj1 = {
  info: "this is obj1",
  getInfo: () => console.log(this.info)
}

var obj2 = {
  info: "this is obj2",
  getInfo: () => console.log(this.info)
}
```

#### 1. call,apply和默认指向比较

首先很显然，根据使用频率来想，使用call和apply会比直接调用的优先级更高。

```js 
obj1.getInfo()    //this is obj1
obj2.getInfo()    //this is obj2
obj1.getInfo.call(obj2)    //this is obj2
obj2.getInfo.call(obj1)    //this is obj1
```

使用call和apply相比于使用new呢？

这个时候就会出现问题了，因为我们没办法运行类似 new function.call(something)这样的代码。所以，我们通过bind方法返回一个新的函数，再通过new判断优先级。

```js
var obj = {}
function foo(num){
  this.num = num;
}

var setNum = foo.bind(obj);
setNum(10);
obj.num    //10

var obj2 = new setNum(20);
obj.num    //10
obj2.num    //20
```
通过这个例子我们可以看出来，使用new进行构造调用时，会返回一个新的对象，并将this修正到这个对象上，但是它并不会改变之前的对象内容

### 箭头函数

ES6中新增了一种定义函数方式，使用"=>"进行函数的定义，在它的内部，this的指针不会改变，永远指向最外层的词法作用域。

```js 
var obj = {
  num: 1,
  getNum: function () {
    return function () {
      //this丢失
      console.log(this.num);    
      //此处的this指向window
    }
  }
}
obj.getNum()();    //undefined

var obj2 = {
  num: 2,
  getNum: function () {
    return () => console.log(this.num);    
    //箭头函数内部绑定外部getNum的this，外部this指向调用的对象
  }
}
obj2.getNum()();    //2

```

#### bind，call的妙用
在平日里我们需要将伪数组元素变为正常的数组元素时，往往通过Array.prototype.slice方法，正如上面的实例那样。将arguments这个对象变为真正的数组对象，使用 Array.prototype.slice.call(arguments)进行转化.。但是，每次使用这个方法太长而且繁琐。所以有时候我们就会这样写：

```js
var slice = Array.prototype.slice;
slice(arguments);
//error
```
同样的问题还出现在：
```js
var qsa = document.querySelectorAll;
qsa(something);
//error
```
上面的问题就出现在，内置的slice和querySelectorAll方法，内部使用了this，当我们简单引用时，this在运行时成为了全局环境window，当然会造成错误。我们只需要简单的使用bind，就能创建一个函数副本。

```js
var qsa = document.querySelectorAll.bind(document);
qsa(something);
```
同样的，使用因为call和apply也是一个函数，所以也可以在它们上面调用bind方法。从而使返回的函数的副本本身就带有修正指针的功能

```js
var slice = Function.prototype.call.bind(Array.prototype.slice);
slice(arguments);
```
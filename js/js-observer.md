## 发布订阅模式与观察者模式

### 背景

?> 设计模式并非是软件开发的专业术语，实际上，“模式”最早诞生于建筑学。

设计模式的定义是：在面向对象软件设计过程中针对特定问题的简洁而优雅的解决方案。通俗一点说，设计模式是在某种场合下对某个问题的一种解决方案。如果再通俗一点说，设计模式就是给面向对象软件开发中的一些好的设计取个名字。

这些“好的设计”并不是谁发明的，而是早已存在于软件开发中。一个稍有经验的程序员也许在不知不觉中数次使用过这些设计模式。GoF（Gang of Four--四人组，《设计模式》几位作者）最大的功绩是把这些“好的设计”从浩瀚的面向对象世界中挑选出来，并且给予它们一个好听又好记的名字。

设计模式并不直接用来完成代码的编写，而是描述在各种不同情况下，要怎么解决问题的一种方案，他不是一个死的机制，他是一种思想，一种写代码的形式。每种语言对于各种设计模式都有他们自己的实现方式，对于某些设计模式来说，可能在某些语言下并不适用，比如工厂方法模式对于javascript。模式应该用在正确的地方。而哪些才算正确的地方，只有在我们深刻理解了模式的意图之后，再结合项目的实际场景才会知道。。

模式的社区一直在发展。GoF在1995年提出了23种设计模式，但模式不仅仅局限于这23种，后面增加到了24种。在这20多年的时间里，也许有更多的模式已经被人发现并总结了出来，比如一些JavaScript 图书中会提到模块模式、沙箱模式等。这些“模式”能否被世人公认并流传下来，还有待时间验证

### 观察者模式（Observer Pattern）

观察者模式定义了对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知，并自动更新。观察者模式属于行为型模式，行为型模式关注的是对象之间的通讯，观察者模式就是观察者和被观察者之间的通讯。

观察者模式有一个别名叫“发布-订阅模式”，或者说是“订阅-发布模式”，订阅者和订阅目标是联系在一起的，当订阅目标发生改变时，逐个通知订阅者。我们可以用报纸期刊的订阅来形象的说明，当你订阅了一份报纸，每天都会有一份最新的报纸送到你手上，有多少人订阅报纸，报社就会发多少份报纸，报社和订报纸的客户就是上面文章开头所说的“一对多”的依赖关系。

### 发布订阅模式（Pub-Sub Pattern）

其实24种基本的设计模式中并没有发布订阅模式，上面也说了，他只是观察者模式的一个别称。

但是经过时间的沉淀，似乎他已经强大了起来，已经独立于观察者模式，成为另外一种不同的设计模式。

在现在的发布订阅模式中，称为发布者的消息发送者不会将消息直接发送给订阅者，这意味着发布者和订阅者不知道彼此的存在。在发布者和订阅者之间存在第三个组件，称为消息代理或调度中心或中间件，它维持着发布者和订阅者之间的联系，过滤所有发布者传入的消息并相应地分发它们给订阅者。

举一个例子，你在微博上关注了A，同时其他很多人也关注了A，那么当A发布动态的时候，微博就会为你们推送这条动态。A就是发布者，你是订阅者，微博就是调度中心，你和A是没有直接的消息往来的，全是通过微博来协调的（你的关注，A的发布动态）

### 观察者模式和发布订阅模式有什么区别？

我们先来看下这两个模式的实现结构：

![observer](../static/observer.png)

**观察者模式**：观察者（Observer）直接订阅（Subscribe）主题（Subject），而当主题被激活的时候，会触发（Fire Event）观察者里的事件。

**发布订阅模式**：订阅者（Subscriber）把自己想订阅的事件注册（Subscribe）到调度中心（Topic），当发布者（Publisher）发布该事件（Publish topic）到调度中心，也就是该事件触发时，由调度中心统一调度（Fire Event）订阅者注册到调度中心的处理代码。

我们再来看下这两个模式的代码案例：（猎人发布与订阅任务）

**观察者模式：**

```js
    //有一家猎人工会，其中每个猎人都具有发布任务(publish)，订阅任务(subscribe)的功能
    //他们都有一个订阅列表来记录谁订阅了自己
    //定义一个猎人类
    //包括姓名，级别，订阅列表
    function Hunter(name, level){
        this.name = name
        this.level = level
        this.list = []
    }
    Hunter.prototype.publish = function (money){
        console.log(this.level + '猎人' + this.name + '寻求帮助')
        this.list.forEach(function(item, index){
            item(money)
        })
    }
    Hunter.prototype.subscribe = function (targrt, fn){
        console.log(this.level + '猎人' + this.name + '订阅了' + targrt.name)
        targrt.list.push(fn)
    }
    
    //猎人工会走来了几个猎人
    let hunterMing = new Hunter('小明', '黄金')
    let hunterJin = new Hunter('小金', '白银')
    let hunterZhang = new Hunter('小张', '黄金')
    let hunterPeter = new Hunter('Peter', '青铜')
    
    //Peter等级较低，可能需要帮助，所以小明，小金，小张都订阅了Peter
    hunterMing.subscribe(hunterPeter, function(money){
        console.log('小明表示：' + (money > 200 ? '' : '暂时很忙，不能') + '给予帮助')
    })
    hunterJin.subscribe(hunterPeter, function(){
        console.log('小金表示：给予帮助')
    })
    hunterZhang.subscribe(hunterPeter, function(){
        console.log('小张表示：给予帮助')
    })
    
    //Peter遇到困难，赏金198寻求帮助
    hunterPeter.publish(198)
    
    //猎人们(观察者)关联他们感兴趣的猎人(目标对象)，如Peter，当Peter有困难时，会自动通知给他们（观察者）
```

**发布订阅模式：**

```js
    //定义一家猎人工会
    //主要功能包括任务发布大厅(topics)，以及订阅任务(subscribe)，发布任务(publish)
    let HunterUnion = {
        type: 'hunt',
        topics: Object.create(null),
        subscribe: function (topic, fn){
            if(!this.topics[topic]){
                  this.topics[topic] = [];  
            }
            this.topics[topic].push(fn);
        },
        publish: function (topic, money){
            if(!this.topics[topic])
                  return;
            for(let fn of this.topics[topic]){
                fn(money)
            }
        }
    }
    
    //定义一个猎人类
    //包括姓名，级别
    function Hunter(name, level){
        this.name = name
        this.level = level
    }
    //猎人可在猎人工会发布订阅任务
    Hunter.prototype.subscribe = function (topic, fn){
        console.log(this.level + '猎人' + this.name + '订阅了狩猎' + topic + '的任务')
        HunterUnion.subscribe(topic, fn)
    }
    Hunter.prototype.publish = function (topic, money){
        console.log(this.level + '猎人' + this.name + '发布了狩猎' + topic + '的任务')
        HunterUnion.publish(topic, money)
    }
    
    //猎人工会走来了几个猎人
    let hunterMing = new Hunter('小明', '黄金')
    let hunterJin = new Hunter('小金', '白银')
    let hunterZhang = new Hunter('小张', '黄金')
    let hunterPeter = new Hunter('Peter', '青铜')
    
    //小明，小金，小张分别订阅了狩猎tiger的任务
    hunterMing.subscribe('tiger', function(money){
        console.log('小明表示：' + (money > 200 ? '' : '不') + '接取任务')
    })
    hunterJin.subscribe('tiger', function(money){
        console.log('小金表示：接取任务')
    })
    hunterZhang.subscribe('tiger', function(money){
        console.log('小张表示：接取任务')
    })
    //Peter订阅了狩猎sheep的任务
    hunterPeter.subscribe('sheep', function(money){
        console.log('Peter表示：接取任务')
    })
    
    //Peter发布了狩猎tiger的任务
    hunterPeter.publish('tiger', 198)
    
    //猎人们发布(发布者)或订阅(观察者/订阅者)任务都是通过猎人工会(调度中心)关联起来的，他们没有直接的交流。
```

观察者模式和发布订阅模式最大的区别就是发布订阅模式有个事件调度中心。

观察者模式由具体目标调度，每个被订阅的目标里面都需要有对观察者的处理，这种处理方式比较直接粗暴，但是会造成代码的冗余。

而发布订阅模式中统一由调度中心进行处理，订阅者和发布者互不干扰，消除了发布者和订阅者之间的依赖。这样一方面实现了解耦，还有就是可以实现更细粒度的一些控制。比如发布者发布了很多消息，但是不想所有的订阅者都接收到，就可以在调度中心做一些处理，类似于权限控制之类的。还可以做一些节流操作。

### 观察者模式是不是发布订阅模式

网上关于这个问题的回答，出现了两极分化，有认为发布订阅模式就是观察者模式的，也有认为观察者模式和发布订阅模式是真不一样的。

其实我不知道发布订阅模式是不是观察者模式，就像我不知道辨别模式的关键是设计意图还是设计结构（理念），虽然《JavaScript设计模式与开发实践》一书中说了分辨模式的关键是意图而不是结构。

如果以结构来分辨模式，发布订阅模式相比观察者模式多了一个中间件订阅器，所以发布订阅模式是不同于观察者模式的；如果以意图来分辨模式，他们都是实现了对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知，并自动更新，那么他们就是同一种模式，发布订阅模式是在观察者模式的基础上做的优化升级。

不过，不管他们是不是同一个设计模式，他们的实现方式确实有差别，我们在使用的时候应该根据场景来判断选择哪个。

### 实现自定义事件
?>用JavaScript的话来说，观察者模式的实质就是你可以对程序中某个对象的状态进行观察，并且在其发生改变时能够得到通知。

#### 利用观察者模式可以很容易的实现自定义事件，具体代码如下
```js
var Event=function() {
  this.subscibers={};//保存事件的回调函数  
};
Event.prototype={
    constructor:Event,//保持原型链的完整
    on:function(type,callback) {  //绑定事件
        this.subscibers[type]=[];
        this.subscibers[type].push(callback);
      } else {
        this.subscibers[type].push(callback);
      }
    },
    off:function(type) {  //移除事件
      this.subscibers[type]=[];
    },
    emit:function(type) { //触发事件
      var t=this;
      if(typeof this.subscibers[type]=='object') {
        this.subscibers[type].forEach(function(fn,i) {
          fn.call(t);
        });
      } 
    }
};

var s=new Event();
s.title='测试自定义事件';

s.on('change.title',function() {
  console.log(this.title);
});

s.setTitle=function(value) {
  this.title=value;
  this.emit('change.title')
};

s.setTitle('属性发生了变化');
```
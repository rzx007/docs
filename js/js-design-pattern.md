# 前端必须掌握的7种设计模式
 >在前端开发中，设计模式是解决特定问题的经验总结和可复用的解决方案。设计模式可以提高代码的复用性、可维护性和可读性，是提高开发效率的重要手段。我们一起来看下7种前端开发中必须掌握的设计模式🚀。
 ### 1. 单例模式

 单例模式是一种只允许创建一个实例的模式。在前端开发中，常用于创建全局唯一的对象，例如全局的状态管理器、日志记录器等。单例模式可以保证全局只有一个实例，避免了重复创建和资源浪费的问题

 单例模式的代码实现：
 ```js
 // 单例模式示例代码
class Singleton {
  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = this;
    }
    return Singleton.instance;
  }

  createInstance() {
    const object = { name: "example" };
    return object;
  }

  getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = this.createInstance();
    }
    return Singleton.instance;
  }
}

// 使用示例
const instance1 = new Singleton();
const instance2 = new Singleton();

console.log(instance1 === instance2); // true
```

以上代码是单例模式的一个示例，通过该模式可以保证全局只有一个实例，避免了重复创建和资源浪费的问题。在这个示例中，Singleton 类只能创建一个实例，如果多次创建，返回的都是同一个实例，因此 instance1 和 instance2 的值是相等的。单例模式常用于创建全局唯一的对象，例如全局的状态管理器、日志记录器等。

### 2. 工厂模式
工厂模式是一种根据参数的不同创建不同对象的模式。在前端开发中，常用于创建不同类型的组件、插件等。工厂模式可以将对象的创建和使用分离，提高代码的灵活性和可维护性。

工厂模式的代码实现：

```js
class Product {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

class ProductFactory {
  static createProduct(name) {
    return new Product(name);
  }
}

// 使用示例
const product = ProductFactory.createProduct("Example Product");
console.log(product.getName()); // "Example Product"
```

以上代码中，`Product` 类表示要创建的产品，`ProductFactory` 类实现了工厂模式，通过 `createProduct` 方法创建产品实例。在使用时，可以通过工厂类创建产品实例，而不需要直接调用产品类的构造函数。通过工厂模式可以将对象的创建和使用分离，提高代码的灵活性和可维护性。

### 3. 观察者模式

观察者模式是一种对象间的一对多依赖关系，当一个对象状态改变时，所有依赖它的对象都会自动更新。在前端开发中，常用于实现事件监听和消息订阅等。观察者模式可以降低对象间的耦合度，提高代码的可读性和可复用性。

观察者模式的代码实现：
```js
class Subject {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(data) {
    this.observers.forEach(observer => observer.update(data));
  }
}

class Observer {
  update(data) {
    console.log(`Received data: ${data}`);
  }
}

// 使用示例
const subject = new Subject();
const observer1 = new Observer();
const observer2 = new Observer();

subject.addObserver(observer1);
subject.addObserver(observer2);

subject.notify("Hello World!");
```

以上代码中，`Subject` 类实现了观察者模式，通过 `addObserver` 方法添加观察者，通过 `notify` 方法通知观察者，触发其 `update` 方法。`Observer` 类实现了具体的观察者，通过 update 方法接收数据并进行处理。

### 4. 装饰器模式

装饰器模式是一种在不改变对象自身的基础上，动态地给对象增加新的功能的模式。在前端开发中，常用于实现组件的复用和功能的增强等。装饰器模式可以避免类的继承带来的复杂性和耦合度，提高代码的灵活性和可维护性。

装饰器模式的代码实现：

```js
interface Component {
  operation(): void;
}

class ConcreteComponent implements Component {
  public operation(): void {
    console.log("ConcreteComponent: operation.");
  }
}

class Decorator implements Component {
  protected component: Component;

  constructor(component: Component) {
    this.component = component;
  }

  public operation(): void {
    console.log("Decorator: operation.");
    this.component.operation();
  }
}

class ConcreteDecoratorA extends Decorator {
  public operation(): void {
    super.operation();
    console.log("ConcreteDecoratorA: operation.");
  }
}

class ConcreteDecoratorB extends Decorator {
  public operation(): void {
    super.operation();
    console.log("ConcreteDecoratorB: operation.");
  }
}

// 使用示例
const concreteComponent = new ConcreteComponent();
const concreteDecoratorA = new ConcreteDecoratorA(concreteComponent);
const concreteDecoratorB = new ConcreteDecoratorB(concreteDecoratorA);

concreteDecoratorB.operation();
```
以上代码中，`Component` 接口定义了装饰器模式中的组件的基本操作，`ConcreteComponent` 类实现了具体的组件，`Decorator` 类实现了装饰器的基本操作，并通过 `protected` 属性持有被装饰的组件。`ConcreteDecoratorA` 和 `ConcreteDecoratorB` 类分别实现了具体的装饰器操作。在使用时，可以通过多次装饰对象来增加功能，而不需要直接修改原始对象的代码。通过装饰器模式可以动态地增加对象的功能，提高代码的灵活性和可复用性。

### 5. 代理模式
代理模式是一种通过一个代理对象控制对目标对象的访问的模式。在前端开发中，常用于实现图片懒加载、数据缓存等。代理模式可以保护目标对象，控制其访问和使用，提高代码的安全性和可读性。

代理模式的代码实现：
```js
const target = {
  method() {
    console.log("Target method.");
  }
};

const proxy = new Proxy(target, {
  get(target, prop) {
    console.log(`Called ${prop} method.`);
    return target[prop];
  }
});

// 使用示例
proxy.method(); // "Called method method. Target method."
```
以上代码中，`target` 对象实现了原始功能，`proxy` 对象实现了代理功能，通过 `new Proxy()` 创建代理对象。代理对象通过 `get` 方法拦截对目标对象方法的访问，并在控制台输出信息。通过代理模式可以控制对目标对象的访问和使用，实现数据缓存、权限控制等功能，提高代码的可读性和可维护性。

### 6. 适配器模式

适配器模式是一种将不同接口转换成统一接口的模式。在前端开发中，常用于实现不同浏览器的兼容、不同数据格式的转换等。适配器模式可以降低系统间的耦合度，提高代码的复用性和可维护性。

适配器模式的代码实现：
```js
class Adaptee {
  specificRequest() {
    return "适配者中的业务代码被调用";
  }
}

class Target {
  constructor() {
    this.adaptee = new Adaptee();
  }

  request() {
    let info = this.adaptee.specificRequest();
    return `${info} - 转换器 - 适配器代码被调用`;
  }
}

// 使用示例
let target = new Target();
target.request(); // "适配者中的业务代码被调用 - 转换器 - 适配器代码被调用"
```
以上代码中，`Adaptee` 类实现了原始的业务代码，`Target` 类实现了适配器代码，并通过 `new Adaptee()` 创建了一个 `Adaptee` 对象用于调用原始业务代码。在 `request` 方法中，首先调用 `Adaptee` 对象的 `specificRequest` 方法获取原始业务代码的信息，然后进行转换并返回。通过适配器模式可以将原始业务代码和适配器代码分开实现，提高代码的可维护性和可复用性。

### 7. MVC模式
MVC模式是一种将应用程序分为三个部分：模型、视图和控制器。在前端开发中，常用于实现数据的管理、页面的渲染和交互的处理等。MVC模式可以降低代码的复杂度，提高代码的可维护性和可测试性。

MVC模式的代码实现：
```js
class Model {
  constructor() {
    this.data = {
      name: "example",
      age: 18,
      gender: "male"
    };
  }

  setData(key, value) {
    this.data[key] = value;
  }

  getData() {
    return this.data;
  }
}

class View {
  constructor() {
    this.container = document.createElement("div");
  }

  render(data) {
    const { name, age, gender } = data;
    this.container.innerHTML = `
      <p>Name: ${name}</p>
      <p>Age: ${age}</p>
      <p>Gender: ${gender}</p>
    `;
    document.body.appendChild(this.container);
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.render(this.model.getData());
  }

  setData(key, value) {
    this.model.setData(key, value);
    this.view.render(this.model.getData());
  }
}

// 使用示例
const model = new Model();
const view = new View();
const controller = new Controller(model, view);

controller.setData("age", 20);
```

以上代码中，`Model` 类实现了应用程序的数据管理，`View` 类实现了应用程序的视图展示，`Controller` 类实现了视图和数据的绑定和交互处理。在 `Controller` 类中，通过调用 `model.setData` 方法和 `view.render` 方法实现了数据的修改和页面的重新渲染。通过MVC模式可以将应用程序分解为不同的部分，提高代码的可维护性和可测试性
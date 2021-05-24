## 类

?> `Dart` 是一种基于类和 `mixin` 继承机制的面向对象的语言。 每个对象都是一个类的实例，所有的类都继承于 `Object`. 。 基于 _ `Mixin` 继承_ 意味着每个类（除 `Object` 外） 都只有一个超类， 一个类中的代码可以在其他多个继承类中重复使用。

### 一、类的声明与使用

#### 1、声明一个 Person 类

> 在 `lib/Person.dart` 声明了一个 `Person class`：

```dart
class Person {
  // 类属性声明
  String name;
  int age;
  int sex;

  // 普通构造函数
  Person(String name, int age, [int sex = 1]) {
    this.name = name;
    this.age = age;
    this.sex = sex;
  }

  // 方法声明
  void getInfo() {
    print(
        'My name is ${name}, my age is ${age}, and I am a ${sex == 1 ? 'man' : 'woman'}');
  }

  // 修改类属性
 void changeName(String name) {
    if (name != null) {
      this.name = name;
    }
  }
}
```

上面的类已经声明结束了，属性、方法和构造函数都有。

#### 2、类的引入

在要使用的 dart 文件中引入 `Person` 类：

```dart
import 'lib/Person.dart';
```

#### 3、实例化 Person 类

```dart
Person p = new Person('ada', 20, 0);
p.getInfo();
p.changeName('postburd');
p.getInfo();
```

输出结果：

```
My name is ads, myage id 20, and i am woman
My name is postburd, my age is 20, and i am a woman
```

#### 4、私有属性及私有方法

私有属性和方法 只有放在单独的文件 class 中生效

```dart
class Person {
// ...
  String _secret; // 私有属性 只有放在单独的文件 class 中生效

// ...
  // 私有方法
  void _run() {
    print('private function _run');
  }

  // 对外暴露私有方法
  void executeRun() {
    this._run();
  }
}
```

访问私有属性和方法：

```dart
print('---------私有属性和方法-----------');
Person p4 = new Person.secret('_secret message');
print(p4.getSecret());
p4.setSecret('new _secret message');
print(p4.getSecret());
```

```
---------私有属性和方法-----------'
```

#### 5、命名构造函数

命名构造函数允许多个不同名称构造函数的存在，调用不同名称的构造函数，可以实例化出不同的实例。

```dart
 // 命名构造函数
  Person.now() {
    print(new DateTime.now());
  }
  Person.setInfo(this.name, this.age, [this.sex]);
  Person.secret(this._secret);
```

使用命名构造函数：

```dart
print('--------命名构造函数------------');
Person p2 = new Person.now();
print(p2);
p2.getInfo();
p2.changeName('postburd');
p2.getInfo();
```
#### 6、getter和setter
`getter` 和 `setter` 可以最大程度的简化值得获取或者格式化以及设置
```dart
  get info{
    return 'My name is ${name}, my age is ${age}, and I am a ${sex == 1 ? 'man' : 'woman'}';
  }
  set newName(String name) {
    if(name != null) {
      this.name = name;    
    }
  }
```
使用 getter 和 setter
```dart
print('----------getter和setter----------');
Person p5 = new Person('rzx', 20);
print(p5.info);
p5.newName = 'newNamerzx';
print(p5.info);
```
#### 7、初始化构造列表
初始化构造函数可以默认初始化一个值，不过单 class 上没有实际意义
```dart
String defaultCounntry;
// 初始化列表
Person(String name, int age, [int sex = 1]):defaultCounntry = 'CN' {
  this.name = name;
  this.age = age;
  this.sex = sex;
}
```
使用：
```dart
print('----------初始化构造列表----------');
Person p6 = new Person('rzx', 20);
print(p6.info);
print(p6.defaultCounntry);
```
### 8、简写构造函数
如果构造函数没有特殊逻辑处理，可以使用简写的构造函数：
```dart
// 简写构造函数
Person(this.name, this.age, [this.sex]);
```
### 二、静态成员
静态方法只能访问静态属性，不能访问非静态属性。

非静态方法可以正常访问静态属性
```dart
class Person {
  static String name;
  int age;
  static void setName(String name) {
    Person.name = name;
    // this.age = 20; // error
  }
  void printName() {
    print('name is ${Person.name}');
  }
}


void main() {
  print('------------静态成员-------------------');
  Person p1 = new Person();
  p1.printName();
  Person.setName('rzx');
  p1.printName();
  print(Person.name);
}
```
### 三、? 、is 、as 和 .. 操作符
`? `操作符用于判断如果实例存在则调用方法，否则不调用

`is` 用于判断是否归属于某个类的实例或者子类

`as` 用于声明某个实例当做某个类使用，比如 `子类 as 父类`

`..` 级联操作符用于串联操作
代码示例：
```dart
import 'demo6.dart';

class Person {
  String name;
  int age;
  Person(this.name, this.age);

  void printInfo() {
    print('name is ${this.name}, age is ${this.age}');
  }
}


void main() {
  // p.printInfo(); // NoSuchMethodError: The method 'printInfo' was called on null.
  print('----------- ? 条件运算符----------------');
  Person p1;
  p1?.printInfo();
  Person p2 = new Person('postbird', 20);
  p2?.printInfo();
  print('----------- is ---------------');
  if (p2 is Person) {
    p2.name = 'newPers';
  }
  p2.printInfo();
  print(p1 is Person);
  print('----------- as ---------------');
  var p3 = p2;
  // (p3 as Person).name = 'newPtbird';
  // p3.printInfo();
  (p3 as Person).printInfo();
  print('----------- .. 级联操作符---------------');
  Person p4 = new Person('sada', 20);
  p4..name = 'new Name'
    ..age = 22
    ..printInfo();
}
```
### 四、extends 继承
子类继承父类使用 `extends` `关键字，dart` 没有多继承

重写方法最好加上 `@override` 注解，便于协作

子类构造方法中，如果要初始化父类构造方法，使用 `super` 关键字，比如 `Dog(String name, int age, [String nickName]) : super(name, age)`;

子类中调用父类的方法使用 `super.fun()`

代码示例
```dart
class Animal {
  String name;
  int age;
  Animal(this.name, this.age);
  void speak() {}
  void printInfo() {
    print('My name is ${name}');
  }

  void parentPrint() {
    print('I am parent');
  }
}

class Dog extends Animal {
  String nickName;
  Dog(String name, int age, [String nickName]) : super(name, age);
  @override
  void speak() {
    this.parentPrint();
    super.parentPrint();
    print('wang wang!');
  }

  void setNickName(String name) {
    if (name != null) {
      this.nickName = name;
    }
  }

  get fullInfo {
    return {"name": this.name, "age": this.age, "nickName": this.nickName};
  }
}

void main() {
  print('---------继承------------');
  Dog d = new Dog('rzx', 3, 'kitty');
  d.printInfo();
  d.speak();
  d.setNickName('helloKitty');
  print(d.fullInfo);
}
```
输出结果:
```
---------继承------------
My name is rzx 
I am parent
I am parent
wang wang!
{name: rzx, age: 3, nickName: helloKitty}
```
### 五、类的 多态
多态举个例子通俗来讲，就是将改变子类实例的类型是父类，父类能够调用子类中同名的方法，输出结果与子类相同，但是不能调用父类没有子类中拥有的方法。

实际上就是将子类的方法覆盖父类的方法。

比如： `Animal d1 = new Dog();` 虽然是` new Dog()` 但是 `d1` 的类型是 `Animal`，因此调用 `d1.speak()` 时，实际上调用 `d1` 子类的方法差不多，但是因为 `Animal` 没有 `run` 方法，因此不能调用 `d1.run()`。
```dart
class Animal {
  speak() {}
}

class Dog extends Animal {
  @override
  speak() {
    print('wang!');
  }

  run() {
    print('dog run!');
  }
}

class Cat extends Animal {
  @override
  speak() {
    print('miao');
  }

  run() {
    print('dog run!');
  }
}

void main() {
  print('---------多态------------');
  Animal d1 = new Dog();
  Dog d2 = new Dog();
  d1.speak();
  // d1.run(); // Error: The method 'run' isn't defined for the class 'Animal'.
  d2.speak();
  d2.run();
}
```
### 六、抽象类 abstract class
抽象类不能实例化，可以当做抽象类来 `extends` 也可以当做接口来 `implements`，`dart` 中没有 `interface` 这个关键字，接口也是抽象类实现的。

抽象类用作抽象类：
```dart
abstract class Animal {
  speak(); // 抽象方法  必须实现
  printInfo() {  // 不需要实现
    print('not abstract method');
  }
}

class Dog extends Animal {
  @override
  speak() {
    print('wang!');
  }
}

class Cat extends Animal {
  @override
  speak() {
    print('miao');
  }
  
}

void main() {
  print('---------抽象类------------');
  Dog d = new Dog();
  Cat c = new Cat();
  d.speak();
  d.printInfo();
  c.speak();
  c.printInfo();
}
```
输出结果：
```
---------抽象类------------
wang!
not abstract method
miao
not abstract method
```
### 七、接口
接口也是 `abstrack` 关键字声明的，并且需要使用 `implements` 关键字来实现.

代码示例：模拟一个数据库的基本接口，并且实现一个 `Mysql` 的类
```dart
abstract class DB {
  String host;
  String port;
  String user;
  String pass;
  query(String data);
  update(String data);
  insert(String data);
  delete(String data);
}

class Mysql implements DB {
  @override
  String host;

  @override
  String pass;

  @override
  String port;

  @override
  String user;

  Mysql(this.host, this.user, this.pass, [this.port = '3306']) {
    print(
        '[ok] connect to ${this.host}:${this.port}, use ${this.user}:${this.pass}');
  }

  @override
  delete(String data) {
    print('delete ${data}');
  }

  @override
  insert(String data) {
    print('insert ${data}');
  }

  @override
  query(String data) {
    print('query ${data}');
  }

  @override
  update(String data) {
    print('update ${data}');
  }
}

void main() {
  print('---------接口------------');
  Mysql my = new Mysql('127.0.0.1', 'root', '123456', '3307');
  my.insert('121');
  my.update('121');
  my.query('121');
  my.delete('121');
}
```
输出结果:


### 八、多接口
实例可以实现多个接口
```dart
abstract class A {
  fnA();
}

abstract class B {
  fnB();
}

class C implements A, B {
  @override
  fnA() {
    print('FN------A');
  }

  @override
  fnB() {
    print('FN------B');
  }
}

void main() {
  print('-----多接口------');
  print('-----dart 没有多继承------');
  C c = new C();
  c.fnA();
  c.fnB();
}
```
运行结果：

### 九、多接口
因为没有多继承，因此如果要综合多个类属性和方法可以 implements 多个接口，如果不是抽象类，则可以通过 mixin 混入多个类的属性和方法。
```dart
class A {
  void fnA() {
    print('fnA');
  }

  void run() {
    print('runA');
  }
}

abstract class B {
  void fnB() {
    print('fnB');
  }

  void run() {
    print('runB');
  }
}

class C extends Object with A, B {
  void fnA() {
    print('C_fnA');
  }
}

/**
 * - mixin 类只能继承自 object
 * - mixin 类不能有构造函数
 * - 一个类能够 mixin 多个 mixin 类
  */
void main() {
  print('----- mixin ------');
  print('-----dart 没有多继承------');
  C c = new C();
  c.fnA();
  c.fnB();
  c.run();
  print('-----类型------');
  print(c is C);
  print(c is A);
  print(c is B);
}
```
输出结果：
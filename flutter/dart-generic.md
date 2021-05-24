<!--
 * @Author: rzx007
 * @Date: 2021-05-24 22:24:36
 * @LastEditors: rzx007
 * @LastEditTime: 2021-05-24 22:32:17
 * @FilePath: \docs\flutter\dart-generic.md
 * @Description: Do not edit
-->

## 泛型

### 一、泛型方法

> 泛型方法可以约束一个方法使用同类型的参数、返回同类型的值，可以约束里面的变量类型。

```dart
T getData<T> (T val) {
  return val;
}

getData<String>('123');
getData<int>(123);
getData<double>(123);
// getData<bool>(123); //  Error: The argument type 'int' can't be assigned to the parameter type 'bool'.
```

### 二、泛型类

> 声明泛型类,比如声明一个 `Array` 类，实际上就是 `List` 的别名，而 `List` 本身也支持泛型的实现

```dart
class Array<T> {
  List _list = new List<T>();
  Array();
  void add<T>(T value) {
    this._list.add(value);
  }
  get value{
    return this._list;
  }
}
```

使用泛型类

```dart
  print('----- 泛型类 ------');
  List l1 = new List<String>();
  // l1.add(12); // type 'int' is not a subtype of type 'String' of 'value'
  l1.add('asd');

  Array arr = new Array<String>();
  arr.add('aa');
  arr.add('bb');
  // arr.add(123); // type 'int' is not a subtype of type 'String' of 'value'
  print(arr.value);

  Array arr2 = new Array<int>();
  arr2.add(1);
  arr2.add(2);
  print(arr2.value);
```

### 三、泛型接口

> 下面声明了一个 `Storage` 接口，然后 `Cache` 实现了接口，能够约束存储的 `value` 的类型：

```dart
abstract class Storage<T>{
  Map m = new Map();
  void set(String key, T value);
  void get(String key);
}

class Cache<T> implements Storage<T> {
  @override
  Map m = new Map();

  @override
  void get(String key) {
    print(m[key]);
  }

  @override
  void set(String key, T value) {
    print('set successed!');
    m[key] = value;
  }
}
```

使用泛型接口实现的类：

```dart
print('----- 泛型接口 ------');
  Cache ch = new Cache<String>();
  ch.set('name', '123');
  // ch.set('name', 1232); // type 'int' is not a subtype of type 'String' of 'value'
  ch.get('name');

  Cache ch2 = new Cache<Map>();
  // ch2.set('name', '23'); // type 'String' is not a subtype of type 'Map<dynamic, dynamic>' of 'value'
  ch2.set('ptbird', {'name': 'pt', 'age': 20});
  ch2.get('ptbird');
```

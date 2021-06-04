## Dart 快速入门

?> 最近对`Flutter`比较感兴趣，`Flutter`是谷歌基于[Dart](https://www.dartcn.com/)开发的移动优先的跨平台开发框架，iOS,Android,web,甚至桌面应用。
`Dart`语法和`Java`语法相似，但是对于一个前端 🐕 来说，还有需要花点时间学习一下的，语言特点可以参照官网，这里不赘述。

#### 变量

创建一个变量并进行初始化:

```dart
var name = 'rzx100'
```

变量仅存储对象引用，这里的变量是 `name` 存储了一个 `String` 类型的对象引用。 “rzx100” 是这个 `String` 类型对象的值。
`name` 变量的类型被推断为 `String` 。 但是也可以通过指定类型的方式，来改变变量类型。此时变量可以认识赋值类型

```dart
dynamic name = 'rzx100'
```

另一种方式是显式声明可以推断出的类型：

```dart
String name = 'rzx100'
```

#### 默认值

未初始化的变量默认值是 null。即使变量是数字 类型默认值也是 null，因为在 Dart 中一切都是对象，数字类型 也不例外。(`assert` 断言)

```dart
int lineCount;
assert(lineCount == null);
```

!> 提示： 在生产环境代码中 `assert()` 函数会被忽略，不会被调用。 在开发过程中, `assert(condition)` 会在`非 true` 的条件下抛出异常

#### Final 和 Const

使用过程中从来不会被修改的变量， 可以使用 final 或 const, 而不是 var 或者其他类型， Final 变量的值只能被设置一次； Const 变量在编译时就已经固定 (Const 变量 是隐式 Final 的类型.) 最高级 final 变量或类变量在第一次使用时被初始化。

!> 提示： 实例变量可以是 final 类型但不能是 const 类型。 必须在构造函数体执行之前初始化 final 实例变量 —— 在变量声明中，参数构造函数中或构造函数的初始化列表中进行初始化

创建和设置一个 Final 变量：

```dart
final name = 'rzx100'; // Without a type annotation
final String nickname = 'Bobby';
const bar = 1000000; // 压力单位 (dynes/cm2)
const double atm = 1.01325 * bar; // 标准气压
```

!> 修改就报错

### 内建类型

Dart 语言支持以下内建类型：

- `Number`
- `String`
- `Boolean`
- `List` (也被称为 `Array`)
- `Map`
- `Set`
- `Rune` (用于在字符串中表示 `Unicode` 字符)
- `Symbol`

!> Dart 所有的变量终究是一个对象（一个类的实例）， 所以变量可以使用 构造涵数 进行初始化。 一些内建类型拥有自己的构造函数。 例如， 通过 Map() 来构造一个 map 变量。

#### Number

`Dart` 语言的 `Number` 有两种类型:`double `,`int`

```dart
var x = 1; // 整数 int
var y = 1.1; // 小数 double
double z = 1; // 相当于 double z = 1.0.
```

以下是将字符串转换为数字的方法，反之亦然：

```dart
// String -> int
var one = int.parse('1');
assert(one == 1);

// String -> double
var onePointOne = double.parse('1.1');
assert(onePointOne == 1.1);

// int -> String
String oneAsString = 1.toString();
assert(oneAsString == '1');

// double -> String
String piAsString = 3.14159.toStringAsFixed(2);
assert(piAsString == '3.14');
```

#### String

`Dart` 字符串是一组 `UTF-16` 单元序列。 字符串通过单引号或者双引号创建。字符串可以通过 `${expression}` 的方式内嵌表达式。如果表达式是一个标识符，则 {} 可以省略。`Dart` 中通过调用就对象的 `toString()` 方法来得到对象相应的字符串。

```dart
String name = 'rzx100'
var s = 'string interpolation';
var a = 'string interpolation ${name.toUpperCase()}';
```

使用连续三个单引号或者三个双引号实现多行字符串对象的创建：

```dart
var s1 = '''
You can create
multi-line strings like this one.
''';

var s2 = """This is also a
multi-line string.""";
```

使用 `r` 前缀，可以创建 “原始 raw” 字符串：

```dart
var s = r"In a raw string, even \n isn't special.";
```

一个编译时常量的字面量字符串中，如果存在插值表达式，表达式内容也是编译时常量， 那么该字符串依旧是编译时常量。 插入的常量值类型可以是 null，数值，字符串或布尔值。

```dart
// const 类型数据
const aConstNum = 0;
const aConstBool = true;
const aConstString = 'a constant string';

// 非 const 类型数据
var aNum = 0;
var aBool = true;
var aString = 'a string';
const aConstList = [1, 2, 3];

const validConstString = '$aConstNum $aConstBool $aConstString'; //const 类型数据
// const invalidConstString = '$aNum $aBool $aString $aConstList'; //非 const 类型数据
```

#### Boolean

`Dart` 使用 `bool` 类型表示布尔值。 `Dart` 只有字面量 `true and false` 是布尔类型， 这两个对象都是编译时常量。

Dart 的类型安全意味着不能使用 `if (nonbooleanValue)` 或者 `assert (nonbooleanValue)`。 而是应该像下面这样，明确的进行值检查：

```dart
// 检查空字符串。
var fullName = '';
assert(fullName.isEmpty);

// 检查 0 值。
var hitPoints = 0;
assert(hitPoints <= 0);

// 检查 null 值。
var unicorn;
assert(unicorn == null);

// 检查 NaN 。
var iMeantToDoThis = 0 / 0;
assert(iMeantToDoThis.isNaN);
```

#### List

几乎每种编程语言中最常见的集合可能是 `array` 或有序的对象集合。 在 `Dart` 中的 `Array` 就是 `List` 对象， 通常称之为 `List` 。

`Dart` 中的 `List` 字面量非常像 `JavaScript` 中的 `array` 字面量。 下面是一个 `Dart List `的示例：

```dart
var list = [1, 2, 3];
```

!> 提示： `Dart` 推断 list 的类型为 `List<int>` 。 如果尝试将非整数对象添加到此 `List` 中， 则分析器或运行时会引发错误

#### Set

在 `Dart` 中 `Set` 是一个元素唯一且无需的集合。 `Dart` 为 `Set` 提供了 `Set` 字面量和 `Set` 类型。
通过字面量创建 Set 的一个简单示例：

```dart
var halogens = {'fluorine', 'chlorine', 'bromine', 'iodine', 'astatine'};
```

要创建一个空集，使用前面带有类型参数的 {} ，或者将 {} 赋值给 Set 类型的变量：

```dart
var names = <String>{};
// Set<String> names = {}; // 这样也是可以的。
// var names = {}; // 这样会创建一个 Map ，而不是 Set 。
```

!> 是 `Set` 还是 `Map` ？ `Map` 字面量语法同 `Set` 字面量语法非常相似。 因为先有的 `Map` 字母量语法，所以 `{}` 默认是 `Map` 类型。 如果忘记在 `{}` 上注释类型或赋值到一个未声明类型的变量上， 那么 `Dart` 会创建一个类型为 `Map<dynamic, dynamic>` 的对象。

使用 add() 或 addAll() 为已有的 Set 添加元素, .length 来获取 Set 中元素的个数：

```dart
var elements = <String>{};
elements.add('fluorine');
elements.addAll(halogens);
assert(elements.length == 5);
```

在 Set 字面量前增加 const ，来创建一个编译时 Set 常量：

```dart
final constantSet = const {
  'fluorine',
  'chlorine',
  'bromine',
  'iodine',
  'astatine',
};
// constantSet.add('helium'); // Uncommenting this causes an error.
```

#### Map

通常来说， `Map` 是用来关联 `keys` 和 `values` 的对象。 `keys` 和 `values` 可以是任何类型的对象。在一个 `Map` 对象中一个 `key` 只能出现一次。 但是 `value` 可以出现多次。 `Dart` 中 `Map` 通过 `Map` 字面量 和 `Map` 类型来实现。

```dart
var gifts = {
  // Key:    Value
  'first': 'partridge',
  'second': 'turtledoves',
  'fifth': 'golden rings'
};

var nobleGases = {
  2: 'helium',
  10: 'neon',
  18: 'argon',
};
```

!> 提示： Dart 会将 gifts 的类型推断为 `Map<String, String>`， nobleGases 的类型推断为 `Map<int, String>` 。 如果尝试在上面的 map 中添加错误类型，那么分析器或者运行时会引发错误。

以上 Map 对象也可以使用 Map 构造函数创建：

```dart
var gifts = Map(); // 这里只有 Map() ，而不是使用 new Map()。 因为在 Dart 2 中，new 关键字是可选的。
gifts['first'] = 'partridge';
gifts['second'] = 'turtledoves';
gifts['fifth'] = 'golden rings';

var nobleGases = Map();
nobleGases[2] = 'helium';
nobleGases[10] = 'neon';
nobleGases[18] = 'argon';
```

类似 JavaScript

```dart
var gifts = {'first': 'partridge'};
gifts['fourth'] = 'calling birds'; // Add a key-value pair
assert(gifts['first'] == 'partridge');
assert(gifts['fifth'] == null); // true
```

创建 Map 类型运行时常量，要在 Map 字面量前加上关键字 const。

```dart
final constantMap = const {
  2: 'helium',
  10: 'neon',
  18: 'argon',
};

// constantMap[2] = 'Helium'; // 取消注释会引起错误。
```

#### Rune

在 Dart 中， Rune 用来表示字符串中的 UTF-32 编码字符

```dart
main() {
  var clapping = '\u{1f44f}';
  print(clapping);
  print(clapping.codeUnits);
  print(clapping.runes.toList());

  Runes input = new Runes(
      '\u2665  \u{1f605}  \u{1f60e}  \u{1f47b}  \u{1f596}  \u{1f44d}');
  print(new String.fromCharCodes(input));
}
```

### 函数

?> `Dart` 是一门真正面向对象的语言， 甚至其中的函数也是对象，并且有它的类型 `Function` 。 这也意味着函数可以被赋值给变量或者作为参数传递给其他函数。 也可以把 `Dart` 类的实例当做方法来调用。

已下是函数实现的示例：

```dart
bool isNoble(int atomicNumber) {
  return _nobleGases[atomicNumber] != null;
}
// isNoble(atomicNumber) { //省略了类型声明，函数依旧是可以正常使用的,不建议
//   return _nobleGases[atomicNumber] != null;
// }
```

如果函数中只有一句表达式，可以使用简写语法：

```dart
bool isNoble(int atomicNumber) => _nobleGases[atomicNumber] != null;
```

#### 可选参数

?> 可选参数可以是命名参数或者位置参数，但一个参数只能选择其中一种方式修饰。

##### **_命名可选参数_**

调用函数时，可以使用指定命名参数 `paramName: value`。 例如：

```dart
enableFlags(bold: true, hidden: false);
```

定义函数是，使用 `{param1, param2, …}` 来指定命名参数,可以设置默认参数值,没设置默认值为 null：

```dart
/// Sets the [bold] and [hidden] flags ...
void enableFlags({bool bold = true, bool hidden = false}) {...}
```

`Flutter` 创建实例的表达式可能很复杂， 因此窗口小部件构造函数仅使用命名参数。 这样创建实例的表达式更易于阅读。

使用 `@required` 注释表示参数是 `required` 性质的命名参数， 该方式可以在任何 `Dart` 代码中使用（不仅仅是`Flutter`）。

```dart
const Scrollbar({Key key, @required Widget child})
```

此时 `Scrollbar` 是一个构造函数， 当 `child` 参数缺少时，分析器会提示错误。

##### **_位置可选参数_**

将参数放到`[]` 中来标记参数是可选的：

```dart
String say(String from, String msg, [String device]) {
  var result = '$from says $msg';
  if (device != null) {
    result = '$result with a $device';
  }
  return result;
}
```

下面是不使用可选参数调用上面方法 的示例：

```dart
assert(say('Bob', 'Howdy') == 'Bob says Howdy');
```

下面是使用可选参数调用上面方法的示例：

```dart
assert(say('Bob', 'Howdy', 'smoke signal') ==
    'Bob says Howdy with a smoke signal');
```

`list` 或 `map` 可以作为默认值传递。 下面的示例定义了一个方法 `doStuff()`， 并分别指定参数 `list` 和 `gifts` 的默认值。

```dart
void doStuff(
    {List<int> list = const [1, 2, 3],
    Map<String, String> gifts = const {
      'first': 'paper',
      'second': 'cotton',
      'third': 'leather'
    }}) {
  print('list:  $list');
  print('gifts: $gifts');
}
```

### main() 函数

任何应用都必须有一个顶级 `main()` 函数，作为应用服务的入口。 `main()` 函数返回值为空，参数为一个可选的 `List<String>` 。

下面是 web 应用的 `main()` 函数：

```dart
void main() {
  querySelector('#sample_text_id')
    ..text = 'Click me!'
    ..onClick.listen(reverseText);
}
```

!> 提示：以上代码中的 `..` 语法为 级联调用 （cascade）。 使用级联调用， 可以简化在一个对象上执行的多个操作。

下面是一个命令行应用的 main() 方法，并且使用了输入参数：

```dart
// 这样运行应用： dart args.dart 1 test
void main(List<String> arguments) {
  print(arguments);

  assert(arguments.length == 2);
  assert(int.parse(arguments[0]) == 1);
  assert(arguments[1] == 'test');
}
```

### 函数是一等对象

一个函数可以作为另一个函数的参数。 例如：

```dart
void printElement(int element) {
  print(element);
}

var list = [1, 2, 3];

// 将 printElement 函数作为参数传递。
list.forEach(printElement);
```

同样可以将一个函数赋值给一个变量，例如：

```dart
var loudify = (msg) => '!!! ${msg.toUpperCase()} !!!';
assert(loudify('hello') == '!!! HELLO !!!');
```

### 匿名函数

多数函数是有名字的， 比如 `main()` 和 `printElement()`。 也可以创建没有名字的函数，这种函数被称为 匿名函数， 有时候也被称为 `lambda` 或者 `closure` 。 匿名函数可以赋值到一个变量中， 举个例子，在一个集合中可以添加或者删除一个匿名函数。

匿名函数和命名函数看起来类似— 在括号之间可以定义一些参数或可选参数，参数使用逗号分割。

后面大括号中的代码为函数体：

```
([[Type] param1[, …]]) {
  codeBlock;
};
```

下面例子中定义了一个包含一个无类型参数 item 的匿名函数。 list 中的每个元素都会调用这个函数，打印元素位置和值的字符串。

```dart
var list = ['apples', 'bananas', 'oranges'];
list.forEach((item) {
  print('${list.indexOf(item)}: $item');
});
```

### 词法作用域

Dart 是一门词法作用域的编程语言，就意味着变量的作用域是固定的， 简单说变量的作用域在编写代码的时候就已经确定了。 花括号内的是变量可见的作用域。

下面示例关于多个嵌套函数的变量作用域：

```dart
bool topLevel = true;

void main() {
  var insideMain = true;

  void myFunction() {
    var insideFunction = true;

    void nestedFunction() {
      var insideNestedFunction = true;

      assert(topLevel);
      assert(insideMain);
      assert(insideFunction);
      assert(insideNestedFunction);
    }
  }
}
```

### 词法闭包

闭包 即一个函数对象，即使函数对象的调用在它原始作用域之外， 依然能够访问在它词法作用域内的变量。

函数可以封闭定义到它作用域内的变量。 接下来的示例中， makeAdder() 捕获了变量 addBy。 无论在什么时候执行返回函数，函数都会使用捕获的 addBy 变量。类似 javascript

```dart
/// 返回一个函数，返回的函数参数与 [addBy] 相加。
Function makeAdder(num addBy) {
  return (num i) => addBy + i;
}

void main() {
  // 创建一个加 2 的函数。
  var add2 = makeAdder(2);

  // 创建一个加 4 的函数。
  var add4 = makeAdder(4);

  assert(add2(3) == 5);
  assert(add4(3) == 7);
}
```

**_返回值_**

?> 所有函数都会返回一个值。 如果没有明确指定返回值， 函数体会被隐式的添加 return null; 语句。

```dart
foo() {}

assert(foo() == null);
```

### 运算符

涵盖了 JavaScript 所有的操作符，罗列一些独有的

**_算术运算符_**

```dart
assert(5 ~/ 2 == 2); // 结果是整型
```

**_关类型判定运算符_**
`as`， `is`， 和 `is!` 运算符用于在运行时处理类型检查：

**_赋值运算符_**
使用 = 为变量赋值。 使用 ??= 运算符时，只有当被赋值的变量为 null 时才会赋值给它。

```dart
// 将值赋值给变量a
a = value;
// 如果b为空时，将变量赋值给b，否则，b的值保持不变。
b ??= value;
```

**_条件表达式_**
`condition ? expr1 : expr2`
如果条件为 true, 执行 expr1 (并返回它的值)： 否则, 执行并返回 expr2 的值。
`expr1 ?? expr2`
如果 expr1 是 non-null， 返回 expr1 的值； 否则, 执行并返回 expr2 的值。

```dart
var visibility = isPublic ? 'public' : 'private';

String playerName(String name) => name ?? 'Guest';
```

#### 级联运算符 (..)

级联运算符 (..) 可以实现对同一个对像进行一系列的操作。 除了调用函数， 还可以访问同一对象上的字段属性。 这通常可以节省创建临时变量的步骤， 同时编写出更流畅的代码。

考虑一下代码：

```dart
querySelector('#confirm') // 获取对象。
  ..text = 'Confirm' // 调用成员变量。
  ..classes.add('important')
  ..onClick.listen((e) => window.alert('Confirmed!'));
```

级联运算符可以嵌套，例如：

```dart
final addressBook = (AddressBookBuilder()
      ..name = 'jenny'
      ..email = 'jenny@example.com'
      ..phone = (PhoneNumberBuilder()
            ..number = '415-555-0100'
            ..label = 'home')
          .build())
    .build();
```

在返回对象的函数中谨慎使用级联操作符。 例如，下面的代码是错误的：

```dart
var sb = StringBuffer();
sb.write('foo')
  ..write('bar'); // Error: 'void' 没哟定义 'write' 函数。
```

`sb.write()` 函数调用返回 `void`， 不能在 `void` 对象上创建级联操作。
!> 提示： 严格的来讲， “两个点” 的级联语法不是一个运算符。 它只是一个 Dart 的特殊语法。

### 控制流程语句

你可以通过下面任意一种方式来控制 Dart 程序流程：

- `if and else`

- `for loops`

- `while and do-while loops`

- `break and continue`

- `switch and case`

- `assert`

使用 `try-catch` 和 `throw` 也可以改变程序流程

### 异常

**_throw_**
下面是关于抛出或者 引发 异常的示例：

```dart
throw FormatException('Expected at least 1 section');
```

也可以抛出任意的对象：

```dart
throw 'Out of llamas!';
```

```dart
 try {

 }catch {

 }finally{

 }
```
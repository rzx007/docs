## Reflect Metadata

### 基础

[Reflect Metadata](https://blog.csdn.net/Taobaojishu/article/details/117757463) 是 ES7 的一个提案，它主要用来在声明的时候添加和读取元数据。TypeScript 在 1.5+ 的版本已经支持它，你只需要：

- `npm i reflect-metadata --save`。
- 在 `tsconfig.json` 里配置 `emitDecoratorMetadata` 选项。

Reflect Metadata 的 API 可以用于类或者类的属性上，如：

```js
function metadata(
  metadataKey: any,
  metadataValue: any
): {
  (target: Function): void;
  (target: Object, propertyKey: string | symbol): void;
};
```
主要api：
```js
namespace Reflect {
  // 用于装饰器
  metadata(k, v): (target, property?) => void
  
  // 在对象上面定义元数据
  defineMetadata(k, v, o, p?): void
  
  // 是否存在元数据
  hasMetadata(k, o, p?): boolean
  hasOwnMetadata(k, o, p?): boolean
  
  // 获取元数据
  getMetadata(k, o, p?): any
  getOwnMetadata(k, o, p?): any
  
  // 获取所有元数据的 Key
  getMetadataKeys(o, p?): any[]
  getOwnMetadataKeys(o, p?): any[]
  
  // 删除元数据
  deleteMetadata(k, o, p?): boolean
}
```
`Reflect.metadata` 当作 `Decorator` 使用，当修饰类时，在类上添加元数据，当修饰类属性时，在类原型的属性上添加元数据，如：

```js
@Reflect.metadata("inClass", "A")
class Test {
  @Reflect.metadata("inMethod", "B")
  public hello(): string {
    return "hello world";
  }
}

console.log(Reflect.getMetadata("inClass", Test)); // 'A'
console.log(Reflect.getMetadata("inMethod", new Test(), "hello")); // 'B'
```

### 获取类型信息

譬如在 `vue-property-decorator 6.1` 及其以下版本中，通过使用 `Reflect.getMetadata` API，`Prop Decorator` 能获取属性类型传至 Vue，简要代码如下：

```js
function Prop(): PropertyDecorator {
  return (target, key: string) => {
    const type = Reflect.getMetadata("design:type", target, key);
    console.log(`${key} type: ${type.name}`);
    // other...
  };
}

class SomeClass {
  @Prop()
  public Aprop!: string;
}
```

运行代码可在控制台看到 `Aprop type: string`。除能获取属性类型外，通过 `Reflect.getMetadata("design:paramtypes", target, key)` 和 `Reflect.getMetadata("design:returntype", target, key)` 可以分别获取函数参数类型和返回值类型。

### 自定义 `metadataKey`

除能获取类型信息外，常用于自定义 `metadataKey`，并在合适的时机获取它的值，示例如下：

```js
function classDecorator(): ClassDecorator {
  return (target) => {
    // 在类上定义元数据，key 为 `classMetaData`，value 为 `a`
    Reflect.defineMetadata("classMetaData", "a", target);
  };
}

function methodDecorator(): MethodDecorator {
  return (target, key, descriptor) => {
    // 在类的原型属性 'someMethod' 上定义元数据，key 为 `methodMetaData`，value 为 `b`
    Reflect.defineMetadata("methodMetaData", "b", target, key);
  };
}

@classDecorator()
class SomeClass {
  @methodDecorator()
  someMethod() {}
}

Reflect.getMetadata("classMetaData", SomeClass); // 'a'
Reflect.getMetadata("methodMetaData", new SomeClass(), "someMethod"); // 'b'
```

### 例子

#### 控制反转和依赖注入

在 Angular 2+ 的版本中，[控制反转](https://blog.csdn.net/sinat_21843047/article/details/80297951)与依赖注入便是基于此实现，现在，我们来实现一个简单版：

```js
type Constructor<T = any> = new (...args: any[]) => T;

const Injectable = (): ClassDecorator => (target) => {};

class OtherService {
  a = 1;
}

@Injectable()
class TestService {
  constructor(public readonly otherService: OtherService) {}

  testMethod() {
    console.log(this.otherService.a);
  }
}

const Factory = <T>(target: Constructor<T>): T => {
  // 获取所有注入的服务
  const providers = Reflect.getMetadata("design:paramtypes", target); // [OtherService]
  const args = providers.map((provider: Constructor) => new provider());
  return new target(...args);
};
Factory(TestService).testMethod(); // 1
```
#### Controller 与 Get 的实现
如果你在使用 TypeScript 开发 Node 应用，相信你对 `Controller`、`Get``、POST` 这些 Decorator，并不陌生：
```js
@Controller('/test')
class SomeClass {
  @Get('/a')
  someGetMethod() {
    return 'hello world';
  }

  @Post('/b')
  somePostMethod() {}
}
```
这些 Decorator 也是基于 `Reflect Metadata` 实现，这次，我们将 `metadataKey` 定义在 `descriptor` 的 `value` 上：
```js
const METHOD_METADATA = 'method'；
const PATH_METADATA = 'path'；

const Controller = (path: string): ClassDecorator => {
  return target => {
    Reflect.defineMetadata(PATH_METADATA, path, target);
  }
}

const createMappingDecorator = (method: string) => (path: string): MethodDecorator => {
  return (target, key, descriptor) => {
    Reflect.defineMetadata(PATH_METADATA, path, target, key);
    Reflect.defineMetadata(METHOD_METADATA, method, target, key);
  }
}

const Get = createMappingDecorator('GET');
const Post = createMappingDecorator('POST');
```
接着，创建一个函数，映射出 `route：`
```js
function mapRoute(instance: Object) {
  const prototype = Object.getPrototypeOf(instance);

  // 筛选出类的 methodName
  const methodsNames = Object.getOwnPropertyNames(prototype)
                              .filter(item => !isConstructor(item) && isFunction(prototype[item]))；
  return methodsNames.map(methodName => {
    const fn = prototype[methodName];

    // 取出定义的 metadata
    const route = Reflect.getMetadata(PATH_METADATA, instance, methodName);
    const method = Reflect.getMetadata(METHOD_METADATA, instance, methodName)；
    return {
      route,
      method,
      fn,
      methodName
    }
  })
};
function isFunction(arg: any): boolean {
    return typeof arg === 'function';
}

function isConstructor(arg: string) {
    return arg === 'constructor';
}
```
因此，我们可以得到一些有用的信息：
```js
Reflect.getMetadata(PATH_METADATA, SomeClass); // '/test'

mapRoute(new SomeClass());

/**
 * [{
 *    route: '/a',
 *    method: 'GET',
 *    fn: someGetMethod() { ... },
 *    methodName: 'someGetMethod'
 *  },{
 *    route: '/b',
 *    method: 'POST',
 *    fn: somePostMethod() { ... },
 *    methodName: 'somePostMethod'
 * }]
 *
 */
```
最后，只需把 `route` 相关信息绑在 `express` 或者 `koa` 上就 ok 了。
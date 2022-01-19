## Java 反射之 Class、Field、Method

```java
import java.lang.reflect.*;
```

获取 class 的实例的方式

```java
//方式一:调用运行时类的属性:.class
Class clazz1=Person.class;
System.out.println(clazz1);
//方式二：调用运行时类的对象,调用getClass()
Person p1=new Person();
Class clazz2=p1.getClass();
System.out.println(clazz2);
//方式三:调用Class的静态方法：forName(String classPath)
Class clazz3=Class.forName("com.atguigu.java.Person");
//方式四：使用类的加载器classLoader
ClassLoader classLoader=ReflectionTest.class.getClassLoader();
Class clazz4=classLoader.loadClass("com.atguigu.java.Person");
System.out.println(clazz4);
```

哪些类型可以有 class 对象？

- 1、class:
  - 外部类，成员（成员内部类，静态内部类），局部内部类，匿名内部类
- 2、接口
- 3、数组
- 4、枚举
- 5、annotation :注解
- 6、基本数据类型
- 7、void

Properties:用来读取配置文件

```java
public void test2() throws Exception{
	Properties pros=new Properties();
	FileInputStream fis=new FileInputStream("jdbc.properties");
	pros.load(fis);
	String user=pros.getProperty("user");
}
```

classLoader 来读取配置文件

```java
Properties pros=new Properties();
ClassLoader classLoader=ClassLoaderTest.class.getClassLoader();
InputStream is=classLoader.getResourceAsStream("jdbc.properties");
pros.load(is);

```

java 反射知识要领

- 1、java 反射机制概述
- 2、理解 Class 类并获取 Class 实例
- 3、类的加载与 ClassLoader 的理解
- 4、创建运行时类的对象
- 5、获取运行时类的完整结构
- 6、调用运行时类的指定结构
- 7、反射的应用：动态代理

获取运行时类的属性结构

```java
public class FieldTeset{
	public void test1(){
		Class clazz=Person.class;
		//获取属性结构
		//getFields():获取当前运行时类及其父类中声明为public访问权限的属性
		Filed[] fields=clazz.getFields();
		for(Filed f : fields){
			System.out.println(f);
		}

		//获取过类声明的所有属性（不包括父类的）
		Field[] declaredFields = clazz.getDeclaredFields();
		for(Field f : declaredFields){
			System.out.println(f);
		}
	}

	//权限修饰符 数据类型 变量名
	public void test2(){
		Class clazz=Person.class;
		Field[] declaredFields=clazz.getDeclaredFields();
		for(Field f : declaredFields){
			//权限修饰符
			int modifier=f.getModifiers();
			System.out.println(Modifier.toString(modifier));
			//数据类型
			Class type=f.getType();
			System.out.println(type.getName());
			//变量名
			String fName=f.getName();
			System.out.println(fName);
		}
	}
}
```

获取运行时类的方法结构

```java
public class MethodTest{
	public void test1(){
		Class clazz=Person.class;

		//getMethods():获取当前运行时类及其所有父类中声明为public权限的方法
		Method[] methods=clazz.getMethods();
		for(Method m : methods){
			System.out.println(m)
		}
	}

	//getDeclaredMethods:获取当前运行时类中声明的所有方法（不包含父类中声明的方法）
	Method[] declaredMethods=clazz.getDeclareMethods();
	for(Method m : declaredMethods){
		System.out.println(m);
	}

	//获取方法声明的注解
	Class clazz=Person.class;
	Method[] declaredMethods=clazz.getDeclaredMethods();
	for(Method m : declaredMethods){
		//获取方法声明的注解
		Annotation[] annos=m.getAnontations();
		for(Annontation a : annos){
			System.out.println(a);
		}

		//返回值类型
		System.out.println(m.getReturnType().getName);
		//方法名
		m.getName();
		//形参列表
		Class[] parameterTypes=m.getParameterTypes();
		if(!parameterTypes==null && parameterTypes.length==0){
			for(Class p : parameterTypes){
				System.out.println(p.getName() + "arg_" )
			}
		}

		//抛出的异常
		Class[] ex=m.getExceptionTypes();
		if(!(exceptionTypes==null && exceptionTypes.length==0))
		{
			System.out.println("throws ");
			for(int i=0;i<exceptionTypes.length;i++){
				System.out.println(exceptionType[i].getName())
			}
		}
	}
}
```

获取构造器结构

```java
public class OtherTest{
	//获取构造器结构
	public void test1(){
		Class Clazz=Person.class;
		//getConstructors():获取当前运行时类中声明为public的构造器
		Constructor[] constructor=clazz.getConstructors();
		for(Constructor c : constructors){
			System.out.println(c);
		}

		System.out.println();
		//getDeclaredConstructors():获取当前运行时类中声明的所有的构造器
		Constructor[] declaredConstructors=clazz.getDeclaredConstructors();
		for(Constructor c : declaredConstructors){
			System.out.println(c);
		}
	}

}
```

获取运行时类的父类

```java
public void test2(){
	Class clazz=Person.class;
	Class superClass=clazz.getSuperclass();
	System.out.println(superClass);

}
```

获取运行时类的带泛型的父类

```java
public void test3(){
	Class clazz=Person.class;
	Type genericSuperclass=clazz.getGenericSuperclass();
	System.out.println(genericSuperclass);

}
```

获取运行时类的带泛型的父类的泛型

```java
public void test4(){
	Class clazz=Person.class;
	Type genericSuperclass=clazz.getGenericSuperclass();
	//关键
	ParameterizedType paraType=(ParameterizedType)genericSuperclass;
	//获取泛型类型
	paraType.getActualTypeArguments();
	System.out.println(genericSuperclass);
}
```

9
获取运行时类实现的接口

```java
public void test5(){
	Class clazz=Person.class;
	Class[] interfaces=clazz.getInterfaces();
	for(Class c : interfaces){
		System.out.println(c);
	}
}
```

获取运行时类所在的包

```java
public void test6(){
	Class clazz=Person.class;
	Package pack=clazz.getPackage();
	System.out.println(pack);
}
```

获取运行时类声明的注解

```java
public void test7(){
	Class clazz=Person.class;
	Annotation[] annotations=clazz.getAnnotations();
	for(Annotation annos : annotations){
		System.out.println(annos);
	}
}
```

调用运行时类的指定属性

```java
public void testField(){
	Class Clazz=Person.class;
	//创建运行时类的对象
	Person p=(Person)clazz.newInstance();
	//获取指定的属性，要求运行时类中属性声明为public
	Field id=clazz.getField("id");
	//设置当前属性的值
	//set():参数1，指明设置哪个对象的属性  参数2：将此属性值设置为多少
	id.set(p,1001);
	//获取当前属性的值
	//get():参数1：获取哪个对象的当前属性值
	id.get(p);
}

public void testField1(){
	Class clazz=Person.class;
	//创建运行时类的对象
	Person p=(Person)clazz.newInstance();
	//获取运行时类中指定变量名的属性
	Field name=clazz.getDeclaredField("name");
	//保证当前属性是可访问的
	name.setAccessible(true);
	//获取、设置指定对象的此属性值
	name.set(p,"Tome");
	System.out.println(name.get(p));
}


//操作运行时类中的指定的方法
public void testMehod(){
	Class clazz=Person.class;
	Person p=(Person)clazz.newInstance();
	//获取指定的某个方法
	//参数1：指明获取的方法的名称，参数2：指明获取的方法的形参列表
	Method show=clazz.getDeclaredMethod("show",String.class);
	//保证当前方法是可访问的
	show.setAccessible(true);
	//参数1：方法的调用者，参数2，给方法形参赋值的实参
	//invoke的返回值即为对应类中调用的方法的返回值
	show.invoke(p,"CHN");

}
```

获取运行时类中的指定的构造器

```java
public void testConstructor(){
	Class clazz=Person.class;
	Constructor constructor=Clazz.getDeclaredConstructor(String.class);

	//保证此构造器是可访问的
	constructor.setAccessible(true);

	//调用此构造器创建运行时类的对象
	Person per=(Person)constructor.newInstance("Tom");

}
```

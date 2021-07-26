## Window 安装 MongoDB
?> MongoDB 是一个基于分布式文件存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。
MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。
### 1.官网下载
?> 个人使用社区版即可

下载地址: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

选择当前系统下载,如图:

![dir](../static/Mongo1.png)

### 2. 安装
双击安装包一路`next`即可

!> 注意，勾选此选项会安装可视化管理工具,类似MySQL的Navicat

![dir](../static/Mongo2.png)

 ### 3.配置环境变量
 完成步骤2,其实已将安装好了，在安装目录bin目录先运行`mongo.exe`

  但是这样每次运行 都要切换目录，比较麻烦，所以设置全局变量,可全局直接运行`mongo`相关命令

?>  `此电脑`右键 `属性`=>`高级系统设置`=>`环境变量`
  
  ![dir](../static/Mongo4.png)

  因为4.X版本会自动注册Mongo服务，此时可以在命令行直接运行mongon命令了，如图

  ![dir](../static/Mongo3.png)

  1. 输入命令 `mongo`进入mongoDB
  2.  `show dbs`查看所有数据库
  3.  `use admin`进入`admin`数据库
  4. `show collections`查看`admin`库下所有的集合(MySQL中的表)

### 4. Mongodb 账户权限配置

?> 环境变量配置好后,就可以访问数据库了。为安全我们要给数据库设置用户密码
1. #### 设置一个超级管理员,拥有所有的访问权限
```
use admin
db.createUser({
user:'admin', pwd:'123456', roles:[{role:'root',db:'admin'}]
})
```

?> 在控制台输入`mongo`,`use admin`进入`admin`库,创建一个用户名为`admin`,密码`123456`,角色类型为`root`，拥有`admin`库权限的角色，

2. #### 更改MongoDB的配置文件
```
路径：C:\Program Files\MongoDB\Server\4.0\bin\mongod.cfg
配置：
security:
authorization: enabled # 注意：后面有空格
```

?> 找到安装目录下bin文件夹下的`mongod.cfg`文件,修改`security`,添加`authorization:enabled`

3. #### 重启MongoDB服务

因为修改了配置文件,需要重启服务,`win键`+`R`, 输入`services.msc`,打开服务列表,找到MongoDB重启服务

![dir](../static/Mongo5.png)![dir](../static/Mongo6.png)
*到此超级管理员用户已经建立完成,此时直接通过`mongo`命令`show dbs`,是没有任何反应的，需要输入用户名密码*

命令行输入
```
mongo admin -u 用户名 -p 密码

mongo admin -u admin -p 123456

```
连接到服务*第一个`admin`是此用户所有权的数据库*

```
show dbs
```
就可以查看所有数据库了

4. #### 给eggcms 数据库创建一个用户 只能访问 eggcms 不能访问其他数据
*假设我们有一个eggcms的数据库*

```
use eggcms
db.createUser(
{
user: "eggadmin", pwd: "123456", roles: [ { role: "dbOwner", db: "eggcms" } ]
}
)
```
!> 创建过程和创建`admin`一样,要注意的是`roles`的`role`是`dbOwner` 而不是`root`

### 5. Mongodb 常用命令

```
1、show users; #查看当前库下的用户

2、db.dropUser("eggadmin") #删除用

3、db.updateUser( "admin",{pwd:"password"}); #修改用户密码

4、db.auth("admin","password"); #密码认证
```

### 6.Mongodb 数据库角
1. 数据库用户角色：read、readWrite;
2. 数据库管理角色：dbAdmin、dbOwner、userAdmin；
3. 集群管理角色：clusterAdmin、clusterManager、clusterMonitor、hostManager；
4. 备份恢复角色：backup、restore；
5. 所有数据库角色：readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、
dbAdminAnyDatabase
6. 超级用户角色：root

参考：[https://www.cnblogs.com/zzw1787044/p/5773178.html](https://www.cnblogs.com/zzw1787044/p/5773178.html)

### 7.Mongodb 远程连接
*远程连接,如在nodejs中连接MongoDB*
```js
const url = 'mongodb://admin:123456@localhost:27017/'
```
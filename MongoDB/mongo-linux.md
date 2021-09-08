## Linux 安装 MongoDB
?> MongoDB 是一个基于分布式文件存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。
MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。
### 1.官网下载
?> 个人使用社区版即可,根据不同的linux版本下载，这里演示CentOS 7的安装

下载地址: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

选择当前系统下载,如图:

![dir](../static/mongol.png)

### 2. 安装
这里我们选择 tgz 下载，下载完安装包，并解压 tgz（以下演示的是 64 位 Linux上的安装） 。

```bash
wget https://repo.mongodb.org/yum/redhat/7/mongodb-org/5.0/x86_64/RPMS/mongodb-org-server-5.0.1-1.el7.x86_64.rpm    # 下载

tar -zxvf mongodb-org-server-5.0.1-1.el7.x86_64.tgz                                    # 解压

mv mongodb-org-server-5.0.1-1.el7.x86_64  /usr/local/mongodb5                      # 将解压包拷贝到指定目录
```
MongoDB 的可执行文件位于 bin 目录下，所以可以将其添加到 PATH 路径中：
```bash
export PATH=<mongodb-install-directory>/bin:$PATH
```

`<mongodb-install-directory>` 为你 `MongoDB` 的安装路径。如本文的 `/usr/local/mongodb5` 。
```bash
export PATH=/usr/local/mongodb4/bin:$PATH
```
### 3. 创建数据库目录
默认情况下 MongoDB 启动后会初始化以下两个目录：

-  数据存储目录：/var/lib/mongodb
-  日志文件目录：/var/log/mongodb

我们在启动前可以先创建这两个目录并设置当前用户有读写权限：
```bash
sudo mkdir -p /var/lib/mongo
sudo mkdir -p /var/log/mongodb
sudo chown `whoami` /var/lib/mongo     # 设置权限
sudo chown `whoami` /var/log/mongodb   # 设置权限
```
接下来启动 Mongodb 服务：
```bash
mongod --dbpath /var/lib/mongo --logpath /var/log/mongodb/mongod.log --fork
```
如果要停止 mongodb 可以使用以下命令：
```bash
mongod --dbpath /var/lib/mongo --logpath /var/log/mongodb/mongod.log --shutdown
```
### 4. profile配置
系统profile文件的配置，这是每装一个软件的必备步骤，在profile文件最后面添加环境变量(上处启动命令会在shell断开后随之断开)

```bash
vim /etc/profile  # 或手动下载编辑
  
export MONGODB_HOME=/usr/local/mongodb5
export PATH=$PATH:$MONGODB_HOME/bin  

```
需要重启系统配置才能生效，记住不要重复执行

```bash
source /etc/profile
```
#### 4. 配置文件启动
为了更方便的自定义启动`mongod`服务。可以配置`mongod.conf`
在/ect文件夹新建一个`mongod.conf`
```bash
# mongod.conf

# for documentation of all options, see:
#   http://docs.mongodb.org/manual/reference/configuration-options/

# Where and how to store data.
storage:
  dbPath: /var/lib/mongo/
  journal:
    enabled: true
#  engine:
#  mmapv1:
#  wiredTiger:
 
# where to write logging data.
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

# network interfaces
net:
  port: 27888
  bindIp: 127.0.0.1,10.172.246.206


processManagement:
  fork: true

security:
  authorization: enabled

#operationProfiling:

#replication:

#sharding:

## Enterprise-Only Options:

#auditLog:

#snmp:

```
运行命令
```bash
mongod -f /etc/mongod.conf
```
浏览器打开 `http://${your-service-ip}:27888/` 就能访问到 
`It looks like you are trying to access MongoDB over HTTP on the native driver port.`

#### 5. 连接服务

`mongo --host=localhost --port=27888`

### 6. 权限分配
 首先停止服务,创建一个超级管理员用户
 ```bash
 use admin
 db.createUser({
  user:'admin', pwd:'123456', roles:[{role:'root',db:'admin'}]
  })
 ```
 验证权限
```bash
db.auth('admin','123456')
1
```
添加一个当前库管理员，假设有一个eggcms的数据库
```bash
  use eggcms
  db.createUser( { user: "eggadmin", pwd: "123456", roles: [ { role: "dbOwner", db: "eggcms" } ] } )
```
那个`rzx100`这个用户就只能访问管理`eggcms`这个库
### 7. Mongodb 常用命令

```
1、show users; #查看当前库下的用户

2、db.dropUser("eggadmin") #删除用

3、db.updateUser( "admin",{pwd:"password"}); #修改用户密码

4、db.auth("admin","password"); #密码认证
```

### 8.Mongodb 数据库角
1. 数据库用户角色：read、readWrite;
2. 数据库管理角色：dbAdmin、dbOwner、userAdmin；
3. 集群管理角色：clusterAdmin、clusterManager、clusterMonitor、hostManager；
4. 备份恢复角色：backup、restore；
5. 所有数据库角色：readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、
dbAdminAnyDatabase
6. 超级用户角色：root

参考：[https://www.cnblogs.com/zzw1787044/p/5773178.html](https://www.cnblogs.com/zzw1787044/p/5773178.html)

### 9.Mongodb 远程连接
*远程连接,如在nodejs中连接MongoDB*
```js
const url = 'mongodb://admin:123456@localhost:27017/'
```
### 10. 常用命令
```bash
#创建数据库
use mydatabase
#显示当前数据库
show dbs
#删除数据库
db.dropDatabase()
#创建表
show collections / show tables

#创建表插入数据
db.createCollection("users")
db.users.insert({name:"hash", age:18, length:19, lover: "keke"}) 
#删除集合(表）
db.users.drop()

#插入数据
db.comment.insert({articleid:"1000000",content:"今天天气真好，阳光明媚",userid:"1001",nickname:"Rose",createdatetime:new Date(),likenum:NumberInt(10),state:null})

#批量插入
db.comment.insertMany([{_id : 1, articleid:"1000001",content:"今天天气真好，阳光明媚",userid:"1001",nickname:"Rose",createdatetime:new Date(),likenum:10,state:null},{_id : 2, articleid:"1000002",content:"今天天气真好，阳光明媚",userid:"1001",nickname:"Rose1",createdatetime:new Date(),likenum:11,state:null},{_id : 3, articleid:"1000003",content:"今天天气真好，阳光明媚",userid:"1002",nickname:"Rose2",createdatetime:new Date(),likenum:12,state:null},{_id : 4, articleid:"1000004",content:"今天天气真好，阳光明媚",userid:"1002",nickname:"Rose3",createdatetime:new Date(),likenum:13,state:null},{_id : 5, articleid:"1000005",content:"今天天气真好，阳光明媚",userid:"1001",nickname:"Rose4",createdatetime:new Date(),likenum:14,state:null}])

#更新数据
###会替换全部字段更新方式
db.comment.update({_id : 1 },{articleid:111111})
###部分更新
db.comment.update({_id : 1 },{$set:{articleid:22222}})
###批量修改
db.comment.update({userid : "1001" },{$set:{articleid : 1000001 }},{multi:true})
列值增长更改
db.comment.update({_id : 1 },{$inc:{articleid : 1 }})
删除文档
db.comment.remove({_id : 1})
#删除全部
db.comment.remove({})
 
#查询数据全部
db.comment.find({})
#精确查找
db.comment.find({_id:1})
#格式化
db.comment.find({_id:2}).pretty()  
#清空数据
db.comment.drop()
```
### 11. 查询
```bash
#查询长度
db.comment.count({userid : "1001"})
#分页查询
db.comment.find().skip(1).limit(2)
#排序查询
db.comment.find().sort({_id:-1}) / db.comment.find().sort({_id:1})
#正则查询
db.comment.find({content: /阳光/})
#大于小于
db.comment.find({likenum : {$gt:9}})
#$in查询
db.comment.find({_id : {$in:[1,2,3]}})
#$and/$or查询
db.comment.find({$and : [{likenum : {$gte : 10}},{likenum : {$lt : 100}} ]})
db.comment.find({$or : [{likenum : {$gte : 10}},{likenum : {$lt : 100}} ]})
#聚合查询
db.comment.distinct("likenum")
#统计长度
db.comment.estimatedDocumentCount({})
#通过对数据进行统计的，返回准确的计数，通过聚合计算而来
db.comment.countDocuments({state:"1"})

```
<!-- https://blog.csdn.net/weixin_43328833/article/details/118630660 -->
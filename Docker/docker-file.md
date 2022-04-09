## Dockerfile 简介

?> Dockerfile 是 Docker 中用来自动化构建镜像的配置文件，在 Dockerfile 中，包含了构建镜像过程中需要执行的命令、参数以及其他操作，并且支持以#开头的注释行。更多详情查阅[Dockerfile reference](https://docs.docker.com/engine/reference/builder/)

`Dockerfile`结构大致分为四部分：

- 基础镜像信息
- 维护者信息
- 镜像操作指令
- 镜像启动时执行的命令

## DockerFile 构建过程

- docker 从基础镜像运行一个容器
- 执行一条指令并对容器做修改
- 执行类似 docker commit 的操作提交一个新的镜像层
- docker 再基于刚提交的镜像运行一个新的容器
- 执行 dockerfile 中的下一条指令直到所有指令都执行完成

`Dockerfile`构建过程是以基础镜像为基础的，每一条指令构建一层镜像，因此每一条指令的内容，就是描述该层应当如何构建。以此，有了`Dockerfile`，我们可以方便的定制自己额外的需求，只需在`Dockerfile`里添加或者修改指令，重新构建即可

## Dockerfile 常用指令

#### FROM

FROM 指令用于指定指定基础镜像，其后构建新镜像以此为基础进行构建。FROM 指令是 Dockerfile 文件中除注释命令之外的第一条指令，也是必备的指令。如果在同一个 Dockerfile 中创建多个镜像时，可以使用多个 FROM 指令（每个镜像一次）。

```shell
FROM <image>
# 或
FROM <image>:<tag>
# 或
FROM <image>:<digest>
```

tag 或 digest 是可选参数，如果不使用这两个值时，会使用 latest 版本的基础镜像。

例如，指定 ubuntu 的 14.04 版本作为基础镜像：

```shell
FROM ubuntu:14.04
```

#### MAINTAINET

`MAINTAINET`
指定维护者的信息。

#### RUN

在镜像的构建过程中执行特定的命令（执行某些动作、安装系统软件、配置系统信息之类），并生成一个中间镜像。

```shell
# shell格式
RUN <命令>
# exec格式
RUN ["可执行文件", "参数1", "参数2"]
```

#### COPY

COPY 命令用于将宿主机器上的的文件（Dockerfile 所在目录的相对路径）复制到镜像内，如果目的位置不存在，Docker 会自动创建。

```shell
COPY <源路径>...<目标路径>
COPY ["<源路径1>",..."<目标路径>"]
```

例如，把宿主机中的 test.json 文件复制到容器中/usr/src/app/目录下：

```shell
COPY test.json /usr/src/app/
```

#### ADD

ADD 指令的作用和 COPY 基本一致，但是在 COPY 基础上增加了一些功能，源路径可以是 URL，也可以是 tar.gz。语法格式也和 COPY 一致。

```shell
ADD <源路径>...<目标路径>
ADD ["<源路径1>",..."<目标路径>"]
```

#### ENV

设置环境变量

```shell
ENV <key> <value>
# 或
ENV <key1>=<value1> <key2>=<value2>...
```

例如：

```shell
ENV name=tigeriaf version=1.1.1
```

#### EXPOSE

为构建的镜像设置监听端口，使容器在运行时监听。

```shell
EXPOSE <port1> [<port2>...]
```

例如:

```shell
EXPOSE 8080
```

EXPOSE 8080 其实等价于`docker run -p 8080`,如果需要把 8081 端口映射到宿主机中的某个端口（如 8088）以便外界访问时，则可以用`docker run -p 8088:8080`

#### WORKDIR

WORKDIR 用于在容器内指定工作目录：

```shell
WORKDIR /test/
```

通过 WORKDIR 设置工作目录后，Dockerfile 中其后的命令 RUN、CMD、ENTRYPOINT 等命令都会在该目录下执行。

#### USER

USER 用于指定运行镜像所使用的用户。

```shell
USER root
```

使用 USER 指定用户后，Dockerfile 中其后的命令`RUN、CMD、ENTRYPOINT`都将使用该用户执行。

#### CMD

```shell
CMD ["可执行文件", "参数1", "参数2"]
```

指定启动容器时执行的命令，每个 Dockerfile 只能有一条 CMD 指令，如果指定了多条指令，则最后一条生效。

其作用是在启动容器的时候提供一个默认的命令项，如果用户执行 docker run 时提供了命令项，这个命令就会覆盖掉。

#### VOLUME

```shell
VOLUME ["/data"]
```

创建一个可以从本地主机或其他容器挂载的挂载点，一般用来存放数据库和需要保持的数据等。

#### ENTRYPOINT

容器启动后执行的命令，这些命令不能被`docker run`提供的参数覆盖。和`CMD`一样，每个 Dockerfile 中只能有一个`ENTRYPOINT`，如果指定了多条指令，则最后一条生效。 格式

```shell
ENTRYPOINT ["可执行文件", "参数1", "参数2"]
```

#### ONBUILD

ONBUILD 用于配置当前所创建的镜像作为其它新创建镜像的基础镜像时，所执行的操作指令。 格式

```shell
ONBUILD [INSTRUCTION]
```

## DockerFile 实例

### DockerFile 的指令

```shell
# FROM 表示设置要制作的镜像基于哪个镜像，FROM指令必须是整个Dockerfile的第一个指令，如果指定的镜像不存在默认会自动从Docker Hub上下载。
# 指定我们的基础镜像是node，latest表示版本是最新
FROM 			# 基础镜像，一切从这里开始


MAINTAINER	        # 镜像是谁写的
RUN 			# 镜像构建是需要运行的命令
ADD		        # 步骤


# WORKDIR指令用于设置Dockerfile中的RUN、CMD和ENTRYPOINT指令执行命令的工作目录(默认为/目录)，该指令在Dockerfile文件中可以出现多次，如果使用相对路径则为相对于WORKDIR上一次的值，
# 例如WORKDIR /data，WORKDIR logs，RUN pwd最终输出的当前目录是/data/logs。
# cd到 /home/nodeNestjs
WORKDIR			# 镜像的工作目录
VOLUME			# 挂载的目录
EXPOSE			# 保留端口配置
CMD		        # 指定这个容器启动时要运行的命令，只有最后一个会生效
ENTRYPOINT		# 指定这个容器启动时要运行的命令，可以追加命令
COPY			# 类似ADD，将文件拷贝到镜像中
ENV			# 构建时候设置的环境变量
```

### 编写 DockerFile

我有一个前端服务，目录结构如下：

```
$ ls frontend/myaccount/  resources/  third_party/
```

myaccount 目录下是放置的 js,vue 等，resources 放置的是 css,images 等。third_party 放的是第三方应用。

这里采用了两阶段构建，即采用上一阶段的构建结果作为下一阶段的构建数据

```shell
FROM node:alpine as builder
WORKDIR '/build'
COPY myaccount ./myaccount
COPY resources ./resources
COPY third_party ./third_party
WORKDIR '/buildmyaccount'
RUN npm install
RUN npm rebuild node-sass
RUN npm run build
RUN ls /build/myaccount/dist
FROM nginx
EXPOSE 80
COPY --from=builder /build/myaccount/dist /usr/share/nginx/html

CMD ["node", "-v"]
```

需要注意结尾的 --from=builder 这里和开头是遥相呼应的。

### 运行构建命令构建

`docker buil`d 命令用于使用 Dockerfile 创建镜像。

```shell
docker build [OPTIONS] PATH | URL | -
```

?> mydockerfile 是文件名

```shell
docker build -f mydockerfile -t mynode:0.1 .
```

**常用 OPTION 如下**：：

- --build-arg=[]：设置镜像创建时的变量
- -f：指定要使用的 Dockerfile 路径
- -m：设置内存最大值
- --force-rm：设置镜像过程中删除中间容器
- --rm：设置镜像成功后删除中间容器
- --tag, -t：镜像的名字及标签，通常 name:tag 或者 name 格式


## CentOS7 安装 Nginx

### 1.下载软件包

```bash
wget http://nginx.org/download/nginx-1.20.2.tar.gz
```

### 2.安装依赖

```bash
yum -y install gcc pcre-devel zlib-devel openssl openssl-devel
```

### 3.安装 Nginx

```bash
#解压
tar -zxvf nginx-1.20.2.tar.gz

#进入NG目录
cd /nginx-1.20.2

#配置
./configure --prefix=/usr/local/nginx

#编译
make
make install
```

### 4.启动&停止

```bash
#启动
/usr/local/nginx/sbin/nginx

#重新加载配置
/usr/local/nginx/sbin/nginx -s reload

#停止
/usr/local/nginx/sbin/nginx -s stop
```

### 5.其它命令

- 以特定目录下的配置文件启动：`nginx -c /特定目录/nginx.conf`
- 重新加载配置：`nginx -s reload` 执行这个命令后，master 进程会等待 worker 进程处理完当前请求，然后根据最新配置重新创建新的 worker 进程，完成 Nginx 配置的热更新。
- 立即停止服务：`nginx -s stop`
- 从容停止服务：`nginx -s quit` 执行该命令后，Nginx 在完成当前工作任务后再停止。
- 检查配置文件是否正确：`nginx -t`
- 检查特定目录的配置文件是否正确：`nginx -t -c /特定目录/nginx.conf`
- 查看版本信息：`nginx -v`
- [了解 ./configure、make、make install 命令](https://www.cnblogs.com/tinywan/p/7230039.html)

### 6.配置 systemd 方式管理 NG

```bash
vim /etc/systemd/system/nginx.service
```

```bash
[Unit]
Description=The Nginx HTTP Server
After=network.target remote-fs.target nss-lookup.target

[Service]
Type=forking
PIDFile=/usr/local/nginx/logs/nginx.pid
ExecStart=/usr/local/nginx/sbin/nginx
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s stop
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

### 7.启动&停止

```bash
systemctl start nginx.service　#（启动nginx服务）
systemctl stop nginx.service　#（停止nginx服务）
systemctl enable nginx.service #（设置开机自启动）
systemctl disable nginx.service #（停止开机自启动）
systemctl status nginx.service #（查看服务当前状态）
systemctl restart nginx.service　#（重新启动服务）
systemctl list-units --type=service #（查看所有已启动的服务）
```

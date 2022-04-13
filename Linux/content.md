## Nodejs linux wget 安装方式

#### 安装
```bash
# 下载 
mkdir -p /usr/local/node 
cd /usr/local/node
# https://nodejs.org/zh-cn/download/
wget https://nodejs.org/dist/v14.17.1/node-v14.17.1-linux-x64.tar.gz
# 解压
tar xzf node-v14.17.1-linux-x64.tar.gz
# 编译
mv node-v14.17.1-linux-x64 node-v14.17.1
cd node-v14.17.1
#软链
ln -s /usr/local/node/node-v14.17.1/bin/npm /usr/bin/npm
ln -s /usr/local/node/node-v14.17.1/bin/node /usr/bin/node
npm install -g cnpm --registry=https://registry.npm.taobao.org
ln -s /usr/local/node/node-v14.17.1/bin/cnpm /usr/bin/cnpm

```
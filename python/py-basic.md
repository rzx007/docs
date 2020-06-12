## Python 基础笔记

?> python 安装
 略

### PIP 更换国内安装源
 pip下载包，在国内使用可能网络不是很稳定，可切换国内源

 pip国内的一些镜像

 1 阿里云 http://mirrors.aliyun.com/pypi/simple/ 

 2 中国科技大学 https://pypi.mirrors.ustc.edu.cn/simple/ 

 3 豆瓣(douban) http://pypi.douban.com/simple/ 

 4 清华大学 https://pypi.tuna.tsinghua.edu.cn/simple/ 

 5 中国科学技术大学 http://pypi.mirrors.ustc.edu.cn/simple/

### 修改源方法：

#### 临时使用： 

可以在使用pip的时候在后面加上`-i`参数，指定pip源 

eg: `pip install scrapy -i https://pypi.tuna.tsinghua.edu.cn/simple`

#### 永久修改： 
`linux`: 
修改 `~/.pip/pip.conf` (没有就创建一个)， 内容如下：

```js
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
```

`windows`: 

直接在`user`目录中创建一个`pip目录`，如：`C:\Users\xx\pip`，在`pip 目录`下新建文件`pip.ini`，内容如下

或者：`win+R` 打开用户目录`%HOMEPATH%`，在此目录下创建 `pip` 文件夹，在 pip 目录下创建 `pip.ini` 文件, 内容如下

```js
[global]
timeout = 6000
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
trusted-host = pypi.tuna.tsinghua.edu.cn
```
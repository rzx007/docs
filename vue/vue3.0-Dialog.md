## vue3.2 自定义弹窗组件+函数式调用二合一

> 涉及的 vue3 知识点/API，`createApp` `defineProps` `defineEmits` > ` <script setup>` `v-model` > `<script setup>` 就是 `setup` 语法糖
> `defineProps` 和 `props` 用法差不多
> `defineEmits` 声明可向其父组件触发的事件

### 手写弹窗组件

很简单的弹窗组件，支持设置标题

```js
<script setup>
defineProps({
    show: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        default: ''
    }
})
</script>

<template>
    <div v-if="show" class="dialog-mask flex-center">
        <div class="dialog-box">
            <div class="dialog-header">{{title}}</div>
            <slot><p class="dialog-content">{{message}}</p></slot>
            <div class="dialog-footer">
                <button class="button dialog-confirm" @click="$emit('update:show', false)">确认</button>
            </div>
        </div>
    </div>
</template>

```
### 组件调用
在需要使用的地方引入组件，`v-model:show` 相当于vue2写法的 `:show.sync`

```js
<script setup>
import { ref } from 'vue'
import Dialog from '@/components/Dialog.vue'

let show = ref(true)
</script>

<template>
  <Dialog v-model:show="show" message="这是提示内容" title="这是标题"></Dialog>
</template>
```

### 函数式调用

在同级目录新建一个Dialog.js文件

将上面写好的组件引入，创建一个实例，挂载到body节点

```js
import { createApp } from 'vue'
import Dialog from '@/components/Dialog.vue'

const createDialog = (message, option = {}) => {
    const mountNode = document.createElement('div')
    const Instance = createApp(Dialog, {
        show: true,
        message,
        ...option,
        close: () => { 
            Instance.unmount(mountNode); 
            document.body.removeChild(mountNode);
        }
    })

    document.body.appendChild(mountNode)
    Instance.mount(mountNode)
}

export default createDialog

```

`createApp` 第二个参数，是传递`prop`给组件，`close`方法用于点击确定移除弹窗，所以我们需要改造一下Dialog.vue，改造后的代码在下面含样式完代码码里，改造后就能实现组件调用和函数式调用合二为一了。

### 如何使用

```js
<script setup>
import Dialog from '@/components/Dialog.js'

// 无标题
Dialog('500 异常!');
// 有标题
Dialog('500 异常!', { title: '提示' });
</script>
```
### 含样式完整源码

Dialog.vue
```js
<script setup>
defineProps({
    show: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        default: ''
    },
    close: {
        type: Function,
        default: fun => fun()
    }
})
const emit = defineEmits(['update:show'])

const handleClose = () => {
    emit('update:show', false)
}
</script>

<template>
    <div v-if="show" class="dialog-mask flex-center">
        <div class="dialog-box">
            <div class="dialog-header">{{title}}</div>
            <slot><p class="dialog-content">{{message}}</p></slot>
            <div class="dialog-footer">
                <button class="button dialog-confirm" @click="close(handleClose)">确认</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.dialog-mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}
.dialog-box {
    background: #fff;
    width: 300px;
    border-radius: 10px;
    overflow: hidden;
}

.dialog-header {
    padding-top: 20px;
    font-weight: bold;
    text-align: center;
}

.dialog-content {
    padding: 5px 20px 20px 20px;
    font-size: 12px;
    text-align: center;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.dialog-footer {
    display: flex;
    overflow: hidden;
    user-select: none;
    border-top: 1px solid #EBEDF0;
}

.button {
    display: inline-block;
    box-sizing: border-box;
    text-align: center;
    width: 100%;
    line-height: 40px;
    background-color: #fff;
}
.button:active {
    background-color: #f2f3f5;
}
.dialog-confirm {
    color: #409EFF;
}
</style>

```
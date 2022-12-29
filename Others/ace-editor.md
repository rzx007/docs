### vue3 使用ace代码编辑器

!> [ace官网](https://ace.c9.io/)

安装依赖
```bash
pnpm i ace-builds
```

#### 代码

```js
<template>
  <div class="ace-container">
    <!-- 官方文档中使用 id，这里禁止使用，在后期打包后容易出现问题，使用 ref 或者 DOM 就行 -->
    <div class="ace-editor" ref="aceRef"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ace from 'ace-builds'
import 'ace-builds/src-min-noconflict/ext-language_tools'
import 'ace-builds/src-min-noconflict/theme-tomorrow_night'
import 'ace-builds/src-min-noconflict/mode-mysql'
import 'ace-builds/webpack-resolver' // 在 webpack 环境中使用必须要导入
import 'ace-builds/src-min-noconflict/snippets/mysql'
import 'ace-builds/src-min-noconflict/snippets/json'
// import 'ace-builds/src-min-noconflict/snippets/java'

export default defineComponent({
  name: 'Aceeditor',
  data() {
    return {
      content: '',
      aceEditor: null,
      themePath: 'ace/theme/tomorrow_night', // 不导入 webpack-resolver，该模块路径会报错
      // modePath: 'ace/mode/mysql', // 同上
      copy: this.isCopy,
    }
  },
  props: {
    modelValue: String,
    isCopy: Number,
    mode: {
      type: String,
      default: 'mysql',
    },
  },
  computed: {
    modePath: function () {
      return 'ace/mode/' + this.mode
    },
  },
  emits: ['update:modelValue'],
  methods: {
    change() {
      this.content = this.aceEditor.getSession().getValue()
      this.$emit('update:modelValue', this.content)
      console.log(this.content)
    },
    changeSelection(e) {
      if (!this.aceEditor.getSelectedText()) {
        return
      }
      this.content = this.aceEditor.getSelectedText()
      this.$emit('update:modelValue', this.aceEditor.getSelectedText())
    },
  },
  mounted() {
    this.aceEditor = ace.edit(this.$refs.aceRef, {
      maxLines: 30, // 最大行数，超过会自动出现滚动条
      minLines: 17, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
      fontSize: 14, // 编辑器内字体大小
      theme: this.themePath, // 默认设置的主题
      mode: this.modePath, // 默认设置的语言模式
      value: this.modelValue ? this.modelValue : '',
      tabSize: 4, // 制表符设置为 4 个空格大小
    })
    // 激活自动提示
    this.aceEditor.setOptions({
      enableSnippets: true,
      enableLiveAutocompletion: true,
      enableBasicAutocompletion: true,
    })
    // 绑定一个 change 事件，调用 change 方法
    this.aceEditor.getSession().on('change', this.change)
    // 监听选中
    this.aceEditor.session.selection.on('changeSelection', this.changeSelection)
  },
  watch: {
    // 解决父级直接赋值content时，不变化问题
    isCopy: function (value) {
      this.copy = value
    },
    modelValue: function (val, oldVal) {
      this.content = val
      if (this.copy) {
        this.aceEditor.getSession().setValue(val)
        this.copy = null
      }
    },
  },
})
</script>
<style lang="scss">
.ace-container {
  width: 100%;
  height: 100%;
  .ace-editor {
    height: 100% !important;
    width: 100%;
  }
}
</style>

```
## Vue 3.0
?> 最为显著的变化是添加了`组合式API`(2.x的options API依旧可以使用),`setup`选项作为`组合试API`的入口,取代了2.x版本`选项API`的`created`和`beforeCreated`


!> 值得注意的是`组合式API`可以与`选项API`混合使用

### 示例
*实现一个Overlay效果*

```vue
<template>
  <transition name="fade">
    <div class="overlay" v-show="modelValue">
      <div
        ref="root"
        :style="{height:oheight,width:width}"
        :class="{full_screen:isFullScreen}"
        class="overlay_main"
        @click.stop>
        <div class="overlay_head">
          {{title}}
          <div class="close_btn">
            <span @click="fullScreen();">
              <i class="ol_icon el-icon-full-screen"></i>
            </span>
            <span @click="closeOver()">
              <i class="ol_icon el-icon-close"></i>
            </span>
          </div>
        </div>
        <div class="overlay_view">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, reactive, toRefs, computed, onMounted, getCurrentInstance } from 'vue'
export default {
  name: 'overlay',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    oheight: {
      type: String,
      default: '50vh'
    },
    owidth: {
      type: String,
      default: ''
    },
    title: String,
    lazy: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  setup (props, { emit }) {
    const root = ref(null)
    const isFullScreen = ref(false)
    const sizeArr = reactive({
      mini: '30vw',
      small: '60vw',
      large: '90vw'
    })
    const { owidth, size } = toRefs(props)
    const width = computed(() => {
      return owidth.value ? owidth.value : sizeArr[size.value]
    })
    const closeOver = () => {
      emit('update:modelValue', false)
    }
    const fullScreen = () => { // 全屏
      isFullScreen.value = !isFullScreen.value
      if (isFullScreen.value) {
        root.value.style.left = '0px'
        root.value.style.top = '0px'
      }
    }
    const { ctx } = getCurrentInstance()
    onMounted(() => {
      console.log(ctx)
      console.log(root.value)
    })
    return {
      root,
      isFullScreen,
      width,
      fullScreen,
      closeOver,
      ...toRefs(props)
    }
  }
}
</script>

<style lang="scss">
.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5) !important;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
  .full_screen {
    transition: all .21s ease-in-out;
    width: 100vw !important;
    height: 100vh !important;
  }
  .overlay_main {
    position: relative;
    background-color: #fff;
    box-shadow: 0 2px 5px 5px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    overflow-x: hidden;
    // transition: all 0.2s ease-in;  //拖拽延迟
    box-sizing: content-box;
    margin: 0 auto ;
    transition: all .21s ease-in-out;
    .overlay_head {
      background-color: #0aada5;
      border-bottom: 1px solid transparent;
      text-align: start;
      height: 30px;
      padding: 2px 8px;
      line-height: 30px;
      font-size: 16px;
      cursor: pointer;
      .close_btn {
        float: right;
        cursor: pointer;
        .ol_icon {
          margin-left: 14px;
          font-size: 20px;
          &:hover {
            color: #e8ebee;
          }
        }
      }
    }
    .overlay_view {
      box-sizing: border-box;
      width: 100%;
      height: calc(100% - 35px);
      overflow: auto;
      // padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      // justify-content: center;
      .form_btn {
        text-align: center;
      }
    }
  }
}
</style>

```
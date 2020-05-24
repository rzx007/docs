## vue组件的动态注册和动态加载

### 前言

?>实际项目中，针对不同的数据开发了不同的数据展示视图组件，例如：拓扑图、热力图、地图。每一类视图都有一个独立的.vue组件，在界面化管理平台上，要实现可以动态的新增视图组件，同时修改的时候可以随意的修改选择那一类视图。类似BI操作系统，即：基础视图组件的个数是不固定的。这就要求在界面化操作配置视图时，我们可以动态的注册和加载组件。

## 代码

```vue
// 新建DynamicComponents.vue
<template>
  <div class="comps">
    <component :is="component" v-if="component" v-bind="data"></component>
  </div>
</template>

<script>
export default {
  name: "dynamic-component",
  data() {
    return {
      component: null,
    };
  },
  props: ["componentName", "data"],
  computed: {
    // 异步组件路径@,无法解析，需要显示填写
    loader() {
      return () => import(`@/${this.componentName}.vue`);
    }
  },
  mounted() {
    // 监听componentName变化
    this.loader()
      .then(() => {
        this.component = () => this.loader();
      })
      .catch(() => {
        this.component = () => import(`@/${this.componentName}.vue`);
      });
  }
};
</script>

<style lang='scss'>
</style>


```

```vue
// 使用
<template>
  <div class="content">
    <el-button type="primary" @click="addComps">添加</el-button>
    <dynamicComps
      v-for="(item,index) in cmps"
      :key="index"
      :componentName="item.path"
      :data="item.props"
    ></dynamicComps>
    <dynamicComps
      v-for="(item,index) in cmps1"
      :key="index"
      :componentName="item.path"
      :data="item.props"
    ></dynamicComps>
  </div>
</template>

<script>
import dynamicComps from "@/components/DynamicComponents";
export default {
  data() {
    return {
      cmps: [
        {
          path: "components/Header",
          name: "Header",
          props: {
            //组件的props属性
            slogan: "系统",
          }
        },
        {
          path: "components/footer",
          name: "footer",
          props: {
            name: "2",
          }
        }
      ],
      cmps1: [
        {
          path: "components/footer",
          name: "footer",
          props: {
            //组件的props属性
            slogan: "系统",
          }
        }
      ]
    };
  },
  components: { dynamicComps },
  methods: {
    //   根据业务动态加载组件
    addComps() {
      this.cmps.push({
        path: "components/footer",
        name: "footer",
        props: {
          name: "新增"+new Date(),
          id: 1
        }
      });
    }
  }
};
</script>

<style lang='scss'>
 
</style>


```
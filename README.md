# vue-propsync

[![NPM version](https://img.shields.io/npm/v/vue-propsync.svg?style=flat-square)](https://vxhly.github.io/2016/08/flexbox-layout/) [![GitHub forks](https://img.shields.io/github/forks/vxhly/vue-propsync.svg)](https://github.com/vxhly/vue-propsync/network) [![GitHub stars](https://img.shields.io/github/stars/vxhly/vue-propsync.svg)](https://github.com/vxhly/vue-propsync/stargazers) [![NPM download](https://img.shields.io/npm/dm/vue-propsync.svg?style=flat-square)](https://npmjs.org/package/vue-propsync) [![GitHub license](https://img.shields.io/github/license/vxhly/vue-propsync.svg)](https://github.com/vxhly/vue-propsync/blob/master/LICENSE)

> vue-propsync：vue 组件的混合对象，主要用于组件编写时混入调用。

## Thanks

- [Vue minxins 官方文档](https://cn.vuejs.org/v2/api/#mixins)
- [propsync.js](https://github.com/xxcanghai/cnblogsFiles/blob/master/vue-mixins/propsync.js)
- [Vue2 利用 v-model 实现组件props双向绑定的优美解决方案](https://segmentfault.com/a/1190000008662112)

## Introduction and Use

### 主要功能

1. 实现了在组件内自动创建 prop 对应的 data，方便组件内修改 prop 使用。解决了 vue2.0 中不允许组件内直接修改 prop 的设计。
2. 实现了组件外修改组件 prop 的双向绑定，子组件状态改变时将会通知父组件，同时父组件状态改变时也会通知子组件
3. 父组件使用 v-model 来帮定数据，子组件通过 value 来保存 v-model 的值
4. 父组件不需要写方法来同步子组件传来 v-model 的值，子组件也不再需要写过多的监听方法和将数据同步至父组件的方法

### 食用方法

1. 编写组件：在选项对象中增加 mixins: [propsync] 即可，如：

  ```html
  <script>
  import propsync from 'vue-propsync'
  export default {
   name: 'hello',
   mixins: [propsync]
  }
  </script>
  ```

2. 调用组件：在调用组件的 templat 处，增加一个 v-model 来绑定数据，如：

  ```html
  <modal v-model="isShow"></modal>
  <script>
  export default {
   name: 'app',
   data () {
     return {
       isShow: false
     }
   }
  }
  </script>
  ```

3. 子组件：如：

  ```html
  <template>
   <div class="modal" :value="value" v-show="sync_value">
     <!-- 由于 v-model 一定要由 value 来接受传值，以上接受父组件数据为固定写法，复制粘贴即可，本插件将会为 value 创建一个副本 sync_value, 子组件需要绑定该变量 -->
     <div class="close" @click="cancel">测试</div>
   </div>
  </template>
  <script>
  import propsync from 'vue-propsync'
  export default {
   name: 'hello',
   mixins: [propsync],
   props: {
     value: {
       type: Boolean,
       default: false,
       isSync: true // 需要开启双向绑定的一定要写这句话，默认不会将所有的 prop 开启双向绑定
     }
   },
   methods: {
     cancel () {
       this.sync_value = false // 注意 props 是不能直接改变的，则需要改变本插件创建的副本即可
     }
   }
  }
  </script>
  ```

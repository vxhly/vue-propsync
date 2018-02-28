/**
 * @Author: vxhly
 * @Date:   2018-02-17 09:22:34 pm
 * @Email:  pengchengou@gmail.com
 * @Filename: vue-propsync.js
 * @Last modified by:   vxhly
 * @Last modified time: 2018-02-28 05:35:45 pm
 * @License: MIT
 */

/**
  * =================说明==================
  * vue-propsync：vue 组件的混合对象，主要用于组件编写时混入调用。
  *
  * 【主要功能】
  * 1. 实现了在组件内自动创建 prop 对应的 data，方便组件内修改 prop 使用。解决了 vue2.0 中不允许组件内直接修改 prop 的设计。
  * 2. 实现了组件外修改组件 prop 的双向绑定，子组件状态改变时将会通知父组件，同时父组件状态改变时也会通知子组件
  * 3. 父组件使用 v-model 来帮定数据，子组件通过 value 来保存 v-model 的值
  * 4. 父组件不需要写方法来同步子组件传来  v-model 的值，子组件也不再需要写过多的监听方法和将数据同步至父组件的方法
  *
  * 【食用方法】
  * 1. 编写组件：在选项对象中增加 mixins: [propsync] 即可，如：
  *
  *   <script>
  *   import propsync from 'vue-propsync'
  *   export default {
  *     name: 'hello',
  *     mixins: [propsync]
  *   }
  *   </script>
  *
  * 2. 调用组件：在调用组件的 templat 处，增加一个 v-model 来绑定数据，如：
  *
  *   <modal v-model="isShow"></modal>
  *   <script>
  *   export default {
  *     name: 'app',
  *     data () {
  *       return {
  *         isShow: false
  *       }
  *     }
  *   }
  *   </script>
  * 3. 子组件：如：
  *
  *   <template>
  *     <div class="modal" :value="value" v-show="sync_value">
  *       <!-- 由于 v-model 一定要由 value 来接受传值，以上接受父组件数据为固定写法，复制粘贴即可，本插件将会为 value 创建一个副本 sync_value, 子组件需要绑定该变量 -->
  *       <div class="close" @click="cancel">测试</div>
  *     </div>
  *   </template>
  *   <script>
  *   import propsync from 'vue-propsync'
  *   export default {
  *     name: 'hello',
  *     mixins: [propsync],
  *     props: {
  *       value: {
  *         type: Boolean,
  *         default: false,
  *         isSync: true // 需要开启双向绑定的一定要写这句话，默认不会将所有的 prop 开启双向绑定
  *       }
  *     },
  *     methods: {
  *       cancel () {
  *         this.sync_value = false // 注意 props 是不能直接改变的，则需要改变本插件创建的副本即可
  *       }
  *     }
  *   }
  *   </script>
  */
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

const isSync = 'isSync' // 开启 sync props 双向绑定配置项

/**
 * [getDataName 创建副本变量]
 *
 * @method getDataName
 *
 * @param  {[String]} propName [prop 名]
 *
 * @return {[String]} [副本变量]
 */
const getDataName = (propName) => {
  return `sync_${propName}`
}

const propsync = {
  data () {
    const data = {}
    const propsKeys = Object.keys((this.$options.props) || {}) // 获取当前组件的所有 props

    propsKeys.forEach((prop, index) => {
      // 将会遍历 props 所有的变量，然后为其创建副本变量
      let isEnable = this.$options.props[prop][isSync]
      isEnable = (typeof isEnable === 'boolean') ? isEnable : false

      if (isEnable) {
        const dataName = getDataName(prop)
        data[dataName] = this[prop]
      }
    })

    return data
  },
  mounted () {
    const propsKeys = Object.keys((this.$options.props) || {})

    propsKeys.forEach((prop, index) => {
      let isEnable = this.$options.props[prop][isSync]
      isEnable = (typeof isEnable === 'boolean') ? isEnable : false

      if (isEnable) {
        const dataName = getDataName(prop)

        // 创建监听事件，监听 prop 状态并同步 data 中的变量值
        this.$watch(prop, val => {
          this[dataName] = val
        })

        // 创建监听事件，监听副本状态，通过 input 内置事件将状态同步至父组件 v-model 绑定的变量中
        this.$watch(dataName, val => {
          this.$emit('input', val)
        })
      }
    })
  }
}
module.exports = propsync

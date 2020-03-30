请查看 GITHUB ，直接跑，有示例
`https://github.com/tangjian1891/vue-plugin-tj`

### 1.

main.js

```
import VPay from "vpay-tj";

Vue.config.productionTip = false;
```

### 2.

Index.vue

```
<template>
  <div class="container">
  <div @click="isOpen=true">点击展示支付弹窗</div>
 <v-pay
      ref="pay"
      v-model="isOpen"
      :digit="6"
      @forget="forget"
      @cancel="cancel"
      @input-end="inputEnd"
    ></v-pay>
  </div>
</template>
<script>
export default {
  name: 'Index',
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    // 输入完成后。自动回调。
    inputEnd(val) {
      // 建议开启loading加载状态
      setTimeout(() => {
        if (val === '111111') {
          // TODO 封装了一个promise。2s后执行跳转页面
          this.$refs.pay.$success().then(() => {
            // 自己想怎么处理 都可以
            alert("随意操作")
            // this.$router.push("/about")
          })
        } else {
          // 失败了
          this.$refs.pay.$fail()
        }
      }, 2000);
    },
    // 取消支付弹窗关闭的回调
    close() {
      console.log('关闭')
    },

    // 忘记密码跳转
    forget () {
      console.log('触发forge事件');
    },
    cancel() {
      this.isOpen = false
    }
  }
}
</script>
```

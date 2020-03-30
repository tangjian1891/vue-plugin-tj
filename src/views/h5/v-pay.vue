<template>
  <div>
    <p @click="isOpen=true">点击出现一个弹窗</p>
    <div>1. v-model="isOpen" |必填| 控制弹窗显示/隐藏</div>
    <div>
      2. ref | 必填 | 用来API请求后，显示成功/失败.
      <br />在input-end事件中。可以选择性的使用
      <br />ref="pay"
      <br />
      this.$refs.pays.$success().then(res => {
      console.log('支付成功')
      this.$router.push('/success')
      })
      <br />this.$refs.pays.$fail()
    </div>
    <div>3. digit | 选填 属性 |几位数密码/默认是6位</div>
    <div>4. cancel | event | 取消/关闭弹窗</div>
    <div>5. input-end | event | 密码输入完成后立即会执行此函数</div>
    <div>6. forget | event | 忘记密码事件</div>

    <v-pay></v-pay>
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
  name: "vpay",
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
    cancel() {
      this.isOpen = false
      console.log('关闭')
    },

    // 忘记密码跳转
    forget () {
      console.log('触发forge事件');
    }
  }
}
</script>

<style>
</style>

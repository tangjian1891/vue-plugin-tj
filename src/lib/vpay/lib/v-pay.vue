<template>
  <div class="mask" v-show="isOpen">
    <div class="content" @click.stop>
      <!-- 标题 -->
      <header>
        <div class="icon-back" @click="cancel"></div>
        <h3>{{title}}</h3>
      </header>
      <!-- 密码框 -->
      <div class="pwd-box">
        <ul class="pwd-area">
          <!-- 密码格子。动态生成 -->
          <li
            :class="['pwd-item',{on:password.length>index}]"
            :key="index"
            v-for="(item,index) in digit"
          ></li>
        </ul>
      </div>
      <!-- 忘记密码 -->
      <div class="forget-pwd">
        <span @click="forget">忘记密码</span>
      </div>
      <!-- 键盘区 -->
      <ul class="keyboard" @click="onKeyboard">
        <li :data-num="index+1" v-for="(item,index) in keyboard" :key="index">
          <span>{{item.num}}</span>
          <span>{{item.letter}}</span>
        </li>
      </ul>

      <!-- 封装loading 状态.展示正在支付,支付成功两种状态-->
      <div class="loading-wrap" v-if="payStatus!==0">
        <div class="loading">
          <!-- 图片 -->
          <img class="loading-ico" src="./images/loading.png" v-if="payStatus === 1" alt />
          <img src="./images/success.png" v-if="payStatus === 2" alt />
          <!-- 文字部分 -->
          <p v-if="payStatus === 1">{{loadingText}}</p>
          <p v-if="payStatus === 2">{{finishedText}}</p>
        </div>
      </div>

      <!-- 支付失败的一个提示框 -->
      <div class="pay-fail" v-if="isShowFail">
        <div class="pay-fail-lay">
          <h3 class="title">{{failTip}}</h3>
          <div class="btns">
            <div @click="reInput">重新输入</div>
            <div @click="forget">忘记密码</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VPay",
  data: function() {
    return {
      keyboard: [
        {
          num: 1,
          letter: ""
        },
        {
          num: 2,
          letter: "ABC"
        },
        {
          num: 3,
          letter: "DEF"
        },
        {
          num: 4,
          letter: "GHI"
        },
        {
          num: 5,
          letter: "JKL"
        },
        {
          num: 6,
          letter: "MNO"
        },
        {
          num: 7,
          letter: "PQRS"
        },
        {
          num: 8,
          letter: "TUV"
        },
        {
          num: 9,
          letter: "WXYZ"
        },
        {
          num: null,
          letter: ""
        },
        {
          num: 0,
          letter: ""
        },
        {
          num: null,
          letter: ""
        }

      ],
      password: "",
      payStatus: 0, // 支付状态标识:0 还未支付 ，1 正在支付，2支付完成
      isShowFail: false, // 密码不正确后显示错误的提示框
      failTip: "支付密码错误"

    };
  },
  model: {
    prop: "isOpen",
    event: 'change'
  },
  props: {
    loadingText: {
      type: String,
      default: "正在支付"
    },
    // 支付成功的文字提示
    finishedText: {
      type: String,
      default: '支付成功'
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "请输入支付密码"
    },
    // 仍然需要二次校验。允许4位6 位 8位
    digit: {
      type: Number,
      default: 6
    }
  },
  methods: {
    // refs直接被调用的。展示错误信息,成功的图标显示
    $success() {
      return new Promise((resolve, reject) => {
        this.payStatus = 2;
        // 两秒后，隐藏整个支付弹窗
        setTimeout(() => {
          this.cancel()
          resolve()
        }, 2000);
      })
    },
    // refs 直接被调用的方法。展示错误信息。停止loading
    $fail(tip) {
      tip && typeof tip === 'string' && (this.failTip = tip)
      this.payStatus = 0
      this.isShowFail = true;
    },
    // 点击键盘 。使用事件代理
    onKeyboard(e) {
      // debugger
      let targetEl;
      if (e.target) {
        targetEl = e.target.tagName === 'SPAN' ? e.target.parentElement : e.target
      }
      const current = parseInt(targetEl.getAttribute('data-num'))
      if (!isNaN(current) && typeof current === 'number') {
        if (current === 10) return
        if (current === 12) {
          // 删除逻辑
          this.delKeyboard()
          return
        }
        if (current === 11) {
          this.password = this.password + '0'
          return
        }
        // 数字类型.
        this.password = (this.password + current).slice(0, this.digit)
      }
    },
    // 删除密码
    delKeyboard() {
      const length = this.password.length
      if (length === 0) return
      this.password = this.password.slice(0, length - 1)
    },
    // 取消支付
    cancel() {
      // 如果当前正在拉起支付接口。也就是状态为1.不允许退出
      if (this.payStatus === 1) return

      //  全清
      this.password = ""
      this.payStatus = 0
      // 关闭弹窗
      this.$emit("cancel")
    },
    forget() {
      // 忘记密码的操作
      this.password = ""
      this.payStatus = 0
      this.isShowFail = false
      this.$emit("forget")
    },
    // 重新输入
    reInput () {
      // 清空密码
      this.password = '';
      // 关闭失败选择对话框
      this.isShowFail = false;
    }
  },
  watch: {
    password(n, o) {
      if (n.length === this.digit) {
        // 触发输入完成,正在支付中。
        this.payStatus = 1
        this.$emit('input-end', this.password)
      }
    }
  }
}
</script>

<style scoped >
* {
  padding: 0;
  margin: 0;
  font-size: 14px;
}
ul,
li {
  list-style: none;
}
.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
}
.content {
  background-color: #fafafa;
  /* TODO */
  /*
  bottom: 0; */
  position: absolute;
  width: 100%;
  bottom: 0;
}
header {
  line-height: 40px;
  height: 40px;
  border-bottom: 1px solid #e5e5e5;
  position: relative;
}
.icon-back {
  position: absolute;
  left: 0;
  width: 40px;
  height: 40px;
  background: url("./images/back.png") no-repeat center;
  background-color: #fafafa;
}
.pwd-box {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  margin: 10px 0;
}
.pwd-area {
  display: flex;
  border: 1px solid #e7e7e7;
  border-right: none;
}
.pwd-item {
  width: 60px;
  height: 40px;
  border-right: 1px solid #e7e7e7;
}
.forget-pwd {
  text-align: right;
  color: #0083e3;
  margin: 25px 0;
}
.forget-pwd span {
  padding-right: 20px;
}
.keyboard {
  display: flex;
  flex-wrap: wrap;
}
.keyboard > li {
  display: flex;
  flex-direction: column;
  width: 33.33%;
  height: 45px;
  box-sizing: border-box;
  background-origin: padding-box;
  border-bottom: 1px solid #b2b2b2;
  border-right: 1px solid #b2b2b2;
}
.keyboard > li:active {
  background-color: #ccc;
}
.keyboard > li:nth-child(10) {
  background-color: #d1d5db;
}
.keyboard > li:nth-child(12) {
  background: url("./images/delete.png") no-repeat center;
  background-color: #d1d5db;
}
.keyboard > li:nth-child(12):active {
  background-color: #b2b2b2;
}

.keyboard > li span:first-child {
  display: inline-block;
  padding-top: 8px;
  font-weight: 700;
}
.keyboard > li:nth-child(3n) {
  border-right: none;
}
/* 密码上的伪元素黑点 */
.pwd-area li {
  position: relative;
}
.on::after {
  content: "";
  /* display: flex; */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background-color: black;
  border-radius: 50%;
}

/* 加载中 */
.loading-wrap {
  position: absolute;
  left: 0;
  top: 40px;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background: #fff;
  display: flex;
}
.loading-wrap .loading {
  text-align: center;
}
/* 支付失败弹窗 */
.pay-fail {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  max-width: 750px;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
}
.pay-fail-lay {
  width: 60%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
}
.pay-fail-lay .title {
  line-height: 30px;
  text-align: center;
  font-size: 16px;
  padding: 10px;
}
.pay-fail-lay .btns {
  display: flex;
  border-top: 1px solid #f1f1f1;
}
.pay-fail-lay .btns div {
  flex: 1;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.pay-fail-lay .btns div:active {
  background: #f3f3f3;
}
.pay-fail-lay .btns div:last-child {
  border-left: 1px solid #f1f1f1;
}

/* 让loading图片自己转 */
@keyframes rotate {
  0% {
    transform: rotateZ(0deg); /*从0度开始*/
  }
  100% {
    transform: rotateZ(360deg); /*360度结束*/
  }
}
.loading-ico {
  /* display: block; */
  animation: rotate 1.2s linear infinite;
}
</style>

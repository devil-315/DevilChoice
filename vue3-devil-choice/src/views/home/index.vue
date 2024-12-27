<template>
  <el-card >
    <div class="box">
      <img :src="userStore.avatar" alt="" class="avatar">
      <div>
        <h3>{{getTime()}}好呀 {{userStore.username}}</h3>
        <p>楚河甄选运营平台</p>
      </div>
    </div>
  </el-card>
  <div class="bottoms">
    <svg-icon name="welcome" width="600px" height="300px"></svg-icon>
  </div>
</template>

<script setup lang="ts">
import {getTime} from '@/utils/time'
//获取仓库
import useUserStore from '@/store/modules/user'
//获取存储用户信息的仓库
let userStore = useUserStore()
</script>
<style scoped lang="scss">
.box {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .bottom {
    margin-left: 20px;

    .title {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 30px;
    }

    .subtitle {
      font-style: italic;
      color: skyblue;
    }
  }
}
.bottoms{
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>
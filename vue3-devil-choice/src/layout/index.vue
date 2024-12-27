<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <Logo></Logo>
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          :collapse="LayOutSettingStore.fold"
          :default-active="$router.path"
          background-color="#001529"
          text-color="white"
          active-text-color="pink"
        >
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航-->
    <div class="layout_tabbar" :class="{ fold: LayOutSettingStore.fold }">
      <!-- layout顶部组件导航tabbar -->
      <Tabbar></Tabbar>
    </div>
    <!-- 内容展示区域 -->
    <div class="layout_main" :class="{ fold: LayOutSettingStore.fold }">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
//引入左侧菜单logo子组件
//引入路由对象
import { useRoute } from "vue-router";
import Logo from "./logo/index.vue";
//引入菜单组件
import Menu from "./menu/index.vue";
//右侧内容的展示区域
import Main from "./main/index.vue";
//顶部内容的展示区域
import Tabbar from "./tabbar/index.vue";
//获取用户相关的小仓库
import useUserStore from "@/store/modules/user";
//获取layout组件相的小仓库
import useLayOutSettingStore from "@/store/modules/setting";
let userStore = useUserStore();
//获取layout配置仓库
let LayOutSettingStore = useLayOutSettingStore();
//获取路由对象
let $route = useRoute();
</script>
<script lang="ts">
export default {
  name: "Layout",
};
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    color: white;
    width: 260px;
    height: 100vh;
    background: #21152a;
    transition: all 0.3s;

    .scrollbar {
      width: 100%;
      height: calc(100vh - 50px);
      .el-menu {
        border-right: none;
      }
    }
  }
  .layout_tabbar {
    position: fixed;
    width: calc(100% - 260px);
    height: 50px;
    top: 0px;
    left: 260px;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - 50px);
      left: 50px;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - 260px);
    height: calc(100vh - 50px);
    left: 260px;
    top: 50px;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - 50px);
      left: 50px;
    }
  }
}
</style>
//创建用户相关的小仓库
import { defineStore } from 'pinia';
//引入接口
import { reqLogin, reqUserInfo, reqLogout } from '../../api/user';
import type { loginFormData, loginResponseData, userInfoReponseData } from '../../api/user/type'
import type { UserState } from './types/type'
//引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '../../utils/token.ts'
//引入深拷贝方法
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep'
//引入路由（常量路由）
import { constantRoute, asyncRoute, anyRoute } from '../../router/router';
import router from '../../router';
//用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asnycRoute: any, routes: any) {
  return asnycRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes);
      }
      return true;
    }
  })
}

//创建小仓库
let useUserStore = defineStore('User', {
  //小仓库存储数据地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(),//用户唯一标识token
      menuRoutes: constantRoute,//仓库存储生成菜单需要数组(路由)
      username: '',
      avatar: '',
      buttons:[] //存储当前用户包含的按钮
    }
  },
  //异步|逻辑的地方
  actions: {
    //用户登录的方法
    async useLogin(data: loginFormData) {
      //登录请求
      let result: loginResponseData = await reqLogin(data)
      // console.log(result);
      //成功：200=》获取token
      //失败：201=》失败信息
      if (result.code === 200) {
        //pinia仓库存储一下tokrn
        //由于pinia|vuex存储数据利用的是js对象
        //本地存储持久化数据一份
        this.token = (result.data as string)
        SET_TOKEN()
        //保证aysnc函数返回一个成功的promise      
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    //获取用户信息方法
    async userInfo() {
      //获取用户信息进行存储仓库当中【用户头像，名字】
      let result: userInfoReponseData = await reqUserInfo();
      //如果获取用户信息成功，存储用户信息
      if (result.code === 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons
        //计算当前用户需要展示的异步路由
        let userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), result.data.routes)
        //菜单需要的数据
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
        //目前路由器管理的只有常量路由：用户计算完毕异步路由、任意路由动态追加
        let allRouter = [...userAsyncRoute, anyRoute]
        allRouter.forEach((route: any) => {
          router.addRoute(route);
        })      
        //打印当前用户全部的路由
        // console.log(router.getRoutes());
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    //退出登录
    async userLogout() {
      //目前没有mock接口：退出登录接口（通知服务器本地用户唯一标识失败）
      let result: any = await reqLogout()
      if (result.code === 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
      } else {
        return Promise.reject(new Error(result.message))
      }
    }
  },
  getters: {
  }
})
//对外暴露获取小仓库方法
export default useUserStore
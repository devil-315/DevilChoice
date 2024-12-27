import { createApp } from 'vue'
//@ts-ignore
import App from './App.vue'
//引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//配置element-plus国际化
//@ts-ignore  //ts忽略类型检测
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//svg插件需要配置代码
import 'virtual:svg-icons-register'
//引入自定义插件对象：注册整个项目全局组件
import globalComponent from '@/components'
//引入模板的全局样式
import '@/style/index.scss'
//暗黑模式需要的样式
import 'element-plus/theme-chalk/dark/css-vars.css'
//引入路由
import router from './router'
//引入仓库
import pinia from './store'
//获取应用实例对象
const app = createApp(App)
//安装ElementPlus 插件
app.use(ElementPlus, {
  locale: zhCn
})
//安装仓库
app.use(pinia)
//安装自定义插件
app.use(globalComponent)
//注册模板路由
app.use(router)
//引入路由鉴权
import './permission'
//引入自定义指令文件
import {isHasButton} from '@/directive/has.ts'
isHasButton(app);
//将应用挂载到挂载点上
app.mount('#app')
import pinia from "../store";
import useUserStore from "../store/modules/user";
//获取对应的用户仓库
let userStore = useUserStore(pinia)
export const isHasButton = (app:any) => {
  //全局自定义指令：实现按钮的权限
  app.directive('has',{
    //代表使用这个全局自定义指令的DOM|组件挂载完毕的时候会执行一次
    mounted(el:any,options:any) {
      //自定义指令右侧的数值，如果在用户信息的buttons数值中每页，就从DOM树上删掉
      if(!userStore.buttons.includes(options.value)){
        el.parentNode.removeChild(el)
      }
    },
  })
}
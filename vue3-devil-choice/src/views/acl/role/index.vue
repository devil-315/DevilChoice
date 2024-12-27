<template>
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="搜索">
        <el-input placeholder="请你输入搜索职位关键字" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="!keyword" @click="search">搜索</el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px">
    <el-button type="primary" size="default" icon="Plus" @click="addRole">添加职位</el-button>
    <el-table border style="margin: 10px 0px;" :data="allRole">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="职位名称" align="center" show-overflow-tooltip prop="roleName"></el-table-column>
      <el-table-column label="创建时间" align="center" show-overflow-tooltip prop="createTime"></el-table-column>
      <el-table-column label="更新时间" align="center" show-overflow-tooltip prop="updateTime"></el-table-column>
      <el-table-column label="操作" width="280px" align="center">
        <!-- row:已有的职位对象 -->
        <template #="{row,$index}">
          <el-button type="primary" size="small" icon="User" @click="setPermisstion(row)">分配权限</el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>
          <el-popconfirm :title="`你确实要删除${row.roleName}这个职位嘛~~~`" width="260px" @confirm="removeRole(row.id)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
     <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
          :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasRole"
          @size-change="sizeChange" />
  </el-card>
  <!-- 添加与更新职位的对话框 -->
  <el-dialog v-model="dialogVisite" :title="RoleParams.id ? '更新职位' :'添加职位'">
    <el-form :model="RoleParams" :rules="rules" ref="form">
      <el-form-item label="职位名字" prop="roleName">
        <el-input placeholder="请你输入职位名称" v-model="RoleParams.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default" @click="dialogVisite = false">取消</el-button>
      <el-button type="primary" size="default" @click="save">确定</el-button>
    </template>
  </el-dialog>
  <!-- 抽屉组件：分配职位的菜单权限与按钮的权限 -->
   <el-drawer v-model="drawer">
    <template #header>
      <h4>分配菜单与按钮的权限</h4>
    </template>
    <template #default>
      <!-- 树形控件 -->
      <el-tree ref="tree" :data="menuArr" show-checkbox node-key="id" default-expand-all
              :default-checked-keys="selectArr" :props="defaultProps" />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="handler">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
import {ref,onMounted,reactive,nextTick} from 'vue'
import {reqAllRoleList,reqAddOrUpdateRole,reqAllMenuList,reqSetPermisstion,reqRemoveRole} from '@/api/acl/role/index'
import type {RoleResponseData,Records,RoleData,MenuResponseData,MenuList} from '@/api/acl/role/type'
import { ElMessage } from 'element-plus'
//当前页码
let pageNo = ref<number>(1)
//一页展示几天数据
let pageSize = ref<number>(10)
//搜索职位关键字
let keyword = ref<string>('')
//存储全部已有的职位
let allRole = ref<Records>([])
//职位总个数
let total = ref<number>(0)
//获取setting仓库
let settingStore = useLayOutSettingStore()
//控制对话框的显示与隐藏
let dialogVisite = ref<boolean>(false)
//收集新增岗位的数据
const RoleParams = reactive<RoleData>({
  roleName: '',
})
//获取form组件的实例vc
let form = ref<any>()
//控制抽屉的显示与隐藏
let drawer = ref<boolean>(false)
//准备一个数组：存储勾选的节点的ID（四级的）
let selectArr = ref<any>([])
//定义数组存储用户权限的数据
let menuArr = ref<MenuList>([])
//获取tree组件实例
let tree = ref()
//组件挂载完毕
onMounted(() => {
  getHasRole()
})
//获取全部用户信息的方法|分页器当前页码发生变化的回调
const getHasRole =async (pager = 1) => {
  //修改当前页码
  pageNo.value = pager
  let result:RoleResponseData = await reqAllRoleList(pageNo.value,pageSize.value,keyword.value)
  if(result.code == 200){
    total.value = result.data.total
    allRole.value = result.data.records
  }
}
//下拉菜单的回调
const sizeChange = () => {
  getHasRole()
}
//搜索
const search = () => {
  //根据关键字再次发请求
  getHasRole()
  //清空关键字
  keyword.value = ''
}
//重置
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}
//添加职位
const addRole = () => {
  //显示对话框
  dialogVisite.value = true
  //清空数据
  Object.assign(RoleParams,{roleName: '',id: 0})
  //清空上一次表单校验的错误结果
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}
//更新已有的职位按钮的回调
const updateRole = (row:RoleData) => {
  //显示对话框
  dialogVisite.value = true
  //存储已有的职位
  Object.assign(RoleParams,row)
  //清空上一次表单校验的错误结果
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}
//自定义校验规则
const validatorRoleName = (rule: any,value: any,callBack: any) => {
  if(value.trim().length >= 2){
    callBack()
  }else{
    callBack(new Error('职位名称至少两位'))
  }
}
//职位的校验规则
const rules = {
  roleName: [{required:true,trigger:'blur',validator: validatorRoleName}]
}
//确定按钮
const save =async () => {
  //表单校验成功，才发请求
  form.value.validate()
  //添加职位|更新职位的请求
  let result:any = await reqAddOrUpdateRole((RoleParams as RoleData))
  if(result.code == 200){
    //提示
    ElMessage({type:'success',message:RoleParams.id ? '更新成功' : '添加成功'})
    //对话框隐藏
    dialogVisite.value = false
    //再次获取全部已有的值
    getHasRole(RoleParams.id ? pageNo.value : 1)
  }
}
//分配权限按钮的回调
//已有的职位的数据
const setPermisstion = async (row: RoleData) => {
    //抽屉显示出来
    drawer.value = true;
    //收集当前要分类权限的职位的数据
    Object.assign(RoleParams, row);
    //根据职位获取权限的数据
    let result: MenuResponseData = await reqAllMenuList((RoleParams.id as number));
    if (result.code == 200) {
        menuArr.value = result.data;
      selectArr.value = filterSelectArr(menuArr.value,[])
    }
}
//树形控件的测试数据
const defaultProps = {
    children: 'children',
    label: 'name',
}
const filterSelectArr = (allData:any,initArr:any) => {
  allData.forEach(item => {
    if(item.select && item.level == 4){
      initArr.push(item.id)
    }
    if(item.children && item.children.length > 0){
      filterSelectArr(item.children,initArr)
    }
  });
  return initArr
}
//抽屉确认按钮
const handler =async () => {
  //职位的ID
  const roleId = RoleParams.id
  //选中节点的Id
  let arr = tree.value.getCheckedKeys();
  //半选的ID
  let arr1 = tree.value.getHalfCheckedKeys();
  let permissionId = arr.concat(arr1)
  //下发权限
  let result:any = await reqSetPermisstion(roleId,permissionId)
  if(result.code == 200){
    //抽屉关闭
    drawer.value = false
    //提示信息
    ElMessage({type:'success',message:'分配权限成功'})
    //页码刷新
    window.location.reload()
  }
}
//删除已有的之前的职位
const removeRole =async (id:number) => {
  let result:any = await reqRemoveRole(id)
  if(result.code == 200){
    ElMessage({type:'success',message:'删除成功'})
    //获取新的所有的职位
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
</script>
<style scoped>
.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
}
</style>
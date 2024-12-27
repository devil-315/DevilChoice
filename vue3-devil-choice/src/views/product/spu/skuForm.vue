<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称" >
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格（元）" >
      <el-input placeholder="价格（元）" type="number" v-model="skuParams.price"></el-input>
    </el-form-item>
    <el-form-item label="重量（g）" >
      <el-input placeholder="重量（g）" type="number" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述" >
      <el-input placeholder="SKU描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item v-for="(item, index) in attrArr" :key="item.id" :label="item.attrName">
          <el-select v-model="item.attrIdAndValueId" style="width: 100px">
            <el-option :value="`${item.id}:${attrValue.id}`"  v-for="(attrValue, index) in item.attrValueList"
            :key="attrValue.id" :label="attrValue.valueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item v-for="(item,index) in saleAttr" :key="item.id" :label="item.saleAttrName">
          <el-select v-model="item.saleIdAndValueID">
            <el-option :value="`${item.id}:${saleAttrValue.id}`" v-for="(saleAttrValue,index) in item.spuSaleAttrValueList"
              :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #="{row,$index}">
            <img :src="row.imgUrl" alt="" style="width: 100%;height: 100%">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{row,$index}">
            <el-button type="primary" size="small" @click="handler(row)">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import {ref,reactive} from 'vue'
//引入请求API
import {reqAttr} from "@/api/product/attr/index";
import { reqSpuImageList,reqSpuHasSaleAttr, reqAddSku } from "@/api/product/spu/index";
import type {SkuData} from "@/api/product/spu/type";
import { ElMessage } from 'element-plus';
//平台属性
let attrArr = ref<any>([])
//销售属性
let saleAttr = ref<any>([])
//照片的数据
let imgArr = ref<any>([])
//获取table组件实例vc
let table = ref<any>()
//收集SKU的参数
let skuParams = reactive<SkuData>({
   //父组件传递过来的数据
    "category3Id": "",//三级分类的ID
    "spuId": "",//已有的SPU的ID
    "tmId": "",//SPU品牌的ID
    //v-model收集
    "skuName": "",//sku名字
    "price": "",//sku价格
    "weight": "",//sku重量
    "skuDesc": "",//sku的描述

    "skuAttrValueList": [//平台属性的收集
    ],
    "skuSaleAttrValueList": [//销售属性
    ],
    "skuDefaultImg": "",//sku图片地址
})
//取消按钮的回调
const cancel = () => {
  $emit('changeScene',{flag:0,params:''})
}
//当前子组件的方法对外暴露
const initSkuData =async (c1Id:number|string,c2Id:number|string,spu:any) => {
  //收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId
  //获取平台属性
  let result:any = await reqAttr(c1Id,c2Id,spu.category3Id)
  //获取对应的销售属性
  let result1:any = await reqSpuHasSaleAttr(spu.id)
  //获取照片墙的数据
  let result2:any = await reqSpuImageList(spu.id)
  //平台属性
  attrArr.value = result.data
  //销售属性
  saleAttr.value = result1.data
  //照片
  imgArr.value = result2.data
}
//设置默认图片
const handler = (row:any) => {
  //点击的时候全部图片的复选框不勾选
  imgArr.value.forEach((item:any) => {
    table.value.toggleRowSelection(item,false)
  });
  //选中的图片才勾选
  table.value.toggleRowSelection(row,true)
  //收集图片的地址
  skuParams.skuDefaultImg = row.imgUrl
}
//保存按钮
const save =async () => {
  //1.整理参数
  //平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((pre:any,next:any) => {
    if(next.attrIdAndValueId){
      let [attrId,valueId] = next.attrIdAndValueId.split(':')
      pre.push([
        attrId,
        valueId
      ])
    }
    return pre
  },[])
  //销售属性
  skuParams.skuSaleAttrValueList  = saleAttr.value.reduce((pre:any,next:any) => {
    if(next.saleIdAndValueID){
      let [saleAttrId,saleAttrValueId] = next.saleIdAndValueID.split(':')
      pre.push([
        saleAttrId,
        saleAttrValueId
      ])
    }
    return pre
  },[])
  //2.发请求
  let result:any = await reqAddSku(skuParams)
  if(result.code == 200){
    ElMessage({
      type:'success',
      message:'添加成功'
    })
    //通知父组件切换场景
    $emit('changeScene',{flag:0,params:''})
  }else {
     ElMessage({
        type: 'error',
        message: '添加SKU失败'
      })   
  }
}
//对外暴露的方法
defineExpose({
  initSkuData
})
//自定义事件的方法
let $emit = defineEmits(['changeScene'])
</script>
<style scoped>

</style>
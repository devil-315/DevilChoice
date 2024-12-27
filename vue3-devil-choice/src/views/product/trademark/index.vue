<template>
  <el-card class="box-card">
    <!-- 卡片顶部添加品牌按钮 -->
    <el-button type="primary" size="default" icon="Plus" @click="addTrademark"
    v-has="`btn.Trademark.add`"
      >添加品牌</el-button
    >
    <!-- 表格组件：用于展示已有得平台数据 -->
    <!-- table:---border:可以设置表格纵向是否有边框
        table-column:---label:某一个列表 ---width:设置这列宽度 ---align:设置这一列对齐方式    
      -->
    <el-table style="margin: 10px 0px" border :data="trademarkArr">
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <!--  table-column：默认展示数据用div-->
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template #="{ row, $index }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="$event => updateTrademark(row)"
          ></el-button>
          <el-popconfirm :title='`确定要删除${row.tmName}?`' width="250px" @confirm="removeTradeMark(row.id)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器组件
        pagination
        v-model:current-page:设置分页器当前页码
        v-model:page-size:设置每一页展示数据条数
        page-sizes:用于设置下拉菜单数据
        background:设置分页器按钮的背景颜色
        layout:可以设置分页器六个子组件布局调整
     -->
    <el-pagination
      @size-change="SizeChange"
      @current-change="getHasTrademark"
      :page-count="9"
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
    />
  </el-card>
  <!-- 对话框组件：在添加品牌与修改已有品牌的业务时候使用结构 -->
  <!-- 
      v-model:属性用户控制对话框的显示与隐藏的 true显示 false隐藏
      title:设置对话框左上角标题
   -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
  >
    <el-form
      style="width: 80%"
      :model="trademarkParams"
      :rules="rules"
      ref="formRef"
    >
      <el-form-item label="品牌名称" label-width="100px" prop="tmName">
        <el-input
          placeholder="请输入品牌名称"
          v-model="trademarkArr.tmName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
        <!-- upload组件属性:action图片上传路径书写/api,代理服务器不发送这次post请求  -->
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="trademarkParams.logoUrl"
            :src="trademarkParams.logoUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 具名插槽:footer -->
    <template #footer>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
      <el-button type="primary" size="default" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
//引入组合式API函数 ref
import { ref, onMounted, reactive, nextTick } from "vue";
import {
  reqAddOrUpdateTrademark,
  reqHasTrademark,
  reqDeleteTrademark,
} from "@/api/product/trademark/index";
import type {
  Records,
  TradeMark,
  TradeMarkResponseData,
} from "@/api/product/trademark/type";
import { ElMessage, UploadProps } from "element-plus";
//当前页
let pageNo = ref<number>(1);
//每一页数据条数
let limit = ref<number>(3);
//存储已有的品牌数据总数
let total = ref<number>(0);
//存储已有品牌的数据
let trademarkArr = ref<Records>([]);
//控制对话框的显示与隐藏
let dialogFormVisible = ref<boolean>(false);
//定义手机新增品牌数据
let trademarkParams = reactive<TradeMark>({
  tmName: "",
  logoUrl: "",
});
//获取el-form组件实例
let formRef = ref();
//获取已有的品牌的函数
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager;
  let result: TradeMarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value
  );
  if (result.code === 200) {
    total.value = result.data.total;
    trademarkArr.value = result.data.records;
  }
};
//当前页面发生变化时触发
// const changePageNo = () => {
//   //当前页码发生变化的时候再次发送请求获取对应已有品牌数据
//   getHasTrademark()
// }

//当下拉菜单发生变化
//这个自定义事件,分页器组件会将下拉菜单选中数据返回
const SizeChange = () => {
  //当前每一页的数据量发生变化的时候，当前页码归1
  getHasTrademark();
};

//添加品牌按钮的回调
const addTrademark = () => {
  //对话框显示
  dialogFormVisible.value = true;
  //清空数据
  trademarkParams.id = 0;
  trademarkParams.tmName = "";
  trademarkParams.logoUrl = "";

  //第一种写法：ts的问号语法
  // formRef.value?.clearValidate('tmName')
  // formRef.value?.clearValidate('logoUrl')
  //第二种写法
  nextTick(() => {
    formRef.value.clearValidate("tmName");
    formRef.value.clearValidate("logoUrl");
  });
};

//修改已有品牌的按钮的回调
//row:row即为当前已有的品牌
const updateTrademark = (row: TradeMark) => {
  //对话框显示
  dialogFormVisible.value = true;
  //ES6语法合并对象
  Object.assign(trademarkParams, row);

  nextTick(() => {
    formRef.value.clearValidate("tmName");
    formRef.value.clearValidate("logoUrl");
  });
};

//对话框底部取消按钮
const cancel = () => {
  //对话框隐藏
  dialogFormVisible.value = false;
};
const confirm = async () => {
  //在你发请求之前，要对整个表单进行校验
  //调用这个方法进行全部表单相校验,如果校验全部通过，在执行后面的语法
  await formRef.value.validate();
  let result: any = await reqAddOrUpdateTrademark(trademarkParams);
  //添加品牌成功或者修改品牌成功
  if (result.code == 200) {
    //对话框隐藏
    dialogFormVisible.value = false;
    //弹出提示信息
    ElMessage({
      type: "success",
      message: trademarkParams.id ? "修改品牌成功" : "添加品牌成功",
    });
    //再次发请求获取已有全部的品牌数据
    getHasTrademark();
  } else {
    //添加品牌失败
    ElMessage({
      type: "error",
      message: trademarkParams.id ? "修改品牌失败" : "添加品牌失败",
    });
    //对话框隐藏
    dialogFormVisible.value = false;
  }
};
//上传图片组件->上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  //钩子是在图片上传之前触发，上传文件之前可以约束文件的类型和大小
  //要求：上传文件格式png|jpg|gif 4M
  if (
    rawFile.type == "image/png" ||
    rawFile.type == "image/jpeg" ||
    rawFile.type == "image/gif"
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true;
    } else {
      ElMessage({
        type: "error",
        message: "上传文件大小小于4M",
      });
      return false;
    }
  } else {
    ElMessage({
      type: "error",
      message: "上传文件格式务必PNG|JPG|GIF",
    });
    return false;
  }
};
//图片上传成功钩子
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  //response:即为当前这次上传图片post请求服务器返回的数据
  trademarkParams.logoUrl = response.data;
  //图片上传成功，清除掉对应图片校验结果
  formRef.value.clearValidate("logoUrl");
};
//挂载完毕钩子
onMounted(() => {
  getHasTrademark();
});

//品牌自定义校验规则方法
const validatorTmName = (rule: any, value: any, callBack: any) => {
  //是当表单元素触发blur时候，会触发此方法
  //自定义校验规则
  if (value.trim().length >= 2) {
    callBack();
  } else {
    //校验未通过返回错误的提示信息
    callBack(new Error("品牌名称大于等于两位"));
  }
};
//品牌LOGO图片自定义校验规则
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  //如果图片上传
  if (value) {
    callBack();
  } else {
    callBack(new Error("LOGO图片务必上传"));
  }
};
//表单校验规则
const rules = {
  tmName: [
    //required:这个字段务必校验,表单项前面出来五角星
    //trigger:代表触发校验规则时机[blur、change]
    { required: true, trigger: "blur", validator: validatorTmName },
  ],
  logoUrl: [{ required: true, trigger: "change", validator: validatorLogoUrl }],
};
//气泡确认框确认按钮回调
const removeTradeMark =async (id:number) => {
  let result = await reqDeleteTrademark(id)
  if(result.code == 200){
    ElMessage({
      type: 'success',
      message: '删除品牌成功'
    })
    //再次获取已有的品牌数据
    getHasTrademark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }else{
    ElMessage({
      type: 'error',
      message: '删除品牌失败'
    })
  }
}
</script>
<style scoped>
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
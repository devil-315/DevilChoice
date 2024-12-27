<template>
  <div>
     <!-- svg:图标外层容器节点，内部需要与use标签结合使用 -->
      <svg :style="{width,height}">
        <!-- xlink:href执行用哪一个图标，属性值务必为#icon-图标名字 -->
         <!-- use的fill属性可以修改颜色，如果修改不了，把svg图标里面的fill属性删掉 -->
         <use :xlink:href="prefix+name" :fill="color"></use>
      </svg>
  </div>
</template>

<script setup lang="ts">
//接收父组件传递的参数
defineProps({
  //xlink:href 属性值的前缀
  prefix: {
    type: String,
    default: '#icon-'
  },
  //提供使用的图标名字
  name: String,
  //接收父组件传递的颜色
  color: {
    type: String,
    default: ''
  },
  //接收父组件传递过来的图标的宽度
  width: {
    type: String,
    default: '16px'
  },
  //接收父组件传递过来的图标的高度
  height: {
    type: String,
    default: '16px'
  }
})
</script>
<style scoped>

</style>
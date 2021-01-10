<template>
<div>
  <div>用户信息</div>
    <ul>
      <li v-for="(item,index) in userList" :key="index">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script>
// 导入 axios包
import axios from 'axios'

export default {
  data () {
    return {
      userList: []
    }
  },
  // created () {
  //   // 1. 使用 axios 异步获取数据
  //   axios.get('http://jsonplaceholder.typicode.com/users')
  //     .then(res => {
  //       this.userList = res.data
  //     })
  //     .catch(err => console.log(err))
  // }

  // 2. 使用 async await 处理异步任务
  async created () {
    // 3. 解构赋值，只需要其中的 data
    const { data } = await axios.get('http://jsonplaceholder.typicode.com/users')
    this.userList = data
  }
}
</script>

<style>
  li {
    list-style: none;
  }
</style>

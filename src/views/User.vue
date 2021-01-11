<template>
  <div>
    <div>用户信息</div>
    <button @click='asc'>升序</button>
    <button @click='desc'>降序</button>
    <button @click='reset'>默认</button>
    <ul>
      <li v-for="(item, index) in userList" :key="index">{{ item.name }}</li>
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
    const { data } = await axios.get(
      'http://jsonplaceholder.typicode.com/users'
    )

    // 用 Proxy 代理用户信息
    this.proxy = new Proxy({}, {
      get (target, prop) {
        if (prop === 'asc') {
          return [].concat(data).sort((a, b) => a.name > b.name ? 1 : -1)
        } else if (prop === 'desc') {
          return [].concat(data).sort((a, b) => b.name > a.name ? 1 : -1)
        } else {
          return data
        }
      }
    })

    this.userList = data
  },
  methods: {
    asc () {
      this.userList = this.proxy.asc
    },
    desc () {
      this.userList = this.proxy.desc
    },
    reset () {
      this.userList = this.proxy.reset
    }
  }
}
</script>

<style>
ul{
  padding: 0;
}
li {
  list-style: none;
}
</style>

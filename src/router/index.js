import Vue from 'vue'
import VueRouter from 'vue-router'
import User from '../views/User.vue'
// import Upload from '../views/Upload.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/',
    name: 'User',
    component: User
  }, {
    path: '/upload',
    name: 'Upload',
    // 组件按需加载
    component: () => import('../views/Upload.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

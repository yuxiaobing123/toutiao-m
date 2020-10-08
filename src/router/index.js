import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 导入登录页面的路由
const Login = () => import('@/views/login/Login.vue')
// 导入底部导航栏区域
const TabBar = () => import('@/views/layout/Tabbar.vue')
// 导入底部导航栏的子路由规则
const Home = () => import('@/views/home/Home.vue')
const Question = () => import('@/views/question/Question.vue')
const Video = () => import('@/views/video/Video.vue')
const Profile = () => import('@/views/profile/Profile.vue')
// 导入搜索页面的路由组件
const Search = () => import('@/views/search/Search.vue')
// 导入文章详情的路由组件
const Article = () => import('@/views/article/Article.vue')
// 导入用户的个人资料组件
const UserProfile = () => import('@/views/user-profile/UserProfile.vue')

// 路由表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // 如果父路由 有默认子路由的话 那么他的name 就没有意义了
    // name: 'tabbar',
    component: TabBar,
    children: [
      {
        path: '/', //  默认的子路由规则  只能有一个
        name: 'home',
        component: Home
      },
      {
        path: '/question',
        name: 'question',
        component: Question
      },
      {
        path: '/video',
        name: 'video',
        component: Video
      },
      {
        path: '/profile',
        name: 'profile',
        component: Profile
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: Search
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: Article,
    props: true // 开启路由传参  也就是把路由参数映射到组件的 props 数据中
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: UserProfile
  }
]

const router = new VueRouter({
  routes
})

export default router

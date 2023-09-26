import Vue from 'vue'
import VueRouter from 'vue-router'
import BgLogin from '../views/BgLogin.vue'
import Login from '../views/Login.vue'
import BgIndex from '../views/BgIndex.vue'
import Index from '../views/Index.vue'
import User from '../components/User.vue'
import Category from '../components/Category.vue'
import Label from '../components/Label.vue'
import Article from '../components/Article.vue'
import editArticle from '../components/editArticle.vue'
import ReadArticle from '../views/ReadArticle.vue'
import AddArticle from '../views/AddArticle.vue'
import MyArticleList from '../views/MyArticleList.vue'
import EditArticle from '../views/EditArticle.vue'
import Register from '../views/Register.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/bglogin',
    name: 'bglogin',
    component: BgLogin,
    meta:{
      requireAuth: false,
      requireAuthF: false
     },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta:{
      requireAuth: false,
      requireAuthF: false
     },
  },
  {
    path: '/index',
    name: 'index',
    component: Index,
    meta:{
      requireAuth: false,
      requireAuthF: true
    },
  },
  {
    path: '/readarticle',
    name: 'readarticle',
    component: ReadArticle,
    meta:{
      requireAuth: false,
      requireAuthF: true
     },
  },
  {
    path: '/addarticle',
    name: 'addarticle',
    component: AddArticle,
    meta:{
      requireAuth: false,
      requireAuthF: true
     },
  },
  {
    path: '/myarticlelist',
    name: 'myarticlelist',
    component: MyArticleList,
    meta:{
      requireAuth: false,
      requireAuthF: true
     },
  },
  {
    path: '/editarticle',
    name: 'editarticle',
    component: EditArticle,
    meta:{
      requireAuth: false,
      requireAuthF: true
     },
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta:{
      requireAuth: false,
      requireAuthF: false
     },
  },
  {
    path: '/bgindex',
    name: 'bgindex',
    component: BgIndex,
    meta:{
      requireAuth: false,
      requireAuthF: false
     },
    //子路由
    children:[
      {
        path:'/user',
        component:User,
        meta:{
          requireAuth: true,
          requireAuthF: false
         },
      },
      {
        path:'/article',
        component:Article,
        meta:{
          requireAuth: true,
          requireAuthF: false
         },
      },
      {
        path:'/label',
        component:Label,
        meta:{
          requireAuth: true,
          requireAuthF: false
         },
      },
      {
        path:'/category',
        component:Category,
        meta:{
          requireAuth: true,
          requireAuthF: false
         },
      },
      {
        path:'/editArticle',
        component:editArticle,
        name: "editArticle",
        meta:{
          requireAuth: true,
          requireAuthF: false
         },
      },
    ]
  },
]



const router = new VueRouter({
  routes
})

export default router

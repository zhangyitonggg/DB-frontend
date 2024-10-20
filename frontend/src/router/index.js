/* eslint-disable */
import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/test/',
    name: 'test',
    component: () => import('../views/TestView.vue'),
    meta: {
      requiresAuthed: true,
      title: '测试'
    }
  },
  // 普通用户
  {
    path: '/',
    redirect: '/home/'
  },
  {
    // 登录 + 注册
    path: '/auth/',
    name: 'auth',
    component: () => import('../views/Auth/AuthView.vue'),
    meta: {
      requiresNotAuthed: true,
      title: '登录'
    }
  },
  {
    // 首页
    path: '/home/',
    name: 'home',
    component: () => import('../views/Home/HomeView.vue'),
    meta: {
      requiresAuth: true,
      title: '首页'
    }
  },
  {
    path: '/share/',
    name: 'share',
    component: () => import('../views/Share/ShareView.vue'),
    meta: {
      requiresAuth: true,
      title: '共享资源'
    }
  },
  {
    path: '/center/',
    name: 'center',
    component: () => import('../views/Center/CenterView.vue'),
    meta: {
      requiresAuth: true,
      title: '个人中心'
    }
  }
];

const router = new VueRouter({
  routes, // 这里是路由数组
  mode: 'history'
});

/* eslint-disable no-unused-vars */
router.beforeEach((to, from, next) => {
  store.commit("getUserName");
  store.commit("getToken");
  const name = store.state._user_name_;
  const token = store.state._token_;
  const default_title = '航U邦';
  const title = to.meta == null ? "" : to.meta.title + " - ";
  if (name == null || token == null) {
    localStorage.removeItem('__token__');
    localStorage.removeItem('__user_name__');
    sessionStorage.removeItem('__token__');
    sessionStorage.removeItem('__user_name__');
    store.commit("hidePlatformFrame");
    if (to.matched.some(record => record.meta.requiresAuth)) {
      next({ name: 'login' });
    } else {
      document.title = title + default_title;
      next();
    }
  } else {
    store.commit("showPlatformFrame");
    if (to.matched.some(record => record.meta.requiresNotAuthed)) {
      next({ name: 'home' });
    } else {
      document.title = title + default_title;
      next();
    }
  }
});


export default router;

import Vue from 'vue';
import Router from 'vue-router';
import Storge from '@/utils/storage';
import Auth from '@/tool/auth';

Vue.use(Router);

const organizeParams = (route) => ({ params: Object.assign(route.query, route.params) });

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/login')
    },
    {
      path: '/form-designer',
      name: 'formDesigner',
      component: () => import('./views/form-designer'),
      props: organizeParams
    },
    {
      path: '/wf-designer',
      name: 'wfDesigner',
      component: () => import('./views/wf-designer'),
      props: organizeParams
    },
    {
      path: '/data-mgt',
      name: 'dataMgt',
      component: () => import('./views/data-mgt'),
      props: organizeParams
    }
  ]
});

router.beforeEach((to, from, next) => {

  //登录判断
  if (to.matched.some(record => record.meta.requiresAuth)) {

    var loginPath = {
      path: '/login',
      query: { redirect: to.fullPath }
    };

    var user = Storge.get('user');
    user = user ? JSON.parse(user) : null;

    if (!Auth.isLoggedin() || !user) {
      next(loginPath)
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router;
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const organizeParams = (route) => ({ params: Object.assign(route.query, route.params) });

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/form-designer',
      name: 'formDesigner',
      component: () => import('@/views/app/form-designer'),
      props: organizeParams
    }
  ]
});

export default router;
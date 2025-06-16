import { createRouter, createWebHistory } from 'vue-router';
import ShowDashboard from '@/views/ShowDashboard/ShowDashboard.vue';
const ShowDetails = () => import('@/views/ShowDetails/ShowDetails.vue');
import ErrorPage from '@/views/ErrorPage/ErrorPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'ShowDashboard',
      component: ShowDashboard,
    },
    {
      path: '/shows/:id(\\d+)',
      name: 'ShowDetails',
      component: ShowDetails,
    },
    {
      path: '/error/:code?',
      name: 'Error',
      component: ErrorPage,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/error/404',
    },
  ],
});

export default router;

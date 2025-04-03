import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Main.vue'
import NotFound from '../views/NotFound.vue'
import Login from '../views/Login.vue'
import Register from '@/views/Register.vue'
import ItemMaximized from '../views/ItemMaximized.vue'
import { useUserStore } from '../stores/UserStore.ts'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: "/login",
      component: Login
    },
    {
      path: "/logout",
      name: "logout",
      component: HomeView,
      beforeEnter: (to, from, next) => {
        useUserStore().logout();
        window.location.reload();
        next({ name: 'home' });
      }
    },
    {
     path: "/register",
     component: Register
    },

    { 
      path: "/requirelogin", 
      component: HomeView, 
      meta: { requiresLogin: true } 
    },
    {
      path: "/Item",
      name: "Item",
      component: ItemMaximized,
    },
    {
      path: "/:pathMatch(.*)*", 
      component: NotFound 
    },
  ],
})

// For routes that require the user to be logged in
router.beforeEach((to, from, next) => {
  if (to.meta.requiresLogin && !useUserStore().isAuthenticated()) {
    console.warn("User is not authenticated, redirecting to login");
    next("/login");
  } else {
    next();
  }
});

export default router

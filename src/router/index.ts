import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Main.vue'
import NotFound from '../views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // { 
    //   path: "/login", 
    //   component: Login 
    // },
    // { 
    //   path: "/requirelogin", 
    //   component: Example, 
    //   meta: { requiresLogin: true } 
    // },
    { 
      path: "/:pathMatch(.*)*", 
      component: NotFound 
    },
  ],
})

// For routes that require the user to be logged in
router.beforeEach((to, from, next) => {
  const isAuthenticated = true; //TODO add logic to check if user is authenticated
  if (to.meta.requiresLogin && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router

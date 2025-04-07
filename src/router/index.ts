import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Main.vue'
import NotFound from '../views/NotFound.vue'
import Login from '../views/Login.vue'
import Register from '@/views/Register.vue'
import Profile from '../views/Profile.vue'
import MyAccount from '../views/MyAccount.vue'
import ItemMaximized from '../views/ItemMaximized.vue'
import CreateItem from '@/views/CreateItem.vue'
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
        logout();
        next({ name: 'home' });
      }
    },
    {
     path: "/register",
     component: Register
    },
    {
      path: "/profile",
      component: Profile,
      meta: { requiresLogin: true } 
    },
    {
      path: "/profile/my_account",
      component: MyAccount,
      meta: { requiresLogin: true } 
    },

    { //TODO This is only to test if requiresLogin works, remove it later
      // If any route requires login, implement it the same way as this please
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
      path: "/createlisting",
      name: "CreateListing",
      component: CreateItem,
      meta: { requiresLogin: true } 
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

function logout() {
  useUserStore().logout();
  window.location.reload();
}

export default router

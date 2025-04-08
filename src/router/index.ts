import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Main.vue'
import NotFound from '../views/NotFound.vue'
import Login from '../views/Login.vue'
import Register from '@/views/Register.vue'
import GeoCoding from '@/components/GeoCodingComponent.vue'
import Profile from '../views/Profile.vue'
import MyAccount from '../views/MyAccount.vue'
import ItemMaximized from '../views/ItemMaximized.vue'
import CreateItem from '@/views/CreateItem.vue'
import ChatView from '@/views/ChatView.vue'
import AdminPanelView from '@/views/AdminPanelView.vue'
import { useUserStore } from '../stores/UserStore.ts'
import { isUserAdmin } from '../services/httpService.ts'


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
      path: "/geocoding",
      name: "geocoding",
      component: GeoCoding,
      
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
      path: "/admin",
      name: "admin",
      component: AdminPanelView,
      meta: { requiresAdmin: true }
    },
    {
      path: "/Item",
      name: "Item",
      component: ItemMaximized,
    },
    {
      path: "/chats",
      name: "chats",
      component: ChatView,
      meta: { requiresLogin: true }
    },
    {
      path: "/chats/:chatId",
      name: "chat",
      component: ChatView,
      meta: { requiresLogin: true }
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
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresLogin && !useUserStore().isAuthenticated()) {
    console.warn("User is not authenticated, redirecting to login");
    next("/login");
  } else if (to.meta.requiresAdmin && !await isUserAdmin()) {
    console.warn("User is not admin, redirecting to home");
    const url = "https://i.pinimg.com/originals/44/0f/ba/440fbafa6d3a0b4a673636037b937192.gif";
    window.location.href = url;
    next("/");
  }
   else {
    next();
  }
});


function logout() {
  useUserStore().logout();
  window.location.reload();
}

export default router

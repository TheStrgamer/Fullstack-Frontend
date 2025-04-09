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
import AdminCreateView from '@/views/AdminCreateCategoryView.vue'
import UserAdminComponent from '@/components/admin/UserAdminComponent.vue'
import ListingAdminComponent from '@/components/admin/ListingAdminComponent.vue'
import CategoryAdminComponent from '@/components/admin/CategoryAdminComponent.vue'
import ConfirmDeleteAdminView from '@/views/ConfirmDeleteAdminView.vue'
import AdminUpdateCategoryView from '@/views/AdminUpdateCategoryView.vue'
import AdminUpdateUserView from '@/views/AdminUpdateUserView.vue'
import NuhUhView from '@/views/NuhUhView.vue'
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
      path: "/admin",
      name: "admin",
      component: AdminPanelView,
      meta: { requiresAdmin: true },
      children: [      
        {
          path: '',
          name: 'admin-home',
          redirect: '/admin/user'
        },
        {
          path: 'listing',
          name: 'admin-listing',
          component: ListingAdminComponent
        },
        {
          path: 'category',
          name: 'admin-category',
          component: CategoryAdminComponent
        },
        {
          path: 'user',
          name: 'admin-user',
          component: UserAdminComponent
        }
      ]
    },
    {
      path: "/admin/addCategory",
      name: "addCategory",
      component: AdminCreateView,
      meta: { requiresAdmin: true }
    },
    {
      path: "/admin/updateCategory/:categoryId",
      name: "updateCategory",
      component: AdminUpdateCategoryView,
      props: true,
      meta: { requiresAdmin: true }
    },
    {
      path: "/admin/updateUser/:userId",
      name: "updateUser",
      component: AdminUpdateUserView,
      props: true,
      meta: { requiresAdmin: true }
    },
    {
      path: '/confirm-delete/:itemType/:itemId/:extraMessage',
      name: 'ConfirmDelete',
      component: ConfirmDeleteAdminView,
      props: true
    },
    {
      path: "/nuh",
      name: "nuh",
      component: NuhUhView,
      meta: { requiresLogin: true }
    },
    {
      path: "/:pathMatch(.*)*", 
      component: NotFound 
    }
  ],
})

// For routes that require the user to be logged in
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresLogin && !useUserStore().isAuthenticated()) {
    console.warn("User is not authenticated, redirecting to login");
    next("/login");
  } else if (to.meta.requiresAdmin && !await isUserAdmin()) {
    console.warn("User is not admin, redirecting to home");
    next("/nuh");
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

import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/Home"
import Login from "../views/Login.vue"
import ItemDetails from "../views/ItemDetails.vue"
import StoreHome from "../views/StoreHome.vue"
import Dashboard from "../views/Dashboard.vue"
import AddDealStore from "../views/AddDealStore.vue"
import DealListStore from "../views/DealListStore.vue"
import UpdateDeal from "../views/UpdateDeal.vue"
import Cart from "../views/Cart.vue"
import PreferencePage from "../views/PreferencePage.vue"
import DealRedeem from "../views/DealRedeem.vue"
import Map from "../views/Map.vue"
import CommunityCreate from "../views/CommunityCreate.vue"
import PersonalUploads from "../views/PersonalUploads.vue"
import CommunityUpdate from "../views/CommunityUpdate.vue"


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },

  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/questionaire',
    name: 'PreferencePage',
    component: PreferencePage
  },
  {
    path: "/item/:id/", // Assuming you have a route parameter for the item ID
    name: "item-detail",
    component: ItemDetails,

  },
  {
    path: "/communityupdate/:id/", 
    name: "CommunityUpdate",
    component: CommunityUpdate,

  },
  {
    path: "/map",
    name: "map",
    component: Map
  },
  {
    path: "/communitycreate",
    name: "CommunityCreate",
    component: CommunityCreate
  },
  {
    path: "/personaluploads",
    name: "PersonalUploads",
    component: PersonalUploads
  },

  {
    path: "/storehome",
    component: StoreHome,
    children: [
      {
        // Dashboard.vue will be rendered inside StoreHome's <router-view>
        // when /storehome is matched
        path: '',
        name:'Dashboard',
        component: Dashboard,
      },
      {
        path: 'dealaddstore',
        name:'AddDealStore',
        component: AddDealStore,
      },
      {
        path: 'dealliststore',
        name:'DealListStore',
        component: DealListStore,
      },
      {
        path: 'updatedeal/:id',
        name:'UpdateDeal',
        component: UpdateDeal,
      },
      {
        path: 'dealredeem',
        name:'DealRedeem',
        component: DealRedeem,
      }
    ]

  },

]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


export default router;

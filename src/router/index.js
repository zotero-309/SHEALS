import { createRouter, createWebHistory } from "vue-router";
import  Home  from "../views/Home.vue"
import ItemDetails from "../views/ItemDetails.vue"
import Login from "../views/Login.vue"

  const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
      // routes
      {
        path: "/",
        name: "Home",
        component: Home,
      },
      {
        path: "/item/:id", // Assuming you have a route parameter for the item ID
        name: "item-detail",
        component: ItemDetails,
        props: true,
      },
      {
        path: '/login',
        name: 'Login',
        component: Login
      }
    ],
  });


export default router;

import { createRouter, createWebHistory } from "vue-router";


// Import  views using dynamic imports
// Import views using dynamic imports
const HomeView = () =>
  import("../views/HomeView.vue");

const AboutView = () =>
  import("../views/AboutView.vue");

const ItemDetailsView = () =>
  import("../views/ItemDetailsView.vue");




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
        path: "/item/:id/:name/:price/:store/:location", // Assuming you have a route parameter for the item ID
        name: "item-detail",
        component: ItemDetailsView,
        props: true,
    
      },
    ],
  });


export default router;

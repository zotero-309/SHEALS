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
        name: "home",
        component: HomeView,
      },
      {
        path: "/about",
        name: "about",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: AboutView,
      },
      {
        path: "/item/:id/:name/:price/:store/:location", // Assuming you have a route parameter for the item ID
        name: "item-detail",
        component: ItemDetailsView, // Adjust the path accordingly
        },
      ]
  });


export default router;

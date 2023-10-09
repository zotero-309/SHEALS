<template>
    <!-- Header Section Begin -->
    <HeaderSection />
    <!-- Header Section End -->
 
    <ItemDetails />
 
 </template>
 
 <script>
 import HeaderSection from '../components/headerSection.vue';
 import ItemDetails from '../components/itemDetails.vue';
 
 
 export default {
 props: ['id', 'name', 'price', 'store', 'location'],
   // Other component logic...
   components: {
         HeaderSection,
         ItemDetails
     },
 };
 
 </script>
 
 
  
 
    
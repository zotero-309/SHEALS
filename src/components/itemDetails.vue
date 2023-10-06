<!-- ItemDetailsView.vue -->

<template>
    <div>
      <h1>Item Details</h1>
      <p> ID: {{ id }}</p>
      <!-- Fetch and display dynamic content based on the ID -->
    </div>
  </template>
  
  <script>
  export default {
    props: {
      id: String,
      queryId: String,
    },
    mounted() {
      // Fetch and display content based on the id and queryId
      // Example: You might make an API call to get details for the item
      console.log("Fetching details for item ID:", this.id)
    },
  };
  </script>
  
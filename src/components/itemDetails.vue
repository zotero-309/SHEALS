<!-- ItemDetailsView.vue -->
<template>
    <div>
      <h1>Item Details</h1>
      <p> ID: {{ id }}</p>
      <!-- Fetch and display dynamic content based on the ID -->
    </div>
  </section>
</template>

<script>
export default {
  props: ['id', 'name', 'price', 'store', 'location'],
  data() {
    return {
      room: null,
    };
  },
};
</script>

<style scoped>
.customColour {
    color: #E97D2F
}
</style>
 
toggleHeart.vue
<template>
    <div>
      <button @click="toggleHeart" class="heart-button">
        <i :class="{ 'fa': true, 'fa-heart': isHeartSolid, 'fa-heart-o': !isHeartSolid }"></i>
      </button>
    </div>
</template>
  
<script>
  export default {
    data() {
      return {
        isHeartSolid: false,
      };
    },
    methods: {
      toggleHeart() {
        this.isHeartSolid = !this.isHeartSolid;
      },
    },
  };
</script>
  
<style scoped>
  
<template>
   <button @click="openModal" class="filter-button"> 
      <i class="fa fa-sliders custom-size-icon"></i>
      <span>Filter</span>
  </button>
  <div v-if="showModal" class="modal-container">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Filter Modal</h5>
        <button type="button" class="close" @click="closeModal">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>This is the filter content. It can be scrollable if the content is too long.</p>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        showModal: false,
      };
    },
    methods: {
      openModal() {
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add your component-specific styles here */
    /*---------------------
    Modal
    -----------------------*/
    .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    }

    .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
    }

    .modal-content {
    background-color: #fff;
    padding: 20px;
    max-width: 600px;
    width: 100%;
    max-height: 80%;
    overflow-y: auto;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    z-index: 1000; /* Ensure it's above other elements */
    }

    .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
    }
</style>
  
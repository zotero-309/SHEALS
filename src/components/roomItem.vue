<!-- roomItem.vue, receives room details through props which is from roomData --> 
<template>
    <div class="room-box">
        <div class="room-item">
            <img src="img/room/room-1.jpg" alt="">
            <div class="ri-text">
                <h4>{{ room.name }}</h4>
                <h3>${{ room.price }}<span>/Perunit</span></h3>
                <table>
                    <tbody>
                    <tr>
                        <td class="r-o1">Store:</td>
                        <td class="r-o2">{{ room.store }}</td>
                    </tr>
                    <tr>
                        <td class="r-o1">Location:</td>
                        <td class="r-o2">{{ room.location }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="heart-button" @click="toggleHeart">
                <i :class="{ 'fa': true, 'fa-heart': isHeartSolid, 'fa-heart-o': !isHeartSolid }"></i>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      room: Object,
    },
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
    /* Add your component-specific styles here */

    .room-box {
        text-decoration: none;
        border-radius: 15px;
        overflow: hidden;
        display: block;
    }
    .room-item {
        margin-bottom: 30px;
        position: relative;
    }
    .room-item img {
        min-width: 100%;
        border-top-right-radius: 15px;
        border-top-left-radius: 15px;
    }
    .room-item .ri-text {
        border: 1px solid #ebebeb;
        border-top: none;
        border-bottom-right-radius: 15px;
        border-bottom-left-radius: 15px;
        padding: 24px;
    }
    .room-item .ri-text h4 {
        color: #19191a;
        margin-bottom: 10px;
    }
    .room-item .ri-text h3 {
        color: #E97D2F;
        font-weight: 700;
        margin-bottom: 10px;
    }
    .room-item .ri-text h3 span {
        font-family: "Cabin", sans-serif;
        font-size: 14px;
        font-weight: 400;
        color: #19191a;
    }
    .room-item .ri-text table tbody tr td {
        font-size: 16px;
        color: #707079;
        line-height: 20px;
    }
    .room-item .ri-text table tbody tr td.r-o1 {
        width: 80px;
    }
    .room-item .ri-text table tbody tr td.r-o2 {
        max-width: 190px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis; /* add an ellipsis (...) if the text overflows */
        white-space: nowrap; /* prevents the text from wrapping to the next line */
    }

    .heart-button {
    position: absolute;
    top: 15px; /* Adjust the position as needed */
    right: 15px; /* Adjust the position as needed */
    font-size: 30px; /* Increased font size for better visibility */
    z-index: 1; /* Ensure the heart is above the image */
    background: none;
    border: none;
    cursor: pointer;
    
}
.fa-heart {
    -webkit-text-stroke: 0.3x rgb(212, 42, 42); /* Add a red outline */
    color: rgb(212, 42, 42);
}
.fa-heart-o {
    color:white;
}
</style>

  
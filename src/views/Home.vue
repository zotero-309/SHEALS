<template>
    <!-- Header Section Begin -->
    <HeaderSection />
    <!-- Header Section End -->
    <!-- Breadcrumb Section Begin -->
    <div class="breadcrumb-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="breadcrumb-text">
                        <h2>Our Deals</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Breadcrumb Section End -->

    <!-- Rooms Section Begin -->
    <section class="rooms-section">
        <div class="container">
            <div class="row">
				<div v-for="room in rooms" :key="room.id" class="col-lg-4 col-md-6"> 
  					<!-- bind each room object in the rooms array to the room prop of the RoomItem component. -->
    				<RoomItem :room="room" />
  				</div>
            </div>
        </div>
    </section>
    <!-- Rooms Section End -->
</template>

<script>
import HeaderSection from '../components/headerSection.vue';
import RoomItem from '../components/roomItem.vue';
import { rooms } from '../components/roomData.js';

export default {
    components: {
        HeaderSection,
		RoomItem
    },
	data() {
    return {
      rooms: rooms,
    };
  },
};

</script>

<style scoped>
	a {
	text-decoration: none;
	}

</style>
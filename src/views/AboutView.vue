<template>
    <!-- Offcanvas Menu Begin -->



    <!-- Header Section Begin -->
    <HeaderSection />
    <!-- Header Section Begin -->


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
                <RoomList />

                <!-- <div class="col-lg-12">
                    <div class="room-pagination">
                        <a href="#">1</a>
                        <a href="#">2</a>
                        <a href="#">Next <i class="fa fa-long-arrow-right"></i></a>
                    </div>
                </div> -->
            </div>
        </div>
    </section>
    <!-- Rooms Section End -->
</template>


<script>
import HeaderSection from '../components/headerSection.vue';
import RoomList from '../components/roomList.vue';

export default {
    components: {
        HeaderSection,
        RoomList
    },
};

</script>

<style scoped>

</style>
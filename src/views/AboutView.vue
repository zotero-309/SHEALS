<template>
    <!-- Offcanvas Menu Begin -->



    <!-- Header Section Begin -->
    <HeaderSection />
    <!-- Header Section Begin -->

    <!-- Offcanvas Menu Begin -->
    <!-- Offcanvas Menu Overlay -->
    <div class="offcanvas-menu-overlay"></div>
    <!-- Canvas Open Button -->
    <div class="canvas-open">
        <i class="icon_menu"></i>
    </div>
    <!-- Offcanvas Menu Wrapper -->
    <div class="offcanvas-menu-wrapper">
        <!-- Canvas Close Button -->
        <div class="canvas-close">
            <i class="icon_close"></i>
        </div>
        <!-- Search Icon -->
        <div class="search-icon search-switch">
            <i class="icon_search"></i>
        </div>
        <!-- Header Configure Area -->
        <div class="header-configure-area">
            <!-- Profile Option -->
            <div class="profile-option">
                <span class="bk-btn">Profile <i class="fa fa-user"></i></span>
                <!-- Profile Dropdown -->
                <div class="profile-dropdown">
                    <ul>
                        <li><a href="#">Login</a></li>
                        <li><a href="#">Register</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <nav class="mainmenu mobile-menu">
            <ul>
                <li><a href="./bestDeals.html">Best Deals</a></li>
                <li><a href="./bySupermarkets.html">By Supermarkets</a></li>
                <li><a href="./byCommunity.html">By Community</a></li>
            </ul>
        </nav>
        <div id="mobile-menu-wrap"></div>
    </div>
    <!-- Offcanvas Menu Section End -->


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

<style></style>
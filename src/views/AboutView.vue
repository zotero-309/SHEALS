<template>
     <!-- Offcanvas Menu Begin -->
     <!-- ... offcanvas menu code ... -->
    <div class="offcanvas-menu-overlay"></div>
    <div class="canvas-open">
        <i class="icon_menu"></i>
    </div>
    <div class="offcanvas-menu-wrapper">
        <div class="canvas-close">
            <i class="icon_close"></i>
        </div>
        <div class="search-icon search-switch">
            <i class="icon_search"></i>
        </div>
        <div class="header-configure-area">
            <div class="profile-option">
                <span class="bk-btn">Profile <i class="fa fa-user"></i></span>
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

    <!-- Header Section Begin-->
    <header class="header-section header-normal fixed-top">
        <!-- ... header code ... -->
        <div class="top-nav">
            <div class="container">
                <div class="row">
                    <div class="col-lg-6">
                        <ul class="tn-left">
                            <li class="col-lg-2">
                                <a href="./bestDeals.html">
                                    <img src="img/logo.png" alt="">
                                </a>
                            </li>
                            <li>
                                <form action="">
                                    <div class="p-1 bg-light rounded rounded-pill shadow-sm" style="height:40px">
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text border-0 bg-light">
                                                    <button id="button-addon1" type="submit" class="btn btn-link text-primary"><i class="fa fa-search"></i></button>
                                                </span>
                                            </div>
                                            <input type="search" placeholder="Search" aria-describedby="button-addon1" class="form-control border-0 bg-light">
                                            <div class="input-group-append">
                                                <span class="input-group-text border-0 bg-light">
                                                    <button id="button-addon1" type="submit" class="btn btn-link text-primary"><i class="fa fa-search"></i></button>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </li> 
                        </ul>
                    </div>
                    <div class="col-lg-6">
                        <div class="tn-right">
                            <div class="profile-option">
                                <span class="bk-btn">Profile <i class="fa fa-user"></i></span>
                                <div class="profile-dropdown">
                                    <ul>
                                        <li><a href="#">Login</a></li>
                                        <li><a href="#">Register</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="menu-item">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="nav-menu">
                            <nav class="mainmenu">
                                <ul>
                                    <li class="active">
                                        <a href="./bestDeals.html">
                                            <i class="fa fa-money custom-size-icon"></i>
                                            <span>Best Deals</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="./bySupermarkets.html">
                                            <i class="fa fa-shopping-basket custom-size-icon"></i>
                                            <span>By Supermarkets</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="./byCommunity.html">
                                            <i class="fa fa-users custom-size-icon"></i>
                                            <span>By Community</span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                            <FilterModal /> <!-- Filter Modal -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <!-- Header End -->

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
import FilterModal from '../components/filterModal.vue';
import RoomList from '../components/roomList.vue';

export default {
  components: {
    FilterModal,
    // ToggleHeart,
    RoomList
  },
};

</script>

<style>

</style>
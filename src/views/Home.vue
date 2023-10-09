<template>
    <!-- Offcanvas Menu Begin -->



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

    		<!-- Menu Item Section -->
		<div class="menu-item">
			<div class="container">
				<div class="row">
					<div class="col-lg-12">
						<div class="nav-menu">
							<!-- Main Navigation -->
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

						</div>
					</div>
				</div>
			</div>
		</div>

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
import FilterModal from '../components/filterModal.vue';

export default {
    components: {
        HeaderSection,
        RoomList,
        FilterModal
    },
};

</script>

<style scoped>
/* Menu Section */
.menu-item {
	display: flex;
	justify-content: space-between;
	background-color: white;

}

.nav-menu {
	display: flex;
	/* Align menu items in the same row */
}

.mainmenu {
	justify-content: left;
	/* Add space between menu and filter button */
	list-style: none;
	display: flex;
	/* Display list items horizontally */
	margin: 0;
	padding: 0;
}

/* Menu Section: nav menu (left) */
.menu-item .nav-menu {
	text-align: left;
	padding: 10px 0;
}

.menu-item .nav-menu .mainmenu {
	display: flex;
	/* Display list items horizontally */
	margin: 0;
	padding: 0;
}

.menu-item .nav-menu .mainmenu li {
	list-style: none;
	display: inline-block;
	position: relative;
	margin-right: 42px;
}

.menu-item .nav-menu .mainmenu li a {
	font-size: 16px;
	text-decoration: none;
	color: #808080;
	/* Grey color for inactive state */
	font-weight: 500;
	display: grid;
	place-items: center;
	/* Center both horizontally and vertically */
	padding: 10px 0;
	position: relative;
	transition: all 0.3s;
}

.menu-item .nav-menu .mainmenu li a i {
	color: #808080;
	/* Grey color for inactive state */
	margin-bottom: 5px;
	/* Adjust the spacing between icon and text */
}

.menu-item .nav-menu .mainmenu li a:after {
	position: absolute;
	left: 0;
	bottom: 0;
	width: 100%;
	height: 2px;
	background: #E97D2F;
	content: "";
	opacity: 0;
	transition: all 0.3s;
}

.menu-item .nav-menu .mainmenu li.active a,
.menu-item .nav-menu .mainmenu li a:hover {
	color: #000000;
	/* Black color for active or hovered state */
}

.menu-item .nav-menu .mainmenu li.active a i,
.menu-item .nav-menu .mainmenu li a:hover i {
	color: #000000;
	/* Black color for active or hovered state */
}

.menu-item .nav-menu .mainmenu li a:hover:after,
.menu-item .nav-menu .mainmenu li.active a:after {
	opacity: 1;
	background: #E97D2F;
	/* Yellow color for active state */
}

.menu-item .nav-menu i {
	color: #808080;
	/* Grey color for inactive state */
	cursor: pointer;
}

.menu-item .nav-menu .custom-size-icon {
	font-size: 1.4em;
	color: #808080;
	/* Grey color for inactive state */
}

/* End of Menu Section: nav menu (left) */
</style>
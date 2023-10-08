<template>
	<header class="header-section header-normal fixed-top">
		<!-- Top Navigation -->
		<div class="top-nav">
			<div class="container">
				<div class="row">
					<!-- Left Section -->
					<div class="col-lg-6">
						<ul class="tn-left">
							<!-- Logo -->
							<li class="col-lg-2">
								<!-- <a href="../about"> -->
								<router-link to="/about">
									<img src="/img/logo.png" alt="Logo">
								</router-link>
								<!-- </a> -->
							</li>
							<!-- Search Form -->
							<li>
								<form action="">
									<div class="p-1 bg-light rounded rounded-pill shadow-sm" style="height: 40px">
										<div class="input-group">
											<div class="input-group-prepend">
												<span class="input-group-text border-0 bg-light">
													<button id="button-addon1" type="submit"
														class="btn btn-link text-primary">
														<i class="fa fa-search"></i>
													</button>
												</span>
											</div>
											<input type="search" placeholder="Search" aria-describedby="button-addon1"
												class="form-control border-0 bg-light">
											<div class="input-group-append">
												<span class="input-group-text border-0 bg-light">
													<button id="button-addon1" type="submit"
														class="btn btn-link text-primary">
														<i class="fa fa-search"></i>
													</button>
												</span>
											</div>
										</div>
									</div>
								</form>
							</li>
						</ul>
					</div>

					<!-- Right Section -->
					<div class="col-lg-6">
						<div class="tn-right">
							<!-- Checkout Discounts -->
							<a href="#" class="cart">
								<span><i class="fa fa-shopping-cart"></i>Checkout Discounts</span>
							</a>
							<!-- Notifications -->
							<a href="#" class="notification">
								<span><i class="fa fa-bell-o"></i>Notifications</span>
								<span class="badge">3</span>
							</a>
							<!-- Profile Option -->
							<div class="profile-option">
								<span>
									<i class="fa fa-user-o"></i>
									Profile
								</span>
								<!-- Profile Dropdown -->
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
							<!-- Filter Modal Component -->
							<FilterModal />
						</div>
					</div>
				</div>
			</div>
		</div>
	</header>
</template>
  
<script>
// Import the FilterModal component
import FilterModal from './filterModal.vue';

export default {
	components: {
		FilterModal,
	},
};
</script>
  
<style scoped>
/* Add your component-specific styles here */
.header-section .header-normal .menu-item {
	-webkit-box-shadow: 0px 12px 15px rgba(36, 11, 12, 0.05);
	box-shadow: 0px 12px 15px rgba(36, 11, 12, 0.05);
	z-index: 1000;
}

.top-nav {
	border-bottom: 1px solid #e5e5e5;
	background-color: white;
	/* padding-top: 25px; */
}

.top-nav ul {
	margin-bottom: 0;
}

.top-nav .tn-left li {
	list-style: none;
	display: inline-block;
	font-size: 16px;
	color: #19191a;
	font-weight: 500;
	margin-right: 64px;
	position: relative;
	line-height: normal;
	padding: 8px 0px 6px;
}

.top-nav .tn-left li:after {
	position: absolute;
	right: -32px;
	top: 0;
	width: 1px;
	height: 100%;
	background: #e5e5e5;
	content: "";
}

.top-nav .tn-left .fa-search {
	color: #696969;
}


.top-nav .tn-left li #button-addon1 {
	padding: 0px;
}

.top-nav .tn-left li:last-child {
	margin-right: 0;
}

.top-nav .tn-left li:last-child:after {
	display: none;
}

.top-nav .tn-right {
	text-align: right;
}

.top-nav .tn-right .cart {
	padding: 20px 16px;
	position: relative;
	display: inline-block;
	cursor: pointer;
	text-decoration: none;
	color: #393939;
}

.top-nav .tn-right .cart:hover {
	background: rgb(229, 229, 229);
}

.top-nav .tn-right .cart i {
	font-size: large;
	margin-right: 5px;
}

.top-nav .tn-right .notification {
	padding: 20px 25px 20px 16px;
	position: relative;
	display: inline-block;
	cursor: pointer;
	text-decoration: none;
	color: #393939;
}

.top-nav .tn-right .notification:hover {
	background: rgb(229, 229, 229);
}

.top-nav .tn-right .notification i {
	font-size: large;
	margin-right: 5px;
}

.top-nav .tn-right .notification .badge {
	position: absolute;
	top: 5px;
	border-radius: 50%;
	background: red;
	color: white;
}

.top-nav .tn-right .profile-option {
	padding: 20px 16px;
	display: inline-block;
	cursor: pointer;
	position: relative;
	color: #393939;
}

.top-nav .tn-right .profile-option:hover {
	background: rgb(229, 229, 229)
}

.top-nav .tn-right .profile-option i {
	font-size: large;
	margin-right: 1px;
}

.top-nav .tn-right .profile-option:hover .profile-dropdown {
	top: 40px;
	opacity: 1;
	visibility: visible;
}

.top-nav .tn-right .profile-option .profile-dropdown {
	position: absolute;
	left: 0;
	top: 60px;
	width: 93px;
	background: #ffffff;
	display: block;
	padding: 10px 10px;
	-webkit-box-shadow: 0px 9px 10px rgba(25, 25, 26, 0.2);
	box-shadow: 0px 9px 10px rgba(25, 25, 26, 0.2);
	opacity: 0;
	visibility: hidden;
	-webkit-transition: all 0.3s;
	-o-transition: all 0.3s;
	transition: all 0.3s;
	z-index: 99;
}


.top-nav .tn-right .profile-option .profile-dropdown ul{
	padding-left: 7px;
}
.top-nav .tn-right .profile-option .profile-dropdown ul li {
	list-style: none;
	text-align: left;
}

.top-nav .tn-right .profile-option .profile-dropdown ul li a {
	font-size: 14px;
	text-transform: uppercase;
	font-weight: 500;
	text-decoration: none;
	color: #19191a;
	-webkit-transition: all 0.3s;
	-o-transition: all 0.3s;
	transition: all 0.3s;
}

/* orange font colour when hover */
.top-nav .tn-right .profile-option .profile-dropdown ul li a:hover {
	color: #E97D2F;
}

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
  
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
								<router-link :to="{name:'Home'}">
									<img src="img/logo.png" alt="Logo">
								</router-link>
							</li>
							<!-- Search Form -->
							<li>
								<form action="" v-if="$store.state.user">
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
							<a href="#" class="cart" v-if="$store.state.user">
								<span><i class="fa fa-shopping-cart"></i>Checkout Discounts</span>
							</a>
							<router-link :to="{name:'Login'}" v-if="!$store.state.user" class="profile-option">
								<span><i class="fa fa-user-o"></i>Login/Register </span>
							</router-link>
							<!-- Notifications -->
							<!-- <a href="#" class="notification">
								<span><i class="fa fa-bell-o"></i>Notifications</span>
								<span class="badge">3</span>
							</a> -->
							<!-- Profile Option -->
							<div class="profile-option" v-if="$store.state.user">
								<span>
									<i class="fa fa-user-o"></i>
									Profile
								</span>
								<!-- Profile Dropdown -->
								<div class="profile-dropdown">
									<ul>
										<li><span @click="$store.dispatch('logout')">Logout</span></li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>


	</header>
</template>
  
<script>

export default {

};
</script>
  
<style scoped>
/* Add your component-specific styles here */

form {
	padding: 0;
}
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

</style>
  
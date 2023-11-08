<template>
	<!-- mobile view header -->
	<!-- Fixed Header -->
	<header class="mobile-fixed-header">
		<!-- Top Navigation -->
		<div class="container">
			<div class="row">
				<!-- Left Section -->
				<div class="col-10">
					<ul class="tn-left">
						<!-- Logo -->
						<li class="app-icon">
							<router-link :to="{ name: 'Home' }">
								<img src="/img/logo.png" alt="Logo">
							</router-link>
						</li>

						<!-- Search Form -->
						<li>
							<form action="" @submit.prevent="">
								<div class="input-group">
									<div class="input-group-prepend">
										<span class="input-group-text border-0 bg-light">
											<button id="button-addon1" type="submit" class="btn btn-link text-primary">
												<i class="fa fa-search"></i>
											</button>
										</span>
									</div>
									<input type="search" placeholder="Search" aria-describedby="button-addon1"
										class="form-control border-0 bg-light custom-search-input" @input="updateSearch"
										v-model="searchQuery">
								</div>
							</form>
						</li>
					</ul>
				</div>

				<div class="open-menu-icon col-2">
					<div class="tn-right">
						<!-- Open Menu Icon on the Right -->
						<div class="canvas-open" @click="toggleMenu">
							<i class="icon_menu"></i>
						</div>


						<!-- Offcanvas Menu Section -->
						<div class="offcanvas-menu-wrapper" :class="{ 'show-offcanvas-menu-wrapper': isMenuOpen }">
							<!-- Canvas Close Button -->
							<div class="canvas-close" @click="toggleMenu">
								<i class="icon_close"></i>
							</div>

							<!-- Offcanvas Menu Content -->
							<div id="mobile-menu-wrap" class="menu-right">
								<ul class="offcanvas-menu">

									<!-- Profile Option -->
									<!-- <li v-if="$store.state.user">
										<i class="fa fa-user-o"></i>
										<span>Profile</span>
									</li> -->

									<li @click="toggleProfileDropdown">
										<i class="fa fa-user-o"></i>
										<span>Profile </span>
										<i class="fa fa-angle-down" :class="{ 'active': isProfileDropdownOpen }"></i>
									</li>
									<ul v-if="isProfileDropdownOpen">

										<!-- Login/register Tab -->
										<router-link :to="{ name: 'Login' }">
											<li v-if="!$store.state.user">
												<span>Login/Register</span>
											</li>
										</router-link>

										<!-- Preferences -->
										<li>
											<span @click="PreferencePage">Preferences</span>
										</li>

										<!-- Upload Deal -->
										<router-link :to="{ name: 'CommunityCreate' }">
											<li>Upload Deal</li>
										</router-link>
										<!-- Uploaded Deals History -->
										<router-link :to="{ name: 'PersonalUploads' }">
											<li>Deal List</li>
										</router-link>
									</ul>

									<!-- Cart -->
									<li v-if="$store.state.user">
										<router-link :to="{ name: 'Cart' }">
											<!-- Checkout Discounts -->
											<i class="fa fa-shopping-cart"></i>Checkout
											<span>Discounts</span>
										</router-link>
									</li>

									<!-- Home Tab -->
									<li :class="homeActive">
										<router-link :to="{ name: 'Home' }">
											<i class="fa fa-money menu-icon"></i>
											<span>Best Deals</span>
										</router-link>
									</li>

									<!-- Supermarket Tab -->
									<li :class="supermarketActive">
										<router-link :to="{ name: 'SupermarketTab' }">
											<i class="fa fa-shopping-basket menu-icon"></i>
											<span>Supermarkets</span>
										</router-link>
									</li>

									<!-- Community Tab -->
									<li :class="communityActive">
										<router-link :to="{ name: 'CommunityTab' }">
											<i class="fa fa-users menu-icon"></i>
											<span>Community</span>
										</router-link>
									</li>

									<!-- Favourites Tab -->
									<li :class="favActive">
										<router-link :to="{ name: 'FavouritesTab' }">
											<i class="fa fa-heart menu-icon"></i>
											<span>Favourites</span>
										</router-link>
									</li>

									<!-- Logout -->
									<li @click="$store.dispatch('logout')">
										<i class="fa fa-sign-out"></i>
										<span>Logout</span>
									</li>


									<!-- Filter Modal Open -->
									<li>
										<button @click="toggleModal" class="filter-button">
											<i class="fa fa-sliders filter-icon"></i> &nbsp;
											<span>Filter</span>
										</button>
										<div v-if="showModal" class="modal-container"
											:class="{ 'fade-enter-active': showAnimation, 'fade-leave-active': showAnimation }">
											<div class="modal-background" @click="closeModal"></div>
											<div class="modal-content"
												:class="{ 'fade-enter-active': showAnimation, 'fade-leave-active': showAnimation }">
												<div class="modal-header">
													<h4 class="modal-title">Filters</h4>
													<button type="button" class="close" @click="closeModal">
														<span aria-hidden="true">&times;</span>
													</button>
												</div>

												<div class="scrollable-content">
													<!-- price slider -->
													<div class="modal-body fs-5 py-3"> Select your categories:
													</div>

													<!-- category filter -->
													<div class="container-fluid">
														<div class="row">
															<div v-for="cat in categoryList" :key="cat"
																class="categoryFilter col-md-3 my-2">
																<input type="checkbox" :id="cat" :value="cat"
																	v-model="selectedCategories">
																<label
																	:class="{ 'checked': selectedCategories.includes(cat) }"
																	class="categoryBox" :for="cat"
																	:style="{ backgroundImage: 'url(' + getImageUrl(cat) + ')' }">
																	<span class="categoryLabel">{{ cat }}</span>
																</label>
															</div>
														</div>
													</div>

													<div class="modal-body fs-5 py-3"> Select your discount types:
													</div>
													<!-- discount filter -->
													<div class="container-fluid">
														<div class="row">
															<div v-for="discount in discountList" :key="discount"
																class="col-md-4 mb-2">
																<div class="discountFilter">
																	<input type="checkbox" :id="discount" :value="discount"
																		v-model="selectedDiscounts">

																	<label class="btn btn-outline-dark" :for="discount">
																		<i
																			:class="{ 'fa fa-plus': !selectedDiscounts.includes(discount), 'fa fa-check': selectedDiscounts.includes(discount) }"></i>
																		<span class="discount-label"> {{ discount }}
																		</span>
																	</label>
																</div>
															</div>
														</div>
													</div>

													<button class="btn btn-outline-dark my-3 custom-btn-width-L"
														@click="applyFilter">Apply
														Filter</button>
													<button class="btn btn-outline-dark my-3 custom-btn-width-R"
														@click="resetFilter">Clear
														Selection</button>
												</div>
											</div>
										</div>
									</li>

								</ul>
							</div>
						</div>
					</div>
				</div>
				<!-- End of Offcanvas Menu Section -->
				<!-- Off-canvas Menu Overlay -->
				<div class="offcanvas-menu-overlay" :class="{ active: isMenuOpen }" @click="toggleMenu"></div>
			</div>
		</div>
	</header>

	<!-- Header Section Begins -->
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
								<router-link :to="{ name: 'Home' }">
									<img src="/img/logo.png" alt="Logo">
								</router-link>
								<!-- </a> -->
							</li>

							<!-- Search Form -->
							<li>
								<form action="" @submit.prevent="">
									<div class="input-group">
										<div class="input-group-prepend">
											<span class="input-group-text border-0 bg-light">
												<button id="button-addon1" type="submit" class="btn btn-link text-primary">
													<i class="fa fa-search"></i>
												</button>
											</span>
										</div>
										<input type="search" placeholder="Search" aria-describedby="button-addon1"
											class="form-control border-0 bg-light custom-search-input" @input="updateSearch"
											v-model="searchQuery">
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
								<span><i class="fa fa-shopping-cart"></i><router-link :to="{ name: 'Cart' }">Checkout
										Discounts</router-link></span>
							</a>
							<router-link :to="{ name: 'Login' }" v-if="!$store.state.user" class="profile-option">
								<span><i class="fa fa-user-o"></i>Login/Register </span>
							</router-link>

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
										<li><span @click="PreferencePage">Preferences</span></li>
										<router-link :to="{ name: 'CommunityCreate' }">
											<li><span>Upload Deal</span></li>
										</router-link>
										<router-link :to="{ name: 'PersonalUploads' }">
											<li><span>Deal List</span></li>
										</router-link>

									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Menu Item Section -->
		<div class="menu-item"
			v-if="$route.name !== 'Login' && $route.name !== 'PreferencePage' && $route.name !== 'CommunityCreate' && $route.name !== 'PersonalUploads' && $route.name !== 'CommunityUpdate'">
			<div class="container">
				<div class="row">
					<div class="col-lg-12">
						<div class="nav-menu">
							<!-- Main Navigation -->
							<nav class="mainmenu">
								<ul>
									<li :class="homeActive">
										<router-link :to="{ name: 'Home' }">
											<i class="fa fa-money menu-icon"></i>
											<span>Best Deals</span>
										</router-link>
									</li>
									<li :class="supermarketActive">
										<router-link :to="{ name: 'SupermarketTab' }">
											<i class="fa fa-shopping-basket menu-icon"></i>
											<span>By Supermarkets</span>
										</router-link>
									</li>
									<li :class="communityActive">
										<router-link :to="{ name: 'CommunityTab' }">
											<i class="fa fa-users menu-icon"></i>
											<span>By Community</span>
										</router-link>
									</li>
									<li :class="favActive">
										<router-link :to="{ name: 'FavouritesTab' }">
											<i class="fa fa-heart menu-icon"></i>
											<span>Favourites</span>
										</router-link>
									</li>
								</ul>
							</nav>

							<!-- Filter Modal Component -->
							<button @click="toggleModal" class="filter-button">
								<i class="fa fa-sliders filter-icon"></i> &nbsp;
								<span>Filter</span>
							</button>

							<!-- map button (jn) -->
							<router-link to="/map">
								<button class="filter-button">
									<i class="fa fa-map-o map-icon"></i> &nbsp;
									<span>Map</span></button>
							</router-link>

							<!-- Filter Modal Open -->
							<div v-if="showModal" class="modal-container"
								:class="{ 'fade-enter-active': showAnimation, 'fade-leave-active': showAnimation }">
								<div class="modal-background" @click="closeModal"></div>
								<div class="modal-content"
									:class="{ 'fade-enter-active': showAnimation, 'fade-leave-active': showAnimation }">
									<div class="modal-header">
										<h4 class="modal-title">Filters</h4>
										<button type="button" class="close" @click="closeModal">
											<span aria-hidden="true">&times;</span>
										</button>
									</div>

									<div class="scrollable-content">
										<!-- price slider -->
										<div class="modal-body fs-5 py-3"> Select your categories:
										</div>

										<!-- category filter -->
										<div class="container-fluid">
											<div class="row">
												<div v-for="cat in categoryList" :key="cat"
													class="categoryFilter col-md-3 my-2">
													<input type="checkbox" :id="cat" :value="cat"
														v-model="selectedCategories">
													<label :class="{ 'checked': selectedCategories.includes(cat) }"
														class="categoryBox" :for="cat"
														:style="{ backgroundImage: 'url(' + getImageUrl(cat) + ')' }">
														<span class="categoryLabel">{{ cat }}</span>
													</label>
												</div>
											</div>
										</div>

										<div class="modal-body fs-5 py-3"> Select your discount types:
										</div>
										<!-- discount filter -->
										<div class="container-fluid">
											<div class="row">
												<div v-for="discount in discountList" :key="discount" class="col-md-4 mb-2">
													<div class="discountFilter">
														<input type="checkbox" :id="discount" :value="discount"
															v-model="selectedDiscounts">

														<label class="btn btn-outline-dark" :for="discount">
															<i
																:class="{ 'fa fa-plus': !selectedDiscounts.includes(discount), 'fa fa-check': selectedDiscounts.includes(discount) }"></i>
															<span class="discount-label"> {{ discount }}
															</span>
														</label>
													</div>
												</div>
											</div>
										</div>

										<button class="btn btn-outline-dark my-3 custom-btn-width-L"
											@click="applyFilter">Apply
											Filter</button>
										<button class="btn btn-outline-dark my-3 custom-btn-width-R"
											@click="resetFilter">Clear
											Selection</button>
									</div>
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
import router from '../router'
import gsap from 'gsap';


export default {
	emits: ['filter-applied', 'update-search'],

	data() {
		return {
			supermarketActive: "",
			communityActive: "",
			favActive: "",
			homeActive: "",
			isProfileDropdownOpen: false,
			isMenuOpen: false,
			showModal: false,
			showAnimation: false,
			selectedCategories: [],
			selectedDiscounts: [],
			searchQuery: '',
			categoryList: ['Bakery', 'Beer, Wine & Spirits', 'Dairy, Chilled & Eggs', 'Drinks',
				'Food Cupboard', 'Frozen', 'Fruits', 'Meat & Seafood',
				'Pet Supplies', 'Rice, Noodles & Cooking Ingredients',
				'Snacks & Confectionery', 'Vegetables'],
			discountList: ['1 For 1', 'Discounts', 'Bundle Deals'],
		};
	},
	created() {
		this.changeActive()
	},
	methods: {
		changeActive() {
			if (this.$route.name === "Home") {
				this.homeActive = "active"
			} else if (this.$route.name === "SupermarketTab") {
				this.supermarketActive = "active"
			} else if (this.$route.name === "CommunityTab") {
				this.communityActive = "active"
			} else {
				this.favActive = "active"
			}
		},
		// toggleMenu() {
		// 	this.isMenuOpen = !this.isMenuOpen;
		// },
		// openModal() {
		// 	console.log('openModal method is called');
		// 	this.showModal = true;
		// 	this.showAnimation = true;

		// 	setTimeout(() => {
		// 		const modalContainer = document.querySelector('.modal-container');
		// 		console.log('Modal Container:', modalContainer);
		// 		if (modalContainer) {
		// 			gsap.to(modalContainer, { opacity: 1, duration: 0.3 });
		// 		}
		// 	}, 0);
		// },
		//on input triggers from search bar
		toggleMenu() {
			this.isMenuOpen = !this.isMenuOpen;
		},
		toggleProfileDropdown() {
			this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
		},

		updateSearch() {
			try {
				// Ensure that selectedCategories and selectedDiscounts are defined
				if (!this.searchQuery) {
					console.error('Search Query are undefined.');
					return;
				}
				// Emit the event with the captured filter data
				this.$emit('update-search', this.searchQuery);

			} catch (error) {
				console.error('Error in applyFilter:', error);
			}
		},

		toggleModal() {
			this.showModal = !this.showModal;
			this.showAnimation = true;

			// Toggle GSAP animation class
			if (this.showModal) {
				this.$nextTick(() => {
					const modalContainer = document.querySelector('.modal-container');
					if (modalContainer) {
						gsap.to(modalContainer, { opacity: 1, duration: 0.3 });
					}
				})
			} else {
				gsap.to('.modal-container', { opacity: 0, duration: 0.3 });
				gsap.to('.modal-content', { opacity: 0, duration: 0.3 });
			}
		},
		closeModal() {
			this.showModal = false;
		},
		applyFilter() {
			try {
				console.log('Selected Categories:', this.selectedCategories);
				console.log('Selected Discounts:', this.selectedDiscounts);

				// Ensure that selectedCategories and selectedDiscounts are defined
				if (!this.selectedCategories || !this.selectedDiscounts) {
					console.error('Selected categories or discounts are undefined.');
					return;
				}

				this.selectedFilters = {
					selectedCategories: this.selectedCategories.slice(),
					selectedDiscounts: this.selectedDiscounts.slice(),
				};

				console.log('Captured filter in HeaderSection:', this.selectedFilters);

				// Emit the event with the captured filter data
				this.$emit('filter-applied', this.selectedFilters);

				this.closeModal();
			} catch (error) {
				console.error('Error in applyFilter:', error);
			}
		},
		resetFilter() {
			this.selectedCategories = []; // Reset selectedCategories to an empty array
			this.selectedDiscounts = []; // Reset selectedDiscounts to an empty array
		},
		getImageUrl(category) {
			// Remove spaces, commas, and ampersands from the category name
			const sanitizedCategory = category.replace(/[\s, &]+/g, '');
			// Assuming your images are stored in the /img/ directory
			return `/img/${sanitizedCategory}.jpg`;
		},
		PreferencePage() {
			router.push("/questionaire");
		},
	}
}
</script>
  
<style scoped>
/*---------------------
     Off Menu Canvas Style
    -----------------------*/
@media only screen and (min-width: 1300px) {
	.container {
		max-width: 1300;
	}
}

@media only screen and (max-width: 991px) {
	.top-nav {
		display: none;
	}

	.menu-item .nav-menu {
		display: none;
	}


	.offcanvas-menu {
		padding: 20px;
		list-style: none;
	}


	.offcanvas-menu li {
		padding: 10px;
		width: 100%;
		display: flex;
		align-items: center;
		margin-bottom: 20px;
		transition: background-color 0.3s ease;
		/* Add a smooth background color transition */
	}

	.offcanvas-menu i,
	.offcanvas-menu li {
		font-size: 18px;
		color: #393939;
	}


	/* Style your menu items as needed */
	.offcanvas-menu {
		text-decoration: none;
		color: #393939;
		/* Menu item text color */
		font-size: 16px;
		transition: color 0.3s;
		position: relative;
		transition: color 0.3s, background-color 0.3s;
	}

	.offcanvas-menu a::before {
		content: "";
		/* Create a pseudo-element for the underline */
		position: absolute;
		bottom: -5px;
		/* Adjust the distance of the underline from the text */
		left: 0;
		width: 0;
		/* Initially, the underline has no width */
		height: 2px;
		/* Set the height of the underline */
		background-color: #E97D2F;
		/* Color of the underline */
		transition: width 0.3s;
		/* Add a transition for the underline width */
	}


	.offcanvas-menu a:hover::before {
		width: 100%;
		/* Increase the width of the underline on hover */
	}

	.offcanvas-menu a.active {
		background-color: #E97D2F;
		/* Background color for the active menu item */
		color: #ffffff;
		/* Text color for the active menu item */
	}

	.offcanvas-menu a.active::before {
		width: 100%;
		/* Make the underline full width for the active item */
	}


	/* Style for the active off-canvas menu overlay */
	.offcanvas-menu-overlay.active {
		visibility: visible;
	}

	/* Add animation for the off-canvas menu content */
	.offcanvas-menu-wrapper .modal-content {
		opacity: 10;
		transition: opacity 0.3s;
	}

	.menu-icon {
		margin-right: 10px;
	}

	.offcanvas-menu-overlay {
		background: rgba(0, 0, 0, 0.7);
		z-index: 98;
		height: 100%;
		width: 100%;
		visibility: hidden;
		position: fixed;
		top: 0;
		left: 0;
		transition: visibility 0.3s, opacity 0.3s;
	}

	.offcanvas-menu-overlay.active {
		visibility: visible;
	}

	.open-menu-icon {
		padding-top: 12px;
	}

	.canvas-open {
		position: relative;
		font-size: 22px;
		width: 30px;
		height: 30px;
		color: #19191a;
		border: 1px solid #19191a;
		border-radius: 2px;
		line-height: 33px;
		text-align: center;
		z-index: 1000;
		display: inline-block;
		cursor: pointer;
	}

	.offcanvas-menu-wrapper {
		position: fixed;
		left: -300px;
		top: 0;
		width: 250px;
		z-index: 999;
		background: #ffffff;
		text-align: center;
		overflow-y: auto;
		height: 100%;
		opacity: 0;
		visibility: hidden;
		-webkit-transition: all 0.5s;
		-o-transition: all 0.5s;
		transition: all 0.5s;
		padding: 80px 30px 30px 30px;
		display: block;
		z-index: 99;
		/* Updated z-index to be higher when open */
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
		/* Add a subtle box shadow */
	}

	.offcanvas-menu-wrapper .canvas-close {
		font-size: 20px;
		border-radius: 50%;
		text-align: center;
		line-height: 30px;
		cursor: pointer;
		position: absolute;
		right: 10px;
		top: 10px;
	}

	.offcanvas-menu-wrapper .mainmenu {
		display: none;
	}

	.offcanvas-menu-wrapper.show-offcanvas-menu-wrapper {
		left: 0;
		opacity: 1;
		visibility: visible;
	}

	/* filtermodal */

	.modal-content {
		position: fixed;
		max-width: 100%;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		margin: 0;
		border-radius: 0;
	}

}

/* mobile view header */
.mobile-fixed-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0px 0px 5px 0px;
	background-color: #fff;
	/* Set your desired background color */
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 1000;
	/* Set a suitable z-index */
}

.mobile-fixed-header ul {
	padding-left: 0px;
	margin-bottom: auto;

}

.mobile-fixed-header img {
	height: 40px;
	/* Adjust the height to match the search bar */
}

.mobile-fixed-header .input-group {
	display: flex;
}

.mobile-fixed-header .input-group .form-control {
	width: 200px;

}


/* End of Off Menu Canvas Styling */


.scrollable-content {
	max-height: 75vh;
	/* Adjust the height as per your needs */
	overflow-y: auto;
	/* Enable vertical scrolling */
	padding-right: 2px;
	/* Create space for the scrollbar */
}

/* Track styles */
.scrollable-content::-webkit-scrollbar {
	width: 8px;
}

/* Handle styles */
.scrollable-content::-webkit-scrollbar-thumb {
	background: #e0e0e0;
	border-radius: 5px;
}

.input-group .btn {
	position: relative;
	z-index: 0;
}

a,
a:hover {
	text-decoration-line: none;
	color: #393939;
}

/*---------------------
    Header
    -----------------------*/

.header-section {
	font-family: "Cabin", sans-serif;
	font-size: 15px;
}

.header-section .header-normal .menu-item {
	-webkit-box-shadow: 0px 12px 15px rgba(36, 11, 12, 0.05);
	box-shadow: 0px 12px 15px rgba(36, 11, 12, 0.05);
	z-index: 1000;
	display: flex;
	display: block;
}

.top-nav {
	border-bottom: 1px solid #e5e5e5;
	background-color: white;
	/* padding-top: 25px; */
}

.top-nav ul {
	margin-bottom: 0;

}

.tn-left li {
	list-style: none;
	display: inline-block;
	color: #393939;
	font-weight: 500;
	margin-right: 64px;
	position: relative;
	line-height: normal;
	padding: 8px 0px 6px;
}

.tn-left li:after {
	position: absolute;
	right: -32px;
	top: 0;
	width: 1px;
	height: 100%;
	background: #e5e5e5;
	content: "";
}

.tn-left .fa-search {
	color: #696969;
	padding-left: 10px;
}

.input-group span {
	height: 40px;
	border-top-left-radius: 25px;
	border-bottom-left-radius: 25px;

}

.form-control.custom-search-input {
	height: 40px;
	border-radius: 25px;
}

.tn-left li #button-addon1 {
	padding: 0px;
}

.tn-left li:last-child {
	margin-right: 0;
}

.tn-left li:last-child:after {
	display: none;
}

.tn-right {
	text-align: right;
}

.cart {
	padding: 19px 16px;
	position: relative;
	display: inline-block;
	cursor: pointer;
	text-decoration: none;
	color: #393939;
}

.cart:hover {
	background: rgb(229, 229, 229);
}

.cart i {
	font-size: large;
	margin-right: 5px;
}

.profile-option {
	padding: 19px 27px;
	display: inline-block;
	cursor: pointer;
	position: relative;
	color: #393939;
}

.profile-option:hover {
	background: rgb(229, 229, 229)
}

.profile-option i {
	font-size: large;
	margin-right: 1px;
}

.profile-option:hover .profile-dropdown {
	top: 60px;
	opacity: 1;
	visibility: visible;
}

.profile-option .profile-dropdown {
	position: absolute;
	left: 0;
	width: 119px;
	background: #ffffff;
	display: block;
	padding: 10px;
	-webkit-box-shadow: 0px 9px 10px rgba(25, 25, 26, 0.2);
	box-shadow: 0px 9px 10px rgba(25, 25, 26, 0.2);
	opacity: 0;
	visibility: hidden;
	-webkit-transition: all 0.3s;
	-o-transition: all 0.3s;
	transition: all 0.3s;
	z-index: 99;
}

.profile-option .profile-dropdown ul {
	padding: 0;
	/* Remove default padding */
}

.profile-option .profile-dropdown ul li {
	list-style: none;
	text-align: center;
}

.profile-option .profile-dropdown ul li a {
	font-size: 14px;
	text-transform: uppercase;
	font-weight: 500;
	text-decoration: none;
	color: #19191a;
	-webkit-transition: all 0.3s;
	-o-transition: all 0.3s;
	transition: all 0.3s;
}

.profile-option .profile-dropdown ul li:hover {
	color: #E97D2F
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
	padding-top: 4px;
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

	text-decoration: none;
	color: #808080;
	/* Grey color for inactive state */
	font-weight: 500;
	display: grid;
	place-items: center;
	/* Center both horizontally and vertically */
	padding: 8px 0;
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
	color: #393939;
	/* Black color for active or hovered state */
}

.menu-item .nav-menu .mainmenu li.active a i,
.menu-item .nav-menu .mainmenu li a:hover i {
	color: #393939;
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

.menu-item .nav-menu .menu-icon {
	font-size: 1.5em;
	color: #393939;
}


.menu-item .nav-menu .filter-icon {
	font-size: 1.3em;
	color: #393939;
}

.menu-item .nav-menu .map-icon {
	font-size: 1.1em;
	color: #393939;
}

/* End of Menu Section: nav menu (left) */

/*---------------------
    Filter Button
    -----------------------*/
.filter-button {
	font-weight: 500;
	display: flex;
	align-items: center;
	cursor: pointer;
	background-color: #ffffff;
	margin: 10px 10px 0 0;
	margin-left: auto;
	/* Push the filter button to the right */
	border: 1.5px solid #e5e5e5;
	/* Grey border color */
	border-radius: 25px;
	/* Rounded corners */
	height: 50px;
	padding: 15px;

}

.filter-button i {
	color: #393939;
	margin-right: 5px;
	/* Adjust spacing between icon and text */
	padding: 0px;
}

/*---------------------
    Modal
    -----------------------*/

/* Add GSAP animation classes
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
} */

.modal-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(0, 0, 0, 0.3);
	/* Add a semi-transparent background overlay */
	z-index: 999;
	/* Adjust as needed */
}

.modal-background {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	/* Semi-transparent black background */
}

.modal-content {
	position: fixed;
	max-width: 100%;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	margin: 0;
	border-radius: 0;
	background-color: #fff;
	/* Background color for the modal */
	padding: 30px;
	border-radius: 40px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	max-width: 700px;
}

.modal-header {
	display: flex;
	border-bottom: 1px solid #e0e0e0;
}

.close {
	background: none;
	border: none;
	cursor: pointer;
	font-size: 40px;
	color: #393939;
}

/*---------------------
    Inline Checkboxes
    -----------------------*/
.modal-body {
	display: block;
	width: 100%;


}

.modal-body .row {
	margin-bottom: 10px;
}

.categoryFilter {
	margin: 0;
	padding: 0;
}

.categoryFilter input,
.discountFilter input {
	display: none;
}

.categoryFilter .categoryBox:hover {
	transform: scale(1.05);
}

.categoryFilter .categoryBox {
	transition: transform 0.3s ease;
	display: flex;
	position: relative;
	align-items: center;
	justify-content: center;
	border-radius: 10px;
	height: 120px;
	background-size: cover;
	background-position: center;
	text-align: center;
	line-height: 1;
	margin: 0 5px;
	cursor: pointer;
	overflow: hidden;
	/* Hide overflow to make sure overlay doesn't extend beyond the box */

}

.categoryFilter .categoryLabel {
	cursor: pointer;
	color: white;
	font-size: 19px;
	font-weight: 900;
	text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
	display: block;
	position: relative;
	/* Ensure z-index works correctly */
	z-index: 1;
	/* Ensure text appears above the overlay */
	transition: color 0.3s ease;
	/* Add color transition */
}

.categoryFilter .categoryBox.checked .categoryLabel {
	/* hide text when checked */
	display: none;
}

.categoryFilter .categoryBox.checked::after {
	/* Styles for the tick */
	content: '✔';
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 50px;
	color: white;
	position: absolute;
}

.categoryFilter {
	content: '✔';
}

.discountFilter {
	display: inline-block;
}

.container-fluid {
	display: flex;
	flex-wrap: wrap;
	/* Allow wrapping to the next line if there's not enough space */
	justify-content: flex-start;
}

.discountFilter label {
	white-space: nowrap;
	/* Prevent text wrapping */
}

.discountFilter .discount-label {
	margin: 10px;
}

.discountFilter label .fa::before {
	font-size: 18px;
	margin-left: 7px;
	/* spcae between icon and discount text */
	color: #393939;
	/* color of +  */
	display: inline-block;
	/* Ensure inline-block for consistent sizing */
}

/* plus sign to change to white when hover */
.discountFilter label:hover .fa::before {
	color: white;
}


/* style discount button and text after checked */
.discountFilter input:checked+label {
	background-color: rgb(40, 40, 40);
	color: white;
}

/* style tick to be white */
.discountFilter input:checked+label i.fa::before {
	color: white;
}

.custom-btn-width-R,
.custom-btn-width-L {
	transition: transform 0.3s ease;
	/* Add a smooth transition on hover */
}

.custom-btn-width-R:hover,
.custom-btn-width-L:hover {
	transform: scale(1.05);
	/* Increase size on hover for a subtle effect */
}

.custom-btn-width-R {
	width: 48%;
	margin-left: 1%;
}

.custom-btn-width-L {
	background-color: #19191a;
	color: white;
	width: 48%;
	margin-right: 1%;
}
</style>
  
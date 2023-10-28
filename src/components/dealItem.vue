<!-- dealItem.vue, receives deal details through props which is from dealData --> 
<template>
    <!-- Preloader section -->
    <div v-if="loading" id="preloader">
        <div class="loader"></div>
    </div>

    <!-- Deal items section -->
    <div v-for="deal in display_list" :key="deal.id" class="col-6 col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
        <!-- bind each deal object in the array to the deal prop of the dealItem component. -->
        <router-link :to="{ name: 'item-detail', params: { id: deal.id } }">
            <!-- deal box for each deal -->
            <div class="deal-box">
                <div class="deal-item">
                    <!-- Deal image -->
                    <img :src="deal.image" alt="">

                    <!-- Deal information -->
                    <div class="ri-text">
                        <h4>{{ deal.deal_name }}</h4>
                        <h3>${{ deal.deal_price }}<span>/Perunit</span></h3>

                        <!-- Table with store and address information -->
                        <div class="row">
                            <div class="col-3 col-xs-6 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div>Store:</div>
                            </div>
                            <div class="col-9 col-xs-6 col-sm-9 col-md-9 col-lg-9 col-xl-9 info">
                                {{ deal.uploaded_by.name }}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-3 col-xs-6 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div>Address:</div>
                            </div>
                            <div class="col-9 col-xs-6 col-sm-9 col-md-9 col-lg-9 col-xl-9 info">
                                {{ deal.location }}
                            </div>
                        </div>

                        <!-- Heart button for favorites -->
                        <div class="heart-button" @click.prevent="toggleHeart(deal.id)">
                            <i
                                :class="{ 'fa': true, 'fa-heart': isFavourite(deal.id), 'fa-heart-o': !isFavourite(deal.id) }"></i>
                        </div>
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>
  
<script>
//import router from '../router/index.js';  // Import router instance
import { db } from '../firebase/index.js'
import { collection, getDocs } from "firebase/firestore"

export default {
    // Component props and initialization of data
    props: {
        deal: Object,
        deals: Array,
        selectedCategories: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            loading: true, // Display preloader while loading data
            favourites: [], //Initialize favorites as an empty array
            deal_list: [], // Initialize deal_list as an empty array, stores all deals
            display_list: [], //Initialize display_list as empty array, stores filtered or all deals based on categories
        }
    },
    //trigger function to fetch deals when the component is created
    created() {
        this.fetchDeals()
    },
    watch: {
        // Watch for changes in selectedCategories and update display list accordingly
        selectedCategories: {
            handler: 'updateDisplayList',
            immediate: true, // Execute the handler immediately on component creation
            deep: true, // Watch for changes in the array's elements
        },
    },
    methods: {
        // Toggle favorite status for a deal
        toggleHeart(dealBarcode) {
            // Toggle the favorite status for the given item barcode
            const index = this.favourites.indexOf(dealBarcode);
            console.log('Toggle Heart - dealBarcode:', dealBarcode, 'Index:', index);
            if (index === -1) {
                // Add to favorites
                this.favourites.push(dealBarcode);
            } else {
                // Remove from favorites
                this.favourites.splice(index, 1);
            }
            console.log('Updated Favourites:', this.favourites);
        },
        // Check if a deal is in favorites
        isFavourite(dealBarcode) {
            // Check if the item is in favorites
            return this.favourites.includes(dealBarcode);
        },
        // Fetch deals from Firestore
        async fetchDeals() {
            // show preloader before fetching data
            this.loading = true;

            const querySnapshot = await getDocs(collection(db, "deals"));
            const deal_list = [];

            for (const doc of querySnapshot.docs) {
                const obj = doc.data();
                obj['id'] = doc.id;
                deal_list.push(obj);
            }
            this.deal_list = deal_list;  //assign the populated deal_list to the deal_list property of component:
            this.display_list = deal_list; // initially set display_list to all deals
            this.loading = false; // stop preloader

            // Call the method to update the display list based on selected categories after fetching deals
            this.updateDisplayList();
        },
        // Update display list based on selected categories
        async updateDisplayList() {
            // If no categories are selected, show all deals
            if (this.selectedCategories.length === 0) {
                this.display_list = this.deal_list;
            } else {
                // Filter deals based on selected categories
                const filteredDeals = this.deal_list.filter(deal =>
                    this.selectedCategories.includes(deal.product_category)
                );
                this.display_list = filteredDeals;
            }
            console.log('Display List:', this.display_list);
        },

    },
    mounted() {
        console.log(this.deal);
    }
}


</script>
  
<style scoped>
::v-deep a {
    text-decoration: none;
}

.deal-box {
    border-radius: 15px;
    overflow: hidden;
    display: block;
    font-family: "Cabin", sans-serif;
}

.deal-box .deal-item {
    margin-bottom: 30px;
    position: relative;
}

.deal-box .deal-item img {
    min-width: 100%;
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
    max-height: 290px;
    /* Adjust the value to alter img height */
    object-fit: cover;
    /* This property ensures the image retains its aspect ratio while covering the specified height */
}

/* Adjust img styling for smaller and small screens */
@media (max-width: 767.98px) {
    .deal-box .deal-item img {
        max-height: 210px;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
    }
}

/* Adjust img styling for medium and large screens */
@media (min-width: 767) and (max-width: 1199.98px) {
    .deal-box .deal-item img {
        max-height: 250px;
        border-top-right-radius: 15px;
        border-top-left-radius: 15px;
    }
}

/* Styles for deal information */
.deal-item .ri-text {
    border: 1px solid #ebebeb;
    border-top: none;
    border-bottom-right-radius: 15px;
    border-bottom-left-radius: 15px;
    padding: 18px;
}

/* Adjust for deal information style for smaller, small, medium, large screens */
@media (max-width: 1199.98px) {
    .deal-item .ri-text {
        padding: 12px;
    }
}

/* Styles for deal name */
.deal-item .ri-text h4 {
    color: #19191a;
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Adjust deal name fs for smaller and small screens */
@media (max-width: 767.98px) {
    .deal-item .ri-text h4 {
        font-size: 14px;
        margin-bottom: 5px;
    }
}

/* Adjust deal name fs for medium and large screens */
@media (min-width: 768px) and (max-width: 1199.98px) {
    .deal-item .ri-text h4 {
        font-size: 16px;
        margin-bottom: 6px;
    }
}

/* Styles for deal price */
.deal-item .ri-text h3 {
    font-size: 24px;
    color: #E97D2F;
    font-weight: bold;
    margin-bottom: 10px;
}

/* Adjust deal price fs for smaller and small screens */
@media (max-width: 767.98px) {
    .deal-item .ri-text h3 {
        font-size: 16px;
        margin-bottom: 5px;
    }
}

/* Adjust deal name fs for medium and large screens */
@media (min-width: 768px) and (max-width: 1199.98px) {
    .deal-item .ri-text h3 {
        font-size: 20px;
        margin-bottom: 6px;
    }
}


/* Styling for span fs*/
.deal-item .ri-text h3 span {
    font-size: 15px;
    font-weight: 400;
    color: #19191a;
}

/* Adjust span fs for smaller and small screens */
@media (max-width: 767.98px) {
    .deal-item .ri-text h3 span {
        font-size: 10px;
    }
}

/* Adjust span fs for large screens */
@media (min-width: 768px) and (max-width: 1199.98px) {
    .deal-item .ri-text h3 span {
        font-size: 12px;
    }
}

/* Styles for store name and address */
.deal-item .ri-text .row {
    font-size: 15px;
    color: #707079;
    line-height: 20px;
}

/* Adjust store name and address fs for smaller and small screens */
@media (max-width: 767.98px) {
    .deal-item .ri-text .row {
        font-size: 12px;
        line-height: 15px;
    }
}

/* Adjust store name and address fs for medium and large screens */
@media (min-width: 768px) and (max-width: 1199.98px) {
    .deal-item .ri-text .row {
        font-size: 13px;
        line-height: 17px;
    }
}

.deal-item .ri-text .row .info {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Styles for heart button */
.heart-button {
    position: absolute;
    top: 12px;
    /* Adjust the position as needed */
    right: 18px;
    /* Adjust the position as needed */
    font-size: 30px;
    /* Increased font size for better visibility */
    z-index: 1;
    /* Ensure the heart is above the image */
    background: none;
    border: none;
    cursor: pointer;
    transition: transform 0.3s ease-in-out, color 0.3s ease-in-out;
}

/* Adjust for hear button e for smaller, small screens */
@media (max-width: 575.98px) {
    .heart-button {
        top: 10px;
        right: 14px;
        font-size: 22px;
    }
}

/* Adjust for hear button e for medium, large screens */
@media (min-width: 576px) and (max-width: 1199.98px) {
    .heart-button {
        font-size: 25px;
    }
}

/* Styles for heart button on hover */
.heart-button:hover {
    transform: scale(1.2);
}

/* Styles for filled heart icon */
.fa-heart {
    -webkit-text-stroke: 0.3x rgb(212, 42, 42);
    /* Add a red outline */
    color: rgb(212, 42, 42);
}

/* Styles for outline heart icon */
.fa-heart-o {
    color: white;
}
</style>

  
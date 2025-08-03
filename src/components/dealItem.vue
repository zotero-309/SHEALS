<!-- dealItem.vue, receives deal details through props which is from dealData -->
<template>
    <!-- Preloader section -->
    <div v-if="loading" id="preloader">
        <div class="loader"></div>
    </div>

    <!-- Deal items section -->
    <div v-for="deal in display_list" :key="deal.id"
        class="displayDeals col-6 col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
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

                        <!-- store/uploader and address information -->
                        <div class="store">
                            <i class="px-1 fa fa-id-card-o"></i>
                            {{ deal.uploaded_by.name }}
                        </div>
                        <div class="address">
                            <i class="px-2 fa fa-map-marker"></i>
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
        </router-link>
    </div>
</template>

<script>
//import router from '../router/index.js';  // Import router instance
import { db } from '../firebase/index.js'
import { doc, updateDoc, collection, getDocs, getDoc, query, where, documentId } from "firebase/firestore"

export default {
    // Component props and initialization of data
    emits: ['display-list'],
    props: {
        tab: String,
        deal: Object,
        deals: Array,
        selectedFilters: Object,
        searchQuery: {
            type: String,
            default: ''
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
        // Load user favorites before fetching deals
        this.loadFavoritesFromDatabase();
        this.fetchDeals()
    },
    watch: {
        searchQuery: {
            handler: 'updateDisplayList',
        },
        // Watch for changes in selectedFilters
        selectedFilters: {
            handler: 'updateDisplayList',
            immediate: true, // Execute the handler immediately on component creation
            deep: true, // Watch for changes in the array's elements
        },
    },

    methods: {
        // Toggle favorite status for a deal
        async toggleHeart(dealId) {
            // Check if the user is logged in
            if (!this.$store.state.user) {
                // alert("Please log in first to add to favorites.");
                if (confirm("Please log in first to add to favorites.")) {
                    this.$router.push('/login')
                }
                return;
            }
            // Ensure that this.favourites is an array before calling indexOf
            if (!Array.isArray(this.favourites)) {
                this.favourites = [];
            }

            const index = this.favourites.indexOf(dealId);
            console.log('Toggle Heart - dealId:', dealId, 'Index:', index);

            if (index === -1) {
                // Add to favorites
                this.favourites.push(dealId);
            } else {
                // Remove from favorites
                this.favourites.splice(index, 1);
            }

            // Save the favorites to Firebase
            await this.updateFavoritesInDatabase();
            if (this.tab == "favourites") { //change the display by refreshing
                this.$router.go()
            }
        },

        async updateFavoritesInDatabase() {
            // Update favorites in the Firebase user document
            const userId = localStorage.getItem("userID");
            const userDocRef = doc(db, 'users', userId);

            await updateDoc(userDocRef, {
                favorites: this.favourites,
            });
        },
        async loadFavoritesFromDatabase() {
            try {
                const userId = localStorage.getItem("userID");

                if (!userId) {
                    console.error('User ID not found.');
                    return;
                }

                const userDocRef = doc(db, 'users', userId);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();

                    // Ensure that userData.favorites is defined before assigning it
                    this.favourites = userData.favorites || [];
                } else {
                    // If the user document doesn't exist, initialize this.favourites with an empty array
                    this.favourites = [];
                }
            } catch (error) {
                console.error('Error loading favorites:', error);
            }
        },

        // Fetch deals from Firestore
        async fetchDeals() {
            // show preloader before fetching data
            this.loading = true;
            // if (this.tab =="supermarket"){
            //     var querySnapshot = await getDocs(query(collection(db, "deals"), where ("uploaded_by.type","==","store")));
            // } else if ((this.tab =="community")){
            //     var querySnapshot = await getDocs(query(collection(db, "deals"), where ("uploaded_by.type","==","consumer")));
            // } 
            // else if(this.tab == "favourites"){
            //     await this.loadFavoritesFromDatabase()
            //     if (!this.favourites.length == 0){
            //         var querySnapshot = await getDocs(query(collection(db, "deals"), where (documentId(),"in",this.favourites)));
            //     } else {
            //         this.loading = false; // stop preloader
            //         return
            //     }
            // }
            // else {
            //     var querySnapshot = await getDocs(collection(db, "deals"));
            // }

            const deal_list = [
                {
                    id: "deal001",
                    deal_name: "Organic Apples - Buy 1 Get 1 Free",
                    deal_price: 2.50,
                    deal_type: "Discount",
                    deal_description: "Get two packs of fresh organic apples for the price of one.",
                    product_name: "Organic Apples",
                    product_category: "Fruits",
                    uploaded_by: {
                        name: "GreenGrocer Market",
                        type: "store",
                        id: "store001"
                    },
                    location: "Jurong Point",
                    image: "https://example.com/images/apples.jpg",
                    isFavorite: true
                },
                {
                    id: "deal002",
                    deal_name: "Half Price Milk Promo",
                    deal_price: 1.80,
                    deal_type: "Promotion",
                    deal_description: "Enjoy 50% off all full cream milk this weekend.",
                    product_name: "Full Cream Milk",
                    product_category: "Dairy",
                    uploaded_by: {
                        name: "ColdStorage",
                        type: "store",
                        id: "store002"
                    },
                    location: "Tampines Mall",
                    image: "https://example.com/images/milk.jpg",
                    isFavorite: false
                },
                {
                    id: "deal003",
                    deal_name: "Neighbourhood Toy Swap",
                    deal_price: 0.00,
                    deal_type: "Community",
                    deal_description: "Swap or give away kids’ toys in usable condition.",
                    product_name: "Toys",
                    product_category: "Children",
                    uploaded_by: {
                        name: "JaneDoe88",
                        type: "consumer",
                        id: "user003"
                    },
                    location: "Woodlands",
                    image: "https://example.com/images/toys.jpg",
                    isFavorite: true
                },
                {
                    id: "deal004",
                    deal_name: "Clearance: Bread Loaf",
                    deal_price: 1.00,
                    deal_type: "Clearance",
                    deal_description: "Last day shelf bread at clearance price!",
                    product_name: "White Bread",
                    product_category: "Bakery",
                    uploaded_by: {
                        name: "NTUC FairPrice",
                        type: "store",
                        id: "store004"
                    },
                    location: "AMK Hub",
                    image: "https://example.com/images/bread.jpg",
                    isFavorite: false
                }
            ]
                ;

            // for (const doc of querySnapshot.docs) {
            //     const obj = doc.data();
            //     obj['id'] = doc.id;
            //     deal_list.push(obj);
            //     // Check if the deal is a favorite and add its id to the favourites array
            //     if (obj.isFavorite) {
            //         this.favourites.push(obj.id);
            //     }
            // }
            this.deal_list = deal_list;  //assign the populated deal_list to the deal_list property of component:
            this.display_list = deal_list; // initially set display_list to all deals
            this.loading = false; // stop preloader

            // Call the method to update the display list based on selected categories after fetching deals
            this.updateDisplayList();
        },
        async updateDisplayList() {
            // Update deals displayed based on both filters and search query
            let results = this.deal_list;

            // Filter based on selected filters
            if (this.selectedFilters.selectedCategories.length > 0 ||
                this.selectedFilters.selectedDiscounts.length > 0) {
                results = results.filter(deal =>
                    (this.selectedFilters.selectedCategories.length === 0 || this.selectedFilters.selectedCategories.includes(deal.product_category)) &&
                    (this.selectedFilters.selectedDiscounts.length === 0 || this.selectedFilters.selectedDiscounts.includes(deal.deal_type))
                );
            }

            // Further filter based on search query
            console.log('receieved in update display list', this.searchQuery)
            if (this.searchQuery !== "") {
                results = results.filter((deal) =>
                    //ensure case insensitive
                    deal.deal_description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    deal.deal_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    deal.deal_type.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    deal.product_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    deal.product_category.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }

            this.display_list = results;
            console.log('Updated Filtered and Searched Display List:', this.display_list);

            this.$emit('display-list', this.display_list);
        },
        // Check if a deal is in favorites
        isFavourite(dealId) {
            // Check if this.favourites is an array and not null or undefined
            if (Array.isArray(this.favourites) && this.favourites.length > 0) {
                // Check if the item is in favourites
                return this.favourites.includes(dealId);
            } else {
                // If this.favourites is not an array or is empty, return false
                return false;
            }
        },
    },

    mounted() {
        console.log(this.deal);
    },
}


</script>

<style scoped>
::v-deep a {
    text-decoration: none;
}

/* STYLE FOR DEALITEM BOX */
.deal-box {
    border-radius: 15px;
    overflow: hidden;
    display: block;
    font-family: "Cabin", sans-serif;
    margin-bottom: 20px;
}

.deal-box .deal-item {
    position: relative;
}

/* STYLE FOR DEALITEM IMG */
.deal-box .deal-item img {
    min-width: 100%;
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
    max-height: 290px;
    /* Adjust the value to alter img height */
    object-fit: cover;
    /* This property ensures the image retains its aspect ratio while covering the specified height */
}

/* STYLE FOR DEAL INFORMATION */
.deal-item .ri-text {
    border: 1px solid #ebebeb;
    border-top: none;
    border-bottom-right-radius: 15px;
    border-bottom-left-radius: 15px;
    padding: 10px;
}

/* STYLE FOR DEALNAME */
.deal-item .ri-text h4 {
    color: #393939;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}


/* STYLE FOR DEAL PRICE BOX */
.deal-item .ri-text h3 {
    font-size: 20px;
    color: #E97D2F;
    font-weight: bold;
    margin-bottom: 6px;
}

/* STYLE FOR 'perunit' TEXT */
.deal-item .ri-text h3 span {
    font-size: 14px;
    font-weight: 400;
    color: #19191a;
}

/* STYLE FOR STORE NAME, ADDRESS */
.deal-item .ri-text .store,
.deal-item .ri-text .address {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    color: #707079;
    line-height: 25px;
}

/* STYLE FOR HEART BUTTON */
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

/* STYLE FOR HEARTBUTTON HOVER */
.heart-button:hover {
    transform: scale(1.2);
}

/* STYLE FOR FILLED HEART ICON */
.fa-heart {
    -webkit-text-stroke: 0.3x rgb(212, 42, 42);
    /* Add a red outline */
    color: rgb(212, 42, 42);
}

/* STYLE FOR HEART ICON OUTLINE */
.fa-heart-o {
    color: white;
}

@media (max-width: 575.98px) {
    .heart-button {
        top: 10px;
        right: 14px;
        font-size: 22px;
    }
}

@media (min-width: 576px) and (max-width: 1199.98px) {
    .heart-button {
        font-size: 25px;
    }
}

/* Adjust spacing between dealitems for smaller and small screens */
@media (max-width: 767.98px) {
    .displayDeals {
        padding: 4px;
    }

    .deal-box {
        border-radius: 2px;
        margin-bottom: 0px;
    }

    .deal-box .deal-item img {
        max-height: 220px;
        border-top-right-radius: 15px;
        border-top-left-radius: 15px;
    }

    .deal-item .ri-text h4 {
        font-size: 14px;
        margin-bottom: 5px;
    }

    .deal-item .ri-text h3 {
        font-size: 18px;
        margin-bottom: 5px;
    }

    .deal-item .ri-text h3 span {
        font-size: 12px;
    }

    .deal-item .ri-text .store,
    .deal-item .ri-text .address {
        font-size: 12px;
        line-height: 18px;
    }
}

/* Adjust spacing between dealitems for medium and large screens */
@media (min-width: 767px) and (max-width: 1199.98px) {
    .displayDeals {
        padding: 4px;
    }

    .deal-box {
        border-radius: 2px;
        margin-bottom: 0px;
    }

    .deal-box .deal-item img {
        max-height: 220px;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
    }

    .deal-item .ri-text h4 {
        font-size: 15px;
        margin-bottom: 5px;
    }

    .deal-item .ri-text h3 {
        font-size: 19px;
        margin-bottom: 5px;
    }

    .deal-item .ri-text h3 span {
        font-size: 13px;
    }

    .deal-item .ri-text .store,
    .deal-item .ri-text .address {
        font-size: 13px;
        line-height: 20px;
    }
}

@media (min-width: 1200px) {
    .deal-item .ri-text h4 {
        font-size: 16px;
        margin-bottom: 8px;
    }
}
</style>
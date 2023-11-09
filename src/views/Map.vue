<template>
    <!-- Header Section Begin -->
    <HeaderSection @filter-applied="handleFilterApplied"/> <!-- listen for filterApplied event which is triggered from clicking apply filter button-->
    
    <!-- Header Section Begin -->
    <!-- Breadcrumb Section Begin -->
    <div class="breadcrumb-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-6"> 
                    <section class='ui two column centered grid' style='position:relative;z-index:1;'>
                        
                        <div class="column">
                            <form class='ui segment large form'>
                                <div class='ui message red' v-show='error'>{{error}}</div> 
                                <div class='ui segment'>

                                    <div class='field'>
                                        <div class='ui right icon input large' :class="{loading:spinner}">
                                            <!-- address -->
                                            <input type='text' placeholder='Your address' v-model='address' ref='autocomplete'/>
                                            <i class='dot circle link icon' @click='locatorButtonPressed'></i>                             
                                        </div>
                                    </div> 

                                    <!-- input distance -->
                                    <label for="distance" class="form-label">Find deals within:</label> <span>{{uDistance}} m</span>
                                    <input type="range" class="form-range" id='uDistance' v-model="uDistance" min="0" max="22000" @change="updateMarkersByDistance" >

                                    <!-- using saved home address -->
                                    <div>
                                        <button type="button" class="btn btn-outline-dark" @click="getPreferenceLocation">Use Saved Home Address</button>
                                    </div>
                                    
                                </div>
                            </form>
                        </div>

                    </section>
                    
                    <GoogleMap
                    api-key="AIzaSyARP7DsCDu5upKNyx_UpYUlcM4WkMhA6iU"
                    style="width: 100%; height: 500px"
                    mapTypeId="terrain"
                    :center="center"
                    :zoom="14">
                        <MarkerCluster >
                            <Marker v-for="(location, i) in locations" :options="{ position: location }" :key="location.id || i">
                                <InfoWindow :key="location.id || i">
                                    <div id="content">
                                        {{infowindow[i]}}
                                    </div>
                                </InfoWindow>
                            </Marker>
                        </MarkerCluster>
                        
                    </GoogleMap>

                </div>

                <div class="col-lg-6">
                    <div class="breadcrumb-text">
                        <h2>Our Deals</h2>
                    </div>
                     <!-- deals Section Begin -->
                    <section class="deals-section">
                        <div class="container">
                            <div class="row">
                                <div>{{deals_msg}}</div>
                                <!-- <DealItem  :selectedFilters="selectedFilters" @display-list="getDisplayList" /> -->
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
                                                    <h3>${{ deal.deal_price }}<span>/Per unit</span></h3>

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
                            </div>
                        </div>
                    </section>
                    <!-- deals Section End -->
                </div>

            </div>
        </div>
    </div>
    <!-- Breadcrumb Section End -->


</template>


<script>
    import HeaderSection from '../components/headerSection.vue';
    // import DealItem from '../components/dealItem.vue';
    import { ref, watch } from 'vue'; 
    import { GoogleMap, Marker, MarkerCluster, CustomMarker , InfoWindow} from "vue3-google-map";
    import { db } from '../firebase/index.js'
    import { doc, updateDoc, collection, getDocs, getDoc, query, where, documentId } from "firebase/firestore"
    import router from '../router'
    import gsap from 'gsap'


    export default {

        components: {
            HeaderSection,
            // DealItem,

            GoogleMap,
            Marker, 
            MarkerCluster,
            CustomMarker,
            InfoWindow
        },

        data() {
            return {
                //headerSection
                supermarketActive: "",
                communityActive:"",
                favActive:"",
                homeActive: "",
                mapActive:"",
                
                // isMenuOpen: false,
                // showAnimation: false,

                
                showModal: false, // for filter function
                selectedCategories: [],
                selectedDiscounts: [],
                searchQuery: '',
                categoryList: ['Bakery', 'Beer, Wine & Spirits', 'Dairy, Chilled & Eggs', 'Drinks',
                    'Food Cupboard', 'Frozen', 'Fruits', 'Meat & Seafood',
                    'Pet Supplies', 'Rice, Noodles & Cooking Ingredients',
                    'Snacks & Confectionery', 'Vegetables'],
                discountList: ['1 For 1', 'Discounts', 'Bundle Deals'],

                //deals
                loading: true, // Display preloader while loading data
                favourites: [], //Initialize favorites as an empty array
                deal_list: [], // Initialize deal_list as an empty array, stores all deals
                display_list: [], //Initialize display_list as empty array, stores filtered or all deals based on categories
                selectedFilters: {
                    selectedCategories: [],
                    selectedDiscounts: [],
                },
                deals_msg: '',

                //map
                prefLocation: '',
                address: '',
                error: '',
                spinner: false,
                deal_address_coords: "",
                center:{ lat: 1.3548, lng: 103.9579 },
                reRender: 1,
                locations:[],
                ulat: '',
                ulng: '',
                uDistance: '',
                orilocations: [], // keep track of all or prev deals
                applyDistance: false, // use to call method to filter display_list after distance input received
                infowindow: []
            }
        },
        //trigger function to fetch deals when the component is created
        created() {
            //header
            this.changeActive()
		    this.fetchcategories()

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
            applyDistance: {
                handler: 'updateDisplayList',
                immediate: true, // Execute the handler immediately on component creation
                deep: true, // Watch for changes in the array's elements
            }
        },

        mounted() {
            
            // autocomplete function
            let autocomplete = new google.maps.places.Autocomplete(this.$refs['autocomplete'], {
                bounds: new google.maps.LatLngBounds(
                    // set bounds to sg
                    new google.maps.LatLng(1.352083, 103.819836)
                )
            });

            //event listener
            autocomplete.addListener("place_changed", () => {
                let place = autocomplete.getPlace();
                // console.log(place);
                this.address = place.formatted_address;
                let autolocation = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
                // console.log(this.center)
                
                // console.log(this.center)
                // console.log(this.orilocations)
                this.removeLocator()
                this.resetLocationsToOriginal()
                this.applyDistance = false
                this.locations.push(autolocation);
                this.center = autolocation
                // console.log(this.center)
                this.uDistance = 0
            });

            // load user location 
            this.locatorButtonPressed();

        },
 

        methods: {
        //headerSection
            async fetchcategories(){

                if (localStorage.getItem("userID")){
                    const userDoc = await getDoc(doc(db, "users", localStorage.getItem("userID")))
                    //check if user doc exist
                    if (userDoc.exists()){
                        var user_rec = userDoc.data()

                        //check if there is category array first
                        if (user_rec.catpref){
                            for (var cat of user_rec.catpref){
                                this.selectedCategories.push(cat)
                            }
                        }

                        if (user_rec.dealpref){
                            for (var deal of user_rec.dealpref){
                                this.selectedDiscounts.push(deal)	
                        }

                        }
                    }
                }
                this.applyFilter()
            },
            changeActive(){
                if(this.$route.name==="Home"){
                    this.homeActive = "active"
                } else if (this.$route.name==="SupermarketTab"){
                    this.supermarketActive = "active"
                } else if(this.$route.name==="CommunityTab"){
                    this.communityActive = "active"

                } else if(this.$route.name==="map"){
                    this.mapActive = "active"
                } else {
                    this.favActive = "active"
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

        //deals

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
                if (this.tab == "favourites"){ //change the display by refreshing
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
                if (this.tab =="supermarket"){
                    var querySnapshot = await getDocs(query(collection(db, "deals"), where ("uploaded_by.type","==","store")));
                } else if ((this.tab =="community")){
                    var querySnapshot = await getDocs(query(collection(db, "deals"), where ("uploaded_by.type","==","consumer")));
                } 
                else if(this.tab == "favourites"){
                    await this.loadFavoritesFromDatabase()
                    if (!this.favourites.length == 0){
                        var querySnapshot = await getDocs(query(collection(db, "deals"), where (documentId(),"in",this.favourites)));
                    } else {
                        this.loading = false; // stop preloader
                        return
                    }
                }
                else {
                    var querySnapshot = await getDocs(collection(db, "deals"));
                }

                const deal_list = [];

                for (const doc of querySnapshot.docs) {
                    const obj = doc.data();
                    obj['id'] = doc.id;
                    deal_list.push(obj);
                    // Check if the deal is a favorite and add its id to the favourites array
                    if (obj.isFavorite) {
                        this.favourites.push(obj.id);
                    }
                }
                this.deal_list = deal_list;  //assign the populated deal_list to the deal_list property of component:
                this.display_list = deal_list; // initially set display_list to all deals
                this.loading = false; // stop preloader
                
                this.getDealList(this.deal_list)
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
                
                if(this.applyDistance) {
                    console.log("working")
                    // this.resetLocationsToOriginal()
                    for (let latlng of this.locations) {
                        results = results.filter((deal) =>
                        
                        this.orilocations.includes(
                            this.getlatlng(deal.location).then(coords => {
            
                                console.log(coords);
                            }).catch(error => {
                            
                                console.error('Error fetching coordinates:', error);
                            })
                        )

                    );
                    }
                    results = results.filter((deal) =>
                        
                        this.orilocations.includes(
                            this.getlatlng(deal.location).then(coords => {
            
                                console.log(coords);
                            }).catch(error => {
                            
                                console.error('Error fetching coordinates:', error);
                            })
                        )

                    );
                    
                }

                this.display_list = results;

                this.getDisplayList (this.display_list)
                console.log('Updated Filtered and Searched Display List:', this.display_list);

                this.$emit('display-list', this.display_list);
            },

            getlatlng(addr) {
                // Return the promise from axios.get
                return axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
                params: {
                    key: "AIzaSyARP7DsCDu5upKNyx_UpYUlcM4WkMhA6iU",
                    address: addr
                }
                }).then(response => {
                if (response.data.error_message) {
                    this.error = response.data.error_message;
                    console.log(response.data.error_message);
                    throw new Error(response.data.error_message); // Throw an error to handle it in the catch block
                } else {
                    let address_coords = response.data.results[0].geometry.location;
                    return { lat: address_coords.lat, lng: address_coords.lng }; // Return the coordinates
                }
                }).catch(error => {
                // Handle any errors that occur during the HTTP request
                console.error('Error fetching coordinates:', error);
                throw error; // Re-throw the error to handle it where getlatlng is called
                });
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


        // maps 
            handleFilterApplied(selectedFilters) {
                // console.log('Selected Categories in AboutView:', selectedCategories);
                this.selectedFilters = selectedFilters;
                // this.getDisplayList(this.display_list); // Wait for display_list to be updated
                this.reRender = 0
                this.locatorButtonPressed()
                // console.log("map receives", this.selectedFilters);

            },
            removeLocator() {
                // If got previous locator, remove it
                if (this.center) {
                    let index = this.locations.findIndex(autoaddr => 
                        autoaddr.lat === this.center.lat && autoaddr.lng === this.center.lng
                    );
                    if (index > -1) {
                        this.locations.splice(index, 1);
                        // console.log('remove',this.center)
                    }
                }           
            },
            resetLocationsToOriginal() {
                // Ensure that orilocations is a copy of the original data
                // to duplicate orilocations into locations
                this.locations = []
                for (let addr of this.orilocations) {
                    this.locations.push(addr)
                }       
            },
            getPreferenceLocation() {
                // retrieve user's saved home address and plot it in map
                this.prefLocation = localStorage.getItem('homeAddress')
                this.applyDistance = false
                if (!this.prefLocation) {
                    if (confirm("Please log in first to access saved home address.")) {
                        this.$router.push('/login')
                    }                     

                } else {
                    // console.log(this.prefLocation)
                    this.address = this.prefLocation
                    this.resetLocationsToOriginal()
                    axios.get("https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyARP7DsCDu5upKNyx_UpYUlcM4WkMhA6iU&address=" + this.address)
                        .then(response => {
                            if (response.data.error_message) {
                                this.error = response.data.error_message;
                                console.log(response.data.error_message);
                            } else {
                                let address_coords = response.data.results[0].geometry.location;
                                this.removeLocator()
                                this.center = { lat: address_coords.lat, lng: address_coords.lng }
                                console.log(this.center)
                                this.locations.push(this.center);
                                this.uDistance = 0                          
                            }                             
                        })
                }
            },
            getDealList (value) {
                // plotting the deals in the map
                
                
                this.orilocations = []
                
    
                // this.display_list = value
                // console.log(this.display_list)

                //inserts the lon and lat inside displaylist
                for (var rec of value){
                    let deal_address = rec.location
                    // console.log(deal_address)
                    axios.get("https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyARP7DsCDu5upKNyx_UpYUlcM4WkMhA6iU&address=" + deal_address)
                    .then(response => {
                        if (response.data.error_message) {
                            this.error = response.data.error_message;
                            console.log(response.data.error_message);
                        } else {
                            let deal_address_coords = response.data.results[0].geometry.location;
                            rec['lat'] = deal_address_coords.lat
                            rec['lon'] = deal_address_coords.lng
                            
                            
                            this.orilocations.push({ lat: rec.lat, lng: rec.lon })
                        }
                              
                    })
                }
       
                console.log(this.orilocations)

            },

            async getDisplayList (value) {
                // plotting the deals in the map
                
                this.locations = []
                this.orilocations = []
                this.infowindow = []
    
                // this.display_list = value
                // console.log(this.display_list)

                //inserts the lon and lat inside displaylist
                for (var rec of value){
                    let deal_address = rec.location
                    // console.log(deal_address)
                    await axios.get("https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyARP7DsCDu5upKNyx_UpYUlcM4WkMhA6iU&address=" + deal_address)
                    .then(response => {
                        if (response.data.error_message) {
                            this.error = response.data.error_message;
                            console.log(response.data.error_message);
                        } else {
                            let deal_address_coords = response.data.results[0].geometry.location;
                            rec['lat'] = deal_address_coords.lat
                            rec['lon'] = deal_address_coords.lng
                            
                            this.locations.push({ lat: rec.lat, lng: rec.lon });
                            this.orilocations.push({ lat: rec.lat, lng: rec.lon })
                            this.infowindow.push(rec.uploaded_by.name)
                        }
                              
                    })
                }
                console.log(this.locations)
                console.log(this.orilocations)
                console.log(this.infowindow)

            },

            applyDistanceToDisplayList() {
                // to call updateDisplayList to filter display_list based on distance input
                console.log(1)
                this.applyDistance = true
            },
       
            updateMarkersByDistance () {
                // to update markers based on distance input

                // console.log('start')
                // console.log(this.locations.length)
                // console.log(this.locations)
                // console.log(this.uDistance)
                // console.log(this.center)
                this.resetLocationsToOriginal()
                let userPosition = new google.maps.LatLng(this.center.lat,this.center.lng)
                
                let newlocations = []
                for (let addr of this.orilocations) {

                    // console.log(addr)
                    let position = new google.maps.LatLng(addr.lat, addr.lng)
                    try {
                        let cdistance = google.maps.geometry.spherical.computeDistanceBetween(userPosition,position);
                        // console.log(cdistance)
                        if (cdistance <= this.uDistance && cdistance !== 0) {
                            newlocations.push(addr)
                            
                        }
                        // if (cdistance < this.uDistance && !newlocations.includes(addr) ) {
                        //     newlocations.push(addr)
                        // }
                    } catch (error) {
                        // Handle any potential errors here...
                        console.error('Error calculating distance:', error);
                    }
                    // }
                }
                this.applyDistanceToDisplayList()
                newlocations.push(this.center)
                if (newlocations.length === 1) {
                    alert(`There is no deals within ${this.uDistance}m of your address.`);
                }
                
                this.locations = newlocations
            },


            locatorButtonPressed() {

                this.spinner = true;
                this.uDistance = 0
                
                this.resetLocationsToOriginal()
                this.applyDistance = false

                if (navigator.geolocation) {
                    // check whether user browser supports geolocation API
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            this.getAddressFrom(position.coords.latitude, position.coords.longitude);
                            this.ulat = position.coords.latitude
                            console.log(this.ulat)
                            this.ulng = position.coords.longitude

                            this.removeLocator()
                            
                            this.center = {lat: this.ulat, lng: this.ulng}
                            this.locations.push({ lat: this.ulat, lng: this.ulng });
                            
                            // if (this.uDistance > 0) {
                            //     this.updateMarkersByDistance()
                            // }
                            
                        },
                        error => {
                            this.error = "Locator is unable to find address. Please type manually.";
                            this.spinner = false;
                        }
                    );

                } else {
                    this.error = error.message;
                    this.spinner = false;
                    console.log("Browser does not support geolocation API");
                }
            },

            getAddressFrom(lat, long) {
                axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=AIzaSyARP7DsCDu5upKNyx_UpYUlcM4WkMhA6iU")
                .then(response => {
                    // if request if fulfilled
                    if (response.data.error_message) {
                        // one more check to ensure no error msg in response obj 
                        // e.g. when api key not valid
                        this.error = response.data.error_message;
                        console.log(response.data.error_message);
                    } else {
                        // given no error, get the results
                        this.address = response.data.results[0].formatted_address;
                        console.log(response.data.results[0].formatted_address);

                        // backup for scis1 plus code
                        if (this.address === '7RXX+2R') {
                            this.address = '80 Stamford Rd, Singapore 178902'
                        }
                        
                    }
                    this.spinner = false;
                })
                .catch(error => {
                    // if request not fulfilled
                    this.error = error.message;
                    console.log(error.message);
                })
            }

        },

    
    }
</script>


<style>
/* <style scoped> */
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
    }/* STYLE FOR HEART BUTTON */
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
/* map */
    .ui.button,
    .dot.circle.link.icon {
        background-color: #ff5a5f;
        color: white;
    }

    #map {
        /* width: 100%; */
        position: absolute;
        top: 0;
        right:50%;
        bottom: 0;
        left: 0;
        background: red;
    }

    /* for autocomplete dropdown list */
    .pac-icon {
        /* get rid of location icon */
        display:none;
    }
    .pac-item {
        padding:10px;
        font-size:16px;
        cursor:pointer;
    }
    .pac-item:hover {
        background-color: #ececec;
    }
    .pac-item-query {
        font-size:16px;
    }
</style>
<style scoped></style>
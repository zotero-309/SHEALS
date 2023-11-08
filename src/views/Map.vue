

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
                                <!-- message gives rounded box -->
                                <div class='ui segment'>
                                    <!-- segment gives rounded box -->
                                    <div class='field'>
                                        <div class='ui right icon input large' :class="{loading:spinner}">
                                            <input type='text' placeholder='Your address' v-model='address' ref='autocomplete'/>
                                            <i class='dot circle link icon' @click='locatorButtonPressed'></i>
                                            <!-- type of icon & how it should be displayed -->
                                        
                                        </div>
                                    </div> 
                                    <!-- <button class='ui button'>Go</button> -->
                                    <label for="distance" class="form-label">Distance</label>
                                    <input type="range" class="form-range" id='uDistance' v-model="uDistance" min="0" max="49000" @change='updateMarkersByDistance'>
                                    
                                    <span>{{uDistance}}</span>
                                
                                    <button type="button" class="btn btn-info" @click="getPreferenceLocation">Saved Home Address</button>
                                    
                                </div>
                            </form>
                        </div>
                    </section>
                    
                    <!-- <section id='map'> -->
                    <GoogleMap
                    api-key="AIzaSyARP7DsCDu5upKNyx_UpYUlcM4WkMhA6iU"
                    style="width: 100%; height: 500px"
                    mapTypeId="terrain"
                    :center="center"
                    :zoom="14">
                        <MarkerCluster >
                            <Marker v-for="(location, i) in locations" :options="{ position: location }" :key="i">
                                <!-- <InfoWindow v-model="infowindow">
                                    <div id="content">
                                        This is the infowindow content
                                    </div>
                                </InfoWindow> -->
                            </Marker>
                        </MarkerCluster>
                        
                        <!-- <CustomMarker v-for="(location, i) in locations" :options="{ position: location, anchorPoint: 'BOTTOM_CENTER' }" :key="i">
                            <div style="text-align: center"> -->
                                <!-- <div style="font-size: 1.125rem">Vuejs Amsterdam</div> -->
                                <!-- <img src="http://maps.gstatic.com/mapfiles/ms2/micons/convienancestore.png" width="50" height="50" style="margin-top: 8px" />
                                <InfoWindow v-model="infowindow">
                                    <div id="content">
                                        This is the infowindow content
                                    </div>
                                </InfoWindow>
                            </div>
                            
                        </CustomMarker> -->
                        
                    </GoogleMap>

                    <!-- </section> -->
                </div>

                <div class="col-lg-6">
                    <div class="breadcrumb-text">
                        <h2>Our Deals</h2>
                    </div>
                     <!-- deals Section Begin -->
                    <section class="deals-section">
                        <div class="container">
                            <div class="row">
                                <DealItem  :selectedFilters="selectedFilters" @display-list="getDisplayList" />
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
    import DealItem from '../components/dealItem.vue';
    import { ref, watch } from 'vue'; 

    import { GoogleMap, Marker, MarkerCluster, CustomMarker , InfoWindow} from "vue3-google-map";


    export default {

        components: {
            HeaderSection,
            DealItem,

            GoogleMap,
            Marker, 
            MarkerCluster,
            CustomMarker,
            InfoWindow
        },

        data() {
            return {
         
                selectedFilters: {
                    selectedCategories: [],
                    selectedDiscounts: [],
                },
                prefLocation: '',

                address: '',
                error: '',
                spinner: false,

                display_list:[], //filtered list based on search

                // markers: {},
                deal_address_coords: "",

                center:{ lat: 1.3548, lng: 103.9579 },
                reRender: 1,
                locations:[],

                ulat: '',
                ulng: '',
                uDistance: '',
                
                // orilocations: '', // keep track of all or prev deals
                // count: 0, // keep track refreshed this.locations
                // keepTrack: []
                oldlocations: []
            }
        },
        mounted() {
            // autocomplete function
            let autocomplete = new google.maps.places.Autocomplete(this.$refs['autocomplete'], {
                bounds: new google.maps.LatLngBounds(
                    new google.maps.LatLng(1.352083, 103.819836)
                )
            });
            //event listener
            autocomplete.addListener("place_changed", () => {
                let place = autocomplete.getPlace();
                // console.log(place);
                this.address = place.formatted_address;
                let autolocation = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
                console.log(this.center)
                
                // if (this.center) {
                //     let index = this.locations.findIndex(autoaddr => 
                //         autoaddr.lat === this.center.lat && autoaddr.lng === this.center.lng
                //     );

                //     if (index > -1) {
                //         this.locations.splice(index, 1);
                //     }
                //     if (this.orilocations.includes(this.center)) {
                //         let index = this.locations.findIndex(autoaddr => 
                //             autoaddr.lat === this.center.lat && autoaddr.lng === this.center.lng
                //         );

                //         if (index > -1) {
                //             this.locations.splice(index, 1);
                //         }
                //     }
                // }
                // this.center = ''
                // console.log(this.center)
                // console.log(this.orilocations)
                // this.locations = this.orilocations
                this.removeLocator()
                this.locations.push(autolocation);
                this.center = autolocation
                console.log(this.center)
                this.uDistance = 0
                
                // this.showUserLocationOnTheMap(place.geometry.location.lat(), place.geometry.location.lng());
            });
            this.locatorButtonPressed();
        },


        methods: {
            handleFilterApplied(selectedFilters) {
                // console.log('Selected Categories in AboutView:', selectedCategories);
                this.selectedFilters = selectedFilters;
                // this.getDisplayList(this.display_list); // Wait for display_list to be updated
                this.reRender = 0
                this.locatorButtonPressed()
                console.log("map receives", this.selectedFilters);

            },
            removeLocator() {
                // If got previous locator, remove it

                if (this.center) {
                    let index = this.locations.findIndex(autoaddr => 
                        autoaddr.lat === this.center.lat && autoaddr.lng === this.center.lng
                    );

                    if (index > -1) {
                        this.locations.splice(index, 1);
                    }

                }
                
            },

            getPreferenceLocation() {
                this.prefLocation = localStorage.getItem('homeAddress')
                console.log(this.prefLocation)
                this.address = this.prefLocation
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
                            // this.locations = this.orilocations 
                        }
                              
                    })
            },

            getDisplayList (value) {
                
                this.locations = []
                this.orilocations = []
                this.keepTrack = []
                this.display_list = value
                console.log(this.display_list)

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
                            
                            this.locations.push({ lat: rec.lat, lng: rec.lon });
                            // if (!this.keepTrack.includes(rec)) {
                            //     this.keepTrack.push({rec: { lat: rec.lat, lng: rec.lon }})
                            // }
                    
                        }
                              
                    })
                }
                console.log(this.locations)
                this.orilocations = this.locations

                
            },

            // to update display_list based on distance input
            // applyDistanceToDisplayList() {

            //     let results = this.display_list;
            //     console.log(this.keepTrack)
            //     for (let deal of this.keepTrack) {
            //         if (!results.includes(deal)) {
            //             let index = results.indexOf(deal)
            //             if (index > -1) {
            //                 results.splice(index, 1);
            //             }
            //         }
            //     }
            //     this.display_list = results
            //     console.log(this.display_list)

            // },

            // to update markers based on distance input
            updateMarkersByDistance () {
                
                // console.log('start')
                // console.log(this.locations.length)
                // console.log(this.locations)
                // console.log(this.uDistance)
                // console.log(this.center)
                let userPosition = new google.maps.LatLng(this.center.lat,this.center.lng)
                
                let newlocations = []
                // this.orilocations = this.locations
                // console.log(this.orilocations)
                for (let addr of this.orilocations) {
                    // if (addr.lat !== this.center.lat || addr.lng === this.center.lng) {
                        // console.log(addr)
                    //     let position = new google.maps.LatLng(addr.lat, addr.lng)
                    //     try {
                    //         let cdistance = google.maps.geometry.spherical.computeDistanceBetween(userPosition,position);
                    //         console.log(cdistance)
                    //         if (cdistance <= this.uDistance) {
                    //             // console.log(newlocations)
                    //             // let index = newlocations.indexOf(addr)
                    //             // let todelete = newlocations.splice(index,1)
                    //             // console.log(todelete)
                    //             newlocations.push(addr)
                    //             console.log(newlocations.length)
                    //             console.log(newlocations)
                    //             // for (let deal of this.keepTrack) {
                    //             //     if (deal.location === addr) {
                    //             //         this.keepTrack
                    //             //     }
                                    
                    //             // }
                                
                    //         }
                    //         // if (cdistance < this.uDistance && !newlocations.includes(addr) ) {
                    //         //     newlocations.push(addr)
                    //         // }
                    //     } catch (error) {
                    //         // Handle any potential errors here...
                    //         console.error('Error calculating distance:', error);
                    //     }
                    // }

                    // if (addr.lat !== this.center.lat || addr.lng === this.center.lng) {
                        console.log(addr)
                        let position = new google.maps.LatLng(addr.lat, addr.lng)
                        try {
                            let cdistance = google.maps.geometry.spherical.computeDistanceBetween(userPosition,position);
                            console.log(cdistance)
                            if (cdistance <= this.uDistance && cdistance !== 0) {
                                // console.log(newlocations)
                                // let index = newlocations.indexOf(addr)
                                // let todelete = newlocations.splice(index,1)
                                // console.log(todelete)
                                newlocations.push(addr)
                                console.log(newlocations.length)
                                console.log(newlocations)
                                // for (let deal of this.keepTrack) {
                                //     if (deal.location === addr) {
                                //         this.keepTrack
                                //     }
                                    
                                // }
                                
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
                // this.applyDistanceToDisplayList()
                newlocations.push(this.center)
                if (newlocations.length === 1) {
                    alert(`There is no deals within ${this.uDistance}m of your address.`);
                }
                
                this.locations = newlocations
            },


            locatorButtonPressed() {

                this.spinner = true;
                this.uDistance = 0
                // this.orilocations = this.locations
                

                if (navigator.geolocation) {
                    // check whether user browser supports geolocation API
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            this.getAddressFrom(position.coords.latitude, position.coords.longitude);
                            // this.showUserLocationOnTheMap(position.coords.latitude, position.coords.longitude);
                            this.ulat = position.coords.latitude
                            console.log(this.ulat)
                            this.ulng = position.coords.longitude

                            this.removeLocator()
                            
                            this.center = {lat: this.ulat, lng: this.ulng}
                            this.locations.push({ lat: this.ulat, lng: this.ulng });
                            // this.orilocations = this.locations
                            
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
            },
            // showUserLocationOnTheMap(latitude, longitude) {
            //     // create map obj
            //     let map = new google.maps.Map(document.getElementById('map'),{
            //         zoom:15,
            //         center: new google.maps.LatLng(latitude,longitude),
            //         // map is centered to user location
            //         mapTypeId: google.maps.MapTypeId.ROADMAP
            //     });

            //     // add marker on map
            //     let userPosition = new google.maps.LatLng(latitude,longitude)
            //     new google.maps.Marker({
                    
            //         position: userPosition,
            //         // tells marker where to be placed on the map
            //         map: map
            //         // tells which map marker should be placed into
            //     })
            //     let i = 0
            //     for( let key in this.markers ) {
            //         let position = new google.maps.LatLng(this.markers[key][0], this.markers[key][1]);
                    
            //         // to display by distance + category
            //         let distance = google.maps.geometry.spherical.computeDistanceBetween(userPosition,position);
            //         // console.log(distance);
            //         // let selectedCat = this.selectedCategories;
            //         // console.log(selectedCat);
            //         // let categories = this.markers[key][2];
            //         // console.log(categories);
            //         // for (let cate of categories) {
            //             // if (distance != 7000 && cate == selectedCat) {
            //         let marker = new google.maps.Marker({
            //             position: position,
            //             map: map,
            //             title: key, 
            //             icon: this.icons.grocery
            //         })
                    

            //         google.maps.event.addListener(marker, 'click', (() => {
            //             return () => {
            //                 let infoWindow = new google.maps.InfoWindow()
            //                 infoWindow.setContent(this.infoWindowContent[i][0]);
            //                 infoWindow.open(map, marker);
            //                 i++
            //             };
            //         })());
                            
            //             // }                      
            //         // }
            //     }
            // },

        },

    
    }
</script>


<style>
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
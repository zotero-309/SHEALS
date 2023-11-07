

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
                                    <input type="range" class="form-range" id='uDistance' value=0 min="0" max="49000" @change='updateMarkersByDistance'>
                                    
                                    <span>{{uDistance}}</span>

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
                                <InfoWindow v-model="infowindow">
                                    <div id="content">
                                        This is the infowindow content
                                    </div>
                                </InfoWindow>
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
                // center_list: 
                // [
                //     { lat: 1.3695402520648914, lng: 103.84844334722357 },
                //     { lat: 1.3505028, lng: 103.8485932 }
                // ],
                // center: { lat: 0, lng: 0 },
                // markerOptions: { position: { lat: 0, lng: 0 }, label: "L", title: "LADY LIBERTY" },
                

                
                selectedFilters: {
                    selectedCategories: [],
                    selectedDiscounts: [],
                },

                address: '',
                error: '',
                spinner: false,

                display_list:[], //filtered list based on search

                // keep track of the stores
                store_list: [], 
                markers: {},
                deal_address_coords: "",

                center:{ lat: 1.3548, lng: 103.9579 },
                reRender: 1,
                locations:[],

                ulat: '',
                ulng: '',
                uDistance: '',
                uindex: '',
                orilocations: '',


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
                let newUlocation = []
                newUlocation.push({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
                for (let autoaddr of this.locations) {
                    if (JSON.stringify(this.center) !== JSON.stringify(autoaddr)) {
                        newUlocation.push(autoaddr)
                    }
                }
                this.locations = newUlocation
                
                
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
            async getDisplayList (value) {
                this.locations = []
                
                //inserts the lon and lat inside displaylist
                for (var rec of value){
                    let deal_address = rec.location
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
                    
                            // this.uDistance = document.getElementById('distance').value
                            // this.uDistance = this.$refs['uDistance']
                            // if (this.uDistance > 0) {
                                
                            //     this.updateMarkersByDistance()
                            // }

                        }
                              
                    })
                }
                console.log(this.locations)
                this.orilocations = this.locations
            },
            
     
            updateMarkersByDistance () {
                
                console.log('start')
                console.log(this.locations.length)
                console.log(this.locations)
                this.uDistance = document.getElementById('uDistance').value
                console.log(this.uDistance)
                let userPosition = new google.maps.LatLng(this.ulat,this.ulng)
                
                
                let newlocations = []
 
                for (let addr of this.orilocations) {
                    
                    // console.log(addr)
                    let position = new google.maps.LatLng(addr.lat, addr.lng)
                    try {
                        let cdistance = google.maps.geometry.spherical.computeDistanceBetween(userPosition,position);
                        console.log(cdistance)
                        if (cdistance <= this.uDistance) {
                            // console.log(newlocations)
                            // let index = newlocations.indexOf(addr)
                            // let todelete = newlocations.splice(index,1)
                            // console.log(todelete)
                            newlocations.push(addr)
                            console.log(newlocations.length)
                            console.log(newlocations)
                        }
                        // if (cdistance < this.uDistance && !newlocations.includes(addr) ) {
                        //     newlocations.push(addr)
                        // }
                    } catch (error) {
                        // Handle any potential errors here...
                        console.error('Error calculating distance:', error);
                    }
                    
                    this.locations = newlocations
                }
                
                
            },

            locatorButtonPressed() {

                this.spinner = true;
                // this.getStores()

                if (navigator.geolocation) {
                    // check whether user browser supports geolocation API
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            this.getAddressFrom(position.coords.latitude, position.coords.longitude);
                            // this.showUserLocationOnTheMap(position.coords.latitude, position.coords.longitude);
                            this.ulat = position.coords.latitude
                            this.ulng = position.coords.longitude
                            this.center = {lat: this.ulat, lng: this.ulng}
                            this.locations.push({ lat: this.ulat, lng: this.ulng });
                            this.uindex = this.locations.indexOf(this.center)
                            // this.uDistance = document.getElementById('distance').value
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
                        // console.log(response.data.results[0].formatted_address);
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
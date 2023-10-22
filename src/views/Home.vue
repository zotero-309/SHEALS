<template>
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

    <!-- Rooms Section Begin -->
    <section class="rooms-section">
        <div class="container">
            <div class="row">
				<div v-for="deal in display_list" :key="deal.id" class="col-lg-3 col-md-6"> 
  					<!-- bind each deal object in the array to the deal prop of the dealItem component. -->
    				<dealItem :deal="deal" />
  				</div>
            </div>
        </div>
    </section>
    <!-- Rooms Section End -->
</template>

<script>
import HeaderSection from '../components/headerSection.vue'
import dealItem from '../components/dealItem.vue'
import  { storage, db } from '../firebase/index.js'
import {collection, getDocs } from "firebase/firestore"
import {ref, getDownloadURL } from "firebase/storage"



export default {
    components: {
        HeaderSection,
		dealItem
    },
	data() {
    return {
      display_list:[],
      deal_list:[]
    };
  },
    //trigger function before mounted
    created() {
        this.getalldeals()
    },
  methods: {
    async getalldeals(){
        const querySnapshot = await getDocs(collection(db, "deals"));
            querySnapshot.forEach(async (doc) => {
            // doc.data() is never undefined for query doc snapshots
            let obj = doc.data()
            //add id in to each list obj
            obj['id'] = doc.id
            //getting image url with func generateImgUrl -> passing id and image name due to storage path
            obj.image = await this.generateImgUrl(obj.id,obj.image,obj.uploaded_by.email)

            //push deal document into list
            this.deal_list.push(obj)
            //two list to differentiate 
            this.display_list = this.deal_list
            });
    },
    async generateImgUrl(dealId,dealImg,uploadEmail) {
            try {
                const url = await getDownloadURL(ref(storage, `deals/${uploadEmail}/${dealId}/${dealImg}`));
                return url;
            } catch (error) {
                console.error("Error fetching image URL:", error);
                return ""; // Return a default value or handle errors gracefully
            }
        }
  }
};

</script>

<style scoped>
	a {
	text-decoration: none;
	}

</style>
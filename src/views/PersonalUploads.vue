<template>
    <HeaderSection />
    <div class="container">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Deal List</h1>
        <form class="form-inline my-2 my-lg-0 col-3" @submit.prevent="">
            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" @input="searchdeal()" v-model="searchTerm" >
        </form>
    </div>
    <div v-if="deletemodal" class="modal-container">
    <div class="modal-background" @click="closeDeleteModal"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title mx-auto">Are you sure you want to delete deal?</h5>
        <button type="button" class="close" @click="closeDeleteModal">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body mx-auto">
        <button type="button" class="btn btn-success d-inline m-2 btnsize" @click="deleteDeal">Yes</button>
        <button type="button" class="btn btn-danger d-inline m-2 btnsize" @click="closeDeleteModal">No</button>
      </div>
    </div>
  </div>


        <table class="table table-striped">
        <thead>
            <tr>
                <th scope="col">Images</th>
                <th scope="col">Deal</th>
                <th scope="col">Type</th>
                <th scope="col">Description</th>
                <th scope="col">Price</th>
                <th scope="col">Qty</th>
                <th scope="col">Food</th>
                <th scope="col">Categories</th>
                <th scope="col">Expiry Date</th>
                <th scope="col">Actions</th>
            </tr>
        </thead>
    <tbody>
        <tr v-for="deal in display_list" :key="deal.id">
            <td scope="col"><img :src="deal.image" alt="" class="dealimg"></td>
            <td scope="col">{{ deal.deal_name }}</td>
            <td scope="col">{{ deal.deal_type }}</td>
            <td scope="col">{{ deal.deal_description }}</td>
            <td scope="col">{{ deal.deal_price }}</td>
            <td scope="col">{{ deal.deal_quantity }}</td>
            <td scope="col">{{ deal.product_name }}</td>
            <td scope="col">{{ deal.product_category }}</td>
            <td scope="col">{{ deal.deal_expiry }}</td>
            <td scope="col">
                <router-link :to="{name:'CommunityUpdate', params: {id: deal.id}}"><img src="../assets/icons/edit.svg" alt="img" class="p-2"></router-link>
                <img src="../assets/icons/delete.svg" alt="img" class="p-2" @click="closeDeleteModal(deal.id)">
            </td>
        </tr>

  </tbody>
</table>  
</div>
  

</template>

<script>
import HeaderSection from '../components/headerSection.vue'
import {collection, query, where, getDocs, deleteDoc, updateDoc, deleteField, doc } from "firebase/firestore"
import  { storage, db } from '../firebase/index.js'
import {ref, getDownloadURL, deleteObject, listAll } from "firebase/storage"

export default {
    components: {
        HeaderSection
    },
    //trigger function before mounted
    created() {
        this.getdeals()
    },
    data(){
        return {
            //initialize deal list
            deal_list: [], //original list
            display_list:[], //filtered list based on search
            deletemodal: false,
            deleteid:null,
            searchTerm:'' //search term
        }
    },
    methods: {
        //on input triggers from search bar
        searchdeal(){
            //returns the list of deals if input is empty
            if (this.searchTerm === ""){
                this.display_list = this.deal_list
            } else {
                this.display_list = this.deal_list.filter((deal)=>
                //ensure case insensitive
                deal.deal_description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                deal.deal_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                deal.deal_type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                deal.product_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                deal.product_category.toLowerCase().includes(this.searchTerm.toLowerCase())
                )
                console.log(this.display_list)
            }

        },
        async deleteDeal(){
            //firebase deletes document but subcollec remains, hence there is a need to delete field
            const deal = doc(db, 'deals', this.deleteid);
            await updateDoc(deal, {
                deal_name: deleteField(),
                deal_price: deleteField(),
                deal_quantity: deleteField(),
                deal_type: deleteField(),
                image: deleteField(),
                location: deleteField(),
                product_category: deleteField(),
                product_name: deleteField(),
                uploaded_by: deleteField()
            })

            //async func to delete document
            await deleteDoc(doc(db, "deals", this.deleteid));

            //clear deal record in storage
            const desertRef = ref(storage, `deals/${localStorage.getItem("userEmail")}/${this.deleteid}`);

            // List all items (files and sub-folders) in the folder
            const items = await listAll(desertRef);

            // Iterate through the items and delete them
            for (const item of items.items) {
            await deleteObject(item);
            }

            // refreshes the page to fetch new sets of data
            this.$router.go()
        },

        // modal that acts as confirmation for deleteDeal function
        closeDeleteModal (dealid){
            this.deletemodal = !this.deletemodal
            if(this.deletemodal == true){
            //record deal id so that when deleteDeal func is triggered, id is tracked
            this.deleteid = dealid
        }
        },
        //async due to awaiting for getDocs function
        async getdeals() {
            const querySnapshot = await getDocs(query((collection(db, "deals")), where("uploaded_by.email" , "==", localStorage.getItem("userEmail"))));
            querySnapshot.forEach(async (doc) => {
            // doc.data() is never undefined for query doc snapshots
            let obj = doc.data()
            obj['id'] = doc.id

            //slice first 100 characters so that tab
            obj.deal_description = obj.deal_description.slice(0,100) + '...'
            this.deal_list.push(obj)
            this.display_list = this.deal_list
            });
        }

    }

}
</script>

<style scoped>
/* Default view for larger screens */
.table td,
.table th {
    text-align: center;
    /* Center align text for all table cells and headers */
    vertical-align: middle;
    /* Align the content vertically in the middle */
}

/* Media query for mobile responsiveness */
@media (max-width: 768px) {
    .table thead {
        display: none;
        /* Hide table headers on small screens */
    }

    .table,
    .table tbody,
    .table tr,
    .table td {
        display: block;
        /* Make table elements stack vertically */
        width: 100%;
        box-sizing: border-box;
        /* Include padding in the element's width */
    }

    .table tr {
        margin-bottom: 0.625rem;
        /* Add some space between what will now look like rows */
        border-bottom: 1px solid #e9ecef;
        /* Add a border to separate the 'rows' */
    }

    .table td {
        text-align: center;
        /* Center align text for all table cells */
        border: none;
        /* Remove the border from the cells */
        padding: 8px 10px;
        /* Add some padding */
        position: relative;
        /* Needed for absolute positioning of the pseudo-element */
    }

    .table td img.dealimg {
        width: 50px;
        /* Set a fixed width for the image */
        height: auto;
        /* Maintain aspect ratio */
        display: block;
        /* Block display to allow margin auto to work */
        margin: 0 auto;
        /* Center the image horizontally */
        padding: 5px 0;
        /* Add some padding above and below the image */
    }


}

/* Larger default view for images */
.table td img.dealimg {
    width: 200px;
    /* Larger default width */
    height: auto;
    /* Maintain aspect ratio */
    display: block;
    /* Ensure the image is a block element to center it */
    margin: 0 auto;
    /* Center the image horizontally */
}



</style>
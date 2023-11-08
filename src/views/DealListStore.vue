<template>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Deal List</h1>
        <form class="form-inline my-2 my-lg-0 col-3" @submit.prevent="">
            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" @input="searchdeal()"
                v-model="searchTerm">
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
                <th aria-label="col">Images</th>
                <th aria-label="col">Deal</th>
                <th aria-label="col">Type</th>
                <th aria-label="col">Description</th>
                <th aria-label="col">Price</th>
                <th aria-label="col">Qty</th>
                <th aria-label="col">Food</th>
                <th aria-label="col">Categories</th>
                <th aria-label="col">Expiry Date</th>
                <th aria-label="col">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="deal in display_list" :key="deal.id">
                <td aria-label="Images"><img :src="deal.image" alt="" class="dealimg"></td>
                <td aria-label="Deal">{{ deal.deal_name }}</td>
                <td aria-label="col" class="col-1">{{ deal.deal_type }}</td>
                <td aria-label="col" class="col-2">{{ deal.deal_description }}</td>
                <td aria-label="col">{{ deal.deal_price }}</td>
                <td aria-label="col">{{ deal.deal_quantity }}</td>
                <td aria-label="col">{{ deal.product_name }}</td>
                <td aria-label="col" class="col-2">{{ deal.product_category }}</td>
                <td aria-label="col" class="col-2">{{ deal.deal_expiry }}</td>
                <td aria-label="col" class="col-1">
                    <router-link :to="{ name: 'UpdateDeal', params: { id: deal.id } }"><img src="../assets/icons/edit.svg"
                            alt="img" class="p-2"></router-link>
                    <img src="../assets/icons/delete.svg" alt="img" class="p-2" @click="closeDeleteModal(deal.id)">
                </td>
            </tr>

        </tbody>
    </table>
</template>

<script>
import { collection, query, where, getDocs, deleteDoc, updateDoc, deleteField, doc } from "firebase/firestore"
import { storage, db } from '../firebase/index.js'
import { ref, getDownloadURL, deleteObject, listAll } from "firebase/storage"

export default {
    //trigger function before mounted
    created() {
        this.getdeals()
    },
    data() {
        return {
            //initialize deal list
            deal_list: [], //original list
            display_list: [], //filtered list based on search
            deletemodal: false,
            deleteid: null,
            searchTerm: '' //search term
        }
    },
    methods: {
        //on input triggers from search bar
        searchdeal() {
            //returns the list of deals if input is empty
            if (this.searchTerm === "") {
                this.display_list = this.deal_list
            } else {
                this.display_list = this.deal_list.filter((deal) =>
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
        async deleteDeal() {
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
        closeDeleteModal(dealid) {
            this.deletemodal = !this.deletemodal
            if (this.deletemodal == true) {
                //record deal id so that when deleteDeal func is triggered, id is tracked
                this.deleteid = dealid
            }
        },
        //async due to awaiting for getDocs function
        async getdeals() {
            const querySnapshot = await getDocs(query((collection(db, "deals")), where("uploaded_by.email", "==", localStorage.getItem("userEmail"))));
            querySnapshot.forEach(async (doc) => {
                // doc.data() is never undefined for query doc snapshots
                let obj = doc.data()
                obj['id'] = doc.id

                //slice first 100 characters so that tab
                obj.deal_description = obj.deal_description.slice(0, 100) + '...'
                this.deal_list.push(obj)
                this.display_list = this.deal_list
            });
        }

    }

}
</script>

<style scoped>
/* Existing styles */
/* ... */

/* Responsive table styles */
@media (max-width: 768px) {
    table {
        width: 100%;
        display: block;
    }

    thead {
        display: none;
        /* Hide table headers on small screens */
    }

    tr {
        margin-bottom: 0.625rem;
        display: block;
        border-bottom: 2px solid #ddd;
    }

    td {
        display: block;
        text-align: right;
        padding-left: 50%;
        position: relative;
    }

    td::before {
        /* Now like a table header */
        content: attr(aria-label);
        position: absolute;
        left: 0;
        width: 50%;
        padding-right: 10px;
        white-space: nowrap;
        text-align: left;
        font-weight: bold;
    }

    /* Custom styles for your modal or other elements */
    /* ... */
}

/* You can add more media queries for different breakpoints */
</style>

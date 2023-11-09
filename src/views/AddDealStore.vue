<template>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Add Deal</h1>
    </div>

    <button @click="scanmodal(); startscan();" class="btn btn-warning">
        <span>Scan Now</span>
    </button>

    <div v-show="scan" class="Bmodal-container">
        <div class="Bmodal-background" @click="scanmodal"></div>
        <div class="Bmodal-content">
            <div class="Bmodal-header">
                <h5 class="modal-title mx-auto">Please positon your barcode</h5>
                <button type="button" class="close" @click="scanmodal">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="Bmodal-body">
                <div ref="pdtscan" class="scanner"></div>
            </div>
        </div>
    </div>


    <form @submit.prevent="upload_deal()">

        <div class="row">
            <div class="col-sm-4">
                <label for="barcodeid" class="py-2">Barcode ID</label>
                <input type="number" class="form-control" id="barcodeid" ref="barcodeid" readonly>
            </div>
            <div class="col-sm-4">
                <label for="pdtname" class="py-2">Product Name</label>
                <input type="text" class="form-control" id="pdtname" ref="productname" readonly>
            </div>
            <div class="col-sm-4">
                <input type="text" ref="foodtag" id="foodtag" v-show="false">
                <label for="pdtcat" class="py-2">Product Category</label>
                <select id="pdtcat" ref="foodcategory" class="form-control mb-2" required="required">
                    <option>Bakery</option>
                    <option>Diary, Chilled & Eggs</option>
                    <option>Drinks</option>
                    <option>Beer, Wine & Spirits</option>
                    <option>Snacks & Confectionery</option>
                    <option>Frozen</option>
                    <option>Fruits and Vegetables</option>
                    <option>Rice, Noodles & Cooking Ingredients</option>
                    <option>Meat & Seafood</option>
                    <option>Food Cupboard</option>
                    <option>Pet Supplies</option>
                </select>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <label for="dealname" class="py-2">Deal Name</label>
                <input type="text" class="form-control" id="dealname" ref="dealname" placeholder="e.g. Hot deals for soju!"
                    required>
            </div>
            <div class="col-sm-6">
                <label for="deal_type" class="py-2" ref="dealtype">Select Deal Type</label>
                <select id="deal_type" ref="dealtype" class="form-control mb-2" required="required">
                    <option>Discounts</option>
                    <option>Bundle Deals</option>
                    <option>1 For 1</option>
                </select>
            </div>

        </div>

        <div class="row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label for="dealdescr" class="py-2">Deal Description</label>
                    <textarea class="form-control" id="dealdescr" ref="dealdescr" rows="6"></textarea>
                </div>
            </div>
            <div class="col-lg-2 col-sm-4">
                <label for="dealprice" class="py-2">Price</label>
                <input type="number" step="0.01" class="form-control" id="dealprice" ref="dealprice" required>
                <label for="dealqty" class="py-2">Quantity</label>
                <input type="number" class="form-control" id="dealqty" ref="dealqty" required>
            </div>
            <div class="col-lg-2 col-sm-4">
                <label for="dealexpiry" class="py-2">Expiry Date</label>
                <input type="date" class="form-control" id="dealexpiry" ref="dealexpiry" required>
            </div>

        </div>
        <div class="row">
            <div class="col-12 col-sm-6">
                <div>
                    <label for="dealimg" class="py-2">Upload image &nbsp;</label>
                </div>
                <div>
                    <input type="file" id="dealimg" name="dealimg" ref="dealimg">
                </div>
            </div>
            <div class="col-md-6 d-flex justify-content-end">
                <button class="btn btn-primary my-3 w-sm-auto" type="submit">Submit form</button>
            </div>
        </div>









    </form>
</template>

<script>
import Quagga from '../assets/quagga.min.js'
import axios from 'axios'
import { storage, db } from '../firebase/index.js'
import { addDoc, updateDoc, collection, doc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'


export default {
    data() {
        return {
            //var if the modal pops up or not
            scan: false
        }
    },
    methods: {
        async upload_deal() {

            //extracting image
            let dealImgName = this.$refs.dealimg.files[0].name

            //extracting acc details for store from localstorage
            let userEmail = localStorage.getItem('userEmail')
            let userType = localStorage.getItem('userType')
            let userAddr = localStorage.getItem('homeAddress')
            let storename = localStorage.getItem('storeName')

            // add document to products collection (with extracting photo)
            await addDoc(collection(db, "deals"), {
                barcode: this.$refs.barcodeid.value,
                product_name: this.$refs.productname.value,
                product_category: this.$refs.foodcategory.value,
                product_tags: this.$refs.foodtag.value,
                deal_type: this.$refs.dealtype.value,
                deal_name: this.$refs.dealname.value,
                deal_description: this.$refs.dealdescr.value,
                deal_expiry: this.$refs.dealexpiry.value,
                deal_price: parseFloat(this.$refs.dealprice.value),
                deal_quantity: parseInt(this.$refs.dealqty.value),
                uploaded_by: { email: userEmail, type: userType, name: storename },
                location: userAddr,
                image_name: dealImgName
            }).then(docRef => {
                const storageRef = ref(storage, `deals/${userEmail}/${docRef.id}/${dealImgName}`)
                uploadBytes(storageRef, this.$refs.dealimg.files[0]).then(async (snapshot) => {
                    let dealImgURL = await getDownloadURL(snapshot.ref)
                    console.log(dealImgURL)
                    await updateDoc(doc(db, "deals", docRef.id), { image: dealImgURL })
                })
            })

            this.$router.push({ name: 'DealListStore' })

        },
        scanmodal() {
            //func if the modal pops up or not
            this.scan = !this.scan
        },
        startscan() {
            // Upon clicking on 'scan now', quagga lib triggers
            //Initialize Quagga
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: this.$refs.pdtscan  //camera to dom using ref
                },
                decoder: {
                    readers: ["ean_reader"] //removed most of the other readers to avoid conflict with ean13
                }
            }, function (err) {
                if (err) {
                    console.log(err);
                    return
                }
                console.log("Initialization finished. Ready to start");
                Quagga.start();
            });
        }

    },
    mounted() {
        Quagga.onDetected((data) => {
            try {
                var barcodeValue = data.codeResult.code;
                this.$refs.barcodeid.value = barcodeValue;

                // Stop Quagga after a barcode is detected
                Quagga.stop();

                // Close the modal after a barcode is detected
                if (this.scan) {
                    this.scanmodal();
                }

                // Using axios to get product name and category
                axios.get(`https://world.openfoodfacts.org/api/v2/product/${barcodeValue}.json`)
                    .then(response => {
                        if (response.data && response.data.product) {
                            let fooditem = response.data.product.product_name || 'Unknown product name';
                            let foodcat = response.data.product.categories || 'Unknown categories';
                            this.$refs.productname.value = fooditem;
                            this.$refs.foodtag.value = foodcat;
                        } else {
                            throw new Error('Product data is not available');
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching product data:', error);
                        // Handle the error according to your application's needs
                    });
            } catch (error) {
                console.error('Error during barcode scanning:', error);

            }
        });

    }


};
</script>



<style >
video{
    width: 300px;
    height: 300px;
}

.drawingBuffer {
    display: none;
}

.scanner {
    display: flex;
    justify-content: center;
    align-items: center;

}

/*---------------------
    Modal
    -----------------------*/
    .Bmodal-container {
    position: fixed;
    /* Use fixed positioning */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;

    /* Ensure it's above other items */
}

.Bmodal-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    /* Semi-transparent background */
    z-index: -1;
    /* Behind the modal content */
}

.Bmodal-content {
    position: relative;
    z-index: 1;
    /* Above the semi-transparent background */
    background: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    max-width: 500px;
    /* Adjust as per your requirement */
    width: 100%;

}

.Bmodal-header,
.Bmodal-body {
    padding: 15px;
    z-index: 1000;
    text-align: center;

}
</style>
<template>
    <HeaderSection />

    <!-- Modal to show compiled QR code -->
    <div v-if="qrModal" class="modal-container padding-bottom-3x mb-1">
        <div class="modal-background" @click="qrModal = false"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Let Cashier Staff Scan</h5>
                <button type="button" class="close" @click="qrModal = false">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="qrcode"><qrcode-vue :value="qrValue" v-if="qrValue"></qrcode-vue></div>
            </div>
        </div>
    </div>

    <div class="container padding-bottom-3x mb-1 cartcontent">





        <!-- Shopping Cart-->
        <div class="table-responsive shopping-cart">
            <div class="container m-40">&nbsp;</div>
            <div class="container m-40">&nbsp;</div>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th class="text-center col-5">Deal and Product Information</th>
                        <th class="text-center">Type</th>
                        <th class="text-center">Quantity</th>
                        <th class="text-center">Price/Unit</th>
                        <th class="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="deal in display_list" :key="deal.id">
                        <td>
                            <div class="product-item">
                                <a class="product-thumb" href="#"><img :src="deal.url" alt="Product"></a>
                                <h4 class="product-title"><a href="#">{{ deal.deal_name }}</a></h4>
                                <span><em>Product: {{ deal.product_name }}</em></span>
                            </div>
                        </td>
                        <td>{{ deal.type }}</td>
                        <td class="qtycol">
                            <div class="row justify-content-center">
                                <div class="col-6 qtyalign">{{ deal.cart_qty }}</div>
                                <div class="col-6">
                                    <input class="btn bg-secondary increment col-12 my-1" value="+"
                                        @click="changeQty('+', deal.id)" readonly>
                                    <input class="btn btn-secondary increment col-12 my-1" value="-"
                                        @click="changeQty('-', deal.id)" readonly>
                                </div>
                            </div>
                        </td>

                        <td class="text-center text-lg text-medium">${{ deal.perunit }}</td>
                        <td class="text-center"><a class="remove-from-cart" href="#" data-toggle="tooltip"
                                @click="deleteCartItem(deal.id)"><i class="fa fa-trash"></i></a></td>
                    </tr>


                </tbody>
            </table>
        </div>

        <div class="shopping-cart-footer">
            <div class="row align-items-center">
                <!-- Back To Home -->
                <div class="col-auto">
                    <router-link :to="{ name: 'Home' }">
                        <button class="btn btn-secondary">Back To Home</button>
                    </router-link>
                </div>

                <!-- Select Store List -->
                <div class="col">
                    <select class="form-select w-100" ref="storeChosen" @change="filterByStore">
                        <option v-for="store in store_list" :key="store">{{ store }}</option>
                    </select>
                </div>

                <!-- Redeem Deals -->
                <div class="col-auto">
                    <a class="btn btn-success" href="#" @click="qrGenerate()">Redeem Deals</a>
                </div>
            </div>
        </div>





    </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import HeaderSection from '../components/headerSection.vue'
import { db } from '../firebase/index.js'
import { doc, getDoc, updateDoc } from "firebase/firestore"

export default {
    components: {
        QrcodeVue, HeaderSection
    },
    data() {
        return {
            qrModal: false,
            qrValue: null,
            cart_arr: null, //imitates cart arr in firebase (to update)
            store_list: [], //used for drop down to track
            cart_list: [], //used for mainset to filter
            display_list: [] //usde for the result of filter
        }
    },
    created() {
        this.fetchCart()
    },
    methods: {
        async fetchCart() {
            if (localStorage.getItem("cart")) {
                const cart = JSON.parse(localStorage.getItem("cart"));
                if (Array.isArray(cart) && cart.length === 0) {
                    localStorage.removeItem("cart");
                }
            }
            const rawCart = JSON.parse(localStorage.getItem("cart") || "[]");

            // Group by pdt + storename and accumulate qty
            const groupedCart = {};
            for (const item of rawCart) {
                const key = `${item.pdt}_${item.storename}`;
                if (!groupedCart[key]) {
                    groupedCart[key] = { ...item };
                } else {
                    groupedCart[key].qty += item.qty;
                }
            }

            this.cart_arr = Object.values(groupedCart);
            this.cart_list = [];
            this.store_list = [];

            // 🧱 Hardcoded deal data
            const dealData = {
                deal001: {
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
                    image: "https://littlefarms.com/media/catalog/product/7/4/7494_org-gala-apple-500g.jpg?optimize=medium&fit=bounds&height=500&width=500&canvas=500:500",
                    isFavorite: true
                },
                deal002: {
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
                    image: "https://atlas-content-cdn.pixelsquid.com/stock-images/plastic-milk-carton-blank-MxE34v1-600.jpg",
                    isFavorite: false
                },
                deal003: {
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
                    image: "https://m.media-amazon.com/images/I/71RW-a383dL._UF1000,1000_QL80_.jpg",
                    isFavorite: true
                },
                deal004: {
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
                    image: "https://bakerbettie.com/wp-content/uploads/2020/09/sourdough-sandwich-bread-2-320x320.jpg",
                    isFavorite: false
                }
            };

            for (const item of this.cart_arr) {
                if (!this.store_list.includes(item.storename)) {
                    this.store_list.push(item.storename);
                }

                const deal_rec = dealData[item.pdt];
                if (!deal_rec) {
                    console.warn("Missing hardcoded deal:", item.pdt);
                    continue;
                }

                this.cart_list.push({
                    id: item.pdt,
                    cart_qty: item.qty,
                    store: item.storename,
                    deal_name: deal_rec.deal_name,
                    product_name: deal_rec.product_name,
                    url: deal_rec.image,
                    perunit: deal_rec.deal_price,
                    type: deal_rec.deal_type
                });
            }

            this.display_list = this.store_list.length
                ? this.cart_list.filter(item => this.store_list.includes(item.store))
                : this.cart_list;


            console.log("store_list:", this.store_list);
            console.log("Cart List:", this.cart_list);
            console.log("Display List:", this.display_list);
        },
        filterByStore() {
            this.display_list = this.cart_list.filter((item) => {
                return item.store == this.$refs.storeChosen.value
            })

        },
        async deleteCartItem(id) {
            // Parse the current cart from localStorage
            let currentCart = JSON.parse(localStorage.getItem("cart") || "[]");

            // Remove the item with matching pdt id
            currentCart = currentCart.filter(item => item.pdt !== id);

            // Save the updated cart back to localStorage
            if (currentCart.length === 0) {
                console.log(currentCart.length);
                // If cart is now empty, remove the cart key from localStorage
                localStorage.removeItem("cart");
                window.location.href = window.location.href;
            } else {
                // Otherwise, update localStorage with the new cart
                localStorage.setItem("cart", JSON.stringify(currentCart));
            }


            // Also update the local cart_list by filtering out the deleted item
            this.cart_list = this.cart_list.filter(item => item.id !== id);

            // Update the display list or filters
            this.filterByStore();

            alert("Item Removed!");

        },

        async changeQty(operation, dealid) {

            for (var item of this.cart_list) {
                if (item.id === dealid) {
                    item.cart_qty = eval(item.cart_qty + operation + 1)
                    if (item.cart_qty === 0) {
                        this.deleteCartItem(item.id)
                    }
                }
            }

            for (var deal of this.cart_arr) {
                if (deal.pdt === dealid) {
                    deal.qty = eval(deal.qty + operation + 1)
                    if (deal.qty === 0) {
                        this.cart_arr.pop(deal)
                    }
                }
            }
            const updatedCart = this.cart_list.map(item => ({
                pdt: item.id,
                qty: item.cart_qty,
                storename: item.store
            }));

            // Save back to localStorage
            localStorage.setItem("cart", JSON.stringify(updatedCart));

            // Refresh display list or filters if needed
            this.filterByStore();


            // const userRef = doc(db, "users", localStorage.getItem("userID"))
            // await updateDoc(userRef, {
            //     cart: this.cart_arr
            // })

        },
        qrGenerate() {
            //open up the modal
            this.qrModal = true
            var selectedCart = []
            //cart_arr is all cart from user cart field
            selectedCart = this.cart_arr.filter((element) => {
                return (element.storename == this.$refs.storeChosen.value)
            })
            //assign items in cart to qrValue
            this.qrValue = JSON.stringify(selectedCart) + `+${localStorage.getItem("userID")}`
        }
    }
}
</script>

<style scoped>
.modal-container {
    z-index: 1000;
}

.qtyalign {
    display: flex;
    align-items: center;
}

.qtycol {
    width: 20px
}

.cartcontent {
    margin-top: 100px;
}

.homeleft {
    float: left;
}

.redeemright {
    float: right;
}

.qrcode {
    width: 200px;
    margin: auto;
    text-align: center;
}

.increment {
    width: 40px;
    margin-bottom: 10px;
    box-sizing: content-box;
}

.form-select {
    width: 40% !important;
}

.shopping-cart,
.order-table {
    margin-bottom: 20px
}

.shopping-cart .table,
.order-table .table {
    margin-bottom: 0
}

.shopping-cart .btn,
.order-table .btn {
    margin: 0
}

.shopping-cart>table>thead>tr>th,
.shopping-cart>table>thead>tr>td,
.shopping-cart>table>tbody>tr>th,
.shopping-cart>table>tbody>tr>td,
.order-table>table>thead>tr>th,
.order-table>table>thead>tr>td,
.order-table>table>tbody>tr>th,
.order-table>table>tbody>tr>td {
    vertical-align: middle !important;
    border-left: none;
    /* Remove left border */
    border-right: none;
    /* Remove right border */
}

.shopping-cart>table thead th,
.order-table>table thead th {
    padding-top: 17px;
    padding-bottom: 17px;
    border-width: 1px
}

.shopping-cart .remove-from-cart,
.order-table .remove-from-cart {
    display: inline-block;
    color: #ff5252;
    font-size: 18px;
    line-height: 1;
    text-decoration: none
}

.shopping-cart .count-input,
.order-table .count-input {
    display: inline-block;
    width: 100%;
    width: 86px
}

.shopping-cart .product-item,
.order-table .product-item {
    display: table;
    min-width: 150px;
    margin-top: 5px;
    margin-bottom: 3px
}

.shopping-cart .product-item .product-thumb,
.shopping-cart .product-item .product-info,
.order-table .product-item .product-thumb,
.order-table .product-item .product-info {
    display: table-cell;
    vertical-align: top
}

.shopping-cart .product-item .product-thumb,
.order-table .product-item .product-thumb {
    width: 130px;
    padding-right: 20px
}

.shopping-cart .product-item .product-thumb>img,
.order-table .product-item .product-thumb>img {
    display: block;
    width: 100%
}

@media screen and (max-width: 860px) {

    .shopping-cart .product-item .product-thumb,
    .order-table .product-item .product-thumb {
        display: none
    }
}

.shopping-cart .product-item .product-info span,
.order-table .product-item .product-info span {
    display: block;
    font-size: 13px;
}

.shopping-cart .product-item .product-info span>em,
.order-table .product-item .product-info span>em {
    font-weight: 500;
    font-style: normal
}

.shopping-cart .product-item .product-title,
.order-table .product-item .product-title {
    margin-bottom: 6px;
    padding-top: 5px;
    font-size: 16px;
    font-weight: 500
}

.shopping-cart .product-item .product-title>a,
.order-table .product-item .product-title>a {
    transition: color .3s;
    color: #374250;
    line-height: 1.5;
    text-decoration: none
}

.shopping-cart .product-item .product-title>a:hover,
.order-table .product-item .product-title>a:hover {
    color: #0da9ef
}

.shopping-cart .product-item .product-title small,
.order-table .product-item .product-title small {
    display: inline;
    margin-left: 6px;
    font-weight: 500
}


.shopping-cart-footer {
    display: table;
    width: 100%;
    padding: 10px 0;
    border-top: 1px solid #e1e7ec
}

.shopping-cart-footer>.column {
    display: table-cell;
    padding: 5px 0;
    vertical-align: middle
}

.shopping-cart-footer>.column:last-child {
    text-align: right
}

.shopping-cart-footer>.column:last-child .btn {
    margin-right: 0;
    margin-left: 15px
}

@media (max-width: 768px) {
    .shopping-cart-footer> {
        display: block;
        width: 100%
    }

    .shopping-cart-footer>.column:last-child {
        text-align: center
    }

    .shopping-cart-footer>.column .btn {
        width: 100%;
        margin: 12px 0 !important
    }
}

.modal-container {
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

.modal-background {
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

.modal-content {
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

.modal-header,
.modal-body {
    padding: 15px;
}

.close {
    cursor: pointer;
}
</style>
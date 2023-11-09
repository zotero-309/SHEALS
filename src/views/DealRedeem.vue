<template>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">SCAN QR CODE</h1>
    </div>
    <div class="qrscanner">
        <qrcode-stream @decode="onDecode"></qrcode-stream>

        <div v-if="resultmodal" class="Rmodal-container">
            <div class="Rmodal-background" @click="resultmodal = false"></div>
            <div class="Rmodal-content">
                <div class="Rmodal-header">
                    <h5 class="Rmodal-title">List of Cart Items Redeemed</h5>
                    <button type="button" class="close" @click="resultmodal = false">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="Rmodal-body">
                    <ul>
                        <li v-for="item in redeemItems" :key="item.pdt">{{ item.errmsg }}: {{ item.pdtname }} x {{ item.qty
                        }}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { db } from '../firebase/index.js'
import { doc, deleteDoc, updateDoc, increment, arrayRemove, getDoc, setDoc } from "firebase/firestore"
import { QrcodeStream } from 'vue3-qrcode-reader'
export default {
    components: {
        QrcodeStream
    },
    data() {
        return {
            resultmodal: false,
            redeemItems: []
        }
    },
    methods: {
        //on detection of qr code
        async onDecode(decodedString) {
            let resArr = decodedString.split("+")
            let userId = resArr[1]
            let cartArr = JSON.parse(resArr[0])
            const monthnames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]

            //check if redeem store is correct
            const storeRef = doc(db, "users", localStorage.getItem("userID"))
            let store_name = (await getDoc(storeRef)).data().storename
            if (store_name != cartArr[0].storename) {
                this.redeemItems = [{ errmsg: "Incorrect store", pdtname: "None", qty: 0 }]
                this.resultmodal = true

                return
            }

            //get user reference
            const userRef = doc(db, "users", userId);

            //get deal list and update
            for (const element of cartArr) {
                let dealDoc = doc(db, "deals", element.pdt)
                var errmsg = "Success"//push success if no error
                const docSnap = await getDoc(dealDoc)

                let deal_rec = docSnap.data()
                //check if quantiy exceeds avail amt
                if (element.qty > deal_rec.deal_quantity) {
                    errmsg = "Quantity redeemed exceeds available"
                }
                if (errmsg === "Success") {
                    //reference to sales document
                    const salesDocRef = doc(db, "users", localStorage.getItem("userID"), "data", "sales")
                    let salesnap = (await getDoc(salesDocRef)).data()

                    //reference to sales sales qty document
                    const salesqtyDocRef = doc(db, "users", localStorage.getItem("userID"), "data", "sales_qty")
                    let salesqtysnap = (await getDoc(salesqtyDocRef)).data()

                    //getting the year and month of today
                    const curryear = new Date().getFullYear()
                    const currmonth = monthnames[new Date().getMonth()]

                    //check if month already recorded
                    if (!salesnap.hasOwnProperty(curryear)) {
                        salesnap[curryear] = {};
                        salesqtysnap[curryear] = {};
                    }

                    if (!salesnap[curryear].hasOwnProperty(currmonth)) {
                        salesnap[curryear][currmonth] = 0;
                        salesqtysnap[curryear][currmonth] = 0;
                    }

                    salesnap[curryear][currmonth] += element.qty * deal_rec.deal_price;
                    salesqtysnap[curryear][currmonth] += element.qty;

                    await setDoc(salesDocRef, { ...salesnap }, { merge: true });
                    await setDoc(salesqtyDocRef, { ...salesqtysnap }, { merge: true });


                    // Remove from user cart
                    await updateDoc(userRef, {
                        cart: arrayRemove(element),
                    })
                    // if redeem and available the same, deal no longer exist
                    if (element.qty === deal_rec.deal_quantity) {
                        await deleteDoc(doc(db, "deals", element.pdt));
                    } else {
                        // Update deal qty
                        await updateDoc(dealDoc, {
                            deal_quantity: increment(-element.qty),
                        })
                    }

                }

                element["pdtname"] = deal_rec.product_name;
                element["errmsg"] = errmsg
            }

            this.redeemItems = cartArr
            this.resultmodal = true


        },
        onError(error) {
            // Handle the error and prevent run time error
            console.error('QR Code scanning error:', error);
        }
    }
}
</script>

<style scoped>
/*---------------------
    Modal
    -----------------------*/
.Rmodal-container {
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

.Rmodal-background {
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

.Rmodal-content {
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
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    font-family: "Cabin", sans-serif;
}

/* Close button styles */
.Rmodal-header .close {
    position: absolute;
    top: 10px;
    right: 20px;
    color: #393939;
    /* Close button color */
    font-size: 30px;
    cursor: pointer;
}

/* List item styles */
.Rmodal-body ul {
    list-style: none;
    padding: 0;
}

.Rmodal-body li {
    margin-bottom: 10px;
    font-size: 16px;
}

.Rmodal-header,
.Rmodal-body {
    padding: 15px;
    z-index: 1000;
    text-align: center;
}

.qrcode-stream-camera,
.qrcode-stream-overlay,
.qrcode-stream-wrapper {
    width: 500px !important;
    height: 400px !important;
}


.qrscanner {
    display: flex;
    /* Use flexbox to center content */
    justify-content: center;
    /* Horizontally center content */
    height: 100vh;
    /* Optionally, set a fixed or relative height for the container */
}
</style>
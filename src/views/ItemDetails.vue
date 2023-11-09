<template>
  <!-- Header Section Begin -->
  <HeaderSection />
  <!-- Header Section End -->
  <div v-if="loading" id="preloader">
    <!-- Preloader -->
    <div class="loader"></div>
  </div>

  <div v-if="!loading">

    <!-- Deal section-->
    <section class="deal-section">
      <div class="container px-4 px-lg-5">
        <div class="row gx-4 gx-lg-5 align-items-center">

          <!-- Left Column: Deal Image -->
          <div class="deal-img col-md-5">
            <img class="card-img-top md-0 mw-100" :src="item_list.image" alt="..." v-if="image_loaded" />
          </div>

          <!-- Right Column: Deal Details -->
          <div class="deal-details col-md-7">

            <!-- Deal Name -->
            <h1 class="deal-name fw-bold"> {{ item_list.deal_name }} </h1>

            <!-- Deal Price -->
            <h3 class="deal-price fw-bold customColour"> ${{ item_list.deal_price }}</h3>

            <!-- Deal Description -->
            <p class="deal-description">
              {{ item_list.deal_description }}
            </p>

            <!-- Display Uploader Info -->
            <div class="deal-uploader" v-if="item_list.uploaded_by">
              <i class="fa fa-id-card-o"></i>
              Uploader: <br> {{ item_list.uploaded_by.name }}
            </div>

            <!-- Display Deal Address -->
            <div class="deal-address">
              <i class="fa fa-map-marker"></i>
              Address: <br>{{ item_list.location }}
            </div>

            <!-- Add to Cart Section -->
            <div class="cart-section d-flex" v-if="$store.state.user && item_list.uploaded_by">
              <input class="form-control text-center me-3" id="inputQuantity" ref="inputQuantity" type="num" value="1"
                style="max-width: 3rem" v-if="item_list.uploaded_by.type == 'store'" />

              <!-- Add to Cart Button (Only for store-type uploaders) -->
              <button class="btn btn-outline-dark flex-shrink-0 cart-btn" type="button"
                v-if="item_list.uploaded_by.type == 'store'" @click="addToCart()">
                <i class="fa fa-shopping-cart"></i>
                Add to cart
              </button>
            </div>
          </div>
        </div>
        <hr class="horizontalLine">
      </div>
    </section>

    <!-- Comment Section -->
    <section class="comment-section" v-if="item_list.uploaded_by.type == 'consumer'">
      <div class="container text-dark">
        <div class="row d-flex justify-content-center">
          <div class="col-lg-12">

            <!-- Write a Comment Card -->
            <div class="mb-4">
              <div class="border-bottom border-gray">
                <div class="d-flex flex-start mw-100 mb-4">
                  <div class="w-100">
                    <h5 class="fw-bold">Leave a comment!</h5>
                    <div class="form-outline">
                      <textarea v-model="newComment" class="form-control" id="textAreaExample" rows="4"
                        placeholder="Did you enjoy the deal?"></textarea>
                    </div>
                    <div class="d-flex justify-content-between mt-3">
                      <button type="button" class="btn btn btn-dark" @click="postComment">
                        Post Comment <i class="fa fa-long-arrow-right ms-1" aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Display Comments -->
            <div class="displayed-comments">
              <h5 class="displayed-comments-header fw-bold">Comments ({{ comments.length }})</h5>
              <!-- Title with comment count -->
              <div v-for="(comment, index) in visibleComments" :key="index">
                <div class="d-flex justify-content-between">
                  <div>
                    <p class="fs-6 mb-2">{{ comment.user }}:</p>
                    <p class="fs-6 mb-0">{{ comment.text }}</p>
                  </div>
                  <small class="text-muted">{{ formatTimestamp(comment.timestamp) }}</small>
                </div>
                <!-- horizontal grey line between each comment -->
                <hr class="horizontalLine">
              </div>

              <!-- View More Comments Button -->
              <div class="card-footer">
                <div class="d-flex justify-content-center mt-3">
                  <button type="button" class="btn btn-outline-dark mb-3" @click="toggleComments">
                    {{ commentsCollapsed ? 'See Older Comments' : 'Hide Older Comments' }}
                    <i v-if="commentsCollapsed" class="fa fa-angle-down"></i>
                    <i v-else class="fa fa-angle-up"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>

    <!-- Related items section-->
    <section class="py-5 bg-light">
      <div class="container px-4 px-lg-5 mt-5">
        <h2 class="fw-bolder mb-4">Related products</h2>
        <div class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
          <div class="col mb-5">
            <div class="card h-100">
              <!-- Product image-->
              <img class="card-img-top" src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg" alt="..." />
              <!-- Product details-->
              <div class="card-body p-4">
                <div class="text-center">
                  <!-- Product name-->
                  <h5 class="fw-bolder">Fancy Product</h5>
                  <!-- Product price-->
                  $40.00 - $80.00
                </div>
              </div>
              <!-- Product actions-->
              <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="#">View options</a></div>
              </div>
            </div>
          </div>
          <div class="col mb-5">
            <div class="card h-100">
              <!-- Sale badge-->
              <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale
              </div>
              <!-- Product image-->
              <img class="card-img-top" src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg" alt="..." />
              <!-- Product details-->
              <div class="card-body p-4">
                <div class="text-center">
                  <!-- Product name-->
                  <h5 class="fw-bolder">Special Item</h5>
                  <!-- Product reviews-->
                  <div class="d-flex justify-content-center small text-warning mb-2">

                  </div>
                  <!-- Product price-->
                  <span class="text-muted text-decoration-line-through">$20.00</span>
                  $18.00
                </div>
              </div>
              <!-- Product actions-->
              <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="#">Add to cart</a></div>
              </div>
            </div>
          </div>
          <div class="col mb-5">
            <div class="card h-100">
              <!-- Sale badge-->
              <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale
              </div>
              <!-- Product image-->
              <img class="card-img-top" src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg" alt="..." />
              <!-- Product details-->
              <div class="card-body p-4">
                <div class="text-center">
                  <!-- Product name-->
                  <h5 class="fw-bolder">Sale Item</h5>
                  <!-- Product price-->
                  <span class="text-muted text-decoration-line-through">$50.00</span>
                  $25.00
                </div>
              </div>
              <!-- Product actions-->
              <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="#">Add to cart</a></div>
              </div>
            </div>
          </div>
          <div class="col mb-5">
            <div class="card h-100">
              <!-- Product image-->
              <img class="card-img-top" src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg" alt="..." />
              <!-- Product details-->
              <div class="card-body p-4">
                <div class="text-center">
                  <!-- Product name-->
                  <h5 class="fw-bolder">Popular Item</h5>
                  <!-- Product reviews-->
                  <div class="d-flex justify-content-center small text-warning mb-2">
                  </div>
                  <!-- Product price-->
                  $40.00
                </div>
              </div>
              <!-- Product actions-->
              <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="#">Add to cart</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
 
<script>
import HeaderSection from '../components/headerSection.vue';
import { db } from '../firebase/index.js'
import { doc, getDoc, getDocs, updateDoc, addDoc, collection, serverTimestamp, arrayUnion } from "firebase/firestore"

export default {
  components: {
    HeaderSection
  },
  data() {
    return {
      loading: true, // initially show preloader
      item_list: {},
      image_loaded: false,
      comments: [],
      commentsCollapsed: true, // Initial state is collapsed
      visibleComments: [], // Will store the comments to display
      commentsLimit: 2, // Number of comments to display initially
      newComment: "", // Store the content of the new comment
    };
  },
  created() {
    this.getdealitem()
    this.updateVisibleComments();
  },

  methods: {
    async getdealitem() {
      const docRef = doc(db, "deals", this.$route.params.id);
      const docSnap = (await getDoc(docRef)).data()
      this.item_list = docSnap
      this.image_loaded = true //prevent src attr from img tag taking wrong url, need await generateImgUrl

      // Fetch comments related to the deal
      const commentsRef = collection(docRef, "comments");
      const commentsSnap = await getDocs(commentsRef);

      // Convert timestamps to JavaScript Date objects before storing in the array
      this.comments = commentsSnap.docs.map(doc => {
        const commentData = doc.data();
        commentData.timestamp = commentData.timestamp.toDate();
        return commentData;
      });

      // Update visibility based on the number of comments
      if (this.comments.length > this.commentsLimit) {
        this.commentsCollapsed = true;
      } else {
        this.commentsCollapsed = false;
      }
      this.updateVisibleComments();
      // hide preloader after fetching data
      this.loading = false;
    },

    async addToCart() { //async function since updatedoc is async

      //reference to the path of firestore users table db->users->userid
      const userRef = doc(db, "users", this.$store.state.user.uid)
      let pdt_id = this.$route.params.id
      let quantity = this.$refs.inputQuantity.value

      //check if the deal already exists in the db
      var deal_exist = false
      const userSnap = (await getDoc(userRef)).data()

      for (var item of userSnap.cart) {
        if (item.pdt == pdt_id) {
          alert("Deal already in cart! View your discount cart")
          deal_exist = true
        }
      }

      const dealRef = doc(db, "deals", this.$route.params.id)
      const storeSnap = (await getDoc(dealRef)).data()

      //Update and add {pdt_id: quantity} to cart array in db
      if (deal_exist === false) {
        await updateDoc(userRef, {
          cart: arrayUnion({ pdt: pdt_id, qty: parseInt(quantity), storename: storeSnap.uploaded_by.name })
        })
        alert("Item added!")
      }
    },
    toggleComments() {
      // Toggle the collapse state
      this.commentsCollapsed = !this.commentsCollapsed;

      // If comments are collapsed, update the visible comments with the initial limit
      if (this.commentsCollapsed) {
        this.updateVisibleComments();
      } else {
        // If comments are expanded, show all comments
        this.visibleComments = this.comments.slice();
      }
    },
    loadMoreComments() {
      // Increase the limit to show more comments
      this.commentsLimit += 3;
      this.updateVisibleComments();
    },
    updateVisibleComments() {
      // Slice the comments array based on the limit and whether comments are collapsed or not
      if (this.commentsCollapsed) {
        // If comments are collapsed, show only the initial limit
        this.visibleComments = this.comments.slice(0, this.commentsLimit);
      } else {
        // If comments are expanded, show all comments
        this.visibleComments = this.comments.slice();
      }
    },
    formatTimestamp(timestamp) {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      return new Intl.DateTimeFormat('en-US', options).format(timestamp);
    },

    async postComment() {
      // Retrieve the user's email from localStorage
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        // alert("User email not found. Please log in.");
        if (confirm("Please log in first to post comment.")) {
          this.$router.push('/login')
        }
        return;
      }

      // Check if the new comment meets the minimum length requirement
      if (this.newComment.length < 10) {
        alert("Please enter a comment with at least 10 characters.");
        return;
      }

      // Extract the part before "@" symbol
      const username = userEmail.split("@")[0];

      // Push the new comment to Firebase
      try {
        const docRef = doc(db, "deals", this.$route.params.id);

        const commentData = {
          user: username,
          text: this.newComment,
          timestamp: serverTimestamp(),
        };

        const docRefWithComment = await addDoc(collection(docRef, "comments"), commentData);

        // Retrieve the comment data from the added document
        const addedComment = (await getDoc(docRefWithComment)).data();

        // Convert the Firebase Timestamp to a JavaScript Date object
        commentData.timestamp = addedComment.timestamp.toDate();

        // Prepend the new comment to the local comments array
        this.comments.unshift(commentData);

        // Clear the new comment input
        this.newComment = "";

        // Update visible comments
        this.updateVisibleComments();
        alert("Comment posted successfully!");
      } catch (error) {
        console.error("Error adding comment:", error);
        alert("An error occurred while adding your comment. Please try again.");

      }
    },
  }
};

</script>

<style scoped>
img {
  width: 100%;
}

.deal-section .container {
  margin-top: 170px;
  font-family: "Cabin", sans-serif;
}

.displayed-comments {
  /* set max height of comment section */
  max-height: 450px;
  overflow-y: auto;
  font-family: "Cabin", sans-serif;
}

.displayed-comments .card-footer {
  position: sticky;
  bottom: 0;
  background-color: white;
}

.customColour {
  color: #E97D2F
}


@media (max-width: 575.98px) {
  .deal-section .container {
    margin-top: 10px;
  }

  .deal-name {
    font-size: 1rem;
    margin-bottom: 0.4rem;
  }

  .deal-price {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  .deal-description {
    font-size: 0.7rem; 
    margin-bottom: 1rem;
    line-height: 1rem;
  }

  .deal-uploader {
    font-size: 0.7rem;
    margin-bottom: 0.2rem;
  }

  .deal-address {
    font-size: 0.7rem;
    margin-bottom: 0.1rem;
  }

  .cart-section input,
  .cart-section .cart-btn {
    font-size: 0.8rem;
  }

  hr {
    margin-top: 20px;
  }

  .comment-section h5{
    font-size: 12px;
  }

  .comment-section form-control {
    font-size: 12px;
  }

  .comment-section .container {
    padding: 0 17px;
  }

  .displayed-comments-header {
    font-size: 25px;
  }

  .displayed-comments {
    padding: 0 5px 0 1px;
  }
}
 

@media (min-width: 576px) and (max-width: 967.988px) {
  .deal-section .container {
    margin-top: 75px;
  }

  .deal-name {
    font-size: 1.5rem;
    margin-bottom: 0.4rem;
  }

  .deal-price {
    font-size: 1.8rem;
    margin-bottom: 1.2rem;
  }

  .deal-description {
    font-size: 1.1rem; 
    margin-bottom: 1.2rem;
    line-height: 1rem;
  }

  .deal-uploader {
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
  }

  .deal-address {
    font-size: 0.9rem;
    margin-bottom: 0.1rem;
  }

  .cart-section input,
  .cart-section .cart-btn {
    font-size: 0.8rem;
  }

  hr {
    margin-top: 20px;
  }

  .comment-section h5 {
    font-size: 15px;
  }

  .comment-section .container {
    padding: 0 17px;
  }

  .displayed-comments-header {
    font-size: 25px;
  }

  .displayed-comments {
    padding: 0 5px 0 1px;
  }
}


@media (min-width: 768px) and (max-width: 991.98px) {
  .deal-section .container {
    margin-top: 75px;
  }

  .deal-name {
    font-size: 1.3rem;
    margin-bottom: 0.4rem;
  }

  .deal-price {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .deal-description {
    font-size: 0.8rem; 
    margin-bottom: 1rem;
    line-height: 1.1rem;
  }

  .deal-uploader {
    font-size: 0.7rem;
    margin-bottom: 0.3rem;
  }

  .deal-address {
    font-size: 0.7rem;
    margin-bottom: 1rem;
  }

  .cart-section input,
  .cart-section .cart-btn {
    font-size: 0.8rem;
  }

  hr {
    margin-top: 20px;
  }

  .comment-section h5 {
    font-size: 15px;
  }

  .comment-section .container {
    padding: 0 17px;
  }

  .displayed-comments-header {
    font-size: 25px;
  }

  .displayed-comments {
    padding: 0 5px 0 1px;
  }
}

@media (min-width: 992px) and (max-width: 1199.98px) {
  .deal-section {
    margin: 75px 0 30px 0;
  }

  .deal-name {
    font-size: 1.6rem;
    margin-bottom: 0.6rem;
  }

  .deal-price {
    font-size: 2rem;
    margin-bottom: 1.4rem;
  }

  .deal-description {
    font-size: 1rem;
    margin-bottom: 1.4rem;
    line-height: 1.4rem;
  }

  .deal-uploader {
    font-size: 0.9rem;
    margin-bottom: 0.4rem;
  }

  .deal-address {
    font-size: 0.9rem;
    margin-bottom: 1.4rem;
  }

  .cart-section input,
  .cart-section .cart-btn {
    font-size: 0.9rem;
  }

  .comment-section .container {
    padding: 0 40px;
  }

  .displayed-comments {
    padding: 0 5px 0 0;
  }


}

@media (min-width: 1200px) {
  .deal-name {
    font-size: 2.2rem;
    margin-bottom: 0.6rem;
  }

  .deal-price {
    font-size: 2.4rem;
    margin-bottom: 2rem;
  }

  .deal-description {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }

  .deal-uploader {
    font-size: 1.1rem;
    margin-bottom: 0.6rem;
  }

  .deal-address {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .cart-section input,
  .cart-section .cart-btn {
    font-size: 1.2rem;
  }

  hr {
    margin-top: 30px;
  }

  .comment-section h5 {
    padding: 5px 0;
    font-size: 20px
  }

  .comment-section .container {
    padding: 0 40px;
  }

  .displayed-comments-header {
    font-size: 20px;
  }

  .displayed-comments {
    padding: 0 5px 0 0;
  }



}
</style>
 
 
 
  
 
    
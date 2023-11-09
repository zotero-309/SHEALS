<template>
  <div class="d-flex flex-column">
    <HeaderSection />
    <div id="app" class="container-fluid body ">
      <form class="row" @submit.prevent="addPreference">

        <div class="box">
          <h2 class="text-center py-5 fw-bold">Set Your Preferences</h2>

          <div class="d-flex justify-content-center address ">
            <div class="col-12 col-sm-9">
              <label for="address" class="form-label text-center">Address:</label>
              <input type="text" class="form-control" id="address" name="address" placeholder="Enter Your Home Address">
            </div>
          </div>

          <div class="row justify-content-center mt-3">

            <div class="category pl-3 pb-3 col-12 col-md-4">
              <span>Product Category:</span>
              <div v-for="category in food_categories" :key="category" class="form-check" 
                @change="updateSelectedCategories(category)">
                <input type="checkbox" class="form-check-input" :value="category" :id="category"
                  :checked="isCategoryChecked(category)">
                <label class="form-check-label" :for="category">{{ category }}</label>
              </div>
            </div>
            
            <div class="deals pl-3 pb-3 col-12 col-md-4 justify-content-center">
              <span>Preferred Deals:</span>
              <div v-for="deal_type in deal_types" :key="deal_type" class="form-check" 
                @change="updateSelectedDealTypes(deal_type)">
                <input type="checkbox" class="form-check-input" :value="deal_type" :id="deal_type"
                  :checked="isDealChecked(deal_type)">
                <label class="form-check-label" :for="deal_type">{{ deal_type }}</label>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-end mb-3">
            <button type="submit" class="btn btn-dark">Submit</button>
          </div>
        </div>

      </form>

    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { ref, onMounted } from 'vue';
import HeaderSection from '../components/headerSection.vue';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from '../firebase';

export default {
  components: { HeaderSection },
  data() {
    return {
      home_address: "",
      food_categories: ['Bakery', 'Beer, Wine & Spirits', 'Diary, Chilled & Eggs', 'Drinks',
        'Food Cupboard', 'Frozen', 'Fruits', 'Meat & Seafood', 'Pet Supplies',
        'Rice, Noodles & Cooking Ingredients', 'Snacks & Confectionery', 'Vegetables'],
      deal_types: ['Discounts', 'Bundle Deals',
        '1 for 1 deals'],
      addressInput: "",
    };
  },
  setup() {
    const store = useStore();
    const addressInput = ref(null);
    const selectedCategories = ref([]);
    const selectedDealTypes = ref([]);
    const item = ref({});

    const updateSelectedCategories = (category) => {
      if (!selectedCategories.value.includes(category)) {
        selectedCategories.value.push(category);
      } else {
        selectedCategories.value = selectedCategories.value.filter((c) => c !== category);
      }
    };

    const updateSelectedDealTypes = (dealType) => {
      if (!selectedDealTypes.value.includes(dealType)) {
        selectedDealTypes.value.push(dealType);
      } else {
        selectedDealTypes.value = selectedDealTypes.value.filter((d) => d !== dealType);
      }
    };

    // Fetch and update preferences from Firebase
    onMounted(async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          // Update user preferences
          item.value.email = userDoc.data().email;
          item.value.address = userDoc.data().homeaddress;
          item.value.catpref = Array.isArray(userDoc.data().catpref) ? userDoc.data().catpref : [];
          item.value.dealpref = Array.isArray(userDoc.data().dealpref) ? userDoc.data().dealpref : [];
          selectedCategories.value = item.value.catpref;
          selectedDealTypes.value = item.value.dealpref;
          addressInput.value = item.value.address;

          localStorage.setItem('userPreferences', JSON.stringify({
            item: item.value,
            address: addressInput.value,
            selectedCategories: selectedCategories.value,
            selectedDealTypes: selectedDealTypes.value,
          }));

        }
      } catch (error) {
        console.error('Error retrieving data from Firebase:', error);
      }

      var autocomplete = new google.maps.places.Autocomplete(document.getElementById("address"));
      autocomplete.setComponentRestrictions({
        country: ["sg"]
      });

      autocomplete.addListener("place_changed", () => {
        addressInput.value = document.getElementById("address").value;
      });

      // Save preferences in local storage
      const storedPreferences = localStorage.getItem('userPreferences');
      if (storedPreferences) {
        const parsedPreferences = JSON.parse(storedPreferences);
        item.value = parsedPreferences.item;
        addressInput.value = parsedPreferences.address
        selectedCategories.value = parsedPreferences.selectedCategories;
        selectedDealTypes.value = parsedPreferences.selectedDealTypes;
        document.getElementById("address").value = addressInput.value;
      }
    });

    const addPreference = () => {
      addressInput.value = document.getElementById("address").value;
      const data = {
        address: addressInput.value,
        categories: selectedCategories.value,
        dealTypes: selectedDealTypes.value,
      };
      store.dispatch('addPreference', data);
    };

    const isCategoryChecked = (cat) => {
      if (selectedCategories.value && selectedCategories.value.includes(cat)) {
        return true
      }
      else {
        return false
      }
    };
    const isDealChecked = (deal) => {
      if (selectedDealTypes.value && selectedDealTypes.value.includes(deal)) {
        return true
      }
      else {
        return false
      }
    };

    return {
      addPreference,
      updateSelectedCategories,
      updateSelectedDealTypes,
      isCategoryChecked,
      isDealChecked,
    };
  },
};
</script>

<style scoped>
.body {
  background-color: rgba(255, 255, 255, 0.39);
}

form {
  padding: 7rem 1rem 3rem;
}

.box {
  background-color: #fffcfa;
  border: 2px solid #2e460b;
}

.category, .deals,.address {
  font-size: 18px;
}

h1 {
  padding: 10px 50px;
  margin-left: 60px;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  font-weight: bold;
  font-size: 60px;
  color: rgba(67, 42, 21, 0.984);
}


label {
  padding-left: 10px;
}

@media (max-width: 769px) {
  .category, .form-check, .deals, .form-check, span {
    margin-bottom: 3vh; /* Adjust the margin as needed */
    margin-top: 3vh;
  }
  .category, .deals {
    margin-left: 28vw; /* Adjust the margin as needed */
  }
}

@media (max-width: 575px) {
  .category, .deals {
    margin-left: 3rem; /* Adjust the margin as needed for small screens */
  }

}

@media (min-width: 992px) {
  .category, .deals {
    margin-left: 4vw; /* Adjust the margin as needed for large screens */
  }

  .row.justify-content-center {
    margin-left: -4vw; /* Counteract the margin applied to .category and .deals */
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .category, .deals {
    margin-left: 0; /* Remove the margin for medium screens */
  }

  .address {
    margin-left: 3vw; /* Adjust the margin as needed for medium screens */
  }
}
</style>

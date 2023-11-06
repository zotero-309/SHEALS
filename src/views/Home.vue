<template>
    <!-- Header Section Begin -->
    <!-- listen for filter-applied event and calling updateDeal method -->
    <HeaderSection @filter-applied="updateDeals" />
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

    <!-- deals Section Begin -->
    <section class="deals-section">
        <div class="container">
            <div class="row">
                <dealItem :selectedFilters="selectedFilters" />
            </div>
        </div>
    </section>
    <!-- deals Section End -->
</template>

<script>
import HeaderSection from '../components/headerSection.vue'
import dealItem from '../components/dealItem.vue'


export default {
    components: {
        HeaderSection,
        dealItem
    },
    data() {
        return {
            selectedFilters: {
                selectedCategories: [],
                selectedDiscounts: [],
            }
        }
    },
    // computed: {
    //     selectedFilters() {
    //         // Use a computed property to avoid conflicts
    //         return this.selectedFilters;
    //     }
    // },
    methods: {
        updateDeals(selectedFilters) {
            // Handle the selected categories and discounts, and update the filtered deals
            this.selectedFilters = selectedFilters;

            // console.log(this.selectedFilters)

            // this.updateFilteredDeals();
        },
        // updateFilteredDeals() {
        //     // Check if necessary data is defined before filtering deals
        //     if (this.deal_list && this.selectedCategories && this.selectedDiscounts) {
        //         this.filteredDeals = this.deal_list.filter(
        //             (deal) =>
        //                 this.selectedCategories.includes(deal.product_category) &&
        //                 this.selectedDiscounts.includes(deal.discount_type)
        //         );
        //     } else {
        //         // Handle the case where data is undefined
        //         console.error('Some necessary data is undefined.');
        //         this.filteredDeals = []; // Set filteredDeals to an empty array or handle it as appropriate
        //     }
        // }
    }
}
</script>

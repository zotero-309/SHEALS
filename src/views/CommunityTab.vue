<template>
    <!-- Header Section Begin -->
    <!-- listen for filter-applied event and calling updateDeal method -->
    <HeaderSection @filter-applied="updateDeals" @update-search="searchQueryApplied" />
    <!-- Header Section End -->

    <!-- Breadcrumb Section Begin -->
    <div class="breadcrumb-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="breadcrumb-text">
                        <!-- Conditionally display breadcrumb message -->
                        <h2>{{ breadcrumbMessage }}</h2>
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
                <dealItem :selectedFilters="selectedFilters" :searchQuery="searchQuery" :tab="tab" />
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
            dealsList: [],
            tab: 'community',
            searchQuery: '',
            selectedFilters: {
                selectedCategories: [],
                selectedDiscounts: [],
            },

        }
    },
    computed: {
        // Computed property to determine the breadcrumb message
        breadcrumbMessage() {
            console.log(this.dealsList);
            // Check if the deals list is empty
            if (this.dealsList.length === 0) {
                return "Keep a look out for new deals!";
            } else {
                return "Deals by Users like You!";
            }
        },
    },
    methods: {
        searchQueryApplied(searchQuery) {
            this.searchQuery = searchQuery;
        },

        updateDeals(selectedFilters) {
            // Handle the selected categories and discounts, and update the filtered deals
            this.selectedFilters = selectedFilters;
        },
    },

}
</script>

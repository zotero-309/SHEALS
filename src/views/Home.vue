<template>
    <!-- Header Section Begin -->
    <!-- listen for filter-applied event and calling updateDeal method -->
    <section class='home-section'>
        <HeaderSection @filter-applied="updateDeals" @update-search="searchQueryApplied" />
        <!-- Header Section End -->

        <!-- Breadcrumb Section Begin -->
        <div class="content-container">
            <div class="breadcrumb-section">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="breadcrumb-text">
                                <h2>Deals for You</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            <!-- Breadcrumb Section End -->
    </section>

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
            tab: 'all',
            searchQuery: '',
            selectedFilters: {
                selectedCategories: [],
                selectedDiscounts: [],
            }
        }
    },
    methods: {
        searchQueryApplied(searchQuery) {
            this.searchQuery = searchQuery;
        },

        updateDeals(selectedFilters) {
            // Handle the selected categories and discounts, and update the filtered deals
            this.selectedFilters = selectedFilters;
        },
    }
}
</script>


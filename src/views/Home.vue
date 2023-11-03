<template>
    <!-- Header Section Begin -->
    <!-- listen for filter-applied event and calling updateDeal method -->
    <HeaderSection @filter-applied="updateDeals"/>
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
                <dealItem :selectedCategories="selectedCategories" />
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
            selectedCategories: [], // store selected categories
        };
    },
    methods: {
        updateDeals(selectedCategories) {
            // Handle the selected categories, you can update data or trigger other actions
            this.selectedCategories = selectedCategories;
        },
    },
}

</script>

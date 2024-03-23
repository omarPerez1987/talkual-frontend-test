<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
});
import {OrderListResponse } from '~/types'

const { find } = useStrapi();

const selectedType = ref<string>('all');
const orders = ref<any>();

const filterOrders = async () => {
  let filters = {};
  if (selectedType.value !== 'all') {
    filters = { type: { $eq: selectedType.value } };
  }

  const { data } = await find<OrderListResponse>('orders', {
    populate: ['order_items', 'order_meta'],
    filters
  });
  orders.value = data;
}
filterOrders()

</script>


<template>
  <main class="p-3">
    <h1 class="text-center mb-5">Order List</h1>

    <section class="container">
      <div class="row">
        <div class="col mb-4">
          <label for="typeFilter" class="me-3">Filter</label>
          <select id="typeFilter" v-model="selectedType" @change="filterOrders">
            <option value="all">All</option>
            <option value="normal">Normal</option>
            <option value="donation">Donation</option>
          </select>
        </div>
      </div>
      <div class="row mt-3 box-card ">
        <div class="d-flex flex-column">
          <div v-for="order in orders" :key="order.id" class="card article-card mb-4">
            <article class="card-body">
              <h5 class="card-title">SKU: {{ order.attributes.order_items.data[0].attributes.sku }}</h5>
              <p class="card-text">Type: {{ order.attributes.type }}</p>
              <p class="card-text">Quantity: {{ order.attributes.order_items.data[0].attributes.quantity }}</p>
              <p class="card-text">Shipping Firstname: {{ order.attributes.order_meta.data.attributes.shipping_firstname
                }}</p>
              <NuxtLink v-if="order.attributes.type !== 'donation'" class="btn btn-primary"
                :to="`/donation/${order.id}`">
                Donate
              </NuxtLink>
            </article>
          </div>
        </div>
      </div>
    </section>
  </main>

</template>

<style scoped lang="scss">
.box-card {
  width: 320px;
  & .article-card {
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.233);
  }
}
</style>

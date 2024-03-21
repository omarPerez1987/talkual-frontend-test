<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
});
import type { OrderListResponse } from '~/types'

const { find } = useStrapi();
const selectedType = ref<string>('all');
const orders = ref();

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
  <section class="p-3">
    <h1 class="text-center">Order List</h1>
    <div class="container">
      <div class="row">
        <div class="col">
          <label for="typeFilter" class="me-3">Filter</label>
          <select id="typeFilter" v-model="selectedType" @change="filterOrders">
            <option value="all">All</option>
            <option value="normal">Normal</option>
            <option value="donation">Donation</option>
          </select>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col">
          <div v-for="order in orders" :key="order.id" class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">SKU: {{ order.attributes.order_items.data[0].attributes.sku }}</h5>
              <p class="card-text">Type: {{ order.attributes.type }}</p>
              <p class="card-text">Quantity: {{ order.attributes.order_items.data[0].attributes.quantity }}</p>
              <p class="card-text">Shipping Firstname: {{ order.attributes.order_meta.data.attributes.shipping_firstname
                }}</p>
              <button v-if="order.attributes.type !== 'donation'" class="btn btn-primary" @click="handleDonate(order)">Donate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
});
import { OrderListResponse } from '~/types'

const { find, create } = useStrapi();

const selectedType = ref<string>('all');
const orders = ref<any>();
const toogle = ref<boolean>(false)
const idDonate = ref<number>()

const postalCode = ref<string>();
const firstName = ref<string>()

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


const submitDonationForm = async () => {
  try {
    const token = useStrapiToken()

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token._value}`
    };

    const payload = {
      order_meta: {
        shipping_postcode: postalCode.value,
        shipping_firstname: firstName.value
      }
    };

    const response = await fetch(`http://localhost:1337/api/orders/${idDonate.value}/donate`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      filterOrders()
      showModal()
      alert('Donación enviada correctamente')
    } else {
      console.error('Error:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}



const showModal = () => {
  toogle.value = !toogle.value
}

const setDonationId = (id: number) => {
  idDonate.value = id;
}

</script>


<template>
  <section v-if="!toogle" class="p-3">
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
              <button v-if="order.attributes.type !== 'donation'" class="btn btn-primary"
                @click="() => { setDonationId(order.id), showModal() }">Donate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section v-else>
  <h1 class="text-center">Make a Donation</h1>
  <article class="col border border-primary h-auto p-5">
    <form class="card-body" @submit.prevent="submitDonationForm">
      <div class="d-flex justify-content-between">
        <h5 class="card-title mb-5">Donate Form</h5>
        <button type="button" class="btn-close float-end" aria-label="Close" @click=showModal()></button>
      </div>
      <div class="mb-3">
        <label for="postalCode" class="form-label">Postal Code:</label>
        <select v-model="postalCode" class="form-select" required>
          <option value="28005">28005</option>
          <option value="08001">08001</option>
          <option value="25250">25250</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="firstName" class="form-label">Firstname:</label>
        <input v-model="firstName" type="text" class="form-control" required>
      </div>
      <div class="float-end">
        <button @click="showModal()" class="btn btn-secondary ">Close</button>
        <button type="submit" class="btn btn-primary ms-3">Save changes</button>
      </div>
    </form>
  </article>
</section>

</template>
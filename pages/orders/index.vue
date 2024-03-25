<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
});
import { OrderListResponse } from '~/types'
import { useStateOrders } from '~/stores/storeOrders'
import { onMounted } from 'vue';

const { find } = useStrapi();
const selectedType = ref<string>('all');
const orders = ref();
const isLoading = ref<boolean>(true);

const store = useStateOrders()

onMounted(async () => {
  await dataFetch();
  await filterOrders()
  isLoading.value = false;
});

const dataFetch = async () => {
  try {
    const { data } = await find<OrderListResponse>('orders', {
      populate: ['order_items', 'order_meta'],
    });
  
    //Guardo la data en el store de Pinia
    store.addOrders(data);
    
  } catch (error) {
    console.error(`Error: ${error}`)
  }
}

//filterOrders utilizará los datos desde los getters de Pinia según el valor del selector
const filterOrders = async () => {
  switch (selectedType.value) {
    case 'donation':
      orders.value = store.getDonateOrders;
      break;
    case 'normal':
      orders.value = store.getNormalOrders;
      break;
    default:
      orders.value = store.getAllOrders;
  }
}
</script>



<template>
  <main class="p-3">
    <h1 class="text-center mb-5">Order List</h1>
    <h1 v-if="isLoading">Cargando...</h1>
    <section v-else class="container">
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
            <Card :order="order"/>
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
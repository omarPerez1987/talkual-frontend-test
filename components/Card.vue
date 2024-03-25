<script setup>
defineProps(['order']);
</script>
<template>
    <article class="card-body">
        <h5 class="card-title">SKU: {{ order.attributes.order_items.data[0].attributes.sku }}</h5>
        <p class="card-text">Type: {{ order.attributes.type }}</p>
        <p class="card-text">Quantity: {{ order.attributes.order_items.data[0].attributes.quantity }}</p>
        <p class="card-text">Shipping Firstname: {{ order.attributes.order_meta.data.attributes.shipping_firstname }}</p>
        <NuxtLink v-if="order.attributes.type !== 'donation'" class="btn btn-primary" :to="`/donation/${order.id}`">
            Donate
        </NuxtLink>
    </article>
</template>

<style scoped lang="scss">
</style>
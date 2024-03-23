<script setup lang="ts">
import { Order } from "~/types";


const route = useRoute()

const postalCode = ref<string>();
const firstName = ref<string>()

/**
A.A Luis Ramirez intente hacer esta funcion utilizando el create de strapi pero me añadia 
un data{} y como en el backend se destructura order_meta me daba error porque no podia 
leerlo.
**/

const submitDonationForm = async () => {
    try {

        if (!postalCode.value || !firstName.value) {
            return alert('Por favor, rellene todos los campos obligatorios');
        }

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

        const response = await fetch(`http://localhost:1337/api/orders/${route.params.id}/donate`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('Donación enviada correctamente')
            await navigateTo('/orders')
        } else {
            console.error('Error:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


</script>

<template>
    <section>
        <h1 class="text-center">Make a Donation</h1>
        <article class="col border border-secundary card-donation">
            <form class="card-body" @submit.prevent="submitDonationForm">
                <div class="d-flex justify-content-between">
                    <h5 class="card-title mb-5">Donate Form</h5>
                    <NuxtLink :to="`/orders`" type="button" class="btn-close float-end" aria-label="Close"></NuxtLink>
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
                    <NuxtLink :to="`/orders`" class="btn btn-secondary ">Close</NuxtLink>
                    <button type="submit" class="btn btn-primary ms-3">Save changes</button>
                </div>
            </form>
        </article>
    </section>
</template>

<style scoped lang="scss">
.card-donation {
    padding: 3rem 3rem 5rem 3rem;
    margin: 0 auto;
    margin-top: 5rem;
    width: 320px;
    border-radius: 1rem;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.233);
}
</style>
import { defineStore } from "pinia";
import { OrderResponse } from "~/types";

export const useStateOrders = defineStore("stateOrders", {
  state: () => ({
    data: [] as OrderResponse[],
  }),
  getters: {
    getAllOrders: (state) => state.data,
    getNormalOrders: (state) => state.data.filter((order) => order.attributes.type === 'normal'),
    getDonateOrders: (state) => state.data.filter((order) => order.attributes.type === 'donation'),
  },
  actions: {
    addOrders(orders: OrderResponse[]) {
      this.data = orders;
    },
  },
});

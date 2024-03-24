import { defineStore } from "pinia";
import { OrderListResponse } from "~/types";

export const useStateOrders = defineStore("stateOrders", {
  state: () => ({
    data: [] as OrderListResponse[],
  }),
  getters: {
    getAllOrders: (state) => state.data,
    getNormalOrders: (state) => state.data.filter((order) => order.attributes.type === 'normal'),
    getDonateOrders: (state) => state.data.filter((order) => order.attributes.type === 'donation'),
  },
  actions: {
    addOrders(orders: OrderListResponse[]) {
      this.data = orders;
    },
  },
});

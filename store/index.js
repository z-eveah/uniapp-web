import Vue from "vue";
import Vuex from "vuex";
import pack from "./modules/pack";
import user from "./modules/user";
import express from "./modules/express";
import getters from "./getters";
Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    pack,
    user,
    express,
  },
  getters,
});

export default store;

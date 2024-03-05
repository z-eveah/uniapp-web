const express = {
  state: {
    expressInfo: {}, // 寄件地址相关信息
    checkRecordidList: [], // 选中的送检id
    expressChange: false, //  寄件地址相关信息用户是否修改了
    sampelReduceNum: 0, // 样本取消勾选的数量
  },
  mutations: {
    SET_EXPRESS_INFO(state, info) {
      state.expressInfo = info;
    },
    SET_CHECK_RECORDID_LIST(state, info) {
      state.checkRecordidList = info;
    },
    SET_EXPRESS_CHANGE(state, change) {
      state.expressChange = change;
    },
    SET_SAMPLE_REDUCE_NUM(state, info) {
      state.sampelReduceNum = info;
    },
  },
  actions: {},
};

export default express;

const getters = {
  packInfo: (state) => state.pack.packInfo,
  userInfo: (state) => state.user.userInfo,
  isSubmitWechat: (state) => state.user.isSubmitWechat,
  expressInfo: (state) => state.express.expressInfo,
  sampelReduceNum: (state) => state.express.sampelReduceNum,
  expressChange: (state) => state.express.expressChange,
  checkRecordidList: (state) => state.express.checkRecordidList,
};
export default getters;

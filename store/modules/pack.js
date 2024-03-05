const pack = {
  state: {
    packInfo:null,
    doctorInfo:null
  },
  mutations: {
    SET_PACK_INFO: (state, packInfo) => {
        state.packInfo = packInfo
    },
    SET_DOCTOR_INFO: (state, doctorInfo) => {
        state.doctorInfo = doctorInfo
    }
  },
  actions: { 
    setPackInfo({ commit }, packInfo) {
      // console.log(packInfo)
      commit('SET_PACK_INFO', packInfo)
    },
    setDoctorInfo({ commit }, doctorInfo) {
      // console.log(packInfo)
      commit('SET_DOCTOR_INFO', doctorInfo)
    }
  }
}

export default pack

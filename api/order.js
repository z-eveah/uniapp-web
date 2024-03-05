import { HTTP } from '@/service/http.js'
const $http = new HTTP()
export const getDrugDetail = (id) => {
  return $http.request({
    url: `/drug/recommendation/recommendationOrderDetail?recommendationOrderId=${id}`,
    method: 'GET',
  });
};

export const getInfoByOrderId = (orderId) => {
  return $http.request({
    url: `/trade/order/info/${orderId}`,
    method: 'GET',
  });
};


export const goodsDetail = (goodsId) => {
  return $http.request({
    url: `/store/goods/getGoodsDetailById?goodsId=${goodsId}`,
    method: 'GET',
  });
};


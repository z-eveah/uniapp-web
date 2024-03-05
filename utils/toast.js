export const toast = (str) => {
  const obj = {
    title: str || "操作成功",
    duration: 1200,
    mask: true,
    icon: "none",
  };
  setTimeout(() => {
    uni.showToast(obj);
  }, 150);
};

import sendData from "./sendData";
import { formatObject } from "./util";

import mixins from "./mixins";
let BuriedPoint = {};

const install = (Vue, options) => {
  options = formatObject(options);
  Vue.mixin(mixins(options));
};

BuriedPoint.install = install;
export default BuriedPoint;
export { sendData as sendBuriedData };

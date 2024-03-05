<template>
  <view class="address-wrap-main">
    <view class="address-main">
      <u--form
        ref="Form"
        label-position="left"
        label-width="auto"
        :label-style="labelStyle"
        :rules="rules"
        :model="addressForm"
        error-type="message"
      >
        <u-form-item label="送检人" prop="userName" border-bottom>
          <u--input
            v-model.trim="addressForm.userName"
            clearable
            placeholder="请输入送检人"
            border="none"
            placeholder-class="plo"
          />
        </u-form-item>
        <u-form-item label="手机号码" prop="mobilePhone" border-bottom>
          <u--input
            v-model.trim="addressForm.mobilePhone"
            type="tel"
            placeholder="请输入手机号码"
            clearable
            border="none"
            placeholder-class="plo"
          />
        </u-form-item>
        <u-form-item label="所在地区" prop="readonlyAddress" border-bottom @click="pickArea">
          <u--input
            v-model.trim="readonlyAddress"
            readonly
            clearable
            placeholder="请选择所在地区"
            border="none"
            type="textarea"
            rows="1"
            autosize
            placeholder-class="plo"
          />
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
        <u-form-item label="详细地址" prop="address" border-bottom>
          <u--input
            v-model.trim="addressForm.address"
            rows="1"
            autosize
            clearable
            type="textarea"
            border="none"
            placeholder="请输入详细地址"
            maxlength="100"
            placeholder-class="plo"
          />
        </u-form-item>
      </u--form>
    </view>
    <view v-if="id || edite" class="btn-wrap-edit">
      <view class="btn-main">
        <view class="btn-delete-wrap" @click="id ? (showDeleteTip = true) : (showDefaultTip = true)">
          <img class="delete-icon" src="https://test1-file.yunqueyi.com/image/png/common/20220705113106163.png" />
          <p>删除</p>
        </view>
        <view class="btn" :class="{ 'no-click': !btnCanClick }" @click="onSubmit"> 保存并使用 </view>
      </view>
    </view>
    <view v-else class="btn-wrap-add">
      <view class="btn" :class="{ 'no-click': !btnCanClick }" @click="onSubmit"> 保存并使用 </view>
    </view>
    <pickAddressModel
      v-if="showArea"
      :default-pick="selectPicker"
      @onConfirm="onConfirm"
      @onCancel="onCancel"
    ></pickAddressModel>
    <u-modal
      :show="showDeleteTip"
      :content="deleteContent"
      :show-cancel-button="true"
      confirm-color="#00BDA5"
      cancel-color="#00BDA5"
      @cancel="showDeleteTip = false"
      @confirm="deleteConfirmFn"
    ></u-modal>
    <u-modal
      :show="showDefaultTip"
      :content="defaultContent"
      confirm-color="#00BDA5"
      @cancel="showDefaultTip = false"
    ></u-modal>
  </view>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import { deleteAddress, saveAddress } from "@/api/address.js";
import pickAddressModel from "@/components/pick-address-model/modal.vue";
export default {
  name: "ChangeAddress",
  components: {
    pickAddressModel,
  },
  data() {
    return {
      id: "", // 地址id 有id编辑 否则新增
      edite: "",
      hospitalId: "",
      btnCanClick: false,
      showLoading: false,
      showArea: false,
      areaLoading: false,
      areaColumns: [],
      oldUserName: "",
      oldAddress: "",
      deleteContent: "确定删除地址吗？",
      defaultContent: "机构默认地址,不可删除",
      rules: {
        userName: [
          {
            required: true,
            message: "送检人不能为空",
            // blur和change事件触发检验
            trigger: ["blur", "change"],
          },
          {
            pattern: /^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/g,
            // 正则检验前先将值转为字符串
            transform(value) {
              return String(value);
            },
            message: "请输入正确格式",
          },
          {
            min: 2,
            max: 11,
            message: "送检人长度2-20位！",
          },
        ],
        mobilePhone: [
          {
            required: true,
            message: "手机号码不能为空",
            // blur和change事件触发检验
            trigger: ["blur", "change"],
          },
          {
            pattern: /^[0-9]*$/g,
            // 正则检验前先将值转为字符串
            message: "只能包含数字",
          },
          {
            max: 11,
            message: "手机号码不能超过11位",
          },
        ],
        address: [
          {
            required: true,
            message: "详细地址不能为空",
            // blur和change事件触发检验
            trigger: ["blur", "change"],
          },
          {
            pattern: /^[\u4E00-\u9FA5A-Za-z0-9_ .,，。！!`·;；‘'"“（）「」、｜@#()<>{}]+$/g,
            // 正则检验前先将值转为字符串
            transform(value) {
              return String(value);
            },
            message: "不能输入特殊符号和表情！",
          },
        ],
      },
      selectPicker: {
        value: [],
        label: "",
      },
      addressForm: {
        id: null,
        userName: "",
        mobilePhone: "",
        provinceId: "",
        provinceName: "",
        cityId: "",
        cityName: "",
        countyId: "",
        countyName: "",
        townId: "",
        townName: "",
        address: "",
        lastUsed: 0, // 是否是默认地址：0否 1是
      },
      checked: true,
      showDeleteTip: false,
      showQuitTip: false,
      showDefaultTip: false,
      deleteTipMsg: {
        title: "",
        desc: "确定删除地址吗?",
        leftBtn: "取消",
        rightBtn: "确定",
      },
      quitTipMsg: {
        title: "确认退出",
        desc: "退出后将不会保存当前页面资料,是否确认退出?",
        leftBtn: "退出",
        rightBtn: "取消",
      },
      defaultTipMsg: {
        title: "",
        desc: "机构默认地址,不可删除",
        leftBtn: "我知道了",
      },
      labelStyle: {
        "font-size": "14px",
        color: "#212121",
      },
    };
  },
  computed: {
    ...mapGetters(["expressInfo", "userInfo"]),
    readonlyAddress() {
      return (
        this.addressForm.provinceName +
          this.addressForm.cityName +
          this.addressForm.countyName +
          this.addressForm.townName || ""
      );
    },
  },
  watch: {
    addressForm: {
      handler(newVal) {
        console.log(newVal);
        const { userName, mobilePhone, provinceName, address } = newVal;
        this.btnCanClick = userName && mobilePhone && provinceName && address;
      },
      deep: true,
    },
  },
  onLoad(options) {
    console.log(1111111, options);
    const { id = "", hospitalId = "", edite = "" } = options;
    this.hospitalId = hospitalId;
    this.id = id;
    this.edite = edite;
    this.init();
  },
  onReady() {
    this.$refs.Form.setRules(this.rules);
  },
  methods: {
    ...mapMutations({
      setExpressInfo: "SET_EXPRESS_INFO",
      setExpressChange: "SET_EXPRESS_CHANGE",
    }),
    init() {
      // id表示编辑，但是机构备份地址（无id），所以新增edite表示编辑状态
      // const { id = "", hospitalId = "", edite = "" } = this.$route.query;
      // this.id = id;
      // this.hospitalId = hospitalId;
      // this.edite = edite;
      // this.headerInfo.title = this.id || edite ? "编辑送检地址" : "新增送检地址";
      if (this.id || this.edite) {
        console.log(this.expressInfo, this.userInfo);
        this.addressForm = JSON.parse(JSON.stringify(this.expressInfo));
        uni.setNavigationBarTitle({
          title: "编辑送检地址",
        });
      } else {
        uni.setNavigationBarTitle({
          title: "新增送检地址",
        });
      }
    },
    changeUserName(value) {
      console.log(value);
      if (value) {
        const newv = value.match(/^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/);
        if (newv && newv[0]) {
          this.oldUserName = newv[0];
        }
      } else {
        this.oldUserName = value;
      }
      return this.oldAddress;
    },
    changeMobilePhone(value) {
      return value.replace(/[^\d]/g, "");
    },
    changeAddress(value) {
      console.log(value);
      if (value) {
        const newv = value.match(/^[\u4E00-\u9FA5A-Za-z0-9_]+$/);
        console.log(newv);
        if (newv == null) {
          console.log(value.length);
          // return value.substr(0, value.length - 1);
        }
      } else {
        return value;
      }
      return value;
      // return value.replace(/^[\u4E00-\u9FA5A-Za-z0-9_]+$/, '');
    },
    onConfirm(parm) {
      const address = parm.label.split(" ");
      this.addressForm.provinceName = address[0] || "";
      this.addressForm.provinceId = parm.value[0] || "";
      this.addressForm.cityName = address[1] || "";
      this.addressForm.cityId = parm.value[1] || "";
      this.addressForm.countyName = address[2] || "";
      this.addressForm.countyId = parm.value[2] || "";
      this.addressForm.townName = address[3] || "";
      this.addressForm.townId = parm.value[3] || "";
      this.showArea = false;
    },
    onCancel() {
      this.showArea = false;
    },
    // 显示三级联动
    pickArea() {
      console.log(111);
      this.showArea = true;
    },
    // 校验提交信息
    onSubmit() {
      // const { userName, mobilePhone, provinceName, address } = this.addressForm;
      // if (!/^[\u4E00-\u9FA5A-Za-z0-9_]+$/.test(address)) {
      //   return this.$toast('地址不能含有特殊字符哦');
      // }
      if (!this.btnCanClick) {
        return;
      }
      this.$refs.Form.validate()
        .then(() => {
          this.setExpressInfo(this.addressForm);
          this.setExpressChange(true);

          const params = {
            ...this.addressForm,
            id: this.id,
            bizType: 2, // bizType=1 crm入口，bizType=2 app入口
            hospitalId: this.hospitalId,
          };
          saveAddress(params)
            .then((res) => {
              if (res.code == "000000") {
                if (this.id) {
                  this.$toast("修改成功");
                } else {
                  this.$toast("新增成功");
                }
                uni.navigateBack({ delta: 2 });
                console.log("123");
              } else {
                this.$toast("请稍后重试");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((e) => {
          this.$toast(e[0].message || "请输入正确信息");
        });
    },
    back() {
      this.showQuitTip = true;
    },
    deleteCancleFn() {
      this.showDeleteTip = false;
    },
    // 确认删除
    deleteConfirmFn() {
      this.showDeleteTip = false;
      deleteAddress(this.id)
        .then((res) => {
          console.log(res);
          if (res.code == "000000") {
            this.$toast("删除成功");
            let pages = getCurrentPages(); //当前页
            let beforePage = pages[pages.length - 2]; //上个页面
            uni.navigateBack({
              delta: 1,
              success: () => {
                beforePage.onLoad(beforePage.options); // 传入参数
                beforePage.onReady();
              },
            });
          } else {
            this.$toast("删除失败，请稍后重试");
          }
        })
        .catch((err) => {
          console.log("err---", err);
          this.$toast("删除失败，请稍后重试");
        });
    },
    // 退出
    quiteOutFn() {
      this.showQuitTip = false;
      this.$router.go(-1);
    },
    quiteCancleFn() {
      this.showQuitTip = false;
    },
    closeDefaultFn() {
      this.showDefaultTip = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>

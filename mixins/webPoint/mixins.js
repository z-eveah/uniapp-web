import { ACTIONS } from './util';
import sendData from './sendData';
const menuCodeList = require('./menuCode.json');
// 获取 getComponentTag
function getComponentTag(urlInfo){
   //cbType   如果回调类型自定义 getComponentTag
  // urlInfo  地址信息
  for(let i=0;i<menuCodeList.length;i++){
     if(menuCodeList[i].url==urlInfo.url){
        let title=(urlInfo.title) || menuCodeList[i].title;
        let lastCtag=`#${urlInfo.url}#0`;
        if(title){
          lastCtag=lastCtag+"#"+title
        };
        return (menuCodeList[i].menuCode)+lastCtag
     }
  };
  return ""
};
export default (sOtions) =>{
    return {
        onShow(){
           this.webPointLoading(ACTIONS.pageIn);
        },
        methods:{
          // ...mapActions(["getUserInfo"]),
          webPointLoading(actionType){
              const pages = getCurrentPages() //加载的页面
              const currentPage = pages[pages.length - 1] //获取当前页面的对象
              const url = currentPage && currentPage.route;
              // const options = currentPage.options  //url中传的参数
              new Promise(function(resolve,reject){
                  const obj={
                    title:'',
                    url:url,
                  }
                  sOtions.component_tag=getComponentTag(obj)
                  resolve()
              }).then(function(){
                  sendData({ action: actionType, ...sOtions},"enter");
              });
          }
        }
    }
  
}

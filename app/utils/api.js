import * as appConfig from '../configs/appConfig.js';

/**
 * 获取验证码
 */
const picCaptcha = {
    /**
     * 获取验证码
     * http://119.23.155.182:9014/swagger-ui.html#!/%E5%9B%BE%E7%89%87%E9%AA%8C%E8%AF%81%E7%A0%81%E6%A8%A1%E5%9D%97/getPicCaptchaUsingGET
     */
    getPicCaptcha: `${appConfig.apiPrefix}/api/picCaptcha/getPicCaptcha`,
}

/**
 * 七牛上传接口
 */
const qiniu = {
    /* 表单上传返回单图片地址 */
    uploadToQiniu: `${appConfig.apiPrefix}/api/module/qiniu/uploadToQiniu`,
    getQiniuToken: `${appConfig.apiPrefix}/api/module/qiniu/token`,
}

/**
 * 管理员模块 : Manager Controller
 * http://119.23.155.182:9037/swagger-ui.html#/管理员管理模块
 */ 
const Manager = {
    manager: `${appConfig.apiPrefix}/api/manager`,
    managerLogin: `${appConfig.apiPrefix}/api/manager/login`,
}

/**
 * 用户模块 : User Controller
 * http://119.23.155.182:9037/swagger-ui.html#/平台用户模块
 */ 
const user = {
    user: `${appConfig.apiPrefix}/api/admin/user`,

    /* 禁用 put */
    operateUser: `${appConfig.apiPrefix}/api/admin/user/operateUser`
}

/* 主分类模块 */
const Category = {
    category: `${appConfig.apiPrefix}/api/category`,
}

/* 次分类模块 */
const SecondCategory = {
    secondCategory: `${appConfig.apiPrefix}/api/secondCategory`,
    secondCategoryPage: `${appConfig.apiPrefix}/api/secondCategory/page`,
}

/**
 * 小区模块
 * http://119.23.155.182:9037/swagger-ui.html#/后台管理小区模块
 */
const District = {
    /* 获取小区全部（无分页） */
    DistrciGetList : `${appConfig.apiPrefix}/api/admin/district/getList`,
    district : `${appConfig.apiPrefix}/api/admin/district`,
    frozen : `${appConfig.apiPrefix}/api/admin/district/frozen`,
}

/**
 * 订单模块 :
 * http://119.23.155.182:9037/swagger-ui.html#/平台用户模块
 */ 
const Order = {
    Order: `${appConfig.apiPrefix}/api/admin/order`,
    lessRecord: `${appConfig.apiPrefix}/api/admin/order/lessRecord`,
    orderExport: `${appConfig.apiPrefix}/api/admin/order/orderExport`,
    // 获取需要派送订单数量
    findOrderNumNeedSend: `${appConfig.apiPrefix}/api/admin/order/findOrderNumNeedSend`,
    // 获取超时未派送订单数量
    findOrderNumNotSend: `${appConfig.apiPrefix}/api/admin/order/findOrderNumNotSend`
}

/* 首页轮播 */
const Banner = {
    banner : `${appConfig.apiPrefix}/api/admin/banner`,
    findBanner : `${appConfig.apiPrefix}/api/admin/banner/findBanners`,
}

/* 商品模块 */
const Goods = {
    goods : `${appConfig.apiPrefix}/api/admin/goods`,
    operateGoods : `${appConfig.apiPrefix}/api/admin/goods/operateGoods`,
    
}

/* 提现申请模块 */
const CashRecord = {
    CashRecord : `${appConfig.apiPrefix}/api/admin/finance/cashRecord`,
    updateCashRecord : `${appConfig.apiPrefix}/api/admin/finance/updateCashRecord`
}
/* 产品经理模块 */
const  ProductManager = {
    productManager : `${appConfig.apiPrefix}/api/admin/productManager`,
    productManagerAdd : `${appConfig.apiPrefix}/api/admin/productManager/add`,
    productManagerUpdata : `${appConfig.apiPrefix}/api/admin/productManager/update`,
    productManagerDelete : `${appConfig.apiPrefix}/api/admin/productManager/delete`
}
/* 仓库模块 */
const Warehouse = {
    warehouse : `${appConfig.apiPrefix}/api/admin/warehouse`,
    warehouseList : `${appConfig.apiPrefix}/api/admin/warehouse/warehouseList`,
}
/* 热搜模块 */
const Keywords = {
    keywords : `${appConfig.apiPrefix}/api/admin/keywords`,
}
/* 资讯模块 */
const Article = {
    article : `${appConfig.apiPrefix}/api/admin/article`,
}
/* 营销分类 */
const SaleSort = {
    saleSort : `${appConfig.apiPrefix}/api/admin/saleSort`,
    //添加、删除分类商品
    addSortGoods : `${appConfig.apiPrefix}/api/admin/saleSort/addSortGoods`,
    //查找分类下的商品
    findSaleSortGoods : `${appConfig.apiPrefix}/api/admin/saleSort/findSaleSortGoods`,
    deleteSortGoods : `${appConfig.apiPrefix}/api/admin/saleSort/deleteSortGoods`,
    //banner
    saleSortBanner : `${appConfig.apiPrefix}/api/admin/saleSort/saleSortBanner`,
}


const API = {
    ...picCaptcha,
    ...Manager,
    ...qiniu,
    ...user,
    ...District,
    ...Order,
    ...Banner,
    ...Category,
    ...SecondCategory,
    ...Goods,
    ...CashRecord,
    ...ProductManager,
    ...Warehouse,
    ...Keywords,
    ...Article,
    ...SaleSort,
}

export default API;

import routePath from './routePath.js';
/**
 * 面板屑
 */
const breadcrumbConfig = {
    [routePath.App]: '首页',
    [routePath.Admin]: '权限管理',
    [routePath.User]: '用户管理',
    [routePath.Banner]: 'Banner管理',
    [routePath.Type]: '商品分类',
    [routePath.Goods]: '商品模块',
    [routePath.District]: '小区模块',
    [routePath.Order]: '订单模块',
    [routePath.Withdraw]: '提现申请模块',
    [routePath.Manager]: '产品经理模块',
    [routePath.Warehouse]: '仓库模块',
    [routePath.Keywords]:'热搜模块',
    [routePath.Article]: '平台资讯模块',
    [routePath.SaleSort1]: '营销1',
    [routePath.SaleSort2]: '营销2',
    [routePath.SaleSort3]: '营销3',
    [routePath.SaleSort4]: '营销4',
};

export default breadcrumbConfig;

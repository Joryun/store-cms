import routePath from './routePath.js';

import Login from 'pages/Login/Login.js';
import App from 'App.js';

import Admin from 'pages/Admin/Admin.js';
import User from 'pages/User/User.js';
import Banner from 'pages/Banner/Banner.js';
import Type from 'pages/Type/Type.js';
import District from 'pages/District/District.js';
import Goods from 'pages/Goods/Goods.js';
import Order from 'pages/Order/Order.js';
import Withdraw from 'pages/Withdraw/Withdraw.js';
import Manager from 'pages/Manager/Manager.js';
import Warehouse from 'pages/Warehouse/Warehouse.js';
import Keywords from 'pages/Keywords/Keywords.js';
import Article from 'pages/Article/Article.js';
import SaleSort1 from 'pages/SaleSort/SaleSort1/SaleSort1.js';
import SaleSort2 from 'pages/SaleSort/SaleSort2/SaleSort2.js';
import SaleSort3 from 'pages/SaleSort/SaleSort3/SaleSort3.js';
import SaleSort4 from 'pages/SaleSort/SaleSort4/SaleSort4.js';

export const mainRoute = [
    {
        path: routePath.Login,
        component: Login,
    },
    {
        path: routePath.App,
        component: App,
    },
];

export const appRoute = [
    {
        path: routePath.Admin,
        component: Admin,
        managerRole: ['ADMIN'],
    },
    {
        path: routePath.User,
        component: User,
        managerRole: ['ADMIN', 'SIMPLE'],
    },
    // {
    //     path: routePath.Banner,
    //     component: Banner,
    //     managerRole: ['admin', 'simple'],
    // },
    {
        path: routePath.Type,
        component: Type,
        managerRole: ['ADMIN', 'SIMPLE'],
    },
    // {
    //     path: routePath.District,
    //     component: District,
    //     managerRole: ['admin', 'simple'],
    // },
    {
        path: routePath.Goods,
        component: Goods,
        managerRole: ['ADMIN', 'SIMPLE', 'SHOP'],
    },
    {
        path: routePath.Order,
        component: Order,
        managerRole: ['ADMIN', 'SIMPLE', 'SHOP'],
    },
    // {
    //     path: routePath.Withdraw,
    //     component: Withdraw,
    //     managerRole: ['admin', 'simple'],
    // },
    {
        path: routePath.Manager,
        component: Manager,
        managerRole: ['ADMIN', 'SIMPLE'],
    },
    // {
    //     path: routePath.Warehouse,
    //     component: Warehouse,
    //     managerRole: ['ADMIN', 'SIMPLE'],
    // },
    // {
    //     path: routePath.Keywords,
    //     component: Keywords,
    //     managerRole: ['admin','simple'],
    // },
    // {
    //     path: routePath.Article,
    //     component: Article,
    //     managerRole: ['admin','simple'],
    // },
    // {
    //     path: routePath.SaleSort1,
    //     component: SaleSort1,
    //     managerRole: ['admin','simple'],
    // },
    // {
    //     path: routePath.SaleSort2,
    //     component: SaleSort2,
    //     managerRole: ['admin','simple'],
    // },
    // {
    //     path: routePath.SaleSort3,
    //     component: SaleSort3,
    //     managerRole: ['admin','simple'],
    // },
    // {
    //     path: routePath.SaleSort4,
    //     component: SaleSort4,
    //     managerRole: ['admin','simple'],
    // }
];


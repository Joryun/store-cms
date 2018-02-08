import routePath from './routePath.js';
/**
 * 侧边栏
 */

const sidebarConfig = [
    {
        label: '商城管理',
        pathAndKey: 'b',
        managerRole: ['ADMIN', 'SIMPLE', 'SHOP'],
        childs: [
            {
                label: '产品分类',
                pathAndKey: routePath.Type,
                managerRole: ['ADMIN', 'SIMPLE'],
            },

            {
                label: '产品管理',
                pathAndKey: routePath.Goods,
                managerRole: ['ADMIN', 'SIMPLE', 'SHOP'],
            },
            // {
            //     label: '热搜管理',
            //     pathAndKey: routePath.Keywords,
            //     managerRole: ['admin', 'simple'],
            // },
            // {
            //     label: '热销商品管理',
            //     pathAndKey: routePath.SaleSort1,
            //     managerRole: ['admin', 'simple'],
            // },
            // {
            //     label: '时令商品管理',
            //     pathAndKey: routePath.SaleSort2,
            //     managerRole: ['admin', 'simple'],
            // },
            // {
            //     label: '促销商品管理',
            //     pathAndKey: routePath.SaleSort3,
            //     managerRole: ['admin', 'simple'],
            // },
            // {
            //     label: '进口商品管理',
            //     pathAndKey: routePath.SaleSort4,
            //     managerRole: ['admin', 'simple'],
            // }
        ],
    },
    // {
    //     label: '小区管理',
    //     pathAndKey: 'c',
    //     managerRole: ['admin', 'simple'],
    //     childs: [
    //         {
    //             label: '首页banner管理',
    //             pathAndKey: routePath.Banner,
    //             managerRole: ['admin','simple'],
    //         },
    //         {
    //             label: '小区管理',
    //             pathAndKey: routePath.District,
    //             managerRole: ['admin','simple'],
    //         },
    //         {
    //             label: '资讯管理',
    //             pathAndKey: routePath.Article,
    //             managerRole: ['admin', 'simple'],
    //         },
    //     ],
    // },
    // {
    //     label: '仓库管理',
    //     pathAndKey: routePath.Warehouse,
    //     managerRole: ['admin', 'simple'],
    // },
    {
        label: '订单管理',
        pathAndKey: routePath.Order,
        managerRole: ['ADMIN', 'SIMPLE', 'SHOP'],
    },
    // {
    //     label: '提现申请管理',
    //     pathAndKey: routePath.Withdraw,
    //     managerRole: ['admin', 'simple'],
    // },
    // {
    //     label: '产品经理管理',
    //     pathAndKey: routePath.Manager,
    //     managerRole: ['admin', 'simple'],
    // },
    {
        label: '用户管理',
        pathAndKey: routePath.User,
        managerRole: ['ADMIN', 'SIMPLE'],
    },
    {
        label: '权限管理',
        pathAndKey: 'a',
        managerRole: ['ADMIN'],
        childs: [
            {
                label: '系统权限管理',
                pathAndKey: routePath.Admin,
                managerRole: ['ADMIN'],
            },
        ],
    },
];

export default sidebarConfig;

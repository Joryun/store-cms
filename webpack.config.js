let path = require('path');
let fs = require('fs');

let kitUtils = require('./kit_config/kit_utils');

let webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin'); /* 将css代码单独打包出来 */
let HtmlwebpackPlugin = require('html-webpack-plugin'); /* 该模块帮助生成 HTML 文件 */
let OpenBrowserPlugin = require('open-browser-webpack-plugin'); /* 自动打开浏览器 */

let ROOT_PATH = path.resolve(__dirname);
let APP_PATH = path.resolve(ROOT_PATH, 'app');
let BUILD_PATH = path.resolve(ROOT_PATH, 'build');

const WEBPACK_GLOBAL_CONFIG = kitUtils.getGlobalConfig(`${ROOT_PATH}/kit_config/webpack_global_config.json`),
    GET_LOCAL_IP_PARAMS = WEBPACK_GLOBAL_CONFIG.getLocalIPParams,
    IP = kitUtils.getLocalIP(GET_LOCAL_IP_PARAMS.ip, GET_LOCAL_IP_PARAMS.mac, GET_LOCAL_IP_PARAMS.name);

const WEBPACK_CONFIG = {
    /**
     * 设置externals
     * @return {[Object]} externals
     */
    setExternals: () => {
        let externals = {};

        // externals.Swiper = 'Swiper';

        return externals;
    },

    setDevServer: (webpackGlobalConfig) => {
        let devServer = {};

        const PORT = webpackGlobalConfig.PORT,
            PROXY = webpackGlobalConfig.proxy;

        devServer.contentBase = BUILD_PATH;
        devServer.clientLogLevel = 'none';
        devServer.historyApiFallback = true;
        devServer.host = IP;
        devServer.port = PORT;

        if (PROXY.isNeed) {
            devServer.proxy = PROXY.matchObj;
        }

        return devServer;
    },

    /**
     * loaders
     * @return {[Array]} loaders
     */
    setRules: () => {
        let rules = [];

        /* ES6、ES7，JSX转码 */
        rules.push({
            test: /\.jsx?$/,
            use: 'babel-loader',
            include: APP_PATH,
        });

        /* 图片loader */
        rules.push({
            test: /\.(png|jpg)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: '[name].[ext]',
                    },
                },
            ],
            include: APP_PATH,
        });

        /* Sass */
        rules.push({
            test: /\.scss$/,
            use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    'css-loader?modules,camelCase,localIdentName="[local]-[hash:base64:6]"',
                    'sass-loader',
                ],
            })),
            include: APP_PATH,
        });

        /* ant-design需要引入该库的css文件  */
        rules.push({
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        });

        return rules;
    },

    /**
     * plugins
     * @return {[Array]} plugins
     */
    setPlugins(environment, webpackGlobalConfig, isUseOpenBrowserPlugin) {
        let plugins = [];

        const PORT = webpackGlobalConfig.PORT,
            OPEN_BROWSER_PLUGIN_URL = `http://${IP}:${PORT}`;

        /* 此插件将环境变量的值写入到js变量中 */
        plugins.push(
            new webpack.DefinePlugin({
                __ENV__: JSON.stringify(environment),
            })
        );

        /* 将css代码单独打包出来， */
        plugins.push(
            new ExtractTextPlugin('app.css')
        );

        /* 自动创建HTML文件 */
        plugins.push(
            new HtmlwebpackPlugin({
                title: 'Yo商城管理后台',
                template: path.resolve(APP_PATH, 'template.ejs'),
                favicon: path.resolve(ROOT_PATH, 'favicon.ico'),
                filename: 'index.html',
                hash: true,
                inject: 'body',
            })
        );

        /* 在webpack-dev-server启动时，在浏览器自动打开一个新的页签 */
        isUseOpenBrowserPlugin && plugins.push(
            new OpenBrowserPlugin({
                url: OPEN_BROWSER_PLUGIN_URL,
            })
        );

        return plugins
    },
};

/**
 * 
 * @param {Object} env webpack参数中设置的环境变量
 */
module.exports = function(env) {
    let {
        environment = 'localDev', /* localDev -- 本地开发环境；serverDev -- 测试服务器环境；pro -- 正式服务器环境 */
    } = env;

    let isOpenSourceMap = (environment === 'localDev'),
        isUseOpenBrowserPlugin = (environment === 'localDev');

    return {
        entry: {
            app: path.resolve(APP_PATH, 'main.js')
        },

        output: {
            path: BUILD_PATH,
            publicPath: '/',
            filename: 'bundle.js'
        },

        resolve: {
            modules: ['node_modules', APP_PATH],
            extensions: ['.web.js', '.js', '.json']
        },

        /* 开发环境下开启sourceMap技术 */
        devtool: isOpenSourceMap ? 'inline-source-map' : '',

        // externals: WEBPACK_CONFIG.setExternals(),

        /* webpack-dev-server的配置 */
        devServer: WEBPACK_CONFIG.setDevServer(WEBPACK_GLOBAL_CONFIG),

        module: {
            rules: WEBPACK_CONFIG.setRules(),
        },

        plugins: WEBPACK_CONFIG.setPlugins(environment, WEBPACK_GLOBAL_CONFIG, isUseOpenBrowserPlugin),
    };
};

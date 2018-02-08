# react kit

## 简要说明
### 支持
1. ES6
1. ES7对象展开符
1. `Fetch` API
1. ES7的async 函数（[async 函数的含义和用法](http://www.ruanyifeng.com/blog/2015/05/async.html) [目前最好的 JavaScript 异步方案 async/await](http://www.open-open.com/lib/view/open1448198037181.html)）
1. JSX使用 `if-else` 表达式
1. Sass
1. http-proxy（解决跨域问题，详细解释见[Webpack dev server使用http-proxy解决跨域问题](http://www.jianshu.com/p/3bdff821f859)）

### 安装
- 执行 `SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/ yarn add node-sass -D`便可以安装所有依赖
    - ps，这里不知道为什么这样
    - 另外，在 windows 下，只能在 [git bash](https://git-scm.com/) 命令行上才能执行上述命令

***

## 使用说明
步骤：

1. 配置 `/kit_config/webpack_global_config.json` 文件（webpack 的配置参数）
    - 具体字段含义见该文件里的注释
1. 配置 `/kit_config/app_global_config.json` 文件（app 的配置参数）
    - 具体字段含义见该文件里的注释
1. 配置 `/kit_config/sftp_config.json` 文件
    - 因为该文件包含服务器的账号密码，所有不可以添加到 git 中跟踪（`.gitignore` 忽略了这个文件）
    - 所以需要手动创建这个文件（详细见文末，附件）（**现在不需要手动创建，在该目录下已经有一份模板**）
    - 直接创建该文件并复制附件中的内容即可
1. 使用 `npm run start` 启动 webpack-dev-server，进行开发
1. 正式发布的步骤：
    - 使用 `npm run build` 打包代码
    - 使用 `npm run sftp` 将代码发布上服务器

***

## 框架说明
### `/src/lib/`
此目录收录了**各项目**都通用的代码。

其中：
- `_fetch.js`
    - 对 fetch 的封装，实现了 timeout 处理
- `lib.js`
    - 杂项，不好分出单独一个文件时全部可以放在这里
    - 建议，对于可以经得起时间考验的代码，都建议单独出一个文件

### `/src/utils/`
此目录，存放于特定项目相关的通用代码，包括 api等

其中：
- `callFetch.js`
    - 对 `/src/lib/_fetch.js` 的再次封装，在项目中可以直接调用
    - 可以修改此函数，做不同项目的定制化

***

## 附件
### `/kit_config/global_config.json`
```json
{
    /* 标志上传的模式 */
    /* 即为下面的 all、onlyChange、custom 三种方式 */
    "module": "onlyChange",

    "config": {
        "host": "xxxx",
        "user": "xxxx",
        "pass": "xxxx",
        "remotePath": "xxxx"
    },

    /* 上传所有文件 */
    "all": "./build/**",

    /* 仅上传变化的文件：bundle.js app.css index.html */
    "onlyChange": [
        "./build/bundle.js",
        "./build/app.css",
        "./build/index.html"
    ],

    /* 用户自定义上传的内容 */
    "custom": [
        
    ]
}
```

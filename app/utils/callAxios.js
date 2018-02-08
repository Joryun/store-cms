import axios from 'axios';
import { message } from 'antd';
import * as appConfig from '../configs/appConfig.js';
import * as utils from './utils';

Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
        value  => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
    );
};

const callAxios = async (opts = {}) => {
    let {
        that = null,
        url = '',
        method = 'get',
        headers = null,
        timeout = appConfig.timeout * 1000, /* 超时等待时间，默认使用全局配置的 */
        responseType = 'json',
        data = null,
        isUseErrorResponseTip = true, /* 是否使用通用提示，如果设置了false，请在Promise的错误处理中捕获异常并提示 */
    } = opts;

    let token = utils.getSSItem('token', true) || '';

    let param = {
        url: url,
        method: method,
        headers: {
            ...headers,
            'Authorization': `token ${token}`,
        },
        responseType: responseType,
        timeout: timeout, /* 这个是设置axios的超时时间 */
    };

    data && (param.data = data);

    try {
        return await axios(param);
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx

            // 这了估计是拦截3xx/4xx/5xx，注意超时不在这里
            isUseErrorResponseTip && errorResponseTip(error.response, that);

            return Promise.reject(error.response);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js

            // 这里有超时
            // debugger
            console.log(error.request);

            return Promise.reject(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            // debugger
            console.log('Error', error.message);

            return Promise.reject(error.message);
        }
        return Promise.reject('error');
    }
};

const errorResponseTip = (response, that) => {
    let {
        status = 400,
        data = {},
    } = response;

    let {
        code = '',
        msg = '出错啦',
    } = data;

    message.error(msg, 2, () => {
        /* 权限不足时跳转去登录页面 */
        (status == 401) && (that) && that.props.history.replace('/Login');
    });
};

export default callAxios;

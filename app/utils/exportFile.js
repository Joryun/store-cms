import callAxios from './callAxios.js';

import {
    message,
} from 'antd';

const exportFile = (opts) =>  {
    let {
        that,
        api,
        method = 'get',
        fileNamePrefix = '',
        finallyCB = null,
    } = opts;

    callAxios({
        that: that,
        method: method,
        url: api,
        responseType: 'blob',
    })
    .then((response) => {
        let {
            headers,
            data,
        } = response;

        let contentDisposition = headers['content-disposition'] || '',
            fileName = contentDisposition.split('filename=')[1] || '', /* 在headers中获取文件名 */
            aEle = document.createElement('a'),
            url = window.URL.createObjectURL(data);

        if (fileName === '') {
            message.error('文件出错啦！');
            return;
        }

        fileName = decodeURIComponent(fileName);
        fileName = `${fileNamePrefix}${fileName}`;

        aEle.href = url;
        aEle.download = fileName;
        aEle.click();
        window.URL.revokeObjectURL(url);
    })
    .finally(() => {
        finallyCB && finallyCB();
    });
};

export default exportFile;

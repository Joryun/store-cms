/*
 * app全局配置文件
 */


/* 程序调用接口的前缀 */
// export const apiPrefix = `http://116.62.113.4:9065`;
export const apiPrefix = `http://127.0.0.1:9065`;

/* 异步请求接口超时的时长，以秒作为单位 */
export const timeout = `30`;

/* 分页，每页的条数 */
export const pageableSize = 10;

/* 登录之后去到的页面 */
export const loginToIndex = '/App';

/* 日期默认的格式化显示 */
export const dateFormat = 'YYYY-MM-DD';

/* 串字符串时的分割符 */
/* 例如：教师1、教师2 */
export const bunchStrsSeparator = '、';


/* 七牛bucket空间名称 */
export const qiniuBucket = 'joryun-qiniu';
export const qiniuDomain = 'http://osnwk5h1c.bkt.clouddn.com';
export const qiniuUploadApi = '//upload-z2.qiniu.com/';


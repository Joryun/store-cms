import moment from 'moment';
import uuid from 'uuid';
import * as appConfig from 'configs/appConfig';

/**
 * 设置sessionStorage
 * @param {*} key 
 * @param {*} value 
 */
export const setSSItem = (key, value, isLocalStorage = true) => {
    isLocalStorage ?
    localStorage.setItem(key, JSON.stringify(value)) :
    sessionStorage.setItem(key, JSON.stringify(value)); /* 需要将 Object 转成字符串 */
};

/**
 * 获取sessionStorage
 * @param {String} key 需要获取的 key
 * @param {Boolean} isNeedJsonParse 是否需要使用 JSON.parse 转换结果
 */
export const getSSItem = (key, isNeedJsonParse = true, isLocalStorage = true) => {
    let val = '';

    val = isLocalStorage ?
            localStorage.getItem(key) :
            sessionStorage.getItem(key);

    return isNeedJsonParse ? JSON.parse(val) : val;
};

export const momentFormat = (key = '', format = appConfig.dateFormat) =>  {
    return (key === '') ? '' : moment(key).format(format);
};

export const bunchStrs = (strings = [], subAttr = null) => {
    let result = '';

    strings.forEach((item) => {
        if (!item) return;
        
        result += `${subAttr !== null ? item[subAttr] || '' : item || ''}、`;
    });

    return result.slice(0, result.length - 1);
};

/**
 * money的装换（后台保存的单位是：分）
 * @param {Number} value money的数值
 * @param {Boolean} isShift true - 用来显示给用户， false - 用来传递给后台
 */
export const shiftMoney = (value = 0, isShift = true) =>  {
    (!value) && (value = 0);

    if (isShift) {
        return (value / 100).toFixed(2);
    } else {
        return Math.ceil(value * 100);
    }
};

/**
 * 将对象转成 FormData
 * @param {Object} tarObj
 */
export const toFormData = (tarObj) => {
    let formData = new FormData(),
        key = '',
        objKeys = Object.keys(tarObj);

    for (key of objKeys) {
        formData.append(key, tarObj[key]);
    }

    return formData;
};

/**
 * 装换area的各个字段的key-value键值对
 * @param {*} list 需要装换的数据
 * @param {*} labelAttr label的属性名
 * @param {*} valueAttr value的属性名
 * @param {*} childAttr children的属性名
 */
export const amendArea = (list = [], labelAttr = 'label', valueAttr = 'value', childAttr = 'children') => {
    let item = null,
        temp = {},
        result = [],
        subChildren = null;

    for (item of list) {
        temp = {};
        subChildren = item.sub || []; // ! item.sub中的sub，根据具体情况而定

        temp[labelAttr] = item.name; // ! item.name中的name，根据具体情况而定
        temp[valueAttr] = item.code; // ! item.code中的code，根据具体情况而定
        temp[childAttr] = [];

        if (subChildren.length !== 0) {
            temp[childAttr] = amendArea(subChildren);
        }

        result.push(temp);
    }

    return result;
};

/**
 * 根据value查找label
 * @param {*} list 待搜索的数组
 * @param {*} value 需要查找对应label的value
* @param {*} keys 数据中项的key
 */
export const searchLabel = (list = [], value = '', keys = { label: 'label', value: 'value', children: 'children' }) =>  {
    let item = null,
        result = null,
        subChildren = null;

    for (item of list) {
        if (item[keys.value] == value) {
            result = item[keys.label];
            break;
        }

        subChildren = item[keys.children] || [];

        if (subChildren.length !== 0) {
            result = searchLabel(subChildren, value);
            if (result) break;
        }
    }

    return result || '';
};

export const getAreaLabels = (list = [], areaCode = {}) =>  {
    let areaCodeKeys = Object.keys(areaCode),
        result = {};

    areaCodeKeys.forEach((item) => {
        result[item] = searchLabel(list, areaCode[item]);
    });
    return result;
};

export const getUuidFileName = () => {
    let nowDate = new Date(),
        year = nowDate.getFullYear(),
        month = nowDate.getMonth() + 1,
        date = nowDate.getDate(),
        curr = '',
        prefix = '',
        suffix = uuid.v4();

    month = month < 10 ? `0${month}` : month;
    date = date < 10 ? `0${date}` : date;
    curr = `${year}${month}${date}`;

    return encodeURI(`${curr}/${suffix}`);
};




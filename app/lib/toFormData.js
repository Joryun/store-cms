/**
 * 将对象转成 FormData
 * @param {Object} tarObj
 */
const toFormData = (tarObj) => {
    let formData = new FormData(),
        key = '',
        objKeys = Object.keys(tarObj);

    for (key of objKeys) {
        formData.append(key, tarObj[key]);
    }

    return formData;
};

export default toFormData;

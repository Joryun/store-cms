let fs = require('fs');
let os = require('os');

const getGlobalConfig = (fileName) => {
    let cleanExegesisReg = /\/\*.*\*\//g, /* 清除 json 文件中的注释 */
        globalConfigFile = fs.readFileSync(fileName, 'utf-8'),
        globalConfigJsonStr = globalConfigFile.replace(cleanExegesisReg, ''),
        globalConfig = JSON.parse(globalConfigJsonStr);

    return globalConfig;
};

const getTimeVersions = (dateObj = new Date()) => {
    let fullYear = dateObj.getFullYear(),
        month = dateObj.getMonth(),
        date = dateObj.getDate() + 1,
        hours = dateObj.getHours(),
        minutes = dateObj.getMinutes(),
        seconds = dateObj.getSeconds();

    month = month < 10 ? `0${month}` : month;
    date = date < 10 ? `0${date}` : date;
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    return `[${fullYear}${month}${date}_${hours}-${minutes}-${seconds}]`;
};

/**
 * 优先使用 mac 地址获取对应网卡的 ip 地址
 * @param {Array} mac 优先根据 mac 物理地址获取对应网卡的 ip 地址
 * @param {Object} ifaces  所有被赋予网络地址的网络接口
 * @param {String} family  IPV4 或 IPV6
 */
const priorityMac = (mac = [], ifaces = {}, family = 'IPV4') => {
    let key = '',
        ip = '';

    /* Windows下显示mac地址的方式是用横杆，而Linux是用冒号 */
    mac = mac.map((item) => {
        return item.replace(/-/g, ':');
    });
    
    for (key in ifaces) {
        ifaces[key].forEach((ifacesItem) => {
            mac.forEach((macItem) => {
                if (ifacesItem.mac.toLowerCase() === macItem.toLowerCase() && ifacesItem.family.toLowerCase() === family) {
                    ip = ifacesItem.address;
                }
            });
        });
    }

    return ip;
};

/**
 * 优先网卡名称获取对应网卡的 ip 地址
 * @param {String} name  优先根据网卡名字获取该网卡的 ip 地址
 * @param {Object} ifaces  所有被赋予网络地址的网络接口
 * @param {String} family  IPV4 或 IPV6
 */
const priorityName = (name = '', ifaces = {}, family = 'IPV4') => {
    let key = '',
        ip = '';

    ifaces[name].forEach((item) => {
        if (item.family.toUpperCase() === family) {
            ip = item.address;
        }
    });

    return ip;
};

/**
 * 自动获取 ip 地址
 * 
 * 有三个优先级：
 *      1. 若直接指定 ip 地址，优先级最高
 *      2. 若没有指定 ip 地址，而是使用 mac 地址，将会根据 mac 地址获取 ip 地址
 *      3. 若上述两者都没有指定，而是使用网卡的名称，将根据网卡名称获取 ip 地址
 * 
 * 备注：
 *      1. 默认获取IPV4的地址
 * @param {String} ip  直接指定 ip 地址
 * @param {Array} mac 优先根据 mac 物理地址获取对应网卡的 ip 地址
 * @param {String} name  优先根据网卡名字获取该网卡的 ip 地址
 * @param {String} family  IPV4 或 IPV6
 */
const getLocalIP = (ip = '', mac = [], name = '', family = 'IPV4') => {
    let ifaces = os.networkInterfaces();

    family = family.toLowerCase();

    /* 移除loopback,没多大意义 */
    for (let key in ifaces) {
        if (key.toLowerCase().indexOf('loopback') != -1) {
            delete ifaces[key];
            continue;
        }
    }

    if (ip) {
        return ip;
    } else if (mac.length !== 0) {
        return priorityMac(mac, ifaces, family);
    } else if (name) {
        return priorityName(name, ifaces, family);
    }
}

module.exports = {
    getGlobalConfig: getGlobalConfig,
    getTimeVersions: getTimeVersions,
    getLocalIP: getLocalIP,
};

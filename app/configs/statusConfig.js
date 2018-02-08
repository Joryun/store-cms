import API from 'utils/api.js';
import callAxios from 'utils/callAxios';
import * as appConfig from 'configs/appConfig.js';
import React, { Component } from 'react';
/* 角色管理员角色 */
export const Role = (value, row, index)=>{
    switch (row.role) {
        case 'District':
            value = "产品经理"
            break;
        case 'Ordinary':
            value = "普通用户"
            break;
    }
    return(
        <span>{value}</span>
    );
}
// export const managerRole = ['admin', 'simple', 'district'];
export const managerRole = [ "平台管理员", "仓库管理员"];

export const orderState  = ['待配送', '已配送', '已送达', '已完成', '退款中', '已退款'];

export const Evaluate = ['全部', '有评价', '无评价'];

export const saleType = ['全部','ON','OFF'];

export const cashRecordState = ['全部','未处理','已处理'];

export const hasDistrict = [ "全部", "是", "否"];

export const AppstateTime = (value, row, index) => {
    if(value == null || value == ''){
        return "未确定";
    }else{
        let date = new Date(value);//如果date为13位不需要乘1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    
        let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        let m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        let s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y+M+D+h+m+s;
    }
}

export const Appmoney = (value, row, index) =>{
    return(
        <span>{value} 元</span>
    )

}

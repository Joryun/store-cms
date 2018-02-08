import React, { Component } from 'react';
import API from 'utils/api.js';
import callAxios from 'utils/callAxios';
import * as appConfig from 'configs/appConfig.js';
import * as utils from 'utils/utils.js';

import moment from 'moment';

import { message, notification, Button} from 'antd';

const HocFtOrder = (WrappedComponent) => {
 
    return (
        class HocFtOrder extends WrappedComponent {
            render() {
                return super.render();
            }

            handleEditCancelClick = () => {
                (this.editFormFlag === 'update') && (this.changeRowLoading('isRowEditBtnLoadings', this.tableCurIndex, false));

                this.setState({ isShowEditDialog: false, });
            }

            handleEvaluateCancelClick = () => {
                this.setState({ isShowEvaluateDialog: false, });
            }
        
            handleEditOkClick = (event) => {
                event.preventDefault();
                this.props.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        this.fetchEditInfo(values);
                    }
                });
            }
        
            fetchEditInfo = (values) => {
                this.setState({ isEditOkBtnLoading: true });
                let toggleAddUpdateParam = this.toggleAddUpdate(values);
                callAxios({
                    that: this,
                    ...toggleAddUpdateParam,
                })
                .then((response) => {
                    message.success(toggleAddUpdateParam.msg);

                    let {
                        content = null,
                    } = response.data.page;
                    let tableData = [...this.state.tableData];
                    switch (content[0].orderState) {
                        case 'Creat':
                            content[0].orderState = "已新建"
                            break;
                        case 'Pay':
                            content[0].orderState = "待配送"
                            break;
                        case 'Deliver':
                            content[0].orderState = "已配送"
                            break;
                        case 'Receive':
                            content[0].orderState = "已送达"
                            break;
                        case 'Complete':
                            content[0].orderState = "已完成"
                            break;
                        case 'Refunds':
                            content[0].orderState = "退款中"
                            break;
                        case 'close':
                            content[0].orderState = "已退款"
                            break;
                    }
                    switch (this.editFormFlag) {
                        case 'add':
                            tableData.unshift(content[0]);
                            this.setState({
                                tableDataTotal: this.state.tableDataTotal + 1,
                                curPageSize: this.state.curPageSize + 1,
                            });
                            break;
                        case 'update':
                            (content[0]) && (tableData[this.tableCurIndex] = content[0]);
                            break;
                        default:
                            break;
                    }

                    (content[0]) && (this.setState({ tableData }));
        
                    this.setState({ isShowEditDialog: false, });
                })
                .finally(() => {
                    this.setState({ isEditOkBtnLoading: false, });
                });
            }

            toggleAddUpdate = (values) => {
                let {
                    orderState = '',
                } = values;
                switch (orderState) {
                    case '已创建':
                        orderState = "Create"
                        break;
                    case '待配送':
                        orderState = "Pay"
                        break;
                    case '已配送':
                        orderState = "Deliver"
                        break;
                    case '已送达':
                        orderState = "Receive"
                        break;
                    case '已完成':
                        orderState = "Complete"
                        break;
                    case '退款中':
                        orderState = "Refunds"
                        break;
                    case '已退款':
                        orderState = "Close"
                        break;
                }
                let orderId = this.state.orderId;

                let editFormFlag = this.editFormFlag;
                let url = API.Order,
                    method = '',
                    msg = '',
                    data = {
                        "orderState": orderState,
                        "remark": '',
                    };

                if (editFormFlag === 'add') {
                    method = 'post';
                    msg = '添加成功';
                } else {
                    method = 'put';
                    msg = '更新成功';

                    data.orderId = orderId;
                }
                
                return {
                    url,
                    method,
                    msg,
                    data,
                };
            }

            Timeout = () => {
                this.Timeout1(0,0)
            }

            Timeout1 = (a,b) => {
                let n = a,
                    m = b,
                    time = moment().format('HH:mm'),
                    HTime = moment().format('HH'),
                    adminWareId = utils.getSSItem('warehouseId');
                if(adminWareId != null){
                        if(time >= "06:30" && time <= "07:00"||time >= "16:30" && time <= "17:00"){
                            if(n < 1){
                                this.findOrderNeedSend(adminWareId,time)
                            n += 1
                            }
                        }else{
                            n = 0
                        }
                        if (time >= "08:40" && time <= "09:15 "||time >= "18:40" && time <= "19:10"){
                            if(m < 1){
                                this.findOrderNotSend(adminWareId,time)
                            m += 1
                            } 
                        }else{
                            m = 0
                        }
                }
                setTimeout(function(){this.Timeout1(n,m)}.bind(this),6000)
            }
// 执行查询 - 需要派送订单数量
            findOrderNeedSend = (adminWareId,time) =>{
                callAxios({
                    that: this,
                    url: `${API.findOrderNumNeedSend}?warehouseId=${adminWareId}`,
                    method: 'GET',
                })
                .then((response) => {
                    let {
                        totalNum = null,
                    } = response.data,
                    type = 'info',
                    title = time+' 需要派送订单：',
                    description = '一共有 '+ totalNum +' 单需要配送';
                    this.openNotification(type,title,description)
                })
                .finally(() => {
                });
            }
// 执行查询 - 超时获取订单数量
            findOrderNotSend = (adminWareId,time) =>{
                callAxios({
                    that: this,
                    url: `${API.findOrderNumNotSend}?warehouseId=${adminWareId}`,
                    method: 'GET',
                })
                .then((response) => {
                    let {
                        totalNum = null,
                        } = response.data,
                        type = 'warning',
                        title = time+' 超时配送订单：',
                        description = '一共有 '+ totalNum +' 单配送已经超时';
                    this.openNotification(type,title,description)
                })
                .finally(() => {
                });
            }

            onClickOrderNeedSend = () => {
                let time = moment().format('HH:mm'),
                    HTime = moment().format('HH'),
                    adminWareId = utils.getSSItem('warehouseId');
                this.findOrderNeedSend(adminWareId,time);
            }

            onClickOrderNotSend = () => {
                let time = moment().format('HH:mm'),
                    HTime = moment().format('HH'),
                    adminWareId = utils.getSSItem('warehouseId');
                this.findOrderNotSend(adminWareId,time);
            }

            openNotification = (type,title,description) => {
                const key = `open${Date.now()}`;
                const btnClick = function () {
                  notification.close(key);
                };
                const btn = (
                  <Button type="primary" size="small" onClick={btnClick}>
                    我知道了
                  </Button>
                );
                notification.open({
                  message: title,
                  type: type,
                  description: description,
                  btn,
                  key,
                  duration: null,
                  onClose: close,
                });
              };

        }
    )
}

export default HocFtOrder;

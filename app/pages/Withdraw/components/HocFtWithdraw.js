import API from 'utils/api.js';
import callAxios from 'utils/callAxios';
import * as appConfig from 'configs/appConfig.js';

import { message, } from 'antd';

const HocFtWithdraw = (WrappedComponent) => {
    return (
        class HocFtWithdraw extends WrappedComponent {
            render() {
                return super.render();
            }

            handleEditCancelClick = () => {
                (this.editFormFlag === 'update') && (this.changeRowLoading('isRowEditBtnLoadings', this.tableCurIndex, false));

                this.setState({ isShowEditDialog: false, });
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

                // TODO: 修改toggleAddUpdate里的内容
                let toggleAddUpdateParam = this.toggleAddUpdate(values);

                callAxios({
                    that: this,
                    ...toggleAddUpdateParam,
                })
                .then((response) => {
                    message.success(toggleAddUpdateParam.msg);

                    let {
                        data = null,
                    } = response;
                    if(data.cashRecordState == "Deal"){
                        data.cashRecordState  = "已处理"
                    }else{
                        data.cashRecordState  = "未处理"
                    } 
                    let tableData = [...this.state.tableData];

                    switch (this.editFormFlag) {
                        case 'add':
                            tableData.unshift(data);
                            this.setState({
                                tableDataTotal: this.state.tableDataTotal + 1,
                                curPageSize: this.state.curPageSize + 1,
                            });
                            break;
                        case 'update':
                            // TODO: 若有异步请求详情页，则加上loading，加了记得关闭
                            // this.changeRowLoading('isRowEditBtnLoadings', this.tableCurIndex, false);
                            
                            (data) && (tableData[this.tableCurIndex] = data);
                            break;
                        default:
                            break;
                    }

                    (data) && (this.setState({ tableData }));
        
                    this.setState({ isShowEditDialog: false, });
                })
                .finally(() => {
                    this.setState({ isEditOkBtnLoading: false, });
                });
            }

            toggleAddUpdate = (values) => {
                // TODO: 修改属性
                let {
                    remark,
                    serialNumber
                } = values;
                // TODO: 修改id
                let cashRecordId = this.state.cashRecordId;

                let editFormFlag = this.editFormFlag;
        
                let url = API.updateCashRecord,
                    method = '',
                    msg = '',
                    // TODO: 修改参数
                    data = {
                        remark,
                        serialNumber
                    };

                if (editFormFlag === 'add') {
                    method = 'post';
                    msg = '添加成功';
                } else {
                    method = 'put';
                    msg = '更新成功';
                    data.cashRecordId = cashRecordId;
                }
                
                return {
                    url,
                    method,
                    msg,
                    data,
                };
            }
        }
    )
}

export default HocFtWithdraw;

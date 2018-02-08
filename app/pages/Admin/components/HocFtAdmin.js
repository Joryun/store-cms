import API from 'utils/api.js';
import callAxios from 'utils/callAxios';
import * as appConfig from 'configs/appConfig.js';

import { message, } from 'antd';

const HocFtAdmin = (WrappedComponent) => {
    return (
        class HocFtAdmin extends WrappedComponent {
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
                    let tableData = [...this.state.tableData];
                    switch (data.managerRole) {
                        case 'admin':
                            data.managerRole = "超级管理员"
                            break;
                        case 'simple':
                            data.managerRole = "平台管理员"
                            break;
                        case 'warehouse':
                            data.managerRole = "仓库管理员"
                            break;
                    }
                    switch (this.editFormFlag) {
                        case 'add':
                            tableData.unshift(data);
                            this.setState({
                                tableDataTotal: this.state.tableDataTotal + 1,
                                curPageSize: this.state.curPageSize + 1,
                            });
                            break;
                        case 'update':
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
                let {
                    account,
                    managerName,
                    password,
                    phone,
                    managerRole,
                    passWare
                } = values;
                let warehouseId = passWare.key;
                let url = '',
                    method = '',
                    msg = '',
                    data =　{};
                if(warehouseId == ''){
                    data = {
                        account,
                        managerName,
                        password,
                        phone,
                        managerRole,
                    };
                }else{
                    let warehouseIdToInt = parseInt(warehouseId);
                    data = {
                        account,
                        managerName,
                        password,
                        phone,
                        managerRole,
                        warehouseId : warehouseIdToInt, 
                    };
                }
                switch (data.managerRole) {
                    case "0":
                        data.managerRole = 'simple'
                        break;
                    case "1":
                        data.managerRole = 'warehouse'
                        break;
                    case "仓库管理员":
                        data.managerRole = 'warehouse'
                        break;
                    case "平台管理员":
                        data.managerRole = 'simple'
                        break;
                }
                let managerId = this.state.managerId;

                let editFormFlag = this.editFormFlag;
                if (editFormFlag === 'add') {
                    url = API.manager;
                    method = 'post';
                    msg = '添加成功';
                } else {
                    url = API.manager;
                    method = 'put';
                    msg = '更新成功';

                    data.managerId = managerId;
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

export default HocFtAdmin;

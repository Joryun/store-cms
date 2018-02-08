import API from 'utils/api.js';
import callAxios from 'utils/callAxios';
import * as appConfig from 'configs/appConfig.js';

import { message, } from 'antd';

const HocFtDistrict = (WrappedComponent) => {
    return (
        class HocFtDistrict extends WrappedComponent {
            render() {
                return super.render();
            }

            handleEditCancelClick = () => {
                (this.editFormFlag === 'update') && (this.changeRowLoading('isRowEditBtnLoadings', this.tableCurIndex, false));

                this.setState({ 
                    isShowEditDialog: false,
                 });
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
                this.setState({ 
                    isEditOkBtnLoading: true,
                    warehouseId : '' 
                });

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
                let districtId = this.state.districtId;
                let editFormFlag = this.editFormFlag;
                let url = '',
                    method = '',
                    msg = '',
                    data = {
                        city : values.provinceCity[1],
                        province : values.provinceCity[0],
                        districtName : values.districtName,
                        warehouseId : this.state.editSelectId,
                        address : values.address
                    };
                    if(data.warehouseId == null){
                        data.warehouseId = this.state.warehouseId
                    }
                if (editFormFlag === 'add') {
                    url = API.district;
                    method = 'post';
                    msg = '添加成功';
                } else {
                    url = API.district;
                    method = 'put';
                    msg = '更新成功';

                    data.districtId = districtId;
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

export default HocFtDistrict;

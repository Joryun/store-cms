import API from 'utils/api.js';
import callAxios from 'utils/callAxios';
import * as appConfig from 'configs/appConfig.js';

import { message, } from 'antd';

const HocFtManager = (WrappedComponent) => {
    return (
        class HocFtManager extends WrappedComponent {
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
                let editFormFlag = this.editFormFlag;
                let url = '',
                    method = '',
                    msg = '',
                    DistrictId =parseInt( values.passDistrict.key ),
                    BalanceProportion =  values.balanceProportion ,
                    data = {
                        phone : values.phone,
                        districtId : DistrictId,
                        realName : values.realName,
                        balanceProportion : BalanceProportion,
                    };
                if (editFormFlag === 'add') {
                    url = API.productManagerAdd;
                    method = 'post';
                    msg = '添加成功';
                } else {
                    url = API.productManagerUpdata;
                    method = 'put';
                    msg = '更新成功';

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

export default HocFtManager;

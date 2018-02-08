import API from 'utils/api.js';
import callAxios from 'utils/callAxios';
import * as appConfig from 'configs/appConfig.js';

import { message, } from 'antd';

const HocFtTemplate3 = (WrappedComponent) => {
    return (
        class HocFtTemplate3 extends WrappedComponent {
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
                    editAccount = '',
                    editName = '',
                    editPhone = '',
                    editPassword = '',
                } = values;
                // TODO: 修改id
                let editId = this.state.editId;

                let editFormFlag = this.editFormFlag;
        
                let url = API.addAdmin,
                    method = '',
                    msg = '',
                    // TODO: 修改参数
                    data = {
                        "account": editAccount,
                        "authority": 2, /* 权限 1 超管 2 普通管理员 , */
                        "avatar": null, /* 目前没有上传头像 */
                        "nickName": editName,
                        "password": editPassword,
                        "tel": editPhone,
                    };

                if (editFormFlag === 'add') {
                    method = 'post';
                    msg = '添加成功';
                } else {
                    method = 'put';
                    msg = '更新成功';

                    data.id = id;
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

export default HocFtTemplate3;

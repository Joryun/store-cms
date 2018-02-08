import API from 'utils/api.js';
import callAxios from 'utils/callAxios';
import * as appConfig from 'configs/appConfig.js';

import {
    message,
} from 'antd';

const HocBdWithdraw = (WrappedComponent) => {
    return (
        class HocBdWithdraw extends WrappedComponent {
            render() {
                return super.render();
            }

            componentDidMount() {
                this.fetchTableData(1);
            }

            fetchTableData = (currentPage = 1, size = appConfig.pageableSize) => {
                this.setState({ isTableDataLoading: true, });
                
                // TODO: 检查过滤项使用query参数还是body参数
                let filter = this.getFetchTableFilter();
        
                callAxios({
                    that: this,
                    method: 'get',
                    url: `${API.CashRecord}?page=${currentPage - 1}&size=${size}${filter}`,
                })
                .then((response) => {
                    let {
                        content = [],
                        numberOfElements = 0,
                        totalElements = 0,
                    } = response.data;
                    
                    content.forEach(function(element) {
                        switch (element.cashRecordState) {
                            case 'Undeal':
                                element.cashRecordState = "未处理"
                                break;
                            case 'Deal':
                                element.cashRecordState = "已处理"
                                break;
                            case 'Transfer':
                                element.cashRecordState = "已汇款"
                                break;
                        }
                    }, this);

                    this.setState({
                        tableData: content,
                        curPageSize: numberOfElements,
                        currentPage: currentPage,
                        tableDataTotal: totalElements,
                    });
                })
                .finally(() => {
                    this.setState({ isTableDataLoading: false, });
                });
            }
        
            getFetchTableFilter = () => {
                // TODO: 修改过滤项
                let {
                    searchName = '',
                    editEndTime = '',
                    edirStartTime = '',
                    editSelect = ''
                } = this.state;
                let filter = '';

                // TODO: 修改参数形式（query or body）
                (searchName !== '') && (filter += `&districtId=${searchName}`);
                (edirStartTime !== '') && (filter += `&startTime=${edirStartTime}`);
                (editEndTime !== '') && (filter += `&endTime=${editEndTime}`);
                (editSelect !== '') && (filter += `&cashRecordState=${editSelect}`);
                return filter;
            }

            handleTableChange = (pagination) => {
                let current = pagination.current || 1;

                this.setState({ currentPage: current });

                this.fetchTableData(current);
            }

            handleRowEditClick = (index, record) => {
                this.editFormFlag = 'update';
        
                // TODO: 修改属性值
                let {
                    cashRecordId = -1,
                    remark,
                    serialNumber
                } = record;
                this.tableCurIndex = index;
        
                // TODO: 修改属性值
                this.setState({
                    cashRecordId,
                    editFormTitle: '编辑管理员信息',
                    isShowEditDialog: true,
                });
        
                // TODO: 修改编辑信息的form item
                this.props.form.setFieldsValue({
                    remark,
                    serialNumber
                });
            }
        
            handleRowDeleteClick = (id, index) => {
                this.setState({ isTableDataLoading: true, });

                callAxios({
                    that: this,
                    method: 'delete',
                    // TODO: 修改接口
                    url: `${API.deleteAdmin}?id=${id}`,
                })
                .then((response) => {
                    message.success('删除成功！');

                    let currentPage = this.state.currentPage,
                        curPageSize = this.state.curPageSize - 1;
                    
                    if (curPageSize <= 0) {
                        --currentPage;

                        (currentPage < 0) && (currentPage = 0);
                    }
        
                    this.fetchTableData(currentPage);
                })
                .catch(() => {
                    this.setState({ isTableDataLoading: false, });
                });
            }
        }
    );
}

export default HocBdWithdraw;

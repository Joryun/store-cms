import API from '../../../utils/api.js';
import callAxios from '../../../utils/callAxios';
import * as appConfig from '../../../configs/appConfig.js';

import {
    message,
} from 'antd';

const HocBdKeywords = (WrappedComponent) => {
    return (
        class HocBdKeywords extends WrappedComponent {
            render() {
                return super.render();
            }

            componentDidMount() {
                this.fetchTableData(1);
            }

            fetchTableData = (currentPage = 1, size = 10) => {
                this.setState({ isTableDataLoading: true, });
                let filter = '';
                callAxios({
                    that: this,
                    method: 'get',
                    url: `${API.keywords}?page=${currentPage - 1}&size=${size}${filter}`,
                })
                .then((response) => {
                    let {
                        content = [],
                        numberOfElements = 0,
                        totalElements = 0,
                    } = response.data;

                    this.setState({
                        tableData: content,
                        curPageSize: 10,
                        currentPage: currentPage,
                        tableDataTotal: totalElements,
                    });
                })
                .finally(() => {
                    this.setState({ isTableDataLoading: false, });
                });

            }

            handleTableChange = (pagination) => {
                let current = pagination.current || 1;

                this.setState({ currentPage: current });

                this.fetchTableData(current);
            }

            handleRowEditClick = (index, record) => {
                this.editFormFlag = 'update';
        
                let {
                    keywordsId = -1,
                    keywordsInfo,
                    priority
                } = record;

                this.tableCurIndex = index;

                this.setState({
                    keywordsId,
                    editFormTitle: '编辑热搜词信息',
                    isShowEditDialog: true,
                });

                this.props.form.setFieldsValue({
                    keywordsInfo,
                    priority
                });
            }
        
            handleRowDeleteClick = (id, index) => {
                this.setState({ isTableDataLoading: true, });

                callAxios({
                    that: this,
                    method: 'delete',
                    url: `${API.keywords}?keywordsId=${id}`,
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

export default HocBdKeywords;

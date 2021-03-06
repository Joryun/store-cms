import API from 'utils/api.js';
import callAxios from 'utils/callAxios';
import * as appConfig from 'configs/appConfig.js';

import {
    message,
} from 'antd';

const HocBdSaleSort2 = (WrappedComponent) => {
    return (
        class HocBdSaleSort2 extends WrappedComponent {
            render() {
                return super.render();
            }

            componentDidMount() {
                this.fetchTableData(1);
            }

            fetchTableData = (currentPage = 1, size = 10) => {
                this.setState({ isTableDataLoading: true, });
                // let filter = this.getFetchTableFilter();
                let filter = '';
        
                callAxios({
                    that: this,
                    method: 'get',
                    url: `${API.findSaleSortGoods}?saleSortId=2&page=${currentPage - 1}&size=${size}${filter}`,
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

            handleRowDeleteClick = (id, index) => {
                this.setState({ isTableDataLoading: true, });
                callAxios({
                    that: this,
                    method: 'delete',
                    url: `${API.deleteSortGoods}?goodsId=${id}&saleSortId=2`,
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

export default HocBdSaleSort2;

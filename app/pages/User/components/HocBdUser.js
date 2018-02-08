import API from '../../../utils/api.js';
import callAxios from 'utils/callAxios';
import * as appConfig from 'configs/appConfig.js';

import {
    message,
} from 'antd';

const HocBdUser = (WrappedComponent) => {
    return (
        class HocBdUser extends WrappedComponent {
            render() {
                return super.render();
            }

            componentDidMount() {
                this.fetchTableData(1);
            }

            fetchTableData = (currentPage = 1, size = appConfig.pageableSize) => {
                this.setState({ isTableDataLoading: true, });
                
                let filter = this.getFetchTableFilter();
        
                callAxios({
                    that: this,
                    method: 'get',
                    url: `${API.user}?page=${currentPage - 1}&size=${size}${filter}`,
                })
                .then((response) => {
                    let {
                        content = [],
                        totalElements = 0,
                    } = response.data;
        
                    this.setState({
                        tableData: content,
                        currentPage: currentPage,
                    });
                    
                    (this.state.tableDataTotal != totalElements) && this.setState({ tableDataTotal: totalElements });
                })
                .finally(() => {
                    this.setState({ isTableDataLoading: false, });
                });
            }
        
            getFetchTableFilter = () => {
                let {
                    searchNickname = '',
                    searchMobilePhone = '',
                } = this.state;
                let filter = '';

                (searchMobilePhone !== '') && (filter += `&phone=${searchMobilePhone}`);
        
                return filter;
            }

            handleTableChange = (pagination) => {
                let current = pagination.current || 1;

                this.setState({ currentPage: current });

                this.fetchTableData(current);
            }

            handleRowChangeFlagClick = (index, record) => {
                this.changeRowLoading('isRowChangeFlagBtnLoadings', index, true);

                callAxios({
                    that: this,
                    method: 'put',
                    url: `${API.operateUser}?userId=${record.userId}`,
                })
                .then((response) => {
                    let tableData = [...this.state.tableData];

                    tableData[index] = response.data;
        
                    this.setState({ tableData });

                    message.success('更新成功');
                })
                .finally(() => {
                    this.changeRowLoading('isRowChangeFlagBtnLoadings', index, false);
                });
            }
        }
    );
}

export default HocBdUser;

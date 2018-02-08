import API from '../../../utils/api.js';
import callAxios from '../../../utils/callAxios';
import * as appConfig from '../../../configs/appConfig.js';

import {
    message,Modal
} from 'antd';

const HocBdWarehouse = (WrappedComponent) => {
    return (
        class HocBdWarehouse extends WrappedComponent {
            render() {
                return super.render();
            }

            componentDidMount() {
                this.fetchTableData(1);
            }

            fetchTableData = (currentPage = 1, size = 10) => {
                this.setState({ isTableDataLoading: true, });
                
                let filter = this.getFetchTableFilter();
                callAxios({
                    that: this,
                    method: 'get',
                    url: `${API.warehouse}?page=${currentPage - 1}&size=${size}${filter}`,
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

            getFetchTableFilter = () => {
                let {
                    searchName,
                    searchPro,
                    searchCity
                } = this.state;
                let filter = '';

                (searchName !== '') && (filter += `&warehouseName=${searchName}`);
                (searchPro !== '') && (filter += `&province=${searchPro}`);
                (searchCity !== '') && (filter += `&city=${searchCity}`);
                return filter;
            }

            handleTableChange = (pagination) => {
                let current = pagination.current || 1;

                this.setState({ currentPage: current });

                this.fetchTableData(current);
            }

            handleRowEditClick = (index, record) => {
                this.editFormFlag = 'update';
        
                let {
                    id = -1,
                    warehouseName = '',
                    province = '',
                    city = '',
                    warehouseAddress = ''
                } = record;
                let provinceCity =[ 
                    province,
                    city
                ];

                this.tableCurIndex = index;

                this.setState({
                    id,
                    editFormTitle: '编辑仓库信息',
                    isShowEditDialog: true,
                });

                this.props.form.setFieldsValue({
                    warehouseName,
                    provinceCity,
                    warehouseAddress
                });
            }
        
            handleRowDeleteClick = (record, index) => {
                this.setState({ isTableDataLoading: true, });

                callAxios({
                    that: this,
                    method: 'delete',
                    url: `${API.warehouse}?warehouseId=${record.id}`,
                })
                .then((response) => {
                    let {
                        data
                    } = response;
                    let {
                        districtCount,
                        orderCount,
                        warehouseManagerCount
                    } = data;

                    if(districtCount != 0||orderCount != 0||warehouseManagerCount != 0){
                        this.setState({ 
                            isShowError: true,
                            isTableDataLoading: false,
                            districtCount,
                            orderCount,
                            warehouseManagerCount
                        });

                    }else{
                        message.success('删除成功！');
                        let currentPage = this.state.currentPage,
                            curPageSize = this.state.curPageSize - 1;
                        
                        if (curPageSize <= 0) {
                            --currentPage;
    
                            (currentPage < 0) && (currentPage = 0);
                        }
            
                        this.fetchTableData(currentPage);
                    }
                })
                .catch(() => {
                    this.setState({ isTableDataLoading: false, });
                });
            }

            onchangeError = () => {
                this.setState({ isShowError: false, });
            }




        }
    );
}

export default HocBdWarehouse;

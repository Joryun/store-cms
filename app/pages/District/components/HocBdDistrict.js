import API from '../../../utils/api.js';
import callAxios from '../../../utils/callAxios';
import * as appConfig from '../../../configs/appConfig.js';

import {
    message,
} from 'antd';

const HocBdDistrict = (WrappedComponent) => {
    return (
        class HocBdDistrict extends WrappedComponent {
            render() {
                return super.render();
            }

            componentDidMount() {
                this.AllWarehouseList();
                this.fetchTableData(1);
            }

            fetchTableData = (currentPage = 1, size = 10) => {
                this.setState({ isTableDataLoading: true, });
                
                let filter = this.getFetchTableFilter();
        
                callAxios({
                    that: this,
                    method: 'get',
                    url: `${API.district}?page=${currentPage - 1}&size=${size}${filter}`,
                })
                .then((response) => {
                    let {
                        content = [],
                        numberOfElements = 0,
                        totalElements = 0,
                    } = response.data;

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
                let {
                    searchName,
                    searchPro,
                    searchCity,
                    searchWare,
                } = this.state;
                let filter = '';
                (searchName !== '') && (filter += `&districtName=${searchName}`);
                (searchPro !== '') && (filter += `&province=${searchPro}`);
                (searchCity !== '') && (filter += `&city=${searchCity}`);
                (searchWare !== '') && (filter += `&warehouseName=${searchWare}`);
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
                    districtId,
                    districtName,
                    province,
                    city,
                    address,
                    warehouseId
                } = record;
                let provinceCity =[ 
                    province,
                    city
                    ];
                let pass = this.returnWarehouse(warehouseId),
                    passWare = pass[0],
                    passPAC = pass[1];
                this.tableCurIndex = index;

                this.setState({
                    isdisabled : true,
                    districtId,
                    warehouseId,
                    editFormTitle: '编辑管理员信息',
                    isShowEditDialog: true,
                });

                this.props.form.setFieldsValue({
                    districtName,
                    provinceCity,
                    address,
                    passWare,
                    EditProvinceCity : passPAC
                });
            }
        
            handleRowDeleteClick = (record, index) => {
                this.setState({ isTableDataLoading: true, });

                callAxios({
                    that: this,
                    method: 'delete',
                    url: `${API.district}?districtId=${record.districtId}`,
                })
                .then((response) => {
                    let {
                        orderCount,
                        userAdminVO
                    } = response.data;
                    if(orderCount != 0){
                        this.setState({ 
                            isShowError: true,
                            isTableDataLoading: false,
                            orderCount,
                            userAdminVO,
                            titleNo : "修改方案: 处理完订单数，即可删除该小区",
                            titleSugger : "后续方案: 请删除小区之后，重新设置原小区的产品经理",
                        });
                    }else if(userAdminVO != null){
                        this.setState({
                            userAdminVO,
                            isShowError: true,
                            isTableDataLoading: false,
                            titleNo : "删除成功",
                            titleSugger : "后续方案: 请删除小区之后，重新设置原小区的产品经理",
                        })
                        message.success('删除成功！请及时处理');
    
                        let currentPage = this.state.currentPage,
                            curPageSize = this.state.curPageSize - 1;
                        
                        if (curPageSize <= 0) {
                            --currentPage;
    
                            (currentPage < 0) && (currentPage = 0);
                        }
            
                        // this.fetchTableData(currentPage);
                    }else{
                        message.success('删除成功');
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

            returnWarehouse = (key) =>{
                let num = this.state.WareList,
                    keyString = key.toString(),
                    keyPass,
                    passNum,
                    passP,
                    passC;
                num.forEach(function(element,index) {
                    if(element.id == key){
                        passNum = element.warehouseName
                        passP = element.province
                        passC = element.city
                    }
                }, this);
                keyPass = [{
                    key : keyString,
                    label : passNum
                },
                     [passP,
                     passC]
                ]
                return keyPass 
            }

            handleRowChangeFlagClick = (index, record) => {
                this.changeRowLoading('isRowChangeFlagBtnLoadings', index, true);

                callAxios({
                    that: this,
                    method: 'put',
                    url: `${API.frozen}?districtId=${record.districtId}`,
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

            onchangeError = () => {
                this.setState({ isShowError: false, });
            }




        }
    );
}

export default HocBdDistrict;

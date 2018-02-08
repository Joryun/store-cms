import API from '../../../utils/api.js';
import callAxios from '../../../utils/callAxios';
import * as appConfig from '../../../configs/appConfig.js';

import {
    message,
} from 'antd';

const HocBdManager = (WrappedComponent) => {
    return (
        class HocBdManager extends WrappedComponent {
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
                // let filter = '';
        
                callAxios({
                    that: this,
                    method: 'get',
                    url: `${API.productManager}?page=${currentPage - 1}&size=${size}${filter}`,
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
                    searchName = '',
                    searchPhone = '',
                    searchSelect = ''
                } = this.state;
                let filter = '';

                (searchName !== '') && (filter += `&realName=${searchName}`);
                (searchPhone !== '') && (filter += `&phone=${searchPhone}`);
                (searchSelect !== '') && (filter += `&hasDistrict=${searchSelect}`);
        
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
                    realName ,
                    phone ,
                    province,
                    city,
                    districtId ,
                    balanceProportion
                } = record;
                let pass = this.returnWarehouse(districtId),
                    passDistrict = pass[0],
                    passPAC = pass[1];
                this.tableCurIndex = index;

                this.setState({
                    isdisabled : true,
                    districtId,
                    editFormTitle: '编辑管理员信息',
                    isShowEditDialog: true,
                });
                this.props.form.setFieldsValue({
                    balanceProportion,
                    realName,
                    passDistrict,
                    phone,
                    EditProvinceCity : passPAC
                });
            }
        
            handleRowDeleteClick = (index , record) => {
                this.setState({ isTableDataLoading: true, });
                callAxios({
                    that: this,
                    method: 'delete',
                    url: `${API.productManagerDelete}?phone=${record.phone}`,
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

            returnWarehouse = (key) =>{
                let num = this.state.WareList,
                    keyString = key.toString(),
                    keyPass,
                    passNum,
                    passP,
                    passC;
                num.forEach(function(element,index) {
                    if(element.districtId == key){
                        passNum = element.districtName
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



        }
    );
}

export default HocBdManager;

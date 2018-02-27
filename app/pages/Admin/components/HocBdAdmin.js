import API from '../../../utils/api.js';
import callAxios from '../../../utils/callAxios';
import * as appConfig from '../../../configs/appConfig.js';
import * as utils from 'utils/utils.js';


import {
    message,
} from 'antd';

const HocBdAdmin = (WrappedComponent) => {
    return (
        class HocBdAdmin extends WrappedComponent {
            render() {
                return super.render();
            }

            componentDidMount() {
                this.AllWarehouseList();
                this.fetchTableData(1);
            }

            fetchTableData = (currentPage = 1, size = 10) => {
                this.setState({ isTableDataLoading: true, });
                
                // let filter = this.getFetchTableFilter();
                let filter = '';
        
                callAxios({
                    that: this,
                    method: 'get',
                    url: `${API.manager}?page=${currentPage - 1}&size=${size}${filter}`,
                })
                .then((response) => {
                    let {
                        content = [],
                        numberOfElements = 0,
                        totalElements = 0,
                    } = response.data;
                    
                    content.forEach(function(element) {
                        switch (element.managerRole) {
                            case "ADMIN":
                                element.managerRole = "超级管理员"
                                break;
                            case "SIMPLE":
                                element.managerRole = "平台管理员"
                                break;
                            case "SHOP":
                                element.managerRole = "店铺管理员"
                                break;
                        }
                    }, this);

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

            // getFetchTableFilter = () => {
            //     let {
            //         realName = '',
            //         salesmanNumber = '',
            //         mobilePhone = '',
            //         flag = '',
            //     } = this.state;
            //     let filter = '';

            //     (realName !== '') && (filter += `&realName=${realName}`);
            //     (salesmanNumber !== '') && (filter += `&salesmanNumber=${salesmanNumber}`);
            //     (mobilePhone !== '') && (filter += `&mobilePhone=${mobilePhone}`);
            //     (flag !== '') && (filter += `&flag=${flag}`);
        
            //     return filter;
            // }

            handleTableChange = (pagination) => {
                let current = pagination.current || 1;

                this.setState({ currentPage: current });

                this.fetchTableData(current);
            }

            handleRowEditClick = (index, record) => {
                this.editFormFlag = 'update';
                // let rank = utils.getSSItem('managerRole');
                let {
                    managerId = -1,
                    managerName = '',
                    account = '',
                    password = '',
                    phone = '',
                    managerRole = '',
                    province,
                    city,
                    warehouseId
                } = record;
                let provinceCity =[ 
                    province,
                    city
                    ];
                this.tableCurIndex = index;

                this.setState({
                    managerId,
                    warehouseId,
                    editFormTitle: '编辑管理员信息',
                    isShowEditDialog: true,
                    isdisabled : true,
                });
                if( managerRole == "仓库管理员" ){
                    let pass = this.returnWarehouse(warehouseId),
                        passWare = pass[0],
                        passPAC = pass[1];
                    this.setState({
                        wareRole : false,
                        display : 'block'
                    })
                    this.props.form.setFieldsValue({
                        account,
                        managerName,
                        provinceCity,
                        password,
                        phone,
                        managerRole: `${managerRole}`,
                        passWare,
                        EditProvinceCity : passPAC
                    })
                }else{
                    this.setState({
                        wareRole : true,
                        display : 'none'
                    }),
                    this.props.form.setFieldsValue({
                        account,
                        managerName,
                        provinceCity: [],
                        password,
                        phone,
                        managerRole: `${managerRole}`,
                        passWare : {key: '',label: ''},
                        EditProvinceCity : {key: '',label: ''}
                    })
                };

                
            }
        
            handleRowDeleteClick = (id, index) => {
                this.setState({ isTableDataLoading: true, });

                callAxios({
                    that: this,
                    method: 'delete',
                    url: `${API.manager}?id=${id}`,
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
                if(key == ''||key == null){
                    let keyPass = [{
                        key : '',
                        label : ''
                    },
                         [0,0]
                    ];
                    return keyPass 
                }else{
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
            }



        }
    );
}

export default HocBdAdmin;

import API from 'utils/api.js';
import callAxios from 'utils/callAxios';
import * as appConfig from 'configs/appConfig.js';
import * as utils from 'utils/utils.js';

import EditableCell from './SecondaryForm.js';

import {
    message,
} from 'antd';

const HocBdOrder = (WrappedComponent) => {
    return (
        class HocBdOrder extends WrappedComponent {
            render() {
                return super.render();
            }

            componentDidMount() {
                this.fetchTableData(1);
                this.Timeout();
            }

            fetchTableData = (currentPage = 1, size = appConfig.pageableSize) => {
                
                let adminRole = utils.getSSItem('managerRole'),
                    isAdminRole = false;
                (adminRole == "warehouse")?(
                    isAdminRole = true
                ):(
                    isAdminRole = false
                )
                this.setState({ 
                    isTableDataLoading: true,
                    isAdminRole,
                })

                let filter = this.getFetchTableFilter();

                callAxios({
                    that: this,
                    method: 'get',
                    url: `${API.Order}?page=${currentPage - 1}&size=${size}${filter}`,
                })
                .then((response) => {
                    let {
                        content = [],
                        numberOfElements = 0,
                        totalElements = 0,
                    } = response.data.page;
                    content.forEach(function(element) {
                        switch (element.orderState) {
                            case 'Create':
                                element.orderState = "已创建"
                                break;
                            case 'Pay':
                                element.orderState = "待配送"
                                break;
                            case 'Deliver':
                                element.orderState = "已配送"
                                break;
                            case 'Receive':
                                element.orderState = "已送达"
                                break;
                            case 'Complete':
                                element.orderState = "已完成"
                                break;
                            case 'Refunds':
                                element.orderState = "退款中"
                                break;
                            case 'Close':
                                element.orderState = "已退款"
                                break;
                        }
                    }, this);
        
                    this.setState({
                        tableData: content,
                        curPageSize: numberOfElements,
                        currentPage: currentPage,
                        tableDataTotal: totalElements,
                        totalFee: response.data.totalFee,
                        totalNum: response.data.totalNum,
                    });
                })
                .finally(() => {
                    this.setState({ isTableDataLoading: false, });
                });
            }
        
            getFetchTableFilter = () => {
                let {
                        searchDistrictId = '',
                        searchUserId = '',
                        searchWarehouse = '',
                        searchStartTime = '',
                        searchEndTime = '',
                        searchFlag = '',
                        searchOutTradeNo = '',
                        searchEvaluate = '',
                    } = this.state,
                    adminWareId = '';
                    if(utils.getSSItem('warehouseId') == null){
                        adminWareId = ''
                    }else{
                        adminWareId = utils.getSSItem('warehouseId')
                    }
                    this.setState({
                        adminWareId
                    })
                switch (searchFlag) {
                    case '1':
                        searchFlag = "Creat"
                        break;
                    case '2':
                        searchFlag = "Pay"
                        break;
                    case '3':
                        searchFlag = "Deliver"
                        break;
                    case '4':
                        searchFlag = "Receive"
                        break;
                    case '5':
                        searchFlag = "Complete"
                        break;
                    case '6':
                        searchFlag = "Refunds"
                        break;
                    case '7':
                        searchFlag = "Close"
                        break;
                }
                switch (searchEvaluate) {
                    case '2':
                        searchEvaluate = ""
                        break;
                    case '3':
                        searchEvaluate = "Yes"
                        break;
                    case '4':
                        searchEvaluate = "No"
                        break;
                }
                let filter = '';
                (adminWareId !== '') && (filter += `&warehouseId=${adminWareId}`);
                (searchDistrictId !== '') && (filter += `&districtId=${searchDistrictId}`);
                (searchUserId !== '') && (filter += `&name=${searchUserId}`);
                (searchWarehouse !== '') && (filter += `&warehouseName=${searchWarehouse}`);
                (searchStartTime !== '') && (filter += `&startDate=${searchStartTime}`);
                (searchEndTime !== '') && (filter += `&endDate=${searchEndTime}`);
                (searchFlag !== '') && (filter += `&orderState=${searchFlag}`);
                (searchOutTradeNo !== '') && (filter += `&outTradeNo=${searchOutTradeNo}`);
                (searchEvaluate !== '') && (filter += `&accessType=${searchEvaluate}`);
        
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
                    orderId = -1,
                    orderState  = '',
                    orderGoodsList = [],
                } = record;
                
                this.tableCurIndex = index;

                this.setState({
                    orderId ,
                    orderState ,
                    editFormTitle: '订单状态变更',
                    isShowEditDialog: true,
                    secData: orderGoodsList,
                });
        
                this.props.form.setFieldsValue({
                    orderState,
                });
            }

            handleSeeEvaluateClick= (index, record) => {
                let {
                    orderId = -1,
                    assess = '',
                } = record;
        
                // this.tableCurIndex = index;

                this.setState({
                    orderId ,
                    editFormTitle: '查看评价信息',
                    isShowEvaluateDialog: true,
                    assess: assess,
                });
            }

            onCellChange = (key, dataIndex) => {
                return (value) => {
                  const dataSource = [...this.state.dataSource];
                  const target = dataSource.find(item => item.key === key);
                  if (target) {
                    target[dataIndex] = value;
                    this.setState({ dataSource });
                  }
                };
            }

        }
    );
}

export default HocBdOrder;

import API from 'utils/api.js';
import callAxios from 'utils/callAxios';
import * as appConfig from 'configs/appConfig.js';

import { message, } from 'antd';
const HocOtSaleSort1 = (WrappedComponent) => {
    return (
        class HocOtSaleSort1 extends WrappedComponent {
            render() {
                return super.render();
            }
//弹窗部分
            handleWatchPic = () => {
                this.fetchTableDataPic()
                this.setState({
                    isShowPic: true,
                });
            }

            handlePicOkClick = (event) => {
                this.setState({ isShowPic: false, });
            }
 
            handlePicCancelClick = () => {
                this.setState({ isShowPic: false, });
            }

            handlePicTableChange = (pagination) => {
                let current = pagination.current || 1;

                this.setState({ currentPagePic: current });

                this.fetchTableDataPic(current);
            }

            changeRowLoadingPic = (stateName, index, value) => {
                let state = this.state[stateName];
        
                state[index] = value;
        
                this.setState({ state });
            }
            
            onChangePic = (event) => {
                const target = event.target;
                const value = target.type === 'checkbox' ? target.checked : target.value;
                const name = target.name;
                this.setState({
                    redirectUrl: value
                });
            }

            onChangePicNum = (event) => {
                this.setState({
                    priorityPic: event
                });
            }
//编辑部分
            handleAddClickPic = () => {
                this.editFromFlagPic = 'add';
                this.setState({
                    editFormTitle: '添加商品',
                    isShowEditDialogPic: true,
                    bannerId : '',
                    bannerUrl : '',
                    redirectUrl : '',
                    priorityPic : '',
                });

            }

            handleEditCancelClickPic = () => {
                (this.editFromFlagPic === 'update') && (this.changeRowLoadingPic('isRowEditBtnLoadingsPic', this.tableCurIndexPic, false));
                this.setState({ isShowEditDialogPic: false, });
            }

            handleRowEditClickPic = (index, record) => {
                this.editFromFlagPic = 'update';
                let {
                    bannerId,
                    bannerUrl,
                    redirectUrl,
                    priority
                } = record;
                this.tableCurIndex = index;

                this.setState({
                    isdisabled : true,
                    bannerId,
                    bannerUrl,
                    redirectUrl,
                    priorityPic : priority,
                    editFormTitle: '编辑信息',
                    isShowEditDialogPic: true,
                });
            }

            handleEditOkClickPic = (event) => {
                event.preventDefault();
                this.fetchEditInfoPic();
            }

            handleRowDeleteClickPic = (id, index) => {
                this.setState({ isTableDataLoadingPic: true, });
                callAxios({
                    that: this,
                    method: 'delete',
                    url: `${API.saleSortBanner}?saleSortBannerId=${id.bannerId}&saleSortId=1`,
                })
                .then((response) => {
                    message.success('删除成功！');

                    let currentPage = this.state.currentPagePic,
                        curPageSize = this.state.curPageSizePic - 1;
                    
                    if (curPageSize <= 0) {
                        --currentPage;

                        (currentPage < 0) && (currentPage = 0);
                    }
        
                    this.fetchTableDataPic(currentPage);
                })
                .catch(() => {
                    this.setState({ isTableDataLoading: false, });
                });
            }

            handleEnhanceSingleUploadChange = (imgUrl) => {
                this.setState({ bannerUrl: imgUrl });
            }

//数据交流
            fetchTableDataPic = (currentPage = 1, size = 10) => {
                this.setState({ isPicTableDataLoading: true, });
                let filter = '';
                callAxios({
                    that: this,
                    method: 'get',
                    url: `${API.saleSortBanner}?saleSortId=1&page=${currentPage - 1}&size=${size}${filter}`,
                })
                .then((response) => {
                    let {
                        data = [],
                        numberOfElements = 0,
                        totalElements = 0,
                    } = response;
                    this.setState({
                        tableDataPic: data,
                        curPageSizePic: 10,
                        currentPagePic: currentPage,
                        tableDataTotalPic: totalElements,
                    });
                })
                .finally(() => {
                    this.setState({ isPicTableDataLoading: false, });
                });
            }

            fetchEditInfoPic = () => {
                this.setState({ isEditOkBtnLoadingPic: true });
                let toggleAddUpdateParam = this.toggleAddUpdatePic(),
                    diff = toggleAddUpdateParam.data;
                if(diff.bannerUrl == ''||diff.priority == ''||diff.redirectUrl == ''){
                    message.error("请填写全部信息！")
                    this.setState({
                        isEditOkBtnLoadingPic: false, 
                    })
                }else{
                    callAxios({
                        that: this,
                        ...toggleAddUpdateParam,
                    })
                    .then((response) => {
                        message.success(toggleAddUpdateParam.msg);
    
                        let {
                            data = null,
                        } = response;
                        let tableData = [...this.state.tableDataPic];
                        
                        switch (this.editFromFlagPic) {
                            case 'add':
                                tableData.unshift(data);
                                this.setState({
                                    tableDataTotalPic: this.state.tableDataTotalPic + 1,
                                    curPageSizePic: this.state.curPageSizePic + 1,
                                });
                                break;
                            case 'update':
                                (data) && (tableData[this.tableCurIndexPic] = data);
                                break;
                            default:
                                break;
                        }
    
                        (data) && (this.setState({ tableDataPic:tableData }));
            
                        this.setState({ isShowEditDialogPic: false, });
                    })
                    .finally(() => {
                        this.setState({ isEditOkBtnLoadingPic: false, });
                    });
                }
                
            }

            toggleAddUpdatePic = () => {
                let {
                    bannerUrl,
                    redirectUrl,
                    bannerId,
                    priorityPic,
                }=this.state
                let url = '',
                    method = '',
                    msg = '',
                    data = {
                        bannerUrl,
                        redirectUrl,
                        priority : priorityPic,
                        saleSortId : 1
                    };

                let editFormFlag = this.editFromFlagPic;
                if (editFormFlag === 'add') {
                    url = API.saleSortBanner;
                    method = 'post';
                    msg = '添加成功';
                } else {
                    url = API.saleSortBanner;
                    method = 'put';
                    msg = '更新成功';

                    data.bannerId = bannerId;
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

export default HocOtSaleSort1;

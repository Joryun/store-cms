import React, { Component } from 'react';
import API from '../../../utils/api.js';
import callAxios from '../../../utils/callAxios';
import * as appConfig from '../../../configs/appConfig.js';

import {
    message,
    Select
} from 'antd';
const Option = Select.Option;

const HocBdArticle = (WrappedComponent) => {
    return (
        class HocBdArticle extends WrappedComponent {
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
                    url: `${API.article}?page=${currentPage - 1}&size=${size}${filter}`,
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
                    if(this.state.editSelectId != ''){
                        this.setState({
                            searchState: false,
                            aganEditSelectId: this.state.editSelectId,
                        })
                    }
                })
                .finally(() => {
                    this.setState({ isTableDataLoading: false, });
                });

            }

            getFetchTableFilter = () => {
                let {
                    editSelectId,
                    searchName,
                    editEndTime,
                    edirStartTime,
                    hasDistrict,
                } = this.state;
                let filter = '';
                (hasDistrict !=='') && (filter += `&hasDistrict=${hasDistrict}`);
                (searchName !== '') && (filter += `&title=${searchName}`);
                (edirStartTime !== '') && (filter += `&startTime=${edirStartTime}`);
                (editEndTime !== '') && (filter += `&endTime=${editEndTime}`);
                (editSelectId !== '') && (filter += `&districtId=${editSelectId}`);
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
                    articleId ,
                    title ,
                    priority ,
                    page ,
                    lead,
                    content ,
                } = record;

                this.tableCurIndex = index;

                let defaultFileList = [];
                defaultFileList = (page != '') && ([
                    {
                        uid: page,
                        picname: `p-${page}.png`,
                        status: 'done',
                        url: page,
                    }
                ]);

                this.setState({
                    articleId,
                    editFormTitle: '编辑文章信息',
                    isShowEditDialog: true,
                    defaultFileList : defaultFileList,
                    content : content,
                });
                this.props.form.setFieldsValue({
                    page ,
                    lead ,
                    title ,
                    priority ,
                });
            }
        
            handleRowDeleteClick = (id, index) => {
                this.setState({ isTableDataLoading: true, });

                callAxios({
                    that: this,
                    method: 'delete',
                    url: `${API.article}?articleId=${id}`,
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
//下拉选择
//             onPopupVisibleChange = (value,a) =>{
//                 if(value == false){
//                 }
//             }

            onchangeFrom = (value) => {
                let values = value;
                this.setState({
                    chDistrict : {key:'',label:''},
                    editP : values[0],
                    editC : values[1],
                    spin : true,
                    addcheck : true,
                },()=>{
                    this.DisList();
                })
            }

            DisList = () => {
                let {
                    editP,
                    editC,
                } = this.state;
                if(editP != '' && editC != ''){
                    let filter = '';
                    (editP !== '') && (filter += `province=${editP}`);
                    (editC !== '') && (filter += `&city=${editC}`);
                    callAxios({
                        that: this,
                        method: 'get',
                        url : `${API.DistrciGetList}?${filter}`,
                    })
                    .then((res)=>{
                        let dataList =[],
                        {
                            data = null
                        } = res;
                        for(let i=0;i<data.length;i++){
                            dataList.push(<Option key={data[i].districtId} >{data[i].districtName}</Option>);
                        }
                        this.setState({
                            editRowWare : data.districtId,
                            DataList : dataList,
                        },()=>{
                            this.setState({
                                isdisabled : false,
                                spin : false,
                                addcheck : false,
                            })
                        })
                    })
                }
            }



        }
    );
}

export default HocBdArticle;

import API from '../../../utils/api.js';
import callAxios from '../../../utils/callAxios';
import * as appConfig from '../../../configs/appConfig.js';
import * as statusConfig from '../../../configs/statusConfig.js';
import {
    message,
} from 'antd';

import { setDefaultFileList } from '../../../components/UploadImgs.js'

const HocBdGoods = (WrappedComponent) => {
    return (
        class HocBdGoods extends WrappedComponent {
            render() {
                return super.render();
            }

            componentDidMount() {
                this.DistrictList();
                this.fetchTableData(1);
            }

            fetchTableData = (currentPage = 1, size = appConfig.pageableSize) => {
                this.setState({ isTableDataLoading: true, });
                let filter = this.getFetchTableFilter();
                callAxios({
                    that: this,
                    method: 'get',
                    url: `${API.goods}?page=${currentPage - 1}&size=${size}${filter}`,
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
                    })
                    if(content != ''){
                        this.setState({
                            districtId: content[0].districtId,
                        })
                    }
                })
                .finally(() => {
                    this.setState({ isTableDataLoading: false, });
                });

            }

            getFetchTableFilter = () => {
                let {
                    districtNum = '',
                    searchName = '',
                    searchSelect= '',
                } = this.state;
                let filter = '';
                (districtNum != null) && (filter += `&goodsTypeId=${districtNum}`);
                (searchName != null) && (filter += `&name=${searchName}`);
                (searchSelect != null) && (filter += `&saleType=${searchSelect}`);
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
                    pricePerCatty = '',
                    cattyEach = '',
                    name = '',
                    path = '',
                    price = '',
                    remark = '',
                    goodsTypeId = '',
                    content = '',
                    
                    level = '',
                    place = '',
                    standard = '',
                    tips = '',
                    storageMethod = '',
                } = record.goods,
                    {
                    goodsPictures = []
                } = record;
                this.tableCurIndex = index;
                let pathDefaultFileList = setDefaultFileList([path]);
                let goodsPicturesDefaultFileList = setDefaultFileList(goodsPictures);

                this.setState({
                    goodsTypeId,
                    goodsId : id,
                    path : path,
                    getTitle : content,

                    level : level,
                    place : place,
                    standard : standard,
                    tips : tips,
                    storageMethod : storageMethod,

                    editFormTitle: '编辑信息',
                    pathDefaultFileList,
                    goodsPicturesDefaultFileList,
                    isShowEditDialog: true,
                });
                let a = this.returnType(goodsTypeId);
                this.props.form.setFieldsValue({
                    a,
                    path,
                    name,
                    goodsPictures,
                    pricePerCatty: pricePerCatty/100,
                    cattyEach,
                    remark,
                    price: price/100,
                });
            }

            handleRowDeleteClick = (record, index) => {
                this.setState({ isTableDataLoading: true, });

                callAxios({
                    that: this,
                    method: 'delete',
                    url: `${API.goods}?goodsId=${record.goods.id}`,
                })
                .then((response) => {
                    message.success('删除成功！');

                    let currentPage = this.state.currentPage,
                        curPageSize = this.state.curPageSize - 1;
                    
                    if (curPageSize <= 0) {
                        --currentPage;

                        (currentPage < 0) && (currentPage = 0);
                    }
                    // this.handleSelectChange(this.state.districtNum);
                    this.fetchTableData(currentPage);
                })
                .catch(() => {
                    this.setState({ isTableDataLoading: false, });
                });
            }

            handleRowUpClick = (index, record) => {
                this.changeRowLoading('isRowChangeFlagBtnLoadings', index, true);
                callAxios({
                    that: this,
                    method: 'put',
                    url: `${API.operateGoods}?goodsId=${record.goods.id}`,
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

            returnType = (key) =>{
                let num = this.state.typeList,
                    keyPass ,
                    passNum;
                num.forEach(function(element,index) {
                    if(element.id == key){
                        passNum = element.name
                    }
                }, this);
                keyPass = {
                    key : key,
                    label : passNum
                }
                return keyPass 
            }

        }
    );
}

export default HocBdGoods;

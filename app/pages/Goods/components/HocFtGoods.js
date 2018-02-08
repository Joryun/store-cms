import API from '../../../utils/api.js';
import callAxios from '../../../utils/callAxios';
import * as appConfig from '../../../configs/appConfig.js';

import { message, } from 'antd';

const HocFtGoods = (WrappedComponent) => {
    return (
        class HocFtGoods extends WrappedComponent {
            render() {
                return super.render();
            }

            fetchEditInfo = (values) => {
                this.setState({ isEditOkBtnLoading: true });

                let toggleAddUpdateParam = this.toggleAddUpdate(values);
                let {
                    level = '',
                    place = '',
                    standard = '',
                    tips = '',
                    storageMethod = '',
                } = this.state;

                if(level == ''||place == '' ||standard ==''||tips==''||storageMethod == ''){
                    message.error("产品说明不能为空！");
                    this.setState({
                        isEditOkBtnLoading: false 
                    })
                }else if(level == null||place == null ||standard == null||tips== null||storageMethod == null){
                    message.error("产品说明不能为空！");
                    this.setState({
                        isEditOkBtnLoading: false 
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
                        let tableData = [...this.state.tableData];
    
                        switch (this.editFormFlag) {
                            case 'add':
                                tableData.unshift(data);
                                this.setState({
                                    tableDataTotal: this.state.tableDataTotal + 1,
                                    curPageSize: this.state.curPageSize + 1,
                                });
                                break;
                            case 'update':
                                (data) && (tableData[this.tableCurIndex] = data);
                                break;
                            default:
                                break;
                        }
    
                        (data) && (this.setState({ tableData }));
                        // this.handleSelectChange(this.state.districtNum);
                        this.setState({ isShowEditDialog: false, });
                    })
                    .finally(() => {
                        this.setState({ isEditOkBtnLoading: false, });
                    });
                }
            }

            toggleAddUpdate = (values) => {
                let {
                    path,
                    name,
                    goodsPictures,
                    pricePerCatty,
                    cattyEach,
                    price,
                    remark,
                } = values;
                // let goodsId  = this.state.id;
                // let editFormFlag = this.editFormFlag;
                // let goodsTypeId = this.state.goodsTypeId;
                // let content = this.state.getTitle;
                let {
                    editFormFlag,
                    goodsTypeId,
                    content,
                    level,
                    place,
                    standard,
                    tips,
                    storageMethod,
                    getTitle,
                } = this.state;

                let url = '',
                    method = '',
                    msg = '',
                    data = {
                        path,
                        name,
                        goodsPictures,
                        pricePerCatty :pricePerCatty*100,
                        cattyEach,
                        price :price*100,
                        remark,
                        goodsTypeId,
                        content,
                        level,
                        place,
                        standard,
                        tips,
                        storageMethod,
                        content : getTitle
                    };

                if (editFormFlag === 'add') {
                    url = API.goods;
                    method = 'post';
                    msg = '添加成功';
                } else {
                    url = API.goods;
                    method = 'put';
                    msg = '更新成功';
                    data.goodsId  = this.state.goodsId ;
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

export default HocFtGoods;

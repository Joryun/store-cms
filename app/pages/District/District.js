import React, { Component } from 'react';
import _compose from 'recompact/compose';
import { setDisplayName } from 'recompact';
import callAxios from 'utils/callAxios';
import API from 'utils/api.js';

import {
    Form, Button, Input, Select,Cascader,
    Table,
    Icon,
    Row,
    Popconfirm, Modal,
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import HocBdDistrict from './components/HocBdDistrict.js';
import HocHdDistrict from './components/HocHdDistrict.js';
import HocFtDistrict from './components/HocFtDistrict.js';

import * as appConfig from 'configs/appConfig.js';
import * as statusConfig from 'configs/statusConfig.js';
import amendArea from 'utils/area.js';
import * as utils from '../../utils/utils.js';

const enhance = _compose(
    HocBdDistrict,
    HocHdDistrict,
    HocFtDistrict,
);

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 }
};

const customRules = [{
    required: true,
    message: '必填',
}];

@enhance
class District  extends Component {
    constructor(props) {
        super(props);

        this.editFormFlag = 'add'; /* 信息框的标记，add--添加，update--更新 */
        this.tableCurIndex = -1;

        this.columns = [
            {
                title: '小区名字',
                className: 'ant-tableThead',
                dataIndex: 'districtName'
            },
            {
                title: '省',
                className: 'ant-tableThead',
                dataIndex: 'province',
                render:(province)=>{
                    let areaLabels = utils.getAreaLabels(amendArea , {
                        province:province
                    });
                    return (
                        <span>{`${areaLabels.province}`}</span>
                    );
                }
            },
            {
                title: '市',
                className: 'ant-tableThead',
                dataIndex: 'city',
                render:(city)=>{
                    let areaLabels = utils.getAreaLabels(amendArea , {
                        city:city
                    });
                    return (
                        <span>{`${areaLabels.city}`}</span>
                    );
                }
            },
            {
                title: '详细地址',
                className: 'ant-tableThead',
                dataIndex: 'address',
            },
            {
                title: '供应仓库',
                className: 'ant-tableThead',
                dataIndex: 'warehouseId',
                render : (warehouseId) =>{
                    let num = this.state.WareList,
                        passNum;
                    num.forEach(function(element) {
                        if(element.id == warehouseId){
                            passNum = element.warehouseName
                        }
                    }, this);
                    return <span>{passNum}</span>
                }
            },
            {
                title: '经纬度',
                className: 'ant-tableThead',
                key: 'districtId',
                render: (record) => {
                    return (
                        (record.longitude == null ||record.latitude == null)
                        ?('( - , - )')
                        :('( '+ record.longitude +' , '+ record.latitude +' )')
                        
                    );
                }
            },
            {
                title: '操作',
                className: 'ant-tableThead',
                key: 'action',
                width: 270,
                render: (text, record, index) => {
                    let { managerId = -1, frozen = -1 } = record;
                    return (
                        <span>
                            <Button loading={this.state.isRowEditBtnLoadings[index]} onClick={() => this.handleRowEditClick(index, record)}>信息编辑</Button>
                            <span className="ant-divider" />
                            <Popconfirm title="确定要删除吗？" placement="topRight" onConfirm={() => this.handleRowDeleteClick(record, index)}>
                                <Button type="danger">删除</Button>
                            </Popconfirm>
                            <span className="ant-divider" />
                            <Button
                                type={frozen == "TRUE" ? '' : 'danger'}
                                loading={this.state.isRowChangeFlagBtnLoadings[index]}
                                onClick={() => this.handleRowChangeFlagClick(index, record)}
                            >
                                { frozen == "TRUE" ? '启用' : '禁用' }
                            </Button>
                        </span>
                    );
                },
            }
        ]
    }

    state = {
        /* head's state */
        searchName: '',
        searchPro: '',
        searchCity: '',
        searchWare: '',

        /* body's state */
        tableData: [],
        currentPage: 1, /* 当前页数 */
        curPageSize: 0, /* 当前页面的条数 */
        pageSize: appConfig.pageableSize, /* 每页条数 */
        tableDataTotal: 0, /* 数据总数 */
        isTableDataLoading: false,
        isRowEditBtnLoadings: {},

        /* footer's state */
        districtId: '',
        warehouseId: '',
        districtName: '',
        province: '',
        city: '',
        address : '',
        provinceCity: null,
        editRowWare : null,

        /* 列表 */
        DataList: [],
        isdisabled : true,
        editP : '',
        editC : '',
        editSelectId : null,
        editFormTitle: '',
        EditProvinceCity: null,

        WareList : [],

        isShowEditDialog: false,
        isEditOkBtnLoading: false,
        isRowChangeFlagBtnLoadings: {},

        orderCount: 0,
        userAdminVO: [],
        isShowError:false,
        titleNo : "修改方案: 处理完订单数，即可删除该小区",
        titleSugger : "后续方案: 请删除小区之后，重新设置原小区的产品经理",
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Row className="lw-top-col" type="flex" align="middle">
                    <div className="lw-list-div">
                        <div className="lw-list-div-li">
                            <label>地区选择：</label>
                            <Cascader options={amendArea} placeholder="请选择地区" onChange={this.onChangeCascader}/>
                        </div>

                        <div className="lw-list-div-li" >
                            <label>小区名字：</label>
                            <Input
                                name="searchName"
                                placeholder="请输入小区名字"
                                defaultValue={this.state.searchName}
                                onChange={this.handleInputChange}
                                style={{width: 150}}
                            />
                        </div>
                        <div className="lw-list-div-li" >
                            <label>仓库名字：</label>
                            <Input
                                name="searchWare"
                                placeholder="请输入仓库名字"
                                defaultValue={this.state.searchWare}
                                onChange={this.handleInputChange}
                                style={{width: 150}}
                            />
                        </div>
        
                        <Button onClick={this.handleAddClick} icon="plus" style={{ float : 'right' }}>
                            添加小区
                        </Button>
                    </div>
                </Row>

                <Table
                    columns={this.columns}
                    rowKey={record => record.districtId || 0}
                    dataSource={this.state.tableData}
                    loading={this.state.isTableDataLoading}
                    pagination={{
                        current: this.state.currentPage,
                        pageSize: this.state.pageSize,
                        total: this.state.tableDataTotal,
                    }}
                    onChange={this.handleTableChange}
                />

                <Modal
                    title={this.state.editFormTitle}
                    visible={this.state.isShowEditDialog}
                    onOk={this.handleEditOkClick}
                    okText={appConfig.modalOkBtnText}
                    maskClosable={false}
                    confirmLoading={this.state.isEditOkBtnLoading}
                    onCancel={this.handleEditCancelClick}
                >
                    <Form onSubmit={this.handleEditOkClick}>
                        <FormItem
                            {...formItemLayout}
                            label="小区名字："
                        >
                            {
                                getFieldDecorator('districtName', {
                                    rules: customRules,
                                    initialValue: this.state.districtName
                                })(
                                    <Input placeholder="请输入小区名字"/>
                                )
                            }
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="省市选择："
                        >
                            {
                                getFieldDecorator('provinceCity', {
                                    rules: customRules,
                                    initialValue: this.state.provinceCity
                                })(
                                    <Cascader options={amendArea} 
                                    placeholder="请选择地区" 
                                    showSearch
                                    />
                                )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="小区地址："
                        >
                            {
                                getFieldDecorator('address', {
                                    rules: customRules,
                                    initialValue: this.state.address
                                })(
                                    <Input style={{width:300}} placeholder="请输入小区地址"/>
                                )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="仓库选择："
                        >
                            {
                                getFieldDecorator('EditProvinceCity', {
                                    initialValue: this.state.EditProvinceCity
                                })(
                                    <Cascader options={amendArea} 
                                    placeholder="请选择地区" 
                                    showSearch
                                    allowClear={false}
                                    onChange={this.onchangeFrom}
                                    onPopupVisibleChange={this.onPopupVisibleChange}
                                    />
                                )
                            }
                            {
                                getFieldDecorator('passWare', {
                                    initialValue: this.state.warehouseId
                                })(
                                    <Select
                                        showSearch
                                        labelInValue
                                        optionFilterProp="children"
                                        disabled = {this.state.isdisabled}
                                        placeholder="选择仓库"
                                        style={{ width: 200 }}
                                        onChange = {this.onchangeEditSecect }
                                        >
                                        {this.state.DataList}
                                    </Select>
                                )
                            }
                        </FormItem>

                    </Form> 
                </Modal>
                <Modal
                title="删除失败"
                visible={this.state.isShowError}
                onOk={this.onchangeError}
                onCancel={this.onchangeError}
                okText="确认"
                cancelText="取消"
                >
                    <h2>请检查以下参数：</h2>
                    <h3><div style={{padding:'0,15',width:150,textAlign:'right',float:'left'}}>该小区的 订单数为： </div><span> {this.state.orderCount} 条</span></h3>
                    <h3><div style={{padding:'0,15',width:150,textAlign:'right',float:'left'}}>该小区的 产品经理： </div><span> {this.state.userAdminVO.realName}； 手机号：{this.state.userAdminVO.phone}</span></h3>
                    <h3>{this.state.titleNo}</h3>
                    <h3>{this.state.titleSugger}</h3>
                </Modal>





            </div>
        );
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        },()=>{
            this.fetchTableData(1)
        });
    }

    changeRowLoading = (stateName, index, value) => {
        let state = this.state[stateName];
        state[index] = value;

        this.setState({ state });
    }

    callSetState = (stateName, value) => {
        this.setState({ [stateName]: value });
    }

    onChangeCascader = (value) => {
        if(value == ''){
            this.setState({
                searchPro: '',
                searchCity: ''
            },()=>{
                this.fetchTableData(1)
            })
        }else{
            this.setState({
                searchPro: value[0],
                searchCity: value[1]
            },()=>{
                this.fetchTableData(1)
            })
        }
    }

    AllWarehouseList = () => {
        callAxios({
            that: this,
            method: 'get',
            url : `${API.warehouseList}`,
        })
        .then((res)=>{
            let WareList = [],
                dataList = [],
                {
                    data = null
                } = res;
            for(let i=0;i<data.length;i++){
                WareList.push(<Option key={data[i].id} >{data[i].name}</Option>);
            }
            this.setState({
                dataList : WareList,
                WareList : res.data,
            },()=>{
                this.setState({
                    isdisabled : false,
                })
            })
        })
    }

/* 编辑获取仓库列表 */
    WarehouseList = () => {
        let {
            editP,
            editC
        } = this.state;
        if(editP != '' && editC != ''){
            let filter = '';
            (editP !== '') && (filter += `province=${editP}`);
            (editC !== '') && (filter += `&city=${editC}`);
            callAxios({
                that: this,
                method: 'get',
                url : `${API.warehouseList}?${filter}`,
            })
            .then((res)=>{
                let dataList =[],
                {
                    data = null
                } = res;
                for(let i=0;i<data.length;i++){
                    dataList.push(<Option key={data[i].id} >{data[i].warehouseName}</Option>);
                }
                this.setState({
                    editRowWare : data.id,
                    DataList : dataList,
                },()=>{
                    this.setState({
                        isdisabled : false,
                    })
                })
            })
        }
    }

    onchangeEditSecect = (value) =>{
        this.setState({
            editSelectId : value.key
        })
    }



}

const WrappedDistrict = Form.create()(District);

export default setDisplayName('District')(WrappedDistrict);

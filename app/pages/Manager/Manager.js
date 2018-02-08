import React, { Component } from 'react';
import _compose from 'recompact/compose';
import { setDisplayName } from 'recompact';
import callAxios from 'utils/callAxios';
import API from 'utils/api.js';

import {
    Form, Button, Input, Select,Cascader,InputNumber,
    Table,
    Icon,
    Row,
    Popconfirm, Modal,
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import HocBdManager from './components/HocBdManager.js';
import HocHdManager from './components/HocHdManager.js';
import HocFtManager from './components/HocFtManager.js';

import * as appConfig from 'configs/appConfig.js';
import * as statusConfig from 'configs/statusConfig.js';
import amendArea from 'utils/area.js';

const enhance = _compose(
    HocBdManager,
    HocHdManager,
    HocFtManager,
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
class Manager  extends Component {
    constructor(props) {
        super(props);

        this.editFormFlag = 'add'; /* 信息框的标记，add--添加，update--更新 */
        this.tableCurIndex = -1;

        this.columns = [
            {
                title: '真实名字',
                className: 'ant-tableThead',
                dataIndex: 'realName'
            },
            {
                title: '手机号码',
                className: 'ant-tableThead',
                dataIndex: 'phone',
            },
            {
                title: '负责小区',
                className: 'ant-tableThead',
                dataIndex: 'districtId',
                render : (districtId) =>{
                    let num = this.state.WareList,
                        passNum;
                    num.forEach(function(element) {
                        if(element.districtId == districtId){
                            passNum = element.districtName
                        }
                    }, this);
                    return <span>{passNum}</span>
                }
            },
            {
                title: '分成比例',
                className: 'ant-tableThead',
                dataIndex: 'balanceProportion',
                render: (balanceProportion)=>{
                    return <span>{balanceProportion*100} %</span>
                }
            },
            {
                title: '分成余额',
                className: 'ant-tableThead',
                dataIndex: 'dividend'
            },
            {
                title: '用户余额',
                className: 'ant-tableThead',
                dataIndex: 'balance'
            },
            {
                title: '冻结金额',
                className: 'ant-tableThead',
                dataIndex: 'freezeBalance'
            },
            {
                title: '创建时间',
                className: 'ant-tableThead',
                dataIndex: 'createTime',
                render:statusConfig.AppstateTime,
            },
            {
                title: '最近登录时间',
                className: 'ant-tableThead',
                dataIndex: 'updateTime',
                render:statusConfig.AppstateTime,
            },

            {
                title: '操作',
                className: 'ant-tableThead',
                key: 'action',
                width: 200,
                render: (text, record, index) => {
                    let { managerId = -1 } = record;
                    
                    return (
                        <span>
                            <Button loading={this.state.isRowEditBtnLoadings[index]} onClick={() => this.handleRowEditClick(index, record)}>信息编辑</Button>
                            <span className="ant-divider" />
                            <Popconfirm title="确定要删除吗？" placement="topRight" onConfirm={() => this.handleRowDeleteClick(index,record)}>
                                <Button type="danger">删除</Button>
                            </Popconfirm>
                        </span>
                    );
                },
            }
        ]
    }

    state = {
        /* head's state */
        searchName: '',
        searchPhone: '',
        searchSelect: '',

        /* body's state */
        tableData: [],
        currentPage: 1, /* 当前页数 */
        curPageSize: 0, /* 当前页面的条数 */
        pageSize: appConfig.pageableSize, /* 每页条数 */
        tableDataTotal: 0, /* 数据总数 */
        isTableDataLoading: false,
        isRowEditBtnLoadings: {},

        /* footer's state */
        userId: '',
        realName: '',
        phone: '',
        managerRole: '',
        balanceProportion: 0,

        /* 列表 */
        DataList: [],
        isdisabled : true,
        editP : '',
        editC : '',
        editSelectId : null,
        districtId : '',
        editFormTitle: '',
        passDistrict: {key:'',label:''},
        EditProvinceCity: {key:'',label:''},

        WareList : [],

        isShowEditDialog: false,
        isEditOkBtnLoading: false,
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Row className="lw-top-col" type="flex" align="middle" justify="space-between">
                    <div>
                    <Form layout="inline" onSubmit={this.handleSearchSubmit}>
                        <FormItem label="真实名字" >
                            <Input
                                name="searchName"
                                placeholder="请输入名字"
                                defaultValue={this.state.searchName}
                                onChange={this.handleInputChange}
                            />
                        </FormItem>
                        <FormItem label="电话">
                            <Input
                                name="searchPhone"
                                placeholder="请输入电话"
                                defaultValue={this.state.searchPhone}
                                onChange={this.handleInputChange}
                            />
                        </FormItem>
                        <FormItem label="是否有小区">
                            <Select style={{ width: 120 }} 
                            defaultValue = "全部"
                            onSelect={this.onchangeSelect}>
                                {
                                    statusConfig.hasDistrict.map((item, index) => {
                                        return (
                                            <Option key={index} value={`${index}`} >{ item }</Option>
                                        );
                                    })
                                }
                            </Select> 
                        </FormItem>
                        <FormItem>
                            <Button 
                            type="primary" 
                            loading={this.state.isTableDataLoading} 
                            htmlType="submit" 
                            >
                                查询
                            </Button>
                        </FormItem>
                    </Form> 
                    </div>
                    <Button onClick={this.handleAddClick} icon="plus">
                        添加产品经理
                    </Button>
                </Row>

                <Table
                    columns={this.columns}
                    rowKey={record => record.phone || 0}
                    dataSource={this.state.tableData}
                    loading={this.state.isTableDataLoading}
                    pagination={{
                        current: this.state.currentPage,
                        pageSize: this.state.curPageSize,
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
                            label="真实名字"
                        >
                            {
                                getFieldDecorator('realName', {
                                    rules: customRules,
                                    initialValue: this.state.realName
                                })(
                                    <Input placeholder="请输入姓名"/>
                                )
                            }
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="电话号码"
                        >
                            {
                                getFieldDecorator('phone', {
                                    rules: customRules,
                                    initialValue: this.state.phone
                                })(
                                    <Input placeholder="请输入手机号码"/>
                                )
                            }
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="选择小区"
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
                                getFieldDecorator('passDistrict', {
                                    initialValue: this.state.passDistrict
                                })(
                                    <Select
                                        showSearch
                                        labelInValue
                                        optionFilterProp="children"
                                        disabled = {this.state.isdisabled}
                                        placeholder="选择小区"
                                        style={{ width: 200 }}
                                        onChange = {this.onchangeEditSecect }
                                        >
                                        {this.state.DataList}
                                    </Select>
                                )
                            }

                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="分成比例"
                        >
                            {
                                getFieldDecorator('balanceProportion', {
                                    rules: customRules,
                                    initialValue: this.state.balanceProportion
                                })(
                                    <InputNumber min={0} max={1} precision={2}/>
                                )
                            } 0~1之间
                        </FormItem>

                    </Form>
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

    onchangeEditSecect = (value) =>{
        this.setState({
            editSelectId : value.key
        })
    }

    AllWarehouseList = () => {
        callAxios({
            that: this,
            method: 'get',
            url : `${API.DistrciGetList}`,
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
                    })
                })
            })
        }
    }

    onchangeSelect = (value) => {
        if(value == "0"){
            value = ''
        }else if(value == "1"){
            value = true
        }else if(value == "2"){
            value = false
        }
        this.setState({
            searchSelect : value
        })
    }

}

const WrappedManager = Form.create()(Manager);

export default setDisplayName('Manager')(WrappedManager);

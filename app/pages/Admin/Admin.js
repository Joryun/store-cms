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

import HocBdAdmin from './components/HocBdAdmin.js';
import HocHdAdmin from './components/HocHdAdmin.js';
import HocFtAdmin from './components/HocFtAdmin.js';

import * as appConfig from 'configs/appConfig.js';
import * as statusConfig from 'configs/statusConfig.js';
import amendArea from 'utils/area.js';
import * as utils from '../../utils/utils.js';

const enhance = _compose(
    HocBdAdmin,
    HocHdAdmin,
    HocFtAdmin,
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
class Admin  extends Component {
    constructor(props) {
        super(props);

        this.editFormFlag = 'add'; /* 信息框的标记，add--添加，update--更新 */
        this.tableCurIndex = -1;

        this.columns = [
            {
                title: '账号',
                className: 'ant-tableThead',
                dataIndex: 'account'
            },
            {
                title: '名字',
                className: 'ant-tableThead',
                dataIndex: 'managerName'
            },
            {
                title: '角色类型',
                className: 'ant-tableThead',
                dataIndex: 'managerRole',
            },
            {
                title: '负责仓库',
                className: 'ant-tableThead',
                dataIndex: 'warehouseName',
                render:(warehouseName)=>{
                    if(warehouseName == ''||warehouseName == null){
                        return <span>无</span>
                    }else{
                        return <span>{warehouseName}</span>
                    }
                }
            },
            {
                title: '电话',
                className: 'ant-tableThead',
                dataIndex: 'phone',
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
                            <Popconfirm title="确定要删除吗？" placement="topRight" onConfirm={() => this.handleRowDeleteClick(managerId, index)}>
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
        wareRole: true,
        display : 'none',
        // searchName: '',

        /* body's state */
        tableData: [],
        currentPage: 1, /* 当前页数 */
        curPageSize: 0, /* 当前页面的条数 */
        pageSize: appConfig.pageableSize, /* 每页条数 */
        tableDataTotal: 0, /* 数据总数 */
        isTableDataLoading: false,
        isRowEditBtnLoadings: {},

        /* footer's state */
        "managerId": -1,
        "managerName": '',
        "password": '',
        "managerRole": '',
        "phone": '',
        "warehouseId" : '',

        EditProvinceCity: {key:'',label:''},
        passWare: {key:'',label:''},
        DataList: [],
        WareList: [],
        editRowWare: null,
        isdisabled: false,

        editFormTitle: '',
        
        isShowEditDialog: false,
        isEditOkBtnLoading: false,
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Row className="lw-top-col" type="flex" align="middle" justify="space-between">
                    {/* <Form layout="inline" onSubmit={this.handleSearchSubmit}>
                        <FormItem label="管理员名字">
                            <Input
                                name="searchName"
                                placeholder="请输入管理员名字"
                                defaultValue={this.state.searchName}
                                onChange={this.handleInputChange}
                            />
                        </FormItem>
        
                        <FormItem>
                            <Button type="primary" loading={this.state.isTableDataLoading} htmlType="submit">查询</Button>
                        </FormItem>
                    </Form> */}
                    <div></div>
                    <Button onClick={this.handleAddClick} icon="plus">
                        添加管理员
                    </Button>
                </Row>

                <Table
                    columns={this.columns}
                    rowKey={record => record.managerId || 0}
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
                            label="账号"
                        >
                            {
                                getFieldDecorator('account', {
                                    rules: customRules,
                                    initialValue: this.state.account
                                })(
                                    <Input placeholder="请输入账号"/>
                                )
                            }
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="名字"
                        >
                            {
                                getFieldDecorator('managerName', {
                                    rules: customRules,
                                    initialValue: this.state.managerName
                                })(
                                    <Input placeholder="请输入名字"/>
                                )
                            }
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="角色类型 "
                        >
                            {
                                getFieldDecorator('managerRole', {
                                    rules: customRules,
                                    initialValue: this.state.managerRole
                                })(
                                    <Select style={{ width: 120 }} onSelect={this.onchangeRole}>
                                        {
                                            statusConfig.managerRole.map((item, index) => {
                                                return (
                                                    <Option key={index} value={`${index}`} >{ item }</Option>
                                                );
                                            })
                                        }
                                    </Select> 
                                )
                            }
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="仓库选择"
                            style={{display:this.state.display}}
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

                        <FormItem
                            {...formItemLayout}
                            label="电话"
                        >
                            {
                                getFieldDecorator('phone', {
                                    rules: customRules,
                                    initialValue: this.state.phone
                                })(
                                    <Input placeholder="请输入密码"/>
                                )
                            }
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="密码"
                        >
                            {
                                getFieldDecorator('password', {
                                    rules: customRules,
                                    initialValue: this.state.password
                                })(
                                    <Input placeholder="请输入密码"/>
                                )
                            }
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

    onchangeRole = (value) => {
        ( value == 1 )?(
            this.setState({
                wareRole : false,
                display : 'block'
            })
        ):(
            this.setState({
                wareRole : true,
                display : 'none'
            })
        );
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

}

const WrappedAdmin = Form.create()(Admin);

export default setDisplayName('Admin')(WrappedAdmin);

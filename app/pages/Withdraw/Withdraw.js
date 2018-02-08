import React, { Component } from 'react';
import _compose from 'recompact/compose';
import { setDisplayName } from 'recompact';
import * as appConfig from 'configs/appConfig.js';
import * as statusConfig from 'configs/statusConfig.js';
import moment from 'moment';

import {
    Form, Button, Input,DatePicker,Select,
    Table,
    Icon,
    Row,
    Popconfirm, Modal,
} from 'antd';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;

import HocBdWithdraw from './components/HocBdWithdraw.js';
// TODO: 第三写FtWithdraw
import HocFtWithdraw from './components/HocFtWithdraw.js';


const enhance = _compose(
    HocBdWithdraw,
    // TODO: 第三写FtWithdraw
    HocFtWithdraw,
);

// TODO: 是否需要修改form中label和input的长度
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 }
};

// TODO: 是否需要校验规则
const customRules = [{
    required: true,
    message: '必填',
}];

@enhance
class Withdraw extends Component {
    constructor(props) {
        super(props);

        this.editFormFlag = 'add'; /* 信息框的标记，add--添加，update--更新 */
        this.tableCurIndex = -1;

        this.columns = [
            // TODO: 添加、修改列
            {
                title: '申请人',
                className: 'ant-tableThead',
                dataIndex: 'username'
            },
            {
                title: '申请金额',
                className: 'ant-tableThead',
                dataIndex: 'balance'
            }, 
            {
                title: '转账流水单号',
                className: 'ant-tableThead',
                dataIndex: 'serialNumber',
                render : (serialNumber)=>{
                    if(serialNumber == null){
                        return <span>无</span>
                    }else{
                        return <span>{serialNumber}</span>
                    }
                }
            },
            {
                title: '申请时间',
                className: 'ant-tableThead',
                dataIndex: 'createTime',
                render:statusConfig.AppstateTime,
            },
            {
                title: '处理时间',
                className: 'ant-tableThead',
                dataIndex: 'updateTime',
                render:statusConfig.AppstateTime,
            }, 
            {
                title: '备注',
                className: 'ant-tableThead',
                dataIndex: 'remark'
            },
            {
                title: '审核状态',
                className: 'ant-tableThead',
                dataIndex: 'cashRecordState'
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
                            <Button loading={this.state.isRowEditBtnLoadings[index]} onClick={() => this.handleRowEditClick(index, record)}>处理</Button>
                        </span>
                    );
                },
            }
        ]
    }

    state = {
        /* head's state */
        // TODO: 增删改HdWithdraw的state
        serialNumber : '',
        editSelect: '',
        endTime: '',
        edirStartTime: '',

        cashRecordId: '',

        /* body's state */
        // TODO: body的props，一般通用，检查一下即可
        tableData: [],
        currentPage: 1, /* 当前页数 */
        curPageSize: 0, /* 当前页面的条数 */
        pageSize: appConfig.pageableSize, /* 每页条数 */
        tableDataTotal: 0, /* 数据总数 */
        isTableDataLoading: false,
        isRowEditBtnLoadings: {},

        /* footer's state */
        // TODO: 增删改FtWithdraw的state
        editFormTitle: '',
        
        isShowEditDialog: false,
        isEditOkBtnLoading: false,
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Row className="lw-top-col" type="flex" align="middle">
                    <div style={{paddingRight:15}} >
                        <label>小区搜索：</label>
                        <Input
                            name="searchName"
                            placeholder="请输入小区名字"
                            defaultValue={this.state.searchName}
                            onChange={this.handleInputChange}
                            style={{ width: 200 }}
                        />
                    </div>
                    <div style={{paddingRight:15}} >
                    <label>时间选择：</label>
                        <RangePicker onChange={this.onChangeDate} />
                    </div>
                    <div style={{paddingRight:15}} >
                        <label>审核状态：</label>
                        <Select
                            showSearch
                            allowClear
                            placeholder="选择状态"
                            style={{ width: 100 }}
                            onChange = {this.onchangeSelect}
                        >
                        {
                            statusConfig.cashRecordState.map((item, index) => {
                                return (
                                    <Option key={index} value={`${item}`}>{ item }</Option>
                                );
                            })
                        }
                        </Select>
                    </div>
                </Row>

                <Table
                    columns={this.columns}
                    /* TODO: 修改rowKey record.id */
                    rowKey={record => record.cashRecordId || 0}
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
                            label="转账流水单号"
                        >
                            {
                                getFieldDecorator('serialNumber', {
                                    initialValue: this.state.serialNumber
                                })(
                                    <Input 
                                    style = {{width : 350}}
                                    placeholder="请输入转账流水单号"/>
                                )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="备注"
                        >
                            {
                                getFieldDecorator('remark', {
                                    initialValue: this.state.remark
                                })(
                                    <Input 
                                    style = {{width : 350}}
                                    placeholder="请输入备注"/>
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
    onChangeDate = (date, dateString) => {
        let startT = dateString[0],
            endT = dateString[1],
            startTime,endTime;
        if(startT == ''||endT == ''){
            startTime = '',
            endTime = ''
        }else{
            startTime = moment(startT).format('X') + '000',
            endTime = moment(endT).format('X') + '000'
        }
        this.setState({
            edirStartTime : startTime,
            editEndTime : endTime
        },()=>{
            this.fetchTableData(1);
        })
    }

    onchangeSelect = (value) => {
        let num;
        switch (value) {
            case '全部':
                num = ''
                break;
            case '未处理':
                num = 'Undeal'
                break;
            case '已处理':
                num = 'Deal'
                break;
        }
        this.setState({
            editSelect : num
        },()=>{
            this.fetchTableData(1);
        })
    }
}

// TODO: 若没有footer，没有需要编辑的form，就不要这个
const WrappedWithdraw = Form.create()(Withdraw);

// TODO: WrappedWithdraw，请将WrappedWithdraw换成Withdraw
export default setDisplayName('Withdraw')(WrappedWithdraw);

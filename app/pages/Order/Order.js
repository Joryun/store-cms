import React, { Component } from 'react';
import _compose from 'recompact/compose';
import { setDisplayName } from 'recompact';

import {
    Form, Button, Input, Select, DatePicker, Radio,
    Table,
    Icon,
    Row,
    Popconfirm, Modal,
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import HocBdOrder from './components/HocBdOrder.js';
import HocHdOrder from './components/HocHdOrder.js';
import HocFtOrder from './components/HocFtOrder.js';
import EditableCell from './components/SecondaryForm.js';

import * as utils from 'utils/utils.js';
import * as appConfig from 'configs/appConfig.js';
import * as statusConfig from 'configs/statusConfig.js';

const enhance = _compose(
    HocBdOrder,
    HocHdOrder,
    HocFtOrder,
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
class Order extends Component {
    constructor(props) {
        super(props);

        this.editFormFlag = 'add'; /* 信息框的标记，add--添加，update--更新 */
        this.tableCurIndex = -1;
        this.abc = {};

        this.columns = [
            {
                title: '订单号',
                className: 'ant-tableThead',
                dataIndex: 'outTradeNo',
                width: 100,
                fixed: 'left',
            },
            {
                title: '订单金额',
                className: 'ant-tableThead',
                dataIndex: 'totalFee',
                render: (totalFee)=>{
                    return(
                        <span>{totalFee / 100} 元</span>
                    )
                }
            },
            {
                title: '所属小区',
                className: 'ant-tableThead',
                dataIndex: 'districtName'
            },
            {
                title: '门牌号',
                className: 'ant-tableThead',
                dataIndex: 'houseNumber'
            },
            {
                title: '供应仓库',
                className: 'ant-tableThead',
                dataIndex: 'warehouseName',
            },
            {
                title: '差额',
                className: 'ant-tableThead',
                dataIndex: 'differencePrice',
                render: (differencePrice)=>{
                    if(differencePrice == ''||differencePrice == null){
                        return <span>无</span>
                    }else{
                        return <span>{differencePrice}</span>
                    }
                }
            },
            {
                title: '买家用户',
                className: 'ant-tableThead',
                dataIndex: 'name',
                width: 120,
                fixed: 'right',
            },
            {
                title: '订单状态',
                className: 'ant-tableThead',
                dataIndex: 'orderState',
                width: 120,
                fixed: 'right',
            },
            {
                title: '创建时间',
                className: 'ant-tableThead',
                dataIndex: 'createTime',
                width: 120,
                fixed: 'right',
                render:statusConfig.AppstateTime,
            },
            {
                title: '操作',
                className: 'ant-tableThead',
                dataIndex: 'assess',
                key: 'action',
                width: 200,
                fixed: 'right',
                render: (text, record, index) => {
                    let { id = -1 } = record,
                        isAssess;

                    if(text == null){
                        isAssess = true;
                    }else{
                        isAssess = false;
                    }

                    return (
                        <span>
                            <Button loading={this.state.isRowEditBtnLoadings[index]} onClick={() => this.handleRowEditClick(index, record)}>信息编辑</Button>
                            <span className="ant-divider" />
                            {
                                isAssess ?
                                <Button loading={this.state.isSeeEvaluateBtnLoadings[index]} onClick={() => this.handleSeeEvaluateClick(index, record)} disabled>查看评价</Button>
                                :
                                <Button loading={this.state.isSeeEvaluateBtnLoadings[index]} onClick={() => this.handleSeeEvaluateClick(index, record)} >查看评价</Button>
                            }
                            
                        </span>
                    );
                },
            }
        ]

        this.secolumns = [
            {
                title: '商品名称',
                className: 'ant-tableThead',
                dataIndex: 'goodsName',
            }, {
                title: '份数',
                className: 'ant-tableThead',
                dataIndex: 'goodsNum',
            }, {
                title: '每份金额',
                className: 'ant-tableThead',
                dataIndex: 'goodsPrice',
                render: (goodsPrice)=>{
                    return(
                        <span>{goodsPrice / 100} 元</span>
                    )
                }
            }, {
                title: '单品小计',
                className: 'ant-tableThead',
                dataIndex: 'goodsTotalFee',
                render: (goodsTotalFee)=>{
                    return(
                        <span>{goodsTotalFee / 100} 元</span>
                    )
                } 
            }, {
                title: '每斤价格',
                className: 'ant-tableThead',
                dataIndex: 'pricePerCatty',
                render: (pricePerCatty)=>{
                    return(
                        <span>{pricePerCatty / 100} 元</span>
                    )
                }
            },{
                title: '每份几斤',
                className: 'ant-tableThead',
                dataIndex: 'cattyEach',
                render: (cattyEach)=>{
                    return(
                        <span>{cattyEach} 斤</span>
                    )
                }
            },{
                title: '总斤数',
                className: 'ant-tableThead',
                dataIndex: 'cattyEach'+'goodsNum',
                render: (index,record)=>{
                    return(
                        <span>{record.cattyEach*record.goodsNum} 斤</span>
                    )
                }
            },{
                title: '配送质量差额 （单位：斤）',
                className: 'ant-tableThead',
                dataIndex: 'quantityDifference',
                width: '30%',
                render: (text, record) => {
                    return (
                        <EditableCell
                            value={text}
                            onChange={this.onCellChange(record.key, 'quantityDifference')}
                            id={record.id}
                            orderId={record.orderId}
                        />
                    )
                },
            }
        ];

    }

    state = {
        /* head's state */
        adminWareId: '',
        searchDistrictId: '',
        searchUserId: '',
        searchWarehouse: '',
        searchStartTime: '',
        searchEndTime: '',
        searchFlag: '',
        searchOutTradeNo: '',
        searchEvaluate: '',

        /* body's state */
        tableData: [],
        currentPage: 1, /* 当前页数 */
        curPageSize: 0, /* 当前页面的条数 */
        pageSize: appConfig.pageableSize, /* 每页条数 */
        tableDataTotal: 0, /* 数据总数 */
        isTableDataLoading: false,
        isRowEditBtnLoadings: {},
        isSeeEvaluateBtnLoadings: {},

        totalFee: '',
        totalNum: '',
        secData: [],

        /* footer's state */
        "orderId": -1,
        orderState : '',

        editFormTitle: '',
        
        isShowEditDialog: false,
        isEditOkBtnLoading: false,

        isShowEvaluateDialog: false,
        isEvaluateOkBtnLoading: false,
        isAdminRole : false,
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Row className="lw-top-col" type="flex" align="middle" justify="space-between">
                    <Form layout="inline">
                        <div style={{paddingBottom:15}}>
                            <FormItem label="订单号码">
                                <Input
                                    name="searchOutTradeNo"
                                    placeholder="请输入订单号"
                                    defaultValue={this.state.searchOutTradeNo}
                                    onChange={this.handleInputChange}
                                />
                            </FormItem>
                            <FormItem label="所属小区">
                                <Input
                                    name="searchDistrictId"
                                    placeholder="请输入小区名字"
                                    defaultValue={this.state.searchDistrictId}
                                    onChange={this.handleInputChange}
                                />
                            </FormItem>

                            <FormItem label="买家用户">
                                <Input
                                    name="searchUserId"
                                    placeholder="请输入用户名"
                                    defaultValue={this.state.searchUserId}
                                    onChange={this.handleInputChange}
                                />
                            </FormItem>

                            <FormItem label="供应仓库" >
                                <Input
                                    disabled={this.state.isAdminRole}
                                    name="searchWarehouse"
                                    placeholder="请输入供应仓库"
                                    defaultValue={this.state.searchWarehouse}
                                    onChange={this.handleInputChange}
                                />
                            </FormItem>
                        </div>
                        <div>
                            <FormItem label="订单状态">
                                <Select allowClear placeholder="请选订单状态" style={{ width: 120 }} onChange={(value) => { this.callSetState('searchFlag', value) }}>
                                    {
                                        statusConfig.orderState.map((item, index) =>
                                            <Option key={index} value={`${index + 1}`}>{ item }</Option>
                                        )
                                    }
                                </Select>
                            </FormItem>

                            <FormItem label="评价反馈">
                                <Select allowClear placeholder="请选评价反馈" style={{ width: 120 }} onChange={(value) => { this.callSetState('searchEvaluate', value) }}>
                                    {
                                        statusConfig.Evaluate.map((item, index) =>
                                            <Option key={index} value={`${index + 1}`}>{ item }</Option>
                                        )
                                    }
                                </Select>
                            </FormItem>
                            <FormItem label="时间范围">
                                <RangePicker style={{ width: '240px' }} onChange={this.handleSearchTimeChange} allowClear />
                            </FormItem>
                        </div>

                    </Form>
                </Row>

                <Row className="lw-top-col">
                    <Button loading={this.state.isExportBtnLoading} onClick={this.handleExportClick} icon="download">表格导出</Button>
                    <Button type="primary" style={{margin:'0 15px'}} onClick={this.onClickOrderNeedSend}>查看派送订单数量</Button>
                    <Button type="primary" onClick={this.onClickOrderNotSend} >查看超时订单数量</Button>
                </Row>

                <Row className="lw-top-col">
                    <div>营业总额：{this.state.totalFee}</div>
                    <div>订单数量：{this.state.totalNum}</div>
                </Row>

                <Table
                    columns={this.columns}
                    scroll={{ x: '120%' }}
                    rowKey={record => record.orderId || 0}
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
                    width={"1000px"}
                    title={this.state.editFormTitle}
                    visible={this.state.isShowEditDialog}
                    onOk={this.handleEditOkClick}
                    okText={appConfig.modalOkBtnText}
                    confirmLoading={this.state.isEditOkBtnLoading}
                    onCancel={this.handleEditCancelClick}
                >
                    <Form onSubmit={this.handleEditOkClick}>
                        <FormItem
                            label="订单状态"
                        >
                            {
                                getFieldDecorator('orderState', {
                                    rules: customRules,
                                    initialValue: this.state.orderState
                                })(
                                    <RadioGroup >
                                        {
                                            
                                            statusConfig.orderState.map((item, index) => {
                                                let data = [],
                                                    state = false,
                                                    managerRole = utils.getSSItem('managerRole');
                                                    if(managerRole == "warehouse"){
                                                        if(index > 1){
                                                            state = true
                                                        }
                                                        data = (<RadioButton key={item} disabled={state} value={`${item}`}>{ item }</RadioButton>)
                                                    }else{
                                                        data = (<RadioButton key={item} disabled={state} value={`${item}`}>{ item }</RadioButton>)
                                                    }
                                                return (
                                                    data
                                                );
                                            })
                                        
                                        }
                                    </RadioGroup>
                                    
                                )
                            }
                        </FormItem>
                        
                        <Table
                            bordered
                            columns={this.secolumns}
                            dataSource={this.state.secData}
                            rowKey={record => record.id || 0}
                        />

                    </Form>
                </Modal>

                <Modal
                    title={this.state.editFormTitle}
                    visible={this.state.isShowEvaluateDialog}
                    onOk={this.handleEvaluateCancelClick}
                    okText={appConfig.modalOkBtnText}
                    confirmLoading={this.state.isEvaluateOkBtnLoading}
                    onCancel={this.handleEvaluateCancelClick}
                >
                    <div>{this.state.assess}</div>
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
            this.fetchTableData(1);
        });
    }

    changeRowLoading = (stateName, index, value) => {
        let state = this.state[stateName];

        state[index] = value;

        this.setState({ state });
    }

    callSetState = (stateName, value) => {
        if(value == undefined){
            this.setState({ 
                [stateName]: value
            },()=>{
                this.fetchTableData(1);
            });
        }else{
            let num = parseInt(value) + 1;
            this.setState({ 
                [stateName]: num.toString()
            },()=>{
                this.fetchTableData(1);
            });
        }

    }
}

const WrappedOrder = Form.create()(Order);

export default setDisplayName('Order')(WrappedOrder);

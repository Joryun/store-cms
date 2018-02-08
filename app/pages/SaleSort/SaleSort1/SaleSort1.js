import React, { Component } from 'react';
import _compose from 'recompact/compose';
import { setDisplayName } from 'recompact';
import moment from 'moment';
import UploadImgs from 'components/UploadImgs.js';


import {
    Form, Button, Input, Select, InputNumber,
    Table,
    Icon,
    Row,
    Popconfirm, Modal,
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import HocBdSaleSort1 from './components/HocBdSaleSort1.js';
import HocHdSaleSort1 from './components/HocHdSaleSort1.js';
import HocFtSaleSort1 from './components/HocFtSaleSort1.js';
import HocOtSaleSort1 from './components/HocOtSaleSort1.js';

import * as appConfig from 'configs/appConfig.js';
import * as statusConfig from 'configs/statusConfig.js';

const enhance = _compose(
    HocBdSaleSort1,
    HocHdSaleSort1,
    HocFtSaleSort1,
    HocOtSaleSort1,
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
class SaleSort1  extends Component {
    constructor(props) {
        super(props);

        this.editFormFlag = 'add'; /* 信息框的标记，add--添加，update--更新 */
        this.tableCurIndex = -1;
        this.editFromFlagPic = 'add'/* 添加banner状态标记 */
        this.tableCurIndexPic = -1;

        this.columns = [
            {
                title: '商品ID',
                className: 'ant-tableThead',
                dataIndex: 'goodsVO.goods.id'
            }, 
            {
                title: '商品名称',
                className: 'ant-tableThead',
                dataIndex: 'goodsVO.goods.name'
            },
            {
                title: '优先级',
                className: 'ant-tableThead',
                dataIndex: 'priority'
            },
            {
                title: '创建时间',
                className: 'ant-tableThead',
                dataIndex: 'createTime',
                render : (createTime) => {
                    return <span>{moment(createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                }
            },
            {
                title: '操作',
                className: 'ant-tableThead',
                key: 'action',
                width: 200,
                render: (text, record, index) => {
                    let { id = -1 } = record.goodsVO.goods;
                    
                    return (
                        <span>
                            <Popconfirm title="确定要删除吗？" placement="topRight" onConfirm={() => this.handleRowDeleteClick(id, index)}>
                                <Button type="danger">删除</Button>
                            </Popconfirm>
                        </span>
                    );
                },
            }
        ]
// banner
        this.columnsPic = [
            {
                title: '展示图',
                className: 'ant-tableThead',
                dataIndex: 'bannerUrl',
                render: (bannerUrl)=>{
                    return <img src={bannerUrl} key={bannerUrl} style={{width:50}} />
                }
            },
            {
                title: '跳转路径',
                className: 'ant-tableThead',
                dataIndex: 'redirectUrl',
            },
            {
                title: '优先级',
                className: 'ant-tableThead',
                dataIndex: 'priority',
            },
            {
                title: '操作',
                className: 'ant-tableThead',
                key: 'action',
                width: 200,
                render: (text, record, index) => {
                    return (
                        <span>
                            <Button loading={this.state.isRowEditBtnLoadingsPic[index]} 
                            onClick={() => this.handleRowEditClickPic(index, record)}>信息编辑</Button>
                            <span className="ant-divider" />
                            <Popconfirm title="确定要删除吗？" placement="topRight" onConfirm={() => this.handleRowDeleteClickPic(record, index)}>
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
        "id": -1,
        goodsId : -1,
        priority : '',

        editFormTitle: '',
        
        isShowEditDialog: false,
        isEditOkBtnLoading: false,

// 新的banner参数 
        isShowPic : false,
        isPicOkBtnLoading: false,
        tableDataPic: [],
        defaultFileList: [],
        isRowEditBtnLoadingsPic: {},
        currentPagePic: 1, /* 当前页数 */
        curPageSizePic: 0, /* 当前页面的条数 */
        pageSizePic: appConfig.pageableSize, /* 每页条数 */
        tableDataTotalPic: 0, /* 数据总数 */

        bannerId: -1,
        bannerUrl: '',
        redirectUrl: '',
        priorityPic : '',
        isEditOkBtnLoadingPic: false,
        isShowEditDialogPic: false,
        editFormTitlePic: false,
        isPicTableDataLoading: false,
    };

    render() {
        const { getFieldDecorator,getFieldDecoratorPic } = this.props.form;

        return (
            <div>
                <Row className="lw-top-col" type="flex" align="middle" justify="space-between">
                    <div></div>
                    <div>
                        <Button onClick={this.handleWatchPic} icon="plus" style={{marginRight:30,display:'none'}}>
                            查看热销展示图
                        </Button>
                        <Button onClick={this.handleAddClick} icon="plus">
                            添加热销商品
                        </Button>
                    </div>
                </Row>

                <Table
                    columns={this.columns}
                    rowKey={record => record.id || 0}
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
                            label="商品ID"
                        >
                            {
                                getFieldDecorator('goodsId', {
                                    rules: customRules,
                                    initialValue: this.state.goodsId
                                })(
                                    <Input placeholder="请输入商品ID"/>
                                )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="优先级"
                        >
                            {
                                getFieldDecorator('priority', {
                                    rules: customRules,
                                    initialValue: this.state.priority 
                                })(
                                    <InputNumber min={1} max={100}/>
                                )
                            }
                        </FormItem>

                    </Form>
                </Modal>
{/* 查看banner */}
                <Modal
                    title="查看展示图"
                    width={720}
                    visible={this.state.isShowPic}
                    onOk={this.handlePicOkClick}
                    okText={appConfig.modalOkBtnText}
                    maskClosable={true}
                    confirmLoading={this.state.isPicOkBtnLoading}
                    onCancel={this.handlePicCancelClick}
                >
                    <Row className="lw-top-col" type="flex" align="middle" justify="space-between">
                        <div></div>
                        <div>
                            <Button onClick={this.handleAddClickPic} icon="plus">
                                添加热销展示图
                            </Button>
                        </div>
                    </Row>
                    <Table
                        columns={this.columnsPic}
                        rowKey={record => record.bannerId || 0}
                        dataSource={this.state.tableDataPic}
                        loading={this.state.isPicTableDataLoading}
                        pagination={{
                            current: this.state.currentPagePic,
                            pageSize: this.state.curPageSizePic,
                            total: this.state.tableDataTotalPic,
                        }}
                        onChange={this.handlePicTableChange}
                    />
                    <Modal
                        title={this.state.editFormTitlePic}
                        visible={this.state.isShowEditDialogPic}
                        onOk={this.handleEditOkClickPic}
                        okText={appConfig.modalOkBtnText}
                        maskClosable={false}
                        confirmLoading={this.state.isEditOkBtnLoadingPic}
                        onCancel={this.handleEditCancelClickPic}
                    >
                        <Form onSubmit={this.handleEditOkClickPic}>
                            <FormItem
                                {...formItemLayout}
                                label="展示图"
                            >
                                <UploadImgs
                                    defaultFileList={this.state.defaultFileList}
                                    handleEnhanceSingleUploadChange={this.handleEnhanceSingleUploadChange}
                                />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="跳转路径"
                            >
                                <Input placeholder="请输入跳转路径" 
                                value={this.state.redirectUrl}
                                onChange={this.onChangePic}/>
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="优先级"
                            >
                                <InputNumber min={1} max={10}
                                value={this.state.priorityPic}
                                onChange={this.onChangePicNum}/>
                                ( 0 ~ 10 )
                            </FormItem>

                        </Form>
                    </Modal>
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

}

const WrappedSaleSort1 = Form.create()(SaleSort1);

export default setDisplayName('SaleSort1')(WrappedSaleSort1);

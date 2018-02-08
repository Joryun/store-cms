import React, { Component } from 'react';
import _compose from 'recompact/compose';
import { setDisplayName } from 'recompact';
import moment from 'moment';
import {
    Form, Button, Input, Select,
    Table,
    Icon,
    Row,
    Popconfirm, Modal,InputNumber
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import HocBdKeywords from './components/HocBdKeywords.js';
import HocHdKeywords from './components/HocHdKeywords.js';
import HocFtKeywords from './components/HocFtKeywords.js';

import * as appConfig from 'configs/appConfig.js';
import * as statusConfig from 'configs/statusConfig.js';

const enhance = _compose(
    HocBdKeywords,
    HocHdKeywords,
    HocFtKeywords,
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
class Keywords  extends Component {
    constructor(props) {
        super(props);

        this.editFormFlag = 'add'; /* 信息框的标记，add--添加，update--更新 */
        this.tableCurIndex = -1;

        this.columns = [
            {
                title: '热搜词语',
                className: 'ant-tableThead',
                dataIndex: 'keywordsInfo'
            },
            {
                title: '热搜等级',
                className: 'ant-tableThead',
                dataIndex: 'priority'
            },
            {
                title: '创建时间',
                className: 'ant-tableThead',
                dataIndex: 'createTime',
                render: (createTime)=>{
                    return (
                        <span>{moment(createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                    )
                }
            },
            {
                title: '跟新时间',
                className: 'ant-tableThead',
                dataIndex: 'updateTime',
                render: (updateTime)=>{
                    return (
                        <span>{moment(updateTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                    )
                }
            },
            {
                title: '操作',
                className: 'ant-tableThead',
                key: 'action',
                width: 200,
                render: (text, record, index) => {
                    let { keywordsId = -1 } = record;
                    
                    return (
                        <span>
                            <Button loading={this.state.isRowEditBtnLoadings[index]} onClick={() => this.handleRowEditClick(index, record)}>信息编辑</Button>
                            <span className="ant-divider" />
                            <Popconfirm title="确定要删除吗？" placement="topRight" onConfirm={() => this.handleRowDeleteClick(keywordsId, index)}>
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
        keywordsInfo: '',
        priority: '',
        keywordsId: 0,

        isShowEditDialog: false,
        isEditOkBtnLoading: false,
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Row className="lw-top-col" type="flex" align="middle" justify="space-between">
                    <div></div>
                    <Button onClick={this.handleAddClick} icon="plus">
                        添加热搜词
                    </Button>
                </Row>

                <Table
                    columns={this.columns}
                    rowKey={record => record.keywordsId || 0}
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
                            label="热搜词语"
                        >
                            {
                                getFieldDecorator('keywordsInfo', {
                                    rules: customRules,
                                    initialValue: this.state.keywordsInfo
                                })(
                                    <Input placeholder="请输入热搜词"/>
                                )
                            }
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="选择等级"
                        >
                            {
                                getFieldDecorator('priority', {
                                    rules: customRules,
                                    initialValue: this.state.priority
                                })(
                                    <InputNumber min={1} />
                                )
                            }
                        </FormItem>

                    </Form>
                </Modal>
            </div>
        );
    }

    changeRowLoading = (stateName, index, value) => {
        let state = this.state[stateName];

        state[index] = value;

        this.setState({ state });
    }

}

const WrappedKeywords = Form.create()(Keywords);

export default setDisplayName('Keywords')(WrappedKeywords);

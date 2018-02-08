import React, { Component } from 'react';
import _compose from 'recompact/compose';
import { setDisplayName } from 'recompact';

import {
    Form, Button, Input,
    Table,
    Icon,
    Row,
    Popconfirm, Modal,
} from 'antd';
const FormItem = Form.Item;

import HocBdTemplate3 from './components/HocBdTemplate3.js';
// TODO: 第二写HdTemplate3
import HocHdTemplate3 from './components/HocHdTemplate3.js';
// TODO: 第三写FtTemplate3
import HocFtTemplate3 from './components/HocFtTemplate3.js';

import * as appConfig from 'configs/appConfig.js';

const enhance = _compose(
    HocBdTemplate3,
    // TODO: 第二写HdTemplate3
    HocHdTemplate3,
    // TODO: 第三写FtTemplate3
    HocFtTemplate3,
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
class Template3 extends Component {
    constructor(props) {
        super(props);

        this.editFormFlag = 'add'; /* 信息框的标记，add--添加，update--更新 */
        this.tableCurIndex = -1;

        this.columns = [
            // TODO: 添加、修改列
            {
                title: '比赛名称',
                dataIndex: 'name'
            },
            {
                title: '比赛开始时间',
                dataIndex: 'playStartTime',
            },
            {
                title: '操作',
                key: 'action',
                width: 200,
                render: (text, record, index) => {
                    let { id = -1 } = record;
                    
                    return (
                        <span>
                            <Button loading={this.state.isRowEditBtnLoadings[index]} onClick={() => this.handleRowEditClick(index, record)}>信息编辑</Button>
                            <span className="ant-divider" />
                            <Popconfirm title="确定要删除吗？" placement="topRight" onConfirm={() => this.handleRowDeleteClick(id, index)}>
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
        // TODO: 增删改HdTemplate3的state
        searchName: '',

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
        // TODO: edit form的属性，如无，可删掉
        name: '',
        playStartTime: '',
        raiseDelay: 0,
        repurchaseGoldBean: 0,
        repurchaseRecordPoker: 0,

        // TODO: 增删改FtTemplate3的state
        editFormTitle: '',
        
        isShowEditDialog: false,
        isEditOkBtnLoading: false,
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Row className="lw-top-col" type="flex" align="middle" justify="space-between">
                    <Form layout="inline" onSubmit={this.handleSearchSubmit}>
                        {/* TODO: 修改、FormItem的name和defaultValue */}
                        <FormItem label="管理员名字">
                            <Input
                                name="searchName"
                                placeholder="请输入管理员名字"
                                defaultValue={this.state.searchName}
                                onChange={this.handleInputChange}
                            />
                        </FormItem>
        
                        {/* TODO: 需要添加FormItem？ */}
        
                        <FormItem>
                            <Button type="primary" loading={this.state.isTableDataLoading} htmlType="submit">查询</Button>
                        </FormItem>
                    </Form>
        
                    {/* // TODO: 有增加操作？ */}
                    <Button onClick={this.handleAddClick} icon="plus">新增比赛场</Button>
                </Row>

                <Table
                    columns={this.columns}
                    /* TODO: 修改rowKey record.id */
                    rowKey={record => record.id || 0}
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
                            label="管理员账号"
                        >
                            {
                                /* TODO: 修改、FormItem的getFieldDecorator的第一个参数以及 */
                                /* TODO: 修改initialValue */
                                getFieldDecorator('name', {
                                    rules: customRules,
                                    initialValue: this.state.name
                                })(
                                    /* TODO: 修改React Dom */
                                    <Input placeholder="请输入管理员账号"/>
                                )
                            }
                        </FormItem>
        
                        {/* TODO: 需要添加FormItem？ */}
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
}

// TODO: 若没有footer，没有需要编辑的form，就不要这个
const WrappedTemplate3 = Form.create()(Template3);

// TODO: WrappedTemplate3，请将WrappedTemplate3换成Template3
export default setDisplayName('Template3')(WrappedTemplate3);

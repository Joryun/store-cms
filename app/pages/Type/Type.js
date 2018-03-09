import React, { Component } from 'react';
import _compose from 'recompact/compose';
import { setDisplayName } from 'recompact';
import API from '../../utils/api.js';
import UploadImgs from '../../components/UploadImgs.js';
import callAxios from '../../utils/callAxios';

import {
    Form, Button, Input, Select, InputNumber,
    Table,
    Icon,
    Row,
    Popconfirm, Modal,
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import HocBdType from './components/HocBdType.js';
import HocHdType from './components/HocHdType.js';
import HocFtType from './components/HocFtType.js';

import * as appConfig from 'configs/appConfig.js';
import * as statusConfig from 'configs/statusConfig.js';

const enhance = _compose(
    HocBdType,
    HocHdType,
    HocFtType,
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
class Type extends Component {
    constructor(props) {
        super(props);

        this.editFormFlag = 'add'; /* 信息框的标记，add--添加，update--更新 */
        this.tableCurIndex = -1;

        this.columns = [
            {
                title: '商品分类',
                className: 'ant-tableThead',
                dataIndex: 'name'
            },
            {
                title: '分类封面',
                className: 'ant-tableThead',
                dataIndex: 'secondCategoryUrl',
                width: 200,
                render: (imageUrl) => (
                    <img style={{ width: '200px', }} src={imageUrl} />
                ),
            },
            {
                title: '优先级',
                className: 'ant-tableThead',
                dataIndex: 'priority',
            },
            {
                title: '商品计数',
                className: 'ant-tableThead',
                dataIndex: 'count',
                render: (count) => {
                    if (count == null || count == '') {
                        return <span>无</span>
                    } else {
                        return <span>{count}</span>
                    }
                }
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
                            <Popconfirm title="确定要删除吗？" placement="topRight" onConfirm={() => this.handleRowDeleteClick(record, index)}>
                                <Button type="danger" disabled>删除</Button>
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
        DataList: [],
        defaultFileList: [],
        currentPage: 1, /* 当前页数 */
        curPageSize: 0, /* 当前页面的条数 */
        pageSize: appConfig.pageableSize, /* 每页条数 */
        tableDataTotal: 0, /* 数据总数 */
        isTableDataLoading: false,
        isRowEditBtnLoadings: {},

        /* footer's state */
        id: -1,
        priority: '',
        imageUrl: '',


        // remarks: '',
        handleEditOkClick: '',
        name: '',

        editFormTitle: '',

        isShowEditDialog: false,
        isEditOkBtnLoading: false,

        /* Search */
        isdisabled: false,

        categoryNum: null

    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Row className="lw-top-col" type="flex" align="middle" justify="space-between">
                    <div className="lw-list-div">
                        <div className="lw-list-div-li">
                            <label>主分类选择：</label>
                            <Select
                                showSearch
                                allowClear
                                labelInValue
                                optionFilterProp="children"
                                placeholder="手机/运营商/数码"
                                disabled={this.state.isdisabled}
                                style={{ width: 150 }}
                                onChange={this.handleSelectChange}
                            >
                                {this.state.DataList}
                            </Select>
                        </div>
                        <Button onClick={this.handleAddClick} icon="plus" style={{ float: 'right' }}>
                            添加次级分类
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
                            label="次级分类"
                        >
                            {
                                getFieldDecorator('name', {
                                    rules: customRules,
                                    initialValue: this.state.name
                                })(
                                    <Input placeholder="请输入次级分类" />
                                    )
                            }
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="分类封面"
                        >
                            {
                                getFieldDecorator('secondCategoryUrl', {
                                    rules: customRules,
                                    initialValue: this.state.imageUrl
                                })(
                                    <UploadImgs
                                        defaultFileList={this.state.defaultFileList}
                                        handleEnhanceSingleUploadChange={this.handleEnhanceSingleUploadChange}
                                    />
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
                                    <InputNumber min={1} />
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

    handleSelectChange = (key) => {
        let keyNum = 0;
        if (key == undefined) {
            keyNum = null;
        } else {
            keyNum = key.key;
        }
        this.setState({
            categoryNum: keyNum,
        }, () => {
            this.fetchTableData();
        });
    }

    CategoryList = () => {
        callAxios({
            that: this,
            method: 'get',
            url: `${API.category}`,
        })
            .then((res) => {
                let dataList = [],
                    {
                data = null
            } = res;
                for (let i = 0; i < data.length; i++) {
                    dataList.push(<Option key={data[i].id} >{data[i].name}</Option>);
                }
                this.setState({
                    DataList: dataList,
                    typeList: res.data
                }, () => {
                    this.setState({
                        isdisabled: false,
                    })
                })
            })
    }
}

const WrappedType = Form.create()(Type);

export default setDisplayName('Type')(WrappedType);

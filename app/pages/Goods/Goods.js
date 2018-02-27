import React, { Component } from 'react';
import _compose from 'recompact/compose';
import { setDisplayName } from 'recompact';
import callAxios from '../../utils/callAxios';
import API from '../../utils/api.js';
import * as utils from '../../utils/utils.js';
import UploadImgs from '../../components/UploadImgs.js';
import Editor from '../../components/Editor.js';

import {
    Form, Button, Input, Select, InputNumber,
    Table,
    Icon,
    Row,
    Popconfirm,
    Modal,
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import HocBdGoods from './components/HocBdGoods.js';
import HocHdGoods from './components/HocHdGoods.js';
import HocFtGoods from './components/HocFtGoods.js';

import * as appConfig from 'configs/appConfig.js';
import * as statusConfig from 'configs/statusConfig.js';

const enhance = _compose(
    HocBdGoods,
    HocHdGoods,
    HocFtGoods,
);

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 }
};

const customRules = [{
    required: true,
    message: '必填',
}];

@enhance
class Goods extends Component {
    constructor(props) {
        super(props);

        this.editFormFlag = 'add'; /* 信息框的标记，add--添加，update--更新 */
        this.tableCurIndex = -1;

        this.columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                className: 'ant-tableThead',
                fixed: 'left',
                width: 50
            },
            {
                title: '商品名字',
                dataIndex: 'productTitle',
                className: 'ant-tableThead',
                fixed: 'left',
                width: 150
            },
            {
                title: '商品类别',
                dataIndex: 'secondCategoryId',
                className: 'ant-tableThead',
                fixed: 'left',
                width: 100,
                render: (secondCategoryId) => {
                    let num,
                        tostring,
                        soDataList = this.state.DataList;
                    tostring = secondCategoryId.toString()
                    soDataList.forEach(function (element, index) {
                        if (element.key == tostring) {
                            num = element.props.children
                        }
                    }, this);
                    return (
                        <span>{num}</span>
                    )
                }
            },
            {
                title: '列表价',
                className: 'ant-tableThead',
                dataIndex: 'listPrice',
                fixed: 'left',
                width: 60,
                render: statusConfig.Appmoney
            },
            {
                title: '原价',
                className: 'ant-tableThead',
                dataIndex: 'originalPrice',
                width: 60,
                render: statusConfig.Appmoney
            },
            {
                title: '产品主图',
                dataIndex: 'path',
                width: 80,
                className: 'ant-tableThead',
                render: (path) => {
                    return (
                        <img src={path} style={{ width: '50px', height: '35px' }} />
                    )
                }
            },
            {
                title: '产品图',
                dataIndex: 'goodsPictures',
                width: 320,
                className: 'ant-tableThead',
                render: (goodsPictures, goods) => (
                    goodsPictures.map((element, index) =>
                        <img key={index} style={{ width: '50px', height: '35px', margin: '0 5px' }}
                            src={goodsPictures[index]}
                        />
                    )
                ),
            },
            {
                title: '创建时间',
                className: 'ant-tableThead',
                dataIndex: 'createTime',
                // width: 90,
                render: (text, _, __) => <span>{utils.momentFormat(text)}</span>
            },
            // {
            //     title: '等级',
            //     className: 'ant-tableThead',
            //     dataIndex: 'goods.level',
            //     // width: 70
            // },
            // {
            //     title: '产地',
            //     className: 'ant-tableThead',
            //     dataIndex: 'goods.place',
            //     // width: 70
            // },
            // {
            //     title: '规格',
            //     className: 'ant-tableThead',
            //     dataIndex: 'goods.standard',
            //     // width: 70
            // },
            // {
            //     title: '储存方式',
            //     className: 'ant-tableThead',
            //     dataIndex: 'goods.storageMethod',
            //     // width: 70
            // },
            // {
            //     title: '温馨提示',
            //     className: 'ant-tableThead',
            //     dataIndex: 'goods.tips',
            //     // width: 100
            // },
            {
                title: '销量',
                className: 'ant-tableThead',
                dataIndex: 'salesNum',
                fixed: 'right',
                width: 80
            },
            {
                title: '展示状态',
                className: 'ant-tableThead',
                dataIndex: 'saleType',
                fixed: 'right',
                width: 50
            },
            {
                title: '操作',
                className: 'ant-tableThead',
                key: 'action',
                width: 270,
                fixed: 'right',
                render: (text, record, index) => {
                    let { id = -1 } = record;
                    return (
                        <span>
                            <Button
                                type={record.saleType == "OFF" ? '' : 'danger'}
                                loading={this.state.isRowChangeFlagBtnLoadings[index]}
                                onClick={() => this.handleRowUpClick(index, record)}
                            >
                                {record.saleType == "OFF" ? '上架' : '下架'}
                            </Button>

                            <span className="ant-divider" />
                            <Button loading={this.state.isRowEditBtnLoadings[index]} onClick={() => this.handleRowEditClick(index, record)}>信息编辑</Button>
                            <span className="ant-divider" />
                            <Popconfirm title="确定要删除吗？" placement="topRight" onConfirm={() => this.handleRowDeleteClick(record, index)}>
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
        DataList: [],
        typeList: [],
        pathDefaultFileList: [],
        goodsPicturesDefaultFileList: [],
        currentPage: 1, /* 当前页数 */
        curPageSize: 0, /* 当前页面的条数 */
        pageSize: appConfig.pageableSize, /* 每页条数 */
        tableDataTotal: 0, /* 数据总数 */
        isTableDataLoading: false,
        isRowChangeFlagBtnLoadings: {},
        isRowEditBtnLoadings: {},

        /* footer's state */
        id: -1,
        goodsId: -1,
        path: '',
        name: '',
        price: 0,
        cattyEach: 0,
        pricePerCatty: 0,
        goodsPictures: '',
        remark: '',

        /* Search */
        searchName: null,
        searchSelect: null,
        editFormTitle: '',
        editFormFlag: '',

        districtNum: null,
        isdisabled: false,
        buttonDisabled: true,
        isShowEditDialog: false,
        isEditOkBtnLoading: false,

        //说明弹窗
        level: '',
        place: '',
        standard: '',
        tips: '',
        storageMethod: '',

        // 额外弹窗
        getTitle: '',
        isShowDialog: false,
        isShowDialogOne: false,
        goodsTypeId: 0,
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Row className="lw-top-col" type="flex" align="middle" justify="space-between">
                    <div className="lw-list-div">
                        <div className="lw-list-div-li">
                            <label>分类选择：</label>
                            <Select
                                showSearch
                                allowClear
                                labelInValue
                                optionFilterProp="children"
                                placeholder="选择分类"
                                disabled={this.state.isdisabled}
                                style={{ width: 150 }}
                                onChange={this.handleSelectChange}
                            >
                                {this.state.DataList}
                            </Select>
                        </div>
                        <div className="lw-list-div-li">
                            <label>商品名称：</label>
                            <Input
                                placeholder="请输入商品名字"
                                onChange={this.onchangeSearchName}
                                style={{ width: 150 }}
                            >
                            </Input>
                        </div>
                        <div className="lw-list-div-li">
                            <label>销售状态：</label>
                            <Select
                                showSearch
                                allowClear
                                placeholder="选择状态"
                                style={{ width: 100 }}
                                onChange={this.onchangeSelect}
                            >
                                {
                                    statusConfig.saleType.map((item, index) => {
                                        return (
                                            <Option key={index} value={`${item}`}>{item}</Option>
                                        );
                                    })
                                }
                            </Select>
                        </div>
                        <Button onClick={this.handleAddClick}
                            icon="plus" style={{ float: 'right' }}
                        >
                            添加商品
                        </Button>
                    </div>
                </Row>

                <Table
                    columns={this.columns}
                    // scroll={{ x: '200%' }}
                    size="middle"
                    rowKey={record => record.id || 0}
                    dataSource={this.state.tableData}
                    bordered
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
                            label="商品名字"
                        >
                            {
                                getFieldDecorator('name', {
                                    rules: customRules,
                                    initialValue: this.state.name
                                })(
                                    <Input placeholder="请输入商品名字" />
                                    )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="种类选择"
                        >
                            {
                                getFieldDecorator('a', {
                                    rules: customRules,
                                    initialValue: this.state.goodsTypeId
                                })(
                                    <Select
                                        showSearch
                                        labelInValue
                                        optionFilterProp="children"
                                        placeholder="选择分类"
                                        style={{ width: 200 }}
                                        onChange={this.onchangeEditSecect}
                                    >
                                        {this.state.DataList}
                                    </Select>
                                    )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="封面"
                        >
                            {
                                getFieldDecorator('path', {
                                    rules: customRules,
                                    initialValue: this.state.path
                                })(
                                    <UploadImgs
                                        defaultFileList={this.state.pathDefaultFileList}
                                        handleEnhanceSingleUploadChange={this.handleEnhanceSingleUploadChange}
                                    />
                                    )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="商品图"
                        >
                            {
                                getFieldDecorator('goodsPictures', {
                                    rules: customRules,
                                    initialValue: this.state.goodsPictures
                                })(
                                    <UploadImgs
                                        limit={5}
                                        defaultFileList={this.state.goodsPicturesDefaultFileList}
                                        handleUploadChange={this.handleGoodsPicturesUploadChange}
                                    />
                                    )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="每份价格"
                        >
                            {
                                getFieldDecorator('price', {
                                    rules: customRules,
                                    initialValue: this.state.price
                                })(
                                    <InputNumber min={0} precision={2} />
                                    )
                            }元
                        </FormItem>
                        <hr style={{ marginBottom: '15px' }} />
                        <FormItem
                            {...formItemLayout}
                            label="每斤价格"
                        >
                            {
                                getFieldDecorator('pricePerCatty', {
                                    rules: customRules,
                                    initialValue: this.state.pricePerCatty
                                })(
                                    <InputNumber min={0} precision={2} />
                                    )
                            }元
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="每份几斤"
                        >
                            {
                                getFieldDecorator('cattyEach', {
                                    rules: customRules,
                                    initialValue: this.state.cattyEach
                                })(
                                    <InputNumber min={0} />
                                    )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="计价方式"
                        >
                            {
                                getFieldDecorator('remark', {
                                    rules: customRules,
                                    initialValue: this.state.remark
                                })(
                                    <Input placeholder="添加计价方式（每份多少斤，每斤多少钱）" />
                                    )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="产品说明"
                        >
                            <Button
                                onClick={this.handleEditOne}
                            >点击编辑</Button>

                        </FormItem>
                        {/*  */}
                        <FormItem
                            {...formItemLayout}
                            label="详细说明"
                        >
                            <Button
                                onClick={this.handleEdit}
                            >点击编辑</Button>

                        </FormItem>
                    </Form>
                </Modal>

                {/* 产品说明弹窗 */}
                <Modal
                    title="编辑详情"
                    visible={this.state.isShowDialogOne}
                    onOk={this.handleOkOne}
                    onCancel={this.handleCancelOne}
                >
                    <div className='lw-div'>
                        <label>等级：</label>
                        <Input
                            id='level'
                            value={this.state.level}
                            placeholder="请输入商品的等级"
                            onChange={this.onchangeOne}
                            style={{ width: 150 }}
                        >
                        </Input>
                    </div>
                    <div className='lw-div'>
                        <label>产地：</label>
                        <Input
                            id='place'
                            value={this.state.place}
                            placeholder="请输入商品的产地"
                            onChange={this.onchangeOne}
                            style={{ width: 150 }}
                        >
                        </Input>
                    </div>
                    <div className='lw-div'>
                        <label>规格：</label>
                        <Input
                            id='standard'
                            value={this.state.standard}
                            placeholder="请输入商品规格"
                            onChange={this.onchangeOne}
                            style={{ width: 200 }}
                        >
                        </Input>
                    </div>
                    <div className='lw-div'>
                        <label>储存方式：</label>
                        <Input
                            id='storageMethod'
                            value={this.state.storageMethod}
                            placeholder="请输入商品规格"
                            onChange={this.onchangeOne}
                            style={{ width: 200 }}
                        >
                        </Input>
                    </div>
                    <div className='lw-div'>
                        <label>温馨提示：</label>
                        <Input
                            id='tips'
                            value={this.state.tips}
                            placeholder="请输入商品规格（20字以内）"
                            onChange={this.onchangeOne}
                            style={{ width: 300 }}
                        >
                        </Input>
                    </div>

                </Modal>

                {/* 追加弹窗 */}
                <Modal
                    title="编辑详情"
                    visible={this.state.isShowDialog}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Editor
                        handleEditorChange={(html) => { this.handleEditorChange(html) }}
                        content={this.state.getTitle}
                    />
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

    DistrictList = () => {
        callAxios({
            that: this,
            method: 'get',
            url: `${API.goodsTypeList}`,
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

    handleEnhanceSingleUploadChange = (imgUrl) => {
        this.props.form.setFieldsValue({ path: imgUrl });
    }

    handleGoodsPicturesUploadChange = (doneFileList) => {
        let temp = [],
            imgUrl = '';
        doneFileList.forEach((item, index) => {
            imgUrl = (item.response && item.response.key) || '';
            if (imgUrl !== '') {
                temp.push(`${appConfig.qiniuDomain}/${imgUrl}`);
            } else {
                temp.push(item.url);
            }
        });

        this.props.form.setFieldsValue({ goodsPictures: temp });
    }

    handleSelectChange = (key) => {
        let keyNum = 0;
        if (key == undefined) {
            keyNum = null;
        } else {
            keyNum = key.key;
        }
        this.setState({
            districtNum: keyNum,
        }, () => {
            this.fetchTableData();
        });
    }

    onchangeSearchName = (value) => {
        this.setState({
            searchName: value.target.value
        }, () => {
            this.fetchTableData();
        })
    }

    onchangeSelect = (value) => {
        if (value == '全部') {
            value = null;
        }
        this.setState({
            searchSelect: value
        }, () => {
            this.fetchTableData();
        })
    }

}

const WrappedGoods = Form.create()(Goods);

export default setDisplayName('Goods')(WrappedGoods);

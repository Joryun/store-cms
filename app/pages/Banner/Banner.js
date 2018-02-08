import React, { Component } from 'react';
import _compose from 'recompact/compose';
import { setDisplayName } from 'recompact';
import callAxios from '../../utils/callAxios';
import API from '../../utils/api.js';
import UploadImgs from '../../components/UploadImgs.js';

import {
    Form, Button, Input, Select,InputNumber,
    Table,
    Icon,
    Row,
    Popconfirm, 
    Modal,
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import HocBdBanner from './components/HocBdBanner.js';
import HocHdBanner from './components/HocHdBanner.js';
import HocFtBanner from './components/HocFtBanner.js';

import * as appConfig from 'configs/appConfig.js';
import * as statusConfig from 'configs/statusConfig.js';

const enhance = _compose(
    HocBdBanner,
    HocHdBanner,
    HocFtBanner,
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
class Banner  extends Component {
    constructor(props) {
        super(props);

        this.editFormFlag = 'add'; /* 信息框的标记，add--添加，update--更新 */
        this.tableCurIndex = -1;

        this.columns = [
            {
                title: '小区',
                className: 'ant-tableThead',
                dataIndex: 'districtName',
                render: (districtName)=>{
                    if(districtName == null){
                        return <span>默认图片</span>
                    }else{
                        return <span>{districtName}</span>
                    }
                }
            },
            {
                title: '封面图',
                className: 'ant-tableThead',
                dataIndex: 'bannerUrl',
                width:250,
                render: (bannerUrl) => (
                <img style={{width:'200px',}} src={bannerUrl}/>
                ),
            },
            {
                title: '跳转路径',
                className: 'ant-tableThead',
                dataIndex: 'redirectUrl'
            },
            {
                title: '优先级',
                className: 'ant-tableThead',
                dataIndex: 'priority'
            },
            {
                title: '操作',
                className: 'ant-tableThead',
                key: 'action',
                width: 200,
                render: (text, record, index) => {
                        let Num = this.state.picNum
                    return (
                        <span>
                            <Button disabled={Num} loading={this.state.isRowEditBtnLoadings[index]} onClick={() => this.handleRowEditClick(index, record)}>信息编辑</Button>
                            <span className="ant-divider" />
                            <Popconfirm title="确定要删除吗？" placement="topRight" onConfirm={() => this.handleRowDeleteClick(record, index)}>
                                <Button disabled={Num} type="danger">删除</Button>
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
        "Id": -1,
        bannerUrl: '',
        redirectUrl: '',
        priority: '',
        districtId: '',
        bannerId: '',
        districtNum: '',

        editFormTitle: '',
        ftState: false,
        picNum: false,
        isdisabled: true,
        buttonDisabled:false,
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
                    <div>
                    <label>小区选择：</label>
                    <Select
                        showSearch
                        allowClear
                        labelInValue
                        optionFilterProp="children"
                        placeholder="选择小区"
                        disabled = {this.state.isdisabled}
                        style={{ width: 200 }}
                        onChange = {this.handleSelectChange }
                    >
                    {this.state.DataList}
                    </Select>
                    </div>
                    <Button onClick={this.handleAddClick} icon="plus" disabled={this.state.buttonDisabled}>
                        添加封面
                    </Button>
                </Row>

                <Table
                    columns={this.columns}
                    rowKey={record => record.bannerId || 0}
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
                            label="封面"
                        >
                            {
                                getFieldDecorator('bannerUrl', {
                                    rules: customRules,
                                    initialValue: this.state.bannerUrl
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
                                    <InputNumber placeholder="优先级" min={1}/>
                                )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="跳转路径"
                        >
                            {
                                getFieldDecorator('redirectUrl', {
                                    initialValue: this.state.redirectUrl
                                })(
                                    <Input placeholder="跳转路径"/>
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

    DistrictList = () => {
        callAxios({
            that: this,
            method: 'get',
            url : `${API.DistrciGetList}`,
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
                DataList : dataList,
            },()=>{
                console.log('加载完成')
                this.setState({
                    isdisabled : false,
                })
            })
        })
    }

    handleSelectChange = (key) => {
        if(!key) {
            this.fetchTableData()
        } else {
            let keyNun = key.key;
            this.state.picNum = false,
            this.setState({ 
                ftState: true,
                districtNum : key,
                isTableDataLoading: true, 
                buttonDisabled:false,
            });
            callAxios({
                that: this,
                method: 'get',
                url: `${API.findBanner}?districtId=${keyNun}`,
            })
            .then((response) => {
                let {
                    content = [],
                } = response.data;
                this.setState({
                    tableData: content,
                    districtId: keyNun,
                });
            })
            .finally(() => {
                this.setState({ isTableDataLoading: false, });
            });

        }
       
    }

}

const WrappedBanner = Form.create()(Banner);

export default setDisplayName('Banner')(WrappedBanner);

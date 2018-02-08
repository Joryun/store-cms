import React, { Component } from 'react';
import _compose from 'recompact/compose';
import { setDisplayName } from 'recompact';

import {
    Form, Button, Input, Select,Cascader,
    Table,
    Icon,
    Row,
    Popconfirm, Modal,
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import HocBdWarehouse from './components/HocBdWarehouse.js';
import HocHdWarehouse from './components/HocHdWarehouse.js';
import HocFtWarehouse from './components/HocFtWarehouse.js';

import * as appConfig from 'configs/appConfig.js';
import * as statusConfig from 'configs/statusConfig.js';
import amendArea from 'utils/area.js';
import * as utils from '../../utils/utils.js';

const enhance = _compose(
    HocBdWarehouse,
    HocHdWarehouse,
    HocFtWarehouse,
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
class Warehouse  extends Component {
    constructor(props) {
        super(props);

        this.editFormFlag = 'add'; /* 信息框的标记，add--添加，update--更新 */
        this.tableCurIndex = -1;

        this.columns = [
            {
                title: '仓库名字',
                className: 'ant-tableThead',
                dataIndex: 'warehouseName'
            },
            {
                title: '省份',
                className: 'ant-tableThead',
                dataIndex: 'province',
                render:(province)=>{
                    let areaLabels = utils.getAreaLabels(amendArea , {
                        province:province
                    });
                    return (
                        <span>{`${areaLabels.province}`}</span>
                    );
                }
            },
            {
                title: '城市',
                className: 'ant-tableThead',
                dataIndex: 'city',
                render:(city)=>{
                    let areaLabels = utils.getAreaLabels(amendArea , {
                        city:city
                    });
                    return (
                        <span>{`${areaLabels.city}`}</span>
                    );
                }
            },
            {
                title: '详细地址',
                className: 'ant-tableThead',
                dataIndex: 'warehouseAddress',
            },
            {
                title: '创建时间',
                className: 'ant-tableThead',
                dataIndex: 'createTime',
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
        searchName: '',
        searchPro: '',
        searchCity: '',

        /* body's state */
        tableData: [],
        DataList: [],
        currentPage: 1, /* 当前页数 */
        curPageSize: 0, /* 当前页面的条数 */
        pageSize: appConfig.pageableSize, /* 每页条数 */
        tableDataTotal: 0, /* 数据总数 */
        isTableDataLoading: false,
        isRowEditBtnLoadings: {},

        /* footer's state */
        id : '',
        warehouseName: '',
        provinceCity: '',
        warehouseAddress: '',

        editFormTitle: '',
        
        isShowEditDialog: false,
        isEditOkBtnLoading: false,
        isdisabled: false,

        districtCount:0,
        orderCount:0,
        warehouseManagerCount:0,
        isShowError:false,
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Row className="lw-top-col" type="flex" align="middle" justify="space-between">
                    <div className="lw-list-div">
                        <div className="lw-list-div-li">
                            <label>地区选择：</label>
                            <Cascader options={amendArea} placeholder="请选择地区" onChange={this.onChangeCascader}/>
                        </div>
                        <div className="lw-list-div-li">
                            <label>仓库名称：</label>
                            <Input
                            name="searchName"
                            placeholder= "请输入商品名字"
                            defaultValue={this.state.searchName}
                            onChange= {this.onchangeSearchName}
                            style={{width: 150}}
                            >
                            </Input>
                        </div>
                        <Button onClick={this.handleAddClick} icon="plus" style={{float:'right'}}>
                            添加仓库
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
                            label="仓库名称"
                        >
                            {
                                getFieldDecorator('warehouseName', {
                                    rules: customRules,
                                    initialValue: this.state.warehouseName
                                })(
                                    <Input placeholder="请输入仓库名称"/>
                                )
                            }
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="省市选择："
                        >
                            {
                                getFieldDecorator('provinceCity', {
                                    rules: customRules,
                                    initialValue: this.state.provinceCity
                                })(
                                    <Cascader options={amendArea} placeholder="请选择地区" />
                                )
                            }
                        </FormItem>


                        <FormItem
                            {...formItemLayout}
                            label="详细地址"
                        >
                            {
                                getFieldDecorator('warehouseAddress', {
                                    rules: customRules,
                                    initialValue: this.state.warehouseAddress
                                })(
                                    <Input 
                                    style={{width:'400px'}}
                                    placeholder="请输入仓库详细地址"/>
                                )
                            }
                        </FormItem>
                    </Form>
                </Modal>

                <Modal
                title="删除失败"
                visible={this.state.isShowError}
                onOk={this.onchangeError}
                onCancel={this.onchangeError}
                okText="确认"
                cancelText="取消"
                >
                    <h2>请检查以下参数：</h2>
                    <h3><div style={{padding:'0,15',width:150,textAlign:'right',float:'left'}}>该仓库的 小区数为： </div> <span> {this.state.districtCount} 个</span></h3>
                    <h3><div style={{padding:'0,15',width:150,textAlign:'right',float:'left'}}>该仓库的 订单数为： </div><span> {this.state.orderCount} 条</span></h3>
                    <h3><div style={{padding:'0,15',width:150,textAlign:'right',float:'left'}}>该仓库的 仓管数为： </div><span> {this.state.warehouseManagerCount} 位</span></h3>
                    <h3>修改方案: 请先迁移小区的仓库，并处理完订单数，即可删除该仓库</h3>
                    <h3>后续方案: 请删除仓库之后，重新设置仓管</h3>
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

    onchangeSearchName = (value) => {
        this.setState({
            searchName : value.target.value
        },()=>{
            this.fetchTableData();
        })
    }

    onChangeCascader = (value) => {
        if(value == ''){
            this.setState({
                searchPro: '',
                searchCity: ''
            },()=>{
                this.fetchTableData(1)
            })
        }else{
            this.setState({
                searchPro: value[0],
                searchCity: value[1]
            },()=>{
                this.fetchTableData(1)
            })
        }
    }


}

const WrappedWarehouse = Form.create()(Warehouse);

export default setDisplayName('Warehouse')(WrappedWarehouse);

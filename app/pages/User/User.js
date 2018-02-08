import React, { Component } from 'react';
import _compose from 'recompact/compose';
import { setDisplayName } from 'recompact';

import {
    Form, Button, Input, Switch,
    Table,
    Row,
} from 'antd';
const FormItem = Form.Item;

import HocBdUser from './components/HocBdUser.js';
import HocHdUser from './components/HocHdUser.js';

import * as appConfig from 'configs/appConfig.js';
import * as statusConfig from 'configs/statusConfig.js';

const enhance = _compose(
    HocBdUser,
    HocHdUser,
);

@enhance
class User extends Component {
    constructor(props) {
        super(props);

        this.editFormFlag = 'add'; /* 信息框的标记，add--添加，update--更新 */
        this.tableCurIndex = -1;

        this.columns = [
            {
                title: '微信昵称',
                dataIndex: 'nickname',
                className: 'ant-tableThead',
            },
            {
                title: '头像',
                dataIndex: 'headImage',
                className: 'ant-tableThead',
                render: (headImage) => (
                    <img width={50} src={headImage}/>
                ),
            },
            {
                title: '用户创建时间',
                dataIndex: 'createTime',
                className: 'ant-tableThead',
                render:statusConfig.AppstateTime,
            },
            {
                title: '角色类型',
                dataIndex: 'role',
                className: 'ant-tableThead',
                render: statusConfig.Role
            },
            {
                title: '最近登录时间',
                dataIndex: 'updateTime',
                className: 'ant-tableThead',
                render:statusConfig.AppstateTime,
            },
            {
                title: '注册手机号码',
                dataIndex: 'phone',
                className: 'ant-tableThead',
            },
            {
                title: '余额',
                dataIndex: 'balance',
                className: 'ant-tableThead',
                render: (balance)=>{
                    if(balance == null){
                        return <span>无</span>
                    }else{
                        return <span>{balance / 100} 元</span>
                    }
                }
            },
            {
                title: '状态',
                dataIndex: 'flag',
                className: 'ant-tableThead',
                render: (text, record, index) => <span>{ record.flag == "TRUE" ? '已禁用' : '已启用' }</span>
            },
            {
                title: '操作',
                key: 'action',
                className: 'ant-tableThead',
                width: 200,
                render: (text, record, index) => {
                    let { flag = -1 } = record;
                    
                    return (
                        <span>
                            <Button
                                type={flag == "TRUE" ? '' : 'danger'}
                                loading={this.state.isRowChangeFlagBtnLoadings[index]}
                                onClick={() => this.handleRowChangeFlagClick(index, record)}
                            >
                                { flag == "TRUE" ? '启用' : '禁用' }
                            </Button>
                        </span>
                    );
                },
            }
        ]
    }

    state = {
        /* head's state */
        searchNickname: '',
        searchMobilePhone: '',

        /* body's state */
        tableData: [],
        currentPage: 1, /* 当前页数 */
        pageSize: appConfig.pageableSize, /* 每页条数 */
        tableDataTotal: 0, /* 数据总数 */
        isTableDataLoading: false,
        isRowChangeFlagBtnLoadings: {},
    };

    render() {
        return (
            <div>
                <Row className="lw-top-col" type="flex" align="middle" justify="space-between">
                    <Form layout="inline" onSubmit={this.handleSearchSubmit}>
                        <FormItem label="注册手机">
                            <Input
                                name="searchMobilePhone"
                                placeholder="请输入注册手机"
                                defaultValue={this.state.searchMobilePhone}
                                onChange={this.handleInputChange}
                            />
                        </FormItem>
        
                        <FormItem>
                            <Button type="primary" loading={this.state.isTableDataLoading} htmlType="submit">查询</Button>
                        </FormItem>
                    </Form>
                </Row>

                <Table
                    columns={this.columns}
                    rowKey={record => record.userId || 0}
                    dataSource={this.state.tableData}
                    loading={this.state.isTableDataLoading}
                    pagination={{
                        current: this.state.currentPage,
                        pageSize: this.state.pageSize,
                        total: this.state.tableDataTotal,
                    }}
                    onChange={this.handleTableChange}
                />
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

export default setDisplayName('User')(User);

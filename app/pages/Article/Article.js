import React, { Component } from 'react';
import _compose from 'recompact/compose';
import { setDisplayName } from 'recompact';
import  moment  from 'moment';
import Editor from '../../components/Editor.js';
import UploadImgs from '../../components/UploadImgs.js';

import {
    Form, Button, Input, Select, Cascader, 
    Switch, Spin, DatePicker, InputNumber,
    Table,
    Icon,
    Row,
    Popconfirm, Modal
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import HocBdArticle from './components/HocBdArticle.js';
import HocHdArticle from './components/HocHdArticle.js';
import HocFtArticle from './components/HocFtArticle.js';

import * as appConfig from 'configs/appConfig.js';
import * as statusConfig from 'configs/statusConfig.js';
import amendArea from 'utils/area.js';

const { MonthPicker, RangePicker } = DatePicker;
const enhance = _compose(
    HocBdArticle,
    HocHdArticle,
    HocFtArticle,
);

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 }
};
const formItemLayout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 }
};
const { TextArea } = Input;
const customRules = [{
    required: true,
    message: '必填',
}];

@enhance
class Article  extends Component {
    constructor(props) {
        super(props);

        this.editFormFlag = 'add'; /* 信息框的标记，add--添加，update--更新 */
        this.tableCurIndex = -1;

        this.columns = [
            {
                title: '文章标题',
                className: 'ant-tableThead',
                dataIndex: 'title'
            }, 
            {
                title: '文章优先级',
                className: 'ant-tableThead',
                dataIndex: 'priority'
            },
            {
                title: '文章封面',
                className: 'ant-tableThead',
                dataIndex: 'page',
                render: (page)=>{
                    return <img style={{width:50}} src={page} />
                }
            },
            {
                title: '文章链接',
                className: 'ant-tableThead',
                dataIndex: 'articleUrl',
            },
            // {
            //     title: '文章导语',
            //     className: 'ant-tableThead',
            //     dataIndex: 'lead',
            //     render: (lead)=>{
            //         let num = lead.length;
            //         if(num >= 10){
            //             lead = lead.substring(0,10)
            //             lead = lead + " ......"
            //             return <span>{lead}</span>
            //         }else{
            //             return <span>{lead}</span>
            //         }
            //     }
            // },
            // {
            //     title: '文章内容',
            //     className: 'ant-tableThead',
            //     dataIndex: 'content',
            //     render: (content) => {
            //         let num = content.length,
            //             con = <div className='lw-EditHtml' dangerouslySetInnerHTML={{ __html: content}}></div>,
            //             Content = con._owner._instance.props.record.lead
            //         if(num >= 10){
            //             Content = Content.substring(0,50)
            //             Content = Content + "......"
            //             return Content
            //         }else{
            //             return Content
            //         }
            //     }
                   
            // },
            {
                title: '发布时间',
                className: 'ant-tableThead',
                dataIndex: 'createTime',
                render: (createTime)=>{
                    return <span>{moment(createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                }
            },
            {
                title: '跟新时间',
                className: 'ant-tableThead',
                dataIndex: 'updateTime',
                render: (updateTime)=>{
                    return <span>{moment(updateTime).format('YYYY-MM-DD HH:mm:ss')}</span>
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
                            <Popconfirm title="确定要删除吗？" placement="topRight" onConfirm={() => this.handleRowDeleteClick(record.articleId, index)}>
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
        edirStartTime: '',
        editEndTime: '',
        searchState: false,

        divStyle : "none",
        DataList:[],
        editP: '',
        editC: '',
        chDistrict : {key:'',label:''},
        spin : false,
        addcheck : false,
        isdisabled : true,
        editSelectId : '',
        aganEditSelectId : '',
        districtId : '',
        editFormTitle: '',
        EditProvinceCity: null,
        SwitchCheck: false,
        ClassSpanLeft : "lw-article-top-col-span lw-article-top-col-span-change" ,
        ClassSpanRight : "lw-article-top-col-span" ,
        hasDistrict : false,

        /* body's state */
        tableData: [],
        currentPage: 1, /* 当前页数 */
        curPageSize: 0, /* 当前页面的条数 */
        pageSize: appConfig.pageableSize, /* 每页条数 */
        tableDataTotal: 0, /* 数据总数 */
        isTableDataLoading: false,
        isRowEditBtnLoadings: {},

        /* footer's state */
        articleId: '',
        title: '',
        page: '',
        priority: 1,
        content: '',
        lead : '',
        defaultFileList: [],


        editFormTitle: '',
        
        isShowEditDialog: false,
        isEditOkBtnLoading: false,
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Row className="lw-top-col" type="flex" align="middle" justify="space-between">
                    <div></div>
                    <div>
                        <span className= { this.state.ClassSpanLeft } onClick={() => {this.selectSpan("allNum")} }>平台资讯 
                            <svg width="86" height="24">
                                <line className='line-left' x1="0" y1="24" x2="500" y2="24"></line>
                            </svg>
                        </span>
                        <Switch defaultChecked={false} checked={this.state.SwitchCheck} onChange={this.onchangeSwitch} />
                        <span className={ this.state.ClassSpanRight } onClick={() => {this.selectSpan("Num")} }> 小区资讯
                            <svg width="86" height="24">
                                <line className='line-right' x1="86" y1="24" x2="-500" y2="24"></line>
                            </svg>
                        </span>
                    </div>
                </Row>
                <Row className="lw-top-col" type="flex" align="middle" justify="space-between">
                    <div>
                        {/* 搜索 */}
                        <div className="lw-list-div-li" >
                            <div style={{paddingRight:15,float:'left'}} >
                                <label>标题搜索：</label>
                                <Input
                                    name="searchName"
                                    placeholder="请输入文章标题"
                                    defaultValue={this.state.searchName}
                                    onChange={this.handleInputChange}
                                    style={{width: 150}}
                                    disabled={this.state.searchState}
                                />
                            </div>
                            <div style={{paddingRight:15,float:'left'}} >
                                <label>时间选择：</label>
                                <RangePicker 
                                    onChange={this.onChangeDate} 
                                    disabled={this.state.searchState}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div style={{float:'left', width:522, display: this.state.divStyle }}>
                            <label>选择小区： </label>
                            <Cascader options={amendArea} 
                                placeholder="请选择地区" 
                                showSearch
                                allowClear={false}
                                onChange={this.onchangeFrom}
                                onPopupVisibleChange={this.onPopupVisibleChange}
                            />
                            <Select
                                showSearch
                                labelInValue
                                optionFilterProp="children"
                                disabled = {this.state.isdisabled}
                                placeholder="选择小区"
                                style={{ width: 200 }}
                                value = {this.state.chDistrict}
                                onChange = {this.onchangeEditSecect }
                                >
                                {this.state.DataList}
                            </Select>
                            <Spin style={{marginLeft:15}} size="small" spinning={this.state.spin}></Spin>
                        </div>
                        
                        <Button style={{float:'right'}} disabled={this.state.addcheck} onClick={this.handleAddClick} icon="plus">
                            添加文章
                        </Button>
                    </div>
                </Row>

                <Table
                    columns={this.columns}
                    rowKey={record => record.articleId || 0}
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
                    width={600}
                    maskClosable={false}
                    confirmLoading={this.state.isEditOkBtnLoading}
                    onCancel={this.handleEditCancelClick}
                >
                    <Form onSubmit={this.handleEditOkClick}>
                        <FormItem
                            {...formItemLayout}
                            label="文章标题"
                        >
                            {
                                getFieldDecorator('title', {
                                    rules: customRules,
                                    initialValue: this.state.title
                                })(
                                    <Input placeholder="请输入文章标题"/>
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
                                    <InputNumber min={1}/>
                                )
                            }
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="文章封面 "
                        >
                            {
                                getFieldDecorator('page', {
                                    rules: customRules,
                                    initialValue: this.state.page
                                })(
                                    <UploadImgs
                                        defaultFileList={this.state.defaultFileList}
                                        handleEnhanceSingleUploadChange={this.handleEnhanceSingleUploadChange}
                                    />
                                )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout1}
                            label="文章导语"
                        >
                            {
                                getFieldDecorator('lead', {
                                    initialValue: this.state.lead
                                })(
                                    <TextArea 
                                        placeholder="请输入文章的导语"
                                        cols="64"
                                        rows="4"
                                        style={{padding :'0 10px'}}
                                    >
                                    </TextArea>
                                )
                            }
                        </FormItem>

                        <FormItem
                            {...formItemLayout1}
                            label="内容编辑"
                        >
                            {
                                getFieldDecorator('content', {
                                    initialValue: this.state.content
                                })(
                                    <Editor
                                        style={{width:550}}
                                        handleEditorChange={(html) => { this.handleEditorChange(html) }} 
                                        content={this.state.content}
                                    />
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
        },()=>{
            this.fetchTableData(1);
        });
    }

    changeRowLoading = (stateName, index, value) => {
        let state = this.state[stateName];
        state[index] = value;

        this.setState({ state });
    }

    onchangeSwitch = (value) => {
        if(value == false){
            this.setState({
                divStyle : "none",
                editP : '',
                editC : '',
                editSelectId : '',
                SwitchCheck : value,
                searchState : false,
                ClassSpanLeft : "lw-article-top-col-span lw-article-top-col-span-change",
                ClassSpanRight : "lw-article-top-col-span"
            },()=>{
                this.fetchTableData(1);
            })
        }else{
            this.setState({
                divStyle : "block",
                searchState : true,
                tableData : [],
                SwitchCheck : value,
                ClassSpanRight : "lw-article-top-col-span lw-article-top-col-span-change",
                ClassSpanLeft : "lw-article-top-col-span"
            },()=>{
                this.setState({
                    editSelectId : this.state.aganEditSelectId
                },()=>{
                    if(this.state.editSelectId != ''){
                        this.fetchTableData(1);
                    }
                })
                
            })
        }
    }

    selectSpan = (value)=>{
        if(value == 'allNum'){
            this.setState({
                hasDistrict : false,
                editSelectId : null,
                addcheck : false,
                isdisabled : true,
                SwitchCheck  : false,
                ClassSpanLeft : "lw-article-top-col-span lw-article-top-col-span-change",
                ClassSpanRight : "lw-article-top-col-span"
            },()=>{
                this.onchangeSwitch(false);
            })
        }else{
            this.setState({
                hasDistrict : '',
                addcheck : true,
                SwitchCheck : true,
                ClassSpanRight : "lw-article-top-col-span lw-article-top-col-span-change",
                ClassSpanLeft : "lw-article-top-col-span"
            },()=>{
                this.onchangeSwitch(true);
            })
        }
    }

    onchangeEditSecect = (value) =>{
        this.setState({
            chDistrict : value,
            editSelectId : value.key
        },()=>{
            this.fetchTableData(1);
        })
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

}

const WrappedArticle = Form.create()(Article);

export default setDisplayName('Article')(WrappedArticle);

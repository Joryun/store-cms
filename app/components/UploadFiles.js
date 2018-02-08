import React, { Component } from 'react';
import uuid from 'uuid';
import axios from 'axios';

import { Upload, message, } from 'antd';

import API from '../utils/api.js';
import * as utils from '../utils/utils.js';
import * as appConfig from 'configs/appConfig.js';


/* 上传成功后，后台返回的json数据，url的key */
const RESPONSE_URL = 'key';

class UploadFiles extends Component {
    static defaultProps = {
        multiple: true,
        listType: 'text',
        showUploadList: false,
        errorMsg: '上传失败',
    };

    constructor(props) {
        super(props);

        this.state = {
            data: null,
            fileList: [],
        };
    }

    render() {
        return (
            <Upload
                action={appConfig.qiniuUploadApi}
                data={this.state.data}
                fileList={this.state.fileList}
                showUploadList={this.props.showUploadList}
                multiple={this.props.multiple}
                listType={this.props.listType}
                beforeUpload={this.beforeUpload}
                onChange={this.handleChange}
            >
                {this.props.children}
            </Upload>
        );
    }

    beforeUpload = (file, fileList) => {
        this.setState({ fileList: [] });

        let {
            handleBeforeUpload = null
        } = this.props;

        handleBeforeUpload && handleBeforeUpload();

        let token = utils.getSSItem('token', true) || '',
            key = utils.getUuidFileName(),
            param = {
                url: `${API.getQiniuToken}?key=${key}`,
                method: 'get',
                headers: {
                    'Authorization': `token ${token}`,
                },
            };
    
        return (
            axios(param)
                .then((response) => {
                    let data = {
                        key: key,
                        token: response.data
                    }
                    this.setState({ data })
                })
        );
    }

    handleChange = ({ file, fileList }) => {
        let key = '';
        let doneFileList = [];
        for (key of fileList) {
            (key.status === 'done') && (doneFileList.push(key));
        }

        this.setState({ fileList });
        this.toggleChangeCallback(doneFileList, fileList);
    }

    toggleChangeCallback = (doneFileList, fileList) => {
        let {
            handleUploadChange = null,
        } = this.props;

        handleUploadChange && handleUploadChange(doneFileList, fileList);
    }
}

export default UploadFiles;

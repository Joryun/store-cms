import React, { Component } from 'react';
import axios from 'axios';

import { Upload, } from 'antd';

import API from '../utils/api.js';
import * as utils from '../utils/utils.js';

class UploadFile extends Component {
    static defaultProps = {
        action: '',
        name: 'file',
        multiple: false,
        showUploadList: false,
        isUploadToQiniu: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            data: null,
            fileList: [],
        };
    }

    render() {
        let isUploadToQiniu = this.props.isUploadToQiniu;
        let uploadProps = {
            action: this.props.action,
            name: this.props.name,
            multiple: this.props.multiple,
            showUploadList: this.props.showUploadList,
            fileList: this.state.fileList,
            beforeUpload: isUploadToQiniu ? this.beforeUploadToQiniu : this.beforeUpload,
            onChange: this.handleChange,
        };

        isUploadToQiniu && (uploadProps.data = this.state.data);

        return (
            <Upload
                {...uploadProps}
            >
                { this.props.children }
            </Upload>
        );
    }

    beforeUpload = (file, fileList) => {
        let {
            handleBeforeUpload = null,
        } = this.props;

        this.setState({ fileList: [] });

        handleBeforeUpload && handleBeforeUpload();
    }

    beforeUploadToQiniu = (file, fileList) => {
        let {
            handleBeforeUpload = null,
        } = this.props;
        
        this.setState({ fileList: [] });

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
        let {
            handleUploadChange = null,
        } = this.props;

        let key = '';
        let doneFileList = [];
        for (key of fileList) {
            (key.status === 'done') && (doneFileList.push(key));
        }
        
        this.setState({ fileList });

        handleUploadChange && handleUploadChange(doneFileList, fileList);
    }
}

export default UploadFile;

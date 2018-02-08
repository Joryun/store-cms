/**
 * 手动上传文件
 */

import React, { Component } from 'react';

import { Upload, Button, Icon, message, } from 'antd';


class ManualUploadFiles extends Component {
    static defaultProps = {
        action: '',
        name: 'file',
        limit: 1,
        accept: null,
        acceptTips: '文件格式有误',
        multiple: false,
        listType: 'text',
        uploadButtonTxt: '上传',
        errorMsg: '文件上传失败',
        isEnhanceSingle: true,
    };

    constructor(props) {
        super(props);

        let {
            defaultFileList = [],
        } = this.props;

        this.state = {
            fileList: defaultFileList,
        };
    }

    render() {
        let {
            fileList
        } = this.state;

        let isHideUploadButton = (fileList.length >= this.props.limit);
        
        const uploadButton = (
            <Button icon="upload" disabled={isHideUploadButton}>{ this.props.uploadButtonTxt }</Button>
        );

        const uploadProps = {
            action: this.props.action,
            name: this.props.name,
            multiple: this.props.multiple,
            listType: this.props.listType,
            fileList: fileList,
            beforeUpload: this.beforeUpload,
            onChange: this.onChange,
        };

        (this.props.accept) && (uploadProps.accept = this.props.accept);

        return (
            <Upload
                { ...uploadProps }
            >
                {uploadButton}
            </Upload>
        );
    }

    beforeUpload = (file, fileList) => {
        let {
            handleOpenSuccess = null,
        } = this.props;

        this.setState({ fileList });
        
        handleOpenSuccess && handleOpenSuccess(fileList);
        
        return false;
    }

    onChange = ({ file, fileList }) => {
        let {
            handleOpenSuccess = null,
        } = this.props;

        this.setState({ fileList });

        handleOpenSuccess && handleOpenSuccess(fileList);
    }
}

export default ManualUploadFiles;

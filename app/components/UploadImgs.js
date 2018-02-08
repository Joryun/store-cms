import React, { Component } from 'react';
import uuid from 'uuid';
import axios from 'axios';

import { Upload, Modal, Icon, message, } from 'antd';

import API from '../utils/api.js';
import * as utils from '../utils/utils.js';
import * as appConfig from 'configs/appConfig.js';


export const setDefaultFileList = (imgUrls = []) => {
    let defaultFileList = [];

    !imgUrls && (imgUrls = []);

    let item = '',
        id = '';
    for (item of imgUrls) {
        if (item) {
            id = uuid.v4();

            defaultFileList.push({
                uid: id,
                picname: `UploadImgs-${id}.png`,
                status: 'done',
                url: item,
            });
        }
    }

    return defaultFileList;
};

const uploadButton = (
    <div>
        <Icon type="plus" />
        <div>上传</div>
    </div>
);

/* 上传图片成功后，后台返回的json数据，图片url的key */
const RESPONSE_IMG = 'key';

class UploadImgs extends Component {
    static defaultProps = {
        // action: API.uploadToQiniu, 使用七牛的直传
        // name: 'file',
        //限制多少个（limit）
        limit: 1,
        multiple: false,
        listType: 'picture-card',
        errorMsg: '图片上传失败',
        isEnhanceSingle: true,
    };

    constructor(props) {
        super(props);

        let {
            defaultFileList = [],
        } = this.props;

        this.state = {
            flay: false,
            data: null,
            fileList: defaultFileList,
            limitNum: 1,
            previewImage: '',

            isPreviewVisible: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        let {
            defaultFileList = [],
        } = nextProps;

        if (!this.props.defaultFileList.equals(defaultFileList)) {
            this.setState({ fileList: [...defaultFileList], });
        }
    }

    render() {
        let {
            fileList
        } = this.state;
        let isHideUploadButton = (fileList.length >= this.props.limit);
        return (
            <div>
                <Upload
                    action={appConfig.qiniuUploadApi}
                    data={this.state.data}
                    multiple={this.props.multiple}
                    listType={this.props.listType}
                    fileList={fileList}
                    beforeUpload={this.beforeUpload}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {isHideUploadButton ? null : uploadButton}
                </Upload>

                <Modal title="图片预览" width={620} visible={this.state.isPreviewVisible} footer={null} onCancel={this.handleCancel}>
                    <img style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
            </div>
        );
    }

    beforeUpload = (file, fileList) => {
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
                        token: response.data.token
                    }
                    this.setState({ data })
                })
        );
    }

    handleChange = ({ file, fileList }) => {
        (file.status === 'error') && (message.error(this.props.errorMsg, 2));

        let key = '';
        let doneFileList = [];
        for (key of fileList) {
            (key.status === 'done') && (doneFileList.push(key));
        }

        this.setState({ fileList });
        this.toggleChangeCallback(doneFileList);
    }

    toggleChangeCallback = (doneFileList) => {
        let {
            isEnhanceSingle,
            handleUploadChange = null,
            handleEnhanceSingleUploadChange = null,
            handleGoodsPicturesUploadChange = null,
        } = this.props;

        handleUploadChange && handleUploadChange(doneFileList);

        let imgUrl = '';
        if (isEnhanceSingle) {
            let {
                response = {},
            } = doneFileList[0] || {};
            let responseImg = response[RESPONSE_IMG];

            (responseImg) && (imgUrl = `${appConfig.qiniuDomain}/${responseImg}`);

            handleEnhanceSingleUploadChange && handleEnhanceSingleUploadChange(imgUrl);
            handleGoodsPicturesUploadChange && handleGoodsPicturesUploadChange(imgUrl);
        }
    }

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            isPreviewVisible: true,
        });
    }

    handleCancel = () => this.setState({ isPreviewVisible: false })
}

export default UploadImgs;

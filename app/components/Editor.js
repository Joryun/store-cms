import React, { Component } from 'react';
import UploadImgs from '../components/UploadImgs.js';
import E from 'wangeditor';

import API from '../utils/api.js';
import * as utils from '../utils/utils';


const MENUS = [
    'head',  // 标题
    'bold',  // 粗体
    'italic',  // 斜体
    'underline',  // 下划线
    'strikeThrough',  // 删除线
    'foreColor',  // 文字颜色
    'backColor',  // 背景颜色
    'link',  // 插入链接
    'list',  // 列表
    'justify',  // 对齐方式
    // 'quote',  // 引用
    // 'emoticon',  // 表情
    'image',  // 插入图片
    // 'table',  // 表格
    // 'video',  // 插入视频
    // 'code',  // 插入代码
    'undo',  // 撤销
    'redo'  // 重复
];

class Editor extends Component {
    constructor(props) {
        super(props);

        this.editor = null;
    }

    componentWillReceiveProps(nextProps) {
        let {
            content = '',
        } = nextProps;

        if (content !== this.props.content) {
            this.editor.txt.html(content);
        }
    }

    render() {
        return (
            <div ref="editorElem" style={{textAlign: 'left', width: '100%'}}></div>
        );
    }

    componentDidMount() {
        const elem = this.refs.editorElem;
        const editor = new E(elem);

        this.editor = editor;

        let {
            content,
            handleEditorChange = null,
        } = this.props;

        editor.customConfig.onchange = html => {
            handleEditorChange(html);
        };

        let token = utils.getSSItem('token', true) || '';

        // 配置服务器端地址
        // editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
        editor.customConfig.uploadImgServer = API.uploadToQiniu;
        editor.customConfig.uploadImgHeaders = {
            'Authorization': `token ${token}`,
            // 'Authorization': `token c644159703a24068bb2a1b444cb6f69dj7spm292`,
        }
        editor.customConfig.uploadFileName = 'file'; // TODO: 这里因为只有改了这个值，才能改formData的name字段，如果不以name="img"的形式给后台，后台是接收不了的
        editor.customConfig.uploadImgHooks = {
            // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
            // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
            customInsert: function (insertImg, result, editor) {
                // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
                // 举例：假如上传图片成功后，服务器端返回的是 {imgUrl:'....'} 这种格式，即可这样插入图片：
                var imgUrl = result.imageFileUrl
                insertImg(imgUrl)
        
                // result 必须是一个 JSON 格式字符串！！！否则报错
            }
        };
 
        /* 自定义菜单配置 */
        editor.customConfig.menus = MENUS;

        editor.create();
        editor.txt.html(content); /* 根据传递进来的content，设置初始化的值 */
    }
}

export default Editor;

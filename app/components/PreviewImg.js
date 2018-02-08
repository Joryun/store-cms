import React from 'react';

import { Tooltip } from 'antd';

const DEFAULT_STYLE = {
    maxWidth: '100%',
    height: '100px',
    cursor: 'pointer',
};

const PreviewImg = (props) => {
    let {
        src = '',
        title = '点击可预览',
        placement = 'top',
        style = DEFAULT_STYLE,
        handlePreviewImgClick = null,
    } = props;

    return (
        <Tooltip title={title} placement={placement}>
            <img src={src} style={style} onClick={() => { handlePreviewImgClick && handlePreviewImgClick(src) }}/>
        </Tooltip>
    );
};

export default PreviewImg;

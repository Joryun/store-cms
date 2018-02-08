import React from 'react';

import { Modal, } from 'antd';

const HocPreviewImg = (WrappedComponent) => {
    return (
        class HocPreviewImg extends WrappedComponent {
            state = {
                ...this.state,
                previewImgSrc: '',

                isShowDialog: false,
            };

            render() {
                return (
                    <div>
                        <Modal
                            title="图片预览"
                            visible={this.state.isShowDialog}
                            footer={null}
                            onCancel={this.handleCancel}
                        >
                            <img style={{ width: '100%' }} src={this.state.previewImgSrc} />
                        </Modal>

                        { super.render() }
                    </div>
                );
            }

            handleCancel = () => {
                this.setState({
                    isShowDialog: false,
                });
            }

            handlePreviewImgClick = (previewImgSrc) => {
                this.setState({
                    previewImgSrc,
                    isShowDialog: true,
                })
            }
        }
    )
}

export default HocPreviewImg;

const HocHdBanner = (WrappedComponent) => {
    return (
        class HocHdBanner extends WrappedComponent {
            render() {
                return super.render();
            }

            handleEnhanceSingleUploadChange = (imgUrl) => {
                this.props.form.setFieldsValue({ bannerUrl: imgUrl });
            }

            handleAddClick = () => {
                this.editFormFlag = 'add';

                this.setState({
                    editFormTitle: '添加封面信息',
                    isShowEditDialog: true,
                });

                this.props.form.setFieldsValue({
                    bannerUrl: '',
                    priority: '',
                    redirectUrl: '',
                });
            }

        }
    )
}

export default HocHdBanner;

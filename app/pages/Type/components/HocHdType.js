const HocHdType = (WrappedComponent) => {
    return (
        class HocHdType extends WrappedComponent {
            render() {
                return super.render();
            }

            // handleSearchSubmit = (event) => {
            //     event.preventDefault();
            //     this.fetchTableData(1);
            // }

            handleAddClick = () => {
                this.editFormFlag = 'add';
        
                this.setState({
                    editFormTitle: '添加信息',
                    isShowEditDialog: true,
                });

                this.props.form.setFieldsValue({
                    name : '',
                    imageUrl : '',
                    priority : '',
                    // remarks : '',
                });
            }

            handleEnhanceSingleUploadChange = (imgUrl) => {
                this.props.form.setFieldsValue({ imageUrl: imgUrl });
            }

        }
    )
}

export default HocHdType;

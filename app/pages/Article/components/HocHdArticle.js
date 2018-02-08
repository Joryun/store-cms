const HocHdArticle = (WrappedComponent) => {
    return (
        class HocHdArticle extends WrappedComponent {
            render() {
                return super.render();
            }

            // handleSearchSubmit = (event) => {
            //     event.preventDefault();
            //     this.fetchTableData(1);
            // }
            handleEnhanceSingleUploadChange = (imgUrl) => {
                this.props.form.setFieldsValue({ page: imgUrl });
            }

            handleEditorChange = (html) => {
                this.setState({ content: html });
            }

            handleAddClick = () => {
                this.editFormFlag = 'add';
        
                this.setState({
                    editFormTitle: '添加管理员信息',
                    isShowEditDialog: true,
                    content : '',
                });

                this.props.form.setFieldsValue({
                    title: '',
                    priority: 1,
                    page: '',
                    content: '',
                    lead : '',
                });
            }
        }
    )
}

export default HocHdArticle;

const HocHdKeywords = (WrappedComponent) => {
    return (
        class HocHdKeywords extends WrappedComponent {
            render() {
                return super.render();
            }

            handleAddClick = () => {
                this.editFormFlag = 'add';
        
                this.setState({
                    editFormTitle: '添加热搜词信息',
                    isShowEditDialog: true,
                });

                this.props.form.setFieldsValue({
                    keywordsInfo: '',
                    priority: 1
                });
            }
        }
    )
}

export default HocHdKeywords;

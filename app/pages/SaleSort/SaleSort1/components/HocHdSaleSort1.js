const HocHdSaleSort1 = (WrappedComponent) => {
    return (
        class HocHdSaleSort1 extends WrappedComponent {
            render() {
                return super.render();
            }

            handleAddClick = () => {
                this.editFormFlag = 'add';
        
                this.setState({
                    editFormTitle: '添加商品',
                    isShowEditDialog: true,
                });

                this.props.form.setFieldsValue({
                    goodsId : '',
                    priority : ''
                });
            }
        }
    )
}

export default HocHdSaleSort1;

const HocHdWarehouse = (WrappedComponent) => {
    return (
        class HocHdWarehouse extends WrappedComponent {
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
                    editFormTitle: '添加仓库信息',
                    isShowEditDialog: true,
                });

                this.props.form.setFieldsValue({
                    warehouseAddress: '',
                    warehouseName: '',
                    provinceCity: ''
                });
            }



        }
    )
}

export default HocHdWarehouse;

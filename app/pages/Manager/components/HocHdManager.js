const HocHdManager = (WrappedComponent) => {
    return (
        class HocHdManager extends WrappedComponent {
            render() {
                return super.render();
            }

            handleSearchSubmit = (event) => {
                event.preventDefault();
                this.fetchTableData(1);
            }

            handleAddClick = () => {
                this.editFormFlag = 'add';
        
                this.setState({
                    editFormTitle: '添加产品经理信息',
                    isShowEditDialog: true,
                    isdisabled : true,
                });

                this.props.form.setFieldsValue({
                    realName: '',
                    phone: '',
                    passDistrict : { key:'',label: '' },
                    EditProvinceCity : '',
                    balanceProportion: 0,
                });
            }

            onchangeFrom = (value) => {
                let values = value;
                this.setState({
                    editP : values[0],
                    editC : values[1],
                },()=>{
                    this.WarehouseList();
                })
            }

            onPopupVisibleChange = (value) =>{
                if(value == true){
                    this.props.form.setFieldsValue({
                        passDistrict : { key:'',label: '' },
                    })
                }
            }


        }
    )
}

export default HocHdManager;

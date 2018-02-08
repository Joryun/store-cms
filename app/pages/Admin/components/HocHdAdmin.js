const HocHdAdmin = (WrappedComponent) => {
    return (
        class HocHdAdmin extends WrappedComponent {
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
                    editFormTitle: '添加管理员信息',
                    isShowEditDialog: true,
                    isdisabled : true,
                });

                this.props.form.setFieldsValue({
                    account: '',
                    managerName: '',
                    password: '',
                    phone: '',
                    role: '',
                    passWare : { key:'',label: '' },
                    EditProvinceCity : '',
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
                        passWare : { key:'',label: '' },
                    })
                }
            }

            onchangeEditSecect = (value) =>{
                this.setState({
                    editSelectId : value.key
                })
            }


        }
    )
}

export default HocHdAdmin;

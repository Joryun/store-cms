import callAxios from 'utils/callAxios';
import API from 'utils/api.js';
const HocHdDistrict = (WrappedComponent) => {
    return (
        class HocHdDistrict extends WrappedComponent {
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
                    districtName: '',
                    provinceCity: '',
                    address : '',
                    passWare : { key:'',label: '' },
                    EditProvinceCity : '',
                });
                
            }

            onPopupVisibleChange = (value) =>{
                if(value == true){
                    this.props.form.setFieldsValue({
                        passWare : { key:'',label: '' },
                    })
                }
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

        }
    )
}

export default HocHdDistrict;

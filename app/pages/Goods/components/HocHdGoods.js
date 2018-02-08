import { message, } from 'antd';
const HocHdGoods = (WrappedComponent) => {
    return (
        class HocHdGoods extends WrappedComponent {
            render() {
                return super.render();
            }

            // handleSearchSubmit = (event) => {
            //     event.preventDefault();
            //     this.fetchTableData(1);
            // }

            handleAddClick = () => {
                this.setState({
                    level: '',
                    place: '',
                    standard:'',
                    tips: '',
                    storageMethod: '',
                    getTitle: '',
                    editFormTitle: '添加信息',
                    editFormFlag : 'add',
                    pathDefaultFileList: [],
                    goodsPicturesDefaultFileList: [],
                    isShowEditDialog: true,
                });

                this.props.form.setFieldsValue({
                    path: '',
                    name: '',
                    pricePerCatty: '',
                    cattyEach: '',
                    remark: '',
                    price: '',
                    a: {key:'',label:''}
                });
            }

            onchangeOne = (value,e) => {
                this.setState({
                    [value.target.id] : value.target.value
                })
            }

            /* 产品说明 */
            handleEditOne = (value) => {
                this.setState({
                    isShowDialogOne: true,
                })
            }

            handleCancelOne = () => {
                this.setState({ isShowDialogOne: false, });
            }

            handleOkOne = () =>{
                event.preventDefault();
                let {
                    level = '',
                    place = '',
                    standard = '',
                    tips = '',
                    storageMethod = '',
                } = this.state;
                if(level == ''||place == '' ||standard ==''||tips==''||storageMethod == ''){
                    message.error("不能为空！");
                }else if(level == null||place == null ||standard == null||tips== null||storageMethod == null){
                    message.error("不能为空！");
                }else{
                    this.setState({
                        isShowDialogOne: false,
                    })
                }
            }


            /* 追加弹窗 */

            handleEditCancelClick = () => {
                (this.editFormFlag === 'update') && (this.changeRowLoading('isRowEditBtnLoadings', this.tableCurIndex, false));

                this.setState({ isShowEditDialog: false, });
            }
        
            handleEditOkClick = (event) => {
                event.preventDefault();
        
                this.props.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        this.fetchEditInfo(values);
                    }
                });
            }

            onchangeEditSecect = (key) => {
                let keyNum = key.key;
                this.setState({ 
                    goodsTypeId : keyNum,
                });
            }

            handleEdit = (value) => {
                this.setState({
                    isShowDialog: true,
                })
            }

            handleOk = () =>{
                event.preventDefault();
                this.setState({
                    isShowDialog: false,
                })
            }

            handleCancel = () => {
                this.setState({ isShowDialog: false, });
            }

            handleEditorChange = (html) => {
                this.setState({ getTitle: html });
            }

        }
    )
}

export default HocHdGoods;

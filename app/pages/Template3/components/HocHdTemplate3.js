const HocHdTemplate3 = (WrappedComponent) => {
    return (
        class HocHdTemplate3 extends WrappedComponent {
            render() {
                return super.render();
            }

            // TODO: 检查需要实现哪些函数

            handleSearchSubmit = (event) => {
                event.preventDefault();
                this.fetchTableData(1); // TODO: 检查一下body中的fetchTableData
            }

            // TODO: 检查是否有添加操作
            handleAddClick = () => {
                this.editFormFlag = 'add';
        
                // TODO: 修改属性
                // TODO: 写入这两个state
                // TODO: 检查是否还有其它state
                this.setState({
                    editFormTitle: '添加管理员信息',
                    isShowEditDialog: true,
                });

                // TODO: 修改form属性
                // TODO: 写入些state
                // TODO: 检查是否还有其它state
                this.props.form.setFieldsValue({
                    name: '',
                    playStartTime: '',
                    raiseDelay: '',
                    repurchaseGoldBean: '',
                    repurchaseRecordPoker: '',
                });
            }

            // TODO: 还有其它操作吗?
        }
    )
}

export default HocHdTemplate3;

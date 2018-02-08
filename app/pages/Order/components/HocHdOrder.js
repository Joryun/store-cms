
import API from 'utils/api.js';
import callAxios from 'utils/callAxios';
import exportFile from 'utils/exportFile.js';

const HocHdOrder = (WrappedComponent) => {
    return (
        class HocHdOrder extends WrappedComponent {
            render() {
                return super.render();
            }

            handleSearchSubmit = (event) => {
                event.preventDefault();
                this.fetchTableData(1);
            }

            handleExportClick = () => {
                this.setState({ isExportBtnLoading: true });

                let filter = this.getFetchTableFilter();

                exportFile({
                    that: this,
                    api: `${API.orderExport}?${filter}`,
                    method: 'get',
                    finallyCB: () => {
                        this.setState({ isExportBtnLoading: false });
                    },
                });
            }

            handleSearchTimeChange = (values) => {
                if (values.length !== 2) {
                    this.setState({
                        searchStartTime: '',
                        searchEndTime: '',
                    },()=>{
                        this.fetchTableData(1);
                    });
                } else {
                    this.setState({
                        searchStartTime: values[0].valueOf(),
                        searchEndTime: values[1].valueOf(),
                    },()=>{
                        this.fetchTableData(1);
                    });
                }
            }
        }
    )
}

export default HocHdOrder;

import API from '../../../utils/api.js';
import callAxios from '../../../utils/callAxios';
import * as appConfig from '../../../configs/appConfig.js';
import * as statusConfig from '../../../configs/statusConfig.js';
import {
    message,
} from 'antd';

const HocBdBanner = (WrappedComponent) => {
    return (
        class HocBdBanner extends WrappedComponent {
            render() {
                return super.render();
            }

            componentDidMount() {
                this.DistrictList();
                this.fetchTableData();
            }

            fetchTableData = (currentPage = 1, size = appConfig.pageableSize) => {
                this.setState({ isTableDataLoading: true, });
                callAxios({
                    that: this,
                    method: 'get',
                    url: `${API.findBanner}`,
                })
                .then((response) => {
                    let {
                        content = [],
                    } = response.data;
                    this.setState({
                        ftState : false,
                        tableData: content,
                        districtId: content[0].districtId
                    });
                })
                .finally(() => {
                    this.setState({ isTableDataLoading: false, });
                });

            }

            // getFetchTableFilter = () => {
            //     let {
            //         realName = '',
            //         salesmanNumber = '',
            //         mobilePhone = '',
            //         flag = '',
            //     } = this.state;
            //     let filter = '';

            //     (realName !== '') && (filter += `&realName=${realName}`);
            //     (salesmanNumber !== '') && (filter += `&salesmanNumber=${salesmanNumber}`);
            //     (mobilePhone !== '') && (filter += `&mobilePhone=${mobilePhone}`);
            //     (flag !== '') && (filter += `&flag=${flag}`);
        
            //     return filter;
            // }

            handleTableChange = (pagination) => {
                let current = pagination.current || 1;

                this.setState({ currentPage: current });
                // this.fetchTableData(current);
            }

            handleRowEditClick = (index, record) => {
                this.editFormFlag = 'update';

                let {
                    districtId = -1,
                    bannerId = -1,
                    bannerUrl = '',
                    redirectUrl = '',
                    priority = '',
                } = record;
                this.tableCurIndex = index;
                
                let defaultFileList = [];
                defaultFileList = (bannerUrl != '') && ([
                    {
                        uid: bannerId,
                        picname: `p-${bannerId}.png`,
                        status: 'done',
                        url: bannerUrl,
                    }
                ]);

                this.setState({
                    districtId,
                    bannerId,
                    editFormTitle: '编辑封面信息',
                    defaultFileList: defaultFileList,
                    isShowEditDialog: true,
                });

                this.props.form.setFieldsValue({
                    bannerUrl : bannerUrl,
                    priority,
                    redirectUrl,
                });
            }

            handleRowDeleteClick = (record, index) => {
                this.setState({ isTableDataLoading: true, });

                callAxios({
                    that: this,
                    method: 'delete',
                    url: `${API.banner}?bannerId=${record.bannerId}`,
                })
                .then((response) => {
                    message.success('删除成功！');

                    let currentPage = this.state.currentPage,
                        curPageSize = this.state.curPageSize - 1;
                    
                    if (curPageSize <= 0) {
                        --currentPage;

                        (currentPage < 0) && (currentPage = 0);
                    }
                    if(record.districtId == null){
                        this.fetchTableData(1);
                    }else{
                        this.handleSelectChange(this.state.districtNum)
                    }
                })
                .catch(() => {
                    this.setState({ isTableDataLoading: false, });
                });
            }
        }
    );
}

export default HocBdBanner;

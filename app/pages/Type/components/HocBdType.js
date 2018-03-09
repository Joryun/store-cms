import API from '../../../utils/api.js';
import callAxios from '../../../utils/callAxios';
import * as appConfig from '../../../configs/appConfig.js';

import {
    message,
} from 'antd';

const HocBdType = (WrappedComponent) => {
    return (
        class HocBdType extends WrappedComponent {
            render() {
                return super.render();
            }

            componentDidMount() {
                this.CategoryList();
                this.fetchTableData(1);
            }

            fetchTableData = (currentPage = 1, size = appConfig.pageableSize) => {
                this.setState({ isTableDataLoading: true, });
                
                let filter = this.getFetchTableFilter();
        
                callAxios({
                    that: this,
                    method: 'get',
                    url: `${API.secondCategoryPage}?page=${currentPage - 1}&size=${size}${filter}`,
                })
                .then((response) => {
                    let {
                        content = [],
                        numberOfElements = 0,
                        totalElements = 0,
                    } = response.data;
                    this.setState({
                        tableData: content,
                        curPageSize: numberOfElements,
                        currentPage: currentPage,
                        tableDataTotal: totalElements,
                    });
                })
                .finally(() => {
                    this.setState({ isTableDataLoading: false, });
                });

            }

            getFetchTableFilter = () => {
                let {
                    categoryNum = ''
                } = this.state;
                let filter = '';
                (categoryNum != null) && (filter += `&categoryId=${categoryNum}`);
                if (categoryNum == null) {
                    filter += `&categoryId=1`;
                }
                return filter;
            }

            handleTableChange = (pagination) => {
                let current = pagination.current || 1;

                this.setState({ currentPage: current });

                this.fetchTableData(current);
            }

            handleRowEditClick = (index, record) => {
                this.editFormFlag = 'update';
        
                let {
                    id = -1,
                    priority = '',
                    // remarks = '',
                    secondCategoryUrl = '',
                    name = '',
                } = record;

                this.tableCurIndex = index;

                let defaultFileList = [];
                defaultFileList = (secondCategoryUrl != '') && ([
                    {
                        uid: id,
                        picname: `p-${id}.png`,
                        status: 'done',
                        url: secondCategoryUrl,
                    }
                ]);
                this.setState({
                    id,
                    editFormTitle: '编辑信息',
                    defaultFileList: defaultFileList,
                    isShowEditDialog: true,
                });

                this.props.form.setFieldsValue({
                    priority,
                    secondCategoryUrl: secondCategoryUrl,
                    name
                });
            }

            handleRowDeleteClick = (record, index) => {
                this.setState({ isTableDataLoading: true, });

                callAxios({
                    that: this,
                    method: 'delete',
                    url: `${API.category}?goodsTypeId=${record.id}`,
                })
                .then((response) => {
                    message.success('删除成功！');

                    let currentPage = this.state.currentPage,
                        curPageSize = this.state.curPageSize - 1;
                    
                    if (curPageSize <= 0) {
                        --currentPage;

                        (currentPage < 0) && (currentPage = 0);
                    }
        
                    this.fetchTableData(currentPage);
                })
                .catch(() => {
                    this.setState({ isTableDataLoading: false, });
                });
            }
        }
    );
}

export default HocBdType;

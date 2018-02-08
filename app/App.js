
import React, { Component } from 'react'
import styles from './App.scss';
import {
    Route,
    Link,
    Switch,
} from 'react-router-dom'
import router from './router.js'
import { Layout, Menu, Breadcrumb, Icon, Dropdown, Row, Button } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

import * as routeList from './configs/routeList.js';
import routePath from './configs/routePath.js';
import sidebarConfig from './configs/sidebarConfig.js';
import breadcrumbConfig from './configs/breadcrumbConfig.js';
import * as utils from './utils/utils.js';

const oneLevelMenu = (item) => {
    return (
        <Menu.Item key={item.pathAndKey}>
            <Link to={item.pathAndKey}>{item.label}</Link>
        </Menu.Item>
    );
}

const twoLevelMenu = (item) => {
    let {
        label,
        pathAndKey,
        childs,
    } = item;

    return (
        <SubMenu key={pathAndKey} title={<span>{label}</span>}>
            {
                childs.map((item) => {
                    return oneLevelMenu(item);
                })
            }
        </SubMenu>
    );
}

class App extends Component {
    constructor(props) {
        super(props);

        this.managerRole = utils.getSSItem('managerRole');
        this.userMenu = (
            <Menu>
                <Menu.Item>
                    <span onClick={this.handleQuitClick}><Icon style={{ marginRight: '10px' }} type="logout" />退出登录</span>
                </Menu.Item>
            </Menu>
        );
    }

    render() {
        let breadcrumbItems = this.calBreadcrumbItems();

        return (
            <div className="App">
                <Layout>
                    <Sider style={{ position: 'fixed', left: 0, top: 0, bottom: 0, overflow: 'auto', }}>
                        <div className={styles.logo}>Yo商城管理后台</div>

                        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                            {
                                this.calSidebar(sidebarConfig).map((item, index) => {
                                    return (item.childs) ? twoLevelMenu(item) : oneLevelMenu(item);
                                })
                            }
                        </Menu>
                    </Sider>

                    <Layout style={{ marginLeft: 200 }}>
                        <Header style={{ background: '#fff', padding: '0 40px 0 15px', fontSize: 18, }} >
                            <Row type="flex" align="middle" justify="end" style={{height: '100%',}}>
                                <Dropdown overlay={this.userMenu}>
                                    <Icon type="user" />
                                </Dropdown>
                            </Row>
                        </Header>

                        <Content style={{ margin: '0 16px', minHeight: '100vh', }}>
                            <Breadcrumb separator=">" style={{ margin: '12px 0' }}>
                                { breadcrumbItems }
                            </Breadcrumb>

                            <div style={{ padding: 24, background: ' #fff' }}>
                                <Switch>
                                    {
                                        this.calAppRoute().map((item) => {
                                            return (
                                                <Route exact key={item.path} path={item.path} component={item.component} />
                                            );
                                        })
                                    }
                                </Switch>
                            </div>
                        </Content>

                        <Footer style={{ textAlign: 'center' }}></Footer>
                    </Layout>
                </Layout>
            </div>
        );
    }

    calSidebar = (list = []) => {
        let managerRole = this.managerRole;

        // return list; // TODO: 暂时禁用了权限控制

        return list.filter((item) => {
            let childs = item.childs || null;
            if (childs) {
                item.childs = this.calSidebar(childs);
            }
            return item.managerRole.includes(managerRole);
        });
    }

    calBreadcrumbItems = (params) => {
        const { location } = this.props;
        const pathSnippets = location.pathname.split('/').filter(i => i);
        const pathSnippetsLength = pathSnippets.length;
        const extraBreadcrumbItems = pathSnippets.map((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;

            return (
                <Breadcrumb.Item key={url}>
                    {
                        index !== (pathSnippetsLength - 1)
                        ?
                            <Link to={url}>
                                {breadcrumbConfig[url]}
                            </Link>
                        :
                            breadcrumbConfig[url]
                    }
                </Breadcrumb.Item>
            );
        });

        return extraBreadcrumbItems;
    }

    calAppRoute = () => {
        let managerRole = this.managerRole;

        // return routeList.appRoute; // TODO: 暂时禁用了权限控制
        return routeList.appRoute.filter(item => item.managerRole.includes(managerRole));
    }

    handleQuitClick = () => {
        utils.setSSItem('token', '');
        utils.setSSItem('managerRole', '');

        this.props.history.replace(routePath.Login);
    }
}
export default App;
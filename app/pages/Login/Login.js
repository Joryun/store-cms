import React, { Component } from 'react';
import uuid from 'uuid';

import { Form, Icon, Input, Button, Row, Col, Spin, message, } from 'antd';
const FormItem = Form.Item;

import styles from './Login.scss';

import API from '../../utils/api.js';
import callAxios from '../../utils/callAxios.js';
import * as utils from '../../utils/utils.js';
import * as appConfig from '../../configs/appConfig.js';

class Login extends Component {
    constructor(props) {
        super(props);

        this.picCaptchaUuid = '';
    }

    state = {
        "account": '',
        "captcha": '',
        "password": '',
        
        picCaptcha: '',

        isPicCaptchaLoading: true,
        isLoginLoading: false,
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className={styles.loginContainer}>
                <div className={styles.loginContainerBd}>
                    <Form onSubmit={this.handleSubmit} className={styles.loginForm}>
                        <h2 className={styles.loginFormTitle}>用户登录</h2>

                        <FormItem>
                            {getFieldDecorator('account', {
                                rules: [{ required: true, message: '请输入您的用户名' }],
                            })(
                                <Input name="account" prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
                            )}
                        </FormItem>

                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入您的密码' }],
                            })(
                                <Input name="password" prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
                            )}
                        </FormItem>

                        <FormItem>
                            <Row type="flex" justify="space-between" align="top">
                                <Col span={12}>
                                    {getFieldDecorator('captcha', {
                                        rules: [{ required: true, message: '请输入验证码' }],
                                    })(
                                        <Input name="captcha" placeholder="验证码" style={{height: '32px'}} />
                                    )}
                                </Col>
                                <Col className={styles.picCaptcha}>
                                    <Spin spinning={this.state.isPicCaptchaLoading} size="small">
                                        <img className={styles.picCaptchaImg} src={this.state.picCaptcha} onClick={this.fetchPicCaptcha}/>
                                    </Spin>
                                </Col>
                            </Row>
                        </FormItem>

                        <FormItem>
                            <Button className={styles.loginFormBtn} type="primary" htmlType="submit" loading={this.state.isLoginLoading}>登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.fetchPicCaptcha();
    }

    fetchPicCaptcha = () => {
        this.setState({ isPicCaptchaLoading: true });

        this.picCaptchaUuid = this.calPicCaptchaUuid();

        callAxios({
            method: 'get',
            responseType: 'blob',
            url: `${API.getPicCaptcha}?uuid=${this.picCaptchaUuid}`,
        })
        .then((response) => {
            let {
                data
            } = response;

            let picCaptcha = URL.createObjectURL(data) || '';

            this.setState({ picCaptcha });
        })
        .finally(() => {
            this.setState({ isPicCaptchaLoading: false });
        });
    }

    calPicCaptchaUuid = (params) => {
        let date = new Date();

        return `${uuid.v4()}_${date.valueOf()}`
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.fetchLogin(values);
            }
        });
    }

    fetchLogin = (values) => {
        let {
            account = '',
            captcha = '',
            password = '',
        } = values;

        this.setState({ isLoginLoading: true });
        callAxios({
            method: 'post',
            url: `${API.managerLogin}`,
            data: {
                account,
                captcha,
                password,
                uuid: this.picCaptchaUuid,
            },
        })
        .then((response) => {
            let {
                data
            } = response;

            this.cacheUserInfo(data);

            message.success('登录成功', 0.5, () => {
                this.props.history.replace(appConfig.loginToIndex);
            });
        })
        .finally(() => {
            this.setState({ isLoginLoading: false });
        });
    }

    cacheUserInfo = (data) => {
        let {
            managerId = -1,
            managerName = '',
            managerRole = '',
            token = ''
        } = data;
        let cacheData = {
            managerId,
            managerName,
            managerRole,
            token,
        };

        let key = '';
        for (key of Object.keys(cacheData)) {
            utils.setSSItem(key, cacheData[key]);
        }
    }
}

const WrappedLogin = Form.create()(Login);


export default WrappedLogin;


import React, { Component } from 'react';
import { Table, Input, Icon, Button, Popconfirm } from 'antd';

import API from 'utils/api.js';
import callAxios from 'utils/callAxios';
import styles from './Order.scss';

class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
    id: this.props.id,
    orderId : this.props.orderId,
  }
  
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
  }

  check = () => {
    this.setState({ editable: false });
    console.log(this.state.orderId);
    callAxios({
        that: this,
        method: 'put',
        url: `${API.lessRecord}`,
        data:{
          "orderGoods": {
            "flag": "FALSE",
            "goodsId": 0,
            "goodsName": "string",
            "goodsNum": 0,
            "goodsPrice": 0,
            "goodsTotalFee": 0,
            "id": this.state.id,
            "orderId": this.state.orderId,
            "quantityDifference": parseFloat(this.state.value),
            "remark": "string"
          }
        }
    })
    .then((response) => {
    })
    // if (this.props.onChange) {
      // this.props.onChange(this.state.value);
    // }
  }

  edit = () => {
    this.setState({ editable: true });
  }

  render() {
    const { value, editable } = this.state;
    return (
      <div className={styles.editableCell}>
        {
          editable ?
            <div className="editable-cell-input-wrapper">
              <Input
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
                className={styles.editableCellValue}
              />
              <Button 
                className="editable-cell-check"
                onClick={this.check}
              >确定</Button>
            </div>
            :
            <div className="editable-cell-text-wrapper">
              <span
                className={styles.editableCellValue}
              >{value || ' '}</span>
              <Button 
                className={styles.editableCellEdit}
                onClick={this.edit}
              >编辑</Button>
            </div>
        }
      </div>
    );
  }
}

export default EditableCell;

import React, { useState, useEffect } from 'react';
import { Form, Select, Icon } from 'antd';

import './Exo.css';

const { Option } = Select;

const ExoType = (props) => {

  const { form: { getFieldDecorator } } = props;

  const onSelectType = (e) => {
    props.setExoType(e.key);
  }

  return (
    <div style={{ display: 'flex'}} >
      <Form.Item
        label='Type of exercice'
        style={{ width: '100%'}}
        required={false}
      >
      {getFieldDecorator('exo_type', {
        initialValue: { key: props.exoType },
        rules: [
          {
            required: false,
            message: "Please select exercice type",
          },
        ],
        })(
          <Select
            labelInValue
            placeholder="Select exercice type"
            onChange={onSelectType}
          >
            <Option value="missing_value">Missing values</Option>
            <Option value="qcmu">Multiple choice with one answer</Option>
            <Option value="qcm_multi">Multiple choice with several answers</Option>
            <Option value="boolean">True / False exercice</Option>
          </Select>
        )}
      </Form.Item>
      {!!props.exoType && <Icon
        className="dynamic-delete-button"
        type="plus-circle-o"
        style= {{ padding: '8px', marginTop: '40px' }}
        onClick={() => props.setSteps(props.steps+1)}
      />}
    </div>
  )
}

export default Form.create({ name: 'exo_type_select' })(ExoType);
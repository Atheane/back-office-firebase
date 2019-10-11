import React, { Fragment, useState } from 'react';
import { Form, Select, Icon, Button, Upload, Input } from 'antd';
import FileUploader from "react-firebase-file-uploader";

import './Exo.css';
import ImageUploader from './ImageUploader';

const { Option } = Select;

const DynamicType = (props) => {

  const onSelect = (e) => {
    props.setType(e.key);
  }

  const onChangeText = (e) => {
    props.setText(e.target.value);
  }

  const { getFieldDecorator } = props.form;


  const formItems = (
    <Form.Item
      label={ props.label || ''}
      style={{ textAlign: 'left'}}
      required={false}
    >
      {getFieldDecorator(props.id, {
        validateTrigger: 'onSubmit',
        rules: [
          {
            required: true,
            message: "Please select type",
          },
        ],
      })(
      <div style={{ display: 'flex', width: '100%'}} >
      {getFieldDecorator('type', {
        initialValue: !!props.type && { key: props.type } || '',
        rules: [{ required: true, message: 'Please select chapter!' }],
      })(
        <Select
          labelInValue
          placeholder="Select type"
          onChange={onSelect}
        >
          {props.types.includes("txt") ? <Option value="txt">Text</Option> : null}
          {props.types.includes("img") ? <Option value="img">Image</Option> : null}
          {props.types.includes("btn") ? <Option value="btn">Button</Option> : null}
          {props.types.includes("input") ? <Option value="input">Input</Option> : null}
        </Select>
      )}
      </div>
      )}
    </Form.Item>
  );
  return (
    <Fragment>
      {formItems}
      {(props.type === 'txt') && <Form.Item label="Text">
      {getFieldDecorator('txt', { initialValue: props.text || ''})(
        <Input.TextArea
          name='txt'
          type='text'
          placeholder="Text content"
          onChange={onChangeText}
        />
      )}
      </Form.Item>}
      {(props.type === 'img') && <ImageUploader img={{...props.img}} setImg={props.setImg} />}
      {(props.type === 'btn') && <Form.Item label="Button">
        {getFieldDecorator('btn')(
            <div>
              <Button>
                {props.buttonCnt}
              </Button>
              <Input
                name='btn'
                placeholder="Button content"
                onChange={(e) => props.setButtonCnt(e.target.value)}
              />
            </div>
        )}
      </Form.Item>}
      {(props.type === 'input') && <Form.Item label="Input">
        {getFieldDecorator('input')(
          <Input
            name='input'
            placeholder="Insert content"
            onChange={(e) => props.setInputCnt(e.target.value)}
          />
        )}
      </Form.Item>}
    </Fragment>
  );
}

export default Form.create({ name: 'static_form_item' })(DynamicType);
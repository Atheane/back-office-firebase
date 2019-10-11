import React, { Fragment, useState, useEffect } from 'react';
import { Form, Select, Icon, Button, Upload, Input } from 'antd';

import './Exo.css';

const { Option } = Select;

const DynamicType = (props) => {
  const [id, setId] = useState(0);
  const { form } = props;

  const remove = k => {
    setId(0);
    props.setType(null);
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 0) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  const add = () => {
    setId(1);
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id);
    // can use data-binding to set
    // important! notify form to detect changes
    if (id < 2) {
      form.setFieldsValue({
        keys: nextKeys,
      });
    }
    return null;
  };

  const onSelect = (e) => {
    props.setType(e.key);
  }

  const onChangeText = (e) => {
    props.setText(e.target.value);
  }

  const onChangeImg = ({ file: { originFileObj: img } }) => {
    props.setImg(img);
  }

  useEffect(() => {

  }, []);

  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const { getFieldDecorator, getFieldValue } = props.form;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };

  const file = {
    uid: '-1',
    name: 'xxx.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  };

  getFieldDecorator('keys', { initialValue: [] });
  const keys = getFieldValue('keys');
  const formItems = keys.map((k, index) => (
    <Form.Item
      // {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
      label={index === 0 ? props.label : ''}
      style={{ textAlign: 'left'}}
      required={false}
      key={k}
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
      <div style={{ display: 'flex'}} >
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
      {keys.length > 0 ? (
        <Icon
          className="dynamic-delete-button"
          type="minus-circle-o"
          style= {{ padding: '8px'}}
          onClick={() => remove(k)}
      />) : null }
      </div>
      )}
    </Form.Item>
  ));
  return (
    <Fragment>
      {formItems}
      {id === 0 && <Form.Item {...formItemLayoutWithOutLabel}>
        <Button type="dashed" onClick={add} style={{ width: '60%' }}>
          <Icon type="plus" /> {`Add ${props.label}`}
        </Button>
      </Form.Item>}
      {(props.type === 'txt' && id > 0 ) && <Form.Item label="Text">
      {getFieldDecorator('txt', 
          { initialValue: props.edit && props.text || ''}
        )(
        <Input.TextArea
          name='txt'
          type='text'
          placeholder="Text content"
          onChange={onChangeText}
        />
      )}
      </Form.Item>}
      {(props.type === 'img' && id > 0) && <Form.Item label="Image">
        {getFieldDecorator('upload', {
          valuePropName: 'fileList',
          getValueFromEvent: normFile
        })(
          <Upload 
            name="logo"
            action="/upload.do"
            listType="picture"
            onChange={onChangeImg}
            file={props.img}>
            <Button>
              <Icon type="upload" /> Click to upload
            </Button>
          </Upload>,
        )}
      </Form.Item>}
      {(props.type === 'btn' && id > 0) && <Form.Item label="Button">
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
      {(props.type === 'input' && id > 0) && <Form.Item label="Input">
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

export default Form.create({ name: 'dynamic_form_item' })(DynamicType);
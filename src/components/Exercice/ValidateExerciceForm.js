import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form, Checkbox, Select, Input } from 'antd';
import { navigate, Location } from "@reach/router"
import { compose } from 'recompose';

import { AuthUserContext } from '../../containers/Authentication';
import { withFirebase } from '../../data/context';
import * as ROUTES from '../../constants/routes';
import { canPublish } from '../../utils/rights';
import { dateString } from '../../utils/dateFormat';


const errorModal = (message) => {
  Modal.error({
    title: 'Error',
    content: message,
  });
}


const ValidateExerciceForm = (props) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [id, setId] = useState('');
  const [doc, setDoc] = useState(null);

  const authUser = useContext(AuthUserContext);

  useEffect(() => {
    const { firebase } = props;
    if (!!id) {
      firebase
        .exercice(id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setDoc(doc.data());
          } else {
            setError(`Firebase error: document with id ${id} not found`);
          }
        }).catch(error => {
          error && errorModal(error.message);
          setError({ error });
        });
        setLoading(false);
    }
  }, [id])

  const onSubmit = event => {
    event.preventDefault();
    const { form, firebase } = props;

    form.validateFields((errorObj, values) => {
      if (!errorObj) {
        firebase
          .exercice(id)
          .update({
            title: {
              fr: values.title
            },
            publishedAt: dateString(),
            available: values.available,
            discipline: values.discipline.label,
            grade: values.grade.label,
          })
          .then(() => {
            navigate(ROUTES.EXERCICES);
          })
          .catch(error => {
            error && errorModal(error.message);
            setError({ error });
          });
      } else {
        const errorMessage = Object.values(errorObj).map(error => error.errors[0].message).join(' ');
        setError({ error: errorMessage });
      }
    });
  }

  const { getFieldDecorator } = props.form;
  const { Option } = Select;

  return (
    <Location>
      { ({ location }) => {
        const params = location.pathname.split('/');
        const did = params[params.length-1];
        setId(did);

        return (<div>
          <h2> Validate Exercice </h2>
          <Form 
            onSubmit={onSubmit}
            style={{ width: '500px' }}
            >
            <Form.Item
              label={
                <span>
                  Exercice&nbsp;
                </span>
              }
            >
            {getFieldDecorator('title', {
              initialValue: !!doc ? doc.title.fr : '',
              rules: [{ required: true, message: 'Please select an exercice!' }],
            })(
              <Input
                name='title'
                type='text'
                placeholder="Les nombres premiers"
              />
            )}
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Disciplines&nbsp;
                </span>
              }
            >
            {getFieldDecorator('discipline', {
              rules: [{ required: true, message: 'Please input a discipline!' }],
            })(
              <Select
                labelInValue
                placeholder="Select discipline"
              >
                <Option value="chi">Chimie</Option>
                <Option value="eng">English</Option>
                <Option value="frc">French</Option>
                <Option value="geo">Geography</Option>
                <Option value="hst">History</Option>
                <Option value="mth">Mathematics</Option>
                <Option value="phy">Physics</Option>
                <Option value="svt">Biology</Option>
              </Select>
            )}
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Grade&nbsp;
                </span>
              }
            >
            {getFieldDecorator('grade', {
              rules: [{ required: true, message: 'Please input a grade!' }],
            })(
              <Select
                labelInValue
                placeholder="Select a grade"
              >
                <Option value="6th">6th</Option>
                <Option value="5th">5th</Option>
                <Option value="4th">4th</Option>
                <Option value="3rd">3rd</Option>
                <Option value="2nd">2nd</Option>
                <Option value="1st">1st</Option>
              </Select>
            )}
            </Form.Item>
            <Form.Item>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                {getFieldDecorator('available', {
                  valuePropName: 'checked',
                  initialValue: false,
                })(
                  <Checkbox
                    disabled={!canPublish(authUser)}
                  >
                    Publish in the mobile app
                  </Checkbox>
                )}
              </div>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                  Push
              </Button>
            </Form.Item>
          </Form>
        </div>)
      }}
    </Location>
    );
  }

export default compose(
  Form.create({ name: 'exercice_edit' }),
  withFirebase,
)(ValidateExerciceForm);

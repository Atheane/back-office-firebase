import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form, Select } from 'antd';
import { navigate } from "@reach/router"
import { compose } from 'recompose';

import { AuthUserContext } from '../../containers/Authentication';
import { withFirebase } from '../../data/context';

import * as ROUTES from '../../constants/routes';
import { DISCIPLINES } from '../../constants/data';

import { dateString } from '../../utils/dateFormat';
import { differenceDisciplines } from '../../utils/arrayOperations';
import { setColor, setOrder, setIcon } from '../../utils/disciplineHelper';

const errorModal = (message) => {
  Modal.error({
    title: 'Error',
    content: message,
  });
}

const NewDisciplineForm = (props) => {
  const { firebase } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [disciplines, setDisciplines] = useState([]);
  const authUser = useContext(AuthUserContext);

  useEffect(() => {
    const unsubscribe = firebase
    .disciplines()
    .onSnapshot(snapshot => {
      const disciplines = [];

      snapshot.forEach(doc =>
        disciplines.push({ ...doc.data(), did: doc.id }),
      );
      setDisciplines(differenceDisciplines(DISCIPLINES, disciplines.filter(disc => disc.source === 'back-office')));
      setLoading(false);
    });
  () => unsubscribe();
  }, []);

  const onChange = () => {
    const { form } = props;
    form.validateFields((errorObj, ...rest) => {
      console.log('errorObj', errorObj);
      console.log('values', rest);
    })
  }

  const onSubmit = event => {
    event.preventDefault();
    const { form, firebase } = props;

    form.validateFields((errorObj, values) => {
      console.log(authUser);
      if (!errorObj) {
        firebase
          .disciplines()
          .doc(values.title.key)
          .set({
            title: {
              fr: values.title.label
            },
            color: setColor(values.title.key),
            icon: setIcon(values.title.key),
            order: setOrder(values.title.key),
            userId: authUser.uid,
            createdAt: dateString(),
            available: false,
            source: 'back-office'
          })
          .then(() => {
            navigate(ROUTES.DISCIPLINES);
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
    <div>
      <h2> New Discipline </h2>
      <Form 
        onSubmit={onSubmit}
        style={{ width: '500px' }}
        >
        <Form.Item
          label={
            <span>
              Discipline&nbsp;
            </span>
          }
        >
        {getFieldDecorator('title', {
          rules: [{ required: true, message: 'Please select a discipline!' }],
        })(
          <Select
            labelInValue
            placeholder="Select a discipline"
            onChange={onChange}
          >
            {disciplines.map(disc => <Option value={disc.key}>{disc.label}</Option>)}
          </Select>
        )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default compose(
  Form.create({ name: 'discipline_new' }),
  withFirebase,
)(NewDisciplineForm);

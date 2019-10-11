import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form, Select, Input, InputNumber, Checkbox } from 'antd';
import { navigate } from "@reach/router"
import { compose } from 'recompose';

import { AuthUserContext } from '../../containers/Authentication';
import { withFirebase } from '../../data/context';
import * as ROUTES from '../../constants/routes';
import { GRADES } from '../../constants/data';
import { differenceGrades } from '../../utils/arrayOperations';
import { canPublish } from '../../utils/rights';
import { dateString } from '../../utils/dateFormat';
import { setOrder } from '../../utils/disciplineHelper';

const errorModal = (message) => {
  Modal.error({
    title: 'Error',
    content: message,
  });
}

const NewGradeForm = (props) => {

  const { form, firebase } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const authUser = useContext(AuthUserContext);
  const [disciplines, setDisciplines] = useState([]);
  const [disciplineRef, setDisciplineRef] = useState(null);
  const [order, setOrder] = useState(0);
  const [available, setAvailable] = useState(false);

  // show disciplines that were saved
  useEffect(() => {
    const unsubscribe = firebase
      .disciplines()
      .onSnapshot(snapshot => {
        const disciplines = [];

        snapshot.forEach(doc =>
          disciplines.push({ ...doc.data(), did: doc.id }),
        );
        setDisciplines(disciplines.filter(disc => disc.source === 'back-office'));
        setLoading(false);
      });
    () => unsubscribe();
  }, []);

  // select discipline to be associated to grade
  const selectDiscipline = (disciplines) => {
    let discRef = [];
    disciplines.forEach(disc => {
      const discipline = firebase.discipline(disc);
      discipline.get().then(doc => {
        if (!!doc && !!doc.data()) {
          discRef.push({
            available: doc.data().available,
            ref: discipline
          });
          setDisciplineRef(discRef);
        }
      }).catch(error => console.log(error));
    })
  }

  const onSubmit = event => {
    event.preventDefault();

    form.validateFields((errorObj, values) => {
      if (!errorObj) {
        console.log(values);
        firebase
          .grades()
          .doc(values.key)
          .set({
            title: {
              fr: values.title
            },
            userId: authUser.uid,
            createdAt: dateString(),
            disc: disciplineRef,
            order,
            available,
            source: 'back-office'
          })
          .then(() => {
            navigate(ROUTES.GRADES);
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

  const { getFieldDecorator } = form;
  const { Option } = Select;

  return (
    <div>
      <h2> New Grade </h2>
      <Form 
        onSubmit={onSubmit}
        style={{ width: '500px' }}
        >
        <Form.Item
          label={
            <span>
              Grade key&nbsp;
            </span>
          }
        >
        {getFieldDecorator('key', {
          rules: [{ required: true, message: 'Please input a grade key!' }],
        })(
          <Input
            name='key'
            type='text'
            placeholder="6th"
          />
        )}
        </Form.Item>
        <Form.Item
          label={
            <span>
              Grade title&nbsp;
            </span>
          }
        >
        {getFieldDecorator('title', {
          rules: [{ required: true, message: 'Please input a grade title!' }],
        })(
          <Input
            name='title'
            type='text'
            placeholder="Sixième"
          />
        )}
        </Form.Item>
        <Form.Item
          label={
            <span>
              Order&nbsp;
            </span>
          }
        >
        {getFieldDecorator('order', {
          initialValue: 1,
          rules: [{ required: true, message: 'Please input order grade will appear in app' }],
        })(
          <InputNumber min={0} onChange={(e) => {
            console.log(e);
            setOrder(e)
          }}/>
        )}
        </Form.Item>
        <Form.Item
          label={
            <span>
              Available&nbsp;
            </span>
          }
        >
        {getFieldDecorator('available', {
          rules: [{ required: false }],
        })(
            <Checkbox onChange={(e) => setAvailable(e.target.checked)}>Available in mobile app?</Checkbox>)}
        </Form.Item>
        <Form.Item
          label={
            <span>
              Disciplines&nbsp;
            </span>
          }
        >
        {getFieldDecorator('disciplines', {
        })(
          <Select
            mode="multiple"
            placeholder="Select disciplines"
            onChange={selectDiscipline}
          >
          {disciplines.map(discipline => 
            <Option value={discipline.did}>{discipline.title.fr}</Option>)}
          </Select>
        )}
        </Form.Item>
        <Form.Item>
          <div style={{ marginTop: '300px' }}>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default compose(
  Form.create({ name: 'grade_new' }),
  withFirebase,
)(NewGradeForm);

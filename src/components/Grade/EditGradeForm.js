import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form, Select, Input, InputNumber, Checkbox } from 'antd';
import { navigate, Location } from "@reach/router"
import { compose } from 'recompose';

import { AuthUserContext } from '../../containers/Authentication';
import { withFirebase } from '../../data/context';
import * as ROUTES from '../../constants/routes';
import { dateString } from '../../utils/dateFormat';


const errorModal = (message) => {
  Modal.error({
    title: 'Error',
    content: message,
  });
}


const EditGradeForm = (props) => {

  const { firebase } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [id, setId] = useState('');
  const [doc, setDoc] = useState(null);
  const [disciplines, setDisciplines] = useState([]);
  const [disciplineRef, setDisciplineRef] = useState(null);
  const [gradeDisciplines, setGradeDisciplines] = useState([]);
  const [order, setOrder] = useState(0);
  const [available, setAvailable] = useState(false);
  // const authUser = useContext(AuthUserContext);

  // show disciplines that were associated to grade in the first place
  useEffect(() => {
    if (!!id) {
      firebase
        .grade(id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setDoc(doc.data());
            setAvailable(doc.data().available);
            setOrder(doc.data().order);
            const disciplinesRefs = doc.data().disc;
            setDisciplineRef(disciplinesRefs);
            const gradeDisc = [];
            if (!!disciplinesRefs) {
              disciplinesRefs.forEach(d => {
                gradeDisc.push(d.ref.path.split('/')[1]);
                setGradeDisciplines(gradeDisc);
              });
            }
          } else {
            setError(`Firebase error: document with id ${id} not found`);
          }
        }).catch(error => {
          error && errorModal(error.message);
          setError({ error });
        });
        setLoading(false);
    }
  }, [id]);

  // show all disciplines that were saved
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
    const { form, firebase } = props;

    form.validateFields((errorObj, values) => {
      if (!errorObj) {
        firebase
          .grade(id)
          .update({
            updatedAt: dateString(),
            disc: disciplineRef,
            order: order || !!doc && !!doc.order && doc.order,
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

  const { getFieldDecorator } = props.form;
  const { Option } = Select;

  return (
    <Location>
      { ({ location }) => {
        const params = location.pathname.split('/');
        const did = params[params.length-1];
        setId(did);

        return console.log(doc) || (<div>
          <h2> Edit Grade </h2>
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
              initialValue: id,
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
              initialValue: !!doc && !!doc.title && !!doc.title.fr ? doc.title.fr : undefined,
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
              initialValue: order,
              rules: [{ required: true, message: 'Please input order grade will appear in app' }],
            })(
              <InputNumber min={0} onChange={(e) => {
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
            {<Checkbox
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}>
                Available in mobile app?
              </Checkbox>}
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Disciplines&nbsp;
                </span>
              }
            >
            {getFieldDecorator('disciplines', {
              initialValue: gradeDisciplines,
            })(
              <Select
                mode="multiple"
                placeholder="Select disciplines"
                onChange={selectDiscipline}
              >
                {!!disciplines.length && disciplines.map((disc) => <Option value={disc.did}>{disc.title.fr}</Option>)}
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
        </div>)
      }}
    </Location>
    );
  }

export default compose(
  Form.create({ name: 'grade_edit' }),
  withFirebase,
)(EditGradeForm);

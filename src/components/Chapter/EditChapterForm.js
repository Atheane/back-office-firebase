import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form, Rate, Select, Input } from 'antd';
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


const EditChapterForm = (props) => {

  const { form, firebase } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const authUser = useContext(AuthUserContext);
  const [disciplines, setDisciplines] = useState([]);
  const [disciplineRef, setDisciplineRef] = useState(null);
  const [grades, setGrades] = useState([]);
  const [gradeRef, setGradeRef] = useState(null);
  const [id, setId] = useState('');
  const [doc, setDoc] = useState(null);
  const [discipline, setDiscipline] = useState('');
  const [grade, setGrade] = useState('');

  // get chapter data
  useEffect(() => {
    const { firebase } = props;
    if (!!id) {
      firebase
        .chapter(id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setGrade({ key: doc.data().grade.id });
            setGradeRef(doc.data().grade);
            setDiscipline({ key: doc.data().disc.id });
            setDisciplineRef(doc.data().disc);
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
  }, [id]);

  // get grades list
  useEffect(() => {
    const unsubscribe = firebase
      .grades()
      .onSnapshot(snapshot => {
        const grades = [];

        snapshot.forEach(doc =>
          grades.push({ ...doc.data(), gid: doc.id }),
        );
        setGrades(grades.filter(grade => grade.source === 'back-office'));
        setLoading(false);
      });
    () => unsubscribe();
  }, []);

  // get discipline list
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

  const selectDiscipline = ({ key: did }) => {
    const disc = firebase.discipline(did);
    setDisciplineRef(disc);
  }

  const selectGrade = ({ key: gid }) => {
    console.log(gid);
    const grade = firebase.grade(gid);
    setGradeRef(grade);
  }

  const onSubmit = event => {
    event.preventDefault();
    form.validateFields((errorObj, values) => {
      if (!errorObj) {
        firebase
          .chapter(id)
          .update({
            title: {
              fr: values.title
            },
            updatedAt: dateString(),
            disc: disciplineRef,
            grade: gradeRef,
            lvls: values.lvls,
            available: false,
            source: 'back-office'
          })
          .then(() => {
            navigate(ROUTES.CHAPTERS);
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

        return (
          <div>
            <h2> Edit Chapter </h2>
            <Form 
              onSubmit={onSubmit}
              style={{ width: '500px' }}
              >
              <Form.Item
                label={
                  <span>
                    Chapter&nbsp;
                  </span>
                }
              >
              {getFieldDecorator('title', {
                initialValue: !!doc && doc.title.fr || '',
                rules: [{ required: true, message: 'Please input a chapter!' }],
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
                    Levels&nbsp;
                  </span>
                }
              >
              {getFieldDecorator('lvls', {
                initialValue: !!doc && doc.lvls,
                rules: [{ required: true, message: 'Please input level' }],
              })(
                <Rate />
              )}
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    Discipline&nbsp;
                  </span>
                }
              >
              {getFieldDecorator('discipline', {
                initialValue: discipline,
                rules: [{ required: true, message: 'Please input a discipline!' }],
              })(
                <Select
                  labelInValue
                  placeholder="Select discipline"
                  onChange={selectDiscipline}
                >
                  {disciplines.map(discipline => 
                    <Option value={discipline.did}>{discipline.title.fr}</Option>)}
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
                initialValue: grade,
                rules: [{ required: true, message: 'Please input a grade!' }],
              })(
                <Select
                  labelInValue
                  placeholder="Select a grade"
                  onChange={selectGrade}
                >
                  {grades.map(grade => 
                    <Option value={grade.gid}>{grade.title.fr}</Option>)}
                </Select>
              )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Form>
          </div>);
    }}
  </Location>
  );
}

export default compose(
  Form.create({ name: 'chapter_edit' }),
  withFirebase,
)(EditChapterForm);

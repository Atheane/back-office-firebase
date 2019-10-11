import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form, Rate, Select, Input } from 'antd';
import { navigate } from "@reach/router"
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


const NewChapterForm = (props) => {

  const { form, firebase } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const authUser = useContext(AuthUserContext);
  const [disciplines, setDisciplines] = useState([]);
  const [disciplineRef, setDisciplineRef] = useState(null);
  const [grades, setGrades] = useState([]);
  const [gradeRef, setGradeRef] = useState(null);

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
      console.log()
      if (!errorObj) {
        firebase
          .chapters()
          .add({
            title: {
              fr: values.title
            },
            userId: authUser.uid,
            createdAt: dateString(),
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
    <div>
      <h2> New Chapter </h2>
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
    </div>
  );
}

export default compose(
  Form.create({ name: 'chapter_new' }),
  withFirebase,
)(NewChapterForm);

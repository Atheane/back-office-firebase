import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form, Select, Input, Rate, Row, Col } from 'antd';
import { navigate } from "@reach/router"
import { compose } from 'recompose';

import { AuthUserContext } from '../../containers/Authentication';
import { withFirebase } from '../../data/context';
import * as ROUTES from '../../constants/routes';
import { dateString } from '../../utils/dateFormat';
import WordingExercice from './WordingExercice';
import ExoType from './ExoType';
import TrueFalseList from './TrueFalseList';
import QcmOneList from './QcmOneList';
import QcmMultiList from './QcmMultiList';
import MissingValuesList from './MissingValuesList';
import Preview from './Preview';

const errorModal = (message) => {
  Modal.error({
    title: 'Error',
    content: message,
  });
}

const NewExerciceForm = (props) => {

  const component = 'NewExerciceForm';
  const { form, firebase } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wording, setWording] = useState({});
  const [exoType, setExoType] = useState('');
  const [ex, setEx] = useState([{}]);
  const [steps, setSteps] = useState(1);
  const [chapters, setChapters] = useState([]);
  const [chapterRef, setChapterRef] = useState(null);
  const [edited, setEdited] = useState(false);
  const [disciplines, setDisciplines] = useState(null);
  const [grades, setGrades] = useState(null);
  const [gradeId, setGradeId] = useState(null);
  const [disciplineId, setDisciplineId] = useState(null);

  const authUser = useContext(AuthUserContext);

  useEffect(() => {
    if (!!error) {
      errorModal(`Component: ${component}, Error: ${error.message}, Index: ${error.index}`);
    }
  }, [error]);

  // list of grades
  useEffect(() => {
    const unsubscribe = firebase
      .grades()
      .onSnapshot(snapshot => {
        const grades = [];
        snapshot.forEach(doc =>
          grades.push({ ...doc.data(), cid: doc.id }),
        );
        setGrades(grades.filter(grade => grade.source === 'back-office'));
        setLoading(false);
      });
    () => unsubscribe();
  }, []);

    // list of disciplines
    useEffect(() => {
      const unsubscribe = firebase
        .disciplines()
        .onSnapshot(snapshot => {
          const disc = [];
          snapshot.forEach(doc =>
            disc.push({ ...doc.data(), cid: doc.id }),
          );
          setDisciplines(disc.filter(disc => disc.source === 'back-office'));
          setLoading(false);
        });
      () => unsubscribe();
    }, []);

  // list of chapters
  useEffect(() => {
    const unsubscribe = firebase
      .chapters()
      .onSnapshot(snapshot => {
        const chapters = [];
        snapshot.forEach(doc =>
          chapters.push({ ...doc.data(), cid: doc.id }),
        );
        setChapters(chapters.filter(chap => chap.source === 'back-office'));
        setLoading(false);
      });
    () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("should update preview");
  }, [ex])

  const selectChapter = ({ key: cid }) => {
    const chap = firebase.chapter(cid);
    setChapterRef(chap);
  }

  const onSubmit = event => {
    event.preventDefault();

    form.validateFields((errorObj, values) => {
      if (!errorObj) {
        const exClean = ex.map(step => {
          delete step.key;
          return step
        });
        const res = {
          userId: authUser.uid,
          createdAt: dateString(),
          chapter: chapterRef,
          lvl: values.lvl,
          title: {
            fr: values.title
          },
          ex: {
            steps: ex
          },
          available: false,
          source: 'back-office'
        };
        if (!!wording && !!wording.cnt) res.wording = [wording];
        firebase
          .exercices()
          .add({...res})
          .then(() => {
            navigate(ROUTES.EXERCICES);
          })
          .catch(error => setError({ message: error, index: 'line93'}));
      } else {
        const message = Object.values(errorObj).map(error => error.errors[0].message).join(' ');
        setError({ message, index: 'line96'});
      }
    });
  }

  const { getFieldDecorator } = props.form;
  const { Option } = Select;

  return (
    <div>
      <Row gutter={16}> 
        <Col md={12} xs={24}>
          <h2> New Exercice </h2>
          <Form 
            onSubmit={onSubmit}
            style={{ width: '500px' }}
          >
            <Form.Item label={<span>Filter chapter by grade&nbsp;</span>}>
              <Select
                labelInValue
                placeholder="Select grade"
                onChange={(e) => {
                  console.log(e);
                  setGradeId(e.key);
                }}
              >
              {grades && grades.length && grades.map(grade => (
                <Option key={grade.cid} value={grade.cid}  >{grade.title.fr}</Option>
              ))}
              </Select>
            </Form.Item>

            <Form.Item label={<span>Filter chapter by discipline&nbsp;</span>}>
              <Select
                labelInValue
                placeholder="Select discipline"
                onChange={(e) => {
                  console.log(e);
                  setDisciplineId(e.key);
                }}              >
              {disciplines && disciplines.length && disciplines.map(disc => (
                <Option key={disc.cid} value={disc.cid}  >{disc.title.fr}</Option>
              ))}
              </Select>
            </Form.Item>

            <Form.Item label={<span>Chapter&nbsp;</span>}>
            {getFieldDecorator('chapter', {
              rules: [{ required: true, message: 'Please select chapter!' }],
            })(
              <Select
                labelInValue
                placeholder="Select chapter"
                onChange={selectChapter}
              >
              {chapters
                .filter(chapter => chapter.grade.id === gradeId && chapter.disc.id === disciplineId)
                .map(chapter => (
                <Option key={chapter.cid} value={chapter.cid}  >{chapter.title.fr}</Option>
              ))}
              </Select>
            )}
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Level&nbsp;
                </span>
              }
            >
            {getFieldDecorator('lvl', {
              rules: [{ required: true, message: 'Please input level' }],
            })(
              <Rate />
            )}
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Title&nbsp;
                </span>
              }
            >
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please input title!' }],
            })(
              <Input
                name='title'
                type='text'
                placeholder="Les nombres premiers"
              />
            )}
            </Form.Item>

            {/* Wording */}
            <WordingExercice
              wording={wording}
              setWording={setWording}
              edited={edited}
              setEdited={setEdited}
            />

            {/* Select Exercice Type */}
            <ExoType
              exoType={exoType}
              setExoType={setExoType}
              steps={steps}
              setSteps={setSteps}
            />

            {/* Exercice Content */}
            {exoType === 'missing_value' && <MissingValuesList
              ex={ex}
              setEx={setEx}
              steps={steps}
              setSteps={setSteps}
            />}
            {exoType === 'boolean' && <TrueFalseList
              ex={ex}
              setEx={setEx}
              steps={steps}
              setSteps={setSteps}
            />}
            {exoType === 'qcmu' && <QcmOneList
              ex={ex}
              setEx={setEx}
              steps={steps}
              setSteps={setSteps}
            />}
            {exoType === 'qcm_multi' && <QcmMultiList
              ex={ex}
              setEx={setEx}
              steps={steps}
              setSteps={setSteps}
            />}

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
          </Col>
          <Col md={12} xs={24}>
            <Preview ex={ex} />
          </Col>
      </Row>
    </div>
  );
}

export default compose(
  Form.create({ name: 'exercice_new' }),
  withFirebase,
)(NewExerciceForm);

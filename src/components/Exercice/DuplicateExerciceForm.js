import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form, Select, Input, Rate, Row, Col } from 'antd';
import { navigate, Location } from "@reach/router"
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

const DuplicateExerciceForm = (props) => {

  const component = 'DuplicateExerciceForm';
  const { form, firebase } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wording, setWording] = useState(null);
  const [exoType, setExoType] = useState('');
  const [steps, setSteps] = useState(1);
  const [ex, setEx] = useState([{}]);
  const [oldEx, setOldEx] = useState([{}]);

  const [chapters, setChapters] = useState([]);
  const [chapterRef, setChapterRef] = useState(null);
  const [chapter, setChapter] = useState({});
  const [id, setId] = useState('');
  const [doc, setDoc] = useState({});
  const [edited, setEdited] = useState(false);

  const [disciplines, setDisciplines] = useState(null);
  const [grades, setGrades] = useState(null);
  const [grade, setGrade] = useState(null);
  const [discipline, setDiscipline] = useState(null);

  const authUser = useContext(AuthUserContext);

  useEffect(() => {
    if (!!error) {
      console.log(`Component: ${component}, Error: ${error.message}, Index: ${error.index}`);
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
            setDisciplines(disc.filter(d => d.source === 'back-office'));
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

  // all edit data
  useEffect(() => {
    const { firebase } = props;
    if (!!id) {
      firebase
        .exercice(id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setChapter({ key: doc.data().chapter.id });
            setChapterRef(doc.data().chapter);
            firebase
              .chapter(doc.data().chapter.id)
              .get()
              .then((chap) => {
                const gradeId = chap.data().grade.id;
                const disciplineId = chap.data().disc.id;
                setGrade({ key: gradeId });
                setDiscipline({ key: disciplineId })
              })
            setDoc({...doc.data()});
            if (!!doc && !!doc.data().wording && !!doc.data().wording.length) {
              setWording(doc.data().wording[0]);
            }
            if (!!doc.data() && !!doc.data().ex && !!doc.data().ex.steps && !!doc.data().ex.steps.length) {
              setExoType(doc.data().ex.steps[0].type);
            }
            if (!!doc.data() && !!doc.data().ex && !!doc.data().ex.steps && !!doc.data().ex.steps.length) {
              setSteps(doc.data().ex.steps.length);
            }
            if (!!doc.data() && !!doc.data().ex) {
              // const exWithNewKey = changeKey(doc.data().ex.steps);
              // setEx(exWithNewKey);
              setOldEx(doc.data().ex.steps);
              setEx(doc.data().ex.steps);
            }
          } else {
            setError({ message: `Firebase error: document with id ${id} not found`, index: 'line69'})
          }
        }).catch(error => setError({message: error, index: 'line71' }));
        setLoading(false);
    }
  }, [id]);

  const selectChapter = ({ key: cid }) => {
    const chap = firebase.chapter(cid);
    setChapterRef(chap);
  }

  const onSubmit = event => {
    event.preventDefault();

    form.validateFields((errorObj, values) => {
      if (!errorObj) {

        const res = {
          userId: authUser,
          createdAt: dateString(),
          chapter: chapterRef,
          lvl: values.lvl,
          title: {
            fr: values.title
          },
          ex: {
            steps: [...ex]
          },
          source: 'back-office'
        };
        if (!!wording && !!wording.cnt) res.wording = [wording];
        firebase
          .exercices()
          .add({...res})
          .then(() => {
            navigate(ROUTES.EXERCICES);
          })
          .catch(error => {
            setError({ message: error, index: 'line130' });
          });
      } else {
        const errorMessage = Object.values(errorObj).map(error => error.errors[0].message).join(' ');
        setError({ message: errorMessage, index: 'line134' });
      }
    });
  }

  const { getFieldDecorator } = props.form;
  const { Option } = Select;

  return (
    <Location>
      { ({ location }) => {
        const params = location.pathname.split('/');
        const eid = params[params.length-1];
        setId(eid);
        return (
          <div>
            <Row gutter={16}> 
              <Col md={12} xs={24}>

            <h2> Duplicate Exercice </h2>
            <Form 
              onSubmit={onSubmit}
              style={{ width: '500px' }}
              >
               <Form.Item label={<span>Filter chapter by grade&nbsp;</span>}>
               {getFieldDecorator('grade', {
                  initialValue: grade ? grade : undefined
                })(<Select
                    labelInValue
                    placeholder="Select grade"
                    onChange={(e) => {
                      setGrade(e);
                    }}
                  >
                  {grades && grades.length && grades.map(grade => (
                    <Option key={grade.cid} value={grade.cid}>{grade.title.fr}</Option>
                  ))}
                  </Select>)}
              </Form.Item>

              <Form.Item label={<span>Filter chapter by discipline&nbsp;</span>}>
              {getFieldDecorator('disc', {
                initialValue: discipline ? discipline : undefined
              })(<Select
                  labelInValue
                  placeholder="Select discipline"
                  onChange={(e) => {
                    setDiscipline(e);
                  }}              >
                {disciplines && disciplines.length && disciplines.map(disc => (
                  <Option key={disc.cid} value={disc.cid}  >{disc.title.fr}</Option>
                ))}
                </Select>)}
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    Chapter&nbsp;
                  </span>
                }
              >
              {getFieldDecorator('chapter', {
                initialValue: chapter,
                rules: [{ required: true, message: 'Please select chapter!' }],
              })(
                <Select
                  labelInValue
                  placeholder="Select chapter"
                  onChange={selectChapter}
                >
                {chapters.map(chapter => (
                  <Option key={chapter.cid} value={chapter.cid}>{chapter.title.fr}</Option>
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
                initialValue: doc.lvl,
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
                initialValue: !!doc && !!doc.title && doc.title.fr || '',
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
              {<ExoType
                exoType={exoType}
                setExoType={setExoType}
                steps={steps}
                setSteps={setSteps}
              />}

              {/* Exercice Content */}
              {exoType === 'missing_value' && <MissingValuesList
                ex={ex}
                setEx={setEx}
                steps={steps}
                setSteps={setSteps}
                edit
              />}
              {exoType === 'boolean' && <TrueFalseList
                ex={ex}
                setEx={setEx}
                steps={steps}
                setSteps={setSteps}
                edit
              />}
              {exoType === 'qcmu' && <QcmOneList
                ex={ex}
                setEx={setEx}
                steps={steps}
                setSteps={setSteps}
                edit
              />}
              {exoType === 'qcm_multi' && <QcmMultiList
                ex={ex}
                setEx={setEx}
                steps={steps}
                setSteps={setSteps}
                edit
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
      </div>);
    }}
  </Location>
  );
}

export default compose(
  Form.create({ name: 'exercice_duplicate' }),
  withFirebase,
)(DuplicateExerciceForm);
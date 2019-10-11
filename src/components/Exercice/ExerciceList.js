import React, { useState, useEffect, useContext } from 'react';
import { Table, Divider, Button, Tag, Modal } from 'antd';
import { navigate } from "@reach/router"

import { AuthUserContext } from '../../containers/Authentication';
import { withFirebase } from '../../data/context';
import * as ROUTES from '../../constants/routes';
import { canCreate, canEdit, canDelete, canPublish, canDuplicate } from '../../utils/rights';
import { dateString, toTimestamp } from '../../utils/dateFormat';


function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
};

const errorModal = (message) => {
  Modal.error({
    title: 'Error',
    content: message,
  });
};

const ExerciceList = (props) => {

  const { firebase } = props;
  const [loading, setLoading] = useState(true);
  const [exercices, setExercices] = useState([]);
  const [eid, setExerciceId] = useState(null);
  const [showDeleteModal, setDeleteModal] = useState('');
  const [showPublishModal, setPublishModal] = useState('');
  const [error, setError] = useState('');

  const authUser = useContext(AuthUserContext);

  useEffect(() => {
    const unsubscribe = firebase
      .exercices()
      .onSnapshot(snapshot => {
          const exercices = [];
          snapshot.forEach(doc => {
            const exercice = doc.data();
            firebase.user(doc.data().userId).get().then(user => {
              firebase.chapter(exercice.chapter.id).get().then(
                chap => {
                  const gradeId = chap.data().grade.id;
                  const discId = chap.data().disc.id;
                  firebase.grade(gradeId).get()
                    .then((grade) => {
                      firebase.discipline(discId).get()
                        .then((disc) => {
                          exercice.disc = disc.data().title.fr;
                          exercice.grade = grade.data().title.fr;
                          exercice.chapter = chap.data().title.fr;
                          exercices.push({ ...exercice, eid: doc.id, author: user.data() && user.data().email });
                          const filteredExercices = exercices && exercices.filter(exo => exo.source === 'back-office');
                          const sortedExercices = filteredExercices.sort((a , b) => {
                            return toTimestamp(b.createdAt) - toTimestamp(a.createdAt);
                          })
                          setExercices([...sortedExercices]);
                        }).catch(error => {
                          error && errorModal(error.message);
                          setError({ error });
                        });
                    }).catch(error => {
                    error && errorModal(error.message);
                    setError({ error });
                  });
                }
              ).catch(error => {
                error && errorModal(error.message);
                setError({ error });
              });
            })
          });
          setExercices([...exercices]);
        setLoading(false);
      });
    () => unsubscribe();
  }, []);

  const addEntry = () => {
    navigate(ROUTES.EXERCICE_NEW);
  }

  const onEdit = (eid) => {
    navigate(`${ROUTES.EXERCICE_EDIT}/${eid}`);
  }

  const onDuplicate = (eid) => {
    navigate(`${ROUTES.EXERCICE_DUPLICATE}/${eid}`);
  }

  const onDeleteClick = (id) => {
    setExerciceId(id);
    setDeleteModal(`You are going to DELETE exercise with id ${id}, do you confirm?`);
  }

  const deleteService = () => {
    firebase.exercice(eid).delete();
    setDeleteModal('');
  }

  const onPublishClick = (id) => {
    setExerciceId(id);
    setPublishModal(`You are going to PUBLISH exercise with id ${id}, do you confirm?`)
  }

  const publishService = () => {
    firebase
      .exercice(eid)
      .update({
        available: true,
        publishedAt: dateString(),
      })
      .then(() => {
        navigate(ROUTES.EXERCICES);
        setPublishModal('')
      })
      .catch(error => {
        error && errorModal(error.message);
        setError({ error });
      });
  }

  const filtersChapter = (!!exercices && exercices.length) ? [... new Set(exercices.map(exo => exo.chapter))].map(chap => ({ text: chap, value: chap })) : [];
  const filtersGrade = (!!exercices && exercices.length) ? [... new Set(exercices.map(exo => exo.grade))].map(grade => ({ text: grade, value: grade })) : [];
  const filtersDisc = (!!exercices && exercices.length) ? [... new Set(exercices.map(exo => exo.disc))].map(disc => ({ text: disc, value: disc })) : [];

  const data = !!exercices && exercices.map(exercice => ({
    available: exercice.available,
    eid: exercice.eid,
    disc: exercice.disc,
    grade: exercice.grade,
    chapter: exercice.chapter,
    createdAt: exercice.createdAt,
    lvl: exercice.lvl,
    title: exercice.title.fr,
    author: exercice.author,
  }));
  const keys = (!!data && data.length > 0) ? Object.keys(data[0]) : [];
  const columns = [...keys.splice(1).map(k => {
    if (k === 'userId') {
      return {
        title: 'User',
        dataIndex: k,
        key: k,
        render: (text, record) => record.author
      }
    }
    if (k === 'chapter') { 
      return  {
        title: 'Chapter',
        key: 'chapter',
        filters: filtersChapter,
        onFilter: (value, record) => record.chapter.includes(value),
        render: (text, record) => record.chapter
      }
    }
    if (k === 'grade') { 
      return  {
        title: 'Grade',
        key: 'grade',
        filters: filtersGrade,
        onFilter: (value, record) => record.grade.includes(value),
        render: (text, record) => record.grade
      }
    }
    if (k === 'disc') { 
      return  {
        title: 'Discipline',
        key: 'disc',
        filters: filtersDisc,
        onFilter: (value, record) => record.disc.includes(value),
        render: (text, record) => record.disc
      }
    }  
    return {
      title: toTitleCase(k),
      dataIndex: k,
      key: k
    }
  }),
  {
    title: 'Status',
    key: 'status',
    render: (text, record) => (record.available) ? <Tag color='green'>
      Published
    </Tag> : <Tag color='blue'>
      Draft
    </Tag>
  },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) =>  (<span>
          {canEdit(authUser, record.userId) && <a href="javascript:;" onClick={() => onEdit(record.eid)}>Edit</a>}
          {canEdit(authUser, record.userId) && <Divider type="vertical" />}
          {canDuplicate(authUser) && <a href="javascript:;" onClick={() => onDuplicate(record.eid)}>Duplicate</a>}
          {canDuplicate(authUser) && <Divider type="vertical" />}
          {canDelete(authUser, record.userId) && <a href="javascript:;" onClick={() => onDeleteClick(record.eid)}>Delete</a>}
          {canDelete(authUser, record.userId) && <Divider type="vertical" />}
          {!record.available && canPublish(authUser) && <a href="javascript:;" onClick={() => onPublishClick(record.eid)}>Publish</a>}
        </span>)
    }];
    return (
      <div  style={{ overflowX: 'auto', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Exercices</h2>
          {canCreate(authUser) && <Button type='primary' onClick={addEntry}> + Add Exercice</Button>}
        </div>
        {loading && <div>Loading ...</div>}
        <Modal
          visible={!!showDeleteModal}
          onOk={deleteService}
          onCancel={() => setDeleteModal('')}
      >
        <p> {showDeleteModal} </p>
        </Modal>
        <Modal
            visible={!!showPublishModal}
            onOk={publishService}
            onCancel={() => setPublishModal('')}
        >
          <p> {showPublishModal} </p>
        </Modal>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="eid"
        />
      </div>
    );
  }

export default withFirebase(ExerciceList);
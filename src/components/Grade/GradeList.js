import React, { useState, useEffect, useContext } from 'react';
import { Table, Divider, Button, Tag, Modal } from 'antd';
import { navigate } from "@reach/router"

import { AuthUserContext } from '../../containers/Authentication';
import { withFirebase } from '../../data/context';
import * as ROUTES from '../../constants/routes';
import { canCreate, canEdit, canDelete, canPublish } from '../../utils/rights';
import { setColor, setTitle } from '../../utils/disciplineHelper';
import { dateString } from '../../utils/dateFormat';


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
}

const GradeList = (props) => {

  const { firebase } = props;
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState([]);
  const [gid, setGradeId] = useState(null);
  const [showDeleteModal, setDeleteModal] = useState('');
  const [showPublishModal, setPublishModal] = useState('');

  const authUser = useContext(AuthUserContext);

  useEffect(() => {

    const unsubscribe = firebase
      .grades()
      .onSnapshot(snapshot => {
        const grades = [];
        snapshot.forEach(doc => {
          firebase.user(doc.data().userId).get().then((user) => {
            grades.push({ ...doc.data(), did: doc.id, author: user.data() && user.data().email });
            setGrades(grades.filter(grade => grade.source === 'back-office'));
          }).catch(error => {
            error && errorModal(error.message);
            setError({ error });
          });
        });
        setLoading(false);
      });
    () => unsubscribe();
  }, []);

  const addEntry = () => {
    navigate(ROUTES.GRADE_NEW);
  }

  const onEdit = (id) => {
    navigate(`${ROUTES.GRADE_EDIT}/${id}`);
  }

  const onDeleteClick = (id) => {
    setGradeId(id);
    setDeleteModal(`You are going to DELETE grade with id ${id}, do you confirm?`);
  }

  const deleteService = () => {
    firebase.grade(gid).delete();
    setDeleteModal('');
  }

  const onPublishClick = (id) => {
    setGradeId(id);
    setPublishModal(`You are going to PUBLISH grade with id ${id}, do you confirm?`)
  }

  const publishService = () => {
    firebase
      .grade(gid)
      .update({
        available: true,
        publishedAt: dateString(),
      })
      .then(() => {
        navigate(ROUTES.GRADES);
        setPublishModal('')
      })
      .catch(error => {
        error && errorModal(error.message);
        setError({ error });
      });
  }

  const data = !!grades && grades.map(grade => ({
    did: grade.did,
    createdAt: grade.createdAt,
    disc: grade.disc,
    title: grade.title.fr,
    author: grade.author,
    available: grade.available
  }));
  const keys = (!!data && data.length > 0) ? Object.keys(data[0]) : [];
  const columns = [...keys.map(k => {
    if (k === 'userId') {
      return {
        title: 'User',
        dataIndex: k,
        key: k,
        render: (text, record) => record.userId.email
      }
    }
    if (k === 'disc') {
      return  {
        title: 'Disciplines',
        key: 'disciplines',
        render: (text, record) => !!record.disc && record.disc.map(disc => 
          <Tag color={setColor(disc.ref.id)} style={{ margin: '4px'}}>
            {setTitle(disc.ref.id)}
          </Tag>),
      }
    }
    if (k === 'available') {
      return {};
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
    render: (text, record) => console.log(record) || (<span>
      {canEdit(authUser, record.userId) && <a href="javascript:;" onClick={() => onEdit(record.did)}>Edit</a>}
      {canEdit(authUser, record.userId) && <Divider type="vertical" />}
      {canDelete(authUser, record.userId) && <a href="javascript:;" onClick={() => onDeleteClick(record.did)}>Delete</a>}
      {canDelete(authUser, record.userId) && <Divider type="vertical" />}
      {!record.available && canPublish(authUser) && <a href="javascript:;" onClick={() => onPublishClick(record.did)}>Publish</a>}
    </span>)
  }];
    return (
      <div  style={{ overflowX: 'auto', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Grades</h2>
          {canCreate(authUser) && <Button type='primary' onClick={addEntry}> + Add Grade</Button>}
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
          rowKey="did"
          // rowSelection={{ type: 'checkbox'}}
        />
      </div>
    );
  }

export default withFirebase(GradeList);
import React, { useState, useEffect, useContext } from 'react';
import { Table, Divider, Button, Tag, Modal } from 'antd';
import { navigate } from "@reach/router"

import { AuthUserContext } from '../../containers/Authentication';
import { withFirebase } from '../../data/context';
import * as ROUTES from '../../constants/routes';
import { canCreate, canDelete, canPublish, canEdit } from '../../utils/rights';
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

const DisciplineList = (props) => {

  const { firebase } = props;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [disciplines, setDisciplines] = useState([]);
  const [did, setDisciplineId] = useState(null);
  const [showDeleteModal, setDeleteModal] = useState('');
  const [showPublishModal, setPublishModal] = useState('');

  const authUser = useContext(AuthUserContext);

  useEffect(() => {
    const unsubscribe = firebase
      .disciplines()
      .onSnapshot(snapshot => {
        const disciplines = [];
        snapshot.forEach(doc => {
          firebase.user(doc.data().userId).get().then(user => {
            disciplines.push({ ...doc.data(), did: doc.id, author: user.data() && user.data().email });
            setDisciplines(disciplines.filter(disc => disc.source === 'back-office'));
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
    navigate(ROUTES.DISCIPLINE_NEW);
  }

  const onEdit = (id) => {
    navigate(`${ROUTES.DISCIPLINE_EDIT}/${id}`);
  }

  const onDeleteClick = (did) => {
    setDisciplineId(did);
    setDeleteModal(`You are going to DELETE discipline with id ${did}, do you confirm?`)
  }

  const deleteService = () => {
    firebase.discipline(did).delete();
    setDeleteModal('');
  }

  const onPublishClick = (did) => {
    setDisciplineId(did);
    setPublishModal(`You are going to PUBLISH discipline with id ${did}, do you confirm?`)
  }

  const publishService = () => {
    console.log("publish service");
    firebase
      .discipline(did)
      .update({
        available: true,
        publishedAt: dateString(),
      })
      .then(() => {
        console.log("should have updated disc")
        navigate(ROUTES.DISCIPLINES);
        setPublishModal('')
      })
      .catch(error => {
        error && errorModal(error.message);
        setError({ error });
      });
  }

  const data = !!disciplines && disciplines.map(disc => ({
    did: disc.did,
    createdAt: disc.createdAt,
    title: disc.title.fr,
    author: disc.author,
    available: disc.available
  }));
  const keys = (!!data && data.length > 0) ? Object.keys(data[0]) : [];
  const columns = [...keys.map(k => {
    if (k === 'userId') {
      return {
        title: 'User',
        dataIndex: k,
        key: k,
        render: (text, record) => record.author
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
      render: (text, record) => (
        <span>
          {canEdit(authUser, record.userId) && <a href="javascript:;" onClick={() => onEdit(record.did)}>Edit</a>}
          {canEdit(authUser, record.userId) && <Divider type="vertical" />}
          {canDelete(authUser, record.userId) && <a href="javascript:;"  onClick={() => onDeleteClick(record.did)}>Delete</a>}
          {canDelete(authUser, record.userId) && <Divider type="vertical" />}
          {!record.available && canPublish(authUser) && <a href="javascript:;" onClick={() => onPublishClick(record.did)}>Publish</a>}
        </span> 
      ),
    }];
    return (
      <div  style={{ overflowX: 'auto', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Disciplines</h2>
          {canCreate(authUser) && <Button type='primary' onClick={addEntry}> + Add Discipline</Button>}
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
        />
      </div>
    );
  }

export default withFirebase(DisciplineList);
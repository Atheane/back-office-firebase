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

const ChapterList = (props) => {

  const { firebase } = props;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chapters, setChapters] = useState([]);
  const [cid, setChapterId] = useState(null);
  const [showDeleteModal, setDeleteModal] = useState('');
  const [showPublishModal, setPublishModal] = useState('');

  const authUser = useContext(AuthUserContext);

  useEffect(() => {
    const unsubscribe = firebase
      .chapters()
      .onSnapshot(snapshot => {
        const chapters = [];
        snapshot.forEach(doc => {
          firebase.user(doc.data().userId).get().then(user => {
            chapters.push({ ...doc.data(), did: doc.id, author: user.data() && user.data().email });
            setChapters(chapters.filter(chapter => chapter.source === 'back-office'));
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
    navigate(ROUTES.CHAPTER_NEW);
  }

  const onEdit = (cid) => {
    navigate(`${ROUTES.CHAPTER_EDIT}/${cid}`);
  }

  const onDeleteClick = (id) => {
    setChapterId(id);
    setDeleteModal(`You are going to DELETE chapter with id ${id}, do you confirm?`);
  }

  const deleteService = () => {
    firebase.chapter(cid).delete();
    setDeleteModal('');
  }

  const onPublishClick = (id) => {
    setChapterId(id);
    setPublishModal(`You are going to PUBLISH chapter with id ${id}, do you confirm?`)
  }

  const publishService = () => {
    firebase
      .chapter(cid)
      .update({
        available: true,
        publishedAt: dateString(),
      })
      .then(() => {
        navigate(ROUTES.CHAPTERS);
        setPublishModal('')
      })
      .catch(error => {
        error && errorModal(error.message);
        setError({ error });
      });
  }

  const data = !!chapters && chapters.filter(chap => chap.source === 'back-office').map(chapter => console.log(chapter) || ({
    did: chapter.did,
    createdAt: chapter.createdAt,
    disc: chapter.disc,
    grade: chapter.grade,
    title: chapter.title.fr,
    lvl: chapter.lvls,
    author: chapter.author,
    available: chapter.available
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
    if (k === 'disc') {
      return  {
        title: 'Disciplines',
        key: 'disciplines',
        render: (text, record) => (<Tag color={setColor(record.disc.id)} style={{ margin: '4px'}}>
            {setTitle(record.disc.id)}
          </Tag>),
      }
    }
    if (k === 'grade') {
      return  {
        title: 'Grade',
        key: 'grade',
        render: (text, record) => (<Tag style={{ margin: '4px'}}>
            {record.grade.id}
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
      render: (text, record) => (<span>
          {canEdit(authUser, record.userId) && <a href="javascript:;" onClick={() => onEdit(record.did)}>Edit</a>}
          {canEdit(authUser, record.userId) && <Divider type="vertical" />}
          {canDelete(authUser, record.userId) && <a href="javascript:;" onClick={() => onDeleteClick(record.did)}>Delete</a>}
          {canDelete(authUser, record.userId) && <Divider type="vertical" />}
          {!record.available && canPublish(authUser) && <a href="javascript:;" onClick={() => onPublishClick(record.did)}>Publish</a>}
        </span>
      )
    }];
    return (
      <div  style={{ overflowX: 'auto', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Chapters</h2>
          {canCreate(authUser) && <Button type='primary' onClick={addEntry}> + Add Chapter</Button>}
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

export default withFirebase(ChapterList);
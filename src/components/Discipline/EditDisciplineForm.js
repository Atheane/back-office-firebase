import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form, Checkbox } from 'antd';
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

const EditDisciplineForm = (props) => {

  const { firebase } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [id, setId] = useState('');
  const [available, setAvailable] = useState(false);

  const authUser = useContext(AuthUserContext);

  useEffect(() => {
    if (!!id) {
      firebase
        .discipline(id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setAvailable(doc.data().available);
          } 
        }).catch(error => {
          error && errorModal(error.message);
          setError({ error });
        });
        setLoading(false);
    }
  }, [id]);


  const onSubmit = event => {
    event.preventDefault();
    const { form, firebase } = props;

    form.validateFields((errorObj, values) => {
      console.log(authUser);
      if (!errorObj) {
        firebase
          .discipline(id)
          .update({
            updatedAt: dateString(),
            available,
            source: 'back-office'
          })
          .then(() => {
            navigate(ROUTES.DISCIPLINES);
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

  return (<Location>
    { ({ location }) => {
      const params = location.pathname.split('/');
      const did = params[params.length-1];
      setId(did);

    return (<div>
      <h2> Edit Discipline </h2>
      <Form 
        onSubmit={onSubmit}
        style={{ width: '500px' }}
        >
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
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>)
    }}
  </Location>
  );
}

export default compose(
  Form.create({ name: 'discipline_edit' }),
  withFirebase,
)(EditDisciplineForm);

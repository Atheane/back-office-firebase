import React, { Component } from 'react';
import { List, Radio, Modal } from 'antd';
import { withFirebase } from '../data/context';
import * as ROLES from '../constants/roles';
import { AuthUserContext } from '../containers/Authentication';

const { confirm } = Modal;

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  componentDidMount() {
    const { firebase } = this.props;
    this.setState({ loading: true });

    this.unsubscribe = firebase
      .users()
      .onSnapshot(snapshot => {
        const users = [];

        snapshot.forEach(doc =>
          users.push({ ...doc.data(), uid: doc.id }),
        );
        console.log(users);
        this.setState({
          users,
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  changeRole = (user) => (e) => {
    const { firebase } = this.props;

    if (e.target.value === ROLES.ADMIN && user.roles !== "ADMIN") {
      confirm({
        title: 'Etes-vous sûts de vouloir donner les droits administrateurs ?',
        content: `à ${user.firstname} ${user.lastname}, email: ${user.email}. Ces droits permettent de gérer les droits des autres utilisateurs.`,
        onOk() {
          firebase.user(user.uid).update({
            roles: e.target.value,
          }).then(() => console.log("Document successfully written!"))
          .catch(console.log);
        },
        onCancel() {
          return null;
        },
      });
    }
    firebase.user(user.uid).update({
      roles: e.target.value,
    }).then(() => console.log("Document successfully written!"))
    .catch(console.log);
  }

  render() {
    const { users, loading } = this.state;
    console.log(users);
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <h2>Utilisateurs</h2>
            {loading && <div>Loading ...</div>}
            <List
              itemLayout="horizontal"
              dataSource={users}
              renderItem={user => user.email ? (
                <List.Item
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  extra={
                    <div 
                      style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                      }}
                    >
                      <Radio.Group
                        buttonStyle="solid"
                        onChange={this.changeRole(user)}
                        value={user.roles}
                      >
                        <Radio.Button value={ROLES.ADMIN} disabled={user.uid === authUser.uid}>Admin</Radio.Button>
                        <Radio.Button value={ROLES.TEACHER} disabled={user.uid === authUser.uid}>Teacher</Radio.Button>
                        <Radio.Button value={ROLES.INTERN} disabled={user.uid === authUser.uid}>Manager</Radio.Button>
                      </Radio.Group>
                    </div>
                  }
                >
                <List.Item.Meta
                  key={user.uid}
                  title={user.username}
                  description={user.email}
                />
                </List.Item>
              ) : <div />
            }
            />
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(UserList);
import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Link } from "@reach/router"

import { Layout, Menu, Breadcrumb, Icon, Row, Col } from 'antd';

import { useResize } from '../hooks/customHooks';
import logo from '../images/MULMUG_Logo_Secondaire(Blanc)_sans_sous_titre_transparent_RVB.png';
import Navigation from './Navigation';
import './Layout.css';
import * as ROUTES from '../constants/routes';
import * as ROLES from '../constants/roles';
import { AuthUserContext } from '../containers/Authentication';


const { Header, Content, Sider, Footer } = Layout;


const LayoutContainer = ({ children }) => {
  const authUser = useContext(AuthUserContext);
  const [collapsed, toggleCollapse] = useState(false);
  const [innerWidth, ] = useResize(900);
  useEffect(
    () => toggleCollapse((innerWidth < 520)),
    []
  );

  return (
        <Layout breakpoint={{ xs: '480px' }}>
          <Header
          style={{
            paddingLeft: '24px',
            paddingRight: '24px',
            backgroundImage:
            'linear-gradient(116deg, rgb(84, 197, 180) 0%, rgb(31, 138, 158) 100%)',
          }}>
          <Row
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Fragment>
              <Col md={10} xs={14}>
                <Link to={authUser ? ROUTES.DISCIPLINES : ROUTES.SIGN_IN}>
                <img
                  src={logo}
                  alt='logo'
                  width='150px'
                />
              </Link>
              </Col>
              <Col md={12} xs={2}>
                <span />
              </Col>
              <Col md={2} xs={8} style={{textAlign: 'right'}}>
                <Navigation />
              </Col>
            </Fragment>
          </Row>
        </Header>
        <Layout>
          { authUser ? (<Sider
            width={200}
            style={{ background: '#fff' }}
            breakpoint="xs"
            trigger={null}
            collapsible
            collapsed={collapsed}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}>
              <Menu.Item key="1">
                <Icon type="book" />
                <span> Disciplines </span>
                <Link to={ROUTES.DISCIPLINES} />
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="build" />
                <span> Grades </span>
                <Link to={ROUTES.GRADES} />
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="bars" />
                <span> Chapters </span>
                <Link to={ROUTES.CHAPTERS} />
              </Menu.Item>
              <Menu.Item key="4">
                <Icon type="form" />
                <span> Exercices </span>
                <Link to={ROUTES.EXERCICES} />
              </Menu.Item>
              {authUser && authUser.roles === ROLES.ADMIN && <Menu.Item key="5">
                <Icon type="user" />
                <span> Users </span>
                <Link to={ROUTES.USERS} />
              </Menu.Item>}
            </Menu>
          </Sider>) : null
          }
          <Layout style={{ padding: '0 24px 24px' }}>
            <Row>
              { authUser && <Icon
                className="trigger"
                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={() => toggleCollapse(!collapsed)}
              /> }
              <Breadcrumb style={{ margin: '16px 0' }}>
                {/* <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item> */}
              </Breadcrumb>
            </Row>
            <Content
              style={{
                background: '#fff',
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}>
              { children }
            </Content>
          </Layout>
        </Layout>
        <Footer style={{
          backgroundColor: 'rgb(53, 48, 62)',
          color: 'white',
          fontSize: '12px'
        }}> 
          <Row>
            <Col md={6} xs={1}>
              <span />
            </Col>
            <Col md={12} xs={22}>
              contact@mulmug.com
            </Col>
            <Col md={6} xs={1}>
              <span />
            </Col>
          </Row>
        </Footer>
      </Layout>
  );
}

export default LayoutContainer;

import React from 'react';
import { Router } from '@reach/router';
import PropTypes from 'prop-types';

// data management
import firebase from './src/data/firebase';
import StoreProvider from './src/data/store';
import { FirebaseContext } from './src/data/context';
import AuthProvider from './src/containers/Authentication';

// constants
import * as ROUTES from './src/constants/routes';

// layout
import Layout from './src/components/Layout';

// pages
import LandingPage from './src/pages';
import SignUpPage from './src/pages/signup';
import SignInPage from './src/pages/signin';
import PasswordForgetPage from './src/pages/passwordforget';
import AccountPage from './src/pages/account';
import Home from './src/pages/app';
import Users from './src/pages/users';
// disciplines
import Disciplines from './src/pages/disciplines';
import NewDiscipline from './src/pages/discipline/new';
import EditDiscipline from './src/pages/discipline/edit';

// grades
import Grades from './src/pages/grades';
import NewGrade from './src/pages/grade/new';
import EditGrade from './src/pages/grade/edit';
// chapter
import Chapters from './src/pages/chapters';
import NewChapter from './src/pages/chapter/new';
import EditChapter from './src/pages/chapter/edit';
// exercice
import Exercices from './src/pages/exercices';
import NewExercice from './src/pages/exercice/new';
import EditExercice from './src/pages/exercice/edit';
import DuplicateExercice from './src/pages/exercice/duplicate';
import ValidateExercice from './src/pages/exercice/validate';

console.log = () => {};

// In gatsby, we do not have access to <App /> root component anymore
// but we can define it
const Routing = () => (
      <Layout>
        <Router>
          <LandingPage path={ROUTES.LANDING} />
          <SignUpPage path={ROUTES.SIGN_UP} />
          <SignInPage path={ROUTES.SIGN_IN} />
          <PasswordForgetPage path={ROUTES.PASSWORD_FORGET} />
          <AccountPage path={ROUTES.ACCOUNT} />
          <Home path={ROUTES.APP} />
          <Users path={ROUTES.USERS} />
          {/* DISCIPLINES */}
          <Disciplines path={ROUTES.DISCIPLINES} />
          <NewDiscipline path={ROUTES.DISCIPLINE_NEW} />
          <EditDiscipline path={`${ROUTES.DISCIPLINE_EDIT}/:did`} />
          {/* GRADES */}
          <Grades path={ROUTES.GRADES} />
          <NewGrade path={ROUTES.GRADE_NEW} />
          <EditGrade path={`${ROUTES.GRADE_EDIT}/:gid`} />
          {/* CHAPTER */}
          <Chapters path={ROUTES.CHAPTERS} />
          <NewChapter path={ROUTES.CHAPTER_NEW} />
          <EditChapter path={`${ROUTES.CHAPTER_EDIT}/:cid`} />
          {/* EXERCICE */}
          <Exercices path={ROUTES.EXERCICES} />
          <NewExercice path={ROUTES.EXERCICE_NEW} />
          <DuplicateExercice path={`${ROUTES.EXERCICE_DUPLICATE}/:eid`} />
          <EditExercice path={`${ROUTES.EXERCICE_EDIT}/:eid`} />
          <ValidateExercice path={`${ROUTES.EXERCICE_VALIDATE}/:eid`} />
        </Router>
      </Layout>
);

const FirebaseProvider = ({ children }) => (
  <FirebaseContext.Provider value={firebase}>
    {children}
  </FirebaseContext.Provider>
);

export const wrapRootElement = ({ element }) => (
  <StoreProvider>
    <FirebaseProvider>
      <AuthProvider>
        <Routing>
          {element}
        </Routing>
      </AuthProvider>
    </FirebaseProvider>
  </StoreProvider>
);

wrapRootElement.propTypes = {
  element: PropTypes.isRequired,
};

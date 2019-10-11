import React from 'react';
import { compose } from 'recompose';
import withAuthorization from '../containers/Authorization';
import ExerciceList from '../components/Exercice/ExerciceList';
import * as ROLES from '../constants/roles';
import * as ROUTES from '../constants/routes';

const ExercicePage = () => (
    <div style={{display: 'flex', justifyContent: 'center', height: '81vh' }}>
        <ExerciceList />
    </div>
);

// const condition = authUser => {
//   return authUser && authUser.roles === ROLES.INTERN;
// }

export default ExercicePage;

// export default compose(
//   withAuthorization(condition),
// )(GradePage);
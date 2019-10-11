import React from 'react';
import { compose } from 'recompose';
import withAuthorization from '../containers/Authorization';
import DisciplineList from '../components/Discipline/DisciplineList';
import * as ROLES from '../constants/roles';
import * as ROUTES from '../constants/routes';

const DisciplinePage = () => (
    <div style={{display: 'flex', justifyContent: 'center', height: '81vh' }}>
        <DisciplineList />
    </div>
);

// const condition = authUser => {
//   return authUser && authUser.roles === ROLES.INTERN;
// }

export default DisciplinePage;

// export default compose(
//   withAuthorization(condition),
// )(GradePage);
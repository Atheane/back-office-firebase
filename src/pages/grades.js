import React from 'react';
import { compose } from 'recompose';
import withAuthorization from '../containers/Authorization';
import GradeList from '../components/Grade/GradeList';
import * as ROLES from '../constants/roles';
import * as ROUTES from '../constants/routes';

const GradePage = () => (
    <div style={{display: 'flex', justifyContent: 'center', height: '81vh' }}>
        <GradeList />
    </div>
);

// const condition = authUser => {
//   return authUser && authUser.roles === ROLES.INTERN;
// }

export default GradePage;

// export default compose(
//   withAuthorization(condition),
// )(GradePage);
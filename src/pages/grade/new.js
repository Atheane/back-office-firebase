import React from 'react';
import { compose } from 'recompose';
import withAuthorization from '../../containers/Authorization';
import NewGradeForm from '../../components/Grade/NewGradeForm';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

const NewGradePage = () => (
    <div style={{display: 'flex', justifyContent: 'center', height: '81vh' }}>
        <NewGradeForm />
    </div>
);

// const condition = authUser => {
//   return authUser && authUser.roles === ROLES.INTERN;
// }

export default NewGradePage;

// export default compose(
//   withAuthorization(condition),
// )(GradePage);
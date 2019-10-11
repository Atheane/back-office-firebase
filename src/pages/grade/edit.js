import React from 'react';
import { compose } from 'recompose';
import withAuthorization from '../../containers/Authorization';
import EditGradeForm from '../../components/Grade/EditGradeForm';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

const EditGradePage = () => (
    <div style={{display: 'flex', justifyContent: 'center', height: '81vh' }}>
        <EditGradeForm />
    </div>
);

// const condition = authUser => {
//   return authUser && authUser.roles === ROLES.INTERN;
// }

export default EditGradePage;

// export default compose(
//   withAuthorization(condition),
// )(GradePage);
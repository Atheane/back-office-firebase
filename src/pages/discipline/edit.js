import React from 'react';
import { compose } from 'recompose';
import withAuthorization from '../../containers/Authorization';
import EditDisciplineForm from '../../components/Discipline/EditDisciplineForm';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

const EditDisciplinePage = () => (
    <div style={{display: 'flex', justifyContent: 'center', height: '81vh' }}>
        <EditDisciplineForm />
    </div>
);

// const condition = authUser => {
//   return authUser && authUser.roles === ROLES.INTERN;
// }

export default EditDisciplinePage;

// export default compose(
//   withAuthorization(condition),
// )(GradePage);
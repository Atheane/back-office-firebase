import React from 'react';
import { compose } from 'recompose';
import withAuthorization from '../../containers/Authorization';
import EditExerciceForm from '../../components/Exercice/EditExerciceForm';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

const EditExercicePage = () => (
    <div style={{ height: '81vh' }}>
        <EditExerciceForm />
    </div>
);

// const condition = authUser => {
//   return authUser && authUser.roles === ROLES.INTERN;
// }

export default EditExercicePage;

// export default compose(
//   withAuthorization(condition),
// )(GradePage);
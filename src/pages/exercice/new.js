import React from 'react';
import { compose } from 'recompose';
import withAuthorization from '../../containers/Authorization';
import NewExerciceForm from '../../components/Exercice/NewExerciceForm';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

const NewExercicePage = () => (
    <div style={{ height: '81vh' }}>
        <NewExerciceForm />
    </div>
);

// const condition = authUser => {
//   return authUser && authUser.roles === ROLES.INTERN;
// }

export default NewExercicePage;

// export default compose(
//   withAuthorization(condition),
// )(GradePage);
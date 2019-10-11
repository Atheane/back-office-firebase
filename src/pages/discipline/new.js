import React from 'react';
import { compose } from 'recompose';
import withAuthorization from '../../containers/Authorization';
import NewDisciplineForm from '../../components/Discipline/NewDisciplineForm';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

const NewDisciplinePage = () => (
    <div style={{display: 'flex', justifyContent: 'center', height: '81vh' }}>
        <NewDisciplineForm />
    </div>
);

// const condition = authUser => {
//   return authUser && authUser.roles === ROLES.INTERN;
// }

export default NewDisciplinePage;

// export default compose(
//   withAuthorization(condition),
// )(GradePage);
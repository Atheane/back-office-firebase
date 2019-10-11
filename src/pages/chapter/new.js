import React from 'react';
import { compose } from 'recompose';
import withAuthorization from '../../containers/Authorization';
import NewChapterForm from '../../components/Chapter/NewChapterForm';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

const NewChapterPage = () => (
    <div style={{display: 'flex', justifyContent: 'center', height: '81vh' }}>
        <NewChapterForm />
    </div>
);

// const condition = authUser => {
//   return authUser && authUser.roles === ROLES.INTERN;
// }

export default NewChapterPage;

// export default compose(
//   withAuthorization(condition),
// )(GradePage);
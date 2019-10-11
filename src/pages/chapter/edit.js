import React from 'react';
import { compose } from 'recompose';
import withAuthorization from '../../containers/Authorization';
import EditChapterForm from '../../components/Chapter/EditChapterForm';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

const EditChapterPage = () => (
    <div style={{display: 'flex', justifyContent: 'center', height: '81vh' }}>
        <EditChapterForm />
    </div>
);

// const condition = authUser => {
//   return authUser && authUser.roles === ROLES.INTERN;
// }

export default EditChapterPage;

// export default compose(
//   withAuthorization(condition),
// )(GradePage);
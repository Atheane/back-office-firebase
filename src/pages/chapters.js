import React from 'react';
import { compose } from 'recompose';
import withAuthorization from '../containers/Authorization';
import ChapterList from '../components/Chapter/ChapterList';
import * as ROLES from '../constants/roles';
import * as ROUTES from '../constants/routes';

const ChapterPage = () => (
    <div style={{display: 'flex', justifyContent: 'center', height: '81vh' }}>
        <ChapterList />
    </div>
);

// const condition = authUser => {
//   return authUser && authUser.roles === ROLES.INTERN;
// }

export default ChapterPage;

// export default compose(
//   withAuthorization(condition),
// )(GradePage);
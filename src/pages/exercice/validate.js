import React from 'react';
import { compose } from 'recompose';
import withAuthorization from '../../containers/Authorization';
import ValidateExerciceForm from '../../components/Exercice/ValidateExerciceForm';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

const ValidateExercicePage = () => (
    <div style={{ height: '81vh' }}>
        <ValidateExerciceForm />
    </div>
);

export default ValidateExercicePage;

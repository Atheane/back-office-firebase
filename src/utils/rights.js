
import * as ROLES from '../constants/roles';

export const canCreate = (authUser) => (!!authUser && authUser.roles === ROLES.INTERN || !!authUser && authUser.roles === ROLES.ADMIN);
export const canEdit = (authUser, uid) => canCreate(authUser) && (authUser.uid === uid || !!authUser && authUser.roles === ROLES.ADMIN);
export const canDelete = (authUser, uid) => canCreate(authUser) && (authUser.uid === uid || !!authUser && authUser.roles === ROLES.ADMIN);
export const canDuplicate = (authUser) => canCreate(authUser);
export const canPublish = (authUser) => (!!authUser && authUser.roles === ROLES.TEACHER || !!authUser && authUser.roles === ROLES.ADMIN);


export const difference = (arr1, arr2) => arr1.filter(x => !arr2.includes(x));
export const differenceDisciplines = (arr1, arr2) => arr1.filter(x => !arr2.map(y => y.did).includes(x.key));
export const differenceGrades = (arr1, arr2) => arr1.filter(x => !arr2.map(y => y.did).includes(x.key));



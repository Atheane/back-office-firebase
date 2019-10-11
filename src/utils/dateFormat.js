export const dateString = () => {
  return new Date(Date.now()).toLocaleString();
}

export const toTimestamp = (strDate) => {
  const [ddmmyyyy, hhmmss] = strDate.split(/[\s,à]+/g);
  const [day, month, year] = ddmmyyyy.trim().split('/');
  const [hh,mm,ss] = hhmmss.trim().split(':');
  const tms = year + month + day + hh + mm + ss;
  console.log(tms);
  return parseInt(tms);
}
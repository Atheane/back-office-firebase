import React, { useState, useEffect } from 'react';
import QcmMulti from './QcmMulti';
import uniqid from 'uniqid';

export default (props) => {   
  const [ex_n, setEx_n] = useState([{ key: uniqid() }, 0]);
  const [stepToDelete, setStepToDelete ] = useState();
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    // console.log('MissingValueList ex_n', ex_n);
    props.ex[ex_n[1]] = ex_n[0];
    props.setEx([...props.ex]);
  }, [ex_n]);

  // add a new step to ex => maybe not necessary with ex_n
  useEffect(() => {
    if (props.steps > props.ex.length) {
      props.ex[props.ex.length] = {};
    } 
    props.setEx([...props.ex]);
    setEx_n([{ key: uniqid() }, [...props.ex].length-1]);
  }, [props.steps]);

  // delete a specific step
  useEffect(() => {
    const newEx = props.ex.filter(item => {
      return item.key !== stepToDelete
    });
    props.setEx([...newEx]);
  }, [stepToDelete]);

  return (
    props.ex.map((elem, n) => <QcmMulti
      key={elem.key || !!props.edit && !!elem.answers && Object.keys(elem.answers)[0]}
      id={elem.key || !!props.edit && !!elem.answers && Object.keys(elem.answers)[0]}
      n={n}
      edit={!!props.edit && elem}
      setEx_n={setEx_n}
      setStepToDelete={setStepToDelete}
      edited={edited}
      setEdited={setEdited}
    />)
  )
}
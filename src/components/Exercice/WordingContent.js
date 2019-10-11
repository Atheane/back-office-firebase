import React, { useState, useEffect } from 'react';
import StaticType from './StaticType';
import { withFirebase } from '../../data/context';



const WordingContent = (props) => {

  const [type, setType] = useState(null);
  const [text, setText] = useState(null);
  const [img, setImg] = useState(null);
  const [wording, ] = useState({...props.wording});

  useEffect(() => {
    if (
      !props.edited &&
      !!props.wording &&
      !!props.wording.type
    ) {
      if (
        props.wording.type === 'txt' &&
        !!props.wording.cnt &&
        !!props.wording.cnt.fr
      ) {
        setType(props.wording.type);
        setText(props.wording.cnt.fr);
      } else if (
        props.wording.type === 'img' &&
        !!props.wording.cnt
      ) {
        setType(props.wording.type);
        setImg(props.wording.cnt);
      }
      props.setEdited(true);
    }
  }, [props.wording]);

  useEffect(() => {
    wording.type = type;
    props.setWording({...wording});
  }, [type]);

  useEffect(() => {
    if (!!text) {
      wording.cnt = {
        fr: text
      } 
      props.setWording({...wording});
    }
  }, [text]);

  useEffect(() => {
    if (!!img) {
      wording.cnt = {
          ...img
      }
      props.setWording({...wording});
    }
  }, [img]);

  return (
    <div style={{ width: '100%' }}>
      <StaticType
        types={['txt','img']}
        text={text}
        setText={setText}
        type={type}
        setType={setType}
        img={img}
        setImg={setImg}
        label={props.label || 'Wording'}
        id='wording'
      />
    </div>
  )
}


export default withFirebase(WordingContent);
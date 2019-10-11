import React, { useState, useEffect } from 'react';
import DynamicType from './DynamicType';
import StaticType from './StaticType';
import { withFirebase } from '../../data/context';

const WordingExercice = (props) => {
  const [type, setType] = useState(null);
  const [text, setText] = useState(null);
  const [img, setImg] = useState(null);
  const [wording, ] = useState({ ...props.wording });

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
        !!props.wording.cnt &&
        !!props.wording.cnt.img
      ) {
        setType(props.wording.type);
        setImg(props.wording.cnt.img);
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
    }
    props.setWording({...wording});
  }, [text]);

  useEffect(() => {
    console.log(img);
    if (!!img) {
      wording.cnt = {
        img: {
          name: img.name,
          url: img.url
        }
      }
      props.setWording({...wording});
    }
  }, [img]);

  return (
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
  )
}

export default withFirebase(WordingExercice);
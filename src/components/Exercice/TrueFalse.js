import React, { Fragment, useState, useEffect } from 'react';
import { Form, Radio, Icon } from 'antd';
import WordingContent from './WordingContent';

const TrueFalse = (props) => {

  const [wording, setWording] = useState(null);
  const [answers, setAnswers] = useState();
  let [exo, setExo] = useState();
  const [stepId, setStepId] = useState();
  const [edited, setEdited] = useState(!props.edit);

  useEffect(() => {
    const id = props.id;
    setStepId(id);
    console.log(`TrueFalse with id ${id} is mounted`);
    return () => console.log(`TrueFalse with id ${id} is unMounted`);
  }, []);

  useEffect(() => {
    if (
      !!props.id &&
      !!props.edit &&
      !!props.edit.wording &&
      props.edit.wording.length > 0 &&
      !!props.edit.wording[0] &&
      !!props.edit.answers &&
      !!props.edit.answers[props.id] &&
      !!props.edit.answers[props.id].fr &&
      props.edit.answers[props.id].fr.length > 0
    ) {
      if (!wording) {
        setWording(props.edit.wording[0]);
        // console.log('@@@@@@@@@@@@@@@@@@props.edit.wording[0]', props.edit.wording[0])
      }
      if (!answers) {
        setAnswers(props.edit.answers[props.id].fr[0]);
        // console.log('@@@@@@@@@@@@@@@@@@props.edit.answers[props.id].fr[0]', props.edit.answers[props.id].fr[0])
      };
    }
  }, []);

  useEffect(() => {
    if (!!wording && !!props.id) {
      // console.log('#####wording changed, wording:', wording);
      const newExo = {
        ...exo,
        key: stepId,
        type: 'boolean',
        wording: [{...wording}, {
          type: 'boolean',
          cnt: {
            key: stepId
          },
        }]
      }
      // console.log("MV setExo exo", {...exo});
      setExo({...newExo});
    }
  }, [wording]);

  useEffect(() => {
    if (!!answers && !!props.id) {
      // console.log('#####answers changed answers:', answers);
      const newExo = {
        ...exo
      };
      newExo.answers = {};
      newExo.answers[stepId] = {
        fr: [answers],
      };
      // console.log("MV setExo exo", {...exo});
      setExo({...newExo});
    }
  }, [answers]);

    // send ex_n to ex only if it is completed
    useEffect(() => {
      if (
        !!props.id &&
        !!exo &&
        !!exo.wording &&
        exo.wording.length > 0 &&
        !!exo.answers &&
        Object.keys(exo.answers).length > 0
      ) {
        console.log("Lift ex_n data up to component list [{...exo}, props.n]", [{...exo}, props.n]);
        props.setEx_n([{...exo}, props.n]);
      }
    }, [exo]);


  const { getFieldDecorator } = props.form;

  // console.log('exo', exo) || 
  return (
    <Fragment>
      {/* Wording */}
      <div style={{ display: 'flex' }}>
        <WordingContent
          label={`Instruction step ${props.n+1}`}
          setWording={setWording}
          n={props.n}
          wording={wording}
          edited={edited}
          setEdited={setEdited}
        />
       <Icon
          className="dynamic-delete-button"
          type="minus-circle-o"
          style= {{ padding: '8px', marginTop: '40px' }}
          onClick={() => {
            // console.log('lift step to be deleted, step:', stepId);
            props.setStepToDelete(stepId);
          }}
        />
      </div>
      <Form.Item label={`Answer step ${props.n+1}`}>
        {getFieldDecorator('answer', {
          initialValue: answers || [],
          rules: [{ required: true, message: 'Please add an answer!' }],
        })(
        <Radio.Group buttonStyle="solid" onChange={e => setAnswers(e.target.value)}>
          <Radio.Button value="true">True</Radio.Button>
          <Radio.Button value="false">False</Radio.Button>
        </Radio.Group>)}
      </Form.Item>
    </Fragment>
    );
}

export default Form.create({ name: 'truefalse_oneStep' })(TrueFalse);
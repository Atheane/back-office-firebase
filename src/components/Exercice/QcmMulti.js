import React, { Fragment, useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Icon } from 'antd';
import WordingContent from './WordingContent';


const QcmMulti = (props) => {

  const [numberChoices, setNumberChoices] = useState(2);
  const [keys, setKeys] = useState([0,1]);
  const [choices, setChoices] = useState({});
  const [wording, setWording] = useState(null);
  const [answers, setAnswers] = useState();
  const [rawAnswers, setRawAnswers] = useState();
  let [exo, setExo] = useState();
  const [stepId, setStepId] = useState();
  const [edited, setEdited] = useState(!props.edit);

  useEffect(() => {
    const id = props.id;
    setStepId(id);
    console.log(`TrueFalse with id ${id} is mounted`);
    return () => console.log(`TrueFalse with id ${id} is unMounted`);
  }, []);

  // for edit
  useEffect(() => {
    if (
      !!props.id &&
      !!props.edit &&
      !!props.edit.wording &&
      props.edit.wording.length === 2 &&
      !!props.edit.wording[0] &&
      !!props.edit.wording[1] &&
      !!props.edit.wording[1].choices &&
      Object.values(props.edit.wording[1].choices).length > 1 &&
      !!props.edit.answers &&
      !!props.edit.answers[props.id] &&
      !!props.edit.answers[props.id].fr &&
      props.edit.answers[props.id].fr.length > 0
    ) {
      if (!wording) {
        setWording(props.edit.wording[0]);
      }
      if (!choices || !!choices && Object.values(choices).length === 0) {
        setNumberChoices(Object.values(props.edit.wording[1].choices).length);
        setChoices(props.edit.wording[1].choices);
        props.setEdited(true);
      }
      if (!answers) {
        const answers = props.edit.answers[props.id].fr;
        const selectedAnswers = [];
        for (let i = 0; i < answers.length; i++) {
          selectedAnswers.push({ key: answers[i], label: [" ", answers[i], " "] })
        }
        // console.log("selectedAnswers", selectedAnswers);
        setAnswers([...answers]);
        setRawAnswers([...selectedAnswers]);
      };
    }
  }, []);

  useEffect(() => {
    const keys = [];
    for (let n = 0; n < numberChoices; n++) {
      keys.push(n);
    }
    setKeys([...keys]);
    if (!props.edit || props.edited) { setChoices({...keys.map(k => choices[k])}) };
  }, [numberChoices]);

  useEffect(() => {
    if (!!wording && !!props.id) {
      console.log('#####wording changed, wording:', wording);
      const newExo = {
        ...exo,
        key: stepId,
        type: 'qcm_multi',
        wording: [{...wording}, {
          type: 'qcm_multi',
          choices,
          key: stepId
        }]
      }
      // console.log("MV setExo exo", {...exo});
      setExo({...newExo});
    }
  }, [wording, choices]);

  useEffect(() => {
    if (!!answers && !!props.id) {
      // console.log('#####answers changed answers:', answers);
      const newExo = {
        ...exo
      };
      newExo.answers = {};
      newExo.answers[stepId] = {
        fr: answers,
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
  const { Option } = Select;

  const formItems = keys.map((k, index) => {
    return(
      <Form.Item
        style={{ textAlign: 'left'}}
        required={false}
        key={k}
      >
      {getFieldDecorator(`choice${index+1}`, {
        initialValue: choices[index],
        rules: [{ required: true, message: 'Please add an option!' }],
      })(<Input
          name={k}
          placeholder={k+1}
          onChange={(e) => {
            const chois = {...choices};
            chois[k] = e.target.value;
            setChoices(chois);
          }}
        />)}
    </Form.Item>
    )
  })

  return (
    <Fragment>
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
      {getFieldDecorator('numberChoices', {
          initialValue: numberChoices,
        })(
        <InputNumber
          min={2}
          max={10}
          onChange={setNumberChoices}
          style={{ marginBottom: '24px'}}
          />)} Choices
          {formItems}
      <Form.Item label="Answer">
        {getFieldDecorator('answer', {
            initialValue: rawAnswers,
            rules: [{ required: true, message: 'Please add an answer!' }],
          })(<Select
            labelInValue
            placeholder="Select possible answers"
            mode="multiple"
            onChange={arr => console.log(arr) || setAnswers(arr.map(item => item.key))}
          >
            {Object.keys(choices).map((choice) => <Option value={choices[choice]}> {choices[choice]} </Option>)}
          </Select>
          )}
      </Form.Item>
    </Fragment>
  );
}

export default Form.create({ name: 'dynamic_form_item' })(QcmMulti);
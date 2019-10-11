import React, { Fragment, useState, useEffect } from 'react';
import { Form, Input, Icon } from 'antd';


const MissingValues = (props) => {

  const [cnt, setCnt] = useState();
  const [blanks, setBlanks] = useState([]);
  const [answers, setAnswers] = useState();
  let [exo, setExo] = useState();
  const [stepId, setStepId] = useState();

  useEffect(() => {
    const id = props.id;
    setStepId(id);
    console.log(`Missing values with id ${id} is mounted`);
    return () => console.log(`Missing values with id ${id} is unMounted`);
  }, []);

  useEffect(() => {
    if (
      !!props.id &&
      !!props.edit &&
      !!props.edit.wording &&
      props.edit.wording.length > 0 &&
      !!props.edit.wording[0].cnt &&
      !!props.edit.wording[0].cnt.fr &&
      !!props.edit.answers &&
      !!props.edit.answers[props.id] &&
      !!props.edit.answers[props.id].fr &&
      props.edit.answers[props.id].fr.length > 0
    ) {
      if (!exo) {
        setExo({...props.edit});
      }
      if (!cnt) {
        setCnt(props.edit.wording[0].cnt.fr);
      }
      if (!answers) {
        setAnswers(props.edit.answers[props.id].fr)
      };
    }
  }, []);

  useEffect(() => {
    const blanks = [];
    const numberBlanks = !!cnt && cnt.split('__').length-1;
    for (let n = 0; n < numberBlanks; n++) {
      blanks.push(n);
    }
    setBlanks([...blanks]);
  }, [cnt]);

  useEffect(() => {
    if (!!cnt && !!props.id) {
      // console.log('#####cnt changed cnt:', cnt);
      exo = {
        key: stepId,
        type: 'missing_value',
        wording: [{
          type: 'txt',
          cnt: {
            fr: cnt
          },
        }, {
          type: 'input',
          key: stepId
        }],
      };
      // console.log("MV setExo exo", {...exo});
      setExo({...exo});
      // props.setPreview({...exo});
    }
  }, [cnt]);

  useEffect(() => {
    if (!!answers && !!props.id) {
      // console.log('#####answers changed answers:', answers);
      exo.answers = {};
      exo.answers[stepId] = {
        fr: !!answers && Object.values(answers) || {},
      };
      // console.log("MV setExo exo", {...exo});
      setExo({...exo});
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
      // console.log("Lift ex_n data up to component list [{...exo}, props.n]", [{...exo}, props.n]);
      props.setEx_n([{...exo}, props.n]);
    }
  }, [cnt, answers]);

  const { getFieldDecorator } = props.form;

  return (
    <Fragment>
      {/* unlike other gameplay component, no use of wording because we cannot parse image */}
      <div style={{ display: 'flex' }}>
        <Form.Item label={`Instruction step ${props.n+1}`} style={{ width: '100%' }}>
          {getFieldDecorator('instruction', { initialValue: cnt || ''}
            )(
            <Input
              // value={cnt || ''}
              name={`instruction${props.n}`}
              placeholder={`Instruction step ${props.n+1}`}
              onChange={(e) => setCnt(e.target.value)}
            />
          )}
        </Form.Item>
        <Icon
          className="dynamic-delete-button"
          type="minus-circle-o"
          style= {{ padding: '8px', marginTop: '40px' }}
          onClick={() => {
            // console.log('lift step to be deleted, step:', stepId);
            props.setStepToDelete(stepId);
          }}        />
      </div>
      <Form.Item label={`Answer step ${props.n+1}`}>
        {Object.keys(blanks).map((blank, index) => 
          getFieldDecorator(`answer${index+1}`,
            { initialValue: !!answers && answers[index] || []}
          )(<Input
          placeholder={`Missing value ${index+1}`}
          onChange={(e) => {
            const ans = {...answers};
            ans[index] = e.target.value;
            setAnswers({...ans});
          }}
        />))}
      </Form.Item>
    </Fragment>
  );
}

export default Form.create({ name: 'missing_values_oneStep' })(MissingValues);
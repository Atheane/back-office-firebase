import React from 'react';
import MathJax from 'react-mathjax2';
import { Affix } from 'antd';


// `\\frac{a}{b}`

export default ({
  ex
}) => {
  return (
    <div>
      <h2> Preview </h2>
      <h3> Exercices </h3>
      {ex.map(((exo, index) => {
        if (
          !!exo.wording &&
          exo.wording.length > 0 &&
          exo.wording[0].cnt
        ) {
          const formulas = exo.wording[0].cnt.fr.split("`").filter((f, index) => (index % 2 === 1));
          return (
            <Affix offsetTop={120*(index+1)} onChange={affixed => console.log(affixed)}>
                <h4> Step {index+1} </h4>
                {formulas.map(formula => (<MathJax.Context input='tex'>
                    <div>
                      <MathJax.Node>{eval("`" + formula + "`")}</MathJax.Node>
                    </div>
               </MathJax.Context>))}
            </Affix>
          )
        } 
      }))}
    </div>
  )
}
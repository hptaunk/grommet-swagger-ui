import React, { Component } from 'react';
// import Signature from '../Util/Signature';
// import Util from '../Util/Util';
// import {Accordion, AccordionPanel, Box} from './Grommet';
import SignatureView from './SignatureView';
import ResponseContentType from './ContentType';
//<OperationView operationsArray ={operationsArray} />
export default class TypeView extends Component {
  render() {
    const {model} = this.props;
    if (!model) {
      return null;
    }
    var desc;
    if (model.successDescription) {
      desc = (<div> {model.successDescription} </div>);
    }
    return (
      <section>
        <h4 className="summary"><span>Response Class</span> (<span>Status</span> {model.successCode})</h4>
        {desc}
        <SignatureView  model= {model.signatureModel} />
        <ResponseContentType title="Response Content Type" model={model.contentTypeModel.produces}/>
      </section>
    );
  }
};

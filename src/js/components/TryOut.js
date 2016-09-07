import React, { Component } from 'react';
import {Box,Heading} from './Grommet';
import SampleModel from './SampleModel';
import ParameterView from './ParameterView';

export default class TryOut extends Component {

  _renderHeader(headers) {
    var items = headers.map(function(itm, i) {
      return (<tr>
        <td>{i}</td>
        <td>{itm.description}</td>
        <td>{itm.type}</td>
        <td>{itm.other}</td>
      </tr>);
    });
    return (
      <Box>
      <Heading tag="h4" data-sw-translate>Headers</Heading>
      <table className="headers">
        <thead>
          <tr>
            <th style={{width: "100px", maxWidth: "100px"}} data-sw-translate>Header</th>
            <th style={{width: "310px", maxWidth: "310px"}} data-sw-translate>Description</th>
            <th style={{width: "200px", maxWidth: "200px"}} data-sw-translate>Type</th>
            <th style={{width: "320px", maxWidth: "320px"}} data-sw-translate>Other</th>
          </tr>
        </thead>
        <tbody>
          {items}
        </tbody>
      </table>
      </Box>
    );
  }

  _renderParameter(params) {
    return (<ParameterView paramters={params} />);
  }
  render() {
    const api = this.props.api;
    //deprecated, description, type, headers, parameters, responseMessages, isReadOnly, successCode, successDescription
    var deprecat = api.deprecated? (<h4><span>Warning: Deprecated</span></h4>) : null;
    var desc = api.description? (<span><h4><span>Implementation Notes</span></h4> <div className="markdown">{api.description}</div></span>) : null;
    var desc1 = api.successDescription? (<div className="markdown">{api.successDescription}</div>) : null;
    var _type = api.type ? (
      <div className="response-class">
        <h4><span data-sw-translate>Response Class</span> (<span data-sw-translate>Status</span> {api.successCode})</h4>
        {desc1}
        // <p><span className="model-signature" /></p>
        <SampleModel />
        <br/>
        <div className="response-content-type" />
      </div>
    ) :null;
    var _headers = this._renderHeader([]);
    // debugger;
    var _params = this._renderParameter(api.operation.parameters);
    return (
      <Box>
        {deprecat}
        {desc}
        {_type}
        {_headers}
        {_params}
      </Box>
    );
  }
};

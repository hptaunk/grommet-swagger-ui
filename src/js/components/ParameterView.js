import React, { Component } from 'react';
import {Box, Heading, Table} from './Grommet';
import Signature from '../Util/Signature';
import Util from '../Util/Util';
// import SignatureView from './SignatureView';
// import ContentType from './ContentType';
import ParameterType from './ParameterType';

export default class ParameterView extends Component {
  constructor (props) {
    super(props);
    // this._onChange = this._onChange.bind(this);
    // this._onContentTypeChange = this._onContentTypeChange.bind(this);
    this._onParameterChange = this._onParameterChange.bind(this);
    this.state = {}; //{file:null, ContentType: null, body: ''};
  }
  _onParameterChange(obj) {
    if (obj) {
      this.state[obj.id] = {value: obj.value, paramType: obj.paramType};
    }
    if (this.props.onParameterChange) {
      this.props.onParameterChange(this.state);
    }
  }
  _renderPType(param) {
    var {model} = param; //readOnly
    var type = model.type || model.dataType;
    var modelType = model.modelSignature.type;
    var modelDefinitions = model.modelSignature.definitions;
    var schema = model.schema || {};
    var consumes = model.consumes || [];
    var sampleJSON; //, signatureView
    model.valueId = 'ptr' + Math.random();
    if (typeof type === 'undefined') {
      if (schema.$ref) {
        var ref = schema.$ref;
        if (ref.indexOf('#/definitions/') === 0) {
          type = ref.substring('#/definitions/'.length);
        } else {
          type = ref;
        }
      }
    }
    model.type = type;
    model.paramType = model.in || model.paramType;
    model.isBody = model.paramType === 'body' || model.in === 'body';
    model.isFile = type && type.toLowerCase() === 'file';

    // Allow for default === false
    if(typeof model.default === 'undefined') {
      model.default = model.defaultValue;
    }

    model.hasDefault = (typeof model.default !== 'undefined');
    model.valueId = 'm' + model.name + Math.random();

    if (model.allowableValues) {
      model.isList = true;
    }

    var isXML = Util.contains(consumes, 'xml');
    var isJSON = isXML ? Util.contains(consumes, 'json') : true;
    sampleJSON = Signature.createParameterJSONSample(modelType, modelDefinitions);
    var signatureModel = {
      sampleJSON: isJSON ? sampleJSON : false,
      sampleXML: sampleJSON && isXML ? Signature.createXMLSample('', schema, modelDefinitions, true) : false,
      isParam: true,
      signature: Signature.getParameterModelSignature(modelType, modelDefinitions),
      defaultRendering: model.defaultRendering
    };
    model.signatureModel = signatureModel;
    var isParam = false;

    /***
    ***
    ***
    ***/
    if (model.isBody) {
      isParam = true;
    }

    var contentTypeModel = {
      isParam: isParam
    };

    contentTypeModel.consumes = model.consumes;
    model.contentTypeModel = contentTypeModel;
    model.defaultVal = model.default;
    // return React.createElement (
    //   TableRow,
    //   {key: model.valueId},
    //   React.createElement (
    //     ParameterType,
    //     {key: model.valueId, model: model, onChange: this._onChange, onContentTypeChange: this._onContentTypeChange}
    //   )
    // );
    // debugger;
    return React.createElement (
      ParameterType,
      {key: model.valueId, model: model, onChange: this._onParameterChange, onContentTypeChange: this._onParameterChange}
    );
  }

  render() {
    const {model} = this.props;
    var items = model.map(this._renderPType, this);

    return (
      <Box>
      <Heading tag="h4" className="summary">Parameters</Heading>
      <Table className="headers">
        <thead>
          <tr>
            <th style={{width: "100px", maxWidth: "100px"}} data-sw-translate>Parameter</th>
            <th style={{width: "310px", maxWidth: "310px"}} data-sw-translate>Value</th>
            <th style={{width: "200px", maxWidth: "200px"}} data-sw-translate>Description</th>
            <th style={{width: "100px", maxWidth: "100px"}} data-sw-translate>Parameter Type</th>
            <th style={{width: "220px", maxWidth: "230px"}} data-sw-translate>Data Type</th>
          </tr>
        </thead>
        <tbody>{items}</tbody>
      </Table>
      </Box>
    );
  }
};

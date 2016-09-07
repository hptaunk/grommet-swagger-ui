import React, { Component } from 'react';
import Signature from '../Util/Signature';
import {Box, Heading, Table, TableRow} from './Grommet';
import SignatureView from './SignatureView';
const CLASS_ROOT = "responsemessage";
export default class ResponseMessage extends Component {
  _renderRow (row, i) {
    var {code, message, schema, responseModel, defaultRendering, isXML} = row.model; // header, responseModelView, 
    var router = row.router;
    var value = router.models[responseModel];
    // $(this.el).html(Handlebars.templates.status_code(this.model));

    if (router.models.hasOwnProperty(responseModel)) {
      responseModel = {
        sampleJSON: JSON.stringify(Signature.createJSONSample(value), void 0, 2),
        sampleXML: isXML ? Signature.createXMLSample('', schema, router.models) : false,
        isParam: false,
        signature: Signature.getModelSignature(responseModel, value, router.models),
        defaultRendering: defaultRendering
      };
    } else {
      responseModel = {
        signature: Signature.getPrimitiveSignature(schema)
      };
    }
    // debugger;
    return (
      <TableRow key={'row.'+i}>
      <td width='15%' className='code'>{code}</td>
      <td className="markdown">{message}</td>
      <td width='50%'><SignatureView  model= {responseModel} /></td>
      <td className="headers">
        {
        //   <table>
        //   <tbody>
        //     {{#each headers}}
        //     <tr>
        //       <td>{{@key}}</td>
        //       <td>{{this.description}}</td>
        //       <td>{{this.type}}</td>
        //     </tr>
        //     {{/each}}
        //   </tbody>
        // </table>
      }
      </td>
      </TableRow>
    );
  }
  render() {
    var {model} = this.props;
    var items = model.map(this._renderRow);
    return (
      <Box className= {CLASS_ROOT} >
      <Heading tag="h4" className="summary">Response Messages</Heading>
      <Table className="headers">
        <thead>
          <tr>
          <th>HTTP Status Code</th>
          <th>Reason</th>
          <th>Response Model</th>
          <th>Headers</th>
          </tr>
        </thead>
        <tbody>{items}</tbody>
      </Table>
      </Box>
    );
  }
};

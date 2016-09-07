// RequestHeaders
import React, { Component } from 'react';
import {Table, TableRow} from './Grommet';
export default class RequestHeaders extends Component {
  render() {
    var headers = this.props.headers;
    if (!headers) {
      return null;
      // headers= [];
    }
    // debugger;
    var items = headers.map(function(itm, i) {
      return (<TableRow>
        <td>{i}</td>
        <td>{itm.description}</td>
        <td>{itm.type}</td>
        <td>{itm.other}</td>
      </TableRow>);
    });
    var table = (
      <Table className="headers">
        <thead>
          <TableRow>
            <th style={{width: "100px", maxWidth: "100px"}} >Header</th>
            <th style={{width: "310px", maxWidth: "310px"}} >Description</th>
            <th style={{width: "200px", maxWidth: "200px"}} >Type</th>
            <th style={{width: "320px", maxWidth: "320px"}} >Other</th>
          </TableRow>
        </thead>
        <tbody>
          {items}
        </tbody>
      </Table>
    );
    return (<section><h4 className="summary">Headers</h4> {table} </section>);
  }
};

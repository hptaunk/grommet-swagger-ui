import React, { Component } from 'react';
import {Accordion, AccordionPanel, Box, Title} from './Grommet';
import OperationView from './OperationView';
const CLASS_ROOT = 'swagger_operation';
export default class ResourcesView extends Component {
  // _onTryNow(event) {
  //   // if (this.props.onTryNow) {
  //   //   this.props.onTryNow(event);
  //   // }
  // }
  _renderOpt(opts, i) {
    const {method, path, summary} = opts;
    var {model} = this.props;
    opts.router = model.router;
    var classes = CLASS_ROOT + "_" + method;
    var head = [];

    head.push(
      <Box key={path + '_' + i + '.' + i} direction="row" align='center' justify="between" full='horizontal'>
        <Box direction="row" className="header" tag="h6">
          <Title className="title"> {method} </Title>
          <Box align='center' justify="center" className="path"> {path} </Box>
        </Box>
        <Box align='center' justify="center" className="path"> <h6 className="summary"> {summary} </h6> </Box>
     </Box>);

    return (
      <AccordionPanel heading={head}  key={path + '_' + i} className={classes} >
        <OperationView model={opts} options={this.options} onTryNow={this.props.onTryNow}/>
      </AccordionPanel>
    );
  }
  render() {
    var {model, options} = this.props;
    this.options = options;
    var list = model.operationsArray.map((opt, i) => {
      opt.definitions = model.definitions;
      return this._renderOpt(opt, i);
    }, this);
    return (
      <Accordion className={CLASS_ROOT} pad={{horizontal: 'medium'}}>
      {list}
      </Accordion>
    );
  }
};

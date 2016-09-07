import React, { Component } from 'react';
import Util from '../Util/Util';
import {Article, Accordion, AccordionPanel} from './Grommet';
import InfoView from './InfoView';
import ResourcesView from './ResourcesView';
//<OperationView operationsArray ={operationsArray} />
export default class MainView extends Component {
  // _onTryNow(event) {
  //   if (this.props.onTryNow) {
  //     this.props.onTryNow(event);
  //   }
  // }
  _renderPanel(api, i) {
    const {name, description} = api;
    api.router = this.router;
    var id = name;
    id = id + '_' + i;
    api.id = id;
    id = 'resource_' + id.replace(/\s/g, '_');
    var heading = name  + ' '+ (description? ': ' + description : '');

    return (
      <AccordionPanel className='swagger_mainview--path' key={id} heading={heading}>
        <ResourcesView model={api} options={this.options} onTryNow={this.props.onTryNow}/>
      </AccordionPanel>
    );
  }
  render() {
    if (!this.props.apiClient) {
      return null;
    }
    const {apiClient, options} = this.props;
    this.router = apiClient;
    this.options = options;
    this.model = apiClient;
    var sorterOption, sorterFn;
    // Sort APIs
    if (this.options.apisSorter) {
      sorterOption = this.options.apisSorter;
      if (_.isFunction(sorterOption)) {
        sorterFn = sorterOption;
      } else {
        sorterFn = Util.apisSorter[sorterOption];
      }
      if (_.isFunction(sorterFn)) {
        this.model.apisArray.sort(sorterFn);
      }
    }
    // Sort operations of each API
    if (this.options.operationsSorter) {
      sorterOption = this.options.operationsSorter;
      if (_.isFunction(sorterOption)) {
        sorterFn = sorterOption;
      } else {
        sorterFn = Util.operationsSorters[sorterOption];
      }
      if (_.isFunction(sorterFn)) {
        for (key in this.model.apisArray) {
          this.model.apisArray[key].operationsArray.sort(sorterFn);
        }
      }
    }

    var resources = this.model.apisArray.map((opt, i) => {
      opt.definitions = this.model.definitions;
      return this._renderPanel(opt, i);
    }, this);
    return (
      <Article appCentered={true} align="stretch">
        <InfoView info ={this.model.info} />
        <Accordion className='swagger_mainview'>
          {resources}
        </Accordion>
      </Article>
    );
  }
};

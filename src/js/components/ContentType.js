import React, { Component } from 'react';
import {Box} from './Grommet';
const CLASS_ROOT = "response-content-type";
export default class ContentType extends Component {
  constructor (props) {
    super(props);
    this._onChange = this._onChange.bind(this);
    this.state = {selected: ''};
  }
  _onChange(event) {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  render() {
    const {title, model} = this.props;
    var id = 'rct' + Math.random();
    var ele;
    if (model) {
      ele = model.map((p, i) => {
        return (<option key={i} value={p}>{p}</option>);
      });
    } else {
      ele = (<option key='0' value="application/json">application/json</option>);
    }
    ele.push(<option key='1' value="aa">Selectone</option>);
    return  (
      <Box direction="row" className={CLASS_ROOT} justify="start" align="center">
        <Box>
          <label htmlFor={id}>{title}</label>
        </Box>
        <Box className="grommetux-form-field__contents">
          <select id={id} onChange={this._onChange}>
            {ele}
          </select>
        </Box>
      </Box>
    );
  }
};
ContentType.defaultProps = {
  title: "Content Type"
};

ContentType.propTypes = {
  title: React.PropTypes.string,
  model: React.PropTypes.array,
  onChange: React.PropTypes.func
};

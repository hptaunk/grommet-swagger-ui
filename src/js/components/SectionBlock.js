import React, { Component } from 'react';
export default class SectionBlock extends Component {
    //sample -
    // [{dt:'', dd: '', cond:undefined}]
  render() {
    var ele = [];
    var model = this.props.model;
    ele = model.map((d, i) => {
      var _e = [];
      if (d.cond == undefined) {
        d.cond = true;
      }
      if (d.cond) {
        if(d.dt) {
          _e.push(<dt key={'_dt_1.' + i}> {d.dt} </dt>);
        }
        if(d.dd) {
          _e.push(<dd key={'_dd_1'}> {d.dd} </dd>);
        }
      }
      return _e;
    }, this);
    return (
      <section>
        <dl>{ele}</dl>
      </section>
    );
  }
}

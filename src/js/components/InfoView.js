import React, { Component } from 'react';
import {Heading, Section, Paragraph} from './Grommet';
export default class InfoView extends Component {
  render() {
    const {info} = this.props;
    if (!info)
      return null;
    var contactName = info.contact? info.contact.name : '';
    // var contactEmail = info.contact? info.contact.email : '';
    var licName= info.license? info.license.name : '';

    // import SectionBlock from './SectionBlock';
    // var data = [
    //   {dt: "Created by ", dd: info.contact.name}
    // ];
    return (
      <Section>
        <Heading tag="h2" align="start"> {info.title || ''} </Heading>
        <Paragraph> {info.description || ''} </Paragraph>
        <div><div style= {{display : 'inline'}} >Created by </div> {contactName}</div>
        <div> {licName} </div>
      </Section>
    );
  }
};

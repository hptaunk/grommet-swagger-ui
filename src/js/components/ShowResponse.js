import React, { Component } from 'react';
import {Box} from './Grommet';
// import TryOut from './TryOut';
const CLASS_ROOT = 'showresponse';
export default class ShowResponse extends Component {

  render() {
    if (!this.props.response) {
      return null;
    }
    const {url, content, contentType, status, headers, curl} = this.props.response;


    debugger;
    var respHeader;
    if (headers) {
      var tmp = {};
      headers.forEach((val,head) => {
        tmp[head] = val;
      });
      respHeader = _.escape(JSON.stringify(tmp, null, '  ')).replace(/\n/g, '<br>');
    }
    // {{#if showRequestHeaders}}
    // <h4 data-sw-translate>Request Headers</h4>
    // <div className='block request_headers'></div>
    // {{/if}}
    if(url === undefined) {
      return null;
    } else {
      var pre;
      if (!content) {
        pre = renderCode('no content');
        // JSON
      } else if (contentType === 'application/json' || /\+json$/.test(contentType)) {
        var json = null;
        try {
          json = JSON.stringify((typeof content === 'string')? JSON.parse(content) : content, null, '  ');
        } catch (_error) {
          json = 'can\'t parse JSON.  Raw result:\n\n' + content;
        }
        pre = renderCode(json);
        // XML
      } else if (contentType === 'application/xml' || /\+xml$/.test(contentType)) {
        pre = renderCode(formatXml(content));
        // HTML
      } else if (contentType === 'text/html') {
        pre = renderCode(_.escape(content));

        // Plain Text
      } else if (/text\/plain/.test(contentType)) {
        pre = renderCode(content);
        // Image
      } else if (/^image\//.test(contentType)) {
        pre = (<img src ={url} />);

        // Audio
      } else if (/^audio\//.test(contentType) && supportsAudioPlayback(contentType)) {
        //pre = $('<audio controls>').append($('<source>').attr('src', url).attr('type', contentType));

        // Download
      } else if (headers['Content-Disposition'] && (/attachment/).test(headers['Content-Disposition']) ||
          headers['content-disposition'] && (/attachment/).test(headers['content-disposition']) ||
          headers['Content-Description'] && (/File Transfer/).test(headers['Content-Description']) ||
          headers['content-description'] && (/File Transfer/).test(headers['content-description'])) {

        if ('Blob' in window) {
          var type = contentType || 'text/html';
          var blob = new Blob([content], {type: type});
          var a = document.createElement('a');
          var href = window.URL.createObjectURL(blob);
          var fileName = response.url.substr(response.url.lastIndexOf('/') + 1);
          var download = [type, fileName, href].join(':');

          // Use filename from response header
          var disposition = headers['content-disposition'] || headers['Content-Disposition'];
          if(typeof disposition !== 'undefined') {
            var responseFilename = /filename=([^;]*);?/.exec(disposition);
            if(responseFilename !== null && responseFilename.length > 1) {
              download = responseFilename[1];
            }
          }

          a.setAttribute('href', href);
          a.setAttribute('download', download);
          a.innerText = 'Download ' + fileName;

          pre = (<div> {a} </div>);
        } else {
          pre = ('Download headers detected but your browser does not support downloading binary via XHR (Blob).');
        }

        // Location header based redirect download
      } else if(headers.location || headers.Location) {
        window.location = response.url;

        // Anything else (CORS)
      } else {
        pre = renderCode(content);
      }
      return (
        <Box className={CLASS_ROOT}>
        <h4 className='summary'>Curl</h4>
        <div className= {CLASS_ROOT + '_curl'}> <pre><code>{curl} </code> </pre></div>
        <h4 className='summary'>Request URL</h4>
        <div className={CLASS_ROOT + '_url'}>
          <pre>{url}</pre>
        </div>
        <h4 className='summary'>Response Body</h4>
        <div className={CLASS_ROOT + '_body'}> <pre>{pre}</pre></div>
        <h4 className='summary'>Response Code</h4>
        <div className={CLASS_ROOT + '_code'}> <pre>{status}</pre></div>
        <h4 className='summary'>Response Headers</h4>
        <div className={CLASS_ROOT + '_headers'}><pre><code dangerouslySetInnerHTML={{ __html: respHeader }} /> </pre></div>
        </Box>
      );
    }
  }
};

const renderCode = (child) => {
  return (<code> {child} </code>);
};

const formatXml = (xml) => {
  var contexp, fn, formatted, indent, l, lastType, len, lines, ln, reg, transitions, wsexp; //pad,
  reg = /(>)(<)(\/*)/g;
  wsexp = /[ ]*(.*)[ ]+\n/g;
  contexp = /(<.+>)(.+\n)/g;
  xml = xml.replace(/\r\n/g, '\n').replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
  // pad = 0;
  formatted = '';
  lines = xml.split('\n');
  indent = 0;
  lastType = 'other';
  transitions = {
    'single->single': 0,
    'single->closing': -1,
    'single->opening': 0,
    'single->other': 0,
    'closing->single': 0,
    'closing->closing': -1,
    'closing->opening': 0,
    'closing->other': 0,
    'opening->single': 1,
    'opening->closing': 0,
    'opening->opening': 1,
    'opening->other': 1,
    'other->single': 0,
    'other->closing': -1,
    'other->opening': 0,
    'other->other': 0
  };
  fn = function(ln) {
    var fromTo, key, padding, type, types, value;
    types = {
      single: Boolean(ln.match(/<.+\/>/)),
      closing: Boolean(ln.match(/<\/.+>/)),
      opening: Boolean(ln.match(/<[^!?].*>/))
    };
    type = ((function() {
      var results;
      results = [];
      for (key in types) {
        value = types[key];
        if (value) {
          results.push(key);
        }
      }
      return results;
    })())[0];
    type = type === void 0 ? 'other' : type;
    fromTo = lastType + '->' + type;
    lastType = type;
    padding = '';
    indent += transitions[fromTo];
    padding = ((function() {
      var m, ref1, results;
      results = [];
      for (var j = m = 0, ref1 = indent; 0 <= ref1 ? m < ref1 : m > ref1; j = 0 <= ref1 ? ++m : --m) {
        results.push('  ');
        console.debug(j);
      }
      return results;
    })()).join('');
    if (fromTo === 'opening->closing') {
      formatted = formatted.substr(0, formatted.length - 1) + ln + '\n';
    } else {
      formatted += padding + ln + '\n';
    }
  };
  for (l = 0, len = lines.length; l < len; l++) {
    ln = lines[l];
    fn(ln);
  }
  return formatted;
};

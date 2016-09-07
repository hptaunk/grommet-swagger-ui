import React, { Component, PropTypes } from 'react';
import MainView from './MainView';
import { headers, processStatus } from 'grommet/utils/Rest';
import Swagger from 'swagger-client';
export default class SwaggerUI extends Component {

  constructor (props) {
    super(props);
    this.state = {
      uri: props.uri
    };
  }
  componentWillMount() {
    this.options = {};
    if(this.props.options) {
      var opj = this.defaultProps();
      for (var key in opj) {
        if (this.props.options.hasOwnProperty(key)) {
          this.options[key] = this.props.options[key];
        } else {
          this.options[key] = opj[key];
        }
      }
    } else {
      this.options = this.defaultProps();
    }
  }
  componentDidMount() {
    console.log('SwaggerUI - ComponentDidMount');
    //
    if (this.props.url) {
      this.options.url = this.props.url;
      var that = this;
      this.options.success = function(e) {
        if (this.isBuilt) {
          that.setState({apiClient: api});
        }
      };
      this.options.onFailure = function(e) {
        console.error(e);
      };
      var api = new Swagger(this.options);
    }
  }
  _onTryNow(event) {
    console.log(event);
    var request = {
      url: event.url,
      method: event.method,
      success: event.success,
      failure: event.failure
    };

    // var path = event.path;


    // var querystring = [];
    // for (var key in event.params) {
    //   if (event.params.hasOwnProperty(key)) {
    //     var obj = event.params[key];
    //     if (obj.paramType == "path") {
    //       var rgx = new RegExp("{" + key + "}", 'ig');
    //       path = path.replace(rgx, obj.value);
    //     } else if (obj.paramType == "query") {
    //       querystring.push(key +"=" + obj.value);
    //     }
    //   }
    // }
    // if (querystring.length > 1) {
    //   path += '?' + querystring.join('&');
    // }
    // request.path = path;

    // debugger;
    // const options = { method: request.method};
    // var newHeader = {...headers,
    //   "date": new Date().toString()
    // };
    //   // "cache-control": "no-cache",
    //   // "transfer-encoding": "chunked",
    //   // "connection": "keep-alive",
    // if (newHeader) {
    //   options.headers = newHeader;
    // }

    for (var key in event.headers) {
      if (event.headers.hasOwnProperty(key)) {
        headers[key] = event.headers[key];
      }
    }
    const options = { method: request.method, headers: headers};
    if (event.body) {
      options.body = event.body.value;
    }
    debugger;
    fetch(request.url, options)
    .then(processStatus)
    .then(request.success)
    .catch(request.failure);

    // Rest.get(request.uri + request.path, options)
    // .end(function(err, res) {
    //     if (err) {
    //       request.failure(err);
    //     }
    //     if (res && res.ok) {
    //       request.success(res);
    //       // if (res.body != null) {
    //       //   success(res.body);
    //       // } else {
    //       //   success(res.text);
    //       // }
    //     }
    //   });

  }
  render() {
    return this.state.apiClient? (<MainView apiClient={this.state.apiClient} options={this.options} onTryNow={this._onTryNow.bind(this)}/>) : null;
  }
};

SwaggerUI.propTypes = {
  options : PropTypes.shape({
    docExpansion: PropTypes.string,
    apisSorter: PropTypes.string,
    showRequestHeaders: PropTypes.bool,
    supportedSubmitMethods:PropTypes.arrayOf(PropTypes.string),
    defaultModelRendering: PropTypes.string,
    highlightSizeThreshold: PropTypes.number
  })
};


SwaggerUI.prototype.defaultProps = () => {
  return {
    docExpansion: "none",
    apisSorter: "alpha",
    showRequestHeaders: false,
    supportedSubmitMethods:['get', 'post', 'put', 'delete', 'patch'],
    defaultModelRendering: 'schema',
    highlightSizeThreshold: 10000,
    enableCookies: false
  };
};

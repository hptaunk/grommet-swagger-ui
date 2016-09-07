import React, { Component } from 'react';
import {Box, Button} from './Grommet';
import Signature from '../Util/Signature';
import Util from '../Util/Util';
import RequestHeaders from './RequestHeaders';
import TypeView from './TypeView';
import ParameterView from './ParameterView';
import ResponseMessage from './ResponseMessage';
import ShowResponse from './ShowResponse';
export default class OperationView extends Component {
  constructor(props) {
    super(props);
    this._onTryNow = this._onTryNow.bind(this);
    this._onParameterChange = this._onParameterChange.bind(this);
    this.paramState = {};
    this.map = {};
    this.state = {host: props.model.host, scheme: props.model.scheme, basePath: props.model.basePath, path: props.model.path, requestContentType: undefined, responseContentType: "application/json", method:  props.model.method,
    enableCookies: false};
  }
  _validate() {
    // var ps = this.paramState;
    var flag = true;
    this.props.model.parameters.forEach(function (p) {
      var _val = this.paramState[p.name];
      if(_val && _val.value && _val.value.length > 0) {
        p.defaultVal = p.default = _val.value;
      } else if (p.required) {
        flag = false;
      } else {
        this.paramState[p.name] =  p.default;
        //{value: p.default, paramType: p.paramType};
      }
    }, this);
    return flag;
  }
  _onTryNow() {
    if (this._validate()) {
      var obj = this.execute(this.paramState, this.options);
      if (this.props.onTryNow) {
        this.props.onTryNow(obj);
      }
    }
  }

  onTrySuccess(response) {
    console.log(response);
    response.json().then((data) => {
      var contentType, curlCommand;
      if (response.headers) {
        contentType = response.headers.get('Content-Type') || response.headers.get('content-type');
        if (contentType) {
          contentType = contentType.split(';')[0].trim();
        }
      }

      curlCommand = this.asCurl(this.paramState, {responseContentType: contentType});
      curlCommand = curlCommand.replace('!', '&#33;');

      this.setState({TryoutResponse:{url: response.url, content: data, contentType: contentType, headers: response.headers, status: response.status, curl: curlCommand}});
    });
  }

  onTryFailure(err) {
    console.log(err);
    debugger;
  }
  _onParameterChange(obj) {
    this.paramState = obj;
  }
  _renderDescription(id, deprecated, description) {
    var deprc;
    var desc = [];
    if (deprecated) {
      deprc = (<h4 >Warning: Deprecated</h4>);
    }

    if (description) {
      desc.push(<h4 key={id + '_des_2'} className='summary'>Implementation Notes</h4>);
      desc.push(<div key={id + '_des_21'}>{description}</div>);
    }
    return (
      <section>
        {deprc}
        {desc}
      </section>
    );
  }

  render() {
    const {model, options} = this.props;
    console.log(model);
    this.host = model.host;
    this.scheme = model.scheme;
    this.basePath = model.basePath;
    this.path = model.path;
    this.method = model.method;
    this.options = options;
    this.consumes = model.consumes;
    this.produces = model.produces;
    this.security = model.security;
    this.parameters = model.parameters;

    var typeModel = {};
    var ref2, ref3, ref4, ref5, code, value, schemaObj, schema, param, type,
      isXML, isJSON, key, statusCode, produces, successResponse, signatureModel, contentTypeModel;
    //ResponseMessage.
    if (typeof model.responses !== 'undefined') {
      model.responseMessages = [];
      ref2 = model.responses;
      for (code in ref2) {
        value = ref2[code];
        schema = null;
        schemaObj = model.responses[code].schema;
        if (schemaObj && schemaObj.$ref) {
          schema = schemaObj.$ref;
          if (schema.indexOf('#/definitions/') !== -1) {
            schema = schema.replace(/^.*#\/definitions\//, '');
          }
        }
        model.responseMessages.push({
          code: code,
          message: value.description,
          responseModel: schema,
          headers: value.headers,
          schema: schemaObj
        });
      }
    }
    if (typeof model.responseMessages === 'undefined') {
      model.responseMessages = [];
    }
    //ResponseMessage -- end.
    //Type
    produces = model.produces;
    isXML = Util.contains(produces, 'xml');
    isJSON = isXML ? Util.contains(produces, 'json') : true;
    if (model.successResponse) {
      successResponse = model.successResponse;
      for (key in successResponse) {
        value = successResponse[key];
        model.successCode = key;
        if (typeof value === 'object' && typeof value.createJSONSample === 'function') {
          model.successDescription = value.description;
          // model.headers = this.parseResponseHeaders(value.headers);
          signatureModel = {
            sampleJSON: isJSON ? JSON.stringify(Signature.createJSONSample(value), void 0, 2) : false,
            isParam: false,
            sampleXML: isXML ? Signature.createXMLSample(value.name, value.definition, value.models) : false,
            signature: Signature.getModelSignature(value.name, value.definition, value.models, value.modelPropertyMacro)
          };
        } else {
          signatureModel = {
            signature: Signature.getPrimitiveSignature(value)
          };
        }
      }

    } else if (model.responseClassSignature && model.responseClassSignature !== 'string') {
      signatureModel = {
        sampleJSON: model.responseSampleJSON,
        isParam: false,
        signature: model.responseClassSignature
      };
    }

    // signatureModel Views
    if (signatureModel) {
      signatureModel.defaultRendering = model.defaultRendering;
    } else {
      model.responseClassSignature = 'string';
      //TODO
      //model.type
    }
    typeModel.successCode= model.successCode;
    typeModel.successDescription= model.successDescription;

    typeModel.signatureModel = signatureModel;
    contentTypeModel = {
      isParam: false
    };
    contentTypeModel.consumes = model.consumes;
    contentTypeModel.produces = model.produces;

    ref3 = model.parameters;
    for (var n = 0, len2 = ref3.length; n < len2; n++) {
      param = ref3[n];
      type = param.type || param.dataType || '';
      if (typeof type === 'undefined') {
        schema = param.schema;
        if (schema && schema.$ref) {
          ref = schema.$ref;
          if (ref.indexOf('#/definitions/') === 0) {
            type = ref.substring('#/definitions/'.length);
          } else {
            type = ref;
          }
        }
      }
      if (type && type.toLowerCase() === 'file') {
        if (!contentTypeModel.consumes) {
          contentTypeModel.consumes = 'multipart/form-data';
        }
      }
      param.type = type;
    }
    typeModel.contentTypeModel = contentTypeModel;
    //Type -- end

    ref4 = model.parameters;
    var parametersModel = [];
    for (var p = 0, len3 = ref4.length; p < len3; p++) {
      param = ref4[p];
      param.consumes = contentTypeModel.consumes;
      param.defaultRendering = model.defaultRendering;
      if(param.schema) {
        Util.extend(true, param.schema, model.definitions[param.type]);
        param.schema.definitions = model.definitions;
        // This is required for JsonEditor to display the root properly
        if(!param.schema.type) {
          param.schema.type = 'object';
        }
        // This is the title that will be used by JsonEditor for the root
        // Since we already display the parameter's name in the Parameter column
        // We set this to space, we can't set it to null or space otherwise JsonEditor
        // will replace it with the text "root" which won't look good on screen
        if(!param.schema.title) {
          param.schema.title = ' ';
        }
      }
      //,
      //swaggerOptions: options.swaggerOptions
      parametersModel.push ({
        model: param,
        readOnly: model.isReadOnly
      });
    }

    //Response Message.
    var responseMsgModel = [];
    ref5 = model.responseMessages;
    for (var q = 0, len4 = ref5.length; q < len4; q++) {
      statusCode = ref5[q];
      statusCode.isXML = isXML;
      statusCode.isJSON = isJSON;
      if (!_.isUndefined(statusCode.headers)) {
        statusCode.headers = Util.parseHeadersType(statusCode.headers);
      }
      statusCode.defaultRendering = model.defaultRendering;
      // tagName: 'tr',
      // router: this.router
      responseMsgModel.push (
        {
          model: statusCode,
          router: model.router
        }
      );
    }
    // debugger;
    if (this.options.showRequestHeaders) {

    }

    var description = this._renderDescription(model.id, model.deprecated, model.description);
    var _type = (<TypeView model={typeModel} />);
    var _headers = (<RequestHeaders />);
    var _params = (<ParameterView model={parametersModel} onParameterChange = {this._onParameterChange}/>);
    var _responseMsg = (<ResponseMessage model={responseMsgModel}/>);
    return (
      <Box pad={{horizontal: 'large'}}>
        {description}
        {_type}
        {_headers}
        {_params}
        {_responseMsg}
        <Button className="trynow" primary={true} label="Try it out!" onClick={this._onTryNow} />
        <ShowResponse response={this.state.TryoutResponse}/>
      </Box>
    );
  }
};

OperationView.propTypes = {
  onTryNow : React.PropTypes.func
};

OperationView.prototype.asCurl = function(args1, args2) {
  var opts = {
    mock: true
  };
  if (typeof args2 === 'object') {
    for (var argKey in args2) {
      opts[argKey] = args2[argKey];
    }
  }
  var obj = this.execute(args1, opts);
  if (this.clientAuthorizations) {
    this.clientAuthorizations.apply(obj, this.operation.security);
  }

  var results = [];
  results.push('-X ' + this.method.toUpperCase());
  if (typeof obj.headers !== 'undefined') {
    var key;
    for (key in obj.headers) {
      var value = obj.headers[key];
      if (typeof value === 'string') {
        value = value.replace(/\'/g, '\\u0027');
      }
      results.push('--header \'' + key + ': ' + value + '\'');
    }
  }
  if (obj.body) {
    var body;
    if (_.isObject(obj.body)) {
      body = JSON.stringify(obj.body);
    } else {
      body = obj.body;
    }
    results.push('-d \'' + body.replace(/\'/g, '\\u0027') + '\'');
  }
  return 'curl ' + (results.join(' ')) + ' \'' + obj.url + '\'';
};

OperationView.prototype.setContentTypes = function (args, opts) {
  // default type
  var allDefinedParams = this.parameters;
  var body;
  var consumes = args.parameterContentType || itemByPriority(this.consumes, ['application/json', 'application/yaml']);
  var accepts = opts.responseContentType || itemByPriority(this.produces, ['application/json', 'application/yaml']);
  var definedFileParams = [];
  var definedFormParams = [];
  var headers = {};
  var i;

  // get params from the operation and set them in definedFileParams, definedFormParams, headers
  for (i = 0; i < allDefinedParams.length; i++) {
    var param = allDefinedParams[i];

    if (param.in === 'formData') {
      if (param.type === 'file') {
        definedFileParams.push(param);
      } else {
        definedFormParams.push(param);
      }
    } else if (param.in === 'header' && opts) {
      var key = param.name;
      var headerValue = opts[param.name];

      if (typeof opts[param.name] !== 'undefined') {
        headers[key] = headerValue;
      }
    } else if (param.in === 'body' && typeof args[param.name] !== 'undefined') {
      body = args[param.name];
    }
  }

  // if there's a body, need to set the consumes header via requestContentType
  var hasBody = body || definedFileParams.length || definedFormParams.length;
  if (this.method === 'post' || this.method === 'put' || this.method === 'patch' ||
      ((this.method === 'delete' || this.method === 'get') && hasBody)) {
    if (opts.requestContentType) {
      consumes = opts.requestContentType;
    }
    // if any form params, content type must be set
    if (definedFormParams.length > 0) {
      consumes = undefined;
      if (opts.requestContentType) {             // override if set
        consumes = opts.requestContentType;
      } else if (definedFileParams.length > 0) { // if a file, must be multipart/form-data
        consumes = 'multipart/form-data';
      } else {
        if (this.consumes && this.consumes.length > 0) {
          // use the consumes setting
          for(var c in this.consumes) {
            var chk = this.consumes[c];
            if(chk.indexOf('application/x-www-form-urlencoded') === 0 || chk.indexOf('multipart/form-data') === 0) {
              consumes = chk;
            }
          }
        }
      }
      if(typeof consumes === 'undefined') {
        // default to x-www-from-urlencoded
        consumes = 'application/x-www-form-urlencoded';
      }
    }
  } else {
    consumes = null;
  }

  if (consumes && this.consumes) {
    if (this.consumes.indexOf(consumes) === -1) {
      helpers.log('server doesn\'t consume ' + consumes + ', try ' + JSON.stringify(this.consumes));
    }
  }

  if (!this.matchesAccept(accepts)) {
    helpers.log('server can\'t produce ' + accepts);
  }

  if ((consumes && body !== '') || (consumes === 'application/x-www-form-urlencoded')) {
    headers['Content-Type'] = consumes;
  } else if(this.consumes && this.consumes.length > 0 && this.consumes[0] === 'application/x-www-form-urlencoded') {
    headers['Content-Type'] = this.consumes[0];
  }

  if (accepts) {
    headers.Accept = accepts;
  }

  return headers;
};

OperationView.prototype.getHeaderParams = function (args) {
  var headers = this.setContentTypes(args, {});
  for (var i = 0; i < this.parameters.length; i++) {
    var param = this.parameters[i];

    if (typeof args[param.name] !== 'undefined') {
      if (param.in === 'header') {
        var value = args[param.name];

        if (Array.isArray(value)) {
          value = value.toString();
        }

        headers[param.name] = value;
      }
    }
  }

  return headers;
};

OperationView.prototype.matchesAccept = function(accepts) {
  // no accepts or produces, no problem!
  if (!accepts || !this.produces) {
    return true;
  }
  return this.produces.indexOf(accepts) !== -1 || this.produces.indexOf('*/*') !== -1;
};

OperationView.prototype.urlify = function (args) {
  var formParams = {};
  var requestUrl = this.path.replace(/#.*/, ''); // remove URL fragment
  var querystring = ''; // grab params from the args, build the querystring along the way

  for (var i = 0; i < this.parameters.length; i++) {
    var param = this.parameters[i];

    if (typeof args[param.name] !== 'undefined') {
      if (param.in === 'path') {
        var reg = new RegExp('\{' + param.name + '\}', 'gi');
        var value = args[param.name];

        if (Array.isArray(value)) {
          value = this.encodePathCollection(param.collectionFormat, param.name, value);
        } else {
          value = this.encodePathParam(value);
        }

        requestUrl = requestUrl.replace(reg, value);
      } else if (param.in === 'query' && typeof args[param.name] !== 'undefined') {
        if (querystring === '' && requestUrl.indexOf('?') < 0) {
          querystring += '?';
        } else {
          querystring += '&';
        }

        if (typeof param.collectionFormat !== 'undefined') {
          var qp = args[param.name];

          if (Array.isArray(qp)) {
            querystring += this.encodeQueryCollection(param.collectionFormat, param.name, qp);
          } else {
            querystring += this.encodeQueryKey(param.name) + '=' + this.encodeQueryParam(args[param.name]);
          }
        } else {
          querystring += this.encodeQueryKey(param.name) + '=' + this.encodeQueryParam(args[param.name]);
        }
      } else if (param.in === 'formData') {
        formParams[param.name] = args[param.name];
      }
    }
  }
  var url = this.scheme + '://' + this.host;

  if (this.basePath !== '/') {
    url += this.basePath;
  }
  return url + requestUrl + querystring;
};

OperationView.prototype.getMissingParams = function (args) {
  var missingParams = []; // check required params, track the ones that are missing
  var i;

  for (i = 0; i < this.parameters.length; i++) {
    var param = this.parameters[i];

    if (param.required === true) {
      if (typeof args[param.name] === 'undefined') {
        missingParams = param.name;
      }
    }
  }

  return missingParams;
};

OperationView.prototype.getBody = function (headers, args, opts) {
  var formParams = {}, hasFormParams, body, key, value, hasBody = false;

  // look at each param and put form params in an object
  for (var i = 0; i < this.parameters.length; i++) {
    var param = this.parameters[i];
    if (typeof args[param.name] !== 'undefined') {
      if (param.in === 'body') {
        body = args[param.name];
      } else if (param.in === 'formData') {
        formParams[param.name] = {
          param: param,
          value: args[param.name]
        };
        hasFormParams = true;
      }
    } else {
      if(param.in === 'body') {
        hasBody = true;
      }
    }
  }

  // if body is null and hasBody is true, AND a JSON body is requested, send empty {}
  if(hasBody && typeof body === 'undefined') {
    var contentType = headers['Content-Type'];
    if(contentType && contentType.indexOf('application/json') === 0) {
      body = '{}';
    }
  }

  var isMultiPart = false;
  if(headers['Content-Type'] && headers['Content-Type'].indexOf('multipart/form-data') >= 0) {
    isMultiPart = true;
  }

  // handle form params
  if (hasFormParams && !isMultiPart) {
    var encoded = '';

    for (key in formParams) {
      var param = formParams[key].param;
      value = formParams[key].value;

      if (typeof value !== 'undefined') {
        if (Array.isArray(value)) {
          if (encoded !== '') {
            encoded += '&';
          }
          encoded += this.encodeQueryCollection(param.collectionFormat, key, value);
        } else {
          if (encoded !== '') {
            encoded += '&';
          }

          encoded += encodeURIComponent(key) + '=' + encodeURIComponent(value);
        }
      }
    }

    body = encoded;
  } else if (isMultiPart) {
    if (typeof FormData === 'function') {
      var bodyParam = new FormData();

      bodyParam.type = 'formData';

      for (key in formParams) {
        value = args[key];

        if (typeof value !== 'undefined') {
          if({}.toString.apply(value) === '[object File]') {
            bodyParam.append(key, value);
          } else if (value.type === 'file' && value.value) {
            bodyParam.append(key, value.value);
          } else {
            if (Array.isArray(value)) {
              bodyParam.append(key, this.encodeQueryCollection(param.collectionFormat, key, value));
            } else {
              bodyParam.append(key, value);
            }
          }
        }
      }
      body = bodyParam;
    } else {
      bodyParam = {};
      for (key in formParams) {
        value = args[key];
        if (Array.isArray(value)) {
          var delimeter;
          var format = param.collectionFormat || 'multi';
          if(format === 'ssv') {
            delimeter = ' ';
          } else if(format === 'pipes') {
            delimeter = '|';
          } else if(format === 'tsv') {
            delimeter = '\t';
          } else {
            delimeter = ',';
          }
          var data;
          value.forEach(function(v) {
            if(data) {
              data += delimeter;
            }     else {
              data = '';
            }
            data += v;
          });
          bodyParam[key] = data;
        } else {
          bodyParam[key] = value;
        }
      }
      body = bodyParam;
    }
    headers['Content-Type'] = 'multipart/form-data';
  }

  return body;
};

OperationView.prototype.execute = function (args1, args2) {
  var opts = args2 || {};
  var args = args1;

  if(this.props.model.router) {
    opts.client = this.props.model.router;
  }

  var allHeaders = this.getHeaderParams(args);
  var contentTypeHeaders = this.setContentTypes(args, opts);
  var headers = {}, attrname;

  for (attrname in allHeaders) {
    headers[attrname] = allHeaders[attrname];
  }

  for (attrname in contentTypeHeaders) {
    headers[attrname] = contentTypeHeaders[attrname];
  }

  var body = this.getBody(contentTypeHeaders, args, opts);
  var url = this.urlify(args);

  if(url.indexOf('.{format}') > 0) {
    if(headers) {
      var format = headers.Accept || headers.accept;
      if(format && format.indexOf('json') > 0) {
        url = url.replace('.{format}', '.json');
      } else if(format && format.indexOf('xml') > 0) {
        url = url.replace('.{format}', '.xml');
      }
    }
  }

  return {
    url: url,
    method: this.method.toUpperCase(),
    body: body,
    enableCookies: opts.enableCookies,
    useJQuery: opts.useJQuery,
    jqueryAjaxCache: opts.jqueryAjaxCache,
    headers: headers,
    clientAuthorizations: opts.clientAuthorizations,
    success: this.onTrySuccess.bind(this),
    failure: this.onTryFailure.bind(this)
  };
};

OperationView.prototype.encodePathCollection = function (type, name, value) {
  var encoded = '';
  var i;
  var separator = '';

  if (type === 'ssv') {
    separator = '%20';
  } else if (type === 'tsv') {
    separator = '%09';
  } else if (type === 'pipes') {
    separator = '|';
  } else {
    separator = ',';
  }

  for (i = 0; i < value.length; i++) {
    if (i === 0) {
      encoded = this.encodeQueryParam(value[i]);
    } else {
      encoded += separator + this.encodeQueryParam(value[i]);
    }
  }

  return encoded;
};

OperationView.prototype.encodeQueryCollection = function (type, name, value) {
  var encoded = '';
  var i;

  type = type || 'default';
  if (type === 'default' || type === 'multi') {
    for (i = 0; i < value.length; i++) {
      if (i > 0) {
        encoded += '&';
      }
      encoded += this.encodeQueryKey(name) + '=' + this.encodeQueryParam(value[i]);
    }
  } else {
    var separator = '';

    if (type === 'csv') {
      separator = ',';
    } else if (type === 'ssv') {
      separator = '%20';
    } else if (type === 'tsv') {
      separator = '%09';
    } else if (type === 'pipes') {
      separator = '|';
    } else if (type === 'brackets') {
      for (i = 0; i < value.length; i++) {
        if (i !== 0) {
          encoded += '&';
        }
        encoded += this.encodeQueryKey(name) + '[]=' + this.encodeQueryParam(value[i]);
      }
    }

    if (separator !== '') {
      for (i = 0; i < value.length; i++) {
        if (i === 0) {
          encoded = this.encodeQueryKey(name) + '=' + this.encodeQueryParam(value[i]);
        } else {
          encoded += separator + this.encodeQueryParam(value[i]);
        }
      }
    }
  }

  return encoded;
};

OperationView.prototype.encodeQueryKey = function (arg) {
  return encodeURIComponent(arg)
      .replace('%5B','[').replace('%5D', ']').replace('%24', '$');
};

OperationView.prototype.encodeQueryParam = function (arg) {
  return encodeURIComponent(arg);
};

/**
 * TODO revisit, might not want to leave '/'
 **/
OperationView.prototype.encodePathParam = function (pathParam) {
  return encodeURIComponent(pathParam);
};

function itemByPriority(col, itemPriority) {

  // No priorities? return first...
  if(_.isEmpty(itemPriority)) {
    return col[0];
  }

  for (var i = 0, len = itemPriority.length; i < len; i++) {
    if(col.indexOf(itemPriority[i]) > -1) {
      return itemPriority[i];
    }
  }

  // Otherwise return first
  return col[0];
}


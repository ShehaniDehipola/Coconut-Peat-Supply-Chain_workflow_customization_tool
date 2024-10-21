/**
 * @fileoverview gRPC-Web generated client stub for plugin
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.5.0
// 	protoc              v5.28.2
// source: plugin.proto


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.plugin = require('./plugin_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.plugin.PluginServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname.replace(/\/+$/, '');

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.plugin.PluginServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname.replace(/\/+$/, '');

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.plugin.RegisterPluginRequest,
 *   !proto.plugin.PluginResponse>}
 */
const methodDescriptor_PluginService_RegisterChildPlugin = new grpc.web.MethodDescriptor(
  '/plugin.PluginService/RegisterChildPlugin',
  grpc.web.MethodType.UNARY,
  proto.plugin.RegisterPluginRequest,
  proto.plugin.PluginResponse,
  /**
   * @param {!proto.plugin.RegisterPluginRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.plugin.PluginResponse.deserializeBinary
);


/**
 * @param {!proto.plugin.RegisterPluginRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.plugin.PluginResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.plugin.PluginResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.plugin.PluginServiceClient.prototype.registerChildPlugin =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/plugin.PluginService/RegisterChildPlugin',
      request,
      metadata || {},
      methodDescriptor_PluginService_RegisterChildPlugin,
      callback);
};


/**
 * @param {!proto.plugin.RegisterPluginRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.plugin.PluginResponse>}
 *     Promise that resolves to the response
 */
proto.plugin.PluginServicePromiseClient.prototype.registerChildPlugin =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/plugin.PluginService/RegisterChildPlugin',
      request,
      metadata || {},
      methodDescriptor_PluginService_RegisterChildPlugin);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.plugin.ExecuteGradingRequest,
 *   !proto.plugin.ExecuteGradingResponse>}
 */
const methodDescriptor_PluginService_ExecuteGrading = new grpc.web.MethodDescriptor(
  '/plugin.PluginService/ExecuteGrading',
  grpc.web.MethodType.UNARY,
  proto.plugin.ExecuteGradingRequest,
  proto.plugin.ExecuteGradingResponse,
  /**
   * @param {!proto.plugin.ExecuteGradingRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.plugin.ExecuteGradingResponse.deserializeBinary
);


/**
 * @param {!proto.plugin.ExecuteGradingRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.plugin.ExecuteGradingResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.plugin.ExecuteGradingResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.plugin.PluginServiceClient.prototype.executeGrading =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/plugin.PluginService/ExecuteGrading',
      request,
      metadata || {},
      methodDescriptor_PluginService_ExecuteGrading,
      callback);
};


/**
 * @param {!proto.plugin.ExecuteGradingRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.plugin.ExecuteGradingResponse>}
 *     Promise that resolves to the response
 */
proto.plugin.PluginServicePromiseClient.prototype.executeGrading =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/plugin.PluginService/ExecuteGrading',
      request,
      metadata || {},
      methodDescriptor_PluginService_ExecuteGrading);
};


module.exports = proto.plugin;


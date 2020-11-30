var URIStorage = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
  var __commonJS = (callback, module) => () => {
    if (!module) {
      module = {exports: {}};
      callback(module.exports, module);
    }
    return module.exports;
  };
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name in all)
      __defProp(target, name, {get: all[name], enumerable: true});
  };
  var __exportStar = (target, module, desc) => {
    __markAsModule(target);
    if (typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
    }
    return target;
  };
  var __toModule = (module) => {
    if (module && module.__esModule)
      return module;
    return __exportStar(__defProp(__create(__getProtoOf(module)), "default", {value: module, enumerable: true}), module);
  };

  // node_modules/glob-to-regexp/index.js
  var require_glob_to_regexp = __commonJS((exports, module) => {
    module.exports = function(glob3, opts) {
      if (typeof glob3 !== "string") {
        throw new TypeError("Expected a string");
      }
      var str2 = String(glob3);
      var reStr = "";
      var extended = opts ? !!opts.extended : false;
      var globstar = opts ? !!opts.globstar : false;
      var inGroup = false;
      var flags = opts && typeof opts.flags === "string" ? opts.flags : "";
      var c2;
      for (var i = 0, len = str2.length; i < len; i++) {
        c2 = str2[i];
        switch (c2) {
          case "/":
          case "$":
          case "^":
          case "+":
          case ".":
          case "(":
          case ")":
          case "=":
          case "!":
          case "|":
            reStr += "\\" + c2;
            break;
          case "?":
            if (extended) {
              reStr += ".";
              break;
            }
          case "[":
          case "]":
            if (extended) {
              reStr += c2;
              break;
            }
          case "{":
            if (extended) {
              inGroup = true;
              reStr += "(";
              break;
            }
          case "}":
            if (extended) {
              inGroup = false;
              reStr += ")";
              break;
            }
          case ",":
            if (inGroup) {
              reStr += "|";
              break;
            }
            reStr += "\\" + c2;
            break;
          case "*":
            var prevChar = str2[i - 1];
            var starCount = 1;
            while (str2[i + 1] === "*") {
              starCount++;
              i++;
            }
            var nextChar = str2[i + 1];
            if (!globstar) {
              reStr += ".*";
            } else {
              var isGlobstar = starCount > 1 && (prevChar === "/" || prevChar === void 0) && (nextChar === "/" || nextChar === void 0);
              if (isGlobstar) {
                reStr += "((?:[^/]*(?:/|$))*)";
                i++;
              } else {
                reStr += "([^/]*)";
              }
            }
            break;
          default:
            reStr += c2;
        }
      }
      if (!flags || !~flags.indexOf("g")) {
        reStr = "^" + reStr + "$";
      }
      return new RegExp(reStr, flags);
    };
  });

  // node_modules/path-browserify/index.js
  var require_path_browserify = __commonJS((exports, module) => {
    "use strict";
    function assertPath(path5) {
      if (typeof path5 !== "string") {
        throw new TypeError("Path must be a string. Received " + JSON.stringify(path5));
      }
    }
    function normalizeStringPosix(path5, allowAboveRoot) {
      var res2 = "";
      var lastSegmentLength = 0;
      var lastSlash = -1;
      var dots = 0;
      var code;
      for (var i = 0; i <= path5.length; ++i) {
        if (i < path5.length)
          code = path5.charCodeAt(i);
        else if (code === 47)
          break;
        else
          code = 47;
        if (code === 47) {
          if (lastSlash === i - 1 || dots === 1) {
          } else if (lastSlash !== i - 1 && dots === 2) {
            if (res2.length < 2 || lastSegmentLength !== 2 || res2.charCodeAt(res2.length - 1) !== 46 || res2.charCodeAt(res2.length - 2) !== 46) {
              if (res2.length > 2) {
                var lastSlashIndex = res2.lastIndexOf("/");
                if (lastSlashIndex !== res2.length - 1) {
                  if (lastSlashIndex === -1) {
                    res2 = "";
                    lastSegmentLength = 0;
                  } else {
                    res2 = res2.slice(0, lastSlashIndex);
                    lastSegmentLength = res2.length - 1 - res2.lastIndexOf("/");
                  }
                  lastSlash = i;
                  dots = 0;
                  continue;
                }
              } else if (res2.length === 2 || res2.length === 1) {
                res2 = "";
                lastSegmentLength = 0;
                lastSlash = i;
                dots = 0;
                continue;
              }
            }
            if (allowAboveRoot) {
              if (res2.length > 0)
                res2 += "/..";
              else
                res2 = "..";
              lastSegmentLength = 2;
            }
          } else {
            if (res2.length > 0)
              res2 += "/" + path5.slice(lastSlash + 1, i);
            else
              res2 = path5.slice(lastSlash + 1, i);
            lastSegmentLength = i - lastSlash - 1;
          }
          lastSlash = i;
          dots = 0;
        } else if (code === 46 && dots !== -1) {
          ++dots;
        } else {
          dots = -1;
        }
      }
      return res2;
    }
    function _format(sep3, pathObject) {
      var dir2 = pathObject.dir || pathObject.root;
      var base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
      if (!dir2) {
        return base;
      }
      if (dir2 === pathObject.root) {
        return dir2 + base;
      }
      return dir2 + sep3 + base;
    }
    var posix = {
      resolve: function resolve3() {
        var resolvedPath = "";
        var resolvedAbsolute = false;
        var cwd;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path5;
          if (i >= 0)
            path5 = arguments[i];
          else {
            if (cwd === void 0)
              cwd = process.cwd();
            path5 = cwd;
          }
          assertPath(path5);
          if (path5.length === 0) {
            continue;
          }
          resolvedPath = path5 + "/" + resolvedPath;
          resolvedAbsolute = path5.charCodeAt(0) === 47;
        }
        resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
        if (resolvedAbsolute) {
          if (resolvedPath.length > 0)
            return "/" + resolvedPath;
          else
            return "/";
        } else if (resolvedPath.length > 0) {
          return resolvedPath;
        } else {
          return ".";
        }
      },
      normalize: function normalize3(path5) {
        assertPath(path5);
        if (path5.length === 0)
          return ".";
        var isAbsolute = path5.charCodeAt(0) === 47;
        var trailingSeparator = path5.charCodeAt(path5.length - 1) === 47;
        path5 = normalizeStringPosix(path5, !isAbsolute);
        if (path5.length === 0 && !isAbsolute)
          path5 = ".";
        if (path5.length > 0 && trailingSeparator)
          path5 += "/";
        if (isAbsolute)
          return "/" + path5;
        return path5;
      },
      isAbsolute: function isAbsolute(path5) {
        assertPath(path5);
        return path5.length > 0 && path5.charCodeAt(0) === 47;
      },
      join: function join3() {
        if (arguments.length === 0)
          return ".";
        var joined;
        for (var i = 0; i < arguments.length; ++i) {
          var arg = arguments[i];
          assertPath(arg);
          if (arg.length > 0) {
            if (joined === void 0)
              joined = arg;
            else
              joined += "/" + arg;
          }
        }
        if (joined === void 0)
          return ".";
        return posix.normalize(joined);
      },
      relative: function relative3(from, to) {
        assertPath(from);
        assertPath(to);
        if (from === to)
          return "";
        from = posix.resolve(from);
        to = posix.resolve(to);
        if (from === to)
          return "";
        var fromStart = 1;
        for (; fromStart < from.length; ++fromStart) {
          if (from.charCodeAt(fromStart) !== 47)
            break;
        }
        var fromEnd = from.length;
        var fromLen = fromEnd - fromStart;
        var toStart = 1;
        for (; toStart < to.length; ++toStart) {
          if (to.charCodeAt(toStart) !== 47)
            break;
        }
        var toEnd = to.length;
        var toLen = toEnd - toStart;
        var length = fromLen < toLen ? fromLen : toLen;
        var lastCommonSep = -1;
        var i = 0;
        for (; i <= length; ++i) {
          if (i === length) {
            if (toLen > length) {
              if (to.charCodeAt(toStart + i) === 47) {
                return to.slice(toStart + i + 1);
              } else if (i === 0) {
                return to.slice(toStart + i);
              }
            } else if (fromLen > length) {
              if (from.charCodeAt(fromStart + i) === 47) {
                lastCommonSep = i;
              } else if (i === 0) {
                lastCommonSep = 0;
              }
            }
            break;
          }
          var fromCode = from.charCodeAt(fromStart + i);
          var toCode = to.charCodeAt(toStart + i);
          if (fromCode !== toCode)
            break;
          else if (fromCode === 47)
            lastCommonSep = i;
        }
        var out = "";
        for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
          if (i === fromEnd || from.charCodeAt(i) === 47) {
            if (out.length === 0)
              out += "..";
            else
              out += "/..";
          }
        }
        if (out.length > 0)
          return out + to.slice(toStart + lastCommonSep);
        else {
          toStart += lastCommonSep;
          if (to.charCodeAt(toStart) === 47)
            ++toStart;
          return to.slice(toStart);
        }
      },
      _makeLong: function _makeLong(path5) {
        return path5;
      },
      dirname: function dirname3(path5) {
        assertPath(path5);
        if (path5.length === 0)
          return ".";
        var code = path5.charCodeAt(0);
        var hasRoot = code === 47;
        var end = -1;
        var matchedSlash = true;
        for (var i = path5.length - 1; i >= 1; --i) {
          code = path5.charCodeAt(i);
          if (code === 47) {
            if (!matchedSlash) {
              end = i;
              break;
            }
          } else {
            matchedSlash = false;
          }
        }
        if (end === -1)
          return hasRoot ? "/" : ".";
        if (hasRoot && end === 1)
          return "//";
        return path5.slice(0, end);
      },
      basename: function basename3(path5, ext2) {
        if (ext2 !== void 0 && typeof ext2 !== "string")
          throw new TypeError('"ext" argument must be a string');
        assertPath(path5);
        var start = 0;
        var end = -1;
        var matchedSlash = true;
        var i;
        if (ext2 !== void 0 && ext2.length > 0 && ext2.length <= path5.length) {
          if (ext2.length === path5.length && ext2 === path5)
            return "";
          var extIdx = ext2.length - 1;
          var firstNonSlashEnd = -1;
          for (i = path5.length - 1; i >= 0; --i) {
            var code = path5.charCodeAt(i);
            if (code === 47) {
              if (!matchedSlash) {
                start = i + 1;
                break;
              }
            } else {
              if (firstNonSlashEnd === -1) {
                matchedSlash = false;
                firstNonSlashEnd = i + 1;
              }
              if (extIdx >= 0) {
                if (code === ext2.charCodeAt(extIdx)) {
                  if (--extIdx === -1) {
                    end = i;
                  }
                } else {
                  extIdx = -1;
                  end = firstNonSlashEnd;
                }
              }
            }
          }
          if (start === end)
            end = firstNonSlashEnd;
          else if (end === -1)
            end = path5.length;
          return path5.slice(start, end);
        } else {
          for (i = path5.length - 1; i >= 0; --i) {
            if (path5.charCodeAt(i) === 47) {
              if (!matchedSlash) {
                start = i + 1;
                break;
              }
            } else if (end === -1) {
              matchedSlash = false;
              end = i + 1;
            }
          }
          if (end === -1)
            return "";
          return path5.slice(start, end);
        }
      },
      extname: function extname3(path5) {
        assertPath(path5);
        var startDot = -1;
        var startPart = 0;
        var end = -1;
        var matchedSlash = true;
        var preDotState = 0;
        for (var i = path5.length - 1; i >= 0; --i) {
          var code = path5.charCodeAt(i);
          if (code === 47) {
            if (!matchedSlash) {
              startPart = i + 1;
              break;
            }
            continue;
          }
          if (end === -1) {
            matchedSlash = false;
            end = i + 1;
          }
          if (code === 46) {
            if (startDot === -1)
              startDot = i;
            else if (preDotState !== 1)
              preDotState = 1;
          } else if (startDot !== -1) {
            preDotState = -1;
          }
        }
        if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
          return "";
        }
        return path5.slice(startDot, end);
      },
      format: function format(pathObject) {
        if (pathObject === null || typeof pathObject !== "object") {
          throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
        }
        return _format("/", pathObject);
      },
      parse: function parse(path5) {
        assertPath(path5);
        var ret = {root: "", dir: "", base: "", ext: "", name: ""};
        if (path5.length === 0)
          return ret;
        var code = path5.charCodeAt(0);
        var isAbsolute = code === 47;
        var start;
        if (isAbsolute) {
          ret.root = "/";
          start = 1;
        } else {
          start = 0;
        }
        var startDot = -1;
        var startPart = 0;
        var end = -1;
        var matchedSlash = true;
        var i = path5.length - 1;
        var preDotState = 0;
        for (; i >= start; --i) {
          code = path5.charCodeAt(i);
          if (code === 47) {
            if (!matchedSlash) {
              startPart = i + 1;
              break;
            }
            continue;
          }
          if (end === -1) {
            matchedSlash = false;
            end = i + 1;
          }
          if (code === 46) {
            if (startDot === -1)
              startDot = i;
            else if (preDotState !== 1)
              preDotState = 1;
          } else if (startDot !== -1) {
            preDotState = -1;
          }
        }
        if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
          if (end !== -1) {
            if (startPart === 0 && isAbsolute)
              ret.base = ret.name = path5.slice(1, end);
            else
              ret.base = ret.name = path5.slice(startPart, end);
          }
        } else {
          if (startPart === 0 && isAbsolute) {
            ret.name = path5.slice(1, startDot);
            ret.base = path5.slice(1, end);
          } else {
            ret.name = path5.slice(startPart, startDot);
            ret.base = path5.slice(startPart, end);
          }
          ret.ext = path5.slice(startDot, end);
        }
        if (startPart > 0)
          ret.dir = path5.slice(0, startPart - 1);
        else if (isAbsolute)
          ret.dir = "/";
        return ret;
      },
      sep: "/",
      delimiter: ":",
      win32: null,
      posix: null
    };
    posix.posix = posix;
    module.exports = posix;
  });

  // node_modules/lzutf8/build/production/lzutf8.js
  var require_lzutf8 = __commonJS((exports, module) => {
    /*!
     LZ-UTF8 v0.5.6
    
     Copyright (c) 2018, Rotem Dan
     Released under the MIT license.
    
     Build date: 2020-08-10 
    
     Please report any issue at https://github.com/rotemdan/lzutf8.js/issues
    */
    var LZUTF8;
    (function(LZUTF82) {
      LZUTF82.runningInNodeJS = function() {
        return typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";
      };
      LZUTF82.runningInMainNodeJSModule = function() {
        return LZUTF82.runningInNodeJS() && require.main === module;
      };
      LZUTF82.commonJSAvailable = function() {
        return typeof module === "object" && typeof module.exports === "object";
      };
      LZUTF82.runningInWebWorker = function() {
        return typeof window === "undefined" && typeof self === "object" && typeof self.addEventListener === "function" && typeof self.close === "function";
      };
      LZUTF82.runningInNodeChildProcess = function() {
        return LZUTF82.runningInNodeJS() && typeof process.send === "function";
      };
      LZUTF82.runningInNullOrigin = function() {
        if (typeof window !== "object" || typeof window.location !== "object")
          return false;
        return document.location.protocol !== "http:" && document.location.protocol !== "https:";
      };
      LZUTF82.webWorkersAvailable = function() {
        if (typeof Worker !== "function" || LZUTF82.runningInNullOrigin())
          return false;
        if (LZUTF82.runningInNodeJS())
          return false;
        if (navigator && navigator.userAgent && navigator.userAgent.indexOf("Android 4.3") >= 0)
          return false;
        return true;
      };
      LZUTF82.log = function(message, appendToDocument) {
        if (appendToDocument === void 0) {
          appendToDocument = false;
        }
        if (typeof console !== "object")
          return;
        console.log(message);
        if (appendToDocument && typeof document == "object")
          document.body.innerHTML += message + "<br/>";
      };
      LZUTF82.createErrorMessage = function(exception, title) {
        if (title === void 0) {
          title = "Unhandled exception";
        }
        if (exception == null)
          return title;
        title += ": ";
        if (typeof exception.content === "object") {
          if (LZUTF82.runningInNodeJS()) {
            return title + exception.content.stack;
          } else {
            var exceptionJSON = JSON.stringify(exception.content);
            if (exceptionJSON !== "{}")
              return title + exceptionJSON;
            else
              return title + exception.content;
          }
        } else if (typeof exception.content === "string") {
          return title + exception.content;
        } else {
          return title + exception;
        }
      };
      LZUTF82.printExceptionAndStackTraceToConsole = function(exception, title) {
        if (title === void 0) {
          title = "Unhandled exception";
        }
        LZUTF82.log(LZUTF82.createErrorMessage(exception, title));
      };
      LZUTF82.getGlobalObject = function() {
        if (typeof global === "object")
          return global;
        else if (typeof window === "object")
          return window;
        else if (typeof self === "object")
          return self;
        else
          return {};
      };
      LZUTF82.toString = Object.prototype.toString;
      if (LZUTF82.commonJSAvailable())
        module.exports = LZUTF82;
    })(LZUTF8 || (LZUTF8 = {}));
    var IE10SubarrayBugPatcher;
    (function(IE10SubarrayBugPatcher2) {
      if (typeof Uint8Array === "function" && new Uint8Array(1).subarray(1).byteLength !== 0) {
        var subarray = function(start, end) {
          var clamp = function(v, min, max) {
            return v < min ? min : v > max ? max : v;
          };
          start = start | 0;
          end = end | 0;
          if (arguments.length < 1)
            start = 0;
          if (arguments.length < 2)
            end = this.length;
          if (start < 0)
            start = this.length + start;
          if (end < 0)
            end = this.length + end;
          start = clamp(start, 0, this.length);
          end = clamp(end, 0, this.length);
          var len = end - start;
          if (len < 0)
            len = 0;
          return new this.constructor(this.buffer, this.byteOffset + start * this.BYTES_PER_ELEMENT, len);
        };
        var types = ["Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Uint16Array", "Int32Array", "Uint32Array", "Float32Array", "Float64Array"];
        var globalObject = void 0;
        if (typeof window === "object")
          globalObject = window;
        else if (typeof self === "object")
          globalObject = self;
        if (globalObject !== void 0) {
          for (var i = 0; i < types.length; i++) {
            if (globalObject[types[i]])
              globalObject[types[i]].prototype.subarray = subarray;
          }
        }
      }
    })(IE10SubarrayBugPatcher || (IE10SubarrayBugPatcher = {}));
    var LZUTF8;
    (function(LZUTF82) {
      var AsyncCompressor = function() {
        function AsyncCompressor2() {
        }
        AsyncCompressor2.compressAsync = function(input, options, callback) {
          var timer = new LZUTF82.Timer();
          var compressor = new LZUTF82.Compressor();
          if (!callback)
            throw new TypeError("compressAsync: No callback argument given");
          if (typeof input === "string") {
            input = LZUTF82.encodeUTF8(input);
          } else if (input == null || !(input instanceof Uint8Array)) {
            callback(void 0, new TypeError("compressAsync: Invalid input argument, only 'string' and 'Uint8Array' are supported"));
            return;
          }
          var sourceBlocks = LZUTF82.ArrayTools.splitByteArray(input, options.blockSize);
          var compressedBlocks = [];
          var compressBlocksStartingAt = function(index) {
            if (index < sourceBlocks.length) {
              var compressedBlock = void 0;
              try {
                compressedBlock = compressor.compressBlock(sourceBlocks[index]);
              } catch (e) {
                callback(void 0, e);
                return;
              }
              compressedBlocks.push(compressedBlock);
              if (timer.getElapsedTime() <= 20) {
                compressBlocksStartingAt(index + 1);
              } else {
                LZUTF82.enqueueImmediate(function() {
                  return compressBlocksStartingAt(index + 1);
                });
                timer.restart();
              }
            } else {
              var joinedCompressedBlocks_1 = LZUTF82.ArrayTools.concatUint8Arrays(compressedBlocks);
              LZUTF82.enqueueImmediate(function() {
                var result;
                try {
                  result = LZUTF82.CompressionCommon.encodeCompressedBytes(joinedCompressedBlocks_1, options.outputEncoding);
                } catch (e) {
                  callback(void 0, e);
                  return;
                }
                LZUTF82.enqueueImmediate(function() {
                  return callback(result);
                });
              });
            }
          };
          LZUTF82.enqueueImmediate(function() {
            return compressBlocksStartingAt(0);
          });
        };
        AsyncCompressor2.createCompressionStream = function() {
          var compressor = new LZUTF82.Compressor();
          var NodeStream = require("stream");
          var compressionStream = new NodeStream.Transform({decodeStrings: true, highWaterMark: 65536});
          compressionStream._transform = function(data, encoding3, done) {
            var buffer2;
            try {
              buffer2 = LZUTF82.BufferTools.uint8ArrayToBuffer(compressor.compressBlock(LZUTF82.BufferTools.bufferToUint8Array(data)));
            } catch (e) {
              compressionStream.emit("error", e);
              return;
            }
            compressionStream.push(buffer2);
            done();
          };
          return compressionStream;
        };
        return AsyncCompressor2;
      }();
      LZUTF82.AsyncCompressor = AsyncCompressor;
    })(LZUTF8 || (LZUTF8 = {}));
    var LZUTF8;
    (function(LZUTF82) {
      var AsyncDecompressor = function() {
        function AsyncDecompressor2() {
        }
        AsyncDecompressor2.decompressAsync = function(input, options, callback) {
          if (!callback)
            throw new TypeError("decompressAsync: No callback argument given");
          var timer = new LZUTF82.Timer();
          try {
            input = LZUTF82.CompressionCommon.decodeCompressedBytes(input, options.inputEncoding);
          } catch (e) {
            callback(void 0, e);
            return;
          }
          var decompressor = new LZUTF82.Decompressor();
          var sourceBlocks = LZUTF82.ArrayTools.splitByteArray(input, options.blockSize);
          var decompressedBlocks = [];
          var decompressBlocksStartingAt = function(index) {
            if (index < sourceBlocks.length) {
              var decompressedBlock = void 0;
              try {
                decompressedBlock = decompressor.decompressBlock(sourceBlocks[index]);
              } catch (e) {
                callback(void 0, e);
                return;
              }
              decompressedBlocks.push(decompressedBlock);
              if (timer.getElapsedTime() <= 20) {
                decompressBlocksStartingAt(index + 1);
              } else {
                LZUTF82.enqueueImmediate(function() {
                  return decompressBlocksStartingAt(index + 1);
                });
                timer.restart();
              }
            } else {
              var joinedDecompressedBlocks_1 = LZUTF82.ArrayTools.concatUint8Arrays(decompressedBlocks);
              LZUTF82.enqueueImmediate(function() {
                var result;
                try {
                  result = LZUTF82.CompressionCommon.encodeDecompressedBytes(joinedDecompressedBlocks_1, options.outputEncoding);
                } catch (e) {
                  callback(void 0, e);
                  return;
                }
                LZUTF82.enqueueImmediate(function() {
                  return callback(result);
                });
              });
            }
          };
          LZUTF82.enqueueImmediate(function() {
            return decompressBlocksStartingAt(0);
          });
        };
        AsyncDecompressor2.createDecompressionStream = function() {
          var decompressor = new LZUTF82.Decompressor();
          var NodeStream = require("stream");
          var decompressionStream = new NodeStream.Transform({decodeStrings: true, highWaterMark: 65536});
          decompressionStream._transform = function(data, encoding3, done) {
            var buffer2;
            try {
              buffer2 = LZUTF82.BufferTools.uint8ArrayToBuffer(decompressor.decompressBlock(LZUTF82.BufferTools.bufferToUint8Array(data)));
            } catch (e) {
              decompressionStream.emit("error", e);
              return;
            }
            decompressionStream.push(buffer2);
            done();
          };
          return decompressionStream;
        };
        return AsyncDecompressor2;
      }();
      LZUTF82.AsyncDecompressor = AsyncDecompressor;
    })(LZUTF8 || (LZUTF8 = {}));
    var LZUTF8;
    (function(LZUTF82) {
      var WebWorker;
      (function(WebWorker2) {
        WebWorker2.compressAsync = function(input, options, callback) {
          if (options.inputEncoding == "ByteArray") {
            if (!(input instanceof Uint8Array)) {
              callback(void 0, new TypeError("compressAsync: input is not a Uint8Array"));
              return;
            }
          }
          var request = {
            token: Math.random().toString(),
            type: "compress",
            data: input,
            inputEncoding: options.inputEncoding,
            outputEncoding: options.outputEncoding
          };
          var responseListener = function(e) {
            var response = e.data;
            if (!response || response.token != request.token)
              return;
            WebWorker2.globalWorker.removeEventListener("message", responseListener);
            if (response.type == "error")
              callback(void 0, new Error(response.error));
            else
              callback(response.data);
          };
          WebWorker2.globalWorker.addEventListener("message", responseListener);
          WebWorker2.globalWorker.postMessage(request, []);
        };
        WebWorker2.decompressAsync = function(input, options, callback) {
          var request = {
            token: Math.random().toString(),
            type: "decompress",
            data: input,
            inputEncoding: options.inputEncoding,
            outputEncoding: options.outputEncoding
          };
          var responseListener = function(e) {
            var response = e.data;
            if (!response || response.token != request.token)
              return;
            WebWorker2.globalWorker.removeEventListener("message", responseListener);
            if (response.type == "error")
              callback(void 0, new Error(response.error));
            else
              callback(response.data);
          };
          WebWorker2.globalWorker.addEventListener("message", responseListener);
          WebWorker2.globalWorker.postMessage(request, []);
        };
        WebWorker2.installWebWorkerIfNeeded = function() {
          if (typeof self == "object" && self.document === void 0 && self.addEventListener != void 0) {
            self.addEventListener("message", function(e) {
              var request = e.data;
              if (request.type == "compress") {
                var compressedData = void 0;
                try {
                  compressedData = LZUTF82.compress(request.data, {outputEncoding: request.outputEncoding});
                } catch (e2) {
                  self.postMessage({token: request.token, type: "error", error: LZUTF82.createErrorMessage(e2)}, []);
                  return;
                }
                var response = {
                  token: request.token,
                  type: "compressionResult",
                  data: compressedData,
                  encoding: request.outputEncoding
                };
                if (response.data instanceof Uint8Array && navigator.appVersion.indexOf("MSIE 10") === -1)
                  self.postMessage(response, [response.data.buffer]);
                else
                  self.postMessage(response, []);
              } else if (request.type == "decompress") {
                var decompressedData = void 0;
                try {
                  decompressedData = LZUTF82.decompress(request.data, {inputEncoding: request.inputEncoding, outputEncoding: request.outputEncoding});
                } catch (e2) {
                  self.postMessage({token: request.token, type: "error", error: LZUTF82.createErrorMessage(e2)}, []);
                  return;
                }
                var response = {
                  token: request.token,
                  type: "decompressionResult",
                  data: decompressedData,
                  encoding: request.outputEncoding
                };
                if (response.data instanceof Uint8Array && navigator.appVersion.indexOf("MSIE 10") === -1)
                  self.postMessage(response, [response.data.buffer]);
                else
                  self.postMessage(response, []);
              }
            });
            self.addEventListener("error", function(e) {
              LZUTF82.log(LZUTF82.createErrorMessage(e.error, "Unexpected LZUTF8 WebWorker exception"));
            });
          }
        };
        WebWorker2.createGlobalWorkerIfNeeded = function() {
          if (WebWorker2.globalWorker)
            return true;
          if (!LZUTF82.webWorkersAvailable())
            return false;
          if (!WebWorker2.scriptURI && typeof document === "object") {
            var scriptElement = document.getElementById("lzutf8");
            if (scriptElement != null)
              WebWorker2.scriptURI = scriptElement.getAttribute("src") || void 0;
          }
          if (WebWorker2.scriptURI) {
            WebWorker2.globalWorker = new Worker(WebWorker2.scriptURI);
            return true;
          } else {
            return false;
          }
        };
        WebWorker2.terminate = function() {
          if (WebWorker2.globalWorker) {
            WebWorker2.globalWorker.terminate();
            WebWorker2.globalWorker = void 0;
          }
        };
      })(WebWorker = LZUTF82.WebWorker || (LZUTF82.WebWorker = {}));
      WebWorker.installWebWorkerIfNeeded();
    })(LZUTF8 || (LZUTF8 = {}));
    var LZUTF8;
    (function(LZUTF82) {
      var ArraySegment = function() {
        function ArraySegment2(container, startPosition, length) {
          this.container = container;
          this.startPosition = startPosition;
          this.length = length;
        }
        ArraySegment2.prototype.get = function(index) {
          return this.container[this.startPosition + index];
        };
        ArraySegment2.prototype.getInReversedOrder = function(reverseIndex) {
          return this.container[this.startPosition + this.length - 1 - reverseIndex];
        };
        ArraySegment2.prototype.set = function(index, value) {
          this.container[this.startPosition + index] = value;
        };
        return ArraySegment2;
      }();
      LZUTF82.ArraySegment = ArraySegment;
    })(LZUTF8 || (LZUTF8 = {}));
    var LZUTF8;
    (function(LZUTF82) {
      var ArrayTools;
      (function(ArrayTools2) {
        ArrayTools2.copyElements = function(source, sourceIndex, destination, destinationIndex, count) {
          while (count--)
            destination[destinationIndex++] = source[sourceIndex++];
        };
        ArrayTools2.zeroElements = function(collection, index, count) {
          while (count--)
            collection[index++] = 0;
        };
        ArrayTools2.countNonzeroValuesInArray = function(array) {
          var result = 0;
          for (var i = 0; i < array.length; i++)
            if (array[i])
              result++;
          return result;
        };
        ArrayTools2.truncateStartingElements = function(array, truncatedLength) {
          if (array.length <= truncatedLength)
            throw new RangeError("truncateStartingElements: Requested length should be smaller than array length");
          var sourcePosition = array.length - truncatedLength;
          for (var i = 0; i < truncatedLength; i++)
            array[i] = array[sourcePosition + i];
          array.length = truncatedLength;
        };
        ArrayTools2.doubleByteArrayCapacity = function(array) {
          var newArray = new Uint8Array(array.length * 2);
          newArray.set(array);
          return newArray;
        };
        ArrayTools2.concatUint8Arrays = function(arrays) {
          var totalLength = 0;
          for (var _i = 0, arrays_1 = arrays; _i < arrays_1.length; _i++) {
            var array = arrays_1[_i];
            totalLength += array.length;
          }
          var result = new Uint8Array(totalLength);
          var offset = 0;
          for (var _a2 = 0, arrays_2 = arrays; _a2 < arrays_2.length; _a2++) {
            var array = arrays_2[_a2];
            result.set(array, offset);
            offset += array.length;
          }
          return result;
        };
        ArrayTools2.splitByteArray = function(byteArray, maxPartLength) {
          var result = [];
          for (var offset = 0; offset < byteArray.length; ) {
            var blockLength = Math.min(maxPartLength, byteArray.length - offset);
            result.push(byteArray.subarray(offset, offset + blockLength));
            offset += blockLength;
          }
          return result;
        };
      })(ArrayTools = LZUTF82.ArrayTools || (LZUTF82.ArrayTools = {}));
    })(LZUTF8 || (LZUTF8 = {}));
    var LZUTF8;
    (function(LZUTF82) {
      var BufferTools;
      (function(BufferTools2) {
        BufferTools2.convertToUint8ArrayIfNeeded = function(input) {
          if (typeof Buffer === "function" && Buffer.isBuffer(input))
            return BufferTools2.bufferToUint8Array(input);
          else
            return input;
        };
        BufferTools2.uint8ArrayToBuffer = function(arr) {
          if (Buffer.prototype instanceof Uint8Array) {
            var arrClone = new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
            Object["setPrototypeOf"](arrClone, Buffer.prototype);
            return arrClone;
          } else {
            var len = arr.length;
            var buf = new Buffer(len);
            for (var i = 0; i < len; i++)
              buf[i] = arr[i];
            return buf;
          }
        };
        BufferTools2.bufferToUint8Array = function(buf) {
          if (Buffer.prototype instanceof Uint8Array) {
            return new Uint8Array(buf["buffer"], buf["byteOffset"], buf["byteLength"]);
          } else {
            var len = buf.length;
            var arr = new Uint8Array(len);
            for (var i = 0; i < len; i++)
              arr[i] = buf[i];
            return arr;
          }
        };
      })(BufferTools = LZUTF82.BufferTools || (LZUTF82.BufferTools = {}));
    })(LZUTF8 || (LZUTF8 = {}));
    var LZUTF8;
    (function(LZUTF82) {
      var CompressionCommon;
      (function(CompressionCommon2) {
        CompressionCommon2.getCroppedBuffer = function(buffer2, cropStartOffset, cropLength, additionalCapacity) {
          if (additionalCapacity === void 0) {
            additionalCapacity = 0;
          }
          var croppedBuffer = new Uint8Array(cropLength + additionalCapacity);
          croppedBuffer.set(buffer2.subarray(cropStartOffset, cropStartOffset + cropLength));
          return croppedBuffer;
        };
        CompressionCommon2.getCroppedAndAppendedByteArray = function(bytes, cropStartOffset, cropLength, byteArrayToAppend) {
          return LZUTF82.ArrayTools.concatUint8Arrays([bytes.subarray(cropStartOffset, cropStartOffset + cropLength), byteArrayToAppend]);
        };
        CompressionCommon2.detectCompressionSourceEncoding = function(input) {
          if (input == null)
            throw new TypeError("detectCompressionSourceEncoding: input is null or undefined");
          if (typeof input === "string")
            return "String";
          else if (input instanceof Uint8Array || typeof Buffer === "function" && Buffer.isBuffer(input))
            return "ByteArray";
          else
            throw new TypeError("detectCompressionSourceEncoding: input must be of type 'string', 'Uint8Array' or 'Buffer'");
        };
        CompressionCommon2.encodeCompressedBytes = function(compressedBytes, outputEncoding) {
          switch (outputEncoding) {
            case "ByteArray":
              return compressedBytes;
            case "Buffer":
              return LZUTF82.BufferTools.uint8ArrayToBuffer(compressedBytes);
            case "Base64":
              return LZUTF82.encodeBase64(compressedBytes);
            case "BinaryString":
              return LZUTF82.encodeBinaryString(compressedBytes);
            case "StorageBinaryString":
              return LZUTF82.encodeStorageBinaryString(compressedBytes);
            default:
              throw new TypeError("encodeCompressedBytes: invalid output encoding requested");
          }
        };
        CompressionCommon2.decodeCompressedBytes = function(compressedData, inputEncoding) {
          if (inputEncoding == null)
            throw new TypeError("decodeCompressedData: Input is null or undefined");
          switch (inputEncoding) {
            case "ByteArray":
            case "Buffer":
              var normalizedBytes = LZUTF82.BufferTools.convertToUint8ArrayIfNeeded(compressedData);
              if (!(normalizedBytes instanceof Uint8Array))
                throw new TypeError("decodeCompressedData: 'ByteArray' or 'Buffer' input type was specified but input is not a Uint8Array or Buffer");
              return normalizedBytes;
            case "Base64":
              if (typeof compressedData !== "string")
                throw new TypeError("decodeCompressedData: 'Base64' input type was specified but input is not a string");
              return LZUTF82.decodeBase64(compressedData);
            case "BinaryString":
              if (typeof compressedData !== "string")
                throw new TypeError("decodeCompressedData: 'BinaryString' input type was specified but input is not a string");
              return LZUTF82.decodeBinaryString(compressedData);
            case "StorageBinaryString":
              if (typeof compressedData !== "string")
                throw new TypeError("decodeCompressedData: 'StorageBinaryString' input type was specified but input is not a string");
              return LZUTF82.decodeStorageBinaryString(compressedData);
            default:
              throw new TypeError("decodeCompressedData: invalid input encoding requested: '" + inputEncoding + "'");
          }
        };
        CompressionCommon2.encodeDecompressedBytes = function(decompressedBytes, outputEncoding) {
          switch (outputEncoding) {
            case "String":
              return LZUTF82.decodeUTF8(decompressedBytes);
            case "ByteArray":
              return decompressedBytes;
            case "Buffer":
              if (typeof Buffer !== "function")
                throw new TypeError("encodeDecompressedBytes: a 'Buffer' type was specified but is not supported at the current envirnment");
              return LZUTF82.BufferTools.uint8ArrayToBuffer(decompressedBytes);
            default:
              throw new TypeError("encodeDecompressedBytes: invalid output encoding requested");
          }
        };
      })(CompressionCommon = LZUTF82.CompressionCommon || (LZUTF82.CompressionCommon = {}));
    })(LZUTF8 || (LZUTF8 = {}));
    var LZUTF8;
    (function(LZUTF82) {
      var EventLoop;
      (function(EventLoop2) {
        var queuedFunctions = [];
        var asyncFlushFunc;
        EventLoop2.enqueueImmediate = function(func) {
          queuedFunctions.push(func);
          if (queuedFunctions.length === 1)
            asyncFlushFunc();
        };
        EventLoop2.initializeScheduler = function() {
          var flush = function() {
            for (var _i = 0, queuedFunctions_1 = queuedFunctions; _i < queuedFunctions_1.length; _i++) {
              var func = queuedFunctions_1[_i];
              try {
                func.call(void 0);
              } catch (exception) {
                LZUTF82.printExceptionAndStackTraceToConsole(exception, "enqueueImmediate exception");
              }
            }
            queuedFunctions.length = 0;
          };
          if (LZUTF82.runningInNodeJS()) {
            asyncFlushFunc = function() {
              return setImmediate(function() {
                return flush();
              });
            };
          }
          if (typeof window === "object" && typeof window.addEventListener === "function" && typeof window.postMessage === "function") {
            var token_1 = "enqueueImmediate-" + Math.random().toString();
            window.addEventListener("message", function(event9) {
              if (event9.data === token_1)
                flush();
            });
            var targetOrigin_1;
            if (LZUTF82.runningInNullOrigin())
              targetOrigin_1 = "*";
            else
              targetOrigin_1 = window.location.href;
            asyncFlushFunc = function() {
              return window.postMessage(token_1, targetOrigin_1);
            };
          } else if (typeof MessageChannel === "function" && typeof MessagePort === "function") {
            var channel_1 = new MessageChannel();
            channel_1.port1.onmessage = function() {
              return flush();
            };
            asyncFlushFunc = function() {
              return channel_1.port2.postMessage(0);
            };
          } else {
            asyncFlushFunc = function() {
              return setTimeout(function() {
                return flush();
              }, 0);
            };
          }
        };
        EventLoop2.initializeScheduler();
      })(EventLoop = LZUTF82.EventLoop || (LZUTF82.EventLoop = {}));
      LZUTF82.enqueueImmediate = function(func) {
        return EventLoop.enqueueImmediate(func);
      };
    })(LZUTF8 || (LZUTF8 = {}));
    var LZUTF8;
    (function(LZUTF82) {
      var ObjectTools;
      (function(ObjectTools2) {
        ObjectTools2.override = function(obj2, newPropertyValues) {
          return ObjectTools2.extend(obj2, newPropertyValues);
        };
        ObjectTools2.extend = function(obj2, newProperties) {
          if (obj2 == null)
            throw new TypeError("obj is null or undefined");
          if (typeof obj2 !== "object")
            throw new TypeError("obj is not an object");
          if (newProperties == null)
            newProperties = {};
          if (typeof newProperties !== "object")
            throw new TypeError("newProperties is not an object");
          if (newProperties != null) {
            for (var property in newProperties)
              obj2[property] = newProperties[property];
          }
          return obj2;
        };
      })(ObjectTools = LZUTF82.ObjectTools || (LZUTF82.ObjectTools = {}));
    })(LZUTF8 || (LZUTF8 = {}));
    var LZUTF8;
    (function(LZUTF82) {
      LZUTF82.getRandomIntegerInRange = function(low, high) {
        return low + Math.floor(Math.random() * (high - low));
      };
      LZUTF82.getRandomUTF16StringOfLength = function(length) {
        var randomString = "";
        for (var i = 0; i < length; i++) {
          var randomCodePoint = void 0;
          do {
            randomCodePoint = LZUTF82.getRandomIntegerInRange(0, 1114111 + 1);
          } while (randomCodePoint >= 55296 && randomCodePoint <= 57343);
          randomString += LZUTF82.Encoding.CodePoint.decodeToString(randomCodePoint);
        }
        return randomString;
      };
    })(LZUTF8 || (LZUTF8 = {}));
    var LZUTF8;
    (function(LZUTF82) {
      var StringBuilder = function() {
        function StringBuilder2(outputBufferCapacity) {
          if (outputBufferCapacity === void 0) {
            outputBufferCapacity = 1024;
          }
          this.outputBufferCapacity = outputBufferCapacity;
          this.outputPosition = 0;
          this.outputString = "";
          this.outputBuffer = new Uint16Array(this.outputBufferCapacity);
        }
        StringBuilder2.prototype.appendCharCode = function(charCode) {
          this.outputBuffer[this.outputPosition++] = charCode;
          if (this.outputPosition === this.outputBufferCapacity)
            this.flushBufferToOutputString();
        };
        StringBuilder2.prototype.appendCharCodes = function(charCodes) {
          for (var i = 0, length_1 = charCodes.length; i < length_1; i++)
            this.appendCharCode(charCodes[i]);
        };
        StringBuilder2.prototype.appendString = function(str2) {
          for (var i = 0, length_2 = str2.length; i < length_2; i++)
            this.appendCharCode(str2.charCodeAt(i));
        };
        StringBuilder2.prototype.appendCodePoint = function(codePoint) {
          if (codePoint <= 65535) {
            this.appendCharCode(codePoint);
          } else if (codePoint <= 1114111) {
            this.appendCharCode(55296 + (codePoint - 65536 >>> 10));
            this.appendCharCode(56320 + (codePoint - 65536 & 1023));
          } else
            throw new Error("appendCodePoint: A code point of " + codePoint + " cannot be encoded in UTF-16");
        };
        StringBuilder2.prototype.getOutputString = function() {
          this.flushBufferToOutputString();
          return this.outputString;
        };
        StringBuilder2.prototype.flushBufferToOutputString = function() {
          if (this.outputPosition === this.outputBufferCapacity)
            this.outputString += String.fromCharCode.apply(null, this.outputBuffer);
          else
            this.outputString += String.fromCharCode.apply(null, this.outputBuffer.subarray(0, this.outputPosition));
          this.outputPosition = 0;
        };
        return StringBuilder2;
      }();
      LZUTF82.StringBuilder = StringBuilder;
    })(LZUTF8 || (LZUTF8 = {}));
    var LZUTF8;
    (function(LZUTF82) {
      var Timer = function() {
        function Timer2() {
          this.restart();
        }
        Timer2.prototype.restart = function() {
          this.startTime = Timer2.getTimestamp();
        };
        Timer2.prototype.getElapsedTime = function() {
          return Timer2.getTimestamp() - this.startTime;
        };
        Timer2.prototype.getElapsedTimeAndRestart = function() {
          var elapsedTime = this.getElapsedTime();
          this.restart();
          return elapsedTime;
        };
        Timer2.prototype.logAndRestart = function(title, logToDocument) {
          if (logToDocument === void 0) {
            logToDocument = true;
          }
          var elapsedTime = this.getElapsedTime();
          var message = title + ": " + elapsedTime.toFixed(3) + "ms";
          LZUTF82.log(message, logToDocument);
          this.restart();
          return elapsedTime;
        };
        Timer2.getTimestamp = function() {
          if (!this.timestampFunc)
            this.createGlobalTimestampFunction();
          return this.timestampFunc();
        };
        Timer2.getMicrosecondTimestamp = function() {
          return Math.floor(Timer2.getTimestamp() * 1e3);
        };
        Timer2.createGlobalTimestampFunction = function() {
          if (typeof process === "object" && typeof process.hrtime === "function") {
            var baseTimestamp_1 = 0;
            this.timestampFunc = function() {
              var nodeTimeStamp = process.hrtime();
              var millisecondTime = nodeTimeStamp[0] * 1e3 + nodeTimeStamp[1] / 1e6;
              return baseTimestamp_1 + millisecondTime;
            };
            baseTimestamp_1 = Date.now() - this.timestampFunc();
          } else if (typeof chrome === "object" && chrome.Interval) {
            var baseTimestamp_2 = Date.now();
            var chromeIntervalObject_1 = new chrome.Interval();
            chromeIntervalObject_1.start();
            this.timestampFunc = function() {
              return baseTimestamp_2 + chromeIntervalObject_1.microseconds() / 1e3;
            };
          } else if (typeof performance === "object" && performance.now) {
            var baseTimestamp_3 = Date.now() - performance.now();
            this.timestampFunc = function() {
              return baseTimestamp_3 + performance.now();
            };
          } else if (Date.now) {
            this.timestampFunc = function() {
              return Date.now();
            };
          } else {
            this.timestampFunc = function() {
              return new Date().getTime();
            };
          }
        };
        return Timer2;
      }();
      LZUTF82.Timer = Timer;
    })(LZUTF8 || (LZUTF8 = {}));
    var LZUTF8;
    (function(LZUTF82) {
      var Compressor = function() {
        function Compressor2(useCustomHashTable) {
          if (useCustomHashTable === void 0) {
            useCustomHashTable = true;
          }
          this.MinimumSequenceLength = 4;
          this.MaximumSequenceLength = 31;
          this.MaximumMatchDistance = 32767;
          this.PrefixHashTableSize = 65537;
          this.inputBufferStreamOffset = 1;
          if (useCustomHashTable && typeof Uint32Array == "function")
            this.prefixHashTable = new LZUTF82.CompressorCustomHashTable(this.PrefixHashTableSize);
          else
            this.prefixHashTable = new LZUTF82.CompressorSimpleHashTable(this.PrefixHashTableSize);
        }
        Compressor2.prototype.compressBlock = function(input) {
          if (input === void 0 || input === null)
            throw new TypeError("compressBlock: undefined or null input received");
          if (typeof input == "string")
            input = LZUTF82.encodeUTF8(input);
          input = LZUTF82.BufferTools.convertToUint8ArrayIfNeeded(input);
          return this.compressUtf8Block(input);
        };
        Compressor2.prototype.compressUtf8Block = function(utf8Bytes) {
          if (!utf8Bytes || utf8Bytes.length == 0)
            return new Uint8Array(0);
          var bufferStartingReadOffset = this.cropAndAddNewBytesToInputBuffer(utf8Bytes);
          var inputBuffer = this.inputBuffer;
          var inputBufferLength = this.inputBuffer.length;
          this.outputBuffer = new Uint8Array(utf8Bytes.length);
          this.outputBufferPosition = 0;
          var latestMatchEndPosition = 0;
          for (var readPosition = bufferStartingReadOffset; readPosition < inputBufferLength; readPosition++) {
            var inputValue = inputBuffer[readPosition];
            var withinAMatchedRange = readPosition < latestMatchEndPosition;
            if (readPosition > inputBufferLength - this.MinimumSequenceLength) {
              if (!withinAMatchedRange)
                this.outputRawByte(inputValue);
              continue;
            }
            var targetBucketIndex = this.getBucketIndexForPrefix(readPosition);
            if (!withinAMatchedRange) {
              var matchLocator = this.findLongestMatch(readPosition, targetBucketIndex);
              if (matchLocator != null) {
                this.outputPointerBytes(matchLocator.length, matchLocator.distance);
                latestMatchEndPosition = readPosition + matchLocator.length;
                withinAMatchedRange = true;
              }
            }
            if (!withinAMatchedRange)
              this.outputRawByte(inputValue);
            var inputStreamPosition = this.inputBufferStreamOffset + readPosition;
            this.prefixHashTable.addValueToBucket(targetBucketIndex, inputStreamPosition);
          }
          return this.outputBuffer.subarray(0, this.outputBufferPosition);
        };
        Compressor2.prototype.findLongestMatch = function(matchedSequencePosition, bucketIndex) {
          var bucket = this.prefixHashTable.getArraySegmentForBucketIndex(bucketIndex, this.reusableArraySegmentObject);
          if (bucket == null)
            return null;
          var input = this.inputBuffer;
          var longestMatchDistance;
          var longestMatchLength = 0;
          for (var i = 0; i < bucket.length; i++) {
            var testedSequencePosition = bucket.getInReversedOrder(i) - this.inputBufferStreamOffset;
            var testedSequenceDistance = matchedSequencePosition - testedSequencePosition;
            var lengthToSurpass = void 0;
            if (longestMatchDistance === void 0)
              lengthToSurpass = this.MinimumSequenceLength - 1;
            else if (longestMatchDistance < 128 && testedSequenceDistance >= 128)
              lengthToSurpass = longestMatchLength + (longestMatchLength >>> 1);
            else
              lengthToSurpass = longestMatchLength;
            if (testedSequenceDistance > this.MaximumMatchDistance || lengthToSurpass >= this.MaximumSequenceLength || matchedSequencePosition + lengthToSurpass >= input.length)
              break;
            if (input[testedSequencePosition + lengthToSurpass] !== input[matchedSequencePosition + lengthToSurpass])
              continue;
            for (var offset = 0; ; offset++) {
              if (matchedSequencePosition + offset === input.length || input[testedSequencePosition + offset] !== input[matchedSequencePosition + offset]) {
                if (offset > lengthToSurpass) {
                  longestMatchDistance = testedSequenceDistance;
                  longestMatchLength = offset;
                }
                break;
              } else if (offset === this.MaximumSequenceLength)
                return {distance: testedSequenceDistance, length: this.MaximumSequenceLength};
            }
          }
          if (longestMatchDistance !== void 0)
            return {distance: longestMatchDistance, length: longestMatchLength};
          else
            return null;
        };
        Compressor2.prototype.getBucketIndexForPrefix = function(startPosition) {
          return (this.inputBuffer[startPosition] * 7880599 + this.inputBuffer[startPosition + 1] * 39601 + this.inputBuffer[startPosition + 2] * 199 + this.inputBuffer[startPosition + 3]) % this.PrefixHashTableSize;
        };
        Compressor2.prototype.outputPointerBytes = function(length, distance) {
          if (distance < 128) {
            this.outputRawByte(192 | length);
            this.outputRawByte(distance);
          } else {
            this.outputRawByte(224 | length);
            this.outputRawByte(distance >>> 8);
            this.outputRawByte(distance & 255);
          }
        };
        Compressor2.prototype.outputRawByte = function(value) {
          this.outputBuffer[this.outputBufferPosition++] = value;
        };
        Compressor2.prototype.cropAndAddNewBytesToInputBuffer = function(newInput) {
          if (this.inputBuffer === void 0) {
            this.inputBuffer = newInput;
            return 0;
          } else {
            var cropLength = Math.min(this.inputBuffer.length, this.MaximumMatchDistance);
            var cropStartOffset = this.inputBuffer.length - cropLength;
            this.inputBuffer = LZUTF82.CompressionCommon.getCroppedAndAppendedByteArray(this.inputBuffer, cropStartOffset, cropLength, newInput);
            this.inputBufferStreamOffset += cropStartOffset;
            return cropLength;
          }
        };
        return Compressor2;
      }();
      LZUTF82.Compressor = Compressor;
    })(LZUTF8 || (LZUTF8 = {}));
    var LZUTF8;
    (function(LZUTF82) {
      var CompressorCustomHashTable = function() {
        function CompressorCustomHashTable2(bucketCount) {
          this.minimumBucketCapacity = 4;
          this.maximumBucketCapacity = 64;
          this.bucketLocators = new Uint32Array(bucketCount * 2);
          this.storage = new Uint32Array(bucketCount * 2);
          this.storageIndex = 1;
        }
        CompressorCustomHashTable2.prototype.addValueToBucket = function(bucketIndex, valueToAdd) {
          bucketIndex <<= 1;
          if (this.storageIndex >= this.storage.length >>> 1)
            this.compact();
          var startPosition = this.bucketLocators[bucketIndex];
          var length;
          if (startPosition === 0) {
            startPosition = this.storageIndex;
            length = 1;
            this.storage[this.storageIndex] = valueToAdd;
            this.storageIndex += this.minimumBucketCapacity;
          } else {
            length = this.bucketLocators[bucketIndex + 1];
            if (length === this.maximumBucketCapacity - 1)
              length = this.truncateBucketToNewerElements(startPosition, length, this.maximumBucketCapacity / 2);
            var endPosition = startPosition + length;
            if (this.storage[endPosition] === 0) {
              this.storage[endPosition] = valueToAdd;
              if (endPosition === this.storageIndex)
                this.storageIndex += length;
            } else {
              LZUTF82.ArrayTools.copyElements(this.storage, startPosition, this.storage, this.storageIndex, length);
              startPosition = this.storageIndex;
              this.storageIndex += length;
              this.storage[this.storageIndex++] = valueToAdd;
              this.storageIndex += length;
            }
            length++;
          }
          this.bucketLocators[bucketIndex] = startPosition;
          this.bucketLocators[bucketIndex + 1] = length;
        };
        CompressorCustomHashTable2.prototype.truncateBucketToNewerElements = function(startPosition, bucketLength, truncatedBucketLength) {
          var sourcePosition = startPosition + bucketLength - truncatedBucketLength;
          LZUTF82.ArrayTools.copyElements(this.storage, sourcePosition, this.storage, startPosition, truncatedBucketLength);
          LZUTF82.ArrayTools.zeroElements(this.storage, startPosition + truncatedBucketLength, bucketLength - truncatedBucketLength);
          return truncatedBucketLength;
        };
        CompressorCustomHashTable2.prototype.compact = function() {
          var oldBucketLocators = this.bucketLocators;
          var oldStorage = this.storage;
          this.bucketLocators = new Uint32Array(this.bucketLocators.length);
          this.storageIndex = 1;
          for (var bucketIndex = 0; bucketIndex < oldBucketLocators.length; bucketIndex += 2) {
            var length_3 = oldBucketLocators[bucketIndex + 1];
            if (length_3 === 0)
              continue;
            this.bucketLocators[bucketIndex] = this.storageIndex;
            this.bucketLocators[bucketIndex + 1] = length_3;
            this.storageIndex += Math.max(Math.min(length_3 * 2, this.maximumBucketCapacity), this.minimumBucketCapacity);
          }
          this.storage = new Uint32Array(this.storageIndex * 8);
          for (var bucketIndex = 0; bucketIndex < oldBucketLocators.length; bucketIndex += 2) {
            var sourcePosition = oldBucketLocators[bucketIndex];
            if (sourcePosition === 0)
              continue;
            var destPosition = this.bucketLocators[bucketIndex];
            var length_4 = this.bucketLocators[bucketIndex + 1];
            LZUTF82.ArrayTools.copyElements(oldStorage, sourcePosition, this.storage, destPosition, length_4);
          }
        };
        CompressorCustomHashTable2.prototype.getArraySegmentForBucketIndex = function(bucketIndex, outputObject) {
          bucketIndex <<= 1;
          var startPosition = this.bucketLocators[bucketIndex];
          if (startPosition === 0)
            return null;
          if (outputObject === void 0)
            outputObject = new LZUTF82.ArraySegment(this.storage, startPosition, this.bucketLocators[bucketIndex + 1]);
          return outputObject;
        };
        CompressorCustomHashTable2.prototype.getUsedBucketCount = function() {
          return Math.floor(LZUTF82.ArrayTools.countNonzeroValuesInArray(this.bucketLocators) / 2);
        };
        CompressorCustomHashTable2.prototype.getTotalElementCount = function() {
          var result = 0;
          for (var i = 0; i < this.bucketLocators.length; i += 2)
            result += this.bucketLocators[i + 1];
          return result;
        };
        return CompressorCustomHashTable2;
      }();
      LZUTF82.CompressorCustomHashTable = CompressorCustomHashTable;
    })(LZUTF8 || (LZUTF8 = {}));
    var LZUTF8;
    (function(LZUTF82) {
      var CompressorSimpleHashTable = function() {
        function CompressorSimpleHashTable2(size) {
          this.maximumBucketCapacity = 64;
          this.buckets = new Array(size);
        }
        CompressorSimpleHashTable2.prototype.addValueToBucket = function(bucketIndex, valueToAdd) {
          var bucket = this.buckets[bucketIndex];
          if (bucket === void 0) {
            this.buckets[bucketIndex] = [valueToAdd];
          } else {
            if (bucket.length === this.maximumBucketCapacity - 1)
              LZUTF82.ArrayTools.truncateStartingElements(bucket, this.maximumBucketCapacity / 2);
            bucket.push(valueToAdd);
          }
        };
        CompressorSimpleHashTable2.prototype.getArraySegmentForBucketIndex = function(bucketIndex, outputObject) {
          var bucket = this.buckets[bucketIndex];
          if (bucket === void 0)
            return null;
          if (outputObject === void 0)
            outputObject = new LZUTF82.ArraySegment(bucket, 0, bucket.length);
          return outputObject;
        };
        CompressorSimpleHashTable2.prototype.getUsedBucketCount = function() {
          return LZUTF82.ArrayTools.countNonzeroValuesInArray(this.buckets);
        };
        CompressorSimpleHashTable2.prototype.getTotalElementCount = function() {
          var currentSum = 0;
          for (var i = 0; i < this.buckets.length; i++) {
            if (this.buckets[i] !== void 0)
              currentSum += this.buckets[i].length;
          }
          return currentSum;
        };
        return CompressorSimpleHashTable2;
      }();
      LZUTF82.CompressorSimpleHashTable = CompressorSimpleHashTable;
    })(LZUTF8 || (LZUTF8 = {}));
    var LZUTF8;
    (function(LZUTF82) {
      var Decompressor = function() {
        function Decompressor2() {
          this.MaximumMatchDistance = 32767;
          this.outputPosition = 0;
        }
        Decompressor2.prototype.decompressBlockToString = function(input) {
          input = LZUTF82.BufferTools.convertToUint8ArrayIfNeeded(input);
          return LZUTF82.decodeUTF8(this.decompressBlock(input));
        };
        Decompressor2.prototype.decompressBlock = function(input) {
          if (this.inputBufferRemainder) {
            input = LZUTF82.ArrayTools.concatUint8Arrays([this.inputBufferRemainder, input]);
            this.inputBufferRemainder = void 0;
          }
          var outputStartPosition = this.cropOutputBufferToWindowAndInitialize(Math.max(input.length * 4, 1024));
          for (var readPosition = 0, inputLength = input.length; readPosition < inputLength; readPosition++) {
            var inputValue = input[readPosition];
            if (inputValue >>> 6 != 3) {
              this.outputByte(inputValue);
              continue;
            }
            var sequenceLengthIdentifier = inputValue >>> 5;
            if (readPosition == inputLength - 1 || readPosition == inputLength - 2 && sequenceLengthIdentifier == 7) {
              this.inputBufferRemainder = input.subarray(readPosition);
              break;
            }
            if (input[readPosition + 1] >>> 7 === 1) {
              this.outputByte(inputValue);
            } else {
              var matchLength = inputValue & 31;
              var matchDistance = void 0;
              if (sequenceLengthIdentifier == 6) {
                matchDistance = input[readPosition + 1];
                readPosition += 1;
              } else {
                matchDistance = input[readPosition + 1] << 8 | input[readPosition + 2];
                readPosition += 2;
              }
              var matchPosition = this.outputPosition - matchDistance;
              for (var offset = 0; offset < matchLength; offset++)
                this.outputByte(this.outputBuffer[matchPosition + offset]);
            }
          }
          this.rollBackIfOutputBufferEndsWithATruncatedMultibyteSequence();
          return LZUTF82.CompressionCommon.getCroppedBuffer(this.outputBuffer, outputStartPosition, this.outputPosition - outputStartPosition);
        };
        Decompressor2.prototype.outputByte = function(value) {
          if (this.outputPosition === this.outputBuffer.length)
            this.outputBuffer = LZUTF82.ArrayTools.doubleByteArrayCapacity(this.outputBuffer);
          this.outputBuffer[this.outputPosition++] = value;
        };
        Decompressor2.prototype.cropOutputBufferToWindowAndInitialize = function(initialCapacity) {
          if (!this.outputBuffer) {
            this.outputBuffer = new Uint8Array(initialCapacity);
            return 0;
          }
          var cropLength = Math.min(this.outputPosition, this.MaximumMatchDistance);
          this.outputBuffer = LZUTF82.CompressionCommon.getCroppedBuffer(this.outputBuffer, this.outputPosition - cropLength, cropLength, initialCapacity);
          this.outputPosition = cropLength;
          if (this.outputBufferRemainder) {
            for (var i = 0; i < this.outputBufferRemainder.length; i++)
              this.outputByte(this.outputBufferRemainder[i]);
            this.outputBufferRemainder = void 0;
          }
          return cropLength;
        };
        Decompressor2.prototype.rollBackIfOutputBufferEndsWithATruncatedMultibyteSequence = function() {
          for (var offset = 1; offset <= 4 && this.outputPosition - offset >= 0; offset++) {
            var value = this.outputBuffer[this.outputPosition - offset];
            if (offset < 4 && value >>> 3 === 30 || offset < 3 && value >>> 4 === 14 || offset < 2 && value >>> 5 === 6) {
              this.outputBufferRemainder = this.outputBuffer.subarray(this.outputPosition - offset, this.outputPosition);
              this.outputPosition -= offset;
              return;
            }
          }
        };
        return Decompressor2;
      }();
      LZUTF82.Decompressor = Decompressor;
    })(LZUTF8 || (LZUTF8 = {}));
    var LZUTF8;
    (function(LZUTF82) {
      var Encoding;
      (function(Encoding2) {
        var Base64;
        (function(Base642) {
          var charCodeMap = new Uint8Array([65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47]);
          var reverseCharCodeMap = new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 62, 255, 255, 255, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 255, 255, 255, 0, 255, 255, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 255, 255, 255, 255, 255, 255, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 255, 255, 255, 255]);
          var paddingCharacter = "=";
          var paddingCharCode = 61;
          Base642.encode = function(inputBytes) {
            if (!inputBytes || inputBytes.length == 0)
              return "";
            if (LZUTF82.runningInNodeJS()) {
              return LZUTF82.BufferTools.uint8ArrayToBuffer(inputBytes).toString("base64");
            } else {
              return Base642.encodeWithJS(inputBytes);
            }
          };
          Base642.decode = function(base64String) {
            if (!base64String)
              return new Uint8Array(0);
            if (LZUTF82.runningInNodeJS()) {
              return LZUTF82.BufferTools.bufferToUint8Array(new Buffer(base64String, "base64"));
            } else {
              return Base642.decodeWithJS(base64String);
            }
          };
          Base642.encodeWithJS = function(inputBytes, addPadding) {
            if (addPadding === void 0) {
              addPadding = true;
            }
            if (!inputBytes || inputBytes.length == 0)
              return "";
            var map4 = charCodeMap;
            var output = new LZUTF82.StringBuilder();
            var uint24;
            for (var readPosition = 0, length_5 = inputBytes.length; readPosition < length_5; readPosition += 3) {
              if (readPosition <= length_5 - 3) {
                uint24 = inputBytes[readPosition] << 16 | inputBytes[readPosition + 1] << 8 | inputBytes[readPosition + 2];
                output.appendCharCode(map4[uint24 >>> 18 & 63]);
                output.appendCharCode(map4[uint24 >>> 12 & 63]);
                output.appendCharCode(map4[uint24 >>> 6 & 63]);
                output.appendCharCode(map4[uint24 & 63]);
                uint24 = 0;
              } else if (readPosition === length_5 - 2) {
                uint24 = inputBytes[readPosition] << 16 | inputBytes[readPosition + 1] << 8;
                output.appendCharCode(map4[uint24 >>> 18 & 63]);
                output.appendCharCode(map4[uint24 >>> 12 & 63]);
                output.appendCharCode(map4[uint24 >>> 6 & 63]);
                if (addPadding)
                  output.appendCharCode(paddingCharCode);
              } else if (readPosition === length_5 - 1) {
                uint24 = inputBytes[readPosition] << 16;
                output.appendCharCode(map4[uint24 >>> 18 & 63]);
                output.appendCharCode(map4[uint24 >>> 12 & 63]);
                if (addPadding) {
                  output.appendCharCode(paddingCharCode);
                  output.appendCharCode(paddingCharCode);
                }
              }
            }
            return output.getOutputString();
          };
          Base642.decodeWithJS = function(base64String, outputBuffer) {
            if (!base64String || base64String.length == 0)
              return new Uint8Array(0);
            var lengthModulo4 = base64String.length % 4;
            if (lengthModulo4 === 1)
              throw new Error("Invalid Base64 string: length % 4 == 1");
            else if (lengthModulo4 === 2)
              base64String += paddingCharacter + paddingCharacter;
            else if (lengthModulo4 === 3)
              base64String += paddingCharacter;
            if (!outputBuffer)
              outputBuffer = new Uint8Array(base64String.length);
            var outputPosition = 0;
            var length = base64String.length;
            for (var i = 0; i < length; i += 4) {
              var uint24 = reverseCharCodeMap[base64String.charCodeAt(i)] << 18 | reverseCharCodeMap[base64String.charCodeAt(i + 1)] << 12 | reverseCharCodeMap[base64String.charCodeAt(i + 2)] << 6 | reverseCharCodeMap[base64String.charCodeAt(i + 3)];
              outputBuffer[outputPosition++] = uint24 >>> 16 & 255;
              outputBuffer[outputPosition++] = uint24 >>> 8 & 255;
              outputBuffer[outputPosition++] = uint24 & 255;
            }
            if (base64String.charCodeAt(length - 1) == paddingCharCode)
              outputPosition--;
            if (base64String.charCodeAt(length - 2) == paddingCharCode)
              outputPosition--;
            return outputBuffer.subarray(0, outputPosition);
          };
        })(Base64 = Encoding2.Base64 || (Encoding2.Base64 = {}));
      })(Encoding = LZUTF82.Encoding || (LZUTF82.Encoding = {}));
    })(LZUTF8 || (LZUTF8 = {}));
    var LZUTF8;
    (function(LZUTF82) {
      var Encoding;
      (function(Encoding2) {
        var BinaryString;
        (function(BinaryString2) {
          BinaryString2.encode = function(input) {
            if (input == null)
              throw new TypeError("BinaryString.encode: undefined or null input received");
            if (input.length === 0)
              return "";
            var inputLength = input.length;
            var outputStringBuilder = new LZUTF82.StringBuilder();
            var remainder = 0;
            var state = 1;
            for (var i = 0; i < inputLength; i += 2) {
              var value = void 0;
              if (i == inputLength - 1)
                value = input[i] << 8;
              else
                value = input[i] << 8 | input[i + 1];
              outputStringBuilder.appendCharCode(remainder << 16 - state | value >>> state);
              remainder = value & (1 << state) - 1;
              if (state === 15) {
                outputStringBuilder.appendCharCode(remainder);
                remainder = 0;
                state = 1;
              } else {
                state += 1;
              }
              if (i >= inputLength - 2)
                outputStringBuilder.appendCharCode(remainder << 16 - state);
            }
            outputStringBuilder.appendCharCode(32768 | inputLength % 2);
            return outputStringBuilder.getOutputString();
          };
          BinaryString2.decode = function(input) {
            if (typeof input !== "string")
              throw new TypeError("BinaryString.decode: invalid input type");
            if (input == "")
              return new Uint8Array(0);
            var output = new Uint8Array(input.length * 3);
            var outputPosition = 0;
            var appendToOutput = function(value2) {
              output[outputPosition++] = value2 >>> 8;
              output[outputPosition++] = value2 & 255;
            };
            var remainder = 0;
            var state = 0;
            for (var i = 0; i < input.length; i++) {
              var value = input.charCodeAt(i);
              if (value >= 32768) {
                if (value == (32768 | 1))
                  outputPosition--;
                state = 0;
                continue;
              }
              if (state == 0) {
                remainder = value;
              } else {
                appendToOutput(remainder << state | value >>> 15 - state);
                remainder = value & (1 << 15 - state) - 1;
              }
              if (state == 15)
                state = 0;
              else
                state += 1;
            }
            return output.subarray(0, outputPosition);
          };
        })(BinaryString = Encoding2.BinaryString || (Encoding2.BinaryString = {}));
      })(Encoding = LZUTF82.Encoding || (LZUTF82.Encoding = {}));
    })(LZUTF8 || (LZUTF8 = {}));
    var LZUTF8;
    (function(LZUTF82) {
      var Encoding;
      (function(Encoding2) {
        var CodePoint;
        (function(CodePoint2) {
          CodePoint2.encodeFromString = function(str2, position) {
            var charCode = str2.charCodeAt(position);
            if (charCode < 55296 || charCode > 56319)
              return charCode;
            else {
              var nextCharCode = str2.charCodeAt(position + 1);
              if (nextCharCode >= 56320 && nextCharCode <= 57343)
                return 65536 + ((charCode - 55296 << 10) + (nextCharCode - 56320));
              else
                throw new Error("getUnicodeCodePoint: Received a lead surrogate character, char code " + charCode + ", followed by " + nextCharCode + ", which is not a trailing surrogate character code.");
            }
          };
          CodePoint2.decodeToString = function(codePoint) {
            if (codePoint <= 65535)
              return String.fromCharCode(codePoint);
            else if (codePoint <= 1114111)
              return String.fromCharCode(55296 + (codePoint - 65536 >>> 10), 56320 + (codePoint - 65536 & 1023));
            else
              throw new Error("getStringFromUnicodeCodePoint: A code point of " + codePoint + " cannot be encoded in UTF-16");
          };
        })(CodePoint = Encoding2.CodePoint || (Encoding2.CodePoint = {}));
      })(Encoding = LZUTF82.Encoding || (LZUTF82.Encoding = {}));
    })(LZUTF8 || (LZUTF8 = {}));
    var LZUTF8;
    (function(LZUTF82) {
      var Encoding;
      (function(Encoding2) {
        var DecimalString;
        (function(DecimalString2) {
          var lookupTable = ["000", "001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011", "012", "013", "014", "015", "016", "017", "018", "019", "020", "021", "022", "023", "024", "025", "026", "027", "028", "029", "030", "031", "032", "033", "034", "035", "036", "037", "038", "039", "040", "041", "042", "043", "044", "045", "046", "047", "048", "049", "050", "051", "052", "053", "054", "055", "056", "057", "058", "059", "060", "061", "062", "063", "064", "065", "066", "067", "068", "069", "070", "071", "072", "073", "074", "075", "076", "077", "078", "079", "080", "081", "082", "083", "084", "085", "086", "087", "088", "089", "090", "091", "092", "093", "094", "095", "096", "097", "098", "099", "100", "101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "140", "141", "142", "143", "144", "145", "146", "147", "148", "149", "150", "151", "152", "153", "154", "155", "156", "157", "158", "159", "160", "161", "162", "163", "164", "165", "166", "167", "168", "169", "170", "171", "172", "173", "174", "175", "176", "177", "178", "179", "180", "181", "182", "183", "184", "185", "186", "187", "188", "189", "190", "191", "192", "193", "194", "195", "196", "197", "198", "199", "200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211", "212", "213", "214", "215", "216", "217", "218", "219", "220", "221", "222", "223", "224", "225", "226", "227", "228", "229", "230", "231", "232", "233", "234", "235", "236", "237", "238", "239", "240", "241", "242", "243", "244", "245", "246", "247", "248", "249", "250", "251", "252", "253", "254", "255"];
          DecimalString2.encode = function(binaryBytes) {
            var resultArray = [];
            for (var i = 0; i < binaryBytes.length; i++)
              resultArray.push(lookupTable[binaryBytes[i]]);
            return resultArray.join(" ");
          };
        })(DecimalString = Encoding2.DecimalString || (Encoding2.DecimalString = {}));
      })(Encoding = LZUTF82.Encoding || (LZUTF82.Encoding = {}));
    })(LZUTF8 || (LZUTF8 = {}));
    var LZUTF8;
    (function(LZUTF82) {
      var Encoding;
      (function(Encoding2) {
        var StorageBinaryString;
        (function(StorageBinaryString2) {
          StorageBinaryString2.encode = function(input) {
            return Encoding2.BinaryString.encode(input).replace(/\0/g, "\u8002");
          };
          StorageBinaryString2.decode = function(input) {
            return Encoding2.BinaryString.decode(input.replace(/\u8002/g, "\0"));
          };
        })(StorageBinaryString = Encoding2.StorageBinaryString || (Encoding2.StorageBinaryString = {}));
      })(Encoding = LZUTF82.Encoding || (LZUTF82.Encoding = {}));
    })(LZUTF8 || (LZUTF8 = {}));
    var LZUTF8;
    (function(LZUTF82) {
      var Encoding;
      (function(Encoding2) {
        var UTF8;
        (function(UTF82) {
          var nativeTextEncoder;
          var nativeTextDecoder;
          UTF82.encode = function(str2) {
            if (!str2 || str2.length == 0)
              return new Uint8Array(0);
            if (LZUTF82.runningInNodeJS()) {
              return LZUTF82.BufferTools.bufferToUint8Array(new Buffer(str2, "utf8"));
            } else if (UTF82.createNativeTextEncoderAndDecoderIfAvailable()) {
              return nativeTextEncoder.encode(str2);
            } else {
              return UTF82.encodeWithJS(str2);
            }
          };
          UTF82.decode = function(utf8Bytes) {
            if (!utf8Bytes || utf8Bytes.length == 0)
              return "";
            if (LZUTF82.runningInNodeJS()) {
              return LZUTF82.BufferTools.uint8ArrayToBuffer(utf8Bytes).toString("utf8");
            } else if (UTF82.createNativeTextEncoderAndDecoderIfAvailable()) {
              return nativeTextDecoder.decode(utf8Bytes);
            } else {
              return UTF82.decodeWithJS(utf8Bytes);
            }
          };
          UTF82.encodeWithJS = function(str2, outputArray) {
            if (!str2 || str2.length == 0)
              return new Uint8Array(0);
            if (!outputArray)
              outputArray = new Uint8Array(str2.length * 4);
            var writeIndex = 0;
            for (var readIndex = 0; readIndex < str2.length; readIndex++) {
              var charCode = Encoding2.CodePoint.encodeFromString(str2, readIndex);
              if (charCode <= 127) {
                outputArray[writeIndex++] = charCode;
              } else if (charCode <= 2047) {
                outputArray[writeIndex++] = 192 | charCode >>> 6;
                outputArray[writeIndex++] = 128 | charCode & 63;
              } else if (charCode <= 65535) {
                outputArray[writeIndex++] = 224 | charCode >>> 12;
                outputArray[writeIndex++] = 128 | charCode >>> 6 & 63;
                outputArray[writeIndex++] = 128 | charCode & 63;
              } else if (charCode <= 1114111) {
                outputArray[writeIndex++] = 240 | charCode >>> 18;
                outputArray[writeIndex++] = 128 | charCode >>> 12 & 63;
                outputArray[writeIndex++] = 128 | charCode >>> 6 & 63;
                outputArray[writeIndex++] = 128 | charCode & 63;
                readIndex++;
              } else
                throw new Error("Invalid UTF-16 string: Encountered a character unsupported by UTF-8/16 (RFC 3629)");
            }
            return outputArray.subarray(0, writeIndex);
          };
          UTF82.decodeWithJS = function(utf8Bytes, startOffset, endOffset) {
            if (startOffset === void 0) {
              startOffset = 0;
            }
            if (!utf8Bytes || utf8Bytes.length == 0)
              return "";
            if (endOffset === void 0)
              endOffset = utf8Bytes.length;
            var output = new LZUTF82.StringBuilder();
            var outputCodePoint;
            var leadByte;
            for (var readIndex = startOffset, length_6 = endOffset; readIndex < length_6; ) {
              leadByte = utf8Bytes[readIndex];
              if (leadByte >>> 7 === 0) {
                outputCodePoint = leadByte;
                readIndex += 1;
              } else if (leadByte >>> 5 === 6) {
                if (readIndex + 1 >= endOffset)
                  throw new Error("Invalid UTF-8 stream: Truncated codepoint sequence encountered at position " + readIndex);
                outputCodePoint = (leadByte & 31) << 6 | utf8Bytes[readIndex + 1] & 63;
                readIndex += 2;
              } else if (leadByte >>> 4 === 14) {
                if (readIndex + 2 >= endOffset)
                  throw new Error("Invalid UTF-8 stream: Truncated codepoint sequence encountered at position " + readIndex);
                outputCodePoint = (leadByte & 15) << 12 | (utf8Bytes[readIndex + 1] & 63) << 6 | utf8Bytes[readIndex + 2] & 63;
                readIndex += 3;
              } else if (leadByte >>> 3 === 30) {
                if (readIndex + 3 >= endOffset)
                  throw new Error("Invalid UTF-8 stream: Truncated codepoint sequence encountered at position " + readIndex);
                outputCodePoint = (leadByte & 7) << 18 | (utf8Bytes[readIndex + 1] & 63) << 12 | (utf8Bytes[readIndex + 2] & 63) << 6 | utf8Bytes[readIndex + 3] & 63;
                readIndex += 4;
              } else
                throw new Error("Invalid UTF-8 stream: An invalid lead byte value encountered at position " + readIndex);
              output.appendCodePoint(outputCodePoint);
            }
            return output.getOutputString();
          };
          UTF82.createNativeTextEncoderAndDecoderIfAvailable = function() {
            if (nativeTextEncoder)
              return true;
            if (typeof TextEncoder == "function") {
              nativeTextEncoder = new TextEncoder("utf-8");
              nativeTextDecoder = new TextDecoder("utf-8");
              return true;
            } else
              return false;
          };
        })(UTF8 = Encoding2.UTF8 || (Encoding2.UTF8 = {}));
      })(Encoding = LZUTF82.Encoding || (LZUTF82.Encoding = {}));
    })(LZUTF8 || (LZUTF8 = {}));
    var LZUTF8;
    (function(LZUTF82) {
      function compress2(input, options) {
        if (options === void 0) {
          options = {};
        }
        if (input == null)
          throw new TypeError("compress: undefined or null input received");
        var inputEncoding = LZUTF82.CompressionCommon.detectCompressionSourceEncoding(input);
        options = LZUTF82.ObjectTools.override({inputEncoding, outputEncoding: "ByteArray"}, options);
        var compressor = new LZUTF82.Compressor();
        var compressedBytes = compressor.compressBlock(input);
        return LZUTF82.CompressionCommon.encodeCompressedBytes(compressedBytes, options.outputEncoding);
      }
      LZUTF82.compress = compress2;
      function decompress2(input, options) {
        if (options === void 0) {
          options = {};
        }
        if (input == null)
          throw new TypeError("decompress: undefined or null input received");
        options = LZUTF82.ObjectTools.override({inputEncoding: "ByteArray", outputEncoding: "String"}, options);
        var inputBytes = LZUTF82.CompressionCommon.decodeCompressedBytes(input, options.inputEncoding);
        var decompressor = new LZUTF82.Decompressor();
        var decompressedBytes = decompressor.decompressBlock(inputBytes);
        return LZUTF82.CompressionCommon.encodeDecompressedBytes(decompressedBytes, options.outputEncoding);
      }
      LZUTF82.decompress = decompress2;
      function compressAsync(input, options, callback) {
        if (callback == null)
          callback = function() {
          };
        var inputEncoding;
        try {
          inputEncoding = LZUTF82.CompressionCommon.detectCompressionSourceEncoding(input);
        } catch (e) {
          callback(void 0, e);
          return;
        }
        options = LZUTF82.ObjectTools.override({
          inputEncoding,
          outputEncoding: "ByteArray",
          useWebWorker: true,
          blockSize: 65536
        }, options);
        LZUTF82.enqueueImmediate(function() {
          if (options.useWebWorker && LZUTF82.WebWorker.createGlobalWorkerIfNeeded()) {
            LZUTF82.WebWorker.compressAsync(input, options, callback);
          } else {
            LZUTF82.AsyncCompressor.compressAsync(input, options, callback);
          }
        });
      }
      LZUTF82.compressAsync = compressAsync;
      function decompressAsync(input, options, callback) {
        if (callback == null)
          callback = function() {
          };
        if (input == null) {
          callback(void 0, new TypeError("decompressAsync: undefined or null input received"));
          return;
        }
        options = LZUTF82.ObjectTools.override({
          inputEncoding: "ByteArray",
          outputEncoding: "String",
          useWebWorker: true,
          blockSize: 65536
        }, options);
        var normalizedInput = LZUTF82.BufferTools.convertToUint8ArrayIfNeeded(input);
        LZUTF82.EventLoop.enqueueImmediate(function() {
          if (options.useWebWorker && LZUTF82.WebWorker.createGlobalWorkerIfNeeded()) {
            LZUTF82.WebWorker.decompressAsync(normalizedInput, options, callback);
          } else {
            LZUTF82.AsyncDecompressor.decompressAsync(input, options, callback);
          }
        });
      }
      LZUTF82.decompressAsync = decompressAsync;
      function createCompressionStream() {
        return LZUTF82.AsyncCompressor.createCompressionStream();
      }
      LZUTF82.createCompressionStream = createCompressionStream;
      function createDecompressionStream() {
        return LZUTF82.AsyncDecompressor.createDecompressionStream();
      }
      LZUTF82.createDecompressionStream = createDecompressionStream;
      function encodeUTF8(str2) {
        return LZUTF82.Encoding.UTF8.encode(str2);
      }
      LZUTF82.encodeUTF8 = encodeUTF8;
      function decodeUTF8(input) {
        return LZUTF82.Encoding.UTF8.decode(input);
      }
      LZUTF82.decodeUTF8 = decodeUTF8;
      function encodeBase64(input) {
        return LZUTF82.Encoding.Base64.encode(input);
      }
      LZUTF82.encodeBase64 = encodeBase64;
      function decodeBase64(str2) {
        return LZUTF82.Encoding.Base64.decode(str2);
      }
      LZUTF82.decodeBase64 = decodeBase64;
      function encodeBinaryString(input) {
        return LZUTF82.Encoding.BinaryString.encode(input);
      }
      LZUTF82.encodeBinaryString = encodeBinaryString;
      function decodeBinaryString(str2) {
        return LZUTF82.Encoding.BinaryString.decode(str2);
      }
      LZUTF82.decodeBinaryString = decodeBinaryString;
      function encodeStorageBinaryString(input) {
        return LZUTF82.Encoding.StorageBinaryString.encode(input);
      }
      LZUTF82.encodeStorageBinaryString = encodeStorageBinaryString;
      function decodeStorageBinaryString(str2) {
        return LZUTF82.Encoding.StorageBinaryString.decode(str2);
      }
      LZUTF82.decodeStorageBinaryString = decodeStorageBinaryString;
    })(LZUTF8 || (LZUTF8 = {}));
  });

  // node_modules/base85/lib/alphabets.js
  var require_alphabets = __commonJS((exports, module) => {
    "use strict";
    var alphabet = {};
    alphabet.enc = [
      "!",
      '"',
      "#",
      "$",
      "%",
      "&",
      "'",
      "(",
      ")",
      "*",
      "+",
      ",",
      "-",
      ".",
      "/",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      ":",
      ";",
      "<",
      "=",
      ">",
      "?",
      "@",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "[",
      "\\",
      "]",
      "^",
      "_",
      "`",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u"
    ];
    alphabet.dec = Object.fromEntries(alphabet.enc.map((char, index) => {
      return [char.charCodeAt(0), index];
    }));
    alphabet.enc = Object.fromEntries(alphabet.enc.map((char, index) => {
      return [index, char];
    }));
    module.exports = alphabet;
  });

  // node_modules/base85/lib/base85.js
  var require_base85 = __commonJS((exports, module) => {
    "use strict";
    var alphabets = require_alphabets();
    var NUM_MAXVALUE = Math.pow(2, 32) - 1;
    var QUAD85 = 85 * 85 * 85 * 85;
    var TRIO85 = 85 * 85 * 85;
    var DUO85 = 85 * 85;
    var SING85 = 85;
    var IGNORE_CHARS = [
      9,
      10,
      11,
      12,
      13,
      32
    ];
    var ASCII85_ENC_START = "<~";
    var ASCII85_ENC_END = "~>";
    const ENCODINGS = {
      bytes: "ByteArray",
      string: "String"
    };
    function toBuffer(string) {
      const encoder = new TextEncoder();
      return encoder.encode(string);
    }
    function fromBuffer(buffer2) {
      const decoder = new TextDecoder();
      return decoder.decode(buffer2);
    }
    function encodeBuffer(buffer2) {
      var enctable = alphabets.enc;
      var padding = buffer2.length % 4 === 0 ? 0 : 4 - buffer2.length % 4;
      var result = "";
      for (var i = 0; i < buffer2.length; i += 4) {
        var num = (buffer2[i] << 24 >>> 0) + ((i + 1 > buffer2.length ? 0 : buffer2[i + 1]) << 16 >>> 0) + ((i + 2 > buffer2.length ? 0 : buffer2[i + 2]) << 8 >>> 0) + ((i + 3 > buffer2.length ? 0 : buffer2[i + 3]) << 0 >>> 0);
        var block = [];
        for (var j = 0; j < 5; ++j) {
          block.unshift(enctable[num % 85]);
          num = Math.floor(num / 85);
        }
        block = block.join("");
        if (block === "!!!!!") {
          block = "z";
        }
        result += block;
      }
      return ASCII85_ENC_START + result.substring(0, result.length - padding) + ASCII85_ENC_END;
    }
    function decodeBuffer(buffer2) {
      var dectable = alphabets.dec;
      var dataLength = buffer2.length;
      dataLength -= ASCII85_ENC_START.length + ASCII85_ENC_END.length;
      var padding = dataLength % 5 === 0 ? 0 : 5 - dataLength % 5;
      var bufferStart = ASCII85_ENC_START.length;
      var bufferEnd = bufferStart + dataLength;
      var result = new Uint8Array(4 * Math.ceil((bufferEnd - bufferStart) / 5));
      var nextValidByte = function(index) {
        if (index < bufferEnd) {
          while (IGNORE_CHARS.indexOf(buffer2[index]) !== -1) {
            padding = (padding + 1) % 5;
            index++;
          }
        }
        return index;
      };
      var writeIndex = 0;
      for (var i = bufferStart; i < bufferEnd; ) {
        var num = 0;
        i = nextValidByte(i);
        num = dectable[buffer2[i]] * QUAD85;
        i = nextValidByte(i + 1);
        num += (i >= bufferEnd ? 84 : dectable[buffer2[i]]) * TRIO85;
        i = nextValidByte(i + 1);
        num += (i >= bufferEnd ? 84 : dectable[buffer2[i]]) * DUO85;
        i = nextValidByte(i + 1);
        num += (i >= bufferEnd ? 84 : dectable[buffer2[i]]) * SING85;
        i = nextValidByte(i + 1);
        num += i >= bufferEnd ? 84 : dectable[buffer2[i]];
        i = nextValidByte(i + 1);
        if (num > NUM_MAXVALUE || num < 0) {
          return false;
        }
        result[writeIndex] = num >>> 24;
        result[writeIndex + 1] = num >>> 16;
        result[writeIndex + 2] = num >>> 8;
        result[writeIndex + 3] = num & 255;
        writeIndex += 4;
      }
      return result.slice(0, writeIndex - padding);
    }
    module.exports = {
      encode: function(data, encoding3 = ENCODINGS.string) {
        if (typeof data === "string")
          data = toBuffer(data);
        if (encoding3 === ENCODINGS.bytes)
          return toBuffer(encodeBuffer(data));
        return encodeBuffer(data);
      },
      decode: function(data, encoding3 = ENCODINGS.bytes) {
        if (typeof data === "string")
          data = toBuffer(data.replace("z", "!!!!!"));
        if (encoding3 === ENCODINGS.string)
          return fromBuffer(decodeBuffer(data));
        return decodeBuffer(data);
      }
    };
  });

  // src/index.ts
  var require_src = __commonJS((exports) => {
    __export(exports, {
      BaseAdapter: () => BaseAdapter,
      BaseOverlay: () => BaseOverlay,
      FILE_SYSTEM_CHANGES: () => FILE_SYSTEM_CHANGES,
      FileSystemOverlay: () => FileSystemOverlay,
      IndexedDBAdapter: () => IndexedDBAdapter,
      LocalStorageAdapter: () => LocalStorageAdapter,
      MemoryAdapter: () => MemoryAdapter,
      SessionStorageAdapter: () => SessionStorageAdapter,
      StorageRegistry: () => StorageRegistry,
      WebStorageAdapter: () => WebStorageAdapter,
      basename: () => basename2,
      can_watch: () => can_watch,
      compress: () => compress,
      create_url_object: () => create_url_object,
      decode_safe: () => decode_safe,
      decode_utf8: () => decode_utf8,
      decompress: () => decompress,
      delimiter: () => delimiter2,
      dirname: () => dirname2,
      encode_safe: () => encode_safe,
      encode_utf8: () => encode_utf8,
      extname: () => extname2,
      filter_query: () => filter_query,
      get_mime_type: () => get_mime_type,
      hook_watcher: () => hook_watcher,
      join: () => join2,
      make_glob: () => make_glob,
      normalize: () => normalize2,
      relative: () => relative2,
      resolve: () => resolve2,
      sep: () => sep2
    });
  });

  // src/util/constants.ts
  const DEFAULT_MIME_TYPE = "application/octet-stream";
  var ENCODING_MODE;
  (function(ENCODING_MODE2) {
    ENCODING_MODE2["bytes"] = "MODE_BYTES";
    ENCODING_MODE2["text"] = "MODE_TEXT";
  })(ENCODING_MODE || (ENCODING_MODE = {}));
  var NODE_CHANGES;
  (function(NODE_CHANGES3) {
    NODE_CHANGES3["attached"] = "CHANGE_ATTACHED";
    NODE_CHANGES3["created"] = "CHANGE_CREATED";
    NODE_CHANGES3["updated"] = "CHANGE_UPDATED";
    NODE_CHANGES3["removed"] = "CHANGE_REMOVED";
  })(NODE_CHANGES || (NODE_CHANGES = {}));
  var NODE_TYPES;
  (function(NODE_TYPES2) {
    NODE_TYPES2["directory"] = "NODE_DIRECTORY";
    NODE_TYPES2["file"] = "NODE_FILE";
    NODE_TYPES2["undefined"] = "NODE_UNDEFINED";
  })(NODE_TYPES || (NODE_TYPES = {}));

  // src/util/event.ts
  function event(start) {
    const subscribers = [];
    let stop;
    const dispatch = (details) => {
      if (subscribers.length > 0) {
        for (let index = 0; index < subscribers.length; index++) {
          const [run2] = subscribers[index];
          run2(details);
        }
      }
    };
    const subscribe = (run2) => {
      const subscriber = [run2];
      subscribers.push(subscriber);
      if (start && subscribers.length === 1)
        stop = start(dispatch);
      return () => {
        const index = subscribers.indexOf(subscriber);
        if (index > 0) {
          subscribers.splice(index, 1);
          if (stop && subscribers.length == 0) {
            stop();
            stop = null;
          }
        }
      };
    };
    return {dispatch, subscribe};
  }

  // src/util/glob.ts
  const glob_to_regexp = __toModule(require_glob_to_regexp());
  function make_glob(pattern) {
    return glob_to_regexp.default(pattern, {extended: true, globstar: true});
  }

  // src/util/path.ts
  const _path = __toModule(require_path_browserify());
  const REGEX_TRAILING_SLASH = /[\/]*$/;
  const delimiter2 = _path.delimiter;
  const sep2 = _path.sep;
  const basename2 = _path.basename;
  const extname2 = _path.extname;
  const join2 = _path.join;
  const relative2 = _path.relative;
  const resolve2 = _path.resolve;
  function dirname2(p2) {
    p2 = _path.dirname(p2);
    return p2 === "." ? sep2 : p2;
  }
  function normalize2(p2) {
    p2 = _path.normalize(p2);
    if (p2 === "." || p2 === sep2)
      return sep2;
    if (p2.slice(0, 1) !== sep2)
      p2 = sep2 + p2;
    return p2.replace(REGEX_TRAILING_SLASH, "");
  }

  // src/adapters/base_adapter.ts
  function BaseAdapterOptions(options = {}) {
    const {namespace = "default"} = options;
    return {
      ...options,
      namespace
    };
  }
  function create_url_object(payload, mime_type) {
    if (payload instanceof Uint8Array) {
      if (!mime_type)
        mime_type = DEFAULT_MIME_TYPE;
      payload = new Blob([payload], {type: mime_type});
    }
    const url = URL.createObjectURL(payload);
    return {
      url,
      destroy: async () => URL.revokeObjectURL(url)
    };
  }
  function can_watch(event9, options = {}) {
    const {change, glob: glob3, inclusive = false, path: path5 = "/", recursive = false, regex, type} = options;
    if (type) {
      if (typeof type === "string") {
        if (event9.type !== type)
          return false;
      } else if (!type.includes(event9.type))
        return false;
    }
    if (change) {
      if (typeof change === "string") {
        if (change !== event9.change)
          return false;
      } else if (!change.includes(event9.change))
        return false;
    }
    if (glob3) {
      const regex2 = make_glob(normalize2(glob3));
      return regex2.test(event9.path);
    } else if (regex) {
      return regex.test(event9.path);
    } else {
      if (inclusive) {
        const _path2 = recursive ? join2(path5, "**") : join2(path5, "*");
        const regex2 = make_glob(normalize2(_path2));
        return regex2.test(event9.path);
      }
      return event9.path === normalize2(path5);
    }
  }
  function filter_query(nodes, options = {}) {
    const {path: path5 = {}, type} = options;
    if (type) {
      if (typeof type === "string")
        nodes = nodes.filter((node) => node.type === type);
      else
        nodes = nodes.filter((node) => type.includes(node.type));
    }
    if (path5.glob) {
      const regex = make_glob(normalize2(path5.glob));
      nodes = nodes.filter((node) => regex.test(node.path));
    } else if (path5.regex) {
      const {regex} = path5;
      nodes = nodes.filter((node) => regex.test(node.path));
    } else {
      let {path: _path2 = "/"} = path5;
      _path2 = path5.recursive ? join2(_path2, "**") : join2(_path2, "*");
      const regex = make_glob(normalize2(_path2));
      nodes = nodes.filter((node) => regex.test(node.path));
    }
    return nodes;
  }
  function hook_watcher(watcher, options = {}) {
    return event((dispatch) => {
      const destroy = watcher.subscribe((event9) => {
        if (can_watch(event9, options))
          dispatch(event9);
      });
      return () => destroy();
    });
  }
  class BaseAdapter {
    constructor(options = {}) {
      this.EVENT_MOUNTED = event();
      this.EVENT_UNMOUNTED = event();
      this.options = BaseAdapterOptions(options);
    }
    normalize(path5) {
      return normalize2(path5);
    }
    async create_url_object(path5) {
      throw new Error("bad dispatch to 'create_url_object' (not implemented)");
    }
    async get(path5) {
      throw new Error("bad dispatch to 'get' (not implemented)");
    }
    async put(path5, type = NODE_TYPES.undefined, mime_type) {
      throw new Error("bad dispatch to 'put' (not implemented)");
    }
    async query(options = {}) {
      throw new Error("bad dispatch to 'query' (not implemented)");
    }
    async read(path5) {
      throw new Error("bad dispatch to 'get_stats' (not implemented)");
    }
    async reload() {
      throw new Error("bad dispatch to 'reload' (not implemented)");
    }
    async remove(path5) {
      throw new Error("bad dispatch to 'remove' (not implemented)");
    }
    async watch(options = {}) {
      throw new Error("bad dispatch to 'watch' (not implemented)");
    }
    async write(path5, payload) {
      throw new Error("bad dispatch to 'put_payload' (not implemented)");
    }
    is_mounted() {
      throw new Error("bad dispatch to 'is_mounted' (not implemented)");
    }
    async mount() {
      throw new Error("bad dispatch to 'mount' (not implemented)");
    }
    async unmount() {
      throw new Error("bad dispatch to 'unmount' (not implemented)");
    }
  }
  BaseAdapter.can_hotlink = false;
  BaseAdapter.can_watch = false;
  BaseAdapter.can_watch_reload = false;
  BaseAdapter.is_available = false;
  BaseAdapter.is_readonly = false;
  BaseAdapter.requires_mount = false;

  // src/util/compression.ts
  const lzutf8 = __toModule(require_lzutf8());
  function compress(buffer2, options = {}) {
    const {mode = ENCODING_MODE.bytes} = options;
    switch (mode) {
      case ENCODING_MODE.bytes:
        return lzutf8.compress(buffer2, {outputEncoding: "ByteArray"});
      default:
        throw new Error(`bad option 'options.mode' to 'compress' (encoding mode '${mode}' not available)`);
    }
  }
  function decompress(buffer2, options = {}) {
    const {mode = ENCODING_MODE.bytes} = options;
    switch (mode) {
      case ENCODING_MODE.bytes:
        return lzutf8.decompress(buffer2, {outputEncoding: "ByteArray"});
      case ENCODING_MODE.text:
        return lzutf8.decompress(buffer2, {outputEncoding: "String"});
      default:
        throw new Error(`bad option 'options.mode' to 'decompress' (encoding mode '${mode}' not available)`);
    }
  }

  // src/util/datetime.ts
  function get_epoch_timestamp() {
    return Date.now();
  }

  // src/util/map.ts
  class ImmutableMap extends Map {
    constructor() {
      super(...arguments);
      this.clone = (value) => {
        throw new Error("bad dispatch to 'clone' (not implemented)");
      };
    }
    entries() {
      const {clone} = this;
      let entries = Array.from(super.entries());
      entries = entries.map(([key, value], index) => [key, clone(value)]);
      return entries[Symbol.iterator]();
    }
    forEach(callback, thisArg) {
      for (const entry of this) {
        const [key, value] = entry;
        callback.call(thisArg, this.clone(value), key, this);
      }
    }
    get(key) {
      const value = super.get(key);
      if (value !== void 0)
        return this.clone(value);
    }
    set(key, value) {
      value = this.clone(value);
      super.set(key, value);
      return this;
    }
    values() {
      let values = Array.from(super.values());
      values = values.map((value, index) => this.clone(value));
      return values[Symbol.iterator]();
    }
  }

  // src/data/mime_types.json
  var _23 = "application/vnd.lotus-1-2-3";
  var ez = "application/andrew-inset";
  var aw = "application/applixware";
  var atom = "application/atom+xml";
  var atomcat = "application/atomcat+xml";
  var atomdeleted = "application/atomdeleted+xml";
  var atomsvc = "application/atomsvc+xml";
  var dwd = "application/atsc-dwd+xml";
  var held = "application/atsc-held+xml";
  var rsat = "application/atsc-rsat+xml";
  var bdoc = "application/bdoc";
  var xcs = "application/calendar+xml";
  var ccxml = "application/ccxml+xml";
  var cdfx = "application/cdfx+xml";
  var cdmia = "application/cdmi-capability";
  var cdmic = "application/cdmi-container";
  var cdmid = "application/cdmi-domain";
  var cdmio = "application/cdmi-object";
  var cdmiq = "application/cdmi-queue";
  var cu = "application/cu-seeme";
  var mpd = "application/dash+xml";
  var davmount = "application/davmount+xml";
  var dbk = "application/docbook+xml";
  var dssc = "application/dssc+der";
  var xdssc = "application/dssc+xml";
  var ecma = "application/ecmascript";
  var es = "application/ecmascript";
  var emma = "application/emma+xml";
  var emotionml = "application/emotionml+xml";
  var epub = "application/epub+zip";
  var exi = "application/exi";
  var fdt = "application/fdt+xml";
  var pfr = "application/font-tdpfr";
  var geojson = "application/geo+json";
  var gml = "application/gml+xml";
  var gpx = "application/gpx+xml";
  var gxf = "application/gxf";
  var gz = "application/gzip";
  var hjson = "application/hjson";
  var stk = "application/hyperstudio";
  var ink = "application/inkml+xml";
  var inkml = "application/inkml+xml";
  var ipfix = "application/ipfix";
  var its = "application/its+xml";
  var jar = "application/java-archive";
  var war = "application/java-archive";
  var ear = "application/java-archive";
  var ser = "application/java-serialized-object";
  var class2 = "application/java-vm";
  var js = "application/javascript";
  var mjs = "application/javascript";
  var json = "application/json";
  var map = "application/json";
  var json5 = "application/json5";
  var jsonml = "application/jsonml+json";
  var jsonld = "application/ld+json";
  var lgr = "application/lgr+xml";
  var lostxml = "application/lost+xml";
  var hqx = "application/mac-binhex40";
  var cpt = "application/mac-compactpro";
  var mads = "application/mads+xml";
  var webmanifest = "application/manifest+json";
  var mrc = "application/marc";
  var mrcx = "application/marcxml+xml";
  var ma = "application/mathematica";
  var nb = "application/mathematica";
  var mb = "application/mathematica";
  var mathml = "application/mathml+xml";
  var mbox = "application/mbox";
  var mscml = "application/mediaservercontrol+xml";
  var metalink = "application/metalink+xml";
  var meta4 = "application/metalink4+xml";
  var mets = "application/mets+xml";
  var maei = "application/mmt-aei+xml";
  var musd = "application/mmt-usd+xml";
  var mods = "application/mods+xml";
  var m21 = "application/mp21";
  var mp21 = "application/mp21";
  var mp4s = "application/mp4";
  var m4p = "application/mp4";
  var xdf = "application/mrb-consumer+xml";
  var doc = "application/msword";
  var dot = "application/msword";
  var mxf = "application/mxf";
  var nq = "application/n-quads";
  var nt = "application/n-triples";
  var cjs = "application/node";
  var bin = "application/octet-stream";
  var dms = "application/octet-stream";
  var lrf = "application/octet-stream";
  var mar = "application/octet-stream";
  var so = "application/octet-stream";
  var dist = "application/octet-stream";
  var distz = "application/octet-stream";
  var pkg = "application/octet-stream";
  var bpk = "application/octet-stream";
  var dump = "application/octet-stream";
  var elc = "application/octet-stream";
  var deploy = "application/octet-stream";
  var exe = "application/x-msdos-program";
  var dll = "application/x-msdownload";
  var deb = "application/x-debian-package";
  var dmg = "application/x-apple-diskimage";
  var iso = "application/x-iso9660-image";
  var img = "application/octet-stream";
  var msi = "application/x-msdownload";
  var msp = "application/octet-stream";
  var msm = "application/octet-stream";
  var buffer = "application/octet-stream";
  var oda = "application/oda";
  var opf = "application/oebps-package+xml";
  var ogx = "application/ogg";
  var omdoc = "application/omdoc+xml";
  var onetoc = "application/onenote";
  var onetoc2 = "application/onenote";
  var onetmp = "application/onenote";
  var onepkg = "application/onenote";
  var oxps = "application/oxps";
  var relo = "application/p2p-overlay+xml";
  var xer = "application/patch-ops-error+xml";
  var pdf = "application/pdf";
  var pgp = "application/pgp-encrypted";
  var asc = "application/pgp-signature";
  var sig = "application/pgp-signature";
  var prf = "application/pics-rules";
  var p10 = "application/pkcs10";
  var p7m = "application/pkcs7-mime";
  var p7c = "application/pkcs7-mime";
  var p7s = "application/pkcs7-signature";
  var p8 = "application/pkcs8";
  var ac = "application/pkix-attr-cert";
  var cer = "application/pkix-cert";
  var crl = "application/pkix-crl";
  var pkipath = "application/pkix-pkipath";
  var pki = "application/pkixcmp";
  var pls = "application/pls+xml";
  var ai = "application/postscript";
  var eps = "application/postscript";
  var ps = "application/postscript";
  var provx = "application/provenance+xml";
  var cww = "application/prs.cww";
  var pskcxml = "application/pskc+xml";
  var raml = "application/raml+yaml";
  var rdf = "application/rdf+xml";
  var owl = "application/rdf+xml";
  var rif = "application/reginfo+xml";
  var rnc = "application/relax-ng-compact-syntax";
  var rl = "application/resource-lists+xml";
  var rld = "application/resource-lists-diff+xml";
  var rs = "application/rls-services+xml";
  var rapd = "application/route-apd+xml";
  var sls = "application/route-s-tsid+xml";
  var rusd = "application/route-usd+xml";
  var gbr = "application/rpki-ghostbusters";
  var mft = "application/rpki-manifest";
  var roa = "application/rpki-roa";
  var rsd = "application/rsd+xml";
  var rss = "application/rss+xml";
  var rtf = "application/rtf";
  var sbml = "application/sbml+xml";
  var scq = "application/scvp-cv-request";
  var scs = "application/scvp-cv-response";
  var spq = "application/scvp-vp-request";
  var spp = "application/scvp-vp-response";
  var sdp = "application/sdp";
  var senmlx = "application/senml+xml";
  var sensmlx = "application/sensml+xml";
  var setpay = "application/set-payment-initiation";
  var setreg = "application/set-registration-initiation";
  var shf = "application/shf+xml";
  var siv = "application/sieve";
  var sieve = "application/sieve";
  var smi = "application/smil+xml";
  var smil = "application/smil+xml";
  var rq = "application/sparql-query";
  var srx = "application/sparql-results+xml";
  var gram = "application/srgs";
  var grxml = "application/srgs+xml";
  var sru = "application/sru+xml";
  var ssdl = "application/ssdl+xml";
  var ssml = "application/ssml+xml";
  var swidtag = "application/swid+xml";
  var tei = "application/tei+xml";
  var teicorpus = "application/tei+xml";
  var tfi = "application/thraud+xml";
  var tsd = "application/timestamped-data";
  var toml = "application/toml";
  var ttml = "application/ttml+xml";
  var rsheet = "application/urc-ressheet+xml";
  var _km = "application/vnd.1000minds.decision-model+xml";
  var plb = "application/vnd.3gpp.pic-bw-large";
  var psb = "application/vnd.3gpp.pic-bw-small";
  var pvb = "application/vnd.3gpp.pic-bw-var";
  var tcap = "application/vnd.3gpp2.tcap";
  var pwn = "application/vnd.3m.post-it-notes";
  var aso = "application/vnd.accpac.simply.aso";
  var imp = "application/vnd.accpac.simply.imp";
  var acu = "application/vnd.acucobol";
  var atc = "application/vnd.acucorp";
  var acutc = "application/vnd.acucorp";
  var air = "application/vnd.adobe.air-application-installer-package+zip";
  var fcdt = "application/vnd.adobe.formscentral.fcdt";
  var fxp = "application/vnd.adobe.fxp";
  var fxpl = "application/vnd.adobe.fxp";
  var xdp = "application/vnd.adobe.xdp+xml";
  var xfdf = "application/vnd.adobe.xfdf";
  var ahead = "application/vnd.ahead.space";
  var azf = "application/vnd.airzip.filesecure.azf";
  var azs = "application/vnd.airzip.filesecure.azs";
  var azw = "application/vnd.amazon.ebook";
  var acc = "application/vnd.americandynamics.acc";
  var ami = "application/vnd.amiga.ami";
  var apk = "application/vnd.android.package-archive";
  var cii = "application/vnd.anser-web-certificate-issue-initiation";
  var fti = "application/vnd.anser-web-funds-transfer-initiation";
  var atx = "application/vnd.antix.game-component";
  var mpkg = "application/vnd.apple.installer+xml";
  var keynote = "application/vnd.apple.keynote";
  var m3u8 = "application/vnd.apple.mpegurl";
  var numbers = "application/vnd.apple.numbers";
  var pages = "application/vnd.apple.pages";
  var pkpass = "application/vnd.apple.pkpass";
  var swi = "application/vnd.aristanetworks.swi";
  var iota = "application/vnd.astraea-software.iota";
  var aep = "application/vnd.audiograph";
  var bmml = "application/vnd.balsamiq.bmml+xml";
  var mpm = "application/vnd.blueice.multipass";
  var bmi = "application/vnd.bmi";
  var rep = "application/vnd.businessobjects";
  var cdxml = "application/vnd.chemdraw+xml";
  var mmd = "application/vnd.chipnuts.karaoke-mmd";
  var cdy = "application/vnd.cinderella";
  var csl = "application/vnd.citationstyles.style+xml";
  var cla = "application/vnd.claymore";
  var rp9 = "application/vnd.cloanto.rp9";
  var c4g = "application/vnd.clonk.c4group";
  var c4d = "application/vnd.clonk.c4group";
  var c4f = "application/vnd.clonk.c4group";
  var c4p = "application/vnd.clonk.c4group";
  var c4u = "application/vnd.clonk.c4group";
  var c11amc = "application/vnd.cluetrust.cartomobile-config";
  var c11amz = "application/vnd.cluetrust.cartomobile-config-pkg";
  var csp = "application/vnd.commonspace";
  var cdbcmsg = "application/vnd.contact.cmsg";
  var cmc = "application/vnd.cosmocaller";
  var clkx = "application/vnd.crick.clicker";
  var clkk = "application/vnd.crick.clicker.keyboard";
  var clkp = "application/vnd.crick.clicker.palette";
  var clkt = "application/vnd.crick.clicker.template";
  var clkw = "application/vnd.crick.clicker.wordbank";
  var wbs = "application/vnd.criticaltools.wbs+xml";
  var pml = "application/vnd.ctc-posml";
  var ppd = "application/vnd.cups-ppd";
  var car = "application/vnd.curl.car";
  var pcurl = "application/vnd.curl.pcurl";
  var dart = "application/vnd.dart";
  var rdz = "application/vnd.data-vision.rdz";
  var uvf = "application/vnd.dece.data";
  var uvvf = "application/vnd.dece.data";
  var uvd = "application/vnd.dece.data";
  var uvvd = "application/vnd.dece.data";
  var uvt = "application/vnd.dece.ttml+xml";
  var uvvt = "application/vnd.dece.ttml+xml";
  var uvx = "application/vnd.dece.unspecified";
  var uvvx = "application/vnd.dece.unspecified";
  var uvz = "application/vnd.dece.zip";
  var uvvz = "application/vnd.dece.zip";
  var fe_launch = "application/vnd.denovo.fcselayout-link";
  var dna = "application/vnd.dna";
  var mlp = "application/vnd.dolby.mlp";
  var dpg = "application/vnd.dpgraph";
  var dfac = "application/vnd.dreamfactory";
  var kpxx = "application/vnd.ds-keypoint";
  var ait = "application/vnd.dvb.ait";
  var svc = "application/vnd.dvb.service";
  var geo = "application/vnd.dynageo";
  var mag = "application/vnd.ecowin.chart";
  var nml = "application/vnd.enliven";
  var esf = "application/vnd.epson.esf";
  var msf = "application/vnd.epson.msf";
  var qam = "application/vnd.epson.quickanime";
  var slt = "application/vnd.epson.salt";
  var ssf = "application/vnd.epson.ssf";
  var es3 = "application/vnd.eszigno3+xml";
  var et3 = "application/vnd.eszigno3+xml";
  var ez2 = "application/vnd.ezpix-album";
  var ez3 = "application/vnd.ezpix-package";
  var fdf = "application/vnd.fdf";
  var mseed = "application/vnd.fdsn.mseed";
  var seed = "application/vnd.fdsn.seed";
  var dataless = "application/vnd.fdsn.seed";
  var gph = "application/vnd.flographit";
  var ftc = "application/vnd.fluxtime.clip";
  var fm = "application/vnd.framemaker";
  var frame = "application/vnd.framemaker";
  var maker = "application/vnd.framemaker";
  var book = "application/vnd.framemaker";
  var fnc = "application/vnd.frogans.fnc";
  var ltf = "application/vnd.frogans.ltf";
  var fsc = "application/vnd.fsc.weblaunch";
  var oas = "application/vnd.fujitsu.oasys";
  var oa2 = "application/vnd.fujitsu.oasys2";
  var oa3 = "application/vnd.fujitsu.oasys3";
  var fg5 = "application/vnd.fujitsu.oasysgp";
  var bh2 = "application/vnd.fujitsu.oasysprs";
  var ddd = "application/vnd.fujixerox.ddd";
  var xdw = "application/vnd.fujixerox.docuworks";
  var xbd = "application/vnd.fujixerox.docuworks.binder";
  var fzs = "application/vnd.fuzzysheet";
  var txd = "application/vnd.genomatix.tuxedo";
  var ggb = "application/vnd.geogebra.file";
  var ggt = "application/vnd.geogebra.tool";
  var gex = "application/vnd.geometry-explorer";
  var gre = "application/vnd.geometry-explorer";
  var gxt = "application/vnd.geonext";
  var g2w = "application/vnd.geoplan";
  var g3w = "application/vnd.geospace";
  var gmx = "application/vnd.gmx";
  var gdoc = "application/vnd.google-apps.document";
  var gslides = "application/vnd.google-apps.presentation";
  var gsheet = "application/vnd.google-apps.spreadsheet";
  var kml = "application/vnd.google-earth.kml+xml";
  var kmz = "application/vnd.google-earth.kmz";
  var gqf = "application/vnd.grafeq";
  var gqs = "application/vnd.grafeq";
  var gac = "application/vnd.groove-account";
  var ghf = "application/vnd.groove-help";
  var gim = "application/vnd.groove-identity-message";
  var grv = "application/vnd.groove-injector";
  var gtm = "application/vnd.groove-tool-message";
  var tpl = "application/vnd.groove-tool-template";
  var vcg = "application/vnd.groove-vcard";
  var hal = "application/vnd.hal+xml";
  var zmm = "application/vnd.handheld-entertainment+xml";
  var hbci = "application/vnd.hbci";
  var les = "application/vnd.hhe.lesson-player";
  var hpgl = "application/vnd.hp-hpgl";
  var hpid = "application/vnd.hp-hpid";
  var hps = "application/vnd.hp-hps";
  var jlt = "application/vnd.hp-jlyt";
  var pcl = "application/vnd.hp-pcl";
  var pclxl = "application/vnd.hp-pclxl";
  var sfd_hdstx = "application/vnd.hydrostatix.sof-data";
  var mpy = "application/vnd.ibm.minipay";
  var afp = "application/vnd.ibm.modcap";
  var listafp = "application/vnd.ibm.modcap";
  var list3820 = "application/vnd.ibm.modcap";
  var irm = "application/vnd.ibm.rights-management";
  var sc = "application/vnd.ibm.secure-container";
  var icc = "application/vnd.iccprofile";
  var icm = "application/vnd.iccprofile";
  var igl = "application/vnd.igloader";
  var ivp = "application/vnd.immervision-ivp";
  var ivu = "application/vnd.immervision-ivu";
  var igm = "application/vnd.insors.igm";
  var xpw = "application/vnd.intercon.formnet";
  var xpx = "application/vnd.intercon.formnet";
  var i2g = "application/vnd.intergeo";
  var qbo = "application/vnd.intu.qbo";
  var qfx = "application/vnd.intu.qfx";
  var rcprofile = "application/vnd.ipunplugged.rcprofile";
  var irp = "application/vnd.irepository.package+xml";
  var xpr = "application/vnd.is-xpr";
  var fcs = "application/vnd.isac.fcs";
  var jam = "application/vnd.jam";
  var rms = "application/vnd.jcp.javame.midlet-rms";
  var jisp = "application/vnd.jisp";
  var joda = "application/vnd.joost.joda-archive";
  var ktz = "application/vnd.kahootz";
  var ktr = "application/vnd.kahootz";
  var karbon = "application/vnd.kde.karbon";
  var chrt = "application/vnd.kde.kchart";
  var kfo = "application/vnd.kde.kformula";
  var flw = "application/vnd.kde.kivio";
  var kon = "application/vnd.kde.kontour";
  var kpr = "application/vnd.kde.kpresenter";
  var kpt = "application/vnd.kde.kpresenter";
  var ksp = "application/vnd.kde.kspread";
  var kwd = "application/vnd.kde.kword";
  var kwt = "application/vnd.kde.kword";
  var htke = "application/vnd.kenameaapp";
  var kia = "application/vnd.kidspiration";
  var kne = "application/vnd.kinar";
  var knp = "application/vnd.kinar";
  var skp = "application/vnd.koan";
  var skd = "application/vnd.koan";
  var skt = "application/vnd.koan";
  var skm = "application/vnd.koan";
  var sse = "application/vnd.kodak-descriptor";
  var lasxml = "application/vnd.las.las+xml";
  var lbd = "application/vnd.llamagraphics.life-balance.desktop";
  var lbe = "application/vnd.llamagraphics.life-balance.exchange+xml";
  var apr = "application/vnd.lotus-approach";
  var pre = "application/vnd.lotus-freelance";
  var nsf = "application/vnd.lotus-notes";
  var org = "application/vnd.lotus-organizer";
  var scm = "application/vnd.lotus-screencam";
  var lwp = "application/vnd.lotus-wordpro";
  var portpkg = "application/vnd.macports.portpkg";
  var mcd = "application/vnd.mcd";
  var mc1 = "application/vnd.medcalcdata";
  var cdkey = "application/vnd.mediastation.cdkey";
  var mwf = "application/vnd.mfer";
  var mfm = "application/vnd.mfmp";
  var flo = "application/vnd.micrografx.flo";
  var igx = "application/vnd.micrografx.igx";
  var mif = "application/vnd.mif";
  var daf = "application/vnd.mobius.daf";
  var dis = "application/vnd.mobius.dis";
  var mbk = "application/vnd.mobius.mbk";
  var mqy = "application/vnd.mobius.mqy";
  var msl = "application/vnd.mobius.msl";
  var plc = "application/vnd.mobius.plc";
  var txf = "application/vnd.mobius.txf";
  var mpn = "application/vnd.mophun.application";
  var mpc = "application/vnd.mophun.certificate";
  var xul = "application/vnd.mozilla.xul+xml";
  var cil = "application/vnd.ms-artgalry";
  var cab = "application/vnd.ms-cab-compressed";
  var xls = "application/vnd.ms-excel";
  var xlm = "application/vnd.ms-excel";
  var xla = "application/vnd.ms-excel";
  var xlc = "application/vnd.ms-excel";
  var xlt = "application/vnd.ms-excel";
  var xlw = "application/vnd.ms-excel";
  var xlam = "application/vnd.ms-excel.addin.macroenabled.12";
  var xlsb = "application/vnd.ms-excel.sheet.binary.macroenabled.12";
  var xlsm = "application/vnd.ms-excel.sheet.macroenabled.12";
  var xltm = "application/vnd.ms-excel.template.macroenabled.12";
  var eot = "application/vnd.ms-fontobject";
  var chm = "application/vnd.ms-htmlhelp";
  var ims = "application/vnd.ms-ims";
  var lrm = "application/vnd.ms-lrm";
  var thmx = "application/vnd.ms-officetheme";
  var msg = "application/vnd.ms-outlook";
  var cat = "application/vnd.ms-pki.seccat";
  var stl = "model/stl";
  var ppt = "application/vnd.ms-powerpoint";
  var pps = "application/vnd.ms-powerpoint";
  var pot = "application/vnd.ms-powerpoint";
  var ppam = "application/vnd.ms-powerpoint.addin.macroenabled.12";
  var pptm = "application/vnd.ms-powerpoint.presentation.macroenabled.12";
  var sldm = "application/vnd.ms-powerpoint.slide.macroenabled.12";
  var ppsm = "application/vnd.ms-powerpoint.slideshow.macroenabled.12";
  var potm = "application/vnd.ms-powerpoint.template.macroenabled.12";
  var mpp = "application/vnd.ms-project";
  var mpt = "application/vnd.ms-project";
  var docm = "application/vnd.ms-word.document.macroenabled.12";
  var dotm = "application/vnd.ms-word.template.macroenabled.12";
  var wps = "application/vnd.ms-works";
  var wks = "application/vnd.ms-works";
  var wcm = "application/vnd.ms-works";
  var wdb = "application/vnd.ms-works";
  var wpl = "application/vnd.ms-wpl";
  var xps = "application/vnd.ms-xpsdocument";
  var mseq = "application/vnd.mseq";
  var mus = "application/vnd.musician";
  var msty = "application/vnd.muvee.style";
  var taglet = "application/vnd.mynfc";
  var nlu = "application/vnd.neurolanguage.nlu";
  var ntf = "application/vnd.nitf";
  var nitf = "application/vnd.nitf";
  var nnd = "application/vnd.noblenet-directory";
  var nns = "application/vnd.noblenet-sealer";
  var nnw = "application/vnd.noblenet-web";
  var ngdat = "application/vnd.nokia.n-gage.data";
  var n_gage = "application/vnd.nokia.n-gage.symbian.install";
  var rpst = "application/vnd.nokia.radio-preset";
  var rpss = "application/vnd.nokia.radio-presets";
  var edm = "application/vnd.novadigm.edm";
  var edx = "application/vnd.novadigm.edx";
  var ext = "application/vnd.novadigm.ext";
  var odc = "application/vnd.oasis.opendocument.chart";
  var otc = "application/vnd.oasis.opendocument.chart-template";
  var odb = "application/vnd.oasis.opendocument.database";
  var odf = "application/vnd.oasis.opendocument.formula";
  var odft = "application/vnd.oasis.opendocument.formula-template";
  var odg = "application/vnd.oasis.opendocument.graphics";
  var otg = "application/vnd.oasis.opendocument.graphics-template";
  var odi = "application/vnd.oasis.opendocument.image";
  var oti = "application/vnd.oasis.opendocument.image-template";
  var odp = "application/vnd.oasis.opendocument.presentation";
  var otp = "application/vnd.oasis.opendocument.presentation-template";
  var ods = "application/vnd.oasis.opendocument.spreadsheet";
  var ots = "application/vnd.oasis.opendocument.spreadsheet-template";
  var odt = "application/vnd.oasis.opendocument.text";
  var odm = "application/vnd.oasis.opendocument.text-master";
  var ott = "application/vnd.oasis.opendocument.text-template";
  var oth = "application/vnd.oasis.opendocument.text-web";
  var xo = "application/vnd.olpc-sugar";
  var dd2 = "application/vnd.oma.dd2+xml";
  var obgx = "application/vnd.openblox.game+xml";
  var oxt = "application/vnd.openofficeorg.extension";
  var osm = "application/vnd.openstreetmap.data+xml";
  var pptx = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  var sldx = "application/vnd.openxmlformats-officedocument.presentationml.slide";
  var ppsx = "application/vnd.openxmlformats-officedocument.presentationml.slideshow";
  var potx = "application/vnd.openxmlformats-officedocument.presentationml.template";
  var xlsx = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  var xltx = "application/vnd.openxmlformats-officedocument.spreadsheetml.template";
  var docx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  var dotx = "application/vnd.openxmlformats-officedocument.wordprocessingml.template";
  var mgp = "application/vnd.osgeo.mapguide.package";
  var dp = "application/vnd.osgi.dp";
  var esa = "application/vnd.osgi.subsystem";
  var pdb = "application/vnd.palm";
  var pqa = "application/vnd.palm";
  var oprc = "application/vnd.palm";
  var paw = "application/vnd.pawaafile";
  var str = "application/vnd.pg.format";
  var ei6 = "application/vnd.pg.osasli";
  var efif = "application/vnd.picsel";
  var wg = "application/vnd.pmi.widget";
  var plf = "application/vnd.pocketlearn";
  var pbd = "application/vnd.powerbuilder6";
  var box = "application/vnd.previewsystems.box";
  var mgz = "application/vnd.proteus.magazine";
  var qps = "application/vnd.publishare-delta-tree";
  var ptid = "application/vnd.pvi.ptid1";
  var qxd = "application/vnd.quark.quarkxpress";
  var qxt = "application/vnd.quark.quarkxpress";
  var qwd = "application/vnd.quark.quarkxpress";
  var qwt = "application/vnd.quark.quarkxpress";
  var qxl = "application/vnd.quark.quarkxpress";
  var qxb = "application/vnd.quark.quarkxpress";
  var bed = "application/vnd.realvnc.bed";
  var mxl = "application/vnd.recordare.musicxml";
  var musicxml = "application/vnd.recordare.musicxml+xml";
  var cryptonote = "application/vnd.rig.cryptonote";
  var cod = "application/vnd.rim.cod";
  var rm = "application/vnd.rn-realmedia";
  var rmvb = "application/vnd.rn-realmedia-vbr";
  var link66 = "application/vnd.route66.link66+xml";
  var st = "application/vnd.sailingtracker.track";
  var see = "application/vnd.seemail";
  var sema = "application/vnd.sema";
  var semd = "application/vnd.semd";
  var semf = "application/vnd.semf";
  var ifm = "application/vnd.shana.informed.formdata";
  var itp = "application/vnd.shana.informed.formtemplate";
  var iif = "application/vnd.shana.informed.interchange";
  var ipk = "application/vnd.shana.informed.package";
  var twd = "application/vnd.simtech-mindmapper";
  var twds = "application/vnd.simtech-mindmapper";
  var mmf = "application/vnd.smaf";
  var teacher = "application/vnd.smart.teacher";
  var fo = "application/vnd.software602.filler.form+xml";
  var sdkm = "application/vnd.solent.sdkm+xml";
  var sdkd = "application/vnd.solent.sdkm+xml";
  var dxp = "application/vnd.spotfire.dxp";
  var sfs = "application/vnd.spotfire.sfs";
  var sdc = "application/vnd.stardivision.calc";
  var sda = "application/vnd.stardivision.draw";
  var sdd = "application/vnd.stardivision.impress";
  var smf = "application/vnd.stardivision.math";
  var sdw = "application/vnd.stardivision.writer";
  var vor = "application/vnd.stardivision.writer";
  var sgl = "application/vnd.stardivision.writer-global";
  var smzip = "application/vnd.stepmania.package";
  var sm = "application/vnd.stepmania.stepchart";
  var wadl = "application/vnd.sun.wadl+xml";
  var sxc = "application/vnd.sun.xml.calc";
  var stc = "application/vnd.sun.xml.calc.template";
  var sxd = "application/vnd.sun.xml.draw";
  var std = "application/vnd.sun.xml.draw.template";
  var sxi = "application/vnd.sun.xml.impress";
  var sti = "application/vnd.sun.xml.impress.template";
  var sxm = "application/vnd.sun.xml.math";
  var sxw = "application/vnd.sun.xml.writer";
  var sxg = "application/vnd.sun.xml.writer.global";
  var stw = "application/vnd.sun.xml.writer.template";
  var sus = "application/vnd.sus-calendar";
  var susp = "application/vnd.sus-calendar";
  var svd = "application/vnd.svd";
  var sis = "application/vnd.symbian.install";
  var sisx = "application/vnd.symbian.install";
  var xsm = "application/vnd.syncml+xml";
  var bdm = "application/vnd.syncml.dm+wbxml";
  var xdm = "application/vnd.syncml.dm+xml";
  var ddf = "application/vnd.syncml.dmddf+xml";
  var tao = "application/vnd.tao.intent-module-archive";
  var pcap = "application/vnd.tcpdump.pcap";
  var cap = "application/vnd.tcpdump.pcap";
  var dmp = "application/vnd.tcpdump.pcap";
  var tmo = "application/vnd.tmobile-livetv";
  var tpt = "application/vnd.trid.tpt";
  var mxs = "application/vnd.triscape.mxs";
  var tra = "application/vnd.trueapp";
  var ufd = "application/vnd.ufdl";
  var ufdl = "application/vnd.ufdl";
  var utz = "application/vnd.uiq.theme";
  var umj = "application/vnd.umajin";
  var unityweb = "application/vnd.unity";
  var uoml = "application/vnd.uoml+xml";
  var vcx = "application/vnd.vcx";
  var vsd = "application/vnd.visio";
  var vst = "application/vnd.visio";
  var vss = "application/vnd.visio";
  var vsw = "application/vnd.visio";
  var vis = "application/vnd.visionary";
  var vsf = "application/vnd.vsf";
  var wbxml = "application/vnd.wap.wbxml";
  var wmlc = "application/vnd.wap.wmlc";
  var wmlsc = "application/vnd.wap.wmlscriptc";
  var wtb = "application/vnd.webturbo";
  var nbp = "application/vnd.wolfram.player";
  var wpd = "application/vnd.wordperfect";
  var wqd = "application/vnd.wqd";
  var stf = "application/vnd.wt.stf";
  var xar = "application/vnd.xara";
  var xfdl = "application/vnd.xfdl";
  var hvd = "application/vnd.yamaha.hv-dic";
  var hvs = "application/vnd.yamaha.hv-script";
  var hvp = "application/vnd.yamaha.hv-voice";
  var osf = "application/vnd.yamaha.openscoreformat";
  var osfpvg = "application/vnd.yamaha.openscoreformat.osfpvg+xml";
  var saf = "application/vnd.yamaha.smaf-audio";
  var spf = "application/vnd.yamaha.smaf-phrase";
  var cmp = "application/vnd.yellowriver-custom-menu";
  var zir = "application/vnd.zul";
  var zirz = "application/vnd.zul";
  var zaz = "application/vnd.zzazz.deck+xml";
  var vxml = "application/voicexml+xml";
  var wasm = "application/wasm";
  var wgt = "application/widget";
  var hlp = "application/winhlp";
  var wsdl = "application/wsdl+xml";
  var wspolicy = "application/wspolicy+xml";
  var _z = "application/x-7z-compressed";
  var abw = "application/x-abiword";
  var ace = "application/x-ace-compressed";
  var arj = "application/x-arj";
  var aab = "application/x-authorware-bin";
  var x32 = "application/x-authorware-bin";
  var u32 = "application/x-authorware-bin";
  var vox = "application/x-authorware-bin";
  var aam = "application/x-authorware-map";
  var aas = "application/x-authorware-seg";
  var bcpio = "application/x-bcpio";
  var torrent = "application/x-bittorrent";
  var blb = "application/x-blorb";
  var blorb = "application/x-blorb";
  var bz = "application/x-bzip";
  var bz2 = "application/x-bzip2";
  var boz = "application/x-bzip2";
  var cbr = "application/x-cbr";
  var cba = "application/x-cbr";
  var cbt = "application/x-cbr";
  var cbz = "application/x-cbr";
  var cb7 = "application/x-cbr";
  var vcd = "application/x-cdlink";
  var cfs = "application/x-cfs-compressed";
  var chat = "application/x-chat";
  var pgn = "application/x-chess-pgn";
  var crx = "application/x-chrome-extension";
  var cco = "application/x-cocoa";
  var nsc = "application/x-conference";
  var cpio = "application/x-cpio";
  var csh = "application/x-csh";
  var udeb = "application/x-debian-package";
  var dgc = "application/x-dgc-compressed";
  var dir = "application/x-director";
  var dcr = "application/x-director";
  var dxr = "application/x-director";
  var cst = "application/x-director";
  var cct = "application/x-director";
  var cxt = "application/x-director";
  var w3d = "application/x-director";
  var fgd = "application/x-director";
  var swa = "application/x-director";
  var wad = "application/x-doom";
  var ncx = "application/x-dtbncx+xml";
  var dtb = "application/x-dtbook+xml";
  var res = "application/x-dtbresource+xml";
  var dvi = "application/x-dvi";
  var evy = "application/x-envoy";
  var eva = "application/x-eva";
  var bdf = "application/x-font-bdf";
  var gsf = "application/x-font-ghostscript";
  var psf = "application/x-font-linux-psf";
  var pcf = "application/x-font-pcf";
  var snf = "application/x-font-snf";
  var pfa = "application/x-font-type1";
  var pfb = "application/x-font-type1";
  var pfm = "application/x-font-type1";
  var afm = "application/x-font-type1";
  var arc = "application/x-freearc";
  var spl = "application/x-futuresplash";
  var gca = "application/x-gca-compressed";
  var ulx = "application/x-glulx";
  var gnumeric = "application/x-gnumeric";
  var gramps = "application/x-gramps-xml";
  var gtar = "application/x-gtar";
  var hdf = "application/x-hdf";
  var php = "application/x-httpd-php";
  var install = "application/x-install-instructions";
  var jardiff = "application/x-java-archive-diff";
  var jnlp = "application/x-java-jnlp-file";
  var kdbx = "application/x-keepass2";
  var latex = "application/x-latex";
  var luac = "application/x-lua-bytecode";
  var lzh = "application/x-lzh-compressed";
  var lha = "application/x-lzh-compressed";
  var run = "application/x-makeself";
  var mie = "application/x-mie";
  var prc = "application/x-mobipocket-ebook";
  var mobi = "application/x-mobipocket-ebook";
  var application = "application/x-ms-application";
  var lnk = "application/x-ms-shortcut";
  var wmd = "application/x-ms-wmd";
  var wmz = "application/x-ms-wmz";
  var xbap = "application/x-ms-xbap";
  var mdb = "application/x-msaccess";
  var obd = "application/x-msbinder";
  var crd = "application/x-mscardfile";
  var clp = "application/x-msclip";
  var com = "application/x-msdownload";
  var bat = "application/x-msdownload";
  var mvb = "application/x-msmediaview";
  var m13 = "application/x-msmediaview";
  var m14 = "application/x-msmediaview";
  var wmf = "image/wmf";
  var emf = "image/emf";
  var emz = "application/x-msmetafile";
  var mny = "application/x-msmoney";
  var pub = "application/x-mspublisher";
  var scd = "application/x-msschedule";
  var trm = "application/x-msterminal";
  var wri = "application/x-mswrite";
  var nc = "application/x-netcdf";
  var cdf = "application/x-netcdf";
  var pac = "application/x-ns-proxy-autoconfig";
  var nzb = "application/x-nzb";
  var pl = "application/x-perl";
  var pm = "application/x-perl";
  var p12 = "application/x-pkcs12";
  var pfx = "application/x-pkcs12";
  var p7b = "application/x-pkcs7-certificates";
  var spc = "application/x-pkcs7-certificates";
  var p7r = "application/x-pkcs7-certreqresp";
  var rar = "application/x-rar-compressed";
  var rpm = "application/x-redhat-package-manager";
  var ris = "application/x-research-info-systems";
  var sea = "application/x-sea";
  var sh = "application/x-sh";
  var shar = "application/x-shar";
  var swf = "application/x-shockwave-flash";
  var xap = "application/x-silverlight-app";
  var sql = "application/x-sql";
  var sit = "application/x-stuffit";
  var sitx = "application/x-stuffitx";
  var srt = "application/x-subrip";
  var sv4cpio = "application/x-sv4cpio";
  var sv4crc = "application/x-sv4crc";
  var t3 = "application/x-t3vm-image";
  var gam = "application/x-tads";
  var tar = "application/x-tar";
  var tcl = "application/x-tcl";
  var tk = "application/x-tcl";
  var tex = "application/x-tex";
  var tfm = "application/x-tex-tfm";
  var texinfo = "application/x-texinfo";
  var texi = "application/x-texinfo";
  var obj = "model/obj";
  var ustar = "application/x-ustar";
  var hdd = "application/x-virtualbox-hdd";
  var ova = "application/x-virtualbox-ova";
  var ovf = "application/x-virtualbox-ovf";
  var vbox = "application/x-virtualbox-vbox";
  var vbox_extpack = "application/x-virtualbox-vbox-extpack";
  var vdi = "application/x-virtualbox-vdi";
  var vhd = "application/x-virtualbox-vhd";
  var vmdk = "application/x-virtualbox-vmdk";
  var src = "application/x-wais-source";
  var webapp = "application/x-web-app-manifest+json";
  var der = "application/x-x509-ca-cert";
  var crt = "application/x-x509-ca-cert";
  var pem = "application/x-x509-ca-cert";
  var fig = "application/x-xfig";
  var xlf = "application/xliff+xml";
  var xpi = "application/x-xpinstall";
  var xz = "application/x-xz";
  var z1 = "application/x-zmachine";
  var z2 = "application/x-zmachine";
  var z3 = "application/x-zmachine";
  var z4 = "application/x-zmachine";
  var z5 = "application/x-zmachine";
  var z6 = "application/x-zmachine";
  var z7 = "application/x-zmachine";
  var z8 = "application/x-zmachine";
  var xaml = "application/xaml+xml";
  var xav = "application/xcap-att+xml";
  var xca = "application/xcap-caps+xml";
  var xel = "application/xcap-el+xml";
  var xns = "application/xcap-ns+xml";
  var xenc = "application/xenc+xml";
  var xhtml = "application/xhtml+xml";
  var xht = "application/xhtml+xml";
  var xml = "application/xml";
  var xsl = "application/xml";
  var xsd = "application/xml";
  var rng = "application/xml";
  var dtd = "application/xml-dtd";
  var xop = "application/xop+xml";
  var xpl = "application/xproc+xml";
  var xslt = "application/xslt+xml";
  var xspf = "application/xspf+xml";
  var mxml = "application/xv+xml";
  var xhvml = "application/xv+xml";
  var xvml = "application/xv+xml";
  var xvm = "application/xv+xml";
  var yang = "application/yang";
  var yin = "application/yin+xml";
  var zip = "application/zip";
  var _gpp = "video/3gpp";
  var adp = "audio/adpcm";
  var au = "audio/basic";
  var snd = "audio/basic";
  var mid = "audio/midi";
  var midi = "audio/midi";
  var kar = "audio/midi";
  var rmi = "audio/midi";
  var mxmf = "audio/mobile-xmf";
  var mp3 = "audio/mpeg";
  var m4a = "audio/mp4";
  var mp4a = "audio/mp4";
  var mpga = "audio/mpeg";
  var mp2 = "audio/mpeg";
  var mp2a = "audio/mpeg";
  var m2a = "audio/mpeg";
  var m3a = "audio/mpeg";
  var oga = "audio/ogg";
  var ogg = "audio/ogg";
  var spx = "audio/ogg";
  var s3m = "audio/s3m";
  var sil = "audio/silk";
  var uva = "audio/vnd.dece.audio";
  var uvva = "audio/vnd.dece.audio";
  var eol = "audio/vnd.digital-winds";
  var dra = "audio/vnd.dra";
  var dts = "audio/vnd.dts";
  var dtshd = "audio/vnd.dts.hd";
  var lvp = "audio/vnd.lucent.voice";
  var pya = "audio/vnd.ms-playready.media.pya";
  var ecelp4800 = "audio/vnd.nuera.ecelp4800";
  var ecelp7470 = "audio/vnd.nuera.ecelp7470";
  var ecelp9600 = "audio/vnd.nuera.ecelp9600";
  var rip = "audio/vnd.rip";
  var wav = "audio/wave";
  var weba = "audio/webm";
  var aac = "audio/x-aac";
  var aif = "audio/x-aiff";
  var aiff = "audio/x-aiff";
  var aifc = "audio/x-aiff";
  var caf = "audio/x-caf";
  var flac = "audio/x-flac";
  var mka = "audio/x-matroska";
  var m3u = "audio/x-mpegurl";
  var wax = "audio/x-ms-wax";
  var wma = "audio/x-ms-wma";
  var ram = "audio/x-pn-realaudio";
  var ra = "audio/x-pn-realaudio";
  var rmp = "audio/x-pn-realaudio-plugin";
  var xm = "audio/xm";
  var cdx = "chemical/x-cdx";
  var cif = "chemical/x-cif";
  var cmdf = "chemical/x-cmdf";
  var cml = "chemical/x-cml";
  var csml = "chemical/x-csml";
  var xyz = "chemical/x-xyz";
  var ttc = "font/collection";
  var otf = "font/otf";
  var ttf = "font/ttf";
  var woff = "font/woff";
  var woff2 = "font/woff2";
  var exr = "image/aces";
  var apng = "image/apng";
  var bmp = "image/bmp";
  var cgm = "image/cgm";
  var drle = "image/dicom-rle";
  var fits = "image/fits";
  var g3 = "image/g3fax";
  var gif = "image/gif";
  var heic = "image/heic";
  var heics = "image/heic-sequence";
  var heif = "image/heif";
  var heifs = "image/heif-sequence";
  var hej2 = "image/hej2k";
  var hsj2 = "image/hsj2";
  var ief = "image/ief";
  var jls = "image/jls";
  var jp2 = "image/jp2";
  var jpg2 = "image/jp2";
  var jpeg = "image/jpeg";
  var jpg = "image/jpeg";
  var jpe = "image/jpeg";
  var jph = "image/jph";
  var jhc = "image/jphc";
  var jpm = "image/jpm";
  var jpx = "image/jpx";
  var jpf = "image/jpx";
  var jxr = "image/jxr";
  var jxra = "image/jxra";
  var jxrs = "image/jxrs";
  var jxs = "image/jxs";
  var jxsc = "image/jxsc";
  var jxsi = "image/jxsi";
  var jxss = "image/jxss";
  var ktx = "image/ktx";
  var png = "image/png";
  var btif = "image/prs.btif";
  var pti = "image/prs.pti";
  var sgi = "image/sgi";
  var svg = "image/svg+xml";
  var svgz = "image/svg+xml";
  var t38 = "image/t38";
  var tif = "image/tiff";
  var tiff = "image/tiff";
  var tfx = "image/tiff-fx";
  var psd = "image/vnd.adobe.photoshop";
  var azv = "image/vnd.airzip.accelerator.azv";
  var uvi = "image/vnd.dece.graphic";
  var uvvi = "image/vnd.dece.graphic";
  var uvg = "image/vnd.dece.graphic";
  var uvvg = "image/vnd.dece.graphic";
  var djvu = "image/vnd.djvu";
  var djv = "image/vnd.djvu";
  var sub = "text/vnd.dvb.subtitle";
  var dwg = "image/vnd.dwg";
  var dxf = "image/vnd.dxf";
  var fbs = "image/vnd.fastbidsheet";
  var fpx = "image/vnd.fpx";
  var fst = "image/vnd.fst";
  var mmr = "image/vnd.fujixerox.edmics-mmr";
  var rlc = "image/vnd.fujixerox.edmics-rlc";
  var ico = "image/vnd.microsoft.icon";
  var dds = "image/vnd.ms-dds";
  var mdi = "image/vnd.ms-modi";
  var wdp = "image/vnd.ms-photo";
  var npx = "image/vnd.net-fpx";
  var tap = "image/vnd.tencent.tap";
  var vtf = "image/vnd.valve.source.texture";
  var wbmp = "image/vnd.wap.wbmp";
  var xif = "image/vnd.xiff";
  var pcx = "image/vnd.zbrush.pcx";
  var webp = "image/webp";
  var _ds = "image/x-3ds";
  var ras = "image/x-cmu-raster";
  var cmx = "image/x-cmx";
  var fh = "image/x-freehand";
  var fhc = "image/x-freehand";
  var fh4 = "image/x-freehand";
  var fh5 = "image/x-freehand";
  var fh7 = "image/x-freehand";
  var jng = "image/x-jng";
  var sid = "image/x-mrsid-image";
  var pic = "image/x-pict";
  var pct = "image/x-pict";
  var pnm = "image/x-portable-anymap";
  var pbm = "image/x-portable-bitmap";
  var pgm = "image/x-portable-graymap";
  var ppm = "image/x-portable-pixmap";
  var rgb = "image/x-rgb";
  var tga = "image/x-tga";
  var xbm = "image/x-xbitmap";
  var xpm = "image/x-xpixmap";
  var xwd = "image/x-xwindowdump";
  var disposition_notification = "message/disposition-notification";
  var u8msg = "message/global";
  var u8dsn = "message/global-delivery-status";
  var u8mdn = "message/global-disposition-notification";
  var u8hdr = "message/global-headers";
  var eml = "message/rfc822";
  var mime = "message/rfc822";
  var wsc = "message/vnd.wfa.wsc";
  var _mf = "model/3mf";
  var gltf = "model/gltf+json";
  var glb = "model/gltf-binary";
  var igs = "model/iges";
  var iges = "model/iges";
  var msh = "model/mesh";
  var mesh = "model/mesh";
  var silo = "model/mesh";
  var mtl = "model/mtl";
  var dae = "model/vnd.collada+xml";
  var dwf = "model/vnd.dwf";
  var gdl = "model/vnd.gdl";
  var gtw = "model/vnd.gtw";
  var mts = "model/vnd.mts";
  var ogex = "model/vnd.opengex";
  var x_b = "model/vnd.parasolid.transmit.binary";
  var x_t = "model/vnd.parasolid.transmit.text";
  var usdz = "model/vnd.usdz+zip";
  var bsp = "model/vnd.valve.source.compiled-map";
  var vtu = "model/vnd.vtu";
  var wrl = "model/vrml";
  var vrml = "model/vrml";
  var x3db = "model/x3d+fastinfoset";
  var x3dbz = "model/x3d+binary";
  var x3dv = "model/x3d-vrml";
  var x3dvz = "model/x3d+vrml";
  var x3d = "model/x3d+xml";
  var x3dz = "model/x3d+xml";
  var appcache = "text/cache-manifest";
  var manifest = "text/cache-manifest";
  var ics = "text/calendar";
  var ifb = "text/calendar";
  var coffee = "text/coffeescript";
  var litcoffee = "text/coffeescript";
  var css = "text/css";
  var csv = "text/csv";
  var html = "text/html";
  var htm = "text/html";
  var shtml = "text/html";
  var jade = "text/jade";
  var jsx = "text/jsx";
  var less = "text/less";
  var markdown = "text/markdown";
  var md = "text/markdown";
  var mml = "text/mathml";
  var mdx = "text/mdx";
  var n3 = "text/n3";
  var txt = "text/plain";
  var text = "text/plain";
  var conf = "text/plain";
  var def = "text/plain";
  var list = "text/plain";
  var log = "text/plain";
  var in2 = "text/plain";
  var ini = "text/plain";
  var dsc = "text/prs.lines.tag";
  var rtx = "text/richtext";
  var sgml = "text/sgml";
  var sgm = "text/sgml";
  var shex = "text/shex";
  var slim = "text/slim";
  var slm = "text/slim";
  var stylus = "text/stylus";
  var styl = "text/stylus";
  var tsv = "text/tab-separated-values";
  var t = "text/troff";
  var tr = "text/troff";
  var roff = "text/troff";
  var man = "text/troff";
  var me = "text/troff";
  var ms = "text/troff";
  var ttl = "text/turtle";
  var uri = "text/uri-list";
  var uris = "text/uri-list";
  var urls = "text/uri-list";
  var vcard = "text/vcard";
  var curl = "text/vnd.curl";
  var dcurl = "text/vnd.curl.dcurl";
  var mcurl = "text/vnd.curl.mcurl";
  var scurl = "text/vnd.curl.scurl";
  var fly = "text/vnd.fly";
  var flx = "text/vnd.fmi.flexstor";
  var gv = "text/vnd.graphviz";
  var _dml = "text/vnd.in3d.3dml";
  var spot = "text/vnd.in3d.spot";
  var jad = "text/vnd.sun.j2me.app-descriptor";
  var wml = "text/vnd.wap.wml";
  var wmls = "text/vnd.wap.wmlscript";
  var vtt = "text/vtt";
  var s = "text/x-asm";
  var asm = "text/x-asm";
  var c = "text/x-c";
  var cc = "text/x-c";
  var cxx = "text/x-c";
  var cpp = "text/x-c";
  var h = "text/x-c";
  var hh = "text/x-c";
  var dic = "text/x-c";
  var htc = "text/x-component";
  var f = "text/x-fortran";
  var for2 = "text/x-fortran";
  var f77 = "text/x-fortran";
  var f90 = "text/x-fortran";
  var hbs = "text/x-handlebars-template";
  var java = "text/x-java-source";
  var lua = "text/x-lua";
  var mkd = "text/x-markdown";
  var nfo = "text/x-nfo";
  var opml = "text/x-opml";
  var p = "text/x-pascal";
  var pas = "text/x-pascal";
  var pde = "text/x-processing";
  var sass = "text/x-sass";
  var scss = "text/x-scss";
  var etx = "text/x-setext";
  var sfv = "text/x-sfv";
  var ymp = "text/x-suse-ymp";
  var uu = "text/x-uuencode";
  var vcs = "text/x-vcalendar";
  var vcf = "text/x-vcard";
  var yaml = "text/yaml";
  var yml = "text/yaml";
  var _gp = "video/3gpp";
  var _g2 = "video/3gpp2";
  var h261 = "video/h261";
  var h263 = "video/h263";
  var h264 = "video/h264";
  var jpgv = "video/jpeg";
  var jpgm = "video/jpm";
  var mj2 = "video/mj2";
  var mjp2 = "video/mj2";
  var ts = "video/mp2t";
  var mp4 = "video/mp4";
  var mp4v = "video/mp4";
  var mpg4 = "video/mp4";
  var mpeg = "video/mpeg";
  var mpg = "video/mpeg";
  var mpe = "video/mpeg";
  var m1v = "video/mpeg";
  var m2v = "video/mpeg";
  var ogv = "video/ogg";
  var qt = "video/quicktime";
  var mov = "video/quicktime";
  var uvh = "video/vnd.dece.hd";
  var uvvh = "video/vnd.dece.hd";
  var uvm = "video/vnd.dece.mobile";
  var uvvm = "video/vnd.dece.mobile";
  var uvp = "video/vnd.dece.pd";
  var uvvp = "video/vnd.dece.pd";
  var uvs = "video/vnd.dece.sd";
  var uvvs = "video/vnd.dece.sd";
  var uvv = "video/vnd.dece.video";
  var uvvv = "video/vnd.dece.video";
  var dvb = "video/vnd.dvb.file";
  var fvt = "video/vnd.fvt";
  var mxu = "video/vnd.mpegurl";
  var m4u = "video/vnd.mpegurl";
  var pyv = "video/vnd.ms-playready.media.pyv";
  var uvu = "video/vnd.uvvu.mp4";
  var uvvu = "video/vnd.uvvu.mp4";
  var viv = "video/vnd.vivo";
  var webm = "video/webm";
  var f4v = "video/x-f4v";
  var fli = "video/x-fli";
  var flv = "video/x-flv";
  var m4v = "video/x-m4v";
  var mkv = "video/x-matroska";
  var mk3d = "video/x-matroska";
  var mks = "video/x-matroska";
  var mng = "video/x-mng";
  var asf = "video/x-ms-asf";
  var asx = "video/x-ms-asf";
  var vob = "video/x-ms-vob";
  var wm = "video/x-ms-wm";
  var wmv = "video/x-ms-wmv";
  var wmx = "video/x-ms-wmx";
  var wvx = "video/x-ms-wvx";
  var avi = "video/x-msvideo";
  var movie = "video/x-sgi-movie";
  var smv = "video/x-smv";
  var ice = "x-conference/x-cooltalk";
  var mime_types_default = {
    "123": _23,
    ez,
    aw,
    atom,
    atomcat,
    atomdeleted,
    atomsvc,
    dwd,
    held,
    rsat,
    bdoc,
    xcs,
    ccxml,
    cdfx,
    cdmia,
    cdmic,
    cdmid,
    cdmio,
    cdmiq,
    cu,
    mpd,
    davmount,
    dbk,
    dssc,
    xdssc,
    ecma,
    es,
    emma,
    emotionml,
    epub,
    exi,
    fdt,
    pfr,
    geojson,
    gml,
    gpx,
    gxf,
    gz,
    hjson,
    stk,
    ink,
    inkml,
    ipfix,
    its,
    jar,
    war,
    ear,
    ser,
    class: class2,
    js,
    mjs,
    json,
    map,
    json5,
    jsonml,
    jsonld,
    lgr,
    lostxml,
    hqx,
    cpt,
    mads,
    webmanifest,
    mrc,
    mrcx,
    ma,
    nb,
    mb,
    mathml,
    mbox,
    mscml,
    metalink,
    meta4,
    mets,
    maei,
    musd,
    mods,
    m21,
    mp21,
    mp4s,
    m4p,
    xdf,
    doc,
    dot,
    mxf,
    nq,
    nt,
    cjs,
    bin,
    dms,
    lrf,
    mar,
    so,
    dist,
    distz,
    pkg,
    bpk,
    dump,
    elc,
    deploy,
    exe,
    dll,
    deb,
    dmg,
    iso,
    img,
    msi,
    msp,
    msm,
    buffer,
    oda,
    opf,
    ogx,
    omdoc,
    onetoc,
    onetoc2,
    onetmp,
    onepkg,
    oxps,
    relo,
    xer,
    pdf,
    pgp,
    asc,
    sig,
    prf,
    p10,
    p7m,
    p7c,
    p7s,
    p8,
    ac,
    cer,
    crl,
    pkipath,
    pki,
    pls,
    ai,
    eps,
    ps,
    provx,
    cww,
    pskcxml,
    raml,
    rdf,
    owl,
    rif,
    rnc,
    rl,
    rld,
    rs,
    rapd,
    sls,
    rusd,
    gbr,
    mft,
    roa,
    rsd,
    rss,
    rtf,
    sbml,
    scq,
    scs,
    spq,
    spp,
    sdp,
    senmlx,
    sensmlx,
    setpay,
    setreg,
    shf,
    siv,
    sieve,
    smi,
    smil,
    rq,
    srx,
    gram,
    grxml,
    sru,
    ssdl,
    ssml,
    swidtag,
    tei,
    teicorpus,
    tfi,
    tsd,
    toml,
    ttml,
    rsheet,
    "1km": _km,
    plb,
    psb,
    pvb,
    tcap,
    pwn,
    aso,
    imp,
    acu,
    atc,
    acutc,
    air,
    fcdt,
    fxp,
    fxpl,
    xdp,
    xfdf,
    ahead,
    azf,
    azs,
    azw,
    acc,
    ami,
    apk,
    cii,
    fti,
    atx,
    mpkg,
    keynote,
    m3u8,
    numbers,
    pages,
    pkpass,
    swi,
    iota,
    aep,
    bmml,
    mpm,
    bmi,
    rep,
    cdxml,
    mmd,
    cdy,
    csl,
    cla,
    rp9,
    c4g,
    c4d,
    c4f,
    c4p,
    c4u,
    c11amc,
    c11amz,
    csp,
    cdbcmsg,
    cmc,
    clkx,
    clkk,
    clkp,
    clkt,
    clkw,
    wbs,
    pml,
    ppd,
    car,
    pcurl,
    dart,
    rdz,
    uvf,
    uvvf,
    uvd,
    uvvd,
    uvt,
    uvvt,
    uvx,
    uvvx,
    uvz,
    uvvz,
    fe_launch,
    dna,
    mlp,
    dpg,
    dfac,
    kpxx,
    ait,
    svc,
    geo,
    mag,
    nml,
    esf,
    msf,
    qam,
    slt,
    ssf,
    es3,
    et3,
    ez2,
    ez3,
    fdf,
    mseed,
    seed,
    dataless,
    gph,
    ftc,
    fm,
    frame,
    maker,
    book,
    fnc,
    ltf,
    fsc,
    oas,
    oa2,
    oa3,
    fg5,
    bh2,
    ddd,
    xdw,
    xbd,
    fzs,
    txd,
    ggb,
    ggt,
    gex,
    gre,
    gxt,
    g2w,
    g3w,
    gmx,
    gdoc,
    gslides,
    gsheet,
    kml,
    kmz,
    gqf,
    gqs,
    gac,
    ghf,
    gim,
    grv,
    gtm,
    tpl,
    vcg,
    hal,
    zmm,
    hbci,
    les,
    hpgl,
    hpid,
    hps,
    jlt,
    pcl,
    pclxl,
    "sfd-hdstx": sfd_hdstx,
    mpy,
    afp,
    listafp,
    list3820,
    irm,
    sc,
    icc,
    icm,
    igl,
    ivp,
    ivu,
    igm,
    xpw,
    xpx,
    i2g,
    qbo,
    qfx,
    rcprofile,
    irp,
    xpr,
    fcs,
    jam,
    rms,
    jisp,
    joda,
    ktz,
    ktr,
    karbon,
    chrt,
    kfo,
    flw,
    kon,
    kpr,
    kpt,
    ksp,
    kwd,
    kwt,
    htke,
    kia,
    kne,
    knp,
    skp,
    skd,
    skt,
    skm,
    sse,
    lasxml,
    lbd,
    lbe,
    apr,
    pre,
    nsf,
    org,
    scm,
    lwp,
    portpkg,
    mcd,
    mc1,
    cdkey,
    mwf,
    mfm,
    flo,
    igx,
    mif,
    daf,
    dis,
    mbk,
    mqy,
    msl,
    plc,
    txf,
    mpn,
    mpc,
    xul,
    cil,
    cab,
    xls,
    xlm,
    xla,
    xlc,
    xlt,
    xlw,
    xlam,
    xlsb,
    xlsm,
    xltm,
    eot,
    chm,
    ims,
    lrm,
    thmx,
    msg,
    cat,
    stl,
    ppt,
    pps,
    pot,
    ppam,
    pptm,
    sldm,
    ppsm,
    potm,
    mpp,
    mpt,
    docm,
    dotm,
    wps,
    wks,
    wcm,
    wdb,
    wpl,
    xps,
    mseq,
    mus,
    msty,
    taglet,
    nlu,
    ntf,
    nitf,
    nnd,
    nns,
    nnw,
    ngdat,
    "n-gage": n_gage,
    rpst,
    rpss,
    edm,
    edx,
    ext,
    odc,
    otc,
    odb,
    odf,
    odft,
    odg,
    otg,
    odi,
    oti,
    odp,
    otp,
    ods,
    ots,
    odt,
    odm,
    ott,
    oth,
    xo,
    dd2,
    obgx,
    oxt,
    osm,
    pptx,
    sldx,
    ppsx,
    potx,
    xlsx,
    xltx,
    docx,
    dotx,
    mgp,
    dp,
    esa,
    pdb,
    pqa,
    oprc,
    paw,
    str,
    ei6,
    efif,
    wg,
    plf,
    pbd,
    box,
    mgz,
    qps,
    ptid,
    qxd,
    qxt,
    qwd,
    qwt,
    qxl,
    qxb,
    bed,
    mxl,
    musicxml,
    cryptonote,
    cod,
    rm,
    rmvb,
    link66,
    st,
    see,
    sema,
    semd,
    semf,
    ifm,
    itp,
    iif,
    ipk,
    twd,
    twds,
    mmf,
    teacher,
    fo,
    sdkm,
    sdkd,
    dxp,
    sfs,
    sdc,
    sda,
    sdd,
    smf,
    sdw,
    vor,
    sgl,
    smzip,
    sm,
    wadl,
    sxc,
    stc,
    sxd,
    std,
    sxi,
    sti,
    sxm,
    sxw,
    sxg,
    stw,
    sus,
    susp,
    svd,
    sis,
    sisx,
    xsm,
    bdm,
    xdm,
    ddf,
    tao,
    pcap,
    cap,
    dmp,
    tmo,
    tpt,
    mxs,
    tra,
    ufd,
    ufdl,
    utz,
    umj,
    unityweb,
    uoml,
    vcx,
    vsd,
    vst,
    vss,
    vsw,
    vis,
    vsf,
    wbxml,
    wmlc,
    wmlsc,
    wtb,
    nbp,
    wpd,
    wqd,
    stf,
    xar,
    xfdl,
    hvd,
    hvs,
    hvp,
    osf,
    osfpvg,
    saf,
    spf,
    cmp,
    zir,
    zirz,
    zaz,
    vxml,
    wasm,
    wgt,
    hlp,
    wsdl,
    wspolicy,
    "7z": _z,
    abw,
    ace,
    arj,
    aab,
    x32,
    u32,
    vox,
    aam,
    aas,
    bcpio,
    torrent,
    blb,
    blorb,
    bz,
    bz2,
    boz,
    cbr,
    cba,
    cbt,
    cbz,
    cb7,
    vcd,
    cfs,
    chat,
    pgn,
    crx,
    cco,
    nsc,
    cpio,
    csh,
    udeb,
    dgc,
    dir,
    dcr,
    dxr,
    cst,
    cct,
    cxt,
    w3d,
    fgd,
    swa,
    wad,
    ncx,
    dtb,
    res,
    dvi,
    evy,
    eva,
    bdf,
    gsf,
    psf,
    pcf,
    snf,
    pfa,
    pfb,
    pfm,
    afm,
    arc,
    spl,
    gca,
    ulx,
    gnumeric,
    gramps,
    gtar,
    hdf,
    php,
    install,
    jardiff,
    jnlp,
    kdbx,
    latex,
    luac,
    lzh,
    lha,
    run,
    mie,
    prc,
    mobi,
    application,
    lnk,
    wmd,
    wmz,
    xbap,
    mdb,
    obd,
    crd,
    clp,
    com,
    bat,
    mvb,
    m13,
    m14,
    wmf,
    emf,
    emz,
    mny,
    pub,
    scd,
    trm,
    wri,
    nc,
    cdf,
    pac,
    nzb,
    pl,
    pm,
    p12,
    pfx,
    p7b,
    spc,
    p7r,
    rar,
    rpm,
    ris,
    sea,
    sh,
    shar,
    swf,
    xap,
    sql,
    sit,
    sitx,
    srt,
    sv4cpio,
    sv4crc,
    t3,
    gam,
    tar,
    tcl,
    tk,
    tex,
    tfm,
    texinfo,
    texi,
    obj,
    ustar,
    hdd,
    ova,
    ovf,
    vbox,
    "vbox-extpack": vbox_extpack,
    vdi,
    vhd,
    vmdk,
    src,
    webapp,
    der,
    crt,
    pem,
    fig,
    xlf,
    xpi,
    xz,
    z1,
    z2,
    z3,
    z4,
    z5,
    z6,
    z7,
    z8,
    xaml,
    xav,
    xca,
    xel,
    xns,
    xenc,
    xhtml,
    xht,
    xml,
    xsl,
    xsd,
    rng,
    dtd,
    xop,
    xpl,
    xslt,
    xspf,
    mxml,
    xhvml,
    xvml,
    xvm,
    yang,
    yin,
    zip,
    "3gpp": _gpp,
    adp,
    au,
    snd,
    mid,
    midi,
    kar,
    rmi,
    mxmf,
    mp3,
    m4a,
    mp4a,
    mpga,
    mp2,
    mp2a,
    m2a,
    m3a,
    oga,
    ogg,
    spx,
    s3m,
    sil,
    uva,
    uvva,
    eol,
    dra,
    dts,
    dtshd,
    lvp,
    pya,
    ecelp4800,
    ecelp7470,
    ecelp9600,
    rip,
    wav,
    weba,
    aac,
    aif,
    aiff,
    aifc,
    caf,
    flac,
    mka,
    m3u,
    wax,
    wma,
    ram,
    ra,
    rmp,
    xm,
    cdx,
    cif,
    cmdf,
    cml,
    csml,
    xyz,
    ttc,
    otf,
    ttf,
    woff,
    woff2,
    exr,
    apng,
    bmp,
    cgm,
    drle,
    fits,
    g3,
    gif,
    heic,
    heics,
    heif,
    heifs,
    hej2,
    hsj2,
    ief,
    jls,
    jp2,
    jpg2,
    jpeg,
    jpg,
    jpe,
    jph,
    jhc,
    jpm,
    jpx,
    jpf,
    jxr,
    jxra,
    jxrs,
    jxs,
    jxsc,
    jxsi,
    jxss,
    ktx,
    png,
    btif,
    pti,
    sgi,
    svg,
    svgz,
    t38,
    tif,
    tiff,
    tfx,
    psd,
    azv,
    uvi,
    uvvi,
    uvg,
    uvvg,
    djvu,
    djv,
    sub,
    dwg,
    dxf,
    fbs,
    fpx,
    fst,
    mmr,
    rlc,
    ico,
    dds,
    mdi,
    wdp,
    npx,
    tap,
    vtf,
    wbmp,
    xif,
    pcx,
    webp,
    "3ds": _ds,
    ras,
    cmx,
    fh,
    fhc,
    fh4,
    fh5,
    fh7,
    jng,
    sid,
    pic,
    pct,
    pnm,
    pbm,
    pgm,
    ppm,
    rgb,
    tga,
    xbm,
    xpm,
    xwd,
    "disposition-notification": disposition_notification,
    u8msg,
    u8dsn,
    u8mdn,
    u8hdr,
    eml,
    mime,
    wsc,
    "3mf": _mf,
    gltf,
    glb,
    igs,
    iges,
    msh,
    mesh,
    silo,
    mtl,
    dae,
    dwf,
    gdl,
    gtw,
    mts,
    ogex,
    x_b,
    x_t,
    usdz,
    bsp,
    vtu,
    wrl,
    vrml,
    x3db,
    x3dbz,
    x3dv,
    x3dvz,
    x3d,
    x3dz,
    appcache,
    manifest,
    ics,
    ifb,
    coffee,
    litcoffee,
    css,
    csv,
    html,
    htm,
    shtml,
    jade,
    jsx,
    less,
    markdown,
    md,
    mml,
    mdx,
    n3,
    txt,
    text,
    conf,
    def,
    list,
    log,
    in: in2,
    ini,
    dsc,
    rtx,
    sgml,
    sgm,
    shex,
    slim,
    slm,
    stylus,
    styl,
    tsv,
    t,
    tr,
    roff,
    man,
    me,
    ms,
    ttl,
    uri,
    uris,
    urls,
    vcard,
    curl,
    dcurl,
    mcurl,
    scurl,
    fly,
    flx,
    gv,
    "3dml": _dml,
    spot,
    jad,
    wml,
    wmls,
    vtt,
    s,
    asm,
    c,
    cc,
    cxx,
    cpp,
    h,
    hh,
    dic,
    htc,
    f,
    for: for2,
    f77,
    f90,
    hbs,
    java,
    lua,
    mkd,
    nfo,
    opml,
    p,
    pas,
    pde,
    sass,
    scss,
    etx,
    sfv,
    ymp,
    uu,
    vcs,
    vcf,
    yaml,
    yml,
    "3gp": _gp,
    "3g2": _g2,
    h261,
    h263,
    h264,
    jpgv,
    jpgm,
    mj2,
    mjp2,
    ts,
    mp4,
    mp4v,
    mpg4,
    mpeg,
    mpg,
    mpe,
    m1v,
    m2v,
    ogv,
    qt,
    mov,
    uvh,
    uvvh,
    uvm,
    uvvm,
    uvp,
    uvvp,
    uvs,
    uvvs,
    uvv,
    uvvv,
    dvb,
    fvt,
    mxu,
    m4u,
    pyv,
    uvu,
    uvvu,
    viv,
    webm,
    f4v,
    fli,
    flv,
    m4v,
    mkv,
    mk3d,
    mks,
    mng,
    asf,
    asx,
    vob,
    wm,
    wmv,
    wmx,
    wvx,
    avi,
    movie,
    smv,
    ice
  };

  // src/util/mime_types.ts
  function get_mime_type(path5) {
    const extension = extname2("x." + path5).toLowerCase().substr(1);
    if (!extension)
      return null;
    const mime_type = mime_types_default[extension];
    return mime_type ? mime_type : null;
  }

  // src/adapters/shared_memory.ts
  class NodeMap extends ImmutableMap {
    constructor() {
      super(...arguments);
      this.EVENT_WATCH = event();
      this.clone = (node) => {
        const {ctime, mime_type, mtime, path: path5, type} = node;
        let {payload} = node;
        if (payload)
          payload = payload.slice();
        return {ctime, mime_type, mtime, payload, path: path5, type};
      };
    }
    delete(key) {
      if (this.has(key)) {
        const node = this.get(key);
        super.delete(key);
        this.EVENT_WATCH.dispatch({
          change: NODE_CHANGES.removed,
          path: node.path,
          type: node.type
        });
        return true;
      }
      return false;
    }
    put(key, value) {
      const node = {...value, path: key};
      super.set(key, node);
      this.EVENT_WATCH.dispatch({
        change: NODE_CHANGES.created,
        path: node.path,
        type: node.type
      });
      return this;
    }
    update(key, value) {
      const node = {...this.get(key), ...value, path: key};
      super.set(key, node);
      if (value.payload) {
        this.EVENT_WATCH.dispatch({
          change: NODE_CHANGES.attached,
          path: node.path,
          type: node.type
        });
      } else {
        this.EVENT_WATCH.dispatch({
          change: NODE_CHANGES.updated,
          path: node.path,
          type: node.type
        });
      }
      return this;
    }
  }
  function MemoryOptions(options = {}) {
    const {compressed = false} = options;
    return {
      ...options,
      compressed
    };
  }
  class MemoryAdapter extends BaseAdapter {
    constructor(options = {}) {
      super(MemoryOptions(options));
      this.storage = new NodeMap();
    }
    async create_url_object(path5) {
      const {storage} = this;
      const {compressed} = this.options;
      const uri2 = this.normalize(path5);
      if (!storage.has(uri2)) {
        throw new Error("bad argument #0 to 'create_url_object' (Node must be created before using 'create_url_object')");
      }
      const node = storage.get(uri2);
      if (!node.payload) {
        throw new Error("bad argument #0 to 'create_url_object' (Node payload must be created before using 'create_url_object')");
      }
      const payload = compressed ? decompress(node.payload) : node.payload;
      const object = create_url_object(payload, node.mime_type);
      return {
        destroy: object.destroy,
        path: node.path,
        url: object.url
      };
    }
    async get(path5) {
      const {storage} = this;
      const uri2 = this.normalize(path5);
      if (!storage.has(uri2))
        return null;
      const node = storage.get(uri2);
      return {
        ctime: node.ctime,
        mime_type: node.mime_type,
        mtime: node.mtime,
        path: node.path,
        type: node.type
      };
    }
    async put(path5, type = NODE_TYPES.undefined, mime_type) {
      const {storage} = this;
      const uri2 = this.normalize(path5);
      const timestamp = get_epoch_timestamp();
      if (!mime_type)
        mime_type = get_mime_type(uri2) || DEFAULT_MIME_TYPE;
      if (storage.has(uri2)) {
        storage.update(uri2, {
          mime_type,
          mtime: timestamp,
          type
        });
      } else {
        storage.put(uri2, {
          ctime: timestamp,
          mime_type,
          mtime: timestamp,
          type
        });
      }
    }
    async query(options = {}) {
      const entries = Array.from(this.storage.entries());
      const nodes = entries.map((entry, index) => {
        const path5 = entry[0];
        const {type = NODE_TYPES.undefined} = entry[1];
        return {path: path5, type};
      });
      return filter_query(nodes, options);
    }
    async read(path5) {
      const {storage} = this;
      const {compressed} = this.options;
      const uri2 = this.normalize(path5);
      if (!storage.has(uri2))
        return null;
      const node = storage.get(uri2);
      if (!node.payload)
        return null;
      return compressed ? decompress(node.payload) : node.payload;
    }
    async remove(path5) {
      const {storage} = this;
      const uri2 = this.normalize(path5);
      return storage.delete(uri2);
    }
    async watch(options = {}) {
      return hook_watcher(this.storage.EVENT_WATCH, options);
    }
    async write(path5, payload) {
      const {storage} = this;
      const {compressed} = this.options;
      const uri2 = this.normalize(path5);
      if (!storage.has(uri2)) {
        throw new Error("bad argument #0 to 'attach' (Node must be created before using 'attach')");
      }
      storage.update(uri2, {
        mtime: get_epoch_timestamp(),
        payload: compressed ? compress(payload) : payload
      });
    }
    is_mounted() {
      return true;
    }
    async mount() {
    }
    async unmount() {
    }
  }
  MemoryAdapter.can_hotlink = true;
  MemoryAdapter.can_watch = true;
  MemoryAdapter.is_available = true;

  // node_modules/dexie/dist/dexie.mjs
  var __assign = function() {
    __assign = Object.assign || function __assign2(t2) {
      for (var s2, i = 1, n = arguments.length; i < n; i++) {
        s2 = arguments[i];
        for (var p2 in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p2))
            t2[p2] = s2[p2];
      }
      return t2;
    };
    return __assign.apply(this, arguments);
  };
  function __spreadArrays() {
    for (var s2 = 0, i = 0, il = arguments.length; i < il; i++)
      s2 += arguments[i].length;
    for (var r = Array(s2), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  }
  var keys = Object.keys;
  var isArray = Array.isArray;
  var _global = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
  if (typeof Promise !== "undefined" && !_global.Promise) {
    _global.Promise = Promise;
  }
  function extend(obj2, extension) {
    if (typeof extension !== "object")
      return obj2;
    keys(extension).forEach(function(key) {
      obj2[key] = extension[key];
    });
    return obj2;
  }
  var getProto = Object.getPrototypeOf;
  var _hasOwn = {}.hasOwnProperty;
  function hasOwn(obj2, prop) {
    return _hasOwn.call(obj2, prop);
  }
  function props(proto, extension) {
    if (typeof extension === "function")
      extension = extension(getProto(proto));
    keys(extension).forEach(function(key) {
      setProp(proto, key, extension[key]);
    });
  }
  var defineProperty = Object.defineProperty;
  function setProp(obj2, prop, functionOrGetSet, options) {
    defineProperty(obj2, prop, extend(functionOrGetSet && hasOwn(functionOrGetSet, "get") && typeof functionOrGetSet.get === "function" ? {get: functionOrGetSet.get, set: functionOrGetSet.set, configurable: true} : {value: functionOrGetSet, configurable: true, writable: true}, options));
  }
  function derive(Child) {
    return {
      from: function(Parent) {
        Child.prototype = Object.create(Parent.prototype);
        setProp(Child.prototype, "constructor", Child);
        return {
          extend: props.bind(null, Child.prototype)
        };
      }
    };
  }
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  function getPropertyDescriptor(obj2, prop) {
    var pd = getOwnPropertyDescriptor(obj2, prop);
    var proto;
    return pd || (proto = getProto(obj2)) && getPropertyDescriptor(proto, prop);
  }
  var _slice = [].slice;
  function slice(args, start, end) {
    return _slice.call(args, start, end);
  }
  function override(origFunc, overridedFactory) {
    return overridedFactory(origFunc);
  }
  function assert(b) {
    if (!b)
      throw new Error("Assertion Failed");
  }
  function asap(fn) {
    if (_global.setImmediate)
      setImmediate(fn);
    else
      setTimeout(fn, 0);
  }
  function arrayToObject(array, extractor) {
    return array.reduce(function(result, item, i) {
      var nameAndValue = extractor(item, i);
      if (nameAndValue)
        result[nameAndValue[0]] = nameAndValue[1];
      return result;
    }, {});
  }
  function tryCatch(fn, onerror, args) {
    try {
      fn.apply(null, args);
    } catch (ex) {
      onerror && onerror(ex);
    }
  }
  function getByKeyPath(obj2, keyPath) {
    if (hasOwn(obj2, keyPath))
      return obj2[keyPath];
    if (!keyPath)
      return obj2;
    if (typeof keyPath !== "string") {
      var rv = [];
      for (var i = 0, l = keyPath.length; i < l; ++i) {
        var val = getByKeyPath(obj2, keyPath[i]);
        rv.push(val);
      }
      return rv;
    }
    var period = keyPath.indexOf(".");
    if (period !== -1) {
      var innerObj = obj2[keyPath.substr(0, period)];
      return innerObj === void 0 ? void 0 : getByKeyPath(innerObj, keyPath.substr(period + 1));
    }
    return void 0;
  }
  function setByKeyPath(obj2, keyPath, value) {
    if (!obj2 || keyPath === void 0)
      return;
    if ("isFrozen" in Object && Object.isFrozen(obj2))
      return;
    if (typeof keyPath !== "string" && "length" in keyPath) {
      assert(typeof value !== "string" && "length" in value);
      for (var i = 0, l = keyPath.length; i < l; ++i) {
        setByKeyPath(obj2, keyPath[i], value[i]);
      }
    } else {
      var period = keyPath.indexOf(".");
      if (period !== -1) {
        var currentKeyPath = keyPath.substr(0, period);
        var remainingKeyPath = keyPath.substr(period + 1);
        if (remainingKeyPath === "")
          if (value === void 0) {
            if (isArray(obj2) && !isNaN(parseInt(currentKeyPath)))
              obj2.splice(currentKeyPath, 1);
            else
              delete obj2[currentKeyPath];
          } else
            obj2[currentKeyPath] = value;
        else {
          var innerObj = obj2[currentKeyPath];
          if (!innerObj)
            innerObj = obj2[currentKeyPath] = {};
          setByKeyPath(innerObj, remainingKeyPath, value);
        }
      } else {
        if (value === void 0) {
          if (isArray(obj2) && !isNaN(parseInt(keyPath)))
            obj2.splice(keyPath, 1);
          else
            delete obj2[keyPath];
        } else
          obj2[keyPath] = value;
      }
    }
  }
  function delByKeyPath(obj2, keyPath) {
    if (typeof keyPath === "string")
      setByKeyPath(obj2, keyPath, void 0);
    else if ("length" in keyPath)
      [].map.call(keyPath, function(kp) {
        setByKeyPath(obj2, kp, void 0);
      });
  }
  function shallowClone(obj2) {
    var rv = {};
    for (var m in obj2) {
      if (hasOwn(obj2, m))
        rv[m] = obj2[m];
    }
    return rv;
  }
  var concat = [].concat;
  function flatten(a) {
    return concat.apply([], a);
  }
  var intrinsicTypeNames = "Boolean,String,Date,RegExp,Blob,File,FileList,ArrayBuffer,DataView,Uint8ClampedArray,ImageData,Map,Set".split(",").concat(flatten([8, 16, 32, 64].map(function(num) {
    return ["Int", "Uint", "Float"].map(function(t2) {
      return t2 + num + "Array";
    });
  }))).filter(function(t2) {
    return _global[t2];
  });
  var intrinsicTypes = intrinsicTypeNames.map(function(t2) {
    return _global[t2];
  });
  var intrinsicTypeNameSet = arrayToObject(intrinsicTypeNames, function(x) {
    return [x, true];
  });
  function deepClone(any) {
    if (!any || typeof any !== "object")
      return any;
    var rv;
    if (isArray(any)) {
      rv = [];
      for (var i = 0, l = any.length; i < l; ++i) {
        rv.push(deepClone(any[i]));
      }
    } else if (intrinsicTypes.indexOf(any.constructor) >= 0) {
      rv = any;
    } else {
      rv = any.constructor ? Object.create(any.constructor.prototype) : {};
      for (var prop in any) {
        if (hasOwn(any, prop)) {
          rv[prop] = deepClone(any[prop]);
        }
      }
    }
    return rv;
  }
  var toString = {}.toString;
  function toStringTag(o) {
    return toString.call(o).slice(8, -1);
  }
  var getValueOf = function(val, type) {
    return type === "Array" ? "" + val.map(function(v) {
      return getValueOf(v, toStringTag(v));
    }) : type === "ArrayBuffer" ? "" + new Uint8Array(val) : type === "Date" ? val.getTime() : ArrayBuffer.isView(val) ? "" + new Uint8Array(val.buffer) : val;
  };
  function getObjectDiff(a, b, rv, prfx) {
    rv = rv || {};
    prfx = prfx || "";
    keys(a).forEach(function(prop) {
      if (!hasOwn(b, prop))
        rv[prfx + prop] = void 0;
      else {
        var ap = a[prop], bp = b[prop];
        if (typeof ap === "object" && typeof bp === "object" && ap && bp) {
          var apTypeName = toStringTag(ap);
          var bpTypeName = toStringTag(bp);
          if (apTypeName === bpTypeName) {
            if (intrinsicTypeNameSet[apTypeName]) {
              if (getValueOf(ap, apTypeName) !== getValueOf(bp, bpTypeName)) {
                rv[prfx + prop] = b[prop];
              }
            } else {
              getObjectDiff(ap, bp, rv, prfx + prop + ".");
            }
          } else {
            rv[prfx + prop] = b[prop];
          }
        } else if (ap !== bp)
          rv[prfx + prop] = b[prop];
      }
    });
    keys(b).forEach(function(prop) {
      if (!hasOwn(a, prop)) {
        rv[prfx + prop] = b[prop];
      }
    });
    return rv;
  }
  var iteratorSymbol = typeof Symbol !== "undefined" && Symbol.iterator;
  var getIteratorOf = iteratorSymbol ? function(x) {
    var i;
    return x != null && (i = x[iteratorSymbol]) && i.apply(x);
  } : function() {
    return null;
  };
  var NO_CHAR_ARRAY = {};
  function getArrayOf(arrayLike) {
    var i, a, x, it;
    if (arguments.length === 1) {
      if (isArray(arrayLike))
        return arrayLike.slice();
      if (this === NO_CHAR_ARRAY && typeof arrayLike === "string")
        return [arrayLike];
      if (it = getIteratorOf(arrayLike)) {
        a = [];
        while (x = it.next(), !x.done)
          a.push(x.value);
        return a;
      }
      if (arrayLike == null)
        return [arrayLike];
      i = arrayLike.length;
      if (typeof i === "number") {
        a = new Array(i);
        while (i--)
          a[i] = arrayLike[i];
        return a;
      }
      return [arrayLike];
    }
    i = arguments.length;
    a = new Array(i);
    while (i--)
      a[i] = arguments[i];
    return a;
  }
  var isAsyncFunction = typeof Symbol !== "undefined" ? function(fn) {
    return fn[Symbol.toStringTag] === "AsyncFunction";
  } : function() {
    return false;
  };
  var debug = typeof location !== "undefined" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
  function setDebug(value, filter) {
    debug = value;
    libraryFilter = filter;
  }
  var libraryFilter = function() {
    return true;
  };
  var NEEDS_THROW_FOR_STACK = !new Error("").stack;
  function getErrorWithStack() {
    if (NEEDS_THROW_FOR_STACK)
      try {
        throw new Error();
      } catch (e) {
        return e;
      }
    return new Error();
  }
  function prettyStack(exception, numIgnoredFrames) {
    var stack = exception.stack;
    if (!stack)
      return "";
    numIgnoredFrames = numIgnoredFrames || 0;
    if (stack.indexOf(exception.name) === 0)
      numIgnoredFrames += (exception.name + exception.message).split("\n").length;
    return stack.split("\n").slice(numIgnoredFrames).filter(libraryFilter).map(function(frame2) {
      return "\n" + frame2;
    }).join("");
  }
  var dexieErrorNames = [
    "Modify",
    "Bulk",
    "OpenFailed",
    "VersionChange",
    "Schema",
    "Upgrade",
    "InvalidTable",
    "MissingAPI",
    "NoSuchDatabase",
    "InvalidArgument",
    "SubTransaction",
    "Unsupported",
    "Internal",
    "DatabaseClosed",
    "PrematureCommit",
    "ForeignAwait"
  ];
  var idbDomErrorNames = [
    "Unknown",
    "Constraint",
    "Data",
    "TransactionInactive",
    "ReadOnly",
    "Version",
    "NotFound",
    "InvalidState",
    "InvalidAccess",
    "Abort",
    "Timeout",
    "QuotaExceeded",
    "Syntax",
    "DataClone"
  ];
  var errorList = dexieErrorNames.concat(idbDomErrorNames);
  var defaultTexts = {
    VersionChanged: "Database version changed by other database connection",
    DatabaseClosed: "Database has been closed",
    Abort: "Transaction aborted",
    TransactionInactive: "Transaction has already completed or failed"
  };
  function DexieError(name, msg2) {
    this._e = getErrorWithStack();
    this.name = name;
    this.message = msg2;
  }
  derive(DexieError).from(Error).extend({
    stack: {
      get: function() {
        return this._stack || (this._stack = this.name + ": " + this.message + prettyStack(this._e, 2));
      }
    },
    toString: function() {
      return this.name + ": " + this.message;
    }
  });
  function getMultiErrorMessage(msg2, failures) {
    return msg2 + ". Errors: " + Object.keys(failures).map(function(key) {
      return failures[key].toString();
    }).filter(function(v, i, s2) {
      return s2.indexOf(v) === i;
    }).join("\n");
  }
  function ModifyError(msg2, failures, successCount, failedKeys) {
    this._e = getErrorWithStack();
    this.failures = failures;
    this.failedKeys = failedKeys;
    this.successCount = successCount;
    this.message = getMultiErrorMessage(msg2, failures);
  }
  derive(ModifyError).from(DexieError);
  function BulkError(msg2, failures) {
    this._e = getErrorWithStack();
    this.name = "BulkError";
    this.failures = failures;
    this.message = getMultiErrorMessage(msg2, failures);
  }
  derive(BulkError).from(DexieError);
  var errnames = errorList.reduce(function(obj2, name) {
    return obj2[name] = name + "Error", obj2;
  }, {});
  var BaseException = DexieError;
  var exceptions = errorList.reduce(function(obj2, name) {
    var fullName = name + "Error";
    function DexieError2(msgOrInner, inner) {
      this._e = getErrorWithStack();
      this.name = fullName;
      if (!msgOrInner) {
        this.message = defaultTexts[name] || fullName;
        this.inner = null;
      } else if (typeof msgOrInner === "string") {
        this.message = "" + msgOrInner + (!inner ? "" : "\n " + inner);
        this.inner = inner || null;
      } else if (typeof msgOrInner === "object") {
        this.message = msgOrInner.name + " " + msgOrInner.message;
        this.inner = msgOrInner;
      }
    }
    derive(DexieError2).from(BaseException);
    obj2[name] = DexieError2;
    return obj2;
  }, {});
  exceptions.Syntax = SyntaxError;
  exceptions.Type = TypeError;
  exceptions.Range = RangeError;
  var exceptionMap = idbDomErrorNames.reduce(function(obj2, name) {
    obj2[name + "Error"] = exceptions[name];
    return obj2;
  }, {});
  function mapError(domError, message) {
    if (!domError || domError instanceof DexieError || domError instanceof TypeError || domError instanceof SyntaxError || !domError.name || !exceptionMap[domError.name])
      return domError;
    var rv = new exceptionMap[domError.name](message || domError.message, domError);
    if ("stack" in domError) {
      setProp(rv, "stack", {get: function() {
        return this.inner.stack;
      }});
    }
    return rv;
  }
  var fullNameExceptions = errorList.reduce(function(obj2, name) {
    if (["Syntax", "Type", "Range"].indexOf(name) === -1)
      obj2[name + "Error"] = exceptions[name];
    return obj2;
  }, {});
  fullNameExceptions.ModifyError = ModifyError;
  fullNameExceptions.DexieError = DexieError;
  fullNameExceptions.BulkError = BulkError;
  function nop() {
  }
  function mirror(val) {
    return val;
  }
  function pureFunctionChain(f1, f2) {
    if (f1 == null || f1 === mirror)
      return f2;
    return function(val) {
      return f2(f1(val));
    };
  }
  function callBoth(on1, on2) {
    return function() {
      on1.apply(this, arguments);
      on2.apply(this, arguments);
    };
  }
  function hookCreatingChain(f1, f2) {
    if (f1 === nop)
      return f2;
    return function() {
      var res2 = f1.apply(this, arguments);
      if (res2 !== void 0)
        arguments[0] = res2;
      var onsuccess = this.onsuccess, onerror = this.onerror;
      this.onsuccess = null;
      this.onerror = null;
      var res22 = f2.apply(this, arguments);
      if (onsuccess)
        this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
      if (onerror)
        this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
      return res22 !== void 0 ? res22 : res2;
    };
  }
  function hookDeletingChain(f1, f2) {
    if (f1 === nop)
      return f2;
    return function() {
      f1.apply(this, arguments);
      var onsuccess = this.onsuccess, onerror = this.onerror;
      this.onsuccess = this.onerror = null;
      f2.apply(this, arguments);
      if (onsuccess)
        this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
      if (onerror)
        this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    };
  }
  function hookUpdatingChain(f1, f2) {
    if (f1 === nop)
      return f2;
    return function(modifications) {
      var res2 = f1.apply(this, arguments);
      extend(modifications, res2);
      var onsuccess = this.onsuccess, onerror = this.onerror;
      this.onsuccess = null;
      this.onerror = null;
      var res22 = f2.apply(this, arguments);
      if (onsuccess)
        this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
      if (onerror)
        this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
      return res2 === void 0 ? res22 === void 0 ? void 0 : res22 : extend(res2, res22);
    };
  }
  function reverseStoppableEventChain(f1, f2) {
    if (f1 === nop)
      return f2;
    return function() {
      if (f2.apply(this, arguments) === false)
        return false;
      return f1.apply(this, arguments);
    };
  }
  function promisableChain(f1, f2) {
    if (f1 === nop)
      return f2;
    return function() {
      var res2 = f1.apply(this, arguments);
      if (res2 && typeof res2.then === "function") {
        var thiz = this, i = arguments.length, args = new Array(i);
        while (i--)
          args[i] = arguments[i];
        return res2.then(function() {
          return f2.apply(thiz, args);
        });
      }
      return f2.apply(this, arguments);
    };
  }
  var INTERNAL = {};
  var LONG_STACKS_CLIP_LIMIT = 100;
  var MAX_LONG_STACKS = 20;
  var ZONE_ECHO_LIMIT = 100;
  var _a = typeof Promise === "undefined" ? [] : function() {
    var globalP = Promise.resolve();
    if (typeof crypto === "undefined" || !crypto.subtle)
      return [globalP, globalP.__proto__, globalP];
    var nativeP = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
    return [
      nativeP,
      nativeP.__proto__,
      globalP
    ];
  }();
  var resolvedNativePromise = _a[0];
  var nativePromiseProto = _a[1];
  var resolvedGlobalPromise = _a[2];
  var nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
  var NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
  var patchGlobalPromise = !!resolvedGlobalPromise;
  var stack_being_generated = false;
  var schedulePhysicalTick = resolvedGlobalPromise ? function() {
    resolvedGlobalPromise.then(physicalTick);
  } : _global.setImmediate ? setImmediate.bind(null, physicalTick) : _global.MutationObserver ? function() {
    var hiddenDiv = document.createElement("div");
    new MutationObserver(function() {
      physicalTick();
      hiddenDiv = null;
    }).observe(hiddenDiv, {attributes: true});
    hiddenDiv.setAttribute("i", "1");
  } : function() {
    setTimeout(physicalTick, 0);
  };
  var asap$1 = function(callback, args) {
    microtickQueue.push([callback, args]);
    if (needsNewPhysicalTick) {
      schedulePhysicalTick();
      needsNewPhysicalTick = false;
    }
  };
  var isOutsideMicroTick = true;
  var needsNewPhysicalTick = true;
  var unhandledErrors = [];
  var rejectingErrors = [];
  var currentFulfiller = null;
  var rejectionMapper = mirror;
  var globalPSD = {
    id: "global",
    global: true,
    ref: 0,
    unhandleds: [],
    onunhandled: globalError,
    pgp: false,
    env: {},
    finalize: function() {
      this.unhandleds.forEach(function(uh) {
        try {
          globalError(uh[0], uh[1]);
        } catch (e) {
        }
      });
    }
  };
  var PSD = globalPSD;
  var microtickQueue = [];
  var numScheduledCalls = 0;
  var tickFinalizers = [];
  function DexiePromise(fn) {
    if (typeof this !== "object")
      throw new TypeError("Promises must be constructed via new");
    this._listeners = [];
    this.onuncatched = nop;
    this._lib = false;
    var psd2 = this._PSD = PSD;
    if (debug) {
      this._stackHolder = getErrorWithStack();
      this._prev = null;
      this._numPrev = 0;
    }
    if (typeof fn !== "function") {
      if (fn !== INTERNAL)
        throw new TypeError("Not a function");
      this._state = arguments[1];
      this._value = arguments[2];
      if (this._state === false)
        handleRejection(this, this._value);
      return;
    }
    this._state = null;
    this._value = null;
    ++psd2.ref;
    executePromiseTask(this, fn);
  }
  var thenProp = {
    get: function() {
      var psd2 = PSD, microTaskId = totalEchoes;
      function then(onFulfilled, onRejected) {
        var _this = this;
        var possibleAwait = !psd2.global && (psd2 !== PSD || microTaskId !== totalEchoes);
        if (possibleAwait)
          decrementExpectedAwaits();
        var rv = new DexiePromise(function(resolve3, reject) {
          propagateToListener(_this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd2, possibleAwait), nativeAwaitCompatibleWrap(onRejected, psd2, possibleAwait), resolve3, reject, psd2));
        });
        debug && linkToPreviousPromise(rv, this);
        return rv;
      }
      then.prototype = INTERNAL;
      return then;
    },
    set: function(value) {
      setProp(this, "then", value && value.prototype === INTERNAL ? thenProp : {
        get: function() {
          return value;
        },
        set: thenProp.set
      });
    }
  };
  props(DexiePromise.prototype, {
    then: thenProp,
    _then: function(onFulfilled, onRejected) {
      propagateToListener(this, new Listener(null, null, onFulfilled, onRejected, PSD));
    },
    catch: function(onRejected) {
      if (arguments.length === 1)
        return this.then(null, onRejected);
      var type = arguments[0], handler = arguments[1];
      return typeof type === "function" ? this.then(null, function(err) {
        return err instanceof type ? handler(err) : PromiseReject(err);
      }) : this.then(null, function(err) {
        return err && err.name === type ? handler(err) : PromiseReject(err);
      });
    },
    finally: function(onFinally) {
      return this.then(function(value) {
        onFinally();
        return value;
      }, function(err) {
        onFinally();
        return PromiseReject(err);
      });
    },
    stack: {
      get: function() {
        if (this._stack)
          return this._stack;
        try {
          stack_being_generated = true;
          var stacks = getStack(this, [], MAX_LONG_STACKS);
          var stack = stacks.join("\nFrom previous: ");
          if (this._state !== null)
            this._stack = stack;
          return stack;
        } finally {
          stack_being_generated = false;
        }
      }
    },
    timeout: function(ms2, msg2) {
      var _this = this;
      return ms2 < Infinity ? new DexiePromise(function(resolve3, reject) {
        var handle = setTimeout(function() {
          return reject(new exceptions.Timeout(msg2));
        }, ms2);
        _this.then(resolve3, reject).finally(clearTimeout.bind(null, handle));
      }) : this;
    }
  });
  if (typeof Symbol !== "undefined" && Symbol.toStringTag)
    setProp(DexiePromise.prototype, Symbol.toStringTag, "Dexie.Promise");
  globalPSD.env = snapShot();
  function Listener(onFulfilled, onRejected, resolve3, reject, zone) {
    this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
    this.onRejected = typeof onRejected === "function" ? onRejected : null;
    this.resolve = resolve3;
    this.reject = reject;
    this.psd = zone;
  }
  props(DexiePromise, {
    all: function() {
      var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
      return new DexiePromise(function(resolve3, reject) {
        if (values.length === 0)
          resolve3([]);
        var remaining = values.length;
        values.forEach(function(a, i) {
          return DexiePromise.resolve(a).then(function(x) {
            values[i] = x;
            if (!--remaining)
              resolve3(values);
          }, reject);
        });
      });
    },
    resolve: function(value) {
      if (value instanceof DexiePromise)
        return value;
      if (value && typeof value.then === "function")
        return new DexiePromise(function(resolve3, reject) {
          value.then(resolve3, reject);
        });
      var rv = new DexiePromise(INTERNAL, true, value);
      linkToPreviousPromise(rv, currentFulfiller);
      return rv;
    },
    reject: PromiseReject,
    race: function() {
      var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
      return new DexiePromise(function(resolve3, reject) {
        values.map(function(value) {
          return DexiePromise.resolve(value).then(resolve3, reject);
        });
      });
    },
    PSD: {
      get: function() {
        return PSD;
      },
      set: function(value) {
        return PSD = value;
      }
    },
    newPSD: newScope,
    usePSD,
    scheduler: {
      get: function() {
        return asap$1;
      },
      set: function(value) {
        asap$1 = value;
      }
    },
    rejectionMapper: {
      get: function() {
        return rejectionMapper;
      },
      set: function(value) {
        rejectionMapper = value;
      }
    },
    follow: function(fn, zoneProps) {
      return new DexiePromise(function(resolve3, reject) {
        return newScope(function(resolve4, reject2) {
          var psd2 = PSD;
          psd2.unhandleds = [];
          psd2.onunhandled = reject2;
          psd2.finalize = callBoth(function() {
            var _this = this;
            run_at_end_of_this_or_next_physical_tick(function() {
              _this.unhandleds.length === 0 ? resolve4() : reject2(_this.unhandleds[0]);
            });
          }, psd2.finalize);
          fn();
        }, zoneProps, resolve3, reject);
      });
    }
  });
  if (NativePromise) {
    if (NativePromise.allSettled)
      setProp(DexiePromise, "allSettled", function() {
        var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
        return new DexiePromise(function(resolve3) {
          if (possiblePromises.length === 0)
            resolve3([]);
          var remaining = possiblePromises.length;
          var results = new Array(remaining);
          possiblePromises.forEach(function(p2, i) {
            return DexiePromise.resolve(p2).then(function(value) {
              return results[i] = {status: "fulfilled", value};
            }, function(reason) {
              return results[i] = {status: "rejected", reason};
            }).then(function() {
              return --remaining || resolve3(results);
            });
          });
        });
      });
    if (NativePromise.any && typeof AggregateError !== "undefined")
      setProp(DexiePromise, "any", function() {
        var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
        return new DexiePromise(function(resolve3, reject) {
          if (possiblePromises.length === 0)
            reject(new AggregateError([]));
          var remaining = possiblePromises.length;
          var failures = new Array(remaining);
          possiblePromises.forEach(function(p2, i) {
            return DexiePromise.resolve(p2).then(function(value) {
              return resolve3(value);
            }, function(failure) {
              failures[i] = failure;
              if (!--remaining)
                reject(new AggregateError(failures));
            });
          });
        });
      });
  }
  function executePromiseTask(promise, fn) {
    try {
      fn(function(value) {
        if (promise._state !== null)
          return;
        if (value === promise)
          throw new TypeError("A promise cannot be resolved with itself.");
        var shouldExecuteTick = promise._lib && beginMicroTickScope();
        if (value && typeof value.then === "function") {
          executePromiseTask(promise, function(resolve3, reject) {
            value instanceof DexiePromise ? value._then(resolve3, reject) : value.then(resolve3, reject);
          });
        } else {
          promise._state = true;
          promise._value = value;
          propagateAllListeners(promise);
        }
        if (shouldExecuteTick)
          endMicroTickScope();
      }, handleRejection.bind(null, promise));
    } catch (ex) {
      handleRejection(promise, ex);
    }
  }
  function handleRejection(promise, reason) {
    rejectingErrors.push(reason);
    if (promise._state !== null)
      return;
    var shouldExecuteTick = promise._lib && beginMicroTickScope();
    reason = rejectionMapper(reason);
    promise._state = false;
    promise._value = reason;
    debug && reason !== null && typeof reason === "object" && !reason._promise && tryCatch(function() {
      var origProp = getPropertyDescriptor(reason, "stack");
      reason._promise = promise;
      setProp(reason, "stack", {
        get: function() {
          return stack_being_generated ? origProp && (origProp.get ? origProp.get.apply(reason) : origProp.value) : promise.stack;
        }
      });
    });
    addPossiblyUnhandledError(promise);
    propagateAllListeners(promise);
    if (shouldExecuteTick)
      endMicroTickScope();
  }
  function propagateAllListeners(promise) {
    var listeners = promise._listeners;
    promise._listeners = [];
    for (var i = 0, len = listeners.length; i < len; ++i) {
      propagateToListener(promise, listeners[i]);
    }
    var psd2 = promise._PSD;
    --psd2.ref || psd2.finalize();
    if (numScheduledCalls === 0) {
      ++numScheduledCalls;
      asap$1(function() {
        if (--numScheduledCalls === 0)
          finalizePhysicalTick();
      }, []);
    }
  }
  function propagateToListener(promise, listener) {
    if (promise._state === null) {
      promise._listeners.push(listener);
      return;
    }
    var cb = promise._state ? listener.onFulfilled : listener.onRejected;
    if (cb === null) {
      return (promise._state ? listener.resolve : listener.reject)(promise._value);
    }
    ++listener.psd.ref;
    ++numScheduledCalls;
    asap$1(callListener, [cb, promise, listener]);
  }
  function callListener(cb, promise, listener) {
    try {
      currentFulfiller = promise;
      var ret, value = promise._value;
      if (promise._state) {
        ret = cb(value);
      } else {
        if (rejectingErrors.length)
          rejectingErrors = [];
        ret = cb(value);
        if (rejectingErrors.indexOf(value) === -1)
          markErrorAsHandled(promise);
      }
      listener.resolve(ret);
    } catch (e) {
      listener.reject(e);
    } finally {
      currentFulfiller = null;
      if (--numScheduledCalls === 0)
        finalizePhysicalTick();
      --listener.psd.ref || listener.psd.finalize();
    }
  }
  function getStack(promise, stacks, limit) {
    if (stacks.length === limit)
      return stacks;
    var stack = "";
    if (promise._state === false) {
      var failure = promise._value, errorName, message;
      if (failure != null) {
        errorName = failure.name || "Error";
        message = failure.message || failure;
        stack = prettyStack(failure, 0);
      } else {
        errorName = failure;
        message = "";
      }
      stacks.push(errorName + (message ? ": " + message : "") + stack);
    }
    if (debug) {
      stack = prettyStack(promise._stackHolder, 2);
      if (stack && stacks.indexOf(stack) === -1)
        stacks.push(stack);
      if (promise._prev)
        getStack(promise._prev, stacks, limit);
    }
    return stacks;
  }
  function linkToPreviousPromise(promise, prev) {
    var numPrev = prev ? prev._numPrev + 1 : 0;
    if (numPrev < LONG_STACKS_CLIP_LIMIT) {
      promise._prev = prev;
      promise._numPrev = numPrev;
    }
  }
  function physicalTick() {
    beginMicroTickScope() && endMicroTickScope();
  }
  function beginMicroTickScope() {
    var wasRootExec = isOutsideMicroTick;
    isOutsideMicroTick = false;
    needsNewPhysicalTick = false;
    return wasRootExec;
  }
  function endMicroTickScope() {
    var callbacks, i, l;
    do {
      while (microtickQueue.length > 0) {
        callbacks = microtickQueue;
        microtickQueue = [];
        l = callbacks.length;
        for (i = 0; i < l; ++i) {
          var item = callbacks[i];
          item[0].apply(null, item[1]);
        }
      }
    } while (microtickQueue.length > 0);
    isOutsideMicroTick = true;
    needsNewPhysicalTick = true;
  }
  function finalizePhysicalTick() {
    var unhandledErrs = unhandledErrors;
    unhandledErrors = [];
    unhandledErrs.forEach(function(p2) {
      p2._PSD.onunhandled.call(null, p2._value, p2);
    });
    var finalizers = tickFinalizers.slice(0);
    var i = finalizers.length;
    while (i)
      finalizers[--i]();
  }
  function run_at_end_of_this_or_next_physical_tick(fn) {
    function finalizer() {
      fn();
      tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
    }
    tickFinalizers.push(finalizer);
    ++numScheduledCalls;
    asap$1(function() {
      if (--numScheduledCalls === 0)
        finalizePhysicalTick();
    }, []);
  }
  function addPossiblyUnhandledError(promise) {
    if (!unhandledErrors.some(function(p2) {
      return p2._value === promise._value;
    }))
      unhandledErrors.push(promise);
  }
  function markErrorAsHandled(promise) {
    var i = unhandledErrors.length;
    while (i)
      if (unhandledErrors[--i]._value === promise._value) {
        unhandledErrors.splice(i, 1);
        return;
      }
  }
  function PromiseReject(reason) {
    return new DexiePromise(INTERNAL, false, reason);
  }
  function wrap(fn, errorCatcher) {
    var psd2 = PSD;
    return function() {
      var wasRootExec = beginMicroTickScope(), outerScope = PSD;
      try {
        switchToZone(psd2, true);
        return fn.apply(this, arguments);
      } catch (e) {
        errorCatcher && errorCatcher(e);
      } finally {
        switchToZone(outerScope, false);
        if (wasRootExec)
          endMicroTickScope();
      }
    };
  }
  var task = {awaits: 0, echoes: 0, id: 0};
  var taskCounter = 0;
  var zoneStack = [];
  var zoneEchoes = 0;
  var totalEchoes = 0;
  var zone_id_counter = 0;
  function newScope(fn, props$$1, a1, a2) {
    var parent = PSD, psd2 = Object.create(parent);
    psd2.parent = parent;
    psd2.ref = 0;
    psd2.global = false;
    psd2.id = ++zone_id_counter;
    var globalEnv = globalPSD.env;
    psd2.env = patchGlobalPromise ? {
      Promise: DexiePromise,
      PromiseProp: {value: DexiePromise, configurable: true, writable: true},
      all: DexiePromise.all,
      race: DexiePromise.race,
      allSettled: DexiePromise.allSettled,
      any: DexiePromise.any,
      resolve: DexiePromise.resolve,
      reject: DexiePromise.reject,
      nthen: getPatchedPromiseThen(globalEnv.nthen, psd2),
      gthen: getPatchedPromiseThen(globalEnv.gthen, psd2)
    } : {};
    if (props$$1)
      extend(psd2, props$$1);
    ++parent.ref;
    psd2.finalize = function() {
      --this.parent.ref || this.parent.finalize();
    };
    var rv = usePSD(psd2, fn, a1, a2);
    if (psd2.ref === 0)
      psd2.finalize();
    return rv;
  }
  function incrementExpectedAwaits() {
    if (!task.id)
      task.id = ++taskCounter;
    ++task.awaits;
    task.echoes += ZONE_ECHO_LIMIT;
    return task.id;
  }
  function decrementExpectedAwaits(sourceTaskId) {
    if (!task.awaits || sourceTaskId && sourceTaskId !== task.id)
      return;
    if (--task.awaits === 0)
      task.id = 0;
    task.echoes = task.awaits * ZONE_ECHO_LIMIT;
  }
  if (("" + nativePromiseThen).indexOf("[native code]") === -1) {
    incrementExpectedAwaits = decrementExpectedAwaits = nop;
  }
  function onPossibleParallellAsync(possiblePromise) {
    if (task.echoes && possiblePromise && possiblePromise.constructor === NativePromise) {
      incrementExpectedAwaits();
      return possiblePromise.then(function(x) {
        decrementExpectedAwaits();
        return x;
      }, function(e) {
        decrementExpectedAwaits();
        return rejection(e);
      });
    }
    return possiblePromise;
  }
  function zoneEnterEcho(targetZone) {
    ++totalEchoes;
    if (!task.echoes || --task.echoes === 0) {
      task.echoes = task.id = 0;
    }
    zoneStack.push(PSD);
    switchToZone(targetZone, true);
  }
  function zoneLeaveEcho() {
    var zone = zoneStack[zoneStack.length - 1];
    zoneStack.pop();
    switchToZone(zone, false);
  }
  function switchToZone(targetZone, bEnteringZone) {
    var currentZone = PSD;
    if (bEnteringZone ? task.echoes && (!zoneEchoes++ || targetZone !== PSD) : zoneEchoes && (!--zoneEchoes || targetZone !== PSD)) {
      enqueueNativeMicroTask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
    }
    if (targetZone === PSD)
      return;
    PSD = targetZone;
    if (currentZone === globalPSD)
      globalPSD.env = snapShot();
    if (patchGlobalPromise) {
      var GlobalPromise_1 = globalPSD.env.Promise;
      var targetEnv = targetZone.env;
      nativePromiseProto.then = targetEnv.nthen;
      GlobalPromise_1.prototype.then = targetEnv.gthen;
      if (currentZone.global || targetZone.global) {
        Object.defineProperty(_global, "Promise", targetEnv.PromiseProp);
        GlobalPromise_1.all = targetEnv.all;
        GlobalPromise_1.race = targetEnv.race;
        GlobalPromise_1.resolve = targetEnv.resolve;
        GlobalPromise_1.reject = targetEnv.reject;
        if (targetEnv.allSettled)
          GlobalPromise_1.allSettled = targetEnv.allSettled;
        if (targetEnv.any)
          GlobalPromise_1.any = targetEnv.any;
      }
    }
  }
  function snapShot() {
    var GlobalPromise = _global.Promise;
    return patchGlobalPromise ? {
      Promise: GlobalPromise,
      PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
      all: GlobalPromise.all,
      race: GlobalPromise.race,
      allSettled: GlobalPromise.allSettled,
      any: GlobalPromise.any,
      resolve: GlobalPromise.resolve,
      reject: GlobalPromise.reject,
      nthen: nativePromiseProto.then,
      gthen: GlobalPromise.prototype.then
    } : {};
  }
  function usePSD(psd2, fn, a1, a2, a3) {
    var outerScope = PSD;
    try {
      switchToZone(psd2, true);
      return fn(a1, a2, a3);
    } finally {
      switchToZone(outerScope, false);
    }
  }
  function enqueueNativeMicroTask(job) {
    nativePromiseThen.call(resolvedNativePromise, job);
  }
  function nativeAwaitCompatibleWrap(fn, zone, possibleAwait) {
    return typeof fn !== "function" ? fn : function() {
      var outerZone = PSD;
      if (possibleAwait)
        incrementExpectedAwaits();
      switchToZone(zone, true);
      try {
        return fn.apply(this, arguments);
      } finally {
        switchToZone(outerZone, false);
      }
    };
  }
  function getPatchedPromiseThen(origThen, zone) {
    return function(onResolved, onRejected) {
      return origThen.call(this, nativeAwaitCompatibleWrap(onResolved, zone, false), nativeAwaitCompatibleWrap(onRejected, zone, false));
    };
  }
  var UNHANDLEDREJECTION = "unhandledrejection";
  function globalError(err, promise) {
    var rv;
    try {
      rv = promise.onuncatched(err);
    } catch (e) {
    }
    if (rv !== false)
      try {
        var event9, eventData = {promise, reason: err};
        if (_global.document && document.createEvent) {
          event9 = document.createEvent("Event");
          event9.initEvent(UNHANDLEDREJECTION, true, true);
          extend(event9, eventData);
        } else if (_global.CustomEvent) {
          event9 = new CustomEvent(UNHANDLEDREJECTION, {detail: eventData});
          extend(event9, eventData);
        }
        if (event9 && _global.dispatchEvent) {
          dispatchEvent(event9);
          if (!_global.PromiseRejectionEvent && _global.onunhandledrejection)
            try {
              _global.onunhandledrejection(event9);
            } catch (_) {
            }
        }
        if (debug && event9 && !event9.defaultPrevented) {
          console.warn("Unhandled rejection: " + (err.stack || err));
        }
      } catch (e) {
      }
  }
  var rejection = DexiePromise.reject;
  function tempTransaction(db, mode, storeNames, fn) {
    if (!db._state.openComplete && !PSD.letThrough) {
      if (!db._state.isBeingOpened) {
        if (!db._options.autoOpen)
          return rejection(new exceptions.DatabaseClosed());
        db.open().catch(nop);
      }
      return db._state.dbReadyPromise.then(function() {
        return tempTransaction(db, mode, storeNames, fn);
      });
    } else {
      var trans = db._createTransaction(mode, storeNames, db._dbSchema);
      try {
        trans.create();
      } catch (ex) {
        return rejection(ex);
      }
      return trans._promise(mode, function(resolve3, reject) {
        return newScope(function() {
          PSD.trans = trans;
          return fn(resolve3, reject, trans);
        });
      }).then(function(result) {
        return trans._completion.then(function() {
          return result;
        });
      });
    }
  }
  var DEXIE_VERSION = "3.0.2";
  var maxString = String.fromCharCode(65535);
  var minKey = -Infinity;
  var INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
  var STRING_EXPECTED = "String expected.";
  var connections = [];
  var isIEOrEdge = typeof navigator !== "undefined" && /(MSIE|Trident|Edge)/.test(navigator.userAgent);
  var hasIEDeleteObjectStoreBug = isIEOrEdge;
  var hangsOnDeleteLargeKeyRange = isIEOrEdge;
  var dexieStackFrameFilter = function(frame2) {
    return !/(dexie\.js|dexie\.min\.js)/.test(frame2);
  };
  var DBNAMES_DB = "__dbnames";
  var READONLY = "readonly";
  var READWRITE = "readwrite";
  function combine(filter1, filter2) {
    return filter1 ? filter2 ? function() {
      return filter1.apply(this, arguments) && filter2.apply(this, arguments);
    } : filter1 : filter2;
  }
  var AnyRange = {
    type: 3,
    lower: -Infinity,
    lowerOpen: false,
    upper: [[]],
    upperOpen: false
  };
  var Table = function() {
    function Table2() {
    }
    Table2.prototype._trans = function(mode, fn, writeLocked) {
      var trans = this._tx || PSD.trans;
      var tableName = this.name;
      function checkTableInTransaction(resolve3, reject, trans2) {
        if (!trans2.schema[tableName])
          throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
        return fn(trans2.idbtrans, trans2);
      }
      var wasRootExec = beginMicroTickScope();
      try {
        return trans && trans.db === this.db ? trans === PSD.trans ? trans._promise(mode, checkTableInTransaction, writeLocked) : newScope(function() {
          return trans._promise(mode, checkTableInTransaction, writeLocked);
        }, {trans, transless: PSD.transless || PSD}) : tempTransaction(this.db, mode, [this.name], checkTableInTransaction);
      } finally {
        if (wasRootExec)
          endMicroTickScope();
      }
    };
    Table2.prototype.get = function(keyOrCrit, cb) {
      var _this = this;
      if (keyOrCrit && keyOrCrit.constructor === Object)
        return this.where(keyOrCrit).first(cb);
      return this._trans("readonly", function(trans) {
        return _this.core.get({trans, key: keyOrCrit}).then(function(res2) {
          return _this.hook.reading.fire(res2);
        });
      }).then(cb);
    };
    Table2.prototype.where = function(indexOrCrit) {
      if (typeof indexOrCrit === "string")
        return new this.db.WhereClause(this, indexOrCrit);
      if (isArray(indexOrCrit))
        return new this.db.WhereClause(this, "[" + indexOrCrit.join("+") + "]");
      var keyPaths = keys(indexOrCrit);
      if (keyPaths.length === 1)
        return this.where(keyPaths[0]).equals(indexOrCrit[keyPaths[0]]);
      var compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter(function(ix) {
        return ix.compound && keyPaths.every(function(keyPath) {
          return ix.keyPath.indexOf(keyPath) >= 0;
        }) && ix.keyPath.every(function(keyPath) {
          return keyPaths.indexOf(keyPath) >= 0;
        });
      })[0];
      if (compoundIndex && this.db._maxKey !== maxString)
        return this.where(compoundIndex.name).equals(compoundIndex.keyPath.map(function(kp) {
          return indexOrCrit[kp];
        }));
      if (!compoundIndex && debug)
        console.warn("The query " + JSON.stringify(indexOrCrit) + " on " + this.name + " would benefit of a " + ("compound index [" + keyPaths.join("+") + "]"));
      var idxByName = this.schema.idxByName;
      var idb = this.db._deps.indexedDB;
      function equals(a, b) {
        try {
          return idb.cmp(a, b) === 0;
        } catch (e) {
          return false;
        }
      }
      var _a2 = keyPaths.reduce(function(_a3, keyPath) {
        var prevIndex = _a3[0], prevFilterFn = _a3[1];
        var index = idxByName[keyPath];
        var value = indexOrCrit[keyPath];
        return [
          prevIndex || index,
          prevIndex || !index ? combine(prevFilterFn, index && index.multi ? function(x) {
            var prop = getByKeyPath(x, keyPath);
            return isArray(prop) && prop.some(function(item) {
              return equals(value, item);
            });
          } : function(x) {
            return equals(value, getByKeyPath(x, keyPath));
          }) : prevFilterFn
        ];
      }, [null, null]), idx = _a2[0], filterFunction = _a2[1];
      return idx ? this.where(idx.name).equals(indexOrCrit[idx.keyPath]).filter(filterFunction) : compoundIndex ? this.filter(filterFunction) : this.where(keyPaths).equals("");
    };
    Table2.prototype.filter = function(filterFunction) {
      return this.toCollection().and(filterFunction);
    };
    Table2.prototype.count = function(thenShortcut) {
      return this.toCollection().count(thenShortcut);
    };
    Table2.prototype.offset = function(offset) {
      return this.toCollection().offset(offset);
    };
    Table2.prototype.limit = function(numRows) {
      return this.toCollection().limit(numRows);
    };
    Table2.prototype.each = function(callback) {
      return this.toCollection().each(callback);
    };
    Table2.prototype.toArray = function(thenShortcut) {
      return this.toCollection().toArray(thenShortcut);
    };
    Table2.prototype.toCollection = function() {
      return new this.db.Collection(new this.db.WhereClause(this));
    };
    Table2.prototype.orderBy = function(index) {
      return new this.db.Collection(new this.db.WhereClause(this, isArray(index) ? "[" + index.join("+") + "]" : index));
    };
    Table2.prototype.reverse = function() {
      return this.toCollection().reverse();
    };
    Table2.prototype.mapToClass = function(constructor) {
      this.schema.mappedClass = constructor;
      var readHook = function(obj2) {
        if (!obj2)
          return obj2;
        var res2 = Object.create(constructor.prototype);
        for (var m in obj2)
          if (hasOwn(obj2, m))
            try {
              res2[m] = obj2[m];
            } catch (_) {
            }
        return res2;
      };
      if (this.schema.readHook) {
        this.hook.reading.unsubscribe(this.schema.readHook);
      }
      this.schema.readHook = readHook;
      this.hook("reading", readHook);
      return constructor;
    };
    Table2.prototype.defineClass = function() {
      function Class(content) {
        extend(this, content);
      }
      return this.mapToClass(Class);
    };
    Table2.prototype.add = function(obj2, key) {
      var _this = this;
      return this._trans("readwrite", function(trans) {
        return _this.core.mutate({trans, type: "add", keys: key != null ? [key] : null, values: [obj2]});
      }).then(function(res2) {
        return res2.numFailures ? DexiePromise.reject(res2.failures[0]) : res2.lastResult;
      }).then(function(lastResult) {
        if (!_this.core.schema.primaryKey.outbound) {
          try {
            setByKeyPath(obj2, _this.core.schema.primaryKey.keyPath, lastResult);
          } catch (_) {
          }
        }
        return lastResult;
      });
    };
    Table2.prototype.update = function(keyOrObject, modifications) {
      if (typeof modifications !== "object" || isArray(modifications))
        throw new exceptions.InvalidArgument("Modifications must be an object.");
      if (typeof keyOrObject === "object" && !isArray(keyOrObject)) {
        keys(modifications).forEach(function(keyPath) {
          setByKeyPath(keyOrObject, keyPath, modifications[keyPath]);
        });
        var key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
        if (key === void 0)
          return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
        return this.where(":id").equals(key).modify(modifications);
      } else {
        return this.where(":id").equals(keyOrObject).modify(modifications);
      }
    };
    Table2.prototype.put = function(obj2, key) {
      var _this = this;
      return this._trans("readwrite", function(trans) {
        return _this.core.mutate({trans, type: "put", values: [obj2], keys: key != null ? [key] : null});
      }).then(function(res2) {
        return res2.numFailures ? DexiePromise.reject(res2.failures[0]) : res2.lastResult;
      }).then(function(lastResult) {
        if (!_this.core.schema.primaryKey.outbound) {
          try {
            setByKeyPath(obj2, _this.core.schema.primaryKey.keyPath, lastResult);
          } catch (_) {
          }
        }
        return lastResult;
      });
    };
    Table2.prototype.delete = function(key) {
      var _this = this;
      return this._trans("readwrite", function(trans) {
        return _this.core.mutate({trans, type: "delete", keys: [key]});
      }).then(function(res2) {
        return res2.numFailures ? DexiePromise.reject(res2.failures[0]) : void 0;
      });
    };
    Table2.prototype.clear = function() {
      var _this = this;
      return this._trans("readwrite", function(trans) {
        return _this.core.mutate({trans, type: "deleteRange", range: AnyRange});
      }).then(function(res2) {
        return res2.numFailures ? DexiePromise.reject(res2.failures[0]) : void 0;
      });
    };
    Table2.prototype.bulkGet = function(keys$$1) {
      var _this = this;
      return this._trans("readonly", function(trans) {
        return _this.core.getMany({
          keys: keys$$1,
          trans
        }).then(function(result) {
          return result.map(function(res2) {
            return _this.hook.reading.fire(res2);
          });
        });
      });
    };
    Table2.prototype.bulkAdd = function(objects, keysOrOptions, options) {
      var _this = this;
      var keys$$1 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
      options = options || (keys$$1 ? void 0 : keysOrOptions);
      var wantResults = options ? options.allKeys : void 0;
      return this._trans("readwrite", function(trans) {
        var outbound = _this.core.schema.primaryKey.outbound;
        if (!outbound && keys$$1)
          throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
        if (keys$$1 && keys$$1.length !== objects.length)
          throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
        var numObjects = objects.length;
        return _this.core.mutate({trans, type: "add", keys: keys$$1, values: objects, wantResults}).then(function(_a2) {
          var numFailures = _a2.numFailures, results = _a2.results, lastResult = _a2.lastResult, failures = _a2.failures;
          var result = wantResults ? results : lastResult;
          if (numFailures === 0)
            return result;
          throw new BulkError(_this.name + ".bulkAdd(): " + numFailures + " of " + numObjects + " operations failed", Object.keys(failures).map(function(pos) {
            return failures[pos];
          }));
        });
      });
    };
    Table2.prototype.bulkPut = function(objects, keysOrOptions, options) {
      var _this = this;
      var keys$$1 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
      options = options || (keys$$1 ? void 0 : keysOrOptions);
      var wantResults = options ? options.allKeys : void 0;
      return this._trans("readwrite", function(trans) {
        var outbound = _this.core.schema.primaryKey.outbound;
        if (!outbound && keys$$1)
          throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
        if (keys$$1 && keys$$1.length !== objects.length)
          throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
        var numObjects = objects.length;
        return _this.core.mutate({trans, type: "put", keys: keys$$1, values: objects, wantResults}).then(function(_a2) {
          var numFailures = _a2.numFailures, results = _a2.results, lastResult = _a2.lastResult, failures = _a2.failures;
          var result = wantResults ? results : lastResult;
          if (numFailures === 0)
            return result;
          throw new BulkError(_this.name + ".bulkPut(): " + numFailures + " of " + numObjects + " operations failed", Object.keys(failures).map(function(pos) {
            return failures[pos];
          }));
        });
      });
    };
    Table2.prototype.bulkDelete = function(keys$$1) {
      var _this = this;
      var numKeys = keys$$1.length;
      return this._trans("readwrite", function(trans) {
        return _this.core.mutate({trans, type: "delete", keys: keys$$1});
      }).then(function(_a2) {
        var numFailures = _a2.numFailures, lastResult = _a2.lastResult, failures = _a2.failures;
        if (numFailures === 0)
          return lastResult;
        throw new BulkError(_this.name + ".bulkDelete(): " + numFailures + " of " + numKeys + " operations failed", failures);
      });
    };
    return Table2;
  }();
  function Events(ctx) {
    var evs = {};
    var rv = function(eventName, subscriber) {
      if (subscriber) {
        var i2 = arguments.length, args = new Array(i2 - 1);
        while (--i2)
          args[i2 - 1] = arguments[i2];
        evs[eventName].subscribe.apply(null, args);
        return ctx;
      } else if (typeof eventName === "string") {
        return evs[eventName];
      }
    };
    rv.addEventType = add;
    for (var i = 1, l = arguments.length; i < l; ++i) {
      add(arguments[i]);
    }
    return rv;
    function add(eventName, chainFunction, defaultFunction) {
      if (typeof eventName === "object")
        return addConfiguredEvents(eventName);
      if (!chainFunction)
        chainFunction = reverseStoppableEventChain;
      if (!defaultFunction)
        defaultFunction = nop;
      var context = {
        subscribers: [],
        fire: defaultFunction,
        subscribe: function(cb) {
          if (context.subscribers.indexOf(cb) === -1) {
            context.subscribers.push(cb);
            context.fire = chainFunction(context.fire, cb);
          }
        },
        unsubscribe: function(cb) {
          context.subscribers = context.subscribers.filter(function(fn) {
            return fn !== cb;
          });
          context.fire = context.subscribers.reduce(chainFunction, defaultFunction);
        }
      };
      evs[eventName] = rv[eventName] = context;
      return context;
    }
    function addConfiguredEvents(cfg) {
      keys(cfg).forEach(function(eventName) {
        var args = cfg[eventName];
        if (isArray(args)) {
          add(eventName, cfg[eventName][0], cfg[eventName][1]);
        } else if (args === "asap") {
          var context = add(eventName, mirror, function fire() {
            var i2 = arguments.length, args2 = new Array(i2);
            while (i2--)
              args2[i2] = arguments[i2];
            context.subscribers.forEach(function(fn) {
              asap(function fireEvent() {
                fn.apply(null, args2);
              });
            });
          });
        } else
          throw new exceptions.InvalidArgument("Invalid event config");
      });
    }
  }
  function makeClassConstructor(prototype, constructor) {
    derive(constructor).from({prototype});
    return constructor;
  }
  function createTableConstructor(db) {
    return makeClassConstructor(Table.prototype, function Table$$1(name, tableSchema, trans) {
      this.db = db;
      this._tx = trans;
      this.name = name;
      this.schema = tableSchema;
      this.hook = db._allTables[name] ? db._allTables[name].hook : Events(null, {
        creating: [hookCreatingChain, nop],
        reading: [pureFunctionChain, mirror],
        updating: [hookUpdatingChain, nop],
        deleting: [hookDeletingChain, nop]
      });
    });
  }
  function isPlainKeyRange(ctx, ignoreLimitFilter) {
    return !(ctx.filter || ctx.algorithm || ctx.or) && (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter);
  }
  function addFilter(ctx, fn) {
    ctx.filter = combine(ctx.filter, fn);
  }
  function addReplayFilter(ctx, factory, isLimitFilter) {
    var curr = ctx.replayFilter;
    ctx.replayFilter = curr ? function() {
      return combine(curr(), factory());
    } : factory;
    ctx.justLimit = isLimitFilter && !curr;
  }
  function addMatchFilter(ctx, fn) {
    ctx.isMatch = combine(ctx.isMatch, fn);
  }
  function getIndexOrStore(ctx, coreSchema) {
    if (ctx.isPrimKey)
      return coreSchema.primaryKey;
    var index = coreSchema.getIndexByKeyPath(ctx.index);
    if (!index)
      throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + coreSchema.name + " is not indexed");
    return index;
  }
  function openCursor(ctx, coreTable, trans) {
    var index = getIndexOrStore(ctx, coreTable.schema);
    return coreTable.openCursor({
      trans,
      values: !ctx.keysOnly,
      reverse: ctx.dir === "prev",
      unique: !!ctx.unique,
      query: {
        index,
        range: ctx.range
      }
    });
  }
  function iter(ctx, fn, coreTrans, coreTable) {
    var filter = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
    if (!ctx.or) {
      return iterate(openCursor(ctx, coreTable, coreTrans), combine(ctx.algorithm, filter), fn, !ctx.keysOnly && ctx.valueMapper);
    } else {
      var set_1 = {};
      var union = function(item, cursor, advance) {
        if (!filter || filter(cursor, advance, function(result) {
          return cursor.stop(result);
        }, function(err) {
          return cursor.fail(err);
        })) {
          var primaryKey = cursor.primaryKey;
          var key = "" + primaryKey;
          if (key === "[object ArrayBuffer]")
            key = "" + new Uint8Array(primaryKey);
          if (!hasOwn(set_1, key)) {
            set_1[key] = true;
            fn(item, cursor, advance);
          }
        }
      };
      return Promise.all([
        ctx.or._iterate(union, coreTrans),
        iterate(openCursor(ctx, coreTable, coreTrans), ctx.algorithm, union, !ctx.keysOnly && ctx.valueMapper)
      ]);
    }
  }
  function iterate(cursorPromise, filter, fn, valueMapper) {
    var mappedFn = valueMapper ? function(x, c2, a) {
      return fn(valueMapper(x), c2, a);
    } : fn;
    var wrappedFn = wrap(mappedFn);
    return cursorPromise.then(function(cursor) {
      if (cursor) {
        return cursor.start(function() {
          var c2 = function() {
            return cursor.continue();
          };
          if (!filter || filter(cursor, function(advancer) {
            return c2 = advancer;
          }, function(val) {
            cursor.stop(val);
            c2 = nop;
          }, function(e) {
            cursor.fail(e);
            c2 = nop;
          }))
            wrappedFn(cursor.value, cursor, function(advancer) {
              return c2 = advancer;
            });
          c2();
        });
      }
    });
  }
  var Collection = function() {
    function Collection2() {
    }
    Collection2.prototype._read = function(fn, cb) {
      var ctx = this._ctx;
      return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readonly", fn).then(cb);
    };
    Collection2.prototype._write = function(fn) {
      var ctx = this._ctx;
      return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readwrite", fn, "locked");
    };
    Collection2.prototype._addAlgorithm = function(fn) {
      var ctx = this._ctx;
      ctx.algorithm = combine(ctx.algorithm, fn);
    };
    Collection2.prototype._iterate = function(fn, coreTrans) {
      return iter(this._ctx, fn, coreTrans, this._ctx.table.core);
    };
    Collection2.prototype.clone = function(props$$1) {
      var rv = Object.create(this.constructor.prototype), ctx = Object.create(this._ctx);
      if (props$$1)
        extend(ctx, props$$1);
      rv._ctx = ctx;
      return rv;
    };
    Collection2.prototype.raw = function() {
      this._ctx.valueMapper = null;
      return this;
    };
    Collection2.prototype.each = function(fn) {
      var ctx = this._ctx;
      return this._read(function(trans) {
        return iter(ctx, fn, trans, ctx.table.core);
      });
    };
    Collection2.prototype.count = function(cb) {
      var _this = this;
      return this._read(function(trans) {
        var ctx = _this._ctx;
        var coreTable = ctx.table.core;
        if (isPlainKeyRange(ctx, true)) {
          return coreTable.count({
            trans,
            query: {
              index: getIndexOrStore(ctx, coreTable.schema),
              range: ctx.range
            }
          }).then(function(count2) {
            return Math.min(count2, ctx.limit);
          });
        } else {
          var count = 0;
          return iter(ctx, function() {
            ++count;
            return false;
          }, trans, coreTable).then(function() {
            return count;
          });
        }
      }).then(cb);
    };
    Collection2.prototype.sortBy = function(keyPath, cb) {
      var parts = keyPath.split(".").reverse(), lastPart = parts[0], lastIndex = parts.length - 1;
      function getval(obj2, i) {
        if (i)
          return getval(obj2[parts[i]], i - 1);
        return obj2[lastPart];
      }
      var order = this._ctx.dir === "next" ? 1 : -1;
      function sorter(a, b) {
        var aVal = getval(a, lastIndex), bVal = getval(b, lastIndex);
        return aVal < bVal ? -order : aVal > bVal ? order : 0;
      }
      return this.toArray(function(a) {
        return a.sort(sorter);
      }).then(cb);
    };
    Collection2.prototype.toArray = function(cb) {
      var _this = this;
      return this._read(function(trans) {
        var ctx = _this._ctx;
        if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
          var valueMapper_1 = ctx.valueMapper;
          var index = getIndexOrStore(ctx, ctx.table.core.schema);
          return ctx.table.core.query({
            trans,
            limit: ctx.limit,
            values: true,
            query: {
              index,
              range: ctx.range
            }
          }).then(function(_a2) {
            var result = _a2.result;
            return valueMapper_1 ? result.map(valueMapper_1) : result;
          });
        } else {
          var a_1 = [];
          return iter(ctx, function(item) {
            return a_1.push(item);
          }, trans, ctx.table.core).then(function() {
            return a_1;
          });
        }
      }, cb);
    };
    Collection2.prototype.offset = function(offset) {
      var ctx = this._ctx;
      if (offset <= 0)
        return this;
      ctx.offset += offset;
      if (isPlainKeyRange(ctx)) {
        addReplayFilter(ctx, function() {
          var offsetLeft = offset;
          return function(cursor, advance) {
            if (offsetLeft === 0)
              return true;
            if (offsetLeft === 1) {
              --offsetLeft;
              return false;
            }
            advance(function() {
              cursor.advance(offsetLeft);
              offsetLeft = 0;
            });
            return false;
          };
        });
      } else {
        addReplayFilter(ctx, function() {
          var offsetLeft = offset;
          return function() {
            return --offsetLeft < 0;
          };
        });
      }
      return this;
    };
    Collection2.prototype.limit = function(numRows) {
      this._ctx.limit = Math.min(this._ctx.limit, numRows);
      addReplayFilter(this._ctx, function() {
        var rowsLeft = numRows;
        return function(cursor, advance, resolve3) {
          if (--rowsLeft <= 0)
            advance(resolve3);
          return rowsLeft >= 0;
        };
      }, true);
      return this;
    };
    Collection2.prototype.until = function(filterFunction, bIncludeStopEntry) {
      addFilter(this._ctx, function(cursor, advance, resolve3) {
        if (filterFunction(cursor.value)) {
          advance(resolve3);
          return bIncludeStopEntry;
        } else {
          return true;
        }
      });
      return this;
    };
    Collection2.prototype.first = function(cb) {
      return this.limit(1).toArray(function(a) {
        return a[0];
      }).then(cb);
    };
    Collection2.prototype.last = function(cb) {
      return this.reverse().first(cb);
    };
    Collection2.prototype.filter = function(filterFunction) {
      addFilter(this._ctx, function(cursor) {
        return filterFunction(cursor.value);
      });
      addMatchFilter(this._ctx, filterFunction);
      return this;
    };
    Collection2.prototype.and = function(filter) {
      return this.filter(filter);
    };
    Collection2.prototype.or = function(indexName) {
      return new this.db.WhereClause(this._ctx.table, indexName, this);
    };
    Collection2.prototype.reverse = function() {
      this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev";
      if (this._ondirectionchange)
        this._ondirectionchange(this._ctx.dir);
      return this;
    };
    Collection2.prototype.desc = function() {
      return this.reverse();
    };
    Collection2.prototype.eachKey = function(cb) {
      var ctx = this._ctx;
      ctx.keysOnly = !ctx.isMatch;
      return this.each(function(val, cursor) {
        cb(cursor.key, cursor);
      });
    };
    Collection2.prototype.eachUniqueKey = function(cb) {
      this._ctx.unique = "unique";
      return this.eachKey(cb);
    };
    Collection2.prototype.eachPrimaryKey = function(cb) {
      var ctx = this._ctx;
      ctx.keysOnly = !ctx.isMatch;
      return this.each(function(val, cursor) {
        cb(cursor.primaryKey, cursor);
      });
    };
    Collection2.prototype.keys = function(cb) {
      var ctx = this._ctx;
      ctx.keysOnly = !ctx.isMatch;
      var a = [];
      return this.each(function(item, cursor) {
        a.push(cursor.key);
      }).then(function() {
        return a;
      }).then(cb);
    };
    Collection2.prototype.primaryKeys = function(cb) {
      var ctx = this._ctx;
      if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
        return this._read(function(trans) {
          var index = getIndexOrStore(ctx, ctx.table.core.schema);
          return ctx.table.core.query({
            trans,
            values: false,
            limit: ctx.limit,
            query: {
              index,
              range: ctx.range
            }
          });
        }).then(function(_a2) {
          var result = _a2.result;
          return result;
        }).then(cb);
      }
      ctx.keysOnly = !ctx.isMatch;
      var a = [];
      return this.each(function(item, cursor) {
        a.push(cursor.primaryKey);
      }).then(function() {
        return a;
      }).then(cb);
    };
    Collection2.prototype.uniqueKeys = function(cb) {
      this._ctx.unique = "unique";
      return this.keys(cb);
    };
    Collection2.prototype.firstKey = function(cb) {
      return this.limit(1).keys(function(a) {
        return a[0];
      }).then(cb);
    };
    Collection2.prototype.lastKey = function(cb) {
      return this.reverse().firstKey(cb);
    };
    Collection2.prototype.distinct = function() {
      var ctx = this._ctx, idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
      if (!idx || !idx.multi)
        return this;
      var set = {};
      addFilter(this._ctx, function(cursor) {
        var strKey = cursor.primaryKey.toString();
        var found = hasOwn(set, strKey);
        set[strKey] = true;
        return !found;
      });
      return this;
    };
    Collection2.prototype.modify = function(changes) {
      var _this = this;
      var ctx = this._ctx;
      return this._write(function(trans) {
        var modifyer;
        if (typeof changes === "function") {
          modifyer = changes;
        } else {
          var keyPaths = keys(changes);
          var numKeys = keyPaths.length;
          modifyer = function(item) {
            var anythingModified = false;
            for (var i = 0; i < numKeys; ++i) {
              var keyPath = keyPaths[i], val = changes[keyPath];
              if (getByKeyPath(item, keyPath) !== val) {
                setByKeyPath(item, keyPath, val);
                anythingModified = true;
              }
            }
            return anythingModified;
          };
        }
        var coreTable = ctx.table.core;
        var _a2 = coreTable.schema.primaryKey, outbound = _a2.outbound, extractKey = _a2.extractKey;
        var limit = "testmode" in Dexie ? 1 : 2e3;
        var cmp2 = _this.db.core.cmp;
        var totalFailures = [];
        var successCount = 0;
        var failedKeys = [];
        var applyMutateResult = function(expectedCount, res2) {
          var failures = res2.failures, numFailures = res2.numFailures;
          successCount += expectedCount - numFailures;
          for (var _i = 0, _a3 = keys(failures); _i < _a3.length; _i++) {
            var pos = _a3[_i];
            totalFailures.push(failures[pos]);
          }
        };
        return _this.clone().primaryKeys().then(function(keys$$1) {
          var nextChunk = function(offset) {
            var count = Math.min(limit, keys$$1.length - offset);
            return coreTable.getMany({trans, keys: keys$$1.slice(offset, offset + count)}).then(function(values) {
              var addValues = [];
              var putValues = [];
              var putKeys = outbound ? [] : null;
              var deleteKeys = [];
              for (var i = 0; i < count; ++i) {
                var origValue = values[i];
                var ctx_1 = {
                  value: deepClone(origValue),
                  primKey: keys$$1[offset + i]
                };
                if (modifyer.call(ctx_1, ctx_1.value, ctx_1) !== false) {
                  if (ctx_1.value == null) {
                    deleteKeys.push(keys$$1[offset + i]);
                  } else if (!outbound && cmp2(extractKey(origValue), extractKey(ctx_1.value)) !== 0) {
                    deleteKeys.push(keys$$1[offset + i]);
                    addValues.push(ctx_1.value);
                  } else {
                    putValues.push(ctx_1.value);
                    if (outbound)
                      putKeys.push(keys$$1[offset + i]);
                  }
                }
              }
              return Promise.resolve(addValues.length > 0 && coreTable.mutate({trans, type: "add", values: addValues}).then(function(res2) {
                for (var pos in res2.failures) {
                  deleteKeys.splice(parseInt(pos), 1);
                }
                applyMutateResult(addValues.length, res2);
              })).then(function(res2) {
                return putValues.length > 0 && coreTable.mutate({trans, type: "put", keys: putKeys, values: putValues}).then(function(res3) {
                  return applyMutateResult(putValues.length, res3);
                });
              }).then(function() {
                return deleteKeys.length > 0 && coreTable.mutate({trans, type: "delete", keys: deleteKeys}).then(function(res2) {
                  return applyMutateResult(deleteKeys.length, res2);
                });
              }).then(function() {
                return keys$$1.length > offset + count && nextChunk(offset + limit);
              });
            });
          };
          return nextChunk(0).then(function() {
            if (totalFailures.length > 0)
              throw new ModifyError("Error modifying one or more objects", totalFailures, successCount, failedKeys);
            return keys$$1.length;
          });
        });
      });
    };
    Collection2.prototype.delete = function() {
      var ctx = this._ctx, range = ctx.range;
      if (isPlainKeyRange(ctx) && (ctx.isPrimKey && !hangsOnDeleteLargeKeyRange || range.type === 3)) {
        return this._write(function(trans) {
          var primaryKey = ctx.table.core.schema.primaryKey;
          var coreRange = range;
          return ctx.table.core.count({trans, query: {index: primaryKey, range: coreRange}}).then(function(count) {
            return ctx.table.core.mutate({trans, type: "deleteRange", range: coreRange}).then(function(_a2) {
              var failures = _a2.failures, lastResult = _a2.lastResult, results = _a2.results, numFailures = _a2.numFailures;
              if (numFailures)
                throw new ModifyError("Could not delete some values", Object.keys(failures).map(function(pos) {
                  return failures[pos];
                }), count - numFailures);
              return count - numFailures;
            });
          });
        });
      }
      return this.modify(function(value, ctx2) {
        return ctx2.value = null;
      });
    };
    return Collection2;
  }();
  function createCollectionConstructor(db) {
    return makeClassConstructor(Collection.prototype, function Collection$$1(whereClause, keyRangeGenerator) {
      this.db = db;
      var keyRange = AnyRange, error = null;
      if (keyRangeGenerator)
        try {
          keyRange = keyRangeGenerator();
        } catch (ex) {
          error = ex;
        }
      var whereCtx = whereClause._ctx;
      var table = whereCtx.table;
      var readingHook = table.hook.reading.fire;
      this._ctx = {
        table,
        index: whereCtx.index,
        isPrimKey: !whereCtx.index || table.schema.primKey.keyPath && whereCtx.index === table.schema.primKey.name,
        range: keyRange,
        keysOnly: false,
        dir: "next",
        unique: "",
        algorithm: null,
        filter: null,
        replayFilter: null,
        justLimit: true,
        isMatch: null,
        offset: 0,
        limit: Infinity,
        error,
        or: whereCtx.or,
        valueMapper: readingHook !== mirror ? readingHook : null
      };
    });
  }
  function simpleCompare(a, b) {
    return a < b ? -1 : a === b ? 0 : 1;
  }
  function simpleCompareReverse(a, b) {
    return a > b ? -1 : a === b ? 0 : 1;
  }
  function fail(collectionOrWhereClause, err, T) {
    var collection = collectionOrWhereClause instanceof WhereClause ? new collectionOrWhereClause.Collection(collectionOrWhereClause) : collectionOrWhereClause;
    collection._ctx.error = T ? new T(err) : new TypeError(err);
    return collection;
  }
  function emptyCollection(whereClause) {
    return new whereClause.Collection(whereClause, function() {
      return rangeEqual("");
    }).limit(0);
  }
  function upperFactory(dir2) {
    return dir2 === "next" ? function(s2) {
      return s2.toUpperCase();
    } : function(s2) {
      return s2.toLowerCase();
    };
  }
  function lowerFactory(dir2) {
    return dir2 === "next" ? function(s2) {
      return s2.toLowerCase();
    } : function(s2) {
      return s2.toUpperCase();
    };
  }
  function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp2, dir2) {
    var length = Math.min(key.length, lowerNeedle.length);
    var llp = -1;
    for (var i = 0; i < length; ++i) {
      var lwrKeyChar = lowerKey[i];
      if (lwrKeyChar !== lowerNeedle[i]) {
        if (cmp2(key[i], upperNeedle[i]) < 0)
          return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
        if (cmp2(key[i], lowerNeedle[i]) < 0)
          return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
        if (llp >= 0)
          return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
        return null;
      }
      if (cmp2(key[i], lwrKeyChar) < 0)
        llp = i;
    }
    if (length < lowerNeedle.length && dir2 === "next")
      return key + upperNeedle.substr(key.length);
    if (length < key.length && dir2 === "prev")
      return key.substr(0, upperNeedle.length);
    return llp < 0 ? null : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1);
  }
  function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
    var upper, lower, compare, upperNeedles, lowerNeedles, direction, nextKeySuffix, needlesLen = needles.length;
    if (!needles.every(function(s2) {
      return typeof s2 === "string";
    })) {
      return fail(whereClause, STRING_EXPECTED);
    }
    function initDirection(dir2) {
      upper = upperFactory(dir2);
      lower = lowerFactory(dir2);
      compare = dir2 === "next" ? simpleCompare : simpleCompareReverse;
      var needleBounds = needles.map(function(needle) {
        return {lower: lower(needle), upper: upper(needle)};
      }).sort(function(a, b) {
        return compare(a.lower, b.lower);
      });
      upperNeedles = needleBounds.map(function(nb2) {
        return nb2.upper;
      });
      lowerNeedles = needleBounds.map(function(nb2) {
        return nb2.lower;
      });
      direction = dir2;
      nextKeySuffix = dir2 === "next" ? "" : suffix;
    }
    initDirection("next");
    var c2 = new whereClause.Collection(whereClause, function() {
      return createRange(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix);
    });
    c2._ondirectionchange = function(direction2) {
      initDirection(direction2);
    };
    var firstPossibleNeedle = 0;
    c2._addAlgorithm(function(cursor, advance, resolve3) {
      var key = cursor.key;
      if (typeof key !== "string")
        return false;
      var lowerKey = lower(key);
      if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
        return true;
      } else {
        var lowestPossibleCasing = null;
        for (var i = firstPossibleNeedle; i < needlesLen; ++i) {
          var casing = nextCasing(key, lowerKey, upperNeedles[i], lowerNeedles[i], compare, direction);
          if (casing === null && lowestPossibleCasing === null)
            firstPossibleNeedle = i + 1;
          else if (lowestPossibleCasing === null || compare(lowestPossibleCasing, casing) > 0) {
            lowestPossibleCasing = casing;
          }
        }
        if (lowestPossibleCasing !== null) {
          advance(function() {
            cursor.continue(lowestPossibleCasing + nextKeySuffix);
          });
        } else {
          advance(resolve3);
        }
        return false;
      }
    });
    return c2;
  }
  function createRange(lower, upper, lowerOpen, upperOpen) {
    return {
      type: 2,
      lower,
      upper,
      lowerOpen,
      upperOpen
    };
  }
  function rangeEqual(value) {
    return {
      type: 1,
      lower: value,
      upper: value
    };
  }
  var WhereClause = function() {
    function WhereClause2() {
    }
    Object.defineProperty(WhereClause2.prototype, "Collection", {
      get: function() {
        return this._ctx.table.db.Collection;
      },
      enumerable: true,
      configurable: true
    });
    WhereClause2.prototype.between = function(lower, upper, includeLower, includeUpper) {
      includeLower = includeLower !== false;
      includeUpper = includeUpper === true;
      try {
        if (this._cmp(lower, upper) > 0 || this._cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper))
          return emptyCollection(this);
        return new this.Collection(this, function() {
          return createRange(lower, upper, !includeLower, !includeUpper);
        });
      } catch (e) {
        return fail(this, INVALID_KEY_ARGUMENT);
      }
    };
    WhereClause2.prototype.equals = function(value) {
      return new this.Collection(this, function() {
        return rangeEqual(value);
      });
    };
    WhereClause2.prototype.above = function(value) {
      if (value == null)
        return fail(this, INVALID_KEY_ARGUMENT);
      return new this.Collection(this, function() {
        return createRange(value, void 0, true);
      });
    };
    WhereClause2.prototype.aboveOrEqual = function(value) {
      if (value == null)
        return fail(this, INVALID_KEY_ARGUMENT);
      return new this.Collection(this, function() {
        return createRange(value, void 0, false);
      });
    };
    WhereClause2.prototype.below = function(value) {
      if (value == null)
        return fail(this, INVALID_KEY_ARGUMENT);
      return new this.Collection(this, function() {
        return createRange(void 0, value, false, true);
      });
    };
    WhereClause2.prototype.belowOrEqual = function(value) {
      if (value == null)
        return fail(this, INVALID_KEY_ARGUMENT);
      return new this.Collection(this, function() {
        return createRange(void 0, value);
      });
    };
    WhereClause2.prototype.startsWith = function(str2) {
      if (typeof str2 !== "string")
        return fail(this, STRING_EXPECTED);
      return this.between(str2, str2 + maxString, true, true);
    };
    WhereClause2.prototype.startsWithIgnoreCase = function(str2) {
      if (str2 === "")
        return this.startsWith(str2);
      return addIgnoreCaseAlgorithm(this, function(x, a) {
        return x.indexOf(a[0]) === 0;
      }, [str2], maxString);
    };
    WhereClause2.prototype.equalsIgnoreCase = function(str2) {
      return addIgnoreCaseAlgorithm(this, function(x, a) {
        return x === a[0];
      }, [str2], "");
    };
    WhereClause2.prototype.anyOfIgnoreCase = function() {
      var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
      if (set.length === 0)
        return emptyCollection(this);
      return addIgnoreCaseAlgorithm(this, function(x, a) {
        return a.indexOf(x) !== -1;
      }, set, "");
    };
    WhereClause2.prototype.startsWithAnyOfIgnoreCase = function() {
      var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
      if (set.length === 0)
        return emptyCollection(this);
      return addIgnoreCaseAlgorithm(this, function(x, a) {
        return a.some(function(n) {
          return x.indexOf(n) === 0;
        });
      }, set, maxString);
    };
    WhereClause2.prototype.anyOf = function() {
      var _this = this;
      var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
      var compare = this._cmp;
      try {
        set.sort(compare);
      } catch (e) {
        return fail(this, INVALID_KEY_ARGUMENT);
      }
      if (set.length === 0)
        return emptyCollection(this);
      var c2 = new this.Collection(this, function() {
        return createRange(set[0], set[set.length - 1]);
      });
      c2._ondirectionchange = function(direction) {
        compare = direction === "next" ? _this._ascending : _this._descending;
        set.sort(compare);
      };
      var i = 0;
      c2._addAlgorithm(function(cursor, advance, resolve3) {
        var key = cursor.key;
        while (compare(key, set[i]) > 0) {
          ++i;
          if (i === set.length) {
            advance(resolve3);
            return false;
          }
        }
        if (compare(key, set[i]) === 0) {
          return true;
        } else {
          advance(function() {
            cursor.continue(set[i]);
          });
          return false;
        }
      });
      return c2;
    };
    WhereClause2.prototype.notEqual = function(value) {
      return this.inAnyRange([[minKey, value], [value, this.db._maxKey]], {includeLowers: false, includeUppers: false});
    };
    WhereClause2.prototype.noneOf = function() {
      var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
      if (set.length === 0)
        return new this.Collection(this);
      try {
        set.sort(this._ascending);
      } catch (e) {
        return fail(this, INVALID_KEY_ARGUMENT);
      }
      var ranges = set.reduce(function(res2, val) {
        return res2 ? res2.concat([[res2[res2.length - 1][1], val]]) : [[minKey, val]];
      }, null);
      ranges.push([set[set.length - 1], this.db._maxKey]);
      return this.inAnyRange(ranges, {includeLowers: false, includeUppers: false});
    };
    WhereClause2.prototype.inAnyRange = function(ranges, options) {
      var _this = this;
      var cmp2 = this._cmp, ascending = this._ascending, descending = this._descending, min = this._min, max = this._max;
      if (ranges.length === 0)
        return emptyCollection(this);
      if (!ranges.every(function(range) {
        return range[0] !== void 0 && range[1] !== void 0 && ascending(range[0], range[1]) <= 0;
      })) {
        return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
      }
      var includeLowers = !options || options.includeLowers !== false;
      var includeUppers = options && options.includeUppers === true;
      function addRange(ranges2, newRange) {
        var i = 0, l = ranges2.length;
        for (; i < l; ++i) {
          var range = ranges2[i];
          if (cmp2(newRange[0], range[1]) < 0 && cmp2(newRange[1], range[0]) > 0) {
            range[0] = min(range[0], newRange[0]);
            range[1] = max(range[1], newRange[1]);
            break;
          }
        }
        if (i === l)
          ranges2.push(newRange);
        return ranges2;
      }
      var sortDirection = ascending;
      function rangeSorter(a, b) {
        return sortDirection(a[0], b[0]);
      }
      var set;
      try {
        set = ranges.reduce(addRange, []);
        set.sort(rangeSorter);
      } catch (ex) {
        return fail(this, INVALID_KEY_ARGUMENT);
      }
      var rangePos = 0;
      var keyIsBeyondCurrentEntry = includeUppers ? function(key) {
        return ascending(key, set[rangePos][1]) > 0;
      } : function(key) {
        return ascending(key, set[rangePos][1]) >= 0;
      };
      var keyIsBeforeCurrentEntry = includeLowers ? function(key) {
        return descending(key, set[rangePos][0]) > 0;
      } : function(key) {
        return descending(key, set[rangePos][0]) >= 0;
      };
      function keyWithinCurrentRange(key) {
        return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
      }
      var checkKey = keyIsBeyondCurrentEntry;
      var c2 = new this.Collection(this, function() {
        return createRange(set[0][0], set[set.length - 1][1], !includeLowers, !includeUppers);
      });
      c2._ondirectionchange = function(direction) {
        if (direction === "next") {
          checkKey = keyIsBeyondCurrentEntry;
          sortDirection = ascending;
        } else {
          checkKey = keyIsBeforeCurrentEntry;
          sortDirection = descending;
        }
        set.sort(rangeSorter);
      };
      c2._addAlgorithm(function(cursor, advance, resolve3) {
        var key = cursor.key;
        while (checkKey(key)) {
          ++rangePos;
          if (rangePos === set.length) {
            advance(resolve3);
            return false;
          }
        }
        if (keyWithinCurrentRange(key)) {
          return true;
        } else if (_this._cmp(key, set[rangePos][1]) === 0 || _this._cmp(key, set[rangePos][0]) === 0) {
          return false;
        } else {
          advance(function() {
            if (sortDirection === ascending)
              cursor.continue(set[rangePos][0]);
            else
              cursor.continue(set[rangePos][1]);
          });
          return false;
        }
      });
      return c2;
    };
    WhereClause2.prototype.startsWithAnyOf = function() {
      var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
      if (!set.every(function(s2) {
        return typeof s2 === "string";
      })) {
        return fail(this, "startsWithAnyOf() only works with strings");
      }
      if (set.length === 0)
        return emptyCollection(this);
      return this.inAnyRange(set.map(function(str2) {
        return [str2, str2 + maxString];
      }));
    };
    return WhereClause2;
  }();
  function createWhereClauseConstructor(db) {
    return makeClassConstructor(WhereClause.prototype, function WhereClause$$1(table, index, orCollection) {
      this.db = db;
      this._ctx = {
        table,
        index: index === ":id" ? null : index,
        or: orCollection
      };
      var indexedDB = db._deps.indexedDB;
      if (!indexedDB)
        throw new exceptions.MissingAPI("indexedDB API missing");
      this._cmp = this._ascending = indexedDB.cmp.bind(indexedDB);
      this._descending = function(a, b) {
        return indexedDB.cmp(b, a);
      };
      this._max = function(a, b) {
        return indexedDB.cmp(a, b) > 0 ? a : b;
      };
      this._min = function(a, b) {
        return indexedDB.cmp(a, b) < 0 ? a : b;
      };
      this._IDBKeyRange = db._deps.IDBKeyRange;
    });
  }
  function safariMultiStoreFix(storeNames) {
    return storeNames.length === 1 ? storeNames[0] : storeNames;
  }
  function getMaxKey(IdbKeyRange) {
    try {
      IdbKeyRange.only([[]]);
      return [[]];
    } catch (e) {
      return maxString;
    }
  }
  function eventRejectHandler(reject) {
    return wrap(function(event9) {
      preventDefault(event9);
      reject(event9.target.error);
      return false;
    });
  }
  function preventDefault(event9) {
    if (event9.stopPropagation)
      event9.stopPropagation();
    if (event9.preventDefault)
      event9.preventDefault();
  }
  var Transaction = function() {
    function Transaction2() {
    }
    Transaction2.prototype._lock = function() {
      assert(!PSD.global);
      ++this._reculock;
      if (this._reculock === 1 && !PSD.global)
        PSD.lockOwnerFor = this;
      return this;
    };
    Transaction2.prototype._unlock = function() {
      assert(!PSD.global);
      if (--this._reculock === 0) {
        if (!PSD.global)
          PSD.lockOwnerFor = null;
        while (this._blockedFuncs.length > 0 && !this._locked()) {
          var fnAndPSD = this._blockedFuncs.shift();
          try {
            usePSD(fnAndPSD[1], fnAndPSD[0]);
          } catch (e) {
          }
        }
      }
      return this;
    };
    Transaction2.prototype._locked = function() {
      return this._reculock && PSD.lockOwnerFor !== this;
    };
    Transaction2.prototype.create = function(idbtrans) {
      var _this = this;
      if (!this.mode)
        return this;
      var idbdb = this.db.idbdb;
      var dbOpenError = this.db._state.dbOpenError;
      assert(!this.idbtrans);
      if (!idbtrans && !idbdb) {
        switch (dbOpenError && dbOpenError.name) {
          case "DatabaseClosedError":
            throw new exceptions.DatabaseClosed(dbOpenError);
          case "MissingAPIError":
            throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
          default:
            throw new exceptions.OpenFailed(dbOpenError);
        }
      }
      if (!this.active)
        throw new exceptions.TransactionInactive();
      assert(this._completion._state === null);
      idbtrans = this.idbtrans = idbtrans || idbdb.transaction(safariMultiStoreFix(this.storeNames), this.mode);
      idbtrans.onerror = wrap(function(ev) {
        preventDefault(ev);
        _this._reject(idbtrans.error);
      });
      idbtrans.onabort = wrap(function(ev) {
        preventDefault(ev);
        _this.active && _this._reject(new exceptions.Abort(idbtrans.error));
        _this.active = false;
        _this.on("abort").fire(ev);
      });
      idbtrans.oncomplete = wrap(function() {
        _this.active = false;
        _this._resolve();
      });
      return this;
    };
    Transaction2.prototype._promise = function(mode, fn, bWriteLock) {
      var _this = this;
      if (mode === "readwrite" && this.mode !== "readwrite")
        return rejection(new exceptions.ReadOnly("Transaction is readonly"));
      if (!this.active)
        return rejection(new exceptions.TransactionInactive());
      if (this._locked()) {
        return new DexiePromise(function(resolve3, reject) {
          _this._blockedFuncs.push([function() {
            _this._promise(mode, fn, bWriteLock).then(resolve3, reject);
          }, PSD]);
        });
      } else if (bWriteLock) {
        return newScope(function() {
          var p3 = new DexiePromise(function(resolve3, reject) {
            _this._lock();
            var rv = fn(resolve3, reject, _this);
            if (rv && rv.then)
              rv.then(resolve3, reject);
          });
          p3.finally(function() {
            return _this._unlock();
          });
          p3._lib = true;
          return p3;
        });
      } else {
        var p2 = new DexiePromise(function(resolve3, reject) {
          var rv = fn(resolve3, reject, _this);
          if (rv && rv.then)
            rv.then(resolve3, reject);
        });
        p2._lib = true;
        return p2;
      }
    };
    Transaction2.prototype._root = function() {
      return this.parent ? this.parent._root() : this;
    };
    Transaction2.prototype.waitFor = function(promiseLike) {
      var root = this._root();
      var promise = DexiePromise.resolve(promiseLike);
      if (root._waitingFor) {
        root._waitingFor = root._waitingFor.then(function() {
          return promise;
        });
      } else {
        root._waitingFor = promise;
        root._waitingQueue = [];
        var store = root.idbtrans.objectStore(root.storeNames[0]);
        (function spin() {
          ++root._spinCount;
          while (root._waitingQueue.length)
            root._waitingQueue.shift()();
          if (root._waitingFor)
            store.get(-Infinity).onsuccess = spin;
        })();
      }
      var currentWaitPromise = root._waitingFor;
      return new DexiePromise(function(resolve3, reject) {
        promise.then(function(res2) {
          return root._waitingQueue.push(wrap(resolve3.bind(null, res2)));
        }, function(err) {
          return root._waitingQueue.push(wrap(reject.bind(null, err)));
        }).finally(function() {
          if (root._waitingFor === currentWaitPromise) {
            root._waitingFor = null;
          }
        });
      });
    };
    Transaction2.prototype.abort = function() {
      this.active && this._reject(new exceptions.Abort());
      this.active = false;
    };
    Transaction2.prototype.table = function(tableName) {
      var memoizedTables = this._memoizedTables || (this._memoizedTables = {});
      if (hasOwn(memoizedTables, tableName))
        return memoizedTables[tableName];
      var tableSchema = this.schema[tableName];
      if (!tableSchema) {
        throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
      }
      var transactionBoundTable = new this.db.Table(tableName, tableSchema, this);
      transactionBoundTable.core = this.db.core.table(tableName);
      memoizedTables[tableName] = transactionBoundTable;
      return transactionBoundTable;
    };
    return Transaction2;
  }();
  function createTransactionConstructor(db) {
    return makeClassConstructor(Transaction.prototype, function Transaction$$1(mode, storeNames, dbschema, parent) {
      var _this = this;
      this.db = db;
      this.mode = mode;
      this.storeNames = storeNames;
      this.schema = dbschema;
      this.idbtrans = null;
      this.on = Events(this, "complete", "error", "abort");
      this.parent = parent || null;
      this.active = true;
      this._reculock = 0;
      this._blockedFuncs = [];
      this._resolve = null;
      this._reject = null;
      this._waitingFor = null;
      this._waitingQueue = null;
      this._spinCount = 0;
      this._completion = new DexiePromise(function(resolve3, reject) {
        _this._resolve = resolve3;
        _this._reject = reject;
      });
      this._completion.then(function() {
        _this.active = false;
        _this.on.complete.fire();
      }, function(e) {
        var wasActive = _this.active;
        _this.active = false;
        _this.on.error.fire(e);
        _this.parent ? _this.parent._reject(e) : wasActive && _this.idbtrans && _this.idbtrans.abort();
        return rejection(e);
      });
    });
  }
  function createIndexSpec(name, keyPath, unique, multi, auto, compound, isPrimKey) {
    return {
      name,
      keyPath,
      unique,
      multi,
      auto,
      compound,
      src: (unique && !isPrimKey ? "&" : "") + (multi ? "*" : "") + (auto ? "++" : "") + nameFromKeyPath(keyPath)
    };
  }
  function nameFromKeyPath(keyPath) {
    return typeof keyPath === "string" ? keyPath : keyPath ? "[" + [].join.call(keyPath, "+") + "]" : "";
  }
  function createTableSchema(name, primKey, indexes) {
    return {
      name,
      primKey,
      indexes,
      mappedClass: null,
      idxByName: arrayToObject(indexes, function(index) {
        return [index.name, index];
      })
    };
  }
  function getKeyExtractor(keyPath) {
    if (keyPath == null) {
      return function() {
        return void 0;
      };
    } else if (typeof keyPath === "string") {
      return getSinglePathKeyExtractor(keyPath);
    } else {
      return function(obj2) {
        return getByKeyPath(obj2, keyPath);
      };
    }
  }
  function getSinglePathKeyExtractor(keyPath) {
    var split = keyPath.split(".");
    if (split.length === 1) {
      return function(obj2) {
        return obj2[keyPath];
      };
    } else {
      return function(obj2) {
        return getByKeyPath(obj2, keyPath);
      };
    }
  }
  function getEffectiveKeys(primaryKey, req) {
    if (req.type === "delete")
      return req.keys;
    return req.keys || req.values.map(primaryKey.extractKey);
  }
  function getExistingValues(table, req, effectiveKeys) {
    return req.type === "add" ? Promise.resolve(new Array(req.values.length)) : table.getMany({trans: req.trans, keys: effectiveKeys});
  }
  function arrayify(arrayLike) {
    return [].slice.call(arrayLike);
  }
  var _id_counter = 0;
  function getKeyPathAlias(keyPath) {
    return keyPath == null ? ":id" : typeof keyPath === "string" ? keyPath : "[" + keyPath.join("+") + "]";
  }
  function createDBCore(db, indexedDB, IdbKeyRange, tmpTrans) {
    var cmp2 = indexedDB.cmp.bind(indexedDB);
    function extractSchema(db2, trans) {
      var tables2 = arrayify(db2.objectStoreNames);
      return {
        schema: {
          name: db2.name,
          tables: tables2.map(function(table) {
            return trans.objectStore(table);
          }).map(function(store) {
            var keyPath = store.keyPath, autoIncrement = store.autoIncrement;
            var compound = isArray(keyPath);
            var outbound = keyPath == null;
            var indexByKeyPath = {};
            var result = {
              name: store.name,
              primaryKey: {
                name: null,
                isPrimaryKey: true,
                outbound,
                compound,
                keyPath,
                autoIncrement,
                unique: true,
                extractKey: getKeyExtractor(keyPath)
              },
              indexes: arrayify(store.indexNames).map(function(indexName) {
                return store.index(indexName);
              }).map(function(index) {
                var name = index.name, unique = index.unique, multiEntry = index.multiEntry, keyPath2 = index.keyPath;
                var compound2 = isArray(keyPath2);
                var result2 = {
                  name,
                  compound: compound2,
                  keyPath: keyPath2,
                  unique,
                  multiEntry,
                  extractKey: getKeyExtractor(keyPath2)
                };
                indexByKeyPath[getKeyPathAlias(keyPath2)] = result2;
                return result2;
              }),
              getIndexByKeyPath: function(keyPath2) {
                return indexByKeyPath[getKeyPathAlias(keyPath2)];
              }
            };
            indexByKeyPath[":id"] = result.primaryKey;
            if (keyPath != null) {
              indexByKeyPath[getKeyPathAlias(keyPath)] = result.primaryKey;
            }
            return result;
          })
        },
        hasGetAll: tables2.length > 0 && "getAll" in trans.objectStore(tables2[0]) && !(typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604)
      };
    }
    function makeIDBKeyRange(range) {
      if (range.type === 3)
        return null;
      if (range.type === 4)
        throw new Error("Cannot convert never type to IDBKeyRange");
      var lower = range.lower, upper = range.upper, lowerOpen = range.lowerOpen, upperOpen = range.upperOpen;
      var idbRange = lower === void 0 ? upper === void 0 ? null : IdbKeyRange.upperBound(upper, !!upperOpen) : upper === void 0 ? IdbKeyRange.lowerBound(lower, !!lowerOpen) : IdbKeyRange.bound(lower, upper, !!lowerOpen, !!upperOpen);
      return idbRange;
    }
    function createDbCoreTable(tableSchema) {
      var tableName = tableSchema.name;
      function mutate(_a3) {
        var trans = _a3.trans, type = _a3.type, keys$$1 = _a3.keys, values = _a3.values, range = _a3.range, wantResults = _a3.wantResults;
        return new Promise(function(resolve3, reject) {
          resolve3 = wrap(resolve3);
          var store = trans.objectStore(tableName);
          var outbound = store.keyPath == null;
          var isAddOrPut = type === "put" || type === "add";
          if (!isAddOrPut && type !== "delete" && type !== "deleteRange")
            throw new Error("Invalid operation type: " + type);
          var length = (keys$$1 || values || {length: 1}).length;
          if (keys$$1 && values && keys$$1.length !== values.length) {
            throw new Error("Given keys array must have same length as given values array.");
          }
          if (length === 0)
            return resolve3({numFailures: 0, failures: {}, results: [], lastResult: void 0});
          var results = wantResults && __spreadArrays(keys$$1 ? keys$$1 : getEffectiveKeys(tableSchema.primaryKey, {type, keys: keys$$1, values}));
          var req;
          var failures = [];
          var numFailures = 0;
          var errorHandler = function(event9) {
            ++numFailures;
            preventDefault(event9);
            if (results)
              results[event9.target._reqno] = void 0;
            failures[event9.target._reqno] = event9.target.error;
          };
          var setResult = function(_a5) {
            var target = _a5.target;
            results[target._reqno] = target.result;
          };
          if (type === "deleteRange") {
            if (range.type === 4)
              return resolve3({numFailures, failures, results, lastResult: void 0});
            if (range.type === 3)
              req = store.clear();
            else
              req = store.delete(makeIDBKeyRange(range));
          } else {
            var _a4 = isAddOrPut ? outbound ? [values, keys$$1] : [values, null] : [keys$$1, null], args1 = _a4[0], args2 = _a4[1];
            if (isAddOrPut) {
              for (var i = 0; i < length; ++i) {
                req = args2 && args2[i] !== void 0 ? store[type](args1[i], args2[i]) : store[type](args1[i]);
                req._reqno = i;
                if (results && results[i] === void 0) {
                  req.onsuccess = setResult;
                }
                req.onerror = errorHandler;
              }
            } else {
              for (var i = 0; i < length; ++i) {
                req = store[type](args1[i]);
                req._reqno = i;
                req.onerror = errorHandler;
              }
            }
          }
          var done = function(event9) {
            var lastResult = event9.target.result;
            if (results)
              results[length - 1] = lastResult;
            resolve3({
              numFailures,
              failures,
              results,
              lastResult
            });
          };
          req.onerror = function(event9) {
            errorHandler(event9);
            done(event9);
          };
          req.onsuccess = done;
        });
      }
      function openCursor2(_a3) {
        var trans = _a3.trans, values = _a3.values, query2 = _a3.query, reverse = _a3.reverse, unique = _a3.unique;
        return new Promise(function(resolve3, reject) {
          resolve3 = wrap(resolve3);
          var index = query2.index, range = query2.range;
          var store = trans.objectStore(tableName);
          var source = index.isPrimaryKey ? store : store.index(index.name);
          var direction = reverse ? unique ? "prevunique" : "prev" : unique ? "nextunique" : "next";
          var req = values || !("openKeyCursor" in source) ? source.openCursor(makeIDBKeyRange(range), direction) : source.openKeyCursor(makeIDBKeyRange(range), direction);
          req.onerror = eventRejectHandler(reject);
          req.onsuccess = wrap(function(ev) {
            var cursor = req.result;
            if (!cursor) {
              resolve3(null);
              return;
            }
            cursor.___id = ++_id_counter;
            cursor.done = false;
            var _cursorContinue = cursor.continue.bind(cursor);
            var _cursorContinuePrimaryKey = cursor.continuePrimaryKey;
            if (_cursorContinuePrimaryKey)
              _cursorContinuePrimaryKey = _cursorContinuePrimaryKey.bind(cursor);
            var _cursorAdvance = cursor.advance.bind(cursor);
            var doThrowCursorIsNotStarted = function() {
              throw new Error("Cursor not started");
            };
            var doThrowCursorIsStopped = function() {
              throw new Error("Cursor not stopped");
            };
            cursor.trans = trans;
            cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsNotStarted;
            cursor.fail = wrap(reject);
            cursor.next = function() {
              var _this = this;
              var gotOne = 1;
              return this.start(function() {
                return gotOne-- ? _this.continue() : _this.stop();
              }).then(function() {
                return _this;
              });
            };
            cursor.start = function(callback) {
              var iterationPromise = new Promise(function(resolveIteration, rejectIteration) {
                resolveIteration = wrap(resolveIteration);
                req.onerror = eventRejectHandler(rejectIteration);
                cursor.fail = rejectIteration;
                cursor.stop = function(value) {
                  cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsStopped;
                  resolveIteration(value);
                };
              });
              var guardedCallback = function() {
                if (req.result) {
                  try {
                    callback();
                  } catch (err) {
                    cursor.fail(err);
                  }
                } else {
                  cursor.done = true;
                  cursor.start = function() {
                    throw new Error("Cursor behind last entry");
                  };
                  cursor.stop();
                }
              };
              req.onsuccess = wrap(function(ev2) {
                req.onsuccess = guardedCallback;
                guardedCallback();
              });
              cursor.continue = _cursorContinue;
              cursor.continuePrimaryKey = _cursorContinuePrimaryKey;
              cursor.advance = _cursorAdvance;
              guardedCallback();
              return iterationPromise;
            };
            resolve3(cursor);
          }, reject);
        });
      }
      function query(hasGetAll2) {
        return function(request) {
          return new Promise(function(resolve3, reject) {
            resolve3 = wrap(resolve3);
            var trans = request.trans, values = request.values, limit = request.limit, query2 = request.query;
            var nonInfinitLimit = limit === Infinity ? void 0 : limit;
            var index = query2.index, range = query2.range;
            var store = trans.objectStore(tableName);
            var source = index.isPrimaryKey ? store : store.index(index.name);
            var idbKeyRange = makeIDBKeyRange(range);
            if (limit === 0)
              return resolve3({result: []});
            if (hasGetAll2) {
              var req = values ? source.getAll(idbKeyRange, nonInfinitLimit) : source.getAllKeys(idbKeyRange, nonInfinitLimit);
              req.onsuccess = function(event9) {
                return resolve3({result: event9.target.result});
              };
              req.onerror = eventRejectHandler(reject);
            } else {
              var count_1 = 0;
              var req_1 = values || !("openKeyCursor" in source) ? source.openCursor(idbKeyRange) : source.openKeyCursor(idbKeyRange);
              var result_1 = [];
              req_1.onsuccess = function(event9) {
                var cursor = req_1.result;
                if (!cursor)
                  return resolve3({result: result_1});
                result_1.push(values ? cursor.value : cursor.primaryKey);
                if (++count_1 === limit)
                  return resolve3({result: result_1});
                cursor.continue();
              };
              req_1.onerror = eventRejectHandler(reject);
            }
          });
        };
      }
      return {
        name: tableName,
        schema: tableSchema,
        mutate,
        getMany: function(_a3) {
          var trans = _a3.trans, keys$$1 = _a3.keys;
          return new Promise(function(resolve3, reject) {
            resolve3 = wrap(resolve3);
            var store = trans.objectStore(tableName);
            var length = keys$$1.length;
            var result = new Array(length);
            var keyCount = 0;
            var callbackCount = 0;
            var valueCount = 0;
            var req;
            var successHandler = function(event9) {
              var req2 = event9.target;
              if ((result[req2._pos] = req2.result) != null)
                ++valueCount;
              if (++callbackCount === keyCount)
                resolve3(result);
            };
            var errorHandler = eventRejectHandler(reject);
            for (var i = 0; i < length; ++i) {
              var key = keys$$1[i];
              if (key != null) {
                req = store.get(keys$$1[i]);
                req._pos = i;
                req.onsuccess = successHandler;
                req.onerror = errorHandler;
                ++keyCount;
              }
            }
            if (keyCount === 0)
              resolve3(result);
          });
        },
        get: function(_a3) {
          var trans = _a3.trans, key = _a3.key;
          return new Promise(function(resolve3, reject) {
            resolve3 = wrap(resolve3);
            var store = trans.objectStore(tableName);
            var req = store.get(key);
            req.onsuccess = function(event9) {
              return resolve3(event9.target.result);
            };
            req.onerror = eventRejectHandler(reject);
          });
        },
        query: query(hasGetAll),
        openCursor: openCursor2,
        count: function(_a3) {
          var query2 = _a3.query, trans = _a3.trans;
          var index = query2.index, range = query2.range;
          return new Promise(function(resolve3, reject) {
            var store = trans.objectStore(tableName);
            var source = index.isPrimaryKey ? store : store.index(index.name);
            var idbKeyRange = makeIDBKeyRange(range);
            var req = idbKeyRange ? source.count(idbKeyRange) : source.count();
            req.onsuccess = wrap(function(ev) {
              return resolve3(ev.target.result);
            });
            req.onerror = eventRejectHandler(reject);
          });
        }
      };
    }
    var _a2 = extractSchema(db, tmpTrans), schema = _a2.schema, hasGetAll = _a2.hasGetAll;
    var tables = schema.tables.map(function(tableSchema) {
      return createDbCoreTable(tableSchema);
    });
    var tableMap = {};
    tables.forEach(function(table) {
      return tableMap[table.name] = table;
    });
    return {
      stack: "dbcore",
      transaction: db.transaction.bind(db),
      table: function(name) {
        var result = tableMap[name];
        if (!result)
          throw new Error("Table '" + name + "' not found");
        return tableMap[name];
      },
      cmp: cmp2,
      MIN_KEY: -Infinity,
      MAX_KEY: getMaxKey(IdbKeyRange),
      schema
    };
  }
  function createMiddlewareStack(stackImpl, middlewares) {
    return middlewares.reduce(function(down, _a2) {
      var create = _a2.create;
      return __assign(__assign({}, down), create(down));
    }, stackImpl);
  }
  function createMiddlewareStacks(middlewares, idbdb, _a2, tmpTrans) {
    var IDBKeyRange = _a2.IDBKeyRange, indexedDB = _a2.indexedDB;
    var dbcore = createMiddlewareStack(createDBCore(idbdb, indexedDB, IDBKeyRange, tmpTrans), middlewares.dbcore);
    return {
      dbcore
    };
  }
  function generateMiddlewareStacks(db, tmpTrans) {
    var idbdb = tmpTrans.db;
    var stacks = createMiddlewareStacks(db._middlewares, idbdb, db._deps, tmpTrans);
    db.core = stacks.dbcore;
    db.tables.forEach(function(table) {
      var tableName = table.name;
      if (db.core.schema.tables.some(function(tbl) {
        return tbl.name === tableName;
      })) {
        table.core = db.core.table(tableName);
        if (db[tableName] instanceof db.Table) {
          db[tableName].core = table.core;
        }
      }
    });
  }
  function setApiOnPlace(db, objs, tableNames, dbschema) {
    tableNames.forEach(function(tableName) {
      var schema = dbschema[tableName];
      objs.forEach(function(obj2) {
        if (!(tableName in obj2)) {
          if (obj2 === db.Transaction.prototype || obj2 instanceof db.Transaction) {
            setProp(obj2, tableName, {
              get: function() {
                return this.table(tableName);
              },
              set: function(value) {
                defineProperty(this, tableName, {value, writable: true, configurable: true, enumerable: true});
              }
            });
          } else {
            obj2[tableName] = new db.Table(tableName, schema);
          }
        }
      });
    });
  }
  function removeTablesApi(db, objs) {
    objs.forEach(function(obj2) {
      for (var key in obj2) {
        if (obj2[key] instanceof db.Table)
          delete obj2[key];
      }
    });
  }
  function lowerVersionFirst(a, b) {
    return a._cfg.version - b._cfg.version;
  }
  function runUpgraders(db, oldVersion, idbUpgradeTrans, reject) {
    var globalSchema = db._dbSchema;
    var trans = db._createTransaction("readwrite", db._storeNames, globalSchema);
    trans.create(idbUpgradeTrans);
    trans._completion.catch(reject);
    var rejectTransaction = trans._reject.bind(trans);
    var transless = PSD.transless || PSD;
    newScope(function() {
      PSD.trans = trans;
      PSD.transless = transless;
      if (oldVersion === 0) {
        keys(globalSchema).forEach(function(tableName) {
          createTable(idbUpgradeTrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
        });
        generateMiddlewareStacks(db, idbUpgradeTrans);
        DexiePromise.follow(function() {
          return db.on.populate.fire(trans);
        }).catch(rejectTransaction);
      } else
        updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans).catch(rejectTransaction);
    });
  }
  function updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans) {
    var queue = [];
    var versions = db._versions;
    var globalSchema = db._dbSchema = buildGlobalSchema(db, db.idbdb, idbUpgradeTrans);
    var anyContentUpgraderHasRun = false;
    var versToRun = versions.filter(function(v) {
      return v._cfg.version >= oldVersion;
    });
    versToRun.forEach(function(version) {
      queue.push(function() {
        var oldSchema = globalSchema;
        var newSchema = version._cfg.dbschema;
        adjustToExistingIndexNames(db, oldSchema, idbUpgradeTrans);
        adjustToExistingIndexNames(db, newSchema, idbUpgradeTrans);
        globalSchema = db._dbSchema = newSchema;
        var diff = getSchemaDiff(oldSchema, newSchema);
        diff.add.forEach(function(tuple) {
          createTable(idbUpgradeTrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
        });
        diff.change.forEach(function(change) {
          if (change.recreate) {
            throw new exceptions.Upgrade("Not yet support for changing primary key");
          } else {
            var store_1 = idbUpgradeTrans.objectStore(change.name);
            change.add.forEach(function(idx) {
              return addIndex(store_1, idx);
            });
            change.change.forEach(function(idx) {
              store_1.deleteIndex(idx.name);
              addIndex(store_1, idx);
            });
            change.del.forEach(function(idxName) {
              return store_1.deleteIndex(idxName);
            });
          }
        });
        var contentUpgrade = version._cfg.contentUpgrade;
        if (contentUpgrade && version._cfg.version > oldVersion) {
          generateMiddlewareStacks(db, idbUpgradeTrans);
          anyContentUpgraderHasRun = true;
          var upgradeSchema_1 = shallowClone(newSchema);
          diff.del.forEach(function(table) {
            upgradeSchema_1[table] = oldSchema[table];
          });
          removeTablesApi(db, [db.Transaction.prototype]);
          setApiOnPlace(db, [db.Transaction.prototype], keys(upgradeSchema_1), upgradeSchema_1);
          trans.schema = upgradeSchema_1;
          var contentUpgradeIsAsync_1 = isAsyncFunction(contentUpgrade);
          if (contentUpgradeIsAsync_1) {
            incrementExpectedAwaits();
          }
          var returnValue_1;
          var promiseFollowed = DexiePromise.follow(function() {
            returnValue_1 = contentUpgrade(trans);
            if (returnValue_1) {
              if (contentUpgradeIsAsync_1) {
                var decrementor = decrementExpectedAwaits.bind(null, null);
                returnValue_1.then(decrementor, decrementor);
              }
            }
          });
          return returnValue_1 && typeof returnValue_1.then === "function" ? DexiePromise.resolve(returnValue_1) : promiseFollowed.then(function() {
            return returnValue_1;
          });
        }
      });
      queue.push(function(idbtrans) {
        if (!anyContentUpgraderHasRun || !hasIEDeleteObjectStoreBug) {
          var newSchema = version._cfg.dbschema;
          deleteRemovedTables(newSchema, idbtrans);
        }
        removeTablesApi(db, [db.Transaction.prototype]);
        setApiOnPlace(db, [db.Transaction.prototype], db._storeNames, db._dbSchema);
        trans.schema = db._dbSchema;
      });
    });
    function runQueue() {
      return queue.length ? DexiePromise.resolve(queue.shift()(trans.idbtrans)).then(runQueue) : DexiePromise.resolve();
    }
    return runQueue().then(function() {
      createMissingTables(globalSchema, idbUpgradeTrans);
    });
  }
  function getSchemaDiff(oldSchema, newSchema) {
    var diff = {
      del: [],
      add: [],
      change: []
    };
    var table;
    for (table in oldSchema) {
      if (!newSchema[table])
        diff.del.push(table);
    }
    for (table in newSchema) {
      var oldDef = oldSchema[table], newDef = newSchema[table];
      if (!oldDef) {
        diff.add.push([table, newDef]);
      } else {
        var change = {
          name: table,
          def: newDef,
          recreate: false,
          del: [],
          add: [],
          change: []
        };
        if (oldDef.primKey.src !== newDef.primKey.src && !isIEOrEdge) {
          change.recreate = true;
          diff.change.push(change);
        } else {
          var oldIndexes = oldDef.idxByName;
          var newIndexes = newDef.idxByName;
          var idxName = void 0;
          for (idxName in oldIndexes) {
            if (!newIndexes[idxName])
              change.del.push(idxName);
          }
          for (idxName in newIndexes) {
            var oldIdx = oldIndexes[idxName], newIdx = newIndexes[idxName];
            if (!oldIdx)
              change.add.push(newIdx);
            else if (oldIdx.src !== newIdx.src)
              change.change.push(newIdx);
          }
          if (change.del.length > 0 || change.add.length > 0 || change.change.length > 0) {
            diff.change.push(change);
          }
        }
      }
    }
    return diff;
  }
  function createTable(idbtrans, tableName, primKey, indexes) {
    var store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ? {keyPath: primKey.keyPath, autoIncrement: primKey.auto} : {autoIncrement: primKey.auto});
    indexes.forEach(function(idx) {
      return addIndex(store, idx);
    });
    return store;
  }
  function createMissingTables(newSchema, idbtrans) {
    keys(newSchema).forEach(function(tableName) {
      if (!idbtrans.db.objectStoreNames.contains(tableName)) {
        createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
      }
    });
  }
  function deleteRemovedTables(newSchema, idbtrans) {
    for (var i = 0; i < idbtrans.db.objectStoreNames.length; ++i) {
      var storeName = idbtrans.db.objectStoreNames[i];
      if (newSchema[storeName] == null) {
        idbtrans.db.deleteObjectStore(storeName);
      }
    }
  }
  function addIndex(store, idx) {
    store.createIndex(idx.name, idx.keyPath, {unique: idx.unique, multiEntry: idx.multi});
  }
  function buildGlobalSchema(db, idbdb, tmpTrans) {
    var globalSchema = {};
    var dbStoreNames = slice(idbdb.objectStoreNames, 0);
    dbStoreNames.forEach(function(storeName) {
      var store = tmpTrans.objectStore(storeName);
      var keyPath = store.keyPath;
      var primKey = createIndexSpec(nameFromKeyPath(keyPath), keyPath || "", false, false, !!store.autoIncrement, keyPath && typeof keyPath !== "string", true);
      var indexes = [];
      for (var j = 0; j < store.indexNames.length; ++j) {
        var idbindex = store.index(store.indexNames[j]);
        keyPath = idbindex.keyPath;
        var index = createIndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== "string", false);
        indexes.push(index);
      }
      globalSchema[storeName] = createTableSchema(storeName, primKey, indexes);
    });
    return globalSchema;
  }
  function readGlobalSchema(db, idbdb, tmpTrans) {
    db.verno = idbdb.version / 10;
    var globalSchema = db._dbSchema = buildGlobalSchema(db, idbdb, tmpTrans);
    db._storeNames = slice(idbdb.objectStoreNames, 0);
    setApiOnPlace(db, [db._allTables], keys(globalSchema), globalSchema);
  }
  function adjustToExistingIndexNames(db, schema, idbtrans) {
    var storeNames = idbtrans.db.objectStoreNames;
    for (var i = 0; i < storeNames.length; ++i) {
      var storeName = storeNames[i];
      var store = idbtrans.objectStore(storeName);
      db._hasGetAll = "getAll" in store;
      for (var j = 0; j < store.indexNames.length; ++j) {
        var indexName = store.indexNames[j];
        var keyPath = store.index(indexName).keyPath;
        var dexieName = typeof keyPath === "string" ? keyPath : "[" + slice(keyPath).join("+") + "]";
        if (schema[storeName]) {
          var indexSpec = schema[storeName].idxByName[dexieName];
          if (indexSpec) {
            indexSpec.name = indexName;
            delete schema[storeName].idxByName[dexieName];
            schema[storeName].idxByName[indexName] = indexSpec;
          }
        }
      }
    }
    if (typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && _global.WorkerGlobalScope && _global instanceof _global.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) {
      db._hasGetAll = false;
    }
  }
  function parseIndexSyntax(primKeyAndIndexes) {
    return primKeyAndIndexes.split(",").map(function(index, indexNum) {
      index = index.trim();
      var name = index.replace(/([&*]|\+\+)/g, "");
      var keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split("+") : name;
      return createIndexSpec(name, keyPath || null, /\&/.test(index), /\*/.test(index), /\+\+/.test(index), isArray(keyPath), indexNum === 0);
    });
  }
  var Version = function() {
    function Version2() {
    }
    Version2.prototype._parseStoresSpec = function(stores, outSchema) {
      keys(stores).forEach(function(tableName) {
        if (stores[tableName] !== null) {
          var indexes = parseIndexSyntax(stores[tableName]);
          var primKey = indexes.shift();
          if (primKey.multi)
            throw new exceptions.Schema("Primary key cannot be multi-valued");
          indexes.forEach(function(idx) {
            if (idx.auto)
              throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
            if (!idx.keyPath)
              throw new exceptions.Schema("Index must have a name and cannot be an empty string");
          });
          outSchema[tableName] = createTableSchema(tableName, primKey, indexes);
        }
      });
    };
    Version2.prototype.stores = function(stores) {
      var db = this.db;
      this._cfg.storesSource = this._cfg.storesSource ? extend(this._cfg.storesSource, stores) : stores;
      var versions = db._versions;
      var storesSpec = {};
      var dbschema = {};
      versions.forEach(function(version) {
        extend(storesSpec, version._cfg.storesSource);
        dbschema = version._cfg.dbschema = {};
        version._parseStoresSpec(storesSpec, dbschema);
      });
      db._dbSchema = dbschema;
      removeTablesApi(db, [db._allTables, db, db.Transaction.prototype]);
      setApiOnPlace(db, [db._allTables, db, db.Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
      db._storeNames = keys(dbschema);
      return this;
    };
    Version2.prototype.upgrade = function(upgradeFunction) {
      this._cfg.contentUpgrade = upgradeFunction;
      return this;
    };
    return Version2;
  }();
  function createVersionConstructor(db) {
    return makeClassConstructor(Version.prototype, function Version$$1(versionNumber) {
      this.db = db;
      this._cfg = {
        version: versionNumber,
        storesSource: null,
        dbschema: {},
        tables: {},
        contentUpgrade: null
      };
    });
  }
  var databaseEnumerator;
  function DatabaseEnumerator(indexedDB) {
    var hasDatabasesNative = indexedDB && typeof indexedDB.databases === "function";
    var dbNamesTable;
    if (!hasDatabasesNative) {
      var db = new Dexie(DBNAMES_DB, {addons: []});
      db.version(1).stores({dbnames: "name"});
      dbNamesTable = db.table("dbnames");
    }
    return {
      getDatabaseNames: function() {
        return hasDatabasesNative ? DexiePromise.resolve(indexedDB.databases()).then(function(infos) {
          return infos.map(function(info) {
            return info.name;
          }).filter(function(name) {
            return name !== DBNAMES_DB;
          });
        }) : dbNamesTable.toCollection().primaryKeys();
      },
      add: function(name) {
        return !hasDatabasesNative && name !== DBNAMES_DB && dbNamesTable.put({name}).catch(nop);
      },
      remove: function(name) {
        return !hasDatabasesNative && name !== DBNAMES_DB && dbNamesTable.delete(name).catch(nop);
      }
    };
  }
  function initDatabaseEnumerator(indexedDB) {
    try {
      databaseEnumerator = DatabaseEnumerator(indexedDB);
    } catch (e) {
    }
  }
  function vip(fn) {
    return newScope(function() {
      PSD.letThrough = true;
      return fn();
    });
  }
  function dexieOpen(db) {
    var state = db._state;
    var indexedDB = db._deps.indexedDB;
    if (state.isBeingOpened || db.idbdb)
      return state.dbReadyPromise.then(function() {
        return state.dbOpenError ? rejection(state.dbOpenError) : db;
      });
    debug && (state.openCanceller._stackHolder = getErrorWithStack());
    state.isBeingOpened = true;
    state.dbOpenError = null;
    state.openComplete = false;
    var resolveDbReady = state.dbReadyResolve, upgradeTransaction = null;
    return DexiePromise.race([state.openCanceller, new DexiePromise(function(resolve3, reject) {
      if (!indexedDB)
        throw new exceptions.MissingAPI("indexedDB API not found. If using IE10+, make sure to run your code on a server URL (not locally). If using old Safari versions, make sure to include indexedDB polyfill.");
      var dbName = db.name;
      var req = state.autoSchema ? indexedDB.open(dbName) : indexedDB.open(dbName, Math.round(db.verno * 10));
      if (!req)
        throw new exceptions.MissingAPI("IndexedDB API not available");
      req.onerror = eventRejectHandler(reject);
      req.onblocked = wrap(db._fireOnBlocked);
      req.onupgradeneeded = wrap(function(e) {
        upgradeTransaction = req.transaction;
        if (state.autoSchema && !db._options.allowEmptyDB) {
          req.onerror = preventDefault;
          upgradeTransaction.abort();
          req.result.close();
          var delreq = indexedDB.deleteDatabase(dbName);
          delreq.onsuccess = delreq.onerror = wrap(function() {
            reject(new exceptions.NoSuchDatabase("Database " + dbName + " doesnt exist"));
          });
        } else {
          upgradeTransaction.onerror = eventRejectHandler(reject);
          var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion;
          db.idbdb = req.result;
          runUpgraders(db, oldVer / 10, upgradeTransaction, reject);
        }
      }, reject);
      req.onsuccess = wrap(function() {
        upgradeTransaction = null;
        var idbdb = db.idbdb = req.result;
        var objectStoreNames = slice(idbdb.objectStoreNames);
        if (objectStoreNames.length > 0)
          try {
            var tmpTrans = idbdb.transaction(safariMultiStoreFix(objectStoreNames), "readonly");
            if (state.autoSchema)
              readGlobalSchema(db, idbdb, tmpTrans);
            else
              adjustToExistingIndexNames(db, db._dbSchema, tmpTrans);
            generateMiddlewareStacks(db, tmpTrans);
          } catch (e) {
          }
        connections.push(db);
        idbdb.onversionchange = wrap(function(ev) {
          state.vcFired = true;
          db.on("versionchange").fire(ev);
        });
        databaseEnumerator.add(dbName);
        resolve3();
      }, reject);
    })]).then(function() {
      state.onReadyBeingFired = [];
      return DexiePromise.resolve(vip(db.on.ready.fire)).then(function fireRemainders() {
        if (state.onReadyBeingFired.length > 0) {
          var remainders = state.onReadyBeingFired.reduce(promisableChain, nop);
          state.onReadyBeingFired = [];
          return DexiePromise.resolve(vip(remainders)).then(fireRemainders);
        }
      });
    }).finally(function() {
      state.onReadyBeingFired = null;
    }).then(function() {
      state.isBeingOpened = false;
      return db;
    }).catch(function(err) {
      try {
        upgradeTransaction && upgradeTransaction.abort();
      } catch (e) {
      }
      state.isBeingOpened = false;
      db.close();
      state.dbOpenError = err;
      return rejection(state.dbOpenError);
    }).finally(function() {
      state.openComplete = true;
      resolveDbReady();
    });
  }
  function awaitIterator(iterator) {
    var callNext = function(result) {
      return iterator.next(result);
    }, doThrow = function(error) {
      return iterator.throw(error);
    }, onSuccess = step(callNext), onError = step(doThrow);
    function step(getNext) {
      return function(val) {
        var next = getNext(val), value = next.value;
        return next.done ? value : !value || typeof value.then !== "function" ? isArray(value) ? Promise.all(value).then(onSuccess, onError) : onSuccess(value) : value.then(onSuccess, onError);
      };
    }
    return step(callNext)();
  }
  function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
    var i = arguments.length;
    if (i < 2)
      throw new exceptions.InvalidArgument("Too few arguments");
    var args = new Array(i - 1);
    while (--i)
      args[i - 1] = arguments[i];
    scopeFunc = args.pop();
    var tables = flatten(args);
    return [mode, tables, scopeFunc];
  }
  function enterTransactionScope(db, mode, storeNames, parentTransaction, scopeFunc) {
    return DexiePromise.resolve().then(function() {
      var transless = PSD.transless || PSD;
      var trans = db._createTransaction(mode, storeNames, db._dbSchema, parentTransaction);
      var zoneProps = {
        trans,
        transless
      };
      if (parentTransaction) {
        trans.idbtrans = parentTransaction.idbtrans;
      } else {
        trans.create();
      }
      var scopeFuncIsAsync = isAsyncFunction(scopeFunc);
      if (scopeFuncIsAsync) {
        incrementExpectedAwaits();
      }
      var returnValue;
      var promiseFollowed = DexiePromise.follow(function() {
        returnValue = scopeFunc.call(trans, trans);
        if (returnValue) {
          if (scopeFuncIsAsync) {
            var decrementor = decrementExpectedAwaits.bind(null, null);
            returnValue.then(decrementor, decrementor);
          } else if (typeof returnValue.next === "function" && typeof returnValue.throw === "function") {
            returnValue = awaitIterator(returnValue);
          }
        }
      }, zoneProps);
      return (returnValue && typeof returnValue.then === "function" ? DexiePromise.resolve(returnValue).then(function(x) {
        return trans.active ? x : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
      }) : promiseFollowed.then(function() {
        return returnValue;
      })).then(function(x) {
        if (parentTransaction)
          trans._resolve();
        return trans._completion.then(function() {
          return x;
        });
      }).catch(function(e) {
        trans._reject(e);
        return rejection(e);
      });
    });
  }
  function pad(a, value, count) {
    var result = isArray(a) ? a.slice() : [a];
    for (var i = 0; i < count; ++i)
      result.push(value);
    return result;
  }
  function createVirtualIndexMiddleware(down) {
    return __assign(__assign({}, down), {table: function(tableName) {
      var table = down.table(tableName);
      var schema = table.schema;
      var indexLookup = {};
      var allVirtualIndexes = [];
      function addVirtualIndexes(keyPath, keyTail, lowLevelIndex) {
        var keyPathAlias = getKeyPathAlias(keyPath);
        var indexList = indexLookup[keyPathAlias] = indexLookup[keyPathAlias] || [];
        var keyLength = keyPath == null ? 0 : typeof keyPath === "string" ? 1 : keyPath.length;
        var isVirtual = keyTail > 0;
        var virtualIndex = __assign(__assign({}, lowLevelIndex), {
          isVirtual,
          isPrimaryKey: !isVirtual && lowLevelIndex.isPrimaryKey,
          keyTail,
          keyLength,
          extractKey: getKeyExtractor(keyPath),
          unique: !isVirtual && lowLevelIndex.unique
        });
        indexList.push(virtualIndex);
        if (!virtualIndex.isPrimaryKey) {
          allVirtualIndexes.push(virtualIndex);
        }
        if (keyLength > 1) {
          var virtualKeyPath = keyLength === 2 ? keyPath[0] : keyPath.slice(0, keyLength - 1);
          addVirtualIndexes(virtualKeyPath, keyTail + 1, lowLevelIndex);
        }
        indexList.sort(function(a, b) {
          return a.keyTail - b.keyTail;
        });
        return virtualIndex;
      }
      var primaryKey = addVirtualIndexes(schema.primaryKey.keyPath, 0, schema.primaryKey);
      indexLookup[":id"] = [primaryKey];
      for (var _i = 0, _a2 = schema.indexes; _i < _a2.length; _i++) {
        var index = _a2[_i];
        addVirtualIndexes(index.keyPath, 0, index);
      }
      function findBestIndex(keyPath) {
        var result2 = indexLookup[getKeyPathAlias(keyPath)];
        return result2 && result2[0];
      }
      function translateRange(range, keyTail) {
        return {
          type: range.type === 1 ? 2 : range.type,
          lower: pad(range.lower, range.lowerOpen ? down.MAX_KEY : down.MIN_KEY, keyTail),
          lowerOpen: true,
          upper: pad(range.upper, range.upperOpen ? down.MIN_KEY : down.MAX_KEY, keyTail),
          upperOpen: true
        };
      }
      function translateRequest(req) {
        var index2 = req.query.index;
        return index2.isVirtual ? __assign(__assign({}, req), {query: {
          index: index2,
          range: translateRange(req.query.range, index2.keyTail)
        }}) : req;
      }
      var result = __assign(__assign({}, table), {
        schema: __assign(__assign({}, schema), {primaryKey, indexes: allVirtualIndexes, getIndexByKeyPath: findBestIndex}),
        count: function(req) {
          return table.count(translateRequest(req));
        },
        query: function(req) {
          return table.query(translateRequest(req));
        },
        openCursor: function(req) {
          var _a3 = req.query.index, keyTail = _a3.keyTail, isVirtual = _a3.isVirtual, keyLength = _a3.keyLength;
          if (!isVirtual)
            return table.openCursor(req);
          function createVirtualCursor(cursor) {
            function _continue(key) {
              key != null ? cursor.continue(pad(key, req.reverse ? down.MAX_KEY : down.MIN_KEY, keyTail)) : req.unique ? cursor.continue(pad(cursor.key, req.reverse ? down.MIN_KEY : down.MAX_KEY, keyTail)) : cursor.continue();
            }
            var virtualCursor = Object.create(cursor, {
              continue: {value: _continue},
              continuePrimaryKey: {
                value: function(key, primaryKey2) {
                  cursor.continuePrimaryKey(pad(key, down.MAX_KEY, keyTail), primaryKey2);
                }
              },
              key: {
                get: function() {
                  var key = cursor.key;
                  return keyLength === 1 ? key[0] : key.slice(0, keyLength);
                }
              },
              value: {
                get: function() {
                  return cursor.value;
                }
              }
            });
            return virtualCursor;
          }
          return table.openCursor(translateRequest(req)).then(function(cursor) {
            return cursor && createVirtualCursor(cursor);
          });
        }
      });
      return result;
    }});
  }
  var virtualIndexMiddleware = {
    stack: "dbcore",
    name: "VirtualIndexMiddleware",
    level: 1,
    create: createVirtualIndexMiddleware
  };
  var hooksMiddleware = {
    stack: "dbcore",
    name: "HooksMiddleware",
    level: 2,
    create: function(downCore) {
      return __assign(__assign({}, downCore), {table: function(tableName) {
        var downTable = downCore.table(tableName);
        var primaryKey = downTable.schema.primaryKey;
        var tableMiddleware = __assign(__assign({}, downTable), {mutate: function(req) {
          var dxTrans = PSD.trans;
          var _a2 = dxTrans.table(tableName).hook, deleting = _a2.deleting, creating = _a2.creating, updating = _a2.updating;
          switch (req.type) {
            case "add":
              if (creating.fire === nop)
                break;
              return dxTrans._promise("readwrite", function() {
                return addPutOrDelete(req);
              }, true);
            case "put":
              if (creating.fire === nop && updating.fire === nop)
                break;
              return dxTrans._promise("readwrite", function() {
                return addPutOrDelete(req);
              }, true);
            case "delete":
              if (deleting.fire === nop)
                break;
              return dxTrans._promise("readwrite", function() {
                return addPutOrDelete(req);
              }, true);
            case "deleteRange":
              if (deleting.fire === nop)
                break;
              return dxTrans._promise("readwrite", function() {
                return deleteRange(req);
              }, true);
          }
          return downTable.mutate(req);
          function addPutOrDelete(req2) {
            var dxTrans2 = PSD.trans;
            var keys$$1 = req2.keys || getEffectiveKeys(primaryKey, req2);
            if (!keys$$1)
              throw new Error("Keys missing");
            req2 = req2.type === "add" || req2.type === "put" ? __assign(__assign({}, req2), {keys: keys$$1, wantResults: true}) : __assign({}, req2);
            if (req2.type !== "delete")
              req2.values = __spreadArrays(req2.values);
            if (req2.keys)
              req2.keys = __spreadArrays(req2.keys);
            return getExistingValues(downTable, req2, keys$$1).then(function(existingValues) {
              var contexts = keys$$1.map(function(key, i) {
                var existingValue = existingValues[i];
                var ctx = {onerror: null, onsuccess: null};
                if (req2.type === "delete") {
                  deleting.fire.call(ctx, key, existingValue, dxTrans2);
                } else if (req2.type === "add" || existingValue === void 0) {
                  var generatedPrimaryKey = creating.fire.call(ctx, key, req2.values[i], dxTrans2);
                  if (key == null && generatedPrimaryKey != null) {
                    key = generatedPrimaryKey;
                    req2.keys[i] = key;
                    if (!primaryKey.outbound) {
                      setByKeyPath(req2.values[i], primaryKey.keyPath, key);
                    }
                  }
                } else {
                  var objectDiff = getObjectDiff(existingValue, req2.values[i]);
                  var additionalChanges_1 = updating.fire.call(ctx, objectDiff, key, existingValue, dxTrans2);
                  if (additionalChanges_1) {
                    var requestedValue_1 = req2.values[i];
                    Object.keys(additionalChanges_1).forEach(function(keyPath) {
                      setByKeyPath(requestedValue_1, keyPath, additionalChanges_1[keyPath]);
                    });
                  }
                }
                return ctx;
              });
              return downTable.mutate(req2).then(function(_a3) {
                var failures = _a3.failures, results = _a3.results, numFailures = _a3.numFailures, lastResult = _a3.lastResult;
                for (var i = 0; i < keys$$1.length; ++i) {
                  var primKey = results ? results[i] : keys$$1[i];
                  var ctx = contexts[i];
                  if (primKey == null) {
                    ctx.onerror && ctx.onerror(failures[i]);
                  } else {
                    ctx.onsuccess && ctx.onsuccess(req2.type === "put" && existingValues[i] ? req2.values[i] : primKey);
                  }
                }
                return {failures, results, numFailures, lastResult};
              }).catch(function(error) {
                contexts.forEach(function(ctx) {
                  return ctx.onerror && ctx.onerror(error);
                });
                return Promise.reject(error);
              });
            });
          }
          function deleteRange(req2) {
            return deleteNextChunk(req2.trans, req2.range, 1e4);
          }
          function deleteNextChunk(trans, range, limit) {
            return downTable.query({trans, values: false, query: {index: primaryKey, range}, limit}).then(function(_a3) {
              var result = _a3.result;
              return addPutOrDelete({type: "delete", keys: result, trans}).then(function(res2) {
                if (res2.numFailures > 0)
                  return Promise.reject(res2.failures[0]);
                if (result.length < limit) {
                  return {failures: [], numFailures: 0, lastResult: void 0};
                } else {
                  return deleteNextChunk(trans, __assign(__assign({}, range), {lower: result[result.length - 1], lowerOpen: true}), limit);
                }
              });
            });
          }
        }});
        return tableMiddleware;
      }});
    }
  };
  var Dexie = function() {
    function Dexie2(name, options) {
      var _this = this;
      this._middlewares = {};
      this.verno = 0;
      var deps = Dexie2.dependencies;
      this._options = options = __assign({
        addons: Dexie2.addons,
        autoOpen: true,
        indexedDB: deps.indexedDB,
        IDBKeyRange: deps.IDBKeyRange
      }, options);
      this._deps = {
        indexedDB: options.indexedDB,
        IDBKeyRange: options.IDBKeyRange
      };
      var addons = options.addons;
      this._dbSchema = {};
      this._versions = [];
      this._storeNames = [];
      this._allTables = {};
      this.idbdb = null;
      var state = {
        dbOpenError: null,
        isBeingOpened: false,
        onReadyBeingFired: null,
        openComplete: false,
        dbReadyResolve: nop,
        dbReadyPromise: null,
        cancelOpen: nop,
        openCanceller: null,
        autoSchema: true
      };
      state.dbReadyPromise = new DexiePromise(function(resolve3) {
        state.dbReadyResolve = resolve3;
      });
      state.openCanceller = new DexiePromise(function(_, reject) {
        state.cancelOpen = reject;
      });
      this._state = state;
      this.name = name;
      this.on = Events(this, "populate", "blocked", "versionchange", {ready: [promisableChain, nop]});
      this.on.ready.subscribe = override(this.on.ready.subscribe, function(subscribe) {
        return function(subscriber, bSticky) {
          Dexie2.vip(function() {
            var state2 = _this._state;
            if (state2.openComplete) {
              if (!state2.dbOpenError)
                DexiePromise.resolve().then(subscriber);
              if (bSticky)
                subscribe(subscriber);
            } else if (state2.onReadyBeingFired) {
              state2.onReadyBeingFired.push(subscriber);
              if (bSticky)
                subscribe(subscriber);
            } else {
              subscribe(subscriber);
              var db_1 = _this;
              if (!bSticky)
                subscribe(function unsubscribe() {
                  db_1.on.ready.unsubscribe(subscriber);
                  db_1.on.ready.unsubscribe(unsubscribe);
                });
            }
          });
        };
      });
      this.Collection = createCollectionConstructor(this);
      this.Table = createTableConstructor(this);
      this.Transaction = createTransactionConstructor(this);
      this.Version = createVersionConstructor(this);
      this.WhereClause = createWhereClauseConstructor(this);
      this.on("versionchange", function(ev) {
        if (ev.newVersion > 0)
          console.warn("Another connection wants to upgrade database '" + _this.name + "'. Closing db now to resume the upgrade.");
        else
          console.warn("Another connection wants to delete database '" + _this.name + "'. Closing db now to resume the delete request.");
        _this.close();
      });
      this.on("blocked", function(ev) {
        if (!ev.newVersion || ev.newVersion < ev.oldVersion)
          console.warn("Dexie.delete('" + _this.name + "') was blocked");
        else
          console.warn("Upgrade '" + _this.name + "' blocked by other connection holding version " + ev.oldVersion / 10);
      });
      this._maxKey = getMaxKey(options.IDBKeyRange);
      this._createTransaction = function(mode, storeNames, dbschema, parentTransaction) {
        return new _this.Transaction(mode, storeNames, dbschema, parentTransaction);
      };
      this._fireOnBlocked = function(ev) {
        _this.on("blocked").fire(ev);
        connections.filter(function(c2) {
          return c2.name === _this.name && c2 !== _this && !c2._state.vcFired;
        }).map(function(c2) {
          return c2.on("versionchange").fire(ev);
        });
      };
      this.use(virtualIndexMiddleware);
      this.use(hooksMiddleware);
      addons.forEach(function(addon) {
        return addon(_this);
      });
    }
    Dexie2.prototype.version = function(versionNumber) {
      if (isNaN(versionNumber) || versionNumber < 0.1)
        throw new exceptions.Type("Given version is not a positive number");
      versionNumber = Math.round(versionNumber * 10) / 10;
      if (this.idbdb || this._state.isBeingOpened)
        throw new exceptions.Schema("Cannot add version when database is open");
      this.verno = Math.max(this.verno, versionNumber);
      var versions = this._versions;
      var versionInstance = versions.filter(function(v) {
        return v._cfg.version === versionNumber;
      })[0];
      if (versionInstance)
        return versionInstance;
      versionInstance = new this.Version(versionNumber);
      versions.push(versionInstance);
      versions.sort(lowerVersionFirst);
      versionInstance.stores({});
      this._state.autoSchema = false;
      return versionInstance;
    };
    Dexie2.prototype._whenReady = function(fn) {
      var _this = this;
      return this._state.openComplete || PSD.letThrough ? fn() : new DexiePromise(function(resolve3, reject) {
        if (!_this._state.isBeingOpened) {
          if (!_this._options.autoOpen) {
            reject(new exceptions.DatabaseClosed());
            return;
          }
          _this.open().catch(nop);
        }
        _this._state.dbReadyPromise.then(resolve3, reject);
      }).then(fn);
    };
    Dexie2.prototype.use = function(_a2) {
      var stack = _a2.stack, create = _a2.create, level = _a2.level, name = _a2.name;
      if (name)
        this.unuse({stack, name});
      var middlewares = this._middlewares[stack] || (this._middlewares[stack] = []);
      middlewares.push({stack, create, level: level == null ? 10 : level, name});
      middlewares.sort(function(a, b) {
        return a.level - b.level;
      });
      return this;
    };
    Dexie2.prototype.unuse = function(_a2) {
      var stack = _a2.stack, name = _a2.name, create = _a2.create;
      if (stack && this._middlewares[stack]) {
        this._middlewares[stack] = this._middlewares[stack].filter(function(mw) {
          return create ? mw.create !== create : name ? mw.name !== name : false;
        });
      }
      return this;
    };
    Dexie2.prototype.open = function() {
      return dexieOpen(this);
    };
    Dexie2.prototype.close = function() {
      var idx = connections.indexOf(this), state = this._state;
      if (idx >= 0)
        connections.splice(idx, 1);
      if (this.idbdb) {
        try {
          this.idbdb.close();
        } catch (e) {
        }
        this.idbdb = null;
      }
      this._options.autoOpen = false;
      state.dbOpenError = new exceptions.DatabaseClosed();
      if (state.isBeingOpened)
        state.cancelOpen(state.dbOpenError);
      state.dbReadyPromise = new DexiePromise(function(resolve3) {
        state.dbReadyResolve = resolve3;
      });
      state.openCanceller = new DexiePromise(function(_, reject) {
        state.cancelOpen = reject;
      });
    };
    Dexie2.prototype.delete = function() {
      var _this = this;
      var hasArguments = arguments.length > 0;
      var state = this._state;
      return new DexiePromise(function(resolve3, reject) {
        var doDelete = function() {
          _this.close();
          var req = _this._deps.indexedDB.deleteDatabase(_this.name);
          req.onsuccess = wrap(function() {
            databaseEnumerator.remove(_this.name);
            resolve3();
          });
          req.onerror = eventRejectHandler(reject);
          req.onblocked = _this._fireOnBlocked;
        };
        if (hasArguments)
          throw new exceptions.InvalidArgument("Arguments not allowed in db.delete()");
        if (state.isBeingOpened) {
          state.dbReadyPromise.then(doDelete);
        } else {
          doDelete();
        }
      });
    };
    Dexie2.prototype.backendDB = function() {
      return this.idbdb;
    };
    Dexie2.prototype.isOpen = function() {
      return this.idbdb !== null;
    };
    Dexie2.prototype.hasBeenClosed = function() {
      var dbOpenError = this._state.dbOpenError;
      return dbOpenError && dbOpenError.name === "DatabaseClosed";
    };
    Dexie2.prototype.hasFailed = function() {
      return this._state.dbOpenError !== null;
    };
    Dexie2.prototype.dynamicallyOpened = function() {
      return this._state.autoSchema;
    };
    Object.defineProperty(Dexie2.prototype, "tables", {
      get: function() {
        var _this = this;
        return keys(this._allTables).map(function(name) {
          return _this._allTables[name];
        });
      },
      enumerable: true,
      configurable: true
    });
    Dexie2.prototype.transaction = function() {
      var args = extractTransactionArgs.apply(this, arguments);
      return this._transaction.apply(this, args);
    };
    Dexie2.prototype._transaction = function(mode, tables, scopeFunc) {
      var _this = this;
      var parentTransaction = PSD.trans;
      if (!parentTransaction || parentTransaction.db !== this || mode.indexOf("!") !== -1)
        parentTransaction = null;
      var onlyIfCompatible = mode.indexOf("?") !== -1;
      mode = mode.replace("!", "").replace("?", "");
      var idbMode, storeNames;
      try {
        storeNames = tables.map(function(table) {
          var storeName = table instanceof _this.Table ? table.name : table;
          if (typeof storeName !== "string")
            throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
          return storeName;
        });
        if (mode == "r" || mode === READONLY)
          idbMode = READONLY;
        else if (mode == "rw" || mode == READWRITE)
          idbMode = READWRITE;
        else
          throw new exceptions.InvalidArgument("Invalid transaction mode: " + mode);
        if (parentTransaction) {
          if (parentTransaction.mode === READONLY && idbMode === READWRITE) {
            if (onlyIfCompatible) {
              parentTransaction = null;
            } else
              throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
          }
          if (parentTransaction) {
            storeNames.forEach(function(storeName) {
              if (parentTransaction && parentTransaction.storeNames.indexOf(storeName) === -1) {
                if (onlyIfCompatible) {
                  parentTransaction = null;
                } else
                  throw new exceptions.SubTransaction("Table " + storeName + " not included in parent transaction.");
              }
            });
          }
          if (onlyIfCompatible && parentTransaction && !parentTransaction.active) {
            parentTransaction = null;
          }
        }
      } catch (e) {
        return parentTransaction ? parentTransaction._promise(null, function(_, reject) {
          reject(e);
        }) : rejection(e);
      }
      var enterTransaction = enterTransactionScope.bind(null, this, idbMode, storeNames, parentTransaction, scopeFunc);
      return parentTransaction ? parentTransaction._promise(idbMode, enterTransaction, "lock") : PSD.trans ? usePSD(PSD.transless, function() {
        return _this._whenReady(enterTransaction);
      }) : this._whenReady(enterTransaction);
    };
    Dexie2.prototype.table = function(tableName) {
      if (!hasOwn(this._allTables, tableName)) {
        throw new exceptions.InvalidTable("Table " + tableName + " does not exist");
      }
      return this._allTables[tableName];
    };
    return Dexie2;
  }();
  var Dexie$1 = Dexie;
  props(Dexie$1, __assign(__assign({}, fullNameExceptions), {
    delete: function(databaseName) {
      var db = new Dexie$1(databaseName);
      return db.delete();
    },
    exists: function(name) {
      return new Dexie$1(name, {addons: []}).open().then(function(db) {
        db.close();
        return true;
      }).catch("NoSuchDatabaseError", function() {
        return false;
      });
    },
    getDatabaseNames: function(cb) {
      return databaseEnumerator ? databaseEnumerator.getDatabaseNames().then(cb) : DexiePromise.resolve([]);
    },
    defineClass: function() {
      function Class(content) {
        extend(this, content);
      }
      return Class;
    },
    ignoreTransaction: function(scopeFunc) {
      return PSD.trans ? usePSD(PSD.transless, scopeFunc) : scopeFunc();
    },
    vip,
    async: function(generatorFn) {
      return function() {
        try {
          var rv = awaitIterator(generatorFn.apply(this, arguments));
          if (!rv || typeof rv.then !== "function")
            return DexiePromise.resolve(rv);
          return rv;
        } catch (e) {
          return rejection(e);
        }
      };
    },
    spawn: function(generatorFn, args, thiz) {
      try {
        var rv = awaitIterator(generatorFn.apply(thiz, args || []));
        if (!rv || typeof rv.then !== "function")
          return DexiePromise.resolve(rv);
        return rv;
      } catch (e) {
        return rejection(e);
      }
    },
    currentTransaction: {
      get: function() {
        return PSD.trans || null;
      }
    },
    waitFor: function(promiseOrFunction, optionalTimeout) {
      var promise = DexiePromise.resolve(typeof promiseOrFunction === "function" ? Dexie$1.ignoreTransaction(promiseOrFunction) : promiseOrFunction).timeout(optionalTimeout || 6e4);
      return PSD.trans ? PSD.trans.waitFor(promise) : promise;
    },
    Promise: DexiePromise,
    debug: {
      get: function() {
        return debug;
      },
      set: function(value) {
        setDebug(value, value === "dexie" ? function() {
          return true;
        } : dexieStackFrameFilter);
      }
    },
    derive,
    extend,
    props,
    override,
    Events,
    getByKeyPath,
    setByKeyPath,
    delByKeyPath,
    shallowClone,
    deepClone,
    getObjectDiff,
    asap,
    minKey,
    addons: [],
    connections,
    errnames,
    dependencies: function() {
      try {
        return {
          indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
          IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
        };
      } catch (e) {
        return {indexedDB: null, IDBKeyRange: null};
      }
    }(),
    semVer: DEXIE_VERSION,
    version: DEXIE_VERSION.split(".").map(function(n) {
      return parseInt(n);
    }).reduce(function(p2, c2, i) {
      return p2 + c2 / Math.pow(10, i * 2);
    }),
    default: Dexie$1,
    Dexie: Dexie$1
  }));
  Dexie$1.maxKey = getMaxKey(Dexie$1.dependencies.IDBKeyRange);
  initDatabaseEnumerator(Dexie.dependencies.indexedDB);
  DexiePromise.rejectionMapper = mapError;
  setDebug(debug, dexieStackFrameFilter);
  var dexie_default = Dexie;

  // node_modules/dexie-observable/dist/dexie-observable.es.js
  function nop2() {
  }
  function promisableChain2(f1, f2) {
    if (f1 === nop2)
      return f2;
    return function() {
      var res2 = f1.apply(this, arguments);
      if (res2 && typeof res2.then === "function") {
        var thiz = this, args = arguments;
        return res2.then(function() {
          return f2.apply(thiz, args);
        });
      }
      return f2.apply(this, arguments);
    };
  }
  function createUUID() {
    var d = Date.now();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c2) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c2 === "x" ? r : r & 7 | 8).toString(16);
    });
    return uuid;
  }
  function initOverrideCreateTransaction(db, wakeupObservers) {
    return function overrideCreateTransaction(origFunc) {
      return function(mode, storenames, dbschema, parent) {
        if (db.dynamicallyOpened())
          return origFunc.apply(this, arguments);
        var addChanges = false;
        if (mode === "readwrite" && storenames.some(function(storeName) {
          return dbschema[storeName] && dbschema[storeName].observable;
        })) {
          addChanges = true;
          storenames = storenames.slice(0);
          if (storenames.indexOf("_changes") === -1)
            storenames.push("_changes");
        }
        var trans = origFunc.call(this, mode, storenames, dbschema, parent);
        if (addChanges) {
          trans._lastWrittenRevision = 0;
          trans.on("complete", function() {
            if (trans._lastWrittenRevision) {
              if (!parent) {
                if (wakeupObservers.timeoutHandle)
                  clearTimeout(wakeupObservers.timeoutHandle);
                wakeupObservers.timeoutHandle = setTimeout(function() {
                  delete wakeupObservers.timeoutHandle;
                  wakeupObservers(trans._lastWrittenRevision);
                }, 25);
              } else {
                var rootTransaction = function findRootTransaction(trans2) {
                  return trans2.parent ? findRootTransaction(trans2.parent) : trans2;
                }(parent);
                rootTransaction._lastWrittenRevision = Math.max(trans._lastWrittenRevision, rootTransaction.lastWrittenRevision || 0);
              }
            }
          });
          if (trans.parent && trans.parent.source)
            trans.source = trans.parent.source;
        }
        return trans;
      };
    };
  }
  function initWakeupObservers(db, Observable2, localStorage) {
    return function wakeupObservers(lastWrittenRevision) {
      if (Observable2.latestRevision[db.name] < lastWrittenRevision) {
        Observable2.latestRevision[db.name] = lastWrittenRevision;
        dexie_default.ignoreTransaction(function() {
          Observable2.on("latestRevisionIncremented").fire(db.name, lastWrittenRevision);
        });
        if (localStorage)
          localStorage.setItem("Dexie.Observable/latestRevision/" + db.name, lastWrittenRevision);
      }
    };
  }
  var CREATE = 1;
  var UPDATE = 2;
  var DELETE = 3;
  function initCreatingHook(db, table) {
    return function creatingHook(primKey, obj2, trans) {
      var rv = void 0;
      if (primKey === void 0 && table.schema.primKey.uuid) {
        primKey = rv = createUUID();
        if (table.schema.primKey.keyPath) {
          dexie_default.setByKeyPath(obj2, table.schema.primKey.keyPath, primKey);
        }
      }
      var change = {
        source: trans.source || null,
        table: table.name,
        key: primKey === void 0 ? null : primKey,
        type: CREATE,
        obj: obj2
      };
      var promise = db._changes.add(change).then(function(rev) {
        trans._lastWrittenRevision = Math.max(trans._lastWrittenRevision, rev);
        return rev;
      });
      this.onsuccess = function(resultKey) {
        if (primKey != resultKey)
          promise._then(function() {
            change.key = resultKey;
            db._changes.put(change);
          });
      };
      this.onerror = function() {
        promise._then(function(rev) {
          db._changes.delete(rev);
        });
      };
      return rv;
    };
  }
  function initUpdatingHook(db, tableName) {
    return function updatingHook(mods2, primKey, oldObj, trans) {
      var modsWithoutUndefined = {};
      var anythingChanged = false;
      var newObj = dexie_default.deepClone(oldObj);
      for (var propPath in mods2) {
        var mod = mods2[propPath];
        if (typeof mod === "undefined") {
          dexie_default.delByKeyPath(newObj, propPath);
          modsWithoutUndefined[propPath] = null;
          anythingChanged = true;
        } else {
          var currentValue = dexie_default.getByKeyPath(oldObj, propPath);
          if (mod !== currentValue && JSON.stringify(mod) !== JSON.stringify(currentValue)) {
            dexie_default.setByKeyPath(newObj, propPath, mod);
            modsWithoutUndefined[propPath] = mod;
            anythingChanged = true;
          }
        }
      }
      if (anythingChanged) {
        var change = {
          source: trans.source || null,
          table: tableName,
          key: primKey,
          type: UPDATE,
          mods: modsWithoutUndefined,
          oldObj,
          obj: newObj
        };
        var promise = db._changes.add(change);
        this.onsuccess = function() {
          promise._then(function(rev) {
            trans._lastWrittenRevision = Math.max(trans._lastWrittenRevision, rev);
          });
        };
        this.onerror = function() {
          promise._then(function(rev) {
            db._changes.delete(rev);
          });
        };
      }
    };
  }
  function initDeletingHook(db, tableName) {
    return function deletingHook(primKey, obj2, trans) {
      var promise = db._changes.add({
        source: trans.source || null,
        table: tableName,
        key: primKey,
        type: DELETE,
        oldObj: obj2
      }).then(function(rev) {
        trans._lastWrittenRevision = Math.max(trans._lastWrittenRevision, rev);
        return rev;
      }).catch(function(e) {
        console.log(obj2);
        console.log(e.stack);
      });
      this.onerror = function() {
        promise._then(function(rev) {
          db._changes.delete(rev);
        });
      };
    };
  }
  function initCrudMonitor(db) {
    return function crudMonitor(table) {
      if (table.hook._observing)
        return;
      table.hook._observing = true;
      var tableName = table.name;
      table.hook("creating").subscribe(initCreatingHook(db, table));
      table.hook("updating").subscribe(initUpdatingHook(db, tableName));
      table.hook("deleting").subscribe(initDeletingHook(db, tableName));
    };
  }
  function initOnStorage(Observable2) {
    return function onStorage(event9) {
      if (event9.key && event9.key.indexOf("Dexie.Observable/") === 0) {
        var parts = event9.key.split("/");
        var prop = parts[1];
        var dbname = parts[2];
        if (prop === "latestRevision") {
          var rev = parseInt(event9.newValue, 10);
          if (!isNaN(rev) && rev > Observable2.latestRevision[dbname]) {
            Observable2.latestRevision[dbname] = rev;
            dexie_default.ignoreTransaction(function() {
              Observable2.on("latestRevisionIncremented").fire(dbname, rev);
            });
          }
        } else if (prop.indexOf("deadnode:") === 0) {
          var nodeID = parseInt(prop.split(":")[1], 10);
          if (event9.newValue) {
            Observable2.on.suicideNurseCall.fire(dbname, nodeID);
          }
        } else if (prop === "intercomm") {
          if (event9.newValue) {
            Observable2.on.intercomm.fire(dbname);
          }
        }
      }
    };
  }
  function initOverrideOpen(db, SyncNode, crudMonitor) {
    return function overrideOpen(origOpen) {
      return function() {
        Object.keys(db._allTables).forEach(function(tableName) {
          var table = db._allTables[tableName];
          if (table.schema.observable) {
            crudMonitor(table);
          }
          if (table.name === "_syncNodes") {
            table.mapToClass(SyncNode);
          }
        });
        return origOpen.apply(this, arguments);
      };
    };
  }
  var Promise2 = dexie_default.Promise;
  function initIntercomm(db, Observable2, SyncNode, mySyncNode, localStorage) {
    var requestsWaitingForReply = {};
    db.observable.sendMessage = function(type, message, destinationNode, options) {
      options = options || {};
      if (!mySyncNode.node)
        return options.wantReply ? Promise2.reject(new dexie_default.DatabaseClosedError()) : Promise2.resolve();
      var msg2 = {message, destinationNode, sender: mySyncNode.node.id, type};
      dexie_default.extend(msg2, options);
      return dexie_default.ignoreTransaction(function() {
        var tables = ["_intercomm"];
        if (options.wantReply)
          tables.push("_syncNodes");
        var promise = db.transaction("rw", tables, function() {
          if (options.wantReply) {
            return db._syncNodes.where("id").equals(destinationNode).count(function(receiverAlive) {
              if (receiverAlive)
                return db._intercomm.add(msg2);
              else
                return db._syncNodes.where("isMaster").above(0).first(function(masterNode) {
                  msg2.destinationNode = masterNode.id;
                  return db._intercomm.add(msg2);
                });
            });
          } else {
            return db._intercomm.add(msg2);
          }
        }).then(function(messageId) {
          var rv = null;
          if (options.wantReply) {
            rv = new Promise2(function(resolve3, reject) {
              requestsWaitingForReply[messageId.toString()] = {resolve: resolve3, reject};
            });
          }
          if (localStorage) {
            localStorage.setItem("Dexie.Observable/intercomm/" + db.name, messageId.toString());
          }
          Observable2.on.intercomm.fire(db.name);
          return rv;
        });
        if (!options.wantReply) {
          promise.catch(function() {
          });
          return;
        } else {
          return promise;
        }
      });
    };
    db.observable.broadcastMessage = function(type, message, bIncludeSelf) {
      if (!mySyncNode.node)
        return;
      var mySyncNodeId = mySyncNode.node.id;
      dexie_default.ignoreTransaction(function() {
        db._syncNodes.toArray(function(nodes) {
          return Promise2.all(nodes.filter(function(node) {
            return node.type === "local" && (bIncludeSelf || node.id !== mySyncNodeId);
          }).map(function(node) {
            return db.observable.sendMessage(type, message, node.id);
          }));
        }).catch(function() {
        });
      });
    };
    function consumeIntercommMessages() {
      if (!mySyncNode.node)
        return Promise2.reject(new dexie_default.DatabaseClosedError());
      return dexie_default.ignoreTransaction(function() {
        return db.transaction("rw", "_intercomm", function() {
          return db._intercomm.where({destinationNode: mySyncNode.node.id}).toArray(function(messages) {
            messages.forEach(function(msg2) {
              return consumeMessage(msg2);
            });
            return db._intercomm.where("id").anyOf(messages.map(function(msg2) {
              return msg2.id;
            })).delete();
          });
        });
      });
    }
    function consumeMessage(msg2) {
      if (msg2.type === "response") {
        var request = requestsWaitingForReply[msg2.requestId.toString()];
        if (request) {
          if (msg2.isFailure) {
            request.reject(msg2.message.error);
          } else {
            request.resolve(msg2.message.result);
          }
          delete requestsWaitingForReply[msg2.requestId.toString()];
        }
      } else {
        msg2.resolve = function(result) {
          db.observable.sendMessage("response", {result}, msg2.sender, {requestId: msg2.id});
        };
        msg2.reject = function(error) {
          db.observable.sendMessage("response", {error: error.toString()}, msg2.sender, {isFailure: true, requestId: msg2.id});
        };
        db.on.message.fire(msg2);
      }
    }
    function onIntercomm(dbname) {
      if (dbname === db.name) {
        consumeIntercommMessages().catch("DatabaseClosedError", function() {
        });
      }
    }
    return {
      onIntercomm,
      consumeIntercommMessages
    };
  }
  function overrideParseStoresSpec(origFunc) {
    return function(stores, dbSchema) {
      stores["_changes"] = "++rev";
      stores["_syncNodes"] = "++id,myRevision,lastHeartBeat,&url,isMaster,type,status";
      stores["_intercomm"] = "++id,destinationNode";
      stores["_uncommittedChanges"] = "++id,node";
      origFunc.call(this, stores, dbSchema);
      Object.keys(dbSchema).forEach(function(tableName) {
        var schema = dbSchema[tableName];
        if (schema.primKey.name.indexOf("$$") === 0) {
          schema.primKey.uuid = true;
          schema.primKey.name = schema.primKey.name.substr(2);
          schema.primKey.keyPath = schema.primKey.keyPath.substr(2);
        }
      });
      Object.keys(dbSchema).forEach(function(tableName) {
        if (tableName.indexOf("_") !== 0 && tableName.indexOf("$") !== 0) {
          dbSchema[tableName].observable = true;
        }
      });
    };
  }
  function deleteOldChanges(db) {
    var CHUNK_SIZE = 100;
    dexie_default.ignoreTransaction(function() {
      return db._syncNodes.orderBy("myRevision").first(function(oldestNode) {
        return db._changes.where("rev").below(oldestNode.myRevision).limit(CHUNK_SIZE).primaryKeys();
      }).then(function(keysToDelete) {
        if (keysToDelete.length === 0)
          return;
        return db._changes.bulkDelete(keysToDelete).then(function() {
          if (keysToDelete.length === CHUNK_SIZE) {
            setTimeout(function() {
              return db.isOpen() && deleteOldChanges(db);
            }, 500);
          }
        });
      });
    }).catch(function() {
    });
  }
  var global2 = self;
  var DatabaseChange = dexie_default.defineClass({
    rev: Number,
    source: String,
    table: String,
    key: Object,
    type: Number,
    obj: Object,
    mods: Object,
    oldObj: Object
  });
  var override2 = dexie_default.override;
  var Promise$1 = dexie_default.Promise;
  var browserIsShuttingDown = false;
  function Observable(db) {
    if (!/^3\./.test(dexie_default.version))
      throw new Error("Missing dexie version 3.x");
    if (db.observable) {
      if (db.observable.version !== "{version}")
        throw new Error("Mixed versions of dexie-observable");
      return;
    }
    var NODE_TIMEOUT = 2e4, HIBERNATE_GRACE_PERIOD = 2e4, LOCAL_POLL = 500, HEARTBEAT_INTERVAL = NODE_TIMEOUT - 5e3;
    var localStorage = Observable.localStorageImpl;
    var SyncNode = dexie_default.defineClass({
      myRevision: Number,
      type: String,
      lastHeartBeat: Number,
      deleteTimeStamp: Number,
      url: String,
      isMaster: Number,
      syncProtocol: String,
      syncContext: null,
      syncOptions: Object,
      connected: false,
      status: Number,
      appliedRemoteRevision: null,
      remoteBaseRevisions: [{local: Number, remote: null}],
      dbUploadState: {
        tablesToUpload: [String],
        currentTable: String,
        currentKey: null,
        localBaseRevision: Number
      }
    });
    db.observable = {version: "{version}"};
    db.observable.SyncNode = SyncNode;
    var wakeupObservers = initWakeupObservers(db, Observable, localStorage);
    var overrideCreateTransaction = initOverrideCreateTransaction(db, wakeupObservers);
    var crudMonitor = initCrudMonitor(db);
    var overrideOpen = initOverrideOpen(db, SyncNode, crudMonitor);
    var mySyncNode = {node: null};
    var intercomm = initIntercomm(db, Observable, SyncNode, mySyncNode, localStorage);
    var onIntercomm = intercomm.onIntercomm;
    var consumeIntercommMessages = intercomm.consumeIntercommMessages;
    Object.defineProperty(db, "_localSyncNode", {
      get: function() {
        return mySyncNode.node;
      }
    });
    var pollHandle = null, heartbeatHandle = null;
    if (dexie_default.fake) {
      db.version(1).stores({
        _syncNodes: "++id,myRevision,lastHeartBeat",
        _changes: "++rev",
        _intercomm: "++id,destinationNode",
        _uncommittedChanges: "++id,node"
      });
      db._syncNodes.mapToClass(SyncNode);
      db._changes.mapToClass(DatabaseChange);
      mySyncNode.node = new SyncNode({
        myRevision: 0,
        type: "local",
        lastHeartBeat: Date.now(),
        deleteTimeStamp: null
      });
    }
    db.Version.prototype._parseStoresSpec = override2(db.Version.prototype._parseStoresSpec, overrideParseStoresSpec);
    db.on.addEventType({
      changes: "asap",
      cleanup: [promisableChain2, nop2],
      message: "asap"
    });
    db._createTransaction = override2(db._createTransaction, overrideCreateTransaction);
    Observable.latestRevision[db.name] = Observable.latestRevision[db.name] || 0;
    db.open = override2(db.open, overrideOpen);
    db.close = override2(db.close, function(origClose) {
      return function() {
        if (db.dynamicallyOpened())
          return origClose.apply(this, arguments);
        if (wakeupObservers.timeoutHandle) {
          clearTimeout(wakeupObservers.timeoutHandle);
          delete wakeupObservers.timeoutHandle;
        }
        Observable.on("latestRevisionIncremented").unsubscribe(onLatestRevisionIncremented);
        Observable.on("suicideNurseCall").unsubscribe(onSuicide);
        Observable.on("intercomm").unsubscribe(onIntercomm);
        Observable.on("beforeunload").unsubscribe(onBeforeUnload);
        if (mySyncNode.node && mySyncNode.node.id) {
          Observable.on.suicideNurseCall.fire(db.name, mySyncNode.node.id);
          if (localStorage) {
            localStorage.setItem("Dexie.Observable/deadnode:" + mySyncNode.node.id.toString() + "/" + db.name, "dead");
          }
          mySyncNode.node.deleteTimeStamp = 1;
          mySyncNode.node.lastHeartBeat = 0;
          db._syncNodes.put(mySyncNode.node);
          mySyncNode.node = null;
        }
        if (pollHandle)
          clearTimeout(pollHandle);
        pollHandle = null;
        if (heartbeatHandle)
          clearTimeout(heartbeatHandle);
        heartbeatHandle = null;
        return origClose.apply(this, arguments);
      };
    });
    db.delete = override2(db.delete, function(origDelete) {
      return function() {
        return origDelete.apply(this, arguments).then(function(result) {
          Observable.latestRevision[db.name] = 0;
          return result;
        });
      };
    });
    db.on("ready", function startObserving() {
      if (db.dynamicallyOpened())
        return db;
      return db.table("_changes").orderBy("rev").last(function(lastChange) {
        var latestRevision = lastChange ? lastChange.rev : 0;
        mySyncNode.node = new SyncNode({
          myRevision: latestRevision,
          type: "local",
          lastHeartBeat: Date.now(),
          deleteTimeStamp: null,
          isMaster: 0
        });
        if (Observable.latestRevision[db.name] < latestRevision) {
          Observable.latestRevision[db.name] = latestRevision;
          dexie_default.ignoreTransaction(function() {
            Observable.on.latestRevisionIncremented.fire(latestRevision);
          });
        }
        return db._syncNodes.put(mySyncNode.node).then(dexie_default.ignoreTransaction(function() {
          var mySyncNodeShouldBecomeMaster = 1;
          return db._syncNodes.orderBy("isMaster").reverse().modify(function(existingNode) {
            if (existingNode.isMaster) {
              if (existingNode.lastHeartBeat < Date.now() - NODE_TIMEOUT) {
                existingNode.isMaster = 0;
              } else {
                mySyncNodeShouldBecomeMaster = 0;
              }
            }
            if (!mySyncNode.node)
              return;
            if (existingNode.id === mySyncNode.node.id) {
              existingNode.isMaster = mySyncNode.node.isMaster = mySyncNodeShouldBecomeMaster;
            }
          });
        })).then(function() {
          Observable.on("latestRevisionIncremented", onLatestRevisionIncremented);
          Observable.on("beforeunload", onBeforeUnload);
          Observable.on("suicideNurseCall", onSuicide);
          Observable.on("intercomm", onIntercomm);
          pollHandle = setTimeout(poll, LOCAL_POLL);
          heartbeatHandle = setTimeout(heartbeat, HEARTBEAT_INTERVAL);
        }).then(function() {
          cleanup();
        });
      });
    }, true);
    var handledRevision = 0;
    function onLatestRevisionIncremented(dbname, latestRevision) {
      if (dbname === db.name) {
        if (handledRevision >= latestRevision)
          return;
        handledRevision = latestRevision;
        dexie_default.vip(function() {
          readChanges(latestRevision).catch("DatabaseClosedError", function() {
          });
        });
      }
    }
    function readChanges(latestRevision, recursion, wasPartial) {
      if (!recursion && readChanges.ongoingOperation) {
        return readChanges.ongoingOperation;
      }
      var partial = false;
      var ourSyncNode = mySyncNode.node;
      if (!ourSyncNode) {
        return Promise$1.reject(new dexie_default.DatabaseClosedError());
      }
      var LIMIT = 1e3;
      var promise = db._changes.where("rev").above(ourSyncNode.myRevision).limit(LIMIT).toArray(function(changes) {
        if (changes.length > 0) {
          var lastChange = changes[changes.length - 1];
          partial = changes.length === LIMIT;
          db.on("changes").fire(changes, partial);
          ourSyncNode.myRevision = lastChange.rev;
        } else if (wasPartial) {
          db.on("changes").fire([], false);
        }
        var ourNodeStillExists = false;
        return db._syncNodes.where(":id").equals(ourSyncNode.id).modify(function(syncNode) {
          ourNodeStillExists = true;
          syncNode.lastHeartBeat = Date.now();
          syncNode.deleteTimeStamp = null;
          syncNode.myRevision = Math.max(syncNode.myRevision, ourSyncNode.myRevision);
        }).then(function() {
          return ourNodeStillExists;
        });
      }).then(function(ourNodeStillExists) {
        if (!ourNodeStillExists) {
          if (browserIsShuttingDown) {
            throw new Error("Browser is shutting down");
          } else {
            db.close();
            console.error("Out of sync");
            if (global2.location)
              global2.location.reload(true);
            throw new Error("Out of sync");
          }
        }
        if (partial || Observable.latestRevision[db.name] > ourSyncNode.myRevision) {
          return readChanges(Observable.latestRevision[db.name], (recursion || 0) + 1, partial);
        }
      }).finally(function() {
        delete readChanges.ongoingOperation;
      });
      if (!recursion) {
        readChanges.ongoingOperation = promise;
      }
      return promise;
    }
    function heartbeat() {
      heartbeatHandle = null;
      var currentInstance = mySyncNode.node && mySyncNode.node.id;
      if (!currentInstance)
        return;
      db.transaction("rw!", db._syncNodes, function() {
        db._syncNodes.where({id: currentInstance}).first(function(ourSyncNode) {
          if (!ourSyncNode) {
            if (db.isOpen())
              db.close();
            return;
          }
          ourSyncNode.lastHeartBeat = Date.now();
          ourSyncNode.deleteTimeStamp = null;
          return db._syncNodes.put(ourSyncNode);
        });
      }).catch("DatabaseClosedError", function() {
      }).finally(function() {
        if (mySyncNode.node && mySyncNode.node.id === currentInstance && db.isOpen()) {
          heartbeatHandle = setTimeout(heartbeat, HEARTBEAT_INTERVAL);
        }
      });
    }
    function poll() {
      pollHandle = null;
      var currentInstance = mySyncNode.node && mySyncNode.node.id;
      if (!currentInstance)
        return;
      dexie_default.vip(function() {
        readChanges(Observable.latestRevision[db.name]).then(cleanup).then(consumeIntercommMessages).catch("DatabaseClosedError", function() {
        }).finally(function() {
          if (mySyncNode.node && mySyncNode.node.id === currentInstance && db.isOpen()) {
            pollHandle = setTimeout(poll, LOCAL_POLL);
          }
        });
      });
    }
    function cleanup() {
      var ourSyncNode = mySyncNode.node;
      if (!ourSyncNode)
        return Promise$1.reject(new dexie_default.DatabaseClosedError());
      return db.transaction("rw", "_syncNodes", "_changes", "_intercomm", function() {
        var weBecameMaster = false;
        db._syncNodes.where("lastHeartBeat").below(Date.now() - NODE_TIMEOUT).filter(function(node) {
          return node.type === "local";
        }).modify(function(node) {
          if (node.deleteTimeStamp && node.deleteTimeStamp < Date.now()) {
            delete this.value;
            if (localStorage) {
              localStorage.removeItem("Dexie.Observable/deadnode:" + node.id + "/" + db.name);
            }
            if (node.isMaster) {
              db._syncNodes.update(ourSyncNode, {isMaster: 1});
              weBecameMaster = true;
            }
            db._intercomm.where({destinationNode: node.id}).modify(function(msg2) {
              if (msg2.wantReply)
                msg2.destinationNode = ourSyncNode.id;
              else
                delete this.value;
            });
          } else if (!node.deleteTimeStamp) {
            node.deleteTimeStamp = Date.now() + HIBERNATE_GRACE_PERIOD;
          }
        }).then(function() {
          Observable.deleteOldChanges(db);
          return db.on("cleanup").fire(weBecameMaster);
        });
      });
    }
    function onBeforeUnload() {
      if (!mySyncNode.node)
        return;
      browserIsShuttingDown = true;
      mySyncNode.node.deleteTimeStamp = 1;
      mySyncNode.node.lastHeartBeat = 0;
      db._syncNodes.put(mySyncNode.node);
      Observable.wereTheOneDying = true;
      if (localStorage) {
        localStorage.setItem("Dexie.Observable/deadnode:" + mySyncNode.node.id.toString() + "/" + db.name, "dead");
      }
    }
    function onSuicide(dbname, nodeID) {
      if (dbname === db.name && !Observable.wereTheOneDying) {
        dexie_default.vip(function() {
          db._syncNodes.update(nodeID, {deleteTimeStamp: 1, lastHeartBeat: 0}).then(cleanup);
        });
      }
    }
  }
  Observable.version = "{version}";
  Observable.latestRevision = {};
  Observable.on = dexie_default.Events(null, "latestRevisionIncremented", "suicideNurseCall", "intercomm", "beforeunload");
  Observable.createUUID = createUUID;
  Observable.deleteOldChanges = deleteOldChanges;
  Observable._onStorage = initOnStorage(Observable);
  Observable._onBeforeUnload = function() {
    Observable.on.beforeunload.fire();
  };
  try {
    Observable.localStorageImpl = global2.localStorage;
  } catch (ex) {
  }
  if (global2.addEventListener) {
    global2.addEventListener("storage", Observable._onStorage);
    global2.addEventListener("beforeunload", Observable._onBeforeUnload);
  }
  if (dexie_default.Observable) {
    if (dexie_default.Observable.version !== "{version}") {
      throw new Error("Mixed versions of dexie-observable");
    }
  } else {
    dexie_default.Observable = Observable;
    dexie_default.addons.push(Observable);
  }
  var Dexie_Observable = dexie_default.Observable;

  // src/adapters/whatwg_indexeddb.ts
  const INDEXEDDB_VERSION = 1;
  class IndexedDBStorage extends dexie_default {
    constructor(namespace = "default") {
      super("uristorage:" + namespace);
      this.version(INDEXEDDB_VERSION).stores({
        nodes: "&path, ctime, mime_type, mtime, type"
      });
      this.nodes = this.table("nodes");
      this.EVENT_WATCH = event((dispatch) => {
        function on_change(event9) {
          for (const change of event9) {
            switch (change.type) {
              case 1:
                dispatch({
                  change: NODE_CHANGES.created,
                  path: change.obj.path,
                  type: change.obj.type
                });
                break;
              case 3:
                dispatch({
                  change: NODE_CHANGES.removed,
                  path: change.oldObj.path,
                  type: change.oldObj.path
                });
                break;
              case 2:
                if (change.mods.payload) {
                  dispatch({
                    change: NODE_CHANGES.attached,
                    path: change.oldObj.path,
                    type: change.oldObj.path
                  });
                } else {
                  dispatch({
                    change: NODE_CHANGES.updated,
                    path: change.oldObj.path,
                    type: change.oldObj.path
                  });
                }
                break;
            }
          }
        }
        const context = this.on("changes", on_change);
        return () => context.unsubscribe(on_change);
      });
    }
  }
  class IndexedDBAdapter extends BaseAdapter {
    constructor(options = {}) {
      super(options);
    }
    async create_url_object(path5) {
      const {storage} = this;
      if (!storage) {
        throw new Error("bad dispatch to 'create_url_object' (database is not mounted)");
      }
      const uri2 = this.normalize(path5);
      const node = await storage.nodes.get(uri2);
      if (!node) {
        throw new Error("bad argument #0 to 'create_url_object' (Node must be created before using 'create_url_object')");
      }
      if (!node.payload) {
        throw new Error("bad argument #0 to 'create_url_object' (Node payload must be created before using 'create_url_object')");
      }
      const object = create_url_object(node.payload, node.mime_type);
      return {
        destroy: object.destroy,
        path: node.path,
        url: object.url
      };
    }
    async get(path5) {
      const {storage} = this;
      if (!storage) {
        throw new Error("bad dispatch to 'get' (database is not mounted)");
      }
      const uri2 = this.normalize(path5);
      const node = await storage.nodes.get(uri2);
      if (!node)
        return null;
      return {
        ctime: node.ctime,
        mime_type: node.mime_type,
        mtime: node.mtime,
        path: node.path,
        type: node.type
      };
    }
    async put(path5, type = NODE_TYPES.undefined, mime_type) {
      const {storage} = this;
      if (!storage) {
        throw new Error("bad dispatch to 'put' (database is not mounted)");
      }
      const uri2 = this.normalize(path5);
      const node = await storage.nodes.get(uri2);
      const timestamp = get_epoch_timestamp();
      if (!mime_type)
        mime_type = get_mime_type(uri2) || DEFAULT_MIME_TYPE;
      if (node) {
        await storage.nodes.update(node, {
          mtime: timestamp,
          mime_type,
          type
        });
      } else {
        await storage.nodes.put({
          ctime: timestamp,
          mime_type,
          mtime: timestamp,
          path: uri2,
          type
        });
      }
    }
    async query(options = {}) {
      const {storage} = this;
      if (!storage) {
        throw new Error("bad dispatch to 'query' (database is not mounted)");
      }
      const {path: path5 = {}, type} = options;
      let collection = storage.nodes.toCollection();
      if (type) {
        if (typeof type === "string") {
          collection = collection.filter((node) => node.type === type);
        } else
          collection = collection.filter((node) => type.includes(node.type));
      }
      if (path5.glob) {
        const regex = make_glob(normalize2(path5.glob));
        collection = collection.filter((node) => regex.test(node.path));
      } else if (path5.regex) {
        const {regex} = path5;
        collection = collection.filter((node) => regex.test(node.path));
      } else {
        let {path: _path2 = "/"} = path5;
        _path2 = path5.recursive ? join2(_path2, "**") : join2(_path2, "*");
        const regex = make_glob(normalize2(_path2));
        collection = collection.filter((node) => regex.test(node.path));
      }
      const results = await collection.toArray();
      return results.map((node, index) => {
        const {path: path6, type: type2} = node;
        return {path: path6, type: type2};
      });
    }
    async read(path5) {
      const {storage} = this;
      if (!storage) {
        throw new Error("bad dispatch to 'get_payload' (database is not mounted)");
      }
      const uri2 = this.normalize(path5);
      const node = await storage.nodes.get(uri2);
      if (!node || !node.payload)
        return null;
      return node.payload;
    }
    async remove(path5) {
      const {storage} = this;
      if (!storage) {
        throw new Error("bad dispatch to 'remove' (database is not mounted)");
      }
      const uri2 = this.normalize(path5);
      const node = await storage.nodes.get(uri2);
      if (!node)
        return false;
      storage.nodes.delete(uri2);
      return true;
    }
    async watch(options = {}) {
      const {storage} = this;
      if (!storage) {
        throw new Error("bad dispatch to 'remove' (database is not mounted)");
      }
      return hook_watcher(storage.EVENT_WATCH, options);
    }
    async write(path5, payload) {
      const {storage} = this;
      if (!storage) {
        throw new Error("bad dispatch to 'attach' (database is not mounted)");
      }
      const uri2 = this.normalize(path5);
      const node = await storage.nodes.get(uri2);
      if (!node) {
        throw new Error("bad argument #0 to 'attach' (Node must be created before using 'attach')");
      }
      await storage.nodes.update(node, {
        payload,
        mtime: get_epoch_timestamp()
      });
    }
    is_mounted() {
      return !!this.storage;
    }
    async mount() {
      if (this.storage) {
        throw new Error("bad dispatch to 'mount' (database is already mounted)");
      }
      const {namespace} = this.options;
      const storage = new IndexedDBStorage(namespace);
      await storage.open();
      this.storage = storage;
    }
    async unmount() {
      const {storage} = this;
      if (!storage) {
        throw new Error("bad dispatch to 'unmount' (database is not mounted)");
      }
      await storage.close();
      delete this.storage;
    }
  }
  IndexedDBAdapter.can_hotlink = true;
  IndexedDBAdapter.can_watch = true;
  IndexedDBAdapter.is_available = !!(typeof window === "object" && window.indexedDB);
  IndexedDBAdapter.requires_mount = true;

  // src/util/encoding.ts
  const base85 = __toModule(require_base85());
  function decode_safe(buffer2, options = {}) {
    const {mode = ENCODING_MODE.text} = options;
    switch (mode) {
      case ENCODING_MODE.bytes:
        return base85.decode(buffer2, "ByteArray");
      case ENCODING_MODE.text:
        return base85.decode(buffer2, "String");
      default:
        throw new Error(`bad option 'options.mode' to 'decode_safe' (encoding mode '${mode}' not available)`);
    }
  }
  function decode_utf8(buffer2) {
    const decoder = new TextDecoder();
    return decoder.decode(buffer2);
  }
  function encode_safe(buffer2, options = {}) {
    const {mode = ENCODING_MODE.text} = options;
    switch (mode) {
      case ENCODING_MODE.bytes:
        return base85.encode(buffer2, "ByteArray");
      case ENCODING_MODE.text:
        return base85.encode(buffer2, "String");
      default:
        throw new Error(`bad option 'options.mode' to 'encode_safe' (encoding mode '${mode}' not available)`);
    }
  }
  function encode_utf8(text2) {
    const encoder = new TextEncoder();
    return encoder.encode(text2);
  }

  // src/adapters/whatwg_webstorage.ts
  class WebStorage {
    constructor(namespace, storage) {
      this.EVENT_WATCH = event();
      this.prefix_node = `uristorage:${namespace}:n:`;
      this.prefix_payload = `uristorage:${namespace}:p:`;
      this.storage = storage;
    }
    attach(path5, payload, mtime) {
      const {storage} = this;
      const key_node = this.prefix_node + path5;
      const key_payload = this.prefix_payload + path5;
      const node = {...JSON.parse(storage.getItem(key_node)), mtime};
      storage.setItem(key_node, JSON.stringify(node));
      storage.setItem(key_payload, encode_safe(payload));
      this.EVENT_WATCH.dispatch({
        change: NODE_CHANGES.attached,
        path: path5,
        type: node.type
      });
    }
    get(path5) {
      const key = this.prefix_node + path5;
      const item = this.storage.getItem(key);
      if (item) {
        const {
          ctime = 0,
          mime_type = DEFAULT_MIME_TYPE,
          mtime = 0,
          type = NODE_TYPES.undefined
        } = JSON.parse(item);
        return {
          ctime,
          mime_type,
          mtime,
          path: path5,
          type
        };
      }
      return null;
    }
    get_payload(path5) {
      const key = this.prefix_payload + path5;
      const item = this.storage.getItem(key);
      if (item)
        return decode_safe(item, {mode: ENCODING_MODE.bytes});
      return null;
    }
    has(path5) {
      path5 = this.prefix_node + path5;
      return !!this.storage.getItem(path5);
    }
    *nodes() {
      const {prefix_node, storage} = this;
      for (let index = 0; index < storage.length; index++) {
        const key = storage.key(index);
        if (key?.startsWith(prefix_node)) {
          const item = storage.getItem(key);
          const {type = NODE_TYPES.undefined} = JSON.parse(item);
          yield {
            path: key.slice(prefix_node.length),
            type
          };
        }
      }
    }
    put(path5, node) {
      const _node = {...node, path: path5};
      const item = JSON.stringify(_node);
      this.storage.setItem(this.prefix_node + path5, item);
      this.EVENT_WATCH.dispatch({
        change: NODE_CHANGES.created,
        path: path5,
        type: _node.type
      });
    }
    remove(path5) {
      const {storage} = this;
      const item = storage.getItem(path5);
      if (!item)
        return false;
      const node = JSON.parse(item);
      storage.removeItem(this.prefix_node + path5);
      storage.removeItem(this.prefix_payload + path5);
      this.EVENT_WATCH.dispatch({
        change: NODE_CHANGES.removed,
        path: path5,
        type: node.type
      });
      return true;
    }
    update(path5, value) {
      const {storage} = this;
      const key = this.prefix_node + path5;
      const node = {...JSON.parse(storage.getItem(key)), ...value, path: path5};
      storage.setItem(key, JSON.stringify(node));
      this.EVENT_WATCH.dispatch({
        change: NODE_CHANGES.updated,
        path: node.path,
        type: node.type
      });
    }
  }
  function WebStorageOptions(options = {}) {
    const {compressed = true} = options;
    return {
      ...options,
      compressed
    };
  }
  class WebStorageAdapter extends BaseAdapter {
    constructor(storage, options = {}) {
      super(WebStorageOptions(options));
      const {namespace} = this.options;
      this.storage = new WebStorage(namespace, storage);
    }
    async create_url_object(path5) {
      const {storage} = this;
      const {compressed} = this.options;
      const uri2 = this.normalize(path5);
      if (!storage.has(uri2)) {
        throw new Error("bad argument #0 to 'create_url_object' (Node must be created before using 'create_url_object')");
      }
      let payload = storage.get_payload(uri2);
      if (!payload) {
        throw new Error("bad argument #0 to 'create_url_object' (Node payload must be created before using 'create_url_object')");
      }
      const node = storage.get(uri2);
      payload = compressed ? decompress(payload) : payload;
      const object = create_url_object(payload, node.mime_type);
      return {
        destroy: object.destroy,
        path: node.path,
        url: object.url
      };
    }
    async get(path5) {
      const uri2 = this.normalize(path5);
      return this.storage.get(uri2);
    }
    async put(path5, type = NODE_TYPES.undefined, mime_type) {
      const {storage} = this;
      const uri2 = this.normalize(path5);
      const timestamp = get_epoch_timestamp();
      if (!mime_type)
        mime_type = get_mime_type(uri2) || DEFAULT_MIME_TYPE;
      if (storage.has(uri2)) {
        storage.update(uri2, {
          mime_type,
          mtime: timestamp,
          type
        });
      } else {
        storage.put(uri2, {
          ctime: timestamp,
          mime_type,
          mtime: timestamp,
          type
        });
      }
    }
    async query(options = {}) {
      const nodes = Array.from(this.storage.nodes());
      return filter_query(nodes, options);
    }
    async read(path5) {
      const {compressed} = this.options;
      const uri2 = this.normalize(path5);
      const payload = this.storage.get_payload(uri2);
      if (!payload)
        return null;
      return compressed ? decompress(payload) : payload;
    }
    async remove(path5) {
      const uri2 = this.normalize(path5);
      return this.storage.remove(uri2);
    }
    async watch(options = {}) {
      return hook_watcher(this.storage.EVENT_WATCH, options);
    }
    async write(path5, payload) {
      const {storage} = this;
      const {compressed} = this.options;
      const uri2 = this.normalize(path5);
      if (!storage.has(uri2)) {
        throw new Error("bad argument #0 to 'attach' (Node must be created before using 'attach')");
      }
      payload = compressed ? compress(payload) : payload;
      storage.attach(uri2, payload, get_epoch_timestamp());
    }
    is_mounted() {
      return true;
    }
    async mount() {
    }
    async unmount() {
    }
  }
  WebStorageAdapter.can_hotlink = true;
  WebStorageAdapter.can_watch = true;
  WebStorageAdapter.is_available = false;
  WebStorageAdapter.storage = null;
  class LocalStorageAdapter extends WebStorageAdapter {
    constructor(options = {}) {
      super(window.localStorage, options);
    }
  }
  LocalStorageAdapter.is_available = !!(typeof window === "object" && window.localStorage);
  class SessionStorageAdapter extends WebStorageAdapter {
    constructor(options = {}) {
      super(window.sessionStorage, options);
    }
  }
  SessionStorageAdapter.is_available = !!(typeof window === "object" && window.sessionStorage);

  // src/overlays/base_overlay.ts
  class BaseOverlay {
    constructor(adapter) {
      this.EVENT_MOUNTED = event();
      this.EVENT_UNMOUNTED = event();
      this.adapter = adapter;
      if (!this.has_feature("is_available")) {
        throw new Error("bad dispatch to 'BaseOverlay' (adapter is not available in this context)");
      }
      adapter.EVENT_MOUNTED.subscribe((event9) => this.EVENT_MOUNTED.dispatch({storage: this}));
      adapter.EVENT_UNMOUNTED.subscribe((event9) => this.EVENT_UNMOUNTED.dispatch({storage: this}));
    }
    has_feature(feature) {
      const constructor = this.adapter.constructor;
      return constructor[feature];
    }
    is_mounted() {
      return this.adapter.is_mounted();
    }
    mount() {
      return this.adapter.mount();
    }
    unmount() {
      return this.adapter.unmount();
    }
  }

  // src/overlays/file_system.ts
  var FILE_SYSTEM_CHANGES;
  (function(FILE_SYSTEM_CHANGES2) {
    FILE_SYSTEM_CHANGES2["created"] = "CHANGE_CREATED";
    FILE_SYSTEM_CHANGES2["removed"] = "CHANGE_REMOVED";
    FILE_SYSTEM_CHANGES2["updated"] = "CHANGE_UPDATED";
  })(FILE_SYSTEM_CHANGES || (FILE_SYSTEM_CHANGES = {}));
  const PATTERN_SEPARATOR_SEARCH = /\//g;
  function count_slashes(path5) {
    const matches = path5.match(PATTERN_SEPARATOR_SEARCH);
    if (!matches)
      return 0;
    return matches.length;
  }
  class FileSystemOverlay extends BaseOverlay {
    async create_url_object(file_path) {
      if (!this.has_feature("can_hotlink")) {
        throw new Error("bad dispatch to 'create_url_object' (adapter does not support feature)");
      }
      const {adapter} = this;
      const node = await adapter.get(file_path);
      if (!node) {
        throw new Error("bad argument #0 to 'create_url_object' (file path not found)");
      } else if (node.type !== NODE_TYPES.file) {
        throw new Error("bad argument #0 to 'create_url_object' (file path is not a file)");
      }
      return adapter.create_url_object(file_path);
    }
    async create_directory(directory_path) {
      if (this.has_feature("is_readonly")) {
        throw new Error("bad dispatch to 'create_directory' (adapter does not support feature)");
      }
      const {adapter} = this;
      directory_path = normalize2(directory_path);
      if (directory_path === "/") {
        throw new Error("bad argument #0 to 'create_directory' (directory path is already a directory)");
      }
      const node = await adapter.get(directory_path);
      if (node) {
        switch (node.type) {
          case NODE_TYPES.directory:
            throw new Error("bad argument #0 to 'create_directory' (directory path is already a directory)");
          case NODE_TYPES.file:
            throw new Error("bad argument #0 to 'create_directory' (directory path is already a file)");
        }
      }
      const parent_path = dirname2(directory_path);
      if (parent_path !== "/") {
        const parent_node = await adapter.get(parent_path);
        if (!parent_node) {
          throw new Error("bad argument #0 to 'create_directory' (parent path does not exist)");
        } else if (parent_node.type !== NODE_TYPES.directory) {
          throw new Error("bad argument #0 to 'create_directory' (parent path is not a directory)");
        }
      }
      return adapter.put(directory_path, NODE_TYPES.directory);
    }
    async exists(path5) {
      const node = await this.adapter.get(path5);
      return !!node;
    }
    async get_stats(path5) {
      const node = await this.adapter.get(path5);
      if (!node) {
        throw new Error("bad argument #0 to 'get_stats' (path not found)");
      }
      return {
        ctime: node.ctime,
        path: node.path,
        mtime: node.mtime,
        is_directory: node.type === NODE_TYPES.directory,
        is_file: node.type === NODE_TYPES.file
      };
    }
    async read_directory(options = {}) {
      const {adapter} = this;
      const {is_directory, is_file, glob: glob3, regex, path: path5, recursive = false} = options;
      let type;
      if (is_directory)
        type = NODE_TYPES.directory;
      else if (is_file)
        type = NODE_TYPES.file;
      else
        type = [NODE_TYPES.directory, NODE_TYPES.file];
      let results;
      if (path5 || path5 === "") {
        const directory_path = normalize2(path5);
        const node = await adapter.get(directory_path);
        if (directory_path !== "/") {
          if (!node) {
            throw new Error("bad option 'IFileSystemQueryOptions.path' to 'read_directory' (directory path not found)");
          } else if (node.type !== NODE_TYPES.directory) {
            throw new Error("bad option 'IFileSystemQueryOptions.path' to 'read_directory' (directory path is not a directory)");
          }
        }
        results = await adapter.query({
          type,
          path: {
            recursive,
            path: directory_path
          }
        });
      } else if (glob3) {
        results = await adapter.query({
          type,
          path: {glob: glob3}
        });
      } else if (regex) {
        results = await adapter.query({
          type,
          path: {regex}
        });
      } else {
        results = await adapter.query({
          type,
          path: {
            recursive,
            path: "/"
          }
        });
      }
      return results.map((result, index) => {
        const {path: path6, type: type2} = result;
        return {
          path: path6,
          is_directory: type2 === NODE_TYPES.directory,
          is_file: type2 === NODE_TYPES.file
        };
      });
    }
    async read_file(file_path) {
      const {adapter} = this;
      const node = await adapter.get(file_path);
      if (!node) {
        throw new Error("bad argument #0 to 'read_file' (file path not found)");
      } else if (node.type !== NODE_TYPES.file) {
        throw new Error("bad argument #0 to 'read_file' (file path is not a file)");
      }
      const payload = await adapter.read(file_path);
      return payload ? payload : new Uint8Array();
    }
    async remove_directory(directory_path, options = {}) {
      if (this.has_feature("is_readonly")) {
        throw new Error("bad dispatch to 'remove_directory' (adapter does not support feature)");
      }
      const {adapter} = this;
      const {recursive = false} = options;
      directory_path = normalize2(directory_path);
      if (directory_path === "/") {
        throw new Error("bad argument #0 to 'remove_directory' (directory path not found)");
      }
      const node = await adapter.get(directory_path);
      if (!node) {
        throw new Error("bad argument #0 to 'remove_directory' (directory path not found)");
      } else if (node.type !== NODE_TYPES.directory) {
        throw new Error("bad argument #0 to 'remove_directory' (directory path is not a directory)");
      }
      const children_results = await adapter.query({
        path: {
          path: directory_path,
          recursive: true
        }
      });
      if (children_results.length > 0) {
        if (recursive) {
          children_results.sort((a, b) => count_slashes(b.path) - count_slashes(a.path));
          const promises = children_results.map((result, index) => {
            return adapter.remove(result.path);
          });
          await Promise.all(promises);
        } else {
          throw new Error("bad argument #0 to 'remove_directory' (directory contains children)");
        }
      }
      return adapter.remove(directory_path);
    }
    async remove_file(file_path) {
      if (this.has_feature("is_readonly")) {
        throw new Error("bad dispatch to 'remove_file' (adapter does not support feature)");
      }
      const {adapter} = this;
      const node = await adapter.get(file_path);
      if (!node) {
        throw new Error("bad argument #0 to 'remove_file' (file path not found)");
      } else if (node.type !== NODE_TYPES.file) {
        throw new Error("bad argument #0 to 'remove_file' (file path is not a file)");
      }
      const removed = await adapter.remove(file_path);
      if (!removed) {
        throw new Error("bad argument #0 to 'remove_file' (could not remove file path)");
      }
    }
    async watch_directory(directory_path, options = {}) {
      if (!this.has_feature("can_watch")) {
        throw new Error("bad dispatch to 'watch_directory' (adapter does not support feature)");
      }
      const {adapter} = this;
      const {recursive} = options;
      directory_path = normalize2(directory_path);
      if (directory_path !== "/") {
        const node = await adapter.get(directory_path);
        if (!node) {
          throw new Error("bad argument #0 to 'watch_directory' (directory path not found)");
        } else if (node.type !== NODE_TYPES.directory) {
          throw new Error("bad argument #0 to 'watch_directory' (directory path is not a directory)");
        }
      }
      const watcher = await adapter.watch({
        recursive,
        change: [NODE_CHANGES.attached, NODE_CHANGES.created, NODE_CHANGES.removed],
        inclusive: true,
        path: directory_path
      });
      return event((dispatch) => {
        const destroy = watcher.subscribe((event9) => {
          switch (event9.change) {
            case NODE_CHANGES.attached:
              dispatch({
                change: FILE_SYSTEM_CHANGES.updated,
                path: event9.path,
                type: event9.type
              });
              break;
            case NODE_CHANGES.created:
              dispatch({
                change: FILE_SYSTEM_CHANGES.created,
                path: event9.path,
                type: event9.type
              });
              break;
            case NODE_CHANGES.removed:
              dispatch({
                change: FILE_SYSTEM_CHANGES.removed,
                path: event9.path,
                type: event9.type
              });
              break;
          }
        });
        return () => destroy();
      });
    }
    async watch_file(file_path) {
      if (!this.has_feature("can_watch")) {
        throw new Error("bad dispatch to 'watch_file' (adapter does not support feature)");
      }
      const {adapter} = this;
      const node = await adapter.get(file_path);
      if (!node) {
        throw new Error("bad argument #0 to 'watch_file' (file path not found)");
      } else if (node.type !== NODE_TYPES.file) {
        throw new Error("bad argument #0 to 'watch_file' (file path is not a file)");
      }
      const watcher = await adapter.watch({
        change: [NODE_CHANGES.attached, NODE_CHANGES.removed],
        path: file_path
      });
      return event((dispatch) => {
        async function update(event9) {
          switch (event9.change) {
            case NODE_CHANGES.attached:
              dispatch({
                change: FILE_SYSTEM_CHANGES.updated,
                path: event9.path,
                type: event9.type
              });
              break;
            case NODE_CHANGES.removed:
              dispatch({
                change: FILE_SYSTEM_CHANGES.removed,
                path: event9.path,
                type: event9.type
              });
              break;
          }
        }
        const destroy = watcher.subscribe(update);
        return () => destroy();
      });
    }
    async write_file(file_path, payload) {
      if (this.has_feature("is_readonly")) {
        throw new Error("bad dispatch to 'write_file' (adapter does not support feature)");
      }
      const {adapter} = this;
      file_path = normalize2(file_path);
      if (file_path === "/") {
        throw new Error("bad argument #0 to 'write_file' (file path is not a file)");
      }
      const node = await adapter.get(file_path);
      if (node && node.type !== NODE_TYPES.file) {
        throw new Error("bad argument #0 to 'write_file' (file path is not a file)");
      }
      const parent_path = dirname2(file_path);
      if (parent_path !== "/") {
        const parent_node = await adapter.get(parent_path);
        if (!parent_node || parent_node.type !== NODE_TYPES.directory) {
          throw new Error("bad argument #0 to 'write_file' (parent path is not a directory)");
        }
      }
      await adapter.put(file_path, NODE_TYPES.file);
      return adapter.write(file_path, payload);
    }
    async read_file_json(file_path, reviver) {
      const encoded = await this.read_file_text(file_path);
      return JSON.parse(encoded, reviver);
    }
    async read_file_text(file_path) {
      const payload = await this.read_file(file_path);
      return decode_utf8(payload);
    }
    write_file_json(file_path, value, replacer, space) {
      const encoded = JSON.stringify(value, replacer, space);
      return this.write_file_text(file_path, encoded);
    }
    write_file_text(file_path, text2) {
      const encoded = encode_utf8(text2);
      return this.write_file(file_path, encoded);
    }
  }

  // src/storage_registry.ts
  class StorageRegistry extends ImmutableMap {
    constructor() {
      super();
      this.EVENT_MOUNTED = event();
      this.EVENT_REGISTERED = event();
      this.EVENT_UNMOUNTED = event();
      this.EVENT_UNREGISTERED = event();
      this.clone = (node) => {
        const {storage} = node;
        return {storage};
      };
    }
    clear() {
      const nodes = this.entries();
      for (const [namespace, node] of nodes) {
        const {storage} = node;
        this.EVENT_UNREGISTERED.dispatch({namespace, storage});
      }
      super.clear();
    }
    delete(namespace) {
      const node = this.get(namespace);
      const deleted = super.delete(namespace);
      if (deleted && node) {
        this.EVENT_UNREGISTERED.dispatch({namespace, storage: node.storage});
      }
      return deleted;
    }
    resolve(uri2) {
      let url;
      try {
        url = new URL(uri2);
      } catch (err) {
        return void 0;
      }
      const namespace = url.protocol.slice(0, -1);
      const node = this.get(namespace);
      if (!node)
        return void 0;
      return {...node, namespace, path: url.pathname};
    }
    set(namespace, node) {
      const {storage} = node;
      super.set(namespace, {...node, namespace});
      storage.EVENT_MOUNTED.subscribe(() => this.EVENT_MOUNTED.dispatch({namespace, storage}));
      storage.EVENT_UNMOUNTED.subscribe(() => this.EVENT_UNMOUNTED.dispatch({namespace, storage}));
      this.EVENT_REGISTERED.dispatch({namespace, storage});
      return this;
    }
  }
  return require_src();
})();
//# sourceMappingURL=uristorage.umd.js.map

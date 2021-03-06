const DEFAULT_MIME_TYPE = "application/octet-stream";
var ENCODING_MODE;
(function(ENCODING_MODE2) {
  ENCODING_MODE2["bytes"] = "MODE_BYTES";
  ENCODING_MODE2["text"] = "MODE_TEXT";
})(ENCODING_MODE || (ENCODING_MODE = {}));
var NODE_CHANGES;
(function(NODE_CHANGES2) {
  NODE_CHANGES2["attached"] = "CHANGE_ATTACHED";
  NODE_CHANGES2["created"] = "CHANGE_CREATED";
  NODE_CHANGES2["updated"] = "CHANGE_UPDATED";
  NODE_CHANGES2["removed"] = "CHANGE_REMOVED";
})(NODE_CHANGES || (NODE_CHANGES = {}));
var NODE_TYPES;
(function(NODE_TYPES2) {
  NODE_TYPES2["directory"] = "NODE_DIRECTORY";
  NODE_TYPES2["file"] = "NODE_FILE";
  NODE_TYPES2["undefined"] = "NODE_UNDEFINED";
})(NODE_TYPES || (NODE_TYPES = {}));
export {
  DEFAULT_MIME_TYPE,
  ENCODING_MODE,
  NODE_CHANGES,
  NODE_TYPES
};
//# sourceMappingURL=constants.mjs.map

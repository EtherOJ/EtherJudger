module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(104);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, __unusedexports, __webpack_require__) {

const { requestLog } = __webpack_require__(916);
const {
  restEndpointMethods
} = __webpack_require__(842);

const Core = __webpack_require__(529);

const CORE_PLUGINS = [
  __webpack_require__(190),
  __webpack_require__(19), // deprecated: remove in v17
  requestLog,
  __webpack_require__(148),
  restEndpointMethods,
  __webpack_require__(430),

  __webpack_require__(850) // deprecated: remove in v17
];

const OctokitRest = Core.plugin(CORE_PLUGINS);

function DeprecatedOctokit(options) {
  const warn =
    options && options.log && options.log.warn
      ? options.log.warn
      : console.warn;
  warn(
    '[@octokit/rest] `const Octokit = require("@octokit/rest")` is deprecated. Use `const { Octokit } = require("@octokit/rest")` instead'
  );
  return new OctokitRest(options);
}

const Octokit = Object.assign(DeprecatedOctokit, {
  Octokit: OctokitRest
});

Object.keys(OctokitRest).forEach(key => {
  /* istanbul ignore else */
  if (OctokitRest.hasOwnProperty(key)) {
    Octokit[key] = OctokitRest[key];
  }
});

module.exports = Octokit;


/***/ }),

/***/ 1:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const childProcess = __webpack_require__(129);
const path = __webpack_require__(622);
const util_1 = __webpack_require__(669);
const ioUtil = __webpack_require__(672);
const exec = util_1.promisify(childProcess.exec);
/**
 * Copies a file or folder.
 * Based off of shelljs - https://github.com/shelljs/shelljs/blob/9237f66c52e5daa40458f94f9565e18e8132f5a6/src/cp.js
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See CopyOptions.
 */
function cp(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { force, recursive } = readCopyOptions(options);
        const destStat = (yield ioUtil.exists(dest)) ? yield ioUtil.stat(dest) : null;
        // Dest is an existing file, but not forcing
        if (destStat && destStat.isFile() && !force) {
            return;
        }
        // If dest is an existing directory, should copy inside.
        const newDest = destStat && destStat.isDirectory()
            ? path.join(dest, path.basename(source))
            : dest;
        if (!(yield ioUtil.exists(source))) {
            throw new Error(`no such file or directory: ${source}`);
        }
        const sourceStat = yield ioUtil.stat(source);
        if (sourceStat.isDirectory()) {
            if (!recursive) {
                throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
            }
            else {
                yield cpDirRecursive(source, newDest, 0, force);
            }
        }
        else {
            if (path.relative(source, newDest) === '') {
                // a file cannot be copied to itself
                throw new Error(`'${newDest}' and '${source}' are the same file`);
            }
            yield copyFile(source, newDest, force);
        }
    });
}
exports.cp = cp;
/**
 * Moves a path.
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See MoveOptions.
 */
function mv(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield ioUtil.exists(dest)) {
            let destExists = true;
            if (yield ioUtil.isDirectory(dest)) {
                // If dest is directory copy src into dest
                dest = path.join(dest, path.basename(source));
                destExists = yield ioUtil.exists(dest);
            }
            if (destExists) {
                if (options.force == null || options.force) {
                    yield rmRF(dest);
                }
                else {
                    throw new Error('Destination already exists');
                }
            }
        }
        yield mkdirP(path.dirname(dest));
        yield ioUtil.rename(source, dest);
    });
}
exports.mv = mv;
/**
 * Remove a path recursively with force
 *
 * @param inputPath path to remove
 */
function rmRF(inputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ioUtil.IS_WINDOWS) {
            // Node doesn't provide a delete operation, only an unlink function. This means that if the file is being used by another
            // program (e.g. antivirus), it won't be deleted. To address this, we shell out the work to rd/del.
            try {
                if (yield ioUtil.isDirectory(inputPath, true)) {
                    yield exec(`rd /s /q "${inputPath}"`);
                }
                else {
                    yield exec(`del /f /a "${inputPath}"`);
                }
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
            }
            // Shelling out fails to remove a symlink folder with missing source, this unlink catches that
            try {
                yield ioUtil.unlink(inputPath);
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
            }
        }
        else {
            let isDir = false;
            try {
                isDir = yield ioUtil.isDirectory(inputPath);
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
                return;
            }
            if (isDir) {
                yield exec(`rm -rf "${inputPath}"`);
            }
            else {
                yield ioUtil.unlink(inputPath);
            }
        }
    });
}
exports.rmRF = rmRF;
/**
 * Make a directory.  Creates the full path with folders in between
 * Will throw if it fails
 *
 * @param   fsPath        path to create
 * @returns Promise<void>
 */
function mkdirP(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ioUtil.mkdirP(fsPath);
    });
}
exports.mkdirP = mkdirP;
/**
 * Returns path of a tool had the tool actually been invoked.  Resolves via paths.
 * If you check and the tool does not exist, it will throw.
 *
 * @param     tool              name of the tool
 * @param     check             whether to check if tool exists
 * @returns   Promise<string>   path to tool
 */
function which(tool, check) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // recursive when check=true
        if (check) {
            const result = yield which(tool, false);
            if (!result) {
                if (ioUtil.IS_WINDOWS) {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
                }
                else {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
                }
            }
        }
        try {
            // build the list of extensions to try
            const extensions = [];
            if (ioUtil.IS_WINDOWS && process.env.PATHEXT) {
                for (const extension of process.env.PATHEXT.split(path.delimiter)) {
                    if (extension) {
                        extensions.push(extension);
                    }
                }
            }
            // if it's rooted, return it if exists. otherwise return empty.
            if (ioUtil.isRooted(tool)) {
                const filePath = yield ioUtil.tryGetExecutablePath(tool, extensions);
                if (filePath) {
                    return filePath;
                }
                return '';
            }
            // if any path separators, return empty
            if (tool.includes('/') || (ioUtil.IS_WINDOWS && tool.includes('\\'))) {
                return '';
            }
            // build the list of directories
            //
            // Note, technically "where" checks the current directory on Windows. From a toolkit perspective,
            // it feels like we should not do this. Checking the current directory seems like more of a use
            // case of a shell, and the which() function exposed by the toolkit should strive for consistency
            // across platforms.
            const directories = [];
            if (process.env.PATH) {
                for (const p of process.env.PATH.split(path.delimiter)) {
                    if (p) {
                        directories.push(p);
                    }
                }
            }
            // return the first match
            for (const directory of directories) {
                const filePath = yield ioUtil.tryGetExecutablePath(directory + path.sep + tool, extensions);
                if (filePath) {
                    return filePath;
                }
            }
            return '';
        }
        catch (err) {
            throw new Error(`which failed with message ${err.message}`);
        }
    });
}
exports.which = which;
function readCopyOptions(options) {
    const force = options.force == null ? true : options.force;
    const recursive = Boolean(options.recursive);
    return { force, recursive };
}
function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure there is not a run away recursive copy
        if (currentDepth >= 255)
            return;
        currentDepth++;
        yield mkdirP(destDir);
        const files = yield ioUtil.readdir(sourceDir);
        for (const fileName of files) {
            const srcFile = `${sourceDir}/${fileName}`;
            const destFile = `${destDir}/${fileName}`;
            const srcFileStat = yield ioUtil.lstat(srcFile);
            if (srcFileStat.isDirectory()) {
                // Recurse
                yield cpDirRecursive(srcFile, destFile, currentDepth, force);
            }
            else {
                yield copyFile(srcFile, destFile, force);
            }
        }
        // Change the mode for the newly created directory
        yield ioUtil.chmod(destDir, (yield ioUtil.stat(sourceDir)).mode);
    });
}
// Buffered file copy
function copyFile(srcFile, destFile, force) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((yield ioUtil.lstat(srcFile)).isSymbolicLink()) {
            // unlink/re-link it
            try {
                yield ioUtil.lstat(destFile);
                yield ioUtil.unlink(destFile);
            }
            catch (e) {
                // Try to override file permission
                if (e.code === 'EPERM') {
                    yield ioUtil.chmod(destFile, '0666');
                    yield ioUtil.unlink(destFile);
                }
                // other errors = it doesn't exist, no work to do
            }
            // Copy over symlink
            const symlinkFull = yield ioUtil.readlink(srcFile);
            yield ioUtil.symlink(symlinkFull, destFile, ioUtil.IS_WINDOWS ? 'junction' : null);
        }
        else if (!(yield ioUtil.exists(destFile)) || force) {
            yield ioUtil.copyFile(srcFile, destFile);
        }
    });
}
//# sourceMappingURL=io.js.map

/***/ }),

/***/ 2:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const os = __webpack_require__(87);
const macosRelease = __webpack_require__(118);
const winRelease = __webpack_require__(49);

const osName = (platform, release) => {
	if (!platform && release) {
		throw new Error('You can\'t specify a `release` without specifying `platform`');
	}

	platform = platform || os.platform();

	let id;

	if (platform === 'darwin') {
		if (!release && os.platform() === 'darwin') {
			release = os.release();
		}

		const prefix = release ? (Number(release.split('.')[0]) > 15 ? 'macOS' : 'OS X') : 'macOS';
		id = release ? macosRelease(release).name : '';
		return prefix + (id ? ' ' + id : '');
	}

	if (platform === 'linux') {
		if (!release && os.platform() === 'linux') {
			release = os.release();
		}

		id = release ? release.replace(/^(\d+\.\d+).*/, '$1') : '';
		return 'Linux' + (id ? ' ' + id : '');
	}

	if (platform === 'win32') {
		if (!release && os.platform() === 'win32') {
			release = os.release();
		}

		id = release ? winRelease(release) : '';
		return 'Windows' + (id ? ' ' + id : '');
	}

	return platform;
};

module.exports = osName;


/***/ }),

/***/ 9:
/***/ (function(module, __unusedexports, __webpack_require__) {

var once = __webpack_require__(969);

var noop = function() {};

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);
	var cancelled = false;

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		process.nextTick(onclosenexttick);
	};

	var onclosenexttick = function() {
		if (cancelled) return;
		if (readable && !(rs && (rs.ended && !rs.destroyed))) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && (ws.ended && !ws.destroyed))) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		cancelled = true;
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

module.exports = eos;


/***/ }),

/***/ 11:
/***/ (function(module) {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 16:
/***/ (function(module) {

module.exports = require("tls");

/***/ }),

/***/ 18:
/***/ (function(module) {

module.exports = eval("require")("encoding");


/***/ }),

/***/ 19:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationPlugin;

const { Deprecation } = __webpack_require__(692);
const once = __webpack_require__(969);

const deprecateAuthenticate = once((log, deprecation) => log.warn(deprecation));

const authenticate = __webpack_require__(674);
const beforeRequest = __webpack_require__(471);
const requestError = __webpack_require__(349);

function authenticationPlugin(octokit, options) {
  if (options.auth) {
    octokit.authenticate = () => {
      deprecateAuthenticate(
        octokit.log,
        new Deprecation(
          '[@octokit/rest] octokit.authenticate() is deprecated and has no effect when "auth" option is set on Octokit constructor'
        )
      );
    };
    return;
  }
  const state = {
    octokit,
    auth: false
  };
  octokit.authenticate = authenticate.bind(null, state);
  octokit.hook.before("request", beforeRequest.bind(null, state));
  octokit.hook.error("request", requestError.bind(null, state));
}


/***/ }),

/***/ 20:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const cp = __webpack_require__(129);
const parse = __webpack_require__(568);
const enoent = __webpack_require__(881);

function spawn(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);

    // Hook into child process "exit" event to emit an error if the command
    // does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    enoent.hookChildProcess(spawned, parsed);

    return spawned;
}

function spawnSync(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);

    // Analyze if the command does not exist, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);

    return result;
}

module.exports = spawn;
module.exports.spawn = spawn;
module.exports.sync = spawnSync;

module.exports._parse = parse;
module.exports._enoent = enoent;


/***/ }),

/***/ 24:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.BlockValue = exports.Chomp = void 0;

var _constants = __webpack_require__(383);

var _Node = __webpack_require__(974);

var _Range = __webpack_require__(994);

const Chomp = {
  CLIP: 'CLIP',
  KEEP: 'KEEP',
  STRIP: 'STRIP'
};
exports.Chomp = Chomp;

class BlockValue extends _Node.Node {
  constructor(type, props) {
    super(type, props);
    this.blockIndent = null;
    this.chomping = Chomp.CLIP;
    this.header = null;
  }

  get includesTrailingLines() {
    return this.chomping === Chomp.KEEP;
  }

  get strValue() {
    if (!this.valueRange || !this.context) return null;
    let {
      start,
      end
    } = this.valueRange;
    const {
      indent,
      src
    } = this.context;
    if (this.valueRange.isEmpty()) return '';
    let lastNewLine = null;
    let ch = src[end - 1];

    while (ch === '\n' || ch === '\t' || ch === ' ') {
      end -= 1;

      if (end <= start) {
        if (this.chomping === Chomp.KEEP) break;else return ''; // probably never happens
      }

      if (ch === '\n') lastNewLine = end;
      ch = src[end - 1];
    }

    let keepStart = end + 1;

    if (lastNewLine) {
      if (this.chomping === Chomp.KEEP) {
        keepStart = lastNewLine;
        end = this.valueRange.end;
      } else {
        end = lastNewLine;
      }
    }

    const bi = indent + this.blockIndent;
    const folded = this.type === _constants.Type.BLOCK_FOLDED;
    let atStart = true;
    let str = '';
    let sep = '';
    let prevMoreIndented = false;

    for (let i = start; i < end; ++i) {
      for (let j = 0; j < bi; ++j) {
        if (src[i] !== ' ') break;
        i += 1;
      }

      const ch = src[i];

      if (ch === '\n') {
        if (sep === '\n') str += '\n';else sep = '\n';
      } else {
        const lineEnd = _Node.Node.endOfLine(src, i);

        const line = src.slice(i, lineEnd);
        i = lineEnd;

        if (folded && (ch === ' ' || ch === '\t') && i < keepStart) {
          if (sep === ' ') sep = '\n';else if (!prevMoreIndented && !atStart && sep === '\n') sep = '\n\n';
          str += sep + line; //+ ((lineEnd < end && src[lineEnd]) || '')

          sep = lineEnd < end && src[lineEnd] || '';
          prevMoreIndented = true;
        } else {
          str += sep + line;
          sep = folded && i < keepStart ? ' ' : '\n';
          prevMoreIndented = false;
        }

        if (atStart && line !== '') atStart = false;
      }
    }

    return this.chomping === Chomp.STRIP ? str : str + '\n';
  }

  parseBlockHeader(start) {
    const {
      src
    } = this.context;
    let offset = start + 1;
    let bi = '';

    while (true) {
      const ch = src[offset];

      switch (ch) {
        case '-':
          this.chomping = Chomp.STRIP;
          break;

        case '+':
          this.chomping = Chomp.KEEP;
          break;

        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          bi += ch;
          break;

        default:
          this.blockIndent = Number(bi) || null;
          this.header = new _Range.Range(start, offset);
          return offset;
      }

      offset += 1;
    }
  }

  parseBlockValue(start) {
    const {
      indent,
      src
    } = this.context;
    let offset = start;
    let valueEnd = start;
    let bi = this.blockIndent ? indent + this.blockIndent - 1 : indent;
    let minBlockIndent = 1;

    for (let ch = src[offset]; ch === '\n'; ch = src[offset]) {
      offset += 1;
      if (_Node.Node.atDocumentBoundary(src, offset)) break;

      const end = _Node.Node.endOfBlockIndent(src, bi, offset); // should not include tab?


      if (end === null) break;

      if (!this.blockIndent) {
        // no explicit block indent, none yet detected
        const lineIndent = end - (offset + indent);

        if (src[end] !== '\n') {
          // first line with non-whitespace content
          if (lineIndent < minBlockIndent) {
            offset -= 1;
            break;
          }

          this.blockIndent = lineIndent;
          bi = indent + this.blockIndent - 1;
        } else if (lineIndent > minBlockIndent) {
          // empty line with more whitespace
          minBlockIndent = lineIndent;
        }
      }

      if (src[end] === '\n') {
        offset = end;
      } else {
        offset = valueEnd = _Node.Node.endOfLine(src, end);
      }
    }

    if (this.chomping !== Chomp.KEEP) {
      offset = src[valueEnd] ? valueEnd + 1 : valueEnd;
    }

    this.valueRange = new _Range.Range(start + 1, offset);
    return offset;
  }
  /**
   * Parses a block value from the source
   *
   * Accepted forms are:
   * ```
   * BS
   * block
   * lines
   *
   * BS #comment
   * block
   * lines
   * ```
   * where the block style BS matches the regexp `[|>][-+1-9]*` and block lines
   * are empty or have an indent level greater than `indent`.
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this block
   */


  parse(context, start) {
    this.context = context;
    const {
      src
    } = context;
    let offset = this.parseBlockHeader(start);
    offset = _Node.Node.endOfWhiteSpace(src, offset);
    offset = this.parseComment(offset);
    offset = this.parseBlockValue(offset);
    return offset;
  }

  setOrigRanges(cr, offset) {
    offset = super.setOrigRanges(cr, offset);
    return this.header ? this.header.setOrigRange(cr, offset) : offset;
  }

}

exports.BlockValue = BlockValue;

/***/ }),

/***/ 29:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.YAMLSeq = void 0;

var _toJSON = __webpack_require__(923);

var _Collection = __webpack_require__(380);

var _Scalar = __webpack_require__(515);

// Published as 'yaml/seq'
function asItemIndex(key) {
  let idx = key instanceof _Scalar.Scalar ? key.value : key;
  if (idx && typeof idx === 'string') idx = Number(idx);
  return Number.isInteger(idx) && idx >= 0 ? idx : null;
}

class YAMLSeq extends _Collection.Collection {
  add(value) {
    this.items.push(value);
  }

  delete(key) {
    const idx = asItemIndex(key);
    if (typeof idx !== 'number') return false;
    const del = this.items.splice(idx, 1);
    return del.length > 0;
  }

  get(key, keepScalar) {
    const idx = asItemIndex(key);
    if (typeof idx !== 'number') return undefined;
    const it = this.items[idx];
    return !keepScalar && it instanceof _Scalar.Scalar ? it.value : it;
  }

  has(key) {
    const idx = asItemIndex(key);
    return typeof idx === 'number' && idx < this.items.length;
  }

  set(key, value) {
    const idx = asItemIndex(key);
    if (typeof idx !== 'number') throw new Error(`Expected a valid index, not ${key}.`);
    this.items[idx] = value;
  }

  toJSON(_, ctx) {
    const seq = [];
    if (ctx && ctx.onCreate) ctx.onCreate(seq);
    let i = 0;

    for (const item of this.items) seq.push((0, _toJSON.toJSON)(item, String(i++), ctx));

    return seq;
  }

  toString(ctx, onComment, onChompKeep) {
    if (!ctx) return JSON.stringify(this);
    return super.toString(ctx, {
      blockItem: n => n.type === 'comment' ? n.str : `- ${n.str}`,
      flowChars: {
        start: '[',
        end: ']'
      },
      isMap: false,
      itemIndent: (ctx.indent || '') + '  '
    }, onComment, onChompKeep);
  }

}

exports.YAMLSeq = YAMLSeq;

/***/ }),

/***/ 39:
/***/ (function(module) {

"use strict";

module.exports = opts => {
	opts = opts || {};

	const env = opts.env || process.env;
	const platform = opts.platform || process.platform;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(env).find(x => x.toUpperCase() === 'PATH') || 'Path';
};


/***/ }),

/***/ 41:
/***/ (function(__unusedmodule, exports) {

"use strict";


exports.getLinePos = getLinePos;
exports.getLine = getLine;
exports.getPrettyContext = getPrettyContext;

function findLineStarts(src) {
  const ls = [0];
  let offset = src.indexOf('\n');

  while (offset !== -1) {
    offset += 1;
    ls.push(offset);
    offset = src.indexOf('\n', offset);
  }

  return ls;
}

function getSrcInfo(cst) {
  let lineStarts, src;

  if (typeof cst === 'string') {
    lineStarts = findLineStarts(cst);
    src = cst;
  } else {
    if (Array.isArray(cst)) cst = cst[0];

    if (cst && cst.context) {
      if (!cst.lineStarts) cst.lineStarts = findLineStarts(cst.context.src);
      lineStarts = cst.lineStarts;
      src = cst.context.src;
    }
  }

  return {
    lineStarts,
    src
  };
}
/**
 * @typedef {Object} LinePos - One-indexed position in the source
 * @property {number} line
 * @property {number} col
 */

/**
 * Determine the line/col position matching a character offset.
 *
 * Accepts a source string or a CST document as the second parameter. With
 * the latter, starting indices for lines are cached in the document as
 * `lineStarts: number[]`.
 *
 * Returns a one-indexed `{ line, col }` location if found, or
 * `undefined` otherwise.
 *
 * @param {number} offset
 * @param {string|Document|Document[]} cst
 * @returns {?LinePos}
 */


function getLinePos(offset, cst) {
  if (typeof offset !== 'number' || offset < 0) return null;
  const {
    lineStarts,
    src
  } = getSrcInfo(cst);
  if (!lineStarts || !src || offset > src.length) return null;

  for (let i = 0; i < lineStarts.length; ++i) {
    const start = lineStarts[i];

    if (offset < start) {
      return {
        line: i,
        col: offset - lineStarts[i - 1] + 1
      };
    }

    if (offset === start) return {
      line: i + 1,
      col: 1
    };
  }

  const line = lineStarts.length;
  return {
    line,
    col: offset - lineStarts[line - 1] + 1
  };
}
/**
 * Get a specified line from the source.
 *
 * Accepts a source string or a CST document as the second parameter. With
 * the latter, starting indices for lines are cached in the document as
 * `lineStarts: number[]`.
 *
 * Returns the line as a string if found, or `null` otherwise.
 *
 * @param {number} line One-indexed line number
 * @param {string|Document|Document[]} cst
 * @returns {?string}
 */


function getLine(line, cst) {
  const {
    lineStarts,
    src
  } = getSrcInfo(cst);
  if (!lineStarts || !(line >= 1) || line > lineStarts.length) return null;
  const start = lineStarts[line - 1];
  let end = lineStarts[line]; // undefined for last line; that's ok for slice()

  while (end && end > start && src[end - 1] === '\n') --end;

  return src.slice(start, end);
}
/**
 * Pretty-print the starting line from the source indicated by the range `pos`
 *
 * Trims output to `maxWidth` chars while keeping the starting column visible,
 * using `…` at either end to indicate dropped characters.
 *
 * Returns a two-line string (or `null`) with `\n` as separator; the second line
 * will hold appropriately indented `^` marks indicating the column range.
 *
 * @param {Object} pos
 * @param {LinePos} pos.start
 * @param {LinePos} [pos.end]
 * @param {string|Document|Document[]*} cst
 * @param {number} [maxWidth=80]
 * @returns {?string}
 */


function getPrettyContext({
  start,
  end
}, cst, maxWidth = 80) {
  let src = getLine(start.line, cst);
  if (!src) return null;
  let {
    col
  } = start;

  if (src.length > maxWidth) {
    if (col <= maxWidth - 10) {
      src = src.substr(0, maxWidth - 1) + '…';
    } else {
      const halfWidth = Math.round(maxWidth / 2);
      if (src.length > col + halfWidth) src = src.substr(0, col + halfWidth - 1) + '…';
      col -= src.length - maxWidth;
      src = '…' + src.substr(1 - maxWidth);
    }
  }

  let errLen = 1;
  let errEnd = '';

  if (end) {
    if (end.line === start.line && col + (end.col - start.col) <= maxWidth + 1) {
      errLen = end.col - start.col;
    } else {
      errLen = Math.min(src.length + 1, maxWidth) - col;
      errEnd = '…';
    }
  }

  const offset = col > 1 ? ' '.repeat(col - 1) : '';
  const err = '^'.repeat(errLen);
  return `${src}\n${offset}${err}${errEnd}`;
}

/***/ }),

/***/ 47:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = factory;

const Octokit = __webpack_require__(402);
const registerPlugin = __webpack_require__(855);

function factory(plugins) {
  const Api = Octokit.bind(null, plugins || []);
  Api.plugin = registerPlugin.bind(null, plugins || []);
  return Api;
}


/***/ }),

/***/ 49:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const os = __webpack_require__(87);
const execa = __webpack_require__(955);

// Reference: https://www.gaijin.at/en/lstwinver.php
const names = new Map([
	['10.0', '10'],
	['6.3', '8.1'],
	['6.2', '8'],
	['6.1', '7'],
	['6.0', 'Vista'],
	['5.2', 'Server 2003'],
	['5.1', 'XP'],
	['5.0', '2000'],
	['4.9', 'ME'],
	['4.1', '98'],
	['4.0', '95']
]);

const windowsRelease = release => {
	const version = /\d+\.\d/.exec(release || os.release());

	if (release && !version) {
		throw new Error('`release` argument doesn\'t match `n.n`');
	}

	const ver = (version || [])[0];

	// Server 2008, 2012, 2016, and 2019 versions are ambiguous with desktop versions and must be detected at runtime.
	// If `release` is omitted or we're on a Windows system, and the version number is an ambiguous version
	// then use `wmic` to get the OS caption: https://msdn.microsoft.com/en-us/library/aa394531(v=vs.85).aspx
	// If `wmic` is obsoloete (later versions of Windows 10), use PowerShell instead.
	// If the resulting caption contains the year 2008, 2012, 2016 or 2019, it is a server version, so return a server OS name.
	if ((!release || release === os.release()) && ['6.1', '6.2', '6.3', '10.0'].includes(ver)) {
		let stdout;
		try {
			stdout = execa.sync('powershell', ['(Get-CimInstance -ClassName Win32_OperatingSystem).caption']).stdout || '';
		} catch (_) {
			stdout = execa.sync('wmic', ['os', 'get', 'Caption']).stdout || '';
		}

		const year = (stdout.match(/2008|2012|2016|2019/) || [])[0];

		if (year) {
			return `Server ${year}`;
		}
	}

	return names.get(ver);
};

module.exports = windowsRelease;


/***/ }),

/***/ 77:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.json = void 0;

var _map = __webpack_require__(732);

var _seq = __webpack_require__(767);

var _Scalar = __webpack_require__(515);

var _string = __webpack_require__(591);

var _options = __webpack_require__(422);

/* global BigInt */
const intIdentify = value => typeof value === 'bigint' || Number.isInteger(value);

const stringifyJSON = ({
  value
}) => JSON.stringify(value);

const json = [_map.map, _seq.seq, {
  identify: value => typeof value === 'string',
  default: true,
  tag: 'tag:yaml.org,2002:str',
  resolve: _string.resolveString,
  stringify: stringifyJSON
}, {
  identify: value => value == null,
  createNode: (schema, value, ctx) => ctx.wrapScalars ? new _Scalar.Scalar(null) : null,
  default: true,
  tag: 'tag:yaml.org,2002:null',
  test: /^null$/,
  resolve: () => null,
  stringify: stringifyJSON
}, {
  identify: value => typeof value === 'boolean',
  default: true,
  tag: 'tag:yaml.org,2002:bool',
  test: /^true|false$/,
  resolve: str => str === 'true',
  stringify: stringifyJSON
}, {
  identify: intIdentify,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  test: /^-?(?:0|[1-9][0-9]*)$/,
  resolve: str => _options.intOptions.asBigInt ? BigInt(str) : parseInt(str, 10),
  stringify: ({
    value
  }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
  resolve: str => parseFloat(str),
  stringify: stringifyJSON
}];
exports.json = json;

json.scalarFallback = str => {
  throw new SyntaxError(`Unresolved plain scalar ${JSON.stringify(str)}`);
};

/***/ }),

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 104:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const core = __webpack_require__(470);
const github = __webpack_require__(469);
const exec = __webpack_require__(986);
const util = __webpack_require__(669);
const execw = util.promisify(__webpack_require__(129).exec);
const fs = __webpack_require__(747).promises;

const Problem = __webpack_require__(374);
const Judger = __webpack_require__(531);

const ErrorEnum = {
    SUCCESS: 0,
    INVALID_CONFIG: -1,
    FORK_FAILED: -2,
    PTHREAD_FAILED: -3,
    WAIT_FAILED: -4,
    ROOT_REQUIRED: -5,
    LOAD_SECCOMP_FAILED: -6,
    SETRLIMIT_FAILED: -7,
    DUP2_FAILED: -8,
    SETUID_FAILED: -9,
    EXECVE_FAILED: -10,
    SPJ_ERROR: -11,
    GA_WRONG_TRIGGER: -258,
    GA_UNAUTHORIZED: -259,
    CHECKOUT_FAILED: -273,
    COMPILE_ERROR: -274,
};

let env = {};
function __fail(info, result = -1) {
    core.setFailed(`Result\n${JSON.stringify({
        result: 'Error',
        env,
        error: result,
        error_message: info,
    }, null, 2)}`);
}

(async () => {

    const context = github.context;
    if (context.eventName !== 'pull_request') {
        __fail('This Action should be triggered in a Pull Request', ErrorEnum.GA_WRONG_TRIGGER);
        return;
    }

    const token = process.env['GITHUB_TOKEN'] || '';
    if (token === '') {
        __fail('No GITHUB_TOKEN was provided', ErrorEnum.GA_UNAUTHORIZED);
        return;
    }

    const workdir = process.env['GITHUB_WORKSPACE'];

    const src = 'solution.cpp';

    core.startGroup('Collect Environment Data');
    async function execr(...args) {
        return (await execw(...args)).stdout.trim();
    }

    const vlibjudger = await execr(`${__dirname}/libjudger.so --version`);
    const vcompiler = (await execr('g++ --version')).split('\n')[0];

    env = {
        timestamp: +new Date(),
        judger: context.action,
        libjudger_version: vlibjudger,
        gcc_version: vcompiler,
        commit_sha: context.sha,
        repository: context.repo,
    };
    core.endGroup();
    
    core.startGroup('Checkout problem data');
    let problem;
    try {
        const k = await fs.readFile('.problem');
        const [remote, ref] = k.toString().trim().split(' ');
        await exec.exec('git init pdata');
        const cwd = [undefined, { cwd : 'pdata' }];

        await exec.exec(`git remote add origin ${remote}`, ...cwd);
        await exec.exec(`git fetch origin +${ref}:refs/remotes/origin/master`, ...cwd);
        await exec.exec('git checkout -B master refs/remotes/origin/master', ...cwd);
        problem = new Problem(`${workdir}/pdata`);
        
    } catch (e) {
        __fail(`Error processing problem:: ${e}`, ErrorEnum.CHECKOUT_FAILED);
        return;
    }

    core.endGroup();

    const destExecutable = `${__dirname}/solution.o`;

    core.startGroup('Compile Source');
    try {
        await exec.exec(`g++ ${src} -o ${destExecutable}`);
    } catch (e) {
        __fail(`Compilation Error:: ${e}`, ErrorEnum.COMPILE_ERROR);
        return;
    }
    core.endGroup();

    const judger = new Judger(problem, destExecutable, env);
    try {
        const rst = await judger.testAll();
        if(rst.total === 0) {
            __fail('No testcases provided', ErrorEnum.CHECKOUT_FAILED);
            return;
        }
        if(rst.result === 'Accepted') {
            core.warning(`Result\n${JSON.stringify(rst, null, 2)}`);
        } else {
            core.setFailed(`Result\n${JSON.stringify(rst, null, 2)}`);
        }
        
    }catch(e){
        core.setFailed(e);
    }


})();



/***/ }),

/***/ 118:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const os = __webpack_require__(87);

const nameMap = new Map([
	[19, 'Catalina'],
	[18, 'Mojave'],
	[17, 'High Sierra'],
	[16, 'Sierra'],
	[15, 'El Capitan'],
	[14, 'Yosemite'],
	[13, 'Mavericks'],
	[12, 'Mountain Lion'],
	[11, 'Lion'],
	[10, 'Snow Leopard'],
	[9, 'Leopard'],
	[8, 'Tiger'],
	[7, 'Panther'],
	[6, 'Jaguar'],
	[5, 'Puma']
]);

const macosRelease = release => {
	release = Number((release || os.release()).split('.')[0]);
	return {
		name: nameMap.get(release),
		version: '10.' + (release - 4)
	};
};

module.exports = macosRelease;
// TODO: remove this in the next major version
module.exports.default = macosRelease;


/***/ }),

/***/ 119:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.PlainValue = void 0;

var _Node = __webpack_require__(974);

var _Range = __webpack_require__(994);

class PlainValue extends _Node.Node {
  static endOfLine(src, start, inFlow) {
    let ch = src[start];
    let offset = start;

    while (ch && ch !== '\n') {
      if (inFlow && (ch === '[' || ch === ']' || ch === '{' || ch === '}' || ch === ',')) break;
      const next = src[offset + 1];
      if (ch === ':' && (!next || next === '\n' || next === '\t' || next === ' ' || inFlow && next === ',')) break;
      if ((ch === ' ' || ch === '\t') && next === '#') break;
      offset += 1;
      ch = next;
    }

    return offset;
  }

  get strValue() {
    if (!this.valueRange || !this.context) return null;
    let {
      start,
      end
    } = this.valueRange;
    const {
      src
    } = this.context;
    let ch = src[end - 1];

    while (start < end && (ch === '\n' || ch === '\t' || ch === ' ')) ch = src[--end - 1];

    ch = src[start];

    while (start < end && (ch === '\n' || ch === '\t' || ch === ' ')) ch = src[++start];

    let str = '';

    for (let i = start; i < end; ++i) {
      const ch = src[i];

      if (ch === '\n') {
        const {
          fold,
          offset
        } = _Node.Node.foldNewline(src, i, -1);

        str += fold;
        i = offset;
      } else if (ch === ' ' || ch === '\t') {
        // trim trailing whitespace
        const wsStart = i;
        let next = src[i + 1];

        while (i < end && (next === ' ' || next === '\t')) {
          i += 1;
          next = src[i + 1];
        }

        if (next !== '\n') str += i > wsStart ? src.slice(wsStart, i + 1) : ch;
      } else {
        str += ch;
      }
    }

    return str;
  }

  parseBlockValue(start) {
    const {
      indent,
      inFlow,
      src
    } = this.context;
    let offset = start;
    let valueEnd = start;

    for (let ch = src[offset]; ch === '\n'; ch = src[offset]) {
      if (_Node.Node.atDocumentBoundary(src, offset + 1)) break;

      const end = _Node.Node.endOfBlockIndent(src, indent, offset + 1);

      if (end === null || src[end] === '#') break;

      if (src[end] === '\n') {
        offset = end;
      } else {
        valueEnd = PlainValue.endOfLine(src, end, inFlow);
        offset = valueEnd;
      }
    }

    if (this.valueRange.isEmpty()) this.valueRange.start = start;
    this.valueRange.end = valueEnd;
    return valueEnd;
  }
  /**
   * Parses a plain value from the source
   *
   * Accepted forms are:
   * ```
   * #comment
   *
   * first line
   *
   * first line #comment
   *
   * first line
   * block
   * lines
   *
   * #comment
   * block
   * lines
   * ```
   * where block lines are empty or have an indent level greater than `indent`.
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar, may be `\n`
   */


  parse(context, start) {
    this.context = context;
    const {
      inFlow,
      src
    } = context;
    let offset = start;
    const ch = src[offset];

    if (ch && ch !== '#' && ch !== '\n') {
      offset = PlainValue.endOfLine(src, start, inFlow);
    }

    this.valueRange = new _Range.Range(start, offset);
    offset = _Node.Node.endOfWhiteSpace(src, offset);
    offset = this.parseComment(offset);

    if (!this.hasComment || this.valueRange.isEmpty()) {
      offset = this.parseBlockValue(offset);
    }

    return offset;
  }

}

exports.PlainValue = PlainValue;

/***/ }),

/***/ 126:
/***/ (function(module) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    Set = getNative(root, 'Set'),
    nativeCreate = getNative(Object, 'create');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each
 * element is kept.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return (array && array.length)
    ? baseUniq(array)
    : [];
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = uniq;


/***/ }),

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 141:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


var net = __webpack_require__(631);
var tls = __webpack_require__(16);
var http = __webpack_require__(605);
var https = __webpack_require__(211);
var events = __webpack_require__(614);
var assert = __webpack_require__(357);
var util = __webpack_require__(669);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 143:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = withAuthorizationPrefix;

const atob = __webpack_require__(368);

const REGEX_IS_BASIC_AUTH = /^[\w-]+:/;

function withAuthorizationPrefix(authorization) {
  if (/^(basic|bearer|token) /i.test(authorization)) {
    return authorization;
  }

  try {
    if (REGEX_IS_BASIC_AUTH.test(atob(authorization))) {
      return `basic ${authorization}`;
    }
  } catch (error) {}

  if (authorization.split(/\./).length === 3) {
    return `bearer ${authorization}`;
  }

  return `token ${authorization}`;
}


/***/ }),

/***/ 145:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const pump = __webpack_require__(453);
const bufferStream = __webpack_require__(966);

class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

function getStream(inputStream, options) {
	if (!inputStream) {
		return Promise.reject(new Error('Expected a stream'));
	}

	options = Object.assign({maxBuffer: Infinity}, options);

	const {maxBuffer} = options;

	let stream;
	return new Promise((resolve, reject) => {
		const rejectPromise = error => {
			if (error) { // A null check
				error.bufferedData = stream.getBufferedValue();
			}
			reject(error);
		};

		stream = pump(inputStream, bufferStream(options), error => {
			if (error) {
				rejectPromise(error);
				return;
			}

			resolve();
		});

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	}).then(() => stream.getBufferedValue());
}

module.exports = getStream;
module.exports.buffer = (stream, options) => getStream(stream, Object.assign({}, options, {encoding: 'buffer'}));
module.exports.array = (stream, options) => getStream(stream, Object.assign({}, options, {array: true}));
module.exports.MaxBufferError = MaxBufferError;


/***/ }),

/***/ 148:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = paginatePlugin;

const { paginateRest } = __webpack_require__(299);

function paginatePlugin(octokit) {
  Object.assign(octokit, paginateRest(octokit));
}


/***/ }),

/***/ 156:
/***/ (function(__unusedmodule, exports) {

"use strict";


exports.Node = void 0;

class Node {}

exports.Node = Node;

/***/ }),

/***/ 168:
/***/ (function(module) {

"use strict";

const alias = ['stdin', 'stdout', 'stderr'];

const hasAlias = opts => alias.some(x => Boolean(opts[x]));

module.exports = opts => {
	if (!opts) {
		return null;
	}

	if (opts.stdio && hasAlias(opts)) {
		throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${alias.map(x => `\`${x}\``).join(', ')}`);
	}

	if (typeof opts.stdio === 'string') {
		return opts.stdio;
	}

	const stdio = opts.stdio || [];

	if (!Array.isArray(stdio)) {
		throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	}

	const result = [];
	const len = Math.max(stdio.length, alias.length);

	for (let i = 0; i < len; i++) {
		let value = null;

		if (stdio[i] !== undefined) {
			value = stdio[i];
		} else if (opts[alias[i]] !== undefined) {
			value = opts[alias[i]];
		}

		result[i] = value;
	}

	return result;
};


/***/ }),

/***/ 185:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.FlowCollection = void 0;

var _constants = __webpack_require__(383);

var _errors = __webpack_require__(405);

var _BlankLine = __webpack_require__(794);

var _Comment = __webpack_require__(487);

var _Node = __webpack_require__(974);

var _Range = __webpack_require__(994);

class FlowCollection extends _Node.Node {
  constructor(type, props) {
    super(type, props);
    this.items = null;
  }

  prevNodeIsJsonLike(idx = this.items.length) {
    const node = this.items[idx - 1];
    return !!node && (node.jsonLike || node.type === _constants.Type.COMMENT && this.prevNodeIsJsonLike(idx - 1));
  }
  /**
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this
   */


  parse(context, start) {
    this.context = context;
    const {
      parseNode,
      src
    } = context;
    let {
      indent,
      lineStart
    } = context;
    let char = src[start]; // { or [

    this.items = [{
      char,
      offset: start
    }];

    let offset = _Node.Node.endOfWhiteSpace(src, start + 1);

    char = src[offset];

    while (char && char !== ']' && char !== '}') {
      switch (char) {
        case '\n':
          {
            lineStart = offset + 1;

            const wsEnd = _Node.Node.endOfWhiteSpace(src, lineStart);

            if (src[wsEnd] === '\n') {
              const blankLine = new _BlankLine.BlankLine();
              lineStart = blankLine.parse({
                src
              }, lineStart);
              this.items.push(blankLine);
            }

            offset = _Node.Node.endOfIndent(src, lineStart);

            if (offset <= lineStart + indent) {
              char = src[offset];

              if (offset < lineStart + indent || char !== ']' && char !== '}') {
                const msg = 'Insufficient indentation in flow collection';
                this.error = new _errors.YAMLSemanticError(this, msg);
              }
            }
          }
          break;

        case ',':
          {
            this.items.push({
              char,
              offset
            });
            offset += 1;
          }
          break;

        case '#':
          {
            const comment = new _Comment.Comment();
            offset = comment.parse({
              src
            }, offset);
            this.items.push(comment);
          }
          break;

        case '?':
        case ':':
          {
            const next = src[offset + 1];

            if (next === '\n' || next === '\t' || next === ' ' || next === ',' || // in-flow : after JSON-like key does not need to be followed by whitespace
            char === ':' && this.prevNodeIsJsonLike()) {
              this.items.push({
                char,
                offset
              });
              offset += 1;
              break;
            }
          }
        // fallthrough

        default:
          {
            const node = parseNode({
              atLineStart: false,
              inCollection: false,
              inFlow: true,
              indent: -1,
              lineStart,
              parent: this
            }, offset);

            if (!node) {
              // at next document start
              this.valueRange = new _Range.Range(start, offset);
              return offset;
            }

            this.items.push(node);
            offset = _Node.Node.normalizeOffset(src, node.range.end);
          }
      }

      offset = _Node.Node.endOfWhiteSpace(src, offset);
      char = src[offset];
    }

    this.valueRange = new _Range.Range(start, offset + 1);

    if (char) {
      this.items.push({
        char,
        offset
      });
      offset = _Node.Node.endOfWhiteSpace(src, offset + 1);
      offset = this.parseComment(offset);
    }

    return offset;
  }

  setOrigRanges(cr, offset) {
    offset = super.setOrigRanges(cr, offset);
    this.items.forEach(node => {
      if (node instanceof _Node.Node) {
        offset = node.setOrigRanges(cr, offset);
      } else if (cr.length === 0) {
        node.origOffset = node.offset;
      } else {
        let i = offset;

        while (i < cr.length) {
          if (cr[i] > node.offset) break;else ++i;
        }

        node.origOffset = node.offset + i;
        offset = i;
      }
    });
    return offset;
  }

  toString() {
    const {
      context: {
        src
      },
      items,
      range,
      value
    } = this;
    if (value != null) return value;
    const nodes = items.filter(item => item instanceof _Node.Node);
    let str = '';
    let prevEnd = range.start;
    nodes.forEach(node => {
      const prefix = src.slice(prevEnd, node.range.start);
      prevEnd = node.range.end;
      str += prefix + String(node);

      if (str[str.length - 1] === '\n' && src[prevEnd - 1] !== '\n' && src[prevEnd] === '\n') {
        // Comment range does not include the terminal newline, but its
        // stringified value does. Without this fix, newlines at comment ends
        // get duplicated.
        prevEnd += 1;
      }
    });
    str += src.slice(prevEnd, range.end);
    return _Node.Node.addStringTerminator(src, range.end, str);
  }

}

exports.FlowCollection = FlowCollection;

/***/ }),

/***/ 190:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationPlugin;

const { createTokenAuth } = __webpack_require__(813);
const { Deprecation } = __webpack_require__(692);
const once = __webpack_require__(969);

const beforeRequest = __webpack_require__(863);
const requestError = __webpack_require__(293);
const validate = __webpack_require__(954);
const withAuthorizationPrefix = __webpack_require__(143);

const deprecateAuthBasic = once((log, deprecation) => log.warn(deprecation));
const deprecateAuthObject = once((log, deprecation) => log.warn(deprecation));

function authenticationPlugin(octokit, options) {
  // If `options.authStrategy` is set then use it and pass in `options.auth`
  if (options.authStrategy) {
    const auth = options.authStrategy(options.auth);
    octokit.hook.wrap("request", auth.hook);
    octokit.auth = auth;
    return;
  }

  // If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
  // is unauthenticated. The `octokit.auth()` method is a no-op and no request hook is registred.
  if (!options.auth) {
    octokit.auth = () =>
      Promise.resolve({
        type: "unauthenticated"
      });
    return;
  }

  const isBasicAuthString =
    typeof options.auth === "string" &&
    /^basic/.test(withAuthorizationPrefix(options.auth));

  // If only `options.auth` is set to a string, use the default token authentication strategy.
  if (typeof options.auth === "string" && !isBasicAuthString) {
    const auth = createTokenAuth(options.auth);
    octokit.hook.wrap("request", auth.hook);
    octokit.auth = auth;
    return;
  }

  // Otherwise log a deprecation message
  const [deprecationMethod, deprecationMessapge] = isBasicAuthString
    ? [
        deprecateAuthBasic,
        'Setting the "new Octokit({ auth })" option to a Basic Auth string is deprecated. Use https://github.com/octokit/auth-basic.js instead. See (https://octokit.github.io/rest.js/#authentication)'
      ]
    : [
        deprecateAuthObject,
        'Setting the "new Octokit({ auth })" option to an object without also setting the "authStrategy" option is deprecated and will be removed in v17. See (https://octokit.github.io/rest.js/#authentication)'
      ];
  deprecationMethod(
    octokit.log,
    new Deprecation("[@octokit/rest] " + deprecationMessapge)
  );

  octokit.auth = () =>
    Promise.resolve({
      type: "deprecated",
      message: deprecationMessapge
    });

  validate(options.auth);

  const state = {
    octokit,
    auth: options.auth
  };

  octokit.hook.before("request", beforeRequest.bind(null, state));
  octokit.hook.error("request", requestError.bind(null, state));
}


/***/ }),

/***/ 195:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.failsafe = void 0;

var _map = __webpack_require__(732);

var _seq = __webpack_require__(767);

var _string = __webpack_require__(591);

const failsafe = [_map.map, _seq.seq, _string.string];
exports.failsafe = failsafe;

/***/ }),

/***/ 197:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = isexe
isexe.sync = sync

var fs = __webpack_require__(747)

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), options)
}

function checkStat (stat, options) {
  return stat.isFile() && checkMode(stat, options)
}

function checkMode (stat, options) {
  var mod = stat.mode
  var uid = stat.uid
  var gid = stat.gid

  var myUid = options.uid !== undefined ?
    options.uid : process.getuid && process.getuid()
  var myGid = options.gid !== undefined ?
    options.gid : process.getgid && process.getgid()

  var u = parseInt('100', 8)
  var g = parseInt('010', 8)
  var o = parseInt('001', 8)
  var ug = u | g

  var ret = (mod & o) ||
    (mod & g) && gid === myGid ||
    (mod & u) && uid === myUid ||
    (mod & ug) && myUid === 0

  return ret
}


/***/ }),

/***/ 211:
/***/ (function(module) {

module.exports = require("https");

/***/ }),

/***/ 215:
/***/ (function(module) {

module.exports = {"_from":"@octokit/rest@^16.43.1","_id":"@octokit/rest@16.43.1","_inBundle":false,"_integrity":"sha512-gfFKwRT/wFxq5qlNjnW2dh+qh74XgTQ2B179UX5K1HYCluioWj8Ndbgqw2PVqa1NnVJkGHp2ovMpVn/DImlmkw==","_location":"/@octokit/rest","_phantomChildren":{"@octokit/types":"2.15.0","deprecation":"2.3.1","once":"1.4.0","os-name":"3.1.0"},"_requested":{"type":"range","registry":true,"raw":"@octokit/rest@^16.43.1","name":"@octokit/rest","escapedName":"@octokit%2frest","scope":"@octokit","rawSpec":"^16.43.1","saveSpec":null,"fetchSpec":"^16.43.1"},"_requiredBy":["/@actions/github"],"_resolved":"https://registry.npmjs.org/@octokit/rest/-/rest-16.43.1.tgz","_shasum":"3b11e7d1b1ac2bbeeb23b08a17df0b20947eda6b","_spec":"@octokit/rest@^16.43.1","_where":"/home/xd/Projects/covellite/judger-action/node_modules/@actions/github","author":{"name":"Gregor Martynus","url":"https://github.com/gr2m"},"bugs":{"url":"https://github.com/octokit/rest.js/issues"},"bundleDependencies":false,"bundlesize":[{"path":"./dist/octokit-rest.min.js.gz","maxSize":"33 kB"}],"contributors":[{"name":"Mike de Boer","email":"info@mikedeboer.nl"},{"name":"Fabian Jakobs","email":"fabian@c9.io"},{"name":"Joe Gallo","email":"joe@brassafrax.com"},{"name":"Gregor Martynus","url":"https://github.com/gr2m"}],"dependencies":{"@octokit/auth-token":"^2.4.0","@octokit/plugin-paginate-rest":"^1.1.1","@octokit/plugin-request-log":"^1.0.0","@octokit/plugin-rest-endpoint-methods":"2.4.0","@octokit/request":"^5.2.0","@octokit/request-error":"^1.0.2","atob-lite":"^2.0.0","before-after-hook":"^2.0.0","btoa-lite":"^1.0.0","deprecation":"^2.0.0","lodash.get":"^4.4.2","lodash.set":"^4.3.2","lodash.uniq":"^4.5.0","octokit-pagination-methods":"^1.1.0","once":"^1.4.0","universal-user-agent":"^4.0.0"},"deprecated":false,"description":"GitHub REST API client for Node.js","devDependencies":{"@gimenete/type-writer":"^0.1.3","@octokit/auth":"^1.1.1","@octokit/fixtures-server":"^5.0.6","@octokit/graphql":"^4.2.0","@types/node":"^13.1.0","bundlesize":"^0.18.0","chai":"^4.1.2","compression-webpack-plugin":"^3.1.0","cypress":"^3.0.0","glob":"^7.1.2","http-proxy-agent":"^4.0.0","lodash.camelcase":"^4.3.0","lodash.merge":"^4.6.1","lodash.upperfirst":"^4.3.1","lolex":"^5.1.2","mkdirp":"^1.0.0","mocha":"^7.0.1","mustache":"^4.0.0","nock":"^11.3.3","npm-run-all":"^4.1.2","nyc":"^15.0.0","prettier":"^1.14.2","proxy":"^1.0.0","semantic-release":"^17.0.0","sinon":"^8.0.0","sinon-chai":"^3.0.0","sort-keys":"^4.0.0","string-to-arraybuffer":"^1.0.0","string-to-jsdoc-comment":"^1.0.0","typescript":"^3.3.1","webpack":"^4.0.0","webpack-bundle-analyzer":"^3.0.0","webpack-cli":"^3.0.0"},"files":["index.js","index.d.ts","lib","plugins"],"homepage":"https://github.com/octokit/rest.js#readme","keywords":["octokit","github","rest","api-client"],"license":"MIT","name":"@octokit/rest","nyc":{"ignore":["test"]},"publishConfig":{"access":"public"},"release":{"publish":["@semantic-release/npm",{"path":"@semantic-release/github","assets":["dist/*","!dist/*.map.gz"]}]},"repository":{"type":"git","url":"git+https://github.com/octokit/rest.js.git"},"scripts":{"build":"npm-run-all build:*","build:browser":"npm-run-all build:browser:*","build:browser:development":"webpack --mode development --entry . --output-library=Octokit --output=./dist/octokit-rest.js --profile --json > dist/bundle-stats.json","build:browser:production":"webpack --mode production --entry . --plugin=compression-webpack-plugin --output-library=Octokit --output-path=./dist --output-filename=octokit-rest.min.js --devtool source-map","build:ts":"npm run -s update-endpoints:typescript","coverage":"nyc report --reporter=html && open coverage/index.html","generate-bundle-report":"webpack-bundle-analyzer dist/bundle-stats.json --mode=static --no-open --report dist/bundle-report.html","lint":"prettier --check '{lib,plugins,scripts,test}/**/*.{js,json,ts}' 'docs/*.{js,json}' 'docs/src/**/*' index.js README.md package.json","lint:fix":"prettier --write '{lib,plugins,scripts,test}/**/*.{js,json,ts}' 'docs/*.{js,json}' 'docs/src/**/*' index.js README.md package.json","postvalidate:ts":"tsc --noEmit --target es6 test/typescript-validate.ts","prebuild:browser":"mkdirp dist/","pretest":"npm run -s lint","prevalidate:ts":"npm run -s build:ts","start-fixtures-server":"octokit-fixtures-server","test":"nyc mocha test/mocha-node-setup.js \"test/*/**/*-test.js\"","test:browser":"cypress run --browser chrome","update-endpoints":"npm-run-all update-endpoints:*","update-endpoints:fetch-json":"node scripts/update-endpoints/fetch-json","update-endpoints:typescript":"node scripts/update-endpoints/typescript","validate:ts":"tsc --target es6 --noImplicitAny index.d.ts"},"types":"index.d.ts","version":"16.43.1"};

/***/ }),

/***/ 255:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.Schema = void 0;

var _warnings = __webpack_require__(847);

var _constants = __webpack_require__(383);

var _errors = __webpack_require__(405);

var _stringify = __webpack_require__(315);

var _tags = __webpack_require__(339);

var _string = __webpack_require__(591);

var _Alias = __webpack_require__(637);

var _Collection = __webpack_require__(380);

var _Node = __webpack_require__(156);

var _Pair = __webpack_require__(325);

var _Scalar = __webpack_require__(515);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const isMap = ({
  type
}) => type === _constants.Type.FLOW_MAP || type === _constants.Type.MAP;

const isSeq = ({
  type
}) => type === _constants.Type.FLOW_SEQ || type === _constants.Type.SEQ;

class Schema {
  constructor({
    customTags,
    merge,
    schema,
    sortMapEntries,
    tags: deprecatedCustomTags
  }) {
    this.merge = !!merge;
    this.name = schema;
    this.sortMapEntries = sortMapEntries === true ? (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0 : sortMapEntries || null;
    this.tags = _tags.schemas[schema.replace(/\W/g, '')]; // 'yaml-1.1' -> 'yaml11'

    if (!this.tags) {
      const keys = Object.keys(_tags.schemas).map(key => JSON.stringify(key)).join(', ');
      throw new Error(`Unknown schema "${schema}"; use one of ${keys}`);
    }

    if (!customTags && deprecatedCustomTags) {
      customTags = deprecatedCustomTags;
      (0, _warnings.warnOptionDeprecation)('tags', 'customTags');
    }

    if (Array.isArray(customTags)) {
      for (const tag of customTags) this.tags = this.tags.concat(tag);
    } else if (typeof customTags === 'function') {
      this.tags = customTags(this.tags.slice());
    }

    for (let i = 0; i < this.tags.length; ++i) {
      const tag = this.tags[i];

      if (typeof tag === 'string') {
        const tagObj = _tags.tags[tag];

        if (!tagObj) {
          const keys = Object.keys(_tags.tags).map(key => JSON.stringify(key)).join(', ');
          throw new Error(`Unknown custom tag "${tag}"; use one of ${keys}`);
        }

        this.tags[i] = tagObj;
      }
    }
  }

  createNode(value, wrapScalars, tag, ctx) {
    if (value instanceof _Node.Node) return value;
    let tagObj;

    if (tag) {
      if (tag.startsWith('!!')) tag = Schema.defaultPrefix + tag.slice(2);
      const match = this.tags.filter(t => t.tag === tag);
      tagObj = match.find(t => !t.format) || match[0];
      if (!tagObj) throw new Error(`Tag ${tag} not found`);
    } else {
      // TODO: deprecate/remove class check
      tagObj = this.tags.find(t => (t.identify && t.identify(value) || t.class && value instanceof t.class) && !t.format);

      if (!tagObj) {
        if (typeof value.toJSON === 'function') value = value.toJSON();
        if (typeof value !== 'object') return wrapScalars ? new _Scalar.Scalar(value) : value;
        tagObj = value instanceof Map ? _tags.tags.map : value[Symbol.iterator] ? _tags.tags.seq : _tags.tags.map;
      }
    }

    if (!ctx) ctx = {
      wrapScalars
    };else ctx.wrapScalars = wrapScalars;

    if (ctx.onTagObj) {
      ctx.onTagObj(tagObj);
      delete ctx.onTagObj;
    }

    const obj = {};

    if (value && typeof value === 'object' && ctx.prevObjects) {
      const prev = ctx.prevObjects.get(value);

      if (prev) {
        const alias = new _Alias.Alias(prev); // leaves source dirty; must be cleaned by caller

        ctx.aliasNodes.push(alias);
        return alias;
      }

      obj.value = value;
      ctx.prevObjects.set(value, obj);
    }

    obj.node = tagObj.createNode ? tagObj.createNode(this, value, ctx) : wrapScalars ? new _Scalar.Scalar(value) : value;
    if (tag && obj.node instanceof _Node.Node) obj.node.tag = tag;
    return obj.node;
  }

  createPair(key, value, ctx) {
    const k = this.createNode(key, ctx.wrapScalars, null, ctx);
    const v = this.createNode(value, ctx.wrapScalars, null, ctx);
    return new _Pair.Pair(k, v);
  } // falls back to string on no match


  resolveScalar(str, tags) {
    if (!tags) tags = this.tags;

    for (let i = 0; i < tags.length; ++i) {
      const {
        format,
        test,
        resolve
      } = tags[i];

      if (test) {
        const match = str.match(test);

        if (match) {
          let res = resolve.apply(null, match);
          if (!(res instanceof _Scalar.Scalar)) res = new _Scalar.Scalar(res);
          if (format) res.format = format;
          return res;
        }
      }
    }

    if (this.tags.scalarFallback) str = this.tags.scalarFallback(str);
    return new _Scalar.Scalar(str);
  } // sets node.resolved on success


  resolveNode(doc, node, tagName) {
    const tags = this.tags.filter(({
      tag
    }) => tag === tagName);
    const generic = tags.find(({
      test
    }) => !test);
    if (node.error) doc.errors.push(node.error);

    try {
      if (generic) {
        let res = generic.resolve(doc, node);
        if (!(res instanceof _Collection.Collection)) res = new _Scalar.Scalar(res);
        node.resolved = res;
      } else {
        const str = (0, _string.resolveString)(doc, node);

        if (typeof str === 'string' && tags.length > 0) {
          node.resolved = this.resolveScalar(str, tags);
        }
      }
    } catch (error) {
      /* istanbul ignore if */
      if (!error.source) error.source = node;
      doc.errors.push(error);
      node.resolved = null;
    }

    if (!node.resolved) return null;
    if (tagName && node.tag) node.resolved.tag = tagName;
    return node.resolved;
  }

  resolveNodeWithFallback(doc, node, tagName) {
    const res = this.resolveNode(doc, node, tagName);
    if (Object.prototype.hasOwnProperty.call(node, 'resolved')) return res;
    const fallback = isMap(node) ? Schema.defaultTags.MAP : isSeq(node) ? Schema.defaultTags.SEQ : Schema.defaultTags.STR;
    /* istanbul ignore else */

    if (fallback) {
      doc.warnings.push(new _errors.YAMLWarning(node, `The tag ${tagName} is unavailable, falling back to ${fallback}`));
      const res = this.resolveNode(doc, node, fallback);
      res.tag = tagName;
      return res;
    } else {
      doc.errors.push(new _errors.YAMLReferenceError(node, `The tag ${tagName} is unavailable`));
      return null;
    }
  }

  getTagObject(item) {
    if (item instanceof _Alias.Alias) return _Alias.Alias;

    if (item.tag) {
      const match = this.tags.filter(t => t.tag === item.tag);
      if (match.length > 0) return match.find(t => t.format === item.format) || match[0];
    }

    let tagObj, obj;

    if (item instanceof _Scalar.Scalar) {
      obj = item.value; // TODO: deprecate/remove class check

      const match = this.tags.filter(t => t.identify && t.identify(obj) || t.class && obj instanceof t.class);
      tagObj = match.find(t => t.format === item.format) || match.find(t => !t.format);
    } else {
      obj = item;
      tagObj = this.tags.find(t => t.nodeClass && obj instanceof t.nodeClass);
    }

    if (!tagObj) {
      const name = obj && obj.constructor ? obj.constructor.name : typeof obj;
      throw new Error(`Tag not resolved for ${name} value`);
    }

    return tagObj;
  } // needs to be called before stringifier to allow for circular anchor refs


  stringifyProps(node, tagObj, {
    anchors,
    doc
  }) {
    const props = [];
    const anchor = doc.anchors.getName(node);

    if (anchor) {
      anchors[anchor] = node;
      props.push(`&${anchor}`);
    }

    if (node.tag) {
      props.push(doc.stringifyTag(node.tag));
    } else if (!tagObj.default) {
      props.push(doc.stringifyTag(tagObj.tag));
    }

    return props.join(' ');
  }

  stringify(item, ctx, onComment, onChompKeep) {
    let tagObj;

    if (!(item instanceof _Node.Node)) {
      const createCtx = {
        aliasNodes: [],
        onTagObj: o => tagObj = o,
        prevObjects: new Map()
      };
      item = this.createNode(item, true, null, createCtx);
      const {
        anchors
      } = ctx.doc;

      for (const alias of createCtx.aliasNodes) {
        alias.source = alias.source.node;
        let name = anchors.getName(alias.source);

        if (!name) {
          name = anchors.newName();
          anchors.map[name] = alias.source;
        }
      }
    }

    ctx.tags = this;
    if (item instanceof _Pair.Pair) return item.toString(ctx, onComment, onChompKeep);
    if (!tagObj) tagObj = this.getTagObject(item);
    const props = this.stringifyProps(item, tagObj, ctx);
    if (props.length > 0) ctx.indentAtStart = (ctx.indentAtStart || 0) + props.length + 1;
    const str = typeof tagObj.stringify === 'function' ? tagObj.stringify(item, ctx, onComment, onChompKeep) : item instanceof _Collection.Collection ? item.toString(ctx, onComment, onChompKeep) : (0, _stringify.stringifyString)(item, ctx, onComment, onChompKeep);
    return props ? item instanceof _Collection.Collection && str[0] !== '{' && str[0] !== '[' ? `${props}\n${ctx.indent}${str}` : `${props} ${str}` : str;
  }

}

exports.Schema = Schema;

_defineProperty(Schema, "defaultPrefix", 'tag:yaml.org,2002:');

_defineProperty(Schema, "defaultTags", {
  MAP: 'tag:yaml.org,2002:map',
  SEQ: 'tag:yaml.org,2002:seq',
  STR: 'tag:yaml.org,2002:str'
});

/***/ }),

/***/ 260:
/***/ (function(module, __unusedexports, __webpack_require__) {

// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.
var assert = __webpack_require__(357)
var signals = __webpack_require__(654)
var isWin = /^win/i.test(process.platform)

var EE = __webpack_require__(614)
/* istanbul ignore if */
if (typeof EE !== 'function') {
  EE = EE.EventEmitter
}

var emitter
if (process.__signal_exit_emitter__) {
  emitter = process.__signal_exit_emitter__
} else {
  emitter = process.__signal_exit_emitter__ = new EE()
  emitter.count = 0
  emitter.emitted = {}
}

// Because this emitter is a global, we have to check to see if a
// previous version of this library failed to enable infinite listeners.
// I know what you're about to say.  But literally everything about
// signal-exit is a compromise with evil.  Get used to it.
if (!emitter.infinite) {
  emitter.setMaxListeners(Infinity)
  emitter.infinite = true
}

module.exports = function (cb, opts) {
  assert.equal(typeof cb, 'function', 'a callback must be provided for exit handler')

  if (loaded === false) {
    load()
  }

  var ev = 'exit'
  if (opts && opts.alwaysLast) {
    ev = 'afterexit'
  }

  var remove = function () {
    emitter.removeListener(ev, cb)
    if (emitter.listeners('exit').length === 0 &&
        emitter.listeners('afterexit').length === 0) {
      unload()
    }
  }
  emitter.on(ev, cb)

  return remove
}

module.exports.unload = unload
function unload () {
  if (!loaded) {
    return
  }
  loaded = false

  signals.forEach(function (sig) {
    try {
      process.removeListener(sig, sigListeners[sig])
    } catch (er) {}
  })
  process.emit = originalProcessEmit
  process.reallyExit = originalProcessReallyExit
  emitter.count -= 1
}

function emit (event, code, signal) {
  if (emitter.emitted[event]) {
    return
  }
  emitter.emitted[event] = true
  emitter.emit(event, code, signal)
}

// { <signal>: <listener fn>, ... }
var sigListeners = {}
signals.forEach(function (sig) {
  sigListeners[sig] = function listener () {
    // If there are no other listeners, an exit is coming!
    // Simplest way: remove us and then re-send the signal.
    // We know that this will kill the process, so we can
    // safely emit now.
    var listeners = process.listeners(sig)
    if (listeners.length === emitter.count) {
      unload()
      emit('exit', null, sig)
      /* istanbul ignore next */
      emit('afterexit', null, sig)
      /* istanbul ignore next */
      if (isWin && sig === 'SIGHUP') {
        // "SIGHUP" throws an `ENOSYS` error on Windows,
        // so use a supported signal instead
        sig = 'SIGINT'
      }
      process.kill(process.pid, sig)
    }
  }
})

module.exports.signals = function () {
  return signals
}

module.exports.load = load

var loaded = false

function load () {
  if (loaded) {
    return
  }
  loaded = true

  // This is the number of onSignalExit's that are in play.
  // It's important so that we can count the correct number of
  // listeners on signals, and don't wait for the other one to
  // handle it instead of us.
  emitter.count += 1

  signals = signals.filter(function (sig) {
    try {
      process.on(sig, sigListeners[sig])
      return true
    } catch (er) {
      return false
    }
  })

  process.emit = processEmit
  process.reallyExit = processReallyExit
}

var originalProcessReallyExit = process.reallyExit
function processReallyExit (code) {
  process.exitCode = code || 0
  emit('exit', process.exitCode, null)
  /* istanbul ignore next */
  emit('afterexit', process.exitCode, null)
  /* istanbul ignore next */
  originalProcessReallyExit.call(process, process.exitCode)
}

var originalProcessEmit = process.emit
function processEmit (ev, arg) {
  if (ev === 'exit') {
    if (arg !== undefined) {
      process.exitCode = arg
    }
    var ret = originalProcessEmit.apply(this, arguments)
    emit('exit', process.exitCode, null)
    /* istanbul ignore next */
    emit('afterexit', process.exitCode, null)
    return ret
  } else {
    return originalProcessEmit.apply(this, arguments)
  }
}


/***/ }),

/***/ 262:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __webpack_require__(747);
const os_1 = __webpack_require__(87);
class Context {
    /**
     * Hydrate the context from the environment
     */
    constructor() {
        this.payload = {};
        if (process.env.GITHUB_EVENT_PATH) {
            if (fs_1.existsSync(process.env.GITHUB_EVENT_PATH)) {
                this.payload = JSON.parse(fs_1.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }));
            }
            else {
                const path = process.env.GITHUB_EVENT_PATH;
                process.stdout.write(`GITHUB_EVENT_PATH ${path} does not exist${os_1.EOL}`);
            }
        }
        this.eventName = process.env.GITHUB_EVENT_NAME;
        this.sha = process.env.GITHUB_SHA;
        this.ref = process.env.GITHUB_REF;
        this.workflow = process.env.GITHUB_WORKFLOW;
        this.action = process.env.GITHUB_ACTION;
        this.actor = process.env.GITHUB_ACTOR;
    }
    get issue() {
        const payload = this.payload;
        return Object.assign(Object.assign({}, this.repo), { number: (payload.issue || payload.pull_request || payload).number });
    }
    get repo() {
        if (process.env.GITHUB_REPOSITORY) {
            const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
            return { owner, repo };
        }
        if (this.payload.repository) {
            return {
                owner: this.payload.repository.owner.login,
                repo: this.payload.repository.name
            };
        }
        throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map

/***/ }),

/***/ 265:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getPage

const deprecate = __webpack_require__(370)
const getPageLinks = __webpack_require__(577)
const HttpError = __webpack_require__(297)

function getPage (octokit, link, which, headers) {
  deprecate(`octokit.get${which.charAt(0).toUpperCase() + which.slice(1)}Page() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  const url = getPageLinks(link)[which]

  if (!url) {
    const urlError = new HttpError(`No ${which} page found`, 404)
    return Promise.reject(urlError)
  }

  const requestOptions = {
    url,
    headers: applyAcceptHeader(link, headers)
  }

  const promise = octokit.request(requestOptions)

  return promise
}

function applyAcceptHeader (res, headers) {
  const previous = res.headers && res.headers['x-github-media-type']

  if (!previous || (headers && headers.accept)) {
    return headers
  }
  headers = headers || {}
  headers.accept = 'application/vnd.' + previous
    .replace('; param=', '.')
    .replace('; format=', '+')

  return headers
}


/***/ }),

/***/ 280:
/***/ (function(module, exports) {

exports = module.exports = SemVer

var debug
/* istanbul ignore next */
if (typeof process === 'object' &&
    process.env &&
    process.env.NODE_DEBUG &&
    /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
  debug = function () {
    var args = Array.prototype.slice.call(arguments, 0)
    args.unshift('SEMVER')
    console.log.apply(console, args)
  }
} else {
  debug = function () {}
}

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0'

var MAX_LENGTH = 256
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
var MAX_SAFE_COMPONENT_LENGTH = 16

// The actual regexps go on exports.re
var re = exports.re = []
var src = exports.src = []
var R = 0

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

var NUMERICIDENTIFIER = R++
src[NUMERICIDENTIFIER] = '0|[1-9]\\d*'
var NUMERICIDENTIFIERLOOSE = R++
src[NUMERICIDENTIFIERLOOSE] = '[0-9]+'

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

var NONNUMERICIDENTIFIER = R++
src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*'

// ## Main Version
// Three dot-separated numeric identifiers.

var MAINVERSION = R++
src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')'

var MAINVERSIONLOOSE = R++
src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')'

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

var PRERELEASEIDENTIFIER = R++
src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +
                            '|' + src[NONNUMERICIDENTIFIER] + ')'

var PRERELEASEIDENTIFIERLOOSE = R++
src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[NONNUMERICIDENTIFIER] + ')'

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

var PRERELEASE = R++
src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))'

var PRERELEASELOOSE = R++
src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))'

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

var BUILDIDENTIFIER = R++
src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+'

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

var BUILD = R++
src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +
             '(?:\\.' + src[BUILDIDENTIFIER] + ')*))'

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

var FULL = R++
var FULLPLAIN = 'v?' + src[MAINVERSION] +
                src[PRERELEASE] + '?' +
                src[BUILD] + '?'

src[FULL] = '^' + FULLPLAIN + '$'

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +
                 src[PRERELEASELOOSE] + '?' +
                 src[BUILD] + '?'

var LOOSE = R++
src[LOOSE] = '^' + LOOSEPLAIN + '$'

var GTLT = R++
src[GTLT] = '((?:<|>)?=?)'

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
var XRANGEIDENTIFIERLOOSE = R++
src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*'
var XRANGEIDENTIFIER = R++
src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*'

var XRANGEPLAIN = R++
src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[PRERELEASE] + ')?' +
                   src[BUILD] + '?' +
                   ')?)?'

var XRANGEPLAINLOOSE = R++
src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[PRERELEASELOOSE] + ')?' +
                        src[BUILD] + '?' +
                        ')?)?'

var XRANGE = R++
src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$'
var XRANGELOOSE = R++
src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$'

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
var COERCE = R++
src[COERCE] = '(?:^|[^\\d])' +
              '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:$|[^\\d])'

// Tilde ranges.
// Meaning is "reasonably at or greater than"
var LONETILDE = R++
src[LONETILDE] = '(?:~>?)'

var TILDETRIM = R++
src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+'
re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g')
var tildeTrimReplace = '$1~'

var TILDE = R++
src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$'
var TILDELOOSE = R++
src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$'

// Caret ranges.
// Meaning is "at least and backwards compatible with"
var LONECARET = R++
src[LONECARET] = '(?:\\^)'

var CARETTRIM = R++
src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+'
re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g')
var caretTrimReplace = '$1^'

var CARET = R++
src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$'
var CARETLOOSE = R++
src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$'

// A simple gt/lt/eq thing, or just "" to indicate "any version"
var COMPARATORLOOSE = R++
src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$'
var COMPARATOR = R++
src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$'

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
var COMPARATORTRIM = R++
src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +
                      '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')'

// this one has to use the /g flag
re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g')
var comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
var HYPHENRANGE = R++
src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[XRANGEPLAIN] + ')' +
                   '\\s*$'

var HYPHENRANGELOOSE = R++
src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s*$'

// Star ranges basically just allow anything at all.
var STAR = R++
src[STAR] = '(<|>)?=?\\s*\\*'

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i])
  if (!re[i]) {
    re[i] = new RegExp(src[i])
  }
}

exports.parse = parse
function parse (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH) {
    return null
  }

  var r = options.loose ? re[LOOSE] : re[FULL]
  if (!r.test(version)) {
    return null
  }

  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}

exports.valid = valid
function valid (version, options) {
  var v = parse(version, options)
  return v ? v.version : null
}

exports.clean = clean
function clean (version, options) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}

exports.SemVer = SemVer

function SemVer (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }
  if (version instanceof SemVer) {
    if (version.loose === options.loose) {
      return version
    } else {
      version = version.version
    }
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version)
  }

  if (version.length > MAX_LENGTH) {
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')
  }

  if (!(this instanceof SemVer)) {
    return new SemVer(version, options)
  }

  debug('SemVer', version, options)
  this.options = options
  this.loose = !!options.loose

  var m = version.trim().match(options.loose ? re[LOOSE] : re[FULL])

  if (!m) {
    throw new TypeError('Invalid Version: ' + version)
  }

  this.raw = version

  // these are actually numbers
  this.major = +m[1]
  this.minor = +m[2]
  this.patch = +m[3]

  if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
    throw new TypeError('Invalid major version')
  }

  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
    throw new TypeError('Invalid minor version')
  }

  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
    throw new TypeError('Invalid patch version')
  }

  // numberify any prerelease numeric ids
  if (!m[4]) {
    this.prerelease = []
  } else {
    this.prerelease = m[4].split('.').map(function (id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id
        if (num >= 0 && num < MAX_SAFE_INTEGER) {
          return num
        }
      }
      return id
    })
  }

  this.build = m[5] ? m[5].split('.') : []
  this.format()
}

SemVer.prototype.format = function () {
  this.version = this.major + '.' + this.minor + '.' + this.patch
  if (this.prerelease.length) {
    this.version += '-' + this.prerelease.join('.')
  }
  return this.version
}

SemVer.prototype.toString = function () {
  return this.version
}

SemVer.prototype.compare = function (other) {
  debug('SemVer.compare', this.version, this.options, other)
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return this.compareMain(other) || this.comparePre(other)
}

SemVer.prototype.compareMain = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch)
}

SemVer.prototype.comparePre = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length) {
    return -1
  } else if (!this.prerelease.length && other.prerelease.length) {
    return 1
  } else if (!this.prerelease.length && !other.prerelease.length) {
    return 0
  }

  var i = 0
  do {
    var a = this.prerelease[i]
    var b = other.prerelease[i]
    debug('prerelease compare', i, a, b)
    if (a === undefined && b === undefined) {
      return 0
    } else if (b === undefined) {
      return 1
    } else if (a === undefined) {
      return -1
    } else if (a === b) {
      continue
    } else {
      return compareIdentifiers(a, b)
    }
  } while (++i)
}

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function (release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor = 0
      this.major++
      this.inc('pre', identifier)
      break
    case 'preminor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor++
      this.inc('pre', identifier)
      break
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0
      this.inc('patch', identifier)
      this.inc('pre', identifier)
      break
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0) {
        this.inc('patch', identifier)
      }
      this.inc('pre', identifier)
      break

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0) {
        this.major++
      }
      this.minor = 0
      this.patch = 0
      this.prerelease = []
      break
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0) {
        this.minor++
      }
      this.patch = 0
      this.prerelease = []
      break
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0) {
        this.patch++
      }
      this.prerelease = []
      break
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0) {
        this.prerelease = [0]
      } else {
        var i = this.prerelease.length
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++
            i = -2
          }
        }
        if (i === -1) {
          // didn't increment anything
          this.prerelease.push(0)
        }
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1])) {
            this.prerelease = [identifier, 0]
          }
        } else {
          this.prerelease = [identifier, 0]
        }
      }
      break

    default:
      throw new Error('invalid increment argument: ' + release)
  }
  this.format()
  this.raw = this.version
  return this
}

exports.inc = inc
function inc (version, release, loose, identifier) {
  if (typeof (loose) === 'string') {
    identifier = loose
    loose = undefined
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version
  } catch (er) {
    return null
  }
}

exports.diff = diff
function diff (version1, version2) {
  if (eq(version1, version2)) {
    return null
  } else {
    var v1 = parse(version1)
    var v2 = parse(version2)
    var prefix = ''
    if (v1.prerelease.length || v2.prerelease.length) {
      prefix = 'pre'
      var defaultResult = 'prerelease'
    }
    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key
        }
      }
    }
    return defaultResult // may be undefined
  }
}

exports.compareIdentifiers = compareIdentifiers

var numeric = /^[0-9]+$/
function compareIdentifiers (a, b) {
  var anum = numeric.test(a)
  var bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

exports.rcompareIdentifiers = rcompareIdentifiers
function rcompareIdentifiers (a, b) {
  return compareIdentifiers(b, a)
}

exports.major = major
function major (a, loose) {
  return new SemVer(a, loose).major
}

exports.minor = minor
function minor (a, loose) {
  return new SemVer(a, loose).minor
}

exports.patch = patch
function patch (a, loose) {
  return new SemVer(a, loose).patch
}

exports.compare = compare
function compare (a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose))
}

exports.compareLoose = compareLoose
function compareLoose (a, b) {
  return compare(a, b, true)
}

exports.rcompare = rcompare
function rcompare (a, b, loose) {
  return compare(b, a, loose)
}

exports.sort = sort
function sort (list, loose) {
  return list.sort(function (a, b) {
    return exports.compare(a, b, loose)
  })
}

exports.rsort = rsort
function rsort (list, loose) {
  return list.sort(function (a, b) {
    return exports.rcompare(a, b, loose)
  })
}

exports.gt = gt
function gt (a, b, loose) {
  return compare(a, b, loose) > 0
}

exports.lt = lt
function lt (a, b, loose) {
  return compare(a, b, loose) < 0
}

exports.eq = eq
function eq (a, b, loose) {
  return compare(a, b, loose) === 0
}

exports.neq = neq
function neq (a, b, loose) {
  return compare(a, b, loose) !== 0
}

exports.gte = gte
function gte (a, b, loose) {
  return compare(a, b, loose) >= 0
}

exports.lte = lte
function lte (a, b, loose) {
  return compare(a, b, loose) <= 0
}

exports.cmp = cmp
function cmp (a, op, b, loose) {
  switch (op) {
    case '===':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a === b

    case '!==':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError('Invalid operator: ' + op)
  }
}

exports.Comparator = Comparator
function Comparator (comp, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (comp instanceof Comparator) {
    if (comp.loose === !!options.loose) {
      return comp
    } else {
      comp = comp.value
    }
  }

  if (!(this instanceof Comparator)) {
    return new Comparator(comp, options)
  }

  debug('comparator', comp, options)
  this.options = options
  this.loose = !!options.loose
  this.parse(comp)

  if (this.semver === ANY) {
    this.value = ''
  } else {
    this.value = this.operator + this.semver.version
  }

  debug('comp', this)
}

var ANY = {}
Comparator.prototype.parse = function (comp) {
  var r = this.options.loose ? re[COMPARATORLOOSE] : re[COMPARATOR]
  var m = comp.match(r)

  if (!m) {
    throw new TypeError('Invalid comparator: ' + comp)
  }

  this.operator = m[1]
  if (this.operator === '=') {
    this.operator = ''
  }

  // if it literally is just '>' or '' then allow anything.
  if (!m[2]) {
    this.semver = ANY
  } else {
    this.semver = new SemVer(m[2], this.options.loose)
  }
}

Comparator.prototype.toString = function () {
  return this.value
}

Comparator.prototype.test = function (version) {
  debug('Comparator.test', version, this.options.loose)

  if (this.semver === ANY) {
    return true
  }

  if (typeof version === 'string') {
    version = new SemVer(version, this.options)
  }

  return cmp(version, this.operator, this.semver, this.options)
}

Comparator.prototype.intersects = function (comp, options) {
  if (!(comp instanceof Comparator)) {
    throw new TypeError('a Comparator is required')
  }

  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  var rangeTmp

  if (this.operator === '') {
    rangeTmp = new Range(comp.value, options)
    return satisfies(this.value, rangeTmp, options)
  } else if (comp.operator === '') {
    rangeTmp = new Range(this.value, options)
    return satisfies(comp.semver, rangeTmp, options)
  }

  var sameDirectionIncreasing =
    (this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '>=' || comp.operator === '>')
  var sameDirectionDecreasing =
    (this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '<=' || comp.operator === '<')
  var sameSemVer = this.semver.version === comp.semver.version
  var differentDirectionsInclusive =
    (this.operator === '>=' || this.operator === '<=') &&
    (comp.operator === '>=' || comp.operator === '<=')
  var oppositeDirectionsLessThan =
    cmp(this.semver, '<', comp.semver, options) &&
    ((this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '<=' || comp.operator === '<'))
  var oppositeDirectionsGreaterThan =
    cmp(this.semver, '>', comp.semver, options) &&
    ((this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '>=' || comp.operator === '>'))

  return sameDirectionIncreasing || sameDirectionDecreasing ||
    (sameSemVer && differentDirectionsInclusive) ||
    oppositeDirectionsLessThan || oppositeDirectionsGreaterThan
}

exports.Range = Range
function Range (range, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (range instanceof Range) {
    if (range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease) {
      return range
    } else {
      return new Range(range.raw, options)
    }
  }

  if (range instanceof Comparator) {
    return new Range(range.value, options)
  }

  if (!(this instanceof Range)) {
    return new Range(range, options)
  }

  this.options = options
  this.loose = !!options.loose
  this.includePrerelease = !!options.includePrerelease

  // First, split based on boolean or ||
  this.raw = range
  this.set = range.split(/\s*\|\|\s*/).map(function (range) {
    return this.parseRange(range.trim())
  }, this).filter(function (c) {
    // throw out any that are not relevant for whatever reason
    return c.length
  })

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range)
  }

  this.format()
}

Range.prototype.format = function () {
  this.range = this.set.map(function (comps) {
    return comps.join(' ').trim()
  }).join('||').trim()
  return this.range
}

Range.prototype.toString = function () {
  return this.range
}

Range.prototype.parseRange = function (range) {
  var loose = this.options.loose
  range = range.trim()
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE]
  range = range.replace(hr, hyphenReplace)
  debug('hyphen replace', range)
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace)
  debug('comparator trim', range, re[COMPARATORTRIM])

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re[TILDETRIM], tildeTrimReplace)

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(re[CARETTRIM], caretTrimReplace)

  // normalize spaces
  range = range.split(/\s+/).join(' ')

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR]
  var set = range.split(' ').map(function (comp) {
    return parseComparator(comp, this.options)
  }, this).join(' ').split(/\s+/)
  if (this.options.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function (comp) {
      return !!comp.match(compRe)
    })
  }
  set = set.map(function (comp) {
    return new Comparator(comp, this.options)
  }, this)

  return set
}

Range.prototype.intersects = function (range, options) {
  if (!(range instanceof Range)) {
    throw new TypeError('a Range is required')
  }

  return this.set.some(function (thisComparators) {
    return thisComparators.every(function (thisComparator) {
      return range.set.some(function (rangeComparators) {
        return rangeComparators.every(function (rangeComparator) {
          return thisComparator.intersects(rangeComparator, options)
        })
      })
    })
  })
}

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators
function toComparators (range, options) {
  return new Range(range, options).set.map(function (comp) {
    return comp.map(function (c) {
      return c.value
    }).join(' ').trim().split(' ')
  })
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator (comp, options) {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

function isX (id) {
  return !id || id.toLowerCase() === 'x' || id === '*'
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceTilde(comp, options)
  }).join(' ')
}

function replaceTilde (comp, options) {
  var r = options.loose ? re[TILDELOOSE] : re[TILDE]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
            ' <' + M + '.' + (+m + 1) + '.0'
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p +
            ' <' + M + '.' + (+m + 1) + '.0'
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceCaret(comp, options)
  }).join(' ')
}

function replaceCaret (comp, options) {
  debug('caret', comp, options)
  var r = options.loose ? re[CARETLOOSE] : re[CARET]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      if (M === '0') {
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
      } else {
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0'
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
              ' <' + (+M + 1) + '.0.0'
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + (+M + 1) + '.0.0'
      }
    }

    debug('caret return', ret)
    return ret
  })
}

function replaceXRanges (comp, options) {
  debug('replaceXRanges', comp, options)
  return comp.split(/\s+/).map(function (comp) {
    return replaceXRange(comp, options)
  }).join(' ')
}

function replaceXRange (comp, options) {
  comp = comp.trim()
  var r = options.loose ? re[XRANGELOOSE] : re[XRANGE]
  return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    var xM = isX(M)
    var xm = xM || isX(m)
    var xp = xm || isX(p)
    var anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      ret = gtlt + M + '.' + m + '.' + p
    } else if (xm) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars (comp, options) {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[STAR], '')
}

// This function is passed to string.replace(re[HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = '>=' + fM + '.0.0'
  } else if (isX(fp)) {
    from = '>=' + fM + '.' + fm + '.0'
  } else {
    from = '>=' + from
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = '<' + (+tM + 1) + '.0.0'
  } else if (isX(tp)) {
    to = '<' + tM + '.' + (+tm + 1) + '.0'
  } else if (tpr) {
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr
  } else {
    to = '<=' + to
  }

  return (from + ' ' + to).trim()
}

// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function (version) {
  if (!version) {
    return false
  }

  if (typeof version === 'string') {
    version = new SemVer(version, this.options)
  }

  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version, this.options)) {
      return true
    }
  }
  return false
}

function testSet (set, version, options) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}

exports.satisfies = satisfies
function satisfies (version, range, options) {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}

exports.maxSatisfying = maxSatisfying
function maxSatisfying (versions, range, options) {
  var max = null
  var maxSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}

exports.minSatisfying = minSatisfying
function minSatisfying (versions, range, options) {
  var min = null
  var minSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}

exports.minVersion = minVersion
function minVersion (range, loose) {
  range = new Range(range, loose)

  var minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    comparators.forEach(function (comparator) {
      // Clone to avoid manipulating the comparator's semver object.
      var compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!minver || gt(minver, compver)) {
            minver = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error('Unexpected operation: ' + comparator.operator)
      }
    })
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}

exports.validRange = validRange
function validRange (range, options) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}

// Determine if version is less than all the versions possible in the range
exports.ltr = ltr
function ltr (version, range, options) {
  return outside(version, range, '<', options)
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr
function gtr (version, range, options) {
  return outside(version, range, '>', options)
}

exports.outside = outside
function outside (version, range, hilo, options) {
  version = new SemVer(version, options)
  range = new Range(range, options)

  var gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    var high = null
    var low = null

    comparators.forEach(function (comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

exports.prerelease = prerelease
function prerelease (version, options) {
  var parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}

exports.intersects = intersects
function intersects (r1, r2, options) {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2)
}

exports.coerce = coerce
function coerce (version) {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  var match = version.match(re[COERCE])

  if (match == null) {
    return null
  }

  return parse(match[1] +
    '.' + (match[2] || '0') +
    '.' + (match[3] || '0'))
}


/***/ }),

/***/ 293:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationRequestError;

const { RequestError } = __webpack_require__(497);

function authenticationRequestError(state, error, options) {
  if (!error.headers) throw error;

  const otpRequired = /required/.test(error.headers["x-github-otp"] || "");
  // handle "2FA required" error only
  if (error.status !== 401 || !otpRequired) {
    throw error;
  }

  if (
    error.status === 401 &&
    otpRequired &&
    error.request &&
    error.request.headers["x-github-otp"]
  ) {
    if (state.otp) {
      delete state.otp; // no longer valid, request again
    } else {
      throw new RequestError(
        "Invalid one-time password for two-factor authentication",
        401,
        {
          headers: error.headers,
          request: options
        }
      );
    }
  }

  if (typeof state.auth.on2fa !== "function") {
    throw new RequestError(
      "2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication",
      401,
      {
        headers: error.headers,
        request: options
      }
    );
  }

  return Promise.resolve()
    .then(() => {
      return state.auth.on2fa();
    })
    .then(oneTimePassword => {
      const newOptions = Object.assign(options, {
        headers: Object.assign(options.headers, {
          "x-github-otp": oneTimePassword
        })
      });
      return state.octokit.request(newOptions).then(response => {
        // If OTP still valid, then persist it for following requests
        state.otp = oneTimePassword;
        return response;
      });
    });
}


/***/ }),

/***/ 294:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = parseOptions;

const { Deprecation } = __webpack_require__(692);
const { getUserAgent } = __webpack_require__(619);
const once = __webpack_require__(969);

const pkg = __webpack_require__(215);

const deprecateOptionsTimeout = once((log, deprecation) =>
  log.warn(deprecation)
);
const deprecateOptionsAgent = once((log, deprecation) => log.warn(deprecation));
const deprecateOptionsHeaders = once((log, deprecation) =>
  log.warn(deprecation)
);

function parseOptions(options, log, hook) {
  if (options.headers) {
    options.headers = Object.keys(options.headers).reduce((newObj, key) => {
      newObj[key.toLowerCase()] = options.headers[key];
      return newObj;
    }, {});
  }

  const clientDefaults = {
    headers: options.headers || {},
    request: options.request || {},
    mediaType: {
      previews: [],
      format: ""
    }
  };

  if (options.baseUrl) {
    clientDefaults.baseUrl = options.baseUrl;
  }

  if (options.userAgent) {
    clientDefaults.headers["user-agent"] = options.userAgent;
  }

  if (options.previews) {
    clientDefaults.mediaType.previews = options.previews;
  }

  if (options.timeZone) {
    clientDefaults.headers["time-zone"] = options.timeZone;
  }

  if (options.timeout) {
    deprecateOptionsTimeout(
      log,
      new Deprecation(
        "[@octokit/rest] new Octokit({timeout}) is deprecated. Use {request: {timeout}} instead. See https://github.com/octokit/request.js#request"
      )
    );
    clientDefaults.request.timeout = options.timeout;
  }

  if (options.agent) {
    deprecateOptionsAgent(
      log,
      new Deprecation(
        "[@octokit/rest] new Octokit({agent}) is deprecated. Use {request: {agent}} instead. See https://github.com/octokit/request.js#request"
      )
    );
    clientDefaults.request.agent = options.agent;
  }

  if (options.headers) {
    deprecateOptionsHeaders(
      log,
      new Deprecation(
        "[@octokit/rest] new Octokit({headers}) is deprecated. Use {userAgent, previews} instead. See https://github.com/octokit/request.js#request"
      )
    );
  }

  const userAgentOption = clientDefaults.headers["user-agent"];
  const defaultUserAgent = `octokit.js/${pkg.version} ${getUserAgent()}`;

  clientDefaults.headers["user-agent"] = [userAgentOption, defaultUserAgent]
    .filter(Boolean)
    .join(" ");

  clientDefaults.request.hook = hook.bind(null, "request");

  return clientDefaults;
}


/***/ }),

/***/ 297:
/***/ (function(module) {

module.exports = class HttpError extends Error {
  constructor (message, code, headers) {
    super(message)

    // Maintains proper stack trace (only available on V8)
    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }

    this.name = 'HttpError'
    this.code = code
    this.headers = headers
  }
}


/***/ }),

/***/ 299:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

const VERSION = "1.1.2";

/**
 * Some “list” response that can be paginated have a different response structure
 *
 * They have a `total_count` key in the response (search also has `incomplete_results`,
 * /installation/repositories also has `repository_selection`), as well as a key with
 * the list of the items which name varies from endpoint to endpoint:
 *
 * - https://developer.github.com/v3/search/#example (key `items`)
 * - https://developer.github.com/v3/checks/runs/#response-3 (key: `check_runs`)
 * - https://developer.github.com/v3/checks/suites/#response-1 (key: `check_suites`)
 * - https://developer.github.com/v3/apps/installations/#list-repositories (key: `repositories`)
 * - https://developer.github.com/v3/apps/installations/#list-installations-for-a-user (key `installations`)
 *
 * Octokit normalizes these responses so that paginated results are always returned following
 * the same structure. One challenge is that if the list response has only one page, no Link
 * header is provided, so this header alone is not sufficient to check wether a response is
 * paginated or not. For the exceptions with the namespace, a fallback check for the route
 * paths has to be added in order to normalize the response. We cannot check for the total_count
 * property because it also exists in the response of Get the combined status for a specific ref.
 */
const REGEX = [/^\/search\//, /^\/repos\/[^/]+\/[^/]+\/commits\/[^/]+\/(check-runs|check-suites)([^/]|$)/, /^\/installation\/repositories([^/]|$)/, /^\/user\/installations([^/]|$)/, /^\/repos\/[^/]+\/[^/]+\/actions\/secrets([^/]|$)/, /^\/repos\/[^/]+\/[^/]+\/actions\/workflows(\/[^/]+\/runs)?([^/]|$)/, /^\/repos\/[^/]+\/[^/]+\/actions\/runs(\/[^/]+\/(artifacts|jobs))?([^/]|$)/];
function normalizePaginatedListResponse(octokit, url, response) {
  const path = url.replace(octokit.request.endpoint.DEFAULTS.baseUrl, "");
  const responseNeedsNormalization = REGEX.find(regex => regex.test(path));
  if (!responseNeedsNormalization) return; // keep the additional properties intact as there is currently no other way
  // to retrieve the same information.

  const incompleteResults = response.data.incomplete_results;
  const repositorySelection = response.data.repository_selection;
  const totalCount = response.data.total_count;
  delete response.data.incomplete_results;
  delete response.data.repository_selection;
  delete response.data.total_count;
  const namespaceKey = Object.keys(response.data)[0];
  const data = response.data[namespaceKey];
  response.data = data;

  if (typeof incompleteResults !== "undefined") {
    response.data.incomplete_results = incompleteResults;
  }

  if (typeof repositorySelection !== "undefined") {
    response.data.repository_selection = repositorySelection;
  }

  response.data.total_count = totalCount;
  Object.defineProperty(response.data, namespaceKey, {
    get() {
      octokit.log.warn(`[@octokit/paginate-rest] "response.data.${namespaceKey}" is deprecated for "GET ${path}". Get the results directly from "response.data"`);
      return Array.from(data);
    }

  });
}

function iterator(octokit, route, parameters) {
  const options = octokit.request.endpoint(route, parameters);
  const method = options.method;
  const headers = options.headers;
  let url = options.url;
  return {
    [Symbol.asyncIterator]: () => ({
      next() {
        if (!url) {
          return Promise.resolve({
            done: true
          });
        }

        return octokit.request({
          method,
          url,
          headers
        }).then(response => {
          normalizePaginatedListResponse(octokit, url, response); // `response.headers.link` format:
          // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
          // sets `url` to undefined if "next" URL is not present or `link` header is not set

          url = ((response.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
          return {
            value: response
          };
        });
      }

    })
  };
}

function paginate(octokit, route, parameters, mapFn) {
  if (typeof parameters === "function") {
    mapFn = parameters;
    parameters = undefined;
  }

  return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
}

function gather(octokit, results, iterator, mapFn) {
  return iterator.next().then(result => {
    if (result.done) {
      return results;
    }

    let earlyExit = false;

    function done() {
      earlyExit = true;
    }

    results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);

    if (earlyExit) {
      return results;
    }

    return gather(octokit, results, iterator, mapFn);
  });
}

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */

function paginateRest(octokit) {
  return {
    paginate: Object.assign(paginate.bind(null, octokit), {
      iterator: iterator.bind(null, octokit)
    })
  };
}
paginateRest.VERSION = VERSION;

exports.paginateRest = paginateRest;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 309:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.parse = parse;

var _Document = __webpack_require__(928);

var _ParseContext = __webpack_require__(968);

// Published as 'yaml/parse-cst'
function parse(src) {
  const cr = [];

  if (src.indexOf('\r') !== -1) {
    src = src.replace(/\r\n?/g, (match, offset) => {
      if (match.length > 1) cr.push(offset);
      return '\n';
    });
  }

  const documents = [];
  let offset = 0;

  do {
    const doc = new _Document.Document();
    const context = new _ParseContext.ParseContext({
      src
    });
    offset = doc.parse(context, offset);
    documents.push(doc);
  } while (offset < src.length);

  documents.setOrigRanges = () => {
    if (cr.length === 0) return false;

    for (let i = 1; i < cr.length; ++i) cr[i] -= i;

    let crOffset = 0;

    for (let i = 0; i < documents.length; ++i) {
      crOffset = documents[i].setOrigRanges(cr, crOffset);
    }

    cr.splice(0, cr.length);
    return true;
  };

  documents.toString = () => documents.join('...\n');

  return documents;
}

/***/ }),

/***/ 315:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.stringifyNumber = stringifyNumber;
exports.stringifyString = stringifyString;

var _addComment = __webpack_require__(836);

var _constants = __webpack_require__(383);

var _foldFlowLines = __webpack_require__(415);

var _options = __webpack_require__(422);

const getFoldOptions = ({
  indentAtStart
}) => indentAtStart ? Object.assign({
  indentAtStart
}, _options.strOptions.fold) : _options.strOptions.fold;

function stringifyNumber({
  format,
  minFractionDigits,
  tag,
  value
}) {
  if (typeof value === 'bigint') return String(value);
  if (!isFinite(value)) return isNaN(value) ? '.nan' : value < 0 ? '-.inf' : '.inf';
  let n = JSON.stringify(value);

  if (!format && minFractionDigits && (!tag || tag === 'tag:yaml.org,2002:float') && /^\d/.test(n)) {
    let i = n.indexOf('.');

    if (i < 0) {
      i = n.length;
      n += '.';
    }

    let d = minFractionDigits - (n.length - i - 1);

    while (d-- > 0) n += '0';
  }

  return n;
}

function lineLengthOverLimit(str, limit) {
  const strLen = str.length;
  if (strLen <= limit) return false;

  for (let i = 0, start = 0; i < strLen; ++i) {
    if (str[i] === '\n') {
      if (i - start > limit) return true;
      start = i + 1;
      if (strLen - start <= limit) return false;
    }
  }

  return true;
}

function doubleQuotedString(value, ctx) {
  const {
    implicitKey,
    indent
  } = ctx;
  const {
    jsonEncoding,
    minMultiLineLength
  } = _options.strOptions.doubleQuoted;
  const json = JSON.stringify(value);
  if (jsonEncoding) return json;
  let str = '';
  let start = 0;

  for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
    if (ch === ' ' && json[i + 1] === '\\' && json[i + 2] === 'n') {
      // space before newline needs to be escaped to not be folded
      str += json.slice(start, i) + '\\ ';
      i += 1;
      start = i;
      ch = '\\';
    }

    if (ch === '\\') switch (json[i + 1]) {
      case 'u':
        {
          str += json.slice(start, i);
          const code = json.substr(i + 2, 4);

          switch (code) {
            case '0000':
              str += '\\0';
              break;

            case '0007':
              str += '\\a';
              break;

            case '000b':
              str += '\\v';
              break;

            case '001b':
              str += '\\e';
              break;

            case '0085':
              str += '\\N';
              break;

            case '00a0':
              str += '\\_';
              break;

            case '2028':
              str += '\\L';
              break;

            case '2029':
              str += '\\P';
              break;

            default:
              if (code.substr(0, 2) === '00') str += '\\x' + code.substr(2);else str += json.substr(i, 6);
          }

          i += 5;
          start = i + 1;
        }
        break;

      case 'n':
        if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
          i += 1;
        } else {
          // folding will eat first newline
          str += json.slice(start, i) + '\n\n';

          while (json[i + 2] === '\\' && json[i + 3] === 'n' && json[i + 4] !== '"') {
            str += '\n';
            i += 2;
          }

          str += indent; // space after newline needs to be escaped to not be folded

          if (json[i + 2] === ' ') str += '\\';
          i += 1;
          start = i + 1;
        }

        break;

      default:
        i += 1;
    }
  }

  str = start ? str + json.slice(start) : json;
  return implicitKey ? str : (0, _foldFlowLines.foldFlowLines)(str, indent, _foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx));
}

function singleQuotedString(value, ctx) {
  const {
    indent,
    implicitKey
  } = ctx;

  if (implicitKey) {
    if (/\n/.test(value)) return doubleQuotedString(value, ctx);
  } else {
    // single quoted string can't have leading or trailing whitespace around newline
    if (/[ \t]\n|\n[ \t]/.test(value)) return doubleQuotedString(value, ctx);
  }

  const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&\n${indent}`) + "'";
  return implicitKey ? res : (0, _foldFlowLines.foldFlowLines)(res, indent, _foldFlowLines.FOLD_FLOW, getFoldOptions(ctx));
}

function blockString({
  comment,
  type,
  value
}, ctx, onComment, onChompKeep) {
  // 1. Block can't end in whitespace unless the last line is non-empty.
  // 2. Strings consisting of only whitespace are best rendered explicitly.
  if (/\n[\t ]+$/.test(value) || /^\s*$/.test(value)) {
    return doubleQuotedString(value, ctx);
  }

  const indent = ctx.indent || (ctx.forceBlockIndent ? ' ' : '');
  const indentSize = indent ? '2' : '1'; // root is at -1

  const literal = type === _constants.Type.BLOCK_FOLDED ? false : type === _constants.Type.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, _options.strOptions.fold.lineWidth - indent.length);
  let header = literal ? '|' : '>';
  if (!value) return header + '\n';
  let wsStart = '';
  let wsEnd = '';
  value = value.replace(/[\n\t ]*$/, ws => {
    const n = ws.indexOf('\n');

    if (n === -1) {
      header += '-'; // strip
    } else if (value === ws || n !== ws.length - 1) {
      header += '+'; // keep

      if (onChompKeep) onChompKeep();
    }

    wsEnd = ws.replace(/\n$/, '');
    return '';
  }).replace(/^[\n ]*/, ws => {
    if (ws.indexOf(' ') !== -1) header += indentSize;
    const m = ws.match(/ +$/);

    if (m) {
      wsStart = ws.slice(0, -m[0].length);
      return m[0];
    } else {
      wsStart = ws;
      return '';
    }
  });
  if (wsEnd) wsEnd = wsEnd.replace(/\n+(?!\n|$)/g, `$&${indent}`);
  if (wsStart) wsStart = wsStart.replace(/\n+/g, `$&${indent}`);

  if (comment) {
    header += ' #' + comment.replace(/ ?[\r\n]+/g, ' ');
    if (onComment) onComment();
  }

  if (!value) return `${header}${indentSize}\n${indent}${wsEnd}`;

  if (literal) {
    value = value.replace(/\n+/g, `$&${indent}`);
    return `${header}\n${indent}${wsStart}${value}${wsEnd}`;
  }

  value = value.replace(/\n+/g, '\n$&').replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, '$1$2') // more-indented lines aren't folded
  //         ^ ind.line  ^ empty     ^ capture next empty lines only at end of indent
  .replace(/\n+/g, `$&${indent}`);
  const body = (0, _foldFlowLines.foldFlowLines)(`${wsStart}${value}${wsEnd}`, indent, _foldFlowLines.FOLD_BLOCK, _options.strOptions.fold);
  return `${header}\n${indent}${body}`;
}

function plainString(item, ctx, onComment, onChompKeep) {
  const {
    comment,
    type,
    value
  } = item;
  const {
    actualString,
    implicitKey,
    indent,
    inFlow,
    tags
  } = ctx;

  if (implicitKey && /[\n[\]{},]/.test(value) || inFlow && /[[\]{},]/.test(value)) {
    return doubleQuotedString(value, ctx);
  }

  if (!value || /^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
    // not allowed:
    // - empty string, '-' or '?'
    // - start with an indicator character (except [?:-]) or /[?-] /
    // - '\n ', ': ' or ' \n' anywhere
    // - '#' not preceded by a non-space char
    // - end with ' ' or ':'
    return implicitKey || inFlow || value.indexOf('\n') === -1 ? value.indexOf('"') !== -1 && value.indexOf("'") === -1 ? singleQuotedString(value, ctx) : doubleQuotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
  }

  if (!implicitKey && !inFlow && type !== _constants.Type.PLAIN && value.indexOf('\n') !== -1) {
    // Where allowed & type not set explicitly, prefer block style for multiline strings
    return blockString(item, ctx, onComment, onChompKeep);
  }

  const str = value.replace(/\n+/g, `$&\n${indent}`); // Verify that output will be parsed as a string, as e.g. plain numbers and
  // booleans get parsed with those types in v1.2 (e.g. '42', 'true' & '0.9e-3'),
  // and others in v1.1.

  if (actualString && typeof tags.resolveScalar(str).value !== 'string') {
    return doubleQuotedString(value, ctx);
  }

  const body = implicitKey ? str : (0, _foldFlowLines.foldFlowLines)(str, indent, _foldFlowLines.FOLD_FLOW, getFoldOptions(ctx));

  if (comment && !inFlow && (body.indexOf('\n') !== -1 || comment.indexOf('\n') !== -1)) {
    if (onComment) onComment();
    return (0, _addComment.addCommentBefore)(body, indent, comment);
  }

  return body;
}

function stringifyString(item, ctx, onComment, onChompKeep) {
  const {
    defaultType
  } = _options.strOptions;
  const {
    implicitKey,
    inFlow
  } = ctx;
  let {
    type,
    value
  } = item;

  if (typeof value !== 'string') {
    value = String(value);
    item = Object.assign({}, item, {
      value
    });
  }

  const _stringify = _type => {
    switch (_type) {
      case _constants.Type.BLOCK_FOLDED:
      case _constants.Type.BLOCK_LITERAL:
        return blockString(item, ctx, onComment, onChompKeep);

      case _constants.Type.QUOTE_DOUBLE:
        return doubleQuotedString(value, ctx);

      case _constants.Type.QUOTE_SINGLE:
        return singleQuotedString(value, ctx);

      case _constants.Type.PLAIN:
        return plainString(item, ctx, onComment, onChompKeep);

      default:
        return null;
    }
  };

  if (type !== _constants.Type.QUOTE_DOUBLE && /[\x00-\x08\x0b-\x1f\x7f-\x9f]/.test(value)) {
    // force double quotes on control characters
    type = _constants.Type.QUOTE_DOUBLE;
  } else if ((implicitKey || inFlow) && (type === _constants.Type.BLOCK_FOLDED || type === _constants.Type.BLOCK_LITERAL)) {
    // should not happen; blocks are not valid inside flow containers
    type = _constants.Type.QUOTE_DOUBLE;
  }

  let res = _stringify(type);

  if (res === null) {
    res = _stringify(defaultType);
    if (res === null) throw new Error(`Unsupported default string type ${defaultType}`);
  }

  return res;
}

/***/ }),

/***/ 323:
/***/ (function(module) {

"use strict";


var isStream = module.exports = function (stream) {
	return stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function';
};

isStream.writable = function (stream) {
	return isStream(stream) && stream.writable !== false && typeof stream._write === 'function' && typeof stream._writableState === 'object';
};

isStream.readable = function (stream) {
	return isStream(stream) && stream.readable !== false && typeof stream._read === 'function' && typeof stream._readableState === 'object';
};

isStream.duplex = function (stream) {
	return isStream.writable(stream) && isStream.readable(stream);
};

isStream.transform = function (stream) {
	return isStream.duplex(stream) && typeof stream._transform === 'function' && typeof stream._transformState === 'object';
};


/***/ }),

/***/ 325:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.Pair = void 0;

var _addComment = __webpack_require__(836);

var _constants = __webpack_require__(383);

var _toJSON = __webpack_require__(923);

var _Collection = __webpack_require__(380);

var _Node = __webpack_require__(156);

var _Scalar = __webpack_require__(515);

var _Seq = __webpack_require__(29);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const stringifyKey = (key, jsKey, ctx) => {
  if (jsKey === null) return '';
  if (typeof jsKey !== 'object') return String(jsKey);
  if (key instanceof _Node.Node && ctx && ctx.doc) return key.toString({
    anchors: {},
    doc: ctx.doc,
    indent: '',
    indentStep: ctx.indentStep,
    inFlow: true,
    inStringifyKey: true
  });
  return JSON.stringify(jsKey);
};

class Pair extends _Node.Node {
  constructor(key, value = null) {
    super();
    this.key = key;
    this.value = value;
    this.type = Pair.Type.PAIR;
  }

  get commentBefore() {
    return this.key && this.key.commentBefore;
  }

  set commentBefore(cb) {
    if (this.key == null) this.key = new _Scalar.Scalar(null);
    this.key.commentBefore = cb;
  }

  addToJSMap(ctx, map) {
    const key = (0, _toJSON.toJSON)(this.key, '', ctx);

    if (map instanceof Map) {
      const value = (0, _toJSON.toJSON)(this.value, key, ctx);
      map.set(key, value);
    } else if (map instanceof Set) {
      map.add(key);
    } else {
      const stringKey = stringifyKey(this.key, key, ctx);
      map[stringKey] = (0, _toJSON.toJSON)(this.value, stringKey, ctx);
    }

    return map;
  }

  toJSON(_, ctx) {
    const pair = ctx && ctx.mapAsMap ? new Map() : {};
    return this.addToJSMap(ctx, pair);
  }

  toString(ctx, onComment, onChompKeep) {
    if (!ctx || !ctx.doc) return JSON.stringify(this);
    const {
      indent: indentSize,
      indentSeq,
      simpleKeys
    } = ctx.doc.options;
    let {
      key,
      value
    } = this;
    let keyComment = key instanceof _Node.Node && key.comment;

    if (simpleKeys) {
      if (keyComment) {
        throw new Error('With simple keys, key nodes cannot have comments');
      }

      if (key instanceof _Collection.Collection) {
        const msg = 'With simple keys, collection cannot be used as a key value';
        throw new Error(msg);
      }
    }

    const explicitKey = !simpleKeys && (!key || keyComment || key instanceof _Collection.Collection || key.type === _constants.Type.BLOCK_FOLDED || key.type === _constants.Type.BLOCK_LITERAL);
    const {
      doc,
      indent,
      indentStep
    } = ctx;
    ctx = Object.assign({}, ctx, {
      implicitKey: !explicitKey,
      indent: indent + indentStep
    });
    let chompKeep = false;
    let str = doc.schema.stringify(key, ctx, () => keyComment = null, () => chompKeep = true);
    str = (0, _addComment.addComment)(str, ctx.indent, keyComment);

    if (ctx.allNullValues && !simpleKeys) {
      if (this.comment) {
        str = (0, _addComment.addComment)(str, ctx.indent, this.comment);
        if (onComment) onComment();
      } else if (chompKeep && !keyComment && onChompKeep) onChompKeep();

      return ctx.inFlow ? str : `? ${str}`;
    }

    str = explicitKey ? `? ${str}\n${indent}:` : `${str}:`;

    if (this.comment) {
      // expected (but not strictly required) to be a single-line comment
      str = (0, _addComment.addComment)(str, ctx.indent, this.comment);
      if (onComment) onComment();
    }

    let vcb = '';
    let valueComment = null;

    if (value instanceof _Node.Node) {
      if (value.spaceBefore) vcb = '\n';

      if (value.commentBefore) {
        const cs = value.commentBefore.replace(/^/gm, `${ctx.indent}#`);
        vcb += `\n${cs}`;
      }

      valueComment = value.comment;
    } else if (value && typeof value === 'object') {
      value = doc.schema.createNode(value, true);
    }

    ctx.implicitKey = false;
    if (!explicitKey && !this.comment && value instanceof _Scalar.Scalar) ctx.indentAtStart = str.length + 1;
    chompKeep = false;

    if (!indentSeq && indentSize >= 2 && !ctx.inFlow && !explicitKey && value instanceof _Seq.YAMLSeq && value.type !== _constants.Type.FLOW_SEQ && !value.tag && !doc.anchors.getName(value)) {
      // If indentSeq === false, consider '- ' as part of indentation where possible
      ctx.indent = ctx.indent.substr(2);
    }

    const valueStr = doc.schema.stringify(value, ctx, () => valueComment = null, () => chompKeep = true);
    let ws = ' ';

    if (vcb || this.comment) {
      ws = `${vcb}\n${ctx.indent}`;
    } else if (!explicitKey && value instanceof _Collection.Collection) {
      const flow = valueStr[0] === '[' || valueStr[0] === '{';
      if (!flow || valueStr.includes('\n')) ws = `\n${ctx.indent}`;
    }

    if (chompKeep && !valueComment && onChompKeep) onChompKeep();
    return (0, _addComment.addComment)(str + ws + valueStr, ctx.indent, valueComment);
  }

}

exports.Pair = Pair;

_defineProperty(Pair, "Type", {
  PAIR: 'PAIR',
  MERGE_PAIR: 'MERGE_PAIR'
});

/***/ }),

/***/ 336:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasLastPage

const deprecate = __webpack_require__(370)
const getPageLinks = __webpack_require__(577)

function hasLastPage (link) {
  deprecate(`octokit.hasLastPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).last
}


/***/ }),

/***/ 339:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.tags = exports.schemas = void 0;

var _core = __webpack_require__(775);

var _failsafe = __webpack_require__(195);

var _json = __webpack_require__(77);

var _yaml = __webpack_require__(714);

var _map = __webpack_require__(732);

var _seq = __webpack_require__(767);

var _binary = __webpack_require__(996);

var _omap = __webpack_require__(821);

var _pairs = __webpack_require__(566);

var _set = __webpack_require__(785);

var _timestamp = __webpack_require__(414);

const schemas = {
  core: _core.core,
  failsafe: _failsafe.failsafe,
  json: _json.json,
  yaml11: _yaml.yaml11
};
exports.schemas = schemas;
const tags = {
  binary: _binary.binary,
  bool: _core.boolObj,
  float: _core.floatObj,
  floatExp: _core.expObj,
  floatNaN: _core.nanObj,
  floatTime: _timestamp.floatTime,
  int: _core.intObj,
  intHex: _core.hexObj,
  intOct: _core.octObj,
  intTime: _timestamp.intTime,
  map: _map.map,
  null: _core.nullObj,
  omap: _omap.omap,
  pairs: _pairs.pairs,
  seq: _seq.seq,
  set: _set.set,
  timestamp: _timestamp.timestamp
};
exports.tags = tags;

/***/ }),

/***/ 343:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.Alias = void 0;

var _Node = __webpack_require__(974);

var _Range = __webpack_require__(994);

class Alias extends _Node.Node {
  /**
   * Parses an *alias from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar
   */
  parse(context, start) {
    this.context = context;
    const {
      src
    } = context;

    let offset = _Node.Node.endOfIdentifier(src, start + 1);

    this.valueRange = new _Range.Range(start + 1, offset);
    offset = _Node.Node.endOfWhiteSpace(src, offset);
    offset = this.parseComment(offset);
    return offset;
  }

}

exports.Alias = Alias;

/***/ }),

/***/ 348:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


module.exports = validate;

const { RequestError } = __webpack_require__(497);
const get = __webpack_require__(854);
const set = __webpack_require__(883);

function validate(octokit, options) {
  if (!options.request.validate) {
    return;
  }
  const { validate: params } = options.request;

  Object.keys(params).forEach(parameterName => {
    const parameter = get(params, parameterName);

    const expectedType = parameter.type;
    let parentParameterName;
    let parentValue;
    let parentParamIsPresent = true;
    let parentParameterIsArray = false;

    if (/\./.test(parameterName)) {
      parentParameterName = parameterName.replace(/\.[^.]+$/, "");
      parentParameterIsArray = parentParameterName.slice(-2) === "[]";
      if (parentParameterIsArray) {
        parentParameterName = parentParameterName.slice(0, -2);
      }
      parentValue = get(options, parentParameterName);
      parentParamIsPresent =
        parentParameterName === "headers" ||
        (typeof parentValue === "object" && parentValue !== null);
    }

    const values = parentParameterIsArray
      ? (get(options, parentParameterName) || []).map(
          value => value[parameterName.split(/\./).pop()]
        )
      : [get(options, parameterName)];

    values.forEach((value, i) => {
      const valueIsPresent = typeof value !== "undefined";
      const valueIsNull = value === null;
      const currentParameterName = parentParameterIsArray
        ? parameterName.replace(/\[\]/, `[${i}]`)
        : parameterName;

      if (!parameter.required && !valueIsPresent) {
        return;
      }

      // if the parent parameter is of type object but allows null
      // then the child parameters can be ignored
      if (!parentParamIsPresent) {
        return;
      }

      if (parameter.allowNull && valueIsNull) {
        return;
      }

      if (!parameter.allowNull && valueIsNull) {
        throw new RequestError(
          `'${currentParameterName}' cannot be null`,
          400,
          {
            request: options
          }
        );
      }

      if (parameter.required && !valueIsPresent) {
        throw new RequestError(
          `Empty value for parameter '${currentParameterName}': ${JSON.stringify(
            value
          )}`,
          400,
          {
            request: options
          }
        );
      }

      // parse to integer before checking for enum
      // so that string "1" will match enum with number 1
      if (expectedType === "integer") {
        const unparsedValue = value;
        value = parseInt(value, 10);
        if (isNaN(value)) {
          throw new RequestError(
            `Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
              unparsedValue
            )} is NaN`,
            400,
            {
              request: options
            }
          );
        }
      }

      if (parameter.enum && parameter.enum.indexOf(String(value)) === -1) {
        throw new RequestError(
          `Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
            value
          )}`,
          400,
          {
            request: options
          }
        );
      }

      if (parameter.validation) {
        const regex = new RegExp(parameter.validation);
        if (!regex.test(value)) {
          throw new RequestError(
            `Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
              value
            )}`,
            400,
            {
              request: options
            }
          );
        }
      }

      if (expectedType === "object" && typeof value === "string") {
        try {
          value = JSON.parse(value);
        } catch (exception) {
          throw new RequestError(
            `JSON parse error of value for parameter '${currentParameterName}': ${JSON.stringify(
              value
            )}`,
            400,
            {
              request: options
            }
          );
        }
      }

      set(options, parameter.mapTo || currentParameterName, value);
    });
  });

  return options;
}


/***/ }),

/***/ 349:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationRequestError;

const { RequestError } = __webpack_require__(497);

function authenticationRequestError(state, error, options) {
  /* istanbul ignore next */
  if (!error.headers) throw error;

  const otpRequired = /required/.test(error.headers["x-github-otp"] || "");
  // handle "2FA required" error only
  if (error.status !== 401 || !otpRequired) {
    throw error;
  }

  if (
    error.status === 401 &&
    otpRequired &&
    error.request &&
    error.request.headers["x-github-otp"]
  ) {
    throw new RequestError(
      "Invalid one-time password for two-factor authentication",
      401,
      {
        headers: error.headers,
        request: options
      }
    );
  }

  if (typeof state.auth.on2fa !== "function") {
    throw new RequestError(
      "2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication",
      401,
      {
        headers: error.headers,
        request: options
      }
    );
  }

  return Promise.resolve()
    .then(() => {
      return state.auth.on2fa();
    })
    .then(oneTimePassword => {
      const newOptions = Object.assign(options, {
        headers: Object.assign(
          { "x-github-otp": oneTimePassword },
          options.headers
        )
      });
      return state.octokit.request(newOptions);
    });
}


/***/ }),

/***/ 357:
/***/ (function(module) {

module.exports = require("assert");

/***/ }),

/***/ 363:
/***/ (function(module) {

module.exports = register

function register (state, name, method, options) {
  if (typeof method !== 'function') {
    throw new Error('method for before hook must be a function')
  }

  if (!options) {
    options = {}
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce(function (callback, name) {
      return register.bind(null, state, name, callback, options)
    }, method)()
  }

  return Promise.resolve()
    .then(function () {
      if (!state.registry[name]) {
        return method(options)
      }

      return (state.registry[name]).reduce(function (method, registered) {
        return registered.hook.bind(null, method, options)
      }, method)()
    })
}


/***/ }),

/***/ 368:
/***/ (function(module) {

module.exports = function atob(str) {
  return Buffer.from(str, 'base64').toString('binary')
}


/***/ }),

/***/ 370:
/***/ (function(module) {

module.exports = deprecate

const loggedMessages = {}

function deprecate (message) {
  if (loggedMessages[message]) {
    return
  }

  console.warn(`DEPRECATED (@octokit/rest): ${message}`)
  loggedMessages[message] = 1
}


/***/ }),

/***/ 374:
/***/ (function(module, __unusedexports, __webpack_require__) {

const yaml = __webpack_require__(521);
const fs = __webpack_require__(747);

class Problem {

    constructor(dir){
        this.baseDir = dir;
        this.rawConf = fs.readFileSync(`${this.baseDir}/problem.yml`).toString();
        this.conf = yaml.parse(this.rawConf);
        this.cases = this.scanTestCases();
        console.log(this.conf);
        console.log(this.cases);
    }

    scanTestCases() {
        const files = fs.readdirSync(`${this.baseDir}/testcase`);
        const cases = {};
        const retCases = {};

        for(const f of files) {
            const k = f.split('.');
            const suffix = k.slice(-1)[0];
            if(/^(in|ans)$/g.test(suffix)){
                const name = k.slice(0,-1).join('.');
                // if(parseInt(name)) {
                if(cases[name]) cases[name][`${suffix}File`] = f;
                else cases[name] = { 
                    [`${suffix}File`]: f,
                };
                // }
            }
        }
        for(const el of Object.keys(cases)){
            if(Object.keys(cases[el]).length != 2) continue;
            retCases[el] = cases[el];
        }
        return retCases;
    }
}

module.exports = Problem;

/***/ }),

/***/ 380:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.Collection = exports.isEmptyPath = void 0;

var _addComment = __webpack_require__(836);

var _constants = __webpack_require__(383);

var _Node = __webpack_require__(156);

var _Scalar = __webpack_require__(515);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function collectionFromPath(schema, path, value) {
  let v = value;

  for (let i = path.length - 1; i >= 0; --i) {
    const k = path[i];
    const o = Number.isInteger(k) && k >= 0 ? [] : {};
    o[k] = v;
    v = o;
  }

  return schema.createNode(v, false);
} // null, undefined, or an empty non-string iterable (e.g. [])


const isEmptyPath = path => path == null || typeof path === 'object' && path[Symbol.iterator]().next().done;

exports.isEmptyPath = isEmptyPath;

class Collection extends _Node.Node {
  constructor(schema) {
    super();

    _defineProperty(this, "items", []);

    this.schema = schema;
  }

  addIn(path, value) {
    if (isEmptyPath(path)) this.add(value);else {
      const [key, ...rest] = path;
      const node = this.get(key, true);
      if (node instanceof Collection) node.addIn(rest, value);else if (node === undefined && this.schema) this.set(key, collectionFromPath(this.schema, rest, value));else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
  }

  deleteIn([key, ...rest]) {
    if (rest.length === 0) return this.delete(key);
    const node = this.get(key, true);
    if (node instanceof Collection) return node.deleteIn(rest);else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
  }

  getIn([key, ...rest], keepScalar) {
    const node = this.get(key, true);
    if (rest.length === 0) return !keepScalar && node instanceof _Scalar.Scalar ? node.value : node;else return node instanceof Collection ? node.getIn(rest, keepScalar) : undefined;
  }

  hasAllNullValues() {
    return this.items.every(node => {
      if (!node || node.type !== 'PAIR') return false;
      const n = node.value;
      return n == null || n instanceof _Scalar.Scalar && n.value == null && !n.commentBefore && !n.comment && !n.tag;
    });
  }

  hasIn([key, ...rest]) {
    if (rest.length === 0) return this.has(key);
    const node = this.get(key, true);
    return node instanceof Collection ? node.hasIn(rest) : false;
  }

  setIn([key, ...rest], value) {
    if (rest.length === 0) {
      this.set(key, value);
    } else {
      const node = this.get(key, true);
      if (node instanceof Collection) node.setIn(rest, value);else if (node === undefined && this.schema) this.set(key, collectionFromPath(this.schema, rest, value));else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
  } // overridden in implementations

  /* istanbul ignore next */


  toJSON() {
    return null;
  }

  toString(ctx, {
    blockItem,
    flowChars,
    isMap,
    itemIndent
  }, onComment, onChompKeep) {
    const {
      doc,
      indent,
      indentStep
    } = ctx;
    const inFlow = this.type === _constants.Type.FLOW_MAP || this.type === _constants.Type.FLOW_SEQ || ctx.inFlow;
    if (inFlow) itemIndent += indentStep;
    const allNullValues = isMap && this.hasAllNullValues();
    ctx = Object.assign({}, ctx, {
      allNullValues,
      indent: itemIndent,
      inFlow,
      type: null
    });
    let chompKeep = false;
    let hasItemWithNewLine = false;
    const nodes = this.items.reduce((nodes, item, i) => {
      let comment;

      if (item) {
        if (!chompKeep && item.spaceBefore) nodes.push({
          type: 'comment',
          str: ''
        });
        if (item.commentBefore) item.commentBefore.match(/^.*$/gm).forEach(line => {
          nodes.push({
            type: 'comment',
            str: `#${line}`
          });
        });
        if (item.comment) comment = item.comment;
        if (inFlow && (!chompKeep && item.spaceBefore || item.commentBefore || item.comment || item.key && (item.key.commentBefore || item.key.comment) || item.value && (item.value.commentBefore || item.value.comment))) hasItemWithNewLine = true;
      }

      chompKeep = false;
      let str = doc.schema.stringify(item, ctx, () => comment = null, () => chompKeep = true);
      if (inFlow && !hasItemWithNewLine && str.includes('\n')) hasItemWithNewLine = true;
      if (inFlow && i < this.items.length - 1) str += ',';
      str = (0, _addComment.addComment)(str, itemIndent, comment);
      if (chompKeep && (comment || inFlow)) chompKeep = false;
      nodes.push({
        type: 'item',
        str
      });
      return nodes;
    }, []);
    let str;

    if (nodes.length === 0) {
      str = flowChars.start + flowChars.end;
    } else if (inFlow) {
      const {
        start,
        end
      } = flowChars;
      const strings = nodes.map(n => n.str);

      if (hasItemWithNewLine || strings.reduce((sum, str) => sum + str.length + 2, 2) > Collection.maxFlowStringSingleLineLength) {
        str = start;

        for (const s of strings) {
          str += s ? `\n${indentStep}${indent}${s}` : '\n';
        }

        str += `\n${indent}${end}`;
      } else {
        str = `${start} ${strings.join(' ')} ${end}`;
      }
    } else {
      const strings = nodes.map(blockItem);
      str = strings.shift();

      for (const s of strings) str += s ? `\n${indent}${s}` : '\n';
    }

    if (this.comment) {
      str += '\n' + this.comment.replace(/^/gm, `${indent}#`);
      if (onComment) onComment();
    } else if (chompKeep && onChompKeep) onChompKeep();

    return str;
  }

}

exports.Collection = Collection;

_defineProperty(Collection, "maxFlowStringSingleLineLength", 60);

/***/ }),

/***/ 383:
/***/ (function(__unusedmodule, exports) {

"use strict";


exports.Type = exports.Char = void 0;
const Char = {
  ANCHOR: '&',
  COMMENT: '#',
  TAG: '!',
  DIRECTIVES_END: '-',
  DOCUMENT_END: '.'
};
exports.Char = Char;
const Type = {
  ALIAS: 'ALIAS',
  BLANK_LINE: 'BLANK_LINE',
  BLOCK_FOLDED: 'BLOCK_FOLDED',
  BLOCK_LITERAL: 'BLOCK_LITERAL',
  COMMENT: 'COMMENT',
  DIRECTIVE: 'DIRECTIVE',
  DOCUMENT: 'DOCUMENT',
  FLOW_MAP: 'FLOW_MAP',
  FLOW_SEQ: 'FLOW_SEQ',
  MAP: 'MAP',
  MAP_KEY: 'MAP_KEY',
  MAP_VALUE: 'MAP_VALUE',
  PLAIN: 'PLAIN',
  QUOTE_DOUBLE: 'QUOTE_DOUBLE',
  QUOTE_SINGLE: 'QUOTE_SINGLE',
  SEQ: 'SEQ',
  SEQ_ITEM: 'SEQ_ITEM'
};
exports.Type = Type;

/***/ }),

/***/ 385:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isPlainObject = _interopDefault(__webpack_require__(696));
var universalUserAgent = __webpack_require__(796);

function lowercaseKeys(object) {
  if (!object) {
    return {};
  }

  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}

function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);
  Object.keys(options).forEach(key => {
    if (isPlainObject(options[key])) {
      if (!(key in defaults)) Object.assign(result, {
        [key]: options[key]
      });else result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, {
        [key]: options[key]
      });
    }
  });
  return result;
}

function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? {
      method,
      url
    } : {
      url: method
    }, options);
  } else {
    options = Object.assign({}, route);
  } // lowercase header names before merging with defaults to avoid duplicates


  options.headers = lowercaseKeys(options.headers);
  const mergedOptions = mergeDeep(defaults || {}, options); // mediaType.previews arrays are merged, instead of overwritten

  if (defaults && defaults.mediaType.previews.length) {
    mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(preview => !mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews);
  }

  mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map(preview => preview.replace(/-preview/, ""));
  return mergedOptions;
}

function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);

  if (names.length === 0) {
    return url;
  }

  return url + separator + names.map(name => {
    if (name === "q") {
      return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
    }

    return `${name}=${encodeURIComponent(parameters[name])}`;
  }).join("&");
}

const urlVariableRegex = /\{[^}]+\}/g;

function removeNonChars(variableName) {
  return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}

function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);

  if (!matches) {
    return [];
  }

  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

function omit(object, keysToOmit) {
  return Object.keys(object).filter(option => !keysToOmit.includes(option)).reduce((obj, key) => {
    obj[key] = object[key];
    return obj;
  }, {});
}

// Based on https://github.com/bramstein/url-template, licensed under BSD
// TODO: create separate package.
//
// Copyright (c) 2012-2014, Bram Stein
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/* istanbul ignore file */
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }

    return part;
  }).join("");
}

function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);

  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}

function isDefined(value) {
  return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}

function getValues(context, operator, key, modifier) {
  var value = context[key],
      result = [];

  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();

      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }

      result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];

        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            tmp.push(encodeValue(operator, value));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }

        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }

  return result;
}

function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}

function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
    if (expression) {
      let operator = "";
      const values = [];

      if (operators.indexOf(expression.charAt(0)) !== -1) {
        operator = expression.charAt(0);
        expression = expression.substr(1);
      }

      expression.split(/,/g).forEach(function (variable) {
        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
        values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
      });

      if (operator && operator !== "+") {
        var separator = ",";

        if (operator === "?") {
          separator = "&";
        } else if (operator !== "#") {
          separator = operator;
        }

        return (values.length !== 0 ? operator : "") + values.join(separator);
      } else {
        return values.join(",");
      }
    } else {
      return encodeReserved(literal);
    }
  });
}

function parse(options) {
  // https://fetch.spec.whatwg.org/#methods
  let method = options.method.toUpperCase(); // replace :varname with {varname} to make it RFC 6570 compatible

  let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{+$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, ["method", "baseUrl", "url", "headers", "request", "mediaType"]); // extract variable names from URL to calculate remaining variables later

  const urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters);

  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }

  const omittedParameters = Object.keys(options).filter(option => urlVariableNames.includes(option)).concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);
  const isBinaryRequset = /application\/octet-stream/i.test(headers.accept);

  if (!isBinaryRequset) {
    if (options.mediaType.format) {
      // e.g. application/vnd.github.v3+json => application/vnd.github.v3.raw
      headers.accept = headers.accept.split(/,/).map(preview => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)).join(",");
    }

    if (options.mediaType.previews.length) {
      const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
      headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map(preview => {
        const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
        return `application/vnd.github.${preview}-preview${format}`;
      }).join(",");
    }
  } // for GET/HEAD requests, set URL query parameters from remaining parameters
  // for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters


  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      } else {
        headers["content-length"] = 0;
      }
    }
  } // default content-type for JSON if body is set


  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  } // GitHub expects 'content-length: 0' header for PUT/PATCH requests without body.
  // fetch does not allow to set `content-length` header, but we can set body to an empty string


  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  } // Only return body/request keys if present


  return Object.assign({
    method,
    url,
    headers
  }, typeof body !== "undefined" ? {
    body
  } : null, options.request ? {
    request: options.request
  } : null);
}

function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}

function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS = merge(oldDefaults, newDefaults);
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS);
  return Object.assign(endpoint, {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse
  });
}

const VERSION = "6.0.1";

const userAgent = `octokit-endpoint.js/${VERSION} ${universalUserAgent.getUserAgent()}`; // DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.

const DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: "",
    previews: []
  }
};

const endpoint = withDefaults(null, DEFAULTS);

exports.endpoint = endpoint;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 386:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.Merge = exports.MERGE_KEY = void 0;

var _Map = __webpack_require__(684);

var _Pair = __webpack_require__(325);

var _Scalar = __webpack_require__(515);

var _Seq = __webpack_require__(29);

const MERGE_KEY = '<<';
exports.MERGE_KEY = MERGE_KEY;

class Merge extends _Pair.Pair {
  constructor(pair) {
    if (pair instanceof _Pair.Pair) {
      let seq = pair.value;

      if (!(seq instanceof _Seq.YAMLSeq)) {
        seq = new _Seq.YAMLSeq();
        seq.items.push(pair.value);
        seq.range = pair.value.range;
      }

      super(pair.key, seq);
      this.range = pair.range;
    } else {
      super(new _Scalar.Scalar(MERGE_KEY), new _Seq.YAMLSeq());
    }

    this.type = _Pair.Pair.Type.MERGE_PAIR;
  } // If the value associated with a merge key is a single mapping node, each of
  // its key/value pairs is inserted into the current mapping, unless the key
  // already exists in it. If the value associated with the merge key is a
  // sequence, then this sequence is expected to contain mapping nodes and each
  // of these nodes is merged in turn according to its order in the sequence.
  // Keys in mapping nodes earlier in the sequence override keys specified in
  // later mapping nodes. -- http://yaml.org/type/merge.html


  addToJSMap(ctx, map) {
    for (const {
      source
    } of this.value.items) {
      if (!(source instanceof _Map.YAMLMap)) throw new Error('Merge sources must be maps');
      const srcMap = source.toJSON(null, ctx, Map);

      for (const [key, value] of srcMap) {
        if (map instanceof Map) {
          if (!map.has(key)) map.set(key, value);
        } else if (map instanceof Set) {
          map.add(key);
        } else {
          if (!Object.prototype.hasOwnProperty.call(map, key)) map[key] = value;
        }
      }
    }

    return map;
  }

  toString(ctx, onComment) {
    const seq = this.value;
    if (seq.items.length > 1) return super.toString(ctx, onComment);
    this.value = seq.items[0];
    const str = super.toString(ctx, onComment);
    this.value = seq;
    return str;
  }

}

exports.Merge = Merge;

/***/ }),

/***/ 389:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(747);
const shebangCommand = __webpack_require__(866);

function readShebang(command) {
    // Read the first 150 bytes from the file
    const size = 150;
    let buffer;

    if (Buffer.alloc) {
        // Node.js v4.5+ / v5.10+
        buffer = Buffer.alloc(size);
    } else {
        // Old Node.js API
        buffer = new Buffer(size);
        buffer.fill(0); // zero-fill
    }

    let fd;

    try {
        fd = fs.openSync(command, 'r');
        fs.readSync(fd, buffer, 0, size, 0);
        fs.closeSync(fd);
    } catch (e) { /* Empty */ }

    // Attempt to extract shebang (null is returned if not a shebang)
    return shebangCommand(buffer.toString());
}

module.exports = readShebang;


/***/ }),

/***/ 402:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = Octokit;

const { request } = __webpack_require__(753);
const Hook = __webpack_require__(523);

const parseClientOptions = __webpack_require__(294);

function Octokit(plugins, options) {
  options = options || {};
  const hook = new Hook.Collection();
  const log = Object.assign(
    {
      debug: () => {},
      info: () => {},
      warn: console.warn,
      error: console.error
    },
    options && options.log
  );
  const api = {
    hook,
    log,
    request: request.defaults(parseClientOptions(options, log, hook))
  };

  plugins.forEach(pluginFunction => pluginFunction(api, options));

  return api;
}


/***/ }),

/***/ 405:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.YAMLWarning = exports.YAMLSyntaxError = exports.YAMLSemanticError = exports.YAMLReferenceError = exports.YAMLError = void 0;

var _Node = __webpack_require__(974);

var _sourceUtils = __webpack_require__(41);

var _Range = __webpack_require__(994);

class YAMLError extends Error {
  constructor(name, source, message) {
    if (!message || !(source instanceof _Node.Node)) throw new Error(`Invalid arguments for new ${name}`);
    super();
    this.name = name;
    this.message = message;
    this.source = source;
  }

  makePretty() {
    if (!this.source) return;
    this.nodeType = this.source.type;
    const cst = this.source.context && this.source.context.root;

    if (typeof this.offset === 'number') {
      this.range = new _Range.Range(this.offset, this.offset + 1);
      const start = cst && (0, _sourceUtils.getLinePos)(this.offset, cst);

      if (start) {
        const end = {
          line: start.line,
          col: start.col + 1
        };
        this.linePos = {
          start,
          end
        };
      }

      delete this.offset;
    } else {
      this.range = this.source.range;
      this.linePos = this.source.rangeAsLinePos;
    }

    if (this.linePos) {
      const {
        line,
        col
      } = this.linePos.start;
      this.message += ` at line ${line}, column ${col}`;
      const ctx = cst && (0, _sourceUtils.getPrettyContext)(this.linePos, cst);
      if (ctx) this.message += `:\n\n${ctx}\n`;
    }

    delete this.source;
  }

}

exports.YAMLError = YAMLError;

class YAMLReferenceError extends YAMLError {
  constructor(source, message) {
    super('YAMLReferenceError', source, message);
  }

}

exports.YAMLReferenceError = YAMLReferenceError;

class YAMLSemanticError extends YAMLError {
  constructor(source, message) {
    super('YAMLSemanticError', source, message);
  }

}

exports.YAMLSemanticError = YAMLSemanticError;

class YAMLSyntaxError extends YAMLError {
  constructor(source, message) {
    super('YAMLSyntaxError', source, message);
  }

}

exports.YAMLSyntaxError = YAMLSyntaxError;

class YAMLWarning extends YAMLError {
  constructor(source, message) {
    super('YAMLWarning', source, message);
  }

}

exports.YAMLWarning = YAMLWarning;

/***/ }),

/***/ 411:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.QuoteSingle = void 0;

var _errors = __webpack_require__(405);

var _Node = __webpack_require__(974);

var _Range = __webpack_require__(994);

class QuoteSingle extends _Node.Node {
  static endOfQuote(src, offset) {
    let ch = src[offset];

    while (ch) {
      if (ch === "'") {
        if (src[offset + 1] !== "'") break;
        ch = src[offset += 2];
      } else {
        ch = src[offset += 1];
      }
    }

    return offset + 1;
  }
  /**
   * @returns {string | { str: string, errors: YAMLSyntaxError[] }}
   */


  get strValue() {
    if (!this.valueRange || !this.context) return null;
    const errors = [];
    const {
      start,
      end
    } = this.valueRange;
    const {
      indent,
      src
    } = this.context;
    if (src[end - 1] !== "'") errors.push(new _errors.YAMLSyntaxError(this, "Missing closing 'quote"));
    let str = '';

    for (let i = start + 1; i < end - 1; ++i) {
      const ch = src[i];

      if (ch === '\n') {
        if (_Node.Node.atDocumentBoundary(src, i + 1)) errors.push(new _errors.YAMLSemanticError(this, 'Document boundary indicators are not allowed within string values'));

        const {
          fold,
          offset,
          error
        } = _Node.Node.foldNewline(src, i, indent);

        str += fold;
        i = offset;
        if (error) errors.push(new _errors.YAMLSemanticError(this, 'Multi-line single-quoted string needs to be sufficiently indented'));
      } else if (ch === "'") {
        str += ch;
        i += 1;
        if (src[i] !== "'") errors.push(new _errors.YAMLSyntaxError(this, 'Unescaped single quote? This should not happen.'));
      } else if (ch === ' ' || ch === '\t') {
        // trim trailing whitespace
        const wsStart = i;
        let next = src[i + 1];

        while (next === ' ' || next === '\t') {
          i += 1;
          next = src[i + 1];
        }

        if (next !== '\n') str += i > wsStart ? src.slice(wsStart, i + 1) : ch;
      } else {
        str += ch;
      }
    }

    return errors.length > 0 ? {
      errors,
      str
    } : str;
  }
  /**
   * Parses a 'single quoted' value from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar
   */


  parse(context, start) {
    this.context = context;
    const {
      src
    } = context;
    let offset = QuoteSingle.endOfQuote(src, start + 1);
    this.valueRange = new _Range.Range(start, offset);
    offset = _Node.Node.endOfWhiteSpace(src, offset);
    offset = this.parseComment(offset);
    return offset;
  }

}

exports.QuoteSingle = QuoteSingle;

/***/ }),

/***/ 413:
/***/ (function(module) {

module.exports = require("stream");

/***/ }),

/***/ 414:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.timestamp = exports.floatTime = exports.intTime = void 0;

var _stringify = __webpack_require__(315);

const parseSexagesimal = (sign, parts) => {
  const n = parts.split(':').reduce((n, p) => n * 60 + Number(p), 0);
  return sign === '-' ? -n : n;
}; // hhhh:mm:ss.sss


const stringifySexagesimal = ({
  value
}) => {
  if (isNaN(value) || !isFinite(value)) return (0, _stringify.stringifyNumber)(value);
  let sign = '';

  if (value < 0) {
    sign = '-';
    value = Math.abs(value);
  }

  const parts = [value % 60]; // seconds, including ms

  if (value < 60) {
    parts.unshift(0); // at least one : is required
  } else {
    value = Math.round((value - parts[0]) / 60);
    parts.unshift(value % 60); // minutes

    if (value >= 60) {
      value = Math.round((value - parts[0]) / 60);
      parts.unshift(value); // hours
    }
  }

  return sign + parts.map(n => n < 10 ? '0' + String(n) : String(n)).join(':').replace(/000000\d*$/, '') // % 60 may introduce error
  ;
};

const intTime = {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'TIME',
  test: /^([-+]?)([0-9][0-9_]*(?::[0-5]?[0-9])+)$/,
  resolve: (str, sign, parts) => parseSexagesimal(sign, parts.replace(/_/g, '')),
  stringify: stringifySexagesimal
};
exports.intTime = intTime;
const floatTime = {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  format: 'TIME',
  test: /^([-+]?)([0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*)$/,
  resolve: (str, sign, parts) => parseSexagesimal(sign, parts.replace(/_/g, '')),
  stringify: stringifySexagesimal
};
exports.floatTime = floatTime;
const timestamp = {
  identify: value => value instanceof Date,
  default: true,
  tag: 'tag:yaml.org,2002:timestamp',
  // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
  // may be omitted altogether, resulting in a date format. In such a case, the time part is
  // assumed to be 00:00:00Z (start of day, UTC).
  test: RegExp('^(?:' + '([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})' + // YYYY-Mm-Dd
  '(?:(?:t|T|[ \\t]+)' + // t | T | whitespace
  '([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)' + // Hh:Mm:Ss(.ss)?
  '(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?' + // Z | +5 | -03:30
  ')?' + ')$'),
  resolve: (str, year, month, day, hour, minute, second, millisec, tz) => {
    if (millisec) millisec = (millisec + '00').substr(1, 3);
    let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec || 0);

    if (tz && tz !== 'Z') {
      let d = parseSexagesimal(tz[0], tz.slice(1));
      if (Math.abs(d) < 30) d *= 60;
      date -= 60000 * d;
    }

    return new Date(date);
  },
  stringify: ({
    value
  }) => value.toISOString().replace(/((T00:00)?:00)?\.000Z$/, '')
};
exports.timestamp = timestamp;

/***/ }),

/***/ 415:
/***/ (function(__unusedmodule, exports) {

"use strict";


exports.foldFlowLines = foldFlowLines;
exports.FOLD_QUOTED = exports.FOLD_BLOCK = exports.FOLD_FLOW = void 0;
const FOLD_FLOW = 'flow';
exports.FOLD_FLOW = FOLD_FLOW;
const FOLD_BLOCK = 'block';
exports.FOLD_BLOCK = FOLD_BLOCK;
const FOLD_QUOTED = 'quoted'; // presumes i+1 is at the start of a line
// returns index of last newline in more-indented block

exports.FOLD_QUOTED = FOLD_QUOTED;

const consumeMoreIndentedLines = (text, i) => {
  let ch = text[i + 1];

  while (ch === ' ' || ch === '\t') {
    do {
      ch = text[i += 1];
    } while (ch && ch !== '\n');

    ch = text[i + 1];
  }

  return i;
};
/**
 * Tries to keep input at up to `lineWidth` characters, splitting only on spaces
 * not followed by newlines or spaces unless `mode` is `'quoted'`. Lines are
 * terminated with `\n` and started with `indent`.
 *
 * @param {string} text
 * @param {string} indent
 * @param {string} [mode='flow'] `'block'` prevents more-indented lines
 *   from being folded; `'quoted'` allows for `\` escapes, including escaped
 *   newlines
 * @param {Object} options
 * @param {number} [options.indentAtStart] Accounts for leading contents on
 *   the first line, defaulting to `indent.length`
 * @param {number} [options.lineWidth=80]
 * @param {number} [options.minContentWidth=20] Allow highly indented lines to
 *   stretch the line width
 * @param {function} options.onFold Called once if the text is folded
 * @param {function} options.onFold Called once if any line of text exceeds
 *   lineWidth characters
 */


function foldFlowLines(text, indent, mode, {
  indentAtStart,
  lineWidth = 80,
  minContentWidth = 20,
  onFold,
  onOverflow
}) {
  if (!lineWidth || lineWidth < 0) return text;
  const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
  if (text.length <= endStep) return text;
  const folds = [];
  const escapedFolds = {};
  let end = lineWidth - (typeof indentAtStart === 'number' ? indentAtStart : indent.length);
  let split = undefined;
  let prev = undefined;
  let overflow = false;
  let i = -1;

  if (mode === FOLD_BLOCK) {
    i = consumeMoreIndentedLines(text, i);
    if (i !== -1) end = i + endStep;
  }

  for (let ch; ch = text[i += 1];) {
    if (mode === FOLD_QUOTED && ch === '\\') {
      switch (text[i + 1]) {
        case 'x':
          i += 3;
          break;

        case 'u':
          i += 5;
          break;

        case 'U':
          i += 9;
          break;

        default:
          i += 1;
      }
    }

    if (ch === '\n') {
      if (mode === FOLD_BLOCK) i = consumeMoreIndentedLines(text, i);
      end = i + endStep;
      split = undefined;
    } else {
      if (ch === ' ' && prev && prev !== ' ' && prev !== '\n' && prev !== '\t') {
        // space surrounded by non-space can be replaced with newline + indent
        const next = text[i + 1];
        if (next && next !== ' ' && next !== '\n' && next !== '\t') split = i;
      }

      if (i >= end) {
        if (split) {
          folds.push(split);
          end = split + endStep;
          split = undefined;
        } else if (mode === FOLD_QUOTED) {
          // white-space collected at end may stretch past lineWidth
          while (prev === ' ' || prev === '\t') {
            prev = ch;
            ch = text[i += 1];
            overflow = true;
          } // i - 2 accounts for not-dropped last char + newline-escaping \


          folds.push(i - 2);
          escapedFolds[i - 2] = true;
          end = i - 2 + endStep;
          split = undefined;
        } else {
          overflow = true;
        }
      }
    }

    prev = ch;
  }

  if (overflow && onOverflow) onOverflow();
  if (folds.length === 0) return text;
  if (onFold) onFold();
  let res = text.slice(0, folds[0]);

  for (let i = 0; i < folds.length; ++i) {
    const fold = folds[i];
    const end = folds[i + 1] || text.length;
    if (mode === FOLD_QUOTED && escapedFolds[fold]) res += `${text[fold]}\\`;
    res += `\n${indent}${text.slice(fold + 1, end)}`;
  }

  return res;
}

/***/ }),

/***/ 422:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.strOptions = exports.nullOptions = exports.intOptions = exports.boolOptions = exports.binaryOptions = void 0;

var _constants = __webpack_require__(383);

const binaryOptions = {
  defaultType: _constants.Type.BLOCK_LITERAL,
  lineWidth: 76
};
exports.binaryOptions = binaryOptions;
const boolOptions = {
  trueStr: 'true',
  falseStr: 'false'
};
exports.boolOptions = boolOptions;
const intOptions = {
  asBigInt: false
};
exports.intOptions = intOptions;
const nullOptions = {
  nullStr: 'null'
};
exports.nullOptions = nullOptions;
const strOptions = {
  defaultType: _constants.Type.PLAIN,
  doubleQuoted: {
    jsonEncoding: false,
    minMultiLineLength: 40
  },
  fold: {
    lineWidth: 80,
    minContentWidth: 20
  }
};
exports.strOptions = strOptions;

/***/ }),

/***/ 427:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

// Older verions of Node.js might not have `util.getSystemErrorName()`.
// In that case, fall back to a deprecated internal.
const util = __webpack_require__(669);

let uv;

if (typeof util.getSystemErrorName === 'function') {
	module.exports = util.getSystemErrorName;
} else {
	try {
		uv = process.binding('uv');

		if (typeof uv.errname !== 'function') {
			throw new TypeError('uv.errname is not a function');
		}
	} catch (err) {
		console.error('execa/lib/errname: unable to establish process.binding(\'uv\')', err);
		uv = null;
	}

	module.exports = code => errname(uv, code);
}

// Used for testing the fallback behavior
module.exports.__test__ = errname;

function errname(uv, code) {
	if (uv) {
		return uv.errname(code);
	}

	if (!(code < 0)) {
		throw new Error('err >= 0');
	}

	return `Unknown system error ${code}`;
}



/***/ }),

/***/ 430:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = octokitValidate;

const validate = __webpack_require__(348);

function octokitValidate(octokit) {
  octokit.hook.before("request", validate.bind(null, octokit));
}


/***/ }),

/***/ 431:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(__webpack_require__(87));
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
function escapeData(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 453:
/***/ (function(module, __unusedexports, __webpack_require__) {

var once = __webpack_require__(969)
var eos = __webpack_require__(9)
var fs = __webpack_require__(747) // we only need fs to get the ReadStream and WriteStream prototypes

var noop = function () {}
var ancient = /^v?\.0/.test(process.version)

var isFn = function (fn) {
  return typeof fn === 'function'
}

var isFS = function (stream) {
  if (!ancient) return false // newer node version do not need to care about fs is a special way
  if (!fs) return false // browser
  return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close)
}

var isRequest = function (stream) {
  return stream.setHeader && isFn(stream.abort)
}

var destroyer = function (stream, reading, writing, callback) {
  callback = once(callback)

  var closed = false
  stream.on('close', function () {
    closed = true
  })

  eos(stream, {readable: reading, writable: writing}, function (err) {
    if (err) return callback(err)
    closed = true
    callback()
  })

  var destroyed = false
  return function (err) {
    if (closed) return
    if (destroyed) return
    destroyed = true

    if (isFS(stream)) return stream.close(noop) // use close for fs streams to avoid fd leaks
    if (isRequest(stream)) return stream.abort() // request.destroy just do .end - .abort is what we want

    if (isFn(stream.destroy)) return stream.destroy()

    callback(err || new Error('stream was destroyed'))
  }
}

var call = function (fn) {
  fn()
}

var pipe = function (from, to) {
  return from.pipe(to)
}

var pump = function () {
  var streams = Array.prototype.slice.call(arguments)
  var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop

  if (Array.isArray(streams[0])) streams = streams[0]
  if (streams.length < 2) throw new Error('pump requires two streams per minimum')

  var error
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1
    var writing = i > 0
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err
      if (err) destroys.forEach(call)
      if (reading) return
      destroys.forEach(call)
      callback(error)
    })
  })

  return streams.reduce(pipe)
}

module.exports = pump


/***/ }),

/***/ 454:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Stream = _interopDefault(__webpack_require__(413));
var http = _interopDefault(__webpack_require__(605));
var Url = _interopDefault(__webpack_require__(835));
var https = _interopDefault(__webpack_require__(211));
var zlib = _interopDefault(__webpack_require__(761));

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = __webpack_require__(18).convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const resolve_url = Url.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

module.exports = exports = fetch;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports;
exports.Headers = Headers;
exports.Request = Request;
exports.Response = Response;
exports.FetchError = FetchError;


/***/ }),

/***/ 462:
/***/ (function(module) {

"use strict";


// See http://www.robvanderwoude.com/escapechars.php
const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

function escapeCommand(arg) {
    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    return arg;
}

function escapeArgument(arg, doubleEscapeMetaChars) {
    // Convert to string
    arg = `${arg}`;

    // Algorithm below is based on https://qntm.org/cmd

    // Sequence of backslashes followed by a double quote:
    // double up all the backslashes and escape the double quote
    arg = arg.replace(/(\\*)"/g, '$1$1\\"');

    // Sequence of backslashes followed by the end of the string
    // (which will become a double quote later):
    // double up all the backslashes
    arg = arg.replace(/(\\*)$/, '$1$1');

    // All other backslashes occur literally

    // Quote the whole thing:
    arg = `"${arg}"`;

    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    // Double escape meta chars if necessary
    if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, '^$1');
    }

    return arg;
}

module.exports.command = escapeCommand;
module.exports.argument = escapeArgument;


/***/ }),

/***/ 463:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deprecation = __webpack_require__(692);
var once = _interopDefault(__webpack_require__(969));

const logOnce = once(deprecation => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */

class RequestError extends Error {
  constructor(message, statusCode, options) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = "HttpError";
    this.status = statusCode;
    Object.defineProperty(this, "code", {
      get() {
        logOnce(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
        return statusCode;
      }

    });
    this.headers = options.headers || {}; // redact request credentials without mutating original request options

    const requestCopy = Object.assign({}, options.request);

    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
      });
    }

    requestCopy.url = requestCopy.url // client_id & client_secret can be passed as URL query parameters to increase rate limit
    // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
    .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]") // OAuth tokens can be passed as URL query parameters, although it is not recommended
    // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
    .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }

}

exports.RequestError = RequestError;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 469:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Originally pulled from https://github.com/JasonEtco/actions-toolkit/blob/master/src/github.ts
const graphql_1 = __webpack_require__(898);
const rest_1 = __webpack_require__(0);
const Context = __importStar(__webpack_require__(262));
const httpClient = __importStar(__webpack_require__(539));
// We need this in order to extend Octokit
rest_1.Octokit.prototype = new rest_1.Octokit();
exports.context = new Context.Context();
class GitHub extends rest_1.Octokit {
    constructor(token, opts) {
        super(GitHub.getOctokitOptions(GitHub.disambiguate(token, opts)));
        this.graphql = GitHub.getGraphQL(GitHub.disambiguate(token, opts));
    }
    /**
     * Disambiguates the constructor overload parameters
     */
    static disambiguate(token, opts) {
        return [
            typeof token === 'string' ? token : '',
            typeof token === 'object' ? token : opts || {}
        ];
    }
    static getOctokitOptions(args) {
        const token = args[0];
        const options = Object.assign({}, args[1]); // Shallow clone - don't mutate the object provided by the caller
        // Base URL - GHES or Dotcom
        options.baseUrl = options.baseUrl || this.getApiBaseUrl();
        // Auth
        const auth = GitHub.getAuthString(token, options);
        if (auth) {
            options.auth = auth;
        }
        // Proxy
        const agent = GitHub.getProxyAgent(options.baseUrl, options);
        if (agent) {
            // Shallow clone - don't mutate the object provided by the caller
            options.request = options.request ? Object.assign({}, options.request) : {};
            // Set the agent
            options.request.agent = agent;
        }
        return options;
    }
    static getGraphQL(args) {
        const defaults = {};
        defaults.baseUrl = this.getGraphQLBaseUrl();
        const token = args[0];
        const options = args[1];
        // Authorization
        const auth = this.getAuthString(token, options);
        if (auth) {
            defaults.headers = {
                authorization: auth
            };
        }
        // Proxy
        const agent = GitHub.getProxyAgent(defaults.baseUrl, options);
        if (agent) {
            defaults.request = { agent };
        }
        return graphql_1.graphql.defaults(defaults);
    }
    static getAuthString(token, options) {
        // Validate args
        if (!token && !options.auth) {
            throw new Error('Parameter token or opts.auth is required');
        }
        else if (token && options.auth) {
            throw new Error('Parameters token and opts.auth may not both be specified');
        }
        return typeof options.auth === 'string' ? options.auth : `token ${token}`;
    }
    static getProxyAgent(destinationUrl, options) {
        var _a;
        if (!((_a = options.request) === null || _a === void 0 ? void 0 : _a.agent)) {
            if (httpClient.getProxyUrl(destinationUrl)) {
                const hc = new httpClient.HttpClient();
                return hc.getAgent(destinationUrl);
            }
        }
        return undefined;
    }
    static getApiBaseUrl() {
        return process.env['GITHUB_API_URL'] || 'https://api.github.com';
    }
    static getGraphQLBaseUrl() {
        let url = process.env['GITHUB_GRAPHQL_URL'] || 'https://api.github.com/graphql';
        // Shouldn't be a trailing slash, but remove if so
        if (url.endsWith('/')) {
            url = url.substr(0, url.length - 1);
        }
        // Remove trailing "/graphql"
        if (url.toUpperCase().endsWith('/GRAPHQL')) {
            url = url.substr(0, url.length - '/graphql'.length);
        }
        return url;
    }
}
exports.GitHub = GitHub;
//# sourceMappingURL=github.js.map

/***/ }),

/***/ 470:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __webpack_require__(431);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = command_1.toCommandValue(val);
    process.env[name] = convertedVal;
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command_1.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 471:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationBeforeRequest;

const btoa = __webpack_require__(675);
const uniq = __webpack_require__(126);

function authenticationBeforeRequest(state, options) {
  if (!state.auth.type) {
    return;
  }

  if (state.auth.type === "basic") {
    const hash = btoa(`${state.auth.username}:${state.auth.password}`);
    options.headers.authorization = `Basic ${hash}`;
    return;
  }

  if (state.auth.type === "token") {
    options.headers.authorization = `token ${state.auth.token}`;
    return;
  }

  if (state.auth.type === "app") {
    options.headers.authorization = `Bearer ${state.auth.token}`;
    const acceptHeaders = options.headers.accept
      .split(",")
      .concat("application/vnd.github.machine-man-preview+json");
    options.headers.accept = uniq(acceptHeaders)
      .filter(Boolean)
      .join(",");
    return;
  }

  options.url += options.url.indexOf("?") === -1 ? "?" : "&";

  if (state.auth.token) {
    options.url += `access_token=${encodeURIComponent(state.auth.token)}`;
    return;
  }

  const key = encodeURIComponent(state.auth.key);
  const secret = encodeURIComponent(state.auth.secret);
  options.url += `client_id=${key}&client_secret=${secret}`;
}


/***/ }),

/***/ 487:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.Comment = void 0;

var _constants = __webpack_require__(383);

var _Node = __webpack_require__(974);

var _Range = __webpack_require__(994);

class Comment extends _Node.Node {
  constructor() {
    super(_constants.Type.COMMENT);
  }
  /**
   * Parses a comment line from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar
   */


  parse(context, start) {
    this.context = context;
    const offset = this.parseComment(start);
    this.range = new _Range.Range(start, offset);
    return offset;
  }

}

exports.Comment = Comment;

/***/ }),

/***/ 489:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const path = __webpack_require__(622);
const which = __webpack_require__(814);
const pathKey = __webpack_require__(39)();

function resolveCommandAttempt(parsed, withoutPathExt) {
    const cwd = process.cwd();
    const hasCustomCwd = parsed.options.cwd != null;

    // If a custom `cwd` was specified, we need to change the process cwd
    // because `which` will do stat calls but does not support a custom cwd
    if (hasCustomCwd) {
        try {
            process.chdir(parsed.options.cwd);
        } catch (err) {
            /* Empty */
        }
    }

    let resolved;

    try {
        resolved = which.sync(parsed.command, {
            path: (parsed.options.env || process.env)[pathKey],
            pathExt: withoutPathExt ? path.delimiter : undefined,
        });
    } catch (e) {
        /* Empty */
    } finally {
        process.chdir(cwd);
    }

    // If we successfully resolved, ensure that an absolute path is returned
    // Note that when a custom `cwd` was used, we need to resolve to an absolute path based on it
    if (resolved) {
        resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
    }

    return resolved;
}

function resolveCommand(parsed) {
    return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
}

module.exports = resolveCommand;


/***/ }),

/***/ 497:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deprecation = __webpack_require__(692);
var once = _interopDefault(__webpack_require__(969));

const logOnce = once(deprecation => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */

class RequestError extends Error {
  constructor(message, statusCode, options) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = "HttpError";
    this.status = statusCode;
    Object.defineProperty(this, "code", {
      get() {
        logOnce(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
        return statusCode;
      }

    });
    this.headers = options.headers || {}; // redact request credentials without mutating original request options

    const requestCopy = Object.assign({}, options.request);

    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
      });
    }

    requestCopy.url = requestCopy.url // client_id & client_secret can be passed as URL query parameters to increase rate limit
    // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
    .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]") // OAuth tokens can be passed as URL query parameters, although it is not recommended
    // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
    .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }

}

exports.RequestError = RequestError;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 510:
/***/ (function(module) {

module.exports = addHook

function addHook (state, kind, name, hook) {
  var orig = hook
  if (!state.registry[name]) {
    state.registry[name] = []
  }

  if (kind === 'before') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options))
    }
  }

  if (kind === 'after') {
    hook = function (method, options) {
      var result
      return Promise.resolve()
        .then(method.bind(null, options))
        .then(function (result_) {
          result = result_
          return orig(result, options)
        })
        .then(function () {
          return result
        })
    }
  }

  if (kind === 'error') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch(function (error) {
          return orig(error, options)
        })
    }
  }

  state.registry[name].push({
    hook: hook,
    orig: orig
  })
}


/***/ }),

/***/ 514:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.Anchors = void 0;

var _Alias = __webpack_require__(637);

var _Map = __webpack_require__(684);

var _Merge = __webpack_require__(386);

var _Scalar = __webpack_require__(515);

var _Seq = __webpack_require__(29);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Anchors {
  static validAnchorNode(node) {
    return node instanceof _Scalar.Scalar || node instanceof _Seq.YAMLSeq || node instanceof _Map.YAMLMap;
  }

  constructor(prefix) {
    _defineProperty(this, "map", {});

    this.prefix = prefix;
  }

  createAlias(node, name) {
    this.setAnchor(node, name);
    return new _Alias.Alias(node);
  }

  createMergePair(...sources) {
    const merge = new _Merge.Merge();
    merge.value.items = sources.map(s => {
      if (s instanceof _Alias.Alias) {
        if (s.source instanceof _Map.YAMLMap) return s;
      } else if (s instanceof _Map.YAMLMap) {
        return this.createAlias(s);
      }

      throw new Error('Merge sources must be Map nodes or their Aliases');
    });
    return merge;
  }

  getName(node) {
    const {
      map
    } = this;
    return Object.keys(map).find(a => map[a] === node);
  }

  getNode(name) {
    return this.map[name];
  }

  newName(prefix) {
    if (!prefix) prefix = this.prefix;
    const names = Object.keys(this.map);

    for (let i = 1; true; ++i) {
      const name = `${prefix}${i}`;
      if (!names.includes(name)) return name;
    }
  } // During parsing, map & aliases contain CST nodes


  resolveNodes() {
    const {
      map,
      _cstAliases
    } = this;
    Object.keys(map).forEach(a => {
      map[a] = map[a].resolved;
    });

    _cstAliases.forEach(a => {
      a.source = a.source.resolved;
    });

    delete this._cstAliases;
  }

  setAnchor(node, name) {
    if (node != null && !Anchors.validAnchorNode(node)) {
      throw new Error('Anchors may only be set for Scalar, Seq and Map nodes');
    }

    if (name && /[\x00-\x19\s,[\]{}]/.test(name)) {
      throw new Error('Anchor names must not contain whitespace or control characters');
    }

    const {
      map
    } = this;
    const prev = node && Object.keys(map).find(a => map[a] === node);

    if (prev) {
      if (!name) {
        return prev;
      } else if (prev !== name) {
        delete map[prev];
        map[name] = node;
      }
    } else {
      if (!name) {
        if (!node) return null;
        name = this.newName();
      }

      map[name] = node;
    }

    return name;
  }

}

exports.Anchors = Anchors;

/***/ }),

/***/ 515:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.Scalar = void 0;

var _toJSON = __webpack_require__(923);

var _Node = __webpack_require__(156);

// Published as 'yaml/scalar'
class Scalar extends _Node.Node {
  constructor(value) {
    super();
    this.value = value;
  }

  toJSON(arg, ctx) {
    return ctx && ctx.keep ? this.value : (0, _toJSON.toJSON)(this.value, arg, ctx);
  }

  toString() {
    return String(this.value);
  }

}

exports.Scalar = Scalar;

/***/ }),

/***/ 521:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = __webpack_require__(792).YAML


/***/ }),

/***/ 523:
/***/ (function(module, __unusedexports, __webpack_require__) {

var register = __webpack_require__(363)
var addHook = __webpack_require__(510)
var removeHook = __webpack_require__(763)

// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind
var bindable = bind.bind(bind)

function bindApi (hook, state, name) {
  var removeHookRef = bindable(removeHook, null).apply(null, name ? [state, name] : [state])
  hook.api = { remove: removeHookRef }
  hook.remove = removeHookRef

  ;['before', 'error', 'after', 'wrap'].forEach(function (kind) {
    var args = name ? [state, kind, name] : [state, kind]
    hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args)
  })
}

function HookSingular () {
  var singularHookName = 'h'
  var singularHookState = {
    registry: {}
  }
  var singularHook = register.bind(null, singularHookState, singularHookName)
  bindApi(singularHook, singularHookState, singularHookName)
  return singularHook
}

function HookCollection () {
  var state = {
    registry: {}
  }

  var hook = register.bind(null, state)
  bindApi(hook, state)

  return hook
}

var collectionHookDeprecationMessageDisplayed = false
function Hook () {
  if (!collectionHookDeprecationMessageDisplayed) {
    console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4')
    collectionHookDeprecationMessageDisplayed = true
  }
  return HookCollection()
}

Hook.Singular = HookSingular.bind()
Hook.Collection = HookCollection.bind()

module.exports = Hook
// expose constructors as a named property for TypeScript
module.exports.Hook = Hook
module.exports.Singular = Hook.Singular
module.exports.Collection = Hook.Collection


/***/ }),

/***/ 529:
/***/ (function(module, __unusedexports, __webpack_require__) {

const factory = __webpack_require__(47);

module.exports = factory();


/***/ }),

/***/ 531:
/***/ (function(module, __unusedexports, __webpack_require__) {

const core = __webpack_require__(470);
const util = __webpack_require__(669);
const exec = util.promisify(__webpack_require__(129).exec);
const fs = __webpack_require__(747);

const ResultEnum = {
    WRONG_ANSWER: -1,
    CPU_TIME_LIMIT_EXCEEDED: 1,
    REAL_TIME_LIMIT_EXCEEDED: 2,
    MEMORY_LIMIT_EXCEEDED: 3,
    RUNTIME_ERROR: 4,
    SYSTEM_ERROR: 5,
};

class Judger {

    constructor(prob, exe, env){
        this.problem = prob;
        this.executable = exe;
        this.env = env;
    }

    buildExecArgs(exe, inf, ouf, { used_time }) {
        // console.log(this.problem)
        const ret = [];
        ret.push(`--exe_path=${exe}`,
            `--input_path=${inf}`,
            `--output_path=${ouf}`,
            `--error_path=${ouf}`,
            `--max_output_size=${134217728}`,
        );

        if(this.problem.conf.time_limit) {
            let timeLimit = this.problem.conf.time_limit;
            if(this.problem.conf.timing_mode === 'total') {
                timeLimit -= used_time;
            }
            if(timeLimit < 0) timeLimit = 0;
            
            ret.push(`--max_real_time=${timeLimit}`);
        }
        
        if(this.problem.conf.space_limit){
            ret.push(`--max_memory=${this.problem.conf.space_limit * 1048576}`);
        }

        return ret;
    }

    diff(istr, astr){
        [istr,astr] = [istr.trim(),astr.trim()];
        let ln = 1, col = 1;
        for(const i in istr){
            if(i >= astr.length) {
                return 'Unexpected EOF while reading answer.';
            }
            if(istr[i] !== astr[i]) {
                return `Expected ${escape(astr[i])} but found ${escape(istr[i])} at ${ln}:${col}`;
            }
            if(istr[i] === '\n') [ln,col] = [ln+1,1];
            else col++;
        }
        if(istr.length != astr.length) {
            return 'Unexpected EOF while reading output.';
        }

        return null;
    }



    async testCase(i, e, stats) {
        console.log('Using test case:', e);
        
        const info = {
            id: i,
            case: e,
        };

        const outf = `${this.problem.baseDir}/outFile.out`;
        const inf  = `${this.problem.baseDir}/testcase/${e.inFile}`;
        const ansf = `${this.problem.baseDir}/testcase/${e.ansFile}`;
        
        const args = this.buildExecArgs(this.executable, inf, outf, stats);

        let result;
        try {
            const scr = `sudo ${__dirname}/libjudger.so ${args.join(' ')}`;
            result = JSON.parse((await exec(scr)).stdout.trim());
        } catch (e) {
            return {
                ...info,
                result: ResultEnum.SYSTEM_ERROR,
                error_message: e
            };
        }
        
        if(result.result != 0) {
            return {
                ...info,
                result: result.result,
                detail: result,
            };
        }

        const ansC = fs.readFileSync(ansf).toString();
        const outC = fs.readFileSync(outf).toString();
        
        const diffResult = this.diff(ansC, outC);
        
        if(diffResult) {
            result.result = ResultEnum.WRONG_ANSWER;
            return {
                ...info,
                result: ResultEnum.WRONG_ANSWER,
                detail: result,
                error_message: diffResult,
            };
        }

        return {
            ...info,
            result: 0,
            detail: result,
        };
    }

    async testAll() {
        const caseKeys = Object.keys(this.problem.cases);
        caseKeys.sort((a, b) => {
            const ia = parseInt(a.match(/\d+/g).join(''));
            const ib = parseInt(b.match(/\d+/g).join(''));
            return ia - ib;
        });

        let [total, good] = [0, 0];
        let cases = [];
        let stats = {
            used_time: 0
        };
        for(const i of caseKeys) {
            core.startGroup(`Test Case ${i}`);
            
            let ret;
            try {
                ret = await this.testCase(i, this.problem.cases[i], stats);
                if(ret.detail) {
                    stats.used_time += (ret.detail.real_time || 0);
                }
            } catch (e) {
                ret = {
                    id: i,
                    case: this.problem.cases[i],
                    result: ResultEnum.SYSTEM_ERROR,
                    error_message: e,
                };
            }
            
            total++, good += (ret.result == 0);
            cases.push(ret);

            core.endGroup();
        }

        return {
            result: total === good? 'Accepted': 'Unaccepted',
            total: total,
            accepted: good,
            cases,
            env: this.env,
            stats,
        };
    }
}

Judger.ResultEnum = ResultEnum;
module.exports = Judger;

/***/ }),

/***/ 536:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasFirstPage

const deprecate = __webpack_require__(370)
const getPageLinks = __webpack_require__(577)

function hasFirstPage (link) {
  deprecate(`octokit.hasFirstPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).first
}


/***/ }),

/***/ 539:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const url = __webpack_require__(835);
const http = __webpack_require__(605);
const https = __webpack_require__(211);
const pm = __webpack_require__(950);
let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(url.parse(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = url.parse(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error('Client has already been disposed.');
        }
        let parsedUrl = url.parse(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1
            ? this._maxRetries + 1
            : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response &&
                response.message &&
                response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 &&
                this._allowRedirects &&
                redirectsRemaining > 0) {
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = url.parse(redirectUrl);
                if (parsedUrl.protocol == 'https:' &&
                    parsedUrl.protocol != parsedRedirectUrl.protocol &&
                    !this._allowRedirectDowngrade) {
                    throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for (let header in headers) {
                        // header names are case insensitive
                        if (header.toLowerCase() === 'authorization') {
                            delete headers[header];
                        }
                    }
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') {
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = url.parse(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach(handler => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = __webpack_require__(856);
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    proxyAuth: proxyUrl.auth,
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = 'Failed request: (' + statusCode + ')';
                }
                let err = new Error(msg);
                // attach statusCode and body obj (if available) to the error object
                err['statusCode'] = statusCode;
                if (response.result) {
                    err['result'] = response.result;
                }
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;


/***/ }),

/***/ 550:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getNextPage

const getPage = __webpack_require__(265)

function getNextPage (octokit, link, headers) {
  return getPage(octokit, link, 'next', headers)
}


/***/ }),

/***/ 558:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasPreviousPage

const deprecate = __webpack_require__(370)
const getPageLinks = __webpack_require__(577)

function hasPreviousPage (link) {
  deprecate(`octokit.hasPreviousPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).prev
}


/***/ }),

/***/ 563:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getPreviousPage

const getPage = __webpack_require__(265)

function getPreviousPage (octokit, link, headers) {
  return getPage(octokit, link, 'prev', headers)
}


/***/ }),

/***/ 566:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.parsePairs = parsePairs;
exports.createPairs = createPairs;
exports.pairs = void 0;

var _errors = __webpack_require__(405);

var _Map = __webpack_require__(684);

var _Pair = __webpack_require__(325);

var _parseSeq = __webpack_require__(858);

var _Seq = __webpack_require__(29);

function parsePairs(doc, cst) {
  const seq = (0, _parseSeq.parseSeq)(doc, cst);

  for (let i = 0; i < seq.items.length; ++i) {
    let item = seq.items[i];
    if (item instanceof _Pair.Pair) continue;else if (item instanceof _Map.YAMLMap) {
      if (item.items.length > 1) {
        const msg = 'Each pair must have its own sequence indicator';
        throw new _errors.YAMLSemanticError(cst, msg);
      }

      const pair = item.items[0] || new _Pair.Pair();
      if (item.commentBefore) pair.commentBefore = pair.commentBefore ? `${item.commentBefore}\n${pair.commentBefore}` : item.commentBefore;
      if (item.comment) pair.comment = pair.comment ? `${item.comment}\n${pair.comment}` : item.comment;
      item = pair;
    }
    seq.items[i] = item instanceof _Pair.Pair ? item : new _Pair.Pair(item);
  }

  return seq;
}

function createPairs(schema, iterable, ctx) {
  const pairs = new _Seq.YAMLSeq(schema);
  pairs.tag = 'tag:yaml.org,2002:pairs';

  for (const it of iterable) {
    let key, value;

    if (Array.isArray(it)) {
      if (it.length === 2) {
        key = it[0];
        value = it[1];
      } else throw new TypeError(`Expected [key, value] tuple: ${it}`);
    } else if (it && it instanceof Object) {
      const keys = Object.keys(it);

      if (keys.length === 1) {
        key = keys[0];
        value = it[key];
      } else throw new TypeError(`Expected { key: value } tuple: ${it}`);
    } else {
      key = it;
    }

    const pair = schema.createPair(key, value, ctx);
    pairs.items.push(pair);
  }

  return pairs;
}

const pairs = {
  default: false,
  tag: 'tag:yaml.org,2002:pairs',
  resolve: parsePairs,
  createNode: createPairs
};
exports.pairs = pairs;

/***/ }),

/***/ 568:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const path = __webpack_require__(622);
const niceTry = __webpack_require__(948);
const resolveCommand = __webpack_require__(489);
const escape = __webpack_require__(462);
const readShebang = __webpack_require__(389);
const semver = __webpack_require__(280);

const isWin = process.platform === 'win32';
const isExecutableRegExp = /\.(?:com|exe)$/i;
const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

// `options.shell` is supported in Node ^4.8.0, ^5.7.0 and >= 6.0.0
const supportsShellOption = niceTry(() => semver.satisfies(process.version, '^4.8.0 || ^5.7.0 || >= 6.0.0', true)) || false;

function detectShebang(parsed) {
    parsed.file = resolveCommand(parsed);

    const shebang = parsed.file && readShebang(parsed.file);

    if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;

        return resolveCommand(parsed);
    }

    return parsed.file;
}

function parseNonShell(parsed) {
    if (!isWin) {
        return parsed;
    }

    // Detect & add support for shebangs
    const commandFile = detectShebang(parsed);

    // We don't need a shell if the command filename is an executable
    const needsShell = !isExecutableRegExp.test(commandFile);

    // If a shell is required, use cmd.exe and take care of escaping everything correctly
    // Note that `forceShell` is an hidden option used only in tests
    if (parsed.options.forceShell || needsShell) {
        // Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
        // The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
        // Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
        // we need to double escape them
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);

        // Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
        // This is necessary otherwise it will always fail with ENOENT in those cases
        parsed.command = path.normalize(parsed.command);

        // Escape command & arguments
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));

        const shellCommand = [parsed.command].concat(parsed.args).join(' ');

        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.command = process.env.comspec || 'cmd.exe';
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    }

    return parsed;
}

function parseShell(parsed) {
    // If node supports the shell option, there's no need to mimic its behavior
    if (supportsShellOption) {
        return parsed;
    }

    // Mimic node shell option
    // See https://github.com/nodejs/node/blob/b9f6a2dc059a1062776133f3d4fd848c4da7d150/lib/child_process.js#L335
    const shellCommand = [parsed.command].concat(parsed.args).join(' ');

    if (isWin) {
        parsed.command = typeof parsed.options.shell === 'string' ? parsed.options.shell : process.env.comspec || 'cmd.exe';
        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    } else {
        if (typeof parsed.options.shell === 'string') {
            parsed.command = parsed.options.shell;
        } else if (process.platform === 'android') {
            parsed.command = '/system/bin/sh';
        } else {
            parsed.command = '/bin/sh';
        }

        parsed.args = ['-c', shellCommand];
    }

    return parsed;
}

function parse(command, args, options) {
    // Normalize arguments, similar to nodejs
    if (args && !Array.isArray(args)) {
        options = args;
        args = null;
    }

    args = args ? args.slice(0) : []; // Clone array to avoid changing the original
    options = Object.assign({}, options); // Clone object to avoid changing the original

    // Build our parsed object
    const parsed = {
        command,
        args,
        options,
        file: undefined,
        original: {
            command,
            args,
        },
    };

    // Delegate further parsing to shell or non-shell
    return options.shell ? parseShell(parsed) : parseNonShell(parsed);
}

module.exports = parse;


/***/ }),

/***/ 570:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.Document = void 0;

var _addComment = __webpack_require__(836);

var _Anchors = __webpack_require__(514);

var _constants = __webpack_require__(383);

var _errors = __webpack_require__(405);

var _listTagNames = __webpack_require__(880);

var _schema = __webpack_require__(255);

var _Alias = __webpack_require__(637);

var _Collection = __webpack_require__(380);

var _Node = __webpack_require__(156);

var _Scalar = __webpack_require__(515);

var _toJSON = __webpack_require__(923);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const isCollectionItem = node => node && [_constants.Type.MAP_KEY, _constants.Type.MAP_VALUE, _constants.Type.SEQ_ITEM].includes(node.type);

class Document {
  constructor(options) {
    this.anchors = new _Anchors.Anchors(options.anchorPrefix);
    this.commentBefore = null;
    this.comment = null;
    this.contents = null;
    this.directivesEndMarker = null;
    this.errors = [];
    this.options = options;
    this.schema = null;
    this.tagPrefixes = [];
    this.version = null;
    this.warnings = [];
  }

  assertCollectionContents() {
    if (this.contents instanceof _Collection.Collection) return true;
    throw new Error('Expected a YAML collection as document contents');
  }

  add(value) {
    this.assertCollectionContents();
    return this.contents.add(value);
  }

  addIn(path, value) {
    this.assertCollectionContents();
    this.contents.addIn(path, value);
  }

  delete(key) {
    this.assertCollectionContents();
    return this.contents.delete(key);
  }

  deleteIn(path) {
    if ((0, _Collection.isEmptyPath)(path)) {
      if (this.contents == null) return false;
      this.contents = null;
      return true;
    }

    this.assertCollectionContents();
    return this.contents.deleteIn(path);
  }

  getDefaults() {
    return Document.defaults[this.version] || Document.defaults[this.options.version] || {};
  }

  get(key, keepScalar) {
    return this.contents instanceof _Collection.Collection ? this.contents.get(key, keepScalar) : undefined;
  }

  getIn(path, keepScalar) {
    if ((0, _Collection.isEmptyPath)(path)) return !keepScalar && this.contents instanceof _Scalar.Scalar ? this.contents.value : this.contents;
    return this.contents instanceof _Collection.Collection ? this.contents.getIn(path, keepScalar) : undefined;
  }

  has(key) {
    return this.contents instanceof _Collection.Collection ? this.contents.has(key) : false;
  }

  hasIn(path) {
    if ((0, _Collection.isEmptyPath)(path)) return this.contents !== undefined;
    return this.contents instanceof _Collection.Collection ? this.contents.hasIn(path) : false;
  }

  set(key, value) {
    this.assertCollectionContents();
    this.contents.set(key, value);
  }

  setIn(path, value) {
    if ((0, _Collection.isEmptyPath)(path)) this.contents = value;else {
      this.assertCollectionContents();
      this.contents.setIn(path, value);
    }
  }

  setSchema(id, customTags) {
    if (!id && !customTags && this.schema) return;
    if (typeof id === 'number') id = id.toFixed(1);

    if (id === '1.0' || id === '1.1' || id === '1.2') {
      if (this.version) this.version = id;else this.options.version = id;
      delete this.options.schema;
    } else if (id && typeof id === 'string') {
      this.options.schema = id;
    }

    if (Array.isArray(customTags)) this.options.customTags = customTags;
    const opt = Object.assign({}, this.getDefaults(), this.options);
    this.schema = new _schema.Schema(opt);
  }

  parse(node, prevDoc) {
    if (this.options.keepCstNodes) this.cstNode = node;
    if (this.options.keepNodeTypes) this.type = 'DOCUMENT';
    const {
      directives = [],
      contents = [],
      directivesEndMarker,
      error,
      valueRange
    } = node;

    if (error) {
      if (!error.source) error.source = this;
      this.errors.push(error);
    }

    this.parseDirectives(directives, prevDoc);
    if (directivesEndMarker) this.directivesEndMarker = true;
    this.range = valueRange ? [valueRange.start, valueRange.end] : null;
    this.setSchema();
    this.anchors._cstAliases = [];
    this.parseContents(contents);
    this.anchors.resolveNodes();

    if (this.options.prettyErrors) {
      for (const error of this.errors) if (error instanceof _errors.YAMLError) error.makePretty();

      for (const warn of this.warnings) if (warn instanceof _errors.YAMLError) warn.makePretty();
    }

    return this;
  }

  parseDirectives(directives, prevDoc) {
    const directiveComments = [];
    let hasDirectives = false;
    directives.forEach(directive => {
      const {
        comment,
        name
      } = directive;

      switch (name) {
        case 'TAG':
          this.resolveTagDirective(directive);
          hasDirectives = true;
          break;

        case 'YAML':
        case 'YAML:1.0':
          this.resolveYamlDirective(directive);
          hasDirectives = true;
          break;

        default:
          if (name) {
            const msg = `YAML only supports %TAG and %YAML directives, and not %${name}`;
            this.warnings.push(new _errors.YAMLWarning(directive, msg));
          }

      }

      if (comment) directiveComments.push(comment);
    });

    if (prevDoc && !hasDirectives && '1.1' === (this.version || prevDoc.version || this.options.version)) {
      const copyTagPrefix = ({
        handle,
        prefix
      }) => ({
        handle,
        prefix
      });

      this.tagPrefixes = prevDoc.tagPrefixes.map(copyTagPrefix);
      this.version = prevDoc.version;
    }

    this.commentBefore = directiveComments.join('\n') || null;
  }

  parseContents(contents) {
    const comments = {
      before: [],
      after: []
    };
    const contentNodes = [];
    let spaceBefore = false;
    contents.forEach(node => {
      if (node.valueRange) {
        if (contentNodes.length === 1) {
          const msg = 'Document is not valid YAML (bad indentation?)';
          this.errors.push(new _errors.YAMLSyntaxError(node, msg));
        }

        const res = this.resolveNode(node);

        if (spaceBefore) {
          res.spaceBefore = true;
          spaceBefore = false;
        }

        contentNodes.push(res);
      } else if (node.comment !== null) {
        const cc = contentNodes.length === 0 ? comments.before : comments.after;
        cc.push(node.comment);
      } else if (node.type === _constants.Type.BLANK_LINE) {
        spaceBefore = true;

        if (contentNodes.length === 0 && comments.before.length > 0 && !this.commentBefore) {
          // space-separated comments at start are parsed as document comments
          this.commentBefore = comments.before.join('\n');
          comments.before = [];
        }
      }
    });

    switch (contentNodes.length) {
      case 0:
        this.contents = null;
        comments.after = comments.before;
        break;

      case 1:
        this.contents = contentNodes[0];

        if (this.contents) {
          const cb = comments.before.join('\n') || null;

          if (cb) {
            const cbNode = this.contents instanceof _Collection.Collection && this.contents.items[0] ? this.contents.items[0] : this.contents;
            cbNode.commentBefore = cbNode.commentBefore ? `${cb}\n${cbNode.commentBefore}` : cb;
          }
        } else {
          comments.after = comments.before.concat(comments.after);
        }

        break;

      default:
        this.contents = contentNodes;

        if (this.contents[0]) {
          this.contents[0].commentBefore = comments.before.join('\n') || null;
        } else {
          comments.after = comments.before.concat(comments.after);
        }

    }

    this.comment = comments.after.join('\n') || null;
  }

  resolveTagDirective(directive) {
    const [handle, prefix] = directive.parameters;

    if (handle && prefix) {
      if (this.tagPrefixes.every(p => p.handle !== handle)) {
        this.tagPrefixes.push({
          handle,
          prefix
        });
      } else {
        const msg = 'The %TAG directive must only be given at most once per handle in the same document.';
        this.errors.push(new _errors.YAMLSemanticError(directive, msg));
      }
    } else {
      const msg = 'Insufficient parameters given for %TAG directive';
      this.errors.push(new _errors.YAMLSemanticError(directive, msg));
    }
  }

  resolveYamlDirective(directive) {
    let [version] = directive.parameters;
    if (directive.name === 'YAML:1.0') version = '1.0';

    if (this.version) {
      const msg = 'The %YAML directive must only be given at most once per document.';
      this.errors.push(new _errors.YAMLSemanticError(directive, msg));
    }

    if (!version) {
      const msg = 'Insufficient parameters given for %YAML directive';
      this.errors.push(new _errors.YAMLSemanticError(directive, msg));
    } else {
      if (!Document.defaults[version]) {
        const v0 = this.version || this.options.version;
        const msg = `Document will be parsed as YAML ${v0} rather than YAML ${version}`;
        this.warnings.push(new _errors.YAMLWarning(directive, msg));
      }

      this.version = version;
    }
  }

  resolveTagName(node) {
    const {
      tag,
      type
    } = node;
    let nonSpecific = false;

    if (tag) {
      const {
        handle,
        suffix,
        verbatim
      } = tag;

      if (verbatim) {
        if (verbatim !== '!' && verbatim !== '!!') return verbatim;
        const msg = `Verbatim tags aren't resolved, so ${verbatim} is invalid.`;
        this.errors.push(new _errors.YAMLSemanticError(node, msg));
      } else if (handle === '!' && !suffix) {
        nonSpecific = true;
      } else {
        let prefix = this.tagPrefixes.find(p => p.handle === handle);

        if (!prefix) {
          const dtp = this.getDefaults().tagPrefixes;
          if (dtp) prefix = dtp.find(p => p.handle === handle);
        }

        if (prefix) {
          if (suffix) {
            if (handle === '!' && (this.version || this.options.version) === '1.0') {
              if (suffix[0] === '^') return suffix;

              if (/[:/]/.test(suffix)) {
                // word/foo -> tag:word.yaml.org,2002:foo
                const vocab = suffix.match(/^([a-z0-9-]+)\/(.*)/i);
                return vocab ? `tag:${vocab[1]}.yaml.org,2002:${vocab[2]}` : `tag:${suffix}`;
              }
            }

            return prefix.prefix + decodeURIComponent(suffix);
          }

          this.errors.push(new _errors.YAMLSemanticError(node, `The ${handle} tag has no suffix.`));
        } else {
          const msg = `The ${handle} tag handle is non-default and was not declared.`;
          this.errors.push(new _errors.YAMLSemanticError(node, msg));
        }
      }
    }

    switch (type) {
      case _constants.Type.BLOCK_FOLDED:
      case _constants.Type.BLOCK_LITERAL:
      case _constants.Type.QUOTE_DOUBLE:
      case _constants.Type.QUOTE_SINGLE:
        return _schema.Schema.defaultTags.STR;

      case _constants.Type.FLOW_MAP:
      case _constants.Type.MAP:
        return _schema.Schema.defaultTags.MAP;

      case _constants.Type.FLOW_SEQ:
      case _constants.Type.SEQ:
        return _schema.Schema.defaultTags.SEQ;

      case _constants.Type.PLAIN:
        return nonSpecific ? _schema.Schema.defaultTags.STR : null;

      default:
        return null;
    }
  }

  resolveNode(node) {
    if (!node) return null;
    const {
      anchors,
      errors,
      schema
    } = this;
    let hasAnchor = false;
    let hasTag = false;
    const comments = {
      before: [],
      after: []
    };
    const props = isCollectionItem(node.context.parent) ? node.context.parent.props.concat(node.props) : node.props;

    for (const {
      start,
      end
    } of props) {
      switch (node.context.src[start]) {
        case _constants.Char.COMMENT:
          {
            if (!node.commentHasRequiredWhitespace(start)) {
              const msg = 'Comments must be separated from other tokens by white space characters';
              errors.push(new _errors.YAMLSemanticError(node, msg));
            }

            const c = node.context.src.slice(start + 1, end);
            const {
              header,
              valueRange
            } = node;

            if (valueRange && (start > valueRange.start || header && start > header.start)) {
              comments.after.push(c);
            } else {
              comments.before.push(c);
            }
          }
          break;

        case _constants.Char.ANCHOR:
          if (hasAnchor) {
            const msg = 'A node can have at most one anchor';
            errors.push(new _errors.YAMLSemanticError(node, msg));
          }

          hasAnchor = true;
          break;

        case _constants.Char.TAG:
          if (hasTag) {
            const msg = 'A node can have at most one tag';
            errors.push(new _errors.YAMLSemanticError(node, msg));
          }

          hasTag = true;
          break;
      }
    }

    if (hasAnchor) {
      const name = node.anchor;
      const prev = anchors.getNode(name); // At this point, aliases for any preceding node with the same anchor
      // name have already been resolved, so it may safely be renamed.

      if (prev) anchors.map[anchors.newName(name)] = prev; // During parsing, we need to store the CST node in anchors.map as
      // anchors need to be available during resolution to allow for
      // circular references.

      anchors.map[name] = node;
    }

    let res;

    if (node.type === _constants.Type.ALIAS) {
      if (hasAnchor || hasTag) {
        const msg = 'An alias node must not specify any properties';
        errors.push(new _errors.YAMLSemanticError(node, msg));
      }

      const name = node.rawValue;
      const src = anchors.getNode(name);

      if (!src) {
        const msg = `Aliased anchor not found: ${name}`;
        errors.push(new _errors.YAMLReferenceError(node, msg));
        return null;
      } // Lazy resolution for circular references


      res = new _Alias.Alias(src);

      anchors._cstAliases.push(res);
    } else {
      const tagName = this.resolveTagName(node);

      if (tagName) {
        res = schema.resolveNodeWithFallback(this, node, tagName);
      } else {
        if (node.type !== _constants.Type.PLAIN) {
          const msg = `Failed to resolve ${node.type} node here`;
          errors.push(new _errors.YAMLSyntaxError(node, msg));
          return null;
        }

        try {
          res = schema.resolveScalar(node.strValue || '');
        } catch (error) {
          if (!error.source) error.source = node;
          errors.push(error);
          return null;
        }
      }
    }

    if (res) {
      res.range = [node.range.start, node.range.end];
      if (this.options.keepCstNodes) res.cstNode = node;
      if (this.options.keepNodeTypes) res.type = node.type;
      const cb = comments.before.join('\n');

      if (cb) {
        res.commentBefore = res.commentBefore ? `${res.commentBefore}\n${cb}` : cb;
      }

      const ca = comments.after.join('\n');
      if (ca) res.comment = res.comment ? `${res.comment}\n${ca}` : ca;
    }

    return node.resolved = res;
  }

  listNonDefaultTags() {
    return (0, _listTagNames.listTagNames)(this.contents).filter(t => t.indexOf(_schema.Schema.defaultPrefix) !== 0);
  }

  setTagPrefix(handle, prefix) {
    if (handle[0] !== '!' || handle[handle.length - 1] !== '!') throw new Error('Handle must start and end with !');

    if (prefix) {
      const prev = this.tagPrefixes.find(p => p.handle === handle);
      if (prev) prev.prefix = prefix;else this.tagPrefixes.push({
        handle,
        prefix
      });
    } else {
      this.tagPrefixes = this.tagPrefixes.filter(p => p.handle !== handle);
    }
  }

  stringifyTag(tag) {
    if ((this.version || this.options.version) === '1.0') {
      const priv = tag.match(/^tag:private\.yaml\.org,2002:([^:/]+)$/);
      if (priv) return '!' + priv[1];
      const vocab = tag.match(/^tag:([a-zA-Z0-9-]+)\.yaml\.org,2002:(.*)/);
      return vocab ? `!${vocab[1]}/${vocab[2]}` : `!${tag.replace(/^tag:/, '')}`;
    } else {
      let p = this.tagPrefixes.find(p => tag.indexOf(p.prefix) === 0);

      if (!p) {
        const dtp = this.getDefaults().tagPrefixes;
        p = dtp && dtp.find(p => tag.indexOf(p.prefix) === 0);
      }

      if (!p) return tag[0] === '!' ? tag : `!<${tag}>`;
      const suffix = tag.substr(p.prefix.length).replace(/[!,[\]{}]/g, ch => ({
        '!': '%21',
        ',': '%2C',
        '[': '%5B',
        ']': '%5D',
        '{': '%7B',
        '}': '%7D'
      })[ch]);
      return p.handle + suffix;
    }
  }

  toJSON(arg, onAnchor) {
    const {
      keepBlobsInJSON,
      mapAsMap,
      maxAliasCount
    } = this.options;
    const keep = keepBlobsInJSON && (typeof arg !== 'string' || !(this.contents instanceof _Scalar.Scalar));
    const ctx = {
      doc: this,
      indentStep: '  ',
      keep,
      mapAsMap: keep && !!mapAsMap,
      maxAliasCount
    };
    const anchorNames = Object.keys(this.anchors.map);
    if (anchorNames.length > 0) ctx.anchors = new Map(anchorNames.map(name => [this.anchors.map[name], {
      alias: [],
      aliasCount: 0,
      count: 1
    }]));
    const res = (0, _toJSON.toJSON)(this.contents, arg, ctx);
    if (typeof onAnchor === 'function' && ctx.anchors) for (const {
      count,
      res
    } of ctx.anchors.values()) onAnchor(res, count);
    return res;
  }

  toString() {
    if (this.errors.length > 0) throw new Error('Document with errors cannot be stringified');
    const indentSize = this.options.indent;

    if (!Number.isInteger(indentSize) || indentSize <= 0) {
      const s = JSON.stringify(indentSize);
      throw new Error(`"indent" option must be a positive integer, not ${s}`);
    }

    this.setSchema();
    const lines = [];
    let hasDirectives = false;

    if (this.version) {
      let vd = '%YAML 1.2';

      if (this.schema.name === 'yaml-1.1') {
        if (this.version === '1.0') vd = '%YAML:1.0';else if (this.version === '1.1') vd = '%YAML 1.1';
      }

      lines.push(vd);
      hasDirectives = true;
    }

    const tagNames = this.listNonDefaultTags();
    this.tagPrefixes.forEach(({
      handle,
      prefix
    }) => {
      if (tagNames.some(t => t.indexOf(prefix) === 0)) {
        lines.push(`%TAG ${handle} ${prefix}`);
        hasDirectives = true;
      }
    });
    if (hasDirectives || this.directivesEndMarker) lines.push('---');

    if (this.commentBefore) {
      if (hasDirectives || !this.directivesEndMarker) lines.unshift('');
      lines.unshift(this.commentBefore.replace(/^/gm, '#'));
    }

    const ctx = {
      anchors: {},
      doc: this,
      indent: '',
      indentStep: ' '.repeat(indentSize)
    };
    let chompKeep = false;
    let contentComment = null;

    if (this.contents) {
      if (this.contents instanceof _Node.Node) {
        if (this.contents.spaceBefore && (hasDirectives || this.directivesEndMarker)) lines.push('');
        if (this.contents.commentBefore) lines.push(this.contents.commentBefore.replace(/^/gm, '#')); // top-level block scalars need to be indented if followed by a comment

        ctx.forceBlockIndent = !!this.comment;
        contentComment = this.contents.comment;
      }

      const onChompKeep = contentComment ? null : () => chompKeep = true;
      const body = this.schema.stringify(this.contents, ctx, () => contentComment = null, onChompKeep);
      lines.push((0, _addComment.addComment)(body, '', contentComment));
    } else if (this.contents !== undefined) {
      lines.push(this.schema.stringify(this.contents, ctx));
    }

    if (this.comment) {
      if ((!chompKeep || contentComment) && lines[lines.length - 1] !== '') lines.push('');
      lines.push(this.comment.replace(/^/gm, '#'));
    }

    return lines.join('\n') + '\n';
  }

}

exports.Document = Document;

_defineProperty(Document, "defaults", {
  '1.0': {
    schema: 'yaml-1.1',
    merge: true,
    tagPrefixes: [{
      handle: '!',
      prefix: _schema.Schema.defaultPrefix
    }, {
      handle: '!!',
      prefix: 'tag:private.yaml.org,2002:'
    }]
  },
  '1.1': {
    schema: 'yaml-1.1',
    merge: true,
    tagPrefixes: [{
      handle: '!',
      prefix: '!'
    }, {
      handle: '!!',
      prefix: _schema.Schema.defaultPrefix
    }]
  },
  '1.2': {
    schema: 'core',
    merge: false,
    tagPrefixes: [{
      handle: '!',
      prefix: '!'
    }, {
      handle: '!!',
      prefix: _schema.Schema.defaultPrefix
    }]
  }
});

/***/ }),

/***/ 577:
/***/ (function(module) {

module.exports = getPageLinks

function getPageLinks (link) {
  link = link.link || link.headers.link || ''

  const links = {}

  // link format:
  // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
  link.replace(/<([^>]*)>;\s*rel="([\w]*)"/g, (m, uri, type) => {
    links[type] = uri
  })

  return links
}


/***/ }),

/***/ 591:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.string = exports.resolveString = void 0;

var _stringify = __webpack_require__(315);

var _options = __webpack_require__(422);

const resolveString = (doc, node) => {
  // on error, will return { str: string, errors: Error[] }
  const res = node.strValue;
  if (!res) return '';
  if (typeof res === 'string') return res;
  res.errors.forEach(error => {
    if (!error.source) error.source = node;
    doc.errors.push(error);
  });
  return res.str;
};

exports.resolveString = resolveString;
const string = {
  identify: value => typeof value === 'string',
  default: true,
  tag: 'tag:yaml.org,2002:str',
  resolve: resolveString,

  stringify(item, ctx, onComment, onChompKeep) {
    ctx = Object.assign({
      actualString: true
    }, ctx);
    return (0, _stringify.stringifyString)(item, ctx, onComment, onChompKeep);
  },

  options: _options.strOptions
};
exports.string = string;

/***/ }),

/***/ 605:
/***/ (function(module) {

module.exports = require("http");

/***/ }),

/***/ 614:
/***/ (function(module) {

module.exports = require("events");

/***/ }),

/***/ 619:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var osName = _interopDefault(__webpack_require__(2));

function getUserAgent() {
  try {
    return `Node.js/${process.version.substr(1)} (${osName()}; ${process.arch})`;
  } catch (error) {
    if (/wmic os get Caption/.test(error.message)) {
      return "Windows <version undetectable>";
    }

    throw error;
  }
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 621:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const path = __webpack_require__(622);
const pathKey = __webpack_require__(39);

module.exports = opts => {
	opts = Object.assign({
		cwd: process.cwd(),
		path: process.env[pathKey()]
	}, opts);

	let prev;
	let pth = path.resolve(opts.cwd);
	const ret = [];

	while (prev !== pth) {
		ret.push(path.join(pth, 'node_modules/.bin'));
		prev = pth;
		pth = path.resolve(pth, '..');
	}

	// ensure the running `node` binary is used
	ret.push(path.dirname(process.execPath));

	return ret.concat(opts.path).join(path.delimiter);
};

module.exports.env = opts => {
	opts = Object.assign({
		env: process.env
	}, opts);

	const env = Object.assign({}, opts.env);
	const path = pathKey({env});

	opts.path = env[path];
	env[path] = module.exports(opts);

	return env;
};


/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 625:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.parseMap = parseMap;

var _constants = __webpack_require__(383);

var _PlainValue = __webpack_require__(119);

var _errors = __webpack_require__(405);

var _Map = __webpack_require__(684);

var _Merge = __webpack_require__(386);

var _Pair = __webpack_require__(325);

var _parseUtils = __webpack_require__(734);

var _Alias = __webpack_require__(637);

var _Collection = __webpack_require__(380);

function parseMap(doc, cst) {
  if (cst.type !== _constants.Type.MAP && cst.type !== _constants.Type.FLOW_MAP) {
    const msg = `A ${cst.type} node cannot be resolved as a mapping`;
    doc.errors.push(new _errors.YAMLSyntaxError(cst, msg));
    return null;
  }

  const {
    comments,
    items
  } = cst.type === _constants.Type.FLOW_MAP ? resolveFlowMapItems(doc, cst) : resolveBlockMapItems(doc, cst);
  const map = new _Map.YAMLMap();
  map.items = items;
  (0, _parseUtils.resolveComments)(map, comments);
  let hasCollectionKey = false;

  for (let i = 0; i < items.length; ++i) {
    const {
      key: iKey
    } = items[i];
    if (iKey instanceof _Collection.Collection) hasCollectionKey = true;

    if (doc.schema.merge && iKey && iKey.value === _Merge.MERGE_KEY) {
      items[i] = new _Merge.Merge(items[i]);
      const sources = items[i].value.items;
      let error = null;
      sources.some(node => {
        if (node instanceof _Alias.Alias) {
          // During parsing, alias sources are CST nodes; to account for
          // circular references their resolved values can't be used here.
          const {
            type
          } = node.source;
          if (type === _constants.Type.MAP || type === _constants.Type.FLOW_MAP) return false;
          return error = 'Merge nodes aliases can only point to maps';
        }

        return error = 'Merge nodes can only have Alias nodes as values';
      });
      if (error) doc.errors.push(new _errors.YAMLSemanticError(cst, error));
    } else {
      for (let j = i + 1; j < items.length; ++j) {
        const {
          key: jKey
        } = items[j];

        if (iKey === jKey || iKey && jKey && Object.prototype.hasOwnProperty.call(iKey, 'value') && iKey.value === jKey.value) {
          const msg = `Map keys must be unique; "${iKey}" is repeated`;
          doc.errors.push(new _errors.YAMLSemanticError(cst, msg));
          break;
        }
      }
    }
  }

  if (hasCollectionKey && !doc.options.mapAsMap) {
    const warn = 'Keys with collection values will be stringified as YAML due to JS Object restrictions. Use mapAsMap: true to avoid this.';
    doc.warnings.push(new _errors.YAMLWarning(cst, warn));
  }

  cst.resolved = map;
  return map;
}

const valueHasPairComment = ({
  context: {
    lineStart,
    node,
    src
  },
  props
}) => {
  if (props.length === 0) return false;
  const {
    start
  } = props[0];
  if (node && start > node.valueRange.start) return false;
  if (src[start] !== _constants.Char.COMMENT) return false;

  for (let i = lineStart; i < start; ++i) if (src[i] === '\n') return false;

  return true;
};

function resolvePairComment(item, pair) {
  if (!valueHasPairComment(item)) return;
  const comment = item.getPropValue(0, _constants.Char.COMMENT, true);
  let found = false;
  const cb = pair.value.commentBefore;

  if (cb && cb.startsWith(comment)) {
    pair.value.commentBefore = cb.substr(comment.length + 1);
    found = true;
  } else {
    const cc = pair.value.comment;

    if (!item.node && cc && cc.startsWith(comment)) {
      pair.value.comment = cc.substr(comment.length + 1);
      found = true;
    }
  }

  if (found) pair.comment = comment;
}

function resolveBlockMapItems(doc, cst) {
  const comments = [];
  const items = [];
  let key = undefined;
  let keyStart = null;

  for (let i = 0; i < cst.items.length; ++i) {
    const item = cst.items[i];

    switch (item.type) {
      case _constants.Type.BLANK_LINE:
        comments.push({
          afterKey: !!key,
          before: items.length
        });
        break;

      case _constants.Type.COMMENT:
        comments.push({
          afterKey: !!key,
          before: items.length,
          comment: item.comment
        });
        break;

      case _constants.Type.MAP_KEY:
        if (key !== undefined) items.push(new _Pair.Pair(key));
        if (item.error) doc.errors.push(item.error);
        key = doc.resolveNode(item.node);
        keyStart = null;
        break;

      case _constants.Type.MAP_VALUE:
        {
          if (key === undefined) key = null;
          if (item.error) doc.errors.push(item.error);

          if (!item.context.atLineStart && item.node && item.node.type === _constants.Type.MAP && !item.node.context.atLineStart) {
            const msg = 'Nested mappings are not allowed in compact mappings';
            doc.errors.push(new _errors.YAMLSemanticError(item.node, msg));
          }

          let valueNode = item.node;

          if (!valueNode && item.props.length > 0) {
            // Comments on an empty mapping value need to be preserved, so we
            // need to construct a minimal empty node here to use instead of the
            // missing `item.node`. -- eemeli/yaml#19
            valueNode = new _PlainValue.PlainValue(_constants.Type.PLAIN, []);
            valueNode.context = {
              parent: item,
              src: item.context.src
            };
            const pos = item.range.start + 1;
            valueNode.range = {
              start: pos,
              end: pos
            };
            valueNode.valueRange = {
              start: pos,
              end: pos
            };

            if (typeof item.range.origStart === 'number') {
              const origPos = item.range.origStart + 1;
              valueNode.range.origStart = valueNode.range.origEnd = origPos;
              valueNode.valueRange.origStart = valueNode.valueRange.origEnd = origPos;
            }
          }

          const pair = new _Pair.Pair(key, doc.resolveNode(valueNode));
          resolvePairComment(item, pair);
          items.push(pair);
          (0, _parseUtils.checkKeyLength)(doc.errors, cst, i, key, keyStart);
          key = undefined;
          keyStart = null;
        }
        break;

      default:
        if (key !== undefined) items.push(new _Pair.Pair(key));
        key = doc.resolveNode(item);
        keyStart = item.range.start;
        if (item.error) doc.errors.push(item.error);

        next: for (let j = i + 1;; ++j) {
          const nextItem = cst.items[j];

          switch (nextItem && nextItem.type) {
            case _constants.Type.BLANK_LINE:
            case _constants.Type.COMMENT:
              continue next;

            case _constants.Type.MAP_VALUE:
              break next;

            default:
              doc.errors.push(new _errors.YAMLSemanticError(item, 'Implicit map keys need to be followed by map values'));
              break next;
          }
        }

        if (item.valueRangeContainsNewline) {
          const msg = 'Implicit map keys need to be on a single line';
          doc.errors.push(new _errors.YAMLSemanticError(item, msg));
        }

    }
  }

  if (key !== undefined) items.push(new _Pair.Pair(key));
  return {
    comments,
    items
  };
}

function resolveFlowMapItems(doc, cst) {
  const comments = [];
  const items = [];
  let key = undefined;
  let keyStart = null;
  let explicitKey = false;
  let next = '{';

  for (let i = 0; i < cst.items.length; ++i) {
    (0, _parseUtils.checkKeyLength)(doc.errors, cst, i, key, keyStart);
    const item = cst.items[i];

    if (typeof item.char === 'string') {
      const {
        char,
        offset
      } = item;

      if (char === '?' && key === undefined && !explicitKey) {
        explicitKey = true;
        next = ':';
        continue;
      }

      if (char === ':') {
        if (key === undefined) key = null;

        if (next === ':') {
          next = ',';
          continue;
        }
      } else {
        if (explicitKey) {
          if (key === undefined && char !== ',') key = null;
          explicitKey = false;
        }

        if (key !== undefined) {
          items.push(new _Pair.Pair(key));
          key = undefined;
          keyStart = null;

          if (char === ',') {
            next = ':';
            continue;
          }
        }
      }

      if (char === '}') {
        if (i === cst.items.length - 1) continue;
      } else if (char === next) {
        next = ':';
        continue;
      }

      const msg = `Flow map contains an unexpected ${char}`;
      const err = new _errors.YAMLSyntaxError(cst, msg);
      err.offset = offset;
      doc.errors.push(err);
    } else if (item.type === _constants.Type.BLANK_LINE) {
      comments.push({
        afterKey: !!key,
        before: items.length
      });
    } else if (item.type === _constants.Type.COMMENT) {
      comments.push({
        afterKey: !!key,
        before: items.length,
        comment: item.comment
      });
    } else if (key === undefined) {
      if (next === ',') doc.errors.push(new _errors.YAMLSemanticError(item, 'Separator , missing in flow map'));
      key = doc.resolveNode(item);
      keyStart = explicitKey ? null : item.range.start; // TODO: add error for non-explicit multiline plain key
    } else {
      if (next !== ',') doc.errors.push(new _errors.YAMLSemanticError(item, 'Indicator : missing in flow map entry'));
      items.push(new _Pair.Pair(key, doc.resolveNode(item)));
      key = undefined;
      explicitKey = false;
    }
  }

  (0, _parseUtils.checkFlowCollectionEnd)(doc.errors, cst);
  if (key !== undefined) items.push(new _Pair.Pair(key));
  return {
    comments,
    items
  };
}

/***/ }),

/***/ 631:
/***/ (function(module) {

module.exports = require("net");

/***/ }),

/***/ 637:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.Alias = void 0;

var _constants = __webpack_require__(383);

var _errors = __webpack_require__(405);

var _toJSON = __webpack_require__(923);

var _Collection = __webpack_require__(380);

var _Node = __webpack_require__(156);

var _Pair = __webpack_require__(325);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const getAliasCount = (node, anchors) => {
  if (node instanceof Alias) {
    const anchor = anchors.get(node.source);
    return anchor.count * anchor.aliasCount;
  } else if (node instanceof _Collection.Collection) {
    let count = 0;

    for (const item of node.items) {
      const c = getAliasCount(item, anchors);
      if (c > count) count = c;
    }

    return count;
  } else if (node instanceof _Pair.Pair) {
    const kc = getAliasCount(node.key, anchors);
    const vc = getAliasCount(node.value, anchors);
    return Math.max(kc, vc);
  }

  return 1;
};

class Alias extends _Node.Node {
  static stringify({
    range,
    source
  }, {
    anchors,
    doc,
    implicitKey,
    inStringifyKey
  }) {
    let anchor = Object.keys(anchors).find(a => anchors[a] === source);
    if (!anchor && inStringifyKey) anchor = doc.anchors.getName(source) || doc.anchors.newName();
    if (anchor) return `*${anchor}${implicitKey ? ' ' : ''}`;
    const msg = doc.anchors.getName(source) ? 'Alias node must be after source node' : 'Source node not found for alias node';
    throw new Error(`${msg} [${range}]`);
  }

  constructor(source) {
    super();
    this.source = source;
    this.type = _constants.Type.ALIAS;
  }

  set tag(t) {
    throw new Error('Alias nodes cannot have tags');
  }

  toJSON(arg, ctx) {
    if (!ctx) return (0, _toJSON.toJSON)(this.source, arg, ctx);
    const {
      anchors,
      maxAliasCount
    } = ctx;
    const anchor = anchors.get(this.source);
    /* istanbul ignore if */

    if (!anchor || anchor.res === undefined) {
      const msg = 'This should not happen: Alias anchor was not resolved?';
      if (this.cstNode) throw new _errors.YAMLReferenceError(this.cstNode, msg);else throw new ReferenceError(msg);
    }

    if (maxAliasCount >= 0) {
      anchor.count += 1;
      if (anchor.aliasCount === 0) anchor.aliasCount = getAliasCount(this.source, anchors);

      if (anchor.count * anchor.aliasCount > maxAliasCount) {
        const msg = 'Excessive alias count indicates a resource exhaustion attack';
        if (this.cstNode) throw new _errors.YAMLReferenceError(this.cstNode, msg);else throw new ReferenceError(msg);
      }
    }

    return anchor.res;
  } // Only called when stringifying an alias mapping key while constructing
  // Object output.


  toString(ctx) {
    return Alias.stringify(this, ctx);
  }

}

exports.Alias = Alias;

_defineProperty(Alias, "default", true);

/***/ }),

/***/ 641:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.grabCollectionEndComments = grabCollectionEndComments;
exports.Collection = void 0;

var _constants = __webpack_require__(383);

var _BlankLine = __webpack_require__(794);

var _CollectionItem = __webpack_require__(906);

var _Comment = __webpack_require__(487);

var _Node = __webpack_require__(974);

var _Range = __webpack_require__(994);

function grabCollectionEndComments(node) {
  let cnode = node;

  while (cnode instanceof _CollectionItem.CollectionItem) cnode = cnode.node;

  if (!(cnode instanceof Collection)) return null;
  const len = cnode.items.length;
  let ci = -1;

  for (let i = len - 1; i >= 0; --i) {
    const n = cnode.items[i];

    if (n.type === _constants.Type.COMMENT) {
      // Keep sufficiently indented comments with preceding node
      const {
        indent,
        lineStart
      } = n.context;
      if (indent > 0 && n.range.start >= lineStart + indent) break;
      ci = i;
    } else if (n.type === _constants.Type.BLANK_LINE) ci = i;else break;
  }

  if (ci === -1) return null;
  const ca = cnode.items.splice(ci, len - ci);
  const prevEnd = ca[0].range.start;

  while (true) {
    cnode.range.end = prevEnd;
    if (cnode.valueRange && cnode.valueRange.end > prevEnd) cnode.valueRange.end = prevEnd;
    if (cnode === node) break;
    cnode = cnode.context.parent;
  }

  return ca;
}

class Collection extends _Node.Node {
  static nextContentHasIndent(src, offset, indent) {
    const lineStart = _Node.Node.endOfLine(src, offset) + 1;
    offset = _Node.Node.endOfWhiteSpace(src, lineStart);
    const ch = src[offset];
    if (!ch) return false;
    if (offset >= lineStart + indent) return true;
    if (ch !== '#' && ch !== '\n') return false;
    return Collection.nextContentHasIndent(src, offset, indent);
  }

  constructor(firstItem) {
    super(firstItem.type === _constants.Type.SEQ_ITEM ? _constants.Type.SEQ : _constants.Type.MAP);

    for (let i = firstItem.props.length - 1; i >= 0; --i) {
      if (firstItem.props[i].start < firstItem.context.lineStart) {
        // props on previous line are assumed by the collection
        this.props = firstItem.props.slice(0, i + 1);
        firstItem.props = firstItem.props.slice(i + 1);
        const itemRange = firstItem.props[0] || firstItem.valueRange;
        firstItem.range.start = itemRange.start;
        break;
      }
    }

    this.items = [firstItem];
    const ec = grabCollectionEndComments(firstItem);
    if (ec) Array.prototype.push.apply(this.items, ec);
  }

  get includesTrailingLines() {
    return this.items.length > 0;
  }
  /**
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this
   */


  parse(context, start) {
    this.context = context;
    const {
      parseNode,
      src
    } = context; // It's easier to recalculate lineStart here rather than tracking down the
    // last context from which to read it -- eemeli/yaml#2

    let lineStart = _Node.Node.startOfLine(src, start);

    const firstItem = this.items[0]; // First-item context needs to be correct for later comment handling
    // -- eemeli/yaml#17

    firstItem.context.parent = this;
    this.valueRange = _Range.Range.copy(firstItem.valueRange);
    const indent = firstItem.range.start - firstItem.context.lineStart;
    let offset = start;
    offset = _Node.Node.normalizeOffset(src, offset);
    let ch = src[offset];
    let atLineStart = _Node.Node.endOfWhiteSpace(src, lineStart) === offset;
    let prevIncludesTrailingLines = false;

    while (ch) {
      while (ch === '\n' || ch === '#') {
        if (atLineStart && ch === '\n' && !prevIncludesTrailingLines) {
          const blankLine = new _BlankLine.BlankLine();
          offset = blankLine.parse({
            src
          }, offset);
          this.valueRange.end = offset;

          if (offset >= src.length) {
            ch = null;
            break;
          }

          this.items.push(blankLine);
          offset -= 1; // blankLine.parse() consumes terminal newline
        } else if (ch === '#') {
          if (offset < lineStart + indent && !Collection.nextContentHasIndent(src, offset, indent)) {
            return offset;
          }

          const comment = new _Comment.Comment();
          offset = comment.parse({
            indent,
            lineStart,
            src
          }, offset);
          this.items.push(comment);
          this.valueRange.end = offset;

          if (offset >= src.length) {
            ch = null;
            break;
          }
        }

        lineStart = offset + 1;
        offset = _Node.Node.endOfIndent(src, lineStart);

        if (_Node.Node.atBlank(src, offset)) {
          const wsEnd = _Node.Node.endOfWhiteSpace(src, offset);

          const next = src[wsEnd];

          if (!next || next === '\n' || next === '#') {
            offset = wsEnd;
          }
        }

        ch = src[offset];
        atLineStart = true;
      }

      if (!ch) {
        break;
      }

      if (offset !== lineStart + indent && (atLineStart || ch !== ':')) {
        if (lineStart > start) offset = lineStart;
        break;
      }

      if (firstItem.type === _constants.Type.SEQ_ITEM !== (ch === '-')) {
        let typeswitch = true;

        if (ch === '-') {
          // map key may start with -, as long as it's followed by a non-whitespace char
          const next = src[offset + 1];
          typeswitch = !next || next === '\n' || next === '\t' || next === ' ';
        }

        if (typeswitch) {
          if (lineStart > start) offset = lineStart;
          break;
        }
      }

      const node = parseNode({
        atLineStart,
        inCollection: true,
        indent,
        lineStart,
        parent: this
      }, offset);
      if (!node) return offset; // at next document start

      this.items.push(node);
      this.valueRange.end = node.valueRange.end;
      offset = _Node.Node.normalizeOffset(src, node.range.end);
      ch = src[offset];
      atLineStart = false;
      prevIncludesTrailingLines = node.includesTrailingLines; // Need to reset lineStart and atLineStart here if preceding node's range
      // has advanced to check the current line's indentation level
      // -- eemeli/yaml#10 & eemeli/yaml#38

      if (ch) {
        let ls = offset - 1;
        let prev = src[ls];

        while (prev === ' ' || prev === '\t') prev = src[--ls];

        if (prev === '\n') {
          lineStart = ls + 1;
          atLineStart = true;
        }
      }

      const ec = grabCollectionEndComments(node);
      if (ec) Array.prototype.push.apply(this.items, ec);
    }

    return offset;
  }

  setOrigRanges(cr, offset) {
    offset = super.setOrigRanges(cr, offset);
    this.items.forEach(node => {
      offset = node.setOrigRanges(cr, offset);
    });
    return offset;
  }

  toString() {
    const {
      context: {
        src
      },
      items,
      range,
      value
    } = this;
    if (value != null) return value;
    let str = src.slice(range.start, items[0].range.start) + String(items[0]);

    for (let i = 1; i < items.length; ++i) {
      const item = items[i];
      const {
        atLineStart,
        indent
      } = item.context;
      if (atLineStart) for (let i = 0; i < indent; ++i) str += ' ';
      str += String(item);
    }

    return _Node.Node.addStringTerminator(src, range.end, str);
  }

}

exports.Collection = Collection;

/***/ }),

/***/ 649:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getLastPage

const getPage = __webpack_require__(265)

function getLastPage (octokit, link, headers) {
  return getPage(octokit, link, 'last', headers)
}


/***/ }),

/***/ 654:
/***/ (function(module) {

// This is not the set of all possible signals.
//
// It IS, however, the set of all signals that trigger
// an exit on either Linux or BSD systems.  Linux is a
// superset of the signal names supported on BSD, and
// the unknown signals just fail to register, so we can
// catch that easily enough.
//
// Don't bother with SIGKILL.  It's uncatchable, which
// means that we can't fire any callbacks anyway.
//
// If a user does happen to register a handler on a non-
// fatal signal like SIGWINCH or something, and then
// exit, it'll end up firing `process.emit('exit')`, so
// the handler will be fired anyway.
//
// SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
// artificially, inherently leave the process in a
// state from which it is not safe to try and enter JS
// listeners.
module.exports = [
  'SIGABRT',
  'SIGALRM',
  'SIGHUP',
  'SIGINT',
  'SIGTERM'
]

if (process.platform !== 'win32') {
  module.exports.push(
    'SIGVTALRM',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGUSR2',
    'SIGTRAP',
    'SIGSYS',
    'SIGQUIT',
    'SIGIOT'
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
  )
}

if (process.platform === 'linux') {
  module.exports.push(
    'SIGIO',
    'SIGPOLL',
    'SIGPWR',
    'SIGSTKFLT',
    'SIGUNUSED'
  )
}


/***/ }),

/***/ 669:
/***/ (function(module) {

module.exports = require("util");

/***/ }),

/***/ 672:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __webpack_require__(357);
const fs = __webpack_require__(747);
const path = __webpack_require__(622);
_a = fs.promises, exports.chmod = _a.chmod, exports.copyFile = _a.copyFile, exports.lstat = _a.lstat, exports.mkdir = _a.mkdir, exports.readdir = _a.readdir, exports.readlink = _a.readlink, exports.rename = _a.rename, exports.rmdir = _a.rmdir, exports.stat = _a.stat, exports.symlink = _a.symlink, exports.unlink = _a.unlink;
exports.IS_WINDOWS = process.platform === 'win32';
function exists(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.stat(fsPath);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                return false;
            }
            throw err;
        }
        return true;
    });
}
exports.exists = exists;
function isDirectory(fsPath, useStat = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = useStat ? yield exports.stat(fsPath) : yield exports.lstat(fsPath);
        return stats.isDirectory();
    });
}
exports.isDirectory = isDirectory;
/**
 * On OSX/Linux, true if path starts with '/'. On Windows, true for paths like:
 * \, \hello, \\hello\share, C:, and C:\hello (and corresponding alternate separator cases).
 */
function isRooted(p) {
    p = normalizeSeparators(p);
    if (!p) {
        throw new Error('isRooted() parameter "p" cannot be empty');
    }
    if (exports.IS_WINDOWS) {
        return (p.startsWith('\\') || /^[A-Z]:/i.test(p) // e.g. \ or \hello or \\hello
        ); // e.g. C: or C:\hello
    }
    return p.startsWith('/');
}
exports.isRooted = isRooted;
/**
 * Recursively create a directory at `fsPath`.
 *
 * This implementation is optimistic, meaning it attempts to create the full
 * path first, and backs up the path stack from there.
 *
 * @param fsPath The path to create
 * @param maxDepth The maximum recursion depth
 * @param depth The current recursion depth
 */
function mkdirP(fsPath, maxDepth = 1000, depth = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(fsPath, 'a path argument must be provided');
        fsPath = path.resolve(fsPath);
        if (depth >= maxDepth)
            return exports.mkdir(fsPath);
        try {
            yield exports.mkdir(fsPath);
            return;
        }
        catch (err) {
            switch (err.code) {
                case 'ENOENT': {
                    yield mkdirP(path.dirname(fsPath), maxDepth, depth + 1);
                    yield exports.mkdir(fsPath);
                    return;
                }
                default: {
                    let stats;
                    try {
                        stats = yield exports.stat(fsPath);
                    }
                    catch (err2) {
                        throw err;
                    }
                    if (!stats.isDirectory())
                        throw err;
                }
            }
        }
    });
}
exports.mkdirP = mkdirP;
/**
 * Best effort attempt to determine whether a file exists and is executable.
 * @param filePath    file path to check
 * @param extensions  additional file extensions to try
 * @return if file exists and is executable, returns the file path. otherwise empty string.
 */
function tryGetExecutablePath(filePath, extensions) {
    return __awaiter(this, void 0, void 0, function* () {
        let stats = undefined;
        try {
            // test file exists
            stats = yield exports.stat(filePath);
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                // eslint-disable-next-line no-console
                console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
            }
        }
        if (stats && stats.isFile()) {
            if (exports.IS_WINDOWS) {
                // on Windows, test for valid extension
                const upperExt = path.extname(filePath).toUpperCase();
                if (extensions.some(validExt => validExt.toUpperCase() === upperExt)) {
                    return filePath;
                }
            }
            else {
                if (isUnixExecutable(stats)) {
                    return filePath;
                }
            }
        }
        // try each extension
        const originalFilePath = filePath;
        for (const extension of extensions) {
            filePath = originalFilePath + extension;
            stats = undefined;
            try {
                stats = yield exports.stat(filePath);
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    // eslint-disable-next-line no-console
                    console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
                }
            }
            if (stats && stats.isFile()) {
                if (exports.IS_WINDOWS) {
                    // preserve the case of the actual file (since an extension was appended)
                    try {
                        const directory = path.dirname(filePath);
                        const upperName = path.basename(filePath).toUpperCase();
                        for (const actualName of yield exports.readdir(directory)) {
                            if (upperName === actualName.toUpperCase()) {
                                filePath = path.join(directory, actualName);
                                break;
                            }
                        }
                    }
                    catch (err) {
                        // eslint-disable-next-line no-console
                        console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
                    }
                    return filePath;
                }
                else {
                    if (isUnixExecutable(stats)) {
                        return filePath;
                    }
                }
            }
        }
        return '';
    });
}
exports.tryGetExecutablePath = tryGetExecutablePath;
function normalizeSeparators(p) {
    p = p || '';
    if (exports.IS_WINDOWS) {
        // convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // remove redundant slashes
        return p.replace(/\\\\+/g, '\\');
    }
    // remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
// on Mac/Linux, test the execute bit
//     R   W  X  R  W X R W X
//   256 128 64 32 16 8 4 2 1
function isUnixExecutable(stats) {
    return ((stats.mode & 1) > 0 ||
        ((stats.mode & 8) > 0 && stats.gid === process.getgid()) ||
        ((stats.mode & 64) > 0 && stats.uid === process.getuid()));
}
//# sourceMappingURL=io-util.js.map

/***/ }),

/***/ 674:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticate;

const { Deprecation } = __webpack_require__(692);
const once = __webpack_require__(969);

const deprecateAuthenticate = once((log, deprecation) => log.warn(deprecation));

function authenticate(state, options) {
  deprecateAuthenticate(
    state.octokit.log,
    new Deprecation(
      '[@octokit/rest] octokit.authenticate() is deprecated. Use "auth" constructor option instead.'
    )
  );

  if (!options) {
    state.auth = false;
    return;
  }

  switch (options.type) {
    case "basic":
      if (!options.username || !options.password) {
        throw new Error(
          "Basic authentication requires both a username and password to be set"
        );
      }
      break;

    case "oauth":
      if (!options.token && !(options.key && options.secret)) {
        throw new Error(
          "OAuth2 authentication requires a token or key & secret to be set"
        );
      }
      break;

    case "token":
    case "app":
      if (!options.token) {
        throw new Error("Token authentication requires a token to be set");
      }
      break;

    default:
      throw new Error(
        "Invalid authentication type, must be 'basic', 'oauth', 'token' or 'app'"
      );
  }

  state.auth = options;
}


/***/ }),

/***/ 675:
/***/ (function(module) {

module.exports = function btoa(str) {
  return new Buffer(str).toString('base64')
}


/***/ }),

/***/ 684:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.findPair = findPair;
exports.YAMLMap = void 0;

var _Collection = __webpack_require__(380);

var _Pair = __webpack_require__(325);

var _Scalar = __webpack_require__(515);

function findPair(items, key) {
  const k = key instanceof _Scalar.Scalar ? key.value : key;

  for (const it of items) {
    if (it instanceof _Pair.Pair) {
      if (it.key === key || it.key === k) return it;
      if (it.key && it.key.value === k) return it;
    }
  }

  return undefined;
}

class YAMLMap extends _Collection.Collection {
  add(pair, overwrite) {
    if (!pair) pair = new _Pair.Pair(pair);else if (!(pair instanceof _Pair.Pair)) pair = new _Pair.Pair(pair.key || pair, pair.value);
    const prev = findPair(this.items, pair.key);
    const sortEntries = this.schema && this.schema.sortMapEntries;

    if (prev) {
      if (overwrite) prev.value = pair.value;else throw new Error(`Key ${pair.key} already set`);
    } else if (sortEntries) {
      const i = this.items.findIndex(item => sortEntries(pair, item) < 0);
      if (i === -1) this.items.push(pair);else this.items.splice(i, 0, pair);
    } else {
      this.items.push(pair);
    }
  }

  delete(key) {
    const it = findPair(this.items, key);
    if (!it) return false;
    const del = this.items.splice(this.items.indexOf(it), 1);
    return del.length > 0;
  }

  get(key, keepScalar) {
    const it = findPair(this.items, key);
    const node = it && it.value;
    return !keepScalar && node instanceof _Scalar.Scalar ? node.value : node;
  }

  has(key) {
    return !!findPair(this.items, key);
  }

  set(key, value) {
    this.add(new _Pair.Pair(key, value), true);
  }
  /**
   * @param {*} arg ignored
   * @param {*} ctx Conversion context, originally set in Document#toJSON()
   * @param {Class} Type If set, forces the returned collection type
   * @returns {*} Instance of Type, Map, or Object
   */


  toJSON(_, ctx, Type) {
    const map = Type ? new Type() : ctx && ctx.mapAsMap ? new Map() : {};
    if (ctx && ctx.onCreate) ctx.onCreate(map);

    for (const item of this.items) item.addToJSMap(ctx, map);

    return map;
  }

  toString(ctx, onComment, onChompKeep) {
    if (!ctx) return JSON.stringify(this);

    for (const item of this.items) {
      if (!(item instanceof _Pair.Pair)) throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
    }

    return super.toString(ctx, {
      blockItem: n => n.str,
      flowChars: {
        start: '{',
        end: '}'
      },
      isMap: true,
      itemIndent: ctx.indent || ''
    }, onComment, onChompKeep);
  }

}

exports.YAMLMap = YAMLMap;

/***/ }),

/***/ 686:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(__webpack_require__(87));
const events = __importStar(__webpack_require__(614));
const child = __importStar(__webpack_require__(129));
const path = __importStar(__webpack_require__(622));
const io = __importStar(__webpack_require__(1));
const ioUtil = __importStar(__webpack_require__(672));
/* eslint-disable @typescript-eslint/unbound-method */
const IS_WINDOWS = process.platform === 'win32';
/*
 * Class for running command line tools. Handles quoting and arg parsing in a platform agnostic way.
 */
class ToolRunner extends events.EventEmitter {
    constructor(toolPath, args, options) {
        super();
        if (!toolPath) {
            throw new Error("Parameter 'toolPath' cannot be null or empty.");
        }
        this.toolPath = toolPath;
        this.args = args || [];
        this.options = options || {};
    }
    _debug(message) {
        if (this.options.listeners && this.options.listeners.debug) {
            this.options.listeners.debug(message);
        }
    }
    _getCommandString(options, noPrefix) {
        const toolPath = this._getSpawnFileName();
        const args = this._getSpawnArgs(options);
        let cmd = noPrefix ? '' : '[command]'; // omit prefix when piped to a second tool
        if (IS_WINDOWS) {
            // Windows + cmd file
            if (this._isCmdFile()) {
                cmd += toolPath;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows + verbatim
            else if (options.windowsVerbatimArguments) {
                cmd += `"${toolPath}"`;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows (regular)
            else {
                cmd += this._windowsQuoteCmdArg(toolPath);
                for (const a of args) {
                    cmd += ` ${this._windowsQuoteCmdArg(a)}`;
                }
            }
        }
        else {
            // OSX/Linux - this can likely be improved with some form of quoting.
            // creating processes on Unix is fundamentally different than Windows.
            // on Unix, execvp() takes an arg array.
            cmd += toolPath;
            for (const a of args) {
                cmd += ` ${a}`;
            }
        }
        return cmd;
    }
    _processLineBuffer(data, strBuffer, onLine) {
        try {
            let s = strBuffer + data.toString();
            let n = s.indexOf(os.EOL);
            while (n > -1) {
                const line = s.substring(0, n);
                onLine(line);
                // the rest of the string ...
                s = s.substring(n + os.EOL.length);
                n = s.indexOf(os.EOL);
            }
            strBuffer = s;
        }
        catch (err) {
            // streaming lines to console is best effort.  Don't fail a build.
            this._debug(`error processing line. Failed with error ${err}`);
        }
    }
    _getSpawnFileName() {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                return process.env['COMSPEC'] || 'cmd.exe';
            }
        }
        return this.toolPath;
    }
    _getSpawnArgs(options) {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
                for (const a of this.args) {
                    argline += ' ';
                    argline += options.windowsVerbatimArguments
                        ? a
                        : this._windowsQuoteCmdArg(a);
                }
                argline += '"';
                return [argline];
            }
        }
        return this.args;
    }
    _endsWith(str, end) {
        return str.endsWith(end);
    }
    _isCmdFile() {
        const upperToolPath = this.toolPath.toUpperCase();
        return (this._endsWith(upperToolPath, '.CMD') ||
            this._endsWith(upperToolPath, '.BAT'));
    }
    _windowsQuoteCmdArg(arg) {
        // for .exe, apply the normal quoting rules that libuv applies
        if (!this._isCmdFile()) {
            return this._uvQuoteCmdArg(arg);
        }
        // otherwise apply quoting rules specific to the cmd.exe command line parser.
        // the libuv rules are generic and are not designed specifically for cmd.exe
        // command line parser.
        //
        // for a detailed description of the cmd.exe command line parser, refer to
        // http://stackoverflow.com/questions/4094699/how-does-the-windows-command-interpreter-cmd-exe-parse-scripts/7970912#7970912
        // need quotes for empty arg
        if (!arg) {
            return '""';
        }
        // determine whether the arg needs to be quoted
        const cmdSpecialChars = [
            ' ',
            '\t',
            '&',
            '(',
            ')',
            '[',
            ']',
            '{',
            '}',
            '^',
            '=',
            ';',
            '!',
            "'",
            '+',
            ',',
            '`',
            '~',
            '|',
            '<',
            '>',
            '"'
        ];
        let needsQuotes = false;
        for (const char of arg) {
            if (cmdSpecialChars.some(x => x === char)) {
                needsQuotes = true;
                break;
            }
        }
        // short-circuit if quotes not needed
        if (!needsQuotes) {
            return arg;
        }
        // the following quoting rules are very similar to the rules that by libuv applies.
        //
        // 1) wrap the string in quotes
        //
        // 2) double-up quotes - i.e. " => ""
        //
        //    this is different from the libuv quoting rules. libuv replaces " with \", which unfortunately
        //    doesn't work well with a cmd.exe command line.
        //
        //    note, replacing " with "" also works well if the arg is passed to a downstream .NET console app.
        //    for example, the command line:
        //          foo.exe "myarg:""my val"""
        //    is parsed by a .NET console app into an arg array:
        //          [ "myarg:\"my val\"" ]
        //    which is the same end result when applying libuv quoting rules. although the actual
        //    command line from libuv quoting rules would look like:
        //          foo.exe "myarg:\"my val\""
        //
        // 3) double-up slashes that precede a quote,
        //    e.g.  hello \world    => "hello \world"
        //          hello\"world    => "hello\\""world"
        //          hello\\"world   => "hello\\\\""world"
        //          hello world\    => "hello world\\"
        //
        //    technically this is not required for a cmd.exe command line, or the batch argument parser.
        //    the reasons for including this as a .cmd quoting rule are:
        //
        //    a) this is optimized for the scenario where the argument is passed from the .cmd file to an
        //       external program. many programs (e.g. .NET console apps) rely on the slash-doubling rule.
        //
        //    b) it's what we've been doing previously (by deferring to node default behavior) and we
        //       haven't heard any complaints about that aspect.
        //
        // note, a weakness of the quoting rules chosen here, is that % is not escaped. in fact, % cannot be
        // escaped when used on the command line directly - even though within a .cmd file % can be escaped
        // by using %%.
        //
        // the saving grace is, on the command line, %var% is left as-is if var is not defined. this contrasts
        // the line parsing rules within a .cmd file, where if var is not defined it is replaced with nothing.
        //
        // one option that was explored was replacing % with ^% - i.e. %var% => ^%var^%. this hack would
        // often work, since it is unlikely that var^ would exist, and the ^ character is removed when the
        // variable is used. the problem, however, is that ^ is not removed when %* is used to pass the args
        // to an external program.
        //
        // an unexplored potential solution for the % escaping problem, is to create a wrapper .cmd file.
        // % can be escaped within a .cmd file.
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\'; // double the slash
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '"'; // double the quote
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _uvQuoteCmdArg(arg) {
        // Tool runner wraps child_process.spawn() and needs to apply the same quoting as
        // Node in certain cases where the undocumented spawn option windowsVerbatimArguments
        // is used.
        //
        // Since this function is a port of quote_cmd_arg from Node 4.x (technically, lib UV,
        // see https://github.com/nodejs/node/blob/v4.x/deps/uv/src/win/process.c for details),
        // pasting copyright notice from Node within this function:
        //
        //      Copyright Joyent, Inc. and other Node contributors. All rights reserved.
        //
        //      Permission is hereby granted, free of charge, to any person obtaining a copy
        //      of this software and associated documentation files (the "Software"), to
        //      deal in the Software without restriction, including without limitation the
        //      rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
        //      sell copies of the Software, and to permit persons to whom the Software is
        //      furnished to do so, subject to the following conditions:
        //
        //      The above copyright notice and this permission notice shall be included in
        //      all copies or substantial portions of the Software.
        //
        //      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        //      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        //      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        //      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        //      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        //      FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
        //      IN THE SOFTWARE.
        if (!arg) {
            // Need double quotation for empty argument
            return '""';
        }
        if (!arg.includes(' ') && !arg.includes('\t') && !arg.includes('"')) {
            // No quotation needed
            return arg;
        }
        if (!arg.includes('"') && !arg.includes('\\')) {
            // No embedded double quotes or backslashes, so I can just wrap
            // quote marks around the whole thing.
            return `"${arg}"`;
        }
        // Expected input/output:
        //   input : hello"world
        //   output: "hello\"world"
        //   input : hello""world
        //   output: "hello\"\"world"
        //   input : hello\world
        //   output: hello\world
        //   input : hello\\world
        //   output: hello\\world
        //   input : hello\"world
        //   output: "hello\\\"world"
        //   input : hello\\"world
        //   output: "hello\\\\\"world"
        //   input : hello world\
        //   output: "hello world\\" - note the comment in libuv actually reads "hello world\"
        //                             but it appears the comment is wrong, it should be "hello world\\"
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\';
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '\\';
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _cloneExecOptions(options) {
        options = options || {};
        const result = {
            cwd: options.cwd || process.cwd(),
            env: options.env || process.env,
            silent: options.silent || false,
            windowsVerbatimArguments: options.windowsVerbatimArguments || false,
            failOnStdErr: options.failOnStdErr || false,
            ignoreReturnCode: options.ignoreReturnCode || false,
            delay: options.delay || 10000
        };
        result.outStream = options.outStream || process.stdout;
        result.errStream = options.errStream || process.stderr;
        return result;
    }
    _getSpawnOptions(options, toolPath) {
        options = options || {};
        const result = {};
        result.cwd = options.cwd;
        result.env = options.env;
        result['windowsVerbatimArguments'] =
            options.windowsVerbatimArguments || this._isCmdFile();
        if (options.windowsVerbatimArguments) {
            result.argv0 = `"${toolPath}"`;
        }
        return result;
    }
    /**
     * Exec a tool.
     * Output will be streamed to the live console.
     * Returns promise with return code
     *
     * @param     tool     path to tool to exec
     * @param     options  optional exec options.  See ExecOptions
     * @returns   number
     */
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            // root the tool path if it is unrooted and contains relative pathing
            if (!ioUtil.isRooted(this.toolPath) &&
                (this.toolPath.includes('/') ||
                    (IS_WINDOWS && this.toolPath.includes('\\')))) {
                // prefer options.cwd if it is specified, however options.cwd may also need to be rooted
                this.toolPath = path.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
            }
            // if the tool is only a file name, then resolve it from the PATH
            // otherwise verify it exists (add extension on Windows if necessary)
            this.toolPath = yield io.which(this.toolPath, true);
            return new Promise((resolve, reject) => {
                this._debug(`exec tool: ${this.toolPath}`);
                this._debug('arguments:');
                for (const arg of this.args) {
                    this._debug(`   ${arg}`);
                }
                const optionsNonNull = this._cloneExecOptions(this.options);
                if (!optionsNonNull.silent && optionsNonNull.outStream) {
                    optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os.EOL);
                }
                const state = new ExecState(optionsNonNull, this.toolPath);
                state.on('debug', (message) => {
                    this._debug(message);
                });
                const fileName = this._getSpawnFileName();
                const cp = child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
                const stdbuffer = '';
                if (cp.stdout) {
                    cp.stdout.on('data', (data) => {
                        if (this.options.listeners && this.options.listeners.stdout) {
                            this.options.listeners.stdout(data);
                        }
                        if (!optionsNonNull.silent && optionsNonNull.outStream) {
                            optionsNonNull.outStream.write(data);
                        }
                        this._processLineBuffer(data, stdbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.stdline) {
                                this.options.listeners.stdline(line);
                            }
                        });
                    });
                }
                const errbuffer = '';
                if (cp.stderr) {
                    cp.stderr.on('data', (data) => {
                        state.processStderr = true;
                        if (this.options.listeners && this.options.listeners.stderr) {
                            this.options.listeners.stderr(data);
                        }
                        if (!optionsNonNull.silent &&
                            optionsNonNull.errStream &&
                            optionsNonNull.outStream) {
                            const s = optionsNonNull.failOnStdErr
                                ? optionsNonNull.errStream
                                : optionsNonNull.outStream;
                            s.write(data);
                        }
                        this._processLineBuffer(data, errbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.errline) {
                                this.options.listeners.errline(line);
                            }
                        });
                    });
                }
                cp.on('error', (err) => {
                    state.processError = err.message;
                    state.processExited = true;
                    state.processClosed = true;
                    state.CheckComplete();
                });
                cp.on('exit', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                cp.on('close', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    state.processClosed = true;
                    this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                state.on('done', (error, exitCode) => {
                    if (stdbuffer.length > 0) {
                        this.emit('stdline', stdbuffer);
                    }
                    if (errbuffer.length > 0) {
                        this.emit('errline', errbuffer);
                    }
                    cp.removeAllListeners();
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(exitCode);
                    }
                });
                if (this.options.input) {
                    if (!cp.stdin) {
                        throw new Error('child process missing stdin');
                    }
                    cp.stdin.end(this.options.input);
                }
            });
        });
    }
}
exports.ToolRunner = ToolRunner;
/**
 * Convert an arg string to an array of args. Handles escaping
 *
 * @param    argString   string of arguments
 * @returns  string[]    array of arguments
 */
function argStringToArray(argString) {
    const args = [];
    let inQuotes = false;
    let escaped = false;
    let arg = '';
    function append(c) {
        // we only escape double quotes.
        if (escaped && c !== '"') {
            arg += '\\';
        }
        arg += c;
        escaped = false;
    }
    for (let i = 0; i < argString.length; i++) {
        const c = argString.charAt(i);
        if (c === '"') {
            if (!escaped) {
                inQuotes = !inQuotes;
            }
            else {
                append(c);
            }
            continue;
        }
        if (c === '\\' && escaped) {
            append(c);
            continue;
        }
        if (c === '\\' && inQuotes) {
            escaped = true;
            continue;
        }
        if (c === ' ' && !inQuotes) {
            if (arg.length > 0) {
                args.push(arg);
                arg = '';
            }
            continue;
        }
        append(c);
    }
    if (arg.length > 0) {
        args.push(arg.trim());
    }
    return args;
}
exports.argStringToArray = argStringToArray;
class ExecState extends events.EventEmitter {
    constructor(options, toolPath) {
        super();
        this.processClosed = false; // tracks whether the process has exited and stdio is closed
        this.processError = '';
        this.processExitCode = 0;
        this.processExited = false; // tracks whether the process has exited
        this.processStderr = false; // tracks whether stderr was written to
        this.delay = 10000; // 10 seconds
        this.done = false;
        this.timeout = null;
        if (!toolPath) {
            throw new Error('toolPath must not be empty');
        }
        this.options = options;
        this.toolPath = toolPath;
        if (options.delay) {
            this.delay = options.delay;
        }
    }
    CheckComplete() {
        if (this.done) {
            return;
        }
        if (this.processClosed) {
            this._setResult();
        }
        else if (this.processExited) {
            this.timeout = setTimeout(ExecState.HandleTimeout, this.delay, this);
        }
    }
    _debug(message) {
        this.emit('debug', message);
    }
    _setResult() {
        // determine whether there is an error
        let error;
        if (this.processExited) {
            if (this.processError) {
                error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
            }
            else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) {
                error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
            }
            else if (this.processStderr && this.options.failOnStdErr) {
                error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
            }
        }
        // clear the timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.done = true;
        this.emit('done', error, this.processExitCode);
    }
    static HandleTimeout(state) {
        if (state.done) {
            return;
        }
        if (!state.processClosed && state.processExited) {
            const message = `The STDIO streams did not close within ${state.delay /
                1000} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
            state._debug(message);
        }
        state._setResult();
    }
}
//# sourceMappingURL=toolrunner.js.map

/***/ }),

/***/ 692:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

class Deprecation extends Error {
  constructor(message) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'Deprecation';
  }

}

exports.Deprecation = Deprecation;


/***/ }),

/***/ 696:
/***/ (function(module) {

"use strict";


/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObjectObject(o) {
  return isObject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

module.exports = isPlainObject;


/***/ }),

/***/ 697:
/***/ (function(module) {

"use strict";

module.exports = (promise, onFinally) => {
	onFinally = onFinally || (() => {});

	return promise.then(
		val => new Promise(resolve => {
			resolve(onFinally());
		}).then(() => val),
		err => new Promise(resolve => {
			resolve(onFinally());
		}).then(() => {
			throw err;
		})
	);
};


/***/ }),

/***/ 705:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.Directive = void 0;

var _constants = __webpack_require__(383);

var _Node = __webpack_require__(974);

var _Range = __webpack_require__(994);

class Directive extends _Node.Node {
  constructor() {
    super(_constants.Type.DIRECTIVE);
    this.name = null;
  }

  get parameters() {
    const raw = this.rawValue;
    return raw ? raw.trim().split(/[ \t]+/) : [];
  }

  parseName(start) {
    const {
      src
    } = this.context;
    let offset = start;
    let ch = src[offset];

    while (ch && ch !== '\n' && ch !== '\t' && ch !== ' ') ch = src[offset += 1];

    this.name = src.slice(start, offset);
    return offset;
  }

  parseParameters(start) {
    const {
      src
    } = this.context;
    let offset = start;
    let ch = src[offset];

    while (ch && ch !== '\n' && ch !== '#') ch = src[offset += 1];

    this.valueRange = new _Range.Range(start, offset);
    return offset;
  }

  parse(context, start) {
    this.context = context;
    let offset = this.parseName(start + 1);
    offset = this.parseParameters(offset);
    offset = this.parseComment(offset);
    this.range = new _Range.Range(start, offset);
    return offset;
  }

}

exports.Directive = Directive;

/***/ }),

/***/ 714:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.yaml11 = void 0;

var _Scalar = __webpack_require__(515);

var _stringify = __webpack_require__(315);

var _failsafe = __webpack_require__(195);

var _options = __webpack_require__(422);

var _binary = __webpack_require__(996);

var _omap = __webpack_require__(821);

var _pairs = __webpack_require__(566);

var _set = __webpack_require__(785);

var _timestamp = __webpack_require__(414);

/* global BigInt */
const boolStringify = ({
  value
}) => value ? _options.boolOptions.trueStr : _options.boolOptions.falseStr;

const intIdentify = value => typeof value === 'bigint' || Number.isInteger(value);

function intResolve(sign, src, radix) {
  let str = src.replace(/_/g, '');

  if (_options.intOptions.asBigInt) {
    switch (radix) {
      case 2:
        str = `0b${str}`;
        break;

      case 8:
        str = `0o${str}`;
        break;

      case 16:
        str = `0x${str}`;
        break;
    }

    const n = BigInt(str);
    return sign === '-' ? BigInt(-1) * n : n;
  }

  const n = parseInt(str, radix);
  return sign === '-' ? -1 * n : n;
}

function intStringify(node, radix, prefix) {
  const {
    value
  } = node;

  if (intIdentify(value)) {
    const str = value.toString(radix);
    return value < 0 ? '-' + prefix + str.substr(1) : prefix + str;
  }

  return (0, _stringify.stringifyNumber)(node);
}

const yaml11 = _failsafe.failsafe.concat([{
  identify: value => value == null,
  createNode: (schema, value, ctx) => ctx.wrapScalars ? new _Scalar.Scalar(null) : null,
  default: true,
  tag: 'tag:yaml.org,2002:null',
  test: /^(?:~|[Nn]ull|NULL)?$/,
  resolve: () => null,
  options: _options.nullOptions,
  stringify: () => _options.nullOptions.nullStr
}, {
  identify: value => typeof value === 'boolean',
  default: true,
  tag: 'tag:yaml.org,2002:bool',
  test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
  resolve: () => true,
  options: _options.boolOptions,
  stringify: boolStringify
}, {
  identify: value => typeof value === 'boolean',
  default: true,
  tag: 'tag:yaml.org,2002:bool',
  test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/i,
  resolve: () => false,
  options: _options.boolOptions,
  stringify: boolStringify
}, {
  identify: intIdentify,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'BIN',
  test: /^([-+]?)0b([0-1_]+)$/,
  resolve: (str, sign, bin) => intResolve(sign, bin, 2),
  stringify: node => intStringify(node, 2, '0b')
}, {
  identify: intIdentify,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'OCT',
  test: /^([-+]?)0([0-7_]+)$/,
  resolve: (str, sign, oct) => intResolve(sign, oct, 8),
  stringify: node => intStringify(node, 8, '0')
}, {
  identify: intIdentify,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  test: /^([-+]?)([0-9][0-9_]*)$/,
  resolve: (str, sign, abs) => intResolve(sign, abs, 10),
  stringify: _stringify.stringifyNumber
}, {
  identify: intIdentify,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'HEX',
  test: /^([-+]?)0x([0-9a-fA-F_]+)$/,
  resolve: (str, sign, hex) => intResolve(sign, hex, 16),
  stringify: node => intStringify(node, 16, '0x')
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  test: /^(?:[-+]?\.inf|(\.nan))$/i,
  resolve: (str, nan) => nan ? NaN : str[0] === '-' ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: _stringify.stringifyNumber
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  format: 'EXP',
  test: /^[-+]?([0-9][0-9_]*)?(\.[0-9_]*)?[eE][-+]?[0-9]+$/,
  resolve: str => parseFloat(str.replace(/_/g, '')),
  stringify: ({
    value
  }) => Number(value).toExponential()
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  test: /^[-+]?(?:[0-9][0-9_]*)?\.([0-9_]*)$/,

  resolve(str, frac) {
    const node = new _Scalar.Scalar(parseFloat(str.replace(/_/g, '')));

    if (frac) {
      const f = frac.replace(/_/g, '');
      if (f[f.length - 1] === '0') node.minFractionDigits = f.length;
    }

    return node;
  },

  stringify: _stringify.stringifyNumber
}], _binary.binary, _omap.omap, _pairs.pairs, _set.set, _timestamp.intTime, _timestamp.floatTime, _timestamp.timestamp);

exports.yaml11 = yaml11;

/***/ }),

/***/ 725:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.QuoteDouble = void 0;

var _errors = __webpack_require__(405);

var _Node = __webpack_require__(974);

var _Range = __webpack_require__(994);

class QuoteDouble extends _Node.Node {
  static endOfQuote(src, offset) {
    let ch = src[offset];

    while (ch && ch !== '"') {
      offset += ch === '\\' ? 2 : 1;
      ch = src[offset];
    }

    return offset + 1;
  }
  /**
   * @returns {string | { str: string, errors: YAMLSyntaxError[] }}
   */


  get strValue() {
    if (!this.valueRange || !this.context) return null;
    const errors = [];
    const {
      start,
      end
    } = this.valueRange;
    const {
      indent,
      src
    } = this.context;
    if (src[end - 1] !== '"') errors.push(new _errors.YAMLSyntaxError(this, 'Missing closing "quote')); // Using String#replace is too painful with escaped newlines preceded by
    // escaped backslashes; also, this should be faster.

    let str = '';

    for (let i = start + 1; i < end - 1; ++i) {
      const ch = src[i];

      if (ch === '\n') {
        if (_Node.Node.atDocumentBoundary(src, i + 1)) errors.push(new _errors.YAMLSemanticError(this, 'Document boundary indicators are not allowed within string values'));

        const {
          fold,
          offset,
          error
        } = _Node.Node.foldNewline(src, i, indent);

        str += fold;
        i = offset;
        if (error) errors.push(new _errors.YAMLSemanticError(this, 'Multi-line double-quoted string needs to be sufficiently indented'));
      } else if (ch === '\\') {
        i += 1;

        switch (src[i]) {
          case '0':
            str += '\0';
            break;
          // null character

          case 'a':
            str += '\x07';
            break;
          // bell character

          case 'b':
            str += '\b';
            break;
          // backspace

          case 'e':
            str += '\x1b';
            break;
          // escape character

          case 'f':
            str += '\f';
            break;
          // form feed

          case 'n':
            str += '\n';
            break;
          // line feed

          case 'r':
            str += '\r';
            break;
          // carriage return

          case 't':
            str += '\t';
            break;
          // horizontal tab

          case 'v':
            str += '\v';
            break;
          // vertical tab

          case 'N':
            str += '\u0085';
            break;
          // Unicode next line

          case '_':
            str += '\u00a0';
            break;
          // Unicode non-breaking space

          case 'L':
            str += '\u2028';
            break;
          // Unicode line separator

          case 'P':
            str += '\u2029';
            break;
          // Unicode paragraph separator

          case ' ':
            str += ' ';
            break;

          case '"':
            str += '"';
            break;

          case '/':
            str += '/';
            break;

          case '\\':
            str += '\\';
            break;

          case '\t':
            str += '\t';
            break;

          case 'x':
            str += this.parseCharCode(i + 1, 2, errors);
            i += 2;
            break;

          case 'u':
            str += this.parseCharCode(i + 1, 4, errors);
            i += 4;
            break;

          case 'U':
            str += this.parseCharCode(i + 1, 8, errors);
            i += 8;
            break;

          case '\n':
            // skip escaped newlines, but still trim the following line
            while (src[i + 1] === ' ' || src[i + 1] === '\t') i += 1;

            break;

          default:
            errors.push(new _errors.YAMLSyntaxError(this, `Invalid escape sequence ${src.substr(i - 1, 2)}`));
            str += '\\' + src[i];
        }
      } else if (ch === ' ' || ch === '\t') {
        // trim trailing whitespace
        const wsStart = i;
        let next = src[i + 1];

        while (next === ' ' || next === '\t') {
          i += 1;
          next = src[i + 1];
        }

        if (next !== '\n') str += i > wsStart ? src.slice(wsStart, i + 1) : ch;
      } else {
        str += ch;
      }
    }

    return errors.length > 0 ? {
      errors,
      str
    } : str;
  }

  parseCharCode(offset, length, errors) {
    const {
      src
    } = this.context;
    const cc = src.substr(offset, length);
    const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
    const code = ok ? parseInt(cc, 16) : NaN;

    if (isNaN(code)) {
      errors.push(new _errors.YAMLSyntaxError(this, `Invalid escape sequence ${src.substr(offset - 2, length + 2)}`));
      return src.substr(offset - 2, length + 2);
    }

    return String.fromCodePoint(code);
  }
  /**
   * Parses a "double quoted" value from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar
   */


  parse(context, start) {
    this.context = context;
    const {
      src
    } = context;
    let offset = QuoteDouble.endOfQuote(src, start + 1);
    this.valueRange = new _Range.Range(start, offset);
    offset = _Node.Node.endOfWhiteSpace(src, offset);
    offset = this.parseComment(offset);
    return offset;
  }

}

exports.QuoteDouble = QuoteDouble;

/***/ }),

/***/ 732:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.map = void 0;

var _Map = __webpack_require__(684);

var _parseMap = __webpack_require__(625);

function createMap(schema, obj, ctx) {
  const map = new _Map.YAMLMap(schema);

  if (obj instanceof Map) {
    for (const [key, value] of obj) map.items.push(schema.createPair(key, value, ctx));
  } else if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) map.items.push(schema.createPair(key, obj[key], ctx));
  }

  if (typeof schema.sortMapEntries === 'function') {
    map.items.sort(schema.sortMapEntries);
  }

  return map;
}

const map = {
  createNode: createMap,
  default: true,
  nodeClass: _Map.YAMLMap,
  tag: 'tag:yaml.org,2002:map',
  resolve: _parseMap.parseMap
};
exports.map = map;

/***/ }),

/***/ 734:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.checkFlowCollectionEnd = checkFlowCollectionEnd;
exports.checkKeyLength = checkKeyLength;
exports.resolveComments = resolveComments;

var _errors = __webpack_require__(405);

var _constants = __webpack_require__(383);

function checkFlowCollectionEnd(errors, cst) {
  let char, name;

  switch (cst.type) {
    case _constants.Type.FLOW_MAP:
      char = '}';
      name = 'flow map';
      break;

    case _constants.Type.FLOW_SEQ:
      char = ']';
      name = 'flow sequence';
      break;

    default:
      errors.push(new _errors.YAMLSemanticError(cst, 'Not a flow collection!?'));
      return;
  }

  let lastItem;

  for (let i = cst.items.length - 1; i >= 0; --i) {
    const item = cst.items[i];

    if (!item || item.type !== _constants.Type.COMMENT) {
      lastItem = item;
      break;
    }
  }

  if (lastItem && lastItem.char !== char) {
    const msg = `Expected ${name} to end with ${char}`;
    let err;

    if (typeof lastItem.offset === 'number') {
      err = new _errors.YAMLSemanticError(cst, msg);
      err.offset = lastItem.offset + 1;
    } else {
      err = new _errors.YAMLSemanticError(lastItem, msg);
      if (lastItem.range && lastItem.range.end) err.offset = lastItem.range.end - lastItem.range.start;
    }

    errors.push(err);
  }
}

function checkKeyLength(errors, node, itemIdx, key, keyStart) {
  if (!key || typeof keyStart !== 'number') return;
  const item = node.items[itemIdx];
  let keyEnd = item && item.range && item.range.start;

  if (!keyEnd) {
    for (let i = itemIdx - 1; i >= 0; --i) {
      const it = node.items[i];

      if (it && it.range) {
        keyEnd = it.range.end + 2 * (itemIdx - i);
        break;
      }
    }
  }

  if (keyEnd > keyStart + 1024) {
    const k = String(key).substr(0, 8) + '...' + String(key).substr(-8);
    errors.push(new _errors.YAMLSemanticError(node, `The "${k}" key is too long`));
  }
}

function resolveComments(collection, comments) {
  for (const {
    afterKey,
    before,
    comment
  } of comments) {
    let item = collection.items[before];

    if (!item) {
      if (comment !== undefined) {
        if (collection.comment) collection.comment += '\n' + comment;else collection.comment = comment;
      }
    } else {
      if (afterKey && item.value) item = item.value;

      if (comment === undefined) {
        if (afterKey || !item.commentBefore) item.spaceBefore = true;
      } else {
        if (item.commentBefore) item.commentBefore += '\n' + comment;else item.commentBefore = comment;
      }
    }
  }
}

/***/ }),

/***/ 742:
/***/ (function(module, __unusedexports, __webpack_require__) {

var fs = __webpack_require__(747)
var core
if (process.platform === 'win32' || global.TESTING_WINDOWS) {
  core = __webpack_require__(818)
} else {
  core = __webpack_require__(197)
}

module.exports = isexe
isexe.sync = sync

function isexe (path, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided')
    }

    return new Promise(function (resolve, reject) {
      isexe(path, options || {}, function (er, is) {
        if (er) {
          reject(er)
        } else {
          resolve(is)
        }
      })
    })
  }

  core(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null
        is = false
      }
    }
    cb(er, is)
  })
}

function sync (path, options) {
  // my kingdom for a filtered catch
  try {
    return core.sync(path, options || {})
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false
    } else {
      throw er
    }
  }
}


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ }),

/***/ 753:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var endpoint = __webpack_require__(385);
var universalUserAgent = __webpack_require__(796);
var isPlainObject = _interopDefault(__webpack_require__(696));
var nodeFetch = _interopDefault(__webpack_require__(454));
var requestError = __webpack_require__(463);

const VERSION = "5.4.2";

function getBufferResponse(response) {
  return response.arrayBuffer();
}

function fetchWrapper(requestOptions) {
  if (isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }

  let headers = {};
  let status;
  let url;
  const fetch = requestOptions.request && requestOptions.request.fetch || nodeFetch;
  return fetch(requestOptions.url, Object.assign({
    method: requestOptions.method,
    body: requestOptions.body,
    headers: requestOptions.headers,
    redirect: requestOptions.redirect
  }, requestOptions.request)).then(response => {
    url = response.url;
    status = response.status;

    for (const keyAndValue of response.headers) {
      headers[keyAndValue[0]] = keyAndValue[1];
    }

    if (status === 204 || status === 205) {
      return;
    } // GitHub API returns 200 for HEAD requests


    if (requestOptions.method === "HEAD") {
      if (status < 400) {
        return;
      }

      throw new requestError.RequestError(response.statusText, status, {
        headers,
        request: requestOptions
      });
    }

    if (status === 304) {
      throw new requestError.RequestError("Not modified", status, {
        headers,
        request: requestOptions
      });
    }

    if (status >= 400) {
      return response.text().then(message => {
        const error = new requestError.RequestError(message, status, {
          headers,
          request: requestOptions
        });

        try {
          let responseBody = JSON.parse(error.message);
          Object.assign(error, responseBody);
          let errors = responseBody.errors; // Assumption `errors` would always be in Array format

          error.message = error.message + ": " + errors.map(JSON.stringify).join(", ");
        } catch (e) {// ignore, see octokit/rest.js#684
        }

        throw error;
      });
    }

    const contentType = response.headers.get("content-type");

    if (/application\/json/.test(contentType)) {
      return response.json();
    }

    if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
      return response.text();
    }

    return getBufferResponse(response);
  }).then(data => {
    return {
      status,
      url,
      headers,
      data
    };
  }).catch(error => {
    if (error instanceof requestError.RequestError) {
      throw error;
    }

    throw new requestError.RequestError(error.message, 500, {
      headers,
      request: requestOptions
    });
  });
}

function withDefaults(oldEndpoint, newDefaults) {
  const endpoint = oldEndpoint.defaults(newDefaults);

  const newApi = function (route, parameters) {
    const endpointOptions = endpoint.merge(route, parameters);

    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint.parse(endpointOptions));
    }

    const request = (route, parameters) => {
      return fetchWrapper(endpoint.parse(endpoint.merge(route, parameters)));
    };

    Object.assign(request, {
      endpoint,
      defaults: withDefaults.bind(null, endpoint)
    });
    return endpointOptions.request.hook(request, endpointOptions);
  };

  return Object.assign(newApi, {
    endpoint,
    defaults: withDefaults.bind(null, endpoint)
  });
}

const request = withDefaults(endpoint.endpoint, {
  headers: {
    "user-agent": `octokit-request.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  }
});

exports.request = request;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 761:
/***/ (function(module) {

module.exports = require("zlib");

/***/ }),

/***/ 763:
/***/ (function(module) {

module.exports = removeHook

function removeHook (state, name, method) {
  if (!state.registry[name]) {
    return
  }

  var index = state.registry[name]
    .map(function (registered) { return registered.orig })
    .indexOf(method)

  if (index === -1) {
    return
  }

  state.registry[name].splice(index, 1)
}


/***/ }),

/***/ 767:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.seq = void 0;

var _parseSeq = __webpack_require__(858);

var _Seq = __webpack_require__(29);

function createSeq(schema, obj, ctx) {
  const seq = new _Seq.YAMLSeq(schema);

  if (obj && obj[Symbol.iterator]) {
    for (const it of obj) {
      const v = schema.createNode(it, ctx.wrapScalars, null, ctx);
      seq.items.push(v);
    }
  }

  return seq;
}

const seq = {
  createNode: createSeq,
  default: true,
  nodeClass: _Seq.YAMLSeq,
  tag: 'tag:yaml.org,2002:seq',
  resolve: _parseSeq.parseSeq
};
exports.seq = seq;

/***/ }),

/***/ 768:
/***/ (function(module) {

"use strict";

module.exports = function (x) {
	var lf = typeof x === 'string' ? '\n' : '\n'.charCodeAt();
	var cr = typeof x === 'string' ? '\r' : '\r'.charCodeAt();

	if (x[x.length - 1] === lf) {
		x = x.slice(0, x.length - 1);
	}

	if (x[x.length - 1] === cr) {
		x = x.slice(0, x.length - 1);
	}

	return x;
};


/***/ }),

/***/ 775:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.core = exports.floatObj = exports.expObj = exports.nanObj = exports.hexObj = exports.intObj = exports.octObj = exports.boolObj = exports.nullObj = void 0;

var _Scalar = __webpack_require__(515);

var _stringify = __webpack_require__(315);

var _failsafe = __webpack_require__(195);

var _options = __webpack_require__(422);

/* global BigInt */
const intIdentify = value => typeof value === 'bigint' || Number.isInteger(value);

const intResolve = (src, part, radix) => _options.intOptions.asBigInt ? BigInt(src) : parseInt(part, radix);

function intStringify(node, radix, prefix) {
  const {
    value
  } = node;
  if (intIdentify(value) && value >= 0) return prefix + value.toString(radix);
  return (0, _stringify.stringifyNumber)(node);
}

const nullObj = {
  identify: value => value == null,
  createNode: (schema, value, ctx) => ctx.wrapScalars ? new _Scalar.Scalar(null) : null,
  default: true,
  tag: 'tag:yaml.org,2002:null',
  test: /^(?:~|[Nn]ull|NULL)?$/,
  resolve: () => null,
  options: _options.nullOptions,
  stringify: () => _options.nullOptions.nullStr
};
exports.nullObj = nullObj;
const boolObj = {
  identify: value => typeof value === 'boolean',
  default: true,
  tag: 'tag:yaml.org,2002:bool',
  test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
  resolve: str => str[0] === 't' || str[0] === 'T',
  options: _options.boolOptions,
  stringify: ({
    value
  }) => value ? _options.boolOptions.trueStr : _options.boolOptions.falseStr
};
exports.boolObj = boolObj;
const octObj = {
  identify: value => intIdentify(value) && value >= 0,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'OCT',
  test: /^0o([0-7]+)$/,
  resolve: (str, oct) => intResolve(str, oct, 8),
  options: _options.intOptions,
  stringify: node => intStringify(node, 8, '0o')
};
exports.octObj = octObj;
const intObj = {
  identify: intIdentify,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  test: /^[-+]?[0-9]+$/,
  resolve: str => intResolve(str, str, 10),
  options: _options.intOptions,
  stringify: _stringify.stringifyNumber
};
exports.intObj = intObj;
const hexObj = {
  identify: value => intIdentify(value) && value >= 0,
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'HEX',
  test: /^0x([0-9a-fA-F]+)$/,
  resolve: (str, hex) => intResolve(str, hex, 16),
  options: _options.intOptions,
  stringify: node => intStringify(node, 16, '0x')
};
exports.hexObj = hexObj;
const nanObj = {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  test: /^(?:[-+]?\.inf|(\.nan))$/i,
  resolve: (str, nan) => nan ? NaN : str[0] === '-' ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: _stringify.stringifyNumber
};
exports.nanObj = nanObj;
const expObj = {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  format: 'EXP',
  test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
  resolve: str => parseFloat(str),
  stringify: ({
    value
  }) => Number(value).toExponential()
};
exports.expObj = expObj;
const floatObj = {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  test: /^[-+]?(?:\.([0-9]+)|[0-9]+\.([0-9]*))$/,

  resolve(str, frac1, frac2) {
    const frac = frac1 || frac2;
    const node = new _Scalar.Scalar(parseFloat(str));
    if (frac && frac[frac.length - 1] === '0') node.minFractionDigits = frac.length;
    return node;
  },

  stringify: _stringify.stringifyNumber
};
exports.floatObj = floatObj;

const core = _failsafe.failsafe.concat([nullObj, boolObj, octObj, intObj, hexObj, nanObj, expObj, floatObj]);

exports.core = core;

/***/ }),

/***/ 777:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getFirstPage

const getPage = __webpack_require__(265)

function getFirstPage (octokit, link, headers) {
  return getPage(octokit, link, 'first', headers)
}


/***/ }),

/***/ 785:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.set = exports.YAMLSet = void 0;

var _errors = __webpack_require__(405);

var _Map = __webpack_require__(684);

var _Pair = __webpack_require__(325);

var _parseMap = __webpack_require__(625);

var _Scalar = __webpack_require__(515);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class YAMLSet extends _Map.YAMLMap {
  constructor() {
    super();
    this.tag = YAMLSet.tag;
  }

  add(key) {
    const pair = key instanceof _Pair.Pair ? key : new _Pair.Pair(key);
    const prev = (0, _Map.findPair)(this.items, pair.key);
    if (!prev) this.items.push(pair);
  }

  get(key, keepPair) {
    const pair = (0, _Map.findPair)(this.items, key);
    return !keepPair && pair instanceof _Pair.Pair ? pair.key instanceof _Scalar.Scalar ? pair.key.value : pair.key : pair;
  }

  set(key, value) {
    if (typeof value !== 'boolean') throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
    const prev = (0, _Map.findPair)(this.items, key);

    if (prev && !value) {
      this.items.splice(this.items.indexOf(prev), 1);
    } else if (!prev && value) {
      this.items.push(new _Pair.Pair(key));
    }
  }

  toJSON(_, ctx) {
    return super.toJSON(_, ctx, Set);
  }

  toString(ctx, onComment, onChompKeep) {
    if (!ctx) return JSON.stringify(this);
    if (this.hasAllNullValues()) return super.toString(ctx, onComment, onChompKeep);else throw new Error('Set items must all have null values');
  }

}

exports.YAMLSet = YAMLSet;

_defineProperty(YAMLSet, "tag", 'tag:yaml.org,2002:set');

function parseSet(doc, cst) {
  const map = (0, _parseMap.parseMap)(doc, cst);
  if (!map.hasAllNullValues()) throw new _errors.YAMLSemanticError(cst, 'Set items must all have null values');
  return Object.assign(new YAMLSet(), map);
}

function createSet(schema, iterable, ctx) {
  const set = new YAMLSet();

  for (const value of iterable) set.items.push(schema.createPair(value, null, ctx));

  return set;
}

const set = {
  identify: value => value instanceof Set,
  nodeClass: YAMLSet,
  default: false,
  tag: 'tag:yaml.org,2002:set',
  resolve: parseSet,
  createNode: createSet
};
exports.set = set;

/***/ }),

/***/ 792:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.YAML = void 0;

var _parse = __webpack_require__(309);

var _Document = __webpack_require__(570);

var _errors = __webpack_require__(405);

var _schema = __webpack_require__(255);

var _options = __webpack_require__(422);

var _warnings = __webpack_require__(847);

const defaultOptions = {
  anchorPrefix: 'a',
  customTags: null,
  indent: 2,
  indentSeq: true,
  keepCstNodes: false,
  keepNodeTypes: true,
  keepBlobsInJSON: true,
  mapAsMap: false,
  maxAliasCount: 100,
  prettyErrors: false,
  // TODO Set true in v2
  simpleKeys: false,
  version: '1.2'
};
const scalarOptions = {
  get binary() {
    return _options.binaryOptions;
  },

  set binary(opt) {
    Object.assign(_options.binaryOptions, opt);
  },

  get bool() {
    return _options.boolOptions;
  },

  set bool(opt) {
    Object.assign(_options.boolOptions, opt);
  },

  get int() {
    return _options.intOptions;
  },

  set int(opt) {
    Object.assign(_options.intOptions, opt);
  },

  get null() {
    return _options.nullOptions;
  },

  set null(opt) {
    Object.assign(_options.nullOptions, opt);
  },

  get str() {
    return _options.strOptions;
  },

  set str(opt) {
    Object.assign(_options.strOptions, opt);
  }

};

function createNode(value, wrapScalars = true, tag) {
  if (tag === undefined && typeof wrapScalars === 'string') {
    tag = wrapScalars;
    wrapScalars = true;
  }

  const options = Object.assign({}, _Document.Document.defaults[defaultOptions.version], defaultOptions);
  const schema = new _schema.Schema(options);
  return schema.createNode(value, wrapScalars, tag);
}

class Document extends _Document.Document {
  constructor(options) {
    super(Object.assign({}, defaultOptions, options));
  }

}

function parseAllDocuments(src, options) {
  const stream = [];
  let prev;

  for (const cstDoc of (0, _parse.parse)(src)) {
    const doc = new Document(options);
    doc.parse(cstDoc, prev);
    stream.push(doc);
    prev = doc;
  }

  return stream;
}

function parseDocument(src, options) {
  const cst = (0, _parse.parse)(src);
  const doc = new Document(options).parse(cst[0]);

  if (cst.length > 1) {
    const errMsg = 'Source contains multiple documents; please use YAML.parseAllDocuments()';
    doc.errors.unshift(new _errors.YAMLSemanticError(cst[1], errMsg));
  }

  return doc;
}

function parse(src, options) {
  const doc = parseDocument(src, options);
  doc.warnings.forEach(warning => (0, _warnings.warn)(warning));
  if (doc.errors.length > 0) throw doc.errors[0];
  return doc.toJSON();
}

function stringify(value, options) {
  const doc = new Document(options);
  doc.contents = value;
  return String(doc);
}

const YAML = {
  createNode,
  defaultOptions,
  Document,
  parse,
  parseAllDocuments,
  parseCST: _parse.parse,
  parseDocument,
  scalarOptions,
  stringify
};
exports.YAML = YAML;

/***/ }),

/***/ 794:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.BlankLine = void 0;

var _constants = __webpack_require__(383);

var _Node = __webpack_require__(974);

var _Range = __webpack_require__(994);

class BlankLine extends _Node.Node {
  constructor() {
    super(_constants.Type.BLANK_LINE);
  }
  /* istanbul ignore next */


  get includesTrailingLines() {
    // This is never called from anywhere, but if it were,
    // this is the value it should return.
    return true;
  }
  /**
   * Parses a blank line from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first \n character
   * @returns {number} - Index of the character after this
   */


  parse(context, start) {
    this.context = context;
    this.range = new _Range.Range(start, start + 1);
    return start + 1;
  }

}

exports.BlankLine = BlankLine;

/***/ }),

/***/ 796:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var osName = _interopDefault(__webpack_require__(2));

function getUserAgent() {
  try {
    return `Node.js/${process.version.substr(1)} (${osName()}; ${process.arch})`;
  } catch (error) {
    if (/wmic os get Caption/.test(error.message)) {
      return "Windows <version undetectable>";
    }

    return "<environment undetectable>";
  }
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 813:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

async function auth(token) {
  const tokenType = token.split(/\./).length === 3 ? "app" : /^v\d+\./.test(token) ? "installation" : "oauth";
  return {
    type: "token",
    token: token,
    tokenType
  };
}

/**
 * Prefix token for usage in the Authorization header
 *
 * @param token OAuth token or JSON Web Token
 */
function withAuthorizationPrefix(token) {
  if (token.split(/\./).length === 3) {
    return `bearer ${token}`;
  }

  return `token ${token}`;
}

async function hook(token, request, route, parameters) {
  const endpoint = request.endpoint.merge(route, parameters);
  endpoint.headers.authorization = withAuthorizationPrefix(token);
  return request(endpoint);
}

const createTokenAuth = function createTokenAuth(token) {
  if (!token) {
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  }

  if (typeof token !== "string") {
    throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
  }

  token = token.replace(/^(token|bearer) +/i, "");
  return Object.assign(auth.bind(null, token), {
    hook: hook.bind(null, token)
  });
};

exports.createTokenAuth = createTokenAuth;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 814:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = which
which.sync = whichSync

var isWindows = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys'

var path = __webpack_require__(622)
var COLON = isWindows ? ';' : ':'
var isexe = __webpack_require__(742)

function getNotFoundError (cmd) {
  var er = new Error('not found: ' + cmd)
  er.code = 'ENOENT'

  return er
}

function getPathInfo (cmd, opt) {
  var colon = opt.colon || COLON
  var pathEnv = opt.path || process.env.PATH || ''
  var pathExt = ['']

  pathEnv = pathEnv.split(colon)

  var pathExtExe = ''
  if (isWindows) {
    pathEnv.unshift(process.cwd())
    pathExtExe = (opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM')
    pathExt = pathExtExe.split(colon)


    // Always test the cmd itself first.  isexe will check to make sure
    // it's found in the pathExt set.
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
      pathExt.unshift('')
  }

  // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.
  if (cmd.match(/\//) || isWindows && cmd.match(/\\/))
    pathEnv = ['']

  return {
    env: pathEnv,
    ext: pathExt,
    extExe: pathExtExe
  }
}

function which (cmd, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }

  var info = getPathInfo(cmd, opt)
  var pathEnv = info.env
  var pathExt = info.ext
  var pathExtExe = info.extExe
  var found = []

  ;(function F (i, l) {
    if (i === l) {
      if (opt.all && found.length)
        return cb(null, found)
      else
        return cb(getNotFoundError(cmd))
    }

    var pathPart = pathEnv[i]
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
      pathPart = pathPart.slice(1, -1)

    var p = path.join(pathPart, cmd)
    if (!pathPart && (/^\.[\\\/]/).test(cmd)) {
      p = cmd.slice(0, 2) + p
    }
    ;(function E (ii, ll) {
      if (ii === ll) return F(i + 1, l)
      var ext = pathExt[ii]
      isexe(p + ext, { pathExt: pathExtExe }, function (er, is) {
        if (!er && is) {
          if (opt.all)
            found.push(p + ext)
          else
            return cb(null, p + ext)
        }
        return E(ii + 1, ll)
      })
    })(0, pathExt.length)
  })(0, pathEnv.length)
}

function whichSync (cmd, opt) {
  opt = opt || {}

  var info = getPathInfo(cmd, opt)
  var pathEnv = info.env
  var pathExt = info.ext
  var pathExtExe = info.extExe
  var found = []

  for (var i = 0, l = pathEnv.length; i < l; i ++) {
    var pathPart = pathEnv[i]
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
      pathPart = pathPart.slice(1, -1)

    var p = path.join(pathPart, cmd)
    if (!pathPart && /^\.[\\\/]/.test(cmd)) {
      p = cmd.slice(0, 2) + p
    }
    for (var j = 0, ll = pathExt.length; j < ll; j ++) {
      var cur = p + pathExt[j]
      var is
      try {
        is = isexe.sync(cur, { pathExt: pathExtExe })
        if (is) {
          if (opt.all)
            found.push(cur)
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
}


/***/ }),

/***/ 816:
/***/ (function(module) {

"use strict";

module.exports = /^#!.*/;


/***/ }),

/***/ 818:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = isexe
isexe.sync = sync

var fs = __webpack_require__(747)

function checkPathExt (path, options) {
  var pathext = options.pathExt !== undefined ?
    options.pathExt : process.env.PATHEXT

  if (!pathext) {
    return true
  }

  pathext = pathext.split(';')
  if (pathext.indexOf('') !== -1) {
    return true
  }
  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase()
    if (p && path.substr(-p.length).toLowerCase() === p) {
      return true
    }
  }
  return false
}

function checkStat (stat, path, options) {
  if (!stat.isSymbolicLink() && !stat.isFile()) {
    return false
  }
  return checkPathExt(path, options)
}

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, path, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), path, options)
}


/***/ }),

/***/ 821:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.omap = exports.YAMLOMap = void 0;

var _errors = __webpack_require__(405);

var _toJSON = __webpack_require__(923);

var _Map = __webpack_require__(684);

var _Pair = __webpack_require__(325);

var _Scalar = __webpack_require__(515);

var _Seq = __webpack_require__(29);

var _pairs = __webpack_require__(566);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class YAMLOMap extends _Seq.YAMLSeq {
  constructor() {
    super();

    _defineProperty(this, "add", _Map.YAMLMap.prototype.add.bind(this));

    _defineProperty(this, "delete", _Map.YAMLMap.prototype.delete.bind(this));

    _defineProperty(this, "get", _Map.YAMLMap.prototype.get.bind(this));

    _defineProperty(this, "has", _Map.YAMLMap.prototype.has.bind(this));

    _defineProperty(this, "set", _Map.YAMLMap.prototype.set.bind(this));

    this.tag = YAMLOMap.tag;
  }

  toJSON(_, ctx) {
    const map = new Map();
    if (ctx && ctx.onCreate) ctx.onCreate(map);

    for (const pair of this.items) {
      let key, value;

      if (pair instanceof _Pair.Pair) {
        key = (0, _toJSON.toJSON)(pair.key, '', ctx);
        value = (0, _toJSON.toJSON)(pair.value, key, ctx);
      } else {
        key = (0, _toJSON.toJSON)(pair, '', ctx);
      }

      if (map.has(key)) throw new Error('Ordered maps must not include duplicate keys');
      map.set(key, value);
    }

    return map;
  }

}

exports.YAMLOMap = YAMLOMap;

_defineProperty(YAMLOMap, "tag", 'tag:yaml.org,2002:omap');

function parseOMap(doc, cst) {
  const pairs = (0, _pairs.parsePairs)(doc, cst);
  const seenKeys = [];

  for (const {
    key
  } of pairs.items) {
    if (key instanceof _Scalar.Scalar) {
      if (seenKeys.includes(key.value)) {
        const msg = 'Ordered maps must not include duplicate keys';
        throw new _errors.YAMLSemanticError(cst, msg);
      } else {
        seenKeys.push(key.value);
      }
    }
  }

  return Object.assign(new YAMLOMap(), pairs);
}

function createOMap(schema, iterable, ctx) {
  const pairs = (0, _pairs.createPairs)(schema, iterable, ctx);
  const omap = new YAMLOMap();
  omap.items = pairs.items;
  return omap;
}

const omap = {
  identify: value => value instanceof Map,
  nodeClass: YAMLOMap,
  default: false,
  tag: 'tag:yaml.org,2002:omap',
  resolve: parseOMap,
  createNode: createOMap
};
exports.omap = omap;

/***/ }),

/***/ 835:
/***/ (function(module) {

module.exports = require("url");

/***/ }),

/***/ 836:
/***/ (function(__unusedmodule, exports) {

"use strict";


exports.addCommentBefore = addCommentBefore;
exports.addComment = addComment;

function addCommentBefore(str, indent, comment) {
  if (!comment) return str;
  const cc = comment.replace(/[\s\S]^/gm, `$&${indent}#`);
  return `#${cc}\n${indent}${str}`;
}

function addComment(str, indent, comment) {
  return !comment ? str : comment.indexOf('\n') === -1 ? `${str} #${comment}` : `${str}\n` + comment.replace(/^/gm, `${indent || ''}#`);
}

/***/ }),

/***/ 842:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

var deprecation = __webpack_require__(692);

var endpointsByScope = {
  actions: {
    cancelWorkflowRun: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id/cancel"
    },
    createOrUpdateSecretForRepo: {
      method: "PUT",
      params: {
        encrypted_value: {
          type: "string"
        },
        key_id: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/secrets/:name"
    },
    createRegistrationToken: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/runners/registration-token"
    },
    createRemoveToken: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/runners/remove-token"
    },
    deleteArtifact: {
      method: "DELETE",
      params: {
        artifact_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/artifacts/:artifact_id"
    },
    deleteSecretFromRepo: {
      method: "DELETE",
      params: {
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/secrets/:name"
    },
    downloadArtifact: {
      method: "GET",
      params: {
        archive_format: {
          required: true,
          type: "string"
        },
        artifact_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/artifacts/:artifact_id/:archive_format"
    },
    getArtifact: {
      method: "GET",
      params: {
        artifact_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/artifacts/:artifact_id"
    },
    getPublicKey: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/secrets/public-key"
    },
    getSecret: {
      method: "GET",
      params: {
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/secrets/:name"
    },
    getSelfHostedRunner: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        runner_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runners/:runner_id"
    },
    getWorkflow: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        workflow_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/workflows/:workflow_id"
    },
    getWorkflowJob: {
      method: "GET",
      params: {
        job_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/jobs/:job_id"
    },
    getWorkflowRun: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id"
    },
    listDownloadsForSelfHostedRunnerApplication: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/runners/downloads"
    },
    listJobsForWorkflowRun: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id/jobs"
    },
    listRepoWorkflowRuns: {
      method: "GET",
      params: {
        actor: {
          type: "string"
        },
        branch: {
          type: "string"
        },
        event: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        status: {
          enum: ["completed", "status", "conclusion"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/runs"
    },
    listRepoWorkflows: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/workflows"
    },
    listSecretsForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/secrets"
    },
    listSelfHostedRunnersForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/runners"
    },
    listWorkflowJobLogs: {
      method: "GET",
      params: {
        job_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/jobs/:job_id/logs"
    },
    listWorkflowRunArtifacts: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id/artifacts"
    },
    listWorkflowRunLogs: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id/logs"
    },
    listWorkflowRuns: {
      method: "GET",
      params: {
        actor: {
          type: "string"
        },
        branch: {
          type: "string"
        },
        event: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        status: {
          enum: ["completed", "status", "conclusion"],
          type: "string"
        },
        workflow_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/workflows/:workflow_id/runs"
    },
    reRunWorkflow: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id/rerun"
    },
    removeSelfHostedRunner: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        runner_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runners/:runner_id"
    }
  },
  activity: {
    checkStarringRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/user/starred/:owner/:repo"
    },
    deleteRepoSubscription: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/subscription"
    },
    deleteThreadSubscription: {
      method: "DELETE",
      params: {
        thread_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/notifications/threads/:thread_id/subscription"
    },
    getRepoSubscription: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/subscription"
    },
    getThread: {
      method: "GET",
      params: {
        thread_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/notifications/threads/:thread_id"
    },
    getThreadSubscription: {
      method: "GET",
      params: {
        thread_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/notifications/threads/:thread_id/subscription"
    },
    listEventsForOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/events/orgs/:org"
    },
    listEventsForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/events"
    },
    listFeeds: {
      method: "GET",
      params: {},
      url: "/feeds"
    },
    listNotifications: {
      method: "GET",
      params: {
        all: {
          type: "boolean"
        },
        before: {
          type: "string"
        },
        page: {
          type: "integer"
        },
        participating: {
          type: "boolean"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        }
      },
      url: "/notifications"
    },
    listNotificationsForRepo: {
      method: "GET",
      params: {
        all: {
          type: "boolean"
        },
        before: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        participating: {
          type: "boolean"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/notifications"
    },
    listPublicEvents: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/events"
    },
    listPublicEventsForOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/events"
    },
    listPublicEventsForRepoNetwork: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/networks/:owner/:repo/events"
    },
    listPublicEventsForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/events/public"
    },
    listReceivedEventsForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/received_events"
    },
    listReceivedPublicEventsForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/received_events/public"
    },
    listRepoEvents: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/events"
    },
    listReposStarredByAuthenticatedUser: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/user/starred"
    },
    listReposStarredByUser: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/starred"
    },
    listReposWatchedByUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/subscriptions"
    },
    listStargazersForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stargazers"
    },
    listWatchedReposForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/subscriptions"
    },
    listWatchersForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/subscribers"
    },
    markAsRead: {
      method: "PUT",
      params: {
        last_read_at: {
          type: "string"
        }
      },
      url: "/notifications"
    },
    markNotificationsAsReadForRepo: {
      method: "PUT",
      params: {
        last_read_at: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/notifications"
    },
    markThreadAsRead: {
      method: "PATCH",
      params: {
        thread_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/notifications/threads/:thread_id"
    },
    setRepoSubscription: {
      method: "PUT",
      params: {
        ignored: {
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        subscribed: {
          type: "boolean"
        }
      },
      url: "/repos/:owner/:repo/subscription"
    },
    setThreadSubscription: {
      method: "PUT",
      params: {
        ignored: {
          type: "boolean"
        },
        thread_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/notifications/threads/:thread_id/subscription"
    },
    starRepo: {
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/user/starred/:owner/:repo"
    },
    unstarRepo: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/user/starred/:owner/:repo"
    }
  },
  apps: {
    addRepoToInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "PUT",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        },
        repository_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/installations/:installation_id/repositories/:repository_id"
    },
    checkAccountIsAssociatedWithAny: {
      method: "GET",
      params: {
        account_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/marketplace_listing/accounts/:account_id"
    },
    checkAccountIsAssociatedWithAnyStubbed: {
      method: "GET",
      params: {
        account_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/marketplace_listing/stubbed/accounts/:account_id"
    },
    checkAuthorization: {
      deprecated: "octokit.apps.checkAuthorization() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#check-an-authorization",
      method: "GET",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    checkToken: {
      headers: {
        accept: "application/vnd.github.doctor-strange-preview+json"
      },
      method: "POST",
      params: {
        access_token: {
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/token"
    },
    createContentAttachment: {
      headers: {
        accept: "application/vnd.github.corsair-preview+json"
      },
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        content_reference_id: {
          required: true,
          type: "integer"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/content_references/:content_reference_id/attachments"
    },
    createFromManifest: {
      headers: {
        accept: "application/vnd.github.fury-preview+json"
      },
      method: "POST",
      params: {
        code: {
          required: true,
          type: "string"
        }
      },
      url: "/app-manifests/:code/conversions"
    },
    createInstallationToken: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "POST",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        },
        permissions: {
          type: "object"
        },
        repository_ids: {
          type: "integer[]"
        }
      },
      url: "/app/installations/:installation_id/access_tokens"
    },
    deleteAuthorization: {
      headers: {
        accept: "application/vnd.github.doctor-strange-preview+json"
      },
      method: "DELETE",
      params: {
        access_token: {
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/grant"
    },
    deleteInstallation: {
      headers: {
        accept: "application/vnd.github.gambit-preview+json,application/vnd.github.machine-man-preview+json"
      },
      method: "DELETE",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/app/installations/:installation_id"
    },
    deleteToken: {
      headers: {
        accept: "application/vnd.github.doctor-strange-preview+json"
      },
      method: "DELETE",
      params: {
        access_token: {
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/token"
    },
    findOrgInstallation: {
      deprecated: "octokit.apps.findOrgInstallation() has been renamed to octokit.apps.getOrgInstallation() (2019-04-10)",
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/installation"
    },
    findRepoInstallation: {
      deprecated: "octokit.apps.findRepoInstallation() has been renamed to octokit.apps.getRepoInstallation() (2019-04-10)",
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/installation"
    },
    findUserInstallation: {
      deprecated: "octokit.apps.findUserInstallation() has been renamed to octokit.apps.getUserInstallation() (2019-04-10)",
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/installation"
    },
    getAuthenticated: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {},
      url: "/app"
    },
    getBySlug: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        app_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/apps/:app_slug"
    },
    getInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/app/installations/:installation_id"
    },
    getOrgInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/installation"
    },
    getRepoInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/installation"
    },
    getUserInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/installation"
    },
    listAccountsUserOrOrgOnPlan: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        plan_id: {
          required: true,
          type: "integer"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/marketplace_listing/plans/:plan_id/accounts"
    },
    listAccountsUserOrOrgOnPlanStubbed: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        plan_id: {
          required: true,
          type: "integer"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/marketplace_listing/stubbed/plans/:plan_id/accounts"
    },
    listInstallationReposForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/installations/:installation_id/repositories"
    },
    listInstallations: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/app/installations"
    },
    listInstallationsForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/installations"
    },
    listMarketplacePurchasesForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/marketplace_purchases"
    },
    listMarketplacePurchasesForAuthenticatedUserStubbed: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/marketplace_purchases/stubbed"
    },
    listPlans: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/marketplace_listing/plans"
    },
    listPlansStubbed: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/marketplace_listing/stubbed/plans"
    },
    listRepos: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/installation/repositories"
    },
    removeRepoFromInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "DELETE",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        },
        repository_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/installations/:installation_id/repositories/:repository_id"
    },
    resetAuthorization: {
      deprecated: "octokit.apps.resetAuthorization() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#reset-an-authorization",
      method: "POST",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    resetToken: {
      headers: {
        accept: "application/vnd.github.doctor-strange-preview+json"
      },
      method: "PATCH",
      params: {
        access_token: {
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/token"
    },
    revokeAuthorizationForApplication: {
      deprecated: "octokit.apps.revokeAuthorizationForApplication() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#revoke-an-authorization-for-an-application",
      method: "DELETE",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    revokeGrantForApplication: {
      deprecated: "octokit.apps.revokeGrantForApplication() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#revoke-a-grant-for-an-application",
      method: "DELETE",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/grants/:access_token"
    },
    revokeInstallationToken: {
      headers: {
        accept: "application/vnd.github.gambit-preview+json"
      },
      method: "DELETE",
      params: {},
      url: "/installation/token"
    }
  },
  checks: {
    create: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "POST",
      params: {
        actions: {
          type: "object[]"
        },
        "actions[].description": {
          required: true,
          type: "string"
        },
        "actions[].identifier": {
          required: true,
          type: "string"
        },
        "actions[].label": {
          required: true,
          type: "string"
        },
        completed_at: {
          type: "string"
        },
        conclusion: {
          enum: ["success", "failure", "neutral", "cancelled", "timed_out", "action_required"],
          type: "string"
        },
        details_url: {
          type: "string"
        },
        external_id: {
          type: "string"
        },
        head_sha: {
          required: true,
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        output: {
          type: "object"
        },
        "output.annotations": {
          type: "object[]"
        },
        "output.annotations[].annotation_level": {
          enum: ["notice", "warning", "failure"],
          required: true,
          type: "string"
        },
        "output.annotations[].end_column": {
          type: "integer"
        },
        "output.annotations[].end_line": {
          required: true,
          type: "integer"
        },
        "output.annotations[].message": {
          required: true,
          type: "string"
        },
        "output.annotations[].path": {
          required: true,
          type: "string"
        },
        "output.annotations[].raw_details": {
          type: "string"
        },
        "output.annotations[].start_column": {
          type: "integer"
        },
        "output.annotations[].start_line": {
          required: true,
          type: "integer"
        },
        "output.annotations[].title": {
          type: "string"
        },
        "output.images": {
          type: "object[]"
        },
        "output.images[].alt": {
          required: true,
          type: "string"
        },
        "output.images[].caption": {
          type: "string"
        },
        "output.images[].image_url": {
          required: true,
          type: "string"
        },
        "output.summary": {
          required: true,
          type: "string"
        },
        "output.text": {
          type: "string"
        },
        "output.title": {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        started_at: {
          type: "string"
        },
        status: {
          enum: ["queued", "in_progress", "completed"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-runs"
    },
    createSuite: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "POST",
      params: {
        head_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-suites"
    },
    get: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        check_run_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-runs/:check_run_id"
    },
    getSuite: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        check_suite_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-suites/:check_suite_id"
    },
    listAnnotations: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        check_run_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-runs/:check_run_id/annotations"
    },
    listForRef: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        check_name: {
          type: "string"
        },
        filter: {
          enum: ["latest", "all"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        status: {
          enum: ["queued", "in_progress", "completed"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref/check-runs"
    },
    listForSuite: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        check_name: {
          type: "string"
        },
        check_suite_id: {
          required: true,
          type: "integer"
        },
        filter: {
          enum: ["latest", "all"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        status: {
          enum: ["queued", "in_progress", "completed"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-suites/:check_suite_id/check-runs"
    },
    listSuitesForRef: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        app_id: {
          type: "integer"
        },
        check_name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref/check-suites"
    },
    rerequestSuite: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "POST",
      params: {
        check_suite_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-suites/:check_suite_id/rerequest"
    },
    setSuitesPreferences: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "PATCH",
      params: {
        auto_trigger_checks: {
          type: "object[]"
        },
        "auto_trigger_checks[].app_id": {
          required: true,
          type: "integer"
        },
        "auto_trigger_checks[].setting": {
          required: true,
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-suites/preferences"
    },
    update: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "PATCH",
      params: {
        actions: {
          type: "object[]"
        },
        "actions[].description": {
          required: true,
          type: "string"
        },
        "actions[].identifier": {
          required: true,
          type: "string"
        },
        "actions[].label": {
          required: true,
          type: "string"
        },
        check_run_id: {
          required: true,
          type: "integer"
        },
        completed_at: {
          type: "string"
        },
        conclusion: {
          enum: ["success", "failure", "neutral", "cancelled", "timed_out", "action_required"],
          type: "string"
        },
        details_url: {
          type: "string"
        },
        external_id: {
          type: "string"
        },
        name: {
          type: "string"
        },
        output: {
          type: "object"
        },
        "output.annotations": {
          type: "object[]"
        },
        "output.annotations[].annotation_level": {
          enum: ["notice", "warning", "failure"],
          required: true,
          type: "string"
        },
        "output.annotations[].end_column": {
          type: "integer"
        },
        "output.annotations[].end_line": {
          required: true,
          type: "integer"
        },
        "output.annotations[].message": {
          required: true,
          type: "string"
        },
        "output.annotations[].path": {
          required: true,
          type: "string"
        },
        "output.annotations[].raw_details": {
          type: "string"
        },
        "output.annotations[].start_column": {
          type: "integer"
        },
        "output.annotations[].start_line": {
          required: true,
          type: "integer"
        },
        "output.annotations[].title": {
          type: "string"
        },
        "output.images": {
          type: "object[]"
        },
        "output.images[].alt": {
          required: true,
          type: "string"
        },
        "output.images[].caption": {
          type: "string"
        },
        "output.images[].image_url": {
          required: true,
          type: "string"
        },
        "output.summary": {
          required: true,
          type: "string"
        },
        "output.text": {
          type: "string"
        },
        "output.title": {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        started_at: {
          type: "string"
        },
        status: {
          enum: ["queued", "in_progress", "completed"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-runs/:check_run_id"
    }
  },
  codesOfConduct: {
    getConductCode: {
      headers: {
        accept: "application/vnd.github.scarlet-witch-preview+json"
      },
      method: "GET",
      params: {
        key: {
          required: true,
          type: "string"
        }
      },
      url: "/codes_of_conduct/:key"
    },
    getForRepo: {
      headers: {
        accept: "application/vnd.github.scarlet-witch-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/community/code_of_conduct"
    },
    listConductCodes: {
      headers: {
        accept: "application/vnd.github.scarlet-witch-preview+json"
      },
      method: "GET",
      params: {},
      url: "/codes_of_conduct"
    }
  },
  emojis: {
    get: {
      method: "GET",
      params: {},
      url: "/emojis"
    }
  },
  gists: {
    checkIsStarred: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/star"
    },
    create: {
      method: "POST",
      params: {
        description: {
          type: "string"
        },
        files: {
          required: true,
          type: "object"
        },
        "files.content": {
          type: "string"
        },
        public: {
          type: "boolean"
        }
      },
      url: "/gists"
    },
    createComment: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/comments"
    },
    delete: {
      method: "DELETE",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id"
    },
    deleteComment: {
      method: "DELETE",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/comments/:comment_id"
    },
    fork: {
      method: "POST",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/forks"
    },
    get: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id"
    },
    getComment: {
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/comments/:comment_id"
    },
    getRevision: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        },
        sha: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/:sha"
    },
    list: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        }
      },
      url: "/gists"
    },
    listComments: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/gists/:gist_id/comments"
    },
    listCommits: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/gists/:gist_id/commits"
    },
    listForks: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/gists/:gist_id/forks"
    },
    listPublic: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        }
      },
      url: "/gists/public"
    },
    listPublicForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/gists"
    },
    listStarred: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        }
      },
      url: "/gists/starred"
    },
    star: {
      method: "PUT",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/star"
    },
    unstar: {
      method: "DELETE",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/star"
    },
    update: {
      method: "PATCH",
      params: {
        description: {
          type: "string"
        },
        files: {
          type: "object"
        },
        "files.content": {
          type: "string"
        },
        "files.filename": {
          type: "string"
        },
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id"
    },
    updateComment: {
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_id: {
          required: true,
          type: "integer"
        },
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/comments/:comment_id"
    }
  },
  git: {
    createBlob: {
      method: "POST",
      params: {
        content: {
          required: true,
          type: "string"
        },
        encoding: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/blobs"
    },
    createCommit: {
      method: "POST",
      params: {
        author: {
          type: "object"
        },
        "author.date": {
          type: "string"
        },
        "author.email": {
          type: "string"
        },
        "author.name": {
          type: "string"
        },
        committer: {
          type: "object"
        },
        "committer.date": {
          type: "string"
        },
        "committer.email": {
          type: "string"
        },
        "committer.name": {
          type: "string"
        },
        message: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        parents: {
          required: true,
          type: "string[]"
        },
        repo: {
          required: true,
          type: "string"
        },
        signature: {
          type: "string"
        },
        tree: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/commits"
    },
    createRef: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/refs"
    },
    createTag: {
      method: "POST",
      params: {
        message: {
          required: true,
          type: "string"
        },
        object: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        tag: {
          required: true,
          type: "string"
        },
        tagger: {
          type: "object"
        },
        "tagger.date": {
          type: "string"
        },
        "tagger.email": {
          type: "string"
        },
        "tagger.name": {
          type: "string"
        },
        type: {
          enum: ["commit", "tree", "blob"],
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/tags"
    },
    createTree: {
      method: "POST",
      params: {
        base_tree: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        tree: {
          required: true,
          type: "object[]"
        },
        "tree[].content": {
          type: "string"
        },
        "tree[].mode": {
          enum: ["100644", "100755", "040000", "160000", "120000"],
          type: "string"
        },
        "tree[].path": {
          type: "string"
        },
        "tree[].sha": {
          allowNull: true,
          type: "string"
        },
        "tree[].type": {
          enum: ["blob", "tree", "commit"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/trees"
    },
    deleteRef: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/refs/:ref"
    },
    getBlob: {
      method: "GET",
      params: {
        file_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/blobs/:file_sha"
    },
    getCommit: {
      method: "GET",
      params: {
        commit_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/commits/:commit_sha"
    },
    getRef: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/ref/:ref"
    },
    getTag: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        tag_sha: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/tags/:tag_sha"
    },
    getTree: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        recursive: {
          enum: ["1"],
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        tree_sha: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/trees/:tree_sha"
    },
    listMatchingRefs: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/matching-refs/:ref"
    },
    listRefs: {
      method: "GET",
      params: {
        namespace: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/refs/:namespace"
    },
    updateRef: {
      method: "PATCH",
      params: {
        force: {
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/refs/:ref"
    }
  },
  gitignore: {
    getTemplate: {
      method: "GET",
      params: {
        name: {
          required: true,
          type: "string"
        }
      },
      url: "/gitignore/templates/:name"
    },
    listTemplates: {
      method: "GET",
      params: {},
      url: "/gitignore/templates"
    }
  },
  interactions: {
    addOrUpdateRestrictionsForOrg: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "PUT",
      params: {
        limit: {
          enum: ["existing_users", "contributors_only", "collaborators_only"],
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/interaction-limits"
    },
    addOrUpdateRestrictionsForRepo: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "PUT",
      params: {
        limit: {
          enum: ["existing_users", "contributors_only", "collaborators_only"],
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/interaction-limits"
    },
    getRestrictionsForOrg: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/interaction-limits"
    },
    getRestrictionsForRepo: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/interaction-limits"
    },
    removeRestrictionsForOrg: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/interaction-limits"
    },
    removeRestrictionsForRepo: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/interaction-limits"
    }
  },
  issues: {
    addAssignees: {
      method: "POST",
      params: {
        assignees: {
          type: "string[]"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/assignees"
    },
    addLabels: {
      method: "POST",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        labels: {
          required: true,
          type: "string[]"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/labels"
    },
    checkAssignee: {
      method: "GET",
      params: {
        assignee: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/assignees/:assignee"
    },
    create: {
      method: "POST",
      params: {
        assignee: {
          type: "string"
        },
        assignees: {
          type: "string[]"
        },
        body: {
          type: "string"
        },
        labels: {
          type: "string[]"
        },
        milestone: {
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues"
    },
    createComment: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/comments"
    },
    createLabel: {
      method: "POST",
      params: {
        color: {
          required: true,
          type: "string"
        },
        description: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/labels"
    },
    createMilestone: {
      method: "POST",
      params: {
        description: {
          type: "string"
        },
        due_on: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["open", "closed"],
          type: "string"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones"
    },
    deleteComment: {
      method: "DELETE",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments/:comment_id"
    },
    deleteLabel: {
      method: "DELETE",
      params: {
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/labels/:name"
    },
    deleteMilestone: {
      method: "DELETE",
      params: {
        milestone_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "milestone_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones/:milestone_number"
    },
    get: {
      method: "GET",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number"
    },
    getComment: {
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments/:comment_id"
    },
    getEvent: {
      method: "GET",
      params: {
        event_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/events/:event_id"
    },
    getLabel: {
      method: "GET",
      params: {
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/labels/:name"
    },
    getMilestone: {
      method: "GET",
      params: {
        milestone_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "milestone_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones/:milestone_number"
    },
    list: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        filter: {
          enum: ["assigned", "created", "mentioned", "subscribed", "all"],
          type: "string"
        },
        labels: {
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated", "comments"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/issues"
    },
    listAssignees: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/assignees"
    },
    listComments: {
      method: "GET",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/comments"
    },
    listCommentsForRepo: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments"
    },
    listEvents: {
      method: "GET",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/events"
    },
    listEventsForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/events"
    },
    listEventsForTimeline: {
      headers: {
        accept: "application/vnd.github.mockingbird-preview+json"
      },
      method: "GET",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/timeline"
    },
    listForAuthenticatedUser: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        filter: {
          enum: ["assigned", "created", "mentioned", "subscribed", "all"],
          type: "string"
        },
        labels: {
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated", "comments"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/user/issues"
    },
    listForOrg: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        filter: {
          enum: ["assigned", "created", "mentioned", "subscribed", "all"],
          type: "string"
        },
        labels: {
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated", "comments"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/orgs/:org/issues"
    },
    listForRepo: {
      method: "GET",
      params: {
        assignee: {
          type: "string"
        },
        creator: {
          type: "string"
        },
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        labels: {
          type: "string"
        },
        mentioned: {
          type: "string"
        },
        milestone: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated", "comments"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues"
    },
    listLabelsForMilestone: {
      method: "GET",
      params: {
        milestone_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "milestone_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones/:milestone_number/labels"
    },
    listLabelsForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/labels"
    },
    listLabelsOnIssue: {
      method: "GET",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/labels"
    },
    listMilestonesForRepo: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["due_on", "completeness"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones"
    },
    lock: {
      method: "PUT",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        lock_reason: {
          enum: ["off-topic", "too heated", "resolved", "spam"],
          type: "string"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/lock"
    },
    removeAssignees: {
      method: "DELETE",
      params: {
        assignees: {
          type: "string[]"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/assignees"
    },
    removeLabel: {
      method: "DELETE",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        name: {
          required: true,
          type: "string"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/labels/:name"
    },
    removeLabels: {
      method: "DELETE",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/labels"
    },
    replaceLabels: {
      method: "PUT",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        labels: {
          type: "string[]"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/labels"
    },
    unlock: {
      method: "DELETE",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/lock"
    },
    update: {
      method: "PATCH",
      params: {
        assignee: {
          type: "string"
        },
        assignees: {
          type: "string[]"
        },
        body: {
          type: "string"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        labels: {
          type: "string[]"
        },
        milestone: {
          allowNull: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["open", "closed"],
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number"
    },
    updateComment: {
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments/:comment_id"
    },
    updateLabel: {
      method: "PATCH",
      params: {
        color: {
          type: "string"
        },
        current_name: {
          required: true,
          type: "string"
        },
        description: {
          type: "string"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/labels/:current_name"
    },
    updateMilestone: {
      method: "PATCH",
      params: {
        description: {
          type: "string"
        },
        due_on: {
          type: "string"
        },
        milestone_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "milestone_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["open", "closed"],
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones/:milestone_number"
    }
  },
  licenses: {
    get: {
      method: "GET",
      params: {
        license: {
          required: true,
          type: "string"
        }
      },
      url: "/licenses/:license"
    },
    getForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/license"
    },
    list: {
      deprecated: "octokit.licenses.list() has been renamed to octokit.licenses.listCommonlyUsed() (2019-03-05)",
      method: "GET",
      params: {},
      url: "/licenses"
    },
    listCommonlyUsed: {
      method: "GET",
      params: {},
      url: "/licenses"
    }
  },
  markdown: {
    render: {
      method: "POST",
      params: {
        context: {
          type: "string"
        },
        mode: {
          enum: ["markdown", "gfm"],
          type: "string"
        },
        text: {
          required: true,
          type: "string"
        }
      },
      url: "/markdown"
    },
    renderRaw: {
      headers: {
        "content-type": "text/plain; charset=utf-8"
      },
      method: "POST",
      params: {
        data: {
          mapTo: "data",
          required: true,
          type: "string"
        }
      },
      url: "/markdown/raw"
    }
  },
  meta: {
    get: {
      method: "GET",
      params: {},
      url: "/meta"
    }
  },
  migrations: {
    cancelImport: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import"
    },
    deleteArchiveForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "DELETE",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/migrations/:migration_id/archive"
    },
    deleteArchiveForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "DELETE",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/migrations/:migration_id/archive"
    },
    downloadArchiveForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/migrations/:migration_id/archive"
    },
    getArchiveForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/migrations/:migration_id/archive"
    },
    getArchiveForOrg: {
      deprecated: "octokit.migrations.getArchiveForOrg() has been renamed to octokit.migrations.downloadArchiveForOrg() (2020-01-27)",
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/migrations/:migration_id/archive"
    },
    getCommitAuthors: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import/authors"
    },
    getImportProgress: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import"
    },
    getLargeFiles: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import/large_files"
    },
    getStatusForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/migrations/:migration_id"
    },
    getStatusForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/migrations/:migration_id"
    },
    listForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/migrations"
    },
    listForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/migrations"
    },
    listReposForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/migrations/:migration_id/repositories"
    },
    listReposForUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/:migration_id/repositories"
    },
    mapCommitAuthor: {
      method: "PATCH",
      params: {
        author_id: {
          required: true,
          type: "integer"
        },
        email: {
          type: "string"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import/authors/:author_id"
    },
    setLfsPreference: {
      method: "PATCH",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        use_lfs: {
          enum: ["opt_in", "opt_out"],
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import/lfs"
    },
    startForAuthenticatedUser: {
      method: "POST",
      params: {
        exclude_attachments: {
          type: "boolean"
        },
        lock_repositories: {
          type: "boolean"
        },
        repositories: {
          required: true,
          type: "string[]"
        }
      },
      url: "/user/migrations"
    },
    startForOrg: {
      method: "POST",
      params: {
        exclude_attachments: {
          type: "boolean"
        },
        lock_repositories: {
          type: "boolean"
        },
        org: {
          required: true,
          type: "string"
        },
        repositories: {
          required: true,
          type: "string[]"
        }
      },
      url: "/orgs/:org/migrations"
    },
    startImport: {
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        tfvc_project: {
          type: "string"
        },
        vcs: {
          enum: ["subversion", "git", "mercurial", "tfvc"],
          type: "string"
        },
        vcs_password: {
          type: "string"
        },
        vcs_url: {
          required: true,
          type: "string"
        },
        vcs_username: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import"
    },
    unlockRepoForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "DELETE",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        repo_name: {
          required: true,
          type: "string"
        }
      },
      url: "/user/migrations/:migration_id/repos/:repo_name/lock"
    },
    unlockRepoForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "DELETE",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        repo_name: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/migrations/:migration_id/repos/:repo_name/lock"
    },
    updateImport: {
      method: "PATCH",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        vcs_password: {
          type: "string"
        },
        vcs_username: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import"
    }
  },
  oauthAuthorizations: {
    checkAuthorization: {
      deprecated: "octokit.oauthAuthorizations.checkAuthorization() has been renamed to octokit.apps.checkAuthorization() (2019-11-05)",
      method: "GET",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    createAuthorization: {
      deprecated: "octokit.oauthAuthorizations.createAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization",
      method: "POST",
      params: {
        client_id: {
          type: "string"
        },
        client_secret: {
          type: "string"
        },
        fingerprint: {
          type: "string"
        },
        note: {
          required: true,
          type: "string"
        },
        note_url: {
          type: "string"
        },
        scopes: {
          type: "string[]"
        }
      },
      url: "/authorizations"
    },
    deleteAuthorization: {
      deprecated: "octokit.oauthAuthorizations.deleteAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#delete-an-authorization",
      method: "DELETE",
      params: {
        authorization_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/authorizations/:authorization_id"
    },
    deleteGrant: {
      deprecated: "octokit.oauthAuthorizations.deleteGrant() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#delete-a-grant",
      method: "DELETE",
      params: {
        grant_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/applications/grants/:grant_id"
    },
    getAuthorization: {
      deprecated: "octokit.oauthAuthorizations.getAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-a-single-authorization",
      method: "GET",
      params: {
        authorization_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/authorizations/:authorization_id"
    },
    getGrant: {
      deprecated: "octokit.oauthAuthorizations.getGrant() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-a-single-grant",
      method: "GET",
      params: {
        grant_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/applications/grants/:grant_id"
    },
    getOrCreateAuthorizationForApp: {
      deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForApp() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app",
      method: "PUT",
      params: {
        client_id: {
          required: true,
          type: "string"
        },
        client_secret: {
          required: true,
          type: "string"
        },
        fingerprint: {
          type: "string"
        },
        note: {
          type: "string"
        },
        note_url: {
          type: "string"
        },
        scopes: {
          type: "string[]"
        }
      },
      url: "/authorizations/clients/:client_id"
    },
    getOrCreateAuthorizationForAppAndFingerprint: {
      deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app-and-fingerprint",
      method: "PUT",
      params: {
        client_id: {
          required: true,
          type: "string"
        },
        client_secret: {
          required: true,
          type: "string"
        },
        fingerprint: {
          required: true,
          type: "string"
        },
        note: {
          type: "string"
        },
        note_url: {
          type: "string"
        },
        scopes: {
          type: "string[]"
        }
      },
      url: "/authorizations/clients/:client_id/:fingerprint"
    },
    getOrCreateAuthorizationForAppFingerprint: {
      deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForAppFingerprint() has been renamed to octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() (2018-12-27)",
      method: "PUT",
      params: {
        client_id: {
          required: true,
          type: "string"
        },
        client_secret: {
          required: true,
          type: "string"
        },
        fingerprint: {
          required: true,
          type: "string"
        },
        note: {
          type: "string"
        },
        note_url: {
          type: "string"
        },
        scopes: {
          type: "string[]"
        }
      },
      url: "/authorizations/clients/:client_id/:fingerprint"
    },
    listAuthorizations: {
      deprecated: "octokit.oauthAuthorizations.listAuthorizations() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#list-your-authorizations",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/authorizations"
    },
    listGrants: {
      deprecated: "octokit.oauthAuthorizations.listGrants() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#list-your-grants",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/applications/grants"
    },
    resetAuthorization: {
      deprecated: "octokit.oauthAuthorizations.resetAuthorization() has been renamed to octokit.apps.resetAuthorization() (2019-11-05)",
      method: "POST",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    revokeAuthorizationForApplication: {
      deprecated: "octokit.oauthAuthorizations.revokeAuthorizationForApplication() has been renamed to octokit.apps.revokeAuthorizationForApplication() (2019-11-05)",
      method: "DELETE",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    revokeGrantForApplication: {
      deprecated: "octokit.oauthAuthorizations.revokeGrantForApplication() has been renamed to octokit.apps.revokeGrantForApplication() (2019-11-05)",
      method: "DELETE",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/grants/:access_token"
    },
    updateAuthorization: {
      deprecated: "octokit.oauthAuthorizations.updateAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#update-an-existing-authorization",
      method: "PATCH",
      params: {
        add_scopes: {
          type: "string[]"
        },
        authorization_id: {
          required: true,
          type: "integer"
        },
        fingerprint: {
          type: "string"
        },
        note: {
          type: "string"
        },
        note_url: {
          type: "string"
        },
        remove_scopes: {
          type: "string[]"
        },
        scopes: {
          type: "string[]"
        }
      },
      url: "/authorizations/:authorization_id"
    }
  },
  orgs: {
    addOrUpdateMembership: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        role: {
          enum: ["admin", "member"],
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/memberships/:username"
    },
    blockUser: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/blocks/:username"
    },
    checkBlockedUser: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/blocks/:username"
    },
    checkMembership: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/members/:username"
    },
    checkPublicMembership: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/public_members/:username"
    },
    concealMembership: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/public_members/:username"
    },
    convertMemberToOutsideCollaborator: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/outside_collaborators/:username"
    },
    createHook: {
      method: "POST",
      params: {
        active: {
          type: "boolean"
        },
        config: {
          required: true,
          type: "object"
        },
        "config.content_type": {
          type: "string"
        },
        "config.insecure_ssl": {
          type: "string"
        },
        "config.secret": {
          type: "string"
        },
        "config.url": {
          required: true,
          type: "string"
        },
        events: {
          type: "string[]"
        },
        name: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/hooks"
    },
    createInvitation: {
      method: "POST",
      params: {
        email: {
          type: "string"
        },
        invitee_id: {
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        role: {
          enum: ["admin", "direct_member", "billing_manager"],
          type: "string"
        },
        team_ids: {
          type: "integer[]"
        }
      },
      url: "/orgs/:org/invitations"
    },
    deleteHook: {
      method: "DELETE",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/hooks/:hook_id"
    },
    get: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org"
    },
    getHook: {
      method: "GET",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/hooks/:hook_id"
    },
    getMembership: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/memberships/:username"
    },
    getMembershipForAuthenticatedUser: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/user/memberships/orgs/:org"
    },
    list: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "integer"
        }
      },
      url: "/organizations"
    },
    listBlockedUsers: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/blocks"
    },
    listForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/orgs"
    },
    listForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/orgs"
    },
    listHooks: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/hooks"
    },
    listInstallations: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/installations"
    },
    listInvitationTeams: {
      method: "GET",
      params: {
        invitation_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/invitations/:invitation_id/teams"
    },
    listMembers: {
      method: "GET",
      params: {
        filter: {
          enum: ["2fa_disabled", "all"],
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        role: {
          enum: ["all", "admin", "member"],
          type: "string"
        }
      },
      url: "/orgs/:org/members"
    },
    listMemberships: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        state: {
          enum: ["active", "pending"],
          type: "string"
        }
      },
      url: "/user/memberships/orgs"
    },
    listOutsideCollaborators: {
      method: "GET",
      params: {
        filter: {
          enum: ["2fa_disabled", "all"],
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/outside_collaborators"
    },
    listPendingInvitations: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/invitations"
    },
    listPublicMembers: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/public_members"
    },
    pingHook: {
      method: "POST",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/hooks/:hook_id/pings"
    },
    publicizeMembership: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/public_members/:username"
    },
    removeMember: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/members/:username"
    },
    removeMembership: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/memberships/:username"
    },
    removeOutsideCollaborator: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/outside_collaborators/:username"
    },
    unblockUser: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/blocks/:username"
    },
    update: {
      method: "PATCH",
      params: {
        billing_email: {
          type: "string"
        },
        company: {
          type: "string"
        },
        default_repository_permission: {
          enum: ["read", "write", "admin", "none"],
          type: "string"
        },
        description: {
          type: "string"
        },
        email: {
          type: "string"
        },
        has_organization_projects: {
          type: "boolean"
        },
        has_repository_projects: {
          type: "boolean"
        },
        location: {
          type: "string"
        },
        members_allowed_repository_creation_type: {
          enum: ["all", "private", "none"],
          type: "string"
        },
        members_can_create_internal_repositories: {
          type: "boolean"
        },
        members_can_create_private_repositories: {
          type: "boolean"
        },
        members_can_create_public_repositories: {
          type: "boolean"
        },
        members_can_create_repositories: {
          type: "boolean"
        },
        name: {
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org"
    },
    updateHook: {
      method: "PATCH",
      params: {
        active: {
          type: "boolean"
        },
        config: {
          type: "object"
        },
        "config.content_type": {
          type: "string"
        },
        "config.insecure_ssl": {
          type: "string"
        },
        "config.secret": {
          type: "string"
        },
        "config.url": {
          required: true,
          type: "string"
        },
        events: {
          type: "string[]"
        },
        hook_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/hooks/:hook_id"
    },
    updateMembership: {
      method: "PATCH",
      params: {
        org: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["active"],
          required: true,
          type: "string"
        }
      },
      url: "/user/memberships/orgs/:org"
    }
  },
  projects: {
    addCollaborator: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PUT",
      params: {
        permission: {
          enum: ["read", "write", "admin"],
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/projects/:project_id/collaborators/:username"
    },
    createCard: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        column_id: {
          required: true,
          type: "integer"
        },
        content_id: {
          type: "integer"
        },
        content_type: {
          type: "string"
        },
        note: {
          type: "string"
        }
      },
      url: "/projects/columns/:column_id/cards"
    },
    createColumn: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        name: {
          required: true,
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/:project_id/columns"
    },
    createForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        }
      },
      url: "/user/projects"
    },
    createForOrg: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/projects"
    },
    createForRepo: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/projects"
    },
    delete: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "DELETE",
      params: {
        project_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/:project_id"
    },
    deleteCard: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "DELETE",
      params: {
        card_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/columns/cards/:card_id"
    },
    deleteColumn: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "DELETE",
      params: {
        column_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/columns/:column_id"
    },
    get: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        project_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/:project_id"
    },
    getCard: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        card_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/columns/cards/:card_id"
    },
    getColumn: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        column_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/columns/:column_id"
    },
    listCards: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        archived_state: {
          enum: ["all", "archived", "not_archived"],
          type: "string"
        },
        column_id: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/projects/columns/:column_id/cards"
    },
    listCollaborators: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        affiliation: {
          enum: ["outside", "direct", "all"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        project_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/:project_id/collaborators"
    },
    listColumns: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        project_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/:project_id/columns"
    },
    listForOrg: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/orgs/:org/projects"
    },
    listForRepo: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/projects"
    },
    listForUser: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/projects"
    },
    moveCard: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        card_id: {
          required: true,
          type: "integer"
        },
        column_id: {
          type: "integer"
        },
        position: {
          required: true,
          type: "string",
          validation: "^(top|bottom|after:\\d+)$"
        }
      },
      url: "/projects/columns/cards/:card_id/moves"
    },
    moveColumn: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        column_id: {
          required: true,
          type: "integer"
        },
        position: {
          required: true,
          type: "string",
          validation: "^(first|last|after:\\d+)$"
        }
      },
      url: "/projects/columns/:column_id/moves"
    },
    removeCollaborator: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "DELETE",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/projects/:project_id/collaborators/:username"
    },
    reviewUserPermissionLevel: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/projects/:project_id/collaborators/:username/permission"
    },
    update: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PATCH",
      params: {
        body: {
          type: "string"
        },
        name: {
          type: "string"
        },
        organization_permission: {
          type: "string"
        },
        private: {
          type: "boolean"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        state: {
          enum: ["open", "closed"],
          type: "string"
        }
      },
      url: "/projects/:project_id"
    },
    updateCard: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PATCH",
      params: {
        archived: {
          type: "boolean"
        },
        card_id: {
          required: true,
          type: "integer"
        },
        note: {
          type: "string"
        }
      },
      url: "/projects/columns/cards/:card_id"
    },
    updateColumn: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PATCH",
      params: {
        column_id: {
          required: true,
          type: "integer"
        },
        name: {
          required: true,
          type: "string"
        }
      },
      url: "/projects/columns/:column_id"
    }
  },
  pulls: {
    checkIfMerged: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/merge"
    },
    create: {
      method: "POST",
      params: {
        base: {
          required: true,
          type: "string"
        },
        body: {
          type: "string"
        },
        draft: {
          type: "boolean"
        },
        head: {
          required: true,
          type: "string"
        },
        maintainer_can_modify: {
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls"
    },
    createComment: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        commit_id: {
          required: true,
          type: "string"
        },
        in_reply_to: {
          deprecated: true,
          description: "The comment ID to reply to. **Note**: This must be the ID of a top-level comment, not a reply to that comment. Replies to replies are not supported.",
          type: "integer"
        },
        line: {
          type: "integer"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        position: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        side: {
          enum: ["LEFT", "RIGHT"],
          type: "string"
        },
        start_line: {
          type: "integer"
        },
        start_side: {
          enum: ["LEFT", "RIGHT", "side"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/comments"
    },
    createCommentReply: {
      deprecated: "octokit.pulls.createCommentReply() has been renamed to octokit.pulls.createComment() (2019-09-09)",
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        commit_id: {
          required: true,
          type: "string"
        },
        in_reply_to: {
          deprecated: true,
          description: "The comment ID to reply to. **Note**: This must be the ID of a top-level comment, not a reply to that comment. Replies to replies are not supported.",
          type: "integer"
        },
        line: {
          type: "integer"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        position: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        side: {
          enum: ["LEFT", "RIGHT"],
          type: "string"
        },
        start_line: {
          type: "integer"
        },
        start_side: {
          enum: ["LEFT", "RIGHT", "side"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/comments"
    },
    createFromIssue: {
      deprecated: "octokit.pulls.createFromIssue() is deprecated, see https://developer.github.com/v3/pulls/#create-a-pull-request",
      method: "POST",
      params: {
        base: {
          required: true,
          type: "string"
        },
        draft: {
          type: "boolean"
        },
        head: {
          required: true,
          type: "string"
        },
        issue: {
          required: true,
          type: "integer"
        },
        maintainer_can_modify: {
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls"
    },
    createReview: {
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        comments: {
          type: "object[]"
        },
        "comments[].body": {
          required: true,
          type: "string"
        },
        "comments[].path": {
          required: true,
          type: "string"
        },
        "comments[].position": {
          required: true,
          type: "integer"
        },
        commit_id: {
          type: "string"
        },
        event: {
          enum: ["APPROVE", "REQUEST_CHANGES", "COMMENT"],
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews"
    },
    createReviewCommentReply: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/comments/:comment_id/replies"
    },
    createReviewRequest: {
      method: "POST",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        reviewers: {
          type: "string[]"
        },
        team_reviewers: {
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
    },
    deleteComment: {
      method: "DELETE",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments/:comment_id"
    },
    deletePendingReview: {
      method: "DELETE",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
    },
    deleteReviewRequest: {
      method: "DELETE",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        reviewers: {
          type: "string[]"
        },
        team_reviewers: {
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
    },
    dismissReview: {
      method: "PUT",
      params: {
        message: {
          required: true,
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/dismissals"
    },
    get: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number"
    },
    getComment: {
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments/:comment_id"
    },
    getCommentsForReview: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/comments"
    },
    getReview: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
    },
    list: {
      method: "GET",
      params: {
        base: {
          type: "string"
        },
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        head: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["created", "updated", "popularity", "long-running"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls"
    },
    listComments: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/comments"
    },
    listCommentsForRepo: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments"
    },
    listCommits: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/commits"
    },
    listFiles: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/files"
    },
    listReviewRequests: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
    },
    listReviews: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews"
    },
    merge: {
      method: "PUT",
      params: {
        commit_message: {
          type: "string"
        },
        commit_title: {
          type: "string"
        },
        merge_method: {
          enum: ["merge", "squash", "rebase"],
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/merge"
    },
    submitReview: {
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        event: {
          enum: ["APPROVE", "REQUEST_CHANGES", "COMMENT"],
          required: true,
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/events"
    },
    update: {
      method: "PATCH",
      params: {
        base: {
          type: "string"
        },
        body: {
          type: "string"
        },
        maintainer_can_modify: {
          type: "boolean"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["open", "closed"],
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number"
    },
    updateBranch: {
      headers: {
        accept: "application/vnd.github.lydian-preview+json"
      },
      method: "PUT",
      params: {
        expected_head_sha: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/update-branch"
    },
    updateComment: {
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments/:comment_id"
    },
    updateReview: {
      method: "PUT",
      params: {
        body: {
          required: true,
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
    }
  },
  rateLimit: {
    get: {
      method: "GET",
      params: {},
      url: "/rate_limit"
    }
  },
  reactions: {
    createForCommitComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments/:comment_id/reactions"
    },
    createForIssue: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/reactions"
    },
    createForIssueComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments/:comment_id/reactions"
    },
    createForPullRequestReviewComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments/:comment_id/reactions"
    },
    createForTeamDiscussion: {
      deprecated: "octokit.reactions.createForTeamDiscussion() has been renamed to octokit.reactions.createForTeamDiscussionLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/reactions"
    },
    createForTeamDiscussionComment: {
      deprecated: "octokit.reactions.createForTeamDiscussionComment() has been renamed to octokit.reactions.createForTeamDiscussionCommentLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    createForTeamDiscussionCommentInOrg: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    createForTeamDiscussionCommentLegacy: {
      deprecated: "octokit.reactions.createForTeamDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/reactions/#create-reaction-for-a-team-discussion-comment-legacy",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    createForTeamDiscussionInOrg: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/reactions"
    },
    createForTeamDiscussionLegacy: {
      deprecated: "octokit.reactions.createForTeamDiscussionLegacy() is deprecated, see https://developer.github.com/v3/reactions/#create-reaction-for-a-team-discussion-legacy",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/reactions"
    },
    delete: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "DELETE",
      params: {
        reaction_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/reactions/:reaction_id"
    },
    listForCommitComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments/:comment_id/reactions"
    },
    listForIssue: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/reactions"
    },
    listForIssueComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments/:comment_id/reactions"
    },
    listForPullRequestReviewComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments/:comment_id/reactions"
    },
    listForTeamDiscussion: {
      deprecated: "octokit.reactions.listForTeamDiscussion() has been renamed to octokit.reactions.listForTeamDiscussionLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/reactions"
    },
    listForTeamDiscussionComment: {
      deprecated: "octokit.reactions.listForTeamDiscussionComment() has been renamed to octokit.reactions.listForTeamDiscussionCommentLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    listForTeamDiscussionCommentInOrg: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    listForTeamDiscussionCommentLegacy: {
      deprecated: "octokit.reactions.listForTeamDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/reactions/#list-reactions-for-a-team-discussion-comment-legacy",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    listForTeamDiscussionInOrg: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/reactions"
    },
    listForTeamDiscussionLegacy: {
      deprecated: "octokit.reactions.listForTeamDiscussionLegacy() is deprecated, see https://developer.github.com/v3/reactions/#list-reactions-for-a-team-discussion-legacy",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/reactions"
    }
  },
  repos: {
    acceptInvitation: {
      method: "PATCH",
      params: {
        invitation_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/repository_invitations/:invitation_id"
    },
    addCollaborator: {
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/collaborators/:username"
    },
    addDeployKey: {
      method: "POST",
      params: {
        key: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        read_only: {
          type: "boolean"
        },
        repo: {
          required: true,
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/keys"
    },
    addProtectedBranchAdminEnforcement: {
      method: "POST",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
    },
    addProtectedBranchAppRestrictions: {
      method: "POST",
      params: {
        apps: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
    },
    addProtectedBranchRequiredSignatures: {
      headers: {
        accept: "application/vnd.github.zzzax-preview+json"
      },
      method: "POST",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
    },
    addProtectedBranchRequiredStatusChecksContexts: {
      method: "POST",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        contexts: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
    },
    addProtectedBranchTeamRestrictions: {
      method: "POST",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        teams: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    addProtectedBranchUserRestrictions: {
      method: "POST",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        users: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    checkCollaborator: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/collaborators/:username"
    },
    checkVulnerabilityAlerts: {
      headers: {
        accept: "application/vnd.github.dorian-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/vulnerability-alerts"
    },
    compareCommits: {
      method: "GET",
      params: {
        base: {
          required: true,
          type: "string"
        },
        head: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/compare/:base...:head"
    },
    createCommitComment: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        commit_sha: {
          required: true,
          type: "string"
        },
        line: {
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          type: "string"
        },
        position: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          alias: "commit_sha",
          deprecated: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:commit_sha/comments"
    },
    createDeployment: {
      method: "POST",
      params: {
        auto_merge: {
          type: "boolean"
        },
        description: {
          type: "string"
        },
        environment: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        payload: {
          type: "string"
        },
        production_environment: {
          type: "boolean"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        required_contexts: {
          type: "string[]"
        },
        task: {
          type: "string"
        },
        transient_environment: {
          type: "boolean"
        }
      },
      url: "/repos/:owner/:repo/deployments"
    },
    createDeploymentStatus: {
      method: "POST",
      params: {
        auto_inactive: {
          type: "boolean"
        },
        deployment_id: {
          required: true,
          type: "integer"
        },
        description: {
          type: "string"
        },
        environment: {
          enum: ["production", "staging", "qa"],
          type: "string"
        },
        environment_url: {
          type: "string"
        },
        log_url: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["error", "failure", "inactive", "in_progress", "queued", "pending", "success"],
          required: true,
          type: "string"
        },
        target_url: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/deployments/:deployment_id/statuses"
    },
    createDispatchEvent: {
      method: "POST",
      params: {
        client_payload: {
          type: "object"
        },
        event_type: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/dispatches"
    },
    createFile: {
      deprecated: "octokit.repos.createFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)",
      method: "PUT",
      params: {
        author: {
          type: "object"
        },
        "author.email": {
          required: true,
          type: "string"
        },
        "author.name": {
          required: true,
          type: "string"
        },
        branch: {
          type: "string"
        },
        committer: {
          type: "object"
        },
        "committer.email": {
          required: true,
          type: "string"
        },
        "committer.name": {
          required: true,
          type: "string"
        },
        content: {
          required: true,
          type: "string"
        },
        message: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contents/:path"
    },
    createForAuthenticatedUser: {
      method: "POST",
      params: {
        allow_merge_commit: {
          type: "boolean"
        },
        allow_rebase_merge: {
          type: "boolean"
        },
        allow_squash_merge: {
          type: "boolean"
        },
        auto_init: {
          type: "boolean"
        },
        delete_branch_on_merge: {
          type: "boolean"
        },
        description: {
          type: "string"
        },
        gitignore_template: {
          type: "string"
        },
        has_issues: {
          type: "boolean"
        },
        has_projects: {
          type: "boolean"
        },
        has_wiki: {
          type: "boolean"
        },
        homepage: {
          type: "string"
        },
        is_template: {
          type: "boolean"
        },
        license_template: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        team_id: {
          type: "integer"
        },
        visibility: {
          enum: ["public", "private", "visibility", "internal"],
          type: "string"
        }
      },
      url: "/user/repos"
    },
    createFork: {
      method: "POST",
      params: {
        organization: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/forks"
    },
    createHook: {
      method: "POST",
      params: {
        active: {
          type: "boolean"
        },
        config: {
          required: true,
          type: "object"
        },
        "config.content_type": {
          type: "string"
        },
        "config.insecure_ssl": {
          type: "string"
        },
        "config.secret": {
          type: "string"
        },
        "config.url": {
          required: true,
          type: "string"
        },
        events: {
          type: "string[]"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks"
    },
    createInOrg: {
      method: "POST",
      params: {
        allow_merge_commit: {
          type: "boolean"
        },
        allow_rebase_merge: {
          type: "boolean"
        },
        allow_squash_merge: {
          type: "boolean"
        },
        auto_init: {
          type: "boolean"
        },
        delete_branch_on_merge: {
          type: "boolean"
        },
        description: {
          type: "string"
        },
        gitignore_template: {
          type: "string"
        },
        has_issues: {
          type: "boolean"
        },
        has_projects: {
          type: "boolean"
        },
        has_wiki: {
          type: "boolean"
        },
        homepage: {
          type: "string"
        },
        is_template: {
          type: "boolean"
        },
        license_template: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        team_id: {
          type: "integer"
        },
        visibility: {
          enum: ["public", "private", "visibility", "internal"],
          type: "string"
        }
      },
      url: "/orgs/:org/repos"
    },
    createOrUpdateFile: {
      method: "PUT",
      params: {
        author: {
          type: "object"
        },
        "author.email": {
          required: true,
          type: "string"
        },
        "author.name": {
          required: true,
          type: "string"
        },
        branch: {
          type: "string"
        },
        committer: {
          type: "object"
        },
        "committer.email": {
          required: true,
          type: "string"
        },
        "committer.name": {
          required: true,
          type: "string"
        },
        content: {
          required: true,
          type: "string"
        },
        message: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contents/:path"
    },
    createRelease: {
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        draft: {
          type: "boolean"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        prerelease: {
          type: "boolean"
        },
        repo: {
          required: true,
          type: "string"
        },
        tag_name: {
          required: true,
          type: "string"
        },
        target_commitish: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases"
    },
    createStatus: {
      method: "POST",
      params: {
        context: {
          type: "string"
        },
        description: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["error", "failure", "pending", "success"],
          required: true,
          type: "string"
        },
        target_url: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/statuses/:sha"
    },
    createUsingTemplate: {
      headers: {
        accept: "application/vnd.github.baptiste-preview+json"
      },
      method: "POST",
      params: {
        description: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        owner: {
          type: "string"
        },
        private: {
          type: "boolean"
        },
        template_owner: {
          required: true,
          type: "string"
        },
        template_repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:template_owner/:template_repo/generate"
    },
    declineInvitation: {
      method: "DELETE",
      params: {
        invitation_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/repository_invitations/:invitation_id"
    },
    delete: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo"
    },
    deleteCommitComment: {
      method: "DELETE",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments/:comment_id"
    },
    deleteDownload: {
      method: "DELETE",
      params: {
        download_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/downloads/:download_id"
    },
    deleteFile: {
      method: "DELETE",
      params: {
        author: {
          type: "object"
        },
        "author.email": {
          type: "string"
        },
        "author.name": {
          type: "string"
        },
        branch: {
          type: "string"
        },
        committer: {
          type: "object"
        },
        "committer.email": {
          type: "string"
        },
        "committer.name": {
          type: "string"
        },
        message: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contents/:path"
    },
    deleteHook: {
      method: "DELETE",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks/:hook_id"
    },
    deleteInvitation: {
      method: "DELETE",
      params: {
        invitation_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/invitations/:invitation_id"
    },
    deleteRelease: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        release_id: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/:release_id"
    },
    deleteReleaseAsset: {
      method: "DELETE",
      params: {
        asset_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/assets/:asset_id"
    },
    disableAutomatedSecurityFixes: {
      headers: {
        accept: "application/vnd.github.london-preview+json"
      },
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/automated-security-fixes"
    },
    disablePagesSite: {
      headers: {
        accept: "application/vnd.github.switcheroo-preview+json"
      },
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages"
    },
    disableVulnerabilityAlerts: {
      headers: {
        accept: "application/vnd.github.dorian-preview+json"
      },
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/vulnerability-alerts"
    },
    enableAutomatedSecurityFixes: {
      headers: {
        accept: "application/vnd.github.london-preview+json"
      },
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/automated-security-fixes"
    },
    enablePagesSite: {
      headers: {
        accept: "application/vnd.github.switcheroo-preview+json"
      },
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        source: {
          type: "object"
        },
        "source.branch": {
          enum: ["master", "gh-pages"],
          type: "string"
        },
        "source.path": {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages"
    },
    enableVulnerabilityAlerts: {
      headers: {
        accept: "application/vnd.github.dorian-preview+json"
      },
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/vulnerability-alerts"
    },
    get: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo"
    },
    getAppsWithAccessToProtectedBranch: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
    },
    getArchiveLink: {
      method: "GET",
      params: {
        archive_format: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/:archive_format/:ref"
    },
    getBranch: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch"
    },
    getBranchProtection: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection"
    },
    getClones: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        per: {
          enum: ["day", "week"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/traffic/clones"
    },
    getCodeFrequencyStats: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stats/code_frequency"
    },
    getCollaboratorPermissionLevel: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/collaborators/:username/permission"
    },
    getCombinedStatusForRef: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref/status"
    },
    getCommit: {
      method: "GET",
      params: {
        commit_sha: {
          alias: "ref",
          deprecated: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          alias: "ref",
          deprecated: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref"
    },
    getCommitActivityStats: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stats/commit_activity"
    },
    getCommitComment: {
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments/:comment_id"
    },
    getCommitRefSha: {
      deprecated: "octokit.repos.getCommitRefSha() is deprecated, see https://developer.github.com/v3/repos/commits/#get-a-single-commit",
      headers: {
        accept: "application/vnd.github.v3.sha"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref"
    },
    getContents: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        ref: {
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contents/:path"
    },
    getContributorsStats: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stats/contributors"
    },
    getDeployKey: {
      method: "GET",
      params: {
        key_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/keys/:key_id"
    },
    getDeployment: {
      method: "GET",
      params: {
        deployment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/deployments/:deployment_id"
    },
    getDeploymentStatus: {
      method: "GET",
      params: {
        deployment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        status_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/deployments/:deployment_id/statuses/:status_id"
    },
    getDownload: {
      method: "GET",
      params: {
        download_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/downloads/:download_id"
    },
    getHook: {
      method: "GET",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks/:hook_id"
    },
    getLatestPagesBuild: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages/builds/latest"
    },
    getLatestRelease: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/latest"
    },
    getPages: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages"
    },
    getPagesBuild: {
      method: "GET",
      params: {
        build_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages/builds/:build_id"
    },
    getParticipationStats: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stats/participation"
    },
    getProtectedBranchAdminEnforcement: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
    },
    getProtectedBranchPullRequestReviewEnforcement: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
    },
    getProtectedBranchRequiredSignatures: {
      headers: {
        accept: "application/vnd.github.zzzax-preview+json"
      },
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
    },
    getProtectedBranchRequiredStatusChecks: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
    },
    getProtectedBranchRestrictions: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions"
    },
    getPunchCardStats: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stats/punch_card"
    },
    getReadme: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/readme"
    },
    getRelease: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        release_id: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/:release_id"
    },
    getReleaseAsset: {
      method: "GET",
      params: {
        asset_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/assets/:asset_id"
    },
    getReleaseByTag: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        tag: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/tags/:tag"
    },
    getTeamsWithAccessToProtectedBranch: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    getTopPaths: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/traffic/popular/paths"
    },
    getTopReferrers: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/traffic/popular/referrers"
    },
    getUsersWithAccessToProtectedBranch: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    getViews: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        per: {
          enum: ["day", "week"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/traffic/views"
    },
    list: {
      method: "GET",
      params: {
        affiliation: {
          type: "string"
        },
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        sort: {
          enum: ["created", "updated", "pushed", "full_name"],
          type: "string"
        },
        type: {
          enum: ["all", "owner", "public", "private", "member"],
          type: "string"
        },
        visibility: {
          enum: ["all", "public", "private"],
          type: "string"
        }
      },
      url: "/user/repos"
    },
    listAppsWithAccessToProtectedBranch: {
      deprecated: "octokit.repos.listAppsWithAccessToProtectedBranch() has been renamed to octokit.repos.getAppsWithAccessToProtectedBranch() (2019-09-13)",
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
    },
    listAssetsForRelease: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        release_id: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/:release_id/assets"
    },
    listBranches: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        protected: {
          type: "boolean"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches"
    },
    listBranchesForHeadCommit: {
      headers: {
        accept: "application/vnd.github.groot-preview+json"
      },
      method: "GET",
      params: {
        commit_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:commit_sha/branches-where-head"
    },
    listCollaborators: {
      method: "GET",
      params: {
        affiliation: {
          enum: ["outside", "direct", "all"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/collaborators"
    },
    listCommentsForCommit: {
      method: "GET",
      params: {
        commit_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          alias: "commit_sha",
          deprecated: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:commit_sha/comments"
    },
    listCommitComments: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments"
    },
    listCommits: {
      method: "GET",
      params: {
        author: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        path: {
          type: "string"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        },
        since: {
          type: "string"
        },
        until: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits"
    },
    listContributors: {
      method: "GET",
      params: {
        anon: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contributors"
    },
    listDeployKeys: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/keys"
    },
    listDeploymentStatuses: {
      method: "GET",
      params: {
        deployment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/deployments/:deployment_id/statuses"
    },
    listDeployments: {
      method: "GET",
      params: {
        environment: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        },
        task: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/deployments"
    },
    listDownloads: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/downloads"
    },
    listForOrg: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        sort: {
          enum: ["created", "updated", "pushed", "full_name"],
          type: "string"
        },
        type: {
          enum: ["all", "public", "private", "forks", "sources", "member", "internal"],
          type: "string"
        }
      },
      url: "/orgs/:org/repos"
    },
    listForUser: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        sort: {
          enum: ["created", "updated", "pushed", "full_name"],
          type: "string"
        },
        type: {
          enum: ["all", "owner", "member"],
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/repos"
    },
    listForks: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["newest", "oldest", "stargazers"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/forks"
    },
    listHooks: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks"
    },
    listInvitations: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/invitations"
    },
    listInvitationsForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/repository_invitations"
    },
    listLanguages: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/languages"
    },
    listPagesBuilds: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages/builds"
    },
    listProtectedBranchRequiredStatusChecksContexts: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
    },
    listProtectedBranchTeamRestrictions: {
      deprecated: "octokit.repos.listProtectedBranchTeamRestrictions() has been renamed to octokit.repos.getTeamsWithAccessToProtectedBranch() (2019-09-09)",
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    listProtectedBranchUserRestrictions: {
      deprecated: "octokit.repos.listProtectedBranchUserRestrictions() has been renamed to octokit.repos.getUsersWithAccessToProtectedBranch() (2019-09-09)",
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    listPublic: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "integer"
        }
      },
      url: "/repositories"
    },
    listPullRequestsAssociatedWithCommit: {
      headers: {
        accept: "application/vnd.github.groot-preview+json"
      },
      method: "GET",
      params: {
        commit_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:commit_sha/pulls"
    },
    listReleases: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases"
    },
    listStatusesForRef: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref/statuses"
    },
    listTags: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/tags"
    },
    listTeams: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/teams"
    },
    listTeamsWithAccessToProtectedBranch: {
      deprecated: "octokit.repos.listTeamsWithAccessToProtectedBranch() has been renamed to octokit.repos.getTeamsWithAccessToProtectedBranch() (2019-09-13)",
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    listTopics: {
      headers: {
        accept: "application/vnd.github.mercy-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/topics"
    },
    listUsersWithAccessToProtectedBranch: {
      deprecated: "octokit.repos.listUsersWithAccessToProtectedBranch() has been renamed to octokit.repos.getUsersWithAccessToProtectedBranch() (2019-09-13)",
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    merge: {
      method: "POST",
      params: {
        base: {
          required: true,
          type: "string"
        },
        commit_message: {
          type: "string"
        },
        head: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/merges"
    },
    pingHook: {
      method: "POST",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks/:hook_id/pings"
    },
    removeBranchProtection: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection"
    },
    removeCollaborator: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/collaborators/:username"
    },
    removeDeployKey: {
      method: "DELETE",
      params: {
        key_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/keys/:key_id"
    },
    removeProtectedBranchAdminEnforcement: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
    },
    removeProtectedBranchAppRestrictions: {
      method: "DELETE",
      params: {
        apps: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
    },
    removeProtectedBranchPullRequestReviewEnforcement: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
    },
    removeProtectedBranchRequiredSignatures: {
      headers: {
        accept: "application/vnd.github.zzzax-preview+json"
      },
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
    },
    removeProtectedBranchRequiredStatusChecks: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
    },
    removeProtectedBranchRequiredStatusChecksContexts: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        contexts: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
    },
    removeProtectedBranchRestrictions: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions"
    },
    removeProtectedBranchTeamRestrictions: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        teams: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    removeProtectedBranchUserRestrictions: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        users: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    replaceProtectedBranchAppRestrictions: {
      method: "PUT",
      params: {
        apps: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
    },
    replaceProtectedBranchRequiredStatusChecksContexts: {
      method: "PUT",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        contexts: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
    },
    replaceProtectedBranchTeamRestrictions: {
      method: "PUT",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        teams: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    replaceProtectedBranchUserRestrictions: {
      method: "PUT",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        users: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    replaceTopics: {
      headers: {
        accept: "application/vnd.github.mercy-preview+json"
      },
      method: "PUT",
      params: {
        names: {
          required: true,
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/topics"
    },
    requestPageBuild: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages/builds"
    },
    retrieveCommunityProfileMetrics: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/community/profile"
    },
    testPushHook: {
      method: "POST",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks/:hook_id/tests"
    },
    transfer: {
      method: "POST",
      params: {
        new_owner: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_ids: {
          type: "integer[]"
        }
      },
      url: "/repos/:owner/:repo/transfer"
    },
    update: {
      method: "PATCH",
      params: {
        allow_merge_commit: {
          type: "boolean"
        },
        allow_rebase_merge: {
          type: "boolean"
        },
        allow_squash_merge: {
          type: "boolean"
        },
        archived: {
          type: "boolean"
        },
        default_branch: {
          type: "string"
        },
        delete_branch_on_merge: {
          type: "boolean"
        },
        description: {
          type: "string"
        },
        has_issues: {
          type: "boolean"
        },
        has_projects: {
          type: "boolean"
        },
        has_wiki: {
          type: "boolean"
        },
        homepage: {
          type: "string"
        },
        is_template: {
          type: "boolean"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        repo: {
          required: true,
          type: "string"
        },
        visibility: {
          enum: ["public", "private", "visibility", "internal"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo"
    },
    updateBranchProtection: {
      method: "PUT",
      params: {
        allow_deletions: {
          type: "boolean"
        },
        allow_force_pushes: {
          allowNull: true,
          type: "boolean"
        },
        branch: {
          required: true,
          type: "string"
        },
        enforce_admins: {
          allowNull: true,
          required: true,
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        required_linear_history: {
          type: "boolean"
        },
        required_pull_request_reviews: {
          allowNull: true,
          required: true,
          type: "object"
        },
        "required_pull_request_reviews.dismiss_stale_reviews": {
          type: "boolean"
        },
        "required_pull_request_reviews.dismissal_restrictions": {
          type: "object"
        },
        "required_pull_request_reviews.dismissal_restrictions.teams": {
          type: "string[]"
        },
        "required_pull_request_reviews.dismissal_restrictions.users": {
          type: "string[]"
        },
        "required_pull_request_reviews.require_code_owner_reviews": {
          type: "boolean"
        },
        "required_pull_request_reviews.required_approving_review_count": {
          type: "integer"
        },
        required_status_checks: {
          allowNull: true,
          required: true,
          type: "object"
        },
        "required_status_checks.contexts": {
          required: true,
          type: "string[]"
        },
        "required_status_checks.strict": {
          required: true,
          type: "boolean"
        },
        restrictions: {
          allowNull: true,
          required: true,
          type: "object"
        },
        "restrictions.apps": {
          type: "string[]"
        },
        "restrictions.teams": {
          required: true,
          type: "string[]"
        },
        "restrictions.users": {
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection"
    },
    updateCommitComment: {
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments/:comment_id"
    },
    updateFile: {
      deprecated: "octokit.repos.updateFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)",
      method: "PUT",
      params: {
        author: {
          type: "object"
        },
        "author.email": {
          required: true,
          type: "string"
        },
        "author.name": {
          required: true,
          type: "string"
        },
        branch: {
          type: "string"
        },
        committer: {
          type: "object"
        },
        "committer.email": {
          required: true,
          type: "string"
        },
        "committer.name": {
          required: true,
          type: "string"
        },
        content: {
          required: true,
          type: "string"
        },
        message: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contents/:path"
    },
    updateHook: {
      method: "PATCH",
      params: {
        active: {
          type: "boolean"
        },
        add_events: {
          type: "string[]"
        },
        config: {
          type: "object"
        },
        "config.content_type": {
          type: "string"
        },
        "config.insecure_ssl": {
          type: "string"
        },
        "config.secret": {
          type: "string"
        },
        "config.url": {
          required: true,
          type: "string"
        },
        events: {
          type: "string[]"
        },
        hook_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        remove_events: {
          type: "string[]"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks/:hook_id"
    },
    updateInformationAboutPagesSite: {
      method: "PUT",
      params: {
        cname: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        source: {
          enum: ['"gh-pages"', '"master"', '"master /docs"'],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages"
    },
    updateInvitation: {
      method: "PATCH",
      params: {
        invitation_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        permissions: {
          enum: ["read", "write", "admin"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/invitations/:invitation_id"
    },
    updateProtectedBranchPullRequestReviewEnforcement: {
      method: "PATCH",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        dismiss_stale_reviews: {
          type: "boolean"
        },
        dismissal_restrictions: {
          type: "object"
        },
        "dismissal_restrictions.teams": {
          type: "string[]"
        },
        "dismissal_restrictions.users": {
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        require_code_owner_reviews: {
          type: "boolean"
        },
        required_approving_review_count: {
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
    },
    updateProtectedBranchRequiredStatusChecks: {
      method: "PATCH",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        contexts: {
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        strict: {
          type: "boolean"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
    },
    updateRelease: {
      method: "PATCH",
      params: {
        body: {
          type: "string"
        },
        draft: {
          type: "boolean"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        prerelease: {
          type: "boolean"
        },
        release_id: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        tag_name: {
          type: "string"
        },
        target_commitish: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/:release_id"
    },
    updateReleaseAsset: {
      method: "PATCH",
      params: {
        asset_id: {
          required: true,
          type: "integer"
        },
        label: {
          type: "string"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/assets/:asset_id"
    },
    uploadReleaseAsset: {
      method: "POST",
      params: {
        data: {
          mapTo: "data",
          required: true,
          type: "string | object"
        },
        file: {
          alias: "data",
          deprecated: true,
          type: "string | object"
        },
        headers: {
          required: true,
          type: "object"
        },
        "headers.content-length": {
          required: true,
          type: "integer"
        },
        "headers.content-type": {
          required: true,
          type: "string"
        },
        label: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        url: {
          required: true,
          type: "string"
        }
      },
      url: ":url"
    }
  },
  search: {
    code: {
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["indexed"],
          type: "string"
        }
      },
      url: "/search/code"
    },
    commits: {
      headers: {
        accept: "application/vnd.github.cloak-preview+json"
      },
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["author-date", "committer-date"],
          type: "string"
        }
      },
      url: "/search/commits"
    },
    issues: {
      deprecated: "octokit.search.issues() has been renamed to octokit.search.issuesAndPullRequests() (2018-12-27)",
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["comments", "reactions", "reactions-+1", "reactions--1", "reactions-smile", "reactions-thinking_face", "reactions-heart", "reactions-tada", "interactions", "created", "updated"],
          type: "string"
        }
      },
      url: "/search/issues"
    },
    issuesAndPullRequests: {
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["comments", "reactions", "reactions-+1", "reactions--1", "reactions-smile", "reactions-thinking_face", "reactions-heart", "reactions-tada", "interactions", "created", "updated"],
          type: "string"
        }
      },
      url: "/search/issues"
    },
    labels: {
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        q: {
          required: true,
          type: "string"
        },
        repository_id: {
          required: true,
          type: "integer"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/search/labels"
    },
    repos: {
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["stars", "forks", "help-wanted-issues", "updated"],
          type: "string"
        }
      },
      url: "/search/repositories"
    },
    topics: {
      method: "GET",
      params: {
        q: {
          required: true,
          type: "string"
        }
      },
      url: "/search/topics"
    },
    users: {
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["followers", "repositories", "joined"],
          type: "string"
        }
      },
      url: "/search/users"
    }
  },
  teams: {
    addMember: {
      deprecated: "octokit.teams.addMember() has been renamed to octokit.teams.addMemberLegacy() (2020-01-16)",
      method: "PUT",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    addMemberLegacy: {
      deprecated: "octokit.teams.addMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#add-team-member-legacy",
      method: "PUT",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    addOrUpdateMembership: {
      deprecated: "octokit.teams.addOrUpdateMembership() has been renamed to octokit.teams.addOrUpdateMembershipLegacy() (2020-01-16)",
      method: "PUT",
      params: {
        role: {
          enum: ["member", "maintainer"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    addOrUpdateMembershipInOrg: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        role: {
          enum: ["member", "maintainer"],
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/memberships/:username"
    },
    addOrUpdateMembershipLegacy: {
      deprecated: "octokit.teams.addOrUpdateMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#add-or-update-team-membership-legacy",
      method: "PUT",
      params: {
        role: {
          enum: ["member", "maintainer"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    addOrUpdateProject: {
      deprecated: "octokit.teams.addOrUpdateProject() has been renamed to octokit.teams.addOrUpdateProjectLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PUT",
      params: {
        permission: {
          enum: ["read", "write", "admin"],
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    addOrUpdateProjectInOrg: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        permission: {
          enum: ["read", "write", "admin"],
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/projects/:project_id"
    },
    addOrUpdateProjectLegacy: {
      deprecated: "octokit.teams.addOrUpdateProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#add-or-update-team-project-legacy",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PUT",
      params: {
        permission: {
          enum: ["read", "write", "admin"],
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    addOrUpdateRepo: {
      deprecated: "octokit.teams.addOrUpdateRepo() has been renamed to octokit.teams.addOrUpdateRepoLegacy() (2020-01-16)",
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    addOrUpdateRepoInOrg: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
    },
    addOrUpdateRepoLegacy: {
      deprecated: "octokit.teams.addOrUpdateRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#add-or-update-team-repository-legacy",
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    checkManagesRepo: {
      deprecated: "octokit.teams.checkManagesRepo() has been renamed to octokit.teams.checkManagesRepoLegacy() (2020-01-16)",
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    checkManagesRepoInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
    },
    checkManagesRepoLegacy: {
      deprecated: "octokit.teams.checkManagesRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#check-if-a-team-manages-a-repository-legacy",
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    create: {
      method: "POST",
      params: {
        description: {
          type: "string"
        },
        maintainers: {
          type: "string[]"
        },
        name: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        parent_team_id: {
          type: "integer"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        privacy: {
          enum: ["secret", "closed"],
          type: "string"
        },
        repo_names: {
          type: "string[]"
        }
      },
      url: "/orgs/:org/teams"
    },
    createDiscussion: {
      deprecated: "octokit.teams.createDiscussion() has been renamed to octokit.teams.createDiscussionLegacy() (2020-01-16)",
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/discussions"
    },
    createDiscussionComment: {
      deprecated: "octokit.teams.createDiscussionComment() has been renamed to octokit.teams.createDiscussionCommentLegacy() (2020-01-16)",
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments"
    },
    createDiscussionCommentInOrg: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments"
    },
    createDiscussionCommentLegacy: {
      deprecated: "octokit.teams.createDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#create-a-comment-legacy",
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments"
    },
    createDiscussionInOrg: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        team_slug: {
          required: true,
          type: "string"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions"
    },
    createDiscussionLegacy: {
      deprecated: "octokit.teams.createDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#create-a-discussion-legacy",
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/discussions"
    },
    delete: {
      deprecated: "octokit.teams.delete() has been renamed to octokit.teams.deleteLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    },
    deleteDiscussion: {
      deprecated: "octokit.teams.deleteDiscussion() has been renamed to octokit.teams.deleteDiscussionLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    deleteDiscussionComment: {
      deprecated: "octokit.teams.deleteDiscussionComment() has been renamed to octokit.teams.deleteDiscussionCommentLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    deleteDiscussionCommentInOrg: {
      method: "DELETE",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
    },
    deleteDiscussionCommentLegacy: {
      deprecated: "octokit.teams.deleteDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#delete-a-comment-legacy",
      method: "DELETE",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    deleteDiscussionInOrg: {
      method: "DELETE",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
    },
    deleteDiscussionLegacy: {
      deprecated: "octokit.teams.deleteDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#delete-a-discussion-legacy",
      method: "DELETE",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    deleteInOrg: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug"
    },
    deleteLegacy: {
      deprecated: "octokit.teams.deleteLegacy() is deprecated, see https://developer.github.com/v3/teams/#delete-team-legacy",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    },
    get: {
      deprecated: "octokit.teams.get() has been renamed to octokit.teams.getLegacy() (2020-01-16)",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    },
    getByName: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug"
    },
    getDiscussion: {
      deprecated: "octokit.teams.getDiscussion() has been renamed to octokit.teams.getDiscussionLegacy() (2020-01-16)",
      method: "GET",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    getDiscussionComment: {
      deprecated: "octokit.teams.getDiscussionComment() has been renamed to octokit.teams.getDiscussionCommentLegacy() (2020-01-16)",
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    getDiscussionCommentInOrg: {
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
    },
    getDiscussionCommentLegacy: {
      deprecated: "octokit.teams.getDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#get-a-single-comment-legacy",
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    getDiscussionInOrg: {
      method: "GET",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
    },
    getDiscussionLegacy: {
      deprecated: "octokit.teams.getDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#get-a-single-discussion-legacy",
      method: "GET",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    getLegacy: {
      deprecated: "octokit.teams.getLegacy() is deprecated, see https://developer.github.com/v3/teams/#get-team-legacy",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    },
    getMember: {
      deprecated: "octokit.teams.getMember() has been renamed to octokit.teams.getMemberLegacy() (2020-01-16)",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    getMemberLegacy: {
      deprecated: "octokit.teams.getMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#get-team-member-legacy",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    getMembership: {
      deprecated: "octokit.teams.getMembership() has been renamed to octokit.teams.getMembershipLegacy() (2020-01-16)",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    getMembershipInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/memberships/:username"
    },
    getMembershipLegacy: {
      deprecated: "octokit.teams.getMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#get-team-membership-legacy",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    list: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/teams"
    },
    listChild: {
      deprecated: "octokit.teams.listChild() has been renamed to octokit.teams.listChildLegacy() (2020-01-16)",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/teams"
    },
    listChildInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/teams"
    },
    listChildLegacy: {
      deprecated: "octokit.teams.listChildLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-child-teams-legacy",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/teams"
    },
    listDiscussionComments: {
      deprecated: "octokit.teams.listDiscussionComments() has been renamed to octokit.teams.listDiscussionCommentsLegacy() (2020-01-16)",
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments"
    },
    listDiscussionCommentsInOrg: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments"
    },
    listDiscussionCommentsLegacy: {
      deprecated: "octokit.teams.listDiscussionCommentsLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#list-comments-legacy",
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments"
    },
    listDiscussions: {
      deprecated: "octokit.teams.listDiscussions() has been renamed to octokit.teams.listDiscussionsLegacy() (2020-01-16)",
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions"
    },
    listDiscussionsInOrg: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions"
    },
    listDiscussionsLegacy: {
      deprecated: "octokit.teams.listDiscussionsLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#list-discussions-legacy",
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions"
    },
    listForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/teams"
    },
    listMembers: {
      deprecated: "octokit.teams.listMembers() has been renamed to octokit.teams.listMembersLegacy() (2020-01-16)",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        role: {
          enum: ["member", "maintainer", "all"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/members"
    },
    listMembersInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        role: {
          enum: ["member", "maintainer", "all"],
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/members"
    },
    listMembersLegacy: {
      deprecated: "octokit.teams.listMembersLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#list-team-members-legacy",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        role: {
          enum: ["member", "maintainer", "all"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/members"
    },
    listPendingInvitations: {
      deprecated: "octokit.teams.listPendingInvitations() has been renamed to octokit.teams.listPendingInvitationsLegacy() (2020-01-16)",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/invitations"
    },
    listPendingInvitationsInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/invitations"
    },
    listPendingInvitationsLegacy: {
      deprecated: "octokit.teams.listPendingInvitationsLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#list-pending-team-invitations-legacy",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/invitations"
    },
    listProjects: {
      deprecated: "octokit.teams.listProjects() has been renamed to octokit.teams.listProjectsLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects"
    },
    listProjectsInOrg: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/projects"
    },
    listProjectsLegacy: {
      deprecated: "octokit.teams.listProjectsLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-team-projects-legacy",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects"
    },
    listRepos: {
      deprecated: "octokit.teams.listRepos() has been renamed to octokit.teams.listReposLegacy() (2020-01-16)",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos"
    },
    listReposInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/repos"
    },
    listReposLegacy: {
      deprecated: "octokit.teams.listReposLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-team-repos-legacy",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos"
    },
    removeMember: {
      deprecated: "octokit.teams.removeMember() has been renamed to octokit.teams.removeMemberLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    removeMemberLegacy: {
      deprecated: "octokit.teams.removeMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#remove-team-member-legacy",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    removeMembership: {
      deprecated: "octokit.teams.removeMembership() has been renamed to octokit.teams.removeMembershipLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    removeMembershipInOrg: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/memberships/:username"
    },
    removeMembershipLegacy: {
      deprecated: "octokit.teams.removeMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#remove-team-membership-legacy",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    removeProject: {
      deprecated: "octokit.teams.removeProject() has been renamed to octokit.teams.removeProjectLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    removeProjectInOrg: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/projects/:project_id"
    },
    removeProjectLegacy: {
      deprecated: "octokit.teams.removeProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#remove-team-project-legacy",
      method: "DELETE",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    removeRepo: {
      deprecated: "octokit.teams.removeRepo() has been renamed to octokit.teams.removeRepoLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    removeRepoInOrg: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
    },
    removeRepoLegacy: {
      deprecated: "octokit.teams.removeRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#remove-team-repository-legacy",
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    reviewProject: {
      deprecated: "octokit.teams.reviewProject() has been renamed to octokit.teams.reviewProjectLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    reviewProjectInOrg: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/projects/:project_id"
    },
    reviewProjectLegacy: {
      deprecated: "octokit.teams.reviewProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#review-a-team-project-legacy",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    update: {
      deprecated: "octokit.teams.update() has been renamed to octokit.teams.updateLegacy() (2020-01-16)",
      method: "PATCH",
      params: {
        description: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        parent_team_id: {
          type: "integer"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        privacy: {
          enum: ["secret", "closed"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    },
    updateDiscussion: {
      deprecated: "octokit.teams.updateDiscussion() has been renamed to octokit.teams.updateDiscussionLegacy() (2020-01-16)",
      method: "PATCH",
      params: {
        body: {
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        title: {
          type: "string"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    updateDiscussionComment: {
      deprecated: "octokit.teams.updateDiscussionComment() has been renamed to octokit.teams.updateDiscussionCommentLegacy() (2020-01-16)",
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    updateDiscussionCommentInOrg: {
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
    },
    updateDiscussionCommentLegacy: {
      deprecated: "octokit.teams.updateDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#edit-a-comment-legacy",
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    updateDiscussionInOrg: {
      method: "PATCH",
      params: {
        body: {
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
    },
    updateDiscussionLegacy: {
      deprecated: "octokit.teams.updateDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#edit-a-discussion-legacy",
      method: "PATCH",
      params: {
        body: {
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        title: {
          type: "string"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    updateInOrg: {
      method: "PATCH",
      params: {
        description: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        parent_team_id: {
          type: "integer"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        privacy: {
          enum: ["secret", "closed"],
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug"
    },
    updateLegacy: {
      deprecated: "octokit.teams.updateLegacy() is deprecated, see https://developer.github.com/v3/teams/#edit-team-legacy",
      method: "PATCH",
      params: {
        description: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        parent_team_id: {
          type: "integer"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        privacy: {
          enum: ["secret", "closed"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    }
  },
  users: {
    addEmails: {
      method: "POST",
      params: {
        emails: {
          required: true,
          type: "string[]"
        }
      },
      url: "/user/emails"
    },
    block: {
      method: "PUT",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/blocks/:username"
    },
    checkBlocked: {
      method: "GET",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/blocks/:username"
    },
    checkFollowing: {
      method: "GET",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/following/:username"
    },
    checkFollowingForUser: {
      method: "GET",
      params: {
        target_user: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/following/:target_user"
    },
    createGpgKey: {
      method: "POST",
      params: {
        armored_public_key: {
          type: "string"
        }
      },
      url: "/user/gpg_keys"
    },
    createPublicKey: {
      method: "POST",
      params: {
        key: {
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/user/keys"
    },
    deleteEmails: {
      method: "DELETE",
      params: {
        emails: {
          required: true,
          type: "string[]"
        }
      },
      url: "/user/emails"
    },
    deleteGpgKey: {
      method: "DELETE",
      params: {
        gpg_key_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/gpg_keys/:gpg_key_id"
    },
    deletePublicKey: {
      method: "DELETE",
      params: {
        key_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/keys/:key_id"
    },
    follow: {
      method: "PUT",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/following/:username"
    },
    getAuthenticated: {
      method: "GET",
      params: {},
      url: "/user"
    },
    getByUsername: {
      method: "GET",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username"
    },
    getContextForUser: {
      method: "GET",
      params: {
        subject_id: {
          type: "string"
        },
        subject_type: {
          enum: ["organization", "repository", "issue", "pull_request"],
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/hovercard"
    },
    getGpgKey: {
      method: "GET",
      params: {
        gpg_key_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/gpg_keys/:gpg_key_id"
    },
    getPublicKey: {
      method: "GET",
      params: {
        key_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/keys/:key_id"
    },
    list: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        }
      },
      url: "/users"
    },
    listBlocked: {
      method: "GET",
      params: {},
      url: "/user/blocks"
    },
    listEmails: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/emails"
    },
    listFollowersForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/followers"
    },
    listFollowersForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/followers"
    },
    listFollowingForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/following"
    },
    listFollowingForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/following"
    },
    listGpgKeys: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/gpg_keys"
    },
    listGpgKeysForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/gpg_keys"
    },
    listPublicEmails: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/public_emails"
    },
    listPublicKeys: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/keys"
    },
    listPublicKeysForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/keys"
    },
    togglePrimaryEmailVisibility: {
      method: "PATCH",
      params: {
        email: {
          required: true,
          type: "string"
        },
        visibility: {
          required: true,
          type: "string"
        }
      },
      url: "/user/email/visibility"
    },
    unblock: {
      method: "DELETE",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/blocks/:username"
    },
    unfollow: {
      method: "DELETE",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/following/:username"
    },
    updateAuthenticated: {
      method: "PATCH",
      params: {
        bio: {
          type: "string"
        },
        blog: {
          type: "string"
        },
        company: {
          type: "string"
        },
        email: {
          type: "string"
        },
        hireable: {
          type: "boolean"
        },
        location: {
          type: "string"
        },
        name: {
          type: "string"
        }
      },
      url: "/user"
    }
  }
};

const VERSION = "2.4.0";

function registerEndpoints(octokit, routes) {
  Object.keys(routes).forEach(namespaceName => {
    if (!octokit[namespaceName]) {
      octokit[namespaceName] = {};
    }

    Object.keys(routes[namespaceName]).forEach(apiName => {
      const apiOptions = routes[namespaceName][apiName];
      const endpointDefaults = ["method", "url", "headers"].reduce((map, key) => {
        if (typeof apiOptions[key] !== "undefined") {
          map[key] = apiOptions[key];
        }

        return map;
      }, {});
      endpointDefaults.request = {
        validate: apiOptions.params
      };
      let request = octokit.request.defaults(endpointDefaults); // patch request & endpoint methods to support deprecated parameters.
      // Not the most elegant solution, but we don’t want to move deprecation
      // logic into octokit/endpoint.js as it’s out of scope

      const hasDeprecatedParam = Object.keys(apiOptions.params || {}).find(key => apiOptions.params[key].deprecated);

      if (hasDeprecatedParam) {
        const patch = patchForDeprecation.bind(null, octokit, apiOptions);
        request = patch(octokit.request.defaults(endpointDefaults), `.${namespaceName}.${apiName}()`);
        request.endpoint = patch(request.endpoint, `.${namespaceName}.${apiName}.endpoint()`);
        request.endpoint.merge = patch(request.endpoint.merge, `.${namespaceName}.${apiName}.endpoint.merge()`);
      }

      if (apiOptions.deprecated) {
        octokit[namespaceName][apiName] = Object.assign(function deprecatedEndpointMethod() {
          octokit.log.warn(new deprecation.Deprecation(`[@octokit/rest] ${apiOptions.deprecated}`));
          octokit[namespaceName][apiName] = request;
          return request.apply(null, arguments);
        }, request);
        return;
      }

      octokit[namespaceName][apiName] = request;
    });
  });
}

function patchForDeprecation(octokit, apiOptions, method, methodName) {
  const patchedMethod = options => {
    options = Object.assign({}, options);
    Object.keys(options).forEach(key => {
      if (apiOptions.params[key] && apiOptions.params[key].deprecated) {
        const aliasKey = apiOptions.params[key].alias;
        octokit.log.warn(new deprecation.Deprecation(`[@octokit/rest] "${key}" parameter is deprecated for "${methodName}". Use "${aliasKey}" instead`));

        if (!(aliasKey in options)) {
          options[aliasKey] = options[key];
        }

        delete options[key];
      }
    });
    return method(options);
  };

  Object.keys(method).forEach(key => {
    patchedMethod[key] = method[key];
  });
  return patchedMethod;
}

/**
 * This plugin is a 1:1 copy of internal @octokit/rest plugins. The primary
 * goal is to rebuild @octokit/rest on top of @octokit/core. Once that is
 * done, we will remove the registerEndpoints methods and return the methods
 * directly as with the other plugins. At that point we will also remove the
 * legacy workarounds and deprecations.
 *
 * See the plan at
 * https://github.com/octokit/plugin-rest-endpoint-methods.js/pull/1
 */

function restEndpointMethods(octokit) {
  // @ts-ignore
  octokit.registerEndpoints = registerEndpoints.bind(null, octokit);
  registerEndpoints(octokit, endpointsByScope); // Aliasing scopes for backward compatibility
  // See https://github.com/octokit/rest.js/pull/1134

  [["gitdata", "git"], ["authorization", "oauthAuthorizations"], ["pullRequests", "pulls"]].forEach(([deprecatedScope, scope]) => {
    Object.defineProperty(octokit, deprecatedScope, {
      get() {
        octokit.log.warn( // @ts-ignore
        new deprecation.Deprecation(`[@octokit/plugin-rest-endpoint-methods] "octokit.${deprecatedScope}.*" methods are deprecated, use "octokit.${scope}.*" instead`)); // @ts-ignore

        return octokit[scope];
      }

    });
  });
  return {};
}
restEndpointMethods.VERSION = VERSION;

exports.restEndpointMethods = restEndpointMethods;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 847:
/***/ (function(__unusedmodule, exports) {

"use strict";


exports.warn = warn;
exports.warnFileDeprecation = warnFileDeprecation;
exports.warnOptionDeprecation = warnOptionDeprecation;

/* global console, process, YAML_SILENCE_DEPRECATION_WARNINGS, YAML_SILENCE_WARNINGS */
function shouldWarn(deprecation) {
  const env = typeof process !== 'undefined' && process.env || {};

  if (deprecation) {
    if (typeof YAML_SILENCE_DEPRECATION_WARNINGS !== 'undefined') return !YAML_SILENCE_DEPRECATION_WARNINGS;
    return !env.YAML_SILENCE_DEPRECATION_WARNINGS;
  }

  if (typeof YAML_SILENCE_WARNINGS !== 'undefined') return !YAML_SILENCE_WARNINGS;
  return !env.YAML_SILENCE_WARNINGS;
}

function warn(warning, type) {
  if (shouldWarn(false)) {
    const emit = typeof process !== 'undefined' && process.emitWarning; // This will throw in Jest if `warning` is an Error instance due to
    // https://github.com/facebook/jest/issues/2549

    if (emit) emit(warning, type);else {
      // eslint-disable-next-line no-console
      console.warn(type ? `${type}: ${warning}` : warning);
    }
  }
}

function warnFileDeprecation(filename) {
  if (shouldWarn(true)) {
    const path = filename.replace(/.*yaml[/\\]/i, '').replace(/\.js$/, '').replace(/\\/g, '/');
    warn(`The endpoint 'yaml/${path}' will be removed in a future release.`, 'DeprecationWarning');
  }
}

const warned = {};

function warnOptionDeprecation(name, alternative) {
  if (!warned[name] && shouldWarn(true)) {
    warned[name] = true;
    let msg = `The option '${name}' will be removed in a future release`;
    msg += alternative ? `, use '${alternative}' instead.` : '.';
    warn(msg, 'DeprecationWarning');
  }
}

/***/ }),

/***/ 850:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = paginationMethodsPlugin

function paginationMethodsPlugin (octokit) {
  octokit.getFirstPage = __webpack_require__(777).bind(null, octokit)
  octokit.getLastPage = __webpack_require__(649).bind(null, octokit)
  octokit.getNextPage = __webpack_require__(550).bind(null, octokit)
  octokit.getPreviousPage = __webpack_require__(563).bind(null, octokit)
  octokit.hasFirstPage = __webpack_require__(536)
  octokit.hasLastPage = __webpack_require__(336)
  octokit.hasNextPage = __webpack_require__(929)
  octokit.hasPreviousPage = __webpack_require__(558)
}


/***/ }),

/***/ 854:
/***/ (function(module) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),

/***/ 855:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = registerPlugin;

const factory = __webpack_require__(47);

function registerPlugin(plugins, pluginFunction) {
  return factory(
    plugins.includes(pluginFunction) ? plugins : plugins.concat(pluginFunction)
  );
}


/***/ }),

/***/ 856:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = __webpack_require__(141);


/***/ }),

/***/ 858:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.parseSeq = parseSeq;

var _constants = __webpack_require__(383);

var _errors = __webpack_require__(405);

var _Pair = __webpack_require__(325);

var _parseUtils = __webpack_require__(734);

var _Seq = __webpack_require__(29);

var _Collection = __webpack_require__(380);

function parseSeq(doc, cst) {
  if (cst.type !== _constants.Type.SEQ && cst.type !== _constants.Type.FLOW_SEQ) {
    const msg = `A ${cst.type} node cannot be resolved as a sequence`;
    doc.errors.push(new _errors.YAMLSyntaxError(cst, msg));
    return null;
  }

  const {
    comments,
    items
  } = cst.type === _constants.Type.FLOW_SEQ ? resolveFlowSeqItems(doc, cst) : resolveBlockSeqItems(doc, cst);
  const seq = new _Seq.YAMLSeq();
  seq.items = items;
  (0, _parseUtils.resolveComments)(seq, comments);

  if (!doc.options.mapAsMap && items.some(it => it instanceof _Pair.Pair && it.key instanceof _Collection.Collection)) {
    const warn = 'Keys with collection values will be stringified as YAML due to JS Object restrictions. Use mapAsMap: true to avoid this.';
    doc.warnings.push(new _errors.YAMLWarning(cst, warn));
  }

  cst.resolved = seq;
  return seq;
}

function resolveBlockSeqItems(doc, cst) {
  const comments = [];
  const items = [];

  for (let i = 0; i < cst.items.length; ++i) {
    const item = cst.items[i];

    switch (item.type) {
      case _constants.Type.BLANK_LINE:
        comments.push({
          before: items.length
        });
        break;

      case _constants.Type.COMMENT:
        comments.push({
          comment: item.comment,
          before: items.length
        });
        break;

      case _constants.Type.SEQ_ITEM:
        if (item.error) doc.errors.push(item.error);
        items.push(doc.resolveNode(item.node));

        if (item.hasProps) {
          const msg = 'Sequence items cannot have tags or anchors before the - indicator';
          doc.errors.push(new _errors.YAMLSemanticError(item, msg));
        }

        break;

      default:
        if (item.error) doc.errors.push(item.error);
        doc.errors.push(new _errors.YAMLSyntaxError(item, `Unexpected ${item.type} node in sequence`));
    }
  }

  return {
    comments,
    items
  };
}

function resolveFlowSeqItems(doc, cst) {
  const comments = [];
  const items = [];
  let explicitKey = false;
  let key = undefined;
  let keyStart = null;
  let next = '[';

  for (let i = 0; i < cst.items.length; ++i) {
    const item = cst.items[i];

    if (typeof item.char === 'string') {
      const {
        char,
        offset
      } = item;

      if (char !== ':' && (explicitKey || key !== undefined)) {
        if (explicitKey && key === undefined) key = next ? items.pop() : null;
        items.push(new _Pair.Pair(key));
        explicitKey = false;
        key = undefined;
        keyStart = null;
      }

      if (char === next) {
        next = null;
      } else if (!next && char === '?') {
        explicitKey = true;
      } else if (next !== '[' && char === ':' && key === undefined) {
        if (next === ',') {
          key = items.pop();

          if (key instanceof _Pair.Pair) {
            const msg = 'Chaining flow sequence pairs is invalid';
            const err = new _errors.YAMLSemanticError(cst, msg);
            err.offset = offset;
            doc.errors.push(err);
          }

          if (!explicitKey) (0, _parseUtils.checkKeyLength)(doc.errors, cst, i, key, keyStart);
        } else {
          key = null;
        }

        keyStart = null;
        explicitKey = false; // TODO: add error for non-explicit multiline plain key

        next = null;
      } else if (next === '[' || char !== ']' || i < cst.items.length - 1) {
        const msg = `Flow sequence contains an unexpected ${char}`;
        const err = new _errors.YAMLSyntaxError(cst, msg);
        err.offset = offset;
        doc.errors.push(err);
      }
    } else if (item.type === _constants.Type.BLANK_LINE) {
      comments.push({
        before: items.length
      });
    } else if (item.type === _constants.Type.COMMENT) {
      comments.push({
        comment: item.comment,
        before: items.length
      });
    } else {
      if (next) {
        const msg = `Expected a ${next} in flow sequence`;
        doc.errors.push(new _errors.YAMLSemanticError(item, msg));
      }

      const value = doc.resolveNode(item);

      if (key === undefined) {
        items.push(value);
      } else {
        items.push(new _Pair.Pair(key, value));
        key = undefined;
      }

      keyStart = item.range.start;
      next = ',';
    }
  }

  (0, _parseUtils.checkFlowCollectionEnd)(doc.errors, cst);
  if (key !== undefined) items.push(new _Pair.Pair(key));
  return {
    comments,
    items
  };
}

/***/ }),

/***/ 863:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationBeforeRequest;

const btoa = __webpack_require__(675);

const withAuthorizationPrefix = __webpack_require__(143);

function authenticationBeforeRequest(state, options) {
  if (typeof state.auth === "string") {
    options.headers.authorization = withAuthorizationPrefix(state.auth);
    return;
  }

  if (state.auth.username) {
    const hash = btoa(`${state.auth.username}:${state.auth.password}`);
    options.headers.authorization = `Basic ${hash}`;
    if (state.otp) {
      options.headers["x-github-otp"] = state.otp;
    }
    return;
  }

  if (state.auth.clientId) {
    // There is a special case for OAuth applications, when `clientId` and `clientSecret` is passed as
    // Basic Authorization instead of query parameters. The only routes where that applies share the same
    // URL though: `/applications/:client_id/tokens/:access_token`.
    //
    //  1. [Check an authorization](https://developer.github.com/v3/oauth_authorizations/#check-an-authorization)
    //  2. [Reset an authorization](https://developer.github.com/v3/oauth_authorizations/#reset-an-authorization)
    //  3. [Revoke an authorization for an application](https://developer.github.com/v3/oauth_authorizations/#revoke-an-authorization-for-an-application)
    //
    // We identify by checking the URL. It must merge both "/applications/:client_id/tokens/:access_token"
    // as well as "/applications/123/tokens/token456"
    if (/\/applications\/:?[\w_]+\/tokens\/:?[\w_]+($|\?)/.test(options.url)) {
      const hash = btoa(`${state.auth.clientId}:${state.auth.clientSecret}`);
      options.headers.authorization = `Basic ${hash}`;
      return;
    }

    options.url += options.url.indexOf("?") === -1 ? "?" : "&";
    options.url += `client_id=${state.auth.clientId}&client_secret=${state.auth.clientSecret}`;
    return;
  }

  return Promise.resolve()

    .then(() => {
      return state.auth();
    })

    .then(authorization => {
      options.headers.authorization = withAuthorizationPrefix(authorization);
    });
}


/***/ }),

/***/ 866:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

var shebangRegex = __webpack_require__(816);

module.exports = function (str) {
	var match = str.match(shebangRegex);

	if (!match) {
		return null;
	}

	var arr = match[0].replace(/#! ?/, '').split(' ');
	var bin = arr[0].split('/').pop();
	var arg = arr[1];

	return (bin === 'env' ?
		arg :
		bin + (arg ? ' ' + arg : '')
	);
};


/***/ }),

/***/ 880:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.listTagNames = void 0;

var _Collection = __webpack_require__(380);

var _Pair = __webpack_require__(325);

var _Scalar = __webpack_require__(515);

const visit = (node, tags) => {
  if (node && typeof node === 'object') {
    const {
      tag
    } = node;

    if (node instanceof _Collection.Collection) {
      if (tag) tags[tag] = true;
      node.items.forEach(n => visit(n, tags));
    } else if (node instanceof _Pair.Pair) {
      visit(node.key, tags);
      visit(node.value, tags);
    } else if (node instanceof _Scalar.Scalar) {
      if (tag) tags[tag] = true;
    }
  }

  return tags;
};

const listTagNames = node => Object.keys(visit(node, {}));

exports.listTagNames = listTagNames;

/***/ }),

/***/ 881:
/***/ (function(module) {

"use strict";


const isWin = process.platform === 'win32';

function notFoundError(original, syscall) {
    return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: 'ENOENT',
        errno: 'ENOENT',
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args,
    });
}

function hookChildProcess(cp, parsed) {
    if (!isWin) {
        return;
    }

    const originalEmit = cp.emit;

    cp.emit = function (name, arg1) {
        // If emitting "exit" event and exit code is 1, we need to check if
        // the command exists and emit an "error" instead
        // See https://github.com/IndigoUnited/node-cross-spawn/issues/16
        if (name === 'exit') {
            const err = verifyENOENT(arg1, parsed, 'spawn');

            if (err) {
                return originalEmit.call(cp, 'error', err);
            }
        }

        return originalEmit.apply(cp, arguments); // eslint-disable-line prefer-rest-params
    };
}

function verifyENOENT(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawn');
    }

    return null;
}

function verifyENOENTSync(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawnSync');
    }

    return null;
}

module.exports = {
    hookChildProcess,
    verifyENOENT,
    verifyENOENTSync,
    notFoundError,
};


/***/ }),

/***/ 883:
/***/ (function(module) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = isKey(path, object) ? [path] : castPath(path);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}

module.exports = set;


/***/ }),

/***/ 898:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

var request = __webpack_require__(753);
var universalUserAgent = __webpack_require__(796);

const VERSION = "4.4.0";

class GraphqlError extends Error {
  constructor(request, response) {
    const message = response.data.errors[0].message;
    super(message);
    Object.assign(this, response.data);
    this.name = "GraphqlError";
    this.request = request; // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

}

const NON_VARIABLE_OPTIONS = ["method", "baseUrl", "url", "headers", "request", "query", "mediaType"];
function graphql(request, query, options) {
  options = typeof query === "string" ? options = Object.assign({
    query
  }, options) : options = query;
  const requestOptions = Object.keys(options).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = options[key];
      return result;
    }

    if (!result.variables) {
      result.variables = {};
    }

    result.variables[key] = options[key];
    return result;
  }, {});
  return request(requestOptions).then(response => {
    if (response.data.errors) {
      throw new GraphqlError(requestOptions, {
        data: response.data
      });
    }

    return response.data.data;
  });
}

function withDefaults(request$1, newDefaults) {
  const newRequest = request$1.defaults(newDefaults);

  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };

  return Object.assign(newApi, {
    defaults: withDefaults.bind(null, newRequest),
    endpoint: request.request.endpoint
  });
}

const graphql$1 = withDefaults(request.request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  },
  method: "POST",
  url: "/graphql"
});
function withCustomRequest(customRequest) {
  return withDefaults(customRequest, {
    method: "POST",
    url: "/graphql"
  });
}

exports.graphql = graphql$1;
exports.withCustomRequest = withCustomRequest;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 906:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.CollectionItem = void 0;

var _constants = __webpack_require__(383);

var _errors = __webpack_require__(405);

var _BlankLine = __webpack_require__(794);

var _Node = __webpack_require__(974);

var _Range = __webpack_require__(994);

class CollectionItem extends _Node.Node {
  constructor(type, props) {
    super(type, props);
    this.node = null;
  }

  get includesTrailingLines() {
    return !!this.node && this.node.includesTrailingLines;
  }
  /**
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this
   */


  parse(context, start) {
    this.context = context;
    const {
      parseNode,
      src
    } = context;
    let {
      atLineStart,
      lineStart
    } = context;
    if (!atLineStart && this.type === _constants.Type.SEQ_ITEM) this.error = new _errors.YAMLSemanticError(this, 'Sequence items must not have preceding content on the same line');
    const indent = atLineStart ? start - lineStart : context.indent;

    let offset = _Node.Node.endOfWhiteSpace(src, start + 1);

    let ch = src[offset];
    const inlineComment = ch === '#';
    const comments = [];
    let blankLine = null;

    while (ch === '\n' || ch === '#') {
      if (ch === '#') {
        const end = _Node.Node.endOfLine(src, offset + 1);

        comments.push(new _Range.Range(offset, end));
        offset = end;
      } else {
        atLineStart = true;
        lineStart = offset + 1;

        const wsEnd = _Node.Node.endOfWhiteSpace(src, lineStart);

        if (src[wsEnd] === '\n' && comments.length === 0) {
          blankLine = new _BlankLine.BlankLine();
          lineStart = blankLine.parse({
            src
          }, lineStart);
        }

        offset = _Node.Node.endOfIndent(src, lineStart);
      }

      ch = src[offset];
    }

    if (_Node.Node.nextNodeIsIndented(ch, offset - (lineStart + indent), this.type !== _constants.Type.SEQ_ITEM)) {
      this.node = parseNode({
        atLineStart,
        inCollection: false,
        indent,
        lineStart,
        parent: this
      }, offset);
    } else if (ch && lineStart > start + 1) {
      offset = lineStart - 1;
    }

    if (this.node) {
      if (blankLine) {
        // Only blank lines preceding non-empty nodes are captured. Note that
        // this means that collection item range start indices do not always
        // increase monotonically. -- eemeli/yaml#126
        const items = context.parent.items || context.parent.contents;
        if (items) items.push(blankLine);
      }

      if (comments.length) Array.prototype.push.apply(this.props, comments);
      offset = this.node.range.end;
    } else {
      if (inlineComment) {
        const c = comments[0];
        this.props.push(c);
        offset = c.end;
      } else {
        offset = _Node.Node.endOfLine(src, start + 1);
      }
    }

    const end = this.node ? this.node.valueRange.end : offset;
    this.valueRange = new _Range.Range(start, end);
    return offset;
  }

  setOrigRanges(cr, offset) {
    offset = super.setOrigRanges(cr, offset);
    return this.node ? this.node.setOrigRanges(cr, offset) : offset;
  }

  toString() {
    const {
      context: {
        src
      },
      node,
      range,
      value
    } = this;
    if (value != null) return value;
    const str = node ? src.slice(range.start, node.range.start) + String(node) : src.slice(range.start, range.end);
    return _Node.Node.addStringTerminator(src, range.end, str);
  }

}

exports.CollectionItem = CollectionItem;

/***/ }),

/***/ 916:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

const VERSION = "1.0.0";

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */

function requestLog(octokit) {
  octokit.hook.wrap("request", (request, options) => {
    octokit.log.debug("request", options);
    const start = Date.now();
    const requestOptions = octokit.request.endpoint.parse(options);
    const path = requestOptions.url.replace(options.baseUrl, "");
    return request(options).then(response => {
      octokit.log.info(`${requestOptions.method} ${path} - ${response.status} in ${Date.now() - start}ms`);
      return response;
    }).catch(error => {
      octokit.log.info(`${requestOptions.method} ${path} - ${error.status} in ${Date.now() - start}ms`);
      throw error;
    });
  });
}
requestLog.VERSION = VERSION;

exports.requestLog = requestLog;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 923:
/***/ (function(__unusedmodule, exports) {

"use strict";


exports.toJSON = toJSON;

function toJSON(value, arg, ctx) {
  if (Array.isArray(value)) return value.map((v, i) => toJSON(v, String(i), ctx));

  if (value && typeof value.toJSON === 'function') {
    const anchor = ctx && ctx.anchors && ctx.anchors.get(value);
    if (anchor) ctx.onCreate = res => {
      anchor.res = res;
      delete ctx.onCreate;
    };
    const res = value.toJSON(arg, ctx);
    if (anchor && ctx.onCreate) ctx.onCreate(res);
    return res;
  }

  if ((!ctx || !ctx.keep) && typeof value === 'bigint') return Number(value);
  return value;
}

/***/ }),

/***/ 928:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.Document = void 0;

var _constants = __webpack_require__(383);

var _errors = __webpack_require__(405);

var _BlankLine = __webpack_require__(794);

var _Collection = __webpack_require__(641);

var _Comment = __webpack_require__(487);

var _Directive = __webpack_require__(705);

var _Node = __webpack_require__(974);

var _Range = __webpack_require__(994);

class Document extends _Node.Node {
  static startCommentOrEndBlankLine(src, start) {
    const offset = _Node.Node.endOfWhiteSpace(src, start);

    const ch = src[offset];
    return ch === '#' || ch === '\n' ? offset : start;
  }

  constructor() {
    super(_constants.Type.DOCUMENT);
    this.directives = null;
    this.contents = null;
    this.directivesEndMarker = null;
    this.documentEndMarker = null;
  }

  parseDirectives(start) {
    const {
      src
    } = this.context;
    this.directives = [];
    let atLineStart = true;
    let hasDirectives = false;
    let offset = start;

    while (!_Node.Node.atDocumentBoundary(src, offset, _constants.Char.DIRECTIVES_END)) {
      offset = Document.startCommentOrEndBlankLine(src, offset);

      switch (src[offset]) {
        case '\n':
          if (atLineStart) {
            const blankLine = new _BlankLine.BlankLine();
            offset = blankLine.parse({
              src
            }, offset);

            if (offset < src.length) {
              this.directives.push(blankLine);
            }
          } else {
            offset += 1;
            atLineStart = true;
          }

          break;

        case '#':
          {
            const comment = new _Comment.Comment();
            offset = comment.parse({
              src
            }, offset);
            this.directives.push(comment);
            atLineStart = false;
          }
          break;

        case '%':
          {
            const directive = new _Directive.Directive();
            offset = directive.parse({
              parent: this,
              src
            }, offset);
            this.directives.push(directive);
            hasDirectives = true;
            atLineStart = false;
          }
          break;

        default:
          if (hasDirectives) {
            this.error = new _errors.YAMLSemanticError(this, 'Missing directives-end indicator line');
          } else if (this.directives.length > 0) {
            this.contents = this.directives;
            this.directives = [];
          }

          return offset;
      }
    }

    if (src[offset]) {
      this.directivesEndMarker = new _Range.Range(offset, offset + 3);
      return offset + 3;
    }

    if (hasDirectives) {
      this.error = new _errors.YAMLSemanticError(this, 'Missing directives-end indicator line');
    } else if (this.directives.length > 0) {
      this.contents = this.directives;
      this.directives = [];
    }

    return offset;
  }

  parseContents(start) {
    const {
      parseNode,
      src
    } = this.context;
    if (!this.contents) this.contents = [];
    let lineStart = start;

    while (src[lineStart - 1] === '-') lineStart -= 1;

    let offset = _Node.Node.endOfWhiteSpace(src, start);

    let atLineStart = lineStart === start;
    this.valueRange = new _Range.Range(offset);

    while (!_Node.Node.atDocumentBoundary(src, offset, _constants.Char.DOCUMENT_END)) {
      switch (src[offset]) {
        case '\n':
          if (atLineStart) {
            const blankLine = new _BlankLine.BlankLine();
            offset = blankLine.parse({
              src
            }, offset);

            if (offset < src.length) {
              this.contents.push(blankLine);
            }
          } else {
            offset += 1;
            atLineStart = true;
          }

          lineStart = offset;
          break;

        case '#':
          {
            const comment = new _Comment.Comment();
            offset = comment.parse({
              src
            }, offset);
            this.contents.push(comment);
            atLineStart = false;
          }
          break;

        default:
          {
            const iEnd = _Node.Node.endOfIndent(src, offset);

            const context = {
              atLineStart,
              indent: -1,
              inFlow: false,
              inCollection: false,
              lineStart,
              parent: this
            };
            const node = parseNode(context, iEnd);
            if (!node) return this.valueRange.end = iEnd; // at next document start

            this.contents.push(node);
            offset = node.range.end;
            atLineStart = false;
            const ec = (0, _Collection.grabCollectionEndComments)(node);
            if (ec) Array.prototype.push.apply(this.contents, ec);
          }
      }

      offset = Document.startCommentOrEndBlankLine(src, offset);
    }

    this.valueRange.end = offset;

    if (src[offset]) {
      this.documentEndMarker = new _Range.Range(offset, offset + 3);
      offset += 3;

      if (src[offset]) {
        offset = _Node.Node.endOfWhiteSpace(src, offset);

        if (src[offset] === '#') {
          const comment = new _Comment.Comment();
          offset = comment.parse({
            src
          }, offset);
          this.contents.push(comment);
        }

        switch (src[offset]) {
          case '\n':
            offset += 1;
            break;

          case undefined:
            break;

          default:
            this.error = new _errors.YAMLSyntaxError(this, 'Document end marker line cannot have a non-comment suffix');
        }
      }
    }

    return offset;
  }
  /**
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this
   */


  parse(context, start) {
    context.root = this;
    this.context = context;
    const {
      src
    } = context;
    let offset = src.charCodeAt(start) === 0xfeff ? start + 1 : start; // skip BOM

    offset = this.parseDirectives(offset);
    offset = this.parseContents(offset);
    return offset;
  }

  setOrigRanges(cr, offset) {
    offset = super.setOrigRanges(cr, offset);
    this.directives.forEach(node => {
      offset = node.setOrigRanges(cr, offset);
    });
    if (this.directivesEndMarker) offset = this.directivesEndMarker.setOrigRange(cr, offset);
    this.contents.forEach(node => {
      offset = node.setOrigRanges(cr, offset);
    });
    if (this.documentEndMarker) offset = this.documentEndMarker.setOrigRange(cr, offset);
    return offset;
  }

  toString() {
    const {
      contents,
      directives,
      value
    } = this;
    if (value != null) return value;
    let str = directives.join('');

    if (contents.length > 0) {
      if (directives.length > 0 || contents[0].type === _constants.Type.COMMENT) str += '---\n';
      str += contents.join('');
    }

    if (str[str.length - 1] !== '\n') str += '\n';
    return str;
  }

}

exports.Document = Document;

/***/ }),

/***/ 929:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasNextPage

const deprecate = __webpack_require__(370)
const getPageLinks = __webpack_require__(577)

function hasNextPage (link) {
  deprecate(`octokit.hasNextPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).next
}


/***/ }),

/***/ 948:
/***/ (function(module) {

"use strict";


/**
 * Tries to execute a function and discards any error that occurs.
 * @param {Function} fn - Function that might or might not throw an error.
 * @returns {?*} Return-value of the function when no error occurred.
 */
module.exports = function(fn) {

	try { return fn() } catch (e) {}

}

/***/ }),

/***/ 950:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const url = __webpack_require__(835);
function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    }
    else {
        proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    }
    if (proxyVar) {
        proxyUrl = url.parse(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;


/***/ }),

/***/ 954:
/***/ (function(module) {

module.exports = validateAuth;

function validateAuth(auth) {
  if (typeof auth === "string") {
    return;
  }

  if (typeof auth === "function") {
    return;
  }

  if (auth.username && auth.password) {
    return;
  }

  if (auth.clientId && auth.clientSecret) {
    return;
  }

  throw new Error(`Invalid "auth" option: ${JSON.stringify(auth)}`);
}


/***/ }),

/***/ 955:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const path = __webpack_require__(622);
const childProcess = __webpack_require__(129);
const crossSpawn = __webpack_require__(20);
const stripEof = __webpack_require__(768);
const npmRunPath = __webpack_require__(621);
const isStream = __webpack_require__(323);
const _getStream = __webpack_require__(145);
const pFinally = __webpack_require__(697);
const onExit = __webpack_require__(260);
const errname = __webpack_require__(427);
const stdio = __webpack_require__(168);

const TEN_MEGABYTES = 1000 * 1000 * 10;

function handleArgs(cmd, args, opts) {
	let parsed;

	opts = Object.assign({
		extendEnv: true,
		env: {}
	}, opts);

	if (opts.extendEnv) {
		opts.env = Object.assign({}, process.env, opts.env);
	}

	if (opts.__winShell === true) {
		delete opts.__winShell;
		parsed = {
			command: cmd,
			args,
			options: opts,
			file: cmd,
			original: {
				cmd,
				args
			}
		};
	} else {
		parsed = crossSpawn._parse(cmd, args, opts);
	}

	opts = Object.assign({
		maxBuffer: TEN_MEGABYTES,
		buffer: true,
		stripEof: true,
		preferLocal: true,
		localDir: parsed.options.cwd || process.cwd(),
		encoding: 'utf8',
		reject: true,
		cleanup: true
	}, parsed.options);

	opts.stdio = stdio(opts);

	if (opts.preferLocal) {
		opts.env = npmRunPath.env(Object.assign({}, opts, {cwd: opts.localDir}));
	}

	if (opts.detached) {
		// #115
		opts.cleanup = false;
	}

	if (process.platform === 'win32' && path.basename(parsed.command) === 'cmd.exe') {
		// #116
		parsed.args.unshift('/q');
	}

	return {
		cmd: parsed.command,
		args: parsed.args,
		opts,
		parsed
	};
}

function handleInput(spawned, input) {
	if (input === null || input === undefined) {
		return;
	}

	if (isStream(input)) {
		input.pipe(spawned.stdin);
	} else {
		spawned.stdin.end(input);
	}
}

function handleOutput(opts, val) {
	if (val && opts.stripEof) {
		val = stripEof(val);
	}

	return val;
}

function handleShell(fn, cmd, opts) {
	let file = '/bin/sh';
	let args = ['-c', cmd];

	opts = Object.assign({}, opts);

	if (process.platform === 'win32') {
		opts.__winShell = true;
		file = process.env.comspec || 'cmd.exe';
		args = ['/s', '/c', `"${cmd}"`];
		opts.windowsVerbatimArguments = true;
	}

	if (opts.shell) {
		file = opts.shell;
		delete opts.shell;
	}

	return fn(file, args, opts);
}

function getStream(process, stream, {encoding, buffer, maxBuffer}) {
	if (!process[stream]) {
		return null;
	}

	let ret;

	if (!buffer) {
		// TODO: Use `ret = util.promisify(stream.finished)(process[stream]);` when targeting Node.js 10
		ret = new Promise((resolve, reject) => {
			process[stream]
				.once('end', resolve)
				.once('error', reject);
		});
	} else if (encoding) {
		ret = _getStream(process[stream], {
			encoding,
			maxBuffer
		});
	} else {
		ret = _getStream.buffer(process[stream], {maxBuffer});
	}

	return ret.catch(err => {
		err.stream = stream;
		err.message = `${stream} ${err.message}`;
		throw err;
	});
}

function makeError(result, options) {
	const {stdout, stderr} = result;

	let err = result.error;
	const {code, signal} = result;

	const {parsed, joinedCmd} = options;
	const timedOut = options.timedOut || false;

	if (!err) {
		let output = '';

		if (Array.isArray(parsed.opts.stdio)) {
			if (parsed.opts.stdio[2] !== 'inherit') {
				output += output.length > 0 ? stderr : `\n${stderr}`;
			}

			if (parsed.opts.stdio[1] !== 'inherit') {
				output += `\n${stdout}`;
			}
		} else if (parsed.opts.stdio !== 'inherit') {
			output = `\n${stderr}${stdout}`;
		}

		err = new Error(`Command failed: ${joinedCmd}${output}`);
		err.code = code < 0 ? errname(code) : code;
	}

	err.stdout = stdout;
	err.stderr = stderr;
	err.failed = true;
	err.signal = signal || null;
	err.cmd = joinedCmd;
	err.timedOut = timedOut;

	return err;
}

function joinCmd(cmd, args) {
	let joinedCmd = cmd;

	if (Array.isArray(args) && args.length > 0) {
		joinedCmd += ' ' + args.join(' ');
	}

	return joinedCmd;
}

module.exports = (cmd, args, opts) => {
	const parsed = handleArgs(cmd, args, opts);
	const {encoding, buffer, maxBuffer} = parsed.opts;
	const joinedCmd = joinCmd(cmd, args);

	let spawned;
	try {
		spawned = childProcess.spawn(parsed.cmd, parsed.args, parsed.opts);
	} catch (err) {
		return Promise.reject(err);
	}

	let removeExitHandler;
	if (parsed.opts.cleanup) {
		removeExitHandler = onExit(() => {
			spawned.kill();
		});
	}

	let timeoutId = null;
	let timedOut = false;

	const cleanup = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}

		if (removeExitHandler) {
			removeExitHandler();
		}
	};

	if (parsed.opts.timeout > 0) {
		timeoutId = setTimeout(() => {
			timeoutId = null;
			timedOut = true;
			spawned.kill(parsed.opts.killSignal);
		}, parsed.opts.timeout);
	}

	const processDone = new Promise(resolve => {
		spawned.on('exit', (code, signal) => {
			cleanup();
			resolve({code, signal});
		});

		spawned.on('error', err => {
			cleanup();
			resolve({error: err});
		});

		if (spawned.stdin) {
			spawned.stdin.on('error', err => {
				cleanup();
				resolve({error: err});
			});
		}
	});

	function destroy() {
		if (spawned.stdout) {
			spawned.stdout.destroy();
		}

		if (spawned.stderr) {
			spawned.stderr.destroy();
		}
	}

	const handlePromise = () => pFinally(Promise.all([
		processDone,
		getStream(spawned, 'stdout', {encoding, buffer, maxBuffer}),
		getStream(spawned, 'stderr', {encoding, buffer, maxBuffer})
	]).then(arr => {
		const result = arr[0];
		result.stdout = arr[1];
		result.stderr = arr[2];

		if (result.error || result.code !== 0 || result.signal !== null) {
			const err = makeError(result, {
				joinedCmd,
				parsed,
				timedOut
			});

			// TODO: missing some timeout logic for killed
			// https://github.com/nodejs/node/blob/master/lib/child_process.js#L203
			// err.killed = spawned.killed || killed;
			err.killed = err.killed || spawned.killed;

			if (!parsed.opts.reject) {
				return err;
			}

			throw err;
		}

		return {
			stdout: handleOutput(parsed.opts, result.stdout),
			stderr: handleOutput(parsed.opts, result.stderr),
			code: 0,
			failed: false,
			killed: false,
			signal: null,
			cmd: joinedCmd,
			timedOut: false
		};
	}), destroy);

	crossSpawn._enoent.hookChildProcess(spawned, parsed.parsed);

	handleInput(spawned, parsed.opts.input);

	spawned.then = (onfulfilled, onrejected) => handlePromise().then(onfulfilled, onrejected);
	spawned.catch = onrejected => handlePromise().catch(onrejected);

	return spawned;
};

// TODO: set `stderr: 'ignore'` when that option is implemented
module.exports.stdout = (...args) => module.exports(...args).then(x => x.stdout);

// TODO: set `stdout: 'ignore'` when that option is implemented
module.exports.stderr = (...args) => module.exports(...args).then(x => x.stderr);

module.exports.shell = (cmd, opts) => handleShell(module.exports, cmd, opts);

module.exports.sync = (cmd, args, opts) => {
	const parsed = handleArgs(cmd, args, opts);
	const joinedCmd = joinCmd(cmd, args);

	if (isStream(parsed.opts.input)) {
		throw new TypeError('The `input` option cannot be a stream in sync mode');
	}

	const result = childProcess.spawnSync(parsed.cmd, parsed.args, parsed.opts);
	result.code = result.status;

	if (result.error || result.status !== 0 || result.signal !== null) {
		const err = makeError(result, {
			joinedCmd,
			parsed
		});

		if (!parsed.opts.reject) {
			return err;
		}

		throw err;
	}

	return {
		stdout: handleOutput(parsed.opts, result.stdout),
		stderr: handleOutput(parsed.opts, result.stderr),
		code: 0,
		failed: false,
		signal: null,
		cmd: joinedCmd,
		timedOut: false
	};
};

module.exports.shellSync = (cmd, opts) => handleShell(module.exports.sync, cmd, opts);


/***/ }),

/***/ 966:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {PassThrough} = __webpack_require__(413);

module.exports = options => {
	options = Object.assign({}, options);

	const {array} = options;
	let {encoding} = options;
	const buffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || buffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (buffer) {
		encoding = null;
	}

	let len = 0;
	const ret = [];
	const stream = new PassThrough({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	stream.on('data', chunk => {
		ret.push(chunk);

		if (objectMode) {
			len = ret.length;
		} else {
			len += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return ret;
		}

		return buffer ? Buffer.concat(ret, len) : ret.join('');
	};

	stream.getBufferedLength = () => len;

	return stream;
};


/***/ }),

/***/ 968:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.ParseContext = void 0;

var _constants = __webpack_require__(383);

var _errors = __webpack_require__(405);

var _Alias = __webpack_require__(343);

var _BlockValue = __webpack_require__(24);

var _Collection = __webpack_require__(641);

var _CollectionItem = __webpack_require__(906);

var _FlowCollection = __webpack_require__(185);

var _Node = __webpack_require__(974);

var _PlainValue = __webpack_require__(119);

var _QuoteDouble = __webpack_require__(725);

var _QuoteSingle = __webpack_require__(411);

var _Range = __webpack_require__(994);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createNewNode(type, props) {
  switch (type) {
    case _constants.Type.ALIAS:
      return new _Alias.Alias(type, props);

    case _constants.Type.BLOCK_FOLDED:
    case _constants.Type.BLOCK_LITERAL:
      return new _BlockValue.BlockValue(type, props);

    case _constants.Type.FLOW_MAP:
    case _constants.Type.FLOW_SEQ:
      return new _FlowCollection.FlowCollection(type, props);

    case _constants.Type.MAP_KEY:
    case _constants.Type.MAP_VALUE:
    case _constants.Type.SEQ_ITEM:
      return new _CollectionItem.CollectionItem(type, props);

    case _constants.Type.COMMENT:
    case _constants.Type.PLAIN:
      return new _PlainValue.PlainValue(type, props);

    case _constants.Type.QUOTE_DOUBLE:
      return new _QuoteDouble.QuoteDouble(type, props);

    case _constants.Type.QUOTE_SINGLE:
      return new _QuoteSingle.QuoteSingle(type, props);

    /* istanbul ignore next */

    default:
      return null;
    // should never happen
  }
}
/**
 * @param {boolean} atLineStart - Node starts at beginning of line
 * @param {boolean} inFlow - true if currently in a flow context
 * @param {boolean} inCollection - true if currently in a collection context
 * @param {number} indent - Current level of indentation
 * @param {number} lineStart - Start of the current line
 * @param {Node} parent - The parent of the node
 * @param {string} src - Source of the YAML document
 */


class ParseContext {
  static parseType(src, offset, inFlow) {
    switch (src[offset]) {
      case '*':
        return _constants.Type.ALIAS;

      case '>':
        return _constants.Type.BLOCK_FOLDED;

      case '|':
        return _constants.Type.BLOCK_LITERAL;

      case '{':
        return _constants.Type.FLOW_MAP;

      case '[':
        return _constants.Type.FLOW_SEQ;

      case '?':
        return !inFlow && _Node.Node.atBlank(src, offset + 1, true) ? _constants.Type.MAP_KEY : _constants.Type.PLAIN;

      case ':':
        return !inFlow && _Node.Node.atBlank(src, offset + 1, true) ? _constants.Type.MAP_VALUE : _constants.Type.PLAIN;

      case '-':
        return !inFlow && _Node.Node.atBlank(src, offset + 1, true) ? _constants.Type.SEQ_ITEM : _constants.Type.PLAIN;

      case '"':
        return _constants.Type.QUOTE_DOUBLE;

      case "'":
        return _constants.Type.QUOTE_SINGLE;

      default:
        return _constants.Type.PLAIN;
    }
  }

  constructor(orig = {}, {
    atLineStart,
    inCollection,
    inFlow,
    indent,
    lineStart,
    parent
  } = {}) {
    _defineProperty(this, "parseNode", (overlay, start) => {
      if (_Node.Node.atDocumentBoundary(this.src, start)) return null;
      const context = new ParseContext(this, overlay);
      const {
        props,
        type,
        valueStart
      } = context.parseProps(start);
      const node = createNewNode(type, props);
      let offset = node.parse(context, valueStart);
      node.range = new _Range.Range(start, offset);
      /* istanbul ignore if */

      if (offset <= start) {
        // This should never happen, but if it does, let's make sure to at least
        // step one character forward to avoid a busy loop.
        node.error = new Error(`Node#parse consumed no characters`);
        node.error.parseEnd = offset;
        node.error.source = node;
        node.range.end = start + 1;
      }

      if (context.nodeStartsCollection(node)) {
        if (!node.error && !context.atLineStart && context.parent.type === _constants.Type.DOCUMENT) {
          node.error = new _errors.YAMLSyntaxError(node, 'Block collection must not have preceding content here (e.g. directives-end indicator)');
        }

        const collection = new _Collection.Collection(node);
        offset = collection.parse(new ParseContext(context), offset);
        collection.range = new _Range.Range(start, offset);
        return collection;
      }

      return node;
    });

    this.atLineStart = atLineStart != null ? atLineStart : orig.atLineStart || false;
    this.inCollection = inCollection != null ? inCollection : orig.inCollection || false;
    this.inFlow = inFlow != null ? inFlow : orig.inFlow || false;
    this.indent = indent != null ? indent : orig.indent;
    this.lineStart = lineStart != null ? lineStart : orig.lineStart;
    this.parent = parent != null ? parent : orig.parent || {};
    this.root = orig.root;
    this.src = orig.src;
  }

  nodeStartsCollection(node) {
    const {
      inCollection,
      inFlow,
      src
    } = this;
    if (inCollection || inFlow) return false;
    if (node instanceof _CollectionItem.CollectionItem) return true; // check for implicit key

    let offset = node.range.end;
    if (src[offset] === '\n' || src[offset - 1] === '\n') return false;
    offset = _Node.Node.endOfWhiteSpace(src, offset);
    return src[offset] === ':';
  } // Anchor and tag are before type, which determines the node implementation
  // class; hence this intermediate step.


  parseProps(offset) {
    const {
      inFlow,
      parent,
      src
    } = this;
    const props = [];
    let lineHasProps = false;
    offset = _Node.Node.endOfWhiteSpace(src, offset);
    let ch = src[offset];

    while (ch === _constants.Char.ANCHOR || ch === _constants.Char.COMMENT || ch === _constants.Char.TAG || ch === '\n') {
      if (ch === '\n') {
        const lineStart = offset + 1;

        const inEnd = _Node.Node.endOfIndent(src, lineStart);

        const indentDiff = inEnd - (lineStart + this.indent);
        const noIndicatorAsIndent = parent.type === _constants.Type.SEQ_ITEM && parent.context.atLineStart;
        if (!_Node.Node.nextNodeIsIndented(src[inEnd], indentDiff, !noIndicatorAsIndent)) break;
        this.atLineStart = true;
        this.lineStart = lineStart;
        lineHasProps = false;
        offset = inEnd;
      } else if (ch === _constants.Char.COMMENT) {
        const end = _Node.Node.endOfLine(src, offset + 1);

        props.push(new _Range.Range(offset, end));
        offset = end;
      } else {
        let end = _Node.Node.endOfIdentifier(src, offset + 1);

        if (ch === _constants.Char.TAG && src[end] === ',' && /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+,\d\d\d\d(-\d\d){0,2}\/\S/.test(src.slice(offset + 1, end + 13))) {
          // Let's presume we're dealing with a YAML 1.0 domain tag here, rather
          // than an empty but 'foo.bar' private-tagged node in a flow collection
          // followed without whitespace by a plain string starting with a year
          // or date divided by something.
          end = _Node.Node.endOfIdentifier(src, end + 5);
        }

        props.push(new _Range.Range(offset, end));
        lineHasProps = true;
        offset = _Node.Node.endOfWhiteSpace(src, end);
      }

      ch = src[offset];
    } // '- &a : b' has an anchor on an empty node


    if (lineHasProps && ch === ':' && _Node.Node.atBlank(src, offset + 1, true)) offset -= 1;
    const type = ParseContext.parseType(src, offset, inFlow);
    return {
      props,
      type,
      valueStart: offset
    };
  }
  /**
   * Parses a node from the source
   * @param {ParseContext} overlay
   * @param {number} start - Index of first non-whitespace character for the node
   * @returns {?Node} - null if at a document boundary
   */


}

exports.ParseContext = ParseContext;

/***/ }),

/***/ 969:
/***/ (function(module, __unusedexports, __webpack_require__) {

var wrappy = __webpack_require__(11)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 974:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.Node = void 0;

var _constants = __webpack_require__(383);

var _sourceUtils = __webpack_require__(41);

var _Range = __webpack_require__(994);

/** Root class of all nodes */
class Node {
  static addStringTerminator(src, offset, str) {
    if (str[str.length - 1] === '\n') return str;
    const next = Node.endOfWhiteSpace(src, offset);
    return next >= src.length || src[next] === '\n' ? str + '\n' : str;
  } // ^(---|...)


  static atDocumentBoundary(src, offset, sep) {
    const ch0 = src[offset];
    if (!ch0) return true;
    const prev = src[offset - 1];
    if (prev && prev !== '\n') return false;

    if (sep) {
      if (ch0 !== sep) return false;
    } else {
      if (ch0 !== _constants.Char.DIRECTIVES_END && ch0 !== _constants.Char.DOCUMENT_END) return false;
    }

    const ch1 = src[offset + 1];
    const ch2 = src[offset + 2];
    if (ch1 !== ch0 || ch2 !== ch0) return false;
    const ch3 = src[offset + 3];
    return !ch3 || ch3 === '\n' || ch3 === '\t' || ch3 === ' ';
  }

  static endOfIdentifier(src, offset) {
    let ch = src[offset];
    const isVerbatim = ch === '<';
    const notOk = isVerbatim ? ['\n', '\t', ' ', '>'] : ['\n', '\t', ' ', '[', ']', '{', '}', ','];

    while (ch && notOk.indexOf(ch) === -1) ch = src[offset += 1];

    if (isVerbatim && ch === '>') offset += 1;
    return offset;
  }

  static endOfIndent(src, offset) {
    let ch = src[offset];

    while (ch === ' ') ch = src[offset += 1];

    return offset;
  }

  static endOfLine(src, offset) {
    let ch = src[offset];

    while (ch && ch !== '\n') ch = src[offset += 1];

    return offset;
  }

  static endOfWhiteSpace(src, offset) {
    let ch = src[offset];

    while (ch === '\t' || ch === ' ') ch = src[offset += 1];

    return offset;
  }

  static startOfLine(src, offset) {
    let ch = src[offset - 1];
    if (ch === '\n') return offset;

    while (ch && ch !== '\n') ch = src[offset -= 1];

    return offset + 1;
  }
  /**
   * End of indentation, or null if the line's indent level is not more
   * than `indent`
   *
   * @param {string} src
   * @param {number} indent
   * @param {number} lineStart
   * @returns {?number}
   */


  static endOfBlockIndent(src, indent, lineStart) {
    const inEnd = Node.endOfIndent(src, lineStart);

    if (inEnd > lineStart + indent) {
      return inEnd;
    } else {
      const wsEnd = Node.endOfWhiteSpace(src, inEnd);
      const ch = src[wsEnd];
      if (!ch || ch === '\n') return wsEnd;
    }

    return null;
  }

  static atBlank(src, offset, endAsBlank) {
    const ch = src[offset];
    return ch === '\n' || ch === '\t' || ch === ' ' || endAsBlank && !ch;
  }

  static nextNodeIsIndented(ch, indentDiff, indicatorAsIndent) {
    if (!ch || indentDiff < 0) return false;
    if (indentDiff > 0) return true;
    return indicatorAsIndent && ch === '-';
  } // should be at line or string end, or at next non-whitespace char


  static normalizeOffset(src, offset) {
    const ch = src[offset];
    return !ch ? offset : ch !== '\n' && src[offset - 1] === '\n' ? offset - 1 : Node.endOfWhiteSpace(src, offset);
  } // fold single newline into space, multiple newlines to N - 1 newlines
  // presumes src[offset] === '\n'


  static foldNewline(src, offset, indent) {
    let inCount = 0;
    let error = false;
    let fold = '';
    let ch = src[offset + 1];

    while (ch === ' ' || ch === '\t' || ch === '\n') {
      switch (ch) {
        case '\n':
          inCount = 0;
          offset += 1;
          fold += '\n';
          break;

        case '\t':
          if (inCount <= indent) error = true;
          offset = Node.endOfWhiteSpace(src, offset + 2) - 1;
          break;

        case ' ':
          inCount += 1;
          offset += 1;
          break;
      }

      ch = src[offset + 1];
    }

    if (!fold) fold = ' ';
    if (ch && inCount <= indent) error = true;
    return {
      fold,
      offset,
      error
    };
  }

  constructor(type, props, context) {
    Object.defineProperty(this, 'context', {
      value: context || null,
      writable: true
    });
    this.error = null;
    this.range = null;
    this.valueRange = null;
    this.props = props || [];
    this.type = type;
    this.value = null;
  }

  getPropValue(idx, key, skipKey) {
    if (!this.context) return null;
    const {
      src
    } = this.context;
    const prop = this.props[idx];
    return prop && src[prop.start] === key ? src.slice(prop.start + (skipKey ? 1 : 0), prop.end) : null;
  }

  get anchor() {
    for (let i = 0; i < this.props.length; ++i) {
      const anchor = this.getPropValue(i, _constants.Char.ANCHOR, true);
      if (anchor != null) return anchor;
    }

    return null;
  }

  get comment() {
    const comments = [];

    for (let i = 0; i < this.props.length; ++i) {
      const comment = this.getPropValue(i, _constants.Char.COMMENT, true);
      if (comment != null) comments.push(comment);
    }

    return comments.length > 0 ? comments.join('\n') : null;
  }

  commentHasRequiredWhitespace(start) {
    const {
      src
    } = this.context;
    if (this.header && start === this.header.end) return false;
    if (!this.valueRange) return false;
    const {
      end
    } = this.valueRange;
    return start !== end || Node.atBlank(src, end - 1);
  }

  get hasComment() {
    if (this.context) {
      const {
        src
      } = this.context;

      for (let i = 0; i < this.props.length; ++i) {
        if (src[this.props[i].start] === _constants.Char.COMMENT) return true;
      }
    }

    return false;
  }

  get hasProps() {
    if (this.context) {
      const {
        src
      } = this.context;

      for (let i = 0; i < this.props.length; ++i) {
        if (src[this.props[i].start] !== _constants.Char.COMMENT) return true;
      }
    }

    return false;
  }

  get includesTrailingLines() {
    return false;
  }

  get jsonLike() {
    const jsonLikeTypes = [_constants.Type.FLOW_MAP, _constants.Type.FLOW_SEQ, _constants.Type.QUOTE_DOUBLE, _constants.Type.QUOTE_SINGLE];
    return jsonLikeTypes.indexOf(this.type) !== -1;
  }

  get rangeAsLinePos() {
    if (!this.range || !this.context) return undefined;
    const start = (0, _sourceUtils.getLinePos)(this.range.start, this.context.root);
    if (!start) return undefined;
    const end = (0, _sourceUtils.getLinePos)(this.range.end, this.context.root);
    return {
      start,
      end
    };
  }

  get rawValue() {
    if (!this.valueRange || !this.context) return null;
    const {
      start,
      end
    } = this.valueRange;
    return this.context.src.slice(start, end);
  }

  get tag() {
    for (let i = 0; i < this.props.length; ++i) {
      const tag = this.getPropValue(i, _constants.Char.TAG, false);

      if (tag != null) {
        if (tag[1] === '<') {
          return {
            verbatim: tag.slice(2, -1)
          };
        } else {
          // eslint-disable-next-line no-unused-vars
          const [_, handle, suffix] = tag.match(/^(.*!)([^!]*)$/);
          return {
            handle,
            suffix
          };
        }
      }
    }

    return null;
  }

  get valueRangeContainsNewline() {
    if (!this.valueRange || !this.context) return false;
    const {
      start,
      end
    } = this.valueRange;
    const {
      src
    } = this.context;

    for (let i = start; i < end; ++i) {
      if (src[i] === '\n') return true;
    }

    return false;
  }

  parseComment(start) {
    const {
      src
    } = this.context;

    if (src[start] === _constants.Char.COMMENT) {
      const end = Node.endOfLine(src, start + 1);
      const commentRange = new _Range.Range(start, end);
      this.props.push(commentRange);
      return end;
    }

    return start;
  }
  /**
   * Populates the `origStart` and `origEnd` values of all ranges for this
   * node. Extended by child classes to handle descendant nodes.
   *
   * @param {number[]} cr - Positions of dropped CR characters
   * @param {number} offset - Starting index of `cr` from the last call
   * @returns {number} - The next offset, matching the one found for `origStart`
   */


  setOrigRanges(cr, offset) {
    if (this.range) offset = this.range.setOrigRange(cr, offset);
    if (this.valueRange) this.valueRange.setOrigRange(cr, offset);
    this.props.forEach(prop => prop.setOrigRange(cr, offset));
    return offset;
  }

  toString() {
    const {
      context: {
        src
      },
      range,
      value
    } = this;
    if (value != null) return value;
    const str = src.slice(range.start, range.end);
    return Node.addStringTerminator(src, range.end, str);
  }

}

exports.Node = Node;

/***/ }),

/***/ 986:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tr = __importStar(__webpack_require__(686));
/**
 * Exec a command.
 * Output will be streamed to the live console.
 * Returns promise with return code
 *
 * @param     commandLine        command to execute (can include additional args). Must be correctly escaped.
 * @param     args               optional arguments for tool. Escaping is handled by the lib.
 * @param     options            optional exec options.  See ExecOptions
 * @returns   Promise<number>    exit code
 */
function exec(commandLine, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const commandArgs = tr.argStringToArray(commandLine);
        if (commandArgs.length === 0) {
            throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
        }
        // Path to tool to execute should be first arg
        const toolPath = commandArgs[0];
        args = commandArgs.slice(1).concat(args || []);
        const runner = new tr.ToolRunner(toolPath, args, options);
        return runner.exec();
    });
}
exports.exec = exec;
//# sourceMappingURL=exec.js.map

/***/ }),

/***/ 994:
/***/ (function(__unusedmodule, exports) {

"use strict";


exports.Range = void 0;

class Range {
  static copy(orig) {
    return new Range(orig.start, orig.end);
  }

  constructor(start, end) {
    this.start = start;
    this.end = end || start;
  }

  isEmpty() {
    return typeof this.start !== 'number' || !this.end || this.end <= this.start;
  }
  /**
   * Set `origStart` and `origEnd` to point to the original source range for
   * this node, which may differ due to dropped CR characters.
   *
   * @param {number[]} cr - Positions of dropped CR characters
   * @param {number} offset - Starting index of `cr` from the last call
   * @returns {number} - The next offset, matching the one found for `origStart`
   */


  setOrigRange(cr, offset) {
    const {
      start,
      end
    } = this;

    if (cr.length === 0 || end <= cr[0]) {
      this.origStart = start;
      this.origEnd = end;
      return offset;
    }

    let i = offset;

    while (i < cr.length) {
      if (cr[i] > start) break;else ++i;
    }

    this.origStart = start + i;
    const nextOffset = i;

    while (i < cr.length) {
      // if end was at \n, it should now be at \r
      if (cr[i] >= end) break;else ++i;
    }

    this.origEnd = end + i;
    return nextOffset;
  }

}

exports.Range = Range;

/***/ }),

/***/ 996:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


exports.binary = void 0;

var _constants = __webpack_require__(383);

var _errors = __webpack_require__(405);

var _stringify = __webpack_require__(315);

var _string = __webpack_require__(591);

var _options = __webpack_require__(422);

/* global atob, btoa, Buffer */
const binary = {
  identify: value => value instanceof Uint8Array,
  // Buffer inherits from Uint8Array
  default: false,
  tag: 'tag:yaml.org,2002:binary',

  /**
   * Returns a Buffer in node and an Uint8Array in browsers
   *
   * To use the resulting buffer as an image, you'll want to do something like:
   *
   *   const blob = new Blob([buffer], { type: 'image/jpeg' })
   *   document.querySelector('#photo').src = URL.createObjectURL(blob)
   */
  resolve: (doc, node) => {
    const src = (0, _string.resolveString)(doc, node);

    if (typeof Buffer === 'function') {
      return Buffer.from(src, 'base64');
    } else if (typeof atob === 'function') {
      // On IE 11, atob() can't handle newlines
      const str = atob(src.replace(/[\n\r]/g, ''));
      const buffer = new Uint8Array(str.length);

      for (let i = 0; i < str.length; ++i) buffer[i] = str.charCodeAt(i);

      return buffer;
    } else {
      const msg = 'This environment does not support reading binary tags; either Buffer or atob is required';
      doc.errors.push(new _errors.YAMLReferenceError(node, msg));
      return null;
    }
  },
  options: _options.binaryOptions,
  stringify: ({
    comment,
    type,
    value
  }, ctx, onComment, onChompKeep) => {
    let src;

    if (typeof Buffer === 'function') {
      src = value instanceof Buffer ? value.toString('base64') : Buffer.from(value.buffer).toString('base64');
    } else if (typeof btoa === 'function') {
      let s = '';

      for (let i = 0; i < value.length; ++i) s += String.fromCharCode(value[i]);

      src = btoa(s);
    } else {
      throw new Error('This environment does not support writing binary tags; either Buffer or btoa is required');
    }

    if (!type) type = _options.binaryOptions.defaultType;

    if (type === _constants.Type.QUOTE_DOUBLE) {
      value = src;
    } else {
      const {
        lineWidth
      } = _options.binaryOptions;
      const n = Math.ceil(src.length / lineWidth);
      const lines = new Array(n);

      for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
        lines[i] = src.substr(o, lineWidth);
      }

      value = lines.join(type === _constants.Type.BLOCK_LITERAL ? '\n' : ' ');
    }

    return (0, _stringify.stringifyString)({
      comment,
      type,
      value
    }, ctx, onComment, onChompKeep);
  }
};
exports.binary = binary;

/***/ })

/******/ });
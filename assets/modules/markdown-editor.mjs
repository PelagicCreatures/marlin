import {toASCII as $feOm8$toASCII, toUnicode as $feOm8$toUnicode} from "punycode";
import {utils as $feOm8$utils} from "@pelagiccreatures/sargasso";
import {SargassoComponent as $feOm8$SargassoComponent} from "@pelagiccreatures/sargasso/dist/component/index.mjs";

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
var $parcel$global =
typeof globalThis !== 'undefined'
  ? globalThis
  : typeof self !== 'undefined'
  ? self
  : typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
  ? global
  : {};
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequire1f52"];
if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequire1f52"] = parcelRequire;
}
parcelRequire.register("5M8T0", function(module, exports) {
// Main parser class
"use strict";

var $4VIu7 = parcelRequire("4VIu7");

var $1grT5 = parcelRequire("1grT5");

var $7uUUo = parcelRequire("7uUUo");

var $iylQ1 = parcelRequire("iylQ1");

var $d8qw6 = parcelRequire("d8qw6");

var $iu9bw = parcelRequire("iu9bw");

var $7wovu = parcelRequire("7wovu");

var $7stqn = parcelRequire("7stqn");




var $43485410f7520141$var$config = {
    default: (parcelRequire("d17il")),
    zero: (parcelRequire("6sMp4")),
    commonmark: (parcelRequire("5xT2R"))
};
////////////////////////////////////////////////////////////////////////////////
//
// This validator can prohibit more than really needed to prevent XSS. It's a
// tradeoff to keep code simple and to be secure by default.
//
// If you need different setup - override validator method as you wish. Or
// replace it with dummy function and use external sanitizer.
//
var $43485410f7520141$var$BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
var $43485410f7520141$var$GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;
function $43485410f7520141$var$validateLink(url) {
    // url should be normalized at this point, and existing entities are decoded
    var str = url.trim().toLowerCase();
    return $43485410f7520141$var$BAD_PROTO_RE.test(str) ? $43485410f7520141$var$GOOD_DATA_RE.test(str) ? true : false : true;
}
////////////////////////////////////////////////////////////////////////////////
var $43485410f7520141$var$RECODE_HOSTNAME_FOR = [
    "http:",
    "https:",
    "mailto:"
];
function $43485410f7520141$var$normalizeLink(url) {
    var parsed = $7stqn.parse(url, true);
    if (parsed.hostname) {
        // Encode hostnames in urls like:
        // `http://host/`, `https://host/`, `mailto:user@host`, `//host/`
        //
        // We don't encode unknown schemas, because it's likely that we encode
        // something we shouldn't (e.g. `skype:name` treated as `skype:host`)
        //
        if (!parsed.protocol || $43485410f7520141$var$RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) try {
            parsed.hostname = $feOm8$toASCII(parsed.hostname);
        } catch (er) {}
    }
    return $7stqn.encode($7stqn.format(parsed));
}
function $43485410f7520141$var$normalizeLinkText(url) {
    var parsed = $7stqn.parse(url, true);
    if (parsed.hostname) {
        // Encode hostnames in urls like:
        // `http://host/`, `https://host/`, `mailto:user@host`, `//host/`
        //
        // We don't encode unknown schemas, because it's likely that we encode
        // something we shouldn't (e.g. `skype:name` treated as `skype:host`)
        //
        if (!parsed.protocol || $43485410f7520141$var$RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) try {
            parsed.hostname = $feOm8$toUnicode(parsed.hostname);
        } catch (er) {}
    }
    // add '%' to exclude list because of https://github.com/markdown-it/markdown-it/issues/720
    return $7stqn.decode($7stqn.format(parsed), $7stqn.decode.defaultChars + "%");
}
/**
 * class MarkdownIt
 *
 * Main parser/renderer class.
 *
 * ##### Usage
 *
 * ```javascript
 * // node.js, "classic" way:
 * var MarkdownIt = require('markdown-it'),
 *     md = new MarkdownIt();
 * var result = md.render('# markdown-it rulezz!');
 *
 * // node.js, the same, but with sugar:
 * var md = require('markdown-it')();
 * var result = md.render('# markdown-it rulezz!');
 *
 * // browser without AMD, added to "window" on script load
 * // Note, there are no dash.
 * var md = window.markdownit();
 * var result = md.render('# markdown-it rulezz!');
 * ```
 *
 * Single line rendering, without paragraph wrap:
 *
 * ```javascript
 * var md = require('markdown-it')();
 * var result = md.renderInline('__markdown-it__ rulezz!');
 * ```
 **/ /**
 * new MarkdownIt([presetName, options])
 * - presetName (String): optional, `commonmark` / `zero`
 * - options (Object)
 *
 * Creates parser instanse with given config. Can be called without `new`.
 *
 * ##### presetName
 *
 * MarkdownIt provides named presets as a convenience to quickly
 * enable/disable active syntax rules and options for common use cases.
 *
 * - ["commonmark"](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/commonmark.js) -
 *   configures parser to strict [CommonMark](http://commonmark.org/) mode.
 * - [default](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/default.js) -
 *   similar to GFM, used when no preset name given. Enables all available rules,
 *   but still without html, typographer & autolinker.
 * - ["zero"](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/zero.js) -
 *   all rules disabled. Useful to quickly setup your config via `.enable()`.
 *   For example, when you need only `bold` and `italic` markup and nothing else.
 *
 * ##### options:
 *
 * - __html__ - `false`. Set `true` to enable HTML tags in source. Be careful!
 *   That's not safe! You may need external sanitizer to protect output from XSS.
 *   It's better to extend features via plugins, instead of enabling HTML.
 * - __xhtmlOut__ - `false`. Set `true` to add '/' when closing single tags
 *   (`<br />`). This is needed only for full CommonMark compatibility. In real
 *   world you will need HTML output.
 * - __breaks__ - `false`. Set `true` to convert `\n` in paragraphs into `<br>`.
 * - __langPrefix__ - `language-`. CSS language class prefix for fenced blocks.
 *   Can be useful for external highlighters.
 * - __linkify__ - `false`. Set `true` to autoconvert URL-like text to links.
 * - __typographer__  - `false`. Set `true` to enable [some language-neutral
 *   replacement](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js) +
 *   quotes beautification (smartquotes).
 * - __quotes__ - `“”‘’`, String or Array. Double + single quotes replacement
 *   pairs, when typographer enabled and smartquotes on. For example, you can
 *   use `'«»„“'` for Russian, `'„“‚‘'` for German, and
 *   `['«\xA0', '\xA0»', '‹\xA0', '\xA0›']` for French (including nbsp).
 * - __highlight__ - `null`. Highlighter function for fenced code blocks.
 *   Highlighter `function (str, lang)` should return escaped HTML. It can also
 *   return empty string if the source was not changed and should be escaped
 *   externaly. If result starts with <pre... internal wrapper is skipped.
 *
 * ##### Example
 *
 * ```javascript
 * // commonmark mode
 * var md = require('markdown-it')('commonmark');
 *
 * // default mode
 * var md = require('markdown-it')();
 *
 * // enable everything
 * var md = require('markdown-it')({
 *   html: true,
 *   linkify: true,
 *   typographer: true
 * });
 * ```
 *
 * ##### Syntax highlighting
 *
 * ```js
 * var hljs = require('highlight.js') // https://highlightjs.org/
 *
 * var md = require('markdown-it')({
 *   highlight: function (str, lang) {
 *     if (lang && hljs.getLanguage(lang)) {
 *       try {
 *         return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
 *       } catch (__) {}
 *     }
 *
 *     return ''; // use external default escaping
 *   }
 * });
 * ```
 *
 * Or with full wrapper override (if you need assign class to `<pre>`):
 *
 * ```javascript
 * var hljs = require('highlight.js') // https://highlightjs.org/
 *
 * // Actual default values
 * var md = require('markdown-it')({
 *   highlight: function (str, lang) {
 *     if (lang && hljs.getLanguage(lang)) {
 *       try {
 *         return '<pre class="hljs"><code>' +
 *                hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
 *                '</code></pre>';
 *       } catch (__) {}
 *     }
 *
 *     return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
 *   }
 * });
 * ```
 *
 **/ function $43485410f7520141$var$MarkdownIt(presetName, options) {
    if (!(this instanceof $43485410f7520141$var$MarkdownIt)) return new $43485410f7520141$var$MarkdownIt(presetName, options);
    if (!options) {
        if (!$4VIu7.isString(presetName)) {
            options = presetName || {};
            presetName = "default";
        }
    }
    /**
   * MarkdownIt#inline -> ParserInline
   *
   * Instance of [[ParserInline]]. You may need it to add new rules when
   * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
   * [[MarkdownIt.enable]].
   **/ this.inline = new $iu9bw();
    /**
   * MarkdownIt#block -> ParserBlock
   *
   * Instance of [[ParserBlock]]. You may need it to add new rules when
   * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
   * [[MarkdownIt.enable]].
   **/ this.block = new $d8qw6();
    /**
   * MarkdownIt#core -> Core
   *
   * Instance of [[Core]] chain executor. You may need it to add new rules when
   * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
   * [[MarkdownIt.enable]].
   **/ this.core = new $iylQ1();
    /**
   * MarkdownIt#renderer -> Renderer
   *
   * Instance of [[Renderer]]. Use it to modify output look. Or to add rendering
   * rules for new token types, generated by plugins.
   *
   * ##### Example
   *
   * ```javascript
   * var md = require('markdown-it')();
   *
   * function myToken(tokens, idx, options, env, self) {
   *   //...
   *   return result;
   * };
   *
   * md.renderer.rules['my_token'] = myToken
   * ```
   *
   * See [[Renderer]] docs and [source code](https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.js).
   **/ this.renderer = new $7uUUo();
    /**
   * MarkdownIt#linkify -> LinkifyIt
   *
   * [linkify-it](https://github.com/markdown-it/linkify-it) instance.
   * Used by [linkify](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/linkify.js)
   * rule.
   **/ this.linkify = new $7wovu();
    /**
   * MarkdownIt#validateLink(url) -> Boolean
   *
   * Link validation function. CommonMark allows too much in links. By default
   * we disable `javascript:`, `vbscript:`, `file:` schemas, and almost all `data:...` schemas
   * except some embedded image types.
   *
   * You can change this behaviour:
   *
   * ```javascript
   * var md = require('markdown-it')();
   * // enable everything
   * md.validateLink = function () { return true; }
   * ```
   **/ this.validateLink = $43485410f7520141$var$validateLink;
    /**
   * MarkdownIt#normalizeLink(url) -> String
   *
   * Function used to encode link url to a machine-readable format,
   * which includes url-encoding, punycode, etc.
   **/ this.normalizeLink = $43485410f7520141$var$normalizeLink;
    /**
   * MarkdownIt#normalizeLinkText(url) -> String
   *
   * Function used to decode link url to a human-readable format`
   **/ this.normalizeLinkText = $43485410f7520141$var$normalizeLinkText;
    // Expose utils & helpers for easy acces from plugins
    /**
   * MarkdownIt#utils -> utils
   *
   * Assorted utility functions, useful to write plugins. See details
   * [here](https://github.com/markdown-it/markdown-it/blob/master/lib/common/utils.js).
   **/ this.utils = $4VIu7;
    /**
   * MarkdownIt#helpers -> helpers
   *
   * Link components parser functions, useful to write plugins. See details
   * [here](https://github.com/markdown-it/markdown-it/blob/master/lib/helpers).
   **/ this.helpers = $4VIu7.assign({}, $1grT5);
    this.options = {};
    this.configure(presetName);
    if (options) this.set(options);
}
/** chainable
 * MarkdownIt.set(options)
 *
 * Set parser options (in the same format as in constructor). Probably, you
 * will never need it, but you can change options after constructor call.
 *
 * ##### Example
 *
 * ```javascript
 * var md = require('markdown-it')()
 *             .set({ html: true, breaks: true })
 *             .set({ typographer, true });
 * ```
 *
 * __Note:__ To achieve the best possible performance, don't modify a
 * `markdown-it` instance options on the fly. If you need multiple configurations
 * it's best to create multiple instances and initialize each with separate
 * config.
 **/ $43485410f7520141$var$MarkdownIt.prototype.set = function(options) {
    $4VIu7.assign(this.options, options);
    return this;
};
/** chainable, internal
 * MarkdownIt.configure(presets)
 *
 * Batch load of all options and compenent settings. This is internal method,
 * and you probably will not need it. But if you will - see available presets
 * and data structure [here](https://github.com/markdown-it/markdown-it/tree/master/lib/presets)
 *
 * We strongly recommend to use presets instead of direct config loads. That
 * will give better compatibility with next versions.
 **/ $43485410f7520141$var$MarkdownIt.prototype.configure = function(presets) {
    var self = this, presetName;
    if ($4VIu7.isString(presets)) {
        presetName = presets;
        presets = $43485410f7520141$var$config[presetName];
        if (!presets) throw new Error('Wrong `markdown-it` preset "' + presetName + '", check name');
    }
    if (!presets) throw new Error("Wrong `markdown-it` preset, can't be empty");
    if (presets.options) self.set(presets.options);
    if (presets.components) Object.keys(presets.components).forEach(function(name) {
        if (presets.components[name].rules) self[name].ruler.enableOnly(presets.components[name].rules);
        if (presets.components[name].rules2) self[name].ruler2.enableOnly(presets.components[name].rules2);
    });
    return this;
};
/** chainable
 * MarkdownIt.enable(list, ignoreInvalid)
 * - list (String|Array): rule name or list of rule names to enable
 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
 *
 * Enable list or rules. It will automatically find appropriate components,
 * containing rules with given names. If rule not found, and `ignoreInvalid`
 * not set - throws exception.
 *
 * ##### Example
 *
 * ```javascript
 * var md = require('markdown-it')()
 *             .enable(['sub', 'sup'])
 *             .disable('smartquotes');
 * ```
 **/ $43485410f7520141$var$MarkdownIt.prototype.enable = function(list, ignoreInvalid) {
    var result = [];
    if (!Array.isArray(list)) list = [
        list
    ];
    [
        "core",
        "block",
        "inline"
    ].forEach(function(chain) {
        result = result.concat(this[chain].ruler.enable(list, true));
    }, this);
    result = result.concat(this.inline.ruler2.enable(list, true));
    var missed = list.filter(function(name) {
        return result.indexOf(name) < 0;
    });
    if (missed.length && !ignoreInvalid) throw new Error("MarkdownIt. Failed to enable unknown rule(s): " + missed);
    return this;
};
/** chainable
 * MarkdownIt.disable(list, ignoreInvalid)
 * - list (String|Array): rule name or list of rule names to disable.
 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
 *
 * The same as [[MarkdownIt.enable]], but turn specified rules off.
 **/ $43485410f7520141$var$MarkdownIt.prototype.disable = function(list, ignoreInvalid) {
    var result = [];
    if (!Array.isArray(list)) list = [
        list
    ];
    [
        "core",
        "block",
        "inline"
    ].forEach(function(chain) {
        result = result.concat(this[chain].ruler.disable(list, true));
    }, this);
    result = result.concat(this.inline.ruler2.disable(list, true));
    var missed = list.filter(function(name) {
        return result.indexOf(name) < 0;
    });
    if (missed.length && !ignoreInvalid) throw new Error("MarkdownIt. Failed to disable unknown rule(s): " + missed);
    return this;
};
/** chainable
 * MarkdownIt.use(plugin, params)
 *
 * Load specified plugin with given params into current parser instance.
 * It's just a sugar to call `plugin(md, params)` with curring.
 *
 * ##### Example
 *
 * ```javascript
 * var iterator = require('markdown-it-for-inline');
 * var md = require('markdown-it')()
 *             .use(iterator, 'foo_replace', 'text', function (tokens, idx) {
 *               tokens[idx].content = tokens[idx].content.replace(/foo/g, 'bar');
 *             });
 * ```
 **/ $43485410f7520141$var$MarkdownIt.prototype.use = function(plugin /*, params, ... */ ) {
    var args = [
        this
    ].concat(Array.prototype.slice.call(arguments, 1));
    plugin.apply(plugin, args);
    return this;
};
/** internal
 * MarkdownIt.parse(src, env) -> Array
 * - src (String): source string
 * - env (Object): environment sandbox
 *
 * Parse input string and return list of block tokens (special token type
 * "inline" will contain list of inline tokens). You should not call this
 * method directly, until you write custom renderer (for example, to produce
 * AST).
 *
 * `env` is used to pass data between "distributed" rules and return additional
 * metadata like reference info, needed for the renderer. It also can be used to
 * inject data in specific cases. Usually, you will be ok to pass `{}`,
 * and then pass updated object to renderer.
 **/ $43485410f7520141$var$MarkdownIt.prototype.parse = function(src, env) {
    if (typeof src !== "string") throw new Error("Input data should be a String");
    var state = new this.core.State(src, this, env);
    this.core.process(state);
    return state.tokens;
};
/**
 * MarkdownIt.render(src [, env]) -> String
 * - src (String): source string
 * - env (Object): environment sandbox
 *
 * Render markdown string into html. It does all magic for you :).
 *
 * `env` can be used to inject additional metadata (`{}` by default).
 * But you will not need it with high probability. See also comment
 * in [[MarkdownIt.parse]].
 **/ $43485410f7520141$var$MarkdownIt.prototype.render = function(src, env) {
    env = env || {};
    return this.renderer.render(this.parse(src, env), this.options, env);
};
/** internal
 * MarkdownIt.parseInline(src, env) -> Array
 * - src (String): source string
 * - env (Object): environment sandbox
 *
 * The same as [[MarkdownIt.parse]] but skip all block rules. It returns the
 * block tokens list with the single `inline` element, containing parsed inline
 * tokens in `children` property. Also updates `env` object.
 **/ $43485410f7520141$var$MarkdownIt.prototype.parseInline = function(src, env) {
    var state = new this.core.State(src, this, env);
    state.inlineMode = true;
    this.core.process(state);
    return state.tokens;
};
/**
 * MarkdownIt.renderInline(src [, env]) -> String
 * - src (String): source string
 * - env (Object): environment sandbox
 *
 * Similar to [[MarkdownIt.render]] but for single paragraph content. Result
 * will NOT be wrapped into `<p>` tags.
 **/ $43485410f7520141$var$MarkdownIt.prototype.renderInline = function(src, env) {
    env = env || {};
    return this.renderer.render(this.parseInline(src, env), this.options, env);
};
module.exports = $43485410f7520141$var$MarkdownIt;

});
parcelRequire.register("4VIu7", function(module, exports) {

$parcel$export(module.exports, "lib", () => $396efe11655d8e86$export$16c08b91f883959a, (v) => $396efe11655d8e86$export$16c08b91f883959a = v);
$parcel$export(module.exports, "assign", () => $396efe11655d8e86$export$e6e34fd1f2686227, (v) => $396efe11655d8e86$export$e6e34fd1f2686227 = v);
$parcel$export(module.exports, "isString", () => $396efe11655d8e86$export$844ec244b1367d54, (v) => $396efe11655d8e86$export$844ec244b1367d54 = v);
$parcel$export(module.exports, "has", () => $396efe11655d8e86$export$a4f4bb6b1453fff5, (v) => $396efe11655d8e86$export$a4f4bb6b1453fff5 = v);
$parcel$export(module.exports, "unescapeMd", () => $396efe11655d8e86$export$5ccde1ea0c14bb03, (v) => $396efe11655d8e86$export$5ccde1ea0c14bb03 = v);
$parcel$export(module.exports, "unescapeAll", () => $396efe11655d8e86$export$db8a17c6655f7e2c, (v) => $396efe11655d8e86$export$db8a17c6655f7e2c = v);
$parcel$export(module.exports, "isValidEntityCode", () => $396efe11655d8e86$export$644a8f5b13b2a36d, (v) => $396efe11655d8e86$export$644a8f5b13b2a36d = v);
$parcel$export(module.exports, "fromCodePoint", () => $396efe11655d8e86$export$73bfc63873071f74, (v) => $396efe11655d8e86$export$73bfc63873071f74 = v);
$parcel$export(module.exports, "escapeHtml", () => $396efe11655d8e86$export$4cf11838cdc2a8a8, (v) => $396efe11655d8e86$export$4cf11838cdc2a8a8 = v);
$parcel$export(module.exports, "arrayReplaceAt", () => $396efe11655d8e86$export$f78478f71955b6bc, (v) => $396efe11655d8e86$export$f78478f71955b6bc = v);
$parcel$export(module.exports, "isSpace", () => $396efe11655d8e86$export$1d5ccafae59b4926, (v) => $396efe11655d8e86$export$1d5ccafae59b4926 = v);
$parcel$export(module.exports, "isWhiteSpace", () => $396efe11655d8e86$export$3c52dd84024ae72c, (v) => $396efe11655d8e86$export$3c52dd84024ae72c = v);
$parcel$export(module.exports, "isMdAsciiPunct", () => $396efe11655d8e86$export$829a0d33ae4e744, (v) => $396efe11655d8e86$export$829a0d33ae4e744 = v);
$parcel$export(module.exports, "isPunctChar", () => $396efe11655d8e86$export$4888a643af800fc1, (v) => $396efe11655d8e86$export$4888a643af800fc1 = v);
$parcel$export(module.exports, "escapeRE", () => $396efe11655d8e86$export$bc616c8f7dc20d5d, (v) => $396efe11655d8e86$export$bc616c8f7dc20d5d = v);
$parcel$export(module.exports, "normalizeReference", () => $396efe11655d8e86$export$20ef46802c8744b, (v) => $396efe11655d8e86$export$20ef46802c8744b = v);
// Utilities
//
////////////////////////////////////////////////////////////////////////////////
// Re-export libraries commonly used in both markdown-it and its plugins,
// so plugins won't have to depend on them explicitly, which reduces their
// bundled size (e.g. a browser build).
//
var $396efe11655d8e86$export$16c08b91f883959a;
var $396efe11655d8e86$export$e6e34fd1f2686227;
var $396efe11655d8e86$export$844ec244b1367d54;
var $396efe11655d8e86$export$a4f4bb6b1453fff5;
var $396efe11655d8e86$export$5ccde1ea0c14bb03;
var $396efe11655d8e86$export$db8a17c6655f7e2c;
var $396efe11655d8e86$export$644a8f5b13b2a36d;
var $396efe11655d8e86$export$73bfc63873071f74;
// exports.replaceEntities     = replaceEntities;
var $396efe11655d8e86$export$4cf11838cdc2a8a8;
var $396efe11655d8e86$export$f78478f71955b6bc;
var $396efe11655d8e86$export$1d5ccafae59b4926;
var $396efe11655d8e86$export$3c52dd84024ae72c;
var $396efe11655d8e86$export$829a0d33ae4e744;
var $396efe11655d8e86$export$4888a643af800fc1;
var $396efe11655d8e86$export$bc616c8f7dc20d5d;
var $396efe11655d8e86$export$20ef46802c8744b;
"use strict";
function $396efe11655d8e86$var$_class(obj) {
    return Object.prototype.toString.call(obj);
}
function $396efe11655d8e86$var$isString(obj) {
    return $396efe11655d8e86$var$_class(obj) === "[object String]";
}
var $396efe11655d8e86$var$_hasOwnProperty = Object.prototype.hasOwnProperty;
function $396efe11655d8e86$var$has(object, key) {
    return $396efe11655d8e86$var$_hasOwnProperty.call(object, key);
}
// Merge objects
//
function $396efe11655d8e86$var$assign(obj /*from1, from2, from3, ...*/ ) {
    var sources = Array.prototype.slice.call(arguments, 1);
    sources.forEach(function(source) {
        if (!source) return;
        if (typeof source !== "object") throw new TypeError(source + "must be object");
        Object.keys(source).forEach(function(key) {
            obj[key] = source[key];
        });
    });
    return obj;
}
// Remove element from array and put another array at those position.
// Useful for some operations with tokens
function $396efe11655d8e86$var$arrayReplaceAt(src, pos, newElements) {
    return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
}
////////////////////////////////////////////////////////////////////////////////
function $396efe11655d8e86$var$isValidEntityCode(c) {
    /*eslint no-bitwise:0*/ // broken sequence
    if (c >= 0xD800 && c <= 0xDFFF) return false;
    // never used
    if (c >= 0xFDD0 && c <= 0xFDEF) return false;
    if ((c & 0xFFFF) === 0xFFFF || (c & 0xFFFF) === 0xFFFE) return false;
    // control codes
    if (c >= 0x00 && c <= 0x08) return false;
    if (c === 0x0B) return false;
    if (c >= 0x0E && c <= 0x1F) return false;
    if (c >= 0x7F && c <= 0x9F) return false;
    // out of range
    if (c > 0x10FFFF) return false;
    return true;
}
function $396efe11655d8e86$var$fromCodePoint(c) {
    /*eslint no-bitwise:0*/ if (c > 0xffff) {
        c -= 0x10000;
        var surrogate1 = 0xd800 + (c >> 10), surrogate2 = 0xdc00 + (c & 0x3ff);
        return String.fromCharCode(surrogate1, surrogate2);
    }
    return String.fromCharCode(c);
}
var $396efe11655d8e86$var$UNESCAPE_MD_RE = /\\([!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])/g;
var $396efe11655d8e86$var$ENTITY_RE = /&([a-z#][a-z0-9]{1,31});/gi;
var $396efe11655d8e86$var$UNESCAPE_ALL_RE = new RegExp($396efe11655d8e86$var$UNESCAPE_MD_RE.source + "|" + $396efe11655d8e86$var$ENTITY_RE.source, "gi");
var $396efe11655d8e86$var$DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))/i;

var $lY0a3 = parcelRequire("lY0a3");
function $396efe11655d8e86$var$replaceEntityPattern(match, name) {
    var code = 0;
    if ($396efe11655d8e86$var$has($lY0a3, name)) return $lY0a3[name];
    if (name.charCodeAt(0) === 0x23 /* # */  && $396efe11655d8e86$var$DIGITAL_ENTITY_TEST_RE.test(name)) {
        code = name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
        if ($396efe11655d8e86$var$isValidEntityCode(code)) return $396efe11655d8e86$var$fromCodePoint(code);
    }
    return match;
}
/*function replaceEntities(str) {
  if (str.indexOf('&') < 0) { return str; }

  return str.replace(ENTITY_RE, replaceEntityPattern);
}*/ function $396efe11655d8e86$var$unescapeMd(str) {
    if (str.indexOf("\\") < 0) return str;
    return str.replace($396efe11655d8e86$var$UNESCAPE_MD_RE, "$1");
}
function $396efe11655d8e86$var$unescapeAll(str) {
    if (str.indexOf("\\") < 0 && str.indexOf("&") < 0) return str;
    return str.replace($396efe11655d8e86$var$UNESCAPE_ALL_RE, function(match, escaped, entity) {
        if (escaped) return escaped;
        return $396efe11655d8e86$var$replaceEntityPattern(match, entity);
    });
}
////////////////////////////////////////////////////////////////////////////////
var $396efe11655d8e86$var$HTML_ESCAPE_TEST_RE = /[&<>"]/;
var $396efe11655d8e86$var$HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
var $396efe11655d8e86$var$HTML_REPLACEMENTS = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
};
function $396efe11655d8e86$var$replaceUnsafeChar(ch) {
    return $396efe11655d8e86$var$HTML_REPLACEMENTS[ch];
}
function $396efe11655d8e86$var$escapeHtml(str) {
    if ($396efe11655d8e86$var$HTML_ESCAPE_TEST_RE.test(str)) return str.replace($396efe11655d8e86$var$HTML_ESCAPE_REPLACE_RE, $396efe11655d8e86$var$replaceUnsafeChar);
    return str;
}
////////////////////////////////////////////////////////////////////////////////
var $396efe11655d8e86$var$REGEXP_ESCAPE_RE = /[.?*+^$[\]\\(){}|-]/g;
function $396efe11655d8e86$var$escapeRE(str) {
    return str.replace($396efe11655d8e86$var$REGEXP_ESCAPE_RE, "\\$&");
}
////////////////////////////////////////////////////////////////////////////////
function $396efe11655d8e86$var$isSpace(code) {
    switch(code){
        case 0x09:
        case 0x20:
            return true;
    }
    return false;
}
// Zs (unicode class) || [\t\f\v\r\n]
function $396efe11655d8e86$var$isWhiteSpace(code) {
    if (code >= 0x2000 && code <= 0x200A) return true;
    switch(code){
        case 0x09:
        case 0x0A:
        case 0x0B:
        case 0x0C:
        case 0x0D:
        case 0x20:
        case 0xA0:
        case 0x1680:
        case 0x202F:
        case 0x205F:
        case 0x3000:
            return true;
    }
    return false;
}

var $27rhI = parcelRequire("27rhI");
// Currently without astral characters support.
function $396efe11655d8e86$var$isPunctChar(ch) {
    return $27rhI.test(ch);
}
// Markdown ASCII punctuation characters.
//
// !, ", #, $, %, &, ', (, ), *, +, ,, -, ., /, :, ;, <, =, >, ?, @, [, \, ], ^, _, `, {, |, }, or ~
// http://spec.commonmark.org/0.15/#ascii-punctuation-character
//
// Don't confuse with unicode punctuation !!! It lacks some chars in ascii range.
//
function $396efe11655d8e86$var$isMdAsciiPunct(ch) {
    switch(ch){
        case 0x21 /* ! */ :
        case 0x22 /* " */ :
        case 0x23 /* # */ :
        case 0x24 /* $ */ :
        case 0x25 /* % */ :
        case 0x26 /* & */ :
        case 0x27 /* ' */ :
        case 0x28 /* ( */ :
        case 0x29 /* ) */ :
        case 0x2A /* * */ :
        case 0x2B /* + */ :
        case 0x2C /* , */ :
        case 0x2D /* - */ :
        case 0x2E /* . */ :
        case 0x2F /* / */ :
        case 0x3A /* : */ :
        case 0x3B /* ; */ :
        case 0x3C /* < */ :
        case 0x3D /* = */ :
        case 0x3E /* > */ :
        case 0x3F /* ? */ :
        case 0x40 /* @ */ :
        case 0x5B /* [ */ :
        case 0x5C /* \ */ :
        case 0x5D /* ] */ :
        case 0x5E /* ^ */ :
        case 0x5F /* _ */ :
        case 0x60 /* ` */ :
        case 0x7B /* { */ :
        case 0x7C /* | */ :
        case 0x7D /* } */ :
        case 0x7E /* ~ */ :
            return true;
        default:
            return false;
    }
}
// Hepler to unify [reference labels].
//
function $396efe11655d8e86$var$normalizeReference(str) {
    // Trim and collapse whitespace
    //
    str = str.trim().replace(/\s+/g, " ");
    // In node v10 'ẞ'.toLowerCase() === 'Ṿ', which is presumed to be a bug
    // fixed in v12 (couldn't find any details).
    //
    // So treat this one as a special case
    // (remove this when node v10 is no longer supported).
    //
    if ("ẞ".toLowerCase() === "Ṿ") str = str.replace(/ẞ/g, "\xdf");
    // .toLowerCase().toUpperCase() should get rid of all differences
    // between letter variants.
    //
    // Simple .toLowerCase() doesn't normalize 125 code points correctly,
    // and .toUpperCase doesn't normalize 6 of them (list of exceptions:
    // İ, ϴ, ẞ, Ω, K, Å - those are already uppercased, but have differently
    // uppercased versions).
    //
    // Here's an example showing how it happens. Lets take greek letter omega:
    // uppercase U+0398 (Θ), U+03f4 (ϴ) and lowercase U+03b8 (θ), U+03d1 (ϑ)
    //
    // Unicode entries:
    // 0398;GREEK CAPITAL LETTER THETA;Lu;0;L;;;;;N;;;;03B8;
    // 03B8;GREEK SMALL LETTER THETA;Ll;0;L;;;;;N;;;0398;;0398
    // 03D1;GREEK THETA SYMBOL;Ll;0;L;<compat> 03B8;;;;N;GREEK SMALL LETTER SCRIPT THETA;;0398;;0398
    // 03F4;GREEK CAPITAL THETA SYMBOL;Lu;0;L;<compat> 0398;;;;N;;;;03B8;
    //
    // Case-insensitive comparison should treat all of them as equivalent.
    //
    // But .toLowerCase() doesn't change ϑ (it's already lowercase),
    // and .toUpperCase() doesn't change ϴ (already uppercase).
    //
    // Applying first lower then upper case normalizes any character:
    // '\u0398\u03f4\u03b8\u03d1'.toLowerCase().toUpperCase() === '\u0398\u0398\u0398\u0398'
    //
    // Note: this is equivalent to unicode case folding; unicode normalization
    // is a different step that is not required here.
    //
    // Final result should be uppercased, because it's later stored in an object
    // (this avoid a conflict with Object.prototype members,
    // most notably, `__proto__`)
    //
    return str.toLowerCase().toUpperCase();
}
$396efe11655d8e86$export$16c08b91f883959a = {};

$396efe11655d8e86$export$16c08b91f883959a.mdurl = (parcelRequire("7stqn"));

$396efe11655d8e86$export$16c08b91f883959a.ucmicro = (parcelRequire("a4dIX"));
$396efe11655d8e86$export$e6e34fd1f2686227 = $396efe11655d8e86$var$assign;
$396efe11655d8e86$export$844ec244b1367d54 = $396efe11655d8e86$var$isString;
$396efe11655d8e86$export$a4f4bb6b1453fff5 = $396efe11655d8e86$var$has;
$396efe11655d8e86$export$5ccde1ea0c14bb03 = $396efe11655d8e86$var$unescapeMd;
$396efe11655d8e86$export$db8a17c6655f7e2c = $396efe11655d8e86$var$unescapeAll;
$396efe11655d8e86$export$644a8f5b13b2a36d = $396efe11655d8e86$var$isValidEntityCode;
$396efe11655d8e86$export$73bfc63873071f74 = $396efe11655d8e86$var$fromCodePoint;
$396efe11655d8e86$export$4cf11838cdc2a8a8 = $396efe11655d8e86$var$escapeHtml;
$396efe11655d8e86$export$f78478f71955b6bc = $396efe11655d8e86$var$arrayReplaceAt;
$396efe11655d8e86$export$1d5ccafae59b4926 = $396efe11655d8e86$var$isSpace;
$396efe11655d8e86$export$3c52dd84024ae72c = $396efe11655d8e86$var$isWhiteSpace;
$396efe11655d8e86$export$829a0d33ae4e744 = $396efe11655d8e86$var$isMdAsciiPunct;
$396efe11655d8e86$export$4888a643af800fc1 = $396efe11655d8e86$var$isPunctChar;
$396efe11655d8e86$export$bc616c8f7dc20d5d = $396efe11655d8e86$var$escapeRE;
$396efe11655d8e86$export$20ef46802c8744b = $396efe11655d8e86$var$normalizeReference;

});
parcelRequire.register("lY0a3", function(module, exports) {
// HTML5 entities map: { name -> utf16string }
//
"use strict";

/*eslint quotes:0*/ module.exports = (parcelRequire("kSoFO"));

});
parcelRequire.register("kSoFO", function(module, exports) {
module.exports = JSON.parse('{"Aacute":"\xc1","aacute":"\xe1","Abreve":"Ă","abreve":"ă","ac":"∾","acd":"∿","acE":"∾̳","Acirc":"\xc2","acirc":"\xe2","acute":"\xb4","Acy":"А","acy":"а","AElig":"\xc6","aelig":"\xe6","af":"⁡","Afr":"\uD835\uDD04","afr":"\uD835\uDD1E","Agrave":"\xc0","agrave":"\xe0","alefsym":"ℵ","aleph":"ℵ","Alpha":"Α","alpha":"α","Amacr":"Ā","amacr":"ā","amalg":"⨿","amp":"&","AMP":"&","andand":"⩕","And":"⩓","and":"∧","andd":"⩜","andslope":"⩘","andv":"⩚","ang":"∠","ange":"⦤","angle":"∠","angmsdaa":"⦨","angmsdab":"⦩","angmsdac":"⦪","angmsdad":"⦫","angmsdae":"⦬","angmsdaf":"⦭","angmsdag":"⦮","angmsdah":"⦯","angmsd":"∡","angrt":"∟","angrtvb":"⊾","angrtvbd":"⦝","angsph":"∢","angst":"\xc5","angzarr":"⍼","Aogon":"Ą","aogon":"ą","Aopf":"\uD835\uDD38","aopf":"\uD835\uDD52","apacir":"⩯","ap":"≈","apE":"⩰","ape":"≊","apid":"≋","apos":"\'","ApplyFunction":"⁡","approx":"≈","approxeq":"≊","Aring":"\xc5","aring":"\xe5","Ascr":"\uD835\uDC9C","ascr":"\uD835\uDCB6","Assign":"≔","ast":"*","asymp":"≈","asympeq":"≍","Atilde":"\xc3","atilde":"\xe3","Auml":"\xc4","auml":"\xe4","awconint":"∳","awint":"⨑","backcong":"≌","backepsilon":"϶","backprime":"‵","backsim":"∽","backsimeq":"⋍","Backslash":"∖","Barv":"⫧","barvee":"⊽","barwed":"⌅","Barwed":"⌆","barwedge":"⌅","bbrk":"⎵","bbrktbrk":"⎶","bcong":"≌","Bcy":"Б","bcy":"б","bdquo":"„","becaus":"∵","because":"∵","Because":"∵","bemptyv":"⦰","bepsi":"϶","bernou":"ℬ","Bernoullis":"ℬ","Beta":"Β","beta":"β","beth":"ℶ","between":"≬","Bfr":"\uD835\uDD05","bfr":"\uD835\uDD1F","bigcap":"⋂","bigcirc":"◯","bigcup":"⋃","bigodot":"⨀","bigoplus":"⨁","bigotimes":"⨂","bigsqcup":"⨆","bigstar":"★","bigtriangledown":"▽","bigtriangleup":"△","biguplus":"⨄","bigvee":"⋁","bigwedge":"⋀","bkarow":"⤍","blacklozenge":"⧫","blacksquare":"▪","blacktriangle":"▴","blacktriangledown":"▾","blacktriangleleft":"◂","blacktriangleright":"▸","blank":"␣","blk12":"▒","blk14":"░","blk34":"▓","block":"█","bne":"=⃥","bnequiv":"≡⃥","bNot":"⫭","bnot":"⌐","Bopf":"\uD835\uDD39","bopf":"\uD835\uDD53","bot":"⊥","bottom":"⊥","bowtie":"⋈","boxbox":"⧉","boxdl":"┐","boxdL":"╕","boxDl":"╖","boxDL":"╗","boxdr":"┌","boxdR":"╒","boxDr":"╓","boxDR":"╔","boxh":"─","boxH":"═","boxhd":"┬","boxHd":"╤","boxhD":"╥","boxHD":"╦","boxhu":"┴","boxHu":"╧","boxhU":"╨","boxHU":"╩","boxminus":"⊟","boxplus":"⊞","boxtimes":"⊠","boxul":"┘","boxuL":"╛","boxUl":"╜","boxUL":"╝","boxur":"└","boxuR":"╘","boxUr":"╙","boxUR":"╚","boxv":"│","boxV":"║","boxvh":"┼","boxvH":"╪","boxVh":"╫","boxVH":"╬","boxvl":"┤","boxvL":"╡","boxVl":"╢","boxVL":"╣","boxvr":"├","boxvR":"╞","boxVr":"╟","boxVR":"╠","bprime":"‵","breve":"˘","Breve":"˘","brvbar":"\xa6","bscr":"\uD835\uDCB7","Bscr":"ℬ","bsemi":"⁏","bsim":"∽","bsime":"⋍","bsolb":"⧅","bsol":"\\\\","bsolhsub":"⟈","bull":"•","bullet":"•","bump":"≎","bumpE":"⪮","bumpe":"≏","Bumpeq":"≎","bumpeq":"≏","Cacute":"Ć","cacute":"ć","capand":"⩄","capbrcup":"⩉","capcap":"⩋","cap":"∩","Cap":"⋒","capcup":"⩇","capdot":"⩀","CapitalDifferentialD":"ⅅ","caps":"∩︀","caret":"⁁","caron":"ˇ","Cayleys":"ℭ","ccaps":"⩍","Ccaron":"Č","ccaron":"č","Ccedil":"\xc7","ccedil":"\xe7","Ccirc":"Ĉ","ccirc":"ĉ","Cconint":"∰","ccups":"⩌","ccupssm":"⩐","Cdot":"Ċ","cdot":"ċ","cedil":"\xb8","Cedilla":"\xb8","cemptyv":"⦲","cent":"\xa2","centerdot":"\xb7","CenterDot":"\xb7","cfr":"\uD835\uDD20","Cfr":"ℭ","CHcy":"Ч","chcy":"ч","check":"✓","checkmark":"✓","Chi":"Χ","chi":"χ","circ":"ˆ","circeq":"≗","circlearrowleft":"↺","circlearrowright":"↻","circledast":"⊛","circledcirc":"⊚","circleddash":"⊝","CircleDot":"⊙","circledR":"\xae","circledS":"Ⓢ","CircleMinus":"⊖","CirclePlus":"⊕","CircleTimes":"⊗","cir":"○","cirE":"⧃","cire":"≗","cirfnint":"⨐","cirmid":"⫯","cirscir":"⧂","ClockwiseContourIntegral":"∲","CloseCurlyDoubleQuote":"”","CloseCurlyQuote":"’","clubs":"♣","clubsuit":"♣","colon":":","Colon":"∷","Colone":"⩴","colone":"≔","coloneq":"≔","comma":",","commat":"@","comp":"∁","compfn":"∘","complement":"∁","complexes":"ℂ","cong":"≅","congdot":"⩭","Congruent":"≡","conint":"∮","Conint":"∯","ContourIntegral":"∮","copf":"\uD835\uDD54","Copf":"ℂ","coprod":"∐","Coproduct":"∐","copy":"\xa9","COPY":"\xa9","copysr":"℗","CounterClockwiseContourIntegral":"∳","crarr":"↵","cross":"✗","Cross":"⨯","Cscr":"\uD835\uDC9E","cscr":"\uD835\uDCB8","csub":"⫏","csube":"⫑","csup":"⫐","csupe":"⫒","ctdot":"⋯","cudarrl":"⤸","cudarrr":"⤵","cuepr":"⋞","cuesc":"⋟","cularr":"↶","cularrp":"⤽","cupbrcap":"⩈","cupcap":"⩆","CupCap":"≍","cup":"∪","Cup":"⋓","cupcup":"⩊","cupdot":"⊍","cupor":"⩅","cups":"∪︀","curarr":"↷","curarrm":"⤼","curlyeqprec":"⋞","curlyeqsucc":"⋟","curlyvee":"⋎","curlywedge":"⋏","curren":"\xa4","curvearrowleft":"↶","curvearrowright":"↷","cuvee":"⋎","cuwed":"⋏","cwconint":"∲","cwint":"∱","cylcty":"⌭","dagger":"†","Dagger":"‡","daleth":"ℸ","darr":"↓","Darr":"↡","dArr":"⇓","dash":"‐","Dashv":"⫤","dashv":"⊣","dbkarow":"⤏","dblac":"˝","Dcaron":"Ď","dcaron":"ď","Dcy":"Д","dcy":"д","ddagger":"‡","ddarr":"⇊","DD":"ⅅ","dd":"ⅆ","DDotrahd":"⤑","ddotseq":"⩷","deg":"\xb0","Del":"∇","Delta":"Δ","delta":"δ","demptyv":"⦱","dfisht":"⥿","Dfr":"\uD835\uDD07","dfr":"\uD835\uDD21","dHar":"⥥","dharl":"⇃","dharr":"⇂","DiacriticalAcute":"\xb4","DiacriticalDot":"˙","DiacriticalDoubleAcute":"˝","DiacriticalGrave":"`","DiacriticalTilde":"˜","diam":"⋄","diamond":"⋄","Diamond":"⋄","diamondsuit":"♦","diams":"♦","die":"\xa8","DifferentialD":"ⅆ","digamma":"ϝ","disin":"⋲","div":"\xf7","divide":"\xf7","divideontimes":"⋇","divonx":"⋇","DJcy":"Ђ","djcy":"ђ","dlcorn":"⌞","dlcrop":"⌍","dollar":"$","Dopf":"\uD835\uDD3B","dopf":"\uD835\uDD55","Dot":"\xa8","dot":"˙","DotDot":"⃜","doteq":"≐","doteqdot":"≑","DotEqual":"≐","dotminus":"∸","dotplus":"∔","dotsquare":"⊡","doublebarwedge":"⌆","DoubleContourIntegral":"∯","DoubleDot":"\xa8","DoubleDownArrow":"⇓","DoubleLeftArrow":"⇐","DoubleLeftRightArrow":"⇔","DoubleLeftTee":"⫤","DoubleLongLeftArrow":"⟸","DoubleLongLeftRightArrow":"⟺","DoubleLongRightArrow":"⟹","DoubleRightArrow":"⇒","DoubleRightTee":"⊨","DoubleUpArrow":"⇑","DoubleUpDownArrow":"⇕","DoubleVerticalBar":"∥","DownArrowBar":"⤓","downarrow":"↓","DownArrow":"↓","Downarrow":"⇓","DownArrowUpArrow":"⇵","DownBreve":"̑","downdownarrows":"⇊","downharpoonleft":"⇃","downharpoonright":"⇂","DownLeftRightVector":"⥐","DownLeftTeeVector":"⥞","DownLeftVectorBar":"⥖","DownLeftVector":"↽","DownRightTeeVector":"⥟","DownRightVectorBar":"⥗","DownRightVector":"⇁","DownTeeArrow":"↧","DownTee":"⊤","drbkarow":"⤐","drcorn":"⌟","drcrop":"⌌","Dscr":"\uD835\uDC9F","dscr":"\uD835\uDCB9","DScy":"Ѕ","dscy":"ѕ","dsol":"⧶","Dstrok":"Đ","dstrok":"đ","dtdot":"⋱","dtri":"▿","dtrif":"▾","duarr":"⇵","duhar":"⥯","dwangle":"⦦","DZcy":"Џ","dzcy":"џ","dzigrarr":"⟿","Eacute":"\xc9","eacute":"\xe9","easter":"⩮","Ecaron":"Ě","ecaron":"ě","Ecirc":"\xca","ecirc":"\xea","ecir":"≖","ecolon":"≕","Ecy":"Э","ecy":"э","eDDot":"⩷","Edot":"Ė","edot":"ė","eDot":"≑","ee":"ⅇ","efDot":"≒","Efr":"\uD835\uDD08","efr":"\uD835\uDD22","eg":"⪚","Egrave":"\xc8","egrave":"\xe8","egs":"⪖","egsdot":"⪘","el":"⪙","Element":"∈","elinters":"⏧","ell":"ℓ","els":"⪕","elsdot":"⪗","Emacr":"Ē","emacr":"ē","empty":"∅","emptyset":"∅","EmptySmallSquare":"◻","emptyv":"∅","EmptyVerySmallSquare":"▫","emsp13":" ","emsp14":" ","emsp":" ","ENG":"Ŋ","eng":"ŋ","ensp":" ","Eogon":"Ę","eogon":"ę","Eopf":"\uD835\uDD3C","eopf":"\uD835\uDD56","epar":"⋕","eparsl":"⧣","eplus":"⩱","epsi":"ε","Epsilon":"Ε","epsilon":"ε","epsiv":"ϵ","eqcirc":"≖","eqcolon":"≕","eqsim":"≂","eqslantgtr":"⪖","eqslantless":"⪕","Equal":"⩵","equals":"=","EqualTilde":"≂","equest":"≟","Equilibrium":"⇌","equiv":"≡","equivDD":"⩸","eqvparsl":"⧥","erarr":"⥱","erDot":"≓","escr":"ℯ","Escr":"ℰ","esdot":"≐","Esim":"⩳","esim":"≂","Eta":"Η","eta":"η","ETH":"\xd0","eth":"\xf0","Euml":"\xcb","euml":"\xeb","euro":"€","excl":"!","exist":"∃","Exists":"∃","expectation":"ℰ","exponentiale":"ⅇ","ExponentialE":"ⅇ","fallingdotseq":"≒","Fcy":"Ф","fcy":"ф","female":"♀","ffilig":"ﬃ","fflig":"ﬀ","ffllig":"ﬄ","Ffr":"\uD835\uDD09","ffr":"\uD835\uDD23","filig":"ﬁ","FilledSmallSquare":"◼","FilledVerySmallSquare":"▪","fjlig":"fj","flat":"♭","fllig":"ﬂ","fltns":"▱","fnof":"ƒ","Fopf":"\uD835\uDD3D","fopf":"\uD835\uDD57","forall":"∀","ForAll":"∀","fork":"⋔","forkv":"⫙","Fouriertrf":"ℱ","fpartint":"⨍","frac12":"\xbd","frac13":"⅓","frac14":"\xbc","frac15":"⅕","frac16":"⅙","frac18":"⅛","frac23":"⅔","frac25":"⅖","frac34":"\xbe","frac35":"⅗","frac38":"⅜","frac45":"⅘","frac56":"⅚","frac58":"⅝","frac78":"⅞","frasl":"⁄","frown":"⌢","fscr":"\uD835\uDCBB","Fscr":"ℱ","gacute":"ǵ","Gamma":"Γ","gamma":"γ","Gammad":"Ϝ","gammad":"ϝ","gap":"⪆","Gbreve":"Ğ","gbreve":"ğ","Gcedil":"Ģ","Gcirc":"Ĝ","gcirc":"ĝ","Gcy":"Г","gcy":"г","Gdot":"Ġ","gdot":"ġ","ge":"≥","gE":"≧","gEl":"⪌","gel":"⋛","geq":"≥","geqq":"≧","geqslant":"⩾","gescc":"⪩","ges":"⩾","gesdot":"⪀","gesdoto":"⪂","gesdotol":"⪄","gesl":"⋛︀","gesles":"⪔","Gfr":"\uD835\uDD0A","gfr":"\uD835\uDD24","gg":"≫","Gg":"⋙","ggg":"⋙","gimel":"ℷ","GJcy":"Ѓ","gjcy":"ѓ","gla":"⪥","gl":"≷","glE":"⪒","glj":"⪤","gnap":"⪊","gnapprox":"⪊","gne":"⪈","gnE":"≩","gneq":"⪈","gneqq":"≩","gnsim":"⋧","Gopf":"\uD835\uDD3E","gopf":"\uD835\uDD58","grave":"`","GreaterEqual":"≥","GreaterEqualLess":"⋛","GreaterFullEqual":"≧","GreaterGreater":"⪢","GreaterLess":"≷","GreaterSlantEqual":"⩾","GreaterTilde":"≳","Gscr":"\uD835\uDCA2","gscr":"ℊ","gsim":"≳","gsime":"⪎","gsiml":"⪐","gtcc":"⪧","gtcir":"⩺","gt":">","GT":">","Gt":"≫","gtdot":"⋗","gtlPar":"⦕","gtquest":"⩼","gtrapprox":"⪆","gtrarr":"⥸","gtrdot":"⋗","gtreqless":"⋛","gtreqqless":"⪌","gtrless":"≷","gtrsim":"≳","gvertneqq":"≩︀","gvnE":"≩︀","Hacek":"ˇ","hairsp":" ","half":"\xbd","hamilt":"ℋ","HARDcy":"Ъ","hardcy":"ъ","harrcir":"⥈","harr":"↔","hArr":"⇔","harrw":"↭","Hat":"^","hbar":"ℏ","Hcirc":"Ĥ","hcirc":"ĥ","hearts":"♥","heartsuit":"♥","hellip":"…","hercon":"⊹","hfr":"\uD835\uDD25","Hfr":"ℌ","HilbertSpace":"ℋ","hksearow":"⤥","hkswarow":"⤦","hoarr":"⇿","homtht":"∻","hookleftarrow":"↩","hookrightarrow":"↪","hopf":"\uD835\uDD59","Hopf":"ℍ","horbar":"―","HorizontalLine":"─","hscr":"\uD835\uDCBD","Hscr":"ℋ","hslash":"ℏ","Hstrok":"Ħ","hstrok":"ħ","HumpDownHump":"≎","HumpEqual":"≏","hybull":"⁃","hyphen":"‐","Iacute":"\xcd","iacute":"\xed","ic":"⁣","Icirc":"\xce","icirc":"\xee","Icy":"И","icy":"и","Idot":"İ","IEcy":"Е","iecy":"е","iexcl":"\xa1","iff":"⇔","ifr":"\uD835\uDD26","Ifr":"ℑ","Igrave":"\xcc","igrave":"\xec","ii":"ⅈ","iiiint":"⨌","iiint":"∭","iinfin":"⧜","iiota":"℩","IJlig":"Ĳ","ijlig":"ĳ","Imacr":"Ī","imacr":"ī","image":"ℑ","ImaginaryI":"ⅈ","imagline":"ℐ","imagpart":"ℑ","imath":"ı","Im":"ℑ","imof":"⊷","imped":"Ƶ","Implies":"⇒","incare":"℅","in":"∈","infin":"∞","infintie":"⧝","inodot":"ı","intcal":"⊺","int":"∫","Int":"∬","integers":"ℤ","Integral":"∫","intercal":"⊺","Intersection":"⋂","intlarhk":"⨗","intprod":"⨼","InvisibleComma":"⁣","InvisibleTimes":"⁢","IOcy":"Ё","iocy":"ё","Iogon":"Į","iogon":"į","Iopf":"\uD835\uDD40","iopf":"\uD835\uDD5A","Iota":"Ι","iota":"ι","iprod":"⨼","iquest":"\xbf","iscr":"\uD835\uDCBE","Iscr":"ℐ","isin":"∈","isindot":"⋵","isinE":"⋹","isins":"⋴","isinsv":"⋳","isinv":"∈","it":"⁢","Itilde":"Ĩ","itilde":"ĩ","Iukcy":"І","iukcy":"і","Iuml":"\xcf","iuml":"\xef","Jcirc":"Ĵ","jcirc":"ĵ","Jcy":"Й","jcy":"й","Jfr":"\uD835\uDD0D","jfr":"\uD835\uDD27","jmath":"ȷ","Jopf":"\uD835\uDD41","jopf":"\uD835\uDD5B","Jscr":"\uD835\uDCA5","jscr":"\uD835\uDCBF","Jsercy":"Ј","jsercy":"ј","Jukcy":"Є","jukcy":"є","Kappa":"Κ","kappa":"κ","kappav":"ϰ","Kcedil":"Ķ","kcedil":"ķ","Kcy":"К","kcy":"к","Kfr":"\uD835\uDD0E","kfr":"\uD835\uDD28","kgreen":"ĸ","KHcy":"Х","khcy":"х","KJcy":"Ќ","kjcy":"ќ","Kopf":"\uD835\uDD42","kopf":"\uD835\uDD5C","Kscr":"\uD835\uDCA6","kscr":"\uD835\uDCC0","lAarr":"⇚","Lacute":"Ĺ","lacute":"ĺ","laemptyv":"⦴","lagran":"ℒ","Lambda":"Λ","lambda":"λ","lang":"⟨","Lang":"⟪","langd":"⦑","langle":"⟨","lap":"⪅","Laplacetrf":"ℒ","laquo":"\xab","larrb":"⇤","larrbfs":"⤟","larr":"←","Larr":"↞","lArr":"⇐","larrfs":"⤝","larrhk":"↩","larrlp":"↫","larrpl":"⤹","larrsim":"⥳","larrtl":"↢","latail":"⤙","lAtail":"⤛","lat":"⪫","late":"⪭","lates":"⪭︀","lbarr":"⤌","lBarr":"⤎","lbbrk":"❲","lbrace":"{","lbrack":"[","lbrke":"⦋","lbrksld":"⦏","lbrkslu":"⦍","Lcaron":"Ľ","lcaron":"ľ","Lcedil":"Ļ","lcedil":"ļ","lceil":"⌈","lcub":"{","Lcy":"Л","lcy":"л","ldca":"⤶","ldquo":"“","ldquor":"„","ldrdhar":"⥧","ldrushar":"⥋","ldsh":"↲","le":"≤","lE":"≦","LeftAngleBracket":"⟨","LeftArrowBar":"⇤","leftarrow":"←","LeftArrow":"←","Leftarrow":"⇐","LeftArrowRightArrow":"⇆","leftarrowtail":"↢","LeftCeiling":"⌈","LeftDoubleBracket":"⟦","LeftDownTeeVector":"⥡","LeftDownVectorBar":"⥙","LeftDownVector":"⇃","LeftFloor":"⌊","leftharpoondown":"↽","leftharpoonup":"↼","leftleftarrows":"⇇","leftrightarrow":"↔","LeftRightArrow":"↔","Leftrightarrow":"⇔","leftrightarrows":"⇆","leftrightharpoons":"⇋","leftrightsquigarrow":"↭","LeftRightVector":"⥎","LeftTeeArrow":"↤","LeftTee":"⊣","LeftTeeVector":"⥚","leftthreetimes":"⋋","LeftTriangleBar":"⧏","LeftTriangle":"⊲","LeftTriangleEqual":"⊴","LeftUpDownVector":"⥑","LeftUpTeeVector":"⥠","LeftUpVectorBar":"⥘","LeftUpVector":"↿","LeftVectorBar":"⥒","LeftVector":"↼","lEg":"⪋","leg":"⋚","leq":"≤","leqq":"≦","leqslant":"⩽","lescc":"⪨","les":"⩽","lesdot":"⩿","lesdoto":"⪁","lesdotor":"⪃","lesg":"⋚︀","lesges":"⪓","lessapprox":"⪅","lessdot":"⋖","lesseqgtr":"⋚","lesseqqgtr":"⪋","LessEqualGreater":"⋚","LessFullEqual":"≦","LessGreater":"≶","lessgtr":"≶","LessLess":"⪡","lesssim":"≲","LessSlantEqual":"⩽","LessTilde":"≲","lfisht":"⥼","lfloor":"⌊","Lfr":"\uD835\uDD0F","lfr":"\uD835\uDD29","lg":"≶","lgE":"⪑","lHar":"⥢","lhard":"↽","lharu":"↼","lharul":"⥪","lhblk":"▄","LJcy":"Љ","ljcy":"љ","llarr":"⇇","ll":"≪","Ll":"⋘","llcorner":"⌞","Lleftarrow":"⇚","llhard":"⥫","lltri":"◺","Lmidot":"Ŀ","lmidot":"ŀ","lmoustache":"⎰","lmoust":"⎰","lnap":"⪉","lnapprox":"⪉","lne":"⪇","lnE":"≨","lneq":"⪇","lneqq":"≨","lnsim":"⋦","loang":"⟬","loarr":"⇽","lobrk":"⟦","longleftarrow":"⟵","LongLeftArrow":"⟵","Longleftarrow":"⟸","longleftrightarrow":"⟷","LongLeftRightArrow":"⟷","Longleftrightarrow":"⟺","longmapsto":"⟼","longrightarrow":"⟶","LongRightArrow":"⟶","Longrightarrow":"⟹","looparrowleft":"↫","looparrowright":"↬","lopar":"⦅","Lopf":"\uD835\uDD43","lopf":"\uD835\uDD5D","loplus":"⨭","lotimes":"⨴","lowast":"∗","lowbar":"_","LowerLeftArrow":"↙","LowerRightArrow":"↘","loz":"◊","lozenge":"◊","lozf":"⧫","lpar":"(","lparlt":"⦓","lrarr":"⇆","lrcorner":"⌟","lrhar":"⇋","lrhard":"⥭","lrm":"‎","lrtri":"⊿","lsaquo":"‹","lscr":"\uD835\uDCC1","Lscr":"ℒ","lsh":"↰","Lsh":"↰","lsim":"≲","lsime":"⪍","lsimg":"⪏","lsqb":"[","lsquo":"‘","lsquor":"‚","Lstrok":"Ł","lstrok":"ł","ltcc":"⪦","ltcir":"⩹","lt":"<","LT":"<","Lt":"≪","ltdot":"⋖","lthree":"⋋","ltimes":"⋉","ltlarr":"⥶","ltquest":"⩻","ltri":"◃","ltrie":"⊴","ltrif":"◂","ltrPar":"⦖","lurdshar":"⥊","luruhar":"⥦","lvertneqq":"≨︀","lvnE":"≨︀","macr":"\xaf","male":"♂","malt":"✠","maltese":"✠","Map":"⤅","map":"↦","mapsto":"↦","mapstodown":"↧","mapstoleft":"↤","mapstoup":"↥","marker":"▮","mcomma":"⨩","Mcy":"М","mcy":"м","mdash":"—","mDDot":"∺","measuredangle":"∡","MediumSpace":" ","Mellintrf":"ℳ","Mfr":"\uD835\uDD10","mfr":"\uD835\uDD2A","mho":"℧","micro":"\xb5","midast":"*","midcir":"⫰","mid":"∣","middot":"\xb7","minusb":"⊟","minus":"−","minusd":"∸","minusdu":"⨪","MinusPlus":"∓","mlcp":"⫛","mldr":"…","mnplus":"∓","models":"⊧","Mopf":"\uD835\uDD44","mopf":"\uD835\uDD5E","mp":"∓","mscr":"\uD835\uDCC2","Mscr":"ℳ","mstpos":"∾","Mu":"Μ","mu":"μ","multimap":"⊸","mumap":"⊸","nabla":"∇","Nacute":"Ń","nacute":"ń","nang":"∠⃒","nap":"≉","napE":"⩰̸","napid":"≋̸","napos":"ŉ","napprox":"≉","natural":"♮","naturals":"ℕ","natur":"♮","nbsp":"\xa0","nbump":"≎̸","nbumpe":"≏̸","ncap":"⩃","Ncaron":"Ň","ncaron":"ň","Ncedil":"Ņ","ncedil":"ņ","ncong":"≇","ncongdot":"⩭̸","ncup":"⩂","Ncy":"Н","ncy":"н","ndash":"–","nearhk":"⤤","nearr":"↗","neArr":"⇗","nearrow":"↗","ne":"≠","nedot":"≐̸","NegativeMediumSpace":"​","NegativeThickSpace":"​","NegativeThinSpace":"​","NegativeVeryThinSpace":"​","nequiv":"≢","nesear":"⤨","nesim":"≂̸","NestedGreaterGreater":"≫","NestedLessLess":"≪","NewLine":"\\n","nexist":"∄","nexists":"∄","Nfr":"\uD835\uDD11","nfr":"\uD835\uDD2B","ngE":"≧̸","nge":"≱","ngeq":"≱","ngeqq":"≧̸","ngeqslant":"⩾̸","nges":"⩾̸","nGg":"⋙̸","ngsim":"≵","nGt":"≫⃒","ngt":"≯","ngtr":"≯","nGtv":"≫̸","nharr":"↮","nhArr":"⇎","nhpar":"⫲","ni":"∋","nis":"⋼","nisd":"⋺","niv":"∋","NJcy":"Њ","njcy":"њ","nlarr":"↚","nlArr":"⇍","nldr":"‥","nlE":"≦̸","nle":"≰","nleftarrow":"↚","nLeftarrow":"⇍","nleftrightarrow":"↮","nLeftrightarrow":"⇎","nleq":"≰","nleqq":"≦̸","nleqslant":"⩽̸","nles":"⩽̸","nless":"≮","nLl":"⋘̸","nlsim":"≴","nLt":"≪⃒","nlt":"≮","nltri":"⋪","nltrie":"⋬","nLtv":"≪̸","nmid":"∤","NoBreak":"⁠","NonBreakingSpace":"\xa0","nopf":"\uD835\uDD5F","Nopf":"ℕ","Not":"⫬","not":"\xac","NotCongruent":"≢","NotCupCap":"≭","NotDoubleVerticalBar":"∦","NotElement":"∉","NotEqual":"≠","NotEqualTilde":"≂̸","NotExists":"∄","NotGreater":"≯","NotGreaterEqual":"≱","NotGreaterFullEqual":"≧̸","NotGreaterGreater":"≫̸","NotGreaterLess":"≹","NotGreaterSlantEqual":"⩾̸","NotGreaterTilde":"≵","NotHumpDownHump":"≎̸","NotHumpEqual":"≏̸","notin":"∉","notindot":"⋵̸","notinE":"⋹̸","notinva":"∉","notinvb":"⋷","notinvc":"⋶","NotLeftTriangleBar":"⧏̸","NotLeftTriangle":"⋪","NotLeftTriangleEqual":"⋬","NotLess":"≮","NotLessEqual":"≰","NotLessGreater":"≸","NotLessLess":"≪̸","NotLessSlantEqual":"⩽̸","NotLessTilde":"≴","NotNestedGreaterGreater":"⪢̸","NotNestedLessLess":"⪡̸","notni":"∌","notniva":"∌","notnivb":"⋾","notnivc":"⋽","NotPrecedes":"⊀","NotPrecedesEqual":"⪯̸","NotPrecedesSlantEqual":"⋠","NotReverseElement":"∌","NotRightTriangleBar":"⧐̸","NotRightTriangle":"⋫","NotRightTriangleEqual":"⋭","NotSquareSubset":"⊏̸","NotSquareSubsetEqual":"⋢","NotSquareSuperset":"⊐̸","NotSquareSupersetEqual":"⋣","NotSubset":"⊂⃒","NotSubsetEqual":"⊈","NotSucceeds":"⊁","NotSucceedsEqual":"⪰̸","NotSucceedsSlantEqual":"⋡","NotSucceedsTilde":"≿̸","NotSuperset":"⊃⃒","NotSupersetEqual":"⊉","NotTilde":"≁","NotTildeEqual":"≄","NotTildeFullEqual":"≇","NotTildeTilde":"≉","NotVerticalBar":"∤","nparallel":"∦","npar":"∦","nparsl":"⫽⃥","npart":"∂̸","npolint":"⨔","npr":"⊀","nprcue":"⋠","nprec":"⊀","npreceq":"⪯̸","npre":"⪯̸","nrarrc":"⤳̸","nrarr":"↛","nrArr":"⇏","nrarrw":"↝̸","nrightarrow":"↛","nRightarrow":"⇏","nrtri":"⋫","nrtrie":"⋭","nsc":"⊁","nsccue":"⋡","nsce":"⪰̸","Nscr":"\uD835\uDCA9","nscr":"\uD835\uDCC3","nshortmid":"∤","nshortparallel":"∦","nsim":"≁","nsime":"≄","nsimeq":"≄","nsmid":"∤","nspar":"∦","nsqsube":"⋢","nsqsupe":"⋣","nsub":"⊄","nsubE":"⫅̸","nsube":"⊈","nsubset":"⊂⃒","nsubseteq":"⊈","nsubseteqq":"⫅̸","nsucc":"⊁","nsucceq":"⪰̸","nsup":"⊅","nsupE":"⫆̸","nsupe":"⊉","nsupset":"⊃⃒","nsupseteq":"⊉","nsupseteqq":"⫆̸","ntgl":"≹","Ntilde":"\xd1","ntilde":"\xf1","ntlg":"≸","ntriangleleft":"⋪","ntrianglelefteq":"⋬","ntriangleright":"⋫","ntrianglerighteq":"⋭","Nu":"Ν","nu":"ν","num":"#","numero":"№","numsp":" ","nvap":"≍⃒","nvdash":"⊬","nvDash":"⊭","nVdash":"⊮","nVDash":"⊯","nvge":"≥⃒","nvgt":">⃒","nvHarr":"⤄","nvinfin":"⧞","nvlArr":"⤂","nvle":"≤⃒","nvlt":"<⃒","nvltrie":"⊴⃒","nvrArr":"⤃","nvrtrie":"⊵⃒","nvsim":"∼⃒","nwarhk":"⤣","nwarr":"↖","nwArr":"⇖","nwarrow":"↖","nwnear":"⤧","Oacute":"\xd3","oacute":"\xf3","oast":"⊛","Ocirc":"\xd4","ocirc":"\xf4","ocir":"⊚","Ocy":"О","ocy":"о","odash":"⊝","Odblac":"Ő","odblac":"ő","odiv":"⨸","odot":"⊙","odsold":"⦼","OElig":"Œ","oelig":"œ","ofcir":"⦿","Ofr":"\uD835\uDD12","ofr":"\uD835\uDD2C","ogon":"˛","Ograve":"\xd2","ograve":"\xf2","ogt":"⧁","ohbar":"⦵","ohm":"Ω","oint":"∮","olarr":"↺","olcir":"⦾","olcross":"⦻","oline":"‾","olt":"⧀","Omacr":"Ō","omacr":"ō","Omega":"Ω","omega":"ω","Omicron":"Ο","omicron":"ο","omid":"⦶","ominus":"⊖","Oopf":"\uD835\uDD46","oopf":"\uD835\uDD60","opar":"⦷","OpenCurlyDoubleQuote":"“","OpenCurlyQuote":"‘","operp":"⦹","oplus":"⊕","orarr":"↻","Or":"⩔","or":"∨","ord":"⩝","order":"ℴ","orderof":"ℴ","ordf":"\xaa","ordm":"\xba","origof":"⊶","oror":"⩖","orslope":"⩗","orv":"⩛","oS":"Ⓢ","Oscr":"\uD835\uDCAA","oscr":"ℴ","Oslash":"\xd8","oslash":"\xf8","osol":"⊘","Otilde":"\xd5","otilde":"\xf5","otimesas":"⨶","Otimes":"⨷","otimes":"⊗","Ouml":"\xd6","ouml":"\xf6","ovbar":"⌽","OverBar":"‾","OverBrace":"⏞","OverBracket":"⎴","OverParenthesis":"⏜","para":"\xb6","parallel":"∥","par":"∥","parsim":"⫳","parsl":"⫽","part":"∂","PartialD":"∂","Pcy":"П","pcy":"п","percnt":"%","period":".","permil":"‰","perp":"⊥","pertenk":"‱","Pfr":"\uD835\uDD13","pfr":"\uD835\uDD2D","Phi":"Φ","phi":"φ","phiv":"ϕ","phmmat":"ℳ","phone":"☎","Pi":"Π","pi":"π","pitchfork":"⋔","piv":"ϖ","planck":"ℏ","planckh":"ℎ","plankv":"ℏ","plusacir":"⨣","plusb":"⊞","pluscir":"⨢","plus":"+","plusdo":"∔","plusdu":"⨥","pluse":"⩲","PlusMinus":"\xb1","plusmn":"\xb1","plussim":"⨦","plustwo":"⨧","pm":"\xb1","Poincareplane":"ℌ","pointint":"⨕","popf":"\uD835\uDD61","Popf":"ℙ","pound":"\xa3","prap":"⪷","Pr":"⪻","pr":"≺","prcue":"≼","precapprox":"⪷","prec":"≺","preccurlyeq":"≼","Precedes":"≺","PrecedesEqual":"⪯","PrecedesSlantEqual":"≼","PrecedesTilde":"≾","preceq":"⪯","precnapprox":"⪹","precneqq":"⪵","precnsim":"⋨","pre":"⪯","prE":"⪳","precsim":"≾","prime":"′","Prime":"″","primes":"ℙ","prnap":"⪹","prnE":"⪵","prnsim":"⋨","prod":"∏","Product":"∏","profalar":"⌮","profline":"⌒","profsurf":"⌓","prop":"∝","Proportional":"∝","Proportion":"∷","propto":"∝","prsim":"≾","prurel":"⊰","Pscr":"\uD835\uDCAB","pscr":"\uD835\uDCC5","Psi":"Ψ","psi":"ψ","puncsp":" ","Qfr":"\uD835\uDD14","qfr":"\uD835\uDD2E","qint":"⨌","qopf":"\uD835\uDD62","Qopf":"ℚ","qprime":"⁗","Qscr":"\uD835\uDCAC","qscr":"\uD835\uDCC6","quaternions":"ℍ","quatint":"⨖","quest":"?","questeq":"≟","quot":"\\"","QUOT":"\\"","rAarr":"⇛","race":"∽̱","Racute":"Ŕ","racute":"ŕ","radic":"√","raemptyv":"⦳","rang":"⟩","Rang":"⟫","rangd":"⦒","range":"⦥","rangle":"⟩","raquo":"\xbb","rarrap":"⥵","rarrb":"⇥","rarrbfs":"⤠","rarrc":"⤳","rarr":"→","Rarr":"↠","rArr":"⇒","rarrfs":"⤞","rarrhk":"↪","rarrlp":"↬","rarrpl":"⥅","rarrsim":"⥴","Rarrtl":"⤖","rarrtl":"↣","rarrw":"↝","ratail":"⤚","rAtail":"⤜","ratio":"∶","rationals":"ℚ","rbarr":"⤍","rBarr":"⤏","RBarr":"⤐","rbbrk":"❳","rbrace":"}","rbrack":"]","rbrke":"⦌","rbrksld":"⦎","rbrkslu":"⦐","Rcaron":"Ř","rcaron":"ř","Rcedil":"Ŗ","rcedil":"ŗ","rceil":"⌉","rcub":"}","Rcy":"Р","rcy":"р","rdca":"⤷","rdldhar":"⥩","rdquo":"”","rdquor":"”","rdsh":"↳","real":"ℜ","realine":"ℛ","realpart":"ℜ","reals":"ℝ","Re":"ℜ","rect":"▭","reg":"\xae","REG":"\xae","ReverseElement":"∋","ReverseEquilibrium":"⇋","ReverseUpEquilibrium":"⥯","rfisht":"⥽","rfloor":"⌋","rfr":"\uD835\uDD2F","Rfr":"ℜ","rHar":"⥤","rhard":"⇁","rharu":"⇀","rharul":"⥬","Rho":"Ρ","rho":"ρ","rhov":"ϱ","RightAngleBracket":"⟩","RightArrowBar":"⇥","rightarrow":"→","RightArrow":"→","Rightarrow":"⇒","RightArrowLeftArrow":"⇄","rightarrowtail":"↣","RightCeiling":"⌉","RightDoubleBracket":"⟧","RightDownTeeVector":"⥝","RightDownVectorBar":"⥕","RightDownVector":"⇂","RightFloor":"⌋","rightharpoondown":"⇁","rightharpoonup":"⇀","rightleftarrows":"⇄","rightleftharpoons":"⇌","rightrightarrows":"⇉","rightsquigarrow":"↝","RightTeeArrow":"↦","RightTee":"⊢","RightTeeVector":"⥛","rightthreetimes":"⋌","RightTriangleBar":"⧐","RightTriangle":"⊳","RightTriangleEqual":"⊵","RightUpDownVector":"⥏","RightUpTeeVector":"⥜","RightUpVectorBar":"⥔","RightUpVector":"↾","RightVectorBar":"⥓","RightVector":"⇀","ring":"˚","risingdotseq":"≓","rlarr":"⇄","rlhar":"⇌","rlm":"‏","rmoustache":"⎱","rmoust":"⎱","rnmid":"⫮","roang":"⟭","roarr":"⇾","robrk":"⟧","ropar":"⦆","ropf":"\uD835\uDD63","Ropf":"ℝ","roplus":"⨮","rotimes":"⨵","RoundImplies":"⥰","rpar":")","rpargt":"⦔","rppolint":"⨒","rrarr":"⇉","Rrightarrow":"⇛","rsaquo":"›","rscr":"\uD835\uDCC7","Rscr":"ℛ","rsh":"↱","Rsh":"↱","rsqb":"]","rsquo":"’","rsquor":"’","rthree":"⋌","rtimes":"⋊","rtri":"▹","rtrie":"⊵","rtrif":"▸","rtriltri":"⧎","RuleDelayed":"⧴","ruluhar":"⥨","rx":"℞","Sacute":"Ś","sacute":"ś","sbquo":"‚","scap":"⪸","Scaron":"Š","scaron":"š","Sc":"⪼","sc":"≻","sccue":"≽","sce":"⪰","scE":"⪴","Scedil":"Ş","scedil":"ş","Scirc":"Ŝ","scirc":"ŝ","scnap":"⪺","scnE":"⪶","scnsim":"⋩","scpolint":"⨓","scsim":"≿","Scy":"С","scy":"с","sdotb":"⊡","sdot":"⋅","sdote":"⩦","searhk":"⤥","searr":"↘","seArr":"⇘","searrow":"↘","sect":"\xa7","semi":";","seswar":"⤩","setminus":"∖","setmn":"∖","sext":"✶","Sfr":"\uD835\uDD16","sfr":"\uD835\uDD30","sfrown":"⌢","sharp":"♯","SHCHcy":"Щ","shchcy":"щ","SHcy":"Ш","shcy":"ш","ShortDownArrow":"↓","ShortLeftArrow":"←","shortmid":"∣","shortparallel":"∥","ShortRightArrow":"→","ShortUpArrow":"↑","shy":"\xad","Sigma":"Σ","sigma":"σ","sigmaf":"ς","sigmav":"ς","sim":"∼","simdot":"⩪","sime":"≃","simeq":"≃","simg":"⪞","simgE":"⪠","siml":"⪝","simlE":"⪟","simne":"≆","simplus":"⨤","simrarr":"⥲","slarr":"←","SmallCircle":"∘","smallsetminus":"∖","smashp":"⨳","smeparsl":"⧤","smid":"∣","smile":"⌣","smt":"⪪","smte":"⪬","smtes":"⪬︀","SOFTcy":"Ь","softcy":"ь","solbar":"⌿","solb":"⧄","sol":"/","Sopf":"\uD835\uDD4A","sopf":"\uD835\uDD64","spades":"♠","spadesuit":"♠","spar":"∥","sqcap":"⊓","sqcaps":"⊓︀","sqcup":"⊔","sqcups":"⊔︀","Sqrt":"√","sqsub":"⊏","sqsube":"⊑","sqsubset":"⊏","sqsubseteq":"⊑","sqsup":"⊐","sqsupe":"⊒","sqsupset":"⊐","sqsupseteq":"⊒","square":"□","Square":"□","SquareIntersection":"⊓","SquareSubset":"⊏","SquareSubsetEqual":"⊑","SquareSuperset":"⊐","SquareSupersetEqual":"⊒","SquareUnion":"⊔","squarf":"▪","squ":"□","squf":"▪","srarr":"→","Sscr":"\uD835\uDCAE","sscr":"\uD835\uDCC8","ssetmn":"∖","ssmile":"⌣","sstarf":"⋆","Star":"⋆","star":"☆","starf":"★","straightepsilon":"ϵ","straightphi":"ϕ","strns":"\xaf","sub":"⊂","Sub":"⋐","subdot":"⪽","subE":"⫅","sube":"⊆","subedot":"⫃","submult":"⫁","subnE":"⫋","subne":"⊊","subplus":"⪿","subrarr":"⥹","subset":"⊂","Subset":"⋐","subseteq":"⊆","subseteqq":"⫅","SubsetEqual":"⊆","subsetneq":"⊊","subsetneqq":"⫋","subsim":"⫇","subsub":"⫕","subsup":"⫓","succapprox":"⪸","succ":"≻","succcurlyeq":"≽","Succeeds":"≻","SucceedsEqual":"⪰","SucceedsSlantEqual":"≽","SucceedsTilde":"≿","succeq":"⪰","succnapprox":"⪺","succneqq":"⪶","succnsim":"⋩","succsim":"≿","SuchThat":"∋","sum":"∑","Sum":"∑","sung":"♪","sup1":"\xb9","sup2":"\xb2","sup3":"\xb3","sup":"⊃","Sup":"⋑","supdot":"⪾","supdsub":"⫘","supE":"⫆","supe":"⊇","supedot":"⫄","Superset":"⊃","SupersetEqual":"⊇","suphsol":"⟉","suphsub":"⫗","suplarr":"⥻","supmult":"⫂","supnE":"⫌","supne":"⊋","supplus":"⫀","supset":"⊃","Supset":"⋑","supseteq":"⊇","supseteqq":"⫆","supsetneq":"⊋","supsetneqq":"⫌","supsim":"⫈","supsub":"⫔","supsup":"⫖","swarhk":"⤦","swarr":"↙","swArr":"⇙","swarrow":"↙","swnwar":"⤪","szlig":"\xdf","Tab":"\\t","target":"⌖","Tau":"Τ","tau":"τ","tbrk":"⎴","Tcaron":"Ť","tcaron":"ť","Tcedil":"Ţ","tcedil":"ţ","Tcy":"Т","tcy":"т","tdot":"⃛","telrec":"⌕","Tfr":"\uD835\uDD17","tfr":"\uD835\uDD31","there4":"∴","therefore":"∴","Therefore":"∴","Theta":"Θ","theta":"θ","thetasym":"ϑ","thetav":"ϑ","thickapprox":"≈","thicksim":"∼","ThickSpace":"  ","ThinSpace":" ","thinsp":" ","thkap":"≈","thksim":"∼","THORN":"\xde","thorn":"\xfe","tilde":"˜","Tilde":"∼","TildeEqual":"≃","TildeFullEqual":"≅","TildeTilde":"≈","timesbar":"⨱","timesb":"⊠","times":"\xd7","timesd":"⨰","tint":"∭","toea":"⤨","topbot":"⌶","topcir":"⫱","top":"⊤","Topf":"\uD835\uDD4B","topf":"\uD835\uDD65","topfork":"⫚","tosa":"⤩","tprime":"‴","trade":"™","TRADE":"™","triangle":"▵","triangledown":"▿","triangleleft":"◃","trianglelefteq":"⊴","triangleq":"≜","triangleright":"▹","trianglerighteq":"⊵","tridot":"◬","trie":"≜","triminus":"⨺","TripleDot":"⃛","triplus":"⨹","trisb":"⧍","tritime":"⨻","trpezium":"⏢","Tscr":"\uD835\uDCAF","tscr":"\uD835\uDCC9","TScy":"Ц","tscy":"ц","TSHcy":"Ћ","tshcy":"ћ","Tstrok":"Ŧ","tstrok":"ŧ","twixt":"≬","twoheadleftarrow":"↞","twoheadrightarrow":"↠","Uacute":"\xda","uacute":"\xfa","uarr":"↑","Uarr":"↟","uArr":"⇑","Uarrocir":"⥉","Ubrcy":"Ў","ubrcy":"ў","Ubreve":"Ŭ","ubreve":"ŭ","Ucirc":"\xdb","ucirc":"\xfb","Ucy":"У","ucy":"у","udarr":"⇅","Udblac":"Ű","udblac":"ű","udhar":"⥮","ufisht":"⥾","Ufr":"\uD835\uDD18","ufr":"\uD835\uDD32","Ugrave":"\xd9","ugrave":"\xf9","uHar":"⥣","uharl":"↿","uharr":"↾","uhblk":"▀","ulcorn":"⌜","ulcorner":"⌜","ulcrop":"⌏","ultri":"◸","Umacr":"Ū","umacr":"ū","uml":"\xa8","UnderBar":"_","UnderBrace":"⏟","UnderBracket":"⎵","UnderParenthesis":"⏝","Union":"⋃","UnionPlus":"⊎","Uogon":"Ų","uogon":"ų","Uopf":"\uD835\uDD4C","uopf":"\uD835\uDD66","UpArrowBar":"⤒","uparrow":"↑","UpArrow":"↑","Uparrow":"⇑","UpArrowDownArrow":"⇅","updownarrow":"↕","UpDownArrow":"↕","Updownarrow":"⇕","UpEquilibrium":"⥮","upharpoonleft":"↿","upharpoonright":"↾","uplus":"⊎","UpperLeftArrow":"↖","UpperRightArrow":"↗","upsi":"υ","Upsi":"ϒ","upsih":"ϒ","Upsilon":"Υ","upsilon":"υ","UpTeeArrow":"↥","UpTee":"⊥","upuparrows":"⇈","urcorn":"⌝","urcorner":"⌝","urcrop":"⌎","Uring":"Ů","uring":"ů","urtri":"◹","Uscr":"\uD835\uDCB0","uscr":"\uD835\uDCCA","utdot":"⋰","Utilde":"Ũ","utilde":"ũ","utri":"▵","utrif":"▴","uuarr":"⇈","Uuml":"\xdc","uuml":"\xfc","uwangle":"⦧","vangrt":"⦜","varepsilon":"ϵ","varkappa":"ϰ","varnothing":"∅","varphi":"ϕ","varpi":"ϖ","varpropto":"∝","varr":"↕","vArr":"⇕","varrho":"ϱ","varsigma":"ς","varsubsetneq":"⊊︀","varsubsetneqq":"⫋︀","varsupsetneq":"⊋︀","varsupsetneqq":"⫌︀","vartheta":"ϑ","vartriangleleft":"⊲","vartriangleright":"⊳","vBar":"⫨","Vbar":"⫫","vBarv":"⫩","Vcy":"В","vcy":"в","vdash":"⊢","vDash":"⊨","Vdash":"⊩","VDash":"⊫","Vdashl":"⫦","veebar":"⊻","vee":"∨","Vee":"⋁","veeeq":"≚","vellip":"⋮","verbar":"|","Verbar":"‖","vert":"|","Vert":"‖","VerticalBar":"∣","VerticalLine":"|","VerticalSeparator":"❘","VerticalTilde":"≀","VeryThinSpace":" ","Vfr":"\uD835\uDD19","vfr":"\uD835\uDD33","vltri":"⊲","vnsub":"⊂⃒","vnsup":"⊃⃒","Vopf":"\uD835\uDD4D","vopf":"\uD835\uDD67","vprop":"∝","vrtri":"⊳","Vscr":"\uD835\uDCB1","vscr":"\uD835\uDCCB","vsubnE":"⫋︀","vsubne":"⊊︀","vsupnE":"⫌︀","vsupne":"⊋︀","Vvdash":"⊪","vzigzag":"⦚","Wcirc":"Ŵ","wcirc":"ŵ","wedbar":"⩟","wedge":"∧","Wedge":"⋀","wedgeq":"≙","weierp":"℘","Wfr":"\uD835\uDD1A","wfr":"\uD835\uDD34","Wopf":"\uD835\uDD4E","wopf":"\uD835\uDD68","wp":"℘","wr":"≀","wreath":"≀","Wscr":"\uD835\uDCB2","wscr":"\uD835\uDCCC","xcap":"⋂","xcirc":"◯","xcup":"⋃","xdtri":"▽","Xfr":"\uD835\uDD1B","xfr":"\uD835\uDD35","xharr":"⟷","xhArr":"⟺","Xi":"Ξ","xi":"ξ","xlarr":"⟵","xlArr":"⟸","xmap":"⟼","xnis":"⋻","xodot":"⨀","Xopf":"\uD835\uDD4F","xopf":"\uD835\uDD69","xoplus":"⨁","xotime":"⨂","xrarr":"⟶","xrArr":"⟹","Xscr":"\uD835\uDCB3","xscr":"\uD835\uDCCD","xsqcup":"⨆","xuplus":"⨄","xutri":"△","xvee":"⋁","xwedge":"⋀","Yacute":"\xdd","yacute":"\xfd","YAcy":"Я","yacy":"я","Ycirc":"Ŷ","ycirc":"ŷ","Ycy":"Ы","ycy":"ы","yen":"\xa5","Yfr":"\uD835\uDD1C","yfr":"\uD835\uDD36","YIcy":"Ї","yicy":"ї","Yopf":"\uD835\uDD50","yopf":"\uD835\uDD6A","Yscr":"\uD835\uDCB4","yscr":"\uD835\uDCCE","YUcy":"Ю","yucy":"ю","yuml":"\xff","Yuml":"Ÿ","Zacute":"Ź","zacute":"ź","Zcaron":"Ž","zcaron":"ž","Zcy":"З","zcy":"з","Zdot":"Ż","zdot":"ż","zeetrf":"ℨ","ZeroWidthSpace":"​","Zeta":"Ζ","zeta":"ζ","zfr":"\uD835\uDD37","Zfr":"ℨ","ZHcy":"Ж","zhcy":"ж","zigrarr":"⇝","zopf":"\uD835\uDD6B","Zopf":"ℤ","Zscr":"\uD835\uDCB5","zscr":"\uD835\uDCCF","zwj":"‍","zwnj":"‌"}');

});


parcelRequire.register("27rhI", function(module, exports) {
module.exports = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4E\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDF55-\uDF59]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDF3C-\uDF3E]|\uD806[\uDC3B\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/;

});

parcelRequire.register("7stqn", function(module, exports) {

$parcel$export(module.exports, "encode", () => $56e1f8fcb55a9518$export$c564cdbbe6da493, (v) => $56e1f8fcb55a9518$export$c564cdbbe6da493 = v);
$parcel$export(module.exports, "decode", () => $56e1f8fcb55a9518$export$2f872c0f2117be69, (v) => $56e1f8fcb55a9518$export$2f872c0f2117be69 = v);
$parcel$export(module.exports, "format", () => $56e1f8fcb55a9518$export$d9468344d3651243, (v) => $56e1f8fcb55a9518$export$d9468344d3651243 = v);
$parcel$export(module.exports, "parse", () => $56e1f8fcb55a9518$export$98e6a39c04603d36, (v) => $56e1f8fcb55a9518$export$98e6a39c04603d36 = v);
var $56e1f8fcb55a9518$export$c564cdbbe6da493;
var $56e1f8fcb55a9518$export$2f872c0f2117be69;
var $56e1f8fcb55a9518$export$d9468344d3651243;
var $56e1f8fcb55a9518$export$98e6a39c04603d36;
"use strict";

$56e1f8fcb55a9518$export$c564cdbbe6da493 = (parcelRequire("kMD96"));

$56e1f8fcb55a9518$export$2f872c0f2117be69 = (parcelRequire("k1An0"));

$56e1f8fcb55a9518$export$d9468344d3651243 = (parcelRequire("k0jsF"));

$56e1f8fcb55a9518$export$98e6a39c04603d36 = (parcelRequire("eDZFO"));

});
parcelRequire.register("kMD96", function(module, exports) {
"use strict";
var $f216a7de48a94959$var$encodeCache = {};
// Create a lookup array where anything but characters in `chars` string
// and alphanumeric chars is percent-encoded.
//
function $f216a7de48a94959$var$getEncodeCache(exclude) {
    var i, ch, cache = $f216a7de48a94959$var$encodeCache[exclude];
    if (cache) return cache;
    cache = $f216a7de48a94959$var$encodeCache[exclude] = [];
    for(i = 0; i < 128; i++){
        ch = String.fromCharCode(i);
        if (/^[0-9a-z]$/i.test(ch)) // always allow unencoded alphanumeric characters
        cache.push(ch);
        else cache.push("%" + ("0" + i.toString(16).toUpperCase()).slice(-2));
    }
    for(i = 0; i < exclude.length; i++)cache[exclude.charCodeAt(i)] = exclude[i];
    return cache;
}
// Encode unsafe characters with percent-encoding, skipping already
// encoded sequences.
//
//  - string       - string to encode
//  - exclude      - list of characters to ignore (in addition to a-zA-Z0-9)
//  - keepEscaped  - don't encode '%' in a correct escape sequence (default: true)
//
function $f216a7de48a94959$var$encode(string, exclude, keepEscaped) {
    var i, l, code, nextCode, cache, result = "";
    if (typeof exclude !== "string") {
        // encode(string, keepEscaped)
        keepEscaped = exclude;
        exclude = $f216a7de48a94959$var$encode.defaultChars;
    }
    if (typeof keepEscaped === "undefined") keepEscaped = true;
    cache = $f216a7de48a94959$var$getEncodeCache(exclude);
    for(i = 0, l = string.length; i < l; i++){
        code = string.charCodeAt(i);
        if (keepEscaped && code === 0x25 /* % */  && i + 2 < l) {
            if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
                result += string.slice(i, i + 3);
                i += 2;
                continue;
            }
        }
        if (code < 128) {
            result += cache[code];
            continue;
        }
        if (code >= 0xD800 && code <= 0xDFFF) {
            if (code >= 0xD800 && code <= 0xDBFF && i + 1 < l) {
                nextCode = string.charCodeAt(i + 1);
                if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
                    result += encodeURIComponent(string[i] + string[i + 1]);
                    i++;
                    continue;
                }
            }
            result += "%EF%BF%BD";
            continue;
        }
        result += encodeURIComponent(string[i]);
    }
    return result;
}
$f216a7de48a94959$var$encode.defaultChars = ";/?:@&=+$,-_.!~*'()#";
$f216a7de48a94959$var$encode.componentChars = "-_.!~*'()";
module.exports = $f216a7de48a94959$var$encode;

});

parcelRequire.register("k1An0", function(module, exports) {
"use strict";
/* eslint-disable no-bitwise */ var $e9401cfe58b1227b$var$decodeCache = {};
function $e9401cfe58b1227b$var$getDecodeCache(exclude) {
    var i, ch, cache = $e9401cfe58b1227b$var$decodeCache[exclude];
    if (cache) return cache;
    cache = $e9401cfe58b1227b$var$decodeCache[exclude] = [];
    for(i = 0; i < 128; i++){
        ch = String.fromCharCode(i);
        cache.push(ch);
    }
    for(i = 0; i < exclude.length; i++){
        ch = exclude.charCodeAt(i);
        cache[ch] = "%" + ("0" + ch.toString(16).toUpperCase()).slice(-2);
    }
    return cache;
}
// Decode percent-encoded string.
//
function $e9401cfe58b1227b$var$decode(string, exclude) {
    var cache;
    if (typeof exclude !== "string") exclude = $e9401cfe58b1227b$var$decode.defaultChars;
    cache = $e9401cfe58b1227b$var$getDecodeCache(exclude);
    return string.replace(/(%[a-f0-9]{2})+/gi, function(seq) {
        var i, l, b1, b2, b3, b4, chr, result = "";
        for(i = 0, l = seq.length; i < l; i += 3){
            b1 = parseInt(seq.slice(i + 1, i + 3), 16);
            if (b1 < 0x80) {
                result += cache[b1];
                continue;
            }
            if ((b1 & 0xE0) === 0xC0 && i + 3 < l) {
                // 110xxxxx 10xxxxxx
                b2 = parseInt(seq.slice(i + 4, i + 6), 16);
                if ((b2 & 0xC0) === 0x80) {
                    chr = b1 << 6 & 0x7C0 | b2 & 0x3F;
                    if (chr < 0x80) result += "��";
                    else result += String.fromCharCode(chr);
                    i += 3;
                    continue;
                }
            }
            if ((b1 & 0xF0) === 0xE0 && i + 6 < l) {
                // 1110xxxx 10xxxxxx 10xxxxxx
                b2 = parseInt(seq.slice(i + 4, i + 6), 16);
                b3 = parseInt(seq.slice(i + 7, i + 9), 16);
                if ((b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80) {
                    chr = b1 << 12 & 0xF000 | b2 << 6 & 0xFC0 | b3 & 0x3F;
                    if (chr < 0x800 || chr >= 0xD800 && chr <= 0xDFFF) result += "���";
                    else result += String.fromCharCode(chr);
                    i += 6;
                    continue;
                }
            }
            if ((b1 & 0xF8) === 0xF0 && i + 9 < l) {
                // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx
                b2 = parseInt(seq.slice(i + 4, i + 6), 16);
                b3 = parseInt(seq.slice(i + 7, i + 9), 16);
                b4 = parseInt(seq.slice(i + 10, i + 12), 16);
                if ((b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80 && (b4 & 0xC0) === 0x80) {
                    chr = b1 << 18 & 0x1C0000 | b2 << 12 & 0x3F000 | b3 << 6 & 0xFC0 | b4 & 0x3F;
                    if (chr < 0x10000 || chr > 0x10FFFF) result += "����";
                    else {
                        chr -= 0x10000;
                        result += String.fromCharCode(0xD800 + (chr >> 10), 0xDC00 + (chr & 0x3FF));
                    }
                    i += 9;
                    continue;
                }
            }
            result += "�";
        }
        return result;
    });
}
$e9401cfe58b1227b$var$decode.defaultChars = ";/?:@&=+$,#";
$e9401cfe58b1227b$var$decode.componentChars = "";
module.exports = $e9401cfe58b1227b$var$decode;

});

parcelRequire.register("k0jsF", function(module, exports) {
"use strict";
module.exports = function format(url) {
    var result = "";
    result += url.protocol || "";
    result += url.slashes ? "//" : "";
    result += url.auth ? url.auth + "@" : "";
    if (url.hostname && url.hostname.indexOf(":") !== -1) // ipv6 address
    result += "[" + url.hostname + "]";
    else result += url.hostname || "";
    result += url.port ? ":" + url.port : "";
    result += url.pathname || "";
    result += url.search || "";
    result += url.hash || "";
    return result;
};

});

parcelRequire.register("eDZFO", function(module, exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
"use strict";
//
// Changes from joyent/node:
//
// 1. No leading slash in paths,
//    e.g. in `url.parse('http://foo?bar')` pathname is ``, not `/`
//
// 2. Backslashes are not replaced with slashes,
//    so `http:\\example.org\` is treated like a relative path
//
// 3. Trailing colon is treated like a part of the path,
//    i.e. in `http://example.org:foo` pathname is `:foo`
//
// 4. Nothing is URL-encoded in the resulting object,
//    (in joyent/node some chars in auth and paths are encoded)
//
// 5. `url.parse()` does not have `parseQueryString` argument
//
// 6. Removed extraneous result properties: `host`, `path`, `query`, etc.,
//    which can be constructed using other parts of the url.
//
function $aa948c4427543718$var$Url() {
    this.protocol = null;
    this.slashes = null;
    this.auth = null;
    this.port = null;
    this.hostname = null;
    this.hash = null;
    this.search = null;
    this.pathname = null;
}
// Reference: RFC 3986, RFC 1808, RFC 2396
// define these here so at least they only have to be
// compiled once on the first module load.
var $aa948c4427543718$var$protocolPattern = /^([a-z0-9.+-]+:)/i, $aa948c4427543718$var$portPattern = /:[0-9]*$/, // Special case for a simple path URL
$aa948c4427543718$var$simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, // RFC 2396: characters reserved for delimiting URLs.
// We actually just auto-escape these.
$aa948c4427543718$var$delims = [
    "<",
    ">",
    '"',
    "`",
    " ",
    "\r",
    "\n",
    "   "
], // RFC 2396: characters not allowed for various reasons.
$aa948c4427543718$var$unwise = [
    "{",
    "}",
    "|",
    "\\",
    "^",
    "`"
].concat($aa948c4427543718$var$delims), // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
$aa948c4427543718$var$autoEscape = [
    "'"
].concat($aa948c4427543718$var$unwise), // Characters that are never ever allowed in a hostname.
// Note that any invalid chars are also handled, but these
// are the ones that are *expected* to be seen, so we fast-path
// them.
$aa948c4427543718$var$nonHostChars = [
    "%",
    "/",
    "?",
    ";",
    "#"
].concat($aa948c4427543718$var$autoEscape), $aa948c4427543718$var$hostEndingChars = [
    "/",
    "?",
    "#"
], $aa948c4427543718$var$hostnameMaxLen = 255, $aa948c4427543718$var$hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/, $aa948c4427543718$var$hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, // protocols that can allow "unsafe" and "unwise" chars.
/* eslint-disable no-script-url */ // protocols that never have a hostname.
$aa948c4427543718$var$hostlessProtocol = {
    "javascript": true,
    "javascript:": true
}, // protocols that always contain a // bit.
$aa948c4427543718$var$slashedProtocol = {
    "http": true,
    "https": true,
    "ftp": true,
    "gopher": true,
    "file": true,
    "http:": true,
    "https:": true,
    "ftp:": true,
    "gopher:": true,
    "file:": true
};
/* eslint-enable no-script-url */ function $aa948c4427543718$var$urlParse(url, slashesDenoteHost) {
    if (url && url instanceof $aa948c4427543718$var$Url) return url;
    var u = new $aa948c4427543718$var$Url();
    u.parse(url, slashesDenoteHost);
    return u;
}
$aa948c4427543718$var$Url.prototype.parse = function(url, slashesDenoteHost) {
    var i, l, lowerProto, hec, slashes, rest = url;
    // trim before proceeding.
    // This is to support parse stuff like "  http://foo.com  \n"
    rest = rest.trim();
    if (!slashesDenoteHost && url.split("#").length === 1) {
        // Try fast path regexp
        var simplePath = $aa948c4427543718$var$simplePathPattern.exec(rest);
        if (simplePath) {
            this.pathname = simplePath[1];
            if (simplePath[2]) this.search = simplePath[2];
            return this;
        }
    }
    var proto = $aa948c4427543718$var$protocolPattern.exec(rest);
    if (proto) {
        proto = proto[0];
        lowerProto = proto.toLowerCase();
        this.protocol = proto;
        rest = rest.substr(proto.length);
    }
    // figure out if it's got a host
    // user@server is *always* interpreted as a hostname, and url
    // resolution will treat //foo/bar as host=foo,path=bar because that's
    // how the browser resolves relative URLs.
    if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
        slashes = rest.substr(0, 2) === "//";
        if (slashes && !(proto && $aa948c4427543718$var$hostlessProtocol[proto])) {
            rest = rest.substr(2);
            this.slashes = true;
        }
    }
    if (!$aa948c4427543718$var$hostlessProtocol[proto] && (slashes || proto && !$aa948c4427543718$var$slashedProtocol[proto])) {
        // there's a hostname.
        // the first instance of /, ?, ;, or # ends the host.
        //
        // If there is an @ in the hostname, then non-host chars *are* allowed
        // to the left of the last @ sign, unless some host-ending character
        // comes *before* the @-sign.
        // URLs are obnoxious.
        //
        // ex:
        // http://a@b@c/ => user:a@b host:c
        // http://a@b?@c => user:a host:c path:/?@c
        // v0.12 TODO(isaacs): This is not quite how Chrome does things.
        // Review our test case against browsers more comprehensively.
        // find the first instance of any hostEndingChars
        var hostEnd = -1;
        for(i = 0; i < $aa948c4427543718$var$hostEndingChars.length; i++){
            hec = rest.indexOf($aa948c4427543718$var$hostEndingChars[i]);
            if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
        }
        // at this point, either we have an explicit point where the
        // auth portion cannot go past, or the last @ char is the decider.
        var auth, atSign;
        if (hostEnd === -1) // atSign can be anywhere.
        atSign = rest.lastIndexOf("@");
        else // atSign must be in auth portion.
        // http://a@b/c@d => host:b auth:a path:/c@d
        atSign = rest.lastIndexOf("@", hostEnd);
        // Now we have a portion which is definitely the auth.
        // Pull that off.
        if (atSign !== -1) {
            auth = rest.slice(0, atSign);
            rest = rest.slice(atSign + 1);
            this.auth = auth;
        }
        // the host is the remaining to the left of the first non-host char
        hostEnd = -1;
        for(i = 0; i < $aa948c4427543718$var$nonHostChars.length; i++){
            hec = rest.indexOf($aa948c4427543718$var$nonHostChars[i]);
            if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
        }
        // if we still have not hit it, then the entire thing is a host.
        if (hostEnd === -1) hostEnd = rest.length;
        if (rest[hostEnd - 1] === ":") hostEnd--;
        var host = rest.slice(0, hostEnd);
        rest = rest.slice(hostEnd);
        // pull out port.
        this.parseHost(host);
        // we've indicated that there is a hostname,
        // so even if it's empty, it has to be present.
        this.hostname = this.hostname || "";
        // if hostname begins with [ and ends with ]
        // assume that it's an IPv6 address.
        var ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
        // validate a little.
        if (!ipv6Hostname) {
            var hostparts = this.hostname.split(/\./);
            for(i = 0, l = hostparts.length; i < l; i++){
                var part = hostparts[i];
                if (!part) continue;
                if (!part.match($aa948c4427543718$var$hostnamePartPattern)) {
                    var newpart = "";
                    for(var j = 0, k = part.length; j < k; j++)if (part.charCodeAt(j) > 127) // we replace non-ASCII char with a temporary placeholder
                    // we need this to make sure size of hostname is not
                    // broken by replacing non-ASCII by nothing
                    newpart += "x";
                    else newpart += part[j];
                    // we test again with ASCII char only
                    if (!newpart.match($aa948c4427543718$var$hostnamePartPattern)) {
                        var validParts = hostparts.slice(0, i);
                        var notHost = hostparts.slice(i + 1);
                        var bit = part.match($aa948c4427543718$var$hostnamePartStart);
                        if (bit) {
                            validParts.push(bit[1]);
                            notHost.unshift(bit[2]);
                        }
                        if (notHost.length) rest = notHost.join(".") + rest;
                        this.hostname = validParts.join(".");
                        break;
                    }
                }
            }
        }
        if (this.hostname.length > $aa948c4427543718$var$hostnameMaxLen) this.hostname = "";
        // strip [ and ] from the hostname
        // the host field still retains them, though
        if (ipv6Hostname) this.hostname = this.hostname.substr(1, this.hostname.length - 2);
    }
    // chop off from the tail first.
    var hash = rest.indexOf("#");
    if (hash !== -1) {
        // got a fragment string.
        this.hash = rest.substr(hash);
        rest = rest.slice(0, hash);
    }
    var qm = rest.indexOf("?");
    if (qm !== -1) {
        this.search = rest.substr(qm);
        rest = rest.slice(0, qm);
    }
    if (rest) this.pathname = rest;
    if ($aa948c4427543718$var$slashedProtocol[lowerProto] && this.hostname && !this.pathname) this.pathname = "";
    return this;
};
$aa948c4427543718$var$Url.prototype.parseHost = function(host) {
    var port = $aa948c4427543718$var$portPattern.exec(host);
    if (port) {
        port = port[0];
        if (port !== ":") this.port = port.substr(1);
        host = host.substr(0, host.length - port.length);
    }
    if (host) this.hostname = host;
};
module.exports = $aa948c4427543718$var$urlParse;

});


parcelRequire.register("a4dIX", function(module, exports) {

$parcel$export(module.exports, "Any", () => $7544ec70dad2f075$export$b24b633b1364b94b, (v) => $7544ec70dad2f075$export$b24b633b1364b94b = v);
$parcel$export(module.exports, "Cc", () => $7544ec70dad2f075$export$15dafbac7aec8a57, (v) => $7544ec70dad2f075$export$15dafbac7aec8a57 = v);
$parcel$export(module.exports, "Cf", () => $7544ec70dad2f075$export$239cff0cce87eb56, (v) => $7544ec70dad2f075$export$239cff0cce87eb56 = v);
$parcel$export(module.exports, "P", () => $7544ec70dad2f075$export$56c0d5a1e737357d, (v) => $7544ec70dad2f075$export$56c0d5a1e737357d = v);
$parcel$export(module.exports, "Z", () => $7544ec70dad2f075$export$dc98b0b04f4c7758, (v) => $7544ec70dad2f075$export$dc98b0b04f4c7758 = v);
var $7544ec70dad2f075$export$b24b633b1364b94b;
var $7544ec70dad2f075$export$15dafbac7aec8a57;
var $7544ec70dad2f075$export$239cff0cce87eb56;
var $7544ec70dad2f075$export$56c0d5a1e737357d;
var $7544ec70dad2f075$export$dc98b0b04f4c7758;
"use strict";

$7544ec70dad2f075$export$b24b633b1364b94b = (parcelRequire("6j9ic"));

$7544ec70dad2f075$export$15dafbac7aec8a57 = (parcelRequire("4PxzG"));

$7544ec70dad2f075$export$239cff0cce87eb56 = (parcelRequire("1DaRH"));

$7544ec70dad2f075$export$56c0d5a1e737357d = (parcelRequire("27rhI"));

$7544ec70dad2f075$export$dc98b0b04f4c7758 = (parcelRequire("hZTKe"));

});
parcelRequire.register("6j9ic", function(module, exports) {
module.exports = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;

});

parcelRequire.register("4PxzG", function(module, exports) {
module.exports = /[\0-\x1F\x7F-\x9F]/;

});

parcelRequire.register("1DaRH", function(module, exports) {
module.exports = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/;

});

parcelRequire.register("hZTKe", function(module, exports) {
module.exports = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;

});



parcelRequire.register("1grT5", function(module, exports) {

$parcel$export(module.exports, "parseLinkLabel", () => $0ebceaef629b0f57$export$2a2c8612930e58d0, (v) => $0ebceaef629b0f57$export$2a2c8612930e58d0 = v);
$parcel$export(module.exports, "parseLinkDestination", () => $0ebceaef629b0f57$export$22bd24080f95f2b3, (v) => $0ebceaef629b0f57$export$22bd24080f95f2b3 = v);
$parcel$export(module.exports, "parseLinkTitle", () => $0ebceaef629b0f57$export$89650c5477a69db9, (v) => $0ebceaef629b0f57$export$89650c5477a69db9 = v);
// Just a shortcut for bulk export
var $0ebceaef629b0f57$export$2a2c8612930e58d0;
var $0ebceaef629b0f57$export$22bd24080f95f2b3;
var $0ebceaef629b0f57$export$89650c5477a69db9;
"use strict";

$0ebceaef629b0f57$export$2a2c8612930e58d0 = (parcelRequire("f7VqZ"));

$0ebceaef629b0f57$export$22bd24080f95f2b3 = (parcelRequire("er7xu"));

$0ebceaef629b0f57$export$89650c5477a69db9 = (parcelRequire("hH0hY"));

});
parcelRequire.register("f7VqZ", function(module, exports) {
// Parse link label
//
// this function assumes that first character ("[") already matches;
// returns the end of the label
//
"use strict";
module.exports = function parseLinkLabel(state, start, disableNested) {
    var level, found, marker, prevPos, labelEnd = -1, max = state.posMax, oldPos = state.pos;
    state.pos = start + 1;
    level = 1;
    while(state.pos < max){
        marker = state.src.charCodeAt(state.pos);
        if (marker === 0x5D /* ] */ ) {
            level--;
            if (level === 0) {
                found = true;
                break;
            }
        }
        prevPos = state.pos;
        state.md.inline.skipToken(state);
        if (marker === 0x5B /* [ */ ) {
            if (prevPos === state.pos - 1) // increase level if we find text `[`, which is not a part of any token
            level++;
            else if (disableNested) {
                state.pos = oldPos;
                return -1;
            }
        }
    }
    if (found) labelEnd = state.pos;
    // restore old state
    state.pos = oldPos;
    return labelEnd;
};

});

parcelRequire.register("er7xu", function(module, exports) {
// Parse link destination
//
"use strict";

var $4VIu7 = parcelRequire("4VIu7");
var $a8296f6c76e96dee$require$unescapeAll = $4VIu7.unescapeAll;
module.exports = function parseLinkDestination(str, pos, max) {
    var code, level, lines = 0, start = pos, result = {
        ok: false,
        pos: 0,
        lines: 0,
        str: ""
    };
    if (str.charCodeAt(pos) === 0x3C /* < */ ) {
        pos++;
        while(pos < max){
            code = str.charCodeAt(pos);
            if (code === 0x0A /* \n */ ) return result;
            if (code === 0x3C /* < */ ) return result;
            if (code === 0x3E /* > */ ) {
                result.pos = pos + 1;
                result.str = $a8296f6c76e96dee$require$unescapeAll(str.slice(start + 1, pos));
                result.ok = true;
                return result;
            }
            if (code === 0x5C /* \ */  && pos + 1 < max) {
                pos += 2;
                continue;
            }
            pos++;
        }
        // no closing '>'
        return result;
    }
    // this should be ... } else { ... branch
    level = 0;
    while(pos < max){
        code = str.charCodeAt(pos);
        if (code === 0x20) break;
        // ascii control characters
        if (code < 0x20 || code === 0x7F) break;
        if (code === 0x5C /* \ */  && pos + 1 < max) {
            if (str.charCodeAt(pos + 1) === 0x20) break;
            pos += 2;
            continue;
        }
        if (code === 0x28 /* ( */ ) {
            level++;
            if (level > 32) return result;
        }
        if (code === 0x29 /* ) */ ) {
            if (level === 0) break;
            level--;
        }
        pos++;
    }
    if (start === pos) return result;
    if (level !== 0) return result;
    result.str = $a8296f6c76e96dee$require$unescapeAll(str.slice(start, pos));
    result.lines = lines;
    result.pos = pos;
    result.ok = true;
    return result;
};

});

parcelRequire.register("hH0hY", function(module, exports) {
// Parse link title
//
"use strict";

var $4VIu7 = parcelRequire("4VIu7");
var $ce16ad30ccfd0bb6$require$unescapeAll = $4VIu7.unescapeAll;
module.exports = function parseLinkTitle(str, pos, max) {
    var code, marker, lines = 0, start = pos, result = {
        ok: false,
        pos: 0,
        lines: 0,
        str: ""
    };
    if (pos >= max) return result;
    marker = str.charCodeAt(pos);
    if (marker !== 0x22 /* " */  && marker !== 0x27 /* ' */  && marker !== 0x28 /* ( */ ) return result;
    pos++;
    // if opening marker is "(", switch it to closing marker ")"
    if (marker === 0x28) marker = 0x29;
    while(pos < max){
        code = str.charCodeAt(pos);
        if (code === marker) {
            result.pos = pos + 1;
            result.lines = lines;
            result.str = $ce16ad30ccfd0bb6$require$unescapeAll(str.slice(start + 1, pos));
            result.ok = true;
            return result;
        } else if (code === 0x28 /* ( */  && marker === 0x29 /* ) */ ) return result;
        else if (code === 0x0A) lines++;
        else if (code === 0x5C /* \ */  && pos + 1 < max) {
            pos++;
            if (str.charCodeAt(pos) === 0x0A) lines++;
        }
        pos++;
    }
    return result;
};

});


parcelRequire.register("7uUUo", function(module, exports) {
/**
 * class Renderer
 *
 * Generates HTML from parsed token stream. Each instance has independent
 * copy of rules. Those can be rewritten with ease. Also, you can add new
 * rules if you create plugin and adds new token types.
 **/ "use strict";

var $4VIu7 = parcelRequire("4VIu7");
var $57577a9cf5355ef5$require$assign = $4VIu7.assign;

var $4VIu7 = parcelRequire("4VIu7");
var $57577a9cf5355ef5$require$unescapeAll = $4VIu7.unescapeAll;

var $4VIu7 = parcelRequire("4VIu7");
var $57577a9cf5355ef5$require$escapeHtml = $4VIu7.escapeHtml;
////////////////////////////////////////////////////////////////////////////////
var $57577a9cf5355ef5$var$default_rules = {};
$57577a9cf5355ef5$var$default_rules.code_inline = function(tokens, idx, options, env, slf) {
    var token = tokens[idx];
    return "<code" + slf.renderAttrs(token) + ">" + $57577a9cf5355ef5$require$escapeHtml(tokens[idx].content) + "</code>";
};
$57577a9cf5355ef5$var$default_rules.code_block = function(tokens, idx, options, env, slf) {
    var token = tokens[idx];
    return "<pre" + slf.renderAttrs(token) + "><code>" + $57577a9cf5355ef5$require$escapeHtml(tokens[idx].content) + "</code></pre>\n";
};
$57577a9cf5355ef5$var$default_rules.fence = function(tokens, idx, options, env, slf) {
    var token = tokens[idx], info = token.info ? $57577a9cf5355ef5$require$unescapeAll(token.info).trim() : "", langName = "", langAttrs = "", highlighted, i, arr, tmpAttrs, tmpToken;
    if (info) {
        arr = info.split(/(\s+)/g);
        langName = arr[0];
        langAttrs = arr.slice(2).join("");
    }
    if (options.highlight) highlighted = options.highlight(token.content, langName, langAttrs) || $57577a9cf5355ef5$require$escapeHtml(token.content);
    else highlighted = $57577a9cf5355ef5$require$escapeHtml(token.content);
    if (highlighted.indexOf("<pre") === 0) return highlighted + "\n";
    // If language exists, inject class gently, without modifying original token.
    // May be, one day we will add .deepClone() for token and simplify this part, but
    // now we prefer to keep things local.
    if (info) {
        i = token.attrIndex("class");
        tmpAttrs = token.attrs ? token.attrs.slice() : [];
        if (i < 0) tmpAttrs.push([
            "class",
            options.langPrefix + langName
        ]);
        else {
            tmpAttrs[i] = tmpAttrs[i].slice();
            tmpAttrs[i][1] += " " + options.langPrefix + langName;
        }
        // Fake token just to render attributes
        tmpToken = {
            attrs: tmpAttrs
        };
        return "<pre><code" + slf.renderAttrs(tmpToken) + ">" + highlighted + "</code></pre>\n";
    }
    return "<pre><code" + slf.renderAttrs(token) + ">" + highlighted + "</code></pre>\n";
};
$57577a9cf5355ef5$var$default_rules.image = function(tokens, idx, options, env, slf) {
    var token = tokens[idx];
    // "alt" attr MUST be set, even if empty. Because it's mandatory and
    // should be placed on proper position for tests.
    //
    // Replace content with actual value
    token.attrs[token.attrIndex("alt")][1] = slf.renderInlineAsText(token.children, options, env);
    return slf.renderToken(tokens, idx, options);
};
$57577a9cf5355ef5$var$default_rules.hardbreak = function(tokens, idx, options /*, env */ ) {
    return options.xhtmlOut ? "<br />\n" : "<br>\n";
};
$57577a9cf5355ef5$var$default_rules.softbreak = function(tokens, idx, options /*, env */ ) {
    return options.breaks ? options.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
};
$57577a9cf5355ef5$var$default_rules.text = function(tokens, idx /*, options, env */ ) {
    return $57577a9cf5355ef5$require$escapeHtml(tokens[idx].content);
};
$57577a9cf5355ef5$var$default_rules.html_block = function(tokens, idx /*, options, env */ ) {
    return tokens[idx].content;
};
$57577a9cf5355ef5$var$default_rules.html_inline = function(tokens, idx /*, options, env */ ) {
    return tokens[idx].content;
};
/**
 * new Renderer()
 *
 * Creates new [[Renderer]] instance and fill [[Renderer#rules]] with defaults.
 **/ function $57577a9cf5355ef5$var$Renderer() {
    /**
   * Renderer#rules -> Object
   *
   * Contains render rules for tokens. Can be updated and extended.
   *
   * ##### Example
   *
   * ```javascript
   * var md = require('markdown-it')();
   *
   * md.renderer.rules.strong_open  = function () { return '<b>'; };
   * md.renderer.rules.strong_close = function () { return '</b>'; };
   *
   * var result = md.renderInline(...);
   * ```
   *
   * Each rule is called as independent static function with fixed signature:
   *
   * ```javascript
   * function my_token_render(tokens, idx, options, env, renderer) {
   *   // ...
   *   return renderedHTML;
   * }
   * ```
   *
   * See [source code](https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.js)
   * for more details and examples.
   **/ this.rules = $57577a9cf5355ef5$require$assign({}, $57577a9cf5355ef5$var$default_rules);
}
/**
 * Renderer.renderAttrs(token) -> String
 *
 * Render token attributes to string.
 **/ $57577a9cf5355ef5$var$Renderer.prototype.renderAttrs = function renderAttrs(token) {
    var i, l, result;
    if (!token.attrs) return "";
    result = "";
    for(i = 0, l = token.attrs.length; i < l; i++)result += " " + $57577a9cf5355ef5$require$escapeHtml(token.attrs[i][0]) + '="' + $57577a9cf5355ef5$require$escapeHtml(token.attrs[i][1]) + '"';
    return result;
};
/**
 * Renderer.renderToken(tokens, idx, options) -> String
 * - tokens (Array): list of tokens
 * - idx (Numbed): token index to render
 * - options (Object): params of parser instance
 *
 * Default token renderer. Can be overriden by custom function
 * in [[Renderer#rules]].
 **/ $57577a9cf5355ef5$var$Renderer.prototype.renderToken = function renderToken(tokens, idx, options) {
    var nextToken, result = "", needLf = false, token = tokens[idx];
    // Tight list paragraphs
    if (token.hidden) return "";
    // Insert a newline between hidden paragraph and subsequent opening
    // block-level tag.
    //
    // For example, here we should insert a newline before blockquote:
    //  - a
    //    >
    //
    if (token.block && token.nesting !== -1 && idx && tokens[idx - 1].hidden) result += "\n";
    // Add token name, e.g. `<img`
    result += (token.nesting === -1 ? "</" : "<") + token.tag;
    // Encode attributes, e.g. `<img src="foo"`
    result += this.renderAttrs(token);
    // Add a slash for self-closing tags, e.g. `<img src="foo" /`
    if (token.nesting === 0 && options.xhtmlOut) result += " /";
    // Check if we need to add a newline after this tag
    if (token.block) {
        needLf = true;
        if (token.nesting === 1) {
            if (idx + 1 < tokens.length) {
                nextToken = tokens[idx + 1];
                if (nextToken.type === "inline" || nextToken.hidden) // Block-level tag containing an inline tag.
                //
                needLf = false;
                else if (nextToken.nesting === -1 && nextToken.tag === token.tag) // Opening tag + closing tag of the same type. E.g. `<li></li>`.
                //
                needLf = false;
            }
        }
    }
    result += needLf ? ">\n" : ">";
    return result;
};
/**
 * Renderer.renderInline(tokens, options, env) -> String
 * - tokens (Array): list on block tokens to render
 * - options (Object): params of parser instance
 * - env (Object): additional data from parsed input (references, for example)
 *
 * The same as [[Renderer.render]], but for single token of `inline` type.
 **/ $57577a9cf5355ef5$var$Renderer.prototype.renderInline = function(tokens, options, env) {
    var type, result = "", rules = this.rules;
    for(var i = 0, len = tokens.length; i < len; i++){
        type = tokens[i].type;
        if (typeof rules[type] !== "undefined") result += rules[type](tokens, i, options, env, this);
        else result += this.renderToken(tokens, i, options);
    }
    return result;
};
/** internal
 * Renderer.renderInlineAsText(tokens, options, env) -> String
 * - tokens (Array): list on block tokens to render
 * - options (Object): params of parser instance
 * - env (Object): additional data from parsed input (references, for example)
 *
 * Special kludge for image `alt` attributes to conform CommonMark spec.
 * Don't try to use it! Spec requires to show `alt` content with stripped markup,
 * instead of simple escaping.
 **/ $57577a9cf5355ef5$var$Renderer.prototype.renderInlineAsText = function(tokens, options, env) {
    var result = "";
    for(var i = 0, len = tokens.length; i < len; i++){
        if (tokens[i].type === "text") result += tokens[i].content;
        else if (tokens[i].type === "image") result += this.renderInlineAsText(tokens[i].children, options, env);
        else if (tokens[i].type === "softbreak") result += "\n";
    }
    return result;
};
/**
 * Renderer.render(tokens, options, env) -> String
 * - tokens (Array): list on block tokens to render
 * - options (Object): params of parser instance
 * - env (Object): additional data from parsed input (references, for example)
 *
 * Takes token stream and generates HTML. Probably, you will never need to call
 * this method directly.
 **/ $57577a9cf5355ef5$var$Renderer.prototype.render = function(tokens, options, env) {
    var i, len, type, result = "", rules = this.rules;
    for(i = 0, len = tokens.length; i < len; i++){
        type = tokens[i].type;
        if (type === "inline") result += this.renderInline(tokens[i].children, options, env);
        else if (typeof rules[type] !== "undefined") result += rules[tokens[i].type](tokens, i, options, env, this);
        else result += this.renderToken(tokens, i, options, env);
    }
    return result;
};
module.exports = $57577a9cf5355ef5$var$Renderer;

});

parcelRequire.register("iylQ1", function(module, exports) {
/** internal
 * class Core
 *
 * Top-level rules executor. Glues block/inline parsers and does intermediate
 * transformations.
 **/ "use strict";

var $6HV6l = parcelRequire("6HV6l");







var $d81c578a332eb849$var$_rules = [
    [
        "normalize",
        (parcelRequire("hlztZ"))
    ],
    [
        "block",
        (parcelRequire("5Thon"))
    ],
    [
        "inline",
        (parcelRequire("7AzVC"))
    ],
    [
        "linkify",
        (parcelRequire("iy2KD"))
    ],
    [
        "replacements",
        (parcelRequire("4fKr7"))
    ],
    [
        "smartquotes",
        (parcelRequire("258Fl"))
    ],
    // `text_join` finds `text_special` tokens (for escape sequences)
    // and joins them with the rest of the text
    [
        "text_join",
        (parcelRequire("f2LYP"))
    ]
];
/**
 * new Core()
 **/ function $d81c578a332eb849$var$Core() {
    /**
   * Core#ruler -> Ruler
   *
   * [[Ruler]] instance. Keep configuration of core rules.
   **/ this.ruler = new $6HV6l();
    for(var i = 0; i < $d81c578a332eb849$var$_rules.length; i++)this.ruler.push($d81c578a332eb849$var$_rules[i][0], $d81c578a332eb849$var$_rules[i][1]);
}
/**
 * Core.process(state)
 *
 * Executes core chain rules.
 **/ $d81c578a332eb849$var$Core.prototype.process = function(state) {
    var i, l, rules;
    rules = this.ruler.getRules("");
    for(i = 0, l = rules.length; i < l; i++)rules[i](state);
};

$d81c578a332eb849$var$Core.prototype.State = (parcelRequire("3taGC"));
module.exports = $d81c578a332eb849$var$Core;

});
parcelRequire.register("6HV6l", function(module, exports) {
/**
 * class Ruler
 *
 * Helper class, used by [[MarkdownIt#core]], [[MarkdownIt#block]] and
 * [[MarkdownIt#inline]] to manage sequences of functions (rules):
 *
 * - keep rules in defined order
 * - assign the name to each rule
 * - enable/disable rules
 * - add/replace rules
 * - allow assign rules to additional named chains (in the same)
 * - cacheing lists of active rules
 *
 * You will not need use this class directly until write plugins. For simple
 * rules control use [[MarkdownIt.disable]], [[MarkdownIt.enable]] and
 * [[MarkdownIt.use]].
 **/ "use strict";
/**
 * new Ruler()
 **/ function $4e230d59cb75ed15$var$Ruler() {
    // List of added rules. Each element is:
    //
    // {
    //   name: XXX,
    //   enabled: Boolean,
    //   fn: Function(),
    //   alt: [ name2, name3 ]
    // }
    //
    this.__rules__ = [];
    // Cached rule chains.
    //
    // First level - chain name, '' for default.
    // Second level - diginal anchor for fast filtering by charcodes.
    //
    this.__cache__ = null;
}
////////////////////////////////////////////////////////////////////////////////
// Helper methods, should not be used directly
// Find rule index by name
//
$4e230d59cb75ed15$var$Ruler.prototype.__find__ = function(name) {
    for(var i = 0; i < this.__rules__.length; i++){
        if (this.__rules__[i].name === name) return i;
    }
    return -1;
};
// Build rules lookup cache
//
$4e230d59cb75ed15$var$Ruler.prototype.__compile__ = function() {
    var self = this;
    var chains = [
        ""
    ];
    // collect unique names
    self.__rules__.forEach(function(rule) {
        if (!rule.enabled) return;
        rule.alt.forEach(function(altName) {
            if (chains.indexOf(altName) < 0) chains.push(altName);
        });
    });
    self.__cache__ = {};
    chains.forEach(function(chain) {
        self.__cache__[chain] = [];
        self.__rules__.forEach(function(rule) {
            if (!rule.enabled) return;
            if (chain && rule.alt.indexOf(chain) < 0) return;
            self.__cache__[chain].push(rule.fn);
        });
    });
};
/**
 * Ruler.at(name, fn [, options])
 * - name (String): rule name to replace.
 * - fn (Function): new rule function.
 * - options (Object): new rule options (not mandatory).
 *
 * Replace rule by name with new function & options. Throws error if name not
 * found.
 *
 * ##### Options:
 *
 * - __alt__ - array with names of "alternate" chains.
 *
 * ##### Example
 *
 * Replace existing typographer replacement rule with new one:
 *
 * ```javascript
 * var md = require('markdown-it')();
 *
 * md.core.ruler.at('replacements', function replace(state) {
 *   //...
 * });
 * ```
 **/ $4e230d59cb75ed15$var$Ruler.prototype.at = function(name, fn, options) {
    var index = this.__find__(name);
    var opt = options || {};
    if (index === -1) throw new Error("Parser rule not found: " + name);
    this.__rules__[index].fn = fn;
    this.__rules__[index].alt = opt.alt || [];
    this.__cache__ = null;
};
/**
 * Ruler.before(beforeName, ruleName, fn [, options])
 * - beforeName (String): new rule will be added before this one.
 * - ruleName (String): name of added rule.
 * - fn (Function): rule function.
 * - options (Object): rule options (not mandatory).
 *
 * Add new rule to chain before one with given name. See also
 * [[Ruler.after]], [[Ruler.push]].
 *
 * ##### Options:
 *
 * - __alt__ - array with names of "alternate" chains.
 *
 * ##### Example
 *
 * ```javascript
 * var md = require('markdown-it')();
 *
 * md.block.ruler.before('paragraph', 'my_rule', function replace(state) {
 *   //...
 * });
 * ```
 **/ $4e230d59cb75ed15$var$Ruler.prototype.before = function(beforeName, ruleName, fn, options) {
    var index = this.__find__(beforeName);
    var opt = options || {};
    if (index === -1) throw new Error("Parser rule not found: " + beforeName);
    this.__rules__.splice(index, 0, {
        name: ruleName,
        enabled: true,
        fn: fn,
        alt: opt.alt || []
    });
    this.__cache__ = null;
};
/**
 * Ruler.after(afterName, ruleName, fn [, options])
 * - afterName (String): new rule will be added after this one.
 * - ruleName (String): name of added rule.
 * - fn (Function): rule function.
 * - options (Object): rule options (not mandatory).
 *
 * Add new rule to chain after one with given name. See also
 * [[Ruler.before]], [[Ruler.push]].
 *
 * ##### Options:
 *
 * - __alt__ - array with names of "alternate" chains.
 *
 * ##### Example
 *
 * ```javascript
 * var md = require('markdown-it')();
 *
 * md.inline.ruler.after('text', 'my_rule', function replace(state) {
 *   //...
 * });
 * ```
 **/ $4e230d59cb75ed15$var$Ruler.prototype.after = function(afterName, ruleName, fn, options) {
    var index = this.__find__(afterName);
    var opt = options || {};
    if (index === -1) throw new Error("Parser rule not found: " + afterName);
    this.__rules__.splice(index + 1, 0, {
        name: ruleName,
        enabled: true,
        fn: fn,
        alt: opt.alt || []
    });
    this.__cache__ = null;
};
/**
 * Ruler.push(ruleName, fn [, options])
 * - ruleName (String): name of added rule.
 * - fn (Function): rule function.
 * - options (Object): rule options (not mandatory).
 *
 * Push new rule to the end of chain. See also
 * [[Ruler.before]], [[Ruler.after]].
 *
 * ##### Options:
 *
 * - __alt__ - array with names of "alternate" chains.
 *
 * ##### Example
 *
 * ```javascript
 * var md = require('markdown-it')();
 *
 * md.core.ruler.push('my_rule', function replace(state) {
 *   //...
 * });
 * ```
 **/ $4e230d59cb75ed15$var$Ruler.prototype.push = function(ruleName, fn, options) {
    var opt = options || {};
    this.__rules__.push({
        name: ruleName,
        enabled: true,
        fn: fn,
        alt: opt.alt || []
    });
    this.__cache__ = null;
};
/**
 * Ruler.enable(list [, ignoreInvalid]) -> Array
 * - list (String|Array): list of rule names to enable.
 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
 *
 * Enable rules with given names. If any rule name not found - throw Error.
 * Errors can be disabled by second param.
 *
 * Returns list of found rule names (if no exception happened).
 *
 * See also [[Ruler.disable]], [[Ruler.enableOnly]].
 **/ $4e230d59cb75ed15$var$Ruler.prototype.enable = function(list, ignoreInvalid) {
    if (!Array.isArray(list)) list = [
        list
    ];
    var result = [];
    // Search by name and enable
    list.forEach(function(name) {
        var idx = this.__find__(name);
        if (idx < 0) {
            if (ignoreInvalid) return;
            throw new Error("Rules manager: invalid rule name " + name);
        }
        this.__rules__[idx].enabled = true;
        result.push(name);
    }, this);
    this.__cache__ = null;
    return result;
};
/**
 * Ruler.enableOnly(list [, ignoreInvalid])
 * - list (String|Array): list of rule names to enable (whitelist).
 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
 *
 * Enable rules with given names, and disable everything else. If any rule name
 * not found - throw Error. Errors can be disabled by second param.
 *
 * See also [[Ruler.disable]], [[Ruler.enable]].
 **/ $4e230d59cb75ed15$var$Ruler.prototype.enableOnly = function(list, ignoreInvalid) {
    if (!Array.isArray(list)) list = [
        list
    ];
    this.__rules__.forEach(function(rule) {
        rule.enabled = false;
    });
    this.enable(list, ignoreInvalid);
};
/**
 * Ruler.disable(list [, ignoreInvalid]) -> Array
 * - list (String|Array): list of rule names to disable.
 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
 *
 * Disable rules with given names. If any rule name not found - throw Error.
 * Errors can be disabled by second param.
 *
 * Returns list of found rule names (if no exception happened).
 *
 * See also [[Ruler.enable]], [[Ruler.enableOnly]].
 **/ $4e230d59cb75ed15$var$Ruler.prototype.disable = function(list, ignoreInvalid) {
    if (!Array.isArray(list)) list = [
        list
    ];
    var result = [];
    // Search by name and disable
    list.forEach(function(name) {
        var idx = this.__find__(name);
        if (idx < 0) {
            if (ignoreInvalid) return;
            throw new Error("Rules manager: invalid rule name " + name);
        }
        this.__rules__[idx].enabled = false;
        result.push(name);
    }, this);
    this.__cache__ = null;
    return result;
};
/**
 * Ruler.getRules(chainName) -> Array
 *
 * Return array of active functions (rules) for given chain name. It analyzes
 * rules configuration, compiles caches if not exists and returns result.
 *
 * Default chain name is `''` (empty string). It can't be skipped. That's
 * done intentionally, to keep signature monomorphic for high speed.
 **/ $4e230d59cb75ed15$var$Ruler.prototype.getRules = function(chainName) {
    if (this.__cache__ === null) this.__compile__();
    // Chain can be empty, if rules disabled. But we still have to return Array.
    return this.__cache__[chainName] || [];
};
module.exports = $4e230d59cb75ed15$var$Ruler;

});

parcelRequire.register("hlztZ", function(module, exports) {
// Normalize input string
"use strict";
// https://spec.commonmark.org/0.29/#line-ending
var $ca0febf327c4d8bf$var$NEWLINES_RE = /\r\n?|\n/g;
var $ca0febf327c4d8bf$var$NULL_RE = /\0/g;
module.exports = function normalize(state) {
    var str;
    // Normalize newlines
    str = state.src.replace($ca0febf327c4d8bf$var$NEWLINES_RE, "\n");
    // Replace NULL characters
    str = str.replace($ca0febf327c4d8bf$var$NULL_RE, "�");
    state.src = str;
};

});

parcelRequire.register("5Thon", function(module, exports) {
"use strict";
module.exports = function block(state) {
    var token;
    if (state.inlineMode) {
        token = new state.Token("inline", "", 0);
        token.content = state.src;
        token.map = [
            0,
            1
        ];
        token.children = [];
        state.tokens.push(token);
    } else state.md.block.parse(state.src, state.md, state.env, state.tokens);
};

});

parcelRequire.register("7AzVC", function(module, exports) {
"use strict";
module.exports = function inline(state) {
    var tokens = state.tokens, tok, i, l;
    // Parse inlines
    for(i = 0, l = tokens.length; i < l; i++){
        tok = tokens[i];
        if (tok.type === "inline") state.md.inline.parse(tok.content, state.md, state.env, tok.children);
    }
};

});

parcelRequire.register("iy2KD", function(module, exports) {
// Replace link-like texts with link nodes.
//
// Currently restricted by `md.validateLink()` to http/https/ftp
//
"use strict";

var $4VIu7 = parcelRequire("4VIu7");
var $d80d89491abcd4d9$require$arrayReplaceAt = $4VIu7.arrayReplaceAt;
function $d80d89491abcd4d9$var$isLinkOpen(str) {
    return /^<a[>\s]/i.test(str);
}
function $d80d89491abcd4d9$var$isLinkClose(str) {
    return /^<\/a\s*>/i.test(str);
}
module.exports = function linkify(state) {
    var i, j, l, tokens, token, currentToken, nodes, ln, text, pos, lastPos, level, htmlLinkLevel, url, fullUrl, urlText, blockTokens = state.tokens, links;
    if (!state.md.options.linkify) return;
    for(j = 0, l = blockTokens.length; j < l; j++){
        if (blockTokens[j].type !== "inline" || !state.md.linkify.pretest(blockTokens[j].content)) continue;
        tokens = blockTokens[j].children;
        htmlLinkLevel = 0;
        // We scan from the end, to keep position when new tags added.
        // Use reversed logic in links start/end match
        for(i = tokens.length - 1; i >= 0; i--){
            currentToken = tokens[i];
            // Skip content of markdown links
            if (currentToken.type === "link_close") {
                i--;
                while(tokens[i].level !== currentToken.level && tokens[i].type !== "link_open")i--;
                continue;
            }
            // Skip content of html tag links
            if (currentToken.type === "html_inline") {
                if ($d80d89491abcd4d9$var$isLinkOpen(currentToken.content) && htmlLinkLevel > 0) htmlLinkLevel--;
                if ($d80d89491abcd4d9$var$isLinkClose(currentToken.content)) htmlLinkLevel++;
            }
            if (htmlLinkLevel > 0) continue;
            if (currentToken.type === "text" && state.md.linkify.test(currentToken.content)) {
                text = currentToken.content;
                links = state.md.linkify.match(text);
                // Now split string to nodes
                nodes = [];
                level = currentToken.level;
                lastPos = 0;
                // forbid escape sequence at the start of the string,
                // this avoids http\://example.com/ from being linkified as
                // http:<a href="//example.com/">//example.com/</a>
                if (links.length > 0 && links[0].index === 0 && i > 0 && tokens[i - 1].type === "text_special") links = links.slice(1);
                for(ln = 0; ln < links.length; ln++){
                    url = links[ln].url;
                    fullUrl = state.md.normalizeLink(url);
                    if (!state.md.validateLink(fullUrl)) continue;
                    urlText = links[ln].text;
                    // Linkifier might send raw hostnames like "example.com", where url
                    // starts with domain name. So we prepend http:// in those cases,
                    // and remove it afterwards.
                    //
                    if (!links[ln].schema) urlText = state.md.normalizeLinkText("http://" + urlText).replace(/^http:\/\//, "");
                    else if (links[ln].schema === "mailto:" && !/^mailto:/i.test(urlText)) urlText = state.md.normalizeLinkText("mailto:" + urlText).replace(/^mailto:/, "");
                    else urlText = state.md.normalizeLinkText(urlText);
                    pos = links[ln].index;
                    if (pos > lastPos) {
                        token = new state.Token("text", "", 0);
                        token.content = text.slice(lastPos, pos);
                        token.level = level;
                        nodes.push(token);
                    }
                    token = new state.Token("link_open", "a", 1);
                    token.attrs = [
                        [
                            "href",
                            fullUrl
                        ]
                    ];
                    token.level = level++;
                    token.markup = "linkify";
                    token.info = "auto";
                    nodes.push(token);
                    token = new state.Token("text", "", 0);
                    token.content = urlText;
                    token.level = level;
                    nodes.push(token);
                    token = new state.Token("link_close", "a", -1);
                    token.level = --level;
                    token.markup = "linkify";
                    token.info = "auto";
                    nodes.push(token);
                    lastPos = links[ln].lastIndex;
                }
                if (lastPos < text.length) {
                    token = new state.Token("text", "", 0);
                    token.content = text.slice(lastPos);
                    token.level = level;
                    nodes.push(token);
                }
                // replace current node
                blockTokens[j].children = tokens = $d80d89491abcd4d9$require$arrayReplaceAt(tokens, i, nodes);
            }
        }
    }
};

});

parcelRequire.register("4fKr7", function(module, exports) {
// Simple typographic replacements
//
// (c) (C) → ©
// (tm) (TM) → ™
// (r) (R) → ®
// +- → ±
// (p) (P) -> §
// ... → … (also ?.... → ?.., !.... → !..)
// ???????? → ???, !!!!! → !!!, `,,` → `,`
// -- → &ndash;, --- → &mdash;
//
"use strict";
// TODO:
// - fractionals 1/2, 1/4, 3/4 -> ½, ¼, ¾
// - multiplications 2 x 4 -> 2 × 4
var $318c956b196f549c$var$RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;
// Workaround for phantomjs - need regex without /g flag,
// or root check will fail every second time
var $318c956b196f549c$var$SCOPED_ABBR_TEST_RE = /\((c|tm|r)\)/i;
var $318c956b196f549c$var$SCOPED_ABBR_RE = /\((c|tm|r)\)/ig;
var $318c956b196f549c$var$SCOPED_ABBR = {
    c: "\xa9",
    r: "\xae",
    tm: "™"
};
function $318c956b196f549c$var$replaceFn(match, name) {
    return $318c956b196f549c$var$SCOPED_ABBR[name.toLowerCase()];
}
function $318c956b196f549c$var$replace_scoped(inlineTokens) {
    var i, token, inside_autolink = 0;
    for(i = inlineTokens.length - 1; i >= 0; i--){
        token = inlineTokens[i];
        if (token.type === "text" && !inside_autolink) token.content = token.content.replace($318c956b196f549c$var$SCOPED_ABBR_RE, $318c956b196f549c$var$replaceFn);
        if (token.type === "link_open" && token.info === "auto") inside_autolink--;
        if (token.type === "link_close" && token.info === "auto") inside_autolink++;
    }
}
function $318c956b196f549c$var$replace_rare(inlineTokens) {
    var i, token, inside_autolink = 0;
    for(i = inlineTokens.length - 1; i >= 0; i--){
        token = inlineTokens[i];
        if (token.type === "text" && !inside_autolink) {
            if ($318c956b196f549c$var$RARE_RE.test(token.content)) token.content = token.content.replace(/\+-/g, "\xb1")// .., ..., ....... -> …
            // but ?..... & !..... -> ?.. & !..
            .replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",")// em-dash
            .replace(/(^|[^-])---(?=[^-]|$)/mg, "$1—")// en-dash
            .replace(/(^|\s)--(?=\s|$)/mg, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/mg, "$1–");
        }
        if (token.type === "link_open" && token.info === "auto") inside_autolink--;
        if (token.type === "link_close" && token.info === "auto") inside_autolink++;
    }
}
module.exports = function replace(state) {
    var blkIdx;
    if (!state.md.options.typographer) return;
    for(blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--){
        if (state.tokens[blkIdx].type !== "inline") continue;
        if ($318c956b196f549c$var$SCOPED_ABBR_TEST_RE.test(state.tokens[blkIdx].content)) $318c956b196f549c$var$replace_scoped(state.tokens[blkIdx].children);
        if ($318c956b196f549c$var$RARE_RE.test(state.tokens[blkIdx].content)) $318c956b196f549c$var$replace_rare(state.tokens[blkIdx].children);
    }
};

});

parcelRequire.register("258Fl", function(module, exports) {
// Convert straight quotation marks to typographic ones
//
"use strict";

var $4VIu7 = parcelRequire("4VIu7");
var $1842c54233f1227e$require$isWhiteSpace = $4VIu7.isWhiteSpace;

var $4VIu7 = parcelRequire("4VIu7");
var $1842c54233f1227e$require$isPunctChar = $4VIu7.isPunctChar;

var $4VIu7 = parcelRequire("4VIu7");
var $1842c54233f1227e$require$isMdAsciiPunct = $4VIu7.isMdAsciiPunct;
var $1842c54233f1227e$var$QUOTE_TEST_RE = /['"]/;
var $1842c54233f1227e$var$QUOTE_RE = /['"]/g;
var $1842c54233f1227e$var$APOSTROPHE = "’"; /* ’ */ 
function $1842c54233f1227e$var$replaceAt(str, index, ch) {
    return str.slice(0, index) + ch + str.slice(index + 1);
}
function $1842c54233f1227e$var$process_inlines(tokens, state) {
    var i, token, text, t, pos, max, thisLevel, item, lastChar, nextChar, isLastPunctChar, isNextPunctChar, isLastWhiteSpace, isNextWhiteSpace, canOpen, canClose, j, isSingle, stack, openQuote, closeQuote;
    stack = [];
    for(i = 0; i < tokens.length; i++){
        token = tokens[i];
        thisLevel = tokens[i].level;
        for(j = stack.length - 1; j >= 0; j--){
            if (stack[j].level <= thisLevel) break;
        }
        stack.length = j + 1;
        if (token.type !== "text") continue;
        text = token.content;
        pos = 0;
        max = text.length;
        /*eslint no-labels:0,block-scoped-var:0*/ OUTER: while(pos < max){
            $1842c54233f1227e$var$QUOTE_RE.lastIndex = pos;
            t = $1842c54233f1227e$var$QUOTE_RE.exec(text);
            if (!t) break;
            canOpen = canClose = true;
            pos = t.index + 1;
            isSingle = t[0] === "'";
            // Find previous character,
            // default to space if it's the beginning of the line
            //
            lastChar = 0x20;
            if (t.index - 1 >= 0) lastChar = text.charCodeAt(t.index - 1);
            else for(j = i - 1; j >= 0; j--){
                if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak") break; // lastChar defaults to 0x20
                if (!tokens[j].content) continue; // should skip all tokens except 'text', 'html_inline' or 'code_inline'
                lastChar = tokens[j].content.charCodeAt(tokens[j].content.length - 1);
                break;
            }
            // Find next character,
            // default to space if it's the end of the line
            //
            nextChar = 0x20;
            if (pos < max) nextChar = text.charCodeAt(pos);
            else for(j = i + 1; j < tokens.length; j++){
                if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak") break; // nextChar defaults to 0x20
                if (!tokens[j].content) continue; // should skip all tokens except 'text', 'html_inline' or 'code_inline'
                nextChar = tokens[j].content.charCodeAt(0);
                break;
            }
            isLastPunctChar = $1842c54233f1227e$require$isMdAsciiPunct(lastChar) || $1842c54233f1227e$require$isPunctChar(String.fromCharCode(lastChar));
            isNextPunctChar = $1842c54233f1227e$require$isMdAsciiPunct(nextChar) || $1842c54233f1227e$require$isPunctChar(String.fromCharCode(nextChar));
            isLastWhiteSpace = $1842c54233f1227e$require$isWhiteSpace(lastChar);
            isNextWhiteSpace = $1842c54233f1227e$require$isWhiteSpace(nextChar);
            if (isNextWhiteSpace) canOpen = false;
            else if (isNextPunctChar) {
                if (!(isLastWhiteSpace || isLastPunctChar)) canOpen = false;
            }
            if (isLastWhiteSpace) canClose = false;
            else if (isLastPunctChar) {
                if (!(isNextWhiteSpace || isNextPunctChar)) canClose = false;
            }
            if (nextChar === 0x22 /* " */  && t[0] === '"') {
                if (lastChar >= 0x30 /* 0 */  && lastChar <= 0x39 /* 9 */ ) // special case: 1"" - count first quote as an inch
                canClose = canOpen = false;
            }
            if (canOpen && canClose) {
                // Replace quotes in the middle of punctuation sequence, but not
                // in the middle of the words, i.e.:
                //
                // 1. foo " bar " baz - not replaced
                // 2. foo-"-bar-"-baz - replaced
                // 3. foo"bar"baz     - not replaced
                //
                canOpen = isLastPunctChar;
                canClose = isNextPunctChar;
            }
            if (!canOpen && !canClose) {
                // middle of word
                if (isSingle) token.content = $1842c54233f1227e$var$replaceAt(token.content, t.index, $1842c54233f1227e$var$APOSTROPHE);
                continue;
            }
            if (canClose) // this could be a closing quote, rewind the stack to get a match
            for(j = stack.length - 1; j >= 0; j--){
                item = stack[j];
                if (stack[j].level < thisLevel) break;
                if (item.single === isSingle && stack[j].level === thisLevel) {
                    item = stack[j];
                    if (isSingle) {
                        openQuote = state.md.options.quotes[2];
                        closeQuote = state.md.options.quotes[3];
                    } else {
                        openQuote = state.md.options.quotes[0];
                        closeQuote = state.md.options.quotes[1];
                    }
                    // replace token.content *before* tokens[item.token].content,
                    // because, if they are pointing at the same token, replaceAt
                    // could mess up indices when quote length != 1
                    token.content = $1842c54233f1227e$var$replaceAt(token.content, t.index, closeQuote);
                    tokens[item.token].content = $1842c54233f1227e$var$replaceAt(tokens[item.token].content, item.pos, openQuote);
                    pos += closeQuote.length - 1;
                    if (item.token === i) pos += openQuote.length - 1;
                    text = token.content;
                    max = text.length;
                    stack.length = j;
                    continue OUTER;
                }
            }
            if (canOpen) stack.push({
                token: i,
                pos: t.index,
                single: isSingle,
                level: thisLevel
            });
            else if (canClose && isSingle) token.content = $1842c54233f1227e$var$replaceAt(token.content, t.index, $1842c54233f1227e$var$APOSTROPHE);
        }
    }
}
module.exports = function smartquotes(state) {
    /*eslint max-depth:0*/ var blkIdx;
    if (!state.md.options.typographer) return;
    for(blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--){
        if (state.tokens[blkIdx].type !== "inline" || !$1842c54233f1227e$var$QUOTE_TEST_RE.test(state.tokens[blkIdx].content)) continue;
        $1842c54233f1227e$var$process_inlines(state.tokens[blkIdx].children, state);
    }
};

});

parcelRequire.register("f2LYP", function(module, exports) {
// Join raw text tokens with the rest of the text
//
// This is set as a separate rule to provide an opportunity for plugins
// to run text replacements after text join, but before escape join.
//
// For example, `\:)` shouldn't be replaced with an emoji.
//
"use strict";
module.exports = function text_join(state) {
    var j, l, tokens, curr, max, last, blockTokens = state.tokens;
    for(j = 0, l = blockTokens.length; j < l; j++){
        if (blockTokens[j].type !== "inline") continue;
        tokens = blockTokens[j].children;
        max = tokens.length;
        for(curr = 0; curr < max; curr++)if (tokens[curr].type === "text_special") tokens[curr].type = "text";
        for(curr = last = 0; curr < max; curr++)if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") // collapse two adjacent text nodes
        tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
        else {
            if (curr !== last) tokens[last] = tokens[curr];
            last++;
        }
        if (curr !== last) tokens.length = last;
    }
};

});

parcelRequire.register("3taGC", function(module, exports) {
// Core state object
//
"use strict";

var $em0se = parcelRequire("em0se");
function $286c5ea1cfced85c$var$StateCore(src, md, env) {
    this.src = src;
    this.env = env;
    this.tokens = [];
    this.inlineMode = false;
    this.md = md; // link to parser instance
}
// re-export Token class to use in core rules
$286c5ea1cfced85c$var$StateCore.prototype.Token = $em0se;
module.exports = $286c5ea1cfced85c$var$StateCore;

});
parcelRequire.register("em0se", function(module, exports) {
// Token class
"use strict";
/**
 * class Token
 **/ /**
 * new Token(type, tag, nesting)
 *
 * Create new token and fill passed properties.
 **/ function $a73378fa709bccaf$var$Token(type, tag, nesting) {
    /**
   * Token#type -> String
   *
   * Type of the token (string, e.g. "paragraph_open")
   **/ this.type = type;
    /**
   * Token#tag -> String
   *
   * html tag name, e.g. "p"
   **/ this.tag = tag;
    /**
   * Token#attrs -> Array
   *
   * Html attributes. Format: `[ [ name1, value1 ], [ name2, value2 ] ]`
   **/ this.attrs = null;
    /**
   * Token#map -> Array
   *
   * Source map info. Format: `[ line_begin, line_end ]`
   **/ this.map = null;
    /**
   * Token#nesting -> Number
   *
   * Level change (number in {-1, 0, 1} set), where:
   *
   * -  `1` means the tag is opening
   * -  `0` means the tag is self-closing
   * - `-1` means the tag is closing
   **/ this.nesting = nesting;
    /**
   * Token#level -> Number
   *
   * nesting level, the same as `state.level`
   **/ this.level = 0;
    /**
   * Token#children -> Array
   *
   * An array of child nodes (inline and img tokens)
   **/ this.children = null;
    /**
   * Token#content -> String
   *
   * In a case of self-closing tag (code, html, fence, etc.),
   * it has contents of this tag.
   **/ this.content = "";
    /**
   * Token#markup -> String
   *
   * '*' or '_' for emphasis, fence string for fence, etc.
   **/ this.markup = "";
    /**
   * Token#info -> String
   *
   * Additional information:
   *
   * - Info string for "fence" tokens
   * - The value "auto" for autolink "link_open" and "link_close" tokens
   * - The string value of the item marker for ordered-list "list_item_open" tokens
   **/ this.info = "";
    /**
   * Token#meta -> Object
   *
   * A place for plugins to store an arbitrary data
   **/ this.meta = null;
    /**
   * Token#block -> Boolean
   *
   * True for block-level tokens, false for inline tokens.
   * Used in renderer to calculate line breaks
   **/ this.block = false;
    /**
   * Token#hidden -> Boolean
   *
   * If it's true, ignore this element when rendering. Used for tight lists
   * to hide paragraphs.
   **/ this.hidden = false;
}
/**
 * Token.attrIndex(name) -> Number
 *
 * Search attribute index by name.
 **/ $a73378fa709bccaf$var$Token.prototype.attrIndex = function attrIndex(name) {
    var attrs, i, len;
    if (!this.attrs) return -1;
    attrs = this.attrs;
    for(i = 0, len = attrs.length; i < len; i++){
        if (attrs[i][0] === name) return i;
    }
    return -1;
};
/**
 * Token.attrPush(attrData)
 *
 * Add `[ name, value ]` attribute to list. Init attrs if necessary
 **/ $a73378fa709bccaf$var$Token.prototype.attrPush = function attrPush(attrData) {
    if (this.attrs) this.attrs.push(attrData);
    else this.attrs = [
        attrData
    ];
};
/**
 * Token.attrSet(name, value)
 *
 * Set `name` attribute to `value`. Override old value if exists.
 **/ $a73378fa709bccaf$var$Token.prototype.attrSet = function attrSet(name, value) {
    var idx = this.attrIndex(name), attrData = [
        name,
        value
    ];
    if (idx < 0) this.attrPush(attrData);
    else this.attrs[idx] = attrData;
};
/**
 * Token.attrGet(name)
 *
 * Get the value of attribute `name`, or null if it does not exist.
 **/ $a73378fa709bccaf$var$Token.prototype.attrGet = function attrGet(name) {
    var idx = this.attrIndex(name), value = null;
    if (idx >= 0) value = this.attrs[idx][1];
    return value;
};
/**
 * Token.attrJoin(name, value)
 *
 * Join value to existing attribute via space. Or create new attribute if not
 * exists. Useful to operate with token classes.
 **/ $a73378fa709bccaf$var$Token.prototype.attrJoin = function attrJoin(name, value) {
    var idx = this.attrIndex(name);
    if (idx < 0) this.attrPush([
        name,
        value
    ]);
    else this.attrs[idx][1] = this.attrs[idx][1] + " " + value;
};
module.exports = $a73378fa709bccaf$var$Token;

});



parcelRequire.register("d8qw6", function(module, exports) {
/** internal
 * class ParserBlock
 *
 * Block-level tokenizer.
 **/ "use strict";

var $6HV6l = parcelRequire("6HV6l");











var $99009764c5fa7edc$var$_rules = [
    // First 2 params - rule name & source. Secondary array - list of rules,
    // which can be terminated by this one.
    [
        "table",
        (parcelRequire("a5ZCD")),
        [
            "paragraph",
            "reference"
        ]
    ],
    [
        "code",
        (parcelRequire("6Elbs"))
    ],
    [
        "fence",
        (parcelRequire("acdUc")),
        [
            "paragraph",
            "reference",
            "blockquote",
            "list"
        ]
    ],
    [
        "blockquote",
        (parcelRequire("8dsuv")),
        [
            "paragraph",
            "reference",
            "blockquote",
            "list"
        ]
    ],
    [
        "hr",
        (parcelRequire("9kumg")),
        [
            "paragraph",
            "reference",
            "blockquote",
            "list"
        ]
    ],
    [
        "list",
        (parcelRequire("aTfdQ")),
        [
            "paragraph",
            "reference",
            "blockquote"
        ]
    ],
    [
        "reference",
        (parcelRequire("gHkWc"))
    ],
    [
        "html_block",
        (parcelRequire("7LCWC")),
        [
            "paragraph",
            "reference",
            "blockquote"
        ]
    ],
    [
        "heading",
        (parcelRequire("eyPCd")),
        [
            "paragraph",
            "reference",
            "blockquote"
        ]
    ],
    [
        "lheading",
        (parcelRequire("eaXto"))
    ],
    [
        "paragraph",
        (parcelRequire("hKUEH"))
    ]
];
/**
 * new ParserBlock()
 **/ function $99009764c5fa7edc$var$ParserBlock() {
    /**
   * ParserBlock#ruler -> Ruler
   *
   * [[Ruler]] instance. Keep configuration of block rules.
   **/ this.ruler = new $6HV6l();
    for(var i = 0; i < $99009764c5fa7edc$var$_rules.length; i++)this.ruler.push($99009764c5fa7edc$var$_rules[i][0], $99009764c5fa7edc$var$_rules[i][1], {
        alt: ($99009764c5fa7edc$var$_rules[i][2] || []).slice()
    });
}
// Generate tokens for input range
//
$99009764c5fa7edc$var$ParserBlock.prototype.tokenize = function(state, startLine, endLine) {
    var ok, i, rules = this.ruler.getRules(""), len = rules.length, line = startLine, hasEmptyLines = false, maxNesting = state.md.options.maxNesting;
    while(line < endLine){
        state.line = line = state.skipEmptyLines(line);
        if (line >= endLine) break;
        // Termination condition for nested calls.
        // Nested calls currently used for blockquotes & lists
        if (state.sCount[line] < state.blkIndent) break;
        // If nesting level exceeded - skip tail to the end. That's not ordinary
        // situation and we should not care about content.
        if (state.level >= maxNesting) {
            state.line = endLine;
            break;
        }
        // Try all possible rules.
        // On success, rule should:
        //
        // - update `state.line`
        // - update `state.tokens`
        // - return true
        for(i = 0; i < len; i++){
            ok = rules[i](state, line, endLine, false);
            if (ok) break;
        }
        // set state.tight if we had an empty line before current tag
        // i.e. latest empty line should not count
        state.tight = !hasEmptyLines;
        // paragraph might "eat" one newline after it in nested lists
        if (state.isEmpty(state.line - 1)) hasEmptyLines = true;
        line = state.line;
        if (line < endLine && state.isEmpty(line)) {
            hasEmptyLines = true;
            line++;
            state.line = line;
        }
    }
};
/**
 * ParserBlock.parse(str, md, env, outTokens)
 *
 * Process input string and push block tokens into `outTokens`
 **/ $99009764c5fa7edc$var$ParserBlock.prototype.parse = function(src, md, env, outTokens) {
    var state;
    if (!src) return;
    state = new this.State(src, md, env, outTokens);
    this.tokenize(state, state.line, state.lineMax);
};

$99009764c5fa7edc$var$ParserBlock.prototype.State = (parcelRequire("bLbh7"));
module.exports = $99009764c5fa7edc$var$ParserBlock;

});
parcelRequire.register("a5ZCD", function(module, exports) {
// GFM table, https://github.github.com/gfm/#tables-extension-
"use strict";

var $4VIu7 = parcelRequire("4VIu7");
var $759a2bdd0e89dc01$require$isSpace = $4VIu7.isSpace;
function $759a2bdd0e89dc01$var$getLine(state, line) {
    var pos = state.bMarks[line] + state.tShift[line], max = state.eMarks[line];
    return state.src.slice(pos, max);
}
function $759a2bdd0e89dc01$var$escapedSplit(str) {
    var result = [], pos = 0, max = str.length, ch, isEscaped = false, lastPos = 0, current = "";
    ch = str.charCodeAt(pos);
    while(pos < max){
        if (ch === 0x7c /* | */ ) {
            if (!isEscaped) {
                // pipe separating cells, '|'
                result.push(current + str.substring(lastPos, pos));
                current = "";
                lastPos = pos + 1;
            } else {
                // escaped pipe, '\|'
                current += str.substring(lastPos, pos - 1);
                lastPos = pos;
            }
        }
        isEscaped = ch === 0x5c /* \ */ ;
        pos++;
        ch = str.charCodeAt(pos);
    }
    result.push(current + str.substring(lastPos));
    return result;
}
module.exports = function table(state, startLine, endLine, silent) {
    var ch, lineText, pos, i, l, nextLine, columns, columnCount, token, aligns, t, tableLines, tbodyLines, oldParentType, terminate, terminatorRules, firstCh, secondCh;
    // should have at least two lines
    if (startLine + 2 > endLine) return false;
    nextLine = startLine + 1;
    if (state.sCount[nextLine] < state.blkIndent) return false;
    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[nextLine] - state.blkIndent >= 4) return false;
    // first character of the second line should be '|', '-', ':',
    // and no other characters are allowed but spaces;
    // basically, this is the equivalent of /^[-:|][-:|\s]*$/ regexp
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    if (pos >= state.eMarks[nextLine]) return false;
    firstCh = state.src.charCodeAt(pos++);
    if (firstCh !== 0x7C /* | */  && firstCh !== 0x2D /* - */  && firstCh !== 0x3A /* : */ ) return false;
    if (pos >= state.eMarks[nextLine]) return false;
    secondCh = state.src.charCodeAt(pos++);
    if (secondCh !== 0x7C /* | */  && secondCh !== 0x2D /* - */  && secondCh !== 0x3A /* : */  && !$759a2bdd0e89dc01$require$isSpace(secondCh)) return false;
    // if first character is '-', then second character must not be a space
    // (due to parsing ambiguity with list)
    if (firstCh === 0x2D /* - */  && $759a2bdd0e89dc01$require$isSpace(secondCh)) return false;
    while(pos < state.eMarks[nextLine]){
        ch = state.src.charCodeAt(pos);
        if (ch !== 0x7C /* | */  && ch !== 0x2D /* - */  && ch !== 0x3A /* : */  && !$759a2bdd0e89dc01$require$isSpace(ch)) return false;
        pos++;
    }
    lineText = $759a2bdd0e89dc01$var$getLine(state, startLine + 1);
    columns = lineText.split("|");
    aligns = [];
    for(i = 0; i < columns.length; i++){
        t = columns[i].trim();
        if (!t) {
            // allow empty columns before and after table, but not in between columns;
            // e.g. allow ` |---| `, disallow ` ---||--- `
            if (i === 0 || i === columns.length - 1) continue;
            else return false;
        }
        if (!/^:?-+:?$/.test(t)) return false;
        if (t.charCodeAt(t.length - 1) === 0x3A /* : */ ) aligns.push(t.charCodeAt(0) === 0x3A /* : */  ? "center" : "right");
        else if (t.charCodeAt(0) === 0x3A /* : */ ) aligns.push("left");
        else aligns.push("");
    }
    lineText = $759a2bdd0e89dc01$var$getLine(state, startLine).trim();
    if (lineText.indexOf("|") === -1) return false;
    if (state.sCount[startLine] - state.blkIndent >= 4) return false;
    columns = $759a2bdd0e89dc01$var$escapedSplit(lineText);
    if (columns.length && columns[0] === "") columns.shift();
    if (columns.length && columns[columns.length - 1] === "") columns.pop();
    // header row will define an amount of columns in the entire table,
    // and align row should be exactly the same (the rest of the rows can differ)
    columnCount = columns.length;
    if (columnCount === 0 || columnCount !== aligns.length) return false;
    if (silent) return true;
    oldParentType = state.parentType;
    state.parentType = "table";
    // use 'blockquote' lists for termination because it's
    // the most similar to tables
    terminatorRules = state.md.block.ruler.getRules("blockquote");
    token = state.push("table_open", "table", 1);
    token.map = tableLines = [
        startLine,
        0
    ];
    token = state.push("thead_open", "thead", 1);
    token.map = [
        startLine,
        startLine + 1
    ];
    token = state.push("tr_open", "tr", 1);
    token.map = [
        startLine,
        startLine + 1
    ];
    for(i = 0; i < columns.length; i++){
        token = state.push("th_open", "th", 1);
        if (aligns[i]) token.attrs = [
            [
                "style",
                "text-align:" + aligns[i]
            ]
        ];
        token = state.push("inline", "", 0);
        token.content = columns[i].trim();
        token.children = [];
        token = state.push("th_close", "th", -1);
    }
    token = state.push("tr_close", "tr", -1);
    token = state.push("thead_close", "thead", -1);
    for(nextLine = startLine + 2; nextLine < endLine; nextLine++){
        if (state.sCount[nextLine] < state.blkIndent) break;
        terminate = false;
        for(i = 0, l = terminatorRules.length; i < l; i++)if (terminatorRules[i](state, nextLine, endLine, true)) {
            terminate = true;
            break;
        }
        if (terminate) break;
        lineText = $759a2bdd0e89dc01$var$getLine(state, nextLine).trim();
        if (!lineText) break;
        if (state.sCount[nextLine] - state.blkIndent >= 4) break;
        columns = $759a2bdd0e89dc01$var$escapedSplit(lineText);
        if (columns.length && columns[0] === "") columns.shift();
        if (columns.length && columns[columns.length - 1] === "") columns.pop();
        if (nextLine === startLine + 2) {
            token = state.push("tbody_open", "tbody", 1);
            token.map = tbodyLines = [
                startLine + 2,
                0
            ];
        }
        token = state.push("tr_open", "tr", 1);
        token.map = [
            nextLine,
            nextLine + 1
        ];
        for(i = 0; i < columnCount; i++){
            token = state.push("td_open", "td", 1);
            if (aligns[i]) token.attrs = [
                [
                    "style",
                    "text-align:" + aligns[i]
                ]
            ];
            token = state.push("inline", "", 0);
            token.content = columns[i] ? columns[i].trim() : "";
            token.children = [];
            token = state.push("td_close", "td", -1);
        }
        token = state.push("tr_close", "tr", -1);
    }
    if (tbodyLines) {
        token = state.push("tbody_close", "tbody", -1);
        tbodyLines[1] = nextLine;
    }
    token = state.push("table_close", "table", -1);
    tableLines[1] = nextLine;
    state.parentType = oldParentType;
    state.line = nextLine;
    return true;
};

});

parcelRequire.register("6Elbs", function(module, exports) {
// Code block (4 spaces padded)
"use strict";
module.exports = function code(state, startLine, endLine /*, silent*/ ) {
    var nextLine, last, token;
    if (state.sCount[startLine] - state.blkIndent < 4) return false;
    last = nextLine = startLine + 1;
    while(nextLine < endLine){
        if (state.isEmpty(nextLine)) {
            nextLine++;
            continue;
        }
        if (state.sCount[nextLine] - state.blkIndent >= 4) {
            nextLine++;
            last = nextLine;
            continue;
        }
        break;
    }
    state.line = last;
    token = state.push("code_block", "code", 0);
    token.content = state.getLines(startLine, last, 4 + state.blkIndent, false) + "\n";
    token.map = [
        startLine,
        state.line
    ];
    return true;
};

});

parcelRequire.register("acdUc", function(module, exports) {
// fences (``` lang, ~~~ lang)
"use strict";
module.exports = function fence(state, startLine, endLine, silent) {
    var marker, len, params, nextLine, mem, token, markup, haveEndMarker = false, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) return false;
    if (pos + 3 > max) return false;
    marker = state.src.charCodeAt(pos);
    if (marker !== 0x7E /* ~ */  && marker !== 0x60 /* ` */ ) return false;
    // scan marker length
    mem = pos;
    pos = state.skipChars(pos, marker);
    len = pos - mem;
    if (len < 3) return false;
    markup = state.src.slice(mem, pos);
    params = state.src.slice(pos, max);
    if (marker === 0x60 /* ` */ ) {
        if (params.indexOf(String.fromCharCode(marker)) >= 0) return false;
    }
    // Since start is found, we can report success here in validation mode
    if (silent) return true;
    // search end of block
    nextLine = startLine;
    for(;;){
        nextLine++;
        if (nextLine >= endLine) break;
        pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        if (pos < max && state.sCount[nextLine] < state.blkIndent) break;
        if (state.src.charCodeAt(pos) !== marker) continue;
        if (state.sCount[nextLine] - state.blkIndent >= 4) continue;
        pos = state.skipChars(pos, marker);
        // closing code fence must be at least as long as the opening one
        if (pos - mem < len) continue;
        // make sure tail has spaces only
        pos = state.skipSpaces(pos);
        if (pos < max) continue;
        haveEndMarker = true;
        break;
    }
    // If a fence has heading spaces, they should be removed from its inner block
    len = state.sCount[startLine];
    state.line = nextLine + (haveEndMarker ? 1 : 0);
    token = state.push("fence", "code", 0);
    token.info = params;
    token.content = state.getLines(startLine + 1, nextLine, len, true);
    token.markup = markup;
    token.map = [
        startLine,
        state.line
    ];
    return true;
};

});

parcelRequire.register("8dsuv", function(module, exports) {
// Block quotes
"use strict";

var $4VIu7 = parcelRequire("4VIu7");
var $5fb5a35682a499d7$require$isSpace = $4VIu7.isSpace;
module.exports = function blockquote(state, startLine, endLine, silent) {
    var adjustTab, ch, i, initial, l, lastLineEmpty, lines, nextLine, offset, oldBMarks, oldBSCount, oldIndent, oldParentType, oldSCount, oldTShift, spaceAfterMarker, terminate, terminatorRules, token, isOutdented, oldLineMax = state.lineMax, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) return false;
    // check the block quote marker
    if (state.src.charCodeAt(pos++) !== 0x3E /* > */ ) return false;
    // we know that it's going to be a valid blockquote,
    // so no point trying to find the end of it in silent mode
    if (silent) return true;
    // set offset past spaces and ">"
    initial = offset = state.sCount[startLine] + 1;
    // skip one optional space after '>'
    if (state.src.charCodeAt(pos) === 0x20 /* space */ ) {
        // ' >   test '
        //     ^ -- position start of line here:
        pos++;
        initial++;
        offset++;
        adjustTab = false;
        spaceAfterMarker = true;
    } else if (state.src.charCodeAt(pos) === 0x09 /* tab */ ) {
        spaceAfterMarker = true;
        if ((state.bsCount[startLine] + offset) % 4 === 3) {
            // '  >\t  test '
            //       ^ -- position start of line here (tab has width===1)
            pos++;
            initial++;
            offset++;
            adjustTab = false;
        } else // ' >\t  test '
        //    ^ -- position start of line here + shift bsCount slightly
        //         to make extra space appear
        adjustTab = true;
    } else spaceAfterMarker = false;
    oldBMarks = [
        state.bMarks[startLine]
    ];
    state.bMarks[startLine] = pos;
    while(pos < max){
        ch = state.src.charCodeAt(pos);
        if ($5fb5a35682a499d7$require$isSpace(ch)) {
            if (ch === 0x09) offset += 4 - (offset + state.bsCount[startLine] + (adjustTab ? 1 : 0)) % 4;
            else offset++;
        } else break;
        pos++;
    }
    oldBSCount = [
        state.bsCount[startLine]
    ];
    state.bsCount[startLine] = state.sCount[startLine] + 1 + (spaceAfterMarker ? 1 : 0);
    lastLineEmpty = pos >= max;
    oldSCount = [
        state.sCount[startLine]
    ];
    state.sCount[startLine] = offset - initial;
    oldTShift = [
        state.tShift[startLine]
    ];
    state.tShift[startLine] = pos - state.bMarks[startLine];
    terminatorRules = state.md.block.ruler.getRules("blockquote");
    oldParentType = state.parentType;
    state.parentType = "blockquote";
    // Search the end of the block
    //
    // Block ends with either:
    //  1. an empty line outside:
    //     ```
    //     > test
    //
    //     ```
    //  2. an empty line inside:
    //     ```
    //     >
    //     test
    //     ```
    //  3. another tag:
    //     ```
    //     > test
    //      - - -
    //     ```
    for(nextLine = startLine + 1; nextLine < endLine; nextLine++){
        // check if it's outdented, i.e. it's inside list item and indented
        // less than said list item:
        //
        // ```
        // 1. anything
        //    > current blockquote
        // 2. checking this line
        // ```
        isOutdented = state.sCount[nextLine] < state.blkIndent;
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        if (pos >= max) break;
        if (state.src.charCodeAt(pos++) === 0x3E /* > */  && !isOutdented) {
            // This line is inside the blockquote.
            // set offset past spaces and ">"
            initial = offset = state.sCount[nextLine] + 1;
            // skip one optional space after '>'
            if (state.src.charCodeAt(pos) === 0x20 /* space */ ) {
                // ' >   test '
                //     ^ -- position start of line here:
                pos++;
                initial++;
                offset++;
                adjustTab = false;
                spaceAfterMarker = true;
            } else if (state.src.charCodeAt(pos) === 0x09 /* tab */ ) {
                spaceAfterMarker = true;
                if ((state.bsCount[nextLine] + offset) % 4 === 3) {
                    // '  >\t  test '
                    //       ^ -- position start of line here (tab has width===1)
                    pos++;
                    initial++;
                    offset++;
                    adjustTab = false;
                } else // ' >\t  test '
                //    ^ -- position start of line here + shift bsCount slightly
                //         to make extra space appear
                adjustTab = true;
            } else spaceAfterMarker = false;
            oldBMarks.push(state.bMarks[nextLine]);
            state.bMarks[nextLine] = pos;
            while(pos < max){
                ch = state.src.charCodeAt(pos);
                if ($5fb5a35682a499d7$require$isSpace(ch)) {
                    if (ch === 0x09) offset += 4 - (offset + state.bsCount[nextLine] + (adjustTab ? 1 : 0)) % 4;
                    else offset++;
                } else break;
                pos++;
            }
            lastLineEmpty = pos >= max;
            oldBSCount.push(state.bsCount[nextLine]);
            state.bsCount[nextLine] = state.sCount[nextLine] + 1 + (spaceAfterMarker ? 1 : 0);
            oldSCount.push(state.sCount[nextLine]);
            state.sCount[nextLine] = offset - initial;
            oldTShift.push(state.tShift[nextLine]);
            state.tShift[nextLine] = pos - state.bMarks[nextLine];
            continue;
        }
        // Case 2: line is not inside the blockquote, and the last line was empty.
        if (lastLineEmpty) break;
        // Case 3: another tag found.
        terminate = false;
        for(i = 0, l = terminatorRules.length; i < l; i++)if (terminatorRules[i](state, nextLine, endLine, true)) {
            terminate = true;
            break;
        }
        if (terminate) {
            // Quirk to enforce "hard termination mode" for paragraphs;
            // normally if you call `tokenize(state, startLine, nextLine)`,
            // paragraphs will look below nextLine for paragraph continuation,
            // but if blockquote is terminated by another tag, they shouldn't
            state.lineMax = nextLine;
            if (state.blkIndent !== 0) {
                // state.blkIndent was non-zero, we now set it to zero,
                // so we need to re-calculate all offsets to appear as
                // if indent wasn't changed
                oldBMarks.push(state.bMarks[nextLine]);
                oldBSCount.push(state.bsCount[nextLine]);
                oldTShift.push(state.tShift[nextLine]);
                oldSCount.push(state.sCount[nextLine]);
                state.sCount[nextLine] -= state.blkIndent;
            }
            break;
        }
        oldBMarks.push(state.bMarks[nextLine]);
        oldBSCount.push(state.bsCount[nextLine]);
        oldTShift.push(state.tShift[nextLine]);
        oldSCount.push(state.sCount[nextLine]);
        // A negative indentation means that this is a paragraph continuation
        //
        state.sCount[nextLine] = -1;
    }
    oldIndent = state.blkIndent;
    state.blkIndent = 0;
    token = state.push("blockquote_open", "blockquote", 1);
    token.markup = ">";
    token.map = lines = [
        startLine,
        0
    ];
    state.md.block.tokenize(state, startLine, nextLine);
    token = state.push("blockquote_close", "blockquote", -1);
    token.markup = ">";
    state.lineMax = oldLineMax;
    state.parentType = oldParentType;
    lines[1] = state.line;
    // Restore original tShift; this might not be necessary since the parser
    // has already been here, but just to make sure we can do that.
    for(i = 0; i < oldTShift.length; i++){
        state.bMarks[i + startLine] = oldBMarks[i];
        state.tShift[i + startLine] = oldTShift[i];
        state.sCount[i + startLine] = oldSCount[i];
        state.bsCount[i + startLine] = oldBSCount[i];
    }
    state.blkIndent = oldIndent;
    return true;
};

});

parcelRequire.register("9kumg", function(module, exports) {
// Horizontal rule
"use strict";

var $4VIu7 = parcelRequire("4VIu7");
var $6cad87c7a178d9fc$require$isSpace = $4VIu7.isSpace;
module.exports = function hr(state, startLine, endLine, silent) {
    var marker, cnt, ch, token, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) return false;
    marker = state.src.charCodeAt(pos++);
    // Check hr marker
    if (marker !== 0x2A /* * */  && marker !== 0x2D /* - */  && marker !== 0x5F /* _ */ ) return false;
    // markers can be mixed with spaces, but there should be at least 3 of them
    cnt = 1;
    while(pos < max){
        ch = state.src.charCodeAt(pos++);
        if (ch !== marker && !$6cad87c7a178d9fc$require$isSpace(ch)) return false;
        if (ch === marker) cnt++;
    }
    if (cnt < 3) return false;
    if (silent) return true;
    state.line = startLine + 1;
    token = state.push("hr", "hr", 0);
    token.map = [
        startLine,
        state.line
    ];
    token.markup = Array(cnt + 1).join(String.fromCharCode(marker));
    return true;
};

});

parcelRequire.register("aTfdQ", function(module, exports) {
// Lists
"use strict";

var $4VIu7 = parcelRequire("4VIu7");
var $7edad942d59ac99c$require$isSpace = $4VIu7.isSpace;
// Search `[-+*][\n ]`, returns next pos after marker on success
// or -1 on fail.
function $7edad942d59ac99c$var$skipBulletListMarker(state, startLine) {
    var marker, pos, max, ch;
    pos = state.bMarks[startLine] + state.tShift[startLine];
    max = state.eMarks[startLine];
    marker = state.src.charCodeAt(pos++);
    // Check bullet
    if (marker !== 0x2A /* * */  && marker !== 0x2D /* - */  && marker !== 0x2B /* + */ ) return -1;
    if (pos < max) {
        ch = state.src.charCodeAt(pos);
        if (!$7edad942d59ac99c$require$isSpace(ch)) // " -test " - is not a list item
        return -1;
    }
    return pos;
}
// Search `\d+[.)][\n ]`, returns next pos after marker on success
// or -1 on fail.
function $7edad942d59ac99c$var$skipOrderedListMarker(state, startLine) {
    var ch, start = state.bMarks[startLine] + state.tShift[startLine], pos = start, max = state.eMarks[startLine];
    // List marker should have at least 2 chars (digit + dot)
    if (pos + 1 >= max) return -1;
    ch = state.src.charCodeAt(pos++);
    if (ch < 0x30 /* 0 */  || ch > 0x39 /* 9 */ ) return -1;
    for(;;){
        // EOL -> fail
        if (pos >= max) return -1;
        ch = state.src.charCodeAt(pos++);
        if (ch >= 0x30 /* 0 */  && ch <= 0x39 /* 9 */ ) {
            // List marker should have no more than 9 digits
            // (prevents integer overflow in browsers)
            if (pos - start >= 10) return -1;
            continue;
        }
        // found valid marker
        if (ch === 0x29 /* ) */  || ch === 0x2e /* . */ ) break;
        return -1;
    }
    if (pos < max) {
        ch = state.src.charCodeAt(pos);
        if (!$7edad942d59ac99c$require$isSpace(ch)) // " 1.test " - is not a list item
        return -1;
    }
    return pos;
}
function $7edad942d59ac99c$var$markTightParagraphs(state, idx) {
    var i, l, level = state.level + 2;
    for(i = idx + 2, l = state.tokens.length - 2; i < l; i++)if (state.tokens[i].level === level && state.tokens[i].type === "paragraph_open") {
        state.tokens[i + 2].hidden = true;
        state.tokens[i].hidden = true;
        i += 2;
    }
}
module.exports = function list(state, startLine, endLine, silent) {
    var ch, contentStart, i, indent, indentAfterMarker, initial, isOrdered, itemLines, l, listLines, listTokIdx, markerCharCode, markerValue, max, nextLine, offset, oldListIndent, oldParentType, oldSCount, oldTShift, oldTight, pos, posAfterMarker, prevEmptyEnd, start, terminate, terminatorRules, token, isTerminatingParagraph = false, tight = true;
    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) return false;
    // Special case:
    //  - item 1
    //   - item 2
    //    - item 3
    //     - item 4
    //      - this one is a paragraph continuation
    if (state.listIndent >= 0 && state.sCount[startLine] - state.listIndent >= 4 && state.sCount[startLine] < state.blkIndent) return false;
    // limit conditions when list can interrupt
    // a paragraph (validation mode only)
    if (silent && state.parentType === "paragraph") // Next list item should still terminate previous list item;
    //
    // This code can fail if plugins use blkIndent as well as lists,
    // but I hope the spec gets fixed long before that happens.
    //
    {
        if (state.sCount[startLine] >= state.blkIndent) isTerminatingParagraph = true;
    }
    // Detect list type and position after marker
    if ((posAfterMarker = $7edad942d59ac99c$var$skipOrderedListMarker(state, startLine)) >= 0) {
        isOrdered = true;
        start = state.bMarks[startLine] + state.tShift[startLine];
        markerValue = Number(state.src.slice(start, posAfterMarker - 1));
        // If we're starting a new ordered list right after
        // a paragraph, it should start with 1.
        if (isTerminatingParagraph && markerValue !== 1) return false;
    } else if ((posAfterMarker = $7edad942d59ac99c$var$skipBulletListMarker(state, startLine)) >= 0) isOrdered = false;
    else return false;
    // If we're starting a new unordered list right after
    // a paragraph, first line should not be empty.
    if (isTerminatingParagraph) {
        if (state.skipSpaces(posAfterMarker) >= state.eMarks[startLine]) return false;
    }
    // We should terminate list on style change. Remember first one to compare.
    markerCharCode = state.src.charCodeAt(posAfterMarker - 1);
    // For validation mode we can terminate immediately
    if (silent) return true;
    // Start list
    listTokIdx = state.tokens.length;
    if (isOrdered) {
        token = state.push("ordered_list_open", "ol", 1);
        if (markerValue !== 1) token.attrs = [
            [
                "start",
                markerValue
            ]
        ];
    } else token = state.push("bullet_list_open", "ul", 1);
    token.map = listLines = [
        startLine,
        0
    ];
    token.markup = String.fromCharCode(markerCharCode);
    //
    // Iterate list items
    //
    nextLine = startLine;
    prevEmptyEnd = false;
    terminatorRules = state.md.block.ruler.getRules("list");
    oldParentType = state.parentType;
    state.parentType = "list";
    while(nextLine < endLine){
        pos = posAfterMarker;
        max = state.eMarks[nextLine];
        initial = offset = state.sCount[nextLine] + posAfterMarker - (state.bMarks[startLine] + state.tShift[startLine]);
        while(pos < max){
            ch = state.src.charCodeAt(pos);
            if (ch === 0x09) offset += 4 - (offset + state.bsCount[nextLine]) % 4;
            else if (ch === 0x20) offset++;
            else break;
            pos++;
        }
        contentStart = pos;
        if (contentStart >= max) // trimming space in "-    \n  3" case, indent is 1 here
        indentAfterMarker = 1;
        else indentAfterMarker = offset - initial;
        // If we have more than 4 spaces, the indent is 1
        // (the rest is just indented code block)
        if (indentAfterMarker > 4) indentAfterMarker = 1;
        // "  -  test"
        //  ^^^^^ - calculating total length of this thing
        indent = initial + indentAfterMarker;
        // Run subparser & write tokens
        token = state.push("list_item_open", "li", 1);
        token.markup = String.fromCharCode(markerCharCode);
        token.map = itemLines = [
            startLine,
            0
        ];
        if (isOrdered) token.info = state.src.slice(start, posAfterMarker - 1);
        // change current state, then restore it after parser subcall
        oldTight = state.tight;
        oldTShift = state.tShift[startLine];
        oldSCount = state.sCount[startLine];
        //  - example list
        // ^ listIndent position will be here
        //   ^ blkIndent position will be here
        //
        oldListIndent = state.listIndent;
        state.listIndent = state.blkIndent;
        state.blkIndent = indent;
        state.tight = true;
        state.tShift[startLine] = contentStart - state.bMarks[startLine];
        state.sCount[startLine] = offset;
        if (contentStart >= max && state.isEmpty(startLine + 1)) // workaround for this case
        // (list item is empty, list terminates before "foo"):
        // ~~~~~~~~
        //   -
        //
        //     foo
        // ~~~~~~~~
        state.line = Math.min(state.line + 2, endLine);
        else state.md.block.tokenize(state, startLine, endLine, true);
        // If any of list item is tight, mark list as tight
        if (!state.tight || prevEmptyEnd) tight = false;
        // Item become loose if finish with empty line,
        // but we should filter last element, because it means list finish
        prevEmptyEnd = state.line - startLine > 1 && state.isEmpty(state.line - 1);
        state.blkIndent = state.listIndent;
        state.listIndent = oldListIndent;
        state.tShift[startLine] = oldTShift;
        state.sCount[startLine] = oldSCount;
        state.tight = oldTight;
        token = state.push("list_item_close", "li", -1);
        token.markup = String.fromCharCode(markerCharCode);
        nextLine = startLine = state.line;
        itemLines[1] = nextLine;
        contentStart = state.bMarks[startLine];
        if (nextLine >= endLine) break;
        //
        // Try to check if list is terminated or continued.
        //
        if (state.sCount[nextLine] < state.blkIndent) break;
        // if it's indented more than 3 spaces, it should be a code block
        if (state.sCount[startLine] - state.blkIndent >= 4) break;
        // fail if terminating block found
        terminate = false;
        for(i = 0, l = terminatorRules.length; i < l; i++)if (terminatorRules[i](state, nextLine, endLine, true)) {
            terminate = true;
            break;
        }
        if (terminate) break;
        // fail if list has another type
        if (isOrdered) {
            posAfterMarker = $7edad942d59ac99c$var$skipOrderedListMarker(state, nextLine);
            if (posAfterMarker < 0) break;
            start = state.bMarks[nextLine] + state.tShift[nextLine];
        } else {
            posAfterMarker = $7edad942d59ac99c$var$skipBulletListMarker(state, nextLine);
            if (posAfterMarker < 0) break;
        }
        if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) break;
    }
    // Finalize list
    if (isOrdered) token = state.push("ordered_list_close", "ol", -1);
    else token = state.push("bullet_list_close", "ul", -1);
    token.markup = String.fromCharCode(markerCharCode);
    listLines[1] = nextLine;
    state.line = nextLine;
    state.parentType = oldParentType;
    // mark paragraphs tight if needed
    if (tight) $7edad942d59ac99c$var$markTightParagraphs(state, listTokIdx);
    return true;
};

});

parcelRequire.register("gHkWc", function(module, exports) {
"use strict";

var $4VIu7 = parcelRequire("4VIu7");
var $c280e74690e1acc7$require$normalizeReference = $4VIu7.normalizeReference;

var $4VIu7 = parcelRequire("4VIu7");
var $c280e74690e1acc7$require$isSpace = $4VIu7.isSpace;
module.exports = function reference(state, startLine, _endLine, silent) {
    var ch, destEndPos, destEndLineNo, endLine, href, i, l, label, labelEnd, oldParentType, res, start, str, terminate, terminatorRules, title, lines = 0, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine], nextLine = startLine + 1;
    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) return false;
    if (state.src.charCodeAt(pos) !== 0x5B /* [ */ ) return false;
    // Simple check to quickly interrupt scan on [link](url) at the start of line.
    // Can be useful on practice: https://github.com/markdown-it/markdown-it/issues/54
    while(++pos < max)if (state.src.charCodeAt(pos) === 0x5D /* ] */  && state.src.charCodeAt(pos - 1) !== 0x5C /* \ */ ) {
        if (pos + 1 === max) return false;
        if (state.src.charCodeAt(pos + 1) !== 0x3A /* : */ ) return false;
        break;
    }
    endLine = state.lineMax;
    // jump line-by-line until empty one or EOF
    terminatorRules = state.md.block.ruler.getRules("reference");
    oldParentType = state.parentType;
    state.parentType = "reference";
    for(; nextLine < endLine && !state.isEmpty(nextLine); nextLine++){
        // this would be a code block normally, but after paragraph
        // it's considered a lazy continuation regardless of what's there
        if (state.sCount[nextLine] - state.blkIndent > 3) continue;
        // quirk for blockquotes, this line should already be checked by that rule
        if (state.sCount[nextLine] < 0) continue;
        // Some tags can terminate paragraph without empty line.
        terminate = false;
        for(i = 0, l = terminatorRules.length; i < l; i++)if (terminatorRules[i](state, nextLine, endLine, true)) {
            terminate = true;
            break;
        }
        if (terminate) break;
    }
    str = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
    max = str.length;
    for(pos = 1; pos < max; pos++){
        ch = str.charCodeAt(pos);
        if (ch === 0x5B /* [ */ ) return false;
        else if (ch === 0x5D /* ] */ ) {
            labelEnd = pos;
            break;
        } else if (ch === 0x0A /* \n */ ) lines++;
        else if (ch === 0x5C /* \ */ ) {
            pos++;
            if (pos < max && str.charCodeAt(pos) === 0x0A) lines++;
        }
    }
    if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 0x3A /* : */ ) return false;
    // [label]:   destination   'title'
    //         ^^^ skip optional whitespace here
    for(pos = labelEnd + 2; pos < max; pos++){
        ch = str.charCodeAt(pos);
        if (ch === 0x0A) lines++;
        else if ($c280e74690e1acc7$require$isSpace(ch)) ;
        else break;
    }
    // [label]:   destination   'title'
    //            ^^^^^^^^^^^ parse this
    res = state.md.helpers.parseLinkDestination(str, pos, max);
    if (!res.ok) return false;
    href = state.md.normalizeLink(res.str);
    if (!state.md.validateLink(href)) return false;
    pos = res.pos;
    lines += res.lines;
    // save cursor state, we could require to rollback later
    destEndPos = pos;
    destEndLineNo = lines;
    // [label]:   destination   'title'
    //                       ^^^ skipping those spaces
    start = pos;
    for(; pos < max; pos++){
        ch = str.charCodeAt(pos);
        if (ch === 0x0A) lines++;
        else if ($c280e74690e1acc7$require$isSpace(ch)) ;
        else break;
    }
    // [label]:   destination   'title'
    //                          ^^^^^^^ parse this
    res = state.md.helpers.parseLinkTitle(str, pos, max);
    if (pos < max && start !== pos && res.ok) {
        title = res.str;
        pos = res.pos;
        lines += res.lines;
    } else {
        title = "";
        pos = destEndPos;
        lines = destEndLineNo;
    }
    // skip trailing spaces until the rest of the line
    while(pos < max){
        ch = str.charCodeAt(pos);
        if (!$c280e74690e1acc7$require$isSpace(ch)) break;
        pos++;
    }
    if (pos < max && str.charCodeAt(pos) !== 0x0A) {
        if (title) {
            // garbage at the end of the line after title,
            // but it could still be a valid reference if we roll back
            title = "";
            pos = destEndPos;
            lines = destEndLineNo;
            while(pos < max){
                ch = str.charCodeAt(pos);
                if (!$c280e74690e1acc7$require$isSpace(ch)) break;
                pos++;
            }
        }
    }
    if (pos < max && str.charCodeAt(pos) !== 0x0A) // garbage at the end of the line
    return false;
    label = $c280e74690e1acc7$require$normalizeReference(str.slice(1, labelEnd));
    if (!label) // CommonMark 0.20 disallows empty labels
    return false;
    // Reference can not terminate anything. This check is for safety only.
    /*istanbul ignore if*/ if (silent) return true;
    if (typeof state.env.references === "undefined") state.env.references = {};
    if (typeof state.env.references[label] === "undefined") state.env.references[label] = {
        title: title,
        href: href
    };
    state.parentType = oldParentType;
    state.line = startLine + lines + 1;
    return true;
};

});

parcelRequire.register("7LCWC", function(module, exports) {
// HTML block
"use strict";

var $8rdtK = parcelRequire("8rdtK");

var $2yIl8 = parcelRequire("2yIl8");
var $5a7b21c0587259c8$require$HTML_OPEN_CLOSE_TAG_RE = $2yIl8.HTML_OPEN_CLOSE_TAG_RE;
// An array of opening and corresponding closing sequences for html tags,
// last argument defines whether it can terminate a paragraph or not
//
var $5a7b21c0587259c8$var$HTML_SEQUENCES = [
    [
        /^<(script|pre|style|textarea)(?=(\s|>|$))/i,
        /<\/(script|pre|style|textarea)>/i,
        true
    ],
    [
        /^<!--/,
        /-->/,
        true
    ],
    [
        /^<\?/,
        /\?>/,
        true
    ],
    [
        /^<![A-Z]/,
        />/,
        true
    ],
    [
        /^<!\[CDATA\[/,
        /\]\]>/,
        true
    ],
    [
        new RegExp("^</?(" + $8rdtK.join("|") + ")(?=(\\s|/?>|$))", "i"),
        /^$/,
        true
    ],
    [
        new RegExp($5a7b21c0587259c8$require$HTML_OPEN_CLOSE_TAG_RE.source + "\\s*$"),
        /^$/,
        false
    ]
];
module.exports = function html_block(state, startLine, endLine, silent) {
    var i, nextLine, token, lineText, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) return false;
    if (!state.md.options.html) return false;
    if (state.src.charCodeAt(pos) !== 0x3C /* < */ ) return false;
    lineText = state.src.slice(pos, max);
    for(i = 0; i < $5a7b21c0587259c8$var$HTML_SEQUENCES.length; i++){
        if ($5a7b21c0587259c8$var$HTML_SEQUENCES[i][0].test(lineText)) break;
    }
    if (i === $5a7b21c0587259c8$var$HTML_SEQUENCES.length) return false;
    if (silent) // true if this sequence can be a terminator, false otherwise
    return $5a7b21c0587259c8$var$HTML_SEQUENCES[i][2];
    nextLine = startLine + 1;
    // If we are here - we detected HTML block.
    // Let's roll down till block end.
    if (!$5a7b21c0587259c8$var$HTML_SEQUENCES[i][1].test(lineText)) for(; nextLine < endLine; nextLine++){
        if (state.sCount[nextLine] < state.blkIndent) break;
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        lineText = state.src.slice(pos, max);
        if ($5a7b21c0587259c8$var$HTML_SEQUENCES[i][1].test(lineText)) {
            if (lineText.length !== 0) nextLine++;
            break;
        }
    }
    state.line = nextLine;
    token = state.push("html_block", "", 0);
    token.map = [
        startLine,
        nextLine
    ];
    token.content = state.getLines(startLine, nextLine, state.blkIndent, true);
    return true;
};

});
parcelRequire.register("8rdtK", function(module, exports) {
// List of valid html blocks names, accorting to commonmark spec
// http://jgm.github.io/CommonMark/spec.html#html-blocks
"use strict";
module.exports = [
    "address",
    "article",
    "aside",
    "base",
    "basefont",
    "blockquote",
    "body",
    "caption",
    "center",
    "col",
    "colgroup",
    "dd",
    "details",
    "dialog",
    "dir",
    "div",
    "dl",
    "dt",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "frame",
    "frameset",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hr",
    "html",
    "iframe",
    "legend",
    "li",
    "link",
    "main",
    "menu",
    "menuitem",
    "nav",
    "noframes",
    "ol",
    "optgroup",
    "option",
    "p",
    "param",
    "section",
    "source",
    "summary",
    "table",
    "tbody",
    "td",
    "tfoot",
    "th",
    "thead",
    "title",
    "tr",
    "track",
    "ul"
];

});

parcelRequire.register("2yIl8", function(module, exports) {

$parcel$export(module.exports, "HTML_TAG_RE", () => $1dd126bb182f5116$export$6db61d2c3a16e419, (v) => $1dd126bb182f5116$export$6db61d2c3a16e419 = v);
$parcel$export(module.exports, "HTML_OPEN_CLOSE_TAG_RE", () => $1dd126bb182f5116$export$cd48660d06f74639, (v) => $1dd126bb182f5116$export$cd48660d06f74639 = v);
// Regexps to match html elements
var $1dd126bb182f5116$export$6db61d2c3a16e419;
var $1dd126bb182f5116$export$cd48660d06f74639;
"use strict";
var $1dd126bb182f5116$var$attr_name = "[a-zA-Z_:][a-zA-Z0-9:._-]*";
var $1dd126bb182f5116$var$unquoted = "[^\"'=<>`\\x00-\\x20]+";
var $1dd126bb182f5116$var$single_quoted = "'[^']*'";
var $1dd126bb182f5116$var$double_quoted = '"[^"]*"';
var $1dd126bb182f5116$var$attr_value = "(?:" + $1dd126bb182f5116$var$unquoted + "|" + $1dd126bb182f5116$var$single_quoted + "|" + $1dd126bb182f5116$var$double_quoted + ")";
var $1dd126bb182f5116$var$attribute = "(?:\\s+" + $1dd126bb182f5116$var$attr_name + "(?:\\s*=\\s*" + $1dd126bb182f5116$var$attr_value + ")?)";
var $1dd126bb182f5116$var$open_tag = "<[A-Za-z][A-Za-z0-9\\-]*" + $1dd126bb182f5116$var$attribute + "*\\s*\\/?>";
var $1dd126bb182f5116$var$close_tag = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>";
var $1dd126bb182f5116$var$comment = "<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->";
var $1dd126bb182f5116$var$processing = "<[?][\\s\\S]*?[?]>";
var $1dd126bb182f5116$var$declaration = "<![A-Z]+\\s+[^>]*>";
var $1dd126bb182f5116$var$cdata = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>";
var $1dd126bb182f5116$var$HTML_TAG_RE = new RegExp("^(?:" + $1dd126bb182f5116$var$open_tag + "|" + $1dd126bb182f5116$var$close_tag + "|" + $1dd126bb182f5116$var$comment + "|" + $1dd126bb182f5116$var$processing + "|" + $1dd126bb182f5116$var$declaration + "|" + $1dd126bb182f5116$var$cdata + ")");
var $1dd126bb182f5116$var$HTML_OPEN_CLOSE_TAG_RE = new RegExp("^(?:" + $1dd126bb182f5116$var$open_tag + "|" + $1dd126bb182f5116$var$close_tag + ")");
$1dd126bb182f5116$export$6db61d2c3a16e419 = $1dd126bb182f5116$var$HTML_TAG_RE;
$1dd126bb182f5116$export$cd48660d06f74639 = $1dd126bb182f5116$var$HTML_OPEN_CLOSE_TAG_RE;

});


parcelRequire.register("eyPCd", function(module, exports) {
// heading (#, ##, ...)
"use strict";

var $4VIu7 = parcelRequire("4VIu7");
var $a99c4768472b40ed$require$isSpace = $4VIu7.isSpace;
module.exports = function heading(state, startLine, endLine, silent) {
    var ch, level, tmp, token, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) return false;
    ch = state.src.charCodeAt(pos);
    if (ch !== 0x23 /* # */  || pos >= max) return false;
    // count heading level
    level = 1;
    ch = state.src.charCodeAt(++pos);
    while(ch === 0x23 /* # */  && pos < max && level <= 6){
        level++;
        ch = state.src.charCodeAt(++pos);
    }
    if (level > 6 || pos < max && !$a99c4768472b40ed$require$isSpace(ch)) return false;
    if (silent) return true;
    // Let's cut tails like '    ###  ' from the end of string
    max = state.skipSpacesBack(max, pos);
    tmp = state.skipCharsBack(max, 0x23, pos); // #
    if (tmp > pos && $a99c4768472b40ed$require$isSpace(state.src.charCodeAt(tmp - 1))) max = tmp;
    state.line = startLine + 1;
    token = state.push("heading_open", "h" + String(level), 1);
    token.markup = "########".slice(0, level);
    token.map = [
        startLine,
        state.line
    ];
    token = state.push("inline", "", 0);
    token.content = state.src.slice(pos, max).trim();
    token.map = [
        startLine,
        state.line
    ];
    token.children = [];
    token = state.push("heading_close", "h" + String(level), -1);
    token.markup = "########".slice(0, level);
    return true;
};

});

parcelRequire.register("eaXto", function(module, exports) {
// lheading (---, ===)
"use strict";
module.exports = function lheading(state, startLine, endLine /*, silent*/ ) {
    var content, terminate, i, l, token, pos, max, level, marker, nextLine = startLine + 1, oldParentType, terminatorRules = state.md.block.ruler.getRules("paragraph");
    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) return false;
    oldParentType = state.parentType;
    state.parentType = "paragraph"; // use paragraph to match terminatorRules
    // jump line-by-line until empty one or EOF
    for(; nextLine < endLine && !state.isEmpty(nextLine); nextLine++){
        // this would be a code block normally, but after paragraph
        // it's considered a lazy continuation regardless of what's there
        if (state.sCount[nextLine] - state.blkIndent > 3) continue;
        //
        // Check for underline in setext header
        //
        if (state.sCount[nextLine] >= state.blkIndent) {
            pos = state.bMarks[nextLine] + state.tShift[nextLine];
            max = state.eMarks[nextLine];
            if (pos < max) {
                marker = state.src.charCodeAt(pos);
                if (marker === 0x2D /* - */  || marker === 0x3D /* = */ ) {
                    pos = state.skipChars(pos, marker);
                    pos = state.skipSpaces(pos);
                    if (pos >= max) {
                        level = marker === 0x3D /* = */  ? 1 : 2;
                        break;
                    }
                }
            }
        }
        // quirk for blockquotes, this line should already be checked by that rule
        if (state.sCount[nextLine] < 0) continue;
        // Some tags can terminate paragraph without empty line.
        terminate = false;
        for(i = 0, l = terminatorRules.length; i < l; i++)if (terminatorRules[i](state, nextLine, endLine, true)) {
            terminate = true;
            break;
        }
        if (terminate) break;
    }
    if (!level) // Didn't find valid underline
    return false;
    content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
    state.line = nextLine + 1;
    token = state.push("heading_open", "h" + String(level), 1);
    token.markup = String.fromCharCode(marker);
    token.map = [
        startLine,
        state.line
    ];
    token = state.push("inline", "", 0);
    token.content = content;
    token.map = [
        startLine,
        state.line - 1
    ];
    token.children = [];
    token = state.push("heading_close", "h" + String(level), -1);
    token.markup = String.fromCharCode(marker);
    state.parentType = oldParentType;
    return true;
};

});

parcelRequire.register("hKUEH", function(module, exports) {
// Paragraph
"use strict";
module.exports = function paragraph(state, startLine /*, endLine*/ ) {
    var content, terminate, i, l, token, oldParentType, nextLine = startLine + 1, terminatorRules = state.md.block.ruler.getRules("paragraph"), endLine = state.lineMax;
    oldParentType = state.parentType;
    state.parentType = "paragraph";
    // jump line-by-line until empty one or EOF
    for(; nextLine < endLine && !state.isEmpty(nextLine); nextLine++){
        // this would be a code block normally, but after paragraph
        // it's considered a lazy continuation regardless of what's there
        if (state.sCount[nextLine] - state.blkIndent > 3) continue;
        // quirk for blockquotes, this line should already be checked by that rule
        if (state.sCount[nextLine] < 0) continue;
        // Some tags can terminate paragraph without empty line.
        terminate = false;
        for(i = 0, l = terminatorRules.length; i < l; i++)if (terminatorRules[i](state, nextLine, endLine, true)) {
            terminate = true;
            break;
        }
        if (terminate) break;
    }
    content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
    state.line = nextLine;
    token = state.push("paragraph_open", "p", 1);
    token.map = [
        startLine,
        state.line
    ];
    token = state.push("inline", "", 0);
    token.content = content;
    token.map = [
        startLine,
        state.line
    ];
    token.children = [];
    token = state.push("paragraph_close", "p", -1);
    state.parentType = oldParentType;
    return true;
};

});

parcelRequire.register("bLbh7", function(module, exports) {
// Parser state class
"use strict";

var $em0se = parcelRequire("em0se");

var $4VIu7 = parcelRequire("4VIu7");
var $88fcd485b3540e88$require$isSpace = $4VIu7.isSpace;
function $88fcd485b3540e88$var$StateBlock(src, md, env, tokens) {
    var ch, s, start, pos, len, indent, offset, indent_found;
    this.src = src;
    // link to parser instance
    this.md = md;
    this.env = env;
    //
    // Internal state vartiables
    //
    this.tokens = tokens;
    this.bMarks = []; // line begin offsets for fast jumps
    this.eMarks = []; // line end offsets for fast jumps
    this.tShift = []; // offsets of the first non-space characters (tabs not expanded)
    this.sCount = []; // indents for each line (tabs expanded)
    // An amount of virtual spaces (tabs expanded) between beginning
    // of each line (bMarks) and real beginning of that line.
    //
    // It exists only as a hack because blockquotes override bMarks
    // losing information in the process.
    //
    // It's used only when expanding tabs, you can think about it as
    // an initial tab length, e.g. bsCount=21 applied to string `\t123`
    // means first tab should be expanded to 4-21%4 === 3 spaces.
    //
    this.bsCount = [];
    // block parser variables
    this.blkIndent = 0; // required block content indent (for example, if we are
    // inside a list, it would be positioned after list marker)
    this.line = 0; // line index in src
    this.lineMax = 0; // lines count
    this.tight = false; // loose/tight mode for lists
    this.ddIndent = -1; // indent of the current dd block (-1 if there isn't any)
    this.listIndent = -1; // indent of the current list block (-1 if there isn't any)
    // can be 'blockquote', 'list', 'root', 'paragraph' or 'reference'
    // used in lists to determine if they interrupt a paragraph
    this.parentType = "root";
    this.level = 0;
    // renderer
    this.result = "";
    // Create caches
    // Generate markers.
    s = this.src;
    indent_found = false;
    for(start = pos = indent = offset = 0, len = s.length; pos < len; pos++){
        ch = s.charCodeAt(pos);
        if (!indent_found) {
            if ($88fcd485b3540e88$require$isSpace(ch)) {
                indent++;
                if (ch === 0x09) offset += 4 - offset % 4;
                else offset++;
                continue;
            } else indent_found = true;
        }
        if (ch === 0x0A || pos === len - 1) {
            if (ch !== 0x0A) pos++;
            this.bMarks.push(start);
            this.eMarks.push(pos);
            this.tShift.push(indent);
            this.sCount.push(offset);
            this.bsCount.push(0);
            indent_found = false;
            indent = 0;
            offset = 0;
            start = pos + 1;
        }
    }
    // Push fake entry to simplify cache bounds checks
    this.bMarks.push(s.length);
    this.eMarks.push(s.length);
    this.tShift.push(0);
    this.sCount.push(0);
    this.bsCount.push(0);
    this.lineMax = this.bMarks.length - 1; // don't count last fake line
}
// Push new token to "stream".
//
$88fcd485b3540e88$var$StateBlock.prototype.push = function(type, tag, nesting) {
    var token = new $em0se(type, tag, nesting);
    token.block = true;
    if (nesting < 0) this.level--; // closing tag
    token.level = this.level;
    if (nesting > 0) this.level++; // opening tag
    this.tokens.push(token);
    return token;
};
$88fcd485b3540e88$var$StateBlock.prototype.isEmpty = function isEmpty(line) {
    return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
};
$88fcd485b3540e88$var$StateBlock.prototype.skipEmptyLines = function skipEmptyLines(from) {
    for(var max = this.lineMax; from < max; from++){
        if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) break;
    }
    return from;
};
// Skip spaces from given position.
$88fcd485b3540e88$var$StateBlock.prototype.skipSpaces = function skipSpaces(pos) {
    var ch;
    for(var max = this.src.length; pos < max; pos++){
        ch = this.src.charCodeAt(pos);
        if (!$88fcd485b3540e88$require$isSpace(ch)) break;
    }
    return pos;
};
// Skip spaces from given position in reverse.
$88fcd485b3540e88$var$StateBlock.prototype.skipSpacesBack = function skipSpacesBack(pos, min) {
    if (pos <= min) return pos;
    while(pos > min){
        if (!$88fcd485b3540e88$require$isSpace(this.src.charCodeAt(--pos))) return pos + 1;
    }
    return pos;
};
// Skip char codes from given position
$88fcd485b3540e88$var$StateBlock.prototype.skipChars = function skipChars(pos, code) {
    for(var max = this.src.length; pos < max; pos++){
        if (this.src.charCodeAt(pos) !== code) break;
    }
    return pos;
};
// Skip char codes reverse from given position - 1
$88fcd485b3540e88$var$StateBlock.prototype.skipCharsBack = function skipCharsBack(pos, code, min) {
    if (pos <= min) return pos;
    while(pos > min){
        if (code !== this.src.charCodeAt(--pos)) return pos + 1;
    }
    return pos;
};
// cut lines range from source.
$88fcd485b3540e88$var$StateBlock.prototype.getLines = function getLines(begin, end, indent, keepLastLF) {
    var i, lineIndent, ch, first, last, queue, lineStart, line = begin;
    if (begin >= end) return "";
    queue = new Array(end - begin);
    for(i = 0; line < end; line++, i++){
        lineIndent = 0;
        lineStart = first = this.bMarks[line];
        if (line + 1 < end || keepLastLF) // No need for bounds check because we have fake entry on tail.
        last = this.eMarks[line] + 1;
        else last = this.eMarks[line];
        while(first < last && lineIndent < indent){
            ch = this.src.charCodeAt(first);
            if ($88fcd485b3540e88$require$isSpace(ch)) {
                if (ch === 0x09) lineIndent += 4 - (lineIndent + this.bsCount[line]) % 4;
                else lineIndent++;
            } else if (first - lineStart < this.tShift[line]) // patched tShift masked characters to look like spaces (blockquotes, list markers)
            lineIndent++;
            else break;
            first++;
        }
        if (lineIndent > indent) // partially expanding tabs in code blocks, e.g '\t\tfoobar'
        // with indent=2 becomes '  \tfoobar'
        queue[i] = new Array(lineIndent - indent + 1).join(" ") + this.src.slice(first, last);
        else queue[i] = this.src.slice(first, last);
    }
    return queue.join("");
};
// re-export Token class to use in block rules
$88fcd485b3540e88$var$StateBlock.prototype.Token = $em0se;
module.exports = $88fcd485b3540e88$var$StateBlock;

});


parcelRequire.register("iu9bw", function(module, exports) {
/** internal
 * class ParserInline
 *
 * Tokenizes paragraph content.
 **/ "use strict";

var $6HV6l = parcelRequire("6HV6l");












////////////////////////////////////////////////////////////////////////////////
// Parser rules
var $d752273b674a817f$var$_rules = [
    [
        "text",
        (parcelRequire("h3jHU"))
    ],
    [
        "linkify",
        (parcelRequire("3DaXe"))
    ],
    [
        "newline",
        (parcelRequire("lwpU7"))
    ],
    [
        "escape",
        (parcelRequire("dsWjR"))
    ],
    [
        "backticks",
        (parcelRequire("eAWF9"))
    ],
    [
        "strikethrough",
        (parcelRequire("caRwR")).tokenize
    ],
    [
        "emphasis",
        (parcelRequire("hCAO8")).tokenize
    ],
    [
        "link",
        (parcelRequire("lsXNX"))
    ],
    [
        "image",
        (parcelRequire("cvWkG"))
    ],
    [
        "autolink",
        (parcelRequire("kJnIX"))
    ],
    [
        "html_inline",
        (parcelRequire("6RNs8"))
    ],
    [
        "entity",
        (parcelRequire("7TNoo"))
    ]
];




// `rule2` ruleset was created specifically for emphasis/strikethrough
// post-processing and may be changed in the future.
//
// Don't use this for anything except pairs (plugins working with `balance_pairs`).
//
var $d752273b674a817f$var$_rules2 = [
    [
        "balance_pairs",
        (parcelRequire("jQmAK"))
    ],
    [
        "strikethrough",
        (parcelRequire("caRwR")).postProcess
    ],
    [
        "emphasis",
        (parcelRequire("hCAO8")).postProcess
    ],
    // rules for pairs separate '**' into its own text tokens, which may be left unused,
    // rule below merges unused segments back with the rest of the text
    [
        "fragments_join",
        (parcelRequire("4dP8G"))
    ]
];
/**
 * new ParserInline()
 **/ function $d752273b674a817f$var$ParserInline() {
    var i;
    /**
   * ParserInline#ruler -> Ruler
   *
   * [[Ruler]] instance. Keep configuration of inline rules.
   **/ this.ruler = new $6HV6l();
    for(i = 0; i < $d752273b674a817f$var$_rules.length; i++)this.ruler.push($d752273b674a817f$var$_rules[i][0], $d752273b674a817f$var$_rules[i][1]);
    /**
   * ParserInline#ruler2 -> Ruler
   *
   * [[Ruler]] instance. Second ruler used for post-processing
   * (e.g. in emphasis-like rules).
   **/ this.ruler2 = new $6HV6l();
    for(i = 0; i < $d752273b674a817f$var$_rules2.length; i++)this.ruler2.push($d752273b674a817f$var$_rules2[i][0], $d752273b674a817f$var$_rules2[i][1]);
}
// Skip single token by running all rules in validation mode;
// returns `true` if any rule reported success
//
$d752273b674a817f$var$ParserInline.prototype.skipToken = function(state) {
    var ok, i, pos = state.pos, rules = this.ruler.getRules(""), len = rules.length, maxNesting = state.md.options.maxNesting, cache = state.cache;
    if (typeof cache[pos] !== "undefined") {
        state.pos = cache[pos];
        return;
    }
    if (state.level < maxNesting) for(i = 0; i < len; i++){
        // Increment state.level and decrement it later to limit recursion.
        // It's harmless to do here, because no tokens are created. But ideally,
        // we'd need a separate private state variable for this purpose.
        //
        state.level++;
        ok = rules[i](state, true);
        state.level--;
        if (ok) break;
    }
    else // Too much nesting, just skip until the end of the paragraph.
    //
    // NOTE: this will cause links to behave incorrectly in the following case,
    //       when an amount of `[` is exactly equal to `maxNesting + 1`:
    //
    //       [[[[[[[[[[[[[[[[[[[[[foo]()
    //
    // TODO: remove this workaround when CM standard will allow nested links
    //       (we can replace it by preventing links from being parsed in
    //       validation mode)
    //
    state.pos = state.posMax;
    if (!ok) state.pos++;
    cache[pos] = state.pos;
};
// Generate tokens for input range
//
$d752273b674a817f$var$ParserInline.prototype.tokenize = function(state) {
    var ok, i, rules = this.ruler.getRules(""), len = rules.length, end = state.posMax, maxNesting = state.md.options.maxNesting;
    while(state.pos < end){
        // Try all possible rules.
        // On success, rule should:
        //
        // - update `state.pos`
        // - update `state.tokens`
        // - return true
        if (state.level < maxNesting) for(i = 0; i < len; i++){
            ok = rules[i](state, false);
            if (ok) break;
        }
        if (ok) {
            if (state.pos >= end) break;
            continue;
        }
        state.pending += state.src[state.pos++];
    }
    if (state.pending) state.pushPending();
};
/**
 * ParserInline.parse(str, md, env, outTokens)
 *
 * Process input string and push inline tokens into `outTokens`
 **/ $d752273b674a817f$var$ParserInline.prototype.parse = function(str, md, env, outTokens) {
    var i, rules, len;
    var state = new this.State(str, md, env, outTokens);
    this.tokenize(state);
    rules = this.ruler2.getRules("");
    len = rules.length;
    for(i = 0; i < len; i++)rules[i](state);
};

$d752273b674a817f$var$ParserInline.prototype.State = (parcelRequire("7oDOL"));
module.exports = $d752273b674a817f$var$ParserInline;

});
parcelRequire.register("h3jHU", function(module, exports) {
// Skip text characters for text token, place those to pending buffer
// and increment current pos
"use strict";
// Rule to skip pure text
// '{}$%@~+=:' reserved for extentions
// !, ", #, $, %, &, ', (, ), *, +, ,, -, ., /, :, ;, <, =, >, ?, @, [, \, ], ^, _, `, {, |, }, or ~
// !!!! Don't confuse with "Markdown ASCII Punctuation" chars
// http://spec.commonmark.org/0.15/#ascii-punctuation-character
function $c6a200ee11cf8d5c$var$isTerminatorChar(ch) {
    switch(ch){
        case 0x0A /* \n */ :
        case 0x21 /* ! */ :
        case 0x23 /* # */ :
        case 0x24 /* $ */ :
        case 0x25 /* % */ :
        case 0x26 /* & */ :
        case 0x2A /* * */ :
        case 0x2B /* + */ :
        case 0x2D /* - */ :
        case 0x3A /* : */ :
        case 0x3C /* < */ :
        case 0x3D /* = */ :
        case 0x3E /* > */ :
        case 0x40 /* @ */ :
        case 0x5B /* [ */ :
        case 0x5C /* \ */ :
        case 0x5D /* ] */ :
        case 0x5E /* ^ */ :
        case 0x5F /* _ */ :
        case 0x60 /* ` */ :
        case 0x7B /* { */ :
        case 0x7D /* } */ :
        case 0x7E /* ~ */ :
            return true;
        default:
            return false;
    }
}
module.exports = function text(state, silent) {
    var pos = state.pos;
    while(pos < state.posMax && !$c6a200ee11cf8d5c$var$isTerminatorChar(state.src.charCodeAt(pos)))pos++;
    if (pos === state.pos) return false;
    if (!silent) state.pending += state.src.slice(state.pos, pos);
    state.pos = pos;
    return true;
}; // Alternative implementation, for memory.
 //
 // It costs 10% of performance, but allows extend terminators list, if place it
 // to `ParcerInline` property. Probably, will switch to it sometime, such
 // flexibility required.
 /*
var TERMINATOR_RE = /[\n!#$%&*+\-:<=>@[\\\]^_`{}~]/;

module.exports = function text(state, silent) {
  var pos = state.pos,
      idx = state.src.slice(pos).search(TERMINATOR_RE);

  // first char is terminator -> empty text
  if (idx === 0) { return false; }

  // no terminator -> text till end of string
  if (idx < 0) {
    if (!silent) { state.pending += state.src.slice(pos); }
    state.pos = state.src.length;
    return true;
  }

  if (!silent) { state.pending += state.src.slice(pos, pos + idx); }

  state.pos += idx;

  return true;
};*/ 

});

parcelRequire.register("3DaXe", function(module, exports) {
// Process links like https://example.org/
"use strict";
// RFC3986: scheme = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
var $2a4d82f03e9f7673$var$SCHEME_RE = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;
module.exports = function linkify(state, silent) {
    var pos, max, match, proto, link, url, fullUrl, token;
    if (!state.md.options.linkify) return false;
    if (state.linkLevel > 0) return false;
    pos = state.pos;
    max = state.posMax;
    if (pos + 3 > max) return false;
    if (state.src.charCodeAt(pos) !== 0x3A /* : */ ) return false;
    if (state.src.charCodeAt(pos + 1) !== 0x2F /* / */ ) return false;
    if (state.src.charCodeAt(pos + 2) !== 0x2F /* / */ ) return false;
    match = state.pending.match($2a4d82f03e9f7673$var$SCHEME_RE);
    if (!match) return false;
    proto = match[1];
    link = state.md.linkify.matchAtStart(state.src.slice(pos - proto.length));
    if (!link) return false;
    url = link.url;
    // disallow '*' at the end of the link (conflicts with emphasis)
    url = url.replace(/\*+$/, "");
    fullUrl = state.md.normalizeLink(url);
    if (!state.md.validateLink(fullUrl)) return false;
    if (!silent) {
        state.pending = state.pending.slice(0, -proto.length);
        token = state.push("link_open", "a", 1);
        token.attrs = [
            [
                "href",
                fullUrl
            ]
        ];
        token.markup = "linkify";
        token.info = "auto";
        token = state.push("text", "", 0);
        token.content = state.md.normalizeLinkText(url);
        token = state.push("link_close", "a", -1);
        token.markup = "linkify";
        token.info = "auto";
    }
    state.pos += url.length - proto.length;
    return true;
};

});

parcelRequire.register("lwpU7", function(module, exports) {
// Proceess '\n'
"use strict";

var $4VIu7 = parcelRequire("4VIu7");
var $fab0ae2bf8dd536d$require$isSpace = $4VIu7.isSpace;
module.exports = function newline(state, silent) {
    var pmax, max, ws, pos = state.pos;
    if (state.src.charCodeAt(pos) !== 0x0A /* \n */ ) return false;
    pmax = state.pending.length - 1;
    max = state.posMax;
    // '  \n' -> hardbreak
    // Lookup in pending chars is bad practice! Don't copy to other rules!
    // Pending string is stored in concat mode, indexed lookups will cause
    // convertion to flat mode.
    if (!silent) {
        if (pmax >= 0 && state.pending.charCodeAt(pmax) === 0x20) {
            if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 0x20) {
                // Find whitespaces tail of pending chars.
                ws = pmax - 1;
                while(ws >= 1 && state.pending.charCodeAt(ws - 1) === 0x20)ws--;
                state.pending = state.pending.slice(0, ws);
                state.push("hardbreak", "br", 0);
            } else {
                state.pending = state.pending.slice(0, -1);
                state.push("softbreak", "br", 0);
            }
        } else state.push("softbreak", "br", 0);
    }
    pos++;
    // skip heading spaces for next line
    while(pos < max && $fab0ae2bf8dd536d$require$isSpace(state.src.charCodeAt(pos)))pos++;
    state.pos = pos;
    return true;
};

});

parcelRequire.register("dsWjR", function(module, exports) {
// Process escaped chars and hardbreaks
"use strict";

var $4VIu7 = parcelRequire("4VIu7");
var $9cdb20e6aeea4f9b$require$isSpace = $4VIu7.isSpace;
var $9cdb20e6aeea4f9b$var$ESCAPED = [];
for(var $9cdb20e6aeea4f9b$var$i = 0; $9cdb20e6aeea4f9b$var$i < 256; $9cdb20e6aeea4f9b$var$i++)$9cdb20e6aeea4f9b$var$ESCAPED.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(ch) {
    $9cdb20e6aeea4f9b$var$ESCAPED[ch.charCodeAt(0)] = 1;
});
module.exports = function escape(state, silent) {
    var ch1, ch2, origStr, escapedStr, token, pos = state.pos, max = state.posMax;
    if (state.src.charCodeAt(pos) !== 0x5C /* \ */ ) return false;
    pos++;
    // '\' at the end of the inline block
    if (pos >= max) return false;
    ch1 = state.src.charCodeAt(pos);
    if (ch1 === 0x0A) {
        if (!silent) state.push("hardbreak", "br", 0);
        pos++;
        // skip leading whitespaces from next line
        while(pos < max){
            ch1 = state.src.charCodeAt(pos);
            if (!$9cdb20e6aeea4f9b$require$isSpace(ch1)) break;
            pos++;
        }
        state.pos = pos;
        return true;
    }
    escapedStr = state.src[pos];
    if (ch1 >= 0xD800 && ch1 <= 0xDBFF && pos + 1 < max) {
        ch2 = state.src.charCodeAt(pos + 1);
        if (ch2 >= 0xDC00 && ch2 <= 0xDFFF) {
            escapedStr += state.src[pos + 1];
            pos++;
        }
    }
    origStr = "\\" + escapedStr;
    if (!silent) {
        token = state.push("text_special", "", 0);
        if (ch1 < 256 && $9cdb20e6aeea4f9b$var$ESCAPED[ch1] !== 0) token.content = escapedStr;
        else token.content = origStr;
        token.markup = origStr;
        token.info = "escape";
    }
    state.pos = pos + 1;
    return true;
};

});

parcelRequire.register("eAWF9", function(module, exports) {
// Parse backticks
"use strict";
module.exports = function backtick(state, silent) {
    var start, max, marker, token, matchStart, matchEnd, openerLength, closerLength, pos = state.pos, ch = state.src.charCodeAt(pos);
    if (ch !== 0x60 /* ` */ ) return false;
    start = pos;
    pos++;
    max = state.posMax;
    // scan marker length
    while(pos < max && state.src.charCodeAt(pos) === 0x60 /* ` */ )pos++;
    marker = state.src.slice(start, pos);
    openerLength = marker.length;
    if (state.backticksScanned && (state.backticks[openerLength] || 0) <= start) {
        if (!silent) state.pending += marker;
        state.pos += openerLength;
        return true;
    }
    matchStart = matchEnd = pos;
    // Nothing found in the cache, scan until the end of the line (or until marker is found)
    while((matchStart = state.src.indexOf("`", matchEnd)) !== -1){
        matchEnd = matchStart + 1;
        // scan marker length
        while(matchEnd < max && state.src.charCodeAt(matchEnd) === 0x60 /* ` */ )matchEnd++;
        closerLength = matchEnd - matchStart;
        if (closerLength === openerLength) {
            // Found matching closer length.
            if (!silent) {
                token = state.push("code_inline", "code", 0);
                token.markup = marker;
                token.content = state.src.slice(pos, matchStart).replace(/\n/g, " ").replace(/^ (.+) $/, "$1");
            }
            state.pos = matchEnd;
            return true;
        }
        // Some different length found, put it in cache as upper limit of where closer can be found
        state.backticks[closerLength] = matchStart;
    }
    // Scanned through the end, didn't find anything
    state.backticksScanned = true;
    if (!silent) state.pending += marker;
    state.pos += openerLength;
    return true;
};

});

parcelRequire.register("caRwR", function(module, exports) {

$parcel$export(module.exports, "tokenize", () => $8dcff0fae7580d10$export$660b2ee2d4fb4eff, (v) => $8dcff0fae7580d10$export$660b2ee2d4fb4eff = v);
$parcel$export(module.exports, "postProcess", () => $8dcff0fae7580d10$export$7b804a0e0ce836d9, (v) => $8dcff0fae7580d10$export$7b804a0e0ce836d9 = v);
// ~~strike through~~
//
// Insert each marker as a separate text token, and add it to delimiter list
//
var $8dcff0fae7580d10$export$660b2ee2d4fb4eff;
// Walk through delimiter list and replace text tokens with tags
//
var $8dcff0fae7580d10$export$7b804a0e0ce836d9;
"use strict";
$8dcff0fae7580d10$export$660b2ee2d4fb4eff = function strikethrough(state, silent) {
    var i, scanned, token, len, ch, start = state.pos, marker = state.src.charCodeAt(start);
    if (silent) return false;
    if (marker !== 0x7E /* ~ */ ) return false;
    scanned = state.scanDelims(state.pos, true);
    len = scanned.length;
    ch = String.fromCharCode(marker);
    if (len < 2) return false;
    if (len % 2) {
        token = state.push("text", "", 0);
        token.content = ch;
        len--;
    }
    for(i = 0; i < len; i += 2){
        token = state.push("text", "", 0);
        token.content = ch + ch;
        state.delimiters.push({
            marker: marker,
            length: 0,
            token: state.tokens.length - 1,
            end: -1,
            open: scanned.can_open,
            close: scanned.can_close
        });
    }
    state.pos += scanned.length;
    return true;
};
function $8dcff0fae7580d10$var$postProcess(state, delimiters) {
    var i, j, startDelim, endDelim, token, loneMarkers = [], max = delimiters.length;
    for(i = 0; i < max; i++){
        startDelim = delimiters[i];
        if (startDelim.marker !== 0x7E /* ~ */ ) continue;
        if (startDelim.end === -1) continue;
        endDelim = delimiters[startDelim.end];
        token = state.tokens[startDelim.token];
        token.type = "s_open";
        token.tag = "s";
        token.nesting = 1;
        token.markup = "~~";
        token.content = "";
        token = state.tokens[endDelim.token];
        token.type = "s_close";
        token.tag = "s";
        token.nesting = -1;
        token.markup = "~~";
        token.content = "";
        if (state.tokens[endDelim.token - 1].type === "text" && state.tokens[endDelim.token - 1].content === "~") loneMarkers.push(endDelim.token - 1);
    }
    // If a marker sequence has an odd number of characters, it's splitted
    // like this: `~~~~~` -> `~` + `~~` + `~~`, leaving one marker at the
    // start of the sequence.
    //
    // So, we have to move all those markers after subsequent s_close tags.
    //
    while(loneMarkers.length){
        i = loneMarkers.pop();
        j = i + 1;
        while(j < state.tokens.length && state.tokens[j].type === "s_close")j++;
        j--;
        if (i !== j) {
            token = state.tokens[j];
            state.tokens[j] = state.tokens[i];
            state.tokens[i] = token;
        }
    }
}
$8dcff0fae7580d10$export$7b804a0e0ce836d9 = function strikethrough(state) {
    var curr, tokens_meta = state.tokens_meta, max = state.tokens_meta.length;
    $8dcff0fae7580d10$var$postProcess(state, state.delimiters);
    for(curr = 0; curr < max; curr++)if (tokens_meta[curr] && tokens_meta[curr].delimiters) $8dcff0fae7580d10$var$postProcess(state, tokens_meta[curr].delimiters);
};

});

parcelRequire.register("hCAO8", function(module, exports) {

$parcel$export(module.exports, "tokenize", () => $cd428985e81cd4c9$export$660b2ee2d4fb4eff, (v) => $cd428985e81cd4c9$export$660b2ee2d4fb4eff = v);
$parcel$export(module.exports, "postProcess", () => $cd428985e81cd4c9$export$7b804a0e0ce836d9, (v) => $cd428985e81cd4c9$export$7b804a0e0ce836d9 = v);
// Process *this* and _that_
//
// Insert each marker as a separate text token, and add it to delimiter list
//
var $cd428985e81cd4c9$export$660b2ee2d4fb4eff;
// Walk through delimiter list and replace text tokens with tags
//
var $cd428985e81cd4c9$export$7b804a0e0ce836d9;
"use strict";
$cd428985e81cd4c9$export$660b2ee2d4fb4eff = function emphasis(state, silent) {
    var i, scanned, token, start = state.pos, marker = state.src.charCodeAt(start);
    if (silent) return false;
    if (marker !== 0x5F /* _ */  && marker !== 0x2A /* * */ ) return false;
    scanned = state.scanDelims(state.pos, marker === 0x2A);
    for(i = 0; i < scanned.length; i++){
        token = state.push("text", "", 0);
        token.content = String.fromCharCode(marker);
        state.delimiters.push({
            // Char code of the starting marker (number).
            //
            marker: marker,
            // Total length of these series of delimiters.
            //
            length: scanned.length,
            // A position of the token this delimiter corresponds to.
            //
            token: state.tokens.length - 1,
            // If this delimiter is matched as a valid opener, `end` will be
            // equal to its position, otherwise it's `-1`.
            //
            end: -1,
            // Boolean flags that determine if this delimiter could open or close
            // an emphasis.
            //
            open: scanned.can_open,
            close: scanned.can_close
        });
    }
    state.pos += scanned.length;
    return true;
};
function $cd428985e81cd4c9$var$postProcess(state, delimiters) {
    var i, startDelim, endDelim, token, ch, isStrong, max = delimiters.length;
    for(i = max - 1; i >= 0; i--){
        startDelim = delimiters[i];
        if (startDelim.marker !== 0x5F /* _ */  && startDelim.marker !== 0x2A /* * */ ) continue;
        // Process only opening markers
        if (startDelim.end === -1) continue;
        endDelim = delimiters[startDelim.end];
        // If the previous delimiter has the same marker and is adjacent to this one,
        // merge those into one strong delimiter.
        //
        // `<em><em>whatever</em></em>` -> `<strong>whatever</strong>`
        //
        isStrong = i > 0 && delimiters[i - 1].end === startDelim.end + 1 && // check that first two markers match and adjacent
        delimiters[i - 1].marker === startDelim.marker && delimiters[i - 1].token === startDelim.token - 1 && // check that last two markers are adjacent (we can safely assume they match)
        delimiters[startDelim.end + 1].token === endDelim.token + 1;
        ch = String.fromCharCode(startDelim.marker);
        token = state.tokens[startDelim.token];
        token.type = isStrong ? "strong_open" : "em_open";
        token.tag = isStrong ? "strong" : "em";
        token.nesting = 1;
        token.markup = isStrong ? ch + ch : ch;
        token.content = "";
        token = state.tokens[endDelim.token];
        token.type = isStrong ? "strong_close" : "em_close";
        token.tag = isStrong ? "strong" : "em";
        token.nesting = -1;
        token.markup = isStrong ? ch + ch : ch;
        token.content = "";
        if (isStrong) {
            state.tokens[delimiters[i - 1].token].content = "";
            state.tokens[delimiters[startDelim.end + 1].token].content = "";
            i--;
        }
    }
}
$cd428985e81cd4c9$export$7b804a0e0ce836d9 = function emphasis(state) {
    var curr, tokens_meta = state.tokens_meta, max = state.tokens_meta.length;
    $cd428985e81cd4c9$var$postProcess(state, state.delimiters);
    for(curr = 0; curr < max; curr++)if (tokens_meta[curr] && tokens_meta[curr].delimiters) $cd428985e81cd4c9$var$postProcess(state, tokens_meta[curr].delimiters);
};

});

parcelRequire.register("lsXNX", function(module, exports) {
// Process [link](<to> "stuff")
"use strict";

var $4VIu7 = parcelRequire("4VIu7");
var $fa0a9a77368ab578$require$normalizeReference = $4VIu7.normalizeReference;

var $4VIu7 = parcelRequire("4VIu7");
var $fa0a9a77368ab578$require$isSpace = $4VIu7.isSpace;
module.exports = function link(state, silent) {
    var attrs, code, label, labelEnd, labelStart, pos, res, ref, token, href = "", title = "", oldPos = state.pos, max = state.posMax, start = state.pos, parseReference = true;
    if (state.src.charCodeAt(state.pos) !== 0x5B /* [ */ ) return false;
    labelStart = state.pos + 1;
    labelEnd = state.md.helpers.parseLinkLabel(state, state.pos, true);
    // parser failed to find ']', so it's not a valid link
    if (labelEnd < 0) return false;
    pos = labelEnd + 1;
    if (pos < max && state.src.charCodeAt(pos) === 0x28 /* ( */ ) {
        //
        // Inline link
        //
        // might have found a valid shortcut link, disable reference parsing
        parseReference = false;
        // [link](  <href>  "title"  )
        //        ^^ skipping these spaces
        pos++;
        for(; pos < max; pos++){
            code = state.src.charCodeAt(pos);
            if (!$fa0a9a77368ab578$require$isSpace(code) && code !== 0x0A) break;
        }
        if (pos >= max) return false;
        // [link](  <href>  "title"  )
        //          ^^^^^^ parsing link destination
        start = pos;
        res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
        if (res.ok) {
            href = state.md.normalizeLink(res.str);
            if (state.md.validateLink(href)) pos = res.pos;
            else href = "";
            // [link](  <href>  "title"  )
            //                ^^ skipping these spaces
            start = pos;
            for(; pos < max; pos++){
                code = state.src.charCodeAt(pos);
                if (!$fa0a9a77368ab578$require$isSpace(code) && code !== 0x0A) break;
            }
            // [link](  <href>  "title"  )
            //                  ^^^^^^^ parsing link title
            res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
            if (pos < max && start !== pos && res.ok) {
                title = res.str;
                pos = res.pos;
                // [link](  <href>  "title"  )
                //                         ^^ skipping these spaces
                for(; pos < max; pos++){
                    code = state.src.charCodeAt(pos);
                    if (!$fa0a9a77368ab578$require$isSpace(code) && code !== 0x0A) break;
                }
            }
        }
        if (pos >= max || state.src.charCodeAt(pos) !== 0x29 /* ) */ ) // parsing a valid shortcut link failed, fallback to reference
        parseReference = true;
        pos++;
    }
    if (parseReference) {
        //
        // Link reference
        //
        if (typeof state.env.references === "undefined") return false;
        if (pos < max && state.src.charCodeAt(pos) === 0x5B /* [ */ ) {
            start = pos + 1;
            pos = state.md.helpers.parseLinkLabel(state, pos);
            if (pos >= 0) label = state.src.slice(start, pos++);
            else pos = labelEnd + 1;
        } else pos = labelEnd + 1;
        // covers label === '' and label === undefined
        // (collapsed reference link and shortcut reference link respectively)
        if (!label) label = state.src.slice(labelStart, labelEnd);
        ref = state.env.references[$fa0a9a77368ab578$require$normalizeReference(label)];
        if (!ref) {
            state.pos = oldPos;
            return false;
        }
        href = ref.href;
        title = ref.title;
    }
    //
    // We found the end of the link, and know for a fact it's a valid link;
    // so all that's left to do is to call tokenizer.
    //
    if (!silent) {
        state.pos = labelStart;
        state.posMax = labelEnd;
        token = state.push("link_open", "a", 1);
        token.attrs = attrs = [
            [
                "href",
                href
            ]
        ];
        if (title) attrs.push([
            "title",
            title
        ]);
        state.linkLevel++;
        state.md.inline.tokenize(state);
        state.linkLevel--;
        token = state.push("link_close", "a", -1);
    }
    state.pos = pos;
    state.posMax = max;
    return true;
};

});

parcelRequire.register("cvWkG", function(module, exports) {
// Process ![image](<src> "title")
"use strict";

var $4VIu7 = parcelRequire("4VIu7");
var $91c5a0f39c48d52a$require$normalizeReference = $4VIu7.normalizeReference;

var $4VIu7 = parcelRequire("4VIu7");
var $91c5a0f39c48d52a$require$isSpace = $4VIu7.isSpace;
module.exports = function image(state, silent) {
    var attrs, code, content, label, labelEnd, labelStart, pos, ref, res, title, token, tokens, start, href = "", oldPos = state.pos, max = state.posMax;
    if (state.src.charCodeAt(state.pos) !== 0x21 /* ! */ ) return false;
    if (state.src.charCodeAt(state.pos + 1) !== 0x5B /* [ */ ) return false;
    labelStart = state.pos + 2;
    labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, false);
    // parser failed to find ']', so it's not a valid link
    if (labelEnd < 0) return false;
    pos = labelEnd + 1;
    if (pos < max && state.src.charCodeAt(pos) === 0x28 /* ( */ ) {
        //
        // Inline link
        //
        // [link](  <href>  "title"  )
        //        ^^ skipping these spaces
        pos++;
        for(; pos < max; pos++){
            code = state.src.charCodeAt(pos);
            if (!$91c5a0f39c48d52a$require$isSpace(code) && code !== 0x0A) break;
        }
        if (pos >= max) return false;
        // [link](  <href>  "title"  )
        //          ^^^^^^ parsing link destination
        start = pos;
        res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
        if (res.ok) {
            href = state.md.normalizeLink(res.str);
            if (state.md.validateLink(href)) pos = res.pos;
            else href = "";
        }
        // [link](  <href>  "title"  )
        //                ^^ skipping these spaces
        start = pos;
        for(; pos < max; pos++){
            code = state.src.charCodeAt(pos);
            if (!$91c5a0f39c48d52a$require$isSpace(code) && code !== 0x0A) break;
        }
        // [link](  <href>  "title"  )
        //                  ^^^^^^^ parsing link title
        res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
        if (pos < max && start !== pos && res.ok) {
            title = res.str;
            pos = res.pos;
            // [link](  <href>  "title"  )
            //                         ^^ skipping these spaces
            for(; pos < max; pos++){
                code = state.src.charCodeAt(pos);
                if (!$91c5a0f39c48d52a$require$isSpace(code) && code !== 0x0A) break;
            }
        } else title = "";
        if (pos >= max || state.src.charCodeAt(pos) !== 0x29 /* ) */ ) {
            state.pos = oldPos;
            return false;
        }
        pos++;
    } else {
        //
        // Link reference
        //
        if (typeof state.env.references === "undefined") return false;
        if (pos < max && state.src.charCodeAt(pos) === 0x5B /* [ */ ) {
            start = pos + 1;
            pos = state.md.helpers.parseLinkLabel(state, pos);
            if (pos >= 0) label = state.src.slice(start, pos++);
            else pos = labelEnd + 1;
        } else pos = labelEnd + 1;
        // covers label === '' and label === undefined
        // (collapsed reference link and shortcut reference link respectively)
        if (!label) label = state.src.slice(labelStart, labelEnd);
        ref = state.env.references[$91c5a0f39c48d52a$require$normalizeReference(label)];
        if (!ref) {
            state.pos = oldPos;
            return false;
        }
        href = ref.href;
        title = ref.title;
    }
    //
    // We found the end of the link, and know for a fact it's a valid link;
    // so all that's left to do is to call tokenizer.
    //
    if (!silent) {
        content = state.src.slice(labelStart, labelEnd);
        state.md.inline.parse(content, state.md, state.env, tokens = []);
        token = state.push("image", "img", 0);
        token.attrs = attrs = [
            [
                "src",
                href
            ],
            [
                "alt",
                ""
            ]
        ];
        token.children = tokens;
        token.content = content;
        if (title) attrs.push([
            "title",
            title
        ]);
    }
    state.pos = pos;
    state.posMax = max;
    return true;
};

});

parcelRequire.register("kJnIX", function(module, exports) {
// Process autolinks '<protocol:...>'
"use strict";
/*eslint max-len:0*/ var $f17a69bc1fde8e7b$var$EMAIL_RE = /^([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/;
var $f17a69bc1fde8e7b$var$AUTOLINK_RE = /^([a-zA-Z][a-zA-Z0-9+.\-]{1,31}):([^<>\x00-\x20]*)$/;
module.exports = function autolink(state, silent) {
    var url, fullUrl, token, ch, start, max, pos = state.pos;
    if (state.src.charCodeAt(pos) !== 0x3C /* < */ ) return false;
    start = state.pos;
    max = state.posMax;
    for(;;){
        if (++pos >= max) return false;
        ch = state.src.charCodeAt(pos);
        if (ch === 0x3C /* < */ ) return false;
        if (ch === 0x3E /* > */ ) break;
    }
    url = state.src.slice(start + 1, pos);
    if ($f17a69bc1fde8e7b$var$AUTOLINK_RE.test(url)) {
        fullUrl = state.md.normalizeLink(url);
        if (!state.md.validateLink(fullUrl)) return false;
        if (!silent) {
            token = state.push("link_open", "a", 1);
            token.attrs = [
                [
                    "href",
                    fullUrl
                ]
            ];
            token.markup = "autolink";
            token.info = "auto";
            token = state.push("text", "", 0);
            token.content = state.md.normalizeLinkText(url);
            token = state.push("link_close", "a", -1);
            token.markup = "autolink";
            token.info = "auto";
        }
        state.pos += url.length + 2;
        return true;
    }
    if ($f17a69bc1fde8e7b$var$EMAIL_RE.test(url)) {
        fullUrl = state.md.normalizeLink("mailto:" + url);
        if (!state.md.validateLink(fullUrl)) return false;
        if (!silent) {
            token = state.push("link_open", "a", 1);
            token.attrs = [
                [
                    "href",
                    fullUrl
                ]
            ];
            token.markup = "autolink";
            token.info = "auto";
            token = state.push("text", "", 0);
            token.content = state.md.normalizeLinkText(url);
            token = state.push("link_close", "a", -1);
            token.markup = "autolink";
            token.info = "auto";
        }
        state.pos += url.length + 2;
        return true;
    }
    return false;
};

});

parcelRequire.register("6RNs8", function(module, exports) {
// Process html tags
"use strict";

var $2yIl8 = parcelRequire("2yIl8");
var $4ffe0d9b616c1e84$require$HTML_TAG_RE = $2yIl8.HTML_TAG_RE;
function $4ffe0d9b616c1e84$var$isLinkOpen(str) {
    return /^<a[>\s]/i.test(str);
}
function $4ffe0d9b616c1e84$var$isLinkClose(str) {
    return /^<\/a\s*>/i.test(str);
}
function $4ffe0d9b616c1e84$var$isLetter(ch) {
    /*eslint no-bitwise:0*/ var lc = ch | 0x20; // to lower case
    return lc >= 0x61 /* a */  && lc <= 0x7a /* z */ ;
}
module.exports = function html_inline(state, silent) {
    var ch, match, max, token, pos = state.pos;
    if (!state.md.options.html) return false;
    // Check start
    max = state.posMax;
    if (state.src.charCodeAt(pos) !== 0x3C /* < */  || pos + 2 >= max) return false;
    // Quick fail on second char
    ch = state.src.charCodeAt(pos + 1);
    if (ch !== 0x21 /* ! */  && ch !== 0x3F /* ? */  && ch !== 0x2F /* / */  && !$4ffe0d9b616c1e84$var$isLetter(ch)) return false;
    match = state.src.slice(pos).match($4ffe0d9b616c1e84$require$HTML_TAG_RE);
    if (!match) return false;
    if (!silent) {
        token = state.push("html_inline", "", 0);
        token.content = state.src.slice(pos, pos + match[0].length);
        if ($4ffe0d9b616c1e84$var$isLinkOpen(token.content)) state.linkLevel++;
        if ($4ffe0d9b616c1e84$var$isLinkClose(token.content)) state.linkLevel--;
    }
    state.pos += match[0].length;
    return true;
};

});

parcelRequire.register("7TNoo", function(module, exports) {
// Process html entity - &#123;, &#xAF;, &quot;, ...
"use strict";

var $lY0a3 = parcelRequire("lY0a3");

var $4VIu7 = parcelRequire("4VIu7");
var $5c03fbc6f4e2d20d$require$has = $4VIu7.has;

var $4VIu7 = parcelRequire("4VIu7");
var $5c03fbc6f4e2d20d$require$isValidEntityCode = $4VIu7.isValidEntityCode;

var $4VIu7 = parcelRequire("4VIu7");
var $5c03fbc6f4e2d20d$require$fromCodePoint = $4VIu7.fromCodePoint;
var $5c03fbc6f4e2d20d$var$DIGITAL_RE = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i;
var $5c03fbc6f4e2d20d$var$NAMED_RE = /^&([a-z][a-z0-9]{1,31});/i;
module.exports = function entity(state, silent) {
    var ch, code, match, token, pos = state.pos, max = state.posMax;
    if (state.src.charCodeAt(pos) !== 0x26 /* & */ ) return false;
    if (pos + 1 >= max) return false;
    ch = state.src.charCodeAt(pos + 1);
    if (ch === 0x23 /* # */ ) {
        match = state.src.slice(pos).match($5c03fbc6f4e2d20d$var$DIGITAL_RE);
        if (match) {
            if (!silent) {
                code = match[1][0].toLowerCase() === "x" ? parseInt(match[1].slice(1), 16) : parseInt(match[1], 10);
                token = state.push("text_special", "", 0);
                token.content = $5c03fbc6f4e2d20d$require$isValidEntityCode(code) ? $5c03fbc6f4e2d20d$require$fromCodePoint(code) : $5c03fbc6f4e2d20d$require$fromCodePoint(0xFFFD);
                token.markup = match[0];
                token.info = "entity";
            }
            state.pos += match[0].length;
            return true;
        }
    } else {
        match = state.src.slice(pos).match($5c03fbc6f4e2d20d$var$NAMED_RE);
        if (match) {
            if ($5c03fbc6f4e2d20d$require$has($lY0a3, match[1])) {
                if (!silent) {
                    token = state.push("text_special", "", 0);
                    token.content = $lY0a3[match[1]];
                    token.markup = match[0];
                    token.info = "entity";
                }
                state.pos += match[0].length;
                return true;
            }
        }
    }
    return false;
};

});

parcelRequire.register("jQmAK", function(module, exports) {
// For each opening emphasis-like marker find a matching closing one
//
"use strict";
function $e72465e3b7457eb9$var$processDelimiters(state, delimiters) {
    var closerIdx, openerIdx, closer, opener, minOpenerIdx, newMinOpenerIdx, isOddMatch, lastJump, openersBottom = {}, max = delimiters.length;
    if (!max) return;
    // headerIdx is the first delimiter of the current (where closer is) delimiter run
    var headerIdx = 0;
    var lastTokenIdx = -2; // needs any value lower than -1
    var jumps = [];
    for(closerIdx = 0; closerIdx < max; closerIdx++){
        closer = delimiters[closerIdx];
        jumps.push(0);
        // markers belong to same delimiter run if:
        //  - they have adjacent tokens
        //  - AND markers are the same
        //
        if (delimiters[headerIdx].marker !== closer.marker || lastTokenIdx !== closer.token - 1) headerIdx = closerIdx;
        lastTokenIdx = closer.token;
        // Length is only used for emphasis-specific "rule of 3",
        // if it's not defined (in strikethrough or 3rd party plugins),
        // we can default it to 0 to disable those checks.
        //
        closer.length = closer.length || 0;
        if (!closer.close) continue;
        // Previously calculated lower bounds (previous fails)
        // for each marker, each delimiter length modulo 3,
        // and for whether this closer can be an opener;
        // https://github.com/commonmark/cmark/commit/34250e12ccebdc6372b8b49c44fab57c72443460
        if (!openersBottom.hasOwnProperty(closer.marker)) openersBottom[closer.marker] = [
            -1,
            -1,
            -1,
            -1,
            -1,
            -1
        ];
        minOpenerIdx = openersBottom[closer.marker][(closer.open ? 3 : 0) + closer.length % 3];
        openerIdx = headerIdx - jumps[headerIdx] - 1;
        newMinOpenerIdx = openerIdx;
        for(; openerIdx > minOpenerIdx; openerIdx -= jumps[openerIdx] + 1){
            opener = delimiters[openerIdx];
            if (opener.marker !== closer.marker) continue;
            if (opener.open && opener.end < 0) {
                isOddMatch = false;
                // from spec:
                //
                // If one of the delimiters can both open and close emphasis, then the
                // sum of the lengths of the delimiter runs containing the opening and
                // closing delimiters must not be a multiple of 3 unless both lengths
                // are multiples of 3.
                //
                if (opener.close || closer.open) {
                    if ((opener.length + closer.length) % 3 === 0) {
                        if (opener.length % 3 !== 0 || closer.length % 3 !== 0) isOddMatch = true;
                    }
                }
                if (!isOddMatch) {
                    // If previous delimiter cannot be an opener, we can safely skip
                    // the entire sequence in future checks. This is required to make
                    // sure algorithm has linear complexity (see *_*_*_*_*_... case).
                    //
                    lastJump = openerIdx > 0 && !delimiters[openerIdx - 1].open ? jumps[openerIdx - 1] + 1 : 0;
                    jumps[closerIdx] = closerIdx - openerIdx + lastJump;
                    jumps[openerIdx] = lastJump;
                    closer.open = false;
                    opener.end = closerIdx;
                    opener.close = false;
                    newMinOpenerIdx = -1;
                    // treat next token as start of run,
                    // it optimizes skips in **<...>**a**<...>** pathological case
                    lastTokenIdx = -2;
                    break;
                }
            }
        }
        if (newMinOpenerIdx !== -1) // If match for this delimiter run failed, we want to set lower bound for
        // future lookups. This is required to make sure algorithm has linear
        // complexity.
        //
        // See details here:
        // https://github.com/commonmark/cmark/issues/178#issuecomment-270417442
        //
        openersBottom[closer.marker][(closer.open ? 3 : 0) + (closer.length || 0) % 3] = newMinOpenerIdx;
    }
}
module.exports = function link_pairs(state) {
    var curr, tokens_meta = state.tokens_meta, max = state.tokens_meta.length;
    $e72465e3b7457eb9$var$processDelimiters(state, state.delimiters);
    for(curr = 0; curr < max; curr++)if (tokens_meta[curr] && tokens_meta[curr].delimiters) $e72465e3b7457eb9$var$processDelimiters(state, tokens_meta[curr].delimiters);
};

});

parcelRequire.register("4dP8G", function(module, exports) {
// Clean up tokens after emphasis and strikethrough postprocessing:
// merge adjacent text nodes into one and re-calculate all token levels
//
// This is necessary because initially emphasis delimiter markers (*, _, ~)
// are treated as their own separate text tokens. Then emphasis rule either
// leaves them as text (needed to merge with adjacent text) or turns them
// into opening/closing tags (which messes up levels inside).
//
"use strict";
module.exports = function fragments_join(state) {
    var curr, last, level = 0, tokens = state.tokens, max = state.tokens.length;
    for(curr = last = 0; curr < max; curr++){
        // re-calculate levels after emphasis/strikethrough turns some text nodes
        // into opening/closing tags
        if (tokens[curr].nesting < 0) level--; // closing tag
        tokens[curr].level = level;
        if (tokens[curr].nesting > 0) level++; // opening tag
        if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") // collapse two adjacent text nodes
        tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
        else {
            if (curr !== last) tokens[last] = tokens[curr];
            last++;
        }
    }
    if (curr !== last) tokens.length = last;
};

});

parcelRequire.register("7oDOL", function(module, exports) {
// Inline parser state
"use strict";

var $em0se = parcelRequire("em0se");

var $4VIu7 = parcelRequire("4VIu7");
var $5629a940567b13a6$require$isWhiteSpace = $4VIu7.isWhiteSpace;

var $4VIu7 = parcelRequire("4VIu7");
var $5629a940567b13a6$require$isPunctChar = $4VIu7.isPunctChar;

var $4VIu7 = parcelRequire("4VIu7");
var $5629a940567b13a6$require$isMdAsciiPunct = $4VIu7.isMdAsciiPunct;
function $5629a940567b13a6$var$StateInline(src, md, env, outTokens) {
    this.src = src;
    this.env = env;
    this.md = md;
    this.tokens = outTokens;
    this.tokens_meta = Array(outTokens.length);
    this.pos = 0;
    this.posMax = this.src.length;
    this.level = 0;
    this.pending = "";
    this.pendingLevel = 0;
    // Stores { start: end } pairs. Useful for backtrack
    // optimization of pairs parse (emphasis, strikes).
    this.cache = {};
    // List of emphasis-like delimiters for current tag
    this.delimiters = [];
    // Stack of delimiter lists for upper level tags
    this._prev_delimiters = [];
    // backtick length => last seen position
    this.backticks = {};
    this.backticksScanned = false;
    // Counter used to disable inline linkify-it execution
    // inside <a> and markdown links
    this.linkLevel = 0;
}
// Flush pending text
//
$5629a940567b13a6$var$StateInline.prototype.pushPending = function() {
    var token = new $em0se("text", "", 0);
    token.content = this.pending;
    token.level = this.pendingLevel;
    this.tokens.push(token);
    this.pending = "";
    return token;
};
// Push new token to "stream".
// If pending text exists - flush it as text token
//
$5629a940567b13a6$var$StateInline.prototype.push = function(type, tag, nesting) {
    if (this.pending) this.pushPending();
    var token = new $em0se(type, tag, nesting);
    var token_meta = null;
    if (nesting < 0) {
        // closing tag
        this.level--;
        this.delimiters = this._prev_delimiters.pop();
    }
    token.level = this.level;
    if (nesting > 0) {
        // opening tag
        this.level++;
        this._prev_delimiters.push(this.delimiters);
        this.delimiters = [];
        token_meta = {
            delimiters: this.delimiters
        };
    }
    this.pendingLevel = this.level;
    this.tokens.push(token);
    this.tokens_meta.push(token_meta);
    return token;
};
// Scan a sequence of emphasis-like markers, and determine whether
// it can start an emphasis sequence or end an emphasis sequence.
//
//  - start - position to scan from (it should point at a valid marker);
//  - canSplitWord - determine if these markers can be found inside a word
//
$5629a940567b13a6$var$StateInline.prototype.scanDelims = function(start, canSplitWord) {
    var pos = start, lastChar, nextChar, count, can_open, can_close, isLastWhiteSpace, isLastPunctChar, isNextWhiteSpace, isNextPunctChar, left_flanking = true, right_flanking = true, max = this.posMax, marker = this.src.charCodeAt(start);
    // treat beginning of the line as a whitespace
    lastChar = start > 0 ? this.src.charCodeAt(start - 1) : 0x20;
    while(pos < max && this.src.charCodeAt(pos) === marker)pos++;
    count = pos - start;
    // treat end of the line as a whitespace
    nextChar = pos < max ? this.src.charCodeAt(pos) : 0x20;
    isLastPunctChar = $5629a940567b13a6$require$isMdAsciiPunct(lastChar) || $5629a940567b13a6$require$isPunctChar(String.fromCharCode(lastChar));
    isNextPunctChar = $5629a940567b13a6$require$isMdAsciiPunct(nextChar) || $5629a940567b13a6$require$isPunctChar(String.fromCharCode(nextChar));
    isLastWhiteSpace = $5629a940567b13a6$require$isWhiteSpace(lastChar);
    isNextWhiteSpace = $5629a940567b13a6$require$isWhiteSpace(nextChar);
    if (isNextWhiteSpace) left_flanking = false;
    else if (isNextPunctChar) {
        if (!(isLastWhiteSpace || isLastPunctChar)) left_flanking = false;
    }
    if (isLastWhiteSpace) right_flanking = false;
    else if (isLastPunctChar) {
        if (!(isNextWhiteSpace || isNextPunctChar)) right_flanking = false;
    }
    if (!canSplitWord) {
        can_open = left_flanking && (!right_flanking || isLastPunctChar);
        can_close = right_flanking && (!left_flanking || isNextPunctChar);
    } else {
        can_open = left_flanking;
        can_close = right_flanking;
    }
    return {
        can_open: can_open,
        can_close: can_close,
        length: count
    };
};
// re-export Token class to use in block rules
$5629a940567b13a6$var$StateInline.prototype.Token = $em0se;
module.exports = $5629a940567b13a6$var$StateInline;

});


parcelRequire.register("7wovu", function(module, exports) {
"use strict";
////////////////////////////////////////////////////////////////////////////////
// Helpers
// Merge objects
//
function $579e8823f68e2fa7$var$assign(obj /*from1, from2, from3, ...*/ ) {
    var sources = Array.prototype.slice.call(arguments, 1);
    sources.forEach(function(source) {
        if (!source) return;
        Object.keys(source).forEach(function(key) {
            obj[key] = source[key];
        });
    });
    return obj;
}
function $579e8823f68e2fa7$var$_class(obj) {
    return Object.prototype.toString.call(obj);
}
function $579e8823f68e2fa7$var$isString(obj) {
    return $579e8823f68e2fa7$var$_class(obj) === "[object String]";
}
function $579e8823f68e2fa7$var$isObject(obj) {
    return $579e8823f68e2fa7$var$_class(obj) === "[object Object]";
}
function $579e8823f68e2fa7$var$isRegExp(obj) {
    return $579e8823f68e2fa7$var$_class(obj) === "[object RegExp]";
}
function $579e8823f68e2fa7$var$isFunction(obj) {
    return $579e8823f68e2fa7$var$_class(obj) === "[object Function]";
}
function $579e8823f68e2fa7$var$escapeRE(str) {
    return str.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
}
////////////////////////////////////////////////////////////////////////////////
var $579e8823f68e2fa7$var$defaultOptions = {
    fuzzyLink: true,
    fuzzyEmail: true,
    fuzzyIP: false
};
function $579e8823f68e2fa7$var$isOptionsObj(obj) {
    return Object.keys(obj || {}).reduce(function(acc, k) {
        return acc || $579e8823f68e2fa7$var$defaultOptions.hasOwnProperty(k);
    }, false);
}
var $579e8823f68e2fa7$var$defaultSchemas = {
    "http:": {
        validate: function(text, pos, self) {
            var tail = text.slice(pos);
            if (!self.re.http) // compile lazily, because "host"-containing variables can change on tlds update.
            self.re.http = new RegExp("^\\/\\/" + self.re.src_auth + self.re.src_host_port_strict + self.re.src_path, "i");
            if (self.re.http.test(tail)) return tail.match(self.re.http)[0].length;
            return 0;
        }
    },
    "https:": "http:",
    "ftp:": "http:",
    "//": {
        validate: function(text, pos, self) {
            var tail = text.slice(pos);
            if (!self.re.no_http) // compile lazily, because "host"-containing variables can change on tlds update.
            self.re.no_http = new RegExp("^" + self.re.src_auth + // Don't allow single-level domains, because of false positives like '//test'
            // with code comments
            "(?:localhost|(?:(?:" + self.re.src_domain + ")\\.)+" + self.re.src_domain_root + ")" + self.re.src_port + self.re.src_host_terminator + self.re.src_path, "i");
            if (self.re.no_http.test(tail)) {
                // should not be `://` & `///`, that protects from errors in protocol name
                if (pos >= 3 && text[pos - 3] === ":") return 0;
                if (pos >= 3 && text[pos - 3] === "/") return 0;
                return tail.match(self.re.no_http)[0].length;
            }
            return 0;
        }
    },
    "mailto:": {
        validate: function(text, pos, self) {
            var tail = text.slice(pos);
            if (!self.re.mailto) self.re.mailto = new RegExp("^" + self.re.src_email_name + "@" + self.re.src_host_strict, "i");
            if (self.re.mailto.test(tail)) return tail.match(self.re.mailto)[0].length;
            return 0;
        }
    }
};
/*eslint-disable max-len*/ // RE pattern for 2-character tlds (autogenerated by ./support/tlds_2char_gen.js)
var $579e8823f68e2fa7$var$tlds_2ch_src_re = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]";
// DON'T try to make PRs with changes. Extend TLDs with LinkifyIt.tlds() instead
var $579e8823f68e2fa7$var$tlds_default = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split("|");
/*eslint-enable max-len*/ ////////////////////////////////////////////////////////////////////////////////
function $579e8823f68e2fa7$var$resetScanCache(self) {
    self.__index__ = -1;
    self.__text_cache__ = "";
}
function $579e8823f68e2fa7$var$createValidator(re) {
    return function(text, pos) {
        var tail = text.slice(pos);
        if (re.test(tail)) return tail.match(re)[0].length;
        return 0;
    };
}
function $579e8823f68e2fa7$var$createNormalizer() {
    return function(match, self) {
        self.normalize(match);
    };
}

// Schemas compiler. Build regexps.
//
function $579e8823f68e2fa7$var$compile(self) {
    // Load & clone RE patterns.
    var re = self.re = (parcelRequire("gI6Mm"))(self.__opts__);
    // Define dynamic patterns
    var tlds = self.__tlds__.slice();
    self.onCompile();
    if (!self.__tlds_replaced__) tlds.push($579e8823f68e2fa7$var$tlds_2ch_src_re);
    tlds.push(re.src_xn);
    re.src_tlds = tlds.join("|");
    function untpl(tpl) {
        return tpl.replace("%TLDS%", re.src_tlds);
    }
    re.email_fuzzy = RegExp(untpl(re.tpl_email_fuzzy), "i");
    re.link_fuzzy = RegExp(untpl(re.tpl_link_fuzzy), "i");
    re.link_no_ip_fuzzy = RegExp(untpl(re.tpl_link_no_ip_fuzzy), "i");
    re.host_fuzzy_test = RegExp(untpl(re.tpl_host_fuzzy_test), "i");
    //
    // Compile each schema
    //
    var aliases = [];
    self.__compiled__ = {}; // Reset compiled data
    function schemaError(name, val) {
        throw new Error('(LinkifyIt) Invalid schema "' + name + '": ' + val);
    }
    Object.keys(self.__schemas__).forEach(function(name) {
        var val = self.__schemas__[name];
        // skip disabled methods
        if (val === null) return;
        var compiled = {
            validate: null,
            link: null
        };
        self.__compiled__[name] = compiled;
        if ($579e8823f68e2fa7$var$isObject(val)) {
            if ($579e8823f68e2fa7$var$isRegExp(val.validate)) compiled.validate = $579e8823f68e2fa7$var$createValidator(val.validate);
            else if ($579e8823f68e2fa7$var$isFunction(val.validate)) compiled.validate = val.validate;
            else schemaError(name, val);
            if ($579e8823f68e2fa7$var$isFunction(val.normalize)) compiled.normalize = val.normalize;
            else if (!val.normalize) compiled.normalize = $579e8823f68e2fa7$var$createNormalizer();
            else schemaError(name, val);
            return;
        }
        if ($579e8823f68e2fa7$var$isString(val)) {
            aliases.push(name);
            return;
        }
        schemaError(name, val);
    });
    //
    // Compile postponed aliases
    //
    aliases.forEach(function(alias) {
        if (!self.__compiled__[self.__schemas__[alias]]) // Silently fail on missed schemas to avoid errons on disable.
        // schemaError(alias, self.__schemas__[alias]);
        return;
        self.__compiled__[alias].validate = self.__compiled__[self.__schemas__[alias]].validate;
        self.__compiled__[alias].normalize = self.__compiled__[self.__schemas__[alias]].normalize;
    });
    //
    // Fake record for guessed links
    //
    self.__compiled__[""] = {
        validate: null,
        normalize: $579e8823f68e2fa7$var$createNormalizer()
    };
    //
    // Build schema condition
    //
    var slist = Object.keys(self.__compiled__).filter(function(name) {
        // Filter disabled & fake schemas
        return name.length > 0 && self.__compiled__[name];
    }).map($579e8823f68e2fa7$var$escapeRE).join("|");
    // (?!_) cause 1.5x slowdown
    self.re.schema_test = RegExp("(^|(?!_)(?:[><｜]|" + re.src_ZPCc + "))(" + slist + ")", "i");
    self.re.schema_search = RegExp("(^|(?!_)(?:[><｜]|" + re.src_ZPCc + "))(" + slist + ")", "ig");
    self.re.schema_at_start = RegExp("^" + self.re.schema_search.source, "i");
    self.re.pretest = RegExp("(" + self.re.schema_test.source + ")|(" + self.re.host_fuzzy_test.source + ")|@", "i");
    //
    // Cleanup
    //
    $579e8823f68e2fa7$var$resetScanCache(self);
}
/**
 * class Match
 *
 * Match result. Single element of array, returned by [[LinkifyIt#match]]
 **/ function $579e8823f68e2fa7$var$Match(self, shift) {
    var start = self.__index__, end = self.__last_index__, text = self.__text_cache__.slice(start, end);
    /**
   * Match#schema -> String
   *
   * Prefix (protocol) for matched string.
   **/ this.schema = self.__schema__.toLowerCase();
    /**
   * Match#index -> Number
   *
   * First position of matched string.
   **/ this.index = start + shift;
    /**
   * Match#lastIndex -> Number
   *
   * Next position after matched string.
   **/ this.lastIndex = end + shift;
    /**
   * Match#raw -> String
   *
   * Matched string.
   **/ this.raw = text;
    /**
   * Match#text -> String
   *
   * Notmalized text of matched string.
   **/ this.text = text;
    /**
   * Match#url -> String
   *
   * Normalized url of matched string.
   **/ this.url = text;
}
function $579e8823f68e2fa7$var$createMatch(self, shift) {
    var match = new $579e8823f68e2fa7$var$Match(self, shift);
    self.__compiled__[match.schema].normalize(match, self);
    return match;
}
/**
 * class LinkifyIt
 **/ /**
 * new LinkifyIt(schemas, options)
 * - schemas (Object): Optional. Additional schemas to validate (prefix/validator)
 * - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
 *
 * Creates new linkifier instance with optional additional schemas.
 * Can be called without `new` keyword for convenience.
 *
 * By default understands:
 *
 * - `http(s)://...` , `ftp://...`, `mailto:...` & `//...` links
 * - "fuzzy" links and emails (example.com, foo@bar.com).
 *
 * `schemas` is an object, where each key/value describes protocol/rule:
 *
 * - __key__ - link prefix (usually, protocol name with `:` at the end, `skype:`
 *   for example). `linkify-it` makes shure that prefix is not preceeded with
 *   alphanumeric char and symbols. Only whitespaces and punctuation allowed.
 * - __value__ - rule to check tail after link prefix
 *   - _String_ - just alias to existing rule
 *   - _Object_
 *     - _validate_ - validator function (should return matched length on success),
 *       or `RegExp`.
 *     - _normalize_ - optional function to normalize text & url of matched result
 *       (for example, for @twitter mentions).
 *
 * `options`:
 *
 * - __fuzzyLink__ - recognige URL-s without `http(s):` prefix. Default `true`.
 * - __fuzzyIP__ - allow IPs in fuzzy links above. Can conflict with some texts
 *   like version numbers. Default `false`.
 * - __fuzzyEmail__ - recognize emails without `mailto:` prefix.
 *
 **/ function $579e8823f68e2fa7$var$LinkifyIt(schemas, options) {
    if (!(this instanceof $579e8823f68e2fa7$var$LinkifyIt)) return new $579e8823f68e2fa7$var$LinkifyIt(schemas, options);
    if (!options) {
        if ($579e8823f68e2fa7$var$isOptionsObj(schemas)) {
            options = schemas;
            schemas = {};
        }
    }
    this.__opts__ = $579e8823f68e2fa7$var$assign({}, $579e8823f68e2fa7$var$defaultOptions, options);
    // Cache last tested result. Used to skip repeating steps on next `match` call.
    this.__index__ = -1;
    this.__last_index__ = -1; // Next scan position
    this.__schema__ = "";
    this.__text_cache__ = "";
    this.__schemas__ = $579e8823f68e2fa7$var$assign({}, $579e8823f68e2fa7$var$defaultSchemas, schemas);
    this.__compiled__ = {};
    this.__tlds__ = $579e8823f68e2fa7$var$tlds_default;
    this.__tlds_replaced__ = false;
    this.re = {};
    $579e8823f68e2fa7$var$compile(this);
}
/** chainable
 * LinkifyIt#add(schema, definition)
 * - schema (String): rule name (fixed pattern prefix)
 * - definition (String|RegExp|Object): schema definition
 *
 * Add new rule definition. See constructor description for details.
 **/ $579e8823f68e2fa7$var$LinkifyIt.prototype.add = function add(schema, definition) {
    this.__schemas__[schema] = definition;
    $579e8823f68e2fa7$var$compile(this);
    return this;
};
/** chainable
 * LinkifyIt#set(options)
 * - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
 *
 * Set recognition options for links without schema.
 **/ $579e8823f68e2fa7$var$LinkifyIt.prototype.set = function set(options) {
    this.__opts__ = $579e8823f68e2fa7$var$assign(this.__opts__, options);
    return this;
};
/**
 * LinkifyIt#test(text) -> Boolean
 *
 * Searches linkifiable pattern and returns `true` on success or `false` on fail.
 **/ $579e8823f68e2fa7$var$LinkifyIt.prototype.test = function test(text) {
    // Reset scan cache
    this.__text_cache__ = text;
    this.__index__ = -1;
    if (!text.length) return false;
    var m, ml, me, len, shift, next, re, tld_pos, at_pos;
    // try to scan for link with schema - that's the most simple rule
    if (this.re.schema_test.test(text)) {
        re = this.re.schema_search;
        re.lastIndex = 0;
        while((m = re.exec(text)) !== null){
            len = this.testSchemaAt(text, m[2], re.lastIndex);
            if (len) {
                this.__schema__ = m[2];
                this.__index__ = m.index + m[1].length;
                this.__last_index__ = m.index + m[0].length + len;
                break;
            }
        }
    }
    if (this.__opts__.fuzzyLink && this.__compiled__["http:"]) {
        // guess schemaless links
        tld_pos = text.search(this.re.host_fuzzy_test);
        if (tld_pos >= 0) {
            // if tld is located after found link - no need to check fuzzy pattern
            if (this.__index__ < 0 || tld_pos < this.__index__) {
                if ((ml = text.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null) {
                    shift = ml.index + ml[1].length;
                    if (this.__index__ < 0 || shift < this.__index__) {
                        this.__schema__ = "";
                        this.__index__ = shift;
                        this.__last_index__ = ml.index + ml[0].length;
                    }
                }
            }
        }
    }
    if (this.__opts__.fuzzyEmail && this.__compiled__["mailto:"]) {
        // guess schemaless emails
        at_pos = text.indexOf("@");
        if (at_pos >= 0) // We can't skip this check, because this cases are possible:
        // 192.168.1.1@gmail.com, my.in@example.com
        {
            if ((me = text.match(this.re.email_fuzzy)) !== null) {
                shift = me.index + me[1].length;
                next = me.index + me[0].length;
                if (this.__index__ < 0 || shift < this.__index__ || shift === this.__index__ && next > this.__last_index__) {
                    this.__schema__ = "mailto:";
                    this.__index__ = shift;
                    this.__last_index__ = next;
                }
            }
        }
    }
    return this.__index__ >= 0;
};
/**
 * LinkifyIt#pretest(text) -> Boolean
 *
 * Very quick check, that can give false positives. Returns true if link MAY BE
 * can exists. Can be used for speed optimization, when you need to check that
 * link NOT exists.
 **/ $579e8823f68e2fa7$var$LinkifyIt.prototype.pretest = function pretest(text) {
    return this.re.pretest.test(text);
};
/**
 * LinkifyIt#testSchemaAt(text, name, position) -> Number
 * - text (String): text to scan
 * - name (String): rule (schema) name
 * - position (Number): text offset to check from
 *
 * Similar to [[LinkifyIt#test]] but checks only specific protocol tail exactly
 * at given position. Returns length of found pattern (0 on fail).
 **/ $579e8823f68e2fa7$var$LinkifyIt.prototype.testSchemaAt = function testSchemaAt(text, schema, pos) {
    // If not supported schema check requested - terminate
    if (!this.__compiled__[schema.toLowerCase()]) return 0;
    return this.__compiled__[schema.toLowerCase()].validate(text, pos, this);
};
/**
 * LinkifyIt#match(text) -> Array|null
 *
 * Returns array of found link descriptions or `null` on fail. We strongly
 * recommend to use [[LinkifyIt#test]] first, for best speed.
 *
 * ##### Result match description
 *
 * - __schema__ - link schema, can be empty for fuzzy links, or `//` for
 *   protocol-neutral  links.
 * - __index__ - offset of matched text
 * - __lastIndex__ - index of next char after mathch end
 * - __raw__ - matched text
 * - __text__ - normalized text
 * - __url__ - link, generated from matched text
 **/ $579e8823f68e2fa7$var$LinkifyIt.prototype.match = function match(text) {
    var shift = 0, result = [];
    // Try to take previous element from cache, if .test() called before
    if (this.__index__ >= 0 && this.__text_cache__ === text) {
        result.push($579e8823f68e2fa7$var$createMatch(this, shift));
        shift = this.__last_index__;
    }
    // Cut head if cache was used
    var tail = shift ? text.slice(shift) : text;
    // Scan string until end reached
    while(this.test(tail)){
        result.push($579e8823f68e2fa7$var$createMatch(this, shift));
        tail = tail.slice(this.__last_index__);
        shift += this.__last_index__;
    }
    if (result.length) return result;
    return null;
};
/**
 * LinkifyIt#matchAtStart(text) -> Match|null
 *
 * Returns fully-formed (not fuzzy) link if it starts at the beginning
 * of the string, and null otherwise.
 **/ $579e8823f68e2fa7$var$LinkifyIt.prototype.matchAtStart = function matchAtStart(text) {
    // Reset scan cache
    this.__text_cache__ = text;
    this.__index__ = -1;
    if (!text.length) return null;
    var m = this.re.schema_at_start.exec(text);
    if (!m) return null;
    var len = this.testSchemaAt(text, m[2], m[0].length);
    if (!len) return null;
    this.__schema__ = m[2];
    this.__index__ = m.index + m[1].length;
    this.__last_index__ = m.index + m[0].length + len;
    return $579e8823f68e2fa7$var$createMatch(this, 0);
};
/** chainable
 * LinkifyIt#tlds(list [, keepOld]) -> this
 * - list (Array): list of tlds
 * - keepOld (Boolean): merge with current list if `true` (`false` by default)
 *
 * Load (or merge) new tlds list. Those are user for fuzzy links (without prefix)
 * to avoid false positives. By default this algorythm used:
 *
 * - hostname with any 2-letter root zones are ok.
 * - biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф
 *   are ok.
 * - encoded (`xn--...`) root zones are ok.
 *
 * If list is replaced, then exact match for 2-chars root zones will be checked.
 **/ $579e8823f68e2fa7$var$LinkifyIt.prototype.tlds = function tlds(list, keepOld) {
    list = Array.isArray(list) ? list : [
        list
    ];
    if (!keepOld) {
        this.__tlds__ = list.slice();
        this.__tlds_replaced__ = true;
        $579e8823f68e2fa7$var$compile(this);
        return this;
    }
    this.__tlds__ = this.__tlds__.concat(list).sort().filter(function(el, idx, arr) {
        return el !== arr[idx - 1];
    }).reverse();
    $579e8823f68e2fa7$var$compile(this);
    return this;
};
/**
 * LinkifyIt#normalize(match)
 *
 * Default normalizer (if schema does not define it's own).
 **/ $579e8823f68e2fa7$var$LinkifyIt.prototype.normalize = function normalize(match) {
    // Do minimal possible changes by default. Need to collect feedback prior
    // to move forward https://github.com/markdown-it/linkify-it/issues/1
    if (!match.schema) match.url = "http://" + match.url;
    if (match.schema === "mailto:" && !/^mailto:/i.test(match.url)) match.url = "mailto:" + match.url;
};
/**
 * LinkifyIt#onCompile()
 *
 * Override to modify basic RegExp-s.
 **/ $579e8823f68e2fa7$var$LinkifyIt.prototype.onCompile = function onCompile() {};
module.exports = $579e8823f68e2fa7$var$LinkifyIt;

});
parcelRequire.register("gI6Mm", function(module, exports) {
"use strict";




module.exports = function(opts) {
    var re = {};
    opts = opts || {};
    // Use direct extract instead of `regenerate` to reduse browserified size
    re.src_Any = (parcelRequire("6j9ic")).source;
    re.src_Cc = (parcelRequire("4PxzG")).source;
    re.src_Z = (parcelRequire("hZTKe")).source;
    re.src_P = (parcelRequire("27rhI")).source;
    // \p{\Z\P\Cc\CF} (white spaces + control + format + punctuation)
    re.src_ZPCc = [
        re.src_Z,
        re.src_P,
        re.src_Cc
    ].join("|");
    // \p{\Z\Cc} (white spaces + control)
    re.src_ZCc = [
        re.src_Z,
        re.src_Cc
    ].join("|");
    // Experimental. List of chars, completely prohibited in links
    // because can separate it from other part of text
    var text_separators = "[><｜]";
    // All possible word characters (everything without punctuation, spaces & controls)
    // Defined via punctuation & spaces to save space
    // Should be something like \p{\L\N\S\M} (\w but without `_`)
    re.src_pseudo_letter = "(?:(?!" + text_separators + "|" + re.src_ZPCc + ")" + re.src_Any + ")";
    // The same as abothe but without [0-9]
    // var src_pseudo_letter_non_d = '(?:(?![0-9]|' + src_ZPCc + ')' + src_Any + ')';
    ////////////////////////////////////////////////////////////////////////////////
    re.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
    // Prohibit any of "@/[]()" in user/pass to avoid wrong domain fetch.
    re.src_auth = "(?:(?:(?!" + re.src_ZCc + "|[@/\\[\\]()]).)+@)?";
    re.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?";
    re.src_host_terminator = "(?=$|" + text_separators + "|" + re.src_ZPCc + ")" + "(?!" + (opts["---"] ? "-(?!--)|" : "-|") + "_|:\\d|\\.-|\\.(?!$|" + re.src_ZPCc + "))";
    re.src_path = "(?:[/?#](?:(?!" + re.src_ZCc + "|" + text_separators + "|[()[\\]{}.,\"'?!\\-;]).|" + "\\[(?:(?!" + re.src_ZCc + "|\\]).)*\\]|" + "\\((?:(?!" + re.src_ZCc + "|[)]).)*\\)|" + "\\{(?:(?!" + re.src_ZCc + "|[}]).)*\\}|" + '\\"(?:(?!' + re.src_ZCc + '|["]).)+\\"|' + "\\'(?:(?!" + re.src_ZCc + "|[']).)+\\'|" + "\\'(?=" + re.src_pseudo_letter + "|[-])|" + // allow `I'm_king` if no pair found
    "\\.{2,}[a-zA-Z0-9%/&]|" + // google has many dots in "google search" links (#66, #81).
    // github has ... in commit range links,
    // Restrict to
    // - english
    // - percent-encoded
    // - parts of file path
    // - params separator
    // until more examples found.
    "\\.(?!" + re.src_ZCc + "|[.]|$)|" + (opts["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" // `---` => long dash, terminate
     : "\\-+|") + ",(?!" + re.src_ZCc + "|$)|" + // allow `,,,` in paths
    ";(?!" + re.src_ZCc + "|$)|" + // allow `;` if not followed by space-like char
    "\\!+(?!" + re.src_ZCc + "|[!]|$)|" + // allow `!!!` in paths, but not at the end
    "\\?(?!" + re.src_ZCc + "|[?]|$)" + ")+" + "|\\/" + ")?";
    // Allow anything in markdown spec, forbid quote (") at the first position
    // because emails enclosed in quotes are far more common
    re.src_email_name = '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]*';
    re.src_xn = "xn--[a-z0-9\\-]{1,59}";
    // More to read about domain names
    // http://serverfault.com/questions/638260/
    re.src_domain_root = // Allow letters & digits (http://test1)
    "(?:" + re.src_xn + "|" + re.src_pseudo_letter + "{1,63}" + ")";
    re.src_domain = "(?:" + re.src_xn + "|" + "(?:" + re.src_pseudo_letter + ")" + "|" + "(?:" + re.src_pseudo_letter + "(?:-|" + re.src_pseudo_letter + "){0,61}" + re.src_pseudo_letter + ")" + ")";
    re.src_host = "(?:(?:(?:(?:" + re.src_domain + ")\\.)*" + re.src_domain /*_root*/  + ")" + ")";
    re.tpl_host_fuzzy = "(?:" + re.src_ip4 + "|" + "(?:(?:(?:" + re.src_domain + ")\\.)+(?:%TLDS%))" + ")";
    re.tpl_host_no_ip_fuzzy = "(?:(?:(?:" + re.src_domain + ")\\.)+(?:%TLDS%))";
    re.src_host_strict = re.src_host + re.src_host_terminator;
    re.tpl_host_fuzzy_strict = re.tpl_host_fuzzy + re.src_host_terminator;
    re.src_host_port_strict = re.src_host + re.src_port + re.src_host_terminator;
    re.tpl_host_port_fuzzy_strict = re.tpl_host_fuzzy + re.src_port + re.src_host_terminator;
    re.tpl_host_port_no_ip_fuzzy_strict = re.tpl_host_no_ip_fuzzy + re.src_port + re.src_host_terminator;
    ////////////////////////////////////////////////////////////////////////////////
    // Main rules
    // Rude test fuzzy links by host, for quick deny
    re.tpl_host_fuzzy_test = "localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:" + re.src_ZPCc + "|>|$))";
    re.tpl_email_fuzzy = "(^|" + text_separators + '|"|\\(|' + re.src_ZCc + ")" + "(" + re.src_email_name + "@" + re.tpl_host_fuzzy_strict + ")";
    re.tpl_link_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
    // but can start with > (markdown blockquote)
    "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + re.src_ZPCc + "))" + "((?![$+<=>^`|｜])" + re.tpl_host_port_fuzzy_strict + re.src_path + ")";
    re.tpl_link_no_ip_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
    // but can start with > (markdown blockquote)
    "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + re.src_ZPCc + "))" + "((?![$+<=>^`|｜])" + re.tpl_host_port_no_ip_fuzzy_strict + re.src_path + ")";
    return re;
};

});


parcelRequire.register("d17il", function(module, exports) {
// markdown-it default options
"use strict";
module.exports = {
    options: {
        html: false,
        xhtmlOut: false,
        breaks: false,
        langPrefix: "language-",
        linkify: false,
        // Enable some language-neutral replacements + quotes beautification
        typographer: false,
        // Double + single quotes replacement pairs, when typographer enabled,
        // and smartquotes on. Could be either a String or an Array.
        //
        // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
        // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
        quotes: "“”‘’",
        /* “”‘’ */ // Highlighter function. Should return escaped HTML,
        // or '' if the source string is not changed and should be escaped externaly.
        // If result starts with <pre... internal wrapper is skipped.
        //
        // function (/*str, lang*/) { return ''; }
        //
        highlight: null,
        maxNesting: 100 // Internal protection, recursion limit
    },
    components: {
        core: {},
        block: {},
        inline: {}
    }
};

});

parcelRequire.register("6sMp4", function(module, exports) {
// "Zero" preset, with nothing enabled. Useful for manual configuring of simple
// modes. For example, to parse bold/italic only.
"use strict";
module.exports = {
    options: {
        html: false,
        xhtmlOut: false,
        breaks: false,
        langPrefix: "language-",
        linkify: false,
        // Enable some language-neutral replacements + quotes beautification
        typographer: false,
        // Double + single quotes replacement pairs, when typographer enabled,
        // and smartquotes on. Could be either a String or an Array.
        //
        // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
        // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
        quotes: "“”‘’",
        /* “”‘’ */ // Highlighter function. Should return escaped HTML,
        // or '' if the source string is not changed and should be escaped externaly.
        // If result starts with <pre... internal wrapper is skipped.
        //
        // function (/*str, lang*/) { return ''; }
        //
        highlight: null,
        maxNesting: 20 // Internal protection, recursion limit
    },
    components: {
        core: {
            rules: [
                "normalize",
                "block",
                "inline",
                "text_join"
            ]
        },
        block: {
            rules: [
                "paragraph"
            ]
        },
        inline: {
            rules: [
                "text"
            ],
            rules2: [
                "balance_pairs",
                "fragments_join"
            ]
        }
    }
};

});

parcelRequire.register("5xT2R", function(module, exports) {
// Commonmark default options
"use strict";
module.exports = {
    options: {
        html: true,
        xhtmlOut: true,
        breaks: false,
        langPrefix: "language-",
        linkify: false,
        // Enable some language-neutral replacements + quotes beautification
        typographer: false,
        // Double + single quotes replacement pairs, when typographer enabled,
        // and smartquotes on. Could be either a String or an Array.
        //
        // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
        // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
        quotes: "“”‘’",
        /* “”‘’ */ // Highlighter function. Should return escaped HTML,
        // or '' if the source string is not changed and should be escaped externaly.
        // If result starts with <pre... internal wrapper is skipped.
        //
        // function (/*str, lang*/) { return ''; }
        //
        highlight: null,
        maxNesting: 20 // Internal protection, recursion limit
    },
    components: {
        core: {
            rules: [
                "normalize",
                "block",
                "inline",
                "text_join"
            ]
        },
        block: {
            rules: [
                "blockquote",
                "code",
                "fence",
                "heading",
                "hr",
                "html_block",
                "lheading",
                "list",
                "reference",
                "paragraph"
            ]
        },
        inline: {
            rules: [
                "autolink",
                "backticks",
                "emphasis",
                "entity",
                "escape",
                "html_inline",
                "image",
                "link",
                "newline",
                "text"
            ],
            rules2: [
                "balance_pairs",
                "emphasis",
                "fragments_join"
            ]
        }
    }
};

});


// ::- Persistent data structure representing an ordered mapping from
// strings to values, with some convenient update methods.
function $0280b3059275f48f$var$OrderedMap(content) {
    this.content = content;
}
$0280b3059275f48f$var$OrderedMap.prototype = {
    constructor: $0280b3059275f48f$var$OrderedMap,
    find: function(key) {
        for(var i = 0; i < this.content.length; i += 2)if (this.content[i] === key) return i;
        return -1;
    },
    // :: (string) → ?any
    // Retrieve the value stored under `key`, or return undefined when
    // no such key exists.
    get: function(key) {
        var found = this.find(key);
        return found == -1 ? undefined : this.content[found + 1];
    },
    // :: (string, any, ?string) → OrderedMap
    // Create a new map by replacing the value of `key` with a new
    // value, or adding a binding to the end of the map. If `newKey` is
    // given, the key of the binding will be replaced with that key.
    update: function(key, value, newKey) {
        var self = newKey && newKey != key ? this.remove(newKey) : this;
        var found = self.find(key), content = self.content.slice();
        if (found == -1) content.push(newKey || key, value);
        else {
            content[found + 1] = value;
            if (newKey) content[found] = newKey;
        }
        return new $0280b3059275f48f$var$OrderedMap(content);
    },
    // :: (string) → OrderedMap
    // Return a map with the given key removed, if it existed.
    remove: function(key) {
        var found = this.find(key);
        if (found == -1) return this;
        var content = this.content.slice();
        content.splice(found, 2);
        return new $0280b3059275f48f$var$OrderedMap(content);
    },
    // :: (string, any) → OrderedMap
    // Add a new key to the start of the map.
    addToStart: function(key, value) {
        return new $0280b3059275f48f$var$OrderedMap([
            key,
            value
        ].concat(this.remove(key).content));
    },
    // :: (string, any) → OrderedMap
    // Add a new key to the end of the map.
    addToEnd: function(key, value) {
        var content = this.remove(key).content.slice();
        content.push(key, value);
        return new $0280b3059275f48f$var$OrderedMap(content);
    },
    // :: (string, string, any) → OrderedMap
    // Add a key after the given key. If `place` is not found, the new
    // key is added to the end.
    addBefore: function(place, key, value) {
        var without = this.remove(key), content = without.content.slice();
        var found = without.find(place);
        content.splice(found == -1 ? content.length : found, 0, key, value);
        return new $0280b3059275f48f$var$OrderedMap(content);
    },
    // :: ((key: string, value: any))
    // Call the given function for each key/value pair in the map, in
    // order.
    forEach: function(f) {
        for(var i = 0; i < this.content.length; i += 2)f(this.content[i], this.content[i + 1]);
    },
    // :: (union<Object, OrderedMap>) → OrderedMap
    // Create a new map by prepending the keys in this map that don't
    // appear in `map` before the keys in `map`.
    prepend: function(map) {
        map = $0280b3059275f48f$var$OrderedMap.from(map);
        if (!map.size) return this;
        return new $0280b3059275f48f$var$OrderedMap(map.content.concat(this.subtract(map).content));
    },
    // :: (union<Object, OrderedMap>) → OrderedMap
    // Create a new map by appending the keys in this map that don't
    // appear in `map` after the keys in `map`.
    append: function(map) {
        map = $0280b3059275f48f$var$OrderedMap.from(map);
        if (!map.size) return this;
        return new $0280b3059275f48f$var$OrderedMap(this.subtract(map).content.concat(map.content));
    },
    // :: (union<Object, OrderedMap>) → OrderedMap
    // Create a map containing all the keys in this map that don't
    // appear in `map`.
    subtract: function(map) {
        var result = this;
        map = $0280b3059275f48f$var$OrderedMap.from(map);
        for(var i = 0; i < map.content.length; i += 2)result = result.remove(map.content[i]);
        return result;
    },
    // :: () → Object
    // Turn ordered map into a plain object.
    toObject: function() {
        var result = {};
        this.forEach(function(key, value) {
            result[key] = value;
        });
        return result;
    },
    // :: number
    // The amount of keys in this map.
    get size () {
        return this.content.length >> 1;
    }
};
// :: (?union<Object, OrderedMap>) → OrderedMap
// Return a map with the given content. If null, create an empty
// map. If given an ordered map, return that map itself. If given an
// object, create a map from the object's properties.
$0280b3059275f48f$var$OrderedMap.from = function(value) {
    if (value instanceof $0280b3059275f48f$var$OrderedMap) return value;
    var content = [];
    if (value) for(var prop in value)content.push(prop, value[prop]);
    return new $0280b3059275f48f$var$OrderedMap(content);
};
var $0280b3059275f48f$export$2e2bcd8739ae039 = $0280b3059275f48f$var$OrderedMap;


function $c8d507d90382f091$var$findDiffStart(a, b, pos) {
    for(let i = 0;; i++){
        if (i == a.childCount || i == b.childCount) return a.childCount == b.childCount ? null : pos;
        let childA = a.child(i), childB = b.child(i);
        if (childA == childB) {
            pos += childA.nodeSize;
            continue;
        }
        if (!childA.sameMarkup(childB)) return pos;
        if (childA.isText && childA.text != childB.text) {
            for(let j = 0; childA.text[j] == childB.text[j]; j++)pos++;
            return pos;
        }
        if (childA.content.size || childB.content.size) {
            let inner = $c8d507d90382f091$var$findDiffStart(childA.content, childB.content, pos + 1);
            if (inner != null) return inner;
        }
        pos += childA.nodeSize;
    }
}
function $c8d507d90382f091$var$findDiffEnd(a, b, posA, posB) {
    for(let iA = a.childCount, iB = b.childCount;;){
        if (iA == 0 || iB == 0) return iA == iB ? null : {
            a: posA,
            b: posB
        };
        let childA = a.child(--iA), childB = b.child(--iB), size = childA.nodeSize;
        if (childA == childB) {
            posA -= size;
            posB -= size;
            continue;
        }
        if (!childA.sameMarkup(childB)) return {
            a: posA,
            b: posB
        };
        if (childA.isText && childA.text != childB.text) {
            let same = 0, minSize = Math.min(childA.text.length, childB.text.length);
            while(same < minSize && childA.text[childA.text.length - same - 1] == childB.text[childB.text.length - same - 1]){
                same++;
                posA--;
                posB--;
            }
            return {
                a: posA,
                b: posB
            };
        }
        if (childA.content.size || childB.content.size) {
            let inner = $c8d507d90382f091$var$findDiffEnd(childA.content, childB.content, posA - 1, posB - 1);
            if (inner) return inner;
        }
        posA -= size;
        posB -= size;
    }
}
/**
A fragment represents a node's collection of child nodes.

Like nodes, fragments are persistent data structures, and you
should not mutate them or their content. Rather, you create new
instances whenever needed. The API tries to make this easy.
*/ class $c8d507d90382f091$export$ffb0004e005737fa {
    /**
    @internal
    */ constructor(/**
    @internal
    */ content, size){
        this.content = content;
        this.size = size || 0;
        if (size == null) for(let i = 0; i < content.length; i++)this.size += content[i].nodeSize;
    }
    /**
    Invoke a callback for all descendant nodes between the given two
    positions (relative to start of this fragment). Doesn't descend
    into a node when the callback returns `false`.
    */ nodesBetween(from, to, f, nodeStart = 0, parent) {
        for(let i = 0, pos = 0; pos < to; i++){
            let child = this.content[i], end = pos + child.nodeSize;
            if (end > from && f(child, nodeStart + pos, parent || null, i) !== false && child.content.size) {
                let start = pos + 1;
                child.nodesBetween(Math.max(0, from - start), Math.min(child.content.size, to - start), f, nodeStart + start);
            }
            pos = end;
        }
    }
    /**
    Call the given callback for every descendant node. `pos` will be
    relative to the start of the fragment. The callback may return
    `false` to prevent traversal of a given node's children.
    */ descendants(f) {
        this.nodesBetween(0, this.size, f);
    }
    /**
    Extract the text between `from` and `to`. See the same method on
    [`Node`](https://prosemirror.net/docs/ref/#model.Node.textBetween).
    */ textBetween(from, to, blockSeparator, leafText) {
        let text = "", separated = true;
        this.nodesBetween(from, to, (node, pos)=>{
            if (node.isText) {
                text += node.text.slice(Math.max(from, pos) - pos, to - pos);
                separated = !blockSeparator;
            } else if (node.isLeaf) {
                if (leafText) text += typeof leafText === "function" ? leafText(node) : leafText;
                else if (node.type.spec.leafText) text += node.type.spec.leafText(node);
                separated = !blockSeparator;
            } else if (!separated && node.isBlock) {
                text += blockSeparator;
                separated = true;
            }
        }, 0);
        return text;
    }
    /**
    Create a new fragment containing the combined content of this
    fragment and the other.
    */ append(other) {
        if (!other.size) return this;
        if (!this.size) return other;
        let last = this.lastChild, first = other.firstChild, content = this.content.slice(), i = 0;
        if (last.isText && last.sameMarkup(first)) {
            content[content.length - 1] = last.withText(last.text + first.text);
            i = 1;
        }
        for(; i < other.content.length; i++)content.push(other.content[i]);
        return new $c8d507d90382f091$export$ffb0004e005737fa(content, this.size + other.size);
    }
    /**
    Cut out the sub-fragment between the two given positions.
    */ cut(from, to = this.size) {
        if (from == 0 && to == this.size) return this;
        let result = [], size = 0;
        if (to > from) for(let i = 0, pos = 0; pos < to; i++){
            let child = this.content[i], end = pos + child.nodeSize;
            if (end > from) {
                if (pos < from || end > to) {
                    if (child.isText) child = child.cut(Math.max(0, from - pos), Math.min(child.text.length, to - pos));
                    else child = child.cut(Math.max(0, from - pos - 1), Math.min(child.content.size, to - pos - 1));
                }
                result.push(child);
                size += child.nodeSize;
            }
            pos = end;
        }
        return new $c8d507d90382f091$export$ffb0004e005737fa(result, size);
    }
    /**
    @internal
    */ cutByIndex(from, to) {
        if (from == to) return $c8d507d90382f091$export$ffb0004e005737fa.empty;
        if (from == 0 && to == this.content.length) return this;
        return new $c8d507d90382f091$export$ffb0004e005737fa(this.content.slice(from, to));
    }
    /**
    Create a new fragment in which the node at the given index is
    replaced by the given node.
    */ replaceChild(index, node) {
        let current = this.content[index];
        if (current == node) return this;
        let copy = this.content.slice();
        let size = this.size + node.nodeSize - current.nodeSize;
        copy[index] = node;
        return new $c8d507d90382f091$export$ffb0004e005737fa(copy, size);
    }
    /**
    Create a new fragment by prepending the given node to this
    fragment.
    */ addToStart(node) {
        return new $c8d507d90382f091$export$ffb0004e005737fa([
            node
        ].concat(this.content), this.size + node.nodeSize);
    }
    /**
    Create a new fragment by appending the given node to this
    fragment.
    */ addToEnd(node) {
        return new $c8d507d90382f091$export$ffb0004e005737fa(this.content.concat(node), this.size + node.nodeSize);
    }
    /**
    Compare this fragment to another one.
    */ eq(other) {
        if (this.content.length != other.content.length) return false;
        for(let i = 0; i < this.content.length; i++)if (!this.content[i].eq(other.content[i])) return false;
        return true;
    }
    /**
    The first child of the fragment, or `null` if it is empty.
    */ get firstChild() {
        return this.content.length ? this.content[0] : null;
    }
    /**
    The last child of the fragment, or `null` if it is empty.
    */ get lastChild() {
        return this.content.length ? this.content[this.content.length - 1] : null;
    }
    /**
    The number of child nodes in this fragment.
    */ get childCount() {
        return this.content.length;
    }
    /**
    Get the child node at the given index. Raise an error when the
    index is out of range.
    */ child(index) {
        let found = this.content[index];
        if (!found) throw new RangeError("Index " + index + " out of range for " + this);
        return found;
    }
    /**
    Get the child node at the given index, if it exists.
    */ maybeChild(index) {
        return this.content[index] || null;
    }
    /**
    Call `f` for every child node, passing the node, its offset
    into this parent node, and its index.
    */ forEach(f) {
        for(let i = 0, p = 0; i < this.content.length; i++){
            let child = this.content[i];
            f(child, p, i);
            p += child.nodeSize;
        }
    }
    /**
    Find the first position at which this fragment and another
    fragment differ, or `null` if they are the same.
    */ findDiffStart(other, pos = 0) {
        return $c8d507d90382f091$var$findDiffStart(this, other, pos);
    }
    /**
    Find the first position, searching from the end, at which this
    fragment and the given fragment differ, or `null` if they are
    the same. Since this position will not be the same in both
    nodes, an object with two separate positions is returned.
    */ findDiffEnd(other, pos = this.size, otherPos = other.size) {
        return $c8d507d90382f091$var$findDiffEnd(this, other, pos, otherPos);
    }
    /**
    Find the index and inner offset corresponding to a given relative
    position in this fragment. The result object will be reused
    (overwritten) the next time the function is called. (Not public.)
    */ findIndex(pos, round = -1) {
        if (pos == 0) return $c8d507d90382f091$var$retIndex(0, pos);
        if (pos == this.size) return $c8d507d90382f091$var$retIndex(this.content.length, pos);
        if (pos > this.size || pos < 0) throw new RangeError(`Position ${pos} outside of fragment (${this})`);
        for(let i = 0, curPos = 0;; i++){
            let cur = this.child(i), end = curPos + cur.nodeSize;
            if (end >= pos) {
                if (end == pos || round > 0) return $c8d507d90382f091$var$retIndex(i + 1, end);
                return $c8d507d90382f091$var$retIndex(i, curPos);
            }
            curPos = end;
        }
    }
    /**
    Return a debugging string that describes this fragment.
    */ toString() {
        return "<" + this.toStringInner() + ">";
    }
    /**
    @internal
    */ toStringInner() {
        return this.content.join(", ");
    }
    /**
    Create a JSON-serializeable representation of this fragment.
    */ toJSON() {
        return this.content.length ? this.content.map((n)=>n.toJSON()) : null;
    }
    /**
    Deserialize a fragment from its JSON representation.
    */ static fromJSON(schema, value) {
        if (!value) return $c8d507d90382f091$export$ffb0004e005737fa.empty;
        if (!Array.isArray(value)) throw new RangeError("Invalid input for Fragment.fromJSON");
        return new $c8d507d90382f091$export$ffb0004e005737fa(value.map(schema.nodeFromJSON));
    }
    /**
    Build a fragment from an array of nodes. Ensures that adjacent
    text nodes with the same marks are joined together.
    */ static fromArray(array) {
        if (!array.length) return $c8d507d90382f091$export$ffb0004e005737fa.empty;
        let joined, size = 0;
        for(let i = 0; i < array.length; i++){
            let node = array[i];
            size += node.nodeSize;
            if (i && node.isText && array[i - 1].sameMarkup(node)) {
                if (!joined) joined = array.slice(0, i);
                joined[joined.length - 1] = node.withText(joined[joined.length - 1].text + node.text);
            } else if (joined) joined.push(node);
        }
        return new $c8d507d90382f091$export$ffb0004e005737fa(joined || array, size);
    }
    /**
    Create a fragment from something that can be interpreted as a
    set of nodes. For `null`, it returns the empty fragment. For a
    fragment, the fragment itself. For a node or array of nodes, a
    fragment containing those nodes.
    */ static from(nodes) {
        if (!nodes) return $c8d507d90382f091$export$ffb0004e005737fa.empty;
        if (nodes instanceof $c8d507d90382f091$export$ffb0004e005737fa) return nodes;
        if (Array.isArray(nodes)) return this.fromArray(nodes);
        if (nodes.attrs) return new $c8d507d90382f091$export$ffb0004e005737fa([
            nodes
        ], nodes.nodeSize);
        throw new RangeError("Can not convert " + nodes + " to a Fragment" + (nodes.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
    }
}
/**
An empty fragment. Intended to be reused whenever a node doesn't
contain anything (rather than allocating a new empty fragment for
each leaf node).
*/ $c8d507d90382f091$export$ffb0004e005737fa.empty = new $c8d507d90382f091$export$ffb0004e005737fa([], 0);
const $c8d507d90382f091$var$found = {
    index: 0,
    offset: 0
};
function $c8d507d90382f091$var$retIndex(index, offset) {
    $c8d507d90382f091$var$found.index = index;
    $c8d507d90382f091$var$found.offset = offset;
    return $c8d507d90382f091$var$found;
}
function $c8d507d90382f091$var$compareDeep(a, b) {
    if (a === b) return true;
    if (!(a && typeof a == "object") || !(b && typeof b == "object")) return false;
    let array = Array.isArray(a);
    if (Array.isArray(b) != array) return false;
    if (array) {
        if (a.length != b.length) return false;
        for(let i = 0; i < a.length; i++)if (!$c8d507d90382f091$var$compareDeep(a[i], b[i])) return false;
    } else {
        for(let p in a)if (!(p in b) || !$c8d507d90382f091$var$compareDeep(a[p], b[p])) return false;
        for(let p1 in b)if (!(p1 in a)) return false;
    }
    return true;
}
/**
A mark is a piece of information that can be attached to a node,
such as it being emphasized, in code font, or a link. It has a
type and optionally a set of attributes that provide further
information (such as the target of the link). Marks are created
through a `Schema`, which controls which types exist and which
attributes they have.
*/ class $c8d507d90382f091$export$c9d15bcfc6d42044 {
    /**
    @internal
    */ constructor(/**
    The type of this mark.
    */ type, /**
    The attributes associated with this mark.
    */ attrs){
        this.type = type;
        this.attrs = attrs;
    }
    /**
    Given a set of marks, create a new set which contains this one as
    well, in the right position. If this mark is already in the set,
    the set itself is returned. If any marks that are set to be
    [exclusive](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) with this mark are present,
    those are replaced by this one.
    */ addToSet(set) {
        let copy, placed = false;
        for(let i = 0; i < set.length; i++){
            let other = set[i];
            if (this.eq(other)) return set;
            if (this.type.excludes(other.type)) {
                if (!copy) copy = set.slice(0, i);
            } else if (other.type.excludes(this.type)) return set;
            else {
                if (!placed && other.type.rank > this.type.rank) {
                    if (!copy) copy = set.slice(0, i);
                    copy.push(this);
                    placed = true;
                }
                if (copy) copy.push(other);
            }
        }
        if (!copy) copy = set.slice();
        if (!placed) copy.push(this);
        return copy;
    }
    /**
    Remove this mark from the given set, returning a new set. If this
    mark is not in the set, the set itself is returned.
    */ removeFromSet(set) {
        for(let i = 0; i < set.length; i++)if (this.eq(set[i])) return set.slice(0, i).concat(set.slice(i + 1));
        return set;
    }
    /**
    Test whether this mark is in the given set of marks.
    */ isInSet(set) {
        for(let i = 0; i < set.length; i++)if (this.eq(set[i])) return true;
        return false;
    }
    /**
    Test whether this mark has the same type and attributes as
    another mark.
    */ eq(other) {
        return this == other || this.type == other.type && $c8d507d90382f091$var$compareDeep(this.attrs, other.attrs);
    }
    /**
    Convert this mark to a JSON-serializeable representation.
    */ toJSON() {
        let obj = {
            type: this.type.name
        };
        for(let _ in this.attrs){
            obj.attrs = this.attrs;
            break;
        }
        return obj;
    }
    /**
    Deserialize a mark from JSON.
    */ static fromJSON(schema, json) {
        if (!json) throw new RangeError("Invalid input for Mark.fromJSON");
        let type = schema.marks[json.type];
        if (!type) throw new RangeError(`There is no mark type ${json.type} in this schema`);
        return type.create(json.attrs);
    }
    /**
    Test whether two sets of marks are identical.
    */ static sameSet(a, b) {
        if (a == b) return true;
        if (a.length != b.length) return false;
        for(let i = 0; i < a.length; i++)if (!a[i].eq(b[i])) return false;
        return true;
    }
    /**
    Create a properly sorted mark set from null, a single mark, or an
    unsorted array of marks.
    */ static setFrom(marks) {
        if (!marks || Array.isArray(marks) && marks.length == 0) return $c8d507d90382f091$export$c9d15bcfc6d42044.none;
        if (marks instanceof $c8d507d90382f091$export$c9d15bcfc6d42044) return [
            marks
        ];
        let copy = marks.slice();
        copy.sort((a, b)=>a.type.rank - b.type.rank);
        return copy;
    }
}
/**
The empty set of marks.
*/ $c8d507d90382f091$export$c9d15bcfc6d42044.none = [];
/**
Error type raised by [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) when
given an invalid replacement.
*/ class $c8d507d90382f091$export$6de0e778727af3f2 extends Error {
}
/*
ReplaceError = function(this: any, message: string) {
  let err = Error.call(this, message)
  ;(err as any).__proto__ = ReplaceError.prototype
  return err
} as any

ReplaceError.prototype = Object.create(Error.prototype)
ReplaceError.prototype.constructor = ReplaceError
ReplaceError.prototype.name = "ReplaceError"
*/ /**
A slice represents a piece cut out of a larger document. It
stores not only a fragment, but also the depth up to which nodes on
both side are ‘open’ (cut through).
*/ class $c8d507d90382f091$export$b3f2e2de3a8baa1e {
    /**
    Create a slice. When specifying a non-zero open depth, you must
    make sure that there are nodes of at least that depth at the
    appropriate side of the fragment—i.e. if the fragment is an
    empty paragraph node, `openStart` and `openEnd` can't be greater
    than 1.
    
    It is not necessary for the content of open nodes to conform to
    the schema's content constraints, though it should be a valid
    start/end/middle for such a node, depending on which sides are
    open.
    */ constructor(/**
    The slice's content.
    */ content, /**
    The open depth at the start of the fragment.
    */ openStart, /**
    The open depth at the end.
    */ openEnd){
        this.content = content;
        this.openStart = openStart;
        this.openEnd = openEnd;
    }
    /**
    The size this slice would add when inserted into a document.
    */ get size() {
        return this.content.size - this.openStart - this.openEnd;
    }
    /**
    @internal
    */ insertAt(pos, fragment) {
        let content = $c8d507d90382f091$var$insertInto(this.content, pos + this.openStart, fragment);
        return content && new $c8d507d90382f091$export$b3f2e2de3a8baa1e(content, this.openStart, this.openEnd);
    }
    /**
    @internal
    */ removeBetween(from, to) {
        return new $c8d507d90382f091$export$b3f2e2de3a8baa1e($c8d507d90382f091$var$removeRange(this.content, from + this.openStart, to + this.openStart), this.openStart, this.openEnd);
    }
    /**
    Tests whether this slice is equal to another slice.
    */ eq(other) {
        return this.content.eq(other.content) && this.openStart == other.openStart && this.openEnd == other.openEnd;
    }
    /**
    @internal
    */ toString() {
        return this.content + "(" + this.openStart + "," + this.openEnd + ")";
    }
    /**
    Convert a slice to a JSON-serializable representation.
    */ toJSON() {
        if (!this.content.size) return null;
        let json = {
            content: this.content.toJSON()
        };
        if (this.openStart > 0) json.openStart = this.openStart;
        if (this.openEnd > 0) json.openEnd = this.openEnd;
        return json;
    }
    /**
    Deserialize a slice from its JSON representation.
    */ static fromJSON(schema, json) {
        if (!json) return $c8d507d90382f091$export$b3f2e2de3a8baa1e.empty;
        let openStart = json.openStart || 0, openEnd = json.openEnd || 0;
        if (typeof openStart != "number" || typeof openEnd != "number") throw new RangeError("Invalid input for Slice.fromJSON");
        return new $c8d507d90382f091$export$b3f2e2de3a8baa1e($c8d507d90382f091$export$ffb0004e005737fa.fromJSON(schema, json.content), openStart, openEnd);
    }
    /**
    Create a slice from a fragment by taking the maximum possible
    open value on both side of the fragment.
    */ static maxOpen(fragment, openIsolating = true) {
        let openStart = 0, openEnd = 0;
        for(let n = fragment.firstChild; n && !n.isLeaf && (openIsolating || !n.type.spec.isolating); n = n.firstChild)openStart++;
        for(let n1 = fragment.lastChild; n1 && !n1.isLeaf && (openIsolating || !n1.type.spec.isolating); n1 = n1.lastChild)openEnd++;
        return new $c8d507d90382f091$export$b3f2e2de3a8baa1e(fragment, openStart, openEnd);
    }
}
/**
The empty slice.
*/ $c8d507d90382f091$export$b3f2e2de3a8baa1e.empty = new $c8d507d90382f091$export$b3f2e2de3a8baa1e($c8d507d90382f091$export$ffb0004e005737fa.empty, 0, 0);
function $c8d507d90382f091$var$removeRange(content, from, to) {
    let { index: index , offset: offset  } = content.findIndex(from), child = content.maybeChild(index);
    let { index: indexTo , offset: offsetTo  } = content.findIndex(to);
    if (offset == from || child.isText) {
        if (offsetTo != to && !content.child(indexTo).isText) throw new RangeError("Removing non-flat range");
        return content.cut(0, from).append(content.cut(to));
    }
    if (index != indexTo) throw new RangeError("Removing non-flat range");
    return content.replaceChild(index, child.copy($c8d507d90382f091$var$removeRange(child.content, from - offset - 1, to - offset - 1)));
}
function $c8d507d90382f091$var$insertInto(content, dist, insert, parent) {
    let { index: index , offset: offset  } = content.findIndex(dist), child = content.maybeChild(index);
    if (offset == dist || child.isText) {
        if (parent && !parent.canReplace(index, index, insert)) return null;
        return content.cut(0, dist).append(insert).append(content.cut(dist));
    }
    let inner = $c8d507d90382f091$var$insertInto(child.content, dist - offset - 1, insert);
    return inner && content.replaceChild(index, child.copy(inner));
}
function $c8d507d90382f091$var$replace($from, $to, slice) {
    if (slice.openStart > $from.depth) throw new $c8d507d90382f091$export$6de0e778727af3f2("Inserted content deeper than insertion position");
    if ($from.depth - slice.openStart != $to.depth - slice.openEnd) throw new $c8d507d90382f091$export$6de0e778727af3f2("Inconsistent open depths");
    return $c8d507d90382f091$var$replaceOuter($from, $to, slice, 0);
}
function $c8d507d90382f091$var$replaceOuter($from, $to, slice, depth) {
    let index = $from.index(depth), node = $from.node(depth);
    if (index == $to.index(depth) && depth < $from.depth - slice.openStart) {
        let inner = $c8d507d90382f091$var$replaceOuter($from, $to, slice, depth + 1);
        return node.copy(node.content.replaceChild(index, inner));
    } else if (!slice.content.size) return $c8d507d90382f091$var$close(node, $c8d507d90382f091$var$replaceTwoWay($from, $to, depth));
    else if (!slice.openStart && !slice.openEnd && $from.depth == depth && $to.depth == depth) {
        let parent = $from.parent, content = parent.content;
        return $c8d507d90382f091$var$close(parent, content.cut(0, $from.parentOffset).append(slice.content).append(content.cut($to.parentOffset)));
    } else {
        let { start: start , end: end  } = $c8d507d90382f091$var$prepareSliceForReplace(slice, $from);
        return $c8d507d90382f091$var$close(node, $c8d507d90382f091$var$replaceThreeWay($from, start, end, $to, depth));
    }
}
function $c8d507d90382f091$var$checkJoin(main, sub) {
    if (!sub.type.compatibleContent(main.type)) throw new $c8d507d90382f091$export$6de0e778727af3f2("Cannot join " + sub.type.name + " onto " + main.type.name);
}
function $c8d507d90382f091$var$joinable($before, $after, depth) {
    let node = $before.node(depth);
    $c8d507d90382f091$var$checkJoin(node, $after.node(depth));
    return node;
}
function $c8d507d90382f091$var$addNode(child, target) {
    let last = target.length - 1;
    if (last >= 0 && child.isText && child.sameMarkup(target[last])) target[last] = child.withText(target[last].text + child.text);
    else target.push(child);
}
function $c8d507d90382f091$var$addRange($start, $end, depth, target) {
    let node = ($end || $start).node(depth);
    let startIndex = 0, endIndex = $end ? $end.index(depth) : node.childCount;
    if ($start) {
        startIndex = $start.index(depth);
        if ($start.depth > depth) startIndex++;
        else if ($start.textOffset) {
            $c8d507d90382f091$var$addNode($start.nodeAfter, target);
            startIndex++;
        }
    }
    for(let i = startIndex; i < endIndex; i++)$c8d507d90382f091$var$addNode(node.child(i), target);
    if ($end && $end.depth == depth && $end.textOffset) $c8d507d90382f091$var$addNode($end.nodeBefore, target);
}
function $c8d507d90382f091$var$close(node, content) {
    node.type.checkContent(content);
    return node.copy(content);
}
function $c8d507d90382f091$var$replaceThreeWay($from, $start, $end, $to, depth) {
    let openStart = $from.depth > depth && $c8d507d90382f091$var$joinable($from, $start, depth + 1);
    let openEnd = $to.depth > depth && $c8d507d90382f091$var$joinable($end, $to, depth + 1);
    let content = [];
    $c8d507d90382f091$var$addRange(null, $from, depth, content);
    if (openStart && openEnd && $start.index(depth) == $end.index(depth)) {
        $c8d507d90382f091$var$checkJoin(openStart, openEnd);
        $c8d507d90382f091$var$addNode($c8d507d90382f091$var$close(openStart, $c8d507d90382f091$var$replaceThreeWay($from, $start, $end, $to, depth + 1)), content);
    } else {
        if (openStart) $c8d507d90382f091$var$addNode($c8d507d90382f091$var$close(openStart, $c8d507d90382f091$var$replaceTwoWay($from, $start, depth + 1)), content);
        $c8d507d90382f091$var$addRange($start, $end, depth, content);
        if (openEnd) $c8d507d90382f091$var$addNode($c8d507d90382f091$var$close(openEnd, $c8d507d90382f091$var$replaceTwoWay($end, $to, depth + 1)), content);
    }
    $c8d507d90382f091$var$addRange($to, null, depth, content);
    return new $c8d507d90382f091$export$ffb0004e005737fa(content);
}
function $c8d507d90382f091$var$replaceTwoWay($from, $to, depth) {
    let content = [];
    $c8d507d90382f091$var$addRange(null, $from, depth, content);
    if ($from.depth > depth) {
        let type = $c8d507d90382f091$var$joinable($from, $to, depth + 1);
        $c8d507d90382f091$var$addNode($c8d507d90382f091$var$close(type, $c8d507d90382f091$var$replaceTwoWay($from, $to, depth + 1)), content);
    }
    $c8d507d90382f091$var$addRange($to, null, depth, content);
    return new $c8d507d90382f091$export$ffb0004e005737fa(content);
}
function $c8d507d90382f091$var$prepareSliceForReplace(slice, $along) {
    let extra = $along.depth - slice.openStart, parent = $along.node(extra);
    let node = parent.copy(slice.content);
    for(let i = extra - 1; i >= 0; i--)node = $along.node(i).copy($c8d507d90382f091$export$ffb0004e005737fa.from(node));
    return {
        start: node.resolveNoCache(slice.openStart + extra),
        end: node.resolveNoCache(node.content.size - slice.openEnd - extra)
    };
}
/**
You can [_resolve_](https://prosemirror.net/docs/ref/#model.Node.resolve) a position to get more
information about it. Objects of this class represent such a
resolved position, providing various pieces of context
information, and some helper methods.

Throughout this interface, methods that take an optional `depth`
parameter will interpret undefined as `this.depth` and negative
numbers as `this.depth + value`.
*/ class $c8d507d90382f091$export$b2a42f82e59e4b19 {
    /**
    @internal
    */ constructor(/**
    The position that was resolved.
    */ pos, /**
    @internal
    */ path, /**
    The offset this position has into its parent node.
    */ parentOffset){
        this.pos = pos;
        this.path = path;
        this.parentOffset = parentOffset;
        this.depth = path.length / 3 - 1;
    }
    /**
    @internal
    */ resolveDepth(val) {
        if (val == null) return this.depth;
        if (val < 0) return this.depth + val;
        return val;
    }
    /**
    The parent node that the position points into. Note that even if
    a position points into a text node, that node is not considered
    the parent—text nodes are ‘flat’ in this model, and have no content.
    */ get parent() {
        return this.node(this.depth);
    }
    /**
    The root node in which the position was resolved.
    */ get doc() {
        return this.node(0);
    }
    /**
    The ancestor node at the given level. `p.node(p.depth)` is the
    same as `p.parent`.
    */ node(depth) {
        return this.path[this.resolveDepth(depth) * 3];
    }
    /**
    The index into the ancestor at the given level. If this points
    at the 3rd node in the 2nd paragraph on the top level, for
    example, `p.index(0)` is 1 and `p.index(1)` is 2.
    */ index(depth) {
        return this.path[this.resolveDepth(depth) * 3 + 1];
    }
    /**
    The index pointing after this position into the ancestor at the
    given level.
    */ indexAfter(depth) {
        depth = this.resolveDepth(depth);
        return this.index(depth) + (depth == this.depth && !this.textOffset ? 0 : 1);
    }
    /**
    The (absolute) position at the start of the node at the given
    level.
    */ start(depth) {
        depth = this.resolveDepth(depth);
        return depth == 0 ? 0 : this.path[depth * 3 - 1] + 1;
    }
    /**
    The (absolute) position at the end of the node at the given
    level.
    */ end(depth) {
        depth = this.resolveDepth(depth);
        return this.start(depth) + this.node(depth).content.size;
    }
    /**
    The (absolute) position directly before the wrapping node at the
    given level, or, when `depth` is `this.depth + 1`, the original
    position.
    */ before(depth) {
        depth = this.resolveDepth(depth);
        if (!depth) throw new RangeError("There is no position before the top-level node");
        return depth == this.depth + 1 ? this.pos : this.path[depth * 3 - 1];
    }
    /**
    The (absolute) position directly after the wrapping node at the
    given level, or the original position when `depth` is `this.depth + 1`.
    */ after(depth) {
        depth = this.resolveDepth(depth);
        if (!depth) throw new RangeError("There is no position after the top-level node");
        return depth == this.depth + 1 ? this.pos : this.path[depth * 3 - 1] + this.path[depth * 3].nodeSize;
    }
    /**
    When this position points into a text node, this returns the
    distance between the position and the start of the text node.
    Will be zero for positions that point between nodes.
    */ get textOffset() {
        return this.pos - this.path[this.path.length - 1];
    }
    /**
    Get the node directly after the position, if any. If the position
    points into a text node, only the part of that node after the
    position is returned.
    */ get nodeAfter() {
        let parent = this.parent, index = this.index(this.depth);
        if (index == parent.childCount) return null;
        let dOff = this.pos - this.path[this.path.length - 1], child = parent.child(index);
        return dOff ? parent.child(index).cut(dOff) : child;
    }
    /**
    Get the node directly before the position, if any. If the
    position points into a text node, only the part of that node
    before the position is returned.
    */ get nodeBefore() {
        let index = this.index(this.depth);
        let dOff = this.pos - this.path[this.path.length - 1];
        if (dOff) return this.parent.child(index).cut(0, dOff);
        return index == 0 ? null : this.parent.child(index - 1);
    }
    /**
    Get the position at the given index in the parent node at the
    given depth (which defaults to `this.depth`).
    */ posAtIndex(index, depth) {
        depth = this.resolveDepth(depth);
        let node = this.path[depth * 3], pos = depth == 0 ? 0 : this.path[depth * 3 - 1] + 1;
        for(let i = 0; i < index; i++)pos += node.child(i).nodeSize;
        return pos;
    }
    /**
    Get the marks at this position, factoring in the surrounding
    marks' [`inclusive`](https://prosemirror.net/docs/ref/#model.MarkSpec.inclusive) property. If the
    position is at the start of a non-empty node, the marks of the
    node after it (if any) are returned.
    */ marks() {
        let parent = this.parent, index = this.index();
        // In an empty parent, return the empty array
        if (parent.content.size == 0) return $c8d507d90382f091$export$c9d15bcfc6d42044.none;
        // When inside a text node, just return the text node's marks
        if (this.textOffset) return parent.child(index).marks;
        let main = parent.maybeChild(index - 1), other = parent.maybeChild(index);
        // If the `after` flag is true of there is no node before, make
        // the node after this position the main reference.
        if (!main) {
            let tmp = main;
            main = other;
            other = tmp;
        }
        // Use all marks in the main node, except those that have
        // `inclusive` set to false and are not present in the other node.
        let marks = main.marks;
        for(var i = 0; i < marks.length; i++)if (marks[i].type.spec.inclusive === false && (!other || !marks[i].isInSet(other.marks))) marks = marks[i--].removeFromSet(marks);
        return marks;
    }
    /**
    Get the marks after the current position, if any, except those
    that are non-inclusive and not present at position `$end`. This
    is mostly useful for getting the set of marks to preserve after a
    deletion. Will return `null` if this position is at the end of
    its parent node or its parent node isn't a textblock (in which
    case no marks should be preserved).
    */ marksAcross($end) {
        let after = this.parent.maybeChild(this.index());
        if (!after || !after.isInline) return null;
        let marks = after.marks, next = $end.parent.maybeChild($end.index());
        for(var i = 0; i < marks.length; i++)if (marks[i].type.spec.inclusive === false && (!next || !marks[i].isInSet(next.marks))) marks = marks[i--].removeFromSet(marks);
        return marks;
    }
    /**
    The depth up to which this position and the given (non-resolved)
    position share the same parent nodes.
    */ sharedDepth(pos) {
        for(let depth = this.depth; depth > 0; depth--)if (this.start(depth) <= pos && this.end(depth) >= pos) return depth;
        return 0;
    }
    /**
    Returns a range based on the place where this position and the
    given position diverge around block content. If both point into
    the same textblock, for example, a range around that textblock
    will be returned. If they point into different blocks, the range
    around those blocks in their shared ancestor is returned. You can
    pass in an optional predicate that will be called with a parent
    node to see if a range into that parent is acceptable.
    */ blockRange(other = this, pred) {
        if (other.pos < this.pos) return other.blockRange(this);
        for(let d = this.depth - (this.parent.inlineContent || this.pos == other.pos ? 1 : 0); d >= 0; d--)if (other.pos <= this.end(d) && (!pred || pred(this.node(d)))) return new $c8d507d90382f091$export$7bc461ceb770fb16(this, other, d);
        return null;
    }
    /**
    Query whether the given position shares the same parent node.
    */ sameParent(other) {
        return this.pos - this.parentOffset == other.pos - other.parentOffset;
    }
    /**
    Return the greater of this and the given position.
    */ max(other) {
        return other.pos > this.pos ? other : this;
    }
    /**
    Return the smaller of this and the given position.
    */ min(other) {
        return other.pos < this.pos ? other : this;
    }
    /**
    @internal
    */ toString() {
        let str = "";
        for(let i = 1; i <= this.depth; i++)str += (str ? "/" : "") + this.node(i).type.name + "_" + this.index(i - 1);
        return str + ":" + this.parentOffset;
    }
    /**
    @internal
    */ static resolve(doc, pos) {
        if (!(pos >= 0 && pos <= doc.content.size)) throw new RangeError("Position " + pos + " out of range");
        let path = [];
        let start = 0, parentOffset = pos;
        for(let node = doc;;){
            let { index: index , offset: offset  } = node.content.findIndex(parentOffset);
            let rem = parentOffset - offset;
            path.push(node, index, start + offset);
            if (!rem) break;
            node = node.child(index);
            if (node.isText) break;
            parentOffset = rem - 1;
            start += offset + 1;
        }
        return new $c8d507d90382f091$export$b2a42f82e59e4b19(pos, path, parentOffset);
    }
    /**
    @internal
    */ static resolveCached(doc, pos) {
        for(let i = 0; i < $c8d507d90382f091$var$resolveCache.length; i++){
            let cached = $c8d507d90382f091$var$resolveCache[i];
            if (cached.pos == pos && cached.doc == doc) return cached;
        }
        let result = $c8d507d90382f091$var$resolveCache[$c8d507d90382f091$var$resolveCachePos] = $c8d507d90382f091$export$b2a42f82e59e4b19.resolve(doc, pos);
        $c8d507d90382f091$var$resolveCachePos = ($c8d507d90382f091$var$resolveCachePos + 1) % $c8d507d90382f091$var$resolveCacheSize;
        return result;
    }
}
let $c8d507d90382f091$var$resolveCache = [], $c8d507d90382f091$var$resolveCachePos = 0, $c8d507d90382f091$var$resolveCacheSize = 12;
/**
Represents a flat range of content, i.e. one that starts and
ends in the same node.
*/ class $c8d507d90382f091$export$7bc461ceb770fb16 {
    /**
    Construct a node range. `$from` and `$to` should point into the
    same node until at least the given `depth`, since a node range
    denotes an adjacent set of nodes in a single parent node.
    */ constructor(/**
    A resolved position along the start of the content. May have a
    `depth` greater than this object's `depth` property, since
    these are the positions that were used to compute the range,
    not re-resolved positions directly at its boundaries.
    */ $from, /**
    A position along the end of the content. See
    caveat for [`$from`](https://prosemirror.net/docs/ref/#model.NodeRange.$from).
    */ $to, /**
    The depth of the node that this range points into.
    */ depth){
        this.$from = $from;
        this.$to = $to;
        this.depth = depth;
    }
    /**
    The position at the start of the range.
    */ get start() {
        return this.$from.before(this.depth + 1);
    }
    /**
    The position at the end of the range.
    */ get end() {
        return this.$to.after(this.depth + 1);
    }
    /**
    The parent node that the range points into.
    */ get parent() {
        return this.$from.node(this.depth);
    }
    /**
    The start index of the range in the parent node.
    */ get startIndex() {
        return this.$from.index(this.depth);
    }
    /**
    The end index of the range in the parent node.
    */ get endIndex() {
        return this.$to.indexAfter(this.depth);
    }
}
const $c8d507d90382f091$var$emptyAttrs = Object.create(null);
/**
This class represents a node in the tree that makes up a
ProseMirror document. So a document is an instance of `Node`, with
children that are also instances of `Node`.

Nodes are persistent data structures. Instead of changing them, you
create new ones with the content you want. Old ones keep pointing
at the old document shape. This is made cheaper by sharing
structure between the old and new data as much as possible, which a
tree shape like this (without back pointers) makes easy.

**Do not** directly mutate the properties of a `Node` object. See
[the guide](/docs/guide/#doc) for more information.
*/ class $c8d507d90382f091$export$85c928794f8d04d4 {
    /**
    @internal
    */ constructor(/**
    The type of node that this is.
    */ type, /**
    An object mapping attribute names to values. The kind of
    attributes allowed and required are
    [determined](https://prosemirror.net/docs/ref/#model.NodeSpec.attrs) by the node type.
    */ attrs, // A fragment holding the node's children.
    content, /**
    The marks (things like whether it is emphasized or part of a
    link) applied to this node.
    */ marks = $c8d507d90382f091$export$c9d15bcfc6d42044.none){
        this.type = type;
        this.attrs = attrs;
        this.marks = marks;
        this.content = content || $c8d507d90382f091$export$ffb0004e005737fa.empty;
    }
    /**
    The size of this node, as defined by the integer-based [indexing
    scheme](/docs/guide/#doc.indexing). For text nodes, this is the
    amount of characters. For other leaf nodes, it is one. For
    non-leaf nodes, it is the size of the content plus two (the
    start and end token).
    */ get nodeSize() {
        return this.isLeaf ? 1 : 2 + this.content.size;
    }
    /**
    The number of children that the node has.
    */ get childCount() {
        return this.content.childCount;
    }
    /**
    Get the child node at the given index. Raises an error when the
    index is out of range.
    */ child(index) {
        return this.content.child(index);
    }
    /**
    Get the child node at the given index, if it exists.
    */ maybeChild(index) {
        return this.content.maybeChild(index);
    }
    /**
    Call `f` for every child node, passing the node, its offset
    into this parent node, and its index.
    */ forEach(f) {
        this.content.forEach(f);
    }
    /**
    Invoke a callback for all descendant nodes recursively between
    the given two positions that are relative to start of this
    node's content. The callback is invoked with the node, its
    parent-relative position, its parent node, and its child index.
    When the callback returns false for a given node, that node's
    children will not be recursed over. The last parameter can be
    used to specify a starting position to count from.
    */ nodesBetween(from, to, f, startPos = 0) {
        this.content.nodesBetween(from, to, f, startPos, this);
    }
    /**
    Call the given callback for every descendant node. Doesn't
    descend into a node when the callback returns `false`.
    */ descendants(f) {
        this.nodesBetween(0, this.content.size, f);
    }
    /**
    Concatenates all the text nodes found in this fragment and its
    children.
    */ get textContent() {
        return this.isLeaf && this.type.spec.leafText ? this.type.spec.leafText(this) : this.textBetween(0, this.content.size, "");
    }
    /**
    Get all text between positions `from` and `to`. When
    `blockSeparator` is given, it will be inserted to separate text
    from different block nodes. If `leafText` is given, it'll be
    inserted for every non-text leaf node encountered, otherwise
    [`leafText`](https://prosemirror.net/docs/ref/#model.NodeSpec^leafText) will be used.
    */ textBetween(from, to, blockSeparator, leafText) {
        return this.content.textBetween(from, to, blockSeparator, leafText);
    }
    /**
    Returns this node's first child, or `null` if there are no
    children.
    */ get firstChild() {
        return this.content.firstChild;
    }
    /**
    Returns this node's last child, or `null` if there are no
    children.
    */ get lastChild() {
        return this.content.lastChild;
    }
    /**
    Test whether two nodes represent the same piece of document.
    */ eq(other) {
        return this == other || this.sameMarkup(other) && this.content.eq(other.content);
    }
    /**
    Compare the markup (type, attributes, and marks) of this node to
    those of another. Returns `true` if both have the same markup.
    */ sameMarkup(other) {
        return this.hasMarkup(other.type, other.attrs, other.marks);
    }
    /**
    Check whether this node's markup correspond to the given type,
    attributes, and marks.
    */ hasMarkup(type, attrs, marks) {
        return this.type == type && $c8d507d90382f091$var$compareDeep(this.attrs, attrs || type.defaultAttrs || $c8d507d90382f091$var$emptyAttrs) && $c8d507d90382f091$export$c9d15bcfc6d42044.sameSet(this.marks, marks || $c8d507d90382f091$export$c9d15bcfc6d42044.none);
    }
    /**
    Create a new node with the same markup as this node, containing
    the given content (or empty, if no content is given).
    */ copy(content = null) {
        if (content == this.content) return this;
        return new $c8d507d90382f091$export$85c928794f8d04d4(this.type, this.attrs, content, this.marks);
    }
    /**
    Create a copy of this node, with the given set of marks instead
    of the node's own marks.
    */ mark(marks) {
        return marks == this.marks ? this : new $c8d507d90382f091$export$85c928794f8d04d4(this.type, this.attrs, this.content, marks);
    }
    /**
    Create a copy of this node with only the content between the
    given positions. If `to` is not given, it defaults to the end of
    the node.
    */ cut(from, to = this.content.size) {
        if (from == 0 && to == this.content.size) return this;
        return this.copy(this.content.cut(from, to));
    }
    /**
    Cut out the part of the document between the given positions, and
    return it as a `Slice` object.
    */ slice(from, to = this.content.size, includeParents = false) {
        if (from == to) return $c8d507d90382f091$export$b3f2e2de3a8baa1e.empty;
        let $from = this.resolve(from), $to = this.resolve(to);
        let depth = includeParents ? 0 : $from.sharedDepth(to);
        let start = $from.start(depth), node = $from.node(depth);
        let content = node.content.cut($from.pos - start, $to.pos - start);
        return new $c8d507d90382f091$export$b3f2e2de3a8baa1e(content, $from.depth - depth, $to.depth - depth);
    }
    /**
    Replace the part of the document between the given positions with
    the given slice. The slice must 'fit', meaning its open sides
    must be able to connect to the surrounding content, and its
    content nodes must be valid children for the node they are placed
    into. If any of this is violated, an error of type
    [`ReplaceError`](https://prosemirror.net/docs/ref/#model.ReplaceError) is thrown.
    */ replace(from, to, slice) {
        return $c8d507d90382f091$var$replace(this.resolve(from), this.resolve(to), slice);
    }
    /**
    Find the node directly after the given position.
    */ nodeAt(pos) {
        for(let node = this;;){
            let { index: index , offset: offset  } = node.content.findIndex(pos);
            node = node.maybeChild(index);
            if (!node) return null;
            if (offset == pos || node.isText) return node;
            pos -= offset + 1;
        }
    }
    /**
    Find the (direct) child node after the given offset, if any,
    and return it along with its index and offset relative to this
    node.
    */ childAfter(pos) {
        let { index: index , offset: offset  } = this.content.findIndex(pos);
        return {
            node: this.content.maybeChild(index),
            index: index,
            offset: offset
        };
    }
    /**
    Find the (direct) child node before the given offset, if any,
    and return it along with its index and offset relative to this
    node.
    */ childBefore(pos) {
        if (pos == 0) return {
            node: null,
            index: 0,
            offset: 0
        };
        let { index: index , offset: offset  } = this.content.findIndex(pos);
        if (offset < pos) return {
            node: this.content.child(index),
            index: index,
            offset: offset
        };
        let node = this.content.child(index - 1);
        return {
            node: node,
            index: index - 1,
            offset: offset - node.nodeSize
        };
    }
    /**
    Resolve the given position in the document, returning an
    [object](https://prosemirror.net/docs/ref/#model.ResolvedPos) with information about its context.
    */ resolve(pos) {
        return $c8d507d90382f091$export$b2a42f82e59e4b19.resolveCached(this, pos);
    }
    /**
    @internal
    */ resolveNoCache(pos) {
        return $c8d507d90382f091$export$b2a42f82e59e4b19.resolve(this, pos);
    }
    /**
    Test whether a given mark or mark type occurs in this document
    between the two given positions.
    */ rangeHasMark(from, to, type) {
        let found = false;
        if (to > from) this.nodesBetween(from, to, (node)=>{
            if (type.isInSet(node.marks)) found = true;
            return !found;
        });
        return found;
    }
    /**
    True when this is a block (non-inline node)
    */ get isBlock() {
        return this.type.isBlock;
    }
    /**
    True when this is a textblock node, a block node with inline
    content.
    */ get isTextblock() {
        return this.type.isTextblock;
    }
    /**
    True when this node allows inline content.
    */ get inlineContent() {
        return this.type.inlineContent;
    }
    /**
    True when this is an inline node (a text node or a node that can
    appear among text).
    */ get isInline() {
        return this.type.isInline;
    }
    /**
    True when this is a text node.
    */ get isText() {
        return this.type.isText;
    }
    /**
    True when this is a leaf node.
    */ get isLeaf() {
        return this.type.isLeaf;
    }
    /**
    True when this is an atom, i.e. when it does not have directly
    editable content. This is usually the same as `isLeaf`, but can
    be configured with the [`atom` property](https://prosemirror.net/docs/ref/#model.NodeSpec.atom)
    on a node's spec (typically used when the node is displayed as
    an uneditable [node view](https://prosemirror.net/docs/ref/#view.NodeView)).
    */ get isAtom() {
        return this.type.isAtom;
    }
    /**
    Return a string representation of this node for debugging
    purposes.
    */ toString() {
        if (this.type.spec.toDebugString) return this.type.spec.toDebugString(this);
        let name = this.type.name;
        if (this.content.size) name += "(" + this.content.toStringInner() + ")";
        return $c8d507d90382f091$var$wrapMarks(this.marks, name);
    }
    /**
    Get the content match in this node at the given index.
    */ contentMatchAt(index) {
        let match = this.type.contentMatch.matchFragment(this.content, 0, index);
        if (!match) throw new Error("Called contentMatchAt on a node with invalid content");
        return match;
    }
    /**
    Test whether replacing the range between `from` and `to` (by
    child index) with the given replacement fragment (which defaults
    to the empty fragment) would leave the node's content valid. You
    can optionally pass `start` and `end` indices into the
    replacement fragment.
    */ canReplace(from, to, replacement = $c8d507d90382f091$export$ffb0004e005737fa.empty, start = 0, end = replacement.childCount) {
        let one = this.contentMatchAt(from).matchFragment(replacement, start, end);
        let two = one && one.matchFragment(this.content, to);
        if (!two || !two.validEnd) return false;
        for(let i = start; i < end; i++)if (!this.type.allowsMarks(replacement.child(i).marks)) return false;
        return true;
    }
    /**
    Test whether replacing the range `from` to `to` (by index) with
    a node of the given type would leave the node's content valid.
    */ canReplaceWith(from, to, type, marks) {
        if (marks && !this.type.allowsMarks(marks)) return false;
        let start = this.contentMatchAt(from).matchType(type);
        let end = start && start.matchFragment(this.content, to);
        return end ? end.validEnd : false;
    }
    /**
    Test whether the given node's content could be appended to this
    node. If that node is empty, this will only return true if there
    is at least one node type that can appear in both nodes (to avoid
    merging completely incompatible nodes).
    */ canAppend(other) {
        if (other.content.size) return this.canReplace(this.childCount, this.childCount, other.content);
        else return this.type.compatibleContent(other.type);
    }
    /**
    Check whether this node and its descendants conform to the
    schema, and raise error when they do not.
    */ check() {
        this.type.checkContent(this.content);
        let copy = $c8d507d90382f091$export$c9d15bcfc6d42044.none;
        for(let i = 0; i < this.marks.length; i++)copy = this.marks[i].addToSet(copy);
        if (!$c8d507d90382f091$export$c9d15bcfc6d42044.sameSet(copy, this.marks)) throw new RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((m)=>m.type.name)}`);
        this.content.forEach((node)=>node.check());
    }
    /**
    Return a JSON-serializeable representation of this node.
    */ toJSON() {
        let obj = {
            type: this.type.name
        };
        for(let _ in this.attrs){
            obj.attrs = this.attrs;
            break;
        }
        if (this.content.size) obj.content = this.content.toJSON();
        if (this.marks.length) obj.marks = this.marks.map((n)=>n.toJSON());
        return obj;
    }
    /**
    Deserialize a node from its JSON representation.
    */ static fromJSON(schema, json) {
        if (!json) throw new RangeError("Invalid input for Node.fromJSON");
        let marks = null;
        if (json.marks) {
            if (!Array.isArray(json.marks)) throw new RangeError("Invalid mark data for Node.fromJSON");
            marks = json.marks.map(schema.markFromJSON);
        }
        if (json.type == "text") {
            if (typeof json.text != "string") throw new RangeError("Invalid text node in JSON");
            return schema.text(json.text, marks);
        }
        let content = $c8d507d90382f091$export$ffb0004e005737fa.fromJSON(schema, json.content);
        return schema.nodeType(json.type).create(json.attrs, content, marks);
    }
}
$c8d507d90382f091$export$85c928794f8d04d4.prototype.text = undefined;
class $c8d507d90382f091$var$TextNode extends $c8d507d90382f091$export$85c928794f8d04d4 {
    /**
    @internal
    */ constructor(type, attrs, content, marks){
        super(type, attrs, null, marks);
        if (!content) throw new RangeError("Empty text nodes are not allowed");
        this.text = content;
    }
    toString() {
        if (this.type.spec.toDebugString) return this.type.spec.toDebugString(this);
        return $c8d507d90382f091$var$wrapMarks(this.marks, JSON.stringify(this.text));
    }
    get textContent() {
        return this.text;
    }
    textBetween(from, to) {
        return this.text.slice(from, to);
    }
    get nodeSize() {
        return this.text.length;
    }
    mark(marks) {
        return marks == this.marks ? this : new $c8d507d90382f091$var$TextNode(this.type, this.attrs, this.text, marks);
    }
    withText(text) {
        if (text == this.text) return this;
        return new $c8d507d90382f091$var$TextNode(this.type, this.attrs, text, this.marks);
    }
    cut(from = 0, to = this.text.length) {
        if (from == 0 && to == this.text.length) return this;
        return this.withText(this.text.slice(from, to));
    }
    eq(other) {
        return this.sameMarkup(other) && this.text == other.text;
    }
    toJSON() {
        let base = super.toJSON();
        base.text = this.text;
        return base;
    }
}
function $c8d507d90382f091$var$wrapMarks(marks, str) {
    for(let i = marks.length - 1; i >= 0; i--)str = marks[i].type.name + "(" + str + ")";
    return str;
}
/**
Instances of this class represent a match state of a node type's
[content expression](https://prosemirror.net/docs/ref/#model.NodeSpec.content), and can be used to
find out whether further content matches here, and whether a given
position is a valid end of the node.
*/ class $c8d507d90382f091$export$364ed450558d7ec4 {
    /**
    @internal
    */ constructor(/**
    True when this match state represents a valid end of the node.
    */ validEnd){
        this.validEnd = validEnd;
        /**
        @internal
        */ this.next = [];
        /**
        @internal
        */ this.wrapCache = [];
    }
    /**
    @internal
    */ static parse(string, nodeTypes) {
        let stream = new $c8d507d90382f091$var$TokenStream(string, nodeTypes);
        if (stream.next == null) return $c8d507d90382f091$export$364ed450558d7ec4.empty;
        let expr = $c8d507d90382f091$var$parseExpr(stream);
        if (stream.next) stream.err("Unexpected trailing text");
        let match = $c8d507d90382f091$var$dfa($c8d507d90382f091$var$nfa(expr));
        $c8d507d90382f091$var$checkForDeadEnds(match, stream);
        return match;
    }
    /**
    Match a node type, returning a match after that node if
    successful.
    */ matchType(type) {
        for(let i = 0; i < this.next.length; i++)if (this.next[i].type == type) return this.next[i].next;
        return null;
    }
    /**
    Try to match a fragment. Returns the resulting match when
    successful.
    */ matchFragment(frag, start = 0, end = frag.childCount) {
        let cur = this;
        for(let i = start; cur && i < end; i++)cur = cur.matchType(frag.child(i).type);
        return cur;
    }
    /**
    @internal
    */ get inlineContent() {
        return this.next.length != 0 && this.next[0].type.isInline;
    }
    /**
    Get the first matching node type at this match position that can
    be generated.
    */ get defaultType() {
        for(let i = 0; i < this.next.length; i++){
            let { type: type  } = this.next[i];
            if (!(type.isText || type.hasRequiredAttrs())) return type;
        }
        return null;
    }
    /**
    @internal
    */ compatible(other) {
        for(let i = 0; i < this.next.length; i++)for(let j = 0; j < other.next.length; j++)if (this.next[i].type == other.next[j].type) return true;
        return false;
    }
    /**
    Try to match the given fragment, and if that fails, see if it can
    be made to match by inserting nodes in front of it. When
    successful, return a fragment of inserted nodes (which may be
    empty if nothing had to be inserted). When `toEnd` is true, only
    return a fragment if the resulting match goes to the end of the
    content expression.
    */ fillBefore(after, toEnd = false, startIndex = 0) {
        let seen = [
            this
        ];
        function search(match, types) {
            let finished = match.matchFragment(after, startIndex);
            if (finished && (!toEnd || finished.validEnd)) return $c8d507d90382f091$export$ffb0004e005737fa.from(types.map((tp)=>tp.createAndFill()));
            for(let i = 0; i < match.next.length; i++){
                let { type: type , next: next  } = match.next[i];
                if (!(type.isText || type.hasRequiredAttrs()) && seen.indexOf(next) == -1) {
                    seen.push(next);
                    let found = search(next, types.concat(type));
                    if (found) return found;
                }
            }
            return null;
        }
        return search(this, []);
    }
    /**
    Find a set of wrapping node types that would allow a node of the
    given type to appear at this position. The result may be empty
    (when it fits directly) and will be null when no such wrapping
    exists.
    */ findWrapping(target) {
        for(let i = 0; i < this.wrapCache.length; i += 2)if (this.wrapCache[i] == target) return this.wrapCache[i + 1];
        let computed = this.computeWrapping(target);
        this.wrapCache.push(target, computed);
        return computed;
    }
    /**
    @internal
    */ computeWrapping(target) {
        let seen = Object.create(null), active = [
            {
                match: this,
                type: null,
                via: null
            }
        ];
        while(active.length){
            let current = active.shift(), match = current.match;
            if (match.matchType(target)) {
                let result = [];
                for(let obj = current; obj.type; obj = obj.via)result.push(obj.type);
                return result.reverse();
            }
            for(let i = 0; i < match.next.length; i++){
                let { type: type , next: next  } = match.next[i];
                if (!type.isLeaf && !type.hasRequiredAttrs() && !(type.name in seen) && (!current.type || next.validEnd)) {
                    active.push({
                        match: type.contentMatch,
                        type: type,
                        via: current
                    });
                    seen[type.name] = true;
                }
            }
        }
        return null;
    }
    /**
    The number of outgoing edges this node has in the finite
    automaton that describes the content expression.
    */ get edgeCount() {
        return this.next.length;
    }
    /**
    Get the _n_​th outgoing edge from this node in the finite
    automaton that describes the content expression.
    */ edge(n) {
        if (n >= this.next.length) throw new RangeError(`There's no ${n}th edge in this content match`);
        return this.next[n];
    }
    /**
    @internal
    */ toString() {
        let seen = [];
        function scan(m) {
            seen.push(m);
            for(let i = 0; i < m.next.length; i++)if (seen.indexOf(m.next[i].next) == -1) scan(m.next[i].next);
        }
        scan(this);
        return seen.map((m, i)=>{
            let out = i + (m.validEnd ? "*" : " ") + " ";
            for(let i1 = 0; i1 < m.next.length; i1++)out += (i1 ? ", " : "") + m.next[i1].type.name + "->" + seen.indexOf(m.next[i1].next);
            return out;
        }).join("\n");
    }
}
/**
@internal
*/ $c8d507d90382f091$export$364ed450558d7ec4.empty = new $c8d507d90382f091$export$364ed450558d7ec4(true);
class $c8d507d90382f091$var$TokenStream {
    constructor(string, nodeTypes){
        this.string = string;
        this.nodeTypes = nodeTypes;
        this.inline = null;
        this.pos = 0;
        this.tokens = string.split(/\s*(?=\b|\W|$)/);
        if (this.tokens[this.tokens.length - 1] == "") this.tokens.pop();
        if (this.tokens[0] == "") this.tokens.shift();
    }
    get next() {
        return this.tokens[this.pos];
    }
    eat(tok) {
        return this.next == tok && (this.pos++ || true);
    }
    err(str) {
        throw new SyntaxError(str + " (in content expression '" + this.string + "')");
    }
}
function $c8d507d90382f091$var$parseExpr(stream) {
    let exprs = [];
    do exprs.push($c8d507d90382f091$var$parseExprSeq(stream));
    while (stream.eat("|"));
    return exprs.length == 1 ? exprs[0] : {
        type: "choice",
        exprs: exprs
    };
}
function $c8d507d90382f091$var$parseExprSeq(stream) {
    let exprs = [];
    do exprs.push($c8d507d90382f091$var$parseExprSubscript(stream));
    while (stream.next && stream.next != ")" && stream.next != "|");
    return exprs.length == 1 ? exprs[0] : {
        type: "seq",
        exprs: exprs
    };
}
function $c8d507d90382f091$var$parseExprSubscript(stream) {
    let expr = $c8d507d90382f091$var$parseExprAtom(stream);
    for(;;){
        if (stream.eat("+")) expr = {
            type: "plus",
            expr: expr
        };
        else if (stream.eat("*")) expr = {
            type: "star",
            expr: expr
        };
        else if (stream.eat("?")) expr = {
            type: "opt",
            expr: expr
        };
        else if (stream.eat("{")) expr = $c8d507d90382f091$var$parseExprRange(stream, expr);
        else break;
    }
    return expr;
}
function $c8d507d90382f091$var$parseNum(stream) {
    if (/\D/.test(stream.next)) stream.err("Expected number, got '" + stream.next + "'");
    let result = Number(stream.next);
    stream.pos++;
    return result;
}
function $c8d507d90382f091$var$parseExprRange(stream, expr) {
    let min = $c8d507d90382f091$var$parseNum(stream), max = min;
    if (stream.eat(",")) {
        if (stream.next != "}") max = $c8d507d90382f091$var$parseNum(stream);
        else max = -1;
    }
    if (!stream.eat("}")) stream.err("Unclosed braced range");
    return {
        type: "range",
        min: min,
        max: max,
        expr: expr
    };
}
function $c8d507d90382f091$var$resolveName(stream, name) {
    let types = stream.nodeTypes, type = types[name];
    if (type) return [
        type
    ];
    let result = [];
    for(let typeName in types){
        let type1 = types[typeName];
        if (type1.groups.indexOf(name) > -1) result.push(type1);
    }
    if (result.length == 0) stream.err("No node type or group '" + name + "' found");
    return result;
}
function $c8d507d90382f091$var$parseExprAtom(stream) {
    if (stream.eat("(")) {
        let expr = $c8d507d90382f091$var$parseExpr(stream);
        if (!stream.eat(")")) stream.err("Missing closing paren");
        return expr;
    } else if (!/\W/.test(stream.next)) {
        let exprs = $c8d507d90382f091$var$resolveName(stream, stream.next).map((type)=>{
            if (stream.inline == null) stream.inline = type.isInline;
            else if (stream.inline != type.isInline) stream.err("Mixing inline and block content");
            return {
                type: "name",
                value: type
            };
        });
        stream.pos++;
        return exprs.length == 1 ? exprs[0] : {
            type: "choice",
            exprs: exprs
        };
    } else stream.err("Unexpected token '" + stream.next + "'");
}
/**
Construct an NFA from an expression as returned by the parser. The
NFA is represented as an array of states, which are themselves
arrays of edges, which are `{term, to}` objects. The first state is
the entry state and the last node is the success state.

Note that unlike typical NFAs, the edge ordering in this one is
significant, in that it is used to contruct filler content when
necessary.
*/ function $c8d507d90382f091$var$nfa(expr) {
    let nfa = [
        []
    ];
    connect(compile(expr, 0), node());
    return nfa;
    function node() {
        return nfa.push([]) - 1;
    }
    function edge(from, to, term) {
        let edge = {
            term: term,
            to: to
        };
        nfa[from].push(edge);
        return edge;
    }
    function connect(edges, to) {
        edges.forEach((edge)=>edge.to = to);
    }
    function compile(expr, from) {
        if (expr.type == "choice") return expr.exprs.reduce((out, expr)=>out.concat(compile(expr, from)), []);
        else if (expr.type == "seq") for(let i = 0;; i++){
            let next = compile(expr.exprs[i], from);
            if (i == expr.exprs.length - 1) return next;
            connect(next, from = node());
        }
        else if (expr.type == "star") {
            let loop = node();
            edge(from, loop);
            connect(compile(expr.expr, loop), loop);
            return [
                edge(loop)
            ];
        } else if (expr.type == "plus") {
            let loop1 = node();
            connect(compile(expr.expr, from), loop1);
            connect(compile(expr.expr, loop1), loop1);
            return [
                edge(loop1)
            ];
        } else if (expr.type == "opt") return [
            edge(from)
        ].concat(compile(expr.expr, from));
        else if (expr.type == "range") {
            let cur = from;
            for(let i1 = 0; i1 < expr.min; i1++){
                let next1 = node();
                connect(compile(expr.expr, cur), next1);
                cur = next1;
            }
            if (expr.max == -1) connect(compile(expr.expr, cur), cur);
            else for(let i2 = expr.min; i2 < expr.max; i2++){
                let next2 = node();
                edge(cur, next2);
                connect(compile(expr.expr, cur), next2);
                cur = next2;
            }
            return [
                edge(cur)
            ];
        } else if (expr.type == "name") return [
            edge(from, undefined, expr.value)
        ];
        else throw new Error("Unknown expr type");
    }
}
function $c8d507d90382f091$var$cmp(a, b) {
    return b - a;
}
// Get the set of nodes reachable by null edges from `node`. Omit
// nodes with only a single null-out-edge, since they may lead to
// needless duplicated nodes.
function $c8d507d90382f091$var$nullFrom(nfa, node) {
    let result = [];
    scan(node);
    return result.sort($c8d507d90382f091$var$cmp);
    function scan(node) {
        let edges = nfa[node];
        if (edges.length == 1 && !edges[0].term) return scan(edges[0].to);
        result.push(node);
        for(let i = 0; i < edges.length; i++){
            let { term: term , to: to  } = edges[i];
            if (!term && result.indexOf(to) == -1) scan(to);
        }
    }
}
// Compiles an NFA as produced by `nfa` into a DFA, modeled as a set
// of state objects (`ContentMatch` instances) with transitions
// between them.
function $c8d507d90382f091$var$dfa(nfa) {
    let labeled = Object.create(null);
    return explore($c8d507d90382f091$var$nullFrom(nfa, 0));
    function explore(states) {
        let out = [];
        states.forEach((node)=>{
            nfa[node].forEach(({ term: term , to: to  })=>{
                if (!term) return;
                let set;
                for(let i = 0; i < out.length; i++)if (out[i][0] == term) set = out[i][1];
                $c8d507d90382f091$var$nullFrom(nfa, to).forEach((node)=>{
                    if (!set) out.push([
                        term,
                        set = []
                    ]);
                    if (set.indexOf(node) == -1) set.push(node);
                });
            });
        });
        let state = labeled[states.join(",")] = new $c8d507d90382f091$export$364ed450558d7ec4(states.indexOf(nfa.length - 1) > -1);
        for(let i = 0; i < out.length; i++){
            let states1 = out[i][1].sort($c8d507d90382f091$var$cmp);
            state.next.push({
                type: out[i][0],
                next: labeled[states1.join(",")] || explore(states1)
            });
        }
        return state;
    }
}
function $c8d507d90382f091$var$checkForDeadEnds(match, stream) {
    for(let i = 0, work = [
        match
    ]; i < work.length; i++){
        let state = work[i], dead = !state.validEnd, nodes = [];
        for(let j = 0; j < state.next.length; j++){
            let { type: type , next: next  } = state.next[j];
            nodes.push(type.name);
            if (dead && !(type.isText || type.hasRequiredAttrs())) dead = false;
            if (work.indexOf(next) == -1) work.push(next);
        }
        if (dead) stream.err("Only non-generatable nodes (" + nodes.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
    }
}
// For node types where all attrs have a default value (or which don't
// have any attributes), build up a single reusable default attribute
// object, and use it for all nodes that don't specify specific
// attributes.
function $c8d507d90382f091$var$defaultAttrs(attrs) {
    let defaults = Object.create(null);
    for(let attrName in attrs){
        let attr = attrs[attrName];
        if (!attr.hasDefault) return null;
        defaults[attrName] = attr.default;
    }
    return defaults;
}
function $c8d507d90382f091$var$computeAttrs(attrs, value) {
    let built = Object.create(null);
    for(let name in attrs){
        let given = value && value[name];
        if (given === undefined) {
            let attr = attrs[name];
            if (attr.hasDefault) given = attr.default;
            else throw new RangeError("No value supplied for attribute " + name);
        }
        built[name] = given;
    }
    return built;
}
function $c8d507d90382f091$var$initAttrs(attrs) {
    let result = Object.create(null);
    if (attrs) for(let name in attrs)result[name] = new $c8d507d90382f091$var$Attribute(attrs[name]);
    return result;
}
/**
Node types are objects allocated once per `Schema` and used to
[tag](https://prosemirror.net/docs/ref/#model.Node.type) `Node` instances. They contain information
about the node type, such as its name and what kind of node it
represents.
*/ class $c8d507d90382f091$export$f06e977173f1857c {
    /**
    @internal
    */ constructor(/**
    The name the node type has in this schema.
    */ name, /**
    A link back to the `Schema` the node type belongs to.
    */ schema, /**
    The spec that this type is based on
    */ spec){
        this.name = name;
        this.schema = schema;
        this.spec = spec;
        /**
        The set of marks allowed in this node. `null` means all marks
        are allowed.
        */ this.markSet = null;
        this.groups = spec.group ? spec.group.split(" ") : [];
        this.attrs = $c8d507d90382f091$var$initAttrs(spec.attrs);
        this.defaultAttrs = $c8d507d90382f091$var$defaultAttrs(this.attrs);
        this.contentMatch = null;
        this.inlineContent = null;
        this.isBlock = !(spec.inline || name == "text");
        this.isText = name == "text";
    }
    /**
    True if this is an inline type.
    */ get isInline() {
        return !this.isBlock;
    }
    /**
    True if this is a textblock type, a block that contains inline
    content.
    */ get isTextblock() {
        return this.isBlock && this.inlineContent;
    }
    /**
    True for node types that allow no content.
    */ get isLeaf() {
        return this.contentMatch == $c8d507d90382f091$export$364ed450558d7ec4.empty;
    }
    /**
    True when this node is an atom, i.e. when it does not have
    directly editable content.
    */ get isAtom() {
        return this.isLeaf || !!this.spec.atom;
    }
    /**
    The node type's [whitespace](https://prosemirror.net/docs/ref/#model.NodeSpec.whitespace) option.
    */ get whitespace() {
        return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
    }
    /**
    Tells you whether this node type has any required attributes.
    */ hasRequiredAttrs() {
        for(let n in this.attrs)if (this.attrs[n].isRequired) return true;
        return false;
    }
    /**
    Indicates whether this node allows some of the same content as
    the given node type.
    */ compatibleContent(other) {
        return this == other || this.contentMatch.compatible(other.contentMatch);
    }
    /**
    @internal
    */ computeAttrs(attrs) {
        if (!attrs && this.defaultAttrs) return this.defaultAttrs;
        else return $c8d507d90382f091$var$computeAttrs(this.attrs, attrs);
    }
    /**
    Create a `Node` of this type. The given attributes are
    checked and defaulted (you can pass `null` to use the type's
    defaults entirely, if no required attributes exist). `content`
    may be a `Fragment`, a node, an array of nodes, or
    `null`. Similarly `marks` may be `null` to default to the empty
    set of marks.
    */ create(attrs = null, content, marks) {
        if (this.isText) throw new Error("NodeType.create can't construct text nodes");
        return new $c8d507d90382f091$export$85c928794f8d04d4(this, this.computeAttrs(attrs), $c8d507d90382f091$export$ffb0004e005737fa.from(content), $c8d507d90382f091$export$c9d15bcfc6d42044.setFrom(marks));
    }
    /**
    Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
    against the node type's content restrictions, and throw an error
    if it doesn't match.
    */ createChecked(attrs = null, content, marks) {
        content = $c8d507d90382f091$export$ffb0004e005737fa.from(content);
        this.checkContent(content);
        return new $c8d507d90382f091$export$85c928794f8d04d4(this, this.computeAttrs(attrs), content, $c8d507d90382f091$export$c9d15bcfc6d42044.setFrom(marks));
    }
    /**
    Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but see if it is
    necessary to add nodes to the start or end of the given fragment
    to make it fit the node. If no fitting wrapping can be found,
    return null. Note that, due to the fact that required nodes can
    always be created, this will always succeed if you pass null or
    `Fragment.empty` as content.
    */ createAndFill(attrs = null, content, marks) {
        attrs = this.computeAttrs(attrs);
        content = $c8d507d90382f091$export$ffb0004e005737fa.from(content);
        if (content.size) {
            let before = this.contentMatch.fillBefore(content);
            if (!before) return null;
            content = before.append(content);
        }
        let matched = this.contentMatch.matchFragment(content);
        let after = matched && matched.fillBefore($c8d507d90382f091$export$ffb0004e005737fa.empty, true);
        if (!after) return null;
        return new $c8d507d90382f091$export$85c928794f8d04d4(this, attrs, content.append(after), $c8d507d90382f091$export$c9d15bcfc6d42044.setFrom(marks));
    }
    /**
    Returns true if the given fragment is valid content for this node
    type with the given attributes.
    */ validContent(content) {
        let result = this.contentMatch.matchFragment(content);
        if (!result || !result.validEnd) return false;
        for(let i = 0; i < content.childCount; i++)if (!this.allowsMarks(content.child(i).marks)) return false;
        return true;
    }
    /**
    Throws a RangeError if the given fragment is not valid content for this
    node type.
    @internal
    */ checkContent(content) {
        if (!this.validContent(content)) throw new RangeError(`Invalid content for node ${this.name}: ${content.toString().slice(0, 50)}`);
    }
    /**
    Check whether the given mark type is allowed in this node.
    */ allowsMarkType(markType) {
        return this.markSet == null || this.markSet.indexOf(markType) > -1;
    }
    /**
    Test whether the given set of marks are allowed in this node.
    */ allowsMarks(marks) {
        if (this.markSet == null) return true;
        for(let i = 0; i < marks.length; i++)if (!this.allowsMarkType(marks[i].type)) return false;
        return true;
    }
    /**
    Removes the marks that are not allowed in this node from the given set.
    */ allowedMarks(marks) {
        if (this.markSet == null) return marks;
        let copy;
        for(let i = 0; i < marks.length; i++){
            if (!this.allowsMarkType(marks[i].type)) {
                if (!copy) copy = marks.slice(0, i);
            } else if (copy) copy.push(marks[i]);
        }
        return !copy ? marks : copy.length ? copy : $c8d507d90382f091$export$c9d15bcfc6d42044.none;
    }
    /**
    @internal
    */ static compile(nodes, schema) {
        let result = Object.create(null);
        nodes.forEach((name, spec)=>result[name] = new $c8d507d90382f091$export$f06e977173f1857c(name, schema, spec));
        let topType = schema.spec.topNode || "doc";
        if (!result[topType]) throw new RangeError("Schema is missing its top node type ('" + topType + "')");
        if (!result.text) throw new RangeError("Every schema needs a 'text' type");
        for(let _ in result.text.attrs)throw new RangeError("The text node type should not have attributes");
        return result;
    }
}
// Attribute descriptors
class $c8d507d90382f091$var$Attribute {
    constructor(options){
        this.hasDefault = Object.prototype.hasOwnProperty.call(options, "default");
        this.default = options.default;
    }
    get isRequired() {
        return !this.hasDefault;
    }
}
// Marks
/**
Like nodes, marks (which are associated with nodes to signify
things like emphasis or being part of a link) are
[tagged](https://prosemirror.net/docs/ref/#model.Mark.type) with type objects, which are
instantiated once per `Schema`.
*/ class $c8d507d90382f091$export$b6a78689043c6521 {
    /**
    @internal
    */ constructor(/**
    The name of the mark type.
    */ name, /**
    @internal
    */ rank, /**
    The schema that this mark type instance is part of.
    */ schema, /**
    The spec on which the type is based.
    */ spec){
        this.name = name;
        this.rank = rank;
        this.schema = schema;
        this.spec = spec;
        this.attrs = $c8d507d90382f091$var$initAttrs(spec.attrs);
        this.excluded = null;
        let defaults = $c8d507d90382f091$var$defaultAttrs(this.attrs);
        this.instance = defaults ? new $c8d507d90382f091$export$c9d15bcfc6d42044(this, defaults) : null;
    }
    /**
    Create a mark of this type. `attrs` may be `null` or an object
    containing only some of the mark's attributes. The others, if
    they have defaults, will be added.
    */ create(attrs = null) {
        if (!attrs && this.instance) return this.instance;
        return new $c8d507d90382f091$export$c9d15bcfc6d42044(this, $c8d507d90382f091$var$computeAttrs(this.attrs, attrs));
    }
    /**
    @internal
    */ static compile(marks, schema) {
        let result = Object.create(null), rank = 0;
        marks.forEach((name, spec)=>result[name] = new $c8d507d90382f091$export$b6a78689043c6521(name, rank++, schema, spec));
        return result;
    }
    /**
    When there is a mark of this type in the given set, a new set
    without it is returned. Otherwise, the input set is returned.
    */ removeFromSet(set) {
        for(var i = 0; i < set.length; i++)if (set[i].type == this) {
            set = set.slice(0, i).concat(set.slice(i + 1));
            i--;
        }
        return set;
    }
    /**
    Tests whether there is a mark of this type in the given set.
    */ isInSet(set) {
        for(let i = 0; i < set.length; i++)if (set[i].type == this) return set[i];
    }
    /**
    Queries whether a given mark type is
    [excluded](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) by this one.
    */ excludes(other) {
        return this.excluded.indexOf(other) > -1;
    }
}
/**
A document schema. Holds [node](https://prosemirror.net/docs/ref/#model.NodeType) and [mark
type](https://prosemirror.net/docs/ref/#model.MarkType) objects for the nodes and marks that may
occur in conforming documents, and provides functionality for
creating and deserializing such documents.

When given, the type parameters provide the names of the nodes and
marks in this schema.
*/ class $c8d507d90382f091$export$19342e026b58ebb7 {
    /**
    Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
    */ constructor(spec){
        /**
        An object for storing whatever values modules may want to
        compute and cache per schema. (If you want to store something
        in it, try to use property names unlikely to clash.)
        */ this.cached = Object.create(null);
        let instanceSpec = this.spec = {};
        for(let prop in spec)instanceSpec[prop] = spec[prop];
        instanceSpec.nodes = (0, $0280b3059275f48f$export$2e2bcd8739ae039).from(spec.nodes), instanceSpec.marks = (0, $0280b3059275f48f$export$2e2bcd8739ae039).from(spec.marks || {}), this.nodes = $c8d507d90382f091$export$f06e977173f1857c.compile(this.spec.nodes, this);
        this.marks = $c8d507d90382f091$export$b6a78689043c6521.compile(this.spec.marks, this);
        let contentExprCache = Object.create(null);
        for(let prop1 in this.nodes){
            if (prop1 in this.marks) throw new RangeError(prop1 + " can not be both a node and a mark");
            let type = this.nodes[prop1], contentExpr = type.spec.content || "", markExpr = type.spec.marks;
            type.contentMatch = contentExprCache[contentExpr] || (contentExprCache[contentExpr] = $c8d507d90382f091$export$364ed450558d7ec4.parse(contentExpr, this.nodes));
            type.inlineContent = type.contentMatch.inlineContent;
            type.markSet = markExpr == "_" ? null : markExpr ? $c8d507d90382f091$var$gatherMarks(this, markExpr.split(" ")) : markExpr == "" || !type.inlineContent ? [] : null;
        }
        for(let prop2 in this.marks){
            let type1 = this.marks[prop2], excl = type1.spec.excludes;
            type1.excluded = excl == null ? [
                type1
            ] : excl == "" ? [] : $c8d507d90382f091$var$gatherMarks(this, excl.split(" "));
        }
        this.nodeFromJSON = this.nodeFromJSON.bind(this);
        this.markFromJSON = this.markFromJSON.bind(this);
        this.topNodeType = this.nodes[this.spec.topNode || "doc"];
        this.cached.wrappings = Object.create(null);
    }
    /**
    Create a node in this schema. The `type` may be a string or a
    `NodeType` instance. Attributes will be extended with defaults,
    `content` may be a `Fragment`, `null`, a `Node`, or an array of
    nodes.
    */ node(type, attrs = null, content, marks) {
        if (typeof type == "string") type = this.nodeType(type);
        else if (!(type instanceof $c8d507d90382f091$export$f06e977173f1857c)) throw new RangeError("Invalid node type: " + type);
        else if (type.schema != this) throw new RangeError("Node type from different schema used (" + type.name + ")");
        return type.createChecked(attrs, content, marks);
    }
    /**
    Create a text node in the schema. Empty text nodes are not
    allowed.
    */ text(text, marks) {
        let type = this.nodes.text;
        return new $c8d507d90382f091$var$TextNode(type, type.defaultAttrs, text, $c8d507d90382f091$export$c9d15bcfc6d42044.setFrom(marks));
    }
    /**
    Create a mark with the given type and attributes.
    */ mark(type, attrs) {
        if (typeof type == "string") type = this.marks[type];
        return type.create(attrs);
    }
    /**
    Deserialize a node from its JSON representation. This method is
    bound.
    */ nodeFromJSON(json) {
        return $c8d507d90382f091$export$85c928794f8d04d4.fromJSON(this, json);
    }
    /**
    Deserialize a mark from its JSON representation. This method is
    bound.
    */ markFromJSON(json) {
        return $c8d507d90382f091$export$c9d15bcfc6d42044.fromJSON(this, json);
    }
    /**
    @internal
    */ nodeType(name) {
        let found = this.nodes[name];
        if (!found) throw new RangeError("Unknown node type: " + name);
        return found;
    }
}
function $c8d507d90382f091$var$gatherMarks(schema, marks) {
    let found = [];
    for(let i = 0; i < marks.length; i++){
        let name = marks[i], mark = schema.marks[name], ok = mark;
        if (mark) found.push(mark);
        else for(let prop in schema.marks){
            let mark1 = schema.marks[prop];
            if (name == "_" || mark1.spec.group && mark1.spec.group.split(" ").indexOf(name) > -1) found.push(ok = mark1);
        }
        if (!ok) throw new SyntaxError("Unknown mark type: '" + marks[i] + "'");
    }
    return found;
}
/**
A DOM parser represents a strategy for parsing DOM content into a
ProseMirror document conforming to a given schema. Its behavior is
defined by an array of [rules](https://prosemirror.net/docs/ref/#model.ParseRule).
*/ class $c8d507d90382f091$export$1059c6e7d2ce5669 {
    /**
    Create a parser that targets the given schema, using the given
    parsing rules.
    */ constructor(/**
    The schema into which the parser parses.
    */ schema, /**
    The set of [parse rules](https://prosemirror.net/docs/ref/#model.ParseRule) that the parser
    uses, in order of precedence.
    */ rules){
        this.schema = schema;
        this.rules = rules;
        /**
        @internal
        */ this.tags = [];
        /**
        @internal
        */ this.styles = [];
        rules.forEach((rule)=>{
            if (rule.tag) this.tags.push(rule);
            else if (rule.style) this.styles.push(rule);
        });
        // Only normalize list elements when lists in the schema can't directly contain themselves
        this.normalizeLists = !this.tags.some((r)=>{
            if (!/^(ul|ol)\b/.test(r.tag) || !r.node) return false;
            let node = schema.nodes[r.node];
            return node.contentMatch.matchType(node);
        });
    }
    /**
    Parse a document from the content of a DOM node.
    */ parse(dom, options = {}) {
        let context = new $c8d507d90382f091$var$ParseContext(this, options, false);
        context.addAll(dom, options.from, options.to);
        return context.finish();
    }
    /**
    Parses the content of the given DOM node, like
    [`parse`](https://prosemirror.net/docs/ref/#model.DOMParser.parse), and takes the same set of
    options. But unlike that method, which produces a whole node,
    this one returns a slice that is open at the sides, meaning that
    the schema constraints aren't applied to the start of nodes to
    the left of the input and the end of nodes at the end.
    */ parseSlice(dom, options = {}) {
        let context = new $c8d507d90382f091$var$ParseContext(this, options, true);
        context.addAll(dom, options.from, options.to);
        return $c8d507d90382f091$export$b3f2e2de3a8baa1e.maxOpen(context.finish());
    }
    /**
    @internal
    */ matchTag(dom, context, after) {
        for(let i = after ? this.tags.indexOf(after) + 1 : 0; i < this.tags.length; i++){
            let rule = this.tags[i];
            if ($c8d507d90382f091$var$matches(dom, rule.tag) && (rule.namespace === undefined || dom.namespaceURI == rule.namespace) && (!rule.context || context.matchesContext(rule.context))) {
                if (rule.getAttrs) {
                    let result = rule.getAttrs(dom);
                    if (result === false) continue;
                    rule.attrs = result || undefined;
                }
                return rule;
            }
        }
    }
    /**
    @internal
    */ matchStyle(prop, value, context, after) {
        for(let i = after ? this.styles.indexOf(after) + 1 : 0; i < this.styles.length; i++){
            let rule = this.styles[i], style = rule.style;
            if (style.indexOf(prop) != 0 || rule.context && !context.matchesContext(rule.context) || // Test that the style string either precisely matches the prop,
            // or has an '=' sign after the prop, followed by the given
            // value.
            style.length > prop.length && (style.charCodeAt(prop.length) != 61 || style.slice(prop.length + 1) != value)) continue;
            if (rule.getAttrs) {
                let result = rule.getAttrs(value);
                if (result === false) continue;
                rule.attrs = result || undefined;
            }
            return rule;
        }
    }
    /**
    @internal
    */ static schemaRules(schema) {
        let result = [];
        function insert(rule) {
            let priority = rule.priority == null ? 50 : rule.priority, i = 0;
            for(; i < result.length; i++){
                let next = result[i], nextPriority = next.priority == null ? 50 : next.priority;
                if (nextPriority < priority) break;
            }
            result.splice(i, 0, rule);
        }
        for(let name in schema.marks){
            let rules = schema.marks[name].spec.parseDOM;
            if (rules) rules.forEach((rule)=>{
                insert(rule = $c8d507d90382f091$var$copy(rule));
                rule.mark = name;
            });
        }
        for(let name1 in schema.nodes){
            let rules1 = schema.nodes[name1].spec.parseDOM;
            if (rules1) rules1.forEach((rule)=>{
                insert(rule = $c8d507d90382f091$var$copy(rule));
                rule.node = name1;
            });
        }
        return result;
    }
    /**
    Construct a DOM parser using the parsing rules listed in a
    schema's [node specs](https://prosemirror.net/docs/ref/#model.NodeSpec.parseDOM), reordered by
    [priority](https://prosemirror.net/docs/ref/#model.ParseRule.priority).
    */ static fromSchema(schema) {
        return schema.cached.domParser || (schema.cached.domParser = new $c8d507d90382f091$export$1059c6e7d2ce5669(schema, $c8d507d90382f091$export$1059c6e7d2ce5669.schemaRules(schema)));
    }
}
const $c8d507d90382f091$var$blockTags = {
    address: true,
    article: true,
    aside: true,
    blockquote: true,
    canvas: true,
    dd: true,
    div: true,
    dl: true,
    fieldset: true,
    figcaption: true,
    figure: true,
    footer: true,
    form: true,
    h1: true,
    h2: true,
    h3: true,
    h4: true,
    h5: true,
    h6: true,
    header: true,
    hgroup: true,
    hr: true,
    li: true,
    noscript: true,
    ol: true,
    output: true,
    p: true,
    pre: true,
    section: true,
    table: true,
    tfoot: true,
    ul: true
};
const $c8d507d90382f091$var$ignoreTags = {
    head: true,
    noscript: true,
    object: true,
    script: true,
    style: true,
    title: true
};
const $c8d507d90382f091$var$listTags = {
    ol: true,
    ul: true
};
// Using a bitfield for node context options
const $c8d507d90382f091$var$OPT_PRESERVE_WS = 1, $c8d507d90382f091$var$OPT_PRESERVE_WS_FULL = 2, $c8d507d90382f091$var$OPT_OPEN_LEFT = 4;
function $c8d507d90382f091$var$wsOptionsFor(type, preserveWhitespace, base) {
    if (preserveWhitespace != null) return (preserveWhitespace ? $c8d507d90382f091$var$OPT_PRESERVE_WS : 0) | (preserveWhitespace === "full" ? $c8d507d90382f091$var$OPT_PRESERVE_WS_FULL : 0);
    return type && type.whitespace == "pre" ? $c8d507d90382f091$var$OPT_PRESERVE_WS | $c8d507d90382f091$var$OPT_PRESERVE_WS_FULL : base & ~$c8d507d90382f091$var$OPT_OPEN_LEFT;
}
class $c8d507d90382f091$var$NodeContext {
    constructor(type, attrs, // Marks applied to this node itself
    marks, // Marks that can't apply here, but will be used in children if possible
    pendingMarks, solid, match, options){
        this.type = type;
        this.attrs = attrs;
        this.marks = marks;
        this.pendingMarks = pendingMarks;
        this.solid = solid;
        this.options = options;
        this.content = [];
        // Marks applied to the node's children
        this.activeMarks = $c8d507d90382f091$export$c9d15bcfc6d42044.none;
        // Nested Marks with same type
        this.stashMarks = [];
        this.match = match || (options & $c8d507d90382f091$var$OPT_OPEN_LEFT ? null : type.contentMatch);
    }
    findWrapping(node) {
        if (!this.match) {
            if (!this.type) return [];
            let fill = this.type.contentMatch.fillBefore($c8d507d90382f091$export$ffb0004e005737fa.from(node));
            if (fill) this.match = this.type.contentMatch.matchFragment(fill);
            else {
                let start = this.type.contentMatch, wrap;
                if (wrap = start.findWrapping(node.type)) {
                    this.match = start;
                    return wrap;
                } else return null;
            }
        }
        return this.match.findWrapping(node.type);
    }
    finish(openEnd) {
        if (!(this.options & $c8d507d90382f091$var$OPT_PRESERVE_WS)) {
            let last = this.content[this.content.length - 1], m;
            if (last && last.isText && (m = /[ \t\r\n\u000c]+$/.exec(last.text))) {
                let text = last;
                if (last.text.length == m[0].length) this.content.pop();
                else this.content[this.content.length - 1] = text.withText(text.text.slice(0, text.text.length - m[0].length));
            }
        }
        let content = $c8d507d90382f091$export$ffb0004e005737fa.from(this.content);
        if (!openEnd && this.match) content = content.append(this.match.fillBefore($c8d507d90382f091$export$ffb0004e005737fa.empty, true));
        return this.type ? this.type.create(this.attrs, content, this.marks) : content;
    }
    popFromStashMark(mark) {
        for(let i = this.stashMarks.length - 1; i >= 0; i--)if (mark.eq(this.stashMarks[i])) return this.stashMarks.splice(i, 1)[0];
    }
    applyPending(nextType) {
        for(let i = 0, pending = this.pendingMarks; i < pending.length; i++){
            let mark = pending[i];
            if ((this.type ? this.type.allowsMarkType(mark.type) : $c8d507d90382f091$var$markMayApply(mark.type, nextType)) && !mark.isInSet(this.activeMarks)) {
                this.activeMarks = mark.addToSet(this.activeMarks);
                this.pendingMarks = mark.removeFromSet(this.pendingMarks);
            }
        }
    }
    inlineContext(node) {
        if (this.type) return this.type.inlineContent;
        if (this.content.length) return this.content[0].isInline;
        return node.parentNode && !$c8d507d90382f091$var$blockTags.hasOwnProperty(node.parentNode.nodeName.toLowerCase());
    }
}
class $c8d507d90382f091$var$ParseContext {
    constructor(// The parser we are using.
    parser, // The options passed to this parse.
    options, isOpen){
        this.parser = parser;
        this.options = options;
        this.isOpen = isOpen;
        this.open = 0;
        let topNode = options.topNode, topContext;
        let topOptions = $c8d507d90382f091$var$wsOptionsFor(null, options.preserveWhitespace, 0) | (isOpen ? $c8d507d90382f091$var$OPT_OPEN_LEFT : 0);
        if (topNode) topContext = new $c8d507d90382f091$var$NodeContext(topNode.type, topNode.attrs, $c8d507d90382f091$export$c9d15bcfc6d42044.none, $c8d507d90382f091$export$c9d15bcfc6d42044.none, true, options.topMatch || topNode.type.contentMatch, topOptions);
        else if (isOpen) topContext = new $c8d507d90382f091$var$NodeContext(null, null, $c8d507d90382f091$export$c9d15bcfc6d42044.none, $c8d507d90382f091$export$c9d15bcfc6d42044.none, true, null, topOptions);
        else topContext = new $c8d507d90382f091$var$NodeContext(parser.schema.topNodeType, null, $c8d507d90382f091$export$c9d15bcfc6d42044.none, $c8d507d90382f091$export$c9d15bcfc6d42044.none, true, null, topOptions);
        this.nodes = [
            topContext
        ];
        this.find = options.findPositions;
        this.needsBlock = false;
    }
    get top() {
        return this.nodes[this.open];
    }
    // Add a DOM node to the content. Text is inserted as text node,
    // otherwise, the node is passed to `addElement` or, if it has a
    // `style` attribute, `addElementWithStyles`.
    addDOM(dom) {
        if (dom.nodeType == 3) this.addTextNode(dom);
        else if (dom.nodeType == 1) {
            let style = dom.getAttribute("style");
            let marks = style ? this.readStyles($c8d507d90382f091$var$parseStyles(style)) : null, top = this.top;
            if (marks != null) for(let i = 0; i < marks.length; i++)this.addPendingMark(marks[i]);
            this.addElement(dom);
            if (marks != null) for(let i1 = 0; i1 < marks.length; i1++)this.removePendingMark(marks[i1], top);
        }
    }
    addTextNode(dom) {
        let value = dom.nodeValue;
        let top = this.top;
        if (top.options & $c8d507d90382f091$var$OPT_PRESERVE_WS_FULL || top.inlineContext(dom) || /[^ \t\r\n\u000c]/.test(value)) {
            if (!(top.options & $c8d507d90382f091$var$OPT_PRESERVE_WS)) {
                value = value.replace(/[ \t\r\n\u000c]+/g, " ");
                // If this starts with whitespace, and there is no node before it, or
                // a hard break, or a text node that ends with whitespace, strip the
                // leading space.
                if (/^[ \t\r\n\u000c]/.test(value) && this.open == this.nodes.length - 1) {
                    let nodeBefore = top.content[top.content.length - 1];
                    let domNodeBefore = dom.previousSibling;
                    if (!nodeBefore || domNodeBefore && domNodeBefore.nodeName == "BR" || nodeBefore.isText && /[ \t\r\n\u000c]$/.test(nodeBefore.text)) value = value.slice(1);
                }
            } else if (!(top.options & $c8d507d90382f091$var$OPT_PRESERVE_WS_FULL)) value = value.replace(/\r?\n|\r/g, " ");
            else value = value.replace(/\r\n?/g, "\n");
            if (value) this.insertNode(this.parser.schema.text(value));
            this.findInText(dom);
        } else this.findInside(dom);
    }
    // Try to find a handler for the given tag and use that to parse. If
    // none is found, the element's content nodes are added directly.
    addElement(dom, matchAfter) {
        let name = dom.nodeName.toLowerCase(), ruleID;
        if ($c8d507d90382f091$var$listTags.hasOwnProperty(name) && this.parser.normalizeLists) $c8d507d90382f091$var$normalizeList(dom);
        let rule = this.options.ruleFromNode && this.options.ruleFromNode(dom) || (ruleID = this.parser.matchTag(dom, this, matchAfter));
        if (rule ? rule.ignore : $c8d507d90382f091$var$ignoreTags.hasOwnProperty(name)) {
            this.findInside(dom);
            this.ignoreFallback(dom);
        } else if (!rule || rule.skip || rule.closeParent) {
            if (rule && rule.closeParent) this.open = Math.max(0, this.open - 1);
            else if (rule && rule.skip.nodeType) dom = rule.skip;
            let sync, top = this.top, oldNeedsBlock = this.needsBlock;
            if ($c8d507d90382f091$var$blockTags.hasOwnProperty(name)) {
                if (top.content.length && top.content[0].isInline && this.open) {
                    this.open--;
                    top = this.top;
                }
                sync = true;
                if (!top.type) this.needsBlock = true;
            } else if (!dom.firstChild) {
                this.leafFallback(dom);
                return;
            }
            this.addAll(dom);
            if (sync) this.sync(top);
            this.needsBlock = oldNeedsBlock;
        } else this.addElementByRule(dom, rule, rule.consuming === false ? ruleID : undefined);
    }
    // Called for leaf DOM nodes that would otherwise be ignored
    leafFallback(dom) {
        if (dom.nodeName == "BR" && this.top.type && this.top.type.inlineContent) this.addTextNode(dom.ownerDocument.createTextNode("\n"));
    }
    // Called for ignored nodes
    ignoreFallback(dom) {
        // Ignored BR nodes should at least create an inline context
        if (dom.nodeName == "BR" && (!this.top.type || !this.top.type.inlineContent)) this.findPlace(this.parser.schema.text("-"));
    }
    // Run any style parser associated with the node's styles. Either
    // return an array of marks, or null to indicate some of the styles
    // had a rule with `ignore` set.
    readStyles(styles) {
        let marks = $c8d507d90382f091$export$c9d15bcfc6d42044.none;
        style: for(let i = 0; i < styles.length; i += 2)for(let after = undefined;;){
            let rule = this.parser.matchStyle(styles[i], styles[i + 1], this, after);
            if (!rule) continue style;
            if (rule.ignore) return null;
            marks = this.parser.schema.marks[rule.mark].create(rule.attrs).addToSet(marks);
            if (rule.consuming === false) after = rule;
            else break;
        }
        return marks;
    }
    // Look up a handler for the given node. If none are found, return
    // false. Otherwise, apply it, use its return value to drive the way
    // the node's content is wrapped, and return true.
    addElementByRule(dom, rule, continueAfter) {
        let sync, nodeType, mark;
        if (rule.node) {
            nodeType = this.parser.schema.nodes[rule.node];
            if (!nodeType.isLeaf) sync = this.enter(nodeType, rule.attrs || null, rule.preserveWhitespace);
            else if (!this.insertNode(nodeType.create(rule.attrs))) this.leafFallback(dom);
        } else {
            let markType = this.parser.schema.marks[rule.mark];
            mark = markType.create(rule.attrs);
            this.addPendingMark(mark);
        }
        let startIn = this.top;
        if (nodeType && nodeType.isLeaf) this.findInside(dom);
        else if (continueAfter) this.addElement(dom, continueAfter);
        else if (rule.getContent) {
            this.findInside(dom);
            rule.getContent(dom, this.parser.schema).forEach((node)=>this.insertNode(node));
        } else {
            let contentDOM = dom;
            if (typeof rule.contentElement == "string") contentDOM = dom.querySelector(rule.contentElement);
            else if (typeof rule.contentElement == "function") contentDOM = rule.contentElement(dom);
            else if (rule.contentElement) contentDOM = rule.contentElement;
            this.findAround(dom, contentDOM, true);
            this.addAll(contentDOM);
        }
        if (sync && this.sync(startIn)) this.open--;
        if (mark) this.removePendingMark(mark, startIn);
    }
    // Add all child nodes between `startIndex` and `endIndex` (or the
    // whole node, if not given). If `sync` is passed, use it to
    // synchronize after every block element.
    addAll(parent, startIndex, endIndex) {
        let index = startIndex || 0;
        for(let dom = startIndex ? parent.childNodes[startIndex] : parent.firstChild, end = endIndex == null ? null : parent.childNodes[endIndex]; dom != end; dom = dom.nextSibling, ++index){
            this.findAtPoint(parent, index);
            this.addDOM(dom);
        }
        this.findAtPoint(parent, index);
    }
    // Try to find a way to fit the given node type into the current
    // context. May add intermediate wrappers and/or leave non-solid
    // nodes that we're in.
    findPlace(node) {
        let route, sync;
        for(let depth = this.open; depth >= 0; depth--){
            let cx = this.nodes[depth];
            let found = cx.findWrapping(node);
            if (found && (!route || route.length > found.length)) {
                route = found;
                sync = cx;
                if (!found.length) break;
            }
            if (cx.solid) break;
        }
        if (!route) return false;
        this.sync(sync);
        for(let i = 0; i < route.length; i++)this.enterInner(route[i], null, false);
        return true;
    }
    // Try to insert the given node, adjusting the context when needed.
    insertNode(node) {
        if (node.isInline && this.needsBlock && !this.top.type) {
            let block = this.textblockFromContext();
            if (block) this.enterInner(block);
        }
        if (this.findPlace(node)) {
            this.closeExtra();
            let top = this.top;
            top.applyPending(node.type);
            if (top.match) top.match = top.match.matchType(node.type);
            let marks = top.activeMarks;
            for(let i = 0; i < node.marks.length; i++)if (!top.type || top.type.allowsMarkType(node.marks[i].type)) marks = node.marks[i].addToSet(marks);
            top.content.push(node.mark(marks));
            return true;
        }
        return false;
    }
    // Try to start a node of the given type, adjusting the context when
    // necessary.
    enter(type, attrs, preserveWS) {
        let ok = this.findPlace(type.create(attrs));
        if (ok) this.enterInner(type, attrs, true, preserveWS);
        return ok;
    }
    // Open a node of the given type
    enterInner(type, attrs = null, solid = false, preserveWS) {
        this.closeExtra();
        let top = this.top;
        top.applyPending(type);
        top.match = top.match && top.match.matchType(type);
        let options = $c8d507d90382f091$var$wsOptionsFor(type, preserveWS, top.options);
        if (top.options & $c8d507d90382f091$var$OPT_OPEN_LEFT && top.content.length == 0) options |= $c8d507d90382f091$var$OPT_OPEN_LEFT;
        this.nodes.push(new $c8d507d90382f091$var$NodeContext(type, attrs, top.activeMarks, top.pendingMarks, solid, null, options));
        this.open++;
    }
    // Make sure all nodes above this.open are finished and added to
    // their parents
    closeExtra(openEnd = false) {
        let i = this.nodes.length - 1;
        if (i > this.open) {
            for(; i > this.open; i--)this.nodes[i - 1].content.push(this.nodes[i].finish(openEnd));
            this.nodes.length = this.open + 1;
        }
    }
    finish() {
        this.open = 0;
        this.closeExtra(this.isOpen);
        return this.nodes[0].finish(this.isOpen || this.options.topOpen);
    }
    sync(to) {
        for(let i = this.open; i >= 0; i--)if (this.nodes[i] == to) {
            this.open = i;
            return true;
        }
        return false;
    }
    get currentPos() {
        this.closeExtra();
        let pos = 0;
        for(let i = this.open; i >= 0; i--){
            let content = this.nodes[i].content;
            for(let j = content.length - 1; j >= 0; j--)pos += content[j].nodeSize;
            if (i) pos++;
        }
        return pos;
    }
    findAtPoint(parent, offset) {
        if (this.find) {
            for(let i = 0; i < this.find.length; i++)if (this.find[i].node == parent && this.find[i].offset == offset) this.find[i].pos = this.currentPos;
        }
    }
    findInside(parent) {
        if (this.find) {
            for(let i = 0; i < this.find.length; i++)if (this.find[i].pos == null && parent.nodeType == 1 && parent.contains(this.find[i].node)) this.find[i].pos = this.currentPos;
        }
    }
    findAround(parent, content, before) {
        if (parent != content && this.find) {
            for(let i = 0; i < this.find.length; i++)if (this.find[i].pos == null && parent.nodeType == 1 && parent.contains(this.find[i].node)) {
                let pos = content.compareDocumentPosition(this.find[i].node);
                if (pos & (before ? 2 : 4)) this.find[i].pos = this.currentPos;
            }
        }
    }
    findInText(textNode) {
        if (this.find) {
            for(let i = 0; i < this.find.length; i++)if (this.find[i].node == textNode) this.find[i].pos = this.currentPos - (textNode.nodeValue.length - this.find[i].offset);
        }
    }
    // Determines whether the given context string matches this context.
    matchesContext(context) {
        if (context.indexOf("|") > -1) return context.split(/\s*\|\s*/).some(this.matchesContext, this);
        let parts = context.split("/");
        let option = this.options.context;
        let useRoot = !this.isOpen && (!option || option.parent.type == this.nodes[0].type);
        let minDepth = -(option ? option.depth + 1 : 0) + (useRoot ? 0 : 1);
        let match = (i, depth)=>{
            for(; i >= 0; i--){
                let part = parts[i];
                if (part == "") {
                    if (i == parts.length - 1 || i == 0) continue;
                    for(; depth >= minDepth; depth--)if (match(i - 1, depth)) return true;
                    return false;
                } else {
                    let next = depth > 0 || depth == 0 && useRoot ? this.nodes[depth].type : option && depth >= minDepth ? option.node(depth - minDepth).type : null;
                    if (!next || next.name != part && next.groups.indexOf(part) == -1) return false;
                    depth--;
                }
            }
            return true;
        };
        return match(parts.length - 1, this.open);
    }
    textblockFromContext() {
        let $context = this.options.context;
        if ($context) for(let d = $context.depth; d >= 0; d--){
            let deflt = $context.node(d).contentMatchAt($context.indexAfter(d)).defaultType;
            if (deflt && deflt.isTextblock && deflt.defaultAttrs) return deflt;
        }
        for(let name in this.parser.schema.nodes){
            let type = this.parser.schema.nodes[name];
            if (type.isTextblock && type.defaultAttrs) return type;
        }
    }
    addPendingMark(mark) {
        let found = $c8d507d90382f091$var$findSameMarkInSet(mark, this.top.pendingMarks);
        if (found) this.top.stashMarks.push(found);
        this.top.pendingMarks = mark.addToSet(this.top.pendingMarks);
    }
    removePendingMark(mark, upto) {
        for(let depth = this.open; depth >= 0; depth--){
            let level = this.nodes[depth];
            let found = level.pendingMarks.lastIndexOf(mark);
            if (found > -1) level.pendingMarks = mark.removeFromSet(level.pendingMarks);
            else {
                level.activeMarks = mark.removeFromSet(level.activeMarks);
                let stashMark = level.popFromStashMark(mark);
                if (stashMark && level.type && level.type.allowsMarkType(stashMark.type)) level.activeMarks = stashMark.addToSet(level.activeMarks);
            }
            if (level == upto) break;
        }
    }
}
// Kludge to work around directly nested list nodes produced by some
// tools and allowed by browsers to mean that the nested list is
// actually part of the list item above it.
function $c8d507d90382f091$var$normalizeList(dom) {
    for(let child = dom.firstChild, prevItem = null; child; child = child.nextSibling){
        let name = child.nodeType == 1 ? child.nodeName.toLowerCase() : null;
        if (name && $c8d507d90382f091$var$listTags.hasOwnProperty(name) && prevItem) {
            prevItem.appendChild(child);
            child = prevItem;
        } else if (name == "li") prevItem = child;
        else if (name) prevItem = null;
    }
}
// Apply a CSS selector.
function $c8d507d90382f091$var$matches(dom, selector) {
    return (dom.matches || dom.msMatchesSelector || dom.webkitMatchesSelector || dom.mozMatchesSelector).call(dom, selector);
}
// Tokenize a style attribute into property/value pairs.
function $c8d507d90382f091$var$parseStyles(style) {
    let re = /\s*([\w-]+)\s*:\s*([^;]+)/g, m, result = [];
    while(m = re.exec(style))result.push(m[1], m[2].trim());
    return result;
}
function $c8d507d90382f091$var$copy(obj) {
    let copy = {};
    for(let prop in obj)copy[prop] = obj[prop];
    return copy;
}
// Used when finding a mark at the top level of a fragment parse.
// Checks whether it would be reasonable to apply a given mark type to
// a given node, by looking at the way the mark occurs in the schema.
function $c8d507d90382f091$var$markMayApply(markType, nodeType) {
    let nodes = nodeType.schema.nodes;
    for(let name in nodes){
        let parent = nodes[name];
        if (!parent.allowsMarkType(markType)) continue;
        let seen = [], scan = (match)=>{
            seen.push(match);
            for(let i = 0; i < match.edgeCount; i++){
                let { type: type , next: next  } = match.edge(i);
                if (type == nodeType) return true;
                if (seen.indexOf(next) < 0 && scan(next)) return true;
            }
        };
        if (scan(parent.contentMatch)) return true;
    }
}
function $c8d507d90382f091$var$findSameMarkInSet(mark, set) {
    for(let i = 0; i < set.length; i++){
        if (mark.eq(set[i])) return set[i];
    }
}
/**
A DOM serializer knows how to convert ProseMirror nodes and
marks of various types to DOM nodes.
*/ class $c8d507d90382f091$export$3476b78f8f5a8b72 {
    /**
    Create a serializer. `nodes` should map node names to functions
    that take a node and return a description of the corresponding
    DOM. `marks` does the same for mark names, but also gets an
    argument that tells it whether the mark's content is block or
    inline content (for typical use, it'll always be inline). A mark
    serializer may be `null` to indicate that marks of that type
    should not be serialized.
    */ constructor(/**
    The node serialization functions.
    */ nodes, /**
    The mark serialization functions.
    */ marks){
        this.nodes = nodes;
        this.marks = marks;
    }
    /**
    Serialize the content of this fragment to a DOM fragment. When
    not in the browser, the `document` option, containing a DOM
    document, should be passed so that the serializer can create
    nodes.
    */ serializeFragment(fragment, options = {}, target) {
        if (!target) target = $c8d507d90382f091$var$doc(options).createDocumentFragment();
        let top = target, active = [];
        fragment.forEach((node)=>{
            if (active.length || node.marks.length) {
                let keep = 0, rendered = 0;
                while(keep < active.length && rendered < node.marks.length){
                    let next = node.marks[rendered];
                    if (!this.marks[next.type.name]) {
                        rendered++;
                        continue;
                    }
                    if (!next.eq(active[keep][0]) || next.type.spec.spanning === false) break;
                    keep++;
                    rendered++;
                }
                while(keep < active.length)top = active.pop()[1];
                while(rendered < node.marks.length){
                    let add = node.marks[rendered++];
                    let markDOM = this.serializeMark(add, node.isInline, options);
                    if (markDOM) {
                        active.push([
                            add,
                            top
                        ]);
                        top.appendChild(markDOM.dom);
                        top = markDOM.contentDOM || markDOM.dom;
                    }
                }
            }
            top.appendChild(this.serializeNodeInner(node, options));
        });
        return target;
    }
    /**
    @internal
    */ serializeNodeInner(node, options) {
        let { dom: dom , contentDOM: contentDOM  } = $c8d507d90382f091$export$3476b78f8f5a8b72.renderSpec($c8d507d90382f091$var$doc(options), this.nodes[node.type.name](node));
        if (contentDOM) {
            if (node.isLeaf) throw new RangeError("Content hole not allowed in a leaf node spec");
            this.serializeFragment(node.content, options, contentDOM);
        }
        return dom;
    }
    /**
    Serialize this node to a DOM node. This can be useful when you
    need to serialize a part of a document, as opposed to the whole
    document. To serialize a whole document, use
    [`serializeFragment`](https://prosemirror.net/docs/ref/#model.DOMSerializer.serializeFragment) on
    its [content](https://prosemirror.net/docs/ref/#model.Node.content).
    */ serializeNode(node, options = {}) {
        let dom = this.serializeNodeInner(node, options);
        for(let i = node.marks.length - 1; i >= 0; i--){
            let wrap = this.serializeMark(node.marks[i], node.isInline, options);
            if (wrap) {
                (wrap.contentDOM || wrap.dom).appendChild(dom);
                dom = wrap.dom;
            }
        }
        return dom;
    }
    /**
    @internal
    */ serializeMark(mark, inline, options = {}) {
        let toDOM = this.marks[mark.type.name];
        return toDOM && $c8d507d90382f091$export$3476b78f8f5a8b72.renderSpec($c8d507d90382f091$var$doc(options), toDOM(mark, inline));
    }
    /**
    Render an [output spec](https://prosemirror.net/docs/ref/#model.DOMOutputSpec) to a DOM node. If
    the spec has a hole (zero) in it, `contentDOM` will point at the
    node with the hole.
    */ static renderSpec(doc, structure, xmlNS = null) {
        if (typeof structure == "string") return {
            dom: doc.createTextNode(structure)
        };
        if (structure.nodeType != null) return {
            dom: structure
        };
        if (structure.dom && structure.dom.nodeType != null) return structure;
        let tagName = structure[0], space = tagName.indexOf(" ");
        if (space > 0) {
            xmlNS = tagName.slice(0, space);
            tagName = tagName.slice(space + 1);
        }
        let contentDOM;
        let dom = xmlNS ? doc.createElementNS(xmlNS, tagName) : doc.createElement(tagName);
        let attrs = structure[1], start = 1;
        if (attrs && typeof attrs == "object" && attrs.nodeType == null && !Array.isArray(attrs)) {
            start = 2;
            for(let name in attrs)if (attrs[name] != null) {
                let space1 = name.indexOf(" ");
                if (space1 > 0) dom.setAttributeNS(name.slice(0, space1), name.slice(space1 + 1), attrs[name]);
                else dom.setAttribute(name, attrs[name]);
            }
        }
        for(let i = start; i < structure.length; i++){
            let child = structure[i];
            if (child === 0) {
                if (i < structure.length - 1 || i > start) throw new RangeError("Content hole must be the only child of its parent node");
                return {
                    dom: dom,
                    contentDOM: dom
                };
            } else {
                let { dom: inner , contentDOM: innerContent  } = $c8d507d90382f091$export$3476b78f8f5a8b72.renderSpec(doc, child, xmlNS);
                dom.appendChild(inner);
                if (innerContent) {
                    if (contentDOM) throw new RangeError("Multiple content holes");
                    contentDOM = innerContent;
                }
            }
        }
        return {
            dom: dom,
            contentDOM: contentDOM
        };
    }
    /**
    Build a serializer using the [`toDOM`](https://prosemirror.net/docs/ref/#model.NodeSpec.toDOM)
    properties in a schema's node and mark specs.
    */ static fromSchema(schema) {
        return schema.cached.domSerializer || (schema.cached.domSerializer = new $c8d507d90382f091$export$3476b78f8f5a8b72(this.nodesFromSchema(schema), this.marksFromSchema(schema)));
    }
    /**
    Gather the serializers in a schema's node specs into an object.
    This can be useful as a base to build a custom serializer from.
    */ static nodesFromSchema(schema) {
        let result = $c8d507d90382f091$var$gatherToDOM(schema.nodes);
        if (!result.text) result.text = (node)=>node.text;
        return result;
    }
    /**
    Gather the serializers in a schema's mark specs into an object.
    */ static marksFromSchema(schema) {
        return $c8d507d90382f091$var$gatherToDOM(schema.marks);
    }
}
function $c8d507d90382f091$var$gatherToDOM(obj) {
    let result = {};
    for(let name in obj){
        let toDOM = obj[name].spec.toDOM;
        if (toDOM) result[name] = toDOM;
    }
    return result;
}
function $c8d507d90382f091$var$doc(options) {
    return options.document || window.document;
}



// Recovery values encode a range index and an offset. They are
// represented as numbers, because tons of them will be created when
// mapping, for example, a large number of decorations. The number's
// lower 16 bits provide the index, the remaining bits the offset.
//
// Note: We intentionally don't use bit shift operators to en- and
// decode these, since those clip to 32 bits, which we might in rare
// cases want to overflow. A 64-bit float can represent 48-bit
// integers precisely.
const $5dfe06a1d53a4883$var$lower16 = 0xffff;
const $5dfe06a1d53a4883$var$factor16 = Math.pow(2, 16);
function $5dfe06a1d53a4883$var$makeRecover(index, offset) {
    return index + offset * $5dfe06a1d53a4883$var$factor16;
}
function $5dfe06a1d53a4883$var$recoverIndex(value) {
    return value & $5dfe06a1d53a4883$var$lower16;
}
function $5dfe06a1d53a4883$var$recoverOffset(value) {
    return (value - (value & $5dfe06a1d53a4883$var$lower16)) / $5dfe06a1d53a4883$var$factor16;
}
const $5dfe06a1d53a4883$var$DEL_BEFORE = 1, $5dfe06a1d53a4883$var$DEL_AFTER = 2, $5dfe06a1d53a4883$var$DEL_ACROSS = 4, $5dfe06a1d53a4883$var$DEL_SIDE = 8;
/**
An object representing a mapped position with extra
information.
*/ class $5dfe06a1d53a4883$export$c77c9be41668e9b4 {
    /**
    @internal
    */ constructor(/**
    The mapped version of the position.
    */ pos, /**
    @internal
    */ delInfo, /**
    @internal
    */ recover){
        this.pos = pos;
        this.delInfo = delInfo;
        this.recover = recover;
    }
    /**
    Tells you whether the position was deleted, that is, whether the
    step removed the token on the side queried (via the `assoc`)
    argument from the document.
    */ get deleted() {
        return (this.delInfo & $5dfe06a1d53a4883$var$DEL_SIDE) > 0;
    }
    /**
    Tells you whether the token before the mapped position was deleted.
    */ get deletedBefore() {
        return (this.delInfo & ($5dfe06a1d53a4883$var$DEL_BEFORE | $5dfe06a1d53a4883$var$DEL_ACROSS)) > 0;
    }
    /**
    True when the token after the mapped position was deleted.
    */ get deletedAfter() {
        return (this.delInfo & ($5dfe06a1d53a4883$var$DEL_AFTER | $5dfe06a1d53a4883$var$DEL_ACROSS)) > 0;
    }
    /**
    Tells whether any of the steps mapped through deletes across the
    position (including both the token before and after the
    position).
    */ get deletedAcross() {
        return (this.delInfo & $5dfe06a1d53a4883$var$DEL_ACROSS) > 0;
    }
}
/**
A map describing the deletions and insertions made by a step, which
can be used to find the correspondence between positions in the
pre-step version of a document and the same position in the
post-step version.
*/ class $5dfe06a1d53a4883$export$c53d01c3ab9721b3 {
    /**
    Create a position map. The modifications to the document are
    represented as an array of numbers, in which each group of three
    represents a modified chunk as `[start, oldSize, newSize]`.
    */ constructor(/**
    @internal
    */ ranges, /**
    @internal
    */ inverted = false){
        this.ranges = ranges;
        this.inverted = inverted;
        if (!ranges.length && $5dfe06a1d53a4883$export$c53d01c3ab9721b3.empty) return $5dfe06a1d53a4883$export$c53d01c3ab9721b3.empty;
    }
    /**
    @internal
    */ recover(value) {
        let diff = 0, index = $5dfe06a1d53a4883$var$recoverIndex(value);
        if (!this.inverted) for(let i = 0; i < index; i++)diff += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
        return this.ranges[index * 3] + diff + $5dfe06a1d53a4883$var$recoverOffset(value);
    }
    mapResult(pos, assoc = 1) {
        return this._map(pos, assoc, false);
    }
    map(pos, assoc = 1) {
        return this._map(pos, assoc, true);
    }
    /**
    @internal
    */ _map(pos, assoc, simple) {
        let diff = 0, oldIndex = this.inverted ? 2 : 1, newIndex = this.inverted ? 1 : 2;
        for(let i = 0; i < this.ranges.length; i += 3){
            let start = this.ranges[i] - (this.inverted ? diff : 0);
            if (start > pos) break;
            let oldSize = this.ranges[i + oldIndex], newSize = this.ranges[i + newIndex], end = start + oldSize;
            if (pos <= end) {
                let side = !oldSize ? assoc : pos == start ? -1 : pos == end ? 1 : assoc;
                let result = start + diff + (side < 0 ? 0 : newSize);
                if (simple) return result;
                let recover = pos == (assoc < 0 ? start : end) ? null : $5dfe06a1d53a4883$var$makeRecover(i / 3, pos - start);
                let del = pos == start ? $5dfe06a1d53a4883$var$DEL_AFTER : pos == end ? $5dfe06a1d53a4883$var$DEL_BEFORE : $5dfe06a1d53a4883$var$DEL_ACROSS;
                if (assoc < 0 ? pos != start : pos != end) del |= $5dfe06a1d53a4883$var$DEL_SIDE;
                return new $5dfe06a1d53a4883$export$c77c9be41668e9b4(result, del, recover);
            }
            diff += newSize - oldSize;
        }
        return simple ? pos + diff : new $5dfe06a1d53a4883$export$c77c9be41668e9b4(pos + diff, 0, null);
    }
    /**
    @internal
    */ touches(pos, recover) {
        let diff = 0, index = $5dfe06a1d53a4883$var$recoverIndex(recover);
        let oldIndex = this.inverted ? 2 : 1, newIndex = this.inverted ? 1 : 2;
        for(let i = 0; i < this.ranges.length; i += 3){
            let start = this.ranges[i] - (this.inverted ? diff : 0);
            if (start > pos) break;
            let oldSize = this.ranges[i + oldIndex], end = start + oldSize;
            if (pos <= end && i == index * 3) return true;
            diff += this.ranges[i + newIndex] - oldSize;
        }
        return false;
    }
    /**
    Calls the given function on each of the changed ranges included in
    this map.
    */ forEach(f) {
        let oldIndex = this.inverted ? 2 : 1, newIndex = this.inverted ? 1 : 2;
        for(let i = 0, diff = 0; i < this.ranges.length; i += 3){
            let start = this.ranges[i], oldStart = start - (this.inverted ? diff : 0), newStart = start + (this.inverted ? 0 : diff);
            let oldSize = this.ranges[i + oldIndex], newSize = this.ranges[i + newIndex];
            f(oldStart, oldStart + oldSize, newStart, newStart + newSize);
            diff += newSize - oldSize;
        }
    }
    /**
    Create an inverted version of this map. The result can be used to
    map positions in the post-step document to the pre-step document.
    */ invert() {
        return new $5dfe06a1d53a4883$export$c53d01c3ab9721b3(this.ranges, !this.inverted);
    }
    /**
    @internal
    */ toString() {
        return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
    }
    /**
    Create a map that moves all positions by offset `n` (which may be
    negative). This can be useful when applying steps meant for a
    sub-document to a larger document, or vice-versa.
    */ static offset(n) {
        return n == 0 ? $5dfe06a1d53a4883$export$c53d01c3ab9721b3.empty : new $5dfe06a1d53a4883$export$c53d01c3ab9721b3(n < 0 ? [
            0,
            -n,
            0
        ] : [
            0,
            0,
            n
        ]);
    }
}
/**
A StepMap that contains no changed ranges.
*/ $5dfe06a1d53a4883$export$c53d01c3ab9721b3.empty = new $5dfe06a1d53a4883$export$c53d01c3ab9721b3([]);
/**
A mapping represents a pipeline of zero or more [step
maps](https://prosemirror.net/docs/ref/#transform.StepMap). It has special provisions for losslessly
handling mapping positions through a series of steps in which some
steps are inverted versions of earlier steps. (This comes up when
‘[rebasing](/docs/guide/#transform.rebasing)’ steps for
collaboration or history management.)
*/ class $5dfe06a1d53a4883$export$f5f785078011b62 {
    /**
    Create a new mapping with the given position maps.
    */ constructor(/**
    The step maps in this mapping.
    */ maps = [], /**
    @internal
    */ mirror, /**
    The starting position in the `maps` array, used when `map` or
    `mapResult` is called.
    */ from = 0, /**
    The end position in the `maps` array.
    */ to = maps.length){
        this.maps = maps;
        this.mirror = mirror;
        this.from = from;
        this.to = to;
    }
    /**
    Create a mapping that maps only through a part of this one.
    */ slice(from = 0, to = this.maps.length) {
        return new $5dfe06a1d53a4883$export$f5f785078011b62(this.maps, this.mirror, from, to);
    }
    /**
    @internal
    */ copy() {
        return new $5dfe06a1d53a4883$export$f5f785078011b62(this.maps.slice(), this.mirror && this.mirror.slice(), this.from, this.to);
    }
    /**
    Add a step map to the end of this mapping. If `mirrors` is
    given, it should be the index of the step map that is the mirror
    image of this one.
    */ appendMap(map, mirrors) {
        this.to = this.maps.push(map);
        if (mirrors != null) this.setMirror(this.maps.length - 1, mirrors);
    }
    /**
    Add all the step maps in a given mapping to this one (preserving
    mirroring information).
    */ appendMapping(mapping) {
        for(let i = 0, startSize = this.maps.length; i < mapping.maps.length; i++){
            let mirr = mapping.getMirror(i);
            this.appendMap(mapping.maps[i], mirr != null && mirr < i ? startSize + mirr : undefined);
        }
    }
    /**
    Finds the offset of the step map that mirrors the map at the
    given offset, in this mapping (as per the second argument to
    `appendMap`).
    */ getMirror(n) {
        if (this.mirror) {
            for(let i = 0; i < this.mirror.length; i++)if (this.mirror[i] == n) return this.mirror[i + (i % 2 ? -1 : 1)];
        }
    }
    /**
    @internal
    */ setMirror(n, m) {
        if (!this.mirror) this.mirror = [];
        this.mirror.push(n, m);
    }
    /**
    Append the inverse of the given mapping to this one.
    */ appendMappingInverted(mapping) {
        for(let i = mapping.maps.length - 1, totalSize = this.maps.length + mapping.maps.length; i >= 0; i--){
            let mirr = mapping.getMirror(i);
            this.appendMap(mapping.maps[i].invert(), mirr != null && mirr > i ? totalSize - mirr - 1 : undefined);
        }
    }
    /**
    Create an inverted version of this mapping.
    */ invert() {
        let inverse = new $5dfe06a1d53a4883$export$f5f785078011b62;
        inverse.appendMappingInverted(this);
        return inverse;
    }
    /**
    Map a position through this mapping.
    */ map(pos, assoc = 1) {
        if (this.mirror) return this._map(pos, assoc, true);
        for(let i = this.from; i < this.to; i++)pos = this.maps[i].map(pos, assoc);
        return pos;
    }
    /**
    Map a position through this mapping, returning a mapping
    result.
    */ mapResult(pos, assoc = 1) {
        return this._map(pos, assoc, false);
    }
    /**
    @internal
    */ _map(pos, assoc, simple) {
        let delInfo = 0;
        for(let i = this.from; i < this.to; i++){
            let map = this.maps[i], result = map.mapResult(pos, assoc);
            if (result.recover != null) {
                let corr = this.getMirror(i);
                if (corr != null && corr > i && corr < this.to) {
                    i = corr;
                    pos = this.maps[corr].recover(result.recover);
                    continue;
                }
            }
            delInfo |= result.delInfo;
            pos = result.pos;
        }
        return simple ? pos : new $5dfe06a1d53a4883$export$c77c9be41668e9b4(pos, delInfo, null);
    }
}
const $5dfe06a1d53a4883$var$stepsByID = Object.create(null);
/**
A step object represents an atomic change. It generally applies
only to the document it was created for, since the positions
stored in it will only make sense for that document.

New steps are defined by creating classes that extend `Step`,
overriding the `apply`, `invert`, `map`, `getMap` and `fromJSON`
methods, and registering your class with a unique
JSON-serialization identifier using
[`Step.jsonID`](https://prosemirror.net/docs/ref/#transform.Step^jsonID).
*/ class $5dfe06a1d53a4883$export$fd55ce593607084a {
    /**
    Get the step map that represents the changes made by this step,
    and which can be used to transform between positions in the old
    and the new document.
    */ getMap() {
        return $5dfe06a1d53a4883$export$c53d01c3ab9721b3.empty;
    }
    /**
    Try to merge this step with another one, to be applied directly
    after it. Returns the merged step when possible, null if the
    steps can't be merged.
    */ merge(other) {
        return null;
    }
    /**
    Deserialize a step from its JSON representation. Will call
    through to the step class' own implementation of this method.
    */ static fromJSON(schema, json) {
        if (!json || !json.stepType) throw new RangeError("Invalid input for Step.fromJSON");
        let type = $5dfe06a1d53a4883$var$stepsByID[json.stepType];
        if (!type) throw new RangeError(`No step type ${json.stepType} defined`);
        return type.fromJSON(schema, json);
    }
    /**
    To be able to serialize steps to JSON, each step needs a string
    ID to attach to its JSON representation. Use this method to
    register an ID for your step classes. Try to pick something
    that's unlikely to clash with steps from other modules.
    */ static jsonID(id, stepClass) {
        if (id in $5dfe06a1d53a4883$var$stepsByID) throw new RangeError("Duplicate use of step JSON ID " + id);
        $5dfe06a1d53a4883$var$stepsByID[id] = stepClass;
        stepClass.prototype.jsonID = id;
        return stepClass;
    }
}
/**
The result of [applying](https://prosemirror.net/docs/ref/#transform.Step.apply) a step. Contains either a
new document or a failure value.
*/ class $5dfe06a1d53a4883$export$8ebf1578a4199c09 {
    /**
    @internal
    */ constructor(/**
    The transformed document, if successful.
    */ doc, /**
    The failure message, if unsuccessful.
    */ failed){
        this.doc = doc;
        this.failed = failed;
    }
    /**
    Create a successful step result.
    */ static ok(doc) {
        return new $5dfe06a1d53a4883$export$8ebf1578a4199c09(doc, null);
    }
    /**
    Create a failed step result.
    */ static fail(message) {
        return new $5dfe06a1d53a4883$export$8ebf1578a4199c09(null, message);
    }
    /**
    Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
    arguments. Create a successful result if it succeeds, and a
    failed one if it throws a `ReplaceError`.
    */ static fromReplace(doc, from, to, slice) {
        try {
            return $5dfe06a1d53a4883$export$8ebf1578a4199c09.ok(doc.replace(from, to, slice));
        } catch (e) {
            if (e instanceof (0, $c8d507d90382f091$export$6de0e778727af3f2)) return $5dfe06a1d53a4883$export$8ebf1578a4199c09.fail(e.message);
            throw e;
        }
    }
}
function $5dfe06a1d53a4883$var$mapFragment(fragment, f, parent) {
    let mapped = [];
    for(let i = 0; i < fragment.childCount; i++){
        let child = fragment.child(i);
        if (child.content.size) child = child.copy($5dfe06a1d53a4883$var$mapFragment(child.content, f, child));
        if (child.isInline) child = f(child, parent, i);
        mapped.push(child);
    }
    return (0, $c8d507d90382f091$export$ffb0004e005737fa).fromArray(mapped);
}
/**
Add a mark to all inline content between two positions.
*/ class $5dfe06a1d53a4883$export$d24ba56b0e3464a9 extends $5dfe06a1d53a4883$export$fd55ce593607084a {
    /**
    Create a mark step.
    */ constructor(/**
    The start of the marked range.
    */ from, /**
    The end of the marked range.
    */ to, /**
    The mark to add.
    */ mark){
        super();
        this.from = from;
        this.to = to;
        this.mark = mark;
    }
    apply(doc) {
        let oldSlice = doc.slice(this.from, this.to), $from = doc.resolve(this.from);
        let parent = $from.node($from.sharedDepth(this.to));
        let slice = new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)($5dfe06a1d53a4883$var$mapFragment(oldSlice.content, (node, parent)=>{
            if (!node.isAtom || !parent.type.allowsMarkType(this.mark.type)) return node;
            return node.mark(this.mark.addToSet(node.marks));
        }, parent), oldSlice.openStart, oldSlice.openEnd);
        return $5dfe06a1d53a4883$export$8ebf1578a4199c09.fromReplace(doc, this.from, this.to, slice);
    }
    invert() {
        return new $5dfe06a1d53a4883$export$94150db1311f67a9(this.from, this.to, this.mark);
    }
    map(mapping) {
        let from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
        if (from.deleted && to.deleted || from.pos >= to.pos) return null;
        return new $5dfe06a1d53a4883$export$d24ba56b0e3464a9(from.pos, to.pos, this.mark);
    }
    merge(other) {
        if (other instanceof $5dfe06a1d53a4883$export$d24ba56b0e3464a9 && other.mark.eq(this.mark) && this.from <= other.to && this.to >= other.from) return new $5dfe06a1d53a4883$export$d24ba56b0e3464a9(Math.min(this.from, other.from), Math.max(this.to, other.to), this.mark);
        return null;
    }
    toJSON() {
        return {
            stepType: "addMark",
            mark: this.mark.toJSON(),
            from: this.from,
            to: this.to
        };
    }
    /**
    @internal
    */ static fromJSON(schema, json) {
        if (typeof json.from != "number" || typeof json.to != "number") throw new RangeError("Invalid input for AddMarkStep.fromJSON");
        return new $5dfe06a1d53a4883$export$d24ba56b0e3464a9(json.from, json.to, schema.markFromJSON(json.mark));
    }
}
$5dfe06a1d53a4883$export$fd55ce593607084a.jsonID("addMark", $5dfe06a1d53a4883$export$d24ba56b0e3464a9);
/**
Remove a mark from all inline content between two positions.
*/ class $5dfe06a1d53a4883$export$94150db1311f67a9 extends $5dfe06a1d53a4883$export$fd55ce593607084a {
    /**
    Create a mark-removing step.
    */ constructor(/**
    The start of the unmarked range.
    */ from, /**
    The end of the unmarked range.
    */ to, /**
    The mark to remove.
    */ mark){
        super();
        this.from = from;
        this.to = to;
        this.mark = mark;
    }
    apply(doc) {
        let oldSlice = doc.slice(this.from, this.to);
        let slice = new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)($5dfe06a1d53a4883$var$mapFragment(oldSlice.content, (node)=>{
            return node.mark(this.mark.removeFromSet(node.marks));
        }, doc), oldSlice.openStart, oldSlice.openEnd);
        return $5dfe06a1d53a4883$export$8ebf1578a4199c09.fromReplace(doc, this.from, this.to, slice);
    }
    invert() {
        return new $5dfe06a1d53a4883$export$d24ba56b0e3464a9(this.from, this.to, this.mark);
    }
    map(mapping) {
        let from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
        if (from.deleted && to.deleted || from.pos >= to.pos) return null;
        return new $5dfe06a1d53a4883$export$94150db1311f67a9(from.pos, to.pos, this.mark);
    }
    merge(other) {
        if (other instanceof $5dfe06a1d53a4883$export$94150db1311f67a9 && other.mark.eq(this.mark) && this.from <= other.to && this.to >= other.from) return new $5dfe06a1d53a4883$export$94150db1311f67a9(Math.min(this.from, other.from), Math.max(this.to, other.to), this.mark);
        return null;
    }
    toJSON() {
        return {
            stepType: "removeMark",
            mark: this.mark.toJSON(),
            from: this.from,
            to: this.to
        };
    }
    /**
    @internal
    */ static fromJSON(schema, json) {
        if (typeof json.from != "number" || typeof json.to != "number") throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
        return new $5dfe06a1d53a4883$export$94150db1311f67a9(json.from, json.to, schema.markFromJSON(json.mark));
    }
}
$5dfe06a1d53a4883$export$fd55ce593607084a.jsonID("removeMark", $5dfe06a1d53a4883$export$94150db1311f67a9);
/**
Add a mark to a specific node.
*/ class $5dfe06a1d53a4883$export$adefd16c402fee4e extends $5dfe06a1d53a4883$export$fd55ce593607084a {
    /**
    Create a node mark step.
    */ constructor(/**
    The position of the target node.
    */ pos, /**
    The mark to add.
    */ mark){
        super();
        this.pos = pos;
        this.mark = mark;
    }
    apply(doc) {
        let node = doc.nodeAt(this.pos);
        if (!node) return $5dfe06a1d53a4883$export$8ebf1578a4199c09.fail("No node at mark step's position");
        let updated = node.type.create(node.attrs, null, this.mark.addToSet(node.marks));
        return $5dfe06a1d53a4883$export$8ebf1578a4199c09.fromReplace(doc, this.pos, this.pos + 1, new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)((0, $c8d507d90382f091$export$ffb0004e005737fa).from(updated), 0, node.isLeaf ? 0 : 1));
    }
    invert(doc) {
        let node = doc.nodeAt(this.pos);
        if (node) {
            let newSet = this.mark.addToSet(node.marks);
            if (newSet.length == node.marks.length) {
                for(let i = 0; i < node.marks.length; i++)if (!node.marks[i].isInSet(newSet)) return new $5dfe06a1d53a4883$export$adefd16c402fee4e(this.pos, node.marks[i]);
                return new $5dfe06a1d53a4883$export$adefd16c402fee4e(this.pos, this.mark);
            }
        }
        return new $5dfe06a1d53a4883$export$fdf7d1dc10724da2(this.pos, this.mark);
    }
    map(mapping) {
        let pos = mapping.mapResult(this.pos, 1);
        return pos.deletedAfter ? null : new $5dfe06a1d53a4883$export$adefd16c402fee4e(pos.pos, this.mark);
    }
    toJSON() {
        return {
            stepType: "addNodeMark",
            pos: this.pos,
            mark: this.mark.toJSON()
        };
    }
    /**
    @internal
    */ static fromJSON(schema, json) {
        if (typeof json.pos != "number") throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");
        return new $5dfe06a1d53a4883$export$adefd16c402fee4e(json.pos, schema.markFromJSON(json.mark));
    }
}
$5dfe06a1d53a4883$export$fd55ce593607084a.jsonID("addNodeMark", $5dfe06a1d53a4883$export$adefd16c402fee4e);
/**
Remove a mark from a specific node.
*/ class $5dfe06a1d53a4883$export$fdf7d1dc10724da2 extends $5dfe06a1d53a4883$export$fd55ce593607084a {
    /**
    Create a mark-removing step.
    */ constructor(/**
    The position of the target node.
    */ pos, /**
    The mark to remove.
    */ mark){
        super();
        this.pos = pos;
        this.mark = mark;
    }
    apply(doc) {
        let node = doc.nodeAt(this.pos);
        if (!node) return $5dfe06a1d53a4883$export$8ebf1578a4199c09.fail("No node at mark step's position");
        let updated = node.type.create(node.attrs, null, this.mark.removeFromSet(node.marks));
        return $5dfe06a1d53a4883$export$8ebf1578a4199c09.fromReplace(doc, this.pos, this.pos + 1, new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)((0, $c8d507d90382f091$export$ffb0004e005737fa).from(updated), 0, node.isLeaf ? 0 : 1));
    }
    invert(doc) {
        let node = doc.nodeAt(this.pos);
        if (!node || !this.mark.isInSet(node.marks)) return this;
        return new $5dfe06a1d53a4883$export$adefd16c402fee4e(this.pos, this.mark);
    }
    map(mapping) {
        let pos = mapping.mapResult(this.pos, 1);
        return pos.deletedAfter ? null : new $5dfe06a1d53a4883$export$fdf7d1dc10724da2(pos.pos, this.mark);
    }
    toJSON() {
        return {
            stepType: "removeNodeMark",
            pos: this.pos,
            mark: this.mark.toJSON()
        };
    }
    /**
    @internal
    */ static fromJSON(schema, json) {
        if (typeof json.pos != "number") throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
        return new $5dfe06a1d53a4883$export$fdf7d1dc10724da2(json.pos, schema.markFromJSON(json.mark));
    }
}
$5dfe06a1d53a4883$export$fd55ce593607084a.jsonID("removeNodeMark", $5dfe06a1d53a4883$export$fdf7d1dc10724da2);
/**
Replace a part of the document with a slice of new content.
*/ class $5dfe06a1d53a4883$export$5c860b2e74034756 extends $5dfe06a1d53a4883$export$fd55ce593607084a {
    /**
    The given `slice` should fit the 'gap' between `from` and
    `to`—the depths must line up, and the surrounding nodes must be
    able to be joined with the open sides of the slice. When
    `structure` is true, the step will fail if the content between
    from and to is not just a sequence of closing and then opening
    tokens (this is to guard against rebased replace steps
    overwriting something they weren't supposed to).
    */ constructor(/**
    The start position of the replaced range.
    */ from, /**
    The end position of the replaced range.
    */ to, /**
    The slice to insert.
    */ slice, /**
    @internal
    */ structure = false){
        super();
        this.from = from;
        this.to = to;
        this.slice = slice;
        this.structure = structure;
    }
    apply(doc) {
        if (this.structure && $5dfe06a1d53a4883$var$contentBetween(doc, this.from, this.to)) return $5dfe06a1d53a4883$export$8ebf1578a4199c09.fail("Structure replace would overwrite content");
        return $5dfe06a1d53a4883$export$8ebf1578a4199c09.fromReplace(doc, this.from, this.to, this.slice);
    }
    getMap() {
        return new $5dfe06a1d53a4883$export$c53d01c3ab9721b3([
            this.from,
            this.to - this.from,
            this.slice.size
        ]);
    }
    invert(doc) {
        return new $5dfe06a1d53a4883$export$5c860b2e74034756(this.from, this.from + this.slice.size, doc.slice(this.from, this.to));
    }
    map(mapping) {
        let from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
        if (from.deletedAcross && to.deletedAcross) return null;
        return new $5dfe06a1d53a4883$export$5c860b2e74034756(from.pos, Math.max(from.pos, to.pos), this.slice);
    }
    merge(other) {
        if (!(other instanceof $5dfe06a1d53a4883$export$5c860b2e74034756) || other.structure || this.structure) return null;
        if (this.from + this.slice.size == other.from && !this.slice.openEnd && !other.slice.openStart) {
            let slice = this.slice.size + other.slice.size == 0 ? (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).empty : new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)(this.slice.content.append(other.slice.content), this.slice.openStart, other.slice.openEnd);
            return new $5dfe06a1d53a4883$export$5c860b2e74034756(this.from, this.to + (other.to - other.from), slice, this.structure);
        } else if (other.to == this.from && !this.slice.openStart && !other.slice.openEnd) {
            let slice1 = this.slice.size + other.slice.size == 0 ? (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).empty : new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)(other.slice.content.append(this.slice.content), other.slice.openStart, this.slice.openEnd);
            return new $5dfe06a1d53a4883$export$5c860b2e74034756(other.from, this.to, slice1, this.structure);
        } else return null;
    }
    toJSON() {
        let json = {
            stepType: "replace",
            from: this.from,
            to: this.to
        };
        if (this.slice.size) json.slice = this.slice.toJSON();
        if (this.structure) json.structure = true;
        return json;
    }
    /**
    @internal
    */ static fromJSON(schema, json) {
        if (typeof json.from != "number" || typeof json.to != "number") throw new RangeError("Invalid input for ReplaceStep.fromJSON");
        return new $5dfe06a1d53a4883$export$5c860b2e74034756(json.from, json.to, (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).fromJSON(schema, json.slice), !!json.structure);
    }
}
$5dfe06a1d53a4883$export$fd55ce593607084a.jsonID("replace", $5dfe06a1d53a4883$export$5c860b2e74034756);
/**
Replace a part of the document with a slice of content, but
preserve a range of the replaced content by moving it into the
slice.
*/ class $5dfe06a1d53a4883$export$444ba800d6024a98 extends $5dfe06a1d53a4883$export$fd55ce593607084a {
    /**
    Create a replace-around step with the given range and gap.
    `insert` should be the point in the slice into which the content
    of the gap should be moved. `structure` has the same meaning as
    it has in the [`ReplaceStep`](https://prosemirror.net/docs/ref/#transform.ReplaceStep) class.
    */ constructor(/**
    The start position of the replaced range.
    */ from, /**
    The end position of the replaced range.
    */ to, /**
    The start of preserved range.
    */ gapFrom, /**
    The end of preserved range.
    */ gapTo, /**
    The slice to insert.
    */ slice, /**
    The position in the slice where the preserved range should be
    inserted.
    */ insert, /**
    @internal
    */ structure = false){
        super();
        this.from = from;
        this.to = to;
        this.gapFrom = gapFrom;
        this.gapTo = gapTo;
        this.slice = slice;
        this.insert = insert;
        this.structure = structure;
    }
    apply(doc) {
        if (this.structure && ($5dfe06a1d53a4883$var$contentBetween(doc, this.from, this.gapFrom) || $5dfe06a1d53a4883$var$contentBetween(doc, this.gapTo, this.to))) return $5dfe06a1d53a4883$export$8ebf1578a4199c09.fail("Structure gap-replace would overwrite content");
        let gap = doc.slice(this.gapFrom, this.gapTo);
        if (gap.openStart || gap.openEnd) return $5dfe06a1d53a4883$export$8ebf1578a4199c09.fail("Gap is not a flat range");
        let inserted = this.slice.insertAt(this.insert, gap.content);
        if (!inserted) return $5dfe06a1d53a4883$export$8ebf1578a4199c09.fail("Content does not fit in gap");
        return $5dfe06a1d53a4883$export$8ebf1578a4199c09.fromReplace(doc, this.from, this.to, inserted);
    }
    getMap() {
        return new $5dfe06a1d53a4883$export$c53d01c3ab9721b3([
            this.from,
            this.gapFrom - this.from,
            this.insert,
            this.gapTo,
            this.to - this.gapTo,
            this.slice.size - this.insert
        ]);
    }
    invert(doc) {
        let gap = this.gapTo - this.gapFrom;
        return new $5dfe06a1d53a4883$export$444ba800d6024a98(this.from, this.from + this.slice.size + gap, this.from + this.insert, this.from + this.insert + gap, doc.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
    }
    map(mapping) {
        let from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
        let gapFrom = mapping.map(this.gapFrom, -1), gapTo = mapping.map(this.gapTo, 1);
        if (from.deletedAcross && to.deletedAcross || gapFrom < from.pos || gapTo > to.pos) return null;
        return new $5dfe06a1d53a4883$export$444ba800d6024a98(from.pos, to.pos, gapFrom, gapTo, this.slice, this.insert, this.structure);
    }
    toJSON() {
        let json = {
            stepType: "replaceAround",
            from: this.from,
            to: this.to,
            gapFrom: this.gapFrom,
            gapTo: this.gapTo,
            insert: this.insert
        };
        if (this.slice.size) json.slice = this.slice.toJSON();
        if (this.structure) json.structure = true;
        return json;
    }
    /**
    @internal
    */ static fromJSON(schema, json) {
        if (typeof json.from != "number" || typeof json.to != "number" || typeof json.gapFrom != "number" || typeof json.gapTo != "number" || typeof json.insert != "number") throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
        return new $5dfe06a1d53a4883$export$444ba800d6024a98(json.from, json.to, json.gapFrom, json.gapTo, (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).fromJSON(schema, json.slice), json.insert, !!json.structure);
    }
}
$5dfe06a1d53a4883$export$fd55ce593607084a.jsonID("replaceAround", $5dfe06a1d53a4883$export$444ba800d6024a98);
function $5dfe06a1d53a4883$var$contentBetween(doc, from, to) {
    let $from = doc.resolve(from), dist = to - from, depth = $from.depth;
    while(dist > 0 && depth > 0 && $from.indexAfter(depth) == $from.node(depth).childCount){
        depth--;
        dist--;
    }
    if (dist > 0) {
        let next = $from.node(depth).maybeChild($from.indexAfter(depth));
        while(dist > 0){
            if (!next || next.isLeaf) return true;
            next = next.firstChild;
            dist--;
        }
    }
    return false;
}
function $5dfe06a1d53a4883$var$addMark(tr, from, to, mark) {
    let removed = [], added = [];
    let removing, adding;
    tr.doc.nodesBetween(from, to, (node, pos, parent)=>{
        if (!node.isInline) return;
        let marks = node.marks;
        if (!mark.isInSet(marks) && parent.type.allowsMarkType(mark.type)) {
            let start = Math.max(pos, from), end = Math.min(pos + node.nodeSize, to);
            let newSet = mark.addToSet(marks);
            for(let i = 0; i < marks.length; i++)if (!marks[i].isInSet(newSet)) {
                if (removing && removing.to == start && removing.mark.eq(marks[i])) removing.to = end;
                else removed.push(removing = new $5dfe06a1d53a4883$export$94150db1311f67a9(start, end, marks[i]));
            }
            if (adding && adding.to == start) adding.to = end;
            else added.push(adding = new $5dfe06a1d53a4883$export$d24ba56b0e3464a9(start, end, mark));
        }
    });
    removed.forEach((s)=>tr.step(s));
    added.forEach((s)=>tr.step(s));
}
function $5dfe06a1d53a4883$var$removeMark(tr, from, to, mark) {
    let matched = [], step = 0;
    tr.doc.nodesBetween(from, to, (node, pos)=>{
        if (!node.isInline) return;
        step++;
        let toRemove = null;
        if (mark instanceof (0, $c8d507d90382f091$export$b6a78689043c6521)) {
            let set = node.marks, found;
            while(found = mark.isInSet(set)){
                (toRemove || (toRemove = [])).push(found);
                set = found.removeFromSet(set);
            }
        } else if (mark) {
            if (mark.isInSet(node.marks)) toRemove = [
                mark
            ];
        } else toRemove = node.marks;
        if (toRemove && toRemove.length) {
            let end = Math.min(pos + node.nodeSize, to);
            for(let i = 0; i < toRemove.length; i++){
                let style = toRemove[i], found1;
                for(let j = 0; j < matched.length; j++){
                    let m = matched[j];
                    if (m.step == step - 1 && style.eq(matched[j].style)) found1 = m;
                }
                if (found1) {
                    found1.to = end;
                    found1.step = step;
                } else matched.push({
                    style: style,
                    from: Math.max(pos, from),
                    to: end,
                    step: step
                });
            }
        }
    });
    matched.forEach((m)=>tr.step(new $5dfe06a1d53a4883$export$94150db1311f67a9(m.from, m.to, m.style)));
}
function $5dfe06a1d53a4883$var$clearIncompatible(tr, pos, parentType, match = parentType.contentMatch) {
    let node = tr.doc.nodeAt(pos);
    let delSteps = [], cur = pos + 1;
    for(let i = 0; i < node.childCount; i++){
        let child = node.child(i), end = cur + child.nodeSize;
        let allowed = match.matchType(child.type);
        if (!allowed) delSteps.push(new $5dfe06a1d53a4883$export$5c860b2e74034756(cur, end, (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).empty));
        else {
            match = allowed;
            for(let j = 0; j < child.marks.length; j++)if (!parentType.allowsMarkType(child.marks[j].type)) tr.step(new $5dfe06a1d53a4883$export$94150db1311f67a9(cur, end, child.marks[j]));
        }
        cur = end;
    }
    if (!match.validEnd) {
        let fill = match.fillBefore((0, $c8d507d90382f091$export$ffb0004e005737fa).empty, true);
        tr.replace(cur, cur, new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)(fill, 0, 0));
    }
    for(let i1 = delSteps.length - 1; i1 >= 0; i1--)tr.step(delSteps[i1]);
}
function $5dfe06a1d53a4883$var$canCut(node, start, end) {
    return (start == 0 || node.canReplace(start, node.childCount)) && (end == node.childCount || node.canReplace(0, end));
}
/**
Try to find a target depth to which the content in the given range
can be lifted. Will not go across
[isolating](https://prosemirror.net/docs/ref/#model.NodeSpec.isolating) parent nodes.
*/ function $5dfe06a1d53a4883$export$f1508b72cc76a09e(range) {
    let parent = range.parent;
    let content = parent.content.cutByIndex(range.startIndex, range.endIndex);
    for(let depth = range.depth;; --depth){
        let node = range.$from.node(depth);
        let index = range.$from.index(depth), endIndex = range.$to.indexAfter(depth);
        if (depth < range.depth && node.canReplace(index, endIndex, content)) return depth;
        if (depth == 0 || node.type.spec.isolating || !$5dfe06a1d53a4883$var$canCut(node, index, endIndex)) break;
    }
    return null;
}
function $5dfe06a1d53a4883$var$lift(tr, range, target) {
    let { $from: $from , $to: $to , depth: depth  } = range;
    let gapStart = $from.before(depth + 1), gapEnd = $to.after(depth + 1);
    let start = gapStart, end = gapEnd;
    let before = (0, $c8d507d90382f091$export$ffb0004e005737fa).empty, openStart = 0;
    for(let d = depth, splitting = false; d > target; d--)if (splitting || $from.index(d) > 0) {
        splitting = true;
        before = (0, $c8d507d90382f091$export$ffb0004e005737fa).from($from.node(d).copy(before));
        openStart++;
    } else start--;
    let after = (0, $c8d507d90382f091$export$ffb0004e005737fa).empty, openEnd = 0;
    for(let d1 = depth, splitting1 = false; d1 > target; d1--)if (splitting1 || $to.after(d1 + 1) < $to.end(d1)) {
        splitting1 = true;
        after = (0, $c8d507d90382f091$export$ffb0004e005737fa).from($to.node(d1).copy(after));
        openEnd++;
    } else end++;
    tr.step(new $5dfe06a1d53a4883$export$444ba800d6024a98(start, end, gapStart, gapEnd, new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)(before.append(after), openStart, openEnd), before.size - openStart, true));
}
/**
Try to find a valid way to wrap the content in the given range in a
node of the given type. May introduce extra nodes around and inside
the wrapper node, if necessary. Returns null if no valid wrapping
could be found. When `innerRange` is given, that range's content is
used as the content to fit into the wrapping, instead of the
content of `range`.
*/ function $5dfe06a1d53a4883$export$118cb9a83e81ba37(range, nodeType, attrs = null, innerRange = range) {
    let around = $5dfe06a1d53a4883$var$findWrappingOutside(range, nodeType);
    let inner = around && $5dfe06a1d53a4883$var$findWrappingInside(innerRange, nodeType);
    if (!inner) return null;
    return around.map($5dfe06a1d53a4883$var$withAttrs).concat({
        type: nodeType,
        attrs: attrs
    }).concat(inner.map($5dfe06a1d53a4883$var$withAttrs));
}
function $5dfe06a1d53a4883$var$withAttrs(type) {
    return {
        type: type,
        attrs: null
    };
}
function $5dfe06a1d53a4883$var$findWrappingOutside(range, type) {
    let { parent: parent , startIndex: startIndex , endIndex: endIndex  } = range;
    let around = parent.contentMatchAt(startIndex).findWrapping(type);
    if (!around) return null;
    let outer = around.length ? around[0] : type;
    return parent.canReplaceWith(startIndex, endIndex, outer) ? around : null;
}
function $5dfe06a1d53a4883$var$findWrappingInside(range, type) {
    let { parent: parent , startIndex: startIndex , endIndex: endIndex  } = range;
    let inner = parent.child(startIndex);
    let inside = type.contentMatch.findWrapping(inner.type);
    if (!inside) return null;
    let lastType = inside.length ? inside[inside.length - 1] : type;
    let innerMatch = lastType.contentMatch;
    for(let i = startIndex; innerMatch && i < endIndex; i++)innerMatch = innerMatch.matchType(parent.child(i).type);
    if (!innerMatch || !innerMatch.validEnd) return null;
    return inside;
}
function $5dfe06a1d53a4883$var$wrap(tr, range, wrappers) {
    let content = (0, $c8d507d90382f091$export$ffb0004e005737fa).empty;
    for(let i = wrappers.length - 1; i >= 0; i--){
        if (content.size) {
            let match = wrappers[i].type.contentMatch.matchFragment(content);
            if (!match || !match.validEnd) throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
        }
        content = (0, $c8d507d90382f091$export$ffb0004e005737fa).from(wrappers[i].type.create(wrappers[i].attrs, content));
    }
    let start = range.start, end = range.end;
    tr.step(new $5dfe06a1d53a4883$export$444ba800d6024a98(start, end, start, end, new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)(content, 0, 0), wrappers.length, true));
}
function $5dfe06a1d53a4883$var$setBlockType(tr, from, to, type, attrs) {
    if (!type.isTextblock) throw new RangeError("Type given to setBlockType should be a textblock");
    let mapFrom = tr.steps.length;
    tr.doc.nodesBetween(from, to, (node, pos)=>{
        if (node.isTextblock && !node.hasMarkup(type, attrs) && $5dfe06a1d53a4883$var$canChangeType(tr.doc, tr.mapping.slice(mapFrom).map(pos), type)) {
            // Ensure all markup that isn't allowed in the new node type is cleared
            tr.clearIncompatible(tr.mapping.slice(mapFrom).map(pos, 1), type);
            let mapping = tr.mapping.slice(mapFrom);
            let startM = mapping.map(pos, 1), endM = mapping.map(pos + node.nodeSize, 1);
            tr.step(new $5dfe06a1d53a4883$export$444ba800d6024a98(startM, endM, startM + 1, endM - 1, new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)((0, $c8d507d90382f091$export$ffb0004e005737fa).from(type.create(attrs, null, node.marks)), 0, 0), 1, true));
            return false;
        }
    });
}
function $5dfe06a1d53a4883$var$canChangeType(doc, pos, type) {
    let $pos = doc.resolve(pos), index = $pos.index();
    return $pos.parent.canReplaceWith(index, index + 1, type);
}
/**
Change the type, attributes, and/or marks of the node at `pos`.
When `type` isn't given, the existing node type is preserved,
*/ function $5dfe06a1d53a4883$var$setNodeMarkup(tr, pos, type, attrs, marks) {
    let node = tr.doc.nodeAt(pos);
    if (!node) throw new RangeError("No node at given position");
    if (!type) type = node.type;
    let newNode = type.create(attrs, null, marks || node.marks);
    if (node.isLeaf) return tr.replaceWith(pos, pos + node.nodeSize, newNode);
    if (!type.validContent(node.content)) throw new RangeError("Invalid content for node type " + type.name);
    tr.step(new $5dfe06a1d53a4883$export$444ba800d6024a98(pos, pos + node.nodeSize, pos + 1, pos + node.nodeSize - 1, new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)((0, $c8d507d90382f091$export$ffb0004e005737fa).from(newNode), 0, 0), 1, true));
}
/**
Check whether splitting at the given position is allowed.
*/ function $5dfe06a1d53a4883$export$5aaf008897aef029(doc, pos, depth = 1, typesAfter) {
    let $pos = doc.resolve(pos), base = $pos.depth - depth;
    let innerType = typesAfter && typesAfter[typesAfter.length - 1] || $pos.parent;
    if (base < 0 || $pos.parent.type.spec.isolating || !$pos.parent.canReplace($pos.index(), $pos.parent.childCount) || !innerType.type.validContent($pos.parent.content.cutByIndex($pos.index(), $pos.parent.childCount))) return false;
    for(let d = $pos.depth - 1, i = depth - 2; d > base; d--, i--){
        let node = $pos.node(d), index = $pos.index(d);
        if (node.type.spec.isolating) return false;
        let rest = node.content.cutByIndex(index, node.childCount);
        let after = typesAfter && typesAfter[i] || node;
        if (after != node) rest = rest.replaceChild(0, after.type.create(after.attrs));
        if (!node.canReplace(index + 1, node.childCount) || !after.type.validContent(rest)) return false;
    }
    let index1 = $pos.indexAfter(base);
    let baseType = typesAfter && typesAfter[0];
    return $pos.node(base).canReplaceWith(index1, index1, baseType ? baseType.type : $pos.node(base + 1).type);
}
function $5dfe06a1d53a4883$var$split(tr, pos, depth = 1, typesAfter) {
    let $pos = tr.doc.resolve(pos), before = (0, $c8d507d90382f091$export$ffb0004e005737fa).empty, after = (0, $c8d507d90382f091$export$ffb0004e005737fa).empty;
    for(let d = $pos.depth, e = $pos.depth - depth, i = depth - 1; d > e; d--, i--){
        before = (0, $c8d507d90382f091$export$ffb0004e005737fa).from($pos.node(d).copy(before));
        let typeAfter = typesAfter && typesAfter[i];
        after = (0, $c8d507d90382f091$export$ffb0004e005737fa).from(typeAfter ? typeAfter.type.create(typeAfter.attrs, after) : $pos.node(d).copy(after));
    }
    tr.step(new $5dfe06a1d53a4883$export$5c860b2e74034756(pos, pos, new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)(before.append(after), depth, depth), true));
}
/**
Test whether the blocks before and after a given position can be
joined.
*/ function $5dfe06a1d53a4883$export$f15f89fd9d8cc98a(doc, pos) {
    let $pos = doc.resolve(pos), index = $pos.index();
    return $5dfe06a1d53a4883$var$joinable($pos.nodeBefore, $pos.nodeAfter) && $pos.parent.canReplace(index, index + 1);
}
function $5dfe06a1d53a4883$var$joinable(a, b) {
    return !!(a && b && !a.isLeaf && a.canAppend(b));
}
/**
Find an ancestor of the given position that can be joined to the
block before (or after if `dir` is positive). Returns the joinable
point, if any.
*/ function $5dfe06a1d53a4883$export$41b1d4cb5ceb3147(doc, pos, dir = -1) {
    let $pos = doc.resolve(pos);
    for(let d = $pos.depth;; d--){
        let before, after, index = $pos.index(d);
        if (d == $pos.depth) {
            before = $pos.nodeBefore;
            after = $pos.nodeAfter;
        } else if (dir > 0) {
            before = $pos.node(d + 1);
            index++;
            after = $pos.node(d).maybeChild(index);
        } else {
            before = $pos.node(d).maybeChild(index - 1);
            after = $pos.node(d + 1);
        }
        if (before && !before.isTextblock && $5dfe06a1d53a4883$var$joinable(before, after) && $pos.node(d).canReplace(index, index + 1)) return pos;
        if (d == 0) break;
        pos = dir < 0 ? $pos.before(d) : $pos.after(d);
    }
}
function $5dfe06a1d53a4883$var$join(tr, pos, depth) {
    let step = new $5dfe06a1d53a4883$export$5c860b2e74034756(pos - depth, pos + depth, (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).empty, true);
    tr.step(step);
}
/**
Try to find a point where a node of the given type can be inserted
near `pos`, by searching up the node hierarchy when `pos` itself
isn't a valid place but is at the start or end of a node. Return
null if no position was found.
*/ function $5dfe06a1d53a4883$export$64cb316d02de1dd1(doc, pos, nodeType) {
    let $pos = doc.resolve(pos);
    if ($pos.parent.canReplaceWith($pos.index(), $pos.index(), nodeType)) return pos;
    if ($pos.parentOffset == 0) for(let d = $pos.depth - 1; d >= 0; d--){
        let index = $pos.index(d);
        if ($pos.node(d).canReplaceWith(index, index, nodeType)) return $pos.before(d + 1);
        if (index > 0) return null;
    }
    if ($pos.parentOffset == $pos.parent.content.size) for(let d1 = $pos.depth - 1; d1 >= 0; d1--){
        let index1 = $pos.indexAfter(d1);
        if ($pos.node(d1).canReplaceWith(index1, index1, nodeType)) return $pos.after(d1 + 1);
        if (index1 < $pos.node(d1).childCount) return null;
    }
    return null;
}
/**
Finds a position at or around the given position where the given
slice can be inserted. Will look at parent nodes' nearest boundary
and try there, even if the original position wasn't directly at the
start or end of that node. Returns null when no position was found.
*/ function $5dfe06a1d53a4883$export$2819d598d048fc9c(doc, pos, slice) {
    let $pos = doc.resolve(pos);
    if (!slice.content.size) return pos;
    let content = slice.content;
    for(let i = 0; i < slice.openStart; i++)content = content.firstChild.content;
    for(let pass = 1; pass <= (slice.openStart == 0 && slice.size ? 2 : 1); pass++)for(let d = $pos.depth; d >= 0; d--){
        let bias = d == $pos.depth ? 0 : $pos.pos <= ($pos.start(d + 1) + $pos.end(d + 1)) / 2 ? -1 : 1;
        let insertPos = $pos.index(d) + (bias > 0 ? 1 : 0);
        let parent = $pos.node(d), fits = false;
        if (pass == 1) fits = parent.canReplace(insertPos, insertPos, content);
        else {
            let wrapping = parent.contentMatchAt(insertPos).findWrapping(content.firstChild.type);
            fits = wrapping && parent.canReplaceWith(insertPos, insertPos, wrapping[0]);
        }
        if (fits) return bias == 0 ? $pos.pos : bias < 0 ? $pos.before(d + 1) : $pos.after(d + 1);
    }
    return null;
}
/**
‘Fit’ a slice into a given position in the document, producing a
[step](https://prosemirror.net/docs/ref/#transform.Step) that inserts it. Will return null if
there's no meaningful way to insert the slice here, or inserting it
would be a no-op (an empty slice over an empty range).
*/ function $5dfe06a1d53a4883$export$ed6ac67359824afd(doc, from, to = from, slice = (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).empty) {
    if (from == to && !slice.size) return null;
    let $from = doc.resolve(from), $to = doc.resolve(to);
    // Optimization -- avoid work if it's obvious that it's not needed.
    if ($5dfe06a1d53a4883$var$fitsTrivially($from, $to, slice)) return new $5dfe06a1d53a4883$export$5c860b2e74034756(from, to, slice);
    return new $5dfe06a1d53a4883$var$Fitter($from, $to, slice).fit();
}
function $5dfe06a1d53a4883$var$fitsTrivially($from, $to, slice) {
    return !slice.openStart && !slice.openEnd && $from.start() == $to.start() && $from.parent.canReplace($from.index(), $to.index(), slice.content);
}
// Algorithm for 'placing' the elements of a slice into a gap:
//
// We consider the content of each node that is open to the left to be
// independently placeable. I.e. in <p("foo"), p("bar")>, when the
// paragraph on the left is open, "foo" can be placed (somewhere on
// the left side of the replacement gap) independently from p("bar").
//
// This class tracks the state of the placement progress in the
// following properties:
//
//  - `frontier` holds a stack of `{type, match}` objects that
//    represent the open side of the replacement. It starts at
//    `$from`, then moves forward as content is placed, and is finally
//    reconciled with `$to`.
//
//  - `unplaced` is a slice that represents the content that hasn't
//    been placed yet.
//
//  - `placed` is a fragment of placed content. Its open-start value
//    is implicit in `$from`, and its open-end value in `frontier`.
class $5dfe06a1d53a4883$var$Fitter {
    constructor($from, $to, unplaced){
        this.$from = $from;
        this.$to = $to;
        this.unplaced = unplaced;
        this.frontier = [];
        this.placed = (0, $c8d507d90382f091$export$ffb0004e005737fa).empty;
        for(let i = 0; i <= $from.depth; i++){
            let node = $from.node(i);
            this.frontier.push({
                type: node.type,
                match: node.contentMatchAt($from.indexAfter(i))
            });
        }
        for(let i1 = $from.depth; i1 > 0; i1--)this.placed = (0, $c8d507d90382f091$export$ffb0004e005737fa).from($from.node(i1).copy(this.placed));
    }
    get depth() {
        return this.frontier.length - 1;
    }
    fit() {
        // As long as there's unplaced content, try to place some of it.
        // If that fails, either increase the open score of the unplaced
        // slice, or drop nodes from it, and then try again.
        while(this.unplaced.size){
            let fit = this.findFittable();
            if (fit) this.placeNodes(fit);
            else this.openMore() || this.dropNode();
        }
        // When there's inline content directly after the frontier _and_
        // directly after `this.$to`, we must generate a `ReplaceAround`
        // step that pulls that content into the node after the frontier.
        // That means the fitting must be done to the end of the textblock
        // node after `this.$to`, not `this.$to` itself.
        let moveInline = this.mustMoveInline(), placedSize = this.placed.size - this.depth - this.$from.depth;
        let $from = this.$from, $to = this.close(moveInline < 0 ? this.$to : $from.doc.resolve(moveInline));
        if (!$to) return null;
        // If closing to `$to` succeeded, create a step
        let content = this.placed, openStart = $from.depth, openEnd = $to.depth;
        while(openStart && openEnd && content.childCount == 1){
            content = content.firstChild.content;
            openStart--;
            openEnd--;
        }
        let slice = new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)(content, openStart, openEnd);
        if (moveInline > -1) return new $5dfe06a1d53a4883$export$444ba800d6024a98($from.pos, moveInline, this.$to.pos, this.$to.end(), slice, placedSize);
        if (slice.size || $from.pos != this.$to.pos) return new $5dfe06a1d53a4883$export$5c860b2e74034756($from.pos, $to.pos, slice);
        return null;
    }
    // Find a position on the start spine of `this.unplaced` that has
    // content that can be moved somewhere on the frontier. Returns two
    // depths, one for the slice and one for the frontier.
    findFittable() {
        // Only try wrapping nodes (pass 2) after finding a place without
        // wrapping failed.
        for(let pass = 1; pass <= 2; pass++)for(let sliceDepth = this.unplaced.openStart; sliceDepth >= 0; sliceDepth--){
            let fragment, parent = null;
            if (sliceDepth) {
                parent = $5dfe06a1d53a4883$var$contentAt(this.unplaced.content, sliceDepth - 1).firstChild;
                fragment = parent.content;
            } else fragment = this.unplaced.content;
            let first = fragment.firstChild;
            for(let frontierDepth = this.depth; frontierDepth >= 0; frontierDepth--){
                let { type: type , match: match  } = this.frontier[frontierDepth], wrap, inject = null;
                // In pass 1, if the next node matches, or there is no next
                // node but the parents look compatible, we've found a
                // place.
                if (pass == 1 && (first ? match.matchType(first.type) || (inject = match.fillBefore((0, $c8d507d90382f091$export$ffb0004e005737fa).from(first), false)) : parent && type.compatibleContent(parent.type))) return {
                    sliceDepth: sliceDepth,
                    frontierDepth: frontierDepth,
                    parent: parent,
                    inject: inject
                };
                else if (pass == 2 && first && (wrap = match.findWrapping(first.type))) return {
                    sliceDepth: sliceDepth,
                    frontierDepth: frontierDepth,
                    parent: parent,
                    wrap: wrap
                };
                // Don't continue looking further up if the parent node
                // would fit here.
                if (parent && match.matchType(parent.type)) break;
            }
        }
    }
    openMore() {
        let { content: content , openStart: openStart , openEnd: openEnd  } = this.unplaced;
        let inner = $5dfe06a1d53a4883$var$contentAt(content, openStart);
        if (!inner.childCount || inner.firstChild.isLeaf) return false;
        this.unplaced = new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)(content, openStart + 1, Math.max(openEnd, inner.size + openStart >= content.size - openEnd ? openStart + 1 : 0));
        return true;
    }
    dropNode() {
        let { content: content , openStart: openStart , openEnd: openEnd  } = this.unplaced;
        let inner = $5dfe06a1d53a4883$var$contentAt(content, openStart);
        if (inner.childCount <= 1 && openStart > 0) {
            let openAtEnd = content.size - openStart <= openStart + inner.size;
            this.unplaced = new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)($5dfe06a1d53a4883$var$dropFromFragment(content, openStart - 1, 1), openStart - 1, openAtEnd ? openStart - 1 : openEnd);
        } else this.unplaced = new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)($5dfe06a1d53a4883$var$dropFromFragment(content, openStart, 1), openStart, openEnd);
    }
    // Move content from the unplaced slice at `sliceDepth` to the
    // frontier node at `frontierDepth`. Close that frontier node when
    // applicable.
    placeNodes({ sliceDepth: sliceDepth , frontierDepth: frontierDepth , parent: parent , inject: inject , wrap: wrap  }) {
        while(this.depth > frontierDepth)this.closeFrontierNode();
        if (wrap) for(let i = 0; i < wrap.length; i++)this.openFrontierNode(wrap[i]);
        let slice = this.unplaced, fragment = parent ? parent.content : slice.content;
        let openStart = slice.openStart - sliceDepth;
        let taken = 0, add = [];
        let { match: match , type: type  } = this.frontier[frontierDepth];
        if (inject) {
            for(let i1 = 0; i1 < inject.childCount; i1++)add.push(inject.child(i1));
            match = match.matchFragment(inject);
        }
        // Computes the amount of (end) open nodes at the end of the
        // fragment. When 0, the parent is open, but no more. When
        // negative, nothing is open.
        let openEndCount = fragment.size + sliceDepth - (slice.content.size - slice.openEnd);
        // Scan over the fragment, fitting as many child nodes as
        // possible.
        while(taken < fragment.childCount){
            let next = fragment.child(taken), matches = match.matchType(next.type);
            if (!matches) break;
            taken++;
            if (taken > 1 || openStart == 0 || next.content.size) {
                match = matches;
                add.push($5dfe06a1d53a4883$var$closeNodeStart(next.mark(type.allowedMarks(next.marks)), taken == 1 ? openStart : 0, taken == fragment.childCount ? openEndCount : -1));
            }
        }
        let toEnd = taken == fragment.childCount;
        if (!toEnd) openEndCount = -1;
        this.placed = $5dfe06a1d53a4883$var$addToFragment(this.placed, frontierDepth, (0, $c8d507d90382f091$export$ffb0004e005737fa).from(add));
        this.frontier[frontierDepth].match = match;
        // If the parent types match, and the entire node was moved, and
        // it's not open, close this frontier node right away.
        if (toEnd && openEndCount < 0 && parent && parent.type == this.frontier[this.depth].type && this.frontier.length > 1) this.closeFrontierNode();
        // Add new frontier nodes for any open nodes at the end.
        for(let i2 = 0, cur = fragment; i2 < openEndCount; i2++){
            let node = cur.lastChild;
            this.frontier.push({
                type: node.type,
                match: node.contentMatchAt(node.childCount)
            });
            cur = node.content;
        }
        // Update `this.unplaced`. Drop the entire node from which we
        // placed it we got to its end, otherwise just drop the placed
        // nodes.
        this.unplaced = !toEnd ? new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)($5dfe06a1d53a4883$var$dropFromFragment(slice.content, sliceDepth, taken), slice.openStart, slice.openEnd) : sliceDepth == 0 ? (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).empty : new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)($5dfe06a1d53a4883$var$dropFromFragment(slice.content, sliceDepth - 1, 1), sliceDepth - 1, openEndCount < 0 ? slice.openEnd : sliceDepth - 1);
    }
    mustMoveInline() {
        if (!this.$to.parent.isTextblock) return -1;
        let top = this.frontier[this.depth], level;
        if (!top.type.isTextblock || !$5dfe06a1d53a4883$var$contentAfterFits(this.$to, this.$to.depth, top.type, top.match, false) || this.$to.depth == this.depth && (level = this.findCloseLevel(this.$to)) && level.depth == this.depth) return -1;
        let { depth: depth  } = this.$to, after = this.$to.after(depth);
        while(depth > 1 && after == this.$to.end(--depth))++after;
        return after;
    }
    findCloseLevel($to) {
        scan: for(let i = Math.min(this.depth, $to.depth); i >= 0; i--){
            let { match: match , type: type  } = this.frontier[i];
            let dropInner = i < $to.depth && $to.end(i + 1) == $to.pos + ($to.depth - (i + 1));
            let fit = $5dfe06a1d53a4883$var$contentAfterFits($to, i, type, match, dropInner);
            if (!fit) continue;
            for(let d = i - 1; d >= 0; d--){
                let { match: match1 , type: type1  } = this.frontier[d];
                let matches = $5dfe06a1d53a4883$var$contentAfterFits($to, d, type1, match1, true);
                if (!matches || matches.childCount) continue scan;
            }
            return {
                depth: i,
                fit: fit,
                move: dropInner ? $to.doc.resolve($to.after(i + 1)) : $to
            };
        }
    }
    close($to) {
        let close = this.findCloseLevel($to);
        if (!close) return null;
        while(this.depth > close.depth)this.closeFrontierNode();
        if (close.fit.childCount) this.placed = $5dfe06a1d53a4883$var$addToFragment(this.placed, close.depth, close.fit);
        $to = close.move;
        for(let d = close.depth + 1; d <= $to.depth; d++){
            let node = $to.node(d), add = node.type.contentMatch.fillBefore(node.content, true, $to.index(d));
            this.openFrontierNode(node.type, node.attrs, add);
        }
        return $to;
    }
    openFrontierNode(type, attrs = null, content) {
        let top = this.frontier[this.depth];
        top.match = top.match.matchType(type);
        this.placed = $5dfe06a1d53a4883$var$addToFragment(this.placed, this.depth, (0, $c8d507d90382f091$export$ffb0004e005737fa).from(type.create(attrs, content)));
        this.frontier.push({
            type: type,
            match: type.contentMatch
        });
    }
    closeFrontierNode() {
        let open = this.frontier.pop();
        let add = open.match.fillBefore((0, $c8d507d90382f091$export$ffb0004e005737fa).empty, true);
        if (add.childCount) this.placed = $5dfe06a1d53a4883$var$addToFragment(this.placed, this.frontier.length, add);
    }
}
function $5dfe06a1d53a4883$var$dropFromFragment(fragment, depth, count) {
    if (depth == 0) return fragment.cutByIndex(count, fragment.childCount);
    return fragment.replaceChild(0, fragment.firstChild.copy($5dfe06a1d53a4883$var$dropFromFragment(fragment.firstChild.content, depth - 1, count)));
}
function $5dfe06a1d53a4883$var$addToFragment(fragment, depth, content) {
    if (depth == 0) return fragment.append(content);
    return fragment.replaceChild(fragment.childCount - 1, fragment.lastChild.copy($5dfe06a1d53a4883$var$addToFragment(fragment.lastChild.content, depth - 1, content)));
}
function $5dfe06a1d53a4883$var$contentAt(fragment, depth) {
    for(let i = 0; i < depth; i++)fragment = fragment.firstChild.content;
    return fragment;
}
function $5dfe06a1d53a4883$var$closeNodeStart(node, openStart, openEnd) {
    if (openStart <= 0) return node;
    let frag = node.content;
    if (openStart > 1) frag = frag.replaceChild(0, $5dfe06a1d53a4883$var$closeNodeStart(frag.firstChild, openStart - 1, frag.childCount == 1 ? openEnd - 1 : 0));
    if (openStart > 0) {
        frag = node.type.contentMatch.fillBefore(frag).append(frag);
        if (openEnd <= 0) frag = frag.append(node.type.contentMatch.matchFragment(frag).fillBefore((0, $c8d507d90382f091$export$ffb0004e005737fa).empty, true));
    }
    return node.copy(frag);
}
function $5dfe06a1d53a4883$var$contentAfterFits($to, depth, type, match, open) {
    let node = $to.node(depth), index = open ? $to.indexAfter(depth) : $to.index(depth);
    if (index == node.childCount && !type.compatibleContent(node.type)) return null;
    let fit = match.fillBefore(node.content, true, index);
    return fit && !$5dfe06a1d53a4883$var$invalidMarks(type, node.content, index) ? fit : null;
}
function $5dfe06a1d53a4883$var$invalidMarks(type, fragment, start) {
    for(let i = start; i < fragment.childCount; i++)if (!type.allowsMarks(fragment.child(i).marks)) return true;
    return false;
}
function $5dfe06a1d53a4883$var$definesContent(type) {
    return type.spec.defining || type.spec.definingForContent;
}
function $5dfe06a1d53a4883$var$replaceRange(tr, from, to, slice) {
    if (!slice.size) return tr.deleteRange(from, to);
    let $from = tr.doc.resolve(from), $to = tr.doc.resolve(to);
    if ($5dfe06a1d53a4883$var$fitsTrivially($from, $to, slice)) return tr.step(new $5dfe06a1d53a4883$export$5c860b2e74034756(from, to, slice));
    let targetDepths = $5dfe06a1d53a4883$var$coveredDepths($from, tr.doc.resolve(to));
    // Can't replace the whole document, so remove 0 if it's present
    if (targetDepths[targetDepths.length - 1] == 0) targetDepths.pop();
    // Negative numbers represent not expansion over the whole node at
    // that depth, but replacing from $from.before(-D) to $to.pos.
    let preferredTarget = -($from.depth + 1);
    targetDepths.unshift(preferredTarget);
    // This loop picks a preferred target depth, if one of the covering
    // depths is not outside of a defining node, and adds negative
    // depths for any depth that has $from at its start and does not
    // cross a defining node.
    for(let d = $from.depth, pos = $from.pos - 1; d > 0; d--, pos--){
        let spec = $from.node(d).type.spec;
        if (spec.defining || spec.definingAsContext || spec.isolating) break;
        if (targetDepths.indexOf(d) > -1) preferredTarget = d;
        else if ($from.before(d) == pos) targetDepths.splice(1, 0, -d);
    }
    // Try to fit each possible depth of the slice into each possible
    // target depth, starting with the preferred depths.
    let preferredTargetIndex = targetDepths.indexOf(preferredTarget);
    let leftNodes = [], preferredDepth = slice.openStart;
    for(let content = slice.content, i = 0;; i++){
        let node = content.firstChild;
        leftNodes.push(node);
        if (i == slice.openStart) break;
        content = node.content;
    }
    // Back up preferredDepth to cover defining textblocks directly
    // above it, possibly skipping a non-defining textblock.
    for(let d1 = preferredDepth - 1; d1 >= 0; d1--){
        let type = leftNodes[d1].type, def = $5dfe06a1d53a4883$var$definesContent(type);
        if (def && $from.node(preferredTargetIndex).type != type) preferredDepth = d1;
        else if (def || !type.isTextblock) break;
    }
    for(let j = slice.openStart; j >= 0; j--){
        let openDepth = (j + preferredDepth + 1) % (slice.openStart + 1);
        let insert = leftNodes[openDepth];
        if (!insert) continue;
        for(let i1 = 0; i1 < targetDepths.length; i1++){
            // Loop over possible expansion levels, starting with the
            // preferred one
            let targetDepth = targetDepths[(i1 + preferredTargetIndex) % targetDepths.length], expand = true;
            if (targetDepth < 0) {
                expand = false;
                targetDepth = -targetDepth;
            }
            let parent = $from.node(targetDepth - 1), index = $from.index(targetDepth - 1);
            if (parent.canReplaceWith(index, index, insert.type, insert.marks)) return tr.replace($from.before(targetDepth), expand ? $to.after(targetDepth) : to, new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)($5dfe06a1d53a4883$var$closeFragment(slice.content, 0, slice.openStart, openDepth), openDepth, slice.openEnd));
        }
    }
    let startSteps = tr.steps.length;
    for(let i2 = targetDepths.length - 1; i2 >= 0; i2--){
        tr.replace(from, to, slice);
        if (tr.steps.length > startSteps) break;
        let depth = targetDepths[i2];
        if (depth < 0) continue;
        from = $from.before(depth);
        to = $to.after(depth);
    }
}
function $5dfe06a1d53a4883$var$closeFragment(fragment, depth, oldOpen, newOpen, parent) {
    if (depth < oldOpen) {
        let first = fragment.firstChild;
        fragment = fragment.replaceChild(0, first.copy($5dfe06a1d53a4883$var$closeFragment(first.content, depth + 1, oldOpen, newOpen, first)));
    }
    if (depth > newOpen) {
        let match = parent.contentMatchAt(0);
        let start = match.fillBefore(fragment).append(fragment);
        fragment = start.append(match.matchFragment(start).fillBefore((0, $c8d507d90382f091$export$ffb0004e005737fa).empty, true));
    }
    return fragment;
}
function $5dfe06a1d53a4883$var$replaceRangeWith(tr, from, to, node) {
    if (!node.isInline && from == to && tr.doc.resolve(from).parent.content.size) {
        let point = $5dfe06a1d53a4883$export$64cb316d02de1dd1(tr.doc, from, node.type);
        if (point != null) from = to = point;
    }
    tr.replaceRange(from, to, new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)((0, $c8d507d90382f091$export$ffb0004e005737fa).from(node), 0, 0));
}
function $5dfe06a1d53a4883$var$deleteRange(tr, from, to) {
    let $from = tr.doc.resolve(from), $to = tr.doc.resolve(to);
    let covered = $5dfe06a1d53a4883$var$coveredDepths($from, $to);
    for(let i = 0; i < covered.length; i++){
        let depth = covered[i], last = i == covered.length - 1;
        if (last && depth == 0 || $from.node(depth).type.contentMatch.validEnd) return tr.delete($from.start(depth), $to.end(depth));
        if (depth > 0 && (last || $from.node(depth - 1).canReplace($from.index(depth - 1), $to.indexAfter(depth - 1)))) return tr.delete($from.before(depth), $to.after(depth));
    }
    for(let d = 1; d <= $from.depth && d <= $to.depth; d++){
        if (from - $from.start(d) == $from.depth - d && to > $from.end(d) && $to.end(d) - to != $to.depth - d) return tr.delete($from.before(d), to);
    }
    tr.delete(from, to);
}
// Returns an array of all depths for which $from - $to spans the
// whole content of the nodes at that depth.
function $5dfe06a1d53a4883$var$coveredDepths($from, $to) {
    let result = [], minDepth = Math.min($from.depth, $to.depth);
    for(let d = minDepth; d >= 0; d--){
        let start = $from.start(d);
        if (start < $from.pos - ($from.depth - d) || $to.end(d) > $to.pos + ($to.depth - d) || $from.node(d).type.spec.isolating || $to.node(d).type.spec.isolating) break;
        if (start == $to.start(d) || d == $from.depth && d == $to.depth && $from.parent.inlineContent && $to.parent.inlineContent && d && $to.start(d - 1) == start - 1) result.push(d);
    }
    return result;
}
/**
Update an attribute in a specific node.
*/ class $5dfe06a1d53a4883$export$626399c38172f669 extends $5dfe06a1d53a4883$export$fd55ce593607084a {
    /**
    Construct an attribute step.
    */ constructor(/**
    The position of the target node.
    */ pos, /**
    The attribute to set.
    */ attr, // The attribute's new value.
    value){
        super();
        this.pos = pos;
        this.attr = attr;
        this.value = value;
    }
    apply(doc) {
        let node = doc.nodeAt(this.pos);
        if (!node) return $5dfe06a1d53a4883$export$8ebf1578a4199c09.fail("No node at attribute step's position");
        let attrs = Object.create(null);
        for(let name in node.attrs)attrs[name] = node.attrs[name];
        attrs[this.attr] = this.value;
        let updated = node.type.create(attrs, null, node.marks);
        return $5dfe06a1d53a4883$export$8ebf1578a4199c09.fromReplace(doc, this.pos, this.pos + 1, new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)((0, $c8d507d90382f091$export$ffb0004e005737fa).from(updated), 0, node.isLeaf ? 0 : 1));
    }
    getMap() {
        return $5dfe06a1d53a4883$export$c53d01c3ab9721b3.empty;
    }
    invert(doc) {
        return new $5dfe06a1d53a4883$export$626399c38172f669(this.pos, this.attr, doc.nodeAt(this.pos).attrs[this.attr]);
    }
    map(mapping) {
        let pos = mapping.mapResult(this.pos, 1);
        return pos.deletedAfter ? null : new $5dfe06a1d53a4883$export$626399c38172f669(pos.pos, this.attr, this.value);
    }
    toJSON() {
        return {
            stepType: "attr",
            pos: this.pos,
            attr: this.attr,
            value: this.value
        };
    }
    static fromJSON(schema, json) {
        if (typeof json.pos != "number" || typeof json.attr != "string") throw new RangeError("Invalid input for AttrStep.fromJSON");
        return new $5dfe06a1d53a4883$export$626399c38172f669(json.pos, json.attr, json.value);
    }
}
$5dfe06a1d53a4883$export$fd55ce593607084a.jsonID("attr", $5dfe06a1d53a4883$export$626399c38172f669);
/**
@internal
*/ let $5dfe06a1d53a4883$export$88cc3a1dfce48dd3 = class extends Error {
};
$5dfe06a1d53a4883$export$88cc3a1dfce48dd3 = function TransformError(message) {
    let err = Error.call(this, message);
    err.__proto__ = TransformError.prototype;
    return err;
};
$5dfe06a1d53a4883$export$88cc3a1dfce48dd3.prototype = Object.create(Error.prototype);
$5dfe06a1d53a4883$export$88cc3a1dfce48dd3.prototype.constructor = $5dfe06a1d53a4883$export$88cc3a1dfce48dd3;
$5dfe06a1d53a4883$export$88cc3a1dfce48dd3.prototype.name = "TransformError";
/**
Abstraction to build up and track an array of
[steps](https://prosemirror.net/docs/ref/#transform.Step) representing a document transformation.

Most transforming methods return the `Transform` object itself, so
that they can be chained.
*/ class $5dfe06a1d53a4883$export$563a914cafbdc389 {
    /**
    Create a transform that starts with the given document.
    */ constructor(/**
    The current document (the result of applying the steps in the
    transform).
    */ doc){
        this.doc = doc;
        /**
        The steps in this transform.
        */ this.steps = [];
        /**
        The documents before each of the steps.
        */ this.docs = [];
        /**
        A mapping with the maps for each of the steps in this transform.
        */ this.mapping = new $5dfe06a1d53a4883$export$f5f785078011b62;
    }
    /**
    The starting document.
    */ get before() {
        return this.docs.length ? this.docs[0] : this.doc;
    }
    /**
    Apply a new step in this transform, saving the result. Throws an
    error when the step fails.
    */ step(step) {
        let result = this.maybeStep(step);
        if (result.failed) throw new $5dfe06a1d53a4883$export$88cc3a1dfce48dd3(result.failed);
        return this;
    }
    /**
    Try to apply a step in this transformation, ignoring it if it
    fails. Returns the step result.
    */ maybeStep(step) {
        let result = step.apply(this.doc);
        if (!result.failed) this.addStep(step, result.doc);
        return result;
    }
    /**
    True when the document has been changed (when there are any
    steps).
    */ get docChanged() {
        return this.steps.length > 0;
    }
    /**
    @internal
    */ addStep(step, doc) {
        this.docs.push(this.doc);
        this.steps.push(step);
        this.mapping.appendMap(step.getMap());
        this.doc = doc;
    }
    /**
    Replace the part of the document between `from` and `to` with the
    given `slice`.
    */ replace(from, to = from, slice = (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).empty) {
        let step = $5dfe06a1d53a4883$export$ed6ac67359824afd(this.doc, from, to, slice);
        if (step) this.step(step);
        return this;
    }
    /**
    Replace the given range with the given content, which may be a
    fragment, node, or array of nodes.
    */ replaceWith(from, to, content) {
        return this.replace(from, to, new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)((0, $c8d507d90382f091$export$ffb0004e005737fa).from(content), 0, 0));
    }
    /**
    Delete the content between the given positions.
    */ delete(from, to) {
        return this.replace(from, to, (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).empty);
    }
    /**
    Insert the given content at the given position.
    */ insert(pos, content) {
        return this.replaceWith(pos, pos, content);
    }
    /**
    Replace a range of the document with a given slice, using
    `from`, `to`, and the slice's
    [`openStart`](https://prosemirror.net/docs/ref/#model.Slice.openStart) property as hints, rather
    than fixed start and end points. This method may grow the
    replaced area or close open nodes in the slice in order to get a
    fit that is more in line with WYSIWYG expectations, by dropping
    fully covered parent nodes of the replaced region when they are
    marked [non-defining as
    context](https://prosemirror.net/docs/ref/#model.NodeSpec.definingAsContext), or including an
    open parent node from the slice that _is_ marked as [defining
    its content](https://prosemirror.net/docs/ref/#model.NodeSpec.definingForContent).
    
    This is the method, for example, to handle paste. The similar
    [`replace`](https://prosemirror.net/docs/ref/#transform.Transform.replace) method is a more
    primitive tool which will _not_ move the start and end of its given
    range, and is useful in situations where you need more precise
    control over what happens.
    */ replaceRange(from, to, slice) {
        $5dfe06a1d53a4883$var$replaceRange(this, from, to, slice);
        return this;
    }
    /**
    Replace the given range with a node, but use `from` and `to` as
    hints, rather than precise positions. When from and to are the same
    and are at the start or end of a parent node in which the given
    node doesn't fit, this method may _move_ them out towards a parent
    that does allow the given node to be placed. When the given range
    completely covers a parent node, this method may completely replace
    that parent node.
    */ replaceRangeWith(from, to, node) {
        $5dfe06a1d53a4883$var$replaceRangeWith(this, from, to, node);
        return this;
    }
    /**
    Delete the given range, expanding it to cover fully covered
    parent nodes until a valid replace is found.
    */ deleteRange(from, to) {
        $5dfe06a1d53a4883$var$deleteRange(this, from, to);
        return this;
    }
    /**
    Split the content in the given range off from its parent, if there
    is sibling content before or after it, and move it up the tree to
    the depth specified by `target`. You'll probably want to use
    [`liftTarget`](https://prosemirror.net/docs/ref/#transform.liftTarget) to compute `target`, to make
    sure the lift is valid.
    */ lift(range, target) {
        $5dfe06a1d53a4883$var$lift(this, range, target);
        return this;
    }
    /**
    Join the blocks around the given position. If depth is 2, their
    last and first siblings are also joined, and so on.
    */ join(pos, depth = 1) {
        $5dfe06a1d53a4883$var$join(this, pos, depth);
        return this;
    }
    /**
    Wrap the given [range](https://prosemirror.net/docs/ref/#model.NodeRange) in the given set of wrappers.
    The wrappers are assumed to be valid in this position, and should
    probably be computed with [`findWrapping`](https://prosemirror.net/docs/ref/#transform.findWrapping).
    */ wrap(range, wrappers) {
        $5dfe06a1d53a4883$var$wrap(this, range, wrappers);
        return this;
    }
    /**
    Set the type of all textblocks (partly) between `from` and `to` to
    the given node type with the given attributes.
    */ setBlockType(from, to = from, type, attrs = null) {
        $5dfe06a1d53a4883$var$setBlockType(this, from, to, type, attrs);
        return this;
    }
    /**
    Change the type, attributes, and/or marks of the node at `pos`.
    When `type` isn't given, the existing node type is preserved,
    */ setNodeMarkup(pos, type, attrs = null, marks = []) {
        $5dfe06a1d53a4883$var$setNodeMarkup(this, pos, type, attrs, marks);
        return this;
    }
    /**
    Set a single attribute on a given node to a new value.
    */ setNodeAttribute(pos, attr, value) {
        this.step(new $5dfe06a1d53a4883$export$626399c38172f669(pos, attr, value));
        return this;
    }
    /**
    Add a mark to the node at position `pos`.
    */ addNodeMark(pos, mark) {
        this.step(new $5dfe06a1d53a4883$export$adefd16c402fee4e(pos, mark));
        return this;
    }
    /**
    Remove a mark (or a mark of the given type) from the node at
    position `pos`.
    */ removeNodeMark(pos, mark) {
        if (!(mark instanceof (0, $c8d507d90382f091$export$c9d15bcfc6d42044))) {
            let node = this.doc.nodeAt(pos);
            if (!node) throw new RangeError("No node at position " + pos);
            mark = mark.isInSet(node.marks);
            if (!mark) return this;
        }
        this.step(new $5dfe06a1d53a4883$export$fdf7d1dc10724da2(pos, mark));
        return this;
    }
    /**
    Split the node at the given position, and optionally, if `depth` is
    greater than one, any number of nodes above that. By default, the
    parts split off will inherit the node type of the original node.
    This can be changed by passing an array of types and attributes to
    use after the split.
    */ split(pos, depth = 1, typesAfter) {
        $5dfe06a1d53a4883$var$split(this, pos, depth, typesAfter);
        return this;
    }
    /**
    Add the given mark to the inline content between `from` and `to`.
    */ addMark(from, to, mark) {
        $5dfe06a1d53a4883$var$addMark(this, from, to, mark);
        return this;
    }
    /**
    Remove marks from inline nodes between `from` and `to`. When
    `mark` is a single mark, remove precisely that mark. When it is
    a mark type, remove all marks of that type. When it is null,
    remove all marks of any type.
    */ removeMark(from, to, mark) {
        $5dfe06a1d53a4883$var$removeMark(this, from, to, mark);
        return this;
    }
    /**
    Removes all marks and nodes from the content of the node at
    `pos` that don't match the given new parent node type. Accepts
    an optional starting [content match](https://prosemirror.net/docs/ref/#model.ContentMatch) as
    third argument.
    */ clearIncompatible(pos, parentType, match) {
        $5dfe06a1d53a4883$var$clearIncompatible(this, pos, parentType, match);
        return this;
    }
}


const $ee27db283572d394$var$classesById = Object.create(null);
/**
Superclass for editor selections. Every selection type should
extend this. Should not be instantiated directly.
*/ class $ee27db283572d394$export$52baac22726c72bf {
    /**
    Initialize a selection with the head and anchor and ranges. If no
    ranges are given, constructs a single range across `$anchor` and
    `$head`.
    */ constructor(/**
    The resolved anchor of the selection (the side that stays in
    place when the selection is modified).
    */ $anchor, /**
    The resolved head of the selection (the side that moves when
    the selection is modified).
    */ $head, ranges){
        this.$anchor = $anchor;
        this.$head = $head;
        this.ranges = ranges || [
            new $ee27db283572d394$export$7bd1839c3c5d5bd4($anchor.min($head), $anchor.max($head))
        ];
    }
    /**
    The selection's anchor, as an unresolved position.
    */ get anchor() {
        return this.$anchor.pos;
    }
    /**
    The selection's head.
    */ get head() {
        return this.$head.pos;
    }
    /**
    The lower bound of the selection's main range.
    */ get from() {
        return this.$from.pos;
    }
    /**
    The upper bound of the selection's main range.
    */ get to() {
        return this.$to.pos;
    }
    /**
    The resolved lower  bound of the selection's main range.
    */ get $from() {
        return this.ranges[0].$from;
    }
    /**
    The resolved upper bound of the selection's main range.
    */ get $to() {
        return this.ranges[0].$to;
    }
    /**
    Indicates whether the selection contains any content.
    */ get empty() {
        let ranges = this.ranges;
        for(let i = 0; i < ranges.length; i++)if (ranges[i].$from.pos != ranges[i].$to.pos) return false;
        return true;
    }
    /**
    Get the content of this selection as a slice.
    */ content() {
        return this.$from.doc.slice(this.from, this.to, true);
    }
    /**
    Replace the selection with a slice or, if no slice is given,
    delete the selection. Will append to the given transaction.
    */ replace(tr, content = (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).empty) {
        // Put the new selection at the position after the inserted
        // content. When that ended in an inline node, search backwards,
        // to get the position after that node. If not, search forward.
        let lastNode = content.content.lastChild, lastParent = null;
        for(let i = 0; i < content.openEnd; i++){
            lastParent = lastNode;
            lastNode = lastNode.lastChild;
        }
        let mapFrom = tr.steps.length, ranges = this.ranges;
        for(let i1 = 0; i1 < ranges.length; i1++){
            let { $from: $from , $to: $to  } = ranges[i1], mapping = tr.mapping.slice(mapFrom);
            tr.replaceRange(mapping.map($from.pos), mapping.map($to.pos), i1 ? (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).empty : content);
            if (i1 == 0) $ee27db283572d394$var$selectionToInsertionEnd(tr, mapFrom, (lastNode ? lastNode.isInline : lastParent && lastParent.isTextblock) ? -1 : 1);
        }
    }
    /**
    Replace the selection with the given node, appending the changes
    to the given transaction.
    */ replaceWith(tr, node) {
        let mapFrom = tr.steps.length, ranges = this.ranges;
        for(let i = 0; i < ranges.length; i++){
            let { $from: $from , $to: $to  } = ranges[i], mapping = tr.mapping.slice(mapFrom);
            let from = mapping.map($from.pos), to = mapping.map($to.pos);
            if (i) tr.deleteRange(from, to);
            else {
                tr.replaceRangeWith(from, to, node);
                $ee27db283572d394$var$selectionToInsertionEnd(tr, mapFrom, node.isInline ? -1 : 1);
            }
        }
    }
    /**
    Find a valid cursor or leaf node selection starting at the given
    position and searching back if `dir` is negative, and forward if
    positive. When `textOnly` is true, only consider cursor
    selections. Will return null when no valid selection position is
    found.
    */ static findFrom($pos, dir, textOnly = false) {
        let inner = $pos.parent.inlineContent ? new $ee27db283572d394$export$c2b25f346d19bcbb($pos) : $ee27db283572d394$var$findSelectionIn($pos.node(0), $pos.parent, $pos.pos, $pos.index(), dir, textOnly);
        if (inner) return inner;
        for(let depth = $pos.depth - 1; depth >= 0; depth--){
            let found = dir < 0 ? $ee27db283572d394$var$findSelectionIn($pos.node(0), $pos.node(depth), $pos.before(depth + 1), $pos.index(depth), dir, textOnly) : $ee27db283572d394$var$findSelectionIn($pos.node(0), $pos.node(depth), $pos.after(depth + 1), $pos.index(depth) + 1, dir, textOnly);
            if (found) return found;
        }
        return null;
    }
    /**
    Find a valid cursor or leaf node selection near the given
    position. Searches forward first by default, but if `bias` is
    negative, it will search backwards first.
    */ static near($pos, bias = 1) {
        return this.findFrom($pos, bias) || this.findFrom($pos, -bias) || new $ee27db283572d394$export$c15d9ba76bdbcd95($pos.node(0));
    }
    /**
    Find the cursor or leaf node selection closest to the start of
    the given document. Will return an
    [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
    exists.
    */ static atStart(doc) {
        return $ee27db283572d394$var$findSelectionIn(doc, doc, 0, 0, 1) || new $ee27db283572d394$export$c15d9ba76bdbcd95(doc);
    }
    /**
    Find the cursor or leaf node selection closest to the end of the
    given document.
    */ static atEnd(doc) {
        return $ee27db283572d394$var$findSelectionIn(doc, doc, doc.content.size, doc.childCount, -1) || new $ee27db283572d394$export$c15d9ba76bdbcd95(doc);
    }
    /**
    Deserialize the JSON representation of a selection. Must be
    implemented for custom classes (as a static class method).
    */ static fromJSON(doc, json) {
        if (!json || !json.type) throw new RangeError("Invalid input for Selection.fromJSON");
        let cls = $ee27db283572d394$var$classesById[json.type];
        if (!cls) throw new RangeError(`No selection type ${json.type} defined`);
        return cls.fromJSON(doc, json);
    }
    /**
    To be able to deserialize selections from JSON, custom selection
    classes must register themselves with an ID string, so that they
    can be disambiguated. Try to pick something that's unlikely to
    clash with classes from other modules.
    */ static jsonID(id, selectionClass) {
        if (id in $ee27db283572d394$var$classesById) throw new RangeError("Duplicate use of selection JSON ID " + id);
        $ee27db283572d394$var$classesById[id] = selectionClass;
        selectionClass.prototype.jsonID = id;
        return selectionClass;
    }
    /**
    Get a [bookmark](https://prosemirror.net/docs/ref/#state.SelectionBookmark) for this selection,
    which is a value that can be mapped without having access to a
    current document, and later resolved to a real selection for a
    given document again. (This is used mostly by the history to
    track and restore old selections.) The default implementation of
    this method just converts the selection to a text selection and
    returns the bookmark for that.
    */ getBookmark() {
        return $ee27db283572d394$export$c2b25f346d19bcbb.between(this.$anchor, this.$head).getBookmark();
    }
}
$ee27db283572d394$export$52baac22726c72bf.prototype.visible = true;
/**
Represents a selected range in a document.
*/ class $ee27db283572d394$export$7bd1839c3c5d5bd4 {
    /**
    Create a range.
    */ constructor(/**
    The lower bound of the range.
    */ $from, /**
    The upper bound of the range.
    */ $to){
        this.$from = $from;
        this.$to = $to;
    }
}
let $ee27db283572d394$var$warnedAboutTextSelection = false;
function $ee27db283572d394$var$checkTextSelection($pos) {
    if (!$ee27db283572d394$var$warnedAboutTextSelection && !$pos.parent.inlineContent) {
        $ee27db283572d394$var$warnedAboutTextSelection = true;
        console["warn"]("TextSelection endpoint not pointing into a node with inline content (" + $pos.parent.type.name + ")");
    }
}
/**
A text selection represents a classical editor selection, with a
head (the moving side) and anchor (immobile side), both of which
point into textblock nodes. It can be empty (a regular cursor
position).
*/ class $ee27db283572d394$export$c2b25f346d19bcbb extends $ee27db283572d394$export$52baac22726c72bf {
    /**
    Construct a text selection between the given points.
    */ constructor($anchor, $head = $anchor){
        $ee27db283572d394$var$checkTextSelection($anchor);
        $ee27db283572d394$var$checkTextSelection($head);
        super($anchor, $head);
    }
    /**
    Returns a resolved position if this is a cursor selection (an
    empty text selection), and null otherwise.
    */ get $cursor() {
        return this.$anchor.pos == this.$head.pos ? this.$head : null;
    }
    map(doc, mapping) {
        let $head = doc.resolve(mapping.map(this.head));
        if (!$head.parent.inlineContent) return $ee27db283572d394$export$52baac22726c72bf.near($head);
        let $anchor = doc.resolve(mapping.map(this.anchor));
        return new $ee27db283572d394$export$c2b25f346d19bcbb($anchor.parent.inlineContent ? $anchor : $head, $head);
    }
    replace(tr, content = (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).empty) {
        super.replace(tr, content);
        if (content == (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).empty) {
            let marks = this.$from.marksAcross(this.$to);
            if (marks) tr.ensureMarks(marks);
        }
    }
    eq(other) {
        return other instanceof $ee27db283572d394$export$c2b25f346d19bcbb && other.anchor == this.anchor && other.head == this.head;
    }
    getBookmark() {
        return new $ee27db283572d394$var$TextBookmark(this.anchor, this.head);
    }
    toJSON() {
        return {
            type: "text",
            anchor: this.anchor,
            head: this.head
        };
    }
    /**
    @internal
    */ static fromJSON(doc, json) {
        if (typeof json.anchor != "number" || typeof json.head != "number") throw new RangeError("Invalid input for TextSelection.fromJSON");
        return new $ee27db283572d394$export$c2b25f346d19bcbb(doc.resolve(json.anchor), doc.resolve(json.head));
    }
    /**
    Create a text selection from non-resolved positions.
    */ static create(doc, anchor, head = anchor) {
        let $anchor = doc.resolve(anchor);
        return new this($anchor, head == anchor ? $anchor : doc.resolve(head));
    }
    /**
    Return a text selection that spans the given positions or, if
    they aren't text positions, find a text selection near them.
    `bias` determines whether the method searches forward (default)
    or backwards (negative number) first. Will fall back to calling
    [`Selection.near`](https://prosemirror.net/docs/ref/#state.Selection^near) when the document
    doesn't contain a valid text position.
    */ static between($anchor, $head, bias) {
        let dPos = $anchor.pos - $head.pos;
        if (!bias || dPos) bias = dPos >= 0 ? 1 : -1;
        if (!$head.parent.inlineContent) {
            let found = $ee27db283572d394$export$52baac22726c72bf.findFrom($head, bias, true) || $ee27db283572d394$export$52baac22726c72bf.findFrom($head, -bias, true);
            if (found) $head = found.$head;
            else return $ee27db283572d394$export$52baac22726c72bf.near($head, bias);
        }
        if (!$anchor.parent.inlineContent) {
            if (dPos == 0) $anchor = $head;
            else {
                $anchor = ($ee27db283572d394$export$52baac22726c72bf.findFrom($anchor, -bias, true) || $ee27db283572d394$export$52baac22726c72bf.findFrom($anchor, bias, true)).$anchor;
                if ($anchor.pos < $head.pos != dPos < 0) $anchor = $head;
            }
        }
        return new $ee27db283572d394$export$c2b25f346d19bcbb($anchor, $head);
    }
}
$ee27db283572d394$export$52baac22726c72bf.jsonID("text", $ee27db283572d394$export$c2b25f346d19bcbb);
class $ee27db283572d394$var$TextBookmark {
    constructor(anchor, head){
        this.anchor = anchor;
        this.head = head;
    }
    map(mapping) {
        return new $ee27db283572d394$var$TextBookmark(mapping.map(this.anchor), mapping.map(this.head));
    }
    resolve(doc) {
        return $ee27db283572d394$export$c2b25f346d19bcbb.between(doc.resolve(this.anchor), doc.resolve(this.head));
    }
}
/**
A node selection is a selection that points at a single node. All
nodes marked [selectable](https://prosemirror.net/docs/ref/#model.NodeSpec.selectable) can be the
target of a node selection. In such a selection, `from` and `to`
point directly before and after the selected node, `anchor` equals
`from`, and `head` equals `to`..
*/ class $ee27db283572d394$export$e2940151ac854c0b extends $ee27db283572d394$export$52baac22726c72bf {
    /**
    Create a node selection. Does not verify the validity of its
    argument.
    */ constructor($pos){
        let node = $pos.nodeAfter;
        let $end = $pos.node(0).resolve($pos.pos + node.nodeSize);
        super($pos, $end);
        this.node = node;
    }
    map(doc, mapping) {
        let { deleted: deleted , pos: pos  } = mapping.mapResult(this.anchor);
        let $pos = doc.resolve(pos);
        if (deleted) return $ee27db283572d394$export$52baac22726c72bf.near($pos);
        return new $ee27db283572d394$export$e2940151ac854c0b($pos);
    }
    content() {
        return new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)((0, $c8d507d90382f091$export$ffb0004e005737fa).from(this.node), 0, 0);
    }
    eq(other) {
        return other instanceof $ee27db283572d394$export$e2940151ac854c0b && other.anchor == this.anchor;
    }
    toJSON() {
        return {
            type: "node",
            anchor: this.anchor
        };
    }
    getBookmark() {
        return new $ee27db283572d394$var$NodeBookmark(this.anchor);
    }
    /**
    @internal
    */ static fromJSON(doc, json) {
        if (typeof json.anchor != "number") throw new RangeError("Invalid input for NodeSelection.fromJSON");
        return new $ee27db283572d394$export$e2940151ac854c0b(doc.resolve(json.anchor));
    }
    /**
    Create a node selection from non-resolved positions.
    */ static create(doc, from) {
        return new $ee27db283572d394$export$e2940151ac854c0b(doc.resolve(from));
    }
    /**
    Determines whether the given node may be selected as a node
    selection.
    */ static isSelectable(node) {
        return !node.isText && node.type.spec.selectable !== false;
    }
}
$ee27db283572d394$export$e2940151ac854c0b.prototype.visible = false;
$ee27db283572d394$export$52baac22726c72bf.jsonID("node", $ee27db283572d394$export$e2940151ac854c0b);
class $ee27db283572d394$var$NodeBookmark {
    constructor(anchor){
        this.anchor = anchor;
    }
    map(mapping) {
        let { deleted: deleted , pos: pos  } = mapping.mapResult(this.anchor);
        return deleted ? new $ee27db283572d394$var$TextBookmark(pos, pos) : new $ee27db283572d394$var$NodeBookmark(pos);
    }
    resolve(doc) {
        let $pos = doc.resolve(this.anchor), node = $pos.nodeAfter;
        if (node && $ee27db283572d394$export$e2940151ac854c0b.isSelectable(node)) return new $ee27db283572d394$export$e2940151ac854c0b($pos);
        return $ee27db283572d394$export$52baac22726c72bf.near($pos);
    }
}
/**
A selection type that represents selecting the whole document
(which can not necessarily be expressed with a text selection, when
there are for example leaf block nodes at the start or end of the
document).
*/ class $ee27db283572d394$export$c15d9ba76bdbcd95 extends $ee27db283572d394$export$52baac22726c72bf {
    /**
    Create an all-selection over the given document.
    */ constructor(doc){
        super(doc.resolve(0), doc.resolve(doc.content.size));
    }
    replace(tr, content = (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).empty) {
        if (content == (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).empty) {
            tr.delete(0, tr.doc.content.size);
            let sel = $ee27db283572d394$export$52baac22726c72bf.atStart(tr.doc);
            if (!sel.eq(tr.selection)) tr.setSelection(sel);
        } else super.replace(tr, content);
    }
    toJSON() {
        return {
            type: "all"
        };
    }
    /**
    @internal
    */ static fromJSON(doc) {
        return new $ee27db283572d394$export$c15d9ba76bdbcd95(doc);
    }
    map(doc) {
        return new $ee27db283572d394$export$c15d9ba76bdbcd95(doc);
    }
    eq(other) {
        return other instanceof $ee27db283572d394$export$c15d9ba76bdbcd95;
    }
    getBookmark() {
        return $ee27db283572d394$var$AllBookmark;
    }
}
$ee27db283572d394$export$52baac22726c72bf.jsonID("all", $ee27db283572d394$export$c15d9ba76bdbcd95);
const $ee27db283572d394$var$AllBookmark = {
    map () {
        return this;
    },
    resolve (doc) {
        return new $ee27db283572d394$export$c15d9ba76bdbcd95(doc);
    }
};
// FIXME we'll need some awareness of text direction when scanning for selections
// Try to find a selection inside the given node. `pos` points at the
// position where the search starts. When `text` is true, only return
// text selections.
function $ee27db283572d394$var$findSelectionIn(doc, node, pos, index, dir, text = false) {
    if (node.inlineContent) return $ee27db283572d394$export$c2b25f346d19bcbb.create(doc, pos);
    for(let i = index - (dir > 0 ? 0 : 1); dir > 0 ? i < node.childCount : i >= 0; i += dir){
        let child = node.child(i);
        if (!child.isAtom) {
            let inner = $ee27db283572d394$var$findSelectionIn(doc, child, pos + dir, dir < 0 ? child.childCount : 0, dir, text);
            if (inner) return inner;
        } else if (!text && $ee27db283572d394$export$e2940151ac854c0b.isSelectable(child)) return $ee27db283572d394$export$e2940151ac854c0b.create(doc, pos - (dir < 0 ? child.nodeSize : 0));
        pos += child.nodeSize * dir;
    }
    return null;
}
function $ee27db283572d394$var$selectionToInsertionEnd(tr, startLen, bias) {
    let last = tr.steps.length - 1;
    if (last < startLen) return;
    let step = tr.steps[last];
    if (!(step instanceof (0, $5dfe06a1d53a4883$export$5c860b2e74034756) || step instanceof (0, $5dfe06a1d53a4883$export$444ba800d6024a98))) return;
    let map = tr.mapping.maps[last], end;
    map.forEach((_from, _to, _newFrom, newTo)=>{
        if (end == null) end = newTo;
    });
    tr.setSelection($ee27db283572d394$export$52baac22726c72bf.near(tr.doc.resolve(end), bias));
}
const $ee27db283572d394$var$UPDATED_SEL = 1, $ee27db283572d394$var$UPDATED_MARKS = 2, $ee27db283572d394$var$UPDATED_SCROLL = 4;
/**
An editor state transaction, which can be applied to a state to
create an updated state. Use
[`EditorState.tr`](https://prosemirror.net/docs/ref/#state.EditorState.tr) to create an instance.

Transactions track changes to the document (they are a subclass of
[`Transform`](https://prosemirror.net/docs/ref/#transform.Transform)), but also other state changes,
like selection updates and adjustments of the set of [stored
marks](https://prosemirror.net/docs/ref/#state.EditorState.storedMarks). In addition, you can store
metadata properties in a transaction, which are extra pieces of
information that client code or plugins can use to describe what a
transaction represents, so that they can update their [own
state](https://prosemirror.net/docs/ref/#state.StateField) accordingly.

The [editor view](https://prosemirror.net/docs/ref/#view.EditorView) uses a few metadata properties:
it will attach a property `"pointer"` with the value `true` to
selection transactions directly caused by mouse or touch input, and
a `"uiEvent"` property of that may be `"paste"`, `"cut"`, or `"drop"`.
*/ class $ee27db283572d394$export$febc5573c75cefb0 extends (0, $5dfe06a1d53a4883$export$563a914cafbdc389) {
    /**
    @internal
    */ constructor(state){
        super(state.doc);
        // The step count for which the current selection is valid.
        this.curSelectionFor = 0;
        // Bitfield to track which aspects of the state were updated by
        // this transaction.
        this.updated = 0;
        // Object used to store metadata properties for the transaction.
        this.meta = Object.create(null);
        this.time = Date.now();
        this.curSelection = state.selection;
        this.storedMarks = state.storedMarks;
    }
    /**
    The transaction's current selection. This defaults to the editor
    selection [mapped](https://prosemirror.net/docs/ref/#state.Selection.map) through the steps in the
    transaction, but can be overwritten with
    [`setSelection`](https://prosemirror.net/docs/ref/#state.Transaction.setSelection).
    */ get selection() {
        if (this.curSelectionFor < this.steps.length) {
            this.curSelection = this.curSelection.map(this.doc, this.mapping.slice(this.curSelectionFor));
            this.curSelectionFor = this.steps.length;
        }
        return this.curSelection;
    }
    /**
    Update the transaction's current selection. Will determine the
    selection that the editor gets when the transaction is applied.
    */ setSelection(selection) {
        if (selection.$from.doc != this.doc) throw new RangeError("Selection passed to setSelection must point at the current document");
        this.curSelection = selection;
        this.curSelectionFor = this.steps.length;
        this.updated = (this.updated | $ee27db283572d394$var$UPDATED_SEL) & ~$ee27db283572d394$var$UPDATED_MARKS;
        this.storedMarks = null;
        return this;
    }
    /**
    Whether the selection was explicitly updated by this transaction.
    */ get selectionSet() {
        return (this.updated & $ee27db283572d394$var$UPDATED_SEL) > 0;
    }
    /**
    Set the current stored marks.
    */ setStoredMarks(marks) {
        this.storedMarks = marks;
        this.updated |= $ee27db283572d394$var$UPDATED_MARKS;
        return this;
    }
    /**
    Make sure the current stored marks or, if that is null, the marks
    at the selection, match the given set of marks. Does nothing if
    this is already the case.
    */ ensureMarks(marks) {
        if (!(0, $c8d507d90382f091$export$c9d15bcfc6d42044).sameSet(this.storedMarks || this.selection.$from.marks(), marks)) this.setStoredMarks(marks);
        return this;
    }
    /**
    Add a mark to the set of stored marks.
    */ addStoredMark(mark) {
        return this.ensureMarks(mark.addToSet(this.storedMarks || this.selection.$head.marks()));
    }
    /**
    Remove a mark or mark type from the set of stored marks.
    */ removeStoredMark(mark) {
        return this.ensureMarks(mark.removeFromSet(this.storedMarks || this.selection.$head.marks()));
    }
    /**
    Whether the stored marks were explicitly set for this transaction.
    */ get storedMarksSet() {
        return (this.updated & $ee27db283572d394$var$UPDATED_MARKS) > 0;
    }
    /**
    @internal
    */ addStep(step, doc) {
        super.addStep(step, doc);
        this.updated = this.updated & ~$ee27db283572d394$var$UPDATED_MARKS;
        this.storedMarks = null;
    }
    /**
    Update the timestamp for the transaction.
    */ setTime(time) {
        this.time = time;
        return this;
    }
    /**
    Replace the current selection with the given slice.
    */ replaceSelection(slice) {
        this.selection.replace(this, slice);
        return this;
    }
    /**
    Replace the selection with the given node. When `inheritMarks` is
    true and the content is inline, it inherits the marks from the
    place where it is inserted.
    */ replaceSelectionWith(node, inheritMarks = true) {
        let selection = this.selection;
        if (inheritMarks) node = node.mark(this.storedMarks || (selection.empty ? selection.$from.marks() : selection.$from.marksAcross(selection.$to) || (0, $c8d507d90382f091$export$c9d15bcfc6d42044).none));
        selection.replaceWith(this, node);
        return this;
    }
    /**
    Delete the selection.
    */ deleteSelection() {
        this.selection.replace(this);
        return this;
    }
    /**
    Replace the given range, or the selection if no range is given,
    with a text node containing the given string.
    */ insertText(text, from, to) {
        let schema = this.doc.type.schema;
        if (from == null) {
            if (!text) return this.deleteSelection();
            return this.replaceSelectionWith(schema.text(text), true);
        } else {
            if (to == null) to = from;
            to = to == null ? from : to;
            if (!text) return this.deleteRange(from, to);
            let marks = this.storedMarks;
            if (!marks) {
                let $from = this.doc.resolve(from);
                marks = to == from ? $from.marks() : $from.marksAcross(this.doc.resolve(to));
            }
            this.replaceRangeWith(from, to, schema.text(text, marks));
            if (!this.selection.empty) this.setSelection($ee27db283572d394$export$52baac22726c72bf.near(this.selection.$to));
            return this;
        }
    }
    /**
    Store a metadata property in this transaction, keyed either by
    name or by plugin.
    */ setMeta(key, value) {
        this.meta[typeof key == "string" ? key : key.key] = value;
        return this;
    }
    /**
    Retrieve a metadata property for a given name or plugin.
    */ getMeta(key) {
        return this.meta[typeof key == "string" ? key : key.key];
    }
    /**
    Returns true if this transaction doesn't contain any metadata,
    and can thus safely be extended.
    */ get isGeneric() {
        for(let _ in this.meta)return false;
        return true;
    }
    /**
    Indicate that the editor should scroll the selection into view
    when updated to the state produced by this transaction.
    */ scrollIntoView() {
        this.updated |= $ee27db283572d394$var$UPDATED_SCROLL;
        return this;
    }
    /**
    True when this transaction has had `scrollIntoView` called on it.
    */ get scrolledIntoView() {
        return (this.updated & $ee27db283572d394$var$UPDATED_SCROLL) > 0;
    }
}
function $ee27db283572d394$var$bind(f, self) {
    return !self || !f ? f : f.bind(self);
}
class $ee27db283572d394$var$FieldDesc {
    constructor(name, desc, self){
        this.name = name;
        this.init = $ee27db283572d394$var$bind(desc.init, self);
        this.apply = $ee27db283572d394$var$bind(desc.apply, self);
    }
}
const $ee27db283572d394$var$baseFields = [
    new $ee27db283572d394$var$FieldDesc("doc", {
        init (config) {
            return config.doc || config.schema.topNodeType.createAndFill();
        },
        apply (tr) {
            return tr.doc;
        }
    }),
    new $ee27db283572d394$var$FieldDesc("selection", {
        init (config, instance) {
            return config.selection || $ee27db283572d394$export$52baac22726c72bf.atStart(instance.doc);
        },
        apply (tr) {
            return tr.selection;
        }
    }),
    new $ee27db283572d394$var$FieldDesc("storedMarks", {
        init (config) {
            return config.storedMarks || null;
        },
        apply (tr, _marks, _old, state) {
            return state.selection.$cursor ? tr.storedMarks : null;
        }
    }),
    new $ee27db283572d394$var$FieldDesc("scrollToSelection", {
        init () {
            return 0;
        },
        apply (tr, prev) {
            return tr.scrolledIntoView ? prev + 1 : prev;
        }
    })
];
// Object wrapping the part of a state object that stays the same
// across transactions. Stored in the state's `config` property.
class $ee27db283572d394$var$Configuration {
    constructor(schema, plugins){
        this.schema = schema;
        this.plugins = [];
        this.pluginsByKey = Object.create(null);
        this.fields = $ee27db283572d394$var$baseFields.slice();
        if (plugins) plugins.forEach((plugin)=>{
            if (this.pluginsByKey[plugin.key]) throw new RangeError("Adding different instances of a keyed plugin (" + plugin.key + ")");
            this.plugins.push(plugin);
            this.pluginsByKey[plugin.key] = plugin;
            if (plugin.spec.state) this.fields.push(new $ee27db283572d394$var$FieldDesc(plugin.key, plugin.spec.state, plugin));
        });
    }
}
/**
The state of a ProseMirror editor is represented by an object of
this type. A state is a persistent data structure—it isn't
updated, but rather a new state value is computed from an old one
using the [`apply`](https://prosemirror.net/docs/ref/#state.EditorState.apply) method.

A state holds a number of built-in fields, and plugins can
[define](https://prosemirror.net/docs/ref/#state.PluginSpec.state) additional fields.
*/ class $ee27db283572d394$export$afa855cbfaff27f2 {
    /**
    @internal
    */ constructor(/**
    @internal
    */ config){
        this.config = config;
    }
    /**
    The schema of the state's document.
    */ get schema() {
        return this.config.schema;
    }
    /**
    The plugins that are active in this state.
    */ get plugins() {
        return this.config.plugins;
    }
    /**
    Apply the given transaction to produce a new state.
    */ apply(tr) {
        return this.applyTransaction(tr).state;
    }
    /**
    @internal
    */ filterTransaction(tr, ignore = -1) {
        for(let i = 0; i < this.config.plugins.length; i++)if (i != ignore) {
            let plugin = this.config.plugins[i];
            if (plugin.spec.filterTransaction && !plugin.spec.filterTransaction.call(plugin, tr, this)) return false;
        }
        return true;
    }
    /**
    Verbose variant of [`apply`](https://prosemirror.net/docs/ref/#state.EditorState.apply) that
    returns the precise transactions that were applied (which might
    be influenced by the [transaction
    hooks](https://prosemirror.net/docs/ref/#state.PluginSpec.filterTransaction) of
    plugins) along with the new state.
    */ applyTransaction(rootTr) {
        if (!this.filterTransaction(rootTr)) return {
            state: this,
            transactions: []
        };
        let trs = [
            rootTr
        ], newState = this.applyInner(rootTr), seen = null;
        // This loop repeatedly gives plugins a chance to respond to
        // transactions as new transactions are added, making sure to only
        // pass the transactions the plugin did not see before.
        for(;;){
            let haveNew = false;
            for(let i = 0; i < this.config.plugins.length; i++){
                let plugin = this.config.plugins[i];
                if (plugin.spec.appendTransaction) {
                    let n = seen ? seen[i].n : 0, oldState = seen ? seen[i].state : this;
                    let tr = n < trs.length && plugin.spec.appendTransaction.call(plugin, n ? trs.slice(n) : trs, oldState, newState);
                    if (tr && newState.filterTransaction(tr, i)) {
                        tr.setMeta("appendedTransaction", rootTr);
                        if (!seen) {
                            seen = [];
                            for(let j = 0; j < this.config.plugins.length; j++)seen.push(j < i ? {
                                state: newState,
                                n: trs.length
                            } : {
                                state: this,
                                n: 0
                            });
                        }
                        trs.push(tr);
                        newState = newState.applyInner(tr);
                        haveNew = true;
                    }
                    if (seen) seen[i] = {
                        state: newState,
                        n: trs.length
                    };
                }
            }
            if (!haveNew) return {
                state: newState,
                transactions: trs
            };
        }
    }
    /**
    @internal
    */ applyInner(tr) {
        if (!tr.before.eq(this.doc)) throw new RangeError("Applying a mismatched transaction");
        let newInstance = new $ee27db283572d394$export$afa855cbfaff27f2(this.config), fields = this.config.fields;
        for(let i = 0; i < fields.length; i++){
            let field = fields[i];
            newInstance[field.name] = field.apply(tr, this[field.name], this, newInstance);
        }
        return newInstance;
    }
    /**
    Start a [transaction](https://prosemirror.net/docs/ref/#state.Transaction) from this state.
    */ get tr() {
        return new $ee27db283572d394$export$febc5573c75cefb0(this);
    }
    /**
    Create a new state.
    */ static create(config) {
        let $config = new $ee27db283572d394$var$Configuration(config.doc ? config.doc.type.schema : config.schema, config.plugins);
        let instance = new $ee27db283572d394$export$afa855cbfaff27f2($config);
        for(let i = 0; i < $config.fields.length; i++)instance[$config.fields[i].name] = $config.fields[i].init(config, instance);
        return instance;
    }
    /**
    Create a new state based on this one, but with an adjusted set
    of active plugins. State fields that exist in both sets of
    plugins are kept unchanged. Those that no longer exist are
    dropped, and those that are new are initialized using their
    [`init`](https://prosemirror.net/docs/ref/#state.StateField.init) method, passing in the new
    configuration object..
    */ reconfigure(config) {
        let $config = new $ee27db283572d394$var$Configuration(this.schema, config.plugins);
        let fields = $config.fields, instance = new $ee27db283572d394$export$afa855cbfaff27f2($config);
        for(let i = 0; i < fields.length; i++){
            let name = fields[i].name;
            instance[name] = this.hasOwnProperty(name) ? this[name] : fields[i].init(config, instance);
        }
        return instance;
    }
    /**
    Serialize this state to JSON. If you want to serialize the state
    of plugins, pass an object mapping property names to use in the
    resulting JSON object to plugin objects. The argument may also be
    a string or number, in which case it is ignored, to support the
    way `JSON.stringify` calls `toString` methods.
    */ toJSON(pluginFields) {
        let result = {
            doc: this.doc.toJSON(),
            selection: this.selection.toJSON()
        };
        if (this.storedMarks) result.storedMarks = this.storedMarks.map((m)=>m.toJSON());
        if (pluginFields && typeof pluginFields == "object") for(let prop in pluginFields){
            if (prop == "doc" || prop == "selection") throw new RangeError("The JSON fields `doc` and `selection` are reserved");
            let plugin = pluginFields[prop], state = plugin.spec.state;
            if (state && state.toJSON) result[prop] = state.toJSON.call(plugin, this[plugin.key]);
        }
        return result;
    }
    /**
    Deserialize a JSON representation of a state. `config` should
    have at least a `schema` field, and should contain array of
    plugins to initialize the state with. `pluginFields` can be used
    to deserialize the state of plugins, by associating plugin
    instances with the property names they use in the JSON object.
    */ static fromJSON(config, json, pluginFields) {
        if (!json) throw new RangeError("Invalid input for EditorState.fromJSON");
        if (!config.schema) throw new RangeError("Required config field 'schema' missing");
        let $config = new $ee27db283572d394$var$Configuration(config.schema, config.plugins);
        let instance = new $ee27db283572d394$export$afa855cbfaff27f2($config);
        $config.fields.forEach((field)=>{
            if (field.name == "doc") instance.doc = (0, $c8d507d90382f091$export$85c928794f8d04d4).fromJSON(config.schema, json.doc);
            else if (field.name == "selection") instance.selection = $ee27db283572d394$export$52baac22726c72bf.fromJSON(instance.doc, json.selection);
            else if (field.name == "storedMarks") {
                if (json.storedMarks) instance.storedMarks = json.storedMarks.map(config.schema.markFromJSON);
            } else {
                if (pluginFields) for(let prop in pluginFields){
                    let plugin = pluginFields[prop], state = plugin.spec.state;
                    if (plugin.key == field.name && state && state.fromJSON && Object.prototype.hasOwnProperty.call(json, prop)) {
                        instance[field.name] = state.fromJSON.call(plugin, config, json[prop], instance);
                        return;
                    }
                }
                instance[field.name] = field.init(config, instance);
            }
        });
        return instance;
    }
}
function $ee27db283572d394$var$bindProps(obj, self, target) {
    for(let prop in obj){
        let val = obj[prop];
        if (val instanceof Function) val = val.bind(self);
        else if (prop == "handleDOMEvents") val = $ee27db283572d394$var$bindProps(val, self, {});
        target[prop] = val;
    }
    return target;
}
/**
Plugins bundle functionality that can be added to an editor.
They are part of the [editor state](https://prosemirror.net/docs/ref/#state.EditorState) and
may influence that state and the view that contains it.
*/ class $ee27db283572d394$export$901cf72dabf2112a {
    /**
    Create a plugin.
    */ constructor(/**
    The plugin's [spec object](https://prosemirror.net/docs/ref/#state.PluginSpec).
    */ spec){
        this.spec = spec;
        /**
        The [props](https://prosemirror.net/docs/ref/#view.EditorProps) exported by this plugin.
        */ this.props = {};
        if (spec.props) $ee27db283572d394$var$bindProps(spec.props, this, this.props);
        this.key = spec.key ? spec.key.key : $ee27db283572d394$var$createKey("plugin");
    }
    /**
    Extract the plugin's state field from an editor state.
    */ getState(state) {
        return state[this.key];
    }
}
const $ee27db283572d394$var$keys = Object.create(null);
function $ee27db283572d394$var$createKey(name) {
    if (name in $ee27db283572d394$var$keys) return name + "$" + ++$ee27db283572d394$var$keys[name];
    $ee27db283572d394$var$keys[name] = 0;
    return name + "$";
}
/**
A key is used to [tag](https://prosemirror.net/docs/ref/#state.PluginSpec.key) plugins in a way
that makes it possible to find them, given an editor state.
Assigning a key does mean only one plugin of that type can be
active in a state.
*/ class $ee27db283572d394$export$1692d8b0e89cecc3 {
    /**
    Create a plugin key.
    */ constructor(name = "key"){
        this.key = $ee27db283572d394$var$createKey(name);
    }
    /**
    Get the active plugin with this key, if any, from an editor
    state.
    */ get(state) {
        return state.config.pluginsByKey[this.key];
    }
    /**
    Get the plugin's state from an editor state.
    */ getState(state) {
        return state[this.key];
    }
}




const $4fda26bcd679fbcb$var$domIndex = function(node) {
    for(var index = 0;; index++){
        node = node.previousSibling;
        if (!node) return index;
    }
};
const $4fda26bcd679fbcb$var$parentNode = function(node) {
    let parent = node.assignedSlot || node.parentNode;
    return parent && parent.nodeType == 11 ? parent.host : parent;
};
let $4fda26bcd679fbcb$var$reusedRange = null;
// Note that this will always return the same range, because DOM range
// objects are every expensive, and keep slowing down subsequent DOM
// updates, for some reason.
const $4fda26bcd679fbcb$var$textRange = function(node, from, to) {
    let range = $4fda26bcd679fbcb$var$reusedRange || ($4fda26bcd679fbcb$var$reusedRange = document.createRange());
    range.setEnd(node, to == null ? node.nodeValue.length : to);
    range.setStart(node, from || 0);
    return range;
};
// Scans forward and backward through DOM positions equivalent to the
// given one to see if the two are in the same place (i.e. after a
// text node vs at the end of that text node)
const $4fda26bcd679fbcb$var$isEquivalentPosition = function(node, off, targetNode, targetOff) {
    return targetNode && ($4fda26bcd679fbcb$var$scanFor(node, off, targetNode, targetOff, -1) || $4fda26bcd679fbcb$var$scanFor(node, off, targetNode, targetOff, 1));
};
const $4fda26bcd679fbcb$var$atomElements = /^(img|br|input|textarea|hr)$/i;
function $4fda26bcd679fbcb$var$scanFor(node, off, targetNode, targetOff, dir) {
    for(;;){
        if (node == targetNode && off == targetOff) return true;
        if (off == (dir < 0 ? 0 : $4fda26bcd679fbcb$var$nodeSize(node))) {
            let parent = node.parentNode;
            if (!parent || parent.nodeType != 1 || $4fda26bcd679fbcb$var$hasBlockDesc(node) || $4fda26bcd679fbcb$var$atomElements.test(node.nodeName) || node.contentEditable == "false") return false;
            off = $4fda26bcd679fbcb$var$domIndex(node) + (dir < 0 ? 0 : 1);
            node = parent;
        } else if (node.nodeType == 1) {
            node = node.childNodes[off + (dir < 0 ? -1 : 0)];
            if (node.contentEditable == "false") return false;
            off = dir < 0 ? $4fda26bcd679fbcb$var$nodeSize(node) : 0;
        } else return false;
    }
}
function $4fda26bcd679fbcb$var$nodeSize(node) {
    return node.nodeType == 3 ? node.nodeValue.length : node.childNodes.length;
}
function $4fda26bcd679fbcb$var$isOnEdge(node, offset, parent) {
    for(let atStart = offset == 0, atEnd = offset == $4fda26bcd679fbcb$var$nodeSize(node); atStart || atEnd;){
        if (node == parent) return true;
        let index = $4fda26bcd679fbcb$var$domIndex(node);
        node = node.parentNode;
        if (!node) return false;
        atStart = atStart && index == 0;
        atEnd = atEnd && index == $4fda26bcd679fbcb$var$nodeSize(node);
    }
}
function $4fda26bcd679fbcb$var$hasBlockDesc(dom) {
    let desc;
    for(let cur = dom; cur; cur = cur.parentNode)if (desc = cur.pmViewDesc) break;
    return desc && desc.node && desc.node.isBlock && (desc.dom == dom || desc.contentDOM == dom);
}
// Work around Chrome issue https://bugs.chromium.org/p/chromium/issues/detail?id=447523
// (isCollapsed inappropriately returns true in shadow dom)
const $4fda26bcd679fbcb$var$selectionCollapsed = function(domSel) {
    return domSel.focusNode && $4fda26bcd679fbcb$var$isEquivalentPosition(domSel.focusNode, domSel.focusOffset, domSel.anchorNode, domSel.anchorOffset);
};
function $4fda26bcd679fbcb$var$keyEvent(keyCode, key) {
    let event = document.createEvent("Event");
    event.initEvent("keydown", true, true);
    event.keyCode = keyCode;
    event.key = event.code = key;
    return event;
}
function $4fda26bcd679fbcb$var$deepActiveElement(doc) {
    let elt = doc.activeElement;
    while(elt && elt.shadowRoot)elt = elt.shadowRoot.activeElement;
    return elt;
}
const $4fda26bcd679fbcb$var$nav = typeof navigator != "undefined" ? navigator : null;
const $4fda26bcd679fbcb$var$doc = typeof document != "undefined" ? document : null;
const $4fda26bcd679fbcb$var$agent = $4fda26bcd679fbcb$var$nav && $4fda26bcd679fbcb$var$nav.userAgent || "";
const $4fda26bcd679fbcb$var$ie_edge = /Edge\/(\d+)/.exec($4fda26bcd679fbcb$var$agent);
const $4fda26bcd679fbcb$var$ie_upto10 = /MSIE \d/.exec($4fda26bcd679fbcb$var$agent);
const $4fda26bcd679fbcb$var$ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec($4fda26bcd679fbcb$var$agent);
const $4fda26bcd679fbcb$var$ie = !!($4fda26bcd679fbcb$var$ie_upto10 || $4fda26bcd679fbcb$var$ie_11up || $4fda26bcd679fbcb$var$ie_edge);
const $4fda26bcd679fbcb$var$ie_version = $4fda26bcd679fbcb$var$ie_upto10 ? document.documentMode : $4fda26bcd679fbcb$var$ie_11up ? +$4fda26bcd679fbcb$var$ie_11up[1] : $4fda26bcd679fbcb$var$ie_edge ? +$4fda26bcd679fbcb$var$ie_edge[1] : 0;
const $4fda26bcd679fbcb$var$gecko = !$4fda26bcd679fbcb$var$ie && /gecko\/(\d+)/i.test($4fda26bcd679fbcb$var$agent);
$4fda26bcd679fbcb$var$gecko && (/Firefox\/(\d+)/.exec($4fda26bcd679fbcb$var$agent) || [
    0,
    0
])[1];
const $4fda26bcd679fbcb$var$_chrome = !$4fda26bcd679fbcb$var$ie && /Chrome\/(\d+)/.exec($4fda26bcd679fbcb$var$agent);
const $4fda26bcd679fbcb$var$chrome = !!$4fda26bcd679fbcb$var$_chrome;
const $4fda26bcd679fbcb$var$chrome_version = $4fda26bcd679fbcb$var$_chrome ? +$4fda26bcd679fbcb$var$_chrome[1] : 0;
const $4fda26bcd679fbcb$var$safari = !$4fda26bcd679fbcb$var$ie && !!$4fda26bcd679fbcb$var$nav && /Apple Computer/.test($4fda26bcd679fbcb$var$nav.vendor);
// Is true for both iOS and iPadOS for convenience
const $4fda26bcd679fbcb$var$ios = $4fda26bcd679fbcb$var$safari && (/Mobile\/\w+/.test($4fda26bcd679fbcb$var$agent) || !!$4fda26bcd679fbcb$var$nav && $4fda26bcd679fbcb$var$nav.maxTouchPoints > 2);
const $4fda26bcd679fbcb$var$mac = $4fda26bcd679fbcb$var$ios || ($4fda26bcd679fbcb$var$nav ? /Mac/.test($4fda26bcd679fbcb$var$nav.platform) : false);
const $4fda26bcd679fbcb$var$android = /Android \d/.test($4fda26bcd679fbcb$var$agent);
const $4fda26bcd679fbcb$var$webkit = !!$4fda26bcd679fbcb$var$doc && "webkitFontSmoothing" in $4fda26bcd679fbcb$var$doc.documentElement.style;
const $4fda26bcd679fbcb$var$webkit_version = $4fda26bcd679fbcb$var$webkit ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [
    0,
    0
])[1] : 0;
function $4fda26bcd679fbcb$var$windowRect(doc) {
    return {
        left: 0,
        right: doc.documentElement.clientWidth,
        top: 0,
        bottom: doc.documentElement.clientHeight
    };
}
function $4fda26bcd679fbcb$var$getSide(value, side) {
    return typeof value == "number" ? value : value[side];
}
function $4fda26bcd679fbcb$var$clientRect(node) {
    let rect = node.getBoundingClientRect();
    // Adjust for elements with style "transform: scale()"
    let scaleX = rect.width / node.offsetWidth || 1;
    let scaleY = rect.height / node.offsetHeight || 1;
    // Make sure scrollbar width isn't included in the rectangle
    return {
        left: rect.left,
        right: rect.left + node.clientWidth * scaleX,
        top: rect.top,
        bottom: rect.top + node.clientHeight * scaleY
    };
}
function $4fda26bcd679fbcb$var$scrollRectIntoView(view, rect, startDOM) {
    let scrollThreshold = view.someProp("scrollThreshold") || 0, scrollMargin = view.someProp("scrollMargin") || 5;
    let doc = view.dom.ownerDocument;
    for(let parent = startDOM || view.dom;; parent = $4fda26bcd679fbcb$var$parentNode(parent)){
        if (!parent) break;
        if (parent.nodeType != 1) continue;
        let elt = parent;
        let atTop = elt == doc.body;
        let bounding = atTop ? $4fda26bcd679fbcb$var$windowRect(doc) : $4fda26bcd679fbcb$var$clientRect(elt);
        let moveX = 0, moveY = 0;
        if (rect.top < bounding.top + $4fda26bcd679fbcb$var$getSide(scrollThreshold, "top")) moveY = -(bounding.top - rect.top + $4fda26bcd679fbcb$var$getSide(scrollMargin, "top"));
        else if (rect.bottom > bounding.bottom - $4fda26bcd679fbcb$var$getSide(scrollThreshold, "bottom")) moveY = rect.bottom - bounding.bottom + $4fda26bcd679fbcb$var$getSide(scrollMargin, "bottom");
        if (rect.left < bounding.left + $4fda26bcd679fbcb$var$getSide(scrollThreshold, "left")) moveX = -(bounding.left - rect.left + $4fda26bcd679fbcb$var$getSide(scrollMargin, "left"));
        else if (rect.right > bounding.right - $4fda26bcd679fbcb$var$getSide(scrollThreshold, "right")) moveX = rect.right - bounding.right + $4fda26bcd679fbcb$var$getSide(scrollMargin, "right");
        if (moveX || moveY) {
            if (atTop) doc.defaultView.scrollBy(moveX, moveY);
            else {
                let startX = elt.scrollLeft, startY = elt.scrollTop;
                if (moveY) elt.scrollTop += moveY;
                if (moveX) elt.scrollLeft += moveX;
                let dX = elt.scrollLeft - startX, dY = elt.scrollTop - startY;
                rect = {
                    left: rect.left - dX,
                    top: rect.top - dY,
                    right: rect.right - dX,
                    bottom: rect.bottom - dY
                };
            }
        }
        if (atTop) break;
    }
}
// Store the scroll position of the editor's parent nodes, along with
// the top position of an element near the top of the editor, which
// will be used to make sure the visible viewport remains stable even
// when the size of the content above changes.
function $4fda26bcd679fbcb$var$storeScrollPos(view) {
    let rect = view.dom.getBoundingClientRect(), startY = Math.max(0, rect.top);
    let refDOM, refTop;
    for(let x = (rect.left + rect.right) / 2, y = startY + 1; y < Math.min(innerHeight, rect.bottom); y += 5){
        let dom = view.root.elementFromPoint(x, y);
        if (!dom || dom == view.dom || !view.dom.contains(dom)) continue;
        let localRect = dom.getBoundingClientRect();
        if (localRect.top >= startY - 20) {
            refDOM = dom;
            refTop = localRect.top;
            break;
        }
    }
    return {
        refDOM: refDOM,
        refTop: refTop,
        stack: $4fda26bcd679fbcb$var$scrollStack(view.dom)
    };
}
function $4fda26bcd679fbcb$var$scrollStack(dom) {
    let stack = [], doc = dom.ownerDocument;
    for(let cur = dom; cur; cur = $4fda26bcd679fbcb$var$parentNode(cur)){
        stack.push({
            dom: cur,
            top: cur.scrollTop,
            left: cur.scrollLeft
        });
        if (dom == doc) break;
    }
    return stack;
}
// Reset the scroll position of the editor's parent nodes to that what
// it was before, when storeScrollPos was called.
function $4fda26bcd679fbcb$var$resetScrollPos({ refDOM: refDOM , refTop: refTop , stack: stack  }) {
    let newRefTop = refDOM ? refDOM.getBoundingClientRect().top : 0;
    $4fda26bcd679fbcb$var$restoreScrollStack(stack, newRefTop == 0 ? 0 : newRefTop - refTop);
}
function $4fda26bcd679fbcb$var$restoreScrollStack(stack, dTop) {
    for(let i = 0; i < stack.length; i++){
        let { dom: dom , top: top , left: left  } = stack[i];
        if (dom.scrollTop != top + dTop) dom.scrollTop = top + dTop;
        if (dom.scrollLeft != left) dom.scrollLeft = left;
    }
}
let $4fda26bcd679fbcb$var$preventScrollSupported = null;
// Feature-detects support for .focus({preventScroll: true}), and uses
// a fallback kludge when not supported.
function $4fda26bcd679fbcb$var$focusPreventScroll(dom) {
    if (dom.setActive) return dom.setActive(); // in IE
    if ($4fda26bcd679fbcb$var$preventScrollSupported) return dom.focus($4fda26bcd679fbcb$var$preventScrollSupported);
    let stored = $4fda26bcd679fbcb$var$scrollStack(dom);
    dom.focus($4fda26bcd679fbcb$var$preventScrollSupported == null ? {
        get preventScroll () {
            $4fda26bcd679fbcb$var$preventScrollSupported = {
                preventScroll: true
            };
            return true;
        }
    } : undefined);
    if (!$4fda26bcd679fbcb$var$preventScrollSupported) {
        $4fda26bcd679fbcb$var$preventScrollSupported = false;
        $4fda26bcd679fbcb$var$restoreScrollStack(stored, 0);
    }
}
function $4fda26bcd679fbcb$var$findOffsetInNode(node, coords) {
    let closest, dxClosest = 2e8, coordsClosest, offset = 0;
    let rowBot = coords.top, rowTop = coords.top;
    for(let child = node.firstChild, childIndex = 0; child; child = child.nextSibling, childIndex++){
        let rects;
        if (child.nodeType == 1) rects = child.getClientRects();
        else if (child.nodeType == 3) rects = $4fda26bcd679fbcb$var$textRange(child).getClientRects();
        else continue;
        for(let i = 0; i < rects.length; i++){
            let rect = rects[i];
            if (rect.top <= rowBot && rect.bottom >= rowTop) {
                rowBot = Math.max(rect.bottom, rowBot);
                rowTop = Math.min(rect.top, rowTop);
                let dx = rect.left > coords.left ? rect.left - coords.left : rect.right < coords.left ? coords.left - rect.right : 0;
                if (dx < dxClosest) {
                    closest = child;
                    dxClosest = dx;
                    coordsClosest = dx && closest.nodeType == 3 ? {
                        left: rect.right < coords.left ? rect.right : rect.left,
                        top: coords.top
                    } : coords;
                    if (child.nodeType == 1 && dx) offset = childIndex + (coords.left >= (rect.left + rect.right) / 2 ? 1 : 0);
                    continue;
                }
            }
            if (!closest && (coords.left >= rect.right && coords.top >= rect.top || coords.left >= rect.left && coords.top >= rect.bottom)) offset = childIndex + 1;
        }
    }
    if (closest && closest.nodeType == 3) return $4fda26bcd679fbcb$var$findOffsetInText(closest, coordsClosest);
    if (!closest || dxClosest && closest.nodeType == 1) return {
        node: node,
        offset: offset
    };
    return $4fda26bcd679fbcb$var$findOffsetInNode(closest, coordsClosest);
}
function $4fda26bcd679fbcb$var$findOffsetInText(node, coords) {
    let len = node.nodeValue.length;
    let range = document.createRange();
    for(let i = 0; i < len; i++){
        range.setEnd(node, i + 1);
        range.setStart(node, i);
        let rect = $4fda26bcd679fbcb$var$singleRect(range, 1);
        if (rect.top == rect.bottom) continue;
        if ($4fda26bcd679fbcb$var$inRect(coords, rect)) return {
            node: node,
            offset: i + (coords.left >= (rect.left + rect.right) / 2 ? 1 : 0)
        };
    }
    return {
        node: node,
        offset: 0
    };
}
function $4fda26bcd679fbcb$var$inRect(coords, rect) {
    return coords.left >= rect.left - 1 && coords.left <= rect.right + 1 && coords.top >= rect.top - 1 && coords.top <= rect.bottom + 1;
}
function $4fda26bcd679fbcb$var$targetKludge(dom, coords) {
    let parent = dom.parentNode;
    if (parent && /^li$/i.test(parent.nodeName) && coords.left < dom.getBoundingClientRect().left) return parent;
    return dom;
}
function $4fda26bcd679fbcb$var$posFromElement(view, elt, coords) {
    let { node: node , offset: offset  } = $4fda26bcd679fbcb$var$findOffsetInNode(elt, coords), bias = -1;
    if (node.nodeType == 1 && !node.firstChild) {
        let rect = node.getBoundingClientRect();
        bias = rect.left != rect.right && coords.left > (rect.left + rect.right) / 2 ? 1 : -1;
    }
    return view.docView.posFromDOM(node, offset, bias);
}
function $4fda26bcd679fbcb$var$posFromCaret(view, node, offset, coords) {
    // Browser (in caretPosition/RangeFromPoint) will agressively
    // normalize towards nearby inline nodes. Since we are interested in
    // positions between block nodes too, we first walk up the hierarchy
    // of nodes to see if there are block nodes that the coordinates
    // fall outside of. If so, we take the position before/after that
    // block. If not, we call `posFromDOM` on the raw node/offset.
    let outside = -1;
    for(let cur = node;;){
        if (cur == view.dom) break;
        let desc = view.docView.nearestDesc(cur, true);
        if (!desc) return null;
        if (desc.node.isBlock && desc.parent) {
            let rect = desc.dom.getBoundingClientRect();
            if (rect.left > coords.left || rect.top > coords.top) outside = desc.posBefore;
            else if (rect.right < coords.left || rect.bottom < coords.top) outside = desc.posAfter;
            else break;
        }
        cur = desc.dom.parentNode;
    }
    return outside > -1 ? outside : view.docView.posFromDOM(node, offset, 1);
}
function $4fda26bcd679fbcb$var$elementFromPoint(element, coords, box) {
    let len = element.childNodes.length;
    if (len && box.top < box.bottom) for(let startI = Math.max(0, Math.min(len - 1, Math.floor(len * (coords.top - box.top) / (box.bottom - box.top)) - 2)), i = startI;;){
        let child = element.childNodes[i];
        if (child.nodeType == 1) {
            let rects = child.getClientRects();
            for(let j = 0; j < rects.length; j++){
                let rect = rects[j];
                if ($4fda26bcd679fbcb$var$inRect(coords, rect)) return $4fda26bcd679fbcb$var$elementFromPoint(child, coords, rect);
            }
        }
        if ((i = (i + 1) % len) == startI) break;
    }
    return element;
}
// Given an x,y position on the editor, get the position in the document.
function $4fda26bcd679fbcb$var$posAtCoords(view, coords) {
    let doc = view.dom.ownerDocument, node, offset = 0;
    if (doc.caretPositionFromPoint) try {
        let pos = doc.caretPositionFromPoint(coords.left, coords.top);
        if (pos) ({ offsetNode: node , offset: offset  } = pos);
    } catch (_) {}
    if (!node && doc.caretRangeFromPoint) {
        let range = doc.caretRangeFromPoint(coords.left, coords.top);
        if (range) ({ startContainer: node , startOffset: offset  } = range);
    }
    let elt = (view.root.elementFromPoint ? view.root : doc).elementFromPoint(coords.left, coords.top);
    let pos1;
    if (!elt || !view.dom.contains(elt.nodeType != 1 ? elt.parentNode : elt)) {
        let box = view.dom.getBoundingClientRect();
        if (!$4fda26bcd679fbcb$var$inRect(coords, box)) return null;
        elt = $4fda26bcd679fbcb$var$elementFromPoint(view.dom, coords, box);
        if (!elt) return null;
    }
    // Safari's caretRangeFromPoint returns nonsense when on a draggable element
    if ($4fda26bcd679fbcb$var$safari) {
        for(let p = elt; node && p; p = $4fda26bcd679fbcb$var$parentNode(p))if (p.draggable) node = undefined;
    }
    elt = $4fda26bcd679fbcb$var$targetKludge(elt, coords);
    if (node) {
        if ($4fda26bcd679fbcb$var$gecko && node.nodeType == 1) {
            // Firefox will sometimes return offsets into <input> nodes, which
            // have no actual children, from caretPositionFromPoint (#953)
            offset = Math.min(offset, node.childNodes.length);
            // It'll also move the returned position before image nodes,
            // even if those are behind it.
            if (offset < node.childNodes.length) {
                let next = node.childNodes[offset], box1;
                if (next.nodeName == "IMG" && (box1 = next.getBoundingClientRect()).right <= coords.left && box1.bottom > coords.top) offset++;
            }
        }
        // Suspiciously specific kludge to work around caret*FromPoint
        // never returning a position at the end of the document
        if (node == view.dom && offset == node.childNodes.length - 1 && node.lastChild.nodeType == 1 && coords.top > node.lastChild.getBoundingClientRect().bottom) pos1 = view.state.doc.content.size;
        else if (offset == 0 || node.nodeType != 1 || node.childNodes[offset - 1].nodeName != "BR") pos1 = $4fda26bcd679fbcb$var$posFromCaret(view, node, offset, coords);
    }
    if (pos1 == null) pos1 = $4fda26bcd679fbcb$var$posFromElement(view, elt, coords);
    let desc = view.docView.nearestDesc(elt, true);
    return {
        pos: pos1,
        inside: desc ? desc.posAtStart - desc.border : -1
    };
}
function $4fda26bcd679fbcb$var$singleRect(target, bias) {
    let rects = target.getClientRects();
    return !rects.length ? target.getBoundingClientRect() : rects[bias < 0 ? 0 : rects.length - 1];
}
const $4fda26bcd679fbcb$var$BIDI = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
// Given a position in the document model, get a bounding box of the
// character at that position, relative to the window.
function $4fda26bcd679fbcb$var$coordsAtPos(view, pos, side) {
    let { node: node , offset: offset , atom: atom  } = view.docView.domFromPos(pos, side < 0 ? -1 : 1);
    let supportEmptyRange = $4fda26bcd679fbcb$var$webkit || $4fda26bcd679fbcb$var$gecko;
    if (node.nodeType == 3) {
        // These browsers support querying empty text ranges. Prefer that in
        // bidi context or when at the end of a node.
        if (supportEmptyRange && ($4fda26bcd679fbcb$var$BIDI.test(node.nodeValue) || (side < 0 ? !offset : offset == node.nodeValue.length))) {
            let rect = $4fda26bcd679fbcb$var$singleRect($4fda26bcd679fbcb$var$textRange(node, offset, offset), side);
            // Firefox returns bad results (the position before the space)
            // when querying a position directly after line-broken
            // whitespace. Detect this situation and and kludge around it
            if ($4fda26bcd679fbcb$var$gecko && offset && /\s/.test(node.nodeValue[offset - 1]) && offset < node.nodeValue.length) {
                let rectBefore = $4fda26bcd679fbcb$var$singleRect($4fda26bcd679fbcb$var$textRange(node, offset - 1, offset - 1), -1);
                if (rectBefore.top == rect.top) {
                    let rectAfter = $4fda26bcd679fbcb$var$singleRect($4fda26bcd679fbcb$var$textRange(node, offset, offset + 1), -1);
                    if (rectAfter.top != rect.top) return $4fda26bcd679fbcb$var$flattenV(rectAfter, rectAfter.left < rectBefore.left);
                }
            }
            return rect;
        } else {
            let from = offset, to = offset, takeSide = side < 0 ? 1 : -1;
            if (side < 0 && !offset) {
                to++;
                takeSide = -1;
            } else if (side >= 0 && offset == node.nodeValue.length) {
                from--;
                takeSide = 1;
            } else if (side < 0) from--;
            else to++;
            return $4fda26bcd679fbcb$var$flattenV($4fda26bcd679fbcb$var$singleRect($4fda26bcd679fbcb$var$textRange(node, from, to), 1), takeSide < 0);
        }
    }
    let $dom = view.state.doc.resolve(pos - (atom || 0));
    // Return a horizontal line in block context
    if (!$dom.parent.inlineContent) {
        if (atom == null && offset && (side < 0 || offset == $4fda26bcd679fbcb$var$nodeSize(node))) {
            let before = node.childNodes[offset - 1];
            if (before.nodeType == 1) return $4fda26bcd679fbcb$var$flattenH(before.getBoundingClientRect(), false);
        }
        if (atom == null && offset < $4fda26bcd679fbcb$var$nodeSize(node)) {
            let after = node.childNodes[offset];
            if (after.nodeType == 1) return $4fda26bcd679fbcb$var$flattenH(after.getBoundingClientRect(), true);
        }
        return $4fda26bcd679fbcb$var$flattenH(node.getBoundingClientRect(), side >= 0);
    }
    // Inline, not in text node (this is not Bidi-safe)
    if (atom == null && offset && (side < 0 || offset == $4fda26bcd679fbcb$var$nodeSize(node))) {
        let before1 = node.childNodes[offset - 1];
        let target = before1.nodeType == 3 ? $4fda26bcd679fbcb$var$textRange(before1, $4fda26bcd679fbcb$var$nodeSize(before1) - (supportEmptyRange ? 0 : 1)) : before1.nodeType == 1 && (before1.nodeName != "BR" || !before1.nextSibling) ? before1 : null;
        if (target) return $4fda26bcd679fbcb$var$flattenV($4fda26bcd679fbcb$var$singleRect(target, 1), false);
    }
    if (atom == null && offset < $4fda26bcd679fbcb$var$nodeSize(node)) {
        let after1 = node.childNodes[offset];
        while(after1.pmViewDesc && after1.pmViewDesc.ignoreForCoords)after1 = after1.nextSibling;
        let target1 = !after1 ? null : after1.nodeType == 3 ? $4fda26bcd679fbcb$var$textRange(after1, 0, supportEmptyRange ? 0 : 1) : after1.nodeType == 1 ? after1 : null;
        if (target1) return $4fda26bcd679fbcb$var$flattenV($4fda26bcd679fbcb$var$singleRect(target1, -1), true);
    }
    // All else failed, just try to get a rectangle for the target node
    return $4fda26bcd679fbcb$var$flattenV($4fda26bcd679fbcb$var$singleRect(node.nodeType == 3 ? $4fda26bcd679fbcb$var$textRange(node) : node, -side), side >= 0);
}
function $4fda26bcd679fbcb$var$flattenV(rect, left) {
    if (rect.width == 0) return rect;
    let x = left ? rect.left : rect.right;
    return {
        top: rect.top,
        bottom: rect.bottom,
        left: x,
        right: x
    };
}
function $4fda26bcd679fbcb$var$flattenH(rect, top) {
    if (rect.height == 0) return rect;
    let y = top ? rect.top : rect.bottom;
    return {
        top: y,
        bottom: y,
        left: rect.left,
        right: rect.right
    };
}
function $4fda26bcd679fbcb$var$withFlushedState(view, state, f) {
    let viewState = view.state, active = view.root.activeElement;
    if (viewState != state) view.updateState(state);
    if (active != view.dom) view.focus();
    try {
        return f();
    } finally{
        if (viewState != state) view.updateState(viewState);
        if (active != view.dom && active) active.focus();
    }
}
// Whether vertical position motion in a given direction
// from a position would leave a text block.
function $4fda26bcd679fbcb$var$endOfTextblockVertical(view, state, dir) {
    let sel = state.selection;
    let $pos = dir == "up" ? sel.$from : sel.$to;
    return $4fda26bcd679fbcb$var$withFlushedState(view, state, ()=>{
        let { node: dom  } = view.docView.domFromPos($pos.pos, dir == "up" ? -1 : 1);
        for(;;){
            let nearest = view.docView.nearestDesc(dom, true);
            if (!nearest) break;
            if (nearest.node.isBlock) {
                dom = nearest.dom;
                break;
            }
            dom = nearest.dom.parentNode;
        }
        let coords = $4fda26bcd679fbcb$var$coordsAtPos(view, $pos.pos, 1);
        for(let child = dom.firstChild; child; child = child.nextSibling){
            let boxes;
            if (child.nodeType == 1) boxes = child.getClientRects();
            else if (child.nodeType == 3) boxes = $4fda26bcd679fbcb$var$textRange(child, 0, child.nodeValue.length).getClientRects();
            else continue;
            for(let i = 0; i < boxes.length; i++){
                let box = boxes[i];
                if (box.bottom > box.top + 1 && (dir == "up" ? coords.top - box.top > (box.bottom - coords.top) * 2 : box.bottom - coords.bottom > (coords.bottom - box.top) * 2)) return false;
            }
        }
        return true;
    });
}
const $4fda26bcd679fbcb$var$maybeRTL = /[\u0590-\u08ac]/;
function $4fda26bcd679fbcb$var$endOfTextblockHorizontal(view, state, dir) {
    let { $head: $head  } = state.selection;
    if (!$head.parent.isTextblock) return false;
    let offset = $head.parentOffset, atStart = !offset, atEnd = offset == $head.parent.content.size;
    let sel = view.domSelection();
    // If the textblock is all LTR, or the browser doesn't support
    // Selection.modify (Edge), fall back to a primitive approach
    if (!$4fda26bcd679fbcb$var$maybeRTL.test($head.parent.textContent) || !sel.modify) return dir == "left" || dir == "backward" ? atStart : atEnd;
    return $4fda26bcd679fbcb$var$withFlushedState(view, state, ()=>{
        // This is a huge hack, but appears to be the best we can
        // currently do: use `Selection.modify` to move the selection by
        // one character, and see if that moves the cursor out of the
        // textblock (or doesn't move it at all, when at the start/end of
        // the document).
        let { focusNode: oldNode , focusOffset: oldOff , anchorNode: anchorNode , anchorOffset: anchorOffset  } = view.domSelectionRange();
        let oldBidiLevel = sel.caretBidiLevel // Only for Firefox
        ;
        sel.modify("move", dir, "character");
        let parentDOM = $head.depth ? view.docView.domAfterPos($head.before()) : view.dom;
        let { focusNode: newNode , focusOffset: newOff  } = view.domSelectionRange();
        let result = newNode && !parentDOM.contains(newNode.nodeType == 1 ? newNode : newNode.parentNode) || oldNode == newNode && oldOff == newOff;
        // Restore the previous selection
        try {
            sel.collapse(anchorNode, anchorOffset);
            if (oldNode && (oldNode != anchorNode || oldOff != anchorOffset) && sel.extend) sel.extend(oldNode, oldOff);
        } catch (_) {}
        if (oldBidiLevel != null) sel.caretBidiLevel = oldBidiLevel;
        return result;
    });
}
let $4fda26bcd679fbcb$var$cachedState = null;
let $4fda26bcd679fbcb$var$cachedDir = null;
let $4fda26bcd679fbcb$var$cachedResult = false;
function $4fda26bcd679fbcb$var$endOfTextblock(view, state, dir) {
    if ($4fda26bcd679fbcb$var$cachedState == state && $4fda26bcd679fbcb$var$cachedDir == dir) return $4fda26bcd679fbcb$var$cachedResult;
    $4fda26bcd679fbcb$var$cachedState = state;
    $4fda26bcd679fbcb$var$cachedDir = dir;
    return $4fda26bcd679fbcb$var$cachedResult = dir == "up" || dir == "down" ? $4fda26bcd679fbcb$var$endOfTextblockVertical(view, state, dir) : $4fda26bcd679fbcb$var$endOfTextblockHorizontal(view, state, dir);
}
// View descriptions are data structures that describe the DOM that is
// used to represent the editor's content. They are used for:
//
// - Incremental redrawing when the document changes
//
// - Figuring out what part of the document a given DOM position
//   corresponds to
//
// - Wiring in custom implementations of the editing interface for a
//   given node
//
// They form a doubly-linked mutable tree, starting at `view.docView`.
const $4fda26bcd679fbcb$var$NOT_DIRTY = 0, $4fda26bcd679fbcb$var$CHILD_DIRTY = 1, $4fda26bcd679fbcb$var$CONTENT_DIRTY = 2, $4fda26bcd679fbcb$var$NODE_DIRTY = 3;
// Superclass for the various kinds of descriptions. Defines their
// basic structure and shared methods.
class $4fda26bcd679fbcb$var$ViewDesc {
    constructor(parent, children, dom, // This is the node that holds the child views. It may be null for
    // descs that don't have children.
    contentDOM){
        this.parent = parent;
        this.children = children;
        this.dom = dom;
        this.contentDOM = contentDOM;
        this.dirty = $4fda26bcd679fbcb$var$NOT_DIRTY;
        // An expando property on the DOM node provides a link back to its
        // description.
        dom.pmViewDesc = this;
    }
    // Used to check whether a given description corresponds to a
    // widget/mark/node.
    matchesWidget(widget) {
        return false;
    }
    matchesMark(mark) {
        return false;
    }
    matchesNode(node, outerDeco, innerDeco) {
        return false;
    }
    matchesHack(nodeName) {
        return false;
    }
    // When parsing in-editor content (in domchange.js), we allow
    // descriptions to determine the parse rules that should be used to
    // parse them.
    parseRule() {
        return null;
    }
    // Used by the editor's event handler to ignore events that come
    // from certain descs.
    stopEvent(event) {
        return false;
    }
    // The size of the content represented by this desc.
    get size() {
        let size = 0;
        for(let i = 0; i < this.children.length; i++)size += this.children[i].size;
        return size;
    }
    // For block nodes, this represents the space taken up by their
    // start/end tokens.
    get border() {
        return 0;
    }
    destroy() {
        this.parent = undefined;
        if (this.dom.pmViewDesc == this) this.dom.pmViewDesc = undefined;
        for(let i = 0; i < this.children.length; i++)this.children[i].destroy();
    }
    posBeforeChild(child) {
        for(let i = 0, pos = this.posAtStart;; i++){
            let cur = this.children[i];
            if (cur == child) return pos;
            pos += cur.size;
        }
    }
    get posBefore() {
        return this.parent.posBeforeChild(this);
    }
    get posAtStart() {
        return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
    }
    get posAfter() {
        return this.posBefore + this.size;
    }
    get posAtEnd() {
        return this.posAtStart + this.size - 2 * this.border;
    }
    localPosFromDOM(dom, offset, bias) {
        // If the DOM position is in the content, use the child desc after
        // it to figure out a position.
        if (this.contentDOM && this.contentDOM.contains(dom.nodeType == 1 ? dom : dom.parentNode)) {
            if (bias < 0) {
                let domBefore, desc;
                if (dom == this.contentDOM) domBefore = dom.childNodes[offset - 1];
                else {
                    while(dom.parentNode != this.contentDOM)dom = dom.parentNode;
                    domBefore = dom.previousSibling;
                }
                while(domBefore && !((desc = domBefore.pmViewDesc) && desc.parent == this))domBefore = domBefore.previousSibling;
                return domBefore ? this.posBeforeChild(desc) + desc.size : this.posAtStart;
            } else {
                let domAfter, desc1;
                if (dom == this.contentDOM) domAfter = dom.childNodes[offset];
                else {
                    while(dom.parentNode != this.contentDOM)dom = dom.parentNode;
                    domAfter = dom.nextSibling;
                }
                while(domAfter && !((desc1 = domAfter.pmViewDesc) && desc1.parent == this))domAfter = domAfter.nextSibling;
                return domAfter ? this.posBeforeChild(desc1) : this.posAtEnd;
            }
        }
        // Otherwise, use various heuristics, falling back on the bias
        // parameter, to determine whether to return the position at the
        // start or at the end of this view desc.
        let atEnd;
        if (dom == this.dom && this.contentDOM) atEnd = offset > $4fda26bcd679fbcb$var$domIndex(this.contentDOM);
        else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM)) atEnd = dom.compareDocumentPosition(this.contentDOM) & 2;
        else if (this.dom.firstChild) {
            if (offset == 0) for(let search = dom;; search = search.parentNode){
                if (search == this.dom) {
                    atEnd = false;
                    break;
                }
                if (search.previousSibling) break;
            }
            if (atEnd == null && offset == dom.childNodes.length) for(let search1 = dom;; search1 = search1.parentNode){
                if (search1 == this.dom) {
                    atEnd = true;
                    break;
                }
                if (search1.nextSibling) break;
            }
        }
        return (atEnd == null ? bias > 0 : atEnd) ? this.posAtEnd : this.posAtStart;
    }
    // Scan up the dom finding the first desc that is a descendant of
    // this one.
    nearestDesc(dom, onlyNodes = false) {
        for(let first = true, cur = dom; cur; cur = cur.parentNode){
            let desc = this.getDesc(cur), nodeDOM;
            if (desc && (!onlyNodes || desc.node)) {
                // If dom is outside of this desc's nodeDOM, don't count it.
                if (first && (nodeDOM = desc.nodeDOM) && !(nodeDOM.nodeType == 1 ? nodeDOM.contains(dom.nodeType == 1 ? dom : dom.parentNode) : nodeDOM == dom)) first = false;
                else return desc;
            }
        }
    }
    getDesc(dom) {
        let desc = dom.pmViewDesc;
        for(let cur = desc; cur; cur = cur.parent)if (cur == this) return desc;
    }
    posFromDOM(dom, offset, bias) {
        for(let scan = dom; scan; scan = scan.parentNode){
            let desc = this.getDesc(scan);
            if (desc) return desc.localPosFromDOM(dom, offset, bias);
        }
        return -1;
    }
    // Find the desc for the node after the given pos, if any. (When a
    // parent node overrode rendering, there might not be one.)
    descAt(pos) {
        for(let i = 0, offset = 0; i < this.children.length; i++){
            let child = this.children[i], end = offset + child.size;
            if (offset == pos && end != offset) {
                while(!child.border && child.children.length)child = child.children[0];
                return child;
            }
            if (pos < end) return child.descAt(pos - offset - child.border);
            offset = end;
        }
    }
    domFromPos(pos, side) {
        if (!this.contentDOM) return {
            node: this.dom,
            offset: 0,
            atom: pos + 1
        };
        // First find the position in the child array
        let i = 0, offset = 0;
        for(let curPos = 0; i < this.children.length; i++){
            let child = this.children[i], end = curPos + child.size;
            if (end > pos || child instanceof $4fda26bcd679fbcb$var$TrailingHackViewDesc) {
                offset = pos - curPos;
                break;
            }
            curPos = end;
        }
        // If this points into the middle of a child, call through
        if (offset) return this.children[i].domFromPos(offset - this.children[i].border, side);
        // Go back if there were any zero-length widgets with side >= 0 before this point
        for(let prev; i && !(prev = this.children[i - 1]).size && prev instanceof $4fda26bcd679fbcb$var$WidgetViewDesc && prev.side >= 0; i--);
        // Scan towards the first useable node
        if (side <= 0) {
            let prev1, enter = true;
            for(;; i--, enter = false){
                prev1 = i ? this.children[i - 1] : null;
                if (!prev1 || prev1.dom.parentNode == this.contentDOM) break;
            }
            if (prev1 && side && enter && !prev1.border && !prev1.domAtom) return prev1.domFromPos(prev1.size, side);
            return {
                node: this.contentDOM,
                offset: prev1 ? $4fda26bcd679fbcb$var$domIndex(prev1.dom) + 1 : 0
            };
        } else {
            let next, enter1 = true;
            for(;; i++, enter1 = false){
                next = i < this.children.length ? this.children[i] : null;
                if (!next || next.dom.parentNode == this.contentDOM) break;
            }
            if (next && enter1 && !next.border && !next.domAtom) return next.domFromPos(0, side);
            return {
                node: this.contentDOM,
                offset: next ? $4fda26bcd679fbcb$var$domIndex(next.dom) : this.contentDOM.childNodes.length
            };
        }
    }
    // Used to find a DOM range in a single parent for a given changed
    // range.
    parseRange(from, to, base = 0) {
        if (this.children.length == 0) return {
            node: this.contentDOM,
            from: from,
            to: to,
            fromOffset: 0,
            toOffset: this.contentDOM.childNodes.length
        };
        let fromOffset = -1, toOffset = -1;
        for(let offset = base, i = 0;; i++){
            let child = this.children[i], end = offset + child.size;
            if (fromOffset == -1 && from <= end) {
                let childBase = offset + child.border;
                // FIXME maybe descend mark views to parse a narrower range?
                if (from >= childBase && to <= end - child.border && child.node && child.contentDOM && this.contentDOM.contains(child.contentDOM)) return child.parseRange(from, to, childBase);
                from = offset;
                for(let j = i; j > 0; j--){
                    let prev = this.children[j - 1];
                    if (prev.size && prev.dom.parentNode == this.contentDOM && !prev.emptyChildAt(1)) {
                        fromOffset = $4fda26bcd679fbcb$var$domIndex(prev.dom) + 1;
                        break;
                    }
                    from -= prev.size;
                }
                if (fromOffset == -1) fromOffset = 0;
            }
            if (fromOffset > -1 && (end > to || i == this.children.length - 1)) {
                to = end;
                for(let j1 = i + 1; j1 < this.children.length; j1++){
                    let next = this.children[j1];
                    if (next.size && next.dom.parentNode == this.contentDOM && !next.emptyChildAt(-1)) {
                        toOffset = $4fda26bcd679fbcb$var$domIndex(next.dom);
                        break;
                    }
                    to += next.size;
                }
                if (toOffset == -1) toOffset = this.contentDOM.childNodes.length;
                break;
            }
            offset = end;
        }
        return {
            node: this.contentDOM,
            from: from,
            to: to,
            fromOffset: fromOffset,
            toOffset: toOffset
        };
    }
    emptyChildAt(side) {
        if (this.border || !this.contentDOM || !this.children.length) return false;
        let child = this.children[side < 0 ? 0 : this.children.length - 1];
        return child.size == 0 || child.emptyChildAt(side);
    }
    domAfterPos(pos) {
        let { node: node , offset: offset  } = this.domFromPos(pos, 0);
        if (node.nodeType != 1 || offset == node.childNodes.length) throw new RangeError("No node after pos " + pos);
        return node.childNodes[offset];
    }
    // View descs are responsible for setting any selection that falls
    // entirely inside of them, so that custom implementations can do
    // custom things with the selection. Note that this falls apart when
    // a selection starts in such a node and ends in another, in which
    // case we just use whatever domFromPos produces as a best effort.
    setSelection(anchor, head, root, force = false) {
        // If the selection falls entirely in a child, give it to that child
        let from = Math.min(anchor, head), to = Math.max(anchor, head);
        for(let i = 0, offset = 0; i < this.children.length; i++){
            let child = this.children[i], end = offset + child.size;
            if (from > offset && to < end) return child.setSelection(anchor - offset - child.border, head - offset - child.border, root, force);
            offset = end;
        }
        let anchorDOM = this.domFromPos(anchor, anchor ? -1 : 1);
        let headDOM = head == anchor ? anchorDOM : this.domFromPos(head, head ? -1 : 1);
        let domSel = root.getSelection();
        let brKludge = false;
        // On Firefox, using Selection.collapse to put the cursor after a
        // BR node for some reason doesn't always work (#1073). On Safari,
        // the cursor sometimes inexplicable visually lags behind its
        // reported position in such situations (#1092).
        if (($4fda26bcd679fbcb$var$gecko || $4fda26bcd679fbcb$var$safari) && anchor == head) {
            let { node: node , offset: offset1  } = anchorDOM;
            if (node.nodeType == 3) {
                brKludge = !!(offset1 && node.nodeValue[offset1 - 1] == "\n");
                // Issue #1128
                if (brKludge && offset1 == node.nodeValue.length) for(let scan = node, after; scan; scan = scan.parentNode){
                    if (after = scan.nextSibling) {
                        if (after.nodeName == "BR") anchorDOM = headDOM = {
                            node: after.parentNode,
                            offset: $4fda26bcd679fbcb$var$domIndex(after) + 1
                        };
                        break;
                    }
                    let desc = scan.pmViewDesc;
                    if (desc && desc.node && desc.node.isBlock) break;
                }
            } else {
                let prev = node.childNodes[offset1 - 1];
                brKludge = prev && (prev.nodeName == "BR" || prev.contentEditable == "false");
            }
        }
        // Firefox can act strangely when the selection is in front of an
        // uneditable node. See #1163 and https://bugzilla.mozilla.org/show_bug.cgi?id=1709536
        if ($4fda26bcd679fbcb$var$gecko && domSel.focusNode && domSel.focusNode != headDOM.node && domSel.focusNode.nodeType == 1) {
            let after1 = domSel.focusNode.childNodes[domSel.focusOffset];
            if (after1 && after1.contentEditable == "false") force = true;
        }
        if (!(force || brKludge && $4fda26bcd679fbcb$var$safari) && $4fda26bcd679fbcb$var$isEquivalentPosition(anchorDOM.node, anchorDOM.offset, domSel.anchorNode, domSel.anchorOffset) && $4fda26bcd679fbcb$var$isEquivalentPosition(headDOM.node, headDOM.offset, domSel.focusNode, domSel.focusOffset)) return;
        // Selection.extend can be used to create an 'inverted' selection
        // (one where the focus is before the anchor), but not all
        // browsers support it yet.
        let domSelExtended = false;
        if ((domSel.extend || anchor == head) && !brKludge) {
            domSel.collapse(anchorDOM.node, anchorDOM.offset);
            try {
                if (anchor != head) domSel.extend(headDOM.node, headDOM.offset);
                domSelExtended = true;
            } catch (_) {
            // In some cases with Chrome the selection is empty after calling
            // collapse, even when it should be valid. This appears to be a bug, but
            // it is difficult to isolate. If this happens fallback to the old path
            // without using extend.
            // Similarly, this could crash on Safari if the editor is hidden, and
            // there was no selection.
            }
        }
        if (!domSelExtended) {
            if (anchor > head) {
                let tmp = anchorDOM;
                anchorDOM = headDOM;
                headDOM = tmp;
            }
            let range = document.createRange();
            range.setEnd(headDOM.node, headDOM.offset);
            range.setStart(anchorDOM.node, anchorDOM.offset);
            domSel.removeAllRanges();
            domSel.addRange(range);
        }
    }
    ignoreMutation(mutation) {
        return !this.contentDOM && mutation.type != "selection";
    }
    get contentLost() {
        return this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM);
    }
    // Remove a subtree of the element tree that has been touched
    // by a DOM change, so that the next update will redraw it.
    markDirty(from, to) {
        for(let offset = 0, i = 0; i < this.children.length; i++){
            let child = this.children[i], end = offset + child.size;
            if (offset == end ? from <= end && to >= offset : from < end && to > offset) {
                let startInside = offset + child.border, endInside = end - child.border;
                if (from >= startInside && to <= endInside) {
                    this.dirty = from == offset || to == end ? $4fda26bcd679fbcb$var$CONTENT_DIRTY : $4fda26bcd679fbcb$var$CHILD_DIRTY;
                    if (from == startInside && to == endInside && (child.contentLost || child.dom.parentNode != this.contentDOM)) child.dirty = $4fda26bcd679fbcb$var$NODE_DIRTY;
                    else child.markDirty(from - startInside, to - startInside);
                    return;
                } else child.dirty = child.dom == child.contentDOM && child.dom.parentNode == this.contentDOM && !child.children.length ? $4fda26bcd679fbcb$var$CONTENT_DIRTY : $4fda26bcd679fbcb$var$NODE_DIRTY;
            }
            offset = end;
        }
        this.dirty = $4fda26bcd679fbcb$var$CONTENT_DIRTY;
    }
    markParentsDirty() {
        let level = 1;
        for(let node = this.parent; node; node = node.parent, level++){
            let dirty = level == 1 ? $4fda26bcd679fbcb$var$CONTENT_DIRTY : $4fda26bcd679fbcb$var$CHILD_DIRTY;
            if (node.dirty < dirty) node.dirty = dirty;
        }
    }
    get domAtom() {
        return false;
    }
    get ignoreForCoords() {
        return false;
    }
}
// A widget desc represents a widget decoration, which is a DOM node
// drawn between the document nodes.
class $4fda26bcd679fbcb$var$WidgetViewDesc extends $4fda26bcd679fbcb$var$ViewDesc {
    constructor(parent, widget, view, pos){
        let self, dom = widget.type.toDOM;
        if (typeof dom == "function") dom = dom(view, ()=>{
            if (!self) return pos;
            if (self.parent) return self.parent.posBeforeChild(self);
        });
        if (!widget.type.spec.raw) {
            if (dom.nodeType != 1) {
                let wrap = document.createElement("span");
                wrap.appendChild(dom);
                dom = wrap;
            }
            dom.contentEditable = "false";
            dom.classList.add("ProseMirror-widget");
        }
        super(parent, [], dom, null);
        this.widget = widget;
        this.widget = widget;
        self = this;
    }
    matchesWidget(widget) {
        return this.dirty == $4fda26bcd679fbcb$var$NOT_DIRTY && widget.type.eq(this.widget.type);
    }
    parseRule() {
        return {
            ignore: true
        };
    }
    stopEvent(event) {
        let stop = this.widget.spec.stopEvent;
        return stop ? stop(event) : false;
    }
    ignoreMutation(mutation) {
        return mutation.type != "selection" || this.widget.spec.ignoreSelection;
    }
    destroy() {
        this.widget.type.destroy(this.dom);
        super.destroy();
    }
    get domAtom() {
        return true;
    }
    get side() {
        return this.widget.type.side;
    }
}
class $4fda26bcd679fbcb$var$CompositionViewDesc extends $4fda26bcd679fbcb$var$ViewDesc {
    constructor(parent, dom, textDOM, text){
        super(parent, [], dom, null);
        this.textDOM = textDOM;
        this.text = text;
    }
    get size() {
        return this.text.length;
    }
    localPosFromDOM(dom, offset) {
        if (dom != this.textDOM) return this.posAtStart + (offset ? this.size : 0);
        return this.posAtStart + offset;
    }
    domFromPos(pos) {
        return {
            node: this.textDOM,
            offset: pos
        };
    }
    ignoreMutation(mut) {
        return mut.type === "characterData" && mut.target.nodeValue == mut.oldValue;
    }
}
// A mark desc represents a mark. May have multiple children,
// depending on how the mark is split. Note that marks are drawn using
// a fixed nesting order, for simplicity and predictability, so in
// some cases they will be split more often than would appear
// necessary.
class $4fda26bcd679fbcb$var$MarkViewDesc extends $4fda26bcd679fbcb$var$ViewDesc {
    constructor(parent, mark, dom, contentDOM){
        super(parent, [], dom, contentDOM);
        this.mark = mark;
    }
    static create(parent, mark, inline, view) {
        let custom = view.nodeViews[mark.type.name];
        let spec = custom && custom(mark, view, inline);
        if (!spec || !spec.dom) spec = (0, $c8d507d90382f091$export$3476b78f8f5a8b72).renderSpec(document, mark.type.spec.toDOM(mark, inline));
        return new $4fda26bcd679fbcb$var$MarkViewDesc(parent, mark, spec.dom, spec.contentDOM || spec.dom);
    }
    parseRule() {
        if (this.dirty & $4fda26bcd679fbcb$var$NODE_DIRTY || this.mark.type.spec.reparseInView) return null;
        return {
            mark: this.mark.type.name,
            attrs: this.mark.attrs,
            contentElement: this.contentDOM || undefined
        };
    }
    matchesMark(mark) {
        return this.dirty != $4fda26bcd679fbcb$var$NODE_DIRTY && this.mark.eq(mark);
    }
    markDirty(from, to) {
        super.markDirty(from, to);
        // Move dirty info to nearest node view
        if (this.dirty != $4fda26bcd679fbcb$var$NOT_DIRTY) {
            let parent = this.parent;
            while(!parent.node)parent = parent.parent;
            if (parent.dirty < this.dirty) parent.dirty = this.dirty;
            this.dirty = $4fda26bcd679fbcb$var$NOT_DIRTY;
        }
    }
    slice(from, to, view) {
        let copy = $4fda26bcd679fbcb$var$MarkViewDesc.create(this.parent, this.mark, true, view);
        let nodes = this.children, size = this.size;
        if (to < size) nodes = $4fda26bcd679fbcb$var$replaceNodes(nodes, to, size, view);
        if (from > 0) nodes = $4fda26bcd679fbcb$var$replaceNodes(nodes, 0, from, view);
        for(let i = 0; i < nodes.length; i++)nodes[i].parent = copy;
        copy.children = nodes;
        return copy;
    }
}
// Node view descs are the main, most common type of view desc, and
// correspond to an actual node in the document. Unlike mark descs,
// they populate their child array themselves.
class $4fda26bcd679fbcb$var$NodeViewDesc extends $4fda26bcd679fbcb$var$ViewDesc {
    constructor(parent, node, outerDeco, innerDeco, dom, contentDOM, nodeDOM, view, pos){
        super(parent, [], dom, contentDOM);
        this.node = node;
        this.outerDeco = outerDeco;
        this.innerDeco = innerDeco;
        this.nodeDOM = nodeDOM;
        if (contentDOM) this.updateChildren(view, pos);
    }
    // By default, a node is rendered using the `toDOM` method from the
    // node type spec. But client code can use the `nodeViews` spec to
    // supply a custom node view, which can influence various aspects of
    // the way the node works.
    //
    // (Using subclassing for this was intentionally decided against,
    // since it'd require exposing a whole slew of finicky
    // implementation details to the user code that they probably will
    // never need.)
    static create(parent, node, outerDeco, innerDeco, view, pos) {
        let custom = view.nodeViews[node.type.name], descObj;
        let spec = custom && custom(node, view, ()=>{
            // (This is a function that allows the custom view to find its
            // own position)
            if (!descObj) return pos;
            if (descObj.parent) return descObj.parent.posBeforeChild(descObj);
        }, outerDeco, innerDeco);
        let dom = spec && spec.dom, contentDOM = spec && spec.contentDOM;
        if (node.isText) {
            if (!dom) dom = document.createTextNode(node.text);
            else if (dom.nodeType != 3) throw new RangeError("Text must be rendered as a DOM text node");
        } else if (!dom) ({ dom: dom , contentDOM: contentDOM  } = (0, $c8d507d90382f091$export$3476b78f8f5a8b72).renderSpec(document, node.type.spec.toDOM(node)));
        if (!contentDOM && !node.isText && dom.nodeName != "BR") {
            if (!dom.hasAttribute("contenteditable")) dom.contentEditable = "false";
            if (node.type.spec.draggable) dom.draggable = true;
        }
        let nodeDOM = dom;
        dom = $4fda26bcd679fbcb$var$applyOuterDeco(dom, outerDeco, node);
        if (spec) return descObj = new $4fda26bcd679fbcb$var$CustomNodeViewDesc(parent, node, outerDeco, innerDeco, dom, contentDOM || null, nodeDOM, spec, view, pos + 1);
        else if (node.isText) return new $4fda26bcd679fbcb$var$TextViewDesc(parent, node, outerDeco, innerDeco, dom, nodeDOM, view);
        else return new $4fda26bcd679fbcb$var$NodeViewDesc(parent, node, outerDeco, innerDeco, dom, contentDOM || null, nodeDOM, view, pos + 1);
    }
    parseRule() {
        // Experimental kludge to allow opt-in re-parsing of nodes
        if (this.node.type.spec.reparseInView) return null;
        // FIXME the assumption that this can always return the current
        // attrs means that if the user somehow manages to change the
        // attrs in the dom, that won't be picked up. Not entirely sure
        // whether this is a problem
        let rule = {
            node: this.node.type.name,
            attrs: this.node.attrs
        };
        if (this.node.type.whitespace == "pre") rule.preserveWhitespace = "full";
        if (!this.contentDOM) rule.getContent = ()=>this.node.content;
        else if (!this.contentLost) rule.contentElement = this.contentDOM;
        else {
            // Chrome likes to randomly recreate parent nodes when
            // backspacing things. When that happens, this tries to find the
            // new parent.
            for(let i = this.children.length - 1; i >= 0; i--){
                let child = this.children[i];
                if (this.dom.contains(child.dom.parentNode)) {
                    rule.contentElement = child.dom.parentNode;
                    break;
                }
            }
            if (!rule.contentElement) rule.getContent = ()=>(0, $c8d507d90382f091$export$ffb0004e005737fa).empty;
        }
        return rule;
    }
    matchesNode(node, outerDeco, innerDeco) {
        return this.dirty == $4fda26bcd679fbcb$var$NOT_DIRTY && node.eq(this.node) && $4fda26bcd679fbcb$var$sameOuterDeco(outerDeco, this.outerDeco) && innerDeco.eq(this.innerDeco);
    }
    get size() {
        return this.node.nodeSize;
    }
    get border() {
        return this.node.isLeaf ? 0 : 1;
    }
    // Syncs `this.children` to match `this.node.content` and the local
    // decorations, possibly introducing nesting for marks. Then, in a
    // separate step, syncs the DOM inside `this.contentDOM` to
    // `this.children`.
    updateChildren(view, pos) {
        let inline = this.node.inlineContent, off = pos;
        let composition = view.composing ? this.localCompositionInfo(view, pos) : null;
        let localComposition = composition && composition.pos > -1 ? composition : null;
        let compositionInChild = composition && composition.pos < 0;
        let updater = new $4fda26bcd679fbcb$var$ViewTreeUpdater(this, localComposition && localComposition.node, view);
        $4fda26bcd679fbcb$var$iterDeco(this.node, this.innerDeco, (widget, i, insideNode)=>{
            if (widget.spec.marks) updater.syncToMarks(widget.spec.marks, inline, view);
            else if (widget.type.side >= 0 && !insideNode) updater.syncToMarks(i == this.node.childCount ? (0, $c8d507d90382f091$export$c9d15bcfc6d42044).none : this.node.child(i).marks, inline, view);
            // If the next node is a desc matching this widget, reuse it,
            // otherwise insert the widget as a new view desc.
            updater.placeWidget(widget, view, off);
        }, (child, outerDeco, innerDeco, i)=>{
            // Make sure the wrapping mark descs match the node's marks.
            updater.syncToMarks(child.marks, inline, view);
            // Try several strategies for drawing this node
            let compIndex;
            if (updater.findNodeMatch(child, outerDeco, innerDeco, i)) ;
            else if (compositionInChild && view.state.selection.from > off && view.state.selection.to < off + child.nodeSize && (compIndex = updater.findIndexWithChild(composition.node)) > -1 && updater.updateNodeAt(child, outerDeco, innerDeco, compIndex, view)) ;
            else if (updater.updateNextNode(child, outerDeco, innerDeco, view, i)) ;
            else // Add it as a new view
            updater.addNode(child, outerDeco, innerDeco, view, off);
            off += child.nodeSize;
        });
        // Drop all remaining descs after the current position.
        updater.syncToMarks([], inline, view);
        if (this.node.isTextblock) updater.addTextblockHacks();
        updater.destroyRest();
        // Sync the DOM if anything changed
        if (updater.changed || this.dirty == $4fda26bcd679fbcb$var$CONTENT_DIRTY) {
            // May have to protect focused DOM from being changed if a composition is active
            if (localComposition) this.protectLocalComposition(view, localComposition);
            $4fda26bcd679fbcb$var$renderDescs(this.contentDOM, this.children, view);
            if ($4fda26bcd679fbcb$var$ios) $4fda26bcd679fbcb$var$iosHacks(this.dom);
        }
    }
    localCompositionInfo(view, pos) {
        // Only do something if both the selection and a focused text node
        // are inside of this node
        let { from: from , to: to  } = view.state.selection;
        if (!(view.state.selection instanceof (0, $ee27db283572d394$export$c2b25f346d19bcbb)) || from < pos || to > pos + this.node.content.size) return null;
        let sel = view.domSelectionRange();
        let textNode = $4fda26bcd679fbcb$var$nearbyTextNode(sel.focusNode, sel.focusOffset);
        if (!textNode || !this.dom.contains(textNode.parentNode)) return null;
        if (this.node.inlineContent) {
            // Find the text in the focused node in the node, stop if it's not
            // there (may have been modified through other means, in which
            // case it should overwritten)
            let text = textNode.nodeValue;
            let textPos = $4fda26bcd679fbcb$var$findTextInFragment(this.node.content, text, from - pos, to - pos);
            return textPos < 0 ? null : {
                node: textNode,
                pos: textPos,
                text: text
            };
        } else return {
            node: textNode,
            pos: -1,
            text: ""
        };
    }
    protectLocalComposition(view, { node: node , pos: pos , text: text  }) {
        // The node is already part of a local view desc, leave it there
        if (this.getDesc(node)) return;
        // Create a composition view for the orphaned nodes
        let topNode = node;
        for(;; topNode = topNode.parentNode){
            if (topNode.parentNode == this.contentDOM) break;
            while(topNode.previousSibling)topNode.parentNode.removeChild(topNode.previousSibling);
            while(topNode.nextSibling)topNode.parentNode.removeChild(topNode.nextSibling);
            if (topNode.pmViewDesc) topNode.pmViewDesc = undefined;
        }
        let desc = new $4fda26bcd679fbcb$var$CompositionViewDesc(this, topNode, node, text);
        view.input.compositionNodes.push(desc);
        // Patch up this.children to contain the composition view
        this.children = $4fda26bcd679fbcb$var$replaceNodes(this.children, pos, pos + text.length, view, desc);
    }
    // If this desc must be updated to match the given node decoration,
    // do so and return true.
    update(node, outerDeco, innerDeco, view) {
        if (this.dirty == $4fda26bcd679fbcb$var$NODE_DIRTY || !node.sameMarkup(this.node)) return false;
        this.updateInner(node, outerDeco, innerDeco, view);
        return true;
    }
    updateInner(node, outerDeco, innerDeco, view) {
        this.updateOuterDeco(outerDeco);
        this.node = node;
        this.innerDeco = innerDeco;
        if (this.contentDOM) this.updateChildren(view, this.posAtStart);
        this.dirty = $4fda26bcd679fbcb$var$NOT_DIRTY;
    }
    updateOuterDeco(outerDeco) {
        if ($4fda26bcd679fbcb$var$sameOuterDeco(outerDeco, this.outerDeco)) return;
        let needsWrap = this.nodeDOM.nodeType != 1;
        let oldDOM = this.dom;
        this.dom = $4fda26bcd679fbcb$var$patchOuterDeco(this.dom, this.nodeDOM, $4fda26bcd679fbcb$var$computeOuterDeco(this.outerDeco, this.node, needsWrap), $4fda26bcd679fbcb$var$computeOuterDeco(outerDeco, this.node, needsWrap));
        if (this.dom != oldDOM) {
            oldDOM.pmViewDesc = undefined;
            this.dom.pmViewDesc = this;
        }
        this.outerDeco = outerDeco;
    }
    // Mark this node as being the selected node.
    selectNode() {
        if (this.nodeDOM.nodeType == 1) this.nodeDOM.classList.add("ProseMirror-selectednode");
        if (this.contentDOM || !this.node.type.spec.draggable) this.dom.draggable = true;
    }
    // Remove selected node marking from this node.
    deselectNode() {
        if (this.nodeDOM.nodeType == 1) this.nodeDOM.classList.remove("ProseMirror-selectednode");
        if (this.contentDOM || !this.node.type.spec.draggable) this.dom.removeAttribute("draggable");
    }
    get domAtom() {
        return this.node.isAtom;
    }
}
// Create a view desc for the top-level document node, to be exported
// and used by the view class.
function $4fda26bcd679fbcb$var$docViewDesc(doc, outerDeco, innerDeco, dom, view) {
    $4fda26bcd679fbcb$var$applyOuterDeco(dom, outerDeco, doc);
    return new $4fda26bcd679fbcb$var$NodeViewDesc(undefined, doc, outerDeco, innerDeco, dom, dom, dom, view, 0);
}
class $4fda26bcd679fbcb$var$TextViewDesc extends $4fda26bcd679fbcb$var$NodeViewDesc {
    constructor(parent, node, outerDeco, innerDeco, dom, nodeDOM, view){
        super(parent, node, outerDeco, innerDeco, dom, null, nodeDOM, view, 0);
    }
    parseRule() {
        let skip = this.nodeDOM.parentNode;
        while(skip && skip != this.dom && !skip.pmIsDeco)skip = skip.parentNode;
        return {
            skip: skip || true
        };
    }
    update(node, outerDeco, innerDeco, view) {
        if (this.dirty == $4fda26bcd679fbcb$var$NODE_DIRTY || this.dirty != $4fda26bcd679fbcb$var$NOT_DIRTY && !this.inParent() || !node.sameMarkup(this.node)) return false;
        this.updateOuterDeco(outerDeco);
        if ((this.dirty != $4fda26bcd679fbcb$var$NOT_DIRTY || node.text != this.node.text) && node.text != this.nodeDOM.nodeValue) {
            this.nodeDOM.nodeValue = node.text;
            if (view.trackWrites == this.nodeDOM) view.trackWrites = null;
        }
        this.node = node;
        this.dirty = $4fda26bcd679fbcb$var$NOT_DIRTY;
        return true;
    }
    inParent() {
        let parentDOM = this.parent.contentDOM;
        for(let n = this.nodeDOM; n; n = n.parentNode)if (n == parentDOM) return true;
        return false;
    }
    domFromPos(pos) {
        return {
            node: this.nodeDOM,
            offset: pos
        };
    }
    localPosFromDOM(dom, offset, bias) {
        if (dom == this.nodeDOM) return this.posAtStart + Math.min(offset, this.node.text.length);
        return super.localPosFromDOM(dom, offset, bias);
    }
    ignoreMutation(mutation) {
        return mutation.type != "characterData" && mutation.type != "selection";
    }
    slice(from, to, view) {
        let node = this.node.cut(from, to), dom = document.createTextNode(node.text);
        return new $4fda26bcd679fbcb$var$TextViewDesc(this.parent, node, this.outerDeco, this.innerDeco, dom, dom, view);
    }
    markDirty(from, to) {
        super.markDirty(from, to);
        if (this.dom != this.nodeDOM && (from == 0 || to == this.nodeDOM.nodeValue.length)) this.dirty = $4fda26bcd679fbcb$var$NODE_DIRTY;
    }
    get domAtom() {
        return false;
    }
}
// A dummy desc used to tag trailing BR or IMG nodes created to work
// around contentEditable terribleness.
class $4fda26bcd679fbcb$var$TrailingHackViewDesc extends $4fda26bcd679fbcb$var$ViewDesc {
    parseRule() {
        return {
            ignore: true
        };
    }
    matchesHack(nodeName) {
        return this.dirty == $4fda26bcd679fbcb$var$NOT_DIRTY && this.dom.nodeName == nodeName;
    }
    get domAtom() {
        return true;
    }
    get ignoreForCoords() {
        return this.dom.nodeName == "IMG";
    }
}
// A separate subclass is used for customized node views, so that the
// extra checks only have to be made for nodes that are actually
// customized.
class $4fda26bcd679fbcb$var$CustomNodeViewDesc extends $4fda26bcd679fbcb$var$NodeViewDesc {
    constructor(parent, node, outerDeco, innerDeco, dom, contentDOM, nodeDOM, spec, view, pos){
        super(parent, node, outerDeco, innerDeco, dom, contentDOM, nodeDOM, view, pos);
        this.spec = spec;
    }
    // A custom `update` method gets to decide whether the update goes
    // through. If it does, and there's a `contentDOM` node, our logic
    // updates the children.
    update(node, outerDeco, innerDeco, view) {
        if (this.dirty == $4fda26bcd679fbcb$var$NODE_DIRTY) return false;
        if (this.spec.update) {
            let result = this.spec.update(node, outerDeco, innerDeco);
            if (result) this.updateInner(node, outerDeco, innerDeco, view);
            return result;
        } else if (!this.contentDOM && !node.isLeaf) return false;
        else return super.update(node, outerDeco, innerDeco, view);
    }
    selectNode() {
        this.spec.selectNode ? this.spec.selectNode() : super.selectNode();
    }
    deselectNode() {
        this.spec.deselectNode ? this.spec.deselectNode() : super.deselectNode();
    }
    setSelection(anchor, head, root, force) {
        this.spec.setSelection ? this.spec.setSelection(anchor, head, root) : super.setSelection(anchor, head, root, force);
    }
    destroy() {
        if (this.spec.destroy) this.spec.destroy();
        super.destroy();
    }
    stopEvent(event) {
        return this.spec.stopEvent ? this.spec.stopEvent(event) : false;
    }
    ignoreMutation(mutation) {
        return this.spec.ignoreMutation ? this.spec.ignoreMutation(mutation) : super.ignoreMutation(mutation);
    }
}
// Sync the content of the given DOM node with the nodes associated
// with the given array of view descs, recursing into mark descs
// because this should sync the subtree for a whole node at a time.
function $4fda26bcd679fbcb$var$renderDescs(parentDOM, descs, view) {
    let dom = parentDOM.firstChild, written = false;
    for(let i = 0; i < descs.length; i++){
        let desc = descs[i], childDOM = desc.dom;
        if (childDOM.parentNode == parentDOM) {
            while(childDOM != dom){
                dom = $4fda26bcd679fbcb$var$rm(dom);
                written = true;
            }
            dom = dom.nextSibling;
        } else {
            written = true;
            parentDOM.insertBefore(childDOM, dom);
        }
        if (desc instanceof $4fda26bcd679fbcb$var$MarkViewDesc) {
            let pos = dom ? dom.previousSibling : parentDOM.lastChild;
            $4fda26bcd679fbcb$var$renderDescs(desc.contentDOM, desc.children, view);
            dom = pos ? pos.nextSibling : parentDOM.firstChild;
        }
    }
    while(dom){
        dom = $4fda26bcd679fbcb$var$rm(dom);
        written = true;
    }
    if (written && view.trackWrites == parentDOM) view.trackWrites = null;
}
const $4fda26bcd679fbcb$var$OuterDecoLevel = function(nodeName) {
    if (nodeName) this.nodeName = nodeName;
};
$4fda26bcd679fbcb$var$OuterDecoLevel.prototype = Object.create(null);
const $4fda26bcd679fbcb$var$noDeco = [
    new $4fda26bcd679fbcb$var$OuterDecoLevel
];
function $4fda26bcd679fbcb$var$computeOuterDeco(outerDeco, node, needsWrap) {
    if (outerDeco.length == 0) return $4fda26bcd679fbcb$var$noDeco;
    let top = needsWrap ? $4fda26bcd679fbcb$var$noDeco[0] : new $4fda26bcd679fbcb$var$OuterDecoLevel, result = [
        top
    ];
    for(let i = 0; i < outerDeco.length; i++){
        let attrs = outerDeco[i].type.attrs;
        if (!attrs) continue;
        if (attrs.nodeName) result.push(top = new $4fda26bcd679fbcb$var$OuterDecoLevel(attrs.nodeName));
        for(let name in attrs){
            let val = attrs[name];
            if (val == null) continue;
            if (needsWrap && result.length == 1) result.push(top = new $4fda26bcd679fbcb$var$OuterDecoLevel(node.isInline ? "span" : "div"));
            if (name == "class") top.class = (top.class ? top.class + " " : "") + val;
            else if (name == "style") top.style = (top.style ? top.style + ";" : "") + val;
            else if (name != "nodeName") top[name] = val;
        }
    }
    return result;
}
function $4fda26bcd679fbcb$var$patchOuterDeco(outerDOM, nodeDOM, prevComputed, curComputed) {
    // Shortcut for trivial case
    if (prevComputed == $4fda26bcd679fbcb$var$noDeco && curComputed == $4fda26bcd679fbcb$var$noDeco) return nodeDOM;
    let curDOM = nodeDOM;
    for(let i = 0; i < curComputed.length; i++){
        let deco = curComputed[i], prev = prevComputed[i];
        if (i) {
            let parent;
            if (prev && prev.nodeName == deco.nodeName && curDOM != outerDOM && (parent = curDOM.parentNode) && parent.nodeName.toLowerCase() == deco.nodeName) curDOM = parent;
            else {
                parent = document.createElement(deco.nodeName);
                parent.pmIsDeco = true;
                parent.appendChild(curDOM);
                prev = $4fda26bcd679fbcb$var$noDeco[0];
                curDOM = parent;
            }
        }
        $4fda26bcd679fbcb$var$patchAttributes(curDOM, prev || $4fda26bcd679fbcb$var$noDeco[0], deco);
    }
    return curDOM;
}
function $4fda26bcd679fbcb$var$patchAttributes(dom, prev, cur) {
    for(let name in prev)if (name != "class" && name != "style" && name != "nodeName" && !(name in cur)) dom.removeAttribute(name);
    for(let name1 in cur)if (name1 != "class" && name1 != "style" && name1 != "nodeName" && cur[name1] != prev[name1]) dom.setAttribute(name1, cur[name1]);
    if (prev.class != cur.class) {
        let prevList = prev.class ? prev.class.split(" ").filter(Boolean) : [];
        let curList = cur.class ? cur.class.split(" ").filter(Boolean) : [];
        for(let i = 0; i < prevList.length; i++)if (curList.indexOf(prevList[i]) == -1) dom.classList.remove(prevList[i]);
        for(let i1 = 0; i1 < curList.length; i1++)if (prevList.indexOf(curList[i1]) == -1) dom.classList.add(curList[i1]);
        if (dom.classList.length == 0) dom.removeAttribute("class");
    }
    if (prev.style != cur.style) {
        if (prev.style) {
            let prop = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, m;
            while(m = prop.exec(prev.style))dom.style.removeProperty(m[1]);
        }
        if (cur.style) dom.style.cssText += cur.style;
    }
}
function $4fda26bcd679fbcb$var$applyOuterDeco(dom, deco, node) {
    return $4fda26bcd679fbcb$var$patchOuterDeco(dom, dom, $4fda26bcd679fbcb$var$noDeco, $4fda26bcd679fbcb$var$computeOuterDeco(deco, node, dom.nodeType != 1));
}
function $4fda26bcd679fbcb$var$sameOuterDeco(a, b) {
    if (a.length != b.length) return false;
    for(let i = 0; i < a.length; i++)if (!a[i].type.eq(b[i].type)) return false;
    return true;
}
// Remove a DOM node and return its next sibling.
function $4fda26bcd679fbcb$var$rm(dom) {
    let next = dom.nextSibling;
    dom.parentNode.removeChild(dom);
    return next;
}
// Helper class for incrementally updating a tree of mark descs and
// the widget and node descs inside of them.
class $4fda26bcd679fbcb$var$ViewTreeUpdater {
    constructor(top, lock, view){
        this.lock = lock;
        this.view = view;
        // Index into `this.top`'s child array, represents the current
        // update position.
        this.index = 0;
        // When entering a mark, the current top and index are pushed
        // onto this.
        this.stack = [];
        // Tracks whether anything was changed
        this.changed = false;
        this.top = top;
        this.preMatch = $4fda26bcd679fbcb$var$preMatch(top.node.content, top);
    }
    // Destroy and remove the children between the given indices in
    // `this.top`.
    destroyBetween(start, end) {
        if (start == end) return;
        for(let i = start; i < end; i++)this.top.children[i].destroy();
        this.top.children.splice(start, end - start);
        this.changed = true;
    }
    // Destroy all remaining children in `this.top`.
    destroyRest() {
        this.destroyBetween(this.index, this.top.children.length);
    }
    // Sync the current stack of mark descs with the given array of
    // marks, reusing existing mark descs when possible.
    syncToMarks(marks, inline, view) {
        let keep = 0, depth = this.stack.length >> 1;
        let maxKeep = Math.min(depth, marks.length);
        while(keep < maxKeep && (keep == depth - 1 ? this.top : this.stack[keep + 1 << 1]).matchesMark(marks[keep]) && marks[keep].type.spec.spanning !== false)keep++;
        while(keep < depth){
            this.destroyRest();
            this.top.dirty = $4fda26bcd679fbcb$var$NOT_DIRTY;
            this.index = this.stack.pop();
            this.top = this.stack.pop();
            depth--;
        }
        while(depth < marks.length){
            this.stack.push(this.top, this.index + 1);
            let found = -1;
            for(let i = this.index; i < Math.min(this.index + 3, this.top.children.length); i++)if (this.top.children[i].matchesMark(marks[depth])) {
                found = i;
                break;
            }
            if (found > -1) {
                if (found > this.index) {
                    this.changed = true;
                    this.destroyBetween(this.index, found);
                }
                this.top = this.top.children[this.index];
            } else {
                let markDesc = $4fda26bcd679fbcb$var$MarkViewDesc.create(this.top, marks[depth], inline, view);
                this.top.children.splice(this.index, 0, markDesc);
                this.top = markDesc;
                this.changed = true;
            }
            this.index = 0;
            depth++;
        }
    }
    // Try to find a node desc matching the given data. Skip over it and
    // return true when successful.
    findNodeMatch(node, outerDeco, innerDeco, index) {
        let found = -1, targetDesc;
        if (index >= this.preMatch.index && (targetDesc = this.preMatch.matches[index - this.preMatch.index]).parent == this.top && targetDesc.matchesNode(node, outerDeco, innerDeco)) found = this.top.children.indexOf(targetDesc, this.index);
        else for(let i = this.index, e = Math.min(this.top.children.length, i + 5); i < e; i++){
            let child = this.top.children[i];
            if (child.matchesNode(node, outerDeco, innerDeco) && !this.preMatch.matched.has(child)) {
                found = i;
                break;
            }
        }
        if (found < 0) return false;
        this.destroyBetween(this.index, found);
        this.index++;
        return true;
    }
    updateNodeAt(node, outerDeco, innerDeco, index, view) {
        let child = this.top.children[index];
        if (child.dirty == $4fda26bcd679fbcb$var$NODE_DIRTY && child.dom == child.contentDOM) child.dirty = $4fda26bcd679fbcb$var$CONTENT_DIRTY;
        if (!child.update(node, outerDeco, innerDeco, view)) return false;
        this.destroyBetween(this.index, index);
        this.index++;
        return true;
    }
    findIndexWithChild(domNode) {
        for(;;){
            let parent = domNode.parentNode;
            if (!parent) return -1;
            if (parent == this.top.contentDOM) {
                let desc = domNode.pmViewDesc;
                if (desc) for(let i = this.index; i < this.top.children.length; i++){
                    if (this.top.children[i] == desc) return i;
                }
                return -1;
            }
            domNode = parent;
        }
    }
    // Try to update the next node, if any, to the given data. Checks
    // pre-matches to avoid overwriting nodes that could still be used.
    updateNextNode(node, outerDeco, innerDeco, view, index) {
        for(let i = this.index; i < this.top.children.length; i++){
            let next = this.top.children[i];
            if (next instanceof $4fda26bcd679fbcb$var$NodeViewDesc) {
                let preMatch = this.preMatch.matched.get(next);
                if (preMatch != null && preMatch != index) return false;
                let nextDOM = next.dom;
                // Can't update if nextDOM is or contains this.lock, except if
                // it's a text node whose content already matches the new text
                // and whose decorations match the new ones.
                let locked = this.lock && (nextDOM == this.lock || nextDOM.nodeType == 1 && nextDOM.contains(this.lock.parentNode)) && !(node.isText && next.node && next.node.isText && next.nodeDOM.nodeValue == node.text && next.dirty != $4fda26bcd679fbcb$var$NODE_DIRTY && $4fda26bcd679fbcb$var$sameOuterDeco(outerDeco, next.outerDeco));
                if (!locked && next.update(node, outerDeco, innerDeco, view)) {
                    this.destroyBetween(this.index, i);
                    if (next.dom != nextDOM) this.changed = true;
                    this.index++;
                    return true;
                }
                break;
            }
        }
        return false;
    }
    // Insert the node as a newly created node desc.
    addNode(node, outerDeco, innerDeco, view, pos) {
        this.top.children.splice(this.index++, 0, $4fda26bcd679fbcb$var$NodeViewDesc.create(this.top, node, outerDeco, innerDeco, view, pos));
        this.changed = true;
    }
    placeWidget(widget, view, pos) {
        let next = this.index < this.top.children.length ? this.top.children[this.index] : null;
        if (next && next.matchesWidget(widget) && (widget == next.widget || !next.widget.type.toDOM.parentNode)) this.index++;
        else {
            let desc = new $4fda26bcd679fbcb$var$WidgetViewDesc(this.top, widget, view, pos);
            this.top.children.splice(this.index++, 0, desc);
            this.changed = true;
        }
    }
    // Make sure a textblock looks and behaves correctly in
    // contentEditable.
    addTextblockHacks() {
        let lastChild = this.top.children[this.index - 1], parent = this.top;
        while(lastChild instanceof $4fda26bcd679fbcb$var$MarkViewDesc){
            parent = lastChild;
            lastChild = parent.children[parent.children.length - 1];
        }
        if (!lastChild || // Empty textblock
        !(lastChild instanceof $4fda26bcd679fbcb$var$TextViewDesc) || /\n$/.test(lastChild.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(lastChild.node.text)) {
            // Avoid bugs in Safari's cursor drawing (#1165) and Chrome's mouse selection (#1152)
            if (($4fda26bcd679fbcb$var$safari || $4fda26bcd679fbcb$var$chrome) && lastChild && lastChild.dom.contentEditable == "false") this.addHackNode("IMG", parent);
            this.addHackNode("BR", this.top);
        }
    }
    addHackNode(nodeName, parent) {
        if (parent == this.top && this.index < parent.children.length && parent.children[this.index].matchesHack(nodeName)) this.index++;
        else {
            let dom = document.createElement(nodeName);
            if (nodeName == "IMG") {
                dom.className = "ProseMirror-separator";
                dom.alt = "";
            }
            if (nodeName == "BR") dom.className = "ProseMirror-trailingBreak";
            let hack = new $4fda26bcd679fbcb$var$TrailingHackViewDesc(this.top, [], dom, null);
            if (parent != this.top) parent.children.push(hack);
            else parent.children.splice(this.index++, 0, hack);
            this.changed = true;
        }
    }
}
// Iterate from the end of the fragment and array of descs to find
// directly matching ones, in order to avoid overeagerly reusing those
// for other nodes. Returns the fragment index of the first node that
// is part of the sequence of matched nodes at the end of the
// fragment.
function $4fda26bcd679fbcb$var$preMatch(frag, parentDesc) {
    let curDesc = parentDesc, descI = curDesc.children.length;
    let fI = frag.childCount, matched = new Map, matches = [];
    outer: while(fI > 0){
        let desc;
        for(;;){
            if (descI) {
                let next = curDesc.children[descI - 1];
                if (next instanceof $4fda26bcd679fbcb$var$MarkViewDesc) {
                    curDesc = next;
                    descI = next.children.length;
                } else {
                    desc = next;
                    descI--;
                    break;
                }
            } else if (curDesc == parentDesc) break outer;
            else {
                // FIXME
                descI = curDesc.parent.children.indexOf(curDesc);
                curDesc = curDesc.parent;
            }
        }
        let node = desc.node;
        if (!node) continue;
        if (node != frag.child(fI - 1)) break;
        --fI;
        matched.set(desc, fI);
        matches.push(desc);
    }
    return {
        index: fI,
        matched: matched,
        matches: matches.reverse()
    };
}
function $4fda26bcd679fbcb$var$compareSide(a, b) {
    return a.type.side - b.type.side;
}
// This function abstracts iterating over the nodes and decorations in
// a fragment. Calls `onNode` for each node, with its local and child
// decorations. Splits text nodes when there is a decoration starting
// or ending inside of them. Calls `onWidget` for each widget.
function $4fda26bcd679fbcb$var$iterDeco(parent, deco, onWidget, onNode) {
    let locals = deco.locals(parent), offset = 0;
    // Simple, cheap variant for when there are no local decorations
    if (locals.length == 0) {
        for(let i = 0; i < parent.childCount; i++){
            let child = parent.child(i);
            onNode(child, locals, deco.forChild(offset, child), i);
            offset += child.nodeSize;
        }
        return;
    }
    let decoIndex = 0, active = [], restNode = null;
    for(let parentIndex = 0;;){
        if (decoIndex < locals.length && locals[decoIndex].to == offset) {
            let widget = locals[decoIndex++], widgets;
            while(decoIndex < locals.length && locals[decoIndex].to == offset)(widgets || (widgets = [
                widget
            ])).push(locals[decoIndex++]);
            if (widgets) {
                widgets.sort($4fda26bcd679fbcb$var$compareSide);
                for(let i1 = 0; i1 < widgets.length; i1++)onWidget(widgets[i1], parentIndex, !!restNode);
            } else onWidget(widget, parentIndex, !!restNode);
        }
        let child1, index;
        if (restNode) {
            index = -1;
            child1 = restNode;
            restNode = null;
        } else if (parentIndex < parent.childCount) {
            index = parentIndex;
            child1 = parent.child(parentIndex++);
        } else break;
        for(let i2 = 0; i2 < active.length; i2++)if (active[i2].to <= offset) active.splice(i2--, 1);
        while(decoIndex < locals.length && locals[decoIndex].from <= offset && locals[decoIndex].to > offset)active.push(locals[decoIndex++]);
        let end = offset + child1.nodeSize;
        if (child1.isText) {
            let cutAt = end;
            if (decoIndex < locals.length && locals[decoIndex].from < cutAt) cutAt = locals[decoIndex].from;
            for(let i3 = 0; i3 < active.length; i3++)if (active[i3].to < cutAt) cutAt = active[i3].to;
            if (cutAt < end) {
                restNode = child1.cut(cutAt - offset);
                child1 = child1.cut(0, cutAt - offset);
                end = cutAt;
                index = -1;
            }
        }
        let outerDeco = child1.isInline && !child1.isLeaf ? active.filter((d)=>!d.inline) : active.slice();
        onNode(child1, outerDeco, deco.forChild(offset, child1), index);
        offset = end;
    }
}
// List markers in Mobile Safari will mysteriously disappear
// sometimes. This works around that.
function $4fda26bcd679fbcb$var$iosHacks(dom) {
    if (dom.nodeName == "UL" || dom.nodeName == "OL") {
        let oldCSS = dom.style.cssText;
        dom.style.cssText = oldCSS + "; list-style: square !important";
        window.getComputedStyle(dom).listStyle;
        dom.style.cssText = oldCSS;
    }
}
function $4fda26bcd679fbcb$var$nearbyTextNode(node, offset) {
    for(;;){
        if (node.nodeType == 3) return node;
        if (node.nodeType == 1 && offset > 0) {
            if (node.childNodes.length > offset && node.childNodes[offset].nodeType == 3) return node.childNodes[offset];
            node = node.childNodes[offset - 1];
            offset = $4fda26bcd679fbcb$var$nodeSize(node);
        } else if (node.nodeType == 1 && offset < node.childNodes.length) {
            node = node.childNodes[offset];
            offset = 0;
        } else return null;
    }
}
// Find a piece of text in an inline fragment, overlapping from-to
function $4fda26bcd679fbcb$var$findTextInFragment(frag, text, from, to) {
    for(let i = 0, pos = 0; i < frag.childCount && pos <= to;){
        let child = frag.child(i++), childStart = pos;
        pos += child.nodeSize;
        if (!child.isText) continue;
        let str = child.text;
        while(i < frag.childCount){
            let next = frag.child(i++);
            pos += next.nodeSize;
            if (!next.isText) break;
            str += next.text;
        }
        if (pos >= from) {
            let found = childStart < to ? str.lastIndexOf(text, to - childStart - 1) : -1;
            if (found >= 0 && found + text.length + childStart >= from) return childStart + found;
            if (from == to && str.length >= to + text.length - childStart && str.slice(to - childStart, to - childStart + text.length) == text) return to;
        }
    }
    return -1;
}
// Replace range from-to in an array of view descs with replacement
// (may be null to just delete). This goes very much against the grain
// of the rest of this code, which tends to create nodes with the
// right shape in one go, rather than messing with them after
// creation, but is necessary in the composition hack.
function $4fda26bcd679fbcb$var$replaceNodes(nodes, from, to, view, replacement) {
    let result = [];
    for(let i = 0, off = 0; i < nodes.length; i++){
        let child = nodes[i], start = off, end = off += child.size;
        if (start >= to || end <= from) result.push(child);
        else {
            if (start < from) result.push(child.slice(0, from - start, view));
            if (replacement) {
                result.push(replacement);
                replacement = undefined;
            }
            if (end > to) result.push(child.slice(to - start, child.size, view));
        }
    }
    return result;
}
function $4fda26bcd679fbcb$var$selectionFromDOM(view, origin = null) {
    let domSel = view.domSelectionRange(), doc = view.state.doc;
    if (!domSel.focusNode) return null;
    let nearestDesc = view.docView.nearestDesc(domSel.focusNode), inWidget = nearestDesc && nearestDesc.size == 0;
    let head = view.docView.posFromDOM(domSel.focusNode, domSel.focusOffset, 1);
    if (head < 0) return null;
    let $head = doc.resolve(head), $anchor, selection;
    if ($4fda26bcd679fbcb$var$selectionCollapsed(domSel)) {
        $anchor = $head;
        while(nearestDesc && !nearestDesc.node)nearestDesc = nearestDesc.parent;
        let nearestDescNode = nearestDesc.node;
        if (nearestDesc && nearestDescNode.isAtom && (0, $ee27db283572d394$export$e2940151ac854c0b).isSelectable(nearestDescNode) && nearestDesc.parent && !(nearestDescNode.isInline && $4fda26bcd679fbcb$var$isOnEdge(domSel.focusNode, domSel.focusOffset, nearestDesc.dom))) {
            let pos = nearestDesc.posBefore;
            selection = new (0, $ee27db283572d394$export$e2940151ac854c0b)(head == pos ? $head : doc.resolve(pos));
        }
    } else {
        let anchor = view.docView.posFromDOM(domSel.anchorNode, domSel.anchorOffset, 1);
        if (anchor < 0) return null;
        $anchor = doc.resolve(anchor);
    }
    if (!selection) {
        let bias = origin == "pointer" || view.state.selection.head < $head.pos && !inWidget ? 1 : -1;
        selection = $4fda26bcd679fbcb$var$selectionBetween(view, $anchor, $head, bias);
    }
    return selection;
}
function $4fda26bcd679fbcb$var$editorOwnsSelection(view) {
    return view.editable ? view.hasFocus() : $4fda26bcd679fbcb$var$hasSelection(view) && document.activeElement && document.activeElement.contains(view.dom);
}
function $4fda26bcd679fbcb$var$selectionToDOM(view, force = false) {
    let sel = view.state.selection;
    $4fda26bcd679fbcb$var$syncNodeSelection(view, sel);
    if (!$4fda26bcd679fbcb$var$editorOwnsSelection(view)) return;
    // The delayed drag selection causes issues with Cell Selections
    // in Safari. And the drag selection delay is to workarond issues
    // which only present in Chrome.
    if (!force && view.input.mouseDown && view.input.mouseDown.allowDefault && $4fda26bcd679fbcb$var$chrome) {
        let domSel = view.domSelectionRange(), curSel = view.domObserver.currentSelection;
        if (domSel.anchorNode && curSel.anchorNode && $4fda26bcd679fbcb$var$isEquivalentPosition(domSel.anchorNode, domSel.anchorOffset, curSel.anchorNode, curSel.anchorOffset)) {
            view.input.mouseDown.delayedSelectionSync = true;
            view.domObserver.setCurSelection();
            return;
        }
    }
    view.domObserver.disconnectSelection();
    if (view.cursorWrapper) $4fda26bcd679fbcb$var$selectCursorWrapper(view);
    else {
        let { anchor: anchor , head: head  } = sel, resetEditableFrom, resetEditableTo;
        if ($4fda26bcd679fbcb$var$brokenSelectBetweenUneditable && !(sel instanceof (0, $ee27db283572d394$export$c2b25f346d19bcbb))) {
            if (!sel.$from.parent.inlineContent) resetEditableFrom = $4fda26bcd679fbcb$var$temporarilyEditableNear(view, sel.from);
            if (!sel.empty && !sel.$from.parent.inlineContent) resetEditableTo = $4fda26bcd679fbcb$var$temporarilyEditableNear(view, sel.to);
        }
        view.docView.setSelection(anchor, head, view.root, force);
        if ($4fda26bcd679fbcb$var$brokenSelectBetweenUneditable) {
            if (resetEditableFrom) $4fda26bcd679fbcb$var$resetEditable(resetEditableFrom);
            if (resetEditableTo) $4fda26bcd679fbcb$var$resetEditable(resetEditableTo);
        }
        if (sel.visible) view.dom.classList.remove("ProseMirror-hideselection");
        else {
            view.dom.classList.add("ProseMirror-hideselection");
            if ("onselectionchange" in document) $4fda26bcd679fbcb$var$removeClassOnSelectionChange(view);
        }
    }
    view.domObserver.setCurSelection();
    view.domObserver.connectSelection();
}
// Kludge to work around Webkit not allowing a selection to start/end
// between non-editable block nodes. We briefly make something
// editable, set the selection, then set it uneditable again.
const $4fda26bcd679fbcb$var$brokenSelectBetweenUneditable = $4fda26bcd679fbcb$var$safari || $4fda26bcd679fbcb$var$chrome && $4fda26bcd679fbcb$var$chrome_version < 63;
function $4fda26bcd679fbcb$var$temporarilyEditableNear(view, pos) {
    let { node: node , offset: offset  } = view.docView.domFromPos(pos, 0);
    let after = offset < node.childNodes.length ? node.childNodes[offset] : null;
    let before = offset ? node.childNodes[offset - 1] : null;
    if ($4fda26bcd679fbcb$var$safari && after && after.contentEditable == "false") return $4fda26bcd679fbcb$var$setEditable(after);
    if ((!after || after.contentEditable == "false") && (!before || before.contentEditable == "false")) {
        if (after) return $4fda26bcd679fbcb$var$setEditable(after);
        else if (before) return $4fda26bcd679fbcb$var$setEditable(before);
    }
}
function $4fda26bcd679fbcb$var$setEditable(element) {
    element.contentEditable = "true";
    if ($4fda26bcd679fbcb$var$safari && element.draggable) {
        element.draggable = false;
        element.wasDraggable = true;
    }
    return element;
}
function $4fda26bcd679fbcb$var$resetEditable(element) {
    element.contentEditable = "false";
    if (element.wasDraggable) {
        element.draggable = true;
        element.wasDraggable = null;
    }
}
function $4fda26bcd679fbcb$var$removeClassOnSelectionChange(view) {
    let doc = view.dom.ownerDocument;
    doc.removeEventListener("selectionchange", view.input.hideSelectionGuard);
    let domSel = view.domSelectionRange();
    let node = domSel.anchorNode, offset = domSel.anchorOffset;
    doc.addEventListener("selectionchange", view.input.hideSelectionGuard = ()=>{
        if (domSel.anchorNode != node || domSel.anchorOffset != offset) {
            doc.removeEventListener("selectionchange", view.input.hideSelectionGuard);
            setTimeout(()=>{
                if (!$4fda26bcd679fbcb$var$editorOwnsSelection(view) || view.state.selection.visible) view.dom.classList.remove("ProseMirror-hideselection");
            }, 20);
        }
    });
}
function $4fda26bcd679fbcb$var$selectCursorWrapper(view) {
    let domSel = view.domSelection(), range = document.createRange();
    let node = view.cursorWrapper.dom, img = node.nodeName == "IMG";
    if (img) range.setEnd(node.parentNode, $4fda26bcd679fbcb$var$domIndex(node) + 1);
    else range.setEnd(node, 0);
    range.collapse(false);
    domSel.removeAllRanges();
    domSel.addRange(range);
    // Kludge to kill 'control selection' in IE11 when selecting an
    // invisible cursor wrapper, since that would result in those weird
    // resize handles and a selection that considers the absolutely
    // positioned wrapper, rather than the root editable node, the
    // focused element.
    if (!img && !view.state.selection.visible && $4fda26bcd679fbcb$var$ie && $4fda26bcd679fbcb$var$ie_version <= 11) {
        node.disabled = true;
        node.disabled = false;
    }
}
function $4fda26bcd679fbcb$var$syncNodeSelection(view, sel) {
    if (sel instanceof (0, $ee27db283572d394$export$e2940151ac854c0b)) {
        let desc = view.docView.descAt(sel.from);
        if (desc != view.lastSelectedViewDesc) {
            $4fda26bcd679fbcb$var$clearNodeSelection(view);
            if (desc) desc.selectNode();
            view.lastSelectedViewDesc = desc;
        }
    } else $4fda26bcd679fbcb$var$clearNodeSelection(view);
}
// Clear all DOM statefulness of the last node selection.
function $4fda26bcd679fbcb$var$clearNodeSelection(view) {
    if (view.lastSelectedViewDesc) {
        if (view.lastSelectedViewDesc.parent) view.lastSelectedViewDesc.deselectNode();
        view.lastSelectedViewDesc = undefined;
    }
}
function $4fda26bcd679fbcb$var$selectionBetween(view, $anchor, $head, bias) {
    return view.someProp("createSelectionBetween", (f)=>f(view, $anchor, $head)) || (0, $ee27db283572d394$export$c2b25f346d19bcbb).between($anchor, $head, bias);
}
function $4fda26bcd679fbcb$var$hasFocusAndSelection(view) {
    if (view.editable && !view.hasFocus()) return false;
    return $4fda26bcd679fbcb$var$hasSelection(view);
}
function $4fda26bcd679fbcb$var$hasSelection(view) {
    let sel = view.domSelectionRange();
    if (!sel.anchorNode) return false;
    try {
        // Firefox will raise 'permission denied' errors when accessing
        // properties of `sel.anchorNode` when it's in a generated CSS
        // element.
        return view.dom.contains(sel.anchorNode.nodeType == 3 ? sel.anchorNode.parentNode : sel.anchorNode) && (view.editable || view.dom.contains(sel.focusNode.nodeType == 3 ? sel.focusNode.parentNode : sel.focusNode));
    } catch (_) {
        return false;
    }
}
function $4fda26bcd679fbcb$var$anchorInRightPlace(view) {
    let anchorDOM = view.docView.domFromPos(view.state.selection.anchor, 0);
    let domSel = view.domSelectionRange();
    return $4fda26bcd679fbcb$var$isEquivalentPosition(anchorDOM.node, anchorDOM.offset, domSel.anchorNode, domSel.anchorOffset);
}
function $4fda26bcd679fbcb$var$moveSelectionBlock(state, dir) {
    let { $anchor: $anchor , $head: $head  } = state.selection;
    let $side = dir > 0 ? $anchor.max($head) : $anchor.min($head);
    let $start = !$side.parent.inlineContent ? $side : $side.depth ? state.doc.resolve(dir > 0 ? $side.after() : $side.before()) : null;
    return $start && (0, $ee27db283572d394$export$52baac22726c72bf).findFrom($start, dir);
}
function $4fda26bcd679fbcb$var$apply(view, sel) {
    view.dispatch(view.state.tr.setSelection(sel).scrollIntoView());
    return true;
}
function $4fda26bcd679fbcb$var$selectHorizontally(view, dir, mods) {
    let sel = view.state.selection;
    if (sel instanceof (0, $ee27db283572d394$export$c2b25f346d19bcbb)) {
        if (!sel.empty || mods.indexOf("s") > -1) return false;
        else if (view.endOfTextblock(dir > 0 ? "right" : "left")) {
            let next = $4fda26bcd679fbcb$var$moveSelectionBlock(view.state, dir);
            if (next && next instanceof (0, $ee27db283572d394$export$e2940151ac854c0b)) return $4fda26bcd679fbcb$var$apply(view, next);
            return false;
        } else if (!($4fda26bcd679fbcb$var$mac && mods.indexOf("m") > -1)) {
            let $head = sel.$head, node = $head.textOffset ? null : dir < 0 ? $head.nodeBefore : $head.nodeAfter, desc;
            if (!node || node.isText) return false;
            let nodePos = dir < 0 ? $head.pos - node.nodeSize : $head.pos;
            if (!(node.isAtom || (desc = view.docView.descAt(nodePos)) && !desc.contentDOM)) return false;
            if ((0, $ee27db283572d394$export$e2940151ac854c0b).isSelectable(node)) return $4fda26bcd679fbcb$var$apply(view, new (0, $ee27db283572d394$export$e2940151ac854c0b)(dir < 0 ? view.state.doc.resolve($head.pos - node.nodeSize) : $head));
            else if ($4fda26bcd679fbcb$var$webkit) // Chrome and Safari will introduce extra pointless cursor
            // positions around inline uneditable nodes, so we have to
            // take over and move the cursor past them (#937)
            return $4fda26bcd679fbcb$var$apply(view, new (0, $ee27db283572d394$export$c2b25f346d19bcbb)(view.state.doc.resolve(dir < 0 ? nodePos : nodePos + node.nodeSize)));
            else return false;
        }
    } else if (sel instanceof (0, $ee27db283572d394$export$e2940151ac854c0b) && sel.node.isInline) return $4fda26bcd679fbcb$var$apply(view, new (0, $ee27db283572d394$export$c2b25f346d19bcbb)(dir > 0 ? sel.$to : sel.$from));
    else {
        let next1 = $4fda26bcd679fbcb$var$moveSelectionBlock(view.state, dir);
        if (next1) return $4fda26bcd679fbcb$var$apply(view, next1);
        return false;
    }
}
function $4fda26bcd679fbcb$var$nodeLen(node) {
    return node.nodeType == 3 ? node.nodeValue.length : node.childNodes.length;
}
function $4fda26bcd679fbcb$var$isIgnorable(dom) {
    let desc = dom.pmViewDesc;
    return desc && desc.size == 0 && (dom.nextSibling || dom.nodeName != "BR");
}
// Make sure the cursor isn't directly after one or more ignored
// nodes, which will confuse the browser's cursor motion logic.
function $4fda26bcd679fbcb$var$skipIgnoredNodesLeft(view) {
    let sel = view.domSelectionRange();
    let node = sel.focusNode, offset = sel.focusOffset;
    if (!node) return;
    let moveNode, moveOffset, force = false;
    // Gecko will do odd things when the selection is directly in front
    // of a non-editable node, so in that case, move it into the next
    // node if possible. Issue prosemirror/prosemirror#832.
    if ($4fda26bcd679fbcb$var$gecko && node.nodeType == 1 && offset < $4fda26bcd679fbcb$var$nodeLen(node) && $4fda26bcd679fbcb$var$isIgnorable(node.childNodes[offset])) force = true;
    for(;;){
        if (offset > 0) {
            if (node.nodeType != 1) break;
            else {
                let before = node.childNodes[offset - 1];
                if ($4fda26bcd679fbcb$var$isIgnorable(before)) {
                    moveNode = node;
                    moveOffset = --offset;
                } else if (before.nodeType == 3) {
                    node = before;
                    offset = node.nodeValue.length;
                } else break;
            }
        } else if ($4fda26bcd679fbcb$var$isBlockNode(node)) break;
        else {
            let prev = node.previousSibling;
            while(prev && $4fda26bcd679fbcb$var$isIgnorable(prev)){
                moveNode = node.parentNode;
                moveOffset = $4fda26bcd679fbcb$var$domIndex(prev);
                prev = prev.previousSibling;
            }
            if (!prev) {
                node = node.parentNode;
                if (node == view.dom) break;
                offset = 0;
            } else {
                node = prev;
                offset = $4fda26bcd679fbcb$var$nodeLen(node);
            }
        }
    }
    if (force) $4fda26bcd679fbcb$var$setSelFocus(view, node, offset);
    else if (moveNode) $4fda26bcd679fbcb$var$setSelFocus(view, moveNode, moveOffset);
}
// Make sure the cursor isn't directly before one or more ignored
// nodes.
function $4fda26bcd679fbcb$var$skipIgnoredNodesRight(view) {
    let sel = view.domSelectionRange();
    let node = sel.focusNode, offset = sel.focusOffset;
    if (!node) return;
    let len = $4fda26bcd679fbcb$var$nodeLen(node);
    let moveNode, moveOffset;
    for(;;){
        if (offset < len) {
            if (node.nodeType != 1) break;
            let after = node.childNodes[offset];
            if ($4fda26bcd679fbcb$var$isIgnorable(after)) {
                moveNode = node;
                moveOffset = ++offset;
            } else break;
        } else if ($4fda26bcd679fbcb$var$isBlockNode(node)) break;
        else {
            let next = node.nextSibling;
            while(next && $4fda26bcd679fbcb$var$isIgnorable(next)){
                moveNode = next.parentNode;
                moveOffset = $4fda26bcd679fbcb$var$domIndex(next) + 1;
                next = next.nextSibling;
            }
            if (!next) {
                node = node.parentNode;
                if (node == view.dom) break;
                offset = len = 0;
            } else {
                node = next;
                offset = 0;
                len = $4fda26bcd679fbcb$var$nodeLen(node);
            }
        }
    }
    if (moveNode) $4fda26bcd679fbcb$var$setSelFocus(view, moveNode, moveOffset);
}
function $4fda26bcd679fbcb$var$isBlockNode(dom) {
    let desc = dom.pmViewDesc;
    return desc && desc.node && desc.node.isBlock;
}
function $4fda26bcd679fbcb$var$setSelFocus(view, node, offset) {
    let sel = view.domSelection();
    if ($4fda26bcd679fbcb$var$selectionCollapsed(sel)) {
        let range = document.createRange();
        range.setEnd(node, offset);
        range.setStart(node, offset);
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (sel.extend) sel.extend(node, offset);
    view.domObserver.setCurSelection();
    let { state: state  } = view;
    // If no state update ends up happening, reset the selection.
    setTimeout(()=>{
        if (view.state == state) $4fda26bcd679fbcb$var$selectionToDOM(view);
    }, 50);
}
// Check whether vertical selection motion would involve node
// selections. If so, apply it (if not, the result is left to the
// browser)
function $4fda26bcd679fbcb$var$selectVertically(view, dir, mods) {
    let sel = view.state.selection;
    if (sel instanceof (0, $ee27db283572d394$export$c2b25f346d19bcbb) && !sel.empty || mods.indexOf("s") > -1) return false;
    if ($4fda26bcd679fbcb$var$mac && mods.indexOf("m") > -1) return false;
    let { $from: $from , $to: $to  } = sel;
    if (!$from.parent.inlineContent || view.endOfTextblock(dir < 0 ? "up" : "down")) {
        let next = $4fda26bcd679fbcb$var$moveSelectionBlock(view.state, dir);
        if (next && next instanceof (0, $ee27db283572d394$export$e2940151ac854c0b)) return $4fda26bcd679fbcb$var$apply(view, next);
    }
    if (!$from.parent.inlineContent) {
        let side = dir < 0 ? $from : $to;
        let beyond = sel instanceof (0, $ee27db283572d394$export$c15d9ba76bdbcd95) ? (0, $ee27db283572d394$export$52baac22726c72bf).near(side, dir) : (0, $ee27db283572d394$export$52baac22726c72bf).findFrom(side, dir);
        return beyond ? $4fda26bcd679fbcb$var$apply(view, beyond) : false;
    }
    return false;
}
function $4fda26bcd679fbcb$var$stopNativeHorizontalDelete(view, dir) {
    if (!(view.state.selection instanceof (0, $ee27db283572d394$export$c2b25f346d19bcbb))) return true;
    let { $head: $head , $anchor: $anchor , empty: empty  } = view.state.selection;
    if (!$head.sameParent($anchor)) return true;
    if (!empty) return false;
    if (view.endOfTextblock(dir > 0 ? "forward" : "backward")) return true;
    let nextNode = !$head.textOffset && (dir < 0 ? $head.nodeBefore : $head.nodeAfter);
    if (nextNode && !nextNode.isText) {
        let tr = view.state.tr;
        if (dir < 0) tr.delete($head.pos - nextNode.nodeSize, $head.pos);
        else tr.delete($head.pos, $head.pos + nextNode.nodeSize);
        view.dispatch(tr);
        return true;
    }
    return false;
}
function $4fda26bcd679fbcb$var$switchEditable(view, node, state) {
    view.domObserver.stop();
    node.contentEditable = state;
    view.domObserver.start();
}
// Issue #867 / #1090 / https://bugs.chromium.org/p/chromium/issues/detail?id=903821
// In which Safari (and at some point in the past, Chrome) does really
// wrong things when the down arrow is pressed when the cursor is
// directly at the start of a textblock and has an uneditable node
// after it
function $4fda26bcd679fbcb$var$safariDownArrowBug(view) {
    if (!$4fda26bcd679fbcb$var$safari || view.state.selection.$head.parentOffset > 0) return false;
    let { focusNode: focusNode , focusOffset: focusOffset  } = view.domSelectionRange();
    if (focusNode && focusNode.nodeType == 1 && focusOffset == 0 && focusNode.firstChild && focusNode.firstChild.contentEditable == "false") {
        let child = focusNode.firstChild;
        $4fda26bcd679fbcb$var$switchEditable(view, child, "true");
        setTimeout(()=>$4fda26bcd679fbcb$var$switchEditable(view, child, "false"), 20);
    }
    return false;
}
// A backdrop key mapping used to make sure we always suppress keys
// that have a dangerous default effect, even if the commands they are
// bound to return false, and to make sure that cursor-motion keys
// find a cursor (as opposed to a node selection) when pressed. For
// cursor-motion keys, the code in the handlers also takes care of
// block selections.
function $4fda26bcd679fbcb$var$getMods(event) {
    let result = "";
    if (event.ctrlKey) result += "c";
    if (event.metaKey) result += "m";
    if (event.altKey) result += "a";
    if (event.shiftKey) result += "s";
    return result;
}
function $4fda26bcd679fbcb$var$captureKeyDown(view, event) {
    let code = event.keyCode, mods = $4fda26bcd679fbcb$var$getMods(event);
    if (code == 8 || $4fda26bcd679fbcb$var$mac && code == 72 && mods == "c") return $4fda26bcd679fbcb$var$stopNativeHorizontalDelete(view, -1) || $4fda26bcd679fbcb$var$skipIgnoredNodesLeft(view);
    else if (code == 46 || $4fda26bcd679fbcb$var$mac && code == 68 && mods == "c") return $4fda26bcd679fbcb$var$stopNativeHorizontalDelete(view, 1) || $4fda26bcd679fbcb$var$skipIgnoredNodesRight(view);
    else if (code == 13 || code == 27) return true;
    else if (code == 37 || $4fda26bcd679fbcb$var$mac && code == 66 && mods == "c") return $4fda26bcd679fbcb$var$selectHorizontally(view, -1, mods) || $4fda26bcd679fbcb$var$skipIgnoredNodesLeft(view);
    else if (code == 39 || $4fda26bcd679fbcb$var$mac && code == 70 && mods == "c") return $4fda26bcd679fbcb$var$selectHorizontally(view, 1, mods) || $4fda26bcd679fbcb$var$skipIgnoredNodesRight(view);
    else if (code == 38 || $4fda26bcd679fbcb$var$mac && code == 80 && mods == "c") return $4fda26bcd679fbcb$var$selectVertically(view, -1, mods) || $4fda26bcd679fbcb$var$skipIgnoredNodesLeft(view);
    else if (code == 40 || $4fda26bcd679fbcb$var$mac && code == 78 && mods == "c") return $4fda26bcd679fbcb$var$safariDownArrowBug(view) || $4fda26bcd679fbcb$var$selectVertically(view, 1, mods) || $4fda26bcd679fbcb$var$skipIgnoredNodesRight(view);
    else if (mods == ($4fda26bcd679fbcb$var$mac ? "m" : "c") && (code == 66 || code == 73 || code == 89 || code == 90)) return true;
    return false;
}
function $4fda26bcd679fbcb$var$serializeForClipboard(view, slice) {
    view.someProp("transformCopied", (f)=>{
        slice = f(slice, view);
    });
    let context = [], { content: content , openStart: openStart , openEnd: openEnd  } = slice;
    while(openStart > 1 && openEnd > 1 && content.childCount == 1 && content.firstChild.childCount == 1){
        openStart--;
        openEnd--;
        let node = content.firstChild;
        context.push(node.type.name, node.attrs != node.type.defaultAttrs ? node.attrs : null);
        content = node.content;
    }
    let serializer = view.someProp("clipboardSerializer") || (0, $c8d507d90382f091$export$3476b78f8f5a8b72).fromSchema(view.state.schema);
    let doc = $4fda26bcd679fbcb$var$detachedDoc(), wrap = doc.createElement("div");
    wrap.appendChild(serializer.serializeFragment(content, {
        document: doc
    }));
    let firstChild = wrap.firstChild, needsWrap, wrappers = 0;
    while(firstChild && firstChild.nodeType == 1 && (needsWrap = $4fda26bcd679fbcb$var$wrapMap[firstChild.nodeName.toLowerCase()])){
        for(let i = needsWrap.length - 1; i >= 0; i--){
            let wrapper = doc.createElement(needsWrap[i]);
            while(wrap.firstChild)wrapper.appendChild(wrap.firstChild);
            wrap.appendChild(wrapper);
            wrappers++;
        }
        firstChild = wrap.firstChild;
    }
    if (firstChild && firstChild.nodeType == 1) firstChild.setAttribute("data-pm-slice", `${openStart} ${openEnd}${wrappers ? ` -${wrappers}` : ""} ${JSON.stringify(context)}`);
    let text = view.someProp("clipboardTextSerializer", (f)=>f(slice, view)) || slice.content.textBetween(0, slice.content.size, "\n\n");
    return {
        dom: wrap,
        text: text
    };
}
// Read a slice of content from the clipboard (or drop data).
function $4fda26bcd679fbcb$var$parseFromClipboard(view, text, html, plainText, $context) {
    let inCode = $context.parent.type.spec.code;
    let dom, slice;
    if (!html && !text) return null;
    let asText = text && (plainText || inCode || !html);
    if (asText) {
        view.someProp("transformPastedText", (f)=>{
            text = f(text, inCode || plainText, view);
        });
        if (inCode) return text ? new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)((0, $c8d507d90382f091$export$ffb0004e005737fa).from(view.state.schema.text(text.replace(/\r\n?/g, "\n"))), 0, 0) : (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).empty;
        let parsed = view.someProp("clipboardTextParser", (f)=>f(text, $context, plainText, view));
        if (parsed) slice = parsed;
        else {
            let marks = $context.marks();
            let { schema: schema  } = view.state, serializer = (0, $c8d507d90382f091$export$3476b78f8f5a8b72).fromSchema(schema);
            dom = document.createElement("div");
            text.split(/(?:\r\n?|\n)+/).forEach((block)=>{
                let p = dom.appendChild(document.createElement("p"));
                if (block) p.appendChild(serializer.serializeNode(schema.text(block, marks)));
            });
        }
    } else {
        view.someProp("transformPastedHTML", (f)=>{
            html = f(html, view);
        });
        dom = $4fda26bcd679fbcb$var$readHTML(html);
        if ($4fda26bcd679fbcb$var$webkit) $4fda26bcd679fbcb$var$restoreReplacedSpaces(dom);
    }
    let contextNode = dom && dom.querySelector("[data-pm-slice]");
    let sliceData = contextNode && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(contextNode.getAttribute("data-pm-slice") || "");
    if (sliceData && sliceData[3]) for(let i = +sliceData[3]; i > 0; i--){
        let child = dom.firstChild;
        while(child && child.nodeType != 1)child = child.nextSibling;
        if (!child) break;
        dom = child;
    }
    if (!slice) {
        let parser = view.someProp("clipboardParser") || view.someProp("domParser") || (0, $c8d507d90382f091$export$1059c6e7d2ce5669).fromSchema(view.state.schema);
        slice = parser.parseSlice(dom, {
            preserveWhitespace: !!(asText || sliceData),
            context: $context,
            ruleFromNode (dom) {
                if (dom.nodeName == "BR" && !dom.nextSibling && dom.parentNode && !$4fda26bcd679fbcb$var$inlineParents.test(dom.parentNode.nodeName)) return {
                    ignore: true
                };
                return null;
            }
        });
    }
    if (sliceData) slice = $4fda26bcd679fbcb$var$addContext($4fda26bcd679fbcb$var$closeSlice(slice, +sliceData[1], +sliceData[2]), sliceData[4]);
    else {
        slice = (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).maxOpen($4fda26bcd679fbcb$var$normalizeSiblings(slice.content, $context), true);
        if (slice.openStart || slice.openEnd) {
            let openStart = 0, openEnd = 0;
            for(let node = slice.content.firstChild; openStart < slice.openStart && !node.type.spec.isolating; openStart++, node = node.firstChild);
            for(let node1 = slice.content.lastChild; openEnd < slice.openEnd && !node1.type.spec.isolating; openEnd++, node1 = node1.lastChild);
            slice = $4fda26bcd679fbcb$var$closeSlice(slice, openStart, openEnd);
        }
    }
    view.someProp("transformPasted", (f)=>{
        slice = f(slice, view);
    });
    return slice;
}
const $4fda26bcd679fbcb$var$inlineParents = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
// Takes a slice parsed with parseSlice, which means there hasn't been
// any content-expression checking done on the top nodes, tries to
// find a parent node in the current context that might fit the nodes,
// and if successful, rebuilds the slice so that it fits into that parent.
//
// This addresses the problem that Transform.replace expects a
// coherent slice, and will fail to place a set of siblings that don't
// fit anywhere in the schema.
function $4fda26bcd679fbcb$var$normalizeSiblings(fragment, $context) {
    if (fragment.childCount < 2) return fragment;
    for(let d = $context.depth; d >= 0; d--){
        let parent = $context.node(d);
        let match = parent.contentMatchAt($context.index(d));
        let lastWrap, result = [];
        fragment.forEach((node)=>{
            if (!result) return;
            let wrap = match.findWrapping(node.type), inLast;
            if (!wrap) return result = null;
            if (inLast = result.length && lastWrap.length && $4fda26bcd679fbcb$var$addToSibling(wrap, lastWrap, node, result[result.length - 1], 0)) result[result.length - 1] = inLast;
            else {
                if (result.length) result[result.length - 1] = $4fda26bcd679fbcb$var$closeRight(result[result.length - 1], lastWrap.length);
                let wrapped = $4fda26bcd679fbcb$var$withWrappers(node, wrap);
                result.push(wrapped);
                match = match.matchType(wrapped.type);
                lastWrap = wrap;
            }
        });
        if (result) return (0, $c8d507d90382f091$export$ffb0004e005737fa).from(result);
    }
    return fragment;
}
function $4fda26bcd679fbcb$var$withWrappers(node, wrap, from = 0) {
    for(let i = wrap.length - 1; i >= from; i--)node = wrap[i].create(null, (0, $c8d507d90382f091$export$ffb0004e005737fa).from(node));
    return node;
}
// Used to group adjacent nodes wrapped in similar parents by
// normalizeSiblings into the same parent node
function $4fda26bcd679fbcb$var$addToSibling(wrap, lastWrap, node, sibling, depth) {
    if (depth < wrap.length && depth < lastWrap.length && wrap[depth] == lastWrap[depth]) {
        let inner = $4fda26bcd679fbcb$var$addToSibling(wrap, lastWrap, node, sibling.lastChild, depth + 1);
        if (inner) return sibling.copy(sibling.content.replaceChild(sibling.childCount - 1, inner));
        let match = sibling.contentMatchAt(sibling.childCount);
        if (match.matchType(depth == wrap.length - 1 ? node.type : wrap[depth + 1])) return sibling.copy(sibling.content.append((0, $c8d507d90382f091$export$ffb0004e005737fa).from($4fda26bcd679fbcb$var$withWrappers(node, wrap, depth + 1))));
    }
}
function $4fda26bcd679fbcb$var$closeRight(node, depth) {
    if (depth == 0) return node;
    let fragment = node.content.replaceChild(node.childCount - 1, $4fda26bcd679fbcb$var$closeRight(node.lastChild, depth - 1));
    let fill = node.contentMatchAt(node.childCount).fillBefore((0, $c8d507d90382f091$export$ffb0004e005737fa).empty, true);
    return node.copy(fragment.append(fill));
}
function $4fda26bcd679fbcb$var$closeRange(fragment, side, from, to, depth, openEnd) {
    let node = side < 0 ? fragment.firstChild : fragment.lastChild, inner = node.content;
    if (depth < to - 1) inner = $4fda26bcd679fbcb$var$closeRange(inner, side, from, to, depth + 1, openEnd);
    if (depth >= from) inner = side < 0 ? node.contentMatchAt(0).fillBefore(inner, fragment.childCount > 1 || openEnd <= depth).append(inner) : inner.append(node.contentMatchAt(node.childCount).fillBefore((0, $c8d507d90382f091$export$ffb0004e005737fa).empty, true));
    return fragment.replaceChild(side < 0 ? 0 : fragment.childCount - 1, node.copy(inner));
}
function $4fda26bcd679fbcb$var$closeSlice(slice, openStart, openEnd) {
    if (openStart < slice.openStart) slice = new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)($4fda26bcd679fbcb$var$closeRange(slice.content, -1, openStart, slice.openStart, 0, slice.openEnd), openStart, slice.openEnd);
    if (openEnd < slice.openEnd) slice = new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)($4fda26bcd679fbcb$var$closeRange(slice.content, 1, openEnd, slice.openEnd, 0, 0), slice.openStart, openEnd);
    return slice;
}
// Trick from jQuery -- some elements must be wrapped in other
// elements for innerHTML to work. I.e. if you do `div.innerHTML =
// "<td>..</td>"` the table cells are ignored.
const $4fda26bcd679fbcb$var$wrapMap = {
    thead: [
        "table"
    ],
    tbody: [
        "table"
    ],
    tfoot: [
        "table"
    ],
    caption: [
        "table"
    ],
    colgroup: [
        "table"
    ],
    col: [
        "table",
        "colgroup"
    ],
    tr: [
        "table",
        "tbody"
    ],
    td: [
        "table",
        "tbody",
        "tr"
    ],
    th: [
        "table",
        "tbody",
        "tr"
    ]
};
let $4fda26bcd679fbcb$var$_detachedDoc = null;
function $4fda26bcd679fbcb$var$detachedDoc() {
    return $4fda26bcd679fbcb$var$_detachedDoc || ($4fda26bcd679fbcb$var$_detachedDoc = document.implementation.createHTMLDocument("title"));
}
function $4fda26bcd679fbcb$var$readHTML(html) {
    let metas = /^(\s*<meta [^>]*>)*/.exec(html);
    if (metas) html = html.slice(metas[0].length);
    let elt = $4fda26bcd679fbcb$var$detachedDoc().createElement("div");
    let firstTag = /<([a-z][^>\s]+)/i.exec(html), wrap;
    if (wrap = firstTag && $4fda26bcd679fbcb$var$wrapMap[firstTag[1].toLowerCase()]) html = wrap.map((n)=>"<" + n + ">").join("") + html + wrap.map((n)=>"</" + n + ">").reverse().join("");
    elt.innerHTML = html;
    if (wrap) for(let i = 0; i < wrap.length; i++)elt = elt.querySelector(wrap[i]) || elt;
    return elt;
}
// Webkit browsers do some hard-to-predict replacement of regular
// spaces with non-breaking spaces when putting content on the
// clipboard. This tries to convert such non-breaking spaces (which
// will be wrapped in a plain span on Chrome, a span with class
// Apple-converted-space on Safari) back to regular spaces.
function $4fda26bcd679fbcb$var$restoreReplacedSpaces(dom) {
    let nodes = dom.querySelectorAll($4fda26bcd679fbcb$var$chrome ? "span:not([class]):not([style])" : "span.Apple-converted-space");
    for(let i = 0; i < nodes.length; i++){
        let node = nodes[i];
        if (node.childNodes.length == 1 && node.textContent == "\xa0" && node.parentNode) node.parentNode.replaceChild(dom.ownerDocument.createTextNode(" "), node);
    }
}
function $4fda26bcd679fbcb$var$addContext(slice, context) {
    if (!slice.size) return slice;
    let schema = slice.content.firstChild.type.schema, array;
    try {
        array = JSON.parse(context);
    } catch (e) {
        return slice;
    }
    let { content: content , openStart: openStart , openEnd: openEnd  } = slice;
    for(let i = array.length - 2; i >= 0; i -= 2){
        let type = schema.nodes[array[i]];
        if (!type || type.hasRequiredAttrs()) break;
        content = (0, $c8d507d90382f091$export$ffb0004e005737fa).from(type.create(array[i + 1], content));
        openStart++;
        openEnd++;
    }
    return new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)(content, openStart, openEnd);
}
// A collection of DOM events that occur within the editor, and callback functions
// to invoke when the event fires.
const $4fda26bcd679fbcb$var$handlers = {};
const $4fda26bcd679fbcb$var$editHandlers = {};
const $4fda26bcd679fbcb$var$passiveHandlers = {
    touchstart: true,
    touchmove: true
};
class $4fda26bcd679fbcb$var$InputState {
    constructor(){
        this.shiftKey = false;
        this.mouseDown = null;
        this.lastKeyCode = null;
        this.lastKeyCodeTime = 0;
        this.lastClick = {
            time: 0,
            x: 0,
            y: 0,
            type: ""
        };
        this.lastSelectionOrigin = null;
        this.lastSelectionTime = 0;
        this.lastIOSEnter = 0;
        this.lastIOSEnterFallbackTimeout = -1;
        this.lastFocus = 0;
        this.lastTouch = 0;
        this.lastAndroidDelete = 0;
        this.composing = false;
        this.composingTimeout = -1;
        this.compositionNodes = [];
        this.compositionEndedAt = -200000000;
        this.domChangeCount = 0;
        this.eventHandlers = Object.create(null);
        this.hideSelectionGuard = null;
    }
}
function $4fda26bcd679fbcb$var$initInput(view) {
    for(let event in $4fda26bcd679fbcb$var$handlers){
        let handler = $4fda26bcd679fbcb$var$handlers[event];
        view.dom.addEventListener(event, view.input.eventHandlers[event] = (event)=>{
            if ($4fda26bcd679fbcb$var$eventBelongsToView(view, event) && !$4fda26bcd679fbcb$var$runCustomHandler(view, event) && (view.editable || !(event.type in $4fda26bcd679fbcb$var$editHandlers))) handler(view, event);
        }, $4fda26bcd679fbcb$var$passiveHandlers[event] ? {
            passive: true
        } : undefined);
    }
    // On Safari, for reasons beyond my understanding, adding an input
    // event handler makes an issue where the composition vanishes when
    // you press enter go away.
    if ($4fda26bcd679fbcb$var$safari) view.dom.addEventListener("input", ()=>null);
    $4fda26bcd679fbcb$var$ensureListeners(view);
}
function $4fda26bcd679fbcb$var$setSelectionOrigin(view, origin) {
    view.input.lastSelectionOrigin = origin;
    view.input.lastSelectionTime = Date.now();
}
function $4fda26bcd679fbcb$var$destroyInput(view) {
    view.domObserver.stop();
    for(let type in view.input.eventHandlers)view.dom.removeEventListener(type, view.input.eventHandlers[type]);
    clearTimeout(view.input.composingTimeout);
    clearTimeout(view.input.lastIOSEnterFallbackTimeout);
}
function $4fda26bcd679fbcb$var$ensureListeners(view) {
    view.someProp("handleDOMEvents", (currentHandlers)=>{
        for(let type in currentHandlers)if (!view.input.eventHandlers[type]) view.dom.addEventListener(type, view.input.eventHandlers[type] = (event)=>$4fda26bcd679fbcb$var$runCustomHandler(view, event));
    });
}
function $4fda26bcd679fbcb$var$runCustomHandler(view, event) {
    return view.someProp("handleDOMEvents", (handlers)=>{
        let handler = handlers[event.type];
        return handler ? handler(view, event) || event.defaultPrevented : false;
    });
}
function $4fda26bcd679fbcb$var$eventBelongsToView(view, event) {
    if (!event.bubbles) return true;
    if (event.defaultPrevented) return false;
    for(let node = event.target; node != view.dom; node = node.parentNode)if (!node || node.nodeType == 11 || node.pmViewDesc && node.pmViewDesc.stopEvent(event)) return false;
    return true;
}
function $4fda26bcd679fbcb$var$dispatchEvent(view, event) {
    if (!$4fda26bcd679fbcb$var$runCustomHandler(view, event) && $4fda26bcd679fbcb$var$handlers[event.type] && (view.editable || !(event.type in $4fda26bcd679fbcb$var$editHandlers))) $4fda26bcd679fbcb$var$handlers[event.type](view, event);
}
$4fda26bcd679fbcb$var$editHandlers.keydown = (view, _event)=>{
    let event = _event;
    view.input.shiftKey = event.keyCode == 16 || event.shiftKey;
    if ($4fda26bcd679fbcb$var$inOrNearComposition(view, event)) return;
    view.input.lastKeyCode = event.keyCode;
    view.input.lastKeyCodeTime = Date.now();
    // Suppress enter key events on Chrome Android, because those tend
    // to be part of a confused sequence of composition events fired,
    // and handling them eagerly tends to corrupt the input.
    if ($4fda26bcd679fbcb$var$android && $4fda26bcd679fbcb$var$chrome && event.keyCode == 13) return;
    if (event.keyCode != 229) view.domObserver.forceFlush();
    // On iOS, if we preventDefault enter key presses, the virtual
    // keyboard gets confused. So the hack here is to set a flag that
    // makes the DOM change code recognize that what just happens should
    // be replaced by whatever the Enter key handlers do.
    if ($4fda26bcd679fbcb$var$ios && event.keyCode == 13 && !event.ctrlKey && !event.altKey && !event.metaKey) {
        let now = Date.now();
        view.input.lastIOSEnter = now;
        view.input.lastIOSEnterFallbackTimeout = setTimeout(()=>{
            if (view.input.lastIOSEnter == now) {
                view.someProp("handleKeyDown", (f)=>f(view, $4fda26bcd679fbcb$var$keyEvent(13, "Enter")));
                view.input.lastIOSEnter = 0;
            }
        }, 200);
    } else if (view.someProp("handleKeyDown", (f)=>f(view, event)) || $4fda26bcd679fbcb$var$captureKeyDown(view, event)) event.preventDefault();
    else $4fda26bcd679fbcb$var$setSelectionOrigin(view, "key");
};
$4fda26bcd679fbcb$var$editHandlers.keyup = (view, event)=>{
    if (event.keyCode == 16) view.input.shiftKey = false;
};
$4fda26bcd679fbcb$var$editHandlers.keypress = (view, _event)=>{
    let event = _event;
    if ($4fda26bcd679fbcb$var$inOrNearComposition(view, event) || !event.charCode || event.ctrlKey && !event.altKey || $4fda26bcd679fbcb$var$mac && event.metaKey) return;
    if (view.someProp("handleKeyPress", (f)=>f(view, event))) {
        event.preventDefault();
        return;
    }
    let sel = view.state.selection;
    if (!(sel instanceof (0, $ee27db283572d394$export$c2b25f346d19bcbb)) || !sel.$from.sameParent(sel.$to)) {
        let text = String.fromCharCode(event.charCode);
        if (!view.someProp("handleTextInput", (f)=>f(view, sel.$from.pos, sel.$to.pos, text))) view.dispatch(view.state.tr.insertText(text).scrollIntoView());
        event.preventDefault();
    }
};
function $4fda26bcd679fbcb$var$eventCoords(event) {
    return {
        left: event.clientX,
        top: event.clientY
    };
}
function $4fda26bcd679fbcb$var$isNear(event, click) {
    let dx = click.x - event.clientX, dy = click.y - event.clientY;
    return dx * dx + dy * dy < 100;
}
function $4fda26bcd679fbcb$var$runHandlerOnContext(view, propName, pos, inside, event) {
    if (inside == -1) return false;
    let $pos = view.state.doc.resolve(inside);
    for(let i = $pos.depth + 1; i > 0; i--){
        if (view.someProp(propName, (f)=>i > $pos.depth ? f(view, pos, $pos.nodeAfter, $pos.before(i), event, true) : f(view, pos, $pos.node(i), $pos.before(i), event, false))) return true;
    }
    return false;
}
function $4fda26bcd679fbcb$var$updateSelection(view, selection, origin) {
    if (!view.focused) view.focus();
    let tr = view.state.tr.setSelection(selection);
    if (origin == "pointer") tr.setMeta("pointer", true);
    view.dispatch(tr);
}
function $4fda26bcd679fbcb$var$selectClickedLeaf(view, inside) {
    if (inside == -1) return false;
    let $pos = view.state.doc.resolve(inside), node = $pos.nodeAfter;
    if (node && node.isAtom && (0, $ee27db283572d394$export$e2940151ac854c0b).isSelectable(node)) {
        $4fda26bcd679fbcb$var$updateSelection(view, new (0, $ee27db283572d394$export$e2940151ac854c0b)($pos), "pointer");
        return true;
    }
    return false;
}
function $4fda26bcd679fbcb$var$selectClickedNode(view, inside) {
    if (inside == -1) return false;
    let sel = view.state.selection, selectedNode, selectAt;
    if (sel instanceof (0, $ee27db283572d394$export$e2940151ac854c0b)) selectedNode = sel.node;
    let $pos = view.state.doc.resolve(inside);
    for(let i = $pos.depth + 1; i > 0; i--){
        let node = i > $pos.depth ? $pos.nodeAfter : $pos.node(i);
        if ((0, $ee27db283572d394$export$e2940151ac854c0b).isSelectable(node)) {
            if (selectedNode && sel.$from.depth > 0 && i >= sel.$from.depth && $pos.before(sel.$from.depth + 1) == sel.$from.pos) selectAt = $pos.before(sel.$from.depth);
            else selectAt = $pos.before(i);
            break;
        }
    }
    if (selectAt != null) {
        $4fda26bcd679fbcb$var$updateSelection(view, (0, $ee27db283572d394$export$e2940151ac854c0b).create(view.state.doc, selectAt), "pointer");
        return true;
    } else return false;
}
function $4fda26bcd679fbcb$var$handleSingleClick(view, pos, inside, event, selectNode) {
    return $4fda26bcd679fbcb$var$runHandlerOnContext(view, "handleClickOn", pos, inside, event) || view.someProp("handleClick", (f)=>f(view, pos, event)) || (selectNode ? $4fda26bcd679fbcb$var$selectClickedNode(view, inside) : $4fda26bcd679fbcb$var$selectClickedLeaf(view, inside));
}
function $4fda26bcd679fbcb$var$handleDoubleClick(view, pos, inside, event) {
    return $4fda26bcd679fbcb$var$runHandlerOnContext(view, "handleDoubleClickOn", pos, inside, event) || view.someProp("handleDoubleClick", (f)=>f(view, pos, event));
}
function $4fda26bcd679fbcb$var$handleTripleClick(view, pos, inside, event) {
    return $4fda26bcd679fbcb$var$runHandlerOnContext(view, "handleTripleClickOn", pos, inside, event) || view.someProp("handleTripleClick", (f)=>f(view, pos, event)) || $4fda26bcd679fbcb$var$defaultTripleClick(view, inside, event);
}
function $4fda26bcd679fbcb$var$defaultTripleClick(view, inside, event) {
    if (event.button != 0) return false;
    let doc = view.state.doc;
    if (inside == -1) {
        if (doc.inlineContent) {
            $4fda26bcd679fbcb$var$updateSelection(view, (0, $ee27db283572d394$export$c2b25f346d19bcbb).create(doc, 0, doc.content.size), "pointer");
            return true;
        }
        return false;
    }
    let $pos = doc.resolve(inside);
    for(let i = $pos.depth + 1; i > 0; i--){
        let node = i > $pos.depth ? $pos.nodeAfter : $pos.node(i);
        let nodePos = $pos.before(i);
        if (node.inlineContent) $4fda26bcd679fbcb$var$updateSelection(view, (0, $ee27db283572d394$export$c2b25f346d19bcbb).create(doc, nodePos + 1, nodePos + 1 + node.content.size), "pointer");
        else if ((0, $ee27db283572d394$export$e2940151ac854c0b).isSelectable(node)) $4fda26bcd679fbcb$var$updateSelection(view, (0, $ee27db283572d394$export$e2940151ac854c0b).create(doc, nodePos), "pointer");
        else continue;
        return true;
    }
}
function $4fda26bcd679fbcb$var$forceDOMFlush(view) {
    return $4fda26bcd679fbcb$var$endComposition(view);
}
const $4fda26bcd679fbcb$var$selectNodeModifier = $4fda26bcd679fbcb$var$mac ? "metaKey" : "ctrlKey";
$4fda26bcd679fbcb$var$handlers.mousedown = (view, _event)=>{
    let event = _event;
    view.input.shiftKey = event.shiftKey;
    let flushed = $4fda26bcd679fbcb$var$forceDOMFlush(view);
    let now = Date.now(), type = "singleClick";
    if (now - view.input.lastClick.time < 500 && $4fda26bcd679fbcb$var$isNear(event, view.input.lastClick) && !event[$4fda26bcd679fbcb$var$selectNodeModifier]) {
        if (view.input.lastClick.type == "singleClick") type = "doubleClick";
        else if (view.input.lastClick.type == "doubleClick") type = "tripleClick";
    }
    view.input.lastClick = {
        time: now,
        x: event.clientX,
        y: event.clientY,
        type: type
    };
    let pos = view.posAtCoords($4fda26bcd679fbcb$var$eventCoords(event));
    if (!pos) return;
    if (type == "singleClick") {
        if (view.input.mouseDown) view.input.mouseDown.done();
        view.input.mouseDown = new $4fda26bcd679fbcb$var$MouseDown(view, pos, event, !!flushed);
    } else if ((type == "doubleClick" ? $4fda26bcd679fbcb$var$handleDoubleClick : $4fda26bcd679fbcb$var$handleTripleClick)(view, pos.pos, pos.inside, event)) event.preventDefault();
    else $4fda26bcd679fbcb$var$setSelectionOrigin(view, "pointer");
};
class $4fda26bcd679fbcb$var$MouseDown {
    constructor(view, pos, event, flushed){
        this.view = view;
        this.pos = pos;
        this.event = event;
        this.flushed = flushed;
        this.delayedSelectionSync = false;
        this.mightDrag = null;
        this.startDoc = view.state.doc;
        this.selectNode = !!event[$4fda26bcd679fbcb$var$selectNodeModifier];
        this.allowDefault = event.shiftKey;
        let targetNode, targetPos;
        if (pos.inside > -1) {
            targetNode = view.state.doc.nodeAt(pos.inside);
            targetPos = pos.inside;
        } else {
            let $pos = view.state.doc.resolve(pos.pos);
            targetNode = $pos.parent;
            targetPos = $pos.depth ? $pos.before() : 0;
        }
        const target = flushed ? null : event.target;
        const targetDesc = target ? view.docView.nearestDesc(target, true) : null;
        this.target = targetDesc ? targetDesc.dom : null;
        let { selection: selection  } = view.state;
        if (event.button == 0 && targetNode.type.spec.draggable && targetNode.type.spec.selectable !== false || selection instanceof (0, $ee27db283572d394$export$e2940151ac854c0b) && selection.from <= targetPos && selection.to > targetPos) this.mightDrag = {
            node: targetNode,
            pos: targetPos,
            addAttr: !!(this.target && !this.target.draggable),
            setUneditable: !!(this.target && $4fda26bcd679fbcb$var$gecko && !this.target.hasAttribute("contentEditable"))
        };
        if (this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable)) {
            this.view.domObserver.stop();
            if (this.mightDrag.addAttr) this.target.draggable = true;
            if (this.mightDrag.setUneditable) setTimeout(()=>{
                if (this.view.input.mouseDown == this) this.target.setAttribute("contentEditable", "false");
            }, 20);
            this.view.domObserver.start();
        }
        view.root.addEventListener("mouseup", this.up = this.up.bind(this));
        view.root.addEventListener("mousemove", this.move = this.move.bind(this));
        $4fda26bcd679fbcb$var$setSelectionOrigin(view, "pointer");
    }
    done() {
        this.view.root.removeEventListener("mouseup", this.up);
        this.view.root.removeEventListener("mousemove", this.move);
        if (this.mightDrag && this.target) {
            this.view.domObserver.stop();
            if (this.mightDrag.addAttr) this.target.removeAttribute("draggable");
            if (this.mightDrag.setUneditable) this.target.removeAttribute("contentEditable");
            this.view.domObserver.start();
        }
        if (this.delayedSelectionSync) setTimeout(()=>$4fda26bcd679fbcb$var$selectionToDOM(this.view));
        this.view.input.mouseDown = null;
    }
    up(event) {
        this.done();
        if (!this.view.dom.contains(event.target)) return;
        let pos = this.pos;
        if (this.view.state.doc != this.startDoc) pos = this.view.posAtCoords($4fda26bcd679fbcb$var$eventCoords(event));
        this.updateAllowDefault(event);
        if (this.allowDefault || !pos) $4fda26bcd679fbcb$var$setSelectionOrigin(this.view, "pointer");
        else if ($4fda26bcd679fbcb$var$handleSingleClick(this.view, pos.pos, pos.inside, event, this.selectNode)) event.preventDefault();
        else if (event.button == 0 && (this.flushed || // Safari ignores clicks on draggable elements
        $4fda26bcd679fbcb$var$safari && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
        // cursor, but still report that the node is selected
        // when asked through getSelection. You'll then get a
        // situation where clicking at the point where that
        // (hidden) cursor is doesn't change the selection, and
        // thus doesn't get a reaction from ProseMirror. This
        // works around that.
        $4fda26bcd679fbcb$var$chrome && !this.view.state.selection.visible && Math.min(Math.abs(pos.pos - this.view.state.selection.from), Math.abs(pos.pos - this.view.state.selection.to)) <= 2)) {
            $4fda26bcd679fbcb$var$updateSelection(this.view, (0, $ee27db283572d394$export$52baac22726c72bf).near(this.view.state.doc.resolve(pos.pos)), "pointer");
            event.preventDefault();
        } else $4fda26bcd679fbcb$var$setSelectionOrigin(this.view, "pointer");
    }
    move(event) {
        this.updateAllowDefault(event);
        $4fda26bcd679fbcb$var$setSelectionOrigin(this.view, "pointer");
        if (event.buttons == 0) this.done();
    }
    updateAllowDefault(event) {
        if (!this.allowDefault && (Math.abs(this.event.x - event.clientX) > 4 || Math.abs(this.event.y - event.clientY) > 4)) this.allowDefault = true;
    }
}
$4fda26bcd679fbcb$var$handlers.touchstart = (view)=>{
    view.input.lastTouch = Date.now();
    $4fda26bcd679fbcb$var$forceDOMFlush(view);
    $4fda26bcd679fbcb$var$setSelectionOrigin(view, "pointer");
};
$4fda26bcd679fbcb$var$handlers.touchmove = (view)=>{
    view.input.lastTouch = Date.now();
    $4fda26bcd679fbcb$var$setSelectionOrigin(view, "pointer");
};
$4fda26bcd679fbcb$var$handlers.contextmenu = (view)=>$4fda26bcd679fbcb$var$forceDOMFlush(view);
function $4fda26bcd679fbcb$var$inOrNearComposition(view, event) {
    if (view.composing) return true;
    // See https://www.stum.de/2016/06/24/handling-ime-events-in-javascript/.
    // On Japanese input method editors (IMEs), the Enter key is used to confirm character
    // selection. On Safari, when Enter is pressed, compositionend and keydown events are
    // emitted. The keydown event triggers newline insertion, which we don't want.
    // This method returns true if the keydown event should be ignored.
    // We only ignore it once, as pressing Enter a second time *should* insert a newline.
    // Furthermore, the keydown event timestamp must be close to the compositionEndedAt timestamp.
    // This guards against the case where compositionend is triggered without the keyboard
    // (e.g. character confirmation may be done with the mouse), and keydown is triggered
    // afterwards- we wouldn't want to ignore the keydown event in this case.
    if ($4fda26bcd679fbcb$var$safari && Math.abs(event.timeStamp - view.input.compositionEndedAt) < 500) {
        view.input.compositionEndedAt = -200000000;
        return true;
    }
    return false;
}
// Drop active composition after 5 seconds of inactivity on Android
const $4fda26bcd679fbcb$var$timeoutComposition = $4fda26bcd679fbcb$var$android ? 5000 : -1;
$4fda26bcd679fbcb$var$editHandlers.compositionstart = $4fda26bcd679fbcb$var$editHandlers.compositionupdate = (view)=>{
    if (!view.composing) {
        view.domObserver.flush();
        let { state: state  } = view, $pos = state.selection.$from;
        if (state.selection.empty && (state.storedMarks || !$pos.textOffset && $pos.parentOffset && $pos.nodeBefore.marks.some((m)=>m.type.spec.inclusive === false))) {
            // Need to wrap the cursor in mark nodes different from the ones in the DOM context
            view.markCursor = view.state.storedMarks || $pos.marks();
            $4fda26bcd679fbcb$var$endComposition(view, true);
            view.markCursor = null;
        } else {
            $4fda26bcd679fbcb$var$endComposition(view);
            // In firefox, if the cursor is after but outside a marked node,
            // the inserted text won't inherit the marks. So this moves it
            // inside if necessary.
            if ($4fda26bcd679fbcb$var$gecko && state.selection.empty && $pos.parentOffset && !$pos.textOffset && $pos.nodeBefore.marks.length) {
                let sel = view.domSelectionRange();
                for(let node = sel.focusNode, offset = sel.focusOffset; node && node.nodeType == 1 && offset != 0;){
                    let before = offset < 0 ? node.lastChild : node.childNodes[offset - 1];
                    if (!before) break;
                    if (before.nodeType == 3) {
                        view.domSelection().collapse(before, before.nodeValue.length);
                        break;
                    } else {
                        node = before;
                        offset = -1;
                    }
                }
            }
        }
        view.input.composing = true;
    }
    $4fda26bcd679fbcb$var$scheduleComposeEnd(view, $4fda26bcd679fbcb$var$timeoutComposition);
};
$4fda26bcd679fbcb$var$editHandlers.compositionend = (view, event)=>{
    if (view.composing) {
        view.input.composing = false;
        view.input.compositionEndedAt = event.timeStamp;
        $4fda26bcd679fbcb$var$scheduleComposeEnd(view, 20);
    }
};
function $4fda26bcd679fbcb$var$scheduleComposeEnd(view, delay) {
    clearTimeout(view.input.composingTimeout);
    if (delay > -1) view.input.composingTimeout = setTimeout(()=>$4fda26bcd679fbcb$var$endComposition(view), delay);
}
function $4fda26bcd679fbcb$var$clearComposition(view) {
    if (view.composing) {
        view.input.composing = false;
        view.input.compositionEndedAt = $4fda26bcd679fbcb$var$timestampFromCustomEvent();
    }
    while(view.input.compositionNodes.length > 0)view.input.compositionNodes.pop().markParentsDirty();
}
function $4fda26bcd679fbcb$var$timestampFromCustomEvent() {
    let event = document.createEvent("Event");
    event.initEvent("event", true, true);
    return event.timeStamp;
}
/**
@internal
*/ function $4fda26bcd679fbcb$var$endComposition(view, forceUpdate = false) {
    if ($4fda26bcd679fbcb$var$android && view.domObserver.flushingSoon >= 0) return;
    view.domObserver.forceFlush();
    $4fda26bcd679fbcb$var$clearComposition(view);
    if (forceUpdate || view.docView && view.docView.dirty) {
        let sel = $4fda26bcd679fbcb$var$selectionFromDOM(view);
        if (sel && !sel.eq(view.state.selection)) view.dispatch(view.state.tr.setSelection(sel));
        else view.updateState(view.state);
        return true;
    }
    return false;
}
function $4fda26bcd679fbcb$var$captureCopy(view, dom) {
    // The extra wrapper is somehow necessary on IE/Edge to prevent the
    // content from being mangled when it is put onto the clipboard
    if (!view.dom.parentNode) return;
    let wrap = view.dom.parentNode.appendChild(document.createElement("div"));
    wrap.appendChild(dom);
    wrap.style.cssText = "position: fixed; left: -10000px; top: 10px";
    let sel = getSelection(), range = document.createRange();
    range.selectNodeContents(dom);
    // Done because IE will fire a selectionchange moving the selection
    // to its start when removeAllRanges is called and the editor still
    // has focus (which will mess up the editor's selection state).
    view.dom.blur();
    sel.removeAllRanges();
    sel.addRange(range);
    setTimeout(()=>{
        if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
        view.focus();
    }, 50);
}
// This is very crude, but unfortunately both these browsers _pretend_
// that they have a clipboard API—all the objects and methods are
// there, they just don't work, and they are hard to test.
const $4fda26bcd679fbcb$var$brokenClipboardAPI = $4fda26bcd679fbcb$var$ie && $4fda26bcd679fbcb$var$ie_version < 15 || $4fda26bcd679fbcb$var$ios && $4fda26bcd679fbcb$var$webkit_version < 604;
$4fda26bcd679fbcb$var$handlers.copy = $4fda26bcd679fbcb$var$editHandlers.cut = (view, _event)=>{
    let event = _event;
    let sel = view.state.selection, cut = event.type == "cut";
    if (sel.empty) return;
    // IE and Edge's clipboard interface is completely broken
    let data = $4fda26bcd679fbcb$var$brokenClipboardAPI ? null : event.clipboardData;
    let slice = sel.content(), { dom: dom , text: text  } = $4fda26bcd679fbcb$var$serializeForClipboard(view, slice);
    if (data) {
        event.preventDefault();
        data.clearData();
        data.setData("text/html", dom.innerHTML);
        data.setData("text/plain", text);
    } else $4fda26bcd679fbcb$var$captureCopy(view, dom);
    if (cut) view.dispatch(view.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function $4fda26bcd679fbcb$var$sliceSingleNode(slice) {
    return slice.openStart == 0 && slice.openEnd == 0 && slice.content.childCount == 1 ? slice.content.firstChild : null;
}
function $4fda26bcd679fbcb$var$capturePaste(view, event) {
    if (!view.dom.parentNode) return;
    let plainText = view.input.shiftKey || view.state.selection.$from.parent.type.spec.code;
    let target = view.dom.parentNode.appendChild(document.createElement(plainText ? "textarea" : "div"));
    if (!plainText) target.contentEditable = "true";
    target.style.cssText = "position: fixed; left: -10000px; top: 10px";
    target.focus();
    setTimeout(()=>{
        view.focus();
        if (target.parentNode) target.parentNode.removeChild(target);
        if (plainText) $4fda26bcd679fbcb$var$doPaste(view, target.value, null, event);
        else $4fda26bcd679fbcb$var$doPaste(view, target.textContent, target.innerHTML, event);
    }, 50);
}
function $4fda26bcd679fbcb$var$doPaste(view, text, html, event) {
    let slice = $4fda26bcd679fbcb$var$parseFromClipboard(view, text, html, view.input.shiftKey, view.state.selection.$from);
    if (view.someProp("handlePaste", (f)=>f(view, event, slice || (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).empty))) return true;
    if (!slice) return false;
    let singleNode = $4fda26bcd679fbcb$var$sliceSingleNode(slice);
    let tr = singleNode ? view.state.tr.replaceSelectionWith(singleNode, view.input.shiftKey) : view.state.tr.replaceSelection(slice);
    view.dispatch(tr.scrollIntoView().setMeta("paste", true).setMeta("uiEvent", "paste"));
    return true;
}
$4fda26bcd679fbcb$var$editHandlers.paste = (view, _event)=>{
    let event = _event;
    // Handling paste from JavaScript during composition is very poorly
    // handled by browsers, so as a dodgy but preferable kludge, we just
    // let the browser do its native thing there, except on Android,
    // where the editor is almost always composing.
    if (view.composing && !$4fda26bcd679fbcb$var$android) return;
    let data = $4fda26bcd679fbcb$var$brokenClipboardAPI ? null : event.clipboardData;
    if (data && $4fda26bcd679fbcb$var$doPaste(view, data.getData("text/plain"), data.getData("text/html"), event)) event.preventDefault();
    else $4fda26bcd679fbcb$var$capturePaste(view, event);
};
class $4fda26bcd679fbcb$var$Dragging {
    constructor(slice, move){
        this.slice = slice;
        this.move = move;
    }
}
const $4fda26bcd679fbcb$var$dragCopyModifier = $4fda26bcd679fbcb$var$mac ? "altKey" : "ctrlKey";
$4fda26bcd679fbcb$var$handlers.dragstart = (view, _event)=>{
    let event = _event;
    let mouseDown = view.input.mouseDown;
    if (mouseDown) mouseDown.done();
    if (!event.dataTransfer) return;
    let sel = view.state.selection;
    let pos = sel.empty ? null : view.posAtCoords($4fda26bcd679fbcb$var$eventCoords(event));
    if (pos && pos.pos >= sel.from && pos.pos <= (sel instanceof (0, $ee27db283572d394$export$e2940151ac854c0b) ? sel.to - 1 : sel.to)) ;
    else if (mouseDown && mouseDown.mightDrag) view.dispatch(view.state.tr.setSelection((0, $ee27db283572d394$export$e2940151ac854c0b).create(view.state.doc, mouseDown.mightDrag.pos)));
    else if (event.target && event.target.nodeType == 1) {
        let desc = view.docView.nearestDesc(event.target, true);
        if (desc && desc.node.type.spec.draggable && desc != view.docView) view.dispatch(view.state.tr.setSelection((0, $ee27db283572d394$export$e2940151ac854c0b).create(view.state.doc, desc.posBefore)));
    }
    let slice = view.state.selection.content(), { dom: dom , text: text  } = $4fda26bcd679fbcb$var$serializeForClipboard(view, slice);
    event.dataTransfer.clearData();
    event.dataTransfer.setData($4fda26bcd679fbcb$var$brokenClipboardAPI ? "Text" : "text/html", dom.innerHTML);
    // See https://github.com/ProseMirror/prosemirror/issues/1156
    event.dataTransfer.effectAllowed = "copyMove";
    if (!$4fda26bcd679fbcb$var$brokenClipboardAPI) event.dataTransfer.setData("text/plain", text);
    view.dragging = new $4fda26bcd679fbcb$var$Dragging(slice, !event[$4fda26bcd679fbcb$var$dragCopyModifier]);
};
$4fda26bcd679fbcb$var$handlers.dragend = (view)=>{
    let dragging = view.dragging;
    window.setTimeout(()=>{
        if (view.dragging == dragging) view.dragging = null;
    }, 50);
};
$4fda26bcd679fbcb$var$editHandlers.dragover = $4fda26bcd679fbcb$var$editHandlers.dragenter = (_, e)=>e.preventDefault();
$4fda26bcd679fbcb$var$editHandlers.drop = (view, _event)=>{
    let event = _event;
    let dragging = view.dragging;
    view.dragging = null;
    if (!event.dataTransfer) return;
    let eventPos = view.posAtCoords($4fda26bcd679fbcb$var$eventCoords(event));
    if (!eventPos) return;
    let $mouse = view.state.doc.resolve(eventPos.pos);
    let slice = dragging && dragging.slice;
    if (slice) view.someProp("transformPasted", (f)=>{
        slice = f(slice, view);
    });
    else slice = $4fda26bcd679fbcb$var$parseFromClipboard(view, event.dataTransfer.getData($4fda26bcd679fbcb$var$brokenClipboardAPI ? "Text" : "text/plain"), $4fda26bcd679fbcb$var$brokenClipboardAPI ? null : event.dataTransfer.getData("text/html"), false, $mouse);
    let move = !!(dragging && !event[$4fda26bcd679fbcb$var$dragCopyModifier]);
    if (view.someProp("handleDrop", (f)=>f(view, event, slice || (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).empty, move))) {
        event.preventDefault();
        return;
    }
    if (!slice) return;
    event.preventDefault();
    let insertPos = slice ? (0, $5dfe06a1d53a4883$export$2819d598d048fc9c)(view.state.doc, $mouse.pos, slice) : $mouse.pos;
    if (insertPos == null) insertPos = $mouse.pos;
    let tr = view.state.tr;
    if (move) tr.deleteSelection();
    let pos = tr.mapping.map(insertPos);
    let isNode = slice.openStart == 0 && slice.openEnd == 0 && slice.content.childCount == 1;
    let beforeInsert = tr.doc;
    if (isNode) tr.replaceRangeWith(pos, pos, slice.content.firstChild);
    else tr.replaceRange(pos, pos, slice);
    if (tr.doc.eq(beforeInsert)) return;
    let $pos = tr.doc.resolve(pos);
    if (isNode && (0, $ee27db283572d394$export$e2940151ac854c0b).isSelectable(slice.content.firstChild) && $pos.nodeAfter && $pos.nodeAfter.sameMarkup(slice.content.firstChild)) tr.setSelection(new (0, $ee27db283572d394$export$e2940151ac854c0b)($pos));
    else {
        let end = tr.mapping.map(insertPos);
        tr.mapping.maps[tr.mapping.maps.length - 1].forEach((_from, _to, _newFrom, newTo)=>end = newTo);
        tr.setSelection($4fda26bcd679fbcb$var$selectionBetween(view, $pos, tr.doc.resolve(end)));
    }
    view.focus();
    view.dispatch(tr.setMeta("uiEvent", "drop"));
};
$4fda26bcd679fbcb$var$handlers.focus = (view)=>{
    view.input.lastFocus = Date.now();
    if (!view.focused) {
        view.domObserver.stop();
        view.dom.classList.add("ProseMirror-focused");
        view.domObserver.start();
        view.focused = true;
        setTimeout(()=>{
            if (view.docView && view.hasFocus() && !view.domObserver.currentSelection.eq(view.domSelectionRange())) $4fda26bcd679fbcb$var$selectionToDOM(view);
        }, 20);
    }
};
$4fda26bcd679fbcb$var$handlers.blur = (view, _event)=>{
    let event = _event;
    if (view.focused) {
        view.domObserver.stop();
        view.dom.classList.remove("ProseMirror-focused");
        view.domObserver.start();
        if (event.relatedTarget && view.dom.contains(event.relatedTarget)) view.domObserver.currentSelection.clear();
        view.focused = false;
    }
};
$4fda26bcd679fbcb$var$handlers.beforeinput = (view, _event)=>{
    let event = _event;
    // We should probably do more with beforeinput events, but support
    // is so spotty that I'm still waiting to see where they are going.
    // Very specific hack to deal with backspace sometimes failing on
    // Chrome Android when after an uneditable node.
    if ($4fda26bcd679fbcb$var$chrome && $4fda26bcd679fbcb$var$android && event.inputType == "deleteContentBackward") {
        view.domObserver.flushSoon();
        let { domChangeCount: domChangeCount  } = view.input;
        setTimeout(()=>{
            if (view.input.domChangeCount != domChangeCount) return; // Event already had some effect
            // This bug tends to close the virtual keyboard, so we refocus
            view.dom.blur();
            view.focus();
            if (view.someProp("handleKeyDown", (f)=>f(view, $4fda26bcd679fbcb$var$keyEvent(8, "Backspace")))) return;
            let { $cursor: $cursor  } = view.state.selection;
            // Crude approximation of backspace behavior when no command handled it
            if ($cursor && $cursor.pos > 0) view.dispatch(view.state.tr.delete($cursor.pos - 1, $cursor.pos).scrollIntoView());
        }, 50);
    }
};
// Make sure all handlers get registered
for(let prop in $4fda26bcd679fbcb$var$editHandlers)$4fda26bcd679fbcb$var$handlers[prop] = $4fda26bcd679fbcb$var$editHandlers[prop];
function $4fda26bcd679fbcb$var$compareObjs(a, b) {
    if (a == b) return true;
    for(let p in a)if (a[p] !== b[p]) return false;
    for(let p1 in b)if (!(p1 in a)) return false;
    return true;
}
class $4fda26bcd679fbcb$var$WidgetType {
    constructor(toDOM, spec){
        this.toDOM = toDOM;
        this.spec = spec || $4fda26bcd679fbcb$var$noSpec;
        this.side = this.spec.side || 0;
    }
    map(mapping, span, offset, oldOffset) {
        let { pos: pos , deleted: deleted  } = mapping.mapResult(span.from + oldOffset, this.side < 0 ? -1 : 1);
        return deleted ? null : new $4fda26bcd679fbcb$export$10e30b733df217ea(pos - offset, pos - offset, this);
    }
    valid() {
        return true;
    }
    eq(other) {
        return this == other || other instanceof $4fda26bcd679fbcb$var$WidgetType && (this.spec.key && this.spec.key == other.spec.key || this.toDOM == other.toDOM && $4fda26bcd679fbcb$var$compareObjs(this.spec, other.spec));
    }
    destroy(node) {
        if (this.spec.destroy) this.spec.destroy(node);
    }
}
class $4fda26bcd679fbcb$var$InlineType {
    constructor(attrs, spec){
        this.attrs = attrs;
        this.spec = spec || $4fda26bcd679fbcb$var$noSpec;
    }
    map(mapping, span, offset, oldOffset) {
        let from = mapping.map(span.from + oldOffset, this.spec.inclusiveStart ? -1 : 1) - offset;
        let to = mapping.map(span.to + oldOffset, this.spec.inclusiveEnd ? 1 : -1) - offset;
        return from >= to ? null : new $4fda26bcd679fbcb$export$10e30b733df217ea(from, to, this);
    }
    valid(_, span) {
        return span.from < span.to;
    }
    eq(other) {
        return this == other || other instanceof $4fda26bcd679fbcb$var$InlineType && $4fda26bcd679fbcb$var$compareObjs(this.attrs, other.attrs) && $4fda26bcd679fbcb$var$compareObjs(this.spec, other.spec);
    }
    static is(span) {
        return span.type instanceof $4fda26bcd679fbcb$var$InlineType;
    }
    destroy() {}
}
class $4fda26bcd679fbcb$var$NodeType {
    constructor(attrs, spec){
        this.attrs = attrs;
        this.spec = spec || $4fda26bcd679fbcb$var$noSpec;
    }
    map(mapping, span, offset, oldOffset) {
        let from = mapping.mapResult(span.from + oldOffset, 1);
        if (from.deleted) return null;
        let to = mapping.mapResult(span.to + oldOffset, -1);
        if (to.deleted || to.pos <= from.pos) return null;
        return new $4fda26bcd679fbcb$export$10e30b733df217ea(from.pos - offset, to.pos - offset, this);
    }
    valid(node, span) {
        let { index: index , offset: offset  } = node.content.findIndex(span.from), child;
        return offset == span.from && !(child = node.child(index)).isText && offset + child.nodeSize == span.to;
    }
    eq(other) {
        return this == other || other instanceof $4fda26bcd679fbcb$var$NodeType && $4fda26bcd679fbcb$var$compareObjs(this.attrs, other.attrs) && $4fda26bcd679fbcb$var$compareObjs(this.spec, other.spec);
    }
    destroy() {}
}
/**
Decoration objects can be provided to the view through the
[`decorations` prop](https://prosemirror.net/docs/ref/#view.EditorProps.decorations). They come in
several variants—see the static members of this class for details.
*/ class $4fda26bcd679fbcb$export$10e30b733df217ea {
    /**
    @internal
    */ constructor(/**
    The start position of the decoration.
    */ from, /**
    The end position. Will be the same as `from` for [widget
    decorations](https://prosemirror.net/docs/ref/#view.Decoration^widget).
    */ to, /**
    @internal
    */ type){
        this.from = from;
        this.to = to;
        this.type = type;
    }
    /**
    @internal
    */ copy(from, to) {
        return new $4fda26bcd679fbcb$export$10e30b733df217ea(from, to, this.type);
    }
    /**
    @internal
    */ eq(other, offset = 0) {
        return this.type.eq(other.type) && this.from + offset == other.from && this.to + offset == other.to;
    }
    /**
    @internal
    */ map(mapping, offset, oldOffset) {
        return this.type.map(mapping, this, offset, oldOffset);
    }
    /**
    Creates a widget decoration, which is a DOM node that's shown in
    the document at the given position. It is recommended that you
    delay rendering the widget by passing a function that will be
    called when the widget is actually drawn in a view, but you can
    also directly pass a DOM node. `getPos` can be used to find the
    widget's current document position.
    */ static widget(pos, toDOM, spec) {
        return new $4fda26bcd679fbcb$export$10e30b733df217ea(pos, pos, new $4fda26bcd679fbcb$var$WidgetType(toDOM, spec));
    }
    /**
    Creates an inline decoration, which adds the given attributes to
    each inline node between `from` and `to`.
    */ static inline(from, to, attrs, spec) {
        return new $4fda26bcd679fbcb$export$10e30b733df217ea(from, to, new $4fda26bcd679fbcb$var$InlineType(attrs, spec));
    }
    /**
    Creates a node decoration. `from` and `to` should point precisely
    before and after a node in the document. That node, and only that
    node, will receive the given attributes.
    */ static node(from, to, attrs, spec) {
        return new $4fda26bcd679fbcb$export$10e30b733df217ea(from, to, new $4fda26bcd679fbcb$var$NodeType(attrs, spec));
    }
    /**
    The spec provided when creating this decoration. Can be useful
    if you've stored extra information in that object.
    */ get spec() {
        return this.type.spec;
    }
    /**
    @internal
    */ get inline() {
        return this.type instanceof $4fda26bcd679fbcb$var$InlineType;
    }
}
const $4fda26bcd679fbcb$var$none = [], $4fda26bcd679fbcb$var$noSpec = {};
/**
A collection of [decorations](https://prosemirror.net/docs/ref/#view.Decoration), organized in such
a way that the drawing algorithm can efficiently use and compare
them. This is a persistent data structure—it is not modified,
updates create a new value.
*/ class $4fda26bcd679fbcb$export$93bf62eb445cec98 {
    /**
    @internal
    */ constructor(local, children){
        this.local = local.length ? local : $4fda26bcd679fbcb$var$none;
        this.children = children.length ? children : $4fda26bcd679fbcb$var$none;
    }
    /**
    Create a set of decorations, using the structure of the given
    document.
    */ static create(doc, decorations) {
        return decorations.length ? $4fda26bcd679fbcb$var$buildTree(decorations, doc, 0, $4fda26bcd679fbcb$var$noSpec) : $4fda26bcd679fbcb$var$empty;
    }
    /**
    Find all decorations in this set which touch the given range
    (including decorations that start or end directly at the
    boundaries) and match the given predicate on their spec. When
    `start` and `end` are omitted, all decorations in the set are
    considered. When `predicate` isn't given, all decorations are
    assumed to match.
    */ find(start, end, predicate) {
        let result = [];
        this.findInner(start == null ? 0 : start, end == null ? 1e9 : end, result, 0, predicate);
        return result;
    }
    findInner(start, end, result, offset, predicate) {
        for(let i = 0; i < this.local.length; i++){
            let span = this.local[i];
            if (span.from <= end && span.to >= start && (!predicate || predicate(span.spec))) result.push(span.copy(span.from + offset, span.to + offset));
        }
        for(let i1 = 0; i1 < this.children.length; i1 += 3)if (this.children[i1] < end && this.children[i1 + 1] > start) {
            let childOff = this.children[i1] + 1;
            this.children[i1 + 2].findInner(start - childOff, end - childOff, result, offset + childOff, predicate);
        }
    }
    /**
    Map the set of decorations in response to a change in the
    document.
    */ map(mapping, doc, options) {
        if (this == $4fda26bcd679fbcb$var$empty || mapping.maps.length == 0) return this;
        return this.mapInner(mapping, doc, 0, 0, options || $4fda26bcd679fbcb$var$noSpec);
    }
    /**
    @internal
    */ mapInner(mapping, node, offset, oldOffset, options) {
        let newLocal;
        for(let i = 0; i < this.local.length; i++){
            let mapped = this.local[i].map(mapping, offset, oldOffset);
            if (mapped && mapped.type.valid(node, mapped)) (newLocal || (newLocal = [])).push(mapped);
            else if (options.onRemove) options.onRemove(this.local[i].spec);
        }
        if (this.children.length) return $4fda26bcd679fbcb$var$mapChildren(this.children, newLocal || [], mapping, node, offset, oldOffset, options);
        else return newLocal ? new $4fda26bcd679fbcb$export$93bf62eb445cec98(newLocal.sort($4fda26bcd679fbcb$var$byPos), $4fda26bcd679fbcb$var$none) : $4fda26bcd679fbcb$var$empty;
    }
    /**
    Add the given array of decorations to the ones in the set,
    producing a new set. Needs access to the current document to
    create the appropriate tree structure.
    */ add(doc, decorations) {
        if (!decorations.length) return this;
        if (this == $4fda26bcd679fbcb$var$empty) return $4fda26bcd679fbcb$export$93bf62eb445cec98.create(doc, decorations);
        return this.addInner(doc, decorations, 0);
    }
    addInner(doc, decorations, offset) {
        let children, childIndex = 0;
        doc.forEach((childNode, childOffset)=>{
            let baseOffset = childOffset + offset, found;
            if (!(found = $4fda26bcd679fbcb$var$takeSpansForNode(decorations, childNode, baseOffset))) return;
            if (!children) children = this.children.slice();
            while(childIndex < children.length && children[childIndex] < childOffset)childIndex += 3;
            if (children[childIndex] == childOffset) children[childIndex + 2] = children[childIndex + 2].addInner(childNode, found, baseOffset + 1);
            else children.splice(childIndex, 0, childOffset, childOffset + childNode.nodeSize, $4fda26bcd679fbcb$var$buildTree(found, childNode, baseOffset + 1, $4fda26bcd679fbcb$var$noSpec));
            childIndex += 3;
        });
        let local = $4fda26bcd679fbcb$var$moveSpans(childIndex ? $4fda26bcd679fbcb$var$withoutNulls(decorations) : decorations, -offset);
        for(let i = 0; i < local.length; i++)if (!local[i].type.valid(doc, local[i])) local.splice(i--, 1);
        return new $4fda26bcd679fbcb$export$93bf62eb445cec98(local.length ? this.local.concat(local).sort($4fda26bcd679fbcb$var$byPos) : this.local, children || this.children);
    }
    /**
    Create a new set that contains the decorations in this set, minus
    the ones in the given array.
    */ remove(decorations) {
        if (decorations.length == 0 || this == $4fda26bcd679fbcb$var$empty) return this;
        return this.removeInner(decorations, 0);
    }
    removeInner(decorations, offset) {
        let children = this.children, local = this.local;
        for(let i = 0; i < children.length; i += 3){
            let found;
            let from = children[i] + offset, to = children[i + 1] + offset;
            for(let j = 0, span; j < decorations.length; j++)if (span = decorations[j]) {
                if (span.from > from && span.to < to) {
                    decorations[j] = null;
                    (found || (found = [])).push(span);
                }
            }
            if (!found) continue;
            if (children == this.children) children = this.children.slice();
            let removed = children[i + 2].removeInner(found, from + 1);
            if (removed != $4fda26bcd679fbcb$var$empty) children[i + 2] = removed;
            else {
                children.splice(i, 3);
                i -= 3;
            }
        }
        if (local.length) {
            for(let i1 = 0, span1; i1 < decorations.length; i1++)if (span1 = decorations[i1]) {
                for(let j1 = 0; j1 < local.length; j1++)if (local[j1].eq(span1, offset)) {
                    if (local == this.local) local = this.local.slice();
                    local.splice(j1--, 1);
                }
            }
        }
        if (children == this.children && local == this.local) return this;
        return local.length || children.length ? new $4fda26bcd679fbcb$export$93bf62eb445cec98(local, children) : $4fda26bcd679fbcb$var$empty;
    }
    /**
    @internal
    */ forChild(offset, node) {
        if (this == $4fda26bcd679fbcb$var$empty) return this;
        if (node.isLeaf) return $4fda26bcd679fbcb$export$93bf62eb445cec98.empty;
        let child, local;
        for(let i = 0; i < this.children.length; i += 3)if (this.children[i] >= offset) {
            if (this.children[i] == offset) child = this.children[i + 2];
            break;
        }
        let start = offset + 1, end = start + node.content.size;
        for(let i1 = 0; i1 < this.local.length; i1++){
            let dec = this.local[i1];
            if (dec.from < end && dec.to > start && dec.type instanceof $4fda26bcd679fbcb$var$InlineType) {
                let from = Math.max(start, dec.from) - start, to = Math.min(end, dec.to) - start;
                if (from < to) (local || (local = [])).push(dec.copy(from, to));
            }
        }
        if (local) {
            let localSet = new $4fda26bcd679fbcb$export$93bf62eb445cec98(local.sort($4fda26bcd679fbcb$var$byPos), $4fda26bcd679fbcb$var$none);
            return child ? new $4fda26bcd679fbcb$var$DecorationGroup([
                localSet,
                child
            ]) : localSet;
        }
        return child || $4fda26bcd679fbcb$var$empty;
    }
    /**
    @internal
    */ eq(other) {
        if (this == other) return true;
        if (!(other instanceof $4fda26bcd679fbcb$export$93bf62eb445cec98) || this.local.length != other.local.length || this.children.length != other.children.length) return false;
        for(let i = 0; i < this.local.length; i++)if (!this.local[i].eq(other.local[i])) return false;
        for(let i1 = 0; i1 < this.children.length; i1 += 3)if (this.children[i1] != other.children[i1] || this.children[i1 + 1] != other.children[i1 + 1] || !this.children[i1 + 2].eq(other.children[i1 + 2])) return false;
        return true;
    }
    /**
    @internal
    */ locals(node) {
        return $4fda26bcd679fbcb$var$removeOverlap(this.localsInner(node));
    }
    /**
    @internal
    */ localsInner(node) {
        if (this == $4fda26bcd679fbcb$var$empty) return $4fda26bcd679fbcb$var$none;
        if (node.inlineContent || !this.local.some($4fda26bcd679fbcb$var$InlineType.is)) return this.local;
        let result = [];
        for(let i = 0; i < this.local.length; i++)if (!(this.local[i].type instanceof $4fda26bcd679fbcb$var$InlineType)) result.push(this.local[i]);
        return result;
    }
}
/**
The empty set of decorations.
*/ $4fda26bcd679fbcb$export$93bf62eb445cec98.empty = new $4fda26bcd679fbcb$export$93bf62eb445cec98([], []);
/**
@internal
*/ $4fda26bcd679fbcb$export$93bf62eb445cec98.removeOverlap = $4fda26bcd679fbcb$var$removeOverlap;
const $4fda26bcd679fbcb$var$empty = $4fda26bcd679fbcb$export$93bf62eb445cec98.empty;
// An abstraction that allows the code dealing with decorations to
// treat multiple DecorationSet objects as if it were a single object
// with (a subset of) the same interface.
class $4fda26bcd679fbcb$var$DecorationGroup {
    constructor(members){
        this.members = members;
    }
    map(mapping, doc) {
        const mappedDecos = this.members.map((member)=>member.map(mapping, doc, $4fda26bcd679fbcb$var$noSpec));
        return $4fda26bcd679fbcb$var$DecorationGroup.from(mappedDecos);
    }
    forChild(offset, child) {
        if (child.isLeaf) return $4fda26bcd679fbcb$export$93bf62eb445cec98.empty;
        let found = [];
        for(let i = 0; i < this.members.length; i++){
            let result = this.members[i].forChild(offset, child);
            if (result == $4fda26bcd679fbcb$var$empty) continue;
            if (result instanceof $4fda26bcd679fbcb$var$DecorationGroup) found = found.concat(result.members);
            else found.push(result);
        }
        return $4fda26bcd679fbcb$var$DecorationGroup.from(found);
    }
    eq(other) {
        if (!(other instanceof $4fda26bcd679fbcb$var$DecorationGroup) || other.members.length != this.members.length) return false;
        for(let i = 0; i < this.members.length; i++)if (!this.members[i].eq(other.members[i])) return false;
        return true;
    }
    locals(node) {
        let result, sorted = true;
        for(let i = 0; i < this.members.length; i++){
            let locals = this.members[i].localsInner(node);
            if (!locals.length) continue;
            if (!result) result = locals;
            else {
                if (sorted) {
                    result = result.slice();
                    sorted = false;
                }
                for(let j = 0; j < locals.length; j++)result.push(locals[j]);
            }
        }
        return result ? $4fda26bcd679fbcb$var$removeOverlap(sorted ? result : result.sort($4fda26bcd679fbcb$var$byPos)) : $4fda26bcd679fbcb$var$none;
    }
    // Create a group for the given array of decoration sets, or return
    // a single set when possible.
    static from(members) {
        switch(members.length){
            case 0:
                return $4fda26bcd679fbcb$var$empty;
            case 1:
                return members[0];
            default:
                return new $4fda26bcd679fbcb$var$DecorationGroup(members.every((m)=>m instanceof $4fda26bcd679fbcb$export$93bf62eb445cec98) ? members : members.reduce((r, m)=>r.concat(m instanceof $4fda26bcd679fbcb$export$93bf62eb445cec98 ? m : m.members), []));
        }
    }
}
function $4fda26bcd679fbcb$var$mapChildren(oldChildren, newLocal, mapping, node, offset, oldOffset, options) {
    let children = oldChildren.slice();
    // Mark the children that are directly touched by changes, and
    // move those that are after the changes.
    for(let i = 0, baseOffset = oldOffset; i < mapping.maps.length; i++){
        let moved = 0;
        mapping.maps[i].forEach((oldStart, oldEnd, newStart, newEnd)=>{
            let dSize = newEnd - newStart - (oldEnd - oldStart);
            for(let i = 0; i < children.length; i += 3){
                let end = children[i + 1];
                if (end < 0 || oldStart > end + baseOffset - moved) continue;
                let start = children[i] + baseOffset - moved;
                if (oldEnd >= start) children[i + 1] = oldStart <= start ? -2 : -1;
                else if (newStart >= offset && dSize) {
                    children[i] += dSize;
                    children[i + 1] += dSize;
                }
            }
            moved += dSize;
        });
        baseOffset = mapping.maps[i].map(baseOffset, -1);
    }
    // Find the child nodes that still correspond to a single node,
    // recursively call mapInner on them and update their positions.
    let mustRebuild = false;
    for(let i1 = 0; i1 < children.length; i1 += 3)if (children[i1 + 1] < 0) {
        if (children[i1 + 1] == -2) {
            mustRebuild = true;
            children[i1 + 1] = -1;
            continue;
        }
        let from = mapping.map(oldChildren[i1] + oldOffset), fromLocal = from - offset;
        if (fromLocal < 0 || fromLocal >= node.content.size) {
            mustRebuild = true;
            continue;
        }
        // Must read oldChildren because children was tagged with -1
        let to = mapping.map(oldChildren[i1 + 1] + oldOffset, -1), toLocal = to - offset;
        let { index: index , offset: childOffset  } = node.content.findIndex(fromLocal);
        let childNode = node.maybeChild(index);
        if (childNode && childOffset == fromLocal && childOffset + childNode.nodeSize == toLocal) {
            let mapped = children[i1 + 2].mapInner(mapping, childNode, from + 1, oldChildren[i1] + oldOffset + 1, options);
            if (mapped != $4fda26bcd679fbcb$var$empty) {
                children[i1] = fromLocal;
                children[i1 + 1] = toLocal;
                children[i1 + 2] = mapped;
            } else {
                children[i1 + 1] = -2;
                mustRebuild = true;
            }
        } else mustRebuild = true;
    }
    // Remaining children must be collected and rebuilt into the appropriate structure
    if (mustRebuild) {
        let decorations = $4fda26bcd679fbcb$var$mapAndGatherRemainingDecorations(children, oldChildren, newLocal, mapping, offset, oldOffset, options);
        let built = $4fda26bcd679fbcb$var$buildTree(decorations, node, 0, options);
        newLocal = built.local;
        for(let i2 = 0; i2 < children.length; i2 += 3)if (children[i2 + 1] < 0) {
            children.splice(i2, 3);
            i2 -= 3;
        }
        for(let i3 = 0, j = 0; i3 < built.children.length; i3 += 3){
            let from1 = built.children[i3];
            while(j < children.length && children[j] < from1)j += 3;
            children.splice(j, 0, built.children[i3], built.children[i3 + 1], built.children[i3 + 2]);
        }
    }
    return new $4fda26bcd679fbcb$export$93bf62eb445cec98(newLocal.sort($4fda26bcd679fbcb$var$byPos), children);
}
function $4fda26bcd679fbcb$var$moveSpans(spans, offset) {
    if (!offset || !spans.length) return spans;
    let result = [];
    for(let i = 0; i < spans.length; i++){
        let span = spans[i];
        result.push(new $4fda26bcd679fbcb$export$10e30b733df217ea(span.from + offset, span.to + offset, span.type));
    }
    return result;
}
function $4fda26bcd679fbcb$var$mapAndGatherRemainingDecorations(children, oldChildren, decorations, mapping, offset, oldOffset, options) {
    // Gather all decorations from the remaining marked children
    function gather(set, oldOffset) {
        for(let i = 0; i < set.local.length; i++){
            let mapped = set.local[i].map(mapping, offset, oldOffset);
            if (mapped) decorations.push(mapped);
            else if (options.onRemove) options.onRemove(set.local[i].spec);
        }
        for(let i1 = 0; i1 < set.children.length; i1 += 3)gather(set.children[i1 + 2], set.children[i1] + oldOffset + 1);
    }
    for(let i = 0; i < children.length; i += 3)if (children[i + 1] == -1) gather(children[i + 2], oldChildren[i] + oldOffset + 1);
    return decorations;
}
function $4fda26bcd679fbcb$var$takeSpansForNode(spans, node, offset) {
    if (node.isLeaf) return null;
    let end = offset + node.nodeSize, found = null;
    for(let i = 0, span; i < spans.length; i++)if ((span = spans[i]) && span.from > offset && span.to < end) {
        (found || (found = [])).push(span);
        spans[i] = null;
    }
    return found;
}
function $4fda26bcd679fbcb$var$withoutNulls(array) {
    let result = [];
    for(let i = 0; i < array.length; i++)if (array[i] != null) result.push(array[i]);
    return result;
}
// Build up a tree that corresponds to a set of decorations. `offset`
// is a base offset that should be subtracted from the `from` and `to`
// positions in the spans (so that we don't have to allocate new spans
// for recursive calls).
function $4fda26bcd679fbcb$var$buildTree(spans, node, offset, options) {
    let children = [], hasNulls = false;
    node.forEach((childNode, localStart)=>{
        let found = $4fda26bcd679fbcb$var$takeSpansForNode(spans, childNode, localStart + offset);
        if (found) {
            hasNulls = true;
            let subtree = $4fda26bcd679fbcb$var$buildTree(found, childNode, offset + localStart + 1, options);
            if (subtree != $4fda26bcd679fbcb$var$empty) children.push(localStart, localStart + childNode.nodeSize, subtree);
        }
    });
    let locals = $4fda26bcd679fbcb$var$moveSpans(hasNulls ? $4fda26bcd679fbcb$var$withoutNulls(spans) : spans, -offset).sort($4fda26bcd679fbcb$var$byPos);
    for(let i = 0; i < locals.length; i++)if (!locals[i].type.valid(node, locals[i])) {
        if (options.onRemove) options.onRemove(locals[i].spec);
        locals.splice(i--, 1);
    }
    return locals.length || children.length ? new $4fda26bcd679fbcb$export$93bf62eb445cec98(locals, children) : $4fda26bcd679fbcb$var$empty;
}
// Used to sort decorations so that ones with a low start position
// come first, and within a set with the same start position, those
// with an smaller end position come first.
function $4fda26bcd679fbcb$var$byPos(a, b) {
    return a.from - b.from || a.to - b.to;
}
// Scan a sorted array of decorations for partially overlapping spans,
// and split those so that only fully overlapping spans are left (to
// make subsequent rendering easier). Will return the input array if
// no partially overlapping spans are found (the common case).
function $4fda26bcd679fbcb$var$removeOverlap(spans) {
    let working = spans;
    for(let i = 0; i < working.length - 1; i++){
        let span = working[i];
        if (span.from != span.to) for(let j = i + 1; j < working.length; j++){
            let next = working[j];
            if (next.from == span.from) {
                if (next.to != span.to) {
                    if (working == spans) working = spans.slice();
                    // Followed by a partially overlapping larger span. Split that
                    // span.
                    working[j] = next.copy(next.from, span.to);
                    $4fda26bcd679fbcb$var$insertAhead(working, j + 1, next.copy(span.to, next.to));
                }
                continue;
            } else {
                if (next.from < span.to) {
                    if (working == spans) working = spans.slice();
                    // The end of this one overlaps with a subsequent span. Split
                    // this one.
                    working[i] = span.copy(span.from, next.from);
                    $4fda26bcd679fbcb$var$insertAhead(working, j, span.copy(next.from, span.to));
                }
                break;
            }
        }
    }
    return working;
}
function $4fda26bcd679fbcb$var$insertAhead(array, i, deco) {
    while(i < array.length && $4fda26bcd679fbcb$var$byPos(deco, array[i]) > 0)i++;
    array.splice(i, 0, deco);
}
// Get the decorations associated with the current props of a view.
function $4fda26bcd679fbcb$var$viewDecorations(view) {
    let found = [];
    view.someProp("decorations", (f)=>{
        let result = f(view.state);
        if (result && result != $4fda26bcd679fbcb$var$empty) found.push(result);
    });
    if (view.cursorWrapper) found.push($4fda26bcd679fbcb$export$93bf62eb445cec98.create(view.state.doc, [
        view.cursorWrapper.deco
    ]));
    return $4fda26bcd679fbcb$var$DecorationGroup.from(found);
}
const $4fda26bcd679fbcb$var$observeOptions = {
    childList: true,
    characterData: true,
    characterDataOldValue: true,
    attributes: true,
    attributeOldValue: true,
    subtree: true
};
// IE11 has very broken mutation observers, so we also listen to DOMCharacterDataModified
const $4fda26bcd679fbcb$var$useCharData = $4fda26bcd679fbcb$var$ie && $4fda26bcd679fbcb$var$ie_version <= 11;
class $4fda26bcd679fbcb$var$SelectionState {
    constructor(){
        this.anchorNode = null;
        this.anchorOffset = 0;
        this.focusNode = null;
        this.focusOffset = 0;
    }
    set(sel) {
        this.anchorNode = sel.anchorNode;
        this.anchorOffset = sel.anchorOffset;
        this.focusNode = sel.focusNode;
        this.focusOffset = sel.focusOffset;
    }
    clear() {
        this.anchorNode = this.focusNode = null;
    }
    eq(sel) {
        return sel.anchorNode == this.anchorNode && sel.anchorOffset == this.anchorOffset && sel.focusNode == this.focusNode && sel.focusOffset == this.focusOffset;
    }
}
class $4fda26bcd679fbcb$var$DOMObserver {
    constructor(view, handleDOMChange){
        this.view = view;
        this.handleDOMChange = handleDOMChange;
        this.queue = [];
        this.flushingSoon = -1;
        this.observer = null;
        this.currentSelection = new $4fda26bcd679fbcb$var$SelectionState;
        this.onCharData = null;
        this.suppressingSelectionUpdates = false;
        this.observer = window.MutationObserver && new window.MutationObserver((mutations)=>{
            for(let i = 0; i < mutations.length; i++)this.queue.push(mutations[i]);
            // IE11 will sometimes (on backspacing out a single character
            // text node after a BR node) call the observer callback
            // before actually updating the DOM, which will cause
            // ProseMirror to miss the change (see #930)
            if ($4fda26bcd679fbcb$var$ie && $4fda26bcd679fbcb$var$ie_version <= 11 && mutations.some((m)=>m.type == "childList" && m.removedNodes.length || m.type == "characterData" && m.oldValue.length > m.target.nodeValue.length)) this.flushSoon();
            else this.flush();
        });
        if ($4fda26bcd679fbcb$var$useCharData) this.onCharData = (e)=>{
            this.queue.push({
                target: e.target,
                type: "characterData",
                oldValue: e.prevValue
            });
            this.flushSoon();
        };
        this.onSelectionChange = this.onSelectionChange.bind(this);
    }
    flushSoon() {
        if (this.flushingSoon < 0) this.flushingSoon = window.setTimeout(()=>{
            this.flushingSoon = -1;
            this.flush();
        }, 20);
    }
    forceFlush() {
        if (this.flushingSoon > -1) {
            window.clearTimeout(this.flushingSoon);
            this.flushingSoon = -1;
            this.flush();
        }
    }
    start() {
        if (this.observer) {
            this.observer.takeRecords();
            this.observer.observe(this.view.dom, $4fda26bcd679fbcb$var$observeOptions);
        }
        if (this.onCharData) this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData);
        this.connectSelection();
    }
    stop() {
        if (this.observer) {
            let take = this.observer.takeRecords();
            if (take.length) {
                for(let i = 0; i < take.length; i++)this.queue.push(take[i]);
                window.setTimeout(()=>this.flush(), 20);
            }
            this.observer.disconnect();
        }
        if (this.onCharData) this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData);
        this.disconnectSelection();
    }
    connectSelection() {
        this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
    }
    disconnectSelection() {
        this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
    }
    suppressSelectionUpdates() {
        this.suppressingSelectionUpdates = true;
        setTimeout(()=>this.suppressingSelectionUpdates = false, 50);
    }
    onSelectionChange() {
        if (!$4fda26bcd679fbcb$var$hasFocusAndSelection(this.view)) return;
        if (this.suppressingSelectionUpdates) return $4fda26bcd679fbcb$var$selectionToDOM(this.view);
        // Deletions on IE11 fire their events in the wrong order, giving
        // us a selection change event before the DOM changes are
        // reported.
        if ($4fda26bcd679fbcb$var$ie && $4fda26bcd679fbcb$var$ie_version <= 11 && !this.view.state.selection.empty) {
            let sel = this.view.domSelectionRange();
            // Selection.isCollapsed isn't reliable on IE
            if (sel.focusNode && $4fda26bcd679fbcb$var$isEquivalentPosition(sel.focusNode, sel.focusOffset, sel.anchorNode, sel.anchorOffset)) return this.flushSoon();
        }
        this.flush();
    }
    setCurSelection() {
        this.currentSelection.set(this.view.domSelectionRange());
    }
    ignoreSelectionChange(sel) {
        if (!sel.focusNode) return true;
        let ancestors = new Set, container;
        for(let scan = sel.focusNode; scan; scan = $4fda26bcd679fbcb$var$parentNode(scan))ancestors.add(scan);
        for(let scan1 = sel.anchorNode; scan1; scan1 = $4fda26bcd679fbcb$var$parentNode(scan1))if (ancestors.has(scan1)) {
            container = scan1;
            break;
        }
        let desc = container && this.view.docView.nearestDesc(container);
        if (desc && desc.ignoreMutation({
            type: "selection",
            target: container.nodeType == 3 ? container.parentNode : container
        })) {
            this.setCurSelection();
            return true;
        }
    }
    flush() {
        let { view: view  } = this;
        if (!view.docView || this.flushingSoon > -1) return;
        let mutations = this.observer ? this.observer.takeRecords() : [];
        if (this.queue.length) {
            mutations = this.queue.concat(mutations);
            this.queue.length = 0;
        }
        let sel = view.domSelectionRange();
        let newSel = !this.suppressingSelectionUpdates && !this.currentSelection.eq(sel) && $4fda26bcd679fbcb$var$hasFocusAndSelection(view) && !this.ignoreSelectionChange(sel);
        let from = -1, to = -1, typeOver = false, added = [];
        if (view.editable) for(let i = 0; i < mutations.length; i++){
            let result = this.registerMutation(mutations[i], added);
            if (result) {
                from = from < 0 ? result.from : Math.min(result.from, from);
                to = to < 0 ? result.to : Math.max(result.to, to);
                if (result.typeOver) typeOver = true;
            }
        }
        if ($4fda26bcd679fbcb$var$gecko && added.length > 1) {
            let brs = added.filter((n)=>n.nodeName == "BR");
            if (brs.length == 2) {
                let a = brs[0], b = brs[1];
                if (a.parentNode && a.parentNode.parentNode == b.parentNode) b.remove();
                else a.remove();
            }
        }
        let readSel = null;
        // If it looks like the browser has reset the selection to the
        // start of the document after focus, restore the selection from
        // the state
        if (from < 0 && newSel && view.input.lastFocus > Date.now() - 200 && view.input.lastTouch < Date.now() - 300 && $4fda26bcd679fbcb$var$selectionCollapsed(sel) && (readSel = $4fda26bcd679fbcb$var$selectionFromDOM(view)) && readSel.eq((0, $ee27db283572d394$export$52baac22726c72bf).near(view.state.doc.resolve(0), 1))) {
            view.input.lastFocus = 0;
            $4fda26bcd679fbcb$var$selectionToDOM(view);
            this.currentSelection.set(sel);
            view.scrollToSelection();
        } else if (from > -1 || newSel) {
            if (from > -1) {
                view.docView.markDirty(from, to);
                $4fda26bcd679fbcb$var$checkCSS(view);
            }
            this.handleDOMChange(from, to, typeOver, added);
            if (view.docView && view.docView.dirty) view.updateState(view.state);
            else if (!this.currentSelection.eq(sel)) $4fda26bcd679fbcb$var$selectionToDOM(view);
            this.currentSelection.set(sel);
        }
    }
    registerMutation(mut, added) {
        // Ignore mutations inside nodes that were already noted as inserted
        if (added.indexOf(mut.target) > -1) return null;
        let desc = this.view.docView.nearestDesc(mut.target);
        if (mut.type == "attributes" && (desc == this.view.docView || mut.attributeName == "contenteditable" || // Firefox sometimes fires spurious events for null/empty styles
        mut.attributeName == "style" && !mut.oldValue && !mut.target.getAttribute("style"))) return null;
        if (!desc || desc.ignoreMutation(mut)) return null;
        if (mut.type == "childList") {
            for(let i = 0; i < mut.addedNodes.length; i++)added.push(mut.addedNodes[i]);
            if (desc.contentDOM && desc.contentDOM != desc.dom && !desc.contentDOM.contains(mut.target)) return {
                from: desc.posBefore,
                to: desc.posAfter
            };
            let prev = mut.previousSibling, next = mut.nextSibling;
            if ($4fda26bcd679fbcb$var$ie && $4fda26bcd679fbcb$var$ie_version <= 11 && mut.addedNodes.length) // IE11 gives us incorrect next/prev siblings for some
            // insertions, so if there are added nodes, recompute those
            for(let i1 = 0; i1 < mut.addedNodes.length; i1++){
                let { previousSibling: previousSibling , nextSibling: nextSibling  } = mut.addedNodes[i1];
                if (!previousSibling || Array.prototype.indexOf.call(mut.addedNodes, previousSibling) < 0) prev = previousSibling;
                if (!nextSibling || Array.prototype.indexOf.call(mut.addedNodes, nextSibling) < 0) next = nextSibling;
            }
            let fromOffset = prev && prev.parentNode == mut.target ? $4fda26bcd679fbcb$var$domIndex(prev) + 1 : 0;
            let from = desc.localPosFromDOM(mut.target, fromOffset, -1);
            let toOffset = next && next.parentNode == mut.target ? $4fda26bcd679fbcb$var$domIndex(next) : mut.target.childNodes.length;
            let to = desc.localPosFromDOM(mut.target, toOffset, 1);
            return {
                from: from,
                to: to
            };
        } else if (mut.type == "attributes") return {
            from: desc.posAtStart - desc.border,
            to: desc.posAtEnd + desc.border
        };
        else return {
            from: desc.posAtStart,
            to: desc.posAtEnd,
            // An event was generated for a text change that didn't change
            // any text. Mark the dom change to fall back to assuming the
            // selection was typed over with an identical value if it can't
            // find another change.
            typeOver: mut.target.nodeValue == mut.oldValue
        };
    }
}
let $4fda26bcd679fbcb$var$cssChecked = new WeakMap();
let $4fda26bcd679fbcb$var$cssCheckWarned = false;
function $4fda26bcd679fbcb$var$checkCSS(view) {
    if ($4fda26bcd679fbcb$var$cssChecked.has(view)) return;
    $4fda26bcd679fbcb$var$cssChecked.set(view, null);
    if ([
        "normal",
        "nowrap",
        "pre-line"
    ].indexOf(getComputedStyle(view.dom).whiteSpace) !== -1) {
        view.requiresGeckoHackNode = $4fda26bcd679fbcb$var$gecko;
        if ($4fda26bcd679fbcb$var$cssCheckWarned) return;
        console["warn"]("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package.");
        $4fda26bcd679fbcb$var$cssCheckWarned = true;
    }
}
// Used to work around a Safari Selection/shadow DOM bug
// Based on https://github.com/codemirror/dev/issues/414 fix
function $4fda26bcd679fbcb$var$safariShadowSelectionRange(view) {
    let found;
    function read(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        found = event.getTargetRanges()[0];
    }
    // Because Safari (at least in 2018-2022) doesn't provide regular
    // access to the selection inside a shadowRoot, we have to perform a
    // ridiculous hack to get at it—using `execCommand` to trigger a
    // `beforeInput` event so that we can read the target range from the
    // event.
    view.dom.addEventListener("beforeinput", read, true);
    document.execCommand("indent");
    view.dom.removeEventListener("beforeinput", read, true);
    let anchorNode = found.startContainer, anchorOffset = found.startOffset;
    let focusNode = found.endContainer, focusOffset = found.endOffset;
    let currentAnchor = view.domAtPos(view.state.selection.anchor);
    // Since such a range doesn't distinguish between anchor and head,
    // use a heuristic that flips it around if its end matches the
    // current anchor.
    if ($4fda26bcd679fbcb$var$isEquivalentPosition(currentAnchor.node, currentAnchor.offset, focusNode, focusOffset)) [anchorNode, anchorOffset, focusNode, focusOffset] = [
        focusNode,
        focusOffset,
        anchorNode,
        anchorOffset
    ];
    return {
        anchorNode: anchorNode,
        anchorOffset: anchorOffset,
        focusNode: focusNode,
        focusOffset: focusOffset
    };
}
// Note that all referencing and parsing is done with the
// start-of-operation selection and document, since that's the one
// that the DOM represents. If any changes came in in the meantime,
// the modification is mapped over those before it is applied, in
// readDOMChange.
function $4fda26bcd679fbcb$var$parseBetween(view, from_, to_) {
    let { node: parent , fromOffset: fromOffset , toOffset: toOffset , from: from , to: to  } = view.docView.parseRange(from_, to_);
    let domSel = view.domSelectionRange();
    let find;
    let anchor = domSel.anchorNode;
    if (anchor && view.dom.contains(anchor.nodeType == 1 ? anchor : anchor.parentNode)) {
        find = [
            {
                node: anchor,
                offset: domSel.anchorOffset
            }
        ];
        if (!$4fda26bcd679fbcb$var$selectionCollapsed(domSel)) find.push({
            node: domSel.focusNode,
            offset: domSel.focusOffset
        });
    }
    // Work around issue in Chrome where backspacing sometimes replaces
    // the deleted content with a random BR node (issues #799, #831)
    if ($4fda26bcd679fbcb$var$chrome && view.input.lastKeyCode === 8) for(let off = toOffset; off > fromOffset; off--){
        let node = parent.childNodes[off - 1], desc = node.pmViewDesc;
        if (node.nodeName == "BR" && !desc) {
            toOffset = off;
            break;
        }
        if (!desc || desc.size) break;
    }
    let startDoc = view.state.doc;
    let parser = view.someProp("domParser") || (0, $c8d507d90382f091$export$1059c6e7d2ce5669).fromSchema(view.state.schema);
    let $from = startDoc.resolve(from);
    let sel = null, doc = parser.parse(parent, {
        topNode: $from.parent,
        topMatch: $from.parent.contentMatchAt($from.index()),
        topOpen: true,
        from: fromOffset,
        to: toOffset,
        preserveWhitespace: $from.parent.type.whitespace == "pre" ? "full" : true,
        findPositions: find,
        ruleFromNode: $4fda26bcd679fbcb$var$ruleFromNode,
        context: $from
    });
    if (find && find[0].pos != null) {
        let anchor1 = find[0].pos, head = find[1] && find[1].pos;
        if (head == null) head = anchor1;
        sel = {
            anchor: anchor1 + from,
            head: head + from
        };
    }
    return {
        doc: doc,
        sel: sel,
        from: from,
        to: to
    };
}
function $4fda26bcd679fbcb$var$ruleFromNode(dom) {
    let desc = dom.pmViewDesc;
    if (desc) return desc.parseRule();
    else if (dom.nodeName == "BR" && dom.parentNode) {
        // Safari replaces the list item or table cell with a BR
        // directly in the list node (?!) if you delete the last
        // character in a list item or table cell (#708, #862)
        if ($4fda26bcd679fbcb$var$safari && /^(ul|ol)$/i.test(dom.parentNode.nodeName)) {
            let skip = document.createElement("div");
            skip.appendChild(document.createElement("li"));
            return {
                skip: skip
            };
        } else if (dom.parentNode.lastChild == dom || $4fda26bcd679fbcb$var$safari && /^(tr|table)$/i.test(dom.parentNode.nodeName)) return {
            ignore: true
        };
    } else if (dom.nodeName == "IMG" && dom.getAttribute("mark-placeholder")) return {
        ignore: true
    };
    return null;
}
function $4fda26bcd679fbcb$var$readDOMChange(view, from, to, typeOver, addedNodes) {
    if (from < 0) {
        let origin = view.input.lastSelectionTime > Date.now() - 50 ? view.input.lastSelectionOrigin : null;
        let newSel = $4fda26bcd679fbcb$var$selectionFromDOM(view, origin);
        if (newSel && !view.state.selection.eq(newSel)) {
            let tr = view.state.tr.setSelection(newSel);
            if (origin == "pointer") tr.setMeta("pointer", true);
            else if (origin == "key") tr.scrollIntoView();
            view.dispatch(tr);
        }
        return;
    }
    let $before = view.state.doc.resolve(from);
    let shared = $before.sharedDepth(to);
    from = $before.before(shared + 1);
    to = view.state.doc.resolve(to).after(shared + 1);
    let sel = view.state.selection;
    let parse = $4fda26bcd679fbcb$var$parseBetween(view, from, to);
    let doc = view.state.doc, compare = doc.slice(parse.from, parse.to);
    let preferredPos, preferredSide;
    // Prefer anchoring to end when Backspace is pressed
    if (view.input.lastKeyCode === 8 && Date.now() - 100 < view.input.lastKeyCodeTime) {
        preferredPos = view.state.selection.to;
        preferredSide = "end";
    } else {
        preferredPos = view.state.selection.from;
        preferredSide = "start";
    }
    view.input.lastKeyCode = null;
    let change = $4fda26bcd679fbcb$var$findDiff(compare.content, parse.doc.content, parse.from, preferredPos, preferredSide);
    if (($4fda26bcd679fbcb$var$ios && view.input.lastIOSEnter > Date.now() - 225 || $4fda26bcd679fbcb$var$android) && addedNodes.some((n)=>n.nodeName == "DIV" || n.nodeName == "P" || n.nodeName == "LI") && (!change || change.endA >= change.endB) && view.someProp("handleKeyDown", (f)=>f(view, $4fda26bcd679fbcb$var$keyEvent(13, "Enter")))) {
        view.input.lastIOSEnter = 0;
        return;
    }
    if (!change) {
        if (typeOver && sel instanceof (0, $ee27db283572d394$export$c2b25f346d19bcbb) && !sel.empty && sel.$head.sameParent(sel.$anchor) && !view.composing && !(parse.sel && parse.sel.anchor != parse.sel.head)) change = {
            start: sel.from,
            endA: sel.to,
            endB: sel.to
        };
        else {
            if (parse.sel) {
                let sel1 = $4fda26bcd679fbcb$var$resolveSelection(view, view.state.doc, parse.sel);
                if (sel1 && !sel1.eq(view.state.selection)) view.dispatch(view.state.tr.setSelection(sel1));
            }
            return;
        }
    }
    // Chrome sometimes leaves the cursor before the inserted text when
    // composing after a cursor wrapper. This moves it forward.
    if ($4fda26bcd679fbcb$var$chrome && view.cursorWrapper && parse.sel && parse.sel.anchor == view.cursorWrapper.deco.from && parse.sel.head == parse.sel.anchor) {
        let size = change.endB - change.start;
        parse.sel = {
            anchor: parse.sel.anchor + size,
            head: parse.sel.anchor + size
        };
    }
    view.input.domChangeCount++;
    // Handle the case where overwriting a selection by typing matches
    // the start or end of the selected content, creating a change
    // that's smaller than what was actually overwritten.
    if (view.state.selection.from < view.state.selection.to && change.start == change.endB && view.state.selection instanceof (0, $ee27db283572d394$export$c2b25f346d19bcbb)) {
        if (change.start > view.state.selection.from && change.start <= view.state.selection.from + 2 && view.state.selection.from >= parse.from) change.start = view.state.selection.from;
        else if (change.endA < view.state.selection.to && change.endA >= view.state.selection.to - 2 && view.state.selection.to <= parse.to) {
            change.endB += view.state.selection.to - change.endA;
            change.endA = view.state.selection.to;
        }
    }
    // IE11 will insert a non-breaking space _ahead_ of the space after
    // the cursor space when adding a space before another space. When
    // that happened, adjust the change to cover the space instead.
    if ($4fda26bcd679fbcb$var$ie && $4fda26bcd679fbcb$var$ie_version <= 11 && change.endB == change.start + 1 && change.endA == change.start && change.start > parse.from && parse.doc.textBetween(change.start - parse.from - 1, change.start - parse.from + 1) == " \xa0") {
        change.start--;
        change.endA--;
        change.endB--;
    }
    let $from = parse.doc.resolveNoCache(change.start - parse.from);
    let $to = parse.doc.resolveNoCache(change.endB - parse.from);
    let $fromA = doc.resolve(change.start);
    let inlineChange = $from.sameParent($to) && $from.parent.inlineContent && $fromA.end() >= change.endA;
    let nextSel;
    // If this looks like the effect of pressing Enter (or was recorded
    // as being an iOS enter press), just dispatch an Enter key instead.
    if (($4fda26bcd679fbcb$var$ios && view.input.lastIOSEnter > Date.now() - 225 && (!inlineChange || addedNodes.some((n)=>n.nodeName == "DIV" || n.nodeName == "P")) || !inlineChange && $from.pos < parse.doc.content.size && (nextSel = (0, $ee27db283572d394$export$52baac22726c72bf).findFrom(parse.doc.resolve($from.pos + 1), 1, true)) && nextSel.head == $to.pos) && view.someProp("handleKeyDown", (f)=>f(view, $4fda26bcd679fbcb$var$keyEvent(13, "Enter")))) {
        view.input.lastIOSEnter = 0;
        return;
    }
    // Same for backspace
    if (view.state.selection.anchor > change.start && $4fda26bcd679fbcb$var$looksLikeJoin(doc, change.start, change.endA, $from, $to) && view.someProp("handleKeyDown", (f)=>f(view, $4fda26bcd679fbcb$var$keyEvent(8, "Backspace")))) {
        if ($4fda26bcd679fbcb$var$android && $4fda26bcd679fbcb$var$chrome) view.domObserver.suppressSelectionUpdates(); // #820
        return;
    }
    // Chrome Android will occasionally, during composition, delete the
    // entire composition and then immediately insert it again. This is
    // used to detect that situation.
    if ($4fda26bcd679fbcb$var$chrome && $4fda26bcd679fbcb$var$android && change.endB == change.start) view.input.lastAndroidDelete = Date.now();
    // This tries to detect Android virtual keyboard
    // enter-and-pick-suggestion action. That sometimes (see issue
    // #1059) first fires a DOM mutation, before moving the selection to
    // the newly created block. And then, because ProseMirror cleans up
    // the DOM selection, it gives up moving the selection entirely,
    // leaving the cursor in the wrong place. When that happens, we drop
    // the new paragraph from the initial change, and fire a simulated
    // enter key afterwards.
    if ($4fda26bcd679fbcb$var$android && !inlineChange && $from.start() != $to.start() && $to.parentOffset == 0 && $from.depth == $to.depth && parse.sel && parse.sel.anchor == parse.sel.head && parse.sel.head == change.endA) {
        change.endB -= 2;
        $to = parse.doc.resolveNoCache(change.endB - parse.from);
        setTimeout(()=>{
            view.someProp("handleKeyDown", function(f) {
                return f(view, $4fda26bcd679fbcb$var$keyEvent(13, "Enter"));
            });
        }, 20);
    }
    let chFrom = change.start, chTo = change.endA;
    let tr1, storedMarks, markChange;
    if (inlineChange) {
        if ($from.pos == $to.pos) {
            // IE11 sometimes weirdly moves the DOM selection around after
            // backspacing out the first element in a textblock
            if ($4fda26bcd679fbcb$var$ie && $4fda26bcd679fbcb$var$ie_version <= 11 && $from.parentOffset == 0) {
                view.domObserver.suppressSelectionUpdates();
                setTimeout(()=>$4fda26bcd679fbcb$var$selectionToDOM(view), 20);
            }
            tr1 = view.state.tr.delete(chFrom, chTo);
            storedMarks = doc.resolve(change.start).marksAcross(doc.resolve(change.endA));
        } else if (change.endA == change.endB && (markChange = $4fda26bcd679fbcb$var$isMarkChange($from.parent.content.cut($from.parentOffset, $to.parentOffset), $fromA.parent.content.cut($fromA.parentOffset, change.endA - $fromA.start())))) {
            tr1 = view.state.tr;
            if (markChange.type == "add") tr1.addMark(chFrom, chTo, markChange.mark);
            else tr1.removeMark(chFrom, chTo, markChange.mark);
        } else if ($from.parent.child($from.index()).isText && $from.index() == $to.index() - ($to.textOffset ? 0 : 1)) {
            // Both positions in the same text node -- simply insert text
            let text = $from.parent.textBetween($from.parentOffset, $to.parentOffset);
            if (view.someProp("handleTextInput", (f)=>f(view, chFrom, chTo, text))) return;
            tr1 = view.state.tr.insertText(text, chFrom, chTo);
        }
    }
    if (!tr1) tr1 = view.state.tr.replace(chFrom, chTo, parse.doc.slice(change.start - parse.from, change.endB - parse.from));
    if (parse.sel) {
        let sel2 = $4fda26bcd679fbcb$var$resolveSelection(view, tr1.doc, parse.sel);
        // Chrome Android will sometimes, during composition, report the
        // selection in the wrong place. If it looks like that is
        // happening, don't update the selection.
        // Edge just doesn't move the cursor forward when you start typing
        // in an empty block or between br nodes.
        if (sel2 && !($4fda26bcd679fbcb$var$chrome && $4fda26bcd679fbcb$var$android && view.composing && sel2.empty && (change.start != change.endB || view.input.lastAndroidDelete < Date.now() - 100) && (sel2.head == chFrom || sel2.head == tr1.mapping.map(chTo) - 1) || $4fda26bcd679fbcb$var$ie && sel2.empty && sel2.head == chFrom)) tr1.setSelection(sel2);
    }
    if (storedMarks) tr1.ensureMarks(storedMarks);
    view.dispatch(tr1.scrollIntoView());
}
function $4fda26bcd679fbcb$var$resolveSelection(view, doc, parsedSel) {
    if (Math.max(parsedSel.anchor, parsedSel.head) > doc.content.size) return null;
    return $4fda26bcd679fbcb$var$selectionBetween(view, doc.resolve(parsedSel.anchor), doc.resolve(parsedSel.head));
}
// Given two same-length, non-empty fragments of inline content,
// determine whether the first could be created from the second by
// removing or adding a single mark type.
function $4fda26bcd679fbcb$var$isMarkChange(cur, prev) {
    let curMarks = cur.firstChild.marks, prevMarks = prev.firstChild.marks;
    let added = curMarks, removed = prevMarks, type, mark, update;
    for(let i = 0; i < prevMarks.length; i++)added = prevMarks[i].removeFromSet(added);
    for(let i1 = 0; i1 < curMarks.length; i1++)removed = curMarks[i1].removeFromSet(removed);
    if (added.length == 1 && removed.length == 0) {
        mark = added[0];
        type = "add";
        update = (node)=>node.mark(mark.addToSet(node.marks));
    } else if (added.length == 0 && removed.length == 1) {
        mark = removed[0];
        type = "remove";
        update = (node)=>node.mark(mark.removeFromSet(node.marks));
    } else return null;
    let updated = [];
    for(let i2 = 0; i2 < prev.childCount; i2++)updated.push(update(prev.child(i2)));
    if ((0, $c8d507d90382f091$export$ffb0004e005737fa).from(updated).eq(cur)) return {
        mark: mark,
        type: type
    };
}
function $4fda26bcd679fbcb$var$looksLikeJoin(old, start, end, $newStart, $newEnd) {
    if (!$newStart.parent.isTextblock || // The content must have shrunk
    end - start <= $newEnd.pos - $newStart.pos || // newEnd must point directly at or after the end of the block that newStart points into
    $4fda26bcd679fbcb$var$skipClosingAndOpening($newStart, true, false) < $newEnd.pos) return false;
    let $start = old.resolve(start);
    // Start must be at the end of a block
    if ($start.parentOffset < $start.parent.content.size || !$start.parent.isTextblock) return false;
    let $next = old.resolve($4fda26bcd679fbcb$var$skipClosingAndOpening($start, true, true));
    // The next textblock must start before end and end near it
    if (!$next.parent.isTextblock || $next.pos > end || $4fda26bcd679fbcb$var$skipClosingAndOpening($next, true, false) < end) return false;
    // The fragments after the join point must match
    return $newStart.parent.content.cut($newStart.parentOffset).eq($next.parent.content);
}
function $4fda26bcd679fbcb$var$skipClosingAndOpening($pos, fromEnd, mayOpen) {
    let depth = $pos.depth, end = fromEnd ? $pos.end() : $pos.pos;
    while(depth > 0 && (fromEnd || $pos.indexAfter(depth) == $pos.node(depth).childCount)){
        depth--;
        end++;
        fromEnd = false;
    }
    if (mayOpen) {
        let next = $pos.node(depth).maybeChild($pos.indexAfter(depth));
        while(next && !next.isLeaf){
            next = next.firstChild;
            end++;
        }
    }
    return end;
}
function $4fda26bcd679fbcb$var$findDiff(a, b, pos, preferredPos, preferredSide) {
    let start = a.findDiffStart(b, pos);
    if (start == null) return null;
    let { a: endA , b: endB  } = a.findDiffEnd(b, pos + a.size, pos + b.size);
    if (preferredSide == "end") {
        let adjust = Math.max(0, start - Math.min(endA, endB));
        preferredPos -= endA + adjust - start;
    }
    if (endA < start && a.size < b.size) {
        let move = preferredPos <= start && preferredPos >= endA ? start - preferredPos : 0;
        start -= move;
        endB = start + (endB - endA);
        endA = start;
    } else if (endB < start) {
        let move1 = preferredPos <= start && preferredPos >= endB ? start - preferredPos : 0;
        start -= move1;
        endA = start + (endA - endB);
        endB = start;
    }
    return {
        start: start,
        endA: endA,
        endB: endB
    };
}
/**
@internal
*/ const $4fda26bcd679fbcb$export$38b79e3fdcfcfd68 = $4fda26bcd679fbcb$var$serializeForClipboard;
/**
@internal
*/ const $4fda26bcd679fbcb$export$5d42ca91c11c9e4d = $4fda26bcd679fbcb$var$parseFromClipboard;
/**
@internal
*/ const $4fda26bcd679fbcb$export$76b14d3c719c32fc = $4fda26bcd679fbcb$var$endComposition;
/**
An editor view manages the DOM structure that represents an
editable document. Its state and behavior are determined by its
[props](https://prosemirror.net/docs/ref/#view.DirectEditorProps).
*/ class $4fda26bcd679fbcb$export$eece2fccabbb77c5 {
    /**
    Create a view. `place` may be a DOM node that the editor should
    be appended to, a function that will place it into the document,
    or an object whose `mount` property holds the node to use as the
    document container. If it is `null`, the editor will not be
    added to the document.
    */ constructor(place, props){
        this._root = null;
        /**
        @internal
        */ this.focused = false;
        /**
        Kludge used to work around a Chrome bug @internal
        */ this.trackWrites = null;
        this.mounted = false;
        /**
        @internal
        */ this.markCursor = null;
        /**
        @internal
        */ this.cursorWrapper = null;
        /**
        @internal
        */ this.lastSelectedViewDesc = undefined;
        /**
        @internal
        */ this.input = new $4fda26bcd679fbcb$var$InputState;
        this.prevDirectPlugins = [];
        this.pluginViews = [];
        /**
        Holds `true` when a hack node is needed in Firefox to prevent the
        [space is eaten issue](https://github.com/ProseMirror/prosemirror/issues/651)
        @internal
        */ this.requiresGeckoHackNode = false;
        /**
        When editor content is being dragged, this object contains
        information about the dragged slice and whether it is being
        copied or moved. At any other time, it is null.
        */ this.dragging = null;
        this._props = props;
        this.state = props.state;
        this.directPlugins = props.plugins || [];
        this.directPlugins.forEach($4fda26bcd679fbcb$var$checkStateComponent);
        this.dispatch = this.dispatch.bind(this);
        this.dom = place && place.mount || document.createElement("div");
        if (place) {
            if (place.appendChild) place.appendChild(this.dom);
            else if (typeof place == "function") place(this.dom);
            else if (place.mount) this.mounted = true;
        }
        this.editable = $4fda26bcd679fbcb$var$getEditable(this);
        $4fda26bcd679fbcb$var$updateCursorWrapper(this);
        this.nodeViews = $4fda26bcd679fbcb$var$buildNodeViews(this);
        this.docView = $4fda26bcd679fbcb$var$docViewDesc(this.state.doc, $4fda26bcd679fbcb$var$computeDocDeco(this), $4fda26bcd679fbcb$var$viewDecorations(this), this.dom, this);
        this.domObserver = new $4fda26bcd679fbcb$var$DOMObserver(this, (from, to, typeOver, added)=>$4fda26bcd679fbcb$var$readDOMChange(this, from, to, typeOver, added));
        this.domObserver.start();
        $4fda26bcd679fbcb$var$initInput(this);
        this.updatePluginViews();
    }
    /**
    Holds `true` when a
    [composition](https://w3c.github.io/uievents/#events-compositionevents)
    is active.
    */ get composing() {
        return this.input.composing;
    }
    /**
    The view's current [props](https://prosemirror.net/docs/ref/#view.EditorProps).
    */ get props() {
        if (this._props.state != this.state) {
            let prev = this._props;
            this._props = {};
            for(let name in prev)this._props[name] = prev[name];
            this._props.state = this.state;
        }
        return this._props;
    }
    /**
    Update the view's props. Will immediately cause an update to
    the DOM.
    */ update(props) {
        if (props.handleDOMEvents != this._props.handleDOMEvents) $4fda26bcd679fbcb$var$ensureListeners(this);
        let prevProps = this._props;
        this._props = props;
        if (props.plugins) {
            props.plugins.forEach($4fda26bcd679fbcb$var$checkStateComponent);
            this.directPlugins = props.plugins;
        }
        this.updateStateInner(props.state, prevProps);
    }
    /**
    Update the view by updating existing props object with the object
    given as argument. Equivalent to `view.update(Object.assign({},
    view.props, props))`.
    */ setProps(props) {
        let updated = {};
        for(let name in this._props)updated[name] = this._props[name];
        updated.state = this.state;
        for(let name1 in props)updated[name1] = props[name1];
        this.update(updated);
    }
    /**
    Update the editor's `state` prop, without touching any of the
    other props.
    */ updateState(state) {
        this.updateStateInner(state, this._props);
    }
    updateStateInner(state, prevProps) {
        let prev = this.state, redraw = false, updateSel = false;
        // When stored marks are added, stop composition, so that they can
        // be displayed.
        if (state.storedMarks && this.composing) {
            $4fda26bcd679fbcb$var$clearComposition(this);
            updateSel = true;
        }
        this.state = state;
        let pluginsChanged = prev.plugins != state.plugins || this._props.plugins != prevProps.plugins;
        if (pluginsChanged || this._props.plugins != prevProps.plugins || this._props.nodeViews != prevProps.nodeViews) {
            let nodeViews = $4fda26bcd679fbcb$var$buildNodeViews(this);
            if ($4fda26bcd679fbcb$var$changedNodeViews(nodeViews, this.nodeViews)) {
                this.nodeViews = nodeViews;
                redraw = true;
            }
        }
        if (pluginsChanged || prevProps.handleDOMEvents != this._props.handleDOMEvents) $4fda26bcd679fbcb$var$ensureListeners(this);
        this.editable = $4fda26bcd679fbcb$var$getEditable(this);
        $4fda26bcd679fbcb$var$updateCursorWrapper(this);
        let innerDeco = $4fda26bcd679fbcb$var$viewDecorations(this), outerDeco = $4fda26bcd679fbcb$var$computeDocDeco(this);
        let scroll = prev.plugins != state.plugins && !prev.doc.eq(state.doc) ? "reset" : state.scrollToSelection > prev.scrollToSelection ? "to selection" : "preserve";
        let updateDoc = redraw || !this.docView.matchesNode(state.doc, outerDeco, innerDeco);
        if (updateDoc || !state.selection.eq(prev.selection)) updateSel = true;
        let oldScrollPos = scroll == "preserve" && updateSel && this.dom.style.overflowAnchor == null && $4fda26bcd679fbcb$var$storeScrollPos(this);
        if (updateSel) {
            this.domObserver.stop();
            // Work around an issue in Chrome, IE, and Edge where changing
            // the DOM around an active selection puts it into a broken
            // state where the thing the user sees differs from the
            // selection reported by the Selection object (#710, #973,
            // #1011, #1013, #1035).
            let forceSelUpdate = updateDoc && ($4fda26bcd679fbcb$var$ie || $4fda26bcd679fbcb$var$chrome) && !this.composing && !prev.selection.empty && !state.selection.empty && $4fda26bcd679fbcb$var$selectionContextChanged(prev.selection, state.selection);
            if (updateDoc) {
                // If the node that the selection points into is written to,
                // Chrome sometimes starts misreporting the selection, so this
                // tracks that and forces a selection reset when our update
                // did write to the node.
                let chromeKludge = $4fda26bcd679fbcb$var$chrome ? this.trackWrites = this.domSelectionRange().focusNode : null;
                if (redraw || !this.docView.update(state.doc, outerDeco, innerDeco, this)) {
                    this.docView.updateOuterDeco([]);
                    this.docView.destroy();
                    this.docView = $4fda26bcd679fbcb$var$docViewDesc(state.doc, outerDeco, innerDeco, this.dom, this);
                }
                if (chromeKludge && !this.trackWrites) forceSelUpdate = true;
            }
            // Work around for an issue where an update arriving right between
            // a DOM selection change and the "selectionchange" event for it
            // can cause a spurious DOM selection update, disrupting mouse
            // drag selection.
            if (forceSelUpdate || !(this.input.mouseDown && this.domObserver.currentSelection.eq(this.domSelectionRange()) && $4fda26bcd679fbcb$var$anchorInRightPlace(this))) $4fda26bcd679fbcb$var$selectionToDOM(this, forceSelUpdate);
            else {
                $4fda26bcd679fbcb$var$syncNodeSelection(this, state.selection);
                this.domObserver.setCurSelection();
            }
            this.domObserver.start();
        }
        this.updatePluginViews(prev);
        if (scroll == "reset") this.dom.scrollTop = 0;
        else if (scroll == "to selection") this.scrollToSelection();
        else if (oldScrollPos) $4fda26bcd679fbcb$var$resetScrollPos(oldScrollPos);
    }
    /**
    @internal
    */ scrollToSelection() {
        let startDOM = this.domSelectionRange().focusNode;
        if (this.someProp("handleScrollToSelection", (f)=>f(this))) ;
        else if (this.state.selection instanceof (0, $ee27db283572d394$export$e2940151ac854c0b)) {
            let target = this.docView.domAfterPos(this.state.selection.from);
            if (target.nodeType == 1) $4fda26bcd679fbcb$var$scrollRectIntoView(this, target.getBoundingClientRect(), startDOM);
        } else $4fda26bcd679fbcb$var$scrollRectIntoView(this, this.coordsAtPos(this.state.selection.head, 1), startDOM);
    }
    destroyPluginViews() {
        let view;
        while(view = this.pluginViews.pop())if (view.destroy) view.destroy();
    }
    updatePluginViews(prevState) {
        if (!prevState || prevState.plugins != this.state.plugins || this.directPlugins != this.prevDirectPlugins) {
            this.prevDirectPlugins = this.directPlugins;
            this.destroyPluginViews();
            for(let i = 0; i < this.directPlugins.length; i++){
                let plugin = this.directPlugins[i];
                if (plugin.spec.view) this.pluginViews.push(plugin.spec.view(this));
            }
            for(let i1 = 0; i1 < this.state.plugins.length; i1++){
                let plugin1 = this.state.plugins[i1];
                if (plugin1.spec.view) this.pluginViews.push(plugin1.spec.view(this));
            }
        } else for(let i2 = 0; i2 < this.pluginViews.length; i2++){
            let pluginView = this.pluginViews[i2];
            if (pluginView.update) pluginView.update(this, prevState);
        }
    }
    someProp(propName, f) {
        let prop = this._props && this._props[propName], value;
        if (prop != null && (value = f ? f(prop) : prop)) return value;
        for(let i = 0; i < this.directPlugins.length; i++){
            let prop1 = this.directPlugins[i].props[propName];
            if (prop1 != null && (value = f ? f(prop1) : prop1)) return value;
        }
        let plugins = this.state.plugins;
        if (plugins) for(let i1 = 0; i1 < plugins.length; i1++){
            let prop2 = plugins[i1].props[propName];
            if (prop2 != null && (value = f ? f(prop2) : prop2)) return value;
        }
    }
    /**
    Query whether the view has focus.
    */ hasFocus() {
        // Work around IE not handling focus correctly if resize handles are shown.
        // If the cursor is inside an element with resize handles, activeElement
        // will be that element instead of this.dom.
        if ($4fda26bcd679fbcb$var$ie) {
            // If activeElement is within this.dom, and there are no other elements
            // setting `contenteditable` to false in between, treat it as focused.
            let node = this.root.activeElement;
            if (node == this.dom) return true;
            if (!node || !this.dom.contains(node)) return false;
            while(node && this.dom != node && this.dom.contains(node)){
                if (node.contentEditable == "false") return false;
                node = node.parentElement;
            }
            return true;
        }
        return this.root.activeElement == this.dom;
    }
    /**
    Focus the editor.
    */ focus() {
        this.domObserver.stop();
        if (this.editable) $4fda26bcd679fbcb$var$focusPreventScroll(this.dom);
        $4fda26bcd679fbcb$var$selectionToDOM(this);
        this.domObserver.start();
    }
    /**
    Get the document root in which the editor exists. This will
    usually be the top-level `document`, but might be a [shadow
    DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)
    root if the editor is inside one.
    */ get root() {
        let cached = this._root;
        if (cached == null) {
            for(let search = this.dom.parentNode; search; search = search.parentNode)if (search.nodeType == 9 || search.nodeType == 11 && search.host) {
                if (!search.getSelection) Object.getPrototypeOf(search).getSelection = ()=>search.ownerDocument.getSelection();
                return this._root = search;
            }
        }
        return cached || document;
    }
    /**
    Given a pair of viewport coordinates, return the document
    position that corresponds to them. May return null if the given
    coordinates aren't inside of the editor. When an object is
    returned, its `pos` property is the position nearest to the
    coordinates, and its `inside` property holds the position of the
    inner node that the position falls inside of, or -1 if it is at
    the top level, not in any node.
    */ posAtCoords(coords) {
        return $4fda26bcd679fbcb$var$posAtCoords(this, coords);
    }
    /**
    Returns the viewport rectangle at a given document position.
    `left` and `right` will be the same number, as this returns a
    flat cursor-ish rectangle. If the position is between two things
    that aren't directly adjacent, `side` determines which element
    is used. When < 0, the element before the position is used,
    otherwise the element after.
    */ coordsAtPos(pos, side = 1) {
        return $4fda26bcd679fbcb$var$coordsAtPos(this, pos, side);
    }
    /**
    Find the DOM position that corresponds to the given document
    position. When `side` is negative, find the position as close as
    possible to the content before the position. When positive,
    prefer positions close to the content after the position. When
    zero, prefer as shallow a position as possible.
    
    Note that you should **not** mutate the editor's internal DOM,
    only inspect it (and even that is usually not necessary).
    */ domAtPos(pos, side = 0) {
        return this.docView.domFromPos(pos, side);
    }
    /**
    Find the DOM node that represents the document node after the
    given position. May return `null` when the position doesn't point
    in front of a node or if the node is inside an opaque node view.
    
    This is intended to be able to call things like
    `getBoundingClientRect` on that DOM node. Do **not** mutate the
    editor DOM directly, or add styling this way, since that will be
    immediately overriden by the editor as it redraws the node.
    */ nodeDOM(pos) {
        let desc = this.docView.descAt(pos);
        return desc ? desc.nodeDOM : null;
    }
    /**
    Find the document position that corresponds to a given DOM
    position. (Whenever possible, it is preferable to inspect the
    document structure directly, rather than poking around in the
    DOM, but sometimes—for example when interpreting an event
    target—you don't have a choice.)
    
    The `bias` parameter can be used to influence which side of a DOM
    node to use when the position is inside a leaf node.
    */ posAtDOM(node, offset, bias = -1) {
        let pos = this.docView.posFromDOM(node, offset, bias);
        if (pos == null) throw new RangeError("DOM position not inside the editor");
        return pos;
    }
    /**
    Find out whether the selection is at the end of a textblock when
    moving in a given direction. When, for example, given `"left"`,
    it will return true if moving left from the current cursor
    position would leave that position's parent textblock. Will apply
    to the view's current state by default, but it is possible to
    pass a different state.
    */ endOfTextblock(dir, state) {
        return $4fda26bcd679fbcb$var$endOfTextblock(this, state || this.state, dir);
    }
    /**
    Removes the editor from the DOM and destroys all [node
    views](https://prosemirror.net/docs/ref/#view.NodeView).
    */ destroy() {
        if (!this.docView) return;
        $4fda26bcd679fbcb$var$destroyInput(this);
        this.destroyPluginViews();
        if (this.mounted) {
            this.docView.update(this.state.doc, [], $4fda26bcd679fbcb$var$viewDecorations(this), this);
            this.dom.textContent = "";
        } else if (this.dom.parentNode) this.dom.parentNode.removeChild(this.dom);
        this.docView.destroy();
        this.docView = null;
    }
    /**
    This is true when the view has been
    [destroyed](https://prosemirror.net/docs/ref/#view.EditorView.destroy) (and thus should not be
    used anymore).
    */ get isDestroyed() {
        return this.docView == null;
    }
    /**
    Used for testing.
    */ dispatchEvent(event) {
        return $4fda26bcd679fbcb$var$dispatchEvent(this, event);
    }
    /**
    Dispatch a transaction. Will call
    [`dispatchTransaction`](https://prosemirror.net/docs/ref/#view.DirectEditorProps.dispatchTransaction)
    when given, and otherwise defaults to applying the transaction to
    the current state and calling
    [`updateState`](https://prosemirror.net/docs/ref/#view.EditorView.updateState) with the result.
    This method is bound to the view instance, so that it can be
    easily passed around.
    */ dispatch(tr) {
        let dispatchTransaction = this._props.dispatchTransaction;
        if (dispatchTransaction) dispatchTransaction.call(this, tr);
        else this.updateState(this.state.apply(tr));
    }
    /**
    @internal
    */ domSelectionRange() {
        return $4fda26bcd679fbcb$var$safari && this.root.nodeType === 11 && $4fda26bcd679fbcb$var$deepActiveElement(this.dom.ownerDocument) == this.dom ? $4fda26bcd679fbcb$var$safariShadowSelectionRange(this) : this.domSelection();
    }
    /**
    @internal
    */ domSelection() {
        return this.root.getSelection();
    }
}
function $4fda26bcd679fbcb$var$computeDocDeco(view) {
    let attrs = Object.create(null);
    attrs.class = "ProseMirror";
    attrs.contenteditable = String(view.editable);
    attrs.translate = "no";
    view.someProp("attributes", (value)=>{
        if (typeof value == "function") value = value(view.state);
        if (value) for(let attr in value){
            if (attr == "class") attrs.class += " " + value[attr];
            if (attr == "style") attrs.style = (attrs.style ? attrs.style + ";" : "") + value[attr];
            else if (!attrs[attr] && attr != "contenteditable" && attr != "nodeName") attrs[attr] = String(value[attr]);
        }
    });
    return [
        $4fda26bcd679fbcb$export$10e30b733df217ea.node(0, view.state.doc.content.size, attrs)
    ];
}
function $4fda26bcd679fbcb$var$updateCursorWrapper(view) {
    if (view.markCursor) {
        let dom = document.createElement("img");
        dom.className = "ProseMirror-separator";
        dom.setAttribute("mark-placeholder", "true");
        dom.setAttribute("alt", "");
        view.cursorWrapper = {
            dom: dom,
            deco: $4fda26bcd679fbcb$export$10e30b733df217ea.widget(view.state.selection.head, dom, {
                raw: true,
                marks: view.markCursor
            })
        };
    } else view.cursorWrapper = null;
}
function $4fda26bcd679fbcb$var$getEditable(view) {
    return !view.someProp("editable", (value)=>value(view.state) === false);
}
function $4fda26bcd679fbcb$var$selectionContextChanged(sel1, sel2) {
    let depth = Math.min(sel1.$anchor.sharedDepth(sel1.head), sel2.$anchor.sharedDepth(sel2.head));
    return sel1.$anchor.start(depth) != sel2.$anchor.start(depth);
}
function $4fda26bcd679fbcb$var$buildNodeViews(view) {
    let result = Object.create(null);
    function add(obj) {
        for(let prop in obj)if (!Object.prototype.hasOwnProperty.call(result, prop)) result[prop] = obj[prop];
    }
    view.someProp("nodeViews", add);
    view.someProp("markViews", add);
    return result;
}
function $4fda26bcd679fbcb$var$changedNodeViews(a, b) {
    let nA = 0, nB = 0;
    for(let prop in a){
        if (a[prop] != b[prop]) return true;
        nA++;
    }
    for(let _ in b)nB++;
    return nA != nB;
}
function $4fda26bcd679fbcb$var$checkStateComponent(plugin) {
    if (plugin.spec.state || plugin.spec.filterTransaction || plugin.spec.appendTransaction) throw new RangeError("Plugins passed directly to the view must not have a state component");
}




var $0784e134ae6ce372$exports = {};
"use strict";

$0784e134ae6ce372$exports = (parcelRequire("5M8T0"));


/**
Document schema for the data model used by CommonMark.
*/ const $a7e510c892593f83$export$4902baddc787debb = new (0, $c8d507d90382f091$export$19342e026b58ebb7)({
    nodes: {
        doc: {
            content: "block+"
        },
        paragraph: {
            content: "inline*",
            group: "block",
            parseDOM: [
                {
                    tag: "p"
                }
            ],
            toDOM () {
                return [
                    "p",
                    0
                ];
            }
        },
        blockquote: {
            content: "block+",
            group: "block",
            parseDOM: [
                {
                    tag: "blockquote"
                }
            ],
            toDOM () {
                return [
                    "blockquote",
                    0
                ];
            }
        },
        horizontal_rule: {
            group: "block",
            parseDOM: [
                {
                    tag: "hr"
                }
            ],
            toDOM () {
                return [
                    "div",
                    [
                        "hr"
                    ]
                ];
            }
        },
        heading: {
            attrs: {
                level: {
                    default: 1
                }
            },
            content: "(text | image)*",
            group: "block",
            defining: true,
            parseDOM: [
                {
                    tag: "h1",
                    attrs: {
                        level: 1
                    }
                },
                {
                    tag: "h2",
                    attrs: {
                        level: 2
                    }
                },
                {
                    tag: "h3",
                    attrs: {
                        level: 3
                    }
                },
                {
                    tag: "h4",
                    attrs: {
                        level: 4
                    }
                },
                {
                    tag: "h5",
                    attrs: {
                        level: 5
                    }
                },
                {
                    tag: "h6",
                    attrs: {
                        level: 6
                    }
                }
            ],
            toDOM (node) {
                return [
                    "h" + node.attrs.level,
                    0
                ];
            }
        },
        code_block: {
            content: "text*",
            group: "block",
            code: true,
            defining: true,
            marks: "",
            attrs: {
                params: {
                    default: ""
                }
            },
            parseDOM: [
                {
                    tag: "pre",
                    preserveWhitespace: "full",
                    getAttrs: (node)=>({
                            params: node.getAttribute("data-params") || ""
                        })
                }
            ],
            toDOM (node) {
                return [
                    "pre",
                    node.attrs.params ? {
                        "data-params": node.attrs.params
                    } : {},
                    [
                        "code",
                        0
                    ]
                ];
            }
        },
        ordered_list: {
            content: "list_item+",
            group: "block",
            attrs: {
                order: {
                    default: 1
                },
                tight: {
                    default: false
                }
            },
            parseDOM: [
                {
                    tag: "ol",
                    getAttrs (dom) {
                        return {
                            order: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1,
                            tight: dom.hasAttribute("data-tight")
                        };
                    }
                }
            ],
            toDOM (node) {
                return [
                    "ol",
                    {
                        start: node.attrs.order == 1 ? null : node.attrs.order,
                        "data-tight": node.attrs.tight ? "true" : null
                    },
                    0
                ];
            }
        },
        bullet_list: {
            content: "list_item+",
            group: "block",
            attrs: {
                tight: {
                    default: false
                }
            },
            parseDOM: [
                {
                    tag: "ul",
                    getAttrs: (dom)=>({
                            tight: dom.hasAttribute("data-tight")
                        })
                }
            ],
            toDOM (node) {
                return [
                    "ul",
                    {
                        "data-tight": node.attrs.tight ? "true" : null
                    },
                    0
                ];
            }
        },
        list_item: {
            content: "paragraph block*",
            defining: true,
            parseDOM: [
                {
                    tag: "li"
                }
            ],
            toDOM () {
                return [
                    "li",
                    0
                ];
            }
        },
        text: {
            group: "inline"
        },
        image: {
            inline: true,
            attrs: {
                src: {},
                alt: {
                    default: null
                },
                title: {
                    default: null
                }
            },
            group: "inline",
            draggable: true,
            parseDOM: [
                {
                    tag: "img[src]",
                    getAttrs (dom) {
                        return {
                            src: dom.getAttribute("src"),
                            title: dom.getAttribute("title"),
                            alt: dom.getAttribute("alt")
                        };
                    }
                }
            ],
            toDOM (node) {
                return [
                    "img",
                    node.attrs
                ];
            }
        },
        hard_break: {
            inline: true,
            group: "inline",
            selectable: false,
            parseDOM: [
                {
                    tag: "br"
                }
            ],
            toDOM () {
                return [
                    "br"
                ];
            }
        }
    },
    marks: {
        em: {
            parseDOM: [
                {
                    tag: "i"
                },
                {
                    tag: "em"
                },
                {
                    style: "font-style",
                    getAttrs: (value)=>value == "italic" && null
                }
            ],
            toDOM () {
                return [
                    "em"
                ];
            }
        },
        strong: {
            parseDOM: [
                {
                    tag: "b"
                },
                {
                    tag: "strong"
                },
                {
                    style: "font-weight",
                    getAttrs: (value)=>/^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
                }
            ],
            toDOM () {
                return [
                    "strong"
                ];
            }
        },
        link: {
            attrs: {
                href: {},
                title: {
                    default: null
                }
            },
            inclusive: false,
            parseDOM: [
                {
                    tag: "a[href]",
                    getAttrs (dom) {
                        return {
                            href: dom.getAttribute("href"),
                            title: dom.getAttribute("title")
                        };
                    }
                }
            ],
            toDOM (node) {
                return [
                    "a",
                    node.attrs
                ];
            }
        },
        code: {
            parseDOM: [
                {
                    tag: "code"
                }
            ],
            toDOM () {
                return [
                    "code"
                ];
            }
        }
    }
});
// @ts-ignore
function $a7e510c892593f83$var$maybeMerge(a, b) {
    if (a.isText && b.isText && (0, $c8d507d90382f091$export$c9d15bcfc6d42044).sameSet(a.marks, b.marks)) return a.withText(a.text + b.text);
}
// Object used to track the context of a running parse.
class $a7e510c892593f83$var$MarkdownParseState {
    constructor(schema, tokenHandlers){
        this.schema = schema;
        this.tokenHandlers = tokenHandlers;
        this.stack = [
            {
                type: schema.topNodeType,
                attrs: null,
                content: [],
                marks: (0, $c8d507d90382f091$export$c9d15bcfc6d42044).none
            }
        ];
    }
    top() {
        return this.stack[this.stack.length - 1];
    }
    push(elt) {
        if (this.stack.length) this.top().content.push(elt);
    }
    // Adds the given text to the current position in the document,
    // using the current marks as styling.
    addText(text) {
        if (!text) return;
        let top = this.top(), nodes = top.content, last = nodes[nodes.length - 1];
        let node = this.schema.text(text, top.marks), merged;
        if (last && (merged = $a7e510c892593f83$var$maybeMerge(last, node))) nodes[nodes.length - 1] = merged;
        else nodes.push(node);
    }
    // Adds the given mark to the set of active marks.
    openMark(mark) {
        let top = this.top();
        top.marks = mark.addToSet(top.marks);
    }
    // Removes the given mark from the set of active marks.
    closeMark(mark) {
        let top = this.top();
        top.marks = mark.removeFromSet(top.marks);
    }
    parseTokens(toks) {
        for(let i = 0; i < toks.length; i++){
            let tok = toks[i];
            let handler = this.tokenHandlers[tok.type];
            if (!handler) throw new Error("Token type `" + tok.type + "` not supported by Markdown parser");
            handler(this, tok, toks, i);
        }
    }
    // Add a node at the current position.
    addNode(type, attrs, content) {
        let top = this.top();
        let node = type.createAndFill(attrs, content, top ? top.marks : []);
        if (!node) return null;
        this.push(node);
        return node;
    }
    // Wrap subsequent content in a node of the given type.
    openNode(type, attrs) {
        this.stack.push({
            type: type,
            attrs: attrs,
            content: [],
            marks: (0, $c8d507d90382f091$export$c9d15bcfc6d42044).none
        });
    }
    // Close and return the node that is currently on top of the stack.
    closeNode() {
        let info = this.stack.pop();
        return this.addNode(info.type, info.attrs, info.content);
    }
}
function $a7e510c892593f83$var$attrs(spec, token, tokens, i) {
    if (spec.getAttrs) return spec.getAttrs(token, tokens, i);
    else if (spec.attrs instanceof Function) return spec.attrs(token);
    else return spec.attrs;
}
// Code content is represented as a single token with a `content`
// property in Markdown-it.
function $a7e510c892593f83$var$noCloseToken(spec, type) {
    return spec.noCloseToken || type == "code_inline" || type == "code_block" || type == "fence";
}
function $a7e510c892593f83$var$withoutTrailingNewline(str) {
    return str[str.length - 1] == "\n" ? str.slice(0, str.length - 1) : str;
}
function $a7e510c892593f83$var$noOp() {}
function $a7e510c892593f83$var$tokenHandlers(schema, tokens) {
    let handlers = Object.create(null);
    for(let type in tokens){
        let spec = tokens[type];
        if (spec.block) {
            let nodeType = schema.nodeType(spec.block);
            if ($a7e510c892593f83$var$noCloseToken(spec, type)) handlers[type] = (state, tok, tokens, i)=>{
                state.openNode(nodeType, $a7e510c892593f83$var$attrs(spec, tok, tokens, i));
                state.addText($a7e510c892593f83$var$withoutTrailingNewline(tok.content));
                state.closeNode();
            };
            else {
                handlers[type + "_open"] = (state, tok, tokens, i)=>state.openNode(nodeType, $a7e510c892593f83$var$attrs(spec, tok, tokens, i));
                handlers[type + "_close"] = (state)=>state.closeNode();
            }
        } else if (spec.node) {
            let nodeType1 = schema.nodeType(spec.node);
            handlers[type] = (state, tok, tokens, i)=>state.addNode(nodeType1, $a7e510c892593f83$var$attrs(spec, tok, tokens, i));
        } else if (spec.mark) {
            let markType = schema.marks[spec.mark];
            if ($a7e510c892593f83$var$noCloseToken(spec, type)) handlers[type] = (state, tok, tokens, i)=>{
                state.openMark(markType.create($a7e510c892593f83$var$attrs(spec, tok, tokens, i)));
                state.addText($a7e510c892593f83$var$withoutTrailingNewline(tok.content));
                state.closeMark(markType);
            };
            else {
                handlers[type + "_open"] = (state, tok, tokens, i)=>state.openMark(markType.create($a7e510c892593f83$var$attrs(spec, tok, tokens, i)));
                handlers[type + "_close"] = (state)=>state.closeMark(markType);
            }
        } else if (spec.ignore) {
            if ($a7e510c892593f83$var$noCloseToken(spec, type)) handlers[type] = $a7e510c892593f83$var$noOp;
            else {
                handlers[type + "_open"] = $a7e510c892593f83$var$noOp;
                handlers[type + "_close"] = $a7e510c892593f83$var$noOp;
            }
        } else throw new RangeError("Unrecognized parsing spec " + JSON.stringify(spec));
    }
    handlers.text = (state, tok)=>state.addText(tok.content);
    handlers.inline = (state, tok)=>state.parseTokens(tok.children);
    handlers.softbreak = handlers.softbreak || ((state)=>state.addText("\n"));
    return handlers;
}
/**
A configuration of a Markdown parser. Such a parser uses
[markdown-it](https://github.com/markdown-it/markdown-it) to
tokenize a file, and then runs the custom rules it is given over
the tokens to create a ProseMirror document tree.
*/ class $a7e510c892593f83$export$a64f782182dea128 {
    /**
    Create a parser with the given configuration. You can configure
    the markdown-it parser to parse the dialect you want, and provide
    a description of the ProseMirror entities those tokens map to in
    the `tokens` object, which maps token names to descriptions of
    what to do with them. Such a description is an object, and may
    have the following properties:
    */ constructor(/**
    The parser's document schema.
    */ schema, /**
    This parser's markdown-it tokenizer.
    */ tokenizer, /**
    The value of the `tokens` object used to construct this
    parser. Can be useful to copy and modify to base other parsers
    on.
    */ tokens){
        this.schema = schema;
        this.tokenizer = tokenizer;
        this.tokens = tokens;
        this.tokenHandlers = $a7e510c892593f83$var$tokenHandlers(schema, tokens);
    }
    /**
    Parse a string as [CommonMark](http://commonmark.org/) markup,
    and create a ProseMirror document as prescribed by this parser's
    rules.
    
    The second argument, when given, is passed through to the
    [Markdown
    parser](https://markdown-it.github.io/markdown-it/#MarkdownIt.parse).
    */ parse(text, markdownEnv = {}) {
        let state = new $a7e510c892593f83$var$MarkdownParseState(this.schema, this.tokenHandlers), doc;
        state.parseTokens(this.tokenizer.parse(text, markdownEnv));
        do doc = state.closeNode();
        while (state.stack.length);
        return doc || this.schema.topNodeType.createAndFill();
    }
}
function $a7e510c892593f83$var$listIsTight(tokens, i) {
    while(++i < tokens.length)if (tokens[i].type != "list_item_open") return tokens[i].hidden;
    return false;
}
/**
A parser parsing unextended [CommonMark](http://commonmark.org/),
without inline HTML, and producing a document in the basic schema.
*/ const $a7e510c892593f83$export$7517583227ad0cb8 = new $a7e510c892593f83$export$a64f782182dea128($a7e510c892593f83$export$4902baddc787debb, (0, (/*@__PURE__*/$parcel$interopDefault($0784e134ae6ce372$exports)))("commonmark", {
    html: false
}), {
    blockquote: {
        block: "blockquote"
    },
    paragraph: {
        block: "paragraph"
    },
    list_item: {
        block: "list_item"
    },
    bullet_list: {
        block: "bullet_list",
        getAttrs: (_, tokens, i)=>({
                tight: $a7e510c892593f83$var$listIsTight(tokens, i)
            })
    },
    ordered_list: {
        block: "ordered_list",
        getAttrs: (tok, tokens, i)=>({
                order: +tok.attrGet("start") || 1,
                tight: $a7e510c892593f83$var$listIsTight(tokens, i)
            })
    },
    heading: {
        block: "heading",
        getAttrs: (tok)=>({
                level: +tok.tag.slice(1)
            })
    },
    code_block: {
        block: "code_block",
        noCloseToken: true
    },
    fence: {
        block: "code_block",
        getAttrs: (tok)=>({
                params: tok.info || ""
            }),
        noCloseToken: true
    },
    hr: {
        node: "horizontal_rule"
    },
    image: {
        node: "image",
        getAttrs: (tok)=>({
                src: tok.attrGet("src"),
                title: tok.attrGet("title") || null,
                alt: tok.children[0] && tok.children[0].content || null
            })
    },
    hardbreak: {
        node: "hard_break"
    },
    em: {
        mark: "em"
    },
    strong: {
        mark: "strong"
    },
    link: {
        mark: "link",
        getAttrs: (tok)=>({
                href: tok.attrGet("href"),
                title: tok.attrGet("title") || null
            })
    },
    code_inline: {
        mark: "code",
        noCloseToken: true
    }
});
/**
A specification for serializing a ProseMirror document as
Markdown/CommonMark text.
*/ class $a7e510c892593f83$export$ae9f6f04acb6c60c {
    /**
    Construct a serializer with the given configuration. The `nodes`
    object should map node names in a given schema to function that
    take a serializer state and such a node, and serialize the node.
    */ constructor(/**
    The node serializer functions for this serializer.
    */ nodes, /**
    The mark serializer info.
    */ marks, options = {}){
        this.nodes = nodes;
        this.marks = marks;
        this.options = options;
    }
    /**
    Serialize the content of the given node to
    [CommonMark](http://commonmark.org/).
    */ serialize(content, options = {}) {
        options = Object.assign(this.options, options);
        let state = new $a7e510c892593f83$export$61055fa707e69319(this.nodes, this.marks, options);
        state.renderContent(content);
        return state.out;
    }
}
/**
A serializer for the [basic schema](https://prosemirror.net/docs/ref/#schema).
*/ const $a7e510c892593f83$export$f996452ca6e9a0ae = new $a7e510c892593f83$export$ae9f6f04acb6c60c({
    blockquote (state, node) {
        state.wrapBlock("> ", null, node, ()=>state.renderContent(node));
    },
    code_block (state, node) {
        // Make sure the front matter fences are longer than any dash sequence within it
        const backticks = node.textContent.match(/`{3,}/gm);
        const fence = backticks ? backticks.sort().slice(-1)[0] + "`" : "```";
        state.write(fence + (node.attrs.params || "") + "\n");
        state.text(node.textContent, false);
        state.ensureNewLine();
        state.write(fence);
        state.closeBlock(node);
    },
    heading (state, node) {
        state.write(state.repeat("#", node.attrs.level) + " ");
        state.renderInline(node);
        state.closeBlock(node);
    },
    horizontal_rule (state, node) {
        state.write(node.attrs.markup || "---");
        state.closeBlock(node);
    },
    bullet_list (state, node) {
        state.renderList(node, "  ", ()=>(node.attrs.bullet || "*") + " ");
    },
    ordered_list (state, node) {
        let start = node.attrs.order || 1;
        let maxW = String(start + node.childCount - 1).length;
        let space = state.repeat(" ", maxW + 2);
        state.renderList(node, space, (i)=>{
            let nStr = String(start + i);
            return state.repeat(" ", maxW - nStr.length) + nStr + ". ";
        });
    },
    list_item (state, node) {
        state.renderContent(node);
    },
    paragraph (state, node) {
        state.renderInline(node);
        state.closeBlock(node);
    },
    image (state, node) {
        state.write("![" + state.esc(node.attrs.alt || "") + "](" + node.attrs.src.replace(/[\(\)]/g, "\\$&") + (node.attrs.title ? ' "' + node.attrs.title.replace(/"/g, '\\"') + '"' : "") + ")");
    },
    hard_break (state, node, parent, index) {
        for(let i = index + 1; i < parent.childCount; i++)if (parent.child(i).type != node.type) {
            state.write("\\\n");
            return;
        }
    },
    text (state, node) {
        state.text(node.text, !state.inAutolink);
    }
}, {
    em: {
        open: "*",
        close: "*",
        mixable: true,
        expelEnclosingWhitespace: true
    },
    strong: {
        open: "**",
        close: "**",
        mixable: true,
        expelEnclosingWhitespace: true
    },
    link: {
        open (state, mark, parent, index) {
            state.inAutolink = $a7e510c892593f83$var$isPlainURL(mark, parent, index);
            return state.inAutolink ? "<" : "[";
        },
        close (state, mark, parent, index) {
            let { inAutolink: inAutolink  } = state;
            state.inAutolink = undefined;
            return inAutolink ? ">" : "](" + mark.attrs.href.replace(/[\(\)"]/g, "\\$&") + (mark.attrs.title ? ` "${mark.attrs.title.replace(/"/g, '\\"')}"` : "") + ")";
        },
        mixable: true
    },
    code: {
        open (_state, _mark, parent, index) {
            return $a7e510c892593f83$var$backticksFor(parent.child(index), -1);
        },
        close (_state, _mark, parent, index) {
            return $a7e510c892593f83$var$backticksFor(parent.child(index - 1), 1);
        },
        escape: false
    }
});
function $a7e510c892593f83$var$backticksFor(node, side) {
    let ticks = /`+/g, m, len = 0;
    if (node.isText) while(m = ticks.exec(node.text))len = Math.max(len, m[0].length);
    let result = len > 0 && side > 0 ? " `" : "`";
    for(let i = 0; i < len; i++)result += "`";
    if (len > 0 && side < 0) result += " ";
    return result;
}
function $a7e510c892593f83$var$isPlainURL(link, parent, index) {
    if (link.attrs.title || !/^\w+:/.test(link.attrs.href)) return false;
    let content = parent.child(index);
    if (!content.isText || content.text != link.attrs.href || content.marks[content.marks.length - 1] != link) return false;
    return index == parent.childCount - 1 || !link.isInSet(parent.child(index + 1).marks);
}
/**
This is an object used to track state and expose
methods related to markdown serialization. Instances are passed to
node and mark serialization methods (see `toMarkdown`).
*/ class $a7e510c892593f83$export$61055fa707e69319 {
    /**
    @internal
    */ constructor(/**
    @internal
    */ nodes, /**
    @internal
    */ marks, /**
    The options passed to the serializer.
    */ options){
        this.nodes = nodes;
        this.marks = marks;
        this.options = options;
        /**
        @internal
        */ this.delim = "";
        /**
        @internal
        */ this.out = "";
        /**
        @internal
        */ this.closed = null;
        /**
        @internal
        */ this.inAutolink = undefined;
        /**
        @internal
        */ this.atBlockStart = false;
        /**
        @internal
        */ this.inTightList = false;
        if (typeof this.options.tightLists == "undefined") this.options.tightLists = false;
    }
    /**
    @internal
    */ flushClose(size = 2) {
        if (this.closed) {
            if (!this.atBlank()) this.out += "\n";
            if (size > 1) {
                let delimMin = this.delim;
                let trim = /\s+$/.exec(delimMin);
                if (trim) delimMin = delimMin.slice(0, delimMin.length - trim[0].length);
                for(let i = 1; i < size; i++)this.out += delimMin + "\n";
            }
            this.closed = null;
        }
    }
    /**
    Render a block, prefixing each line with `delim`, and the first
    line in `firstDelim`. `node` should be the node that is closed at
    the end of the block, and `f` is a function that renders the
    content of the block.
    */ wrapBlock(delim, firstDelim, node, f) {
        let old = this.delim;
        this.write(firstDelim != null ? firstDelim : delim);
        this.delim += delim;
        f();
        this.delim = old;
        this.closeBlock(node);
    }
    /**
    @internal
    */ atBlank() {
        return /(^|\n)$/.test(this.out);
    }
    /**
    Ensure the current content ends with a newline.
    */ ensureNewLine() {
        if (!this.atBlank()) this.out += "\n";
    }
    /**
    Prepare the state for writing output (closing closed paragraphs,
    adding delimiters, and so on), and then optionally add content
    (unescaped) to the output.
    */ write(content) {
        this.flushClose();
        if (this.delim && this.atBlank()) this.out += this.delim;
        if (content) this.out += content;
    }
    /**
    Close the block for the given node.
    */ closeBlock(node) {
        this.closed = node;
    }
    /**
    Add the given text to the document. When escape is not `false`,
    it will be escaped.
    */ text(text, escape = true) {
        let lines = text.split("\n");
        for(let i = 0; i < lines.length; i++){
            this.write();
            // Escape exclamation marks in front of links
            if (!escape && lines[i][0] == "[" && /(^|[^\\])\!$/.test(this.out)) this.out = this.out.slice(0, this.out.length - 1) + "\\!";
            this.out += escape ? this.esc(lines[i], this.atBlockStart) : lines[i];
            if (i != lines.length - 1) this.out += "\n";
        }
    }
    /**
    Render the given node as a block.
    */ render(node, parent, index) {
        if (typeof parent == "number") throw new Error("!");
        if (!this.nodes[node.type.name]) throw new Error("Token type `" + node.type.name + "` not supported by Markdown renderer");
        this.nodes[node.type.name](this, node, parent, index);
    }
    /**
    Render the contents of `parent` as block nodes.
    */ renderContent(parent) {
        parent.forEach((node, _, i)=>this.render(node, parent, i));
    }
    /**
    Render the contents of `parent` as inline content.
    */ renderInline(parent) {
        this.atBlockStart = true;
        let active = [], trailing = "";
        let progress = (node, offset, index)=>{
            let marks = node ? node.marks : [];
            // Remove marks from `hard_break` that are the last node inside
            // that mark to prevent parser edge cases with new lines just
            // before closing marks.
            // (FIXME it'd be nice if we had a schema-agnostic way to
            // identify nodes that serialize as hard breaks)
            if (node && node.type.name === "hard_break") marks = marks.filter((m)=>{
                if (index + 1 == parent.childCount) return false;
                let next = parent.child(index + 1);
                return m.isInSet(next.marks) && (!next.isText || /\S/.test(next.text));
            });
            let leading = trailing;
            trailing = "";
            // If whitespace has to be expelled from the node, adjust
            // leading and trailing accordingly.
            if (node && node.isText && marks.some((mark)=>{
                let info = this.marks[mark.type.name];
                return info && info.expelEnclosingWhitespace && !(mark.isInSet(active) || index < parent.childCount - 1 && mark.isInSet(parent.child(index + 1).marks));
            })) {
                let [_, lead, inner, trail] = /^(\s*)(.*?)(\s*)$/m.exec(node.text);
                leading += lead;
                trailing = trail;
                if (lead || trail) {
                    node = inner ? node.withText(inner) : null;
                    if (!node) marks = active;
                }
            }
            let inner1 = marks.length ? marks[marks.length - 1] : null;
            let noEsc = inner1 && this.marks[inner1.type.name].escape === false;
            let len = marks.length - (noEsc ? 1 : 0);
            // Try to reorder 'mixable' marks, such as em and strong, which
            // in Markdown may be opened and closed in different order, so
            // that order of the marks for the token matches the order in
            // active.
            outer: for(let i = 0; i < len; i++){
                let mark = marks[i];
                if (!this.marks[mark.type.name].mixable) break;
                for(let j = 0; j < active.length; j++){
                    let other = active[j];
                    if (!this.marks[other.type.name].mixable) break;
                    if (mark.eq(other)) {
                        if (i > j) marks = marks.slice(0, j).concat(mark).concat(marks.slice(j, i)).concat(marks.slice(i + 1, len));
                        else if (j > i) marks = marks.slice(0, i).concat(marks.slice(i + 1, j)).concat(mark).concat(marks.slice(j, len));
                        continue outer;
                    }
                }
            }
            // Find the prefix of the mark set that didn't change
            let keep = 0;
            while(keep < Math.min(active.length, len) && marks[keep].eq(active[keep]))++keep;
            // Close the marks that need to be closed
            while(keep < active.length)this.text(this.markString(active.pop(), false, parent, index), false);
            // Output any previously expelled trailing whitespace outside the marks
            if (leading) this.text(leading);
            // Open the marks that need to be opened
            if (node) {
                while(active.length < len){
                    let add = marks[active.length];
                    active.push(add);
                    this.text(this.markString(add, true, parent, index), false);
                }
                // Render the node. Special case code marks, since their content
                // may not be escaped.
                if (noEsc && node.isText) this.text(this.markString(inner1, true, parent, index) + node.text + this.markString(inner1, false, parent, index + 1), false);
                else this.render(node, parent, index);
            }
        };
        parent.forEach(progress);
        progress(null, 0, parent.childCount);
        this.atBlockStart = false;
    }
    /**
    Render a node's content as a list. `delim` should be the extra
    indentation added to all lines except the first in an item,
    `firstDelim` is a function going from an item index to a
    delimiter for the first line of the item.
    */ renderList(node, delim, firstDelim) {
        if (this.closed && this.closed.type == node.type) this.flushClose(3);
        else if (this.inTightList) this.flushClose(1);
        let isTight = typeof node.attrs.tight != "undefined" ? node.attrs.tight : this.options.tightLists;
        let prevTight = this.inTightList;
        this.inTightList = isTight;
        node.forEach((child, _, i)=>{
            if (i && isTight) this.flushClose(1);
            this.wrapBlock(delim, firstDelim(i), node, ()=>this.render(child, node, i));
        });
        this.inTightList = prevTight;
    }
    /**
    Escape the given string so that it can safely appear in Markdown
    content. If `startOfLine` is true, also escape characters that
    have special meaning only at the start of the line.
    */ esc(str, startOfLine = false) {
        str = str.replace(/[`*\\~\[\]_]/g, (m, i)=>m == "_" && i > 0 && i + 1 < str.length && str[i - 1].match(/\w/) && str[i + 1].match(/\w/) ? m : "\\" + m);
        if (startOfLine) str = str.replace(/^[#\-*+>]/, "\\$&").replace(/^(\s*\d+)\./, "$1\\.");
        if (this.options.escapeExtraCharacters) str = str.replace(this.options.escapeExtraCharacters, "\\$&");
        return str;
    }
    /**
    @internal
    */ quote(str) {
        let wrap = str.indexOf('"') == -1 ? '""' : str.indexOf("'") == -1 ? "''" : "()";
        return wrap[0] + str + wrap[1];
    }
    /**
    Repeat the given string `n` times.
    */ repeat(str, n) {
        let out = "";
        for(let i = 0; i < n; i++)out += str;
        return out;
    }
    /**
    Get the markdown string for a given opening or closing mark.
    */ markString(mark, open, parent, index) {
        let info = this.marks[mark.type.name];
        let value = open ? info.open : info.close;
        return typeof value == "string" ? value : value(this, mark, parent, index);
    }
    /**
    Get leading and trailing whitespace from a string. Values of
    leading or trailing property of the return object will be undefined
    if there is no match.
    */ getEnclosingWhitespace(text) {
        return {
            leading: (text.match(/^(\s+)/) || [
                undefined
            ])[0],
            trailing: (text.match(/(\s+)$/) || [
                undefined
            ])[0]
        };
    }
}


var $5f4aa39adbb7b3a6$export$e2253033e6e1df16 = {
    8: "Backspace",
    9: "Tab",
    10: "Enter",
    12: "NumLock",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    44: "PrintScreen",
    45: "Insert",
    46: "Delete",
    59: ";",
    61: "=",
    91: "Meta",
    92: "Meta",
    106: "*",
    107: "+",
    108: ",",
    109: "-",
    110: ".",
    111: "/",
    144: "NumLock",
    145: "ScrollLock",
    160: "Shift",
    161: "Shift",
    162: "Control",
    163: "Control",
    164: "Alt",
    165: "Alt",
    173: "-",
    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "'"
};
var $5f4aa39adbb7b3a6$export$fba63a578e423eb = {
    48: ")",
    49: "!",
    50: "@",
    51: "#",
    52: "$",
    53: "%",
    54: "^",
    55: "&",
    56: "*",
    57: "(",
    59: ":",
    61: "+",
    173: "_",
    186: ":",
    187: "+",
    188: "<",
    189: "_",
    190: ">",
    191: "?",
    192: "~",
    219: "{",
    220: "|",
    221: "}",
    222: '"'
};
var $5f4aa39adbb7b3a6$var$chrome = typeof navigator != "undefined" && /Chrome\/(\d+)/.exec(navigator.userAgent);
var $5f4aa39adbb7b3a6$var$gecko = typeof navigator != "undefined" && /Gecko\/\d+/.test(navigator.userAgent);
var $5f4aa39adbb7b3a6$var$mac = typeof navigator != "undefined" && /Mac/.test(navigator.platform);
var $5f4aa39adbb7b3a6$var$ie = typeof navigator != "undefined" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
var $5f4aa39adbb7b3a6$var$brokenModifierNames = $5f4aa39adbb7b3a6$var$mac || $5f4aa39adbb7b3a6$var$chrome && +$5f4aa39adbb7b3a6$var$chrome[1] < 57;
// Fill in the digit keys
for(var $5f4aa39adbb7b3a6$var$i = 0; $5f4aa39adbb7b3a6$var$i < 10; $5f4aa39adbb7b3a6$var$i++)$5f4aa39adbb7b3a6$export$e2253033e6e1df16[48 + $5f4aa39adbb7b3a6$var$i] = $5f4aa39adbb7b3a6$export$e2253033e6e1df16[96 + $5f4aa39adbb7b3a6$var$i] = String($5f4aa39adbb7b3a6$var$i);
// The function keys
for(var $5f4aa39adbb7b3a6$var$i = 1; $5f4aa39adbb7b3a6$var$i <= 24; $5f4aa39adbb7b3a6$var$i++)$5f4aa39adbb7b3a6$export$e2253033e6e1df16[$5f4aa39adbb7b3a6$var$i + 111] = "F" + $5f4aa39adbb7b3a6$var$i;
// And the alphabetic keys
for(var $5f4aa39adbb7b3a6$var$i = 65; $5f4aa39adbb7b3a6$var$i <= 90; $5f4aa39adbb7b3a6$var$i++){
    $5f4aa39adbb7b3a6$export$e2253033e6e1df16[$5f4aa39adbb7b3a6$var$i] = String.fromCharCode($5f4aa39adbb7b3a6$var$i + 32);
    $5f4aa39adbb7b3a6$export$fba63a578e423eb[$5f4aa39adbb7b3a6$var$i] = String.fromCharCode($5f4aa39adbb7b3a6$var$i);
}
// For each code that doesn't have a shift-equivalent, copy the base name
for(var $5f4aa39adbb7b3a6$var$code in $5f4aa39adbb7b3a6$export$e2253033e6e1df16)if (!$5f4aa39adbb7b3a6$export$fba63a578e423eb.hasOwnProperty($5f4aa39adbb7b3a6$var$code)) $5f4aa39adbb7b3a6$export$fba63a578e423eb[$5f4aa39adbb7b3a6$var$code] = $5f4aa39adbb7b3a6$export$e2253033e6e1df16[$5f4aa39adbb7b3a6$var$code];
function $5f4aa39adbb7b3a6$export$fb33aafd75404f4c(event) {
    var ignoreKey = $5f4aa39adbb7b3a6$var$brokenModifierNames && (event.ctrlKey || event.altKey || event.metaKey) || $5f4aa39adbb7b3a6$var$ie && event.shiftKey && event.key && event.key.length == 1 || event.key == "Unidentified";
    var name = !ignoreKey && event.key || (event.shiftKey ? $5f4aa39adbb7b3a6$export$fba63a578e423eb : $5f4aa39adbb7b3a6$export$e2253033e6e1df16)[event.keyCode] || event.key || "Unidentified";
    // Edge sometimes produces wrong names (Issue #3)
    if (name == "Esc") name = "Escape";
    if (name == "Del") name = "Delete";
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8860571/
    if (name == "Left") name = "ArrowLeft";
    if (name == "Up") name = "ArrowUp";
    if (name == "Right") name = "ArrowRight";
    if (name == "Down") name = "ArrowDown";
    return name;
}



const $fcb9d6c1d1df53fa$var$mac = typeof navigator != "undefined" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : false;
function $fcb9d6c1d1df53fa$var$normalizeKeyName(name) {
    let parts = name.split(/-(?!$)/), result = parts[parts.length - 1];
    if (result == "Space") result = " ";
    let alt, ctrl, shift, meta;
    for(let i = 0; i < parts.length - 1; i++){
        let mod = parts[i];
        if (/^(cmd|meta|m)$/i.test(mod)) meta = true;
        else if (/^a(lt)?$/i.test(mod)) alt = true;
        else if (/^(c|ctrl|control)$/i.test(mod)) ctrl = true;
        else if (/^s(hift)?$/i.test(mod)) shift = true;
        else if (/^mod$/i.test(mod)) {
            if ($fcb9d6c1d1df53fa$var$mac) meta = true;
            else ctrl = true;
        } else throw new Error("Unrecognized modifier name: " + mod);
    }
    if (alt) result = "Alt-" + result;
    if (ctrl) result = "Ctrl-" + result;
    if (meta) result = "Meta-" + result;
    if (shift) result = "Shift-" + result;
    return result;
}
function $fcb9d6c1d1df53fa$var$normalize(map) {
    let copy = Object.create(null);
    for(let prop in map)copy[$fcb9d6c1d1df53fa$var$normalizeKeyName(prop)] = map[prop];
    return copy;
}
function $fcb9d6c1d1df53fa$var$modifiers(name, event, shift) {
    if (event.altKey) name = "Alt-" + name;
    if (event.ctrlKey) name = "Ctrl-" + name;
    if (event.metaKey) name = "Meta-" + name;
    if (shift !== false && event.shiftKey) name = "Shift-" + name;
    return name;
}
/**
Create a keymap plugin for the given set of bindings.

Bindings should map key names to [command](https://prosemirror.net/docs/ref/#commands)-style
functions, which will be called with `(EditorState, dispatch,
EditorView)` arguments, and should return true when they've handled
the key. Note that the view argument isn't part of the command
protocol, but can be used as an escape hatch if a binding needs to
directly interact with the UI.

Key names may be strings like `"Shift-Ctrl-Enter"`—a key
identifier prefixed with zero or more modifiers. Key identifiers
are based on the strings that can appear in
[`KeyEvent.key`](https:developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key).
Use lowercase letters to refer to letter keys (or uppercase letters
if you want shift to be held). You may use `"Space"` as an alias
for the `" "` name.

Modifiers can be given in any order. `Shift-` (or `s-`), `Alt-` (or
`a-`), `Ctrl-` (or `c-` or `Control-`) and `Cmd-` (or `m-` or
`Meta-`) are recognized. For characters that are created by holding
shift, the `Shift-` prefix is implied, and should not be added
explicitly.

You can use `Mod-` as a shorthand for `Cmd-` on Mac and `Ctrl-` on
other platforms.

You can add multiple keymap plugins to an editor. The order in
which they appear determines their precedence (the ones early in
the array get to dispatch first).
*/ function $fcb9d6c1d1df53fa$export$5043418e2ef368d5(bindings) {
    return new (0, $ee27db283572d394$export$901cf72dabf2112a)({
        props: {
            handleKeyDown: $fcb9d6c1d1df53fa$export$53f558754f8b9fd1(bindings)
        }
    });
}
/**
Given a set of bindings (using the same format as
[`keymap`](https://prosemirror.net/docs/ref/#keymap.keymap)), return a [keydown
handler](https://prosemirror.net/docs/ref/#view.EditorProps.handleKeyDown) that handles them.
*/ function $fcb9d6c1d1df53fa$export$53f558754f8b9fd1(bindings) {
    let map = $fcb9d6c1d1df53fa$var$normalize(bindings);
    return function(view, event) {
        let name = (0, $5f4aa39adbb7b3a6$export$fb33aafd75404f4c)(event), isChar = name.length == 1 && name != " ", baseName;
        let direct = map[$fcb9d6c1d1df53fa$var$modifiers(name, event, !isChar)];
        if (direct && direct(view.state, view.dispatch, view)) return true;
        if (isChar && (event.shiftKey || event.altKey || event.metaKey || name.charCodeAt(0) > 127) && (baseName = (0, $5f4aa39adbb7b3a6$export$e2253033e6e1df16)[event.keyCode]) && baseName != name) {
            // Try falling back to the keyCode when there's a modifier
            // active or the character produced isn't ASCII, and our table
            // produces a different name from the the keyCode. See #668,
            // #1060
            let fromCode = map[$fcb9d6c1d1df53fa$var$modifiers(baseName, event, true)];
            if (fromCode && fromCode(view.state, view.dispatch, view)) return true;
        } else if (isChar && event.shiftKey) {
            // Otherwise, if shift is active, also try the binding with the
            // Shift- prefix enabled. See #997
            let withShift = map[$fcb9d6c1d1df53fa$var$modifiers(name, event, true)];
            if (withShift && withShift(view.state, view.dispatch, view)) return true;
        }
        return false;
    };
}


var $7e181e660540cc35$var$GOOD_LEAF_SIZE = 200;
// :: class<T> A rope sequence is a persistent sequence data structure
// that supports appending, prepending, and slicing without doing a
// full copy. It is represented as a mostly-balanced tree.
var $7e181e660540cc35$var$RopeSequence = function RopeSequence() {};
$7e181e660540cc35$var$RopeSequence.prototype.append = function append(other) {
    if (!other.length) return this;
    other = $7e181e660540cc35$var$RopeSequence.from(other);
    return !this.length && other || other.length < $7e181e660540cc35$var$GOOD_LEAF_SIZE && this.leafAppend(other) || this.length < $7e181e660540cc35$var$GOOD_LEAF_SIZE && other.leafPrepend(this) || this.appendInner(other);
};
// :: (union<[T], RopeSequence<T>>) → RopeSequence<T>
// Prepend an array or other rope to this one, returning a new rope.
$7e181e660540cc35$var$RopeSequence.prototype.prepend = function prepend(other) {
    if (!other.length) return this;
    return $7e181e660540cc35$var$RopeSequence.from(other).append(this);
};
$7e181e660540cc35$var$RopeSequence.prototype.appendInner = function appendInner(other) {
    return new $7e181e660540cc35$var$Append(this, other);
};
// :: (?number, ?number) → RopeSequence<T>
// Create a rope repesenting a sub-sequence of this rope.
$7e181e660540cc35$var$RopeSequence.prototype.slice = function slice(from, to) {
    if (from === void 0) from = 0;
    if (to === void 0) to = this.length;
    if (from >= to) return $7e181e660540cc35$var$RopeSequence.empty;
    return this.sliceInner(Math.max(0, from), Math.min(this.length, to));
};
// :: (number) → T
// Retrieve the element at the given position from this rope.
$7e181e660540cc35$var$RopeSequence.prototype.get = function get(i) {
    if (i < 0 || i >= this.length) return undefined;
    return this.getInner(i);
};
// :: ((element: T, index: number) → ?bool, ?number, ?number)
// Call the given function for each element between the given
// indices. This tends to be more efficient than looping over the
// indices and calling `get`, because it doesn't have to descend the
// tree for every element.
$7e181e660540cc35$var$RopeSequence.prototype.forEach = function forEach(f, from, to) {
    if (from === void 0) from = 0;
    if (to === void 0) to = this.length;
    if (from <= to) this.forEachInner(f, from, to, 0);
    else this.forEachInvertedInner(f, from, to, 0);
};
// :: ((element: T, index: number) → U, ?number, ?number) → [U]
// Map the given functions over the elements of the rope, producing
// a flat array.
$7e181e660540cc35$var$RopeSequence.prototype.map = function map(f, from, to) {
    if (from === void 0) from = 0;
    if (to === void 0) to = this.length;
    var result = [];
    this.forEach(function(elt, i) {
        return result.push(f(elt, i));
    }, from, to);
    return result;
};
// :: (?union<[T], RopeSequence<T>>) → RopeSequence<T>
// Create a rope representing the given array, or return the rope
// itself if a rope was given.
$7e181e660540cc35$var$RopeSequence.from = function from(values) {
    if (values instanceof $7e181e660540cc35$var$RopeSequence) return values;
    return values && values.length ? new $7e181e660540cc35$var$Leaf(values) : $7e181e660540cc35$var$RopeSequence.empty;
};
var $7e181e660540cc35$var$Leaf = /*@__PURE__*/ function(RopeSequence) {
    function Leaf(values) {
        RopeSequence.call(this);
        this.values = values;
    }
    if (RopeSequence) Leaf.__proto__ = RopeSequence;
    Leaf.prototype = Object.create(RopeSequence && RopeSequence.prototype);
    Leaf.prototype.constructor = Leaf;
    var prototypeAccessors = {
        length: {
            configurable: true
        },
        depth: {
            configurable: true
        }
    };
    Leaf.prototype.flatten = function flatten() {
        return this.values;
    };
    Leaf.prototype.sliceInner = function sliceInner(from, to) {
        if (from == 0 && to == this.length) return this;
        return new Leaf(this.values.slice(from, to));
    };
    Leaf.prototype.getInner = function getInner(i) {
        return this.values[i];
    };
    Leaf.prototype.forEachInner = function forEachInner(f, from, to, start) {
        for(var i = from; i < to; i++){
            if (f(this.values[i], start + i) === false) return false;
        }
    };
    Leaf.prototype.forEachInvertedInner = function forEachInvertedInner(f, from, to, start) {
        for(var i = from - 1; i >= to; i--){
            if (f(this.values[i], start + i) === false) return false;
        }
    };
    Leaf.prototype.leafAppend = function leafAppend(other) {
        if (this.length + other.length <= $7e181e660540cc35$var$GOOD_LEAF_SIZE) return new Leaf(this.values.concat(other.flatten()));
    };
    Leaf.prototype.leafPrepend = function leafPrepend(other) {
        if (this.length + other.length <= $7e181e660540cc35$var$GOOD_LEAF_SIZE) return new Leaf(other.flatten().concat(this.values));
    };
    prototypeAccessors.length.get = function() {
        return this.values.length;
    };
    prototypeAccessors.depth.get = function() {
        return 0;
    };
    Object.defineProperties(Leaf.prototype, prototypeAccessors);
    return Leaf;
}($7e181e660540cc35$var$RopeSequence);
// :: RopeSequence
// The empty rope sequence.
$7e181e660540cc35$var$RopeSequence.empty = new $7e181e660540cc35$var$Leaf([]);
var $7e181e660540cc35$var$Append = /*@__PURE__*/ function(RopeSequence) {
    function Append(left, right) {
        RopeSequence.call(this);
        this.left = left;
        this.right = right;
        this.length = left.length + right.length;
        this.depth = Math.max(left.depth, right.depth) + 1;
    }
    if (RopeSequence) Append.__proto__ = RopeSequence;
    Append.prototype = Object.create(RopeSequence && RopeSequence.prototype);
    Append.prototype.constructor = Append;
    Append.prototype.flatten = function flatten() {
        return this.left.flatten().concat(this.right.flatten());
    };
    Append.prototype.getInner = function getInner(i) {
        return i < this.left.length ? this.left.get(i) : this.right.get(i - this.left.length);
    };
    Append.prototype.forEachInner = function forEachInner(f, from, to, start) {
        var leftLen = this.left.length;
        if (from < leftLen && this.left.forEachInner(f, from, Math.min(to, leftLen), start) === false) return false;
        if (to > leftLen && this.right.forEachInner(f, Math.max(from - leftLen, 0), Math.min(this.length, to) - leftLen, start + leftLen) === false) return false;
    };
    Append.prototype.forEachInvertedInner = function forEachInvertedInner(f, from, to, start) {
        var leftLen = this.left.length;
        if (from > leftLen && this.right.forEachInvertedInner(f, from - leftLen, Math.max(to, leftLen) - leftLen, start + leftLen) === false) return false;
        if (to < leftLen && this.left.forEachInvertedInner(f, Math.min(from, leftLen), to, start) === false) return false;
    };
    Append.prototype.sliceInner = function sliceInner(from, to) {
        if (from == 0 && to == this.length) return this;
        var leftLen = this.left.length;
        if (to <= leftLen) return this.left.slice(from, to);
        if (from >= leftLen) return this.right.slice(from - leftLen, to - leftLen);
        return this.left.slice(from, leftLen).append(this.right.slice(0, to - leftLen));
    };
    Append.prototype.leafAppend = function leafAppend(other) {
        var inner = this.right.leafAppend(other);
        if (inner) return new Append(this.left, inner);
    };
    Append.prototype.leafPrepend = function leafPrepend(other) {
        var inner = this.left.leafPrepend(other);
        if (inner) return new Append(inner, this.right);
    };
    Append.prototype.appendInner = function appendInner(other) {
        if (this.left.depth >= Math.max(this.right.depth, other.depth) + 1) return new Append(this.left, new Append(this.right, other));
        return new Append(this, other);
    };
    return Append;
}($7e181e660540cc35$var$RopeSequence);
var $7e181e660540cc35$var$ropeSequence = $7e181e660540cc35$var$RopeSequence;
var $7e181e660540cc35$export$2e2bcd8739ae039 = $7e181e660540cc35$var$ropeSequence;




// ProseMirror's history isn't simply a way to roll back to a previous
// state, because ProseMirror supports applying changes without adding
// them to the history (for example during collaboration).
//
// To this end, each 'Branch' (one for the undo history and one for
// the redo history) keeps an array of 'Items', which can optionally
// hold a step (an actual undoable change), and always hold a position
// map (which is needed to move changes below them to apply to the
// current document).
//
// An item that has both a step and a selection bookmark is the start
// of an 'event' — a group of changes that will be undone or redone at
// once. (It stores only the bookmark, since that way we don't have to
// provide a document until the selection is actually applied, which
// is useful when compressing.)
// Used to schedule history compression
const $46a6b29ccac0c6da$var$max_empty_items = 500;
class $46a6b29ccac0c6da$var$Branch {
    constructor(items, eventCount){
        this.items = items;
        this.eventCount = eventCount;
    }
    // Pop the latest event off the branch's history and apply it
    // to a document transform.
    popEvent(state, preserveItems) {
        if (this.eventCount == 0) return null;
        let end = this.items.length;
        for(;; end--){
            let next = this.items.get(end - 1);
            if (next.selection) {
                --end;
                break;
            }
        }
        let remap, mapFrom;
        if (preserveItems) {
            remap = this.remapping(end, this.items.length);
            mapFrom = remap.maps.length;
        }
        let transform = state.tr;
        let selection, remaining;
        let addAfter = [], addBefore = [];
        this.items.forEach((item, i)=>{
            if (!item.step) {
                if (!remap) {
                    remap = this.remapping(end, i + 1);
                    mapFrom = remap.maps.length;
                }
                mapFrom--;
                addBefore.push(item);
                return;
            }
            if (remap) {
                addBefore.push(new $46a6b29ccac0c6da$var$Item(item.map));
                let step = item.step.map(remap.slice(mapFrom)), map;
                if (step && transform.maybeStep(step).doc) {
                    map = transform.mapping.maps[transform.mapping.maps.length - 1];
                    addAfter.push(new $46a6b29ccac0c6da$var$Item(map, undefined, undefined, addAfter.length + addBefore.length));
                }
                mapFrom--;
                if (map) remap.appendMap(map, mapFrom);
            } else transform.maybeStep(item.step);
            if (item.selection) {
                selection = remap ? item.selection.map(remap.slice(mapFrom)) : item.selection;
                remaining = new $46a6b29ccac0c6da$var$Branch(this.items.slice(0, end).append(addBefore.reverse().concat(addAfter)), this.eventCount - 1);
                return false;
            }
        }, this.items.length, 0);
        return {
            remaining: remaining,
            transform: transform,
            selection: selection
        };
    }
    // Create a new branch with the given transform added.
    addTransform(transform, selection, histOptions, preserveItems) {
        let newItems = [], eventCount = this.eventCount;
        let oldItems = this.items, lastItem = !preserveItems && oldItems.length ? oldItems.get(oldItems.length - 1) : null;
        for(let i = 0; i < transform.steps.length; i++){
            let step = transform.steps[i].invert(transform.docs[i]);
            let item = new $46a6b29ccac0c6da$var$Item(transform.mapping.maps[i], step, selection), merged;
            if (merged = lastItem && lastItem.merge(item)) {
                item = merged;
                if (i) newItems.pop();
                else oldItems = oldItems.slice(0, oldItems.length - 1);
            }
            newItems.push(item);
            if (selection) {
                eventCount++;
                selection = undefined;
            }
            if (!preserveItems) lastItem = item;
        }
        let overflow = eventCount - histOptions.depth;
        if (overflow > $46a6b29ccac0c6da$var$DEPTH_OVERFLOW) {
            oldItems = $46a6b29ccac0c6da$var$cutOffEvents(oldItems, overflow);
            eventCount -= overflow;
        }
        return new $46a6b29ccac0c6da$var$Branch(oldItems.append(newItems), eventCount);
    }
    remapping(from, to) {
        let maps = new (0, $5dfe06a1d53a4883$export$f5f785078011b62);
        this.items.forEach((item, i)=>{
            let mirrorPos = item.mirrorOffset != null && i - item.mirrorOffset >= from ? maps.maps.length - item.mirrorOffset : undefined;
            maps.appendMap(item.map, mirrorPos);
        }, from, to);
        return maps;
    }
    addMaps(array) {
        if (this.eventCount == 0) return this;
        return new $46a6b29ccac0c6da$var$Branch(this.items.append(array.map((map)=>new $46a6b29ccac0c6da$var$Item(map))), this.eventCount);
    }
    // When the collab module receives remote changes, the history has
    // to know about those, so that it can adjust the steps that were
    // rebased on top of the remote changes, and include the position
    // maps for the remote changes in its array of items.
    rebased(rebasedTransform, rebasedCount) {
        if (!this.eventCount) return this;
        let rebasedItems = [], start = Math.max(0, this.items.length - rebasedCount);
        let mapping = rebasedTransform.mapping;
        let newUntil = rebasedTransform.steps.length;
        let eventCount = this.eventCount;
        this.items.forEach((item)=>{
            if (item.selection) eventCount--;
        }, start);
        let iRebased = rebasedCount;
        this.items.forEach((item)=>{
            let pos = mapping.getMirror(--iRebased);
            if (pos == null) return;
            newUntil = Math.min(newUntil, pos);
            let map = mapping.maps[pos];
            if (item.step) {
                let step = rebasedTransform.steps[pos].invert(rebasedTransform.docs[pos]);
                let selection = item.selection && item.selection.map(mapping.slice(iRebased + 1, pos));
                if (selection) eventCount++;
                rebasedItems.push(new $46a6b29ccac0c6da$var$Item(map, step, selection));
            } else rebasedItems.push(new $46a6b29ccac0c6da$var$Item(map));
        }, start);
        let newMaps = [];
        for(let i = rebasedCount; i < newUntil; i++)newMaps.push(new $46a6b29ccac0c6da$var$Item(mapping.maps[i]));
        let items = this.items.slice(0, start).append(newMaps).append(rebasedItems);
        let branch = new $46a6b29ccac0c6da$var$Branch(items, eventCount);
        if (branch.emptyItemCount() > $46a6b29ccac0c6da$var$max_empty_items) branch = branch.compress(this.items.length - rebasedItems.length);
        return branch;
    }
    emptyItemCount() {
        let count = 0;
        this.items.forEach((item)=>{
            if (!item.step) count++;
        });
        return count;
    }
    // Compressing a branch means rewriting it to push the air (map-only
    // items) out. During collaboration, these naturally accumulate
    // because each remote change adds one. The `upto` argument is used
    // to ensure that only the items below a given level are compressed,
    // because `rebased` relies on a clean, untouched set of items in
    // order to associate old items with rebased steps.
    compress(upto = this.items.length) {
        let remap = this.remapping(0, upto), mapFrom = remap.maps.length;
        let items = [], events = 0;
        this.items.forEach((item, i)=>{
            if (i >= upto) {
                items.push(item);
                if (item.selection) events++;
            } else if (item.step) {
                let step = item.step.map(remap.slice(mapFrom)), map = step && step.getMap();
                mapFrom--;
                if (map) remap.appendMap(map, mapFrom);
                if (step) {
                    let selection = item.selection && item.selection.map(remap.slice(mapFrom));
                    if (selection) events++;
                    let newItem = new $46a6b29ccac0c6da$var$Item(map.invert(), step, selection), merged, last = items.length - 1;
                    if (merged = items.length && items[last].merge(newItem)) items[last] = merged;
                    else items.push(newItem);
                }
            } else if (item.map) mapFrom--;
        }, this.items.length, 0);
        return new $46a6b29ccac0c6da$var$Branch((0, $7e181e660540cc35$export$2e2bcd8739ae039).from(items.reverse()), events);
    }
}
$46a6b29ccac0c6da$var$Branch.empty = new $46a6b29ccac0c6da$var$Branch((0, $7e181e660540cc35$export$2e2bcd8739ae039).empty, 0);
function $46a6b29ccac0c6da$var$cutOffEvents(items, n) {
    let cutPoint;
    items.forEach((item, i)=>{
        if (item.selection && n-- == 0) {
            cutPoint = i;
            return false;
        }
    });
    return items.slice(cutPoint);
}
class $46a6b29ccac0c6da$var$Item {
    constructor(// The (forward) step map for this item.
    map, // The inverted step
    step, // If this is non-null, this item is the start of a group, and
    // this selection is the starting selection for the group (the one
    // that was active before the first step was applied)
    selection, // If this item is the inverse of a previous mapping on the stack,
    // this points at the inverse's offset
    mirrorOffset){
        this.map = map;
        this.step = step;
        this.selection = selection;
        this.mirrorOffset = mirrorOffset;
    }
    merge(other) {
        if (this.step && other.step && !other.selection) {
            let step = other.step.merge(this.step);
            if (step) return new $46a6b29ccac0c6da$var$Item(step.getMap().invert(), step, this.selection);
        }
    }
}
// The value of the state field that tracks undo/redo history for that
// state. Will be stored in the plugin state when the history plugin
// is active.
class $46a6b29ccac0c6da$var$HistoryState {
    constructor(done, undone, prevRanges, prevTime){
        this.done = done;
        this.undone = undone;
        this.prevRanges = prevRanges;
        this.prevTime = prevTime;
    }
}
const $46a6b29ccac0c6da$var$DEPTH_OVERFLOW = 20;
// Record a transformation in undo history.
function $46a6b29ccac0c6da$var$applyTransaction(history, state, tr, options) {
    let historyTr = tr.getMeta($46a6b29ccac0c6da$var$historyKey), rebased;
    if (historyTr) return historyTr.historyState;
    if (tr.getMeta($46a6b29ccac0c6da$var$closeHistoryKey)) history = new $46a6b29ccac0c6da$var$HistoryState(history.done, history.undone, null, 0);
    let appended = tr.getMeta("appendedTransaction");
    if (tr.steps.length == 0) return history;
    else if (appended && appended.getMeta($46a6b29ccac0c6da$var$historyKey)) {
        if (appended.getMeta($46a6b29ccac0c6da$var$historyKey).redo) return new $46a6b29ccac0c6da$var$HistoryState(history.done.addTransform(tr, undefined, options, $46a6b29ccac0c6da$var$mustPreserveItems(state)), history.undone, $46a6b29ccac0c6da$var$rangesFor(tr.mapping.maps[tr.steps.length - 1]), history.prevTime);
        else return new $46a6b29ccac0c6da$var$HistoryState(history.done, history.undone.addTransform(tr, undefined, options, $46a6b29ccac0c6da$var$mustPreserveItems(state)), null, history.prevTime);
    } else if (tr.getMeta("addToHistory") !== false && !(appended && appended.getMeta("addToHistory") === false)) {
        // Group transforms that occur in quick succession into one event.
        let newGroup = history.prevTime == 0 || !appended && (history.prevTime < (tr.time || 0) - options.newGroupDelay || !$46a6b29ccac0c6da$var$isAdjacentTo(tr, history.prevRanges));
        let prevRanges = appended ? $46a6b29ccac0c6da$var$mapRanges(history.prevRanges, tr.mapping) : $46a6b29ccac0c6da$var$rangesFor(tr.mapping.maps[tr.steps.length - 1]);
        return new $46a6b29ccac0c6da$var$HistoryState(history.done.addTransform(tr, newGroup ? state.selection.getBookmark() : undefined, options, $46a6b29ccac0c6da$var$mustPreserveItems(state)), $46a6b29ccac0c6da$var$Branch.empty, prevRanges, tr.time);
    } else if (rebased = tr.getMeta("rebased")) // Used by the collab module to tell the history that some of its
    // content has been rebased.
    return new $46a6b29ccac0c6da$var$HistoryState(history.done.rebased(tr, rebased), history.undone.rebased(tr, rebased), $46a6b29ccac0c6da$var$mapRanges(history.prevRanges, tr.mapping), history.prevTime);
    else return new $46a6b29ccac0c6da$var$HistoryState(history.done.addMaps(tr.mapping.maps), history.undone.addMaps(tr.mapping.maps), $46a6b29ccac0c6da$var$mapRanges(history.prevRanges, tr.mapping), history.prevTime);
}
function $46a6b29ccac0c6da$var$isAdjacentTo(transform, prevRanges) {
    if (!prevRanges) return false;
    if (!transform.docChanged) return true;
    let adjacent = false;
    transform.mapping.maps[0].forEach((start, end)=>{
        for(let i = 0; i < prevRanges.length; i += 2)if (start <= prevRanges[i + 1] && end >= prevRanges[i]) adjacent = true;
    });
    return adjacent;
}
function $46a6b29ccac0c6da$var$rangesFor(map) {
    let result = [];
    map.forEach((_from, _to, from, to)=>result.push(from, to));
    return result;
}
function $46a6b29ccac0c6da$var$mapRanges(ranges, mapping) {
    if (!ranges) return null;
    let result = [];
    for(let i = 0; i < ranges.length; i += 2){
        let from = mapping.map(ranges[i], 1), to = mapping.map(ranges[i + 1], -1);
        if (from <= to) result.push(from, to);
    }
    return result;
}
// Apply the latest event from one branch to the document and shift the event
// onto the other branch.
function $46a6b29ccac0c6da$var$histTransaction(history, state, dispatch, redo) {
    let preserveItems = $46a6b29ccac0c6da$var$mustPreserveItems(state);
    let histOptions = $46a6b29ccac0c6da$var$historyKey.get(state).spec.config;
    let pop = (redo ? history.undone : history.done).popEvent(state, preserveItems);
    if (!pop) return;
    let selection = pop.selection.resolve(pop.transform.doc);
    let added = (redo ? history.done : history.undone).addTransform(pop.transform, state.selection.getBookmark(), histOptions, preserveItems);
    let newHist = new $46a6b29ccac0c6da$var$HistoryState(redo ? added : pop.remaining, redo ? pop.remaining : added, null, 0);
    dispatch(pop.transform.setSelection(selection).setMeta($46a6b29ccac0c6da$var$historyKey, {
        redo: redo,
        historyState: newHist
    }).scrollIntoView());
}
let $46a6b29ccac0c6da$var$cachedPreserveItems = false, $46a6b29ccac0c6da$var$cachedPreserveItemsPlugins = null;
// Check whether any plugin in the given state has a
// `historyPreserveItems` property in its spec, in which case we must
// preserve steps exactly as they came in, so that they can be
// rebased.
function $46a6b29ccac0c6da$var$mustPreserveItems(state) {
    let plugins = state.plugins;
    if ($46a6b29ccac0c6da$var$cachedPreserveItemsPlugins != plugins) {
        $46a6b29ccac0c6da$var$cachedPreserveItems = false;
        $46a6b29ccac0c6da$var$cachedPreserveItemsPlugins = plugins;
        for(let i = 0; i < plugins.length; i++)if (plugins[i].spec.historyPreserveItems) {
            $46a6b29ccac0c6da$var$cachedPreserveItems = true;
            break;
        }
    }
    return $46a6b29ccac0c6da$var$cachedPreserveItems;
}
/**
Set a flag on the given transaction that will prevent further steps
from being appended to an existing history event (so that they
require a separate undo command to undo).
*/ function $46a6b29ccac0c6da$export$181a649d919c589e(tr) {
    return tr.setMeta($46a6b29ccac0c6da$var$closeHistoryKey, true);
}
const $46a6b29ccac0c6da$var$historyKey = new (0, $ee27db283572d394$export$1692d8b0e89cecc3)("history");
const $46a6b29ccac0c6da$var$closeHistoryKey = new (0, $ee27db283572d394$export$1692d8b0e89cecc3)("closeHistory");
/**
Returns a plugin that enables the undo history for an editor. The
plugin will track undo and redo stacks, which can be used with the
[`undo`](https://prosemirror.net/docs/ref/#history.undo) and [`redo`](https://prosemirror.net/docs/ref/#history.redo) commands.

You can set an `"addToHistory"` [metadata
property](https://prosemirror.net/docs/ref/#state.Transaction.setMeta) of `false` on a transaction
to prevent it from being rolled back by undo.
*/ function $46a6b29ccac0c6da$export$55abd4691b317664(config = {}) {
    config = {
        depth: config.depth || 100,
        newGroupDelay: config.newGroupDelay || 500
    };
    return new (0, $ee27db283572d394$export$901cf72dabf2112a)({
        key: $46a6b29ccac0c6da$var$historyKey,
        state: {
            init () {
                return new $46a6b29ccac0c6da$var$HistoryState($46a6b29ccac0c6da$var$Branch.empty, $46a6b29ccac0c6da$var$Branch.empty, null, 0);
            },
            apply (tr, hist, state) {
                return $46a6b29ccac0c6da$var$applyTransaction(hist, state, tr, config);
            }
        },
        config: config,
        props: {
            handleDOMEvents: {
                beforeinput (view, e) {
                    let inputType = e.inputType;
                    let command = inputType == "historyUndo" ? $46a6b29ccac0c6da$export$21f930c44940fd98 : inputType == "historyRedo" ? $46a6b29ccac0c6da$export$1688e416fee0a49e : null;
                    if (!command) return false;
                    e.preventDefault();
                    return command(view.state, view.dispatch);
                }
            }
        }
    });
}
/**
A command function that undoes the last change, if any.
*/ const $46a6b29ccac0c6da$export$21f930c44940fd98 = (state, dispatch)=>{
    let hist = $46a6b29ccac0c6da$var$historyKey.getState(state);
    if (!hist || hist.done.eventCount == 0) return false;
    if (dispatch) $46a6b29ccac0c6da$var$histTransaction(hist, state, dispatch, false);
    return true;
};
/**
A command function that redoes the last undone change, if any.
*/ const $46a6b29ccac0c6da$export$1688e416fee0a49e = (state, dispatch)=>{
    let hist = $46a6b29ccac0c6da$var$historyKey.getState(state);
    if (!hist || hist.undone.eventCount == 0) return false;
    if (dispatch) $46a6b29ccac0c6da$var$histTransaction(hist, state, dispatch, true);
    return true;
};
/**
The amount of undoable events available in a given state.
*/ function $46a6b29ccac0c6da$export$f8a176c2b9a10bdb(state) {
    let hist = $46a6b29ccac0c6da$var$historyKey.getState(state);
    return hist ? hist.done.eventCount : 0;
}
/**
The amount of redoable events available in a given editor state.
*/ function $46a6b29ccac0c6da$export$3ffe6b288e7d941b(state) {
    let hist = $46a6b29ccac0c6da$var$historyKey.getState(state);
    return hist ? hist.undone.eventCount : 0;
}





/**
Delete the selection, if there is one.
*/ const $694358249add86fd$export$e9a518a637d1e641 = (state, dispatch)=>{
    if (state.selection.empty) return false;
    if (dispatch) dispatch(state.tr.deleteSelection().scrollIntoView());
    return true;
};
function $694358249add86fd$var$atBlockStart(state, view) {
    let { $cursor: $cursor  } = state.selection;
    if (!$cursor || (view ? !view.endOfTextblock("backward", state) : $cursor.parentOffset > 0)) return null;
    return $cursor;
}
/**
If the selection is empty and at the start of a textblock, try to
reduce the distance between that block and the one before it—if
there's a block directly before it that can be joined, join them.
If not, try to move the selected block closer to the next one in
the document structure by lifting it out of its parent or moving it
into a parent of the previous block. Will use the view for accurate
(bidi-aware) start-of-textblock detection if given.
*/ const $694358249add86fd$export$979097b097459299 = (state, dispatch, view)=>{
    let $cursor = $694358249add86fd$var$atBlockStart(state, view);
    if (!$cursor) return false;
    let $cut = $694358249add86fd$var$findCutBefore($cursor);
    // If there is no node before this, try to lift
    if (!$cut) {
        let range = $cursor.blockRange(), target = range && (0, $5dfe06a1d53a4883$export$f1508b72cc76a09e)(range);
        if (target == null) return false;
        if (dispatch) dispatch(state.tr.lift(range, target).scrollIntoView());
        return true;
    }
    let before = $cut.nodeBefore;
    // Apply the joining algorithm
    if (!before.type.spec.isolating && $694358249add86fd$var$deleteBarrier(state, $cut, dispatch)) return true;
    // If the node below has no content and the node above is
    // selectable, delete the node below and select the one above.
    if ($cursor.parent.content.size == 0 && ($694358249add86fd$var$textblockAt(before, "end") || (0, $ee27db283572d394$export$e2940151ac854c0b).isSelectable(before))) {
        let delStep = (0, $5dfe06a1d53a4883$export$ed6ac67359824afd)(state.doc, $cursor.before(), $cursor.after(), (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).empty);
        if (delStep && delStep.slice.size < delStep.to - delStep.from) {
            if (dispatch) {
                let tr = state.tr.step(delStep);
                tr.setSelection($694358249add86fd$var$textblockAt(before, "end") ? (0, $ee27db283572d394$export$52baac22726c72bf).findFrom(tr.doc.resolve(tr.mapping.map($cut.pos, -1)), -1) : (0, $ee27db283572d394$export$e2940151ac854c0b).create(tr.doc, $cut.pos - before.nodeSize));
                dispatch(tr.scrollIntoView());
            }
            return true;
        }
    }
    // If the node before is an atom, delete it
    if (before.isAtom && $cut.depth == $cursor.depth - 1) {
        if (dispatch) dispatch(state.tr.delete($cut.pos - before.nodeSize, $cut.pos).scrollIntoView());
        return true;
    }
    return false;
};
/**
A more limited form of [`joinBackward`]($commands.joinBackward)
that only tries to join the current textblock to the one before
it, if the cursor is at the start of a textblock.
*/ const $694358249add86fd$export$1dce4f5c74f5f90f = (state, dispatch, view)=>{
    let $cursor = $694358249add86fd$var$atBlockStart(state, view);
    if (!$cursor) return false;
    let $cut = $694358249add86fd$var$findCutBefore($cursor);
    return $cut ? $694358249add86fd$var$joinTextblocksAround(state, $cut, dispatch) : false;
};
/**
A more limited form of [`joinForward`]($commands.joinForward)
that only tries to join the current textblock to the one after
it, if the cursor is at the end of a textblock.
*/ const $694358249add86fd$export$e796bb96d22be2cd = (state, dispatch, view)=>{
    let $cursor = $694358249add86fd$var$atBlockEnd(state, view);
    if (!$cursor) return false;
    let $cut = $694358249add86fd$var$findCutAfter($cursor);
    return $cut ? $694358249add86fd$var$joinTextblocksAround(state, $cut, dispatch) : false;
};
function $694358249add86fd$var$joinTextblocksAround(state, $cut, dispatch) {
    let before = $cut.nodeBefore, beforeText = before, beforePos = $cut.pos - 1;
    for(; !beforeText.isTextblock; beforePos--){
        if (beforeText.type.spec.isolating) return false;
        let child = beforeText.lastChild;
        if (!child) return false;
        beforeText = child;
    }
    let after = $cut.nodeAfter, afterText = after, afterPos = $cut.pos + 1;
    for(; !afterText.isTextblock; afterPos++){
        if (afterText.type.spec.isolating) return false;
        let child1 = afterText.firstChild;
        if (!child1) return false;
        afterText = child1;
    }
    let step = (0, $5dfe06a1d53a4883$export$ed6ac67359824afd)(state.doc, beforePos, afterPos, (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).empty);
    if (!step || step.from != beforePos || step.slice.size >= afterPos - beforePos) return false;
    if (dispatch) {
        let tr = state.tr.step(step);
        tr.setSelection((0, $ee27db283572d394$export$c2b25f346d19bcbb).create(tr.doc, beforePos));
        dispatch(tr.scrollIntoView());
    }
    return true;
}
function $694358249add86fd$var$textblockAt(node, side, only = false) {
    for(let scan = node; scan; scan = side == "start" ? scan.firstChild : scan.lastChild){
        if (scan.isTextblock) return true;
        if (only && scan.childCount != 1) return false;
    }
    return false;
}
/**
When the selection is empty and at the start of a textblock, select
the node before that textblock, if possible. This is intended to be
bound to keys like backspace, after
[`joinBackward`](https://prosemirror.net/docs/ref/#commands.joinBackward) or other deleting
commands, as a fall-back behavior when the schema doesn't allow
deletion at the selected point.
*/ const $694358249add86fd$export$52b8a4af68d19794 = (state, dispatch, view)=>{
    let { $head: $head , empty: empty  } = state.selection, $cut = $head;
    if (!empty) return false;
    if ($head.parent.isTextblock) {
        if (view ? !view.endOfTextblock("backward", state) : $head.parentOffset > 0) return false;
        $cut = $694358249add86fd$var$findCutBefore($head);
    }
    let node = $cut && $cut.nodeBefore;
    if (!node || !(0, $ee27db283572d394$export$e2940151ac854c0b).isSelectable(node)) return false;
    if (dispatch) dispatch(state.tr.setSelection((0, $ee27db283572d394$export$e2940151ac854c0b).create(state.doc, $cut.pos - node.nodeSize)).scrollIntoView());
    return true;
};
function $694358249add86fd$var$findCutBefore($pos) {
    if (!$pos.parent.type.spec.isolating) for(let i = $pos.depth - 1; i >= 0; i--){
        if ($pos.index(i) > 0) return $pos.doc.resolve($pos.before(i + 1));
        if ($pos.node(i).type.spec.isolating) break;
    }
    return null;
}
function $694358249add86fd$var$atBlockEnd(state, view) {
    let { $cursor: $cursor  } = state.selection;
    if (!$cursor || (view ? !view.endOfTextblock("forward", state) : $cursor.parentOffset < $cursor.parent.content.size)) return null;
    return $cursor;
}
/**
If the selection is empty and the cursor is at the end of a
textblock, try to reduce or remove the boundary between that block
and the one after it, either by joining them or by moving the other
block closer to this one in the tree structure. Will use the view
for accurate start-of-textblock detection if given.
*/ const $694358249add86fd$export$bf432e340007f9ef = (state, dispatch, view)=>{
    let $cursor = $694358249add86fd$var$atBlockEnd(state, view);
    if (!$cursor) return false;
    let $cut = $694358249add86fd$var$findCutAfter($cursor);
    // If there is no node after this, there's nothing to do
    if (!$cut) return false;
    let after = $cut.nodeAfter;
    // Try the joining algorithm
    if ($694358249add86fd$var$deleteBarrier(state, $cut, dispatch)) return true;
    // If the node above has no content and the node below is
    // selectable, delete the node above and select the one below.
    if ($cursor.parent.content.size == 0 && ($694358249add86fd$var$textblockAt(after, "start") || (0, $ee27db283572d394$export$e2940151ac854c0b).isSelectable(after))) {
        let delStep = (0, $5dfe06a1d53a4883$export$ed6ac67359824afd)(state.doc, $cursor.before(), $cursor.after(), (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).empty);
        if (delStep && delStep.slice.size < delStep.to - delStep.from) {
            if (dispatch) {
                let tr = state.tr.step(delStep);
                tr.setSelection($694358249add86fd$var$textblockAt(after, "start") ? (0, $ee27db283572d394$export$52baac22726c72bf).findFrom(tr.doc.resolve(tr.mapping.map($cut.pos)), 1) : (0, $ee27db283572d394$export$e2940151ac854c0b).create(tr.doc, tr.mapping.map($cut.pos)));
                dispatch(tr.scrollIntoView());
            }
            return true;
        }
    }
    // If the next node is an atom, delete it
    if (after.isAtom && $cut.depth == $cursor.depth - 1) {
        if (dispatch) dispatch(state.tr.delete($cut.pos, $cut.pos + after.nodeSize).scrollIntoView());
        return true;
    }
    return false;
};
/**
When the selection is empty and at the end of a textblock, select
the node coming after that textblock, if possible. This is intended
to be bound to keys like delete, after
[`joinForward`](https://prosemirror.net/docs/ref/#commands.joinForward) and similar deleting
commands, to provide a fall-back behavior when the schema doesn't
allow deletion at the selected point.
*/ const $694358249add86fd$export$5835b52680b80cfd = (state, dispatch, view)=>{
    let { $head: $head , empty: empty  } = state.selection, $cut = $head;
    if (!empty) return false;
    if ($head.parent.isTextblock) {
        if (view ? !view.endOfTextblock("forward", state) : $head.parentOffset < $head.parent.content.size) return false;
        $cut = $694358249add86fd$var$findCutAfter($head);
    }
    let node = $cut && $cut.nodeAfter;
    if (!node || !(0, $ee27db283572d394$export$e2940151ac854c0b).isSelectable(node)) return false;
    if (dispatch) dispatch(state.tr.setSelection((0, $ee27db283572d394$export$e2940151ac854c0b).create(state.doc, $cut.pos)).scrollIntoView());
    return true;
};
function $694358249add86fd$var$findCutAfter($pos) {
    if (!$pos.parent.type.spec.isolating) for(let i = $pos.depth - 1; i >= 0; i--){
        let parent = $pos.node(i);
        if ($pos.index(i) + 1 < parent.childCount) return $pos.doc.resolve($pos.after(i + 1));
        if (parent.type.spec.isolating) break;
    }
    return null;
}
/**
Join the selected block or, if there is a text selection, the
closest ancestor block of the selection that can be joined, with
the sibling above it.
*/ const $694358249add86fd$export$4bb15e6d4372b393 = (state, dispatch)=>{
    let sel = state.selection, nodeSel = sel instanceof (0, $ee27db283572d394$export$e2940151ac854c0b), point;
    if (nodeSel) {
        if (sel.node.isTextblock || !(0, $5dfe06a1d53a4883$export$f15f89fd9d8cc98a)(state.doc, sel.from)) return false;
        point = sel.from;
    } else {
        point = (0, $5dfe06a1d53a4883$export$41b1d4cb5ceb3147)(state.doc, sel.from, -1);
        if (point == null) return false;
    }
    if (dispatch) {
        let tr = state.tr.join(point);
        if (nodeSel) tr.setSelection((0, $ee27db283572d394$export$e2940151ac854c0b).create(tr.doc, point - state.doc.resolve(point).nodeBefore.nodeSize));
        dispatch(tr.scrollIntoView());
    }
    return true;
};
/**
Join the selected block, or the closest ancestor of the selection
that can be joined, with the sibling after it.
*/ const $694358249add86fd$export$8dd967a262b064bb = (state, dispatch)=>{
    let sel = state.selection, point;
    if (sel instanceof (0, $ee27db283572d394$export$e2940151ac854c0b)) {
        if (sel.node.isTextblock || !(0, $5dfe06a1d53a4883$export$f15f89fd9d8cc98a)(state.doc, sel.to)) return false;
        point = sel.to;
    } else {
        point = (0, $5dfe06a1d53a4883$export$41b1d4cb5ceb3147)(state.doc, sel.to, 1);
        if (point == null) return false;
    }
    if (dispatch) dispatch(state.tr.join(point).scrollIntoView());
    return true;
};
/**
Lift the selected block, or the closest ancestor block of the
selection that can be lifted, out of its parent node.
*/ const $694358249add86fd$export$590e8b2c435046d9 = (state, dispatch)=>{
    let { $from: $from , $to: $to  } = state.selection;
    let range = $from.blockRange($to), target = range && (0, $5dfe06a1d53a4883$export$f1508b72cc76a09e)(range);
    if (target == null) return false;
    if (dispatch) dispatch(state.tr.lift(range, target).scrollIntoView());
    return true;
};
/**
If the selection is in a node whose type has a truthy
[`code`](https://prosemirror.net/docs/ref/#model.NodeSpec.code) property in its spec, replace the
selection with a newline character.
*/ const $694358249add86fd$export$a5d02b4b65e94f91 = (state, dispatch)=>{
    let { $head: $head , $anchor: $anchor  } = state.selection;
    if (!$head.parent.type.spec.code || !$head.sameParent($anchor)) return false;
    if (dispatch) dispatch(state.tr.insertText("\n").scrollIntoView());
    return true;
};
function $694358249add86fd$var$defaultBlockAt(match) {
    for(let i = 0; i < match.edgeCount; i++){
        let { type: type  } = match.edge(i);
        if (type.isTextblock && !type.hasRequiredAttrs()) return type;
    }
    return null;
}
/**
When the selection is in a node with a truthy
[`code`](https://prosemirror.net/docs/ref/#model.NodeSpec.code) property in its spec, create a
default block after the code block, and move the cursor there.
*/ const $694358249add86fd$export$634b78845598ff5b = (state, dispatch)=>{
    let { $head: $head , $anchor: $anchor  } = state.selection;
    if (!$head.parent.type.spec.code || !$head.sameParent($anchor)) return false;
    let above = $head.node(-1), after = $head.indexAfter(-1), type = $694358249add86fd$var$defaultBlockAt(above.contentMatchAt(after));
    if (!type || !above.canReplaceWith(after, after, type)) return false;
    if (dispatch) {
        let pos = $head.after(), tr = state.tr.replaceWith(pos, pos, type.createAndFill());
        tr.setSelection((0, $ee27db283572d394$export$52baac22726c72bf).near(tr.doc.resolve(pos), 1));
        dispatch(tr.scrollIntoView());
    }
    return true;
};
/**
If a block node is selected, create an empty paragraph before (if
it is its parent's first child) or after it.
*/ const $694358249add86fd$export$d0f80ac1b4510888 = (state, dispatch)=>{
    let sel = state.selection, { $from: $from , $to: $to  } = sel;
    if (sel instanceof (0, $ee27db283572d394$export$c15d9ba76bdbcd95) || $from.parent.inlineContent || $to.parent.inlineContent) return false;
    let type = $694358249add86fd$var$defaultBlockAt($to.parent.contentMatchAt($to.indexAfter()));
    if (!type || !type.isTextblock) return false;
    if (dispatch) {
        let side = (!$from.parentOffset && $to.index() < $to.parent.childCount ? $from : $to).pos;
        let tr = state.tr.insert(side, type.createAndFill());
        tr.setSelection((0, $ee27db283572d394$export$c2b25f346d19bcbb).create(tr.doc, side + 1));
        dispatch(tr.scrollIntoView());
    }
    return true;
};
/**
If the cursor is in an empty textblock that can be lifted, lift the
block.
*/ const $694358249add86fd$export$a3574cc681852c08 = (state, dispatch)=>{
    let { $cursor: $cursor  } = state.selection;
    if (!$cursor || $cursor.parent.content.size) return false;
    if ($cursor.depth > 1 && $cursor.after() != $cursor.end(-1)) {
        let before = $cursor.before();
        if ((0, $5dfe06a1d53a4883$export$5aaf008897aef029)(state.doc, before)) {
            if (dispatch) dispatch(state.tr.split(before).scrollIntoView());
            return true;
        }
    }
    let range = $cursor.blockRange(), target = range && (0, $5dfe06a1d53a4883$export$f1508b72cc76a09e)(range);
    if (target == null) return false;
    if (dispatch) dispatch(state.tr.lift(range, target).scrollIntoView());
    return true;
};
/**
Create a variant of [`splitBlock`](https://prosemirror.net/docs/ref/#commands.splitBlock) that uses
a custom function to determine the type of the newly split off block.
*/ function $694358249add86fd$export$8bf8350f33b1e5ab(splitNode) {
    return (state, dispatch)=>{
        let { $from: $from , $to: $to  } = state.selection;
        if (state.selection instanceof (0, $ee27db283572d394$export$e2940151ac854c0b) && state.selection.node.isBlock) {
            if (!$from.parentOffset || !(0, $5dfe06a1d53a4883$export$5aaf008897aef029)(state.doc, $from.pos)) return false;
            if (dispatch) dispatch(state.tr.split($from.pos).scrollIntoView());
            return true;
        }
        if (!$from.parent.isBlock) return false;
        if (dispatch) {
            let atEnd = $to.parentOffset == $to.parent.content.size;
            let tr = state.tr;
            if (state.selection instanceof (0, $ee27db283572d394$export$c2b25f346d19bcbb) || state.selection instanceof (0, $ee27db283572d394$export$c15d9ba76bdbcd95)) tr.deleteSelection();
            let deflt = $from.depth == 0 ? null : $694358249add86fd$var$defaultBlockAt($from.node(-1).contentMatchAt($from.indexAfter(-1)));
            let splitType = splitNode && splitNode($to.parent, atEnd);
            let types = splitType ? [
                splitType
            ] : atEnd && deflt ? [
                {
                    type: deflt
                }
            ] : undefined;
            let can = (0, $5dfe06a1d53a4883$export$5aaf008897aef029)(tr.doc, tr.mapping.map($from.pos), 1, types);
            if (!types && !can && (0, $5dfe06a1d53a4883$export$5aaf008897aef029)(tr.doc, tr.mapping.map($from.pos), 1, deflt ? [
                {
                    type: deflt
                }
            ] : undefined)) {
                if (deflt) types = [
                    {
                        type: deflt
                    }
                ];
                can = true;
            }
            if (can) {
                tr.split(tr.mapping.map($from.pos), 1, types);
                if (!atEnd && !$from.parentOffset && $from.parent.type != deflt) {
                    let first = tr.mapping.map($from.before()), $first = tr.doc.resolve(first);
                    if (deflt && $from.node(-1).canReplaceWith($first.index(), $first.index() + 1, deflt)) tr.setNodeMarkup(tr.mapping.map($from.before()), deflt);
                }
            }
            dispatch(tr.scrollIntoView());
        }
        return true;
    };
}
/**
Split the parent block of the selection. If the selection is a text
selection, also delete its content.
*/ const $694358249add86fd$export$e99155638ff4dff0 = $694358249add86fd$export$8bf8350f33b1e5ab();
/**
Acts like [`splitBlock`](https://prosemirror.net/docs/ref/#commands.splitBlock), but without
resetting the set of active marks at the cursor.
*/ const $694358249add86fd$export$eeb429476568b72b = (state, dispatch)=>{
    return $694358249add86fd$export$e99155638ff4dff0(state, dispatch && ((tr)=>{
        let marks = state.storedMarks || state.selection.$to.parentOffset && state.selection.$from.marks();
        if (marks) tr.ensureMarks(marks);
        dispatch(tr);
    }));
};
/**
Move the selection to the node wrapping the current selection, if
any. (Will not select the document node.)
*/ const $694358249add86fd$export$a37f6aaa9169911d = (state, dispatch)=>{
    let { $from: $from , to: to  } = state.selection, pos;
    let same = $from.sharedDepth(to);
    if (same == 0) return false;
    pos = $from.before(same);
    if (dispatch) dispatch(state.tr.setSelection((0, $ee27db283572d394$export$e2940151ac854c0b).create(state.doc, pos)));
    return true;
};
/**
Select the whole document.
*/ const $694358249add86fd$export$90aca4adda6ff0f5 = (state, dispatch)=>{
    if (dispatch) dispatch(state.tr.setSelection(new (0, $ee27db283572d394$export$c15d9ba76bdbcd95)(state.doc)));
    return true;
};
function $694358249add86fd$var$joinMaybeClear(state, $pos, dispatch) {
    let before = $pos.nodeBefore, after = $pos.nodeAfter, index = $pos.index();
    if (!before || !after || !before.type.compatibleContent(after.type)) return false;
    if (!before.content.size && $pos.parent.canReplace(index - 1, index)) {
        if (dispatch) dispatch(state.tr.delete($pos.pos - before.nodeSize, $pos.pos).scrollIntoView());
        return true;
    }
    if (!$pos.parent.canReplace(index, index + 1) || !(after.isTextblock || (0, $5dfe06a1d53a4883$export$f15f89fd9d8cc98a)(state.doc, $pos.pos))) return false;
    if (dispatch) dispatch(state.tr.clearIncompatible($pos.pos, before.type, before.contentMatchAt(before.childCount)).join($pos.pos).scrollIntoView());
    return true;
}
function $694358249add86fd$var$deleteBarrier(state, $cut, dispatch) {
    let before = $cut.nodeBefore, after = $cut.nodeAfter, conn, match;
    if (before.type.spec.isolating || after.type.spec.isolating) return false;
    if ($694358249add86fd$var$joinMaybeClear(state, $cut, dispatch)) return true;
    let canDelAfter = $cut.parent.canReplace($cut.index(), $cut.index() + 1);
    if (canDelAfter && (conn = (match = before.contentMatchAt(before.childCount)).findWrapping(after.type)) && match.matchType(conn[0] || after.type).validEnd) {
        if (dispatch) {
            let end = $cut.pos + after.nodeSize, wrap = (0, $c8d507d90382f091$export$ffb0004e005737fa).empty;
            for(let i = conn.length - 1; i >= 0; i--)wrap = (0, $c8d507d90382f091$export$ffb0004e005737fa).from(conn[i].create(null, wrap));
            wrap = (0, $c8d507d90382f091$export$ffb0004e005737fa).from(before.copy(wrap));
            let tr = state.tr.step(new (0, $5dfe06a1d53a4883$export$444ba800d6024a98)($cut.pos - 1, end, $cut.pos, end, new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)(wrap, 1, 0), conn.length, true));
            let joinAt = end + 2 * conn.length;
            if ((0, $5dfe06a1d53a4883$export$f15f89fd9d8cc98a)(tr.doc, joinAt)) tr.join(joinAt);
            dispatch(tr.scrollIntoView());
        }
        return true;
    }
    let selAfter = (0, $ee27db283572d394$export$52baac22726c72bf).findFrom($cut, 1);
    let range = selAfter && selAfter.$from.blockRange(selAfter.$to), target = range && (0, $5dfe06a1d53a4883$export$f1508b72cc76a09e)(range);
    if (target != null && target >= $cut.depth) {
        if (dispatch) dispatch(state.tr.lift(range, target).scrollIntoView());
        return true;
    }
    if (canDelAfter && $694358249add86fd$var$textblockAt(after, "start", true) && $694358249add86fd$var$textblockAt(before, "end")) {
        let at = before, wrap1 = [];
        for(;;){
            wrap1.push(at);
            if (at.isTextblock) break;
            at = at.lastChild;
        }
        let afterText = after, afterDepth = 1;
        for(; !afterText.isTextblock; afterText = afterText.firstChild)afterDepth++;
        if (at.canReplace(at.childCount, at.childCount, afterText.content)) {
            if (dispatch) {
                let end1 = (0, $c8d507d90382f091$export$ffb0004e005737fa).empty;
                for(let i1 = wrap1.length - 1; i1 >= 0; i1--)end1 = (0, $c8d507d90382f091$export$ffb0004e005737fa).from(wrap1[i1].copy(end1));
                let tr1 = state.tr.step(new (0, $5dfe06a1d53a4883$export$444ba800d6024a98)($cut.pos - wrap1.length, $cut.pos + after.nodeSize, $cut.pos + afterDepth, $cut.pos + after.nodeSize - afterDepth, new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)(end1, wrap1.length, 0), 0, true));
                dispatch(tr1.scrollIntoView());
            }
            return true;
        }
    }
    return false;
}
function $694358249add86fd$var$selectTextblockSide(side) {
    return function(state, dispatch) {
        let sel = state.selection, $pos = side < 0 ? sel.$from : sel.$to;
        let depth = $pos.depth;
        while($pos.node(depth).isInline){
            if (!depth) return false;
            depth--;
        }
        if (!$pos.node(depth).isTextblock) return false;
        if (dispatch) dispatch(state.tr.setSelection((0, $ee27db283572d394$export$c2b25f346d19bcbb).create(state.doc, side < 0 ? $pos.start(depth) : $pos.end(depth))));
        return true;
    };
}
/**
Moves the cursor to the start of current text block.
*/ const $694358249add86fd$export$c3a64f3c9604a1b1 = $694358249add86fd$var$selectTextblockSide(-1);
/**
Moves the cursor to the end of current text block.
*/ const $694358249add86fd$export$a66c1876556415e5 = $694358249add86fd$var$selectTextblockSide(1);
// Parameterized commands
/**
Wrap the selection in a node of the given type with the given
attributes.
*/ function $694358249add86fd$export$6e5e3c49755affd0(nodeType, attrs = null) {
    return function(state, dispatch) {
        let { $from: $from , $to: $to  } = state.selection;
        let range = $from.blockRange($to), wrapping = range && (0, $5dfe06a1d53a4883$export$118cb9a83e81ba37)(range, nodeType, attrs);
        if (!wrapping) return false;
        if (dispatch) dispatch(state.tr.wrap(range, wrapping).scrollIntoView());
        return true;
    };
}
/**
Returns a command that tries to set the selected textblocks to the
given node type with the given attributes.
*/ function $694358249add86fd$export$36987f561c736aad(nodeType, attrs = null) {
    return function(state, dispatch) {
        let applicable = false;
        for(let i = 0; i < state.selection.ranges.length && !applicable; i++){
            let { $from: { pos: from  } , $to: { pos: to  }  } = state.selection.ranges[i];
            state.doc.nodesBetween(from, to, (node, pos)=>{
                if (applicable) return false;
                if (!node.isTextblock || node.hasMarkup(nodeType, attrs)) return;
                if (node.type == nodeType) applicable = true;
                else {
                    let $pos = state.doc.resolve(pos), index = $pos.index();
                    applicable = $pos.parent.canReplaceWith(index, index + 1, nodeType);
                }
            });
        }
        if (!applicable) return false;
        if (dispatch) {
            let tr = state.tr;
            for(let i1 = 0; i1 < state.selection.ranges.length; i1++){
                let { $from: { pos: from1  } , $to: { pos: to1  }  } = state.selection.ranges[i1];
                tr.setBlockType(from1, to1, nodeType, attrs);
            }
            dispatch(tr.scrollIntoView());
        }
        return true;
    };
}
function $694358249add86fd$var$markApplies(doc, ranges, type) {
    for(let i = 0; i < ranges.length; i++){
        let { $from: $from , $to: $to  } = ranges[i];
        let can = $from.depth == 0 ? doc.inlineContent && doc.type.allowsMarkType(type) : false;
        doc.nodesBetween($from.pos, $to.pos, (node)=>{
            if (can) return false;
            can = node.inlineContent && node.type.allowsMarkType(type);
        });
        if (can) return true;
    }
    return false;
}
/**
Create a command function that toggles the given mark with the
given attributes. Will return `false` when the current selection
doesn't support that mark. This will remove the mark if any marks
of that type exist in the selection, or add it otherwise. If the
selection is empty, this applies to the [stored
marks](https://prosemirror.net/docs/ref/#state.EditorState.storedMarks) instead of a range of the
document.
*/ function $694358249add86fd$export$797ad2667b8015a8(markType, attrs = null) {
    return function(state, dispatch) {
        let { empty: empty , $cursor: $cursor , ranges: ranges  } = state.selection;
        if (empty && !$cursor || !$694358249add86fd$var$markApplies(state.doc, ranges, markType)) return false;
        if (dispatch) {
            if ($cursor) {
                if (markType.isInSet(state.storedMarks || $cursor.marks())) dispatch(state.tr.removeStoredMark(markType));
                else dispatch(state.tr.addStoredMark(markType.create(attrs)));
            } else {
                let has = false, tr = state.tr;
                for(let i = 0; !has && i < ranges.length; i++){
                    let { $from: $from , $to: $to  } = ranges[i];
                    has = state.doc.rangeHasMark($from.pos, $to.pos, markType);
                }
                for(let i1 = 0; i1 < ranges.length; i1++){
                    let { $from: $from1 , $to: $to1  } = ranges[i1];
                    if (has) tr.removeMark($from1.pos, $to1.pos, markType);
                    else {
                        let from = $from1.pos, to = $to1.pos, start = $from1.nodeAfter, end = $to1.nodeBefore;
                        let spaceStart = start && start.isText ? /^\s*/.exec(start.text)[0].length : 0;
                        let spaceEnd = end && end.isText ? /\s*$/.exec(end.text)[0].length : 0;
                        if (from + spaceStart < to) {
                            from += spaceStart;
                            to -= spaceEnd;
                        }
                        tr.addMark(from, to, markType.create(attrs));
                    }
                }
                dispatch(tr.scrollIntoView());
            }
        }
        return true;
    };
}
function $694358249add86fd$var$wrapDispatchForJoin(dispatch, isJoinable) {
    return (tr)=>{
        if (!tr.isGeneric) return dispatch(tr);
        let ranges = [];
        for(let i = 0; i < tr.mapping.maps.length; i++){
            let map = tr.mapping.maps[i];
            for(let j = 0; j < ranges.length; j++)ranges[j] = map.map(ranges[j]);
            map.forEach((_s, _e, from, to)=>ranges.push(from, to));
        }
        // Figure out which joinable points exist inside those ranges,
        // by checking all node boundaries in their parent nodes.
        let joinable = [];
        for(let i1 = 0; i1 < ranges.length; i1 += 2){
            let from = ranges[i1], to = ranges[i1 + 1];
            let $from = tr.doc.resolve(from), depth = $from.sharedDepth(to), parent = $from.node(depth);
            for(let index = $from.indexAfter(depth), pos = $from.after(depth + 1); pos <= to; ++index){
                let after = parent.maybeChild(index);
                if (!after) break;
                if (index && joinable.indexOf(pos) == -1) {
                    let before = parent.child(index - 1);
                    if (before.type == after.type && isJoinable(before, after)) joinable.push(pos);
                }
                pos += after.nodeSize;
            }
        }
        // Join the joinable points
        joinable.sort((a, b)=>a - b);
        for(let i2 = joinable.length - 1; i2 >= 0; i2--)if ((0, $5dfe06a1d53a4883$export$f15f89fd9d8cc98a)(tr.doc, joinable[i2])) tr.join(joinable[i2]);
        dispatch(tr);
    };
}
/**
Wrap a command so that, when it produces a transform that causes
two joinable nodes to end up next to each other, those are joined.
Nodes are considered joinable when they are of the same type and
when the `isJoinable` predicate returns true for them or, if an
array of strings was passed, if their node type name is in that
array.
*/ function $694358249add86fd$export$29903073afddcd8b(command, isJoinable) {
    let canJoin = Array.isArray(isJoinable) ? (node)=>isJoinable.indexOf(node.type.name) > -1 : isJoinable;
    return (state, dispatch, view)=>command(state, dispatch && $694358249add86fd$var$wrapDispatchForJoin(dispatch, canJoin), view);
}
/**
Combine a number of command functions into a single function (which
calls them one by one until one returns true).
*/ function $694358249add86fd$export$146a774cdef7663a(...commands) {
    return function(state, dispatch, view) {
        for(let i = 0; i < commands.length; i++)if (commands[i](state, dispatch, view)) return true;
        return false;
    };
}
let $694358249add86fd$var$backspace = $694358249add86fd$export$146a774cdef7663a($694358249add86fd$export$e9a518a637d1e641, $694358249add86fd$export$979097b097459299, $694358249add86fd$export$52b8a4af68d19794);
let $694358249add86fd$var$del = $694358249add86fd$export$146a774cdef7663a($694358249add86fd$export$e9a518a637d1e641, $694358249add86fd$export$bf432e340007f9ef, $694358249add86fd$export$5835b52680b80cfd);
/**
A basic keymap containing bindings not specific to any schema.
Binds the following keys (when multiple commands are listed, they
are chained with [`chainCommands`](https://prosemirror.net/docs/ref/#commands.chainCommands)):

* **Enter** to `newlineInCode`, `createParagraphNear`, `liftEmptyBlock`, `splitBlock`
* **Mod-Enter** to `exitCode`
* **Backspace** and **Mod-Backspace** to `deleteSelection`, `joinBackward`, `selectNodeBackward`
* **Delete** and **Mod-Delete** to `deleteSelection`, `joinForward`, `selectNodeForward`
* **Mod-Delete** to `deleteSelection`, `joinForward`, `selectNodeForward`
* **Mod-a** to `selectAll`
*/ const $694358249add86fd$export$eb36e8971b04df36 = {
    "Enter": $694358249add86fd$export$146a774cdef7663a($694358249add86fd$export$a5d02b4b65e94f91, $694358249add86fd$export$d0f80ac1b4510888, $694358249add86fd$export$a3574cc681852c08, $694358249add86fd$export$e99155638ff4dff0),
    "Mod-Enter": $694358249add86fd$export$634b78845598ff5b,
    "Backspace": $694358249add86fd$var$backspace,
    "Mod-Backspace": $694358249add86fd$var$backspace,
    "Shift-Backspace": $694358249add86fd$var$backspace,
    "Delete": $694358249add86fd$var$del,
    "Mod-Delete": $694358249add86fd$var$del,
    "Mod-a": $694358249add86fd$export$90aca4adda6ff0f5
};
/**
A copy of `pcBaseKeymap` that also binds **Ctrl-h** like Backspace,
**Ctrl-d** like Delete, **Alt-Backspace** like Ctrl-Backspace, and
**Ctrl-Alt-Backspace**, **Alt-Delete**, and **Alt-d** like
Ctrl-Delete.
*/ const $694358249add86fd$export$f292ad8dbd5063c8 = {
    "Ctrl-h": $694358249add86fd$export$eb36e8971b04df36["Backspace"],
    "Alt-Backspace": $694358249add86fd$export$eb36e8971b04df36["Mod-Backspace"],
    "Ctrl-d": $694358249add86fd$export$eb36e8971b04df36["Delete"],
    "Ctrl-Alt-Backspace": $694358249add86fd$export$eb36e8971b04df36["Mod-Delete"],
    "Alt-Delete": $694358249add86fd$export$eb36e8971b04df36["Mod-Delete"],
    "Alt-d": $694358249add86fd$export$eb36e8971b04df36["Mod-Delete"],
    "Ctrl-a": $694358249add86fd$export$c3a64f3c9604a1b1,
    "Ctrl-e": $694358249add86fd$export$a66c1876556415e5
};
for(let key in $694358249add86fd$export$eb36e8971b04df36)$694358249add86fd$export$f292ad8dbd5063c8[key] = $694358249add86fd$export$eb36e8971b04df36[key];
const $694358249add86fd$var$mac = typeof navigator != "undefined" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os != "undefined" && os.platform ? os.platform() == "darwin" : false;
/**
Depending on the detected platform, this will hold
[`pcBasekeymap`](https://prosemirror.net/docs/ref/#commands.pcBaseKeymap) or
[`macBaseKeymap`](https://prosemirror.net/docs/ref/#commands.macBaseKeymap).
*/ const $694358249add86fd$export$4a0c2b85b1f0a889 = $694358249add86fd$var$mac ? $694358249add86fd$export$f292ad8dbd5063c8 : $694358249add86fd$export$eb36e8971b04df36;





/**
Create a plugin that, when added to a ProseMirror instance,
causes a decoration to show up at the drop position when something
is dragged over the editor.

Nodes may add a `disableDropCursor` property to their spec to
control the showing of a drop cursor inside them. This may be a
boolean or a function, which will be called with a view and a
position, and should return a boolean.
*/ function $c77f69376cda89fa$export$b8e3092a3bfa2062(options = {}) {
    return new (0, $ee27db283572d394$export$901cf72dabf2112a)({
        view (editorView) {
            return new $c77f69376cda89fa$var$DropCursorView(editorView, options);
        }
    });
}
class $c77f69376cda89fa$var$DropCursorView {
    constructor(editorView, options){
        this.editorView = editorView;
        this.cursorPos = null;
        this.element = null;
        this.timeout = -1;
        this.width = options.width || 1;
        this.color = options.color || "black";
        this.class = options.class;
        this.handlers = [
            "dragover",
            "dragend",
            "drop",
            "dragleave"
        ].map((name)=>{
            let handler = (e)=>{
                this[name](e);
            };
            editorView.dom.addEventListener(name, handler);
            return {
                name: name,
                handler: handler
            };
        });
    }
    destroy() {
        this.handlers.forEach(({ name: name , handler: handler  })=>this.editorView.dom.removeEventListener(name, handler));
    }
    update(editorView, prevState) {
        if (this.cursorPos != null && prevState.doc != editorView.state.doc) {
            if (this.cursorPos > editorView.state.doc.content.size) this.setCursor(null);
            else this.updateOverlay();
        }
    }
    setCursor(pos) {
        if (pos == this.cursorPos) return;
        this.cursorPos = pos;
        if (pos == null) {
            this.element.parentNode.removeChild(this.element);
            this.element = null;
        } else this.updateOverlay();
    }
    updateOverlay() {
        let $pos = this.editorView.state.doc.resolve(this.cursorPos), rect;
        if (!$pos.parent.inlineContent) {
            let before = $pos.nodeBefore, after = $pos.nodeAfter;
            if (before || after) {
                let node = this.editorView.nodeDOM(this.cursorPos - (before ? before.nodeSize : 0));
                if (node) {
                    let nodeRect = node.getBoundingClientRect();
                    let top = before ? nodeRect.bottom : nodeRect.top;
                    if (before && after) top = (top + this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top) / 2;
                    rect = {
                        left: nodeRect.left,
                        right: nodeRect.right,
                        top: top - this.width / 2,
                        bottom: top + this.width / 2
                    };
                }
            }
        }
        if (!rect) {
            let coords = this.editorView.coordsAtPos(this.cursorPos);
            rect = {
                left: coords.left - this.width / 2,
                right: coords.left + this.width / 2,
                top: coords.top,
                bottom: coords.bottom
            };
        }
        let parent = this.editorView.dom.offsetParent;
        if (!this.element) {
            this.element = parent.appendChild(document.createElement("div"));
            if (this.class) this.element.className = this.class;
            this.element.style.cssText = "position: absolute; z-index: 50; pointer-events: none; background-color: " + this.color;
        }
        let parentLeft, parentTop;
        if (!parent || parent == document.body && getComputedStyle(parent).position == "static") {
            parentLeft = -pageXOffset;
            parentTop = -pageYOffset;
        } else {
            let rect1 = parent.getBoundingClientRect();
            parentLeft = rect1.left - parent.scrollLeft;
            parentTop = rect1.top - parent.scrollTop;
        }
        this.element.style.left = rect.left - parentLeft + "px";
        this.element.style.top = rect.top - parentTop + "px";
        this.element.style.width = rect.right - rect.left + "px";
        this.element.style.height = rect.bottom - rect.top + "px";
    }
    scheduleRemoval(timeout) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(()=>this.setCursor(null), timeout);
    }
    dragover(event) {
        if (!this.editorView.editable) return;
        let pos = this.editorView.posAtCoords({
            left: event.clientX,
            top: event.clientY
        });
        let node = pos && pos.inside >= 0 && this.editorView.state.doc.nodeAt(pos.inside);
        let disableDropCursor = node && node.type.spec.disableDropCursor;
        let disabled = typeof disableDropCursor == "function" ? disableDropCursor(this.editorView, pos, event) : disableDropCursor;
        if (pos && !disabled) {
            let target = pos.pos;
            if (this.editorView.dragging && this.editorView.dragging.slice) {
                target = (0, $5dfe06a1d53a4883$export$2819d598d048fc9c)(this.editorView.state.doc, target, this.editorView.dragging.slice);
                if (target == null) return this.setCursor(null);
            }
            this.setCursor(target);
            this.scheduleRemoval(5000);
        }
    }
    dragend() {
        this.scheduleRemoval(20);
    }
    drop() {
        this.scheduleRemoval(20);
    }
    dragleave(event) {
        if (event.target == this.editorView.dom || !this.editorView.dom.contains(event.relatedTarget)) this.setCursor(null);
    }
}






/**
Gap cursor selections are represented using this class. Its
`$anchor` and `$head` properties both point at the cursor position.
*/ class $02605aeab5deccff$export$3d3d259665dcb4d4 extends (0, $ee27db283572d394$export$52baac22726c72bf) {
    /**
    Create a gap cursor.
    */ constructor($pos){
        super($pos, $pos);
    }
    map(doc, mapping) {
        let $pos = doc.resolve(mapping.map(this.head));
        return $02605aeab5deccff$export$3d3d259665dcb4d4.valid($pos) ? new $02605aeab5deccff$export$3d3d259665dcb4d4($pos) : (0, $ee27db283572d394$export$52baac22726c72bf).near($pos);
    }
    content() {
        return (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e).empty;
    }
    eq(other) {
        return other instanceof $02605aeab5deccff$export$3d3d259665dcb4d4 && other.head == this.head;
    }
    toJSON() {
        return {
            type: "gapcursor",
            pos: this.head
        };
    }
    /**
    @internal
    */ static fromJSON(doc, json) {
        if (typeof json.pos != "number") throw new RangeError("Invalid input for GapCursor.fromJSON");
        return new $02605aeab5deccff$export$3d3d259665dcb4d4(doc.resolve(json.pos));
    }
    /**
    @internal
    */ getBookmark() {
        return new $02605aeab5deccff$var$GapBookmark(this.anchor);
    }
    /**
    @internal
    */ static valid($pos) {
        let parent = $pos.parent;
        if (parent.isTextblock || !$02605aeab5deccff$var$closedBefore($pos) || !$02605aeab5deccff$var$closedAfter($pos)) return false;
        let override = parent.type.spec.allowGapCursor;
        if (override != null) return override;
        let deflt = parent.contentMatchAt($pos.index()).defaultType;
        return deflt && deflt.isTextblock;
    }
    /**
    @internal
    */ static findGapCursorFrom($pos, dir, mustMove = false) {
        search: for(;;){
            if (!mustMove && $02605aeab5deccff$export$3d3d259665dcb4d4.valid($pos)) return $pos;
            let pos = $pos.pos, next = null;
            // Scan up from this position
            for(let d = $pos.depth;; d--){
                let parent = $pos.node(d);
                if (dir > 0 ? $pos.indexAfter(d) < parent.childCount : $pos.index(d) > 0) {
                    next = parent.child(dir > 0 ? $pos.indexAfter(d) : $pos.index(d) - 1);
                    break;
                } else if (d == 0) return null;
                pos += dir;
                let $cur = $pos.doc.resolve(pos);
                if ($02605aeab5deccff$export$3d3d259665dcb4d4.valid($cur)) return $cur;
            }
            // And then down into the next node
            for(;;){
                let inside = dir > 0 ? next.firstChild : next.lastChild;
                if (!inside) {
                    if (next.isAtom && !next.isText && !(0, $ee27db283572d394$export$e2940151ac854c0b).isSelectable(next)) {
                        $pos = $pos.doc.resolve(pos + next.nodeSize * dir);
                        mustMove = false;
                        continue search;
                    }
                    break;
                }
                next = inside;
                pos += dir;
                let $cur1 = $pos.doc.resolve(pos);
                if ($02605aeab5deccff$export$3d3d259665dcb4d4.valid($cur1)) return $cur1;
            }
            return null;
        }
    }
}
$02605aeab5deccff$export$3d3d259665dcb4d4.prototype.visible = false;
$02605aeab5deccff$export$3d3d259665dcb4d4.findFrom = $02605aeab5deccff$export$3d3d259665dcb4d4.findGapCursorFrom;
(0, $ee27db283572d394$export$52baac22726c72bf).jsonID("gapcursor", $02605aeab5deccff$export$3d3d259665dcb4d4);
class $02605aeab5deccff$var$GapBookmark {
    constructor(pos){
        this.pos = pos;
    }
    map(mapping) {
        return new $02605aeab5deccff$var$GapBookmark(mapping.map(this.pos));
    }
    resolve(doc) {
        let $pos = doc.resolve(this.pos);
        return $02605aeab5deccff$export$3d3d259665dcb4d4.valid($pos) ? new $02605aeab5deccff$export$3d3d259665dcb4d4($pos) : (0, $ee27db283572d394$export$52baac22726c72bf).near($pos);
    }
}
function $02605aeab5deccff$var$closedBefore($pos) {
    for(let d = $pos.depth; d >= 0; d--){
        let index = $pos.index(d), parent = $pos.node(d);
        // At the start of this parent, look at next one
        if (index == 0) {
            if (parent.type.spec.isolating) return true;
            continue;
        }
        // See if the node before (or its first ancestor) is closed
        for(let before = parent.child(index - 1);; before = before.lastChild){
            if (before.childCount == 0 && !before.inlineContent || before.isAtom || before.type.spec.isolating) return true;
            if (before.inlineContent) return false;
        }
    }
    // Hit start of document
    return true;
}
function $02605aeab5deccff$var$closedAfter($pos) {
    for(let d = $pos.depth; d >= 0; d--){
        let index = $pos.indexAfter(d), parent = $pos.node(d);
        if (index == parent.childCount) {
            if (parent.type.spec.isolating) return true;
            continue;
        }
        for(let after = parent.child(index);; after = after.firstChild){
            if (after.childCount == 0 && !after.inlineContent || after.isAtom || after.type.spec.isolating) return true;
            if (after.inlineContent) return false;
        }
    }
    return true;
}
/**
Create a gap cursor plugin. When enabled, this will capture clicks
near and arrow-key-motion past places that don't have a normally
selectable position nearby, and create a gap cursor selection for
them. The cursor is drawn as an element with class
`ProseMirror-gapcursor`. You can either include
`style/gapcursor.css` from the package's directory or add your own
styles to make it visible.
*/ function $02605aeab5deccff$export$54f46a1492d5247() {
    return new (0, $ee27db283572d394$export$901cf72dabf2112a)({
        props: {
            decorations: $02605aeab5deccff$var$drawGapCursor,
            createSelectionBetween (_view, $anchor, $head) {
                return $anchor.pos == $head.pos && $02605aeab5deccff$export$3d3d259665dcb4d4.valid($head) ? new $02605aeab5deccff$export$3d3d259665dcb4d4($head) : null;
            },
            handleClick: $02605aeab5deccff$var$handleClick,
            handleKeyDown: $02605aeab5deccff$var$handleKeyDown,
            handleDOMEvents: {
                beforeinput: $02605aeab5deccff$var$beforeinput
            }
        }
    });
}
const $02605aeab5deccff$var$handleKeyDown = (0, $fcb9d6c1d1df53fa$export$53f558754f8b9fd1)({
    "ArrowLeft": $02605aeab5deccff$var$arrow("horiz", -1),
    "ArrowRight": $02605aeab5deccff$var$arrow("horiz", 1),
    "ArrowUp": $02605aeab5deccff$var$arrow("vert", -1),
    "ArrowDown": $02605aeab5deccff$var$arrow("vert", 1)
});
function $02605aeab5deccff$var$arrow(axis, dir) {
    const dirStr = axis == "vert" ? dir > 0 ? "down" : "up" : dir > 0 ? "right" : "left";
    return function(state, dispatch, view) {
        let sel = state.selection;
        let $start = dir > 0 ? sel.$to : sel.$from, mustMove = sel.empty;
        if (sel instanceof (0, $ee27db283572d394$export$c2b25f346d19bcbb)) {
            if (!view.endOfTextblock(dirStr) || $start.depth == 0) return false;
            mustMove = false;
            $start = state.doc.resolve(dir > 0 ? $start.after() : $start.before());
        }
        let $found = $02605aeab5deccff$export$3d3d259665dcb4d4.findGapCursorFrom($start, dir, mustMove);
        if (!$found) return false;
        if (dispatch) dispatch(state.tr.setSelection(new $02605aeab5deccff$export$3d3d259665dcb4d4($found)));
        return true;
    };
}
function $02605aeab5deccff$var$handleClick(view, pos, event) {
    if (!view || !view.editable) return false;
    let $pos = view.state.doc.resolve(pos);
    if (!$02605aeab5deccff$export$3d3d259665dcb4d4.valid($pos)) return false;
    let clickPos = view.posAtCoords({
        left: event.clientX,
        top: event.clientY
    });
    if (clickPos && clickPos.inside > -1 && (0, $ee27db283572d394$export$e2940151ac854c0b).isSelectable(view.state.doc.nodeAt(clickPos.inside))) return false;
    view.dispatch(view.state.tr.setSelection(new $02605aeab5deccff$export$3d3d259665dcb4d4($pos)));
    return true;
}
// This is a hack that, when a composition starts while a gap cursor
// is active, quickly creates an inline context for the composition to
// happen in, to avoid it being aborted by the DOM selection being
// moved into a valid position.
function $02605aeab5deccff$var$beforeinput(view, event) {
    if (event.inputType != "insertCompositionText" || !(view.state.selection instanceof $02605aeab5deccff$export$3d3d259665dcb4d4)) return false;
    let { $from: $from  } = view.state.selection;
    let insert = $from.parent.contentMatchAt($from.index()).findWrapping(view.state.schema.nodes.text);
    if (!insert) return false;
    let frag = (0, $c8d507d90382f091$export$ffb0004e005737fa).empty;
    for(let i = insert.length - 1; i >= 0; i--)frag = (0, $c8d507d90382f091$export$ffb0004e005737fa).from(insert[i].createAndFill(null, frag));
    let tr = view.state.tr.replace($from.pos, $from.pos, new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)(frag, 0, 0));
    tr.setSelection((0, $ee27db283572d394$export$c2b25f346d19bcbb).near(tr.doc.resolve($from.pos + 1)));
    view.dispatch(tr);
    return false;
}
function $02605aeab5deccff$var$drawGapCursor(state) {
    if (!(state.selection instanceof $02605aeab5deccff$export$3d3d259665dcb4d4)) return null;
    let node = document.createElement("div");
    node.className = "ProseMirror-gapcursor";
    return (0, $4fda26bcd679fbcb$export$93bf62eb445cec98).create(state.doc, [
        (0, $4fda26bcd679fbcb$export$10e30b733df217ea).widget(state.selection.head, node, {
            key: "gapcursor"
        })
    ]);
}


function $2b38a862177e6e10$export$2e2bcd8739ae039() {
    var elt = arguments[0];
    if (typeof elt == "string") elt = document.createElement(elt);
    var i = 1, next = arguments[1];
    if (next && typeof next == "object" && next.nodeType == null && !Array.isArray(next)) {
        for(var name in next)if (Object.prototype.hasOwnProperty.call(next, name)) {
            var value = next[name];
            if (typeof value == "string") elt.setAttribute(name, value);
            else if (value != null) elt[name] = value;
        }
        i++;
    }
    for(; i < arguments.length; i++)$2b38a862177e6e10$var$add(elt, arguments[i]);
    return elt;
}
function $2b38a862177e6e10$var$add(elt, child) {
    if (typeof child == "string") elt.appendChild(document.createTextNode(child));
    else if (child == null) ;
    else if (child.nodeType != null) elt.appendChild(child);
    else if (Array.isArray(child)) for(var i = 0; i < child.length; i++)$2b38a862177e6e10$var$add(elt, child[i]);
    else throw new RangeError("Unsupported child node: " + child);
}





const $9a720f6ac7563389$var$SVG = "http://www.w3.org/2000/svg";
const $9a720f6ac7563389$var$XLINK = "http://www.w3.org/1999/xlink";
const $9a720f6ac7563389$var$prefix$2 = "ProseMirror-icon";
function $9a720f6ac7563389$var$hashPath(path) {
    let hash = 0;
    for(let i = 0; i < path.length; i++)hash = (hash << 5) - hash + path.charCodeAt(i) | 0;
    return hash;
}
function $9a720f6ac7563389$var$getIcon(icon) {
    let node = document.createElement("div");
    node.className = $9a720f6ac7563389$var$prefix$2;
    if (icon.path) {
        let { path: path , width: width , height: height  } = icon;
        let name = "pm-icon-" + $9a720f6ac7563389$var$hashPath(path).toString(16);
        if (!document.getElementById(name)) $9a720f6ac7563389$var$buildSVG(name, icon);
        let svg = node.appendChild(document.createElementNS($9a720f6ac7563389$var$SVG, "svg"));
        svg.style.width = width / height + "em";
        let use = svg.appendChild(document.createElementNS($9a720f6ac7563389$var$SVG, "use"));
        use.setAttributeNS($9a720f6ac7563389$var$XLINK, "href", /([^#]*)/.exec(document.location.toString())[1] + "#" + name);
    } else if (icon.dom) node.appendChild(icon.dom.cloneNode(true));
    else {
        let { text: text , css: css  } = icon;
        node.appendChild(document.createElement("span")).textContent = text || "";
        if (css) node.firstChild.style.cssText = css;
    }
    return node;
}
function $9a720f6ac7563389$var$buildSVG(name, data) {
    let collection = document.getElementById($9a720f6ac7563389$var$prefix$2 + "-collection");
    if (!collection) {
        collection = document.createElementNS($9a720f6ac7563389$var$SVG, "svg");
        collection.id = $9a720f6ac7563389$var$prefix$2 + "-collection";
        collection.style.display = "none";
        document.body.insertBefore(collection, document.body.firstChild);
    }
    let sym = document.createElementNS($9a720f6ac7563389$var$SVG, "symbol");
    sym.id = name;
    sym.setAttribute("viewBox", "0 0 " + data.width + " " + data.height);
    let path = sym.appendChild(document.createElementNS($9a720f6ac7563389$var$SVG, "path"));
    path.setAttribute("d", data.path);
    collection.appendChild(sym);
}
const $9a720f6ac7563389$var$prefix$1 = "ProseMirror-menu";
/**
An icon or label that, when clicked, executes a command.
*/ class $9a720f6ac7563389$export$2ce376c2cc3355c8 {
    /**
    Create a menu item.
    */ constructor(/**
    The spec used to create this item.
    */ spec){
        this.spec = spec;
    }
    /**
    Renders the icon according to its [display
    spec](https://prosemirror.net/docs/ref/#menu.MenuItemSpec.display), and adds an event handler which
    executes the command when the representation is clicked.
    */ render(view) {
        let spec = this.spec;
        let dom = spec.render ? spec.render(view) : spec.icon ? $9a720f6ac7563389$var$getIcon(spec.icon) : spec.label ? (0, $2b38a862177e6e10$export$2e2bcd8739ae039)("div", null, $9a720f6ac7563389$var$translate(view, spec.label)) : null;
        if (!dom) throw new RangeError("MenuItem without icon or label property");
        if (spec.title) {
            const title = typeof spec.title === "function" ? spec.title(view.state) : spec.title;
            dom.setAttribute("title", $9a720f6ac7563389$var$translate(view, title));
        }
        if (spec.class) dom.classList.add(spec.class);
        if (spec.css) dom.style.cssText += spec.css;
        dom.addEventListener("mousedown", (e)=>{
            e.preventDefault();
            if (!dom.classList.contains($9a720f6ac7563389$var$prefix$1 + "-disabled")) spec.run(view.state, view.dispatch, view, e);
        });
        function update(state) {
            if (spec.select) {
                let selected = spec.select(state);
                dom.style.display = selected ? "" : "none";
                if (!selected) return false;
            }
            let enabled = true;
            if (spec.enable) {
                enabled = spec.enable(state) || false;
                $9a720f6ac7563389$var$setClass(dom, $9a720f6ac7563389$var$prefix$1 + "-disabled", !enabled);
            }
            if (spec.active) {
                let active = enabled && spec.active(state) || false;
                $9a720f6ac7563389$var$setClass(dom, $9a720f6ac7563389$var$prefix$1 + "-active", active);
            }
            return true;
        }
        return {
            dom: dom,
            update: update
        };
    }
}
function $9a720f6ac7563389$var$translate(view, text) {
    return view._props.translate ? view._props.translate(text) : text;
}
let $9a720f6ac7563389$var$lastMenuEvent = {
    time: 0,
    node: null
};
function $9a720f6ac7563389$var$markMenuEvent(e) {
    $9a720f6ac7563389$var$lastMenuEvent.time = Date.now();
    $9a720f6ac7563389$var$lastMenuEvent.node = e.target;
}
function $9a720f6ac7563389$var$isMenuEvent(wrapper) {
    return Date.now() - 100 < $9a720f6ac7563389$var$lastMenuEvent.time && $9a720f6ac7563389$var$lastMenuEvent.node && wrapper.contains($9a720f6ac7563389$var$lastMenuEvent.node);
}
/**
A drop-down menu, displayed as a label with a downwards-pointing
triangle to the right of it.
*/ class $9a720f6ac7563389$export$931cbfb6bfb85fc {
    /**
    Create a dropdown wrapping the elements.
    */ constructor(content, /**
    @internal
    */ options = {}){
        this.options = options;
        this.options = options || {};
        this.content = Array.isArray(content) ? content : [
            content
        ];
    }
    /**
    Render the dropdown menu and sub-items.
    */ render(view) {
        let content = $9a720f6ac7563389$var$renderDropdownItems(this.content, view);
        let label = (0, $2b38a862177e6e10$export$2e2bcd8739ae039)("div", {
            class: $9a720f6ac7563389$var$prefix$1 + "-dropdown " + (this.options.class || ""),
            style: this.options.css
        }, $9a720f6ac7563389$var$translate(view, this.options.label || ""));
        if (this.options.title) label.setAttribute("title", $9a720f6ac7563389$var$translate(view, this.options.title));
        let wrap = (0, $2b38a862177e6e10$export$2e2bcd8739ae039)("div", {
            class: $9a720f6ac7563389$var$prefix$1 + "-dropdown-wrap"
        }, label);
        let open = null;
        let listeningOnClose = null;
        let close = ()=>{
            if (open && open.close()) {
                open = null;
                window.removeEventListener("mousedown", listeningOnClose);
            }
        };
        label.addEventListener("mousedown", (e)=>{
            e.preventDefault();
            $9a720f6ac7563389$var$markMenuEvent(e);
            if (open) close();
            else {
                open = this.expand(wrap, content.dom);
                window.addEventListener("mousedown", listeningOnClose = ()=>{
                    if (!$9a720f6ac7563389$var$isMenuEvent(wrap)) close();
                });
            }
        });
        function update(state) {
            let inner = content.update(state);
            wrap.style.display = inner ? "" : "none";
            return inner;
        }
        return {
            dom: wrap,
            update: update
        };
    }
    /**
    @internal
    */ expand(dom, items) {
        let menuDOM = (0, $2b38a862177e6e10$export$2e2bcd8739ae039)("div", {
            class: $9a720f6ac7563389$var$prefix$1 + "-dropdown-menu " + (this.options.class || "")
        }, items);
        let done = false;
        function close() {
            if (done) return;
            done = true;
            dom.removeChild(menuDOM);
            return true;
        }
        dom.appendChild(menuDOM);
        return {
            close: close,
            node: menuDOM
        };
    }
}
function $9a720f6ac7563389$var$renderDropdownItems(items, view) {
    let rendered = [], updates = [];
    for(let i = 0; i < items.length; i++){
        let { dom: dom , update: update  } = items[i].render(view);
        rendered.push((0, $2b38a862177e6e10$export$2e2bcd8739ae039)("div", {
            class: $9a720f6ac7563389$var$prefix$1 + "-dropdown-item"
        }, dom));
        updates.push(update);
    }
    return {
        dom: rendered,
        update: $9a720f6ac7563389$var$combineUpdates(updates, rendered)
    };
}
function $9a720f6ac7563389$var$combineUpdates(updates, nodes) {
    return (state)=>{
        let something = false;
        for(let i = 0; i < updates.length; i++){
            let up = updates[i](state);
            nodes[i].style.display = up ? "" : "none";
            if (up) something = true;
        }
        return something;
    };
}
/**
Represents a submenu wrapping a group of elements that start
hidden and expand to the right when hovered over or tapped.
*/ class $9a720f6ac7563389$export$ef5c18bf09e4884f {
    /**
    Creates a submenu for the given group of menu elements. The
    following options are recognized:
    */ constructor(content, /**
    @internal
    */ options = {}){
        this.options = options;
        this.content = Array.isArray(content) ? content : [
            content
        ];
    }
    /**
    Renders the submenu.
    */ render(view) {
        let items = $9a720f6ac7563389$var$renderDropdownItems(this.content, view);
        let label = (0, $2b38a862177e6e10$export$2e2bcd8739ae039)("div", {
            class: $9a720f6ac7563389$var$prefix$1 + "-submenu-label"
        }, $9a720f6ac7563389$var$translate(view, this.options.label || ""));
        let wrap = (0, $2b38a862177e6e10$export$2e2bcd8739ae039)("div", {
            class: $9a720f6ac7563389$var$prefix$1 + "-submenu-wrap"
        }, label, (0, $2b38a862177e6e10$export$2e2bcd8739ae039)("div", {
            class: $9a720f6ac7563389$var$prefix$1 + "-submenu"
        }, items.dom));
        let listeningOnClose = null;
        label.addEventListener("mousedown", (e)=>{
            e.preventDefault();
            $9a720f6ac7563389$var$markMenuEvent(e);
            $9a720f6ac7563389$var$setClass(wrap, $9a720f6ac7563389$var$prefix$1 + "-submenu-wrap-active", false);
            if (!listeningOnClose) window.addEventListener("mousedown", listeningOnClose = ()=>{
                if (!$9a720f6ac7563389$var$isMenuEvent(wrap)) {
                    wrap.classList.remove($9a720f6ac7563389$var$prefix$1 + "-submenu-wrap-active");
                    window.removeEventListener("mousedown", listeningOnClose);
                    listeningOnClose = null;
                }
            });
        });
        function update(state) {
            let inner = items.update(state);
            wrap.style.display = inner ? "" : "none";
            return inner;
        }
        return {
            dom: wrap,
            update: update
        };
    }
}
/**
Render the given, possibly nested, array of menu elements into a
document fragment, placing separators between them (and ensuring no
superfluous separators appear when some of the groups turn out to
be empty).
*/ function $9a720f6ac7563389$export$32280ef9552def7c(view, content) {
    let result = document.createDocumentFragment();
    let updates = [], separators = [];
    for(let i = 0; i < content.length; i++){
        let items = content[i], localUpdates = [], localNodes = [];
        for(let j = 0; j < items.length; j++){
            let { dom: dom , update: update  } = items[j].render(view);
            let span = (0, $2b38a862177e6e10$export$2e2bcd8739ae039)("span", {
                class: $9a720f6ac7563389$var$prefix$1 + "item"
            }, dom);
            result.appendChild(span);
            localNodes.push(span);
            localUpdates.push(update);
        }
        if (localUpdates.length) {
            updates.push($9a720f6ac7563389$var$combineUpdates(localUpdates, localNodes));
            if (i < content.length - 1) separators.push(result.appendChild($9a720f6ac7563389$var$separator()));
        }
    }
    function update1(state) {
        let something = false, needSep = false;
        for(let i = 0; i < updates.length; i++){
            let hasContent = updates[i](state);
            if (i) separators[i - 1].style.display = needSep && hasContent ? "" : "none";
            needSep = hasContent;
            if (hasContent) something = true;
        }
        return something;
    }
    return {
        dom: result,
        update: update1
    };
}
function $9a720f6ac7563389$var$separator() {
    return (0, $2b38a862177e6e10$export$2e2bcd8739ae039)("span", {
        class: $9a720f6ac7563389$var$prefix$1 + "separator"
    });
}
/**
A set of basic editor-related icons. Contains the properties
`join`, `lift`, `selectParentNode`, `undo`, `redo`, `strong`, `em`,
`code`, `link`, `bulletList`, `orderedList`, and `blockquote`, each
holding an object that can be used as the `icon` option to
`MenuItem`.
*/ const $9a720f6ac7563389$export$df03f54e09e486fa = {
    join: {
        width: 800,
        height: 900,
        path: "M0 75h800v125h-800z M0 825h800v-125h-800z M250 400h100v-100h100v100h100v100h-100v100h-100v-100h-100z"
    },
    lift: {
        width: 1024,
        height: 1024,
        path: "M219 310v329q0 7-5 12t-12 5q-8 0-13-5l-164-164q-5-5-5-13t5-13l164-164q5-5 13-5 7 0 12 5t5 12zM1024 749v109q0 7-5 12t-12 5h-987q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h987q7 0 12 5t5 12zM1024 530v109q0 7-5 12t-12 5h-621q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h621q7 0 12 5t5 12zM1024 310v109q0 7-5 12t-12 5h-621q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h621q7 0 12 5t5 12zM1024 91v109q0 7-5 12t-12 5h-987q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h987q7 0 12 5t5 12z"
    },
    selectParentNode: {
        text: "⬚",
        css: "font-weight: bold"
    },
    undo: {
        width: 1024,
        height: 1024,
        path: "M761 1024c113-206 132-520-313-509v253l-384-384 384-384v248c534-13 594 472 313 775z"
    },
    redo: {
        width: 1024,
        height: 1024,
        path: "M576 248v-248l384 384-384 384v-253c-446-10-427 303-313 509-280-303-221-789 313-775z"
    },
    strong: {
        width: 805,
        height: 1024,
        path: "M317 869q42 18 80 18 214 0 214-191 0-65-23-102-15-25-35-42t-38-26-46-14-48-6-54-1q-41 0-57 5 0 30-0 90t-0 90q0 4-0 38t-0 55 2 47 6 38zM309 442q24 4 62 4 46 0 81-7t62-25 42-51 14-81q0-40-16-70t-45-46-61-24-70-8q-28 0-74 7 0 28 2 86t2 86q0 15-0 45t-0 45q0 26 0 39zM0 950l1-53q8-2 48-9t60-15q4-6 7-15t4-19 3-18 1-21 0-19v-37q0-561-12-585-2-4-12-8t-25-6-28-4-27-2-17-1l-2-47q56-1 194-6t213-5q13 0 39 0t38 0q40 0 78 7t73 24 61 40 42 59 16 78q0 29-9 54t-22 41-36 32-41 25-48 22q88 20 146 76t58 141q0 57-20 102t-53 74-78 48-93 27-100 8q-25 0-75-1t-75-1q-60 0-175 6t-132 6z"
    },
    em: {
        width: 585,
        height: 1024,
        path: "M0 949l9-48q3-1 46-12t63-21q16-20 23-57 0-4 35-165t65-310 29-169v-14q-13-7-31-10t-39-4-33-3l10-58q18 1 68 3t85 4 68 1q27 0 56-1t69-4 56-3q-2 22-10 50-17 5-58 16t-62 19q-4 10-8 24t-5 22-4 26-3 24q-15 84-50 239t-44 203q-1 5-7 33t-11 51-9 47-3 32l0 10q9 2 105 17-1 25-9 56-6 0-18 0t-18 0q-16 0-49-5t-49-5q-78-1-117-1-29 0-81 5t-69 6z"
    },
    code: {
        width: 896,
        height: 1024,
        path: "M608 192l-96 96 224 224-224 224 96 96 288-320-288-320zM288 192l-288 320 288 320 96-96-224-224 224-224-96-96z"
    },
    link: {
        width: 951,
        height: 1024,
        path: "M832 694q0-22-16-38l-118-118q-16-16-38-16-24 0-41 18 1 1 10 10t12 12 8 10 7 14 2 15q0 22-16 38t-38 16q-8 0-15-2t-14-7-10-8-12-12-10-10q-18 17-18 41 0 22 16 38l117 118q15 15 38 15 22 0 38-14l84-83q16-16 16-38zM430 292q0-22-16-38l-117-118q-16-16-38-16-22 0-38 15l-84 83q-16 16-16 38 0 22 16 38l118 118q15 15 38 15 24 0 41-17-1-1-10-10t-12-12-8-10-7-14-2-15q0-22 16-38t38-16q8 0 15 2t14 7 10 8 12 12 10 10q18-17 18-41zM941 694q0 68-48 116l-84 83q-47 47-116 47-69 0-116-48l-117-118q-47-47-47-116 0-70 50-119l-50-50q-49 50-118 50-68 0-116-48l-118-118q-48-48-48-116t48-116l84-83q47-47 116-47 69 0 116 48l117 118q47 47 47 116 0 70-50 119l50 50q49-50 118-50 68 0 116 48l118 118q48 48 48 116z"
    },
    bulletList: {
        width: 768,
        height: 896,
        path: "M0 512h128v-128h-128v128zM0 256h128v-128h-128v128zM0 768h128v-128h-128v128zM256 512h512v-128h-512v128zM256 256h512v-128h-512v128zM256 768h512v-128h-512v128z"
    },
    orderedList: {
        width: 768,
        height: 896,
        path: "M320 512h448v-128h-448v128zM320 768h448v-128h-448v128zM320 128v128h448v-128h-448zM79 384h78v-256h-36l-85 23v50l43-2v185zM189 590c0-36-12-78-96-78-33 0-64 6-83 16l1 66c21-10 42-15 67-15s32 11 32 28c0 26-30 58-110 112v50h192v-67l-91 2c49-30 87-66 87-113l1-1z"
    },
    blockquote: {
        width: 640,
        height: 896,
        path: "M0 448v256h256v-256h-128c0 0 0-128 128-128v-128c0 0-256 0-256 256zM640 320v-128c0 0-256 0-256 256v256h256v-256h-128c0 0 0-128 128-128z"
    }
};
/**
Menu item for the `joinUp` command.
*/ const $9a720f6ac7563389$export$11baffb4edd2ca7f = new $9a720f6ac7563389$export$2ce376c2cc3355c8({
    title: "Join with above block",
    run: (0, $694358249add86fd$export$4bb15e6d4372b393),
    select: (state)=>(0, $694358249add86fd$export$4bb15e6d4372b393)(state),
    icon: $9a720f6ac7563389$export$df03f54e09e486fa.join
});
/**
Menu item for the `lift` command.
*/ const $9a720f6ac7563389$export$58f79fea701cb352 = new $9a720f6ac7563389$export$2ce376c2cc3355c8({
    title: "Lift out of enclosing block",
    run: (0, $694358249add86fd$export$590e8b2c435046d9),
    select: (state)=>(0, $694358249add86fd$export$590e8b2c435046d9)(state),
    icon: $9a720f6ac7563389$export$df03f54e09e486fa.lift
});
/**
Menu item for the `selectParentNode` command.
*/ const $9a720f6ac7563389$export$e7da091474561953 = new $9a720f6ac7563389$export$2ce376c2cc3355c8({
    title: "Select parent node",
    run: (0, $694358249add86fd$export$a37f6aaa9169911d),
    select: (state)=>(0, $694358249add86fd$export$a37f6aaa9169911d)(state),
    icon: $9a720f6ac7563389$export$df03f54e09e486fa.selectParentNode
});
/**
Menu item for the `undo` command.
*/ let $9a720f6ac7563389$export$e59d9ce4b90da7a2 = new $9a720f6ac7563389$export$2ce376c2cc3355c8({
    title: "Undo last change",
    run: (0, $46a6b29ccac0c6da$export$21f930c44940fd98),
    enable: (state)=>(0, $46a6b29ccac0c6da$export$21f930c44940fd98)(state),
    icon: $9a720f6ac7563389$export$df03f54e09e486fa.undo
});
/**
Menu item for the `redo` command.
*/ let $9a720f6ac7563389$export$fdbfb7c42a1822a2 = new $9a720f6ac7563389$export$2ce376c2cc3355c8({
    title: "Redo last undone change",
    run: (0, $46a6b29ccac0c6da$export$1688e416fee0a49e),
    enable: (state)=>(0, $46a6b29ccac0c6da$export$1688e416fee0a49e)(state),
    icon: $9a720f6ac7563389$export$df03f54e09e486fa.redo
});
/**
Build a menu item for wrapping the selection in a given node type.
Adds `run` and `select` properties to the ones present in
`options`. `options.attrs` may be an object that provides
attributes for the wrapping node.
*/ function $9a720f6ac7563389$export$8f5e79e4d0433569(nodeType, options) {
    let passedOptions = {
        run (state, dispatch) {
            return (0, $694358249add86fd$export$6e5e3c49755affd0)(nodeType, options.attrs)(state, dispatch);
        },
        select (state) {
            return (0, $694358249add86fd$export$6e5e3c49755affd0)(nodeType, options.attrs)(state);
        }
    };
    for(let prop in options)passedOptions[prop] = options[prop];
    return new $9a720f6ac7563389$export$2ce376c2cc3355c8(passedOptions);
}
/**
Build a menu item for changing the type of the textblock around the
selection to the given type. Provides `run`, `active`, and `select`
properties. Others must be given in `options`. `options.attrs` may
be an object to provide the attributes for the textblock node.
*/ function $9a720f6ac7563389$export$92aed8e2efb56f10(nodeType, options) {
    let command = (0, $694358249add86fd$export$36987f561c736aad)(nodeType, options.attrs);
    let passedOptions = {
        run: command,
        enable (state) {
            return command(state);
        },
        active (state) {
            let { $from: $from , to: to , node: node  } = state.selection;
            if (node) return node.hasMarkup(nodeType, options.attrs);
            return to <= $from.end() && $from.parent.hasMarkup(nodeType, options.attrs);
        }
    };
    for(let prop in options)passedOptions[prop] = options[prop];
    return new $9a720f6ac7563389$export$2ce376c2cc3355c8(passedOptions);
}
// Work around classList.toggle being broken in IE11
function $9a720f6ac7563389$var$setClass(dom, cls, on) {
    if (on) dom.classList.add(cls);
    else dom.classList.remove(cls);
}
const $9a720f6ac7563389$var$prefix = "ProseMirror-menubar";
function $9a720f6ac7563389$var$isIOS() {
    if (typeof navigator == "undefined") return false;
    let agent = navigator.userAgent;
    return !/Edge\/\d/.test(agent) && /AppleWebKit/.test(agent) && /Mobile\/\w+/.test(agent);
}
/**
A plugin that will place a menu bar above the editor. Note that
this involves wrapping the editor in an additional `<div>`.
*/ function $9a720f6ac7563389$export$4bada28d90893e2d(options) {
    return new (0, $ee27db283572d394$export$901cf72dabf2112a)({
        view (editorView) {
            return new $9a720f6ac7563389$var$MenuBarView(editorView, options);
        }
    });
}
class $9a720f6ac7563389$var$MenuBarView {
    constructor(editorView, options){
        this.editorView = editorView;
        this.options = options;
        this.spacer = null;
        this.maxHeight = 0;
        this.widthForMaxHeight = 0;
        this.floating = false;
        this.scrollHandler = null;
        this.wrapper = (0, $2b38a862177e6e10$export$2e2bcd8739ae039)("div", {
            class: $9a720f6ac7563389$var$prefix + "-wrapper"
        });
        this.menu = this.wrapper.appendChild((0, $2b38a862177e6e10$export$2e2bcd8739ae039)("div", {
            class: $9a720f6ac7563389$var$prefix
        }));
        this.menu.className = $9a720f6ac7563389$var$prefix;
        if (editorView.dom.parentNode) editorView.dom.parentNode.replaceChild(this.wrapper, editorView.dom);
        this.wrapper.appendChild(editorView.dom);
        let { dom: dom , update: update  } = $9a720f6ac7563389$export$32280ef9552def7c(this.editorView, this.options.content);
        this.contentUpdate = update;
        this.menu.appendChild(dom);
        this.update();
        if (options.floating && !$9a720f6ac7563389$var$isIOS()) {
            this.updateFloat();
            let potentialScrollers = $9a720f6ac7563389$var$getAllWrapping(this.wrapper);
            this.scrollHandler = (e)=>{
                let root = this.editorView.root;
                if (!(root.body || root).contains(this.wrapper)) potentialScrollers.forEach((el)=>el.removeEventListener("scroll", this.scrollHandler));
                else this.updateFloat(e.target.getBoundingClientRect ? e.target : undefined);
            };
            potentialScrollers.forEach((el)=>el.addEventListener("scroll", this.scrollHandler));
        }
    }
    update() {
        this.contentUpdate(this.editorView.state);
        if (this.floating) this.updateScrollCursor();
        else {
            if (this.menu.offsetWidth != this.widthForMaxHeight) {
                this.widthForMaxHeight = this.menu.offsetWidth;
                this.maxHeight = 0;
            }
            if (this.menu.offsetHeight > this.maxHeight) {
                this.maxHeight = this.menu.offsetHeight;
                this.menu.style.minHeight = this.maxHeight + "px";
            }
        }
    }
    updateScrollCursor() {
        let selection = this.editorView.root.getSelection();
        if (!selection.focusNode) return;
        let rects = selection.getRangeAt(0).getClientRects();
        let selRect = rects[$9a720f6ac7563389$var$selectionIsInverted(selection) ? 0 : rects.length - 1];
        if (!selRect) return;
        let menuRect = this.menu.getBoundingClientRect();
        if (selRect.top < menuRect.bottom && selRect.bottom > menuRect.top) {
            let scrollable = $9a720f6ac7563389$var$findWrappingScrollable(this.wrapper);
            if (scrollable) scrollable.scrollTop -= menuRect.bottom - selRect.top;
        }
    }
    updateFloat(scrollAncestor) {
        let parent = this.wrapper, editorRect = parent.getBoundingClientRect(), top = scrollAncestor ? Math.max(0, scrollAncestor.getBoundingClientRect().top) : 0;
        if (this.floating) {
            if (editorRect.top >= top || editorRect.bottom < this.menu.offsetHeight + 10) {
                this.floating = false;
                this.menu.style.position = this.menu.style.left = this.menu.style.top = this.menu.style.width = "";
                this.menu.style.display = "";
                this.spacer.parentNode.removeChild(this.spacer);
                this.spacer = null;
            } else {
                let border = (parent.offsetWidth - parent.clientWidth) / 2;
                this.menu.style.left = editorRect.left + border + "px";
                this.menu.style.display = editorRect.top > window.innerHeight ? "none" : "";
                if (scrollAncestor) this.menu.style.top = top + "px";
            }
        } else if (editorRect.top < top && editorRect.bottom >= this.menu.offsetHeight + 10) {
            this.floating = true;
            let menuRect = this.menu.getBoundingClientRect();
            this.menu.style.left = menuRect.left + "px";
            this.menu.style.width = menuRect.width + "px";
            if (scrollAncestor) this.menu.style.top = top + "px";
            this.menu.style.position = "fixed";
            this.spacer = (0, $2b38a862177e6e10$export$2e2bcd8739ae039)("div", {
                class: $9a720f6ac7563389$var$prefix + "-spacer",
                style: `height: ${menuRect.height}px`
            });
            parent.insertBefore(this.spacer, this.menu);
        }
    }
    destroy() {
        if (this.wrapper.parentNode) this.wrapper.parentNode.replaceChild(this.editorView.dom, this.wrapper);
    }
}
// Not precise, but close enough
function $9a720f6ac7563389$var$selectionIsInverted(selection) {
    if (selection.anchorNode == selection.focusNode) return selection.anchorOffset > selection.focusOffset;
    return selection.anchorNode.compareDocumentPosition(selection.focusNode) == Node.DOCUMENT_POSITION_FOLLOWING;
}
function $9a720f6ac7563389$var$findWrappingScrollable(node) {
    for(let cur = node.parentNode; cur; cur = cur.parentNode)if (cur.scrollHeight > cur.clientHeight) return cur;
}
function $9a720f6ac7563389$var$getAllWrapping(node) {
    let res = [
        window
    ];
    for(let cur = node.parentNode; cur; cur = cur.parentNode)res.push(cur);
    return res;
}





const $5967a48720747373$var$olDOM = [
    "ol",
    0
], $5967a48720747373$var$ulDOM = [
    "ul",
    0
], $5967a48720747373$var$liDOM = [
    "li",
    0
];
/**
An ordered list [node spec](https://prosemirror.net/docs/ref/#model.NodeSpec). Has a single
attribute, `order`, which determines the number at which the list
starts counting, and defaults to 1. Represented as an `<ol>`
element.
*/ const $5967a48720747373$export$a5dc81035676e7a = {
    attrs: {
        order: {
            default: 1
        }
    },
    parseDOM: [
        {
            tag: "ol",
            getAttrs (dom) {
                return {
                    order: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1
                };
            }
        }
    ],
    toDOM (node) {
        return node.attrs.order == 1 ? $5967a48720747373$var$olDOM : [
            "ol",
            {
                start: node.attrs.order
            },
            0
        ];
    }
};
/**
A bullet list node spec, represented in the DOM as `<ul>`.
*/ const $5967a48720747373$export$a140c94e5ea26bee = {
    parseDOM: [
        {
            tag: "ul"
        }
    ],
    toDOM () {
        return $5967a48720747373$var$ulDOM;
    }
};
/**
A list item (`<li>`) spec.
*/ const $5967a48720747373$export$76c7e83ecc9cdf05 = {
    parseDOM: [
        {
            tag: "li"
        }
    ],
    toDOM () {
        return $5967a48720747373$var$liDOM;
    },
    defining: true
};
function $5967a48720747373$var$add(obj, props) {
    let copy = {};
    for(let prop in obj)copy[prop] = obj[prop];
    for(let prop1 in props)copy[prop1] = props[prop1];
    return copy;
}
/**
Convenience function for adding list-related node types to a map
specifying the nodes for a schema. Adds
[`orderedList`](https://prosemirror.net/docs/ref/#schema-list.orderedList) as `"ordered_list"`,
[`bulletList`](https://prosemirror.net/docs/ref/#schema-list.bulletList) as `"bullet_list"`, and
[`listItem`](https://prosemirror.net/docs/ref/#schema-list.listItem) as `"list_item"`.

`itemContent` determines the content expression for the list items.
If you want the commands defined in this module to apply to your
list structure, it should have a shape like `"paragraph block*"` or
`"paragraph (ordered_list | bullet_list)*"`. `listGroup` can be
given to assign a group name to the list node types, for example
`"block"`.
*/ function $5967a48720747373$export$fa2e7d3d1550c2ea(nodes, itemContent, listGroup) {
    return nodes.append({
        ordered_list: $5967a48720747373$var$add($5967a48720747373$export$a5dc81035676e7a, {
            content: "list_item+",
            group: listGroup
        }),
        bullet_list: $5967a48720747373$var$add($5967a48720747373$export$a140c94e5ea26bee, {
            content: "list_item+",
            group: listGroup
        }),
        list_item: $5967a48720747373$var$add($5967a48720747373$export$76c7e83ecc9cdf05, {
            content: itemContent
        })
    });
}
/**
Returns a command function that wraps the selection in a list with
the given type an attributes. If `dispatch` is null, only return a
value to indicate whether this is possible, but don't actually
perform the change.
*/ function $5967a48720747373$export$a8aef45c6262afee(listType, attrs = null) {
    return function(state, dispatch) {
        let { $from: $from , $to: $to  } = state.selection;
        let range = $from.blockRange($to), doJoin = false, outerRange = range;
        if (!range) return false;
        // This is at the top of an existing list item
        if (range.depth >= 2 && $from.node(range.depth - 1).type.compatibleContent(listType) && range.startIndex == 0) {
            // Don't do anything if this is the top of the list
            if ($from.index(range.depth - 1) == 0) return false;
            let $insert = state.doc.resolve(range.start - 2);
            outerRange = new (0, $c8d507d90382f091$export$7bc461ceb770fb16)($insert, $insert, range.depth);
            if (range.endIndex < range.parent.childCount) range = new (0, $c8d507d90382f091$export$7bc461ceb770fb16)($from, state.doc.resolve($to.end(range.depth)), range.depth);
            doJoin = true;
        }
        let wrap = (0, $5dfe06a1d53a4883$export$118cb9a83e81ba37)(outerRange, listType, attrs, range);
        if (!wrap) return false;
        if (dispatch) dispatch($5967a48720747373$var$doWrapInList(state.tr, range, wrap, doJoin, listType).scrollIntoView());
        return true;
    };
}
function $5967a48720747373$var$doWrapInList(tr, range, wrappers, joinBefore, listType) {
    let content = (0, $c8d507d90382f091$export$ffb0004e005737fa).empty;
    for(let i = wrappers.length - 1; i >= 0; i--)content = (0, $c8d507d90382f091$export$ffb0004e005737fa).from(wrappers[i].type.create(wrappers[i].attrs, content));
    tr.step(new (0, $5dfe06a1d53a4883$export$444ba800d6024a98)(range.start - (joinBefore ? 2 : 0), range.end, range.start, range.end, new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)(content, 0, 0), wrappers.length, true));
    let found = 0;
    for(let i1 = 0; i1 < wrappers.length; i1++)if (wrappers[i1].type == listType) found = i1 + 1;
    let splitDepth = wrappers.length - found;
    let splitPos = range.start + wrappers.length - (joinBefore ? 2 : 0), parent = range.parent;
    for(let i2 = range.startIndex, e = range.endIndex, first = true; i2 < e; i2++, first = false){
        if (!first && (0, $5dfe06a1d53a4883$export$5aaf008897aef029)(tr.doc, splitPos, splitDepth)) {
            tr.split(splitPos, splitDepth);
            splitPos += 2 * splitDepth;
        }
        splitPos += parent.child(i2).nodeSize;
    }
    return tr;
}
/**
Build a command that splits a non-empty textblock at the top level
of a list item by also splitting that list item.
*/ function $5967a48720747373$export$e920ee2eb756d384(itemType) {
    return function(state, dispatch) {
        let { $from: $from , $to: $to , node: node  } = state.selection;
        if (node && node.isBlock || $from.depth < 2 || !$from.sameParent($to)) return false;
        let grandParent = $from.node(-1);
        if (grandParent.type != itemType) return false;
        if ($from.parent.content.size == 0 && $from.node(-1).childCount == $from.indexAfter(-1)) {
            // In an empty block. If this is a nested list, the wrapping
            // list item should be split. Otherwise, bail out and let next
            // command handle lifting.
            if ($from.depth == 3 || $from.node(-3).type != itemType || $from.index(-2) != $from.node(-2).childCount - 1) return false;
            if (dispatch) {
                let wrap = (0, $c8d507d90382f091$export$ffb0004e005737fa).empty;
                let depthBefore = $from.index(-1) ? 1 : $from.index(-2) ? 2 : 3;
                // Build a fragment containing empty versions of the structure
                // from the outer list item to the parent node of the cursor
                for(let d = $from.depth - depthBefore; d >= $from.depth - 3; d--)wrap = (0, $c8d507d90382f091$export$ffb0004e005737fa).from($from.node(d).copy(wrap));
                let depthAfter = $from.indexAfter(-1) < $from.node(-2).childCount ? 1 : $from.indexAfter(-2) < $from.node(-3).childCount ? 2 : 3;
                // Add a second list item with an empty default start node
                wrap = wrap.append((0, $c8d507d90382f091$export$ffb0004e005737fa).from(itemType.createAndFill()));
                let start = $from.before($from.depth - (depthBefore - 1));
                let tr = state.tr.replace(start, $from.after(-depthAfter), new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)(wrap, 4 - depthBefore, 0));
                let sel = -1;
                tr.doc.nodesBetween(start, tr.doc.content.size, (node, pos)=>{
                    if (sel > -1) return false;
                    if (node.isTextblock && node.content.size == 0) sel = pos + 1;
                });
                if (sel > -1) tr.setSelection((0, $ee27db283572d394$export$52baac22726c72bf).near(tr.doc.resolve(sel)));
                dispatch(tr.scrollIntoView());
            }
            return true;
        }
        let nextType = $to.pos == $from.end() ? grandParent.contentMatchAt(0).defaultType : null;
        let tr1 = state.tr.delete($from.pos, $to.pos);
        let types = nextType ? [
            null,
            {
                type: nextType
            }
        ] : undefined;
        if (!(0, $5dfe06a1d53a4883$export$5aaf008897aef029)(tr1.doc, $from.pos, 2, types)) return false;
        if (dispatch) dispatch(tr1.split($from.pos, 2, types).scrollIntoView());
        return true;
    };
}
/**
Create a command to lift the list item around the selection up into
a wrapping list.
*/ function $5967a48720747373$export$e74cd5adb935a538(itemType) {
    return function(state, dispatch) {
        let { $from: $from , $to: $to  } = state.selection;
        let range = $from.blockRange($to, (node)=>node.childCount > 0 && node.firstChild.type == itemType);
        if (!range) return false;
        if (!dispatch) return true;
        if ($from.node(range.depth - 1).type == itemType) return $5967a48720747373$var$liftToOuterList(state, dispatch, itemType, range);
        else return $5967a48720747373$var$liftOutOfList(state, dispatch, range);
    };
}
function $5967a48720747373$var$liftToOuterList(state, dispatch, itemType, range) {
    let tr = state.tr, end = range.end, endOfList = range.$to.end(range.depth);
    if (end < endOfList) {
        // There are siblings after the lifted items, which must become
        // children of the last item
        tr.step(new (0, $5dfe06a1d53a4883$export$444ba800d6024a98)(end - 1, endOfList, end, endOfList, new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)((0, $c8d507d90382f091$export$ffb0004e005737fa).from(itemType.create(null, range.parent.copy())), 1, 0), 1, true));
        range = new (0, $c8d507d90382f091$export$7bc461ceb770fb16)(tr.doc.resolve(range.$from.pos), tr.doc.resolve(endOfList), range.depth);
    }
    const target = (0, $5dfe06a1d53a4883$export$f1508b72cc76a09e)(range);
    if (target == null) return false;
    tr.lift(range, target);
    let after = tr.mapping.map(end, -1) - 1;
    if ((0, $5dfe06a1d53a4883$export$f15f89fd9d8cc98a)(tr.doc, after)) tr.join(after);
    dispatch(tr.scrollIntoView());
    return true;
}
function $5967a48720747373$var$liftOutOfList(state, dispatch, range) {
    let tr = state.tr, list = range.parent;
    // Merge the list items into a single big item
    for(let pos = range.end, i = range.endIndex - 1, e = range.startIndex; i > e; i--){
        pos -= list.child(i).nodeSize;
        tr.delete(pos - 1, pos + 1);
    }
    let $start = tr.doc.resolve(range.start), item = $start.nodeAfter;
    if (tr.mapping.map(range.end) != range.start + $start.nodeAfter.nodeSize) return false;
    let atStart = range.startIndex == 0, atEnd = range.endIndex == list.childCount;
    let parent = $start.node(-1), indexBefore = $start.index(-1);
    if (!parent.canReplace(indexBefore + (atStart ? 0 : 1), indexBefore + 1, item.content.append(atEnd ? (0, $c8d507d90382f091$export$ffb0004e005737fa).empty : (0, $c8d507d90382f091$export$ffb0004e005737fa).from(list)))) return false;
    let start = $start.pos, end = start + item.nodeSize;
    // Strip off the surrounding list. At the sides where we're not at
    // the end of the list, the existing list is closed. At sides where
    // this is the end, it is overwritten to its end.
    tr.step(new (0, $5dfe06a1d53a4883$export$444ba800d6024a98)(start - (atStart ? 1 : 0), end + (atEnd ? 1 : 0), start + 1, end - 1, new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)((atStart ? (0, $c8d507d90382f091$export$ffb0004e005737fa).empty : (0, $c8d507d90382f091$export$ffb0004e005737fa).from(list.copy((0, $c8d507d90382f091$export$ffb0004e005737fa).empty))).append(atEnd ? (0, $c8d507d90382f091$export$ffb0004e005737fa).empty : (0, $c8d507d90382f091$export$ffb0004e005737fa).from(list.copy((0, $c8d507d90382f091$export$ffb0004e005737fa).empty))), atStart ? 0 : 1, atEnd ? 0 : 1), atStart ? 0 : 1));
    dispatch(tr.scrollIntoView());
    return true;
}
/**
Create a command to sink the list item around the selection down
into an inner list.
*/ function $5967a48720747373$export$dd505f850a3798a4(itemType) {
    return function(state, dispatch) {
        let { $from: $from , $to: $to  } = state.selection;
        let range = $from.blockRange($to, (node)=>node.childCount > 0 && node.firstChild.type == itemType);
        if (!range) return false;
        let startIndex = range.startIndex;
        if (startIndex == 0) return false;
        let parent = range.parent, nodeBefore = parent.child(startIndex - 1);
        if (nodeBefore.type != itemType) return false;
        if (dispatch) {
            let nestedBefore = nodeBefore.lastChild && nodeBefore.lastChild.type == parent.type;
            let inner = (0, $c8d507d90382f091$export$ffb0004e005737fa).from(nestedBefore ? itemType.create() : null);
            let slice = new (0, $c8d507d90382f091$export$b3f2e2de3a8baa1e)((0, $c8d507d90382f091$export$ffb0004e005737fa).from(itemType.create(null, (0, $c8d507d90382f091$export$ffb0004e005737fa).from(parent.type.create(null, inner)))), nestedBefore ? 3 : 1, 0);
            let before = range.start, after = range.end;
            dispatch(state.tr.step(new (0, $5dfe06a1d53a4883$export$444ba800d6024a98)(before - (nestedBefore ? 3 : 1), after, before, after, slice, 1, true)).scrollIntoView());
        }
        return true;
    };
}




/**
Input rules are regular expressions describing a piece of text
that, when typed, causes something to happen. This might be
changing two dashes into an emdash, wrapping a paragraph starting
with `"> "` into a blockquote, or something entirely different.
*/ class $0a03c0b225fbbfe6$export$9b55e2b000ad65f2 {
    // :: (RegExp, union<string, (state: EditorState, match: [string], start: number, end: number) → ?Transaction>)
    /**
    Create an input rule. The rule applies when the user typed
    something and the text directly in front of the cursor matches
    `match`, which should end with `$`.
    
    The `handler` can be a string, in which case the matched text, or
    the first matched group in the regexp, is replaced by that
    string.
    
    Or a it can be a function, which will be called with the match
    array produced by
    [`RegExp.exec`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec),
    as well as the start and end of the matched range, and which can
    return a [transaction](https://prosemirror.net/docs/ref/#state.Transaction) that describes the
    rule's effect, or null to indicate the input was not handled.
    */ constructor(/**
    @internal
    */ match, handler){
        this.match = match;
        this.match = match;
        this.handler = typeof handler == "string" ? $0a03c0b225fbbfe6$var$stringHandler(handler) : handler;
    }
}
function $0a03c0b225fbbfe6$var$stringHandler(string) {
    return function(state, match, start, end) {
        let insert = string;
        if (match[1]) {
            let offset = match[0].lastIndexOf(match[1]);
            insert += match[0].slice(offset + match[1].length);
            start += offset;
            let cutOff = start - end;
            if (cutOff > 0) {
                insert = match[0].slice(offset - cutOff, offset) + insert;
                start = end;
            }
        }
        return state.tr.insertText(insert, start, end);
    };
}
const $0a03c0b225fbbfe6$var$MAX_MATCH = 500;
/**
Create an input rules plugin. When enabled, it will cause text
input that matches any of the given rules to trigger the rule's
action.
*/ function $0a03c0b225fbbfe6$export$9bc12e8cb1b5422f({ rules: rules  }) {
    let plugin = new (0, $ee27db283572d394$export$901cf72dabf2112a)({
        state: {
            init () {
                return null;
            },
            apply (tr, prev) {
                let stored = tr.getMeta(this);
                if (stored) return stored;
                return tr.selectionSet || tr.docChanged ? null : prev;
            }
        },
        props: {
            handleTextInput (view, from, to, text) {
                return $0a03c0b225fbbfe6$var$run(view, from, to, text, rules, plugin);
            },
            handleDOMEvents: {
                compositionend: (view)=>{
                    setTimeout(()=>{
                        let { $cursor: $cursor  } = view.state.selection;
                        if ($cursor) $0a03c0b225fbbfe6$var$run(view, $cursor.pos, $cursor.pos, "", rules, plugin);
                    });
                }
            }
        },
        isInputRules: true
    });
    return plugin;
}
function $0a03c0b225fbbfe6$var$run(view, from, to, text, rules, plugin) {
    if (view.composing) return false;
    let state = view.state, $from = state.doc.resolve(from);
    if ($from.parent.type.spec.code) return false;
    let textBefore = $from.parent.textBetween(Math.max(0, $from.parentOffset - $0a03c0b225fbbfe6$var$MAX_MATCH), $from.parentOffset, null, "￼") + text;
    for(let i = 0; i < rules.length; i++){
        let match = rules[i].match.exec(textBefore);
        let tr = match && rules[i].handler(state, match, from - (match[0].length - text.length), to);
        if (!tr) continue;
        view.dispatch(tr.setMeta(plugin, {
            transform: tr,
            from: from,
            to: to,
            text: text
        }));
        return true;
    }
    return false;
}
/**
This is a command that will undo an input rule, if applying such a
rule was the last thing that the user did.
*/ const $0a03c0b225fbbfe6$export$8b5652a4bcfffc13 = (state, dispatch)=>{
    let plugins = state.plugins;
    for(let i = 0; i < plugins.length; i++){
        let plugin = plugins[i], undoable;
        if (plugin.spec.isInputRules && (undoable = plugin.getState(state))) {
            if (dispatch) {
                let tr = state.tr, toUndo = undoable.transform;
                for(let j = toUndo.steps.length - 1; j >= 0; j--)tr.step(toUndo.steps[j].invert(toUndo.docs[j]));
                if (undoable.text) {
                    let marks = tr.doc.resolve(undoable.from).marks();
                    tr.replaceWith(undoable.from, undoable.to, state.schema.text(undoable.text, marks));
                } else tr.delete(undoable.from, undoable.to);
                dispatch(tr);
            }
            return true;
        }
    }
    return false;
};
/**
Converts double dashes to an emdash.
*/ const $0a03c0b225fbbfe6$export$d52f6fa9078fe05f = new $0a03c0b225fbbfe6$export$9b55e2b000ad65f2(/--$/, "—");
/**
Converts three dots to an ellipsis character.
*/ const $0a03c0b225fbbfe6$export$a5b94313d6908893 = new $0a03c0b225fbbfe6$export$9b55e2b000ad65f2(/\.\.\.$/, "…");
/**
“Smart” opening double quotes.
*/ const $0a03c0b225fbbfe6$export$4850414cc8d7db21 = new $0a03c0b225fbbfe6$export$9b55e2b000ad65f2(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(")$/, "“");
/**
“Smart” closing double quotes.
*/ const $0a03c0b225fbbfe6$export$8b28a69da252f0ac = new $0a03c0b225fbbfe6$export$9b55e2b000ad65f2(/"$/, "”");
/**
“Smart” opening single quotes.
*/ const $0a03c0b225fbbfe6$export$e175dfb3924d6671 = new $0a03c0b225fbbfe6$export$9b55e2b000ad65f2(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(')$/, "‘");
/**
“Smart” closing single quotes.
*/ const $0a03c0b225fbbfe6$export$48be95a1ca65a2bd = new $0a03c0b225fbbfe6$export$9b55e2b000ad65f2(/'$/, "’");
/**
Smart-quote related input rules.
*/ const $0a03c0b225fbbfe6$export$896039c3677cf296 = [
    $0a03c0b225fbbfe6$export$4850414cc8d7db21,
    $0a03c0b225fbbfe6$export$8b28a69da252f0ac,
    $0a03c0b225fbbfe6$export$e175dfb3924d6671,
    $0a03c0b225fbbfe6$export$48be95a1ca65a2bd
];
/**
Build an input rule for automatically wrapping a textblock when a
given string is typed. The `regexp` argument is
directly passed through to the `InputRule` constructor. You'll
probably want the regexp to start with `^`, so that the pattern can
only occur at the start of a textblock.

`nodeType` is the type of node to wrap in. If it needs attributes,
you can either pass them directly, or pass a function that will
compute them from the regular expression match.

By default, if there's a node with the same type above the newly
wrapped node, the rule will try to [join](https://prosemirror.net/docs/ref/#transform.Transform.join) those
two nodes. You can pass a join predicate, which takes a regular
expression match and the node before the wrapped node, and can
return a boolean to indicate whether a join should happen.
*/ function $0a03c0b225fbbfe6$export$f7316d89abe4e1c1(regexp, nodeType, getAttrs = null, joinPredicate) {
    return new $0a03c0b225fbbfe6$export$9b55e2b000ad65f2(regexp, (state, match, start, end)=>{
        let attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
        let tr = state.tr.delete(start, end);
        let $start = tr.doc.resolve(start), range = $start.blockRange(), wrapping = range && (0, $5dfe06a1d53a4883$export$118cb9a83e81ba37)(range, nodeType, attrs);
        if (!wrapping) return null;
        tr.wrap(range, wrapping);
        let before = tr.doc.resolve(start - 1).nodeBefore;
        if (before && before.type == nodeType && (0, $5dfe06a1d53a4883$export$f15f89fd9d8cc98a)(tr.doc, start - 1) && (!joinPredicate || joinPredicate(match, before))) tr.join(start - 1);
        return tr;
    });
}
/**
Build an input rule that changes the type of a textblock when the
matched text is typed into it. You'll usually want to start your
regexp with `^` to that it is only matched at the start of a
textblock. The optional `getAttrs` parameter can be used to compute
the new node's attributes, and works the same as in the
`wrappingInputRule` function.
*/ function $0a03c0b225fbbfe6$export$cc081314d3f6ffb0(regexp, nodeType, getAttrs = null) {
    return new $0a03c0b225fbbfe6$export$9b55e2b000ad65f2(regexp, (state, match, start, end)=>{
        let $start = state.doc.resolve(start);
        let attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
        if (!$start.node(-1).canReplaceWith($start.index(-1), $start.indexAfter(-1), nodeType)) return null;
        return state.tr.delete(start, end).setBlockType(start, start, nodeType, attrs);
    });
}


const $6a2e37ef3177fc1c$var$prefix = "ProseMirror-prompt";
function $6a2e37ef3177fc1c$var$openPrompt(options) {
    let wrapper = document.body.appendChild(document.createElement("div"));
    wrapper.className = $6a2e37ef3177fc1c$var$prefix;
    let mouseOutside = (e)=>{
        if (!wrapper.contains(e.target)) close();
    };
    setTimeout(()=>window.addEventListener("mousedown", mouseOutside), 50);
    let close = ()=>{
        window.removeEventListener("mousedown", mouseOutside);
        if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
    };
    let domFields = [];
    for(let name in options.fields)domFields.push(options.fields[name].render());
    let submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className = $6a2e37ef3177fc1c$var$prefix + "-submit";
    submitButton.textContent = "OK";
    let cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = $6a2e37ef3177fc1c$var$prefix + "-cancel";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", close);
    let form = wrapper.appendChild(document.createElement("form"));
    if (options.title) form.appendChild(document.createElement("h5")).textContent = options.title;
    domFields.forEach((field)=>{
        form.appendChild(document.createElement("div")).appendChild(field);
    });
    let buttons = form.appendChild(document.createElement("div"));
    buttons.className = $6a2e37ef3177fc1c$var$prefix + "-buttons";
    buttons.appendChild(submitButton);
    buttons.appendChild(document.createTextNode(" "));
    buttons.appendChild(cancelButton);
    let box = wrapper.getBoundingClientRect();
    wrapper.style.top = (window.innerHeight - box.height) / 2 + "px";
    wrapper.style.left = (window.innerWidth - box.width) / 2 + "px";
    let submit = ()=>{
        let params = $6a2e37ef3177fc1c$var$getValues(options.fields, domFields);
        if (params) {
            close();
            options.callback(params);
        }
    };
    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        submit();
    });
    form.addEventListener("keydown", (e)=>{
        if (e.keyCode == 27) {
            e.preventDefault();
            close();
        } else if (e.keyCode == 13 && !(e.ctrlKey || e.metaKey || e.shiftKey)) {
            e.preventDefault();
            submit();
        } else if (e.keyCode == 9) window.setTimeout(()=>{
            if (!wrapper.contains(document.activeElement)) close();
        }, 500);
    });
    let input = form.elements[0];
    if (input) input.focus();
}
function $6a2e37ef3177fc1c$var$getValues(fields, domFields) {
    let result = Object.create(null), i = 0;
    for(let name in fields){
        let field = fields[name], dom = domFields[i++];
        let value = field.read(dom), bad = field.validate(value);
        if (bad) {
            $6a2e37ef3177fc1c$var$reportInvalid(dom, bad);
            return null;
        }
        result[name] = field.clean(value);
    }
    return result;
}
function $6a2e37ef3177fc1c$var$reportInvalid(dom, message) {
    // FIXME this is awful and needs a lot more work
    let parent = dom.parentNode;
    let msg = parent.appendChild(document.createElement("div"));
    msg.style.left = dom.offsetLeft + dom.offsetWidth + 2 + "px";
    msg.style.top = dom.offsetTop - 5 + "px";
    msg.className = "ProseMirror-invalid";
    msg.textContent = message;
    setTimeout(()=>parent.removeChild(msg), 1500);
}
/**
The type of field that `openPrompt` expects to be passed to it.
*/ class $6a2e37ef3177fc1c$var$Field {
    /**
    Create a field with the given options. Options support by all
    field types are:
    */ constructor(/**
    @internal
    */ options){
        this.options = options;
    }
    /**
    Read the field's value from its DOM node.
    */ read(dom) {
        return dom.value;
    }
    /**
    A field-type-specific validation function.
    */ validateType(value) {
        return null;
    }
    /**
    @internal
    */ validate(value) {
        if (!value && this.options.required) return "Required field";
        return this.validateType(value) || (this.options.validate ? this.options.validate(value) : null);
    }
    clean(value) {
        return this.options.clean ? this.options.clean(value) : value;
    }
}
/**
A field class for single-line text fields.
*/ class $6a2e37ef3177fc1c$var$TextField extends $6a2e37ef3177fc1c$var$Field {
    render() {
        let input = document.createElement("input");
        input.type = "text";
        input.placeholder = this.options.label;
        input.value = this.options.value || "";
        input.autocomplete = "off";
        return input;
    }
}
// Helpers to create specific types of items
function $6a2e37ef3177fc1c$var$canInsert(state, nodeType) {
    let $from = state.selection.$from;
    for(let d = $from.depth; d >= 0; d--){
        let index = $from.index(d);
        if ($from.node(d).canReplaceWith(index, index, nodeType)) return true;
    }
    return false;
}
function $6a2e37ef3177fc1c$var$insertImageItem(nodeType) {
    return new (0, $9a720f6ac7563389$export$2ce376c2cc3355c8)({
        title: "Insert image",
        label: "Image",
        enable (state) {
            return $6a2e37ef3177fc1c$var$canInsert(state, nodeType);
        },
        run (state, _, view) {
            let { from: from , to: to  } = state.selection, attrs = null;
            if (state.selection instanceof (0, $ee27db283572d394$export$e2940151ac854c0b) && state.selection.node.type == nodeType) attrs = state.selection.node.attrs;
            $6a2e37ef3177fc1c$var$openPrompt({
                title: "Insert image",
                fields: {
                    src: new $6a2e37ef3177fc1c$var$TextField({
                        label: "Location",
                        required: true,
                        value: attrs && attrs.src
                    }),
                    title: new $6a2e37ef3177fc1c$var$TextField({
                        label: "Title",
                        value: attrs && attrs.title
                    }),
                    alt: new $6a2e37ef3177fc1c$var$TextField({
                        label: "Description",
                        value: attrs ? attrs.alt : state.doc.textBetween(from, to, " ")
                    })
                },
                callback (attrs) {
                    view.dispatch(view.state.tr.replaceSelectionWith(nodeType.createAndFill(attrs)));
                    view.focus();
                }
            });
        }
    });
}
function $6a2e37ef3177fc1c$var$cmdItem(cmd, options) {
    let passedOptions = {
        label: options.title,
        run: cmd
    };
    for(let prop in options)passedOptions[prop] = options[prop];
    if (!options.enable && !options.select) passedOptions[options.enable ? "enable" : "select"] = (state)=>cmd(state);
    return new (0, $9a720f6ac7563389$export$2ce376c2cc3355c8)(passedOptions);
}
function $6a2e37ef3177fc1c$var$markActive(state, type) {
    let { from: from , $from: $from , to: to , empty: empty  } = state.selection;
    if (empty) return !!type.isInSet(state.storedMarks || $from.marks());
    else return state.doc.rangeHasMark(from, to, type);
}
function $6a2e37ef3177fc1c$var$markItem(markType, options) {
    let passedOptions = {
        active (state) {
            return $6a2e37ef3177fc1c$var$markActive(state, markType);
        }
    };
    for(let prop in options)passedOptions[prop] = options[prop];
    return $6a2e37ef3177fc1c$var$cmdItem((0, $694358249add86fd$export$797ad2667b8015a8)(markType), passedOptions);
}
function $6a2e37ef3177fc1c$var$linkItem(markType) {
    return new (0, $9a720f6ac7563389$export$2ce376c2cc3355c8)({
        title: "Add or remove link",
        icon: (0, $9a720f6ac7563389$export$df03f54e09e486fa).link,
        active (state) {
            return $6a2e37ef3177fc1c$var$markActive(state, markType);
        },
        enable (state) {
            return !state.selection.empty;
        },
        run (state, dispatch, view) {
            if ($6a2e37ef3177fc1c$var$markActive(state, markType)) {
                (0, $694358249add86fd$export$797ad2667b8015a8)(markType)(state, dispatch);
                return true;
            }
            $6a2e37ef3177fc1c$var$openPrompt({
                title: "Create a link",
                fields: {
                    href: new $6a2e37ef3177fc1c$var$TextField({
                        label: "Link target",
                        required: true
                    }),
                    title: new $6a2e37ef3177fc1c$var$TextField({
                        label: "Title"
                    })
                },
                callback (attrs) {
                    (0, $694358249add86fd$export$797ad2667b8015a8)(markType, attrs)(view.state, view.dispatch);
                    view.focus();
                }
            });
        }
    });
}
function $6a2e37ef3177fc1c$var$wrapListItem(nodeType, options) {
    return $6a2e37ef3177fc1c$var$cmdItem((0, $5967a48720747373$export$a8aef45c6262afee)(nodeType, options.attrs), options);
}
/**
Given a schema, look for default mark and node types in it and
return an object with relevant menu items relating to those marks.
*/ function $6a2e37ef3177fc1c$export$630b7735451169d5(schema) {
    let r = {};
    let mark;
    if (mark = schema.marks.strong) r.toggleStrong = $6a2e37ef3177fc1c$var$markItem(mark, {
        title: "Toggle strong style",
        icon: (0, $9a720f6ac7563389$export$df03f54e09e486fa).strong
    });
    if (mark = schema.marks.em) r.toggleEm = $6a2e37ef3177fc1c$var$markItem(mark, {
        title: "Toggle emphasis",
        icon: (0, $9a720f6ac7563389$export$df03f54e09e486fa).em
    });
    if (mark = schema.marks.code) r.toggleCode = $6a2e37ef3177fc1c$var$markItem(mark, {
        title: "Toggle code font",
        icon: (0, $9a720f6ac7563389$export$df03f54e09e486fa).code
    });
    if (mark = schema.marks.link) r.toggleLink = $6a2e37ef3177fc1c$var$linkItem(mark);
    let node;
    if (node = schema.nodes.image) r.insertImage = $6a2e37ef3177fc1c$var$insertImageItem(node);
    if (node = schema.nodes.bullet_list) r.wrapBulletList = $6a2e37ef3177fc1c$var$wrapListItem(node, {
        title: "Wrap in bullet list",
        icon: (0, $9a720f6ac7563389$export$df03f54e09e486fa).bulletList
    });
    if (node = schema.nodes.ordered_list) r.wrapOrderedList = $6a2e37ef3177fc1c$var$wrapListItem(node, {
        title: "Wrap in ordered list",
        icon: (0, $9a720f6ac7563389$export$df03f54e09e486fa).orderedList
    });
    if (node = schema.nodes.blockquote) r.wrapBlockQuote = (0, $9a720f6ac7563389$export$8f5e79e4d0433569)(node, {
        title: "Wrap in block quote",
        icon: (0, $9a720f6ac7563389$export$df03f54e09e486fa).blockquote
    });
    if (node = schema.nodes.paragraph) r.makeParagraph = (0, $9a720f6ac7563389$export$92aed8e2efb56f10)(node, {
        title: "Change to paragraph",
        label: "Plain"
    });
    if (node = schema.nodes.code_block) r.makeCodeBlock = (0, $9a720f6ac7563389$export$92aed8e2efb56f10)(node, {
        title: "Change to code block",
        label: "Code"
    });
    if (node = schema.nodes.heading) for(let i = 1; i <= 10; i++)r["makeHead" + i] = (0, $9a720f6ac7563389$export$92aed8e2efb56f10)(node, {
        title: "Change to heading " + i,
        label: "Level " + i,
        attrs: {
            level: i
        }
    });
    if (node = schema.nodes.horizontal_rule) {
        let hr = node;
        r.insertHorizontalRule = new (0, $9a720f6ac7563389$export$2ce376c2cc3355c8)({
            title: "Insert horizontal rule",
            label: "Horizontal rule",
            enable (state) {
                return $6a2e37ef3177fc1c$var$canInsert(state, hr);
            },
            run (state, dispatch) {
                dispatch(state.tr.replaceSelectionWith(hr.create()));
            }
        });
    }
    let cut = (arr)=>arr.filter((x)=>x);
    r.insertMenu = new (0, $9a720f6ac7563389$export$931cbfb6bfb85fc)(cut([
        r.insertImage,
        r.insertHorizontalRule
    ]), {
        label: "Insert"
    });
    r.typeMenu = new (0, $9a720f6ac7563389$export$931cbfb6bfb85fc)(cut([
        r.makeParagraph,
        r.makeCodeBlock,
        r.makeHead1 && new (0, $9a720f6ac7563389$export$ef5c18bf09e4884f)(cut([
            r.makeHead1,
            r.makeHead2,
            r.makeHead3,
            r.makeHead4,
            r.makeHead5,
            r.makeHead6
        ]), {
            label: "Heading"
        })
    ]), {
        label: "Type..."
    });
    r.inlineMenu = [
        cut([
            r.toggleStrong,
            r.toggleEm,
            r.toggleCode,
            r.toggleLink
        ])
    ];
    r.blockMenu = [
        cut([
            r.wrapBulletList,
            r.wrapOrderedList,
            r.wrapBlockQuote,
            (0, $9a720f6ac7563389$export$11baffb4edd2ca7f),
            (0, $9a720f6ac7563389$export$58f79fea701cb352),
            (0, $9a720f6ac7563389$export$e7da091474561953)
        ])
    ];
    r.fullMenu = r.inlineMenu.concat([
        [
            r.insertMenu,
            r.typeMenu
        ]
    ], [
        [
            (0, $9a720f6ac7563389$export$e59d9ce4b90da7a2),
            (0, $9a720f6ac7563389$export$fdbfb7c42a1822a2)
        ]
    ], r.blockMenu);
    return r;
}
const $6a2e37ef3177fc1c$var$mac = typeof navigator != "undefined" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : false;
/**
Inspect the given schema looking for marks and nodes from the
basic schema, and if found, add key bindings related to them.
This will add:

* **Mod-b** for toggling [strong](https://prosemirror.net/docs/ref/#schema-basic.StrongMark)
* **Mod-i** for toggling [emphasis](https://prosemirror.net/docs/ref/#schema-basic.EmMark)
* **Mod-`** for toggling [code font](https://prosemirror.net/docs/ref/#schema-basic.CodeMark)
* **Ctrl-Shift-0** for making the current textblock a paragraph
* **Ctrl-Shift-1** to **Ctrl-Shift-Digit6** for making the current
  textblock a heading of the corresponding level
* **Ctrl-Shift-Backslash** to make the current textblock a code block
* **Ctrl-Shift-8** to wrap the selection in an ordered list
* **Ctrl-Shift-9** to wrap the selection in a bullet list
* **Ctrl->** to wrap the selection in a block quote
* **Enter** to split a non-empty textblock in a list item while at
  the same time splitting the list item
* **Mod-Enter** to insert a hard break
* **Mod-_** to insert a horizontal rule
* **Backspace** to undo an input rule
* **Alt-ArrowUp** to `joinUp`
* **Alt-ArrowDown** to `joinDown`
* **Mod-BracketLeft** to `lift`
* **Escape** to `selectParentNode`

You can suppress or map these bindings by passing a `mapKeys`
argument, which maps key names (say `"Mod-B"` to either `false`, to
remove the binding, or a new key name string.
*/ function $6a2e37ef3177fc1c$export$d9ca128b11caeeaf(schema, mapKeys) {
    let keys = {}, type;
    function bind(key, cmd) {
        if (mapKeys) {
            let mapped = mapKeys[key];
            if (mapped === false) return;
            if (mapped) key = mapped;
        }
        keys[key] = cmd;
    }
    bind("Mod-z", (0, $46a6b29ccac0c6da$export$21f930c44940fd98));
    bind("Shift-Mod-z", (0, $46a6b29ccac0c6da$export$1688e416fee0a49e));
    bind("Backspace", (0, $0a03c0b225fbbfe6$export$8b5652a4bcfffc13));
    if (!$6a2e37ef3177fc1c$var$mac) bind("Mod-y", (0, $46a6b29ccac0c6da$export$1688e416fee0a49e));
    bind("Alt-ArrowUp", (0, $694358249add86fd$export$4bb15e6d4372b393));
    bind("Alt-ArrowDown", (0, $694358249add86fd$export$8dd967a262b064bb));
    bind("Mod-BracketLeft", (0, $694358249add86fd$export$590e8b2c435046d9));
    bind("Escape", (0, $694358249add86fd$export$a37f6aaa9169911d));
    if (type = schema.marks.strong) {
        bind("Mod-b", (0, $694358249add86fd$export$797ad2667b8015a8)(type));
        bind("Mod-B", (0, $694358249add86fd$export$797ad2667b8015a8)(type));
    }
    if (type = schema.marks.em) {
        bind("Mod-i", (0, $694358249add86fd$export$797ad2667b8015a8)(type));
        bind("Mod-I", (0, $694358249add86fd$export$797ad2667b8015a8)(type));
    }
    if (type = schema.marks.code) bind("Mod-`", (0, $694358249add86fd$export$797ad2667b8015a8)(type));
    if (type = schema.nodes.bullet_list) bind("Shift-Ctrl-8", (0, $5967a48720747373$export$a8aef45c6262afee)(type));
    if (type = schema.nodes.ordered_list) bind("Shift-Ctrl-9", (0, $5967a48720747373$export$a8aef45c6262afee)(type));
    if (type = schema.nodes.blockquote) bind("Ctrl->", (0, $694358249add86fd$export$6e5e3c49755affd0)(type));
    if (type = schema.nodes.hard_break) {
        let br = type, cmd = (0, $694358249add86fd$export$146a774cdef7663a)((0, $694358249add86fd$export$634b78845598ff5b), (state, dispatch)=>{
            if (dispatch) dispatch(state.tr.replaceSelectionWith(br.create()).scrollIntoView());
            return true;
        });
        bind("Mod-Enter", cmd);
        bind("Shift-Enter", cmd);
        if ($6a2e37ef3177fc1c$var$mac) bind("Ctrl-Enter", cmd);
    }
    if (type = schema.nodes.list_item) {
        bind("Enter", (0, $5967a48720747373$export$e920ee2eb756d384)(type));
        bind("Mod-[", (0, $5967a48720747373$export$e74cd5adb935a538)(type));
        bind("Mod-]", (0, $5967a48720747373$export$dd505f850a3798a4)(type));
    }
    if (type = schema.nodes.paragraph) bind("Shift-Ctrl-0", (0, $694358249add86fd$export$36987f561c736aad)(type));
    if (type = schema.nodes.code_block) bind("Shift-Ctrl-\\", (0, $694358249add86fd$export$36987f561c736aad)(type));
    if (type = schema.nodes.heading) for(let i = 1; i <= 6; i++)bind("Shift-Ctrl-" + i, (0, $694358249add86fd$export$36987f561c736aad)(type, {
        level: i
    }));
    if (type = schema.nodes.horizontal_rule) {
        let hr = type;
        bind("Mod-_", (state, dispatch)=>{
            if (dispatch) dispatch(state.tr.replaceSelectionWith(hr.create()).scrollIntoView());
            return true;
        });
    }
    return keys;
}
/**
Given a blockquote node type, returns an input rule that turns `"> "`
at the start of a textblock into a blockquote.
*/ function $6a2e37ef3177fc1c$var$blockQuoteRule(nodeType) {
    return (0, $0a03c0b225fbbfe6$export$f7316d89abe4e1c1)(/^\s*>\s$/, nodeType);
}
/**
Given a list node type, returns an input rule that turns a number
followed by a dot at the start of a textblock into an ordered list.
*/ function $6a2e37ef3177fc1c$var$orderedListRule(nodeType) {
    return (0, $0a03c0b225fbbfe6$export$f7316d89abe4e1c1)(/^(\d+)\.\s$/, nodeType, (match)=>({
            order: +match[1]
        }), (match, node)=>node.childCount + node.attrs.order == +match[1]);
}
/**
Given a list node type, returns an input rule that turns a bullet
(dash, plush, or asterisk) at the start of a textblock into a
bullet list.
*/ function $6a2e37ef3177fc1c$var$bulletListRule(nodeType) {
    return (0, $0a03c0b225fbbfe6$export$f7316d89abe4e1c1)(/^\s*([-+*])\s$/, nodeType);
}
/**
Given a code block node type, returns an input rule that turns a
textblock starting with three backticks into a code block.
*/ function $6a2e37ef3177fc1c$var$codeBlockRule(nodeType) {
    return (0, $0a03c0b225fbbfe6$export$cc081314d3f6ffb0)(/^```$/, nodeType);
}
/**
Given a node type and a maximum level, creates an input rule that
turns up to that number of `#` characters followed by a space at
the start of a textblock into a heading whose level corresponds to
the number of `#` signs.
*/ function $6a2e37ef3177fc1c$var$headingRule(nodeType, maxLevel) {
    return (0, $0a03c0b225fbbfe6$export$cc081314d3f6ffb0)(new RegExp("^(#{1," + maxLevel + "})\\s$"), nodeType, (match)=>({
            level: match[1].length
        }));
}
/**
A set of input rules for creating the basic block quotes, lists,
code blocks, and heading.
*/ function $6a2e37ef3177fc1c$export$85d07b429441b866(schema) {
    let rules = (0, $0a03c0b225fbbfe6$export$896039c3677cf296).concat((0, $0a03c0b225fbbfe6$export$a5b94313d6908893), (0, $0a03c0b225fbbfe6$export$d52f6fa9078fe05f)), type;
    if (type = schema.nodes.blockquote) rules.push($6a2e37ef3177fc1c$var$blockQuoteRule(type));
    if (type = schema.nodes.ordered_list) rules.push($6a2e37ef3177fc1c$var$orderedListRule(type));
    if (type = schema.nodes.bullet_list) rules.push($6a2e37ef3177fc1c$var$bulletListRule(type));
    if (type = schema.nodes.code_block) rules.push($6a2e37ef3177fc1c$var$codeBlockRule(type));
    if (type = schema.nodes.heading) rules.push($6a2e37ef3177fc1c$var$headingRule(type, 6));
    return (0, $0a03c0b225fbbfe6$export$9bc12e8cb1b5422f)({
        rules: rules
    });
}
/**
Create an array of plugins pre-configured for the given schema.
The resulting array will include the following plugins:

 * Input rules for smart quotes and creating the block types in the
   schema using markdown conventions (say `"> "` to create a
   blockquote)

 * A keymap that defines keys to create and manipulate the nodes in the
   schema

 * A keymap binding the default keys provided by the
   prosemirror-commands module

 * The undo history plugin

 * The drop cursor plugin

 * The gap cursor plugin

 * A custom plugin that adds a `menuContent` prop for the
   prosemirror-menu wrapper, and a CSS class that enables the
   additional styling defined in `style/style.css` in this package

Probably only useful for quickly setting up a passable
editor—you'll need more control over your settings in most
real-world situations.
*/ function $6a2e37ef3177fc1c$export$a24aa9c6e8fd0231(options) {
    let plugins = [
        $6a2e37ef3177fc1c$export$85d07b429441b866(options.schema),
        (0, $fcb9d6c1d1df53fa$export$5043418e2ef368d5)($6a2e37ef3177fc1c$export$d9ca128b11caeeaf(options.schema, options.mapKeys)),
        (0, $fcb9d6c1d1df53fa$export$5043418e2ef368d5)((0, $694358249add86fd$export$4a0c2b85b1f0a889)),
        (0, $c77f69376cda89fa$export$b8e3092a3bfa2062)(),
        (0, $02605aeab5deccff$export$54f46a1492d5247)()
    ];
    if (options.menuBar !== false) plugins.push((0, $9a720f6ac7563389$export$4bada28d90893e2d)({
        floating: options.floatingMenu !== false,
        content: options.menuContent || $6a2e37ef3177fc1c$export$630b7735451169d5(options.schema).fullMenu
    }));
    if (options.history !== false) plugins.push((0, $46a6b29ccac0c6da$export$55abd4691b317664)());
    return plugins.concat(new (0, $ee27db283572d394$export$901cf72dabf2112a)({
        props: {
            attributes: {
                class: "ProseMirror-example-setup-style"
            }
        }
    }));
}




/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ var $f3fc7ba5cdc8c344$var$t;
const $f3fc7ba5cdc8c344$var$i = window, $f3fc7ba5cdc8c344$var$s = $f3fc7ba5cdc8c344$var$i.trustedTypes, $f3fc7ba5cdc8c344$var$e = $f3fc7ba5cdc8c344$var$s ? $f3fc7ba5cdc8c344$var$s.createPolicy("lit-html", {
    createHTML: (t)=>t
}) : void 0, $f3fc7ba5cdc8c344$var$o = `lit$${(Math.random() + "").slice(9)}$`, $f3fc7ba5cdc8c344$var$n = "?" + $f3fc7ba5cdc8c344$var$o, $f3fc7ba5cdc8c344$var$l = `<${$f3fc7ba5cdc8c344$var$n}>`, $f3fc7ba5cdc8c344$var$h = document, $f3fc7ba5cdc8c344$var$r = (t = "")=>$f3fc7ba5cdc8c344$var$h.createComment(t), $f3fc7ba5cdc8c344$var$d = (t)=>null === t || "object" != typeof t && "function" != typeof t, $f3fc7ba5cdc8c344$var$u = Array.isArray, $f3fc7ba5cdc8c344$var$c = (t)=>$f3fc7ba5cdc8c344$var$u(t) || "function" == typeof (null == t ? void 0 : t[Symbol.iterator]), $f3fc7ba5cdc8c344$var$v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, $f3fc7ba5cdc8c344$var$a = /-->/g, $f3fc7ba5cdc8c344$var$f = />/g, $f3fc7ba5cdc8c344$var$_ = RegExp(">|[    \n\f\r](?:([^\\s\"'>=/]+)([     \n\f\r]*=[  \n\f\r]*(?:[^   \n\f\r\"'`<>=]|(\"|')|))|$)", "g"), $f3fc7ba5cdc8c344$var$m = /'/g, $f3fc7ba5cdc8c344$var$p = /"/g, $f3fc7ba5cdc8c344$var$$ = /^(?:script|style|textarea|title)$/i, $f3fc7ba5cdc8c344$var$g = (t)=>(i, ...s)=>({
            _$litType$: t,
            strings: i,
            values: s
        }), $f3fc7ba5cdc8c344$export$c0bb0b647f701bb5 = $f3fc7ba5cdc8c344$var$g(1), $f3fc7ba5cdc8c344$export$7ed1367e7fa1ad68 = $f3fc7ba5cdc8c344$var$g(2), $f3fc7ba5cdc8c344$export$9c068ae9cc5db4e8 = Symbol.for("lit-noChange"), $f3fc7ba5cdc8c344$export$45b790e32b2810ee = Symbol.for("lit-nothing"), $f3fc7ba5cdc8c344$var$T = new WeakMap, $f3fc7ba5cdc8c344$var$A = $f3fc7ba5cdc8c344$var$h.createTreeWalker($f3fc7ba5cdc8c344$var$h, 129, null, !1), $f3fc7ba5cdc8c344$var$E = (t, i)=>{
    const s = t.length - 1, n = [];
    let h, r = 2 === i ? "<svg>" : "", d = $f3fc7ba5cdc8c344$var$v;
    for(let i1 = 0; i1 < s; i1++){
        const s1 = t[i1];
        let e1, u, c = -1, g = 0;
        for(; g < s1.length && (d.lastIndex = g, u = d.exec(s1), null !== u);)g = d.lastIndex, d === $f3fc7ba5cdc8c344$var$v ? "!--" === u[1] ? d = $f3fc7ba5cdc8c344$var$a : void 0 !== u[1] ? d = $f3fc7ba5cdc8c344$var$f : void 0 !== u[2] ? ($f3fc7ba5cdc8c344$var$$.test(u[2]) && (h = RegExp("</" + u[2], "g")), d = $f3fc7ba5cdc8c344$var$_) : void 0 !== u[3] && (d = $f3fc7ba5cdc8c344$var$_) : d === $f3fc7ba5cdc8c344$var$_ ? ">" === u[0] ? (d = null != h ? h : $f3fc7ba5cdc8c344$var$v, c = -1) : void 0 === u[1] ? c = -2 : (c = d.lastIndex - u[2].length, e1 = u[1], d = void 0 === u[3] ? $f3fc7ba5cdc8c344$var$_ : '"' === u[3] ? $f3fc7ba5cdc8c344$var$p : $f3fc7ba5cdc8c344$var$m) : d === $f3fc7ba5cdc8c344$var$p || d === $f3fc7ba5cdc8c344$var$m ? d = $f3fc7ba5cdc8c344$var$_ : d === $f3fc7ba5cdc8c344$var$a || d === $f3fc7ba5cdc8c344$var$f ? d = $f3fc7ba5cdc8c344$var$v : (d = $f3fc7ba5cdc8c344$var$_, h = void 0);
        const y = d === $f3fc7ba5cdc8c344$var$_ && t[i1 + 1].startsWith("/>") ? " " : "";
        r += d === $f3fc7ba5cdc8c344$var$v ? s1 + $f3fc7ba5cdc8c344$var$l : c >= 0 ? (n.push(e1), s1.slice(0, c) + "$lit$" + s1.slice(c) + $f3fc7ba5cdc8c344$var$o + y) : s1 + $f3fc7ba5cdc8c344$var$o + (-2 === c ? (n.push(void 0), i1) : y);
    }
    const u1 = r + (t[s] || "<?>") + (2 === i ? "</svg>" : "");
    if (!Array.isArray(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return [
        void 0 !== $f3fc7ba5cdc8c344$var$e ? $f3fc7ba5cdc8c344$var$e.createHTML(u1) : u1,
        n
    ];
};
class $f3fc7ba5cdc8c344$var$C {
    constructor({ strings: t , _$litType$: i  }, e){
        let l;
        this.parts = [];
        let h = 0, d = 0;
        const u = t.length - 1, c = this.parts, [v, a] = $f3fc7ba5cdc8c344$var$E(t, i);
        if (this.el = $f3fc7ba5cdc8c344$var$C.createElement(v, e), $f3fc7ba5cdc8c344$var$A.currentNode = this.el.content, 2 === i) {
            const t1 = this.el.content, i1 = t1.firstChild;
            i1.remove(), t1.append(...i1.childNodes);
        }
        for(; null !== (l = $f3fc7ba5cdc8c344$var$A.nextNode()) && c.length < u;){
            if (1 === l.nodeType) {
                if (l.hasAttributes()) {
                    const t2 = [];
                    for (const i2 of l.getAttributeNames())if (i2.endsWith("$lit$") || i2.startsWith($f3fc7ba5cdc8c344$var$o)) {
                        const s1 = a[d++];
                        if (t2.push(i2), void 0 !== s1) {
                            const t3 = l.getAttribute(s1.toLowerCase() + "$lit$").split($f3fc7ba5cdc8c344$var$o), i3 = /([.?@])?(.*)/.exec(s1);
                            c.push({
                                type: 1,
                                index: h,
                                name: i3[2],
                                strings: t3,
                                ctor: "." === i3[1] ? $f3fc7ba5cdc8c344$var$M : "?" === i3[1] ? $f3fc7ba5cdc8c344$var$k : "@" === i3[1] ? $f3fc7ba5cdc8c344$var$H : $f3fc7ba5cdc8c344$var$S
                            });
                        } else c.push({
                            type: 6,
                            index: h
                        });
                    }
                    for (const i4 of t2)l.removeAttribute(i4);
                }
                if ($f3fc7ba5cdc8c344$var$$.test(l.tagName)) {
                    const t4 = l.textContent.split($f3fc7ba5cdc8c344$var$o), i5 = t4.length - 1;
                    if (i5 > 0) {
                        l.textContent = $f3fc7ba5cdc8c344$var$s ? $f3fc7ba5cdc8c344$var$s.emptyScript : "";
                        for(let s2 = 0; s2 < i5; s2++)l.append(t4[s2], $f3fc7ba5cdc8c344$var$r()), $f3fc7ba5cdc8c344$var$A.nextNode(), c.push({
                            type: 2,
                            index: ++h
                        });
                        l.append(t4[i5], $f3fc7ba5cdc8c344$var$r());
                    }
                }
            } else if (8 === l.nodeType) {
                if (l.data === $f3fc7ba5cdc8c344$var$n) c.push({
                    type: 2,
                    index: h
                });
                else {
                    let t5 = -1;
                    for(; -1 !== (t5 = l.data.indexOf($f3fc7ba5cdc8c344$var$o, t5 + 1));)c.push({
                        type: 7,
                        index: h
                    }), t5 += $f3fc7ba5cdc8c344$var$o.length - 1;
                }
            }
            h++;
        }
    }
    static createElement(t, i) {
        const s = $f3fc7ba5cdc8c344$var$h.createElement("template");
        return s.innerHTML = t, s;
    }
}
function $f3fc7ba5cdc8c344$var$P(t, i, s = t, e) {
    var o, n, l, h;
    if (i === $f3fc7ba5cdc8c344$export$9c068ae9cc5db4e8) return i;
    let r = void 0 !== e ? null === (o = s._$Co) || void 0 === o ? void 0 : o[e] : s._$Cl;
    const u = $f3fc7ba5cdc8c344$var$d(i) ? void 0 : i._$litDirective$;
    return (null == r ? void 0 : r.constructor) !== u && (null === (n = null == r ? void 0 : r._$AO) || void 0 === n || n.call(r, !1), void 0 === u ? r = void 0 : (r = new u(t), r._$AT(t, s, e)), void 0 !== e ? (null !== (l = (h = s)._$Co) && void 0 !== l ? l : h._$Co = [])[e] = r : s._$Cl = r), void 0 !== r && (i = $f3fc7ba5cdc8c344$var$P(t, r._$AS(t, i.values), r, e)), i;
}
class $f3fc7ba5cdc8c344$var$V {
    constructor(t, i){
        this.u = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
    }
    get parentNode() {
        return this._$AM.parentNode;
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    v(t) {
        var i;
        const { el: { content: s  } , parts: e  } = this._$AD, o = (null !== (i = null == t ? void 0 : t.creationScope) && void 0 !== i ? i : $f3fc7ba5cdc8c344$var$h).importNode(s, !0);
        $f3fc7ba5cdc8c344$var$A.currentNode = o;
        let n = $f3fc7ba5cdc8c344$var$A.nextNode(), l = 0, r = 0, d = e[0];
        for(; void 0 !== d;){
            if (l === d.index) {
                let i1;
                2 === d.type ? i1 = new $f3fc7ba5cdc8c344$var$N(n, n.nextSibling, this, t) : 1 === d.type ? i1 = new d.ctor(n, d.name, d.strings, this, t) : 6 === d.type && (i1 = new $f3fc7ba5cdc8c344$var$I(n, this, t)), this.u.push(i1), d = e[++r];
            }
            l !== (null == d ? void 0 : d.index) && (n = $f3fc7ba5cdc8c344$var$A.nextNode(), l++);
        }
        return o;
    }
    p(t) {
        let i = 0;
        for (const s of this.u)void 0 !== s && (void 0 !== s.strings ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
    }
}
class $f3fc7ba5cdc8c344$var$N {
    constructor(t, i, s, e){
        var o;
        this.type = 2, this._$AH = $f3fc7ba5cdc8c344$export$45b790e32b2810ee, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = e, this._$Cm = null === (o = null == e ? void 0 : e.isConnected) || void 0 === o || o;
    }
    get _$AU() {
        var t, i;
        return null !== (i = null === (t = this._$AM) || void 0 === t ? void 0 : t._$AU) && void 0 !== i ? i : this._$Cm;
    }
    get parentNode() {
        let t = this._$AA.parentNode;
        const i = this._$AM;
        return void 0 !== i && 11 === t.nodeType && (t = i.parentNode), t;
    }
    get startNode() {
        return this._$AA;
    }
    get endNode() {
        return this._$AB;
    }
    _$AI(t, i = this) {
        t = $f3fc7ba5cdc8c344$var$P(this, t, i), $f3fc7ba5cdc8c344$var$d(t) ? t === $f3fc7ba5cdc8c344$export$45b790e32b2810ee || null == t || "" === t ? (this._$AH !== $f3fc7ba5cdc8c344$export$45b790e32b2810ee && this._$AR(), this._$AH = $f3fc7ba5cdc8c344$export$45b790e32b2810ee) : t !== this._$AH && t !== $f3fc7ba5cdc8c344$export$9c068ae9cc5db4e8 && this.g(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : $f3fc7ba5cdc8c344$var$c(t) ? this.k(t) : this.g(t);
    }
    O(t, i = this._$AB) {
        return this._$AA.parentNode.insertBefore(t, i);
    }
    T(t) {
        this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
    }
    g(t) {
        this._$AH !== $f3fc7ba5cdc8c344$export$45b790e32b2810ee && $f3fc7ba5cdc8c344$var$d(this._$AH) ? this._$AA.nextSibling.data = t : this.T($f3fc7ba5cdc8c344$var$h.createTextNode(t)), this._$AH = t;
    }
    $(t) {
        var i;
        const { values: s , _$litType$: e  } = t, o = "number" == typeof e ? this._$AC(t) : (void 0 === e.el && (e.el = $f3fc7ba5cdc8c344$var$C.createElement(e.h, this.options)), e);
        if ((null === (i = this._$AH) || void 0 === i ? void 0 : i._$AD) === o) this._$AH.p(s);
        else {
            const t1 = new $f3fc7ba5cdc8c344$var$V(o, this), i1 = t1.v(this.options);
            t1.p(s), this.T(i1), this._$AH = t1;
        }
    }
    _$AC(t) {
        let i = $f3fc7ba5cdc8c344$var$T.get(t.strings);
        return void 0 === i && $f3fc7ba5cdc8c344$var$T.set(t.strings, i = new $f3fc7ba5cdc8c344$var$C(t)), i;
    }
    k(t) {
        $f3fc7ba5cdc8c344$var$u(this._$AH) || (this._$AH = [], this._$AR());
        const i = this._$AH;
        let s, e = 0;
        for (const o of t)e === i.length ? i.push(s = new $f3fc7ba5cdc8c344$var$N(this.O($f3fc7ba5cdc8c344$var$r()), this.O($f3fc7ba5cdc8c344$var$r()), this, this.options)) : s = i[e], s._$AI(o), e++;
        e < i.length && (this._$AR(s && s._$AB.nextSibling, e), i.length = e);
    }
    _$AR(t = this._$AA.nextSibling, i) {
        var s;
        for(null === (s = this._$AP) || void 0 === s || s.call(this, !1, !0, i); t && t !== this._$AB;){
            const i1 = t.nextSibling;
            t.remove(), t = i1;
        }
    }
    setConnected(t) {
        var i;
        void 0 === this._$AM && (this._$Cm = t, null === (i = this._$AP) || void 0 === i || i.call(this, t));
    }
}
class $f3fc7ba5cdc8c344$var$S {
    constructor(t, i, s, e, o){
        this.type = 1, this._$AH = $f3fc7ba5cdc8c344$export$45b790e32b2810ee, this._$AN = void 0, this.element = t, this.name = i, this._$AM = e, this.options = o, s.length > 2 || "" !== s[0] || "" !== s[1] ? (this._$AH = Array(s.length - 1).fill(new String), this.strings = s) : this._$AH = $f3fc7ba5cdc8c344$export$45b790e32b2810ee;
    }
    get tagName() {
        return this.element.tagName;
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    _$AI(t, i = this, s, e) {
        const o = this.strings;
        let n = !1;
        if (void 0 === o) t = $f3fc7ba5cdc8c344$var$P(this, t, i, 0), n = !$f3fc7ba5cdc8c344$var$d(t) || t !== this._$AH && t !== $f3fc7ba5cdc8c344$export$9c068ae9cc5db4e8, n && (this._$AH = t);
        else {
            const e1 = t;
            let l, h;
            for(t = o[0], l = 0; l < o.length - 1; l++)h = $f3fc7ba5cdc8c344$var$P(this, e1[s + l], i, l), h === $f3fc7ba5cdc8c344$export$9c068ae9cc5db4e8 && (h = this._$AH[l]), n || (n = !$f3fc7ba5cdc8c344$var$d(h) || h !== this._$AH[l]), h === $f3fc7ba5cdc8c344$export$45b790e32b2810ee ? t = $f3fc7ba5cdc8c344$export$45b790e32b2810ee : t !== $f3fc7ba5cdc8c344$export$45b790e32b2810ee && (t += (null != h ? h : "") + o[l + 1]), this._$AH[l] = h;
        }
        n && !e && this.j(t);
    }
    j(t) {
        t === $f3fc7ba5cdc8c344$export$45b790e32b2810ee ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t ? t : "");
    }
}
class $f3fc7ba5cdc8c344$var$M extends $f3fc7ba5cdc8c344$var$S {
    constructor(){
        super(...arguments), this.type = 3;
    }
    j(t) {
        this.element[this.name] = t === $f3fc7ba5cdc8c344$export$45b790e32b2810ee ? void 0 : t;
    }
}
const $f3fc7ba5cdc8c344$var$R = $f3fc7ba5cdc8c344$var$s ? $f3fc7ba5cdc8c344$var$s.emptyScript : "";
class $f3fc7ba5cdc8c344$var$k extends $f3fc7ba5cdc8c344$var$S {
    constructor(){
        super(...arguments), this.type = 4;
    }
    j(t) {
        t && t !== $f3fc7ba5cdc8c344$export$45b790e32b2810ee ? this.element.setAttribute(this.name, $f3fc7ba5cdc8c344$var$R) : this.element.removeAttribute(this.name);
    }
}
class $f3fc7ba5cdc8c344$var$H extends $f3fc7ba5cdc8c344$var$S {
    constructor(t, i, s, e, o){
        super(t, i, s, e, o), this.type = 5;
    }
    _$AI(t, i = this) {
        var s;
        if ((t = null !== (s = $f3fc7ba5cdc8c344$var$P(this, t, i, 0)) && void 0 !== s ? s : $f3fc7ba5cdc8c344$export$45b790e32b2810ee) === $f3fc7ba5cdc8c344$export$9c068ae9cc5db4e8) return;
        const e = this._$AH, o = t === $f3fc7ba5cdc8c344$export$45b790e32b2810ee && e !== $f3fc7ba5cdc8c344$export$45b790e32b2810ee || t.capture !== e.capture || t.once !== e.once || t.passive !== e.passive, n = t !== $f3fc7ba5cdc8c344$export$45b790e32b2810ee && (e === $f3fc7ba5cdc8c344$export$45b790e32b2810ee || o);
        o && this.element.removeEventListener(this.name, this, e), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
    }
    handleEvent(t) {
        var i, s;
        "function" == typeof this._$AH ? this._$AH.call(null !== (s = null === (i = this.options) || void 0 === i ? void 0 : i.host) && void 0 !== s ? s : this.element, t) : this._$AH.handleEvent(t);
    }
}
class $f3fc7ba5cdc8c344$var$I {
    constructor(t, i, s){
        this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    _$AI(t) {
        $f3fc7ba5cdc8c344$var$P(this, t);
    }
}
const $f3fc7ba5cdc8c344$export$8613d1ca9052b22e = {
    P: "$lit$",
    A: $f3fc7ba5cdc8c344$var$o,
    M: $f3fc7ba5cdc8c344$var$n,
    C: 1,
    L: $f3fc7ba5cdc8c344$var$E,
    R: $f3fc7ba5cdc8c344$var$V,
    D: $f3fc7ba5cdc8c344$var$c,
    V: $f3fc7ba5cdc8c344$var$P,
    I: $f3fc7ba5cdc8c344$var$N,
    H: $f3fc7ba5cdc8c344$var$S,
    N: $f3fc7ba5cdc8c344$var$k,
    U: $f3fc7ba5cdc8c344$var$H,
    B: $f3fc7ba5cdc8c344$var$M,
    F: $f3fc7ba5cdc8c344$var$I
}, $f3fc7ba5cdc8c344$var$z = $f3fc7ba5cdc8c344$var$i.litHtmlPolyfillSupport;
null == $f3fc7ba5cdc8c344$var$z || $f3fc7ba5cdc8c344$var$z($f3fc7ba5cdc8c344$var$C, $f3fc7ba5cdc8c344$var$N), (null !== ($f3fc7ba5cdc8c344$var$t = $f3fc7ba5cdc8c344$var$i.litHtmlVersions) && void 0 !== $f3fc7ba5cdc8c344$var$t ? $f3fc7ba5cdc8c344$var$t : $f3fc7ba5cdc8c344$var$i.litHtmlVersions = []).push("2.6.1");
const $f3fc7ba5cdc8c344$export$b3890eb0ae9dca99 = (t, i, s)=>{
    var e, o;
    const n = null !== (e = null == s ? void 0 : s.renderBefore) && void 0 !== e ? e : i;
    let l = n._$litPart$;
    if (void 0 === l) {
        const t1 = null !== (o = null == s ? void 0 : s.renderBefore) && void 0 !== o ? o : null;
        n._$litPart$ = l = new $f3fc7ba5cdc8c344$var$N(i.insertBefore($f3fc7ba5cdc8c344$var$r(), t1), t1, void 0, null != s ? s : {});
    }
    return l._$AI(t), l;
};


class $14be8273a324f1ff$var$MarkdownView {
    constructor(target, content){
        this.textarea = target.appendChild(document.createElement("textarea"));
        this.textarea.value = content;
    }
    get content() {
        return this.textarea.value;
    }
    focus() {
        this.textarea.focus();
    }
    destroy() {
        this.textarea.remove();
    }
}
class $14be8273a324f1ff$var$ProseMirrorView {
    constructor(target, content){
        this.view = new (0, $4fda26bcd679fbcb$export$eece2fccabbb77c5)(target, {
            state: (0, $ee27db283572d394$export$afa855cbfaff27f2).create({
                doc: (0, $a7e510c892593f83$export$7517583227ad0cb8).parse(content),
                plugins: (0, $6a2e37ef3177fc1c$export$a24aa9c6e8fd0231)({
                    schema: $a7e510c892593f83$export$4902baddc787debb
                })
            })
        });
    }
    get content() {
        return (0, $a7e510c892593f83$export$f996452ca6e9a0ae).serialize(this.view.state.doc);
    }
    focus() {
        this.view.focus();
    }
    destroy() {
        this.view.destroy();
    }
}
class $14be8273a324f1ff$export$aee3bc6f4a4ea9ee extends (0, $feOm8$SargassoComponent) {
    constructor(elem, options = {}){
        options.shadowDOM = false;
        super(elem, options);
        this.value = this.element.textContent;
        this.element.textContent = "";
        this.renderAttributes = [
            "name",
            "validate"
        ];
        Object.defineProperty(this.element, "value", {
            get: ()=>{
                return this.value;
            },
            set: (v)=>{
                this.value = v;
            }
        });
    }
    start() {
        super.start();
        this.on("input blur focus keyup paste click", "[contenteditable]", (e)=>{
            this.value = this.view.content;
            this.content.dispatchEvent(new Event("change"));
        });
        this.on("input blur focus keyup paste", "textarea", (e)=>{
            this.value = this.view.content;
            this.content.dispatchEvent(new Event("change"));
        });
        this.on("change", "input[type=radio]", (e, elem)=>{
            const button = e.srcElement;
            if (!button.checked) return;
            const View = button.value === "markdown" ? $14be8273a324f1ff$var$MarkdownView : $14be8273a324f1ff$var$ProseMirrorView;
            if (this.view instanceof View) return;
            const content = this.view.content;
            this.view.destroy();
            this.view = new View(this.target, content);
            this.view.focus();
        });
    }
    didRender() {
        this.target = this.element.querySelector(".current-editor");
        this.content = this.element.querySelector(".content");
        this.view = new $14be8273a324f1ff$var$ProseMirrorView(this.target, this.value);
    }
    buildTemplate() {
        const template = (args, attributes, options)=>(0, $f3fc7ba5cdc8c344$export$c0bb0b647f701bb5)`
            <textarea class="content" style="display:none" name="${attributes.name}" data-validate="${attributes.validate}" data-payload>${this.value}</textarea>
            <div class="current-editor"></div>
            <div class="view-mode pull-right">
              <label>Markdown <input type=radio name=inputformat value=markdown></label> | 
              <label><input type=radio name=inputformat value=prosemirror checked> WYSIWYG</label>
            </div>
        `;
        return template;
    }
    sleep() {
        this.view.destroy();
        super.sleep();
    }
}
(0, $feOm8$utils).registerSargassoClass("markdownEditor", $14be8273a324f1ff$export$aee3bc6f4a4ea9ee);


export {$14be8273a324f1ff$export$aee3bc6f4a4ea9ee as markdownEditor};
//# sourceMappingURL=MarkdownEditor.mjs.map

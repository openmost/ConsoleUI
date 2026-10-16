(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("CoreHome"), require("vue"), require("CorePluginsAdmin"));
	else if(typeof define === 'function' && define.amd)
		define(["CoreHome", , "CorePluginsAdmin"], factory);
	else if(typeof exports === 'object')
		exports["ConsoleUI"] = factory(require("CoreHome"), require("vue"), require("CorePluginsAdmin"));
	else
		root["ConsoleUI"] = factory(root["CoreHome"], root["Vue"], root["CorePluginsAdmin"]);
})((typeof self !== 'undefined' ? self : this), function(__WEBPACK_EXTERNAL_MODULE__19dc__, __WEBPACK_EXTERNAL_MODULE__8bbf__, __WEBPACK_EXTERNAL_MODULE_a5a2__) {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "plugins/ConsoleUI/vue/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fae3");
/******/ })
/************************************************************************/
/******/ ({

/***/ "19dc":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__19dc__;

/***/ }),

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__8bbf__;

/***/ }),

/***/ "a5a2":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_a5a2__;

/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "ConsolePage", function() { return /* reexport */ ConsolePage; });

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (false) { var getCurrentScript; }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: external {"commonjs":"vue","commonjs2":"vue","root":"Vue"}
var external_commonjs_vue_commonjs2_vue_root_Vue_ = __webpack_require__("8bbf");

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/ConsoleUI/vue/src/ConsolePage/ConsolePage.vue?vue&type=template&id=5e1d6324

const _hoisted_1 = {
  key: 1,
  class: "consoleUi"
};
const _hoisted_2 = {
  class: "consoleUiTerminal"
};
const _hoisted_3 = {
  class: "consoleUiTerminal__bar"
};
const _hoisted_4 = {
  class: "consoleUiTerminal__title"
};
const _hoisted_5 = {
  class: "consoleUiTerminal__actions"
};
const _hoisted_6 = ["disabled"];
const _hoisted_7 = ["disabled"];
const _hoisted_8 = ["aria-label"];
const _hoisted_9 = {
  key: 0,
  class: "consoleUiTerminal__empty"
};
const _hoisted_10 = {
  class: "consoleUiRun__command"
};
const _hoisted_11 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "consoleUiPrompt"
}, "$", -1);
const _hoisted_12 = {
  key: 0,
  class: "consoleUiRun__output"
};
const _hoisted_13 = {
  key: 1,
  class: "consoleUiRun__notice"
};
const _hoisted_14 = {
  key: 2,
  class: "consoleUiRun__error"
};
const _hoisted_15 = {
  key: 3,
  class: "consoleUiRun__running"
};
const _hoisted_16 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "consoleUiCursor"
}, null, -1);
const _hoisted_17 = [_hoisted_16];
const _hoisted_18 = ["for"];
const _hoisted_19 = {
  class: "consoleUiTerminal__field"
};
const _hoisted_20 = ["id", "aria-label"];
const _hoisted_21 = ["id", "aria-selected", "onMousedown", "onMouseenter", "onFocus"];
const _hoisted_22 = {
  class: "consoleUiSuggestions__value"
};
const _hoisted_23 = {
  class: "consoleUiSuggestions__description"
};
const _hoisted_24 = ["id", "aria-label", "aria-expanded", "aria-controls", "aria-activedescendant", "placeholder"];
const _hoisted_25 = ["disabled"];
const _hoisted_26 = ["disabled"];
const _hoisted_27 = {
  class: "consoleUiHints"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ContentBlock = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("ContentBlock");
  const _component_CommandLibrary = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("CommandLibrary");
  return !_ctx.enabled ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(_component_ContentBlock, {
    key: 0,
    "content-title": _ctx.translate('ConsoleUI_Console')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('ConsoleUI_Disabled')), 1)]),
    _: 1
  }, 8, ["content-title"])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_2, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_3, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_4, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('ConsoleUI_OutputLabel')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_5, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", {
    type: "button",
    class: "consoleUiTerminal__action",
    disabled: !_ctx.runs.length,
    onClick: _cache[0] || (_cache[0] = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])((...args) => _ctx.copyOutput && _ctx.copyOutput(...args), ["stop"]))
  }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('ConsoleUI_Copy')), 9, _hoisted_6), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", {
    type: "button",
    class: "consoleUiTerminal__action",
    disabled: !_ctx.runs.length || _ctx.isRunning,
    onClick: _cache[1] || (_cache[1] = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])((...args) => _ctx.clearOutput && _ctx.clearOutput(...args), ["stop"]))
  }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('ConsoleUI_Clear')), 9, _hoisted_7)])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
    ref: "output",
    class: "consoleUiTerminal__output",
    role: "log",
    "aria-live": "polite",
    "aria-label": _ctx.translate('ConsoleUI_OutputLabel'),
    tabindex: "0",
    onScroll: _cache[3] || (_cache[3] = (...args) => _ctx.onOutputScroll && _ctx.onOutputScroll(...args))
  }, [!_ctx.runs.length ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", _hoisted_9, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('ConsoleUI_OutputEmpty')), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.runs, run => {
    return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
      key: run.id,
      class: "consoleUiRun"
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_10, [_hoisted_11, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" ./console " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(run.command), 1)]), run.segments.length ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("pre", _hoisted_12, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(run.segments, (segment, index) => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
        key: index,
        class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(_ctx.segmentClasses(segment))
      }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(segment.text), 3);
    }), 128))])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), run.truncated ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_13, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('ConsoleUI_OutputTruncated')), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), run.error ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_14, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(run.error) + " ", 1), run.reload ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("button", {
      key: 0,
      type: "button",
      class: "consoleUiRun__reload",
      onClick: _cache[2] || (_cache[2] = (...args) => _ctx.reloadPage && _ctx.reloadPage(...args))
    }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('ConsoleUI_ReloadPage')), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), run.status === 'running' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_15, _hoisted_17)) : run.exitCode !== null ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
      key: 4,
      class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(['consoleUiRun__status', run.exitCode === 0 ? 'is-success' : 'is-failure'])
    }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.statusLine(run)), 3)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]);
  }), 128))], 40, _hoisted_8), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
    class: "consoleUiTerminal__input",
    onSubmit: _cache[10] || (_cache[10] = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])((...args) => _ctx.submit && _ctx.submit(...args), ["prevent"]))
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("label", {
    for: _ctx.inputId,
    class: "consoleUiPrompt"
  }, "$ ./console", 8, _hoisted_18), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_19, [_ctx.showSuggestions ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("ul", {
    key: 0,
    id: _ctx.listboxId,
    class: "consoleUiSuggestions",
    role: "listbox",
    "aria-label": _ctx.translate('ConsoleUI_Suggestions')
  }, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.suggestions, (suggestion, index) => {
    return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("li", {
      id: `${_ctx.listboxId}-${index}`,
      key: suggestion.value,
      role: "option",
      "aria-selected": index === _ctx.activeSuggestion ? 'true' : 'false',
      class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(['consoleUiSuggestions__item', {
        'is-active': index === _ctx.activeSuggestion
      }]),
      tabindex: "-1",
      onMousedown: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])($event => _ctx.acceptSuggestion(suggestion), ["prevent"]),
      onMouseenter: $event => _ctx.activeSuggestion = index,
      onFocus: $event => _ctx.activeSuggestion = index
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_22, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(suggestion.value), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_23, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(suggestion.description), 1)], 42, _hoisted_21);
  }), 128))], 8, _hoisted_20)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    id: _ctx.inputId,
    ref: "input",
    "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => _ctx.line = $event),
    type: "text",
    class: "consoleUiTerminal__text browser-default",
    autocomplete: "off",
    autocapitalize: "off",
    spellcheck: "false",
    role: "combobox",
    "aria-autocomplete": "list",
    "aria-label": _ctx.translate('ConsoleUI_InputLabel'),
    "aria-expanded": _ctx.showSuggestions ? 'true' : 'false',
    "aria-controls": _ctx.listboxId,
    "aria-activedescendant": _ctx.activeDescendant,
    placeholder: _ctx.translate('ConsoleUI_InputPlaceholder'),
    onKeydown: _cache[5] || (_cache[5] = (...args) => _ctx.onKeydown && _ctx.onKeydown(...args)),
    onInput: _cache[6] || (_cache[6] = (...args) => _ctx.refreshSuggestions && _ctx.refreshSuggestions(...args)),
    onClick: _cache[7] || (_cache[7] = (...args) => _ctx.refreshSuggestions && _ctx.refreshSuggestions(...args)),
    onBlur: _cache[8] || (_cache[8] = $event => _ctx.suggestions = [])
  }, null, 40, _hoisted_24), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vModelText"], _ctx.line]])]), _ctx.isRunning ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("button", {
    key: 0,
    type: "button",
    class: "consoleUiTerminal__run consoleUiTerminal__run--stop",
    disabled: _ctx.isStopping,
    onClick: _cache[9] || (_cache[9] = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])((...args) => _ctx.stopRun && _ctx.stopRun(...args), ["stop"]))
  }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.isStopping ? _ctx.translate('ConsoleUI_Stopping') : _ctx.translate('ConsoleUI_Stop')), 9, _hoisted_25)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("button", {
    key: 1,
    type: "submit",
    class: "consoleUiTerminal__run",
    disabled: !_ctx.line.trim()
  }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('ConsoleUI_Run')), 9, _hoisted_26))], 32)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", _hoisted_27, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('ConsoleUI_KeyboardHints')) + " " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('ConsoleUI_SecurityNotice')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_CommandLibrary, {
    catalog: _ctx.catalog,
    onUse: _ctx.useCommand
  }, null, 8, ["catalog", "onUse"])]));
}
// CONCATENATED MODULE: ./plugins/ConsoleUI/vue/src/ConsolePage/ConsolePage.vue?vue&type=template&id=5e1d6324

// EXTERNAL MODULE: external "CoreHome"
var external_CoreHome_ = __webpack_require__("19dc");

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/ConsoleUI/vue/src/ConsolePage/CommandLibrary.vue?vue&type=template&id=2b426968

const CommandLibraryvue_type_template_id_2b426968_hoisted_1 = {
  class: "consoleUiLibrary__toolbar"
};
const CommandLibraryvue_type_template_id_2b426968_hoisted_2 = {
  class: "consoleUiLibrary__count"
};
const CommandLibraryvue_type_template_id_2b426968_hoisted_3 = {
  key: 0,
  class: "consoleUiLibrary__empty"
};
const CommandLibraryvue_type_template_id_2b426968_hoisted_4 = {
  key: 1,
  class: "consoleUiLibrary__layout"
};
const CommandLibraryvue_type_template_id_2b426968_hoisted_5 = ["aria-label"];
const CommandLibraryvue_type_template_id_2b426968_hoisted_6 = {
  key: 0,
  class: "consoleUiLibrary__namespace"
};
const CommandLibraryvue_type_template_id_2b426968_hoisted_7 = ["aria-pressed", "onClick", "onDblclick"];
const CommandLibraryvue_type_template_id_2b426968_hoisted_8 = {
  class: "consoleUiLibrary__name"
};
const CommandLibraryvue_type_template_id_2b426968_hoisted_9 = {
  class: "consoleUiLibrary__description"
};
const CommandLibraryvue_type_template_id_2b426968_hoisted_10 = {
  key: 0,
  class: "consoleUiLibrary__detail",
  "aria-live": "polite"
};
const CommandLibraryvue_type_template_id_2b426968_hoisted_11 = {
  class: "consoleUiLibrary__header"
};
const CommandLibraryvue_type_template_id_2b426968_hoisted_12 = {
  class: "consoleUiLibrary__title"
};
const CommandLibraryvue_type_template_id_2b426968_hoisted_13 = {
  class: "consoleUiLibrary__code"
};
const CommandLibraryvue_type_template_id_2b426968_hoisted_14 = {
  class: "consoleUiLibrary__definitions"
};
const CommandLibraryvue_type_template_id_2b426968_hoisted_15 = {
  class: "consoleUiLibrary__badge"
};
const CommandLibraryvue_type_template_id_2b426968_hoisted_16 = {
  class: "consoleUiLibrary__definitions"
};
const CommandLibraryvue_type_template_id_2b426968_hoisted_17 = {
  key: 0,
  class: "consoleUiLibrary__badge"
};
const CommandLibraryvue_type_template_id_2b426968_hoisted_18 = {
  key: 4,
  class: "consoleUiLibrary__global"
};
const CommandLibraryvue_type_template_id_2b426968_hoisted_19 = {
  class: "consoleUiLibrary__definitions"
};
function CommandLibraryvue_type_template_id_2b426968_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Field = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Field");
  const _component_ContentBlock = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("ContentBlock");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(_component_ContentBlock, {
    "content-title": _ctx.translate('ConsoleUI_Library'),
    class: "consoleUiLibrary"
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", CommandLibraryvue_type_template_id_2b426968_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "text",
      name: "consoleUiLibrarySearch",
      modelValue: _ctx.search,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => _ctx.search = $event),
      title: _ctx.translate('ConsoleUI_LibrarySearch'),
      "full-width": true
    }, null, 8, ["modelValue", "title"]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", CommandLibraryvue_type_template_id_2b426968_hoisted_2, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('ConsoleUI_LibraryCount', `${_ctx.filteredCommands.length}`)), 1)]), !_ctx.filteredCommands.length ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", CommandLibraryvue_type_template_id_2b426968_hoisted_3, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('ConsoleUI_LibraryEmpty')), 1)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", CommandLibraryvue_type_template_id_2b426968_hoisted_4, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
      class: "consoleUiLibrary__list",
      role: "navigation",
      "aria-label": _ctx.translate('ConsoleUI_Library')
    }, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.groups, group => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
        key: group.namespace,
        class: "consoleUiLibrary__group"
      }, [group.namespace ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("h3", CommandLibraryvue_type_template_id_2b426968_hoisted_6, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(group.namespace), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("ul", null, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(group.commands, command => {
        return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("li", {
          key: command.name
        }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", {
          type: "button",
          class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(['consoleUiLibrary__command', {
            'is-selected': command.name === _ctx.selectedName
          }]),
          "aria-pressed": command.name === _ctx.selectedName ? 'true' : 'false',
          onClick: $event => _ctx.selectedName = command.name,
          onDblclick: $event => _ctx.$emit('use', command.name)
        }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", CommandLibraryvue_type_template_id_2b426968_hoisted_8, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(command.name), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", CommandLibraryvue_type_template_id_2b426968_hoisted_9, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(command.description || _ctx.translate('ConsoleUI_NoDescription')), 1)], 42, CommandLibraryvue_type_template_id_2b426968_hoisted_7)]);
      }), 128))])]);
    }), 128))], 8, CommandLibraryvue_type_template_id_2b426968_hoisted_5), _ctx.selected ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("section", CommandLibraryvue_type_template_id_2b426968_hoisted_10, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", CommandLibraryvue_type_template_id_2b426968_hoisted_11, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", CommandLibraryvue_type_template_id_2b426968_hoisted_12, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.selected.name), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", {
      type: "button",
      class: "btn",
      onClick: _cache[1] || (_cache[1] = $event => _ctx.$emit('use', _ctx.selected.name))
    }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('ConsoleUI_InsertCommand')), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.selected.description || _ctx.translate('ConsoleUI_NoDescription')), 1), _ctx.selected.usage.length ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], {
      key: 0
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h4", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('ConsoleUI_Usage')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("pre", CommandLibraryvue_type_template_id_2b426968_hoisted_13, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.selected.usage, usage => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("code", {
        key: usage
      }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.selected.name) + " " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.stripName(usage, _ctx.selected.name)) + "\n", 1);
    }), 128))])], 64)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.selected.aliases.length ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], {
      key: 1
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h4", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('ConsoleUI_Aliases')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.selected.aliases, alias => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("code", {
        key: alias
      }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(alias), 1);
    }), 128))])], 64)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.selected.arguments.length ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], {
      key: 2
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h4", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('ConsoleUI_Arguments')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("dl", CommandLibraryvue_type_template_id_2b426968_hoisted_14, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.selected.arguments, argument => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], {
        key: argument.name
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("dt", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("code", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(argument.name), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", CommandLibraryvue_type_template_id_2b426968_hoisted_15, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate(argument.required ? 'ConsoleUI_Required' : 'ConsoleUI_Optional')), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("dd", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(argument.description || _ctx.translate('ConsoleUI_NoDescription')), 1)], 64);
    }), 128))])], 64)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.selected.options.length ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], {
      key: 3
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h4", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('ConsoleUI_Options')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("dl", CommandLibraryvue_type_template_id_2b426968_hoisted_16, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.selected.options, option => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], {
        key: option.name
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("dt", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("code", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.formatOption(option)), 1), option.valueRequired ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", CommandLibraryvue_type_template_id_2b426968_hoisted_17, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('ConsoleUI_Required')), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("dd", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(option.description || _ctx.translate('ConsoleUI_NoDescription')), 1)], 64);
    }), 128))])], 64)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.catalog.globalOptions.length ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("details", CommandLibraryvue_type_template_id_2b426968_hoisted_18, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("summary", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('ConsoleUI_GlobalOptions')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("dl", CommandLibraryvue_type_template_id_2b426968_hoisted_19, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.catalog.globalOptions, option => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], {
        key: option.name
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("dt", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("code", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.formatOption(option)), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("dd", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(option.description || _ctx.translate('ConsoleUI_NoDescription')), 1)], 64);
    }), 128))])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]))]),
    _: 1
  }, 8, ["content-title"]);
}
// CONCATENATED MODULE: ./plugins/ConsoleUI/vue/src/ConsolePage/CommandLibrary.vue?vue&type=template&id=2b426968

// EXTERNAL MODULE: external "CorePluginsAdmin"
var external_CorePluginsAdmin_ = __webpack_require__("a5a2");

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/ConsoleUI/vue/src/ConsolePage/CommandLibrary.vue?vue&type=script&lang=ts



/* harmony default export */ var CommandLibraryvue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    catalog: {
      type: Object,
      required: true
    }
  },
  components: {
    ContentBlock: external_CoreHome_["ContentBlock"],
    Field: external_CorePluginsAdmin_["Field"]
  },
  emits: ['use'],
  data() {
    return {
      search: '',
      selectedName: ''
    };
  },
  computed: {
    filteredCommands() {
      const terms = this.search.toLowerCase().split(/\s+/).filter(term => term !== '');
      return this.catalog.commands.filter(command => {
        const haystack = `${command.name} ${command.description} ${command.aliases.join(' ')}`.toLowerCase();
        return terms.every(term => haystack.includes(term));
      });
    },
    groups() {
      const groups = [];
      this.filteredCommands.forEach(command => {
        let group = groups.find(candidate => candidate.namespace === command.namespace);
        if (!group) {
          group = {
            namespace: command.namespace,
            commands: []
          };
          groups.push(group);
        }
        group.commands.push(command);
      });
      // Commands without a namespace (help, list) come first, like in `console list`
      return groups.sort((a, b) => a.namespace.localeCompare(b.namespace));
    },
    selected() {
      var _this$groups$;
      const selected = this.filteredCommands.find(command => command.name === this.selectedName);
      // By default the first command as displayed (help), not the first in alphabetical order
      return selected || ((_this$groups$ = this.groups[0]) === null || _this$groups$ === void 0 ? void 0 : _this$groups$.commands[0]);
    }
  },
  methods: {
    formatOption(option) {
      const shortcut = option.shortcut ? `${option.shortcut}, ` : '';
      let value = '';
      if (option.acceptValue) {
        value = option.valueRequired ? '=VALUE' : '[=VALUE]';
      }
      return `${shortcut}${option.name}${value}`;
    },
    stripName(usage, name) {
      return usage.startsWith(name) ? usage.slice(name.length).trim() : usage;
    }
  }
}));
// CONCATENATED MODULE: ./plugins/ConsoleUI/vue/src/ConsolePage/CommandLibrary.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/ConsoleUI/vue/src/ConsolePage/CommandLibrary.vue



CommandLibraryvue_type_script_lang_ts.render = CommandLibraryvue_type_template_id_2b426968_render

/* harmony default export */ var CommandLibrary = (CommandLibraryvue_type_script_lang_ts);
// CONCATENATED MODULE: ./plugins/ConsoleUI/vue/src/ConsolePage/autocomplete.ts
/*!
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */
const MAX_SUGGESTIONS = 8;
function tokenAtCaret(line, caret) {
  const before = line.slice(0, caret);
  const start = Math.max(before.lastIndexOf(' '), before.lastIndexOf('\t')) + 1;
  const previous = before.slice(0, start).split(/\s+/).filter(token => token !== '');
  return {
    previous,
    current: before.slice(start),
    start
  };
}
function findCommand(catalog, name) {
  const lower = name.toLowerCase();
  return catalog.commands.find(command => command.name.toLowerCase() === lower || command.aliases.some(alias => alias.toLowerCase() === lower));
}
/**
 * Commands whose name starts with the query come first, then those containing it anywhere
 */
function suggestCommands(catalog, query) {
  const lower = query.toLowerCase();
  // A complete command name needs no suggestion, the next useful step is its options
  if (findCommand(catalog, query)) {
    return [];
  }
  const startsWith = [];
  const contains = [];
  catalog.commands.forEach(command => {
    const name = command.name.toLowerCase();
    if (name.startsWith(lower)) {
      startsWith.push(command);
    } else if (lower !== '' && name.includes(lower)) {
      contains.push(command);
    }
  });
  return startsWith.concat(contains).filter(command => command.name.toLowerCase() !== lower).slice(0, MAX_SUGGESTIONS).map(command => ({
    kind: 'command',
    value: command.name,
    description: command.description
  }));
}
function optionName(token) {
  return token.split('=')[0];
}
function suggestOptions(options, query, alreadyUsed) {
  const used = alreadyUsed.map(optionName);
  const lower = query.toLowerCase();
  return options.filter(option => option.name.toLowerCase().startsWith(lower) && option.name !== query).filter(option => option.multiple || !used.includes(option.name)).slice(0, MAX_SUGGESTIONS).map(option => ({
    kind: 'option',
    value: option.name,
    description: option.description
  }));
}
/**
 * What to suggest for the token under the caret: a command name while typing the first word,
 * the options of the command afterwards, once the token is empty or starts with a dash.
 */
function getSuggestions(catalog, line, caret) {
  const {
    previous,
    current
  } = tokenAtCaret(line, caret);
  if (previous.length === 0) {
    return current === '' ? [] : suggestCommands(catalog, current);
  }
  if (current !== '' && !current.startsWith('-')) {
    return [];
  }
  // A value is expected after an option written as "--option value"
  const last = previous[previous.length - 1];
  const command = findCommand(catalog, previous[0]);
  const options = (command ? command.options : []).concat(catalog.globalOptions);
  const lastOption = options.find(option => option.name === last);
  if (current === '' && lastOption && lastOption.valueRequired) {
    return [];
  }
  if (!command && current === '') {
    return [];
  }
  return suggestOptions(options, current === '' ? '--' : current, previous.slice(1));
}
/**
 * Replaces the token under the caret with the suggestion, and places the caret where the next
 * input goes
 */
function applySuggestion(catalog, line, caret, suggestion) {
  const {
    previous,
    start
  } = tokenAtCaret(line, caret);
  let end = caret;
  while (end < line.length && !/\s/.test(line[end])) {
    end += 1;
  }
  let suffix = ' ';
  if (suggestion.kind === 'option') {
    const command = previous.length ? findCommand(catalog, previous[0]) : undefined;
    const option = (command ? command.options : []).concat(catalog.globalOptions).find(candidate => candidate.name === suggestion.value);
    if (option && option.acceptValue) {
      suffix = '=';
    }
  }
  const rest = line.slice(end).replace(/^\s+/, '');
  const inserted = `${suggestion.value}${suffix}`;
  const newLine = `${line.slice(0, start)}${inserted}${rest}`;
  return {
    line: newLine,
    caret: start + inserted.length
  };
}
// CONCATENATED MODULE: ./plugins/ConsoleUI/vue/src/ConsolePage/readEventStream.ts
/*!
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */
/**
 * Extracts the complete Server-Sent Events of a buffer, returns them with what is left for the
 * next chunk
 */
function parseEventBuffer(buffer) {
  const blocks = buffer.split('\n\n');
  const rest = blocks.pop() || '';
  const events = [];
  blocks.forEach(block => {
    const data = block.split('\n').filter(line => line.startsWith('data: ')).map(line => line.slice(6)).join('\n');
    if (data === '') {
      return;
    }
    try {
      events.push(JSON.parse(data));
    } catch (_unused) {
      // An event the stream could not encode is skipped, the next ones still arrive
    }
  });
  return {
    events,
    rest
  };
}
async function readEventStream(body, onEvent) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const {
      done,
      value
    } = await reader.read();
    buffer += decoder.decode(value, {
      stream: !done
    });
    const parsed = parseEventBuffer(done ? `${buffer}\n\n` : buffer);
    buffer = parsed.rest;
    parsed.events.forEach(onEvent);
    if (done) {
      return;
    }
  }
}
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/ConsoleUI/vue/src/ConsolePage/ConsolePage.vue?vue&type=script&lang=ts





/** Older runs are dropped beyond this, to keep the page light */
const MAX_RUNS = 50;
const MAX_HISTORY = 100;
let instanceCount = 0;
/** Identifies a run, so the Stop button reaches the request running it */
function createRunId() {
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}
/* harmony default export */ var ConsolePagevue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    enabled: {
      type: Boolean,
      default: true
    },
    catalog: {
      type: Object,
      default: () => ({
        commands: [],
        globalOptions: []
      })
    }
  },
  components: {
    ContentBlock: external_CoreHome_["ContentBlock"],
    CommandLibrary: CommandLibrary
  },
  data() {
    instanceCount += 1;
    return {
      line: '',
      runs: [],
      isRunning: false,
      suggestions: [],
      activeSuggestion: -1,
      // Kept in memory only: a command line may carry a password, it must not outlive the page
      history: [],
      historyIndex: -1,
      draft: '',
      stickToBottom: true,
      nextRunId: 1,
      runId: '',
      isStopping: false,
      inputId: `consoleUiInput${instanceCount}`,
      listboxId: `consoleUiSuggestions${instanceCount}`
    };
  },
  mounted() {
    this.focusInput();
  },
  computed: {
    showSuggestions() {
      return this.suggestions.length > 0;
    },
    activeDescendant() {
      return this.activeSuggestion >= 0 ? `${this.listboxId}-${this.activeSuggestion}` : '';
    }
  },
  methods: {
    focusInput() {
      const selection = window.getSelection();
      // Selecting output text to copy it must not be cancelled by the focus
      if (selection && selection.toString() !== '') {
        return;
      }
      const input = this.$refs.input;
      if (input) {
        input.focus({
          preventScroll: true
        });
      }
    },
    inputElement() {
      return this.$refs.input;
    },
    refreshSuggestions() {
      const input = this.inputElement();
      const caret = input.selectionStart === null ? this.line.length : input.selectionStart;
      this.suggestions = getSuggestions(this.catalog, this.line, caret);
      this.activeSuggestion = -1;
    },
    acceptSuggestion(suggestion) {
      const input = this.inputElement();
      const caret = input.selectionStart === null ? this.line.length : input.selectionStart;
      const result = applySuggestion(this.catalog, this.line, caret, suggestion);
      this.line = result.line;
      this.$nextTick(() => {
        input.focus();
        input.setSelectionRange(result.caret, result.caret);
        this.refreshSuggestions();
      });
    },
    onKeydown(event) {
      // Ctrl+C stops the running command as in a terminal, unless text is selected to be copied
      const input = event.target;
      if (event.ctrlKey && event.key.toLowerCase() === 'c' && this.isRunning && input.selectionStart === input.selectionEnd) {
        event.preventDefault();
        this.stopRun();
        return;
      }
      if (event.ctrlKey && event.key.toLowerCase() === 'l') {
        event.preventDefault();
        this.clearOutput();
        return;
      }
      if (this.showSuggestions) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          const step = event.key === 'ArrowDown' ? 1 : -1;
          const count = this.suggestions.length;
          this.activeSuggestion = (this.activeSuggestion + step + count) % count;
          return;
        }
        if (event.key === 'Tab' || event.key === 'Enter' && this.activeSuggestion >= 0) {
          event.preventDefault();
          const index = this.activeSuggestion >= 0 ? this.activeSuggestion : 0;
          this.acceptSuggestion(this.suggestions[index]);
          return;
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          this.suggestions = [];
          return;
        }
      }
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        this.browseHistory(event);
      }
    },
    browseHistory(event) {
      if (!this.history.length) {
        return;
      }
      event.preventDefault();
      if (event.key === 'ArrowUp') {
        if (this.historyIndex === -1) {
          this.draft = this.line;
          this.historyIndex = this.history.length - 1;
        } else if (this.historyIndex > 0) {
          this.historyIndex -= 1;
        }
        this.line = this.history[this.historyIndex];
      } else if (this.historyIndex !== -1) {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex += 1;
          this.line = this.history[this.historyIndex];
        } else {
          this.historyIndex = -1;
          this.line = this.draft;
        }
      }
    },
    submit() {
      const command = this.line.trim();
      if (!command || this.isRunning) {
        return;
      }
      if (this.history[this.history.length - 1] !== command) {
        this.history.push(command);
        this.history = this.history.slice(-MAX_HISTORY);
      }
      this.historyIndex = -1;
      this.draft = '';
      this.line = '';
      this.suggestions = [];
      this.execute(command);
    },
    useCommand(name) {
      this.line = `${name} `;
      this.$nextTick(() => {
        const input = this.inputElement();
        input.focus();
        input.setSelectionRange(this.line.length, this.line.length);
        this.refreshSuggestions();
      });
    },
    async execute(command) {
      this.runs.push({
        id: this.nextRunId,
        command,
        segments: [],
        status: 'running',
        exitCode: null,
        durationMs: null,
        stopped: false,
        truncated: false,
        error: '',
        reload: false
      });
      this.nextRunId += 1;
      if (this.runs.length > MAX_RUNS) {
        this.runs.splice(0, this.runs.length - MAX_RUNS);
      }
      // Read back through the reactive array, mutating the pushed literal would not update the view
      const run = this.runs[this.runs.length - 1];
      this.isRunning = true;
      this.isStopping = false;
      this.runId = createRunId();
      this.stickToBottom = true;
      this.scrollToBottom();
      try {
        const response = await fetch('index.php?module=ConsoleUI&action=execute', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            command,
            runId: this.runId,
            token_auth: external_CoreHome_["Matomo"].token_auth,
            force_api_session: '1'
          })
        });
        const contentType = response.headers.get('Content-Type') || '';
        if (!response.ok || !response.body || !contentType.includes('text/event-stream')) {
          throw new Error(Object(external_CoreHome_["translate"])('ConsoleUI_UnexpectedError'));
        }
        await readEventStream(response.body, event => this.handleEvent(run, event));
        if (run.status === 'running') {
          run.status = 'error';
          run.error = Object(external_CoreHome_["translate"])('ConsoleUI_ConnectionLost');
        }
      } catch (error) {
        run.status = 'error';
        run.error = error instanceof Error && error.message ? error.message : Object(external_CoreHome_["translate"])('ConsoleUI_UnexpectedError');
      } finally {
        this.isRunning = false;
        this.isStopping = false;
        this.runId = '';
        this.scrollToBottom();
        this.$nextTick(() => this.focusInput());
      }
    },
    handleEvent(run, event) {
      if (event.type === 'output' && event.segments) {
        this.appendSegments(run, event.segments);
      } else if (event.type === 'truncated') {
        run.truncated = true;
      } else if (event.type === 'exit') {
        run.status = 'done';
        run.exitCode = typeof event.exitCode === 'number' ? event.exitCode : null;
        run.durationMs = typeof event.durationMs === 'number' ? event.durationMs : null;
        run.stopped = !!event.stopped;
      } else if (event.type === 'error') {
        run.status = 'error';
        run.error = event.message || Object(external_CoreHome_["translate"])('ConsoleUI_UnexpectedError');
        run.reload = !!event.reload;
      }
      this.scrollToBottom();
    },
    appendSegments(run, segments) {
      segments.forEach(segment => {
        const last = run.segments[run.segments.length - 1];
        if (last && last.style === segment.style) {
          last.text += segment.text;
        } else {
          run.segments.push({
            text: segment.text,
            style: segment.style
          });
        }
      });
    },
    segmentClasses(segment) {
      return segment.style.split(' ').filter(token => token !== '').map(token => `ansi-${token}`);
    },
    formatDuration(durationMs) {
      return (durationMs / 1000).toFixed(durationMs < 10000 ? 2 : 1);
    },
    async stopRun() {
      if (!this.isRunning || this.isStopping || !this.runId) {
        return;
      }
      this.isStopping = true;
      try {
        await fetch('index.php?module=ConsoleUI&action=stop', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            runId: this.runId,
            token_auth: external_CoreHome_["Matomo"].token_auth,
            force_api_session: '1'
          })
        });
      } catch (_unused) {
        // The command then simply runs to its end
        this.isStopping = false;
      }
    },
    statusLine(run) {
      let exitCode = Object(external_CoreHome_["translate"])('ConsoleUI_ExitCode', `${run.exitCode}`);
      if (run.stopped) {
        exitCode = `${Object(external_CoreHome_["translate"])('ConsoleUI_Stopped')}, ${exitCode.charAt(0).toLowerCase()}${exitCode.slice(1)}`;
      }
      if (run.durationMs === null) {
        return exitCode;
      }
      return `${exitCode}, ${Object(external_CoreHome_["translate"])('ConsoleUI_Duration', this.formatDuration(run.durationMs))}`;
    },
    onOutputScroll() {
      const output = this.$refs.output;
      this.stickToBottom = output.scrollHeight - output.scrollTop - output.clientHeight < 24;
    },
    scrollToBottom() {
      if (!this.stickToBottom) {
        return;
      }
      this.$nextTick(() => {
        const output = this.$refs.output;
        if (output) {
          output.scrollTop = output.scrollHeight;
        }
      });
    },
    clearOutput() {
      if (!this.isRunning) {
        this.runs = [];
      }
    },
    outputAsText() {
      return this.runs.map(run => {
        const output = run.segments.map(segment => segment.text).join('');
        const lines = [`$ ./console ${run.command}`, output.replace(/\n$/, '')];
        if (run.error) {
          lines.push(run.error);
        }
        if (run.exitCode !== null) {
          lines.push(Object(external_CoreHome_["translate"])('ConsoleUI_ExitCode', `${run.exitCode}`));
        }
        return lines.filter(text => text !== '').join('\n');
      }).join('\n\n');
    },
    async copyOutput() {
      try {
        await navigator.clipboard.writeText(this.outputAsText());
        external_CoreHome_["NotificationsStore"].show({
          message: Object(external_CoreHome_["translate"])('ConsoleUI_Copied'),
          context: 'success',
          type: 'transient',
          id: 'consoleUiCopied'
        });
      } catch (_unused2) {
        // The clipboard may be refused outside HTTPS, the output can still be selected by hand
      }
    },
    reloadPage() {
      window.location.reload();
    }
  }
}));
// CONCATENATED MODULE: ./plugins/ConsoleUI/vue/src/ConsolePage/ConsolePage.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/ConsoleUI/vue/src/ConsolePage/ConsolePage.vue



ConsolePagevue_type_script_lang_ts.render = render

/* harmony default export */ var ConsolePage = (ConsolePagevue_type_script_lang_ts);
// CONCATENATED MODULE: ./plugins/ConsoleUI/vue/src/index.ts
/*!
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib-no-default.js




/***/ })

/******/ });
});
//# sourceMappingURL=ConsoleUI.umd.js.map
//traceur runtime
(function(global) {
  'use strict';
  if (global.$traceurRuntime) {
    return;
  }
  var $Object = Object;
  var $TypeError = TypeError;
  var $create = $Object.create;
  var $defineProperties = $Object.defineProperties;
  var $defineProperty = $Object.defineProperty;
  var $freeze = $Object.freeze;
  var $getOwnPropertyDescriptor = $Object.getOwnPropertyDescriptor;
  var $getOwnPropertyNames = $Object.getOwnPropertyNames;
  var $getPrototypeOf = $Object.getPrototypeOf;
  var $hasOwnProperty = $Object.prototype.hasOwnProperty;
  var $toString = $Object.prototype.toString;
  function nonEnum(value) {
    return {
      configurable: true,
      enumerable: false,
      value: value,
      writable: true
    };
  }
  var types = {
    void: function voidType() {},
    any: function any() {},
    string: function string() {},
    number: function number() {},
    boolean: function boolean() {}
  };
  var method = nonEnum;
  var counter = 0;
  function newUniqueString() {
    return '__$' + Math.floor(Math.random() * 1e9) + '$' + ++counter + '$__';
  }
  var symbolInternalProperty = newUniqueString();
  var symbolDescriptionProperty = newUniqueString();
  var symbolDataProperty = newUniqueString();
  var symbolValues = $create(null);
  function isSymbol(symbol) {
    return typeof symbol === 'object' && symbol instanceof SymbolValue;
  }
  function typeOf(v) {
    if (isSymbol(v))
      return 'symbol';
    return typeof v;
  }
  function Symbol(description) {
    var value = new SymbolValue(description);
    if (!(this instanceof Symbol))
      return value;
    throw new TypeError('Symbol cannot be new\'ed');
  }
  $defineProperty(Symbol.prototype, 'constructor', nonEnum(Symbol));
  $defineProperty(Symbol.prototype, 'toString', method(function() {
    var symbolValue = this[symbolDataProperty];
    if (!getOption('symbols'))
      return symbolValue[symbolInternalProperty];
    if (!symbolValue)
      throw TypeError('Conversion from symbol to string');
    var desc = symbolValue[symbolDescriptionProperty];
    if (desc === undefined)
      desc = '';
    return 'Symbol(' + desc + ')';
  }));
  $defineProperty(Symbol.prototype, 'valueOf', method(function() {
    var symbolValue = this[symbolDataProperty];
    if (!symbolValue)
      throw TypeError('Conversion from symbol to string');
    if (!getOption('symbols'))
      return symbolValue[symbolInternalProperty];
    return symbolValue;
  }));
  function SymbolValue(description) {
    var key = newUniqueString();
    $defineProperty(this, symbolDataProperty, {value: this});
    $defineProperty(this, symbolInternalProperty, {value: key});
    $defineProperty(this, symbolDescriptionProperty, {value: description});
    $freeze(this);
    symbolValues[key] = this;
  }
  $defineProperty(SymbolValue.prototype, 'constructor', nonEnum(Symbol));
  $defineProperty(SymbolValue.prototype, 'toString', {
    value: Symbol.prototype.toString,
    enumerable: false
  });
  $defineProperty(SymbolValue.prototype, 'valueOf', {
    value: Symbol.prototype.valueOf,
    enumerable: false
  });
  $freeze(SymbolValue.prototype);
  Symbol.iterator = Symbol();
  function toProperty(name) {
    if (isSymbol(name))
      return name[symbolInternalProperty];
    return name;
  }
  function getOwnPropertyNames(object) {
    var rv = [];
    var names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      if (!symbolValues[name])
        rv.push(name);
    }
    return rv;
  }
  function getOwnPropertyDescriptor(object, name) {
    return $getOwnPropertyDescriptor(object, toProperty(name));
  }
  function getOwnPropertySymbols(object) {
    var rv = [];
    var names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var symbol = symbolValues[names[i]];
      if (symbol)
        rv.push(symbol);
    }
    return rv;
  }
  function hasOwnProperty(name) {
    return $hasOwnProperty.call(this, toProperty(name));
  }
  function getOption(name) {
    return global.traceur && global.traceur.options[name];
  }
  function setProperty(object, name, value) {
    var sym,
        desc;
    if (isSymbol(name)) {
      sym = name;
      name = name[symbolInternalProperty];
    }
    object[name] = value;
    if (sym && (desc = $getOwnPropertyDescriptor(object, name)))
      $defineProperty(object, name, {enumerable: false});
    return value;
  }
  function defineProperty(object, name, descriptor) {
    if (isSymbol(name)) {
      if (descriptor.enumerable) {
        descriptor = $create(descriptor, {enumerable: {value: false}});
      }
      name = name[symbolInternalProperty];
    }
    $defineProperty(object, name, descriptor);
    return object;
  }
  function polyfillObject(Object) {
    $defineProperty(Object, 'defineProperty', {value: defineProperty});
    $defineProperty(Object, 'getOwnPropertyNames', {value: getOwnPropertyNames});
    $defineProperty(Object, 'getOwnPropertyDescriptor', {value: getOwnPropertyDescriptor});
    $defineProperty(Object.prototype, 'hasOwnProperty', {value: hasOwnProperty});
    Object.getOwnPropertySymbols = getOwnPropertySymbols;
    function is(left, right) {
      if (left === right)
        return left !== 0 || 1 / left === 1 / right;
      return left !== left && right !== right;
    }
    $defineProperty(Object, 'is', method(is));
    function assign(target, source) {
      var props = $getOwnPropertyNames(source);
      var p,
          length = props.length;
      for (p = 0; p < length; p++) {
        target[props[p]] = source[props[p]];
      }
      return target;
    }
    $defineProperty(Object, 'assign', method(assign));
    function mixin(target, source) {
      var props = $getOwnPropertyNames(source);
      var p,
          descriptor,
          length = props.length;
      for (p = 0; p < length; p++) {
        descriptor = $getOwnPropertyDescriptor(source, props[p]);
        $defineProperty(target, props[p], descriptor);
      }
      return target;
    }
    $defineProperty(Object, 'mixin', method(mixin));
  }
  function exportStar(object) {
    for (var i = 1; i < arguments.length; i++) {
      var names = $getOwnPropertyNames(arguments[i]);
      for (var j = 0; j < names.length; j++) {
        (function(mod, name) {
          $defineProperty(object, name, {
            get: function() {
              return mod[name];
            },
            enumerable: true
          });
        })(arguments[i], names[j]);
      }
    }
    return object;
  }
  function toObject(value) {
    if (value == null)
      throw $TypeError();
    return $Object(value);
  }
  function spread() {
    var rv = [],
        k = 0;
    for (var i = 0; i < arguments.length; i++) {
      var valueToSpread = toObject(arguments[i]);
      for (var j = 0; j < valueToSpread.length; j++) {
        rv[k++] = valueToSpread[j];
      }
    }
    return rv;
  }
  function getPropertyDescriptor(object, name) {
    while (object !== null) {
      var result = $getOwnPropertyDescriptor(object, name);
      if (result)
        return result;
      object = $getPrototypeOf(object);
    }
    return undefined;
  }
  function superDescriptor(homeObject, name) {
    var proto = $getPrototypeOf(homeObject);
    if (!proto)
      throw $TypeError('super is null');
    return getPropertyDescriptor(proto, name);
  }
  function superCall(self, homeObject, name, args) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor) {
      if ('value' in descriptor)
        return descriptor.value.apply(self, args);
      if (descriptor.get)
        return descriptor.get.call(self).apply(self, args);
    }
    throw $TypeError("super has no method '" + name + "'.");
  }
  function superGet(self, homeObject, name) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor) {
      if (descriptor.get)
        return descriptor.get.call(self);
      else if ('value' in descriptor)
        return descriptor.value;
    }
    return undefined;
  }
  function superSet(self, homeObject, name, value) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor && descriptor.set) {
      descriptor.set.call(self, value);
      return;
    }
    throw $TypeError("super has no setter '" + name + "'.");
  }
  function getDescriptors(object) {
    var descriptors = {},
        name,
        names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      descriptors[name] = $getOwnPropertyDescriptor(object, name);
    }
    return descriptors;
  }
  function createClass(ctor, object, staticObject, superClass) {
    $defineProperty(object, 'constructor', {
      value: ctor,
      configurable: true,
      enumerable: false,
      writable: true
    });
    if (arguments.length > 3) {
      if (typeof superClass === 'function')
        ctor.__proto__ = superClass;
      ctor.prototype = $create(getProtoParent(superClass), getDescriptors(object));
    } else {
      ctor.prototype = object;
    }
    $defineProperty(ctor, 'prototype', {
      configurable: false,
      writable: false
    });
    return $defineProperties(ctor, getDescriptors(staticObject));
  }
  function getProtoParent(superClass) {
    if (typeof superClass === 'function') {
      var prototype = superClass.prototype;
      if ($Object(prototype) === prototype || prototype === null)
        return superClass.prototype;
    }
    if (superClass === null)
      return null;
    throw new TypeError();
  }
  function defaultSuperCall(self, homeObject, args) {
    if ($getPrototypeOf(homeObject) !== null)
      superCall(self, homeObject, 'constructor', args);
  }
  var ST_NEWBORN = 0;
  var ST_EXECUTING = 1;
  var ST_SUSPENDED = 2;
  var ST_CLOSED = 3;
  var END_STATE = -3;
  function addIterator(object) {
    return defineProperty(object, Symbol.iterator, nonEnum(function() {
      return this;
    }));
  }
  function GeneratorContext() {
    this.state = 0;
    this.GState = ST_NEWBORN;
    this.storedException = undefined;
    this.finallyFallThrough = undefined;
    this.sent = undefined;
    this.returnValue = undefined;
    this.tryStack_ = [];
  }
  GeneratorContext.prototype = {
    pushTry: function(catchState, finallyState) {
      if (finallyState !== null) {
        var finallyFallThrough = null;
        for (var i = this.tryStack_.length - 1; i >= 0; i--) {
          if (this.tryStack_[i].catch !== undefined) {
            finallyFallThrough = this.tryStack_[i].catch;
            break;
          }
        }
        if (finallyFallThrough === null)
          finallyFallThrough = -3;
        this.tryStack_.push({
          finally: finallyState,
          finallyFallThrough: finallyFallThrough
        });
      }
      if (catchState !== null) {
        this.tryStack_.push({catch: catchState});
      }
    },
    popTry: function() {
      this.tryStack_.pop();
    }
  };
  function getNextOrThrow(ctx, moveNext, action) {
    return function(x) {
      switch (ctx.GState) {
        case ST_EXECUTING:
          throw new Error(("\"" + action + "\" on executing generator"));
        case ST_CLOSED:
          throw new Error(("\"" + action + "\" on closed generator"));
        case ST_NEWBORN:
          if (action === 'throw') {
            ctx.GState = ST_CLOSED;
            throw x;
          }
          if (x !== undefined)
            throw $TypeError('Sent value to newborn generator');
        case ST_SUSPENDED:
          ctx.GState = ST_EXECUTING;
          ctx.action = action;
          ctx.sent = x;
          var value = moveNext(ctx);
          var done = value === ctx;
          if (done)
            value = ctx.returnValue;
          ctx.GState = done ? ST_CLOSED : ST_SUSPENDED;
          return {
            value: value,
            done: done
          };
      }
    };
  }
  function generatorWrap(innerFunction, self) {
    var moveNext = getMoveNext(innerFunction, self);
    var ctx = new GeneratorContext();
    return addIterator({
      next: getNextOrThrow(ctx, moveNext, 'next'),
      throw: getNextOrThrow(ctx, moveNext, 'throw')
    });
  }
  function AsyncFunctionContext() {
    GeneratorContext.call(this);
    this.err = undefined;
    var ctx = this;
    ctx.result = new Promise(function(resolve, reject) {
      ctx.resolve = resolve;
      ctx.reject = reject;
    });
  }
  AsyncFunctionContext.prototype = Object.create(GeneratorContext.prototype);
  function asyncWrap(innerFunction, self) {
    var moveNext = getMoveNext(innerFunction, self);
    var ctx = new AsyncFunctionContext();
    ctx.createCallback = function(newState) {
      return function(value) {
        ctx.state = newState;
        ctx.value = value;
        moveNext(ctx);
      };
    };
    ctx.createErrback = function(newState) {
      return function(err) {
        ctx.state = newState;
        ctx.err = err;
        moveNext(ctx);
      };
    };
    moveNext(ctx);
    return ctx.result;
  }
  function getMoveNext(innerFunction, self) {
    return function(ctx) {
      while (true) {
        try {
          return innerFunction.call(self, ctx);
        } catch (ex) {
          ctx.storedException = ex;
          var last = ctx.tryStack_[ctx.tryStack_.length - 1];
          if (!last) {
            ctx.GState = ST_CLOSED;
            ctx.state = END_STATE;
            throw ex;
          }
          ctx.state = last.catch !== undefined ? last.catch : last.finally;
          if (last.finallyFallThrough !== undefined)
            ctx.finallyFallThrough = last.finallyFallThrough;
        }
      }
    };
  }
  function setupGlobals(global) {
    global.Symbol = Symbol;
    polyfillObject(global.Object);
  }
  setupGlobals(global);
  global.$traceurRuntime = {
    asyncWrap: asyncWrap,
    createClass: createClass,
    defaultSuperCall: defaultSuperCall,
    exportStar: exportStar,
    generatorWrap: generatorWrap,
    setProperty: setProperty,
    setupGlobals: setupGlobals,
    spread: spread,
    superCall: superCall,
    superGet: superGet,
    superSet: superSet,
    toObject: toObject,
    toProperty: toProperty,
    type: types,
    typeof: typeOf
  };
})(typeof global !== 'undefined' ? global : this);
(function() {
  function buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
    var out = [];
    if (opt_scheme) {
      out.push(opt_scheme, ':');
    }
    if (opt_domain) {
      out.push('//');
      if (opt_userInfo) {
        out.push(opt_userInfo, '@');
      }
      out.push(opt_domain);
      if (opt_port) {
        out.push(':', opt_port);
      }
    }
    if (opt_path) {
      out.push(opt_path);
    }
    if (opt_queryData) {
      out.push('?', opt_queryData);
    }
    if (opt_fragment) {
      out.push('#', opt_fragment);
    }
    return out.join('');
  }
  ;
  var splitRe = new RegExp('^' + '(?:' + '([^:/?#.]+)' + ':)?' + '(?://' + '(?:([^/?#]*)@)?' + '([\\w\\d\\-\\u0100-\\uffff.%]*)' + '(?::([0-9]+))?' + ')?' + '([^?#]+)?' + '(?:\\?([^#]*))?' + '(?:#(.*))?' + '$');
  var ComponentIndex = {
    SCHEME: 1,
    USER_INFO: 2,
    DOMAIN: 3,
    PORT: 4,
    PATH: 5,
    QUERY_DATA: 6,
    FRAGMENT: 7
  };
  function split(uri) {
    return (uri.match(splitRe));
  }
  function removeDotSegments(path) {
    if (path === '/')
      return '/';
    var leadingSlash = path[0] === '/' ? '/' : '';
    var trailingSlash = path.slice(-1) === '/' ? '/' : '';
    var segments = path.split('/');
    var out = [];
    var up = 0;
    for (var pos = 0; pos < segments.length; pos++) {
      var segment = segments[pos];
      switch (segment) {
        case '':
        case '.':
          break;
        case '..':
          if (out.length)
            out.pop();
          else
            up++;
          break;
        default:
          out.push(segment);
      }
    }
    if (!leadingSlash) {
      while (up-- > 0) {
        out.unshift('..');
      }
      if (out.length === 0)
        out.push('.');
    }
    return leadingSlash + out.join('/') + trailingSlash;
  }
  function joinAndCanonicalizePath(parts) {
    var path = parts[ComponentIndex.PATH] || '';
    path = removeDotSegments(path.replace(/\/\//.g, '/'));
    parts[ComponentIndex.PATH] = path;
    return buildFromEncodedParts(parts[ComponentIndex.SCHEME], parts[ComponentIndex.USER_INFO], parts[ComponentIndex.DOMAIN], parts[ComponentIndex.PORT], parts[ComponentIndex.PATH], parts[ComponentIndex.QUERY_DATA], parts[ComponentIndex.FRAGMENT]);
  }
  function canonicalizeUrl(url) {
    var parts = split(url);
    return joinAndCanonicalizePath(parts);
  }
  function resolveUrl(base, url) {
    var parts = split(url);
    var baseParts = split(base);
    if (parts[ComponentIndex.SCHEME]) {
      return joinAndCanonicalizePath(parts);
    } else {
      parts[ComponentIndex.SCHEME] = baseParts[ComponentIndex.SCHEME];
    }
    for (var i = ComponentIndex.SCHEME; i <= ComponentIndex.PORT; i++) {
      if (!parts[i]) {
        parts[i] = baseParts[i];
      }
    }
    if (parts[ComponentIndex.PATH][0] == '/') {
      return joinAndCanonicalizePath(parts);
    }
    var path = baseParts[ComponentIndex.PATH];
    var index = path.lastIndexOf('/');
    path = path.slice(0, index + 1) + parts[ComponentIndex.PATH];
    parts[ComponentIndex.PATH] = path;
    return joinAndCanonicalizePath(parts);
  }
  function isAbsolute(name) {
    if (!name)
      return false;
    if (name[0] === '/')
      return true;
    var parts = split(name);
    if (parts[ComponentIndex.SCHEME])
      return true;
    return false;
  }
  $traceurRuntime.canonicalizeUrl = canonicalizeUrl;
  $traceurRuntime.isAbsolute = isAbsolute;
  $traceurRuntime.removeDotSegments = removeDotSegments;
  $traceurRuntime.resolveUrl = resolveUrl;
})();
(function(global) {
  'use strict';
  var $__2 = $traceurRuntime,
      canonicalizeUrl = $__2.canonicalizeUrl,
      resolveUrl = $__2.resolveUrl,
      isAbsolute = $__2.isAbsolute;
  var moduleInstantiators = Object.create(null);
  var baseURL;
  if (global.location && global.location.href)
    baseURL = resolveUrl(global.location.href, './');
  else
    baseURL = '';
  var UncoatedModuleEntry = function UncoatedModuleEntry(url, uncoatedModule) {
    this.url = url;
    this.value_ = uncoatedModule;
  };
  ($traceurRuntime.createClass)(UncoatedModuleEntry, {}, {});
  var UncoatedModuleInstantiator = function UncoatedModuleInstantiator(url, func) {
    $traceurRuntime.superCall(this, $UncoatedModuleInstantiator.prototype, "constructor", [url, null]);
    this.func = func;
  };
  var $UncoatedModuleInstantiator = UncoatedModuleInstantiator;
  ($traceurRuntime.createClass)(UncoatedModuleInstantiator, {getUncoatedModule: function() {
      if (this.value_)
        return this.value_;
      return this.value_ = this.func.call(global);
    }}, {}, UncoatedModuleEntry);
  function getUncoatedModuleInstantiator(name) {
    if (!name)
      return;
    var url = ModuleStore.normalize(name);
    return moduleInstantiators[url];
  }
  ;
  var moduleInstances = Object.create(null);
  var liveModuleSentinel = {};
  function Module(uncoatedModule) {
    var isLive = arguments[1];
    var coatedModule = Object.create(null);
    Object.getOwnPropertyNames(uncoatedModule).forEach((function(name) {
      var getter,
          value;
      if (isLive === liveModuleSentinel) {
        var descr = Object.getOwnPropertyDescriptor(uncoatedModule, name);
        if (descr.get)
          getter = descr.get;
      }
      if (!getter) {
        value = uncoatedModule[name];
        getter = function() {
          return value;
        };
      }
      Object.defineProperty(coatedModule, name, {
        get: getter,
        enumerable: true
      });
    }));
    Object.preventExtensions(coatedModule);
    return coatedModule;
  }
  var ModuleStore = {
    normalize: function(name, refererName, refererAddress) {
      if (typeof name !== "string")
        throw new TypeError("module name must be a string, not " + typeof name);
      if (isAbsolute(name))
        return canonicalizeUrl(name);
      if (/[^\.]\/\.\.\//.test(name)) {
        throw new Error('module name embeds /../: ' + name);
      }
      if (name[0] === '.' && refererName)
        return resolveUrl(refererName, name);
      return canonicalizeUrl(name);
    },
    get: function(normalizedName) {
      var m = getUncoatedModuleInstantiator(normalizedName);
      if (!m)
        return undefined;
      var moduleInstance = moduleInstances[m.url];
      if (moduleInstance)
        return moduleInstance;
      moduleInstance = Module(m.getUncoatedModule(), liveModuleSentinel);
      return moduleInstances[m.url] = moduleInstance;
    },
    set: function(normalizedName, module) {
      normalizedName = String(normalizedName);
      moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, (function() {
        return module;
      }));
      moduleInstances[normalizedName] = module;
    },
    get baseURL() {
      return baseURL;
    },
    set baseURL(v) {
      baseURL = String(v);
    },
    registerModule: function(name, func) {
      var normalizedName = ModuleStore.normalize(name);
      if (moduleInstantiators[normalizedName])
        throw new Error('duplicate module named ' + normalizedName);
      moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, func);
    },
    bundleStore: Object.create(null),
    register: function(name, deps, func) {
      if (!deps || !deps.length) {
        this.registerModule(name, func);
      } else {
        this.bundleStore[name] = {
          deps: deps,
          execute: func
        };
      }
    },
    getAnonymousModule: function(func) {
      return new Module(func.call(global), liveModuleSentinel);
    },
    getForTesting: function(name) {
      var $__0 = this;
      if (!this.testingPrefix_) {
        Object.keys(moduleInstances).some((function(key) {
          var m = /(traceur@[^\/]*\/)/.exec(key);
          if (m) {
            $__0.testingPrefix_ = m[1];
            return true;
          }
        }));
      }
      return this.get(this.testingPrefix_ + name);
    }
  };
  ModuleStore.set('@traceur/src/runtime/ModuleStore', new Module({ModuleStore: ModuleStore}));
  var setupGlobals = $traceurRuntime.setupGlobals;
  $traceurRuntime.setupGlobals = function(global) {
    setupGlobals(global);
  };
  $traceurRuntime.ModuleStore = ModuleStore;
  global.System = {
    register: ModuleStore.register.bind(ModuleStore),
    get: ModuleStore.get,
    set: ModuleStore.set,
    normalize: ModuleStore.normalize
  };
  $traceurRuntime.getModuleImpl = function(name) {
    var instantiator = getUncoatedModuleInstantiator(name);
    return instantiator && instantiator.getUncoatedModule();
  };
})(typeof global !== 'undefined' ? global : this);
System.register("traceur-runtime@0.0.25/src/runtime/polyfills/utils", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.25/src/runtime/polyfills/utils";
  var toObject = $traceurRuntime.toObject;
  function toUint32(x) {
    return x | 0;
  }
  return {
    get toObject() {
      return toObject;
    },
    get toUint32() {
      return toUint32;
    }
  };
});
System.register("traceur-runtime@0.0.25/src/runtime/polyfills/ArrayIterator", [], function() {
  "use strict";
  var $__4;
  var __moduleName = "traceur-runtime@0.0.25/src/runtime/polyfills/ArrayIterator";
  var $__5 = $traceurRuntime.getModuleImpl("traceur-runtime@0.0.25/src/runtime/polyfills/utils"),
      toObject = $__5.toObject,
      toUint32 = $__5.toUint32;
  var ARRAY_ITERATOR_KIND_KEYS = 1;
  var ARRAY_ITERATOR_KIND_VALUES = 2;
  var ARRAY_ITERATOR_KIND_ENTRIES = 3;
  var ArrayIterator = function ArrayIterator() {};
  ($traceurRuntime.createClass)(ArrayIterator, ($__4 = {}, Object.defineProperty($__4, "next", {
    value: function() {
      var iterator = toObject(this);
      var array = iterator.iteratorObject_;
      if (!array) {
        throw new TypeError('Object is not an ArrayIterator');
      }
      var index = iterator.arrayIteratorNextIndex_;
      var itemKind = iterator.arrayIterationKind_;
      var length = toUint32(array.length);
      if (index >= length) {
        iterator.arrayIteratorNextIndex_ = Infinity;
        return createIteratorResultObject(undefined, true);
      }
      iterator.arrayIteratorNextIndex_ = index + 1;
      if (itemKind == ARRAY_ITERATOR_KIND_VALUES)
        return createIteratorResultObject(array[index], false);
      if (itemKind == ARRAY_ITERATOR_KIND_ENTRIES)
        return createIteratorResultObject([index, array[index]], false);
      return createIteratorResultObject(index, false);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, Symbol.iterator, {
    value: function() {
      return this;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__4), {});
  function createArrayIterator(array, kind) {
    var object = toObject(array);
    var iterator = new ArrayIterator;
    iterator.iteratorObject_ = object;
    iterator.arrayIteratorNextIndex_ = 0;
    iterator.arrayIterationKind_ = kind;
    return iterator;
  }
  function createIteratorResultObject(value, done) {
    return {
      value: value,
      done: done
    };
  }
  function entries() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_ENTRIES);
  }
  function keys() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_KEYS);
  }
  function values() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_VALUES);
  }
  return {
    get entries() {
      return entries;
    },
    get keys() {
      return keys;
    },
    get values() {
      return values;
    }
  };
});
System.register("traceur-runtime@0.0.25/node_modules/rsvp/lib/rsvp/asap", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.25/node_modules/rsvp/lib/rsvp/asap";
  var $__default = function asap(callback, arg) {
    var length = queue.push([callback, arg]);
    if (length === 1) {
      scheduleFlush();
    }
  };
  var browserGlobal = (typeof window !== 'undefined') ? window : {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  function useNextTick() {
    return function() {
      process.nextTick(flush);
    };
  }
  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, {characterData: true});
    return function() {
      node.data = (iterations = ++iterations % 2);
    };
  }
  function useSetTimeout() {
    return function() {
      setTimeout(flush, 1);
    };
  }
  var queue = [];
  function flush() {
    for (var i = 0; i < queue.length; i++) {
      var tuple = queue[i];
      var callback = tuple[0],
          arg = tuple[1];
      callback(arg);
    }
    queue = [];
  }
  var scheduleFlush;
  if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
    scheduleFlush = useNextTick();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else {
    scheduleFlush = useSetTimeout();
  }
  return {get default() {
      return $__default;
    }};
});
System.register("traceur-runtime@0.0.25/src/runtime/polyfills/Promise", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.25/src/runtime/polyfills/Promise";
  var async = $traceurRuntime.getModuleImpl("traceur-runtime@0.0.25/node_modules/rsvp/lib/rsvp/asap").default;
  function isPromise(x) {
    return x && typeof x === 'object' && x.status_ !== undefined;
  }
  function chain(promise) {
    var onResolve = arguments[1] !== (void 0) ? arguments[1] : (function(x) {
      return x;
    });
    var onReject = arguments[2] !== (void 0) ? arguments[2] : (function(e) {
      throw e;
    });
    var deferred = getDeferred(promise.constructor);
    switch (promise.status_) {
      case undefined:
        throw TypeError;
      case 'pending':
        promise.onResolve_.push([deferred, onResolve]);
        promise.onReject_.push([deferred, onReject]);
        break;
      case 'resolved':
        promiseReact(deferred, onResolve, promise.value_);
        break;
      case 'rejected':
        promiseReact(deferred, onReject, promise.value_);
        break;
    }
    return deferred.promise;
  }
  function getDeferred(C) {
    var result = {};
    result.promise = new C((function(resolve, reject) {
      result.resolve = resolve;
      result.reject = reject;
    }));
    return result;
  }
  var Promise = function Promise(resolver) {
    var $__6 = this;
    this.status_ = 'pending';
    this.onResolve_ = [];
    this.onReject_ = [];
    resolver((function(x) {
      promiseResolve($__6, x);
    }), (function(r) {
      promiseReject($__6, r);
    }));
  };
  ($traceurRuntime.createClass)(Promise, {
    catch: function(onReject) {
      return this.then(undefined, onReject);
    },
    then: function() {
      var onResolve = arguments[0] !== (void 0) ? arguments[0] : (function(x) {
        return x;
      });
      var onReject = arguments[1];
      var $__6 = this;
      var constructor = this.constructor;
      return chain(this, (function(x) {
        x = promiseCoerce(constructor, x);
        return x === $__6 ? onReject(new TypeError) : isPromise(x) ? x.then(onResolve, onReject) : onResolve(x);
      }), onReject);
    }
  }, {
    resolve: function(x) {
      return new this((function(resolve, reject) {
        resolve(x);
      }));
    },
    reject: function(r) {
      return new this((function(resolve, reject) {
        reject(r);
      }));
    },
    cast: function(x) {
      if (x instanceof this)
        return x;
      if (isPromise(x)) {
        var result = getDeferred(this);
        chain(x, result.resolve, result.reject);
        return result.promise;
      }
      return this.resolve(x);
    },
    all: function(values) {
      var deferred = getDeferred(this);
      var count = 0;
      var resolutions = [];
      try {
        for (var i = 0; i < values.length; i++) {
          ++count;
          this.cast(values[i]).then(function(i, x) {
            resolutions[i] = x;
            if (--count === 0)
              deferred.resolve(resolutions);
          }.bind(undefined, i), (function(r) {
            if (count > 0)
              count = 0;
            deferred.reject(r);
          }));
        }
        if (count === 0)
          deferred.resolve(resolutions);
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    },
    race: function(values) {
      var deferred = getDeferred(this);
      try {
        for (var i = 0; i < values.length; i++) {
          this.cast(values[i]).then((function(x) {
            deferred.resolve(x);
          }), (function(r) {
            deferred.reject(r);
          }));
        }
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    }
  });
  function promiseResolve(promise, x) {
    promiseDone(promise, 'resolved', x, promise.onResolve_);
  }
  function promiseReject(promise, r) {
    promiseDone(promise, 'rejected', r, promise.onReject_);
  }
  function promiseDone(promise, status, value, reactions) {
    if (promise.status_ !== 'pending')
      return;
    for (var i = 0; i < reactions.length; i++) {
      promiseReact(reactions[i][0], reactions[i][1], value);
    }
    promise.status_ = status;
    promise.value_ = value;
    promise.onResolve_ = promise.onReject_ = undefined;
  }
  function promiseReact(deferred, handler, x) {
    async((function() {
      try {
        var y = handler(x);
        if (y === deferred.promise)
          throw new TypeError;
        else if (isPromise(y))
          chain(y, deferred.resolve, deferred.reject);
        else
          deferred.resolve(y);
      } catch (e) {
        deferred.reject(e);
      }
    }));
  }
  var thenableSymbol = '@@thenable';
  function promiseCoerce(constructor, x) {
    if (isPromise(x)) {
      return x;
    } else if (x && typeof x.then === 'function') {
      var p = x[thenableSymbol];
      if (p) {
        return p;
      } else {
        var deferred = getDeferred(constructor);
        x[thenableSymbol] = deferred.promise;
        try {
          x.then(deferred.resolve, deferred.reject);
        } catch (e) {
          deferred.reject(e);
        }
        return deferred.promise;
      }
    } else {
      return x;
    }
  }
  return {get Promise() {
      return Promise;
    }};
});
System.register("traceur-runtime@0.0.25/src/runtime/polyfills/String", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.25/src/runtime/polyfills/String";
  var $toString = Object.prototype.toString;
  var $indexOf = String.prototype.indexOf;
  var $lastIndexOf = String.prototype.lastIndexOf;
  function startsWith(search) {
    var string = String(this);
    if (this == null || $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var position = arguments.length > 1 ? arguments[1] : undefined;
    var pos = position ? Number(position) : 0;
    if (isNaN(pos)) {
      pos = 0;
    }
    var start = Math.min(Math.max(pos, 0), stringLength);
    return $indexOf.call(string, searchString, pos) == start;
  }
  function endsWith(search) {
    var string = String(this);
    if (this == null || $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var pos = stringLength;
    if (arguments.length > 1) {
      var position = arguments[1];
      if (position !== undefined) {
        pos = position ? Number(position) : 0;
        if (isNaN(pos)) {
          pos = 0;
        }
      }
    }
    var end = Math.min(Math.max(pos, 0), stringLength);
    var start = end - searchLength;
    if (start < 0) {
      return false;
    }
    return $lastIndexOf.call(string, searchString, start) == start;
  }
  function contains(search) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var position = arguments.length > 1 ? arguments[1] : undefined;
    var pos = position ? Number(position) : 0;
    if (isNaN(pos)) {
      pos = 0;
    }
    var start = Math.min(Math.max(pos, 0), stringLength);
    return $indexOf.call(string, searchString, pos) != -1;
  }
  function repeat(count) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var n = count ? Number(count) : 0;
    if (isNaN(n)) {
      n = 0;
    }
    if (n < 0 || n == Infinity) {
      throw RangeError();
    }
    if (n == 0) {
      return '';
    }
    var result = '';
    while (n--) {
      result += string;
    }
    return result;
  }
  function codePointAt(position) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var size = string.length;
    var index = position ? Number(position) : 0;
    if (isNaN(index)) {
      index = 0;
    }
    if (index < 0 || index >= size) {
      return undefined;
    }
    var first = string.charCodeAt(index);
    var second;
    if (first >= 0xD800 && first <= 0xDBFF && size > index + 1) {
      second = string.charCodeAt(index + 1);
      if (second >= 0xDC00 && second <= 0xDFFF) {
        return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
      }
    }
    return first;
  }
  function raw(callsite) {
    var raw = callsite.raw;
    var len = raw.length >>> 0;
    if (len === 0)
      return '';
    var s = '';
    var i = 0;
    while (true) {
      s += raw[i];
      if (i + 1 === len)
        return s;
      s += arguments[++i];
    }
  }
  function fromCodePoint() {
    var codeUnits = [];
    var floor = Math.floor;
    var highSurrogate;
    var lowSurrogate;
    var index = -1;
    var length = arguments.length;
    if (!length) {
      return '';
    }
    while (++index < length) {
      var codePoint = Number(arguments[index]);
      if (!isFinite(codePoint) || codePoint < 0 || codePoint > 0x10FFFF || floor(codePoint) != codePoint) {
        throw RangeError('Invalid code point: ' + codePoint);
      }
      if (codePoint <= 0xFFFF) {
        codeUnits.push(codePoint);
      } else {
        codePoint -= 0x10000;
        highSurrogate = (codePoint >> 10) + 0xD800;
        lowSurrogate = (codePoint % 0x400) + 0xDC00;
        codeUnits.push(highSurrogate, lowSurrogate);
      }
    }
    return String.fromCharCode.apply(null, codeUnits);
  }
  return {
    get startsWith() {
      return startsWith;
    },
    get endsWith() {
      return endsWith;
    },
    get contains() {
      return contains;
    },
    get repeat() {
      return repeat;
    },
    get codePointAt() {
      return codePointAt;
    },
    get raw() {
      return raw;
    },
    get fromCodePoint() {
      return fromCodePoint;
    }
  };
});
System.register("traceur-runtime@0.0.25/src/runtime/polyfills/polyfills", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.25/src/runtime/polyfills/polyfills";
  var Promise = $traceurRuntime.getModuleImpl("traceur-runtime@0.0.25/src/runtime/polyfills/Promise").Promise;
  var $__9 = $traceurRuntime.getModuleImpl("traceur-runtime@0.0.25/src/runtime/polyfills/String"),
      codePointAt = $__9.codePointAt,
      contains = $__9.contains,
      endsWith = $__9.endsWith,
      fromCodePoint = $__9.fromCodePoint,
      repeat = $__9.repeat,
      raw = $__9.raw,
      startsWith = $__9.startsWith;
  var $__9 = $traceurRuntime.getModuleImpl("traceur-runtime@0.0.25/src/runtime/polyfills/ArrayIterator"),
      entries = $__9.entries,
      keys = $__9.keys,
      values = $__9.values;
  function maybeDefineMethod(object, name, value) {
    if (!(name in object)) {
      Object.defineProperty(object, name, {
        value: value,
        configurable: true,
        enumerable: false,
        writable: true
      });
    }
  }
  function maybeAddFunctions(object, functions) {
    for (var i = 0; i < functions.length; i += 2) {
      var name = functions[i];
      var value = functions[i + 1];
      maybeDefineMethod(object, name, value);
    }
  }
  function polyfillPromise(global) {
    if (!global.Promise)
      global.Promise = Promise;
  }
  function polyfillString(String) {
    maybeAddFunctions(String.prototype, ['codePointAt', codePointAt, 'contains', contains, 'endsWith', endsWith, 'startsWith', startsWith, 'repeat', repeat]);
    maybeAddFunctions(String, ['fromCodePoint', fromCodePoint, 'raw', raw]);
  }
  function polyfillArray(Array, Symbol) {
    maybeAddFunctions(Array.prototype, ['entries', entries, 'keys', keys, 'values', values]);
    if (Symbol && Symbol.iterator) {
      Object.defineProperty(Array.prototype, Symbol.iterator, {
        value: values,
        configurable: true,
        enumerable: false,
        writable: true
      });
    }
  }
  function polyfill(global) {
    polyfillPromise(global);
    polyfillString(global.String);
    polyfillArray(global.Array, global.Symbol);
  }
  polyfill(this);
  var setupGlobals = $traceurRuntime.setupGlobals;
  $traceurRuntime.setupGlobals = function(global) {
    setupGlobals(global);
    polyfill(global);
  };
  return {};
});
System.register("traceur-runtime@0.0.25/src/runtime/polyfill-import", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.25/src/runtime/polyfill-import";
  var $__11 = $traceurRuntime.getModuleImpl("traceur-runtime@0.0.25/src/runtime/polyfills/polyfills");
  return {};
});
System.get("traceur-runtime@0.0.25/src/runtime/polyfill-import" + '');

//harmonic code
"use strict";
var Harmonic = function Harmonic(name) {
  this.name = name;
};
($traceurRuntime.createClass)(Harmonic, {
  getConfig: function() {
    return {
      "name": "ES6 Rocks",
      "title": "ES6 Rocks",
      "domain": "http://awesome.com",
      "subtitle": "Powered by Harmonic",
      "author": "ES6 Rocks",
      "description": "This is the description",
      "bio": "Thats me",
      "template": "default",
      "preprocessor": "stylus",
      "posts_permalink": ":language/:year/:month/:title",
      "pages_permalink": "pages/:title",
      "header_tokens": ["<!--", "-->"],
      "index_posts": 10,
      "i18n": {
        "default": "en",
        "languages": ["en", "pt-br"]
      }
    };
  },
  getPosts: function() {
    return {
      "en": [{
        "layout": "post",
        "title": "A new syntax for modules in ES6",
        "date": "2014-07-11T07:18:47.847Z",
        "comments": "true",
        "published": "true",
        "keywords": "JavaScript, ES6, modules",
        "description": "Post about module syntax",
        "categories": ["modules"],
        "authorName": "Jean Carlo Emer",
        "authorLink": "http://twitter.com/jcemer",
        "authorDescription": "Internet craftsman, computer scientist and speaker. I am a full-stack web developer for some time and only write code that solves real problems.",
        "authorPicture": "https://avatars2.githubusercontent.com/u/353504?s=460",
        "content": "<p>TC39 - ECMAScript group is finishing the sixth version of ECMAScript specification. The <a href=\"http://www.2ality.com/2014/06/es6-schedule.html\">group schedule</a> points to next June as the release date. By now, no significant differences may appear. It is time to deepen your knowledge into the subject.<br><!-- more -->\nThis post will not cover the importance of writing modular code. ES6 modules are already well displayed by websites like <a href=\"http://jsmodules.io\">JavaScript Modules</a>, by far the best reference. The objective here is to clarify and justify the necessities of releasing a new syntax to write modules.</p>\n<h2 id=\"nowadays-formats\">Nowadays formats</h2>\n<p>The most famous modules formats until now are the <a href=\"http://requirejs.org/docs/whyamd.html#amd\">AMD</a>, that are the most used by client-side libraries, and the <a href=\"http://wiki.commonjs.org/wiki/Modules/1.1\">CommonJS</a> that was adopted by platforms like Node.js and transported to browsers with Browserify. Each one has characteristics determined by its environment. For example the AMD format wraps each module inside a function to scope and allow asynchronous loading of dependencies at browsers. On the other hand, the CommonJS modules implicitly define the scope of a module making impossible to use this kind of format in browsers without translation.</p>\n<h2 id=\"choosing-a-module-format\">Choosing a module format</h2>\n<p>Libraries are the most affected by this decision. The inconsistency can be normalized using an abstraction that embraces the module code and makes it compatible with more than one format. The project <a href=\"https://github.com/umdjs/umd\">Universal Module Definition (UMD)</a> keeps a collection of this kind of abstractions.</p>\n<p>Observing the formats evolution and adoption the appearance of the UMD project should be interpreted as a unified solution. This is wrong. The UMD project keeps more than ten variations and all of them deflect the module code of its objective: solve the problem that the code is written for. Look at this toy example of the UMD module <code>add2</code> that has <code>add</code> as dependency:</p>\n<pre><code class=\"lang-javascript\">(function (factory) {\n  if (typeof define === &#39;function&#39; &amp;&amp; define.amd) {\n    define([&#39;add&#39;], factory);\n  } else if (typeof exports === &#39;object&#39;) {\n    module.exports = factory(require(&#39;add&#39;));\n  }\n}(function (add) {\n  return function (param) {\n    return add(2, param);\n  };\n}));\n</code></pre>\n<p>Write valid code for two module formats (or more) is not a good option. The solution is to analyse the formats to identify which one has more expressiveness power.</p>\n<p>The AMD modules encapsulate the code inside a function and it is a kind of harmfulness that doesn&#39;t bring expressiveness. Functions are part of another universe of problem solutions. The new specification should consider that each module file have its own scope. Remember that a new language version can change its behaviour. Saying that, <a href=\"http://blog.millermedeiros.com/amd-is-better-for-the-web-than-commonjs-modules\">there are no reasons to adopt AMD anymore</a>.</p>\n<p>CommonJS Modules are more expressive. It is a great advantage to leave aside encapsulation through functions and still be able to indicate which part of the code will be used like this <code>var debug = require(&#39;util&#39;).debug;</code> or even use: <code>require(&#39;util&#39;).debug(&#39;message on stderr&#39;);</code>.</p>\n<p>Let&#39;s keep considering CommonJS modules and pointing which are their weak points that gradually lead to the adoption of a new syntax.</p>\n<h2 id=\"module-encapsulation\">Module encapsulation</h2>\n<p>Networks protocols currently available in browsers penalize performance when several module files are required. Packing all modules in one file to be used in browser is a good practice. This necessitie does not exist in platforms like Node.js, that have quick access to the filesystem.</p>\n<p>CommonJS modules does not consider browser environment and another prove is that different modules can&#39;t be part of the same file. By the way, <a href=\"http://browserify.org\">Browserify</a> enables the use of CommonJS modules in browsers and allow multiple modules in a single file. This is only possible by making use of functions to encapsulate the code of each module. A problem is that the result is hard to read, <a href=\"https://gist.github.com/jcemer/b52db6503eebc42a414d\">look at the file bundler.js</a>.</p>\n<p>Nowadays the <strong>only way to define scope in Javascript is beyond functions</strong>. As said, a new specification allows changing the language functionality. The module scope definition could be better solved out than in <a href=\"https://github.com/joyent/node/blob/b55c9d68aa713e75ff5077cd425cbaafde010b92/src/node.js#L788-L791\">Node.js, which still uses functions under the hood</a>.</p>\n<p>ES6 specs brings a new exclusive syntax to define module scope. Throught syntax, it is possible to define more than one module in a single file without reaching out to functions that made us give up on AMD format. The result is a significative gain in expressivity:</p>\n<pre><code class=\"lang-javascript\">module &#39;foo&#39; {\n    // Module code\n}\nmodule &#39;bar&#39; {\n    // Module code\n}\n</code></pre>\n<h2 id=\"requesting-dependencies-imports-\">Requesting dependencies (imports)</h2>\n<p>CommonJS modules were conceived to require dependencies synchronously. <strong>Script execution is blocked while a dependency is loaded</strong>. Again, this approach does not bring any inconvenient to Node.js that has quick access to the filesystem.</p>\n<p>Considering network protocol evolution and even thinking on present days, a module format which fit to browsers needs to operate by loading async dependencies. For this, modules need to be <a href=\"http://en.wikipedia.org/wiki/Static_program_analysis\">statically analised</a> to <strong>identify its dependencies before being executed</strong>. By this way, it&#39;s possible to download dependencies simultaneously and evaluate the module only when dependencies are ready.</p>\n<p><strong>The module formats that we have nowadays does not allow static analysis</strong>. Getting as an example the CommonJS module format, its <a href=\"http://wiki.commonjs.org/wiki/Modules/1.0\">specification points</a> that the <code>require</code> is just a function that accepts a module identifier. Like any other function, its argument might be evaluated in different ways. Analise the code bellow that suffers by its random argument evaluation and the influence of control flow too:</p>\n<pre><code class=\"lang-javascript\">if (type == &#39;me&#39;) {\n  var user = require(&#39;me&#39;);\n} else {\n  var user = require(&#39;module&#39; + Math.random());\n}\n</code></pre>\n<p>I hope that it proves that it is not possible to identify the dependencies in nowadays formats without code execution. Tools like Browserify <a href=\"https://github.com/substack/node-browserify/issues/377\">doesn&#39;t convert modules that have dynamic dependencies</a> for example. That should cause confusion and break production code. Just with a specific syntax to require  modules is possible to prevent that code end up written like these.</p>\n<p>ES6 modules bring all the dependency declaration flexibility of the CommonJS modules allowing static analises of the code:</p>\n<pre><code class=\"lang-javascript\">import asap from &#39;asap&#39;;\nimport { later } from &#39;asap&#39;;\nimport asap, { later } from &#39;asap&#39;;\n</code></pre>\n<p>According to a <a href=\"https://github.com/wycats/jsmodules/issues/8#issuecomment-47960446\">comment by Yehuda Katz</a>, it is not allowed to write code like <code>if (type == &#39;me&#39;) { import user from &#39;me&#39;; }</code>. However, the specification doesn&#39;t leave apart the possibility to require dynamic dependencies using promises:</p>\n<pre><code class=\"lang-javascript\">if (type == &#39;me&#39;) {\n  this.import(&#39;me&#39;).then(function(user) {\n    // do stuff here\n  });\n}\n</code></pre>\n<h2 id=\"code-export-exports-\">Code export (exports)</h2>\n<p>CommonJS module format allow export code through object properties of an object stored at the variable <code>exports</code>. The result of module evaluation is just an object with properties. Node.js implementation also allows overwriting the default returned value to others types like functions, look at the <code>foo</code> module example:</p>\n<pre><code class=\"lang-javascript\">module.exports = exports = function defaultFn() {\n  return &#39;default&#39;;\n};\n\nexports.another = function () { return &#39;another&#39;; };\n</code></pre>\n<p>The above code should be required like <code>require(&#39;foo&#39;)()</code> and <code>require(&#39;foo&#39;).another()</code>. The side-effect of this approach is the addition of properties in the function object <code>defaultFn</code>.</p>\n<p>Using the new syntax, it is possible to declare a value to be required as default. In this case, the others exported values doesn&#39;t be assigned to properties of <code>defaultFn</code>. The code below is the translation to the new ES6 module syntax:</p>\n<pre><code class=\"lang-javascript\">export default function defaultFn() {\n  return &#39;default&#39;;\n};\n\nexport function another() { return &#39;another&#39;; };\n</code></pre>\n<h2 id=\"final-words\">Final words</h2>\n<p>The ES6 specification also defines a module loader that allows to require different module formats. This loader is outside the bounds of this article. The section <a href=\"https://gist.github.com/wycats/51c96e3adcdb3a68cbc3#the-compilation-pipeline\">The Compilation Pipeline</a> of the article ES6 Modules explains all features and possibilities of the loader.</p>\n<p>I expect that this article has convinced you of the superiority of the new syntax against other module formats. A new syntax adds a toll to learn its use. But in this case, the gain of expressiveness and possibilites compensates that.</p>\n<p>The new module syntax mastery takes into account all the different JavaScript used environments: web server, desktop, command line and browsers. The modules substantially change the language operation and are undoubtedly the best new feature.</p>\n",
        "file": "./src/posts/a-new-syntax-for-modules-in-es6.md",
        "filename": "a-new-syntax-for-modules-in-es6",
        "link": "2014/07/a-new-syntax-for-modules-in-es6",
        "lang": "en",
        "default_lang": false
      }, {
        "layout": "post",
        "title": "ES6 interview with David Herman",
        "date": "2014-07-04T01:08:30.242Z",
        "comments": "true",
        "published": "true",
        "keywords": "ES6",
        "description": "Interview with David Herman about ES6",
        "categories": ["ES6", " Interview"],
        "content": "<p>We did a nice interview with <a href=\"https://twitter.com/littlecalculist\">David Herman</a> about his thoughts about ES6.\nDavid is the principal researcher and founder of Mozilla Research, where he works to expand the foundations of the Open Web. He participates in a number of Web platform projects, including: <a href=\"http://taskjs.org/\">task.js</a>, <a href=\"http://sweetjs.org/\">sweet.js</a>, <a href=\"http://asmjs.org/\">asm.js</a>, <a href=\"http://www.rust-lang.org/\">Rust</a>, <a href=\"https://github.com/mozilla/servo/\">Servo</a> and Parallel JS.</p>\n",
        "file": "./src/posts/es6-interview-with-david-herman.md",
        "filename": "es6-interview-with-david-herman",
        "link": "2014/07/es6-interview-with-david-herman",
        "lang": "en",
        "default_lang": false
      }, {
        "layout": "post",
        "title": "Practical Workflows for ES6 Modules, Fluent 2014",
        "date": "2014-05-27T07:18:47.847Z",
        "comments": "true",
        "published": "true",
        "keywords": "JavaScript, ES6, modules",
        "description": "Post about modules",
        "categories": ["modules", " talks"],
        "authorName": "Jaydson",
        "authorLink": "http://twitter.com/jaydson",
        "authorDescription": "JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "authorPicture": "https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg",
        "content": "<p><a href=\"https://twitter.com/guybedford\">Guy Bedford</a> gave an awesome talk about a practical workflows with ES6 modules last month at Fluent Conf.<br>Also, he write up an article about it. If you are interested on this subject, you must read the full article.  </p>\n",
        "file": "./src/posts/practical-workflows-es6-modules.md",
        "filename": "practical-workflows-es6-modules",
        "link": "2014/07/practical-workflows-es6-modules",
        "lang": "en",
        "default_lang": false
      }, {
        "layout": "post",
        "title": "ECMAScript 6 - A Better JavaScript for the Ambient Computing Era",
        "date": "2014-05-27T06:18:47.847Z",
        "comments": "true",
        "published": "true",
        "keywords": "JavaScript, ES6, talks",
        "description": "talk about es6",
        "categories": ["talks"],
        "authorName": "Jaydson",
        "authorLink": "http://twitter.com/jaydson",
        "authorDescription": "JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "authorPicture": "https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg",
        "content": "<p>Allen Wirfs-Brock (<a href=\"https://twitter.com/awbjs\">awbjs</a> on Twitter) is a TC39 member. Actually, he is the &quot;Project Editor of the ECMAScript Language Specification&quot;.</p>\n",
        "file": "./src/posts/ecmascript-6-a-better-javascript-for-the-ambient-computing-era.md",
        "filename": "ecmascript-6-a-better-javascript-for-the-ambient-computing-era",
        "link": "2014/07/ecmascript-6-a-better-javascript-for-the-ambient-computing-era",
        "lang": "en",
        "default_lang": false
      }, {
        "layout": "post",
        "title": "ECMAScript 6 - The future is here",
        "date": "2014-05-27T05:18:47.847Z",
        "comments": "true",
        "published": "true",
        "keywords": "JavaScript, ES6, talks",
        "description": "talk about es6",
        "categories": ["talks"],
        "authorName": "Jaydson",
        "authorLink": "http://twitter.com/jaydson",
        "authorDescription": "JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "authorPicture": "https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg",
        "content": "<p>A talk by <a href=\"https://twitter.com/sebarmeli\">Sebastiano Armeli</a> showing some of the ES6 features like scoping, generators, collections, modules and proxies.</p>\n",
        "file": "./src/posts/ecmascript-6-the-future-is-here.md",
        "filename": "ecmascript-6-the-future-is-here",
        "link": "2014/07/ecmascript-6-the-future-is-here",
        "lang": "en",
        "default_lang": false
      }, {
        "layout": "post",
        "title": "Hello World",
        "date": "2014-05-17T08:18:47.847Z",
        "comments": "true",
        "published": "true",
        "keywords": "JavaScript, ES6",
        "description": "Hello world post",
        "categories": ["JavaScript", " ES6"],
        "authorName": "Jaydson",
        "authorLink": "http://twitter.com/jaydson",
        "authorDescription": "JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "authorPicture": "https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg",
        "content": "<p>Hello everybody, welcome to ES6Rocks!<br>The mission here is to discuss about <a href=\"http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts\">JavaScript&#39;s next version</a> , aka Harmony or ES.next.  </p>\n",
        "file": "./src/posts/hello-world.md",
        "filename": "hello-world",
        "link": "2014/07/hello-world",
        "lang": "en",
        "default_lang": false
      }],
      "pt-br": [{
        "layout": "post",
        "title": "Uma nova sintaxe para módulos na ES6",
        "date": "2014-07-11T07:18:47.847Z",
        "comments": "true",
        "published": "true",
        "keywords": "JavaScript, ES6, modules",
        "description": "Post about module syntax",
        "categories": ["modules"],
        "authorName": "Jean Carlo Emer",
        "authorLink": "http://twitter.com/jcemer",
        "authorDescription": "Internet craftsman, computer scientist and speaker. I am a full-stack web developer for some time and only write code that solves real problems.",
        "authorPicture": "https://avatars2.githubusercontent.com/u/353504?s=460",
        "content": "<p>O grupo TC39 - ECMAScript já está finalizando a sexta versão da especificação do ECMAScript. A <a href=\"http://www.2ality.com/2014/06/es6-schedule.html\">agenda do grupo</a> aponta o mês de junho do próximo ano como sendo a data de lançamento. A partir de agora, poucas mudanças significativas devem surgir. Já é tempo de se aprofundar no estudo.</p>\n<p>Este artigo não pretende abordar a importância da escrita de código modularizado. Já escrevi sobre o assunto no artigo <a href=\"http://tableless.com.br/modularizacao-em-javascript\">Modularização em JavaScript</a>. Sites como <a href=\"http://jsmodules.io\">JavaScript Modules</a> entre outros já são uma ótima referência sobre como escrever módulos ES6. A intenção aqui é esclarecer e justificar a necessidade de uma nova sintaxe para escrita de módulos.</p>\n<h2 id=\"formatos-atuais\">Formatos atuais</h2>\n<p>Os mais famosos formatos de definição de módulos até então eram o AMD, padrão para bibliotecas <em>client-side</em> e CommonJS, adotado pelo Node.js e levado para  navegadores pelo Browserify. Cada um  possui características determinadas pelo ecossistema em que são utilizados. A exemplo, o AMD encapsula cada módulo no interior de uma função definindo escopo e permitindo carregamento assíncrono de suas dependências nos navegadores. Por outro lado, os módulos CommonJS implicitamente definem a criação de um escopo de módulo o que inviabiliza seu uso diretamente em navegadores.</p>\n<h2 id=\"a-escolha-de-um-formato\">A escolha de um formato</h2>\n<p>As bibliotecas são as que mais sofrem com a existência de diferentes formatos. A inconsistência pode ser normalizada com uma abstração que encapsula os módulos  e os torna funcionais em mais de um formato. O projeto <a href=\"https://github.com/umdjs/umd\">Universal Module Definition (UMD)</a> guarda uma coleção destas abstrações.</p>\n<p>Acompanhando a evolução e observando o surgimento desta unificação, o problema de modularização parece resolvido. Engano. O projeto UMD guarda mais de dez variações de abstrações e todas desviam o código do módulo do seu objetivo: resolver o problema que é responsável. Observe o exemplo fictício do módulo UMD <code>add2</code> que depende de <code>add</code>:</p>\n<pre><code class=\"lang-javascript\">(function (factory) {\n  if (typeof define === &#39;function&#39; &amp;&amp; define.amd) {\n    define([&#39;add&#39;], factory);\n  } else if (typeof exports === &#39;object&#39;) {\n    module.exports = factory(require(&#39;add&#39;));\n  }\n}(function (add) {\n  return function (param) {\n    return add(2, param);\n  };\n}));\n</code></pre>\n<p>Seguir escrevendo código para dois formatos (ou mais) seguindo o UMD não é uma boa opção. Por que não jogar <a href=\"http://mapadobrincar.folha.com.br/brincadeiras/formulas-de-escolha/320-dois-ou-um\">dois ou um</a> entre os membros do TC39 e escolher um único formato? Melhor analisar cada um dos formatos e identificar qual é mais poderoso em termos de expressividade.</p>\n<h3 id=\"analisando-os-formatos-atuais\">Analisando os formatos atuais</h3>\n<p>No formato AMD, encapsular o código do módulo em uma função trata-se de um contra tempo que não traz ganho algum em expressividade. A função faz parte de outro universo de resolução de problemas. Uma nova especificação poderia muito bem considerar que cada arquivo de módulo já possui seu próprio escopo, lembre-se que é uma nova versão da linguagem. Não nos restaria <a href=\"http://blog.millermedeiros.com/amd-is-better-for-the-web-than-commonjs-modules\">nenhuma razão para adotar AMD</a>.</p>\n<p>Os CommonJS Modules são mais expressivos. Trata-se de uma grande vantagem deixar de lado o encapsulamento através de funções e ainda poder indicar qual porção de código da dependência será utilizado já na sua importação <code>var debug = require(&#39;util&#39;).debug;</code> ou até já utilizar o código <code>require(&#39;util&#39;).debug(&#39;message on stderr&#39;);</code>.</p>\n<p>Seguiremos considerando os módulos CommonJS e apontando quais seus pontos fracos que levaram gradativamente a adoção de uma nova sintaxe.</p>\n<h2 id=\"encapsulamento-para-m-dulos\">Encapsulamento para módulos</h2>\n<p>Os protocolos de rede disponíveis atualmente nos navegadores penalizam a performance para o caso de vários arquivos de módulo serem requisitados. Empacotar todos os módulos em um único arquivo para serem utilizados no navegador é uma boa prática. Esta necessidade não existe em plataformas como Node.js, que possui rápido acesso ao sistema de arquivos.</p>\n<p>Os módulos CommonJS não consideram o ambiente dos navegadores, diferentes módulos não podem fazer parte de um mesmo arquivo. A ferramenta <a href=\"http://browserify.org\">Browserify</a> viabiliza o uso de módulos <em>CommonJS</em> em navegadores. Isto somente é possível fazendo uso de funções para encapsular o código de cada um dos módulos. O resultado é de difícil leitura, <a href=\"https://gist.github.com/jcemer/b52db6503eebc42a414d\">veja o arquivo bundler.js</a>.</p>\n<p>Atualmente, a <strong>única maneira de definir escopos no JavaScript é através de funções</strong>. Uma nova especificação permite mudar o funcionamento da linguagem. A necessária criação dos escopos poderia ser melhor resolvida que no <a href=\"https://github.com/joyent/node/blob/b55c9d68aa713e75ff5077cd425cbaafde010b92/src/node.js#L788-L791\">Node.js que ainda utiliza funções por baixo dos panos</a>.</p>\n<p>A especificação ES6 traz consigo uma sintaxe exclusiva para definição de escopo de módulos. Através da sintaxe, é possível definir mais de um módulo em um mesmo arquivo sem apelar para o uso de funções que nos fizeram abrir mão do formato AMD. O resultado é um ganho significativo em expressividade, observe:</p>\n<pre><code class=\"lang-javascript\">module &#39;foo&#39; {\n    // Module code\n}\nmodule &#39;bar&#39; {\n    // Module code\n}\n</code></pre>\n<h2 id=\"requisi-o-de-depend-ncias-imports-\">Requisição de dependências (imports)</h2>\n<p>Os módulos CommonJS foram concebidos para requisitar as dependências sincronamente. <strong>A execução do script é bloqueada enquanto uma dependência é carregada</strong>. Novamente, esta abordagem não traz nenhum inconveniente para o Node.js que possui um acesso rápido ao sistema de arquivos.</p>\n<p>Considerando evoluções futuras nos protocolos de redes e mesmo se pensarmos nos dias atuais, um formato de módulo adequado para navegadores precisa operar com carregamento assíncrono das dependências. Para isto, os módulos precisam ser <a href=\"http://en.wikipedia.org/wiki/Static_program_analysis\">analisados estaticamente</a> a título de <strong>identificar suas dependências antes de serem executados</strong>. Assim é possível fazer o <em>download</em> simultâneo das dependências e condicionar a execução do módulo para quando as dependências estiverem prontas.</p>\n<p><strong>Os formatos de módulos que dispomos não permitem análise estática</strong>. Pegando como exemplo o formato CommonJS, <a href=\"http://wiki.commonjs.org/wiki/Modules/1.0\">sua especificação esclarece</a> que o <code>require</code> trata-se de uma função que aceita um identificador de módulo. Assim como qualquer outra função, seu argumento pode ser calculado de diferentes maneiras. Analise o código a seguir que também sofre a influência do controle de fluxo:</p>\n<pre><code class=\"lang-javascript\">if (type == &#39;me&#39;) {\n  var user = require(&#39;me&#39;);\n} else {\n  var user = require(&#39;module&#39; + Math.random());\n}\n</code></pre>\n<p>Espero que isto já sirva para atestar como não é possível identificar as dependências nestes formatos sem que o código seja executado. Ferramentas como o Browserify <a href=\"https://github.com/substack/node-browserify/issues/377\">já não convertem módulos que tenham dependências dinâmicas</a> causando uma certa confusão. Apenas com uma sintaxe específica é possível coibir declarações de dependências como estas.</p>\n<p>Os módulos ES6 trazem consigo toda a flexibilidade de declaração de dependências dos módulos CommonJS permitindo a análise estática do código:</p>\n<pre><code class=\"lang-javascript\">import asap from &#39;asap&#39;;\nimport { later } from &#39;asap&#39;;\nimport asap, { later } from &#39;asap&#39;;\n</code></pre>\n<p>Como apontado em <a href=\"https://github.com/wycats/jsmodules/issues/8#issuecomment-47960446\">um comentário do Yehuda Katz</a>, não são permitidos códigos como este <code>if (type == &#39;me&#39;) { import user from &#39;me&#39;; }</code>. Entretanto, a especificação não deixa de fora a possibilidade de executar requisições dinâmicas utilizando promessas:</p>\n<pre><code class=\"lang-javascript\">if (type == &#39;me&#39;) {\n  this.import(&#39;me&#39;).then(function(user) {\n    // do stuff here\n  });\n}\n</code></pre>\n<h2 id=\"exportando-c-digo-exports-\">Exportando código (exports)</h2>\n<p>O formato CommonJS permite exportar código através de propriedades no objeto contido na variável <code>exports</code>. O retorno de um módulo é um objeto com propriedades. Uma variação na implementação do Node.js possibilita que módulos retornem <em>por padrão</em> outros tipos de valores, observe o módulo <code>foo</code>:</p>\n<pre><code class=\"lang-javascript\">module.exports = exports = function defaultFn() {\n  return &#39;default&#39;;\n};\n\nexports.another = function () { return &#39;another&#39;; };\n</code></pre>\n<p>O código acima permite executar <code>require(&#39;foo&#39;)()</code> e <code>require(&#39;foo&#39;).another()</code>. O efeito colateral desta abordagem é adicionar propriedades diretamente na função <code>defaultFn</code>.</p>\n<p>Utilizando a nova sintaxe, é possível declarar um retorno <em>padrão</em>. Os demais valores exportados não serão mais atribuídos na forma de propriedades na função <code>defaultFn</code>. Veja o mesmo exemplo transcrito:</p>\n<pre><code class=\"lang-javascript\">export default function defaultFn() {\n  return &#39;default&#39;;\n};\n\nexport function another() { return &#39;another&#39;; };\n</code></pre>\n<h2 id=\"palavras-finais\">Palavras finais</h2>\n<p>A especificação do ES6 também abrange a definição de um <em>loader</em> responsável por requisições assíncronas que ainda permite utilizar módulos em diferentes formatos. O assunto está fora do escopo deste artigo. A seção <a href=\"https://gist.github.com/wycats/51c96e3adcdb3a68cbc3#the-compilation-pipeline\">The Compilation Pipeline</a> do artigo ES6 Modules de Yehuda Katz apresenta muito bem as possibilidades.</p>\n<p>Espero que tenha convencido você da superioridade da nova sintaxe em relação a outros formatos de módulos. Claro que sintaxes trazem consigo o ônus do seu aprendizado. Mas neste caso, permitem ganho de expressividade e aumento das possibilidades.</p>\n<p>A nova sintaxe de módulos leva em consideração com maestria todos os diferentes ambientes em que a linguagem é utilizada: <em>web server</em>, <em>desktop</em>, linha de comando e navegadores. Os módulos alteram significativamente o funcionamento da linguagem e são sem dúvida o melhor da nova especificação.</p>\n",
        "file": "./src/posts/a-new-syntax-for-modules-in-es6.md",
        "filename": "a-new-syntax-for-modules-in-es6",
        "link": "pt-br/2014/07/a-new-syntax-for-modules-in-es6",
        "lang": "pt-br",
        "default_lang": true
      }, {
        "layout": "post",
        "title": "Entrevista sobre ES6 com o David Herman",
        "date": "2014-07-04T01:08:30.242Z",
        "comments": "true",
        "published": "true",
        "keywords": "ES6",
        "description": "Entrevista feita com David Herman sobre ES6",
        "categories": ["ES6", " Interview"],
        "content": "<p>Fizemos uma entrevista bem legal com o <a href=\"https://twitter.com/littlecalculist\">David Herman</a> sobre ES6.<br>Para quem não conhece, o David é o principal pesquisador e fundador da Mozilla Research, onde ele trabalha para expandir as fundações da Open Web. Ele está envolvido com diversos projetos de plataformas Web, incluindo <a href=\"http://taskjs.org/\">task.js</a>, <a href=\"http://sweetjs.org/\">sweet.js</a>, <a href=\"http://asmjs.org/\">asm.js</a>, <a href=\"http://www.rust-lang.org/\">Rust</a>, <a href=\"https://github.com/mozilla/servo/\">Servo</a> e Parallel JS.  </p>\n",
        "file": "./src/posts/es6-interview-with-david-herman.md",
        "filename": "es6-interview-with-david-herman",
        "link": "pt-br/2014/07/es6-interview-with-david-herman",
        "lang": "pt-br",
        "default_lang": true
      }, {
        "layout": "post",
        "title": "Workflows para os módulos da ES6, Fluent 2014",
        "date": "2014-05-27T07:18:47.847Z",
        "comments": "true",
        "published": "true",
        "keywords": "JavaScript, ES6, modules",
        "description": "Post sobre módulos",
        "categories": ["modules", " talks"],
        "authorName": "Jaydson",
        "authorLink": "http://twitter.com/jaydson",
        "authorDescription": "JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "authorPicture": "https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg",
        "content": "<p>O <a href=\"https://twitter.com/guybedford\">Guy Bedford</a> deu um palestra incrível sobre workflows com módulos ES6 no último mês na Fluent Conf.\nEle também escreveu um artigo sonre isso. Se você está interessado neste assunto, você deve ler o artigo por completo.</p>\n",
        "file": "./src/posts/practical-workflows-es6-modules.md",
        "filename": "practical-workflows-es6-modules",
        "link": "pt-br/2014/07/practical-workflows-es6-modules",
        "lang": "pt-br",
        "default_lang": true
      }, {
        "layout": "post",
        "title": "ECMAScript 6 - Um melhor JavaScript para a Ambient Computing Era",
        "date": "2014-05-27T06:18:47.847Z",
        "comments": "true",
        "published": "true",
        "keywords": "JavaScript, ES6, talks",
        "description": "talk about es6",
        "categories": ["talks"],
        "authorName": "Jaydson",
        "authorLink": "http://twitter.com/jaydson",
        "authorDescription": "JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "authorPicture": "https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg",
        "content": "<p>Allen Wirfs-Brock (<a href=\"https://twitter.com/awbjs\">awbjs</a> no Twitter) é um membro do comitê TC39. Na verdade, ele é o &quot;Project Editor of the ECMAScript Language Specification&quot;, ou seja, editor chefe da ECMA.  </p>\n",
        "file": "./src/posts/ecmascript-6-a-better-javascript-for-the-ambient-computing-era.md",
        "filename": "ecmascript-6-a-better-javascript-for-the-ambient-computing-era",
        "link": "pt-br/2014/07/ecmascript-6-a-better-javascript-for-the-ambient-computing-era",
        "lang": "pt-br",
        "default_lang": true
      }, {
        "layout": "post",
        "title": "ECMAScript 6 - O futuro está aqui",
        "date": "2014-05-27T05:18:47.847Z",
        "comments": "true",
        "published": "true",
        "keywords": "JavaScript, ES6, talks",
        "description": "talk about es6",
        "categories": ["talks"],
        "authorName": "Jaydson",
        "authorLink": "http://twitter.com/jaydson",
        "authorDescription": "JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "authorPicture": "https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg",
        "content": "<p>Uma palestra do <a href=\"https://twitter.com/sebarmeli\">Sebastiano Armeli</a> mostrando algumas features da ES6 como scoping, generators, collections, modules and proxies.  </p>\n",
        "file": "./src/posts/ecmascript-6-the-future-is-here.md",
        "filename": "ecmascript-6-the-future-is-here",
        "link": "pt-br/2014/07/ecmascript-6-the-future-is-here",
        "lang": "pt-br",
        "default_lang": true
      }, {
        "layout": "post",
        "title": "Hello World",
        "date": "2014-05-17T08:18:47.847Z",
        "comments": "true",
        "published": "true",
        "keywords": "JavaScript, ES6",
        "description": "Hello world post",
        "categories": ["JavaScript", " ES6"],
        "authorName": "Jaydson",
        "authorLink": "http://twitter.com/jaydson",
        "authorDescription": "JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "authorPicture": "https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg",
        "content": "<p>Olá pessoal, bem-vindos ao ES6Rocks!\nNossa missão aqui é discutir sobre a <a href=\"http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts\">a nova versão do JavaScript</a>, mais conhecida como Harmony ou ES.next.</p>\n",
        "file": "./src/posts/hello-world.md",
        "filename": "hello-world",
        "link": "pt-br/2014/07/hello-world",
        "lang": "pt-br",
        "default_lang": true
      }]
    };
  }
}, {});

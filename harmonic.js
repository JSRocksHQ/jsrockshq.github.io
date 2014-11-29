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
        $defineProperty(this, symbolDataProperty, {
            value: this
        });
        $defineProperty(this, symbolInternalProperty, {
            value: key
        });
        $defineProperty(this, symbolDescriptionProperty, {
            value: description
        });
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
            $defineProperty(object, name, {
                enumerable: false
            });
        return value;
    }
    function defineProperty(object, name, descriptor) {
        if (isSymbol(name)) {
            if (descriptor.enumerable) {
                descriptor = $create(descriptor, {
                    enumerable: {
                        value: false
                    }
                });
            }
            name = name[symbolInternalProperty];
        }
        $defineProperty(object, name, descriptor);
        return object;
    }
    function polyfillObject(Object) {
        $defineProperty(Object, 'defineProperty', {
            value: defineProperty
        });
        $defineProperty(Object, 'getOwnPropertyNames', {
            value: getOwnPropertyNames
        });
        $defineProperty(Object, 'getOwnPropertyDescriptor', {
            value: getOwnPropertyDescriptor
        });
        $defineProperty(Object.prototype, 'hasOwnProperty', {
            value: hasOwnProperty
        });
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
                return descriptor.get.call(self);else if ('value' in descriptor)return descriptor.value
            ;
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
                this.tryStack_.push({
                    catch: catchState
                });
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
    ($traceurRuntime.createClass)(UncoatedModuleInstantiator, {
        getUncoatedModule: function() {
            if (this.value_)
                return this.value_;
            return this.value_ = this.func.call(global);
        }
    }, {}, UncoatedModuleEntry);
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
    ModuleStore.set('@traceur/src/runtime/ModuleStore', new Module({
        ModuleStore: ModuleStore
    }));
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
        observer.observe(node, {
            characterData: true
        });
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
    return {
        get default() {
            return $__default;
        }
    };
});
System.register("traceur-runtime@0.0.25/src/runtime/polyfills/Promise", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.25/src/runtime/polyfills/Promise";
    var async = $traceurRuntime.getModuleImpl("traceur-runtime@0.0.25/node_modules/rsvp/lib/rsvp/asap").default;
    function isPromise(x) {
        return x && typeof x === 'object' && x.status_ !== undefined;
    }
    function chain(promise) {
        var onResolve = arguments[1] !== (void0) ? arguments[1] : (function(x) {
                return x;
            });
        var onReject = arguments[2] !== (void0) ? arguments[2] : (function(e) {
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
            var onResolve = arguments[0] !== (void0) ? arguments[0] : (function(x) {
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
                    throw new TypeError;else if (isPromise(y))chain(y, deferred.resolve, deferred.reject)
                    ;
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
    return {
        get Promise() {
            return Promise;
        }
    };
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
      "domain": "http://es6rocks.com",
      "subtitle": "Powered by Harmonic",
      "author": "ES6 Rocks",
      "description": "A website dedicated to teach all about ES6",
      "bio": "Thats me",
      "template": "2.0",
      "preprocessor": "stylus",
      "posts_permalink": ":language/:year/:month/:title",
      "pages_permalink": "pages/:title",
      "header_tokens": ["<!--", "-->"],
      "index_posts": 20,
      "i18n": {
        "default": "en",
        "languages": ["en", "pt-br", "cn"]
      }
    };
  },
  getPosts: function() {
    return {
      "en": [{
        "layout": "post",
        "title": "ES6 modules today with 6to5",
        "date": "2014-10-28T12:49:54.528Z",
        "comments": "true",
        "published": "true",
        "keywords": "ES6, modules, 6to5",
        "description": "A tutorial about using ES6 modules today with 6to5",
        "categories": ["Modules", " Tutorial"],
        "authorName": "Jaydson Gomes",
        "authorLink": "http://twitter.com/jaydson",
        "image": "http://www.gravatar.com/avatar/572696200604e59baa59ee90d61f7d02.png",
        "content": "<p>I&#39;ve posted the image below on <a href=\"https://twitter.com/jaydson/status/526882798263881730\">Twitter</a> showing how happy I was.  </p>\n",
        "file": "./src/posts/es6-modules-today-with-6to5.md",
        "filename": "es6-modules-today-with-6to5",
        "link": "2014/10/es6-modules-today-with-6to5",
        "lang": "en",
        "default_lang": false
      }, {
        "layout": "post",
        "title": "JavaScript ♥  Unicode",
        "date": "2014-10-13T19:22:32.267Z",
        "comments": "true",
        "published": "true",
        "keywords": "ES6, Unicode",
        "description": "Mathias Bynens talking about Unicode in JavaScript",
        "categories": ["Unicode", " Videos"],
        "authorName": "Jaydson Gomes",
        "authorLink": "http://twitter.com/jaydson",
        "image": "http://www.gravatar.com/avatar/572696200604e59baa59ee90d61f7d02.png",
        "content": "<p>Mathias Bynens gave an awesome talk in the last <a href=\"http://2014.jsconf.eu\">JSConfEU</a> edition.  </p>\n",
        "file": "./src/posts/javascript-unicode.md",
        "filename": "javascript-unicode",
        "link": "2014/10/javascript-unicode",
        "lang": "en",
        "default_lang": false
      }, {
        "layout": "post",
        "title": "Arrow Functions and their scope",
        "date": "2014-10-01T04:01:41.369Z",
        "comments": "true",
        "published": "true",
        "keywords": "arrow functions, es6, escope",
        "description": "Read about arrow functions in ES6, and their scopes.",
        "categories": ["scope", " articles", " basics"],
        "authorName": "Felipe N. Moura",
        "authorLink": "http://twitter.com/felipenmoura",
        "authorDescription": "FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "image": "https://avatars0.githubusercontent.com/u/347387?v=3&s=100",
        "content": "<p>Among so many great new features in ES6, Arrow Functions (or Fat Arrow Functions) is one that deserves attention!</p>\n",
        "file": "./src/posts/arrow-functions-and-their-scope.md",
        "filename": "arrow-functions-and-their-scope",
        "link": "2014/10/arrow-functions-and-their-scope",
        "lang": "en",
        "default_lang": false
      }, {
        "layout": "post",
        "title": "What's next for JavaScript",
        "date": "2014-08-29T03:04:03.666Z",
        "comments": "true",
        "published": "true",
        "keywords": "talks",
        "description": "A talk by Dr. Axel Rauschmayer about what's next for JavaScript",
        "categories": ["talks", " videos"],
        "authorName": "Jaydson",
        "authorLink": "http://twitter.com/jaydson",
        "image": "http://www.gravatar.com/avatar/572696200604e59baa59ee90d61f7d02.png",
        "content": "<p>If you&#39;re interested in ES6 you must follow <a href=\"https://twitter.com/rauschma\">Dr. Axel Rauschmayer</a>.  </p>\n",
        "file": "./src/posts/what-is-next-for-javascript.md",
        "filename": "what-is-next-for-javascript",
        "link": "2014/08/what-is-next-for-javascript",
        "lang": "en",
        "default_lang": false
      }, {
        "layout": "post",
        "title": "What you need to know about block scope - let",
        "date": "2014-08-28T01:58:23.465Z",
        "comments": "true",
        "published": "true",
        "keywords": "",
        "description": "An introduction to block scope on ES6",
        "categories": ["scope", " articles", " basics"],
        "authorName": "Jaydson",
        "authorLink": "http://twitter.com/jaydson",
        "authorDescription": "JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "image": "http://www.gravatar.com/avatar/572696200604e59baa59ee90d61f7d02.png",
        "content": "",
        "file": "./src/posts/what-you-need-to-know-about-block-scope-let.md",
        "filename": "what-you-need-to-know-about-block-scope-let",
        "link": "2014/08/what-you-need-to-know-about-block-scope-let",
        "lang": "en",
        "default_lang": false
      }, {
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
        "image": "https://avatars1.githubusercontent.com/u/353504?v=3&s=100",
        "authorDescription": "Internet craftsman, computer scientist and speaker. I am a full-stack web developer for some time and only write code that solves real problems.",
        "authorPicture": "https://avatars2.githubusercontent.com/u/353504?s=460",
        "content": "<p>TC39 - ECMAScript group is finishing the sixth version of the ECMAScript specification. The <a href=\"http://www.2ality.com/2014/06/es6-schedule.html\">group schedule</a> points to next June as the release date.</p>\n",
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
        "authorName": "Jaydson",
        "authorLink": "http://twitter.com/jaydson",
        "image": "http://www.gravatar.com/avatar/572696200604e59baa59ee90d61f7d02.png",
        "authorDescription": "JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "authorPicture": "https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg",
        "content": "<p>We did a nice interview with <a href=\"https://twitter.com/littlecalculist\">David Herman</a> about his thoughts about ES6.</p>\n",
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
        "image": "http://www.gravatar.com/avatar/572696200604e59baa59ee90d61f7d02.png",
        "authorDescription": "JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "authorPicture": "https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg",
        "content": "",
        "file": "./src/posts/practical-workflows-es6-modules.md",
        "filename": "practical-workflows-es6-modules",
        "link": "2014/05/practical-workflows-es6-modules",
        "lang": "en",
        "default_lang": false
      }, {
        "layout": "post",
        "title": "A Better JavaScript for the Ambient Computing Era",
        "date": "2014-05-27T06:18:47.847Z",
        "comments": "true",
        "published": "true",
        "keywords": "JavaScript, ES6, talks",
        "description": "talk about es6",
        "categories": ["talks", " videos"],
        "authorName": "Jaydson",
        "authorLink": "http://twitter.com/jaydson",
        "image": "http://www.gravatar.com/avatar/572696200604e59baa59ee90d61f7d02.png",
        "authorDescription": "JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "authorPicture": "https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg",
        "content": "",
        "file": "./src/posts/ecmascript-6-a-better-javascript-for-the-ambient-computing-era.md",
        "filename": "ecmascript-6-a-better-javascript-for-the-ambient-computing-era",
        "link": "2014/05/ecmascript-6-a-better-javascript-for-the-ambient-computing-era",
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
        "image": "http://www.gravatar.com/avatar/572696200604e59baa59ee90d61f7d02.png",
        "authorDescription": "JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "authorPicture": "https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg",
        "content": "",
        "file": "./src/posts/ecmascript-6-the-future-is-here.md",
        "filename": "ecmascript-6-the-future-is-here",
        "link": "2014/05/ecmascript-6-the-future-is-here",
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
        "image": "http://www.gravatar.com/avatar/572696200604e59baa59ee90d61f7d02.png",
        "authorDescription": "JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "authorPicture": "https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg",
        "content": "<p>Hello everybody, welcome to ES6Rocks!<br>The mission here is to discuss about <a href=\"http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts\">JavaScript&#39;s next version</a> , aka Harmony or ES.next.  </p>\n",
        "file": "./src/posts/hello-world.md",
        "filename": "hello-world",
        "link": "2014/05/hello-world",
        "lang": "en",
        "default_lang": false
      }],
      "pt-br": [{
        "layout": "post",
        "title": "ES6: Brincando com o novo Javascript",
        "date": "2014-11-13T23:30:23.830Z",
        "comments": "true",
        "published": "true",
        "keywords": "ES6, 6to5, Javascript",
        "description": "Como estudar e aprender ES6 criando experimentos e testes",
        "categories": ["Articles"],
        "authorName": "Pedro Nauck",
        "authorLink": "http://twitter.com/pedronauck",
        "image": "https://avatars0.githubusercontent.com/u/2029172?v=3&s=160",
        "content": "",
        "file": "./src/posts/es6-playing-with-the-new-javascript.md",
        "filename": "es6-playing-with-the-new-javascript",
        "link": "pt-br/2014/11/es6-playing-with-the-new-javascript",
        "lang": "pt-br",
        "default_lang": true
      }, {
        "layout": "post",
        "title": "Módulos ES6 hoje com o 6to5",
        "date": "2014-10-28T12:49:54.528Z",
        "comments": "true",
        "published": "true",
        "keywords": "ES6, modules, 6to5",
        "description": "Um tutorial sobre o uso de módulos ES6 hoje com o 6to5",
        "categories": ["Modules", " Tutorial"],
        "authorName": "Jaydson Gomes",
        "authorLink": "http://twitter.com/jaydson",
        "image": "http://www.gravatar.com/avatar/572696200604e59baa59ee90d61f7d02.png",
        "content": "",
        "file": "./src/posts/es6-modules-today-with-6to5.md",
        "filename": "es6-modules-today-with-6to5",
        "link": "pt-br/2014/10/es6-modules-today-with-6to5",
        "lang": "pt-br",
        "default_lang": true
      }, {
        "layout": "post",
        "title": "JavaScript ♥  Unicode",
        "date": "2014-10-13T19:22:32.267Z",
        "comments": "true",
        "published": "true",
        "keywords": "ES6, Unicode",
        "description": "Mathias Bynens talking about Unicode in JavaScript",
        "categories": ["Unicode", " Videos"],
        "authorName": "Jaydson Gomes",
        "authorLink": "http://twitter.com/jaydson",
        "image": "http://www.gravatar.com/avatar/572696200604e59baa59ee90d61f7d02.png",
        "content": "",
        "file": "./src/posts/javascript-unicode.md",
        "filename": "javascript-unicode",
        "link": "pt-br/2014/10/javascript-unicode",
        "lang": "pt-br",
        "default_lang": true
      }, {
        "layout": "post",
        "title": "Arrow Functions and their scope",
        "date": "2014-10-01T04:01:41.369Z",
        "comments": "true",
        "published": "true",
        "keywords": "arrow functions, es6, escope",
        "description": "Read about arrow functions in ES6, and their scopes.",
        "categories": ["scope", " articles", " basics"],
        "authorName": "Felipe N. Moura",
        "authorLink": "http://twitter.com/felipenmoura",
        "authorDescription": "FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "image": "https://avatars0.githubusercontent.com/u/347387?v=3&s=100",
        "content": "",
        "file": "./src/posts/arrow-functions-and-their-scope.md",
        "filename": "arrow-functions-and-their-scope",
        "link": "pt-br/2014/10/arrow-functions-and-their-scope",
        "lang": "pt-br",
        "default_lang": true
      }, {
        "layout": "post",
        "title": "O que podemos esperar do novo JavaScript",
        "date": "2014-08-29T03:04:03.666Z",
        "comments": "true",
        "published": "true",
        "keywords": "talks",
        "description": "Slides da palestra do Dr. Axel Rauschmayer sobre o que podemos esperar da nova versão do JavaScript",
        "categories": ["talks", " videos"],
        "authorName": "Jaydson Gomes",
        "authorLink": "http://twitter.com/jaydson",
        "image": "http://www.gravatar.com/avatar/572696200604e59baa59ee90d61f7d02.png",
        "content": "",
        "file": "./src/posts/what-is-next-for-javascript.md",
        "filename": "what-is-next-for-javascript",
        "link": "pt-br/2014/08/what-is-next-for-javascript",
        "lang": "pt-br",
        "default_lang": true
      }, {
        "layout": "post",
        "title": "O que você precisa saber sobre block scope - let",
        "date": "2014-08-28T01:58:23.465Z",
        "comments": "true",
        "published": "true",
        "keywords": "",
        "description": "Uma introdução a block scope na ES6",
        "categories": ["scope", " articles", " basics"],
        "authorName": "Jaydson Gomes",
        "authorLink": "http://twitter.com/jaydson",
        "image": "http://www.gravatar.com/avatar/572696200604e59baa59ee90d61f7d02.png",
        "content": "",
        "file": "./src/posts/what-you-need-to-know-about-block-scope-let.md",
        "filename": "what-you-need-to-know-about-block-scope-let",
        "link": "pt-br/2014/08/what-you-need-to-know-about-block-scope-let",
        "lang": "pt-br",
        "default_lang": true
      }, {
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
        "image": "https://avatars1.githubusercontent.com/u/353504?v=3&s=100",
        "authorDescription": "Internet craftsman, computer scientist and speaker. I am a full-stack web developer for some time and only write code that solves real problems.",
        "authorPicture": "https://avatars2.githubusercontent.com/u/353504?s=460",
        "content": "",
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
        "authorName": "Jaydson Gomes",
        "authorLink": "http://twitter.com/jaydson",
        "image": "http://www.gravatar.com/avatar/572696200604e59baa59ee90d61f7d02.png",
        "content": "",
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
        "authorName": "Jaydson Gomes",
        "authorLink": "http://twitter.com/jaydson",
        "image": "http://www.gravatar.com/avatar/572696200604e59baa59ee90d61f7d02.png",
        "content": "",
        "file": "./src/posts/practical-workflows-es6-modules.md",
        "filename": "practical-workflows-es6-modules",
        "link": "pt-br/2014/05/practical-workflows-es6-modules",
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
        "categories": ["talks", " videos"],
        "authorName": "Jaydson Gomes",
        "authorLink": "http://twitter.com/jaydson",
        "image": "http://www.gravatar.com/avatar/572696200604e59baa59ee90d61f7d02.png",
        "content": "",
        "file": "./src/posts/ecmascript-6-a-better-javascript-for-the-ambient-computing-era.md",
        "filename": "ecmascript-6-a-better-javascript-for-the-ambient-computing-era",
        "link": "pt-br/2014/05/ecmascript-6-a-better-javascript-for-the-ambient-computing-era",
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
        "authorName": "Jaydson Gomes",
        "authorLink": "http://twitter.com/jaydson",
        "image": "http://www.gravatar.com/avatar/572696200604e59baa59ee90d61f7d02.png",
        "content": "",
        "file": "./src/posts/ecmascript-6-the-future-is-here.md",
        "filename": "ecmascript-6-the-future-is-here",
        "link": "pt-br/2014/05/ecmascript-6-the-future-is-here",
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
        "authorName": "Jaydson Gomes",
        "authorLink": "http://twitter.com/jaydson",
        "image": "http://www.gravatar.com/avatar/572696200604e59baa59ee90d61f7d02.png",
        "content": "",
        "file": "./src/posts/hello-world.md",
        "filename": "hello-world",
        "link": "pt-br/2014/05/hello-world",
        "lang": "pt-br",
        "default_lang": true
      }],
      "cn": [{
        "layout": "post",
        "title": "使用6to5，让今天就来写ES6的模块化开发!",
        "date": "2014-11-05T15:19:50.612Z",
        "comments": "true",
        "published": "true",
        "keywords": "ES6, modules, 6to5",
        "description": "使用基于Node.js的6to5，让支持ES5的环境也能使用ES6的模块化",
        "categories": ["Modules", " Tutorial"],
        "authorName": "Jaydson Gomes",
        "authorLink": "http://twitter.com/jaydson",
        "content": "<p>我之前在Twitter上发过一个照片，表达出我有多快乐，这像是一个时光机让我们可以穿梭到未来-ES6的时代！下面让我来展示如何使用6to5让今天就可以练手ES6的模块化。</p>\n<p><img src=\"/img/modules-today-6to5.png\" alt=\"使用6to5让今天就可以练手ES6的模块化\"></p>\n<h1 id=\"-\">第一步</h1>\n<p>如果你现在还不了解ES6的模块化开发，请在<a href=\"http://JSModules.io\">JSModules.io</a>上了解一下。我也推荐大家读一下@jcemer的文章<a href=\"http://es6rocks.com/2014/07/a-new-syntax-for-modules-in-es6/\">A new syntax for modules in ES6</a>，它涉及到了很多非常酷的关于JS模块化的东西。他可以指导我们使用6to5。总的来说，6to5能在支持ES5d的环境下提前尝试ES6 模块化开发的快感。\n6to5比其他降级工具有一下几个优势：</p>\n<ul>\n<li>可读性：你的格式化的代码尽可能的保留。</li>\n<li>可扩展性：有非常庞大的插件库和浏览器的支持。</li>\n<li>可调式性：因为支持source map，你可以方便的调试已经编译过后的代码</li>\n<li>高效率：直接转化为与ES相当的代码，不会增加额外的运行十几</li>\n</ul>\n<h1 id=\"-\">一起来写模块</h1>\n<p>让我们来尝试着写模块吧！\n我们的应用除了输出日志不会做其他事情，其主要的目的就是让你了解模块化如何工作和如何让你现有的环境使用ES6的模块化开发。\n基本的目录结构：</p>\n<pre><code>├── Gruntfile.js\n├── package.json\n└── src\n    ├── app.js\n    ├── modules\n    │   ├── bar.js\n    │   ├── baz.js\n    │   └── foo.js\n    └── sample\n        └── index.html\n</code></pre><p>app.js是主程序，包含了我们将要存储的模块化的目录\n下面是app.js的代码：</p>\n<pre><code class=\"lang-javascript\">import foo from &quot;./modules/foo&quot;;\nimport bar from &quot;./modules/bar&quot;;\n\nconsole.log(&#39;From module foo &gt;&gt;&gt; &#39;, foo);\nconsole.log(&#39;From module bar &gt;&gt;&gt; &#39;, bar);\n</code></pre>\n<p>以上代码非常简单，我们导入了foo模块和bar模块，然后分别打印出他们</p>\n<pre><code class=\"lang-javascript\">// foo.js\nlet foo = &#39;foo&#39;;\n\nexport default foo;\n\n\n// bar.js\nlet bar = &#39;bar&#39;;\n\nexport default bar;\n</code></pre>\n<p>在这些模块一面我们只是导出了两个字符串&#39;foo&#39;和&#39;bar&#39;，当我们导入这些模块，我们的变量其实已经有数据。\n当然，我们何以导出对象，类，函数，等等\n现在，你可以开始模仿这个例子写出你自己的模块</p>\n<h1 id=\"-\">构建</h1>\n<p>就像你已经知道的，<a href=\"http://kangax.github.io/compat-table/es6/\">ES6不支持你现在的浏览器和Node</a>.js，只有一条路，那就是使用降级转换器来编写ES6的模块化代码。\n正如我之前提到的那个，我使用6to5，他可以精确的达到我们想要的效果。\n这个任务是运行在Grunt上的,我们使用 @sindresorhus的 <a href=\"https://github.com/sindresorhus/grunt-6to5\">grunt-6to5</a></p>\n<pre><code class=\"lang-shell\">npm install grunt-cli -g\nnpm install grunt --save-dev\nnpm install grunt-6to5 --save-dev\n</code></pre>\n<p>我们的Gruntfile类似于一下：</p>\n<pre><code class=\"lang-javascript\">grunt.initConfig({\n    &#39;6to5&#39;: {\n        options: {\n            modules: &#39;common&#39;\n        },\n\n        build: {\n            files: [{\n                expand: true,\n                cwd: &#39;src/&#39;,\n                src: [&#39;**/*.js&#39;],\n                dest: &#39;dist/&#39;,\n            }],\n        }\n    }\n});\n</code></pre>\n<p>这是个简单又给力的配置，我们也几乎完成了。\n当你指定好源文件和输出文件后，这个任务就可以来运行了。\n&#39;common&#39;选项的目的在于告诉6to5我们将输出ES5CommonJS模块化风格。\n当然，6to5也支持AMD，我写了sample/index.html，让他在浏览器环境下测试一下，这个HTML的代码如下：</p>\n<pre><code class=\"lang-html\">&lt;!doctype html&gt;\n&lt;html lang=&quot;en&quot;&gt;\n&lt;head&gt;\n    &lt;meta charset=&quot;UTF-8&quot;&gt;\n    &lt;title&gt;ES6 modules 6to5&lt;/title&gt;\n&lt;/head&gt;\n&lt;body&gt;\n    &lt;script src=&quot;//[cdnjs URL]/require.min.js&quot;&gt;&lt;/script&gt;\n    &lt;script&gt;\n        require([&#39;app.js&#39;]);\n    &lt;/script&gt;\n&lt;/body&gt;\n&lt;/html&gt;\n</code></pre>\n<p>观察上面的代码，我们使用AMD的RequireJS框架来加载这个JS，对于这个例子，你需要将上面的配置文件改为 modules: &#39;amd&#39;</p>\n<h1 id=\"-\">运行</h1>\n<p>万事俱备东风只欠，我们的代码已经放在<a href=\"https://github.com/es6rocks/es6-modules-today-with-6to5\">es6-modules-today-with-6to5</a>，你可以克隆下来自己玩玩。使用npm install安装6to5</p>\n<p>记住一点，Grunt任务会生成一个目标文件夹来存放转化后的代码\n所以，如果你想测试使用CommonJS规范的转化后的ES6的代码，你可以执行一下命令</p>\n<pre><code class=\"lang-shell\">node dist/app.js\n</code></pre>\n<figure>\n    <a href=\"http://es6rocks.com/img/running-node.png\">\n        <img src=\"http://es6rocks.com/img/running-node.png\" alt=\"home\" />\n    </a>\n    <figcaption>Node.js上的运行效果</figcaption>\n</figure>\n\n<p>如果你使用AMD规范的，请在浏览器访问index.html(<strong>吐槽一下，老外竟然不知道中国的<a href=\"https://github.com/seajs/seajs\">sea.js</a></strong>)</p>\n<figure>\n    <a href=\"http://es6rocks.com/img/amd-es6.png\">\n        <img src=\"http://es6rocks.com/img/amd-es6.png\" alt=\"home\" />\n    </a>\n    <figcaption>在浏览器执行的效果</figcaption>\n</figure>\n\n<h1 id=\"-\">结论</h1>\n<p>通过这个简单的实例你学会了如果简单的使用ES6模块化风格来编写代码。6to5是胃肠棒的工具让你穿越到未来提前体验ES6模块化带来的快感。资源下载<a href=\"https://github.com/es6rocks/es6-modules-today-with-6to5\">es6-modules-today-with-6to5</a>，欢迎提交一些问题的反馈</p>\n",
        "file": "./src/posts/es6-modules-today-with-6to5.md",
        "filename": "es6-modules-today-with-6to5",
        "link": "cn/2014/11/es6-modules-today-with-6to5",
        "lang": "cn",
        "default_lang": true
      }, {
        "layout": "post",
        "title": "JavaScript ♥ 统一编码",
        "date": "2014-10-13T19:22:32.267Z",
        "comments": "true",
        "published": "true",
        "keywords": "ES6, Unicode",
        "description": "Mathias Bynens 关于JavaScript编码的一些谈论",
        "categories": ["Unicode", " Videos"],
        "content": "<p>Mathias Bynens给出了一个非常棒的话题在上一次jsConfEu版本上.\n他提出了javascript的统一编码，如果你在字符上花了很多功夫，那你一定要 看一下这个话题.\n实际上，即使你没在字符串和javascript花了很多时间，这些由Mathias提出的编码技巧也是很有用的。</p>\n<iframe width=\"560\" height=\"315\" src=\"//www.youtube.com/embed/zi0w7J7MCrk\" frameborder=\"0\" allowfullscreen></iframe>",
        "file": "./src/posts/javascript-unicode.md",
        "filename": "javascript-unicode",
        "link": "cn/2014/10/javascript-unicode",
        "lang": "cn",
        "default_lang": true
      }, {
        "layout": "post",
        "title": "ES6箭头函数和它的作用域",
        "date": "2014-10-01T04:01:41.369Z",
        "comments": "true",
        "published": "true",
        "keywords": "arrow functions, es6, escope",
        "description": "关于ES6里箭头函数及其作用域的使用",
        "categories": ["作于域", " 文章", " 基本原理"],
        "authorName": "Felipe N. Moura",
        "authorLink": "http://twitter.com/felipenmoura",
        "authorDescription": "FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "authorPicture": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xfa1/v/t1.0-1/c0.0.160.160/p160x160/10556538_10203722375715942_6849892741161969592_n.jpg?oh=a3044d62663f3d0f4fe74f480b61c9d1&oe=54C6A6B1&__gda__=1422509575_e6364eefdf2fc0e5c96899467d229f62",
        "translator": "liyaoning",
        "content": "<p>在ES6很多很棒的新特性中, 箭头函数 (或者大箭头函数)就是其中值得关注的一个! 它不仅仅是很棒很酷, 它很好的利用了作用域, 快捷方便的在现在使用以前我们用的技术, 减少了很多代码......但是如果你不了解箭头函数原理的话可能就有点难以理解. 所以,让我们来看下箭头函数, 就是现在!</p>\n<h2 id=\"-\">执行环境</h2>\n<p>你可以自己去学习和尝试下, 你可以简单的把示例程序代码复制到你的浏览器控制台下. 现在, 推荐使用Firefox(22+)开发者工具, Firefox(22+)开发者工具现在支持箭头函数,你也可以使用谷歌浏览器. 如果你使用谷歌浏览器, 你必须要做下列两件事:</p>\n<ul>\n<li>- 在谷歌浏览器中地址栏中输入：&quot;about:flags&quot;, 找到 &quot;使用体验性Javascript&quot;选项，开启使用。</li>\n<li>- 在函数的开头加上&quot;use strict&quot;,然后再在你的谷歌浏览中测试箭头函数吧(提示：请用谷歌浏览器v38,我当时就是被浏览器版本坑了):</li>\n</ul>\n<pre><code class=\"lang-javascript\">(function(){\n    &quot;use strict&quot;;\n    // use arrow functions here\n}());\n</code></pre>\n<p>幸运的是后面会有越来越多的浏览器支持ES6特性. 现在你完成了所有准备工作, 让我们继续深入它吧!</p>\n<h2 id=\"-\">一个新话题</h2>\n<p>最近大家在讨论关于ES6的一个话题：关于箭头函数, 像这样:</p>\n<pre><code class=\"lang-javascript\">=&gt;\n</code></pre>\n<h2 id=\"-\">新的语法</h2>\n<p>随着讨论产生了一个新的语法：</p>\n<pre><code class=\"lang-javascript\">param =&gt; expression\n</code></pre>\n<p>新增的语法是作用在变量上, 可以在表达式中申明多个变量, 下面是箭头函数的使用模式:</p>\n<pre><code class=\"lang-javascript\">//  一个参数对应一个表达式\nparam =&gt; expression;// 例如 x =&gt; x+2;\n\n// 多个参数对应一个表达式\n(param [, param]) =&gt; expression; //例如 (x,y) =&gt; (x + y);\n\n// 一个参数对应多个表示式\nparam =&gt; {statements;} //例如 x = &gt; { x++; return x;};\n\n//  多个参数对应多个表达式\n([param] [, param]) =&gt; {statements} // 例如 (x,y) =&gt; { x++;y++;return x*y;};\n\n//表达式里没有参数\n() =&gt; expression; //例如var flag = (() =&gt; 2)(); flag等于2\n\n() =&gt; {statements;} //例如 var flag = (() =&gt; {return 1;})(); flag就等于1\n\n //传入一个表达式，返回一个对象\n([param]) =&gt; ({ key: value });\n//例如  var fuc = (x) =&gt; ({key:x})\n        var object = fuc(1);\n        alert(object);//{key:1}\n</code></pre>\n<h2 id=\"-\">箭头函数是怎么实现的</h2>\n<p>我们可以把一个普通函数转换成用箭头函数来实现：</p>\n<pre><code class=\"lang-javascript\">// 当前函数\nvar func = function (param) {\n    return param.split(&quot; &quot;);\n}\n// 利用箭头函数实现\nvar func = param =&gt; param.split(&quot; &quot;);\n</code></pre>\n<p>从上面的例子中我们可以看出箭头函数的语法实际上是返回了一个新的函数, 这个函数有函数体和参数</p>\n<p>因此, 我们可以这样调用刚才我们创建的函数:</p>\n<pre><code class=\"lang-javascript\">func(&quot;Felipe Moura&quot;); // returns [&quot;Felipe&quot;, &quot;Moura&quot;]\n</code></pre>\n<h2 id=\"-iife-\">立即执行函数(IIFE)</h2>\n<p>你能在立即执行函数里使用箭头函数，例如:</p>\n<pre><code class=\"lang-javascript\">( x =&gt; x * 2 )( 3 ); // 6\n</code></pre>\n<p>这行代码产生了一个临时函数，这个函数有一个形参<code>x</code>，函数的返回值为<code>x*2</code>,之后系统会马上执行这个临时函数, 将<code>3</code>赋值给形参<code>x</code>.</p>\n<p>下面的例子描述了临时函数体里有多行代码的情况：</p>\n<pre><code class=\"lang-javascript\">( (x, y) =&gt; {\n    x = x * 2;\n    return x + y;\n})( 3, &quot;A&quot; ); // &quot;6A&quot;\n</code></pre>\n<h2 id=\"-\">相关思考</h2>\n<p>思考下面的函数：</p>\n<pre><code class=\"lang-javascript\">var func = x =&gt; {\n    return x++;\n};\n</code></pre>\n<p>我们列出了一些常见的问题：</p>\n<p><strong>- 箭头函数创建的临时函数的<code>arguments</code>是我们预料的那样工作</strong></p>\n<pre><code class=\"lang-javascript\">console.log(arguments);\n</code></pre>\n<p><strong>- <code>typeof</code>和<code>instanceof</code>函数也能正常检查临时函数</strong></p>\n<pre><code class=\"lang-javascript\">func instanceof Function; // true\ntypeof func; // function\nfunc.constructor == Function; // true\n</code></pre>\n<p><strong>- 把箭头函数放在括号内是无效的</strong></p>\n<pre><code class=\"lang-javascript\">//  有效的常规语法\n(function (x, y){\n    x= x * 2;\n    return x + y;\n} (3, &quot;B&quot;) );\n\n// 无效的箭头函数语法\n( (x, y) =&gt; {\n    x= x * 2;\n    return x + y;\n} ( 3, &quot;A&quot; ) );\n\n// 但是可以这样写就是有效的了：\n( (x,y) =&gt; {\n    x= x * 2;return x + y;\n} )( 3,&quot;A&quot; );//立即执行函数\n</code></pre>\n<p><strong>- 尽管箭头函数会产生一个临时函数，但是这个临时函数不是一个构造函数</strong></p>\n<pre><code class=\"lang-javascript\">var instance= new func(); // TypeError: func is not a constructor\n</code></pre>\n<p><strong>- 同样也没有原型对象</strong></p>\n<pre><code class=\"lang-javascript\">func.prototype; // undefined\n</code></pre>\n<h2 id=\"-\">作用域</h2>\n<p>这个箭头函数的作用域和其他函数有一些不同,如果不是严格模式，<code>this</code>关键字就是指向<code>window</code>，严格模式就是<code>undefined</code>，在构造函数里的<code>this</code>指向的是当前对象实例,如果this在一个对象的函数内则<code>this</code>指向的是这个对象，<code>this</code>有可能指向的是一个<code>dom元素</code>，例如当我们添加事件监听函数时,可能这个<code>this</code>的指向不是很直接，其实<code>this</code>（不止是<code>this</code>变量）变量的指向是根据一个规则来判断的：作用域流。下面我将演示<code>this</code>在事件监听函数和在对象函数内出现的情况： </p>\n<p>在事件监听函数中：</p>\n<pre><code class=\"lang-javascript\">document.body.addEventListener(&#39;click&#39;, function(evt){\n    console.log(this); // the HTMLBodyElement itself\n});\n</code></pre>\n<p>在构造函数里：</p>\n<pre><code class=\"lang-javascript\">function Person () {\n\n    let fullName = null;\n\n    this.getName = function () {\n        return fullName;\n    };\n\n    this.setName = function (name) {\n        fullName = name;\n        return this;\n    };\n}\n\nlet jon = new Person();\njon.setName(&quot;Jon Doe&quot;);\nconsole.log(jon.getName()); // &quot;Jon Doe&quot;\n//注：this关键字这里就不解释了，大家自己google,baidu吧。\n</code></pre>\n<p>在这个例子中，如果我们让Person.setName函数返回Person对象本身，我们就可以这样用：</p>\n<pre><code class=\"lang-javascript\">jon.setName(&quot;Jon Doe&quot;)\n   .getName(); // &quot;Jon Doe&quot;\n</code></pre>\n<p>在一个对象里:</p>\n<pre><code class=\"lang-javascript\">let obj = {\n    foo: &quot;bar&quot;,\n    getIt: function () {\n        return this.foo;\n    }\n};\n\nconsole.log( obj.getIt() ); // &quot;bar&quot;\n</code></pre>\n<p>但是当执行流(比如使用了setTimeout)和作用域变了的时候，this也会变。</p>\n<pre><code class=\"lang-javascript\">function Student(data){\n\n    this.name = data.name || &quot;Jon Doe&quot;;\n    this.age = data.age&gt;=0 ? data.age : -1;\n\n    this.getInfo = function () {\n        return this.name + &quot;, &quot; + this.age;\n    };\n\n    this.sayHi = function () {\n        window.setTimeout( function () {\n            console.log( this );\n        }, 100 );\n    }\n\n}\n\nlet mary = new Student({\n    name: &quot;Mary Lou&quot;,\n    age: 13\n});\n\nconsole.log( mary.getInfo() ); // &quot;Mary Lou, 13&quot;\nmary.sayHi();\n// window\n</code></pre>\n<p>当<code>setTimeout</code>函数改变了执行流的情况时，<code>this</code>的指向会变成全局对象,或者是在严格模式下就是<code>undefine</code>,这样在<code>setTimeout</code>函数里面我们使用其他的变量去指向<code>this</code>对象，比如<code>self</code>，<code>that</code>,当然不管你用什么变量，你首先应该在setTimeout访问之前，给<code>self</code>，<code>that</code>赋值，或者使用<code>bind</code>方法不然这些变量就是undefined。</p>\n<p>这是后就是箭头函数登场的时候了，它可以保持作用域，this的指向就不会变了。</p>\n<p>让我们看下上文<strong>起先</strong>的例子，在这里我们使用箭头函数：</p>\n<pre><code class=\"lang-javascript\">function Student(data){\n\n    this.name = data.name || &quot;Jon Doe&quot;;\n    this.age = data.age&gt;=0 ? data.age : -1;\n\n    this.getInfo = function () {\n        return this.name + &quot;, &quot; + this.age;\n    };\n\n    this.sayHi = function () {\n        window.setTimeout( ()=&gt;{\n            // the only difference is here\n            console.log( this );\n        }, 100 );\n    }\n\n}\n\nlet mary = new Student({\n    name: &quot;Mary Lou&quot;,\n    age: 13\n});\n\nconsole.log( mary.getInfo() ); // &quot;Mary Lou, 13&quot;\nmary.sayHi();\n// Object { name: &quot;Mary Lou&quot;, age: 13, ... }\n</code></pre>\n<blockquote>\n<p>分析：在sayHi函数中，我们使用了箭头函数，当前作用域是在student对象的一个方法中，箭头函数生成的临时函数的作用域也就是student对象的sayHi函数的作用域。所以即使我们在setTimeout调用了箭头函数生成的临时函数，这个临时函数中的this也是正确的指向。</p>\n</blockquote>\n<h2 id=\"-\">有趣和有用的使用</h2>\n<p>创建一个函数很容易，我们可以利用它可以保持作用域的特征：</p>\n<p>例如我们可以这么使用：Array.forEach()</p>\n<pre><code class=\"lang-javascript\">var arr = [&#39;a&#39;, &#39;e&#39;, &#39;i&#39;, &#39;o&#39;, &#39;u&#39;];\narr.forEach(vowel =&gt; {\n    console.log(vowel);\n});\n</code></pre>\n<blockquote>\n<p>分析：在forEach里箭头函数会创建并返回一个临时函数 tempFun,这个tempFun你可以想象成这样的：function(vowel){ console.log(vowel);}但是Array.forEach函数会怎么去处理传入的tempFunc呢？在forEach函数里会这样调用它：tempFunc.call(this,value);所有我们看到函数的正确执行效果。</p>\n</blockquote>\n<p>//在Array.map里使用箭头函数，这里我就不分析函数执行过程了。。。。</p>\n<pre><code class=\"lang-javascript\">var arr = [&#39;a&#39;, &#39;e&#39;, &#39;i&#39;, &#39;o&#39;, &#39;u&#39;];\narr.map(vowel =&gt; {\n    return vowel.toUpperCase();\n});\n// [ &quot;A&quot;, &quot;E&quot;, &quot;I&quot;, &quot;O&quot;, &quot;U&quot; ]\n</code></pre>\n<p>费布拉奇数列</p>\n<pre><code class=\"lang-javascript\">var factorial = (n) =&gt; {\n    if(n==0) {\n        return 1;\n    }\n    return (n * factorial (n-1) );\n}\n\nfactorial(6); // 720\n</code></pre>\n<p>我们也可以用在Array.sort方法里：</p>\n<pre><code class=\"lang-javascript\">let arr = [&#39;a&#39;, &#39;e&#39;, &#39;i&#39;, &#39;o&#39;, &#39;u&#39;];\narr.sort( (a, b)=&gt; a &lt; b? 1: -1 );\n</code></pre>\n<p>也可以在事件监听函数里使用：</p>\n<pre><code class=\"lang-javascript\">document.body.addEventListener(&#39;click&#39;, event=&gt;console.log(event, this)); // EventObject, BodyElement\n</code></pre>\n<h2 id=\"-\">推荐的链接</h2>\n<p>下面列出了一系列有用的链接，大家可以去看一看</p>\n<ul>\n<li>- <a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions\">Arrow Functions in MDN Documentation</a></li>\n<li>- <a href=\"http://tc39wiki.calculist.org/es6/arrow-functions/\">TC39 Wiki about Arrow Function</a></li>\n<li>- <a href=\"https://github.com/esnext\">ESNext</a></li>\n<li>- <a href=\"https://github.com/addyosmani/es6-tools\">ES6 Tools</a></li>\n<li>- <a href=\"https://www.npmjs.org/package/grunt-es6-transpiler\">Grunt ES6 Transpiler</a></li>\n<li>- <a href=\"http://www.es6fiddle.net/\">ES6 Fiddle</a></li>\n<li>- <a href=\"http://kangax.github.io/compat-table/es6/\">ES6 Compatibility Table</a></li>\n</ul>\n<h2 id=\"-\">总结</h2>\n<p>尽管大家可能会认为使用箭头函数会降低你代码的可读性，但是由于它对作用域的特殊处理，它能让我们能很好的处理this的指向问题。箭头函数加上let关键字的使用，将会让我们javascript代码上一个层次！尽量多使用箭头函数，你可以再你的浏览器测试你写的箭头函数代码，大家可以再评论区留下你对箭头函数的想法和使用方案！我希望大家能享受这篇文章，就像你会不就的将来享受箭头函数带给你的快乐.</p>\n",
        "file": "./src/posts/arrow-functions-and-their-scope.md",
        "filename": "arrow-functions-and-their-scope",
        "link": "cn/2014/10/arrow-functions-and-their-scope",
        "lang": "cn",
        "default_lang": true
      }]
    };
  },
  getPages: function() {
    return [];
  }
}, {});

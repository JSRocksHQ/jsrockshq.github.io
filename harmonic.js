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
        "title": "JavaScript ♥  Unicode",
        "date": "2014-10-13T19:22:32.267Z",
        "comments": "true",
        "published": "true",
        "keywords": "ES6, Unicode",
        "description": "Mathias Bynens talking about Unicode in JavaScript",
        "categories": ["Unicode", " Videos"],
        "content": "<p>Mathias Bynens gave an awesome talk on the last <a href=\"http://2014.jsconf.eu\">JSConfEU</a> edition.<br>He talked about Unicode in JavaScript, and if you need to work hard with strings, you MUST watch this talk.<br>Actually, even if you&#39;re not working hard with strings and JavaScript, those Unicode tricks presented by Mathias are pretty usefull.  </p>\n<iframe width=\"560\" height=\"315\" src=\"//www.youtube.com/embed/zi0w7J7MCrk\" frameborder=\"0\" allowfullscreen></iframe>",
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
        "authorPicture": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xfa1/v/t1.0-1/c0.0.160.160/p160x160/10556538_10203722375715942_6849892741161969592_n.jpg?oh=a3044d62663f3d0f4fe74f480b61c9d1&oe=54C6A6B1&__gda__=1422509575_e6364eefdf2fc0e5c96899467d229f62",
        "content": "<p>Among so many great new features in ES6, Arrow Functions (or Fat Arrow Functions) is one that deserves attention!\nIt is not just awesome, it&#39;s also great to work with scopes, shortcuts some techniques we are used to use nowadays, shrinks the number of lines of code...\nBut it may be a little harder to read if you are not used to the way it works.\nSo, let&#39;s take a look at it, right now!</p>\n<h2 id=\"making-it-work\">Making it work</h2>\n<p>To study and try it for yourself, you can simply copy some of the examples and paste them on your browser&#39;s console.\nBy now, you can use the Firefox (22+) Developer Tools, which already supports arrow functions, or on Google Chrome.\nBut to use it in your Chrome, you will have to:</p>\n<ul>\n<li>- Enable it: Open about:flags in the address bar, and enable the &quot;Experimental JavaScript&quot; flag</li>\n<li>- Use it always in a function in &quot;use strict&quot; mode, so, to run it on Google Chrome&#39;s console:</li>\n</ul>\n<pre><code class=\"lang-javascript\">(function(){\n    &quot;use strict&quot;;\n    // use arrow functions here\n}());\n</code></pre>\n<p>With time, fortunately, more browsers will support the new ES6 features.\nNow that it&#39;s all set up, let&#39;s dive deep into it!</p>\n<h2 id=\"a-new-token\">A New Token</h2>\n<p>A new token has been added to ES6, and it is called &quot;fat arrow&quot;, represented by</p>\n<pre><code class=\"lang-javascript\">=&gt;\n</code></pre>\n<h2 id=\"the-new-syntax\">The new Syntax</h2>\n<p>With this new token and feature, came this new syntax:</p>\n<pre><code class=\"lang-javascript\">param =&gt; expression\n</code></pre>\n<p>Syntax with which we can use some variations, according to the number of statements in the expression, and number of parameters we want to use:</p>\n<pre><code class=\"lang-javascript\">// single param, single statement\nparam =&gt; expression;\n\n// multiple params, single statement\n(param [, param]) =&gt; expression;\n\n// single param, multiple statements\nparam =&gt; {\n    statements;\n}\n\n// multiple params, multiple statements\n([param] [, param]) =&gt; {\n   statements\n}\n\n// with no params, single statement\n() =&gt; expression;\n\n// with no params, multiple statements\n() =&gt; {\n    statements;\n}\n\n// one statement, returning an object\n([param]) =&gt; ({ key: value });\n</code></pre>\n<h2 id=\"how-it-works\">How it works</h2>\n<p>If we would &quot;translate&quot; it to something we already do today, it would be something like this:</p>\n<pre><code class=\"lang-javascript\">// this function\nvar func = function (param) {\n    return param.split(&quot; &quot;);\n}\n\n// would become:\nvar func = param =&gt; param.split(&quot; &quot;);\n</code></pre>\n<p>That means this syntax actually returns a new function, with the given statements and params.</p>\n<p>Therefore, we can call the function the same way we are already used to:</p>\n<pre><code class=\"lang-javascript\">func(&quot;Felipe Moura&quot;); // returns [&quot;Felipe&quot;, &quot;Moura&quot;]\n</code></pre>\n<h2 id=\"immediately-invoked-function-expression-iife-\">Immediately-invoked function expression (IIFE)</h2>\n<p>Yes, you can invoke such functions immediately, as they are, indeed, expressions.\nLike so:</p>\n<pre><code class=\"lang-javascript\">( x =&gt; x * 2 )( 3 ); // 6\n</code></pre>\n<p>It creates a function, which receives the argument <code>x</code> and returns <code>x * 2</code>, then it immediately executes this expression, passing the value <code>3</code> as argument.</p>\n<p>In case you have more statements to execute, or more params:</p>\n<pre><code class=\"lang-javascript\">( (x, y) =&gt; {\n    x = x * 2;\n    return x + y;\n})( 3, &quot;A&quot; ); // &quot;6A&quot;\n</code></pre>\n<h2 id=\"relevant-considerations\">Relevant considerations</h2>\n<p>Considering:</p>\n<pre><code class=\"lang-javascript\">var func = x =&gt; {\n    return x++;\n};\n</code></pre>\n<p>We may point some relevant considerations:</p>\n<p><strong>- <code>arguments</code> works just as expected</strong></p>\n<pre><code class=\"lang-javascript\">console.log(arguments);\n</code></pre>\n<p><strong>- <code>typeof</code> and <code>instanceof</code> work just fine as well</strong></p>\n<pre><code class=\"lang-javascript\">func instanceof Function; // true\ntypeof func; // function\nfunc.constructor == Function; // true\n</code></pre>\n<p><strong>- Using parentheses inside, as suggested by jsLint will not work</strong></p>\n<pre><code class=\"lang-javascript\">// works with regular function syntax, as suggested by JSLint\n(function (x, y){\n    x= x * 2;\n    return x + y;\n} (3, &quot;B&quot;) );\n\n// doesn&#39;t work with Arrow Functions\n( (x, y) =&gt; {\n    x= x * 2;\n    return x + y;\n} ( 3, &quot;A&quot; ) );\n\n// but it would work if the last line was\n// })(3, &quot;A&quot;);\n</code></pre>\n<p><strong>- Although it is a function, is not a constructor</strong></p>\n<pre><code class=\"lang-javascript\">var instance= new func(); // TypeError: func is not a constructor\n</code></pre>\n<p><strong>- It has no prototype</strong></p>\n<pre><code class=\"lang-javascript\">func.prototype; // undefined\n</code></pre>\n<h2 id=\"scope\">Scope</h2>\n<p>The <code>this</code> in arrow functions&#39; scopes works a little bit different, as well.\nThe way we are used to it, the <code>this</code> keyword may reference to: <code>window</code> (if accessed globally, not in strict mode), <code>undefined</code> (if accessed globally, in strict mode), an <em>instance</em> (if in a constructor), an <em>object</em> (if in a method or function inside an object or instance) or a <em>binded/applied value</em>. It may also be a <code>DOMElement</code>, for example, in cases when you are using addEventListener. <!-- TODO \"accessed globally\" needs better wording -->\nThis might be annoying some times, or even tricky, causing you some trouble!\nBesides, it is referenced as <em>&quot;scope-by-flow&quot;</em>. What do I mean by saying that?</p>\n<p>Let&#39;s see, firstly, how the <code>this</code> token behaves in different situations:</p>\n<p>In an EventListener:</p>\n<pre><code class=\"lang-javascript\">document.body.addEventListener(&#39;click&#39;, function(evt){\n    console.log(this); // the HTMLBodyElement itself\n});\n</code></pre>\n<p>In instances:</p>\n<pre><code class=\"lang-javascript\">function Person () {\n\n    let fullName = null;\n\n    this.getName = function () {\n        return fullName;\n    };\n\n    this.setName = function (name) {\n        fullName = name;\n        return this;\n    };\n}\n\nlet jon = new Person();\njon.setName(&quot;Jon Doe&quot;);\nconsole.log(jon.getName()); // &quot;Jon Doe&quot;\n</code></pre>\n<p>In this particular case, once <code>Person.setName</code> is &quot;chainable&quot; (by returning itself), we could also use it like this:</p>\n<pre><code class=\"lang-javascript\">jon.setName(&quot;Jon Doe&quot;)\n   .getName(); // &quot;Jon Doe&quot;\n</code></pre>\n<p>In an object:</p>\n<pre><code class=\"lang-javascript\">let obj = {\n    foo: &quot;bar&quot;,\n    getIt: function () {\n        return this.foo;\n    }\n};\n\nconsole.log( obj.getIt() ); // &quot;bar&quot;\n</code></pre>\n<p>But then, comes the &quot;scope-by-flow&quot; I mentioned.\nIf either the flow or scope changes, the <code>this</code> reference changes as well.</p>\n<pre><code class=\"lang-javascript\">function Student(data){\n\n    this.name = data.name || &quot;Jon Doe&quot;;\n    this.age = data.age&gt;=0 ? data.age : -1;\n\n    this.getInfo = function () {\n        return this.name + &quot;, &quot; + this.age;\n    };\n\n    this.sayHi = function () {\n        window.setTimeout( function () {\n            console.log( this );\n        }, 100 );\n    }\n\n}\n\nlet mary = new Student({\n    name: &quot;Mary Lou&quot;,\n    age: 13\n});\n\nconsole.log( mary.getInfo() ); // &quot;Mary Lou, 13&quot;\nmary.sayHi();\n// window\n</code></pre>\n<p>Once <code>setTimeout</code> changes the execution flow, the <code>this</code> reference becomes the global object (in this case, <code>window</code>), or <code>undefined</code> in strict mode.\nDue to this, we end up using techniques like the use of variables like &quot;self&quot;, &quot;that&quot; or something like it, or having to use the <code>.bind</code> method.</p>\n<p>But don&#39;t worry, arrow functions are here to help!\nWith arrow functions, the scope is kept with it, from where it was called.</p>\n<p>Let&#39;s see the <strong>same</strong> example as before, but using an arrow function, passed to the <code>setTimeout</code> call.</p>\n<pre><code class=\"lang-javascript\">function Student(data){\n\n    this.name = data.name || &quot;Jon Doe&quot;;\n    this.age = data.age&gt;=0 ? data.age : -1;\n\n    this.getInfo = function () {\n        return this.name + &quot;, &quot; + this.age;\n    };\n\n    this.sayHi = function () {\n        window.setTimeout( ()=&gt;{ // the only difference is here\n            console.log( this );\n        }, 100 );\n    }\n\n}\n\nlet mary = new Student({\n    name: &quot;Mary Lou&quot;,\n    age: 13\n});\n\nconsole.log( mary.getInfo() ); // &quot;Mary Lou, 13&quot;\nmary.sayHi();\n// Object { name: &quot;Mary Lou&quot;, age: 13, ... }\n</code></pre>\n<h2 id=\"interesting-and-useful-usage\">Interesting and useful usage</h2>\n<p>As it is very easy to create arrow functions, and their scopes work as mentioned before, we can use it in a variety of ways.</p>\n<p>For example, it can be used directly in an <code>Array#forEach</code> call:</p>\n<pre><code class=\"lang-javascript\">var arr = [&#39;a&#39;, &#39;e&#39;, &#39;i&#39;, &#39;o&#39;, &#39;u&#39;];\narr.forEach(vowel =&gt; {\n    console.log(vowel);\n});\n</code></pre>\n<p>Or in an <code>Array#map</code>:</p>\n<pre><code class=\"lang-javascript\">var arr = [&#39;a&#39;, &#39;e&#39;, &#39;i&#39;, &#39;o&#39;, &#39;u&#39;];\narr.map(vowel =&gt; {\n    return vowel.toUpperCase();\n});\n// [ &quot;A&quot;, &quot;E&quot;, &quot;I&quot;, &quot;O&quot;, &quot;U&quot; ]\n</code></pre>\n<p>You can also use it in recursion:</p>\n<pre><code class=\"lang-javascript\">var factorial = (n) =&gt; {\n    if(n==0) {\n        return 1;\n    }\n    return (n * factorial (n-1) );\n}\n\nfactorial(6); // 720\n</code></pre>\n<p>Also, let&#39;s say, sorting backwards an array:</p>\n<pre><code class=\"lang-javascript\">let arr = [&#39;a&#39;, &#39;e&#39;, &#39;i&#39;, &#39;o&#39;, &#39;u&#39;];\narr.sort( (a, b)=&gt; a &lt; b? 1: -1 );\n</code></pre>\n<p>Or maybe in event listeners:</p>\n<pre><code class=\"lang-javascript\">document.body.addEventListener(&#39;click&#39;, body=&gt;console.log(body));\n</code></pre>\n<!-- TODO above example doesn't make much sense, the `body` parameter receives an event object -->\n\n<h2 id=\"useful-links\">Useful links</h2>\n<p>Here is a list of interesting, useful links you can take a look at:</p>\n<ul>\n<li>- <a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions\">Arrow Functions in MDN Documentation</a></li>\n<li>- <a href=\"http://tc39wiki.calculist.org/es6/arrow-functions/\">TC39 Wiki about Arrow Function</a></li>\n<li>- <a href=\"https://github.com/esnext\">ESNext</a></li>\n<li>- <a href=\"https://github.com/addyosmani/es6-tools\">ES6 Tools</a></li>\n<li>- <a href=\"https://www.npmjs.org/package/grunt-es6-transpiler\">Grunt ES6 Transpiler</a></li>\n<li>- <a href=\"http://www.es6fiddle.net/\">ES6 Fiddle</a></li>\n<li>- <a href=\"http://kangax.github.io/compat-table/es6/\">ES6 Compatibility Table</a></li>\n</ul>\n<h2 id=\"conclusion\">Conclusion</h2>\n<p>Although arrow functions may make your source code a little bit less readable (and you can get used to it pretty fast), it is, indeed, a great solution to capture the outer scope&#39;s <code>this</code> value, a quick way to get things working and, in association with the <code>let</code> keyword, will definitely take our JavaScript to the next level!\nTry and use it, create some tests, run it in your browsers and leave comments with interesting solutions and uses you&#39;ve found to arrow functions!\nI hope you have enjoyed this article, as much as you are going to enjoy arrow functions in a very close future.</p>\n",
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
        "content": "<p>If you&#39;re interested in ES6 you must follow <a href=\"https://twitter.com/rauschma\">Dr. Axel Rauschmayer</a>.<br>He maintains the awesome <a href=\"http://www.2ality.com/\">2ality</a> blog and writes a lot of good stuff around ES6.<br>In those slides, he cover a lot of new ES6 features and show us what we can expect for the future.  </p>\n<script async class=\"speakerdeck-embed\" data-id=\"4126347010d6013231af66d414c0f9a8\" data-ratio=\"1.33333333333333\" src=\"//speakerdeck.com/assets/embed.js\"></script>  \n\n<p>[UPDATE October, 2014]<br>The video is already online! (Thanks <a href=\"https://github.com/cirocosta\">Ciro Costa</a> for point this).  </p>\n<iframe width=\"560\" height=\"315\" src=\"//www.youtube.com/embed/G21rdWfa_as\" frameborder=\"0\" allowfullscreen></iframe>",
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
        "authorPicture": "https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg",
        "content": "<p>Variables declaration in any programming language are something pretty basic.<br>Regardless the language, understanding how variable scope works is essential to write any kind of program.<br>In Python, for example, as well as in most languages​​, there are two scopes: Local and Global.<br>Variables defined at the top of the file, without identation, are global scope variables.<br>Variables declared inside the function body are considered as local scope.<br>So far, everything is very similar. In JavaScript, the behavior is quite similar.<br>Let&#39;s see one example in both languages:  </p>\n<pre><code class=\"lang-python\"># Python\nx = 1 # global scope\ny = 3\n\ndef sum(a, b):\n    s = a + b # local scope\n    return s\n</code></pre>\n<pre><code class=\"lang-javascript\">// JavaScript\nvar x = 1;  // global scope\nvar y = 3;\n\nfunction sum(a, b) {\n    var s = a + b;  // local scope\n    return s;\n}\n</code></pre>\n<p>In most C-based languages(JavaScript, PHP), variables are created at the spot where they were declared.<br>However, in JavaScrpt this is different, and can become complicated.<br>When you declare a variable in the body of a function, it is moved to the top or to the global scope. This behavior is called <a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var#var_hoisting\"><em>hoisting</em></a>.<br>Unlike Python and other languages, in JavaScript, a variable declared in a for loop leaks its value.<br>See the example below:  </p>\n<pre><code class=\"lang-javascript\">// JavaScript\nfor (var i = 0; i &lt;= 2; i += 1) {\n    console.log(i); // current i\n}\nconsole.log(i); // last i\n</code></pre>\n<p>In this case, even outside of the for loop block, the variable i is still there, with the last value stored.<br>This is a pretty common issue where a program can be easily broken by lack of attention.<br>Another important factor in JavaScript is that the omission of <em>var</em> to declare a variable causes it to be allocated in the global scope, and this can cause many problems.  </p>\n<h2 id=\"let-declaration\">let declaration</h2>\n<p>The <em>let</em> arrives in ES6 as a substitute for <em>var</em>. Yes, the idea is that var will be discontinued in a distant future,  because today it would be impossible completely stop supporting it without breaking the whole internet.<br>The <em>let</em> works as expected, setting the variable in the place where it was declared.<br>Example:  </p>\n<pre><code class=\"lang-javascript\">let foo = true;\nif  (foo) {\n    let bar = &#39;baz&#39;;\n    console.log(bar); // outputs &#39;baz&#39;\n}\n\ntry {\n    console.log(bar);\n} catch (e) {\n    console.log(&quot;bar doesn&#39;t exist&quot;);\n}\n</code></pre>\n<p>As you might imagine, <em>let</em> solves the problem with the variable in the for loop.<br>See:  </p>\n<pre><code class=\"lang-javascript\">// JavaScript\nfor (let i = 0; i &lt;= 2; i += 1) {\n    console.log(i); // current i\n}\ntry {\n    console.log(i);\n} catch (e) {\n    console.log(&quot;i doesn&#39;t exist&quot;);\n}\n</code></pre>\n<h2 id=\"support-today\">Support today</h2>\n<p>You can use <em>let</em> today*<br>Check out the awesome Kangax ES6 table &gt; <a href=\"http://kangax.github.io/compat-table/es6/#\">http://kangax.github.io/compat-table/es6/#</a>.<br><em>let</em> is currently supported by the modern browsers (even IE11) in theirs last versions and <a href=\"https://github.com/google/traceur-compiler\">Traceur</a> as well.<br>You can try ES6 <em>let</em> on Firefox devtools:  </p>\n<p><img src=\"/img/let.gif\" alt=\"let on firefox nightly\">  </p>\n<ul>\n<li><strong>NOTE</strong>: As well pointed by Michał Gołębiowski on the comments below, browsers implementations are not fully according with the spec, so you may find some bugs.<br>For real world applications, you&#39;ll need to use a traspiler (at least, for a while until mid 2015).  </li>\n</ul>\n<h2 id=\"conclusion\">Conclusion</h2>\n<p>Although simple, declaring variables in JavaScript can cause headache for beginners in the language.<br>With <em>let</em>, to declare variables is much more intuitive and consistent with a C-based language.<br>The use of <em>var</em> should be discontinued, and only the <em>let</em> must exist in the future.<br>There&#39;s no <em>hoisting</em> behavior for variables declared with <em>let</em>.  </p>\n",
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
        "authorDescription": "Internet craftsman, computer scientist and speaker. I am a full-stack web developer for some time and only write code that solves real problems.",
        "authorPicture": "https://avatars2.githubusercontent.com/u/353504?s=460",
        "content": "<p>TC39 - ECMAScript group is finishing the sixth version of ECMAScript specification. The <a href=\"http://www.2ality.com/2014/06/es6-schedule.html\">group schedule</a> points to next June as the release date. By now, no significant differences may appear. It is time to deepen your knowledge into the subject.<br><!-- more -->\nThis post will not cover the importance of writing modular code. ES6 modules are already well displayed by websites like <a href=\"http://jsmodules.io\">JavaScript Modules</a>, by far the best reference. The objective here is to clarify and justify the necessities of releasing a new syntax to write modules.</p>\n",
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
        "authorDescription": "JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "authorPicture": "https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg",
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
        "link": "2014/05/practical-workflows-es6-modules",
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
        "categories": ["talks", " videos"],
        "authorName": "Jaydson",
        "authorLink": "http://twitter.com/jaydson",
        "authorDescription": "JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "authorPicture": "https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg",
        "content": "<p>Allen Wirfs-Brock (<a href=\"https://twitter.com/awbjs\">awbjs</a> on Twitter) is a TC39 member. Actually, he is the &quot;Project Editor of the ECMAScript Language Specification&quot;.</p>\n",
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
        "authorDescription": "JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "authorPicture": "https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg",
        "content": "<p>A talk by <a href=\"https://twitter.com/sebarmeli\">Sebastiano Armeli</a> showing some of the ES6 features like scoping, generators, collections, modules and proxies.</p>\n",
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
        "title": "JavaScript ♥  Unicode",
        "date": "2014-10-13T19:22:32.267Z",
        "comments": "true",
        "published": "true",
        "keywords": "ES6, Unicode",
        "description": "Mathias Bynens talking about Unicode in JavaScript",
        "categories": ["Unicode", " Videos"],
        "content": "<p>O Mathias Bynens deu uma palestra incrível na última edição da <a href=\"http://2014.jsconf.eu\">JSConfEU</a>.<br>Ele falou sobre Unicode no JavaScript, e se você precisa trabalhar pesado com strings, você DEVE assistir esta palestra.<br>Na verdade, mesmo se você não pega tão pesado com strings no JavaScript, esses truques apresentados pelo Mathias são bem úteis.  </p>\n<iframe width=\"560\" height=\"315\" src=\"//www.youtube.com/embed/zi0w7J7MCrk\" frameborder=\"0\" allowfullscreen></iframe>",
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
        "authorPicture": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xfa1/v/t1.0-1/c0.0.160.160/p160x160/10556538_10203722375715942_6849892741161969592_n.jpg?oh=a3044d62663f3d0f4fe74f480b61c9d1&oe=54C6A6B1&__gda__=1422509575_e6364eefdf2fc0e5c96899467d229f62",
        "content": "<h1 id=\"arrow-functions-e-seu-escopo\">Arrow Functions e seu escopo</h1>\n<p>Entre as tantas novas features presentes no ES6, Arrow Functions(ou Fat Arrow Functions), é uma que merece boa atenção!\nÉ muito legal, ótima para trabalhar com escopos, serve como &quot;atalho&quot; para algumas tecnicas que utilizamos hoje, diminui o código...\nMas...pode ser um pouco mais difícil de ler caso não esteja a par de como ela funciona.\nEntão, vamos mergulhar no assunto!</p>\n<h2 id=\"come-ando\">Começando</h2>\n<p>Para estudar e tester por você mesmo, você pode simplesmente copiar alguns dos exemplos deste artigo, e colar no console de seu browser.\nAté o momento, você pode usar o Firefox(22+) Developer Tools, que já oferece suporte a arrow functions.\nNo Google Chrome, você precisará habilita-lo:</p>\n<ul>\n<li>- Habilite: Vá até &quot;about:flags&quot;, e habilite a opção &quot;Experimental JavaScript&quot;</li>\n<li>- Use sempre em uma função em strict mode, por tanto, para rodar no console do Google Chrome, use:</li>\n</ul>\n<pre><code class=\"lang-javascript\">(function(){\n&quot;use strict&quot;;\n// use arrow functions aqui\n}());\n</code></pre>\n<p>Com tempo, felizmente, mais browsers suportarão as features do ES6.\nAgora que tudo está preparado, vamos começar!</p>\n<h2 id=\"um-novo-token\">Um novo Token</h2>\n<p>Um novo Token foi adicionado ao ES6, e é chamado &quot;fat arrow&quot;, representado por:</p>\n<pre><code class=\"lang-javascript\">=&gt;\n</code></pre>\n<h2 id=\"a-nova-sintaxe\">A nova sintaxe</h2>\n<p>COm este novo token, entra uma nova sintaxe:</p>\n<pre><code class=\"lang-javascript\">param =&gt; expression\n</code></pre>\n<p>Sintaxe a qual podemos usar algumas variações, de acordo com o número de statements na expressão, e número de parâmetros passados para a função:</p>\n<pre><code class=\"lang-javascript\">// single param, single statement\nparam =&gt; expression;\n\n// multiple params, single statement\n(param [, param]) =&gt; expression;\n\n// single param, multiple statements\nparam =&gt; {\nstatements;\n}\n\n// multiple params, multiple statements\n([param] [, param]) =&gt; {\nstatements\n}\n\n// with no params, single statement\n() =&gt; expression;\n\n// with no params\n() =&gt; {\nstatements;\n}\n\n// one statement, returning an object\n([param]) =&gt; ({ key: value });\n</code></pre>\n<h2 id=\"como-funciona\">Como funciona</h2>\n<p>Se fossemos &quot;traduzir&quot; arrow functions para algo que já usamos hoje em dia, seria algo assim:</p>\n<pre><code class=\"lang-javascript\">// esta função\nvar func = function (param) {\nreturn param.split(&quot; &quot;);\n}\n\n// se tornaria:\nvar func= param =&gt; param.split(&quot; &quot;);\n</code></pre>\n<p>Isto quer dizer que esta sintaxe realmente retorna uma nova função, com os parâmetros e statements.\nOu seja, podemos chamar esta função do mesmo modo que já estamos acostumados:</p>\n<pre><code class=\"lang-javascript\">func(&quot;Felipe Moura&quot;); // retorna [&quot;Felipe&quot;, &quot;Moura&quot;]\n</code></pre>\n<h2 id=\"immediately-invoked-function-expression-iife-\">Immediately-invoked function expression (IIFE)</h2>\n<p>Sim, você pode invocar funções imediatamente, já que elas são na verdade, expressões.</p>\n<pre><code class=\"lang-javascript\">( x =&gt; x * 2 )( 3 ); // 6\n</code></pre>\n<p>Uma função será criada. Esta função recebe o parâmetro &quot;x&quot;, e retorna &quot;x * 2&quot;, então, é imediatamente executada passando o valor &quot;3&quot; como parâmetro.</p>\n<p>Caso tenha mais statements ou parâmetros:</p>\n<pre><code class=\"lang-javascript\">( (x, y) =&gt; {\nx= x * 2;\nreturn x + y;\n})( 3, &quot;A&quot; ); // &quot;6A&quot;\n</code></pre>\n<h2 id=\"considera-es-relevantes\">Considerações Relevantes</h2>\n<p>Considerando:</p>\n<pre><code class=\"lang-javascript\">func = x =&gt; {\nreturn x++;\n};\n</code></pre>\n<p>Podemos apontar algumas considerações relevantes:</p>\n<p><strong>- <em>arguments</em> funciona exatamente como esperado</strong></p>\n<pre><code class=\"lang-javascript\">console.log(arguments);\n</code></pre>\n<p><strong>- <em>typeof</em> e <em>instanceof</em> também</strong></p>\n<pre><code class=\"lang-javascript\">func instanceof Function; // true\ntypeof func; // function\nfunc.constructor == Function; // true\n</code></pre>\n<p><strong>- Usando parênteses internos, como sugerido pelo jsLint, NÃO funciona</strong></p>\n<pre><code class=\"lang-javascript\">// funciona, como sugerido pelo JSLint\n(function (x, y){\nx= x * 2;\nreturn x + y;\n} (3, &quot;B&quot;) );\n\n// não funciona\n( (x, y) =&gt; {\nx= x * 2;\nreturn x + y;\n} ( 3, &quot;A&quot; ) );\n\n// mas funcionaria, se a última linha fosse\n// })(3, &quot;A&quot;);\n</code></pre>\n<p><strong>- Apesar de ser uma função, não funciona como um Constructor</strong></p>\n<pre><code class=\"lang-javascript\">var instance= new func(); // TypeError: func is not a constructor\n</code></pre>\n<p><strong>- Não tem um prototype</strong></p>\n<pre><code class=\"lang-javascript\">func.prototype; // undefined\n</code></pre>\n<h2 id=\"escopo\">Escopo</h2>\n<p>O <em>this</em> no escopo de arrow functions funciona de uma forma diferente.\nNo modo como estamos acostumados, <em>this</em> pode referenciar-se a: <em>window</em>(se for acessado globalmente), <em>undefined</em>(se acessado globalmente, em strict mode), uma <em>instancia</em>(se em um construtor), um <em>objeto</em>(se for um método ou função dentro de um objeto ou instância) ou em um <em>.bind/.apply</em>. Pode ser também um <em>DOMElement</em>, por exemplo, quando usado em um addEventListener.\nAlgumas vezes, isto incomoda bastante, ou pode até mesmo nos pegar de surpresa e causar algum problema!\nAlém disso, <em>this</em> é referenciado como <em>&quot;scope-by-flow&quot;</em> (fluxo-escopo). O que quero dizer com isto?</p>\n<p>Vejamos primero, como <em>this</em> se comporta em diferentes situações:</p>\n<p>Em um EventListener:</p>\n<pre><code class=\"lang-javascript\">document.body.addEventListener(&#39;click&#39;, function(evt){\nconsole.log(this); // o próprio HTMLBodyElement\n});\n</code></pre>\n<p>Em instâncias:</p>\n<pre><code class=\"lang-javascript\">function Person () {\nlet fullName = null;\nthis.getName = function () {\nreturn fullName;\n};\nthis.setName = function (name) {\nfullName = name;\nreturn this;\n};\n}\n\nlet jon = new Person();\njon.setName(&quot;Jon Doe&quot;);\nconsole.log(jon.getName()); // &quot;Jon Doe&quot;\n</code></pre>\n<p>Nesta situação em particular, uma vez que <em>Person.setName</em> é &quot;chainable&quot;(retornando a própria instancia), poderíamos também usar assim:</p>\n<pre><code class=\"lang-javascript\">jon.setName(&quot;Jon Doe&quot;)\n.getName(); // &quot;Jon Doe&quot;\n</code></pre>\n<p>Em um objeto:</p>\n<pre><code class=\"lang-javascript\">let obj = {\nfoo: &quot;bar&quot;,\ngetIt: function () {\nreturn this.foo;\n}\n};\n\nconsole.log( obj.getIt() ); // &quot;bar&quot;\n</code></pre>\n<p>Mas então, vem a situação que citei acima, do formato escopo/fluxo.\nSe tanto o fluxo ou o escopo mudam, <em>this</em> muda com ele.\\</p>\n<pre><code class=\"lang-javascript\">function Student(data){\n\nthis.name = data.name || &quot;Jon Doe&quot;;\nthis.age = data.age&gt;=0 ? data.age : -1;\n\nthis.getInfo = function () {\nreturn this.name + &quot;, &quot; + this.age;\n};\n\nthis.sayHi = function () {\nwindow.setTimeout( function () {\nconsole.log( this );\n}, 100 );\n}\n\n}\n\nlet mary = new Student({\nname: &quot;Mary Lou&quot;,\nage: 13\n});\n\nconsole.log( mary.getInfo() ); // &quot;Mary Lou, 13&quot;\nmary.sayHi();\n// window\n</code></pre>\n<p>Uma vez que <em>setTimeout</em> muda o fluxo da execução, a referência ao <em>this</em> se torna a referência &quot;global&quot;, neste caso, <em>window</em>, ou <em>undefined</em> se em &quot;strict mode&quot;.\nPor causa disto, acabamos usando algumas técnicas como o uso de variáveis como &quot;self&quot;, &quot;that&quot;, ou alguma coisa assim, ou tendo que usar &quot;.bind&quot;.</p>\n<p>Mas não se preocupe, arrow functions estão aqui para ajudar!\nCom arrow functions, o escopo é mantido com ela, de onde ela foi chamada.</p>\n<p>Vejamos o MESMO exemplo acima, mas usando arrow function, passada para a chamada do _setTimeout.</p>\n<pre><code class=\"lang-javascript\">function Student(data){\n\nthis.name = data.name || &quot;Jon Doe&quot;;\nthis.age = data.age&gt;=0 ? data.age : -1;\n\nthis.getInfo = function () {\nreturn this.name + &quot;, &quot; + this.age;\n};\n\nthis.sayHi = function () {\nwindow.setTimeout( ()=&gt;{ // a única diferença está aqui\nconsole.log( this );\n}, 100 );\n}\n\n}\n\nlet mary = new Student({\nname: &quot;Mary Lou&quot;,\nage: 13\n});\n\nconsole.log( mary.getInfo() ); // &quot;Mary Lou, 13&quot;\nmary.sayHi();\n// Object { name: &quot;Mary Lou&quot;, age: 13, ... }\n</code></pre>\n<h2 id=\"abordagens-teis-e-interessantes\">Abordagens úteis e interessantes</h2>\n<p>Já que é muito fácil criar arrow functions, e seus escopos funcionam como o mensionado, podemosusa-las de várias formas.</p>\n<p>Por exemplo, podemos usa-las diretamente na chamada de um forEach, em uma Array:</p>\n<pre><code class=\"lang-javascript\">var arr= [&#39;a&#39;, &#39;e&#39;, &#39;i&#39;, &#39;o&#39;, &#39;u&#39;];\narr.forEach(vowel =&gt; {\nconsole.log(vowel);\n});\n</code></pre>\n<p>Ou em um Array.map:</p>\n<pre><code class=\"lang-javascript\">var arr= [&#39;a&#39;, &#39;e&#39;, &#39;i&#39;, &#39;o&#39;, &#39;u&#39;];\narr.map(vogal =&gt; {\nreturn vogal.toUpperCase();\n});\n// [ &quot;A&quot;, &quot;E&quot;, &quot;I&quot;, &quot;O&quot;, &quot;U&quot; ]\n</code></pre>\n<p>Ou em uma função recursiva:</p>\n<pre><code class=\"lang-javascript\">var fatorial = (n) =&gt; {\nif(n==0) {\nreturn 1;\n}\nreturn (n * fatorial (n-1) );\n}\n\nfatorial(6); // 720\n</code></pre>\n<p>Também, digamos, ordenando uma Array de tráz para frente:</p>\n<pre><code class=\"lang-javascript\">let arr= [&#39;a&#39;, &#39;e&#39;, &#39;i&#39;, &#39;o&#39;, &#39;u&#39;];\narr.sort( (a, b)=&gt; a &lt; b? 1: -1 );\n</code></pre>\n<p>Ou em listeners:</p>\n<pre><code class=\"lang-javascript\">document.body.addEventListener(&#39;click&#39;, body=&gt;console.log(body));\n</code></pre>\n<h2 id=\"links-teis\">Links úteis</h2>\n<p>Aqui, pegue alguns links úteis para dar uma olhada:</p>\n<ul>\n<li>- <a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions\">Arrow Functions na documentação da MDN</a></li>\n<li>- <a href=\"http://tc39wiki.calculist.org/es6/arrow-functions/\">TC39 Wiki sobre Arrow Function</a></li>\n<li>- <a href=\"https://github.com/esnext\">ESNext</a></li>\n<li>- <a href=\"https://github.com/addyosmani/es6-tools\">ES6 Tools</a></li>\n<li>- <a href=\"https://www.npmjs.org/package/grunt-es6-transpiler\">Grunt ES6 Transpiler</a></li>\n<li>- <a href=\"http://www.es6fiddle.net/\">ES6 Fiddle</a></li>\n<li>- <a href=\"http://kangax.github.io/compat-table/es6/\">ES6 Compatibility Table</a></li>\n</ul>\n<h2 id=\"conclus-o\">Conclusão</h2>\n<p>Mesmo que Arrow Functions tornem seu código um popuco mais complicado de ler(mas que você acaba se acostumando rápido), é uma grande solução para referências ao <em>this</em> em escopos e fluxos diferentes, um modo rápido para colocar as coisas para funcionar, e em parceria com o keyword &quot;let&quot;, levará nosso JavaScript para um próximo nível!\nExperimente você mesmo, crie alguns testes, rode em seus browsers e deixe alguma solução ou uso interessante que encontrou, nos comentários!\nEspero que tenha apreciado este artigo tanto quanto apreciará utilizar arrow functions em um futuro muito próximo!</p>\n",
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
        "content": "<p>Se você está interessado em ES6, você deve seguir o <a href=\"https://twitter.com/rauschma\">Dr. Axel Rauschmayer</a>.<br>Ele mantêm o incrível blog <a href=\"http://www.2ality.com/\">2ality</a> e escreve uma série de coisas legais sobre ES6.<br>Nessa sua talk ele fala sobre várias novas features da ES6 e mostra o que podemos esperar do futuro.  </p>\n<script async class=\"speakerdeck-embed\" data-id=\"4126347010d6013231af66d414c0f9a8\" data-ratio=\"1.33333333333333\" src=\"//speakerdeck.com/assets/embed.js\"></script>  \n\n<p>[UPDATE October, 2014]<br>The video is already online! (Thanks <a href=\"https://github.com/cirocosta\">Ciro Costa</a> for point this).  </p>\n<iframe width=\"560\" height=\"315\" src=\"//www.youtube.com/embed/G21rdWfa_as\" frameborder=\"0\" allowfullscreen></iframe>",
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
        "authorName": "Jaydson",
        "authorLink": "http://twitter.com/jaydson",
        "authorDescription": "JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "authorPicture": "https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg",
        "content": "<p>Declaração de variáveis em qualquer linguagem de programação é algo básico.<br>Independente da linguagem, entender o funcionamento do escopo de variáveis é imprescindível para escrever qualquer programa.<br>Em Python, por exemplo, assim como na maioria das linguagens, existem 2 escopos: Local e Global.<br>Variáveis definidas na raíz do arquivo, sem identação são variáveis de escopo Global.<br>Variáveis que são declaradas dentro do corpo de uma função são consideradas de escopo local.<br>Até aqui, tudo é muito parecido. No JavaScript o comportamente é bem semelhante.<br>Vejamos um exemplo nas 2 linguagens:  </p>\n<pre><code class=\"lang-python\"># Python\nx = 1 # global scope\ny = 3\n\ndef sum(a, b):\n    s = a + b # local scope\n    return s\n</code></pre>\n<pre><code class=\"lang-javascript\">// JavaScript\nvar x = 1;  // global scope\nvar y = 3;\n\nfunction sum(a, b) {\n    var s = a + b;  // local scope\n    return s;\n}\n</code></pre>\n<p>Na maioria das linguagens baseadas em C (JavaScript, PHP), as variáveis são criadas no local onde foram declaradas.<br>Entretanto, no JavaScript isso é diferente, e pode se tornar complicado.<br>Ao declarar uma variável no corpo de uma função, a mesma é movida para o topo ou para o escopo global. Esse comportamento é chamado de <a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var#var_hoisting\"><em>hoisting</em></a>.<br>Diferentemente de Python e outras linguagens, no JavaScript, uma variável declarada em um for loop acaba vazando o seu valor.<br>Veja no exemplo abaixo:  </p>\n<pre><code class=\"lang-javascript\">// JavaScript\nfor (var i = 0; i &lt;= 2; i += 1) {\n    console.log(i); // current i\n}\nconsole.log(i); // last i\n</code></pre>\n<p>Neste caso, mesmo fora do bloco do for loop, a variável i ainda existe e com o último valor recebido no laço.<br>Este é um problema bem comum onde um programa pode ser facilmente quebrado por falta de atenção.  </p>\n<p>Outro fator importante no JavaScript é que a omissão de <em>var</em> para declarar uma variável faz com que a mesma seja alocada no escopo global, e isso pode causar inúmeros problemas.  </p>\n<h2 id=\"declara-o-let\">Declaração let</h2>\n<p>O <em>let</em> chega na ES6 como um substituto do <em>var</em>. Sim, a ideia é que var seja descontinuado em um futuro distante, pois hoje seria impossível não suporta-lo sem quebrar 100% da internet.<br>O <em>let</em> funciona como o esperado, definindo a variável no local onde ela foi declarada.<br>Exemplo:  </p>\n<pre><code class=\"lang-javascript\">let foo = true;\nif  (foo) {\n    let bar = &#39;baz&#39;;\n    console.log(bar); // outputs &#39;baz&#39;\n}\n\ntry {\n    console.log(bar);\n} catch (e) {\n    console.log(&quot;bar doesn&#39;t exist&quot;);\n}\n</code></pre>\n<p>Como você já deve imaginar, com <em>let</em> é possível resolver o problema com a variável no for loop.<br>Veja:  </p>\n<pre><code class=\"lang-javascript\">// JavaScript\nfor (let i = 0; i &lt;= 2; i += 1) {\n    console.log(i); // current i\n}\ntry {\n    console.log(i);\n} catch (e) {\n    console.log(&quot;i doesn&#39;t exist&quot;);\n}\n</code></pre>\n<h2 id=\"suporte-atual\">Suporte atual</h2>\n<p>Você pode usar <em>let</em> hoje*<br>Olhe a excelente tabela ES6 feita pelo Kangax &gt; <a href=\"http://kangax.github.io/compat-table/es6/#\">http://kangax.github.io/compat-table/es6/#</a>.<br><em>let</em> é atualmente suporttado pelos browsers modernos(até no IE11) em suas últimas versões e no <a href=\"https://github.com/google/traceur-compiler\">Traceur</a>.<br>Você pode brincar com ES6 <em>let</em> no Firefox devtools:  </p>\n<p><img src=\"/img/let.gif\" alt=\"let on firefox nightly\">  </p>\n<ul>\n<li><strong>NOTA</strong>: Como bem apontado pelo Michał Gołębiowski nos comentários (post em inglês <a href=\"http://es6rocks.com/2014/08/what-you-need-to-know-about-block-scope-let/#comment-1576757325\">http://es6rocks.com/2014/08/what-you-need-to-know-about-block-scope-let/#comment-1576757325</a>), as implementações atuais dos browsers não estão totalmente de acordo com a especificação, então é possível encontrar alguns bugs.<br>Para aplicações do mundo real, você precisará utilizar um transpiler(pelo menos por enquanto, até o meio de 2015).  </li>\n</ul>\n<h2 id=\"conclus-o\">Conclusão</h2>\n<p>Apesar de simples, declarar variáveis no JavaScript pode causar dor de cabeça em iniciantes na linguagem.<br>Com o <em>let</em>, declarar variáveis fica muito mais intuítivo e coerente com uma linguagem baseada em C.<br>O uso do <em>var</em> deve ser descontinuado, e apenas o <em>let</em> deve existir no futuro.<br>Não existe o comportamento de <em>hoisting</em> para variáveis declaradas com <em>let</em>.  </p>\n<h2 id=\"outras-refer-ncias\">Outras referências</h2>\n<p><a href=\"https://people.mozilla.org/~jorendorff/es6-draft.html#sec-let-and-const-declarations\">https://people.mozilla.org/~jorendorff/es6-draft.html#sec-let-and-const-declarations</a><br><a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let\">https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let</a><br><a href=\"http://odetocode.com/blogs/scott/archive/2014/07/31/the-features-of-es6-part-1-let.aspx\">http://odetocode.com/blogs/scott/archive/2014/07/31/the-features-of-es6-part-1-let.aspx</a>  </p>\n",
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
        "authorDescription": "Internet craftsman, computer scientist and speaker. I am a full-stack web developer for some time and only write code that solves real problems.",
        "authorPicture": "https://avatars2.githubusercontent.com/u/353504?s=460",
        "content": "<p>O grupo TC39 - ECMAScript já está finalizando a sexta versão da especificação do ECMAScript. A <a href=\"http://www.2ality.com/2014/06/es6-schedule.html\">agenda do grupo</a> aponta o mês de junho do próximo ano como sendo a data de lançamento. A partir de agora, poucas mudanças significativas devem surgir. Já é tempo de se aprofundar no estudo.</p>\n<p>Este artigo não pretende abordar a importância da escrita de código modularizado. Já escrevi sobre o assunto no artigo <a href=\"http://tableless.com.br/modularizacao-em-javascript\">Modularização em JavaScript</a>. Sites como <a href=\"http://jsmodules.io\">JavaScript Modules</a> entre outros já são uma ótima referência sobre como escrever módulos ES6. A intenção aqui é esclarecer e justificar a necessidade de uma nova sintaxe para escrita de módulos.</p>\n",
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
        "authorName": "Jaydson",
        "authorLink": "http://twitter.com/jaydson",
        "authorDescription": "JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "authorPicture": "https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg",
        "content": "<p>Allen Wirfs-Brock (<a href=\"https://twitter.com/awbjs\">awbjs</a> no Twitter) é um membro do comitê TC39. Na verdade, ele é o &quot;Project Editor of the ECMAScript Language Specification&quot;, ou seja, editor chefe da ECMA.  </p>\n",
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
        "authorName": "Jaydson",
        "authorLink": "http://twitter.com/jaydson",
        "authorDescription": "JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "authorPicture": "https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg",
        "content": "<p>Uma palestra do <a href=\"https://twitter.com/sebarmeli\">Sebastiano Armeli</a> mostrando algumas features da ES6 como scoping, generators, collections, modules and proxies.  </p>\n",
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
        "authorName": "Jaydson",
        "authorLink": "http://twitter.com/jaydson",
        "authorDescription": "JavaScript enthusiast - FrontEnd Engineer at Terra Networks - BrazilJS and RSJS curator",
        "authorPicture": "https://pbs.twimg.com/profile_images/453720347620032512/UM2nE21c_400x400.jpeg",
        "content": "<p>Olá pessoal, bem-vindos ao ES6Rocks!\nNossa missão aqui é discutir sobre a <a href=\"http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts\">a nova versão do JavaScript</a>, mais conhecida como Harmony ou ES.next.</p>\n",
        "file": "./src/posts/hello-world.md",
        "filename": "hello-world",
        "link": "pt-br/2014/05/hello-world",
        "lang": "pt-br",
        "default_lang": true
      }]
    };
  },
  getPages: function() {
    return [];
  }
}, {});

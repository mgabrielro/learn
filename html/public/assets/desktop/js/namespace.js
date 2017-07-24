/**
 * Gets and/or creates a namespace object by its full qualified name.
 * Also runs a given callback method with the scope of the passed in namespace.
 *
 * @param namespaceName The full qualified namespace name (e.g. c24.main.pages.customer)
 * @param [callback] Callback to be called with given namespace scope
 * @returns object
 */
function namespace(namespaceName, callback) {

    var parts = namespaceName.split('.'),
        parent = window,
        currentPart = '',
        hasCallback = !!callback;

    for(var i = 0, length = parts.length; i < length; i++) {
        currentPart = parts[i];
        // Check for existing namespace
        // If this one does not exist, create new one with parent namespace
        parent[currentPart] = parent[currentPart] || {parentNS: parent};
        parent = parent[currentPart];
    }

    if(hasCallback) callback.apply(parent, null);
    return parent;

}

/**
 * Get a namespace with methodname as string and change this in type function
 * @param string method The name of namespace with methodename
 * @returns {*}
 */
function getNamespacedMethod(method) {

    var ns = method.split('.');
    var methodName = ns.pop();
    ns = ns.join('.');

    if (ns.length == 0) {
        ns = 'window';
    }

    return namespace(ns)[methodName];

}

var Class = {
    create: function () {
        var methods = null,
            parent = undefined,
            klass = function () {
                this.$super = function (method, args) {
                    return Class.$super(this.$parent, this, method, args);
                };
                this.initialize.apply(this, arguments);
            };

        if (typeof arguments[0] === 'function') {
            parent = arguments[0];
            methods = arguments[1];
        } else {
            methods = arguments[0];
        }

        if (typeof parent !== 'undefined') {
            Class.extend(klass.prototype, parent.prototype);
            klass.prototype.$parent = parent.prototype;
        }

        Class.mixin(klass, methods);
        Class.extend(klass.prototype, methods);
        klass.prototype.constructor = klass;

        if (!klass.prototype.initialize)
            klass.prototype.initialize = function () {
            };

        return klass;
    },

    mixin: function (klass, methods) {
        if (typeof methods.include !== 'undefined') {
            if (typeof methods.include === 'function') {
                Class.extend(klass.prototype, methods.include.prototype);
            } else {
                for (var i = 0; i < methods.include.length; i++) {
                    Class.extend(klass.prototype, methods.include[i].prototype);
                }
            }
        }
    },

    extend: function (destination, source) {
        for (var property in source)
            destination[property] = source[property];
        return destination;
    },
    $super: function (parentClass, instance, method, args) {
        return parentClass[method].apply(instance, args);
    }
};
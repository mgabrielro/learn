/**
 * @namespace c24
 * @name c24.declare
 * @author Andreas Frömer <andreas.froemer@check24.de>
 */
(function(window) {
    "use strict";

    var c24 = window.c24 = window.c24 || {};

    /**
     * Declare a new object from given fqn
     *
     * @param {String} name
     * @param {Function|Array} deps
     * @param {Function} factory
     */
    function declare(name, deps, factory) {
        var parts = name.split('.'),
            parent = window,
            currentPart = '';

        factory = factory || (typeof deps === 'function' ? deps : function() {});
        deps = deps.hasOwnProperty('length') ? deps : [];

        for(var i = 0, length = parts.length-1; i < length; i++) {
            currentPart = parts[i];
            parent[currentPart] = parent[currentPart] || {};
            parent = parent[currentPart];
        }

        var lastPart = parts[parts.length-1];

        if (!!parent[lastPart]) {
            throw 'Cannot redeclare: ' +  name;
        }

        parent[lastPart] = factory.apply(window, deps);
    }

    c24.declare = declare;

})(window);
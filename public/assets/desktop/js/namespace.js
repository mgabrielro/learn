/**
 * Gets and/or creates a namespace object by its full qualified name.
 * Also runs a given callback method with the scope of the passed in namespace.
 *
 * @param namespaceName The full qualified namespace name (e.g. c24.main.pages.customer)
 * @param [callback] Callback to be called with given namespace scope
 * @param [namespaceToExtendFrom] A "base" ObjectLateral from which the new namespace should "inherit" properties and methods. This is NOT for real inheritance!!!
 * @returns object
 */
function namespace(namespaceName, callback, namespaceToExtendFrom) {
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

    if(!!namespaceToExtendFrom){
        parent = $.extend(parent, namespaceToExtendFrom);
    }

    return parent;
}
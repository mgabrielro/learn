var CONSTANTS = (function() {

    var privateConstants = {
        URLS: {
            FAVORITE: 'app/api/favorite'
        }
    };

    var getValueByString =  function(string) {

        string = string.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        string = string.replace(/^\./, '');           // strip a leading dot

        var array = string.split('.');

        for (var i = 0, n = array.length; i < n; ++i) {
            var key = array[i];
            if (key in privateConstants) {
                privateConstants = privateConstants[key];
            } else {
                return;
            }
        }

        return privateConstants;

    };

    return {
        get: function(name) {

            if (name.indexOf('.') >= 0) {
                return getValueByString(name);
            }

            return (privateConstants[name]) ? privateConstants[name] : undefined;
        }
    };

})();
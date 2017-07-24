(function (window, document, $, undefined) {

    "use strict";

    var ns = window.namespace("formElements");

    /**
     * DOM Elements
     *
     * @type {{$item: null, $container: null, $hidden: null}}
     */
    var domElements = {
        $item: null,
        $container: null,
        $hidden: null
    };

    ns.radioList = {

        /**
         * Needed Classes
         */
        classes: {
            item:      '.radio-list__item',
            active:    '.radio-list__item--active',
            container: '.radio-list__container',
            radio:     '.radio-list__input'
        },

        /**
         * init function
         */
        init: function () {

            $(function () {

                var self = ns.radioList;
                domElements.$item = $(self.classes.item);
                domElements.$item.on('click', eventHandlers.clickEventHandler);

            });

        }
    };

    /**
     * Private Methods
     */
    var privateMethods = {

        /**
         * Add and Remove active Class
         *
         * @param $element
         */
        toggleActiveClass: function($element) {

            var cssClass = ns.radioList.classes.active.substr(1);
            var $active = domElements.$container.find(ns.radioList.classes.active);
            $active.removeClass(cssClass);
            $element.addClass(cssClass);

        },

        /**
         * Change the value of the hidden field
         *
         * @param value
         */
        changeValue: function (value) {

            domElements.$hidden = domElements.$container.find(':hidden');
            domElements.$hidden.val(value);

        }

    };

    /**
     * Event Handlers
     */
    var eventHandlers = {

        /**
         * Click for row on radio list
         */
        clickEventHandler: function () {

            var self = $(this);

            if (!self.hasClass(ns.radioList.classes.active.substr(1))) {

                var selectedValue = self.children(ns.radioList.classes.radio).val();
                domElements.$container = self.closest(ns.radioList.classes.container);
                privateMethods.changeValue(selectedValue);
                privateMethods.toggleActiveClass(self);

            }
        }

    };

    ns.radioList.init();

})(window, window.document, window.jQuery, undefined);

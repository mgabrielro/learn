/**
 * Toggle Elements and show content container
 *
 * You need this structure of html
 *
 * <element class='js-toggle'>
 *  <element class='js-toggle__item js-toggle__item--active'></element
 *  <element class='js-toggle__item'></element>
 *  <element class='js-toggle__content'></element>
 * </element>
 */
(function (window, document, $, undefined) {

    "use strict";

    var ns = window.namespace("domElements");

    /**
     * DOM Elements
     *
     */
    var domElements = {
        $container:      null,
        $content:        null,
        $clickedElement: null,
        $item:           null
    };

    ns.toggle = {

        /**
         * Needed Classes
         */
        classes: {
            container:     '.js-toggle',
            item:          '.js-toggle__item',
            activeItem:    '.js-toggle__item--active',
            content:       '.js-toggle__content',
            activeContent: '.js-toggle__content--active'
        },

        /**
         * init function
         */
        init: function () {

            $(function () {

                var self = ns.toggle;
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
         *  Toggle click elements
         */
        toggleActiveElement: function () {

            var $notActive = domElements.$container.children(
                ns.toggle.classes.item +
                ':not('+ ns.toggle.classes.activeItem +')'
            );

            var activeClass = ns.toggle.classes.activeItem.substr(1);
            domElements.$clickedElement.removeClass(activeClass);
            $notActive.addClass(activeClass);

        },

        /**
         * Toggle Content Block
         */
        toggleContent: function () {
            domElements.$content.toggleClass(ns.toggle.classes.activeContent.substr(1));
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

            domElements.$clickedElement = $(this);

            if (domElements.$clickedElement.hasClass(ns.toggle.classes.activeItem.substr(1))) {

                domElements.$container = domElements.$clickedElement.closest(ns.toggle.classes.container);
                domElements.$content = domElements.$container.children(ns.toggle.classes.content);
                privateMethods.toggleActiveElement();
                privateMethods.toggleContent();

            }

        }
    };

    ns.toggle.init();

})(window, window.document, window.jQuery, undefined);

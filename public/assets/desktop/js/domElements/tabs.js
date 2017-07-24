/**
 * Javascript for TabChanging
 *
 * You need this structure of html
 *
 * <element class='tabs'>
 *  <element class='tabs__header-item tabs__header-item--active'>active Tab first</element>
 *  <element class='tabs__header-item'>inactive Tab second</element>
 *  <element class='tabs__header-item'>inactive Tab third</element>
 *  <element class='tabs__content-item tabs__content-item--active'>content active of first tab</element>
 *  <element class='tabs__content-item'>content of second tab</element>
 *  <element class='tabs__content-item'>content of third tab</element>
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
        $container:       null,
        $contentElements: null,
        $activeTab:       null,
        $clickedTab:      null,
        $item:            null
    };

    /**
     * Index of active Tab and clicked Element
     * @type {{old: null, new: null}}
     */
    var elementIndex = {
        old: null,
        new: null
    };

    ns.tabs = {

        /**
         * Needed Classes
         */
        classes: {
            container:     '.tabs',
            item:          '.tabs__header-item',
            activeItem:    '.tabs__header-item--active',
            content:       '.tabs__content-item',
            activeContent: '.tabs__content-item--active'
        },

        /**
         * init function
         */
        init: function () {

            $(function () {

                var self = ns.tabs;
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

            var activeClass = ns.tabs.classes.activeItem.substr(1);
            domElements.$activeTab.removeClass(activeClass);
            domElements.$clickedTab.addClass(activeClass);

        },

        /**
         * Toggle Content Block
         */
        toggleActiveContent: function () {

            var className = ns.tabs.classes.activeContent.substr(1);
            $(domElements.$contentElements[elementIndex.old]).removeClass(className);
            $(domElements.$contentElements[elementIndex.new]).addClass(className);

        },

        /**
         * Set the Index of the old and the active Element to vars
         */
        setIndexOfElement: function () {

            var childItems = domElements.$container.find(ns.tabs.classes.item);
            elementIndex.old = childItems.index(domElements.$activeTab);
            elementIndex.new = childItems.index(domElements.$clickedTab);

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

            domElements.$clickedTab = $(this);

            if (!domElements.$clickedTab.hasClass(ns.tabs.classes.activeItem.substr(1))) {

                domElements.$container = domElements.$clickedTab.closest(ns.tabs.classes.container);
                domElements.$contentElements = domElements.$container.find(ns.tabs.classes.content);
                domElements.$activeTab = domElements.$container.find(ns.tabs.classes.activeItem);

                privateMethods.setIndexOfElement();
                privateMethods.toggleActiveElement();
                privateMethods.toggleActiveContent ();

            }

        }
    };

    ns.tabs.init();

})(window, window.document, window.jQuery, undefined);

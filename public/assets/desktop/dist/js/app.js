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

            $((function () {

                var self = ns.tabs;
                domElements.$item = $(self.classes.item);
                domElements.$item.on('click', eventHandlers.clickEventHandler);

            }));

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

            $((function () {

                var self = ns.toggle;
                domElements.$item = $(self.classes.item);
                domElements.$item.on('click', eventHandlers.clickEventHandler);

            }));

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

            $((function () {

                var self = ns.radioList;
                domElements.$item = $(self.classes.item);
                domElements.$item.on('click', eventHandlers.clickEventHandler);

            }));

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
/**
 * @file: tooltip.js
 * @author: Siegfried Diel <siegfried.diel@check24.de>
 * @author: Christian Fasel <christian.fasel@check24.de>
 * @author: Ignaz Schlennert <ignaz.schlennert@check24.de>
 * @date: 28.12.2015
 *
 * @namespace c24.vv.common
 * @name tooltip
 *
 *
 * DO NOT CHANGE THIS FILE!!! CHANGES ON THIS FILE WILL BE REJECTED!!!
 */
(function (ns, window, document, undefined) {

    'use strict';

    var REMOTE_TOOLTIP = 'remote';

    var REMOTE_USER = 'public';

    /*
     * private methods
     */

    var currentOptions = {};

    var defaultOptions = {
        show: {
            // Opening delay for tooltips.
            delay: 150,
            // Should tooltip be opened?
            ready: true,
            // Remove fade-effect in order to make it open faster.
            effect: false
        },
        style: {
            // Giving our tooltip container a class.
            classes: 'c24-tooltip',
            tip: {
                // Setting corner width.
                width: 15,
                // Setting corner height.
                height: 10
            }
        },
        position:  {
            at: 'center right',
            my: 'center left'
        },
        // Behavior of tooltips on hiding.
        hide: false,
        // Don't destroy the instance on hide. Keep it and just show it again on hover.
        overwrite: false,
        // If true, the viewport will be dynamically set, otherwise will use one from currentOptions
        overwrite_viewport: true
    };

    var offsetAdaptions = {
        'bottom left':  {
            style:    {
                tip: {
                    // makes element look like it is positioned at bottom center (tip in the middle)
                    mimic: 'bottom center'
                }
            },
            position: {
                // Adjustment for indented corner
                adjust: {
                    y: -5
                }
            }
        },
        'bottom right': {
            style:    {
                tip: {
                    // makes element look like it is positioned at bottom center (tip in the middle)
                    mimic: 'bottom center'
                }
            },
            position: {
                // Adjustment for indented corner
                adjust: {
                    y: -5
                }
            }
        },
        'top left':     {
            style: {
                tip: {
                    // makes element look like it is positioned at top center (tip in the middle)
                    mimic: 'top center'
                }
            }
        },
        'top right':    {
            style: {
                tip: {
                    // makes element look like it is positioned at top center (tip in the middle)
                    mimic: 'top center'
                }
            }
        }
    };

    var $trigger_elements;

    /**
     * Initializes tooltip triggers and display
     */
    function initTooltip() {

        resetOptions();

        // Set the z-index not so high, default of qtip is 1500
        $.fn.qtip.zindex = 800;

        var click_or_touch_event = isMobileDevice() ? 'touchend' : 'click';

        $trigger_elements = $('.c24-tooltip-trigger');

        if (!isMobileDevice()) {

            /**
             * Create qTip-Tooltip if element was hovered. More efficient than giving all
             * trigger elements on page a widget instance.
             */
            $(document).on('mouseover', '.c24-tooltip-trigger', (function () {

                var $trigger_elem = $(this);

                if (!$trigger_elem.data('tooltipOnlyOnClick')) {
                    createOnElement($trigger_elem);
                }

            }));

        }

        /**
         * Close tooltips when clicking somewhere else.
         */
        $(document).on(click_or_touch_event, (function (event) {

            var $target = $(event.target);

            if ($target[0].nodeName.toLowerCase() === 'input') {

                /****************************************************************************
                 * Special hack for Internet Explorer.                                      *
                 * When a label of a checkbox has been clicked, other browsers              *
                 * tick the corresponding checkbox immediately.                             *
                 * Internet Explorer allows events to be between these two processes -.-    *
                 * In our case, the tooltip disappears before the checkbox has been ticked  *
                 ****************************************************************************/

                var $correspondingLabel = $('label[for="' + $target.prop('name') + '"]');

                if ($correspondingLabel.length) {
                    return;
                }

            }

            if (!$target.hasClass('c24-tooltip-trigger') &&
                !$target.parents('.c24-tooltip-trigger').length &&
                !$target.parents('.qtip').length
            ) {
                $('.qtip').not($target).qtip('hide');
            }

        }));

        /**
         * Close Tooltip on scrolling (PVPKV-2743) only in comparesite
         * By arrangement with Dana that tooltip hide by scroll only in comparesite, because bug fixed in resultsite with browser firefox and favorit-tooltip(PVPKV-2902)
         */
        $(document).on('scroll', (function () {

            if($('#compare').length > 0){
                $('.qtip').qtip('hide');
            }

        }));

        /**
         * Clicking on a trigger element.
         * Event "touchend" should be given, because Apple devices seem to have another event priority.
         * The first touch would fire a "mouseover"-event on those devices. The second one would be a click.
         * To prevent double tapping the trigger element, parameter "touchend" must be given.
         */
        $(document).on(click_or_touch_event, $trigger_elements.selector, create_tooltip_when_clicked);

        /**
         * Hiding tooltip if close button is clicked.
         */
        $(document).on(click_or_touch_event, '.qtip-content .close', (function (event) {

            var $target = $(event.target);
            var $tooltip_id = $target.parents('.qtip').data('qtipId');
            var $trigger_element = $('.c24-tooltip-trigger[data-hasqtip=' + $tooltip_id + ']');

            $trigger_element.qtip('hide');

        }));

    }

    /**
     * Returns options augmented with elements option overrides.
     *
     * @param {jQuery} $element Given trigger element.
     * @returns {Object}
     */
    function prepareOptions($element) {

        var $rootContainer = $(window);
        var $tooltipTarget = $element.find($element.data('tooltipTarget'));

        var output = {
            position: {
                // Get the x- and y-values of given corner.
                my: $element.data('tooltipCornerPos'),
                // Get position of tooltip window relative to trigger
                at: $element.data('tooltipPos'),
                // Positioning tooltip to the target.
                target: $tooltipTarget.length ? $tooltipTarget : $element,
                adjust: {}
            },
            style:    {
                width:  $element.data('tooltipWidth'), // Setting tooltip width.
                height: $element.data('tooltipHeight') // Setting tooltip height.
            },

            /**
             * Multiple callbacks for events, here can have lots of things triggered from a single tooltip event.
             */
            events: {

                /**
                 * @param {jQuery.Event} event The jQuery.Event
                 * @param {Object} api The Tooltip from API
                 */
                render: function(event, api) {

                    // Grab the tooltip element from the API
                    var tooltip = api.elements.tooltip;

                    if (typeof $element.data('tooltip-callbacks') === 'string') {

                        /**
                         * Get the value of data-attribute 'tooltip-callbacks'
                         * The value should only names of the known eventname from qTip2. example: show, hide
                         * This methode is a callback after the event(show, hide) is finish than the namespace with mehtod is handle
                         */
                        $element.data('tooltip-callbacks').split(' ').forEach((function(eventName) {

                            var callback = $element.data('tooltip-callback-' + eventName);
                            callback = getNamespacedMethod(callback);

                            if (typeof callback === 'function') {
                                tooltip.bind('tooltip' + eventName, callback);
                            }

                        }));
                        
                    }

                }

            }

        };

        if (currentOptions.overwrite_viewport) {
            // Taking $(window) for all would be buggy cause of viewport problems on some Apple devices.
            output.position.viewport = $rootContainer.length ? $rootContainer : $(window);
        }

        if (typeof output.position.my !== 'undefined') {
            output.position.my = output.position.my.match(/\w+ \w+/); // Setting anchor of tooltip
            output.position.my = (output.position.my.length) ? output.position.my.pop() : null;
        }

        if (typeof output.position.at !== 'undefined') {
            output.position.at = output.position.at.match(/\w+ \w+/);
            output.position.at = (output.position.at.length) ? output.position.at.pop() : null;
        }

        output = $.extend(true, {}, currentOptions, output);

        var cornerPosition = output.position.my.match(/(\w+) (\w+)/);

        // Choosing adjust method.
        // If tooltip is opened to the horizontal side -> Give flip-method to x-axis and shift-method to y-axis.
        // Behavior method of tooltip when colliding with given viewport.
        output.position.adjust.method =
            (cornerPosition[1] === 'bottom' || cornerPosition[1] === 'top') ? "shift flip" : "flip shift";

        if (offsetAdaptions.hasOwnProperty(output.position.my)) {
            $.extend(true, output, offsetAdaptions[output.position.my]);
        }

        return output;

    }

    /**
     * Checks whether the current device is a mobile one or not.
     *
     * @returns {boolean}
     */
    function isMobileDevice() {

        var deviceoutput = c24.check24.special.pv.pkv.utils.get_cookie('deviceoutput');
        return (
            deviceoutput == 'tablet' ||
            deviceoutput == 'tabletapp'
        );

    }

    /**
     * Creates a tooltip with a special behaviour for only clickable trigger elements.
     */
    var create_tooltip_when_clicked = function() {

        $($trigger_elements.selector).not($(this)).qtip('destroy', true);

        if (!$(this).data('tooltipOnlyOnHover')) {

            // Only execute this code for trigger elements that can be sticky.

            // Hide all other tooltips except the clicked one.
            $($trigger_elements.selector).not($(this)).qtip('hide');

            var tooltip_api = $(this).qtip('api') ? $(this).qtip('api') : null;

            if (tooltip_api) {

                var $corresponing_tooltip = tooltip_api.elements.tooltip;
                var is_tooltip_visible = $corresponing_tooltip.is(':visible');

                if (is_tooltip_visible && $corresponing_tooltip.find('.fa-icon.fa-icon--times.close').length) {

                    tooltip_api.hide();

                }

            } else {

                 tooltip_api = $(this).qtip($.extend(true, {}, prepareOptions($(this)), {
                    // Content that should be fetched and displayed in the tooltip.
                    content: {text:''}
                })).qtip('api');

                loadContent($(this), true).then((function(response) {

                    var $trigger = $(response[0]);
                    var content = response[1];
                     $trigger.qtip('api').set('content.text', content);
                     $trigger.qtip('api').reposition();

                }));

            }

            // Prevent the tooltip from hiding.
            tooltip_api.set('hide.event', false);

            // Behavior of tooltip on hide.
            tooltip_api.set('hide.effect', (function (api) {
                api.disable().destroy();
            }));

            var content_text = tooltip_api.get('content.text');

            if (! $(content_text).find('.fa-icon.fa-icon--times.close').length) {
                tooltip_api.set('content.text', content_text + '<i class="fa-icon fa-icon--times close"></i>');
            }

            tooltip_api.reposition();

        }

    };

    /**
     * Creates a tooltip for given element
     *
     * @param {jQuery} $trigger_elem
     */
    function createOnElement($trigger_elem) {

        if ($('.fa-icon.fa-icon--times.close:visible').length < 1) {

            prepareOptions($trigger_elem);

            $trigger_elem.qtip($.extend({}, prepareOptions($trigger_elem), {
                content:{text:''},
                events: {
                    // On show:
                    show: function () {

                        // When the trigger elements have been clicked and are sticky,
                        // we need to reset the behavior to the default one after the sticky
                        // tooltip was closed. Otherwise the tooltip will stay sticky when we hover over
                        // the trigger element.
                        $trigger_elem.qtip('api').set('hide.event', 'mouseleave');

                    }
                }
            }));

            loadContent($trigger_elem, false).then((function(response) {

                var $trigger = $(response[0]);
                var content = response[1];
                $trigger.qtip('api').set('content.text', content);

            }));

            $trigger_elem.qtip('api').enable();

        }

    }

    /**
     * Load the content of the tooltip, from local or from ajax
     *
     * @param {jQuery} $trigger_elem Triggerelement
     * @param {boolean} is_clicked Is Clickevent or not
     *
     * @returns {object}
     */
    function loadContent($trigger_elem, is_clicked) {

        var promise = $.Deferred();
        var has_loaded = true;

        if ($trigger_elem.data('tooltip-type') && $trigger_elem.data('tooltip-type') == REMOTE_TOOLTIP) {
            has_loaded = false;
        }

        if (has_loaded) {

            promise.resolve([$trigger_elem, $trigger_elem.find('.c24-tooltip-content').html()]);
            return promise;

        }

        $trigger_elem.qtip('api').set('content.text', $trigger_elem.find('.c24-tooltip-content').html());

        var user = REMOTE_USER;

        if ($trigger_elem.data('tooltip-remote-user')) {
            user = $trigger_elem.data('tooltip-remote-user');
        }

        var type = 'GET';

        if ($trigger_elem.data('tooltip-remote-type')) {
            type = $trigger_elem.data('tooltip-remote-type');
        }

        $.ajax({
            url: $trigger_elem.data('tooltip-remote-url'),
            username: user,
            type: type,
            }
        ).then((function(content) {

            $trigger_elem.data('tooltip-type', 'local');

            var text = content.data;

            if ($trigger_elem.data('tooltip-content-placeholder')) {

                var placeholer = $trigger_elem.data('tooltip-content-placeholder');
                $trigger_elem.find(placeholer)[0].innerHTML = text;
                text = $trigger_elem.find('.c24-tooltip-content').html();

            }

            if (is_clicked) {
                text = text + '<i class="fa-icon fa-icon--times close"></i>';
            }

            promise.resolve([$trigger_elem, text]);
            $trigger_elem.qtip('api').reposition();

        }));


        return promise;

    }
    
    /**
     * Extends the current options with new options
     *
     * @param {Object} newOptions
     */
    function setOptions(newOptions) {
        $.extend(true, currentOptions, newOptions);
    }

    /**
     * Sets the default options
     */
    function resetOptions() {
        currentOptions = $.extend({}, defaultOptions);
    }

    /**
     * Returns the current options
     * @return {object}
     */
    function getOptions() {
        return currentOptions;
    }

    /**
     * public methods
     */
    $.extend(ns, {

        /**
         * Initializes tooltip elements on load
         */
        init: initTooltip,

        /**
         * Merges the given options with the current options
         *
         * @param {Object} newOptions
         */
        setOptions: setOptions,

        /**
         * Resets the options to default values
         */
        resetOptions: resetOptions,

        /**
         * Returns the current options
         *
         * @return {Object}
         */
        getOptions: getOptions,

        /**
         * Creates tooltip for given element
         */
        createOnElement: function($trigger_elem) {
            createOnElement($trigger_elem);
        }

    });


    /**
     * Runs the tooltip initalizing
     */
    $(document).ready(ns.init);

})(namespace('c24.vv.common.tooltip'), window, window.document, undefined);
/**
 * Namespace for utils and helpers like detect autofill
 *
 * @author Ignaz Schlennert on 12.07.2016
 */
(function ($, document){

    "use strict";

    var ns = namespace("c24.check24.special.pv.pkv");

    var profession_mapping = {
        'employee': 'Angestellter',
        'freelancer': 'Selbständiger/Freiberufler',
        'servant': 'Beamter',
        'servant_candidate': 'Beamtenanwärter',
        'student': 'Student',
        'intern': 'Praktikant',
        'unemployed': 'Nicht erwerbstätig'
    };

    ns.utils = {

        /**
         * Function detect if the Browser make a prefill of input and hidden fields.
         * The fields have to register the trigger "autofill"
         */
        detect_autofill: function() {

            var milliseconds = 200;

            setTimeout((function(){

                $('input[type=text], input[type=hidden]').each((function(index, element) {

                    var $element = $(element);

                    if($element.val() !== '') {
                        $element.trigger('autofill');
                    }

                }));

            }), milliseconds);

        },

        /**
         * Get cookie value by name
         *
         * @param {string} name
         * @returns {string}
         */
        get_cookie: function(name) {
            var matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        },

        get_profession_mapping: function(profession) {

            if (profession in profession_mapping) {
                return profession_mapping[profession];
            } else {
                return undefined;
            }

        },

        /**
         * Gets Parameter from URL
         *
         * @param name Name of Parameter in URL
         * @returns {string|null}
         */
        get_url_parameter: function(name) {
            return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
        },

        /**
         * Returns the age from a given date.
         *
         * @param date
         * @returns {number}
         */
        get_age_from_date: function (date) {

            var en_date_regex = /(\d{4}).(\d{2}).(\d{2})/;
            var de_date_regex = /(\d{2}).(\d{2}).(\d{4})/;

            var parms = '';

            if(parms = date.match(en_date_regex)) {
                var yyyy = parseInt(parms[1], 10);
                var mm = parseInt(parms[2], 10);
                var dd = parseInt(parms[3], 10);
            } else if(parms = date.match(de_date_regex)) {
                var yyyy = parseInt(parms[3], 10);
                var mm = parseInt(parms[2], 10);
                var dd = parseInt(parms[1], 10);
            } else {
                return false;
            }

            var today = new Date();
            var birthDate = new Date(yyyy, mm - 1, dd, 0, 0, 0, 0);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();

            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;

        }
    };

    $(document).ready((function(){
        ns.utils.detect_autofill();
    }));


})($, document);


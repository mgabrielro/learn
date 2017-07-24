/**
 * Favorite (Merkzettel) functionality
 *
 * @author Gabriel Mandu <gabriel.mandu@check24.de>
 */
(function (window, document, $, undefined){

    "use strict";

    var ns = window.namespace("favorite");

    /**
     * Related DOM elements to the favorite tariff
     */
    var domElements = {

        //for wireframe
        $wireframeHeartCounter: null,
        $wireframeHeartTooltipText: null,
        $wireframeHeart: null,

        //for Favorite-Page
        $favoriteBackLink: null,
        $favoritePageCounter: null,
        $softDeleteWrapper: null,
        $ssoFormWrapper: null,

        //for Favorite-Page AND Result-Page
        $targetRow: null

    };

    /**
     * Favorite namespace
     */
    ns.favorite = {

        /**
         * Different DOM elements classes
         */
        classes: {

            //wireframe
            wireframeHeart: '.c24-mylists-icon',
            wireframeCounter: '.c24-mylists-count',
            wireframeTooltip: '.c24-mylist-layer-content',

            tariffItem: '.tariff-item',
            favoriteItem: '.favorite-item',

            //for Favorite-Page
            favoritePage: '.favorites',
            headlineCount: '.favorites__headline-count',
            favoriteBacklink: '.favorites__backlink',
            favoriteItemActions: '.favorite-item-actions',
            trashIcon: '.favorite-item-actions--trash-bin-active',
            favoriteGroupCountObject: '.favorites__age-items-count',
            softDeleteWrapperClass: '.favorite-softdelete-wrapper',
            off: 'off',
            activeFavorites: '.favorite-softdelete-wrapper.off',
            favoriteReactivateLink: '.favorite-reactivate-link',

            //for Result-Page, Tariff-Detail-Page and Result-Page
            myFavorite: '.my-favorite',
            isFavorite: '.is-favorite',
            heartFull: '.favorite-item-actions--heart-full-active',
            heartEmpty: '.favorite-item-actions--heart-empty-active',
            favoriteTooltip: '.favorite-tooltip',
            genericTooltip: '.c24-content-row-block-infobox',
            genericTooltipClose: '.c24-info-close-row',
            tooltipTrigger: '.c24-tooltip-trigger',
            tooltipContent: '.c24-tooltip-content',

            /**
             * Will be in init setted based on the actual page
             *     - '.tariff-item' for Result Page
             *     - '.favorite-item' for Favorite Page
             */
            rowClass: ''

        },

        /**
         * Potential AJAX requests actions
         *
         * Important:
         *  - the methods add_favorite AND delete_favorite are named like this,
         *    in order to not interfere with the desktop project methods.
         *    After we unify both projects (desktop and mobile), we can cleanup the API
         */
        actions: {
            add: 'add',
            remove: 'remove',
            activate: 'activate',
            deactivate: 'deactivate',
            count: 'count'
        },

        /**
         * AJAX method type
         */
        ajaxMethod: 'GET',

        /**
         * AJAX base url fro requests
         */
        ajaxBaseUrl: '/favorite/',

        /**
         * Complete AJAX url for request
         */
        ajaxUrl: null,

        /**
         * AJAX request action
         */
        ajaxAction: null,

        /**
         * AJAX request data
         */
        ajaxData: {},

        /**
         * It holds the input1 url
         */
        input1_url: '/pkv/benutzereingaben/',

        /**
         * Holds the clicked heart DOM element
         */
        clickedHeart: {},

        /**
         * String to identify a potential sibling tariff in result rows
         */
        siblingIdentifier: 'favorite-tariffversion-id',

        /**
         * Row tariffversion id
         */
        targetTariffVersionId: 0,

        /**
         * Row favorite id
         */
        targetFavoriteId: 0,

        /**
         * Total favorites counter (for all groups)
         * which is shown on the Favorite page headline
         */
        favoritePageTotalCounter: 0,

        /**
         * Favorites group of tariffs identifier,
         * used on the Favorite page
         */
        favoritePageGroupIdentifier: '',

        /**
         * Favorites group of tariffs counter
         * which is shown on the Favorite page
         */
        favoritePageGroupCounter: 0,

        /**
         * It informs us about the total (unfiltered) number of favorite tariffs
         */
        wireframeCounter: 0,

        /**
         * The heart wireframe tooltip
         */
        wireframeTooltip: '',

        /**
         * Default text for the wireframe tooltip
         */
        wireframeTooltipDefaultText: '<div class="wireframe-tooltip"><div class="wireframe-tooltip__headline">Es befinden sich keine Tarife auf Ihrem Merkzettel</div><div class="wireframe-tooltip__content">Markieren Sie das Herz-Symbol auf einem Tarif, um den Tarif auf ihrem Merkzettel zu speichern.</div></div>',

        /**
         * It holds the session Storage name for the favorite backlink url
         */
        favoriteBacklinkUrlStorageName: 'favoriteBackLinkUrl',

        /**
         * Favorites main counter available on every page,
         * BUT NOT ON Favorite Page - where we use the specific counter - favoritePageTotalCounter
         *
         * This counter helps us:
         *      - inform the user about the number of total favorites filtered by calculationparameter_id
         *      - limit the number of total favorites / calculationparameter_id to 9 (see maxAllowedFavorites variable value)
         */
        mainCounter: 0,

        /**
         * The number of max allowed tariffs to be added as favorite
         */
        maxAllowedFavorites: 9,

        /**
         * Text to be displayed if the user wants to add more than
         * 'maxAllowedFavorites' tariffs as favorite
         */
        maxAllowedFavoritesMsg: '<p>Sie können max. 9 Tarife merken. Bitte entfernen Sie erst einen der gemerkten Tarife, bevor Sie einen weiteren Tarif merken.</p>',

        /**
         * Text to be displayed if the user wants to remove tariff from favorites.
         */
        removeFromFavoritesMsg: '<p>Tarif vom Merkzettel entfernen</p>',

        /**
         * Text to be displayed if the user wants to add tariff to favorites.
         */
        addToFavoritesMsg: '<p>Tarif auf Merkzettel speichern</p>',

        /**
         * It holds the potential calculationparameter id
         * needed in case of get_count AJAX request
         */
        calculationparameterId: '',

        /**
         * It holds the potential active tooltip DOM element
         */
        curentTooltip: {},

        /**
         * jQuery sliding speed in ms
         */
        slideSpeed: 600,

        /**
         * Init function of compare Page
         */
        init: function(){

            // Ensure that the DOM is ready

            $(function(){

                var self = ns.favorite;

                domElements.$wireframeHeart            = $(self.classes.wireframeHeart);
                domElements.$wireframeHeartCounter     = $(self.classes.wireframeCounter);
                domElements.$wireframeHeartTooltipText = $(self.classes.wireframeTooltip);

                privateMethods.getFavoritesCount();
                privateMethods.setRowClass();

                if(privateMethods.isFavoritePage()) {

                    domElements.$favoritePageCounter = $(self.classes.headlineCount);
                    domElements.$favoriteBackLink    = $(self.classes.favoriteBacklink);

                    //TODO to be replaced with the correct DOM identifier
                    domElements.$ssoFormWrapper      = $("#c24-form");

                    privateMethods.handleSsoFormWrapperVisibility();

                    //disable the click on wireframe heart, in order to not replace the link on 'zurück' button on favorite page
                    domElements.$wireframeHeart.click(function(e) {
                        e.preventDefault();
                    });

                    $(self.classes.favoriteItemActions).removeClass(self.classes.tooltipTrigger.replace('.', ''));
                    $(self.classes.favoriteItemActions).find(self.classes.tooltipContent).remove();

                    privateMethods.initFavoritePageHeadlineCounter();
                    //privateMethods.updateFavoritePageBacklinkHref();

                    domElements.$favoriteBackLink.on("click", eventHandlers.handleBackLink);

                    $(document).on("click", ns.favorite.classes.trashIcon, eventHandlers.deactivateFavorite);
                    $(document).on("click", ns.favorite.classes.favoriteReactivateLink, eventHandlers.activateFavorite);


                } else {

                    /**
                     * Save the actual url in session storage in order to update
                     * later the backlink href sttribute on favorite page
                     */
                    sessionStorage.setItem(self.favoriteBacklinkUrlStorageName, window.location.href);

                    privateMethods.setSessionStorageFavoriteBacklinkUrl();
                    $(document).on("touchend click", ns.favorite.classes.myFavorite, eventHandlers.handleHeartClick);

                    $(ns.favorite.classes.favoriteItemActions).hover(eventHandlers.handleHeartOnHover);

                }

            });

        },

        /**
         * Remove all favorites tooltips from DOM
         */
        removeAllFavoritesTooltips: function() {
            $(ns.favorite.classes.favoriteTooltip).remove();
        }

    }; // END public functions


    /**
     * Private methods
     */
    var privateMethods = {

        /****************************
         *                          *
         *     Common functions     *
         *                          *
         ****************************/

        /**
         * Based on the actual page, we set the row class name
         * Only relevant for result and favorite pages
         */
        setRowClass: function() {

            if(privateMethods.isFavoritePage()) {
                ns.favorite.classes.rowClass = ns.favorite.classes.favoriteItem;
            } else {
                ns.favorite.classes.rowClass = ns.favorite.classes.tariffItem;
            }

        },

        /****************************
         *                          *
         *  Favorite Page functions *
         *                          *
         ****************************/

        /**
         * It tells us if we are on favorite page or not
         *
         * @return boolean
         */
        isFavoritePage: function() {
            return $(ns.favorite.classes.favoritePage).length === 1;
        },

        /**
         * Based on the wireframe counter value, we display or not the sso form wrapper
         */
        handleSsoFormWrapperVisibility: function() {

            // show the SSO wrapper if the case
            if (ns.favorite.wireframeCounter > 0) {
                domElements.$ssoFormWrapper.show();
            } else {
                domElements.$ssoFormWrapper.hide();
            }

        },

        /**
         * Sets the actual url in session storage, in order to have it available
         * on favorite page for the backlink href attribute
         */
        setSessionStorageFavoriteBacklinkUrl: function() {
            sessionStorage.setItem(ns.favorite.favoriteBacklinkUrlStorageName, window.location.href);
        },

        /**
         * Update the backlink url on favorite page with the previous saved value in session storage
         * and reset the session storage value to Input!
         */
        updateFavoritePageBacklinkHref: function() {

            var sessionStorageLink = sessionStorage.getItem(ns.favorite.favoriteBacklinkUrlStorageName);

            if (!sessionStorageLink) {
                sessionStorage.setItem(ns.favorite.favoriteBacklinkUrlStorageName, ns.favorite.input1_url);
                sessionStorageLink = sessionStorage.getItem(ns.favorite.favoriteBacklinkUrlStorageName);
            }


            //If in the saved url from session storage, is not already defined the deviceoutput
            if ( ! sessionStorageLink.includes('deviceoutput') ) {

                var actualUrl = window.location.href;

                // If in the actual url, is not already defined the deviceoutput
                if ( actualUrl.includes('deviceoutput') ) {

                    var $actualDeviceoutputValue = get_url_param('deviceoutput');
                    var desired_text             = 'deviceoutput=' + $actualDeviceoutputValue;
                    var newSessionStorageLink    = '';

                    // we add the deviceoutput in order to solve the double header problem later
                    if (sessionStorageLink.includes('/?')) {

                        if(sessionStorageLink.includes('&')) {
                            newSessionStorageLink = sessionStorageLink + '&' + desired_text;
                        } else {
                            newSessionStorageLink = sessionStorageLink + desired_text;
                        }

                    } else {
                        newSessionStorageLink = sessionStorageLink + '/?' + desired_text;
                    }

                    //update the session storage link
                    sessionStorage.setItem(ns.favorite.favoriteBacklinkUrlStorageName, newSessionStorageLink);

                }

            }

            if (domElements.$favoriteBackLink.length) {
                domElements.$favoriteBackLink.attr('href', sessionStorage.getItem(ns.favorite.favoriteBacklinkUrlStorageName));
            }
        },

        /**
         * When the Favorite page is loaded, init the total counter
         */
        initFavoritePageHeadlineCounter: function() {
            ns.favorite.favoritePageTotalCounter = parseInt(domElements.$favoritePageCounter.data('count'));
        },

        /**
         * When the user decides to activate/deactivate a favorite tariff,
         * we need to update the total counter. The total counter is always
         * actualized when the user activates or deactivates a favorite tariff
         */
        updateFavoritePageTotalCounter: function() {
            domElements.$favoritePageCounter.attr('data-count', ns.favorite.favoritePageTotalCounter);
            domElements.$favoritePageCounter.html('(' + ns.favorite.favoritePageTotalCounter + ')');
        },

        /**
         * Updates the favorite group count text every time,
         * when the user activate/deactivate a favorite tariff
         */
        updateFavoritePageGroupCountText: function() {

            var $groupRecordsDiv      = $("div").find("[data-group-name='" + ns.favorite.favoritePageGroupIdentifier + "']");

            var $groupRecordsCountObj = $groupRecordsDiv.find(ns.favorite.classes.favoriteGroupCountObject);
            var activeRecords         = $groupRecordsDiv.find(ns.favorite.classes.activeFavorites).length;

            if(activeRecords === 1) {
                var countText = '1 gemerkter Tarif';
            } else {
                var countText = activeRecords + ' gemerkte Tarife';
            }

            $groupRecordsCountObj.html(countText);

        },

        /**
         * Set the actual favorite tariff row
         *
         * @param {jQuery} $row     Actual favorite tariff row
         */
        setFavoritePageTargetRow: function($row) {
            domElements.$targetRow = $row;
        },

        /**
         * Set the related soft delete wrapper DOM element
         * of the actual favorite tariff row
         *
         * @param {jQuery} $wrapper     Related soft delete wrapper
         */
        setSoftDeleteWrapper: function($wrapper) {
            domElements.$softDeleteWrapper = $wrapper;
        },

        /**
         * Get the tariff favorite id of the related result row
         *
         * @return integer
         */
        setGroupIdentifier: function(groupIdentifier) {
            ns.favorite.favoritePageGroupIdentifier = groupIdentifier;
        },

        /**
         * Dectivate the click event for the tariff row
         */
        deactivateFavoritePageTargetRowClickEvent: function() {
            domElements.$targetRow.off('click');
        },

        /**
         * Hide the tariff row
         */
        slideToggleTargetRow: function() {
            domElements.$targetRow.slideToggle(ns.favorite.slideSpeed);
        },

        /**
         * Display the soft delete wrapper
         */
        slideToggleSoftDeleteWrapper: function() {

            domElements.$softDeleteWrapper.slideToggle(ns.favorite.slideSpeed);

            if(domElements.$softDeleteWrapper.hasClass(ns.favorite.classes.off)) {
                domElements.$softDeleteWrapper.removeClass(ns.favorite.classes.off);
            } else {
                domElements.$softDeleteWrapper.addClass(ns.favorite.classes.off);
            }

        },

        /**
         * Get the tariffversion id of the related result row
         *
         * @return integer
         */
        getTargetTariffVersionId: function() {

            // this if covers the favorite page usability case
            if(domElements.$targetRow) {
                ns.favorite.targetTariffVersionId = domElements.$targetRow.data('tariff-version-id');
            }

            return ns.favorite.targetTariffVersionId;

        },

        /**
         * Get the tariff favorite id of the related result row
         *
         * @return integer
         */
        getTargetFavoriteId: function() {

            if(domElements.$targetRow) {
                ns.favorite.targetFavoriteId = domElements.$targetRow.data('favorite-id');
            }

            return ns.favorite.targetFavoriteId;

        },

        /**
         * Format the received conttribution string to DE float
         *
         * @param {Integer} value   The integer value to be converted
         */
        getFormatedContribution: function(value) {
            var string = value.toString();
            return string.slice(0, -2) + "." + string.slice(-2);
        },

        /************************************
         *                                  *
         *  Other pages favorite functions  *
         *                                  *
         ************************************/

        /**
         * Update the wireframe heart counter in header, on every page,
         * and after every action (add, remove, activate, deactivate)
         */
        updateWireframeHeartCounter: function() {
            if (ns.favorite.wireframeCounter > 0) {
                domElements.$wireframeHeartCounter.html(ns.favorite.wireframeCounter).show();
            } else {
                domElements.$wireframeHeartCounter.html(0).hide();
            }
        },

        /**
         * Update the wireframe heart tooltip in header, on every page,
         * and after every action (add, remove, activate, deactivate)
         */
        updateWireframeHeartTooltip: function() {

            var tooltipContent = ns.favorite.wireframeTooltipDefaultText;

            if (ns.favorite.wireframeCounter > 0) {
                if (ns.favorite.wireframeCounter === 1) {
                    tooltipContent = '<div class="wireframe-tooltip"><div class="wireframe-tooltip__headline">Es befindet sich ' + ns.favorite.wireframeCounter + ' Tarif im Merkzettel</div></div>';
                } else {
                    tooltipContent = '<div class="wireframe-tooltip"><div class="wireframe-tooltip__headline">Es befinden sich ' + ns.favorite.wireframeCounter + ' Tarife im Merkzettel</div></div>';
                }
            }

            domElements.$wireframeHeartTooltipText.html(tooltipContent);

        },

        /**
         * Toggle the result page heart class, to indicate if the tariff is favorite or not
         */
        toggleSpecificFavoriteClasses: function() {

            var heart_empty = ns.favorite.classes.heartEmpty.replace('.', '');
            var heart_full  = ns.favorite.classes.heartFull.replace('.', '');
            var is_favorite = ns.favorite.classes.isFavorite.replace('.', '');

            if (ns.favorite.clickedHeart.hasClass(heart_empty)) {

                ns.favorite.clickedHeart.removeClass(heart_empty);
                ns.favorite.clickedHeart.addClass(heart_full);
                ns.favorite.clickedHeart.addClass(is_favorite);

            } else if (ns.favorite.clickedHeart.hasClass(heart_full)) {

                ns.favorite.clickedHeart.removeClass(heart_full);
                ns.favorite.clickedHeart.removeClass(is_favorite);
                ns.favorite.clickedHeart.addClass(heart_empty);

            }

            ns.favorite.clickedHeart.qtip('hide');
            
        },

        /**
         * Method called on load of every neede page, in order to be able
         * to update:
         *  - the wireframe counter (seee AJAX response.counter)
         *  - the main counter (the total number of favorites filtered by actual/last calculationparameter_id - see AJAX response.filtered_counter)
         */
        getFavoritesCount: function() {

            ns.favorite.ajaxAction = ns.favorite.actions.count;
            privateMethods.doRequest();

        },

        /**
         * Get the calculationparameter id from the first
         * potential tariff on the page
         *
         * @returns {string}
         */
        getCalculationParameterId: function() {

            var $firstTariffRow = $(ns.favorite.classes.myFavorite).first();

            if ($firstTariffRow) {

                var tarifRowCalculationparameterId = $firstTariffRow.data('favorite-calculation-parameter-id');

                if(tarifRowCalculationparameterId !== undefined) {
                    ns.favorite.calculationparameterId = tarifRowCalculationparameterId;
                }

            }

            return ns.favorite.calculationparameterId;

        },

        /**
         * Create a tooltip DOM element, prefilled with a specific message
         *
         * @param {jQuery} $triggeredElement   Trigger element
         * @param {string} message             The tooltip message
         *
         * @returns {object}          The tooltip DOM element
         */
        createTooltipElement: function($triggeredElement, message) {
            $triggeredElement.find(ns.favorite.classes.tooltipContent).html(message);
        },

        /**
         * If the user marks/unmarks a tariff as favorite, we need to be sure
         * that the potential sibling in the result rows is also marked/unmarked as favorite.
         *
         * That can happen in the case of a promo tariff (0tes Ergebnis), because
         * the promo tariffs are displayed once first on the top of results,
         * and second inside the list
         */
        toggleSameTariffsAsFavorite: function() {

            var self        = ns.favorite;
            var is_favorite = self.classes.isFavorite.replace('.', '');
            var $all_rows   = $(self.classes.rowClass);

            $all_rows.each(function(index, row) {

                var $element = $(row).find($(self.classes.myFavorite));

                if($element.length && self.clickedHeart.data(self.siblingIdentifier) === $element.data(self.siblingIdentifier)) {
                    $element.toggleClass(is_favorite);
                }

            });

        },

        /**********************
         *                    *
         *   AJAX functions   *
         *                    *
         **********************/

        /**
         * Sets the AJAX method type for requests
         *
         * @param {string} method_type     AJAX request method
         */
        setAjaxMethodType: function(method_type) {
            ns.favorite.ajaxMethod = method_type;
        },

        /**
         * Sets the AJAX data
         *
         * @param {object} data    Needed AJAX data
         */
        setAjaxData: function(data) {
            ns.favorite.ajaxData = data;
        },

        /**
         * Sets the AJAX action for requests
         *
         * @param {string} action     AJAX request action
         */
        setAjaxAction: function(action) {
            ns.favorite.ajaxAction = action;
        },

        /**
         * Set the AJAX url for requests by action
         *
         * @return {null|string}   AJAX request url
         */
        setAjaxUrlByAction: function() {

            var self = ns.favorite;

            if(!self.ajaxAction) {

                self.ajaxUrl = null;
                return ns.favorite.ajaxUrl;

            }

            switch (self.ajaxAction) {

                case self.actions.activate:
                case self.actions.deactivate:
                    self.ajaxUrl = self.ajaxBaseUrl + self.ajaxAction + '/' +  privateMethods.getTargetFavoriteId();
                    break;

                case self.actions.remove:
                    self.ajaxUrl = self.ajaxBaseUrl + self.ajaxAction + '/' + privateMethods.getTargetTariffVersionId();
                    break;

                case self.actions.add:
                    self.ajaxUrl = self.ajaxBaseUrl + self.ajaxAction;
                    break;

                case self.actions.count:

                    self.ajaxUrl = self.ajaxBaseUrl + self.ajaxAction;

                    var calculationParameterId = privateMethods.getCalculationParameterId();

                    if(calculationParameterId !== '') {
                        self.ajaxUrl += '/' + calculationParameterId;
                    }

                    break;

            }

            return self.ajaxUrl;

        },

        /**
         * On ajax request before send
         */
        onAjaxBeforeSend: function() {

            if (ns.favorite.ajaxAction === ns.favorite.actions.deactivate) {
                privateMethods.deactivateFavoritePageTargetRowClickEvent();
            }

        },

        /**
         * Method call on success response from AJAX request
         *
         * @param {object} response     AJAX response data
         *
         */
        onAjaxSuccessResponse: function(response) {

            var self = ns.favorite;

            switch (self.ajaxAction) {

                case self.actions.activate:

                    privateMethods.slideToggleSoftDeleteWrapper();
                    privateMethods.slideToggleTargetRow();

                    self.favoritePageTotalCounter += 1;
                    self.favoritePageGroupCounter += 1;
                    self.wireframeCounter += 1;

                    break;

                case self.actions.deactivate:

                    privateMethods.slideToggleTargetRow();
                    privateMethods.slideToggleSoftDeleteWrapper();

                    self.favoritePageTotalCounter -= 1;
                    self.favoritePageGroupCounter -= 1;
                    self.wireframeCounter -= 1;

                    break;

                case self.actions.remove:

                    if (self.wireframeCounter > 0) {
                        self.wireframeCounter -= 1;
                    }

                    if (self.mainCounter > 0) {
                        self.mainCounter -= 1;
                    }

                    privateMethods.toggleSpecificFavoriteClasses();

                    break;

                case self.actions.add:

                    self.wireframeCounter += 1;
                    self.mainCounter += 1;

                    privateMethods.toggleSpecificFavoriteClasses();

                    break;

                case self.actions.count:

                    if(response.counter) {
                        self.wireframeCounter = parseInt(response.counter);
                    }

                    self.wireframeCounter = (response.counter) ? parseInt(response.counter) : 0;
                    self.wireframeTooltip = (response.tooltip !== '') ? response.tooltip : self.wireframeTooltipDefaultText;
                    self.mainCounter      = (response.counter) ? parseInt(response.filtered_counter) : 0;

                    break;
            }

            if(privateMethods.isFavoritePage()) {

                privateMethods.updateFavoritePageTotalCounter();
                privateMethods.updateFavoritePageGroupCountText();
                privateMethods.handleSsoFormWrapperVisibility();

            }

            privateMethods.updateWireframeHeartCounter();
            privateMethods.updateWireframeHeartTooltip();

        },

        /**
         * Method call on error response from AJAX request
         *
         * @param {object} response     AJAX response data
         *
         */
        onAjaxErrorResponse: function(response) {
        },

        /**
         * Method call on complete AJAX request
         */
        onAjaxComplete: function() {
            privateMethods.resetAjaxDetails();
        },

        /**
         * Reset all AJAX details
         */
        resetAjaxDetails: function() {

            privateMethods.setAjaxMethodType('GET');
            privateMethods.setAjaxData({});
            privateMethods.setAjaxAction('');

        },

        /**
         * Make an AJAX request
         */
        doRequest: function() {

            privateMethods.setAjaxUrlByAction();

            if (ns.favorite.ajaxUrl) {

                // Send the AJAX request to Mobile-Backend (see Ajax Controller)

                $.ajax({
                    method: ns.favorite.ajaxMethod,
                    dataType: 'json',
                    url: ns.favorite.ajaxUrl,
                    data: ns.favorite.ajaxData,
                    cache: false,
                    timeout: 1000,
                    beforeSend: function( xhr ) {
                        privateMethods.onAjaxBeforeSend();
                    },
                    success: function (data) {

                        if(data.success === true) {
                            privateMethods.onAjaxSuccessResponse(data);
                        } else {
                            privateMethods.onAjaxErrorResponse(data);
                        }

                    },
                    complete: function () {
                        privateMethods.onAjaxComplete();
                    }
                });

            }

        }


    }; // END privateMethods

    /**
     * Event handlers (private)
     */
    var eventHandlers = {

        /**
         * Handle the favorite backlink click
         * If the user comes from a mobile page, we redirect him back,
         * else we redirect him on Input1
         *
         * @param event   Click event
         */
        handleBackLink: function(event) {

            event.preventDefault();
            window.location.href = $(this).attr('href');

        },

        /**
         *
         * @param event
         */
        handleHeartOnHover: function(event) {

            var self = ns.favorite;
            var $triggeredElement = $(this);
            var fullHeartClassName = self.classes.heartFull.replace('.', '');

            if (self.mainCounter >= self.maxAllowedFavorites && !$triggeredElement.hasClass(fullHeartClassName)) {
                privateMethods.createTooltipElement($triggeredElement, self.maxAllowedFavoritesMsg);
            } else if ($triggeredElement.hasClass(fullHeartClassName)) {
                privateMethods.createTooltipElement($triggeredElement, self.removeFromFavoritesMsg);
            } else {
                privateMethods.createTooltipElement($triggeredElement, self.addToFavoritesMsg);
            }

        },

        /**
         * Handle the heart symbol click (add/remove favorite)
         *
         * Occurrence:
         *      - Result page
         *      - Detail page
         *      - Register page
         *
         * @param event   Click event
         */
        handleHeartClick: function(event) {

            event.preventDefault();
            event.stopPropagation();

            // cleanup
            privateMethods.resetAjaxDetails();

            if (event.handled !== true) {

                var self = ns.favorite;

                self.removeAllFavoritesTooltips();

                self.clickedHeart = $(this);

                var is_favorite = self.classes.isFavorite.replace('.', '');
                var heart_full  = self.classes.heartFull.replace('.', '');

                //is the tariff already a favorite one?

                if (self.clickedHeart.hasClass(is_favorite) || self.clickedHeart.hasClass(heart_full)) {

                    privateMethods.toggleSameTariffsAsFavorite();

                    self.targetTariffVersionId = parseInt(self.clickedHeart.data('favorite-tariffversion-id'));

                    privateMethods.setAjaxAction(ns.favorite.actions.remove);
                    privateMethods.doRequest();

                } else {

                    //if the user has already added 'maxAllowedFavorites' number of tariffs as favorites
                    if(ns.favorite.mainCounter < self.maxAllowedFavorites) {

                        privateMethods.toggleSameTariffsAsFavorite();

                        var is_promo_tariff      = (self.clickedHeart.data('favorite-is-promo-tariff')) ? 'yes' : 'no';
                        var is_gold_grade_tariff = (self.clickedHeart.data('favorite-is-gold-grade')) ? 'yes' : 'no';

                        var data = {
                            favorite_action             : self.actions.add,
                            tariffversion_id            : parseInt(self.clickedHeart.data('favorite-tariffversion-id')),
                            tariffversion_variation_key : self.clickedHeart.data('favorite-tariffversion-variaton-key'),
                            is_promo_tariff             : is_promo_tariff,
                            promotion_type              : self.clickedHeart.data('favorite-promotion-type'),
                            is_gold_grade_tariff        : is_gold_grade_tariff,
                            calculationparameter_id     : self.clickedHeart.data('favorite-calculation-parameter-id'),
                            tariff_contribution_rate    : privateMethods.getFormatedContribution(self.clickedHeart.data('favorite-contribution'))
                        };

                        privateMethods.setAjaxData(data);
                        privateMethods.setAjaxMethodType('POST');
                        privateMethods.setAjaxAction(ns.favorite.actions.add);
                        privateMethods.doRequest();

                    }

                }

                event.handled = true;

            } else {
                return false;
            }

        },

        /**
         * Handle the click on an opened favorite tooltip
         *
         */
        handleFavoriteTooltipClick: function() {

            var closeTooltipButton = ns.favorite.curentTooltip.find(ns.favorite.classes.genericTooltipClose);

            closeTooltipButton.on('click touchstart', function(e){

                e.preventDefault();
                $(this).closest(ns.favorite.classes.genericTooltip).remove();

            });

        },

        /**
         * RE-activate the previously soft-deleted favorite tariff
         *
         * Occurrence: Favorite page
         *
         * @param {Object} event   Click event
         */
        activateFavorite: function(event) {

            event.preventDefault();

            privateMethods.resetAjaxDetails();

            var $softDeleteWrapper = $(this).parents(ns.favorite.classes.softDeleteWrapperClass);
            privateMethods.setSoftDeleteWrapper($softDeleteWrapper);

            var $targetRow = $softDeleteWrapper.next(ns.favorite.classes.rowClass);
            privateMethods.setFavoritePageTargetRow($targetRow);

            privateMethods.setGroupIdentifier($softDeleteWrapper.data('group-identifier'));
            privateMethods.setAjaxAction(ns.favorite.actions.activate);

            privateMethods.doRequest();

        },

        /**
         * Soft delete a favorite tariff
         *
         * Occurrence: Favorite page
         *
         * @param {Object} event   Click event
         */
        deactivateFavorite: function(event) {

            event.preventDefault();
            event.stopPropagation();

            privateMethods.resetAjaxDetails();

            var $targetRow = $(this).parents(ns.favorite.classes.rowClass);
            privateMethods.setFavoritePageTargetRow($targetRow);

            var $softDeleteWrapper = $targetRow.prev(ns.favorite.classes.softDeleteWrapperClass);
            privateMethods.setSoftDeleteWrapper($softDeleteWrapper);

            privateMethods.setGroupIdentifier($softDeleteWrapper.data('group-identifier'));

            privateMethods.setAjaxAction(ns.favorite.actions.deactivate);

            privateMethods.doRequest();

        }

    }; // END eventHandlers

    ns.favorite.init();

})(window, window.document, window.jQuery, undefined);
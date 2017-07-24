/**
 * Functionality to manage the eFeedback(s) - Kundenbewertungen
 *
 * @author Gabriel Mandu <gabriel.mandu@check24.de>
 */
(function($, document, window, undefined) {

    "use strict";

    var ns = namespace("efeedback");

    /**
     * Check whether the initialization is already done or not
     *
     * @type {boolean}
     * @static
     */
    var _initialized = false;

    /**
     * Efeedback namespace
     */
    ns.efeedback = {

        /**
         * Init efeedback JS Module
         */
        init: function () {
            ns.efeedback.clickListener();
        },

        /**
         * Name of click-element
         *
         * @type {jQuery}
         */
        clicked_link: {},

        /**
         * Name of tab-content-element
         *
         * @type {jQuery}
         */
        main_content: {},

        /**
         * Height of tab-content-element
         *
         * @type {integer}
         */
        main_content_height: 0,

        /**
         * AJAX base URL
         */
        ajax_base_url: '/app/api/efeedback/',

        /**
         * Name of url for ajax
         *
         * @type {string}
         */
        ajax_url : '',

        /**
         * AJAX-Request response content
         *
         * @type {Array}
         */
        data: [],

        /**
         * The actual provider id
         */
        provider_id: 0,

        /**
         * Currrent tariff row
         */
        $current_row: {},

        /**
         * Comments current page
         */
        currentPage: null,

        /**
         * Comments count
         */
        commentsCount: 0,

        /**
         * Comments pages with rows
         */
        pagesWithRows: [],

        /**
         * Comments - last used offset
         */
        lastCommentsOffset: 0,

        /**
         * All comments rows
         */
        $allCommentRows: [],

        /**
         * Rows after star filter is applied
         */
        $filteredRows: [],

        /**
         * Comments headline
         */
        commentsHeadlineOriginalText: '',

        /**
         * eFeedback DOM elements
         */
        domElements: {

            $chartMainContainer:          null,
            $feedbacksProviderHeadline:   null,
            $chartStarsContainer:         null,
            $countFeedbacksDescription:   null,
            $chartFeedbackStars:          null,
            $chartBeamsContainer:         null,
            $chartBeamRows:               null,
            $chartFilledBeams:            null,
            $chartEmptyBeams:             null,
            $chartGreyStars:              null,
            $chartYellowStars:            null,
            $overviewGreyStars:           null,
            $overviewYellowStars:         null,
            $chartShowAllComments:        null,

            $commentsMainContainer:       null,
            $commentsHeadline:            null,
            $commentsContainer:           null,
            $commentsRows:                null,
            $commentsPaginationContainer: null,
            $commentsPagePrevButton:      null,
            $commentsPageNextButton:      null

        },

        /**
         * eFeedback classes
         */
        classes: {
            active: '.active',
            tarifItem: '.tariff-item',
            openedTab: '.tariff-item__tab--open',
            efeedbackContent: '.efeedback_content',
            activeReport: '.active_report',
            activeEfeedback: '.active_feedback',
            basketBarContainer: '.comparison-preview__container',
            caretUp: 'i.efeedback-toggle__icon-caret-up',
            caretDown: 'i.efeedback-toggle__icon-caret-down'
        },

        /**
         * eFeedback specific row vars
         */
        fields: {
            absoluteAverage    : 0,
            highestRatingCount : 0,
            isOnlyOneStarRated : false
        },

        /**
         * Sets the clicked link
         *
         * @param {jQuery} clicked_link The JQuery-object of tab 'Testberichte, Tarifüberblick' link
         */
        setClickedLink: function(clicked_link) {
            this.clicked_link = clicked_link;
        },

        /**
         * Sets the name of tab-content
         *
         * @param {jQuery} main_content  The jQuery-object of tab-content 'Testberichte, Tarifüberblick'
         */
        setMainContent: function(main_content) {
            this.main_content = main_content;
        },

        /**
         * Sets height of tab-content
         *
         * @param {integer} main_content_height The height of tab-content 'Testberichte, Tarifüberblick'
         */
        setMainContentHeight: function(main_content_height){
            this.main_content_height = main_content_height;
        },

        /**
         * Sets the active tab-content
         *
         * @param {Array} data    The active tab-content to be shown
         */
        setData: function(data) {
            this.data = data;
        },

        /**
         * Sets the provider id
         *
         * @param {integer} provider_id   The provider id to be used
         */
        setProviderId: function(provider_id) {
            this.provider_id = parseInt(provider_id);
        },

        /**
         * Set current clicked tariff row
         *
         * @param {object} $current_row
         */
        setCurrentRow: function($current_row) {
            this.$current_row = $current_row;
        },

        /**
         * Sets the ajax url
         *
         * @param {string} ajax_url  The url used for AJAX requests
         */
        setAjaxUrl: function(ajax_url) {
            this.ajax_url = ajax_url;
        },

        /**
         * Go through every tariff row and init the stars
         *
         * @param {object} context   The context from where we've called the function
         */
        initStarsAmountOnLoad: function(context) {

            var self = context;

            $(self.classes.tarifItem).each(function() {

                var $container = $(this).find('.overview_stars_container');

                if ($container.length) {
                    self.initStars($container);
                }

            });

        },

        /**
         * Init the container TAB stars
         *
         * @param {jQuery} $starsContainer
         */
        initStars: function($starsContainer) {

            this.domElements.$overviewGreyStars   = $starsContainer.find('.grey_star');
            this.domElements.$overviewYellowStars = $starsContainer.find('.yellow_star');

            var absoluteAverageRate = parseFloat($starsContainer.data('container-absolute-average-rate'));
            var starsWidth          = this.domElements.$overviewGreyStars.width();

            this.fillStars(
                this.domElements.$overviewYellowStars,
                this.domElements.$overviewYellowStars.eq(0),
                absoluteAverageRate,
                starsWidth
            );

        },

        /**
         * make an AJAX request to get the active tab-content for the related clicked link
         */
        doRequest: function() {

            var _this = ns.efeedback;

            $.ajax({

                url         : _this.ajax_url,
                dataType    : 'JSON',
                async       : true,
                type        : 'GET',

                success: function (data) {
                    _this.onAjaxSuccess(data);
                },

                complete: function () {
                    _this.onAjaxComplete();
                },

                timeout: 2000

            });
        },

        /**
         * Action on ajax success
         *
         * @param {object} data   Tab text-content
         */
        onAjaxSuccess: function(data) {

            this.setData(data.data);

            if (typeof this.data.comments !== 'undefined' &&
                typeof this.data.star_ratings !== 'undefined') {

                this.updateEfeedbackDomContent();

            }

        },

        /**
         * Action on ajax complete
         * Show the tab-content
         */
        onAjaxComplete: function() {

            var self = ns.efeedback;

            self.main_content.slideDown('slow', function(){

                self.setMainContentHeight(self.main_content.outerHeight());
                self.scrollTariffResult();

            });

        },

        /**
         * Close the tab-content, if you click on the close-icon
         *
         * @param {jQuery} $element The jQuery-object of close-icon
         */
        closeEfeedbackTabField: function($element){

            $element
                .parents(this.classes.tarifItem)
                .find(this.classes.efeedbackContent)
                .slideUp();

            $element.find(this.classes.caretUp).hide();
            $element.find(this.classes.caretDown).show();


        },

        /**
         * Close potential opened tabs
         */
        closePotentialOpenedEfeedbackTab: function() {

            var self = ns.efeedback;

            if (self.provider_id > 0) {

                var $activeFeedback = $(self.classes.activeEfeedback);

                if ($activeFeedback) {

                    $activeFeedback.parent().removeClass(self.classes.openedTab.replace('.', ''));
                    $activeFeedback.removeClass(self.classes.activeEfeedback);

                    self.closeEfeedbackTabField($activeFeedback);

                }

            }

        },

        /**
         * Close potential opened report tabs
         */
        closePotentialOpenedReportTab: function() {

            if ($(this.classes.activeReport)) {
                $(this.classes.activeReport).click();
            }

        },

        /**
         * Action, if click of tab-field
         *
         * @param {jQuery} $element The jQuery-object of click-element "tab-field"
         */
        actionAfterClick: function($element) {

            var self = ns.efeedback;

            self.setClickedLink($element);

            var $tariffItemElement = $element.parents(self.classes.tarifItem);
            var $mainContent       = $tariffItemElement.find(self.classes.efeedbackContent);

            self.setCurrentRow($tariffItemElement);
            self.setProviderId($element.data('provider_id'));
            self.setAjaxUrl(self.ajax_base_url + self.provider_id);
            self.setMainContent($mainContent);
            self.setMainContentHeight($mainContent.outerHeight());

            self.toggleContent();

        },

        /**
         * Toggle the tab main content
         */
        toggleContent: function() {

            var self = ns.efeedback;
            var opendeTabClass = self.classes.openedTab.replace('.', '');

            if (self.main_content.is(":visible")) {

                self.main_content.slideUp();
                self.clicked_link.parent().removeClass(opendeTabClass);
                self.clicked_link.find(this.classes.caretUp).hide();
                self.clicked_link.find(this.classes.caretDown).show();

            } else {

                self.doRequest();

                self.main_content.slideDown();
                self.clicked_link.parent().addClass(opendeTabClass);
                self.clicked_link.find(this.classes.caretDown).hide();
                self.clicked_link.find(this.classes.caretUp).show();

            }
        },

        /**
         * Event-listeners
         */
        clickListener: function() {

            var self = this;

            /**
             * We need du ensure that we register this listeners only once
             */
            if (_initialized !== true) {

                $(document).ready(self.initStarsAmountOnLoad(self));

                $(document)
                    .on("click", "a.has_reports", function () {

                        self.closePotentialOpenedEfeedbackTab();

                        var activeReportClass = self.classes.activeReport.replace('.', '');
                        $(this).toggleClass(activeReportClass);

                    })
                    .on("click", "a.has_feedbacks", function () {

                        self.closePotentialOpenedReportTab();
                        self.closePotentialOpenedEfeedbackTab();

                        $(this).addClass('active_feedback');

                        self.actionAfterClick($(this));

                    })
                    .on("click.pagination", ".pagination_container:visible > a", function(){

                        var $button = $(this);

                        if ($button.find('span').is('.prev')) {

                            self.currentPage--;

                            self.lastCommentsOffset -= self.$filteredRows.filter(':visible').length;
                            self.$filteredRows.slice(self.lastCommentsOffset).hide();

                        } else {

                            self.currentPage++;

                            // Height the already calculated rows to give the remainings ones space.
                            self.$filteredRows.slice(0, self.lastCommentsOffset).hide();

                            // Remove the already added rows and save the remaining ones.
                            var $commentRows = self.$filteredRows.slice(self.lastCommentsOffset);

                            // Show the remaining rows in order to calculate the heights.
                            $commentRows.show();

                            // Calculate the next rows
                            self.paginateComments($commentRows, self.currentPage);

                        }

                        self.displayComments();

                    })
                    .on("click", ".chart_beam_container > .row", function() {

                        var $beamRow = $(this);

                        self.domElements.$commentsContainer.find('.no_comments').remove();

                        var selectedStar = $beamRow.data('star');

                        self.$filteredRows = self.$allCommentRows.filter(function () {
                            return $(this).find('.stars_container').data('customerRate') === selectedStar;
                        });

                        // Reset values
                        self.currentPage = 1;
                        self.lastCommentsOffset = 0;
                        self.pagesWithRows = [];
                        self.commentsCount = self.$filteredRows.length;

                        var commentsHeadlineTxt = (parseInt(selectedStar) === 1) ? '1 Stern' : selectedStar + ' Sterne';
                        self.domElements.$commentsHeadline.html(commentsHeadlineTxt + ' Kundenbewertungen mit Kommentar');

                        self.domElements.$chartShowAllComments.css('visibility', 'visible');

                        self.domElements.$chartBeamRows.removeClass('selected');
                        $beamRow.addClass('selected');

                        if (self.commentsCount > 0) {

                            self.$allCommentRows.hide();
                            self.$filteredRows.show();

                            self.paginateComments(self.$filteredRows, self.currentPage);
                            self.displayComments();


                        } else {

                            var noCommentsMessage = $(
                                '<table class="no_comments">' +
                                '<tr><td>Keine Kundenbewertungen mit Kommentar vorhanden</td></tr>' +
                                '</table>'
                            );

                            self.$allCommentRows.hide();
                            self.domElements.$commentsContainer.append(noCommentsMessage);
                            self.disablePaginationLink(self.domElements.$commentsPagePrevButton);
                            self.disablePaginationLink(self.domElements.$commentsPageNextButton);

                        }

                    })
                    .on("click", ".customer_chart .show_all_comments", function() {

                        self.domElements.$commentsContainer.find('.no_comments').remove();
                        self.domElements.$commentsHeadline.html(self.commentsHeadlineOriginalText);
                        self.domElements.$chartShowAllComments.css('visibility', 'hidden');

                        self.domElements.$chartBeamRows.removeClass('selected');
                        self.$allCommentRows.show();
                        self.$filteredRows = self.$allCommentRows;

                        // Reset values
                        self.currentPage = 1;
                        self.commentsCount = self.$allCommentRows.length;
                        self.lastCommentsOffset = 0;
                        self.pagesWithRows = [];

                        self.paginateComments(self.$allCommentRows, 1);
                        self.displayComments();

                    })
                    .on("click", ".close_slide_area", function () {

                        self.clicked_link.parent().removeClass(self.classes.openedTab.replace('.', ''));
                        self.clicked_link.find(self.classes.caretUp).hide();
                        self.clicked_link.find(self.classes.caretDown).show();

                        self.closeEfeedbackTabField($(this));

                    });

                _initialized = true;

            }

        },

        /**
         * Scrolls to the element if the element is not already in the viewport
         *
         * @param {jQuery} $selector The jQuery selector of this element
         * @param {integer} content_height The height of the full visible element
         * @param {integer} distance  The distance to window bottom
         */
        scrollIntoView: function($selector, content_height, distance) {

            var distance_bottom              = $selector[0].getBoundingClientRect().top;
            var window_height                = window.innerHeight;
            var main_content_height          = content_height;
            var distance_to_bottom           = distance;
            var diff                         = window_height - distance_bottom;

            if (diff < main_content_height + distance_to_bottom) {

                $('html, body').animate({
                    scrollTop: $(window).scrollTop() + (main_content_height - diff + distance_to_bottom )
                }, 'slow');

            }

        },

        /**
         * Scroll the document, if click on the Tab and the result_row_tab-content is cut on the screen.
         * This document scroll up to the result_row_tab-content is visible complete on the screen.
         */
        scrollTariffResult: function() {

            var mainContentHeight   = ns.efeedback.main_content_height;
            var distanceToBottom    = 50;
            var heightTariffBasket  = 0;
            var $basketBarContainer = $(ns.efeedback.classes.basketBarContainer);

            if ($basketBarContainer.is(":visible")) {
                heightTariffBasket = $basketBarContainer.height();
            }

            var distance = distanceToBottom + heightTariffBasket;

            ns.efeedback.scrollIntoView(this.clicked_link, mainContentHeight, distance);

        },

        /**
         * Generate a row for an active report "Testberichte"
         */
        updateEfeedbackDomContent: function () {

            if(this.$current_row) {

                this.initCustomerChart();
                this.initCustomerComments();

            }

            this.setMainContentHeight(this.main_content.outerHeight());

        },


        /********************************************************
         *                                                      *
         *                      Chart                           *
         *                                                      *
         ********************************************************/


        /**
         * Calculates the highest rate AND whether only 1 star
         * has been rated or not.
         */
        calcRatingCounts: function() {

            var ratings = [];

            var self = this;

            $.each(this.domElements.$chartBeamRows, function() {

                var $row  = $(this);
                var count = parseInt($row.find('.count').text());

                if (count > 0) {

                    ratings.push(count);

                    if (count > self.fields.highestRatingCount) {
                        self.fields.highestRatingCount = count;
                    }

                }

            });

            this.fields.isOnlyOneStarRated = ratings.length === 1;

        },

        /**
         * Fill one star after another with yellow color.
         *
         * @param {jQuery} $stars        All Stars elements
         * @param {jQuery} $currentStar  Current star element
         * @param {Number} rate          Star rating
         * @param {Number} starWidth     Width of the stars
         */
        fillStars: function($stars, $currentStar, rate, starWidth) {

            if ($currentStar.length === 0) {
                return;
            }

            var currentIndex = $stars.index($currentStar);
            var width        = rate * starWidth;

            $currentStar.width(width);

            this.fillStars(
                $stars,
                $stars.eq(currentIndex + 1),
                rate - 1,
                starWidth
            );

        },

        /**
         * Filles the beams in the chart.
         *
         * @param {jQuery} $beams Beam elements
         */
        fillBeams: function($beams) {

            var highestCount = this.fields.highestRatingCount;

            var _this = this;

            $.each($beams, function() {

                var $beam       = $(this);
                var count       = parseInt($beam.parents('.row').find('.count').text(), 10);
                var basePercent = _this.fields.isOnlyOneStarRated ? 100 : 95;
                var beamWidth   = count / highestCount * basePercent;

                $beam.width(beamWidth + '%');

            });

        },

        /**
         * Init the customer chart
         */
        initCustomerChart: function() {

            this.domElements.$chartMainContainer         = this.$current_row.find('.customer_chart');
            this.domElements.$chartStarsContainer        = this.domElements.$chartMainContainer.find('.stars_container');
            this.domElements.$feedbacksProviderHeadline  = this.domElements.$chartMainContainer.find('.feedbacks_provider_headline');
            this.domElements.$countFeedbacksDescription  = this.domElements.$chartMainContainer.find('.count_feedbacks_description');
            this.domElements.$chartFeedbackStars         = this.domElements.$chartMainContainer.find('.feedbacks_stars');
            this.domElements.$chartBeamsContainer        = this.domElements.$chartMainContainer.find('.chart_beam_container');
            this.domElements.$chartBeamRows              = this.domElements.$chartMainContainer.find('.row');
            this.domElements.$chartFilledBeams           = this.domElements.$chartBeamRows.find('.filled_beam');
            this.domElements.$chartEmptyBeams            = this.domElements.$chartBeamRows.find('.empty_beam');
            this.domElements.$chartGreyStars             = this.domElements.$chartStarsContainer.find('.grey_star');
            this.domElements.$chartYellowStars           = this.domElements.$chartStarsContainer.find('.yellow_star');
            this.domElements.$chartShowAllComments       = this.domElements.$chartMainContainer.find('.show_all_comments');

            //update the feedbacks headline
            this.domElements.$feedbacksProviderHeadline.html('Kundenbewertungen zur ' + this.data.foreign_provider_name);

            //update the count feedbacks description
            this.domElements.$countFeedbacksDescription.html(this.data.total_count + ' Kunden haben <b>' + this.data.foreign_provider_name + '</b> bewertet.');

            // update the count text vor every star category
            $.each( this.data.star_ratings, function( index, field ) {
                $(".count_beam_" + index).text(field);
            });

            //set the absolute average rate as text
            var stars_with_comma = this.data.stars.toString().replace(/\./g, ',');
            this.domElements.$chartFeedbackStars.text(stars_with_comma);

            var absoluteAverageRate = parseFloat(this.data.stars);
            var starsWidth          = this.domElements.$chartGreyStars.width();

            this.fillStars(
                this.domElements.$chartYellowStars,
                this.domElements.$chartYellowStars.eq(0),
                absoluteAverageRate,
                starsWidth
            );

            this.calcRatingCounts();

            this.fillBeams(this.domElements.$chartFilledBeams);

        },


        /********************************************************
         *                                                      *
         *                      Comments                        *
         *                                                      *
         ********************************************************/


        /**
         * Initialize pagination buttons.
         *
         * @param {Number} page Page number
         */
        initPaginationButtons: function(page) {

            if (page === this.currentPage) {
                this.enablePaginationLink(this.domElements.$commentsPageNextButton);
                this.disablePaginationLink(this.domElements.$commentsPagePrevButton);
            }

        },

        /**
         * Displays the comments for the current page.
         */
        displayComments: function() {

            this.domElements.$commentsContainer.data('page', this.currentPage);

            var isLastPage = this.commentsCount === this.lastCommentsOffset;

            isLastPage
                ? this.disablePaginationLink(this.domElements.$commentsPageNextButton)
                : this.enablePaginationLink(this.domElements.$commentsPageNextButton);

            this.currentPage > 1
                ? this.enablePaginationLink(this.domElements.$commentsPagePrevButton)
                : this.disablePaginationLink(this.domElements.$commentsPagePrevButton);

            if (this.pagesWithRows.length > 0) {

                $.each(this.pagesWithRows[this.currentPage - 1], function () {
                    $(this).show();
                });

            }

        },

        /**
         * Calculates the dimensions of rows and the container for the given page.
         *
         * @param {jQuery|Array}  $commentRows  Row objects
         * @param {Number}        page          Page number to calculate
         */
        paginateComments: function($commentRows, page) {

            var commentsContainerHeight = this.domElements.$commentsContainer.innerHeight();

            if ($commentRows.length !== 0) {

                this.pagesWithRows[page-1] = [];

                var fittedRows = 0;

                var self = this;

                // Iteration over every row.
                $commentRows.each(function () {

                    var $row = $(this);

                    var $starsContainer = $row.find('.stars_container');
                    var $greyStars      = $starsContainer.find('.grey_star');
                    var starsWidth      = $greyStars.width();

                    var customerRate    = parseFloat($starsContainer.data('customerRate'));
                    var $yellowStars    = $starsContainer.find('.yellow_star');

                    self.fillStars(
                        $yellowStars,
                        $yellowStars.eq(0),
                        customerRate,
                        starsWidth
                    );

                    var rowHeight         = $row.outerHeight(true);
                    var rowPositionBottom = $row[0].offsetTop + rowHeight;

                    /**
                     * If current row still fits in container.
                     *
                     *  OR
                     *
                     * If the first comment row is bigger than the container itself,
                     * the script would break. We need to give the big comment a chance
                     * to fit in the container.
                     */
                    if (rowPositionBottom < commentsContainerHeight || fittedRows === 0) {

                        fittedRows++;
                        self.lastCommentsOffset++;

                        self.pagesWithRows[page-1].push($row);

                    } else {
                        return false;
                    }

                });

                $commentRows.hide();

            }

        },

        /**
         * Unwraps the span element from the anchor.
         *
         * @param {jQuery} $element Element
         */
        disablePaginationLink: function($element) {

            if ($element.parent().is('a')) {
                $element.unwrap();
            }

        },

        /**
         * Wraps the span element with an anchor.
         *
         * @param {jQuery} $element Element
         */
        enablePaginationLink: function($element) {

            if (!$element.parent().is('a')) {
                $element.wrap($('<a/>'));
            }

        },

        /**
         * Generate a comment row, based on the received comment object
         * @param {object} comment  The comment object
         * @returns {object}        The comment row as DOM element
         */
        generateCommentRow: function(comment) {

            // comment date format
            var created = moment(comment.created).format("DD.MM.YYYY");

            return $('<div class="row filtered" style="display: none;">' +
                '<div class="stars_container clearfix" data-customer-rate="' + comment.stars + '">' +
                '<div class="grey_star"><div class="yellow_star"></div></div>' +
                '<div class="grey_star"><div class="yellow_star"></div></div>' +
                '<div class="grey_star"><div class="yellow_star"></div></div>' +
                '<div class="grey_star"><div class="yellow_star"></div></div>' +
                '<div class="grey_star"><div class="yellow_star"></div></div>' +
                '<span class="customer_name">' + comment.customer + '</span>' +
                '<span class="customer_date">' + created + '</span>' +
                '</div>' +
                '<p class="comment">' + comment.text + '</p>')
            '</div>';
        },

        /**
         * Get through all comments and fill the comments container
         * with them
         */
        fillCommentsContainer: function() {

            var self = this;

            if(this.data.comments.length > 0) {

                $.each(this.data.comments, function (index, comment) {

                    var comment_row = self.generateCommentRow(comment);
                    self.domElements.$commentsContainer.append(comment_row);

                });

            }

        },

        /**
         *
         */
        initCustomerComments: function() {

            this.domElements.$commentsMainContainer       = this.$current_row.find('.customer_comments');
            this.domElements.$commentsHeadline            = this.domElements.$commentsMainContainer.children('h3').first();
            this.domElements.$commentsContainer           = this.domElements.$commentsMainContainer.find('.comments_container');

            this.fillCommentsContainer();

            this.domElements.$commentsPaginationContainer = this.domElements.$commentsMainContainer.find('.pagination_container');
            this.domElements.$commentRows                 = this.domElements.$commentsMainContainer.find('.row');
            this.domElements.$commentsPagePrevButton      = this.domElements.$commentsPaginationContainer.find('span.prev');
            this.domElements.$commentsPageNextButton      = this.domElements.$commentsPaginationContainer.find('span.next');

            // Reset variables
            this.currentPage        = 1;
            this.commentsCount      = this.data.comments.length;
            this.pagesWithRows      = [];
            this.lastCommentsOffset = 0;
            this.$allCommentRows    = this.domElements.$commentRows;
            this.$filteredRows      = this.$allCommentRows;

            this.commentsHeadlineOriginalText = this.domElements.$commentsHeadline.html();

            this.domElements.$commentsContainer.data('page', this.currentPage);

            // We have to display all rows at first to determine the height of the rows.
            this.domElements.$commentsMainContainer.find('.row').show();

            // Start with first page
            this.initPaginationButtons(this.currentPage);
            this.paginateComments(this.$filteredRows, this.currentPage);
            this.displayComments();


        }

    };

    $(document).ready(function(){
        ns.efeedback.init();
    });

})(jQuery, document, window);
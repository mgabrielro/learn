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

            setTimeout(function(){

                $('input[type=text], input[type=hidden]').each(function(index, element) {

                    var $element = $(element);

                    if($element.val() != '') {
                        $element.trigger('autofill');
                    }

                });

            }, milliseconds);

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
                return profession_mapping[profession]
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
            } else if(parms =date.match(de_date_regex)) {
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

    $(document).ready(function(){
        ns.utils.detect_autofill();
    });


})($, document);


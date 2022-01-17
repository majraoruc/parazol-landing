var url = window.location.href;
var URL = url.substring(0, ((url.indexOf('?') === -1) ? url.length : url.indexOf('?')));

$(document).ready(function () {


    $.validator.addMethod(
        "regex",
        function (value, element, regexp) {
            if (regexp.constructor != RegExp)
                regexp = new RegExp(regexp);
            else if (regexp.global)
                regexp.lastIndex = 0;
            return this.optional(element) || regexp.test(value);
        },
        "Provjerite polje."
    );


    $.validator.messages.required = 'Popunite ovo polje';

    var first = '';

    function getRegExPhoneText() {
        return "+387" + 'xxxxxxxx';
    }

    var validator = [];
    var first = ""
    function createValidate() {

        $.each($('form'), function (index, value) {

            // ponisti prije validator i kreiraj novi
            if (validator[index]) {
                validator[index].destroy();
            }

            validator[index] = $(value).validate({
                errorClass: "errorValidate",
                highlight: function (element) {

                    $(element).addClass("errorBorder");

                    if (!first) {
                        first = element;
                        $(element).focus();
                    }
                    try {
                        ga('send', {
                            hitType: 'event',
                            eventCategory: 'form0_error',
                            eventAction: $(element).attr('name'),
                            eventLabel: $(element).val()
                        });
                    } catch (error) {
                        console.error(error);
                    }

                    return false;
                },
                unhighlight: function (element) {

                    $(element).removeClass("errorBorder");

                    first = '';
                    return false;
                },
                rules: {
                    'name': {
                        required: true,
                        regex: '^[A-Za-z ]{3,30}$'
                    },
                    'phone': {
                        required: true,
                        //regex: '^\\' + settings.phonePrefix + '[0-9]{6,10}$'
                        regex: '^[\\+ 0-9]{7,15}$'
                    }

                },
                messages: {
                    'name': {
                        required: 'Unesite ime',
                        regex: 'Unesite ime'
                    },
                    'phone': {
                        required: getRegExPhoneText(),
                        regex: getRegExPhoneText()
                    }
                }
            });

        });
    }


    // refresh vadliacija
    createValidate();
    function getPrice(price) {
        return price + ' ' + settings.currency;
    }


    $('form').on('click', 'button', function (event) {

        event.preventDefault();

        let name = 'not_set';
        let phone = 'not_set';
        // this form
        let form = $(this).closest('form');

        try {
            name = $(form).find('input[name="name"]').val();
            phone = $(form).find('input[name="phone"]').val();
            select = $(form).find('select[name="product"]').val();
        } catch (error) {
            console.error(error);
        }

        // ako je sve ok verifikacija idemo dalje
        if ($(form).valid()) {
            console.log('forma validna');
            console.log(form);

            ga('send', {
                hitType: 'event',
                eventCategory: 'form0',
                eventAction: 'submit_success',
                eventLabel: name + ' : ' + phone + ' : ' + select
            });

            $(form).submit();
        }
        return false;
    });

});


var jumpToForm = function () {

    $([document.documentElement, document.body]).animate({
        scrollTop: $("#formjump").offset().top
    }, 1000);
}
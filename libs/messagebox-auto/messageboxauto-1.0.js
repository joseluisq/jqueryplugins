/*
  LBN Studio
  Message Box Auto v1.0
*/
;
(function ($) {
    $.MessageBoxAuto = function (options) {
        $.MessageBoxAuto.dev.init(options)
    };
    $.MessageBoxAuto.TYPE_ALERT = 1;
    $.MessageBoxAuto.TYPE_ERROR = 2;
    $.MessageBoxAuto.TYPE_INFO = 3;
    $.MessageBoxAuto.TYPE_OK = 4;
    $.MessageBoxAuto.dev = {
        type: {
            ALERT: {
                classIcon: "alert",
                classColor: "black"
            },
            INFO: {
                classIcon: "info",
                classColor: "blue"
            },
            ERROR: {
                classIcon: "error",
                classColor: "red"
            },
            OK: {
                classIcon: "ok",
                classColor: "green"
            }
        },
        opt: null,
        overlay: null,
        counter: null,
        idCloseOut: null,
        idCounter: null,
        countdown: null,
        input: null,
        container: null,
        init: function (options) {
            var s = this;
            if (s.container != null) {
                return false
            };
            var opt, defaults = {
                type: $.MessageBoxAuto.TYPE_ALERT,
                title: "Alert",
                message: "This is a text to example",
                seconds: 8,
                zIndex: 8600,
                opacity: 50,
                character: "'",
                onClose: null
            };
            s.opt = $.extend(defaults, options);
            opt = s.opt;
            s.overlay = $('<div/>').css({
                zIndex: s.opt.zIndex,
                opacity: s.opt.opacity / 100
            }).addClass("messagebox-auto").addClass("msgboxauto-overlay").prependTo('body');
            s.container = $('<div/>').css({
                zIndex: s.opt.zIndex + 1
            }).addClass("messagebox-auto").addClass("msgboxauto-container").prependTo('body');
            s.counter = $('<span/>').addClass("msgboxauto-countdown").appendTo(s.container);
            $('<div/>').addClass("msgboxauto-top").appendTo(s.container);
            var middle = $('<div/>').addClass("msgboxauto-middle").appendTo(s.container);
            $('<div/>').addClass("msgboxauto-bottom").appendTo(s.container);
            var iconClass, colorClass;
            switch (opt.type) {
            case $.MessageBoxAuto.TYPE_INFO:
                iconClass = s.type.INFO.classIcon;
                colorClass = s.type.INFO.classColor;
                break;
            case $.MessageBoxAuto.TYPE_ERROR:
                iconClass = s.type.ERROR.classIcon;
                colorClass = s.type.ERROR.classColor;
                break;
            case $.MessageBoxAuto.TYPE_OK:
                iconClass = s.type.OK.classIcon;
                colorClass = s.type.OK.classColor;
                break;
            default:
                iconClass = s.type.ALERT.classIcon;
                colorClass = s.type.ALERT.classColor;
                break
            };
            $('<span/>').addClass("msgboxauto-icon").addClass(iconClass).appendTo(middle);
            var msg = $('<span/>').addClass("msgboxauto-message").addClass(colorClass).appendTo(middle);
            $('<div/>').addClass("msgboxauto-title").html(s.opt.title).appendTo(msg);
            s.input = $('<input/>').attr("type", "button").css({
                position: 'absolute',
                zIndex: -1,
                width: 1,
                height: 1
            }).prependTo(msg).focus();
            $('<div/>').addClass("msgboxauto-description").html(s.opt.message).appendTo(msg);
            s.show()
        },
        show: function () {
            var s = this;
            s.bindEvents();
            s.setPosition();
            s.setAutoClose()
        },
        hide: function () {
            var s = $.MessageBoxAuto.dev;            
            if (s.idCloseOut) {
                clearInterval(s.idCloseOut);
                clearInterval(s.idCounter);
                s.idCloseOut = null;
                s.idCounter = null;
                s.countdown = null
            };
            s.unbindEvents();
            s.container.remove();
            s.overlay.remove();
            s.container = null;
            if (jQuery.isFunction(s.opt.onClose)) {
                s.opt.onClose.apply(s,[])
            }
        },
        setAutoClose: function () {
            var s = this;
            s.countdown = s.opt.seconds;
            s.idCloseOut = setInterval(s.hide, (s.opt.seconds + 1) * 1000);
            s.idCounter = setInterval(s.updateCounter, 1 * 1000)
        },
        updateCounter: function () {
            var s = $.MessageBoxAuto.dev;
            var cnt = (s.countdown.toString().length == 1) ? "0" + s.countdown.toString() : s.countdown.toString();
            s.counter.text(cnt + s.opt.character);
            s.countdown--;
        },
        bindEvents: function () {
            var s = this;
            $(document).bind('keydown.msgbox', function (e) {
                if (e.keyCode === 9) {
                    e.preventDefault();
                    s.input.focus().select()
                } else if (e.keyCode === 27) {
                    e.preventDefault();
                    s.hide();
                }
            });
            s.overlay.bind('click.msgbox', function () {
                s.hide();
            });
            $(window).bind('resize.msgbox', function () {
                s.setPosition();
            })
        },
        unbindEvents: function () {
            var s = this;
            $(window).unbind('resize.msgbox');
            s.overlay.unbind('click.msgbox');
            $(document).unbind('keydown.msgbox')
        },
        setPosition: function () {
            var s = this,
                top, left, w = s.getDimensions(),
                top = (w[0] - s.container.outerHeight(true)) / 2,
                left = (w[1] - s.container.outerWidth(true)) / 2;
            s.container.css({
                left: left,
                top: top
            })
        },
        getDimensions: function () {
            var el = $(window);
            var h = $.browser.opera && $.browser.version > '9.5' && $.fn.jquery < '1.3' || $.browser.opera && $.browser.version < '9.5' && $.fn.jquery > '1.2.6' ? el[0].innerHeight : el.height();
            return [h, el.width()]
        }
    };
    $.MessageBoxAuto.close = function () {
        $.MessageBoxAuto.dev.hide()
    }
})(jQuery);
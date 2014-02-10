/*
 * xValidator 1.1.1
 * Copyright 2014, Jose Luis Quintana <joseluisquintana20@gmail.com>
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * Built for jQuery library
 * http://jquery.com
 * 
 * Date: Wed Feb 22 11:34:10 2012 -0500
 */
(function($) {
    var that;
    var methods = {
        xvalidator: function(options) {
            this.bind("submit.xvalidator", methods._submit);
            this.data("xvalidator", {
                form: this,
                options: options
            });
            for (var element in options.fields) {
                methods.addValidation.apply(this, [element, options.fields[element]])
            }
            return that = this;
        },
        valid: function() {
            var k = $(this).data("xvalidator"),
                    h = null,
                    i = null,
                    g = true;
            for (var e in k.options.fields) {
                if (k.options.fields[e]["disabled"]) {
                    continue
                }
                i = $("#" + e, this);
                var j = k.options.fields[e];

                if (i.hasClass("xcombobox")) {
                    h = methods._validator(this, i, i.xcombobox("getValue"), k.options, j, true)
                } else {
                    if (i.is("input,textarea,select")) {
                        h = methods._validator(this, i, i.val(), k.options, j, true)
                    }
                }
                if (h == "ok") {
                    k.options.onValid.apply(this, [i])
                } else {
                    k.options.onInvalid.apply(this, [i]);
                    g = false;
                    break
                }
            }
            return g
        },
        isValid: function() {
            var k = $(this).data("xvalidator"),
                    h = null,
                    i = null,
                    g = true;
            for (var e in k.options.fields) {
                if (k.options.fields[e]["disabled"]) {
                    continue;
                }
                i = $("#" + e, this);
                var j = k.options.fields[e];
                if (i.hasClass("xcombobox")) {
                    h = methods._validator(this, i, i.xcombobox("getValue"), k.options, j, false);
                } else {
                    if (i.is("input,textarea,select")) {
                        h = methods._validator(this, i, i.val(), k.options, j, false);
                    }
                }
                if (h != "ok") {
                    g = false;
                    break;
                }
            }
            return g;
        },
        _submit: function(e) {
            var g = $(this).data("xvalidator");
            if (!g.options.submit) {
                e.preventDefault()
            }
            g.options.onSubmit.apply(this, [e]);
            if (methods.valid.apply(this, [])) {
                if (g.options.errorClass) {
                    $("." + g.options.errorClass, this).removeClass(g.options.errorClass)
                }
                return g.options.onSuccess.apply(this, [])
            } else {
                return false
            }
        },
        disabledField: function(field, i) {
            var h = this.data("xvalidator");
            if (h) {
                try {
                    h.options.fields[field]["disabled"] = i;
                    this.data("xvalidator", h)
                } catch (f) {
                    return
                }
            }
        },
        addValidation: function(tag, options) {
            var e = this, data = this.data("xvalidator");

            if (data) {
                var element = $("#" + tag, this);

                if (element.hasClass("xcombobox")) {
                    data.options.fields[tag] = options;
                    this.data("xvalidator", data);

                    element.bind("onSelectedItem", {
                        opt: data.options,
                        o: options
                    }, function(event, elem) {
                        var d = methods._validator(e, $(this), elem.value, event.data.opt, event.data.o, true);
                        if (d == "ok") {
                            event.data.opt.onValid.apply(e, [$(this)])
                        } else {
                            event.data.opt.onInvalid.apply(e, [$(this)])
                        }
                    });
                } else {
                    if (element.is("input,textarea,select")) {
                        data.options.fields[tag] = options;
                        this.data("xvalidator", data);

                        element.bind("keyup", {
                            opt: data.options,
                            o: options
                        }, function(event) {
                            if (!(/(9|13|16|17|18|27|37|38|39|40|93)$/).test(event.which)) {
                                var d = methods._validator(e, $(this), $(this).val(), event.data.opt, event.data.o, false);
                                if (d == "ok") {
                                    if (event.data.opt.errorClass) {
                                        $(this).removeClass(event.data.opt.errorClass);
                                    }
                                    if (event.data.opt.tooltip) {
                                        $(".xtooltip", e).remove()
                                    }
                                    event.data.opt.onValid.apply(e, [$(this)])
                                } else {
                                    event.data.opt.onInvalid.apply(e, [$(this)])
                                }
                            }
                        });

                        if (options.label && element.is("input[type=text],input[type=password],textarea")) {
                            element.val(options.label);
                            element.bind("focus", options.label, function(event) {
                                if (event.data == $(this).val()) {
                                    $(this).val("")
                                }
                            }).bind("blur", options.label, function(d) {
                                if (methods.isEmpty($(this).val())) {
                                    $(this).val(d.data)
                                }
                                if (data.options.tooltip) {
                                    $(".xtooltip", e).remove()
                                }
                            })
                        } else {
                            if (data.options.tooltip) {
                                element.bind("blur", function() {
                                    $(".xtooltip", e).remove()
                                })
                            }
                        }
                    }
                }
            }
        },
        removeValidation: function(g) {
            var h = this.data("xvalidator");
            if (h) {
                var e = $("#" + g, this);
                if (e.hasClass("xcombobox")) {
                    delete h.options.fields[g];
                    this.data("xvalidator", h);
                    e.unbind("onSelectedItem")
                } else {
                    if (e.is("input,textarea,select")) {
                        delete h.options.fields[g];
                        this.data("xvalidator", h);
                        e.unbind("keyup")
                    }
                }
            }
        },
        _validator: function(g, i, h, e, d, s) {
            if (!d.rule['required'] && h == '') {
                return 'ok';
            }

            for (var f in d.rule) {
                switch (f.toLowerCase()) {
                    case "required":
                        if (i.is("input[type=checkbox]") || i.is("input[type=radio]")) {
                            if (!i.prop("checked")) {
                                return methods._showTooltip(g, i, e, d.message, s)
                            }
                        } else {
                            if ((d.label && d.label == i.val()) || d.rule[f] && methods.isEmpty(h)) {
                                return methods._showTooltip(g, i, e, d.message, s)
                            }
                        }
                        break;
                    case "number":
                    case "numeric":
                        if (d.rule[f] != null && !methods.isNumeric(h)) {
                            return methods._showTooltip(g, i, e, d.message, s)
                        }
                        break;
                    case "integer":
                    case "int":
                        if (d.rule[f] != null && !methods.isInteger(h)) {
                            return methods._showTooltip(g, i, e, d.message, s)
                        }
                        break;
                    case "decimal":
                    case "double":
                        if (d.rule[f] != null && !methods.isDecimal(h)) {
                            return methods._showTooltip(g, i, e, d.message, s)
                        }
                        break;
                    case "positive":
                        if (d.rule[f] != null && methods.isNegative(h)) {
                            return methods._showTooltip(g, i, e, d.message, s)
                        }
                        break;
                    case "negative":
                        if (d.rule[f] != null && !methods.isNegative(h)) {
                            return methods._showTooltip(g, i, e, d.message, s)
                        }
                        break;
                    case "url":
                        if (d.rule[f] != null && !methods.isURL(h)) {
                            return methods._showTooltip(g, i, e, d.message, s)
                        }
                        break;
                    case "email":
                    case "mail":
                        if (d.rule[f] != null && !methods.isEmail(h)) {
                            return methods._showTooltip(g, i, e, d.message, s)
                        }
                        break;
                    case "alphanumeric":
                        if (d.rule[f] != null && !methods.isAlphaNumeric(h)) {
                            return methods._showTooltip(g, i, e, d.message, s)
                        }
                        break;
                    case "alphabetic":
                        if (d.rule[f] != null && !methods.isAlphabetic(h)) {
                            return methods._showTooltip(g, i, e, d.message, s)
                        }
                        break;
                    case "major":
                    case "high":
                        if (d.rule[f] != null && !methods.isMajor(h, d.rule[f])) {
                            return methods._showTooltip(g, i, e, d.message, s)
                        }
                        break;
                    case "minor":
                    case "low":
                        if (d.rule[f] != null && !methods.isMinor(h, d.rule[f])) {
                            return methods._showTooltip(g, i, e, d.message, s)
                        }
                        break;
                    case "min":
                        if (d.rule[f] != null && !methods.isMin(h, d.rule[f])) {
                            return methods._showTooltip(g, i, e, d.message, s)
                        }
                        break;
                    case "max":
                        if (d.rule[f] != null && !methods.isMax(h, d.rule[f])) {
                            return methods._showTooltip(g, i, e, d.message, s)
                        }
                        break;
                    case "custom":
                        if (d.rule[f] != null && !(new RegExp(d.rule[f])).test(h)) {
                            return methods._showTooltip(g, i, e, d.message, s)
                        }
                        break;
                    case "equalto":
                        if (d.rule[f] != null && !methods.equalTo(h, b(d.rule[f]).val())) {
                            return methods._showTooltip(g, i, e, d.message, s)
                        }
                        break
                }
            }

            return "ok"
        },
        _showTooltip: function(h, i, e, g, s) {
            i.focus();
            if (e.errorClass && !i.hasClass(e.errorClass)) {
                methods._clear.apply(that, [false]);

                i.addClass(e.errorClass);
            }
            if (s && e.tooltip) {
                var d = null;
                if ($(".xtooltip", h).length <= 0) {
                    d = methods._buildTooltip(i, g);
                    i.before(d);
                    d.show();
                    $(".xcorner", d).css("margin-top", d.innerHeight() - 1)
                } else {
                    if (i.attr("id") == $(".xtooltip", h).attr("lang")) {
                        d = $(".xtooltip", h)
                    } else {
                        d = methods._buildTooltip(i, g);
                        i.before(d);
                        d.show();
                        $(".xcorner", d).css("margin-top", d.innerHeight() - 1)
                    }
                }
                if (e.scrollingAuto) {
                    methods._moveScroll(i, (d.height() + $(".xcorner", d).height()) * 2)
                }
            }
            return i
        },
        _buildTooltip: function(e, d) {
            return $("<div/>").attr("lang", e.attr("id")).addClass("xvalidator").addClass("xtooltip").css({
                position: "absolute"
            }).hide().append($("<span/>").addClass("xcorner")).append($("<span/>").addClass("xtext").html(d))
        },
        _moveScroll: function(d, e) {
            $("html:not(:animated),body:not(:animated)").animate({
                scrollTop: Number(d.offset().top) - (e ? e : 0)
            }, 500)
        },
        reset: function() {
            var e = this.data("xvalidator").options;

            if (e.tooltip) {
                $(".xtooltip", this).remove();
            }

            methods._clear.apply(this, [true]);
        },
        _clear: function(reset) {
            var e = this.data("xvalidator").options;
            for (var d in e.fields) {
                if (e.errorClass) {
                    $("#" + d, this).removeClass(e.errorClass);
                }
                if (reset) {
                    $("#" + d, this).val(e.fields[d].label);
                }
            }
        },
        removeTooltips: function() {
            var e = this.data("xvalidator").options;
            if (e.tooltip) {
                $(".xtooltip", this).remove();
            }
        },
        isEmpty: function(d) {
            return (d == null || d.length == 0 || /^\s+$/.test(d))
        },
        isEmail: function(d) {
            return (/\w{1,}[@][\w\-]{1,}([.]([\w\-]{2,})){1,3}$/).test(d)
        },
        isURL: function(d) {
            return (/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi).test(d)
        },
        isNumeric: function(d) {
            return /^-?(0|[1-9]\d*|(?=\.))(\.\d+)?$/.test(d)
        },
        isInteger: function(d) {
            return (/^-?[0-9]+$/).test(d)
        },
        isDecimal: function(d) {
            return (/^-?[0-9]+\.[0-9]{1,}$/).test(d)
        },
        isNegative: function(d) {
            return (/^-[0-9]+(\.[0-9]{1,})?$/).test(d)
        },
        isAlphaNumeric: function(d) {
            return (/^[0-9a-z-A-Z]+$/).test(d)
        },
        isAlphabetic: function(d) {
            return (/^[a-zA-Z]+$/).test(d)
        },
        isMajor: function(e, d) {
            return (methods.isNumeric(e)) ? (Number(e) > d ? true : false) : false
        },
        isMinor: function(e, d) {
            return (methods.isNumeric(e)) ? (Number(e) < d ? true : false) : false
        },
        isMax: function(e, d) {
            return (methods.isNumeric(e)) ? (Number(e) < d ? true : false) : false
        },
        isMin: function(e, d) {
            return (methods.isNumeric(e)) ? (Number(e) > d ? true : false) : false
        },
        equalTo: function(e, d) {
            return !!(e === d)
        }
    };

    var defaults = {
        fields: null,
        tooltip: false,
        scrollingAuto: true,
        message: false,
        errorClass: null,
        submit: false,
        onSubmit: function() {
        },
        onSuccess: function() {
        },
        onValid: function() {
        },
        onInvalid: function() {
        }
    };

    $.fn.xvalidator = function(options) {
        if (options && typeof (options) === "object") {
            options = $.extend({}, defaults, options)
        }

        if (typeof (options) == "string" && methods[options]) {
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1))
        } else {
            if (typeof options === "object" || !options) {
                return methods.xvalidator.apply(this, arguments)
            } else {
                $.error("Method " + options + " does not exist on jQuery.xvalidator")
            }
        }
    };
})(jQuery);

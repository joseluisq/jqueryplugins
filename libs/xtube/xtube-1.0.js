/**
 * XTube 1.0 - jQuery plugin
 * Copyright 2011, Jose Luis Quintana
 * http://www.lbnstudio.fr
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * Built for jQuery library
 * http://jquery.com
 * 
 * Date: Fri Aug 03 19:59:48 2011 -0500
 **/
(function ($) {
    var methods = {
        xtube: function (opt) {
            if (!opt && typeof (opt) !== 'object') {
                return
            }
            if (opt.url && typeof (opt.url) === 'string') {
                if (!opt.url.match(/http:\/\/(?:www\.)?youtube.*watch\?v=([a-zA-Z0-9\-\_]+)/)) {
                    return opt.onInvalidURL.apply(this, [opt.url])
                }
                var r = opt.url.match(/[\\?&]v=([^&#]*)/),
                    s = this,
                    k = (r) ? r[1] : opt.url;
                $.ajax({
                    type: 'GET',
                    url: 'http://gdata.youtube.com/feeds/api/videos/' + k + '?format=5&alt=json-in-script&callback=?',
                    dataType: 'json',
                    data: {
                        nocache: new Date().getTime()
                    },
                    success: function (e) {
                        var data = {};
                        if (e && e != 'undefined' && e.entry && e.entry != 'undefined') {
                            var f = methods.secondsToTime(e.entry.media$group.media$content[0].duration);
                            data = {
                                "title": e.entry.title.$t,
                                "thumbnailhq": {
                                    "url": e.entry.media$group.media$thumbnail[0].url,
                                    "height": e.entry.media$group.media$thumbnail[0].height,
                                    "width": e.entry.media$group.media$thumbnail[0].width
                                },
                                "thumbnail": {
                                    "url": e.entry.media$group.media$thumbnail[1].url,
                                    "height": e.entry.media$group.media$thumbnail[1].height,
                                    "width": e.entry.media$group.media$thumbnail[1].width
                                },
                                "content": {
                                    "url": e.entry.media$group.media$content[0].url,
                                    "type": e.entry.media$group.media$content[0].type,
                                    "medium": e.entry.media$group.media$content[0].medium,
                                    "duration": e.entry.media$group.media$content[0].duration,
                                    "duration_formatted": f.f
                                }
                            }
                        } else {
                            data = null
                        }
                        return opt.onSuccess.apply(s, [data])
                    },
                    error: function () {
                        alert('sorry, unexpected error!')
                    }
                })
            }
        },
        secondsToTime: function (secs) {
            var hours = Math.floor(secs / (60 * 60)),
                divisor_for_minutes = secs % (60 * 60),
                minutes = Math.floor(divisor_for_minutes / 60),
                divisor_for_seconds = divisor_for_minutes % 60,
                seconds = Math.ceil(divisor_for_seconds);
            return {
                'h': hours,
                'm': minutes,
                's': seconds,
                'f': ((hours === 0) ? '' : hours + ':') + minutes + ':' + seconds
            }
        }
    };
    var defaults = {
        url: null,
        onSuccess: function () {},
        onInvalidURL: function () {
            alert('sorry, enter a valid url video!')
        }
    };
    jQuery.extend({
        xtube: function (options) {
            methods.xtube(options)
        }
    })
})(jQuery);
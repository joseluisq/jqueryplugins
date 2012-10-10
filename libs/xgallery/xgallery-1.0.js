/**
 * xGallery 1.0 - jQuery plugin
 * Copyright 2011, Jose Luis Quintana <joseluismegateam@gmail.com>
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * Built for jQuery library
 * http://jquery.com
 * 
 * Date: Tue Aug 03 20:17:23 2011 -0500
 **/

(function ($) {
    var s = null,
    ci = 0,
    lc = 0,
    active = false;
    $.fn.xGallery = function (options) {
        return $.fn.xGallery.dev.initialize(this, options)
    };
    $.fn.xGallery.dev = {
        total: 0,
        obj: null,
        thumbs: null,
        thumbs_content: null,
        container_thumbs: null,
        viewer: null,
        loader: null,
        opt: null,
        _list: [],
        defaults: {
            width: 945,
            height: 530,
            paddingLeft: 10,
            paddingRight: 10,
            easing: null
        },
        initialize: function (obj, options) {
            s = this;
            this.obj = obj;
            this.opt = $.extend(this.defaults, options);
            this.thumbs = $(".thumbnails", obj);
            this.thumbs_content = $(".thumbs-content", this.thumbs);
            var opt = this.opt,
            thumbs = this.thumbs,
            viewer = this.viewer,
            total = $("img", s.thumbs).length;
            this.viewer = $(".viewer", obj).css({
                overflow: 'hidden',
                width: opt.width,
                height: opt.height
            });
            obj.css({
                width: opt.width,
                display: 'block'
            });
            if (total <= 0) {
                return this
            }
            this.total = total;
            this.container_thumbs = $('<div />').addClass('container_thumbs').prependTo(this.thumbs);
            var _next = $('<span />').addClass('next').prependTo(this.thumbs);
            var _back = $('<span />').addClass('back').prependTo(this.thumbs);
            var wt = opt.width - (_back.width() + _back.width());
            this.container_thumbs.append(this.thumbs_content.css({
                width: opt.width - (_next.width() * 2)
            })).css({
                width: wt - opt.paddingLeft - opt.paddingRight,
                margin: '0 auto',
                overflow: 'hidden'
            });
            var last = $("img:last", this.thumbs_content);
            this.thumbs_content.css({
                width: (last.outerWidth(true) * total) - parseInt(last.css('margin-right').replace('px', ''))
            }).css('margin-left', 0);
            last.css('margin-right', 0);
            _next.css("margin-left", wt + _next.width());
            $("img", this.thumbs_content).each(function (i, img) {
                $(img).css('float', 'left').attr('lang', i);
                s._list.push({
                    thumb: $(img),
                    view: null
                })
            });
            this.loader = $('<span />');
            this.loader.addClass('loading').css({
                position: 'absolute',
                width: 30,
                height: 22,
                textAlign: 'center'
            }).hide().prependTo(obj);
            this.loader.css('margin-left', (opt.width - this.loader.width()) / 2);
            this.loader.css('margin-top', (opt.height - this.loader.height()) / 2);
            $('<span>').html('&bull;').appendTo(this.loader).clone().appendTo(this.loader).clone().appendTo(this.loader);
            this.bindEvents();
            this.selectImage(0);
            this.obj.bind('contextmenu', function(e){
                e.preventDefault();
            });
            return this
        },
        bindEvents: function () {
            $("img", s.thumbs).bind('click', function () {
                s.selectImage($(this).attr('lang'))
            });
            var position = 0,
            move = 0,
            limit = 0,
            container_w = s.container_thumbs.width(),
            content_w = s.thumbs_content.width(),
            width_move = parseInt(s.opt.width / 2);
            $(".next", this.thumbs).bind('click', function (e) {
                position = parseInt(s.thumbs_content.css('margin-left').replace('px', '')), move = width_move - position, limit = content_w - container_w;
                if (content_w <= container_w) {
                    return
                }
                if (move > limit) {
                    move = limit
                }
                s.horizontalMove(-(move));
                e.preventDefault()
            });
            $(".back", this.thumbs).bind('click', function (e) {
                position = parseInt(s.thumbs_content.css('margin-left').replace('px', '')), move = width_move + position, limit = content_w - container_w;
                if (position == 0) {
                    return false
                } else {
                    if (move > 0) {
                        move = 0
                    }
                }
                s.horizontalMove(move);
                e.preventDefault()
            })
        },
        horizontalMove: function (move) {
            s.thumbs_content.animate({
                marginLeft: move
            }, 500, s.opt.easing)
        },
        selectImage: function (i) {
            if (!active) {
                i = parseInt(i);
                if (i < s.total) {
                    var img = s.getView(i),
                    thumb = img.thumb;
                    if (!thumb.hasClass('selected')) {
                        thumb.parent().find('img.selected').removeClass('selected');
                        thumb.addClass('selected');
                        s.loadImage(img)
                    }
                }
            }
        },
        getView: function (i) {
            return s._list[i]
        },
        loadImage: function (img) {
            if (!img.view) {
                s.showLoader();
                $(new Image()).load(function(){
                    img.view = this;
                    s.setBackground(this);
                    s.hideLoader()
                }).error(function () {
                    //alert('Sorry, Error to load image.')
                }).attr('src', img.thumb.attr('alt'));
                img.thumb.removeAttr('alt')
            } else {
                s.setBackground(img.view)
            }
        },
        setBackground: function (image) {
            var x = Math.round((image.width / 2) - (s.opt.width / 2)), y = Math.round((image.height / 2) - (s.opt.height / 2));
            $(image).show().css({
                'margin-left': (x * -1) + 'px ',
                'margin-top': (y * -1) + 'px',
                'visibility': 'visible',
                'display': 'block'
            });
            s.viewer.empty().append($(image));
        },
        animateLoader: function () {
            if (lc < $('span', s.loader).length) {
                lc++
            } else {
                lc = 0
            }
            $('span', s.loader).removeClass('enabled').eq(lc).addClass('enabled')
        },
        showLoader: function () {
            active = true;
            ci = setInterval(s.animateLoader, 280);
            s.loader.fadeIn('fast')
        },
        hideLoader: function () {
            clearInterval(ci);
            s.loader.fadeOut('fast');
            $('span', s.loader).removeClass('enabled');
            active = false
        }
    }
})(jQuery);
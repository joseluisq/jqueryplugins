/**
 * XPopup 1.0 - jQuery plugin
 * Copyright 2011, Jose Luis Quintana
 * http://www.lbnstudio.fr
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * 
 * Built for jQuery library
 * http://$.com
 * 
 * Date: Wed Aug 03 18:30:12 2011 -0500
 **/
(function ($) {
var methods = {
    xpopup: function( opt ) {
        return this.each(function() {
            var s = $(this), div = $('<div>'), 
                data = s.data('xpopup'), container = null, overlay = null, 
                input = $('<input/>'), closeHTML = $('<a/>');
                
                s.hide(0).css({
                    overflow: 'hidden'
                }).addClass('xpopup-data');
                
                overlay = div.clone().css({
                    zIndex: opt.zIndex,
                    opacity: opt.opacity / 100,
                    position: 'fixed',
                    display: 'block',
                    outline: 'none',
                    left: 0,
                    top: 0
                }).addClass('xpopup-overlay').hide().prependTo('body');
                
                input.val('').attr('type', 'button')
                    .addClass('xpopup-input').css({
                        position: 'absolute',
                        zIndex: -2,
                        width: 1,
                        height: 1,
                        border: '0',
                        display: 'inline',
                        outline: 'none',
                        cursor:'default',
                        background:'none'
                    });
                
                container = div.clone().addClass('xpopup-container').css({
                    zIndex: opt.zIndex + 1,
                    position: 'fixed',
                    display: 'block',
                    left: 0,
                    top: 0
                }).hide().append(input).append(s).prependTo('body');

                if (opt.close) {
                    closeHTML.addClass('xpopup-close').css({
                            position: 'absolute',
                            display:'inline',
                            zIndex: opt.zIndex + 2,
                            cursor:'pointer'
                        }).prependTo(container);
                    if (opt.closeEsc) {
                        closeHTML.attr('title', opt.closeTitle + ' (ESC)');
                    } else {
                        closeHTML.attr('title', opt.closeTitle);
                    }
                }

                if ( !data ) {
                    s.data('xpopup', {
                        s: s,
                        container: container,
                        overlay: overlay,
                        opt: opt
                    });
                }
        });
    },
    show: function() {
        if (!this.is(':visible')) {
            methods._show({data: this.data('xpopup')});
        }
    },
    hide: function() {
        if (this.is(':visible')) {
            methods._hide({data: this.data('xpopup')});
        }
    },
    _show: function(e){
        if (e.data && typeof(e.data) === 'object') {           
            methods._bindEvents(e.data);
            e.data.overlay.show(0);
            e.data.container.show(0, function(){
                var s = e.data.s, d = e.data;
                e.data.s.show();
                 var w = d.opt.width == 'auto' ? s.outerWidth(true) : d.opt.width,
                    h = d.opt.height == 'auto' ? s.outerHeight(true) : d.opt.height;
                    
                    if (d.opt.width != 'auto') {
                        d.container.css({
                            width: d.opt.width
                        });
                    }
                    
                    if (d.opt.height != 'auto') {
                        d.container.css({
                            height: d.opt.height
                        });
                    }
                    
                    $('input.xpopup-input', d.container).css({
                        left: w / 2,
                        top: h / 2
                    }).focus();
                    methods._resize({data: d});
                    if ($.isFunction(d.opt.onShow)) {
                        d.opt.onShow.apply(s,[]);
                    }
            });
            
        }
    },
    _hide: function(e) {
        if (e.data && typeof(e.data) === 'object') {
            methods._unbindEvents(e.data);
            e.data.overlay.hide(0);
            e.data.container.hide(0);
            e.data.s.hide(0);
            
            if ($.isFunction(e.data.opt.onHide)) {
                e.data.opt.onHide.apply(e.data.s,[]);
            }
        }
    },
    _bindEvents: function(data) {
        $(window).bind('resize.xpopup', data, methods._resize);
        $(document).bind('keydown.xpopup', data, methods._keydown);
        
        if (data.opt.overlayClose) {
            data.overlay.bind('click.xpopup', data, methods._hide);
        }
        if (data.opt.close) {
            $('a.xpopup-close', data.container).bind('click.xpopup', data, methods._hide);
        }
    },
    _unbindEvents: function(data) {
        $(window).unbind('resize.xpopup', methods._resize);
        $(document).unbind('keydown.xpopup', methods._keydown);
        
        if (data.opt.overlayClose) {
            data.overlay.unbind('click.xpopup', methods._hide);
        }
        if (data.opt.close) {
            $('a.xpopup-close', data.container).unbind('click.xpopup', methods._hide);
        }
    },
    _resize: function(e) {
        e.data.overlay.css({
            height: $(document).height(),
            width: $(window).width()
        });

        e.data.container.css({
            left: e.data.opt.width == 'auto' ? ($(window).width() - e.data.s.outerWidth(true)) / 2 : 
            ($(window).width() - e.data.opt.width) / 2, top: e.data.opt.height == 'auto' ? ($(window).height() - e.data.s.outerHeight(true)) / 2 : ($(window).height() - e.data.opt.height) / 2
        })
    },
    _keydown: function(e) {
        if (e.keyCode === 9) {
            methods._tab(e);
        } else if (e.keyCode === 27 && e.data.opt.close && e.data.opt.closeEsc) {
            e.preventDefault();
            methods._hide.apply( this, [{data: e.data}] );
        }
    },
    _tab: function (e) {
        if ($(e.target).parents('.xpopup-container').length > 0) {
            var inputs = $(':input:enabled:visible:first,:input:enabled:visible:last',
            e.data.container);
            if ((!e.shiftKey && e.target === inputs[inputs.length - 1]) || (e.shiftKey && 
                e.target === inputs[0]) || inputs.length === 0) {
                e.preventDefault();
                if (e.shiftKey) {
                    inputs[inputs.length - 1].focus();
                } else {
                    inputs[0].focus();
                }
            }
        } else {
            e.preventDefault();
            $('input.xpopup-input', e.data.container).focus();
        }
    }
};
var defaults = {
    width: 'auto',
    height: 'auto',
    zIndex: 8500,
    opacity: 70,
    close: false,
    closeTitle: 'Close',
    closeEsc: false,
    overlayClose: false,
    onShow: function(){},
    onHide: function(){}
};

$.fn.xpopup = function(options) {
    if (options && typeof(options) === 'object') {
        options = $.extend({}, defaults, options);
    }

    if (typeof(options) === 'string' && methods[options] ) {
        return methods[ options ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof options === 'object' || !options ) {
        return methods.xpopup.apply( this, arguments );
    } else {
        $.error( 'Method ' +  options + ' does not exist on $.xpopup' );
    }
};

})(jQuery);
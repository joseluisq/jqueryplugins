/*
 * xCombobox 1.0 - jQuery plugin
 * Copyright 2012, Jose Luis Quintana <joseluismegateam@gmail.com>
 * http://www.lbnstudio.fr
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * Built for jQuery library
 * http://jquery.com
 * 
 * Date: Thu Mar 15 11:48:24 2012 -0500
 **/
(function($) {
    var methods = {
        init : function( options ) {
            return this.each(function() {
                var s = $(this), div = $('<div>'), ul = $('<ul/>'), 
                li = null, data = s.data('xcombobox'), children = [], 
                xcombo = null, xlistheader = null, xlist = null;

                $('option', s).each(function(i, e){
                    li = $('<li/>').addClass('xitem').attr('xcontrol:value', i)
                    .html($(e).text()).attr('title', $(e).text()).appendTo(ul);
                    children.push({
                        index: i,
                        value: $(e).val(),
                        text: $(e).text(),
                        item: li
                    });
                });

                xcombo = div.clone().addClass('xcombobox').css({
                    'width': options.width,
                    'height': options.height,
                    'overflow': 'hidden'
                });
                xlistheader = $('<ul/>').addClass('xlistheader').css({
                    'width': options.width,
                    'height': options.height,
                    'overflow': 'hidden'
                }).append(
                    $('<li/>')
                    ).prependTo(xcombo);
                xlist = div.clone().addClass('xlist').css('width', options.width).append(ul)
                .appendTo(xcombo);
                s.replaceWith(xcombo.attr('id', s.attr('id'))).remove();

                if ( !data ) {
                    data = {
                        xcombobox: xcombo,
                        xchildren: children,
                        xheader: xlistheader,
                        xlist: xlist,
                        xopt: options
                    };
                    xcombo.data('xcombobox', data);
                }

                $(xlistheader, s).bind('click.xcombobox', data, methods.onClickHeader);
                $('ul', xlist).bind('blur.xcombobox', data, function(e){
                    $('.xlist', e.data.xcombobox).fadeOut('fast');
                }).attr('tabIndex', 0);
            
                if (children.length > 0) {
                    $('ul li', xlist).bind('click.xcombobox', data, methods.onClickItem);

                    if ($('option:selected', s)) {
                        var index = $('option:selected', s).index();
                    
                        $('ul li:eq('+ index +')', xlist).addClass('xcombobox_default');
                        methods.__selectItem(xcombo, index, false);
                    }
                    else {
                        $('ul li:first', xlist).addClass('xcombobox_default');
                        methods.__selectItem(xcombo, 0, false);
                    }
                }
            });
        },
        hide: function() {
            return this.each(function() {
                $('.xlist', this).fadeOut('fast');
                methods._hide(this.data('xcombobox'));
            });
        },
        _hide: function(data){
            data.xopt.onHide.apply( data.xcombobox, []);
        },
        show: function() {
            return this.each(function() {
                $('.xlist', this).fadeIn('fast', function(){
                    $('ul', this).focus();
                });
                methods._show(this.data('xcombobox'));
            });
        },
        _show: function(data){
            if (!data.xcombobox.hasClass(data.xopt.disabledClass)) {
                data.xopt.onShow.apply(data.xcombobox, []);
            }
        },
        reset: function() {
            return this.each(function(){
                $('.xlist', this).hide();
                $('.xlist li.selected', this).removeClass('selected');
                $('.xlistheader li', this).text(
                    $('.xlist li.xcombobox_default', this).addClass('selected').text()
                    );
            });
        },
        getValue: function() {
            var xc = this.data('xcombobox'), xcc = xc.xchildren, val = null;
        
            if (xcc.length > 0) {
                $.each(xcc, function(i, elem) {
                    if (elem.item.hasClass('selected')) {
                        val = (elem.value === 'undefined') ? null : elem.value;
                        return;
                    }
                });
            }

            return val;
        },
        getText: function() {
            return $('.xlist ul li.selected', this).html();
        },
        disabled: function() {
            return this.each(function() {
                var d = $(this).data('xcombobox');
                $(this).addClass(d.xopt.disabledClass);
            });
        },
        enabled: function() {
            return this.each(function() {
                var d = $(this).data('xcombobox');
                $(this).removeClass(d.xopt.disabledClass);
            });
        },
        onClickHeader: function(e) {
            var c = e.data.xcombobox.data('xcombobox').xchildren;
            if (c.length > 0) {
                if (!e.data.xcombobox.hasClass(e.data.xopt.disabledClass)) {
                    var xl = e.data.xlist;

                    if (xl.is(':visible')) {
                        xl.fadeOut('fast', function(){
                            methods._hide(e.data);
                        });
                    }
                    else {
                        xl.fadeIn('fast', function(){
                            methods._show(e.data);
                            $('ul', xl).focus();
                        });
                    }
                }
            }
        },
        onClickItem: function(e) {
            if (e.data.xchildren.length > 0) {
                if (!$(this).hasClass('selected')) {
                    $('li.selected', $(this).parent()).removeClass('selected');
                    $(this).addClass('selected');
                    $('.xlistheader li', e.data.xcombobox).text($(this).text());
                    var item = e.data.xchildren[parseInt($(this).attr('xcontrol:value'))];
                    e.data.xopt.onSelectedItem.apply( e.data.xcombobox, [item] );
                    e.data.xcombobox.trigger('onSelectedItem', [item]);
                }

                e.data.xlist.fadeOut('fast', function(){
                    methods._hide(e.data);
                });
            }
        
        },
        selectItem: function(i) {
            if (i) {
                methods.__selectItem(this, i, false);
            }
        },
        selectItemById: function(i) {
            if (i) {
                methods.__selectItem(this, i, true);
            }
        },
        loadFromArray: function(a) {
            if ($.isArray(a)) {
                var li, ul = $('<ul/>'), children = [], i = 0;
                methods.clear.apply(this,[]);
                        
                for (var e in a) {
                    var el = a[e], v, t;
                    if ($.isArray(el)) {
                        v = el[0];
                        t = el[1];
                    }
                    else if (typeof(el) === 'object') {
                        v = el['value'];
                        t = el['text'];
                    }
                
                    li = $('<li/>').addClass('xitem').attr('xcontrol:value', i)
                    .html(t).attr('title', t).appendTo(ul);
                    children.push({
                        index: i,
                        value: v,
                        text: t,
                        item: li
                    });
                    i++;
                }
            
                var d = this.data('xcombobox');
                $(d.xlist).append(ul);
                $('ul li:first', d.xlist).addClass('xcombobox_default');
                d.xchildren = children;
                this.data('xcombobox', d);
                methods.__selectItem(this, 0, false);
                $('ul li', d.xlist).bind('click.xcombobox', d, methods.onClickItem);
                $('ul', d.xlist).bind('blur.xcombobox', d, function(e){
                    $('.xlist', e.data.xcombobox).fadeOut('fast');
                }).attr('tabIndex', 0);
            }
        },
        clear: function(){
            this.each(function(){
                var d = $(this).data("xcombobox");
                if (d) {
                    d.xchildren = [];
                    $('li', d.xheader).text('');
                    $('ul', d.xlist).remove();
                    $(this).data('xcombobox', d);
                }
            });
        },
        __selectItem: function(obj, i, id) {
            if( obj && typeof(obj) === 'object') {
                var data = obj.data('xcombobox'), xcc = data.xchildren;
                
                if (id) {
                    for (var f in xcc) {
                        if (xcc[f].value == i) {
                            i = f;
                            break;
                        }
                    }
                }
                
                if (xcc.length > 0) {
                    if (!xcc[i].item.hasClass('selected')) {
                        var xch = data.xheader, xcl = data.xlist;   
                        $('li', xch).text(xcc[i].item.text());
                        $('li.selected', xcl).removeClass('selected');
                        xcc[i].item.addClass('selected');
                    }
                }
            }
        }
    };

    var defaults = {
        width: 250,
        height: 23,
        disabledClass: 'disabled',
        onSelectedItem : function(e) {},
        onShow : function() {},
        onHide : function() {}
    };

    $.fn.xcombobox = function(options) {
        if (options && typeof(options) == 'object') {
            options = $.extend({}, defaults, options);
        }

        if (typeof(options) == 'string' && methods[options]) {
            return methods[ options ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof options === 'object' || !options ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  options + ' does not exist on $.xcombobox' );
        }    
    };

})( jQuery );
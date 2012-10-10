/*
 * xRequest 1.0 - jQuery plugin
 * Copyright 2011, Jose Luis Quintana <joseluismegateam@gmail.com>
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * Built for jQuery library
 * http://jquery.com
 * 
 * Date: Tue Aug 03 20:17:23 2011 -0500
 **/
(function($) {
    var methods = {
        xrequest : function( options ) {
            var data = this.data('xrequest'), f;

            if (!data) {
                f = this.is('form');
            
                if (!f) {
                    options.processForm = f;
                }
            
                this.data('xrequest', {
                    isform: f,
                    options: options
                });
            }

            return this;
        },
        start: function( options ) {
            var s = this, opt = this.data('xrequest').options, data = {}, key;
        
            if (opt.processForm) {
                data = methods.encodeObject.apply( s, [options] );
            }
        
            if (opt.data && typeof(data) === 'object') {
                for (key in opt.data) {
                    data[key] = opt.data[key];
                }
            }

            data['nocache'] = new Date().getTime();

            if (opt.csrf) {
                // ajaxPrefilter is a jQuery 1.5 feature
                if ('ajaxPrefilter' in $) {
                    $.ajaxPrefilter(function(options, originalOptions, xhr){
                        methods.CSRFProtection(xhr);
                    });
                } else {
                    $(document).ajaxSend(function(e, xhr){
                        methods.CSRFProtection(xhr);
                    });
                }
            }
        
            return $.ajax({
                type: opt.type,
                url: opt.url,
                data: data,
                dataType: opt.dataType,
                success: function(data, textStatus, jqXHR) {
                    if (typeof(data) == 'object') {
                        if (data['header'] && data.header['token']) {
                            $('meta[name="csrf-token"]').attr('content', data.header.token);
                        }
                    }

                    opt.onSuccess.apply( s, [data, textStatus, jqXHR] );
                },
                complete: opt.onComplete,
                error: opt.onError
            });
        },
        set: function(options){
            var data = this.data('xrequest'), opt = data.options, key;

            for (key in options) {
                opt[key] = options[key];
            }

            this.data('xrequest', {
                options: opt
            });
        },
        get: function(key){
            var data = this.data('xrequest'), opt = data.options;
            return opt[key];
        },
        CSRFProtection: function(xhr) {
            var token = $('meta[name="csrf-token"]').attr('content');
            if (token) {
                xhr.setRequestHeader('X-CSRF-Token', token);
            }
        },
        encodeObject: function() {
            var data = {}, name;
        
            $('input,select,textarea,.xcombobox', this).each(function(){
                if ($(this).hasClass('xcombobox')) {
                    name = $.trim($(this).attr('id'));
                    data[name] = $.trim($(this).xcombobox('getValue'));
                }
                else {
                    name = $.trim($(this).attr('name'));
                    data[name] = $.trim($(this).val());
                }
            });

            return data;
        }
    }, defaults = {
        url: './',
        type: 'POST',
        dataType: 'json',
        csrf: true,
        processForm: true,
        data: null,
        onSuccess: function(data, textStatus, jqXHR) {},
        onComplete: function(jqXHR, textStatus) {},
        onError: function(jqXHR, textStatus, errorThrown) {}
    };

    $.fn.xrequest = function(options) {
        if (options && typeof(options) == 'object') {
            options = $.extend({}, defaults, options);
        }

        if (typeof(options) == 'string' && methods[options] ) {
            return methods[ options ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof options === 'object' || !options ) {
            return methods.xrequest.apply( this, arguments );
        } else {
            $.error( 'Method ' +  options + ' does not exist on jQuery.xrequest' );
        }
    };

})( $ );
(function($){
    $.loading=function(options){
        $.loading.dev.init(options)
    };
        
    $.loading.dev={
        opt:null,
        overlay:null,
        counter:null,
        idCloseOut:null,
        idCounter:null,
        countdown:null,
        input:null,
        container:null,
        init:function(options){
            var s=this;
            if(s.container!=null){
                return false
            };
                
            var opt,defaults={
                text:"Loading..",
                zIndex:8600,
                opacity:50,
                seconds:null,
                character:"'",
                prependTo:null,
                onClose:null
            };
            
            s.opt=$.extend(defaults,options);
            opt=s.opt;
            var toPrepend='body';
            if(s.opt.prependTo){
                if(typeof s.opt.prependTo==='object'){
                    s.opt.prependTo=s.opt.prependTo instanceof jQuery?s.opt.prependTo:$(s.opt.prependTo)
                }else if(typeof s.opt.prependTo==='string'){
                    s.opt.prependTo=$(s.opt.prependTo)
                }
                toPrepend=s.opt.prependTo
            }
            s.overlay=$('<div/>').css({
                zIndex:s.opt.zIndex,
                opacity:s.opt.opacity/100
            }).addClass("jlloader").addClass("jlloader-overlay").prependTo(toPrepend);
            s.container=$('<div/>').css({
                zIndex:s.opt.zIndex+1
            }).addClass("jlloader").addClass("jlloader-container").prependTo(toPrepend);
            s.counter=$('<span/>').addClass("jlloader-countdown").appendTo(s.container);
            var table=$('<table/>').attr({
                border:"0",
                cellSpacing:"0",
                cellPadding:"0"
            }).appendTo(s.container);
            var tr=$('<tr/>');
            var trc=tr.clone().appendTo(table);
            var td=$("<td/>");
            td.clone().addClass('jll-01').appendTo(trc);
            td.clone().addClass('jll-02').appendTo(trc);
            td.clone().addClass('jll-03').appendTo(trc);
            trc=tr.clone().appendTo(table);
            td.clone().addClass('jll-04').appendTo(trc);
            var middlemain=td.clone().addClass('jll-05').appendTo(trc);
            td.clone().addClass('jll-06').appendTo(trc);
            trc=tr.clone().appendTo(table);
            td.clone().addClass('jll-07').appendTo(trc);
            td.clone().addClass('jll-08').appendTo(trc);
            td.clone().addClass('jll-09').appendTo(trc);
            var middle=$('<span/>').addClass("jlloader-middle").appendTo(middlemain);
            $('<span/>').addClass("jlloader-icon").addClass('loader').appendTo(middle);
            var msg=$('<span/>').addClass("jlloader-text").appendTo(middle);
            s.input=$('<input/>').attr("type","button").css({
                position:'absolute',
                zIndex:-1,
                width:1,
                height:1
            }).appendTo(msg).focus();
            $('<div/>').addClass("jlloader-description").html(s.opt.text).appendTo(msg);
            s.show()
        },
        show:function(){
            var s=this;
            s.bindEvents();
            s.setPosition();
            s.setAutoClose()
        },
        hide:function(){ 
           var s=$.loading.dev;
           
           if(!s.container){
                return false
            };
           
            if(s.idCloseOut){
                clearInterval(s.idCloseOut);
                clearInterval(s.idCounter);
                s.idCloseOut=null;
                s.idCounter=null;
                s.countdown=null
            };
                
            s.unbindEvents();
            if(s.container){
                s.container.remove()
            };
                
            if(s.overlay){
                s.overlay.remove()
            };
                
            s.container=null;
            if($.isFunction(s.opt.onClose)){
                s.opt.onClose.apply(s)
            }
        },
        setAutoClose:function(){
            var s=this;
            if(s.opt.seconds){
                s.countdown=s.opt.seconds;
                s.idCloseOut=setInterval(s.hide,(s.opt.seconds+1)*1000);
                s.idCounter=setInterval(s.updateCounter,1*1000)
            }
        },
        updateCounter:function(){
            var s=$.loading.dev;
            var cnt=(s.countdown.toString().length==1)?"0"+s.countdown.toString():s.countdown.toString();
            s.counter.text(cnt+s.opt.character);
            s.countdown--
        },
        bindEvents:function(){
            var s=this;
            $(document).bind('keydown.msgbox',function(e){
                if(e.keyCode===9){
                    e.preventDefault();
                    s.input.focus().select()
                }
            });
            $(window).bind('resize.msgbox',function(){
                s.setPosition()
            })
        },
        unbindEvents:function(){
            var s=this;
            $(window).unbind('resize.msgbox');
            $(document).unbind('keydown.msgbox')
        },
        setPosition:function(){
            var s=this,top,left,w=s.getDimensions();
            if(s.opt.prependTo){
                s.container.css({
                    marginTop:(w[0]-s.container.height())/2,
                    marginLeft:(w[1]-s.container.width())/2
                });
                s.overlay.height(w[0]);
                s.overlay.width(w[1])
            }else{
                top=(w[0]-s.container.outerHeight(true))/2;
                left=(w[1]-s.container.outerWidth(true))/2;
                s.container.css({
                    left:left,
                    top:top
                })
            }
        },
        getDimensions:function(){
            var s=this,el,h;
            if(s.opt.prependTo){
                return[s.opt.prependTo.height(),s.opt.prependTo.width()]
            }else{
                el=$(window);
                h=$.browser.opera&&$.browser.version>'9.5'&&$.fn.jquery<'1.3'||$.browser.opera&&$.browser.version<'9.5'&&$.fn.jquery>'1.2.6'?el[0].innerHeight:el.height();
                return[h,el.width()]
            }
        }
    };

    $.loading.close=function(){
        $.loading.dev.hide()
    }
})($);
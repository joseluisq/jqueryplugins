(function($){
    $.fn.isEmpty=function(){
        return !!$(this).val()==null||$(this).val().length==0||/^\s+$/.test($(this).val());
    };
        
    $.fn.isEmail=function(){
        return !!(/\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/.test($(this).val()));
    };
        
    $.fn.reset=function(){
        $(this).each(function(){
            this.reset();
        });
    };
        
    $.fn.clear=function(){
        if ($(this).is('input[type=text],textarea')) {
            $(this).val('');
        }
    };
        
    $.fn.disabled=function(){
        if($(this).is('form')){
            $('input,select,textarea,button',this).each(function(){
                $(this).attr('disabled',"-1");
            });
        } else if($(this).is('input,select,textarea,button')){
            $(this).attr("disabled","-1");
        }
    };
    $.fn.enabled=function(){
        if($(this).is('form')){
            $('input,select,textarea,button',this).each(function(){
                $(this).removeAttr('disabled');
            });
        } else if($(this).is('input,select,textarea,button')){
            $(this).removeAttr('disabled');
        }
    };
});
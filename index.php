<?php ?>
<!DOCTYPE HTML>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Documento sin título</title>
<!--        <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>-->
<!--        <script>!window.jQuery && document.write(unescape('%3Cscript src="lib/jquery-1.7.1.min.js"%3E%3C/script%3E'))</script>-->
        <script src="libs/jquery-1.7.1.min.js"></script>
        <script src="libs/xvalidator/jquery.xvalidator-1.0.js"></script>
        <script src="test/xvalidator.js"></script>
        <style>
            body,input,textarea,select{ font-family: Tahoma, Geneva, sans-serif; font-size: 11px; }
            input{ display: block; margin-bottom: 5px; padding: 5px; }
            input.error{ border: solid 1px red; }

            /* xValidator Tootltip */
            .xvalidator.xtooltip{ position: absolute; margin-left: -18px; margin-top: -42px; display: block; background: #515151; color: white; -moz-border-radius:5px; border-radius:5px; }
            .xvalidator.xtooltip .xcorner{ position: absolute; display: block; background: url(libs/xvalidator/tools.png) no-repeat ;  width: 19px; height: 10px; margin-left: 10px; }
            .xvalidator.xtooltip .xtext{ display: block; padding: 10px; }
            .xvalidator.xtooltip .xtext small{ font-size: 10px; }


        </style>
    </head>

    <body>

        <div style="width: 400px; margin:15% auto 0 auto;">
            <form id="frm">
                <input id="txtname" type="text" value="">
                <input id="txtemail" type="text" value="">
                <input id="chkdeveloper" name="option" type="checkbox" value="1">
                <input id="chkdesigner" name="option" type="checkbox" value="2">
                <input id="chkmanager" name="option" type="checkbox" value="3">
                <input type="submit" value="Submit">
            </form>

        </div>

    </body>
</html>
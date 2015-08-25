/*!
Deck JS - deck.codemirror
Copyright (c) 2015 Rémi Emonet
Licensed under the MIT license.
https://github.com/imakewebthings/deck.js/blob/master/MIT-license.txt
*/

/*
This module wraps CodeMirror, using class names to select modes from loaded ones.
It requires, to have included:
- a packed version of CodeMirror (see http://codemirror.net/doc/compress.html to make your own with plugins),
- the CodeMirror CSS:
     curl -sk https://raw.githubusercontent.com/codemirror/CodeMirror/master/lib/codemirror.css > codemirror.css
- the themes files to be loaded (the ones you want to use)
*/

(function($, deck, undefined) {
    $.extend(true, $.deck.defaults, {
        classes: {
        },
        codemirror: {
            "default": {
                lineNumbers : true,
                theme : "ttcn",
                mode : "javascript",
                //viewportMargin: Infinity,
                readOnly : true
            }
            // python: { ... } // to have different configurations for different modes
        }
    });

    var codemirrorify = function(slide) {
        var o = $.deck('getOptions');

        for (mode in CodeMirror.modes) {
            var cl = mode + "-code";
            if (mode == "null") { // the "null" mode
                cl = "code";
            }
            var selector = "textarea.%1:%2, .%1>textarea:%2";
            selector = selector.replace(/%1/g, cl);
            selector = selector.replace(/%2/g, "not(.__done__)");
            console.log(selector);
            $(slide).find(selector).each(function(i, e) {
                var options = o.codemirror["default"];
                if (mode in o.codemirror) {
                    options = o.codemirror[mode];
                }
                options.mode = mode;
                CodeMirror.fromTextArea(e, options);
                $(e).addClass("__done__");
            });
        }
    };

    var $d = $(document);
    $d.bind('deck.init', function() {
        $(".deck-container .slide").bind('deck.becameCurrent', function(_, direction) {
            setTimeout(function() {
                codemirrorify($(_.target).parentsUntil(".deck-container").andSelf().filter(".slide:first"));
            }, 0);
        });
    });
})(jQuery, 'deck');
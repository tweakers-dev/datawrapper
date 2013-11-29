
define(function() {

    function updateSize(_w, _h) {
        var maxW = $('#iframe-wrapper').parent().width()-22,
            w = _w || Math.min(Number($('#resize-w').val()) || 580, maxW),
            h = _h || Number($('#resize-h').val()) || 400,
            chart = dw.backend.currentChart;
        $('#resize-w').val(w);
        $('#resize-h').val(h);
        $('#iframe-wrapper').css({
            width: w,
            height: h,
        });

        chart.set('metadata.publish.embed-width', w);
        chart.set('metadata.publish.embed-height', h);
    }

    return {
        init: function(iframe) {
            var iframeWrap = iframe.parent(),
                dim = $('<div/>')
                    .addClass('chart-dimensions hidden')
                    .appendTo(iframeWrap.parent());

            iframeWrap.resizable({
                minHeight: 300,
                minWidth: 300,
                handles: "e, s, se",
                //helper: 'resize-helper'
                start: function() {
                    iframeWrap.addClass('resizing');
                    dim.removeClass('hidden');
                },
                resize: function() {
                    dim.html(iframe.width() +'x'+iframe.height());
                },
                stop: function() {
                    iframeWrap.removeClass('resizing');
                    updateSize(iframe.width(), iframe.height());
                    dim.addClass('hidden');
                }
            });
        },

        update: updateSize
    };

});
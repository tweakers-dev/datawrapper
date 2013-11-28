
define(function() {

    /*
     * Displays a coach mark around an element
     */
    $.fn.coachmark = function(opts) {
        var el = $(this),
            offset = el.offset(),
            pad = 20,
            cx0 = offset.left-pad,
            cx1 = offset.left+pad+el.outerWidth(),
            cy0 = offset.top-pad,
            cy1 = offset.top+pad+el.outerHeight(),
            popover;

        hide(); // ..previous coach marks

        overlay(-1000, -1000, cx0, 3000); // W
        overlay(cx1, -1000, 3000, 3000); // E
        overlay(cx0, -1000, cx1, cy0); // N
        overlay(cx0, cy1, cx1, 3000); // S
        overlay(cx0, cy0, cx1, cy1, true); // center

        function overlay(x0,y0,x1,y1,center) {
            var o = $('<div />')
                .addClass('coachmark-overlay')
                .css({
                    background: 'rgba(0,0,0,'+(center ? 0.001 : 0.5)+')',
                    position: 'absolute',
                    left: x0,
                    zIndex: 1000,
                    top: y0,
                    width: x1-x0,
                    height: y1-y0,
                    opacity: 0
                })
                .animate({ opacity: 1}, 300)
                .click(hide)
                .appendTo('body');
            if (center) {
                popover = o.popover({
                    content: opts.content,
                    placement: x1 < innerWidth*0.5 ? 'right' : 'left',
                    trigger: 'manual'
                }).popover('show');
                popover.data('popover').$tip.addClass('coachmark-popover');
            }
            window.popover = popover;
        }

        function hide() {
            $('.coachmark-overlay').remove();
            $('.coachmark-popover').remove();
        }

    };

    return function() {

       
    };

});
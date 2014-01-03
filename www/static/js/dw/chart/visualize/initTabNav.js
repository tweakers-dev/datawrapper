
define(function() {

    return function() {

        $('.tab-container').css({ position: 'relative' });

        function loadTab(evt) {
            if (!location.hash) location.hash = '#refine';
            if (location.hash == '#refine' || location.hash == '#annotate') {
                $('.tab-container > *').css({ position: 'absolute', left: -10000, opacity: 0 });
                var el = $('.tab-container .'+location.hash.substr(1));
                el.stop().css({ position: 'static', opacity: 1 });
            }
        }

        $(window).on('hashchange', loadTab);
        loadTab();
    };

});

// visualize/themes

define(function() {

    var themesById = {},
        themes,
        chart = dw.backend.currentChart;

    function init(_themes) {
        _.each(_themes, function(theme) {
            themesById[theme.id] = theme;
            themesById[theme.id].__loaded = false;
        });
        themes = _themes;
    }

    /*
     * loads the currently selected theme and all its parent themes
     * returns a promise that is resolved as the loading is complete
     */
    function load() {
        var dfd = $.Deferred(),
            themeid = chart.get('theme'),
            theme = themesById[themeid],
            needed = _.keys(themesById);

        while (theme['extends']) {
            needed.unshift(theme['extends']);
            theme = themesById[theme['extends']];
        }
        function loadNext() {
            if (needed.length > 0) {
                var next = themesById[needed.shift()];
                if (!next.__loaded) {
                    next.__loaded = true;
                    $.getScript(next.__static_path + '/' + next.id + '.js', loadNext);
                } else {
                    loadNext();
                }
            } else {
                dw.backend.fire('theme-loaded');
                dfd.resolve();
                showThemeColors();
                initPreviews();
            }
        }
        loadNext();
        return dfd.promise();
    }

    function showThemeColors() {
        var theme_id = chart.get('theme'),
            theme = dw.theme(theme_id);

        chart.set('metadata.publish.background', theme.colors.background);
        chart.set('metadata.publish.contextBg', theme.colors.contextBackground);
        chart.set('metadata.publish.text', theme.colors.text);

    }

    function initPreviews() {
        _.each(themes, function(theme) {
            var t = $('.thumb.theme-'+theme.id),
                th = dw.theme(theme.id);
            $('.vis-icon, .vis-colors', t).css({
                background: th.colors.background
               // border: '1px solid #ccc'
            });
            $('.vis-icon path, .vis-icon rect, .vis-icon circle', t).css('fill', th.colors.palette[0]);
            $('.vis-icon line', t).css('stroke', th.colors.palette[0]);
            $('.vis-colors .color1', t).css('background', th.colors.palette[0]);
            $('.vis-colors .color2', t).css('background', th.colors.palette[1]);
            $('.vis-colors .color3', t).css('background', th.colors.palette[2]);
            $('.vis-colors .color4', t).css('background', th.colors.palette[3]);
        });
    }

    return {
        init: init,
        load: load,
        all: function() { return themes; },
        updateUI: showThemeColors,
        initPreviews: initPreviews
    };

});
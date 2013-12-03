
define([
    './visualize/themes',
    './visualize/checkChartHeight',
    './visualize/loadVisDeferred',
    './visualize/initTabNav',
    './visualize/enableInlineEditing',
    './visualize/liveUpdate',
    './visualize/options',
    './visualize/axesEditor',
    './visualize/updateVisBackground',
    './visualize/resizeChart',
    'js/misc/classify',
    './visualize/colorpicker',
    'js/misc/jquery.easing',
    'dw/backend/ui/coachmark',
    'selectize',
    'jqueryui'],

function(themes, checkChartHeight, loadVisDfd, initTabNav, enableInlineEditing,
    liveUpdate, options, axesEditor, updateVisBackground, resizeChart, classify) {

    var _typeHasChanged = false,
        _axesHaveChanged = false,
        _transposed = false,
        __thumbTimer,
        _optionsSynchronized = false,
        chart = dw.backend.currentChart,
        visMetas = {},
        iframe = $('#iframe-vis'),
        iframeWrap = iframe.parent(),
        visJSON;

    function init(themesJSON, _visMetas, _visJSON) {

        themes.init(themesJSON);

        visMetas = _visMetas;
        visJSON = _visJSON;

        dw.backend.__currentVisLoaded = loadVisDfd.promise();

        chart.onSave(onChartSave);

        syncUI();

        chart.load().done(onDatasetLoaded);
        iframe.load(iframeLoaded);

        // initialize some UI actions
        initTabNav();
        initTransposeLink();
        initVisSelector();

        resizeChart.init(iframe);
    }

    function onChartSave(chart) {

        if (_typeHasChanged) {
            // remove all notifications
            $("#notifications .notification").fadeOutAndRemove();
            dw.backend.fire('type-changed');
            loadOptions().done(function() {
                dw.backend.fire('type-changed-and-options-reloaded');
                loadVis();
            });
        }

        if (_axesHaveChanged || _transposed) {
            dw.backend.fire('axes-changed-or-transposed');
            loadOptions().done(function() {
                dw.backend.fire('options-reloaded');
                loadVis();
            });
        }

        _typeHasChanged = false;
        _axesHaveChanged = false;
        _transposed = false;

        var iframeWin = iframe.get(0).contentWindow;
        if (iframeWin.__dw && iframeWin.__dw.saved) {
            iframeWin.__dw.saved();
        }
        scheduleThumbnail();
        checkChartHeight();
    }

    function syncUI() {
        chart.sync('#select-theme', 'theme');
        chart.sync('#text-title', 'title');
        chart.sync('#text-intro', 'metadata.describe.intro');
        chart.sync('#describe-source-name', 'metadata.describe.source-name');
        chart.sync('#describe-source-url', 'metadata.describe.source-url');

        chart.observe(function(chart, changes) {
            _.each(changes, function(change) {
                if (change.key == 'type') _typeHasChanged = true;
                if (change.key.substr(0, 13) == 'metadata.axes') _axesHaveChanged = true;
                if (change.key == 'metadata.data.transpose') _transposed = true;
            });
            liveUpdate.update(iframe, chart.attributes());
        });
    }

    function iframeLoaded() {
        dw.backend.fire('vis-loaded');
        updateVisBackground();
        var win = iframe.get(0).contentWindow,
            chk;

        // periodically check if vis is initialized in iframe
        chk = setInterval(function() {
            if (win.__dw && win.__dw.vis) {
                clearInterval(chk);
                iframeReady();
            }
        }, 100);
    }

    /*
     * called as soon the __dw.vis object is available
     * inside the reloaded iframe
     */
    function iframeReady() {
        dw.backend.fire('vis-ready');
        var win = iframe.get(0).contentWindow;

        liveUpdate.init(iframe);

        dw.backend.on('vis-rendered', visualizationRendered);

        $(window).on('message', function(evt) {
            evt = evt.originalEvent;
            if (evt.source == win) {
                if (evt.data == 'datawrapper:vis:init') {
                    dw.backend.fire('vis-msg-init');
                    win.dw_alert = dw.backend.alert;
                    win.__dw.backend = dw.backend;
                }
                if (evt.data.slice(0, 7) == 'notify:') {
                    dw.backend.notify(evt.data.slice(7));
                }
                if (evt.data == 'datawrapper:vis:rendered') {
                    dw.backend.fire('vis-rendered');
                }
            }
        });
    }

    /*
     * called as soon the vis is rendered (after iframe reload)
     */
    function visualizationRendered() {
        checkChartHeight();
        enableInlineEditing(iframe, chart);
    }

    /*
     * reload the chart specific options
     */
    function loadOptions() {
        var loaded = $.Deferred();
        _optionsSynchronized = false;
        $('#vis-options').load(
            '/xhr/'+chart.get('id')+'/vis-options?nocache='+Math.random(),
            function() {
                loaded.resolve();
                // trigger event in order to resync options
                optionsLoaded();
            }
        );
        return loaded.promise();
    }

    function optionsLoaded() {
        loadVis();
        options.reset();
        options.sync();
    }

    function initTransposeLink() {
        $('#btn-transpose').click(function(e) {
            e.preventDefault();
            chart.set('metadata.data.transpose', !chart.get('metadata.data.transpose'));
            chart.load().done(onDatasetLoaded);
            setTimeout(function() {
                loadOptions();
            }, 2000);
        });
    }

    function initVisSelector() {

        $('#chart-type').selectize({
            render: {
                option: function(data, escape) {
                    return '<div class="option">'+
                        '<img style="height:25px" src="'+data.vis.__static_path+data.value+'.png" /> '+escape(data.text) +
                        '</div>';
                },
                item: function(data, escape) {
                    return '<div class="item">'+
                        '<img style="height:25px" src="'+data.vis.__static_path+data.value+'.png" /> '+escape(data.text) +
                        '</div>';
                }
            },
            onChange: function() {
                chart.set('type', this.getValue());
            }
        });

        // graphical vis selector
        /*
        var unfolded = $('.vis-selector-unfolded'),
            folded = $('.vis-selector-folded'),
            thumbs = $('.vis-thumb'),
            selVis = $('.vis-selected');
        unfolded.show().data('h', unfolded.height()).hide();
        thumbs.click(function(e) {
            var thumb = $(e.target);
            if (!thumb.hasClass('vis-thumb')) thumb = thumb.parents('.vis-thumb');
            thumbs.removeClass('active');
            thumb.addClass('active');
            selVis.html('<img src="'+thumb.data('static-path')+thumb.data('id')+'.png" width="24" />' + thumb.data('title'));
            setTimeout(function() {
                // folded.show();
                // unfolded.animate({ height: 0 }, 300, 'easeOutExpo', function() {
                //     unfolded.hide();
                // });
                chart.set('type', thumb.data('id'));
            }, 100);
        });

        folded.click(function() {
            folded.hide();
            unfolded.height(0).show().animate({ height: unfolded.data('h') }, 300);
        });

        unfolded.show();
        folded.hide();
        // */
    }

    /** Set into `dw.backend.currentVis` the edited visualization (editor side) */
    function loadVis() {
        if (iframe.attr('src') === "") {
            // load vis in iframe if not done yet
            iframe.attr('src', '/chart/'+chart.get('id')+'/preview?innersvg=1&random='+Math.floor(Math.random()*100000));
        }
        dw.backend.currentVis = dw.visualization(chart.get('type'));
        dw.backend.currentVis.chart(chart);
        dw.backend.currentVis.dataset = chart.dataset().reset();
        dw.backend.currentVis.meta = visMetas[chart.get('type')];
        options.init(chart, visMetas[chart.get('type')]);
        axesEditor.init(chart, visMetas[chart.get('type')]);
        axesEditor.updatePreview();
        if (!_optionsSynchronized) {
            _optionsSynchronized = true;
            options.sync();
        }
        loadVisDfd.resolve();
    }

    function scheduleThumbnail() {
        clearTimeout(__thumbTimer);
        __thumbTimer = setTimeout(function() {
            dw.backend.snapshot(iframe, dw.backend.currentChart.get('id'), 'm', 260, 160);
        }, 500);
    }

    function onDatasetLoaded() {
        dw.backend.fire('dataset-loaded');
        loadVis();
        _.each(themes.all(), function(theme) {
            if (theme.id == chart.get('theme')) {
                var w = chart.get('metadata.publish.embed-width', theme.default_width || 560),
                    h = chart.get('metadata.publish.embed-height', theme.default_height || 400);
                resizeChart.update(w, h);
                return false;
            }
        });
        themes.load();
        axesEditor.init(chart, visJSON);
    }


    return {
        init: init
    };

});

define(function() {

    function init() {

        $('.chart-editor').on('click', '.submit', onSubmitClick);

        // update editor nav on hash change
        $(window).on('hashchange', onHashChange);
        onHashChange();

        initChartActions();
    }

    function onSubmitClick(e) {
        var a = $(e.target);
        if (e.target.nodeName.toLowerCase() != 'a') a = a.parents('a');
        if (chart.hasUnsavedChanges()) {
            e.preventDefault();
            chart.onSave(function() {
                location.href = a.attr('href');
            });
        }
    }

    function onHashChange() {
        if (location.hash) {
            var id = location.pathname.split('/')[3] + location.hash;
                $('.navbar-editor li a').each(function() {
                if ($(this).attr('href') == id) {
                    $('.navbar-editor li').removeClass('active');
                    $(this).parents('li').addClass('active');
                }
            });
        }
    }

    function initChartActions() {
        $('a[href=#duplicate]').click(triggerDuplicate);
    }

    function triggerDuplicate(e) {
        e.preventDefault();
        var id = chart.get('id');
        $.ajax({
            url: '/api/charts/'+id+'/copy',
            type: 'POST',
            success: function(data) {
                if (data.status == "ok") {
                    // redirect to copied chart
                    location.href = '/chart/'+data.data.id+'/visualize';
                } else {
                    console.warn(data);
                }
            }
        });
    }

    return {
        init: init
    };
});
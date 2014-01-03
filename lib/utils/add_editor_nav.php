<?php

function add_editor_nav(&$page, $step, $chart) {
    // define 4 step navigation
    $steps = array();
    $steps[] = array('index'=>1, 'id'=>'upload', 'title'=>__('Upload'));
    $steps[] = array('index'=>2, 'id'=>'describe', 'title'=>__('Check'));
    $steps[] = array('index'=>3, 'id'=>'visualize#refine', 'title'=>__('Visualize'));
    $steps[] = array('index'=>4, 'id'=>'visualize#annotate', 'title'=>__('Annotate'));
    $steps[] = array('index'=>5, 'id'=>'publish', 'title'=>__('Embed'));
    $page['steps'] = $steps;
    $page['chartLocale'] = $page['locale'];
    $page['metricPrefix'] = get_metric_prefix($page['chartLocale']);
    $page['createstep'] = $step;
    $page['chartActions'] = array();
    $page['chartActions'][] = array(
        'id' => 'duplicate',
        'icon' => 'plus',
        'title' => __("Duplicate this chart")
    );
    $moreActions = DatawrapperHooks::execute(DatawrapperHooks::GET_CHART_ACTIONS, $chart);
    foreach ($moreActions as $action) {
        $page['chartActions'][] = $action;
    }

}

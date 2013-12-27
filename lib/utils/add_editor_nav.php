<?php

function add_editor_nav(&$page, $step) {
    // define 4 step navigation
    $steps = array();
    $steps[] = array('index'=>1, 'id'=>'upload', 'title'=>__('Upload Data'));
    $steps[] = array('index'=>2, 'id'=>'describe', 'title'=>__('Check & Describe'));
    $steps[] = array('index'=>3, 'id'=>'visualize#refine', 'title'=>__('Visualize'));
    $steps[] = array('index'=>4, 'id'=>'visualize#annotate', 'title'=>__('Annotate'));
    $steps[] = array('index'=>5, 'id'=>'publish', 'title'=>__('Publish & Embed'));
    $page['steps'] = $steps;
    $page['chartLocale'] = $page['locale'];
    $page['metricPrefix'] = get_metric_prefix($page['chartLocale']);
    $page['createstep'] = $step;
}

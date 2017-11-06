<?php

function sl_resources() {
    wp_enqueue_style('style', get_stylesheet_uri());
}
add_action('wp_enqueue_scripts', 'sl_resources');

// Navigation menus
register_nav_menus([
    'primary' => __('Primary Menu'),
    'footer' => __('Footer Menu')
]);

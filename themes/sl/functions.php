<?php

function sl_resources() {
    wp_enqueue_style('style', get_stylesheet_uri());
}
add_action('wp_enqueue_scripts', 'sl_resources');

function sl_setup() {

    // Navigation menus
    register_nav_menus([
        'primary' => __('Primary Menu'),
        'footer' => __('Footer Menu')
    ]);

    // Add featured image support
    add_theme_support('post-thumbnails');
    add_image_size('small-thumbnail', 180, 120, true);
    add_image_size('flotte-thumbnail', 720, 460, true);
    add_image_size('banner-image', 920, 210, true);
}
add_action('after_setup_theme', 'sl_setup');

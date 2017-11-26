<?php

function sl_resources() {
    wp_enqueue_style('style', get_stylesheet_uri());

    wp_enqueue_script('jquery', get_theme_file_uri('/js/jquery-3.2.1.min.js'));

    if(basename(get_permalink()) == 'reservation') {
        wp_enqueue_script('functions', get_theme_file_uri('js/functions.js'));
        wp_localize_script('functions', 'screenReaderText', [
            'adminAjax' => admin_url('admin-ajax.php'),
            'security' => wp_create_nonce('user-submitted-reservation')
        ]);
    }
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

function sl_endpoints() {
    register_rest_route('slplugin/v1', '/fleet/year=(?P<year>\d+)/month=(?P<month>\d+)/day=(?P<day>\d+)', [
        'methods' => 'GET',
        'callback' => 'vcl_fleet',
        'agrs' => [
            'year' => [
                'validate_callback' => function($param, $request, $key) {
                    return is_numeric($param);
                }
             ],
            'month' => [
                'validate_callback' => function($param, $request, $key) {
                    return is_numeric($param);
                }
             ],
            'day' => [
                'validate_callback' => function($param, $request, $key) {
                    return is_numeric($param);
                }
             ]
        ]
    ]);
    register_rest_route('slplugin/v1', '/agenda/vcl=(?P<vcl>\d+)/year=(?P<year>\d+)/month=(?P<month>\d+)/day=(?P<day>\d+)', [
        'methods' => 'GET',
        'callback' => 'vcl_agenda',
        'agrs' => [
            'vcl' => [
                'validate_callback' => function($param, $request, $key) {
                    return is_numeric($param);
                }
            ],
            'year' => [
                'validate_callback' => function($param, $request, $key) {
                    return is_numeric($param);
                }
             ],
            'month' => [
                'validate_callback' => function($param, $request, $key) {
                    return is_numeric($param);
                }
             ],
            'day' => [
                'validate_callback' => function($param, $request, $key) {
                    return is_numeric($param);
                }
             ]
        ]
    ]);
}
add_action('rest_api_init', 'sl_endpoints');

function vcl_fleet($data) {
    $result = [];
    $args = [
        'post_type' => 'vcl'
    ];
    $the_query = new WP_Query(['post_type' => 'vcl']);
    while($the_query->have_posts()) {
        $the_query->the_post();
        $vcl = [
            'id' => get_the_ID(),
            'title' => get_the_title(),
            'thumbnail' => get_the_post_thumbnail(),
            'agenda' => vcl_agenda([
                'vcl' => get_the_ID(),
                'year' => $data['year'],
                'month' => $data['month'],
                'day' => $data['day']
            ])
        ];
        array_push($result, $vcl);
    }
    return $result;
}

function vcl_agenda($data) {
/*
    if(no vcl found) {
        return WP_Error(
            'no_vcl'
            'Invalid vehicle',
             ['status' => 404]
        );
    }
*/
    $result = [
        'vcl' => $data['vcl'],
        'year' => $data['year'],
        'month' => $data['month'],
        'day' => $data['day'],
        'days' => [
            ['day' => 3,
            'style' => 'day-na',
            'available' => false],
            ['day' => 17,
            'style' => 'day-pav',
            'available' => true],
            ['day' => 20,
            'style' => 'day-pav',
            'available' => true],
            ['day' => 26,
            'style' => 'day-na',
            'available' => false]
        ]
    ];
    return $result;
}


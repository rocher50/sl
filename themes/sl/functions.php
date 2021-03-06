<?php

function sl_resources() {
/*
    wp_enqueue_style('style', get_stylesheet_uri());

    wp_enqueue_script('jquery', get_theme_file_uri('/js/jquery-3.2.1.min.js'));
    wp_enqueue_script('carreta', get_theme_file_uri('/js/carreta-1.0.0.js'));
    wp_localize_script('carreta', 'screenReaderText', [
        'adminAjax' => admin_url('admin-ajax.php'),
        'security' => wp_create_nonce('user-submitted-reservation')
    ]);
*/
    if(basename(get_permalink()) == 'reservation') {
        wp_enqueue_script('jquery', get_theme_file_uri('/js/jquery-3.2.1.min.js'));
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
    register_rest_route('slplugin/v1', '/fleet/year=(?P<year>\d+)/month=(?P<month>\d+)', [
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
             ]
        ]
    ]);
    register_rest_route('slplugin/v1', '/agenda/vcl=(?P<vcl>\d+)/year=(?P<year>\d+)/month=(?P<month>\d+)', [
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
    $year = $data['year'];
    $month = $data['month'];
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
                'month' => $data['month']
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
/*
    $days = [
            ['day' => 3, 'available' => false],

            ['day' => 10,
            'available' => true,
            'bookings' => [
                ['sHour' => 10, 'sMin' => 30]]],
            ['day' => 11, 'available' => false],
            ['day' => 12,
            'available' => true,
            'bookings' => [
                ['eHour' => 13, 'eMin' => 30]]],

            ['day' => 17,
            'available' => true,
            'bookings' => [
                ['sHour' => 9, 'sMin' => 30, 'eHour' => 12, 'eMin' => 0],
                ['sHour' => 15, 'sMin' => 0, 'eHour' => 18, 'eMin' => 0]]],
            ['day' => 20,
            'available' => true,
            'bookings' => [
                ['sHour' => 8, 'sMin' => 0, 'eHour' => 12, 'eMin' => 30]]],
            ['day' => 26,
            'available' => false]
        ];
*/
/*
    $days = [
//        ['day' => $data['month'], 'available' => false],
        ['day' => $data['month'], 'available' => true, 'bookings' => [8.5, 2]],
        ['day' => 28 - $data['month'], 'available' => true, 'bookings' => [8.5, 3, 14, 3]]
    ];

    if($data['month'] == 12) {
        array_push($days, ['day' => 32, 'available' => true, 'bookings' => [8.5, 2]]);
    }
*/

    $begining = mktime(0, 0, 0, $data['month'], 1, $data['year']);
    $end = strtotime("+1 month", $begining);
    global $wpdb;
    $rows = $wpdb->get_results("
        SELECT day, value
        FROM " . $wpdb->prefix . "sl_cal
        WHERE item=" . $data['vcl'] . " AND day >= '" . date('Y-m-d', $begining) . "' AND day <= '" . date('Y-m-d', $end) . "' ORDER BY day");

    $days = [];
    if($rows) {
        foreach ( $rows as $row ) {
            $day;
            $rowDate = strtotime($row->day);
            if($end == $rowDate) {
                $day = 32;
            } else {
                $day = idate('d', $rowDate);
            }
            $available;
            $bookings;
            if($row->value == '-') {
                $available = false;
            } else {
                $available = true;
                $bookings = [];

                $bookingValues = explode(',', $row->value);

                $i = 0;
                while($i < sizeof($bookingValues)) {

                    $booking = new stdClass;

                    $bookingValue = $bookingValues[$i++];
                    $bookingTimes = explode('-', $bookingValue);
                    if($bookingValue[0] != '-') {
                        $bookingHourMin = explode(':', $bookingTimes[0]);
                        $booking->sHour = (int) $bookingHourMin[0];
                        $booking->sMin = (int) $bookingHourMin[1];
                    }
                    if($bookingValue[strlen($bookingValue) - 1] != '-') {
                        $bookingHourMin = explode(':', $bookingTimes[1]);
                        $booking->eHour = (int) $bookingHourMin[0];
                        $booking->eMin = (int) $bookingHourMin[1];
                    }
                    array_push($bookings, $booking);
                }
            }
            array_push($days, ['day' => $day, 'available' => $available, 'bookings' => $bookings]);
        }
    }

    $result = [
        'vcl' => $data['vcl'],
        'year' => $data['year'],
        'month' => $data['month'],
        'days' => $days
    ];
    return $result;
}


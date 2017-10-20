<?php
/**
 * @package SlPlugin
 */
/*
Plugin Name: SL Plugin
Plugin URI: http://sl.ch
Description: sl plugin description
Version: 1.0.0
Author: Rocher50
Author URI: http://sl.ch
License: GPLv2
Text Domain: sl-plugin
 */
 
defined( 'ABSPATH' ) or die;

class SlPlugin {

    function __construct() {
    }

    function activate() {
        flush_rewrite_rules();
    }

    function deactivate() {

    }

    function uninstall() {

    }

    function init_cpt() {
        register_post_type( 'book', ['public' => true, 'label' => 'Vehicules'] );
    }
}


if( class_exists( 'SlPlugin' ) ) {
    $slPlugin = new SlPlugin();
}

register_activation_hook( __FILE__, array( $slPlugin, 'activate' ) );
register_deactivation_hook( __FILE__, array( $slPlugin, 'deactivate' ) );
add_action('init', [$slPlugin, 'init_cpt']);


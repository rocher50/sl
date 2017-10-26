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

if( file_exists( dirname( __FILE__ ) . '/vendor/autoload.php' ) ) {
    require_once dirname( __FILE__ ) . '/vendor/autoload.php';
}

define( 'PLUGIN', plugin_basename( __FILE__ ) );
define( 'PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'PLUGIN_URL', plugin_dir_url( __FILE__ ) );

use Inc\Base\Activate;
use Inc\Base\Deactivate;

function activate_sl_plugin() {
    Activate::activate();
}

function deactivate_sl_plugin() {
    Deactivate::deactivate();
}

register_activation_hook( __FILE__, 'activate_sl_plugin' );
register_deactivation_hook( __FILE__, 'deactivate_sl_plugin' );

if( class_exists( 'Inc\\Init' ) ) {
    Inc\Init::register_services();
}

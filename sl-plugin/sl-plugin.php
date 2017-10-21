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

    protected $slCssPath = '/assets/sl.css';
    protected $slJsPath = '/assets/sl.js';
    protected $slSlug = 'sl_plugin';

    protected $pluginName;

    function __construct() {
        $this->pluginName = plugin_basename( __FILE__ );
    }

    function register() {
        register_activation_hook( __FILE__, [$this, 'activate'] );
        register_deactivation_hook( __FILE__, [$this, 'deactivate'] );
        add_action('init', [$this, 'custom_post_type'] );
        add_action( 'admin_enqueue_scripts', [$this, 'enqueue'] );
        add_action( 'admin_menu', [$this, 'add_admin_pages'] );

        add_filter( "plugin_action_links_$this->pluginName", [$this, 'settings_link'] );
    }

    public function activate() {
        flush_rewrite_rules();
    }

    public function deactivate() {
    }

    public function custom_post_type() {
        register_post_type( 'book', ['public' => true, 'label' => 'Vehicules'] );
    }

    public function add_admin_pages () {
        add_menu_page( 'SL Plugin', 'SL', 'manage_options', $this->slSlug, [$this, 'admin_index'], 'dashicons-store', 110 );
    }

    public function admin_index() {
        require_once plugin_dir_path( __FILE__ ) . 'templates/admin.php';
    }

    public function settings_link( $links ) {
        array_push( $links, '<a href="admin.php?page=' . $this->slSlug . '">Settings</a>' );
        return $links;
    }

    public function enqueue() {
        wp_enqueue_style( 'slpluginstyle', plugins_url( $this->slCssPath, __FILE__ ) );
        wp_enqueue_script( 'slpluginscript', plugins_url( $this->slJsPath, __FILE__ ) );
    }
}


if( class_exists( 'SlPlugin' ) ) {
    $slPlugin = new SlPlugin();
    $slPlugin->register();
}



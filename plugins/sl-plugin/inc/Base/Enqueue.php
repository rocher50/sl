<?php
/**
 * @package SlPlugin
 */

namespace Inc\Base;

class Enqueue extends BaseController {

    protected $slCssPath = 'assets/sl.css';
    protected $slCalCssPath = 'assets/calendar.css';
    protected $slJsPath = 'assets/sl.js';

    public function register() {
        add_action( 'admin_enqueue_scripts', [$this, 'enqueue_admin_scripts'] );
        add_action( 'wp_enqueue_scripts', [$this, 'enqueue_theme_scripts'] );
    }

    public function enqueue_theme_scripts() {
        wp_enqueue_style( 'slcalendar', $this->plugin_url . $this->slCalCssPath );
        wp_enqueue_script('slcalscript', $this->plugin_url . 'assets/calendar.js');
    }

    public function enqueue_admin_scripts() {
        wp_enqueue_style( 'slpluginstyle', $this->plugin_url . $this->slCssPath );
        wp_enqueue_style( 'jquery-style', 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css' );
        wp_enqueue_script( 'slpluginscript', $this->plugin_url . $this->slJsPath, ['jquery', 'jquery-ui-datepicker'] );
    }
}

<?php
/**
 * @package SlPlugin
 */

namespace Inc\Base;

class Enqueue {

    protected $slCssPath = 'assets/sl.css';
    protected $slJsPath = 'assets/sl.js';

    public function register() {
        add_action( 'admin_enqueue_scripts', [$this, 'enqueue'] );
    }

    public function enqueue() {
        wp_enqueue_style( 'slpluginstyle', PLUGIN_URL . $this->slCssPath );
        wp_enqueue_script( 'slpluginscript', PLUGIN_URL . $this->slJsPath );
    }
}

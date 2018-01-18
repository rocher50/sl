<?php
/**
 * @package SlPlugin
 */

namespace Inc\Base;

class Enqueue extends BaseController {

    protected $slCssPath = 'assets/admin/sl-admin.min.css';
    protected $slJsPath = 'assets/admin/sl.min.js';
    protected $slClientCssPath = 'assets/client/sl-client.min.css';
    protected $slClientJsPath = 'assets/client/sl-client.min.js';

    public function register() {
        add_action( 'admin_enqueue_scripts', [$this, 'enqueue_admin_scripts'] );
        add_action( 'wp_enqueue_scripts', [$this, 'enqueue_theme_scripts'] );
    }

    public function enqueue_theme_scripts() {
        wp_enqueue_style( 'slcalendar', $this->plugin_url . $this->slClientCssPath );
        wp_enqueue_script('slclient', $this->plugin_url . $this->slClientJsPath);
        wp_localize_script('slclient', 'screenReaderText', [
            'adminAjax' => admin_url('admin-ajax.php'),
            'security' => wp_create_nonce('user-submitted-reservation'),
            'siteURL' => get_site_url()
        ]);
    }

    public function enqueue_admin_scripts() {
        wp_enqueue_style( 'slpluginstyle', $this->plugin_url . $this->slCssPath );
        wp_enqueue_style( 'jquery-style', 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css' );
        wp_enqueue_script( 'slpluginscript', $this->plugin_url . $this->slJsPath, ['jquery', 'jquery-ui-datepicker'] );
    }
}

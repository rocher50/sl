<?php
/**
 * @package SlPlugin
 */

namespace Inc\Pages;

class Admin {

    protected $adminTemplatePath = '/templates/admin.php';

    public function register() {
        add_action( 'admin_menu', [$this, 'add_admin_pages'] );

    }

    public function add_admin_pages () {
        add_menu_page( 'SL Plugin', 'SL', 'manage_options', PLUGIN, [$this, 'admin_index'], 'dashicons-store', 110 );
    }

    public function admin_index() {
        require_once PLUGIN_PATH . 'templates/admin.php';
    }
}

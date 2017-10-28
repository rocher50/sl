<?php
/**
 * @package SlPlugin
 */

namespace Inc\Pages;

use \Inc\Base\BaseController;
use \Inc\Api\SettingsApi;

class Admin extends BaseController {

    protected $adminTemplatePath = '/templates/admin.php';

    public $settings;
    public $pages;

    public function __construct() {
        $this->settings = new SettingsApi();
        $this->pages = [
            ['page_title' => 'Sl Plugin',
            'menu_title' => 'SL',
            'capability' => 'manage_options',
            'menu_slug' => 'sl_plugin',
            'callback' => function() { echo '<h1>Sl Plugin</h1>'; },
            'icon_url' => 'dashicons-store',
            'position' => 110]
        ];
    }

    public function register() {
        $this->settings->add_pages( $this->pages )->register();
    }
}

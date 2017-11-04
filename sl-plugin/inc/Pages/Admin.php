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
    public $subpages;

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

        $this->subpages = [
            ['parent_slug' => 'sl_plugin',
            'page_title' => 'Custom Post Types',
            'menu_title' => 'CPT',
            'capability' => 'manage_options',
            'menu_slug' => 'sl_cpt',
            'callback' => function() { echo '<h1>CPT Manager</h1>'; }],

            ['parent_slug' => 'sl_plugin',
            'page_title' => 'Custom Taxonomies',
            'menu_title' => 'Taxonomies',
            'capability' => 'manage_options',
            'menu_slug' => 'sl_taxonomies',
            'callback' => function() { echo '<h1>Taxonomies Manager</h1>'; }],

            ['parent_slug' => 'sl_plugin',
            'page_title' => 'Custom Widgets',
            'menu_title' => 'Widgets',
            'capability' => 'manage_options',
            'menu_slug' => 'sl_widgets',
            'callback' => function() { echo '<h1>Widgets Manager</h1>'; }]

        ];
    }

    public function register() {
        $this->settings->add_pages( $this->pages )->with_subpage('Dashboard')->add_subpages($this->subpages)->register();
    }
}

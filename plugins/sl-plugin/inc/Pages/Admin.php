<?php
/**
 * @package SlPlugin
 */

namespace Inc\Pages;

use Inc\Api\Callbacks\AdminCallbacks;
use Inc\Api\SettingsApi;
use Inc\Base\BaseController;

class Admin extends BaseController {

    protected $adminTemplatePath = '/templates/admin.php';

    public $settings;
    public $callbacks;
    public $pages;
    public $subpages;

    public function register() {
        $this->settings = new SettingsApi();
        $this->callbacks = new AdminCallbacks();
        $this->set_pages();
        $this->set_subpages();
        $this->settings->add_pages( $this->pages )->with_subpage('Dashboard')->add_subpages($this->subpages)->register();
    }

    public function set_pages() {
        $this->pages = [
            ['page_title' => 'Sl Plugin',
            'menu_title' => 'SL',
            'capability' => 'manage_options',
            'menu_slug' => 'sl_plugin',
            'callback' => [$this->callbacks, 'admin_dashboard'],
            'icon_url' => 'dashicons-store',
            'position' => 110]
        ];
    }

    public function set_subpages() {
        $this->subpages = [
            ['parent_slug' => 'sl_plugin',
            'page_title' => 'Custom Post Types',
            'menu_title' => 'CPT',
            'capability' => 'manage_options',
            'menu_slug' => 'sl_cpt',
            'callback' => [$this->callbacks, 'cpt_manager']],

            ['parent_slug' => 'sl_plugin',
            'page_title' => 'Custom Taxonomies',
            'menu_title' => 'Taxonomies',
            'capability' => 'manage_options',
            'menu_slug' => 'sl_taxonomies',
            'callback' => [$this->callbacks, 'taxonomy_manager']],

            ['parent_slug' => 'sl_plugin',
            'page_title' => 'Custom Widgets',
            'menu_title' => 'Widgets',
            'capability' => 'manage_options',
            'menu_slug' => 'sl_widgets',
            'callback' => [$this->callbacks, 'widget_manager']]
        ];
    }
}

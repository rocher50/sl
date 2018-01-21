<?php
/**
 * @package SlPlugin
 */

namespace Inc\Pages;

use Inc\Api\Callbacks\AdminCallbacks;
use Inc\Api\Callbacks\ManagerCallbacks;
use Inc\Api\SettingsApi;
use Inc\Base\BaseController;

class Dashboard extends BaseController {

    protected $adminTemplatePath = '/templates/admin.php';

    public $settings;
    public $callbacks;
    public $callbacks_mngr;
    public $pages;
//    public $subpages;

    public function register() {
        $this->settings = new SettingsApi();
        $this->callbacks = new AdminCallbacks();
        $this->callbacks_mngr = new ManagerCallbacks();
        $this->set_pages();
        //$this->set_subpages();
        $this->setSettings();
        $this->setSections();
        $this->setFields();
        $this->settings->add_pages( $this->pages )->with_subpage('Dashboard')->register();
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
/*
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
*/
    public function setSettings() {

        $args = [
            ['option_group' => 'sl_plugin_settings',
                'option_name' => 'sl_plugin',
                'callback' => array($this->callbacks_mngr, 'checkboxSanitize')]
        ];

        $this->settings->setSettings($args);
    }

    public function setSections() {

        $args = array(
            array(
                'id' => 'sl_admin_index',
                'title' => 'Settings Manager',
                'callback' => array($this->callbacks_mngr, 'adminSectionManager'),
                'page' => 'sl_plugin'
            )
        );
        $this->settings->setSections($args);
    }

    public function setFields() {

        $args = [];
        foreach($this->managers as $key => $value) {
            $args[] = array(
                'id' => $key,
                'title' => $value,
                'callback' => array($this->callbacks_mngr, 'checkboxField'),
                'page' => 'sl_plugin',
                'section' => 'sl_admin_index',
                'args' => ['option_name' => 'sl_plugin', 'label_for' => $key, 'class' => 'ui-toggle']
            );
        }

        $this->settings->setFields($args);
    }
}

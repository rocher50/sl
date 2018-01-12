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
        $this->setSettings();
        $this->setSections();
        $this->setFields();
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

    public function setSettings() {

        $args = array(
            array(
                'option_group' => 'sl_options_group',
                'option_name' => 'text_example',
                'callback' => array($this->callbacks, 'slOptionsGroup')
            ),
            array(
                'option_group' => 'sl_options_group',
                'option_name' => 'opening_time'
            ),
        );
        $this->settings->setSettings($args);
    }

    public function setSections() {

        $args = array(
            array(
                'id' => 'sl_admin_index',
                'title' => 'Settings',
                'callback' => array($this->callbacks, 'slAdminSection'),
                'page' => 'sl_plugin'
            )
        );
        $this->settings->setSections($args);
    }

    public function setFields() {

        $args = array(
            array(
                'id' => 'text_example',
                'title' => 'Text Example',
                'callback' => array($this->callbacks, 'slTextExample'),
                'page' => 'sl_plugin',
                'section' => 'sl_admin_index',
                'args' => ['label_for' => 'text_example', 'class' => 'example-class']
            ),
            array(
                'id' => 'opening_time',
                'title' => 'Opening time',
                'callback' => array($this->callbacks, 'slOpeningTime'),
                'page' => 'sl_plugin',
                'section' => 'sl_admin_index',
                'args' => ['label_for' => 'opening_time', 'class' => 'example-class']
            )
        );
        $this->settings->setFields($args);
    }
}

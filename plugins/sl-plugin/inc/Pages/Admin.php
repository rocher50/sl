<?php
/**
 * @package SlPlugin
 */

namespace Inc\Pages;

use Inc\Api\Callbacks\AdminCallbacks;
use Inc\Api\Callbacks\ManagerCallbacks;
use Inc\Api\SettingsApi;
use Inc\Base\BaseController;

class Admin extends BaseController {

    protected $adminTemplatePath = '/templates/admin.php';

    public $settings;
    public $callbacks;
    public $callbacks_mngr;
    public $pages;
    public $subpages;

    public function register() {
        $this->settings = new SettingsApi();
        $this->callbacks = new AdminCallbacks();
        $this->callbacks_mngr = new ManagerCallbacks();
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
                'option_group' => 'sl_plugin_settings',
                'option_name' => 'cpt_manager',
                'callback' => array($this->callbacks_mngr, 'checkboxSanitize')
            ),
            array(
                'option_group' => 'sl_plugin_settings',
                'option_name' => 'taxonomy_manager',
                'callback' => array($this->callbacks_mngr, 'checkboxSanitize')
            ),
            array(
                'option_group' => 'sl_plugin_settings',
                'option_name' => 'media_widget',
                'callback' => array($this->callbacks_mngr, 'checkboxSanitize')
            ),
            array(
                'option_group' => 'sl_plugin_settings',
                'option_name' => 'gallery_manager',
                'callback' => array($this->callbacks_mngr, 'checkboxSanitize')
            ),
            array(
                'option_group' => 'sl_plugin_settings',
                'option_name' => 'testimonial_manager',
                'callback' => array($this->callbacks_mngr, 'checkboxSanitize')
            ),
            array(
                'option_group' => 'sl_plugin_settings',
                'option_name' => 'templates_manager',
                'callback' => array($this->callbacks_mngr, 'checkboxSanitize')
            ),
            array(
                'option_group' => 'sl_plugin_settings',
                'option_name' => 'login_manager',
                'callback' => array($this->callbacks_mngr, 'checkboxSanitize')
            ),
            array(
                'option_group' => 'sl_plugin_settings',
                'option_name' => 'membership_manager',
                'callback' => array($this->callbacks_mngr, 'checkboxSanitize')
            ),
            array(
                'option_group' => 'sl_plugin_settings',
                'option_name' => 'chat_manager',
                'callback' => array($this->callbacks_mngr, 'checkboxSanitize')
            ),
        );
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

        $args = array(
            array(
                'id' => 'cpt_manager',
                'title' => 'CPT Manager',
                'callback' => array($this->callbacks_mngr, 'checkboxField'),
                'page' => 'sl_plugin',
                'section' => 'sl_admin_index',
                'args' => ['label_for' => 'cpt_manager', 'class' => 'ui-toggle']
            ),
            array(
                'id' => 'taxonomy_manager',
                'title' => 'Taxonomy Manager',
                'callback' => array($this->callbacks_mngr, 'checkboxField'),
                'page' => 'sl_plugin',
                'section' => 'sl_admin_index',
                'args' => ['label_for' => 'taxonomy_manager', 'class' => 'ui-toggle']
            ),
            array(
                'id' => 'media_manager',
                'title' => 'Media Manager',
                'callback' => array($this->callbacks_mngr, 'checkboxField'),
                'page' => 'sl_plugin',
                'section' => 'sl_admin_index',
                'args' => ['label_for' => 'media_manager', 'class' => 'ui-toggle']
            ),
            array(
                'id' => 'gallery_manager',
                'title' => 'Gallery Manager',
                'callback' => array($this->callbacks_mngr, 'checkboxField'),
                'page' => 'sl_plugin',
                'section' => 'sl_admin_index',
                'args' => ['label_for' => 'gallery_manager', 'class' => 'ui-toggle']
            ),
            array(
                'id' => 'testimonial_manager',
                'title' => 'Testimonial Manager',
                'callback' => array($this->callbacks_mngr, 'checkboxField'),
                'page' => 'sl_plugin',
                'section' => 'sl_admin_index',
                'args' => ['label_for' => 'testimonial_manager', 'class' => 'ui-toggle']
            ),
            array(
                'id' => 'templates_manager',
                'title' => 'Templates Manager',
                'callback' => array($this->callbacks_mngr, 'checkboxField'),
                'page' => 'sl_plugin',
                'section' => 'sl_admin_index',
                'args' => ['label_for' => 'templates_manager', 'class' => 'ui-toggle']
            ),
            array(
                'id' => 'login_manager',
                'title' => 'Login Manager',
                'callback' => array($this->callbacks_mngr, 'checkboxField'),
                'page' => 'sl_plugin',
                'section' => 'sl_admin_index',
                'args' => ['label_for' => 'login_manager', 'class' => 'ui-toggle']
            ),
            array(
                'id' => 'membership_manager',
                'title' => 'Membership Manager',
                'callback' => array($this->callbacks_mngr, 'checkboxField'),
                'page' => 'sl_plugin',
                'section' => 'sl_admin_index',
                'args' => ['label_for' => 'membership_manager', 'class' => 'ui-toggle']
            ),
            array(
                'id' => 'chat_manager',
                'title' => 'Chat Manager',
                'callback' => array($this->callbacks_mngr, 'checkboxField'),
                'page' => 'sl_plugin',
                'section' => 'sl_admin_index',
                'args' => ['label_for' => 'chat_manager', 'class' => 'ui-toggle']
            )
        );
        $this->settings->setFields($args);
    }
}

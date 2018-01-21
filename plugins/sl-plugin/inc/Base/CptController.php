<?php
/**
 * SlPlugin
 */
namespace Inc\Base;

use Inc\Api\Callbacks\AdminCallbacks;
use Inc\Api\SettingsApi;
use Inc\Base\BaseController;

/**
 *
 */
class CptController extends BaseController {

    public $settings;
    public $callbacks;
    public $subpages = [];

    public function register() {

        if(!$this->activated('cpt_manager')) {
            return;
        }

        $this->settings = new SettingsApi();
        $this->callbacks = new AdminCallbacks();
        $this->setSubpages();
        $this->settings->add_subpages($this->subpages)->register();

        add_action('init', [$this, 'activate']);
    }

    public function activate() {
        register_post_type('sl_products',
            ['labels' => [
                'name' => 'Products',
                'singular_name' => 'Product'],
            'public' => true,
            'has_archive' => true]
        );
    }

    public function setSubpages() {
        $this->subpages = [
            ['parent_slug' => 'sl_plugin',
            'page_title' => 'Custom Post Types',
            'menu_title' => 'CPT Manager',
            'capability' => 'manage_options',
            'menu_slug' => 'sl_cpt',
            'callback' => [$this->callbacks, 'adminCpt']]
        ];
    }
}

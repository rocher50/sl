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
class TemplatesController extends BaseController {

    public $settings;
    public $callbacks;
    public $subpages = [];

    public function register() {

        if(!$this->activated('templates_manager')) {
            return;
        }

        $this->settings = new SettingsApi();
        $this->callbacks = new AdminCallbacks();
        $this->setSubpages();
        $this->settings->add_subpages($this->subpages)->register();

        add_action('init', [$this, 'activate']);
    }

    public function activate() {
    }

    public function setSubpages() {
        $this->subpages = [
            ['parent_slug' => 'sl_plugin',
            'page_title' => 'Templates',
            'menu_title' => 'Templates Manager',
            'capability' => 'manage_options',
            'menu_slug' => 'sl_templates',
            'callback' => [$this->callbacks, 'adminTemplates']]
        ];
    }
}

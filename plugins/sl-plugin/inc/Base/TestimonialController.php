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
class TestimonialController extends BaseController {

    public $settings;
    public $callbacks;
    public $subpages = [];

    public function register() {

        if(!$this->activated('testimonial_manager')) {
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
            'page_title' => 'Testimonial',
            'menu_title' => 'Testimonial Manager',
            'capability' => 'manage_options',
            'menu_slug' => 'sl_testimonial',
            'callback' => [$this->callbacks, 'adminTestimonial']]
        ];
    }
}

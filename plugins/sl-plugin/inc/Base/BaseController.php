<?php

/**
 * @package SlPlugin
 */

namespace Inc\Base;

class BaseController {

    public $plugin_path;
    public $plugin_url;
    public $plugin;
    public $managers = [];

    public function __construct() {
        $this->plugin_path = plugin_dir_path( dirname( __FILE__, 2 ) );
        $this->plugin_url = plugin_dir_url( dirname( __FILE__, 2 ) );
        $this->plugin = plugin_basename( dirname( __FILE__, 3 ) );
        $this->plugin = $this->plugin . '/' . $this->plugin . '.php';

        $this->managers = [
            'cpt_manager' => 'CPT Manager',
            'taxonomy_manager' => 'Taxonomy Manager',
            'media_widget' => 'Media Widget',
            'gallery_manager' => 'Gallery Manager',
            'testimonial_manager' => 'Testimonial Manager',
            'templates_manager' => 'Templates Manager',
            'login_manager' => 'Login Manager',
            'membership_manager' => 'Membership Manager',
            'chat_manager' => 'Chat Manager'
        ];
    }
}


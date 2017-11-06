<?php
/**
 * @package SlPlugin
 */

namespace Inc\Base;

class SettingsLink extends BaseController {

    public function register() {
        add_filter( "plugin_action_links_$this->plugin" , [$this, 'settings_link'] );
    }

    public function settings_link( $links ) {
        array_push( $links, '<a href="admin.php?page=sl_plugin">Settings</a>' );
        return $links;
    }
}

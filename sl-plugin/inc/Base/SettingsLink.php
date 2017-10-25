<?php
/**
 * @package SlPlugin
 */

namespace Inc\Base;

class SettingsLink {

    public function register() {
        add_filter( "plugin_action_links_" . PLUGIN, [$this, 'settings_link'] );
    }

    public function settings_link( $links ) {
        array_push( $links, '<a href="admin.php?page=' . PLUGIN . '">Settings</a>' );
        return $links;
    }
}

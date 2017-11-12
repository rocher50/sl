<?php
/**
 * @package SlPlugin
 */
namespace Inc\Api\Callbacks;

use Inc\Base\BaseController;

class AdminCallbacks extends BaseController {

    public function admin_dashboard() {
        return require_once("$this->plugin_path/templates/admin.php");
    }

    public function cpt_manager() {
        return require_once("$this->plugin_path/templates/cpt-manager.php");
    }

    public function taxonomy_manager() {
        return require_once("$this->plugin_path/templates/taxonomy-manager.php");
    }

    public function widget_manager() {
        return require_once("$this->plugin_path/templates/widget-manager.php");
    }
}

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

    public function slOptionsGroup($input) {
        return $input;
    }

    public function slAdminSection() {
        echo 'this is sl admin section';
    }

    public function slTextExample() {
        $value = esc_attr(get_option('text_example'));
        echo '<input type="text" class="regular_text" name="text_example" value="' . $value . '" placeholder="write something here">';
    }

    public function slOpeningTime() {
        $value = esc_attr(get_option('opening_time'));
        echo '<input type="text" class="regular_text" name="opening_time" value="' . $value . '" placeholder="HH:MM">';
    }
}

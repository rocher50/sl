<?php
/**
 * @package SlPlugin
 */
namespace Inc\Api\Callbacks;

use Inc\Base\BaseController;

class ManagerCallbacks extends BaseController {

    public function checkboxSanitize($input) {
        return (isset($input) ? true : false);
    }

    public function adminSectionManager() {
        echo 'Manage the Sections and Features of this plugin by checking them in the following list.';
    }

    public function checkboxField($args) {
        $name = $args['label_for'];
        $class = $args['class'];
        $checkbox = get_option($name);
        echo '<input type="checkbox" name="' . $name . '" value="1" class="' . $class . '" ' . ($checkbox ? 'checked' : '') . '>';
    }
}

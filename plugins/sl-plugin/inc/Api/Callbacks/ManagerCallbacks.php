<?php
/**
 * @package SlPlugin
 */
namespace Inc\Api\Callbacks;

use Inc\Base\BaseController;

class ManagerCallbacks extends BaseController {

    public function checkboxSanitize($input) {
        $output = [];
        foreach($this->managers as $key => $value) {
            $output[$key] = isset($input[$key]) ? true : false;
        }
        return $output;
    }

    public function adminSectionManager() {
        echo 'Manage the Sections and Features of this plugin by checking them in the following list.';
    }

    public function checkboxField($args) {
        $name = $args['label_for'];
        $class = $args['class'];
        $option_name = $args['option_name'];
        $checkbox = get_option($option_name);
        echo '<div class="' . $class . '"><input type="checkbox" name="' . $option_name . '[' . $name . ']" id="' . $name . '" value="1" class="" ' . ($checkbox[$name] ? 'checked' : '') . '><label for="' . $name . '"><div></div></label></div>';
    }
}

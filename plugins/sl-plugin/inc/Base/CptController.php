<?php
/**
 * SlPlugin
 */
namespace Inc\Base;

use Inc\Api\Callbacks\AdminCallbacks;
use Inc\Api\Callbacks\CptCallbacks;
use Inc\Api\SettingsApi;
use Inc\Base\BaseController;

/**
 *
 */
class CptController extends BaseController {

    public $settings;
    public $callbacks;
    public $cptCallbacks;
    public $subpages = [];

    public $cpts = [];

    public function register() {

        if(!$this->activated('cpt_manager')) {
            return;
        }

        $this->settings = new SettingsApi();
        $this->callbacks = new AdminCallbacks();
        $this->cptCallbacks = new CptCallbacks();
        $this->setSubpages();

        $this->setSettings();
        $this->setSections();
        $this->setFields();

        $this->settings->add_subpages($this->subpages)->register();

        $this->storeCpts();

        if(!empty($this->cpts)) {
            add_action('init', [$this, 'registerCpt']);
        }
    }

    public function setSettings() {

        $args = [
            ['option_group' => 'sl_plugin_cpt_settings',
                'option_name' => 'sl_plugin_cpt',
                'callback' => array($this->cptCallbacks, 'cptSanitize')]
        ];

        $this->settings->setSettings($args);
    }

    public function setSections() {

        $args = array(
            array(
                'id' => 'sl_cpt_index',
                'title' => 'CPT Manager',
                'callback' => array($this->cptCallbacks, 'cptSectionManager'),
                'page' => 'sl_cpt'
            )
        );
        $this->settings->setSections($args);
    }

    public function setFields() {

        $args = [
            array(
                'id' => 'post_type',
                'title' => 'CPT ID',
                'callback' => array($this->cptCallbacks, 'textField'),
                'page' => 'sl_cpt',
                'section' => 'sl_cpt_index',
                'args' => ['option_name' => 'sl_plugin_cpt', 'label_for' => 'post_type', 'placeholder' => 'e.g. product']
            ),
            array(
                'id' => 'singular_name',
                'title' => 'Singular name',
                'callback' => array($this->cptCallbacks, 'textField'),
                'page' => 'sl_cpt',
                'section' => 'sl_cpt_index',
                'args' => ['option_name' => 'sl_plugin_cpt', 'label_for' => 'singular_name', 'placeholder' => 'e.g. Product']
            ),
            array(
                'id' => 'plural_name',
                'title' => 'Plural name',
                'callback' => array($this->cptCallbacks, 'textField'),
                'page' => 'sl_cpt',
                'section' => 'sl_cpt_index',
                'args' => ['option_name' => 'sl_plugin_cpt', 'label_for' => 'plural_name', 'placeholder' => 'e.g. Products']
            ),
            array(
                'id' => 'public',
                'title' => 'Public',
                'callback' => array($this->cptCallbacks, 'checkboxField'),
                'page' => 'sl_cpt',
                'section' => 'sl_cpt_index',
                'args' => ['option_name' => 'sl_plugin_cpt', 'label_for' => 'public', 'class' => 'ui-toggle']
            ),
            array(
                'id' => 'has_archive',
                'title' => 'Has archive',
                'callback' => array($this->cptCallbacks, 'checkboxField'),
                'page' => 'sl_cpt',
                'section' => 'sl_cpt_index',
                'args' => ['option_name' => 'sl_plugin_cpt', 'label_for' => 'has_archive', 'class' => 'ui-toggle']
            ),
        ];

        $this->settings->setFields($args);
    }

    public function storeCpts() {
        $option = get_option('sl_plugin_cpt');
//        foreach($options as $option) {
            $this->cpts[] = [
			'post_type'             => $option['post_type'],
			'name'                  => $option['plural_name'],
			'singular_name'         => $option['singular_name'],
			'menu_name'             => $option['plural_name'],
			'name_admin_bar'        => $option['singular_name'],
			'archives'              => $option['singular_name'] . ' Archives',
			'attributes'            => $option['singular_name'] . ' Attributes',
			'parent_item_colon'     => 'Parent ' . $option['singular_name'],
			'all_items'             => 'All ' . $option['plural_name'],
			'add_new_item'          => 'Add new ' . $option['singular_name'],
			'add_new'               => 'Add new',
			'new_item'              => 'New ' . $option['singular_name'],
			'edit_item'             => 'Edit ' . $option['singular_name'],
			'update_item'           => 'Update ' . $option['singular_name'],
			'view_item'             => 'View ' . $option['singular_name'],
			'view_items'            => 'View ' . $option['plural_name'],
			'search_items'          => 'Search ' . $option['plural_name'],
			'not_found'             => 'No ' . $option['singular_name'] . ' found',
			'not_found_in_trash'    => 'No ' . $option['singular_name'] . ' found in the trash',
			'featured_image'        => 'Featured image',
			'set_featured_image'    => 'Set featured image',
			'remove_featured_image' => 'Remove featured image',
			'use_featured_image'    => 'Use featured image',
			'insert_into_item'      => 'Insert into ' . $option['singular_name'],
			'uploaded_to_this_item' => 'Upload to this ' . $option['singular_name'],
			'items_list'            => $option['plural_name'] . ' list',
			'items_list_navigation' => $option['plural_name'] . ' list navigation',
			'filter_items_list'     => 'Filter ' . $option['plural_name'] . ' list',
			'label'                 => $option['singular_name'],
			'description'           => $option['plural_name'] . ' custom post type',
			'supports'              => ['title', 'editor', 'thumbnail'],
			'taxonomies'            => array('category', 'post_tag'),
			'hierarchical'          => false,
			'public'                => $option['public'],
			'show_ui'               => true,
			'show_in_menu'          => true,
			'menu_position'         => 5,
			'show_in_admin_bar'     => true,
			'show_in_nav_menus'     => true,
			'can_export'            => true,
			'has_archive'           => $option['has_archive'],
			'exclude_from_search'   => false,
			'publicly_queryable'    => true,
			'capability_type'       => 'post'
            ];
//        }
    }

    public function registerCpt() {
        foreach($this->cpts as $cpt) {
            register_post_type(
                $cpt['post_type'],
                [
					'labels' => array(
						'name'                  => $cpt['name'],
						'singular_name'         => $cpt['singular_name'],
						'menu_name'             => $cpt['menu_name'],
						'name_admin_bar'        => $cpt['name_admin_bar'],
						'archives'              => $cpt['archives'],
						'attributes'            => $cpt['attributes'],
						'parent_item_colon'     => $cpt['parent_item_colon'],
						'all_items'             => $cpt['all_items'],
						'add_new_item'          => $cpt['add_new_item'],
						'add_new'               => $cpt['add_new'],
						'new_item'              => $cpt['new_item'],
						'edit_item'             => $cpt['edit_item'],
						'update_item'           => $cpt['update_item'],
						'view_item'             => $cpt['view_item'],
						'view_items'            => $cpt['view_items'],
						'search_items'          => $cpt['search_items'],
						'not_found'             => $cpt['not_found'],
						'not_found_in_trash'    => $cpt['not_found_in_trash'],
						'featured_image'        => $cpt['featured_image'],
						'set_featured_image'    => $cpt['set_featured_image'],
						'remove_featured_image' => $cpt['remove_featured_image'],
						'use_featured_image'    => $cpt['use_featured_image'],
						'insert_into_item'      => $cpt['insert_into_item'],
						'uploaded_to_this_item' => $cpt['uploaded_to_this_item'],
						'items_list'            => $cpt['items_list'],
						'items_list_navigation' => $cpt['items_list_navigation'],
						'filter_items_list'     => $cpt['filter_items_list']
					),
					'label'                     => $cpt['label'],
					'description'               => $cpt['description'],
					'supports'                  => $cpt['supports'],
					'taxonomies'                => $cpt['taxonomies'],
					'hierarchical'              => $cpt['hierarchical'],
					'public'                    => $cpt['public'],
					'show_ui'                   => $cpt['show_ui'],
					'show_in_menu'              => $cpt['show_in_menu'],
					'menu_position'             => $cpt['menu_position'],
					'show_in_admin_bar'         => $cpt['show_in_admin_bar'],
					'show_in_nav_menus'         => $cpt['show_in_nav_menus'],
					'can_export'                => $cpt['can_export'],
					'has_archive'               => $cpt['has_archive'],
					'exclude_from_search'       => $cpt['exclude_from_search'],
					'publicly_queryable'        => $cpt['publicly_queryable'],
					'capability_type'           => $cpt['capability_type']]);
        }
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

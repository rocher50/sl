<?php
/**
 * @package SlPlugin
 */

namespace Inc\Base\Vcl;

class VehiculeCpt {

    public function register() {
        add_action('init', [$this, 'custom_post_type'] );
    }

    public function custom_post_type() {

        $labels = [
            'name'		=> 'Passeport de véhicule',
            'singular_name'	=> 'Passeport de véhicule',
            'add_new'		=> 'Ajouter',
            'all_items'		=> 'Flotte actuelle',
            'add_new_item'	=> 'Ajouter',
            'edit_item'		=> 'Modifier',
            'new_item'		=> 'Nouvelle vehicule',
            'view_item'		=> 'Afficher vehicule',
            'search_item'	=> 'Chercher',
            'not_found'		=> 'Aucun véhicule trouvé',
            'not_found_in_trash'=> 'Aucun véhicule trouvé dans la poubelle',
            'parent_item_colon'	=> 'Parent',
        ];
        $args = [
            'labels'			=> $labels,
            'public'			=> true,
            'show_in_rest'              => true,
            'has_archive'		=> true,
            'publicly_queryable'	=> true,
            'query_var'			=> true,
            'rewrite'			=> true,
            'capability_type'		=> 'post',
            'hierarchical'		=> false,
            'supports'			=> [
//                'title',
//                'editor',
//                'excerpt',
                'thumbnail'
//                'revisions'
            ],
            'taxonomies'		=> [
                'category',
                'post_tag'
            ],
            'menu_position'		=> 5,
            'exclude_from_search'	=> false
        ];
        register_post_type( 'vcl', $args );
        //flush_rewrite_rules();
    }
}

<?php
/**
 * @package SlPlugin
 */

namespace Inc\Base\Vcl;

class ReservationCpt {

    public function register() {
        add_action('init', [$this, 'custom_post_type'] );
    }

    public function custom_post_type() {

        $labels = [
            'name'		=> 'Réservation',
            'singular_name'	=> 'Réservation',
            'add_new'		=> 'Ajouter',
            'all_items'		=> 'Réservations',
            'add_new_item'	=> 'Ajouter',
            'edit_item'		=> 'Modifier',
            'new_item'		=> 'Nouvelle réservation',
            'view_item'		=> 'Afficher la réservation',
            'search_item'	=> 'Chercher',
            'not_found'		=> 'Aucune réservation trouvée',
            'not_found_in_trash'=> 'Aucune réservation trouvée dans la poubelle',
            'parent_item_colon'	=> 'Parent',
        ];
        $args = [
            'labels'			=> $labels,
            'public'			=> true,
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
            'exclude_from_search'	=> false,
            'public'                    => true
        ];
        register_post_type( 'rsrv', $args );
        //flush_rewrite_rules();
    }
}

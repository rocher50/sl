<?php

/**
 * Plugin uninstall
 *
 * @package SlPlugin
 */

if( !defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    die;
}

$vehicules = get_posts( array( 'post_type' => 'vehicule', 'numberposts' => -1 ) );
foreach( $vehicule as $vehicules ) {
    wp_delete_post( $vehicule->ID, true );
}

global $wpdb;
$wpdb->query( "DELETE FROM wp_posts WHERE post_type = 'vehicule'" );
$wpdb->query( "DELETE FROM wp_postmeta WHERE post_id NOT IN (SELECT id FROM wp_posts)" );
$wpdb->query( "DELETE FROM wp_term_relationships WHERE object_id NOT IN (SELECT id FROM wp_posts)" );
$wpdb->query( "DROP TABLE " . $wpdb->prefix . "sl_cal" );
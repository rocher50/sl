<?php
/**
 * @package SlPlugin
 */
namespace Inc\Base;

global $sl_db_version;
$sl_db_version = '1.0';

class Activate {

    public static function activate() {
        Activate::setup_db();
        flush_rewrite_rules();
    }

    public static function setup_db() {
        global $wpdb;
        global $sl_db_version;

        $table_name = $wpdb->prefix . 'sl_cal';
	
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
            item bigint(20) NOT NULL,
            day date DEFAULT '0000-00-00' NOT NULL,
            value text NOT NULL,
            PRIMARY KEY  (item, day)
        ) $charset_collate;";

        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        dbDelta( $sql );

        add_option( 'sl_db_version', $sl_db_version );
    }
/*
function sl_install_data() {
	global $wpdb;
	
	$welcome_name = 'Mr. WordPress';
	$welcome_text = 'Congratulations, you just completed the installation!';
	
	$table_name = $wpdb->prefix . 'liveshoutbox';
	
	$wpdb->insert( 
		$table_name, 
		array( 
			'time' => current_time( 'mysql' ), 
			'name' => $welcome_name, 
			'text' => $welcome_text, 
		) 
	);
}
*/
}

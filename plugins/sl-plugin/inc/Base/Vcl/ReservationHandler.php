<?php
/**
 * @package SlPlugin
 */

namespace Inc\Base\Vcl;

class ReservationHandler {

    public function register() {
        // for logged in users
        add_action( 'wp_ajax_process_user_generated_post', [$this, 'process_user_generated_post'] );
        // for not logged in users
        add_action( 'wp_ajax_nopriv_process_user_generated_post', [$this, 'process_user_generated_post'] );
    }

    public function process_user_generated_post() {
        if(!empty($_POST['submission'])) {
            wp_send_json_error('Honeypot check failed.');
        }
        if(!check_ajax_referer('user-submitted-reservation', 'security')) {
            wp_send_json_error('Security check failed.');
        }

        $reservation_data = [
            'post_title' => sprintf('%s-%s-%s',
                sanitize_text_field( $_POST['data']['name']),
                sanitize_text_field( $_POST['data']['vcl']),
                esc_attr( current_time('Y-m-d'))),
            'post_status' => 'draft',
            'post_type' => 'rsrv'
            //'post_content' => sanitize_text_field($_POST['data']['remarques'])
        ];

        $post_id = wp_insert_post($reservation_data, true);
        if($post_id != null) {
            //wp_set_object_terms($post_id, sanitize_text_field($_POST['data']['vcl']));
            //update_post_meta($post_id, 'contact_email', sanitize_email($_POST['data']['email']));
            update_post_meta($post_id, 'rsrv_remarques', sanitize_text_field($_POST['data']['remarques']));
        }

        wp_send_json_success( $post_id );
    }
}

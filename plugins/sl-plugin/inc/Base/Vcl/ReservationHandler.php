<?php
/**
 * @package SlPlugin
 */

namespace Inc\Base\Vcl;

class ReservationHandler {

    public function register() {
        // for logged in users
        add_action( 'wp_ajax_register_reservation', [$this, 'register_reservation'] );
        // for not logged in users
        add_action( 'wp_ajax_nopriv_register_reservation', [$this, 'register_reservation'] );
    }

    public function register_reservation() {
        if(!empty($_POST['submission'])) {
            wp_send_json_error('Honeypot check failed.');
        }
        if(!check_ajax_referer('user-submitted-reservation', 'security')) {
            wp_send_json_error('Security check failed.');
        }

        $formData = $_POST['data'];
        $reservation_data = [
            'post_title' => sprintf('%s %s.%s @ %s',
                sanitize_text_field($formData['vcl']),
                sanitize_text_field($formData['first_name'][0]),
                sanitize_text_field($formData['last_name']),
                $formData['dep_date']),
            'meta_input' => $formData,
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

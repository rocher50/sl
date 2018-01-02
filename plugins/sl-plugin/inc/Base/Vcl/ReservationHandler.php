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
        $vcl = $formData['vcl'];
        $reservation_data = [
            'post_title' => sprintf('%s %s.%s %s - %s',
                sanitize_text_field($vcl),
                sanitize_text_field($formData['first_name'][0]),
                sanitize_text_field($formData['last_name']),
                $formData['dep_date'],
                $formData['ret_date']),
            'meta_input' => $formData,
            'post_status' => 'draft',
            'post_type' => 'rsrv'
            //'post_content' => sanitize_text_field($_POST['data']['remarques'])
        ];

        global $wpdb;
        $wpdb->query('START TRANSACTION');

        $result = wp_insert_post($reservation_data, true);
        if($result != null && !is_wp_error($result)) {
/*
            if($post_id != null) {
                //wp_set_object_terms($post_id, sanitize_text_field($_POST['data']['vcl']));
                //update_post_meta($post_id, 'contact_email', sanitize_email($_POST['data']['email']));
                //update_post_meta($post_id, 'rsrv_remarques', sanitize_text_field($formData['remarques']));
            }
*/
            $depDate = strtotime($formData['dep_date']);
            $retDate = strtotime($formData['ret_date']);
            $day = date('Y-m-d', $depDate);
            $dayTime = date('H:i', $depDate);
            if($depDate < $retDate && idate('H', $depDate) <= 8 && idate('i', $depDate) <= 30) {
                $dayTime = 'all_day';
            }
            $startDay = date_create($day);
            $endDay = date_create(date('Y-m-d', $retDate));
            $dayInterval = date_interval_create_from_date_string('1 day');
            while($result !== false) {
                $currentValue = $wpdb->get_var('SELECT value FROM wp_sl_cal WHERE item=' . $vcl . ' AND day=\'' . $day . '\'');
                if(is_null($currentValue)) {
                    $result = $wpdb->insert('wp_sl_cal', [
                        'item' => $vcl,
                        'day' => $day,
                        'value' => $dayTime
                    ]);
                } else {
                    $result = $wpdb->update('wp_sl_cal',
                        ['value' => $currentValue . ', ' . $dayTime],
                        ['item' => $vcl, 'day' => $day, 'value' => $currentValue]
                    );
                }

                if($startDay == $endDay) {
                    break;
                }

                date_add($startDay, $dayInterval);
                $day = date_format($startDay, 'Y-m-d');
                if($startDay == $endDay) {
                    $dayTime = '08:30';
                } else {
                    $dayTime = 'all_day';
                }
            }
        }

        if($result === false) {
            $wpdb->query('ROLLBACK');
        } else {
            $wpdb->query('COMMIT');
        }

        wp_send_json_success( $post_id );
    }
}

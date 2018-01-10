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
            wp_send_js.on_error('Honeypot check failed.');
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
        if($result == null) {
            $result = 'Failed to persist the new day booking into the db';
        } else {
            $result = null;
        }

        if($result == null) {
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
            $startDay = date_create($day);
            $endDay = date_create(date('Y-m-d', $retDate));

            $startingHour = idate('H', $depDate);
            $startingMin = idate('i', $depDate);
            $endingHour;
            $endingMin;
            if($startDay == $endDay) {
                $endingHour = idate('H', $retDate);
                $endingMin = idate('i', $retDate);
            }

            $dayInterval = date_interval_create_from_date_string('1 day');
            while($result == null) {
                $result = $this->persistDayBooking($vcl, $startDay, $startingHour, $startingMin, $endingHour, $endingMin);
                if($startDay == $endDay) {
                    break;
                }

                unset($startingHour);
                unset($startingMin);

                date_add($startDay, $dayInterval);
                $dayBooking = '-';
                if($startDay == $endDay) {
                    $endingHour = idate('H', $retDate);
                    $endingMin = idate('i', $retDate);
                }
            }
        }

        if($result != null) {
            $wpdb->query('ROLLBACK');
            wp_send_json_error( $result );
        } else {
            $wpdb->query('COMMIT');
            wp_send_json_success( $post_id );
        }
    }

    function persistDayBooking($vcl, $day, $startingHour, $startingMin, $endingHour, $endingMin) {

        $dayStr = date_format($day, 'Y-m-d');
        $dayBooking = $this->toString($startingHour, $startingMin, $endingHour, $endingMin);

        global $wpdb;
        $currentBooking = $wpdb->get_var('SELECT value FROM ' . $wpdb->prefix . 'sl_cal WHERE item=' . $vcl . ' AND day=\'' . $dayStr . '\'');
        if(is_null($currentBooking)) {
            $result = $wpdb->insert($wpdb->prefix . 'sl_cal', [
                'item' => $vcl,
                'day' => $dayStr,
                'value' => $dayBooking
            ]);
            if($result === false) {
                return 'Failed to persist the new day booking into the db';
            }
            return null;
        }

        if($currentBooking == '-') {
            return $dayStr . ' is not available for booking.';
        }

        if(!isset($startingHour) && !isset($endingHour)) {
            return $dayStr . ' is not available as a full day for booking.';
        }

        $currentBookings = explode(',', $currentBooking);
        $newBooking = '';

        $i = 0;
        while($i < sizeof($currentBookings)) {

            $bookingStartHour;
            $bookingStartMin;
            $bookingEndHour;
            $bookingEndMin;

            $curBooking = $currentBookings[$i++];
            $bookingTimes = explode('-', $curBooking);
            if($curBooking[0] != '-') {
                $bookingHourMin = explode(':', $bookingTimes[0]);
                $bookingStartHour = $bookingHourMin[0];
                $bookingStartMin = $bookingHourMin[1];
            }
            if($curBooking[strlen($curBooking) - 1] != '-') {
                $bookingHourMin = explode(':', $bookingTimes[1]);
                $bookingEndHour = $bookingHourMin[0];
                $bookingEndMin = $bookingHourMin[1];
            }

            if(!isset($bookingStartHour)) {
                if(!isset($startingHour)) {
                    return 'New booking ' . $dayBooking . ' is in conflict with the existing one ' . $curBooking;
                }
                if($bookingEndHour > $startingHour
                    || $bookingEndHour == $startingHour && $bookingEndMin > $startingMin) {
                    return 'New booking ' . $dayBooking . ' is in conflict with the existing one ' . $curBooking;
                }
                $newBooking = $curBooking;
                if(sizeof($currentBookings) == $i) {
                    $newBooking .= ',' . $dayBooking;
                    break;
                }
            } else if(!isset($bookingEndHour)) {
                if(!isset($endingHour)) {
                    return 'New booking ' . $dayBooking . ' is in conflict with the existing one ' . $curBooking;
                }
                if($bookingStartHour < $endingHour
                    || $bookingStartHour == $endingHour && $bookingStartMin < $endingMin) {
                    return 'New booking ' . $dayBooking . ' is in conflict with the existing one ' . $curBooking;
                }
                if(!empty($newBooking)) {
                    $newBooking .= ',';
                }
                $newBooking .= $dayBooking . ',' . $curBooking;
                break;
            } else if(!isset($startingHour)) {
                if($endingHour > $bookingStartHour
                    || $endingHour == $bookingStartHour && $endingMin > $bookingStartMin) {
                    return 'New booking ' . $dayBooking . ' is in conflict with the existing one ' . $curBooking;
                }
                if(!empty($newBooking)) {
                    $newBooking .= ',';
                }
                $newBooking .= $dayBooking . ',' . $curBooking;
                break;
            } else if(!isset($endingHour)) {
                if($startingHour < $bookingEndHour
                    || $startingHour == $bookingEndHour && $startingMin < $bookingEndMin) {
                    return 'New booking ' . $dayBooking . ' is in conflict with the existing one ' . $curBooking;
                }
                if(!empty($newBooking)) {
                    $newBooking .= ',';
                }
                $newBooking .= $curBooking;
                if(sizeof($currentBookings) == $i) {
                    $newBooking .= ',' . $dayBooking;
                    break;
                }
            } else if($startingHour < $bookingStartHour
                || $startingHour == $bookingStartHour && $startingMin < $bookingStartMin) {
                if($endingHour > $bookingStartHour
                    || $endingHour == $bookingStartHour && $endingMin > $bookingStartMin) {
                    return 'New booking ' . $dayBooking . ' is in conflict with the existing one ' . $curBooking;
                }
                if(!empty($newBooking)) {
                    $newBooking .= ',';
                }
                $newBooking .= $dayBooking . ',' . $curBooking;
                break;
            } else if($startingHour > $bookingEndHour
                || $startingHour == $bookingEndHour && $startingMin >= $bookingEndMin) {
                if(!empty($newBooking)) {
                    $newBooking .= ',';
                }
                $newBooking .= $curBooking;
                if(sizeof($currentBookings) == $i) {
                    $newBooking .= ',' . $dayBooking;
                    break;
                }
            } else {
                return 'New booking ' . $dayBooking . ' is in conflict with the existing one ' . $curBooking;
            }
        }

        while($i < sizeof($currentBookings)) {
            $newBooking .= ',' . $currentBookings[$i++];
        }

        $result = $wpdb->update($wpdb->prefix .'sl_cal',
            ['value' => $newBooking],
            ['item' => $vcl, 'day' => $dayStr, 'value' => $currentBooking]
        );
        if($result === false) {
            return 'Failed to persist the new day booking into the db';
        }
        return null;
    }

    function toString($startHour, $startMin, $endHour, $endMin) {
        $dayBooking;
        if(isset($startHour)) {
            $dayBooking = $startHour . ':' . $startMin . '-';
        } else {
            $dayBooking = '-';
        }
        if(isset($endHour)) {
            $dayBooking = $dayBooking . $endHour . ':' . $endMin;
        }
        return $dayBooking;
    }
}

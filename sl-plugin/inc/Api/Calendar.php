<?php
/**
 * @package SlPlugin
 */

namespace Inc\Api;

class Calendar {

    public function renderMonth($tstamp, $month_offset, bool $current_day_available) {

        echo '<div class="calendar">';
        echo '<div class="month">';
        echo '  <ul>';

        if($month_offset  < 1) {
            echo '  <li class="arrow">&#10094;</li>';
        } elseif($month_offset == 1) {
            echo '  <li class="arrow"><a href="index.php">&#10094;</a></li>';
        } else {
            echo '  <li class="arrow"><a href="index.php?cal_mo=' . ($month_offset - 1) . '">&#10094;</a></li>';
        }

        echo '    <li>' . date('F', $tstamp) . ', ' . date('Y', $tstamp ) . '</li>';
        echo '    <li class="arrow"><a href="index.php?cal_mo=' . ($month_offset + 1) . '">&#10095;</a></li>';
        echo '  </ul>';
        echo '</div>';

        echo '<ul class="weekdays">';
        echo '  <li>Lu</li>';
        echo '  <li>Ma</li>';
        echo '  <li>Me</li>';
        echo '  <li>Je</li>';
        echo '  <li>Ve</li>';
        echo '  <li>Sa</li>';
        echo '  <li>Di</li>';
        echo '</ul>';
        echo '<div class="after_box"/>';

        echo '<ul class="days">';
        $month_day_start = idate('w', mktime(0, 0, 0, idate('m', $tstamp), 1, idate('Y', $tstamp)));
        $i = 0;
        while($i < $month_day_start - 1) {
            $i++;
            echo '<li class="blank"/>';
        }

        $first_available_day = idate('d', $tstamp);
        if($current_day_available) {
            $first_available_day--;
        }
        $i = 0;
        while($i < $first_available_day) {
            $i++;
            echo '<li class="day-na">' . $i . '</li>';
        }

        $days_in_month = idate('t', $tstamp);
        while($i < $days_in_month) {
            $i++;
            echo '<li class="day-av"><a href="#">' . $i . '</a></li>';
        }
        echo '</ul>';
        echo '<div class="after_box"/>';
        echo '</div>';
    }
}


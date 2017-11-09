<?php
/**
 * @package SlPlugin
 */

namespace Inc\Api;

class Calendar {

    public function renderMonth($tstamp, bool $current_day_active, array $days_na, $month_offset) {

        echo '<div class="calendar">';
        echo '<div class="month">';
        echo '  <ul>';

        if($month_offset  < 1) {
            echo '  <li class="arrow disabled">&#10094;</li>';
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
//        echo '<div class="after_box"/>';

        echo '<ul class="days">';
        $month_day_start = idate('w', mktime(0, 0, 0, idate('m', $tstamp), 1, idate('Y', $tstamp)));
        $i = 0;
        while($i < $month_day_start - 1) {
            $i++;
            echo '<li class="blank"/>';
        }

        $first_active_day = idate('d', $tstamp);
        if($current_day_active) {
            $first_active_day--;
        }
        $i = 0;
        while($i < $first_active_day) {
            $i++;
            echo '<li class="day-past">' . $i . '</li>';
        }

        $days_in_month = idate('t', $tstamp);
        while($i < $days_in_month) {
            $i++;
            $day_style = $this->get_day_style($days_na, $i);
            if($day_style != null) {
                echo '<li class="' . $day_style[1] . '">';
                if($day_style[2]) {
                    echo '<a href="#">';
                }
                echo $i;
                if($day_style[2]) {
                    echo '</a>';
                }
                echo '</li>';
            } else {
                echo '<li class="day-av"><a href="#">' . $i . '</a></li>';
            }
        }
        echo '</ul>';
//        echo '<div class="after_box"/>';
        echo '</div>';
    }

    private function get_day_style( array $days_na, $day ) {
        $i = 0; 
        $arrlength = count($days_na);
        while($i < $arrlength) {
            if($day == $days_na[$i][0]) {
                return $days_na[$i];
            } else if($day < $days_na[$i][0]) {
                return null;
            }
            $i++;
        }
        return null;
    }
}


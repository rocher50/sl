<?php
/**
 * @package SlPlugin
 */

namespace Inc\Api;

class Calendar {

    public function renderMonth($tstamp, $month_offset) {
        echo '<div>';
        echo '<div class="divTable">';
        echo '    <div class="container">';

        if($month_offset  < 1) {
            echo '    <div><-</div>';
        } elseif($month_offset == 1) {
            echo '    <div><a href="index.php"><-</a></div>';
        } else {
            echo '    <div><a href="index.php?cal_mo=' . ($month_offset - 1) . '"><-</a></div>';
        }

        echo '        <div>' . date('F', $tstamp) . ', ' . date('Y', $tstamp ) . '</div>';

        echo '        <div><a href="index.php?cal_mo=' . ($month_offset + 1) . '">-></a></div>';

        echo '    </div>';
        echo '    <div class="headRow">';
        echo '        <div class="divCell">L</div>';
        echo '        <div class="divCell">M</div>';
        echo '        <div class="divCell">M</div>';
        echo '        <div class="divCell">J</div>';
        echo '        <div class="divCell">V</div>';
        echo '        <div class="divCell">S</div>';
        echo '        <div class="divCell">D</div>';

        $month_day_start = idate('w', $tstamp);
        $i = 0;
        while($i < $month_day_start - 1) {
            $i++;
            if( $i == 1 ) {
                echo '</div><div class="divRow">';
            } elseif( $i == 7 ) {
                $i = 0;
            }
            echo '<div class="divEmptyCell"></div>';
        }
        $days_in_month = idate('t', $tstamp);
/*        $past_days = 0;
        while($past_days < $days_in_month - $arrlength) {
            $d++;
            if( $d == 1 ) {
                echo '</tr><tr>';
            } elseif( $d == 7 ) {
                $d = 0;
            }
            $past_days++;
            echo '<td>' . $past_days . '</td>';
        }
*/
        $d = 0;
        while($d < $days_in_month) {
            $i++;
            if( $i == 1 ) {
                echo '</div><div class="divRow">';
            } elseif( $i == 7 ) {
                $i = 0;
            }
            $d++;
            echo '<div class="divCell">' . $d . '</div>';
        }

        echo '    </div>';
        echo '</div>';
        echo '</div>';
    }
}


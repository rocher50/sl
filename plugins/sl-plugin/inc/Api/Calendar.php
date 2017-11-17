<?php
/**
 * @package SlPlugin
 */

namespace Inc\Api;

class Calendar {

    public function renderMonth(array $args) {
?>
        <div class="calendar">
<?php
        $year = $this->get_param('cal_year');
        if($year == null) {
            $tstamp = time();
            $year = date('Y', $tstamp);
            $month = date('m', $tstamp);
        } else {
            $month = $this->get_param('cal_month');
            $monthChange = $this->get_param('cal_month_change');
            if($monthChange != null) {
                $month = $month + $monthChange;
            }
            $tstamp = mktime(0, 0, 0, $month, 1, $year);
        }

        $current_day_active = (12 - idate('H', $tstamp)) >= 2;
?>
            <div class="args">
                <div class="arg">
                    <p class="arg-name">cal_year</p>
                    <p class="arg-value"><?php echo $year; ?></p>
                </div>
                <div class="arg">
                    <p class="arg-name">cal_month</p>
                    <p class="arg-value"><?php echo $month; ?></p>
                </div>
<?php
        $extraArgs = $args['extra_args'];
        if($extraArgs != null) {
            foreach($extraArgs as $key => $value) {
                ?><div class="arg">
                      <p class="arg-name"><?php echo $key; ?></p>
                      <p class="arg-value"><?php echo $value; ?></p>
                  </div><?php
            }
        }
?>
            </div>

            <div class="month">
                <ul>
<?php
        $enable_past = true;

        if($enable_past) {
?>
                    <li class="arrow"><a href="#">&#10094;</a></li>
<?php
        } else {
?>
                    <li class="arrow disabled">&#10094;</li>
<?php
        }
?>
                    <li><?php echo date('F', $tstamp); ?>, <?php echo $year; ?></li>
                    <li class="arrow"><a href="#">&#10095;</a></li>
                </ul>
            </div>

            <ul class="weekdays">
                <li>Lu</li>
                <li>Ma</li>
                <li>Me</li>
                <li>Je</li>
                <li>Ve</li>
                <li>Sa</li>
                <li>Di</li>
            </ul>
            <!-- <div class="after_box"/> -->

            <ul class="days">
<?php
        $month_day_start = idate('w', mktime(0, 0, 0, idate('m', $tstamp), 1, idate('Y', $tstamp)));
        $i = 0;
        while($i < $month_day_start - 1) {
            $i++;
?>
                <li class="blank"/>
<?php
        }

        $first_active_day = idate('d', $tstamp);
        if($current_day_active) {
            $first_active_day--;
        }
        $i = 0;
        while($i < $first_active_day) {
            $i++;
?>
                <li class="day-past"><?php echo $i; ?></li>
<?php
        }

        $agenda = $args['agenda'];
        $days_in_month = idate('t', $tstamp);
        while($i < $days_in_month) {
            $i++;
            $day_style = $this->get_day_style($agenda, $i);
            if($day_style != null) {
?>
                <li class="<?php echo $day_style[1]; ?>">
                    <?php if($day_style[2]) { ?><a href="#"><?php } echo $i; if($day_style[2]) { ?></a><?php } ?>
                </li>
<?php
            } else {
?>
                <li class="day-av"><a href="#"><?php echo $i; ?></a></li>
<?php
            }
        }
?>
            </ul>
            <!-- <div class="after_box"/> -->
        </div>
<?php
    }

    private function get_day_style( array $agenda, $day ) {
        $i = 0; 
        $arrlength = count($agenda);
        while($i < $arrlength) {
            if($day == $agenda[$i][0]) {
                return $agenda[$i];
            } else if($day < $agenda[$i][0]) {
                return null;
            }
            $i++;
        }
        return null;
    }

    public function get_param($name) {
        if(isset($_POST[$name])) {
            return $_POST[$name];
        }
        if(isset($_GET[$name])) {
            return $_GET[$name];
        }
        return null;
    }
}


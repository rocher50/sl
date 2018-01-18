<?php
/**
 * @package SlPlugin
 */

namespace Inc\Api;

class Calendar {

    public function renderMonth(array $args) {
?>
        <div class="calendar">
            <form>
<?php
        $currentTstmp = time();
        $setTstmp;

        $setYear = $this->get_param('cal_year');
        $setMonth;
        $setDay;
        $firstActiveDay;
        $enablePrevMonth = false;
        if($setYear == null) {
            $setTstmp = $currentTstmp;
            $setYear = date('Y', $setTstmp);
            $setMonth = date('m', $setTstmp);
            $setDay = date('d', $setTstmp);
            $firstActiveDay = $setDay;
            if(12 - idate('H', $setTstmp) < 2) {
                $firstActiveDay++;
            }
        } else {
            $setMonth = $this->get_param('cal_month');
            $monthChange = $this->get_param('cal_month_change');
            if($monthChange != null) {
                $setMonth = $setMonth + $monthChange;
            }
            $setDay = $this->get_param('cal_day');
            if($setDay == null) {
                $setTstmp = mktime(0, 0, 0, $setMonth, 1, $setYear);
            } else {
                $setTstmp = mktime(0, 0, 0, $setMonth, $setDay, $setYear);
            }

            if($setYear == idate('Y', $currentTstmp) &&
                    $setMonth == idate('m', $currentTstmp)) {
                $firstActiveDay = idate('d', $currentTstmp);
                if(12 - idate('H', $currentTstmp) < 2) {
                    $firstActiveDay++;
                }
            } else if($setTstmp > $currentTstmp) {
                $firstActiveDay = 1;
                $enablePrevMonth = true;
            }
        }

?>
            <input type="hidden" name="cal_year" value="<?php echo $setYear; ?>"/>
            <input type="hidden" name="cal_month" value="<?php echo $setMonth; ?>"/>
<?php
        $extraArgs = $args['extra_args'];
        if($extraArgs != null) {
            foreach($extraArgs as $key => $value) {
                ?><input type="hidden" name="<?php echo $key; ?>" value="<?php echo $value; ?>"/><?php
            }
        }
?>
        </form>

            <div class="month">
                <ul>
<?php
        if($enablePrevMonth) {
?>
                    <li class="arrow"><a href="#">&#10094;</a></li>
<?php
        } else {
?>
                    <li class="arrow disabled">&#10094;</li>
<?php
        }
?>
                    <li><?php echo date('F', $setTstmp); ?>, <?php echo $setYear; ?></li>
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
        $monthFirstDay = idate('w', mktime(0, 0, 0, $setMonth, 1, $setYear));
        if($monthFirstDay == 0) {
            $monthFirstDay = 7;
        }
        $i = 0;
        while($i < $monthFirstDay - 1) {
            $i++;
            ?><li class="blank"/><?php
        }

        $daysInMonth = idate('t', $setTstmp);
        $i = 0;
        if(isset($firstActiveDay)) {
            while($i < $firstActiveDay - 1) {
                $i++;
                ?><li class="day-past"><?php echo $i; ?></li><?php
            }
            $agenda = $args['agenda'];
            while($i < $daysInMonth) {
                $i++;
                if($i == $setDay) {
                    ?><li class="day-picked"><?php echo $i; ?></li><?php
                    continue;
                }

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
        } else {
            while($i < $daysInMonth) {
                $i++;
                ?><li class="day-past"><?php echo $i; ?></li><?php
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


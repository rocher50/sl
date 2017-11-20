<?php

    get_header();

    use \Inc\Api\Calendar;


    $vclId = get_param('cal_vcl');
    if($vclId) {
        $vcl = get_post($vclId);
?>
        <article class="post">
            <div style="float: left; width: 70%">
                <h2><?php echo $vcl->post_title; ?></h2>
                <?php echo get_the_post_thumbnail($vclId, 'flotte-thumbnail'); ?>
            </div>
            <div style="float: left; width: 30%;">
                <h2>Départ</h2>
                <?php
                    $calendar = new Calendar();
                    $calendar->renderMonth([
                       'agenda' => [
                           [3, 'day-na', false],
                           [17, 'day-pav', true],
                           [20, 'day-pav', true],
                           [26, 'day-na', false]],
                       'extra_args' => [
                           'cal_vcl' => $vclId
                       ]
                   ]);

                   $calDay = get_param('cal_day');
                   if($calDay != null) {
?>
                       <label style="font-size: 18px">L'heure:</label>
                       <select style="font-size: 18px">
                           <option value="8:30">8:30</option>
                           <option value="9:00">9:00</option>
                           <option value="10:00">10:00</option>
                           <option value="12:30">12:30</option>
                       </select>
<?php
                   }
                ?>

            </div>
            <div style="clear: left"/>
        </article>

<?php
    } else {
        echo 'Le véhicule n\'est pas trouvé.';
    }
?>

<?php
    get_footer();

    function get_param($name) {
        if(isset($_POST[$name])) {
            return $_POST[$name];
        }
        if(isset($_GET[$name])) {
            return $_GET[$name];
        }
        return null;
    }
?>

<?php

    get_header();


    $vclId = get_param('cal_vcl');
    if($vclId) {
        $vcl = get_post($vclId);
?>
        <article class="post">
            <div style="float: left; width: 70%">
                <h3><?php echo $vcl->post_title; ?></h3>
                <?php echo get_the_post_thumbnail($vclId, 'flotte-thumbnail'); ?>
            </div>
            <div style="float: left; width: 30%; padding-top: 30px">
                <p>Le jour choisi: <?php echo get_param('cal_day') . '.' . get_param('cal_month') . '.' . get_param('cal_year') ?>
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

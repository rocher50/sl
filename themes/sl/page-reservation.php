<?php

    get_header();

    use \Inc\Api\Calendar;

    $args = [
        'post_type' => 'vcl'
    ];
    $the_query = new WP_Query($args);

?>
<h1>Reservation</h1>
<?php

    if($the_query->have_posts()) {
        while($the_query->have_posts()) {
            $the_query->the_post(); ?>

            <article class="post">


                <div style="float: left; width: 70%">
                    <h3><?php the_title(); ?></h3>
                    <?php the_post_thumbnail('flotte-thumbnail'); ?>
                </div>
                <div style="float: left; width: 30%; padding-top: 30px">
                                <?php
                                    $tstamp = time();
                                    $month_offset = 0;
                                    $current_day_active = (12 - idate('H', $tstamp)) >= 2;
                                    if( isset($_GET['cal_mo']) ) {
                                        $month_offset = $_GET['cal_mo'];
                                        if($month_offset > 0) {
                                            $tstamp = mktime(0, 0, 0, idate('m', $tstamp) + $month_offset, 1, idate('Y', $tstamp));
                                            $current_day_active = true;
                                        } elseif( $month_offset < 0 ) {
                                            $current_day_active = false;
                                        }
                                    }
                                    $calendar = new Calendar(); $calendar->renderMonth([
                                        'tstamp' => $tstamp,
                                        'current_day_active' => $current_day_active,
                                        'agenda' => [
                                            [3, 'day-na', false],
                                            [17, 'day-pav', true],
                                            [20, 'day-pav', true],
                                            [26, 'day-na', false]],
                                        'month_offset' => $month_offset,
                                        'day_link' => 'reservation'
                                    ]);
                                ?>
                </div>
                <div style="clear: left"/>

            </article>
        <?php }
    } else {
        echo '<p>No content found</p>';
    }

    get_footer();
?>

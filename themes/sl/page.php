<?php

    get_header();

    use \Inc\Api\Calendar;

    $args = [
        'post_type' => 'vcl'
    ];
    $the_query = new WP_Query($args);

    if($the_query->have_posts()) {
        while($the_query->have_posts()) {
            $the_query->the_post(); ?>

            <article class="post page">
                <div style="float: left; width: 70%">
                    <h2><?php the_title(); ?></h2>
                    <?php the_content(); ?>
                </div>
                <div style="float: left; width: 30%; padding-top: 50px">
                                <?php
                                    $tstamp = time();
                                    $month_offset = 0;
                                    $current_day_available = (12 - idate('H', $tstamp)) >= 2;
                                    if( isset($_GET['cal_mo']) ) {
                                        $month_offset = $_GET['cal_mo'];
                                        if($month_offset > 0) {
                                            $tstamp = mktime(0, 0, 0, idate('m', $tstamp) + $month_offset, 1, idate('Y', $tstamp));
                                            $current_day_available = true;
                                        } elseif( $month_offset < 0 ) {
                                            $current_day_available = false;
                                        }
                                    }
                                    $calendar = new Calendar(); $calendar->renderMonth($tstamp, $month_offset, $current_day_available);
                                ?>
                </div>
                <div style="clear:left"/>
            </article>
        <?php }
    } else {
        echo '<p>No content found</p>';
    }

    get_footer();
?>

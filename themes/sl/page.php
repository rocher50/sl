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

            <article class="post">


                <div style="float: left; width: 70%">
                    <h2><?php the_title(); ?></h2>
                    <?php the_post_thumbnail('flotte-thumbnail'); ?>
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
                               'cal_vcl' => $the_query->post->ID
                           ]
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

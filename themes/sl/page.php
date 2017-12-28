<?php

    get_header();

    use \Inc\Api\Calendar;
?>
    <?php wp_nonce_field( basename(__FILE__), 'user-submitted-reservation' ); ?>
    <input type="text" id="xyq" name="<?php echo apply_filters( 'honeypot_name', 'date-submitted' ); ?>" value="" style="display: none">

    <div id="page_content" class="fleet">
    </div>
<?php
/*
    $args = [
        'post_type' => 'vcl'
    ];
    $the_query = new WP_Query($args);

    if($the_query->have_posts()) {
        ?><div class="fleet"><?php
        while($the_query->have_posts()) {
            $the_query->the_post(); ?>

            <div class="vehicule">

                <div style="border: 1px solid; grid-column: 1/4; grid-row: 1/3">
                    <h2><?php the_title(); ?></h2>
                    <?php the_post_thumbnail('flotte-thumbnail'); ?>
                </div>
                <div style="border: 1px solid">
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
                <div style="border: 1px solid">Hello</div>
            </div>
        <?php } ?>
        </div> <?php
    } else {
        echo '<p>No content found</p>';
    }
*/
    get_footer();
?>

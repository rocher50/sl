<?php
/**
  Template Name: Home Template
 */

    get_header();

use \Inc\Api\Calendar;

?>

    <main id="main">

        <section>

            <!-- Start dynamic -->
            <?php
            $args = [
                'post_type' => 'vcl'
            ];
            $the_query = new WP_Query( $args );

            // The Loop
            if ( $the_query->have_posts() ) {
                while ( $the_query->have_posts() ) {
                    $the_query->the_post();
                    ?>
                    <article class="full-width">
                        <div class="content"><?php echo get_the_title(); ?></div>
                        <div>
                            <div style="float: left">
                                <?php
                                    if( has_post_thumbnail() ) {
                                        echo the_post_thumbnail( 'large' );
                                    }
                                ?>
                            </div>
                            <div style="float: left; width: 250px; margin-left: 5px">
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
                            <div style="clear: left"/>
                        </div>
                    </article>
                    <?php
                }
	        /* Restore original Post Data */
                wp_reset_postdata();
            } else {
                echo 'Pas de vehicules disponibles';
            }
            ?>

            <!-- End dynamic -->

        </section>

        <?php get_sidebar(); ?>

    </main>

<?php
    get_footer();

    function get_month_agenda() {
        $d = idate('d');
        $h = idate('H');
        if($h > 11) {
            $d++;
        }
        $days_in_month = idate('t');
        $agenda = array();
        while($d <= $days_in_month) {
            array_push($agenda, 'd');
            $d++;
        }
        return $agenda;
    }

    /* 
     * days_in_month($month, $year) 
     * Returns the number of days in a given month and year, taking into account leap years. 
     * 
     * $month: numeric month (integers 1-12)
     * $year: numeric year (any integer) 
     * 
     * Prec: $month is an integer between 1 and 12, inclusive, and $year is an integer. 
     * Post: none 
     */ 
    function days_in_month($month, $year) { 
        // calculate number of days in a month 
        return $month == 2 ? ($year % 4 ? 28 : ($year % 100 ? 29 : ($year % 400 ? 28 : 29))) : (($month - 1) % 7 % 2 ? 30 : 31); 
    }
?>

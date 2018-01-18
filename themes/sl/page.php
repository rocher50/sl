<?php

    get_header();

    use \Inc\Api\Calendar;

    wp_nonce_field( basename(__FILE__), 'user-submitted-reservation' );
?>
    <input type="text" id="xyq" name="<?php echo apply_filters( 'honeypot_name', 'date-submitted' ); ?>" value="" style="display: none">

    <div id="page_content" class="fleet">
    </div>

<?php
    get_footer();
?>

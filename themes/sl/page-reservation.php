<?php

    get_header();
?>
    <div style="width: 50%; margin: 0 auto;">
        <form id="reservation">
            <?php wp_nonce_field( basename(__FILE__), 'user-submitted-reservation' ); ?>
            <input type="text" id="rsrv-user-name" name="rsrv-user-name" placeholder="Nom" style="width: 100%; margin-bottom: 10px">
            <input type="text" id="rsrv-user-email" name="rsrv-user-email" placeholder="Email" style="width: 100%; margin-bottom: 10px">
            <select name="vcl" id="rsrv-vcl" style="width: 100%; margin-bottom: 10px">
                <option value=""/>
                <option value="Citroyen">Citroyen</option>
                <option value="Opel">Opel</option>
                <option value="Renault">Renault</option>
            </select>
            <label for="rsrv-remarques" style="display: block; width: 100%">Remarques:</label>
            <textarea name="rsrv-remarques" id="rsrv-remarques" cols="30" rows="10" style="width: 100%; margin-bottom: 10px"></textarea>
            <input type="text" id="xyq" name="<?php echo apply_filters( 'honeypot_name', 'date-submitted' ); ?>" value="" style="display: none">
            <input type="submit" id="user-submit-button" value="Envoyer">
        </form>
    </div>
<?php
    get_footer();
?>

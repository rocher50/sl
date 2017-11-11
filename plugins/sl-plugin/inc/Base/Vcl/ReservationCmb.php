<?php
/**
 * @package SlPlugin
 */

namespace Inc\Base\Vcl;

class ReservationCmb {

    protected $fields;
    protected $vclField;
    protected $dateField;

    function __construct() {
        $this->fields = new CmbFieldSet( 'meta-row' );
        $this->vclField = $this->fields->add_field('rsrv_vcl', 'Véhicule', 'vcl-row-title', 'meta-th', 'vcl-row-content', 'meta-td');
        $this->dateField = $this->fields->add_field('rsrv_date', 'Date', 'vcl-row-title', 'meta-th', 'vcl-row-content datepicker', 'meta-td');
    }

    public function register() {
        add_action( 'add_meta_boxes', [$this, 'custom_metabox'] );
        add_action( 'save_post', [$this, 'save'] );
        add_filter( 'wp_insert_post_data' , [$this, 'modify_title'] , '99', 1 ); // Grabs the inserted post data so you can modify it.
    }

    public function custom_metabox() {

        add_meta_box(
            'rsrv_meta',
            'Réservation',
            [$this, 'render_metabox'],
            'rsrv',
            'normal',
            'core'
        );
    }

    public function modify_title( $data ) {
        if( $data['post_type'] == 'rsrv') {
            $title = null;
            if( isset( $_POST[ $this->vclField->get_id() ] ) ) {
                $title = $_POST[  $this->vclField->get_id() ];
            }
            if( isset( $_POST[ $this->dateField->get_id() ] ) ) {
                $title = $title . " " . $_POST[  $this->dateField->get_id() ];
            }
            if( $title != null ) {
                $data['post_title'] = $title;
            }
        }
        return $data;
    }

    public function render_metabox( $post ) {
        wp_nonce_field( basename( __FILE__ ), 'sl_rsrv_nonce' );
        $stored_meta = get_post_meta( $post->ID );
        ?>

        <div>
            <div class="meta-row">
                <div class="meta-th">
                    <label for="post_title" class="vcl-row-title">Titre</label>
                </div>
                <div class="meta-td">
                    <input type="text" name="post_title" id="title" class="vcl-row-content" readonly value="<?php echo $post->post_title; ?>"/>
                </div>
            </div>

            <?php $this->fields->echo_fields( $stored_meta ); ?>
            <div class="meta">
                <div class="meta-th"/>
                    <span>Remarques</span>
                </div>
            </div>
            <div class="meta-editor">
                <?php
                    $content = get_post_meta( $post->ID, 'rsrv_remarques', true );
                    $editor = 'rsrv_remarques';
                    $settings = [
                        'textarea_rows' => 8,
                        'media-buttons' => true
                    ];
                    wp_editor( $content, $editor, $settings );
                ?>
            </div>
        </div>
        <?php
    }

    public function save( $post_id ) {

        // checks save status
        $is_autosave = wp_is_post_autosave( $post_id );
        $is_revision = wp_is_post_revision( $post_id );
        $is_valid_nonce = ( isset( $_POST[ 'sl_rsrv_nonce' ] ) && wp_verify_nonce( $_POST[ 'sl_rsrv_nonce' ], basename( __FILE__ ) ) ) ? 'true' : 'false';
        if ( $is_autosave || $is_revision || !$is_valid_nonce ) {
            return;
        }

        $this->fields->save( $post_id );
        if( isset( $_POST['rsrv_remarques'] ) ) {
            update_post_meta( $post_id, 'rsrv_remarques', sanitize_text_field( $_POST['rsrv_remarques'] ) );
        }
    }
}

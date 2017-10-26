<?php
/**
 * @package SlPlugin
 */

namespace Inc\Base\Vcl;

class VehiculeCmb {

    public function register() {
        add_action( 'add_meta_boxes', [$this, 'custom_metabox'] );
        add_action( 'save_post', [$this, 'save'] );
    }

    public function custom_metabox() {

        add_meta_box(
            'vcl_marque',
            'Marque',
            [$this, 'render_metabox'],
            'vcl',
            'normal',
            'high'
        );
    }

    public function render_metabox( $post ) {
        wp_nonce_field( basename( __FILE__ ), 'sl_vcl_nonce' );
        $stored_meta = get_post_meta( $post->ID );
        ?>
        <div>
            <div class="meta-row">
                <div class="meta-th">
                    <label for="vcl-title" class="vcl-title">Title</label>
                </div>
                <div class="meta-td">
                    <input type="text" name="vcl-title" id="vcl-title" readonly value="<?php echo $post->post_title; ?>"/>
                </div>
            </div>
        </div>
        <div>
            <div class="meta-row">
                <div class="meta-th">
                    <label for="vcl-marque" class="vcl-row-marque">Marque</label>
                </div>
                <div class="meta-td">
                    <input type="text" name="vcl-marque" id="vcl-marque" value="<?php $this->echo_field( $stored_meta, 'vcl-marque' ); ?>"/>
                </div>
            </div>
        </div>
        <div>
            <div class="meta-row">
                <div class="meta-th">
                    <label for="vcl-marque" class="vcl-row-modele">Modèle</label>
                </div>
                <div class="meta-td">
                    <input type="text" name="vcl-modele" id="vcl-modele" value=""/>
                </div>
            </div>
        </div>
        <div>
            <div class="meta-row">
                <div class="meta-th">
                    <label for="vcl-version" class="vcl-row-version">Version</label>
                </div>
                <div class="meta-td">
                    <input type="text" name="vcl-version" id="vcl-version" value=""/>
                </div>
            </div>
        </div>
        <div>
            <div class="meta-row">
                <div class="meta-th">
                    <label for="vcl-date-imm" class="vcl-row-date_imm">Date d'immatriculation</label>
                </div>
                <div class="meta-td">
                    <input type="text" name="vcl-date-imm" id="vcl-date-imm" value=""/>
                </div>
            </div>
        </div>
        <div class="meta">
            <div class="meta-th"/>
                <span>Remarques</span>
            </div>
        </div>
        <div class="meta-editor">
        <?php
            $content = get_post_meta( $post->ID, 'remarques', true );
            $editor = 'remarques';
            $settings = [
                'textarea_rows' => 8,
                'media-buttons' => true
            ];
            wp_editor( $content, $editor, $settings );
        ?>
        </div>
        <?php
    }

    public function save( $post_id ) {

        // checks save status
        $is_autosave = wp_is_post_autosave( $post_id );
        $is_revision = wp_is_post_revision( $post_id );
        $is_valid_nonce = ( isset( $_POST[ 'sl_vcl_nonce' ] ) && wp_verify_nonce( $_POST[ 'sl_vcl_nonce' ], basename( __FILE__ ) ) ) ? 'true' : 'false';
        if ( $is_autosave || $is_revision || !$is_valid_nonce ) {
            return;
        }

        $this->update_field( $post_id, 'vcl-marque' );

        $title = null;
        if( isset( $_POST[ 'vcl-marque' ] ) ) {
            $title = $_POST[ 'vcl-marque' ];
        }
//        if( $title != null ) {
            update_post_meta( $post_id, 'post_title', sanitize_text_field( 'title' ) );
//        }
    }

    protected function echo_field( $meta, $field_id ) {
        if( !empty( $meta[ $field_id ] ) ) echo esc_attr( $meta[ $field_id ][0] );
    }

    protected function update_field( $post_id, $field_id ) {
        if( isset( $_POST[ $field_id ] ) ) {
            update_post_meta( $post_id, $field_id, sanitize_text_field( $_POST[ $field_id ] ) );
        }
    }
}

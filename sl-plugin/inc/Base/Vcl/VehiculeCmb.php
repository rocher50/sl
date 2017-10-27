<?php
/**
 * @package SlPlugin
 */

namespace Inc\Base\Vcl;

class VehiculeCmb {

    protected $marqueField;
    protected $modeleField;
    protected $versionField;
    protected $fields;

    function __construct() {
        $this->fields = new CmbFieldSet( 'meta-row' );
        $this->marqueField = $this->fields->add_field('vcl_marque', 'Marque', 'vcl-row-marque', 'meta-th', 'meta-td');
        $this->modeleField = $this->fields->add_field('vcl_modele', 'Modèle', 'vcl-row-modele', 'meta-th', 'meta-td');
        $this->versionField = $this->fields->add_field('vcl_version', 'Version', 'vcl-row-version', 'meta-th', 'meta-td');
    }

    public function register() {
        add_action( 'add_meta_boxes', [$this, 'custom_metabox'] );
        add_action( 'save_post', [$this, 'save'] );
        add_filter( 'wp_insert_post_data' , [$this, 'modify_title'] , '99', 1 ); // Grabs the inserted post data so you can modify it.
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

    public function modify_title( $data ) {
        if( $data['post_type'] == 'vcl') {
            if( isset( $_POST[ $this->marqueField->get_id() ] ) ) {
                $title = $_POST[  $this->marqueField->get_id() ];
            }
            if( isset( $_POST[ $this->modeleField->get_id() ] ) ) {
                $title = $title . " " . $_POST[  $this->modeleField->get_id() ];
            }
            if( isset( $_POST[ $this->versionField->get_id() ] ) ) {
                $title = $title . " " . $_POST[  $this->versionField->get_id() ];
            }
            $data['post_title'] = $title;
        }
        return $data;
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
                    <input type="text" name="post_title" id="title" readonly value="<?php echo $post->post_title; ?>"/>
                </div>
            </div>
        </div>

        <?php $this->fields->echo_fields( $stored_meta ); ?>

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

        $this->fields->save( $post_id );
    }
}

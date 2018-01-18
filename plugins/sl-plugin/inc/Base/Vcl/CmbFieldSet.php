<?php
/**
 * @package SlPlugin
 */

namespace Inc\Base\Vcl;

class CmbFieldSet {

    protected $fields = array();
    protected $div_field_class;

    public function __construct( $div_field_class ) {
        $this->div_field_class = $div_field_class;
    }

    public function add_field(string $id, $label, $labelClass, $divLabelClass, $inputClass, $divInputClass) {
        $field = new CmbField( $id, $label, $labelClass, $divLabelClass, $inputClass, $divInputClass );
        array_push($this->fields, $field);
        return $field;
    }

    public function save( $post_id ) {
        foreach ( $this->fields as $field ) {
            $field->update_field( $post_id );
        }
    }

    public function echo_fields( $meta ) {
        foreach ( $this->fields as $field ) {
            $this->echo_field( $field, $meta );
        }
    }

    protected function echo_field( $field, $meta ) {
        ?>
            <div class="<?php echo $this->div_field_class; ?>">
                <?php $field->echo_labeled_input( $meta ); ?>
            </div>
        <?php
    }
}


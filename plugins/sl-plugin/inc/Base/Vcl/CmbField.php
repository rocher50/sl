<?php
/**
 * @package SlPlugin
 */

namespace Inc\Base\Vcl;

class CmbField {

    protected $id;
    protected $label;
    protected $labelClass;
    protected $divLabelClass;
    protected $inputClass;
    protected $divInputClass;

    function __construct(string $id, $label, $labelClass, $divLabelClass, $inputClass, $divInputClass) {
        $this->id = $id;
        $this->label = $label;
        $this->labelClass = $labelClass;
        $this->divLabelClass = $divLabelClass;
        $this->inputClass = $inputClass;
        $this->divInputClass = $divInputClass;
    }

    public function get_id() {
        return $this->id;
    }

    public function echo_labeled_input( $meta ) {
        $this->echo_label_in_div();
        $this->echo_input_in_div( $meta );
    }

    public function echo_label_in_div() {
        ?>
        <div class="<?php echo $this->divLabelClass; ?>">
            <?php $this->echo_label(); ?>
        </div>
        <?php
    }

    public function echo_label() {
        ?>
            <label for="<?php echo $this->id; ?>" class="<?php echo $this->labelClass; ?>"><?php echo $this->label; ?></label>
        <?php
    }

    public function echo_input_in_div( $meta ) {
        ?>
        <div class="<?php echo $this->divInputClass; ?>">
            <?php $this->echo_input( $meta ); ?>
        </div>
        <?php
    }

    public function echo_input( $meta ) {
        ?>
            <input type="text" name="<?php echo $this->id; ?>" id="<?php echo $this->id; ?>" class="<?php echo $this->inputClass; ?>" value="<?php $this->echo_field( $meta ); ?>"/>
        <?php
    }

    public function echo_field( $meta ) {
        if(array_key_exists($this->id, $meta)) {
            echo esc_attr( $meta[ $this->id ][0] );
        } else {
            echo $this->id . ' not present';
        }
    }

    public function update_field( $post_id ) {
        if( isset( $_POST[ $this->id ] ) ) {
            update_post_meta( $post_id, $this->id, sanitize_text_field( $_POST[ $this->id ] ) );
        }
    }
}


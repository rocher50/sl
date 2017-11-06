<?php
/**
 * The template for displaying the footer
 */
?>
   <footer>
   
		<div id="footer">

			<details class="deklaracia">

				<summary><?php _e('All rights reserved','seos-business'); ?> &copy; <?php echo get_bloginfo('name');?></summary>
			
				<a href="<?php echo esc_url( __( 'https://wordpress.org/', 'seos-business' ) ); ?>"><?php printf( __( 'Powered by %s', 'seos-business' ), 'WordPress' ); ?></a>
				
				<a href="<?php echo esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a>

				<span>  &copy; <?php echo date('Y'); ?></span> 

				<a href="<?php echo esc_url(__('http://seosthemes.com/', 'seos-business')); ?>" target="_blank"><?php _e('Seos Business by ','seos-business');?><?php _e('Seos', 'seos-business'); ?></a>

			</details>

		</div>

    </footer>
	<script type="text/javascript">

	$ = jQuery.noConflict();

			$(function(){
			  var $elems = $('.animateblock');
			  var winheight = $(window).height();
			  var fullheight = $(document).height();
			  
			  $(window).scroll(function(){
				animate_elems();
			  });
			  
			  function animate_elems() {
				wintop = $(window).scrollTop(); // calculate distance from top of window
			 
				// loop through each item to check when it animates
				$elems.each(function(){
				  $elm = $(this);
				  
				  if($elm.hasClass('animated')) { return true; } // if already animated skip to the next item
				  
				  topcoords = $elm.offset().top; // element's distance from top of page in pixels
				  
				  if(wintop > (topcoords - (winheight*.75))) {
					// animate when top of the window is 3/4 above the element
					$elm.addClass('animated');
				  }
				});
			  } // end animate_elems()
			});
	</script>
<?php wp_footer();?>

</body>

</html>

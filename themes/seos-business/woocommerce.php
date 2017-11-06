<?php get_header(); ?>

	<main id="main">

		<?php if (get_option('adsense')) : ?> <div class="adsense"><?php echo get_option('adsense'); ?></div> <?php endif; ?>

		<section class="border">

			<!-- Start dynamic -->

				<article class="woo-sb">
				
				<?php woocommerce_content(); ?>
				
				<?php edit_post_link( __( 'Edit', 'seos-business' ), '', '' ); ?>

				</article>

			<!-- End dynamic -->

		</section>

		<?php get_sidebar(); ?>

	</main>

<?php get_footer(); ?>
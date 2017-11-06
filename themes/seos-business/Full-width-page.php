<?php
/*
Template Name: Full Width
*/
?>
<?php get_header(); ?>	

	<main id="main">

		<!-- Start dynamic -->

		<?php if(have_posts()) : ?>

		<?php  while (have_posts()) : the_post(); ?>
				  
 			<article class="full-width">
			
			    <?php edit_post_link( __( 'Edit', 'seos-business' ), '', '' ); ?>

				<h1><?php the_title(); ?></h1>

					<div class="content"><?php the_content();?></div>

				<?php comments_template(); ?>
			 
			</article>

		<?php endwhile; endif; ?>

		<!-- End dynamic -->

	</main>

<?php get_footer(); ?>
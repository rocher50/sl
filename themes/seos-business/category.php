<?php
/*
* A Simple Category Template
*/
 get_header(); ?>

	<main id="main">

		<section>

		<!-- Start dynamic -->

		<?php if(have_posts()) : while (have_posts()): the_post(); ?>

		   <article  id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

			<?php edit_post_link( __( 'Edit', 'seos-business' ), '', '' ); ?>

				<h1><a href="<?php the_permalink(); ?>"><?php echo the_title(); ?></a></h1>

 					<p class="grow">

						<a href="<?php the_permalink(); ?>">

						<?php if ( has_post_thumbnail() ) { the_post_thumbnail( 'custom-size' ); } ?> 

						</a>

					</p>

			<?php the_excerpt(); ?>

		   </article>

		<?php endwhile; endif; ?>

		<!-- End dynamic -->

		<div class="nextpage"><?php seosbusiness_mb_pagination(); ?></div>

		</section>
		
<?php get_sidebar(); ?>

	</main>
	
<?php get_footer(); ?>
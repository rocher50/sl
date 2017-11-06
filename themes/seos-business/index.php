<?php get_header(); ?>

	<main id="main">

		<section>

			<!-- Start dynamic -->

			<?php if(have_posts()) :  while (have_posts()) : the_post(); ?>

		   <article  class="animateblock zoomIn" id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

				<?php edit_post_link( __( 'Edit', 'seos-business' ), '', '' ); ?>

				<h1><a href="<?php the_permalink();?>"> <?php the_title(); ?></a></h1>

					<?php if ( is_home() or is_front_page() or is_category() or is_archive()) : ?>
						<?php if ( has_post_thumbnail() ) : ?>
							<div class="img-news sb-view sb-img-effect">
								<?php the_post_thumbnail( 'custom-size' ); ?>
							</div>
						<?php endif; ?>
						
					<?php endif; ?>
					
					<?php if (is_home()) : ?>
					
						<?php the_excerpt(); else :?>

						<div class="content"><?php the_content();?></div>
					
					<?php endif; ?>				

		   </article>

			<?php endwhile; endif; ?>

			<!-- End dynamic -->

		</section>

		<?php get_sidebar(); ?>

	</main>

<?php get_footer(); ?>
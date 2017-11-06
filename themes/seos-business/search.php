<?php get_header(); ?>

	<main id="main">

		<section>

			<article  id="post-<?php the_ID(); ?>" <?php post_class(); ?> > 

				<?php if (have_posts()) : ?>

					<?php while (have_posts()) : the_post(); ?>

						<p class="blue" id="post-<?php the_ID(); ?>">

				 			<?php echo '<span>&raquo; </span>'; ?>

							<a href="<?php the_permalink(); ?>"  rel="bookmark" title="url <?php the_title(); ?>"><?php the_title(); ?></a>

						</p>
     
							<?php endwhile; ?>

								<div class="nextpage"> <?php seosbusiness_mb_pagination(); ?></div> 

						<?php else : ?>

  					<h1 class="result"><?php _e('No results found. Try again.', 'seos-business'); ?></h1>

  				<?php endif; ?>

			</article>

		</section>

	<?php get_sidebar(); ?>

	</main>

<?php get_footer(); ?>
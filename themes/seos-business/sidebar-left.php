<?php
/*
Template Name: Sidebar Left
*/
?>
<?php get_header(); ?>

	<main id="main">

		<section class="section-right">

			<article  id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

				<!-- Start dynamic -->

				<?php if(have_posts()) : while (have_posts()) : the_post(); ?>

						<?php edit_post_link( __( 'Edit', 'seos-business' ), '', '' ); ?>

						<h1><?php the_title(); ?></h1>

						<p class="img"><?php the_post_thumbnail(); ?> </p>

					<div class="content"><?php the_content();?></div>

				<?php endwhile; endif; ?>

				<!-- End dynamic -->

			</article>

		</section>

		<aside class="sidebar-left">

			<ul>

				<?php if ( ! dynamic_sidebar('left') ) : ?><?php endif; ?>

			</ul>

		</aside>

	</main>

<?php get_footer(); ?>
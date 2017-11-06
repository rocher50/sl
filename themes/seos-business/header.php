<?php
/**
 * @since Seos_Business 1.23
 */
?><!DOCTYPE html>
<!--[if IE 7]>
<html class="ie ie7" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 8]>
<html class="ie ie8" <?php language_attributes(); ?>>
<![endif]-->
<!--[if !(IE 7) & !(IE 8)]><!-->
<html <?php language_attributes(); ?>>
<!--<![endif]-->
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
 
<header>

    <div role="banner" id="header-img" style="background: url('<?php header_image(); ?>') repeat; height: 100%;" > 

        <div id="header" >
		
			<a class="site-name" href="<?php echo esc_url(home_url('/')); ?>">

				<?php if (get_theme_mod('seosbusiness_logo_setting')) : ?>

				<img class="logo" src="<?php echo esc_url(get_theme_mod('seosbusiness_logo_setting')); ?>" alt="<?php bloginfo('name'); ?>" />
				
				<?php else : ?>

				<h1><?php bloginfo('name'); ?></h1>

				<?php endif; ?>
			</a>	

			<p class="description"><?php bloginfo('description'); ?></p>

<!-- start social-media -->

			<div class="social">

				<div class="icon">

					<?php if ( get_theme_mod( 'seosbusiness_facebook' ) ) : ?>
					<a href="<?php echo esc_url( get_theme_mod( 'seosbusiness_facebook' ) ); ?>" class="fb" title="<?php echo esc_url( get_theme_mod( 'seosbusiness_facebook' ) ); ?>"></a>
					<?php endif; ?>
						
					<?php if ( get_theme_mod( 'seosbusiness_twitter' ) ) : ?>
					<a href="<?php echo esc_url( get_theme_mod( 'seosbusiness_twitter' ) ); ?>" class="tw" title="<?php echo esc_url( get_theme_mod( 'seosbusiness_twitter' ) ); ?>"></a>
					<?php endif; ?>

					<?php if ( get_theme_mod( 'seosbusiness_google' ) ) : ?>
					<a href="<?php echo esc_url( get_theme_mod( 'seosbusiness_google' ) ); ?>" class="gp" title="<?php echo esc_url( get_theme_mod( 'seosbusiness_google' ) ); ?>"></a>
					<?php endif; ?>

					<?php if ( get_theme_mod( 'seosbusiness_youtube' ) ) : ?>
					<a href="<?php echo esc_url( get_theme_mod( 'seosbusiness_youtube' ) ); ?>" class="yt" title="<?php echo esc_url( get_theme_mod( 'seosbusiness_youtube' ) ); ?>"></a>
					<?php endif; ?>	

					<?php if ( get_theme_mod( 'seosbusiness_vimeo' ) ) : ?>
					<a href="<?php echo esc_url( get_theme_mod( 'seosbusiness_vimeo' ) ); ?>" class="vi" title="<?php echo esc_url( get_theme_mod( 'seosbusiness_vimeo' ) ); ?>"></a>
					<?php endif; ?>	
						
					<?php if ( get_theme_mod( 'seosbusiness_pinterest' ) ) : ?>
					<a href="<?php echo esc_url( get_theme_mod( 'seosbusiness_pinterest' ) ); ?>" class="pi" title="<?php echo esc_url( get_theme_mod( 'seosbusiness_pinterest' ) ); ?>"></a>
					<?php endif; ?>
						
					<?php if ( get_theme_mod( 'seosbusiness_linkedin' ) ) : ?>
					<a href="<?php echo esc_url( get_theme_mod( 'seosbusiness_linkedin' ) ); ?>" class="li" title="<?php echo esc_url( get_theme_mod( 'seosbusiness_linkedin' ) ); ?>"></a>
					<?php endif; ?>

					<?php if ( get_theme_mod( 'seosbusiness_rss' ) ) : ?>
					<a href="<?php echo esc_url( get_theme_mod( 'seosbusiness_rss' ) ); ?>" class="rs" title="<?php echo esc_url( get_theme_mod( 'seosbusiness_rss' ) ); ?>"></a>
					<?php endif; ?>           
				</div>
			</div>

			<!-- end social-media -->

        </div>

	</div>

</header>

	<nav>
		<div class="nav-ico">
		
			<a href="#" id="menu-icon">	
			
				<span class="menu-button"> </span>
				
				<span class="menu-button"> </span>
				
				<span class="menu-button"> </span>
				
			</a>
			
			<?php wp_nav_menu ( array('theme_location' => 'menu-top', 'container' => '')); ?>
		 
		</div>	
		
	</nav>
	
	<?php if ( is_home () || is_front_page () ) {?>

		<div class="seos-business-home-slider" style="-webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover; background-position: 100%; background-repeat: no-repeat; background-image: url(<?php if (get_theme_mod( 'slider_img' )) :  echo get_theme_mod( 'slider_img' ); else : echo get_template_directory_uri() . '/img/home-slide.jpg'; endif; ?>);">

				<div class="home-text">
					<a href="<?php echo esc_url(get_theme_mod( 'slide_url' )); ?>">
						<?php if (get_theme_mod( 'slider_text' )) : ?>
							<p>
								<?php echo esc_html(get_theme_mod( 'slider_text' )); ?>
							</p>	
						<?php endif; ?>
					</a>
				</div>

		</div>

	<?php } ?>
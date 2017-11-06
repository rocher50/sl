<?php
/**
 * Sets up the theme and provides some helper functions. Some helper functions
 * are used in the theme as custom template tags. Others are attached to action and
 * filter hooks in WordPress to change core functionality.
 * For more information on hooks, actions, and filters, see https://codex.wordpress.org/ 
 */
 
/*********************************************************************************************************
* After Setup
**********************************************************************************************************/
if ( ! function_exists( 'seo_setup' ) ) :

function seosbusiness_setup() {

	load_theme_textdomain( 'seo', get_template_directory() . '/languages' );

	add_theme_support( 'automatic-feed-links' );

	add_theme_support( 'title-tag' );

	add_theme_support( 'post-thumbnails' );
	
	add_theme_support( 'woocommerce' );
	
	if ( ! isset( $content_width ) ) $content_width = 600;

		register_nav_menus(array(
			'menu-top' => __('Menu top', 'seos-business')
		));

	add_theme_support( 'html5', array(
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
	) );

}
endif;

add_action( 'after_setup_theme', 'seosbusiness_setup' );

/*********************************************************************************************************
* Sidebar
**********************************************************************************************************/

		function  seosbusiness_widgets_init() {
		
		register_sidebar( array(
			'id'          => ('right'),
			'name'        => __( 'Right', 'seos-business'),
			'description' => __( 'Display Right sidebar.', 'seos-business' ),
		) );

		register_sidebar( array(
			'id'          => ('left'),
			'name'        => __( 'Left', 'seos-business'),
			'description' => __( 'Display left sidebar.', 'seos-business' ),
		) );

}

		add_action( 'widgets_init', 'seosbusiness_widgets_init' );
		

/*********************************************************************************************************
* Social media option. 
**********************************************************************************************************/


if ( ! function_exists( 'seosbusiness_social' ) ) :
	function seosbusiness_social( $wp_customize ) {
 
		$wp_customize->add_section( 'seosbusiness_social_section' , array(
			'title'       => __( 'Social Media', 'seos-business' ),
			'description' => __( 'Social media buttons', 'seos-business' ),
			'priority'		=> 4,
		) );
		
		$wp_customize->add_setting( 'seosbusiness_facebook', array (
			'sanitize_callback' => 'esc_url_raw',
		) );
		
		$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'seosbusiness_facebook', array(
			'label'    => __( 'Enter your Facebook url', 'seos-business' ),
			'section'  => 'seosbusiness_social_section',
			'settings' => 'seosbusiness_facebook',
		) ) );
	
		$wp_customize->add_setting( 'seosbusiness_twitter', array (
			'sanitize_callback' => 'esc_url_raw',
		) );
		
		$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'seosbusiness_twitter', array(
			'label'    => __( 'Enter your Twitter url', 'seos-business' ),
			'section'  => 'seosbusiness_social_section',
			'settings' => 'seosbusiness_twitter',
		) ) );

		$wp_customize->add_setting( 'seosbusiness_google', array (
			'sanitize_callback' => 'esc_url_raw',
		) );
		
		$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'seosbusiness_google', array(
			'label'    => __( 'Enter your Google+ url', 'seos-business' ),
			'section'  => 'seosbusiness_social_section',
			'settings' => 'seosbusiness_google',
		) ) );

		$wp_customize->add_setting( 'seosbusiness_youtube', array (
			'sanitize_callback' => 'esc_url_raw',
		) );
		
		$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'seosbusiness_youtube', array(
			'label'    => __( 'Enter your Youtube url', 'seos-business' ),
			'section'  => 'seosbusiness_social_section',
			'settings' => 'seosbusiness_youtube',
		) ) );

		$wp_customize->add_setting( 'seosbusiness_vimeo', array (
			'sanitize_callback' => 'esc_url_raw',
		) );
		
		$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'seosbusiness_vimeo', array(
			'label'    => __( 'Enter your Vimeo url', 'seos-business' ),
			'section'  => 'seosbusiness_social_section',
			'settings' => 'seosbusiness_vimeo',
		) ) );
		
		$wp_customize->add_setting( 'seosbusiness_pinterest', array (
			'sanitize_callback' => 'esc_url_raw',
		) );
		
		$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'seosbusiness_pinterest', array(
			'label'    => __( 'Enter your Pinterest url', 'seos-business' ),
			'section'  => 'seosbusiness_social_section',
			'settings' => 'seosbusiness_pinterest',
		) ) );
		
		$wp_customize->add_setting( 'seosbusiness_linkedin', array (
			'sanitize_callback' => 'esc_url_raw',
		) );
		
		$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'seosbusiness_linkedin', array(
			'label'    => __( 'Enter your Linkedin url', 'seos-business' ),
			'section'  => 'seosbusiness_social_section',
			'settings' => 'seosbusiness_linkedin',
		) ) );

		$wp_customize->add_setting( 'seosbusiness_rss', array (
			'sanitize_callback' => 'esc_url_raw',
		) );
		
		$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'seosbusiness_rss', array(
			'label'    => __( 'Enter your RSS url', 'seos-business' ),
			'section'  => 'seosbusiness_social_section',
			'settings' => 'seosbusiness_rss',
		) ) );
								
	}
endif;
		add_action('customize_register', 'seosbusiness_social');


/*********************************************************************************************************
* Search Form
**********************************************************************************************************/


		function seosbusiness_my_search_form( $form ) {
			$form = '<form method="get" id="searchform" class="searchform" action="' . home_url( '/' ) . '" >
			<div><label class="screen-reader-text" for="s">' . __( ' ', 'seos-business') . '</label>
			<input type="text" value="' . get_search_query() . '" name="s" id="s" />
			<input type="submit" id="searchsubmit" value="'. esc_attr__( 'Search', 'seos-business' ) .'" />
			</div>
			</form>';
			return $form;
		}

		add_filter( 'get_search_form', 'seosbusiness_my_search_form' );


/*********************************************************************************************************
* Pagination. 
**********************************************************************************************************/


		if ( ! function_exists( 'seosbusiness_mb_pagination' ) ) :

		function seosbusiness_mb_pagination() {
			global $wp_query;
			$current = max( 1, get_query_var('paged') );

			$pagination_return = paginate_links( array(
				'format' => '?paged=%#%',
				'current' => $current,
				'total' => $wp_query->max_num_pages,
				'next_text' => '&raquo;',
				'prev_text' => '&laquo;'
			) );

			if ( ! empty( $pagination_return ) ) {
				echo '<div class="pagination">';
				echo '<div class="total-pages">';
				//printf( __( 'Page %1$s of %2$s', 'mystockimg' ), $current, $wp_query->max_num_pages );
				echo '</div>';
				echo $pagination_return;
				echo '</div>';
			}
		}
		endif; 

 	$seosbusiness_page = array(
		'before'           => '<p>' . __( 'Pages:', 'seos-business' ),
		'after'            => '</p>',
		'link_before'      => '',
		'link_after'       => '',
		'next_or_number'   => 'number',
		'separator'        => ' ',
		'nextpagelink'     => __( 'Next page', 'seos-business' ),
		'previouspagelink' => __( 'Previous page', 'seos-business' ),
		'pagelink'         => '%',
		'echo'             => 1
	);
 
        wp_link_pages( $seosbusiness_page);



/*********************************************************************************************************
* Load CSS
**********************************************************************************************************/


		function seosbusiness_css() {		   
				wp_enqueue_style('seosbusiness_style', get_stylesheet_uri());
				wp_enqueue_style( 'seosbusiness-animate-effect', get_template_directory_uri() . '/css/animate.css' );	
				wp_enqueue_style( 'seosbusiness-scroll-effect', get_template_directory_uri() . '/css/scroll-effect.css' );	
				
				wp_enqueue_script( 'jquery', get_template_directory_uri() . '/js/jquery-2.1.4.min.js');
				
			}

		add_action('wp_enqueue_scripts', 'seosbusiness_css');


		function seosbusiness_admin_css() {
				wp_enqueue_style( 'seosbusiness-premium', get_template_directory_uri() . '/css/premium-options.css' );
			}

		add_action('admin_enqueue_scripts', 'seosbusiness_admin_css');


/*********************************************************************************************************
* Upload logo
**********************************************************************************************************/


		function seosbusiness_upload_logo ($wp_customize) {
			$wp_customize->add_section('seosbusiness_logo_section', array(
				'title' => __('Upload Logo', 'seos-business'), // Your photo should be sized - max height 65px!
				'type' => 'option',
		'description' => 'Your photo should be sized - max height 65px!'		
			));

			$wp_customize->add_setting('seosbusiness_logo_setting', array(		
				'sanitize_callback' => 'esc_url_raw'
			));

			$wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'logo', array(
				'label' => __('Logo', 'seos-business'),
				'section' => 'seosbusiness_logo_section',
				'settings' => 'seosbusiness_logo_setting'
			)));	
		}
		add_action('customize_register', 'seosbusiness_upload_logo');

/*********************************************************************************************************
* Custom header
**********************************************************************************************************/



		$seosbusiness_custom_header_logo  = array(
			'width' => 1300,
			'height' => 183,
			'random-default' => true,
			'flex-height' => false,
			'flex-width' => false,
			'header-text' => false,
		);

		add_theme_support( 'custom-header', $seosbusiness_custom_header_logo );



/*********************************************************************************************************
* Custom Colors Customize
**********************************************************************************************************/


		function seosbusiness_colors($wp_customize) {


/********************************************
* Hover color
*********************************************/
    

		$wp_customize->add_setting('seosbusiness_hover_color', array(        
  	      'default' => '#CE0000',
		    'sanitize_callback' => 'sanitize_hex_color'
  	  ));  
	
		$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'seosbusiness_hover_color', array(
		'label' => __('Hover Color', 'seos-business'),       
  	      'section' => 'colors',
  	      'settings' => 'seosbusiness_hover_color'
  	  )));


 /********************************************
* Header Color
*********************************************/ 
 

		$wp_customize->add_setting('seosbusiness_header_color', array(         
		'default'     => '#FFFFFF',
		 'sanitize_callback' => 'sanitize_hex_color'
		)); 	

		$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'seosbusiness_header_color', array(
		'label' => __('Header Color', 'seos-business'),        
		 'section' => 'colors',
		'settings' => 'seosbusiness_header_color'
		)));


/********************************************
* Nav Hover Color
*********************************************/ 
 

		$wp_customize->add_setting('seosbusiness_nav_hover_color', array(         
		'default'     => '#2e93db',
		'sanitize_callback' => 'sanitize_hex_color'
		)); 	

		$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'seosbusiness_nav_hover_color', array(
		'label' => __('Nav Hover Color', 'seos-business'),        
		'section' => 'colors',
		'settings' => 'seosbusiness_nav_hover_color'
		)));
		
}

		add_action('customize_register', 'seosbusiness_colors');		

		function seosbusiness_customize_css() {
    ?>
		<style type="text/css">
		header, header p, header h1 {color:<?php echo htmlspecialchars(get_theme_mod('seosbusiness_header_color')); ?>;}   
		a:hover, details a:hover {color:<?php echo htmlspecialchars(get_theme_mod('seosbusiness_hover_color')); ?>;}
		nav ul li a:hover, nav ul ul li a:hover {color:<?php echo htmlspecialchars(get_theme_mod('seosbusiness_nav_hover_color')); ?>;}
		</style>
    <?php
}

		add_action('wp_head', 'seosbusiness_customize_css');


/*********************************************************************************************************
* Custom Background Color
**********************************************************************************************************/


		$custom_background = array(
			'default-color'          => '#FFFFFF',
			'wp-head-callback'       => '_custom_background_cb',
		);
		add_theme_support( 'custom-background', $custom_background );


/*********************************************************************************************************
* Excerpt
**********************************************************************************************************/


		function seosbusiness_excerpt_more( $more ) {
			return ' <br /><br /><a class="read-more" href="'. get_permalink( get_the_ID() ) . '">' . __('Read More', 'seos-business') . '</a>';
		}
			add_filter( 'excerpt_more', 'seosbusiness_excerpt_more' );

		function custom_excerpt_length( $length ) {
			return 50;
		}
		add_filter( 'excerpt_length', 'custom_excerpt_length', 999 );

/*********************************************************************************************************
* Other
**********************************************************************************************************/

		function seosbusiness_add_editor_styles() {
			add_editor_style( 'style.css' );
		}

		add_action( 'admin_init', 'seosbusiness_add_editor_styles' );


		if ( ! isset( $content_width ) ) $content_width = 880;


		function seosbusiness_google_fonts() {

			wp_enqueue_style( 'font-oswald', '//fonts.googleapis.com/css?family=Oswald:400,300,700', false, 1.0, 'screen' );

		}
		add_action( 'wp_enqueue_scripts', 'seosbusiness_google_fonts' );

		function seosbusiness_js(){
 		 if (!is_admin()){
 		   if ( is_singular() AND comments_open() AND (get_option('thread_comments') == 1))
   		   wp_enqueue_script( 'comment-reply' );
 		 }
		}
		add_action('get_header', 'seosbusiness_js');
/***********************************************************************************
 * Seos Business Buy
***********************************************************************************/

		function seos_business_support($wp_customize){
			class Seos_Business_Customize extends WP_Customize_Control {
				public function render_content() { ?>
				<div class="seos_business-info"> 
					<div class="button media-button button-primary button-large media-button-select">
						<a href="<?php echo esc_url( 'http://seosthemes.com/seos-business/' ); ?>" title="<?php esc_attr_e( 'Seos Business Buy', 'seos-business' ); ?>" target="_blank">
						<?php _e( 'Seos Business Buy Premium', 'seos-business' ); ?>
						</a>
					</div>
				</div>
				<?php
				}
			}
		}
		add_action('customize_register', 'seos_business_support');

		function customize_styles_seos_business( $input ) { ?>
			<style type="text/css">
				#customize-theme-controls #accordion-section-seos_business_buy_section .accordion-section-title,
				#customize-theme-controls #accordion-section-seos_business_buy_section > .accordion-section-title {
					background: #555555;
					color: #FFFFFF;
				}

				.seos_business-info button a {
					color: #FFFFFF;
				}	
			</style>
		<?php }
		
		add_action( 'customize_controls_print_styles', 'customize_styles_seos_business');

		if ( ! function_exists( 'seos_business_buy' ) ) :
			function seos_business_buy( $wp_customize ) {
			$wp_customize->add_section( 'seos_business_buy_section', array(
				'title'			=> __('Seos Business Buy Premium', 'seos-business'),
				'description'	=> __('	Learn more about Seos Business. ','seos-business'),
				'priority'		=> 3,
			));
			$wp_customize->add_setting( 'seos_business_setting', array(
				'capability'		=> 'edit_theme_options',
				'sanitize_callback'	=> 'wp_filter_nohtml_kses',
			));
			$wp_customize->add_control(
				new Seos_Business_Customize(
					$wp_customize,'seos_business_setting', array(
						'label'		=> __('Seos Business Buy Premium', 'seos-business'),
						'section'	=> 'seos_business_buy_section',
						'settings'	=> 'seos_business_setting',
					)
				)
			);
		}
		endif;
		 
		add_action('customize_register', 'seos_business_buy');
		
/***********************************************************************************
 * Slide option
***********************************************************************************/

if ( ! function_exists( 'seos_business_slide' ) ) :
	function seos_business_slide( $wp_customize ) {
	
		$wp_customize->add_section( 'seos_business_slider_section' , array(
			'title'       => __( 'Home Page Featured IMG', 'seos-business' ),
			'description' => __( 'Post your Title, IMG and URL. Featured IMG will appear only on your home page.', 'seos-business' ),
			'priority'		=> 3,
		) );
		
		$wp_customize->add_setting( 'slider_activate', array (
			'default' => "Activate",
			'sanitize_callback' => 'sanitize_text_field',
		) );
		
		$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'seosbusiness_deactivate', array(
					'label'		=> __( 'Activate.', 'seos-business' ),
					'section'	=> 'seos_business_slider_section',
					'settings'	=> 'slider_activate',
					'type'		=> 'select',
					'choices'	=> array
					(
						'Read More'	=> 'Activate',
						''	=> 'Deactivate'
					)
				) 
			) 
		);

		$wp_customize->add_setting( 'slider_text', array (
			'default' => __('Read More...' , 'seos-business'),
			'sanitize_callback' => 'sanitize_text_field',
		) );
		
		$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'slider_text', array(
			'label'    => __( 'Your Title Text:', 'seos-business' ),
			'section'  => 'seos_business_slider_section',
			'settings' => 'slider_text',
			'type' => 'text',
		) ) );

		$wp_customize->add_setting( 'slider_img', array (
			'sanitize_callback' => 'esc_url_raw',
            'default' => get_template_directory_uri() . '/img/home-slide.jpg',
		) );
		
		$wp_customize->add_control( 
			new WP_Customize_Image_Control( 
			$wp_customize, 
			'slider_img', 
			array(
				'label'      => __( 'Your IMG Upload:', 'seos-business' ),
				'section'    => 'seos_business_slider_section',
				'settings'   => 'slider_img',
			) ) );
			
		$wp_customize->add_setting( 'slide_url', array (
			'sanitize_callback' => 'esc_url_raw',
			'default' => '#',
		) );
		
		$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'slide_url', array(
			'label'    => __( 'Enter your slide url', 'seos-business' ),
			'section'  => 'seos_business_slider_section',
			'settings' => 'slide_url',
		) ) );	

	}
endif;
		add_action('customize_register', 'seos_business_slide');
		
/***********************************************************************************
 * Include
***********************************************************************************/

		require_once get_template_directory() . '/inc/premium-options.php';
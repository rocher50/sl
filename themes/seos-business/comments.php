<?php
/**
 * The template for displaying Comments.
 * The area of the page that contains comments and the comment form.
 */
?>
<?php

	if ( post_password_required() ) { ?>

        <p class="nocomments"><?php _e('This post is password protected. Enter the password to view comments.','seos-business'); ?></p>

		<?php return; } ?>

		<?php if ( have_comments() ) : ?>

		        <h3 id="comments">

			<?php comments_number(__('No Comment','seos-business'), __('One Comment','seos-business'), __('% Comments','seos-business') );?><?php _e(' so far:','seos-business'); ?></h3>

			<ol class="commentlist">

				<?php wp_list_comments(array('avatar_size' => 77)); ?>

			</ol>

			<?php previous_comments_link() ?>

			<?php next_comments_link() ?>

			<?php else : // this is displayed if there are no comments so far ?>

			<?php if ( ! comments_open() && ! is_page() ) : ?>

			<?php _e('Comments are closed.','seos-business'); ?>

			<?php endif; ?>

			<?php endif; ?>

		<?php if ( comments_open() ) : ?>

		<?php comment_form(); ?>

<?php endif;  ?>

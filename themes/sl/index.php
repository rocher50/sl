<?php

    get_header();

    $args = [
        'post_type' => 'vcl'
    ];
    $the_query = new WP_Query($args);

    if($the_query->have_posts()) {
        while($the_query->have_posts()) {
            $the_query->the_post(); ?>
            <article class="post">
                <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>

                <?php the_content(); ?>
            </article>
        <?php }
    } else {
        echo '<p>No content found</p>';
    }

    get_footer();
?>

<?php
function create_post_project() {
      register_post_type( 'project',
        array(
          'labels'       => array(
          'name'       => __( 'Projects' ),
          ),
          'public'       => true,
          'hierarchical' => true,
          'has_archive'  => true,
          'supports'     => array(
            'title',
            'editor',
            'excerpt',
            'thumbnail',
          ),
          'show_in_rest' => true,
          'taxonomies'   => array(
            'post_tag',
            'category',
          )
        )
      );
      register_taxonomy_for_object_type( 'category', 'project' );
      register_taxonomy_for_object_type( 'post_tag', 'project' );
}
function create_post_concept() {
      register_post_type( 'concept',
        array(
          'labels'       => array(
          'name'       => __( 'Concepts' ),
          ),
          'public'       => true,
          'hierarchical' => true,
          'has_archive'  => true,
          'supports'     => array(
            'title',
            'excerpt',
            'thumbnail',
          ),
          'show_in_rest' => true,
          'taxonomies'   => array(
            'post_tag',
            'category',
          )
        )
      );
      register_taxonomy_for_object_type( 'category', 'concept' );
      register_taxonomy_for_object_type( 'post_tag', 'concept' );
}
function create_post_news() {
      register_post_type( 'news',
        array(
          'labels'       => array(
          'name'       => __( 'News' ),
          ),
          'public'       => true,
          'hierarchical' => true,
          'has_archive'  => true,
          'supports'     => array(
            'title',
            'excerpt',
            'thumbnail',
          ),
          'show_in_rest' => true,
          'taxonomies'   => array(
            'post_tag',
            'category',
          )
        )
      );
      register_taxonomy_for_object_type( 'category', 'news' );
      register_taxonomy_for_object_type( 'post_tag', 'news' );
}

function new_size(){
  add_image_size( 'custom-medium', 1500, 1500);
}


add_action( 'init', 'new_size' );
add_theme_support( 'post-thumbnails' );
add_action( 'init', 'create_post_project' );
add_action( 'init', 'create_post_concept' );
add_action( 'init', 'create_post_news' );

ini_set('display_errors',1); error_reporting(E_ALL);

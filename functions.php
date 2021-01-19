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


// hook into rest_api_init and register a new api route

add_action( 'rest_api_init', function () {
  register_rest_route(
      'common-language/v2',   // namespace
      '/homepage',  // route
      array(                  // options
          'methods'  => 'GET',
          'callback' => 'build_home',
          'permission_callback' => '__return_true',
          // 'args'     => array(
          //     'context' => array(
          //     'default' => 'view',
          //     ),
          // )
      )
  );
});

  $arena;
  function start_up(){
    include_once(get_template_directory()."/arena/arena.php");
    $GLOBALS['arena'] = new Arena();
  }



  function get_channel($slug){
    $page = $GLOBALS['arena']->set_page(); // this checks if page is set, if not sets page to 1
    $per = 10; // how many items per page
    $newchannel=$GLOBALS['arena']->get_channel($slug, array('page' => $page, 'per' => $per));
    foreach ($newchannel->contents as $item) {
      if($item->class=="Channel"){
        // $item->contents=$item->slug;
        $item->contents=get_channel($item->slug)->contents;
      }
    }
    return $newchannel;
    // return $GLOBALS['arena']->get_channel($slug, array('page' => $page, 'per' => $per));
  }



 function build_home() {
   // include_once(get_template_directory()."/arena/arena.php");
   // $arena = new Arena();
   // $page = $arena->set_page(); // this checks if page is set, if not sets page to 1
   // $per = 8; // how many items per page
   // $slug = 'concepts-bo-6ajlvpqg'; // channel slug (e.g. http://are.na/arena-influences)
   // $channel = $arena->get_channel($slug, array('page' => $page, 'per' => $per));
   $channel=get_channel('concepts-bo-6ajlvpqg');
    ob_start();
    get_template_part('custom-home-template',null,array('channel'=>$channel));
    $data = ob_get_clean();
    return new WP_REST_Response( array(
        'html' => $data,
    ) );
}


$channel="test";

// function initialize_arena(){
//   include_once(get_template_directory()."/arena/arena.php");
//   $arena = new Arena();
//   $page = $arena->set_page(); // this checks if page is set, if not sets page to 1
//   $per = 8; // how many items per page
//   $slug = 'concepts-bo-6ajlvpqg'; // channel slug (e.g. http://are.na/arena-influences)
//   $GLOBALS['channel'] = $arena->get_channel($slug, array('page' => $page, 'per' => $per));
// }




add_action( 'init', 'new_size' );
add_theme_support( 'post-thumbnails' );
add_action( 'init', 'create_post_project' );
add_action( 'init', 'create_post_concept' );
add_action( 'init', 'create_post_news' );
add_action( 'init', 'start_up' );
// add_action( 'init', 'initialize_arena' );
ini_set('display_errors',1); error_reporting(E_ALL);

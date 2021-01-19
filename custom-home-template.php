<?php
  $channel=$args["channel"];
  // include_once(get_template_directory()."/arena/arena.php");
  // $arena = new Arena();
  // $page = $arena->set_page(); // this checks if page is set, if not sets page to 1
  // $per = 8; // how many items per page
  // $slug = 'concepts-bo-6ajlvpqg'; // channel slug (e.g. http://are.na/arena-influences)
  // $channel = $arena->get_channel($slug, array('page' => $page, 'per' => $per));

  $abstract=get_post_field('post_content',224);
  $fullprofile=get_post_field('post_content',76);
  $news=get_posts(array(
    'post_type'=> 'news'
  ));
  $newsdata=array();
  foreach ($news as $n) {
    $item=new stdClass();
    $item->title=get_the_title($n->ID);
    $item->date=get_the_date("",$n->ID);
    $item->content=get_field('more_info',$n->ID);
    array_push($newsdata,$item);
  }
  $newsdata_json=json_encode($newsdata);
?>
<?php echo $abstract; ?>
<div class="bodycontent reg-width newline-button section-start" data-section="profile">
  <span data-contentid="profile-expand" class="more-info inline-h4"></span>
</div>
<div class="accordion bodycontent newstext profile-expand">
  <?php echo $fullprofile ?>
</div>
<?php if(count($newsdata)>0){ ?>
  <div id="news-start" class="separator bodycontent">
      <svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 100 102"><path vector-effect='non-scaling-stroke' d="M0,100,20,0,70,100l30-70.07"/></svg>
  </div>
  <h2 class="sectionmarker bodycontent section-start" data-section="news">News</h2>
<?php foreach ($newsdata as $n=>$newsitem) { ?>
<h4 class='datemarker bodycontent'><?php echo $newsitem->date ?></h4>
<p class='newstext bodycontent' >
  <span class="news-title"><?php echo $newsitem->title ?></span>
<?php if(strlen($newsitem->content)>0){ ?><span data-contentid="news<?php echo $n ?>" class="more-info inline-h4"></span><?php } ?>
</p>
<?php if(strlen($newsitem->content)>0){ ?>
<div class="newstext accordion bodycontent news<?php echo $n ?>">
  <?php echo $newsitem->content ?>
</div>
<?php } ?>
<?php } } ?>

<div id="concepts-start" class="separator bodycontent">
  <svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 100 102"><path vector-effect='non-scaling-stroke' d="M0,48,30,100,80,0l20,100"/></svg>
</div>
<h2 class="sectionmarker bodycontent section-start" data-section="concepts">Concepts</h2>
<div id="concepts-box" class="bodycontent reg-width">
<?php

  function build_send($ablock){
    $send=new stdClass();
    $send->title=$ablock->title;
    $send->class=$ablock->class;

    if($ablock->class=="Image"){
      $send->image=$ablock->image;
      $send->description=$ablock->description;
    }else if($ablock->class=="Channel"){
      $send->description=$ablock->metadata["description"];
      $newcontents=array();
      foreach ($ablock->contents as $b) {
        array_push($newcontents,build_send($b));
      }
      $send->contents=$newcontents;
    }else if($ablock->class=="Attachment"){
      $send->description=$ablock->description;
      $send->attachment=$ablock->attachment["url"];
    }
    return $send;
  }

  foreach ($channel->contents as $item) {

    $send=build_send($item);
  ?>
<div class="concept-wrapper <?= strtolower( $item->class)."-arena" ?>" data-item='<?= json_encode($send) ?>' >
  <div class="concept-a-ratio"></div>
  <?php if($item->class=="Image"){?>
  <img lozad src="<?=$item->image["square"]["url"]; ?>">
<?php }else if($item->class=="Channel"){?>
  <img lozad src="<?=$item->contents[0]->image["square"]["url"]; ?>">
<?php }else if($item->class=="Attachment"){?>
  <h4><?= $item->title ?></h4>
  <?php } ?>
</div>
<?php }  ?>
</div>

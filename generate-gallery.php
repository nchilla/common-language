<?php
  $proj_imgs=$args["item"]->images;
  $proj_title=$args["item"]->title;
  $proj_id=$args["item"]->id;
  $key=$args["ind"];
  $proj_json=json_encode($proj_imgs[0]);
  $filepath=get_bloginfo('template_directory');
 ?>
<div <?php if($key==0){echo "id='visible-gallery'";} ?> class="gallery proj<?php echo $proj_id ?>">
  <?php foreach ($proj_imgs as $s => $slide) {?>
    <div class="cardgroup <?php if($s==0){echo "preview-image";} ?>">
      <div class="imgwrapper" data-ratio=<?php echo $slide->ratio ?>>
        <?php if($s==0){?>
          <div class="aspect-ratio"></div>
        <?php } ?>
        <img src="<?php if($s==0){echo $slide->large;} ?>" class="lozad <?php if($s>0){echo "img-vert-fit";} ?>">
      </div>
      <h4><span class="slide-cap"><?php echo $slide->caption ?></span><?php if($s==0){?><span class="proj-cap"><?php echo $proj_title ?></span><?php } ?></h4>
    </div>
   <?php } ?>
</div>

<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta http-equiv="Content-Type" content="text/html;" charset="utf-8" >
    <meta name="viewport" charset="UTF-8" content="width=device-width, initial-scale=1">
    <title>Common Language</title>
    <!-- styling -->
    <link rel="stylesheet" href="<?php echo get_bloginfo('template_directory'); ?>/css/clearstyle.css" type="text/css">
    <link rel="stylesheet" href="<?php echo get_bloginfo('template_directory'); ?>/css/style.css" type="text/css">
    <!-- typefaces -->
    <link rel="stylesheet" href="https://use.typekit.net/kfr0yfw.css">
    <!-- favicon stuff -->
    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo get_bloginfo('template_directory'); ?>/favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="<?php echo get_bloginfo('template_directory'); ?>/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="<?php echo get_bloginfo('template_directory'); ?>/favicon/favicon-16x16.png">
    <link rel="manifest" href="<?php echo get_bloginfo('template_directory'); ?>/favicon/site.webmanifest">

    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/lozad/dist/lozad.min.js"></script>
    <?php
      $args = array(
        'post_type'=> 'project'
      );
      $projects=get_posts($args);
      $project_slides=array();

      foreach ($projects as $p) {
        $carousel=get_field('top_carousel',$p->ID);
        $item=new stdClass();
        $item->id=$p->ID;
        $item->title=get_the_title($p->ID);
        $item->images=array();
        $item->abstract=get_field('abstract',$p->ID);
        $item->location=get_field('location',$p->ID);
        $item->date=get_the_date("",$p->ID);
        $item->fetch=false;
        foreach($carousel as $i){
          $full=wp_get_attachment_image_src( $i->ID, 'full');
          $attachment=new stdClass();
          $attachment->full=$full[0];
          $attachment->large=wp_get_attachment_image_src( $i->ID, 'large')[0];
          $attachment->mediumlarge=wp_get_attachment_image_src( $i->ID, 'custom-medium')[0];
          $attachment->ratio=$full[1]/$full[2];
          $attachment->caption=get_the_title($i->ID);
          array_push($item->images,$attachment);
        }
        array_push($project_slides, $item);
      };
      $project_slides_json=json_encode($project_slides);
     ?>
  </head>
  <script type="text/javascript">
    var projects=<?php echo $project_slides_json ?>;
  </script>
  <body class='nosquish'>
    <div id='scrollcontent'>
      <div id='nav-dropdown'>
        <div id="dropper" class='noselect'>
          <h2>menu</h2>
          <svg class='dot' viewBox="0 0 10 10" preserveAspectRatio="none">
            <circle cx="5" cy="5" r="4.7"/>
          </svg>
        </div>
        <div id='sectionlinks'>
          <div data-which='projects' class="h-sectlink noselect">
            <h2>projects</h2>
            <svg class='dot' viewBox="0 0 10 10" preserveAspectRatio="none">
              <circle cx="5" cy="5" r="4.7"/>
            </svg>
          </div>
          <div data-which='profile' class="h-sectlink noselect">
            <h2>profile</h2>
            <svg class='dot' viewBox="0 0 10 10" preserveAspectRatio="none">
              <circle cx="5" cy="5" r="4.7"/>
            </svg>
          </div>
          <div data-which='news' class="h-sectlink noselect">
            <h2>news</h2>
            <svg class='dot' viewBox="0 0 10 10" preserveAspectRatio="none">
              <circle cx="5" cy="5" r="4.7"/>
            </svg>
          </div>
          <div data-which='concepts' class="h-sectlink noselect">
            <h2>concepts</h2>
            <svg class='dot' viewBox="0 0 10 10" preserveAspectRatio="none">
              <circle cx="5" cy="5" r="4.7"/>
            </svg>
          </div>
        </div>
      </div>
      <div id='sizereference'></div>
      <div id='cover'>
        <div id="project-list">

        </div>

        <?php
        foreach ($project_slides as $i=>$proj) {
          get_template_part('generate-gallery',null,array('item'=>$proj,'ind'=>$i));
        }

         ?>
      </div>
      <h1 class='bodycontent'>Common Language</h1>
      <h2 class='bodycontent'>
        We explore the intersection between Architecture and Music. Both involve the creative use and misuse of rhythm, texture, harmony, pattern, proportion, and dynamics. <br><br>Our fundamental goal is to investigate this relationship through a collaborative making process that constantly re-defines the role of architecture.
      </h2>
      <div class="separator bodycontent">
          <svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 100 102"><path vector-effect='non-scaling-stroke' d="M0,100,20,0,70,100l30-70.07"/></svg>
      </div>
      <h2 class='sectionmarker bodycontent'>News</h2>
      <h4 class='datemarker bodycontent'>November 15, 2020</h4>
      <p class='newstext bodycontent'>Justin Sherrill was featured on the Parsons School of Constructed Environments blog</p>
      <h4 class='datemarker bodycontent'>October 10, 2020</h4>
      <p class='newstext bodycontent'>Our mixed-use residential complex design won second place in New Den-cities competition</p>

      <div class="separator bodycontent">
        <svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 100 102"><path vector-effect='non-scaling-stroke' d="M0,48,30,100,80,0l20,100"/></svg>
      </div>
    </div>
    <div id='fixedcontent' class="page-grid">
      <div id="horizontal-nav">
        <div id="sunbox-h">
          <svg class='sunsvg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5375.26 5375.26"><g class='dotgroup'><g id="rotate"><g id="dots"><circle cx="1497.05" cy="2688.07" r="119.09"/><circle cx="2137.13" cy="2688.07" r="119.09"/><circle cx="2777.21" cy="2688.07" r="119.09"/><circle cx="3417.29" cy="2688.07" r="119.09"/><circle cx="4057.37" cy="2688.07" r="119.09"/><circle cx="4697.44" cy="2688.07" r="119.09"/></g><rect class="svgframe" class="cls-1" x="-0.37" y="-0.37" width="5376" height="5376"/></g></g><g class="sungroup"><circle class="sun" vector-effect='non-scaling-stroke' cx="2687.86" cy="2688.07" r="555.72"/></g>
          </svg>
        </div>
      </div>
      <div id='vertical-nav'>
          <div id="sunbox-v" data-which='home' class='viewing nav-item'>
            <svg class='sunsvg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5375.26 5375.26"><g class='dotgroup'><g id="rotate"><g id="dots"><circle cx="1497.05" cy="2688.07" r="119.09"/><circle cx="2137.13" cy="2688.07" r="119.09"/><circle cx="2777.21" cy="2688.07" r="119.09"/><circle cx="3417.29" cy="2688.07" r="119.09"/><circle cx="4057.37" cy="2688.07" r="119.09"/><circle cx="4697.44" cy="2688.07" r="119.09"/></g><rect class="svgframe" class="cls-1" x="-0.37" y="-0.37" width="5376" height="5376"/></g></g><g class="sungroup"><circle class="sun" vector-effect='non-scaling-stroke' cx="2687.86" cy="2688.07" r="555.72"/></g>
            </svg>
          </div>
          <div id='navwrap'>
          <div data-which='projects' class="section-link nav-item">
            <svg class='sunsvg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5375.26 5375.26"><g class='dotgroup'><g id="rotate"><g id="dots"><circle cx="1497.05" cy="2688.07" r="119.09"/><circle cx="2137.13" cy="2688.07" r="119.09"/><circle cx="2777.21" cy="2688.07" r="119.09"/><circle cx="3417.29" cy="2688.07" r="119.09"/><circle cx="4057.37" cy="2688.07" r="119.09"/><circle cx="4697.44" cy="2688.07" r="119.09"/></g><rect class="svgframe" class="cls-1" x="-0.37" y="-0.37" width="5376" height="5376"/></g></g><g class="sungroup"><circle class="sun" vector-effect='non-scaling-stroke' cx="2687.86" cy="2688.07" r="555.72"/></g>
            </svg>
            <h2>projects</h2>
          </div>
          <div data-which='profile' class="section-link nav-item">
            <svg class='sunsvg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5375.26 5375.26"><g class='dotgroup'><g id="rotate"><g id="dots"><circle cx="1497.05" cy="2688.07" r="119.09"/><circle cx="2137.13" cy="2688.07" r="119.09"/><circle cx="2777.21" cy="2688.07" r="119.09"/><circle cx="3417.29" cy="2688.07" r="119.09"/><circle cx="4057.37" cy="2688.07" r="119.09"/><circle cx="4697.44" cy="2688.07" r="119.09"/></g><rect class="svgframe" class="cls-1" x="-0.37" y="-0.37" width="5376" height="5376"/></g></g><g class="sungroup"><circle class="sun" vector-effect='non-scaling-stroke' cx="2687.86" cy="2688.07" r="555.72"/></g>
            </svg>
            <h2>profile</h2>
          </div>
          <div data-which='news' class="section-link nav-item">
            <svg class='sunsvg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5375.26 5375.26"><g class='dotgroup'><g id="rotate"><g id="dots"><circle cx="1497.05" cy="2688.07" r="119.09"/><circle cx="2137.13" cy="2688.07" r="119.09"/><circle cx="2777.21" cy="2688.07" r="119.09"/><circle cx="3417.29" cy="2688.07" r="119.09"/><circle cx="4057.37" cy="2688.07" r="119.09"/><circle cx="4697.44" cy="2688.07" r="119.09"/></g><rect class="svgframe" class="cls-1" x="-0.37" y="-0.37" width="5376" height="5376"/></g></g><g class="sungroup"><circle class="sun" vector-effect='non-scaling-stroke' cx="2687.86" cy="2688.07" r="555.72"/></g>
            </svg>
            <h2>news</h2>
          </div>
          <div data-which='concepts' class="section-link nav-item">
            <svg class='sunsvg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5375.26 5375.26"><g class='dotgroup'><g id="rotate"><g id="dots"><circle cx="1497.05" cy="2688.07" r="119.09"/><circle cx="2137.13" cy="2688.07" r="119.09"/><circle cx="2777.21" cy="2688.07" r="119.09"/><circle cx="3417.29" cy="2688.07" r="119.09"/><circle cx="4057.37" cy="2688.07" r="119.09"/><circle cx="4697.44" cy="2688.07" r="119.09"/></g><rect class="svgframe" class="cls-1" x="-0.37" y="-0.37" width="5376" height="5376"/></g></g><g class="sungroup"><circle class="sun" vector-effect='non-scaling-stroke' cx="2687.86" cy="2688.07" r="555.72"/></g>
            </svg>
            <h2>concepts</h2>
          </div>
        </div>
      </div>
    </div>
    <svg style="display:none;" height='100%' width='100%'>
      <defs>
        <filter width="100%" height="100%" x="0%" y="0%" id="noise">
          <feTurbulence type="turbulence" baseFrequency="1.1 1.1" numOctaves="5" result="turbulence"/>
          <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="1" xChannelSelector="R" yChannelSelector="G"/>
          <feComposite in='turbulence' in2='wave' operator='arithmetic' k1='1' k2='0' k3='0.7' k4='0'></feComposite>
          <!-- <feTurbulence result='turbulence' type='turbulence' seed='1' numOctaves='5' baseFrequency='1.1 1.1' height='100%' width='100%'></feTurbulence> -->
          <!-- <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="1" xChannelSelector="R" yChannelSelector="R"></feDisplacementMap>
          <feComposite in='turbulence' in2='wave' operator='arithmetic' k1='1' k2='0' k3='0.7' k4='0'></feComposite> -->
        </filter>
      </defs>
    </svg>
    <script src="<?php echo get_bloginfo('template_directory'); ?>/js/smoothscroll.min.js"></script>
    <script src="<?php echo get_bloginfo('template_directory'); ?>/js/d3.min.js"></script>
    <script src="<?php echo get_bloginfo('template_directory'); ?>/js/function.js"></script>
  </body>
</html>

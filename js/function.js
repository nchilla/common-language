
//content variables
var page='home';
var imgRatio=5/3;
let homecontent={
  title:"Common Language",
  abstract:false,
  fetch:false
}



// DOM variables
const scroller = scrollama();
let carouselCounter=1;
let navPos;
let projectView=false;

let pause={status:false,target:null};


//DOM related variables
var root=document.documentElement;
var windowsize={hor:0,vert:0};
var navWrapDist=document.querySelector('.section-link:last-child').getBoundingClientRect().left;
var viewing=d3.select('.viewing');
var dropdown=false;

//gets everything started!
function startUp(){
  whichPage();
  setTimeout(setSizing,50);
  setTimeout(resetSectionHeight,500);
  navSetUp();
  projectGalleryGenerator();
}


//on startup, sets variables and orients DOM based on what page you loaded in.
//will need editing once page is accessible through post template
function whichPage(){

  if(page=='home'){
    d3.select('#visible-gallery').classed('selected',false);
    d3.select('#cover').classed('project',false);
    projectView=false;
    homeSetUp();
  }else{
    d3.select('#visible-gallery').classed('selected',true);
    d3.select('#cover').classed('project',true);
    projectView=true;
  }

}

function homeSetUp(){
  d3.selectAll('#scrollcontent>h2').classed('bodycontent',true);
  d3.selectAll('.more-info').on('click',function(){expandItem(event);});
  document.querySelectorAll('.concept-wrapper').forEach((item, i) => {
    let rotation=5+Math.random()*15;
    rotation=rotation*(Math.random()>0.5?1:-1);
    item.style.setProperty('--rotate-amount', rotation+'deg');
    console.log(JSON.parse(item.dataset.item));
  });

  observing();
}

// animate display of hidden accordion itm
function expandItem(event){
  let trigger=event.currentTarget;
  let parent=d3.select(trigger.parentNode);
  let targetId='.'+trigger.dataset.contentid;
  if(parent.classed('opened')){
    d3.selectAll(targetId).classed('expanded',false);
    parent.classed('opened',false);
  }else{
    d3.selectAll(targetId).classed('expanded',true);
    parent.classed('opened',true);
  }
}





//builds all the project galleries and also the project list
function projectGalleryGenerator(){
  let pList=d3.select('#project-list');
  projects.forEach((item, i) => {
    var projSelect=d3.select('.proj'+item.id);
    projSelect.datum(item);
    for(var x=0;x<item.images.length;x++){
      var imgSelect=projSelect.select('img:nth-of-type('+(x+1)+')');
      imgSelect.datum(item.images[x]);
      if(x>0){
        imgSelect.style('opacity',0);
        imgSelect.style('transition','opacity 0.3s');
        imgSelect.on('load',function(){d3.select(event.currentTarget).style('opacity',1);});
      }
    }
    var theYear=item.date.slice(item.date.length-4,item.date.length);
    pList.append('h2').html(item.title+' • '+theYear).datum(item).on('click',function(){
      projectView=true;
      let datum=d3.select(event.currentTarget).datum();
      let theProject=d3.selectAll('.gallery').filter((d, i) => d.id==datum.id);
      d3.selectAll('#visible-gallery').attr('id','');
      theProject.attr('id','visible-gallery');
      imgSizing();
      setTimeout(function () {
        handleListClose();
        projectTransition(theProject);
        changeToProject(theProject.datum());
      },150);

    });

  });

  setInterval(function () {
    if(projectView==false){
      d3.selectAll('.gallery').attr('id','');
      d3.select('.proj'+projects[carouselCounter].id).attr('id','visible-gallery');
      imgSizing();
      carouselCounter=(carouselCounter==projects.length-1)?0:(carouselCounter+1);
    }
  }, 6000);

  galleries=d3.selectAll('.gallery')
  galleries.on('click',function(){
    var currentTarg=d3.select(event.currentTarget)
    if(d3.select('#cover').attr('class')=='list'){
      handleListClose();
    }else{
      galleries.classed('temporary-animation',false);
      projectTransition(currentTarg);
      changeToProject(currentTarg.datum());
    }
  });
}

//closes the project list view
function handleListClose(){
  switch(page){
    case 'home':
    d3.select('#cover').attr('class','');
    break;
    case 'project':
    d3.select('#cover').attr('class','project');
    break;
  }
  if(viewing.node().dataset.which=='home'){
    viewing.classed('viewing',false);
    viewing=d3.select('#sunbox-v');
    viewing.classed('viewing',true);
  }
}

//transitions cover section for a particular project gallery
function projectTransition(currentTarg){
  currentTarg.selectAll('img').each(function(d,i){
    this.src=currentTarg.datum().images[i].large;
  })
  currentTarg.classed('selected',true);
  d3.select('#cover').classed('project',true);
  projectView=true;
  page='project';
}

//decides whether data needs fetching and rebuilds body for project
function changeToProject(project,destination){
  d3.selectAll('.bodycontent').style('opacity',0);
  if(project.fetch!==false){
    changeBodyContent(project,destination);
  }else{
    postRequest(project,destination);
  }
}





//rebuilds body with content from a given project
function changeBodyContent(project,destination){
  setTimeout(function () {
    d3.select('h1').text(project.title);
    d3.selectAll('.bodycontent:not(h1)').remove();
    if(project.abstract!==false){
      scroller.destroy();
      viewing.classed('viewing',false);
      viewing=d3.select('#sunbox-v');
      viewing.classed('viewing',true);
      d3.select('#scrollcontent').append('h2').attr('class','bodycontent').html(`${project.abstract} • ${project.location}`);
    }
    document.querySelector('#scrollcontent').insertAdjacentHTML('beforeend', project.fetch);
    d3.select('#scrollcontent').selectAll('p:not(.newstext)').attr('class','bodycontent');
    if(project.abstract==false){homeSetUp();};
  }, 150);

    setTimeout(function () {
    d3.selectAll('.bodycontent').style('opacity',1);
    if(destination!==undefined){
      leScroll(destination);
    }
  }, 300);

}

//fetches content for a given project, puts it in JSON entry, and triggers function to rebuild body
function postRequest(project,destination){
  function reqListener () {
    var jsonResponse=JSON.parse(this.responseText);
    if(project.abstract==false){
      homecontent.fetch=jsonResponse.html;
    }else{
      // var jsonResponse=JSON.parse(this.responseText);
      projects.filter(item=>item.id==project.id)[0].fetch=jsonResponse.content.rendered;
    }
    // console.log(projects.filter(item=>item.id==project.id)[0]);
    changeBodyContent(project,destination);
  }
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  let fetchurl;
  if(project.abstract==false){
    fetchurl="/wp-json/common-language/v2/homepage";
  }else{
    fetchurl="/wp-json/wp/v2/project/"+project.id;
  }
  oReq.open("GET", fetchurl);
  oReq.send();
}






//checks if site is on a device with hover capability
function isHover(){
  if(window.matchMedia('(hover:hover)').matches){
    return true;
  }else{
    return false;
  }
}

//checks if the page is at a certain sizing ratio that requires special sizing controls
function checkForCover(){
  var matches=window.matchMedia('(min-aspect-ratio: 11/8) and (min-width:700px)').matches;
  if(matches){
    return true;
  }else{
    return false;
  }
}



//sets up nav
function navSetUp(){
  var items=d3.selectAll('.nav-item')
  if(isHover()){
    items.on('mouseover',function(){
      viewing.classed('viewing',false);
    })
    items.on('mouseleave',function(){
      viewing.classed('viewing',true);
    })
  }
  items.on('click',function(event){
    viewing.classed('viewing',false);
    viewing=d3.select(d3.event.currentTarget);
    var whichOne=viewing.node().dataset.which;
    handleSectionChange(whichOne);
    viewing.classed('viewing',true);
  })

  window.addEventListener('mousemove',function(event){
    yCoord=event.clientY;
    xCoord=event.clientX;
    var angle=Math.atan(yCoord/xCoord);
    if(angle>Math.PI/4.5){
      angle=Math.PI/4.5;
    }
    d3.select('#sunbox-v').select('.sunsvg').style('transform',`rotate(${angle}rad)`)
  })

  d3.select('#dropper').on('click',function(){
    if(dropdown==false){
      d3.select('#dropper').select('h2').text('close')
      d3.select('#nav-dropdown').style('height','250px');
      dropdown=true;
    }else{
      d3.select('#dropper').select('h2').text('menu')
      d3.select('#nav-dropdown').style('height','81px');
      dropdown=false;
    }

  })


}

//transitions page when you click on a section
function handleSectionChange(which){
  switch(which){
    case 'projects':
      d3.select('#cover').attr('class','list');
      pause.status=true;
      pause.target='home';
      window.scrollTo({top: 0,left: 0,behavior: 'smooth'});
    break;
    case 'home':
    if(d3.select('#cover').attr('class')=='list'){
      handleListClose();
    }else{
      goHome();
    }
    break;
    case 'profile':
      goHome('profile');
    break;
    case 'news':
      goHome('news');
    break;
    case 'concepts':
      goHome('concepts');
    break;
    default:
      console.log('nothing to see here');
  }
}

//transition to home content
function goHome(destination){
  // document.querySelector('#visible-gallery').scrollTo({top: 0,left: 0,behavior: 'smooth'});
  // projectTransition(currentTarg);
  if(d3.select('#cover').attr('class')=='list'){
    handleListClose();
  }

  let galleries=d3.selectAll('.gallery')
  if(page!=='home'){
    changeToProject(homecontent,destination);
    galleries.classed('temporary-animation',true);
    setTimeout(function () {
      galleries.classed('temporary-animation',false);
      projectView=false;
    }, 300);
  }else{
    leScroll(destination);
    projectView=false;
  }

  galleries.classed('selected',false);
  d3.select('#cover').classed('project',false);
  page='home';
  // projectView=false;
}

function leScroll(destination){
  if(destination!==undefined){
    var scrollOpt={behavior:'smooth',block:'start'};
    pause.status=true;
    pause.target=destination;
    document.querySelector('#'+destination+'-start').scrollIntoView(scrollOpt);
  }else{
    window.scrollTo({top: 0,left: 0,behavior: 'smooth'});
  }
}

//all sizing adjustments compiled for startup and resize
function setSizing(){
  resetSectionHeight()
  navWrapJust();
  imgSizing();
  if(window.matchMedia('(min-width:700px)').matches){
    checkNavEdge();
    squishPos=document.querySelector('h1').getBoundingClientRect().left;
    root.style.setProperty('--squish-pos', squishPos+'px');
  }else{
    root.style.setProperty('--squish-pos', "calc(var(--omargin) + 10px)");
  }
}

//records right edge of vertical nav in variable for reference by other functions
function checkNavEdge(){
  navPos=document.querySelector('#vertical-nav').getBoundingClientRect().right;
}

//checks if mouse is hovering over vertical nav and brings it forward if necessary
window.addEventListener('mousemove',checkMouseLoc);
function checkMouseLoc(){
  if(event.clientX<navPos){
    root.style.setProperty('--nav-z', 15);
  }else{
    root.style.setProperty('--nav-z', 5);
  }
}

//dynamic sizing adjustments for cover section and galleries
function imgSizing(){
  //width for wrapper
  var percentage=document.querySelector('#sizereference').getBoundingClientRect().width / window.innerWidth*100;
  percentage=percentage.toFixed(2);
  root.style.setProperty('--imgwidth', percentage+'vw');

  //image itself:horizontal or vertical fitting
  var wrapper=document.querySelector('#visible-gallery').querySelectorAll('.imgwrapper')[0];
  var container=window.getComputedStyle(wrapper);
  var containerRatio=parseComp(container.width)/parseComp(container.height);
  var dynImgRatio=wrapper.dataset.ratio;
  var gal=d3.select('#visible-gallery');

  if(containerRatio>dynImgRatio){
    //fit to width
    gal.select('.preview-image').select('img').attr('class','img-hor-fit');
  }else{
    //fit to height
    gal.select('.preview-image').select('img').attr('class','img-vert-fit');
  }
  if(checkForCover()==false){
    var ratioHeight=window.getComputedStyle(document.querySelector('#visible-gallery').querySelectorAll('.aspect-ratio')[0]).paddingBottom;
    root.style.setProperty('--ratio-height', ratioHeight);
  }else{

  }

}

//sizing adjustment for vertical navbar
function resetSectionHeight(){
  document.querySelectorAll('.section-link').forEach((el, i) => {
    var orbHeight=0;
    var h2Height=window.getComputedStyle(d3.select(el).select('h2').node()).width;
    h2Height=parseComp(h2Height);
    d3.select(el).style('min-height',h2Height+orbHeight+'px');
  });
}

//parses a computed style in px as an integer
function parseComp(string){
  return parseInt(string.replace('px',''));
}

//determines arrangement of section links in nav bar
function navWrapJust(){
  if(window.matchMedia('(min-width:700px)').matches){
    firstDist=document.querySelector('.section-link:first-child').getBoundingClientRect().left;
    newDist=document.querySelector('.section-link:last-child').getBoundingClientRect().left;
    if(firstDist!==newDist){
      if(newDist>firstDist){
        d3.select('#navwrap').style('justify-content','flex-end');
        d3.select('body').attr('class','squish');
      }else{
        d3.select('#navwrap').style('justify-content','space-between');
        d3.select('body').attr('class','nosquish');
      }
    }else{
      d3.select('#navwrap').style('justify-content','space-between');
      d3.select('body').attr('class','nosquish');
    }
  }//end of matchmedia if statement

}

//detects position on page and changes section accordingly
function observing(){
  let offset=getComputedStyle(root).getPropertyValue('--scroll-offset');
  // offset=window.innerHeight - offset;
  // offset=offset+'px';

  scroller.destroy();
  scroller
    .setup({
      step: ".section-start",
      offset:offset
    })
    .onStepEnter((response) => {
      var el=d3.select(response.element);
      let which=response.element.dataset.section;
      if(pause.status==true){
        if(which==pause.target){
          pause.status=false;
        }
      }else{
        viewing.classed('viewing',false);
        viewing=d3.selectAll('.nav-item').filter((d, i,nodes)=>nodes[i].dataset.which==which)
        viewing.classed('viewing',true);
      }

    })
  window.addEventListener("resize", observing);
}



window.addEventListener('resize',setSizing);
window.addEventListener('DOMContentLoaded',startUp);

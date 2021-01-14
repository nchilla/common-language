//content variables
var page='home';
var imgRatio=5/3;


// DOM variables
let carouselCounter=1;
let navPos;
let projectView=false;


//DOM related variables
var root=document.documentElement;
var windowsize={hor:0,vert:0};
var navWrapDist=document.querySelector('.section-link:last-child').getBoundingClientRect().left;
var viewing=d3.select('.viewing');
var dropdown=false;


function startUp(){
  document.querySelectorAll('.gallery').forEach((item, i) => {
    console.log(item.id);
  });

  coverSection();
  setTimeout(setSizing,50);
  setTimeout(resetSectionHeight,500);
  navSetUp();
  projectGalleryGenerator();
}


function projectGalleryGenerator(){
  console.log(projects);

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

  d3.selectAll('.gallery').on('click',function(){
    var currentTarg=d3.select(event.currentTarget)
    if(d3.select('#cover').attr('class')=='list'){
      handleListClose();
    }else{
      projectTransition(currentTarg);
      changeToProject(currentTarg.datum());
    }
  });
}

function handleListClose(){
  switch(page){
    case 'home':
    d3.select('#cover').attr('class','');
    break;
    case 'project':
    d3.select('#cover').attr('class','project');
    break;
  }
  viewing.classed('viewing',false);
  viewing=d3.select('#sunbox-v');
  viewing.classed('viewing',true);
}


function projectTransition(currentTarg){
  currentTarg.selectAll('img').each(function(d,i){
    this.src=currentTarg.datum().images[i].large;
  })
  currentTarg.classed('selected',true);
  d3.select('#cover').classed('project',true);
  projectView=true;
  page='project';
}

function changeToProject(project){
  d3.selectAll('.bodycontent').style('opacity',0);
  if(project.fetch!==false){
    changeBodyContent(project.fetch,project);
  }else{
    postRequest(project.id,project);
  }

}

function changeBodyContent(content,project){
  setTimeout(function () {
    d3.select('h1').text(project.title);
    d3.selectAll('.bodycontent:not(h1)').remove();
    d3.select('#scrollcontent').append('h2').attr('class','bodycontent').html(`${project.abstract} • ${project.location}`);
    document.querySelector('#scrollcontent').insertAdjacentHTML('beforeend', content);
  }, 150);
    d3.select('#scrollcontent').selectAll('p').attr('class','bodycontent');
    setTimeout(function () {
    d3.selectAll('.bodycontent').style('opacity',1);
  }, 300);
}

function postRequest(id,project){
  function reqListener () {
    var jsonResponse=JSON.parse(this.responseText);
    projects.filter(item=>item.id==id)[0].fetch=jsonResponse.content.rendered;
    console.log(projects.filter(item=>item.id==id)[0]);
    changeBodyContent(jsonResponse.content.rendered,project);
  }
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", "/wp-json/wp/v2/project/"+id);
  oReq.send();
}



function coverSection(){

  if(page=='home'){
    d3.select('#visible-gallery').classed('selected',false);
    d3.select('#cover').classed('project',false);
    projectView=false;
  }else{
    d3.select('#visible-gallery').classed('selected',true);
    d3.select('#cover').classed('project',true);
    projectView=true;
  }

}


// document.querySelector('.gallery').addEventListener('click',function(){
//   d3.select('.gallery').classed('selected',true);
//   d3.select('#cover').classed('project',true);
//   projectView=true;
// })

function isHover(){
  if(window.matchMedia('(hover:hover)').matches){
    return true;
  }else{
    return false;
  }
}

function checkForCover(){
  var matches=window.matchMedia('(min-aspect-ratio: 11/8) and (min-width:700px)').matches;
  if(matches){
    return true;
  }else{
    return false;
  }
}

//interactive data and event handling

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


function handleSectionChange(which){
  switch(which){
    case 'projects':
      d3.select('#cover').attr('class','list');
    break;
    case 'home':
      handleListClose();
    break;
    default:
      console.log('nothing to see here');
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

function checkNavEdge(){
  navPos=document.querySelector('#vertical-nav').getBoundingClientRect().right;
  // root.style.setProperty('--nav-edge', navPos+'px');
}
window.addEventListener('mousemove',checkMouseLoc);
function checkMouseLoc(){
  if(event.clientX<navPos){
    root.style.setProperty('--nav-z', 15);
  }else{
    root.style.setProperty('--nav-z', 5);
  }
}


//sizing adjustment for cover section
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
    // d3.select('.gallery').selectAll('img').attr('class','img-vert-fit');
  }
  if(checkForCover()==false){
    // d3.select('.gallery').selectAll('img').attr('class','img-vert-fit');
    var ratioHeight=window.getComputedStyle(document.querySelector('#visible-gallery').querySelectorAll('.aspect-ratio')[0]).paddingBottom;
    // d3.select('.gallery').style('height',ratioHeight)
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

function parseComp(string){
  return parseInt(string.replace('px',''));
}


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



// window.addEventListener('DOMContentLoaded',beforeImages);
window.addEventListener('resize',setSizing);
window.addEventListener('DOMContentLoaded',startUp);

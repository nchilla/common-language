//content variables
var page='home';
var imgRatio=5/3;



//DOM related variables
var root=document.documentElement;
var windowsize={hor:0,vert:0};
var navWrapDist=document.querySelector('.section-link:last-child').getBoundingClientRect().left;
var viewing=d3.select('.viewing');
var dropdown=false;


function startUp(){
  coverSection();
  setTimeout(setSizing,50);
  setTimeout(resetSectionHeight,500);
  navSetUp();
}

function coverSection(){
  if(page=='home'){
    d3.select('#gallery').attr('class','homestyle');
  }else{
    d3.select('#gallery').attr('class','projectview');
  }
}

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
  console.log(items);
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













//all sizing adjustments compiled for startup and resize
function setSizing(){
  resetSectionHeight()
  navWrapJust();
  imgSizing();
}
//sizing adjustment for cover section
function imgSizing(){
  //width for wrapper
  var percentage=document.querySelector('#sizereference').getBoundingClientRect().width / window.innerWidth*100;
  percentage=percentage.toFixed(2);
  root.style.setProperty('--imgwidth', percentage+'vw');

  //image itself:horizontal or vertical fitting
  if(checkForCover()){
    var container=window.getComputedStyle(document.querySelector('.imgwrapper'));
    var containerRatio=parseComp(container.width)/parseComp(container.height);
    if(containerRatio>imgRatio){
      //fit to width
      d3.select('#gallery').selectAll('img').attr('class','img-hor-fit');
    }else{
      //fit to height
      d3.select('#gallery').selectAll('img').attr('class','img-vert-fit');

    }
  }
}

//sizing adjustment for vertical navbar
function resetSectionHeight(){
  document.querySelectorAll('.section-link').forEach((el, i) => {
    var orbHeight=0;
    var h2Height=window.getComputedStyle(d3.select(el).select('h2').node()).width;
    h2Height=parseComp(h2Height);
    // var newWidth=d3.select(el).select('h2').style('height');
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
        console.log('squish')
      }else{
        console.log('nosquish')
        d3.select('#navwrap').style('justify-content','space-between');
        d3.select('body').attr('class','nosquish');
      }
      // navWrapDist=newDist;
    }else{
      console.log('nosquish')
      d3.select('#navwrap').style('justify-content','space-between');
      d3.select('body').attr('class','nosquish');
    }
  }//end of matchmedia if statement

}

window.addEventListener('resize',setSizing);
window.addEventListener('load',startUp);

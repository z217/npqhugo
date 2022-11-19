function scrollToTop() {
  $("html, body").animate({
    scrollTop: "0px"
  }, 500);
}

function navToggle() {
  isNavOpen() ? navClose() : navOpen();
}
  
  /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function isNavOpen() {
    navStyle = window.getComputedStyle(document.getElementById("sidenav"));
    navWidth = navStyle.getPropertyValue('width')
    return  ( navWidth !== "0px" ) && (navWidth !== "");
}

function navOpen(){
  let navWidth = "200px"
  document.getElementById("sidenav").style.width = navWidth;
  document.getElementById("closebtn").style.left= navWidth;
  document.getElementById("scroll-top").style.left = navWidth;
  document.getElementById("light-switcher").style.left = navWidth;
  if (! window.matchMedia("(max-width: 650px)").matches){
    document.getElementById("main").style.marginLeft = navWidth;
  }
}

function navClose(){
  document.getElementById("sidenav").style.width = "0px";
  document.getElementById("main").style.marginLeft = "0px";
  document.getElementById("closebtn").style.left= "0px";
  document.getElementById("scroll-top").style.left = "0px";
  document.getElementById("light-switcher").style.left = "0px";
}

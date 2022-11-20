let light_switcher;
let is_light_mode = false;
const dye_tags = [
  "html, body", "h1, h2, h3", ".chroma", "#branding", "aside", "aside a", "aside header",
  "#closebtn", "#scroll-top", "#light-switcher", "#tocbtn", "#sidetoc li a", "footer",
  ".list-item", ".meta", ".posts", "pre",
];

function InitLightSwitcher() {
  light_switcher = {
    "anchor": $('#light-switcher'),
    "toggle": LightSwitcherToggle,
    "is_light_mode": false,
  };
  light_switcher.anchor.click(light_switcher.toggle);
  light_switcher.anchor.hover(
    () => {
      light_switcher.is_light_mode ?
        light_switcher.anchor.removeClass("light").addClass("dark") :
        light_switcher.anchor.removeClass("dark").addClass("light");
    },
    () => {
      light_switcher.is_light_mode ?
        light_switcher.anchor.removeClass("dark").addClass("light") :
        light_switcher.anchor.removeClass("light").addClass("dark");
    }
  );

  light_switcher.is_light_mode = localStorage.getItem("is_light_mode") === "true";
  if (light_switcher.is_light_mode === null) {
    light_switcher.is_light_mode = false;
    localStorage.setItem("is_light_mode", false);
  }

  let klass = "";
  if (light_switcher.is_light_mode) {
    klass = "light";
    tocSetHoverStyle({
      color: "black",
    });
  } else {
    klass = "dark";
    tocSetHoverStyle({
      color: "white",
    });
  }
  dye_tags.forEach(element => $(element).addClass(klass));
}

function LightSwitcherToggle() {
  light_switcher.is_light_mode = !light_switcher.is_light_mode;
  localStorage.setItem("is_light_mode", light_switcher.is_light_mode);
  if (light_switcher.is_light_mode) {
    tocSetHoverStyle({
      color: "black",
    });
    light_switcher.anchor.html("亮色模式");
    $(".dark").removeClass("dark").addClass("light");
  } else {
    tocSetHoverStyle({
      color: "white",
    });
    light_switcher.anchor.html("暗色模式");
    $(".light").removeClass("light").addClass("dark");
  }
}
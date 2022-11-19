let light_switcher;
let is_light_mode = false;

let dark_mode_style = {
  "html, body": {
    "background-color": "#1A1C1D",
    "color": "#D8D6D0",
  },
  "h1, h2, h3": {
    "border-bottom": "1px solid #3D3D3D",
  },
  ".chroma": {
    "color": "#8A8A8A",
    "background-color": "#1C1C1C",
  },
  "aside": {
    "background-color": "rgb(45, 49, 51)",
    "border-right": "1px solid #3D3D3D",
  },
  "aside a": {
    "color": "rgb(238, 238, 238)",
  },
  "aside header": {
    "background-color": "#23282E",
    "border-bottom": "1px solid #3D3D3D",
  },
  "element.style": {
    "background-color": "rgb(26, 28, 29)",
    "color": "rgb(45, 49, 51)",
  },
  "#closebtn": {
    "color": "rgba(238, 238, 238, 0.664)",
    "background-color": "rgba(61, 61, 61, 0.555)",
  },
  "#scroll-top": {
    "color": "rgba(238, 238, 238, 0.664)",
    "background-color": "rgba(61, 61, 61, 0.555)",
  },
  "#light-switcher": {
    "color": "rgba(238, 238, 238, 0.664)",
    "background-color": "rgba(61, 61, 61, 0.555)",
  },
  "#tocbtn": {
    "color": "rgba(238, 238, 238, 0.664)",
    "background-color": "rgba(61, 61, 61, 0.555)",
  },
  "footer": {
    "border-top": "1px solid #3D3D3D",
    "background-color": "rgb(30, 34, 39)",
  },
  ".list-item": {
    "border": "1px solid #3D3D3D",
    "background-color": "rgb(39, 41, 43)",
  },
  ".meta": {
    "color": "rgb(156, 151, 143)",
  },
  ".posts": {
    "border": "1px solid #3D3D3D",
  },
}

let light_mode_style = {
  "html, body": {
    "background-color": "#F2F2F2",
    "color": "#161209",
  },
  "h1, h2, h3": {
    "border-bottom": "1px solid #A3A3A3",
  },
  ".chroma": {
    "color": "#161616",
    "background-color": "#E3E3E3",
  },
  "aside": {
    "background-color": "rgb(238, 238, 238)",
    "border-right": "1px solid #A3A3A3",
  },
  "aside a": {
    "color": "rgb(45, 49, 51)",
  },
  "aside header": {
    "background-color": "rgb(228, 228, 228)",
    "border-bottom": "1px solid #A3A3A3",
  },
  "element.style": {
    "background-color": "rgb(228, 228, 228)",
    "color": "rgb(238, 238, 238)",
  },
  "#closebtn": {
    "color": "rgba(22, 22, 22, 0.664)",
    "background-color": "rgba(208, 208, 208, 0.555)",
  },
  "#scroll-top": {
    "color": "rgba(22, 22, 22, 0.664)",
    "background-color": "rgba(208, 208, 208, 0.555)",
  },
  "#light-switcher": {
    "color": "rgba(22, 22, 22, 0.664)",
    "background-color": "rgba(208, 208, 208, 0.555)",
  },
  "#tocbtn": {
    "color": "rgba(22, 22, 22, 0.664)",
    "background-color": "rgba(208, 208, 208, 0.555)",
  },
  "footer": {
    "border-top": "1px solid #A3A3A3",
    "background-color": "rgb(237, 237, 237)",
  },
  ".list-item": {
    "border": "1px solid #A3A3A3",
    "background-color": "rgb(228, 228, 228)",
  },
  ".meta": {
    "color": "#635F56",
  },
  ".posts": {
    "border": "1px solid #A3A3A3",
  },
}

let toc_anchor_style = {
  "dark_normal": {
    "color": "rgba(238, 238, 238, 0.664)",
  },
  "dark_current": {
    "color": "white",
  },
  "light_normal": {
    "color": "rgba(22, 22, 22, 0.664)",
  },
  "light_current": {
    "color": "black",
  },
}

function InitLightSwitcher() {
  light_switcher = {
    "anchor": $('#light-switcher'),
    "toggle": () => {
      light_switcher.is_light_mode ? LightSwitcherSetStyle(dark_mode_style, true) : LightSwitcherSetStyle(light_mode_style, true)
    },
    "set": () => {
      light_switcher.is_light_mode ? LightSwitcherSetStyle(light_mode_style, false) : LightSwitcherSetStyle(dark_mode_style, false)
    },
    "is_light_mode": false,
  }
  light_switcher.anchor.click(light_switcher.toggle)
  light_switcher.anchor.hover(
    () => {
      light_switcher.is_light_mode ?
        light_switcher.anchor.css(dark_mode_style["#light-switcher"]) :
        light_switcher.anchor.css(light_mode_style["#light-switcher"])
    },
    () => {
      light_switcher.is_light_mode ?
        light_switcher.anchor.css(light_mode_style["#light-switcher"]) :
        light_switcher.anchor.css(dark_mode_style["#light-switcher"])
    }
  )
  light_switcher.is_light_mode = localStorage.getItem("is_light_mode") === "true"
  if (light_switcher.is_light_mode === null) {
    light_switcher.is_light_mode = false;
    localStorage.setItem("is_light_mode", false)
  }
  light_switcher.set()
  tocSetStyle()
}

function LightSwitcherSetStyle(mode_style, is_toggle) {
  for (let tag in mode_style) {
    let elem = $(tag)
    elem.css(mode_style[tag])
  }
  if (is_toggle) {
    light_switcher.is_light_mode = !light_switcher.is_light_mode;
  }
  localStorage.setItem("is_light_mode", light_switcher.is_light_mode)
  if (light_switcher.is_light_mode) {
    normalAnchorStyle = toc_anchor_style["light_normal"]
    currentAnchorStyle = toc_anchor_style["light_current"]
    light_switcher.anchor.html("亮色模式")
    $(".dark").removeClass("dark").addClass("light")
  } else {
    normalAnchorStyle = toc_anchor_style["dark_normal"]
    currentAnchorStyle = toc_anchor_style["dark_current"]
    light_switcher.anchor.html("暗色模式")
    $(".light").removeClass("light").addClass("dark")
  }
  tocSetStyle();
}
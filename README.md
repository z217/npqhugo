# npq hugo theme

Fork from [npq-hugo](https://github.com/saadsolimanxyz/npqhugo)  
demo: [z217blog](https://z217blog.cn)

## micro blog

The micro blog in the origin has no limit, so it will show all of the blogs, which makes index huge. I limit the number of micro blog by adding parameter `microMax`.

```toml
[params]
  microMax = 4 # default is 4, limit the micro blogs num
```

## toc

Because the hugo's toc do not support headers level above 4, so I write toc generator.  
You can disable toc in the post like this:

```md
toc: false  <!-- default true，set false to disable toc -->
```

## floating-scroll

Sometimes table has jax will exceed the width of body. I limit the width of table, if the table's width is larger than body, the horizontal scroll bar will be visible.  
In order to make table's horizontal scrollbar always visible, I use floating-scroll plugin. See the repository: [floating-scroll](https://github.com/Amphiluke/floating-scroll)

## License
GPLv3

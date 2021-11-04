# npq hugo theme

Fork from [npq-hugo](https://github.com/saadsolimanxyz/npqhugo)  
demo: [z217blog](https://z217blog.cn)

## micro blog

The micro blog in the origin has no limit, so it will show all the blogs, which makes index huge. I modify index.html and add param `microMax` to limit the number of micro blog.

```toml
[params]
  microMax = 4 # default 4, limit the micro blogs num
```

## toc

Because the hugo's toc do not support level above 4, so I write toc generator by myself.  
You can disable toc in the post like this:

```md
---
toc: false # default true，set false to disable toc
---
```

## License
GPLv3

## 记录一次面试解决的问题

### 需求

#### 有几 w 的文字，需要这些文字分页展示，一页只能展示当前页面所能承载的文字（也就是不能滚动页面）

##### 一些遗憾

当时面试的时候并没有想出来这么去弄，刚离开面试地点就想起来这么解决这个问题，然后就是发现在做的时候，也没我想象中那么简单。

- 一个是，用 canvas 动态计算一行的宽度，从而知道一行能放多少字

- 另一个在处理分页的时候，发现数据量太大的话，会卡渲染，而且，这点也是模仿了 react18 中，时间切片的原理，做了下优化，达到不卡渲染的效果，也能很好地进行分页

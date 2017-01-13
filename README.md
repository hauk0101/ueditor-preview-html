## 基于UEditor富文本编辑器实现手机页面预览功能

一个基于UEditor编辑器使用iframe实现的模拟手机页面的预览功能

## 工程目录说明 
> 1.以下文件夹及文件为实现富文本编辑器及预览等功能的主要内容，其余部分为UEditor自带的源码，本项目选择的是基于PHP+UEditor组合的工程。

	|-ueditor-preview-html
		|+css		
		|+images
		|+js
		|-editor.html
		|-preview-h5.html

> 2.editor.html为项目的主要入口页面。
  
 其中，index.html为UEditor提供的demo入口页面，可做参考。<br>

> 3.css、images、js为相关资源。
 
其中，包括了<br>
editor-style.css | editor.html页面的样式 <br>
preview-style.css | preview-h5页面的样式 <br>
iphone-bg.png | 预览的手机背景图片 <br>
editor.js | 实现了editor.html中UEditor初始化、图片上传、手机预览等功能 

> 4.最终实现的预览功能截图如下：

![](https://raw.githubusercontent.com/hauk0101/myjobs/master/wozlla/res/Rendering_Pipeline.jpg)
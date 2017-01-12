/**
 * 基于UEditor开发的H5图文页面编辑器
 * Create by YaoQiao on 2017-01-11
 */

var htmlObject = {};
(function(){
	init();
})();


function init(){
	createEditor();
	addEvent();
}

/**
 * 添加事件侦听
 */
function addEvent(){
	//标题和作者输入框提示
	inputTextTipEffect();	
	//单图模式/三图模式切换
	uploadImgChangeEffect();
	//添加预览功能
	addPreviewFun();
	//添加发布功能
	addSubmitFun();
	//添加保存功能
	addSaveFun();
	//添加上传功能
	addUploadImgFun();
}

/**
 * 创建编辑器
 */
function createEditor(){
	//初始化编辑
	var ue = UE.getEditor("editor",{
		initialFrameWidth:1000,
		initialFrameHeight:400,
		initialStyle:'p{font-family:微软雅黑;font-size:16px;}',
		toolbars: [['fullscreen','source', '|', 'undo', 'redo','|','bold','italic','underline','fontborder','strikethrough','removeformat','formatmatch','|','forecolor','backcolor','insertorderedlist','insertunorderedlist','|','rowspacingtop','rowspacingbottom','lineheight','|','fontfamily','fontsize','|','indent','justifyleft','justifycenter','justifyright','justifyjustify','|','imagenone','imageleft','imageright','imagecenter','|','insertimage','insertvideo','music','|','horizontal','inserttable']],
		maximumWords:9999999,
		scaleEnabled:false,
		elementPathEnabled:false,
		wordCount:false,
		autoHeightEnabled:false
	});
	htmlObject.editor = ue;
}

/**
 * 添加图片上传功能，包括单图模式和三图模式
 * 需要注意单图模式和多图模式dom对象和jq对象的切换
 */
function addUploadImgFun(){
	//单图模式
	 var uploadBtn_single = $(".single-upload .img-upload");
	 var file_upload0 = $("#file-upload0");
	 var file_preivew0 = $("#file_preivew0");
	 //上传按钮点击事件
	 uploadBtn_single.on("click",function(){
	 	file_upload0.click();	
	 });
	 //单图input变化事件
	 file_upload0.on("change",function(e){
	 	if(file_upload0[0] && file_upload0[0].files[0]){
	 		imgPreview(file_preivew0,file_upload0[0]);
		 	uploadBtn_single.hide();	 
		 	file_preivew0.show();
	 	}	 	
	 });
	 //单图预览图片点击事件
	 file_preivew0.on("click",function(){
	 	file_upload0.click();	 		
	 });
	 
	 //多图模式
	 var uploadBtn_three = $(".three-upload .img-upload");
	 var file_uploads = $(".three-upload .file-upload");
	 var file_previews = $(".three-images .single-preivew");
	 for(var i = 0; i < uploadBtn_three.length;i++){	 	
	 	if(uploadBtn_three[i] && file_uploads[i] &&file_previews[i])
	 	//绑定上传按钮点击事件
	 	$(uploadBtn_three[i]).bind("click",{index:i},uoloadBtnOnClick);
	 	//绑定input变化事件
	 	file_uploads.eq(i).bind("change",{index:i},inputValueOnChange);
	 	//绑定preview预览点击事件
	 	$(file_previews[i]).bind("click",{index:i},previewImgOnClick);		 
	 }
	 //上传按钮点击事件处理函数
	 function uoloadBtnOnClick(evt){
	 	var file_input = file_uploads[evt.data.index];
	 	if(file_input) $(file_input).click();
	 }
	 //input标签change事件处理函数
	 function inputValueOnChange(evt){
	 	var index = evt.data.index;
	 	var file_input = file_uploads[index];
	 	var file_preview = file_previews[index];
	 	var upload_btn = uploadBtn_three[index];
	 	if(file_input && file_input.files[0]){
	 		imgPreview($(file_preview),file_input);
	 		$(upload_btn).hide();	 
			$(file_preview).show();
	 	}	 		
	 }
	 //preview预览对象点击事件处理函数
	 function previewImgOnClick(evt){
	 	var file_input = file_uploads[evt.data.index];
	 	if(file_input) $(file_input).click();	
	 }
}

/**
 * 显示图片预览功能
 * @param {Object} previewImg 预览图片的对象
 * @param {Object} uploadImg  上传图片的对象
 */
function imgPreview(previewImg,uploadImg){
	if(previewImg && uploadImg){
		var reader;
		//判断是否支持文件API
		if(window.FileReader){
			reader = new FileReader();
		}else{
			alert("您的浏览器不支持图片预览功能，请及时升级或更换其它浏览器！");
		}
		//判断上传的类型是否为图片
		var file = uploadImg.files[0];
		var imagesType = /^image\//;
		if(!imagesType.test(file.type)){
			alert("请选择需要上传的图片!");
			return;
		}
		//读取完成
		reader.onload = function(e){
			var img = previewImg;
			//其中e.target.result为base64类型的数据
			previewImg.attr("src",e.target.result);
		};
		reader.readAsDataURL(file);
	}
}

/**
 * 将当前页面中的数据添加至htmlObject对象中
 */
function combineContent(){
	if(!htmlObject) return;
	//添加标题
	var title = $("#article-title").val();
	htmlObject.articleTitle = title;
	//添加作者
	var author = $("#article-author").val();
	htmlObject.articleAuthor = author;
	//添加文章
	var article = htmlObject.editor.getContent();
	htmlObject.articleContent = article;
	//添加封面
	var articleCoverImg = []; 
	if(htmlObject.singleModel){
		var file_preview = $("#file_preivew0");
		var _data = file_preview.attr("src");
		if(_data){
			articleCoverImg.push();
		}	
	}else{
		var file_previews = $(".three-images .single-preivew");
		for(var i=0 ;i < file_previews.length;i++){
			var _data = $(file_previews[i].attr("src"));
			if(_data){
				articleCoverImg.push(data);
			}		
		}
	}
	htmlObject.articleCoverImg = articleCoverImg;
}

/**
 * 检查内容是否完善，并作出对应的提示
 *  -检查是否有标题
 * 	-检查是否输入作者
 *  -检查是否有封面
 *  @return {Boolean} 如果内容完善，返回true
 */
function checkContent(){
	//检查是否有标题
	if(htmlObject.articleTitle == null || htmlObject.articleTitle==""){
		alert("请检查是否输入文章标题！");
		return false;
	}
	//检查是否有作者
	if(htmlObject.articleAuthor == null || htmlObject.articleAuthor==""){
		alert("请检查是否输入文章作者！");
		return false;
	}
	//检查是否有封面
	if(htmlObject.articleCoverImg == null || htmlObject.articleCoverImg.length < 1){
		alert("请检查是否上传封面！");
		return false;
	}
	return true;	
}

/**
 * 添加发布功能
 */
function addSubmitFun(){
	var sub_btn = $("#btn-submit");
	sub_btn.on("click",function(){
		//组合数据
		combineContent();
		//检查数据
		if(checkContent()){
			//TODO how to submit the content to server.
			console.log("the submit function not open.");
		}
	});
}
/**
 * 添加保存功能
 */
function addSaveFun(){
	var save_btn = $("#btn-save");
	save_btn.on("click",function(){
		//TODO how to save the content to server.
		console.log("the save function not open.");
	});
}
/**
 * 添加预览功能
 */
function addPreviewFun(){
	var pre_btn = $("#btn-preview");
	var pre_layer = $(".preview-layer");
	var pre_bg = $(".preview-bg");	
	pre_btn.on("click",function(){
		updatePreviewHtml();
		pre_layer.show();
		resetPrePhoneCss();
	});
	pre_bg.on("click",function(){
		pre_layer.hide();
	});
	
	//预览图片居中样式	
	var css_str = {};
	var pre_phone = $(".preview-phone");
	var pos_left = 0;
	var pos_top = 0;	
	$(window).resize(resetPrePhoneCss);
	//重置预览手机页面的CSS
	function resetPrePhoneCss(){
		pos_left = $(window).width() / 2 - pre_phone.width() / 2;
		pos_top = $(window).height() / 2 - pre_phone.height() / 2;
		css_str = {
			left:pos_left + "px",
			top:pos_top + "px"
		}
		pre_phone.css(css_str);
	}
	//初始化时设置预览手机元素位置
	resetPrePhoneCss();
}	

/**
 * 更新预览页面显示内容
 */
function updatePreviewHtml(){
	var ifr_document = document.getElementById("preview-html").contentWindow.document;	
	if(ifr_document){
		//设置标题
		var title_str = $("#article-title").val();
		var ifr_title = $(ifr_document).find(".article-title .title");
		ifr_title.html(title_str);
		//设置作者
		var author_str = $("#article-author").val();
		var ifr_author = $(ifr_document).find(".article-top .article-time");
		ifr_author.html(author_str);
		
	}
	//设置正文
	if(ifr_document && htmlObject.editor){
		var content_str = htmlObject.editor.getContent();
		var ifr_content = $(ifr_document).find(".article-content");
		ifr_content.html(content_str);
	}
}



/**
 * 实现标题栏和作者栏的获焦/失焦效果
 */
function inputTextTipEffect(){
	//标题输入栏
	var article_title = $("#article-title");
	var title_str = "请在这里输入标题";
	article_title.attr("placeholder",title_str);
	article_title.focus(function(){
		article_title.attr("placeholder","");
	});
	article_title.blur(function(){
		article_title.attr("placeholder",title_str);
	});
	
	//作者输入栏点击后隐藏提示
	var article_author = $("#article-author");
	var author_str = "请输入作者";
	article_author.attr("placeholder",author_str);
	article_author.focus(function(){
		article_author.attr("placeholder","");
	});
	article_author.blur(function(){
		article_author.attr("placeholder",author_str);
	});
}

/**
 * 实现上传封面图片单图模式/多图模式的切换效果
 */
function uploadImgChangeEffect(){
	var single_model = $("#single-model");
	var three_model = $("#three-model");
	var single_image = $(".single-image");
	var three_images = $(".three-images");
	htmlObject.singleModel = true;
	single_model.on("click",function(){
		single_image.show();
		three_images.hide();
		htmlObject.singleModel = true;
	});
	three_model.on("click",function(){
		single_image.hide();
		three_images.show();
		htmlObject.singleModel = false;
	});
	//默认单图模式
	single_image.show();
	three_images.hide();		
}


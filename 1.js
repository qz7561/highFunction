function openMerchElement(formId, id, btn) {
	var codeTs;
	var name;
	var gName=$("#gName").val();
	var goodsSelects = $("#decListElemTable").bootstrapTable("getSelections");
	if(goodsSelects.length<1){
		return false;
	}
	if(btn==""){
		codeTs = goodsSelects[0].codeTs;
		name = goodsSelects[0].gname;
	}else{
		codeTs = $("#codeTs").val();
		name = $("#gName").val();
	}	
	$("#hsCodeDesc").val(name); //商品编号描述	
	if(!gName){
		$("#gName").val(name);	
	}
	$('#selectCodeTs').val(codeTs + "-" + name);
	// 查询选中的商品规范要素信息
	var data = {
		"codeTs" : codeTs
	};
	$.ajax({
			url : swProxyBasePath+"sw/dec/common/getMerchElement",
			data : JSON.stringify(data),
			method : 'post',
			dataType : "json",
			contentType : "application/json; charset=utf-8",
			success : function(data) {
			    $("#merchElementDiv").empty();
				$("#elements").val("");
				$("#addiElements").val("");
				$("#addiElements").attr("disabled",false);
				$("#merchElementDiv input").attr("disabled",false);	
				var next="";
				for (var i = 0; i < data.length; i++) {
					var id="val"+i;
					var chkStr = '';
					if(i==data.length-1){
						next="addiElements";
					}else{
						next="val"+(i+1);
					}
					if (data[i].requireCheck == '0' || data[i].textName=="GTIN" || data[i].textName=="CAS") {
						chkStr = '<input style="margin-top: auto;" type="checkbox" id="checkVal'
								+ i
								+ '" value="'
								+ data[i].requireCheck
								+ '" name="checkVal" disabled="disabled"/>必填';
					} else {
						chkStr = '<input style="margin-top: auto;" type="checkbox" id="checkVal'
								+ i
								+ '" value="'
								+ data[i].requireCheck
								+ '" name="checkVal" disabled="disabled" checked="checked"/>必填';
					}
					var htmlStr = '<div class="row itswRow">'
							+ '<div class="col-sm-12">'
							+ '<div class="itswLable-10word" style="width:40%;">'
							+ '<label class="control-label">'
							+ data[i].textName
							+ '</label>'
							+ '</div>'
							+ '<div class="itswInput" style="margin-left: 4px; width:40%;">'
							+ '<input type="text" class="form-control" id="val'
							+ i
							+ '" name="dyanInput" onkeyup="decFocus(event,\''+next+'\')" >' + '</div>' 
							+ '<div class="itswLable-10word" style="width:15%";>' + chkStr + '</div>'
							+ '</div>' + '</div>' 
					$("#merchElementDiv").append(htmlStr);
					$("#selectCodeTs").parent().prev().css("width","20%");
					$("#addiElements").parent().prev().css("width","20%");
					$("#elements").parent().prev().css("width","20%");
					
					//重新归类、归类查看的时候赋值
					if(btn=="classifyAgainBtn" || btn=="classifyLookBtn"){
						splitGModel(id);
					}
					
				}
				
				if(btn=="classifyLookBtn"){
					$("#addiElements").attr("disabled",true);
					$("#merchElementDiv input").attr("disabled",true);
				}
				
				//重新归类、归类查看的时候赋值
				if(btn=="classifyAgainBtn" || btn=="classifyLookBtn"){
					var gModel = $("#gModel").val();
					var elements = gModel.split("|");
					var str = $("#gModel").val();
					$("#elements").val(str);
					var charCode;
					var realLength=0;
					for (var i = 0; i < str.length; i++) {
						charCode = str.charCodeAt(i);
						if (charCode >= 0 && charCode <= 128) {
							realLength += 1;
						} else {
							// 如果是中文则长度加2
							realLength += 2;
						}
					}
					document.getElementById('elementsByteTotal').innerHTML =realLength;
					if(elements.length-1 == data.length){
						$("#addiElements").val(elements[elements.length-1])
					}
				}
				getGoodsInfo(formId, codeTs, btn);
			}
		});
}
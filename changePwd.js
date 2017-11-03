function isSupportFileApi() {
    if(window.File && window.FileList && window.FileReader && window.Blob) {
	return true;
    }
    return false;
}

function doChange(accounts,pwd)
{
    var phoneAccount = accounts["phone"];
    var useridAccount = accounts["userid"];

    $.each(phoneAccount,function(index,account,array){
	$.get({
	    url:"http://mp.yiban.cn/infoserv/userinfo/id/0/nick/0/phone/" + account,
	    async: false,
	    success:function(data){
		var keyword = "var userId = \"";
		var keywordIndex = -1;
		if((keywordIndex = data.indexOf(keyword)) <= 0)
		    return;
		keywordIndex += keyword.length;
		var keywordEnd = data.indexOf("\"",keywordIndex);
		var userid = data.substring(keywordIndex,keywordEnd);
		useridAccount.push(userid);
	    },
	    beforeSend: function( xhr ) { 
		xhr.setRequestHeader('X-Requested-With', "nop"); 
	    },
	    dataType:"text"
	});
    });

    $.each(useridAccount,function(index,account,array){
	$.ajax({
	    url:"http://mp.yiban.cn/infoserv/resetPwd",
	    async:true,
	    type:"post",
	    data:{
		userId:account,
		value:pwd
	    }
	});
    });


}

function GetPasswordCallback(response,accounts)
{
    var pwd = "";
    if(response.password)
    {
	pwd = response.password;
    }
    else
    {
	alert("扩展间通信异常");
	return false;
    }
    doChange(accounts,pwd);
}

function GetPassword(accounts)
{
    chrome.runtime.sendMessage({type: "GetPassword"}, function(response)
	{
	    GetPasswordCallback(response,accounts);
	});
}

function ReaderLoaded(evt)
{
    var fileString = evt.target.result;
    var accounts = $.parseJSON(fileString);
    GetPassword(accounts);
}

function ReadFile(file,loadedCallback)
{
    var reader = new FileReader();//新建一个FileReader
    reader.readAsText(file, "UTF-8");//读取文件
    reader.onload = function(e){
	loadedCallback(e);
    };
}

function doChangePassword()
{
    var accountFile = document.getElementById("accountFile").files[0];
    if(!accountFile)
    {
	alert("账户文件为空");
	return false;
    }
    ReadFile(accountFile,ReaderLoaded);
    return true;
}

$(document).ready(function(){
    if(!isSupportFileApi())
    {
	alert("您的浏览器不支持js File,无法执行后续代码");
	return false;
    }

    $("#search").parent().append("<br/><div><input id=\"accountFile\" type=\"file\" /><button class=\"btn btn-primary\" type=\"button\" id=\"changePwd\">批量修改</button>");

    $("#changePwd").click(function(){
	doChangePassword();
	alert("执行完毕");
    });
});

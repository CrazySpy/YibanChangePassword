$(document).ready(function(){
    $("#submit").click(function(){
	var newPassword = $("#password").val();
	chrome.runtime.sendMessage({type :"SetPassword",password: newPassword}, function(response) {
	    if(response.status)
		$("#message").html("修改成功");
	    else
		$("#message").html("修改失败");
	});
    });
});

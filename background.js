var pwd = "yiban123456";

function MessageProcessor(request, sender, sendResponse)
{
    if(request.type=="SetPassword")
    {
	if (request.password)
	{
	    pwd = request.password;
	    sendResponse({status: true});
	}
	else
	    sendResponse({status:false});
    }
    else if(request.type=="GetPassword")
    {
	sendResponse({password:pwd});
    }
    else
	sendResponse({status:false});
}

chrome.runtime.onMessage.addListener(MessageProcessor);



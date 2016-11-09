var seltext = null;

chrome.extension.onRequest.addListener(function(request, sender, sendResponse)
{
    switch(request.message)
    {
        case 'setText':
            window.seltext = request.data
        break;

        default:
            sendResponse({data: 'Invalid arguments'});
        break;
    }
});


function savetext(info,tab)
{
    // var jax = new XMLHttpRequest();
    // jax.open("POST","https://i.localhost:3000/integrations/requests/upload");
    // jax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    // jax.send("payload="+seltext);
    // jax.onreadystatechange = function() { if(jax.readyState==4) { alert(jax.responseText);  }}

  var payload = window.seltext.replace(/\t/g, ",").replace(/[^\x00-\x7F]/g, "");

  var data = {
    'redirect_uri': "http://localhost:3000/chartdesigner" ,
    'payload': payload,
    'redirect_type': 'redirect',
  }

  postData("http://localhost:4000/integrations/requests/upload/csv", data);
}

function postData(url, data) {
  chrome.tabs.create(
    { url: chrome.runtime.getURL("post.html") },
    function(tab) {
      var handler = function(tabId, changeInfo) {
        if(tabId === tab.id && changeInfo.status === "complete"){
          chrome.tabs.onUpdated.removeListener(handler);
          chrome.tabs.sendMessage(tabId, {url: url, data: data});
        }
      }

      // in case we're faster than page load (usually):
      chrome.tabs.onUpdated.addListener(handler);
      // just in case we're too late with the listener:
      chrome.tabs.sendMessage(tab.id, {url: url, data: data});
    }
  );
}

var contexts = ["selection"];
for (var i = 0; i < contexts.length; i++)
{
    var context = contexts[i];
    chrome.contextMenus.create({"title": "Send to bCharts", "contexts":[context], "onclick": savetext});
}

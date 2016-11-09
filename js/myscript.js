function setSelection() {
console.log(window.getSelection().toString());
  var sel = window.getSelection().toString();
  if(sel.length)
      chrome.extension.sendRequest({'message':'setText','data': sel},function(response){})
}

// document.addEventListener('mouseup',function(event)
// document.addEventListener('mouseup',function(event) { setSelection(); })
// document.addEventListener('select',function(event) { setSelection(); })
document.addEventListener('selectionchange',function(event) { setSelection(); })


document.addEventListener('contextmenu',function(event) {
  console.log(event);
})

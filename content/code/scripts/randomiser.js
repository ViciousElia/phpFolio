function getURLParameter(sParam)
{
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  if (sURLVariables.length===0){
    return "digital";
  }
  for (var i = 0; i < sURLVariables.length; i++) 
  {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) 
    {
      return sParameterName[1];
    }
  }
}

var randTable = [];

function buildRandTable() {

  var fileName = '/content/code/scripts/generalRndChar.json';
  
// To be updated when more than one db exists.
  switch(fileName){
      default:
        break;
  }
/*  if (whichTable=="analog"){
    fileName='data/analogArt.json';
  } else if (whichTable=="physical") {
    fileName='data/physicalArt.json';
  } else {
    fileName='data/digitalArt.json';
  }*/

  // Load the JSON file 
  var xhr = new XMLHttpRequest(); 
  xhr.overrideMimeType("application/json"); 
  xhr.open('GET', fileName, true); 
  xhr.onreadystatechange = function () { 
    if (xhr.readyState === 4 && xhr.status === 200) { 
      // Parse the JSON data 
      randTable = JSON.parse(xhr.responseText);
      buildResArea();
    } 
  }; 
  xhr.send(null);
}


/*
    Function: expandTable
    Params:
        curEle     - Element from randTable
        parentEle  - Element ID from DOM to pull count number, as necessary, sent as js document element
        parentType - Type from randTable
        counter    - For Repeat elements
*/
function expandTable(curEle,docEle,depth,counter=0){
    var workEle;
    var addDrop;
    var rptDrop;
    var theCheck;
    var tabList;
    if (!(curEle.name)) {
        var newEle = document.createElement("h2");
        newEle.innerHTML = 'General Character Randomiser';
        var tabArea = document.createElement("div");
        tabArea.className = "tabArea";
        tabList = document.createElement("div");
        tabList.setAttribute('id','tabs');
        tabList.className="tabSelectors";
        var allTab = document.createElement("a");
        allTab.className = 'activeTabHead';
        allTab.innerHTML = 'All';
        allTab.setAttribute('onclick','tabSwitch("all")');
        tabList.append(allTab);
        docEle.append(newEle);
        docEle.append(tabArea);
        tabArea.append(tabList);
        workEle = curEle;
    } else {
        switch(curEle.type){
            case 'group':
                var addTitle = document.createElement("h3");
                addTitle.innerHTML = curEle.label;
                docEle.append(addTitle);
                workEle = curEle.data;
                break;
            case 'list':
                addDrop = document.createElement("select");
                var labelDrop = document.createElement("label");
                if(counter>0){addDrop.setAttribute('onchange','showChildren("'+curEle.name+'-'+counter+'")');} else addDrop.setAttribute('onchange','showChildren("'+curEle.name+'")');
                if(counter>0){addDrop.setAttribute('name',curEle.name+'-'+counter+'-drop');} else addDrop.setAttribute('name',curEle.name+'-drop');
                if(counter>0){addDrop.setAttribute('id',curEle.name+'-'+counter+'-drop');} else addDrop.setAttribute('id',curEle.name+'-drop');
                if(counter>0){labelDrop.setAttribute('for',curEle.name+'-'+counter+'-drop');} else labelDrop.setAttribute('for',curEle.name+'-drop');
                labelDrop.innerHTML = curEle.label+': ';
                theCheck = document.createElement("input");
                theCheck.setAttribute('type','checkbox');
                if(counter>0){theCheck.setAttribute('id',curEle.name+'-'+counter+'-check');} else theCheck.setAttribute('id',curEle.name+'-check');
                theCheck.setAttribute('onchange','freezeDrop("'+theCheck.getAttribute('id')+'")');
                var lineDrop = document.createElement("p");
                lineDrop.append(labelDrop);
                lineDrop.append(addDrop);
                lineDrop.insertAdjacentHTML('beforeend', ' Freeze ');
                lineDrop.append(theCheck);
                docEle.append(lineDrop);
                workEle = curEle.data;
                break;
            case 'repeat':
                if (counter===0){
                    var theTitle = document.createElement("h3");
                    theTitle.innerHTML = curEle.label;
                    var theCounter = document.createElement("input");
                    theCounter.setAttribute('id',curEle.name+'-counter');
                    theCounter.setAttribute('name',curEle.name+'-counter');
                    theCounter.setAttribute('type','number');
                    theCounter.setAttribute('min',curEle.min);
                    theCounter.setAttribute('max',curEle.max);
                    theCounter.setAttribute('onchange','repeats("'+curEle.name+'")');
                    theCounter.value = curEle.default;
                    var countLabel = document.createElement("label");
                    countLabel.setAttribute('for',curEle.name+'-counter');
                    countLabel.innerHTML = curEle.label+' Count: ';
                    var countLine = document.createElement("p");
                    
                    docEle.append(theTitle);
                    countLine.append(countLabel);
                    countLine.append(theCounter);
                    docEle.append(countLine);
                    for (let iter = 1;iter<=curEle.max;iter++){
                        var subRpt = document.createElement("div");
                        subRpt.setAttribute('class','rndRepeat lv'+depth);
                        subRpt.setAttribute('id',curEle.name+'-'+iter);
                        if (iter>curEle.default) subRpt.setAttribute('style','display:none');
                        expandTable(curEle,subRpt,depth,iter);
                        docEle.append(subRpt);
                    }
                    return;
                } else {
                    rptDrop = document.createElement("select");
                    if(counter>0){rptDrop.setAttribute('onchange','showChildren("'+curEle.name+'-'+counter+'")');} else rptDrop.setAttribute('onchange','showChildren("'+curEle.name+'-'+counter+'")');
                    var labelRpt = document.createElement("label");
                    rptDrop.setAttribute('name',curEle.name+'-'+counter+'-drop');
                    rptDrop.setAttribute('id',curEle.name+'-'+counter+'-drop');
                    labelRpt.setAttribute('for',curEle.name+'-'+counter+'-drop');
                    labelRpt.innerHTML = curEle.label+' '+counter+': ';
                    theCheck = document.createElement("input");
                    theCheck.setAttribute('type','checkbox');
                    if(counter>0){theCheck.setAttribute('id',curEle.name+'-'+counter+'-check');} else theCheck.setAttribute('id',curEle.name+'-check');
                    theCheck.setAttribute('onchange','freezeDrop("'+theCheck.getAttribute('id')+'")');
                    var lineRpt = document.createElement("p");
                    lineRpt.append(labelRpt);
                    lineRpt.append(rptDrop);
                    lineRpt.insertAdjacentHTML('beforeend', ' Freeze ');
                    lineRpt.append(theCheck);
                    docEle.append(lineRpt);
                }
                workEle = curEle.data;
                break;
            default:
                break;
        }
    }
    for (let each of workEle){
        if (!(curEle.name)) {
            var newTab = document.createElement("a");
            newTab.className = 'inactiveTabHead';
            newTab.innerHTML = each.name.charAt(0).toUpperCase() + each.name.slice(1);
            newTab.setAttribute('onclick','tabSwitch("'+each.name+'")');
            tabList.append(newTab);
        }
        var thisEle;
        var listy;
        switch(each.type){
            case 'group':
                if (curEle.type=='list'){
                    listy = document.createElement("option");
                    listy.innerHTML = each.label;
                    if(counter>0){listy.setAttribute('value',each.name+'-'+counter);} else listy.setAttribute('value',each.name);
                    addDrop.append(listy);
                } else if (curEle.type=='repeat') {
                    listy = document.createElement("option");
                    listy.innerHTML = each.label;
                    if(counter>0){listy.setAttribute('value',each.name+'-'+counter);} else listy.setAttribute('value',each.name);
                    rptDrop.append(listy);
                }
                thisEle = document.createElement("div");
                thisEle.className = 'rndGroup lv'+depth;
                if (depth>1){
                    if (curEle.type!='group') thisEle.setAttribute('style','display:none');
                }
                if(counter>0){thisEle.setAttribute('id',each.name+'-'+counter);} else thisEle.setAttribute('id',each.name);
                expandTable(each,thisEle,depth+1,counter);
                if (depth>0) docEle.append(thisEle);
                else {
                    thisEle.className += " visible";
                    tabArea.append(thisEle);
                }
                break;
            case 'repeat':
                if (curEle.type=='list'){
                    listy = document.createElement("option");
                    listy.innerHTML = each.label;
                    if(counter>0){listy.setAttribute('value',each.name+'-'+counter);} else listy.setAttribute('value',each.name);
                    addDrop.append(listy);
                }
                thisEle = document.createElement("div");
                thisEle.className = 'rndRepeatHome lv'+depth;
                if (depth>1){
                    if (curEle.type!='group') thisEle.setAttribute('style','display:none');
                }
                if(counter>0){thisEle.setAttribute('id',each.name+'-'+counter);} else thisEle.setAttribute('id',each.name);
                expandTable(each,thisEle,depth+1,counter);
                docEle.append(thisEle);
                break;
            case 'list':
                if (curEle.type=='list'){
                    listy = document.createElement("option");
                    listy.innerHTML = each.label;
                    if(counter>0){listy.setAttribute('value',each.name+'-'+counter);} else listy.setAttribute('value',each.name);
                    addDrop.append(listy);
                } else if (curEle.type=='repeat') {
                    listy = document.createElement("option");
                    listy.innerHTML = each.label;
                    if(counter>0){listy.setAttribute('value',each.name+'-'+counter);} else listy.setAttribute('value',each.name);
                    rptDrop.append(listy);
                }
                thisEle = document.createElement("div");
                thisEle.className = 'rndList';
                if (depth>1){
                    if (curEle.type!='group') thisEle.setAttribute('style','display:none');
                }
                if(counter>0){thisEle.setAttribute('id',each.name+'-'+counter);} else thisEle.setAttribute('id',each.name);
                expandTable(each,thisEle,depth+1,counter);
                docEle.append(thisEle);
                break;
            case 'single':
                if (curEle.type=='list'){
                    listy = document.createElement("option");
                    listy.innerHTML = each.label;
                    listy.setAttribute('value',each.name);
                    addDrop.append(listy);
                } else if (curEle.type=='repeat') {
                    listy = document.createElement("option");
                    listy.innerHTML = each.label;
                    listy.setAttribute('value',each.name);
                    rptDrop.append(listy);
                }
                break;
            default:
                break;
        }
    }
}

function buildResArea(){
    var contentDiv = document.getElementsByClassName('content')[0];
    
    var resArea = document.createElement("div");

    var randArea = document.createElement("form");
    randArea.setAttribute('action','javascript:randomiseIt()');

    var clickIt = document.createElement("input");
    clickIt.setAttribute('type','submit');
    clickIt.setAttribute('style','font-size:1.5em');
    clickIt.setAttribute('value','Randomise');
      
    randArea.append(clickIt);
    randArea.insertAdjacentHTML('beforeend', '<hr>');

    expandTable(randTable,randArea,0);
    
    resArea.append(randArea);
    contentDiv.append(resArea);
}

function randomiseIt(){
    for (let each of document.getElementsByTagName('select')){
        if(each.getAttribute('disabled')) continue;
        const rect = each.getBoundingClientRect();
        if (rect.height < 8) continue;
        var curDrop = document.getElementById('origin-setting-drop');
        var dropLength = each.length;
        var dropChoice = Math.floor(Math.random()*dropLength);
        var optChoice = each.children[dropChoice];
        each.value = optChoice.value;
        showChildren(each.parentElement.parentElement.getAttribute('id'));
    }
}

function showChildren(eleId){
    var curEle = document.getElementById(eleId);
    var curDrop = document.getElementById(eleId+'-drop');
    var targVal = curDrop.value;
    if (!(!parseInt(eleId.slice(-1)))){
        if (!parseInt(eleId.slice(-1))){
            console.log('eleId '+ eleId);
            console.log('targVal ' + targVal);
            targVal=targVal+'-'+eleId.slice(-1);
            console.log('new targVal ' + targVal);
        }
    }
    for (let each of curEle.children){
        if (each.getAttribute('id')==targVal){
            each.removeAttribute('style');
        } else {
            if (each.tagName=='DIV') each.setAttribute('style','display:none');
        }
    }
}

function repeats(eleId){
    var curEle = document.getElementById(eleId);
    var curCount = document.getElementById(eleId+'-counter');
    var targNum = curCount.value;
    for (let each = 1; each<=curCount.max;each++){
        if (each>targNum) document.getElementById(eleId+'-'+each).setAttribute('style','display:none');
        else document.getElementById(eleId+'-'+each).removeAttribute('style');
    }
}

function freezeDrop(eleId){
    var checkEle = document.getElementById(eleId);
    var dropId = eleId.substr(0,eleId.length-5) + 'drop';
    if (checkEle.checked){
        document.getElementById(dropId).setAttribute('disabled','disabled');
    } else {
        document.getElementById(dropId).removeAttribute('disabled');
    }
}

function tabSwitch(eleId){
    if (eleId=='all'){
        for (let each of document.getElementsByClassName('rndGroup')){
            if (!(each.getAttribute('id').includes("-"))){
                if (each.className.indexOf("visible")<0) each.className += " visible";
            }
        }
    } else {
        for (let each of document.getElementsByClassName('rndGroup')){
            if (each.id.includes("-")) continue;
            if (each.id != eleId) {
                if (each.className.indexOf("visible")>0) each.className = each.className.substring(-1,each.className.indexOf(" visible"));
            } else if (each.className.indexOf("visible")<0) each.className += " visible";
        }
    }
    for (let each of document.getElementById('tabs').children){
        if (each.innerHTML.includes(eleId.slice(1))) each.className = 'activeTabHead';
        else each.className = 'inactiveTabHead';
    }
    
}
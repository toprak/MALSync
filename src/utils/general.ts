export function urlPart(url:string, part:number){
  try{
      return url.split("/")[part].split("?")[0];
    }catch(e){
      return undefined;
    }

}

export function watching(type: "anime"|"manga"){
  if(type == "manga") return 'Reading';
  return 'Watching';
}

export function planTo(type: "anime"|"manga"){
  if(type == "manga") return 'Plan to Read';
  return 'Plan to Watch';
}

export function getMalUrl(identifier: string, title: string, page){
  if(typeof page.database == "undefined") return false;
  return firebase();

  function firebase(){
    var url = 'https://kissanimelist.firebaseio.com/Data2/'+page.database+'/'+encodeURIComponent(titleToDbKey(identifier)).toLowerCase()+'/Mal.json';
    con.log("Firebase", url);
    return api.request.xhr('GET', url).then((response) => {
      con.log("Firebase response",response.responseText);
      if(response.responseText !== 'null' && !(response.responseText.indexOf("error") > -1)){
        if(response.responseText.split('"')[1] == 'Not-Found'){
            return null;
        }
        return 'https://myanimelist.net/'+page.type+'/'+response.responseText.split('"')[1]+'/'+response.responseText.split('"')[3];;
      }else{
        return false;
      }
    });
  }

  //Helper
  function titleToDbKey(title) {
    if( window.location.href.indexOf("crunchyroll.com") > -1 ){
        return encodeURIComponent(title.toLowerCase().split('#')[0]).replace(/\./g, '%2E');
    }
    return title.toLowerCase().split('#')[0].replace(/\./g, '%2E');
  };
}

export function getselect(data, name){
    var temp = data.split('name="'+name+'"')[1].split('</select>')[0];
    if(temp.indexOf('selected="selected"') > -1){
        temp = temp.split('<option');
        for (var i = 0; i < temp.length; ++i) {
            if(temp[i].indexOf('selected="selected"') > -1){
                return temp[i].split('value="')[1].split('"')[0];
            }
        }
    }else{
        return '';
    }
}

export function absoluteLink(url, domain) {
  if (typeof url === "undefined") {
    return url;
  }
  if(!url.startsWith("http")) {
    url = domain + url;
  }
  return url;
};


//flashm
export function flashm(text, options?:{error?: boolean, type?: string, permanent?: boolean, hoverInfo?: boolean, position?: "top"|"bottom"}){
    if(!$('#flash-div-top').length){
        initflashm();
    }
    con.log("[Flash] Message:",text);

    var colorF = "#323232";
    if(typeof options !== 'undefined' && typeof options.error !== 'undefined' && options.error){
      var colorF = "#3e0808";
    }

    var flashdiv = '#flash-div-bottom';
    if(typeof options !== 'undefined' && typeof options.position !== 'undefined' && options.position){
      flashdiv = '#flash-div-'+options.position;
    }

    var messClass = "flash";
    if(typeof options !== 'undefined' && typeof options.type !== 'undefined' && options.type){
      var tempClass = "type-"+options.type;
      $(flashdiv+' .'+tempClass)
        .removeClass(tempClass)
        .fadeOut({
          duration: 1000,
          queue: false,
          complete: function() { $(this).remove(); }
        });

      messClass += " "+tempClass;
    }

    var mess = '<div class="'+messClass+'" style="display:none;">\
        <div style="display:table; pointer-events: all; padding: 14px 24px 14px 24px; margin: 0 auto; margin-top: 5px; max-width: 60%; -webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 2px;color: white;background:'+colorF+'; ">\
          '+text+'\
        </div>\
      </div>';

    if(typeof options !== 'undefined' && typeof options.hoverInfo !== 'undefined' && options.hoverInfo){
      messClass += " flashinfo";
      mess = '<div class="'+messClass+'" style="display:none; max-height: 5000px; margin-top: -8px;"><div style="display:table; pointer-events: all; margin: 0 auto; margin-top: -2px; max-width: 60%; -webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 2px;color: white;background:'+colorF+'; "><div style="max-height: 60vh; overflow-y: auto; padding: 14px 24px 14px 24px;">'+text+'</div></div></div>';
      $('#flashinfo-div').addClass('hover');
      var flashm = $(mess).appendTo('#flashinfo-div')
    }else{
      var flashm = $(mess).appendTo(flashdiv);
    }

    if(typeof options !== 'undefined' && typeof options.permanent !== 'undefined' && options.permanent){
      flashm.slideDown(800);
    }else if(typeof options !== 'undefined' && typeof options.hoverInfo !== 'undefined' && options.hoverInfo){
      flashm.slideDown(800).delay(4000).queue(function() { $('#flashinfo-div').removeClass('hover'); flashm.css('max-height', '8px');});
    }else{
      flashm.slideDown(800).delay(4000).slideUp(800, function() { $(this).remove(); });
    }
    return flashm;
}

export function flashConfirm(message, type, yesCall, cancelCall){
    message = '<div style="text-align: left;">' + message + '</div><div style="display: flex; justify-content: space-around;"><button class="Yes" style="background-color: transparent; border: none; color: rgb(255,64,129);margin-top: 10px; cursor:pointer;">OK</button><button class="Cancel" style="background-color: transparent; border: none; color: rgb(255,64,129);margin-top: 10px; cursor:pointer;">CANCEL</button></div>';
    var flasmessage = flashm(message, {permanent: true, position: "top", type: type});
    flasmessage.find( '.Yes' ).click(function(){
        $(this).parentsUntil('.flash').remove();
        yesCall();
    });
    flasmessage.find( '.Cancel' ).click(function(){
        $(this).parentsUntil('.flash').remove();
        cancelCall();
    });
}

function initflashm(){

    api.storage.addStyle('.flashinfo{\
                    transition: max-height 2s;\
                 }\
                 .flashinfo:hover{\
                    max-height:5000px !important;\
                    z-index: 2147483647;\
                 }\
                 .flashinfo .synopsis{\
                    transition: max-height 2s, max-width 2s ease 2s;\
                 }\
                 .flashinfo:hover .synopsis{\
                    max-height:9999px !important;\
                    max-width: 500px !important;\
                    transition: max-height 2s;\
                 }\
                 #flashinfo-div{\
                  z-index: 2;\
                  transition: 2s;\
                 }\
                 #flashinfo-div:hover, #flashinfo-div.hover{\
                  z-index: 2147483647;\
                 }\
                 \
                 #flash-div-top, #flash-div-bottom, #flashinfo-div{\
                    font-family: "Helvetica","Arial",sans-serif;\
                    color: white;\
                    font-size: 14px;\
                    font-weight: 400;\
                    line-height: 17px;\
                 }\
                 #flash-div-top h2, #flash-div-bottom h2, #flashinfo-div h2{\
                    font-family: "Helvetica","Arial",sans-serif;\
                    color: white;\
                    font-size: 14px;\
                    font-weight: 700;\
                    line-height: 17px;\
                    padding: 0;\
                    margin: 0;\
                 }\
                 #flash-div-top a, #flash-div-bottom a, #flashinfo-div a{\
                    color: #DF6300;\
                 }');

    $('body').after('<div id="flash-div-top" style="text-align: center;pointer-events: none;position: fixed;top:-5px;width:100%;z-index: 2147483647;left: 0;"></div>\
        <div id="flash-div-bottom" style="text-align: center;pointer-events: none;position: fixed;bottom:0px;width:100%;z-index: 2147483647;left: 0;"><div id="flash" style="display:none;  background-color: red;padding: 20px; margin: 0 auto;max-width: 60%;          -webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 20px;background:rgba(227,0,0,0.6);"></div></div>\
        <div id="flashinfo-div" style="text-align: center;pointer-events: none;position: fixed;bottom:0px;width:100%;left: 0;">');
}
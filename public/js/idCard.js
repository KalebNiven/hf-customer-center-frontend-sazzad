$(document).ready(() => {
    let url = location.href.replace(/\/$/, "");
   
    if (location.hash) {
      const hash = url.split("#");
      $('div[href="#tab'+hash[1]+'"]').tab("show");
      url = location.href.replace(/\/#/, "#tab");
      history.replaceState(null, null, url);
    } 
     
    $('div[data-toggle="tab"]').on("click", function() {
      let newUrl;
      const hash = $(this).attr("href");
      newUrl = url.split("#")[0] + hash;
      history.replaceState(null, null, newUrl);
    });
  });
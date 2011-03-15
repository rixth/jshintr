$(function () {
  function recalculateState() {
    if ($('#errors li').length === 0) {
      $('#kindaSorta').hide();
      $('#failed').hide();
      $('#passed').show();
    } else if ($('#errors li.skipped').length === $('#errors li').length) {
      $('#kindaSorta').show();
      $('#failed').hide();
      $('#passed').hide();
    } else {
      $('#kindaSorta').hide();
      $('#failed').show();
      $('#passed').hide();
    }
  }
  
  function updateUrl() {
    var skippedHashes = [];
    
    $('#errors li.skipped').each(function () {
      skippedHashes.push($(this).data('hash'));
    });
    
    var newUrl = location.href.replace(/((&|\?)skipped=([a-z0-9,]+))/, '');
    if (skippedHashes.length) {
      newUrl += (newUrl.indexOf('?') === -1 ? '?' : '&') + 'skipped=' + skippedHashes.join(',');
    }
    
    if ($('#errors li').length === 0 || newUrl !== location.href) {
      history.replaceState(null, "JSHintr", newUrl);
    }
  }
  
  function skip(error) {
    error.addClass('skipped');
    error.find('a').html('[unskip]');
  }
  
  function unskip(error) {
    error.removeClass('skipped');
    error.find('a').html('[skip]');
  }
  
  $('#errors').delegate('a.skipLink', 'click', function (event) {
    var error = $(this).closest('li');
    
    if (error.hasClass('parseError')) {
      alert('Sorry, you can\'t skip parse errors.');
    } else {
      if (error.hasClass('skipped')) {
        unskip(error);
      } else {
        skip(error);
      }      
    }
    
    recalculateState();
    updateUrl();
    event.preventDefault();
  });
  

  var skippedHashes = location.href.match(/skipped=([a-z0-9,]+)/);
  skippedHashes = skippedHashes ? skippedHashes[1].split(',') : [];
  $('#errors li').each(function () {
    if (skippedHashes.indexOf($(this).data('hash')) !== -1) {
      skip($(this));
    } else {
      unskip($(this));
    }
  });
  
  recalculateState();
  updateUrl();
});
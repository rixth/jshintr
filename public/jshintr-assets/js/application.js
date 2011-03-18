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
      var hash = $(this).data('hash');
      if (skippedHashes.indexOf(hash) === -1) {
        skippedHashes.push(hash);
      }
    });
    
    var newUrl = location.href.replace(/((&|\?)skipped=([a-z0-9,]+))/, '');
    if (skippedHashes.length) {
      newUrl += (newUrl.indexOf('?') === -1 ? '?' : '&') + 'skipped=' + skippedHashes.join(',');
    }
    
    if ($('#errors li').length === 0 || newUrl !== location.href) {
      history.replaceState(null, "JSHintr", newUrl);
    }
  }
  
  function skip(hash) {
    $('#errors li[data-hash=' + hash + ']').addClass('skipped').find('a').html('[unskip]');
  }
  
  function unskip(hash) {
    $('#errors li[data-hash=' + hash + ']').removeClass('skipped').find('a').html('[skip]');
  }
  
  $('#errors').delegate('a.skipLink', 'click', function (event) {
    var error = $(this).closest('li');
    
    if (error.hasClass('parseError')) {
      alert('Sorry, you can\'t skip parse errors.');
    } else {
      if (error.hasClass('skipped')) {
        unskip(error.data('hash'));
      } else {
        skip(error.data('hash'));
      }      
    }
    
    recalculateState();
    updateUrl();
    event.preventDefault();
  });
  

  var skippedHashes = location.href.match(/skipped=([a-z0-9,]+)/);
  skippedHashes = skippedHashes ? skippedHashes[1].split(',') : [];
  skippedHashes = skippedHashes.concat((skipped || "").split(','));
  
  $('#errors li').each(function () {
    if (skippedHashes.indexOf($(this).data('hash')) !== -1) {
      skip($(this).data('hash'));
    } else {
      unskip($(this).data('hash'));
    }
  });
  
  recalculateState();
  updateUrl();
});
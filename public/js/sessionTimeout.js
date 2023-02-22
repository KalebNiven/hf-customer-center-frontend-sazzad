
jQuery(function() {
    // Avoid calling these multiple times by using off() to remove old callbacks that may
    // be on the markup after asynchronous post backs.
    jQuery('#session-keep-signed-in').off('click').click(function() {
        SessionTimer.DoReset();
    });

    jQuery('#oktaLogoutUrl').off('click').click(function() {
        SessionTimer.DoTimeout();
    });
});

SessionTimer = {
    WarningInterval: $('#warningTimeInterval').val(),
    TimeoutInterval: $('#logoutTimeInterval').val(),
    alertTimerId: 1,
    logoutTimerId: 0,
    DoReset: function() {
        var routes = $.parseJSON($('#session-keep-signed-in').attr("route"));
        
        $.ajax({
           'method': 'POST',
            'url': routes.okta + '/lifecycle/refresh',
            'headers': {
                'Accept': 'application/json'
            },
            'xhrFields': {
                'withCredentials': true
            },
        });

        $.ajax({
          url: "/sessionKeepAlive",
          type: "GET",
          headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
          }
        })
        .done(function(data) {
          $('#sessionTimeoutModal').modal('hide');
          // clearTimeout(SessionTimer.alertTimerId);
          // clearTimeout(SessionTimer.logoutTimerId);
        });

        SessionTimer.Start();
    },
    Start: function() {
        // Using closures for the setTimeout functions allows us to check and, in effect, run only the latest
        // setTimeout callback in case any old ones were not cleared out after asynchronous post backs.
        var aid, lid;
        if (SessionTimer.WarningInterval > 0) {
            aid = SessionTimer.alertTimerId = setTimeout(
                function () {
                    if (aid === SessionTimer.alertTimerId) {
                        SessionTimer.ShowWarning();
                    }
                },
                SessionTimer.WarningInterval);
        }
        lid = SessionTimer.logoutTimerId = setTimeout(
                function () {
                    if (lid === SessionTimer.logoutTimerId) {
                        SessionTimer.DoTimeout();
                    }
                },
                SessionTimer.TimeoutInterval);
    },
    DoTimeout: function() {

            $('#sessionTimeoutModal').modal('hide');
            $('#processingModal').modal({backdrop: 'static', keyboard: false, show: true});
            var routes = $.parseJSON($('#oktaLogoutUrl').attr("route")); //okta routes
            $.ajax({
                method: 'DELETE',
                url: routes.okta,
                headers: {
                    'Accept': 'application/json'
                },
                xhrFields: {
                    'withCredentials': true
                },
                success: function (response) {
                },
                error: function (error) {
                    console.log(error);
                },
                complete: function () {
                    $.get(routes.local).then(function (result) {
                         // To Invalidate the Provider Widgets Redux Session
                        sessionStorage.removeItem(`persist:${window.location.host}_PROVIDER_APP`);
                        sessionStorage.removeItem("userLoggedIn");
                        window.location = '/login';
                         // To Invalidate the Provider Widgets Redux Session
                        sessionStorage.removeItem(`persist:${window.location.host}_PROVIDER_APP`);
                    }).fail(function (response) {
                        window.location = '/home';
                    });
                }
            });
    },
    ShowWarning: function() {
        $('#sessionTimeoutModal').modal('show');
        var count = 60, timer = setInterval(function() {
            $("#secondsLeft").html(count--);
            if(count == 1)
                clearInterval(timer);
        }, 1000);
    }
};
SessionTimer.Start();

$(document).ready(function () {
    $('a.logout-link, a.logout-link-xl').click(function() {
        // To Invalidate the Provider Widgets Redux Session
        sessionStorage.removeItem(`persist:${window.location.host}_PROVIDER_APP`);
        sessionStorage.removeItem("currentMemberId");
        sessionStorage.removeItem("userLoggedIn");
        analytics.reset();
        SessionTimer.DoTimeout();
    });

});

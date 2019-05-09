(function (w) {
    
    var container = {};

    var _newSC = function (a, b, c, d, e, f, g, h, i, j, k, x, v) {
        container.originalFunction(a, b, c, d, e, f, g, h, i, j, k, x, v);
        w.console.log("sc executed!");
        _process();
    };
    
    var _getRootDomain = function () {
        var a = "" + w.location.hostname;
        var b = a.split(".");
        var c = (/\.co\.|\.com\.|\.org\.|\.edu\.|\.net\.|\.asn\./.test(a)) ? 3 : 2;
        var d = b.splice(b.length - c, c).join(".");

        return d;
    };
    
    var _getCookieValue = function (cookieName) {
        var value = "; " + w.document.cookie;
        var parts = value.split("; " + cookieName + "=");
        if (parts.length === 2)
            return parts.pop().split(";").shift();
    };

    var _createCookie = function (cookieName, cookieValue) {
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 365);
        w.document.cookie = cookieName + "=" + cookieValue + ";domain=" + _getRootDomain() + ";path=/; expires=" + expireDate.toGMTString() + ";";
    };
    
    var _getKey = function (keyName) {
        return w["localStorage"].getItem(keyName);
    };

    var _saveKey = function (keyName, keyValue) {
        w["localStorage"].setItem(keyName, keyValue);
    };

    var _process = function() {
      
        var storage = _getKey("t_utag_main");
        var cookie = _getCookieValue("utag_main");
        
        if (cookie === undefined) {
            if (storage === null) {
                w.setTimeout(_process, 500);
            } else {
                var apoc = (new Date()).getTime().toString();
                var t = (storage + "").
                        replace(/ses_id:\d+%3Bexp-session/, "ses_id:" +  apoc + "%3Bexp-session").
                        replace(/_pn:\d+%3Bexp-session/, "_pn:1%3Bexp-session").
                        replace(/_sn:\d+/, "_pn:1").
                        replace(/_se:\d+/, "_se:1").
                        replace(/_ss:\d+/, "_ss:1").
                        replace(/_st:\d+/, "_st:" + apoc);
                _createCookie("utag_main", t);
            }
        } else {
            _saveKey("t_utag_main", cookie);
        }
        
    };
    
    var _overrideSC = function() {
        if(w.utag === undefined || 
            w.utag.loader === undefined || 
            w.utag.loader.SC === undefined ||
            typeof w.utag.loader.SC !== "function") {
            w.setTimeout(_overrideSC, 500);
            return;
        }

        container.originalFunction = w.utag.loader.SC;
        w.utag.loader.SC = _newSC;  
    };
    
    var _init = function () {
        
        _overrideSC();
        _process();

    };

    _init();

})(window);

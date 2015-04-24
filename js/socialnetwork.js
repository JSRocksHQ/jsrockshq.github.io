(function SocialNetwork() {

	/**
	 *
	 * FACEBOOK LIKE BUTTON
	 *
	 **/
	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s);
		js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	/**
	 *
	 * TWITTER SHARE BUTTON
	 *
	 **/
	! function(d, s, id) {
		var js,
			fjs = d.getElementsByTagName(s)[0],
			p = /^http:/.test(d.location) ? 'http' : 'https';

		if (!d.getElementById(id)) {
			js = d.createElement(s);
			js.id = id;
			js.src = p + '://platform.twitter.com/widgets.js';
			fjs.parentNode.insertBefore(js, fjs);
		}
	}(document, 'script', 'twitter-wjs');


	/**
	 *
	 * GOOGLE PLUS LIKE BUTTON
	 *
	 **/
	(function() {
		var po = document.createElement('script');

		po.type = 'text/javascript';
		po.async = true;
		po.src = 'https://apis.google.com/js/platform.js';

		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(po, s);
	})();


	/**
	 *
	 * DISQUS COMMENT
	 *
	 **/
	(function disqus(id) {
	   if (document.getElementById(id)) {
	        var disqus_shortname = 'es6rocks';

	        (function() {
	            var dsq = document.createElement('script');

	            dsq.type = 'text/javascript';
	            dsq.async = true;
	            dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';

	            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
	        })();
	    }
	})('disqus_thread');
})();
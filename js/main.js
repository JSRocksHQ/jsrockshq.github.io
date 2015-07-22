$(document).ready(function() {
	//Animations Timing
	setTimeout(function() { $(".logo").addClass("fadeIn")}, 100);

	setTimeout(function() { $(".search").addClass("slideLeft")}, 200);
	setTimeout(function() { $(".main-menu").addClass("slideRight")}, 200);

	setTimeout(function() { $(".row-button").addClass("slideUp")}, 500);

	setTimeout(function() { $(".row-down").addClass("slideDown")}, 600);
	setTimeout(function() { $(".item-post").addClass("fadeInBox")}, 600);
	setTimeout(function() { $(".row-comments").addClass("fadeInBox")}, 600);
	setTimeout(function() { $(".row-other-posts").addClass("fadeInBox")}, 600);
	setTimeout(function() { $(".header-article").addClass("slideUp")}, 600);
	setTimeout(function() { $(".article-content").addClass("slideUp")}, 600);

	setTimeout(function() { $(".testemonials").addClass("fadeInBox")}, 700);
	setTimeout(function() { $(".footer").addClass("slideUp")}, 700);
	setTimeout(function() { $(".row-more-posts").addClass("slideUp")}, 700);


	//Hoverbla Classes
	$(".button-post").hover(function() {
		$(this).toggleClass("button-thunder");
	});

	$(".input-search").hover(function () {
	  $(".icon-search-white").toggleClass("icon-search-hover");
	});

	$(".input-search").on('focus blur', function(){
    	$(".icon-search-white").toggleClass("icon-search-focus");
    	$(".icon-search").toggleClass("hide-bg");
	});

	$(".button-top").hover(function() {
		$(".button-top img").toggleClass("floating");
	});
});

var JsRocks = function() {
	'use strict';

	/**
	*
	* DEFINE
	*
	**/
	var	HARMONIC = new Harmonic(),
		W = window,
		D = document,
		PROTOCOL = W.location.protocol,
		HOST = W.location.host,
		HOSTNAME = W.location.hostname,
		PATHNAME = W.location.pathname,
		ORIGIN = W.location.origin,
		INFORMATIONS = {},
		TEMPLATE = {},
		JSROCKS = {},
		PRIVATE = {},
		PUBLIC = this,
		pageElements = {};


	/**
	*
	* DEFINE ELEMENTS
	*
	**/
	pageElements.btnMorePosts = D.getElementById('morePosts');
    pageElements.logo = D.querySelectorAll('.logo-jsrocks');


	/**
	*
	* GET INFORMATIONS
	*
	**/
	INFORMATIONS.lang = function () {
		var re = /\/pt-br\/|\/cn\//.exec(PATHNAME),
			lang;

		switch (re && re[0]) {
			case '/pt-br/':
				lang = 'pt-br';
				break;
			case '/cn/':
				lang = 'cn';
				break;
			default:
				lang = 'en';
				break;
		}

		return lang;
	};

	INFORMATIONS.categoryPath = function (lang) {
		var pathCategory;

		switch (lang) {
			case 'pt-br':
				pathCategory  = '/categories/pt-br/';
				break;
			case 'cn':
				pathCategory  = '/categories/cn/';
				break;
			default:
				pathCategory  = '/categories/';
				break;
		}

		return pathCategory;
	};


	/**
	*
	* TEMPLATE
	*
	**/
	TEMPLATE.article = function (postLink, date, origin, title, content, category, authorPicture, authorLink, authorName) {
		var tpl = '';

		tpl += '<article class="col-md-4 col-sm-6 col-xs-12 post-normal item-post post-fade-6">';
		tpl += '<div class="container-post">';
		tpl +=     '<aside class="share-post">';
		tpl +=         '<a href="#" data-provider="https://www.facebook.com/sharer.php?u=" data-post-url="/' + postLink + '" class="share-face share-item" title="Share this post"><img src="/images/icon-face-header.png" alt="icon facebook"></a>';
		tpl +=         '<a href="#" data-provider="https://twitter.com/intent/tweet?text=" data-post-url="/' + postLink + '" class="share-twitter share-item" title="Tweet this post"><img src="/images/icon-twitter-header.png" alt="icon twitter"></a>';
		tpl +=     '</aside>';
		tpl +=     '<div class="date-post">' + date + '</div>';
		tpl +=     '<h1 class="title-post"><a href="'+ origin + '/' + postLink + '">' + title + '</a></h1>';
		tpl +=     '<div class="intro-post">' + content + '</div>';
		tpl +=     '<section class="footer-post">';
		tpl +=         '<ul class="tags-post">' + category + '</ul>';
		tpl +=         '<div class="author-post">';
		tpl +=             '<div class="avatar-author"><img src="' + authorPicture + '" alt="avatar post"></div>';
		tpl +=             '<div class="info-author">';
		tpl +=                 '<span>Posted by</span>';
		tpl +=                 '<a href="' + authorLink + '" class="author">' + authorName + '</a>';
		tpl +=             '</div>';
		tpl +=         '</div>';
		tpl +=     '</section>';
		tpl += '</div>';
		tpl += '</article>';

		return tpl;
	};

	TEMPLATE.popularTag = function (tag) {
		var tpl = '';

		tpl += '<li class="item-list-tag">';
		tpl +=     '<a href="' + JSROCKS.categoryPath + tag + '">' + tag + '</a>';
		tpl += '</li>';

		return tpl;
	};


	/**
	*
	* PRIVATE
	*
	**/
	PRIVATE.googleSearch = function () {
		var form = D.getElementById('s');

		if (form) {
			form.addEventListener('submit', function(e) {
			    form.q.value = form.q.value + ' site:' + HOSTNAME.replace(/www./g, '');
			});
		}
	};

	PRIVATE.shareSocialnetwork = function () {
		var btnList = D.querySelectorAll('.share-item'),
			btnLen = btnList.length,
			btn,
			postUrl,
			providerUrl;

		if (!!btnLen) {
			for (var i = 0; i < btnLen; i++) {
				btn = btnList[i];
			    postUrl = btn.getAttribute('data-post-url');
			    providerUrl = btn.getAttribute('data-provider');

			    btn.setAttribute('href', providerUrl + PROTOCOL + '//' + HOST + postUrl);
			}
		}
	};

	PRIVATE.otherPosts = function () {
		var postsContainer = D.getElementById('otherPosts'),
			article = '',
			articleCat,
			post,
			categoriesLen,
			category;

		if (postsContainer) {
			for (var i = 0; i < 3; i++) {
				articleCat    = '';
				post 		  = JSROCKS.posts[i];
				categoriesLen = post.categories.length;

				for (var j = 0; j < categoriesLen; j++) {
				 	category = post.categories[j].toLowerCase().trim();
				 	articleCat += '<li class="item-tag-post"><a href="'+ ORIGIN + JSROCKS.categoryPath + category +'">' + category + '</a></li>\n';
				}

				article += TEMPLATE.article(post.link, post.date, ORIGIN, post.title, post.content, articleCat, post.authorPicture, post.authorLink, post.authorName);
			}

			postsContainer.innerHTML = article;
		}
	};

	PRIVATE.morePosts = function () {
		var postsContainer = D.getElementById('containerMorePosts'),
			posts = JSROCKS.posts,
			post,
			article,
			articleCat,
			categoriesLen,
			category;

		posts.splice(0, 8);

		if (postsContainer && pageElements.btnMorePosts) {

			pageElements.btnMorePosts.addEventListener('click', function(){
				article = '';

				if (posts.length >= 6) {
					for (var i = 0; i < 6; i++) {
						articleCat    = '';
						post 		  = posts[i];
						categoriesLen = post.categories.length;

						for (var j = 0; j < categoriesLen; j++) {
						 	category = post.categories[j].toLowerCase().trim();
						 	articleCat += '<li class="item-tag-post"><a href="'+ ORIGIN + JSROCKS.categoryPath + category +'">' + category + '</a></li>\n';
						}

						article += TEMPLATE.article(post.link, post.date, ORIGIN, post.title, post.content, articleCat, post.authorPicture, post.authorLink, post.authorName);
					}

					postsContainer.innerHTML = article;
					posts.splice(0, 6);
				} else {

					for (var i = 0; i < posts.length; i++) {
						articleCat    = '';
						post 		  = posts[i];
						categoriesLen = post.categories.length;

						for (var j = 0; j < categoriesLen; j++) {
						 	category = post.categories[j].toLowerCase().trim();
						 	articleCat += '<li class="item-tag-post"><a href="'+ ORIGIN + JSROCKS.categoryPath + category +'">' + category + '</a></li>\n';
						}

						article += TEMPLATE.article(post.link, post.date, ORIGIN, post.title, post.content, articleCat, post.authorPicture, post.authorLink, post.authorName);
					}

					postsContainer.innerHTML = article;
					posts.splice(0, posts.length);
				}

				if (posts.length === 0) {
					pageElements.btnMorePosts.style.display = 'none';
				}

				$('.item-post').addClass('fadeInBox');
			});

		}
	}

	PRIVATE.popularTag = function () {
		var arr = ['modules' ,'scope', 'tutorial'],
			arrLen = arr.length,
			str = '',
			container = D.querySelectorAll('.list-tags');

		if (!!container.length) {
			for (var i = 0; i < arrLen ; i++) {
				str += TEMPLATE.popularTag(arr[i]);
			}

			container[0].innerHTML = str;
		}
	};


	/**
	*
	* PUBLIC
	*
	**/
	PUBLIC.scrollTop = function (btn, event, posTop, time) {
		var btn = D.getElementById(btn);

		if (btn) {
			btn.addEventListener(event, function () {
			    $('html, body').animate({scrollTop: posTop}, time);
			});
		}
	};

	PUBLIC.init = function () {
		/**
		*
		* HARMONIC INFO SET
		*
		**/
		JSROCKS.lang = INFORMATIONS.lang();
		JSROCKS.posts = HARMONIC.getPosts()[JSROCKS.lang];
		JSROCKS.categoryPath = INFORMATIONS.categoryPath(JSROCKS.lang);


        /**
		*
		* INIT
		*
		**/
		if (pageElements.btnMorePosts && PATHNAME.match(/categories/gi)) {
			pageElements.btnMorePosts.style.display = 'none';
		}

        if (!!pageElements.logo.length) {
            for (var i = 0, els = pageElements.logo.length; i < els; i++) {
                if (JSROCKS.lang !== 'en') {
                    pageElements.logo[i].setAttribute('href', ORIGIN + '/' + JSROCKS.lang);
                }
            }
        }

		PRIVATE.popularTag();
		PRIVATE.googleSearch();
		PRIVATE.otherPosts();
		PRIVATE.morePosts();
		PRIVATE.shareSocialnetwork();

		PUBLIC.scrollTop('goToTop', 'click', 0, 1000);

	};

	return PUBLIC;
};


var jsRocks = new JsRocks();
jsRocks.init();

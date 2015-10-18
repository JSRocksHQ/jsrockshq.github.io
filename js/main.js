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

(function JSRocks() {
	'use strict';

	/**
	*
	* DEFINE
	*
	**/
    var PROTOCOL      = window.location.protocol;
    var HOST          = window.location.host;
    var HOSTNAME      = window.location.hostname;
    var PATHNAME      = window.location.pathname;
    var ORIGIN        = window.location.origin;
    var HARMONIC      = new Harmonic();
    var INFORMATIONS  = {};
    var TEMPLATE      = {};
    var JSROCKS       = {};
    var PAGEELEMENTS  = {};

    /**
	*
	* DEFINE ELEMENTS
	*
	**/
	PAGEELEMENTS.btnMorePosts = document.getElementById('morePosts');
    PAGEELEMENTS.logo = document.querySelectorAll('.logo-jsrocks');

    /**
    *
    * INFORMATIONS METHODS
    *
    **/
	INFORMATIONS.lang = function() {
		var re = /\/pt-br\/|\/cn\//.exec(PATHNAME);
		var	lang;

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

	INFORMATIONS.categoryPath = function(lang) {
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
	TEMPLATE.article = function(postLink, date, origin, title, content, category, authorPicture, authorLink, authorName) {
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

	TEMPLATE.popularTag = function(tag) {
		var tpl = '';

		tpl += '<li class="item-list-tag">';
		tpl +=     '<a href="' + JSROCKS.categoryPath + tag + '">' + tag + '</a>';
		tpl += '</li>';

		return tpl;
	};

    /**
	*
	* FUNCTIONS
	*
	**/
	function googleSearch() {
		var form = document.getElementById('s');

		if (form) {
			form.addEventListener('submit', function(e) {
			    form.q.value = form.q.value + ' site:' + HOSTNAME.replace(/www./g, '');
			});
		}
	};

	function shareSocialnetwork() {
		var btnList = document.querySelectorAll('.share-item');
		var	btnLen = btnList.length;
		var	btn;
		var	postUrl;
		var	providerUrl;

		if (!!btnLen) {
			for (var i = 0; i < btnLen; i++) {
				btn = btnList[i];
			    postUrl = btn.getAttribute('data-post-url');
			    providerUrl = btn.getAttribute('data-provider');

			    btn.setAttribute('href', providerUrl + PROTOCOL + '//' + HOST + postUrl);
			}
		}
	};

	function otherPosts() {
		var postsContainer = document.getElementById('otherPosts');
		var	article = '';
		var	articleCat;
		var	post;
		var	categoriesLen;
		var	category;

		if (postsContainer) {
			for (var i = 0; i < 3; i++) {
				articleCat    = '';
				post 		  = JSROCKS.posts[i];
				categoriesLen = post.categories.length;

				for (var j = 0; j < categoriesLen; j++) {
				 	category = post.categories[j].toLowerCase().trim();
				 	articleCat += '<li class="item-tag-post"><a href="'+ ORIGIN + JSROCKS.categoryPath + category +'">' + category + '</a></li>\n';
				}

                console.log('POST');
                console.log(post);
                console.log(' ');

				article += TEMPLATE.article(post.link, post.date, ORIGIN, post.title, post.content, articleCat, post.authorPicture, post.authorLink, post.authorName);
			}

			postsContainer.innerHTML = article;
		}
	};

	function morePosts() {
		var postsContainer = document.getElementById('containerMorePosts');
		var	posts = JSROCKS.posts;
		var	post;
		var	article;
		var	articleCat;
		var	categoriesLen;
		var	category;

		posts.splice(0, 8);

		if (postsContainer && PAGEELEMENTS.btnMorePosts) {

			PAGEELEMENTS.btnMorePosts.addEventListener('click', function(){
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
					PAGEELEMENTS.btnMorePosts.style.display = 'none';
				}

				$('.item-post').addClass('fadeInBox');
			});

		}
	}

	function popularTag() {
		var arr = ['modules' ,'scope', 'tutorial'];
		var	arrLen = arr.length;
		var	str = '';
		var	container = document.querySelectorAll('.list-tags');

		if (!!container.length) {
			for (var i = 0; i < arrLen ; i++) {
				str += TEMPLATE.popularTag(arr[i]);
			}

			container[0].innerHTML = str;
		}
	};

	function scrollTop(btn, event, posTop, time) {
		var btn = document.getElementById(btn);

		if (btn) {
			btn.addEventListener(event, function () {
			    $('html, body').animate({scrollTop: posTop}, time);
			});
		}
	};

    /**
    *
    * INIT
    *
    **/

    // HARMONIC INFO SET
	JSROCKS.lang = INFORMATIONS.lang();
	JSROCKS.posts = HARMONIC.getPosts()[JSROCKS.lang];
	JSROCKS.categoryPath = INFORMATIONS.categoryPath(JSROCKS.lang);

    if (PAGEELEMENTS.btnMorePosts && PATHNAME.match(/categories/gi)) {
		PAGEELEMENTS.btnMorePosts.style.display = 'none';
	}

    if (!!PAGEELEMENTS.logo.length) {
        for (var i = 0, els = PAGEELEMENTS.logo.length; i < els; i++) {
            if (JSROCKS.lang !== 'en') {
                PAGEELEMENTS.logo[i].setAttribute('href', ORIGIN + '/' + JSROCKS.lang);
            }
        }
    }

	popularTag();
	googleSearch();
	otherPosts();
	morePosts();
	shareSocialnetwork();

	scrollTop('goToTop', 'click', 0, 1000);
})();

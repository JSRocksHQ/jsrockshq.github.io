(function es6rocks() {

	'use strict';

	var W = window,
		D = document,
		BODY = D.getElementsByTagName('body')[0],
		ARTICLE = D.querySelector('.article-content'),
		scrolling = false,
		scrollSlowlyTo;

	var dskComments = function() {

		var disqus_shortname = 'es6rocks';

		(function() {
			var dsq = document.createElement('script');

			dsq.type = 'text/javascript';
			dsq.async = true;
			dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';

			(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
		})();

	};

	var controlIconsBtn = function(number) {
		var btn,
			btnClasses,
			btns = {
				fontUp: D.querySelector('.font-up'),
				fontDown: D.querySelector('.font-down'),
				contrast: D.querySelector('.contrast'),
				comments: D.querySelector('.comments'),
			},
			defaultTypograph = {
				fz: '16px',
				lw: '26px'
			};

		for (btn in btns) {
			btns[btn].addEventListener('click', function() {
				btnClasses = this.className.split(' ')[1];

				switch (btnClasses) {
					case 'font-up':
						fontUp(getBodyFontProperty().fz, getBodyFontProperty().lw);
						break;
					case 'font-down':
						fontDown(getBodyFontProperty().fz, getBodyFontProperty().lw);
						break;
					case 'contrast':
						fontContrast(ARTICLE);
						break;
					case 'comments':
						scrollSlowlyTo(getCommentsPosition(), 1200);
						break;
				}
			}, true);
		}

		var getBodyFontProperty = function() {
			var bodyFZ = W.getComputedStyle(ARTICLE, null).getPropertyValue('font-size').split('px')[0],
				bodyLW = W.getComputedStyle(ARTICLE, null).getPropertyValue('line-height').split('px')[0],
				styleComputed = {
					fz: Number(bodyFZ),
					lw: Number(bodyLW)
				};

			return styleComputed;
		};

		var fontUp = function(fz, lw) {
			ARTICLE.style.fontSize = (fz + number) + 'px';
			ARTICLE.style.lineHeight = (lw + number) + 'px';
		};

		var fontDown = function(fz, lw) {
			ARTICLE.style.fontSize = (fz - number) + 'px';
			ARTICLE.style.lineHeight = (lw - number) + 'px';
		};

		var fontContrast = function(elemment) {
			var elClasses = elemment.classList;
			elemment.classList.toggle('contrasted');
		};
	};

	var getCommentsPosition = function() {
		return D.querySelector('.comments.wrapper').offsetTop + 365;
	};

	var scrollStep = function(whereTo, steps, stepTime, stepSize, curStep) {
		curStep++;

		W.scrollBy(0, stepSize);

		if (curStep >= steps) {
			scrolling = false;
			W.scrollTo(0, whereTo);
			return false;
		}

		setTimeout(function() {
			scrollStep(whereTo, steps, stepTime, stepSize, curStep);
		}, stepTime);

		console.log('## scrollStep');
	};

	scrollSlowlyTo = function(to, time) {
		console.log('## scrollSlowlyTo');

		var stepTime = 42,
			stepsNumber;

		if (scrolling) {
			return false;
		}

		to = to || 0;
		time = time || 1000;

		stepsNumber = time / stepTime

		var curTop = W.scrollY,
			topLimit = D.documentElement.offsetHeight,
			distance = to - curTop,
			stepSize = Math.floor(distance / stepsNumber);

		scrolling = true;
		scrollStep(to, stepsNumber, stepTime, stepSize, 0);
	};

	/**
	 *
	 * START FUNCTIONS
	 *
	 **/
	(function __init__() {
		controlIconsBtn(2);
		dskComments();

		D.querySelector('.btn-goToTop').addEventListener('click', function() {
			scrollSlowlyTo(0, 1200);
		}, true);
	})();

})();
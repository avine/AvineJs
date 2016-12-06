/* Avine. Copyright (c) 2013-2015 S. Francel (http://avine.fr). Dual licensed under the MIT and GPL Version 2 licenses. */

var ut = (function () {
	var scripts = [], ut = function (script) {
		scripts.push(script || function () {});
	};
	ut.get = function (index) {
		return undefined === index ? scripts : scripts[index];
	};
	return ut;
})();

(function ($) {

	var clean = function (string) {
		return string.replace(/^\s+|\s+$/g, '').replace(/\t/g, '    ');
	};

	$.dom.ready(function () {

		$('.ut').each(function (index) {

			var $ut = $(this).addClass('ut-show'),
				$code = $ut.find('.ut-code'),
				$html = $ut.find('.ut-html'),
				$run = $ut.find('.ut-run'),
				$log = $ut.find('.ut-log');

			// Script
			var script = ut.get(index), code = clean($code.text()), html = '';

			if (code) {
				// Static code
				$code.html('');
			} else {
				// Dynamic code
				code = (script || '').toString().split('\n');
				code.shift();
				code.pop();
				code = clean(code.join('\n'));
				if (code) code = '<script>\n' + code + '\n<' + '/script>';

				// Dynamic html
				html = clean($html.size() ? $html.html() : '');
			}
			// Merge code and html
			$code.append('<code class="language-markup">'); // For prism code highlighter
			$code.children().text(html + (html && code ? '\n\n' : '') + code);

			// Run
			var once = ('yes' == $run.data('once')), run = function (e) {
				$log.addClass('ut-show');
				var log = function (log) { $log.html($log.html() + log + '<br />'); },
					root = $html.find('.root').get(0);
				script(log, root);
				if (once) $run.remove();
				if (e) e.preventDefault();
			};
			$run.size() ? $run.on('click', run, once) : setTimeout(run, 80);

			// Toggle
			var $toggle = $('<a href="#" class="ut-toggle"></a>').click(function (e) {
				$toggle.toggleClass('ut-hide');
				$ut.toggleClass('ut-show');
				e.preventDefault();
			});
			$ut.before($toggle);

			// Toggle max-height
			$code.on('click', function () {
				$code.toggleClass('ut-endless');
			});
		});

		// Open/close all
		$('.ut-trigger').css('visibility', 'visible').click(function (e) {
			var $trigger = $(this), hide = !$trigger.hasClass('ut-trigger-close');
			$('.ut-toggle').each(function () {
				var $toggle = $(this), hidden = $toggle.hasClass('ut-hide');
				if (hide !== hidden) $toggle.trigger('click');
			});
			$trigger.toggleClass('ut-trigger-close');
			e.preventDefault();
		});

	});

})(avine.$);

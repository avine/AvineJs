// Unit-test behaviour

// DEPRECATED...

function ut(script) { setTimeout(script, 100); } // Wait for the next DOM repaint

$.dom.ready(function () {
	$('.ut').each(function () {
		var $this = $(this),
			$area = $this.find('.ut-area'),
			$code = $this.find('.ut-code'),
			$samp = $this.find('.ut-samp');
		var $areaSamp = $area.find('samp').addClass('ut-samp');
		if ($areaSamp.size()) $samp.replace($areaSamp.remove());

		$this.css('visibility', 'visible');

		// For prism code highlighter
		$code = $code.append('<code class="language-markup">').children();

		$code.text(($area.html() || '')
			.replace(/<script>\s*ut\(function\s*\(\)\s*\{\s*/i, '<script>\n')
			.replace(/\s*\}\);\s*<\/script>/i, '\n</script>')
			.replace(/^\s+|\s+$/g, '')
			.replace(/\t/g, '    ')
		);
		$this.before($('<a href="#" class="ut-toggle"></a>').click(function (e) {
			$(this).toggleClass('ut-toggle-hide').next().toggleClass('hide');
			e.preventDefault();
		}).get(0));
	});

	$('.ut-trigger').css('visibility', 'visible').click(function (e) {
		var $trigger = $(this), hide = !$trigger.hasClass('ut-trigger-close');
		$('.ut-toggle').each(function () {
			var $toggle = $(this), hidden = $toggle.hasClass('ut-toggle-hide');
			if (hide !== hidden) $toggle.trigger('click');
		});
		$trigger.toggleClass('ut-trigger-close');
		e.preventDefault();
	});

	// Table of contents
	var $index = $('<ul>');
	$('h2').each(function () {
		var $h2 = $(this), index = $h2.data('index');
		if (!index) {
			index = $.tool.splitString($h2.text(), '(')[0];
			index = index.replace(/\s+/g, '-');
		}
		$h2.attr('id', index);
		var html = ($h2.find('a').size() ? $h2.children() : $h2).html();
		$index.append($('<li>').append($.dom.create({
			tag: 'a', content: html, href: '#' + index
		})));
	});
	$('#index').append($index).css('display', 'block');
});

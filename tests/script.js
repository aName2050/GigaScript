var btn = document.getElementById('buildTree');
var txtarea = document.getElementById('ASTInput');

var clear = document.getElementById('clear');

var container = document.getElementById('ast-container');

var HTML_BUILD_STARTED = false;

btn.addEventListener(
	'click',
	function () {
		if (!txtarea.value) return alert('an input is required');
		HTML_BUILD_STARTED = true;
		container.innerHTML = buildHTMLFromAST(JSON.parse(txtarea.value));
	},
	false
);

clear.addEventListener(
	'click',
	function () {
		container.innerHTML = '';
		txtarea.value = '';
		HTML_BUILD_STARTED = false;
	},
	false
);

var OPEN_BRACE = '&#123;';
var CLOSE_BRACE = '&#125;';
var OPEN_BRACKET = '&#91;';
var CLOSE_BRACKET = '&#93;';

function buildHTMLFromAST(rawAST) {
	var html = '<ul>';
	html += `
	<li class="entry toggleable open">
		<span class="value" id="program">Program</span>
		<span class="prefix p">${OPEN_BRACE}</span>
		<ul class="value-body">`;

	for (var key in rawAST) {
		if (typeof rawAST[key] == 'object') {
			var nodeIsArray = Array.isArray(rawAST[key]);

			if (nodeIsArray) {
				// if there is an array of nodes within
				// the current node
				// TODO:
			} else {
				// if the node is just an object
				html += buildHTMLFromAST(rawAST[key]);
			}
		} else {
			// handle keys with only a simple value
			html += `
			<li class="entry">
				<span class="key">
					<span class="name">${key}</span>
					<span class="p">:&nbsp;</span>
				</span>
				<span class="value">
					<span class="s">"${rawAST[key]}"</span>
				</span>
			</li>`;
		}
	}

	html += `
		</ul>
		<span class="suffix p">${CLOSE_BRACE}</span>
	</li>
</ul>`;
	return html;
}

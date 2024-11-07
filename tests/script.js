var btn = document.getElementById('buildTree');
var txtarea = document.getElementById('ASTInput');

var clear = document.getElementById('clear');

var container = document.getElementById('ast-container');

btn.addEventListener(
	'click',
	function () {
		if (!txtarea.value) return alert('an input is required');
		container.innerHTML = buildHTMLFromAST(JSON.parse(txtarea.value));
	},
	false
);

clear.addEventListener(
	'click',
	function () {
		container.innerHTML = '';
		txtarea.value = '';
	},
	false
);

function buildHTMLFromAST(ast) {
	alert('not implemented');
	throw 'not implemented';
}

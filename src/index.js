// window.onload = function () {
//   alert(2)
//   document.getElementById('btn').addEventListener('click', function () {
//     var str = dsBridge.call("testSyn", "testSyn");
//     alert(str)
//     dsBridge.call('testAsyn', "testAsyn", function (v) {
//       alert(v)
//     })
//   })
// }

function component() {
  const element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());
window.onload = function () {
  document.getElementById('btn').addEventListener('click', function () {
    var str = dsBridge.call("testSyn","testSyn");
    alert(str)
    dsBridge.call('testAsyn', "testAsyn", function (v) {
      alert(v)
    })
  })
}
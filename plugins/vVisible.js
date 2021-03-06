import Vue from "vue";

export default Vue.directive("visible", (el, binding) => {
  var value = binding.value;

  if (!!value) {
    el.style.visibility = "visible";
  } else {
    el.style.visibility = "hidden";
  }
});

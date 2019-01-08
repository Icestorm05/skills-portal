declare module '*.vue' {
  import Vue from 'vue';
  const _default: typeof Vue;
  export default _default;
}

declare module "*.json" {
  const value: any;
  export default value;
}

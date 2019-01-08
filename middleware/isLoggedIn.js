export default ({ store, redirect, route }) => {
  if (!store.getters["auth/isLoggedIn"]) {
    redirect(`/login?redirect=${route.path}`);
  }
};

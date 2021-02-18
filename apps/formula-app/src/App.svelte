<script>
  import Router from 'svelte-spa-router'

  import Home from './pages/Home.svelte'
  import LoginForm from './pages/SignupForm.svelte'

 const routes = {
   '/': Home,
   '/login-form': LoginForm
 }
</script>

<Router {routes}/>


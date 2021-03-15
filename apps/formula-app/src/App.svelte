<script>
  import Router from 'svelte-spa-router';

  import BasicForm from './e2e/BasicForm.svelte';
  import CustomValidity from './e2e/CustomValidity.svelte';
  import FormEnrichment from './e2e/FormEnrichment.svelte';
  import FormValidity from './e2e/FormValidity.svelte';
  // import Home from './pages/Home.svelte'
  // import LoginForm from './pages/SignupForm.svelte'
  // import App2 from './pages/App2.svelte'
  // import Table from './pages/Table.svelte'
  // import WeePage from './pages/WeePage.svelte'

  const routes = {
    '/test-1': BasicForm,
    '/test-2': CustomValidity,
    '/test-3': FormEnrichment,
    '/test-4': FormValidity,
    // '/': Home,
    // '/login-form': LoginForm,
    // '/app2': App2,
    // '/table': Table,
    // '/wee-page': WeePage
  };
</script>

<Router {routes} />


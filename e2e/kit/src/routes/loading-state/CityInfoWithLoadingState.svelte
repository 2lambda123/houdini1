<script lang="ts">
  import { fragment, graphql, PendingValue, type CityInfoWithLoadingState } from '$houdini';

  export let city: CityInfoWithLoadingState;

  $: data = fragment(
    city,
    graphql(`
      fragment CityInfoWithLoadingState on City {
        id
        libraries @loading {
          id
          name
        }
      }
    `)
  );
</script>

<ul>
  {#each $data.libraries as library}
    <li>
      {#if library === PendingValue}
        loading...
      {:else}
        {library?.name}
      {/if}
    </li>
  {/each}
</ul>

<div id="result">
  {JSON.stringify($data.libraries)}
</div>

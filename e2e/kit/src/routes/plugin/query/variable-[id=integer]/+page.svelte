<script lang="ts">
  import { graphql } from '$houdini';

  $: result = graphql(`
    query PreprocessorTestQueryVars($id: ID!) @load {
      user(id: $id, snapshot: "preprocess-query-variable") {
        name
      }
    }
  `);
</script>

<div id="result">
  {$result?.data?.user.name}
</div>

<div id="variables">
  {JSON.stringify($result?.variables)}
</div>

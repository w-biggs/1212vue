<script>
export default {
  fetch({ redirect, store }) {
    const { current } = store.state.games;
    return redirect(`/scores/${current.season}/${current.week}/`);
  },
};
</script>

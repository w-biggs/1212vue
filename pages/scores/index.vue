<script>
export default {
  fetch({ redirect, store }) {
    const current = store.state.games.current;
    console.log(current);
    return redirect(`/scores/${current.season}/${current.week}/`);
  },
};
</script>

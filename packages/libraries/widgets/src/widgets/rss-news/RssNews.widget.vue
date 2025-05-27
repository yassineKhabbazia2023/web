<template>
  <!-- Temporary HTML/CSS for demonstration purpose -->
  <!-- TO BE DELETED -->
  <div class="widget-rss-news height--100">
    <section>
      <p style="height:150px;background-color:#dedede;" />
      <p style="height:15px;width:75px;margin: 8px 0;background-color:#dedede;" />
      <p style="height:25px;width:175px;background-color:black;" />
      <br>
      <p style="height:25px;background-color:#dedede;" />
      <p style="height:25px;background-color:#dedede;" />
      <p style="height:25px;background-color:#dedede;" />
      <p style="height:25px;background-color:#dedede;" />
    </section>
    <section>
      <p style="height:150px;background-color:#dedede;" />
      <p style="height:15px;width:95px;margin: 8px 0;background-color:#dedede;" />
      <p style="height:25px;width:110px;background-color:black;" />
      <br>
      <p style="height:25px;background-color:#dedede;" />
      <p style="height:25px;background-color:#dedede;" />
      <p style="height:25px;background-color:#dedede;" />
      <p style="height:25px;background-color:#dedede;" />
    </section>
    <section>
      <p style="height:150px;background-color:#dedede;" />
      <p style="height:15px;width:65px;margin: 8px 0;background-color:#dedede;" />
      <p style="height:25px;width:150px;background-color:black;" />
      <br>
      <p style="height:25px;background-color:#dedede;" />
      <p style="height:25px;background-color:#dedede;" />
      <p style="height:25px;background-color:#dedede;" />
      <p style="height:25px;background-color:#dedede;" />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.widget-rss-news {
  display: grid;
  grid-template-columns: repeat(3, minmax(150px, 1fr));
  grid-gap: 16px;
}
</style>

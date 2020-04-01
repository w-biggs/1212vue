// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';
import Highcharts from 'highcharts';
import Arearange from 'highcharts/highcharts-more';
import Accessibility from 'highcharts/modules/accessibility';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import Debugger from 'highcharts/modules/debugger';
import HighchartsVue from 'highcharts-vue';

Vue.use(HighchartsVue, Arearange);

Arearange(Highcharts);
Accessibility(Highcharts);
Exporting(Highcharts);
ExportData(Highcharts);
Debugger(Highcharts);

/**
 * Plugin to allow plot band Z indexes in between series
 */
Highcharts.wrap(Highcharts.PlotLineOrBand.prototype, 'render', function plotLine(proceed) {
  const { chart } = this.axis;

  proceed.call(this);

  if (!chart.seriesGroup) {
    chart.seriesGroup = chart.renderer.g('series-group')
      .attr({ zIndex: 3 })
      .add();
  }

  if (this.svgElem.parentGroup !== chart.seriesGroup) {
    this.svgElem
      .attr({ zIndex: this.options.zIndex })
      .add(chart.seriesGroup);
  }
  return this;
});
